-- ============================================================================
-- sql/030_guard_triggers_need_invoker.sql
-- Author: orchestrator, 2026-10-13
-- Companion to 028 (recursion) and 029 (column scope).
--
-- THE BUG
-- -------
-- _guard_group_member_escalation() is a BEFORE INSERT OR UPDATE trigger on
-- public.group_members. Its logic is correct and its own comment block
-- describes exactly the attacks it is meant to stop. But the function was
-- declared SECURITY DEFINER.
--
-- Inside a SECURITY DEFINER frame, current_user is the FUNCTION OWNER, not the
-- caller. Measured on live iso-clean:
--     current_user = postgres
--     session_user = postgres
-- So the guard's very first test --
--     IF current_user IN ('anon','authenticated') THEN
-- -- is never true for a client write, and every check inside it is skipped.
--
-- The trigger is ENABLED and fires, does its work, and enforces nothing. It is
-- inert by construction, not by configuration.
--
-- MEASURED, not inferred
-- ---------------------
-- With the trigger live and DEFINER, as role authenticated (a plain member):
--     INSERT  group_members(... role='member')   -> succeeds (public group)
--     UPDATE  group_members SET role='owner'    -> SUCCEEDED. Escalation.
-- The row then satisfies _is_group_admin, groups_update_owner and gm_delete_admin,
-- so a self-promoted member inherits owner-level control of the group.
--
-- With this file applied, the same four tests give:
--     public group join                    -> allowed   (028's job)
--     UPDATE role='owner' by a non-owner    -> 42501
--     UPDATE is_super_admin=true           -> 42501
--     member reads own row                 -> allowed   (no over-blocking)
--
-- WHY INVOKER IS CORRECT HERE
-- ---------------------------
-- A trigger receives no arguments, so it cannot carry the caller's identity the
-- way a policy helper can (_is_group_admin(gid, uid) takes uid as an ARGUMENT
-- and is therefore safe as DEFINER). The guard must instead SEE who is calling,
-- which requires it to run as the caller: SECURITY INVOKER.
--
-- current_user is 'authenticated' for a client write and 'postgres' for a
-- trusted SECURITY DEFINER RPC, so trusted server-side paths are unaffected:
-- they skip the guard entirely rather than being blocked by it.
--
-- Note this is the opposite trade-off from 028's three helpers, and both are
-- correct for the reason above. Do not "harmonise" them.
--
-- IDEMPOTENT: CREATE OR REPLACE throughout. Safe to re-run any number of times.
-- ============================================================================

BEGIN;

CREATE OR REPLACE FUNCTION public._guard_group_member_escalation()
RETURNS trigger
LANGUAGE plpgsql
VOLATILE
SECURITY INVOKER
SET search_path TO ''
AS $iso_fn$
 BEGIN
  IF current_user IN ('anon', 'authenticated') THEN
    IF TG_OP = 'INSERT' THEN
      IF NEW."role" IS NULL
         OR NEW."role" NOT IN ('member', 'moderator', 'admin', 'owner') THEN
        RAISE EXCEPTION 'group_members.role "%" is not a valid role', NEW."role"
          USING ERRCODE = '42501';
      END IF;
      IF NEW."role" IN ('owner', 'admin')
         AND NOT EXISTS (
               SELECT 1
               FROM public.groups g
               WHERE g.id = NEW.group_id
                 AND g.owner_id = (SELECT auth.uid())
                 AND g.deleted_at IS NULL
             ) THEN
        RAISE EXCEPTION 'group_members.role may not be self-claimed as "%"; only the group owner may grant an authoritative role', NEW."role"
          USING ERRCODE = '42501';
      END IF;
      IF NEW.is_super_admin THEN
        RAISE EXCEPTION 'group_members.is_super_admin is not writable directly; use a SECURITY DEFINER admin RPC'
          USING ERRCODE = '42501';
      END IF;
    ELSIF TG_OP = 'UPDATE' THEN
      IF NEW.role IS DISTINCT FROM OLD.role
         AND NOT EXISTS (
               SELECT 1
               FROM public.groups g
               WHERE g.id = NEW.group_id
                 AND g.owner_id = (SELECT auth.uid())
                 AND g.deleted_at IS NULL
             ) THEN
        RAISE EXCEPTION 'group_members.role may not be changed to "%" without being the group owner', NEW.role
          USING ERRCODE = '42501';
      END IF;
      IF NEW.is_super_admin IS DISTINCT FROM OLD.is_super_admin THEN
        RAISE EXCEPTION 'group_members.is_super_admin is not writable directly; use a SECURITY DEFINER admin RPC'
          USING ERRCODE = '42501';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
 END;
$iso_fn$;

-- The trigger itself already exists and is enabled (trg_guard_group_member_escalation,
-- BEFORE INSERT OR UPDATE ... FOR EACH ROW). CREATE OR REPLACE above preserves it,
-- so it does not need to be recreated. Re-created defensively only if absent.

COMMIT;