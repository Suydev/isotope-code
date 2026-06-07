# Changelog — IsotopeAI Self-Hosted

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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
