# IsotopeAI Self-Hosted — Admin Reference

Complete reference for every admin feature, endpoint, env var, and operational procedure.

---

## Quick Navigation

| Panel | URL | Purpose |
|-------|-----|---------|
| Test Suite | `/__admin/verify` | Core diagnostics — schema, RPCs, RLS, server health |
| Sync Repair | `/__admin/sync` | Inspect best backup candidates and promote the safe backup |
| Storage Cleanup | `/__admin/storage` | Preview backup cleanup and apply only after review |
| SQL Patch | `/__admin/patch` | Apply community SQL patches to Supabase |
| Removed Events | `/__admin/events*` | Removed-feature JSON response; Events admin is not active |

---

## 1. Authentication & Protection

### Owner tools are private by default

Normal local users only need `SUPABASE_URL` and `SUPABASE_ANON_KEY`. All `/__admin/*` routes show an "admin mode disabled" page unless owner/admin mode is explicitly enabled.

To enable owner/admin mode, set:

```env
ENABLE_ADMIN_MODE=true
ADMIN_SECRET=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAIL=
ADMIN_EMAILS=
SUPABASE_ACCESS_TOKEN=
```

Access via:
- **Header:** `X-Admin-Secret: <secret>`
- **Query string:** `/__admin/verify?secret=<secret>`

`SUPABASE_ACCESS_TOKEN` is only needed for SQL apply through `/__admin/patch`. The service-role key and PAT must stay private and server-side.

### Other admin env vars

| Variable | Default | Purpose |
|----------|---------|---------|
| `ENABLE_ADMIN_MODE` | `false` | Enables `/__admin/*` tools when set to `true` |
| `ADMIN_SECRET` | _(empty)_ | Optional local unlock secret for `/__admin/*` routes |
| `SUPABASE_SERVICE_ROLE_KEY` | _(empty)_ | Required for owner/admin data management |
| `SUPABASE_ACCESS_TOKEN` | _(empty)_ | Optional; applies SQL through Supabase Management API |
| `ADMIN_EMAIL` | _(empty)_ | Optional Supabase admin email for browser unlock and auto-create/check |
| `ADMIN_EMAILS` | _(empty)_ | Optional comma-separated Supabase admin email allowlist |
| `ADMIN_PASSWORD` | _(empty)_ | Optional admin account password for auto-create |

Open `/__admin/login` in the browser. You can unlock with `ADMIN_SECRET`, or click **Use Supabase Login** after signing into the app as an allowed admin email or a user with an active `owner`, `admin`, or `super_admin` role in `user_roles`.

**Important:** Never put these values in commits, docs, screenshots, or frontend bundles.

---

## Backup Repair — `/__admin/sync`

Use this page when a user has rich backup data in old paths such as `imports/latest.json` or `exports/latest.json`, or when `cloud-snapshot/latest.json` needs to be rebuilt from a richer backup.

The page can:

- show the selected best backup
- show all backup candidates
- show collection counts
- dry-run repair
- apply repair by promoting the selected rich backup to:
  - `{userId}/backups/latest.json`
  - `{userId}/backups/history/{timestamp}-{hash}.json`
  - `{userId}/cloud-snapshot/latest.json`

JSON API:

```http
POST /__admin/sync/repair-user-backup
```

Body:

```json
{
  "user_id": "uuid",
  "dry_run": true
}
```

Set `dry_run` to `false` only after checking the selected backup.

## Storage Cleanup — `/__admin/storage`

Cleanup is preview-first.

Preview:

```http
POST /__admin/storage/cleanup-preview
```

Apply:

```http
POST /__admin/storage/cleanup-apply
```

Apply body must include:

```json
{
  "user_id": "uuid",
  "confirm": true
}
```

Cleanup never deletes canonical latest paths or the selected best backup.

---

## 2. Automated Test Suite — `/__admin/verify`

**URL:** `GET /__admin/verify`
**Auth:** Admin unlock
**Auto-refreshes:** every 30 seconds

Runs diagnostics against your configured Supabase project. In admin mode, table/RPC/bucket checks can use the server-side service-role key. Results are grouped by schema, RPC, RLS, server health, community, removed-feature, and storage checks.

### Category 1: Tables (20 tests)
Checks every required table exists with all expected columns.

| Table | Key columns checked |
|-------|---------------------|
| `users` | id, email, username, plan_type, billing_status, coins, gems |
| `user_profiles` | user_id, profile_data |
| `user_points` | user_id, points, lifetime_points |
| `user_stats_summary` | user_id, total_study_seconds, streak_days, current_streak, … |
| `daily_user_stats` | user_id, date, seconds_studied |
| `study_sessions_log` | id, user_id, duration_minutes, ended_at |
| `groups` | id, name, slug, member_count, owner_id, is_public, max_members |
| `group_members` | id, group_id, user_id, role, joined_at |
| `group_chat_messages` | id, group_id, user_id, content, message_type, created_at |
| `group_invites` | id, group_id, token, created_by, max_uses, uses_count |
| `group_challenges` | id, group_id, title, goal_type, goal_value, start_time, end_time |
| `group_challenge_participants` | challenge_id, user_id, progress, completed |
| `group_announcements` | id, group_id, author_id, content, pinned |
| `group_milestones` | id, group_id, milestone_type, earned_at |
| `notifications` | id, user_id, type, title, body, read_at |
| `user_presence` | user_id, status, last_seen |

### Category 2: RPC Functions (7 tests)

| RPC | What it tests |
|-----|---------------|
| `get_membership_snapshot()` | No-arg call → plan_type + is_premium |
| `get_membership_snapshot(p_user_id)` | Parameterized form |
| `get_membership_snapshot(target_user_id)` | Alias form |
| `accept_invite(p_code)` | Group invite acceptance |
| `get_invite_details(p_code)` | Invite metadata lookup |
| `finish_session_sync(...)` | Focus session cloud sync |
| `get_group_analytics_from_snapshots(...)` | Group stats |

### Category 3: RLS Policy Safety (7 tests)

Verifies anon key cannot cause infinite recursion on:
`groups`, `group_members`, `group_challenges`, `group_challenge_participants`, `group_chat_messages`, `group_announcements`, `group_milestones`

### Category 4: Edge Function Interceptors (8 tests)

| Intercepted Route | What the server returns |
|-------------------|------------------------|
| `get-leaderboard` | Live leaderboard data from DB |
| `get-daily-leaderboard` | Daily leaderboard |
| `get-group-leaderboard` | Group leaderboard |
| `get-group-analytics` | Group analytics |
| `finish-session` | Forwards to `finish_session_sync` RPC |
| `create_checkout` | Disabled — `{url:null, disabled:true}` |
| `create_customer_portal_session` | Disabled — `{url:null, disabled:true}` |
| `redeem_membership_code` | Self-hosted → always redeems as "success" |

### Category 5: Server Health

| Check | What is verified |
|-------|-----------------|
| `/__admin/patch UI` | HTTP 200 |
| `/ (app root)` | HTTP 200 |
| `/api/health` | HTTP 200 |
| `Supabase REST reachable` | HTTP < 500 |
| `Supabase Auth reachable` | HTTP < 500 |

### Category 6: Admin & Community Features

| Check | What is verified |
|-------|-----------------|
| `Admin user` | Exists in `auth.users` with matching `ADMIN_EMAIL` |
| `Admin row in public.users` | Username + plan_type in public table |
| `_is_group_member(gid,uid)` | SECURITY DEFINER helper exists |
| `group_members table accessible` | HTTP 200 with service_role |
| `user_presence (realtime)` | Table accessible |

Events and Store checks are intentionally absent because those product surfaces were removed.

---

## 3. SQL Patch Manager — `/__admin/patch`

**URL:** `GET /__admin/patch`
**Auth:** Admin unlock

### What it does

Serves the full contents of `community-patch-v6.sql` as a runnable SQL patch (v6 supersedes v4 and is the current canonical cumulative patch). Provides:
- **One-click apply** via Supabase Personal Access Token (PAT) — no copy-paste needed
- **Download** as `.sql` file
- **Copy to clipboard** for manual Supabase SQL Editor paste

### One-click apply (recommended)

1. Go to `/__admin/patch`
2. Get a PAT from [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens)
3. Paste into the token field
4. Click **Apply All SQL Now**
5. Watch per-statement progress — "already exists" errors are safe (idempotent)
6. Hard reload the app when done

### What the patch contains (7 versions)

| Version | What it adds |
|---------|-------------|
| v1 | Core community tables: `group_members`, `group_invites`, `group_challenges`, etc. |
| v2 | `group_challenge_participants`, `group_announcements`, `group_milestones`, `notifications`, `user_presence` |
| v3 | `_is_group_member()` SECURITY DEFINER helper — eliminates RLS recursion |
| v4 | `get_group_leaderboard`, `get_membership_snapshot`, `get_group_analytics_from_snapshots` RPCs |
| v5 | `finish_session_sync` RPC — Focus session cloud sync to DB |
| v6 | RLS recursion fix — drop legacy `gm_read_members` etc. policies |
| v7 | Removed Events and Store cleanup retained as an idempotent compatibility patch |

### SQL endpoint (proxy)

`POST /__admin/apply-sql` — accepts `{pat: string, sql: string}` and executes via Supabase Management API. Used by the one-click apply button. Avoids browser CORS restrictions on `api.supabase.com`.

`GET /__admin/patch.sql` — raw SQL download.

---

## 4. Removed Events/Admin Surface

Events and Store were removed from the product in v3.0.0. They are not active admin tools and should not be reintroduced without an explicit new implementation request.

Current behavior:

| Route | Response |
|-------|----------|
| `/__admin/events*` | Removed-feature 404 JSON |
| `/api/events*` | Removed-feature 404 JSON |
| `/api/community-events` | Removed-feature 404 JSON |

The cleanup SQL in `community-patch-v4.sql` and `events-expansion.sql` removes Events/Store tables, RPCs, policies, triggers, views, and storage bucket residue.

## 5. Storage Buckets

Supabase storage buckets provisioned for this project:

| Bucket | Visibility | Size Limit | Allowed Types | Purpose |
|--------|-----------|-----------|---------------|---------|
| `avatars` | **Public** | 5 MB | JPEG, PNG, WebP, GIF | User profile photos |
| `user-content` | **Private** | 50 MB | JPEG, PNG, WebP, PDF, TXT | User study files (pre-existing) |
| `notes` | **Private** | 10 MB | JPEG, PNG, PDF, TXT, JSON | User study notes |

### Storage RLS policies

**`avatars` bucket:**
- Anyone can read (public bucket)
- Authenticated users can upload to their own folder (`{user_id}/filename`)
- Owners can update or delete their own files

**`notes` bucket:**
- Authenticated users can read, write, update, delete their own folder only
- No public access

### Avatar upload path convention
```
avatars/{user_id}/avatar.jpg
```
Public URL: `https://{SUPABASE_URL}/storage/v1/object/public/avatars/{user_id}/avatar.jpg`

### Storage proxy
All storage requests from the frontend go through the `/__supa/storage/v1/*` proxy on the server, which adds the `apikey` header automatically. The frontend does not need to know the Supabase URL directly.

---

## 6. Auth Endpoints

These are not admin routes. They are user-facing auth routes protected by Supabase auth and local rate limits.

| Method | Endpoint | Payload | What it does |
|--------|----------|---------|-------------|
| `POST` | `/__auth/signup` | `{username: email, password}` | Create Supabase user + public.users row + Supabase session |
| `POST` | `/__auth/login` | `{username: email\|username, password}` | Sign in, return `{session}`. Supports legacy `@isotope.local` suffix |
| `POST` | `/__auth/check` | `{email}` | Check if email is taken → `{available: bool}` |

Rate limits:
- Signup: 5 attempts per IP per 60 seconds
- Login: 10 attempts per IP per 60 seconds

### Runtime login bridge and cache troubleshooting

`/auth-bridge.js` is loaded synchronously from `index.html` before the React app starts. It defines `window.__isoLogin(email, password)` and `window.__isoUp(email, password)` for patched or stale Auth bundles that call those globals.

Do not test those globals in the Node REPL. Node has no `window`. Use the browser console on `/auth`:

```js
typeof window.__isoLogin
typeof window.__isoUp
```

Both should return `"function"`. For a Node smoke test, run:

```bash
npm run test:auth-bridge
```

For cache/load-order proof against a running server, run:

```bash
npm run test:runtime-glue
```

For an end-to-end Supabase Auth + private `user-content` Storage sync proof, run:

```bash
npm run test:supabase-sync
```

If a stale PWA cache serves old runtime JavaScript, clear browser caches and reload:

```js
caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))).then(() => location.reload())
```

If the header sync button returns `Authentication required`, the app has no valid Supabase JWT for cloud sync. Sign out, sign in again through `/auth`, then confirm in the browser console:

```js
typeof window.__isoGetValidJwt
```

---

## 7. API Endpoints

| Method | Endpoint | Auth | What it does |
|--------|----------|------|-------------|
| `GET` | `/api/health` | None | Returns local server and Supabase health checks |
| `GET` | `/api/version` | None | Returns package version, local Git SHA, command metadata, and `pwa_cache` (the live service-worker cache name) |
| `GET` | `/api/ai-config` | None | Returns `{gemini, groq}` booleans — whether each AI key is configured. No key material |
| `POST` | `/api/restart` | None | Legacy no-op. Returns `isotope update` guidance and never stops the server |
| `GET` | `/api/check-update` | None | Checks GitHub for a newer version, falling back to SHA when needed |
| `GET` | `/api/update-status` | None to call | Reports `{authorized, admin_available, dirty, dirty_count, dirty_files, branch}`. Lets the UI warn before an update stashes local work |
| `POST` | `/api/update-now` | Admin cookie **or** loopback | Runs `isotope update` detached. `409` if the git tree is dirty unless `?confirm=1`; `403` for LAN/remote callers |
| `GET` | `/api/pip/state` | None | Current Picture-in-Picture timer state |
| `POST` | `/api/pip/action` | None | Sends a PiP control action (play/pause/etc.) |
| `GET` | `/api/community-events`, `/api/events*` | None | Removed-feature 404; Events has been removed |

### `/api/update-now` authorization

This does **not** require admin mode. It accepts either a valid admin cookie or a
loopback request — `req.socket.remoteAddress` of `127.0.0.1`/`::1` with no
`x-forwarded-for` / `x-forwarded-host` header. `isotope update` is a local
`git pull`, so the operator at the machine is who should be able to run it;
gating on `ENABLE_ADMIN_MODE` made the in-app Update button a permanent `403` on
ordinary self-hosted installs. LAN and remote callers are still rejected, and the
`403` body carries `admin_available` so the UI only offers admin unlock when
unlock can actually succeed.

Because `git pull` auto-stashes a dirty tree, a bare `POST` returns `409
confirmation_required` with `dirty_count` when `git status --porcelain` is
non-empty. Retry with `?confirm=1` to proceed. Recover stashed work with
`git stash pop`.

---

## 8. Supabase Proxy — `/__supa/*`

All Supabase API calls from the frontend are proxied through `/__supa/*`. The server:

1. Strips `/__supa` prefix
2. Forwards to your `SUPABASE_URL`
3. Passes through all request headers (Authorization, apikey, Content-Type)
4. Adds `apikey: SUPABASE_ANON_KEY` if missing
5. Streams the response back

This allows the app to work behind the local preview proxy without CORS issues, and makes swapping Supabase projects (via env vars) transparent to the frontend.

### Edge Function proxy — `/__supa/functions/v1/*`

The server intercepts specific edge function calls before they hit Supabase:

| Intercepted | What happens instead |
|-------------|---------------------|
| `finish-session` | Calls `finish_session_sync` RPC with user JWT |
| `get-leaderboard` | Live DB query for leaderboard rankings |
| `get-daily-leaderboard` | Daily rankings |
| `get-group-leaderboard` | Group-scoped rankings |
| `get-group-analytics` | Group stats from snapshots |
| `create_checkout` | Returns `{url:null, disabled:true}` |
| `create_customer_portal_session` | Returns `{url:null, disabled:true}` |
| `redeem_membership_code` | Returns `{success:true, redeemed:true}` (always grants premium) |

---

## 9. Server-Side Patches (Bundle Overrides)

The server intercepts and patches selected compiled JavaScript bundles at request time:

| Bundle | What is patched |
|--------|----------------|
| `App bundle` (main JS) | `planType` hardcoded → `ranker`; circuit breaker disabled; community URL patched |
| `AI store` | `getApiKey()` → reads from `window.__IK__` (injected by server from env vars) |
| `Focus/AI bundle` | Replaces hardcoded production Supabase URL with self-hosted URL |
| `Auth bundle` | Username-as-email support; auth flow patches; stale `IsotopeAI v2.0` badge → `v3.1` |
| `Invites bundle` | `token_input` → `p_code` (accept_invite + get_invite_details) |
| `Community` / `CommunityHub` bundles | Store and Events navigation/cards removed |
| `PWAManager` bundle | Service-worker activation reload routed through `window.__isoReloadGuard()` |
| Store and Events chunks | Served as empty modules |

### `window.__IK__` injection

The server injects this object into every HTML response:
```javascript
window.__IK__ = {
  supa:  "https://YOUR_SUPABASE_URL",
  anon:  "YOUR_ANON_KEY",
  gemini: "GEMINI_API_KEY",  // if set
  groq:   "GROQ_API_KEY",    // if set
};
```
This allows AI features to use server-configured API keys without them appearing in static JS files.

---

## 10. Environment Variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `SUPABASE_URL` | Yes | Built-in project | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Yes | Built-in key | Public/anon JWT key |
| `SUPABASE_SERVICE_ROLE_KEY` | Owner only | _(none)_ | Bypasses RLS. Required for `ADMIN_MODE_READY` and for startup backfills |
| `SUPABASE_ACCESS_TOKEN` | Owner only | _(none)_ | Management API PAT. Only needed for one-click SQL apply via `/__admin/patch` |
| `ENABLE_ADMIN_MODE` | Optional | `false` | Must be `true` (with a service-role key) before any `/__admin/*` route works |
| `ADMIN_EMAIL` | Optional | _(empty)_ | Supabase admin email for browser unlock and optional bootstrap |
| `ADMIN_EMAILS` | Optional | _(empty)_ | Comma-separated Supabase admin email allowlist |
| `ADMIN_PASSWORD` | Optional | _(empty)_ | Admin account password for optional bootstrap |
| `ADMIN_SECRET` | Optional | random per boot | Local admin unlock secret. When unset, the admin cookie HMAC key is a fresh random value each start, so unlock does not persist across restarts |
| `BROWSER_PROOF_EMAIL` | Optional | `ADMIN_EMAIL` | Existing Supabase user used by `/__admin/browser-proof` |
| `GROQ_API_KEY` | Optional | _(none)_ | AI text features (Groq/LLaMA) |
| `GEMINI_API_KEY` | Optional | _(none)_ | AI text features (Gemini) |
| `GITHUB_OWNER` | Optional | `Suydev` | Update-check repo owner. Override when forking |
| `GITHUB_REPO` | Optional | `isotope-code` | Update-check repo name |
| `GITHUB_PAT` | Optional | _(none)_ | Raises the GitHub API rate limit for update checks |
| `ASSET_CDN_ORIGINS` | Optional | _(empty)_ | Comma-separated origins to recover a missing `/assets/*` file from |
| `PORT` | Auto | `3000` | HTTP server port (set by the local runtime) |
| `ISOTOPE_HOME` | Optional | `~/.isotope` | State directory: pid file, port, logs |

Not read by `server.mjs`, despite appearing in `.env.example`: `YEPAPI_KEY`
(the `/__ai/*` routes it refers to are fenced off at a 404 and have no handler) and
`SESSION_SECRET` (set by CI and release workflows but never consumed).

Setup env file behavior:
- `.env` is preferred.
- `yeh.env` is copied to `.env` when `.env` is missing.
- `ISOTOPE_ENV_FILE` is supported, copied to `.env`, and then used.
- Existing values are preserved. Setup does not overwrite Supabase values or blank out `ENABLE_ADMIN_MODE`.
- Missing `ENABLE_ADMIN_MODE` is set to `false`.

### Startup warnings

The server logs `[Config] ⚠️` warnings at boot for:
- Using the built-in Supabase project (not your own)
- `ADMIN_PASSWORD` at default value
- admin unlock methods not configured
- `SUPABASE_SERVICE_ROLE_KEY` missing or short
- `ADMIN_EMAIL` at placeholder default

---

## 11. First-Boot Setup Sequence

On first start, the server automatically:

1. **Patches bundles** — AI store, auth bundle, app bundle, invites bundle, Focus bundle
2. **Creates admin user** — calls Supabase Admin API to create `ADMIN_EMAIL` / `ADMIN_PASSWORD` user in `auth.users` if not already present
3. **Creates public.users row** — upserts `{id, email, username, plan_type:'ranker'}` for the admin
4. **DML backfills** — any data-fixup statements that run idempotently on startup
5. **Starts HTTP server** on `PORT`

---

## 12. Database Schema Architecture

**Which SQL file to run:** `isotope-complete.sql` is the authoritative fresh-install
schema and creates everything listed below — both the core and the community tables.
It is what `/__admin/schema` serves. `community-patch-v6.sql` is the cumulative
patch for installs that already have a schema, and is what `/__admin/patch` serves.
`isotope-schema.sql` (legacy v2) and `community-patch-v4.sql` are kept only so that
older instructions still resolve; prefer the two files above.

### Core tables

- `public.users` — extended profile, plan_type, coins, gems
- `public.user_profiles` — JSONB profile blob
- `public.user_points` — XP/points
- `public.user_stats_summary` — aggregated study stats
- `public.daily_user_stats` — per-day study seconds
- `public.study_sessions_log` — individual focus sessions

### Community tables

- `public.groups` + `public.group_members` — study groups
- `public.group_chat_messages` — group realtime chat
- `public.group_invites` — invite links with token + use-count
- `public.group_challenges` + `public.group_challenge_participants` — group challenges
- `public.group_announcements` + `public.group_milestones` — group activity
- `public.notifications` — user notification inbox
- `public.user_presence` — realtime online status

### Upgrade-only patches

- `leaderboard-rls-fix.sql` — required on installs created before the leaderboard
  RLS change. The old `stats_own` `FOR ALL` policy blocked public `SELECT` on
  `user_stats_summary` and `daily_user_stats`, which made the leaderboard render
  empty. Fresh installs from `isotope-complete.sql` already have the correct
  `stats_read_all` policy and do not need it.
- `performance-patch.sql`, `performance-indexes.sql` — indexes for RLS membership
  subqueries and leaderboard date sorts.

### Key architectural decisions

1. **`_is_group_member(group_id, user_id)`** — SECURITY DEFINER helper prevents RLS infinite recursion. Every group membership policy must use this function instead of direct `EXISTS (SELECT 1 FROM group_members …)`.
2. **`get_membership_snapshot()`** — always returns `ranker`/`active`/`2099` in self-hosted mode. Overrides the SaaS subscription check.
3. **`finish_session_sync`** — RPC must be called with the user's own JWT (not service_role), because it uses `auth.uid()` internally.
4. **Server-side Supabase proxy** — uses `SUPABASE_SERVICE_ROLE_KEY` only inside server handlers. Browser bundles receive the anon key only.

---

## 13. Operational Procedures

### Apply schema updates
1. Go to `/__admin/patch`
2. Enter Supabase PAT
3. Click **Apply All SQL Now**
4. Wait for all statements to complete (idempotent — safe to re-run)
5. Hard-reload the app (`/__admin/verify` to confirm)

### Create a new community event
1. Go to `/__admin/events`
2. Click **+ New Event**
3. Fill in title, type, host, dates, image gradient or URL
4. Check **Active** to make it visible immediately
5. Click **Save**

### Push past-dated events to future
1. Go to `/__admin/events`
2. Click **🔄 Refresh Past Dates**
3. Events with `start_time < now()` are pushed forward with 1–14 day offsets

### Diagnose a failing test
1. Go to `/__admin/verify`
2. Find the failing row
3. If it says "MISSING — apply patch v7": go to `/__admin/patch` → Apply All SQL
4. If it says "RLS RECURSION": the `_is_group_member` helper is missing or a legacy policy is still active — apply the patch

### Rotate admin credentials
1. Update `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your env vars / `.env`
2. Change the Supabase user password via Supabase Dashboard → Authentication → Users
3. Restart the server (the startup block will find the existing user and skip re-creation)

---

## 14. Quick Reference — All `/__admin/*` Routes

| Route | Method | Auth | Description |
|-------|--------|------|-------------|
| `/__admin` | GET | — | Redirects to `/__admin/verify` (or login) |
| `/__admin/login` | GET, POST | — | Unlock form. Accepts `ADMIN_SECRET` or a Supabase admin session; sets the `iso_admin` cookie at `Path=/` |
| `/__admin/verify` | GET | ✓ | Full automated test suite |
| `/__admin/patch` | GET | ✓ | SQL patch manager UI (serves `community-patch-v6.sql`) |
| `/__admin/patch.sql` | GET | ✓ | Raw SQL download |
| `/__admin/apply-sql` | POST | ✓ | Execute SQL via Management API proxy |
| `/__admin/schema` | GET | ✓ | Downloads `isotope-complete.sql` |
| `/__admin/roles` | GET, POST, DELETE | ✓ | Grant and revoke admin roles |
| `/__admin/sync` | GET | ✓ | Backup diagnostics console |
| `/__admin/sync/repair-user-backup` | POST | ✓ | Repair a user's backup (supports dry run) |
| `/__admin/storage` | GET | ✓ | Storage console |
| `/__admin/storage/cleanup-preview` | POST | ✓ | Preview storage cleanup for a user |
| `/__admin/storage/cleanup-apply` | POST | ✓ | Apply storage cleanup |
| `/__admin/browser-proof` | GET | ✓ | Start a real-browser proof run |
| `/__admin/browser-proof-page` | GET | ✓ | The page the browser executes |
| `/__admin/browser-proof-status` | GET | ✓ | Poll a proof run's status |
| `/__admin/browser-proof-result` | POST | run token | Proof callback — **exempt** from admin auth; authorized by per-run token |
| `/__admin/events*` | Any | ✓ | Removed-feature 404 JSON; Events admin is inactive |

✓ = requires `ADMIN_MODE_READY` (`ENABLE_ADMIN_MODE=true` **and** a service-role key)
plus `isAdminAuthed(req)`, which is satisfied by either a signed `iso_admin` cookie
or a Supabase login whose email is in `ADMIN_EMAIL`/`ADMIN_EMAILS` or which holds an
admin row in `user_roles`. `ADMIN_SECRET` is one way to obtain the cookie, not the
only one.

Note that `/api/update-now` is **not** in this table and does not require admin
mode — see §7.

---

_Last updated: 2026-08-27_
