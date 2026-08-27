-- leaderboard-rls-fix.sql
-- Fix RLS policies so the leaderboard can read other users' stats.
-- Problem: stats_own (FOR ALL, own rows only) blocks public SELECT on
-- user_stats_summary and daily_user_stats, making the leaderboard empty.
-- Run: psql "$DATABASE_URL" -f leaderboard-rls-fix.sql

BEGIN;

-- ── user_stats_summary ──────────────────────────────────────────────
-- Drop the old FOR ALL policy that blocks public read
DROP POLICY IF EXISTS stats_own         ON public.user_stats_summary;
DROP POLICY IF EXISTS stats_own_write   ON public.user_stats_summary;
DROP POLICY IF EXISTS stats_select_all  ON public.user_stats_summary;
DROP POLICY IF EXISTS stats_read_all    ON public.user_stats_summary;

-- Public read for leaderboard
CREATE POLICY stats_read_all ON public.user_stats_summary
  FOR SELECT USING (true);

-- Own-row write (insert/update/delete)
CREATE POLICY stats_own ON public.user_stats_summary
  FOR ALL USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- ── daily_user_stats ────────────────────────────────────────────────
DROP POLICY IF EXISTS daily_own        ON public.daily_user_stats;
DROP POLICY IF EXISTS daily_select_all ON public.daily_user_stats;
DROP POLICY IF EXISTS daily_read_all   ON public.daily_user_stats;

CREATE POLICY daily_read_all ON public.daily_user_stats
  FOR SELECT USING (true);

CREATE POLICY daily_own ON public.daily_user_stats
  FOR ALL USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- ── Verify ──────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_stats_summary' AND policyname = 'stats_read_all'
  ) THEN
    RAISE EXCEPTION 'stats_read_all policy not created';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'daily_user_stats' AND policyname = 'daily_read_all'
  ) THEN
    RAISE EXCEPTION 'daily_read_all policy not created';
  END IF;
  RAISE NOTICE 'Leaderboard RLS fix applied successfully';
END $$;

COMMIT;
