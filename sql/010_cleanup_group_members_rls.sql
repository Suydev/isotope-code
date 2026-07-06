-- 010_cleanup_group_members_rls.sql
-- Cleans up legacy group_members RLS policies and recreates the correct
-- minimal set.  Safe to run multiple times (idempotent).
--
-- Expected final state (3 policies only):
--   gm_read_members         SELECT
--   gm_client_insert_compat INSERT
--   gm_self_delete          DELETE
-- No UPDATE policy — updates must go through RPCs.

BEGIN;

-- ── Drop legacy / duplicate policies ────────────────────────────────────────

DROP POLICY IF EXISTS group_members_insert_self            ON public.group_members;
DROP POLICY IF EXISTS group_members_update_managed         ON public.group_members;
DROP POLICY IF EXISTS group_members_delete_self_or_managed ON public.group_members;
DROP POLICY IF EXISTS group_members_read_members           ON public.group_members;

-- gm_* duplicates (will be re-created below with correct definitions)
DROP POLICY IF EXISTS gm_read_members          ON public.group_members;
DROP POLICY IF EXISTS gm_client_insert_compat  ON public.group_members;
DROP POLICY IF EXISTS gm_self_delete           ON public.group_members;
DROP POLICY IF EXISTS gm_update_managed        ON public.group_members;

-- ── Recreate the correct minimal set ────────────────────────────────────────

-- SELECT: any authenticated user can read membership rows for groups they belong to
CREATE POLICY gm_read_members ON public.group_members
  FOR SELECT TO authenticated
  USING (
    group_id IN (
      SELECT gm2.group_id
      FROM   public.group_members gm2
      WHERE  gm2.user_id = auth.uid()
    )
  );

-- INSERT: allow authenticated user to insert their own membership row only
-- (used by owner after group creation, and by direct join for public groups)
CREATE POLICY gm_client_insert_compat ON public.group_members
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- DELETE: allow a user to remove only their own membership row (leave group)
CREATE POLICY gm_self_delete ON public.group_members
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- ── Fix any member_count drift left from the emergency hotfix ───────────────

UPDATE public.groups g
SET    member_count = (
         SELECT COUNT(*)
         FROM   public.group_members gm
         WHERE  gm.group_id = g.id
       );

-- ── Verify result ────────────────────────────────────────────────────────────

SELECT
  policyname,
  cmd,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'group_members'
ORDER BY policyname;

COMMIT;
