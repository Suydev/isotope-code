# IsotopeAI Android — Architecture Decisions

---

## DEC-001 — Capacitor over React Native rewrite

**Date:** 2026-06-28
**Context:** Converting IsotopeAI (a Node.js + React/Vite web app) to Android.
**Options considered:**
1. Full React Native rewrite — months of work, UI parity impossible
2. Capacitor WebView wrapper — preserves all 211 JS chunks and existing UI exactly
3. TWA (Trusted Web Activity) — requires live server, no true offline

**Chosen:** Capacitor WebView wrapper

**Why:** The real UI is pre-compiled in `public/assets/` (211 JS chunks, 342KB main bundle). Rewriting would take months and could never achieve UI parity. Capacitor lets us ship the identical compiled frontend as a bundled Android app.

**Consequences:**
- APK is ~80MB+ (includes all JS assets and WAV sound files)
- No native navigation gestures — WebView scroll behavior
- Sound files (42MB WAV) should be converted to OGG/AAC in a future task

**Files affected:** `capacitor.config.json`, `package.json`, `.github/workflows/android.yml`
**Reversible:** Yes — the React Native path is always available later

---

## DEC-002 — Fetch interceptor over native Kotlin plugins

**Date:** 2026-06-28
**Context:** The app uses `/__auth/*` and `/__supa/*` server endpoints that must be replaced.
**Options considered:**
1. Kotlin plugins that bridge WebView → Java code
2. JavaScript fetch() interceptor in WebView

**Chosen:** JavaScript fetch interceptor (`android-bridge.js`)

**Why:** All auth/backup/sync logic is already implemented in the existing JS bundles (auth-bridge.js, backup-normalizer.js, local-data-adapter.js). The bridge intercepts `window.fetch` and routes known paths to direct Supabase calls, eliminating the need to rewrite any Kotlin. Capacitor's WebView runs full ES6+ JS, so this is clean and maintainable.

**Consequences:**
- Bridge must be the FIRST script loaded in `<head>` of index.html
- All /__auth/* response shapes must exactly match what server.mjs returns
- Any new server endpoint needs a bridge handler added

**Files affected:** `android-bridge.js`, `scripts/prepare-www.js`
**Reversible:** Yes — Kotlin plugin approach is still possible

---

## DEC-003 — Bundle assets locally (no remote WebView)

**Date:** 2026-06-28
**Context:** Whether to load assets from a remote URL or bundle them in the APK.
**Options considered:**
1. Remote WebView — fast updates but requires network to launch
2. Bundle all assets in www/ — truly offline, self-contained APK

**Chosen:** Bundle all assets in www/

**Why:** IsotopeAI is advertised as offline-first. Android users expect offline launch. Capacitor's default is bundled assets. Remote loading would require a CDN and defeat the offline-first goal.

**Consequences:**
- APK size is large (80MB+)
- Updates require new APK release (no hot updates)
- Sound files (42MB) should be converted to OGG to reduce size

**Files affected:** `capacitor.config.json` (webDir: "www"), `scripts/prepare-www.js`
**Reversible:** Yes — capacitor.config.json server.url can point to remote

---

## DEC-004 — Service worker disabled in Android context

**Date:** 2026-06-28
**Context:** Capacitor WebView and service workers have known conflicts.
**Options considered:**
1. Keep service worker active — cache management complexity
2. Replace with no-op SW — simpler, assets already bundled

**Chosen:** Replace sw.js with a no-op service worker

**Why:** Capacitor bundles all assets locally — the service worker cache is redundant. SW in Capacitor can cause stale asset loops and navigation issues. The no-op SW prevents 404s if any code tries to register it.

**Consequences:**
- No SW-based offline fallback (not needed — assets are bundled)
- No push notifications via SW (will use @capacitor/local-notifications instead)

**Files affected:** `scripts/prepare-www.js` (patches sw.js)
**Reversible:** Yes — remove the SW noop patch

---

## DEC-005 — Direct Supabase calls (not via /__supa proxy)

**Date:** 2026-06-28
**Context:** The web app proxies all Supabase calls through `/__supa/*` on the local server.
**Options considered:**
1. Keep /__supa proxy — intercept and forward to Supabase directly
2. Direct Supabase calls — bypass proxy entirely

**Chosen:** Intercept /__supa/* and forward to Supabase directly (option 1)

**Why:** The existing JS bundles already use /__supa/* URLs hardcoded throughout 211 chunks. Changing them all to direct Supabase URLs would require recompiling. The bridge intercepts and forwards transparently.

**Consequences:**
- android-bridge.js `handleSupaProxy()` must handle all /__supa/* paths
- RPC calls via `supabase.functions.invoke()` also use this path

**Files affected:** `android-bridge.js`
**Reversible:** N/A — this is a transparent proxy

---

## DEC-006 — Supabase anon key hardcoded in android-bridge.js

**Date:** 2026-06-28
**Context:** The anon/publishable key must be available in the APK for Supabase calls.
**Options considered:**
1. Build-time injection via Gradle variables
2. Hardcode in android-bridge.js (which is bundled in www/)
3. Runtime fetch from a config endpoint

**Chosen:** Hardcode in android-bridge.js

**Why:** The anon key is a publishable/public key — it is designed to be embedded in client applications. Supabase's RLS policies protect data. The service-role key is NEVER included. This is the same pattern used by every Supabase mobile app.

**Consequences:**
- Anon key is visible in the APK (expected and safe for publishable keys)
- Service-role key must NEVER be added to any client file
- If the anon key changes, a new APK must be released

**Files affected:** `android-bridge.js`
**Reversible:** Yes — can switch to Gradle build config injection

---

## DEC-007 — WAV sound files included as-is

**Date:** 2026-06-28
**Context:** rain.wav (14.8MB), wind.wav (17.1MB), crickets.wav (11.9MB) = 43.8MB total.
**Options considered:**
1. Include as-is (WAV) — simple but 43.8MB added to APK
2. Convert to OGG — ~80% size reduction, Android native format
3. Exclude sounds — breaks ambient sound feature

**Chosen:** Include as-is for MVP; convert to OGG in future task

**Why:** OGG conversion requires ffmpeg which is not available in basic CI. For MVP, functionality is more important than APK size. Android's WebView supports WAV audio.

**Consequences:**
- APK download size is significantly larger than necessary
- Should be addressed before Play Store release (Play Store warns on APK >100MB)

**Files affected:** `www/sounds/` (populated by prepare-www.js)
**Reversible:** Yes — future task ANDROID-009

---

## DEC-008 — GitHub Actions for APK builds (not local)

**Date:** 2026-06-28
**Context:** Building APKs requires Android SDK + Java + Gradle. Replit doesn't have this.
**Options considered:**
1. Build locally in Replit — Android SDK not available
2. GitHub Actions — available for free on public repos

**Chosen:** GitHub Actions CI (.github/workflows/android.yml)

**Why:** Replit does not have the Android SDK. GitHub Actions has free minutes for public repos and provides the full build environment.

**Consequences:**
- Builds take ~10-15 minutes in CI
- Must push to GitHub to trigger a build
- APK is uploaded as a GitHub Actions artifact (download from Actions tab)

**Files affected:** `.github/workflows/android.yml`
**Reversible:** Yes — any CI provider can be used

---

## DEC-019 — Floating Timer overlay replaces system PiP timer UI

**Date:** 2026-06-30
**Context:** The previous Android timer window used a fake `documentPictureInPicture` bridge and Android system Picture-in-Picture. User testing confirmed this did not behave like the desktop timer and could not provide directly clickable timer controls.

**Options considered:**
1. Keep system PiP and add more CSS/DOM patching.
2. Use Android system PiP RemoteActions only.
3. Build an Android overlay service named Floating Timer.

**Chosen:** Build an Android Floating Timer overlay using `WindowManager` and `TYPE_APPLICATION_OVERLAY`.

**Why:** Android system PiP cannot host arbitrary clickable application UI. RemoteActions are exposed through the system PiP menu, not as a desktop-equivalent timer card. The requested experience requires Display-over-other-apps permission and a native overlay service.

**Consequences:**
- App must request `SYSTEM_ALERT_WINDOW` through the Android settings permission flow.
- A foreground service notification is required while the overlay is active.
- The WebView remains the source of truth for timer/question state; native renders a validated snapshot and sends safe enum actions back.
- System PiP remains only a reduced fallback in `MainActivity`, not the primary timer-window implementation.

**Files affected:** `android-floating-timer-bridge.js`, `MainActivity.java`, `FloatingTimerService.java`, `AndroidManifest.xml`, `scripts/prepare-www.js`, `scripts/apply-android-patches.js`
**Reversible:** Yes, but only by replacing the overlay with another native implementation that supports direct interaction.

---

## DEC-020 — Grapheme-safe focus icon repair in Android compatibility layer

**Date:** 2026-06-30
**Context:** The compiled production App bundle normalized focus-type icons with UTF-16 `.slice(0, 4)`, which can split compound emoji and preserve corrupted replacement-character data.

**Chosen:** Install a grapheme-safe normalizer before the App bundle loads and patch the compiled normalizer to call it.

**Why:** The authored source for the exact production bundle is not compiled locally in this wrapper repo; the APK packages the pinned `isotope-code/public` assets. A targeted compatibility patch preserves the real UI while repairing local/cloud/imported profile data before rendering.

**Consequences:**
- Built-in invalid icon values fall back to canonical icons.
- Valid custom emoji and custom focus types are preserved.
- Stored corrupted Android profile data is rewritten once, only when a repair is needed.

**Files affected:** `android-floating-timer-bridge.js`, `scripts/apply-android-patches.js`

---

## DEC-021 — Android WebView render recovery and Android-only Analytics stabilization

**Date:** 2026-07-01
**Context:** User testing reported the Focus page still sometimes opens to a full black screen, and Analytics also black-screens when switching Monthly views to inspect past sessions.

**Chosen:** Add Android-gated native/WebView recovery and reduce heavy Android-only chart/render pressure without changing the IsotopeAI UI source.

**Why:** The black screen pattern matches Android WebView compositor/activity resume failure under heavy animated chart/blur/table rendering. The APK packages pinned compiled production assets, so the wrapper must stabilize those assets through native lifecycle hooks and exact patch-contract tests.

**Consequences:**
- `MainActivity.onResume()` resumes WebView timers, invalidates the surface, and invokes `window.__isoAndroidForceRepaint`.
- `android-bridge.js` dispatches `isotope:android-resume`, installs Android render recovery CSS, and reloads only when the React root is blank.
- Analytics patches disable Android Sentry/replay startup, force reduce-motion/performance behavior on Android, disable chart animation on Android, and cap rendered Session Log rows to 120 while preserving source data.
- Runtime proof still requires a GitHub-built APK and device/WebView evidence.

**Files affected:** `MainActivity.java`, `styles.xml`, `android-bridge.js`, `scripts/apply-android-patches.js`, `test/prepare-patches.test.mjs`

---

## DEC-022 — Profile saves must deep-merge cloud profile_data

**Date:** 2026-07-01
**Context:** Onboarding academics/exam/subjects could be saved first and then overwritten by later partial profile updates from the Android bridge.

**Chosen:** `handlePostProfile()` reads the existing row, deep-merges incoming `profile_data`, upserts the merged row, and persists `user_onboarding.completed=true` only when the merged profile says onboarding is complete.

**Why:** PostgREST partial profile writes from multiple compiled bundles must not destroy unrelated profile settings or create sync loops. Onboarding completion must be a verified upsert, not inferred from row existence.

**Files affected:** `android-bridge.js`, `test/android-bridge.test.mjs`
**Reversible:** Yes, once isotope-code authored source ships a safe normalizer and the Android patch can be removed.

---

## DEC-009 — src/App.tsx is a placeholder; DO NOT use it

**Date:** 2026-06-28
**Context:** The isotope-code repository has src/App.tsx.
**Decision:** This file contains only "Replit Agent is building..." and is NOT the production UI.
**Why:** The production React app is pre-compiled in public/assets/. There is no rebuild path from src/ to the production public/assets/ (the source code for Dashboard, Timer, etc. is not in src/).
**Consequences:** Never run `npm run build` expecting it to produce the production UI. Always use public/ as-is.
**Files affected:** N/A — just awareness
**Reversible:** N/A

---

## DEC-010 — Commit the Android native project

**Date:** 2026-06-29
**Context:** CI previously recreated the Android platform with `npx cap add android`, which can discard native manifest, Gradle, resource, and Kotlin customizations.

**Chosen:** Generate the Android project once, commit `android/`, and make CI run `npx cap sync android`.

**Why:** Native configuration is production code. Recreating the platform during every build makes notification, permission, manifest, SDK, and Gradle changes unreliable.

**Consequences:**
- `android/` is now part of the repair branch.
- CI applies native patches before and after `npx cap sync android`.
- Build output and copied web assets remain ignored.

---

## DEC-011 — Pin isotope-code source commit for APK builds

**Date:** 2026-06-29
**Context:** Packaging whatever happens to be latest on `isotope-code/main` makes Android builds non-deterministic.

**Chosen:** Pin GitHub Actions to `isotope-code` commit `fd39fad1384333ad774f19f35b754659a34dae60`.

**Why:** Bundle patch contracts and regression evidence apply to a specific compiled asset set.

**Consequences:**
- Updating the web UI source requires intentionally changing the pinned SHA and rerunning patch-contract tests.

---

## DEC-012 — Android owns native-only app behavior

**Date:** 2026-06-30
**Context:** The packaged APK still exposed browser/PWA assumptions after login: `navigator.onLine` could report offline while Android was connected, Focus PiP depended on browser `documentPictureInPicture`, notifications used web/service-worker paths and mismatched Android icons, and the native activity had no app-shell behavior beyond an empty Capacitor activity.

**Chosen:** Keep the compiled IsotopeAI UI as source of truth, but wire Android-only behavior through Capacitor/native contracts:
- Capacitor Network drives Android online state and the patched `useOnlineStatus` bundle.
- Capacitor LocalNotifications drives scheduled focus notifications with a real `ic_notification` resource.
- `MainActivity` exposes an `IsotopeAndroid` JavaScript interface for Floating Timer overlay control, reduced system-PiP fallback, keyboard/app-shell behavior, and notification resource contracts.
- Android manifest/activity resources own overlay permissions, reduced PiP fallback, keyboard resize, launcher icon, and notification resources.
- `android-bridge.js` owns app back-button handling and device font-scale startup application.

**Why:** These behaviors cannot be proven by browser APIs inside a WebView. The APK must act like an Android app while preserving the existing compiled UI.

**Consequences:**
- `scripts/apply-android-patches.js` now has explicit patch-contract tests for online status, Floating Timer, Settings Font Size, and native resource requirements.
- Device/emulator evidence is still required before marking cloud sync, notification delivery, Floating Timer, and keyboard/back behavior fully fixed.

---

## DEC-012 — `/__auth/check` must be neutral and non-destructive

**Date:** 2026-06-29
**Context:** The Android bridge previously implemented email checking by attempting Supabase signup with a dummy password.

**Chosen:** Return a neutral response from `/__auth/check` and let real signup return the authoritative result.

**Why:** Availability probing must not create users, send email, consume auth rate limits, or reveal arbitrary account existence.

**Consequences:**
- The UI cannot rely on pre-checks to determine whether an arbitrary email exists.
- Regression test verifies zero signup requests.

---

## DEC-013 — Android bootstrap must match server bootstrap contract

**Date:** 2026-06-29
**Context:** `restore-and-launch.js` applies bootstrap snapshots using `snapshot.onboarding.completed`, `profile_data`, `cloud_snapshot`, `study_sessions_log`, and `stats_summary`. Returning only `onboarding_completed` caused incorrect boot routing.

**Chosen:** Android `/__auth/bootstrap` returns the canonical server-compatible response and `restore-and-launch.js` remains backwards-compatible with legacy `onboarding_completed`.

**Why:** Login, restore, and boot routing need one authoritative state machine across server and Android.

**Consequences:**
- Unknown onboarding state remains unknown on network failure; it is not defaulted to false.
- New seeded `completed=false` rows route to onboarding.
- Completed rows route to dashboard.
- Legacy meaningful profile/study data without a valid onboarding row is migrated safely.

---

## DEC-014 — Android package must suppress web/PWA runtime affordances

**Date:** 2026-06-30
**Context:** The user-tested APK still behaved like a PWA: the HTML kept web-app manifest metadata and the compiled `PWAManager` still mounted inside the native shell.

**Chosen:** Strip PWA manifest/mobile-web-app metadata during `prepare-www`, keep service-worker/update scripts disabled, and patch the App bundle so `PWAManager` does not render when `window.__ISO_IS_ANDROID__` is true.

**Why:** Capacitor is the app container. The packaged APK should not show browser install/update/offline PWA behavior inside the Android runtime.

**Consequences:**
- Web/PWA metadata remains intact in `isotope-code`; only Android packaging removes it.
- Patch-contract tests fail if the Android PWA suppression is absent.

---

## DEC-015 — Android login hydrates auth store directly after bridge bootstrap

**Date:** 2026-06-30
**Context:** The previous Auth patch waited for bootstrap but still called the compiled `initializeAuth()`. On Android, that initializer can re-read browser Supabase client/session state and flip the UI back to logged-out/create-account state.

**Chosen:** After `window.__isoLogin` and bootstrap succeed, patch the Auth bundle to set the persisted auth store directly from the returned Android session/bootstrap, then route once.

**Why:** The Android bridge is the authoritative login implementation. The compiled browser auth initializer must not be allowed to undo the just-verified bridge login state.

**Consequences:**
- Auth routing depends on bootstrap only.
- The store receives `isAuthenticated`, `isInitialized`, `userId`, `email`, plan fields, and identity fields immediately after login.

---

## DEC-016 — Android Supabase auth storage must read bridge-written localStorage sessions

**Date:** 2026-06-30
**Context:** Supabase Auth logs showed the user's credential login returned HTTP 200, but the APK still returned to login/create-account after the splash. `auth-bridge.js` writes the session to `localStorage`, while the compiled app's Supabase client storage adapter reads an IndexedDB-backed wrapper first.

**Chosen:** Patch the compiled app bundle so the Supabase auth storage adapter falls back to Android bridge `localStorage` keys and mirrors set/remove operations there when `window.__ISO_IS_ANDROID__` is true.

**Why:** `initializeAuth()` must see the same session that the Android auth bridge just created. Otherwise the browser auth initializer can conclude there is no session and reset the user to logged out.

**Consequences:**
- Android uses `isotope-auth-token`, `sb-vteqquoqvksshmfhuepu-auth-token`, and `isotope-last-session-raw` as compatible session fallbacks.
- Regression tests fail if the storage fallback disappears from the packaged app bundle.
- This remains a minified-bundle compatibility patch until authored source can be changed upstream.

---

## DEC-017 — Native login must refresh the global boot state before routing

**Date:** 2026-06-30
**Context:** After a no-session startup, `restore-and-launch.js` can publish `window.__ISO_BOOT_STATE__.state="readyLoggedOut"`. The Android Auth patch can then log in successfully and hydrate the auth store, but AppAccessGate still reads the stale logged-out boot snapshot and redirects back to `/auth`.

**Chosen:** Patch the Auth bundle so successful `window.__isoLogin` writes a fresh canonical `window.__ISO_BOOT_STATE__` from bootstrap before navigating. Patch AppAccessGate so `readyLoggedOut` redirects to `/auth` only when the auth store is not authenticated. Keep Android auth-session keys out of the AppAccessGate localStorage cleanup set.

**Why:** Android login needs one authoritative post-login state. Bootstrap decides dashboard versus onboarding, and stale startup state must not override a verified authenticated session.

**Consequences:**
- Existing completed users route to dashboard from `readyDashboard`.
- New/incomplete users route to onboarding from `readyNeedsOnboarding`.
- A temporary bootstrap failure still blocks routing instead of guessing.
- Regression tests fail if the Auth boot-state refresh or AppAccessGate stale-state guard disappears.

---

## DEC-018 — Android sync bridge owns direct Supabase function interception and canonical backup storage

**Date:** 2026-06-30
**Context:** The APK could log in, but cloud sync/community/session features still appeared disconnected. The compiled app can call both `/__supa/functions/v1/*` and the absolute Supabase project URL `/functions/v1/*`. The Android bridge only handled the first form. Several bridge handlers also forwarded raw edge-function payloads to SQL RPCs, and backup/import/snapshot handlers did not maintain canonical cloud objects.

**Chosen:**
- Intercept both `/__supa/functions/v1/*` and `${SUPA_URL}/functions/v1/*` in `android-bridge.js`.
- Transform compiled browser payloads to exact SQL RPC signatures before calling PostgREST RPC endpoints.
- Return `ok:false` on non-2xx RPC/storage failures.
- Store user backups canonically in Supabase Storage:
  - `userId/backups/latest.json`
  - `userId/backups/history/*.json`
  - `userId/cloud-snapshot/latest.json`
  - imports archived under `userId/imports/`
- Preserve `BLOCKED_EMPTY_OVERWRITE`.
- Delete only current-user stale `.json` archive files after verified upload/readback, using user JWT and never service-role credentials.

**Why:** The packaged Android app has no Node server. The bridge must provide the same contracts the compiled web app expects, and it must do so with user-scoped Supabase Auth/RLS rather than fake success responses.

**Consequences:**
- `android-bridge.js` is now intentionally part of the current repair scope.
- Runtime failure after this point should be investigated as a real Supabase/RLS/Storage policy or network error, not silently masked.
- Unit tests cover payload mapping and backup safety, but real APK testing is still required.

---

## DEC-020 — Do not delete community role/admin labels as "admin panel" cruft

**Date:** 2026-06-30
**Context:** User asked to remove admin panel/useless things. Static inspection found no packaged `/admin` or `/__admin` route in the Android public assets. Server-only admin cleanup pages exist in `isotope-code/server.mjs`, but that server is not packaged into the APK. Some `admin` strings in the APK are legitimate community group roles.

**Chosen:** Do not remove community owner/admin/member role code from the APK. Continue excluding server-only admin pages from Android packaging.

**Why:** Removing community role labels would break community authorization/UI semantics and would not remove an admin panel from the packaged APK because that panel is server-only.

**Consequences:**
- Future cleanup should target proven packaged routes/files, not raw string matches for `admin`.
