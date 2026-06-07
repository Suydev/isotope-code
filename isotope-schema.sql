-- ============================================================================
-- IsotopeAI — Self-Hosted Database Schema v2
-- ============================================================================
-- Safe to run multiple times (fully idempotent).
-- Paste the ENTIRE file into Supabase SQL Editor → Run.
--
-- What this script does:
--   1. Adds missing columns to existing tables (username, coins, gems, etc.)
--   2. Creates new tables: notifications, user_presence
--   3. Creates/replaces the new-user trigger (sets plan=ranker + username)
--   4. Creates/replaces all RPC functions (leaderboard, invites, premium check)
--   5. Enables RLS with self-hosted-friendly policies
--   6. Creates performance indexes
--   7. Backfills existing users (ranker plan, username, presence rows)
-- ============================================================================

-- ── 1. Extend existing tables ─────────────────────────────────────────────

-- users: add username, coins, gems
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS username        text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS coins           integer NOT NULL DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS gems            integer NOT NULL DEFAULT 0;

-- users: ensure plan columns exist and have proper defaults
ALTER TABLE public.users ALTER COLUMN plan_type      SET DEFAULT 'ranker';
ALTER TABLE public.users ALTER COLUMN billing_status SET DEFAULT 'active';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS plan_expires_at  timestamptz DEFAULT '2099-12-31 23:59:59+00';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS access_ends_at   timestamptz DEFAULT '2099-12-31 23:59:59+00';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS updated_at       timestamptz NOT NULL DEFAULT now();

-- user_profiles: JSONB profile_data is the app's canonical onboarding store
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS profile_data jsonb       NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS updated_at  timestamptz NOT NULL DEFAULT now();

-- user_points: leaderboard columns
ALTER TABLE public.user_points ADD COLUMN IF NOT EXISTS points          integer     NOT NULL DEFAULT 0;
ALTER TABLE public.user_points ADD COLUMN IF NOT EXISTS lifetime_points integer     NOT NULL DEFAULT 0;
ALTER TABLE public.user_points ADD COLUMN IF NOT EXISTS updated_at      timestamptz NOT NULL DEFAULT now();

-- user_stats_summary: aggregate stats
ALTER TABLE public.user_stats_summary ADD COLUMN IF NOT EXISTS total_study_seconds bigint      NOT NULL DEFAULT 0;
ALTER TABLE public.user_stats_summary ADD COLUMN IF NOT EXISTS streak_days         integer     NOT NULL DEFAULT 0;
ALTER TABLE public.user_stats_summary ADD COLUMN IF NOT EXISTS max_streak_days     integer     NOT NULL DEFAULT 0;
ALTER TABLE public.user_stats_summary ADD COLUMN IF NOT EXISTS session_count       integer     NOT NULL DEFAULT 0;
ALTER TABLE public.user_stats_summary ADD COLUMN IF NOT EXISTS last_study_date     date;
ALTER TABLE public.user_stats_summary ADD COLUMN IF NOT EXISTS updated_at          timestamptz NOT NULL DEFAULT now();

-- group_members: role and join timestamp
ALTER TABLE public.group_members ADD COLUMN IF NOT EXISTS role      text        NOT NULL DEFAULT 'member';
ALTER TABLE public.group_members ADD COLUMN IF NOT EXISTS joined_at timestamptz NOT NULL DEFAULT now();

-- Unique constraint on (group_id, user_id) for group_members
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.group_members'::regclass
      AND conname   = 'group_members_group_id_user_id_key'
  ) THEN
    ALTER TABLE public.group_members
      ADD CONSTRAINT group_members_group_id_user_id_key UNIQUE (group_id, user_id);
  END IF;
END $$;

-- group_chat_messages: message type, reply threading, soft delete
ALTER TABLE public.group_chat_messages ADD COLUMN IF NOT EXISTS message_type text        NOT NULL DEFAULT 'text';
ALTER TABLE public.group_chat_messages ADD COLUMN IF NOT EXISTS reply_to_id  uuid;
ALTER TABLE public.group_chat_messages ADD COLUMN IF NOT EXISTS deleted_at   timestamptz;

-- groups: visibility, limits, metadata
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS visibility  text        NOT NULL DEFAULT 'public';
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS max_members integer     NOT NULL DEFAULT 100;
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS category    text;
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS icon_url    text;
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS is_active   boolean     NOT NULL DEFAULT true;
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS updated_at  timestamptz NOT NULL DEFAULT now();

-- group_invites: invite code management
ALTER TABLE public.group_invites ADD COLUMN IF NOT EXISTS invite_code text;
ALTER TABLE public.group_invites ADD COLUMN IF NOT EXISTS created_by  uuid;
ALTER TABLE public.group_invites ADD COLUMN IF NOT EXISTS max_uses    integer;
ALTER TABLE public.group_invites ADD COLUMN IF NOT EXISTS uses_count  integer     NOT NULL DEFAULT 0;
ALTER TABLE public.group_invites ADD COLUMN IF NOT EXISTS expires_at  timestamptz;
ALTER TABLE public.group_invites ADD COLUMN IF NOT EXISTS created_at  timestamptz NOT NULL DEFAULT now();

-- Unique constraint on invite_code
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.group_invites'::regclass
      AND conname   = 'group_invites_invite_code_key'
  ) THEN
    ALTER TABLE public.group_invites
      ADD CONSTRAINT group_invites_invite_code_key UNIQUE (invite_code);
  END IF;
END $$;

-- ── 2. New table: notifications ───────────────────────────────────────────
--
-- In-app notification feed (group invites, challenge events, achievements).

CREATE TABLE IF NOT EXISTS public.notifications (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type       text        NOT NULL DEFAULT 'system',
    -- 'group_invite' | 'challenge_start' | 'challenge_end'
    -- | 'achievement' | 'system' | 'message'
  title      text        NOT NULL DEFAULT '',
  body       text        NOT NULL DEFAULT '',
  data       jsonb       NOT NULL DEFAULT '{}'::jsonb,
    -- Extra context: { group_id, challenge_id, invite_code, ... }
  read_at    timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ── 3. New table: user_presence ───────────────────────────────────────────
--
-- Real-time-ish online status.  Updated by client heartbeat.

CREATE TABLE IF NOT EXISTS public.user_presence (
  user_id         uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  status          text        NOT NULL DEFAULT 'offline',
    -- 'online' | 'studying' | 'offline'
  current_subject text,
  last_seen       timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ── 4. Trigger: handle_new_user ───────────────────────────────────────────
--
-- Fires on every new Supabase auth user.
-- Creates rows in: users, user_profiles, user_points,
--                  user_stats_summary, user_presence.
-- Plan is ALWAYS 'ranker' — no free tier in self-hosted mode.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_username text;
  v_name     text;
  v_email    text;
BEGIN
  -- username: prefer metadata set by /__auth/signup, fall back to email prefix
  v_username := COALESCE(
    NULLIF(trim(NEW.raw_user_meta_data->>'username'), ''),
    split_part(COALESCE(NEW.email, ''), '@', 1),
    'user_' || left(NEW.id::text, 8)
  );

  -- display name: prefer explicit name, then username
  v_name := COALESCE(
    NULLIF(trim(NEW.raw_user_meta_data->>'name'), ''),
    v_username
  );

  v_email := COALESCE(NEW.email, v_username || '@isotope.local');

  -- ── primary user record (plan = ranker always) ───────────────────────
  INSERT INTO public.users (
    id, email, name, username, avatar_url,
    plan_type, billing_status, plan_expires_at, access_ends_at
  ) VALUES (
    NEW.id,
    v_email,
    v_name,
    v_username,
    NULL,
    'ranker',
    'active',
    '2099-12-31 23:59:59+00'::timestamptz,
    '2099-12-31 23:59:59+00'::timestamptz
  )
  ON CONFLICT (id) DO UPDATE SET
    username        = EXCLUDED.username,
    name            = COALESCE(EXCLUDED.name, users.name),
    plan_type       = 'ranker',
    billing_status  = 'active',
    plan_expires_at = '2099-12-31 23:59:59+00'::timestamptz,
    access_ends_at  = '2099-12-31 23:59:59+00'::timestamptz,
    updated_at      = now();

  -- ── profile (onboarding data in JSONB; wizard fills it) ──────────────
  INSERT INTO public.user_profiles (user_id, profile_data)
  VALUES (NEW.id, '{}'::jsonb)
  ON CONFLICT (user_id) DO NOTHING;

  -- ── leaderboard seed ─────────────────────────────────────────────────
  INSERT INTO public.user_points (user_id, points, lifetime_points)
  VALUES (NEW.id, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;

  -- ── aggregate stats ───────────────────────────────────────────────────
  INSERT INTO public.user_stats_summary (
    user_id, total_study_seconds, streak_days, max_streak_days, session_count
  ) VALUES (NEW.id, 0, 0, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;

  -- ── presence (offline until first activity) ───────────────────────────
  INSERT INTO public.user_presence (user_id, status, last_seen)
  VALUES (NEW.id, 'offline', now())
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Attach trigger (recreate to pick up any function changes)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── 5. RPC: is_premium_user ───────────────────────────────────────────────
-- Always returns true — everyone is Ranker in self-hosted mode.
-- Existing RLS policies that call this will now always pass.

CREATE OR REPLACE FUNCTION public.is_premium_user(uid uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
AS $$ SELECT true; $$;

-- ── 6. RPC: get_leaderboard ───────────────────────────────────────────────
-- Global leaderboard sorted by weekly points, then lifetime points.

CREATE OR REPLACE FUNCTION public.get_leaderboard(
  p_limit  integer DEFAULT 50,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  rank            bigint,
  user_id         uuid,
  username        text,
  name            text,
  avatar_url      text,
  points          integer,
  lifetime_points integer
)
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT
    ROW_NUMBER() OVER (
      ORDER BY COALESCE(up.points,0) DESC, COALESCE(up.lifetime_points,0) DESC
    )                                      AS rank,
    up.user_id,
    u.username,
    u.name,
    u.avatar_url,
    COALESCE(up.points, 0)          AS points,
    COALESCE(up.lifetime_points, 0) AS lifetime_points
  FROM public.user_points up
  JOIN public.users u ON u.id = up.user_id
  ORDER BY COALESCE(up.points,0) DESC, COALESCE(up.lifetime_points,0) DESC
  LIMIT  p_limit
  OFFSET p_offset;
$$;

-- ── 7. RPC: get_group_leaderboard ─────────────────────────────────────────
-- Points leaderboard for members of one group.

CREATE OR REPLACE FUNCTION public.get_group_leaderboard(
  p_group_id uuid,
  p_limit    integer DEFAULT 20
)
RETURNS TABLE (
  rank       bigint,
  user_id    uuid,
  username   text,
  name       text,
  avatar_url text,
  points     integer
)
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT
    ROW_NUMBER() OVER (ORDER BY COALESCE(up.points,0) DESC) AS rank,
    gm.user_id,
    u.username,
    u.name,
    u.avatar_url,
    COALESCE(up.points, 0) AS points
  FROM public.group_members gm
  JOIN public.users u            ON u.id       = gm.user_id
  LEFT JOIN public.user_points up ON up.user_id = gm.user_id
  WHERE gm.group_id = p_group_id
  ORDER BY COALESCE(up.points,0) DESC
  LIMIT p_limit;
$$;

-- ── 8. RPC: get_invite_details ────────────────────────────────────────────
-- Returns group info for the join-preview screen (no auth required).

CREATE OR REPLACE FUNCTION public.get_invite_details(p_code text)
RETURNS TABLE (
  group_id     uuid,
  group_name   text,
  description  text,
  member_count bigint,
  is_valid     boolean
)
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT
    g.id              AS group_id,
    g.name            AS group_name,
    g.description,
    COUNT(gm.user_id) AS member_count,
    (
      (gi.expires_at IS NULL OR gi.expires_at > now())
      AND
      (gi.max_uses   IS NULL OR gi.uses_count < gi.max_uses)
    )                 AS is_valid
  FROM public.group_invites gi
  JOIN public.groups g ON g.id = gi.group_id
  LEFT JOIN public.group_members gm ON gm.group_id = g.id
  WHERE gi.invite_code = p_code
    AND g.is_active    = true
  GROUP BY g.id, g.name, g.description,
           gi.expires_at, gi.max_uses, gi.uses_count;
$$;

-- ── 9. RPC: accept_invite ─────────────────────────────────────────────────
-- Joins the calling user to the group linked to the invite code.

CREATE OR REPLACE FUNCTION public.accept_invite(p_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invite public.group_invites%ROWTYPE;
  v_uid    uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Not authenticated');
  END IF;

  SELECT * INTO v_invite
  FROM public.group_invites
  WHERE invite_code = p_code;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Invite not found');
  END IF;

  IF v_invite.expires_at IS NOT NULL AND v_invite.expires_at < now() THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Invite has expired');
  END IF;

  IF v_invite.max_uses IS NOT NULL AND v_invite.uses_count >= v_invite.max_uses THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Invite has reached its maximum uses');
  END IF;

  -- Add member — silently skip if already a member
  INSERT INTO public.group_members (group_id, user_id, role)
  VALUES (v_invite.group_id, v_uid, 'member')
  ON CONFLICT (group_id, user_id) DO NOTHING;

  -- Track usage
  UPDATE public.group_invites
  SET uses_count = uses_count + 1
  WHERE id = v_invite.id;

  RETURN jsonb_build_object('ok', true, 'group_id', v_invite.group_id);
END;
$$;

-- ── 10. RPC: get_membership_snapshot ──────────────────────────────────────
-- Group summary for analytics dashboards.

CREATE OR REPLACE FUNCTION public.get_membership_snapshot(p_group_id uuid)
RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT jsonb_build_object(
    'group_id',     g.id,
    'name',         g.name,
    'member_count', COUNT(DISTINCT gm.user_id),
    'total_points', COALESCE(SUM(up.points), 0),
    'created_at',   g.created_at
  )
  FROM public.groups g
  LEFT JOIN public.group_members gm ON gm.group_id = g.id
  LEFT JOIN public.user_points   up ON up.user_id   = gm.user_id
  WHERE g.id = p_group_id
  GROUP BY g.id, g.name, g.created_at;
$$;

-- ── 11. RPC: get_group_analytics_from_snapshots ───────────────────────────
-- Daily study totals for a group over the last N days.

CREATE OR REPLACE FUNCTION public.get_group_analytics_from_snapshots(
  p_group_id uuid,
  p_days     integer DEFAULT 7
)
RETURNS TABLE (
  date           date,
  total_seconds  bigint,
  active_members bigint
)
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT
    d.date,
    COALESCE(SUM(d.seconds_studied), 0) AS total_seconds,
    COUNT(DISTINCT d.user_id)           AS active_members
  FROM public.daily_user_stats d
  JOIN public.group_members gm
    ON gm.user_id   = d.user_id
   AND gm.group_id  = p_group_id
  WHERE d.date >= (CURRENT_DATE - (p_days - 1))
  GROUP BY d.date
  ORDER BY d.date;
$$;

-- ── 12. Row-Level Security ─────────────────────────────────────────────────
-- Owner/admin mode may use the service_role key server-side to bypass RLS.
-- These policies protect any direct client-side access.

ALTER TABLE public.users                        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_points                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats_summary           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_user_stats             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions_log           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_items                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_inventory               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_presence                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups                       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_chat_messages          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_challenges             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_announcements          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_invites                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_milestones             ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN

  -- users: own row only
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='users' AND policyname='users_own') THEN
    CREATE POLICY users_own ON public.users
      FOR ALL USING (id = auth.uid()) WITH CHECK (id = auth.uid());
  END IF;
  -- users: public read for leaderboard username/avatar display
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='users' AND policyname='users_read_public') THEN
    CREATE POLICY users_read_public ON public.users
      FOR SELECT USING (true);
  END IF;

  -- user_profiles: own row only
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_profiles' AND policyname='profiles_own') THEN
    CREATE POLICY profiles_own ON public.user_profiles
      FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;

  -- user_points: all can read (leaderboard), own row to write
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_points' AND policyname='points_read_all') THEN
    CREATE POLICY points_read_all ON public.user_points FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_points' AND policyname='points_own_write') THEN
    CREATE POLICY points_own_write ON public.user_points
      FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;

  -- user_stats_summary: own row only
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_stats_summary' AND policyname='stats_own') THEN
    CREATE POLICY stats_own ON public.user_stats_summary
      FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;

  -- daily_user_stats: own rows only
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='daily_user_stats' AND policyname='daily_own') THEN
    CREATE POLICY daily_own ON public.daily_user_stats
      FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;

  -- study_sessions_log: own rows only
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='study_sessions_log' AND policyname='sessions_own') THEN
    CREATE POLICY sessions_own ON public.study_sessions_log
      FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;

  -- store_items: all can read the catalog
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='store_items' AND policyname='store_read_all') THEN
    CREATE POLICY store_read_all ON public.store_items FOR SELECT USING (true);
  END IF;

  -- user_inventory: own rows only
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_inventory' AND policyname='inventory_own') THEN
    CREATE POLICY inventory_own ON public.user_inventory
      FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;

  -- notifications: own rows only
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='notifications' AND policyname='notif_own') THEN
    CREATE POLICY notif_own ON public.notifications
      FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;

  -- user_presence: all authenticated can read; own row to write
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_presence' AND policyname='presence_read_auth') THEN
    CREATE POLICY presence_read_auth ON public.user_presence
      FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_presence' AND policyname='presence_own_write') THEN
    CREATE POLICY presence_own_write ON public.user_presence
      FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;

  -- groups: all can read active groups; owner can write
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='groups' AND policyname='groups_read_active') THEN
    CREATE POLICY groups_read_active ON public.groups
      FOR SELECT USING (is_active = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='groups' AND policyname='groups_owner_write') THEN
    CREATE POLICY groups_owner_write ON public.groups
      FOR ALL USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
  END IF;

  -- group_members: readable by other members; own row to insert/delete
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='group_members' AND policyname='gm_read_members') THEN
    CREATE POLICY gm_read_members ON public.group_members
      FOR SELECT USING (
        group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='group_members' AND policyname='gm_own_write') THEN
    CREATE POLICY gm_own_write ON public.group_members
      FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;

  -- group_chat_messages: readable + writable by group members
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='group_chat_messages' AND policyname='gchat_read_members') THEN
    CREATE POLICY gchat_read_members ON public.group_chat_messages
      FOR SELECT USING (
        group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='group_chat_messages' AND policyname='gchat_send') THEN
    CREATE POLICY gchat_send ON public.group_chat_messages
      FOR INSERT WITH CHECK (
        user_id = auth.uid()
        AND group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='group_chat_messages' AND policyname='gchat_delete_own') THEN
    CREATE POLICY gchat_delete_own ON public.group_chat_messages
      FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;

  -- group_challenges: members can read; creators can write
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='group_challenges' AND policyname='gchall_read') THEN
    CREATE POLICY gchall_read ON public.group_challenges
      FOR SELECT USING (
        group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='group_challenges' AND policyname='gchall_write') THEN
    CREATE POLICY gchall_write ON public.group_challenges
      FOR ALL USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
  END IF;

  -- group_challenge_participants: own row; members can read
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='group_challenge_participants' AND policyname='gcpart_own') THEN
    CREATE POLICY gcpart_own ON public.group_challenge_participants
      FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='group_challenge_participants' AND policyname='gcpart_read_members') THEN
    CREATE POLICY gcpart_read_members ON public.group_challenge_participants
      FOR SELECT USING (
        challenge_id IN (
          SELECT gc.id FROM public.group_challenges gc
          JOIN  public.group_members gm ON gm.group_id = gc.group_id
          WHERE gm.user_id = auth.uid()
        )
      );
  END IF;

  -- group_announcements: members can read; authors can write
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='group_announcements' AND policyname='gann_read') THEN
    CREATE POLICY gann_read ON public.group_announcements
      FOR SELECT USING (
        group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='group_announcements' AND policyname='gann_write') THEN
    CREATE POLICY gann_write ON public.group_announcements
      FOR ALL USING (author_id = auth.uid()) WITH CHECK (author_id = auth.uid());
  END IF;

  -- group_invites: members can read; admins/mods can create
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='group_invites' AND policyname='ginv_read') THEN
    CREATE POLICY ginv_read ON public.group_invites
      FOR SELECT USING (
        group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='group_invites' AND policyname='ginv_create') THEN
    CREATE POLICY ginv_create ON public.group_invites
      FOR INSERT WITH CHECK (
        created_by = auth.uid()
        AND group_id IN (
          SELECT group_id FROM public.group_members
          WHERE user_id = auth.uid() AND role IN ('admin','moderator')
        )
      );
  END IF;

  -- group_milestones: members can read; service_role writes
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='group_milestones' AND policyname='gmile_read') THEN
    CREATE POLICY gmile_read ON public.group_milestones
      FOR SELECT USING (
        group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
      );
  END IF;

END $$;

-- ── 13. Performance indexes ───────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_users_username         ON public.users (username);
CREATE INDEX IF NOT EXISTS idx_users_plan_type        ON public.users (plan_type);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id       ON public.user_profiles (user_id);

CREATE INDEX IF NOT EXISTS idx_points_points          ON public.user_points (points DESC);
CREATE INDEX IF NOT EXISTS idx_points_user_id         ON public.user_points (user_id);
CREATE INDEX IF NOT EXISTS idx_points_lifetime        ON public.user_points (lifetime_points DESC);

CREATE INDEX IF NOT EXISTS idx_stats_user_id          ON public.user_stats_summary (user_id);

CREATE INDEX IF NOT EXISTS idx_daily_user_date        ON public.daily_user_stats (user_id, date DESC);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id       ON public.study_sessions_log (user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_started_at    ON public.study_sessions_log (started_at DESC);

CREATE INDEX IF NOT EXISTS idx_groups_owner           ON public.groups (owner_id);
CREATE INDEX IF NOT EXISTS idx_groups_active          ON public.groups (is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_gm_group               ON public.group_members (group_id);
CREATE INDEX IF NOT EXISTS idx_gm_user                ON public.group_members (user_id);

CREATE INDEX IF NOT EXISTS idx_gchat_group_time       ON public.group_chat_messages (group_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gchat_user_id          ON public.group_chat_messages (user_id);

CREATE INDEX IF NOT EXISTS idx_gchall_group           ON public.group_challenges (group_id);
CREATE INDEX IF NOT EXISTS idx_gcpart_challenge       ON public.group_challenge_participants (challenge_id);
CREATE INDEX IF NOT EXISTS idx_gcpart_user            ON public.group_challenge_participants (user_id);

CREATE INDEX IF NOT EXISTS idx_gann_group             ON public.group_announcements (group_id);

CREATE INDEX IF NOT EXISTS idx_ginv_code              ON public.group_invites (invite_code);
CREATE INDEX IF NOT EXISTS idx_ginv_group             ON public.group_invites (group_id);

CREATE INDEX IF NOT EXISTS idx_notif_user_time        ON public.notifications (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notif_unread           ON public.notifications (user_id, read_at) WHERE read_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_presence_status        ON public.user_presence (status);
CREATE INDEX IF NOT EXISTS idx_presence_last_seen     ON public.user_presence (last_seen DESC);

-- ── 14. Backfill existing users ───────────────────────────────────────────

-- Force ALL existing users to Ranker plan
UPDATE public.users
SET
  plan_type       = 'ranker',
  billing_status  = 'active',
  plan_expires_at = '2099-12-31 23:59:59+00'::timestamptz,
  access_ends_at  = '2099-12-31 23:59:59+00'::timestamptz,
  updated_at      = now()
WHERE plan_type <> 'ranker'
   OR billing_status <> 'active'
   OR plan_expires_at IS NULL
   OR plan_expires_at < now();

-- Populate username from auth metadata, then fall back to email prefix
UPDATE public.users u
SET username = COALESCE(
  NULLIF(trim(au.raw_user_meta_data->>'username'), ''),
  split_part(u.email, '@', 1)
)
FROM auth.users au
WHERE au.id = u.id
  AND (u.username IS NULL OR trim(u.username) = '');

-- Any remaining users without username: use email prefix
UPDATE public.users
SET username = split_part(email, '@', 1)
WHERE (username IS NULL OR trim(username) = '')
  AND email IS NOT NULL;

-- Seed user_points for existing users who don't have a row
INSERT INTO public.user_points (user_id, points, lifetime_points)
SELECT u.id, 0, 0
FROM public.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_points up WHERE up.user_id = u.id
)
ON CONFLICT (user_id) DO NOTHING;

-- Seed user_stats_summary
INSERT INTO public.user_stats_summary (
  user_id, total_study_seconds, streak_days, max_streak_days, session_count
)
SELECT u.id, 0, 0, 0, 0
FROM public.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_stats_summary s WHERE s.user_id = u.id
)
ON CONFLICT (user_id) DO NOTHING;

-- Seed user_profiles (empty profile → onboarding wizard will fill it)
INSERT INTO public.user_profiles (user_id, profile_data)
SELECT u.id, '{}'::jsonb
FROM public.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_profiles p WHERE p.user_id = u.id
)
ON CONFLICT (user_id) DO NOTHING;

-- Seed user_presence
INSERT INTO public.user_presence (user_id, status, last_seen)
SELECT u.id, 'offline', now()
FROM public.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_presence p WHERE p.user_id = u.id
)
ON CONFLICT (user_id) DO NOTHING;

-- ── Done ──────────────────────────────────────────────────────────────────
-- Schema v2 applied successfully.
-- Verify: SELECT username, plan_type FROM public.users LIMIT 10;
-- ============================================================================
