# ISOTOPE PIP + SERVER — MEMORY / FINDINGS

> Update this file EVERY session with new findings. Persistent handoff memory.
> Covers: pipapk (Android overlay app), server.mjs pip API, CI pipeline, ADB workflow.

---

## 1. Products & Purpose

| Piece | What it is | Where |
|---|---|---|
| `isotope-code` | The real product: React/Vite web app (focus timer), Node server.mjs | repo root, this repo |
| `pipapk/` | Android APK: shell showing the **REAL isotope web UI** in a WebView (like isotope-apk), with a draggable floating window over other apps | `pipapk/` |
| `isotope-apk-ref/` | Capacitor wrapper reference (wraps compiled `public/` assets) | `isotope-apk-ref/` |
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

## 4. Server pip API (server.mjs, before 404 fence ~line 6570)

- `GET /api/pip/state` → cached snapshot + `seq` (monotonic, bumped per relay push) + `pipClients` (SSE subscriber count). `Cache-Control: no-store`.
- `POST /api/pip/action` → allowlist `correct|incorrect|skipped|undo|setTarget|expand|close`; 400 on unknown type; `setTarget` requires numeric value, clamped 0-9999; 200 → `{...snapshot, applied:true, seq}`.
- `POST /__pip/state` (browser relay) → stores cache, bumps `pipSeq`.
- `GET /__pip/events` → SSE fan-out, 15s heartbeat `: ping`, `X-Accel-Buffering: no`.
- Verified live with curl; server restart PID changes each time (record new PID in logs).

## 5. CI / build pipeline

- Workflow `.github/workflows/pip-apk.yml`: paths `pipapk/**`; checkout@v4; temurin 17; `gradle/actions/setup-gradle@v4`; `./gradlew :app:assembleDebug`; upload artifact. Repo is PUBLIC → no secrets needed.
- **Polling**: `curl -H "Authorization: Bearer $GITHUB_PAT" .../actions/runs?per_page=1` (PAT stored in `.env` at repo root). Artifact download: `.../actions/artifacts/<ID>/zip` with `-L` (302) — **must write to `~/.cache/opencode/tmp/...`, NOT `/tmp` (does not exist in Termux!)**.
- **CI debug key changes EVERY build** (fresh runner, no keystore cache) → `adb install -r` fails with `INSTALL_FAILED_UPDATE_INCOMPATIBLE` → always `adb uninstall in.isotopeai.pip` before install.
- Stack: AGP 8.5.2, Kotlin 1.9.24, Gradle wrapper 8.7, JDK 17, compileSdk 35, minSdk 24.
- Remote races: automated `docs(screenshots)` commits land on main → push can be rejected → `git stash && git pull --rebase origin main && git stash pop` pattern.
- Last green run: `31371202541` (success), artifact `9056139608`, APK 2,234,950 B. Skills commit `7161d65` also green (CodeQL + Lint&Health green on `31377721739`/`31372765985`).

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