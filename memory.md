# Project Memory (Session Context)

Structured context collected during the isotope-code hardening/audit campaign. The purpose of this file is to preserve what we learned so that any future session (fresh model, new contributor) can resume without re-discovering the same facts.

Last updated: 2026-08-10

---

## 1. Project Shape

- **Repo**: `Suydev/isotope-code`, pushed to GitHub origin main. Branch strategy: `git pull --rebase` required before push (remote can move via auto-update).
- **Server**: single-file `server.mjs` (~9200 lines), started via `bash bin/isotope restart`. Logs at `~/.isotope/logs/server.log`. Local URL `http://127.0.0.1:3000`.
- **Frontend**: static Vite build in `public/`; entry `public/index.html`; chunks in `public/assets/` (hash-named).
- **Service worker**: `public/sw.js` — caches shell, patches runtime assets via `RUNTIME_PATCHED_ASSET_PATHS`, APP_SHA stamp drives update health-check.
- **Supabase**: schema dump + data backup stored in `sql/` (isotope-schema-restore.sql, isotope-data-backup.jsonl). Canonical community patch = `community-patch-v6.sql`.
- **APK lineage**: vendored in `isotope-apk-ref/` (android shell, android-bridge.js, supabase/ patch sources). It is git-ignored for node_modules/www/attached_assets/.env*.
- **Config**: `.opencode/` (opencode config), `agents/AGENTS.md` (session log; this file parallels it), `.env` (secrets, NEVER committed).

## 2. Architecture: Patch System on server.mjs

- **Patched bundles**: Vite chunks that the server rewrites at serve-time. Patch functions named `getPatched*Bundle`; warm/cached via `safeWarm(getIfExists(ABS, getPatchedX))` — missing file is tolerated (returns null), so purging unused chunks is safe.
- **Anchor strings**: `FROM` (exact snippet found in the built bundle) and `TO` (replacement) as `${name}_FROM` / `${name}_TO` consts. Re-anchoring is required after every frontend rebuild.
- **Patch log tags** (grep-able in server.log): `[PWAPatch]`, `[AuthStorePatch]`, `[SettingsPatch]`, `[SyncStorePatch]`, `[AppAccessGatePatch]`, `[CommunityPatch]`, etc. "Not found:" lines are pre-existing anchor misses and are NOT fatal.
- **ABS constant = canonical path** to an asset that must exist for the serve-path patcher; if a future rebuild renames it, update the ABS first, then the FROM/TO anchors.

## 3. Current Build Facts (as of 2026-08-10)

- Deployed sha: `84ce47b418ce`; VERSION stamped; `/api/health` returns `{ok:true,status:'ok',ts,version}`.
- Entry: `index-D1Y5F8Lk.js`; main app `App-CQ9mV4wu.js`; 121 chunks reachable from entry (graph keep list in `~/.cache/opencode/tmp/keep2.txt`).
- **L1 dead-build purge executed**: 177 old chunks (10MB) moved to `~/.cache/opencode/tmp/purged-assets/<ts>/` (backup kept, NOT deleted). Keep set = graph(121) ∪ sw.js lists(31) ∪ server ABS files(23) = 131 files. Post-purge verify: server restarts clean (NO ENOENT in log), all 23 patched bundles return 200 and pass `node --check`.
- sw.js still lists chunks that are NOT in the current import graph (CommunityHub-gANxZssO, SingleGroup-DU1IhoNK, useLeaderboard-BpvH5FXA, sessionSync-mloIEnTd, useInvites-D9RLFwf8, FocusStore-D5cRXSIr, EventsCalendar-COHF8nOK + 3 CSS). They are kept because sw.js declares them (SW install would fail on a missing SHELL_URL) AND server.mjs has ABS consts + patch fns for them. If a future rebuild drops them, remove from sw.js lists + server ABS/patch fns first, then purge.

## 4. problems.md Audit Status

- **H1 (anchors)** — DONE: AI_PATCH_FROM→useAIStore-DRa7CkEN.js; PWA_RELOAD_FROM→usePWA-BOujtGOv.js with `__isoReloadGuard` fallback; demo gate & circuit breaker moved into `getPatchedAuthStoreBundle` (`DEMO_GATE_FROM='ce=()=>typeof window>"u"?!1:Is(window.location.pathname)||window.sessionStorage.getItem(ut)==="1"'`→`'ce=()=>!1'`; CB_FROM=`function x(a){if(!a)return!1;if(typeof a=="object"){const t=a.status??a.statusCode;`→`return!1;` short-circuit). Minified name is `x` (has `Cs.has(t)`,`Ms.has(r)`,`Ps.some`). Dead anchors retired with comments: APP_PLAN_FROM_A/B (App-CQ9mV4wu.js has ZERO planType refs), COMMUNITY_FEATURE_RENDER.
- **H2 (service-key gating)** — DONE: `handleSupabaseProxy` uses `const useServiceKey = ADMIN_MODE_READY && isAdminAuthed(req)`.
- **H3 (update-now admin gating)** — DONE: `/api/update-now` requires admin auth (403 otherwise); admin cookie `Path=/`; update pill 403 → redirect to `/__admin/login?next=/`.
- **H4** — PENDING (comment-only doc edit).
- **L1 (dead builds)** — DONE (see §3; purge safe because safeWarm/getIfExists tolerate missing files).
- **L2 (sw.js dedupe)** — DONE: `useSyncStore-Di0wBMnH.js` duplicate removed from RUNTIME_GLUE_PATHS.
- **L3 (manifest.json legacy)** — PENDING: decide update vs delete vs symlink; only manifest.webmanifest is referenced by index.html.
- **M1 (readReqBody catches)** — DONE: all 8 chains have `.catch()`; oversized body test → server survives; malformed JSON resolves `{}` (catch only on too-large/network errors).
- **M2 (index.html stale assets)** — DONE: line 18 `index-LkPKl--4.css`, line 36 `vendor-react-BWKHxYQy.js` (current); katex CSS verified still current.
- **M3 (focusBackground)** — DONE: public/focus-bg-import.js line 15 → `focusBackground-Dc8Rc9XQ.js`.
- **M4 (localStorage guards)** — DONE: restore-and-launch.js 542/622 → try/catch removeItem; purgeStaleFakeData body wrapped in try/catch. Other getItem calls already guarded.
- **M5 (manifest screenshots)** — DONE: hero-dashboard.png 2880x2000, community.png 2880x2000, type image/png.
- **M6 (refresh tokens plaintext)** — PENDING (comment-only; owner decision, no behavior change).
- **Stale note**: problems.md keep-list was based on the OLD build (CommunityHub/SingleGroup/useLeaderboard/sessionSync/useInvites/FocusStore/EventsCalendar + Community-DIqF5406, App-pJGjDiPw, Leaderboard-BkEBFdG7). Do NOT trust it blindly for future purge decisions — regenerate the graph (`~/.cache/opencode/tmp/graph2.cjs`).

## 5. Device / ADB / PiP Setup

- Termux on Android; **ADB port is `45355`** (`adb connect 10.171.170.148:45355`). CDP forward: `adb -s 10.171.170.148:45355 forward tcp:9223 localabstract:chrome_devtools_remote` — then query devtools at `http://127.0.0.1:9223/json`.
- Browser on device: **Cromite** (`org.cromite.cromite`), UA = `Mozilla/5.0 (X11; Linux x86_64)` (desktop-like — this is why UA-guarding is banned).
- **PiP polyfill** (the flagship feature): server.mjs ~3984. video-PiP only (documentPip:false verified); canvas MUST stay in DOM; dirty-check throttle; `layoutChild` inside try/catch + `__pipTrace` debug (cap 60); serve-time bundle must pass `node --check` (a `split('\\n')` crash was fixed — if you see a PiP crash, check for new literal-newline in patched bundle first).
- Local prefetch cache names: `isotope-local-shell-3.3.9-<sha>/`, `isotope-local-runtime-<sha>/`. After every rebuild on device, clear caches with the new sha, then re-verify.
- Helper scripts (in `~/.cache/opencode/tmp/`): piprepro3.mjs (PiP repro), pipconsole.mjs (CDP console), pipbust.mjs (cache bust), pipdiag2.mjs (PiP telemetry), graph2.cjs (build graph walker), pg-probe.mjs / pg-databackup.mjs (Supabase probing/backup).
- Current device state: connected, CDP forwarded; browser not running (TermuxActivity is foreground). PiP final visual re-verify is STILL OPEN (earlier probe: text drawn, buttons 0px).

## 6. Operations Playbook

- **Restart**: `bash bin/isotope restart`; then check `~/.isotope/logs/server.log` for "ENOENT"/patched-bundle misses.
- **Verify patched bundles**: loop over the 23 ABS bundle names; `curl -s -o /tmp/x.js -w '%{http_code}' http://127.0.0.1:3000/assets/$f.js` must be 200 AND `node --check` must pass.
- **Supabase**: live DB already has all v6 deltas applied (probed via pg-probe.mjs). Do NOT press "Apply" on /__admin/patch again — it would re-run 3174 lines in one Management API call (30s timeout risk) with zero benefit.
- **Update flow**: deploying = `git push` then trigger `/api/update-now` from admin UI; server auto-stashes uncommitted work via `isotope auto-stash` — COMMIT BEFORE hitting update endpoints (we lost uncommitted H2/H3 edits once this way). New SW byte-change (APP_SHA stamp) causes devices to reinstall SW + clear old caches on next visit.
- **Health/verify**: `/api/health` requires the `status:'ok'` field for the admin verify page to pass.

## 7. Known Pre-existing Issues (do NOT regress)

- "Not found:" patch-anchor misses in SettingsPatch/SyncStorePatch/AppAccessGatePatch — pre-existing, expected, not-caused-by-purge.
- Some chunks listed in sw.js are not in the import graph — keep them (see §3).
- Remote `git push` requires rebase; remote head moved from `9eb04bc` → `acb6ad3` earlier (auto-update rewrites VERSION + commits).
- `.env` untracked; `tests/` (16MB) and `screenshots/*.png` untracked (not committed, by design).

## 8. Remaining Work

- [ ] L3: public/manifest.json vs manifest.webmanifest (only webmanifest is linked).
- [ ] H4 + M6: comment-only doc edits.
- [ ] Commit + push L1 purge (purged files stay in ~/.cache backup, NOT in git).
- [ ] Device PiP final re-verify on port 45355 (clear caches → open /focus → __pipTrace + screencap; check green/red buttons visible).
- [ ] Update agents/AGENTS.md + this file with final state.
- [ ] PiP APK: scaffold Kotlin project in isotope-apk-ref, GitHub Actions build, install/test via ADB.