# Storage Backup System

## Buckets

- `user-content`: private backups, imports, exports, cloud snapshots, user files.
- `avatars`: public profile avatars, user-owned write paths.
- `notes`: private notes and documents.

## Backup Selection

`server/backup-manager.mjs` inspects:

- `backups/latest.json`
- `cloud-snapshot/latest.json`
- `imports/latest.json`
- `exports/latest.json`
- newest backup history files
- newest import/export archives
- newest cloud snapshot history files

Selection rule:

- Rich beats empty, even when older.
- If both are rich, newest meaningful data timestamp wins.
- If both are empty, newest wins.

## Cleanup

Cleanup is preview-first:

- `/__auth/storage/cleanup-preview`
- `/__auth/storage/cleanup-apply` with `confirm:true`
- `/__admin/storage`

Protected paths:

- `{userId}/backups/latest.json`
- `{userId}/cloud-snapshot/latest.json`
- selected best backup

The preview reports action, reason, size, hash, path, and bytes freed.

Current limitation:

- Backup cleanup is implemented.
- Avatar duplicate cleanup still needs a separate avatar-aware pass.
