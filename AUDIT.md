# IsotopeAI Self-Host — Full Modification Audit

> Last updated: 2026-06-04 (stabilization audit)
> Repository: [Suydev/isotope-code](https://github.com/Suydev/isotope-code)

This document describes every modification made to the original IsotopeAI application for self-hosting, premium unlock, community feature wiring, and production hardening.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Decisions](#architecture-decisions)
3. [Server — server.mjs](#server--servermjs)
4. [Bundle Patches (In-Memory)](#bundle-patches-in-memory)
5. [Onboarding Fix](#onboarding-fix)
6. [Database Schema — v1.0.0](#database-schema--v100)
7. [RLS Policy Audit](#rls-policy-audit)
8. [Production Hardening — v1.0.0](#production-hardening--v100)
9. [Storage System](#storage-system)
10. [Security Audit](#security-audit)
11. [Files Added / Modified](#files-added--modified)

---

## Overview

The original IsotopeAI is a Vite-built React SPA served from `isotopeai.in`. This fork replaces the CDN/hosting layer with a custom Node.js server (`server.mjs`) that:

1. Patches JS bundles **in-memory at serve-time** — originals on disk are never modified
2. Intercepts `window.fetch` in the browser to replace missing Supabase Edge Functions with real RPC calls
3. Proxies selected Supabase calls via `/__supa/*` with service_role credentials kept server-side
4. Provides username-based auth (`/__auth/signup`, `/__auth/login`, `/__auth/profile`)
5. Serves a full admin panel (`/__admin/*`) for schema management, event CRUD, and diagnostics

**Modification philosophy:**
- Original `.js`/`.css` bundle files are **never modified on disk**
- All patches are applied in-memory at serve-time (regex replace on buffered file contents)
- `server.mjs` is a single ESM file with zero npm dependencies (Node.js built-ins only)

---

## Architecture Decisions

### 1. IPv6 blocks direct PostgreSQL connections from Replit
**Impact:** Cannot use `pg` / `postgres` / `drizzle` packages.  
**Solution:** All DDL/DML via Supabase REST API (`/rest/v1/`) and Management API (`api.supabase.com/v1/`).

### 2. service_role key is server-side only
**Why:** Admin, diagnostics, schema verification, and proxy paths need elevated Supabase access.
**How:** `/__supa/*` proxy and server admin helpers add `Authorization: Bearer <SERVICE_KEY>` + `apikey: <SERVICE_KEY>` on the server.
**Security rule:** Service-role credentials are not injected into browser JavaScript. The built App bundle now contains non-secret Supabase placeholders that `server.mjs` replaces with the runtime URL and anon key at serve time.

### 3. Bundle patches are in-memory only
**Why:** Modifying built JS on disk breaks future updates and makes diffs unreadable.  
**How:** `fs.readFileSync()` once on startup → regex replace → cache patched buffer → serve from cache.

### 4. `community-patch-v4.sql` is the canonical schema source
**Rule:** All schema changes go in `community-patch-v4.sql`. Never edit `isotope-schema.sql`.

### 5. `_is_group_member()` SECURITY DEFINER helper
**Why:** All group table RLS policies that checked membership triggered infinite recursion (PostgreSQL `42P17`). The helper function uses `SECURITY DEFINER` to bypass RLS internally, breaking the loop.  
**Rule:** Any RLS policy checking group membership MUST use `public._is_group_member(group_id, auth.uid())`.

### 6. `token` column on `group_invites` is plain text
**Why:** The compiled JS writes to `token` directly. It cannot be a GENERATED column.

### 7. `accept_invite` must return `{success: boolean}`
**Why:** `useInvites-D9RLFwf8.js` checks `data.success`. The old RPC returned `{ok:}`.

### 8. Hard-fail startup on missing required Supabase credentials
**Why:** Silent fallback to wrong keys would cause subtle data corruption.  
**How:** the startup env loader exits if `SUPABASE_URL`, `SUPABASE_ANON_KEY`, or `SUPABASE_SERVICE_ROLE_KEY` are missing or malformed. `ADMIN_EMAIL` and `ADMIN_PASSWORD` are optional; admin-user verification is skipped when they are unset.

---

## Server — server.mjs

### Auth Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/__auth/signup` | POST | `{username, password}` → Supabase auth signup → creates `users` + `user_profiles` + `user_points` rows |
| `/__auth/login` | POST | `{username, password}` → Supabase password auth → returns `{session: {...}}` |
| `/__auth/profile` | POST/PATCH | Deep-merges `{display_name, bio, avatar_url}` into `user_profiles.profile_data` JSONB; syncs to `public.users` |

**Rate limiting:** 10 req/min/IP on signup + login (in-memory, IP-keyed Map with sliding window).

### Service Proxy

**`/__supa/*`** — reverse proxy to Supabase REST API. Adds:
- `apikey: SUPABASE_SERVICE_ROLE_KEY`
- `Authorization: Bearer SUPABASE_SERVICE_ROLE_KEY`
- `access-control-allow-origin: *`

Strips hop-by-hop headers. Browser code uses the anon key and user JWT; service-role credentials remain inside server handlers.

### Browser Inject Scripts

Scripts injected into every HTML page via `injectKeys(buf)`:

| Script | Injection point | Purpose |
|---|---|---|
| `ORIGIN_SCRIPT` | First in `<head>` | `window.__ISO_ORIGIN__ = location.origin` — OAuth redirect fix |
| `KEY_SCRIPT` | `<head>` | `window.__IK__ = {gemini, groq}` — AI keys (offline-safe Proxy) |
| `AUTH_GUARD_SCRIPT` | `<head>` (sync) | Redirects unauthenticated users before React loads |
| `USERNAME_AUTH_SCRIPT` | `<head>` | Overrides Supabase signIn for username lookup |
| `PREMIUM_SCRIPT` | `<head>` | Full fetch interceptor: plan patching, edge function replacement |

### PREMIUM_SCRIPT — Fetch Interceptor

Intercepts `window.fetch` before the app's Supabase client runs:

| Intercepted URL pattern | Handler | Result |
|---|---|---|
| `/functions/v1/get-leaderboard` | `_handleLeaderboard()` | Queries `user_stats_summary` REST → returns shaped leaderboard |
| `/functions/v1/get-daily-leaderboard` | `_handleLeaderboard()` | Same |
| `/functions/v1/get-group-leaderboard` | `_handleLeaderboard()` | Same |
| `/functions/v1/get-group-analytics` | `_handleLeaderboard()` | Same |
| `/functions/v1/finish-session` | `_handleFinishSession()` | Extracts user JWT → calls `finish_session_sync` RPC |
| `/rpc/accept_invite` response | Safety-net mapper | Maps `{ok:}` → `{success:}` if old function is cached |
| `sentry.io` / `ingest.sentry` | Blocked | Drop silently |
| Any Supabase JSON response | `deepPatch()` | `plan_type→"ranker"`, `billing_status→"active"`, `plan_expires_at→"2099-..."` |

### Profile Upgrade (`upgradeProfile()`)

On login and page load, upgrades the user's DB row:
```
PATCH /rest/v1/users?id=eq.{userId}
{ plan_type: "scholar", billing_status: "active", plan_expires_at: "2099-12-31T23:59:59.000Z" }
```
Fallback chain: `users.id` → `users.user_id` → `profiles.id`  
Deduplication: `sessionStorage.__iso_rls_upgraded__` — runs at most once per session.

---

## Bundle Patches (In-Memory)

### `App-pJGjDiPw.js` — Main App Bundle

| Patch | What changes | Effect |
|---|---|---|
| Patch 1 — Demo mode | `ge = () => !1` | `isDemoMode()` always false — shows real user data |
| Patch 2 — fetchUserData plan | `"scholar"` → `"ranker"` | Plan upgrade in async profile load |
| Patch 3 — Auth store init | Initial `planType: "ranker"` | Premium UI renders before async fetch |
| Patch 4b — Supabase keys | Disk-baked URL+key → env vars | Routes all Supabase calls to your project |

### `useAIStore-B2cv1FZz.js` — AI Store

```javascript
// BEFORE
async getApiKey(n) { const e = `ai_api_key_${n}`
// AFTER
async getApiKey(n) { if(window.__IK__?.[n]) return window.__IK__[n]; const e = `ai_api_key_${n}`
```
**Effect:** Reads AI keys from `window.__IK__` (env var injected) before IndexedDB.

### `Focus-BmgY-9vP.js` — Focus Bundle

| Patch | Effect |
|---|---|
| Blob/data URL fix | `blob:` and `data:` URLs skip Supabase URL transformer |
| Prompt override hook | `window.__isoBgP` allows background image UI customisation |
| **PiP polyfill** prepended | Enables Picture-in-Picture timer on Android + non-PiP browsers |

### `Auth-*.js` — Auth Bundle

Removes the Google OAuth button (domain not registered in Google Cloud Console — would throw error).

### `useInvites-*.js` — Invites Bundle

Rewrites invite token parameter names from `invite_code` to `token` (matches actual `group_invites.token` column).

### `FocusStore-*.js` — Focus Store

Patches circuit breaker function `O()` to always return `false` — eliminates the 5-minute session lockout bug.

---

## Onboarding Fix

**File modified on disk:** `public/assets/Onboarding-qvAqCBbb.js` (one-line edit)

### Bug
```javascript
// ORIGINAL — BUGGY
useEffect(() => {
  isProfileLoaded && profile?.isOnboarded && currentStep !== 7
    && navigate("/dashboard", { replace: true })
}, [profile?.isOnboarded, currentStep, isProfileLoaded, navigate])
```
Users who had previously completed onboarding on `isotopeai.in` have `isOnboarded: true` in Supabase. When that flag loaded (typically after step 2), the app redirected to dashboard — skipping steps 3–6.

### Fix
```javascript
// PATCHED
useEffect(() => {
  isProfileLoaded && profile?.isOnboarded && currentStep < 2
    && navigate("/dashboard", { replace: true })
}, [profile?.isOnboarded, currentStep, isProfileLoaded, navigate])
```
**Change:** `currentStep !== 7` → `currentStep < 2`  
Auto-redirect only fires when user hasn't started yet. Once they advance past step 1, the flag is ignored.

### Additional Fix — DB-Authoritative Routing

`restore-and-launch.js` fetches `user_profiles.profile_data` from Supabase before any routing decision. If `isOnboarded: true`, sets localStorage immediately before React loads. This means the DB is always the source of truth — not localStorage.

---

## Database Schema — v1.0.0

### 20 Tables

| Table | Key columns |
|---|---|
| `users` | `id, email, name, username, avatar_url, plan_type, billing_status, plan_expires_at, access_ends_at, coins, gems` |
| `user_profiles` | `user_id, profile_data (JSONB), created_at, updated_at` |
| `user_points` | `user_id, points, lifetime_points, updated_at` |
| `user_stats_summary` | `user_id, total_study_seconds, total_hours, weekly_hours, monthly_hours, current_streak, longest_streak, total_sessions, session_count, last_session_at` |
| `daily_user_stats` | `id, user_id, date, seconds_studied` |
| `study_sessions_log` | `id (PK), user_id, duration_minutes, subject, started_at, ended_at, created_at` |
| `store_items` | `id, name, description, price, currency, category, image, active` |
| `user_inventory` | `id, user_id, item_id, equipped, created_at` |
| `groups` | `id, name, description, cover_url, slug, member_count, owner_id, is_public, max_members, visibility, settings (JSONB), fts (tsvector generated), deleted_at` |
| `group_members` | `id, group_id, user_id, role (owner/admin/member), joined_at` |
| `group_chat_messages` | `id, group_id, user_id, content, message_type, reply_to_id, created_at, deleted_at` |
| `group_challenges` | `id, group_id, title, description, goal_type, goal_value, start_time, end_time, created_by, is_active` |
| `group_challenge_participants` | `challenge_id, user_id, progress, completed, completed_at, joined_at` — UNIQUE(challenge_id, user_id) |
| `group_announcements` | `id, group_id, author_id, content, pinned, created_at` |
| `group_invites` | `id, group_id, token, invite_code, created_by, max_uses, uses_count, expires_at, is_active` |
| `group_milestones` | `id, group_id, milestone_type, earned_at` |
| `notifications` | `id, user_id, type, title, body, data (JSONB), reference_id, read_at, created_at` |
| `user_presence` | `user_id (PK), status, current_subject, last_seen, updated_at` |
| `community_events` | `id, title, event_type, description, host, start_time, end_time, image_gradient, image_url, tags, max_attendees, attendee_count, is_featured, is_active, creator_id, updated_at` |
| `community_event_attendees` | `event_id, user_id, joined_at` — UNIQUE(event_id, user_id) |

### 16 RPC Functions

| Function | Params | Auth |
|---|---|---|
| `get_leaderboard` | `p_period, p_limit, p_offset` | anon/auth/service_role |
| `get_group_leaderboard` | `p_group_id, p_limit` | anon/auth/service_role |
| `get_invite_details` | `p_code` | anon/auth/service_role |
| `accept_invite` | `p_code` | authenticated |
| `is_premium_user` | `uid` | anon/auth/service_role |
| `get_membership_snapshot` | `p_user_id` or `target_user_id` | anon/auth/service_role |
| `get_group_analytics_from_snapshots` | `p_group_id, p_days` | anon/auth/service_role |
| `finish_session_sync` | `p_session_id, p_duration_s, p_subject, p_session_type, p_user_id` | auth/service_role |
| `join_community_event` | `p_event_id` | authenticated (SECURITY DEFINER) |
| `leave_community_event` | `p_event_id` | authenticated (SECURITY DEFINER) |
| `create_community_event` | all event fields | service_role only |
| `update_community_event` | `p_id` + partial fields | service_role only |
| `delete_community_event` | `p_id` | service_role only |
| `get_event_attendees` | `p_event_id` | auth/service_role |
| `purchase_store_item` | `p_user_id, p_item_id` | auth/service_role |
| `expire_stale_presence` | — | service_role |
| `_is_group_member` | `gid, uid` | SECURITY DEFINER (internal) |

### Auto-Trigger: `on_auth_user_created`
Fires after every new Supabase signup:
1. Creates `users` row — `plan_type='scholar'`, `billing_status='active'`, expiry `2099-12-31`
2. Creates `user_profiles` row — empty JSONB
3. Creates `user_points` row — 0 points

---

## RLS Policy Audit

### Infinite Recursion Fix (applied v2.2.0)

**Root cause:** `gm_read` policy on `group_members` contained a self-referential subquery:
```sql
-- BROKEN
CREATE POLICY gm_read ON public.group_members FOR SELECT USING (
  group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
  OR auth.role() = 'authenticated'
);
```
PostgreSQL evaluates the subquery through the same `gm_read` policy → infinite recursion → error `42P17`.

**Fix:** `_is_group_member(gid uuid, uid uuid)` — `SECURITY DEFINER` SQL function. Bypasses RLS when checking membership.

**Tables fixed:** `group_members`, `groups`, `group_chat_messages`, `group_challenges`, `group_challenge_participants`, `group_announcements`, `group_invites`, `group_milestones`

### Current RLS Policies (v1.0.0)

Every table has RLS enabled. Key policies:

| Table | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `users` | own row | service_role | own row | service_role |
| `groups` | public or member | authenticated | owner/admin | owner |
| `group_members` | own or member | authenticated | self | self/service_role |
| `group_chat_messages` | group members | group members (`user_id=auth.uid()`) | own | own |
| `notifications` | own | service_role | own | own |
| `user_presence` | authenticated | auth (upsert) | own | own |
| `community_events` | `is_active=true` | service_role | service_role | service_role |
| `store_items` | authenticated | service_role | service_role | service_role |

---

## Production Hardening — v1.0.0

### Performance Indexes (18 new indexes)

```sql
-- Chat: ordered by time within group (core chat query)
idx_group_chat_messages_group_created (group_id, created_at DESC)
-- Members: joint lookup + user-centric lookup
idx_group_members_group_user (group_id, user_id)
idx_group_members_user (user_id)
-- Notifications: ordered feed + unread filter
idx_notifications_user_created (user_id, created_at DESC)
idx_notifications_unread (user_id, read_at) WHERE read_at IS NULL
-- Events: active-only ordered list
idx_community_events_active_start (is_active, start_time ASC) WHERE is_active = true
-- Stats: leaderboard ordering
idx_user_stats_hours (total_hours DESC)
-- Invites: token + code lookups
idx_group_invites_code (invite_code) WHERE is_active = true
idx_group_invites_token (token) WHERE is_active = true
-- + 9 more covering challenges, participants, sessions, inventory, presence
```

### Cascade Delete Constraints

| Child table | On DELETE parent |
|---|---|
| `group_chat_messages` | CASCADE when `groups` row deleted |
| `group_members` | CASCADE when `groups` row deleted |
| `community_event_attendees` | CASCADE when `community_events` row deleted |
| `group_challenge_participants` | CASCADE when `group_challenges` row deleted |

### Deduplication Constraints

- `UNIQUE (event_id, user_id)` on `community_event_attendees` — no double-attending
- `UNIQUE (user_id, type, reference_id) WHERE reference_id IS NOT NULL` on `notifications` — no duplicate notifications

### New Atomic RPCs

| RPC | Atomicity guarantee |
|---|---|
| `purchase_store_item` | Checks ownership + balance → deducts coins → inserts inventory in one transaction |
| `finish_session_sync` | Upserts `daily_user_stats` + `user_stats_summary` + logs session — all or nothing |
| `expire_stale_presence` | Bulk UPDATE with single WHERE clause — safe to run on a schedule |

### Cleanup Mechanisms

- **Notification cleanup trigger** — after INSERT, deletes notifications older than 90 days for that user
- **`expire_stale_presence()`** — call on a cron schedule; marks users offline after 2-min inactivity

---

## Storage System

### Buckets

| Bucket | Public | Max size | Allowed types |
|---|---|---|---|
| `avatars` | ✅ | 5 MB | JPEG, PNG, WebP, GIF |
| `event-images` | ✅ | 10 MB | JPEG, PNG, WebP |
| `user-content` | ❌ | 50 MB | Any |
| `notes` | ❌ | 10 MB | Any |

### RLS Policies

| Bucket | Read | Write |
|---|---|---|
| `avatars` | Public (no auth) | Authenticated, own folder `/{user_id}/` |
| `event-images` | Public (no auth) | service_role only |
| `user-content` | Owner (`/{user_id}/`) | Owner |
| `notes` | Owner (`/{user_id}/`) | Owner |

---

## Security Audit

### Secrets — What is safe to commit
- All bundle files in `public/assets/` — client-side JS, already public on isotopeai.in
- `server.mjs` — zero hardcoded secrets (all keys from env vars)
- `isotope-schema.sql`, `community-patch-v4.sql` — no credentials
- All `.md` files

### Secrets — What must NOT be committed
- `.env` — contains service_role key, PAT, API keys
- Any `.env.*` except `.env.example`

### Auth security model
- Passwords: hashed by Supabase Auth (bcrypt)
- Sessions: JWT with configurable expiry
- Admin panel: disabled by default; `ENABLE_ADMIN_MODE=true` plus `ADMIN_SECRET` protects `/__admin/*`
- Rate limiting: 10 req/min/IP on all auth endpoints
- Body size limit: 1 MB on all POST handlers (prevents memory exhaustion)

### Known intentional exposure
The service_role key must never be injected into `App-pJGjDiPw.js` or delivered to browsers. The committed bundle uses placeholders and `server.mjs` replaces them with the runtime Supabase URL and anon key only.

---

## Files Added / Modified

### Added files

| File | Description |
|------|-------------|
| `server.mjs` | Complete Node.js backend (was Vite dev server) — patches, proxy, auth, admin |
| `community-patch-v4.sql` | Full idempotent schema (v4–v7): 20 tables, 16 RPCs, RLS, indexes |
| `isotope-schema.sql` | Base schema snapshot |
| `.env.example` | Environment variable template |
| `README.md` | Full setup guide |
| `CHANGELOG.md` | Complete version history |
| `AUDIT.md` | This file |
| `AGENTS.md` | AI agent reference |
| `ADMIN.md` | Admin panel operations reference |
| `public/restore-and-launch.js` | DB-authoritative client bootstrap |

### Modified files

| File | Change |
|------|--------|
| `public/assets/Onboarding-qvAqCBbb.js` | Single-line onboarding redirect fix (`!== 7` → `< 2`) |
| `public/sw.js` | Cache bypass headers; excludes patched bundles from SW cache |

### Files NOT modified (patched in-memory at serve-time)

`App-pJGjDiPw.js`, `Focus-BmgY-9vP.js`, `useAIStore-B2cv1FZz.js`, `Auth-*.js`, `useInvites-*.js`, `FocusStore-*.js`

---

*Audit last updated: 2026-06-02 — v1.0.0 production release*
