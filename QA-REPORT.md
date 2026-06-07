# IsotopeAI — Replit QA Report
**Date:** 2026-06-05  
**Server version:** 3.1.0 (git)  
**Admin test suite:** 53/53 PASSING  
**Environment:** Replit (pnpm monorepo, proxy-routed, port 24099)

---

## Fixes Applied During QA

### FIX-001 — `package.json` version corrected to 3.1.0
- **File:** `artifacts/isotope/package.json`
- **Change:** `"version": "0.0.0"` → `"version": "3.1.0"`
- **Why:** `readLocalVersionInfo()` in `server.mjs` reads `package.json` first for the version string. The Replit scaffold had `0.0.0`. This caused `/api/version` to report `"version":"0.0.0"` and the update banner to show `deployed_version: "0.0.0"` instead of `3.1.0`. Also corrupted the PWA cache key (`isotope-shell-0.0.0-*` vs the correct `isotope-shell-3.1.0-*`).
- **Confirmed:** Server log now shows `[Update] Local version: 3.1.0` ✅

### FIX-002 — Landing page version badge corrected from v2.0 to v3.1 via serve-time patch
- **File:** `artifacts/isotope/server.mjs`, `getPatchedAuthBundle()` function
- **Change:** Added 5th Auth bundle patch: `'children: "IsotopeAI v2.0"'` → `'children: "IsotopeAI v3.1"'`
- **Why:** The pre-built `Auth-Cw0VAaCZ.js` bundle hardcodes a version badge on the landing page right panel. It was stale at "v2.0" while the server runs v3.1. Following `AGENTS.md` guidance ("Do not directly edit compiled files in `public/assets`. Use serve-time patches in `server.mjs`"), the fix is applied as a serve-time bundle patch.
- **Confirmed:** `curl http://localhost:24099/assets/Auth-Cw0VAaCZ.js | grep 'IsotopeAI v'` → `IsotopeAI v3.1` ✅  
  Browser screenshot still shows v2.0 due to stale service worker cache from previous session. This clears automatically on first fresh browser session (SW cache name changed from `isotope-shell-0.0.0-*` to `isotope-shell-3.1.0-*` after FIX-001).
- **Server log:** `[AuthPatch] 5/5 patches applied to Auth bundle` ✅

---

## Bugs Found — For Codex

### BUG-001 🔴 CRITICAL — Replit proxy routing conflict: all `/api/*` endpoints 404 via browser

**Symptom:** All of isotope's `/api/*` routes return 404 when accessed from the browser.  
A `Failed to load resource: 404` error appears in the browser console on every page load.

**Affected endpoints (all return 404 via proxy, all return 200 direct on port 24099):**
| Endpoint | Via proxy | Direct port |
|---|---|---|
| `GET /api/health` | ❌ 404 | ✅ 200 |
| `GET /api/version` | ❌ 404 | ✅ 200 |
| `GET /api/check-update` | ❌ 404 | ✅ 200 |
| `GET /api/ai-config` | ❌ 404 | ✅ 200 |
| `GET /api/community-events` | ❌ 404 | ✅ 200 |
| `GET /api/events` | ❌ 404 | ✅ 200 |
| `POST /api/restart` | ❌ 404 | ✅ 200 |

**Root cause:**  
The Replit workspace has a second artifact — a stub Express API server — registered at the `/api` path (`artifacts/api-server/.replit-artifact/artifact.toml`, `paths = ["/api"]`, port 8080). The Replit reverse proxy uses most-specific-first routing, so ALL `/api/*` requests from the browser are captured by that artifact before reaching isotope (port 24099). That stub server only knows about `/api/healthz` and responds 404 to everything else.

**Secondary effects:**
- `update-checker.js` line 142 calls `fetch('/api/check-update', { cache: 'no-store' })` → 404 → banner silently fails
- AI config fetch (`/api/ai-config`) → 404 → UI may not correctly reflect AI key status
- `/__supa/*` proxied health check inside `/__admin/verify` goes direct and works fine (non-`/api` path)

**Fix — choose one:**
1. **(Recommended — least disruptive)** In `artifacts/api-server/.replit-artifact/artifact.toml`, change `paths = ["/api"]` to a non-conflicting path like `paths = ["/express-api"]`. Isotope owns all `/api/*` routes.
2. Stop or remove the `artifacts/api-server` artifact entirely — it has no isotope-related routes and exists only as a Replit scaffold placeholder. The `/__admin/verify` test suite already uses isotope's own `/api/health` directly.
3. In `artifacts/isotope/.replit-artifact/artifact.toml`, add `/api` to the service paths array. Must be done alongside option 1 or 2 to avoid continued conflict.

---

### BUG-002 🟡 MEDIUM — Update banner fires as false positive on every Replit boot

**Symptom:** The amber update banner ("release: v3.1.0 local server pwa command system") appears on every page load.

**Root cause:**  
`readLocalVersionInfo()` in `server.mjs` (lines 2032–2040) runs `git rev-parse HEAD` using the Replit workspace git. This returns the Replit-internal commit SHA (e.g. `437b0df...`), not a commit from the upstream `Suydev/isotope-code` GitHub repo.

`/api/check-update` then compares this SHA against the latest commit on `github.com/Suydev/isotope-code` main. They will never match → `hasUpdate: true` is always returned → banner always shows.

Note: this is compounded by BUG-001 — the update checker cannot even reach `/api/check-update` via the browser proxy, so the banner never actually renders (the fetch silently fails). If BUG-001 is fixed first, the banner would then show permanently due to BUG-002.

**Confirmed check-update response (direct port):**
```json
{
  "hasUpdate": true,
  "deployed": "437b0df...",
  "deployed_version": "3.1.0",
  "latest": "e94d923a4477ade572e96d7e8e4db84b6db26522",
  "message": "release: v3.1.0 local server pwa command system"
}
```

**Note on update dialog:** The dialog itself is correctly implemented — clicking "Update command" shows the `isotope update` command (not a raw page reload). The dismiss button works. The issue is purely the false positive trigger condition.

**Fix options:**
1. **(Simplest)** Add env var support: `DISABLE_UPDATE_CHECK=true` in `.env`. In `server.mjs`, make `/api/check-update` return `{"hasUpdate":false}` when this env var is set. Self-hosters running on Replit/Docker/cloud set this flag.
2. Support `ISOTOPE_SHA` env var override: if set, use it as `DEPLOYED_SHA` instead of the git SHA. Set `ISOTOPE_SHA=v3.1.0` in `.env` so the SHA comparison is `v3.1.0` vs `e94d923...` → `hasUpdate: false` (non-hex string fails the 40-char hex test → always false).
3. In `readLocalVersionInfo()`, check for a Replit-specific env var (`REPLIT_SLUG`, `REPL_ID`, `REPLIT_DEPLOYMENT`) and skip git SHA detection when present; fall back to the VERSION file sha (`v3.1.0`) which is guaranteed non-hex → `hasUpdate` stays `false`.

---

### BUG-003 🟢 LOW — Password input missing `autocomplete` attribute (accessibility warning)

**Symptom:** Every page load prints to browser console:
```
[DOM] Input elements should have autocomplete attributes (suggested: "current-password")
```

**Root cause:** The password `<input>` in the auth form component is missing `autocomplete="current-password"`.

**Affected:** `Auth-Cw0VAaCZ.js` — the login/signup page React component.

**Fix (serve-time patch approach, per AGENTS.md):** In `getPatchedAuthBundle()` in `server.mjs`, add a patch targeting the password input's JSX props to inject `autoComplete:"current-password"`. The exact string to match depends on the minified prop order around the password input.

---

### BUG-004 🟢 LOW / INFO — Google Sign-In noise in console

**Symptom:**
```
Provider's accounts list is empty.
One Tap skipped. Reason: unknown_reason
Not signed in with the identity provider.
```

**Root cause:** Google One Tap is initialized by the Supabase Auth client but no Google OAuth credentials are configured in this Replit environment.

**Status:** Expected behavior. Not a code defect. Supabase Auth attempts Google provider initialization regardless of whether Google credentials are configured. These messages are informational from the Google Identity Services library.

**Fix (optional):** Suppress by either (a) disabling Google provider in Supabase Auth dashboard for this project, or (b) adding a serve-time patch that stubs the Google accounts list initialization to a no-op when `GOOGLE_CLIENT_ID` is absent.

---

## Backend Health (Admin Test Suite) — ALL PASSING

Accessed via `/__admin/verify` → authenticate → `/__admin/verify`:

| Category | Result |
|---|---|
| DB Tables (17 tables) | 17/17 ✅ |
| RPC Functions (7 functions) | 7/7 ✅ |
| RLS Policies (7 tables) | 7/7 ✅ |
| Edge Function Interceptors (8) | 8/8 ✅ |
| Server Health (5 checks) | 5/5 ✅ |
| Admin & Community Features (5) | 5/5 ✅ |
| **Total** | **53/53 ✅** |

Notable interceptors verified:
- `create_checkout` → `{"url":null,"disabled":true}` (payments intercepted ✅)
- `create_customer_portal_session` → disabled ✅
- `redeem_membership_code` → `{"success":true,"redeemed":true}` (self-hosted free unlock ✅)
- `get-leaderboard`, `get-daily-leaderboard`, `get-group-leaderboard` → 200 ✅
- `finish-session`, `get-group-analytics` → 200 ✅

---

## Page-by-Page QA Results

| Path | Result | Notes |
|---|---|---|
| `/` | ✅ Renders | Signup/landing page |
| `/dashboard` | ✅ Auth-guarded | Redirects to signup (expected) |
| `/analytics` | ✅ Auth-guarded | Redirects to signup (expected) |
| `/community` | ✅ Auth-guarded | Redirects to signup (expected) |
| `/settings` | ✅ Auth-guarded | Redirects to signup (expected) |
| `/__admin/verify` | ✅ Renders | Admin Unlock form working |
| `/__admin/verify` (authed) | ✅ 53/53 | Full test suite passes |
| `/api/health` (direct port) | ✅ 200 | Blocked via proxy → BUG-001 |
| `/api/version` (direct port) | ✅ `3.1.0` | Blocked via proxy → BUG-001 |
| `/api/check-update` (direct) | ⚠️ `hasUpdate:true` | False positive → BUG-002 |
| `/api/ai-config` (direct port) | ✅ `{"gemini":false}` | Blocked via proxy → BUG-001 |
| `/api/community-events` (direct) | ✅ `"Events removed"` | Correct feature-removed response |
| All public assets | ✅ 200 | manifest, sw.js, favicon, restore-and-launch.js, update-checker.js, 211 bundles |

---

## Server Startup Log (Confirmed Clean)

```
[Config] .env loaded (11 values applied)
[Admin] Admin mode enabled
[Update] Local version: 3.1.0                         ← FIXED (was 0.0.0)
[AppPatch] Demo-mode disabled
[AppPatch] fetchUserData planType → ranker
[AppPatch] Initial store planType → ranker
[AppPatch] Supabase URL placeholder replaced from env
[AppPatch] Supabase anon placeholder replaced from env
[AppPatch] Supabase JWT constants normalized (1)
[AppPatch] Circuit breaker disabled
[AuthPatch] 5/5 patches applied to Auth bundle        ← FIXED (was 4/4, added v3.1 badge)
[InvitesPatch] token_input → p_code
[FeaturePatch] Store and Events render paths removed   ← confirmed
[FeaturePatch] Store and Events hub cards removed      ← confirmed
[Schema] Community columns: OK
[Startup] DML backfills complete
[Startup] Admin user exists
```

---

## Priority Fix Order for Codex

| Priority | Bug | Effort | Impact |
|---|---|---|---|
| 1 | BUG-001: `/api` proxy routing conflict | Low — change one path in api-server artifact.toml | Critical — all API endpoints 404 in browser |
| 2 | BUG-002: False-positive update banner | Low — add `DISABLE_UPDATE_CHECK` env var | Medium — banner fires on every boot |
| 3 | BUG-003: `autocomplete` on password input | Low — one serve-time patch | Low — accessibility console noise |
| 4 | BUG-004: Google Sign-In console noise | Low-Medium — provider config or patch | Low — console noise only |
