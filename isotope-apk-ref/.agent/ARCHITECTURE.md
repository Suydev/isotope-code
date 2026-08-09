# IsotopeAI Android — Architecture

Last updated: 2026-07-01

---

## System Layers

```
┌─────────────────────────────────────────────────────┐
│                   USER INTERFACE                     │
│   Pre-compiled React/Vite app in www/assets/         │
│   Entry: index-BPYJFSVW.js → App-pJGjDiPw.js        │
│   ⚠️  src/App.tsx is a PLACEHOLDER — not the real UI │
└─────────────────┬───────────────────────────────────┘
                  │ fetch() calls
┌─────────────────▼───────────────────────────────────┐
│               ANDROID BRIDGE LAYER                   │
│   android-bridge.js (injected as first <script>)     │
│   Intercepts: /__auth/*, /__supa/*, /api/*           │
│   Runs in: Capacitor WebView (window.fetch override) │
└─────────────────┬───────────────────────────────────┘
                  │
      ┌───────────┴───────────┐
      │                       │
┌─────▼──────────┐    ┌───────▼──────────────────────┐
│  LOCAL STORAGE │    │      SUPABASE DIRECT           │
│  IndexedDB:    │    │  Auth: /auth/v1/token          │
│   isotope_main │    │  REST: /rest/v1/{table}        │
│  Stores:       │    │  Storage: /storage/v1/object   │
│   tasks        │    │  Realtime: ws channels          │
│   sessions     │    │  Functions: /functions/v1/     │
│   subjects     │    │                                │
│   habits       │    │  Project: vteqquoqvksshmfhuepu │
│   dailyLogs    │    └───────────────────────────────┘
│   tests        │
│   exams        │
│   mockTests    │
│   userProfile  │
│   timerState   │
│   syncMetadata │
│   migrationMeta│
│   kv           │
└────────────────┘
```

---

## Capacitor Native Layer

```
┌─────────────────────────────────────────────────────┐
│             CAPACITOR ANDROID SHELL                  │
│   appId: in.isotopeai.app                           │
│   webDir: www/                                       │
│   androidScheme: https                               │
│   Activity: in.isotopeai.app.MainActivity            │
│   JS interface: window.IsotopeAndroid                │
│   Service: in.isotopeai.app.FloatingTimerService     │
│                                                      │
│   Plugins:                                           │
│   @capacitor/local-notifications — Timer alerts      │
│   @capacitor/filesystem — JSON export/import         │
│   @capacitor/network — Online/offline detection      │
│   @capacitor/preferences — Native key-value store    │
│   @capacitor/share — Share backup files              │
│   @capacitor/status-bar — Dark status bar            │
│   @capacitor/splash-screen — Launch screen           │
└─────────────────────────────────────────────────────┘
```

---

## Android Floating Timer Layer

```
Focus-BmgY-9vP.js
  └─ patched PiP button calls window.__isoOpenFloatingTimer({
       getState, subscribe, dispatch
     })
       │
       ▼
android-floating-timer-bridge.js
  ├─ validates timer state
  ├─ normalizes focus-type emoji safely
  ├─ sends JSON snapshots to window.IsotopeAndroid
  └─ receives native actions through window.__ISO_FLOATING_TIMER__
       │
       ▼
MainActivity.java
  ├─ checks/request Display-over-other-apps permission
  ├─ starts/updates/stops FloatingTimerService
  └─ queues native actions until WebView handler confirms success
       │
       ▼
FloatingTimerService.java
  ├─ WindowManager TYPE_APPLICATION_OVERLAY
  ├─ foreground service notification
  ├─ transparent outside window + rounded draggable card
  ├─ native timestamp-based timer display
  └─ Correct / Incorrect / Skip / Undo / Target / Expand / Close actions
```

System Picture-in-Picture is not the primary timer implementation. It remains only as a reduced fallback exposed by `MainActivity.enterReducedSystemPictureInPicture(...)` when a future caller explicitly chooses it.

---

## Former server.mjs Endpoint → Mobile Replacement Map

| Existing endpoint | Consumer in UI | Mobile replacement | Status |
|-------------------|---------------|--------------------|--------|
| `/__auth/login` | auth-bridge.js `login()` | android-bridge.js `handleLogin()` → Supabase `/auth/v1/token` | ✅ DONE |
| `/__auth/signup` | auth-bridge.js `signUp()` | android-bridge.js `handleSignup()` → Supabase `/auth/v1/signup` | ✅ DONE |
| `/__auth/check` | Auth signup pre-check | Neutral non-destructive response; never calls signup | ✅ DONE |
| `/__auth/bootstrap` | restore-and-launch.js | android-bridge.js `handleBootstrap()` → Supabase REST | ✅ DONE |
| `/__auth/profile` GET | auth-bridge.js, SettingsLayout | android-bridge.js `handleGetProfile()` → Supabase REST | ✅ DONE |
| `/__auth/profile` POST | `__isoPostProfile()` | android-bridge.js `handlePostProfile()` → read existing `profile_data`, deep-merge, verified upsert; persist completed onboarding when applicable | ✅ UNIT TESTED |
| `/__auth/backup` POST | `__isoUploadBackupJSON()` | Canonical Supabase Storage upload + empty-over-rich block + cleanup | ✅ UNIT TESTED |
| `/__auth/backup/latest` GET | `downloadBackupPayload()` | Best valid Storage candidate returned as `backup_json` | ✅ UNIT TESTED |
| `/__auth/backup/best` GET | auth-bridge.js | Storage scan across canonical/import/export candidates | ✅ UNIT TESTED |
| `/__auth/snapshot` POST | `__isoRefreshCloudSnapshot()` | Local adapter backup → canonical Storage upload; visible 503 if adapter missing | ✅ UNIT TESTED |
| `/__auth/import` POST | SettingsLayout import | Import archive + canonical promotion + browser restore metadata | ✅ UNIT TESTED |
| `/__auth/restore-best-backup` POST | AppAccessGate | Richest valid backup returned/promoted for local restore | ✅ UNIT TESTED |
| `/__supa/*` | Various Supabase calls | android-bridge.js `handleSupaProxy()` → direct fetch | ✅ DONE |
| `/api/version` | pwa-local.js server check | android-bridge.js static response | ✅ DONE |
| `/api/health` | Health monitoring | android-bridge.js static response | ✅ DONE |
| `/api/ai-config` | AI feature gate | android-bridge.js static response `{enabled:false}` | ✅ DONE |
| `/__isotope/ping` | Connectivity check | android-bridge.js static pong | ✅ DONE |
| `/__ai/*` | AI proxy (removed in v3.3.4) | Not needed — endpoint returns 404 upstream | ✅ N/A |
| `/api/community-events` | Events (removed v3.0) | Not needed — endpoint returns 404 upstream | ✅ N/A |
| `/__admin/*` | Admin only | NOT included in APK | ✅ EXCLUDED |

---

## Data Flow: Focus Session

```
User starts timer
     │
     ▼
useFocusStore (Zustand)
     │ persist every 30s
     ▼
IndexedDB: kv store, key="timerState"
     │ (+ localStorage shadow: __isotope_kv_shadow__:timerState)
     │
User completes session
     │
     ▼
sessions store ← saved to IndexedDB
     │
     ▼
sessionSync-mloIEnTd.js
     │
     ├─→ finish_session_sync RPC (Supabase, via /__supa/functions/v1/finish-session)
     │     params: p_session_id, p_action, p_duration_minutes, p_group_id,
     │             p_session_type, p_notes, p_ended_at
     │
     └─→ Pending queue (localStorage: isotope:pending_session_sync)
           retries on next online event, max 7 days
```

---

## Data Flow: Backup & Restore

```
Local data (IndexedDB)
     │ buildBackupPayloadFromLocal()
     ▼
canonical backup JSON:
  { version:1, source:"isotopeai", exportedAt, appVersion, data:{
      profile, timerState, tasks[], sessions[], subjects[],
      habits[], dailyLogs[], tests[], exams[], mockTests[] }}
     │
     ├─→ Upload: POST /__auth/backup → Supabase Storage
     │     bucket: user-content
     │     path: {userId}/backups/latest.json
     │     also: {userId}/backups/history/{ts}-{hash}.json
     │
     └─→ BLOCKED_EMPTY_OVERWRITE guard:
           if local is empty AND cloud is "rich" → block upload
           force restore first
```

---

## Android WebView Render Recovery

```
Android activity resumes / app returns foreground
     │
     ▼
MainActivity.onResume()
  ├─ installIsotopeAndroidBridge()
  ├─ webView.onResume()
  ├─ webView.resumeTimers()
  ├─ webView.invalidate()
  └─ evaluateJavascript("__isoAndroidForceRepaint(...)")
     │
     ▼
android-bridge.js
  ├─ dispatches isotope:android-resume
  ├─ temporarily forces a body repaint
  ├─ installs Android-only stable render CSS
  └─ reloads only if #root is truly blank after resume
```

The Analytics compatibility patch also disables Android Sentry/replay startup, disables chart animations on Android, and caps rendered Session Log rows to reduce WebView compositor pressure. This is code/unit tested only; device evidence is still required.

---

## www/ Directory Structure

```
www/
├── index.html                    ← Patched: android-bridge.js injected first
├── android-bridge.js             ← Fetch interceptor (injected by prepare-www.js)
├── android-floating-timer-bridge.js ← Floating Timer + emoji repair bridge
├── auth-bridge.js                ← Supabase auth client (login/signup/bootstrap)
├── restore-and-launch.js         ← App boot sequence (reads __ISO_SUPA_URL__)
├── boot-recovery.js              ← Clears caches on JS chunk load failure
├── pwa-local.js                  ← Server-check (intercepted by bridge)
├── sw.js                         ← Service worker (replaced with no-op)
├── ux-setup.js                   ← UI setup helpers
├── focus-bg-import.js            ← Focus background import
├── sync/
│   ├── backup-normalizer.js      ← Backup format, BLOCKED_EMPTY_OVERWRITE
│   └── local-data-adapter.js     ← IndexedDB read/write adapter
├── assets/
│   ├── index-BPYJFSVW.js         ← ACTIVE entry point (loads App bundle)
│   ├── App-pJGjDiPw.js           ← ACTIVE main React app bundle (342KB)
│   ├── AppAccessGate-B975UtK7.js ← Startup gate, data migration
│   ├── index-CrO6t5EW.css        ← Main styles (417KB)
│   ├── vendor-react-BfU3Zn2J.js  ← React runtime
│   ├── vendor-supabase-DAiUAuun.js ← Supabase client
│   ├── sessionSync-mloIEnTd.js   ← Session → Supabase sync
│   ├── useFocusStore-CX_Nyp1h.js ← Timer store
│   └── ... (207 more chunks)
├── sounds/
│   ├── rain.wav                  ← 14.8MB — should convert to OGG
│   ├── wind.wav                  ← 17.1MB — should convert to OGG
│   └── crickets.wav              ← 11.9MB — should convert to OGG
└── fonts/
    ├── fonts.css                 ← Self-hosted, no Google CDN
    └── *.woff2                   ← Atkinson Hyperlegible, Inter
```

---

## Boot Sequence (Android)

```
1. android-bridge.js loads (FIRST script, sync, sets window.__ISO_SUPA_URL__)
2. auth-bridge.js?v=5 loads (sync — Supabase auth client)
3. boot-recovery.js (defer — error handler)
4. ux-setup.js (defer)
5. sync/backup-normalizer.js (module)
6. sync/local-data-adapter.js (module)
7. restore-and-launch.js (module) ← reads window.__ISO_SUPA_URL__
   └─ checks localStorage for session tokens (5 keys checked in order)
   └─ opens IndexedDB (isotope_main, version 20)
   └─ queries Supabase: user_onboarding + user_profiles
   └─ sets window.__ISO_BOOT_STATE__
   └─ routes to: /auth | /onboarding | /dashboard
8. pwa-local.js and update-checker.js are disabled in Android packaging.
9. Compiled `PWAManager` is patched out when `window.__ISO_IS_ANDROID__` is true.
10. Capacitor Network updates `window.__ISO_ANDROID_ONLINE__` and dispatches `isotope:network`.
11. MainActivity exposes Floating Timer overlay methods through `window.IsotopeAndroid`; reduced system PiP remains fallback only.
```

During Android login, `auth-bridge.js` writes the Supabase session into `localStorage`.
The compiled Supabase client normally reads the app's IndexedDB-backed storage adapter,
so `scripts/apply-android-patches.js` patches that adapter to fall back to the
bridge-written `localStorage` session keys on Android. Without this compatibility
layer, `initializeAuth()` can reset a successfully logged-in user back to auth UI.

After successful native login, the Auth bundle patch also refreshes
`window.__ISO_BOOT_STATE__` from the verified bootstrap response before it routes.
AppAccessGate is patched to honor `readyLoggedOut` only when the auth store is not
authenticated, and its storage cleanup set excludes Android auth-session keys. This
prevents the startup no-session boot snapshot from sending a successfully logged-in
Android user back to `/auth`.

## Android Native Bridge Globals

`android-bridge.js` exposes native-only helpers used by patched bundles:

| Global | Purpose |
|---|---|
| `window.__isoLogin(email, password)` | Active Android login implementation; returns session + bootstrap. |
| `window.__isoUp(email, password)` | Active Android signup implementation. |
| `window.__isoScheduleNativeNotification(payload)` | Schedules Capacitor LocalNotifications by absolute timestamp. |
| `window.__isoCancelNativeNotification(id)` | Cancels a scheduled native notification. |
| `window.__isoScheduleFocusTimer(payload)` | Schedules the focus-completion notification and routes taps to `/focus`. |
| `window.__isoCancelFocusTimer()` | Cancels the focus-completion notification on pause/reset/complete. |
| `window.__isoEnsureNotificationPermission(opts)` | Creates the channel and requests/checks Android notification permission. |
| `window.__isoIsOnline()` | Returns Capacitor Network backed Android online state; patched `useOnlineStatus` consumes this. |
| `window.__isoOpenFloatingTimer(payload)` | Opens the Android Floating Timer overlay through `IsotopeAndroid.startFloatingTimer`. |
| `window.__ISO_FLOATING_TIMER__.handleNativeAction(action)` | Replays queued native overlay actions into the real focus store. |
| `window.__isoEnterFocusPip(payload)` | Reduced system-PiP fallback only when overlay permission is unavailable. |
| `window.__isoAndroidPipSupported()` | Reports reduced native PiP fallback support from `MainActivity`. |

## Android Native Resource Contracts

The committed Android project is production code. CI must sync it, not recreate it.

| File | Contract |
|---|---|
| `android/app/src/main/java/in/isotopeai/app/MainActivity.java` | Installs `window.IsotopeAndroid`, supports Floating Timer overlay permission/service control/action replay, and reduced PiP fallback. |
| `android/app/src/main/AndroidManifest.xml` | Activity has `supportsPictureInPicture`, `resizeableActivity`, and `windowSoftInputMode="adjustResize"`. |
| `android/app/src/main/res/drawable/ic_notification.xml` | Small white notification icon used by LocalNotifications. |
| `android/app/src/main/res/drawable-v24/ic_launcher_foreground.xml` | Isotope logo foreground, not default Android asset. |
| `android/app/src/main/res/values/ic_launcher_background.xml` | Dark isotope launcher background. |
| `capacitor.config.json` | LocalNotifications `smallIcon` is `ic_notification`; no nonexistent custom sound. |

## Android Sync / Supabase Contract

The APK has no Node server. `android-bridge.js` replaces the server endpoints that the compiled UI expects.

| Compiled call | Android bridge behavior |
|---|---|
| `/__supa/functions/v1/finish-session` or `${SUPA_URL}/functions/v1/finish-session` | Maps to `POST /rest/v1/rpc/finish_session_sync` with `p_session_id`, `p_action`, `p_duration_minutes`, `p_group_id`, `p_session_type`, `p_notes`, `p_ended_at`; then uploads a canonical local snapshot when the local adapter is available. |
| `/__supa/functions/v1/get-leaderboard` or direct Supabase function URL | Maps to `POST /rest/v1/rpc/get_leaderboard` with `p_period`, `p_limit`, `p_offset`. |
| `/__supa/functions/v1/get-daily-leaderboard` or direct Supabase function URL | Maps to `get_leaderboard` with `p_period:"daily"`; there is no `get_daily_leaderboard` SQL function in `isotope-complete.sql`. |
| `/__supa/functions/v1/get-group-leaderboard` or direct Supabase function URL | Maps `groupId/group_id` to `get_group_leaderboard(p_group_id,p_limit)`. |
| `/__supa/functions/v1/get-group-analytics` or direct Supabase function URL | Maps `groupId/group_id` and `days` to `get_group_analytics_from_snapshots(p_group_id,p_days)`. |
| `/__auth/backup` | Writes canonical Supabase Storage objects and blocks empty local-over-rich cloud overwrite. |
| `/__auth/backup/latest` / `/__auth/backup/best` / `/__auth/restore-best-backup` | Selects the richest valid cloud candidate and returns `backup_json`, `selected_backup`, candidates, counts, and restore metadata. |
| `/__auth/import` | Archives the import under `userId/imports/`, promotes it to canonical backup/cloud snapshot, and returns browser restore metadata. |
| `/__auth/snapshot` | Builds backup JSON from `window.IsotopeLocalDataAdapter` when available and uploads canonical backup/cloud snapshot; returns a visible 503 instead of fake success if the adapter is unavailable. |
| `/__auth/storage/cleanup-preview` / `/__auth/storage/cleanup-apply` | Scans/deletes only current-user stale `.json` archive files using the user's JWT. |

Storage canonical paths:

| Path | Purpose |
|---|---|
| `userId/backups/latest.json` | Authoritative latest local backup payload. |
| `userId/backups/history/*.json` | Timestamped backup history, keep latest 5. |
| `userId/cloud-snapshot/latest.json` | Bootstrap/restore cloud snapshot mirror. |
| `userId/imports/latest.json` and `userId/imports/*.json` | Manual import archive. |
| `userId/exports/latest.json` and `userId/exports/*.json` | Legacy/export candidates scanned for restore. |

All Supabase Storage calls use the user access token and anon/publishable key. The APK must never include a service-role key.

## Bootstrap Response Contract

Android `/__auth/bootstrap` must match the server contract consumed by `restore-and-launch.js`:

```js
{
  ok: true,
  user_id,
  session,
  user,
  profile,              // normalized object for UI compatibility
  profile_data,         // raw user_profiles.profile_data object
  profile_updated_at,
  onboarding: {
    state: "completed" | "incomplete" | "legacy_migrated",
    completed: boolean,
    completed_at: string | null,
    data: object
  },
  onboarding_completed,
  settings,
  tours,
  stats_summary,
  daily_user_stats: [],
  study_sessions_log: [],
  cloud_snapshot,
  best_backup,
  backup_candidates: [],
  restore_recommended,
  backup_warning,
  fetched_at
}
```

Network failure must not be converted into `onboarding_completed:false`. Unknown onboarding state stays unknown so the UI can retry instead of destroying or overwriting local state.

## Build Provenance

| Item | Value |
|---|---|
| Android branch | `codex/android-production-repair` |
| isotope-code source SHA | `fd39fad1384333ad774f19f35b754659a34dae60` |
| Capacitor core/android/cli | `6.2.1` |
| Android minSdk / compileSdk / targetSdk | `24 / 35 / 35` |
| Gradle wrapper | committed in `android/gradle/wrapper/` |

CI must run `npx cap sync android` against the committed native project. It must not run `npx cap add android` on every build.

---

## IndexedDB Schema

Database: `isotope_main` | Version: 20 (restore-and-launch) or dynamic (App bundle)

| Store | keyPath | Indexes |
|-------|---------|---------|
| tasks | id | subjectId, deletedAt, updatedAt |
| sessions | id | subjectId, taskId, deletedAt, updatedAt |
| subjects | id | deletedAt, updatedAt |
| habits | id | deletedAt, updatedAt |
| dailyLogs | id | date, deletedAt, updatedAt |
| tests | id | deletedAt, updatedAt |
| exams | id | deletedAt, updatedAt |
| mockTests | id | deletedAt, updatedAt |
| userProfile | primary (singleton) | — |
| timerState | current (singleton) | — |
| syncMetadata | — | — |
| migrationMeta | — | — |
| kv | — | — |

---

## Key localStorage Keys

| Key | Contents |
|-----|---------|
| `isotope-auth-token` | Full Supabase session JSON |
| `sb-vteqquoqvksshmfhuepu-auth-token` | Session (Supabase standard format) |
| `isotope-last-jwt` | Just the access_token string |
| `isotope-last-rt` | Just the refresh_token string |
| `isotope-last-session-raw` | Full session JSON (bridge fallback) |
| `isotope-bootstrap-cache` | Bootstrap data + cached_at timestamp |
| `isotope:pending_session_sync` | Array of unsynced session records |
| `isotope_sync_metadata` | Sync status, last_snapshot_at, etc |
| `isotope_cloud_snapshot_{userId}` | Trusted cloud snapshot for offline boot |
| `__isotope_kv_shadow__:timerState` | Timer state localStorage backup |
| `indexeddb_migration_complete_v3` | Migration flag |
| `isotope_schema_version` | "2" |
