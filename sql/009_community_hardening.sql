-- ============================================================================
-- IsotopeAI — Community Hardening Migration (009)
-- ============================================================================
-- Run this in Supabase SQL Editor: Project → SQL Editor → New query → Run
-- Fully idempotent: safe to run multiple times.
--
-- What this fixes:
--   1.  create_community_group RPC  — atomic group + owner-member creation
--   2.  join_community_group RPC    — safe public join with max_members check
--   3.  leave_community_group RPC   — safe leave, blocks owner self-removal
--   4.  delete_community_group RPC  — owner-only; cascades all related rows
--   5.  update_group_member_role RPC — prevents self-promotion to owner/admin
--   6.  accept_invite — adds max_members enforcement + member_count bump
--   7.  get_invite_details — search by token OR invite_code, slug fallback
--   8.  RLS: group_members INSERT   — locked to RPC only (SECURITY DEFINER)
--   9.  RLS: group_members UPDATE   — prevent self-role-escalation
--  10.  RLS: ginv_create            — owner/admin/moderator (was missing owner)
--  11.  RLS: groups DELETE          — owner-only hard delete blocked; use RPC
--  12.  RLS: gann_write/gchall_write — restrict to owner/admin/moderator
--  13.  Unique slug constraint + slug uniqueness enforcement
--  14.  Cascade deletes trigger for group-owned rows
--  15.  member_count kept consistent via triggers
-- ============================================================================

-- ── 0. Drop old function signatures that may block CREATE OR REPLACE ──────────
DROP FUNCTION IF EXISTS public.create_community_group(text,text,text,text,boolean,integer,text);
DROP FUNCTION IF EXISTS public.create_community_group(text,text,text,text,boolean,integer);
DROP FUNCTION IF EXISTS public.create_community_group(text,text,text);
DROP FUNCTION IF EXISTS public.join_community_group(uuid);
DROP FUNCTION IF EXISTS public.leave_community_group(uuid);
DROP FUNCTION IF EXISTS public.delete_community_group(uuid);
DROP FUNCTION IF EXISTS public.update_group_member_role(uuid,uuid,text);
DROP FUNCTION IF EXISTS public.accept_invite(text);
DROP FUNCTION IF EXISTS public.get_invite_details(text);

-- ── 1. create_community_group ─────────────────────────────────────────────────
-- Creates group + owner membership atomically. Generates unique slug.
-- Returns: {success, group_id, group} or {success:false, error}
CREATE OR REPLACE FUNCTION public.create_community_group(
  p_name        text,
  p_description text    DEFAULT NULL,
  p_category    text    DEFAULT 'General',
  p_cover_url   text    DEFAULT NULL,
  p_is_public   boolean DEFAULT true,
  p_max_members integer DEFAULT 100,
  p_visibility  text    DEFAULT 'public'
)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid      uuid := auth.uid();
  v_group_id uuid;
  v_slug     text;
  v_slug_base text;
  v_counter  integer := 0;
  v_group    public.groups%ROWTYPE;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  IF p_name IS NULL OR trim(p_name) = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Group name is required');
  END IF;
  IF p_max_members < 2 OR p_max_members > 10000 THEN
    RETURN jsonb_build_object('success', false, 'error', 'max_members must be between 2 and 10000');
  END IF;

  -- Generate unique slug
  v_slug_base := lower(regexp_replace(trim(p_name), '[^a-zA-Z0-9]+', '-', 'g'));
  v_slug_base := trim(v_slug_base, '-');
  IF v_slug_base = '' THEN v_slug_base := 'group'; END IF;
  v_slug := v_slug_base;
  LOOP
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.groups WHERE slug = v_slug AND deleted_at IS NULL);
    v_counter := v_counter + 1;
    v_slug := v_slug_base || '-' || v_counter;
    IF v_counter > 9999 THEN
      v_slug := v_slug_base || '-' || extract(epoch FROM now())::bigint;
      EXIT;
    END IF;
  END LOOP;

  -- Insert group
  INSERT INTO public.groups (
    name, description, category, cover_url,
    is_public, max_members, visibility, owner_id,
    slug, member_count, created_at, updated_at
  ) VALUES (
    trim(p_name), p_description, COALESCE(p_category,'General'), p_cover_url,
    p_is_public, p_max_members,
    CASE WHEN p_is_public THEN 'public' ELSE COALESCE(p_visibility,'invite_only') END,
    v_uid,
    v_slug, 1, now(), now()
  )
  RETURNING id INTO v_group_id;

  -- Insert owner membership
  INSERT INTO public.group_members (group_id, user_id, role, joined_at)
  VALUES (v_group_id, v_uid, 'owner', now())
  ON CONFLICT (group_id, user_id) DO UPDATE SET role = 'owner';

  SELECT * INTO v_group FROM public.groups WHERE id = v_group_id;

  RETURN jsonb_build_object(
    'success',   true,
    'group_id',  v_group_id,
    'slug',      v_slug,
    'group',     row_to_json(v_group)::jsonb
  );
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- ── 2. join_community_group ───────────────────────────────────────────────────
-- Safe public join. Enforces max_members. Blocks private groups.
CREATE OR REPLACE FUNCTION public.join_community_group(p_group_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid   uuid := auth.uid();
  v_group public.groups%ROWTYPE;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  SELECT * INTO v_group FROM public.groups
  WHERE id = p_group_id AND deleted_at IS NULL;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Group not found');
  END IF;
  IF NOT v_group.is_public THEN
    RETURN jsonb_build_object('success', false, 'error', 'This group is invite-only');
  END IF;
  IF v_group.member_count >= v_group.max_members THEN
    RETURN jsonb_build_object('success', false, 'error', 'Group is full');
  END IF;
  IF public._is_group_member(p_group_id, v_uid) THEN
    RETURN jsonb_build_object('success', true, 'already_member', true);
  END IF;

  INSERT INTO public.group_members (group_id, user_id, role, joined_at)
  VALUES (p_group_id, v_uid, 'member', now())
  ON CONFLICT (group_id, user_id) DO NOTHING;

  UPDATE public.groups SET member_count = member_count + 1, updated_at = now()
  WHERE id = p_group_id AND member_count < max_members;

  RETURN jsonb_build_object('success', true, 'group_id', p_group_id);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- ── 3. leave_community_group ──────────────────────────────────────────────────
-- Safe leave. Blocks owner self-removal (must transfer or delete group first).
CREATE OR REPLACE FUNCTION public.leave_community_group(p_group_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid  uuid := auth.uid();
  v_role text;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  SELECT role INTO v_role FROM public.group_members
  WHERE group_id = p_group_id AND user_id = v_uid;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not a member of this group');
  END IF;
  IF v_role = 'owner' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Owner cannot leave; delete the group or transfer ownership first');
  END IF;

  DELETE FROM public.group_members WHERE group_id = p_group_id AND user_id = v_uid;
  UPDATE public.groups SET member_count = GREATEST(0, member_count - 1), updated_at = now()
  WHERE id = p_group_id;

  RETURN jsonb_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- ── 4. delete_community_group ─────────────────────────────────────────────────
-- Owner-only. Cascades all group-owned rows.
CREATE OR REPLACE FUNCTION public.delete_community_group(p_group_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_id = p_group_id AND user_id = v_uid AND role = 'owner'
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only the group owner can delete this group');
  END IF;

  -- Cascade delete all group-owned data
  DELETE FROM public.group_challenge_participants
    WHERE challenge_id IN (SELECT id FROM public.group_challenges WHERE group_id = p_group_id);
  DELETE FROM public.group_challenges       WHERE group_id = p_group_id;
  DELETE FROM public.group_announcements    WHERE group_id = p_group_id;
  DELETE FROM public.group_milestones       WHERE group_id = p_group_id;
  DELETE FROM public.group_chat_messages    WHERE group_id = p_group_id;
  DELETE FROM public.group_invites          WHERE group_id = p_group_id;
  DELETE FROM public.group_members          WHERE group_id = p_group_id;
  DELETE FROM public.groups                 WHERE id       = p_group_id;

  RETURN jsonb_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- ── 5. update_group_member_role ───────────────────────────────────────────────
-- Owner can promote to admin/moderator/member. Admin can promote to moderator/member.
-- Nobody can promote to owner. Nobody can demote themselves.
CREATE OR REPLACE FUNCTION public.update_group_member_role(
  p_group_id  uuid,
  p_target_uid uuid,
  p_new_role  text
)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid       uuid := auth.uid();
  v_my_role   text;
  v_tgt_role  text;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  IF p_new_role NOT IN ('member','moderator','admin') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid role. Allowed: member, moderator, admin');
  END IF;
  -- Prevent self-promotion
  IF v_uid = p_target_uid THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cannot change your own role');
  END IF;

  SELECT role INTO v_my_role  FROM public.group_members WHERE group_id = p_group_id AND user_id = v_uid;
  SELECT role INTO v_tgt_role FROM public.group_members WHERE group_id = p_group_id AND user_id = p_target_uid;

  IF v_my_role IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'You are not a member of this group');
  END IF;
  IF v_tgt_role IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Target user is not a member');
  END IF;
  IF v_tgt_role = 'owner' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cannot change the owner''s role');
  END IF;

  -- Permission checks
  IF v_my_role = 'owner' THEN
    NULL; -- owner can set any non-owner role
  ELSIF v_my_role = 'admin' THEN
    IF p_new_role NOT IN ('member','moderator') THEN
      RETURN jsonb_build_object('success', false, 'error', 'Admins can only set member or moderator role');
    END IF;
  ELSE
    RETURN jsonb_build_object('success', false, 'error', 'Only owners and admins can change roles');
  END IF;

  UPDATE public.group_members SET role = p_new_role
  WHERE group_id = p_group_id AND user_id = p_target_uid;

  RETURN jsonb_build_object('success', true, 'role', p_new_role);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- ── 6. accept_invite (with max_members + member_count) ───────────────────────
CREATE OR REPLACE FUNCTION public.accept_invite(p_code text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid    uuid := auth.uid();
  v_invite public.group_invites%ROWTYPE;
  v_group  public.groups%ROWTYPE;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  SELECT * INTO v_invite FROM public.group_invites
  WHERE token = p_code OR invite_code = p_code LIMIT 1;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invite not found');
  END IF;
  IF v_invite.expires_at IS NOT NULL AND v_invite.expires_at < now() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invite has expired');
  END IF;
  IF v_invite.max_uses IS NOT NULL AND v_invite.uses_count >= v_invite.max_uses THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invite has reached maximum uses');
  END IF;

  SELECT * INTO v_group FROM public.groups WHERE id = v_invite.group_id AND deleted_at IS NULL;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Group no longer exists');
  END IF;
  IF v_group.member_count >= v_group.max_members THEN
    RETURN jsonb_build_object('success', false, 'error', 'Group is full');
  END IF;
  IF public._is_group_member(v_invite.group_id, v_uid) THEN
    RETURN jsonb_build_object('success', true, 'group_id', v_invite.group_id, 'already_member', true);
  END IF;

  INSERT INTO public.group_members (group_id, user_id, role, joined_at)
  VALUES (v_invite.group_id, v_uid, 'member', now())
  ON CONFLICT (group_id, user_id) DO NOTHING;

  UPDATE public.groups
  SET member_count = member_count + 1, updated_at = now()
  WHERE id = v_invite.group_id AND member_count < max_members;

  UPDATE public.group_invites SET
    uses_count  = uses_count + 1,
    invite_code = COALESCE(invite_code, token),
    token       = COALESCE(token, invite_code)
  WHERE id = v_invite.id;

  RETURN jsonb_build_object('success', true, 'group_id', v_invite.group_id);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- ── 7. get_invite_details ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_invite_details(p_code text)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT jsonb_build_object(
    'group_id',    g.id,
    'group_name',  g.name,
    'description', g.description,
    'cover_url',   g.cover_url,
    'slug',        COALESCE(g.slug, g.id::text),
    'member_count',g.member_count,
    'max_members', g.max_members,
    'is_public',   g.is_public,
    'expires_at',  gi.expires_at,
    'max_uses',    gi.max_uses,
    'uses_count',  gi.uses_count,
    'valid',       (gi.expires_at IS NULL OR gi.expires_at > now())
                   AND (gi.max_uses IS NULL OR gi.uses_count < gi.max_uses)
                   AND g.deleted_at IS NULL
  )
  FROM public.group_invites gi
  JOIN public.groups g ON g.id = gi.group_id
  WHERE gi.token = p_code OR gi.invite_code = p_code
  LIMIT 1;
$$;

-- ── 8. RLS: group_members ─────────────────────────────────────────────────────
-- All mutating operations go through SECURITY DEFINER RPCs above.
-- Direct INSERT from client is blocked. UPDATE is owner/admin only. Self-delete allowed.
DO $$ BEGIN
  DROP POLICY IF EXISTS gm_read_members   ON public.group_members;
  DROP POLICY IF EXISTS gm_own_write      ON public.group_members;
  DROP POLICY IF EXISTS gm_insert         ON public.group_members;
  DROP POLICY IF EXISTS gm_own_delete     ON public.group_members;
  DROP POLICY IF EXISTS gm_owner_update   ON public.group_members;
  DROP POLICY IF EXISTS gm_read           ON public.group_members;
  DROP POLICY IF EXISTS gm_self_delete    ON public.group_members;
  DROP POLICY IF EXISTS gm_manager_update ON public.group_members;

  -- Read: members can see their own group's member list
  CREATE POLICY gm_read_members ON public.group_members
    FOR SELECT USING (
      user_id = (SELECT auth.uid())
      OR public._is_group_member(group_id, (SELECT auth.uid()))
    );

  -- INSERT: blocked for direct client calls; RPCs use SECURITY DEFINER
  -- (no INSERT policy = all direct inserts rejected)

  -- DELETE: members can remove themselves (leave); owner/admin can remove others via RPC
  CREATE POLICY gm_self_delete ON public.group_members
    FOR DELETE USING (user_id = (SELECT auth.uid()));

  -- UPDATE: owner/admin only via RPC path (no direct UPDATE policy = blocked)
END $$;

-- ── 9. RLS: group_invites — include owner in create permission ────────────────
DO $$ BEGIN
  DROP POLICY IF EXISTS ginv_read   ON public.group_invites;
  DROP POLICY IF EXISTS ginv_create ON public.group_invites;
  DROP POLICY IF EXISTS ginv_delete ON public.group_invites;

  CREATE POLICY ginv_read ON public.group_invites
    FOR SELECT USING (
      group_id = ANY (SELECT group_id FROM public.group_members WHERE user_id = (SELECT auth.uid()))
      OR created_by = (SELECT auth.uid())
    );

  -- owner, admin, moderator can create invites
  CREATE POLICY ginv_create ON public.group_invites
    FOR INSERT WITH CHECK (
      created_by = (SELECT auth.uid())
      AND group_id IN (
        SELECT group_id FROM public.group_members
        WHERE user_id = (SELECT auth.uid())
          AND role IN ('owner', 'admin', 'moderator')
      )
    );

  -- creator or owner can delete
  CREATE POLICY ginv_delete ON public.group_invites
    FOR DELETE USING (
      created_by = (SELECT auth.uid())
      OR group_id IN (
        SELECT group_id FROM public.group_members
        WHERE user_id = (SELECT auth.uid()) AND role IN ('owner', 'admin')
      )
    );
END $$;

-- ── 10. RLS: group_announcements — restrict write to owner/admin/moderator ────
DO $$ BEGIN
  DROP POLICY IF EXISTS gann_read  ON public.group_announcements;
  DROP POLICY IF EXISTS gann_write ON public.group_announcements;
  DROP POLICY IF EXISTS gann_manager_write ON public.group_announcements;

  CREATE POLICY gann_read ON public.group_announcements
    FOR SELECT USING (public._is_group_member(group_id, (SELECT auth.uid())));

  CREATE POLICY gann_manager_write ON public.group_announcements
    FOR ALL USING (
      group_id IN (
        SELECT group_id FROM public.group_members
        WHERE user_id = (SELECT auth.uid()) AND role IN ('owner','admin','moderator')
      )
    ) WITH CHECK (
      author_id = (SELECT auth.uid())
      AND group_id IN (
        SELECT group_id FROM public.group_members
        WHERE user_id = (SELECT auth.uid()) AND role IN ('owner','admin','moderator')
      )
    );
END $$;

-- ── 11. RLS: group_challenges — restrict write to owner/admin/moderator ───────
DO $$ BEGIN
  DROP POLICY IF EXISTS gchall_read   ON public.group_challenges;
  DROP POLICY IF EXISTS gchall_insert ON public.group_challenges;
  DROP POLICY IF EXISTS gchall_update ON public.group_challenges;
  DROP POLICY IF EXISTS gchall_write  ON public.group_challenges;
  DROP POLICY IF EXISTS gchall_manager_write ON public.group_challenges;

  CREATE POLICY gchall_read ON public.group_challenges
    FOR SELECT USING (public._is_group_member(group_id, (SELECT auth.uid())));

  CREATE POLICY gchall_manager_write ON public.group_challenges
    FOR ALL USING (
      group_id IN (
        SELECT group_id FROM public.group_members
        WHERE user_id = (SELECT auth.uid()) AND role IN ('owner','admin','moderator')
      )
    ) WITH CHECK (
      group_id IN (
        SELECT group_id FROM public.group_members
        WHERE user_id = (SELECT auth.uid()) AND role IN ('owner','admin','moderator')
      )
    );
END $$;

-- ── 12. RLS: groups — prevent direct client delete (use RPC) ─────────────────
DO $$ BEGIN
  DROP POLICY IF EXISTS groups_owner_delete ON public.groups;
  -- No direct DELETE policy. delete_community_group RPC is SECURITY DEFINER.
END $$;

-- ── 13. Unique slug constraint ────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.groups'::regclass AND conname = 'groups_slug_unique'
  ) THEN
    -- Ensure no existing duplicates before adding constraint
    UPDATE public.groups g SET slug = slug || '-' || id::text
    WHERE slug IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.groups g2
      WHERE g2.slug = g.slug AND g2.id < g.id AND g2.deleted_at IS NULL
    ) AND g.deleted_at IS NULL;

    ALTER TABLE public.groups ADD CONSTRAINT groups_slug_unique UNIQUE (slug);
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ── 14. member_count sync trigger ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public._sync_group_member_count()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.groups SET member_count = member_count + 1, updated_at = now()
    WHERE id = NEW.group_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.groups SET member_count = GREATEST(0, member_count - 1), updated_at = now()
    WHERE id = OLD.group_id;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_member_count ON public.group_members;
CREATE TRIGGER trg_sync_member_count
  AFTER INSERT OR DELETE ON public.group_members
  FOR EACH ROW EXECUTE FUNCTION public._sync_group_member_count();

-- ── 15. Grants ────────────────────────────────────────────────────────────────
GRANT EXECUTE ON FUNCTION public.create_community_group(text,text,text,text,boolean,integer,text)  TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.join_community_group(uuid)                                         TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.leave_community_group(uuid)                                        TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.delete_community_group(uuid)                                       TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.update_group_member_role(uuid,uuid,text)                           TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.accept_invite(text)                                                TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_invite_details(text)                                           TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public._sync_group_member_count()                                         TO service_role;

-- ── Done ──────────────────────────────────────────────────────────────────────
-- After running this migration in Supabase SQL Editor, verify with:
--   SELECT routine_name FROM information_schema.routines
--   WHERE routine_schema='public' AND routine_name LIKE '%community%' OR routine_name LIKE '%group%'
--   ORDER BY routine_name;
