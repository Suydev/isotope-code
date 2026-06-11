-- IsotopeAI security verification queries
-- Run after isotope-complete.sql and migrations.

select
  n.nspname as schema_name,
  c.relname as table_name,
  c.relrowsecurity as rls_enabled
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in (
    'users',
    'user_profiles',
    'user_onboarding',
    'user_settings',
    'user_stats_summary',
    'daily_user_stats',
    'study_sessions_log',
    'sync_items',
    'backup_manifests',
    'groups',
    'group_members',
    'group_chat_messages',
    'group_invites',
    'group_challenges',
    'notifications',
    'user_presence'
  )
order by c.relname;

select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname in ('public', 'storage')
  and (
    tablename in (
      'users',
      'user_profiles',
      'user_onboarding',
      'user_settings',
      'user_stats_summary',
      'daily_user_stats',
      'study_sessions_log',
      'sync_items',
      'backup_manifests',
      'groups',
      'group_members',
      'group_chat_messages',
      'group_invites',
      'group_challenges',
      'notifications',
      'user_presence'
    )
    or tablename = 'objects'
  )
order by schemaname, tablename, policyname;

select id, name, public, file_size_limit, allowed_mime_types
from storage.buckets
where id in ('avatars', 'user-content', 'notes')
order by id;
