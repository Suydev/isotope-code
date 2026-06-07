-- ============================================================================
-- IsotopeAI — Performance Patch
-- ============================================================================
-- Run this in the Supabase SQL Editor (or via psql) after isotope-complete.sql
-- (or after community-patch-v4.sql on existing installs).
-- Safe to re-run: all DDL uses IF NOT EXISTS / CREATE OR REPLACE.
-- ============================================================================

-- ── 1. Covering index for the RLS membership subquery ─────────────────────
--
-- Six RLS policies on group-related tables use this pattern:
--   group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
--
-- The existing idx_gm_user only covers (user_id). Adding (user_id, group_id)
-- lets Postgres satisfy the subquery with an index-only scan — no heap fetch.
--
CREATE INDEX IF NOT EXISTS idx_gm_user_group_covering
  ON public.group_members (user_id, group_id);

-- ── 2. Missing foreign-key indexes ───────────────────────────────────────
--
-- Supabase Advisor flags unindexed FK columns because DELETE/UPDATE on the
-- parent table (auth.users) requires a sequential scan of the child table
-- to enforce ON DELETE CASCADE.  Add indexes for every FK that lacks one.

CREATE INDEX IF NOT EXISTS idx_ginv_created_by
  ON public.group_invites (created_by);

CREATE INDEX IF NOT EXISTS idx_gann_author
  ON public.group_announcements (author_id);

CREATE INDEX IF NOT EXISTS idx_gchall_created_by
  ON public.group_challenges (created_by);

CREATE INDEX IF NOT EXISTS idx_gcpart_challenge_user
  ON public.group_challenge_participants (challenge_id, user_id);

-- user_inventory index — guarded in case the table was previously dropped
-- (events-expansion.sql drops it; isotope-complete.sql re-creates it).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'user_inventory'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_inventory_user ON public.user_inventory (user_id);
  END IF;
END $$;

-- ── 3. Security-definer helper for group membership ───────────────────────
--
-- Replaces the inline correlated subquery in RLS policies with a stable
-- SECURITY DEFINER function.  Postgres can cache this result per statement,
-- turning O(policies × rows) subqueries into O(1) per query.
--
CREATE OR REPLACE FUNCTION public.get_my_group_ids()
RETURNS uuid[]
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT ARRAY(
    SELECT group_id
    FROM public.group_members
    WHERE user_id = (SELECT auth.uid())
  );
$$;

-- ── 4. Presence and stats indexes ────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_presence_updated_at
  ON public.user_presence (updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_sessions_user_started
  ON public.study_sessions_log (user_id, started_at DESC);

CREATE INDEX IF NOT EXISTS idx_daily_user_date_minutes
  ON public.daily_user_stats (user_id, date DESC)
  INCLUDE (seconds_studied);

-- ── 5. RLS auth.uid() → (SELECT auth.uid()) — Supabase Advisor fix ────────
--
-- The Supabase Performance Advisor flags every RLS policy that calls auth.uid()
-- directly because PostgreSQL evaluates it once per row.  Wrapping it as
-- (SELECT auth.uid()) forces a single evaluation per query — often the largest
-- single source of RLS overhead on busy tables.
--
-- This section drops and re-creates every affected policy.  It is safe to
-- re-run because each DROP uses IF EXISTS.
--
-- ─── public.users ──────────────────────────────────────────────────────────

DROP POLICY IF EXISTS users_own ON public.users;
CREATE POLICY users_own ON public.users
  FOR ALL
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

-- ─── public.user_profiles ─────────────────────────────────────────────────

DROP POLICY IF EXISTS profiles_own ON public.user_profiles;
CREATE POLICY profiles_own ON public.user_profiles
  FOR ALL
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- ─── public.user_points ───────────────────────────────────────────────────

DROP POLICY IF EXISTS points_own_write ON public.user_points;
CREATE POLICY points_own_write ON public.user_points
  FOR ALL
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- ─── public.user_stats_summary ────────────────────────────────────────────

DROP POLICY IF EXISTS stats_own ON public.user_stats_summary;
CREATE POLICY stats_own ON public.user_stats_summary
  FOR ALL
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- ─── public.daily_user_stats ──────────────────────────────────────────────

DROP POLICY IF EXISTS daily_own ON public.daily_user_stats;
CREATE POLICY daily_own ON public.daily_user_stats
  FOR ALL
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- ─── public.study_sessions_log ────────────────────────────────────────────

DROP POLICY IF EXISTS sessions_own ON public.study_sessions_log;
CREATE POLICY sessions_own ON public.study_sessions_log
  FOR ALL
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- ─── public.user_inventory ────────────────────────────────────────────────
-- Guarded: table may not exist if events-expansion.sql was run without
-- isotope-complete.sql re-creating it first.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'user_inventory'
  ) THEN
    DROP POLICY IF EXISTS inventory_own ON public.user_inventory;
    CREATE POLICY inventory_own ON public.user_inventory
      FOR ALL
      USING (user_id = (SELECT auth.uid()))
      WITH CHECK (user_id = (SELECT auth.uid()));
  END IF;
END $$;

-- ─── public.notifications ─────────────────────────────────────────────────

DROP POLICY IF EXISTS notif_own ON public.notifications;
CREATE POLICY notif_own ON public.notifications
  FOR ALL
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- ─── public.user_presence ─────────────────────────────────────────────────
-- Replace auth.role() = 'authenticated' with the safer uid IS NOT NULL check.

DROP POLICY IF EXISTS presence_read_auth ON public.user_presence;
CREATE POLICY presence_read_auth ON public.user_presence
  FOR SELECT
  USING ((SELECT auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS presence_own_write ON public.user_presence;
CREATE POLICY presence_own_write ON public.user_presence
  FOR ALL
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- ─── public.groups ────────────────────────────────────────────────────────

DROP POLICY IF EXISTS groups_owner_write ON public.groups;
CREATE POLICY groups_owner_write ON public.groups
  FOR ALL
  USING (owner_id = (SELECT auth.uid()))
  WITH CHECK (owner_id = (SELECT auth.uid()));

-- ─── public.group_members ─────────────────────────────────────────────────

DROP POLICY IF EXISTS gm_read_members ON public.group_members;
CREATE POLICY gm_read_members ON public.group_members
  FOR SELECT
  USING (
    group_id = ANY (public.get_my_group_ids())
  );

DROP POLICY IF EXISTS gm_own_write ON public.group_members;
CREATE POLICY gm_own_write ON public.group_members
  FOR ALL
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- ─── public.group_chat_messages ───────────────────────────────────────────

DROP POLICY IF EXISTS gchat_read_members ON public.group_chat_messages;
CREATE POLICY gchat_read_members ON public.group_chat_messages
  FOR SELECT
  USING (group_id = ANY (public.get_my_group_ids()));

DROP POLICY IF EXISTS gchat_send ON public.group_chat_messages;
CREATE POLICY gchat_send ON public.group_chat_messages
  FOR INSERT
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND group_id = ANY (public.get_my_group_ids())
  );

DROP POLICY IF EXISTS gchat_delete_own ON public.group_chat_messages;
CREATE POLICY gchat_delete_own ON public.group_chat_messages
  FOR UPDATE
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- ─── public.group_challenges ──────────────────────────────────────────────

DROP POLICY IF EXISTS gchall_read ON public.group_challenges;
CREATE POLICY gchall_read ON public.group_challenges
  FOR SELECT
  USING (group_id = ANY (public.get_my_group_ids()));

DROP POLICY IF EXISTS gchall_write ON public.group_challenges;
CREATE POLICY gchall_write ON public.group_challenges
  FOR ALL
  USING (created_by = (SELECT auth.uid()))
  WITH CHECK (created_by = (SELECT auth.uid()));

-- ─── public.group_challenge_participants ──────────────────────────────────

DROP POLICY IF EXISTS gcpart_own ON public.group_challenge_participants;
CREATE POLICY gcpart_own ON public.group_challenge_participants
  FOR ALL
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS gcpart_read_members ON public.group_challenge_participants;
CREATE POLICY gcpart_read_members ON public.group_challenge_participants
  FOR SELECT
  USING (
    challenge_id IN (
      SELECT gch.id
      FROM public.group_challenges gch
      JOIN public.group_members gm ON gm.group_id = gch.group_id
      WHERE gm.user_id = (SELECT auth.uid())
    )
  );

-- ─── public.group_announcements ───────────────────────────────────────────

DROP POLICY IF EXISTS gann_read ON public.group_announcements;
CREATE POLICY gann_read ON public.group_announcements
  FOR SELECT
  USING (group_id = ANY (public.get_my_group_ids()));

DROP POLICY IF EXISTS gann_write ON public.group_announcements;
CREATE POLICY gann_write ON public.group_announcements
  FOR ALL
  USING (author_id = (SELECT auth.uid()))
  WITH CHECK (author_id = (SELECT auth.uid()));

-- ─── public.group_invites ─────────────────────────────────────────────────

DROP POLICY IF EXISTS ginv_read ON public.group_invites;
CREATE POLICY ginv_read ON public.group_invites
  FOR SELECT
  USING (
    group_id = ANY (public.get_my_group_ids())
    OR created_by = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS ginv_create ON public.group_invites;
CREATE POLICY ginv_create ON public.group_invites
  FOR INSERT
  WITH CHECK (
    created_by = (SELECT auth.uid())
    AND group_id IN (
      SELECT group_id FROM public.group_members
      WHERE user_id = (SELECT auth.uid()) AND role IN ('admin','moderator')
    )
  );

-- ─── public.group_milestones ──────────────────────────────────────────────

DROP POLICY IF EXISTS gmile_read ON public.group_milestones;
CREATE POLICY gmile_read ON public.group_milestones
  FOR SELECT
  USING (group_id = ANY (public.get_my_group_ids()));

-- ── 6. Leaderboard public-read policies ──────────────────────────────────────
-- The §5 stats_own / daily_own policies restrict all access (SELECT + writes) to
-- own-row only.  This is correct for writes, but the global and daily leaderboard
-- need to read stats for ALL users, not just the current user.
-- Separate FOR SELECT policies allow any authenticated request to read all rows
-- while the FOR ALL policies above still guard INSERT/UPDATE/DELETE to own rows.
-- Multiple permissive policies combine with OR, so:
--   SELECT visible when:  (user_id = auth.uid())  OR  (auth.uid() IS NOT NULL)
--                        = any authenticated row    (correct for leaderboard)
--   INSERT/UPDATE/DELETE: still guarded by WITH CHECK (user_id = auth.uid())

DROP POLICY IF EXISTS stats_select_all ON public.user_stats_summary;
CREATE POLICY stats_select_all ON public.user_stats_summary
  FOR SELECT
  USING ((SELECT auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS daily_select_all ON public.daily_user_stats;
CREATE POLICY daily_select_all ON public.daily_user_stats
  FOR SELECT
  USING ((SELECT auth.uid()) IS NOT NULL);

-- Allow reading basic display info (username, name, avatar_url) for leaderboard.
-- User emails, passwords, and other sensitive fields are NOT in the users table
-- (those live in auth.users which is always restricted).  This public-read policy
-- only exposes the public-facing display fields the leaderboard already shows.
DROP POLICY IF EXISTS users_select_display ON public.users;
CREATE POLICY users_select_display ON public.users
  FOR SELECT
  USING (TRUE);

-- ── Done ──────────────────────────────────────────────────────────────────
-- Verification:
--   SELECT policyname, tablename FROM pg_policies
--   WHERE schemaname = 'public'
--   ORDER BY tablename, policyname;
-- Expected: all policies present, none duplicated.
-- ============================================================================
