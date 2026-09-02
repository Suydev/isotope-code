# PiP APK for Android — original research plan (SUPERSEDED)

> **Status: BUILT. This document is the plan, not the build.**
>
> It opened with "RESEARCH ONLY. Nothing built." for weeks after the thing was
> built, which is worse than no document: a reader takes it as current and plans
> against decisions that were already overtaken.
>
> **For what actually ships, read `docs/android-apk.html`.** What exists now:
>
> | | |
> |---|---|
> | `pipapk/` | real Gradle project — 5 Kotlin files, ~1,900 lines, `applicationId in.isotopeai.pip`, minSdk 24 / targetSdk 35 |
> | `.github/workflows/pip-apk.yml` | builds and uploads `isotope-pip-debug` (debug, **unsigned**) |
> | `/api/pip/state`, `/api/pip/action` | implemented in `server.mjs` (§5 below called them "NOT yet implemented") |
> | Target | `http://127.0.0.1:3000` — same device as the server, only |
>
> **Three specifics in this plan are now wrong.** Corrected here rather than edited
> into the text below, so the original reasoning stays readable:
>
> 1. **"~750 ms poll"** (§1, §4a, §10) — obsolete, not merely a missed target. Two
>    loops exist and neither is 750 ms: `PipActivity.AUTO_POLL_MS = 5000` detects a
>    newly started session, and `FloatingTimerService.pollInterval()` is 1 s running
>    / 3 s idle. The countdown does not depend on either — `TimerState`
>    `displaySecondsNow()` derives it from `completionAtMs` on a 40 ms tick, so it is
>    *correct* between polls, not just smooth. A server saying "312 seconds left" is
>    stale the moment it is sent and the client cannot tell how stale; a completion
>    timestamp is still true whenever it arrives.
> 2. **§4 "Decision: Option A"** — the WebView blocker ("buttons inside system-PiP
>    are not clickable") was **routed around, not solved**. `isotope-apk` ships a
>    native `FloatingTimerService` overlay built from real Java views, genuinely
>    tappable, covering all 17 elements of the §4b contract. System PiP is the
>    fallback; the overlay is primary — the reverse of what this document concludes.
> 3. **§5 "NOT yet implemented"** — both endpoints exist, and the browser-side relay
>    is injected as `PIP_BRIDGE_JS` at serve time rather than as a separate
>    `pip-bridge.js` file.
>
> Two open defects in the shipped build, neither of them in this plan:
>
> - `network_security_config.xml` permits cleartext for **all** hosts, not just
>   loopback, so a hostile DNS answer gets a plaintext channel. §8 below specifies
>   the correct `<domain-config>` scoped to `127.0.0.1`; the build does not use it.
> - Four of thirteen manifest permissions are unused by this build —
>   `USE_BIOMETRIC`, `USE_FINGERPRINT`, `READ/WRITE_EXTERNAL_STORAGE` — inherited
>   from the reference app. The install prompt asks for fingerprint access for a
>   timer.

---

## Original plan follows, unedited

This document plans a standalone Android APK
("pipapk") that talks to the isotope app through its **localhost API** and renders the
app's Picture-in-Picture (PiP) interface as a real Android PiP window.

Reference project: `isotope-apk-ref/` (Capacitor APK) — used for native patterns.
The isotope-apk-ref approach bundles the whole app **inbuilt** (www/ inside the APK).
The user explicitly wants the opposite: a thin client on a **localhost API** to the PiP
interface of the app, with all permissions (display over other apps, PiP, etc.).

---

## 1. Goal

- Small Android app whose UI is the focus-timer PiP card.
- Data source: the isotope server already running locally on this Termux device at
  `http://127.0.0.1:3000` (server.mjs, start via `bash bin/isotope restart`).
- Poll the server for timer state (~750ms, per agents/AGENTS.md workstream #3 plan),
  render it in a real system PiP window, POST user actions (correct/incorrect/skip/
  undo/target) back to the server which injects them into the running app.
- Build via GitHub Actions — no Android SDK fits in Termux (DEC-008 pattern).

## 2. The PiP interface we mirror (server-side, server.mjs ~4004)

`PIP_POLYFILL` (prepended to `Focus-B4gLsWoP.js` by `getPatchedFocusBundle()`):

- Only viable Android path = `canvas.captureStream()` → hidden `<video>` →
  `video.requestPictureInPicture()`. `documentPictureInPicture` is absent on Android
  (verified live on Cromite: `documentPip:false`, `pipRequest:"SUCCESS", inPip:true`).
- Feature-detect only — NO user-agent guard (device UA reports as desktop
  `Mozilla/5.0 (X11; Linux x86_64)`).
- Canvas is 340x390 and MUST stay in the DOM (`document.body.appendChild`), else GC
  (`canvases:0`).
- Renders the timer overlay onto the canvas: mode, time, status dot, question stats.
- Dirty-check throttle: `lastSig` = `innerHTML.length + '|' + textContent.length`;
  redraw on rAF + 500ms interval.
- `layoutChild()` wraps every child layout in try/catch; errors recorded in
  `window.__pipTrace` (capped 60) as `CHILD-THROW:` / `THROW:` entries.
- PiP DOM contract (harness `__openTestPip`): ids `pip-root`, `pip-correct`,
  `pip-incorrect`, `pip-skipped`, `pip-undo`, `pip-target`; texts `✓ N` / `✕ N` /
  `Skip N` / `Undo` / `Target`; grid `repeat(3,1fr)`; status dot 6px; time
  `3.1rem/800`; separator `rgba(255,255,255,0.12)`.
- Known live bug (open): last pixel probe showed text drawn but green/red/amber
  buttons 0px — re-verification pending on device (see memory.md §5, agents/AGENTS.md).

The APK does not re-implement this HTMLPolyfill; it is a NATIVE peer that consumes the
same state (see §4 Option A).

## 3. Why NOT the isotope-apk-ref "inbuilt" approach

| Aspect | isotope-apk-ref (reference) | pipapk (this plan) |
|---|---|---|
| Web assets | `prepare-www.js` copies isotope-code `public/` → `www/` compiled INTO the APK (~80MB+) | None bundled — client pulls state over localhost HTTP |
| Server role | none; `android-bridge.js` replaces every `/__auth/*`, `/__supa/*`, `/api/*` endpoint | isotope server (127.0.0.1:3000) IS the source of truth |
| Updates | new APK release each time | server-side change only |
| Storage | all offline IndexedDB/Supabase layers duplicated in APK | reused from the running app |
| SW/PWA | patched to no-op in `prepare-www.js` (DEC-004) | N/A (no shell) |
| PiP | dec-019: native FloatingTimerService overlay (system PiP only a reduced fallback) | system PiP window as PRIMARY, overlay optional |

## 4. Architecture options

### Option A — Native PiP companion (RECOMMENDED)
No WebView at all. Kotlin `PipActivity`:

- `enterPictureInPictureMode(PictureInPictureParams)` with aspect 340:390 (matches the
  polyfill canvas).
- Poll loop (Handler/coroutine, every ~750ms) → `GET http://127.0.0.1:3000/api/pip/state`.
- Render native views (TextView/Button stack, or Canvas) inside the PiP content view.
- Buttons POST `{type}` to `http://127.0.0.1:3000/api/pip/action`; server forwards into
  the focus store running in the browser app.
- Matches exactly the existing plan: "Kotlin Activity with real
  `enterPictureInPictureMode()`, poll loop to localhost API every ~750ms, POST-back"
  (agents/AGENTS.md session context, workstream #3).

### Option B — WebView shell to localhost (fallback / full-UI client)
- Capacitor/WebView loads `http://127.0.0.1:3000/focus` (server mode; `capacitor.config.json`
  `server.url`), no `prepare-www` bundling.
- BLOCKER discovered: Android WebView exposes NO `video.requestPictureInPicture()` and no
  `documentPictureInPicture` → the PIP_POLYFILL cannot run inside a WebView. System PiP for
  the whole Activity would show the whole web page, not the timer card, and buttons inside
  system-PiP are not clickable.
- Only makes sense if we later want the full app UI without bundling; not for the PiP card.

**Decision: Option A.** (B is surveyed only; do not build it for PiP.)

## 4b. UI requirement: same buttons as the isotope-apk interface (ALL of them)

Exhaustive inventory compiled from BOTH sources so nothing is skipped:
1. the web PiP overlay `innerHTML` in `Focus-B4gLsWoP.js` (the `oe()` PiP renderer:
   elements `pip-root` / `pip-correct` / `pip-incorrect` / `pip-skipped` / `pip-undo` /
   `pip-target`, with `questionActionHistory` driving undo), and
2. the native card `FloatingTimerService.java:224-549` (`buildOverlayView` /
   `renderAll` / `renderDynamicFields`).

The APK renders EVERY element below in its PiP window.

### Full element contract (nothing omitted)

| # | Element | Web PiP overlay (Focus bundle `oe()`) | Native FloatingTimerService | Render rule |
|---|---|---|---|---|
| 1 | Mode heading | "POMODORO" / "STOPWATCH", 0.875rem/600, uppercase, letter-spacing 0.05em, opacity 0.7 | 11sp/800 uppercase `Stopwatch` or `Pomodoro  N / M` (cycle/countdown) | always |
| 2 | Timer time | 3.1rem/800, line-height 1, ls −0.025em; format `M:SS`, `H:MM:SS` (pad 2), `D H:MM:SS`, from `timeLeft` (pomodoro) or `stopwatchTime` | 56sp monospace bold, ls −0.02 | always |
| 3 | Status dot | 6px circle; colors: running `#22c55e`(dark)/`#16a34a`(light), paused `#f59e0b`/`#d97706`, break `#3b82f6`/`#2563eb`, idle `#6b7280`; **pulse 2s animation only while running** | 10sp `● ` emerald-500/amber-500/sky-400/zinc-500 | always |
| 4 | Status label | "Focusing..." / "Paused" / "Break" / "Idle", 0.875rem, opacity 0.8 | same words, 11sp uppercase, tracking 0.05 | always |
| 5 | Focus chip | `${focusTypeIcon} ${focusTypeLabel}`, 0.78rem/700, opacity 0.66 | pill 999dp radius — brand/10 bg + 1dp brand stroke, icon + label, brand-300/700 text | only when question section visible |
| 6 | Separator | `border-top: 1px rgba(255,255,255,0.12)` dark / `rgba(24,24,27,0.12)` light, padding-top 14px | — | only when question section visible |
| 7 | Attempted counter | `questionsAttempted` at **1.55rem/900** + ` / ${targetQuestions}` sub-span at 0.9rem/opacity 0.55 | 26sp bold `attempted / target` | question section |
| 8 | Target button | pill: 1px border white/16 (dark) or rgba(255,255,255,0.8) white bg (light), 999px radius, 0.72rem/800, prompt() dialog, clamp 0-9999 (`setTargetQuestions`) | "Target" pill → AlertDialog numeric input + hidden quick editor **−5 / value / +5 / 0** pills | question section |
| 9 | ✓ Correct counter button | `✓ ${questionsCorrect}`, bg `#059669`, white text | `✓  N` emerald-600 `#059669`, 44dp h, 16dp radius | question section |
| 10 | ✕ Incorrect counter button | `✕ ${questionsIncorrect}`, bg `#e11d48` | `✕  N` rose-600 `#E11D48` | question section |
| 11 | Skip counter button | `Skip ${questionsSkipped}`, bg `#d97706` | `↷  N` amber-600 `#D97706` | question section |
| 12 | Undo last button | `Undo last`: transparent bg, 1px border white/14, 999px radius, 0.72rem/800; **disabled + cursor not-allowed + opacity 0.45 when `questionActionHistory.length === 0`** | `Undo last` 36dp full-width pill; `setEnabled(undoAvailable)` + alpha 0.4 | question section |
| 13 | Header expand ↗ | — (browser PiP has system controls) | brand/10 bg, `BRAND_500` text, 10dp radius → action `expand` + reopen app | native (PiP: system close only; keep expand for overlay mode) |
| 14 | Header close × | — | subtle zinc bg → action `close` | native |
| 15 | Progress strip | — | 4dp full-width `#8B5CF6` running / `#38BDF8` break, fill `ScaleX(ratio)`; pomodoro ratio = remaining/total, stopwatch = rolling 25-min cycle | native |
| 16 | Shared button base | `border:0; border-radius:14px; padding:10px 12px; white; font-size:0.78rem; font-weight:800; cursor:pointer; min-width:72px` | `GradientDrawable`, 16dp radius (`rounded-2xl`); 44dp height; 6dp gaps; equal weight (1f) | buttons #9/#10/#11 |
| 17 | Card background | `#000000` dark / `#f4f4f5` light (root), white/black text | zinc-950 `#0E0E11` dark / white, 24dp corners, 1dp border (white/10 dark, zinc/12 light) | always |

### Store state used by the counters (from the bundle `oe()` destructure)

`mode, timeLeft, stopwatchTime, timerState, sessionType, taskType, questionsAttempted,
questionsCorrect, questionsIncorrect, questionsSkipped, targetQuestions,
questionActionHistory, recordQuestionResult, undoLastQuestionResult,
setTargetQuestions` + `profile.focusSettings.showQuestionTrackingInTimerPip ?? true` and
`focusTypes` (focus type resolved `${icon} ${label}` for the session).

### Gating rule (must be honored)

The whole question-counter section (elements #5-#12) is rendered ONLY when
`showQuestionTrackingInTimerPip !== false` **AND** a focus type resolves for
`(sessionType, taskType)` (`mt = hs && !!Ce` in the bundle). When hidden, the PiP shows
just heading, time, status dot/label. The pip-bridge must compute the same `mt` flag and
ship it as `showQuestionControls` in the state so the APK hides/shows the section.

### Action verbs (all 7, exact types)

`correct` / `incorrect` / `skipped` (→ `recordQuestionResult`),
`undo` (→ `undoLastQuestionResult`, only if history non-empty),
`setTarget` + `value` (→ `setTargetQuestions`, clamp 0-9999),
`expand`, `close`. Same allowlist as `MainActivity.isAllowedFloatingTimerAction`.

## 5. New localhost API contract (to be added to server.mjs — NOT yet implemented)

Note: today the server has NO `/api/pip/*` routes. `server.mjs:8943` returns a JSON 404
for unknown `/api/*` paths. These endpoints are the only new server work required.

- `GET /api/pip/state` → 200 JSON (mirror of `normalizeTimerState` output in
  `android-floating-timer-bridge.js:159-200`):
  ```
  { ok:true, active:bool, timerState:"idle|running|paused|break", mode:"pomodoro|stopwatch",
    activePhase:"focus|break|null", displayedSeconds, totalSeconds, completionAtMs, updatedAtMs,
    pomodoroCycle, pomodoroSessionsUntilLongBreak,
    questionsAttempted, questionsCorrect, questionsIncorrect, questionsSkipped, targetQuestions,
    undoAvailable, undoCount, showQuestionControls, focusTypeId, focusTypeLabel, focusTypeIcon, theme, ts,
    seq, pipClients }
  ```
  (Every field the §4b card renders: attempts/target, all three counter buttons,
  undo flag (`undoCount` = `questionActionHistory.length`, drives #12 disabled state),
  `showQuestionControls` computed with the bundle's `mt = hs && !!Ce` gating rule,
  pomodoro cycle heading, focus chip, theme. `seq` is a monotonic counter bumped on
  every relay push — the APK uses it to detect staleness; `pipClients` is the live
  SSE subscriber count.)
- `POST /api/pip/action` body `{type, value?}`; type allowlist EXACTLY as
  `MainActivity.isAllowedFloatingTimerAction` (`correct|incorrect|skipped|undo|
  setTarget|expand|close`) → validated → 400 on unknown type or missing
  `setTarget` value, `setTarget` clamped to 0-9999 → 200 `{...snapshot, applied:true, seq}`
  (the snapshot republished to the APK's poller means the card re-renders instantly
  without waiting for the next 10ms poll).
- Owners: single local user, loopback only, no auth; throttle/rate-limit the state
  endpoint (~5/sec) so the poll loop cannot hammer.
- JS wiring (new file, mirror of `android-floating-timer-bridge.js` over HTTP):
  a `pip-bridge.js` exposing `window.__ISO_PIP_HTTP__ = {sendState, handleAction}`
  subscribed to the Focus store (same controller pattern: `getState/subscribe/dispatch`);
  injected at serve time like `PIP_POLYFILL` is preprended in `getPatchedFocusBundle`
  (server.mjs:4242-4253). The browser app (Cromite → 127.0.0.1:3000/focus) becomes the
  state owner; the APK is a pure remote view/remote control.

## 7. Kotlin scaffold (reference files in isotope-apk-ref/android/)

| New piece | Reference | Notes |
|---|---|---|
| `PipActivity.kt` | `MainActivity.java:305-341` | `supportsPictureInPicture()` (O+ & FEATURE_PICTURE_IN_PICTURE), `safeAspectRatio()` (clamp 1/2.39..2.39), `enterPictureInPictureMode()`, seamless resize off on S+ |
| PiP state callback | `MainActivity.java:441-446` | `onPictureInPictureModeChanged` — pause poll while minimized to save battery |
| Action queue + replay | `MainActivity.java:352-439` | SharedPreferences JSON queue, replay until JS confirms; APK replays until HTTP 200 `{ok}` |
| Overlay cards (bonus "display over other apps" mode) | `FloatingTimerService.java` (870 lines), manifest `FloatingTimerService` block | TYPE_APPLICATION_OVERLAY + foreground-service notification; permission flow `hasOverlayPermission/requestOverlayPermission` `MainActivity.java:248-262` |
| State normalization | `android-floating-timer-bridge.js:159-200` (`normalizeTimerState`) | copy the same clamp/validation rules into the Kotlin parser so both sides agree |
| HTTP | — no new dependency needed | `HttpURLConnection` or OkHttp if we add one dep; keep zero-dep if possible |

Gradle: same toolchain as reference (`android/variables.gradle`, minSdk 24 / compileSdk 35
per ARCHITECTURE.md build provenance; Capacitor core not needed for Option A).

## 8. Permissions (all from reference AndroidManifest.xml)

```
INTERNET
SYSTEM_ALERT_WINDOW                        ← "display over other apps" (user explicitly wants this)
POST_NOTIFICATIONS
FOREGROUND_SERVICE
FOREGROUND_SERVICE_SPECIAL_USE
WAKE_LOCK
SCHEDULE_EXACT_ALARM
VIBRATE
RECEIVE_BOOT_COMPLETED
```

Activity flags (reference `MainActivity` block):
`supportsPictureInPicture="true"`, `resizeableActivity="true"`,
`configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"`,
`launchMode="singleTask"`, `hardwareAccelerated="true"`.

Cleartext: reference uses `networkSecurityConfig` + `usesCleartextTraffic="false"`.
The pipapk needs `http://127.0.0.1` (loopback) allowed cleartext:
`android/app/src/main/res/xml/network_security_config.xml` must include
`<domain-config cleartextTrafficPermitted="true"><domain>127.0.0.1</domain></domain-config>`
(loopback HTTP is required on this Android/WebView — mixed-content rule).

## 9. Build & install pipeline

- `isotope-code` has NO android CI today; `isotope-apk-ref` vendors no `.github/`.
  Plan: `.github/workflows/pip-apk.yml` in the pipapk repo following DEC-008:
  checkout → `actions/setup-java@v4` (JDK 17) → `android-actions/setup-android@v3`
  → `./gradlew assembleDebug` (or `bundleRelease` with `ANDROID_KEYSTORE_BASE64`
  secrets for release) → `actions/upload-artifact` APK.
- Device install: `adb -s <serial> install -r app-debug.apk` | serial is the ADB
  device on this machine (last used `10.171.170.148:45355` for the isotope tests).
- PiP debugging: `adb shell dumpsys window | grep mCurrentFocus`, screencap per
  Android ADB skill.

## 10. Verification checklist (when implementing)

1. Server up → `curl http://127.0.0.1:3000/api/pip/state` returns `{ok:false,active:false}`
   when no session.
2. Cromite → `/focus` → start timer → PiP button (or harness) → state endpoint flips
   `active:true`; `displayedSeconds` ticks.
3. APK install → launch → enters PiP automatically on active state; aspect ~340:390.
4. Tap Correct/Incorrect/Skip/Undo/Target in the PiP window → POST → counts change in
   the app UI (and in subsequent state polls).
5. Overlay mode: grant "Display over other apps" → floating card works with
   foreground-service notification (FloatingTimerService analog).
6. Poll cadence 750ms observed; no server log spam; degraded gracefully when server
   down (last-known state + "server offline" badge).
7. `__pipTrace` / server-log checks after any bundle edit (`node --check` the served
   bundle — literal `\n` inside `split('\\n')` broke the served Focus bundle before).

## 11. Research notes / gotchas (do not regress)

- WebView cannot run the PiP video polyfill → native PiP is the only Android path for
  the timer card (verified in DEC-019 history).
- Never UA-gate anything; feature-detect only (desktop UA on Android build).
- `canvas` must stay in DOM or GC kills the stream (`canvases:0`).
- Action verbs must exactly match the allowlist or the store silently ignores them.
- Existing `FloatingTimerService` action flow returns `ok:false + permissionRequired:true`
  when overlay permission missing — replicate that UX in the APK settings screen.
- Server `/api/*` 404 fence (server.mjs:8943) returns JSON for unknown paths — new
  endpoints must be registered BEFORE that fence.
- SW cache staleness: after server bundle changes, purge device caches
  (`isotope-local-shell-3.3.9-<sha>` / `isotope-local-runtime-<sha>`) before verifying.

## 12. Open questions for the owner

- Repo home for the new APK: new repo, or a `pipapk/` folder inside `isotope-apk-ref`?
- Keep FloatingTimerService overlay mode in the same APK (recommended) or PiP only?
- Package name / app label (e.g. `in.isotopeai.pip`), and debug-only first (no signing
  keys on this device)?