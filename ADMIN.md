# IsotopeAI Self-Hosted — Admin Reference

Complete reference for every admin feature, endpoint, env var, and operational procedure.

---

## Quick Navigation

| Panel | URL | Purpose |
|-------|-----|---------|
| Test Suite | `/__admin/verify` | 63 automated tests — schema, RPCs, RLS, server health |
| SQL Patch | `/__admin/patch` | Apply community SQL patches to Supabase |
| Events | `/__admin/events` | CRUD management of community events |

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

## 2. Automated Test Suite — `/__admin/verify`

**URL:** `GET /__admin/verify`
**Auth:** Admin unlock
**Auto-refreshes:** every 30 seconds

Runs diagnostics against your configured Supabase project. In admin mode, table/RPC/bucket checks can use the server-side service-role key. Results are grouped by schema, RPC, RLS, server health, community/events, and storage.

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
| `store_items` | id, name, price, currency, category, image, active |
| `user_inventory` | id, user_id, item_id, equipped |
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
| `community_events` | id, title, event_type, host, start_time, image_gradient, image_url, attendee_count, updated_at |
| `community_event_attendees` | event_id, user_id, joined_at |

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

### Category 5: Server Health (7 tests)

| Check | What is verified |
|-------|-----------------|
| `/__admin/patch UI` | HTTP 200 |
| `/ (app root)` | HTTP 200 |
| `/api/community-events` | HTTP 200 + event count |
| `/api/health` | HTTP 200 |
| `/__admin/events UI` | HTTP 200 |
| `Supabase REST reachable` | HTTP < 500 |
| `Supabase Auth reachable` | HTTP < 500 |

### Category 6: Admin & Community Features (14 tests)

| Check | What is verified |
|-------|-----------------|
| `Admin user` | Exists in `auth.users` with matching `ADMIN_EMAIL` |
| `Admin row in public.users` | Username + plan_type in public table |
| `community_events has data` | At least 1 event row |
| `community_events RLS (anon can read)` | Anon key → HTTP 200, no recursion |
| `join_community_event(p_event_id)` | RPC exists |
| `leave_community_event(p_event_id)` | RPC exists |
| `_is_group_member(gid,uid)` | SECURITY DEFINER helper exists |
| `group_members table accessible` | HTTP 200 with service_role |
| `user_presence (realtime)` | Table accessible |
| `create_community_event RPC` | RPC exists (patch v7) |
| `update_community_event RPC` | RPC exists — probe with nil UUID |
| `delete_community_event RPC` | RPC exists |
| `get_event_attendees RPC` | RPC exists |
| `community_events (date freshness)` | Active events have future start dates |

**Target score: 63/63. If tests fail, use `/__admin/patch` to apply missing SQL.**

---

## 3. SQL Patch Manager — `/__admin/patch`

**URL:** `GET /__admin/patch`
**Auth:** Admin unlock

### What it does

Serves the full contents of `community-patch-v4.sql` as a runnable SQL patch. Provides:
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
| v7 | `community_events` columns (`updated_at`, `image_url`, `creator_id`); 4 admin RPCs; stale date refresh |

### SQL endpoint (proxy)

`POST /__admin/apply-sql` — accepts `{pat: string, sql: string}` and executes via Supabase Management API. Used by the one-click apply button. Avoids browser CORS restrictions on `api.supabase.com`.

`GET /__admin/patch.sql` — raw SQL download.

---

## 4. Community Events Admin — `/__admin/events`

**URL:** `GET /__admin/events`
**Auth:** Admin unlock

Full CRUD management UI for community events — no SQL editor needed.

### Admin UI features

- **List all events** — including inactive ones (uses service_role key to bypass `is_active` RLS filter)
- **Create event** — modal form with all fields
- **Edit event** — pre-fills modal from existing event data
- **Publish / Unpublish** — toggle `is_active` without opening the edit form
- **Delete** — with confirmation prompt; cascades to all attendees
- **Refresh Past Dates** — pushes all events with `start_time < now()` forward using a 1–14 day offset schedule

### Event API endpoints (all under `/__admin/`, protected by admin mode and `ADMIN_SECRET`)

| Method | Endpoint | Payload | Response |
|--------|----------|---------|----------|
| `GET` | `/__admin/events` | — | HTML management page |
| `GET` | `/__admin/events.json` | — | `[{id, title, event_type, …}]` |
| `POST` | `/__admin/events/create` | `{title*, event_type, description, host, start_time*, end_time, image_gradient, image_url, tags, max_attendees, is_featured, is_active}` | `{ok, event}` |
| `POST` | `/__admin/events/update` | `{id*, …any fields…}` | `{ok, event}` |
| `POST` | `/__admin/events/delete` | `{id*}` | `{ok}` |
| `POST` | `/__admin/events/publish` | `{id*, is_active*}` | `{ok}` |
| `POST` | `/__admin/events/refresh-dates` | `{}` | `{ok, updated, total}` |

`*` = required

### Event field reference

| Field | Type | Notes |
|-------|------|-------|
| `title` | text | Required. Max 200 chars |
| `event_type` | text | `webinar`, `workshop`, `marathon`, `challenge`, `ama` — default: `webinar` |
| `description` | text | Optional. Event description |
| `host` | text | Host name/handle |
| `start_time` | timestamptz | Required. ISO 8601 format |
| `end_time` | timestamptz | Optional. Defaults to start + 2 hours on date refresh |
| `image_gradient` | text | Tailwind gradient class, e.g. `from-purple-600 to-blue-500` |
| `image_url` | text | Optional. Real image URL. Overrides `image_gradient` in UI |
| `tags` | text[] | Comma-separated string or array |
| `max_attendees` | integer | Optional cap |
| `is_featured` | boolean | Featured events get highlighted in the UI |
| `is_active` | boolean | Only active events show to users (RLS filtered) |
| `attendee_count` | integer | Auto-managed by `join/leave_community_event` RPCs |

### Admin RPCs (service_role only)

| RPC | Signature | Returns |
|-----|-----------|---------|
| `create_community_event(...)` | All event fields as params | `{ok: bool, id: uuid}` |
| `update_community_event(p_id, ...)` | Any subset of fields (COALESCE) | `{ok: bool}` |
| `delete_community_event(p_id)` | UUID | `{ok: bool, deleted: bool}` |
| `get_event_attendees(p_event_id)` | UUID | `TABLE(user_id, username, name, joined_at)` |

### User RPCs (authenticated)

| RPC | What it does |
|-----|-------------|
| `join_community_event(p_event_id)` | Adds row to `community_event_attendees`, increments `attendee_count` |
| `leave_community_event(p_event_id)` | Removes row, decrements `attendee_count` |

---

## 5. Storage Buckets

Supabase storage buckets provisioned for this project:

| Bucket | Visibility | Size Limit | Allowed Types | Purpose |
|--------|-----------|-----------|---------------|---------|
| `avatars` | **Public** | 5 MB | JPEG, PNG, WebP, GIF | User profile photos |
| `user-content` | **Private** | 50 MB | JPEG, PNG, WebP, PDF, TXT | User study files (pre-existing) |
| `notes` | **Private** | 10 MB | JPEG, PNG, PDF, TXT, JSON | User study notes |
| `event-images` | **Public** | 5 MB | JPEG, PNG, WebP | Community event banners |

### Storage RLS policies

**`avatars` bucket:**
- Anyone can read (public bucket)
- Authenticated users can upload to their own folder (`{user_id}/filename`)
- Owners can update or delete their own files

**`notes` bucket:**
- Authenticated users can read, write, update, delete their own folder only
- No public access

**`event-images` bucket:**
- Anyone can read (public bucket)
- Only `service_role` key can write (admin-only uploads)

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

---

## 7. API Endpoints

| Method | Endpoint | Auth | What it does |
|--------|----------|------|-------------|
| `GET` | `/api/health` | None | Returns `{ok:true, version, uptime}` |
| `GET` | `/api/community-events` | None | Active events from Supabase (anon-readable) |
| `POST` | `/api/events/:id/attend` | None | Calls `join_community_event` RPC |
| `DELETE` | `/api/events/:id/leave` | None | Calls `leave_community_event` RPC |
| `GET` | `/api/version` | None | Returns git SHA + version from VERSION file |
| `POST` | `/api/restart` | None | Graceful restart (local process manager re-launches) |
| `GET` | `/api/check-update` | None | Checks GitHub for newer commit SHA |

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

The server intercepts and patches 5 compiled JavaScript bundles at request time:

| Bundle | What is patched |
|--------|----------------|
| `App bundle` (main JS) | `planType` hardcoded → `ranker`; circuit breaker disabled; community URL patched |
| `AI store` | `getApiKey()` → reads from `window.__IK__` (injected by server from env vars) |
| `Focus/AI bundle` | Replaces hardcoded production Supabase URL with self-hosted URL |
| `Auth bundle` | Username-as-email support; 4 auth flow patches |
| `Invites bundle` | `token_input` → `p_code` (accept_invite + get_invite_details) |

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
| `SUPABASE_SERVICE_ROLE_KEY` | Strongly recommended | _(none)_ | Bypasses RLS; needed for community features |
| `SUPABASE_ACCESS_TOKEN` | Yes (for patch) | _(none)_ | Management API PAT for one-click patch |
| `ADMIN_EMAIL` | Optional | _(empty)_ | Supabase admin email for browser unlock and optional bootstrap |
| `ADMIN_EMAILS` | Optional | _(empty)_ | Comma-separated Supabase admin email allowlist |
| `ADMIN_PASSWORD` | Optional | _(empty)_ | Admin account password for optional bootstrap |
| `ADMIN_SECRET` | Optional | _(empty)_ | Local admin unlock secret |
| `GROQ_API_KEY` | Optional | _(none)_ | AI text features (Groq/LLaMA) |
| `GEMINI_API_KEY` | Optional | _(none)_ | AI text features (Gemini) |
| `PORT` | Auto | `5000` | HTTP server port (set by the local runtime) |

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

### Core tables (required — in `isotope-schema.sql`)

- `public.users` — extended profile, plan_type, coins, gems
- `public.user_profiles` — JSONB profile blob
- `public.user_points` — XP/points
- `public.user_stats_summary` — aggregated study stats
- `public.daily_user_stats` — per-day study seconds
- `public.study_sessions_log` — individual focus sessions
- `public.store_items` / `public.user_inventory` — cosmetic shop

### Community tables (in `community-patch-v4.sql`)

- `public.groups` + `public.group_members` — study groups
- `public.group_chat_messages` — group realtime chat
- `public.group_invites` — invite links with token + use-count
- `public.group_challenges` + `public.group_challenge_participants` — group challenges
- `public.group_announcements` + `public.group_milestones` — group activity
- `public.notifications` — user notification inbox
- `public.user_presence` — realtime online status
- `public.community_events` + `public.community_event_attendees` — public events

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
| `/__admin/verify` | GET | ✓ | Full automated test suite (63 tests) |
| `/__admin/patch` | GET | ✓ | SQL patch manager UI |
| `/__admin/patch.sql` | GET | ✓ | Raw SQL download |
| `/__admin/apply-sql` | POST | ✓ | Execute SQL via Management API proxy |
| `/__admin/events` | GET | ✓ | Community events manager UI |
| `/__admin/events.json` | GET | ✓ | List all events (incl. inactive) as JSON |
| `/__admin/events/create` | POST | ✓ | Create new event |
| `/__admin/events/update` | POST | ✓ | Update event fields |
| `/__admin/events/delete` | POST | ✓ | Delete event (cascades attendees) |
| `/__admin/events/publish` | POST | ✓ | Toggle event `is_active` |
| `/__admin/events/refresh-dates` | POST | ✓ | Push past-dated events to future |

✓ = protected by admin mode and `ADMIN_SECRET`

---

_Last updated: v2.7.0 — 2026-06-01_
