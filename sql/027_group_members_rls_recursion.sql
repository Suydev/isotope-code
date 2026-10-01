-- 027_group_members_rls_recursion.sql
--
-- Fixes: "infinite recursion detected in policy for relation group_members"
-- when the Community > Groups tab loads.
--
-- Root cause (ISSUE-064)
-- ---------------------
-- Three things combined into a policy/reference loop on public.group_members:
--
--   1. public._is_group_member(gid, uid) selects FROM group_members. On the
--      live project it was NOT SECURITY DEFINER, so selecting from it re-ran
--      group_members' own RLS policies. The repo's restore file has always
--      declared it SECURITY DEFINER; the live database had drifted from it.
--   2. Policy gm_read_members (SELECT) is ON group_members and its USING clause
--      is "group_id IN (SELECT gm2.group_id FROM group_members gm2 ...)".
--      A policy on a table that queries that same table is recursion by
--      definition.
--   3. Policy gm_delete_admin (DELETE) is also ON group_members and does
--      "EXISTS (SELECT 1 FROM group_members gm2 ...)" for the same reason.
--
-- The permanent fix is the standard Postgres answer: policies must never
-- reference their own table directly. Route every self-reference through a
-- SECURITY DEFINER helper owned by the table owner, which executes with RLS
-- bypassed, so the lookup terminates.
--
-- This is idempotent and safe to re-run.

BEGIN;

-- ── 1. Helpers. SECURITY DEFINER + a pinned search_path so they bypass RLS
--      without becoming a search-path hijack vector. ─────────────────────────
CREATE OR REPLACE FUNCTION public._is_group_member(gid uuid, uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $iso_fn$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_id = gid AND user_id = uid
  );
$iso_fn$;

-- Every group the caller belongs to. Used by gm_read_members so the policy does
-- not query group_members itself.
CREATE OR REPLACE FUNCTION public._my_group_ids(uid uuid)
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $iso_fn$
  SELECT gm.group_id
  FROM public.group_members gm
  WHERE gm.user_id = uid;
$iso_fn$;

-- Owner/admin check for a group, for gm_delete_admin. Same reason as above.
CREATE OR REPLACE FUNCTION public._is_group_admin(gid uuid, uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $iso_fn$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm.group_id = gid
      AND gm.user_id = uid
      AND gm.role IN ('owner', 'admin')
  );
$iso_fn$;

REVOKE ALL ON FUNCTION public._my_group_ids(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public._my_group_ids(uuid) TO authenticated;
REVOKE ALL ON FUNCTION public._is_group_admin(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public._is_group_admin(uuid, uuid) TO authenticated;

-- ── 2. Rewrite the two self-referencing policies to use the helpers. ────────
DROP POLICY IF EXISTS gm_read_members ON public.group_members;
CREATE POLICY gm_read_members ON public.group_members
  AS PERMISSIVE FOR SELECT
  USING (group_id IN (SELECT public._my_group_ids(auth.uid())));

DROP POLICY IF EXISTS gm_delete_admin ON public.group_members;
CREATE POLICY gm_delete_admin ON public.group_members
  AS PERMISSIVE FOR DELETE
  USING (
    auth.uid() IS NOT NULL
    AND public._is_group_admin(group_id, auth.uid())
  );

COMMIT;