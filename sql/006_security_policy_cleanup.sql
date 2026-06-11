-- IsotopeAI security policy cleanup
-- Idempotent. Removes legacy permissive profile/avatar policies and recreates
-- least-privilege owner-write policies.

-- user_profiles: private owner rows. Public display data should come from
-- public.users, not profile_data.
drop policy if exists profiles_select_own on public.user_profiles;
drop policy if exists profiles_insert_own on public.user_profiles;
drop policy if exists profiles_update_own on public.user_profiles;
drop policy if exists profiles_self on public.user_profiles;
drop policy if exists profiles_own on public.user_profiles;
drop policy if exists up_own_read on public.user_profiles;
drop policy if exists up_own_write on public.user_profiles;
drop policy if exists up_service on public.user_profiles;

alter table public.user_profiles enable row level security;

create policy profiles_own on public.user_profiles
  for all
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- avatars: public read, owner-only write/delete by first path segment.
drop policy if exists "Avatar images are publicly accessible" on storage.objects;
drop policy if exists "Users can upload their own avatar" on storage.objects;
drop policy if exists "Users can update their own avatar" on storage.objects;
drop policy if exists "Users can delete their own avatar" on storage.objects;
drop policy if exists "avatars_public_select" on storage.objects;
drop policy if exists "avatars_public_read" on storage.objects;
drop policy if exists "avatars_auth_insert" on storage.objects;
drop policy if exists "avatars_auth_upload" on storage.objects;
drop policy if exists "avatars_user_write" on storage.objects;
drop policy if exists "avatars_user_insert_own" on storage.objects;
drop policy if exists "avatars_user_update_own" on storage.objects;
drop policy if exists "avatars_user_delete_own" on storage.objects;
drop policy if exists "avatars_own_update" on storage.objects;
drop policy if exists "avatars_own_delete" on storage.objects;
drop policy if exists "avatars_owner_update" on storage.objects;
drop policy if exists "avatars_owner_delete" on storage.objects;

create policy "avatars_public_read" on storage.objects
  for select to public
  using (bucket_id = 'avatars');

create policy "avatars_user_insert_own" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (select auth.uid())::text = (storage.foldername(name))[1]
  );

create policy "avatars_user_update_own" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'avatars'
    and (select auth.uid())::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'avatars'
    and (select auth.uid())::text = (storage.foldername(name))[1]
  );

create policy "avatars_user_delete_own" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'avatars'
    and (select auth.uid())::text = (storage.foldername(name))[1]
  );
