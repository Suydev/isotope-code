-- IsotopeAI backup manifests
-- Idempotent migration. Run in Supabase SQL Editor.

create table if not exists public.backup_manifests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  bucket text not null,
  path text not null,
  kind text not null,
  content_hash text not null,
  size_bytes bigint not null default 0,
  collection_counts jsonb not null default '{}',
  exported_at timestamptz,
  selected_as_best boolean not null default false,
  score integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint backup_manifests_path_user_prefix
    check (split_part(path, '/', 1) = user_id::text)
);

create unique index if not exists backup_manifests_bucket_path_idx
  on public.backup_manifests(bucket, path);

create index if not exists backup_manifests_user_score_idx
  on public.backup_manifests(user_id, selected_as_best desc, score desc, updated_at desc);

alter table public.backup_manifests enable row level security;

drop policy if exists "backup_manifests_select_own" on public.backup_manifests;
create policy "backup_manifests_select_own"
  on public.backup_manifests for select
  using ((select auth.uid()) = user_id);

drop policy if exists "backup_manifests_insert_own" on public.backup_manifests;
create policy "backup_manifests_insert_own"
  on public.backup_manifests for insert
  with check ((select auth.uid()) = user_id and split_part(path, '/', 1) = (select auth.uid())::text);

drop policy if exists "backup_manifests_update_own" on public.backup_manifests;
create policy "backup_manifests_update_own"
  on public.backup_manifests for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id and split_part(path, '/', 1) = (select auth.uid())::text);

drop policy if exists "backup_manifests_delete_own" on public.backup_manifests;
create policy "backup_manifests_delete_own"
  on public.backup_manifests for delete
  using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.backup_manifests to authenticated;
grant all on public.backup_manifests to service_role;
