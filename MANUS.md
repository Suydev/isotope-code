# IsotopeAI Manus QA Runbook

![IsotopeAI](public/logo-full.svg)

This runbook is for Manus AI browser testing after boot-routing, onboarding, offline PWA, and cloud snapshot changes. Treat Supabase as the online source of truth. Treat local cached data only as a last-known cloud snapshot.

## Goal

Verify that onboarding has three states and never collapses `UNKNOWN` into `INCOMPLETE`:

- `UNKNOWN`: show loading, offline unavailable, or retry state. Do not show onboarding.
- `COMPLETED`: show dashboard.
- `INCOMPLETE`: show onboarding.

Final acceptance:

- Completed online users never see onboarding, even for one frame.
- Offline cached completed users see cached dashboard with offline banner.
- Offline unknown users see offline/retry/login state, not onboarding.
- Prefilled onboarding preferences and completion state come from the same mapped cloud snapshot.
- Supabase remains online source of truth.
- `isotope_cloud_snapshot_<user_id>` is only a last-known Supabase-backed copy.

## Repository Setup

Use a fresh copy unless the user provides an existing workspace.

```bash
git clone https://github.com/Suydev/isotope-code.git
cd isotope-code
```

If the user provides a patched working directory instead of GitHub:

```bash
cd /path/to/isotope
git status --short
```

Install and start:

```bash
npm install
npm run start
```

Expected server:

```text
IsotopeAI running on port 3000
```

Open with the built-in Manus browser:

```text
http://127.0.0.1:3000
```

Do not print `.env` values, Supabase keys, GitHub tokens, or passwords in reports.

## Files To Inspect

Primary boot and route files:

- `public/restore-and-launch.js`
- `public/assets/AppAccessGate-B975UtK7.js`
- `server.mjs`
- `public/pwa-local.js`
- `public/offline.html`

Brand assets:

- `public/logo-full.svg`
- `public/logo-icon.svg`
- `public/icons/icon.svg`

Important browser state:

- `window.__ISO_BOOT_STATE__`
- `localStorage` keys matching `isotope_cloud_snapshot_`
- `isotope_last_cloud_snapshot_user`
- `isotope_cloud_bootstrap`
- `isotope-onboarding`
- `isotope_user_profile_v2`

## Built-In Browser Test Prompt

Paste this into Manus:

```text
You are testing IsotopeAI at http://127.0.0.1:3000 with the built-in browser.

Critical rule:
UNKNOWN onboarding state must never render onboarding. Completed users must never see onboarding, not even for one frame.

Collect for every test:
- PASS/FAIL
- Final URL
- Visible screen name
- Screenshots
- Video/timeline note if onboarding flashes
- Console errors
- Network failures
- window.__ISO_BOOT_STATE__
- Relevant localStorage keys:
  - isotope_cloud_snapshot_<user_id>
  - isotope_last_cloud_snapshot_user
  - isotope_cloud_bootstrap
  - isotope-onboarding
  - isotope_user_profile_v2

Never include secrets, access tokens, refresh tokens, Supabase keys, GitHub tokens, or passwords in the report.

Test 1: Online existing completed user
1. Start server with npm run start.
2. Log in with an account known to have completed onboarding.
3. Reload 5 times.
Expected:
- Splash/loading may appear.
- Onboarding never appears, even briefly.
- Final URL is /dashboard.
- window.__ISO_BOOT_STATE__.state is readyDashboard.
- window.__ISO_BOOT_STATE__.onboarding.completed is true.

Test 2: Complete onboarding loop regression
1. Log in or sign up with an account that needs onboarding.
2. Complete all onboarding steps.
3. Press Complete Setup.
Expected:
- "Setting up your workspace..." appears briefly.
- App does not return to the final onboarding step.
- App reaches completion/dashboard flow.
- Supabase user_onboarding.completed becomes true.
- Reload opens /dashboard with no onboarding flash.

Test 3: Offline cached completed user
1. While online, log in and reach dashboard.
2. Confirm localStorage has isotope_cloud_snapshot_<user_id>.
3. Confirm snapshot has source="supabase", trusted=true, onboarding.completed=true.
4. Stop local server or simulate unavailable local server/Supabase.
5. Open cached browser/PWA.
Expected:
- No reload loop.
- No onboarding.
- Cached dashboard appears.
- Offline banner says cached offline mode.
- Banner includes last cloud snapshot time, local server not running, cloud sync unavailable.
- window.__ISO_BOOT_STATE__.state is offlineCached.

Test 4: Offline unknown user
1. Clear browser storage/cache for the app.
2. Stop local server.
3. Open cached/PWA app.
Expected:
- No onboarding.
- Offline unavailable/retry/login state.
- No fresh online dashboard.
- No "cloud synced" message.
- Boot state is syncFailed or readyLoggedOut, not readyNeedsOnboarding.

Test 5: Prefilled onboarding bug
1. Reproduce the state where onboarding fields are prefilled offline.
2. Inspect which localStorage key contains those preferences.
3. Inspect isotope_cloud_snapshot_<user_id>.onboarding.completed.
Expected:
- If completed=true, route to dashboard.
- If completed=false and snapshot is trusted, onboarding may show with offline/cached warning.
- If completion is missing, show offline unknown/retry state, not onboarding.

Test 6: New user flow
1. Sign up online.
2. Confirm new account sees onboarding.
3. Complete onboarding.
4. Verify Supabase user_onboarding.completed=true.
5. Reload.
6. Stop server and open cached/PWA app.
Expected:
- Reload opens dashboard.
- No onboarding flash.
- Offline cached app opens dashboard if trusted completed snapshot exists.
```

## Report Format

Create `MANUS_TEST_REPORT.md` with this structure:

````markdown
# Manus Test Report

## Environment

- Date:
- Repository commit:
- Browser:
- App URL:
- Server command:

## Summary

| Test | Result | Final URL | Boot State | Notes |
| --- | --- | --- | --- | --- |
| Online existing completed user | PASS/FAIL | | | |
| Complete onboarding loop regression | PASS/FAIL | | | |
| Offline cached completed user | PASS/FAIL | | | |
| Offline unknown user | PASS/FAIL | | | |
| Prefilled onboarding bug | PASS/FAIL | | | |
| New user flow | PASS/FAIL | | | |

## Evidence

Attach screenshots, console logs, network failures, and sanitized localStorage snapshots.

## Sanitized Browser State

Paste sanitized values only. Replace tokens and secrets with `[redacted]`.

```json
{
  "__ISO_BOOT_STATE__": {},
  "isotope_cloud_snapshot_user": {},
  "isotope-onboarding": {},
  "isotope_user_profile_v2": {}
}
```

## Issues Found

For each issue:

- Title:
- Steps to reproduce:
- Expected:
- Actual:
- Screenshot:
- Console/network evidence:
- Suspected file:
````

## Troubleshooting

Server does not start:

```bash
npm run start
```

Check for:

- Missing `.env`
- Port 3000 already in use
- Invalid Supabase URL or anon key
- Node version below 18

Onboarding returns to final step after pressing Complete Setup:

- Open browser console.
- Look for `[OnboardingStore] Error completing onboarding`.
- Check the `/__auth/profile` response.
- Confirm `user_onboarding` has a row for the user.
- Confirm the response body has `ok:true` and `onboarding.completed:true`.

Completed user sees onboarding flash:

- Capture a video or screenshots around reload.
- Check `window.__ISO_BOOT_STATE__`.
- If boot state is `cloudLoading`, onboarding should not be visible.
- If boot state is `readyDashboard`, final route should be `/dashboard`.
- Inspect `public/assets/AppAccessGate-B975UtK7.js`.

Offline completed user sees onboarding:

- Confirm `isotope_cloud_snapshot_<user_id>` exists.
- Confirm `source="supabase"` and `trusted=true`.
- Confirm `onboarding.completed=true`.
- Confirm `window.__ISO_BOOT_STATE__.state` is `offlineCached`.

Offline unknown user sees onboarding:

- Clear storage and retry.
- Confirm no trusted cloud snapshot exists.
- Expected boot state is `syncFailed` or `readyLoggedOut`.
- Report any `readyNeedsOnboarding` state as a failure.

Cloud synced message appears offline:

- Check `public/pwa-local.js`.
- Expected text is cached offline mode, last cloud snapshot time, local server not running, cloud sync unavailable.

## Files To Return

Return these files or their sanitized contents:

- `MANUS_TEST_REPORT.md`
- Screenshots for each test
- Console log export
- Network log export
- Sanitized localStorage export
