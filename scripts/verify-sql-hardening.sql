-- Post-migration catalog verification for
-- sql/007_comprehensive_sql_rls_hardening.sql and
-- sql/008_security_invoker_rpc_boundary.sql.
--
-- Run in the Supabase SQL editor after applying migrations 007 and 008. The DO blocks
-- fail on security regressions; the final queries report duplicate indexes and
-- the effective policy/grant surface for review.

do $$
declare
  v_names text;
begin
  select string_agg(format('%I.%I', n.nspname, c.relname), ', ' order by n.nspname, c.relname)
  into v_names
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relkind in ('r', 'p')
    and c.relname = any (array[
      'users', 'user_display_profiles', 'user_profiles', 'user_points', 'user_stats_summary',
      'daily_user_stats', 'study_sessions_log', 'user_presence',
      'user_onboarding', 'user_settings', 'user_roles', 'backup_manifests',
      'sync_items', 'notifications', 'groups', 'group_members',
      'group_chat_messages', 'group_invites', 'group_announcements',
      'group_milestones', 'group_challenges', 'group_challenge_participants',
      'store_items', 'user_inventory', 'community_events',
      'community_event_attendees', 'user_tours'
    ])
    and not c.relrowsecurity;

  if v_names is not null then
    raise exception 'RLS is disabled on managed tables: %', v_names;
  end if;
end
$$;

do $$
declare
  v_names text;
begin
  select string_agg(p.oid::regprocedure::text, ', ' order by p.oid::regprocedure::text)
  into v_names
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.prosecdef
    and (
      has_function_privilege('anon', p.oid, 'EXECUTE')
      or has_function_privilege('authenticated', p.oid, 'EXECUTE')
    );

  if v_names is not null then
    raise exception 'Exposed SECURITY DEFINER functions executable by API roles: %', v_names;
  end if;
end
$$;

do $$
declare
  v_names text;
begin
  select string_agg(p.oid::regprocedure::text, ', ' order by p.oid::regprocedure::text)
  into v_names
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname in ('public', 'private', 'rpc_private')
    and p.prosecdef
    and not coalesce(p.proconfig, '{}'::text[]) @> array['search_path=""'];

  if v_names is not null then
    raise exception 'SECURITY DEFINER functions without empty search_path: %', v_names;
  end if;
end
$$;

do $$
declare
  v_names text;
begin
  select string_agg(p.oid::regprocedure::text, ', ' order by p.oid::regprocedure::text)
  into v_names
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname in ('public', 'private', 'rpc_private')
    and exists (
      select 1
      from aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) acl
      where acl.grantee = 0
        and acl.privilege_type = 'EXECUTE'
    );

  if v_names is not null then
    raise exception 'Functions executable by PUBLIC: %', v_names;
  end if;
end
$$;

do $$
begin
  if exists (
    select 1
    from pg_namespace n
    cross join lateral aclexplode(coalesce(n.nspacl, acldefault('n', n.nspowner))) acl
    where n.nspname = 'public'
      and acl.grantee = 0
      and acl.privilege_type = 'CREATE'
  )
     or has_schema_privilege('anon', 'public', 'CREATE')
     or has_schema_privilege('authenticated', 'public', 'CREATE') then
    raise exception 'API roles can create objects in the public schema';
  end if;

  if has_table_privilege('anon', 'public.users', 'SELECT')
     or has_column_privilege('anon', 'public.users', 'email', 'SELECT') then
    raise exception 'anon can read public.users or public.users.email';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'user_display_profiles'
      and column_name = 'email'
  ) then
    raise exception 'public.user_display_profiles exposes email';
  end if;

  if exists (
    select 1
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = 'user_display_profiles'
      and c.relkind in ('v', 'm')
  ) then
    raise exception 'public.user_display_profiles must be a table, not a definer view';
  end if;

  if not has_table_privilege('anon', 'public.user_display_profiles', 'SELECT')
     or not has_table_privilege('authenticated', 'public.user_display_profiles', 'SELECT') then
    raise exception 'safe display view is not readable by expected API roles';
  end if;
end
$$;

do $$
declare
  v_names text;
begin
  select string_agg(
    format('%I.%I granted to %I', table_schema, table_name, grantee),
    ', ' order by table_schema, table_name, grantee
  )
  into v_names
  from information_schema.role_table_grants
  where grantee in ('PUBLIC', 'anon', 'authenticated')
    and table_schema = 'public'
    and privilege_type in ('INSERT', 'UPDATE', 'DELETE')
    and table_name = any (array[
      'user_roles', 'group_milestones', 'store_items', 'community_events'
    ]);

  if v_names is not null then
    raise exception 'API roles have writes on read-only tables: %', v_names;
  end if;
end
$$;

do $$
begin
  if has_column_privilege('authenticated', 'public.group_members', 'group_id', 'UPDATE')
     or has_column_privilege('authenticated', 'public.group_members', 'user_id', 'UPDATE')
     or has_column_privilege('authenticated', 'public.group_chat_messages', 'group_id', 'UPDATE')
     or has_column_privilege('authenticated', 'public.group_chat_messages', 'user_id', 'UPDATE')
     or has_column_privilege('authenticated', 'public.group_challenge_participants', 'challenge_id', 'UPDATE')
     or has_column_privilege('authenticated', 'public.group_challenge_participants', 'user_id', 'UPDATE')
     or has_column_privilege('authenticated', 'public.user_points', 'lifetime_points', 'UPDATE')
     or has_table_privilege('authenticated', 'public.user_points', 'DELETE') then
    raise exception 'authenticated can rewrite protected relationship or points columns';
  end if;

  if to_regclass('public.user_inventory') is not null
     and (
       has_column_privilege('authenticated', 'public.user_inventory', 'user_id', 'UPDATE')
       or has_column_privilege('authenticated', 'public.user_inventory', 'item_id', 'UPDATE')
     ) then
    raise exception 'authenticated can rewrite inventory ownership keys';
  end if;
end
$$;

do $$
declare
  v_using text;
  v_check text;
begin
  select qual, with_check
  into v_using, v_check
  from pg_policies
  where schemaname = 'public'
    and tablename = 'group_members'
    and policyname = 'group_members_update_managed';

  if v_using is null
     or v_check is null
     or v_using not like '%can_manage_group%'
     or v_check not like '%can_manage_group%'
     or v_using like '%user_id = ( SELECT auth.uid()%' then
    raise exception 'group member update policy permits unmanaged role changes';
  end if;
end
$$;

-- Must return zero rows. Multiple permissive policies for the same role and
-- command are ORed together and are commonly an accidental broadening.
select schemaname, tablename, role_name, cmd, array_agg(policyname order by policyname)
from (
  select p.schemaname, p.tablename, p.policyname, p.cmd, unnest(p.roles) as role_name
  from pg_policies p
  where p.permissive = 'PERMISSIVE'
    and p.schemaname in ('public', 'storage')
) expanded
group by schemaname, tablename, role_name, cmd
having count(*) > 1
order by schemaname, tablename, role_name, cmd;

-- Review structural duplicate indexes. Constraint-owned indexes are included
-- for context and should not be dropped solely from this report.
select
  n.nspname as schema_name,
  t.relname as table_name,
  array_agg(i.relname order by i.relname) as duplicate_indexes,
  min(pg_get_indexdef(x.indexrelid)) as example_definition
from pg_index x
join pg_class i on i.oid = x.indexrelid
join pg_class t on t.oid = x.indrelid
join pg_namespace n on n.oid = t.relnamespace
where n.nspname = 'public'
group by
  n.nspname,
  t.relname,
  x.indisunique,
  x.indisprimary,
  x.indexprs::text,
  x.indpred::text,
  x.indclass,
  x.indkey,
  x.indcollation,
  x.indoption
having count(*) > 1
order by n.nspname, t.relname;

select
  schemaname,
  tablename,
  policyname,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname in ('public', 'storage')
order by schemaname, tablename, policyname;
