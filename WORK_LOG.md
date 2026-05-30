# IsotopeAI Self-Host — Complete Work Log

> **For the next AI:** Read this file first. It tells you exactly what was done, what the current state is, what still needs doing, and where every important file lives. Do not redo anything listed here.

---

## Project Overview

**IsotopeAI** is a self-hosted fork of IsotopeAI (an AI-powered study planner for JEE/NEET students). The goal is:
- Everyone gets **Ranker** tier (premium) for free — no subscriptions, no paywalls
- Community features work via the user's own Supabase project
- All 272 original files are preserved; modifications are server-side patches (no build step needed)

**GitHub repo:** `github.com/Suydev/isotope-code`  
**Replit workflow:** `cd artifacts/isotope && PORT=3000 node server.mjs`  
**Self-hosted Supabase:** `vteqquoqvksshmfhuepu.supabase.co` (Singapore region)

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
  └─► Everything else               →  direct to Supabase (vteqquoqvksshmfhuepu.supabase.co)
```

---

## Supabase Setup Status

### Project
- **URL:** `https://vteqquoqvksshmfhuepu.supabase.co`
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
Our URL is in `SUPA_URL_DEFAULT` = `https://vteqquoqvksshmfhuepu.supabase.co`.  
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

## Key Constants in server.mjs

```js
ORIG_SUPA_URL   = 'https://rcnekgzbdlwhcpmpoogz.supabase.co'   // DO NOT CHANGE
ORIG_SUPA_ANON  = 'eyJhbGciOiJIUzI1NiIsIn...'                  // DO NOT CHANGE
SUPA_URL_DEFAULT = 'https://vteqquoqvksshmfhuepu.supabase.co'  // our project
SUPA_ANON_DEFAULT = 'sb_publishable_yUv_GZLf7...'              // our anon key
CUSTOM_SUPA      = true  (always, since SUPA_URL ≠ ORIG_SUPA_URL)
```

**ORIG_SUPA_URL and ORIG_SUPA_ANON must never change** — they are the exact strings baked into the compiled `App-pJGjDiPw.js` bundle. If the bundle is ever recompiled, update them.

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
| Community RLS full bypass | `SUPABASE_SERVICE_ROLE_KEY` not set | Add service_role key to Replit Secrets |
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
| latest | Hardcoded self-hosted Supabase URL/key + ORIG_* constants + this work log |
