-- ============================================================================
-- IsotopeAI — Complete Schema (isotope-complete.sql)
-- ============================================================================
-- Single authoritative SQL file for a fresh Supabase project.
-- Fully idempotent: safe to run multiple times on any existing database.
--
-- Tables (25):
--   users, user_profiles, user_points, user_stats_summary, daily_user_stats,
--   study_sessions_log, user_presence, user_onboarding, user_settings,
--   user_roles, sync_items, backup_manifests, user_inventory, notifications,
--   store_items,
--   groups, group_members, group_chat_messages, group_invites,
--   group_announcements, group_milestones, group_challenges,
--   group_challenge_participants,
--   community_events, community_event_attendees
--
-- Run order: run this file once in Supabase SQL Editor, then
-- run performance-patch.sql for additional index/RLS optimisations.
-- ============================================================================

-- ── §0. Drop function overloads with return-type drift ───────────────────────
-- PostgreSQL cannot change a function's return type with CREATE OR REPLACE.
-- Drop every overload that may exist from older schema versions first.

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
DROP FUNCTION IF EXISTS public.is_premium_user();
DROP FUNCTION IF EXISTS public.is_premium_user(uuid);

-- ── §1. Core user tables ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.users (
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           text,
  name            text,
  username        text,
  avatar_url      text,
  plan_type       text        NOT NULL DEFAULT 'ranker',
  billing_status  text        NOT NULL DEFAULT 'active',
  coins           integer     NOT NULL DEFAULT 0,
  gems            integer     NOT NULL DEFAULT 0,
  plan_expires_at timestamptz          DEFAULT '2099-12-31 23:59:59+00',
  access_ends_at  timestamptz          DEFAULT '2099-12-31 23:59:59+00',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS username        text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url      text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS coins           integer     NOT NULL DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS gems            integer     NOT NULL DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS plan_expires_at timestamptz          DEFAULT '2099-12-31 23:59:59+00';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS access_ends_at  timestamptz          DEFAULT '2099-12-31 23:59:59+00';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS updated_at      timestamptz NOT NULL DEFAULT now();
DO $$ BEGIN
  ALTER TABLE public.users ALTER COLUMN plan_type    SET DEFAULT 'ranker'; EXCEPTION WHEN OTHERS THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE public.users ALTER COLUMN billing_status SET DEFAULT 'active'; EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.user_profiles (
  user_id      uuid        PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  profile_data jsonb       NOT NULL DEFAULT '{}',
  updated_at   timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS profile_data jsonb       NOT NULL DEFAULT '{}';
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS updated_at   timestamptz NOT NULL DEFAULT now();

CREATE TABLE IF NOT EXISTS public.user_points (
  user_id        uuid    PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  points         integer NOT NULL DEFAULT 0,
  lifetime_points integer NOT NULL DEFAULT 0,
  updated_at     timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.user_points ADD COLUMN IF NOT EXISTS points          integer     NOT NULL DEFAULT 0;
ALTER TABLE public.user_points ADD COLUMN IF NOT EXISTS lifetime_points integer     NOT NULL DEFAULT 0;
ALTER TABLE public.user_points ADD COLUMN IF NOT EXISTS updated_at      timestamptz NOT NULL DEFAULT now();

CREATE TABLE IF NOT EXISTS public.user_stats_summary (
  user_id             uuid    PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  total_study_seconds bigint  NOT NULL DEFAULT 0,
  total_hours         numeric NOT NULL DEFAULT 0,
  weekly_hours        numeric NOT NULL DEFAULT 0,
  monthly_hours       numeric NOT NULL DEFAULT 0,
  streak_days         integer NOT NULL DEFAULT 0,
  max_streak_days     integer NOT NULL DEFAULT 0,
  current_streak      integer NOT NULL DEFAULT 0,
  longest_streak      integer NOT NULL DEFAULT 0,
  session_count       integer NOT NULL DEFAULT 0,
  total_sessions      integer NOT NULL DEFAULT 0,
  last_session_at     timestamptz,
  last_study_date     date,
  updated_at          timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.user_stats_summary ADD COLUMN IF NOT EXISTS total_study_seconds bigint  NOT NULL DEFAULT 0;
ALTER TABLE public.user_stats_summary ADD COLUMN IF NOT EXISTS streak_days         integer NOT NULL DEFAULT 0;
ALTER TABLE public.user_stats_summary ADD COLUMN IF NOT EXISTS max_streak_days     integer NOT NULL DEFAULT 0;
ALTER TABLE public.user_stats_summary ADD COLUMN IF NOT EXISTS session_count       integer NOT NULL DEFAULT 0;
ALTER TABLE public.user_stats_summary ADD COLUMN IF NOT EXISTS last_study_date     date;
ALTER TABLE public.user_stats_summary ADD COLUMN IF NOT EXISTS updated_at          timestamptz NOT NULL DEFAULT now();

-- Drop if GENERATED (computed), then re-add as plain columns JS can read/write
DO $$ DECLARE v boolean; BEGIN
  SELECT (is_generated='ALWAYS') INTO v FROM information_schema.columns
    WHERE table_schema='public' AND table_name='user_stats_summary' AND column_name='total_hours';
  IF v IS TRUE THEN ALTER TABLE public.user_stats_summary DROP COLUMN total_hours; END IF;
END $$;
ALTER TABLE public.user_stats_summary ADD COLUMN IF NOT EXISTS total_hours    numeric NOT NULL DEFAULT 0;

DO $$ DECLARE v boolean; BEGIN
  SELECT (is_generated='ALWAYS') INTO v FROM information_schema.columns
    WHERE table_schema='public' AND table_name='user_stats_summary' AND column_name='weekly_hours';
  IF v IS TRUE THEN ALTER TABLE public.user_stats_summary DROP COLUMN weekly_hours; END IF;
END $$;
ALTER TABLE public.user_stats_summary ADD COLUMN IF NOT EXISTS weekly_hours   numeric NOT NULL DEFAULT 0;

DO $$ DECLARE v boolean; BEGIN
  SELECT (is_generated='ALWAYS') INTO v FROM information_schema.columns
    WHERE table_schema='public' AND table_name='user_stats_summary' AND column_name='monthly_hours';
  IF v IS TRUE THEN ALTER TABLE public.user_stats_summary DROP COLUMN monthly_hours; END IF;
END $$;
ALTER TABLE public.user_stats_summary ADD COLUMN IF NOT EXISTS monthly_hours  numeric NOT NULL DEFAULT 0;

DO $$ DECLARE v boolean; BEGIN
  SELECT (is_generated='ALWAYS') INTO v FROM information_schema.columns
    WHERE table_schema='public' AND table_name='user_stats_summary' AND column_name='current_streak';
  IF v IS TRUE THEN ALTER TABLE public.user_stats_summary DROP COLUMN current_streak; END IF;
END $$;
ALTER TABLE public.user_stats_summary ADD COLUMN IF NOT EXISTS current_streak integer NOT NULL DEFAULT 0;

DO $$ DECLARE v boolean; BEGIN
  SELECT (is_generated='ALWAYS') INTO v FROM information_schema.columns
    WHERE table_schema='public' AND table_name='user_stats_summary' AND column_name='longest_streak';
  IF v IS TRUE THEN ALTER TABLE public.user_stats_summary DROP COLUMN longest_streak; END IF;
END $$;
ALTER TABLE public.user_stats_summary ADD COLUMN IF NOT EXISTS longest_streak integer NOT NULL DEFAULT 0;

DO $$ DECLARE v boolean; BEGIN
  SELECT (is_generated='ALWAYS') INTO v FROM information_schema.columns
    WHERE table_schema='public' AND table_name='user_stats_summary' AND column_name='total_sessions';
  IF v IS TRUE THEN ALTER TABLE public.user_stats_summary DROP COLUMN total_sessions; END IF;
END $$;
ALTER TABLE public.user_stats_summary ADD COLUMN IF NOT EXISTS total_sessions integer NOT NULL DEFAULT 0;
ALTER TABLE public.user_stats_summary ADD COLUMN IF NOT EXISTS last_session_at timestamptz;

CREATE TABLE IF NOT EXISTS public.daily_user_stats (
  user_id         uuid   NOT NULL,
  date            date   NOT NULL,
  seconds_studied bigint NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, date)
);
ALTER TABLE public.daily_user_stats ADD COLUMN IF NOT EXISTS seconds_studied bigint NOT NULL DEFAULT 0;

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
ALTER TABLE public.study_sessions_log ADD COLUMN IF NOT EXISTS started_at       timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.study_sessions_log ADD COLUMN IF NOT EXISTS ended_at         timestamptz NOT NULL DEFAULT now();

CREATE TABLE IF NOT EXISTS public.user_presence (
  user_id         uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  status          text        NOT NULL DEFAULT 'offline',
  current_subject text,
  last_seen       timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_onboarding (
  user_id      uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  completed    boolean     NOT NULL DEFAULT false,
  completed_at timestamptz,
  data         jsonb       NOT NULL DEFAULT '{}',
  source       text        NOT NULL DEFAULT 'profile',
  updated_at   timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.user_onboarding ADD COLUMN IF NOT EXISTS data jsonb NOT NULL DEFAULT '{}';

CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id    uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  settings   jsonb       NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       text        NOT NULL DEFAULT 'user',
  granted_by uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  granted_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_roles_user_role ON public.user_roles(user_id, role);

CREATE TABLE IF NOT EXISTS public.backup_manifests (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid        NOT NULL,
  bucket           text        NOT NULL,
  path             text        NOT NULL,
  kind             text        NOT NULL,
  content_hash     text        NOT NULL,
  size_bytes       bigint      NOT NULL DEFAULT 0,
  collection_counts jsonb      NOT NULL DEFAULT '{}',
  exported_at      timestamptz,
  selected_as_best boolean     NOT NULL DEFAULT false,
  score            integer     NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT backup_manifests_path_user_prefix
    CHECK (split_part(path, '/', 1) = user_id::text)
);
CREATE UNIQUE INDEX IF NOT EXISTS backup_manifests_bucket_path_idx
  ON public.backup_manifests(bucket, path);
CREATE INDEX IF NOT EXISTS backup_manifests_user_score_idx
  ON public.backup_manifests(user_id, selected_as_best DESC, score DESC, updated_at DESC);

CREATE TABLE IF NOT EXISTS public.sync_items (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  entity         text        NOT NULL,
  entity_id      text        NOT NULL,
  operation      text        NOT NULL,
  remote_path    text,
  bucket         text,
  content_hash   text,
  payload_size   bigint,
  version        integer     NOT NULL DEFAULT 1,
  status         text        NOT NULL DEFAULT 'pending',
  last_error     text,
  deleted_at     timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  last_synced_at timestamptz,
  CONSTRAINT sync_items_user_entity_id_unique UNIQUE (user_id, entity, entity_id)
);
CREATE INDEX IF NOT EXISTS sync_items_user_id_idx ON public.sync_items(user_id);
CREATE INDEX IF NOT EXISTS sync_items_status_idx ON public.sync_items(user_id, status);
CREATE INDEX IF NOT EXISTS sync_items_entity_idx ON public.sync_items(user_id, entity, entity_id);

CREATE TABLE IF NOT EXISTS public.notifications (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type       text        NOT NULL DEFAULT 'system',
  title      text        NOT NULL DEFAULT '',
  body       text        NOT NULL DEFAULT '',
  data       jsonb       NOT NULL DEFAULT '{}',
  read_at    timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ── §3. Store / economy tables ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.store_items (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL DEFAULT '',
  description text,
  price       integer     NOT NULL DEFAULT 0,
  currency    text        NOT NULL DEFAULT 'coins',
  category    text        NOT NULL DEFAULT 'theme',
  image       text,
  active      boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.store_items ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.store_items ADD COLUMN IF NOT EXISTS price       integer NOT NULL DEFAULT 0;
ALTER TABLE public.store_items ADD COLUMN IF NOT EXISTS currency    text    NOT NULL DEFAULT 'coins';
ALTER TABLE public.store_items ADD COLUMN IF NOT EXISTS category    text    NOT NULL DEFAULT 'theme';
ALTER TABLE public.store_items ADD COLUMN IF NOT EXISTS image       text;
ALTER TABLE public.store_items ADD COLUMN IF NOT EXISTS active      boolean NOT NULL DEFAULT true;

CREATE TABLE IF NOT EXISTS public.user_inventory (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL,
  item_id      uuid        NOT NULL,
  equipped     boolean     NOT NULL DEFAULT false,
  purchased_at timestamptz NOT NULL DEFAULT now(),
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, item_id)
);
ALTER TABLE public.user_inventory ADD COLUMN IF NOT EXISTS equipped     boolean     NOT NULL DEFAULT false;
ALTER TABLE public.user_inventory ADD COLUMN IF NOT EXISTS purchased_at timestamptz NOT NULL DEFAULT now();

-- ── §4. Group tables ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.groups (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text        NOT NULL DEFAULT '',
  description  text,
  cover_url    text,
  logo_url     text,
  category     text,
  slug         text,
  owner_id     uuid,
  member_count integer     NOT NULL DEFAULT 0,
  max_members  integer     NOT NULL DEFAULT 100,
  is_public    boolean     NOT NULL DEFAULT true,
  is_active    boolean     NOT NULL DEFAULT true,
  visibility   text        NOT NULL DEFAULT 'public',
  settings     jsonb       NOT NULL DEFAULT '{}',
  deleted_at   timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS cover_url    text;
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS logo_url     text;
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS category     text;
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS slug         text;
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS member_count integer     NOT NULL DEFAULT 0;
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS owner_id     uuid;
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS max_members  integer     NOT NULL DEFAULT 100;
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS is_active    boolean     NOT NULL DEFAULT true;
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS updated_at   timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS deleted_at   timestamptz;
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS settings     jsonb       NOT NULL DEFAULT '{}';
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS visibility   text        NOT NULL DEFAULT 'public';
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS is_public    boolean;
DO $$
BEGIN
  UPDATE public.groups SET is_public = (visibility NOT IN ('private','invite_only')) WHERE is_public IS NULL;
  UPDATE public.groups SET is_public = true WHERE is_public IS NULL;
  ALTER TABLE public.groups ALTER COLUMN is_public SET NOT NULL;
  ALTER TABLE public.groups ALTER COLUMN is_public SET DEFAULT true;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Full-text search column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='groups' AND column_name='fts'
  ) THEN
    ALTER TABLE public.groups ADD COLUMN fts tsvector GENERATED ALWAYS AS (
      to_tsvector('english',
        coalesce(name,'') || ' ' || coalesce(description,'') || ' ' || coalesce(category,'')
      )
    ) STORED;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.group_members (
  id        uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id  uuid        NOT NULL,
  user_id   uuid        NOT NULL,
  role      text        NOT NULL DEFAULT 'member',
  joined_at timestamptz NOT NULL DEFAULT now(),
  is_super_admin boolean NOT NULL DEFAULT false
);
ALTER TABLE public.group_members ADD COLUMN IF NOT EXISTS role          text        NOT NULL DEFAULT 'member';
ALTER TABLE public.group_members ADD COLUMN IF NOT EXISTS joined_at     timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.group_members ADD COLUMN IF NOT EXISTS is_super_admin boolean    NOT NULL DEFAULT false;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid='public.group_members'::regclass AND conname='group_members_group_id_user_id_key'
  ) THEN
    ALTER TABLE public.group_members ADD CONSTRAINT group_members_group_id_user_id_key UNIQUE (group_id, user_id);
  END IF;
END $$;

-- Helper: _is_group_member must be created after public.group_members exists,
-- but before RLS policies use it.
-- SECURITY DEFINER prevents RLS infinite-recursion when group_members policies
-- reference the group_members table themselves.
CREATE OR REPLACE FUNCTION public._is_group_member(gid uuid, uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS(SELECT 1 FROM public.group_members WHERE group_id = gid AND user_id = uid);
$$;
GRANT EXECUTE ON FUNCTION public._is_group_member(uuid, uuid) TO anon, authenticated, service_role;

CREATE TABLE IF NOT EXISTS public.group_chat_messages (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id     uuid        NOT NULL,
  user_id      uuid,
  content      text        NOT NULL DEFAULT '',
  message_type text        NOT NULL DEFAULT 'text',
  reply_to_id  uuid,
  deleted_at   timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.group_chat_messages ADD COLUMN IF NOT EXISTS user_id      uuid;
ALTER TABLE public.group_chat_messages ADD COLUMN IF NOT EXISTS message_type text        NOT NULL DEFAULT 'text';
ALTER TABLE public.group_chat_messages ADD COLUMN IF NOT EXISTS reply_to_id  uuid;
ALTER TABLE public.group_chat_messages ADD COLUMN IF NOT EXISTS deleted_at   timestamptz;
-- Backfill user_id from sender_id if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='group_chat_messages' AND column_name='sender_id'
  ) THEN
    UPDATE public.group_chat_messages SET user_id = sender_id WHERE user_id IS NULL AND sender_id IS NOT NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.group_invites (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id    uuid        NOT NULL,
  token       text,
  invite_code text,
  created_by  uuid,
  max_uses    integer,
  uses_count  integer     NOT NULL DEFAULT 0,
  expires_at  timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.group_invites ADD COLUMN IF NOT EXISTS created_by uuid;
ALTER TABLE public.group_invites ADD COLUMN IF NOT EXISTS max_uses   integer;
ALTER TABLE public.group_invites ADD COLUMN IF NOT EXISTS uses_count integer     NOT NULL DEFAULT 0;
ALTER TABLE public.group_invites ADD COLUMN IF NOT EXISTS expires_at timestamptz;
ALTER TABLE public.group_invites ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();
-- Ensure 'token' is a plain writable column (not GENERATED)
DO $$
DECLARE v_is_gen boolean;
BEGIN
  SELECT (is_generated='ALWAYS') INTO v_is_gen FROM information_schema.columns
    WHERE table_schema='public' AND table_name='group_invites' AND column_name='token';
  IF v_is_gen IS TRUE THEN
    ALTER TABLE public.group_invites DROP COLUMN token;
    ALTER TABLE public.group_invites ADD COLUMN token text;
    BEGIN
      UPDATE public.group_invites SET token = invite_code WHERE token IS NULL AND invite_code IS NOT NULL;
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
  ELSIF v_is_gen IS NULL THEN
    ALTER TABLE public.group_invites ADD COLUMN token text;
  END IF;
END $$;
ALTER TABLE public.group_invites ADD COLUMN IF NOT EXISTS invite_code text;
UPDATE public.group_invites SET invite_code = token     WHERE invite_code IS NULL AND token IS NOT NULL;
UPDATE public.group_invites SET token       = invite_code WHERE token IS NULL AND invite_code IS NOT NULL;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid='public.group_invites'::regclass AND conname='group_invites_token_key'
  ) THEN
    ALTER TABLE public.group_invites ADD CONSTRAINT group_invites_token_key UNIQUE (token);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.group_announcements (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id   uuid        NOT NULL,
  author_id  uuid,
  content    text        NOT NULL DEFAULT '',
  pinned     boolean     NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.group_announcements ADD COLUMN IF NOT EXISTS author_id  uuid;
ALTER TABLE public.group_announcements ADD COLUMN IF NOT EXISTS content    text        NOT NULL DEFAULT '';
ALTER TABLE public.group_announcements ADD COLUMN IF NOT EXISTS pinned     boolean     NOT NULL DEFAULT false;
ALTER TABLE public.group_announcements ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

CREATE TABLE IF NOT EXISTS public.group_milestones (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id       uuid,
  milestone_type text        NOT NULL DEFAULT '',
  earned_at      timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.group_milestones ADD COLUMN IF NOT EXISTS group_id       uuid;
ALTER TABLE public.group_milestones ADD COLUMN IF NOT EXISTS milestone_type text        NOT NULL DEFAULT '';
ALTER TABLE public.group_milestones ADD COLUMN IF NOT EXISTS earned_at      timestamptz NOT NULL DEFAULT now();

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

-- ── §5. Community / events tables ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.community_events (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title          text        NOT NULL DEFAULT '',
  event_type     text        NOT NULL DEFAULT 'webinar',
  description    text,
  host           text,
  start_time     timestamptz NOT NULL DEFAULT now(),
  end_time       timestamptz,
  image_gradient text        NOT NULL DEFAULT 'from-purple-600 to-blue-500',
  image_url      text,
  tags           text[]      NOT NULL DEFAULT '{}',
  max_attendees  integer,
  attendee_count integer     NOT NULL DEFAULT 0,
  is_featured    boolean     NOT NULL DEFAULT false,
  is_active      boolean     NOT NULL DEFAULT true,
  updated_at     timestamptz NOT NULL DEFAULT now(),
  created_at     timestamptz NOT NULL DEFAULT now(),
  creator_id     uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  host_user_id   uuid        REFERENCES auth.users(id) ON DELETE SET NULL
);
ALTER TABLE public.community_events ADD COLUMN IF NOT EXISTS title          text        NOT NULL DEFAULT '';
ALTER TABLE public.community_events ADD COLUMN IF NOT EXISTS event_type     text        NOT NULL DEFAULT 'webinar';
ALTER TABLE public.community_events ADD COLUMN IF NOT EXISTS description    text;
ALTER TABLE public.community_events ADD COLUMN IF NOT EXISTS host           text;
ALTER TABLE public.community_events ADD COLUMN IF NOT EXISTS start_time     timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.community_events ADD COLUMN IF NOT EXISTS end_time       timestamptz;
ALTER TABLE public.community_events ADD COLUMN IF NOT EXISTS image_gradient text        NOT NULL DEFAULT 'from-purple-600 to-blue-500';
ALTER TABLE public.community_events ADD COLUMN IF NOT EXISTS image_url      text;
ALTER TABLE public.community_events ADD COLUMN IF NOT EXISTS tags           text[]      NOT NULL DEFAULT '{}';
ALTER TABLE public.community_events ADD COLUMN IF NOT EXISTS max_attendees  integer;
ALTER TABLE public.community_events ADD COLUMN IF NOT EXISTS attendee_count integer     NOT NULL DEFAULT 0;
ALTER TABLE public.community_events ADD COLUMN IF NOT EXISTS is_featured    boolean     NOT NULL DEFAULT false;
ALTER TABLE public.community_events ADD COLUMN IF NOT EXISTS is_active      boolean     NOT NULL DEFAULT true;
ALTER TABLE public.community_events ADD COLUMN IF NOT EXISTS updated_at     timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.community_events ADD COLUMN IF NOT EXISTS creator_id     uuid        REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.community_events ADD COLUMN IF NOT EXISTS host_user_id   uuid        REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS public.community_event_attendees (
  event_id  uuid        NOT NULL REFERENCES public.community_events(id) ON DELETE CASCADE,
  user_id   uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (event_id, user_id)
);
ALTER TABLE public.community_event_attendees ADD COLUMN IF NOT EXISTS joined_at timestamptz NOT NULL DEFAULT now();
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid='public.community_event_attendees'::regclass AND conname='cea_event_user_unique'
  ) THEN
    ALTER TABLE public.community_event_attendees ADD CONSTRAINT cea_event_user_unique UNIQUE (event_id, user_id);
  END IF;
END $$;

-- ── §6. Cascade FK constraints ────────────────────────────────────────────────

ALTER TABLE public.group_chat_messages DROP CONSTRAINT IF EXISTS group_chat_messages_group_id_fkey;
ALTER TABLE public.group_chat_messages ADD CONSTRAINT group_chat_messages_group_id_fkey
  FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE;
ALTER TABLE public.group_members DROP CONSTRAINT IF EXISTS group_members_group_id_fkey;
ALTER TABLE public.group_members ADD CONSTRAINT group_members_group_id_fkey
  FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE;
ALTER TABLE public.group_challenge_participants DROP CONSTRAINT IF EXISTS group_challenge_participants_challenge_id_fkey;
ALTER TABLE public.group_challenge_participants ADD CONSTRAINT group_challenge_participants_challenge_id_fkey
  FOREIGN KEY (challenge_id) REFERENCES public.group_challenges(id) ON DELETE CASCADE;

-- ── §7. All indexes ───────────────────────────────────────────────────────────

-- users
-- (primary key covers id lookup; add any extra user indexes here)

-- user_profiles
CREATE INDEX IF NOT EXISTS idx_profiles_user_id    ON public.user_profiles (user_id);

-- user_points
CREATE INDEX IF NOT EXISTS idx_points_user_id      ON public.user_points (user_id);
CREATE INDEX IF NOT EXISTS idx_points_points       ON public.user_points (points DESC);
CREATE INDEX IF NOT EXISTS idx_points_lifetime     ON public.user_points (lifetime_points DESC);

-- user_stats_summary
CREATE INDEX IF NOT EXISTS idx_stats_user_id       ON public.user_stats_summary (user_id);
CREATE INDEX IF NOT EXISTS idx_stats_total_hours   ON public.user_stats_summary (total_hours DESC);
CREATE INDEX IF NOT EXISTS idx_stats_weekly_hours  ON public.user_stats_summary (weekly_hours DESC);
CREATE INDEX IF NOT EXISTS idx_stats_hrs_v8        ON public.user_stats_summary (total_hours DESC);

-- daily_user_stats
CREATE INDEX IF NOT EXISTS idx_daily_user_date     ON public.daily_user_stats (user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_stats_v8      ON public.daily_user_stats (user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_user_date_minutes ON public.daily_user_stats (user_id, date DESC) INCLUDE (seconds_studied);

-- study_sessions_log
CREATE INDEX IF NOT EXISTS idx_sessions_user_id    ON public.study_sessions_log (user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON public.study_sessions_log (started_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_u_v8       ON public.study_sessions_log (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_user_started ON public.study_sessions_log (user_id, started_at DESC);

-- user_presence
CREATE INDEX IF NOT EXISTS idx_presence_status     ON public.user_presence (status);
CREATE INDEX IF NOT EXISTS idx_presence_last_seen  ON public.user_presence (last_seen DESC);
CREATE INDEX IF NOT EXISTS idx_presence_updated_at ON public.user_presence (updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_presence_s_v8       ON public.user_presence (status, last_seen DESC);

-- user_onboarding
CREATE INDEX IF NOT EXISTS idx_user_onboarding_completed ON public.user_onboarding (completed);

-- user_roles
CREATE INDEX IF NOT EXISTS idx_user_roles_u        ON public.user_roles (user_id);

-- notifications
CREATE INDEX IF NOT EXISTS idx_notif_user_time     ON public.notifications (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notif_unread        ON public.notifications (user_id, read_at) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_notif_user_ts_v8    ON public.notifications (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notif_unread_v8     ON public.notifications (user_id, read_at) WHERE read_at IS NULL;

-- store_items
CREATE INDEX IF NOT EXISTS idx_store_act_v8        ON public.store_items (active, category);

-- user_inventory
CREATE INDEX IF NOT EXISTS idx_inventory_u_v8      ON public.user_inventory (user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_user      ON public.user_inventory (user_id);

-- groups
CREATE INDEX IF NOT EXISTS idx_groups_fts          ON public.groups USING GIN (fts);
CREATE INDEX IF NOT EXISTS idx_groups_public       ON public.groups (is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_groups_slug         ON public.groups (slug) WHERE slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_groups_owner        ON public.groups (owner_id);
CREATE INDEX IF NOT EXISTS idx_groups_active       ON public.groups (is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_groups_del          ON public.groups (deleted_at) WHERE deleted_at IS NULL;

-- group_members
CREATE INDEX IF NOT EXISTS idx_gm_group            ON public.group_members (group_id);
CREATE INDEX IF NOT EXISTS idx_gm_user             ON public.group_members (user_id);
CREATE INDEX IF NOT EXISTS idx_gm_user_group_covering ON public.group_members (user_id, group_id);
CREATE INDEX IF NOT EXISTS idx_gmembers_gu_v8      ON public.group_members (group_id, user_id);
CREATE INDEX IF NOT EXISTS idx_gmembers_u_v8       ON public.group_members (user_id);

-- group_chat_messages
CREATE INDEX IF NOT EXISTS idx_gchat_group_time    ON public.group_chat_messages (group_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gchat_user          ON public.group_chat_messages (user_id);
CREATE INDEX IF NOT EXISTS idx_gchat_group_ts      ON public.group_chat_messages (group_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gchat_user_v8       ON public.group_chat_messages (user_id);

-- group_invites
CREATE INDEX IF NOT EXISTS idx_ginv_token          ON public.group_invites (token);
CREATE INDEX IF NOT EXISTS idx_ginv_group          ON public.group_invites (group_id);
CREATE INDEX IF NOT EXISTS idx_ginv_created_by     ON public.group_invites (created_by);
CREATE INDEX IF NOT EXISTS idx_invites_code_v8     ON public.group_invites (invite_code);
CREATE INDEX IF NOT EXISTS idx_invites_tok_v8      ON public.group_invites (token);

-- group_announcements
CREATE INDEX IF NOT EXISTS idx_gann_group          ON public.group_announcements (group_id);
CREATE INDEX IF NOT EXISTS idx_gann_pinned         ON public.group_announcements (group_id, pinned DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gann_author         ON public.group_announcements (author_id);

-- group_milestones
CREATE INDEX IF NOT EXISTS idx_gmile_group         ON public.group_milestones (group_id);

-- group_challenges
CREATE INDEX IF NOT EXISTS idx_gchall_group        ON public.group_challenges (group_id);
CREATE INDEX IF NOT EXISTS idx_gchall_created_by   ON public.group_challenges (created_by);
CREATE INDEX IF NOT EXISTS idx_challenges_g_v8     ON public.group_challenges (group_id, is_active) WHERE is_active = true;

-- group_challenge_participants
CREATE INDEX IF NOT EXISTS idx_gcpart_challenge    ON public.group_challenge_participants (challenge_id);
CREATE INDEX IF NOT EXISTS idx_gcpart_user         ON public.group_challenge_participants (user_id);
CREATE INDEX IF NOT EXISTS idx_gcpart_challenge_user ON public.group_challenge_participants (challenge_id, user_id);
CREATE INDEX IF NOT EXISTS idx_chall_parts_v8      ON public.group_challenge_participants (challenge_id, user_id);

-- community_events
CREATE INDEX IF NOT EXISTS idx_ce_active_time      ON public.community_events (is_active, start_time);
CREATE INDEX IF NOT EXISTS idx_ce_featured         ON public.community_events (is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_events_active_v8    ON public.community_events (is_active, start_time ASC) WHERE is_active = true;

-- community_event_attendees
CREATE INDEX IF NOT EXISTS idx_cea_event           ON public.community_event_attendees (event_id);
CREATE INDEX IF NOT EXISTS idx_cea_user            ON public.community_event_attendees (user_id);
CREATE INDEX IF NOT EXISTS idx_event_att_ev_v8     ON public.community_event_attendees (event_id, user_id);

-- ── §8. Views ─────────────────────────────────────────────────────────────────

DROP VIEW IF EXISTS public.community_events_with_counts;
CREATE VIEW public.community_events_with_counts AS
  SELECT e.*,
    COALESCE(a.cnt, 0)::integer AS attendee_count_live
  FROM public.community_events e
  LEFT JOIN (
    SELECT event_id, count(*)::integer AS cnt
    FROM public.community_event_attendees GROUP BY event_id
  ) a ON a.event_id = e.id;

-- ── §9. Enable Row Level Security on all tables ───────────────────────────────

ALTER TABLE public.users                         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_points                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats_summary            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_user_stats              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions_log            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_presence                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_onboarding               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backup_manifests              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_items                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_items                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_inventory                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups                        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_chat_messages           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_invites                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_announcements           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_milestones              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_challenges              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_challenge_participants  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_events              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_event_attendees     ENABLE ROW LEVEL SECURITY;

-- ── §10. RLS Policies ─────────────────────────────────────────────────────────
-- Note: server.mjs uses the service_role key which bypasses all RLS.
-- These policies protect direct anon/authenticated client access.

DO $$ BEGIN

  -- users: public read for avatar/username; own row for writes
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='users' AND policyname='users_read_public') THEN
    CREATE POLICY users_read_public   ON public.users FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='users' AND policyname='users_select_display') THEN
    CREATE POLICY users_select_display ON public.users FOR SELECT USING (true);
  END IF;

  DROP POLICY IF EXISTS users_own ON public.users;
  CREATE POLICY users_own ON public.users
    FOR ALL USING (id = (SELECT auth.uid())) WITH CHECK (id = (SELECT auth.uid()));

  -- user_profiles
  DROP POLICY IF EXISTS profiles_own ON public.user_profiles;
  CREATE POLICY profiles_own ON public.user_profiles
    FOR ALL USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));

  -- user_points: all read (leaderboard); own write
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_points' AND policyname='points_read_all') THEN
    CREATE POLICY points_read_all ON public.user_points FOR SELECT USING (true);
  END IF;
  DROP POLICY IF EXISTS points_own_write ON public.user_points;
  CREATE POLICY points_own_write ON public.user_points
    FOR ALL USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));

  -- user_stats_summary: all authenticated read (leaderboard); own write
  DROP POLICY IF EXISTS stats_read_all    ON public.user_stats_summary;
  DROP POLICY IF EXISTS stats_own         ON public.user_stats_summary;
  DROP POLICY IF EXISTS stats_own_write   ON public.user_stats_summary;
  DROP POLICY IF EXISTS stats_select_all  ON public.user_stats_summary;
  CREATE POLICY stats_select_all ON public.user_stats_summary
    FOR SELECT USING ((SELECT auth.uid()) IS NOT NULL);
  CREATE POLICY stats_own ON public.user_stats_summary
    FOR ALL USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));

  -- daily_user_stats: all authenticated read + own write
  DROP POLICY IF EXISTS daily_own        ON public.daily_user_stats;
  DROP POLICY IF EXISTS daily_select_all ON public.daily_user_stats;
  CREATE POLICY daily_select_all ON public.daily_user_stats
    FOR SELECT USING ((SELECT auth.uid()) IS NOT NULL);
  CREATE POLICY daily_own ON public.daily_user_stats
    FOR ALL USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));

  -- study_sessions_log: own rows
  DROP POLICY IF EXISTS sessions_own ON public.study_sessions_log;
  CREATE POLICY sessions_own ON public.study_sessions_log
    FOR ALL USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));

  -- user_presence: authenticated read; own write
  DROP POLICY IF EXISTS presence_read_auth  ON public.user_presence;
  DROP POLICY IF EXISTS presence_own_write  ON public.user_presence;
  CREATE POLICY presence_read_auth ON public.user_presence
    FOR SELECT USING ((SELECT auth.uid()) IS NOT NULL);
  CREATE POLICY presence_own_write ON public.user_presence
    FOR ALL USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));

  -- user_onboarding: own rows
  DROP POLICY IF EXISTS "user_onboarding_select_own" ON public.user_onboarding;
  DROP POLICY IF EXISTS "user_onboarding_insert_own" ON public.user_onboarding;
  DROP POLICY IF EXISTS "user_onboarding_update_own" ON public.user_onboarding;
  CREATE POLICY "user_onboarding_select_own" ON public.user_onboarding FOR SELECT USING (auth.uid() = user_id);
  CREATE POLICY "user_onboarding_insert_own" ON public.user_onboarding FOR INSERT WITH CHECK (auth.uid() = user_id);
  CREATE POLICY "user_onboarding_update_own" ON public.user_onboarding FOR UPDATE
    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

  -- user_settings: own rows
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_settings' AND policyname='usettings_own') THEN
    CREATE POLICY usettings_own ON public.user_settings
      FOR ALL USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));
  END IF;

  -- user_roles: service_role write; own read
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_roles' AND policyname='uroles_service_write') THEN
    CREATE POLICY uroles_service_write ON public.user_roles FOR ALL USING (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_roles' AND policyname='uroles_own_read') THEN
    CREATE POLICY uroles_own_read ON public.user_roles FOR SELECT USING (user_id = (SELECT auth.uid()));
  END IF;

  -- backup_manifests: own user rows; service role bypasses RLS
  DROP POLICY IF EXISTS backup_manifests_select_own ON public.backup_manifests;
  DROP POLICY IF EXISTS backup_manifests_insert_own ON public.backup_manifests;
  DROP POLICY IF EXISTS backup_manifests_update_own ON public.backup_manifests;
  DROP POLICY IF EXISTS backup_manifests_delete_own ON public.backup_manifests;
  CREATE POLICY backup_manifests_select_own ON public.backup_manifests
    FOR SELECT USING (user_id = (SELECT auth.uid()));
  CREATE POLICY backup_manifests_insert_own ON public.backup_manifests
    FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()) AND split_part(path, '/', 1) = (SELECT auth.uid())::text);
  CREATE POLICY backup_manifests_update_own ON public.backup_manifests
    FOR UPDATE USING (user_id = (SELECT auth.uid()))
    WITH CHECK (user_id = (SELECT auth.uid()) AND split_part(path, '/', 1) = (SELECT auth.uid())::text);
  CREATE POLICY backup_manifests_delete_own ON public.backup_manifests
    FOR DELETE USING (user_id = (SELECT auth.uid()));

  -- sync_items: own user rows
  DROP POLICY IF EXISTS "sync_items_select_own" ON public.sync_items;
  DROP POLICY IF EXISTS "sync_items_insert_own" ON public.sync_items;
  DROP POLICY IF EXISTS "sync_items_update_own" ON public.sync_items;
  DROP POLICY IF EXISTS "sync_items_delete_own" ON public.sync_items;
  CREATE POLICY "sync_items_select_own" ON public.sync_items
    FOR SELECT USING (user_id = (SELECT auth.uid()));
  CREATE POLICY "sync_items_insert_own" ON public.sync_items
    FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));
  CREATE POLICY "sync_items_update_own" ON public.sync_items
    FOR UPDATE USING (user_id = (SELECT auth.uid()));
  CREATE POLICY "sync_items_delete_own" ON public.sync_items
    FOR DELETE USING (user_id = (SELECT auth.uid()));

  -- notifications: own rows
  DROP POLICY IF EXISTS notif_own ON public.notifications;
  CREATE POLICY notif_own ON public.notifications
    FOR ALL USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));

  -- store_items: all read
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='store_items' AND policyname='store_read_all') THEN
    CREATE POLICY store_read_all ON public.store_items FOR SELECT USING (true);
  END IF;

  -- user_inventory: own rows
  DROP POLICY IF EXISTS inventory_own ON public.user_inventory;
  CREATE POLICY inventory_own ON public.user_inventory
    FOR ALL USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));

  -- groups: public groups readable; members can read private; owner writes
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='groups' AND policyname='groups_read_public') THEN
    CREATE POLICY groups_read_public ON public.groups
      FOR SELECT USING (is_public = true AND deleted_at IS NULL);
  END IF;
  DROP POLICY IF EXISTS groups_member_read  ON public.groups;
  DROP POLICY IF EXISTS groups_owner_write  ON public.groups;
  DROP POLICY IF EXISTS groups_auth_insert  ON public.groups;
  DROP POLICY IF EXISTS groups_owner_update ON public.groups;
  DROP POLICY IF EXISTS groups_owner_delete ON public.groups;
  CREATE POLICY groups_member_read ON public.groups
    FOR SELECT USING (public._is_group_member(id, (SELECT auth.uid())));
  CREATE POLICY groups_auth_insert ON public.groups
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  CREATE POLICY groups_owner_write ON public.groups
    FOR ALL USING (owner_id = (SELECT auth.uid())) WITH CHECK (owner_id = (SELECT auth.uid()));

  -- group_members
  DROP POLICY IF EXISTS gm_read         ON public.group_members;
  DROP POLICY IF EXISTS gm_read_members ON public.group_members;
  DROP POLICY IF EXISTS gm_own_write    ON public.group_members;
  DROP POLICY IF EXISTS gm_insert       ON public.group_members;
  DROP POLICY IF EXISTS gm_own_delete   ON public.group_members;
  DROP POLICY IF EXISTS gm_owner_update ON public.group_members;
  CREATE POLICY gm_read_members ON public.group_members
    FOR SELECT USING (user_id = (SELECT auth.uid()) OR public._is_group_member(group_id, (SELECT auth.uid())));
  CREATE POLICY gm_own_write ON public.group_members
    FOR ALL USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));
  CREATE POLICY gm_insert ON public.group_members
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

  -- group_chat_messages (CRITICAL: uses user_id not sender_id)
  DROP POLICY IF EXISTS gchat_read        ON public.group_chat_messages;
  DROP POLICY IF EXISTS gchat_read_members ON public.group_chat_messages;
  DROP POLICY IF EXISTS gchat_send        ON public.group_chat_messages;
  DROP POLICY IF EXISTS gchat_insert      ON public.group_chat_messages;
  DROP POLICY IF EXISTS gchat_delete_own  ON public.group_chat_messages;
  CREATE POLICY gchat_read_members ON public.group_chat_messages
    FOR SELECT USING (public._is_group_member(group_id, (SELECT auth.uid())));
  CREATE POLICY gchat_send ON public.group_chat_messages
    FOR INSERT WITH CHECK (
      user_id = (SELECT auth.uid())
      AND group_id = ANY (
        SELECT group_id FROM public.group_members WHERE user_id = (SELECT auth.uid())
      )
    );
  CREATE POLICY gchat_delete_own ON public.group_chat_messages
    FOR UPDATE USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));

  -- group_invites
  DROP POLICY IF EXISTS ginv_read   ON public.group_invites;
  DROP POLICY IF EXISTS ginv_create ON public.group_invites;
  DROP POLICY IF EXISTS ginv_delete ON public.group_invites;
  CREATE POLICY ginv_read ON public.group_invites
    FOR SELECT USING (
      group_id = ANY (SELECT group_id FROM public.group_members WHERE user_id = (SELECT auth.uid()))
      OR created_by = (SELECT auth.uid())
    );
  CREATE POLICY ginv_create ON public.group_invites
    FOR INSERT WITH CHECK (
      created_by = (SELECT auth.uid())
      AND group_id IN (
        SELECT group_id FROM public.group_members
        WHERE user_id = (SELECT auth.uid()) AND role IN ('admin','moderator')
      )
    );
  CREATE POLICY ginv_delete ON public.group_invites
    FOR DELETE USING (created_by = (SELECT auth.uid()));

  -- group_announcements
  DROP POLICY IF EXISTS gann_read  ON public.group_announcements;
  DROP POLICY IF EXISTS gann_write ON public.group_announcements;
  CREATE POLICY gann_read ON public.group_announcements
    FOR SELECT USING (public._is_group_member(group_id, (SELECT auth.uid())));
  CREATE POLICY gann_write ON public.group_announcements
    FOR ALL USING (author_id = (SELECT auth.uid())) WITH CHECK (author_id = (SELECT auth.uid()));

  -- group_milestones
  DROP POLICY IF EXISTS gmile_read ON public.group_milestones;
  CREATE POLICY gmile_read ON public.group_milestones
    FOR SELECT USING (public._is_group_member(group_id, (SELECT auth.uid())));

  -- group_challenges
  DROP POLICY IF EXISTS gchall_read   ON public.group_challenges;
  DROP POLICY IF EXISTS gchall_insert ON public.group_challenges;
  DROP POLICY IF EXISTS gchall_update ON public.group_challenges;
  DROP POLICY IF EXISTS gchall_write  ON public.group_challenges;
  CREATE POLICY gchall_read ON public.group_challenges
    FOR SELECT USING (public._is_group_member(group_id, (SELECT auth.uid())));
  CREATE POLICY gchall_write ON public.group_challenges
    FOR ALL USING (created_by = (SELECT auth.uid())) WITH CHECK (created_by = (SELECT auth.uid()));

  -- group_challenge_participants
  DROP POLICY IF EXISTS gcpart_own          ON public.group_challenge_participants;
  DROP POLICY IF EXISTS gcpart_read         ON public.group_challenge_participants;
  DROP POLICY IF EXISTS gcpart_read_members ON public.group_challenge_participants;
  CREATE POLICY gcpart_own ON public.group_challenge_participants
    FOR ALL USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));
  CREATE POLICY gcpart_read_members ON public.group_challenge_participants
    FOR SELECT USING (
      user_id = (SELECT auth.uid())
      OR challenge_id IN (
        SELECT gch.id FROM public.group_challenges gch
        JOIN public.group_members gm ON gm.group_id = gch.group_id
        WHERE gm.user_id = (SELECT auth.uid())
      )
    );

  -- community_events: active public read; service_role writes
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='community_events' AND policyname='ce_read_public') THEN
    CREATE POLICY ce_read_public ON public.community_events FOR SELECT USING (is_active = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='community_events' AND policyname='ce_service_write') THEN
    CREATE POLICY ce_service_write ON public.community_events FOR ALL USING (auth.role() = 'service_role');
  END IF;

  -- community_event_attendees: authenticated read; own write
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='community_event_attendees' AND policyname='cea_read_auth') THEN
    CREATE POLICY cea_read_auth ON public.community_event_attendees FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='community_event_attendees' AND policyname='cea_own') THEN
    CREATE POLICY cea_own ON public.community_event_attendees
      FOR ALL USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));
  END IF;

END $$;

-- ── §11. RPCs ─────────────────────────────────────────────────────────────────

-- is_premium_user: always true (all plans unlocked)
CREATE OR REPLACE FUNCTION public.is_premium_user()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER AS $$ SELECT true; $$;
CREATE OR REPLACE FUNCTION public.is_premium_user(uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER AS $$ SELECT true; $$;

-- get_my_group_ids: used by RLS policies (avoids repeated subqueries)
CREATE OR REPLACE FUNCTION public.get_my_group_ids()
RETURNS uuid[] LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT ARRAY(SELECT group_id FROM public.group_members WHERE user_id = (SELECT auth.uid()));
$$;

-- get_invite_details
CREATE OR REPLACE FUNCTION public.get_invite_details(p_code text)
RETURNS TABLE (group_id uuid, group_name text, description text, member_count bigint, is_valid boolean)
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT
    g.id,
    g.name,
    g.description,
    COUNT(gm.user_id),
    ((gi.expires_at IS NULL OR gi.expires_at > now())
     AND (gi.max_uses IS NULL OR gi.uses_count < gi.max_uses))
  FROM public.group_invites gi
  JOIN  public.groups g         ON g.id      = gi.group_id
  LEFT JOIN public.group_members gm ON gm.group_id = g.id
  WHERE (gi.token = p_code OR gi.invite_code = p_code)
    AND (g.is_active = true OR g.is_active IS NULL)
    AND g.deleted_at IS NULL
  GROUP BY g.id, g.name, g.description, gi.expires_at, gi.max_uses, gi.uses_count;
$$;

-- accept_invite
CREATE OR REPLACE FUNCTION public.accept_invite(p_code text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_invite public.group_invites%ROWTYPE;
  v_uid    uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RETURN jsonb_build_object('success', false, 'error', 'Not authenticated'); END IF;
  SELECT * INTO v_invite FROM public.group_invites WHERE token = p_code OR invite_code = p_code LIMIT 1;
  IF NOT FOUND THEN RETURN jsonb_build_object('success', false, 'error', 'Invite not found'); END IF;
  IF v_invite.expires_at IS NOT NULL AND v_invite.expires_at < now() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invite has expired');
  END IF;
  IF v_invite.max_uses IS NOT NULL AND v_invite.uses_count >= v_invite.max_uses THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invite has reached maximum uses');
  END IF;
  INSERT INTO public.group_members (group_id, user_id, role) VALUES (v_invite.group_id, v_uid, 'member')
    ON CONFLICT (group_id, user_id) DO NOTHING;
  UPDATE public.group_invites SET
    uses_count  = uses_count + 1,
    invite_code = COALESCE(invite_code, token),
    token       = COALESCE(token, invite_code)
  WHERE id = v_invite.id;
  RETURN jsonb_build_object('success', true, 'group_id', v_invite.group_id);
END;
$$;

-- get_membership_snapshot (handles both p_user_id and target_user_id callers)
CREATE OR REPLACE FUNCTION public.get_membership_snapshot(
  p_user_id      uuid DEFAULT NULL,
  target_user_id uuid DEFAULT NULL
)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER AS $$
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

-- get_group_analytics_from_snapshots
CREATE OR REPLACE FUNCTION public.get_group_analytics_from_snapshots(p_group_id uuid, p_days integer DEFAULT 7)
RETURNS TABLE(study_date date, total_seconds bigint, member_count bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT d.date,
    COALESCE(SUM(d.seconds_studied), 0) AS total_seconds,
    COUNT(DISTINCT d.user_id) AS member_count
  FROM public.daily_user_stats d
  JOIN public.group_members gm ON gm.user_id = d.user_id AND gm.group_id = p_group_id
  WHERE d.date >= CURRENT_DATE - (p_days - 1)
  GROUP BY d.date ORDER BY d.date ASC;
$$;

-- get_leaderboard
CREATE OR REPLACE FUNCTION public.get_leaderboard(
  p_period text DEFAULT 'weekly', p_limit integer DEFAULT 50, p_offset integer DEFAULT 0
)
RETURNS TABLE (
  rank bigint, user_id uuid, username text, name text, avatar_url text,
  total_hours numeric, weekly_hours numeric, monthly_hours numeric,
  total_sessions integer, current_streak integer, last_session_at timestamptz, score numeric
)
LANGUAGE plpgsql STABLE SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    ROW_NUMBER() OVER (ORDER BY
      CASE p_period WHEN 'monthly' THEN s.monthly_hours ELSE s.weekly_hours END DESC NULLS LAST,
      s.total_hours DESC NULLS LAST
    ) AS rank,
    s.user_id, u.username, u.name, u.avatar_url,
    COALESCE(s.total_hours,   0),
    COALESCE(s.weekly_hours,  0),
    COALESCE(s.monthly_hours, 0),
    COALESCE(s.total_sessions, 0)::integer,
    COALESCE(s.current_streak, 0)::integer,
    s.last_session_at,
    COALESCE(CASE p_period WHEN 'monthly' THEN s.monthly_hours ELSE s.weekly_hours END, 0) AS score
  FROM public.user_stats_summary s
  JOIN public.users u ON u.id = s.user_id
  ORDER BY score DESC NULLS LAST, s.total_hours DESC NULLS LAST
  LIMIT p_limit OFFSET p_offset;
END;
$$;

-- get_group_leaderboard (points-based — matches JS client)
CREATE OR REPLACE FUNCTION public.get_group_leaderboard(p_group_id uuid, p_limit integer DEFAULT 20)
RETURNS TABLE (rank bigint, user_id uuid, username text, name text, avatar_url text, points integer)
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT
    ROW_NUMBER() OVER (ORDER BY COALESCE(up.points, 0) DESC) AS rank,
    gm.user_id, u.username, u.name, u.avatar_url,
    COALESCE(up.points, 0) AS points
  FROM public.group_members gm
  JOIN public.users u             ON u.id      = gm.user_id
  LEFT JOIN public.user_points up ON up.user_id = gm.user_id
  WHERE gm.group_id = p_group_id
  ORDER BY COALESCE(up.points, 0) DESC
  LIMIT p_limit;
$$;

-- finish_session_sync (canonical, single overload)
CREATE OR REPLACE FUNCTION public.finish_session_sync(
  p_session_id       uuid        DEFAULT NULL,
  p_action           text        DEFAULT 'complete',
  p_duration_minutes integer     DEFAULT 0,
  p_group_id         uuid        DEFAULT NULL,
  p_session_type     text        DEFAULT 'focus',
  p_notes            text        DEFAULT NULL,
  p_ended_at         timestamptz DEFAULT NULL
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid       uuid    := auth.uid();
  v_today     date    := CURRENT_DATE;
  v_secs      bigint;
  v_hrs       numeric;
  v_row_count bigint;
  v_was_found boolean;
BEGIN
  IF v_uid IS NULL THEN RETURN jsonb_build_object('error', 'Not authenticated'); END IF;
  IF p_action = 'delete' THEN
    DELETE FROM public.study_sessions_log WHERE id = p_session_id AND user_id = v_uid;
    v_was_found := FOUND;
    RETURN jsonb_build_object('already_absent', NOT v_was_found,
      'affected_group_ids', CASE WHEN p_group_id IS NOT NULL THEN jsonb_build_array(p_group_id) ELSE '[]'::jsonb END,
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
    total_hours         = round((user_stats_summary.total_study_seconds + v_secs)::numeric / 3600, 2),
    weekly_hours        = user_stats_summary.weekly_hours  + v_hrs,
    monthly_hours       = user_stats_summary.monthly_hours + v_hrs,
    session_count       = user_stats_summary.session_count  + 1,
    total_sessions      = user_stats_summary.total_sessions + 1,
    last_session_at     = COALESCE(p_ended_at, now()),
    last_study_date     = v_today,
    updated_at          = now();
  RETURN jsonb_build_object('already_processed', false,
    'affected_group_ids', CASE WHEN p_group_id IS NOT NULL THEN jsonb_build_array(p_group_id) ELSE '[]'::jsonb END,
    'challenge_updates', '[]'::jsonb);
END;
$$;

-- Community events RPCs
CREATE OR REPLACE FUNCTION public.join_community_event(p_event_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_uid uuid := auth.uid(); v_evt public.community_events%ROWTYPE;
BEGIN
  IF v_uid IS NULL THEN RETURN jsonb_build_object('ok', false, 'error', 'Not authenticated'); END IF;
  SELECT * INTO v_evt FROM public.community_events WHERE id = p_event_id;
  IF NOT FOUND OR NOT v_evt.is_active THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Event not found or inactive');
  END IF;
  INSERT INTO public.community_event_attendees (event_id, user_id) VALUES (p_event_id, v_uid)
    ON CONFLICT (event_id, user_id) DO NOTHING;
  UPDATE public.community_events
    SET attendee_count = (SELECT COUNT(*) FROM public.community_event_attendees WHERE event_id = p_event_id)
  WHERE id = p_event_id;
  RETURN jsonb_build_object('ok', true);
END;
$$;

CREATE OR REPLACE FUNCTION public.leave_community_event(p_event_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RETURN jsonb_build_object('ok', false, 'error', 'Not authenticated'); END IF;
  DELETE FROM public.community_event_attendees WHERE event_id = p_event_id AND user_id = v_uid;
  UPDATE public.community_events
    SET attendee_count = (SELECT COUNT(*) FROM public.community_event_attendees WHERE event_id = p_event_id)
  WHERE id = p_event_id;
  RETURN jsonb_build_object('ok', true);
END;
$$;

CREATE OR REPLACE FUNCTION public.create_community_event(
  p_title text, p_event_type text DEFAULT 'webinar', p_description text DEFAULT NULL,
  p_host text DEFAULT NULL, p_start_time timestamptz DEFAULT now(), p_end_time timestamptz DEFAULT NULL,
  p_image_gradient text DEFAULT 'from-purple-600 to-blue-500', p_image_url text DEFAULT NULL,
  p_tags text[] DEFAULT '{}', p_max_attendees integer DEFAULT NULL,
  p_is_featured boolean DEFAULT false, p_is_active boolean DEFAULT true
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_id uuid;
BEGIN
  IF p_title IS NULL OR trim(p_title) = '' THEN RETURN jsonb_build_object('ok', false, 'error', 'title is required'); END IF;
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

CREATE OR REPLACE FUNCTION public.update_community_event(
  p_id uuid, p_title text DEFAULT NULL, p_event_type text DEFAULT NULL,
  p_description text DEFAULT NULL, p_host text DEFAULT NULL,
  p_start_time timestamptz DEFAULT NULL, p_end_time timestamptz DEFAULT NULL,
  p_image_gradient text DEFAULT NULL, p_image_url text DEFAULT NULL,
  p_tags text[] DEFAULT NULL, p_max_attendees integer DEFAULT NULL,
  p_is_featured boolean DEFAULT NULL, p_is_active boolean DEFAULT NULL
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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

CREATE OR REPLACE FUNCTION public.delete_community_event(p_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  DELETE FROM public.community_events WHERE id = p_id;
  RETURN jsonb_build_object('ok', true, 'deleted', FOUND);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_event_attendees(p_event_id uuid)
RETURNS TABLE(user_id uuid, username text, name text, avatar_url text, joined_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT cea.user_id, u.username, u.name, u.avatar_url, cea.joined_at
  FROM public.community_event_attendees cea
  LEFT JOIN public.users u ON u.id = cea.user_id
  WHERE cea.event_id = p_event_id ORDER BY cea.joined_at ASC;
$$;

-- purchase_store_item (atomic, coin-deducting)
CREATE OR REPLACE FUNCTION public.purchase_store_item(p_user_id uuid, p_item_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_item  public.store_items%ROWTYPE;
  v_pts   integer;
  v_owned boolean;
BEGIN
  SELECT * INTO v_item FROM public.store_items WHERE id = p_item_id AND active = true;
  IF NOT FOUND THEN RETURN jsonb_build_object('ok', false, 'error', 'item_not_found'); END IF;
  SELECT EXISTS(SELECT 1 FROM public.user_inventory WHERE user_id = p_user_id AND item_id = p_item_id) INTO v_owned;
  IF v_owned THEN RETURN jsonb_build_object('ok', false, 'error', 'already_owned'); END IF;
  SELECT COALESCE(points, 0) INTO v_pts FROM public.user_points WHERE user_id = p_user_id;
  IF v_pts < v_item.price THEN RETURN jsonb_build_object('ok', false, 'error', 'insufficient_coins'); END IF;
  UPDATE public.user_points SET points = points - v_item.price WHERE user_id = p_user_id;
  INSERT INTO public.user_inventory (user_id, item_id, equipped, purchased_at)
    VALUES (p_user_id, p_item_id, false, now());
  RETURN jsonb_build_object('ok', true, 'coins_remaining', v_pts - v_item.price);
END;
$$;

-- expire_stale_presence
CREATE OR REPLACE FUNCTION public.expire_stale_presence()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.user_presence SET status = 'offline'
  WHERE status != 'offline' AND last_seen < now() - interval '2 minutes';
END;
$$;

-- ── §12. GRANT EXECUTE ────────────────────────────────────────────────────────

GRANT EXECUTE ON FUNCTION public.is_premium_user()                                                     TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_premium_user(uuid)                                                 TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public._is_group_member(uuid, uuid)                                          TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_my_group_ids()                                                    TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_invite_details(text)                                              TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.accept_invite(text)                                                   TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_membership_snapshot(uuid, uuid)                                   TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_group_analytics_from_snapshots(uuid, integer)                     TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.get_leaderboard(text, integer, integer)                               TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_group_leaderboard(uuid, integer)                                  TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.finish_session_sync(uuid, text, integer, uuid, text, text, timestamptz) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.join_community_event(uuid)                                            TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.leave_community_event(uuid)                                           TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.create_community_event(text, text, text, text, timestamptz, timestamptz, text, text, text[], integer, boolean, boolean) TO service_role;
GRANT EXECUTE ON FUNCTION public.update_community_event(uuid, text, text, text, text, timestamptz, timestamptz, text, text, text[], integer, boolean, boolean) TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_community_event(uuid)                                          TO service_role;
GRANT EXECUTE ON FUNCTION public.get_event_attendees(uuid)                                             TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.purchase_store_item(uuid, uuid)                                       TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.expire_stale_presence()                                               TO service_role;

-- ── §13. Triggers ─────────────────────────────────────────────────────────────

-- handle_new_user: seeds all user satellite rows on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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
  INSERT INTO public.users (id, email, name, username, plan_type, billing_status, plan_expires_at, access_ends_at)
  VALUES (NEW.id, v_email, v_name, v_username, 'ranker', 'active', '2099-12-31 23:59:59+00', '2099-12-31 23:59:59+00')
  ON CONFLICT (id) DO UPDATE SET
    username        = EXCLUDED.username,
    -- plan_type is intentionally excluded: preserve the existing value so a
    -- manual upgrade to 'premium' is not silently overwritten on re-trigger.
    billing_status  = 'active',
    plan_expires_at = '2099-12-31 23:59:59+00',
    access_ends_at  = '2099-12-31 23:59:59+00',
    updated_at      = now();
  INSERT INTO public.user_profiles    (user_id, profile_data)                              VALUES (NEW.id, '{}')        ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.user_onboarding  (user_id, completed, source)                         VALUES (NEW.id, false, 'signup') ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.user_points      (user_id, points, lifetime_points)                   VALUES (NEW.id, 0, 0)        ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.user_stats_summary (user_id, total_study_seconds, streak_days, max_streak_days, session_count)
    VALUES (NEW.id, 0, 0, 0, 0)                                                                                         ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.user_presence    (user_id, status, last_seen)                         VALUES (NEW.id, 'offline', now()) ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.user_settings    (user_id, settings)                                  VALUES (NEW.id, '{}')        ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- sync_user_onboarding_from_profile
CREATE OR REPLACE FUNCTION public.sync_user_onboarding_from_profile()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_done         boolean;
  v_completed_at timestamptz;
BEGIN
  v_done := COALESCE((NEW.profile_data->>'isOnboarded')::boolean, false);
  IF v_done THEN
    v_completed_at := COALESCE(NULLIF(NEW.profile_data->>'onboardingCompletedAt', '')::timestamptz, now());
  ELSE
    v_completed_at := NULL;
  END IF;
  INSERT INTO public.user_onboarding (user_id, completed, completed_at, source, updated_at)
  VALUES (NEW.user_id, v_done, v_completed_at, 'profile', now())
  ON CONFLICT (user_id) DO UPDATE SET
    completed    = EXCLUDED.completed,
    completed_at = COALESCE(EXCLUDED.completed_at, public.user_onboarding.completed_at),
    source       = EXCLUDED.source,
    updated_at   = now();
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS tr_sync_user_onboarding_from_profile ON public.user_profiles;
CREATE TRIGGER tr_sync_user_onboarding_from_profile
  AFTER INSERT OR UPDATE OF profile_data ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.sync_user_onboarding_from_profile();

-- cleanup_old_notifications
CREATE OR REPLACE FUNCTION public.cleanup_old_notifications()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  DELETE FROM public.notifications WHERE user_id = NEW.user_id AND created_at < now() - interval '90 days';
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS tr_cleanup_old_notifications ON public.notifications;
CREATE TRIGGER tr_cleanup_old_notifications
  AFTER INSERT ON public.notifications
  FOR EACH ROW EXECUTE FUNCTION public.cleanup_old_notifications();

-- ── §13b. user_tours — persistent tour/guide state per user ──────────────────
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

CREATE OR REPLACE FUNCTION public.set_user_tours_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS trg_user_tours_updated_at ON public.user_tours;
CREATE TRIGGER trg_user_tours_updated_at
  BEFORE UPDATE ON public.user_tours
  FOR EACH ROW EXECUTE FUNCTION public.set_user_tours_updated_at();

-- ── §14. Storage buckets ──────────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars',      'avatars',      true,  5242880,  ARRAY['image/png','image/jpeg','image/webp','image/gif']),
  ('user-content', 'user-content', false, 52428800, NULL),
  ('notes',        'notes',        false, 52428800, NULL)
ON CONFLICT (id) DO UPDATE SET
  public             = EXCLUDED.public,
  file_size_limit    = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "avatars_public_read"          ON storage.objects;
DROP POLICY IF EXISTS "avatars_user_insert_own"      ON storage.objects;
DROP POLICY IF EXISTS "avatars_user_update_own"      ON storage.objects;
DROP POLICY IF EXISTS "avatars_user_delete_own"      ON storage.objects;
DROP POLICY IF EXISTS "private_content_owner_read"   ON storage.objects;
DROP POLICY IF EXISTS "private_content_owner_insert" ON storage.objects;
DROP POLICY IF EXISTS "private_content_owner_update" ON storage.objects;
DROP POLICY IF EXISTS "private_content_owner_delete" ON storage.objects;

CREATE POLICY "avatars_public_read" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'avatars');
CREATE POLICY "avatars_user_insert_own" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "avatars_user_update_own" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "avatars_user_delete_own" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "private_content_owner_read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id IN ('user-content','notes') AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "private_content_owner_insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('user-content','notes') AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "private_content_owner_update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id IN ('user-content','notes') AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id IN ('user-content','notes') AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "private_content_owner_delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id IN ('user-content','notes') AND auth.uid()::text = (storage.foldername(name))[1]);

-- ── §15. Supabase Realtime — publish key tables ───────────────────────────────

DO $$ BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.group_chat_messages;        EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.user_presence;              EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;              EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.community_events;           EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.community_event_attendees;  EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.groups;                     EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.group_members;              EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.user_settings;              EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.user_tours;               EXCEPTION WHEN OTHERS THEN NULL; END;
END $$;

-- ── §16. Backfill existing users into satellite tables ────────────────────────

INSERT INTO public.user_points (user_id, points, lifetime_points)
  SELECT id, 0, 0 FROM public.users
  WHERE NOT EXISTS (SELECT 1 FROM public.user_points WHERE user_id = users.id)
  ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.user_stats_summary (user_id, total_study_seconds, streak_days, max_streak_days, session_count)
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

INSERT INTO public.user_settings (user_id, settings)
  SELECT id, '{}' FROM public.users
  WHERE NOT EXISTS (SELECT 1 FROM public.user_settings WHERE user_id = users.id)
  ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.user_onboarding (user_id, completed, source)
  SELECT id, false, 'backfill' FROM public.users
  WHERE NOT EXISTS (SELECT 1 FROM public.user_onboarding WHERE user_id = users.id)
  ON CONFLICT (user_id) DO NOTHING;

-- Backfill onboarding from profile_data
INSERT INTO public.user_onboarding (user_id, completed, completed_at, source, updated_at)
SELECT
  up.user_id,
  COALESCE((up.profile_data->>'isOnboarded')::boolean, false),
  CASE WHEN COALESCE((up.profile_data->>'isOnboarded')::boolean, false)
       THEN COALESCE(NULLIF(up.profile_data->>'onboardingCompletedAt', '')::timestamptz, now())
       ELSE NULL END,
  'backfill', now()
FROM public.user_profiles up
ON CONFLICT (user_id) DO UPDATE SET
  completed    = EXCLUDED.completed,
  completed_at = COALESCE(EXCLUDED.completed_at, public.user_onboarding.completed_at),
  updated_at   = now();

-- ── §17. Seed: default community events ──────────────────────────────────────
-- Idempotent: WHERE NOT EXISTS guard skips existing events by title.

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
   'from-violet-600 to-indigo-500', '{JEE,Strategy,Physics,Chemistry,Maths}', 500, true),
  ('NEET Biology Deep Dive',
   'workshop',
   'Intensive workshop: Genetics, Ecology, Human Physiology — the chapters that decide NEET ranks.',
   'Dr. Priya Sharma',
   (now() + interval '5 days')::text, (now() + interval '5 days' + interval '3 hours')::text,
   'from-emerald-600 to-teal-500', '{NEET,Biology,Genetics,Ecology}', 300, true),
  ('Physics Problem-Solving Workshop',
   'workshop',
   'Live problem solving for Mechanics, Electrostatics and Modern Physics. Bring your toughest doubts.',
   'IIT Alumni Study Group',
   (now() + interval '7 days')::text, (now() + interval '7 days' + interval '2 hours')::text,
   'from-blue-600 to-cyan-500', '{Physics,Mechanics,Electrostatics,JEE}', 200, false),
  ('Weekly Community Study Session',
   'study_session',
   'Join 200+ students for a focused 2-hour session with Pomodoro timer and live leaderboard.',
   'IsotopeAI Community',
   (now() + interval '1 day')::text, (now() + interval '1 day' + interval '2 hours')::text,
   'from-purple-600 to-pink-500', '{Community,Focus,Leaderboard}', NULL, true),
  ('Chemistry Organic Reaction Masterclass',
   'webinar',
   'Complete walkthrough of Name Reactions, Mechanisms and shortcuts for Organic Chemistry.',
   'Dr. Rahul Verma',
   (now() + interval '10 days')::text, (now() + interval '10 days' + interval '2 hours')::text,
   'from-orange-600 to-amber-500', '{Chemistry,Organic,JEE,NEET}', 400, false),
  ('Mathematics Integration & Calculus Sprint',
   'workshop',
   'Speed math for Integration, Differential Equations and limits — shortcuts that save 5+ minutes.',
   'Ishaan Arora (IIT Bombay 2023)',
   (now() + interval '14 days')::text, (now() + interval '14 days' + interval '90 minutes')::text,
   'from-rose-600 to-red-500', '{Maths,Calculus,JEE,Integration}', 250, false)
) AS v(title, event_type, description, host, start_time, end_time, image_gradient, tags, max_attendees, is_featured)
WHERE NOT EXISTS (SELECT 1 FROM public.community_events ce WHERE ce.title = v.title);

-- ── §18. Live-DB trigger functions (in DB but not previously in schema file) ──
-- These functions exist in the live Supabase project (confirmed via pg_proc audit).
-- Documented here so a fresh install produces an identical DB to the live instance.

-- §18a. handle_new_user_profile — secondary signup trigger that ensures
-- user_profiles and user_settings rows exist. Complements handle_new_user().
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, profile_data)
  VALUES (NEW.id, jsonb_build_object(
    'display_name', COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    'avatar_url', COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    'bio', ''
  ))
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.user_settings (user_id, settings)
  VALUES (NEW.id, '{}'::jsonb)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_handle_new_user_profile ON auth.users;
CREATE TRIGGER trg_handle_new_user_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

-- §18b. rls_auto_enable — event trigger: automatically enables RLS on every
-- new public table created during migrations, preventing accidental open tables.
CREATE OR REPLACE FUNCTION public.rls_auto_enable()
RETURNS event_trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog AS $$
DECLARE cmd record;
BEGIN
  FOR cmd IN
    SELECT * FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
    IF cmd.schema_name IS NOT NULL
      AND cmd.schema_name IN ('public')
      AND cmd.schema_name NOT LIKE 'pg_%'
      AND cmd.schema_name NOT IN ('information_schema')
    THEN
      BEGIN
        EXECUTE format('ALTER TABLE IF EXISTS %s ENABLE ROW LEVEL SECURITY', cmd.object_identity);
      EXCEPTION WHEN OTHERS THEN NULL;
      END;
    END IF;
  END LOOP;
END; $$;

DROP EVENT TRIGGER IF EXISTS rls_auto_enable;
CREATE EVENT TRIGGER rls_auto_enable ON ddl_command_end
  WHEN TAG IN ('CREATE TABLE','CREATE TABLE AS','SELECT INTO')
  EXECUTE FUNCTION public.rls_auto_enable();

-- §18c. set_group_slug_from_name — BEFORE INSERT trigger on public.groups.
-- Auto-generates a URL-safe slug from the group name when none is supplied.
CREATE OR REPLACE FUNCTION public.set_group_slug_from_name()
RETURNS trigger LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  IF NEW.slug IS NULL THEN
    NEW.slug := lower(regexp_replace(COALESCE(NEW.name,''), '[^a-zA-Z0-9]+', '-', 'g'));
    IF NEW.slug = '' THEN NEW.slug := NULL; END IF;
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_set_group_slug ON public.groups;
CREATE TRIGGER trg_set_group_slug
  BEFORE INSERT ON public.groups
  FOR EACH ROW EXECUTE FUNCTION public.set_group_slug_from_name();

-- §18d. sync_group_visibility — BEFORE INSERT OR UPDATE on public.groups.
-- Keeps is_public in sync when a visibility text column is set.
CREATE OR REPLACE FUNCTION public.sync_group_visibility()
RETURNS trigger LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  IF NEW.visibility IS NULL THEN RETURN NEW; END IF;
  NEW.is_public := lower(trim(NEW.visibility)) IN ('public','true','t','1','yes','y');
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_sync_group_visibility ON public.groups;
CREATE TRIGGER trg_sync_group_visibility
  BEFORE INSERT OR UPDATE ON public.groups
  FOR EACH ROW EXECUTE FUNCTION public.sync_group_visibility();

-- §18e. sync_group_member_count — AFTER INSERT/DELETE on public.group_members.
-- Keeps groups.member_count accurate without expensive COUNT(*) queries.
CREATE OR REPLACE FUNCTION public.sync_group_member_count()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.groups SET member_count = member_count + 1 WHERE id = NEW.group_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.groups SET member_count = GREATEST(member_count - 1, 0) WHERE id = OLD.group_id;
  END IF;
  RETURN NULL;
END; $$;

DROP TRIGGER IF EXISTS trg_sync_member_count ON public.group_members;
CREATE TRIGGER trg_sync_member_count
  AFTER INSERT OR DELETE ON public.group_members
  FOR EACH ROW EXECUTE FUNCTION public.sync_group_member_count();

-- §18f. create_community_group — RPC wrapper for group creation.
-- Handles slug generation and inserts the creator as owner atomically.
-- NOTE: frontend uses direct .from("groups").insert() — this RPC is an
-- alternative path useful for server-side / admin scripts.
CREATE OR REPLACE FUNCTION public.create_community_group(
  p_name        text,
  p_description text    DEFAULT NULL,
  p_category    text    DEFAULT 'community',
  p_is_public   boolean DEFAULT true,
  p_slug        text    DEFAULT NULL,
  p_logo_url    text    DEFAULT NULL,
  p_cover_url   text    DEFAULT NULL,
  p_settings    jsonb   DEFAULT '{}'
)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  v_group_id uuid;
  v_uid      uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  IF p_slug IS NULL THEN
    p_slug := lower(regexp_replace(COALESCE(p_name,''), '[^a-zA-Z0-9]+', '-', 'g'));
    IF p_slug = '' THEN p_slug := NULL; END IF;
  END IF;

  INSERT INTO public.groups (name, description, category, is_public, slug, logo_url, cover_url, owner_id, settings)
  VALUES (p_name, p_description, p_category, COALESCE(p_is_public, true), p_slug, p_logo_url, p_cover_url, v_uid, COALESCE(p_settings, '{}'))
  RETURNING id INTO v_group_id;

  INSERT INTO public.group_members (group_id, user_id, role)
  VALUES (v_group_id, v_uid, 'owner')
  ON CONFLICT (group_id, user_id) DO UPDATE SET role = EXCLUDED.role;

  RETURN v_group_id;
END; $$;

-- §18g. check_user_role — simple role membership check used by admin middleware.
CREATE OR REPLACE FUNCTION public.check_user_role(p_user_id uuid, p_role text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = p_user_id AND role = p_role);
$$;

-- §18h. get_my_role — returns the highest-priority role for the calling user.
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public AS $$
  SELECT role FROM public.user_roles
  WHERE user_id = auth.uid()
  ORDER BY CASE role WHEN 'admin' THEN 1 WHEN 'moderator' THEN 2 ELSE 3 END
  LIMIT 1;
$$;

-- §18 grants
GRANT EXECUTE ON FUNCTION public.handle_new_user_profile()                                           TO service_role;
GRANT EXECUTE ON FUNCTION public.set_group_slug_from_name()                                          TO service_role;
GRANT EXECUTE ON FUNCTION public.sync_group_visibility()                                             TO service_role;
GRANT EXECUTE ON FUNCTION public.sync_group_member_count()                                           TO service_role;
GRANT EXECUTE ON FUNCTION public.create_community_group(text,text,text,boolean,text,text,text,jsonb) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.check_user_role(uuid,text)                                         TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_my_role()                                                       TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.backup_manifests                                      TO authenticated;
GRANT ALL ON public.backup_manifests                                                                TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sync_items                                            TO authenticated;
GRANT ALL ON public.sync_items                                                                      TO service_role;

-- ── Done ──────────────────────────────────────────────────────────────────────
-- Verify:
--   SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;
--   SELECT policyname, tablename FROM pg_policies WHERE schemaname='public' ORDER BY tablename, policyname;
--   SELECT routine_name FROM information_schema.routines WHERE routine_schema='public' ORDER BY routine_name;
-- ============================================================================
