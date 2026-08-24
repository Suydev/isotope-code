CREATE OR REPLACE FUNCTION public.community_join_group(p_group_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $body$
DECLARE
  v_uid uuid := auth.uid();
  v_group RECORD;
  v_existing boolean;
  v_joiner_name text;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  SELECT * INTO v_group FROM public.groups WHERE id = p_group_id AND deleted_at IS NULL;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'group_not_found');
  END IF;

  SELECT EXISTS (SELECT 1 FROM public.group_members WHERE group_id = p_group_id AND user_id = v_uid AND left_at IS NULL) INTO v_existing;
  IF v_existing THEN
    RETURN jsonb_build_object('success', true, 'data', 'already_joined');
  END IF;

  -- Joiner display name for notifications
  SELECT COALESCE(
    NULLIF(p.profile_data->>'community_display_name',''),
    u.username,
    split_part(u.email,'@',1)
  ) INTO v_joiner_name
  FROM public.users u LEFT JOIN public.user_profiles p ON p.user_id = u.id
  WHERE u.id = v_uid;

  -- ── Private groups: invite-only ────────────────────────────────────────────
  IF COALESCE(v_group.visibility, 'public') = 'private' THEN
    RETURN jsonb_build_object('success', false, 'error', 'This is a private group. You need an invite code to join.');
  END IF;

  -- ── Collect notification recipients ONCE (owner + admins, excluding self, deduped) ──
  CREATE TEMP TABLE _notif_recipients ON COMMIT DROP AS
    SELECT DISTINCT gm.user_id
    FROM public.group_members gm
    WHERE gm.group_id = p_group_id AND gm.role IN ('owner','admin') AND gm.left_at IS NULL AND gm.user_id != v_uid
    UNION
    SELECT v_group.owner_id WHERE v_group.owner_id IS NOT NULL AND v_group.owner_id != v_uid;

  -- ── Public + instant/open: join immediately ───────────────────────────────
  IF COALESCE(v_group.join_policy, 'open') IN ('open', 'instant', '') THEN
    INSERT INTO public.group_members (group_id, user_id, role)
    VALUES (p_group_id, v_uid, 'member')
    ON CONFLICT (group_id, user_id) DO NOTHING;

    INSERT INTO public.notifications (user_id, type, title, body, data)
    SELECT r.user_id, 'group_join', 'New member joined',
      v_joiner_name || ' joined "' || v_group.name || '"',
      jsonb_build_object('groupId', p_group_id, 'userId', v_uid, 'action', 'joined')
    FROM _notif_recipients r;

    RETURN jsonb_build_object('success', true, 'data', 'joined');
  END IF;

  -- ── Public + request: create request + notify ─────────────────────────────
  IF COALESCE(v_group.join_policy, '') = 'request' THEN
    IF EXISTS (SELECT 1 FROM public.community_join_requests WHERE group_id = p_group_id AND user_id = v_uid AND status = 'pending') THEN
      RETURN jsonb_build_object('success', true, 'data', 'requested');
    END IF;

    INSERT INTO public.community_join_requests (group_id, user_id, status)
    VALUES (p_group_id, v_uid, 'pending');

    INSERT INTO public.notifications (user_id, type, title, body, data)
    SELECT r.user_id, 'group_join_request', 'Join request',
      v_joiner_name || ' wants to join "' || v_group.name || '"',
      jsonb_build_object('groupId', p_group_id, 'userId', v_uid, 'action', 'join_request')
    FROM _notif_recipients r;

    RETURN jsonb_build_object('success', true, 'data', 'requested');
  END IF;

  -- Fallback: unknown policy → treat as request
  INSERT INTO public.community_join_requests (group_id, user_id, status)
  VALUES (p_group_id, v_uid, 'pending')
  ON CONFLICT DO NOTHING;
  RETURN jsonb_build_object('success', true, 'data', 'requested');
END;
$body$;
