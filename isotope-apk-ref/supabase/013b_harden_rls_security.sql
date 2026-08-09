-- 013b: Harden RLS policies introduced in 013.
--
-- Fixes three security issues flagged in review:
--  1. gm_insert_self allowed any authenticated user to join ANY group (incl.
--     private) with any role.  Replaced with least-privilege: role must be
--     'member' and either the group is public OR a valid (non-expired) invite
--     exists for that group.  Owner-row insert is handled by a separate policy.
--  2. invites_read_all USING (true) exposed all invite tokens to anon.
--     Replaced with a SECURITY DEFINER RPC so the bundle can validate a single
--     code without leaking the full table.
--  3. ENABLE ROW LEVEL SECURITY was missing for groups and group_members.
--     Added here to make RLS deterministic regardless of DB migration order.

-- ── Ensure RLS is active ──────────────────────────────────────────────────────
ALTER TABLE public.groups        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_invites ENABLE ROW LEVEL SECURITY;

-- ── 1. group_members: replace over-broad self-insert ────────────────────────

DROP POLICY IF EXISTS "gm_insert_self" ON public.group_members;

-- Members can join a PUBLIC group as 'member' only
CREATE POLICY "gm_join_public_group"
  ON public.group_members FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
    AND role   = 'member'
    AND EXISTS (
      SELECT 1 FROM public.groups g
      WHERE g.id       = group_members.group_id
        AND g.is_public = true
        AND g.is_active = true
    )
  );

-- Members can join a PRIVATE group via a valid (non-expired, not over-used) invite
CREATE POLICY "gm_join_via_invite"
  ON public.group_members FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
    AND role   = 'member'
    AND EXISTS (
      SELECT 1 FROM public.group_invites gi
      WHERE gi.group_id  = group_members.group_id
        AND (gi.expires_at IS NULL OR gi.expires_at > now())
        AND (gi.max_uses   IS NULL OR gi.uses_count < gi.max_uses)
    )
  );

-- Owners can add themselves as 'owner' only for a group they just created
-- (createGroup mutation inserts the group then immediately inserts the owner row)
CREATE POLICY "gm_insert_owner_self"
  ON public.group_members FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
    AND role    = 'owner'
    AND EXISTS (
      SELECT 1 FROM public.groups g
      WHERE g.id       = group_members.group_id
        AND g.owner_id = auth.uid()
    )
  );

-- ── 2. group_invites: replace read-all with targeted RPC ───────────────────

-- Remove the overly broad anon SELECT grant and replace with a
-- SECURITY DEFINER function so the bundle can look up ONE invite by token
-- without being able to enumerate the full table.

-- Revoke the blanket SELECT we gave anon in 013
REVOKE SELECT ON public.group_invites FROM anon;

-- Authenticated users (group admins) can still read their own group's invites
DROP POLICY IF EXISTS "invites_read_all" ON public.group_invites;

CREATE POLICY "invites_read_own_group"
  ON public.group_invites FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = group_invites.group_id
        AND gm.user_id  = auth.uid()
        AND gm.role IN ('admin', 'owner')
    )
  );

-- SECURITY DEFINER function — allows the bundle to validate a single invite
-- token without exposing any other rows to anon callers.
CREATE OR REPLACE FUNCTION public.get_invite_details(p_code text)
RETURNS TABLE (
  id          uuid,
  group_id    uuid,
  uses_count  int,
  max_uses    int,
  expires_at  timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, group_id, uses_count, max_uses, expires_at
  FROM   public.group_invites
  WHERE  (token = p_code OR invite_code = p_code)
    AND  (expires_at IS NULL OR expires_at > now())
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_invite_details(text) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.get_invite_details(text) TO anon, authenticated;

-- Accept-invite: increment uses_count and add calling user as member.
-- Kept as SECURITY DEFINER to bypass RLS on the join step when coming
-- from a validated invite, but role is hard-coded to 'member'.
CREATE OR REPLACE FUNCTION public.accept_invite(p_code text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invite public.group_invites%ROWTYPE;
  v_uid    uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RETURN json_build_object('error', 'not_authenticated');
  END IF;

  -- Fetch and lock the invite row
  SELECT * INTO v_invite
  FROM   public.group_invites
  WHERE  (token = p_code OR invite_code = p_code)
    AND  (expires_at IS NULL OR expires_at > now())
    AND  (max_uses   IS NULL OR uses_count < max_uses)
  FOR UPDATE SKIP LOCKED;

  IF NOT FOUND THEN
    RETURN json_build_object('error', 'invalid_or_expired_invite');
  END IF;

  -- Idempotent: skip if already a member
  IF EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_id = v_invite.group_id AND user_id = v_uid
  ) THEN
    RETURN json_build_object('group_id', v_invite.group_id, 'already_member', true);
  END IF;

  -- Add user as member
  INSERT INTO public.group_members (group_id, user_id, role)
  VALUES (v_invite.group_id, v_uid, 'member');

  -- Increment usage counter
  UPDATE public.group_invites
  SET    uses_count = uses_count + 1
  WHERE  id = v_invite.id;

  RETURN json_build_object('group_id', v_invite.group_id, 'joined', true);
END;
$$;

REVOKE ALL ON FUNCTION public.accept_invite(text) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.accept_invite(text) TO authenticated;
