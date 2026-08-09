-- Fix: community_join_group must not create a phantom join request for the
-- group owner or an existing active member.
-- Verified 2026-08-09: owner joining own request-policy group returned
-- {"status":"requested"} and inserted a self-request into
-- community_join_requests (then had to be declined via
-- community_respond_join_request). Now returns {"status":"member"} instead.
CREATE OR REPLACE FUNCTION public.community_join_group(p_group_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  vis text; jp text; is_member boolean; is_owner boolean;
begin
  select g.visibility, g.join_policy, (g.owner_id = auth.uid()) into vis, jp, is_owner
    from public.groups g where g.id = p_group_id and g.deleted_at is null;
  if vis is null then raise exception 'group_not_found'; end if;

  select exists(
    select 1 from public.group_members m
    where m.group_id = p_group_id and m.user_id = auth.uid() and m.left_at is null
  ) into is_member;

  if is_owner or is_member then
    return jsonb_build_object('status', 'member');
  end if;

  if jp = 'open' or jp = 'instant' then
    insert into public.group_members (group_id, user_id, role, joined_at)
    values (p_group_id, auth.uid(), 'member', now())
    on conflict (group_id, user_id) do update set left_at = null;
    return jsonb_build_object('status', 'joined');
  else
    insert into public.community_join_requests (group_id, user_id, status, created_at)
    values (p_group_id, auth.uid(), 'pending', now())
    on conflict (group_id, user_id) do update set status = 'pending', created_at = now();
    return jsonb_build_object('status', 'requested');
  end if;
end $function$
