#!/usr/bin/env node
/**
 * backup-ui.mjs — localhost console for backup / restore / verify.
 *
 *   node scripts/backup-ui.mjs        → http://127.0.0.1:8000
 *
 * Binds to 127.0.0.1 ONLY. This page accepts a Supabase personal access token and
 * displays project refs; on 0.0.0.0 anything on the same network could read it and
 * drive a restore. Do not put it behind a tunnel or reverse proxy.
 *
 * Work runs in a detached child (see job-runner.mjs) with state on disk, so
 * closing the tab, reloading, or restarting this server does not stop a job and
 * does not lose its progress.
 *
 * Credentials are held in memory for the lifetime of a request/job and passed to
 * the child through its environment. Nothing is written to disk except the project
 * ref, which .job.json needs for display and the restore safety check.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  readJob, readProgress, readLogTail, startJob, stopJob, summarise, PATHS,
} from './job-runner.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HOST = '127.0.0.1';
const PORT = Number(process.env.ISO_UI_PORT || 8000);
const MGMT = 'https://api.supabase.com';

// ── Supabase Management API ──────────────────────────────────────────────────

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
  if (!res.ok) {
    const msg = (body && (body.message || body.error)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return body;
}

/** One PAT is all the user types; anon + service_role are fetched, never asked for. */
async function fetchKeys(pat, ref) {
  const keys = await mgmt(pat, `/v1/projects/${ref}/api-keys`);
  const find = (n) => (keys.find((k) => k.name === n) || {}).api_key || null;
  const anon = find('anon');
  const service = find('service_role');
  if (!anon || !service) throw new Error('project did not return anon + service_role keys');
  return { anon, service };
}

/** Read-only probe so the operator can see WHAT they are about to write to. */
async function inspect(pat, ref) {
  const q = async (sql) => {
    const rows = await mgmt(pat, `/v1/projects/${ref}/database/query`, {
      method: 'POST', body: JSON.stringify({ query: sql }),
    });
    return Array.isArray(rows) && rows[0] ? rows[0] : {};
  };
  const [tables, users, routines] = await Promise.all([
    q("select count(*) n from information_schema.tables where table_schema='public'"),
    q('select count(*) n from auth.users'),
    q("select count(*) n from pg_proc p join pg_namespace s on s.oid=p.pronamespace where s.nspname='public'"),
  ]);
  return {
    tables: Number(tables.n || 0),
    users: Number(users.n || 0),
    routines: Number(routines.n || 0),
    empty: Number(tables.n || 0) === 0 && Number(users.n || 0) === 0,
  };
}

/**
 * The full readiness report — the same checks as `./supabase.sh check`.
 *
 * Consumes `--json`, not the human report. Parsing the aligned text lost a check
 * once: "signup trigger on auth.users" is exactly as wide as the label column, so
 * it emitted no trailing padding and a whitespace-separator regex stopped matching
 * it — 13 checks silently became 12, and the one dropped was the most important in
 * the file. Column alignment is presentation and must not be load-bearing.
 *
 * Run as a child process rather than imported: supabase-check.mjs signals its
 * result with process.exit(), which would take this server down with it.
 */
async function readiness(pat, ref) {
  const { execFile } = await import('node:child_process');
  const script = path.join(ROOT, 'scripts', 'supabase-check.mjs');
  return new Promise((resolve) => {
    execFile(process.execPath, [script, '--ref', ref, '--json'], {
      env: { ...process.env, SUPABASE_ACCESS_TOKEN: pat },
      timeout: 120000,
      maxBuffer: 1 << 20,
    }, (err, stdout, stderr) => {
      // A non-zero exit IS the documented "not ready" signal, so `err` alone is
      // not a failure — only unparseable output is.
      try {
        resolve(JSON.parse(String(stdout || '')));
      } catch {
        resolve({
          ref, ready: false, total: 0, failed: 0, checks: [], fixes: [], manual: [],
          error: (err && (err.message || String(err))) || 'check produced no JSON',
          raw: (String(stdout || '') + String(stderr || '')).slice(0, 800),
        });
      }
    });
  });
}

/** The ref this checkout normally talks to — used to warn, not to block. */
function localRef() {
  for (const f of ['.backup_env', '.env']) {
    try {
      const txt = fs.readFileSync(path.join(ROOT, f), 'utf8');
      const m = txt.match(/^SUPABASE_URL=(.*)$/m);
      if (m) {
        const r = m[1].trim().replace(/["']/g, '').match(/https:\/\/([a-z0-9]+)\./);
        if (r) return r[1];
      }
    } catch { /* absent is fine */ }
  }
  return null;
}

function latestTarball() {
  try {
    const files = fs.readdirSync(PATHS.DIR)
      .filter((f) => f.endsWith('.tar.gz'))
      .map((f) => ({ f, t: fs.statSync(path.join(PATHS.DIR, f)).mtimeMs }))
      .sort((a, b) => b.t - a.t);
    return files.length ? path.join(PATHS.DIR, files[0].f) : null;
  } catch { return null; }
}

/**
 * supabase-backup.mjs `--src` takes a DIRECTORY containing manifest.json, db/ and
 * storage/ — not a tarball. Handing it the .tar.gz made every restore die instantly
 * with "no manifest.json in …tar.gz", which surfaced as a job that went straight to
 * `orphaned` with an empty progress file and no obvious cause.
 *
 * Extracting here rather than inside the worker keeps the worker's contract
 * unchanged for CLI use, where backup.sh already does the extraction.
 */
function extractedSrc(tarball) {
  const stat = fs.statSync(tarball);
  if (stat.isDirectory()) return tarball;
  const dir = path.join(PATHS.DIR, `.src-${path.basename(tarball).replace(/\.tar\.gz$/, '')}`);
  if (!fs.existsSync(path.join(dir, 'manifest.json'))) {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    const r = spawnSync('tar', ['-xzf', tarball, '-C', dir], { encoding: 'utf8' });
    if (r.status !== 0) {
      fs.rmSync(dir, { recursive: true, force: true });
      throw new Error(`extract failed: ${(r.stderr || '').slice(0, 200)}`);
    }
    if (!fs.existsSync(path.join(dir, 'manifest.json'))) {
      fs.rmSync(dir, { recursive: true, force: true });
      throw new Error('tarball has no manifest.json — not an isotope backup');
    }
  }
  return dir;
}

// ── HTTP ─────────────────────────────────────────────────────────────────────

function json(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, {
    'content-type': 'application/json',
    'content-length': Buffer.byteLength(body),
    'cache-control': 'no-store',
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    // Cap the body: this is a local tool, but an unbounded read is an easy hang.
    req.on('data', (c) => {
      data += c;
      if (data.length > 1e6) { reject(new Error('body too large')); req.destroy(); }
    });
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); } catch { reject(new Error('invalid JSON body')); }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${HOST}:${PORT}`);
  const route = url.pathname;

  try {
    if (route === '/' && req.method === 'GET') {
      const html = fs.readFileSync(path.join(ROOT, 'scripts', 'backup-ui.html'), 'utf8');
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
      res.end(html);
      return;
    }

    // ── state ────────────────────────────────────────────────────────────────
    if (route === '/api/state' && req.method === 'GET') {
      const job = readJob();
      const { events } = readProgress(0);
      const s = summarise(events, job);
      json(res, 200, {
        ...s,
        localRef: localRef(),
        tarball: latestTarball(),
        log: readLogTail(8000),
      });
      return;
    }

    // Server-Sent Events: one-way server→browser is all this needs, and the
    // browser reconnects on its own after a drop. A WebSocket would add a
    // dependency and a handshake for no gain.
    if (route === '/api/stream' && req.method === 'GET') {
      res.writeHead(200, {
        'content-type': 'text/event-stream',
        'cache-control': 'no-store',
        connection: 'keep-alive',
        'x-accel-buffering': 'no',
      });
      const tick = () => {
        const job = readJob();
        // Re-read from 0 every tick: summarise() derives per-phase totals from the
        // whole stream, and a reconnecting browser needs complete state, not a
        // fragment. The file is small enough that tailing would be a false economy.
        const { events } = readProgress(0);
        const s = summarise(events, job);
        s.log = readLogTail(8000);
        res.write(`data: ${JSON.stringify(s)}\n\n`);
      };
      tick();
      const timer = setInterval(tick, 1000);
      req.on('close', () => clearInterval(timer));
      return;
    }

    // ── project inspection / creation ────────────────────────────────────────
    if (route === '/api/projects' && req.method === 'POST') {
      const { pat } = await readBody(req);
      if (!pat) return json(res, 400, { error: 'pat required' });
      const list = await mgmt(pat, '/v1/projects');
      const orgs = await mgmt(pat, '/v1/organizations');
      json(res, 200, {
        organizations: orgs.map((o) => ({ id: o.id, name: o.name })),
        projects: list.map((p) => ({
          ref: p.id, name: p.name, status: p.status, region: p.region, org: p.organization_id,
        })),
      });
      return;
    }

    if (route === '/api/inspect' && req.method === 'POST') {
      const { pat, ref } = await readBody(req);
      if (!pat || !ref) return json(res, 400, { error: 'pat and ref required' });
      const [keys, stats] = await Promise.all([fetchKeys(pat, ref), inspect(pat, ref)]);
      json(res, 200, {
        ref,
        url: `https://${ref}.supabase.co`,
        ...stats,
        // Confirms the keys resolved without shipping them to the browser.
        keysResolved: Boolean(keys.anon && keys.service),
        isLocalProject: ref === localRef(),
      });
      return;
    }

    if (route === '/api/check' && req.method === 'POST') {
      const { pat, ref } = await readBody(req);
      if (!pat || !ref) return json(res, 400, { error: 'pat and ref required' });
      json(res, 200, await readiness(pat, ref));
      return;
    }

    if (route === '/api/create-project' && req.method === 'POST') {
      const { pat, name, org, region, dbPass } = await readBody(req);
      if (!pat || !name || !org || !dbPass) {
        return json(res, 400, { error: 'pat, name, org and dbPass required' });
      }
      const created = await mgmt(pat, '/v1/projects', {
        method: 'POST',
        body: JSON.stringify({
          name, organization_id: org, region: region || 'ap-northeast-1',
          db_pass: dbPass, plan: 'free',
        }),
      });
      json(res, 200, { ref: created.id, status: created.status });
      return;
    }

    // Provisioning is not instant, and the database accepts queries some time
    // after the project reports healthy. The UI polls this rather than guessing.
    if (route === '/api/ready' && req.method === 'POST') {
      const { pat, ref } = await readBody(req);
      if (!pat || !ref) return json(res, 400, { error: 'pat and ref required' });
      try {
        await mgmt(pat, `/v1/projects/${ref}/database/query`, {
          method: 'POST', body: JSON.stringify({ query: 'select 1 as ok' }),
        });
        json(res, 200, { ready: true });
      } catch (e) {
        json(res, 200, { ready: false, reason: e.message.slice(0, 200) });
      }
      return;
    }

    // ── jobs ────────────────────────────────────────────────────────────────
    if (route === '/api/start' && req.method === 'POST') {
      const body = await readBody(req);
      const { kind, pat, ref, confirmRef, mode } = body;
      if (!kind || !pat || !ref) return json(res, 400, { error: 'kind, pat and ref required' });

      const keys = await fetchKeys(pat, ref);
      const env = {
        SUPABASE_URL: `https://${ref}.supabase.co`,
        SUPABASE_ANON_KEY: keys.anon,
        SUPABASE_SERVICE_ROLE_KEY: keys.service,
        SUPABASE_ACCESS_TOKEN: pat,
      };

      let args;
      let script = 'supabase-backup.mjs';
      if (kind === 'setup') {
        // First-run provisioning: applies the committed schema, creates the
        // buckets, installs the signup trigger, verifies. Writes no rows.
        //
        // This is a DIFFERENT worker from backup/restore, and its absence was the
        // whole gap: someone with a brand-new Supabase project had no route at
        // all, because `restore` replays a tarball and a tarball only exists if
        // you already had a working backend. `--force` because the console has
        // already shown the operator the table and user counts and they clicked
        // anyway; the CLI keeps the guard for the non-interactive case.
        script = 'supabase-setup.mjs';
        args = ['--ref', ref, '--pat', pat, '--force'];
        // .env is a decision about THIS checkout, and the person clicking may be
        // provisioning a project for somewhere else entirely. Default to writing
        // it (that is the useful case) but let the page opt out — silently
        // repointing a machine's .env from a browser tab is the kind of side
        // effect nobody expects from a button labelled "Set up this project".
        if (body.writeEnv === false) args.push('--no-env');
      } else if (kind === 'backup') {
        args = ['backup', '--out', PATHS.DIR];
      } else if (kind === 'verify' || kind === 'restore') {
        const tarball = body.src || latestTarball();
        if (!tarball) return json(res, 400, { error: 'no backup tarball found — run a backup first' });
        if (!fs.existsSync(tarball)) return json(res, 400, { error: `not found: ${tarball}` });

        // Restore writes users and every table into the target. A typed ref is
        // required because a restore was mis-targeted during development, and a
        // single click is the wrong shape for that.
        if (kind === 'restore' && confirmRef !== ref) {
          return json(res, 400, {
            error: `type the target ref (${ref}) to confirm — restore overwrites the target`,
          });
        }
        const src = extractedSrc(tarball);
        // 'fresh' installs structure only. Skipping storage keeps 62 MB of user
        // files out of a project that is meant to start empty; users and rows are
        // skipped by the worker via --schema-only.
        const extra = [];
        if (kind === 'restore' && mode === 'fresh') extra.push('--schema-only', '--no-storage');
        args = [kind, '--src', src, ...extra];
      } else {
        return json(res, 400, { error: `unknown kind: ${kind}` });
      }

      const job = startJob({ kind, args, env, targetRef: ref, script, meta: { mode: mode || 'full' } });
      json(res, 200, { job });
      return;
    }

    if (route === '/api/stop' && req.method === 'POST') {
      json(res, 200, stopJob());
      return;
    }

    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('not found\n');
  } catch (e) {
    json(res, 500, { error: e.message || String(e) });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`backup console → http://${HOST}:${PORT}`);
  console.log('bound to loopback only; jobs survive closing this page');
  const job = readJob();
  if (job) console.log(`reattached: ${job.kind} · ${job.state} · target ${job.targetRef}`);
});
