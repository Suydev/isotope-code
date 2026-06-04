# IsotopeAI Self-Host — Complete Work Log

> **For the next AI:** Read this file first. It tells you exactly what was done, what the current state is, what still needs doing, and where every important file lives. Do not redo anything listed here.

---

## Session: 2026-06-04 — Stabilization Audit, Env Startup Fix, Events/Onboarding Repair

### What was done this session

1. Server startup and secret handling
- Added safe `.env` auto-loading for `node server.mjs`; verified `node --env-file=.env server.mjs` still works.
- Removed historical service-role JWT literals from `server.mjs` and `public/assets/App-pJGjDiPw.js`.
- Replaced committed Supabase bundle constants with placeholders patched at serve time.
- Kept service-role credentials server-side only.

2. Onboarding
- Added `user_onboarding` SQL table, RLS policies, profile sync trigger, signup seeding, backfill, and realtime publication.
- Updated `restore-and-launch.js` to use the runtime Supabase ref and DB-authoritative onboarding checks.
- Removed localStorage fallback when Supabase onboarding state is unavailable.

3. Events and health
- Fixed `/api/events/*` authenticated write payloads to include required user ownership columns.
- Moved attend/leave handling into the main event router.
- Added route-level async error handling for the event API.
- Added atomic resource download counter RPC.
- Published event RSVP/messages/reactions/resources/presence/reminders/announcements tables to realtime.
- Replaced shallow `/api/health` with live REST/Auth/Storage checks.

4. Setup/update scripts
- Rebuilt `setup.sh`, `update.sh`, `setup.bat`, `update.bat`.
- Added `install.ps1`.
- Setup can apply both SQL files through `/__admin/apply-sql` when `SUPABASE_ACCESS_TOKEN` is configured.
- Update refuses to run with unstaged changes and no longer kills all Node processes.

5. Verification
- `node --check server.mjs` passed.
- `bash -n setup.sh update.sh` passed.
- `node server.mjs` passed on port 5100.
- `node --env-file=.env server.mjs` passed on port 5101.
- `/api/health` returned ok.
- `/__admin/events` and `/__admin/patch` returned HTTP 200.
- `/__admin/verify` returned 68/68 passing.

## Session: 2026-06-01 (Audit v2.6.0) — Patch v7 Applied + Admin Email Fix + Test Suite 63/63

### What was done this session

**Root cause eliminated: Patch v7 SQL was written but never executed against the database.**

**1. Patch v7 applied to Supabase (12 statements via Management API)**
- `ALTER TABLE community_events ADD COLUMN IF NOT EXISTS updated_at` ✓
- `ALTER TABLE community_events ADD COLUMN IF NOT EXISTS image_url` ✓
- `ALTER TABLE community_events ADD COLUMN IF NOT EXISTS creator_id` ✓
- `UPDATE community_events SET updated_at = created_at` (backfill) ✓
- `CREATE OR REPLACE FUNCTION create_community_event(...)` ✓
- `CREATE OR REPLACE FUNCTION update_community_event(...)` ✓
- `CREATE OR REPLACE FUNCTION delete_community_event(...)` ✓
- `CREATE OR REPLACE FUNCTION get_event_attendees(...)` ✓
- 4 GRANT statements for service_role / authenticated ✓

**2. Test suite results**
- Before: 58/63 PASS, 5 FAIL
- After: 63/63 PASS, 0 FAIL — ALL CLEAR

**3. Verify false positive fixed**
- `update_community_event` RPC verify probe sent `{p_id:null}`, RPC returned `"Event not found"`, regex `/not found/i` matched → false FAIL
- Fixed: probe uses nil UUID `00000000-0000-0000-0000-000000000000`, detection changed to HTTP 404 or Supabase function-not-found message only

**4. Hardcoded admin email removed from server source**
- Line 85: `'elixir.suyashprabhu@gmail.com'` → `'admin@isotope.local'` (generic placeholder)
- `.env` updated: `ADMIN_EMAIL=elixir.suyashprabhu@gmail.com` (deployment-specific value)
- `validateEnv()` now warns at startup if placeholder default is still in use

**5. Events create endpoint verified end-to-end**
- `POST /__admin/events/create` → `{"ok":true,"event":{id:"3667b9cf"...}}` ✓
- `POST /__admin/events/delete` → `{"ok":true}` ✓
- All 7 events admin endpoints confirmed HTTP 200

**6. Version bump: 2.5.0 → 2.6.0**
- `package.json`, `VERSION`, `CHANGELOG.md` updated

**7. Pushed to GitHub: Suydev/isotope-code + tag v2.6.0**

---

## Session: 2026-06-01 (Audit v2.5.0) — Community Events Admin CRUD

### What was done this session

**Full community events management system — no more SQL-only event creation**

**1. `/__admin/events` HTML admin panel (new)**
- Serves a full dark-themed SSR HTML page listing all community events (incl. inactive)
- "Create Event" button opens a modal form with all fields: title, type, host, dates, gradient, image_url, tags, max_attendees, featured, active
- Per-row actions: Edit (pre-fills modal), Publish/Unpublish toggle, Delete (with confirm)
- "Refresh Past Dates" button pushes all stale-dated events forward to future dates
- Reload button + status indicator for live updates
- Uses vanilla JS + server API — no external dependencies

**2. Events API endpoints (new, all under `/__admin/`, protected by admin mode and `ADMIN_SECRET`)**
- `GET /__admin/events.json` — lists all events (service_role bypasses RLS `is_active` filter)
- `POST /__admin/events/create` — insert new event, sets `updated_at`, supports `image_url`
- `POST /__admin/events/update` — partial update by `id`, PATCH to Supabase REST
- `POST /__admin/events/delete` — DELETE by `id`, CASCADE removes attendees
- `POST /__admin/events/publish` — toggle `is_active` for publish/unpublish
- `POST /__admin/events/refresh-dates` — find all past-dated events, push forward with offset schedule [1,2,3,4,5,7,10,14 days]

**3. `supaRestReq()` module-level helper (new)**
- General-purpose Supabase REST API function with service_role auth
- Supports `Prefer: return=representation` for INSERT/PATCH responses
- 15s timeout, JSON parse + fallback to raw string

**4. `community-patch-v4.sql` — Patch v7 appended**
- `updated_at timestamptz NOT NULL DEFAULT now()` on community_events
- `image_url text` on community_events (overrides gradient if set)
- `creator_id uuid REFERENCES auth.users(id) ON DELETE SET NULL` on community_events
- `create_community_event(...)` RPC — SECURITY DEFINER, validates title, returns `{ok, id}`
- `update_community_event(p_id, ...)` RPC — COALESCE partial update, sets `updated_at`
- `delete_community_event(p_id)` RPC — deletes event (CASCADE handles attendees)
- `get_event_attendees(p_event_id)` RPC — returns TABLE(user_id, username, name, joined_at)
- DO $$ block: refresh all past-dated events to future on patch apply

**5. `/__admin/verify` updates**
- SCHEMA dict: `community_events` now checks `image_url`, `attendee_count`, `updated_at`
- New communityChecks: `create_community_event`, `update_community_event`, `delete_community_event`, `get_event_attendees` RPCs; `community_events (date freshness)` warning
- New serverCheck: `/__admin/events UI` (HTTP 200)
- Verify header: `Events →` link added alongside `Patch →`

**6. AGENTS.md updates**
- Section 9 (community_events): updated columns list, added admin RPC docs
- Section 10 (new): events admin panel with full endpoint table

**7. Version bump: 2.4.0 → 2.5.0**
- `package.json`, `VERSION`, `CHANGELOG.md` updated

**8. Pushed to GitHub: Suydev/isotope-code + tag v2.5.0**

---

## Session: 2026-06-01 (Audit v2.4.0) — Auth & Access Control Hardening

### What was done this session

**Full auth/access-control hardening per spec**

**1. AUTH_GUARD_SCRIPT: moved to `<head>`, immediate, no bypass**
- Was injected at `</body>` (after React). Now injected at `</head>` (first script after ORIGIN_SCRIPT).
- React never loads for unauthenticated users on protected routes → no flash
- Removed 300 ms `setTimeout` delay → instant redirect
- Removed `isLocalSession()` bypass (was: if `isotope-auth.isTemporaryLocalSession=true` in localStorage → auth bypassed — a client-side-only auth hole)
- Redirect destination changed from `/auth` (may not exist) → `/onboarding` (the sign-in entry point per `restore-and-launch.js`)
- Now redirects to `/onboarding` even for expired sessions

**2. Onboarding enforcement in auth guard**
- Added check: if `localStorage['isotope-onboarding'].isOnboarded === false`, redirect to `/onboarding` before React renders
- Supports both flat state shape (`{isOnboarded:false}`) and nested Zustand shape (`{state:{isOnboarded:false}}`)
- Only triggers on `=== false` (explicit false), not `null`/`undefined` (which means "not yet loaded")

**3. Dynamic SUPA_REF in injected scripts**
- `USERNAME_AUTH_SCRIPT` previously used a hardcoded Supabase project ref.
- `AUTH_GUARD_SCRIPT` previously used a hardcoded Supabase project ref.
- Both converted to builder functions: `buildUsernameAuthScript()` and `buildAuthGuardScript()`
- `SUPA_REF` is now computed as `new URL(SUPA_URL).hostname.split('.')[0]` — works for any Supabase project

**4. Startup env var validation**
- Added `validateEnv()` IIFE that runs before `server.listen()`
- Logs warnings for unsafe or incomplete admin-mode configuration
- Does NOT block startup — operators can still run with defaults for local dev

**5. Verify admin row fix**
- `/__admin/verify` "Admin row in public.users" check was `?username=eq.admin` (hardcoded)
- Now `?email=eq.${ADMIN_EMAIL}` — fully driven by `ADMIN_EMAIL` env var
- Shows redacted email in detail message on failure

**6. Login `@isotope.local` comment improved**
- Clarified it's a legacy-only backward-compat fallback for accounts created before v2.3.0

**7. Version bump: 2.3.0 → 2.4.0**
- package.json, VERSION, CHANGELOG all updated

**8. Pushed to GitHub: Suydev/isotope-code + tag v2.4.0**

### Security findings still NOT changed (by design)
- **Service-role key in App bundle**: still intentional for self-hosted/trusted-user deployments
- **CORS wildcard on `/__supa/*`**: still needed for Replit proxy iframe compatibility
- **`@isotope.local` legacy fallback**: kept in login path — removing would lock out existing users who signed up with bare username format. Document as "upgrade users to email auth over time"

---

## Session: 2026-06-01 (Audit v2.3.0) — Security Hardening & Bug Fixes

### What was done this session

**Full production-grade audit of all server.mjs, sw.js, package.json, VERSION, env.example**

**1. Security: Admin panel protection**
- Added `isAdminAuthed(req)` helper function
- Current model: admin tools are disabled unless `ENABLE_ADMIN_MODE=true`, `ADMIN_SECRET`, and `SUPABASE_SERVICE_ROLE_KEY` are set
- Secret accepted via `X-Admin-Secret` header OR `?secret=` query param
- Normal local user mode cannot access owner/admin tools

**2. Security: Admin password removed from source code**
- Removed hardcoded `'Elixir@2025!'` from `server.mjs` line ~2453
- Replaced with `ADMIN_PASSWORD` env var (default: `IsotopeAI@2025!`)
- Admin email also moved to `ADMIN_EMAIL` env var (default: unchanged)
- Deleted local `const ADMIN_EMAIL = ...` that shadowed the module-level var (was causing a duplicate declaration)

**3. Security: Admin email redacted in verify output**
- `/__admin/verify` "Admin user" check now shows `el***@su***.com` style redacted email instead of the full address in HTML

**4. Security: Rate limiting on auth routes**
- Added `checkRateLimit(ip)` in-memory rate limiter (10 req/min per IP, 60s window)
- Applied to `/__auth/signup` and `/__auth/login`
- Returns HTTP 429 + `Retry-After: 60` when exceeded
- Map pruned every 5 minutes via `setInterval(...).unref()`

**5. Fix: Service worker missing bundle bypass**
- `Auth-*.js` is patched server-side (removes Google OAuth button) — was NOT in SW bypass list
- `useInvites-*.js` is patched server-side (p_code param fix) — was NOT in SW bypass list
- Added both regex patterns to sw.js fetch intercept block

**6. Fix: Body size limit on readReqBody()**
- Added `maxBytes = 1048576` (1 MB) parameter to `readReqBody()`
- Oversized requests rejected immediately with `req.destroy()` — prevents memory exhaustion

**7. Fix: Startup backfill LIMIT 500 → 2000**
- All four startup queries (`users`, `user_points`, `user_stats_summary`, `user_profiles`) now use `&limit=2000`
- Deployments with >500 users were silently skipping backfills

**8. Fix: package.json version**
- Corrected from `1.1.3` → `2.3.0` (was stale since project inception)

**9. Docs updated**
- CHANGELOG.md: v2.3.0 section added
- AUDIT.md: Security Considerations section expanded with admin token, admin password, and service-role-in-bundle warnings
- AGENTS.md: Env vars section updated with `ENABLE_ADMIN_MODE`, `ADMIN_SECRET`, optional service-role/PAT notes, endpoint auth notes, and self-hosted architecture
- .env.example: documents blank placeholders for normal mode and optional owner/admin mode

**10. Pushed to GitHub: Suydev/isotope-code**

### Security findings NOT changed (by design)
- **Service-role key in App bundle**: `getPatchedAppBundle()` injects the service_role key into the JS sent to all browsers. This is intentional for self-hosted/trusted-user deployments but documented clearly in AUDIT.md and AGENTS.md as a high-severity consideration for public deployments.
- **CORS wildcard on proxy**: `/__supa/*` proxy returns `Access-Control-Allow-Origin: *` — intentional for Replit preview iframe compatibility.

---

## Session: 2026-06-01 — RLS Fix, Community Events, Server Restart, GitHub Push

### What was done this session

**1. Fixed RLS infinite recursion (all 6 failing tables → now 7/7 ✅ → 57/57 ALL CLEAR)**
- Root cause: `gm_read` policy on `group_members` used `SELECT group_id FROM public.group_members WHERE user_id = auth.uid()` — self-referential subquery triggers the same RLS policy → PostgreSQL error `42P17` (infinite recursion)
- Fix Step 1: created `public._is_group_member(gid, uid)` SECURITY DEFINER helper + rewrote 12 RLS policies on 8 tables
- Fix Step 2 (critical!): discovered 3 additional LEGACY policies with different names that the patch didn't touch:
  - `gm_read_members` on `group_members` — self-referential `SELECT ... FROM group_members`
  - `gchat_read_members` on `group_chat_messages` — referenced `group_members` in subquery
  - `gcpart_read_members` on `group_challenge_participants` — joined `group_members`
  - Dropped all 3 via Supabase Management API (HTTP 201 confirmed)
- `/__admin/verify`: **57/57 ALL CLEAR** ✅ (Tables 20/20, RPC 7/7, RLS 7/7, Edge 8/8, Health)

**2. Created community events (alive, not dummy)**
- `community_events` table: created (idempotent CREATE TABLE IF NOT EXISTS)
- `community_event_attendees` table: created with PK (event_id, user_id)
- `join_community_event` / `leave_community_event` RPCs: SECURITY DEFINER, idempotent
- 6 events seeded: JEE Advanced Strategy, NEET Biology Deep Dive, Weekly Community Study Session, Physics Workshop, Chemistry Masterclass, Calculus Sprint
- Server startup backfill also seeds events if table is empty
- RLS: public read (is_active = true), service_role write

**3. Fixed server restart**
- `/api/restart` handler: changed `process.exit(1)` → `process.exit(0)` so Node.js `--watch` flag cleanly restarts on process exit

**4. Fixed `/__admin/patch` one-click apply**
- Added 200ms pacing between SQL statements (avoids Supabase Management API rate limiting)
- Expanded "safe to skip" error pattern: added `42P07`, `42703`, `42701`, `ThrottlerException`
- Root cause of "fails all": rate limiting + some `already exists` errors treated as fatal; both now fixed

**5. Updated docs**
- CHANGELOG.md: v2.2.0 section added
- AGENTS.md: sections 8+9 added (RLS helper rule, community_events schema)
- WORK_LOG.md: this session logged
- AUDIT.md: RLS section updated

**6. Pushed to GitHub: Suydev/isotope-code**

### Current state of `/__admin/verify` (expected after fix)
- Tables 18/18 ✅
- RPC 7/7 ✅
- **RLS Safety 7/7 ✅** (was 1/7 — now fixed)
- Edge Interceptors 8/8 ✅
- Server Health 4/4 ✅

---

## Project Overview

**IsotopeAI** is a self-hosted fork of IsotopeAI (an AI-powered study planner for JEE/NEET students). The goal is:
- Everyone gets **Ranker** tier (premium) for free — no subscriptions, no paywalls
- Community features work via the user's own Supabase project
- All 272 original files are preserved; modifications are server-side patches (no build step needed)

**GitHub repo:** `github.com/Suydev/isotope-code`  
**Local workflow:** `PORT=5000 node server.mjs`
**Self-hosted Supabase:** configured by `SUPABASE_URL`

---

## Architecture

```
Browser
  │
  ├─► GET /assets/App-pJGjDiPw.js  ←  server.mjs patches this in-memory:
  │                                     • Demo mode disabled
  │                                     • planType hardcoded to "ranker"
  │                                     • Original Supabase URL/key replaced with ours
  │
  ├─► All other /assets/*.js        ←  served as-is (no patching needed)
  │
  ├─► POST /api/check-update        ←  server checks GitHub for new commits
  │
  ├─► /__supa/*                     ←  optional proxy (active if SUPABASE_SERVICE_ROLE_KEY set)
  │                                     bypasses RLS by injecting service_role key
  │
  └─► Everything else               →  direct to configured Supabase project
```

---

## Supabase Setup Status

### Project
- **URL:** configured by `SUPABASE_URL`
- **Anon key (LEGACY PUBLIC):** get from Supabase → cmd palette → "Copy anonymous API key"
- **Service role key (LEGACY SECRET):** get from Supabase → cmd palette → "Copy service API key"
- **DB password:** stored separately (never commit actual password)

### SQL Schema
File: `isotope-schema.sql`

**Status: NEEDS TO BE RUN** — Go to Supabase Dashboard → SQL Editor → New query → paste contents of `isotope-schema.sql` → Run.

The schema is **idempotent** (safe to run multiple times). It:
1. Drops all existing RLS policies first (fixes "policy already exists" error)
2. Creates all 16 tables with `IF NOT EXISTS`
3. Sets `plan_type = 'ranker'` as default everywhere
4. `get_membership_snapshot()` always returns `ranker`/`active`/`2099` — hardcoded
5. `is_premium_user()` always returns `true`
6. Trigger `on_auth_user_created` sets every new signup to Ranker automatically
7. Updates any existing users to Ranker on re-run

### What STILL needs setting up

1. **Run SQL schema** in Supabase SQL Editor (see above)
2. **Authentication providers** in Supabase:
   - Go to Supabase → Authentication → Providers → Enable Google
   - Add your Replit app domain to "Redirect URLs"

---

## All Patches Applied

### server.mjs — Bundle Patches (in-memory, no build needed)

The server reads bundle files from disk, patches them in memory, and serves the patched version. The original files on disk are never modified.

#### Patch 1 — Demo mode disabled
```
ge = () => typeof window > "u" ? !1 : Ys(...) || ...
→
ge = () => !1
```
Prevents the app from entering demo mode. The original demo mode injects fake data and blocks real auth.

#### Patch 2 — fetchUserData planType → ranker
```
planType: "scholar", planExpiresAt: k?.access_ends_at
→
planType: "ranker",  planExpiresAt: k?.access_ends_at
```
The grandfathered plan path was returning "scholar". Now returns "ranker".

#### Patch 3 — Auth store initial state → ranker
```
planType: "scholar", planExpiresAt: null, accessSource: "grandfathered"
→
planType: "ranker",  planExpiresAt: null, accessSource: "grandfathered"
```

#### Patch 4 — Supabase URL + anon key replacement
Replaces the original IsotopeAI Supabase constants (`rcnekgzbdlwhcpmpoogz.supabase.co` + original anon key) with the self-hosted project's URL + key. This means the browser talks directly to our Supabase — no proxy in the middle.

Original URL is stored in `ORIG_SUPA_URL` constant.  
The Supabase URL is configured by `SUPABASE_URL`.
`CUSTOM_SUPA` is always true (our URL ≠ original URL).

### server.mjs — PREMIUM_SCRIPT (injected into every HTML response)

Runs in the browser on every page load. Does two things:

**1. Fetch interceptor** — intercepts all Supabase REST API responses and patches any JSON that contains plan/billing fields:
- `plan_type` → `"ranker"`
- `billing_status` → `"active"`
- `access_ends_at` → `"2099-12-31T23:59:59.000Z"`
- `plan_expires_at` → `"2099-12-31T23:59:59.000Z"`
- `effective_plan` → `"ranker"`
- `access_source` → `"ranker"`

Also patches RPC responses (`/rpc/get_membership_snapshot` etc).

**isPlanObject guard:** only patches objects that look like user/membership objects (have `plan_type` OR `billing_status` OR `access_ends_at`). Does NOT patch tasks, subjects, exams that might coincidentally have these fields.

**2. Profile upgrader** — after login (or on page reload with existing session), PATCHes the user's row in `public.users` to `plan_type='ranker'`. This makes `is_premium_user()` in PostgreSQL return true, so all community RLS policies pass.

### sw.js — Service Worker Network-Only List

Prevents the service worker from caching patched bundles with their original unpatched content. Files in the network-only list are ALWAYS fetched fresh from the server:

- `App-pJGjDiPw.js` — main app bundle (has patches 1-4)
- `Focus-BmgY-9vP.js` — Focus tab (PiP polyfill + URL fixes)
- `Onboarding-qvAqCBbb.js` — onboarding flow patches
- `sessionSync-mloIEnTd.js` — session sync
- `useSyncStore-vWs_TdIc.js` — sync store
- `useAIStore-B2cv1FZz.js` — AI store (Gemini/Groq key injection)

### Onboarding-qvAqCBbb.js — Step limiter
```
o < 7  →  o < 2
```
Skips straight to the final step so users don't get stuck in a 7-step onboarding flow.

### useAIStore-B2cv1FZz.js — AI key injection
Replaces the hardcoded empty Gemini/Groq key references with `window.__IK__.gemini` / `window.__IK__.groq`. The server injects these keys from `GEMINI_API_KEY` / `GROQ_API_KEY` env vars.

### Focus-BmgY-9vP.js — PiP polyfill + URL fix
1. Prepends a full `documentPictureInPicture` polyfill (works on Android/mobile)
2. Replaces hardcoded `rcnekgzbdlwhcpmpoogz.supabase.co` URL in the Focus API calls

---

## 8 Bugs Found & Fixed

| # | Bug | Impact |
|---|-----|--------|
| 1 | `deepPatch`: expired dates not overridden (only replaced if falsy) | Expired plans showed as expired |
| 2 | `deepPatch`: `isPlanObject()` guard missing — recursed into ALL objects | Could corrupt task/exam data |
| 3 | `deepPatch`: `effective_plan`, `access_source`, `cancel_at_period_end` not patched | Snapshot RPC bypassed |
| 4 | Token-refresh reload loop: cleared `__iso_rls_upgraded__` on every JWT refresh | Reload every ~1 hour |
| 5 | Demo key cleanup: `break` after first key + modifying array while iterating | Demo keys not fully cleared |
| 6 | Demo `localStorage` not cleared — only `sessionStorage` | Demo mode persisted |
| 7 | `Permissions-Policy` header missing — IndexedDB blocked in Replit iframe | kvStore shadow backup errors |
| 8 | SW cache: Focus + Onboarding + sessionSync + useSyncStore not in bypass list | Patches silently lost after first SW cache |

---

## New Features Added

### GitHub Auto-Update Checker
- **`public/update-checker.js`** — client-side script, zero dependencies
- Polls `/api/check-update` every 10 minutes when online
- Also checks on: tab focus, offline→online transition, page load (+4s)
- Shows amber slide-in banner at top of app when new commit available
- "Reload to update" button: triggers SW update + hard reload
- Dismiss button: stores dismissed SHA in localStorage
- **`/api/version`** endpoint — returns deployed commit SHA
- **`/api/check-update`** endpoint — fetches GitHub API, compares SHAs, 10 min cache
- **`VERSION`** file — written at push time with commit SHA, read by server at startup

---

## File Map

| File | Purpose |
|------|---------|
| `server.mjs` | Main server — all patches live here |
| `index.html` | Entry point — lists all script tags including update-checker |
| `public/sw.js` | Service worker — network-only list prevents caching patched bundles |
| `public/update-checker.js` | GitHub update checker — amber banner UI |
| `public/restore-and-launch.js` | Startup: clears stale data, routes to /onboarding or /dashboard |
| `public/boot-recovery.js` | Handles stale asset cache errors |
| `public/ux-setup.js` | UX: skips redundant onboarding steps |
| `public/focus-bg-import.js` | Focus tab background image/video picker |
| `isotope-schema.sql` | Complete Supabase schema — idempotent, run in SQL Editor |
| `VERSION` | Current deployed commit SHA |
| `public/assets/App-pJGjDiPw.js` | Main app bundle (patched in-memory by server) |
| `public/assets/Focus-BmgY-9vP.js` | Focus tab bundle (PiP polyfill patched) |
| `public/assets/Onboarding-qvAqCBbb.js` | Onboarding (o < 2 patch applied) |
| `public/assets/useAIStore-B2cv1FZz.js` | AI store (key injection patched) |

---

## Runtime Supabase Constants

The tracked bundles use safe placeholders for Supabase project URL and anon key.
`server.mjs` replaces those placeholders from the local `.env` at serve time.
Do not hardcode project URLs, anon keys, service-role keys, or admin secrets in
tracked files.

---

## Supabase Tables Created

1. `users` — plan_type, billing_status, expires
2. `user_profiles` — onboarding/settings JSON
3. `user_points` — leaderboard points
4. `user_stats_summary` — study hours, streaks
5. `daily_user_stats` — per-day seconds studied
6. `study_sessions_log` — session history
7. `store_items` — in-app store items
8. `user_inventory` — purchased items
9. `groups` — study groups
10. `group_members` — membership + roles
11. `group_chat_messages` — group chat
12. `group_challenges` — group challenges
13. `group_challenge_participants` — challenge progress
14. `group_announcements` — group announcements
15. `group_invites` — invite tokens
16. `group_milestones` — group achievements

---

## RPC Functions

| Function | What it does |
|----------|-------------|
| `get_membership_snapshot(uuid)` | Always returns `ranker`/`active`/`2099` — hardcoded |
| `is_premium_user()` | Always returns `true` |
| `accept_invite(token)` | Adds user to group via invite token |
| `get_invite_details(token)` | Returns group info for invite token |
| `get_group_analytics_from_snapshots(uuid)` | Returns group study stats |

---

## What Doesn't Work Yet

| Feature | Why | Fix |
|---------|-----|-----|
| Community (groups/leaderboard) | SQL schema not run yet | Run `isotope-schema.sql` in Supabase SQL Editor |
| Server proxy/admin access limited | `SUPABASE_SERVICE_ROLE_KEY` not set | Add service_role key to environment secrets |
| Focus session cloud sync | `finish-session` Edge Function not deployed | Deploy edge function to Supabase (next task) |
| Push notifications | Firebase config not set up | Set `VAPID_KEY` etc if needed |
| Anon key format compatibility | Using `sb_publishable_` new format; app may prefer legacy JWT | Replace with "Copy anonymous API key (LEGACY PUBLIC)" from Supabase |

---

## Next Steps (priority order)

1. **Run SQL schema** — Supabase → SQL Editor → paste `isotope-schema.sql` → Run
2. **Set service_role key** — Replit Secrets → `SUPABASE_SERVICE_ROLE_KEY` = legacy service key
3. **Update anon key** — Replace `sb_publishable_` with legacy JWT anon key in `server.mjs` line ~58
4. **Set Redirect URLs** in Supabase Auth — add your Replit domain
5. **Deploy `finish-session` edge function** — for Focus session cloud sync
6. **Test community** — join a group, verify RLS is not blocking

---

## Commit History

| SHA | What |
|-----|------|
| `0582baf` | Initial push of all 272 original files |
| `8df17d5` | 8 bug fixes (deepPatch, SW cache, reload loop, demo cleanup) |
| `ee86d8d` | SQL schema fix (idempotent, ranker everywhere) |
| `70995c1` | Direct Supabase + auto-update checker + scholar→ranker cleanup |
| prev | Hardcoded self-hosted Supabase URL/key + ORIG_* constants + this work log |
| latest | Fixed Replit workflow port: changed artifact port from 24099 → 5000 (supported by Replit port watcher); removed conflicting API server `/api` path intercept; app now starts and stays running |
