# Isotope Sync Proof Checklist

Rule: mark a feature `PROVEN` only after this chain passes:

Browser user action -> real Supabase row/storage change -> browser storage/cache cleared -> login again -> data restored from Supabase.

Do not use `/__admin/verify`, UI toasts, localStorage, Zustand, optimistic state, or server self-reports as proof.

## Prep

Use a disposable test account and record its Supabase Auth user id as `<USER_ID>`.

Before each test, capture the exact Supabase row before the browser action, then capture it again after the action. If the row did not change, mark `NOT FIXED`.

Cache-clear step in browser devtools console:

```js
localStorage.clear();
sessionStorage.clear();
indexedDB.databases?.().then(dbs => dbs.forEach(db => indexedDB.deleteDatabase(db.name)));
caches?.keys?.().then(keys => keys.forEach(key => caches.delete(key)));
```

Then reload `http://127.0.0.1:3000`, log in again, and verify the UI restored from Supabase.

## 1. Onboarding

Browser action:
Create/login the test user, complete onboarding in the app.

Supabase before:

```sql
select user_id, completed, completed_at, data, updated_at
from public.user_onboarding
where user_id = '<USER_ID>';
```

Expected before:
New account row exists with `completed = false`, or no row before first onboarding boot and a row created before completion.

Supabase after:
Same query must show `completed = true` and non-null `completed_at`.

Cache-clear restore:
Clear browser storage/cache, reload, login again. Expected result: dashboard opens directly; onboarding does not appear.

Result: `PROVEN` / `NOT FIXED`

## 2. Profile And Settings

Browser action:
Change display name, username, bio, theme, goal, or another visible setting.

Supabase before/after:

```sql
select user_id, profile_data, updated_at
from public.user_profiles
where user_id = '<USER_ID>';
```

Expected after:
`profile_data` contains the changed field and `updated_at` changes.

Cache-clear restore:
Clear browser storage/cache, reload, login again. Expected result: the same profile/settings values appear.

Result: `PROVEN` / `NOT FIXED`

## 3. Avatar / Storage

Browser action:
Upload a profile image from Settings.

Supabase row after:

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
  and name like '<USER_ID>/%'
order by created_at desc
limit 5;
```

Expected storage:
At least one object exists in bucket `avatars` for `<USER_ID>`.

Cache-clear restore:
Clear browser storage/cache, reload, login again. Expected result: avatar loads from Supabase URL, not a `blob:` URL or data URL.

Result: `PROVEN` / `NOT FIXED`

## 4. Product Tour

Browser action:
Open `/community/group/jee`, finish or skip the `community_group_v1` tour.

Supabase before/after:

```sql
select user_id, profile_data #> '{tours}' as tours, updated_at
from public.user_profiles
where user_id = '<USER_ID>';
```

Expected after:
`profile_data.tours.community_group_v1 = true`.

Cache-clear restore:
Clear browser storage/cache, reload, login again, open `/community/group/jee`. Expected result: tour does not appear.

Result: `PROVEN` / `NOT FIXED`

## 5. Study Session And Stats

Browser action:
Complete a focus session.

Supabase after:

```sql
select id, user_id, duration_minutes, ended_at, created_at
from public.study_sessions_log
where user_id = '<USER_ID>'
order by created_at desc
limit 5;
```

```sql
select user_id, date, seconds_studied, sessions_count, updated_at
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

Expected after:
New `study_sessions_log` row exists, `daily_user_stats.seconds_studied` increased, and `user_stats_summary` totals/session counters increased.

Cache-clear restore:
Clear browser storage/cache, reload, login again. Expected result: Analytics still shows the session/time; Community/member/leaderboard/group stats show the same data source, not zero.

Result: `PROVEN` / `NOT FIXED`

## 6. Sync Status

Success proof:
Perform a profile/settings save that changes `user_profiles.profile_data`. UI may show `Synced` only after the Supabase row changed.

Failure proof:
Temporarily cause a real Supabase failure without weakening RLS, such as using a user that lacks a write policy for the target row or disconnecting network during save. Expected UI: `Failed`, `Pending`, or `Pending/offline`; never `Synced`.

Offline proof:
Stop the local server or disconnect network after the cached shell is available. Expected UI: offline/pending status, no fake synced state.

Result: `PROVEN` / `NOT FIXED`

## 7. Offline / PWA

Browser action:
Load the app once with the server running, then stop the server and reopen the cached app.

Expected result:
Cached shell may open, but it must show offline/local-server-unavailable. No aggressive reload loop, forced onboarding, fake update banner, or fake synced state.

Endpoints to verify while server is running:

```text
http://127.0.0.1:3000/api/version
http://127.0.0.1:3000/sw.js
http://127.0.0.1:3000/manifest.webmanifest
http://127.0.0.1:3000/offline.html
```

Result: `PROVEN` / `NOT FIXED`

## 8. Update Banner

Browser action:
Open app with server running and current local version.

Expected result:
`/api/check-update` returns `hasUpdate=false` when current; banner hidden; stale localStorage update flags removed/ignored; no reload loop.

Server checks:

```text
http://127.0.0.1:3000/api/version
http://127.0.0.1:3000/api/check-update
```

Result: `PROVEN` / `NOT FIXED`

## 9. Termux Command / Widget

Phone action:
Run:

```bash
isotope doctor
isotope start
isotope open
isotope status
```

Expected result:
Default URL is `http://127.0.0.1:3000`; `start` waits for `/api/version`; `open` refuses to open if `/api/version` is down; `doctor` warns about stale aliases.

Widget action:
Install widgets with:

```bash
bash setup-termux-widget.sh
```

Expected result:
`~/.shortcuts/isotope-*` scripts call an absolute isotope command path or project fallback, not a stale shell alias.

Result: `PROVEN` / `NOT FIXED`

## 10. Admin Diagnostics

Browser action:
Open:

```text
http://127.0.0.1:3000/__admin/verify
```

Expected result:
Diagnostics may pass server/schema checks, but the manual browser proof matrix remains `NOT PROVEN` until this checklist is completed.

Result: `/__admin/verify` alone is never proof.
