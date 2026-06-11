#!/usr/bin/env node
import { createScriptBackupManager, loadEnv, parseArgs } from './storage-backup-lib.mjs';

const args = parseArgs();
const userId = args.user || '3f56d64e-b1c5-45d6-9ba3-4e204f6bc9df';
const apply = args.apply === true;

if (!/^[0-9a-f-]{36}$/i.test(userId)) {
  console.error('FAIL invalid --user UUID');
  process.exit(1);
}

const env = loadEnv();
const manager = createScriptBackupManager(env);
const jwt = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY;

const result = apply
  ? await manager.cleanupApply(userId, jwt)
  : await manager.cleanupPreview(userId, jwt);

console.log(JSON.stringify({
  user_id: userId,
  dry_run: !apply,
  selected: result.selected,
  bytes_freed: result.bytes_freed,
  deleted_count: result.deleted_count || 0,
}, null, 2));

for (const decision of result.decisions || []) {
  console.log(JSON.stringify(decision));
}
