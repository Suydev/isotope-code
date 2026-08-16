# IsotopeAI Backup & Restore

`backup.sh` creates full Supabase backups (schema + all DB tables + auth
users + storage) and can restore them into **any** new Supabase project. Every
backup ships with a sha256 sidecar for integrity checking, auto-verifies
against the source project, and restores are verified against the target
*before* any local config is touched.

---

## Requirements

- Node.js (the `scripts/*.mjs` helpers are plain Node, no deps)
- A Supabase **management API token (PAT)** — Project Settings → Access Tokens
- Optionally a **service-role key** (required to back up storage buckets)

## Keys: where they come from

Key resolution order (highest wins):

1. Command-line args (`--supabase-url=`, `--anon-key=`, `--service-key=`, `--pat=`)
2. `.backup_env` — a separate secret file for the *keeper* project (recommended)
3. `.env` — the app's normal config

Anything inherited from the shell environment (e.g. a bashrc that sources
`.env`) is deliberately **ignored**, so the wrong project can never be picked
up by accident.

### Recommended: `.backup_env`

Keep your backup-target keys in a dedicated file next to `.env`:

```bash
# .backup_env  (never commit this file — it is gitignored)
SUPABASE_URL=https://<keeper-project>.supabase.co
SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service-role key>
SUPABASE_ACCESS_TOKEN=<sbp_... management PAT>
DATABASE_URL=postgresql://postgres:<pwd>@db.<ref>.supabase.co:5432/postgres
```

Then backup/restore/verify just work with no arguments. `.backup_env` **and**
`.env` are gitignored — they never end up in the repository.

---

## Commands

### `backup` — create a backup

```bash
./backup.sh backup
./backup.sh backup --out /path/to/dir        # write elsewhere
./backup.sh backup --no-storage              # skip storage buckets
./backup.sh backup --keep 7                  # prune older backups, keep 7 newest
./backup.sh backup --no-verify               # skip the post-backup verification
./backup.sh backup --supabase-url=... --anon-key=... --service-key=... --pat=...
```

What happens:

1. Schema dump (`scripts/schema-dump.mjs`) → `schema.sql`
2. Data dump (`scripts/supabase-backup.mjs`): every user table as JSONL,
   plus `auth.users` (bcrypt hashes included) and all storage objects
3. Manifest validation (all tables present in `fk_order`)
4. Tarball written to `backups/isotope-backup-<timestamp>.tar.gz`,
   `gzip -t` integrity check, sha256 sidecar written
5. **Auto-verify** against the source project — table existence, row counts,
   `auth.users` count, storage buckets/files. The backup is marked DONE only
   if every check passes (add `--no-verify` to skip)

### `restore` — restore into a new project

```bash
./backup.sh restore backups/isotope-backup-20260816-202926.tar.gz
./backup.sh restore <file> --supabase-url=https://new-project.supabase.co \
    --anon-key=<anon> --service-key=<service> --pat=<pat>
./backup.sh restore <file> --no-storage
```

What happens:

1. Extract tarball, check manifest
2. Apply schema (statement-by-statement, idempotent)
3. Restore `auth.users`, then all tables in FK order, then advance sequences
4. Recreate storage buckets and upload files (sha256-verified per file)
5. **Verify the restore against the target** — on any mismatch the restore
   ABORTS *before* touching `.env` and keeps the working data on disk so you
   can inspect it (the error message tells you where)
6. On success: old `.env` is saved next to a fresh one scaffolded with the
   new project's keys (non-project keys are preserved), server restarted

### `verify` — cross-check any backup against any project

```bash
./backup.sh verify backups/isotope-backup-20260816-202926.tar.gz
./backup.sh verify <file> --supabase-url=... --service-key=... --pat=...
```

Exit code 0 = all checks passed. Useful after a restore to prove the target
matches the tarball, or to audition a backup before trusting it.

### `info` — inspect a backup

```bash
./backup.sh info backups/isotope-backup-20260816-202926.tar.gz
```

Shows sha256 sidecar match, gzip integrity, full file list, table/row counts,
auth users, storage files/buckets and manifest notes.

---

## Scheduling backups

```cron
# daily at 03:00, keep the newest 14
0 3 * * * cd /data/data/com.termux/files/home/isotope-code && ./backup.sh backup --keep 14 >> backups/backup.log 2>&1
```

`--keep N` automatically deletes older tarballs (and their `.sha256`
sidecars).

---

## What a backup contains

```
isotope-backup-<ts>.tar.gz
├── schema.sql          # full schema: tables, views, FKs, indexes, functions,
│                       # triggers, RLS policies, grants — no user data
├── manifest.json       # source project, created_at, tables+counts, fk_order,
│                       # storage manifest (sizes + sha256 per file), notes
└── db/
    ├── auth.users.jsonl        # auth users incl. bcrypt hashes
    ├── public.<table>.jsonl    # one file per user table (FK-ordered)
    └── storage/…               # all objects from every bucket
```

Plus `isotope-backup-<ts>.tar.gz.sha256` as an integrity sidecar.

## Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| `SQL HTTP 401: JWT could not be decoded` | PAT is wrong/expired, or points at another account. Fix `.backup_env`/`--pat=`. |
| `signature verification failed` (storage) | service-role key doesn't match the target project — a key from a *different* project. |
| `no valid SUPABASE_SERVICE_ROLE_KEY — storage will NOT be included` | service key missing; storage is skipped with an explicit warning (never silently). |
| `fetch failed` | transient network error — rerun. |
| backup targets the wrong project | shell env leaked `SUPABASE_URL` is ignored by design; set keys via CLI or `.backup_env`/`.env` only. |
| `restore verification FAILED — keeping data at <dir>` | restore incomplete; inspect the kept dir, fix the target DB, re-run. |

## Safety

- `.env`, `.env.*`, `.backup_env` and `backups/` are gitignored. Do not
  commit them, and never paste keys into shell history publicly.
- Restores are non-destructive: rows are inserted with `on conflict do
  nothing`, storage uploads use upsert.
- A failed restore never overwrites `.env` or restarts your server.