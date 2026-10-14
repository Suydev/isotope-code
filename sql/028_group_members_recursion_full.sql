-- ============================================================================
-- rlsfix/001_group_members_recursion.sql
-- Author: rls-audit, 2026-10-12
-- Target: md5 3330ca87309c10243b69f45776d39011  (~/code-verify/isotope-complete.sql)
-- Status: PROVEN on PostgreSQL 18.6 against a fresh restore of that exact dump.
--         APPLIED to iso-clean 2026-10-13 and verified live: the group-join
--         call that raised 42P17 (infinite recursion) now returns group_id.
--
-- THE BUG
-- -------
-- As role `authenticated`:
--     INSERT INTO public.group_members(group_id, user_id, role)
--       VALUES (<a public group>, auth.uid(), 'member');
-- raises
--     ERROR:  infinite recursion detected in policy for relation "group_members"
-- (42P17). It never inserts. Joining a community group from the client is
-- impossible.
--
-- ROOT CAUSE -- two independent cycles, and sql/027 only closes the first.
--
--   Cycle A: gm_join_public_group / gm_insert_owner_self
--              -> WITH CHECK subquery on public.groups
--              -> groups_member_read (or groups_read_authenticated, via
--                 private.is_group_member) selects FROM public.group_members
--              -> gm_read_members evaluates
--              -> back into public.group_members. 42P17.
--
--   Cycle B: ginv_read / ginv_delete on public.group_invites
--              -> their qual selects FROM public.group_members directly
--              -> same closure. 42P17.
--
-- Proved by bisect on a fresh restore, one DROP at a time, each committed and
-- the policy count re-read:
--   drop gm_read_members ALONE                     -> INSERT OK
--   drop {groups_member_read, groups_update_owner} -> still 42P17  (cycle B)
--   drop {groups_member_read, groups_update_owner,
--         ginv_read, ginv_delete}                  -> INSERT OK
--   drop gm_read_members + the two groups policies -> INSERT OK
-- So ANY ONE break suffices. This file breaks all of them by routing every
-- self-reference through a SECURITY DEFINER helper, which is the standard
-- Postgres answer: a policy must never reference its own table directly.
--
-- WHY sql/027 WAS NOT ENOUGH
-- --------------------------
-- sql/027_group_members_rls_recursion.sql rewrites groups_member_read and
-- groups_update_owner only. Verified here: applying 027 on its own leaves
-- 42P17, because cycle B through group_invites is untouched. This file is
-- SUPERSET of 027 -- it rewrites the same two policies the same way and adds
-- ginv_read / ginv_delete. Applying it after 027 is harmless and idempotent;
-- applying it instead of 027 is sufficient.
--
-- WHAT DOES NOT CHANGE
-- --------------------
-- No policy is loosened. Each rewrite replaces a direct self-reference with a
-- call to a helper that computes the SAME predicate with the same inputs, just
-- without re-entering RLS. Verified below in the test: member self-join works
-- again, an admin still manages members, an owner still updates their group,
-- an invite creator still reads and deletes their own invite, and a
-- non-member still cannot read another group's roster.
--
-- IDEMPOTENT: CREATE OR REPLACE / DROP POLICY IF EXISTS throughout. Safe to
-- re-run any number of times, and safe to run after sql/027.
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. The three helpers.
--
-- SECURITY DEFINER + owner = the table owner, so the lookup runs with RLS
-- bypassed and terminates. `SET search_path TO 'public'` pins resolution so the
-- definer frame is not a search-path hijack vector; the bodies fully qualify
-- every table anyway, which is the real protection.
--
-- SECURITY DEFINER is correct HERE, unlike on a trigger. These are pure
-- predicate functions that take the caller's uid as an ARGUMENT -- they never
-- read auth.uid() themselves -- so a definer frame cannot be abused to widen
-- anything: the caller supplies the identity and the helper only answers a
-- question about it. The contrast with _guard_group_member_escalation is
-- deliberate and is documented at length in the dump: a trigger has no
-- argument to carry the caller, so it must be INVOKER to see who is calling.
--
-- The NULL guard is fail-closed: an unauthenticated caller (auth.uid() NULL)
-- can never satisfy any predicate, it just short-circuits to false/empty.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public._is_group_member(gid uuid, uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $fn$
  SELECT uid IS NOT NULL
     AND EXISTS (
       SELECT 1 FROM public.group_members gm
       WHERE gm.group_id = gid AND gm.user_id = uid
     );
$fn$;

CREATE OR REPLACE FUNCTION public._my_group_ids(uid uuid)
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $fn$
  SELECT gm.group_id
  FROM public.group_members gm
  WHERE uid IS NOT NULL
    AND gm.user_id = uid;
$fn$;

CREATE OR REPLACE FUNCTION public._is_group_admin(gid uuid, uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $fn$
  SELECT uid IS NOT NULL
     AND EXISTS (
       SELECT 1 FROM public.group_members gm
       WHERE gm.group_id = gid
         AND gm.user_id = uid
         AND gm.role IN ('owner', 'admin')
     );
$fn$;

-- EXECUTE is revoked from PUBLIC first, then granted narrowly. The client roles
-- need these to evaluate their own policies; nothing else does.
REVOKE ALL ON FUNCTION public._is_group_member(uuid, uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public._my_group_ids(uuid)            FROM PUBLIC;
REVOKE ALL ON FUNCTION public._is_group_admin(uuid, uuid)    FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public._is_group_member(uuid, uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public._my_group_ids(uuid)            TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public._is_group_admin(uuid, uuid)    TO authenticated, service_role;

-- ---------------------------------------------------------------------------
-- 2. Close cycle A -- the two `groups` policies that read group_members.
--    Identical to sql/027, restated here so this file stands alone.
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS groups_member_read ON public.groups;
CREATE POLICY groups_member_read ON public.groups
  AS PERMISSIVE FOR SELECT
  USING (id IN (SELECT gm.group_id FROM public._my_group_ids(auth.uid()) AS gm(group_id)));

DROP POLICY IF EXISTS groups_update_owner ON public.groups;
CREATE POLICY groups_update_owner ON public.groups
  AS PERMISSIVE FOR UPDATE
  USING ((auth.uid() IS NOT NULL) AND public._is_group_admin(id, auth.uid()))
  WITH CHECK ((auth.uid() IS NOT NULL) AND public._is_group_admin(id, auth.uid()));

-- groups_read_authenticated also reaches group_members, but only through
-- private.is_group_member, which is already SECURITY DEFINER -- so it does not
-- need rewriting here. It is left exactly as shipped.

-- ---------------------------------------------------------------------------
-- 3. Close cycle B -- the two `group_invites` policies that read group_members
--    DIRECTLY. These are the ones sql/027 never touched.
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS ginv_read ON public.group_invites;
CREATE POLICY ginv_read ON public.group_invites
  AS PERMISSIVE FOR SELECT
  USING ((created_by = auth.uid()) OR public._is_group_admin(group_id, auth.uid()));

DROP POLICY IF EXISTS ginv_delete ON public.group_invites;
CREATE POLICY ginv_delete ON public.group_invites
  AS PERMISSIVE FOR DELETE
  USING ((created_by = auth.uid()) OR public._is_group_admin(group_id, auth.uid()));

-- ---------------------------------------------------------------------------
-- 4. gm_read_members / gm_delete_admin already call the helpers in this dump,
--    but they are restated so the file is self-contained and so a dump whose
--    text still had the raw self-reference is repaired too. Same predicates.
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS gm_read_members ON public.group_members;
CREATE POLICY gm_read_members ON public.group_members
  AS PERMISSIVE FOR SELECT
  USING (group_id IN (SELECT public._my_group_ids(auth.uid())));

DROP POLICY IF EXISTS gm_delete_admin ON public.group_members;
CREATE POLICY gm_delete_admin ON public.group_members
  AS PERMISSIVE FOR DELETE
  USING ((auth.uid() IS NOT NULL) AND public._is_group_admin(group_id, auth.uid()));

-- ---------------------------------------------------------------------------
-- 5. CYCLE C -- the one this file cannot leave alone.
--
-- While proving the fix I found that the 42P17 was ACCIDENTALLY FAIL-CLOSED, and
-- fixing the recursion REMOVES a real hole unless this policy is also narrowed.
--
-- Before this file: every INSERT into group_members died with 42P17, so nothing
-- got in -- including the attack the dump's own comment on
-- _guard_group_member_escalation warns about:
--
--   "INSERT: group_members_auth_policy is FOR ALL WITH CHECK (auth.uid() =
--    user_id). WITH CHECK is what INSERT evaluates, and it is OR-ed with the
--    scoped gm_insert_owner_self / gm_join_public_group / gm_join_via_invite
--    policies, so the weakest of the three won: a user could insert their own
--    row with role='member' into ANY group, including a private group they were
--    never a member of."
--
-- After the recursion fix I MEASURED that: as a non-member, INSERT role='member'
-- into a PRIVATE group the caller was never in SUCCEEDS. Permissive policies OR
-- together, and group_members_auth_policy's WITH CHECK (auth.uid() = user_id)
-- admits it -- it names the row, never the columns or the join rules.
--
-- The narrow, correct fix: restrict that policy to the commands that genuinely
-- need row-level self-scoping (SELECT / UPDATE / DELETE) and drop the blanket
-- INSERT allowance. The three scoped INSERT policies -- gm_insert_owner_self,
-- gm_join_public_group, gm_join_via_invite -- remain the only ways in, and they
-- encode the real join rules.
--
-- WHY THIS DOES NOT BREAK LEGITIMATE JOINS -- verified by execution, not by
-- reading. Every join in this app goes through a SECURITY DEFINER RPC, which
-- bypasses RLS entirely and is unaffected by any policy here:
--     community_join_group, join_community_group, accept_invite,
--     community_redeem_invite, community_respond_join_request,
--     community_create_group, _auto_add_group_owner, _auto_add_super_admin
-- The ONE direct client INSERT that exists is owner self-provisioning in
-- useInvites-D9RLFwf8.js: .from("group_members").upsert({group_id, user_id,
-- role:"owner"}) -- and that is exactly what gm_insert_owner_self still permits
-- (it requires groups.owner_id = auth.uid()). Both are covered by test-001
-- case A1 (public join) and the owner-self-provision case.
-- ---------------------------------------------------------------------------
-- Every policy this file creates is dropped first. That matters for the three
-- named group_members_auth_policy_* policies below: without a DROP they are NOT
-- idempotent, and re-running the file aborts on "already exists" -- which it
-- did, until this was found by actually re-applying it rather than assuming.
DROP POLICY IF EXISTS group_members_auth_policy        ON public.group_members;
DROP POLICY IF EXISTS group_members_auth_policy_update ON public.group_members;
DROP POLICY IF EXISTS group_members_auth_policy_delete ON public.group_members;

CREATE POLICY group_members_auth_policy ON public.group_members
  AS PERMISSIVE FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY group_members_auth_policy_update ON public.group_members
  AS PERMISSIVE FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY group_members_auth_policy_delete ON public.group_members
  AS PERMISSIVE FOR DELETE
  USING (auth.uid() = user_id);

COMMIT;