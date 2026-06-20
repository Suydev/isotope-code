-- IsotopeAI comprehensive SQL / RLS hardening
-- Version: 007
-- Idempotent and compatible with the current live schema.
--
-- Security model:
--   * public.users is private to the owning authenticated user.
--   * public.user_display_profiles exposes only non-sensitive display fields.
--   * SECURITY DEFINER functions have a fixed empty search_path.
--   * Function EXECUTE is opt-in; trigger helpers are never Data API RPCs.
--   * RLS policies use explicit roles and cached (select auth.uid()) checks.
--   * Avatar objects remain directly readable through the public bucket URL,
--     but storage.objects cannot be publicly listed.

begin;

revoke create on schema public from public, anon, authenticated;
grant usage on schema public to anon, authenticated, service_role;

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated, service_role;

create or replace function private.is_group_member(p_group_id uuid, p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.group_members gm
    where gm.group_id = p_group_id
      and gm.user_id = p_user_id
  );
$$;

create or replace function private.can_manage_group(p_group_id uuid, p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    exists (
      select 1
      from public.groups g
      where g.id = p_group_id
        and g.owner_id = p_user_id
    )
    or exists (
      select 1
      from public.group_members gm
      where gm.group_id = p_group_id
        and gm.user_id = p_user_id
        and gm.role in ('owner', 'admin', 'moderator')
    );
$$;

revoke all on function private.is_group_member(uuid, uuid) from public, anon, authenticated, service_role;
revoke all on function private.can_manage_group(uuid, uuid) from public, anon, authenticated, service_role;
grant execute on function private.is_group_member(uuid, uuid) to authenticated, service_role;
grant execute on function private.can_manage_group(uuid, uuid) to authenticated, service_role;

-- One canonical signup trigger. Conflict updates deliberately preserve plan,
-- billing, entitlement, and currency fields.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_username text;
  v_name text;
  v_email text;
  v_avatar_url text;
begin
  v_username := coalesce(
    nullif(trim(new.raw_user_meta_data->>'username'), ''),
    split_part(coalesce(new.email, ''), '@', 1),
    'user_' || left(new.id::text, 8)
  );
  v_name := coalesce(
    nullif(trim(new.raw_user_meta_data->>'name'), ''),
    nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
    v_username
  );
  v_email := coalesce(new.email, v_username || '@isotope.local');
  v_avatar_url := nullif(trim(new.raw_user_meta_data->>'avatar_url'), '');

  insert into public.users (id, email, name, username, avatar_url)
  values (new.id, v_email, v_name, v_username, v_avatar_url)
  on conflict (id) do update set
    email = coalesce(excluded.email, public.users.email),
    name = coalesce(excluded.name, public.users.name),
    username = coalesce(excluded.username, public.users.username),
    avatar_url = coalesce(excluded.avatar_url, public.users.avatar_url),
    updated_at = now();

  insert into public.user_profiles (user_id, profile_data)
  values (
    new.id,
    jsonb_build_object(
      'display_name', v_name,
      'avatar_url', coalesce(v_avatar_url, ''),
      'bio', ''
    )
  )
  on conflict (user_id) do nothing;

  insert into public.user_onboarding (user_id, completed, source)
  values (new.id, false, 'signup')
  on conflict (user_id) do nothing;

  insert into public.user_points (user_id, points, lifetime_points)
  values (new.id, 0, 0)
  on conflict (user_id) do nothing;

  insert into public.user_stats_summary (
    user_id, total_study_seconds, streak_days, max_streak_days, session_count
  )
  values (new.id, 0, 0, 0, 0)
  on conflict (user_id) do nothing;

  insert into public.user_presence (user_id, status, last_seen)
  values (new.id, 'offline', now())
  on conflict (user_id) do nothing;

  insert into public.user_settings (user_id, settings)
  values (new.id, '{}'::jsonb)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists trg_handle_new_user_profile on auth.users;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
drop function if exists public.handle_new_user_profile();

-- Safe display surface. Use a physical projection rather than a
-- SECURITY DEFINER view so public profile reads never inherit access to the
-- private users table.
do $$
begin
  if exists (
    select 1
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = 'user_display_profiles'
      and c.relkind = 'v'
  ) then
    execute 'drop view if exists public.user_display_profiles cascade';
  end if;
end
$$;

create table if not exists public.user_display_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  name text,
  avatar_url text,
  updated_at timestamptz not null default now()
);

insert into public.user_display_profiles (id, username, name, avatar_url, updated_at)
select u.id, u.username, u.name, u.avatar_url, coalesce(u.updated_at, now())
from public.users u
on conflict (id) do update set
  username = excluded.username,
  name = excluded.name,
  avatar_url = excluded.avatar_url,
  updated_at = excluded.updated_at;

create or replace function public.sync_user_display_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    delete from public.user_display_profiles where id = old.id;
    return old;
  end if;
  insert into public.user_display_profiles (id, username, name, avatar_url, updated_at)
  values (new.id, new.username, new.name, new.avatar_url, coalesce(new.updated_at, now()))
  on conflict (id) do update set
    username = excluded.username,
    name = excluded.name,
    avatar_url = excluded.avatar_url,
    updated_at = excluded.updated_at;
  return new;
end;
$$;

drop trigger if exists sync_user_display_profile on public.users;
create trigger sync_user_display_profile
  after insert or update or delete on public.users
  for each row execute function public.sync_user_display_profile();

revoke all on public.users from public, anon, authenticated;
revoke all on public.user_display_profiles from public, anon, authenticated, service_role;
grant select on public.user_display_profiles to anon, authenticated, service_role;
grant select on public.users to authenticated;
grant insert (id, email, name, username, avatar_url, updated_at)
  on public.users to authenticated;
grant update (email, name, username, avatar_url, updated_at)
  on public.users to authenticated;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'users' and column_name = 'device_id'
  ) then
    grant insert (device_id) on public.users to authenticated;
    grant update (device_id) on public.users to authenticated;
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'users' and column_name = 'content_hash'
  ) then
    grant update (content_hash) on public.users to authenticated;
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'users' and column_name = 'last_synced_at'
  ) then
    grant update (last_synced_at) on public.users to authenticated;
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'users' and column_name = 'version'
  ) then
    grant update (version) on public.users to authenticated;
  end if;
end
$$;

-- Remove every policy on tables owned by this schema, then install one
-- canonical set. This also cleans unknown legacy names from the live project.
do $$
declare
  p record;
begin
  for p in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = any (array[
        'users', 'user_display_profiles', 'user_profiles', 'user_points', 'user_stats_summary',
        'daily_user_stats', 'study_sessions_log', 'user_presence',
        'user_onboarding', 'user_settings', 'user_roles', 'backup_manifests',
        'sync_items', 'notifications', 'store_items', 'user_inventory',
        'groups', 'group_members', 'group_chat_messages', 'group_invites',
        'group_announcements', 'group_milestones', 'group_challenges',
        'group_challenge_participants', 'community_events',
        'community_event_attendees', 'user_tours'
      ])
  loop
    execute format(
      'drop policy if exists %I on %I.%I',
      p.policyname, p.schemaname, p.tablename
    );
  end loop;
end
$$;

alter table public.users enable row level security;
create policy users_select_own on public.users
  for select to authenticated
  using (id = (select auth.uid()));
create policy users_insert_own on public.users
  for insert to authenticated
  with check (id = (select auth.uid()));
create policy users_update_own on public.users
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

alter table public.user_display_profiles enable row level security;
create policy user_display_profiles_read on public.user_display_profiles
  for select to anon, authenticated
  using (true);

alter table public.user_profiles enable row level security;
create policy profiles_own on public.user_profiles
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

alter table public.user_points enable row level security;
create policy points_read_authenticated on public.user_points
  for select to authenticated using (true);
create policy points_insert_own on public.user_points
  for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy points_update_own on public.user_points
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

alter table public.user_stats_summary enable row level security;
create policy stats_read_authenticated on public.user_stats_summary
  for select to authenticated using (true);
create policy stats_insert_own on public.user_stats_summary
  for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy stats_update_own on public.user_stats_summary
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
create policy stats_delete_own on public.user_stats_summary
  for delete to authenticated
  using (user_id = (select auth.uid()));

alter table public.daily_user_stats enable row level security;
create policy daily_read_authenticated on public.daily_user_stats
  for select to authenticated using (true);
create policy daily_insert_own on public.daily_user_stats
  for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy daily_update_own on public.daily_user_stats
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
create policy daily_delete_own on public.daily_user_stats
  for delete to authenticated
  using (user_id = (select auth.uid()));

alter table public.study_sessions_log enable row level security;
create policy sessions_own on public.study_sessions_log
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

alter table public.user_presence enable row level security;
create policy presence_read_authenticated on public.user_presence
  for select to authenticated using (true);
create policy presence_insert_own on public.user_presence
  for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy presence_update_own on public.user_presence
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
create policy presence_delete_own on public.user_presence
  for delete to authenticated
  using (user_id = (select auth.uid()));

alter table public.user_onboarding enable row level security;
create policy onboarding_own on public.user_onboarding
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

alter table public.user_settings enable row level security;
create policy settings_own on public.user_settings
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

alter table public.user_roles enable row level security;
create policy roles_read_own on public.user_roles
  for select to authenticated
  using (user_id = (select auth.uid()));

alter table public.backup_manifests enable row level security;
create policy backup_manifests_select_own on public.backup_manifests
  for select to authenticated
  using (user_id = (select auth.uid()));
create policy backup_manifests_insert_own on public.backup_manifests
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and split_part(path, '/', 1) = (select auth.uid())::text
  );
create policy backup_manifests_update_own on public.backup_manifests
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and split_part(path, '/', 1) = (select auth.uid())::text
  );
create policy backup_manifests_delete_own on public.backup_manifests
  for delete to authenticated
  using (user_id = (select auth.uid()));

alter table public.sync_items enable row level security;
create policy sync_items_own on public.sync_items
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

alter table public.notifications enable row level security;
create policy notifications_own on public.notifications
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

alter table public.groups enable row level security;
create policy groups_read_public on public.groups
  for select to anon
  using (is_public = true and is_active = true and deleted_at is null);
create policy groups_read_authenticated on public.groups
  for select to authenticated
  using (
    (is_public = true and is_active = true and deleted_at is null)
    or private.is_group_member(id, (select auth.uid()))
  );
create policy groups_insert_own on public.groups
  for insert to authenticated
  with check (owner_id = (select auth.uid()));
create policy groups_update_own on public.groups
  for update to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));
create policy groups_delete_own on public.groups
  for delete to authenticated
  using (owner_id = (select auth.uid()));

alter table public.group_members enable row level security;
create policy group_members_read_members on public.group_members
  for select to authenticated
  using (private.is_group_member(group_id, (select auth.uid())));
create policy group_members_insert_self on public.group_members
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and (
      role = 'member'
      or (
        role in ('owner', 'admin', 'moderator')
        and exists (
          select 1
          from public.groups g
          where g.id = group_id
            and g.owner_id = (select auth.uid())
        )
      )
    )
  );
create policy group_members_update_managed on public.group_members
  for update to authenticated
  using (private.can_manage_group(group_id, (select auth.uid())))
  with check (
    private.can_manage_group(group_id, (select auth.uid()))
    and role in ('owner', 'admin', 'moderator', 'member')
  );
create policy group_members_delete_self_or_managed on public.group_members
  for delete to authenticated
  using (
    user_id = (select auth.uid())
    or private.can_manage_group(group_id, (select auth.uid()))
  );

alter table public.group_chat_messages enable row level security;
create policy group_chat_read_members on public.group_chat_messages
  for select to authenticated
  using (private.is_group_member(group_id, (select auth.uid())));
create policy group_chat_insert_own on public.group_chat_messages
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and private.is_group_member(group_id, (select auth.uid()))
  );
create policy group_chat_update_own on public.group_chat_messages
  for update to authenticated
  using (
    user_id = (select auth.uid())
    and private.is_group_member(group_id, (select auth.uid()))
  )
  with check (
    user_id = (select auth.uid())
    and private.is_group_member(group_id, (select auth.uid()))
  );

alter table public.group_invites enable row level security;
create policy group_invites_read_managers on public.group_invites
  for select to authenticated
  using (
    created_by = (select auth.uid())
    or private.can_manage_group(group_id, (select auth.uid()))
  );
create policy group_invites_insert_managers on public.group_invites
  for insert to authenticated
  with check (
    created_by = (select auth.uid())
    and private.can_manage_group(group_id, (select auth.uid()))
  );
create policy group_invites_delete_managers on public.group_invites
  for delete to authenticated
  using (
    created_by = (select auth.uid())
    or private.can_manage_group(group_id, (select auth.uid()))
  );

alter table public.group_announcements enable row level security;
create policy group_announcements_read_members on public.group_announcements
  for select to authenticated
  using (private.is_group_member(group_id, (select auth.uid())));
create policy group_announcements_insert_managers on public.group_announcements
  for insert to authenticated
  with check (
    author_id = (select auth.uid())
    and private.can_manage_group(group_id, (select auth.uid()))
  );
create policy group_announcements_update_managers on public.group_announcements
  for update to authenticated
  using (
    author_id = (select auth.uid())
    and private.can_manage_group(group_id, (select auth.uid()))
  )
  with check (
    author_id = (select auth.uid())
    and private.can_manage_group(group_id, (select auth.uid()))
  );
create policy group_announcements_delete_managers on public.group_announcements
  for delete to authenticated
  using (
    author_id = (select auth.uid())
    and private.can_manage_group(group_id, (select auth.uid()))
  );

alter table public.group_milestones enable row level security;
create policy group_milestones_read_members on public.group_milestones
  for select to authenticated
  using (private.is_group_member(group_id, (select auth.uid())));

alter table public.group_challenges enable row level security;
create policy group_challenges_read_members on public.group_challenges
  for select to authenticated
  using (private.is_group_member(group_id, (select auth.uid())));
create policy group_challenges_insert_managers on public.group_challenges
  for insert to authenticated
  with check (
    created_by = (select auth.uid())
    and private.can_manage_group(group_id, (select auth.uid()))
  );
create policy group_challenges_update_managers on public.group_challenges
  for update to authenticated
  using (
    created_by = (select auth.uid())
    and private.can_manage_group(group_id, (select auth.uid()))
  )
  with check (
    created_by = (select auth.uid())
    and private.can_manage_group(group_id, (select auth.uid()))
  );
create policy group_challenges_delete_managers on public.group_challenges
  for delete to authenticated
  using (
    created_by = (select auth.uid())
    and private.can_manage_group(group_id, (select auth.uid()))
  );

alter table public.group_challenge_participants enable row level security;
create policy challenge_participants_read_members
  on public.group_challenge_participants
  for select to authenticated
  using (
    user_id = (select auth.uid())
    or exists (
      select 1
      from public.group_challenges gc
      where gc.id = challenge_id
        and private.is_group_member(gc.group_id, (select auth.uid()))
    )
  );
create policy challenge_participants_insert_own
  on public.group_challenge_participants
  for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy challenge_participants_update_own
  on public.group_challenge_participants
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
create policy challenge_participants_delete_own
  on public.group_challenge_participants
  for delete to authenticated
  using (user_id = (select auth.uid()));

do $$
begin
  if to_regclass('public.store_items') is not null then
    execute 'alter table public.store_items enable row level security';
    execute 'create policy store_items_read on public.store_items for select to anon, authenticated using (active = true)';
  end if;
  if to_regclass('public.user_inventory') is not null then
    execute 'alter table public.user_inventory enable row level security';
    execute 'create policy inventory_own on public.user_inventory for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()))';
  end if;
  if to_regclass('public.community_events') is not null then
    execute 'alter table public.community_events enable row level security';
    execute 'create policy community_events_read_active on public.community_events for select to anon, authenticated using (is_active = true)';
  end if;
  if to_regclass('public.community_event_attendees') is not null then
    execute 'alter table public.community_event_attendees enable row level security';
    execute 'create policy event_attendees_read_authenticated on public.community_event_attendees for select to authenticated using (true)';
    execute 'create policy event_attendees_insert_own on public.community_event_attendees for insert to authenticated with check (user_id = (select auth.uid()))';
    execute 'create policy event_attendees_delete_own on public.community_event_attendees for delete to authenticated using (user_id = (select auth.uid()))';
  end if;
  if to_regclass('public.user_tours') is not null then
    execute 'alter table public.user_tours enable row level security';
    execute 'create policy user_tours_own on public.user_tours for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()))';
  end if;
end
$$;

-- Reset inherited/legacy API grants before applying the least-privilege
-- table allowlist. RLS remains the row boundary.
do $$
declare
  t text;
begin
  foreach t in array array[
    'user_display_profiles', 'user_profiles', 'user_points', 'user_stats_summary', 'daily_user_stats',
    'study_sessions_log', 'user_presence', 'user_onboarding', 'user_settings',
    'user_roles', 'backup_manifests', 'sync_items', 'notifications',
    'groups', 'group_members', 'group_chat_messages', 'group_invites',
    'group_announcements', 'group_milestones', 'group_challenges',
    'group_challenge_participants', 'user_tours', 'store_items',
    'user_inventory', 'community_events', 'community_event_attendees'
  ]
  loop
    if to_regclass(format('public.%I', t)) is not null then
      execute format('revoke all on public.%I from public, anon, authenticated', t);
      execute format('grant all on public.%I to service_role', t);
    end if;
  end loop;
end
$$;

grant select, insert, update, delete on
  public.user_profiles,
  public.user_stats_summary,
  public.daily_user_stats,
  public.study_sessions_log,
  public.user_presence,
  public.user_onboarding,
  public.user_settings,
  public.backup_manifests,
  public.sync_items,
  public.notifications,
  public.groups,
  public.group_invites,
  public.group_announcements,
  public.group_challenges
to authenticated;

revoke insert, update, delete on public.user_display_profiles from authenticated;
grant select on public.user_display_profiles to anon, authenticated;

-- The deployed store client uses an upsert to decrement points. Limit that
-- compatibility path to the balance/timestamp columns; lifetime points and row
-- deletion remain server-controlled.
grant select on public.user_points to authenticated;
grant insert (user_id, points, updated_at) on public.user_points to authenticated;
grant update (points, updated_at) on public.user_points to authenticated;

grant select, insert, delete on public.group_members to authenticated;
grant update (role) on public.group_members to authenticated;

grant select, insert on public.group_chat_messages to authenticated;
grant update (content, deleted_at) on public.group_chat_messages to authenticated;

grant select, insert, delete
  on public.group_challenge_participants to authenticated;
grant update (progress, completed, completed_at)
  on public.group_challenge_participants to authenticated;

grant select on
  public.user_roles,
  public.group_milestones
to authenticated;

do $$
begin
  if to_regclass('public.store_items') is not null then
    grant select on public.store_items to anon;
    grant select on public.store_items to authenticated;
  end if;
  if to_regclass('public.user_inventory') is not null then
    grant select on public.user_inventory to authenticated;
    grant insert (user_id, item_id, equipped)
      on public.user_inventory to authenticated;
    grant update (equipped) on public.user_inventory to authenticated;
  end if;
  if to_regclass('public.community_events') is not null then
    grant select on public.community_events to anon;
    grant select on public.community_events to authenticated;
  end if;
  if to_regclass('public.community_event_attendees') is not null then
    grant select, insert, delete
      on public.community_event_attendees to authenticated;
  end if;
  if to_regclass('public.user_tours') is not null then
    grant select, insert, update, delete on public.user_tours to authenticated;
  end if;
  grant select on public.groups to anon;
  grant all on public.users to service_role;
end
$$;

-- Storage: remove all historical variants for the three managed buckets.
do $$
declare
  p record;
begin
  for p in
    select policyname
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = any (array[
        'Avatar images are publicly accessible',
        'Users can upload their own avatar',
        'Users can update their own avatar',
        'Users can delete their own avatar',
        'avatars_public_select', 'avatars_public_read', 'avatars_auth_insert',
        'avatars_auth_upload', 'avatars_user_write', 'avatars_user_insert_own',
        'avatars_user_update_own', 'avatars_user_delete_own',
        'avatars_own_update', 'avatars_own_delete', 'avatars_owner_update',
        'avatars_owner_delete', 'avatars: public read', 'avatars: users manage own',
        'avatars_owner_select', 'avatars_owner_insert',
        'private_objects_owner_select', 'private_objects_owner_insert',
        'private_objects_owner_update', 'private_objects_owner_delete',
        'managed_objects_owner_select', 'managed_objects_owner_insert',
        'managed_objects_owner_update', 'managed_objects_owner_delete',
        'private_content_owner_read', 'private_content_owner_write',
        'private_content_owner_insert', 'private_content_owner_update',
        'private_content_owner_delete', 'user-content: users manage own objects',
        'notes: users manage own objects', 'user_content_own',
        'usercontent_own_select', 'usercontent_own_insert',
        'usercontent_own_update', 'usercontent_own_delete', 'notes_own',
        'notes_own_select', 'notes_own_insert', 'notes_own_update',
        'notes_own_delete', 'notes_owner_read', 'notes_owner_write',
        'notes_owner_update', 'notes_owner_delete'
      ])
  loop
    execute format('drop policy if exists %I on storage.objects', p.policyname);
  end loop;
end
$$;

create policy managed_objects_owner_select on storage.objects
  for select to authenticated
  using (
    bucket_id in ('avatars', 'user-content', 'notes')
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
create policy managed_objects_owner_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id in ('avatars', 'user-content', 'notes')
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
create policy managed_objects_owner_update on storage.objects
  for update to authenticated
  using (
    bucket_id in ('avatars', 'user-content', 'notes')
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id in ('avatars', 'user-content', 'notes')
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
create policy managed_objects_owner_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id in ('avatars', 'user-content', 'notes')
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- Harden caller-sensitive RPCs.
create or replace function public.accept_invite(p_code text)
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

create or replace function public.get_membership_snapshot(
  p_user_id uuid default null,
  target_user_id uuid default null
)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'user_id', u.id,
    'plan_type', u.plan_type,
    'plan_expires_at', u.plan_expires_at,
    'is_premium', true,
    'points', coalesce(up.points, 0),
    'lifetime_points', coalesce(up.lifetime_points, 0),
    'billing_status', u.billing_status,
    'access_ends_at', u.access_ends_at
  )
  from public.users u
  left join public.user_points up on up.user_id = u.id
  where u.id = coalesce(p_user_id, target_user_id, (select auth.uid()))
    and (
      (select auth.role()) = 'service_role'
      or u.id = (select auth.uid())
    );
$$;

do $migration$
begin
  if to_regclass('public.store_items') is not null
     and to_regclass('public.user_inventory') is not null then
    execute $function$
      create or replace function public.purchase_store_item(
        p_user_id uuid,
        p_item_id uuid
      )
      returns jsonb
      language plpgsql
      security definer
      set search_path = ''
      as $body$
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
      $body$;
    $function$;
  end if;
end
$migration$;

-- Fix search_path on every SECURITY DEFINER function, including live-only
-- trigger helpers not represented in older schema snapshots.
do $$
declare
  f record;
begin
  for f in
    select p.oid::regprocedure as signature
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname in ('public', 'private')
      and p.prosecdef
  loop
    execute format('alter function %s set search_path = ''''', f.signature);
  end loop;
end
$$;

alter function public.set_user_tours_updated_at() set search_path = '';

-- Reset EXECUTE on every public function. Explicit grants below are the complete
-- Data API RPC allowlist. Trigger-only functions receive no client grant.
do $$
declare
  f record;
begin
  for f in
    select p.oid::regprocedure as signature
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
  loop
    execute format(
      'revoke all on function %s from public, anon, authenticated, service_role',
      f.signature
    );
  end loop;
end
$$;

do $$
declare
  g record;
begin
  for g in
    select *
    from (values
      ('public.is_premium_user()', 'authenticated, service_role'),
      ('public.is_premium_user(uuid)', 'authenticated, service_role'),
      ('public.get_invite_details(text)', 'anon, authenticated, service_role'),
      ('public.accept_invite(text)', 'authenticated, service_role'),
      ('public.get_membership_snapshot(uuid,uuid)', 'authenticated, service_role'),
      ('public.get_group_analytics_from_snapshots(uuid,integer)', 'authenticated, service_role'),
      ('public.get_leaderboard(text,integer,integer)', 'authenticated, service_role'),
      ('public.get_group_leaderboard(uuid,integer)', 'authenticated, service_role'),
      ('public.finish_session_sync(uuid,text,integer,uuid,text,text,timestamptz)', 'authenticated, service_role'),
      ('public.join_community_event(uuid)', 'authenticated, service_role'),
      ('public.leave_community_event(uuid)', 'authenticated, service_role'),
      ('public.get_event_attendees(uuid)', 'authenticated, service_role'),
      ('public.purchase_store_item(uuid,uuid)', 'authenticated, service_role'),
      ('public.create_community_group(text,text,text,boolean,text,text,text,jsonb)', 'authenticated, service_role'),
      ('public.get_my_role()', 'authenticated, service_role'),
      ('public.check_user_role(uuid,text)', 'service_role'),
      ('public.create_community_event(text,text,text,text,timestamptz,timestamptz,text,text,text[],integer,boolean,boolean)', 'service_role'),
      ('public.update_community_event(uuid,text,text,text,text,timestamptz,timestamptz,text,text,text[],integer,boolean,boolean)', 'service_role'),
      ('public.delete_community_event(uuid)', 'service_role'),
      ('public.expire_stale_presence()', 'service_role')
    ) as grants(signature, roles)
    where to_regprocedure(signature) is not null
  loop
    execute format('grant execute on function %s to %s', g.signature, g.roles);
  end loop;
end
$$;

alter default privileges for role postgres in schema public
  revoke execute on functions from public, anon, authenticated, service_role;

-- Policies now use private helpers. The blanket EXECUTE reset above makes
-- legacy public helpers non-callable without risking dependency failures from
-- dropping functions that may still be referenced by live-only objects.

-- Missing FK indexes found in the live catalog.
do $$
begin
  if to_regclass('public.community_events') is not null then
    if exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'community_events'
        and column_name = 'creator_id'
    ) then
      create index if not exists idx_community_events_creator_id
        on public.community_events (creator_id);
    end if;
    if exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'community_events'
        and column_name = 'host_user_id'
    ) then
      create index if not exists idx_community_events_host_user_id
        on public.community_events (host_user_id);
    end if;
  end if;
end
$$;

-- Known exact duplicate indexes. Constraint-owned indexes are intentionally
-- retained; only redundant standalone indexes are removed.
drop index if exists public.idx_event_att_ev_v8;
drop index if exists public.idx_cea_event;
alter table if exists public.community_event_attendees
  drop constraint if exists cea_event_user_unique;
drop index if exists public.idx_daily_stats;
drop index if exists public.idx_daily_stats_v8;
drop index if exists public.idx_daily_user_date;
drop index if exists public.idx_gann_author_id;
drop index if exists public.idx_chall_parts_v8;
drop index if exists public.idx_challenge_parts;
drop index if exists public.idx_gcpart_challenge_user;
drop index if exists public.idx_challenges_group;
drop index if exists public.idx_gchat_group_created;
drop index if exists public.idx_gchat_group_ts;
drop index if exists public.idx_gchat_user_id;
drop index if exists public.idx_gchat_user_v8;
drop index if exists public.idx_ginv_code;
drop index if exists public.idx_invites_code;
drop index if exists public.idx_invites_code_v8;
drop index if exists public.idx_ginv_token;
drop index if exists public.idx_invites_tok_v8;
drop index if exists public.idx_invites_token;
drop index if exists public.idx_gm_group;
drop index if exists public.idx_gmembers_group_user;
drop index if exists public.idx_gmembers_gu_v8;
drop index if exists public.idx_gmembers_u_v8;
drop index if exists public.idx_gmembers_user;
drop index if exists public.idx_groups_slug;
drop index if exists public.idx_notif_user_created;
drop index if exists public.idx_notif_user_ts_v8;
drop index if exists public.idx_notif_unread_v8;
drop index if exists public.idx_sessions_user;
drop index if exists public.sync_items_entity_idx;
drop index if exists public.idx_inventory_u_v8;
drop index if exists public.idx_profiles_user_id;
drop index if exists public.idx_user_profiles_user;
drop index if exists public.idx_user_profiles_user_id;
drop index if exists public.idx_user_roles_user_role;
drop index if exists public.idx_user_roles_u;
drop index if exists public.idx_user_roles_user;
drop index if exists public.idx_user_sett_u;
drop index if exists public.idx_user_settings_user_id;
drop index if exists public.idx_stats_hours;
drop index if exists public.idx_stats_hrs_v8;
drop index if exists public.idx_stats_user_id;
drop index if exists public.idx_user_stats_user;
drop index if exists public.idx_points_user_id;

commit;
