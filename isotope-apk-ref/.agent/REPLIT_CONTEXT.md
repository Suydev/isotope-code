# IsotopeAI Android — Persistent Replit Context

**Snapshot date:** 2026-07-02
**Primary repository:** `Suydev/isotope-apk`
**Reference/source repository:** `Suydev/isotope-code`
**Purpose:** Persistent codebase map, runtime truth rules, known failure context, and execution protocol for Replit Agent.

> Replit Agent must read this file before inspecting or modifying code. Keep it updated as facts change. Do not replace it with a new audit. Append or revise only when evidence changes.

---

## 1. Current User Instruction

The current phase is **observation and context collection only**.

- Do not repair application logic yet.
- Do not modify Supabase yet.
- Do not create migrations yet.
- Do not trigger release work yet.
- Wait until the user explicitly says to fix or implement.
- The user has an APK installed and will provide runtime results.
- Installed-device results override any document, test, comment, or prior claim marked fixed.

Documentation-only updates required to preserve agent context are allowed when explicitly requested by the user.

---

## 2. Repository Selection

### Active pair

1. `Suydev/isotope-code`
   - Main PWA/server project.
   - Contains the real compiled React/Vite application in `public/` and `public/assets/`.
   - Contains authored runtime glue, Node server logic, synchronization code, and authoritative Supabase SQL.

2. `Suydev/isotope-apk`
   - Current Capacitor Android wrapper.
   - Copies the compiled PWA from `isotope-code/public` into `www/`.
   - Injects Android bridges and patches selected compiled bundles.
   - Builds the APK with Capacitor, Gradle, and GitHub Actions.

### Historical reference only

`Suydev/isotope-android` is an older Flutter/SQLite rewrite, version `2.0.0+1`, using Provider and `sqflite`. It is not the current installed APK code path. Use it only for old UI or feature ideas when specifically useful.

### Critical source rule

`src/App.tsx` in `isotope-code` is a placeholder. Never rebuild the product from that file. The real UI is the compiled application under `isotope-code/public/assets/`.

---

## 3. Mandatory Reading Before Work

Read, in order:

1. This file: `.agent/REPLIT_CONTEXT.md`
2. `AGENTS.md`
3. Every file and state record present under `.agent/`
4. Current Git history and recent diffs in `isotope-apk`
5. `isotope-code/README.md`, `CHANGELOG.md`, `ADMIN.md`, and relevant docs
6. Every report under `isotope-code/audit/`, especially `audit/_meta/`
7. Relevant source/runtime files listed below
8. The installed-APK feedback supplied by the user

Do not produce a replacement broad audit. Existing audits are context. Perform only targeted tracing necessary to understand or implement an item.

---

## 4. System Architecture

```text
isotope-code/public compiled PWA
        ↓ copied by prepare-www
isotope-apk/www
        ↓ runtime scripts injected
android-bridge.js
android-floating-timer-bridge.js
auth-bridge.js
restore-and-launch.js
focus-bg-import.js
        ↓ selected compiled assets patched
scripts/apply-android-patches.js
        ↓
Capacitor Android WebView
        ↓
MainActivity.java + FloatingTimerService.java
        ↓
Supabase Auth / REST / RPC / Storage / Realtime
```

### Build sequence

The package scripts currently follow this pattern:

```text
prepare-www
→ apply Android patches
→ capacitor sync android
→ apply patches again idempotently
→ Gradle assemble/bundle
```

The APK does not run `server.mjs`. Android must replace server endpoints expected by the compiled PWA.

### Android bridge role

`android-bridge.js` intercepts or emulates calls such as:

- `/__auth/*`
- `/__supa/*`
- Supabase Edge Function-style routes used by compiled chunks
- backup/import/restore operations
- session completion and leaderboard RPC mapping
- Storage upload/download/cleanup
- network and notification integration

---

## 5. High-Value Files

### `isotope-apk`

- `AGENTS.md`
- `.agent/*`
- `package.json`
- `capacitor.config.json`
- `.github/workflows/*`
- `scripts/prepare-www.js`
- `scripts/apply-android-patches.js`
- `android-bridge.js`
- `android-floating-timer-bridge.js`
- `focus-bg-import.js`
- `android/app/src/main/java/in/isotopeai/app/MainActivity.java`
- `android/app/src/main/java/in/isotopeai/app/FloatingTimerService.java`
- `android/app/src/main/AndroidManifest.xml`
- `android/app/build.gradle`
- `test/android-bridge.test.mjs`
- `test/prepare-patches.test.mjs`

### `isotope-code`

- `server.mjs`
- `public/auth-bridge.js`
- `public/restore-and-launch.js`
- `public/sync/backup-normalizer.js`
- `public/sync/local-data-adapter.js`
- `public/assets/focusBackground-*.js`
- `public/assets/useGroups-*.js`
- `public/assets/GroupDiscovery-*.js`
- `public/assets/Community-*.js`
- `public/assets/CommunityHub-*.js`
- `public/assets/SingleGroup-*.js`
- `public/assets/useLeaderboard-*.js`
- `public/assets/DashboardHeader-*.js`
- `public/assets/SettingsLayout-*.js`
- `public/assets/EventsCalendar-*.js`
- `isotope-complete.sql`
- `audit/_meta/source-manifest.tsv`
- `audit/_meta/database-object-map.txt`

Asset hashes can change. Resolve files by basename pattern and imports rather than assuming an old hash forever.

---

## 6. Evidence Classes

Every statement must be labelled internally as one of these:

### A. Device verified
Observed by the user in the installed APK. This is highest priority.

### B. Runtime reproduced
Reproduced by an emulator, physical device, or real browser/WebView execution with logs.

### C. Build verified
Gradle/Capacitor build completed and the resulting APK was inspected.

### D. Unit/static verified
A test checked source text, a patch marker, mocked bridge behavior, or a compiled string.

### E. Code observed
The implementation exists, but actual runtime behavior has not been demonstrated.

Never convert D or E into a claim that a user-facing feature works.

---

## 7. Major Testing Caveat

Several existing tests verify that exact minified replacements or strings exist. They do not prove end-to-end behavior.

Examples of currently asserted implementation details include:

- `window.prompt(...)` for Join with Code
- `window.location.href = "/invite/..."`
- notification list slicing to eight items
- `Latest 8 shown`
- fixed notification classes
- localStorage group-tour markers
- leaderboard coercion strings
- presence of bridge function names

A passing static test can mean only that the intended patch was applied to a bundle. It can still be broken on the installed APK.

When repairing a feature, add behavior-level tests where practical and retain device verification as the final gate.

---

## 8. Current Runtime Issues to Preserve

These are user-reported or strongly indicated by code. Do not mark them solved without new device evidence.

### 8.1 Notification panel

Reported/observed concerns:

- Bell is near the right side, but panel positioning can extend incorrectly or appear on the wrong side.
- Long lists can cover too much of the screen.
- The panel must remain inside viewport safe areas.
- It needs a bounded height and internal scrolling.
- Latest-item limiting is acceptable only if the interface clearly exposes the full list or intended behavior.

Desired behavior:

- Anchor the panel's right edge to the bell/right safe area and extend left.
- No horizontal overflow.
- Internal vertical scroll.
- Correct outside-click, Escape, Android Back, and route-change closing.
- Test on phone and tablet widths.

Current tests assert a left-position patch and `slice(0,8)`; treat these assertions as implementation history, not product requirements.

### 8.2 Focus background from device

The canonical `focusBackground` compiled module accepts only `http(s)` URLs and stores only:

- `imageUrl`
- `blurAmount`

The Android file importer stores local media through a separate path. This split can allow persistence while disconnecting local images from blur/dim/position/preview behavior.

Required eventual behavior:

- Device image and URL image must enter the same rendered background pipeline.
- Blur, dim, position, preview, clear, persistence, and restart behavior must match.
- Validate image MIME and size.
- Decode successfully before reporting success.
- Reset the file input so the same file can be selected again.
- Avoid oversized data URLs in localStorage when a safer IndexedDB/Filesystem design is available.

### 8.3 Community Create Group / Join Group

The original compiled `GroupDiscovery` already contains a real Create Group modal, form and invite generator.

The Android patch layer currently modifies/gates Community behavior and introduces a prompt-based Join with Code flow. These paths need runtime tracing rather than additional blind string patches.

Eventually verify:

- Create Group button visible and usable.
- Authenticated RPC succeeds.
- Created group row is returned/refetched.
- Creator membership exists with owner role.
- `member_count` is correct.
- Navigation opens the created group.
- Public join works.
- Join by invite code/link works.
- Error messages show actual Supabase/PostgREST detail.
- Cache/query invalidation updates lists immediately.

### 8.4 Group tour repeats

The Android patch currently uses a key shaped like:

```text
isotope:group-tour-seen:<groupId>
```

This is not user-scoped and can leak behavior between accounts on one device. The source/database also has tour-related profile/state support and a `user_tours` path in schema history.

Eventually use a user-aware contract such as:

```text
group-tour:<userId>:<groupId>
```

Prefer cloud persistence with a local offline fallback and an explicit reset action.

### 8.5 Leaderboard `NaN` and period mapping

The contracts differ:

- global `get_leaderboard` returns `total_hours`, `weekly_hours`, `monthly_hours`, `score` and related fields;
- group `get_group_leaderboard` returns `points`;
- the compiled UI frequently expects `hours` or a normalized ranking shape.

The current SQL treats every period other than `monthly` as weekly. Passing `daily` to `get_leaderboard` is therefore not a real daily leaderboard.

Future normalization must map intentionally:

- daily → aggregate `daily_user_stats` for the current date;
- weekly → `weekly_hours`;
- monthly → `monthly_hours`;
- all-time → `total_hours`;
- group points ranking → `points` with a points-specific display, not fake hours.

Never replace a valid alternate field with zero merely because `hours` is absent.

### 8.6 Community page errors and dormant features

The active Community compiled graph still contains `EventsCalendar` and an internal `events` state route. Events are dormant/hidden, not necessarily removed.

The Supabase schema still defines and seeds:

- `community_events`
- `community_event_attendees`

Do not delete these while fixing Groups unless the user explicitly requests removal.

### 8.7 APK identity mismatch

JavaScript/package version is `3.3.8`, while the Android project has historically retained `versionCode 1` and `versionName "1.0"`.

This makes old/new APK confusion likely.

Future build provenance should expose:

- app version;
- Android versionName/versionCode;
- `isotope-apk` Git SHA;
- pinned `isotope-code` source SHA;
- patchset/build identifier;
- build timestamp where appropriate.

Artifact names should include version and short SHA.

### 8.8 Invite deep links

`MainActivity.onNewIntent()` currently replays floating-timer actions but does not visibly parse invite/deep-link intents.

The current prompt flow assigns `window.location.href` to an internal `/invite/...` route. Verify that Android manifest intent filters, Capacitor routing, cold start, warm start and authenticated redirect all work before claiming invite links work.

### 8.9 Floating Timer / PiP

The current primary implementation is a native overlay service, not browser Document PiP.

Components:

- patched Focus bundle calls `window.__isoOpenFloatingTimer(...)`;
- `android-floating-timer-bridge.js` normalizes timer state and actions;
- `MainActivity` manages overlay permission and service control;
- `FloatingTimerService` renders a draggable/resizable overlay;
- system PiP remains a reduced fallback.

Code observed features include timer display, correct/incorrect/skip/undo, target editing, expand and close. Do not claim visual parity or reliability without installed-device testing.

### 8.10 Focus-type emoji repair

`android-floating-timer-bridge.js` repairs malformed focus-type icons and provides fallbacks. Verify the main Focus selector and native overlay separately; fixing one does not prove the other.

---

## 9. Supabase Contract

### Public runtime credentials

The APK runtime requires:

- Supabase project URL
- anon/publishable key
- user access/refresh tokens after login

A Supabase Management API token is not a mobile runtime credential.

### Management credentials

Replit may use these secret names, never their literal values in Git:

- `GITHUB_PAT`
- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_PROJECT_REF`
- `SUPABASE_URL` when not already resolved safely
- `SUPABASE_PUBLISHABLE_KEY` when not already resolved safely

Never embed or commit:

- GitHub PAT
- Supabase access token
- service-role key
- signing passwords
- keystore material

### Authoritative SQL contracts

`isotope-code/isotope-complete.sql` defines the intended schema and RPCs, including:

- `create_community_group(...)` returning UUID;
- `accept_invite(p_code)`;
- `get_invite_details(p_code)`;
- `get_leaderboard(...)`;
- `get_group_leaderboard(...)`;
- `get_group_analytics_from_snapshots(...)`;
- `finish_session_sync(...)`;
- group/member/chat/invite/challenge/event tables;
- RLS policies and helper functions;
- member-count synchronization;
- Storage policies.

`create_community_group` atomically inserts the group and creator membership as owner.

### Live database rule

The SQL file expresses intended state; live Supabase is runtime truth.

Before any schema fix:

1. inspect live function signatures, grants, policies and columns;
2. compare live state with `isotope-complete.sql` and audit metadata;
3. reproduce the real authenticated request;
4. create an idempotent migration only if live drift or a genuine contract defect is confirmed;
5. commit the migration;
6. apply it through the Management API;
7. re-query and prove the resulting live state.

Never make ad hoc dashboard-only SQL changes with no committed migration.

---

## 10. Backup and Restore Rules

The app has a canonical backup system spanning local IndexedDB/localStorage and Supabase Storage.

Important paths include:

```text
<userId>/backups/latest.json
<userId>/backups/history/*.json
<userId>/cloud-snapshot/latest.json
<userId>/imports/latest.json
<userId>/exports/latest.json
```

Core safety rule:

> Never allow an empty local workspace to overwrite a richer cloud backup.

The bridge uses `BLOCKED_EMPTY_OVERWRITE` for this condition.

Preserve:

- canonical normalization;
- collection counts;
- rich/empty candidate ranking;
- readback/hash verification;
- current-user path ownership;
- user JWT usage rather than service-role credentials in the APK.

Do not simplify synchronization while working on unrelated UI defects.

---

## 11. Replit Execution Protocol After User Says Fix

For each item:

```text
Read existing audit and this context
→ collect user's installed-APK result
→ inspect the exact current implementation
→ trace original isotope-code behavior
→ reproduce or identify the broken boundary
→ implement the smallest coherent fix
→ add behavior-focused regression coverage
→ run all relevant tests
→ run full npm build
→ run Gradle APK build
→ inspect packaged APK assets/provenance
→ commit and push a meaningful checkpoint
→ verify GitHub Actions artifact
→ give the user exact device test steps
→ record device result without exaggeration
```

### Controlled freedom

Replit may edit any file required in `isotope-apk`, and may propose or implement coordinated changes in `isotope-code` and Supabase when necessary. However:

- avoid unrelated rewrites;
- do not restart the project;
- do not migrate to Capacitor 8 merely to fix these defects;
- do not run destructive dependency upgrades such as `npm audit fix --force`;
- do not replace compiled product behavior with mock UI;
- do not silently remove features;
- do not patch generated bundles without updating the patch generator and tests;
- prefer a durable source/runtime integration over accumulating brittle optional string replacements.

---

## 12. Patch-System Rules

The wrapper currently relies on exact-string transformations against minified files. Optional replacements can silently become no-ops when upstream assets change.

For every patch:

- identify the source asset and expected hash/pattern;
- make required replacements fail loudly when the feature depends on them;
- report counts of replacements;
- prove idempotence;
- verify the final packaged `www/`, not only the source script;
- avoid matching overly broad minified fragments;
- add a semantic/runtime assertion where possible.

If a feature can be implemented cleanly through an injected authored module or stable public interface, prefer that over a fragile minified replacement.

---

## 13. Device Test Matrix to Ask the User

When the user is ready, collect `WORKING`, `BROKEN`, or a short description for:

1. Notification panel opens from the bell.
2. Panel remains completely inside the viewport.
3. Long notification list scrolls internally.
4. Device image applies as Focus background.
5. Device background persists after force-close/restart.
6. Blur/dim/position controls affect the device image.
7. Settings label says `Notifications`.
8. Create Group is visible.
9. Create Group successfully creates and opens a group.
10. Join with Code is visible.
11. Invite code/link successfully joins and opens a group.
12. Group tour appears only when appropriate.
13. Global leaderboard shows finite correct values.
14. Daily/weekly/monthly/all-time periods show correct data.
15. Group leaderboard shows correct points/ranking.
16. Group chat loads and sends.
17. Member list loads real members.
18. Invite generation works.
19. Group icon upload works and persists.
20. Community Events route is intentionally hidden or working as expected.
21. Floating Timer opens with correct visual layout.
22. Floating Timer buttons update the real Focus session.
23. Focus-type emojis render correctly in the app and overlay.
24. Login survives app restart.
25. APK Settings/About shows exact build version and SHA.

Also request:

- installed versionName/versionCode if visible;
- APK installation date;
- whether app data was cleared before install;
- screenshots or screen recording for visual defects;
- exact toast/error text for failed Supabase actions.

---

## 14. Completion Gates

A feature is not complete until the applicable gates pass:

1. code review complete;
2. targeted unit/runtime test passes;
3. full `npm test` passes;
4. `npm run build` passes;
5. Gradle APK build passes;
6. packaged assets contain intended implementation;
7. GitHub Actions succeeds;
8. artifact identity is unambiguous;
9. user tests the new APK on device;
10. `.agent/` state records are updated honestly.

Use labels such as:

- `CODE OBSERVED`
- `UNIT TESTED`
- `BUILD VERIFIED`
- `DEVICE VERIFIED`

Never write `DONE` when only static tests passed.

---

## 15. Persistent Notes Policy

At the end of every Replit work session:

- update `.agent/CURRENT_STATE.md`;
- update `.agent/NEXT_TASKS.md`;
- update `.agent/TEST_STATUS.md`;
- update `.agent/KNOWN_ISSUES.md` if a failed approach was discovered;
- update `.agent/DECISIONS.md` for architectural or schema decisions;
- update this file only when the durable codebase map or runtime truth changes;
- commit and push the context updates with the implementation checkpoint.

Do not erase prior evidence. Correct it explicitly and state what new evidence superseded it.
