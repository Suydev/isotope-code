#!/usr/bin/env node
import fs from 'fs';
import crypto from 'crypto';
import { normalizeAnyBackup } from '../public/sync/backup-normalizer.js';
import { createScriptBackupManager, loadEnv, parseArgs, printCandidate } from './storage-backup-lib.mjs';

const args = parseArgs();

function reportLocal(file) {
  const text = fs.readFileSync(file, 'utf8');
  const hash = crypto.createHash('sha256').update(text).digest('hex');
  const normalized = normalizeAnyBackup(text, { path: file, hash, size_bytes: Buffer.byteLength(text) });
  console.log(JSON.stringify({
    file,
    valid: normalized.valid,
    kind: normalized.kind,
    rich: normalized.rich,
    empty: normalized.empty,
    size_bytes: Buffer.byteLength(text),
    hash,
    exported_at: normalized.exported_at,
    collection_counts: normalized.collection_counts,
    reason: normalized.reason,
  }));
}

const localFiles = process.argv.slice(2).filter((arg) => !arg.startsWith('--') && fs.existsSync(arg));
if (localFiles.length) {
  for (const file of localFiles) reportLocal(file);
  process.exit(0);
}

const userId = args.user || '3f56d64e-b1c5-45d6-9ba3-4e204f6bc9df';
const env = loadEnv();
const manager = createScriptBackupManager(env);
const best = await manager.findBestCloudBackup(userId, env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY);

console.log(`user=${userId}`);
console.log('selected=');
if (best.selected) printCandidate(best.selected);
else console.log('null');
console.log('candidates=');
for (const candidate of best.candidates) printCandidate(candidate);
