# isotope-apk

Capacitor Android wrapper for **IsotopeAI** — an AI-powered study planner, focus timer, and analytics app for students preparing for JEE, NEET, CUET, boards, and other competitive exams.

## What this repo is

This repo does **not** contain the UI or business logic. It:
- Copies the compiled web app from `Suydev/isotope-code` (a separate repo) into `www/`
- Injects Android bridges (`android-bridge.js`, `android-floating-timer-bridge.js`)
- Patches selected minified JS bundles for Android-safe behavior
- Builds an installable APK via Capacitor + Gradle (on GitHub Actions)

The app cannot run as a web server on Replit. APK builds require Java 17 / Android SDK, which are not available here.

## How to run

```bash
npm install              # install JS deps
npm test                 # run pure-logic tests (no www/ needed for 35/47)
npm run prepare-www      # requires isotope-code checked out as ../isotope-code
npm run apply-patches    # same
npm run build            # full pipeline: prepare-www + patches + cap sync + patches again
```

APK assembly happens on GitHub Actions (`android.yml`). Use `npm run android:debug` locally only if Java 17 + Android SDK are available.

## Stack

- Capacitor 6.x (Android WebView wrapper)
- Node.js 20 build scripts (no bundler) — Replit is configured with `nodejs-20`; the README mentions Node 22 as the CI target but local dev runs on Node 20
- `node --test` for tests (no external framework)
- Supabase for auth, data, storage, realtime
- GitHub Actions for APK CI/CD

## Key files

| File | Purpose |
|------|---------|
| `android-bridge.js` | Intercepts `window.fetch` for `/__auth/*` and `/__supa/*` → direct Supabase calls |
| `android-floating-timer-bridge.js` | Native floating/PiP focus timer overlay bridge |
| `scripts/prepare-www.js` | Copies `isotope-code/public` → `www/`, injects bridges, disables PWA-only features |
| `scripts/apply-android-patches.js` | Patches minified JS bundles in `www/assets/` for Android |
| `www/` | **Build output — never edit by hand** (git-ignored) |
| `android/` | Native Capacitor Android project (Gradle) |
| `.agent/` | Persistent agent context: architecture, decisions, known issues, next tasks |

## Agent context

Always read before working:
1. `.agent/REPLIT_CONTEXT.md` — full session context, rules, evidence classes
2. `AGENTS.md`
3. `.agent/DECISIONS.md`, `.agent/KNOWN_ISSUES.md`, `.agent/NEXT_TASKS.md`

## Test state (as of 2026-07-05)

- **35 / 47 tests pass** — pure logic tests that don't need `www/` or `isotope-code`
- **12 / 47 fail** — tests that require the built `www/` output and `isotope-code` checked out at `../isotope-code`; these failures are expected in this environment and are **not regressions** — they pass in CI where both repos are present. Do not treat them as bugs without first confirming `isotope-code` is available.

## Current work

Fixing the community system in controlled batches:
1. Supabase security + RPC migration (in `isotope-code`)
2. Upstream web implementation using unified RPCs (in `isotope-code`)
3. Remove APK community divergence / compiled-code rewrites (in `isotope-apk`)
4. Two-account integration tests for the full community flow

**Safe deployment order:** database migration → isotope-code push → rebuild assets → bump pinned commit in isotope-apk → push APK fixes → build new APK → integration tests.

## User preferences

- Push every completed fix to GitHub immediately (don't batch multiple fixes into one delayed push).
- Continuously verify parity against `isotope-code` — every page, route, asset, and piece of functionality in the Android app should match the web source exactly, with Android-only differences kept minimal, intentional, and documented.
- Fix community logic in `isotope-code` first (it is the source of truth for UI/business logic); `isotope-apk` should only contain Android-native adaptations.
