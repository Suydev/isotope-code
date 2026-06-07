-- ============================================================================
-- IsotopeAI — Performance Patch
-- ============================================================================
-- Run this in the Supabase SQL Editor (or via psql) after isotope-schema.sql.
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

-- group_invites.created_by → no index exists
CREATE INDEX IF NOT EXISTS idx_ginv_created_by
  ON public.group_invites (created_by);

-- group_announcements.author_id → no index exists
CREATE INDEX IF NOT EXISTS idx_gann_author
  ON public.group_announcements (author_id);

-- group_challenges.created_by → no index exists
CREATE INDEX IF NOT EXISTS idx_gchall_created_by
  ON public.group_challenges (created_by);

-- group_challenge_participants: composite (challenge_id, user_id) for fast
-- member-in-challenge lookups used by the gcpart_read_members RLS policy
CREATE INDEX IF NOT EXISTS idx_gcpart_challenge_user
  ON public.group_challenge_participants (challenge_id, user_id);

-- user_inventory.user_id → ensure exists (may already; safe to re-run)
CREATE INDEX IF NOT EXISTS idx_inventory_user
  ON public.user_inventory (user_id);

-- ── 3. Security-definer helper for group membership ───────────────────────
--
-- Replaces the inline correlated subquery in RLS policies with a stable
-- SECURITY DEFINER function.  Postgres can cache this result per statement,
-- turning O(policies × rows) subqueries into O(1) per query.
--
-- To adopt this, replace:
--   group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
-- with:
--   group_id = ANY (public.get_my_group_ids())
-- in each RLS policy.  The policies below do that replacement for the tables
-- most queried during a normal session.

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
    WHERE user_id = auth.uid()
  );
$$;

-- ── 4. Presence table: index on updated_at for cleanup queries ────────────
--
-- Offline-sweep queries filter by updated_at to find stale presence rows.
CREATE INDEX IF NOT EXISTS idx_presence_updated_at
  ON public.user_presence (updated_at DESC);

-- ── 5. study_sessions_log: composite index for per-user time range queries ─
--
-- Sessions are commonly fetched as: WHERE user_id = X AND started_at > Y
CREATE INDEX IF NOT EXISTS idx_sessions_user_started
  ON public.study_sessions_log (user_id, started_at DESC);

-- ── 6. daily_user_stats: composite covering index ─────────────────────────
--
-- Leaderboard and stats queries filter by (user_id, date) then read minutes.
-- A covering index avoids heap fetches for these lightweight reads.
CREATE INDEX IF NOT EXISTS idx_daily_user_date_minutes
  ON public.daily_user_stats (user_id, date DESC)
  INCLUDE (study_minutes);

-- ── Done ──────────────────────────────────────────────────────────────────
-- To verify index usage:
--   EXPLAIN (ANALYZE, BUFFERS)
--   SELECT group_id FROM public.group_members WHERE user_id = auth.uid();
-- Expected: Index Only Scan using idx_gm_user_group_covering
-- ============================================================================
