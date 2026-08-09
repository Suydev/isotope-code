# IsotopeAI Android — Known Issues

---

## ISSUE-023 — Rotation (portrait↔landscape) leaves WebView permanently black, no recovery
**Severity:** CRITICAL
**Status:** CODE FIX WRITTEN + UNIT TESTED (2026-07-09); APK RUNTIME UNVERIFIED

User reported that rotating the device from portrait to landscape (and back) can turn the
WebView fully black with no way to recover short of a full app reinstall.

**Root cause found:** `AndroidManifest.xml` declares
`configChanges="orientation|screenSize|..."` on `MainActivity`, so Android does **not**
destroy/recreate the Activity on rotation — it calls `onConfigurationChanged` instead. That
method was never overridden, so rotation fired neither the native `onResume` repaint path
nor the JS-side `visibilitychange`/`focus` listeners that `android-bridge.js` already used to
force a WebView repaint. A WebView compositor glitch after resize therefore had zero recovery
hook, matching "no fix until reinstall."

**Current fix:**
- `MainActivity.onConfigurationChanged` now forces `requestLayout()` + `invalidate()` +
  `window.__isoAndroidForceRepaint(...)` twice (immediately and again after a 350ms settle
  delay), mirroring the existing `onResume` recovery path.
- `android-bridge.js` now also listens for JS-level `orientationchange` and debounced `resize`
  events and calls `forceRepaint()` + `checkBlankRoot()` (which force-reloads once if `#root`
  is empty), so recovery no longer depends solely on the native hook firing.

**Evidence:** `npm test` (63/63) unaffected; `npm run build` (prepare-www + apply-patches +
cap sync) completes cleanly with the new hooks present in `www/android-bridge.js`.

**Remaining risk:** Needs a GitHub-built APK and physical-device rotation test (several
rotations in Focus, Analytics, and Community) to confirm the black screen cannot recur.

---

## ISSUE-001 — Destructive email availability check
**Severity:** CRITICAL
**Status:** FIXED IN CODE + UNIT TESTED (2026-06-29)

`android-bridge.js` previously handled `/__auth/check` by calling Supabase `/auth/v1/signup` with a generated dummy password. That is not a safe availability check and could create users, send confirmation mail, and consume auth rate limits.

**Current fix:** `/__auth/check` returns a neutral response and performs zero signup requests.

**Evidence:** `npm test` includes `/__auth/check is neutral and performs no signup request`.

---

## ISSUE-002 — Bootstrap contract mismatch
**Severity:** CRITICAL
**Status:** FIXED IN CODE + UNIT TESTED (2026-06-29)

Android bootstrap previously returned `onboarding_completed` without the canonical `onboarding` object, and returned the full `user_profiles` row as `profile` instead of exposing raw `profile_data`. `restore-and-launch.js` reads `snapshot.onboarding.completed`, `profile_data`, `cloud_snapshot`, `study_sessions_log`, and `stats_summary`, so boot routing could treat completed users as not onboarded.

**Current fix:** `/__auth/bootstrap` now returns the server-compatible shape, including `onboarding`, `onboarding_completed`, `profile`, `profile_data`, `profile_updated_at`, `settings`, `tours`, `stats_summary`, `daily_user_stats`, `study_sessions_log`, `cloud_snapshot`, `best_backup`, `backup_candidates`, `restore_recommended`, `backup_warning`, and `fetched_at`.

**Evidence:** `npm test` covers canonical completed onboarding, legacy `onboarding_completed`, seeded incomplete onboarding, legacy migration, nested `profile_data`, and network failure.

---

## ISSUE-003 — Auth navigation race after login
**Severity:** CRITICAL
**Status:** FIXED IN PATCH SCRIPT + UNIT TESTED (2026-06-30)

The compiled Auth bundle navigated to `/dashboard` whenever `signIn().success` was true. Since `auth-bridge.js` is loaded after `android-bridge.js` and becomes the active login implementation, login could race against restore/bootstrap routing and skip onboarding.

**Current fix:** `scripts/apply-android-patches.js` patches the Auth bundle login handler to call `window.__isoLogin`, wait for bootstrap, hydrate the auth Zustand store directly from the Android bootstrap/session, and route exactly once based on `bootstrap.onboarding.completed`.

**Evidence:** `npm test` includes `apply-android-patches makes Auth login route exactly once from bootstrap and hydrates auth state`.

---

## ISSUE-004 — Minified bundle patch compatibility
**Severity:** HIGH
**Status:** PARTIALLY VERIFIED

Required patch targets now fail the build if absent or ambiguous. The current source commit was tested locally with `npm run prepare-www`, `npm run apply-patches`, `npx cap sync android`, and a second `npm run apply-patches`.

**Remaining risk:** This is still a high-risk compatibility layer. More patch-contract coverage is needed for asset existence, hash reporting, JavaScript parsing of patched chunks, and index.html reference validation.

---

## ISSUE-005 — GitHub Actions access to isotope-code
**Severity:** HIGH
**Status:** UNKNOWN UNTIL PUSHED

The workflow checks out `Suydev/isotope-code` at pinned commit `fd39fad1384333ad774f19f35b754659a34dae60`. If that repository is private and the default GitHub token lacks access, the build will fail during checkout.

**Fix options if it fails:**
- Make `Suydev/isotope-code` accessible to the workflow.
- Add a cross-repo read token as a GitHub secret and configure checkout to use it.

---

## ISSUE-006 — Native notifications are code-level only
**Severity:** HIGH
**Status:** PARTIAL CODE FIX + UNIT TESTED + RESOURCE CONTRACT TESTED (2026-06-30)

The Web Notification polyfill is not sufficient for process-death reliability. A real Android notification implementation must schedule from an absolute timer completion timestamp, survive WebView process death where Android permits, restore after restart/reboot, and route notification taps to `/focus`.

**Current fix:** `android-bridge.js` exposes Capacitor LocalNotifications helpers for permission, scheduling, cancellation, channel creation, and tap routing. The notification store and focus store patches call these helpers on Android. The missing `ic_notification` drawable was added, bridge scheduling now uses that icon with `allowWhileIdle`, and `__isoScheduleFocusTimer` cancels the previous completion notification before scheduling a replacement.

**Remaining risk:** No emulator/physical-device evidence yet. Reboot persistence and Android process-death reliability still need APK testing.

---

## ISSUE-007 — Timer process-death behavior is unverified
**Severity:** HIGH
**Status:** OPEN

The timer still needs packaged APK tests for backgrounding, rotation, force-stop/relaunch, process recreation, clock changes, pause/resume, exactly-once completion, no duplicate Supabase session, and no duplicate notification.

---

## ISSUE-008 — Backup safety requires Android evidence
**Severity:** HIGH
**Status:** CODE FIX WRITTEN + UNIT TESTED; APK RUNTIME UNVERIFIED (2026-06-30)

`BLOCKED_EMPTY_OVERWRITE` must be preserved and verified in the packaged APK. Empty fresh install must never overwrite richer cloud data.

**Current fix:** Android backup upload now scans Supabase Storage candidates, blocks empty local-over-rich cloud writes, writes canonical `backups/latest.json`, `backups/history/*.json`, and `cloud-snapshot/latest.json`, and only runs cleanup after verified upload/readback.

**Evidence:** `npm test` covers empty-over-rich blocking, canonical upload, restore-best-backup payload shape, import archive/promote, and stale archive cleanup.

**Remaining risk:** Needs GitHub-built APK runtime verification against the real Supabase project and Storage RLS.

---

## ISSUE-009 — WAV sound files are large
**Severity:** MEDIUM
**Status:** OPEN

`www/sounds/` currently contributes about 41.8 MB after packaging: rain, wind, and crickets WAV files. Convert to OGG/AAC in a later size-reduction task only after core repair is stable.

---

## ISSUE-010 — GitHub CLI unavailable locally
**Severity:** MEDIUM
**Status:** OPEN

`gh` is not installed in this environment and `GITHUB_PAT` is not currently present. Baseline artifact download, `gh run list`, workflow log inspection, and PR creation cannot be done through the GitHub CLI unless `gh` is installed/authenticated or a token is provided. Normal `git push` may still work through existing git credentials.

---

## ISSUE-011 — Previous APK still looked like PWA and login fell back to create-account UI
**Severity:** CRITICAL
**Status:** FOLLOW-UP FIX WRITTEN + UNIT TESTED (2026-06-30)

User tested the previous GitHub-built APK and reported:

- Login shows loading after credentials, then the create-account page appears.
- Android notification permission is not requested.
- The APK still feels like a PWA rather than a native app.

**Likely causes found:**

- The patched Auth login still called the compiled `initializeAuth()`, which can re-read the compiled Supabase client/session state and flip the app back to logged-out UI.
- `restore-and-launch.js` can leave `window.__ISO_BOOT_STATE__.state="readyLoggedOut"` from startup, and AppAccessGate previously honored that stale state even after Android login hydrated the auth store.
- `index.html` still included PWA manifest/mobile-web-app metadata.
- The compiled `PWAManager` was still mounted globally.
- Notification scheduling still depended on browser service-worker/`setTimeout` behavior for key paths.

**Current fix:** Auth login now hydrates the auth store directly from Android bootstrap/session, refreshes `window.__ISO_BOOT_STATE__` before navigation, Android packaging strips PWA metadata, the Android app shell disables `PWAManager`, and notification/focus bundles call native scheduling helpers.

**Evidence:** `npm test` covers auth-store hydration, PWA manager disablement, manifest/meta removal, native notification scheduling hooks, and focus timer native scheduling hooks.

---

## ISSUE-012 — Supabase login succeeds but Android auth initializer loses the session
**Severity:** CRITICAL
**Status:** FOLLOW-UP FIX WRITTEN + UNIT TESTED (2026-06-30)

After commit `f1fa416`, the user reported a sharper reproduction: credentials show the IsotopeAI loading screen for about one second, then the app returns to login/create-account. Supabase Auth logs for the same window show `/token` returned HTTP 200, so Supabase accepted the credentials.

**Cause found:** `auth-bridge.js` writes the successful session to browser `localStorage`, but the compiled Supabase client storage adapter (`fr`) read only the app's IndexedDB-backed storage wrapper. `initializeAuth()` could therefore see no Supabase session and reset the auth store back to logged out.

**Current fix:** `scripts/apply-android-patches.js` patches the app bundle storage adapter so Android reads/writes/removes the bridge-compatible `localStorage` session keys.

**Evidence:** `npm test` includes `apply-android-patches lets Supabase auth storage read bridge-written sessions`. `npm run build` placed the fallback in both `www/assets/App-pJGjDiPw.js` and `android/app/src/main/assets/public/assets/App-pJGjDiPw.js`.

**Remaining risk:** Must be verified in a GitHub-built APK on an emulator or physical device. No ADB device is currently visible from this environment.

---

## ISSUE-013 — Stale startup boot state can override successful native login
**Severity:** CRITICAL
**Status:** FIXED IN PATCH SCRIPT + UNIT TESTED + LOCAL BUILD VERIFIED (2026-06-30)

After native login succeeds, `restore-and-launch.js` may still have `window.__ISO_BOOT_STATE__.state` set to `readyLoggedOut` from the initial no-session startup. The compiled Auth patch hydrated the auth store and navigated to dashboard/onboarding, but AppAccessGate then read the stale logged-out boot state and redirected back to `/auth`.

**Current fix:** The Auth bundle patch writes a fresh `window.__ISO_BOOT_STATE__` from the verified bootstrap result before navigation. AppAccessGate now honors `readyLoggedOut` only when the auth store is not authenticated, and its localStorage cleanup set no longer removes Android auth-session keys.

**Evidence:** `npm test` includes `apply-android-patches prevents stale logged-out boot state and preserves Android auth keys`. `npm run build` placed the fix in both `www/assets/Auth-Cw0VAaCZ.js` / `AppAccessGate-B975UtK7.js` and synced Android assets.

**Remaining risk:** Needs a new GitHub-built APK and ADB/device login test before the user-facing symptom can be marked fixed.

---

## ISSUE-014 — Android online/cloud sync can falsely show offline
**Severity:** CRITICAL
**Status:** CODE FIX WRITTEN + UNIT TESTED; APK RUNTIME UNVERIFIED (2026-06-30)

The compiled `useOnlineStatus` hook read `navigator.onLine`, which is unreliable in the Android WebView context and can leave Settings/cloud sync showing offline or local-only mode while the device is connected.

**Current fix:** `android-bridge.js` now reads Capacitor Network status, overrides the Android `navigator.onLine` getter, exposes `window.__isoIsOnline()`, and dispatches `isotope:network`. `scripts/apply-android-patches.js` patches the compiled `useOnlineStatus` bundle to consume that Android state and event. The bridge also intercepts direct absolute Supabase `/functions/v1/*` calls so Supabase JS client function invocations do not bypass Android's RPC mapping.

**Evidence:** `npm test` includes Android bridge network-state coverage and patch-contract coverage for `useOnlineStatus`.

**Remaining risk:** Needs GitHub-built APK install and online/cloud sync runtime evidence. Supabase RPC/storage failures must still be inspected if cloud sync remains broken after the false-offline fix.

---

## ISSUE-015 — Previous system PiP timer was not interactive
**Severity:** HIGH
**Status:** REPLACED IN CODE + UNIT TESTED; DEVICE UNVERIFIED (2026-06-30)

The previous repair path injected `android-pip-bridge.js`, faked `documentPictureInPicture`, and entered Android system PiP through `MainActivity`. Android system PiP does not allow directly clickable app UI; only system PiP menu actions are available. Therefore the previous "compact timer PiP" could not satisfy the desktop-equivalent interactive timer requirement.

**Current fix:** The old document-PiP shim is removed from packaging. Focus now calls `window.__isoOpenFloatingTimer()` and passes real `useFocusStore` state/actions to `android-floating-timer-bridge.js`. Native Android renders `FloatingTimerService` with `WindowManager`, `TYPE_APPLICATION_OVERLAY`, Display-over-other-apps permission flow, a foreground service notification, transparent outside window, rounded draggable card, and queued actions back to the WebView.

**Evidence:** `npm test` covers bridge packaging, overlay permission denial, tracked/non-tracked question-control behavior, Correct/Incorrect/Skip/Undo/Target dispatch, target bounding, service/overlay native contracts, and queued action replay contracts. `npm run build` passed with idempotent patching.

**Remaining risk:** Needs GitHub-built APK and OnePlus Pad Go runtime evidence. Do not mark runtime Floating Timer done until the overlay is dragged over another app and real counts update from the native controls.

---

## ISSUE-017 — Focus-type emoji corruption
**Severity:** HIGH
**Status:** FIXED IN CODE + UNIT TESTED; DEVICE UNVERIFIED (2026-06-30)

The production profile normalizer used `(icon.trim() || "📌").slice(0, 4)`, which counts UTF-16 code units and can split emoji. It also preserved corrupted stored values such as `����`, U+FFFD, and `ï¿½`, causing Lecture and other focus types to render broken icons.

**Current fix:** Android installs a grapheme-safe icon normalizer before the app bundle loads. The App bundle patch calls it while normalizing focus types. Stored Android profile data is repaired once when corrupted. Built-in invalid icons fall back to canonical values:
`theory=📚`, `questions=❓`, `lecture=🎓`, `revision=📝`, `practice=💪`, `other=📌`.

**Evidence:** `npm test` covers compound emoji, Lecture `����`, U+FFFD, `ï¿½`, valid custom emoji, unpaired surrogates, one-shot persistence, and preservation of canonical/custom focus types.

**Remaining risk:** Needs GitHub-built APK and device verification that Lecture displays `🎓`.

---

## ISSUE-018 — npm audit dev dependency vulnerabilities
**Severity:** MEDIUM
**Status:** BLOCKED WITHOUT CAPACITOR MAJOR UPGRADE (2026-06-30)

`npm audit` reports 2 high-severity dev-only vulnerabilities through `@capacitor/cli@6.2.1`:

- `tar@6.2.1`
- `glob@9.3.5`

**Current finding:** `npm audit fix --dry-run` and `npm audit fix --package-lock-only --dry-run` have no non-force fix. The available fix forces `@capacitor/cli@8.4.1`, a major Capacitor migration that can break native bridge and patch-script behavior.

---

## ISSUE-021 — Analytics Monthly switch can black-screen Android WebView
**Severity:** CRITICAL
**Status:** CODE FIX WRITTEN + UNIT TESTED; APK RUNTIME UNVERIFIED (2026-07-01)

User reported the same black-screen class on Analytics when switching month to view past sessions.

**Current fix:** Android now has a native/WebView resume repaint path, stable dark post-splash theme, Android-gated render recovery CSS, Android Sentry/replay startup suppression, Android chart animation disablement for AnalyticsPeriod, Android Session Log row render cap, and Monthly/Weekly next navigation clamping at the current period.

**Evidence:** `npm test` includes Android Analytics render-stability patch-contract coverage and native WebView resume/repaint contract coverage. `npm run build` passed with idempotent patching.

**Remaining risk:** Needs a GitHub-built APK and OnePlus Pad Go runtime test for Analytics Monthly switching, Focus page open/reopen, app resume, rotation, and WebView console/Logcat evidence.

---

## ISSUE-022 — Profile/onboarding partial updates can wipe academics
**Severity:** HIGH
**Status:** CODE FIX WRITTEN + UNIT TESTED; APK RUNTIME UNVERIFIED (2026-07-01)

The compiled onboarding/profile flow can save academics and then later send a smaller profile payload. A replace-style profile write can erase exam/subject selections from cloud `profile_data`.

**Current fix:** Android profile POST reads existing `profile_data`, deep-merges partial updates, upserts the merged row, and persists completed onboarding with a verified `user_onboarding` upsert only when the merged profile is complete.

**Evidence:** `npm test` includes `profile save deep-merges existing profile_data and persists completed onboarding once`.

**Decision:** Do not run `npm audit fix --force` in this repair. Track a separate Capacitor 8 migration after the Floating Timer/auth/sync runtime issues are stabilized.

---

## ISSUE-019 — Android Supabase functions/storage were partially disconnected beyond login
**Severity:** CRITICAL
**Status:** CODE FIX WRITTEN + UNIT TESTED; APK RUNTIME UNVERIFIED (2026-06-30)

User reported the APK is still mostly disconnected from Supabase except login/info. Code review confirmed multiple Android bridge gaps:

- the bridge intercepted `/__supa/functions/v1/*` but not direct absolute Supabase `/functions/v1/*` calls from the Supabase JS client;
- `finish-session` forwarded raw browser payloads instead of SQL parameter names;
- daily leaderboard called nonexistent `get_daily_leaderboard`;
- group leaderboard/analytics forwarded `groupId` instead of `p_group_id`;
- import was a no-op acknowledgment;
- snapshot updated only a timestamp instead of uploading a canonical backup;
- backup upload wrote one loose `userId/backup-*.json` object, creating orphaned files and no canonical restore target.

**Current fix:** `android-bridge.js` now maps direct function URLs and `/__supa/functions/v1/*`, transforms RPC payloads to the exact SQL signatures, propagates non-2xx failures, writes canonical backup/cloud snapshot objects, returns browser restore payloads, and provides explicit storage cleanup preview/apply routes.

**Evidence:** `npm test` covers direct function interception, RPC payload mapping, RPC failure propagation, session sync snapshot upload, canonical backup upload, `BLOCKED_EMPTY_OVERWRITE`, restore payload shape, import archive/promote, and stale archive cleanup.

**Remaining risk:** Needs GitHub-built APK runtime verification with the real Supabase project, because RLS/Data API/Storage policies can still block requests even when the client contract is correct.

---

## ISSUE-020 — Focus page intermittent black screen and dark-mode PNG logo
**Severity:** HIGH
**Status:** REPORTED; NOT YET REPRODUCED (2026-06-30)

User reported that opening the Focus page sometimes works, sometimes does not, and sometimes shows a full black screen. User also reported the app logo is a PNG and looks wrong in dark mode.

**Current state:** Not fixed in this checkpoint. The current code adds WebView hardware acceleration and renderer priority to reduce WebView rendering instability without changing the UI, but this is not proof that the Focus black-screen bug is fixed.

**Required evidence before fixing:** GitHub-built APK, exact route, Logcat, WebView console output, screenshot, whether it happens after rotation/backgrounding, and whether the Floating Timer bridge is active.

---

## ISSUE-016 — Native app polish gaps: logo, keyboard, back button, font scale
**Severity:** HIGH
**Status:** CODE FIX WRITTEN + UNIT TESTED (2026-06-30)

User reported the APK still felt PWA-like and requested the isotope-code logo, Android app-shell stabilization, and a proper Font Size section in Settings.

**Current fix:** Launcher vector and density PNG resources now use isotope-code logo assets; manifest uses `adjustResize`; bridge handles Capacitor back-button events; Settings bundle gets a matching Font Size slider persisted to profile/localStorage and applied by the bridge on startup.

**Evidence:** `npm test` verifies the Settings patch and Android native resource contracts. `npm run build` passed through sync and idempotent patching.

**Remaining risk:** Needs device layout/keyboard/back-button verification from the GitHub-built APK.
