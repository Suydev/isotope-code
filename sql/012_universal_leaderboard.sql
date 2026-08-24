-- Fix get_leaderboard: LEFT JOIN from users so ALL users appear (even 0 hours)
CREATE OR REPLACE FUNCTION public.get_leaderboard(
  p_period text DEFAULT 'weekly'::text,
  p_limit integer DEFAULT 50,
  p_offset integer DEFAULT 0
)
RETURNS TABLE(
  "rank" bigint,
  user_id uuid,
  username text,
  "name" text,
  avatar_url text,
  total_hours numeric,
  weekly_hours numeric,
  monthly_hours numeric,
  total_sessions integer,
  current_streak integer,
  last_session_at timestamptz,
  score numeric
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $body$
  SELECT
    ROW_NUMBER() OVER (
      ORDER BY
        CASE p_period
          WHEN 'monthly' THEN COALESCE(s.monthly_hours, 0)
          ELSE                COALESCE(s.weekly_hours, 0)
        END DESC,
        COALESCE(s.total_hours, 0) DESC
    ) AS rank,
    u.id AS user_id,
    u.username,
    u."name",
    u.avatar_url,
    COALESCE(s.total_hours, 0)   AS total_hours,
    COALESCE(s.weekly_hours, 0)  AS weekly_hours,
    COALESCE(s.monthly_hours, 0) AS monthly_hours,
    COALESCE(s.total_sessions, 0)::integer AS total_sessions,
    COALESCE(s.current_streak, 0)::integer AS current_streak,
    s.last_session_at,
    COALESCE(
      CASE p_period WHEN 'monthly' THEN s.monthly_hours ELSE s.weekly_hours END, 0
    ) AS score
  FROM public.users u
  LEFT JOIN public.user_stats_summary s ON s.user_id = u.id
  ORDER BY
    CASE p_period
      WHEN 'monthly' THEN COALESCE(s.monthly_hours, 0)
      ELSE                COALESCE(s.weekly_hours, 0)
    END DESC,
    COALESCE(s.total_hours, 0) DESC
  LIMIT p_limit
  OFFSET p_offset;
$body$;

-- Backfill: ensure every user has a user_stats_summary row (0s if nothing)
INSERT INTO public.user_stats_summary (user_id, total_hours, weekly_hours, monthly_hours, total_sessions, current_streak)
SELECT u.id, 0, 0, 0, 0, 0
FROM public.users u
WHERE NOT EXISTS (SELECT 1 FROM public.user_stats_summary s WHERE s.user_id = u.id)
ON CONFLICT (user_id) DO NOTHING;

-- Trigger: auto-create stats row for new signups
CREATE OR REPLACE FUNCTION public._ensure_stats_summary()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $body$
BEGIN
  INSERT INTO public.user_stats_summary (user_id, total_hours, weekly_hours, monthly_hours, total_sessions, current_streak)
  VALUES (NEW.id, 0, 0, 0, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$body$;

DROP TRIGGER IF EXISTS trg_ensure_stats ON public.users;
CREATE TRIGGER trg_ensure_stats
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION public._ensure_stats_summary();
