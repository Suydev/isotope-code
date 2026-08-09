-- Idempotent Supabase Storage bootstrap for Android/community assets.
-- Applied live to project vteqquoqvksshmfhuepu on 2026-07-01.
--
-- Path contract:
--   group-icons:    {auth.uid()}/groups/{group_id-or-slug}/{file}
--   study-material: {auth.uid()}/study-material/{subject-or-chapter}/{file}

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('group-icons', 'group-icons', true, 10485760, array['image/png','image/jpeg','image/webp','image/gif']),
  ('study-material', 'study-material', false, 104857600, null)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "group_icons_public_read" on storage.objects;
drop policy if exists "group_icons_owner_insert" on storage.objects;
drop policy if exists "group_icons_owner_update" on storage.objects;
drop policy if exists "group_icons_owner_delete" on storage.objects;
drop policy if exists "study_material_owner_select" on storage.objects;
drop policy if exists "study_material_owner_insert" on storage.objects;
drop policy if exists "study_material_owner_update" on storage.objects;
drop policy if exists "study_material_owner_delete" on storage.objects;

create policy "group_icons_public_read" on storage.objects
  for select to public
  using (bucket_id = 'group-icons');

create policy "group_icons_owner_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'group-icons' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "group_icons_owner_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'group-icons' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'group-icons' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "group_icons_owner_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'group-icons' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "study_material_owner_select" on storage.objects
  for select to authenticated
  using (bucket_id = 'study-material' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "study_material_owner_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'study-material' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "study_material_owner_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'study-material' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'study-material' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "study_material_owner_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'study-material' and (storage.foldername(name))[1] = (select auth.uid())::text);
