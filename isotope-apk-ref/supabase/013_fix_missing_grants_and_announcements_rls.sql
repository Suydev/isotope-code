-- 013: Fix missing table grants and RLS policies that cause
--   • CommunityHub "STABLE FALLBACK" crash (group_announcements had NO grants)
--   • "Create Group" silently failing   (groups INSERT + group_members INSERT missing)
--   • group_invites read denied on Android
--
-- Safe to re-run (idempotent via IF NOT EXISTS / OR REPLACE).

-- ── 1. group_announcements ───────────────────────────────────────────────────
-- Anon can read all announcements for public groups.
-- Authenticated can read, create, and delete their own.
GRANT SELECT                    ON public.group_announcements TO anon;
GRANT SELECT, INSERT, DELETE    ON public.group_announcements TO authenticated;

ALTER TABLE public.group_announcements ENABLE ROW LEVEL SECURITY;

-- Anyone can read announcements for public groups
DROP POLICY IF EXISTS "announcements_read_public" ON public.group_announcements;
CREATE POLICY "announcements_read_public"
  ON public.group_announcements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.groups g
      WHERE g.id = group_announcements.group_id
        AND g.is_public = true
        AND g.is_active = true
    )
  );

-- Members can read announcements for their own groups (private groups too)
DROP POLICY IF EXISTS "announcements_read_member" ON public.group_announcements;
CREATE POLICY "announcements_read_member"
  ON public.group_announcements FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = group_announcements.group_id
        AND gm.user_id = auth.uid()
    )
  );

-- Group admins can insert announcements
DROP POLICY IF EXISTS "announcements_insert_admin" ON public.group_announcements;
CREATE POLICY "announcements_insert_admin"
  ON public.group_announcements FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = group_announcements.group_id
        AND gm.user_id = auth.uid()
        AND gm.role IN ('admin', 'owner')
    )
  );

-- Authors can delete their own announcements; admins can delete any
DROP POLICY IF EXISTS "announcements_delete_admin" ON public.group_announcements;
CREATE POLICY "announcements_delete_admin"
  ON public.group_announcements FOR DELETE
  USING (
    auth.uid() IS NOT NULL AND (
      author_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.group_members gm
        WHERE gm.group_id = group_announcements.group_id
          AND gm.user_id = auth.uid()
          AND gm.role IN ('admin', 'owner')
      )
    )
  );

-- ── 1b. group_members: anon needs SELECT so RLS EXISTS checks work ───────────
-- The RLS policy on group_announcements (above) does an EXISTS on group_members.
-- Without this grant the sub-query fails with "permission denied" even though
-- RLS will filter down to zero rows for anonymous callers.
GRANT SELECT ON public.group_members TO anon;

-- ── 2. groups table ──────────────────────────────────────────────────────────
-- Authenticated users must be able to INSERT to create a group.
-- (SELECT is already granted — anon can browse public groups.)
GRANT INSERT, UPDATE ON public.groups TO authenticated;

-- Ensure RLS policies allow the INSERT
DROP POLICY IF EXISTS "groups_insert_authenticated" ON public.groups;
CREATE POLICY "groups_insert_authenticated"
  ON public.groups FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND owner_id = auth.uid());

-- Group owners/admins can update their group
DROP POLICY IF EXISTS "groups_update_owner" ON public.groups;
CREATE POLICY "groups_update_owner"
  ON public.groups FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = groups.id
        AND gm.user_id = auth.uid()
        AND gm.role IN ('admin', 'owner')
    )
  );

-- ── 3. group_members: add INSERT (needed for createGroup owner step) ─────────
-- UPDATE already granted by repair_android_community_api_grants.sql
GRANT INSERT, DELETE ON public.group_members TO authenticated;

-- Members can join (insert themselves)
DROP POLICY IF EXISTS "gm_insert_self" ON public.group_members;
CREATE POLICY "gm_insert_self"
  ON public.group_members FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Members can leave (delete themselves)
DROP POLICY IF EXISTS "gm_delete_self" ON public.group_members;
CREATE POLICY "gm_delete_self"
  ON public.group_members FOR DELETE
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Owners/admins can remove any member
DROP POLICY IF EXISTS "gm_delete_admin" ON public.group_members;
CREATE POLICY "gm_delete_admin"
  ON public.group_members FOR DELETE
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.group_members gm2
      WHERE gm2.group_id = group_members.group_id
        AND gm2.user_id = auth.uid()
        AND gm2.role IN ('admin', 'owner')
    )
  );

-- ── 4. group_invites read — anon needs SELECT to validate invite links ───────
GRANT SELECT, INSERT ON public.group_invites TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.group_invites TO authenticated;

ALTER TABLE public.group_invites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "invites_read_all" ON public.group_invites;
CREATE POLICY "invites_read_all"
  ON public.group_invites FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "invites_insert_admin" ON public.group_invites;
CREATE POLICY "invites_insert_admin"
  ON public.group_invites FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = group_invites.group_id
        AND gm.user_id = auth.uid()
        AND gm.role IN ('admin', 'owner')
    )
  );

DROP POLICY IF EXISTS "invites_delete_admin" ON public.group_invites;
CREATE POLICY "invites_delete_admin"
  ON public.group_invites FOR DELETE
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = group_invites.group_id
        AND gm.user_id = auth.uid()
        AND gm.role IN ('admin', 'owner')
    )
  );
