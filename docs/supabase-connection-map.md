# Supabase Connection Map

This is the current audited connection summary for Supabase-backed features.

| Feature | UI/component | Frontend function/store | Local cache | Server endpoint | Supabase object | Auth type | Offline behavior | Sync behavior | Status | Fix/test required |
|---|---|---|---|---|---|---|---|---|---|---|
| Auth | `Auth-Cw0VAaCZ.js` patched by `server.mjs` | `window.__isoLogin`, `window.__isoUp` | Supabase session keys, `isotope-auth-token` | `/__auth/login`, `/__auth/signup` | `auth.users`, `public.users` | anon + user JWT | cached session restored | bootstrap after login | working | browser login smoke |
| Session restore | `restore-and-launch.js` | `findSessionRaw`, `fetchBootstrapFromServer` | `isotope-bootstrap-cache` | `/__auth/bootstrap` | `user_profiles`, `user_onboarding`, Storage backup summary | user JWT | cached bootstrap fallback | recommends restore when rich backup exists | partial | browser proof |
| Onboarding | `Onboarding-qvAqCBbb.js` patched | `__isoCompleteOnboarding` | `isotope-onboarding` | `/__auth/profile` | `user_onboarding`, `user_profiles` | user JWT | local cache | profile patch | working | E2E |
| Profile save | Settings/Profile bundles | `__isoPostProfile` | `isotope_user_profile_v2` | `/__auth/profile` | `user_profiles`, `users` | user JWT | local profile remains | profile DB patch | working | avatar/profile test |
| Avatar upload/delete | Settings patched by `server.mjs` | profile save with data URL/null | `isotope_user_profile_v2` | `/__auth/profile` | `avatars` bucket | user JWT | local avatar remains | upload/delete own path | partial | duplicate cleanup proof |
| Settings/theme | Settings bundle | profile/settings store | `isotope_user_profile_v2` | `/__auth/profile` | `user_profiles.profile_data`, `user_settings` | user JWT | local-first | profile patch | partial | schema/store test |
| Focus completion | Focus/session bundles | `sessionSync-mloIEnTd.js` patched | `isotope_sessions_v2`, IndexedDB `sessions` | Supabase proxy/RPC | `finish_session_sync`, `study_sessions_log`, stats tables | user JWT | pending queue local | RPC updates stats | partial | session completion E2E |
| Daily stats | Analytics bundles | local analytics stores | `isotope_daily_logs_v2`, cloud stats cache | `/__auth/bootstrap`, RPC | `daily_user_stats` | user JWT | local analytics | bootstrap + RPC | partial | stats reconciliation |
| Tasks | Tasks bundle/store | local DB store | IndexedDB `tasks`, `isotope_tasks_v2` | Storage backup | `user-content` backup JSON | user JWT | local-first | canonical backup | working for backup | UI restore proof |
| Subjects/chapters/topics | Syllabus/store | local DB store | IndexedDB `subjects`, `isotope_subjects_v2` | Storage backup | `user-content` backup JSON | user JWT | local-first | canonical backup | working for backup | UI restore proof |
| Timer state | Focus store | timer persistence | IndexedDB `timerState`, `isotope_timer_state` | Storage backup | `user-content` backup JSON | user JWT | local-first | canonical backup | working for backup | timer restore test |
| Habits | Habits/analytics store | local DB store | IndexedDB `habits`, `isotope_habits_v2` | Storage backup | `user-content` backup JSON | user JWT | local-first | canonical backup | working for backup | UI restore proof |
| Exams/tests/mock tests | Exams/test stores | local DB store | IndexedDB `exams/tests/mockTests` | Storage backup | `user-content` backup JSON | user JWT | local-first | canonical backup | working for backup | UI restore proof |
| Backup export | Settings | `__isoUploadBackupJSON` | full local backup | `/__auth/backup` | `user-content/backups/*` | user JWT | export file local | uploads canonical if safe | fixed | `prove-new-browser-restore` |
| Backup import | Settings | `__isoImportBackupJSON` | local adapter/compiled importer | `/__auth/import` | `imports/*`, `backups/*`, `cloud-snapshot/latest` | user JWT | local import first | promotes canonical | fixed | import test |
| Smart sync | Settings/useSyncStore | `__isoRunManualCloudSync` | `isotope_sync_metadata` | `/__auth/backup/best`, `/__auth/restore-best-backup`, `/__auth/backup` | Storage backups | user JWT | skips offline | restore-first then upload | fixed for overwrite | browser proof |
| Cloud snapshot | app/auth script | `__isoRefreshCloudSnapshot` | cloud snapshot cache | `/__auth/snapshot` | `cloud-snapshot/latest.json` | user JWT | pending | blocked if empty would overwrite rich | fixed | endpoint test |
| Storage cleanup | Admin/settings endpoint | cleanup buttons pending UI | none | `/__auth/storage/cleanup-*`, `/__admin/storage` | Storage objects | user JWT/admin service | no-op offline | preview/apply | partial | apply safe test |
| Groups/community | Community bundles | group hooks | group cache | `/__supa/*`, RPCs | `groups`, `group_members`, chat/invites/challenges | user JWT/service proxy in admin mode | online-required | Supabase realtime/REST | untested in this pass | Phase 19 full matrix |
| Notifications | notification store | Supabase/local store | `useNotificationStore` | `/__supa/*` | `notifications` | user JWT | local cache | REST/realtime | untested | notification test |
| Admin verify/patch/roles | `/__admin/*` | server HTML | none | admin routes | service role/management API | admin secret/service | unavailable offline | direct admin ops | working existing | admin smoke |
| Admin sync/storage | `/__admin/sync`, `/__admin/storage` | server HTML | none | admin routes | Storage backups | service role | unavailable offline | inspect/repair/cleanup | added | repair dry/apply |
| GitHub update check | update checker | browser fetch | none | `/api/check-update` | GitHub API | none/PAT server env | skips offline | no Supabase | local_only_intentional: true | smoke |
| Install/update scripts | shell scripts | CLI | `.isotope` files | none | optional Supabase env | local shell | local | no app sync | local_only_intentional: true | bash -n |

## Required Supabase Objects

Tables/RPCs/buckets are defined in:

- `isotope-complete.sql`
- current idempotent migrations in `sql/`
- `sql/backup_manifests.sql`
- `sql/verify-security.sql`

Run order for fresh setup:

1. `isotope-complete.sql`
2. Optional compatibility migrations in `sql/` only if upgrading an older install
3. `sql/verify-security.sql` for verification queries

`isotope-complete.sql` now includes `sync_items` and `backup_manifests` for fresh installs.
