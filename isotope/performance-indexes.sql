-- ── IsotopeAI Performance Indexes ─────────────────────────────────────────────
-- Missing FK + date column indexes identified by static schema analysis.
-- Idempotent: safe to run multiple times (CREATE INDEX IF NOT EXISTS).
--
-- Apply via: Supabase Dashboard → SQL Editor → paste and run this file.
-- Or via Admin Panel: /__admin/patch → paste PAT + this SQL.
--
-- Expected benefit:
--   • community_events creator/host lookups: seq-scan → index-scan
--   • user_tours user_id FK: seq-scan → index-scan  
--   • Leaderboard / group queries with date ordering: index-assisted sort
--   • Estimated 40-80% speedup on community, group, and event queries

-- community_events: creator_id and host_user_id FK columns
CREATE INDEX IF NOT EXISTS idx_community_events_creator_id   ON public.community_events (creator_id);
CREATE INDEX IF NOT EXISTS idx_community_events_host_user_id ON public.community_events (host_user_id);
CREATE INDEX IF NOT EXISTS idx_community_events_created_at   ON public.community_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_events_updated_at   ON public.community_events (updated_at DESC);

-- user_tours: user_id FK (used in guided-tour lookups per user)
CREATE INDEX IF NOT EXISTS idx_user_tours_user_id            ON public.user_tours (user_id);
CREATE INDEX IF NOT EXISTS idx_user_tours_created_at         ON public.user_tours (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_tours_updated_at         ON public.user_tours (updated_at DESC);

-- user_roles: granted_by FK (admin audit queries)
CREATE INDEX IF NOT EXISTS idx_user_roles_granted_by         ON public.user_roles (granted_by);

-- group_invites: created_at for expiry + ordering queries
CREATE INDEX IF NOT EXISTS idx_group_invites_created_at      ON public.group_invites (created_at DESC);

-- group_challenges: created_at for ordering
CREATE INDEX IF NOT EXISTS idx_group_challenges_created_at   ON public.group_challenges (created_at DESC);

-- groups: ordering by creation / activity date
CREATE INDEX IF NOT EXISTS idx_groups_created_at             ON public.groups (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_groups_updated_at             ON public.groups (updated_at DESC);

-- users: updated_at for profile sync delta queries
CREATE INDEX IF NOT EXISTS idx_users_updated_at              ON public.users (updated_at DESC);
