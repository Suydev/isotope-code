-- ============================================================================
-- rlsfix/002_column_scope_hardening.sql
-- Author: rls-audit, 2026-10-12
-- Target: md5 3330ca87309c10243b69f45776d39011  (~/code-verify/isotope-complete.sql)
-- Status: PROVEN on PostgreSQL 18.6 against a fresh restore of that exact dump.
--         APPLIED to iso-clean 2026-10-14 and verified live: coins, gems,
--         plan_type, billing_status and access_ends_at are now rejected on
--         client write; the 10 legitimate columns remain writable.
--
-- WHAT THIS FIXES (each proved by a failing-without / passing-with test):
--   C1  public.users      -- client can set coins/gems/plan_type/billing_status
--                              on its OWN row. users_own is FOR ALL
--                              USING (id = auth.uid()) WITH CHECK (id = auth.uid());
--                              that names the ROW, not the COLUMNS.
--   C2  public.user_points -- client can set lifetime_points on its OWN row.
--                              points_own_write is FOR ALL USING (user_id =
--                              auth.uid()) WITH CHECK (user_id = auth.uid()).
--
-- WHY COLUMN GRANTS AND NOT MORE POLICIES:
--   RLS has no per-column concept, and all of these policies are PERMISSIVE,
--   so they OR together -- adding a stricter policy can only ever WIDEN the
--   set. A column grant is a separate layer that RLS cannot widen, so it is
--   the only tool that can narrow this.
--
-- IDEMPOTENT: every statement is DROP ... IF EXISTS / REVOKE-then-GRANT, so
-- the whole file can be re-run any number of times with the same result.
--
-- RETRACTION IS WHAT MATTERS: REVOKE is immediately effective. If this file
-- turns out to break a legitimate path, re-running the GRANT block restores
-- it; nothing needs to be undone in the dump.
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- C1 -- public.users : reserve the server-owned economy / entitlement columns
--
-- Legitimate client writes that MUST keep working (each is exercised by
-- tests/002_column_scope_hardening.sh and re-verified against the shipped
-- client bundle useAuthStore-Aw1au7RF.js):
--   * upsert  {id, email, name, device_id, updated_at}   -- ensureUserRecord
--   * update  buildPublicUserUpdates(...)                 -- public profile sync
--            (name, avatar_url and the sync bookkeeping columns only)
--   * select  every column                                 -- unchanged
--   * insert  own row                                       -- unchanged
-- Everything the client may touch is in the list below; coins, gems,
-- plan_type, billing_status, plan_expires_at, access_ends_at and access_source
-- are deliberately NOT in it.
-- ---------------------------------------------------------------------------

-- R1. REVOKE ALL FIRST. A column-level GRANT cannot subtract from a table-level
--     GRANT, so the table-level UPDATE must go before the per-column grants
--     can mean anything. (Same ordering constraint as
--     sql/027 and the group_members column-grant note in the dump.)
REVOKE ALL ON public.users FROM anon, authenticated;

GRANT SELECT                         ON public.users TO anon, authenticated;
GRANT INSERT                         ON public.users TO anon, authenticated;

-- The columns the client is actually allowed to write back.
GRANT UPDATE (id)                    ON public.users TO anon, authenticated;
GRANT UPDATE (email)                 ON public.users TO anon, authenticated;
GRANT UPDATE (name)                  ON public.users TO anon, authenticated;
GRANT UPDATE (avatar_url)            ON public.users TO anon, authenticated;
GRANT UPDATE (username)              ON public.users TO anon, authenticated;
GRANT UPDATE (device_id)             ON public.users TO anon, authenticated;
GRANT UPDATE (version)               ON public.users TO anon, authenticated;
GRANT UPDATE (content_hash)          ON public.users TO anon, authenticated;
GRANT UPDATE (last_synced_at)        ON public.users TO anon, authenticated;
GRANT UPDATE (updated_at)            ON public.users TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- C2 -- public.user_points : reserve lifetime_points
--
-- `points` is deliberately LEFT WRITABLE. It has to be: the shipped store
-- flow in FocusStore-D5cRXSIr.js does
--     .from("user_points").upsert({user_id, points: o - price, updated_at })
-- after computing the new balance client-side. Revoking UPDATE on `points`
-- would break every store purchase. See the RESIDUAL RISK note below.
--
-- `lifetime_points` is the all-time total that drives leaderboards, and no
-- shipped client code writes it -- so it can be reserved with no regression.
-- ---------------------------------------------------------------------------
REVOKE ALL ON public.user_points FROM anon, authenticated;

GRANT SELECT                         ON public.user_points TO anon, authenticated;
GRANT INSERT                         ON public.user_points TO anon, authenticated;
GRANT UPDATE (user_id)               ON public.user_points TO anon, authenticated;
GRANT UPDATE (points)                ON public.user_points TO anon, authenticated;
GRANT UPDATE (updated_at)            ON public.user_points TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- C3 -- belt-and-braces: a trigger, so a future GRANT widening cannot silently
--      reopen the hole. SECURITY INVOKER on purpose: it must be able to see
--      the REAL caller, exactly as _guard_group_member_escalation does. As a
--      SECURITY DEFINER trigger this would be inert for the same reason that
--      one was (see the long comment on _guard_group_member_escalation in the
--      dump). current_user is 'authenticated' for a client write and 'postgres'
--      for a SECURITY DEFINER RPC, which is precisely the trusted set.
--
--      The column grants above are the primary control; this is the second
--      layer that survives a careless future GRANT.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public._guard_user_economy_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path TO ''
AS $fn$
BEGIN
  -- current_user is the table owner ('postgres') for every server-side write
  -- (handle_new_user, SECURITY DEFINER RPCs) and 'anon'/'authenticated' for a
  -- direct client statement. Only the client path is checked.
  IF current_user IN ('anon', 'authenticated') THEN

    IF TG_OP = 'INSERT' THEN
      IF NEW.coins IS DISTINCT FROM 0
         OR NEW.gems IS DISTINCT FROM 0 THEN
        RAISE EXCEPTION 'users.coins/gems are server-managed; they cannot be set on insert'
          USING ERRCODE = '42501';
      END IF;

    ELSIF TG_OP = 'UPDATE' THEN
      IF NEW.coins IS DISTINCT FROM OLD.coins THEN
        RAISE EXCEPTION 'users.coins is server-managed and not writable by the client'
          USING ERRCODE = '42501';
      END IF;

      IF NEW.gems IS DISTINCT FROM OLD.gems THEN
        RAISE EXCEPTION 'users.gems is server-managed and not writable by the client'
          USING ERRCODE = '42501';
      END IF;

      -- is_premium_user() is SELECT true BY DESIGN (self-hosted; handle_new_user
      -- provisions every user ranker with a 2099 expiry) -- that function is
      -- NOT being touched. But the underlying columns are still the app's
      -- source of truth for anything that reads them directly, so the client
      -- must not be able to move them.
      IF NEW.plan_type        IS DISTINCT FROM OLD.plan_type
         OR NEW.billing_status IS DISTINCT FROM OLD.billing_status
         OR NEW.plan_expires_at IS DISTINCT FROM OLD.plan_expires_at
         OR NEW.access_ends_at  IS DISTINCT FROM OLD.access_ends_at THEN
        RAISE EXCEPTION 'users plan/billing columns are server-managed and not writable by the client'
          USING ERRCODE = '42501';
      END IF;

      -- id is the identity column. Changing it would move the row to another
      -- tenant and re-point every FK that hangs off it.
      IF NEW.id IS DISTINCT FROM OLD.id THEN
        RAISE EXCEPTION 'users.id is not writable'
          USING ERRCODE = '42501';
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$fn$;

DROP TRIGGER IF EXISTS trg_guard_user_economy_columns ON public.users;
CREATE TRIGGER trg_guard_user_economy_columns
  BEFORE INSERT OR UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public._guard_user_economy_columns();

REVOKE ALL ON FUNCTION public._guard_user_economy_columns() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public._guard_user_economy_columns() TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- C4 -- public.user_points : the same second layer for lifetime_points.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public._guard_user_points_lifetime()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path TO ''
AS $fn$
BEGIN
  IF current_user IN ('anon', 'authenticated') THEN
    -- `points` is intentionally NOT checked: the store flow writes it.
    -- lifetime_points is the leaderboard total and no client code writes it.
    IF NEW.lifetime_points IS DISTINCT FROM OLD.lifetime_points THEN
      RAISE EXCEPTION 'user_points.lifetime_points is server-managed and not writable by the client'
        USING ERRCODE = '42501';
    END IF;

    IF NEW.user_id IS DISTINCT FROM OLD.user_id THEN
      RAISE EXCEPTION 'user_points.user_id is not writable'
        USING ERRCODE = '42501';
    END IF;
  END IF;

  RETURN NEW;
END;
$fn$;

DROP TRIGGER IF EXISTS trg_guard_user_points_lifetime ON public.user_points;
CREATE TRIGGER trg_guard_user_points_lifetime
  BEFORE UPDATE ON public.user_points
  FOR EACH ROW EXECUTE FUNCTION public._guard_user_points_lifetime();

REVOKE ALL ON FUNCTION public._guard_user_points_lifetime() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public._guard_user_points_lifetime() TO anon, authenticated;

COMMIT;