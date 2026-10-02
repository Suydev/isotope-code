#!/usr/bin/env node
/**
 * transfer.mjs — copy an entire Supabase project into another, in one job.
 *
 *   ISO_SRC_PAT / ISO_SRC_REF   the project you are copying FROM
 *   ISO_DST_PAT / ISO_DST_REF   the project you are copying TO
 *   ISO_MODE                    full (default) | schema-only
 *   ISO_NO_STORAGE=1            skip storage objects
 *
 * Why this exists: the console could already `backup` and `restore`, but only as
 * two separate jobs against one project at a time, each needing its own PAT typed
 * and the operator having to know that the tarball from the first step is what the
 * second step consumes. Getting that pairing wrong restores a stale backup into the
 * wrong project, or reports success having moved nothing. Here both PATs are taken
 * together, the tarball is created by this process and consumed by this process, and
 * the summary states what actually moved.
 *
 * Deliberately spawns the existing `supabase-backup.mjs` worker for both halves
 * rather than reimplementing dump/restore: that code is the tested one, and a second
 * copy of the restore path is a second set of bugs.
 *
 * Secrets arrive via env, never argv — argv is world-readable in /proc.
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MGMT = 'https://api.supabase.com';
const PROGRESS_FILE = process.env.ISO_PROGRESS_FILE || null;

const SRC_REF = process.env.ISO_SRC_REF || '';
const DST_REF = process.env.ISO_DST_REF || '';
const SRC_PAT = process.env.ISO_SRC_PAT || '';
const DST_PAT = process.env.ISO_DST_PAT || '';

let seq = 0;
function emit(event) {
  if (!PROGRESS_FILE) return;
  try {
    fs.appendFileSync(PROGRESS_FILE, JSON.stringify({ seq: seq++, t: Date.now(), ...event }) + '\n');
  } catch { /* progress is best-effort */ }
}

function say(msg) {
  console.log(msg);
  emit({ kind: 'log', message: msg });
}

function die(msg, detail) {
  console.error(`[transfer] ERROR: ${msg}`);
  emit({ kind: 'error', message: msg, detail: detail || null });
  process.exit(1);
}

async function mgmt(pat, route, init = {}) {
  const res = await fetch(MGMT + route, {
    ...init,
    headers: {
      Authorization: `Bearer ${pat}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = { raw: text }; }
  if (!res.ok) throw new Error((body && (body.message || body.error)) || `HTTP ${res.status}`);
  return body;
}

/** One PAT per project is all the operator types; anon + service_role are fetched. */
async function fetchKeys(pat, ref, label) {
  const keys = await mgmt(pat, `/v1/projects/${ref}/api-keys`);
  const find = (n) => (keys.find((k) => k.name === n) || {}).api_key || null;
  const anon = find('anon');
  const service = find('service_role');
  if (!anon || !service) throw new Error(`${label} ${ref} did not return anon + service_role keys`);
  return { anon, service };
}

async function countRows(pat, ref, sql) {
  try {
    const rows = await mgmt(pat, `/v1/projects/${ref}/database/query`, {
      method: 'POST', body: JSON.stringify({ query: sql }),
    });
    const r = Array.isArray(rows) && rows[0] ? rows[0] : {};
    return Number(r.n || 0);
  } catch { return null; }
}

/** Run a worker to completion, streaming its stdout into the log and the progress file. */
function run(worker, args, env, phase) {
  return new Promise((resolve, reject) => {
    emit({ kind: 'phase', phase, state: 'start', message: `${phase}…` });
    say(`── ${phase} ──`);
    const child = spawn(process.execPath, [path.join(ROOT, 'scripts', worker), ...args], {
      cwd: ROOT,
      env: { ...process.env, ...env },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const onData = (buf) => {
      const text = buf.toString();
      process.stdout.write(text);
      for (const line of text.split('\n')) {
        if (line.trim()) emit({ kind: 'log', message: line.trim() });
      }
    };
    child.stdout.on('data', onData);
    child.stderr.on('data', onData);
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        emit({ kind: 'phase', phase, state: 'done', message: `${phase} done` });
        resolve();
      } else {
        reject(new Error(`${worker} ${phase} exited ${code}`));
      }
    });
  });
}

async function main() {
  if (!SRC_PAT || !SRC_REF || !DST_PAT || !DST_REF) {
    die('both projects are required: ISO_SRC_PAT/ISO_SRC_REF and ISO_DST_PAT/ISO_DST_REF');
  }
  if (SRC_REF === DST_REF) {
    die(`source and target are the same project (${SRC_REF}) — there is nothing to transfer`);
  }

  const before = await countRows(DST_PAT, DST_REF, 'select count(*) n from auth.users');

  say(`source  ${SRC_REF}`);
  say(`target  ${DST_REF}`);
  if (process.env.ISO_MODE === 'schema-only') say('mode    schema only (users and rows skipped)');
  if (process.env.ISO_NO_STORAGE === '1') say('mode    storage skipped');

  const srcKeys = await fetchKeys(SRC_PAT, SRC_REF, 'source');
  const dstKeys = await fetchKeys(DST_PAT, DST_REF, 'target');

  const stamp = new Date().toISOString().slice(0, 10);
  const outDir = path.join(ROOT, 'backups', `transfer-${stamp}-${DST_REF}`);
  fs.mkdirSync(outDir, { recursive: true });

  const backupArgs = ['backup', '--out', outDir];
  if (process.env.ISO_NO_STORAGE === '1') backupArgs.push('--no-storage');

  await run('supabase-backup.mjs', backupArgs, {
    SUPABASE_URL: `https://${SRC_REF}.supabase.co`,
    SUPABASE_ANON_KEY: srcKeys.anon,
    SUPABASE_SERVICE_ROLE_KEY: srcKeys.service,
    SUPABASE_ACCESS_TOKEN: SRC_PAT,
  }, '1/2 backup from source');

  // Only now read the dir back — a stale manifest from an earlier run in the same
  // directory would otherwise be restored while believing it is today's data.
  const manifestPath = path.join(outDir, 'manifest.json');
  if (!fs.existsSync(manifestPath)) die(`backup produced no manifest at ${manifestPath}`);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  // Report what the manifest ACTUALLY holds. It has no `users` field — the auth
  // dump is a separate .jsonl next to it — and `tables` is an array of per-table
  // entries, so the row total has to be summed. Reporting a field that does not
  // exist would print "0 users" on a fully successful transfer.
  const tableEntries = Array.isArray(manifest.tables) ? manifest.tables : [];
  const tableCount = tableEntries.length;
  const rowTotal = tableEntries.reduce((n, t) => n + (Number(t && t.count) || 0), 0);
  const usersFile = path.join(outDir, 'db', 'auth.users.jsonl');
  const usersInBackup = fs.existsSync(usersFile)
    ? fs.readFileSync(usersFile, 'utf8').split('\n').filter((l) => l.trim()).length
    : 0;
  const storageCount = Array.isArray(manifest.storage_files) ? manifest.storage_files.length : 0;
  say(`backup manifest: ${tableCount} tables, ${rowTotal} rows, ${usersInBackup} users, ${storageCount} storage files`);

  const restoreArgs = ['restore', '--src', outDir];
  if (process.env.ISO_MODE === 'schema-only') restoreArgs.push('--schema-only');
  if (process.env.ISO_NO_STORAGE === '1') restoreArgs.push('--no-storage');

  await run('supabase-backup.mjs', restoreArgs, {
    SUPABASE_URL: `https://${DST_REF}.supabase.co`,
    SUPABASE_ANON_KEY: dstKeys.anon,
    SUPABASE_SERVICE_ROLE_KEY: dstKeys.service,
    SUPABASE_ACCESS_TOKEN: DST_PAT,
  }, '2/2 restore into target');

  const after = await countRows(DST_PAT, DST_REF, 'select count(*) n from auth.users');
  const summary = {
    source: SRC_REF,
    target: DST_REF,
    dir: outDir,
    tables: tableCount,
    rows: rowTotal,
    usersBefore: before,
    usersAfter: after,
    usersInBackup,
    storageFiles: storageCount,
  };
  say('');
  say('── transfer complete ──');
  say(`  source   ${SRC_REF}  (${tableCount} tables, ${rowTotal} rows, ${usersInBackup} users, ${storageCount} files)`);
  // A restored user count that did not move is the one result worth shouting about:
  // it means the restore claimed success but transferred no accounts.
  const moved = before == null || after == null ? null : after - before;
  say(`  target   ${DST_REF}  (users ${before ?? '?'} → ${after ?? '?'}${moved == null ? '' : `, +${moved}`})`);
  if (moved != null && usersInBackup > 0 && moved < usersInBackup) {
    say(`  WARNING  only ${moved} of ${usersInBackup} users landed — check the restore log for conflicts`);
  }
  say(`  local    ${outDir}`);
  emit({ kind: 'done', message: 'transfer complete', summary });
  console.log(JSON.stringify(summary));
}

main().catch((e) => {
  die(e && e.message || String(e), e && e.stack);
});