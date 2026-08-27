-- Test file: Community RPC functions to apply to Supabase
-- Run this in Supabase SQL Editor on the keeper project (ollsqiutzartjhiuzkbf)
--
-- ⚠ ARTIFACT — NOT part of the install chain. This targets the "keeper"
-- project, NOT the default built-in one (vteqquoqvksshmfhuepu). Its contents
-- were merged into isotope-complete.sql; do not run this on a normal install.

-- community_is_enrolled
CREATE OR REPLACE FUNCTION public.community_is_enrolled()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.user_id = auth.uid()
    AND (up.profile_data->>'community_enrolled')::boolean = true
  );
$$;

-- community_bootstrap_profile
CREATE OR REPLACE FUNCTION public.community_bootstrap_profile(
  p_display_name text,
  p_handle       text DEFAULT NULL,
  p_day_offset_hours integer DEFAULT 0
)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  UPDATE public.user_profiles
  SET profile_data = jsonb_set(
    COALESCE(profile_data, '{}'),
    '{community_enrolled}',
    'true'
  ),
  profile_data = jsonb_set(
    profile_data,
    '{community_handle}',
    to_jsonb(p_handle)
  ),
  profile_data = jsonb_set(
    profile_data,
    '{community_display_name}',
    to_jsonb(p_display_name)
  ),
  profile_data = jsonb_set(
    profile_data,
    '{community_day_offset_hours}',
    to_jsonb(p_day_offset_hours)
  )
  WHERE user_id = v_uid;
  RETURN jsonb_build_object('success', true);
END;
$$;

-- community_create_group
CREATE OR REPLACE FUNCTION public.community_create_group(
  p_name text,
  p_description text DEFAULT NULL,
  p_exam text DEFAULT NULL,
  p_target_year integer DEFAULT NULL,
  p_subjects text[] DEFAULT '{}',
  p_visibility text DEFAULT 'public',
  p_join_policy text DEFAULT 'open',
  p_timezone_offset_minutes integer DEFAULT 0
)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_group_id uuid;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  INSERT INTO public.groups (name, description, exam, target_year, subjects, visibility, join_policy, owner_id)
  VALUES (p_name, p_description, p_exam, p_target_year, p_subjects, p_visibility, p_join_policy, v_uid)
  RETURNING id INTO v_group_id;
  INSERT INTO public.group_members (group_id, user_id, role)
  VALUES (v_group_id, v_uid, 'owner');
  RETURN jsonb_build_object('success', true, 'data', jsonb_build_object(
    'id', v_group_id,
    'slug', lower(regexp_replace(p_name, '[^a-z0-9]+', '-', 'g')),
    'name', p_name,
    'description', p_description,
    'exam', p_exam,
    'targetYear', p_target_year,
    'subjects', p_subjects,
    'visibility', p_visibility,
    'joinPolicy', p_join_policy,
    'memberCount', 1,
    'activeNow', 0,
    'visualKey', 0,
    'role', 'owner'
  ));
END;
$$;

-- community_get_group
CREATE OR REPLACE FUNCTION public.community_get_group(p_group_id uuid, p_period text DEFAULT 'weekly')
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_group RECORD;
BEGIN
  SELECT * INTO v_group FROM public.groups WHERE id = p_group_id AND (deleted_at IS NULL);
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Group not found');
  END IF;
  RETURN jsonb_build_object(
    'success', true,
    'data', jsonb_build_object(
      'id', v_group.id,
      'slug', lower(regexp_replace(v_group.name, '[^a-z0-9]+', '-', 'g')),
      'name', v_group.name,
      'description', v_group.description,
      'exam', v_group.exam,
      'targetYear', v_group.target_year,
      'subjects', v_group.subjects,
      'visibility', v_group.visibility,
      'joinPolicy', v_group.join_policy,
      'memberCount', (SELECT COUNT(*) FROM public.group_members WHERE group_id = v_group.id),
      'activeNow', 0,
      'visualKey', v_group.visual_key,
      'role', (SELECT role FROM public.group_members WHERE group_id = v_group.id AND user_id = auth.uid())
    )
  );
END;
$$;

-- community_join_group
CREATE OR REPLACE FUNCTION public.community_join_group(p_group_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_group RECORD;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  SELECT * INTO v_group FROM public.groups WHERE id = p_group_id AND (deleted_at IS NULL);
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Group not found');
  END IF;
  INSERT INTO public.group_members (group_id, user_id, role)
  VALUES (p_group_id, v_uid, 'member')
  ON CONFLICT (group_id, user_id) DO NOTHING;
  RETURN jsonb_build_object('success', true, 'data', 'joined');
END;
$$;

-- community_leave_group
CREATE OR REPLACE FUNCTION public.community_leave_group(p_group_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  DELETE FROM public.group_members WHERE group_id = p_group_id AND user_id = v_uid;
  RETURN jsonb_build_object('success', true);
END;
$$;

-- community_update_group
CREATE OR REPLACE FUNCTION public.community_update_group(p_group_id uuid, p_changes jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_role text;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  SELECT role INTO v_role FROM public.group_members WHERE group_id = p_group_id AND user_id = v_uid;
  IF v_role NOT IN ('owner', 'admin') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient permissions');
  END IF;
  UPDATE public.groups
  SET
    name = COALESCE(p_changes->>'name', name),
    description = COALESCE(p_changes->>'description', description),
    exam = COALESCE(p_changes->>'exam', exam),
    target_year = COALESCE((p_changes->>'targetYear')::int, target_year),
    subjects = COALESCE(p_changes->'subjects', subjects),
    visibility = COALESCE(p_changes->>'visibility', visibility),
    join_policy = COALESCE(p_changes->>'joinPolicy', join_policy),
    updated_at = now()
  WHERE id = p_group_id;
  RETURN jsonb_build_object('success', true);
END;
$$;

-- community_remove_group_member
CREATE OR REPLACE FUNCTION public.community_remove_group_member(p_group_id uuid, p_user_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_role text;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  SELECT role INTO v_role FROM public.group_members WHERE group_id = p_group_id AND user_id = v_uid;
  IF v_role NOT IN ('owner', 'admin') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient permissions');
  END IF;
  DELETE FROM public.group_members WHERE group_id = p_group_id AND user_id = p_user_id;
  RETURN jsonb_build_object('success', true);
END;
$$;

-- community_set_group_role
CREATE OR REPLACE FUNCTION public.community_set_group_role(p_group_id uuid, p_user_id uuid, p_role text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_role text;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  SELECT role INTO v_role FROM public.group_members WHERE group_id = p_group_id AND user_id = v_uid;
  IF v_role != 'owner' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only owner can set roles');
  END IF;
  UPDATE public.group_members
  SET role = p_role
  WHERE group_id = p_group_id AND user_id = p_user_id;
  RETURN jsonb_build_object('success', true);
END;
$$;

-- community_transfer_group
CREATE OR REPLACE FUNCTION public.community_transfer_group(p_group_id uuid, p_new_owner uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_role text;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  SELECT role INTO v_role FROM public.group_members WHERE group_id = p_group_id AND user_id = v_uid;
  IF v_role != 'owner' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only owner can transfer');
  END IF;
  UPDATE public.group_members SET role = 'owner' WHERE group_id = p_group_id AND user_id = p_new_owner;
  UPDATE public.group_members SET role = 'admin' WHERE group_id = p_group_id AND user_id = v_uid;
  RETURN jsonb_build_object('success', true);
END;
$$;

-- community_delete_group
CREATE OR REPLACE FUNCTION public.community_delete_group(p_group_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_role text;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  SELECT role INTO v_role FROM public.group_members WHERE group_id = p_group_id AND user_id = v_uid;
  IF v_role != 'owner' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only owner can delete');
  END IF;
  UPDATE public.groups SET deleted_at = now() WHERE id = p_group_id;
  RETURN jsonb_build_object('success', true);
END;
$$;

-- community_get_overview
CREATE OR REPLACE FUNCTION public.community_get_overview()
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT jsonb_build_object(
    'stats', jsonb_build_object(
      'totalGroups', (SELECT COUNT(*) FROM public.groups WHERE deleted_at IS NULL),
      'totalMembers', (SELECT COUNT(DISTINCT user_id) FROM public.group_members),
      'totalMessages', 0
    ),
    'groups', (SELECT jsonb_agg(jsonb_build_object(
      'id', id, 'name', name, 'slug', lower(regexp_replace(name, '[^a-z0-9]+', '-', 'g')),
      'memberCount', (SELECT COUNT(*) FROM public.group_members WHERE group_id = g.id),
      'activeNow', 0, 'visualKey', visual_key, 'exam', exam
    )) FROM public.groups g WHERE deleted_at IS NULL)
  );
$$;

-- community_discover_groups
CREATE OR REPLACE FUNCTION public.community_discover_groups(
  p_query text DEFAULT '', p_exam text DEFAULT NULL, p_target_year integer DEFAULT NULL,
  p_subject text DEFAULT NULL, p_has_space boolean DEFAULT NULL, p_join_policy text DEFAULT NULL,
  p_limit integer DEFAULT 20, p_offset integer DEFAULT 0
)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_sql text;
BEGIN
  v_sql := 'SELECT jsonb_agg(jsonb_build_object(
    ''id'', id, ''name'', name, ''slug'', lower(regexp_replace(name, ''[^a-z0-9]+'', ''-'', ''g'')),
    ''memberCount'', (SELECT COUNT(*) FROM public.group_members WHERE group_id = g.id),
    ''activeNow'', 0, ''visualKey'', visual_key, ''exam'', exam, ''targetYear'', target_year
  )) FROM public.groups g WHERE deleted_at IS NULL';
  IF p_query IS NOT NULL AND p_query != '' THEN
    v_sql := v_sql || ' AND (g.name ILIKE ''%' || replace(p_query, '''', '''''') || '%'' OR g.description ILIKE ''%' || replace(p_query, '''', '''''') || '%'')';
  END IF;
  IF p_exam IS NOT NULL THEN v_sql := v_sql || ' AND g.exam = ' || quote_literal(p_exam); END IF;
  IF p_target_year IS NOT NULL THEN v_sql := v_sql || ' AND g.target_year = ' || p_target_year::text; END IF;
  IF p_subject IS NOT NULL THEN v_sql := v_sql || ' AND ' || quote_literal(p_subject) || ' = ANY(g.subjects)'; END IF;
  IF p_has_space THEN v_sql := v_sql || ' AND (SELECT COUNT(*) FROM public.group_members WHERE group_id = g.id) < 30'; END IF;
  IF p_join_policy IS NOT NULL THEN v_sql := v_sql || ' AND g.join_policy = ' || quote_literal(p_join_policy); END IF;
  v_sql := v_sql || ' ORDER BY g.created_at DESC LIMIT ' || p_limit::text || ' OFFSET ' || p_offset::text;
  RETURN (SELECT jsonb_build_object('success', true, 'data', COALESCE((SELECT v_sql::jsonb), '[]'::jsonb)));
END;
$$;

-- GRANT EXECUTE for new community functions
GRANT EXECUTE ON FUNCTION public.community_is_enrolled() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.community_bootstrap_profile(text, text, integer) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.community_create_group(text, text, text, integer, text[], text, text, integer) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.community_get_group(uuid, text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.community_join_group(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.community_leave_group(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.community_update_group(uuid, jsonb) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.community_remove_group_member(uuid, uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.community_set_group_role(uuid, uuid, text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.community_transfer_group(uuid, uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.community_delete_group(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.community_get_overview() TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.community_discover_groups(text, text, integer, text, boolean, text, integer, integer) TO authenticated, anon, service_role;