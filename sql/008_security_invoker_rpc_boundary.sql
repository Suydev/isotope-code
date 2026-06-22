-- IsotopeAI exposed RPC boundary hardening
-- Version: 008
--
-- Public Data API functions remain API-compatible but are no longer
-- SECURITY DEFINER. Privileged operations delegate to narrowly granted
-- helpers in an unexposed schema.

begin;

create schema if not exists rpc_private;
revoke all on schema rpc_private from public, anon, authenticated, service_role;
grant usage on schema rpc_private to anon, authenticated, service_role;

-- Anonymous invite previews must read protected invite/member rows.
create or replace function rpc_private.get_invite_details(p_code text)
returns table (
  group_id uuid,
  group_name text,
  description text,
  member_count bigint,
  is_valid boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    g.id,
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
  group by g.id, g.name, g.description,
           gi.expires_at, gi.max_uses, gi.uses_count;
$$;

create or replace function public.get_invite_details(p_code text)
returns table (
  group_id uuid,
  group_name text,
  description text,
  member_count bigint,
  is_valid boolean
)
language sql
stable
security invoker
set search_path = ''
as $$
  select * from rpc_private.get_invite_details(p_code);
$$;

-- Invite acceptance requires atomic invite locking and usage accounting.
create or replace function rpc_private.accept_invite(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_invite public.group_invites%rowtype;
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

  return jsonb_build_object(
    'success', true,
    'group_id', v_invite.group_id,
    'already_member', not v_inserted
  );
end;
$$;

create or replace function public.accept_invite(p_code text)
returns jsonb
language sql
security invoker
set search_path = ''
as $$
  select rpc_private.accept_invite(p_code);
$$;

-- Attendance helpers update the protected aggregate counter atomically.
create or replace function rpc_private.join_community_event(p_event_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_evt public.community_events%rowtype;
begin
  if v_uid is null then
    return jsonb_build_object('ok', false, 'error', 'Not authenticated');
  end if;

  select *
  into v_evt
  from public.community_events
  where id = p_event_id
    and is_active = true;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'Event not found or inactive');
  end if;

  insert into public.community_event_attendees (event_id, user_id)
  values (p_event_id, v_uid)
  on conflict (event_id, user_id) do nothing;

  update public.community_events
  set attendee_count = (
    select count(*)
    from public.community_event_attendees
    where event_id = p_event_id
  )
  where id = p_event_id;

  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.join_community_event(p_event_id uuid)
returns jsonb
language sql
security invoker
set search_path = ''
as $$
  select rpc_private.join_community_event(p_event_id);
$$;

create or replace function rpc_private.leave_community_event(p_event_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
begin
  if v_uid is null then
    return jsonb_build_object('ok', false, 'error', 'Not authenticated');
  end if;

  delete from public.community_event_attendees
  where event_id = p_event_id
    and user_id = v_uid;

  update public.community_events
  set attendee_count = (
    select count(*)
    from public.community_event_attendees
    where event_id = p_event_id
  )
  where id = p_event_id;

  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.leave_community_event(p_event_id uuid)
returns jsonb
language sql
security invoker
set search_path = ''
as $$
  select rpc_private.leave_community_event(p_event_id);
$$;

-- Store purchase must keep points deduction and inventory insertion atomic.
create or replace function rpc_private.purchase_store_item(
  p_user_id uuid,
  p_item_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_item public.store_items%rowtype;
  v_points integer;
begin
  if p_user_id is null
     or (
       (select auth.role()) <> 'service_role'
       and (
         (select auth.uid()) is null
         or p_user_id is distinct from (select auth.uid())
       )
     ) then
    return jsonb_build_object('ok', false, 'error', 'not_authorized');
  end if;

  select *
  into v_item
  from public.store_items
  where id = p_item_id
    and active = true
    and price >= 0
  for update;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'item_not_found');
  end if;

  if exists (
    select 1
    from public.user_inventory
    where user_id = p_user_id
      and item_id = p_item_id
  ) then
    return jsonb_build_object('ok', false, 'error', 'already_owned');
  end if;

  update public.user_points
  set points = points - v_item.price
  where user_id = p_user_id
    and points >= v_item.price
  returning points into v_points;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'insufficient_coins');
  end if;

  insert into public.user_inventory (user_id, item_id, equipped, purchased_at)
  values (p_user_id, p_item_id, false, now());

  return jsonb_build_object('ok', true, 'coins_remaining', v_points);
end;
$$;

create or replace function public.purchase_store_item(
  p_user_id uuid,
  p_item_id uuid
)
returns jsonb
language sql
security invoker
set search_path = ''
as $$
  select rpc_private.purchase_store_item(p_user_id, p_item_id);
$$;

-- These functions are naturally constrained by their caller's RLS policies.
-- Guard each signature so upgrades from older partial schemas remain atomic.
do $$
declare
  v_signature text;
begin
  foreach v_signature in array array[
    'public.create_community_group(text,text,text,boolean,text,text,text,jsonb)',
    'public.finish_session_sync(uuid,text,integer,uuid,text,text,timestamptz)',
    'public.get_group_analytics_from_snapshots(uuid,integer)',
    'public.get_membership_snapshot(uuid,uuid)',
    'public.get_my_role()',
    'public.is_premium_user()',
    'public.is_premium_user(uuid)'
  ]
  loop
    if to_regprocedure(v_signature) is not null then
      execute format('alter function %s security invoker', v_signature);
    end if;
  end loop;
end
$$;

drop policy if exists event_attendees_read_authenticated
  on public.community_event_attendees;
drop policy if exists event_attendees_read_active
  on public.community_event_attendees;
create policy event_attendees_read_active
  on public.community_event_attendees
  for select to authenticated
  using (
    exists (
      select 1
      from public.community_events ce
      where ce.id = event_id
        and ce.is_active = true
    )
  );

-- Read-only RPCs use the safe display projection instead of private users.
create or replace function public.get_event_attendees(p_event_id uuid)
returns table (
  user_id uuid,
  username text,
  name text,
  avatar_url text,
  joined_at timestamptz
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    cea.user_id,
    udp.username,
    udp.name,
    udp.avatar_url,
    cea.joined_at
  from public.community_event_attendees cea
  join public.community_events ce
    on ce.id = cea.event_id
   and ce.is_active = true
  left join public.user_display_profiles udp on udp.id = cea.user_id
  where cea.event_id = p_event_id
  order by cea.joined_at asc;
$$;

create or replace function public.get_group_leaderboard(
  p_group_id uuid,
  p_limit integer default 20
)
returns table (
  rank bigint,
  user_id uuid,
  username text,
  name text,
  avatar_url text,
  points integer
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    row_number() over (order by coalesce(up.points, 0) desc) as rank,
    gm.user_id,
    udp.username,
    udp.name,
    udp.avatar_url,
    coalesce(up.points, 0) as points
  from public.group_members gm
  left join public.user_display_profiles udp on udp.id = gm.user_id
  left join public.user_points up on up.user_id = gm.user_id
  where gm.group_id = p_group_id
  order by coalesce(up.points, 0) desc
  limit greatest(0, least(coalesce(p_limit, 20), 100));
$$;

create or replace function public.get_leaderboard(
  p_period text default 'weekly',
  p_limit integer default 50,
  p_offset integer default 0
)
returns table (
  rank bigint,
  user_id uuid,
  username text,
  name text,
  avatar_url text,
  total_hours numeric,
  weekly_hours numeric,
  monthly_hours numeric,
  total_sessions integer,
  current_streak integer,
  last_session_at timestamptz,
  score numeric
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    row_number() over (
      order by
        case p_period
          when 'monthly' then s.monthly_hours
          else s.weekly_hours
        end desc nulls last,
        s.total_hours desc nulls last
    ) as rank,
    s.user_id,
    udp.username,
    udp.name,
    udp.avatar_url,
    coalesce(s.total_hours, 0),
    coalesce(s.weekly_hours, 0),
    coalesce(s.monthly_hours, 0),
    coalesce(s.total_sessions, 0)::integer,
    coalesce(s.current_streak, 0)::integer,
    s.last_session_at,
    coalesce(
      case p_period
        when 'monthly' then s.monthly_hours
        else s.weekly_hours
      end,
      0
    ) as score
  from public.user_stats_summary s
  left join public.user_display_profiles udp on udp.id = s.user_id
  order by score desc nulls last, s.total_hours desc nulls last
  limit greatest(0, least(coalesce(p_limit, 50), 100))
  offset greatest(0, coalesce(p_offset, 0));
$$;

-- Reset and apply the exact execution surface.
revoke all on function rpc_private.get_invite_details(text)
  from public, anon, authenticated, service_role;
revoke all on function rpc_private.accept_invite(text)
  from public, anon, authenticated, service_role;
revoke all on function rpc_private.join_community_event(uuid)
  from public, anon, authenticated, service_role;
revoke all on function rpc_private.leave_community_event(uuid)
  from public, anon, authenticated, service_role;
revoke all on function rpc_private.purchase_store_item(uuid,uuid)
  from public, anon, authenticated, service_role;

grant execute on function rpc_private.get_invite_details(text)
  to anon, authenticated, service_role;
grant execute on function rpc_private.accept_invite(text)
  to authenticated, service_role;
grant execute on function rpc_private.join_community_event(uuid)
  to authenticated, service_role;
grant execute on function rpc_private.leave_community_event(uuid)
  to authenticated, service_role;
grant execute on function rpc_private.purchase_store_item(uuid,uuid)
  to authenticated, service_role;

revoke all on function public.get_invite_details(text)
  from public, anon, authenticated, service_role;
revoke all on function public.accept_invite(text)
  from public, anon, authenticated, service_role;
revoke all on function public.join_community_event(uuid)
  from public, anon, authenticated, service_role;
revoke all on function public.leave_community_event(uuid)
  from public, anon, authenticated, service_role;
revoke all on function public.purchase_store_item(uuid,uuid)
  from public, anon, authenticated, service_role;

grant execute on function public.get_invite_details(text)
  to anon, authenticated, service_role;
grant execute on function public.accept_invite(text)
  to authenticated, service_role;
grant execute on function public.join_community_event(uuid)
  to authenticated, service_role;
grant execute on function public.leave_community_event(uuid)
  to authenticated, service_role;
grant execute on function public.purchase_store_item(uuid,uuid)
  to authenticated, service_role;

alter default privileges for role postgres in schema rpc_private
  revoke execute on functions from public, anon, authenticated, service_role;

notify pgrst, 'reload schema';

commit;
