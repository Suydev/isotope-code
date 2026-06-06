# Changelog — IsotopeAI

  ## v3.1.3 — 2026-06-06
  **Author:** suydev

  ### Auth — JWT capture & refresh
  - Added `localStorage.setItem` interceptor: fires on every Supabase session write, deep-scans the value for a JWT-shaped string, stores it in `isotope-last-jwt` / `isotope-last-rt` regardless of key name or format
  - Added startup scan: on page load, retroactively captures any pre-existing session from all `sb-*-auth-token` keys into `isotope-last-jwt`
  - Added `_deepFindJwt()` + `_deepFindRefreshToken()`: recursive object scanners that find JWTs regardless of nesting depth or format — immune to Supabase JS version changes
  - `parseSessionToken()` now uses `_deepFindJwt()` — handles all formats without fragile key paths
  - `currentJwt()` now has 4-priority fallback chain: interceptor cache → Supabase key → isotope key → full localStorage scan
  - `_getRefreshToken()` same 4-priority chain using `_deepFindRefreshToken()`
  - Added `getValidJwt()`: auto-refreshes expired tokens (120s buffer), falls back to stale token
  - Added `forceRefreshJwt()`: force-refresh on 401, retried by `authedJson()`
  - Injected `SUPA_URL_BASE` + `SUPA_ANON` into client IIFE for direct Supabase token refresh

  ### Session persistence
  - `syncProfileAfterLogin()` caches bootstrap result to `isotope-bootstrap-cache`
  - On 5xx / network error (server restart / offline PWA): falls back to `isotope-bootstrap-cache`
  - On 401: auto-refreshes token and retries bootstrap before surfacing error

  ### Supabase Storage
  - Added `ensureStorageBuckets()`: runs at startup, creates `user-content`, `avatars`, `notes` buckets if missing (idempotent)
  - SQL PATCH v12 (`community-patch-v4.sql`): bucket INSERTs + per-user RLS policies on `storage.objects`

  ### Backup & Sync
  - `applyBackupProfileToSupabase()`: smart onboarding auto-detect — if backup has real data (tasks/sessions/subjects > 0) forces `isOnboarded: true` even when exported flag is false
  - Full backup format (`version:1, source:"isotopeai"`) round-trips all collections: tasks, sessions, subjects, habits, dailyLogs, tests, exams, mockTests, timerState

  ### Observability
  - Sync history panel (DOM-injected, MutationObserver, 3s auto-refresh)
  - `writeSyncHistory()` / `writeSyncMetadata()` — 25-entry rolling log
  - Admin verify: Auth Pipeline Smoke Tests + Live Browser Diagnostics
  - `window.__isoGetSyncHistory` / `window.__isoGetSyncMetadata` for console debugging

  ## v3.1.2 — (previous)
  - Initial Replit deployment with server-side Supabase integration
  - Admin patch system with community-patch-v4.sql
  