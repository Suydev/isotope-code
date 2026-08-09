# IsotopeAI Android — Session Log

---

## Session 2026-06-28 (Initial Build)

**Agent/account:** Replit Agent (initial session)
**Starting commit:** (none — new repo)
**Ending commit:** (pushing now via GitHub API)

**Objective:**
- Create Capacitor wrapper structure for IsotopeAI Android APK
- Implement android-bridge.js (fetch interceptor for all server endpoints)
- Set up GitHub Actions CI for debug APK builds
- Create full multi-agent handoff system

**Completed:**
- ✅ Cloned and audited isotope-code repo (30 subagents read all audit files + key bundles)
- ✅ Created package.json with Capacitor 6.2.x and all required plugins
- ✅ Created capacitor.config.json (appId: in.isotopeai.app, webDir: www)
- ✅ Created android-bridge.js — complete fetch interceptor:
  - handleLogin() → Supabase /auth/v1/token
  - handleSignup() → Supabase /auth/v1/signup
  - handleBootstrap() → Supabase REST user_profiles + user_onboarding
  - handleGetProfile() / handlePostProfile() → Supabase REST
  - handleUploadBackup() → Supabase Storage user-content bucket
  - handleGetLatestBackup() / handleGetBestBackup()
  - handleSnapshot() / handleRestoreBestBackup() / handleImport()
  - handleSupaProxy() → transparent /__supa/* forwarding
  - Static responses for /api/version, /api/health, /api/ai-config, /__isotope/ping
- ✅ Created scripts/prepare-www.js (copy public/ → www/, inject bridge, noop sw.js)
- ✅ Created scripts/apply-android-patches.js (5 bundle patches)
- ✅ Created .github/workflows/android.yml (debug + release APK CI)
- ✅ Created complete .agent/ handoff system (all 11 files)
- ✅ Created scripts/agent-resume.sh, agent-handoff.sh, agent-status.mjs

**Files changed:**
- android-bridge.js (new)
- package.json (new)
- capacitor.config.json (new)
- scripts/prepare-www.js (new)
- scripts/apply-android-patches.js (new)
- scripts/agent-resume.sh (new)
- scripts/agent-handoff.sh (new)
- scripts/agent-status.mjs (new)
- .github/workflows/android.yml (new)
- AGENTS.md (new)
- .agent/BOOTSTRAP.md (new)
- .agent/CURRENT_STATE.md (new)
- .agent/NEXT_TASKS.md (new)
- .agent/DECISIONS.md (new)
- .agent/ARCHITECTURE.md (new)
- .agent/TEST_STATUS.md (new)
- .agent/KNOWN_ISSUES.md (new)
- .agent/FILE_MAP.md (new)
- .agent/SESSION_LOG.md (new)
- .agent/state.json (new)
- .agent/last-test-output.txt (new)
- .agent/README.md (new)

**Commands run:**
- 30 async subagents launched to read all audit files + code bundles
- All files created via write tool (not yet pushed)

**Tests passed:** None (no APK built yet)
**Tests failed:** None

**Unresolved:**
- ISSUE-001: Bootstrap response missing restore_recommended field
- ISSUE-002: WAV sound files 43.8MB uncompressed
- ISSUE-003: Patch strings unverified against actual bundles
- ISSUE-004: GitHub Actions isotope-code repo access unknown
- ANDROID-005: APK not yet built

**Next exact action:**
```bash
# Push all files to GitHub and trigger CI build
node scripts/push-to-github.js
# Then check: https://github.com/Suydev/isotope-apk/actions
```

---

## Session 2026-06-29 (Android Production Repair)

**Agent/account:** Codex
**Branch:** codex/android-production-repair
**Starting state:** Existing APK still user-reported broken; all previous “fixed” claims treated as unverified.
**Ending state:** Ready to commit and push repair branch for GitHub Actions build.

**Objective:**
- Remove destructive `/__auth/check` signup behavior.
- Repair bootstrap/onboarding response contract and login routing.
- Commit stable Android project and update CI to build from the repair branch.
- Add regression tests for the highest-risk auth/bootstrap/patch issues.

**Completed:**
- Read required `.agent/` files, key repository files, recent commits, and the sibling `isotope-code` source/audit files.
- Updated `android-bridge.js`:
  - `/__auth/check` is neutral and non-destructive.
  - `/__auth/bootstrap` returns canonical server-compatible shape.
  - Onboarding completion uses verified PostgREST upsert with `on_conflict=user_id`.
  - Onboarding state no longer uses “row exists = onboarded”.
  - Network failure does not default unknown onboarding to false.
  - Selected RPC failures now propagate as `ok:false` instead of false success.
- Updated `scripts/prepare-www.js`:
  - Defaults to sibling `../isotope-code`.
  - Patches `restore-and-launch.js` for legacy `onboarding_completed` compatibility without defaulting unknown state to false.
- Updated `scripts/apply-android-patches.js`:
  - Required Auth patch routes login exactly once from bootstrap decision.
  - Required targets fail on missing/ambiguous matches.
  - Native manifest permissions and SDK versions are normalized.
- Generated and retained the native `android/` project.
- Updated GitHub Actions:
  - Runs on `codex/android-production-repair`.
  - Pins `isotope-code` to `fd39fad1384333ad774f19f35b754659a34dae60`.
  - Uses `npm ci`, runs `npm test`, syncs the committed Android project, and does not run `npx cap add android`.
- Added regression tests under `test/`.

**Commands run:**
- `node --check scripts/apply-android-patches.js`
- `node --check scripts/prepare-www.js`
- `npm install --package-lock-only`
- `npm test`
- `npm run prepare-www`
- `npm run apply-patches`
- `npx cap sync android`
- `npm run apply-patches`

**Tests passed:**
- 9 Node regression tests.
- `prepare-www` copied the real UI: 154 JS bundles, 56.9 MB.
- Android patch pass after sync: 0 skipped, 0 required failures.

**Not verified:**
- GitHub Actions APK build.
- Emulator or physical-device install.
- Packaged login/dashboard/onboarding flow.
- Backup restore, offline mode, native notifications, timer process-death recovery, import/export, and responsive Android matrix.

**Tooling limitation:**
- `gh` is not installed, so Actions inspection and PR creation through GitHub CLI are unavailable here.

**Next exact action:**
```bash
npm run agent:handoff
git add .gitignore android-bridge.js package.json package-lock.json scripts/prepare-www.js scripts/apply-android-patches.js .github/workflows/android.yml test android .agent
git commit -m "fix: repair Android auth bootstrap contract"
git push -u origin codex/android-production-repair
```

**Push/build result:**
- Commit pushed: `d33d38cf976528fe827f69dee21c6d3061ef0c85`
- Branch: `codex/android-production-repair`
- GitHub Actions debug APK build: PASS
- Run: https://github.com/Suydev/isotope-apk/actions/runs/28374915430
- Artifact: `IsotopeAI-debug-28` (artifact id `7953037831`)
- Draft PR: https://github.com/Suydev/isotope-apk/pull/1

**Next exact action after build:**
```bash
# Download IsotopeAI-debug-28 from the successful Actions run, then:
adb install -r app-debug.apk
adb logcat -c
adb logcat
```

---

## Session 2026-06-30 (Login/PWA/Native Notification Follow-Up)

**Agent/account:** Codex
**Branch:** codex/android-production-repair
**Starting commit:** `8abb671d4d8f`
**Ending state:** Follow-up patch ready to commit and push.

**User-reported APK result:**
- After credentials, login stayed loading and then returned to the create-account page.
- Android notification permission was not requested.
- The app still behaved like a PWA instead of a native app.

**Completed:**
- Patched Android Auth bundle replacement so successful `window.__isoLogin` hydrates the auth Zustand store directly from Android session/bootstrap and routes exactly once.
- Patched Android packaging to strip PWA manifest/mobile-web-app metadata.
- Patched App bundle to skip the compiled `PWAManager` on Android.
- Added native LocalNotifications bridge helpers in `android-bridge.js` for permission, channel creation, scheduling, cancellation, focus timer scheduling, and notification-tap routing to `/focus`.
- Patched notification and focus-store bundles to call native scheduling/cancel helpers on Android.
- Hardened patch idempotence so required patches do not re-apply into their own fallback expressions.
- Added regression coverage for auth-store hydration, PWA stripping, PWA manager disablement, and native notification/focus scheduling hooks.

**Commands run:**
- `node --check android-bridge.js`
- `node --check scripts/prepare-www.js`
- `node --check scripts/apply-android-patches.js`
- `npm test`
- `npm run prepare-www`
- `npm run apply-patches`
- `npx cap sync android`
- `npm run apply-patches`

**Tests passed:**
- 10 Node regression tests.
- `prepare-www` copied the real UI: 154 JS bundles, 56.9 MB.
- First patch pass: 14 patches, 0 skipped, 0 required failures.
- Final patch pass after sync: 0 bundle changes, 0 skipped, 0 required failures.

**Not verified:**
- Follow-up GitHub Actions APK build.
- Emulator or physical-device install.
- Real-device login, notification permission prompt, process-death notification, and app/PWA behavior.

**Tooling limitation:**
- `adb` is not installed in this environment, so device validation is still external.

**Next exact action:**
```bash
git add android-bridge.js scripts/prepare-www.js scripts/apply-android-patches.js test/prepare-patches.test.mjs .agent
git commit -m "fix: harden Android native login and notifications"
git push
```

---

## Session 2026-06-30 (Floating Timer + Emoji Repair)

**Agent/account:** Codex
**Branch:** codex/android-production-repair
**Starting commit:** `b927582`
**Ending state:** Floating Timer/emoji repair implemented locally; ready to commit and push.

**User-reported APK result:**
- System PiP minimized the app and did not behave like the desktop-equivalent interactive timer.
- PiP should not be called PiP if it needs an overlay; it needs Display-over-other-apps permission and must remain interactive.
- Focus-type emoji values are corrupted, especially Lecture showing `����`.

**Investigation completed before code edits:**
- Ran `npm run agent:resume`.
- Read `AGENTS.md`, `.agent/`, recent commits around `add0425` and `b927582`.
- Read `android-pip-bridge.js`, `android-bridge.js`, `MainActivity.java`, manifest, patch scripts, tests, and workflow.
- Inspected pinned `isotope-code` commit `fd39fad1384333ad774f19f35b754659a34dae60`.
- Inspected production bundles `Focus-BmgY-9vP.js`, `DashboardHeader-DNuRMna8.js`, `App-pJGjDiPw.js`, `useFocusStore-CX_Nyp1h.js`, and `backup.json`.

**Root causes confirmed:**
- Focus opened `documentPictureInPicture`; Android injected `android-pip-bridge.js`; that entered Android system PiP. Android system PiP cannot provide directly clickable app UI.
- `App-pJGjDiPw.js` normalized focus icons with UTF-16 `.slice(0, 4)` and preserved corrupted replacement-character data.

**Completed:**
- Added `android-floating-timer-bridge.js`.
- Removed `android-pip-bridge.js` from packaging.
- Patched Focus bundle contract to call `window.__isoOpenFloatingTimer()` with real store-backed state/actions.
- Added `FloatingTimerService.java` with `WindowManager`, `TYPE_APPLICATION_OVERLAY`, foreground notification, transparent outside window, rounded draggable card, timestamp-based timer display, and action buttons.
- Reworked `MainActivity.java` to provide overlay permission flow, service start/update/stop, reduced system PiP fallback, and queued action replay.
- Added manifest permissions/service declaration for overlay and foreground special-use service.
- Patched App bundle icon normalization to call a grapheme-safe normalizer.
- Added one-shot stored profile icon repair on Android.
- Removed deprecated `bundledWebRuntime`.
- Upgraded AGP to `8.6.1`, Gradle wrapper to `8.7`, and GitHub Actions major versions after verifying tags.
- Added/updated tests for Floating Timer bridge/native contracts and emoji repair.
- Updated `.agent/` handoff documentation.

**Commands run:**
- `node --check android-floating-timer-bridge.js`
- `node --check scripts/prepare-www.js`
- `node --check scripts/apply-android-patches.js`
- `npm test`
- `npm run build`
- `git diff --check`
- `npm audit`
- `npm explain tar`
- `npm explain glob`
- `npm audit fix --dry-run`
- `npm audit fix --package-lock-only --dry-run`

**Tests passed:**
- `npm test`: 25 tests passed.
- `npm run build`: prepare real UI assets, apply required patches, `npx cap sync android`, final patch pass idempotent.
- `git diff --check`: pass.

**Not verified:**
- GitHub Actions APK build for this commit.
- New APK install.
- OnePlus Pad Go Floating Timer acceptance.
- Device login/cloud sync/backup/offline/import-export/responsive checks.

**Important working-tree note:**
- `android-bridge.js` has unrelated unstaged edits from an earlier abandoned path. Do not stage them with this Floating Timer/emoji commit.

**Next exact action:**
```bash
git add .github/workflows/android.yml android-floating-timer-bridge.js android-pip-bridge.js android/app/src/main/AndroidManifest.xml android/app/src/main/java/in/isotopeai/app/MainActivity.java android/app/src/main/java/in/isotopeai/app/FloatingTimerService.java android/build.gradle android/gradle/wrapper/gradle-wrapper.properties capacitor.config.json scripts/apply-android-patches.js scripts/prepare-www.js test/android-bridge.test.mjs test/floating-timer-bridge.test.mjs test/floating-timer-native.test.mjs test/native-timer-pip-v2.test.mjs test/prepare-patches.test.mjs .agent
git commit -m "fix(android): replace broken PiP with floating timer and repair emoji"
git push
```

---

## Session 2026-06-30 (Post-Login Session Persistence Follow-Up)

**Agent/account:** Codex
**Branch:** codex/android-production-repair
**Starting commit:** `f1fa416`
**Ending state:** Session-persistence/native-notification fix ready to commit and push; GitHub Actions build still needed.

**User-reported APK result after `f1fa416`:**
- User entered credentials.
- IsotopeAI loading screen appeared for about one second.
- App returned to login/create-account UI.
- Notification permission prompt still did not appear.

**Supabase evidence:**
- Local `.env` contains `SUPABASE_PAT`.
- Management API project lookup succeeded for `vteqquoqvksshmfhuepu`; project status is `ACTIVE_HEALTHY`.
- Auth config lookup succeeded; email auth is enabled and signup is not disabled.
- Recent Auth logs show the credential login reached Supabase `/token` and returned HTTP 200.
- Conclusion: the reported loop is not bad credentials; it is local Android app session/bootstrap state after successful Supabase auth.

**Root cause found:**
- `auth-bridge.js` writes the login session into browser `localStorage`.
- The compiled app's Supabase client uses storage adapter `fr`, which read only the app's IndexedDB-backed storage wrapper `x`.
- On Android, `initializeAuth()` could therefore call `U.getSession()`, see no session, and reset the auth store back to logged-out UI after the splash.
- Notification bridge also returned early when `window.Notification` existed, so native permission/channel/helper setup could be skipped in Android WebView.

**Completed:**
- Patched `scripts/apply-android-patches.js` so the compiled Supabase auth storage adapter falls back to Android bridge `localStorage` session keys:
  - `isotope-auth-token`
  - `sb-vteqquoqvksshmfhuepu-auth-token`
  - `isotope-last-session-raw`
- Patched the storage adapter to mirror set/remove operations into `localStorage` on Android.
- Patched `android-bridge.js` so native notification setup is installed even if WebView exposes `window.Notification`.
- Added regression tests for both fixes.
- Rebuilt Android assets with `npm run build`; generated `www/` and `android/app/src/main/assets/public` contain the new storage fallback and notification bridge behavior.

**Commands run:**
- `node --check android-bridge.js`
- `node --check scripts/apply-android-patches.js`
- `npm test`
- `npm run build`
- `java -version`
- `npm run android:debug`
- `adb devices -l`
- Supabase Management API project/config/log queries with token redaction.

**Tests passed:**
- `npm test`: 11 tests passed.
- `npm run build`: `prepare-www`, required patching, `npx cap sync android`, and final idempotent patch pass all succeeded.
- Supabase Auth log inspection confirmed login success at Supabase.

**Blocked/Not verified:**
- Local Termux Gradle APK build is blocked by missing Android SDK. Java 17 was installed, but Gradle requires `ANDROID_HOME` or `android/local.properties`.
- ADB is installed but no attached/authorized device is visible.
- No emulator/physical APK install or Logcat evidence for this new fix yet.
- GitHub Actions build must run after pushing this commit to produce the next debug APK.

**Push/build result:**
- Commit pushed: `ce73a3f`
- GitHub Actions push run: `28415768373` — PASS
- GitHub Actions PR run: `28415767170` — PASS
- Artifact: `IsotopeAI-debug-35`
- Artifact id: `7969405842`
- Downloaded APK: `/data/data/com.termux/files/usr/tmp/isotope-apk-ce73a3f/artifact/app-debug.apk`

**Downloaded APK static inspection:**
- APK size: 54 MB.
- Packaged public assets: 266 files.
- Packaged JS chunks: 154.
- `index.html` loads `/android-bridge.js` first and `/auth-bridge.js?v=5` second.
- PWA manifest/mobile-web-app metadata is absent; `pwa-local.js` and `update-checker.js` are disabled comments.
- Extracted `assets/App-pJGjDiPw.js` contains the Android auth storage fallback for `isotope-auth-token`, `sb-vteqquoqvksshmfhuepu-auth-token`, and `isotope-last-session-raw`.
- Extracted `android-bridge.js` contains the native notification replacement path and helper globals.
- `aapt dump permissions` confirms Android notification, boot, wake lock, foreground service, exact alarm, network, biometric, and storage permissions.
- `adb devices -l` still shows no attached/authorized device.

**Next exact action:**
```bash
adb install -r /data/data/com.termux/files/usr/tmp/isotope-apk-ce73a3f/artifact/app-debug.apk
adb logcat -c
adb logcat
```

---

## 2026-06-30 — Stale post-login boot-state repair

**Agent/account:** Codex
**Branch:** codex/android-production-repair
**Starting commit:** `75b5b98`
**Ending state:** Stale boot-state fix implemented, locally tested, and locally built; commit/push/GitHub APK build still pending.

**User-reported APK result after `ce73a3f`:**
- Credentials were accepted visually enough to show the IsotopeAI loading screen briefly.
- The app then returned to login/create-account.
- User asked to inspect the code more deeply and treat the package as a native app, not a PWA.

**Root cause found:**
- `restore-and-launch.js` can publish `window.__ISO_BOOT_STATE__.state="readyLoggedOut"` during the initial no-session startup.
- After native login succeeds, the Auth patch hydrated the auth store and navigated, but it did not refresh `window.__ISO_BOOT_STATE__`.
- AppAccessGate then read the stale `readyLoggedOut` snapshot and redirected the now-authenticated app back to `/auth`.
- AppAccessGate's localStorage cleanup set also included `isotope-auth` and `isotope-auth-token`, which is unsafe for Android because those keys participate in bridge/session restore.

**Completed:**
- Patched `scripts/apply-android-patches.js` so Auth writes a fresh canonical `window.__ISO_BOOT_STATE__` from bootstrap before navigation.
- Patched Auth routing to use the new boot state: `readyDashboard` routes to `/dashboard`, `readyNeedsOnboarding` routes to `/onboarding`.
- Patched AppAccessGate so `readyLoggedOut` redirects to `/auth` only when `isAuthenticated` is false.
- Patched AppAccessGate cleanup so Android auth keys are not removed.
- Added regression coverage for stale boot-state routing and auth-key preservation.
- Fixed `scripts/agent-status.mjs` so it reports the actual ACTIVE task block instead of combining the first task ID with a later active task body.

**Commands run:**
- `node --check scripts/apply-android-patches.js`
- `node --check test/prepare-patches.test.mjs`
- `npm test`
- `npm run build`
- `rg` checks against generated `www/` and synced `android/app/src/main/assets/public`
- `adb devices -l`
- `node --check scripts/agent-status.mjs`
- `npm run agent:status`

**Tests passed:**
- `npm test`: 12 tests passed.
- `npm run build`: first patch pass applied 17 targets; second pass was idempotent with 0 required failures.
- Generated `www/assets/Auth-Cw0VAaCZ.js` and synced Android Auth chunk contain `window.__ISO_BOOT_STATE__`, `readyDashboard`, `readyNeedsOnboarding`, and `isotope:boot-state`.
- Generated and synced AppAccessGate chunk contains `Y === "readyLoggedOut" && !u` and no longer keeps `isotope-auth` / `isotope-auth-token` in the cleanup set.
- `npm run agent:status` now reports active task `ANDROID-006` with the stale boot-state commit/push action.

**Blocked/Not verified:**
- ADB is installed but still shows no attached/authorized device.
- Runtime login, dashboard route, onboarding route, notification prompt, and process-death behavior still require a new GitHub-built APK installed on a device/emulator.

**Push/build result:**
- Commit pushed: `737aa4e`
- GitHub Actions build status was not yet recorded in this section before the next user report.

---

## 2026-06-30 — Android-native wiring pass for cloud sync, notifications, PiP, logo, and shell behavior

**Agent/account:** Codex
**Branch:** codex/android-production-repair
**Starting commit:** `737aa4e`
**Ending state:** Android-native wiring implemented, tests/build passed locally through Capacitor sync, commit/push/GitHub APK build pending.

**User-reported APK result after latest GitHub build:**
- Login/app shell opens farther than before, but cloud sync and online status do not work.
- Settings/cloud sync says the user is offline or switching to local mode even when online.
- Notification permission is requested, but focus notification is not delivered.
- The app still feels like a PWA rather than a native Android app.
- Keyboard/back behavior is unstable.
- Old Android logo remains.
- Settings needs a proper Font Size section.
- Focus tab should use Android Picture-in-Picture if possible.
- User explicitly instructed to use GitHub Actions only for APK assembly and stop local Gradle builds.

**Root causes / code mismatches found:**
- Compiled `useOnlineStatus` used `navigator.onLine`; Android WebView can report stale/false offline state.
- Capacitor config referenced `ic_notification`, but no `ic_notification` drawable existed; bridge scheduled `ic_launcher`.
- Focus PiP depended only on browser `documentPictureInPicture`, unsupported in Android WebView.
- `MainActivity.java` was an empty `BridgeActivity` with no native app bridge.
- Manifest lacked PiP/resizable/keyboard resize activity attributes.
- Launcher foreground and density PNGs still used default Android assets.
- Settings had dyslexia font but no device text-scale control.

**Completed:**
- `android-bridge.js`:
  - Added Capacitor Network-backed `window.__isoIsOnline()`, `navigator.onLine` override, and `isotope:network` events.
  - Added native Focus PiP globals: `__isoAndroidPipSupported()` and `__isoEnterFocusPip()`.
  - Added Android back-button handling through Capacitor App plugin.
  - Applies persisted `isotope-font-scale` on startup.
  - Schedules notifications with `ic_notification`, `allowWhileIdle`, and cancels the previous focus-completion notification before rescheduling.
- `MainActivity.java`:
  - Installs `window.IsotopeAndroid` JavaScript interface.
  - Supports `isPipSupported`, `isInPipMode`, and `enterFocusPip`.
  - Dispatches `isotope:pip-mode` on PiP state changes.
- Android manifest/resources/config:
  - Enabled `supportsPictureInPicture`, `resizeableActivity`, and `windowSoftInputMode="adjustResize"`.
  - Added `drawable/ic_notification.xml`.
  - Replaced launcher vector/background and density PNGs with isotope-code logo assets.
  - Removed nonexistent LocalNotifications `sound: "beep"` setting.
- `scripts/apply-android-patches.js`:
  - Added required patch for `useOnlineStatus` to consume Android network state.
  - Added required Focus bundle patch to call native PiP on Android.
  - Added required Settings bundle patch for Font Size slider and persistence.
  - Added native resource contract verification.
- Tests:
  - Added bridge tests for Capacitor Network state, native notification icon/schedule contract, focus timer cancellation/reschedule, and PiP delegation.
  - Added patch-contract tests for online status, Focus PiP, Settings Font Size, and native resources.

**Commands run:**
- `pkg install -y imagemagick` to generate committed launcher PNG assets from isotope-code logo.
- `npm test`
- `npm run build`
- `adb devices -l`
- One local `npm run android:debug` attempt occurred before the user clarified to use GitHub Actions only; it failed because no Android SDK path exists. Do not repeat local Gradle for this checkpoint.

**Tests passed:**
- `npm test`: 18 tests passed.
- `npm run build`: `prepare-www`, required bundle patching, `npx cap sync android`, and final idempotent patch pass succeeded.
- First patch pass applied 23 targets; final pass applied 0, with 0 skipped and 0 required failures.
- `adb devices -l` still shows no attached/authorized device.

**Blocked/Not verified:**
- GitHub Actions APK build for this commit is not yet started until push.
- Current APK artifact is not downloaded/static-inspected yet.
- No device/emulator runtime evidence for cloud sync, online status, notifications, PiP, keyboard/back behavior, login, onboarding, backup restore, import/export, or responsive layouts.

**Next exact action:**
```bash
git add android-bridge.js capacitor.config.json scripts/apply-android-patches.js test android .agent
git commit -m "fix: wire Android native app behavior"
git push
```

**Push/build result:**
- Commit pushed: `868b889`
- GitHub Actions push run `28428151528`: FAILED at `Build Debug APK`
- GitHub Actions PR run `28428153462`: FAILED at `Build Debug APK`
- Earlier workflow steps passed: regression tests, source verification, prepare-www, first patch pass, Capacitor sync, final patch pass.
- Public log download returned HTTP 403 without GitHub auth; `.env` did not include `GITHUB_PAT` at the time.

**Immediate follow-up fix:**
- Local Java review showed `MainActivity` overrode `BridgeActivity.public void onStart()` as `protected void onStart()`, which is a Java compile error because an override cannot reduce method visibility.
- Fixed `MainActivity.onStart()` to `public`.
- Added regression assertion in `test/prepare-patches.test.mjs`.

**Next exact action after follow-up fix:**
```bash
git add android/app/src/main/java/in/isotopeai/app/MainActivity.java test/prepare-patches.test.mjs .agent
git commit -m "fix: restore MainActivity onStart access"
git push
```

---

## 2026-06-30 / 2026-07-01 IST — Android Supabase sync bridge repair after Floating Timer pass

**Agent/account:** Codex
**Branch:** codex/android-production-repair
**Starting commit:** `b927582`
**Ending state:** Floating Timer/emoji/LaTeX/native smoothness/Supabase sync bridge repair implemented locally; commit/push/GitHub APK build pending.

**User-reported runtime state:**
- App is still disconnected from Supabase beyond login/info.
- Cloud sync/import/export/backup decision logic appears broken.
- Supabase Storage old files are not deleted and are consuming free-tier space.
- Focus page intermittently fails to open and sometimes shows a full black screen.
- Dark-mode PNG logo looks wrong.

**Supabase investigation:**
- Read Supabase skill instructions and fetched Supabase changelog index.
- Relevant current risk: user-JWT Storage/RLS/Data API permissions and exposed table/RPC access. No new client endpoint breaking change found for the Storage/RPC calls used here.
- Source-side backup manager in `isotope-code/server/backup-manager.mjs` is the contract source for canonical backup writing, empty-over-rich blocking, restore selection, and cleanup.

**Root causes found in Android bridge:**
- Bridge intercepted `/__supa/functions/v1/*` but not absolute Supabase `${SUPA_URL}/functions/v1/*`, which Supabase JS client can call.
- `finish-session` forwarded raw compiled payload to `finish_session_sync`.
- Daily leaderboard called nonexistent `get_daily_leaderboard`.
- Group leaderboard and analytics forwarded `groupId` instead of SQL parameter names.
- `/__auth/import` returned a fake success acknowledgement.
- `/__auth/snapshot` only updated `user_settings.last_snapshot_at`.
- `/__auth/backup` wrote loose `userId/backup-*.json` files with no canonical latest/cloud snapshot and no cleanup.

**Implemented:**
- `android-bridge.js`:
  - Intercepts both `/__supa/functions/v1/*` and direct `${SUPA_URL}/functions/v1/*`.
  - Maps RPC payloads to exact SQL signatures.
  - Returns visible `ok:false` on RPC/storage failure.
  - Writes canonical `backups/latest.json`, `backups/history/*.json`, and `cloud-snapshot/latest.json`.
  - Archives imports under `imports/` and promotes canonical backup.
  - Returns restore-compatible `backup_json`, `selected_backup`, candidates, and counts.
  - Preserves `BLOCKED_EMPTY_OVERWRITE`.
  - Cleans only current-user stale `.json` archive files after verified upload/readback.
  - Adds cleanup preview/apply endpoints.
- Native Android:
  - Manifest and MainActivity now use hardware acceleration and WebView renderer priority policy.
  - Removed unused PiP RemoteAction icon XML files.
- Packaging:
  - KaTeX font asset repair added so offline LaTeX CSS font references resolve.
  - Android packaging prunes browser/PWA-only artifacts.

**Tests run:**
- `node --check android-bridge.js`
- `node --check android-floating-timer-bridge.js scripts/prepare-www.js scripts/apply-android-patches.js`
- `npm test`
- `npm run build`
- `git diff --check`
- `npm audit --omit=optional`
- `npm explain tar`
- `npm explain glob`

**Tests passed:**
- `npm test`: 33 tests passed.
- `npm run build`: `prepare-www`, required patching, `npx cap sync android`, and final idempotent patch pass succeeded.
- `git diff --check`: PASS.

**Audit result:**
- `npm audit --omit=optional` still reports dev-only `tar@6.2.1` and `glob@9.3.5` through `@capacitor/cli@6.2.1`.
- Non-force fix is unavailable; forced fix upgrades Capacitor CLI to 8.4.1 and is deferred.

**Not verified:**
- No local Gradle/APK build by user instruction.
- GitHub Actions APK build pending push.
- No runtime evidence yet for Supabase sync, community, import/export, Focus black screen, dark-mode logo, or Floating Timer on OnePlus Pad Go.

**Next exact action:**
```bash
npm run agent:handoff
git add .github/workflows/android.yml android-bridge.js android-floating-timer-bridge.js android-pip-bridge.js android/app android/build.gradle android/capacitor.settings.gradle android/gradle/wrapper/gradle-wrapper.properties capacitor.config.json package.json package-lock.json scripts/apply-android-patches.js scripts/prepare-www.js test .agent
git commit -m "fix(android): repair sync bridge and floating timer"
git push -u origin codex/android-production-repair
```

**Push/build result:**
- Commit created: `a99d575` (`fix(android): repair sync bridge and floating timer`)
- Branch pushed: `origin/codex/android-production-repair`
- GitHub Actions run: `28483486050`
- Run status: PASS
- Artifact: `IsotopeAI-debug-45`
- Artifact id: `7996534384`
- Artifact ZIP download from local shell: BLOCKED. `curl` to the artifact ZIP returned HTTP 401 because no `GITHUB_PAT`, `GH_TOKEN`, or authenticated `gh` is available.

---

## 2026-07-01 — Analytics black-screen + profile/sync follow-up checkpoint

**User-reported runtime state:**
- Analytics tab can black-screen when switching Monthly to view past sessions.
- Focus black-screen issue is still considered related/unverified on device.
- Cloud sync/profile/community work remains high priority, but latest runtime crash needed immediate stabilization.

**Implemented:**
- `android-bridge.js`
  - Added Android render recovery: `window.__isoAndroidForceRepaint`, Android resume/focus listeners, `isotope:android-resume`, Android stable-render CSS, and guarded blank-root reload.
  - Changed profile POST to read existing `profile_data`, deep-merge partial updates, upsert the merged row, and persist completed onboarding via verified `user_onboarding` upsert only when appropriate.
  - Preserved previous cloud sync, storage upload, and backup/import/cleanup bridge work.
- `MainActivity.java`
  - Added `public void onResume()` to reinstall bridge, resume WebView timers, invalidate the WebView, call `__isoAndroidForceRepaint`, and replay queued Floating Timer actions.
- `styles.xml`
  - Added stable app dark background and `postSplashScreenTheme`.
- `scripts/apply-android-patches.js`
  - Added content-based startup `index-*` selection for Sentry patching.
  - Suppresses Sentry/replay startup on Android.
  - Forces Android Analytics reduce-motion/performance behavior.
  - Disables AnalyticsPeriod chart animation on Android.
  - Caps Android Session Log rendered rows to 120 while preserving source data.
  - Clamps Monthly/Weekly next navigation at the current period.
  - Updates Dashboard feedback link to `https://isotopeaiapp.featurebase.app/`.
  - Bounds notification popover height with scrolling.
  - Changes Headway account to `7eeYY7`.
  - Suppresses browser-storage warning in Android.
- `test/android-bridge.test.mjs`
  - Added regression for deep-merged profile saves and exactly-once completed onboarding persistence.
- `test/prepare-patches.test.mjs`
  - Added regression coverage for Analytics render-stability patches, Sentry Android skip, bounded notifications, Headway account/link patches, and native WebView resume contract.
- `supabase/`
  - Migration files for Android storage buckets and community API grants remain staged for commit.

**Tests run:**
- `node --check android-bridge.js`
- `node --check scripts/apply-android-patches.js`
- `npm test`
- `npm run build`
- `git diff --check`

**Results:**
- `npm test`: PASS, 40 tests.
- `npm run build`: PASS through `prepare-www`, required patching, `npx cap sync android`, and final idempotent patch pass.
- `git diff --check`: PASS.

**Not verified:**
- No local Gradle/APK assembly by user instruction; use GitHub Actions only.
- Latest changes were committed and pushed as `8f5cb1f` with message `fix(android): stabilize analytics and cloud profile sync`.
- GitHub Actions APK build passed: run `28516820643`.
- Artifact downloaded with `GITHUB_PAT` from `.env`: `IsotopeAI-debug-46`, artifact id `8009649602`.
- Extracted `app-debug.apk` size: 56,024,656 bytes.
- Static APK inspection passed:
  - Real UI chunks present.
  - `android-bridge.js`, `android-floating-timer-bridge.js`, `backup-normalizer.js`, and `local-data-adapter.js` present.
  - Patch markers found: `__isoAndroidForceRepaint`, `persistCompletedOnboardingIfNeeded`, `__androidStable`, `h.slice(0,120)`, Headway `7eeYY7`, new Featurebase URL, Android Sentry skip.
  - `aapt dump badging` shows package `in.isotopeai.app`, compile/target SDK 35, and notification/overlay/foreground-service permissions.
- Temporary `.artifact-tmp/` files were deleted after inspection.
- `adb devices` showed no connected devices, so install/runtime testing could not run from this shell.
- OnePlus Pad Go runtime verification is pending for Analytics Monthly switching, Focus reopen, login persistence, cloud sync, storage cleanup, Floating Timer, and notifications.

---

## 2026-07-01 — Android community group action checkpoint

**User-reported runtime state:**
- Community create group button and invite/join flow still felt disconnected.
- Supabase invite RPC contract needed app-compatible group slug values.

**Implemented:**
- `scripts/apply-android-patches.js`
  - Removes stale `PremiumGate` wrappers around Community Hub, Group Discovery, and Group Details in the Android packaged bundles.
  - Forces community/group/leaderboard query hooks to execute on Android instead of disabling from stale local premium flags.
  - Adds a visible `Join with Code` button beside `Create Group` on Group Discovery.
  - Routes pasted invite codes or invite links to `/invite/{code}`.
  - Replaces the bad group category label/value `shit` with `Other`.
- `test/prepare-patches.test.mjs`
  - Adds patch-contract coverage for community unlocks, Join with Code, invite route fallback, group category repair, and removed premium wrappers.
- Supabase live migration from `supabase/repair_invite_rpc_slug_contract.sql` was already applied to project `vteqquoqvksshmfhuepu`.

**Tests run:**
- `node --check scripts/apply-android-patches.js`
- `node --test test/prepare-patches.test.mjs`
- `npm test`
- `npm run build`
- `git diff --check`

**Results:**
- `node --test test/prepare-patches.test.mjs`: PASS, 10 tests.
- `npm test`: PASS, 43 tests.
- `npm run build`: PASS through `prepare-www`, required patching, `npx cap sync android`, and final idempotent patch pass.
- `git diff --check`: PASS.

**Not verified:**
- GitHub Actions APK for this checkpoint is pending push.
- Device runtime checks for community create/join/invite remain pending.

---

## 2026-07-01 — Atomic group creation + notification panel checkpoint

**Implemented:**
- `scripts/apply-android-patches.js`
  - Patches Android `useGroups` bundle so create-group uses `rpc("create_community_group", ...)` instead of direct `groups.insert(...)` followed by a best-effort `group_members.insert(...)`.
  - Fetches the created group row after the RPC so the existing UI still receives the expected group object.
  - Tightens Android notification panel layout: compact header, non-overlapping title/button, bounded scrolling, and a `Scroll for more` hint when more than eight notifications exist.
- `test/prepare-patches.test.mjs`
  - Verifies Android group creation calls the RPC and no longer contains direct group insert or owner-insert fallback.
  - Verifies notification panel non-overlap classes and scroll hint are present.

**Tests run:**
- `node --check scripts/apply-android-patches.js`
- `node --test test/prepare-patches.test.mjs`
- `npm test`
- `npm run build`
- `git diff --check`

**Results:**
- `node --test test/prepare-patches.test.mjs`: PASS, 10 tests.
- `npm test`: PASS, 43 tests.
- `npm run build`: PASS; first patch pass applied 63 patches, final pass applied 0.
- `git diff --check`: PASS.

**Not verified:**
- GitHub Actions APK for this checkpoint is pending push.
- Runtime create group, invite generation, join code, and notification panel behavior still need device testing.
