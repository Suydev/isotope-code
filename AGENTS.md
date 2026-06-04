# IsotopeAI Self-Hosted — Agent Reference

> **For AI agents (Replit Agent, Cursor, Copilot, Claude, etc.)**
> Read this entire file before touching anything. No assumptions. No guessing.
> Every fact here was verified directly from the compiled JS bundles or the live DB.

---

## What this project is

`server.mjs` is a zero-dependency Node.js server that serves a **pre-built React SPA** (`public/assets/*.js` — 154 files, DO NOT rebuild or recompile them). It:

1. Patches bundles **in-memory at serve-time** — originals on disk are never modified
2. Intercepts `window.fetch` in the browser to replace missing Supabase Edge Functions
3. Proxies selected Supabase API calls via `/__supa/*` with service_role credentials kept server-side
4. Provides username-based auth (`/__auth/signup`, `/__auth/login`, `/__auth/profile`)
5. Serves admin panel (`/__admin/*`) only when `ENABLE_ADMIN_MODE=true`, the service-role key is server-side, and the browser unlocks with `ADMIN_SECRET`, allowed Supabase admin email, or `user_roles`

The compiled JS is the **source of truth** for what tables, columns, RPCs, and edge functions the app uses. When something breaks, read the compiled JS — not the Supabase docs.

---

## File map

| File | Role |
|------|------|
| `server.mjs` | Entire backend — patches, proxy, auth, fetch interceptors, events API, admin |
| `community-patch-v4.sql` | Idempotent schema: 23 tables, 1 view, 21 RPCs, RLS, 20+ indexes. Run once. |
| `events-expansion.sql` | Events ecosystem expansion: 16 tables, 5 RPCs, triggers, RLS. Apply after community-patch. |
| `isotope-schema.sql` | Base schema (older). Use `community-patch-v4.sql` for full setup. |
| `public/restore-and-launch.js` | Client bootstrap — DB-authoritative onboarding/session routing |
| `public/assets/` | 154 pre-built JS/CSS bundles. DO NOT modify directly. |
| `docs/index.html` | GitHub Pages documentation — full API reference |
| `.env.example` | Template for all environment variables |
| `CHANGELOG.md` | Complete version history |
| `AUDIT.md` | Full modification audit with rationale |

---

## Environment variables

```env
SUPABASE_URL=https://your-project-ref.supabase.co        # REQUIRED
SUPABASE_ANON_KEY=                                      # REQUIRED
SUPABASE_SERVICE_ROLE_KEY=                              # optional — owner/admin mode only
ENABLE_ADMIN_MODE=true                                    # optional — enables /__admin/*
ADMIN_SECRET=<random 32-char hex>                         # optional; local admin unlock secret
ADMIN_EMAIL=admin@yourdomain.com                          # optional; Supabase admin login/auto-create
ADMIN_EMAILS=admin@yourdomain.com,owner@example.com        # optional; comma-separated admin allowlist
ADMIN_PASSWORD=YourStrongPassword                         # optional; required with ADMIN_EMAIL for auto-create
PORT=5000                                                  # default: 3000
GEMINI_API_KEY=AIza...                                    # optional — AI assistant
GROQ_API_KEY=gsk_...                                      # optional — AI assistant
SUPABASE_ACCESS_TOKEN=sbp_...                             # optional — pre-fills /__admin/patch
SESSION_SECRET=<random hex>                               # optional — session signing
```

**Hard-fail on startup:** Server exits immediately if `SUPABASE_URL` or `SUPABASE_ANON_KEY` are missing or malformed. Service-role and PAT values are optional owner/admin mode credentials.

---

## How bundle patches work

```
startup: readFileSync(bundle) → regex-replace → cache patched buffer
request: serve cached patched buffer (original disk file unchanged)
```

| Function | Bundle | What it does |
|---|---|---|
| `getPatchedAppBundle()` | `App-pJGjDiPw.js` | demo=off, plan=ranker, Supabase URL/anon placeholders patched |
| `getPatchedFocusBundle()` | `Focus-BmgY-9vP.js` | blob URL fix, PiP polyfill |
| `getPatchedAuthBundle()` | `Auth-*.js` | removes unregistered Google OAuth button |
| `getPatchedAiStore()` | `useAIStore-*.js` | injects Gemini/Groq keys from `window.__IK__` |
| `getPatchedInvitesBundle()` | `useInvites-*.js` | fixes invite token param `invite_code → token` |
| `getPatchedFocusStore()` | `FocusStore-*.js` | disables circuit breaker (5-min lockout bug) |
| `injectKeys(buf)` | `index.html` | injects 5 scripts into every HTML response |

---

## Browser fetch interceptor (PREMIUM_SCRIPT)

Injected into every HTML page via `injectKeys()`. Wraps `window.fetch` before React loads.

```
window.fetch intercepts:
  /functions/v1/get-leaderboard         → _handleLeaderboard() → user_stats_summary REST
  /functions/v1/get-daily-leaderboard   → _handleLeaderboard()
  /functions/v1/get-group-leaderboard   → _handleLeaderboard()
  /functions/v1/get-group-analytics     → _handleLeaderboard()
  /functions/v1/finish-session          → _handleFinishSession() → finish_session_sync RPC
  /rpc/accept_invite (response)         → maps {ok:} → {success:} (safety net)
  sentry.io / ingest.sentry             → blocked silently
  Any Supabase JSON response            → deepPatch() → plan_type=ranker, billing_status=active
```

---

## Supabase schema — EXACT table/column/RPC reference

**Extracted directly from compiled JS bundles. Do not guess column names.**

### Tables and every column the frontend reads/writes

**`users`** — `id, email, name, username, avatar_url, plan_type, billing_status, plan_expires_at, access_ends_at, coins, gems, updated_at`

**`user_profiles`** — `user_id, profile_data (JSONB), created_at, updated_at`
- `profile_data` JSONB keys: `avatar, bio, isOnboarded, academic.institution, academic.grade, academic.targetExams, studyPreferences.studentStatus`

**`user_points`** — `user_id, points, lifetime_points, updated_at`

**`user_stats_summary`** — `user_id, total_study_seconds, total_hours, weekly_hours, monthly_hours, streak_days, current_streak, max_streak_days, longest_streak, session_count, total_sessions, last_study_date, last_session_at, updated_at`

**`daily_user_stats`** — `id, user_id, date, seconds_studied`
- ⚠️ Column is `date` (NOT `stat_date`) and `seconds_studied` (NOT `study_seconds`)
- UNIQUE constraint: `(user_id, date)`

**`study_sessions_log`** — `id (PK uuid), user_id, duration_minutes, subject, started_at, ended_at, created_at`
- ⚠️ Column is `duration_minutes` (NOT `duration_seconds`), `ended_at` (NOT `completed_at`)
- `ON CONFLICT (id)` is used — `id` must be a PRIMARY KEY

**`store_items`** — `id, name, description, price, currency, category, image, active, created_at`

**`user_inventory`** — `id, user_id, item_id, equipped, created_at`
- INSERT uses: `{user_id, item_id}` — no `purchased_at`
- UPDATE uses: `{equipped: true/false}`

**`groups`** — `id, name, description, cover_url, logo_url, category, slug, member_count, owner_id, is_public, max_members, is_active, visibility, settings (JSONB), fts (tsvector GENERATED), created_at, updated_at, deleted_at`
- `fts` is `GENERATED ALWAYS AS (to_tsvector('english', coalesce(name,'') || ' ' || coalesce(description,''))) STORED`

**`group_members`** — `id, group_id, user_id, role (owner/admin/member), joined_at`
- UNIQUE constraint: `(group_id, user_id)`

**`group_chat_messages`** — `id, group_id, user_id, content, message_type, reply_to_id, created_at, deleted_at`
- ⚠️ INSERT uses `user_id` (NOT `sender_id`) — RLS INSERT policy checks `user_id = auth.uid()`

**`group_invites`** — `id, group_id, token, invite_code, created_by, max_uses, uses_count, expires_at, is_active, created_at`
- ⚠️ JS searches by `token` column — NOT `invite_code`. `invite_code` kept for backward compat.
- `token` is a plain writable text column (NOT GENERATED)

**`group_challenges`** — `id, group_id, title, description, goal_type, goal_value, start_time, end_time, created_by, is_active, created_at`

**`group_challenge_participants`** — `challenge_id, user_id, progress, completed, completed_at, joined_at`
- UPSERT uses `ON CONFLICT (challenge_id, user_id)` — UNIQUE constraint required

**`group_announcements`** — `id, group_id, author_id, content, pinned, created_at`

**`group_milestones`** — `id, group_id, milestone_type, earned_at`

**`notifications`** — `id, user_id, type, title, body, data (JSONB), reference_id, read_at, created_at`
- ⚠️ Column is `read_at` (nullable timestamptz) NOT `is_read` (boolean)

**`user_presence`** — `user_id (PK), status (online/studying/offline), current_subject, last_seen, updated_at`

**`community_events`** — `id, title, event_type, description, host, start_time, end_time, image_gradient, image_url, tags (text[]), max_attendees, attendee_count, is_featured, is_active, creator_id, updated_at, created_at`

**`community_event_attendees`** — `event_id, user_id, joined_at`
- UNIQUE constraint: `(event_id, user_id)`

---

### RPC functions — exact parameter names

**CRITICAL:** Two JS files call `get_membership_snapshot` with different param names. Function MUST accept both:
```sql
-- App-pJGjDiPw.js calls:         .rpc("get_membership_snapshot", { p_user_id: userId })
-- Subscription-UaefsAtQ.js calls: .rpc("get_membership_snapshot", { target_user_id: userId })
-- Solution: COALESCE(p_user_id, target_user_id) — both DEFAULT NULL
```

| RPC | Exact JS call |
|-----|--------------|
| `is_premium_user` | `.rpc("is_premium_user", { uid: userId })` |
| `get_leaderboard` | `.rpc("get_leaderboard", { p_period: "weekly"\|"monthly"\|"alltime", p_limit: n, p_offset: n })` — NOTE: JS sends `p_type` but server intercepts it; DB function uses `p_period` |
| `get_group_leaderboard` | `.rpc("get_group_leaderboard", { p_group_id: uuid, p_limit: n })` |
| `get_invite_details` | `.rpc("get_invite_details", { p_code: token })` |
| `accept_invite` | `.rpc("accept_invite", { p_code: token })` — MUST return `{ success: boolean }` (NOT `{ok:}`) |
| `get_membership_snapshot` | `.rpc("get_membership_snapshot", { p_user_id: uuid })` OR `{ target_user_id: uuid }` |
| `get_group_analytics_from_snapshots` | `.rpc("get_group_analytics_from_snapshots", { p_group_id: uuid, p_days: int })` |
| `finish_session_sync` | Browser fetch override calls with `{p_session_id, p_action, p_duration_minutes, p_group_id, p_session_type, p_notes, p_ended_at}` — MUST use `p_duration_minutes` (not `p_duration_s`) and `p_group_id` (not `p_user_id`) |
| `join_community_event` | `.rpc("join_community_event", { p_event_id: uuid })` |
| `leave_community_event` | `.rpc("leave_community_event", { p_event_id: uuid })` |
| `purchase_store_item` | `.rpc("purchase_store_item", { p_user_id: uuid, p_item_id: uuid })` |

---

### Edge functions the JS calls (NONE deployed — all intercepted)

| Edge function | Intercepted by | Forwarded to |
|---|---|---|
| `functions.invoke("get-leaderboard", {body:{period, limit}})` | `_handleLeaderboard()` | `user_stats_summary` REST query |
| `functions.invoke("get-daily-leaderboard", {body:{groupId, limit}})` | `_handleLeaderboard()` | Same |
| `functions.invoke("get-group-leaderboard", ...)` | `_handleLeaderboard()` | Same |
| `functions.invoke("get-group-analytics", ...)` | `_handleLeaderboard()` | Same |
| `functions.invoke("finish-session", {body:{session_id, action, duration_minutes, ...}})` | `_handleFinishSession()` | `finish_session_sync` RPC |

---

## Key architectural decisions (with rationale)

### 1. IPv6 blocks direct PostgreSQL from Replit
**Impact:** No `pg`, `postgres`, or `drizzle` packages.  
**Solution:** Only use Supabase REST API + Management API for all DDL/DML.

### 2. service_role key is server-side only
**Why:** Admin, diagnostics, verification, schema apply, and selected proxy calls require elevated Supabase access.
**Rule:** Never inject the service-role key into browser bundles or docs.

### 3. `_is_group_member()` SECURITY DEFINER — mandatory for RLS
**Why:** Direct `SELECT FROM group_members` in RLS policies causes infinite recursion (PostgreSQL error `42P17`).  
**Rule:** ALL RLS policies that need to check group membership MUST use `public._is_group_member(group_id, auth.uid())`.  
**Tables affected:** group_members, groups, group_chat_messages, group_challenges, group_challenge_participants, group_announcements, group_invites, group_milestones

### 4. `get_leaderboard` — single 3-param signature only
**Why:** Two overloads (2-param and 3-param) cause PostgREST ambiguity.  
**Current state:** Only `(p_period text, p_limit int, p_offset int)` exists. The legacy 2-param version was dropped.

### 5. `daily_user_stats` actual column names
**Why:** The schema docs had aliases. Actual columns are `date` (not `stat_date`) and `seconds_studied` (not `study_seconds`).  
**Impact:** Any SQL or RPC that writes to `daily_user_stats` MUST use these exact names.

### 6. `study_sessions_log` actual column names
**Actual:** `duration_minutes` (not `duration_seconds`), `ended_at` (not `completed_at`).

### 7. `notifications.read_at` is timestamptz, not boolean
**Actual:** `read_at timestamptz NULL`. Unread = `WHERE read_at IS NULL`. Not a boolean column.

### 8. `group_chat_messages` INSERT uses `user_id` not `sender_id`
**Why:** The JS inserts `{user_id: auth.uid(), content, ...}`. No `sender_id` column exists.

### 9. Events route ordering — named routes before `:id` catch-all
**Why:** The events router uses segment-based routing (`seg0`, `seg1`). The generic `:id` handler (`seg0 && !seg1`) runs before named-route checks, so `/api/events/categories` was treated as an event UUID and returned a `22P02` PostgreSQL error.  
**Rule:** The `:id` handler in the events block MUST exclude all reserved route names: `categories`, `leaderboard`, `discover`.  
**Pattern:** `if (method==='GET' && seg0 && !seg1 && seg0 !== 'categories' && seg0 !== 'leaderboard' && seg0 !== 'discover')`

---

## Events Ecosystem — 16 new tables (events-expansion.sql)

Applied after `community-patch-v4.sql`. All tables have RLS enabled with service_role bypass.

| Table | Role |
|-------|------|
| `event_rsvp` | Per-user RSVP status: `going / interested / maybe / not_going`. UNIQUE `(event_id, user_id)`. |
| `event_messages` | Real-time event chat. Has `is_pinned`, `reply_to_id`, `reactions JSONB`. |
| `event_threads` | Discussion threads within events. Has `reply_count`, `is_pinned`, `is_resolved`. |
| `event_thread_replies` | Replies to threads. |
| `event_reactions` | Emoji reactions. UNIQUE `(event_id, user_id, emoji)`. |
| `event_resources` | Files/links attached to events. `resource_type`: `link / pdf / video / image / note / slides`. `uploaded_by` is NOT NULL. |
| `event_roles` | Per-event user roles: `organizer / moderator / speaker / helper`. |
| `event_presence` | Live presence. `status`: `online / away / offline`. Heartbeat via PATCH. |
| `event_analytics` | Engagement counters. UNIQUE `(event_id)`. Updated by triggers on `event_messages`, `event_reactions`, `event_rsvp`. |
| `event_feedback` | Post-event rating + comment. UNIQUE `(event_id, user_id)`. |
| `event_recordings` | Recording URLs. `status`: `processing / ready / failed`. |
| `event_reminders` | Per-user reminders. `remind_at` timestamptz. UNIQUE `(event_id, user_id, remind_at)`. |
| `event_categories` | Category master table with `slug`, `icon`, `color`. |
| `event_announcements` | Pinned announcements from organizers. `is_pinned` bool. |
| `event_pinned_messages` | Pinned chat messages. References `event_messages`. |
| `event_achievements` | Gamification: badges earned at events. UNIQUE `(event_id, user_id, badge_type)`. |

### Events RPCs (5 total)

| RPC | Params | Returns |
|-----|--------|---------|
| `get_event_full` | `p_event_id uuid, p_user_id uuid?` | Full event object with reactions + RSVP state |
| `discover_events` | `p_type text, p_limit int, p_offset int, p_user_id uuid?` | Events sorted by: upcoming / trending / featured / near_full / starting_soon |
| `get_event_leaderboard` | `p_type text, p_event_id uuid?, p_limit int` | Ranked list by: attendees / engagement / points |
| `get_event_stats` | `p_event_id uuid` | Aggregated analytics for one event |
| `upsert_event_rsvp` | `p_event_id uuid, p_user_id uuid, p_status text` | Updates RSVP + analytics trigger |

### Analytics triggers (auto-update `event_analytics`)

- `trg_event_msg_analytics` — fires on `event_messages` INSERT/DELETE → updates `chat_message_count`
- `trg_event_reaction_analytics` — fires on `event_reactions` INSERT/DELETE → updates `reaction_count`
- `trg_event_rsvp_analytics` — fires on `event_rsvp` INSERT/UPDATE/DELETE → updates `rsvp_going / interested / maybe / not_going`

---

## Events REST API endpoints (30+ routes at /api/events/*)

All routes live in `server.mjs` at the events router block. Auth is via `Authorization: Bearer <supabase_jwt>` header.  
**Anonymous calls** to most GET endpoints work with no auth (presence, analytics, categories, discover).  
**Mutating calls** (POST/PUT/PATCH/DELETE) require a valid JWT.

```
GET    /api/events                     → List events (limit, offset, type, category_id, group_id)
GET    /api/events/discover            → Discovery feed (type=upcoming|trending|featured|near_full|starting_soon)
GET    /api/events/categories          → All event categories
GET    /api/events/leaderboard         → Engagement leaderboard (type=attendees|engagement|points)
GET    /api/events/:id                 → Full event details (via get_event_full RPC)
GET    /api/events/:id/rsvp            → Current user's RSVP status
POST   /api/events/:id/rsvp            → Set RSVP status (status: going|interested|maybe|not_going)
GET    /api/events/:id/messages        → Chat messages (limit, before)
POST   /api/events/:id/messages        → Post chat message (content, reply_to_id?)
DELETE /api/events/:id/messages/:msgId → Delete own message
POST   /api/events/:id/messages/:msgId/pin   → Pin message (organizer only)
GET    /api/events/:id/threads         → Discussion threads (limit, offset)
POST   /api/events/:id/threads         → Create thread (title, content, is_question?)
GET    /api/events/:id/threads/:tid    → Single thread + replies
POST   /api/events/:id/threads/:tid/replies → Reply to thread
POST   /api/events/:id/threads/:tid/resolve → Mark thread resolved
GET    /api/events/:id/reactions       → Reaction counts + current user's reactions
POST   /api/events/:id/reactions       → Toggle reaction (emoji)
GET    /api/events/:id/resources       → Resources list
POST   /api/events/:id/resources       → Add resource (resource_type, title, url, description?)
DELETE /api/events/:id/resources/:rid  → Remove resource (uploader only)
GET    /api/events/:id/analytics       → Analytics (view count, RSVP breakdown, engagement score)
GET    /api/events/:id/feedback        → All feedback for event
POST   /api/events/:id/feedback        → Submit rating (1-5) + comment
GET    /api/events/:id/recordings      → All recordings
POST   /api/events/:id/recordings      → Add recording (title, url, duration_seconds?)
GET    /api/events/:id/announcements   → All announcements (pinned first)
POST   /api/events/:id/announcements   → Post announcement
GET    /api/events/:id/presence        → Live presence (total_active, by_status, attendees[])
PUT    /api/events/:id/presence        → Heartbeat / set status (status: online|away|offline)
DELETE /api/events/:id/presence        → Leave presence
GET    /api/events/:id/reminders       → Current user's reminders
POST   /api/events/:id/reminders       → Create reminder (remind_at ISO datetime)
DELETE /api/events/:id/reminders/:rid  → Delete reminder
GET    /api/events/:id/roles           → All roles for event
POST   /api/events/:id/roles           → Assign role (target_user_id, role)
DELETE /api/events/:id/roles/:roleId   → Remove role assignment
```

---

## How to apply schema changes

### One-click (recommended)
1. `PORT=5000 node server.mjs`
2. Open `/__admin/patch`
3. Paste Supabase PAT (from `supabase.com/dashboard/account/tokens`)
4. Click **🚀 Apply All SQL Now**

### Programmatic (agent-safe)
```
POST http://127.0.0.1:5000/__admin/apply-sql
X-Admin-Secret: <ADMIN_SECRET>
Content-Type: application/json

{ "pat": "<SUPABASE_ACCESS_TOKEN>", "sql": "...sql statement..." }
```
Returns `{ok: true}` on success or `{ok: false, body: "...error..."}`.

### Via GitHub REST API
See the full procedure in the section below for multi-file commits.

---

## How to push to GitHub (agent procedure)

Git commit/push is blocked in Replit main agent. Use GitHub REST API tree-based commits:

```javascript
// 1. Get HEAD commit SHA
GET /repos/Suydev/isotope-code/git/ref/heads/main → .object.sha

// 2. Get tree SHA from commit
GET /repos/Suydev/isotope-code/git/commits/{commitSha} → .tree.sha

// 3. Create blobs for each changed file
POST /repos/Suydev/isotope-code/git/blobs
{"content": "<base64>", "encoding": "base64"} → .sha

// 4. Create new tree
POST /repos/Suydev/isotope-code/git/trees
{"base_tree": treeSha, "tree": [{path, mode:"100644", type:"blob", sha: blobSha}]} → .sha

// 5. Create commit
POST /repos/Suydev/isotope-code/git/commits
{"message": "...", "tree": newTreeSha, "parents": [commitSha]} → .sha

// 6. Update ref
PATCH /repos/Suydev/isotope-code/git/refs/heads/main
{"sha": newCommitSha}
```

**Required headers:** `Authorization: Bearer <GITHUB_PAT>`, `Accept: application/vnd.github+json`, `X-GitHub-Api-Version: 2022-11-28`

---

## Admin endpoints

| Endpoint | Auth | What it does |
|---|---|---|
| `GET /__admin/patch` | Admin unlock | One-click schema apply UI |
| `GET /__admin/patch.sql` | Admin unlock | Download `community-patch-v4.sql` |
| `GET /__admin/schema` | Admin unlock | Download base schema SQL |
| `GET /__admin/verify` | Admin unlock | Diagnostic suite |
| `GET /__admin/events` | Admin unlock | Events management HTML UI |
| `GET /__admin/events.json` | Admin unlock | JSON list of all events |
| `POST /__admin/events/create` | Admin unlock | Create event |
| `POST /__admin/events/update` | Admin unlock | Update event (partial) |
| `POST /__admin/events/delete` | Admin unlock | Delete event + CASCADE |
| `POST /__admin/events/publish` | Admin unlock | Toggle `is_active` |
| `POST /__admin/events/refresh-dates` | Admin unlock | Push past events to future |
| `POST /__admin/apply-sql` | Admin unlock | Run SQL via Supabase Management API |
| `POST /__auth/signup` | — | `{username, password}` → new account |
| `POST /__auth/login` | — | `{username, password}` → session |
| `POST /__auth/profile` | user JWT | Deep-merge profile to Supabase |
| `ANY /__supa/*` | — | Reverse proxy (service_role added) |
| `GET /api/health` | — | `{status, aiKeys, supabaseProxy}` |
| `GET /api/version` | — | Deployed commit SHA |
| `GET /api/check-update` | — | Latest vs deployed SHA |

**Admin access:** Set `ENABLE_ADMIN_MODE=true` and `SUPABASE_SERVICE_ROLE_KEY`. Unlock `/__admin/*` with `ADMIN_SECRET`, `/__admin/login` using an allowed Supabase admin email, or an active `owner`/`admin`/`super_admin` row in `user_roles`.

---

## Compiled JS files to audit for debugging

| File | What it contains |
|---|---|
| `App-pJGjDiPw.js` | Main app — Supabase client, group operations, store, inventory |
| `Subscription-UaefsAtQ.js` | Plan/billing — calls `get_membership_snapshot` with `target_user_id` |
| `useInvites-D9RLFwf8.js` | Invite flow — `get_invite_details`, `accept_invite` |
| `sessionSync-mloIEnTd.js` | Session sync — calls `finish-session` edge function |
| `useLeaderboard-BpvH5FXA.js` | Leaderboard — edge functions + `user_stats_summary` |
| `useGroupChallenges-N8BLPr3m.js` | Challenge CRUD |
| `FocusStore-D5cRXSIr.js` | Store + inventory (`user_points`, `store_items`, `user_inventory`) |
| `GroupDiscovery-DUcFr2JQ.js` | Group search (uses `fts` column on `groups`) |
| `MemberProfile-D-l2e-2X.js` | User profiles + `user_stats_summary` |

**Audit method:**
```
\.from\("(\w+)"\)                      → table names
\.rpc\("(\w+)"                         → RPC names
functions\.invoke\("([^"]+)"           → edge function names
\.select\(([^)]{1,300})\)              → column names
\.insert\(\{([^}]{1,300})\}           → insert fields
```

---

## Gotchas — things that will bite you

1. **Do NOT rebuild bundles.** No build step. The 154 files in `public/assets/` are the app. Just `PORT=5000 node server.mjs`.

2. **PORT=5000 required.** The Replit workflow passes `PORT=5000`. Without it, server defaults to 3000 and Replit won't route traffic to it.

3. **Git commit/push blocked** in Replit main agent. Use GitHub REST API tree commits (see procedure above).

4. **`SUPABASE_ACCESS_TOKEN` (sbp_...)** ≠ **GitHub PAT (ghp_...)**. Different services, different tokens.

5. **Supabase Management API rate limit: ~120 req/min.** Add 300ms delay between statements and retry on `ThrottlerException`.

6. **`daily_user_stats` columns** are `date` and `seconds_studied` — NOT `stat_date`/`study_seconds`. Any SQL writing to this table must use the exact names.

7. **`study_sessions_log` columns** are `duration_minutes` and `ended_at` — NOT `duration_seconds`/`completed_at`.

8. **`notifications.read_at`** is a nullable timestamp — NOT a boolean `is_read`. Filter with `WHERE read_at IS NULL` for unread.

9. **`get_leaderboard` has exactly one overload** — `(p_period text, p_limit int, p_offset int)`. A second 2-param overload was dropped to fix PostgREST ambiguity. Don't add it back.

10. **`_is_group_member` MUST be used in RLS** — never use a bare `SELECT FROM group_members` subquery inside a policy on any table.

11. **`group_chat_messages` INSERT** checks `user_id = auth.uid()` in RLS — not `sender_id`. Column name is `user_id`.

12. **`accept_invite` returns `{success: boolean}`** — NOT `{ok:}`. The compiled JS checks `data.success`.

13. **`group_invites.token`** is a plain text column, writeable. NOT generated.

14. **`ORIG_SUPA_ANON` in server.mjs** (line ~79) is the original IsotopeAI project's key (the patch target for Patch 4b). It is NOT your project's key.
