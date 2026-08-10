# ISOTOPE PIP + SERVER — MEMORY / FINDINGS

> Update this file EVERY session with new findings. Persistent handoff memory.
> Covers: pipapk (Android overlay app), isotope-apk-ref (Capacitor app), server.mjs pip API, CI pipeline, ADB workflow.

---

## 0. LATEST STATE (2026-08-10, late — NATIVE TIMER CARD port to pipapk, in progress)

- **User directive (this session, final):** "only the timer part of isotope-apk, put it in pipapk — the whole
  pip-like thing built in there, but for android", wired "with API with isotopeai in localhost focus tab".
  → pipapk keeps its WebView `/focus` main UI (accepted earlier) but its floating **WebView window is
  REPLACED by a native floating timer card** = Kotlin port of isotope-apk's `FloatingTimerService.java`,
  driven entirely by the localhost pip API (state = the REAL /focus tab's relay).
- **Architecture (verified live + in code, see §4):** card state ← `GET /api/pip/state` (poll 1s, render
  only on seq change); SSE `GET /__pip/events` = change signal (carries ACTION ENVELOPES + heartbeats,
  NOT snapshots — page relays are not SSE-pushed); buttons → `POST /api/pip/action` → server broadcasts
  over SSE → the /focus page's `PIP_BRIDGE_JS` applies on the REAL store (`recordQuestionResult`,
  `undoLastQuestionResult`, `setTargetQuestions`) → page relays fresh snapshot → card re-renders.
  **The action loop is real: card buttons DO drive the actual timer/state.**
- **Written so far:** `pipapk/.../FloatingTimerService.kt` (full port: card UI identical to isotope-apk,
  drag/resize, FGS notification, `TimerState.fromJson` key-compatible with `/api/pip/state` snapshot,
  SSE thread + 1s seq-diff poll + action POSTs; ACTION_START/UPDATE/STOP + state_json action intents).
  Port bugs fixed: `Math.max(0L, long)` (Kotlin has no int/long mix), `(int)` casts → `.toInt()`,
  `Typeface.create(MONOSPACE, BOLD)` (not `MONOSPACE_BOLD`, minSdk 24), field/variable name collision.
- **Remaining:** PipActivity "Float" → start FloatingTimerService (drop FloatingOverlayService), delete
  `FloatingOverlayService.kt`, manifest = POST_NOTIFICATIONS + FGS + FGS_SPECIAL_USE perms + service
  decl (specialUse + PROPERTY_SPECIAL_USE_FGS_SUBTYPE), `res/drawable/ic_notification.xml` vector,
  then CI build → install on `in.isotopeai.pip` → smoke test card + actions on 127.0.0.1:34111.
- pipapk record: ac77b1a WebView rewrite + 0c9da43 fix committed; build `31383102710` green, artifact
  `9060637069` installed + tested (real /focus UI via pngscan: violet 2656/amber 1153 px; floating layer
  `mIsFloatingLayer=true`). That floating layer is the WebView-window design now being replaced.

## 1. Products & Purpose

| Piece | What it is | Where |
|---|---|---|
| `isotope-code` | The real product: React/Vite web app (focus timer), Node server.mjs | repo root, this repo |
| `pipapk/` | Android APK: shell showing the **REAL isotope web UI** in a WebView (like isotope-apk), with a draggable floating window over other apps | `pipapk/` |
| `isotope-apk-ref/` | **CURRENT TARGET** — Capacitor wrapper with NATIVE floating timer card + PiP (appId `in.isotopeai.app`) | `isotope-apk-ref/` |
| `~/.agents/skills/`, repo `isotope-apk-ref/.agents/skills/` | Skills: ui-ux-pro-max, android-kotlin, android-adb, github-actions-efficiency, nodejs-backend-patterns | both locations |

---

## 2. KEY FINDING — User wants the REAL UI (2026-08-10)

- User rejected the custom-drawn Kotlin card + 10ms polling mirror ("video streaming inside an app", "dumb thing", "bad ui").
- User directive: **"i want it like isotope-apk"** → the APK must show the actual isotope web UI, not a bespoke mirror card.
- **Current correct design (rewrite, commit pending)**: `PipActivity` = full-screen WebView → `http://127.0.0.1:3000/focus` (real compiled UI; state owner = server/browser). `FloatingOverlayService` = draggable overlay WebView window (same URL) with drag bar + close. Permission banner for display-over-other-apps + "Float" button. **No FGS, no polling, no notification, no PiP card, no boot receiver.**
- Deleted: `PipBridgeService.kt`, `PipState.kt`, `BootReceiver.kt`. Manifest pruned to INTERNET + SYSTEM_ALERT_WINDOW only. Gradle deps trimmed to just `androidx.core:core-ktx`.

## 3. The web app (state owner)

- Server: `bin/isotope restart` restarts (logs `~/.isotope/logs/server.log`), listens `127.0.0.1:3000`.
- Real UI served at `http://127.0.0.1:3000/focus` — bundle includes injected `PIP_BRIDGE_JS` (relays focus-store state to `POST /__pip/state`; single-line; guarded by `!raw.includes('__pipBridge')`; appended at END of bundle in `getPatchedFocusBundle` — both polyfill prepend and bridge append must keep output single-line for `node --check`).
- localStorage sync/bootstrap infra reconciles multiple storages (Cromite vs WebView are separate partitions). Server + browser = state owners; APK is a pure window.

## 3b. isotope-apk-ref (Capacitor app = CURRENT TARGET; "the isotopeapk one")

- Real Capacitor project in-repo: `capacitor.config.json` (appId `in.isotopeai.app`, name IsotopeAI,
  version v3.3.9, webDir `www`, androidScheme `https`, `webContentsDebuggingEnabled: true`,
  appendUserAgent `IsotopeAI-Android/3.3.9`), `android/` Gradle project, `scripts/prepare-www.js`.
- Build chain: `npm run prepare-www` (builds `www/` from repo-root `index.html` + `public/`,
  injects `android-bridge.js` + `android-floating-timer-bridge.js`) → `npm run apply-patches`
  → `npx cap sync android` → `cd android && ./gradlew assembleDebug --no-daemon` (script `android:debug`).
- Permission story: OVERLAY (SYSTEM_ALERT_WINDOW) + PiP + FGS specialUse + exact alarms all declared;
  Android 14/15 will ask for each at runtime — overlay/PiP need user grant on device.
- Read `isotope-apk-ref/AGENTS.md` + `.agent/` docs before touching its code (repo rule).
- **Deprecation risk to check:** vanilla JS classes (FlipTimer/TimerQuirk) with default
  timer-native-durations vs web app's TimerPipBridge semantics — verify parity of timers on
  first device test.

## 4. Server pip API (server.mjs, before 404 fence ~line 6570) — VERIFIED LIVE THIS SESSION (exact lines)

- `GET /api/pip/state` (6573): cached snapshot + `seq` (monotonic) + `pipClients` (SSE subscribers).
  **Default/empty cache shape** (6575-6583): `{ok,active:false,timerState:'idle',mode,activePhase:null,
  displayedSeconds:0,totalSeconds:0,completionAtMs:0,updatedAtMs,pomodoroCycle:1,
  pomodoroSessionsUntilLongBreak:4,questionsAttempted/Correct/Incorrect/Skipped:0,targetQuestions:0,
  undoAvailable:false,showQuestionControls:false,focusTypeLabel:'Focus',focusTypeIcon:'',theme:'dark',
  pipConnected,pipStateAt}` — **keys match TimerState.fromJson() 1:1** (no mapping needed).
- `POST /api/pip/action` (6588): JSON body `{type, value}`; allowlist `correct|incorrect|skipped|undo|
  setTarget|expand|close`; 400 on unknown type; `setTarget` requires numeric, clamped 0-9999;
  response `{...snapshot, applied:true, seq}`; **broadcasts `{type, value, ts, seq}` to ALL SSE clients**.
- `POST /__pip/state` (6615): page relay stores cache + `pipSeq += 1`. No SSE broadcast on snapshot.
- `GET /__pip/events` (6632): **SSE carries ONLY action envelopes `{type,value,ts,seq}` + `: ping`
  heartbeats — NEVER snapshots.** → native clients must (re)poll `/api/pip/state`; seq-diff renders.
- **THE ACTION LOOP IS REAL** — `PIP_BRIDGE_JS` (injected into the /focus bundle, line 4246) has
  `es.onmessage`: `correct|incorrect|skipped` → `s.recordQuestionResult(type)`; `undo` →
  `s.undoLastQuestionResult()`; `setTarget` → `s.setTargetQuestions(value)`. So: card POST → server SSE
  → page applies to REAL store → page relays new snapshot → cache → card re-renders. Buttons drive the
  ACTUAL timer, no mirror. Bridge relay payload (the `push()` fn) is the same key set as above.
- Live check this session: `curl /api/pip/state` → `{"active":true,"timerState":"running",...,
  "displayedSeconds":100,"totalSeconds":1500,"completionAtMs":99999999999999,...}`.

## 5. CI / build pipeline

- Workflow `.github/workflows/pip-apk.yml`: paths `pipapk/**`; checkout@v4; temurin 17; `gradle/actions/setup-gradle@v4`; `./gradlew :app:assembleDebug`; upload artifact. Repo is PUBLIC → no secrets needed. Already lean: path filter, `concurrency: pip-apk-${{ github.ref }}` cancel-in-progress, `timeout-minutes: 20`.
- **Polling**: `curl -H "Authorization: Bearer $GITHUB_PAT" .../actions/runs?per_page=1` (PAT stored in `.env` at repo root). Artifact download: `.../actions/artifacts/<ID>/zip` with `-L` (302) — **must write to `~/.cache/opencode/tmp/...`, NOT `/tmp` (does not exist in Termux!)**.
- **CI debug key changes EVERY build** (fresh runner, no keystore cache) → `adb install -r` fails with `INSTALL_FAILED_UPDATE_INCOMPATIBLE` → always `adb uninstall in.isotopeai.pip` before install.
- Stack: AGP 8.5.2, Kotlin 1.9.24, Gradle wrapper 8.7, JDK 17, compileSdk 35, minSdk 24.
- Remote races: automated `docs(screenshots)` commits land on main → push can be rejected → `git stash && git pull --rebase origin main && git stash pop` pattern.
- Last green run: `31371202541` (success), artifact `9056139608`, APK 2,234,950 B. Skills commit `7161d65` (CodeQL `31377721739`, CI `31372765985` green). WebView commit `ac77b1a`: **Build PiP APK `31382113320` FAILED (FLAG_KEEP_SCREEN_ON)**; CodeQL/CI/Release still ran green.

## 5b. GitHub Actions AUDIT (analyzed 2026-08-10 with github-actions-efficiency skill)

12 workflows: auto-label, ci, codeql, dependency-review, pages, pip-apk, regenerate-release, release, schema-lint, screenshots, stale, welcome.

**Waste sources (evidence from live runs):**
1. `ci.yml` (Lint & Health, matrix node 20+22) — NO path filter: runs on EVERY push incl. screenshots-bot commits and pipapk-only commits.
2. `codeql.yml` (most expensive job) — NO path filter: runs on every push/PR + weekly cron.
3. `release.yml` — fires on **every push to main** (not just tags): created/updated a Release for the pipapk-only commit ac77b1a; does `node --check` on 10 files + changelog extraction + release API each time.
4. `screenshots.yml` — triggers on `server.mjs` changes → produces the racing `docs(screenshots)` bot commits (the recurring push-race cause). Bot commits then re-trigger ci/codeql/release wastefully.

**Fixes to apply (top 3, guardrail-checked):**
1. ci.yml: `paths-ignore: [pipapk/**]` + job `if: github.actor != 'github-actions[bot]'` (skip re-linting bot screenshot commits). Keep matrix (no explicit removal commitment; node 20 deprecation warnings visible in every log).
2. codeql.yml: same `paths-ignore` + actor gate (pipapk-only commits never touch JS analysis targets — no validation hidden).
3. release.yml: `push` trigger gets `paths:` (package.json, CHANGELOG.md, server.mjs, public/**, scripts/**, docs/**, .github/workflows/release.yml, .github/workflows/screenshots.yml) — tags + workflow_dispatch unchanged.

**Validation note:** compile of the Kotlin fix + workflow gates is validated ONLY by the next CI run (no local JDK); the actor-gate behavior is standard GH Actions and low risk.

## 6. ADB workflow (Termux = on-device adb, no host)

- **Port changes often — asks user, e.g. 34111. Loopback `adb connect 127.0.0.1:<port>` always works.** Old: 10.191.181.183:34163 (dead), 10.171.170.148:45355 (dead).
- `adb -s 127.0.0.1:34111 install ~/isotope-pip.apk`, `adb -s ... shell am start -n in.isotopeai.pip/app.isotopeai.pip.PipActivity` (applicationId `in.isotopeai.pip`, component `app.isotopeai.pip`).
- Screen: 1720x2408 portrait, density override 306 (scale 1.9125) — BUT screencap often returns rotated 2408x1720 (landscape) — always read PNG header, don't assume orientation.
- **uiautomator dump fails "could not get idle state"** whenever the app animates continuously (Choreographer tickers) → use `screencap` + `~/.cache/opencode/tmp/pip-apk/new/pngscan.py` (pure-python PNG decoder + brand-color cluster finder) to locate buttons. This model cannot view images — never rely on Read for screenshots.
- Successful uninstall/install test: `u0_a612 2353 ... S in.isotopeai.pip` process confirmed; `mCurrentFocus` check via `dumpsys window`.

## 7. Kotlin/Compile gotchas (burned us in CI)

- `in` is a Kotlin keyword → package `app.isotopeai.pip`; applicationId `in.isotopeai.pip` (launch command uses applicationId prefix).
- `return` inside `Thread { }` lambda illegal → use `break` (moot now — no manual threads).
- `coerceAtMost(Int)` on Long receiver returns Long → add `.toInt()`.
- `FrameLayout.gravity` does not exist → `FrameLayout.LayoutParams(w, h, Gravity.CENTER)`.
- `ViewGroup.getChildAt()` returns `View!` → cast before typed use (we fixed via destructured Pair).
- Cleartext HTTP: manifest `usesCleartextTraffic` + `res/xml/network_security_config.xml` (cleartext allowed only for 127.0.0.1/localhost) — WebView JS/localStorage need `javaScriptEnabled`/`domStorageEnabled`.
- **Kotlin port-of-Java gotchas (hit in the FloatingTimerService port):** `Math.max(long,long)` — Kotlin has no int/long overload mixing → `Math.max(0L, x)`; Java `(int)` casts → `.toInt()` (`(screenW*0.36f).toInt()`); `Typeface.MONOSPACE_BOLD` is API 28+ → use `Typeface.create(Typeface.MONOSPACE, Typeface.BOLD)` for minSdk 24; local `val` shadowing a field of the same name silently nulls the field (rename the local); `Content-Type: application/json` body POST via `HttpURLConnection` (doOutput + outputStream.use) works fine for the local server.

## 8. UI/UX skill rules applied (ui-ux-pro-max "Exaggerated Minimalism" for dark tool)

- Ripple press feedback on ALL buttons (`RippleDrawable` wrapping pill, overlay `0x33FFFFFF`).
- Touch targets >= 44-48dp; haptics (`CONFIRM`, API 30+ guard) on timer actions; content descriptions on icon-only buttons.
- 8dp spacing rhythm; tabular timer numerals (`setFontFeatureSettings("tnum")` on O+).
- NO emojis as icons (use text glyphs only where they are data, e.g. counters).
- Remaining pattern: Minimal Single Column, dark `#0F172A`-class bg with violet brand `#8B5CF6`.

## 9. Environment facts

- No JDK/SDK on device → builds ONLY via GitHub Actions; Termux has node/npm/npx (skills CLI 1.5.22), adb, python3 (no PIL — use pngscan.py), bash, curl.
- Server runs in Termux; browser (Cromite) on same phone hits `127.0.0.1:3000/focus`.
- `session-ses_*.md` files are auto-generated session artifacts — do NOT commit.
- Repo branches: work only on `main`. Read `isotope-apk-ref/AGENTS.md` + `.agent/` docs before touching isotope-apk-ref code.