# Isotope Sync Proof Checklist

Rule: mark a feature `PROVEN` only after this chain passes:

Browser user action -> real Supabase row/storage object changes -> browser storage/cache cleared -> login again -> data restored from Supabase.

Do not use `/__admin/verify`, UI toasts, localStorage, IndexedDB, browser cache, optimistic state, or server self-reports as proof.

Use a disposable authenticated test account and record its Supabase Auth user id as `<USER_ID>`.

## Cache Clear

Run this between the "after" inspection and login-restore step:

```js
localStorage.clear();
sessionStorage.clear();
indexedDB.databases?.().then(dbs => dbs.forEach(db => indexedDB.deleteDatabase(db.name)));
caches?.keys?.().then(keys => keys.forEach(key => caches.delete(key)));
```

Then reload `http://127.0.0.1:3000`, log in again, and verify the UI restored from Supabase.

## 1. Profile And Settings

Browser action:
Change display name, username, bio, academic field, appearance/preference field, or another visible Settings/Profile field.

Before and after:

```sql
select user_id, profile_data, updated_at
from public.user_profiles
where user_id = '<USER_ID>';
```

Cloud snapshot object:

```sql
select bucket_id, name, owner, created_at, updated_at, metadata
from storage.objects
where bucket_id = 'user-content'
  and name = '<USER_ID>/cloud-snapshot/latest.json';
```

Expected after:
`profile_data` contains the changed field, `updated_at` changes, and `user-content/<USER_ID>/cloud-snapshot/latest.json` exists or has a newer `updated_at`.

Cache-clear restore:
After clearing browser storage/cache and logging in again, the same profile/settings values appear.

Result: `PROVEN` / `NOT FIXED`

## 2. Avatar Upload, Restore, Dedupe

Browser action:
Upload a profile image from Settings.

Profile row after:

```sql
select user_id, profile_data, updated_at
from public.user_profiles
where user_id = '<USER_ID>';
```

Expected row:
`profile_data.avatar_url` or `profile_data.avatar` is a Supabase Storage URL, and `profile_data.avatar_path` is present.

Storage after:

```sql
select bucket_id, name, owner, created_at, updated_at
from storage.objects
where bucket_id = 'avatars'
  and name like '<USER_ID>/avatar-%'
order by created_at desc;
```

Expected storage:
The object path is deterministic: `avatars/<USER_ID>/avatar-<sha256>.<ext>`.

Duplicate proof:
Upload the exact same image again. Expected result: no new second object for the same image hash.

Snapshot proof:

```sql
select bucket_id, name, updated_at
from storage.objects
where bucket_id = 'user-content'
  and name = '<USER_ID>/cloud-snapshot/latest.json';
```

Cache-clear restore:
Clear browser storage/cache, reload, login again. Expected result: avatar loads from the Supabase URL, not a `blob:` URL or data URL.

Remove proof:
Click Remove. Expected result: `profile_data.avatar*` fields are null and the prior owned avatar object is deleted or no longer referenced. Cache-clear login restores fallback avatar.

Result: `PROVEN` / `NOT FIXED`

## 3. Onboarding

Browser action:
Create/login the test user and complete onboarding in the app.

Before and after:

```sql
select user_id, completed, completed_at, data, updated_at
from public.user_onboarding
where user_id = '<USER_ID>';
```

Expected after:
`completed = true`, `completed_at` is non-null, and `user-content/<USER_ID>/cloud-snapshot/latest.json` exists or updates.

Cache-clear restore:
Clear browser storage/cache, reload, login again. Expected result: dashboard opens directly; onboarding does not appear or flash.

Result: `PROVEN` / `NOT FIXED`

## 4. Manual Export / Cloud Snapshot

Browser action:
Settings -> Data Export -> Export JSON backup.

Sync button action:
Settings -> Data & Privacy -> Sync & Backup -> Cloud Sync. This must also generate the same full browser backup JSON internally and upload it; it should not only refresh a DB-shaped snapshot.

Storage after:

```sql
select bucket_id, name, created_at, updated_at
from storage.objects
where bucket_id = 'user-content'
  and name like '<USER_ID>/%'
order by created_at desc
limit 20;
```

Expected after:
These paths exist after Export, and `exports/latest.json` also updates after Cloud Sync:

```text
<USER_ID>/exports/<timestamp>.json
<USER_ID>/exports/latest.json
<USER_ID>/cloud-snapshot/latest.json
```

Download/inspect `latest.json`. Expected shape:

```json
{
  "schema_version": 1,
  "user_id": "<USER_ID>",
  "source": "manual_export",
  "profile_data": {},
  "onboarding": {},
  "settings": {},
  "stats_summary": null,
  "daily_stats": [],
  "recent_sessions": []
}
```

Result: `PROVEN` / `NOT FIXED`

## 5. Manual Import

Browser action:
Settings -> Data Export -> Import JSON backup.

Cloud download action:
Settings -> Data & Privacy -> Cloud Sync when the device needs cloud bootstrap. If `user-content/<USER_ID>/exports/latest.json` exists, the app downloads that full browser backup JSON and imports it through the same compiled importer used by manual file import.

Storage after:
`user-content/<USER_ID>/imports/<timestamp>.json`, `user-content/<USER_ID>/imports/latest.json`, and `cloud-snapshot/latest.json` update.

DB after:
If the backup contains profile/onboarding fields, `user_profiles.profile_data` and/or `user_onboarding` reflect supported fields.

Important limitation:
Server-side import currently applies profile/settings/onboarding fields and stores the raw import in Storage. The compiled local import still restores local collections (`tasks`, `subjects`, `focus_sessions`, `habits`, `exams`, `daily_logs`, `tests`, `mock_tests`) locally. These collection imports are `NOT FIXED` for server-side Supabase merge until a canonical table mapping exists in `community-patch-v4.sql`.

Cache-clear restore:
Supported profile/settings/onboarding fields restore from Supabase after cache clear/login.

Result: `PROVEN` / `NOT FIXED`

## 6. Study Session And Stats

Browser action:
Complete a focus session.

Tables after:

```sql
select id, user_id, duration_minutes, ended_at, created_at
from public.study_sessions_log
where user_id = '<USER_ID>'
order by created_at desc
limit 5;
```

```sql
select user_id, date, seconds_studied, updated_at
from public.daily_user_stats
where user_id = '<USER_ID>'
order by date desc
limit 7;
```

```sql
select user_id, total_study_seconds, total_hours, session_count, total_sessions, last_session_at, updated_at
from public.user_stats_summary
where user_id = '<USER_ID>';
```

Snapshot after:
`user-content/<USER_ID>/cloud-snapshot/latest.json` updates after the RPC succeeds.

Cache-clear restore:
Clear browser storage/cache, reload, login again. Expected result: Analytics still shows the session/time; Community/member/leaderboard/group stats show the same Supabase-backed data, not fake zero.

Result: `PROVEN` / `NOT FIXED`

## 7. Product Tour

Browser action:
Open a group page with the tour and finish/skip `community_group_v1`.

Before and after:

```sql
select user_id, profile_data #> '{tours}' as tours, updated_at
from public.user_profiles
where user_id = '<USER_ID>';
```

Expected after:
`profile_data.tours.community_group_v1 = true` and `cloud-snapshot/latest.json` updates.

Cache-clear restore:
Clear browser storage/cache, reload, login again, open the same group page. Expected result: tour does not appear.

Result: `PROVEN` / `NOT FIXED`

## 8. Sync Status

Success proof:
Perform a profile/settings save. UI may show `Synced` only after:

```sql
select updated_at
from storage.objects
where bucket_id = 'user-content'
  and name = '<USER_ID>/cloud-snapshot/latest.json';
```

shows the snapshot write succeeded.

Failure proof:
Cause a real Supabase/Storage failure without weakening RLS. Expected UI: `Failed`, `Pending`, or offline state; never `Synced`.

Offline proof:
Stop the local server or disconnect network after the cached shell is available. Expected UI: offline/pending status, no fake synced state.

Result: `PROVEN` / `NOT FIXED`

## 9. RLS / Storage Policies

Apply `community-patch-v4.sql`, then verify:

```sql
select policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'storage'
  and tablename = 'objects'
  and policyname in (
    'avatars_public_read',
    'avatars_user_insert_own',
    'avatars_user_update_own',
    'avatars_user_delete_own',
    'private_content_owner_read',
    'private_content_owner_insert',
    'private_content_owner_update',
    'private_content_owner_delete'
  )
order by policyname;
```

Expected:
Authenticated users can insert/update/delete only paths whose first folder is their own `auth.uid()`. Avatars remain public-read only by policy intent; `user-content` and `notes` are owner-only.

Result: `PROVEN` / `NOT FIXED`

## 10. Offline / PWA

Browser action:
Load the app once with the server running, then stop the server and reopen the cached app.

Expected result:
Cached shell may open, but it must show offline/local-server-unavailable. No aggressive reload loop, forced onboarding on unknown cloud state, fake update banner, or fake synced state.

Endpoints to verify while server is running:

```text
http://127.0.0.1:3000/api/version
http://127.0.0.1:3000/sw.js
http://127.0.0.1:3000/manifest.webmanifest
http://127.0.0.1:3000/offline.html
```

Result: `PROVEN` / `NOT FIXED`

## 11. Login Persistence

Browser action:
Log in, open dashboard, then restart the local server:

```bash
isotope restart
```

Expected result:
Reload `http://127.0.0.1:5000` or the current local port. The app should use the persisted Supabase session/refresh token, run cloud bootstrap, and route to dashboard/onboarding according to the real `user_onboarding` row. It must not show the login page just because the local server restarted.

If the access token is expired but a refresh token exists, the early auth guard must allow the app to refresh it. If there is no refresh token or the Supabase session is revoked, login is expected.

Result: `PROVEN` / `NOT FIXED`

## 12. Admin Diagnostics

Browser action:
Open:

```text
http://127.0.0.1:3000/__admin/verify
```

Expected result:
Diagnostics may pass server/schema checks, but the manual browser proof matrix above remains `NOT FIXED` until each browser action -> Supabase -> cache-clear -> login restore test passes.
