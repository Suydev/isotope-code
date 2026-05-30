# IsotopeAI Self-Host — Full Modification Audit

> Last updated: 2026-05-30  
> This document describes every modification made to the original IsotopeAI application for self-hosting and premium feature unlock.

---

## Table of Contents

1. [Overview](#overview)
2. [Server (`server.mjs`)](#server-servermjs)
3. [Bundle Patches](#bundle-patches)
4. [Onboarding Fix](#onboarding-fix)
5. [Database Schema](#database-schema)
6. [Supporting Files](#supporting-files)
7. [Security Considerations](#security-considerations)

---

## Overview

The original IsotopeAI is a Vite-built React SPA served from `isotopeai.in`. This fork replaces the CDN/hosting layer with a custom Node.js server (`server.mjs`) that intercepts asset delivery to apply runtime patches. No source code was recompiled — all modifications are runtime transforms on the pre-built bundles.

**Modification philosophy:**
- Original `.js`/`.css` bundle files are never modified on disk (except `Onboarding-qvAqCBbb.js`)
- All patches are applied in memory at serve-time
- The server is a single ESM file with no framework dependencies beyond Node.js built-ins

---

## Server (`server.mjs`)

### 1. Premium Bypass — Client-Side Fetch Interceptor

**File:** `server.mjs` → `PREMIUM_SCRIPT`  
**Injection point:** Injected into `</head>` of every HTML response  
**Mechanism:** Overrides `window.fetch` to intercept all Supabase REST/RPC responses

```
Before patch: Supabase returns { plan_type: "free", billing_status: "free" }
After patch:  Supabase returns { plan_type: "ranker", billing_status: "active" }
```

**Fields patched in every Supabase JSON response (deep recursive):**
| Field | Original | Patched |
|-------|----------|---------|
| `plan_type` | `"free"` / `"scholar"` | `"ranker"` |
| `billing_status` | `"free"` | `"active"` |
| `plan_expires_at` | `null` | `"2099-12-31T23:59:59.000Z"` |
| `access_ends_at` | `null` | `"2099-12-31T23:59:59.000Z"` |

**Why `ranker` not `scholar`:** `ranker` is the highest tier in IsotopeAI. `scholar` is also premium but one tier below. The response patcher uses `ranker`; the DB profile upgrade uses `scholar` (required for `is_premium_user()` RLS compatibility).

---

### 2. Profile Upgrade — Real Supabase DB Write

**File:** `server.mjs` → `PREMIUM_SCRIPT` → `upgradeProfile()`  
**Trigger:** On login (auth token response) and on page load (if existing session found in localStorage)  
**Method:** `PATCH /rest/v1/users?id=eq.{userId}` with user's own JWT

```json
{
  "plan_type": "scholar",
  "billing_status": "active",
  "plan_expires_at": "2099-12-31T23:59:59.000Z",
  "access_ends_at": "2099-12-31T23:59:59.000Z"
}
```

**Why needed:** Community features (groups, challenges, leaderboard) use PostgreSQL RLS policies that call `is_premium_user()`. Since RLS runs server-side in Supabase, the client-side fetch interceptor alone is not enough. This patch writes `plan_type='scholar'` directly to the `users` table so `is_premium_user()` returns `true` for RLS evaluation.

**Fallback chain:** Tries `users` table (column `id`) → `users` table (column `user_id`) → `profiles` table  
**Deduplication:** Uses `sessionStorage.__iso_rls_upgraded__` to run at most once per session  
**One-time reload:** After successful upgrade, triggers one page reload to flush React Query cache

---

### 3. Supabase Service-Role Proxy

**Endpoint:** `/__supa/*` → proxied to `https://{supabase-host}/...`  
**Auth:** Uses `SUPABASE_SERVICE_ROLE_KEY` if set; falls back to user JWT  
**Effect:** With service_role key, all Supabase requests bypass RLS entirely  
**Headers forwarded:** All except hop-by-hop (host, connection, transfer-encoding, etc.)  
**CORS headers added:** `access-control-allow-origin: *` on all proxy responses

---

### 4. AI Key Injection

**File:** `server.mjs` → `KEY_SCRIPT`  
**Injection point:** `</head>` of every HTML response (before PREMIUM_SCRIPT)  
**Keys supported:** `GEMINI_API_KEY`, `GROQ_API_KEY`

```javascript
window.__IK__ = { gemini: "...", groq: "..." }
```

Keys are served via a `Proxy` object that returns `undefined` when `navigator.onLine` is false, preventing offline key leakage.

---

### 5. OAuth Origin Fix

**File:** `server.mjs` → `ORIGIN_SCRIPT`  
**Injection point:** First script in `</head>`

```javascript
window.__ISO_ORIGIN__ = window.location.origin;
```

Sets the OAuth redirect origin dynamically, required because the app is served from a non-standard domain (Replit preview proxy).

---

### 6. Custom Supabase Project Support

**File:** `server.mjs` lines 47–65  
**Env vars:** `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

When `SUPABASE_URL` differs from the hardcoded original:
- App bundle (`App-pJGjDiPw.js`) is patched at runtime to replace the hardcoded URL and anon key
- Server proxy (`/__supa/*`) uses the custom host
- All client-side Supabase calls go to the custom project

---

## Bundle Patches

### App Bundle: `public/assets/App-pJGjDiPw.js`

Patched in memory via `getPatchedAppBundle()`. Three string replacements:

#### Patch 1 — Demo Mode Disable

```javascript
// BEFORE
ge = () => typeof window > "u" ? !1 : Ys(window.location.pathname) || window.sessionStorage.getItem(Et) === "1",

// AFTER
ge = () => !1,
```

**Effect:** `isDemoMode()` always returns `false`. Prevents the app from loading demo data, demo user profile, and demo study sessions. Without this patch, the app defaults to demo content instead of real user data.

#### Patch 2 — fetchUserData Plan Override

```javascript
// BEFORE
planType: "scholar",
    planExpiresAt: k ?.access_ends_at

// AFTER
planType: "ranker",
    planExpiresAt: k ?.access_ends_at
```

**Effect:** When `fetchUserData()` returns a grandfathered `scholar` plan, it's upgraded to `ranker`. This covers the code path where the Supabase `get_membership_snapshot` RPC returns `scholar`.

#### Patch 3 — Initial Auth Store State

```javascript
// BEFORE
planType: "scholar",
    planExpiresAt: null,
    accessSource: "grandfathered"

// AFTER
planType: "ranker",
    planExpiresAt: null,
    accessSource: "grandfathered"
```

**Effect:** The Zustand auth store initializes with `planType: "ranker"`. Before the async Supabase profile fetch completes, the app already renders premium features.

#### Patch 4 — Custom Supabase URL/Key (conditional)

Only applied when `SUPABASE_URL` env var is set to a different project:

```javascript
// All occurrences of the original URL replaced
"https://rcnekgzbdlwhcpmpoogz.supabase.co"  →  "https://your-project.supabase.co"
// Original anon key replaced
"eyJhbGci...original..."  →  "eyJhbGci...your-key..."
```

---

### AI Store: `public/assets/useAIStore-B2cv1FZz.js`

Patched in memory via `getPatchedAiStore()`. One string replacement:

```javascript
// BEFORE
async getApiKey(n) {
    const e = `ai_api_key_${n}`

// AFTER
async getApiKey(n) {
    if(typeof window!=="undefined"&&window.__IK__&&window.__IK__[n])return window.__IK__[n];
    const e = `ai_api_key_${n}`
```

**Effect:** Before reading from IndexedDB, checks `window.__IK__` (injected by KEY_SCRIPT). Allows server-provided AI keys (Gemini, Groq) to be used without users manually entering them in settings.

---

### Focus Bundle: `public/assets/Focus-BmgY-9vP.js`

Patched in memory via `getPatchedFocusBundle()`. Two URL-handling fixes + PiP polyfill prepended:

#### URL Patch 1 — Background Image Blob/Data URL Fix

```javascript
// BEFORE
const S = sn(v);

// AFTER
const S = /^(blob:|data:)/i.test(v) ? v : sn(v);
```

**Effect:** Prevents `blob:` and `data:` URLs from being processed through Supabase Storage URL transformer, which would corrupt them.

#### URL Patch 2 — Prompt Override Hook

```javascript
// BEFORE
const v = prompt("Enter the URL of the image...");

// AFTER
const v = (window.__isoBgP || prompt)("Enter the URL of the image...");
```

**Effect:** Allows the background image prompt to be overridden by `window.__isoBgP` for custom UI integration.

#### PiP (Picture-in-Picture) Polyfill

A full `documentPictureInPicture` API polyfill is prepended to the Focus bundle. This enables the floating focus timer overlay on:
- **Android** (renders as a floating card in the bottom-right corner with blur/glassmorphism)
- **Browsers without PiP support**

The polyfill creates a draggable overlay window that mimics the PiP API surface (`document`, `close`, `addEventListener('pagehide')`). On Android, it renders as a compact card with hardware-accelerated backdrop-filter styling.

---

## Onboarding Fix

**File modified on disk:** `public/assets/Onboarding-qvAqCBbb.js`  
**Type:** Direct file edit (not runtime patch)

### Bug Description

The `V` (main Onboarding) component had this `useEffect`:

```javascript
// ORIGINAL — BUGGY
useEffect(() => {
  isProfileLoaded && profile?.isOnboarded && currentStep !== 7
    && navigate("/dashboard", { replace: true })
}, [profile?.isOnboarded, currentStep, isProfileLoaded, navigate])
```

**Symptom:** After completing steps 1–2, the remaining steps 3–6 were automatically skipped.

**Root cause:** Users who previously completed onboarding on the original `isotopeai.in` have `isOnboarded: true` in their Supabase profile. Since both instances share the same Supabase project, this flag loads asynchronously after the user starts onboarding on the self-hosted version. Once it loads (typically after step 2), the condition `profile.isOnboarded && currentStep !== 7` evaluates to `true` and immediately redirects to `/dashboard`.

### Fix Applied

```javascript
// PATCHED — FIXED
useEffect(() => {
  isProfileLoaded && profile?.isOnboarded && currentStep < 2
    && navigate("/dashboard", { replace: true })
}, [profile?.isOnboarded, currentStep, isProfileLoaded, navigate])
```

**Change:** `currentStep !== 7` → `currentStep < 2`

**Effect:** The auto-redirect only fires when the user is at step 1 (hasn't started). Once they advance to step 2+, the profile's `isOnboarded` flag no longer interrupts them. Step 7 (the completion screen) is naturally handled because `7 < 2` is false.

---

## Database Schema

**File:** `isotope-schema.sql`

### Tables Created (16)

| Table | Purpose |
|-------|---------|
| `users` | User accounts — plan type, billing status, expiry |
| `user_profiles` | Onboarding data, settings, academic info (JSONB) |
| `user_points` | Gamification — current and lifetime points |
| `user_stats_summary` | Aggregated study stats — hours, streaks, sessions |
| `daily_user_stats` | Per-day study seconds — used in group analytics |
| `study_sessions_log` | Individual focus sessions — duration, subject, time |
| `store_items` | Reward shop items (cosmetics, badges) |
| `user_inventory` | Items owned by each user |
| `groups` | Community study groups |
| `group_members` | Group membership with roles (owner/member) |
| `group_chat_messages` | In-group messages, with pin support |
| `group_challenges` | Timed group study challenges |
| `group_challenge_participants` | Per-user challenge progress and completion |
| `group_announcements` | Group-level pinned announcements |
| `group_invites` | Invite tokens with use limits and expiry |
| `group_milestones` | Group achievement milestones |

### RPC Functions (4)

| Function | Description |
|----------|-------------|
| `get_membership_snapshot(user_id)` | Returns effective plan, billing status, expiry — called on every app load |
| `is_premium_user()` | Boolean check used in RLS policies — returns true for scholar/ranker plan_type |
| `accept_invite(token)` | Validates and consumes an invite token, adds user to group |
| `get_invite_details(token)` | Returns group info for an invite token (used in invite preview UI) |
| `get_group_analytics_from_snapshots(group_id)` | Aggregates 30-day study hours for a group |

### Auto-Trigger

`on_auth_user_created` fires after every new Supabase signup and:
1. Creates a `users` row with `plan_type='scholar'`, `billing_status='active'`, expiry `2099-12-31`
2. Creates an empty `user_profiles` row
3. Creates a `user_points` row with `0` points

**Effect:** Every new user on a self-hosted instance gets Scholar tier automatically — no bypass scripts needed for fresh signups.

---

## Supporting Files

### Added files

| File | Description |
|------|-------------|
| `scripts/setup.sh` | Universal setup script — checks Node.js, installs deps, creates `.env` |
| `scripts/start-linux.sh` | Linux/Ubuntu launcher — loads `.env`, starts server |
| `scripts/start-mac.sh` | macOS launcher — auto-opens browser |
| `scripts/start-windows.bat` | Windows batch launcher — opens browser, reads `.env` |
| `scripts/start-android.sh` | Termux (Android) launcher — installs Node if missing |
| `Dockerfile` | Minimal Alpine-based Docker image |
| `docker-compose.yml` | Docker Compose with health check and env passthrough |
| `.env.example` | Environment variable template with documentation |
| `isotope-schema.sql` | Complete PostgreSQL schema for fresh Supabase project |
| `README.md` | Full setup guide, architecture overview, configuration |
| `AUDIT.md` | This file |

### Modified files (original preserved at runtime)

| File | What changed |
|------|-------------|
| `server.mjs` | Complete rewrite from Vite dev server to custom Node.js HTTP server with all patches |
| `public/assets/Onboarding-qvAqCBbb.js` | Single-line onboarding redirect fix (`!== 7` → `< 2`) |
| `public/sw.js` | Cache bypass headers added to prevent stale bundle serving |

---

## Security Considerations

### What is safe to commit
- All bundle files in `public/assets/` — these are client-side JS, already public on isotopeai.in
- `server.mjs` — no secrets hardcoded (all keys via env vars)
- `isotope-schema.sql` — no credentials
- All scripts, Dockerfile, README, AUDIT

### What must NOT be committed
- `.env` — contains service_role key and API keys
- Any file matching `.env.*` (except `.env.example`)

### The hardcoded Supabase anon key
The anon key (`eyJhbGci...`) visible in `server.mjs` is the **public anon key** — it is intentionally public and also present in the original app bundle. It is not a secret. Supabase RLS policies protect the data; the anon key alone grants no elevated access.

### The service_role key
This is never hardcoded. It must be provided via `SUPABASE_SERVICE_ROLE_KEY` environment variable. It bypasses all RLS — treat it like a database root password.

---

*Audit generated: 2026-05-30*  
*Repository: Suydev/isotope-code*
