-- 013c: Consolidate and harden RLS policies.
--
-- Fixes found during comprehensive audit of live DB state after 013 + 013b:
--
--  CRITICAL:
--  1. anon has INSERT on group_invites (leftover from 013; 013b only revoked SELECT)
--  2. gm_client_insert_compat — CHECK: (user_id = auth.uid()) only; any authenticated
--     user could insert into ANY group with ANY role (privilege escalation)
--  3. gm_admin_update — USING: (user_id=auth.uid() OR _is_group_member(...)); any
--     group member could UPDATE any other member's row, including changing their role
--
--  HIGH:
--  4. Duplicate INSERT policy on groups (groups_insert_authenticated from 013 + existing
--     groups_insert_own do identical things; drop the redundant one)
--  5. Duplicate stacked policies on group_announcements (9 total; 5 pre-existing + 4 from
--     013 that overlap): drop our additions that are already covered by pre-existing policies
--  6. Duplicate stacked policies on group_invites (9 total; same issue)
--  7. group_challenges anon read (gchall_read uses is_active=true which exposes
--     private-group challenges to anon when active; scope to public groups only)
--
-- ── 1. Revoke leftover anon INSERT on group_invites ───────────────────────────
REVOKE INSERT ON public.group_invites FROM anon;

-- ── 2. Drop gm_client_insert_compat (privilege escalation) ───────────────────
-- Replaced by the three targeted INSERT policies added in 013b:
--   gm_join_public_group, gm_join_via_invite, gm_insert_owner_self
-- The _auto_add_group_owner SECURITY DEFINER trigger handles owner row insertion
-- automatically on groups INSERT, so the function-based path is also covered.
DROP POLICY IF EXISTS "gm_client_insert_compat" ON public.group_members;

-- ── 3. Replace gm_admin_update (privilege escalation) ────────────────────────
-- Old policy let ANY group member UPDATE any other member's row (incl. role).
-- New: members may only update their OWN row (e.g. presence fields).
-- Role changes must go through the update_group_member_role() SECURITY DEFINER RPC.
DROP POLICY IF EXISTS "gm_admin_update" ON public.group_members;

CREATE POLICY "gm_update_own_row"
  ON public.group_members FOR UPDATE
  USING  (auth.uid() IS NOT NULL AND user_id = auth.uid())
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- ── 4. Drop redundant groups INSERT policy from 013 ──────────────────────────
-- groups_insert_own (pre-existing, role-bound to authenticated) already covers this.
DROP POLICY IF EXISTS "groups_insert_authenticated" ON public.groups;

-- ── 5. Drop duplicate group_announcements policies added in 013 ──────────────
-- Pre-existing policies already handle these cases:
--   announcements_read_member  → covered by group_announcements_read_members (private.is_group_member)
--   announcements_insert_admin → covered by group_announcements_insert_managers
--   announcements_delete_admin → covered by group_announcements_delete_managers
-- Keep announcements_read_public (adds anon/public read for public groups — was missing before).
DROP POLICY IF EXISTS "announcements_read_member"  ON public.group_announcements;
DROP POLICY IF EXISTS "announcements_insert_admin" ON public.group_announcements;
DROP POLICY IF EXISTS "announcements_delete_admin" ON public.group_announcements;

-- ── 6. Drop duplicate group_invites policies added in 013 ────────────────────
-- Pre-existing policies (ginv_read, ginv_create, ginv_delete +
-- group_invites_read/insert/delete_managers) already handle auth'd access.
-- Our 013b invites_read_own_group is also a duplicate of ginv_read.
-- Keep nothing from 013/013b that duplicates pre-existing policy.
DROP POLICY IF EXISTS "invites_read_own_group"  ON public.group_invites;
DROP POLICY IF EXISTS "invites_insert_admin"    ON public.group_invites;
DROP POLICY IF EXISTS "invites_delete_admin"    ON public.group_invites;

-- ── 7. Fix group_challenges anon read ────────────────────────────────────────
-- gchall_read: USING (is_active = true OR _is_group_member(...))
-- Problem: is_active=true alone exposes challenges from private groups to anon.
-- Fix: also require the group to be public when the caller is not a member.
DROP POLICY IF EXISTS "gchall_read" ON public.group_challenges;

CREATE POLICY "gchall_read_public_or_member"
  ON public.group_challenges FOR SELECT
  USING (
    -- Public group challenge (visible to anyone)
    (
      is_active = true
      AND EXISTS (
        SELECT 1 FROM public.groups g
        WHERE g.id = group_challenges.group_id
          AND g.is_public = true
          AND g.is_active = true
      )
    )
    OR
    -- Member of the group (can see all challenges, including inactive)
    _is_group_member(group_id, (SELECT auth.uid()))
  );

-- ── Verification summary (run as sanity check) ───────────────────────────────
-- Expected final policy counts after this migration:
--   group_announcements  : 6  (4 pre-existing auth'd + gann_read + announcements_read_public)
--   group_invites        : 6  (ginv_* x3 + group_invites_*_managers x3)
--   group_members        : 8  (pre-existing SELECT/DELETE/UPDATE policies + our 013b INSERT policies)
--   groups               : 6  (read_public, read_authenticated, insert_own, update_own,
--                               update_owner, delete_own)
--   group_challenges     : 5  (4 pre-existing auth'd + new gchall_read_public_or_member)
