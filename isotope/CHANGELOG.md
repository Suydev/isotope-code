# Changelog — IsotopeAI Self-Hosted

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [3.3.7] — 2026-06-08 — Fix: auth-gated sync state machine; stop infinite retry on auth failure

### Fixed (sync state machine — complete rebuild)

- **Auth failure is now a STOP condition, not a retry condition** — Previously any auth error (expired session, no session, 401) caused the sync to be written as `failed` and retried on the next timer tick, visibility change, or online event. The same 2009 KB payload would upload infinitely. Now any auth error immediately sets `__isoSyncAuthBlocked = true` and the entire sync pipeline halts.
- **New `isAuthError` / `isPermissionError` / `isNetworkError` classifiers** — Errors are classified before deciding to stop vs. retry. Network errors still retry; auth and permission errors do not.
- **`authedJson` now throws tagged `AuthError` objects** — When JWT is null or refresh fails, the thrown `Error` has `__isAuthError = true`. When the server returns 401/auth message, the thrown error is also tagged. All callers can now distinguish the error type.
- **30-min timer stops on auth failure, restarts on recovery** — `__isoSyncAuthBlock()` calls `clearInterval(_autoSyncTimer)`. `__isoSyncAuthUnblock()` restarts it and schedules one sync attempt.
- **All sync triggers check auth-blocked state** — `__isoAutoSync`, `__isoStartupSync`, the 30-min timer interval, the visibility-change handler, and the online-event handler all check `window.__isoSyncAuthBlocked` and return `{ reason: 'paused_auth' }` without running any upload/download.
- **Token intercept unblocks sync on new valid session** — When Supabase returns a new `access_token` (login, token refresh), the fetch interceptor calls `window.__isoSyncAuthUnblock()`, which clears the blocked flag, restarts the timer, and queues one sync attempt 2 s later.
- **Login (`__isoLogin`) unblocks sync on success** — After a successful username/password login and profile sync, `__isoSyncAuthUnblock()` is called so sync resumes without waiting for the next Supabase token intercept.
- **Online event re-validates session before unblocking** — When the network comes back and `__isoSyncAuthBlocked` is true, the handler calls `getValidJwt()` first; if a valid JWT exists, it unblocks and syncs. It does not blindly retry the upload.
- **Smart-sync catch re-throws auth errors** — The `try/catch` around `/__auth/backup/latest` in `__isoRunManualCloudSync` previously swallowed all errors as "non-fatal". Now auth errors are rethrown so they propagate to the outer catch and trigger the block.
- **Permission errors get a distinct `failed_permission` status** — These are written to sync metadata and history separately; they never trigger a retry.
- **All sync operations (`snapshot`, `upload`, `download_import`, `manual_sync`) handle auth errors uniformly** — Each catch block calls `__isoSyncAuthBlock()` and writes `paused_auth` to sync history instead of `failed`.

### Audit (v3.3.7 — 2026-06-08)

| # | Check | Result |
|---|-------|--------|
| 1 | Auth failure stops all scheduled sync | ✅ fixed |
| 2 | Same payload never uploads infinitely on auth error | ✅ fixed |
| 3 | 30-min timer cleared on auth failure | ✅ fixed |
| 4 | Timer restarted on new valid session | ✅ fixed |
| 5 | All sync triggers check `__isoSyncAuthBlocked` | ✅ fixed |
| 6 | Token intercept calls `__isoSyncAuthUnblock()` | ✅ fixed |
| 7 | Login success calls `__isoSyncAuthUnblock()` | ✅ fixed |
| 8 | Auth vs network vs permission errors classified | ✅ fixed |
| 9 | Smart-sync auth errors propagate instead of being swallowed | ✅ fixed |

---

## [3.3.6] — 2026-06-08 — Fix: cloud sync download on new device; storage cleanup; setup improvements

### Fixed

- **CRITICAL: Cloud backup never downloaded on new/different device** — `GET /__auth/backup/latest` returned the backup JSON but omitted the `cloud_snapshot` field when serving from the `exports/latest.json` path (the primary path). The client smart-sync reads `cloudData.cloud_snapshot.exported_at` to compute `cloudTs`. Without it, `cloudTs = 0` so the `cloudIsNewer` check (`!localTs && cloudTs > 0`) was always `false` on a new device — the cloud backup was fetched but never applied. Fix: the endpoint now also fetches `cloud-snapshot/latest.json` and includes it in the response on every path.
- **CRITICAL: Download skipped on startup (timing race)** — `window.__isoBuildBackup` and `window.__isoApplyBackup` are registered by the app bundle's internal sync method, which fires asynchronously after React initialises. The startup sync (previously 5 s after page load) frequently fired before these were set, falling back to an upload-only snapshot and never downloading cloud data. Fix: startup delay increased to 8 s; `__isoAutoSync` now polls for the functions for up to 15 additional seconds before falling back, giving the app enough time to register them.
- **First-sync debounce blocks retry** — If the startup sync fell back to upload-only on a new device (no download), the 5-minute debounce was already written, preventing retry on the next page load. Fix: when a first-sync (no local snapshot history) completes without a download, the debounce timestamp is cleared so the next page load retries.
- **New-device fallback bootstraps from cloud** — In the upload-only fallback path, if the device has no local sync history, the server now calls `/__auth/bootstrap` first to restore the cloud snapshot into Supabase DB before uploading a snapshot. This ensures the snapshot reflects actual cloud state even when build/apply fns were never registered.

### Fixed (storage)

- **Old cloud backup files accumulating in Storage** — `uploadRawUserBackupJson` wrote a new timestamped file (`{userId}/exports/YYYY-MM-DD....json`) on every upload but never deleted old ones. Fixed: after each upload, old timestamped files in the same folder are pruned in the background, keeping only the 3 most recent.
- **Cloud snapshot history files accumulating** — `uploadCloudSnapshotForUser` wrote history snapshots (`{userId}/cloud-snapshot/history/....json`) that were never cleaned up. Fixed: after each history write, files are pruned keeping only the 5 most recent.
- **New `supaStorageListAsUser` helper** — Implements `POST /storage/v1/object/list/{bucket}` using user-scoped JWT + anon key, used by the new pruning logic.

### Improved (setup)

- **`setup.sh` installs Node.js 18+ on Debian/Ubuntu via NodeSource** — Previously used `apt-get install nodejs` which installs the distro-packaged version (often v12). Now checks the installed version first; if < 18, fetches the NodeSource v22 setup script and uses that, falling back to `nvm` or a clear error.
- **`setup.sh` works non-interactively** — `--yes` / `-y` flag and piped stdin now skip all prompts reliably.

### Audit (v3.3.6 — 2026-06-08)

| # | Check | Result |
|---|-------|--------|
| 1 | `cloud_snapshot` included in all `/__auth/backup/latest` responses | ✅ fixed |
| 2 | Startup sync polls up to 15 s for build/apply fns before fallback | ✅ fixed |
| 3 | First-sync debounce cleared when download didn't happen | ✅ fixed |
| 4 | Fallback path calls `/__auth/bootstrap` on new device | ✅ fixed |
| 5 | Old export files pruned after upload (keep 3) | ✅ fixed |
| 6 | Old snapshot history files pruned after upload (keep 5) | ✅ fixed |
| 7 | `supaStorageListAsUser` helper implemented | ✅ added |

---

## [3.3.5] — 2026-06-07 — Performance: speed probe fixed, health cache, pre-gzip bundles, 14 DB indexes

### Fixed
- **CRITICAL: `/api/health?_=<timestamp>` speed probe returned HTTP 404** — The network speed probe fired by the app at every session used a cache-busting query-string (`?_=Date.now()`). The API health handler matched `req.url === '/api/health'` (exact string), so any request with a query string silently fell through to the `/api/*` 404 fence added in v3.3.4. The speed probe received `{"ok":false,"error":"Not found"}` (34 B) instead of the ~230 B health payload, making the sync timeout calculator classify every user as "slow" (150 s timeout). Fixed: all `/api/*` route handlers now match `adminPath` (the URL parsed without query string) instead of the raw `req.url`.
- **Same query-string fallthrough for `/api/version`, `/api/check-update`, `/api/ai-config`** — All four API route handlers were patched from `req.url ===` to `adminPath ===`.

### Performance
- **Health endpoint caching (15 s TTL)** — `/api/health` previously made 3 concurrent Supabase HTTP round-trips on every call (REST, Auth, Storage), taking 200–600 ms. Results are now cached for 15 seconds; subsequent calls return in <1 ms. The cache is only populated on a successful `ok` response so degraded states still probe live.
- **Pre-gzip bundle cache** — 10 major JS bundles (App, Auth, Focus, Onboarding, SingleGroup, Leaderboard, Settings, AppAccessGate, SessionSync, Invites) are gzip-compressed once at server startup and stored in memory (`_gzipCache`). All subsequent requests for these assets skip the per-request `zlib.gzip()` call and serve the cached compressed buffer instantly. For all other hashed immutable assets and SW files, the first gzip result is also cached.
- **14 missing database indexes added** (`performance-indexes.sql`) — Static schema analysis found 14 unindexed foreign-key and date-ordering columns:
  - `community_events(creator_id)`, `community_events(host_user_id)` — FK columns never indexed
  - `community_events(created_at)`, `community_events(updated_at)` — date ordering
  - `user_tours(user_id)` — FK for guided-tour lookups per user
  - `user_tours(created_at)`, `user_tours(updated_at)` — date ordering
  - `user_roles(granted_by)` — FK for admin audit queries
  - `group_invites(created_at)` — expiry + ordering queries
  - `group_challenges(created_at)` — ordering
  - `groups(created_at)`, `groups(updated_at)` — ordering
  - `users(updated_at)` — profile sync delta queries
  - Apply via: `Supabase Dashboard → SQL Editor → run performance-indexes.sql`

### Added
- **`performance-indexes.sql`** — New file containing all 14 `CREATE INDEX IF NOT EXISTS` statements. Idempotent and safe to run multiple times. Referenced from admin panel setup guide.

### Audit (v3.3.5 — 2026-06-07)

| # | Check | Result |
|---|-------|--------|
| 1 | `/api/health?_=timestamp` speed probe now returns 200 JSON | ✅ fixed (`adminPath` match) |
| 2 | `/api/version`, `/api/check-update`, `/api/ai-config` same fix | ✅ all 4 handlers patched |
| 3 | Health endpoint cached at 15 s TTL | ✅ <1 ms on cache hit |
| 4 | 10 bundles pre-gzip'd at startup | ✅ `_gzipCache` Map |
| 5 | 14 missing indexes documented in `performance-indexes.sql` | ✅ new file |
| 6 | All changes pushed to GitHub | ✅ |

---

## [3.3.4] — 2026-06-07 — YepAPI removed; security headers; syntax fix; API 404s; SW cache

### Fixed
- **`SyntaxError: Malformed arrow function`** — `|| async () =>` in Upload-only sync patch was invalid syntax; changed to `|| (async () => ...)`.
- **YepAPI removed entirely** — `handleAiRoute()` and all `/__ai/*` dispatch deleted; those routes return `{"ok":false,"error":"Not found"}`.
- **Unknown `/api/*` routes returned HTTP 200 with SPA HTML** — Now returns `{"ok":false,"error":"Not found"}` with HTTP 404.
- **Security headers missing** — Added `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `X-XSS-Protection`, `Referrer-Policy`.
- **`Access-Control-Allow-Methods` missing `PATCH` and `DELETE`** — Fixed.
- **`sw.js` and `pwa-local.js` cached for 1 hour** — Now served with `Cache-Control: no-cache`.
- **`/__auth/backup` POST returned empty body without auth** — Now returns HTTP 401 JSON.
- **`backup.json` and `firebase-messaging-sw.js` served publicly** — Both blocked with HTTP 404.

---

## [3.3.3] — 2026-06-07 — Admin role check bug fixed; 8 undocumented DB functions added to schema

### Fixed
- **`user_roles.is_active` does not exist — admin auth always failed silently** — `isSupabaseAdminUser()` in `server.mjs` filtered `user_roles` with `&is_active=eq.true`. The live `user_roles` table has no `is_active` column (`id, user_id, role, granted_by, granted_at` only), so Supabase returned a 400 and every role-based admin check returned `false`. Any admin user whose email was not in `ADMIN_EMAILS` could never unlock `/__admin/*`. Removed the non-existent filter — the query now reads `?select=role&user_id=eq.{id}&limit=10`.
- **8 live-DB functions missing from `isotope-complete.sql`** — Full pg_proc audit found 8 functions present in the live Supabase DB that were never documented in the master schema file. A fresh install using only `isotope-complete.sql` would be missing critical triggers. All 8 added as §18 (fully idempotent with `CREATE OR REPLACE` + `DROP TRIGGER IF EXISTS`):
  - `handle_new_user_profile()` + `trg_handle_new_user_profile` (AFTER INSERT on auth.users)
  - `rls_auto_enable()` + event trigger (auto-enables RLS on every new public table)
  - `set_group_slug_from_name()` + `trg_set_group_slug` (BEFORE INSERT on groups)
  - `sync_group_visibility()` + `trg_sync_group_visibility` (BEFORE INSERT/UPDATE on groups)
  - `sync_group_member_count()` + `trg_sync_member_count` (AFTER INSERT/DELETE on group_members)
  - `create_community_group(...)` — RPC for atomic group creation with owner seeding
  - `check_user_role(uuid, text)` — boolean role membership check
  - `get_my_role()` — returns highest-priority role for calling user
- **Missing GRANTs for `create_community_group`, `check_user_role`, `get_my_role`** — All three functions had no `GRANT EXECUTE TO authenticated`. Applied to live DB and added to §18 grants block in `isotope-complete.sql`.

### Audit (v3.3.3 — 2026-06-07)

| # | Check | Result |
|---|-------|--------|
| 1 | `user_roles.is_active` filter removed from `isSupabaseAdminUser()` | ✅ server.mjs line 265 |
| 2 | 8 undocumented functions added to `isotope-complete.sql` §18 | ✅ with triggers + grants |
| 3 | `create_community_group` GRANT authenticated applied to live DB | ✅ |
| 4 | `check_user_role` + `get_my_role` GRANTs applied to live DB | ✅ |
| 5 | Store + Events features confirmed removed — RPCs not added to schema | ✅ |

---

## [3.3.2] — 2026-06-07 — user_tours table added; /__admin/schema fixed; schema gap audit

### Fixed
- **`user_tours` table missing from `isotope-complete.sql` and live DB** — Parallel subagent audit found `community-patch-v4.sql` §v11 (lines 2327–2367) defines `public.user_tours` (persistent tour/guide state: which onboarding walks a user completed or dismissed) but it was never included in the master schema file. Table created in live DB via Management API (HTTP 201). Added to `isotope-complete.sql` as §13b with full DDL, RLS policy (`user_tours_own`), auto-update trigger, and Realtime publication.
- **`/__admin/schema` served missing `isotope-schema.sql` file** — Route handler at `server.mjs:5584` referenced `isotope-schema.sql` (an old/nonexistent file), causing the download button in the admin panel to return HTTP 500. Fixed to serve `isotope-complete.sql` (the current authoritative master schema) with a matching `Content-Disposition` filename.

### Audit (v3.3.2 — 2026-06-07)

| # | Check | Result |
|---|-------|--------|
| 1 | `user_tours` created in live DB | ✅ HTTP 201 via Management API |
| 2 | `user_tours` added to `isotope-complete.sql` §13b | ✅ DDL + RLS + trigger + realtime |
| 3 | `/__admin/schema` now serves correct file | ✅ `isotope-complete.sql` (was broken `isotope-schema.sql`) |
| 4 | All 24 tables now in master schema | ✅ isotope-complete.sql updated |
| 5 | All changes pushed to GitHub | ✅ |

---

## [3.3.1] — 2026-06-07 — Master schema SQL + missing tables applied to live DB

  ### Fixed
  - **CRITICAL: `user_inventory`, `store_items`, `community_events`, `community_event_attendees` tables missing from live DB** — Zero-trust audit found the frontend calls 5× `user_inventory` and 2× `store_items` but neither table existed. Root cause: `events-expansion.sql` (a teardown script) includes `DROP TABLE IF EXISTS public.user_inventory CASCADE` and `DROP TABLE IF EXISTS public.store_items CASCADE`. All 4 missing tables have been created in the live Supabase DB via the Management API with full column definitions, indexes, and RLS policies.
  - **`performance-patch.sql` §2 `idx_inventory_user` crashes if `user_inventory` was dropped** — The index creation was not guarded. Wrapped in `DO $ BEGIN IF EXISTS (table check) THEN CREATE INDEX …; END IF; END $;`. Also guarded the §5 `inventory_own` RLS policy recreation the same way.

  ### Added
  - **`isotope-complete.sql`** — New single-file authoritative schema covering all 23 tables, all indexes, all RLS policies (with `(SELECT auth.uid())` optimisation), all RPCs (18 functions), triggers (`handle_new_user`, `sync_user_onboarding_from_profile`, `cleanup_old_notifications`), storage buckets, Realtime publication, and default community event seed data. Fully idempotent. Run this once on a fresh Supabase project, then `performance-patch.sql` for the §6 leaderboard policies.

  ### Audit (v3.3.1 — 2026-06-07)

  | # | Check | Result |
  |---|-------|--------|
  | 1 | `user_inventory` created in live DB | ✅ HTTP 201 via Management API |
  | 2 | `store_items` created in live DB | ✅ HTTP 201 via Management API |
  | 3 | `community_events` created in live DB | ✅ HTTP 201 via Management API |
  | 4 | `community_event_attendees` created in live DB | ✅ HTTP 201 via Management API |
  | 5 | RLS policies for all 4 tables | ✅ Applied in same batch |
  | 6 | `performance-patch.sql` index guard | ✅ user_inventory index wrapped in existence check |
  | 7 | `isotope-complete.sql` pushed to GitHub | ✅ New file, 23 tables, 18 RPCs |

  ---

  ## [3.3.0] — 2026-06-07 — Live DB RLS patch, GitHub Pages docs link, login error improvements

### Fixed
- **§5+§6 RLS policies applied to live Supabase DB** — `performance-patch.sql` §5 (own-row `(SELECT auth.uid())` optimisation) and §6 (leaderboard `stats_select_all`, `daily_select_all`, `users_select_display` public-read policies) were not applied to the live database. Applied all 6 batches via the Supabase Management API. Leaderboard queries now work correctly for authenticated users and all RLS policies use the single-evaluation `(SELECT auth.uid())` pattern.
- **Improved login error messages** (`server.mjs` `/__auth/login`) — Login failures now surface the specific Supabase error: "email not confirmed" shows a confirmation-link hint; "invalid credentials" shows a clear message directing users to use their Supabase-registered email and password. Previously all failures returned the generic "Invalid email or password" with no context.

### Added
- **GitHub Pages docs link in login screen** (`server.mjs` `DOCS_LINK_HTML`) — A `📖 Docs` badge is injected into every served HTML page (including the unauthenticated login screen) linking to `https://suydev.github.io/isotope-code/`. The badge floats in the bottom-right corner and is non-intrusive.
- **GitHub Pages link in README** — Logo in README header now links to GitHub Pages; a Docs badge and nav link added to the header; footer updated with Documentation link.
- **GitHub Pages docs updated** (`docs/index.md`) — Added v3.3.0 changelog section, GitHub Pages self-link, repository link, and updated version footer.

### Changed
- `VERSION` bumped to `3.3.0`.
- `package.json` version bumped to `3.3.0`.
- `README.md` version badge updated to `3.3.0`.

### Audit (v3.3.0 release pass — 2026-06-07)

| # | Check | Result |
|---|-------|--------|
| 1 | Total assets scanned | 211 (191 non-font) |
| 2 | `/api/broadcast` in vendor-supabase bundle | ✅ Supabase realtime internal — not a server route |
| 3 | All `/__auth/*` endpoints exist in server.mjs | ✅ login, signup, backup, backup/latest, snapshot, profile, refresh, delete-account |
| 4 | All `/api/*` endpoints exist in server.mjs | ✅ version, healthz, status, config, export, ai/*, pwa-events, proxy |
| 5 | §5 own-row RLS policies applied to live DB | ✅ Applied via Management API (6 batches, all 201) |
| 6 | §6 leaderboard public-read policies applied | ✅ stats_select_all, daily_select_all, users_select_display |
| 7 | Missing tables (user_inventory, community_events) | ℹ️ Not in live DB schema — SQL skipped safely |
| 8 | Login error messages improved | ✅ email-not-confirmed hint + invalid-credentials hint |
| 9 | GitHub Pages link injected into login screen | ✅ DOCS_LINK_HTML appended before </body> |
| 10 | README GitHub Pages link added | ✅ Logo, badge, nav, footer |
| 11 | docs/index.md updated to v3.3.0 | ✅ |

---

## [3.2.0] — 2026-06-07 — Leaderboard RLS fix and SQL index correction

### Fixed
- **Leaderboard returns 0 rows (critical)** — The §5 RLS hardening added "own row only" policies to `user_stats_summary`, `daily_user_stats`, and `users`. The leaderboard interceptor used the ANON key (no `auth.uid()`) so every query returned 0 rows and the leaderboard appeared empty for all users. Fixed by:
  - `performance-patch.sql §6`: added `stats_select_all` (FOR SELECT, authenticated users only), `daily_select_all` (FOR SELECT, authenticated users only), and `users_select_display` (FOR SELECT, all — name/avatar are public display data) policies.
  - `server.mjs` `_handleLeaderboard`: all 5 REST queries (global `user_stats_summary`, daily `daily_user_stats`, group members, group `user_stats_summary`, `users` batch-fetch) now pass `_lbJwt || ANON` as the Bearer token instead of bare ANON. Users who are not logged in cannot see the leaderboard; logged-in users see full rankings.
- **Broken SQL index column** (`performance-patch.sql §4`) — `idx_daily_user_date_minutes` was created with `INCLUDE (study_minutes)` but the column is named `seconds_studied`. The index creation silently failed on every fresh install. Corrected to `INCLUDE (seconds_studied)`.

### Changed
- `VERSION` bumped to `3.2.0`.
- `package.json` version bumped to `3.2.0`.
- `README.md` version badge updated to `3.2.0`.
- `docs/index.md` version footer updated to `3.2.0`.
- `.replit-artifact/artifact.toml` — corrected development `run` path from `artifacts/isotope` to `isotope`.

### Verified (release pass — 2026-06-07)
The following items were code-reviewed and live-tested against the running server. Items marked ⚠️ require a live Supabase instance to fully exercise and could not be end-to-end tested in the build environment.

| # | Check | Result |
|---|-------|--------|
| 1 | Server boots cleanly | ✅ All 49 startup log lines clean; all patch groups reported 100% applied |
| 2 | Cloud sync flow | ⚠️ Code-reviewed: `/__auth/snapshot` → `refreshCloudSnapshotForUser` → Storage upload; fallback chain in `/__auth/backup/latest` correct |
| 3 | Onboarding — new vs existing user | ✅ `onboarding_completed` checked at login; `AUTH_GUARD_SCRIPT` gates routing; `OnboardingPatch` requires verified Supabase write |
| 4 | Profile/settings restore | ✅ `/__auth/bootstrap` fetches profile + stats + groups; settings bundle patched (12/12) |
| 5 | Avatar upload/download/dedupe | ✅ SHA-256 hash → `{userId}/avatar-{hash}.{ext}`; `upsert: false` + `isStorageAlreadyExists` guard; old path deleted on replace |
| 6 | Study stats — Analytics vs Leaderboard | ✅ Analytics = local IndexedDB (analyticsWorker); Leaderboard = `user_stats_summary` via Supabase REST + JWT. Both written by `finish_session_sync` RPC — consistent source |
| 7 | Offline PWA — no reload loop | ✅ `RELOAD_GUARD_SCRIPT` injected; blocks if `navigator.onLine===false`; blocks repeat reloads via `sessionStorage` key |
| 8 | Update banner — hidden when latest | ✅ `/api/check-update` live: `hasUpdate: false`, `deployed_version: "3.2.0"`, `latest_version: "3.2.0"` |
| 9 | Setup scripts syntax | ✅ `bash -n setup.sh` passes; `setup.bat`, `update.bat` present and reviewed |
| 10 | No secrets staged or committed | ✅ `.env` not tracked; `.gitignore` covers `.env*`; full git history grep found no embedded keys |
| 11 | HTTP 200 from app root | ✅ `curl -I localhost:24099/` → `200 OK` |
| 12 | `/__auth/check` POST | ✅ Returns `{"available":false,"error":"Valid email address required"}` — endpoint live and correct |
| 13 | LICENSE | ✅ MIT license file present |
| 14 | `.env.example` | ✅ All required + optional + owner-only vars documented; blanks only; `Never commit .env` note included |

---

## [3.1.3] — 2026-06-07 — Performance hardening and professional release

### Added
- `.env.example` — required template for first-time setup; `setup.sh` and `setup.bat` now copy it correctly without erroring on a missing file.
- `update.bat` — Windows update shortcut that delegates to `isotope update` or the local wrapper.
- `performance-patch.sql` §5 — Supabase Advisor: all RLS policies upgraded from `auth.uid()` to `(SELECT auth.uid())`, eliminating per-row function re-evaluation. Also replaces `auth.role() = 'authenticated'` with the safer `(SELECT auth.uid()) IS NOT NULL` pattern in the presence policy.
- `performance-patch.sql` get_my_group_ids() — the security-definer helper function now uses `(SELECT auth.uid())` internally.

### Fixed
- `public/pwa-local.js` — replaced aggressive 10-second `setInterval` server poll with a visibility-change listener and a 5-minute background keepalive. Eliminates unnecessary `/api/version` requests while the app is actively in use.
- RLS policies — all 20+ policies across users, profiles, stats, sessions, presence, groups, chat, challenges, invites, and announcements now use the optimised `(SELECT auth.uid())` pattern.

### Changed
- `VERSION` bumped to `3.1.3`.
- `package.json` version bumped to `3.1.3`.
- `README.md` version badge updated to `3.1.3`.

---

## [Unreleased] — 2026-06-05 — PR #1 local-server cherry-picks

### Changed
- Closed the Replit QA pull request without merging its Vite/workspace `package.json` rewrite.
- Kept the root package as a zero-dependency local-server package where `npm start` runs `node server.mjs`.
- `isotope doctor` now reports whether the global `isotope` command is available in `PATH`.
- `isotope open` and the Windows `open` command now warn when the managed local server is not responding before opening the browser.
- Termux Widget shortcuts now prefer the absolute Termux `isotope` command path and fall back to the project-local wrapper when needed.

### Fixed
- Added a serve-time PWA manager patch so service-worker activation reloads go through a one-shot reload guard.
- `/api/version` now reports the cache name format used by `public/sw.js`.
- `/api/check-update` now prefers semantic version comparison and only falls back to Git SHA comparison when no version can be inferred.
- The update checker clears stale dismissed-banner state when the server reports `hasUpdate=false`.
- Direct visits to `/login`, `/signup`, and `/reset-password` redirect to the SPA auth shell at `/`.
- The served auth bundle patches the stale landing badge from `IsotopeAI v2.0` to `IsotopeAI v3.1`.

## [3.1.0] — 2026-06-05 — Local server PWA and command system

### Added
- Added global `isotope` command wrappers for Bash and Windows with `start`, `stop`, `restart`, `update`, `status`, `doctor`, `open`, and `logs`.
- Added managed local PID/log state under `~/.isotope`.
- Added Termux Widget shortcut installer and Android home-screen shortcut documentation.
- Added service worker app-shell/runtime caching, offline fallback page, local PWA registration, and offline/local-server status UI.

### Changed
- Reframed docs and architecture notes around the downloadable local-server model.
- Documented Supabase as backend/cloud sync only, not static frontend hosting or a VPS replacement.
- Reworked setup/update scripts to install the global command, preserve `.env`, and keep admin fields private.
- `/api/version` now reports package version and the real local Git SHA when available.

### Fixed
- The update banner now opens a command dialog showing `isotope update`; it no longer stops or restarts the server from the browser.
- `/api/restart` is now a legacy no-op response and cannot terminate the local process.
- Update checks compare GitHub `main` with the local version/SHA so the banner disappears after a real update.

## [3.0.0] — 2026-06-05 — Professional core app cleanup

### Removed
- Removed Events and Store from the served Community UI through deterministic serve-time bundle patches.
- Disabled `/api/community-events`, `/api/events/*`, and `/__admin/events*` runtime surfaces.
- Updated Supabase patches to drop Events and Store tables, views, RPCs, policies, and the `event-images` bucket.

### Changed
- Admin verification now checks the remaining core app surface instead of expecting removed Events/Store objects.
- Public README and docs now describe the streamlined local study app with community groups, storage, leaderboards, and realtime sync.

## [2.9.0] — 2026-06-04 — Local software distribution release

### Added
- Default public Isotope Supabase URL and anon key for normal installs, so downloaded copies can connect to shared cloud sync without owner/admin secrets.
- Smarter first-run installers for Bash, Windows batch, and PowerShell that detect the environment, attempt Node/Git setup where possible, create `.env`, validate the server, and start the local app.
- Safer update scripts that preserve `.env`, stash local changes automatically, refresh dependencies, and explain restart steps.
- Runtime missing JS asset recovery from upstream `/assets/<file>.js` sources with safe filename validation and local caching.
- Refreshed GitHub Pages documentation for the local software model.

### Changed
- README and Pages now describe IsotopeAI as portable local software with Supabase cloud sync, not a hosted website or VPS deployment.
- Owner/admin mode remains optional; service-role keys, admin secrets, Supabase management tokens, and GitHub PATs stay blank by default and private.
- Package version updated to `2.9.0`.

### Security
- Repository history was reset to a sanitized root commit before this release.
- Removed old local-runtime provider references from tracked documentation.

### Verified
- Supabase Auth, REST, profile, onboarding, and community event endpoints are reachable.
- Storage buckets `avatars`, `event-images`, `user-content`, and `notes` exist.
- Upload, download, signed URL, and cleanup operations pass for all four storage buckets.

## [2.8.2] — 2026-06-04 — Community loading, event data, and local cache fixes

### Fixed
- `/api/community-events` now returns the exact array shape expected by the EventsCalendar widget, preventing invalid-data crashes when Supabase rows are raw or unavailable.
- Removed the hardcoded “Global Study Marathon 2025” featured event copy from the tracked EventsCalendar bundle.
- Startup routing now keeps returning onboarded users on the dashboard when Supabase is temporarily slow/offline instead of forcing onboarding again.
- Demo mode is cleared outside `/demo`, reducing accidental demo community/event data leakage.
- Local study workspace data is isolated per authenticated user and stale global IndexedDB stores are cleared on user switches.
- Service worker runtime caches are smaller, old runtime caches are deleted on activation, and `/sounds/` is no longer cached to avoid large mobile cache growth.

### Added
- GitHub Pages deployment workflow for the `docs/` site.
- Browser admin unlock via `/__admin/login`, supporting either `ADMIN_SECRET` or a logged-in Supabase account listed in `ADMIN_EMAIL`/`ADMIN_EMAILS` or `user_roles`.

## [2.8.1] — 2026-06-04 — Stabilization: startup, security boundary, onboarding, events

### Fixed
- `node server.mjs` now loads `.env` safely without requiring `--env-file`; `node --env-file=.env server.mjs` still works and environment values keep precedence.
- Removed committed Supabase service-role JWT material from `server.mjs` and the built App bundle.
- Browser bundles now receive only the runtime Supabase URL and anon key; service-role access remains server-side.
- Onboarding routing now uses Supabase (`user_onboarding`, falling back to `user_profiles.profile_data`) as the authority and no longer trusts localStorage when the DB is unavailable.
- `/api/events/*` write routes now include the authenticated user id for chat, threads, resources, recordings, announcements, presence, reminders, pinned messages, and feedback.
- `/api/events/:id/attend|leave` is handled before event-router fallthrough, so attendance RPCs are reachable.
- `/api/health` now checks live Supabase REST, Auth, and Storage reachability.
- `/api/community-events` no longer hides Supabase failures behind an empty array.
- `/api/restart` no longer exits the process unless `ALLOW_SELF_RESTART=1` is explicitly set.

### Added
- `user_onboarding` table, sync trigger from `user_profiles`, signup seeding, realtime publication, and backfill.
- Required storage bucket creation/policies for `avatars`, `event-images`, `user-content`, and `notes`.
- Event realtime publication for RSVP, messages, threads, reactions, resources, roles, presence, reminders, announcements, and pinned messages.
- `increment_event_resource_download(uuid, uuid)` RPC for atomic resource download counters.
- Safer cross-platform `setup.sh`, `update.sh`, `setup.bat`, `update.bat`, and `install.ps1`.

### Verified
- `node server.mjs` starts successfully.
- `node --env-file=.env server.mjs` starts successfully.
- `/api/health` returns `status: ok`.
- `/__admin/verify` reports 68/68 passing.

## [1.0.1] — 2026-06-02 — PATCH: Full schema gap-fill & idempotency hardening

### Summary
Full autodiscovery audit of the live Supabase project (23 tables, 21 RPCs, 1 view, 4 buckets,
7 realtime channels) revealed several gaps from v1.0.0. This patch fills every gap and makes
`community-patch-v4.sql` bulletproof for clean-database deployment.

### Fixed
- **`get_group_leaderboard(uuid, integer)` DROP error** — was `ERROR 42P13: cannot change return
  type of existing function`. All functions that can have return-type conflicts now have explicit
  `DROP FUNCTION IF EXISTS` at the top of the v8 section before `CREATE OR REPLACE`.
- **Duplicate `finish_session_sync` overloads** — two conflicting overloads existed
  (`p_duration_minutes` vs `p_duration_s`). Both dropped; one canonical version with `p_duration_s`
  retained (matches `server.mjs` fetch interceptor call signature).
- **Duplicate `get_group_analytics_from_snapshots` overloads** — one with 1 param, one with 2.
  Both dropped; single 2-param version `(p_group_id uuid, p_days integer DEFAULT 7)` recreated.
- **`community_events_with_counts` VIEW type conflict** — existing bigint `attendee_count` vs
  integer in new definition; fixed with `DROP VIEW IF EXISTS` before `CREATE VIEW`.

### Added (discovered via live-DB autodiscovery)
- **`user_settings` table** — per-user JSON settings; seeded for all existing users; added to
  `on_auth_user_created` trigger so new users get a row automatically.
- **`user_roles` table** — admin/moderator role grants; used by `check_user_role` and `get_my_role`
  RPCs (already existed as functions, now have matching table definition in SQL).
- **`community_events.host_user_id`** FK column — links event host to auth.users.
- **`group_members.is_super_admin`** boolean column.
- **`community_events_with_counts` VIEW** — live join of community_events × attendee count.
- **20 production indexes** (all idempotent `CREATE INDEX IF NOT EXISTS`) — covering chat, members,
  notifications, events, challenges, daily stats, sessions, inventory, store, presence.
- **`get_event_attendees(uuid)`** now returns `avatar_url` in addition to username/name/joined_at.
- **`user_settings` added to `supabase_realtime` publication**.

### Schema summary (v1.0.1)
| Category | Count |
|---|---|
| Tables | 23 |
| Views | 1 (`community_events_with_counts`) |
| RPC functions | 21 |
| Realtime channels | 8 |
| Storage buckets | 4 |
| Production indexes | 20+ |

---

## [1.0.0] — 2026-06-02 — PRODUCTION RELEASE 🎉

### Summary
First production-stable release. Every feature from the original IsotopeAI is connected to a real Supabase backend — no dummy endpoints, no mock data, no local-only state. Passes full system audit against both hardening prompts.

### ✅ Full System Audit Results (v1.0.0)
| Category | Status |
|---|---|
| 20 tables accessible (HTTP 200) | ✅ All pass |
| 14 RPC functions operational | ✅ All pass |
| 4 storage buckets + RLS policies | ✅ Configured |
| Realtime on 7 tables | ✅ Enabled |
| RLS on all community tables | ✅ Enforced |
| No hardcoded secrets | ✅ Verified |
| No ENOTFOUND / dummy URLs | ✅ Confirmed |
| Onboarding loop fixed | ✅ DB-authoritative |
| Auth session persistence | ✅ Dual localStorage keys |
| Rate limiting on auth routes | ✅ 10 req/min/IP |

### Added — Production Hardening
- **18 performance indexes** — `group_chat_messages(group_id, created_at DESC)`, `group_members(group_id, user_id)`, `notifications(user_id, read_at) WHERE NULL`, `community_events(is_active, start_time)`, `user_stats_summary(total_hours)`, `group_invites(invite_code, token)`, and 11 more — eliminates full table scans
- **Cascade DELETE constraints** — deleting a group cascades to `group_members`, `group_chat_messages`; deleting an event cascades to `community_event_attendees`; deleting a challenge cascades to `group_challenge_participants` — no more orphan records
- **`UNIQUE (event_id, user_id)`** on `community_event_attendees` — prevents duplicate attendance
- **`UNIQUE (user_id, type, reference_id)`** on `notifications` — prevents duplicate notifications for same event
- **`expire_stale_presence()` RPC** — marks users offline after 2 minutes of inactivity; callable on a schedule
- **Notification cleanup trigger** — auto-purges notifications older than 90 days per user
- **`purchase_store_item(user_id, item_id)` RPC** — atomic store purchase; checks ownership, deducts coins, inserts inventory in a single transaction
- **`finish_session_sync` corrected** — uses actual column names (`daily_user_stats.date`, `daily_user_stats.seconds_studied`, `study_sessions_log.duration_minutes`) — was referencing wrong names from schema docs

### Added — Community Schema (v4–v7, cumulative)
- **20 tables** — users, user_profiles, user_points, user_stats_summary, daily_user_stats, study_sessions_log, store_items, user_inventory, groups, group_members, group_chat_messages, group_challenges, group_challenge_participants, group_announcements, group_invites, group_milestones, notifications, user_presence, community_events, community_event_attendees
- **14 RPC functions** — get_leaderboard, get_group_leaderboard, get_membership_snapshot, is_premium_user, get_invite_details, accept_invite, get_group_analytics_from_snapshots, finish_session_sync, join_community_event, leave_community_event, create_community_event, update_community_event, delete_community_event, get_event_attendees
- **Realtime** enabled on: group_chat_messages, user_presence, notifications, community_events, community_event_attendees, groups, group_members
- **4 storage buckets** — avatars (public, 5 MB), event-images (public, 10 MB), user-content (private, 50 MB), notes (private, 10 MB)
- **Storage RLS policies** — avatars/event-images: public read, owner write; user-content/notes: owner-only
- **10 store items** seeded — 5 themes + 3 boosts + 2 cosmetics
- **16 community events** seeded with future dates (refreshed automatically)
- **`purchase_store_item` RPC** — atomic purchase with coin deduction
- **`expire_stale_presence` RPC** — marks offline after 2-min inactivity
- **`_is_group_member(gid, uid)` SECURITY DEFINER helper** — breaks RLS infinite recursion on all group tables
- **`on_auth_user_created` trigger** — auto-creates users, user_profiles, user_points rows on signup

### Added — Admin & Events System
- **`/__admin/events` management UI** — full CRUD for community events (create, edit, delete, publish/unpublish, refresh-dates)
- **`/__admin/apply-sql`** POST endpoint for programmatic SQL execution via Supabase Management API
- **`/__admin/verify`** 68-point diagnostic covering schema, RLS, RPCs, storage, server health
- **`supaRestReq()` helper** in server.mjs — general-purpose Supabase REST caller with service_role auth

### Added — Auth Hardening
- **Global auth guard in `<head>`** — runs before React, no flash of unprotected content
- **No `isLocalSession()` bypass** — removed client-side-only auth bypass
- **Rate limiting** — 10 req/min/IP on `/__auth/signup` and `/__auth/login`
- **Admin mode protection** — `ENABLE_ADMIN_MODE=true` plus `ADMIN_SECRET` gates all `/__admin/*` routes
- **Startup env warnings** — alerts if default passwords/tokens are in use

### Fixed
- **RLS infinite recursion** on all 6 group tables — replaced self-referential subqueries with `_is_group_member()` SECURITY DEFINER helper
- **`get_leaderboard` overload ambiguity** — dropped legacy 2-param version; now single 3-param signature `(p_period, p_limit, p_offset)`
- **`accept_invite` response shape** — returns `{success: boolean}` (was `{ok:}`)
- **`group_invites.token` column** — plain text (was GENERATED ALWAYS), writeable by JS
- **`group_chat_messages` INSERT RLS** — checks `user_id = auth.uid()` (was `sender_id`)
- **`get_membership_snapshot` dual params** — accepts both `{p_user_id}` and `{target_user_id}`
- **Event attendance RPC auth** — uses user JWT (not service_role) so `auth.uid()` resolves correctly
- **Profile persistence** — `POST /__auth/profile` deep-merges to `user_profiles.profile_data` JSONB
- **Onboarding re-trigger** — DB-authoritative check in `restore-and-launch.js`; `isOnboarded=true` set from profile before React loads
- **`finish_session_sync` column names** — corrected to match actual `daily_user_stats` schema (`date`, `seconds_studied`)
- **Startup backfill limit** — raised 500 → 2000 rows for larger deployments

### Changed
- All users default to `ranker` plan via DB trigger + UPDATE backfill on startup
- service_role key is retained for server-side admin/proxy operations only; browser bundles use the anon key.
- `community-patch-v4.sql` is the canonical schema source (not `isotope-schema.sql`)
- Circuit breaker (`O()`) in Focus bundle patched to always return `false` — no 5-min lockouts

---

## [2.8.0] — 2026-06-01

### Fixed — Bug 1: Event attendance broken (wrong auth key)
- **Root cause:** `POST /api/events/:id/attend` called `join_community_event` / `leave_community_event` RPC using the service_role key. The RPC uses `auth.uid()` internally — with service_role, `auth.uid()` returns NULL.
- **Fix:** Endpoint extracts user JWT from incoming `Authorization` header; `auth.uid()` now resolves correctly.

### Fixed — Bug 2: Profile update endpoint missing (cloud sync broken)
- **Root cause:** No `/__auth/profile` endpoint existed. Profile changes were lost on refresh.
- **Fix:** Added `POST /__auth/profile` — deep-merges to `user_profiles.profile_data` JSONB, syncs to `public.users` simultaneously.

---

## [2.7.0] — 2026-06-01

### Added — Supabase Storage Buckets
- `avatars` (public, 5 MB), `notes` (private, 10 MB), `event-images` (public, 10 MB), `user-content` (private, 50 MB)
- RLS policies applied for all 4 buckets
- Storage verification in `/__admin/verify` (5 new checks)

---

## [2.6.0] — 2026-06-01

### Fixed — Patch v7 Applied to Supabase
- `community_events.image_url`, `updated_at`, `creator_id` columns added
- `create_community_event`, `update_community_event`, `delete_community_event`, `get_event_attendees` RPCs live
- Test suite: 58/63 → 63/63 PASS

---

## [2.5.0] — 2026-06-01

### Added — Events Admin CRUD
- `/__admin/events` full HTML management UI
- 7 events admin endpoints (create, update, delete, publish, refresh-dates, list)
- `supaRestReq()` helper function

---

## [2.4.0] — 2026-06-01

### Security — Auth & Access Control Hardening
- Global auth guard moved to `<head>` (runs before React)
- Removed `isLocalSession()` client-side bypass
- Dynamic `SUPA_REF` in injected scripts (no more hardcoded project ref)
- Startup env var validation with `⚠️` warnings

---

## [2.3.0] — 2026-06-01

### Security
- `ADMIN_SECRET` protection on all enabled `/__admin/*` routes
- `ADMIN_PASSWORD` / `ADMIN_EMAIL` via env vars (removed from source)
- Rate limiting: 10 req/min/IP on auth routes
- Service worker cache bypass for patched bundles

---

## [2.2.0] — 2026-06-01

### Fixed
- **RLS infinite recursion** — all 6 community tables — `_is_group_member()` SECURITY DEFINER helper
- `community_events` + `community_event_attendees` tables + seeded data
- `join_community_event` / `leave_community_event` RPCs

---

## [2.1.0] — 2025-05-31

### Added
- `finish_session_sync` RPC — sessions write to `study_sessions_log`, `daily_user_stats`, `user_stats_summary`
- `_handleFinishSession()` fetch interceptor
- One-click schema apply at `/__admin/patch`
- `AGENTS.md` — complete AI agent reference

---

## [2.0.0] — 2025-05-28

### Added
- Full community feature support: 18 tables, 7 RPCs, RLS policies
- Username-based auth (`/__auth/signup`, `/__auth/login`)
- Leaderboard edge function interceptor → real DB data
- DB-authoritative onboarding routing

### Fixed
- `accept_invite` → `{success:}` response shape
- `token` column on `group_invites` (writeable)
- `group_chat_messages` INSERT RLS uses `user_id`
- 7 missing columns on `user_stats_summary`

---

## [1.1.0] — 2025-05-15

### Added
- `/__supa/*` reverse proxy with service_role injection
- Premium profile upgrade script

---

## [1.0.0-alpha] — 2025-05-01

### Initial release
- Replaced original Supabase project with self-hosted fork
- Demo mode disabled; plan type forced to `ranker`
- `restore-and-launch.js` — session detection + onboarding routing
- Base schema: 16 tables + 5 RPCs
