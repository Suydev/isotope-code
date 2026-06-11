#!/usr/bin/env node
import { createScriptBackupManager, loadEnv, parseArgs, printCandidate } from './storage-backup-lib.mjs';

const DEFAULT_USER = '3f56d64e-b1c5-45d6-9ba3-4e204f6bc9df';
const args = parseArgs();
const userId = args.user || DEFAULT_USER;
const apply = args.apply === true;
const dryRun = !apply;

if (!/^[0-9a-f-]{36}$/i.test(userId)) {
  console.error('FAIL invalid --user UUID');
  process.exit(1);
}

const env = loadEnv();
const manager = createScriptBackupManager(env);
const userJwt = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY;

console.log(`user=${userId}`);
console.log(`mode=${dryRun ? 'dry-run' : 'apply'}`);

const before = await manager.findBestCloudBackup(userId, userJwt, { includeRaw: true });
console.log('selected_before=');
if (before.selected) printCandidate(before.selected);
else console.log('null');

console.log('candidates=');
for (const candidate of before.candidates) printCandidate(candidate);

if (!before.selected_internal || !before.selected_internal.valid) {
  console.error('FAIL no valid backup candidate selected');
  process.exit(2);
}

console.log('planned_writes=' + JSON.stringify([
  `${userId}/backups/latest.json`,
  `${userId}/backups/history/{timestamp}-{hash}.json`,
  `${userId}/cloud-snapshot/latest.json`,
]));

if (dryRun) {
  console.log('DRY_RUN no writes performed');
  process.exit(0);
}

const promoted = await manager.writeCanonicalBackup(userId, userJwt, before.selected_internal.normalized, {
  source: 'script_repair',
  source_path: before.selected_internal.path,
});

console.log('promoted=' + JSON.stringify({
  latest_path: promoted.latest_path,
  history_path: promoted.history_path,
  cloud_snapshot_path: promoted.cloud_snapshot_path,
  hash: promoted.hash,
  size_bytes: promoted.size_bytes,
  collection_counts: promoted.collection_counts,
}));

const after = await manager.findBestCloudBackup(userId, userJwt);
console.log('selected_after=');
if (after.selected) printCandidate(after.selected);
else console.log('null');
