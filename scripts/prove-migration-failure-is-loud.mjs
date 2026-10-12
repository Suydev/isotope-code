#!/usr/bin/env node
/**
 * prove-migration-failure-is-loud.mjs — negative control for transfer.mjs.
 *
 * Transfers the REAL source text of `function run()` and the migration block
 * out of scripts/transfer.mjs and executes it in a vm, exactly the way
 * scripts/test-backend-readiness.mjs does for the PAT-in-argv check. Nothing
 * here reimplements the code under test: if transfer.mjs regresses, this fails.
 *
 * Three cases, all against the live extraction:
 *   1. NEGATIVE  the worker is absent  (the original defect, reproduced)
 *   2. NEGATIVE  the worker exits 1    (migrations ran and failed)
 *   3. POSITIVE  the worker exits 0    (migrations ran clean)
 *
 * A transfer that cannot migrate must NOT reach "transfer complete".
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { spawn } from 'node:child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SRC = path.join(ROOT, 'scripts/transfer.mjs');
const transfer = fs.readFileSync(SRC, 'utf8');

// ── extract the REAL code under test ─────────────────────────────────────────
function between(text, startMarker, endMarker) {
  const a = text.indexOf(startMarker);
  if (a === -1) throw new Error(`extraction: ${JSON.stringify(startMarker)} not found in transfer.mjs`);
  const b = text.indexOf(endMarker, a);
  if (b === -1) throw new Error(`extraction: ${JSON.stringify(endMarker)} not found after ${startMarker}`);
  return text.slice(a, b);
}

const RUNNER = between(transfer, 'function run(', '\nasync function main()');
// The whole migration step: watermark read, spawn, and the failure handler.
const MIGSTEP = between(transfer, 'let migrationFailures = 0;', '\n  const stamp = new Date()');
const WATERMARK = between(transfer, '/** Highest migration number', '\nasync function mgmt(');

if (!/MIGRATIONS FAILED/.test(MIGSTEP)) {
  throw new Error('the migration block has no loud-failure path — the fix has regressed');
}
if (!/die\(/.test(MIGSTEP)) {
  throw new Error('the migration block does not block — it warns and continues');
}

// ── harness ──────────────────────────────────────────────────────────────────
const tmp = path.join(ROOT, 'backups', '.prove-migration-loud');
const TEMPLATE = 'import fs from "node:fs";\nprocess.stdout.write("worker-ran\\n");\nprocess.exit(Number(process.env.PROBE_EXIT || 0));\n';

/**
 * @param {'absent'|'fail'|'ok'} mode  what scripts/backend-switch.mjs does
 */
async function scenario(mode) {
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(path.join(tmp, 'scripts'), { recursive: true });
  // transfer.mjs's schemaWatermark() reads the dump from ROOT or ../isotope-code.
  fs.mkdirSync(path.join(tmp, 'isotope-complete.sql').replace(/isotope-complete\.sql$/, ''), { recursive: true });
  fs.writeFileSync(path.join(tmp, 'isotope-complete.sql'), '-- Schema-watermark: 028\n');

  if (mode !== 'absent') {
    fs.writeFileSync(path.join(tmp, 'scripts', 'backend-switch.mjs'), TEMPLATE);
  }

  const log = [];
  const events = [];
  let exitCode = null;
  const ctx = vm.createContext({
    ROOT: tmp,
    fs,
    path,
    // transfer.mjs's run() spawns a real child; the vm needs the real spawn.
    spawn,
    process: {
      execPath: process.execPath,
      env: { PROBE_EXIT: mode === 'fail' ? '1' : '0' },
      stdout: { write: (t) => log.push(t) },
      exit: (c) => { exitCode = c; throw new Error('__DIED__'); },
    },
    console: { log: (...a) => log.push(a.join(' ') + '\n'), error: (...a) => log.push(a.join(' ') + '\n') },
    say: (m) => { log.push(m + '\n'); events.push({ kind: 'log', message: m }); },
    emit: (e) => events.push(e),
    die: (m, detail) => {
      exitCode = 1;
      log.push(`[transfer] ERROR: ${m}\n`);
      events.push({ kind: 'error', message: m, detail: detail || null });
      throw new Error('__DIED__');
    },
    TRANSFER_STEPS: 4,
    DST_REF: 'probe-target-ref',
    // A sentinel, never a real credential.
    DST_PAT: 'PROBE_PAT_NOT_A_REAL_TOKEN',
    fetch: async () => { throw new Error('fetch must not be called in this probe'); },
  });

  let threw = null;
  try {
    await vm.runInContext(`${WATERMARK}\n${RUNNER}\n(async()=>{${MIGSTEP}\n})()`, ctx);
  } catch (e) {
    threw = e;
  }
  const reachedStep4 = false; // MIGSTEP is everything up to the stamp; we never get past a block.
  const out = log.join('');
  return { mode, exitCode, threw, out, events, reachedStep4 };
}

// ── run all three ────────────────────────────────────────────────────────────
const results = [];
for (const mode of ['absent', 'fail', 'ok']) results.push(await scenario(mode));
fs.rmSync(tmp, { recursive: true, force: true });

let failed = 0;
const check = (name, ok, detail) => {
  if (ok) { console.log(`  PASS  ${name}`); }
  else { console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ''}`); failed++; }
};

const absent = results.find((r) => r.mode === 'absent');
const fail = results.find((r) => r.mode === 'fail');
const ok = results.find((r) => r.mode === 'ok');

console.log('NEGATIVE 1 — worker file absent (the original defect):');
check('exit code is non-zero', absent.exitCode !== 0 && absent.exitCode !== null, `exitCode=${absent.exitCode}`);
check('output says migrations did NOT run', /MIGRATIONS FAILED/.test(absent.out), 'no MIGRATIONS FAILED banner');
check('no success is reported', !/transfer complete/.test(absent.out));

console.log('NEGATIVE 2 — worker exits 1 (migrations ran, statements failed):');
check('exit code is non-zero', fail.exitCode !== 0 && fail.exitCode !== null, `exitCode=${fail.exitCode}`);
check('output says migrations did NOT run', /MIGRATIONS FAILED/.test(fail.out));
check('no success is reported', !/transfer complete/.test(fail.out));

console.log('POSITIVE 3 — worker exits 0 (migrations clean):');
check('did NOT block', ok.exitCode === null, `exitCode=${ok.exitCode}`);
check('reached the end of the migration step', /nothing|\[switch\]|watermark/.test(ok.out), ok.out.slice(0, 120));

console.log('');
console.log(`negative-control result: ${failed === 0 ? 'PASS' : `FAIL (${failed})`}`);
process.exit(failed === 0 ? 0 : 1);