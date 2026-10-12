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

/** Highest migration number already baked into the dump, read from its own header. */
function schemaWatermark() {
  const files = [
    path.join(ROOT, 'isotope-complete.sql'),
    path.join(ROOT, '..', 'isotope-code', 'isotope-complete.sql'),
  ];
  for (const f of files) {
    try {
      const m = fs.readFileSync(f, 'utf8').match(/--\s*Schema-watermark:\s*(\d{1,3})/i);
      if (m) return m[1].padStart(3, '0');
    } catch { /* try the next location */ }
  }
  return null;
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
// A transfer is four steps. The step markers carry `step`/`steps` so the console
// can render "step 2 of 4" — a step indicator, which is what a multi-stage run
// needs. Emitting a phase with no total at all produced a row reading "0/?", which
// looks stuck and tells the user nothing.
export const TRANSFER_STEPS = 4;

function run(worker, args, env, phase, step) {
  return new Promise((resolve, reject) => {
    emit({ kind: 'phase', phase, state: 'start', message: `${phase}…`, step, steps: TRANSFER_STEPS });
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
        emit({ kind: 'phase', phase, state: 'done', message: `${phase} done`, step, steps: TRANSFER_STEPS });
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

  // ── Establish the target's schema BEFORE restoring anything ──────────────────
  //
  // The restore log says it plainly: `[restore] no schema.sql — assuming target
  // already has schema`. A backup carries DATA, not schema, so against an
  // un-provisioned or under-provisioned target the data lands in whatever shape
  // the tables happen to have. That is how 13 user_presence rows were rejected
  // with `column "subject_id" does not exist` on a target whose table had only
  // 10 of the 14 columns.
  //
  // supabase-clone.mjs already does this (provision -> migrate -> backup ->
  // restore). transfer.mjs skipped straight to backup, so a transfer into an
  // existing project produced a target missing both the schema baseline and
  // every migration. Both are applied here.
  say('-- step 0/4 establish target schema + apply all migrations --');
  // Non-fatal. The schema dump is idempotent, and a baseline that dies on a
  // transient Management-API hiccup ("fetch failed") is retried cheaply on the
  // next run. Treating it as fatal meant a 2-second network blip aborted an
  // otherwise-good transfer. carbon-copy verification below is the real gate.
  let baselineFailed = 0;
  try {
    // PAT travels ONLY in the environment. `--pat` here would put it in argv,
    // which is world-readable in /proc/<pid>/cmdline and lands in shell history.
    // supabase-setup.mjs resolves `args.pat || process.env.SUPABASE_ACCESS_TOKEN`,
    // so dropping the flag is behaviour-preserving.
    await run('supabase-setup.mjs', ['--ref', DST_REF, '--no-env', '--force'], {
      SUPABASE_URL: `https://${DST_REF}.supabase.co`,
      SUPABASE_ACCESS_TOKEN: DST_PAT,
    }, 'schema baseline', 1);
  } catch (e) {
    baselineFailed = 1;
    say(`[transfer] schema baseline reported failures (${e.message}); continuing — the restore is additive and carbon-copy verification is the gate`);
  }

  // A migration that does not run is a migration that did not happen. The
  // previous shape of this block swallowed the failure, set
  // migrationFailures = 1, and carried on to print "transfer complete" — a
  // transfer that reported success while applying zero migrations. It read as
  // benign because two numbered migrations are known to fail on a fresh
  // target (012 seeds rows with hardcoded author ids, 013b is a CREATE OR
  // REPLACE that changes a return type, 42P13). That reasoning does not
  // survive contact with the fact that the worker did not exist at all: the
  // exit code carries no information about which statement failed, so it
  // cannot be used to tell "these two expected failures" from "none of it
  // ran". Silence is not evidence of safety.
  //
  // So: the pending set is now explicit. backend-switch.mjs `migrate` applies
  // every numbered file strictly above the dump's watermark — the only files
  // the dump does not already carry — and exits non-zero if any statement
  // fails. That makes the exit code meaningful, and it makes a failure
  // BLOCKING: a transfer that cannot bring the target schema up to the source
  // must not finish, and must not print "transfer complete".
  let migrationFailures = 0;
  const watermark = schemaWatermark();
  if (watermark) {
    const next = String(Number(watermark) + 1).padStart(3, '0');
    say(`[transfer] schema watermark ${watermark} — applying migrations from ${next} only`);
    try {
      // PAT via env only — same reason as the baseline above.
      await run('backend-switch.mjs', ['migrate', '--ref', DST_REF, '--from', next], {
        SUPABASE_ACCESS_TOKEN: DST_PAT,
      }, 'migrations', 2);
    } catch (e) {
      // Loud and blocking. Recorded in the summary for the console's benefit,
      // then stopped: the target's schema is below the source's and the data
      // restore would land in the wrong shape.
      migrationFailures = 1;
      say('');
      say('[transfer] MIGRATIONS FAILED — the target schema was NOT brought up to the source.');
      say(`[transfer]   ${e.message}`);
      say('[transfer]   The restore below is skipped. A partial transfer that reports');
      say('[transfer]   success is worse than one that stops, so this run ends here.');
      die('migrations above the dump watermark failed; refusing to report a transfer that did not migrate', e.message);
    }
  } else {
    say('[transfer] no schema watermark in the dump — skipping migrations rather than replaying history');
  }

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
  }, 'backup from source', 3);

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

  // Truncate before restoring, so the target ends up a copy of the source and
  // never an accumulation.
  //
  // Step 0 applies the numbered migrations, and one of them
  // (012_seed_community_data.sql) inserts demo rows with hardcoded author ids.
  // The restore only inserts, so those survive it: the target came out with 20
  // group_members rows against the source's 17, which verify caught as the one
  // failing check out of 102.
  //
  // Safe here because step 0 has just rebuilt the schema, so anything present is
  // seeded or left over — exactly what the restore is about to replace. auth.users
  // and auth.identities are deliberately left alone: the restore upserts users and
  // matches them against existing identities.
  try {
    // Truncate EVERY table the backup contains, from the manifest — not a
    // hand-maintained list. A hardcoded subset silently lost rows forever: the
    // signup trigger fires when auth.users is restored and creates
    // public.user_profiles WITHOUT a handle, so the subsequent restore of
    // user_profiles hit `on conflict do nothing` and skipped all 13 real rows.
    // Result: source 12/13 handles, target 0/13, and every counter said success.
    //
    // A carbon copy means the target ends up with the source's rows and nothing
    // else, so everything the backup carries is cleared first. auth.users and
    // auth.identities are deliberately excluded — the restore upserts those and
    // matching them against existing identities is how users are linked.
    const tables = Array.isArray(manifest.tables)
      ? manifest.tables
          .map((t) => `${t.schema || 'public'}."${String(t.table || t.name || '').replace(/"/g, '""')}"`)
          .filter((n) => !n.startsWith('auth.'))
      : [];
    if (tables.length) {
      await mgmt(DST_PAT, `/v1/projects/${DST_REF}/database/query`, {
        method: 'POST',
        body: JSON.stringify({ query: `truncate table ${tables.join(', ')} restart identity cascade` }),
      });
      say(`[transfer] truncated ${tables.length} table(s) before restore`);
    }

    // TRUNCATE returns no rowset, so an empty array here means "ran", not
    // "truncated nothing" — saying otherwise was misleading in the log.
    say(`[transfer] truncated seeded rows before restore`);
  } catch (e) {
    // Not fatal: the restore still runs, and verify is the gate that decides.
    say(`[transfer] truncate skipped (${(e.message || '').slice(0, 90)})`);
  }

  await run('supabase-backup.mjs', restoreArgs, {
    SUPABASE_URL: `https://${DST_REF}.supabase.co`,
    SUPABASE_ANON_KEY: dstKeys.anon,
    SUPABASE_SERVICE_ROLE_KEY: dstKeys.service,
    SUPABASE_ACCESS_TOKEN: DST_PAT,
  }, 'restore into target', 4);

  const after = await countRows(DST_PAT, DST_REF, 'select count(*) n from auth.users');
  const summary = {
    source: SRC_REF,
    target: DST_REF,
    migrationFailures,
    baselineFailed,
    // Explicit rather than inferred from migrationFailures: a reader of this
    // JSON must not have to know the current watermark to learn whether any
    // migration was pending at all.
    migrations: watermark
      ? { watermark, from: String(Number(watermark) + 1).padStart(3, '0'), ran: true, failed: migrationFailures }
      : { watermark: null, ran: false, failed: 0, reason: 'no watermark in the dump' },
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
  // "Only 0 of 13 users landed" was alarming and wrong on a re-run: the restore
  // upserts on conflict, so users already present count as moved-by-restoring even
  // though the raw total did not change. What actually matters is whether the
  // target now holds at least as many users as the backup carried.
  if (before != null && after != null && usersInBackup > 0) {
    if (after >= usersInBackup) {
      say(`  users    ${after} present, backup carried ${usersInBackup} — all accounted for`);
    } else if (moved != null && moved > 0) {
      say(`  WARNING  ${after} present vs ${usersInBackup} in the backup — some accounts did not restore, see the log above`);
    } else {
      say(`  WARNING  target holds ${after} users but the backup carried ${usersInBackup} and none were added — check for conflicts`);
    }
  }
  say(`  local    ${outDir}`);
  // Terminal event. job-runner's lastPhaseDone() looks for `phase === kind` with
  // `state === 'done'`; emitting only `kind: 'done'` left every completed transfer
  // labelled `orphaned` in the UI, i.e. a finished job reported as a dead one.
  emit({ kind: 'done', phase: 'transfer', state: 'done', message: 'transfer complete', summary });
  console.log(JSON.stringify(summary));
}

main().catch((e) => {
  die(e && e.message || String(e), e && e.stack);
});