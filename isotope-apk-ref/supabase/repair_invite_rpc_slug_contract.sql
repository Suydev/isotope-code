-- Repair Android/community invite RPC response contract.
-- The compiled invite route needs a routeable group slug after accepting an invite.

create or replace function rpc_private.accept_invite(p_code text)
returns jsonb
language plpgsql
security definer
set search_path to ''
as $function$
declare
  v_invite public.group_invites%rowtype;
  v_group_slug text;
  v_uid uuid := (select auth.uid());
  v_inserted boolean := false;
begin
  if v_uid is null then
    return jsonb_build_object('success', false, 'error', 'Not authenticated');
  end if;

  select gi.*
  into v_invite
  from public.group_invites gi
  where gi.token = p_code or gi.invite_code = p_code
  order by gi.created_at desc nulls last
  limit 1
  for update;

  if not found then
    return jsonb_build_object('success', false, 'error', 'Invite not found');
  end if;
  if v_invite.expires_at is not null and v_invite.expires_at <= now() then
    return jsonb_build_object('success', false, 'error', 'Invite has expired');
  end if;
  if v_invite.max_uses is not null
     and coalesce(v_invite.uses_count, 0) >= v_invite.max_uses then
    return jsonb_build_object('success', false, 'error', 'Invite has reached maximum uses');
  end if;

  insert into public.group_members (group_id, user_id, role)
  values (v_invite.group_id, v_uid, 'member')
  on conflict (group_id, user_id) do nothing;
  v_inserted := found;

  if v_inserted then
    update public.group_invites
    set uses_count = coalesce(uses_count, 0) + 1,
        invite_code = coalesce(invite_code, token),
        token = coalesce(token, invite_code)
    where id = v_invite.id;
  end if;

  select g.slug
  into v_group_slug
  from public.groups g
  where g.id = v_invite.group_id;

  return jsonb_build_object(
    'success', true,
    'ok', true,
    'group_id', v_invite.group_id,
    'group_slug', coalesce(v_group_slug, v_invite.group_id::text),
    'slug', coalesce(v_group_slug, v_invite.group_id::text),
    'already_member', not v_inserted
  );
end;
$function$;

drop function if exists public.get_invite_details(text);
drop function if exists rpc_private.get_invite_details(text);

create function rpc_private.get_invite_details(p_code text)
returns table(
  group_id uuid,
  group_slug text,
  group_name text,
  description text,
  member_count bigint,
  is_valid boolean
)
language sql
stable
security definer
set search_path to ''
as $function$
  select
    g.id,
    g.slug,
    g.name,
    g.description,
    count(gm.user_id),
    (
      (gi.expires_at is null or gi.expires_at > now())
      and (gi.max_uses is null or coalesce(gi.uses_count, 0) < gi.max_uses)
    )
  from public.group_invites gi
  join public.groups g on g.id = gi.group_id
  left join public.group_members gm on gm.group_id = g.id
  where (gi.token = p_code or gi.invite_code = p_code)
    and (g.is_active = true or g.is_active is null)
    and g.deleted_at is null
  group by g.id, g.slug, g.name, g.description,
           gi.expires_at, gi.max_uses, gi.uses_count;
$function$;

create function public.get_invite_details(p_code text)
returns table(
  group_id uuid,
  group_slug text,
  group_name text,
  description text,
  member_count bigint,
  is_valid boolean
)
language sql
stable
set search_path to ''
as $function$
  select * from rpc_private.get_invite_details(p_code);
$function$;

grant execute on function public.accept_invite(text) to authenticated;
grant execute on function public.get_invite_details(text) to anon, authenticated;
