#!/usr/bin/env node
import { createScriptBackupManager, loadEnv, parseArgs } from './storage-backup-lib.mjs';

const args = parseArgs();
const userId = args.user || '3f56d64e-b1c5-45d6-9ba3-4e204f6bc9df';
const apply = args.apply === true;

const env = loadEnv();
const manager = createScriptBackupManager(env);
const jwt = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY;

const emptyLocalBackup = {
  version: 1,
  source: 'isotopeai',
  exportedAt: new Date().toISOString(),
  appVersion: 'proof',
  data: {
    profile: { proof: true },
    timerState: null,
    tasks: [],
    sessions: [],
    subjects: [],
    habits: [],
    dailyLogs: [],
    tests: [],
    exams: [],
    mockTests: [],
  },
};

const best = await manager.findBestCloudBackup(userId, jwt, { includeRaw: true });
console.log('best_selected=' + JSON.stringify(best.selected, null, 2));

if (!best.selected || !best.selected.rich) {
  console.error('FAIL expected a rich cloud backup to exist');
  process.exit(2);
}

const normalizedEmpty = manager.normalizeAnyBackup(emptyLocalBackup, { source_path: 'proof-empty-local' });
let blocked = false;
try {
  manager.assertNoEmptyOverwrite(normalizedEmpty, best);
} catch (error) {
  blocked = error.code === 'BLOCKED_EMPTY_OVERWRITE';
  console.log('empty_overwrite_guard=' + JSON.stringify(error.payload || { code: error.code, message: error.message }, null, 2));
}

if (!blocked) {
  console.error('FAIL empty local backup was not blocked');
  process.exit(3);
}

console.log('empty_overwrite_blocked=true');

if (!apply) {
  console.log('DRY_RUN restore promotion not applied. Re-run with --apply to promote selected backup to canonical paths.');
  process.exit(0);
}

const restored = await manager.restoreBestBackup(userId, jwt, { promote: true });
console.log('restore_best=' + JSON.stringify({
  selected: restored.selected,
  backup_hash: restored.backup_hash,
  collection_counts: restored.collection_counts,
  promoted: restored.promoted && {
    latest_path: restored.promoted.latest_path,
    history_path: restored.promoted.history_path,
    cloud_snapshot_path: restored.promoted.cloud_snapshot_path,
    hash: restored.promoted.hash,
    collection_counts: restored.promoted.collection_counts,
  },
}, null, 2));

if (!restored.promoted || restored.promoted.collection_counts.tasks <= 0 || restored.promoted.collection_counts.sessions <= 0 || restored.promoted.collection_counts.subjects <= 0) {
  console.error('FAIL promoted backup did not preserve rich counts');
  process.exit(4);
}

console.log('PASS new-browser restore server proof passed');
