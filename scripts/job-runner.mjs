#!/usr/bin/env node
/**
 * job-runner.mjs — run a long backup/restore as a DETACHED child, with all state
 * on disk so the web UI can close, reload, or crash without stopping the work.
 *
 * Why state lives in files rather than the server process:
 *   The restore takes minutes. If progress lived in the HTTP server's memory,
 *   closing the tab would be fine but restarting the server would lose the job,
 *   and a crashed server would orphan a child still writing to a database. With
 *   .job.json + .progress.jsonl on disk, any new server instance reattaches by
 *   reading them, and `status` is truthful even with no server running at all.
 *
 * Files, all under backups/:
 *   .job.json        current job: id, kind, pid, target ref, phase, counts
 *   .progress.jsonl  append-only event log the UI streams
 *   .job.log         raw child stdout/stderr, for the log pane
 *
 * Credentials are passed to the child through its ENVIRONMENT, never written to
 * any of these files. .job.json records the project ref only.
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'backups');
const JOB = path.join(DIR, '.job.json');
const PROGRESS = path.join(DIR, '.progress.jsonl');
const LOG = path.join(DIR, '.job.log');

function ensureDir() {
  fs.mkdirSync(DIR, { recursive: true });
}

export function readJob() {
  try {
    const job = JSON.parse(fs.readFileSync(JOB, 'utf8'));
    // A recorded pid is not proof of life: the process may have been killed, or
    // the device rebooted. Probe it, and reconcile a stale "running" state so the
    // UI never shows a job that is silently dead.
    if (job.state === 'running' && job.pid && !isAlive(job.pid)) {
      // A gone process is only "orphaned" if it did not reach the end. The worker
      // emits a terminal `{phase:<kind>, state:'done'}` event, so a completed
      // restore was being labelled `orphaned` purely because it had exited — which
      // is the one thing a finished job is supposed to do.
      const finished = lastPhaseDone(job.kind);
      job.state = finished ? 'done' : 'orphaned';
      job.finishedAt = job.finishedAt || Date.now();
      if (!finished) {
        job.error = job.error || 'process is gone (killed, or the device restarted)';
      }
      try { fs.writeFileSync(JOB, JSON.stringify(job, null, 2)); } catch { /* read-only fs */ }
    }
    return job;
  } catch {
    return null;
  }
}

/** True if the event stream carries the worker's terminal event for this kind. */
function lastPhaseDone(kind) {
  try {
    const lines = fs.readFileSync(PROGRESS, 'utf8').trimEnd().split('\n');
    // Scan from the end: the terminal event is the last one written.
    for (let i = lines.length - 1; i >= 0; i--) {
      if (!lines[i]) continue;
      let e;
      try { e = JSON.parse(lines[i]); } catch { continue; }
      if (e.phase === kind && e.state === 'done') return true;
    }
    return false;
  } catch {
    return false;
  }
}

function isAlive(pid) {
  try { process.kill(pid, 0); return true; } catch { return false; }
}

/** Events since `offset` bytes, so the UI can stream without re-reading. */
export function readProgress(offset = 0) {
  try {
    const size = fs.statSync(PROGRESS).size;
    if (offset >= size) return { offset: size, events: [] };
    const fd = fs.openSync(PROGRESS, 'r');
    const buf = Buffer.alloc(size - offset);
    fs.readSync(fd, buf, 0, buf.length, offset);
    fs.closeSync(fd);
    const text = buf.toString('utf8');
    // A partial trailing line means the child is mid-write; leave it for next read.
    const lastNl = text.lastIndexOf('\n');
    if (lastNl === -1) return { offset, events: [] };
    const events = text.slice(0, lastNl).split('\n').filter(Boolean).map((l) => {
      try { return JSON.parse(l); } catch { return { level: 'raw', msg: l }; }
    });
    return { offset: offset + lastNl + 1, events };
  } catch {
    return { offset: 0, events: [] };
  }
}

export function readLogTail(maxBytes = 16384) {
  try {
    const size = fs.statSync(LOG).size;
    const start = Math.max(0, size - maxBytes);
    const fd = fs.openSync(LOG, 'r');
    const buf = Buffer.alloc(size - start);
    fs.readSync(fd, buf, 0, buf.length, start);
    fs.closeSync(fd);
    return buf.toString('utf8');
  } catch {
    return '';
  }
}

/**
 * Starts a job detached. Returns the job record.
 *
 * @param {object} opts
 * @param {'backup'|'restore'|'verify'|'setup'} opts.kind
 * @param {string[]} opts.args      argv for the worker
 * @param {object}   opts.env       credentials — env only, never persisted
 * @param {string}   opts.targetRef project ref, for display and the safety check
 * @param {string}   [opts.script]  worker filename under scripts/. Defaults to
 *                                  supabase-backup.mjs. `setup` runs a DIFFERENT
 *                                  worker (supabase-setup.mjs), and hardcoding one
 *                                  script here is what made the console unable to
 *                                  provision a project at all — the thing a
 *                                  first-time user opens it for.
 * @param {object}   [opts.meta]    extra fields recorded in .job.json
 */
export function startJob({ kind, args, env, targetRef, script = 'supabase-backup.mjs', meta = {} }) {
  ensureDir();
  const existing = readJob();
  if (existing && existing.state === 'running') {
    throw new Error(`a ${existing.kind} job is already running (pid ${existing.pid}) — stop it first`);
  }

  // Allow-list, not interpolation: `script` reaches here from an HTTP body, and
  // spawning an arbitrary path because a request asked for it would turn a
  // loopback console into a local code-execution endpoint.
  const WORKERS = new Set(['supabase-backup.mjs', 'supabase-setup.mjs']);
  if (!WORKERS.has(script)) throw new Error(`unknown worker: ${script}`);
  const workerPath = path.join(ROOT, 'scripts', script);
  if (!fs.existsSync(workerPath)) throw new Error(`worker not found: ${script}`);

  // Truncate per-job streams so the UI never shows a previous run's numbers.
  fs.writeFileSync(PROGRESS, '');
  fs.writeFileSync(LOG, '');

  const out = fs.openSync(LOG, 'a');
  const child = spawn(process.execPath, [workerPath, ...args], {
    cwd: ROOT,
    // ISO_PROGRESS_FILE tells the child where to emit structured events. The UI
    // reads those, NOT the human log — parsing prose breaks whenever a message
    // is reworded.
    env: { ...process.env, ...env, ISO_PROGRESS_FILE: PROGRESS },
    detached: true,
    stdio: ['ignore', out, out],
  });
  child.unref();

  const job = {
    id: `${kind}-${Date.now()}`,
    kind,
    pid: child.pid,
    targetRef,
    state: 'running',
    startedAt: Date.now(),
    finishedAt: null,
    error: null,
    ...meta,
  };
  fs.writeFileSync(JOB, JSON.stringify(job, null, 2));
  return job;
}

export function stopJob() {
  const job = readJob();
  if (!job || job.state !== 'running') return { stopped: false, reason: 'no running job' };
  try { process.kill(job.pid, 'SIGKILL'); } catch { /* already gone */ }
  job.state = 'stopped';
  job.finishedAt = Date.now();
  fs.writeFileSync(JOB, JSON.stringify(job, null, 2));
  return { stopped: true };
}

/**
 * Derives a UI-ready summary from the event stream: per-phase progress, an ETA
 * from measured throughput, and how long since the last event.
 *
 * The staleness figure matters as much as the percentage: a restore of mine sat
 * frozen at 250/1772 for 13 minutes and looked identical to one making progress.
 */
export function summarise(events, job) {
  const phases = {};
  const errors = [];
  let lastEventAt = job ? job.startedAt : Date.now();

  for (const e of events) {
    if (e.t) lastEventAt = e.t;
    if (e.level === 'error') {
      errors.push({ msg: e.msg, stmt: e.stmt || null, t: e.t });
      continue;
    }
    if (!e.phase) continue;
    const p = phases[e.phase] || (phases[e.phase] = {
      done: 0, total: 0, failed: 0, skipped: 0, samples: [], state: 'running',
    });
    if (typeof e.done === 'number') p.done = e.done;
    if (typeof e.total === 'number') p.total = e.total;
    if (typeof e.failed === 'number') p.failed = e.failed;
    if (typeof e.skipped === 'number') p.skipped = e.skipped;
    if (e.state) p.state = e.state;
    if (e.t && typeof e.done === 'number') {
      p.samples.push({ t: e.t, done: e.done });
      if (p.samples.length > 12) p.samples.shift();  // rolling window
    }
  }

  for (const p of Object.values(phases)) {
    // Rate from the window, not from job start: early batches are slower
    // (connection warm-up), so a whole-run average under-reports badly.
    const first = p.samples[0];
    const last = p.samples[p.samples.length - 1];
    if (first && last && last.t > first.t && last.done > first.done) {
      p.rate = (last.done - first.done) / ((last.t - first.t) / 1000);
      const left = Math.max(0, p.total - p.done);
      p.etaSeconds = p.rate > 0 ? Math.round(left / p.rate) : null;
    } else {
      p.rate = null;
      p.etaSeconds = null;
    }
    delete p.samples;
  }

  return {
    job,
    phases,
    errors: errors.slice(-50),
    errorCount: errors.length,
    lastEventAt,
    staleSeconds: Math.round((Date.now() - lastEventAt) / 1000),
    elapsedSeconds: job ? Math.round((Date.now() - job.startedAt) / 1000) : 0,
  };
}

export const PATHS = { DIR, JOB, PROGRESS, LOG };

// CLI: `node scripts/job-runner.mjs status` for checking without the web UI.
const invokedDirectly = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  const cmd = process.argv[2] || 'status';
  if (cmd === 'status') {
    const job = readJob();
    if (!job) { console.log('no job recorded'); process.exit(0); }
    const { events } = readProgress(0);
    const s = summarise(events, job);
    console.log(`${job.kind} · ${job.state} · pid ${job.pid} · target ${job.targetRef}`);
    console.log(`elapsed ${s.elapsedSeconds}s · last event ${s.staleSeconds}s ago · errors ${s.errorCount}`);
    for (const [name, p] of Object.entries(s.phases)) {
      const pct = p.total ? Math.round((p.done / p.total) * 100) : 0;
      const eta = p.etaSeconds != null ? ` · eta ${p.etaSeconds}s` : '';
      console.log(`  ${name.padEnd(9)} ${String(pct).padStart(3)}%  ${p.done}/${p.total}` +
        `  failed ${p.failed}${eta}`);
    }
  } else if (cmd === 'stop') {
    console.log(JSON.stringify(stopJob()));
  } else {
    console.error('usage: job-runner.mjs [status|stop]');
    process.exit(1);
  }
}
