# Isotope Local Project Memory

## Project State (updated Aug 9 2026)
- Repo: `/data/data/com.termux/files/home/isotope-code`, runs as local PWA server on localhost:3000 on this Termux device.
- Git remote `origin` = https://github.com/Suydev/isotope-code, branch `upgrade/premium-app`. Committed + pushed: `c017e20` ("fix: safe local-only update, in-app update pill, leaderboard auth, safe bundle warmup").
- Premium asset pack RESTORED from `/data/data/com.termux/files/home/downloads/isotope_premium_full_v4.tar.gz` (extracted at `~/downloads/external-reference/isotope-premium-assets/`). Previously the on-disk build was the OLD build after an accidental `isotope update` overwrote the working tree. None of the lost build was recoverable from git (never committed). Now restored and working.

## Auth / Env
- `.env` has `SUPABASE_URL=https://vteqquoqvksshmfhuepu.supabase.co` + `SUPABASE_ANON_KEY` (never push .env).
- Upstream bundle URL `rcnekgzbdlwhcpmpoogz.supabase.co` is rewritten at serve time in `useAuthStore-Aw1au7RF.js` (and JWT constants in `replaceSupabaseJwtConstants`) to local env values.

## Bundle / Patch Wiring (CRITICAL — keep in sync)
The server serves the PREMIUM (new) build from `public/assets/` and patches each file at serve time via `server.mjs`. Name mapping is held in absolute-path constants:

| Const | File (must exist) | Patch applied |
|---|---|---|
| `APP_BUNDLE_ABS` | `App-CQ9mV4wu.js` | demo mode off, plan→ranker, supabase placeholders, circuit breaker, etc. |
| `ENTRY_BUNDLE_ABS` | `index-D1Y5F8Lk.js` | sentry DSN neutralized |
| `AUTH_BUNDLE_ABS` | `Auth-D0Y8CB1f.js` | (auth) |
| `FOCUS_BUNDLE_ABS` | `Focus-B4gLsWoP.js` | focus patch |
| `ONBOARDING_BUNDLE_ABS` | `Onboarding-C0svxOgT.js` | onboarding |
| `SETTINGS_BUNDLE_ABS` | `SettingsLayout-DkuooNHv.js` | settings |
| `MARKETING_CORE_BUNDLE_ABS` | `marketing-core-DzcTqL0l.js` | URL/JWT normalize |
| `USE_AUTH_STORE_BUNDLE_ABS` | `useAuthStore-Aw1au7RF.js` | isPremium forced true, URL norm, auth-token localStorage mirror, autoRefreshToken on |
| `COMMUNITY_API_BUNDLE_ABS` | `communityApi-Ccw5N_9O.js` | premium demo-gate off, group chat RPCs (`community_get_group_messages`/`sendGroupMessage`) injected |
| `COMMUNITY_BUNDLE_ABS` | `Community-CEnEgsrd.js` | (community) |
| `COMMUNITY_HUB_BUNDLE_ABS` | `CommunityHub-gANxZssO.js` | (hub) |
| `COMMUNITY_VISUALS_BUNDLE_ABS` | `CommunityVisuals-mHr4KGyg.js` | visuals |
| `LEADERBOARD_BUNDLE_ABS` | `useLeaderboard-BpvH5FXA.js` | leaderboard nav+view injected |
| `SINGLE_GROUP_BUNDLE_ABS` | `SingleGroup-DU1IhoNK.js` | chat component injected (3/3 anchors) |
| `INVITES_BUNDLE_ABS` | `useInvites-D9RLFwf8.js` | invites |
| `SESSION_SYNC_BUNDLE_ABS` | `sessionSync-mloIEnTd.js` | session sync |
| `APP_ACCESS_GATE_BUNDLE_ABS` | `AppAccessGate-DzNuNpuU.js` | gate open |
| `USE_SYNC_STORE_BUNDLE_ABS` | `useSyncStore-Di0wBMnH.js` | sync store |
| `AI_STORE_ABS` | `useAIStore-DRa7CkEN.js` | AI store |
| `DASHBOARD_BUNDLE_ABS` | `Dashboard-Dzf-IC_a.js` | dashboard |
| `PWA_MANAGER_BUNDLE_ABS` | `PWAManager-CUuXr3sv.js` | reload guard |
| `STORE_BUNDLE_ABS` | `FocusStore-D5cRXSIr.js` | store |
| `EVENTS_BUNDLE_ABS` | `EventsCalendar-COHF8nOK.js` | events |

> RULE: the exact file names change on every build. Test with `for f in <name>; do [ -f "public/assets/$f" ] || echo MISSING; done`. If ENOENT appears in logs for a patch, that constant points at a file that isn't there — rebuild/repair.

| Patch | Where in server.mjs | Status |
|---|---|---|
| AppPatch (supabase URL/anon placeholder + JWT norm + circuit break + plan rancker + temp fallback off) | `getPatchedAppBundle` | applied? check log |
| AuthStore: isPremium→true, autoRefetch, localStorage mirror | `getPatchedAuthStoreBundle` | applied |
| CommunityApi: gate neutralized, chat RPC methods appended | `getPatchedCommunityApiBundle` | applied |
| LeaderboardPatch: nav + view injected | `getPatchedLeaderboardBundle` | applied |
| Chat Component (Qa / Mono component) | injected into community | applied |
| SessionSync | ✓ | applied |
| Invites | ✓ | applied |

## History / What Happened
1. App was working 20+ hours with premium (chat/leaderboard) build.
2. `isotope update` was run → fetched + merged the OLD (non-premium) upstream tree → overwrote `public/assets/` with old build. Premium WAS NOT in git (0 hits in history/stashes/backups).
3. All 20h of server-side work was committed (`c017e20`) and pushed — safe.
4. Premium build recovered from the 2.6MB tarball `~/downloads/isotope_premium_full_v4.tar.gz` (created Aug 6 15:49) — full 223-asset inventory at `ASSET_INVENTORY.md` inside pack.
5. Re-applied: copied `scripts/*`, `styles/*`, `fonts/*` → `public/assets/`, `icons/*` → `public/icons/`, `pwa/manifest.webmanifest` → `public/manifest.webmanifest`. `sw.js` SHELL/RUNTIME lists + `restore-and-launch.js` entry + `server.mjs` ABS constants all point at premium names now.
6. Server restarted: all 200's for entry chain; patch logs show CommunityApi/Leaderboard/AuthStore patches hitting.
7. Aug 9: chat crash fixed (`l.map(m=>` → `l.map(n=>` in injected `COMMUNITY_CHAT_COMPONENT_TO`, server.mjs ~3385). Chat panel made fixed-size (`h-[28rem] max-w-3xl`) + custom webkit scrollbar (10px rounded thumb, `scrollbar-gutter:stable`).
8. Aug 9: **Avatar pipeline researched** — chat avatar/name come from `user_profiles.profile_data->>'avatar'` and `->>'name'` (NOT display_name/handle columns, NOT storage). Live RPC `community_get_group_messages` updated: `authorName = coalesce(pf.display_name, pf.handle, pf.profile_data->>'name','')` — saved to `.cache/fix_group_messages_authorName.sql` (fix must be re-applied if DB is reset).
   - Real user = `3f56d64e` (elixir.suyashprabhu@gmail.com, "suyash prabhu"). Their profile_data has NO avatar key → chat shows dicebear/"Member". Upload writes data-URL into `profile_data.avatar` via `useAuthStore.updateProfile` → debounced `Kr` → `pushProfile` upsert (`Prefer: resolution=merge-duplicates`, verified 200 with dummy account).
   - Avatar uploads fail silently when device↔supabase.co is unreachable (Aug 8-9 saw repeated "Failed to fetch" + `SupabaseCircuitBreakerError` in browser-errors → degraded mode skips pushes). Fix = re-upload when network is up; DB pipeline verified end-to-end (avatar+name flowed into chat RPC).
   - June 6 storage avatar exists at `avatars/3f56d64e-…/avatar-1780711117045-c01b9953.png` (old build); current premium build does NOT use Storage for avatars.
9. In-app updater CONFIRMED built-in: stamp `v3.3.8|sha12|server.mjs-mtime` → pill (`#__iso_update_pill__`, bottom-right) → `POST /api/update-now` (202, spawns detached `bash bin/isotope update`) → polls `/api/version` → reload. `/api/check-update` shows hasUpdate when stamps differ.
10. Aug 9 avatar saga (RESOLVED): app pushes `profile_data.avatar` (data-URL) direct browser→supabase; on this device that silently fails (`SupabaseCircuitBreakerError`/`Failed to fetch` Aug 8-9, debounced `Kr` push skipped or dropped) → DB `profile_data` has NO avatar → chat RPC (reads `->>'avatar'`/`->>'avatarUrl'`) shows dicebear, settings shows different fallback. FIX: `getPatchedAuthStoreBundle` now mirrors any `data:image/` avatar from `updateProfile` to the LOCAL server `/__auth/profile` (server→supabase always reachable; uploads to `avatars` bucket, stores `avatar_url`+`avatar_path`, mirrors into `users.avatar_url`), then re-arms `Kr(n,i,"full")` with the storage URL + updates local `i.avatar_url` so subsequent browser pushes carry it. Anchor: `await m.saveUserProfile(i);const n=va.getState().userId` (1 hit).
    - Token for the mirror: `localStorage["isotope-auth-token"]` (JSON or raw).
    - `/__auth/profile` response: `{ok, profile:{avatar_url,...}, avatar_storage, ...}` (server.mjs ~7137).
    - Storage object check: `POST /storage/v1/object/list/avatars` with prefix `<userId>`.
    - SQL admin: `https://api.supabase.com/v1/projects/vteqquoqvksshmfhuepu/database/query` with `Authorization: Bearer $SUPABASE_ACCESS_TOKEN` (pooler/psql DOES NOT work — tenant 404).
11. Aug 9: **Avatar-mirror injection broke the served bundle** (a `}` was missing → `Uncaught (in promise) SyntaxError: Unexpected token ')'` on `assets/useAuthStore-Aw1au7RF.js` after restart; original file imported fine, served file failed, so it was the patch pipeline). Isolated by re-running `getPatchedAuthStoreBundle` stage-by-stage in Node (`import('data:...base64')` per stage; resolve-vs-parse error distinguishes parse failure). Root cause: unbalanced braces in AV_TO (`{`19 vs `}`18). Rewrote AV_TO as V2 (balanced 0/0, validated with `new vm.Script('(async function(){'+AV_TO+'})()')`) — uses function expressions instead of arrows, single try/catch, `_x` var for userId. `node --check server.mjs` passes; after restart, served bundle `import()` succeeds (only vendor-file resolution error in tmp, i.e. parse is clean).

12. Aug 9: **Cross-platform release pass** (v3.3.9):
    - New `bin/isotope.ps1` (PowerShell CLI, parity with bash: start/stop/restart/update/status/doctor/open/logs/version/repair/help; ISOTOPE_BRANCH override; redaction).
    - `bin/isotope` + `bin/isotope.bat` update: fall back to `origin/main` when current branch has no remote; `ISOTOPE_BRANCH` env wins. `install.sh` (Linux/macOS one-liner) + `install.ps1` (Windows one-liner `irm ... | iex`, clones to `~\isotope-code`, installs `isotope.cmd` shim + user PATH) — both pinned to `main`.
    - `.github/workflows/screenshots.yml`: on main pushes, Playwright captures fresh screenshots (`scripts/capture-screenshots.mjs --demo --compress`) and commits them back to main. release.yml release notes embed one-line install commands per platform. ci.yml validates install.sh + bin/isotope.ps1.
    - Docs updated: README (one-liners + ISOTOPE_BRANCH), docs/install.html, docs/index.html (v3.3.9 + all-platform one-liners), docs/index.md, docs/gallery.html (auto-refresh note), CONTRIBUTING.md (new files table), CHANGELOG.md (3.3.9 entry). validate-docs.mjs REQUIRED_FILES + install-script list extended; 34 checks / 0 warnings / 0 errors.
    - Version bumped 3.3.8 → 3.3.9 (package.json, VERSION, README badge, docs hero).
    - Server restarted (PID 10289); `/api/version` = 3.3.9; authstore bundle 200; `isotope doctor` all ok; `/usr/bin/isotope` synced.
13. Aug 9: **Screenshot pipeline fixes** (v3.3.9 follow-ups):
    - Server had no `/api/health` — added it (server.mjs ~6340) as a health alias used by capture + seed scripts.
    - `capture-screenshots.mjs` failed 8/10 on first CI run ("Execution context was destroyed" — client-side router navigation raced `page.$`). Fixed: `waitForSelector`/`isBlankPage`/`isMainlyWhite` now catch destroyed contexts and retry; `goto` uses `waitUntil:'load'` + 800ms settle delay. All 10 routes now capture (verified in CI).
    - `screenshots.yml` commit step used `git diff --quiet -- screenshots` which ignores UNTRACKED files → new PNGs never committed. Fixed by `git add screenshots/` then `git diff --cached --quiet`. Screenshot commit `4054a2a` pushed to main.
    - Removed the `seed-demo-data.mjs --reset` step from CI — its `/api/subjects`, `/api/tasks`, `/api/habits`, `/api/sessions` endpoints don't exist server-side; demo data is client-side via `?demo=1` (hero/mobile dashboard captured fine without it).
    - docs/gallery.html + docs/index.html now reference the 10 fresh captures (`screenshots/hero-dashboard.png`, `focus-timer.png`, `analytics.png`, `syllabus.png`, `tasks.png`, `exams.png`, `community.png`, `settings-sync.png`, `mobile-dashboard.png`, `mobile-focus.png`) instead of June Android JPGs. validate-docs: 34 checks / 0 warnings / 0 errors.
    - Pushed to main: `6a87214` (release 3.3.9), `002b081` (health endpoint), `55567af` (capture fixes), `4054a2a` (screenshots), `edd34e3` (gallery docs). Local branch now `main` (upgrade/premium-app deleted). Stale auto-stashes (isotope-auto-stash-*) from earlier sessions left in place.
14. **Schema dump saga (DONE)**: PAT-based portable dump generator `scripts/schema-dump.mjs` → `sql/isotope-schema-restore.sql` (217 KB, NO data, transactional). Validated GREEN on scratch Postgres 18.2 cluster (`~/.cache/opencode/tmp/pgscratch`, port 55432, auth.* stubs). Critical fixes: rebuild functions from `pg_proc` components, NOT `pg_get_functiondef` (bodies embed delimiter text like `$$function$` — not round-trip safe) → collision-proof `$iso_fn$` delimiters; emit schemas `private`/`rpc_private` before `public`; `polcmd` single letters ('r','a','w','d','*') must expand to `FOR SELECT/INSERT/UPDATE/DELETE/ALL` (dump was emitting `FOR D` → syntax error); fn GRANTs need `pg_get_function_identity_arguments` (overloaded `create_community_group`) + dedupe per (sig, grantee) — server.mjs ~3385.
15. **Leaderboard 401 FIXED** (server.mjs `COMMUNITY_API_CHAT_TO` ~3566): `__lbTok` picker now decodes JWT `exp` and picks the freshest non-expired token from localStorage (prior: first arbitrary hit — often expired `__migrated__*__isotope-auth-token`). Verified live: `/__leaderboard` 200, rankings render.
16. Aug 9: **Group chat scrollbar REAL fix**: `h-[28rem]` class never applied — Tailwind JIT didn't generate the arbitrary-value rule for the injected bundle → panel grew full height (clientHeight 1683, no scrollbar). Fixed by adding `height:28rem` INLINE to the injected `.community-chat-scroll` style tag (server.mjs ~3349). Verified live: clientHeight 448, scrollHeight 1683, canScroll true. Proof shot: `screenshots/group-chat-scrollbar.png`.

## Known quirks
- `/api/check-update` compares VERSION.sha vs local; pill shows when mismatch. Pushed sha now `c017e20...`; local prep is same so pill hides until a new push. Server restart changes stamp (server.mjs mtime) → pill reappears until dismissed.
- Browser service worker caches old shell caches with OLD names — after a change, need `caches.keys()` purge or hard reload; `public/sw.js` SHELL list is hand-maintained.
- `bin/isotope` (repo) and `/data/data/com.termux/files/usr/bin/isotope` (installed) must be synced after edits.
- Supabase admin access: `SUPABASE_SERVICE_ROLE_KEY` + `SUPABASE_ACCESS_TOKEN` in `.env`. SQL runs via `https://api.supabase.com/v1/projects/vteqquoqvksshmfhuepu/database/query` (Bearer access token). psql/pooler direct connection FAILS (tenant/user not found) — always use the management API.
- `user_profiles` has NO avatar/display_name/handle values for most users — display_name/handle columns are NULL; profile_data jsonb is the source of truth.
- Node gotcha: don't name a local var `URL` in eval scripts — shadows global URL constructor and breaks `fetch()` parsing.
- Naive bracket-tokenizers false-positive on minified bundles (unbalanced braces inside string literals, e.g. demo data); count braces/parens with a string-aware scanner or validate via `new vm.Script()` (gives real parse verdict), never by eye.

## Next steps
- Commit + push the premium restore (`public/assets/*` new files + sw.js + restore-and-launch.js + server.mjs) as its own commit, note "re-apply premium assets".
- User to re-upload profile photo (network to supabase.co now OK) → verify `profile_data.avatar` appears via the `/rest/v1/user_profiles` query, then chat shows it.
- Run `pm2`? no — `bash bin/isotope restart`.
- Keep updating this file after each task (do not let it rot).
- user logs App errors at `/data/data/com.termux/files/home/storage/downloads/aaaa/` (har files). Check there when a frontend bug is reported.