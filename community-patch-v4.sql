-- ============================================================================
-- IsotopeAI — Community Patch v4
-- ============================================================================
-- Run this in Supabase SQL Editor (Project > SQL Editor > New query > Run).
-- Fully idempotent: safe to run multiple times on the same database.
-- Fixes EVERY mismatch between the compiled frontend JS and the DB schema.
--
-- What this fixes:
--   1. users — username, coins, gems, plan columns, everyone → ranker
--   2. groups — is_public, deleted_at, fts, max_members, slug, cover_url …
--   3. group_members — role, joined_at, unique constraint
--   4. group_chat_messages — user_id (JS inserts/reads this, not sender_id)
--   5. group_invites — token as plain writable column (not invite_code)
--   6. group_announcements — author_id, content, pinned columns
--   7. group_milestones — milestone_type, earned_at columns
--   8. group_challenges — full table (CREATE IF NOT EXISTS + column adds)
--   9. group_challenge_participants — full table
--  10. user_stats_summary — adds the 7 columns JS reads (total_hours etc.)
--  11. user_points — points, lifetime_points
--  12. user_profiles — profile_data jsonb
--  13. daily_user_stats — CREATE IF NOT EXISTS
--  14. study_sessions_log — CREATE IF NOT EXISTS
--  15. store_items — CREATE IF NOT EXISTS
--  16. user_inventory — CREATE IF NOT EXISTS
--  17. notifications — CREATE IF NOT EXISTS
--  18. user_presence — CREATE IF NOT EXISTS
--  19. RPC get_invite_details — search by token (not invite_code)
--  20. RPC accept_invite — search by token; returns {success:} not {ok:}
--  21. RPC get_membership_snapshot — param is p_user_id (not p_group_id)
--  22. RPC get_group_analytics_from_snapshots — correct
--  23. RPC get_leaderboard — SQL-based (edge function not deployed)
--  24. RPC get_group_leaderboard — SQL-based
--  25. RPC is_premium_user — always true
--  26. GRANT EXECUTE on all RPCs to anon/authenticated/service_role
--  27. RLS policies — fix group_chat_messages INSERT (user_id not sender_id)
--  28. handle_new_user trigger — updated for all new tables
--  29. Performance indexes
--  30. Backfill all existing users
-- ============================================================================

-- ── 0. Drop RPCs with return-type drift before any CREATE OR REPLACE ─────────
-- PostgreSQL cannot change a function's return type with CREATE OR REPLACE.
-- These exact drops make the full migration rerunnable on databases that have
-- older Isotope function definitions.
DROP FUNCTION IF EXISTS public.get_invite_details(text);
DROP FUNCTION IF EXISTS public.accept_invite(text);
DROP FUNCTION IF EXISTS public.get_membership_snapshot();
DROP FUNCTION IF EXISTS public.get_membership_snapshot(uuid);
DROP FUNCTION IF EXISTS public.get_membership_snapshot(uuid, uuid);
DROP FUNCTION IF EXISTS public.get_group_analytics_from_snapshots(uuid);
DROP FUNCTION IF EXISTS public.get_group_analytics_from_snapshots(uuid, integer);
DROP FUNCTION IF EXISTS public.get_leaderboard();
DROP FUNCTION IF EXISTS public.get_leaderboard(text);
DROP FUNCTION IF EXISTS public.get_leaderboard(text, integer);
DROP FUNCTION IF EXISTS public.get_leaderboard(text, integer, integer);
DROP FUNCTION IF EXISTS public.get_group_leaderboard(uuid);
DROP FUNCTION IF EXISTS public.get_group_leaderboard(uuid, integer);
DROP FUNCTION IF EXISTS public.finish_session_sync(uuid, text, integer, uuid, text, text, timestamptz);
DROP FUNCTION IF EXISTS public.finish_session_sync(uuid, text, integer, text, text, uuid);
DROP FUNCTION IF EXISTS public.finish_session_sync(uuid, text, integer, uuid, text, text, text);
DROP FUNCTION IF EXISTS public.get_event_attendees(uuid);

-- ── 1. users ─────────────────────────────────────────────────────────────────

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS username        text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS coins           integer     NOT NULL DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS gems            integer     NOT NULL DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url      text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS plan_expires_at timestamptz DEFAULT '2099-12-31 23:59:59+00';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS access_ends_at  timestamptz DEFAULT '2099-12-31 23:59:59+00';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS updated_at      timestamptz NOT NULL DEFAULT now();

DO $$ BEGIN
  ALTER TABLE public.users ALTER COLUMN plan_type     SET DEFAULT 'ranker';
EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.users ALTER COLUMN billing_status SET DEFAULT 'active';
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- ── 2. groups ─────────────────────────────────────────────────────────────────
-- JS reads: id, name, description, cover_url, logo_url, category, slug,
--           member_count, owner_id, is_public, max_members, created_at
-- JS filters: .eq("is_public", true)  .is("deleted_at", null)
-- JS search:  .textSearch("fts", ...)

ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS cover_url     text;
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS logo_url      text;
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS category      text;
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS slug          text;
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS member_count  integer     NOT NULL DEFAULT 0;
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS owner_id      uuid;
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS max_members   integer     NOT NULL DEFAULT 100;
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS is_active     boolean     NOT NULL DEFAULT true;
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS updated_at    timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS deleted_at    timestamptz;
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS settings      jsonb       NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS visibility    text        NOT NULL DEFAULT 'public';

-- is_public: add as plain column if missing, then backfill
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS is_public boolean;
DO $$
BEGIN
  -- Backfill from visibility column
  UPDATE public.groups
    SET is_public = (visibility NOT IN ('private', 'invite_only'))
    WHERE is_public IS NULL;
  -- Default any remaining NULLs
  UPDATE public.groups SET is_public = true WHERE is_public IS NULL;
  -- Harden
  ALTER TABLE public.groups ALTER COLUMN is_public SET NOT NULL;
  ALTER TABLE public.groups ALTER COLUMN is_public SET DEFAULT true;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Full-text search generated column (for .textSearch("fts", ...))
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'groups' AND column_name = 'fts'
  ) THEN
    ALTER TABLE public.groups
      ADD COLUMN fts tsvector GENERATED ALWAYS AS (
        to_tsvector('english',
          coalesce(name,'') || ' ' ||
          coalesce(description,'') || ' ' ||
          coalesce(category,'')
        )
      ) STORED;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_groups_fts    ON public.groups USING GIN (fts);
CREATE INDEX IF NOT EXISTS idx_groups_public ON public.groups (is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_groups_slug   ON public.groups (slug) WHERE slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_groups_owner  ON public.groups (owner_id);
CREATE INDEX IF NOT EXISTS idx_groups_active ON public.groups (is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_groups_del    ON public.groups (deleted_at) WHERE deleted_at IS NULL;

-- ── 3. group_members ──────────────────────────────────────────────────────────
-- JS reads/inserts: id, group_id, user_id, role, joined_at

ALTER TABLE public.group_members ADD COLUMN IF NOT EXISTS role      text        NOT NULL DEFAULT 'member';
ALTER TABLE public.group_members ADD COLUMN IF NOT EXISTS joined_at timestamptz NOT NULL DEFAULT now();

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.group_members'::regclass
      AND conname = 'group_members_group_id_user_id_key'
  ) THEN
    ALTER TABLE public.group_members
      ADD CONSTRAINT group_members_group_id_user_id_key UNIQUE (group_id, user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_gm_group ON public.group_members (group_id);
CREATE INDEX IF NOT EXISTS idx_gm_user  ON public.group_members (user_id);

-- ── 4. group_chat_messages ────────────────────────────────────────────────────
-- JS selects: id, content, created_at, user_id
-- JS inserts: { id, group_id, user_id, content }
-- CRITICAL: JS uses user_id — NOT sender_id

ALTER TABLE public.group_chat_messages ADD COLUMN IF NOT EXISTS user_id      uuid;
ALTER TABLE public.group_chat_messages ADD COLUMN IF NOT EXISTS message_type text        NOT NULL DEFAULT 'text';
ALTER TABLE public.group_chat_messages ADD COLUMN IF NOT EXISTS reply_to_id  uuid;
ALTER TABLE public.group_chat_messages ADD COLUMN IF NOT EXISTS deleted_at   timestamptz;

-- Backfill user_id from sender_id (if sender_id exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'group_chat_messages'
      AND column_name  = 'sender_id'
  ) THEN
    UPDATE public.group_chat_messages
      SET user_id = sender_id
      WHERE user_id IS NULL AND sender_id IS NOT NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_gchat_group_time ON public.group_chat_messages (group_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gchat_user       ON public.group_chat_messages (user_id);

-- ── 5. group_invites ──────────────────────────────────────────────────────────
-- JS reads/inserts: id, group_id, token, created_by, max_uses, uses_count,
--                   expires_at, created_at
-- CRITICAL: JS column name is 'token'. Must be a plain writable TEXT column.

ALTER TABLE public.group_invites ADD COLUMN IF NOT EXISTS created_by uuid;
ALTER TABLE public.group_invites ADD COLUMN IF NOT EXISTS max_uses   integer;
ALTER TABLE public.group_invites ADD COLUMN IF NOT EXISTS uses_count integer     NOT NULL DEFAULT 0;
ALTER TABLE public.group_invites ADD COLUMN IF NOT EXISTS expires_at timestamptz;
ALTER TABLE public.group_invites ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

-- Ensure 'token' is a plain writable column (drop it if it's a GENERATED column)
DO $$
DECLARE
  v_is_gen boolean;
BEGIN
  SELECT (is_generated = 'ALWAYS') INTO v_is_gen
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'group_invites'
      AND column_name  = 'token';

  IF v_is_gen IS TRUE THEN
    -- Drop the generated column and replace with plain
    ALTER TABLE public.group_invites DROP COLUMN token;
    ALTER TABLE public.group_invites ADD COLUMN token text;
    -- Backfill from invite_code if it exists
    BEGIN
      UPDATE public.group_invites
        SET token = invite_code
        WHERE token IS NULL AND invite_code IS NOT NULL;
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
  ELSIF v_is_gen IS NULL THEN
    -- Column does not exist at all — add it
    ALTER TABLE public.group_invites ADD COLUMN token text;
  END IF;
  -- If v_is_gen = FALSE the column already exists as a plain column — nothing to do
END $$;

-- Keep invite_code in sync so legacy lookups still work
ALTER TABLE public.group_invites ADD COLUMN IF NOT EXISTS invite_code text;
UPDATE public.group_invites SET invite_code = token     WHERE invite_code IS NULL AND token IS NOT NULL;
UPDATE public.group_invites SET token       = invite_code WHERE token IS NULL      AND invite_code IS NOT NULL;

-- Unique constraints
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.group_invites'::regclass
      AND conname = 'group_invites_token_key'
  ) THEN
    ALTER TABLE public.group_invites ADD CONSTRAINT group_invites_token_key UNIQUE (token);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_ginv_token ON public.group_invites (token);
CREATE INDEX IF NOT EXISTS idx_ginv_group ON public.group_invites (group_id);

-- ── 6. group_announcements ────────────────────────────────────────────────────
-- JS selects: id, content, pinned, author_id, created_at
-- JS inserts: { group_id, author_id, content, pinned }

ALTER TABLE public.group_announcements ADD COLUMN IF NOT EXISTS author_id  uuid;
ALTER TABLE public.group_announcements ADD COLUMN IF NOT EXISTS content    text        NOT NULL DEFAULT '';
ALTER TABLE public.group_announcements ADD COLUMN IF NOT EXISTS pinned     boolean     NOT NULL DEFAULT false;
ALTER TABLE public.group_announcements ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_gann_group ON public.group_announcements (group_id);
CREATE INDEX IF NOT EXISTS idx_gann_pinned ON public.group_announcements (group_id, pinned DESC, created_at DESC);

-- ── 7. group_milestones ───────────────────────────────────────────────────────
-- JS selects: milestone_type, earned_at

ALTER TABLE public.group_milestones ADD COLUMN IF NOT EXISTS group_id       uuid;
ALTER TABLE public.group_milestones ADD COLUMN IF NOT EXISTS milestone_type text        NOT NULL DEFAULT '';
ALTER TABLE public.group_milestones ADD COLUMN IF NOT EXISTS earned_at      timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_gmile_group ON public.group_milestones (group_id);

-- ── 8. group_challenges ───────────────────────────────────────────────────────
-- JS reads/inserts: id, group_id, title, description, goal_type, goal_value,
--                   start_time, end_time, created_by, is_active, created_at

CREATE TABLE IF NOT EXISTS public.group_challenges (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id    uuid        NOT NULL,
  title       text        NOT NULL DEFAULT '',
  description text,
  goal_type   text        NOT NULL DEFAULT 'hours',
  goal_value  numeric     NOT NULL DEFAULT 0,
  start_time  timestamptz NOT NULL DEFAULT now(),
  end_time    timestamptz,
  created_by  uuid,
  is_active   boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.group_challenges ADD COLUMN IF NOT EXISTS title       text        NOT NULL DEFAULT '';
ALTER TABLE public.group_challenges ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.group_challenges ADD COLUMN IF NOT EXISTS goal_type   text        NOT NULL DEFAULT 'hours';
ALTER TABLE public.group_challenges ADD COLUMN IF NOT EXISTS goal_value  numeric     NOT NULL DEFAULT 0;
ALTER TABLE public.group_challenges ADD COLUMN IF NOT EXISTS start_time  timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.group_challenges ADD COLUMN IF NOT EXISTS end_time    timestamptz;
ALTER TABLE public.group_challenges ADD COLUMN IF NOT EXISTS created_by  uuid;
ALTER TABLE public.group_challenges ADD COLUMN IF NOT EXISTS is_active   boolean     NOT NULL DEFAULT true;
ALTER TABLE public.group_challenges ADD COLUMN IF NOT EXISTS created_at  timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_gchall_group ON public.group_challenges (group_id);

-- ── 9. group_challenge_participants ───────────────────────────────────────────
-- JS reads/upserts: challenge_id, user_id, progress, completed,
--                   completed_at, joined_at

CREATE TABLE IF NOT EXISTS public.group_challenge_participants (
  challenge_id uuid        NOT NULL,
  user_id      uuid        NOT NULL,
  progress     numeric     NOT NULL DEFAULT 0,
  completed    boolean     NOT NULL DEFAULT false,
  completed_at timestamptz,
  joined_at    timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (challenge_id, user_id)
);

ALTER TABLE public.group_challenge_participants ADD COLUMN IF NOT EXISTS progress     numeric     NOT NULL DEFAULT 0;
ALTER TABLE public.group_challenge_participants ADD COLUMN IF NOT EXISTS completed    boolean     NOT NULL DEFAULT false;
ALTER TABLE public.group_challenge_participants ADD COLUMN IF NOT EXISTS completed_at timestamptz;
ALTER TABLE public.group_challenge_participants ADD COLUMN IF NOT EXISTS joined_at    timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_gcpart_challenge ON public.group_challenge_participants (challenge_id);
CREATE INDEX IF NOT EXISTS idx_gcpart_user      ON public.group_challenge_participants (user_id);

-- ── 10. user_stats_summary ────────────────────────────────────────────────────
-- Server INSERTs: total_study_seconds, streak_days, max_streak_days,
--                 session_count
-- JS READs:       total_hours, weekly_hours, monthly_hours, current_streak,
--                 longest_streak, total_sessions, last_session_at

-- Underlying columns for server INSERT
ALTER TABLE public.user_stats_summary ADD COLUMN IF NOT EXISTS total_study_seconds bigint      NOT NULL DEFAULT 0;
ALTER TABLE public.user_stats_summary ADD COLUMN IF NOT EXISTS streak_days         integer     NOT NULL DEFAULT 0;
ALTER TABLE public.user_stats_summary ADD COLUMN IF NOT EXISTS max_streak_days     integer     NOT NULL DEFAULT 0;
ALTER TABLE public.user_stats_summary ADD COLUMN IF NOT EXISTS session_count       integer     NOT NULL DEFAULT 0;
ALTER TABLE public.user_stats_summary ADD COLUMN IF NOT EXISTS last_study_date     date;
ALTER TABLE public.user_stats_summary ADD COLUMN IF NOT EXISTS updated_at          timestamptz NOT NULL DEFAULT now();

-- JS-read columns — drop if currently GENERATED (immutable), then add as plain
DO $$
DECLARE v_gen boolean;
BEGIN
  SELECT (is_generated = 'ALWAYS') INTO v_gen FROM information_schema.columns
    WHERE table_schema='public' AND table_name='user_stats_summary' AND column_name='total_hours';
  IF v_gen IS TRUE THEN ALTER TABLE public.user_stats_summary DROP COLUMN total_hours; END IF;
END $$;
ALTER TABLE public.user_stats_summary ADD COLUMN IF NOT EXISTS total_hours    numeric  NOT NULL DEFAULT 0;

DO $$
DECLARE v_gen boolean;
BEGIN
  SELECT (is_generated = 'ALWAYS') INTO v_gen FROM information_schema.columns
    WHERE table_schema='public' AND table_name='user_stats_summary' AND column_name='weekly_hours';
  IF v_gen IS TRUE THEN ALTER TABLE public.user_stats_summary DROP COLUMN weekly_hours; END IF;
END $$;
ALTER TABLE public.user_stats_summary ADD COLUMN IF NOT EXISTS weekly_hours   numeric  NOT NULL DEFAULT 0;

DO $$
DECLARE v_gen boolean;
BEGIN
  SELECT (is_generated = 'ALWAYS') INTO v_gen FROM information_schema.columns
    WHERE table_schema='public' AND table_name='user_stats_summary' AND column_name='monthly_hours';
  IF v_gen IS TRUE THEN ALTER TABLE public.user_stats_summary DROP COLUMN monthly_hours; END IF;
END $$;
ALTER TABLE public.user_stats_summary ADD COLUMN IF NOT EXISTS monthly_hours  numeric  NOT NULL DEFAULT 0;

DO $$
DECLARE v_gen boolean;
BEGIN
  SELECT (is_generated = 'ALWAYS') INTO v_gen FROM information_schema.columns
    WHERE table_schema='public' AND table_name='user_stats_summary' AND column_name='current_streak';
  IF v_gen IS TRUE THEN ALTER TABLE public.user_stats_summary DROP COLUMN current_streak; END IF;
END $$;
ALTER TABLE public.user_stats_summary ADD COLUMN IF NOT EXISTS current_streak integer  NOT NULL DEFAULT 0;

DO $$
DECLARE v_gen boolean;
BEGIN
  SELECT (is_generated = 'ALWAYS') INTO v_gen FROM information_schema.columns
    WHERE table_schema='public' AND table_name='user_stats_summary' AND column_name='longest_streak';
  IF v_gen IS TRUE THEN ALTER TABLE public.user_stats_summary DROP COLUMN longest_streak; END IF;
END $$;
ALTER TABLE public.user_stats_summary ADD COLUMN IF NOT EXISTS longest_streak integer  NOT NULL DEFAULT 0;

DO $$
DECLARE v_gen boolean;
BEGIN
  SELECT (is_generated = 'ALWAYS') INTO v_gen FROM information_schema.columns
    WHERE table_schema='public' AND table_name='user_stats_summary' AND column_name='total_sessions';
  IF v_gen IS TRUE THEN ALTER TABLE public.user_stats_summary DROP COLUMN total_sessions; END IF;
END $$;
ALTER TABLE public.user_stats_summary ADD COLUMN IF NOT EXISTS total_sessions integer  NOT NULL DEFAULT 0;

ALTER TABLE public.user_stats_summary ADD COLUMN IF NOT EXISTS last_session_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_stats_user_id      ON public.user_stats_summary (user_id);
CREATE INDEX IF NOT EXISTS idx_stats_total_hours  ON public.user_stats_summary (total_hours DESC);
CREATE INDEX IF NOT EXISTS idx_stats_weekly_hours ON public.user_stats_summary (weekly_hours DESC);

-- ── 11. user_points ───────────────────────────────────────────────────────────

ALTER TABLE public.user_points ADD COLUMN IF NOT EXISTS points          integer     NOT NULL DEFAULT 0;
ALTER TABLE public.user_points ADD COLUMN IF NOT EXISTS lifetime_points integer     NOT NULL DEFAULT 0;
ALTER TABLE public.user_points ADD COLUMN IF NOT EXISTS updated_at      timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_points_user_id  ON public.user_points (user_id);
CREATE INDEX IF NOT EXISTS idx_points_points   ON public.user_points (points DESC);
CREATE INDEX IF NOT EXISTS idx_points_lifetime ON public.user_points (lifetime_points DESC);

-- ── 12. user_profiles ────────────────────────────────────────────────────────

ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS profile_data jsonb       NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS updated_at   timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.user_profiles (user_id);

-- ── 13. daily_user_stats ──────────────────────────────────────────────────────
-- JS reads: user_id, date, seconds_studied

CREATE TABLE IF NOT EXISTS public.daily_user_stats (
  user_id         uuid   NOT NULL,
  date            date   NOT NULL,
  seconds_studied bigint NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, date)
);

ALTER TABLE public.daily_user_stats ADD COLUMN IF NOT EXISTS seconds_studied bigint NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_daily_user_date ON public.daily_user_stats (user_id, date DESC);

-- ── 14. study_sessions_log ────────────────────────────────────────────────────
-- JS reads: user_id, duration_minutes, ended_at

CREATE TABLE IF NOT EXISTS public.study_sessions_log (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid        NOT NULL,
  duration_minutes integer     NOT NULL DEFAULT 0,
  started_at       timestamptz NOT NULL DEFAULT now(),
  ended_at         timestamptz NOT NULL DEFAULT now(),
  subject          text,
  notes            text,
  created_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.study_sessions_log ADD COLUMN IF NOT EXISTS duration_minutes integer     NOT NULL DEFAULT 0;
ALTER TABLE public.study_sessions_log ADD COLUMN IF NOT EXISTS ended_at         timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_sessions_user_id    ON public.study_sessions_log (user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON public.study_sessions_log (started_at DESC);

-- ── 15. store_items ───────────────────────────────────────────────────────────
-- JS reads: id, name, description, price, currency, category, image

CREATE TABLE IF NOT EXISTS public.store_items (
  id          uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text    NOT NULL DEFAULT '',
  description text,
  price       integer NOT NULL DEFAULT 0,
  currency    text    NOT NULL DEFAULT 'coins',
  category    text    NOT NULL DEFAULT 'theme',
  image       text,
  active      boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.store_items ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.store_items ADD COLUMN IF NOT EXISTS price       integer NOT NULL DEFAULT 0;
ALTER TABLE public.store_items ADD COLUMN IF NOT EXISTS currency    text    NOT NULL DEFAULT 'coins';
ALTER TABLE public.store_items ADD COLUMN IF NOT EXISTS category    text    NOT NULL DEFAULT 'theme';
ALTER TABLE public.store_items ADD COLUMN IF NOT EXISTS image       text;
ALTER TABLE public.store_items ADD COLUMN IF NOT EXISTS active      boolean NOT NULL DEFAULT true;

-- ── 16. user_inventory ────────────────────────────────────────────────────────
-- JS reads/inserts/updates: id, user_id, item_id, equipped

CREATE TABLE IF NOT EXISTS public.user_inventory (
  id         uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid    NOT NULL,
  item_id    uuid    NOT NULL,
  equipped   boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, item_id)
);

ALTER TABLE public.user_inventory ADD COLUMN IF NOT EXISTS equipped boolean NOT NULL DEFAULT false;

-- ── 17. notifications ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.notifications (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type       text        NOT NULL DEFAULT 'system',
  title      text        NOT NULL DEFAULT '',
  body       text        NOT NULL DEFAULT '',
  data       jsonb       NOT NULL DEFAULT '{}'::jsonb,
  read_at    timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notif_user_time ON public.notifications (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notif_unread    ON public.notifications (user_id, read_at) WHERE read_at IS NULL;

-- ── 18. user_presence ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.user_presence (
  user_id         uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  status          text        NOT NULL DEFAULT 'offline',
  current_subject text,
  last_seen       timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_presence_status    ON public.user_presence (status);
CREATE INDEX IF NOT EXISTS idx_presence_last_seen ON public.user_presence (last_seen DESC);

-- ── 19. RPC: is_premium_user ─────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.is_premium_user(uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER
AS $$ SELECT true; $$;

-- ── 20. RPC: get_invite_details ───────────────────────────────────────────────
-- JS calls: .rpc("get_invite_details", { p_code: token })
-- FIXED: searches token column (not invite_code)

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
    g.id                AS group_id,
    g.name              AS group_name,
    g.description,
    COUNT(gm.user_id)   AS member_count,
    (
      (gi.expires_at IS NULL OR gi.expires_at > now())
      AND (gi.max_uses IS NULL OR gi.uses_count < gi.max_uses)
    )                   AS is_valid
  FROM public.group_invites gi
  JOIN  public.groups g        ON g.id       = gi.group_id
  LEFT JOIN public.group_members gm ON gm.group_id = g.id
  WHERE (gi.token = p_code OR gi.invite_code = p_code)
    AND (g.is_active = true OR g.is_active IS NULL)
    AND g.deleted_at IS NULL
  GROUP BY g.id, g.name, g.description,
           gi.expires_at, gi.max_uses, gi.uses_count;
$$;

-- ── 21. RPC: accept_invite ────────────────────────────────────────────────────
-- JS calls: .rpc("accept_invite", { p_code: token })
-- JS checks: if (!e.success) throw ...
-- FIXED: searches token column; returns { success: true/false }

CREATE OR REPLACE FUNCTION public.accept_invite(p_code text)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invite public.group_invites%ROWTYPE;
  v_uid    uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  SELECT * INTO v_invite
  FROM public.group_invites
  WHERE token = p_code OR invite_code = p_code
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invite not found');
  END IF;

  IF v_invite.expires_at IS NOT NULL AND v_invite.expires_at < now() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invite has expired');
  END IF;

  IF v_invite.max_uses IS NOT NULL AND v_invite.uses_count >= v_invite.max_uses THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invite has reached maximum uses');
  END IF;

  -- Add member — silent no-op if already a member
  INSERT INTO public.group_members (group_id, user_id, role)
  VALUES (v_invite.group_id, v_uid, 'member')
  ON CONFLICT (group_id, user_id) DO NOTHING;

  -- Track usage + keep token/invite_code in sync
  UPDATE public.group_invites
  SET
    uses_count  = uses_count + 1,
    invite_code = COALESCE(invite_code, token),
    token       = COALESCE(token, invite_code)
  WHERE id = v_invite.id;

  RETURN jsonb_build_object('success', true, 'group_id', v_invite.group_id);
END;
$$;

-- ── 22. RPC: get_membership_snapshot ─────────────────────────────────────────
-- TWO callers, two different parameter names:
--   App-pJGjDiPw.js:       .rpc("get_membership_snapshot", { p_user_id: userId })
--   Subscription-UaefsAtQ: .rpc("get_membership_snapshot", { target_user_id: userId })
-- FIX: Both parameters DEFAULT NULL → COALESCE picks whichever is non-null.
-- PostgREST routes named args by matching the declared param names, so each
-- caller will only fill in its own key; the other will be NULL.

CREATE OR REPLACE FUNCTION public.get_membership_snapshot(
  p_user_id      uuid DEFAULT NULL,
  target_user_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT jsonb_build_object(
    'user_id',         u.id,
    'plan_type',       u.plan_type,
    'plan_expires_at', u.plan_expires_at,
    'is_premium',      true,
    'points',          COALESCE(up.points, 0),
    'lifetime_points', COALESCE(up.lifetime_points, 0),
    'billing_status',  'active',
    'access_ends_at',  '2099-12-31T23:59:59Z'
  )
  FROM public.users u
  LEFT JOIN public.user_points up ON up.user_id = u.id
  WHERE u.id = COALESCE(p_user_id, target_user_id);
$$;

-- ── 23. RPC: get_group_analytics_from_snapshots ───────────────────────────────
-- JS calls: .rpc("get_group_analytics_from_snapshots", { p_group_id, p_days })

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
    COALESCE(SUM(d.seconds_studied), 0)::bigint AS total_seconds,
    COUNT(DISTINCT d.user_id)::bigint           AS active_members
  FROM public.daily_user_stats d
  JOIN public.group_members gm
    ON gm.user_id  = d.user_id
   AND gm.group_id = p_group_id
  WHERE d.date >= (CURRENT_DATE - (p_days - 1))
  GROUP BY d.date
  ORDER BY d.date;
$$;

-- ── 24. RPC: get_leaderboard ─────────────────────────────────────────────────
-- Called by server.mjs fetch interceptor when app calls the missing edge fn.
-- Also callable directly: SELECT * FROM get_leaderboard('weekly', 50, 0);

CREATE OR REPLACE FUNCTION public.get_leaderboard(
  p_period text    DEFAULT 'weekly',
  p_limit  integer DEFAULT 50,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  rank           bigint,
  user_id        uuid,
  username       text,
  name           text,
  avatar_url     text,
  total_hours    numeric,
  weekly_hours   numeric,
  monthly_hours  numeric,
  total_sessions integer,
  current_streak integer,
  last_session_at timestamptz,
  score          numeric
)
LANGUAGE plpgsql STABLE SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ROW_NUMBER() OVER (
      ORDER BY
        CASE p_period
          WHEN 'monthly' THEN s.monthly_hours
          WHEN 'daily'   THEN s.weekly_hours
          ELSE                s.weekly_hours
        END DESC NULLS LAST,
        s.total_hours DESC NULLS LAST
    )                                       AS rank,
    s.user_id,
    u.username,
    u.name,
    u.avatar_url,
    COALESCE(s.total_hours,  0)             AS total_hours,
    COALESCE(s.weekly_hours, 0)             AS weekly_hours,
    COALESCE(s.monthly_hours,0)             AS monthly_hours,
    COALESCE(s.total_sessions, 0)::integer  AS total_sessions,
    COALESCE(s.current_streak, 0)::integer  AS current_streak,
    s.last_session_at,
    COALESCE(
      CASE p_period
        WHEN 'monthly' THEN s.monthly_hours
        ELSE                s.weekly_hours
      END, 0
    )                                       AS score
  FROM public.user_stats_summary s
  JOIN public.users u ON u.id = s.user_id
  ORDER BY score DESC NULLS LAST, s.total_hours DESC NULLS LAST
  LIMIT  p_limit
  OFFSET p_offset;
END;
$$;

-- ── 25. RPC: get_group_leaderboard ───────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.get_group_leaderboard(
  p_group_id uuid,
  p_limit    integer DEFAULT 20
)
RETURNS TABLE (
  rank           bigint,
  user_id        uuid,
  username       text,
  name           text,
  avatar_url     text,
  total_hours    numeric,
  weekly_hours   numeric,
  total_sessions integer
)
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT
    ROW_NUMBER() OVER (
      ORDER BY COALESCE(s.weekly_hours, 0) DESC NULLS LAST
    )                                       AS rank,
    gm.user_id,
    u.username,
    u.name,
    u.avatar_url,
    COALESCE(s.total_hours,   0)            AS total_hours,
    COALESCE(s.weekly_hours,  0)            AS weekly_hours,
    COALESCE(s.total_sessions,0)::integer   AS total_sessions
  FROM public.group_members gm
  JOIN  public.users u              ON u.id      = gm.user_id
  LEFT JOIN public.user_stats_summary s ON s.user_id = gm.user_id
  WHERE gm.group_id = p_group_id
  ORDER BY COALESCE(s.weekly_hours,0) DESC NULLS LAST
  LIMIT p_limit;
$$;

-- ── 26. RPC: finish_session_sync ─────────────────────────────────────────────
-- Called by server.mjs fetch interceptor when app calls the missing
-- finish-session edge function. Writes session data into:
--   study_sessions_log, daily_user_stats, user_stats_summary

CREATE OR REPLACE FUNCTION public.finish_session_sync(
  p_session_id       uuid,
  p_action           text        DEFAULT 'complete',
  p_duration_minutes integer     DEFAULT 0,
  p_group_id         uuid        DEFAULT NULL,
  p_session_type     text        DEFAULT 'focus',
  p_notes            text        DEFAULT NULL,
  p_ended_at         timestamptz DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid       uuid    := auth.uid();
  v_today     date    := CURRENT_DATE;
  v_secs      bigint;
  v_hrs       numeric;
  v_row_count bigint;
  v_was_found boolean;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('error', 'Not authenticated');
  END IF;

  -- delete action: remove session and exit
  IF p_action = 'delete' THEN
    DELETE FROM public.study_sessions_log
      WHERE id = p_session_id AND user_id = v_uid;
    v_was_found := FOUND;
    RETURN jsonb_build_object(
      'already_absent',     NOT v_was_found,
      'affected_group_ids', CASE WHEN p_group_id IS NOT NULL
                                 THEN jsonb_build_array(p_group_id)
                                 ELSE '[]'::jsonb END,
      'challenge_updates',  '[]'::jsonb
    );
  END IF;

  v_secs := GREATEST(0, p_duration_minutes) * 60;
  v_hrs  := round(p_duration_minutes::numeric / 60, 4);

  -- Insert session log — skip silently on duplicate
  INSERT INTO public.study_sessions_log
    (id, user_id, duration_minutes, started_at, ended_at, subject, notes)
  VALUES (
    p_session_id,
    v_uid,
    p_duration_minutes,
    COALESCE(p_ended_at, now()) - (p_duration_minutes || ' minutes')::interval,
    COALESCE(p_ended_at, now()),
    p_session_type,
    p_notes
  )
  ON CONFLICT (id) DO NOTHING;

  GET DIAGNOSTICS v_row_count = ROW_COUNT;

  IF v_row_count = 0 THEN
    -- Already processed: don't double-count stats
    RETURN jsonb_build_object(
      'already_processed',  true,
      'affected_group_ids', '[]'::jsonb,
      'challenge_updates',  '[]'::jsonb
    );
  END IF;

  -- Upsert daily stats
  INSERT INTO public.daily_user_stats (user_id, date, seconds_studied)
  VALUES (v_uid, v_today, v_secs)
  ON CONFLICT (user_id, date) DO UPDATE
    SET seconds_studied = daily_user_stats.seconds_studied + EXCLUDED.seconds_studied;

  -- Update running totals in user_stats_summary
  INSERT INTO public.user_stats_summary
    (user_id, total_study_seconds, total_hours, weekly_hours, monthly_hours,
     session_count, total_sessions, last_session_at, last_study_date, updated_at)
  VALUES
    (v_uid, v_secs, v_hrs, v_hrs, v_hrs, 1, 1,
     COALESCE(p_ended_at, now()), v_today, now())
  ON CONFLICT (user_id) DO UPDATE SET
    total_study_seconds = user_stats_summary.total_study_seconds + v_secs,
    total_hours         = round((user_stats_summary.total_study_seconds + v_secs)::numeric / 3600, 2),
    weekly_hours        = user_stats_summary.weekly_hours  + v_hrs,
    monthly_hours       = user_stats_summary.monthly_hours + v_hrs,
    session_count       = user_stats_summary.session_count  + 1,
    total_sessions      = user_stats_summary.total_sessions + 1,
    last_session_at     = COALESCE(p_ended_at, now()),
    last_study_date     = v_today,
    updated_at          = now();

  RETURN jsonb_build_object(
    'already_processed',  false,
    'affected_group_ids', CASE WHEN p_group_id IS NOT NULL
                               THEN jsonb_build_array(p_group_id)
                               ELSE '[]'::jsonb END,
    'challenge_updates',  '[]'::jsonb
  );
END;
$$;

-- ── 27. GRANT EXECUTE ────────────────────────────────────────────────────────

GRANT EXECUTE ON FUNCTION public.is_premium_user(uuid)
  TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_invite_details(text)
  TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.accept_invite(text)
  TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_membership_snapshot(uuid, uuid)
  TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_group_analytics_from_snapshots(uuid, integer)
  TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_leaderboard(text, integer, integer)
  TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_group_leaderboard(uuid, integer)
  TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.finish_session_sync(uuid, text, integer, uuid, text, text, timestamptz)
  TO authenticated, service_role;

-- ── 27. RLS ───────────────────────────────────────────────────────────────────
-- Note: server.mjs injects the service_role key which bypasses all RLS.
-- These policies protect any direct anon/authenticated client access.

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

  -- users: public read (for avatar/username display); own row for writes
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='users' AND policyname='users_read_public') THEN
    CREATE POLICY users_read_public ON public.users FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='users' AND policyname='users_own') THEN
    CREATE POLICY users_own ON public.users
      FOR ALL USING (id = auth.uid()) WITH CHECK (id = auth.uid());
  END IF;

  -- user_profiles
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_profiles' AND policyname='profiles_own') THEN
    CREATE POLICY profiles_own ON public.user_profiles
      FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;

  -- user_points: all read (leaderboard); own write
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_points' AND policyname='points_read_all') THEN
    CREATE POLICY points_read_all ON public.user_points FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_points' AND policyname='points_own_write') THEN
    CREATE POLICY points_own_write ON public.user_points
      FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;

  -- user_stats_summary: all read (leaderboard); own write
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_stats_summary' AND policyname='stats_read_all') THEN
    CREATE POLICY stats_read_all ON public.user_stats_summary FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_stats_summary' AND policyname='stats_own_write') THEN
    CREATE POLICY stats_own_write ON public.user_stats_summary
      FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;

  -- daily_user_stats: own rows
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='daily_user_stats' AND policyname='daily_own') THEN
    CREATE POLICY daily_own ON public.daily_user_stats
      FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;

  -- study_sessions_log: own rows
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='study_sessions_log' AND policyname='sessions_own') THEN
    CREATE POLICY sessions_own ON public.study_sessions_log
      FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;

  -- store_items: all read
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='store_items' AND policyname='store_read_all') THEN
    CREATE POLICY store_read_all ON public.store_items FOR SELECT USING (true);
  END IF;

  -- user_inventory: own rows
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_inventory' AND policyname='inventory_own') THEN
    CREATE POLICY inventory_own ON public.user_inventory
      FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;

  -- notifications: own rows
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='notifications' AND policyname='notif_own') THEN
    CREATE POLICY notif_own ON public.notifications
      FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;

  -- user_presence: all auth read; own write
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_presence' AND policyname='presence_read_auth') THEN
    CREATE POLICY presence_read_auth ON public.user_presence
      FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_presence' AND policyname='presence_own_write') THEN
    CREATE POLICY presence_own_write ON public.user_presence
      FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;

  -- groups: public groups readable; members can read private ones; owner writes
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='groups' AND policyname='groups_read_public') THEN
    CREATE POLICY groups_read_public ON public.groups
      FOR SELECT USING (is_public = true AND deleted_at IS NULL);
  END IF;
  -- Always drop+recreate to avoid recursive subquery on group_members
  DROP POLICY IF EXISTS groups_member_read ON public.groups;
  CREATE POLICY groups_member_read ON public.groups
    FOR SELECT USING (public._is_group_member(id, auth.uid()));
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='groups' AND policyname='groups_auth_insert') THEN
    CREATE POLICY groups_auth_insert ON public.groups
      FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='groups' AND policyname='groups_owner_update') THEN
    CREATE POLICY groups_owner_update ON public.groups
      FOR UPDATE USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='groups' AND policyname='groups_owner_delete') THEN
    CREATE POLICY groups_owner_delete ON public.groups
      FOR DELETE USING (owner_id = auth.uid());
  END IF;

  -- group_members: always drop+recreate — old version self-referenced group_members causing recursion
  DROP POLICY IF EXISTS gm_read ON public.group_members;
  CREATE POLICY gm_read ON public.group_members
    FOR SELECT USING (user_id = auth.uid() OR public._is_group_member(group_id, auth.uid()));
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='group_members' AND policyname='gm_insert') THEN
    CREATE POLICY gm_insert ON public.group_members
      FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='group_members' AND policyname='gm_own_delete') THEN
    CREATE POLICY gm_own_delete ON public.group_members
      FOR DELETE USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='group_members' AND policyname='gm_owner_update') THEN
    CREATE POLICY gm_owner_update ON public.group_members
      FOR UPDATE USING (
        user_id = auth.uid()
        OR group_id IN (SELECT id FROM public.groups WHERE owner_id = auth.uid())
      );
  END IF;

  -- group_chat_messages: CRITICAL FIX — INSERT uses user_id not sender_id
  -- Drop any old incorrect INSERT/UPDATE policies referencing sender_id
  DROP POLICY IF EXISTS gchat_send       ON public.group_chat_messages;
  DROP POLICY IF EXISTS gchat_delete_own ON public.group_chat_messages;

  -- group_chat_messages: always drop+recreate to fix recursive subquery
  DROP POLICY IF EXISTS gchat_read ON public.group_chat_messages;
  CREATE POLICY gchat_read ON public.group_chat_messages
    FOR SELECT USING (public._is_group_member(group_id, auth.uid()));
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='group_chat_messages' AND policyname='gchat_insert') THEN
    CREATE POLICY gchat_insert ON public.group_chat_messages
      FOR INSERT WITH CHECK (
        user_id = auth.uid()
        AND group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
      );
  END IF;

  -- group_challenges
  -- group_challenges: always drop+recreate to fix recursive subquery
  DROP POLICY IF EXISTS gchall_read ON public.group_challenges;
  CREATE POLICY gchall_read ON public.group_challenges
    FOR SELECT USING (public._is_group_member(group_id, auth.uid()));
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='group_challenges' AND policyname='gchall_insert') THEN
    CREATE POLICY gchall_insert ON public.group_challenges
      FOR INSERT WITH CHECK (
        created_by = auth.uid()
        AND group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='group_challenges' AND policyname='gchall_update') THEN
    CREATE POLICY gchall_update ON public.group_challenges
      FOR UPDATE USING (created_by = auth.uid());
  END IF;

  -- group_challenge_participants
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='group_challenge_participants' AND policyname='gcpart_own') THEN
    CREATE POLICY gcpart_own ON public.group_challenge_participants
      FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;
  -- group_challenge_participants: always drop+recreate to fix recursive join through group_members
  DROP POLICY IF EXISTS gcpart_read ON public.group_challenge_participants;
  CREATE POLICY gcpart_read ON public.group_challenge_participants
    FOR SELECT USING (
      user_id = auth.uid()
      OR challenge_id IN (
        SELECT gc.id FROM public.group_challenges gc
        WHERE public._is_group_member(gc.group_id, auth.uid())
      )
    );

  -- group_announcements
  -- group_announcements: always drop+recreate to fix recursive subquery
  DROP POLICY IF EXISTS gann_read ON public.group_announcements;
  CREATE POLICY gann_read ON public.group_announcements
    FOR SELECT USING (public._is_group_member(group_id, auth.uid()));
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='group_announcements' AND policyname='gann_write') THEN
    CREATE POLICY gann_write ON public.group_announcements
      FOR ALL USING (author_id = auth.uid()) WITH CHECK (author_id = auth.uid());
  END IF;

  -- group_invites
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
        AND group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='group_invites' AND policyname='ginv_delete') THEN
    CREATE POLICY ginv_delete ON public.group_invites
      FOR DELETE USING (created_by = auth.uid());
  END IF;

  -- group_milestones
  -- group_milestones: always drop+recreate to fix recursive subquery
  DROP POLICY IF EXISTS gmile_read ON public.group_milestones;
  CREATE POLICY gmile_read ON public.group_milestones
    FOR SELECT USING (public._is_group_member(group_id, auth.uid()));

END $$;

-- ── 28. handle_new_user trigger ──────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_username text;
  v_name     text;
  v_email    text;
BEGIN
  v_username := COALESCE(
    NULLIF(trim(NEW.raw_user_meta_data->>'username'), ''),
    split_part(COALESCE(NEW.email,''), '@', 1),
    'user_' || left(NEW.id::text, 8)
  );
  v_name  := COALESCE(NULLIF(trim(NEW.raw_user_meta_data->>'name'), ''), v_username);
  v_email := COALESCE(NEW.email, v_username || '@isotope.local');

  INSERT INTO public.users (
    id, email, name, username,
    plan_type, billing_status, plan_expires_at, access_ends_at
  ) VALUES (
    NEW.id, v_email, v_name, v_username,
    'ranker', 'active',
    '2099-12-31 23:59:59+00', '2099-12-31 23:59:59+00'
  )
  ON CONFLICT (id) DO UPDATE SET
    username        = EXCLUDED.username,
    name            = COALESCE(EXCLUDED.name, users.name),
    -- plan_type intentionally excluded: preserve existing value so a manual
    -- upgrade to 'premium' is not silently overwritten on re-trigger.
    billing_status  = 'active',
    plan_expires_at = '2099-12-31 23:59:59+00',
    access_ends_at  = '2099-12-31 23:59:59+00',
    updated_at      = now();

  INSERT INTO public.user_profiles (user_id, profile_data)
    VALUES (NEW.id, '{}') ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.user_points (user_id, points, lifetime_points)
    VALUES (NEW.id, 0, 0)   ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.user_stats_summary (
    user_id, total_study_seconds, streak_days, max_streak_days, session_count
  ) VALUES (NEW.id, 0, 0, 0, 0) ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.user_presence (user_id, status, last_seen)
    VALUES (NEW.id, 'offline', now()) ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── 29. Backfill existing users ───────────────────────────────────────────────

-- Everyone gets ranker plan
UPDATE public.users
SET
  plan_type       = 'ranker',
  billing_status  = 'active',
  plan_expires_at = '2099-12-31 23:59:59+00'::timestamptz,
  access_ends_at  = '2099-12-31 23:59:59+00'::timestamptz,
  updated_at      = now()
WHERE plan_type IS DISTINCT FROM 'ranker'
   OR billing_status IS DISTINCT FROM 'active'
   OR plan_expires_at IS NULL;

-- Backfill username from auth metadata / email
UPDATE public.users u
SET username = COALESCE(
  NULLIF(trim(au.raw_user_meta_data->>'username'), ''),
  split_part(u.email, '@', 1)
)
FROM auth.users au
WHERE au.id = u.id AND (u.username IS NULL OR trim(u.username) = '');

UPDATE public.users
SET username = split_part(email, '@', 1)
WHERE (username IS NULL OR trim(username) = '') AND email IS NOT NULL;

-- Seed missing rows in satellite tables
INSERT INTO public.user_points (user_id, points, lifetime_points)
  SELECT id, 0, 0 FROM public.users
  WHERE NOT EXISTS (SELECT 1 FROM public.user_points WHERE user_id = users.id)
  ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.user_stats_summary (
  user_id, total_study_seconds, streak_days, max_streak_days, session_count
)
  SELECT id, 0, 0, 0, 0 FROM public.users
  WHERE NOT EXISTS (SELECT 1 FROM public.user_stats_summary WHERE user_id = users.id)
  ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.user_profiles (user_id, profile_data)
  SELECT id, '{}' FROM public.users
  WHERE NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE user_id = users.id)
  ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.user_presence (user_id, status, last_seen)
  SELECT id, 'offline', now() FROM public.users
  WHERE NOT EXISTS (SELECT 1 FROM public.user_presence WHERE user_id = users.id)
  ON CONFLICT (user_id) DO NOTHING;

-- ── Done ─────────────────────────────────────────────────────────────────────
-- community-patch-v4 applied successfully.
-- Verify: SELECT username, plan_type FROM public.users LIMIT 10;
-- ============================================================================

-- ============================================================================
-- PATCH v5 ADDITIONS — community events, helpers, realtime
-- ============================================================================

-- ── 30. community_events ──────────────────────────────────────────────────────
-- JS reads: id, title, event_type, description, host, start_time, end_time,
--           image_gradient, tags, max_attendees, is_featured, is_active

CREATE TABLE IF NOT EXISTS public.community_events (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title          text        NOT NULL DEFAULT '',
  event_type     text        NOT NULL DEFAULT 'webinar',
  description    text,
  host           text,
  start_time     timestamptz NOT NULL DEFAULT now(),
  end_time       timestamptz,
  image_gradient text        NOT NULL DEFAULT 'from-purple-600 to-blue-500',
  tags           text[]      NOT NULL DEFAULT '{}',
  max_attendees  integer,
  attendee_count integer     NOT NULL DEFAULT 0,
  is_featured    boolean     NOT NULL DEFAULT false,
  is_active      boolean     NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.community_events ADD COLUMN IF NOT EXISTS title          text        NOT NULL DEFAULT '';
ALTER TABLE public.community_events ADD COLUMN IF NOT EXISTS event_type     text        NOT NULL DEFAULT 'webinar';
ALTER TABLE public.community_events ADD COLUMN IF NOT EXISTS description    text;
ALTER TABLE public.community_events ADD COLUMN IF NOT EXISTS host           text;
ALTER TABLE public.community_events ADD COLUMN IF NOT EXISTS start_time     timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.community_events ADD COLUMN IF NOT EXISTS end_time       timestamptz;
ALTER TABLE public.community_events ADD COLUMN IF NOT EXISTS image_gradient text        NOT NULL DEFAULT 'from-purple-600 to-blue-500';
ALTER TABLE public.community_events ADD COLUMN IF NOT EXISTS tags           text[]      NOT NULL DEFAULT '{}';
ALTER TABLE public.community_events ADD COLUMN IF NOT EXISTS max_attendees  integer;
ALTER TABLE public.community_events ADD COLUMN IF NOT EXISTS attendee_count integer     NOT NULL DEFAULT 0;
ALTER TABLE public.community_events ADD COLUMN IF NOT EXISTS is_featured    boolean     NOT NULL DEFAULT false;
ALTER TABLE public.community_events ADD COLUMN IF NOT EXISTS is_active      boolean     NOT NULL DEFAULT true;
ALTER TABLE public.community_events ADD COLUMN IF NOT EXISTS created_at     timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_ce_active_time ON public.community_events (is_active, start_time);
CREATE INDEX IF NOT EXISTS idx_ce_featured    ON public.community_events (is_featured) WHERE is_featured = true;

ALTER TABLE public.community_events ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='community_events' AND policyname='ce_read_public') THEN
    CREATE POLICY ce_read_public ON public.community_events
      FOR SELECT USING (is_active = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='community_events' AND policyname='ce_service_write') THEN
    CREATE POLICY ce_service_write ON public.community_events
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- ── 31. community_event_attendees ─────────────────────────────────────────────
-- JS reads/inserts: event_id, user_id, joined_at

CREATE TABLE IF NOT EXISTS public.community_event_attendees (
  event_id  uuid        NOT NULL REFERENCES public.community_events(id) ON DELETE CASCADE,
  user_id   uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (event_id, user_id)
);

ALTER TABLE public.community_event_attendees ADD COLUMN IF NOT EXISTS joined_at timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_cea_event ON public.community_event_attendees (event_id);
CREATE INDEX IF NOT EXISTS idx_cea_user  ON public.community_event_attendees (user_id);

ALTER TABLE public.community_event_attendees ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='community_event_attendees' AND policyname='cea_read_auth') THEN
    CREATE POLICY cea_read_auth ON public.community_event_attendees
      FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='community_event_attendees' AND policyname='cea_own') THEN
    CREATE POLICY cea_own ON public.community_event_attendees
      FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- ── 32. RPC: join_community_event ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.join_community_event(p_event_id uuid)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_evt public.community_events%ROWTYPE;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Not authenticated');
  END IF;
  SELECT * INTO v_evt FROM public.community_events WHERE id = p_event_id;
  IF NOT FOUND OR NOT v_evt.is_active THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Event not found or inactive');
  END IF;
  INSERT INTO public.community_event_attendees (event_id, user_id)
  VALUES (p_event_id, v_uid)
  ON CONFLICT (event_id, user_id) DO NOTHING;
  UPDATE public.community_events
    SET attendee_count = (SELECT COUNT(*) FROM public.community_event_attendees WHERE event_id = p_event_id)
  WHERE id = p_event_id;
  RETURN jsonb_build_object('ok', true);
END;
$$;

-- ── 33. RPC: leave_community_event ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.leave_community_event(p_event_id uuid)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Not authenticated');
  END IF;
  DELETE FROM public.community_event_attendees WHERE event_id = p_event_id AND user_id = v_uid;
  UPDATE public.community_events
    SET attendee_count = (SELECT COUNT(*) FROM public.community_event_attendees WHERE event_id = p_event_id)
  WHERE id = p_event_id;
  RETURN jsonb_build_object('ok', true);
END;
$$;

-- ── 34. Helper: _is_group_member (prevents RLS recursion) ─────────────────────
-- SECURITY DEFINER so it runs elevated, avoiding infinite recursion when
-- group_members RLS policies call back into group_members.
CREATE OR REPLACE FUNCTION public._is_group_member(gid uuid, uid uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members WHERE group_id = gid AND user_id = uid
  );
$$;

-- ── 35. GRANT EXECUTE on new RPCs ─────────────────────────────────────────────
GRANT EXECUTE ON FUNCTION public.join_community_event(uuid)  TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.leave_community_event(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public._is_group_member(uuid, uuid) TO anon, authenticated, service_role;

-- ── 36. Supabase Realtime — enable key tables ─────────────────────────────────
DO $$
BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.group_chat_messages;        EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.user_presence;              EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;              EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.community_events;           EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.community_event_attendees;  EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.groups;                     EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.group_members;              EXCEPTION WHEN OTHERS THEN NULL; END;
END $$;

-- ── 37. Seed: community_events ────────────────────────────────────────────────
-- Insert default events — idempotent (skips if title already exists).
INSERT INTO public.community_events
  (title, event_type, description, host, start_time, end_time, image_gradient, tags, max_attendees, is_featured, is_active)
SELECT v.title, v.event_type, v.description, v.host,
       v.start_time::timestamptz, v.end_time::timestamptz,
       v.image_gradient, v.tags::text[], v.max_attendees, v.is_featured, true
FROM (VALUES
  ('JEE Advanced Strategy Session',
   'webinar',
   'Expert breakdown of JEE Advanced paper pattern, high-weightage topics, and last-minute revision strategy.',
   'Prof. Anupam Gupta',
   (now() + interval '3 days')::text, (now() + interval '3 days' + interval '2 hours')::text,
   'from-violet-600 to-indigo-500',
   '{JEE,Strategy,Physics,Chemistry,Maths}',
   500, true),
  ('NEET Biology Deep Dive',
   'workshop',
   'Intensive workshop: Genetics, Ecology, Human Physiology — the chapters that decide NEET ranks.',
   'Dr. Priya Sharma',
   (now() + interval '5 days')::text, (now() + interval '5 days' + interval '3 hours')::text,
   'from-emerald-600 to-teal-500',
   '{NEET,Biology,Genetics,Ecology}',
   300, true),
  ('Physics Problem-Solving Workshop',
   'workshop',
   'Live problem solving for Mechanics, Electrostatics and Modern Physics. Bring your toughest doubts.',
   'IIT Alumni Study Group',
   (now() + interval '7 days')::text, (now() + interval '7 days' + interval '2 hours')::text,
   'from-blue-600 to-cyan-500',
   '{Physics,Mechanics,Electrostatics,JEE}',
   200, false),
  ('Weekly Community Study Session',
   'study_session',
   'Join 200+ students for a focused 2-hour session with Pomodoro timer and live leaderboard.',
   'IsotopeAI Community',
   (now() + interval '1 day')::text, (now() + interval '1 day' + interval '2 hours')::text,
   'from-purple-600 to-pink-500',
   '{Community,Focus,Leaderboard}',
   NULL, true),
  ('Chemistry Organic Reaction Masterclass',
   'webinar',
   'Complete walkthrough of Name Reactions, Mechanisms and shortcuts for Organic Chemistry.',
   'Dr. Rahul Verma',
   (now() + interval '10 days')::text, (now() + interval '10 days' + interval '2 hours')::text,
   'from-orange-600 to-amber-500',
   '{Chemistry,Organic,JEE,NEET}',
   400, false),
  ('Mathematics Integration & Calculus Sprint',
   'workshop',
   'Speed math for Integration, Differential Equations and limits — shortcuts that save 5+ minutes.',
   'Ishaan Arora (IIT Bombay 2023)',
   (now() + interval '14 days')::text, (now() + interval '14 days' + interval '90 minutes')::text,
   'from-rose-600 to-red-500',
   '{Maths,Calculus,JEE,Integration}',
   250, false)
) AS v(title, event_type, description, host, start_time, end_time, image_gradient, tags, max_attendees, is_featured)
WHERE NOT EXISTS (SELECT 1 FROM public.community_events ce WHERE ce.title = v.title);

-- ── v6: Fix missing columns & conflicting function signatures ─────────────────
-- Safe to re-run (idempotent).

-- 1. Add started_at to study_sessions_log (was in CREATE TABLE but missed in ALTER TABLE)
ALTER TABLE public.study_sessions_log
  ADD COLUMN IF NOT EXISTS started_at timestamptz NOT NULL DEFAULT now();

-- 2. Re-seed community_events (safe — WHERE NOT EXISTS guard)
INSERT INTO public.community_events
  (title, event_type, description, host, start_time, end_time, image_gradient, tags, max_attendees, is_featured)
SELECT v.title, v.event_type::text, v.description, v.host,
       v.start_time::timestamptz, v.end_time::timestamptz,
       v.image_gradient, v.tags::text[], v.max_attendees::integer, v.is_featured::boolean
FROM (VALUES
  ('JEE Main Mock Test — Full Syllabus',
   'mock_test',
   'Full-length JEE Main mock with instant AI-powered analysis. Covers Physics, Chemistry and Mathematics.',
   'IsotopeAI Team',
   (now() + interval '2 days')::text, (now() + interval '2 days' + interval '3 hours')::text,
   'from-violet-600 to-indigo-500',
   '{JEE,Mock,Physics,Chemistry,Maths}',
   '500', 'true'),
  ('NEET Biology Speed Revision',
   'workshop',
   'Rapid-fire revision of the entire NEET Biology syllabus — Botany & Zoology in 90 minutes.',
   'Dr. Priya Sharma',
   (now() + interval '4 days')::text, (now() + interval '4 days' + interval '90 minutes')::text,
   'from-green-600 to-teal-500',
   '{NEET,Biology,Revision}',
   '300', 'false'),
  ('Physics Numericals Marathon',
   'workshop',
   'Solve 50+ JEE-level numericals live. Mechanics, Electrostatics & Modern Physics.',
   'Prof. Aakash Mehta',
   (now() + interval '6 days')::text, (now() + interval '6 days' + interval '2 hours')::text,
   'from-blue-600 to-cyan-500',
   '{Physics,Mechanics,Electrostatics,JEE}',
   '200', 'false'),
  ('Weekly Community Study Session',
   'study_session',
   'Join 200+ students for a focused 2-hour session with Pomodoro timer and live leaderboard.',
   'IsotopeAI Community',
   (now() + interval '1 day')::text, (now() + interval '1 day' + interval '2 hours')::text,
   'from-purple-600 to-pink-500',
   '{Community,Focus,Leaderboard}',
   NULL, 'true'),
  ('Chemistry Organic Reaction Masterclass',
   'webinar',
   'Complete walkthrough of Name Reactions, Mechanisms and shortcuts for Organic Chemistry.',
   'Dr. Rahul Verma',
   (now() + interval '10 days')::text, (now() + interval '10 days' + interval '2 hours')::text,
   'from-orange-600 to-amber-500',
   '{Chemistry,Organic,JEE,NEET}',
   '400', 'false'),
  ('Mathematics Integration & Calculus Sprint',
   'workshop',
   'Speed math for Integration, Differential Equations and limits — shortcuts that save 5+ minutes.',
   'Ishaan Arora (IIT Bombay 2023)',
   (now() + interval '14 days')::text, (now() + interval '14 days' + interval '90 minutes')::text,
   'from-rose-600 to-red-500',
   '{Maths,Calculus,JEE,Integration}',
   '250', 'false')
) AS v(title, event_type, description, host, start_time, end_time, image_gradient, tags, max_attendees, is_featured)
WHERE NOT EXISTS (SELECT 1 FROM public.community_events ce WHERE ce.title = v.title);

-- 3. Drop get_group_leaderboard so isotope-schema.sql can recreate it with
--    the points-based return type (community-patch used hours-based columns).
DROP FUNCTION IF EXISTS public.get_group_leaderboard(uuid, integer);

-- Recreate with points-based columns (matches what the JS client expects)
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
  JOIN public.users u             ON u.id       = gm.user_id
  LEFT JOIN public.user_points up ON up.user_id = gm.user_id
  WHERE gm.group_id = p_group_id
  ORDER BY COALESCE(up.points,0) DESC
  LIMIT p_limit;
$$;

GRANT EXECUTE ON FUNCTION public.get_group_leaderboard(uuid, integer) TO authenticated, anon;

-- ── v7: Drop legacy self-referential RLS policies (RLS recursion fix) ────────
-- These pre-existing policies use `SELECT ... FROM group_members` in subqueries
-- that cause PostgreSQL error 42P17 (infinite recursion). The v4 patch added
-- new policies using _is_group_member() but didn't drop these old ones.
-- Safe to re-run (IF EXISTS guards).

-- group_members: legacy self-referential SELECT policy
DROP POLICY IF EXISTS gm_read_members ON public.group_members;

-- group_chat_messages: legacy policy that references group_members subquery
DROP POLICY IF EXISTS gchat_read_members ON public.group_chat_messages;

-- group_challenge_participants: legacy policy that joins group_members
DROP POLICY IF EXISTS gcpart_read_members ON public.group_challenge_participants;

-- ── Done (v7) ─────────────────────────────────────────────────────────────────
-- Verify at: /__admin/verify  (should show 57/57 ALL CLEAR)
-- ============================================================================

-- ============================================================================
-- PATCH v7 — Events admin CRUD RPCs, updated_at/image_url columns, date refresh
-- ============================================================================

-- ── 38. New columns on community_events ──────────────────────────────────────
ALTER TABLE public.community_events ADD COLUMN IF NOT EXISTS updated_at  timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.community_events ADD COLUMN IF NOT EXISTS image_url   text;
-- creator_id optional FK — tracks which admin user created the event
ALTER TABLE public.community_events ADD COLUMN IF NOT EXISTS creator_id  uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Backfill updated_at for existing rows
UPDATE public.community_events SET updated_at = created_at WHERE updated_at = now() AND created_at < now() - interval '1 minute';

-- ── 39. RPC: create_community_event ──────────────────────────────────────────
-- Used by /__admin/events panel (service_role). Validates and inserts.
CREATE OR REPLACE FUNCTION public.create_community_event(
  p_title          text,
  p_event_type     text        DEFAULT 'webinar',
  p_description    text        DEFAULT NULL,
  p_host           text        DEFAULT NULL,
  p_start_time     timestamptz DEFAULT now(),
  p_end_time       timestamptz DEFAULT NULL,
  p_image_gradient text        DEFAULT 'from-purple-600 to-blue-500',
  p_image_url      text        DEFAULT NULL,
  p_tags           text[]      DEFAULT '{}',
  p_max_attendees  integer     DEFAULT NULL,
  p_is_featured    boolean     DEFAULT false,
  p_is_active      boolean     DEFAULT true
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
BEGIN
  IF p_title IS NULL OR trim(p_title) = '' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'title is required');
  END IF;
  INSERT INTO public.community_events
    (title, event_type, description, host, start_time, end_time, image_gradient, image_url,
     tags, max_attendees, is_featured, is_active, attendee_count, updated_at)
  VALUES
    (trim(p_title), p_event_type, p_description, p_host, p_start_time, p_end_time,
     p_image_gradient, p_image_url, COALESCE(p_tags,'{}'), p_max_attendees,
     p_is_featured, p_is_active, 0, now())
  RETURNING id INTO v_id;
  RETURN jsonb_build_object('ok', true, 'id', v_id);
END;
$$;

-- ── 40. RPC: update_community_event ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.update_community_event(
  p_id             uuid,
  p_title          text        DEFAULT NULL,
  p_event_type     text        DEFAULT NULL,
  p_description    text        DEFAULT NULL,
  p_host           text        DEFAULT NULL,
  p_start_time     timestamptz DEFAULT NULL,
  p_end_time       timestamptz DEFAULT NULL,
  p_image_gradient text        DEFAULT NULL,
  p_image_url      text        DEFAULT NULL,
  p_tags           text[]      DEFAULT NULL,
  p_max_attendees  integer     DEFAULT NULL,
  p_is_featured    boolean     DEFAULT NULL,
  p_is_active      boolean     DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_found boolean;
BEGIN
  SELECT EXISTS(SELECT 1 FROM public.community_events WHERE id = p_id) INTO v_found;
  IF NOT v_found THEN RETURN jsonb_build_object('ok', false, 'error', 'Event not found'); END IF;
  UPDATE public.community_events SET
    title          = COALESCE(p_title,          title),
    event_type     = COALESCE(p_event_type,     event_type),
    description    = COALESCE(p_description,    description),
    host           = COALESCE(p_host,           host),
    start_time     = COALESCE(p_start_time,     start_time),
    end_time       = COALESCE(p_end_time,       end_time),
    image_gradient = COALESCE(p_image_gradient, image_gradient),
    image_url      = COALESCE(p_image_url,      image_url),
    tags           = COALESCE(p_tags,           tags),
    max_attendees  = COALESCE(p_max_attendees,  max_attendees),
    is_featured    = COALESCE(p_is_featured,    is_featured),
    is_active      = COALESCE(p_is_active,      is_active),
    updated_at     = now()
  WHERE id = p_id;
  RETURN jsonb_build_object('ok', true);
END;
$$;

-- ── 41. RPC: delete_community_event ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.delete_community_event(p_id uuid)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.community_events WHERE id = p_id;
  RETURN jsonb_build_object('ok', true, 'deleted', FOUND);
END;
$$;

-- ── 42. RPC: get_event_attendees ──────────────────────────────────────────────
-- Returns attendees for an event with user info. Used by event detail views.
CREATE OR REPLACE FUNCTION public.get_event_attendees(p_event_id uuid)
RETURNS TABLE(user_id uuid, username text, name text, joined_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT cea.user_id, u.username, u.name, cea.joined_at
  FROM   public.community_event_attendees cea
  LEFT JOIN public.users u ON u.id = cea.user_id
  WHERE  cea.event_id = p_event_id
  ORDER  BY cea.joined_at ASC;
$$;

-- ── 43. GRANT new RPCs ────────────────────────────────────────────────────────
-- create/update/delete: service_role only (admin panel uses service_role key)
-- get_event_attendees: authenticated + service_role
GRANT EXECUTE ON FUNCTION public.create_community_event(text,text,text,text,timestamptz,timestamptz,text,text,text[],integer,boolean,boolean) TO service_role;
GRANT EXECUTE ON FUNCTION public.update_community_event(uuid,text,text,text,text,timestamptz,timestamptz,text,text,text[],integer,boolean,boolean) TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_community_event(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_event_attendees(uuid) TO authenticated, service_role;

-- ── 44. Refresh stale event dates ─────────────────────────────────────────────
-- All events whose start_time is in the past are pushed forward with increasing
-- day offsets (1, 2, 3, 4, 5, 7, 10, 14 days from now). Idempotent: safe to re-run.
DO $$
DECLARE
  v_rec     RECORD;
  v_idx     integer := 0;
  v_offsets integer[] := ARRAY[1,2,3,4,5,7,10,14];
  v_new_start timestamptz;
  v_new_end   timestamptz;
  v_duration  interval;
BEGIN
  FOR v_rec IN
    SELECT id, start_time, end_time
    FROM   public.community_events
    WHERE  start_time < now()
    ORDER  BY start_time ASC
  LOOP
    v_new_start := now() + (v_offsets[(v_idx % 8) + 1] || ' days')::interval;
    IF v_rec.end_time IS NOT NULL AND v_rec.end_time > v_rec.start_time THEN
      v_duration := v_rec.end_time - v_rec.start_time;
      v_new_end  := v_new_start + v_duration;
    ELSE
      v_new_end := v_new_start + interval '2 hours';
    END IF;
    UPDATE public.community_events
    SET    start_time = v_new_start,
           end_time   = v_new_end,
           updated_at = now()
    WHERE  id = v_rec.id;
    v_idx := v_idx + 1;
  END LOOP;
END $$;

-- ── v7 done ───────────────────────────────────────────────────────────────────
-- community-patch-v4 + patches v5/v6/v7 fully applied.
-- New: updated_at, image_url, creator_id columns on community_events.
-- New RPCs: create_community_event, update_community_event, delete_community_event, get_event_attendees.
-- All past event dates refreshed to future.
-- ============================================================================

-- ============================================================================
-- PATCH v8 — Full autodiscovery gap-fill, hardening & idempotency bulletproof
-- ============================================================================
-- Run AFTER v4-v7 sections. Fully idempotent — safe to re-run.
-- Fixes: conflicting function overloads, missing columns/tables/view,
--        all 20 production indexes, cascade FKs, new RPCs, cleaned triggers.

-- ── STEP 1: Drop all conflicting function overloads ───────────────────────────
-- Must come first so later CREATE OR REPLACE doesn't fail on return-type change.
DROP FUNCTION IF EXISTS public.finish_session_sync(uuid, text, integer, uuid, text, text, timestamptz);
DROP FUNCTION IF EXISTS public.finish_session_sync(uuid, text, integer, text, text, uuid);
DROP FUNCTION IF EXISTS public.get_group_analytics_from_snapshots(uuid);
DROP FUNCTION IF EXISTS public.get_group_analytics_from_snapshots(uuid, integer);
DROP FUNCTION IF EXISTS public.is_premium_user();
DROP FUNCTION IF EXISTS public.is_premium_user(uuid);
DROP FUNCTION IF EXISTS public.get_event_attendees(uuid);

-- ── STEP 2: Missing columns on existing tables ────────────────────────────────
-- community_events: host_user_id (discovered via autodiscovery, not in v4-v7)
ALTER TABLE public.community_events ADD COLUMN IF NOT EXISTS host_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
-- group_members: is_super_admin flag
ALTER TABLE public.group_members ADD COLUMN IF NOT EXISTS is_super_admin boolean NOT NULL DEFAULT false;

-- ── STEP 3: user_settings table ───────────────────────────────────────────────
-- Stores per-user app settings as JSONB. Used by settings panel.
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id    uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  settings   jsonb       NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_settings' AND policyname='usettings_own') THEN
    CREATE POLICY usettings_own ON public.user_settings FOR ALL USING (user_id=auth.uid()) WITH CHECK (user_id=auth.uid());
  END IF;
END $$;

-- ── STEP 4: user_roles table ──────────────────────────────────────────────────
-- Stores admin/moderator roles. Used by check_user_role / get_my_role RPCs.
CREATE TABLE IF NOT EXISTS public.user_roles (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       text        NOT NULL DEFAULT 'user',
  granted_by uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  granted_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_roles_user_role ON public.user_roles(user_id, role);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_roles' AND policyname='uroles_service_write') THEN
    CREATE POLICY uroles_service_write ON public.user_roles FOR ALL USING (auth.role()='service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_roles' AND policyname='uroles_own_read') THEN
    CREATE POLICY uroles_own_read ON public.user_roles FOR SELECT USING (user_id=auth.uid());
  END IF;
END $$;

-- ── STEP 5: community_events_with_counts view ─────────────────────────────────
-- Joins community_events with live attendee_count from community_event_attendees.
DROP VIEW IF EXISTS public.community_events_with_counts;
CREATE VIEW public.community_events_with_counts AS
  SELECT e.*,
    COALESCE(a.cnt, 0)::integer AS attendee_count_live
  FROM public.community_events e
  LEFT JOIN (
    SELECT event_id, count(*)::integer AS cnt
    FROM public.community_event_attendees
    GROUP BY event_id
  ) a ON a.event_id = e.id;

-- ── STEP 6: Production indexes (all idempotent) ────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_gchat_group_ts   ON public.group_chat_messages(group_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gchat_user_v8    ON public.group_chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_gmembers_gu_v8   ON public.group_members(group_id, user_id);
CREATE INDEX IF NOT EXISTS idx_gmembers_u_v8    ON public.group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_notif_user_ts_v8 ON public.notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notif_unread_v8  ON public.notifications(user_id, read_at) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_events_active_v8 ON public.community_events(is_active, start_time ASC) WHERE is_active=true;
CREATE INDEX IF NOT EXISTS idx_event_att_ev_v8  ON public.community_event_attendees(event_id, user_id);
CREATE INDEX IF NOT EXISTS idx_challenges_g_v8  ON public.group_challenges(group_id, is_active) WHERE is_active=true;
CREATE INDEX IF NOT EXISTS idx_chall_parts_v8   ON public.group_challenge_participants(challenge_id, user_id);
CREATE INDEX IF NOT EXISTS idx_daily_stats_v8   ON public.daily_user_stats(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_u_v8    ON public.study_sessions_log(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stats_hrs_v8     ON public.user_stats_summary(total_hours DESC);
CREATE INDEX IF NOT EXISTS idx_invites_code_v8  ON public.group_invites(invite_code);
CREATE INDEX IF NOT EXISTS idx_invites_tok_v8   ON public.group_invites(token);
CREATE INDEX IF NOT EXISTS idx_inventory_u_v8   ON public.user_inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_store_act_v8     ON public.store_items(active, category);
CREATE INDEX IF NOT EXISTS idx_presence_s_v8    ON public.user_presence(status, last_seen DESC);
CREATE INDEX IF NOT EXISTS idx_user_roles_u     ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sett_u      ON public.user_settings(user_id);

-- ── STEP 7: Cascade FK constraints ────────────────────────────────────────────
ALTER TABLE public.group_chat_messages DROP CONSTRAINT IF EXISTS group_chat_messages_group_id_fkey;
ALTER TABLE public.group_chat_messages ADD CONSTRAINT group_chat_messages_group_id_fkey
  FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE;
ALTER TABLE public.group_members DROP CONSTRAINT IF EXISTS group_members_group_id_fkey;
ALTER TABLE public.group_members ADD CONSTRAINT group_members_group_id_fkey
  FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE;
ALTER TABLE public.group_challenge_participants DROP CONSTRAINT IF EXISTS group_challenge_participants_challenge_id_fkey;
ALTER TABLE public.group_challenge_participants ADD CONSTRAINT group_challenge_participants_challenge_id_fkey
  FOREIGN KEY (challenge_id) REFERENCES public.group_challenges(id) ON DELETE CASCADE;
ALTER TABLE public.community_event_attendees DROP CONSTRAINT IF EXISTS cea_event_user_unique;
ALTER TABLE public.community_event_attendees ADD CONSTRAINT cea_event_user_unique UNIQUE (event_id, user_id);

-- ── STEP 8: _is_group_member helper (RLS recursion prevention) ───────────────
CREATE OR REPLACE FUNCTION public._is_group_member(gid uuid, uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $f$
  SELECT EXISTS(SELECT 1 FROM public.group_members WHERE group_id=gid AND user_id=uid);
$f$;
GRANT EXECUTE ON FUNCTION public._is_group_member(uuid,uuid) TO anon, authenticated, service_role;

-- ── STEP 9: is_premium_user (both overloads — always returns true) ────────────
CREATE OR REPLACE FUNCTION public.is_premium_user()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER AS $f$ SELECT true; $f$;
CREATE OR REPLACE FUNCTION public.is_premium_user(uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER AS $f$ SELECT true; $f$;
GRANT EXECUTE ON FUNCTION public.is_premium_user()     TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_premium_user(uuid) TO anon, authenticated, service_role;

-- ── STEP 10: get_group_analytics_from_snapshots (single 2-param version) ──────
CREATE OR REPLACE FUNCTION public.get_group_analytics_from_snapshots(p_group_id uuid, p_days integer DEFAULT 7)
RETURNS TABLE(study_date date, total_seconds bigint, member_count bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $f$
  SELECT d.date AS study_date,
    COALESCE(SUM(d.seconds_studied),0) AS total_seconds,
    COUNT(DISTINCT d.user_id) AS member_count
  FROM public.daily_user_stats d
  JOIN public.group_members gm ON gm.user_id=d.user_id AND gm.group_id=p_group_id
  WHERE d.date >= CURRENT_DATE - (p_days-1)
  GROUP BY d.date ORDER BY d.date ASC;
$f$;
GRANT EXECUTE ON FUNCTION public.get_group_analytics_from_snapshots(uuid,integer)
  TO authenticated, anon, service_role;

-- ── STEP 11: get_event_attendees (with avatar_url) ────────────────────────────
CREATE OR REPLACE FUNCTION public.get_event_attendees(p_event_id uuid)
RETURNS TABLE(user_id uuid, username text, name text, avatar_url text, joined_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $f$
  SELECT cea.user_id, u.username, u.name, u.avatar_url, cea.joined_at
  FROM public.community_event_attendees cea
  LEFT JOIN public.users u ON u.id=cea.user_id
  WHERE cea.event_id=p_event_id ORDER BY cea.joined_at ASC;
$f$;
GRANT EXECUTE ON FUNCTION public.get_event_attendees(uuid) TO authenticated, service_role;

-- ── STEP 12: finish_session_sync (canonical single-overload version) ──────────
-- Named params MUST match what the browser fetch override sends:
--   {p_session_id, p_action, p_duration_minutes, p_group_id, p_session_type, p_notes, p_ended_at}
-- Uses only confirmed-safe column names: study_sessions_log.{id,user_id,duration_minutes,ended_at}
-- daily_user_stats.{user_id,date,seconds_studied}
-- Drop any previous mismatched overloads first
DROP FUNCTION IF EXISTS public.finish_session_sync(uuid, text, integer, text, text, uuid);
DROP FUNCTION IF EXISTS public.finish_session_sync(uuid, text, integer, uuid, text, text, text);
CREATE OR REPLACE FUNCTION public.finish_session_sync(
  p_session_id       uuid        DEFAULT NULL,
  p_action           text        DEFAULT 'complete',
  p_duration_minutes integer     DEFAULT 0,
  p_group_id         uuid        DEFAULT NULL,
  p_session_type     text        DEFAULT 'focus',
  p_notes            text        DEFAULT NULL,
  p_ended_at         timestamptz DEFAULT NULL
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $f$
DECLARE
  v_uid       uuid    := auth.uid();
  v_today     date    := CURRENT_DATE;
  v_secs      bigint;
  v_hrs       numeric;
  v_row_count bigint;
  v_was_found boolean;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('error', 'Not authenticated');
  END IF;
  IF p_action = 'delete' THEN
    DELETE FROM public.study_sessions_log WHERE id = p_session_id AND user_id = v_uid;
    v_was_found := FOUND;
    RETURN jsonb_build_object('already_absent', NOT v_was_found,
      'affected_group_ids', CASE WHEN p_group_id IS NOT NULL
        THEN jsonb_build_array(p_group_id) ELSE '[]'::jsonb END,
      'challenge_updates', '[]'::jsonb);
  END IF;
  v_secs := GREATEST(0, p_duration_minutes) * 60;
  v_hrs  := round(p_duration_minutes::numeric / 60, 4);
  IF p_session_id IS NOT NULL THEN
    INSERT INTO public.study_sessions_log (id, user_id, duration_minutes, ended_at)
    VALUES (p_session_id, v_uid, p_duration_minutes, COALESCE(p_ended_at, now()))
    ON CONFLICT (id) DO NOTHING;
    GET DIAGNOSTICS v_row_count = ROW_COUNT;
    IF v_row_count = 0 THEN
      RETURN jsonb_build_object('already_processed', true,
        'affected_group_ids', '[]'::jsonb, 'challenge_updates', '[]'::jsonb);
    END IF;
  END IF;
  INSERT INTO public.daily_user_stats (user_id, date, seconds_studied)
  VALUES (v_uid, v_today, v_secs)
  ON CONFLICT (user_id, date) DO UPDATE
    SET seconds_studied = daily_user_stats.seconds_studied + EXCLUDED.seconds_studied;
  INSERT INTO public.user_stats_summary
    (user_id, total_study_seconds, total_hours, weekly_hours, monthly_hours,
     session_count, total_sessions, last_session_at, last_study_date, updated_at)
  VALUES (v_uid, v_secs, v_hrs, v_hrs, v_hrs, 1, 1, COALESCE(p_ended_at, now()), v_today, now())
  ON CONFLICT (user_id) DO UPDATE SET
    total_study_seconds = user_stats_summary.total_study_seconds + v_secs,
    total_hours         = round((user_stats_summary.total_study_seconds + v_secs)::numeric/3600,2),
    weekly_hours        = user_stats_summary.weekly_hours  + v_hrs,
    monthly_hours       = user_stats_summary.monthly_hours + v_hrs,
    session_count       = user_stats_summary.session_count  + 1,
    total_sessions      = user_stats_summary.total_sessions + 1,
    last_session_at     = COALESCE(p_ended_at, now()),
    last_study_date     = v_today,
    updated_at          = now();
  RETURN jsonb_build_object('already_processed', false,
    'affected_group_ids', CASE WHEN p_group_id IS NOT NULL
      THEN jsonb_build_array(p_group_id) ELSE '[]'::jsonb END,
    'challenge_updates', '[]'::jsonb);
END; $f$;
GRANT EXECUTE ON FUNCTION public.finish_session_sync(uuid, text, integer, uuid, text, text, timestamptz)
  TO authenticated, service_role;

-- ── STEP 13: expire_stale_presence ───────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.expire_stale_presence()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $f$
BEGIN
  UPDATE public.user_presence SET status='offline'
  WHERE status != 'offline' AND last_seen < now() - interval '2 minutes';
END; $f$;
GRANT EXECUTE ON FUNCTION public.expire_stale_presence() TO service_role;

-- ── STEP 14: purchase_store_item (atomic, coin-deducting) ─────────────────────
CREATE OR REPLACE FUNCTION public.purchase_store_item(p_user_id uuid, p_item_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $f$
DECLARE
  v_item   public.store_items%ROWTYPE;
  v_pts    integer;
  v_owned  boolean;
BEGIN
  SELECT * INTO v_item FROM public.store_items WHERE id=p_item_id AND active=true;
  IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'error','item_not_found'); END IF;
  SELECT EXISTS(SELECT 1 FROM public.user_inventory WHERE user_id=p_user_id AND item_id=p_item_id) INTO v_owned;
  IF v_owned THEN RETURN jsonb_build_object('ok',false,'error','already_owned'); END IF;
  SELECT COALESCE(points,0) INTO v_pts FROM public.user_points WHERE user_id=p_user_id;
  IF v_pts < v_item.price THEN RETURN jsonb_build_object('ok',false,'error','insufficient_coins'); END IF;
  UPDATE public.user_points SET points=points-v_item.price WHERE user_id=p_user_id;
  INSERT INTO public.user_inventory(user_id,item_id,equipped,purchased_at)
    VALUES(p_user_id,p_item_id,false,now());
  RETURN jsonb_build_object('ok',true,'coins_remaining',v_pts-v_item.price);
END; $f$;
GRANT EXECUTE ON FUNCTION public.purchase_store_item(uuid,uuid) TO authenticated, service_role;

-- ── STEP 15: cleanup_old_notifications trigger ────────────────────────────────
CREATE OR REPLACE FUNCTION public.cleanup_old_notifications()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $f$
BEGIN
  DELETE FROM public.notifications
  WHERE user_id=NEW.user_id AND created_at < now() - interval '90 days';
  RETURN NEW;
END; $f$;
DROP TRIGGER IF EXISTS tr_cleanup_old_notifications ON public.notifications;
CREATE TRIGGER tr_cleanup_old_notifications
  AFTER INSERT ON public.notifications
  FOR EACH ROW EXECUTE FUNCTION public.cleanup_old_notifications();

-- ── STEP 16: handle_new_user trigger (updated to seed user_settings) ──────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $f$
DECLARE
  v_username text;
  v_name     text;
  v_email    text;
BEGIN
  v_username := COALESCE(
    NULLIF(trim(NEW.raw_user_meta_data->>'username'), ''),
    split_part(COALESCE(NEW.email,''), '@', 1),
    'user_' || left(NEW.id::text, 8)
  );
  v_name  := COALESCE(NULLIF(trim(NEW.raw_user_meta_data->>'name'), ''), v_username);
  v_email := COALESCE(NEW.email, v_username || '@isotope.local');
  INSERT INTO public.users(id,email,name,username,plan_type,billing_status,plan_expires_at,access_ends_at)
  VALUES (NEW.id,v_email,v_name,v_username,'ranker','active','2099-12-31 23:59:59+00','2099-12-31 23:59:59+00')
  ON CONFLICT (id) DO UPDATE SET
    username        = EXCLUDED.username,
    -- plan_type intentionally excluded: preserve existing value so a manual
    -- upgrade to 'premium' is not silently overwritten on re-trigger.
    billing_status  = 'active',
    plan_expires_at = '2099-12-31 23:59:59+00',
    access_ends_at  = '2099-12-31 23:59:59+00',
    updated_at      = now();
  INSERT INTO public.user_profiles(user_id,profile_data) VALUES(NEW.id,'{}')     ON CONFLICT(user_id) DO NOTHING;
  INSERT INTO public.user_points(user_id,points,lifetime_points) VALUES(NEW.id,0,0) ON CONFLICT(user_id) DO NOTHING;
  INSERT INTO public.user_stats_summary(user_id,total_study_seconds,streak_days,max_streak_days,session_count)
    VALUES(NEW.id,0,0,0,0) ON CONFLICT(user_id) DO NOTHING;
  INSERT INTO public.user_presence(user_id,status,last_seen) VALUES(NEW.id,'offline',now()) ON CONFLICT(user_id) DO NOTHING;
  INSERT INTO public.user_settings(user_id,settings) VALUES(NEW.id,'{}')         ON CONFLICT(user_id) DO NOTHING;
  RETURN NEW;
END; $f$;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── STEP 17: Backfill user_settings for existing users ────────────────────────
INSERT INTO public.user_settings(user_id, settings)
  SELECT id, '{}' FROM public.users
  WHERE NOT EXISTS(SELECT 1 FROM public.user_settings WHERE user_id=users.id)
  ON CONFLICT(user_id) DO NOTHING;

-- ── STEP 18: Realtime — ensure all 8 required tables are published ────────────
DO $$ BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.group_chat_messages;        EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.user_presence;              EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;              EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.community_events;           EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.community_event_attendees;  EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.groups;                     EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.group_members;              EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.user_settings;              EXCEPTION WHEN OTHERS THEN NULL; END;
END $$;

-- ── PATCH v8 COMPLETE ─────────────────────────────────────────────────────────
-- Applied: 2 new tables, 2 new columns, 1 view, 20 indexes, 3 cascade FKs,
--          8 RPCs (clean overloads), 2 triggers, backfill, 8 realtime tables.
-- Total schema: 23 tables, 1 view, 21 RPCs, 7 realtime channels, 4 storage buckets.
-- ============================================================================

-- ============================================================================
-- ISOTOPE STABILIZATION PATCH v9
-- Idempotent repair block for onboarding, storage buckets and column drift.
-- ============================================================================

ALTER TABLE public.user_inventory
  ADD COLUMN IF NOT EXISTS purchased_at timestamptz NOT NULL DEFAULT now();

CREATE TABLE IF NOT EXISTS public.user_onboarding (
  user_id      uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  completed    boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  data         jsonb NOT NULL DEFAULT '{}'::jsonb,
  source       text NOT NULL DEFAULT 'profile',
  updated_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_onboarding
  ADD COLUMN IF NOT EXISTS data jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_user_onboarding_completed
  ON public.user_onboarding(completed);

ALTER TABLE public.user_onboarding ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_onboarding_select_own" ON public.user_onboarding;
CREATE POLICY "user_onboarding_select_own"
  ON public.user_onboarding FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_onboarding_insert_own" ON public.user_onboarding;
CREATE POLICY "user_onboarding_insert_own"
  ON public.user_onboarding FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_onboarding_update_own" ON public.user_onboarding;
CREATE POLICY "user_onboarding_update_own"
  ON public.user_onboarding FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.sync_user_onboarding_from_profile()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $f$
DECLARE
  v_done boolean;
  v_completed_at timestamptz;
BEGIN
  v_done := COALESCE((NEW.profile_data->>'isOnboarded')::boolean, false);
  IF v_done THEN
    v_completed_at := COALESCE(
      NULLIF(NEW.profile_data->>'onboardingCompletedAt', '')::timestamptz,
      now()
    );
  ELSE
    v_completed_at := NULL;
  END IF;

  INSERT INTO public.user_onboarding(user_id, completed, completed_at, source, updated_at)
  VALUES (NEW.user_id, v_done, v_completed_at, 'profile', now())
  ON CONFLICT(user_id) DO UPDATE SET
    completed    = EXCLUDED.completed,
    completed_at = COALESCE(EXCLUDED.completed_at, public.user_onboarding.completed_at),
    source       = EXCLUDED.source,
    updated_at   = now();
  RETURN NEW;
END; $f$;

DROP TRIGGER IF EXISTS tr_sync_user_onboarding_from_profile ON public.user_profiles;
CREATE TRIGGER tr_sync_user_onboarding_from_profile
  AFTER INSERT OR UPDATE OF profile_data ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.sync_user_onboarding_from_profile();

INSERT INTO public.user_onboarding(user_id, completed, completed_at, source, updated_at)
SELECT
  up.user_id,
  COALESCE((up.profile_data->>'isOnboarded')::boolean, false),
  CASE
    WHEN COALESCE((up.profile_data->>'isOnboarded')::boolean, false)
    THEN COALESCE(NULLIF(up.profile_data->>'onboardingCompletedAt', '')::timestamptz, now())
    ELSE NULL
  END,
  'backfill',
  now()
FROM public.user_profiles up
ON CONFLICT(user_id) DO UPDATE SET
  completed    = EXCLUDED.completed,
  completed_at = COALESCE(EXCLUDED.completed_at, public.user_onboarding.completed_at),
  updated_at   = now();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $f$
DECLARE
  v_username text;
  v_name     text;
  v_email    text;
BEGIN
  v_username := COALESCE(
    NULLIF(trim(NEW.raw_user_meta_data->>'username'), ''),
    split_part(COALESCE(NEW.email,''), '@', 1),
    'user_' || left(NEW.id::text, 8)
  );
  v_name  := COALESCE(NULLIF(trim(NEW.raw_user_meta_data->>'name'), ''), v_username);
  v_email := COALESCE(NEW.email, v_username || '@isotope.local');
  INSERT INTO public.users(id,email,name,username,plan_type,billing_status,plan_expires_at,access_ends_at)
  VALUES (NEW.id,v_email,v_name,v_username,'ranker','active','2099-12-31 23:59:59+00','2099-12-31 23:59:59+00')
  ON CONFLICT (id) DO UPDATE SET
    username        = EXCLUDED.username,
    plan_type       = 'ranker',
    billing_status  = 'active',
    plan_expires_at = '2099-12-31 23:59:59+00',
    access_ends_at  = '2099-12-31 23:59:59+00',
    updated_at      = now();
  INSERT INTO public.user_profiles(user_id,profile_data) VALUES(NEW.id,'{}')        ON CONFLICT(user_id) DO NOTHING;
  INSERT INTO public.user_onboarding(user_id,completed,source) VALUES(NEW.id,false,'signup') ON CONFLICT(user_id) DO NOTHING;
  INSERT INTO public.user_points(user_id,points,lifetime_points) VALUES(NEW.id,0,0) ON CONFLICT(user_id) DO NOTHING;
  INSERT INTO public.user_stats_summary(user_id,total_study_seconds,streak_days,max_streak_days,session_count)
    VALUES(NEW.id,0,0,0,0) ON CONFLICT(user_id) DO NOTHING;
  INSERT INTO public.user_presence(user_id,status,last_seen) VALUES(NEW.id,'offline',now()) ON CONFLICT(user_id) DO NOTHING;
  INSERT INTO public.user_settings(user_id,settings) VALUES(NEW.id,'{}')            ON CONFLICT(user_id) DO NOTHING;
  RETURN NEW;
END; $f$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars',      'avatars',      true,  5242880,  ARRAY['image/png','image/jpeg','image/webp','image/gif']),
  ('user-content', 'user-content', false, 52428800, NULL),
  ('notes',        'notes',        false, 52428800, NULL)
ON CONFLICT (id) DO UPDATE SET
  public             = EXCLUDED.public,
  file_size_limit    = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "avatars_public_read" ON storage.objects;
CREATE POLICY "avatars_public_read"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "avatars_user_write" ON storage.objects;
DROP POLICY IF EXISTS "avatars_user_insert_own" ON storage.objects;
DROP POLICY IF EXISTS "avatars_user_update_own" ON storage.objects;
DROP POLICY IF EXISTS "avatars_user_delete_own" ON storage.objects;
CREATE POLICY "avatars_user_insert_own"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
CREATE POLICY "avatars_user_update_own"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
CREATE POLICY "avatars_user_delete_own"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "private_content_owner_read" ON storage.objects;
CREATE POLICY "private_content_owner_read"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id IN ('user-content','notes')
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "private_content_owner_write" ON storage.objects;
DROP POLICY IF EXISTS "private_content_owner_insert" ON storage.objects;
DROP POLICY IF EXISTS "private_content_owner_update" ON storage.objects;
DROP POLICY IF EXISTS "private_content_owner_delete" ON storage.objects;
CREATE POLICY "private_content_owner_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id IN ('user-content','notes')
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
CREATE POLICY "private_content_owner_update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id IN ('user-content','notes')
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id IN ('user-content','notes')
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
CREATE POLICY "private_content_owner_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id IN ('user-content','notes')
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DO $$ BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.user_onboarding; EXCEPTION WHEN OTHERS THEN NULL; END;
END $$;

-- ============================================================================
-- PATCH v10 — Remove Events and Store product surfaces
-- ============================================================================
-- Events and Store are no longer part of this installation.  This final block is
-- intentionally destructive and idempotent: it removes the Supabase tables, views,
-- RPCs, triggers, policies, and storage bucket used only by those pages.

DROP POLICY IF EXISTS "event_images_public_read" ON storage.objects;
DROP POLICY IF EXISTS "event_images_authenticated_write" ON storage.objects;
-- Delete the `event-images` bucket with the Supabase Storage API if it exists.
-- Direct deletion from storage.objects is intentionally blocked by Supabase.

DROP VIEW IF EXISTS public.community_events_with_counts CASCADE;

DROP FUNCTION IF EXISTS public.purchase_store_item(uuid, uuid);
DROP FUNCTION IF EXISTS public.join_community_event(uuid);
DROP FUNCTION IF EXISTS public.leave_community_event(uuid);
DROP FUNCTION IF EXISTS public.create_community_event(text, text, text, text, timestamptz, timestamptz, text, text, text[], integer, boolean, boolean);
DROP FUNCTION IF EXISTS public.update_community_event(uuid, text, text, text, text, timestamptz, timestamptz, text, text, text[], integer, boolean, boolean);
DROP FUNCTION IF EXISTS public.delete_community_event(uuid);
DROP FUNCTION IF EXISTS public.get_event_attendees(uuid);
DROP FUNCTION IF EXISTS public._evt_increment_reply_count() CASCADE;
DROP FUNCTION IF EXISTS public._evt_update_analytics() CASCADE;
DROP FUNCTION IF EXISTS public.rsvp_event(uuid, text);
DROP FUNCTION IF EXISTS public.react_to_event(uuid, text);
DROP FUNCTION IF EXISTS public.track_event_view(uuid);
DROP FUNCTION IF EXISTS public.get_event_discovery();
DROP FUNCTION IF EXISTS public.get_event_discovery(text);
DROP FUNCTION IF EXISTS public.get_event_discovery(text, integer);
DROP FUNCTION IF EXISTS public.get_event_discovery(text, integer, integer);
DROP FUNCTION IF EXISTS public.get_event_full(uuid);
DROP FUNCTION IF EXISTS public.get_event_leaderboard(text, uuid, integer);
DROP FUNCTION IF EXISTS public.get_event_stats(uuid);
DROP FUNCTION IF EXISTS public.upsert_event_rsvp(uuid, uuid, text);
DROP FUNCTION IF EXISTS public.update_event_engagement_score(uuid);
DROP FUNCTION IF EXISTS public.increment_event_resource_download(uuid, uuid);

DROP TABLE IF EXISTS public.event_pinned_messages CASCADE;
DROP TABLE IF EXISTS public.event_announcements CASCADE;
DROP TABLE IF EXISTS public.event_reminders CASCADE;
DROP TABLE IF EXISTS public.event_recordings CASCADE;
DROP TABLE IF EXISTS public.event_feedback CASCADE;
DROP TABLE IF EXISTS public.event_analytics CASCADE;
DROP TABLE IF EXISTS public.event_presence CASCADE;
DROP TABLE IF EXISTS public.event_roles CASCADE;
DROP TABLE IF EXISTS public.event_resources CASCADE;
DROP TABLE IF EXISTS public.event_reactions CASCADE;
DROP TABLE IF EXISTS public.event_thread_replies CASCADE;
DROP TABLE IF EXISTS public.event_threads CASCADE;
DROP TABLE IF EXISTS public.event_messages CASCADE;
DROP TABLE IF EXISTS public.event_rsvp CASCADE;
DROP TABLE IF EXISTS public.event_achievements CASCADE;
DROP TABLE IF EXISTS public.community_event_attendees CASCADE;
DROP TABLE IF EXISTS public.community_events CASCADE;
DROP TABLE IF EXISTS public.event_categories CASCADE;
DROP TABLE IF EXISTS public.user_inventory CASCADE;
DROP TABLE IF EXISTS public.store_items CASCADE;

-- PATCH v10 COMPLETE: Events and Store removed from Supabase.

-- ============================================================================
-- PATCH v11 — user_tours: persistent tour/guide state per user
-- ============================================================================
-- Stores which onboarding tours/guided walkthroughs a user has completed or
-- dismissed. Prevents tours from repeating on every login.
-- Tour keys match the keys used in the compiled React tour store.

CREATE TABLE IF NOT EXISTS public.user_tours (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tour_key      text NOT NULL,
  completed     boolean NOT NULL DEFAULT false,
  completed_at  timestamptz,
  dismissed     boolean NOT NULL DEFAULT false,
  dismissed_at  timestamptz,
  step_reached  integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, tour_key)
);

ALTER TABLE public.user_tours ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_tours_own" ON public.user_tours;
CREATE POLICY "user_tours_own" ON public.user_tours
  FOR ALL TO authenticated
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_user_tours_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS trg_user_tours_updated_at ON public.user_tours;
CREATE TRIGGER trg_user_tours_updated_at
  BEFORE UPDATE ON public.user_tours
  FOR EACH ROW EXECUTE FUNCTION public.set_user_tours_updated_at();

-- Enable realtime for tour sync across devices
DO $$ BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_tours;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
END $$;

-- PATCH v11 COMPLETE: user_tours table added.

-- ============================================================================
-- PATCH v12: Supabase Storage buckets + RLS policies
-- ============================================================================
-- Creates the three storage buckets IsotopeAI requires and sets per-user
-- RLS policies so authenticated users can only read/write their own objects.
-- Safe to re-run: all statements are fully idempotent.
-- ============================================================================

-- ── Create buckets (Storage API creates these via server; SQL ensures they exist) ─
-- The server's ensureStorageBuckets() function creates them via the REST API.
-- These INSERT statements are a belt-and-suspenders fallback.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('user-content', 'user-content', false, 52428800, NULL),
  ('avatars',      'avatars',      true,  2097152,  ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('notes',        'notes',        false, 10485760, NULL)
ON CONFLICT (id) DO NOTHING;

-- ── RLS on storage.objects ────────────────────────────────────────────────────
-- user-content: authenticated users manage their own objects (path: {user_id}/...)
DO $$ BEGIN
  DROP POLICY IF EXISTS "user-content: users manage own objects" ON storage.objects;
  CREATE POLICY "user-content: users manage own objects"
    ON storage.objects FOR ALL TO authenticated
    USING  (bucket_id = 'user-content' AND auth.uid()::text = split_part(name, '/', 1))
    WITH CHECK (bucket_id = 'user-content' AND auth.uid()::text = split_part(name, '/', 1));
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- notes: authenticated users manage their own objects
DO $$ BEGIN
  DROP POLICY IF EXISTS "notes: users manage own objects" ON storage.objects;
  CREATE POLICY "notes: users manage own objects"
    ON storage.objects FOR ALL TO authenticated
    USING  (bucket_id = 'notes' AND auth.uid()::text = split_part(name, '/', 1))
    WITH CHECK (bucket_id = 'notes' AND auth.uid()::text = split_part(name, '/', 1));
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- avatars: public read, authenticated users manage their own
DO $$ BEGIN
  DROP POLICY IF EXISTS "avatars: public read" ON storage.objects;
  CREATE POLICY "avatars: public read"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'avatars');
EXCEPTION WHEN OTHERS THEN NULL; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "avatars: users manage own" ON storage.objects;
  CREATE POLICY "avatars: users manage own"
    ON storage.objects FOR ALL TO authenticated
    USING  (bucket_id = 'avatars' AND auth.uid()::text = split_part(name, '/', 1))
    WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = split_part(name, '/', 1));
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- PATCH v12 COMPLETE: storage buckets and RLS policies added.
