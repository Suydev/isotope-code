# Sync System

## Current Source Of Truth

Isotope uses a local-first browser workspace and Supabase Storage backups.

Canonical backup writes now go to:

- `{userId}/backups/latest.json`
- `{userId}/backups/history/{timestamp}-{hash}.json`
- `{userId}/cloud-snapshot/latest.json`

Legacy read-compatible paths:

- `{userId}/imports/latest.json`
- `{userId}/exports/latest.json`
- `{userId}/cloud-snapshot/latest.json`
- timestamped files under `imports/`, `exports/`, and `cloud-snapshot/history/`

## Safety Rule

A local empty workspace must not overwrite a richer cloud backup.

The server checks best cloud backup candidates before uploads. If local data is empty and a rich backup exists, endpoints return:

```json
{
  "ok": false,
  "code": "BLOCKED_EMPTY_OVERWRITE",
  "message": "Cloud has richer backup. Restore first."
}
```

## Browser Restore

The browser adapter is `public/sync/local-data-adapter.js`.

It writes:

- IndexedDB database `isotope_main`
- localStorage fallback keys such as `isotope_tasks_v2`, `isotope_sessions_v2`, `isotope_subjects_v2`
- restore metadata in `isotope_restore_metadata`

After restore it dispatches `isotope:sync_refresh`.

## Manual Sync Flow

1. Check auth.
2. Build local backup.
3. Count local data.
4. Call `/__auth/backup/best`.
5. If local is empty and cloud is rich, call `/__auth/restore-best-backup`.
6. Apply backup to browser local data.
7. Verify restored counts are non-empty.
8. Upload canonical backup.

## Remaining Limitations

- `sync_items` exists as schema but is not yet the runtime queue for every local change.
- Full UI browser automation proof requires a test login/session and browser automation dependency.
