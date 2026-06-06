# Isotope Cloud Sync Trace Map

Status rule: a feature is `PROVEN` only after this chain passes:

Browser user action -> Supabase DB row or Storage object changes -> browser storage/cache cleared -> login again -> UI restores from Supabase/cloud.

`/__admin/verify`, localStorage, IndexedDB, browser cache, optimistic UI, and a Settings label are not proof.

## Recursive Read Passes

Pass 1 inventory:
`server.mjs`, `public/restore-and-launch.js`, `public/pwa-local.js`, `public/sw.js`, `public/update-checker.js`, `public/focus-bg-import.js`, `public/assets/*.js`, `community-patch-v4.sql`, `events-expansion.sql`, `isotope-schema.sql`, and existing sync docs.

Pass 2 connected paths:
profile/settings/avatar routes, onboarding completion, username auth helpers, boot hydration, sync engine pull/push/manual sync, export/import backup functions, finish-session RPC shim, leaderboard/community shims, storage buckets and policies.

Pass 3 recheck:
confirmed no existing `user-content/{user_id}/cloud-snapshot/latest.json` upload/download path, avatar object names are timestamp/random, manual export/import are browser-local, and storage policies are incomplete for owner-scoped upsert/delete.

## Trace Map

| Feature | UI component/action | Local store/cache | Backup/export path | Supabase DB target | Supabase Storage target | Upload function/path | Download/login path | Sync status source | Failure found / proof status |
|---|---|---|---|---|---|---|---|---|---|
| Login bootstrap | `public/restore-and-launch.js` before app bundle preload | `isotope_user_profile_v2`, `isotope_cloud_snapshot_{user_id}`, `isotope_cloud_bootstrap`, `isotope-user-sync` | none | `/__auth/bootstrap` fetches `users`, `user_profiles`, `user_onboarding`, `user_settings`, `user_stats_summary`, recent `daily_user_stats`, recent `study_sessions_log` | Intended: `user-content/{user_id}/cloud-snapshot/latest.json` | none before fix | `/__auth/bootstrap`, fallback direct DB fetch, then local trusted cache if offline | boot state only | DB is fetched, but Storage snapshot is never downloaded. The local `isotope_cloud_snapshot_*` name is misleading browser cache, not cloud truth. |
| Profile fields | Settings profile panel, onboarding profile inputs | `isotope_user_profile_v2`, UserStore persist | local backup JSON includes `data.profile` only | `user_profiles.profile_data`; `users.name`, `users.username`, `users.avatar_url` | Should be mirrored in `user-content/{user_id}/cloud-snapshot/latest.json` | served App bundle patches `pushProfile()` to `/__auth/profile`; route deep-merges profile JSON | `/__auth/bootstrap` hydrates profile before routing | sync engine `runSyncOperation` and Settings labels | Profile DB write exists, but no Storage snapshot follows. UI can still report synced after DB-only/manual sync success without proving snapshot upload. |
| Settings/preferences | Settings layout panels for academic, AI/setup, appearance, notification/privacy/collaboration preferences | Mostly `profile_data.settings`, `profile_data.preferences`, app-specific local stores | local backup JSON does not cover every profile_data setting distinctly | `user_profiles.profile_data` or `user_settings.settings` if present | Should be in cloud snapshot | `/__auth/profile` accepts `settings`, `preferences`, unknown profile fields and deep-ish merges selected objects | `/__auth/bootstrap` merges `profile_data` + `user_settings` into local cache | sync engine/Settings | Cloud DB target is mostly usable, but current copy text says local/manual backup and no Storage snapshot is created after confirmed save. |
| Avatar upload | Settings avatar upload input | `isotope_user_profile_v2.avatar`, `avatar_url`, `avatar_path` | local backup JSON may include data URL or URL from profile cache | `user_profiles.profile_data.avatar/avatar_url/avatar_path/avatar_bucket`; `users.avatar_url` | `avatars/{user_id}/...` | `/__auth/profile` -> `uploadAvatarDataUrlForUser()` | `/__auth/bootstrap` reads profile fields; public Storage URL used by UI/community | `/__auth/profile` response and local UserStore | Upload path is `avatar-${Date.now()}-${random}`, so same image creates repeated objects. No content hash/dedupe. No snapshot update. |
| Avatar remove | Settings avatar remove button | local avatar fields become null | local backup JSON follows cache | clears `user_profiles.profile_data` avatar fields and `users.avatar_url` | Should remove current `avatars/{user_id}/...` object if app owns it | `/__auth/profile` clear path | `/__auth/bootstrap` restores fallback | `/__auth/profile` response | DB clear exists, but old Storage object is not removed. |
| Onboarding completion | `Onboarding-qvAqCBbb.js` final step, patched by `server.mjs` | `isotope-onboarding`, `isotope_user_profile_v2` only after cloud success | local backup JSON profile may include onboarding fields | `user_onboarding.completed/completed_at/data`; `user_profiles.profile_data.isOnboarded/onboarding_completed` | Should be in cloud snapshot | `window.__isoCompleteOnboarding()` -> `/__auth/profile` | `/__auth/bootstrap` before routing | boot state + patched completion | DB verification exists, but no Storage snapshot update. |
| Product tours | Community group tour, `window.__isoPersistTour()` | `isotope-user-tours`, `group-ui-preferences` | local backup does not guarantee tours | `user_profiles.profile_data.tours` | Should be in cloud snapshot | injected helper posts `/__auth/profile` | `/__auth/bootstrap` hydrates tours | local UI state | Tour DB write is best-effort in helper; snapshot not updated unless profile endpoint adds it. |
| Manual Export JSON Backup | Settings `Data Export` button, `Nt()` / `Dn()` in `App-pJGjDiPw.js` | IndexedDB/local stores: profile, timerState, tasks, sessions, subjects, habits, dailyLogs, tests, exams, mockTests | Downloads JSON to device | none during export | Intended: `user-content/{user_id}/cloud-snapshot/latest.json` and history | none before fix | none | toast says exported | Export is local-only. `user-content` stays empty. |
| Manual Import JSON Backup | Settings import input, `vt()` / `Xr()` in `App-pJGjDiPw.js` | Merges/replaces local stores only | Reads local JSON backup | none during import unless user later manually syncs and tables exist | Intended: `user-content/{user_id}/imports/{timestamp}.json`, then latest snapshot | none before fix | local stores immediately appear | toast says imported | Import does not write Supabase immediately, so cache clear loses imported data if no later DB sync occurred. |
| Full manual cloud sync | Settings Sync & Backup button via sync engine | local stores and sync engine state | none | profile plus local tables (`tasks`, `subjects`, `focus_sessions`, `habits`, `exams`, `daily_logs`, `tests`, `mock_tests`) when tables exist | Intended: `user-content/{user_id}/cloud-snapshot/latest.json` | `syncEngine.fullManualSync()` pushes/pulls DB only | `pullCloudSnapshot()` is actually DB table pull, not Storage snapshot | sync engine status | Name is misleading. It never touches Storage snapshot, so `Synced` can mean DB-only or partial-table sync. |
| Focus session/stats | Focus session completion, `sessionSync-mloIEnTd.js` edge call | `isotope_sessions_v2`, pending queue | local backup JSON includes sessions | RPC `finish_session_sync` writes `study_sessions_log`, `daily_user_stats`, `user_stats_summary` | Should refresh latest snapshot after confirmed RPC | runtime fetch override maps `/functions/v1/finish-session` to RPC | `/__auth/bootstrap` fetches stats and recent sessions | session sync response and analytics/community queries | RPC path is real, but snapshot is stale after session. |
| Analytics | `/analytics` components | local sessions/stats caches plus boot stats caches | local backup JSON includes local sessions | DB stats from RPC | Should read snapshot only for recovery/offline display | indirect via focus session sync | `/__auth/bootstrap` writes `isotope_cloud_stats_summary`, daily stats, local sessions | local/store/query state | DB restore exists for recent stats, but no cloud snapshot proof and local sessions can still be displayed offline. |
| Community profile/avatar/stats | Community hub, group pages, leaderboard, presence | React Query, profile cache, presence payload cache | none | `users.avatar_url`, `user_profiles.profile_data`, `user_stats_summary`, `daily_user_stats`, group tables | avatar URL from `avatars`; snapshot only for recovery | profile endpoint and finish-session RPC | runtime leaderboard/group analytics fetch Supabase tables; bootstrap hydrates current user | query success/error | Main tables are real, but profile/avatar relies on profile DB fields. Snapshot not refreshed, so cloud recovery is incomplete. |
| Notifications | notification UI/store | `isotope-notifications` | local backup not canonical | `notifications` table exists with `read_at` | none | no connected write path found in served code | no connected download path found | local store | Authenticated notifications appear local-only unless a connected component path is later found and proven. |
| Notes/user content files | Notes/chapter assets if present | local chapter stores/files | local backup JSON may include text metadata only | relevant note/chapter tables if present | `notes/{user_id}/...`, `user-content/{user_id}/...` | no connected app-specific upload path found except planned snapshots/imports | no connected app-specific download path found | feature-specific local state | Buckets exist, but app-level note/user-content storage pipeline is not connected in current trace. |
| PWA/offline | cached shell, `public/pwa-local.js`, `public/sw.js` | service worker cache, local trusted snapshot cache | none | none while offline | none while offline | none | cached shell may open; API/Supabase unavailable | PWA status banner | Offline can use cached browser snapshot for display only. It must not claim cloud synced or force onboarding on unknown cloud state. |
| RLS/storage policies | SQL patch | none | none | own-row RLS for core tables | `avatars`, `user-content`, `notes` | Storage object policies | Storage object policies | Supabase enforcement | `avatars_user_write` is too broad. `user-content`/`notes` lack update/delete policies needed for `latest.json` overwrite and cleanup. |
| Admin diagnostics | `/__admin/verify` | none | none | checks schema/RPC/buckets | bucket existence/list checks | none | none | server self-report | Useful smoke check only. It cannot prove browser action -> Supabase -> cache clear -> restore. |

## Target Fix Surface

- `server.mjs`: deterministic avatar storage, Storage snapshot upload/download, profile/onboarding/snapshot/auth endpoints, runtime helper injection, finish-session snapshot refresh, served bundle patches for manual sync/export/import copy.
- `public/restore-and-launch.js`: consume real Storage-backed snapshot returned by bootstrap; keep local snapshot as cache only.
- `community-patch-v4.sql`: precise owner-folder storage policies for `avatars`, `user-content`, and `notes`, including update/delete.
- `SYNC_PROOF_CHECKLIST.md`: exact browser/Supabase/cache-clear proof matrix with unproven features marked `NOT FIXED`.

## Implementation Status

Code-level fixes are now implemented in `server.mjs`, `public/restore-and-launch.js`, and `community-patch-v4.sql`.

Implemented:

- Authenticated profile/onboarding/avatar writes refresh `user-content/{user_id}/cloud-snapshot/latest.json`.
- Avatar uploads use `avatars/{user_id}/avatar-{sha256}.{ext}` and same-image uploads dedupe by path.
- Avatar remove clears profile DB fields and deletes the owned Storage object.
- Login/bootstrap downloads the private Storage snapshot and uses it as recovery/hydration fallback without replacing DB data.
- Manual export uploads the raw backup under `user-content/{user_id}/exports/`, updates `exports/latest.json`, and refreshes canonical `latest.json`.
- Cloud Sync now generates the same full browser backup JSON with the compiled exporter and uploads it to `exports/latest.json` before showing synced.
- Cloud download imports `exports/latest.json` with the compiled importer when that full backup exists.
- Manual import stores the raw import under `user-content/{user_id}/imports/`, updates `imports/latest.json`, applies supported profile/settings/onboarding fields to Supabase, and refreshes `latest.json`.
- Focus session RPC success now also refreshes `latest.json`; snapshot failure keeps the session sync response failed.
- Settings `Synced` now requires successful snapshot metadata, not just local or DB-only sync state.
- Persisted auth refresh is allowed through server restart/page reload: the early auth guard no longer rejects an expired access token when a refresh token exists, and the served Supabase client has token auto-refresh enabled.
- Storage RLS policies now restrict write/update/delete to the authenticated user's own first path segment.

Still `NOT FIXED` until a real browser/Supabase proof run passes:

- Profile/settings, avatar, onboarding, stats, tour, export/import, offline, and status proof chains in `SYNC_PROOF_CHECKLIST.md`.
- Server-side import merge for local collection backup data (`tasks`, `subjects`, `focus_sessions`, `habits`, `exams`, `daily_logs`, `tests`, `mock_tests`) because `community-patch-v4.sql` does not define a canonical table mapping for those compiled local stores.
