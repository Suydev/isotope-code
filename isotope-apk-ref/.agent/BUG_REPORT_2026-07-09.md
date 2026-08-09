# Bug Report — IsotopeAI Android (2026-07-09)

Compiled from device screenshots provided by Suyash.

---

## BUG-C1: Community — Persistent "Stable Fallback" crash [CRITICAL]
**Screenshots:** 08:25, 08:25, 12:44
**Evidence class:** A (Device verified)

### Root Cause
`useGroupChallenges-N8BLPr3m.js` in `www/assets/` still contains raw `isPremium()` calls
in functions `L`, `B`, `R`. The patches in `apply-android-patches.js` exist but were never
run against the committed `www/` copy.

When `isPremium()` returns false (free-tier user), TanStack Query sets `enabled: false` →
`data: undefined`. The CommunityHub render then calls `.map()` on `undefined` →
`TypeError` → error boundary fires → "Community ran into a loading issue".

**Fix:** Apply the patches by running `npm run apply-patches` after fixing android-bridge.js.

### Impacted files
- `www/assets/useGroupChallenges-N8BLPr3m.js` (3 `isPremium()` occurrences unfixed)
- `scripts/apply-android-patches.js` (patches defined but not applied to www/)

---

## BUG-C2: "Reload community" causes full page reload [HIGH]
**Screenshots:** 08:25 ("doesn't work")
**Evidence class:** A (Device verified)

### Root Cause
Community error boundary's `reset()`:
```js
this.reset=()=>{if(this.state.error){this.setState({error:null},()=>{setTimeout(()=>window.location.reload(),80)})}}
```
Calls `window.location.reload()` 80ms after clearing state. This reloads the entire app.
If the root cause error persists after reload, the community immediately crashes again.

**Fix:** Patch `Community-DIqF5406.js` to remove the `window.location.reload()` call,
so clicking "Reload community" just clears the error boundary and re-renders children.

---

## BUG-C3: Invite URL uses wrong domain [HIGH]
**Screenshots:** 08:23 ("redirects to isotopeai.in, I need it on localhost to supabase")
**Evidence class:** A (Device verified)

### Root Cause
`android-bridge.js` line 40:
```js
window.__ISO_INVITE_DOMAIN__ = 'https://isotopeai.in';
```
Should be `'isotopeai:/'` so the GroupInviteGenerator produces `isotopeai://invite/<code>`,
which MainActivity catches as a deep link rather than opening the browser.

**Fix:** Change android-bridge.js line 40.

---

## BUG-C4: Challenge Arena cards overlapping/not rendering [MEDIUM]
**Screenshots:** 08:21 ("6 issues")
**Evidence class:** A (Device verified)

### Root Cause
When `useGroupChallenges` returns `data: undefined` (due to isPremium gate),
the challenge card area renders with no data → layout collapses, cards overlap.
Fixing BUG-C1 should also resolve this rendering issue.

---

## BUG-C5: Group tour shows at step 7/7 while community crashes [HIGH]
**Screenshots:** 08:25 (community loading issue + tour overlay at same time)
**Evidence class:** A (Device verified)

### Root Cause
The tour is still running (7 of 7) while the underlying CommunityHub has crashed.
The tour overlay shows on top of the error boundary. This indicates the tour
starts loading before Supabase data is ready, and the crash happens mid-tour.

Fixing BUG-C1 fixes the underlying crash. The tour showing at step 7 on every
load may also need the SingleGroup tour-scope patch to be applied.

---

## BUG-F1: "Boring design" — Focus page UI feedback [LOW]
**Screenshots:** 08:31 (annotated "boring design")
**Evidence class:** A
Not a code bug — user aesthetic preference.

---

## BUG-F2: Bug report link redirects wrong [MEDIUM]
**Screenshots:** 08:30 ("should redirect, wrong link")
**Evidence class:** A (Device verified)

### Root Cause
Bug report button uses `https://isotope.featurebase.app` instead of
`https://isotopeaiapp.featurebase.app/`. Patches exist in apply-android-patches.js
for both SettingsLayout and DashboardHeader, but may not be applied to www/.

---

## BUG-C6: "Remove test group" — data cleanup request [LOW]
**Screenshots:** 08:26 (user points to "test" group)
**Evidence class:** A
User wants to delete the test group from Supabase. Not a code bug — DB operation needed.

---

## Status

| Bug | Fix | State |
|-----|-----|-------|
| BUG-C1: Community crash (isPremium) | Run patches | FIXING |
| BUG-C2: Reload community loop | Patch Community bundle | FIXING |
| BUG-C3: Invite URL domain | Fix android-bridge.js | FIXING |
| BUG-C4: Challenge cards | Resolved by BUG-C1 fix | FIXING |
| BUG-C5: Tour/community crash race | Resolved by BUG-C1 fix | FIXING |
| BUG-F1: Focus design | User feedback only | NOTED |
| BUG-F2: Featurebase URL | Run patches | FIXING |
| BUG-C6: Test group delete | DB operation | PENDING |
