# Isotope Sync Proof Checklist

Status: `PROVEN 6/6`

Proof date: 2026-06-07
Local server: `http://127.0.0.1:5000`
Browser: Android Chrome launched through the local browser proof page
Proof run: `c3621f00-a8b0-48b6-a8af-5e19089ac622`
Proof marker: `browser-proof-1780818061833`
Authenticated email: `skibidi@isotope.local`
Authenticated Supabase Auth user id: `9ee916ef-57f9-49de-8515-c072f1d91fde`

Note: an older diagnostic JWT referenced `f9159d28-892e-46c4-ac2e-9e88ef79c4d6`.
That Auth user no longer exists (`/auth/v1/admin/users/f9159d28-892e-46c4-ac2e-9e88ef79c4d6` returned 404), and the current magic-link login for `skibidi@isotope.local` resolves to `9ee916ef-57f9-49de-8515-c072f1d91fde`.

Proof rule: a feature is `PROVEN` only after this chain passes:

Browser action -> real Supabase DB/storage mutation -> browser storage/cache cleared -> session restored/login -> UI/bootstrap data restored from Supabase.

The proof run cleared `localStorage`, `sessionStorage`, Cache Storage, and the local IndexedDB database between mutation and restore checks.

## 1. Onboarding

Result: `PROVEN`

Evidence:
- Browser posted onboarding completion through `/__auth/profile`.
- Supabase `public.user_onboarding.completed` became `true`.
- Browser storage/cache was cleared.
- `/__auth/bootstrap` restored `onboarding.completed=true`; onboarding did not repeat.

Browser proof line:
`onboarding row completed and cache-clear bootstrap did not repeat onboarding`

## 2. Profile / Settings

Result: `PROVEN`

Evidence:
- Browser changed profile/settings with proof marker `browser-proof-1780818061833-settings`.
- Supabase `public.user_profiles.profile_data` changed before/after.
- Browser storage/cache was cleared.
- `/__auth/bootstrap` restored the same `profile_data.proof_marker`.

Browser proof line:
`profile/settings diff persisted and restored from bootstrap`

## 3. Avatar

Result: `PROVEN`

Evidence:
- Browser uploaded a PNG avatar through `/__auth/profile`.
- Supabase Storage `avatars` object was fetchable through the local `/__supa/storage/v1/object/public/avatars/...` proxy.
- `public.user_profiles.profile_data` stored both `avatar_path` and an avatar URL/value.
- Browser storage/cache was cleared.
- `/__auth/bootstrap` restored the same `avatar_path`.

Browser proof line:
`avatar object exists and profile avatar restored`

## 4. Tour

Result: `PROVEN`

Evidence:
- Browser saved `profile_data.tours.community_group_v1=true`.
- Supabase `public.user_profiles.profile_data.tours.community_group_v1` read back as `true`.
- Browser storage/cache was cleared.
- `/__auth/bootstrap` restored the tour flag; the tour should not repeat.

Browser proof line:
`community_group_v1 tour persisted and restored`

## 5. Study Session

Result: `PROVEN`

Evidence:
- Browser called the real Supabase RPC `finish_session_sync` with a browser-generated UUID session id and user JWT.
- Supabase `public.study_sessions_log` contained the proof session row.
- Supabase `public.daily_user_stats.seconds_studied` increased.
- Supabase `public.user_stats_summary` showed session totals.
- Browser then posted `/__auth/snapshot`, cleared storage/cache, restored session, and `/__auth/bootstrap` returned the proof session in `study_sessions_log`.

Browser proof line:
`study session wrote session/daily/summary tables and restored after cache clear`

## 6. Sync Status

Result: `PROVEN`

Evidence:
- Browser posted a valid backup to `/__auth/backup`; response included snapshot storage success.
- Browser posted the same backup with an invalid bearer token; `/__auth/backup` returned HTTP 401 with `code="AUTH_REQUIRED"` and did not fake success.
- Browser dispatched offline mode after loading `pwa-local.js`; the page showed `Offline mode` and `Browser network is offline`.

Browser proof line:
`sync success, auth failure, and offline browser state verified`

## Final Browser Result

The real browser proof completed successfully:

```json
{
  "status": "complete",
  "ok": true,
  "result_count": 7,
  "manual_browser_proof": "6/6"
}
```
