# IsotopeAI — Codex Engineering Prompt
## Auth · Onboarding · Boot Order · Offline PWA · Tour Persistence

**Status of this document:** Ready for implementation. The fixes below MUST be
implemented together in one pass. Do not fix cloud sync alone while leaving
onboarding routing, reload loops, or tour persistence broken. These four systems
share the same root cause: local/browser state is treated as the source of truth
instead of Supabase.

**What was already fixed at serve-time (do not regress):**
- `FIX-001` package.json version 0.0.0 → 3.1.0
- `FIX-002` Auth bundle badge v2.0 → v3.1
- `FIX-003` /login /signup /reset-password → 302 redirect to /
- `FIX-004` /api/check-update uses semver comparison; false-positive update banner suppressed
- `FIX-005` SW cache name corrected to `isotope-local-shell-{version}-{sha12}`
- `FIX-006` Termux CLI scripts (bin/isotope) reviewed and fixed
- `FIX-C`   PWAManager SW-activated reload wrapped with `window.__isoReloadGuard()` (max 1 reload/session) — see server.mjs

---

## Root Cause

All four bugs trace to the same design flaw:

```
Supabase (source of truth)
  ↓ async fetch (may fail, may be slow, may be offline)
Zustand store (in-memory)
  ↓ Zustand persist (written to localStorage on every mutation)
localStorage (browser cache)
  ↓ read synchronously on boot / by route guards
Routing decisions (onboarding, dashboard, reload)
```

The problem: routing decisions (onboarding, reload, sync UI) fire **before** the
Supabase fetch completes and **use localStorage as if it were truth**. When the
fetch fails (offline, network error, Supabase blip), the stale or unset
localStorage value drives the wrong route.

**The fix requires reversing the data flow for routing decisions:**
```
supabase.auth.getSession() → wait → fetch user rows → hydrate stores → THEN route
```

---

## A. Required Auth / Onboarding Routing Logic

### Routing cases

**CASE 1 — Not logged in**
- Show login/signup screen only
- Do NOT check or show onboarding
- Do NOT create a fake local user or default profile
- Do NOT call any `user_onboarding` or `user_profiles` Supabase query without a session

**CASE 2 — Existing registered user logs in**
- Restore Supabase session (`supabase.auth.getSession()`)
- Fetch `user_onboarding` row for the authenticated user
- If `completed = true` → route to `/dashboard` immediately
- This MUST work after reload, after logout/login, and from a fresh browser/device
- The decision MUST come from Supabase, not from localStorage

**CASE 3 — New account (first login ever)**
- `user_onboarding` row exists with `completed = false` (created by DB trigger/bootstrap)
- Show onboarding flow exactly once
- On completion:
  1. Save all onboarding data to Supabase
  2. Set `completed = true` in `user_onboarding`
  3. VERIFY the write succeeded (check returned row or re-fetch)
  4. Re-fetch `user_onboarding` to confirm `completed = true`
  5. Only then navigate to `/dashboard`
- If the write fails, show an error and retry — do NOT silently proceed

**CASE 4 — Existing user with missing `user_onboarding` row**
- Do NOT blindly force onboarding
- Check `user_profiles.profile_data` and `user_profiles` columns for evidence of
  past completion (e.g., `isOnboarded: true`, non-empty profile data, past sessions)
- If evidence of prior completion → create the missing row with `completed = true`
  and route to dashboard
- If no evidence → treat as new user (Case 3)
- Do NOT overwrite any existing profile, settings, or stats data

### Forbidden behaviors

- ❌ Using `localStorage.getItem('isotope-onboarding')` to decide whether to show onboarding
- ❌ Using Zustand store state (before Supabase hydration) for routing
- ❌ Showing onboarding because a Supabase fetch failed or timed out
- ❌ Showing onboarding because localStorage is empty/missing
- ❌ Showing onboarding for a logged-out user
- ❌ Routing to dashboard based on a default/unhydrated store state
- ❌ Any onboarding loop after page reload

---

## B. Required Boot Order

Implement a deterministic, sequential boot sequence. No routing decision may be
made before the sequence reaches step 9.

```
1. Load environment (Supabase URL, anon key already available via window.__ISO_SUPA_URL__ etc.)
2. Initialize Supabase client
3. Call supabase.auth.getSession()
4. WAIT for session result (do not proceed until resolved or rejected)
5. If no session → show login/signup screen; STOP
6. If session exists → extract user_id from session.user.id
7. Fetch in parallel (all must complete before routing):
   a. public.users row (for display name, avatar, etc.)
   b. user_profiles row (profile_data, settings, etc.)
   c. user_onboarding row (completed, current_step, etc.)
   d. user_stats_summary (for dashboard counters)
   e. Recent daily_user_stats (last 7 days) if needed for dashboard widgets
8. Hydrate all Zustand stores from the fetched Supabase data
   - Do NOT use localStorage as the data source for hydration
   - localStorage is a write-through cache only; reads during boot are forbidden
     for routing-sensitive data
9. Decide route:
   - user_onboarding.completed = true  → /dashboard
   - user_onboarding.completed = false → /onboarding
   - fetch failed and offline          → offline/retry screen (not onboarding)
   - no session                        → /login (already handled in step 5)
10. Render app UI — never before step 9
```

### Required loading states (show these, never flash the wrong screen)

| State | What to show |
|---|---|
| `checking_session` | Centered spinner: "Checking your session…" |
| `loading_profile` | Centered spinner: "Loading your profile…" |
| `loading_cloud_data` | Centered spinner: "Loading your data…" |
| `offline_unavailable` | "Offline — your data could not be loaded. Run `isotope start` and refresh." |
| `sync_failed` | "Could not reach the cloud. Some features may be unavailable." (non-blocking) |
| `dashboard_ready` | Normal dashboard UI |

**Do NOT flash the onboarding screen during any loading state.** If the boot
sequence hasn't reached step 9, the route is unknown and nothing content-level
should be rendered.

### onAuthStateChange listener

After the initial boot sequence, set up `supabase.auth.onAuthStateChange` to
handle subsequent SIGNED_IN / SIGNED_OUT events:
- `SIGNED_OUT` → clear all stores, navigate to /login
- `SIGNED_IN` (after the initial boot) → only handle token refreshes; do NOT
  re-run the full boot sequence unless the user_id changed

---

## C. Reload Loop — Already Fixed at Serve-Time

The PWAManager auto-reload on SW activation is patched in `server.mjs`
(`getPatchedPWAManagerBundle`). The guard:

```javascript
// window.__isoReloadGuard (injected in <head> by server.mjs):
window.__isoReloadGuard = function() {
  var key = 'iso_sw_rg_v3';
  if (sessionStorage.getItem(key)) {
    console.warn('[Isotope] SW reload guard: blocked repeat automatic reload');
    return false;
  }
  sessionStorage.setItem(key, '1');
  window.location.reload();
  return true;
};
```

**Additional rules to enforce in source code:**
- `location.reload()` / `window.location.reload()` must NEVER be called:
  - on failed `/api/version` fetch
  - on Supabase offline / network error
  - on failed onboarding check
  - repeatedly in a loop
- Any source-level automatic reload must call `window.__isoReloadGuard?.()` instead
  of `window.location.reload()` directly
- One-shot reload guard key pattern: `'iso_sw_rg_' + appVersion`
- Store guard in `sessionStorage` (clears on tab close, so update is allowed on next session)

---

## D. Offline / PWA Mode

When the local IsotopeAI server is unreachable or Supabase is offline:

### Allowed
- Cached app shell opens from service worker cache
- Last-known UI state may display (read-only)
- Previously loaded data from Zustand persist cache is displayed

### Required
- Show a persistent non-blocking banner: **"Offline — Local server not running"** or
  **"Cloud sync unavailable"** (check both: `/api/health` and Supabase connection)
- Show "Run `isotope start` to reconnect" in the banner
- All write operations must be marked as pending/offline (not silently dropped)

### Forbidden
- ❌ Force onboarding because `/api/health` or Supabase fetch failed
- ❌ Show "Synced" or any sync-success UI when actually offline
- ❌ Show "Update available" when server/Supabase is unreachable
- ❌ Reload repeatedly while offline
- ❌ Clear auth session, profile, or onboarding state because a fetch failed
- ❌ Treat a failed Supabase fetch as proof that the user is new

### Offline detection

```typescript
// Server reachability
const serverOk = await fetch('/api/health', { cache: 'no-store' })
  .then(r => r.ok).catch(() => false);

// Supabase reachability
const supabaseOk = await supabase.auth.getSession()
  .then(({ error }) => !error).catch(() => false);
```

If `serverOk = false` and `supabaseOk = false`:
- Show offline banner
- Do NOT run boot sequence steps 7-9
- Restore last-known Zustand state from persist cache (read-only)
- DO NOT route based on this stale state (show offline screen instead)

---

## E. Update Banner — Already Fixed at Serve-Time

`/api/check-update` now uses semver comparison. When local version ≥ upstream
version, `hasUpdate = false` is returned. The banner correctly stays hidden.

**Remaining source-level rules to enforce:**
- If `/api/version` or `/api/check-update` returns a network error → suppress the banner entirely
- If `hasUpdate = false` → clear any stale `__iso_update_dismissed__` localStorage flag
- The "update available" button must open a command dialog only — it must NOT call
  `window.location.reload()` or stop the server
- After a successful `isotope update`, the server restarts with new version;
  `hasUpdate` will return `false` on the next check — banner auto-hides

---

## F. Tour / Guide — One-Time Per User, Supabase-Backed

The guided tour currently appears on every page load because tour completion state
is not persisted to Supabase.

### Required tour keys

| Tour key | Page | Description |
|---|---|---|
| `community_group_v1` | Community group page | Group discovery tour |
| `community_hub_v1` | Community hub page | Hub navigation tour |
| `dashboard_v1` | Dashboard | Dashboard feature tour |

Add additional keys as more guided tours are added.

### Storage location

Store tour completion in **`user_profiles.profile_data`** as a nested object:

```json
{
  "tours": {
    "community_group_v1": { "completed": true, "completedAt": "2025-06-01T12:00:00Z" },
    "community_hub_v1": { "completed": false }
  }
}
```

Alternatively, create a dedicated `user_tours` table:

```sql
CREATE TABLE user_tours (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tour_key text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  skipped boolean NOT NULL DEFAULT false,
  skipped_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, tour_key)
);
ALTER TABLE user_tours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users can manage their own tours"
  ON user_tours FOR ALL USING (auth.uid() = user_id);
```

Using `user_profiles.profile_data` (JSONB) avoids a schema migration and is
preferred if the profile data column already exists and has a JSONB type.

### Required behavior

1. **Load**: Fetch tour state for the current user from Supabase on boot (as part
   of step 7 in the boot sequence, or lazily when the relevant page is first visited)
2. **localStorage as cache only**: Write tour state to localStorage as a cache after
   Supabase write succeeds; read from localStorage only as a fast-path cache, never
   as the authoritative state
3. **Complete/skip**: When user completes or skips a tour:
   a. Persist to Supabase first (upsert with `completed = true` / `skipped = true`)
   b. Update localStorage cache
   c. Update Zustand tour state
   d. Do NOT show the tour again even if localStorage is cleared (Supabase is truth)
4. **Show tour only if**: Supabase confirms `completed = false AND skipped = false`
   (or no row exists yet = first time)
5. **Never show tour if**: Supabase fetch failed (offline) — defer until reconnected
6. **Cross-device**: Same user logging in from a new device must NOT see completed tours

### Implementation sketch

```typescript
// In the tour hook / component
const { data: tourState, loading } = useTourState(tourKey);

// Don't render tour until we know the state
if (loading) return null;
if (tourState?.completed || tourState?.skipped) return null;

// Show tour
return <GuidedTour tourKey={tourKey} onComplete={handleComplete} onSkip={handleSkip} />;

async function handleComplete() {
  await supabase.from('user_tours').upsert({
    user_id: currentUserId,
    tour_key: tourKey,
    completed: true,
    completed_at: new Date().toISOString(),
  });
  setTourDone(); // update local state
}
```

### Forbidden
- ❌ Using only `localStorage.getItem('tour_' + tourKey)` to determine tour completion
- ❌ Showing tour before Supabase tour state is loaded
- ❌ Showing tour because a service worker update cleared localStorage
- ❌ Showing tour because the user is on a new device (same account)

---

## G. Verification Test Suite

All of the following tests must pass before implementation is considered complete.

### Auth / Onboarding

| # | Test | Expected |
|---|---|---|
| 1 | Logged-out user opens app | Login/signup only. No onboarding, no dashboard. |
| 2 | New user signs up | Onboarding screen appears exactly once. |
| 3 | New user completes onboarding | `user_onboarding.completed = true` in Supabase. `user_onboarding_completed_at` is set. |
| 4 | Reload page after completing onboarding | Dashboard directly. Onboarding does NOT appear. |
| 5 | Logout then login same account | Dashboard directly. No onboarding. |
| 6 | Login same account from fresh browser / incognito | Dashboard directly. No onboarding. |
| 7 | Supabase temporarily unreachable (block network) | Offline/retry state. Onboarding does NOT appear. |
| 8 | localStorage completely cleared, reload | Boot sequence re-fetches from Supabase. Onboarding only if DB says incomplete. |

### Reload Loop

| # | Test | Expected |
|---|---|---|
| 1 | Open app with server running | No automatic reload loop. DevTools Network shows no repeated page loads. |
| 2 | Stop local server, open cached PWA | Offline mode, no reload loop. |
| 3 | Old `__iso_update_dismissed__` flag exists | No reload loop, no false update banner while offline. |
| 4 | Service worker installs new version | At most ONE automatic reload (guarded). Not repeated. |

### Cloud Sync

| # | Test | Expected |
|---|---|---|
| 1 | Edit profile/settings while online | Supabase write occurs. DevTools Network shows POST/PATCH to Supabase. |
| 2 | Reload after edit | Changed data loads from Supabase. Not from localStorage. |
| 3 | Edit while offline | Pending/offline state shown. Data NOT silently lost. |
| 4 | Reconnect after offline edit | Upload happens, then "Synced" state shown. |
| 5 | Check sync UI | "Synced" only appears after a confirmed Supabase write. Never from localStorage alone. |

### Tour

| # | Test | Expected |
|---|---|---|
| 1 | Open group/hub page first time | Tour appears. |
| 2 | Complete/skip tour | `user_tours` row (or `profile_data.tours` entry) saved in Supabase. |
| 3 | Reload the same page | Tour does NOT appear. |
| 4 | Clear localStorage, reload | Tour does NOT appear (Supabase is truth). |
| 5 | Login same account in another browser | Tour does NOT appear. |

---

## Implementation Order (Recommended)

1. **Boot sequence** (Section B) — This is the foundation; everything else depends on it
2. **Auth/Onboarding routing** (Section A) — Implement Cases 1-4 on top of the boot sequence
3. **Loading states** — Add the required loading screens so the user never sees flashing
4. **Offline detection** (Section D) — Add offline banner and block routing when offline
5. **Tour persistence** (Section F) — Add Supabase-backed tour state on top of auth context
6. **Cloud sync UI** (Section E remaining) — Remove fake sync UI; wire real upload/download indicators
7. **Verification** (Section G) — Run all tests before marking complete

---

## Files Most Likely to Change

```
src/
  main.tsx                     # Boot sequence (steps 1-9)
  App.tsx                      # Route guards, auth context
  store/
    onboardingStore.ts         # Remove localStorage-as-truth; Supabase is source
    authStore.ts               # Session management
    profileStore.ts            # Hydrate from Supabase, not localStorage
  hooks/
    useAuth.ts                 # Session hook (drives boot sequence)
    useOnboarding.ts           # Onboarding state; must wait for Supabase
    useTourState.ts            # NEW: Supabase-backed tour hook
  pages/
    Onboarding/                # Remove any localStorage routing logic
    Dashboard/                 # Only render after boot sequence completes
  components/
    AppLoader.tsx              # NEW or modified: deterministic loading states
    OfflineBanner.tsx          # NEW: offline indicator
    GuidedTour.tsx             # Add Supabase persistence on complete/skip
```

---

## Constraints

- **Do NOT modify** `server.mjs` patches (FIX-001 through FIX-C already applied)
- **Do NOT modify** Supabase RLS policies or schema beyond what Section F describes
- **Do NOT modify** study stats pipeline, focus session tracking, or syllabus logic
- **Do NOT modify** `public/assets/*.js` compiled bundles directly — if a source rebuild
  is needed, rebuild via Vite (`node_modules/.bin/vite build`) and update `server.mjs`
  patches to match any changed bundle filenames
- `localStorage` may be used as a **write-through performance cache** but never as
  the authoritative source for routing decisions or onboarding/tour completion state
