# isotope-apk

Native Android wrapper for **IsotopeAI** — an AI-powered study planner, focus
timer, and analytics app for students preparing for JEE, NEET, CUET, boards,
and other competitive exams.

This repo does **not** contain the app's UI or business logic. It packages
the web app published at [isotope-code](https://github.com/Suydev/isotope-code)
into a [Capacitor](https://capacitorjs.com/) Android shell, adds a thin native
bridge for auth/session/storage, and ships it as an installable APK.

> **Source of truth:** all UI, routes, features, and styling live in
> `isotope-code`. This repo must never re-implement or diverge from that UI —
> it only wraps it for native distribution. See [Architecture](#architecture)
> for exactly how the two repos relate.

---

## What this app does (for users)

IsotopeAI helps students:
- Plan study sessions with an AI-assisted planner
- Run a focus/Pomodoro timer (with an Android floating/PiP overlay)
- Track progress and streaks with analytics and a leaderboard
- Join study groups and communities, with invite links and join codes
- Get notified about session reminders, group activity, and app updates
- Keep working offline, with data syncing back once reconnected

## Architecture

```
isotope-code (public repo, READ-ONLY reference)
  ├─ index.html            ← Vite entry point (repo root, not public/)
  └─ public/                ← built JS/CSS bundles, fonts, icons, sounds, sync/
        │
        │  fetched fresh on every CI build (pinned to a specific commit —
        │  see ISOTOPE_CODE_REF in .github/workflows/android.yml)
        ▼
isotope-apk (this repo)
  ├─ android-bridge.js               ← native bridge injected as first <head> script
  ├─ android-floating-timer-bridge.js← floating/PiP focus timer overlay bridge
  ├─ scripts/prepare-www.js          ← copies isotope-code → www/, injects bridge,
  │                                    disables PWA-only features, adds boot splash
  ├─ scripts/apply-android-patches.js← patches minified JS bundles in www/assets/
  │                                    (Android-safe UI tweaks, native modal hooks,
  │                                    Supabase config injection, storage fixes)
  ├─ www/                            ← BUILD OUTPUT (git-ignored) — never edit by hand
  └─ android/                        ← native Capacitor Android project (Gradle)
```

### Build pipeline (also see `.github/workflows/android.yml`)

1. **Checkout** both `isotope-apk` (this repo) and `isotope-code` (pinned ref)
2. **`node scripts/prepare-www.js`** — copies `isotope-code/public/*` into
   `www/`, copies the root `index.html`, injects `android-bridge.js` as the
   very first script in `<head>`, disables browser/PWA-only files that make no
   sense inside a native shell (service worker, web manifest, update checker),
   and injects a persistent inline boot splash screen (see
   [Loading screen](#loading-screen-fix) below).
3. **`node scripts/apply-android-patches.js`** — applies small, targeted string
   patches to the built JS bundles in `www/assets/` (e.g. routes `window.prompt`
   based "join with code" flows to a native modal, injects Supabase runtime
   config, fixes points/leaderboard NaN edge cases) and to native Android XML
   (permissions, manifest entries).
4. **`npx cap sync android`** — Capacitor copies `www/` into the native project.
5. **`apply-android-patches.js` runs again** — `cap sync` can overwrite some
   native files, so patches are re-applied after sync to guarantee they stick.
6. **Gradle build** — `assembleDebug` (every push) or `bundleRelease` (manual
   dispatch) produces the installable artifact.

### Why patch instead of fork the UI?

`isotope-code` is the single source of truth for the product. Rather than
maintaining a second copy of the UI (which would drift over time), this repo
treats its built output as an opaque, versioned input and applies a small,
auditable set of string-level patches for the handful of things that must
differ on native Android (e.g. `window.prompt()` doesn't render inside a
WebView the way it does in a desktop browser). Every patch is intentionally
narrow and documented in `scripts/apply-android-patches.js`.

### Loading screen fix

`isotope-code`'s `index.html` ships `<div id="root"></div>` with no inline
splash markup — in a browser tab this is invisible because the browser's own
loading UI (spinner/progress bar, previous page still visible) covers the gap.
Inside a native Android WebView there is no such chrome, so users would see a
blank/unstyled white screen while the WebView boots, the auth/session bridge
initializes, and the React bundle parses.

`prepare-www.js` injects a small, dependency-free inline splash (pure HTML +
CSS, no external requests) directly after `<head>`, so it paints before any
script — including the auth bridge — executes. It is removed automatically via
a `MutationObserver` on `#root` the moment React paints real content, with a
12-second hard timeout fallback so it can never get stuck on screen. Its
background color (`#0a0a0a`) matches the native Capacitor `SplashScreen`
plugin's background, so the handoff from native splash → HTML splash → app is
visually seamless.

### Notification panel positioning

The notification bell panel in `DashboardHeader` uses `absolute right-0
top-full` positioning in `isotope-code` — its **right** edge is pinned to the
bell button, so the panel expands **left**, and its width is capped at
`calc(100vw - 1.5rem)` so it can never overflow the viewport. This is
intentional upstream behavior and is left untouched by this repo's patches
(a prior Android-only positioning patch that used `fixed` + safe-area insets
was found to be a deviation from source and has been reverted).

## Repo layout

| Path | Purpose |
|------|---------|
| `android-bridge.js` | Native bridge: session/auth interception, invite URL helpers, native join-code modal hook |
| `android-floating-timer-bridge.js` | Bridge for the Android floating/PiP focus timer overlay |
| `scripts/prepare-www.js` | Builds `www/` from `isotope-code` + injects bridge + boot splash |
| `scripts/apply-android-patches.js` | Patches built JS bundles and native Android config |
| `scripts/agent-status.mjs`, `scripts/agent-resume.sh`, `scripts/agent-handoff.sh` | Agent session bookkeeping (see `.agent/`) |
| `android/` | Native Capacitor Android project (Gradle, Java, manifest, resources) |
| `test/*.test.mjs` | Node test suite covering the bridge and patch logic |
| `.github/workflows/android.yml` | CI: builds debug APK on every push, optional release AAB on manual dispatch |
| `.github/workflows/release.yml` | CI: tags a version and publishes a GitHub Release with the built APK attached |
| `.agent/` | Session handoff docs for AI agents working on this repo (architecture, decisions, known issues, task queue) |
| `capacitor.config.json` | Capacitor app config: `appId=in.isotopeai.app`, native plugin settings |

## Run & operate

```bash
npm ci                       # install dependencies
npm test                     # run the Node test suite (test/*.test.mjs)
npm run build                # prepare-www → apply-patches → cap sync → apply-patches
npm run android:debug        # ./gradlew assembleDebug (needs Android SDK + JDK 17)
npm run android:release      # ./gradlew bundleRelease
```

`npm run build` requires two env vars pointing at a checked-out `isotope-code`:

```bash
REPO_DIR=/path/to/isotope-code \
SOURCE_DIR=/path/to/isotope-code/public \
npm run build
```

In CI, both repos are checked out automatically and these are wired up for
you — see `.github/workflows/android.yml`.

## Stack

- [Capacitor](https://capacitorjs.com/) 6.x (Android)
- Node.js 22, native Gradle/Java 17 build for the Android project
- Plain Node.js build scripts (no bundler) — `prepare-www.js` and
  `apply-android-patches.js` are the entire build pipeline
- `node --test` for the test suite (no external test framework)

## Gotchas

- **Never edit `www/`** — it is fully regenerated by `prepare-www.js` on every
  build and is git-ignored. Edit `scripts/prepare-www.js` or
  `scripts/apply-android-patches.js` instead.
- **Never edit `isotope-code`** from this repo/session. It is a separate,
  independently maintained repo and is treated as a read-only reference.
  If a UI fix is needed, either patch it here (Android-only, documented,
  narrow) or flag it for a fix upstream in `isotope-code`.
- **`apply-android-patches.js` runs twice** in CI — once before `cap sync`
  and once after — because `cap sync` can regenerate native files that need
  patches too. Don't remove the second invocation.
- **`ISOTOPE_CODE_REF`** in `.github/workflows/android.yml` pins the exact
  `isotope-code` commit used for a build. Bump it deliberately when you want
  to pick up new upstream changes, and re-run the full patch/test suite
  against the new ref before merging.
- Always run `npm test` before pushing — the patch scripts patch *minified*
  JS by exact string match, so a small upstream wording/formatting change can
  silently make a patch a no-op. The test suite catches this.

## User preferences

- Push every completed fix to GitHub immediately (don't batch multiple fixes
  into one delayed push).
- Continuously verify parity against `isotope-code` — every page, route,
  asset, and piece of functionality in the Android app should match the web
  source exactly, with Android-only differences kept minimal, intentional,
  and documented.

## Pointers

- `.agent/REPLIT_CONTEXT.md` — full session context and rules for AI agents
  working in this repo (evidence classes, Supabase contract, patch-system
  rules, completion gates)
- `.agent/ARCHITECTURE.md`, `.agent/DECISIONS.md`, `.agent/KNOWN_ISSUES.md`,
  `.agent/NEXT_TASKS.md` — deeper session handoff docs
