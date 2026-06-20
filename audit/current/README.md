# Current file audit

Schema: 1
Worktree fingerprint: 63dc68cbd5705156e546470d88c0d59f33ca849755d19d83a0d6bca9fb0c8d0c
Audited files: 433
Git-tracked non-audit files: 433
Untracked non-audit files: 0
Excluded sensitive paths: 0
Active/reachable files: 254

## Classification

- authored:configuration: 25
- authored:database: 11
- authored:documentation: 23
- authored:runtime: 20
- authored:source: 64
- authored:static-asset: 46
- authored:tooling: 31
- generated:bundle: 155
- generated:bundle-asset: 51
- generated:bundle-wrapper: 6
- generated:dependency-lock: 1

## Risk signals

- connection.hardcoded_localhost: 45
- connection.online_state_listener: 24
- connection.persistent_channel: 51
- connection.reconnect_loop: 17
- injection.inner_html: 95
- network.fetch: 126
- network.http_client: 12
- network.supabase_client: 63
- network.websocket: 24
- secrets.identifiers: 55
- sql.rls: 370
- sql.statements: 4670
- storage.cache_api: 69
- storage.filesystem: 21
- storage.web: 459
- timers.interval: 33
- timers.timeout: 237

## Safety and interpretation

- This directory is the reproducible source of truth for the current worktree; older per-file reports under `audit/` are historical snapshots and may be stale.
- The audit contains hashes, sizes, classifications, paths, graph edges, and signal counts only.
- It never stores source snippets, environment values, matched secret values, or file contents.
- `generated:bundle-wrapper` is intentionally distinct from full generated bundles.
- `active` means reachable from a declared runtime, build, workflow, or tool entrypoint through detected static references.
- Regenerate with `node scripts/generate-current-audit.mjs`.
- Verify freshness with `node scripts/verify-current-audit.mjs`.
