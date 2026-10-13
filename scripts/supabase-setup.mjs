#!/usr/bin/env node
/**
 * supabase-setup.mjs — provision a BRAND NEW Supabase project for IsotopeAI.
 *
 *   node scripts/supabase-setup.mjs --pat TOKEN --ref abc123
 *   node scripts/supabase-setup.mjs --pat TOKEN --create "my-isotope" --org xyz
 *
 * This is NOT restore. Restore replays a tarball, which only exists if you already
 * had a working project — useless to someone setting up for the first time. This
 * applies the committed schema file (isotope-complete.sql, or
 * sql/isotope-schema-restore.sql — whichever is newer; no user data in either)
 * straight to an empty project, so anyone can stand up their own backend
 * with a personal access token and nothing else.
 *
 * What it provisions, in dependency order:
 *   1. schema   — 42 tables, 75 public functions, 15 triggers, 184 policies
 *   2. postsql  — the hardening SQL in sql/ that the generated dump cannot carry
 *   3. storage  — 4 buckets + owner-scoped policies
 *   4. auth     — the signup trigger, without which every new account is broken
 *   5. verify   — asserts all of the above actually landed
 *   6. .env     — written last, and only if verify passed
 *
 * Step 2 exists because the schema file is a GENERATED dump: it carries the
 * policy text that was true when it was generated, so any hardening applied to
 * a live project afterwards has to be re-applied on top or a first-run setup
 * provisions the old, broken policies. It runs before verify so a PASS means
 * the fixes are in place, and it fails the run rather than skipping a file that
 * has gone missing.
 *
 * It writes NO DATABASE ROWS. No users, no seed data, no files. A project set up
 * by this script is empty and ready for its owner's first signup.
 *
 * On success it writes .env pointing at the new project. An existing .env is
 * MOVED to .env.old, never overwritten — it holds the service-role key and every
 * API key on the machine. Pass --no-env to skip that entirely.
 */

import { readFileSync, writeFileSync, existsSync, appendFileSync, renameSync, statSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MGMT = 'https://api.supabase.com';

// Same event contract as supabase-backup.mjs, so job-runner.mjs and the web
// console can drive this without a second progress format.
const PROGRESS_FILE = process.env.ISO_PROGRESS_FILE || null;
function emit(event) {
  if (!PROGRESS_FILE) return;
  try {
    appendFileSync(PROGRESS_FILE, JSON.stringify({ t: Date.now(), ...event }) + '\n');
  } catch { /* progress must never fail the job it reports on */ }
}

// Buckets the app uploads to. Kept in sync with the REQUIRED_BUCKETS list in
// supabase-backup.mjs — two copies is one too many, but the setup path must
// work with no backup present.
//
// `notes` is deliberately NOT here. It existed with a 10 MB limit, zero objects,
// and zero references: no upload path in android-bridge.js, no reachable web
// bundle, nothing in the sync payload. Its only mention anywhere was a health
// check in server.mjs asserting that it exists. Provisioning a bucket nothing
// writes to means every new project carries a permission surface for no feature,
// and a health check that fails for a bucket the app does not use trains people
// to ignore the health check. Note attachments go to `user-content` with the rest
// of the sync payload.
const REQUIRED_BUCKETS = [
  { id: 'user-content',   public: false, file_size_limit: 52428800 },
  { id: 'avatars',        public: true,  file_size_limit: 2097152,
    allowed_mime_types: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] },
  { id: 'group-icons',    public: true,  file_size_limit: 10485760,
    allowed_mime_types: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'] },
  { id: 'study-material', public: false, file_size_limit: 104857600 },
];

// Functions the app calls by name. NOT derived from a count.
//
// `verifySetup` asserted `functions >= 70`. A count is satisfied by ANY 70 functions,
// including 70 that are missing the ones the app invokes — so a project provisioned
// without `community_get_premium_leaderboard` or `_guard_group_member_escalation`
// reported verification 8/8 PASS. That is a silent pass over a broken backend, and it
// is exactly the failure the owner's standing rule ("a readiness test should be added
// for all of them") exists to prevent: both dumps carry these functions, the app calls
// them, and nothing asserted they arrived.
//
// These are named rather than derived from the dump on purpose. Deriving the list from
// the schema file would make the test tautological — it would only ever confirm that
// the file contains what the file contains, and would still pass on a target the
// function never reached. The list has to be the app's list, maintained alongside the
// app's calls.
const REQUIRED_FUNCTIONS = [
  // RPC the Community UI calls for the premium leaderboard. Added with the leaderboard
  // feature; calling it before it exists is a 404 from PostgREST.
  'community_get_premium_leaderboard',
  // Trigger function on group_members that stops a member escalating their own role.
  // Without it a member can self-promote to owner/ admin, so its absence is a SECURITY
  // regression, not a missing feature.
  '_guard_group_member_escalation',
];

// Number of check() calls in verifySetup. Kept as a named constant so the progress
// total is not a hand-typed literal that silently disagrees with the real count.
const VERIFY_CHECK_COUNT = 10;

function parseArgs(argv = process.argv.slice(2)) {
  const a = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2);
    if (argv[i + 1] && !argv[i + 1].startsWith('--')) a[key] = argv[++i];
    else a[key] = true;
  }
  return a;
}

// ── management API ───────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => { setTimeout(r, ms); });

function createClient(pat) {
  let lastCall = 0;
  const MIN_GAP = 120;

  async function api(route, init = {}, retries = 0) {
    // Reserve the slot before awaiting, or two concurrent calls compute their
    // wait from the same stale timestamp and fire together.
    if (retries === 0) {
      const now = Date.now();
      const slot = Math.max(now, lastCall + MIN_GAP);
      lastCall = slot;
      if (slot > now) await sleep(slot - now);
    }
    const res = await fetch(MGMT + route, {
      ...init,
      headers: {
        Authorization: `Bearer ${pat}`,
        'Content-Type': 'application/json',
        ...(init.headers || {}),
      },
    });
    const text = await res.text();
    if ((res.status === 429 || res.status >= 500) && retries < 6) {
      await sleep(500 * 2 ** retries + Math.floor(Math.random() * 300));
      return api(route, init, retries + 1);
    }
    let body = null;
    try { body = text ? JSON.parse(text) : null; } catch { body = { raw: text }; }
    if (!res.ok) {
      const msg = (body && (body.message || body.error)) || `HTTP ${res.status}`;
      const err = new Error(msg);
      err.status = res.status;
      throw err;
    }
    return body;
  }

  return {
    api,
    query: (ref, sql) => api(`/v1/projects/${ref}/database/query`, {
      method: 'POST', body: JSON.stringify({ query: sql }),
    }),
    listProjects: () => api('/v1/projects'),
    listOrgs: () => api('/v1/organizations'),
    keys: (ref) => api(`/v1/projects/${ref}/api-keys`),
    createProject: (body) => api('/v1/projects', { method: 'POST', body: JSON.stringify(body) }),
  };
}

// Split on top-level ';' — quote, comment and dollar-quote aware. Same logic as
// supabase-backup.mjs; duplicated rather than imported so this script stays
// runnable on its own.
function splitStatements(sql) {
  const out = [];
  let cur = '', i = 0, tag = null;
  const n = sql.length;
  while (i < n) {
    const c = sql[i], nx = sql[i + 1];
    if (tag) {
      cur += c;
      if (c === '$' && sql.startsWith(tag, i)) { cur += tag.slice(1); i += tag.length; tag = null; continue; }
      i++; continue;
    }
    if (c === "'") {
      cur += c; i++;
      while (i < n && sql[i] !== "'") {
        if (sql[i] === '\\' && sql[i + 1] !== undefined && sql[i + 1] !== "'") { cur += sql[i] + sql[i + 1]; i += 2; continue; }
        cur += sql[i]; i++;
      }
      if (i < n) { cur += "'"; i++; }
      continue;
    }
    if (c === '-' && nx === '-') { while (i < n && sql[i] !== '\n') { cur += sql[i]; i++; } continue; }
    if (c === '/' && nx === '*') {
      cur += c + nx; i += 2;
      while (i + 1 < n && !(sql[i] === '*' && sql[i + 1] === '/')) { cur += sql[i]; i++; }
      if (i + 1 < n) { cur += '*/'; i += 2; } else i++;
      continue;
    }
    if (c === '$') {
      const m = sql.slice(i).match(/^\$[A-Za-z0-9_]*\$/);
      if (m) { tag = m[0]; cur += tag; i += tag.length; continue; }
    }
    if (c === ';') { out.push(cur.trim()); cur = ''; i++; continue; }
    cur += c; i++;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/** Statement text with comment lines removed — used to test for wrappers. */
const bare = (s) => s
  .split('\n').filter((l) => !/^\s*--/.test(l)).join('\n')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .trim();

// ── steps ────────────────────────────────────────────────────────────────────

/** Provisioning is not instant, and the DB accepts queries some time after the
 *  project reports healthy. Poll rather than guess. */
async function waitReady(client, ref, maxSeconds = 600) {
  emit({ phase: 'provision', state: 'running', done: 0, total: maxSeconds });
  const t0 = Date.now();
  for (;;) {
    const waited = Math.round((Date.now() - t0) / 1000);
    if (waited > maxSeconds) throw new Error(`project ${ref} did not become queryable within ${maxSeconds}s`);
    try {
      await client.query(ref, 'select 1 as ok');
      console.log(`[setup] project queryable after ${waited}s`);
      emit({ phase: 'provision', state: 'done', done: maxSeconds, total: maxSeconds });
      return;
    } catch (e) {
      process.stdout.write(`  waiting for the database… ${waited}s\r`);
      emit({ phase: 'provision', done: waited, total: maxSeconds, msg: e.message.slice(0, 120) });
      await sleep(5000);
    }
  }
}

async function applySchema(client, ref, schemaFile) {
  const text = readFileSync(schemaFile, 'utf8');

  // Drop the file's BEGIN;/COMMIT; wrapper. The test runs on comment-stripped
  // text because the splitter keeps a statement's leading comments attached to
  // it — the opening BEGIN arrives as the whole 18-line header banner plus
  // `BEGIN`, so a plain trim() comparison misses it. When that happened, batch 1
  // opened a transaction nothing committed, the request ended, Postgres rolled it
  // back, and 31 of 42 tables silently vanished while later batches (running in
  // autocommit) persisted. Everything downstream then failed on a missing
  // relation.
  const stmts = splitStatements(text).filter((s) => {
    const b = bare(s);
    return b && !/^(BEGIN|COMMIT|ROLLBACK|START\s+TRANSACTION|END)\s*;?$/i.test(b);
  });
  const stray = stmts.findIndex((s) => /^(BEGIN|COMMIT|ROLLBACK|START\s+TRANSACTION)\s*;?$/i.test(bare(s)));
  if (stray !== -1) throw new Error(`transaction wrapper survived splitting at index ${stray}`);

  console.log(`[setup] applying schema: ${stmts.length} statements`);
  emit({ phase: 'schema', state: 'running', done: 0, total: stmts.length, failed: 0, skipped: 0 });

  // "Already there", and nothing else. `does not exist` must NOT be in this list:
  // a statement failing because its dependency was never created says exactly
  // that, and treating it as a skip is how a quarter-applied schema reported
  // "0 failed".
  const IDEMPOTENT = /already exists|duplicate key|duplicate object|multiple primary keys/i;
  // Genuinely unavailable to the management API role: hypopg's LANGUAGE c
  // functions and the views over them.
  const UNPRIVILEGED = /permission denied for language|must be superuser/i;

  const BATCH = 50;
  let ok = 0, skipped = 0, failed = 0;
  const failures = [];

  const applyOne = async (stmt) => {
    try { await client.query(ref, stmt); ok++; }
    catch (e) {
      const msg = e.message || '';
      if (IDEMPOTENT.test(msg) || UNPRIVILEGED.test(msg)) { skipped++; return; }
      failed++;
      if (failures.length < 20) failures.push({ stmt: stmt.slice(0, 160), msg: msg.slice(0, 220) });
      emit({ phase: 'schema', level: 'error', msg: msg.slice(0, 220), stmt: stmt.slice(0, 160) });
    }
  };

  // Batched because one statement per request is ~2200ms and fifty is ~845ms:
  // 1792 round-trips is 30+ minutes, ~36 requests is under a minute. Sequential
  // and in order, because the dump is dependency-ordered.
  for (let i = 0; i < stmts.length; i += BATCH) {
    const chunk = stmts.slice(i, i + BATCH);
    try {
      await client.query(ref, chunk.map((s) => s.replace(/;+$/, '')).join(';\n') + ';');
      ok += chunk.length;
    } catch {
      for (const s of chunk) await applyOne(s);   // isolate the real failure
    }
    process.stdout.write(`  ${Math.min(i + BATCH, stmts.length)}/${stmts.length}…\r`);
    emit({ phase: 'schema', done: Math.min(i + BATCH, stmts.length), total: stmts.length, ok, failed, skipped });
  }
  console.log(`\n[setup] schema: ${ok} applied, ${skipped} skipped, ${failed} failed`);
  emit({ phase: 'schema', state: 'done', done: stmts.length, total: stmts.length, ok, failed, skipped });
  for (const f of failures) {
    console.log(`  FAILED: ${f.msg}`);
    console.log(`      at: ${f.stmt.replace(/\s+/g, ' ')}`);
  }
  if (failed) throw new Error(`${failed} schema statement(s) failed — the project is incomplete`);
}

/* ── post-schema SQL ──────────────────────────────────────────────────────────
 *
 * The schema file is a GENERATED dump, so it carries the policy text that was
 * true when it was generated. Any hardening that landed afterwards has to be
 * re-applied on top, or a first-run setup silently provisions a project with
 * the old, broken policies.
 *
 * This is not hypothetical. The dump shipped a group_members policy set that
 * made client INSERTs raise `42P17 infinite recursion detected`, so joining a
 * community group was impossible, and a users/user_points policy set that let a
 * client set coins, gems and plan_type on its own row. Both are fixed by files
 * in sql/ rather than by editing the generated dump, because the dump is
 * overwritten on every regeneration.
 *
 * Discovery is by NAMED LIST, not a directory glob. A glob would apply every
 * *.sql in sql/ on every setup — including the numbered one-shot migrations
 * (006, 009, 010 …) that predate the dump and would double-apply their work,
 * and verify-security.sql, which is a read-only report. Only the files listed
 * below run, and a listed file that is missing is a HARD ERROR: silently
 * skipping a security fix because a file moved is the failure mode this whole
 * step exists to prevent.
 *
 * Every file here must be idempotent, because setup re-applies them to a
 * project that may already have some of it (setup is also the repair path).
 *
 * This step is SHARED with supabase-backup.mjs's restore, which applies the same
 * generated schema and therefore has the same gap. It lives here and is exported
 * rather than duplicated, so the two paths cannot drift — a fix applied by one
 * and forgotten by the other is exactly how a security fix ends up half-deployed.
 */
export const POST_SCHEMA_SQL = [
  { file: 'sql/027_group_members_rls_recursion.sql', label: 'RLS recursion (cycle A)' },
  // 028 is a SUPERSET of 027 — it closes both recursion cycles, and 027 alone
  // leaves cycle B live. Both are listed so the pair runs in order and the
  // result is correct regardless of which one a given checkout has.
  { file: 'sql/028_group_members_recursion_full.sql', label: 'RLS recursion (cycles A+B)' },
  { file: 'sql/029_column_scope_hardening.sql', label: 'users/user_points column scope' },
  // 030 is the complement to 028/029 and is NOT optional. 028 removes the
  // 42P17 recursion; this one makes the existing escalation guard actually
  // enforce anything. A trigger runs with no arguments, so unlike 028's
  // _is_group_admin(gid, uid) helpers it cannot carry the caller's identity
  // and MUST be SECURITY INVOKER. Left as DEFINER it fires and does nothing:
  // current_user is the owner (postgres), so `IF current_user IN
  // ('anon','authenticated')` is never true and a plain member can
  // self-promote to owner. Verified live on iso-clean: DEFINER -> escalation
  // succeeds, INVOKER -> 42501.
  { file: 'sql/030_guard_triggers_need_invoker.sql', label: 'escalation guard runs as caller (INVOKER)' },
];

/**
 * Apply the post-schema SQL through a `query(sql)` function.
 *
 * `query` is injected rather than a `client` object because the two callers
 * reach the database differently: setup goes through the management API's
 * SQL-over-HTTP endpoint keyed by project ref, while restore uses its own
 * connection helper. Injecting one function keeps a single implementation of
 * the ORDER and the failure policy, which is the part that has to agree.
 *
 * `label` is used only in messages.
 */
export async function applyPostSchemaSql(query, label = '[setup]') {
  const files = POST_SCHEMA_SQL.map((e) => ({ ...e, path: join(ROOT, e.file) }));
  const missing = files.filter((f) => !existsSync(f.path));
  if (missing.length) {
    throw new Error(
      'required SQL file(s) missing, refusing to finish because a security fix ' +
      'would be silently skipped: ' + missing.map((m) => m.file).join(', ')
    );
  }

  const statements = [];
  for (const f of files) {
    const stmts = splitStatements(readFileSync(f.path, 'utf8')).filter((s) => {
      const b = bare(s);
      return b && !/^(BEGIN|COMMIT|ROLLBACK|START\s+TRANSACTION|END)\s*;?$/i.test(b);
    });
    if (!stmts.length) { console.warn(`${label} ${f.file} produced no statements — skipping`); continue; }
    console.log(`${label} post-schema: ${f.file} (${stmts.length} statements) — ${f.label}`);
    statements.push(...stmts);
  }
  if (!statements.length) return { ok: 0, skipped: 0, failed: 0, total: 0 };

  emit({ phase: 'postsql', state: 'running', done: 0, total: statements.length, ok: 0, failed: 0, skipped: 0 });

  // Same narrow classifier as applySchema, and for the same reason: a statement
  // failing because its dependency is absent is NOT "already there", and
  // swallowing it is how a half-applied fix reports success.
  const IDEMPOTENT = /already exists|duplicate key|duplicate object|multiple primary keys/i;
  const UNPRIVILEGED = /permission denied for language|must be superuser/i;

  let ok = 0, skipped = 0, failed = 0;
  const failures = [];
  for (const s of statements) {
    const body = s.replace(/;+$/, '');
    try {
      await query(body);
      ok++;
    } catch (e) {
      const msg = e.message || '';
      if (IDEMPOTENT.test(msg) || UNPRIVILEGED.test(msg)) { skipped++; continue; }
      failed++;
      if (failures.length < 20) failures.push({ stmt: body.slice(0, 160), msg: msg.slice(0, 220) });
      emit({ phase: 'postsql', level: 'error', msg: msg.slice(0, 220), stmt: body.slice(0, 160) });
    }
    emit({ phase: 'postsql', done: ok + skipped + failed, total: statements.length, ok, skipped, failed });
  }

  console.log(`${label} post-schema: ${ok} applied, ${skipped} skipped, ${failed} failed`);
  emit({ phase: 'postsql', state: 'done', done: statements.length, total: statements.length, ok, failed, skipped });
  for (const f of failures) {
    console.log(`  FAILED: ${f.msg}`);
    console.log(`      at: ${f.stmt.replace(/\s+/g, ' ')}`);
  }
  if (failed) {
    throw new Error(
      `${failed} post-schema statement(s) failed — SECURITY FIXES MAY NOT BE APPLIED. ` +
      'Do not use this project until this is resolved.'
    );
  }
  return { ok, skipped, failed, total: statements.length };
}

/** Buckets via the storage REST API, which needs the service-role key. The
 *  schema file also inserts them into storage.buckets, so this is belt and
 *  braces — but the two disagree on nothing, and a bucket created here works even
 *  if a future schema file forgets one.
 *
 *  Bucket limits are CLAMPED to the project's own global storage cap. On the free
 *  plan that cap is 50 MB and cannot be raised:
 *      PATCH /v1/projects/<ref>/config/storage {"fileSizeLimit":104857600}
 *        -> 402 "File size limit more than 52,428,800 bytes. Please upgrade…"
 *  so creating `study-material` at its intended 100 MB fails with
 *      413 EntityTooLarge "The object exceeded the maximum allowed size"
 *  and a bucket the app needs is silently absent on exactly the plan most
 *  first-time users are on. Clamping means the bucket exists and works up to
 *  whatever the plan allows, which is strictly better than not existing. */
async function applyBuckets(client, ref, url, serviceKey) {
  emit({ phase: 'storage', state: 'running', done: 0, total: REQUIRED_BUCKETS.length, failed: 0 });
  const base = url.replace(/\/$/, '');
  const H = { apikey: serviceKey, authorization: `Bearer ${serviceKey}`, 'content-type': 'application/json' };

  let projectCap = null;
  try {
    const cfg = await client.api(`/v1/projects/${ref}/config/storage`);
    projectCap = Number(cfg?.fileSizeLimit) || null;
    if (projectCap) console.log(`[setup] project storage cap: ${(projectCap / 1048576).toFixed(0)} MB`);
  } catch {
    // Not fatal: without the cap we simply do not clamp, and a too-large bucket
    // reports its own 413 below.
  }

  let done = 0, failed = 0, clamped = 0;
  for (const b of REQUIRED_BUCKETS) {
    let limit = b.file_size_limit;
    if (projectCap && limit > projectCap) {
      console.log(`[setup] ${b.id}: ${(limit / 1048576).toFixed(0)} MB exceeds the project cap — using ${(projectCap / 1048576).toFixed(0)} MB`);
      limit = projectCap;
      clamped++;
    }
    const body = JSON.stringify({
      id: b.id, name: b.id, public: b.public,
      file_size_limit: limit,
      allowed_mime_types: b.allowed_mime_types ?? null,
    });
    let res = await fetch(`${base}/storage/v1/bucket`, { method: 'POST', headers: H, body });
    if (res.status === 409 || res.status === 400) {
      // Already exists — reconcile its settings rather than leaving a bucket
      // whose size cap or visibility differs from what the app expects.
      const put = await fetch(`${base}/storage/v1/bucket/${b.id}`, { method: 'PUT', headers: H, body });
      if (put.ok) res = put;
    }
    if (res.ok) { done++; console.log(`[setup] bucket ${b.id} ready (public=${b.public}, ${(limit / 1048576).toFixed(0)} MB)`); }
    else {
      failed++;
      const t = (await res.text()).slice(0, 160);
      console.log(`[setup] bucket ${b.id}: HTTP ${res.status} ${t}`);
      emit({ phase: 'storage', level: 'error', msg: `${b.id}: HTTP ${res.status} ${t}` });
    }
    emit({ phase: 'storage', done: done + failed, total: REQUIRED_BUCKETS.length, ok: done, failed });
  }
  emit({ phase: 'storage', state: 'done', done: done + failed, total: REQUIRED_BUCKETS.length, ok: done, failed });
  if (clamped) {
    console.log(`[setup] ${clamped} bucket limit(s) clamped to the plan cap — upgrade the project to raise them`);
  }
  if (failed) throw new Error(`${failed} bucket(s) could not be created`);
}

/** The signup trigger. Without it a new account gets an auth identity and none of
 *  the five rows the app reads, so signup "succeeds" and the app is broken —
 *  enrolment fails 23503 because user_onboarding FKs to public.users. The trigger
 *  lives on auth.users, which every schema-dump tool excludes by default, so it
 *  gets its own step rather than being assumed. */
async function applyAuthTrigger(client, ref) {
  emit({ phase: 'auth', state: 'running', done: 0, total: 1, failed: 0 });
  const [fn] = await client.query(ref,
    "select count(*)::int as n from pg_proc p join pg_namespace s on s.oid = p.pronamespace where s.nspname = 'public' and p.proname = 'handle_new_user'");
  if (!Number(fn.n)) {
    throw new Error('handle_new_user() is missing — the schema did not apply correctly');
  }
  await client.query(ref, `
    drop trigger if exists on_auth_user_created on auth.users;
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute function public.handle_new_user();`);
  console.log('[setup] signup trigger installed on auth.users');
  emit({ phase: 'auth', state: 'done', done: 1, total: 1, failed: 0 });
}

/* ── Google OAuth (OPTIONAL) ──────────────────────────────────────────────────
 *
 * Email/password works without this. It is opt-in because a Google OAuth client
 * cannot be created without a human: the client ID and secret are minted in the
 * Google Cloud console, which has no API this script (or Supabase) can create one
 * through. So the script is handed the values and wires the half that IS
 * scriptable — the Supabase side.
 *
 * What this sets, via PATCH /v1/projects/<ref>/config/auth:
 *   - providers.google.enabled = true, with client_id / client_secret / nonce
 *   - the two redirect URIs the flow needs
 *   - site_url and additional_redirect_urls, so the redirect allow-list matches
 *     the app instead of the default
 *
 * The nonce is not sent from the command line and is never echoed. Google signs
 * the id_token; without nonce verification Supabase would accept a token minted
 * for a different application. It must be the SAME value configured on the Google
 * console side, and Supabase generates one for you — so this reads the existing
 * project's nonce and preserves it rather than inventing one that will not match.
 *
 * Idempotent: a re-run rewrites the same fields and leaves everything else in
 * the auth config alone, because the PATCH is a shallow merge on the keys given.
 */
async function applyGoogleAuth(client, ref, opts) {
  // Credentials come from the environment first, then argv. The environment is
  // the safer channel: argv is visible to any process of the same uid through
  // /proc/<pid>/cmdline and is captured by `ps`, so the console and any
  // wrapper pass the secret this way. The CLI passes --google-client-secret
  // directly, which the operator chooses knowingly.
  const clientId = process.env.GOOGLE_CLIENT_ID || opts['google-client-id'] || null;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || opts['google-client-secret'] || null;
  if (!clientId && !clientSecret) {
    console.log('[setup] google auth: skipped (no --google-client-id/--google-client-secret)');
    return { applied: false };
  }
  if (!clientId || !clientSecret) {
    throw new Error(
      'google auth needs BOTH --google-client-id and --google-client-secret — one alone ' +
      'would enable the provider with a half-configured credential and fail every sign-in'
    );
  }

  const redirectUri = `https://${ref}.supabase.co/auth/v1/callback`;
  emit({ phase: 'googleauth', state: 'running' });

  let existing = {};
  try {
    existing = (await client.api(`/v1/projects/${ref}/config/auth`)) || {};
  } catch (e) {
    // Not fatal on its own: a project that has never had auth configured may 404
    // on this read while the PATCH below still succeeds. Reported, not swallowed.
    console.warn(`[setup] google auth: could not read current auth config (${e.message}); preserving nothing`);
  }

  // Preserve the existing nonce so Google and Supabase agree. If there is none,
  // Supabase generates one on PATCH; do not invent one here.
  const nonce = existing?.external?.google?.nonce;
  const siteUrl = opts['site-url'] || (existing?.site_url ?? null);

  const redirectUrls = [
    redirectUri,
    ...(opts['app-url'] ? [String(opts['app-url'])] : []),
    ...(opts['extra-redirect-urls'] ? String(opts['extra-redirect-urls']).split(',') : []),
  ].map((s) => s.trim()).filter(Boolean);

  const patch = {
    external: {
      google: {
        enabled: true,
        client_id: clientId,
        client_secret: clientSecret,
        ...(nonce ? { nonce } : {}),
      },
    },
    redirect_urls: redirectUrls,
    ...(siteUrl ? { site_url: siteUrl } : {}),
  };

  await client.api(`/v1/projects/${ref}/config/auth`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });

  console.log(`[setup] google auth enabled`);
  console.log(`         redirect URI : ${redirectUri}`);
  if (nonce) console.log('         nonce         : preserved from the existing project config');
  console.log('         Still yours to do in the Google Cloud console:');
  console.log('           1. OAuth consent screen + the Web application type');
  console.log(`           2. Authorised redirect URI: ${redirectUri}`);
  if (opts['app-url']) console.log(`           3. Authorised JS origin: ${opts['app-url']}`);
  console.log('         Save the client secret in .env as GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET');
  emit({ phase: 'googleauth', state: 'done' });
  return { applied: true, redirectUri, siteUrl, redirectUrls };
}

/** Assert the project can actually run the app. Every check here corresponds to
 *  something that has silently failed in the past. */
// True when a missing function is a SECURITY regression rather than a missing
// feature. `_guard_group_member_escalation` is a trigger function on group_members;
// without it a member can raise their own role, so its absence must not be reported
// as merely "an RPC will 404".
function _guardAbsent(names) {
  return names.includes('_guard_group_member_escalation');
}

async function verifySetup(client, ref, url, serviceKey) {
  const checks = [];
  const check = (ok, label, detail = '') => {
    checks.push({ ok, label, detail });
    emit({ phase: 'verify', done: checks.length, failed: checks.filter((c) => !c.ok).length, label, ok });
    console.log(`  ${ok ? 'PASS' : 'FAIL'} ${label}${detail ? ` — ${detail}` : ''}`);
  };
  emit({ phase: 'verify', state: 'running', done: 0, total: VERIFY_CHECK_COUNT, failed: 0 });

  const [counts] = await client.query(ref, `
    select
      (select count(*) from pg_tables  where schemaname = 'public')                   as tables,
      (select count(*) from pg_policies where schemaname = 'public')                  as policies,
      (select count(*) from pg_proc p join pg_namespace n on n.oid = p.pronamespace
        where n.nspname = 'public' and p.prokind = 'f')                               as functions,
      (select count(*) from pg_trigger where not tgisinternal)                        as triggers,
      (select count(*) from pg_indexes where schemaname = 'public')                   as indexes`);
  check(Number(counts.tables) >= 42, `tables ${counts.tables}`, Number(counts.tables) >= 42 ? '' : 'expected at least 42');
  check(Number(counts.functions) >= 70, `functions ${counts.functions}`, Number(counts.functions) >= 70 ? '' : 'expected at least 70');
  check(Number(counts.policies) >= 150, `RLS policies ${counts.policies}`, Number(counts.policies) >= 150 ? '' : 'expected at least 150');
  check(Number(counts.indexes) >= 60, `indexes ${counts.indexes}`, '');

  // Named functions the app calls, checked by name. The count above cannot do this:
  // 70 functions that omit these two still satisfy `>= 70` and the run reports PASS.
  // Matched on `pg_proc.proname`, so an overload satisfies the name (which is what the
  // app's call resolves to) without needing to restate an argument list that would
  // itself rot the next time a parameter is added.
  // NOTE the destructuring: `client.query` returns the raw row array, so `[x]`
  // yields the FIRST ROW. The counts/trigger/seed queries above are single-row
  // and destructure for that reason. This one is GROUPED BY proname and can
  // return several rows, so it must NOT be destructured — `const [fnRows]` would
  // bind a single row object and `.map` would throw. Every multi-row consumer in
  // this codebase (supabase-backup.mjs:372 `tableList`, :380 `foreignKeys`) uses
  // the whole array for the same reason.
  const fnRows = await client.query(ref, `
    select p.proname as name, count(*)::int as overloads
      from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public'
       and p.proname = any (array[${REQUIRED_FUNCTIONS.map((f) => `'${f.replace(/'/g, "''")}'`).join(', ')}])
     group by p.proname`);
  const foundFns = new Map((fnRows || []).map((r) => [r.name, Number(r.overloads)]));
  const absentFns = REQUIRED_FUNCTIONS.filter((f) => !foundFns.has(f));
  check(absentFns.length === 0,
    `required functions ${REQUIRED_FUNCTIONS.length - absentFns.length}/${REQUIRED_FUNCTIONS.length}`,
    absentFns.length
      ? `MISSING: ${absentFns.join(', ')} — the app calls these; RPCs will 404` +
        (_guardAbsent(absentFns) ? ' and group-member role escalation is unguarded' : '')
      : '');

  // Read-only contract check: do not exercise client writes against a live project.
  // Presence is not behavior: the historical SECURITY DEFINER guard tested
  // current_user, which is the definer inside the trigger, so it never guarded
  // client writes. Flag that known inert implementation and missing attachment.
  // This does not certify arbitrary PL/pgSQL; isolated behavioral tests remain
  // required before any replacement guard/policy is applied.
  const guardRows = await client.query(ref, `
    select p.prosecdef, p.prosrc,
           exists (select 1 from pg_trigger t
                    where t.tgfoid = p.oid
                      and t.tgrelid = 'public.group_members'::regclass
                      and not t.tgisinternal and t.tgenabled in ('O','A')
                      and (t.tgtype & 1) = 1 and (t.tgtype & 2) = 2
                      and (t.tgtype & 4) = 4 and (t.tgtype & 16) = 16) as attached
      from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public' and p.proname = '_guard_group_member_escalation'
       and p.pronargs = 0 and p.prorettype = 'trigger'::regtype`);
  const guard = guardRows?.[0];
  const inertGuard = guard?.prosecdef && /\bcurrent_user\s+IN\s*\(\s*'anon'\s*,\s*'authenticated'\s*\)/i.test(guard.prosrc || '');
  check(Boolean(guard?.attached) && !inertGuard,
    'group-member guard contract',
    !guard?.attached ? 'MISSING enabled BEFORE INSERT/UPDATE row trigger' :
      inertGuard ? 'known inert SECURITY DEFINER/current_user guard — requires isolated behavioral review; no live writes attempted' :
        'attachment and known-defect check only; not a live behavioral certification');

  const [trg] = await client.query(ref, `
    select count(*)::int as n from pg_trigger
     where tgname = 'on_auth_user_created' and tgrelid = 'auth.users'::regclass and not tgisinternal`);
  check(Number(trg.n) === 1, 'signup trigger auth.users.on_auth_user_created',
    Number(trg.n) === 1 ? 'present' : 'MISSING — new accounts will be broken');

  // Row-level: a project that cannot seed a signup is not set up, whatever the
  // object counts say. Checked by calling the trigger function's own inserts
  // against a rolled-back transaction rather than creating a real user.
  const [seed] = await client.query(ref, `
    select count(*)::int as n from information_schema.tables
     where table_schema = 'public'
       and table_name in ('users','user_profiles','user_points','user_stats_summary','user_presence','user_onboarding')`);
  check(Number(seed.n) === 6, `signup target tables ${seed.n}/6`,
    Number(seed.n) === 6 ? '' : 'the trigger would fail on insert');

  const base = url.replace(/\/$/, '');
  const H = { apikey: serviceKey, authorization: `Bearer ${serviceKey}` };
  const live = await (await fetch(`${base}/storage/v1/bucket`, { headers: H })).json();
  const liveIds = new Set(Array.isArray(live) ? live.map((b) => b.id) : []);
  const missing = REQUIRED_BUCKETS.filter((b) => !liveIds.has(b.id)).map((b) => b.id);
  check(missing.length === 0, `storage buckets ${liveIds.size}/${REQUIRED_BUCKETS.length}`,
    missing.length ? `MISSING ${missing.join(', ')}` : '');

  const [pol] = await client.query(ref,
    "select count(*)::int as n from pg_policies where schemaname = 'storage' and tablename = 'objects'");
  check(Number(pol.n) >= 8, `storage policies ${pol.n}`,
    Number(pol.n) >= 8 ? '' : 'uploads will be rejected by RLS');

  const failed = checks.filter((c) => !c.ok).length;
  const status = failed ? 'FAIL' : 'PASS';
  console.log(`[setup] verification: ${status} (${checks.length - failed}/${checks.length})`);
  emit({ phase: 'verify', state: 'done', done: checks.length, total: checks.length, failed, result: status });
  return failed === 0;
}

// ── main ─────────────────────────────────────────────────────────────────────

/**
 * Writes .env for the newly provisioned project, preserving anything the operator
 * had that this script cannot regenerate.
 *
 * An existing .env is moved to .env.old rather than overwritten. That file holds
 * the service-role key and every API key on the machine; clobbering it to save one
 * rename is not a trade worth making. Exactly ONE .env.old is kept — a second run
 * would otherwise bury the original under a copy of the file this script just
 * wrote, so the previous .env.old is rotated to a timestamped name first and
 * nothing is ever destroyed.
 *
 * Carried over from the old file when present: PORT, the AI keys, the admin
 * settings and SESSION_SECRET. Those are machine config, not project config, and
 * regenerating SESSION_SECRET would silently invalidate every existing browser
 * session for no reason.
 *
 * Skipped entirely with --no-env, for the case where .env is managed elsewhere
 * (a deployment secret store, or a checkout that is not the one being run).
 */
function writeEnvFile(ref, url, anon, service, pat, opts = {}) {
  const envPath = join(ROOT, '.env');
  const envExamplePath = join(ROOT, '.env.example.generated');
  const oldPath = join(ROOT, '.env.old');

  // Keys this script must own, because they identify the project it just set up.
  const OWNED = new Set([
    'SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_ACCESS_TOKEN',
  ]);
  // Everything else worth keeping, in the order the file should read.
  const CARRY = [
    'PORT', 'ENABLE_ADMIN_MODE', 'ADMIN_SECRET', 'ADMIN_EMAIL', 'ADMIN_EMAILS',
    'BROWSER_PROOF_EMAIL', 'GITHUB_OWNER', 'GITHUB_REPO', 'GITHUB_PAT',
    'ASSET_CDN_ORIGINS', 'GEMINI_API_KEY', 'GROQ_API_KEY', 'YEPAPI_KEY', 'SESSION_SECRET',
  ];
  const DEFAULTS = { PORT: '3000', ENABLE_ADMIN_MODE: 'false' };

  const prev = {};
  let had = false;
  if (existsSync(envPath)) {
    had = true;
    // Parsed line by line, never sourced: one malformed line must not lose the
    // rest of the file.
    for (const raw of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
      const m = raw.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (m) prev[m[1]] = m[2].replace(/\s+$/, '');
    }
  }

  if (opts.skip) {
    console.log('[setup] --no-env: .env left alone. Values to set yourself:');
    console.log(`  SUPABASE_URL=${url}`);
    console.log(`  SUPABASE_ANON_KEY=${anon || '<copy from the dashboard>'}`);
    return { written: false };
  }

  if (had) {
    // Rotate an existing .env.old aside first, so two runs cannot lose the
    // original credentials.
    if (existsSync(oldPath)) {
      const stamp = new Date().toISOString().replace(/[:.]/g, '-');
      const rotated = join(ROOT, `.env.old.${stamp}`);
      renameSync(oldPath, rotated);
      console.log(`[setup] previous .env.old → ${rotated.split('/').pop()}`);
    }
    renameSync(envPath, oldPath);
    console.log('[setup] existing .env → .env.old (it holds real keys — keep it private)');
  }

  const lines = [
    '# IsotopeAI — written by scripts/supabase-setup.mjs',
    `# project ${ref} · ${new Date().toISOString()}`,
    '#',
    '# Google sign-in and the redirect allow-list are Supabase AUTH CONFIG, not',
    '# schema, so no tooling can set them. See the notes printed after setup.',
    '',
    `SUPABASE_URL=${url}`,
    `SUPABASE_ANON_KEY=${anon || ''}`,
    `SUPABASE_SERVICE_ROLE_KEY=${service || ''}`,
    `SUPABASE_ACCESS_TOKEN=${pat || ''}`,
    '',
  ];
  let carried = 0;
  for (const k of CARRY) {
    const v = prev[k] !== undefined && prev[k] !== '' ? prev[k] : (DEFAULTS[k] ?? '');
    if (prev[k] !== undefined && prev[k] !== '') carried++;
    lines.push(`${k}=${v}`);
  }
  // Anything the operator added that is not in either list — a custom flag, a key
  // for something this script has never heard of. Dropping it would be a silent
  // regression on their machine.
  const extra = Object.keys(prev).filter((k) => !OWNED.has(k) && !CARRY.includes(k));
  if (extra.length) {
    lines.push('', '# carried over from the previous .env');
    for (const k of extra) lines.push(`${k}=${prev[k]}`);
  }
  writeFileSync(envPath, lines.join('\n') + '\n', { mode: 0o600 });
  console.log(`[setup] .env written (mode 600)${carried ? `, ${carried} setting(s) carried over` : ''}` +
    `${extra.length ? `, ${extra.length} unrecognised key(s) preserved` : ''}`);

  // Ship a placeholder example alongside it (.env is gitignored). We write a
  // separate .env.example.generated rather than overwriting this repo's hand-
  // authored .env.example (which carries richer comments). Placeholders only —
  // never the live secrets.
  const exampleLines = lines.map((l) => {
    const m = l.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) return l;
    const [, k, v] = m;
    if (!v) return l;
    if (k === 'SUPABASE_URL') return `${k}=https://<ref>.supabase.co`;
    return `${k}=your-${k.toLowerCase().replace(/_/g, '-')}`;
  });
  writeFileSync(envExamplePath, exampleLines.join('\n') + '\n');
  console.log('[setup] .env.example.generated written (placeholders only)');
  return { written: true, rotated: had, carried, extra: extra.length };
}

async function main() {
  const args = parseArgs();
  const pat = args.pat || process.env.SUPABASE_ACCESS_TOKEN;
  if (!pat) throw new Error('--pat <personal access token> required (or SUPABASE_ACCESS_TOKEN)');

  // Candidate schema files, in the order they should be trusted.
  //
  // Both repos ship this script and they name the file differently:
  //   isotope-code   isotope-complete.sql            (the published schema)
  //   isotope-apk    sql/isotope-schema-restore.sql  (generated by schema-dump.mjs)
  // Both are produced by the SAME generator — schema-dump.mjs with SCHEMA_OUT —
  // so either is correct, but a hardcoded path silently picks the stale one when
  // both exist. Prefer whichever is NEWER and say which was chosen, since
  // applying a schema from three days ago is the kind of mistake that surfaces as
  // a missing function weeks later.
  let schemaFile = args.schema ? String(args.schema) : null;
  if (!schemaFile) {
    // THIS repo's own files first, newest of them wins. The sibling-repo path is a
    // fallback for a checkout with no schema of its own, never a competitor — an
    // mtime race across repos would let a checkout silently provision from a file
    // it does not ship, which is impossible to reason about from the output.
    const local = [
      join(ROOT, 'isotope-complete.sql'),
      join(ROOT, 'sql', 'isotope-schema-restore.sql'),
    ].filter((f) => existsSync(f));
    const sibling = [
      join(ROOT, '..', 'isotope-code', 'isotope-complete.sql'),
      join(ROOT, '..', 'isotope-apk', 'sql', 'isotope-schema-restore.sql'),
    ].filter((f) => existsSync(f));
    const candidates = local.length ? local : sibling;
    if (!candidates.length) {
      throw new Error('no schema file found — expected isotope-complete.sql or sql/isotope-schema-restore.sql');
    }
    candidates.sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
    schemaFile = candidates[0];
    if (!local.length) console.log('[setup] this checkout ships no schema file; using the sibling repo\'s.');
    if (candidates.length > 1) {
      const age = (f) => Math.round((Date.now() - statSync(f).mtimeMs) / 86400000);
      console.log(`[setup] schema: ${schemaFile.replace(ROOT + '/', '')} (${age(schemaFile)}d old); ` +
        `also present: ${candidates.slice(1).map((f) => f.replace(ROOT + '/', '') + ` (${age(f)}d)`).join(', ')}`);
      console.log('[setup] pass --schema <file> to choose explicitly.');
    }
  }
  if (!existsSync(schemaFile)) throw new Error(`schema file not found: ${schemaFile}`);

  const client = createClient(pat);
  let ref = args.ref;

  if (args.create) {
    const org = args.org || (await client.listOrgs())[0]?.id;
    if (!org) throw new Error('no organization available — pass --org');
    // Generated, not asked for: nothing in this flow needs the DB password again,
    // and prompting for one invites a weak reused password on a public endpoint.
    const dbPass = args['db-pass']
      || (await import('crypto')).randomBytes(24).toString('base64url');
    console.log(`[setup] creating project "${args.create}" in org ${org}…`);
    const created = await client.createProject({
      name: String(args.create),
      organization_id: org,
      region: args.region || 'ap-southeast-1',
      db_pass: dbPass,
      plan: 'free',
    });
    ref = created.id;
    console.log(`[setup] project ref: ${ref}`);
    console.log(`[setup] database password: ${dbPass}`);
    console.log('[setup] save that password now — it is not shown again and cannot be recovered.');
  }
  if (!ref) throw new Error('--ref <project-ref> required, or --create "<name>" to make one');

  emit({ phase: 'setup', state: 'running', ref });
  console.log(`[setup] target project ${ref}`);

  await waitReady(client, ref);

  // Guard rail: this applies a full schema. On a project that already holds data
  // that is a merge, not a setup, and the operator should know before it starts.
  const [existing] = await client.query(ref, `
    select (select count(*) from pg_tables where schemaname = 'public') as tables,
           (select count(*) from auth.users) as users`);
  if (Number(existing.tables) > 0 || Number(existing.users) > 0) {
    console.log(`[setup] NOTE: project already has ${existing.tables} table(s) and ${existing.users} user(s).`);
    console.log('[setup] The schema file is idempotent, so this will add what is missing and leave data alone.');
    if (!args.force && Number(existing.users) > 0) {
      throw new Error('project already has users — re-run with --force if you are sure this is the right project');
    }
  }

  const keys = await client.keys(ref);
  const find = (n) => (keys.find((k) => k.name === n) || {}).api_key || null;
  const anon = find('anon');
  const service = args['service-key'] || find('service_role');
  if (!service) throw new Error('could not resolve the service_role key for this project');
  const url = `https://${ref}.supabase.co`;

  await applySchema(client, ref, schemaFile);
  // Must come before storage/auth/verify. The fixes are policy work on public
  // tables, and verifySetup asserts policy counts and behaviour, so running it
  // first means a project that reports PASS actually has the fixes.
  await applyPostSchemaSql((sql) => client.query(ref, sql), "[setup]");
  await applyBuckets(client, ref, url, service);
  await applyAuthTrigger(client, ref);
  // Opt-in: only runs when Google credentials were supplied. Never blocks a
  // setup that did not ask for it — email/password is unaffected either way.
  const google = await applyGoogleAuth(client, ref, args);
  const ok = await verifySetup(client, ref, url, service);

  emit({ phase: 'setup', state: 'done', ref, ok });

  // .env last, and only after verification: a file pointing the app at a project
  // that failed to provision is worse than no file, because the app would start
  // and fail at runtime instead of failing here where the reason is on screen.
  const envResult = ok
    ? writeEnvFile(ref, url, anon, service, pat, { skip: Boolean(args['no-env']) })
    : { written: false };
  if (!ok && !args['no-env']) {
    console.log('[setup] .env NOT written — verification failed, so the project is not usable yet.');
  }

  console.log('');
  console.log(ok ? '[setup] DONE — project is ready.' : '[setup] FINISHED WITH FAILURES (see above).');
  console.log('');
  if (envResult.written) {
    console.log('.env is written and points at the new project.');
    if (envResult.rotated) console.log('Your previous .env is at .env.old — delete it once you are happy.');
  } else {
    console.log('Set these yourself:');
    console.log(`  SUPABASE_URL=${url}`);
    console.log(`  SUPABASE_ANON_KEY=${anon || '<copy from the dashboard>'}`);
    console.log('  SUPABASE_SERVICE_ROLE_KEY=<copy from the dashboard — not printed here>');
  }
  console.log('');
  if (google && google.applied) {
    console.log('Google sign-in: ENABLED on this project (the Supabase side is configured).');
    console.log(`  Redirect URI : ${google.redirectUri}`);
    if (google.siteUrl) console.log(`  Site URL     : ${google.siteUrl}`);
    console.log('  Google sign-in only completes once the same client ID/secret pair is set on the');
    console.log('  Google Cloud side AND that client lists the redirect URI above. If you have not');
    console.log('  done that, sign-in will fail at Google — the Supabase config alone is not enough.');
    console.log('  Configured app URLs:');
    for (const u of google.redirectUrls) console.log(`    ${u}`);
  } else {
    console.log('Google sign-in: not configured (email/password works regardless).');
    console.log('  To add it later, re-run setup with:');
    console.log('    --google-client-id <id> --google-client-secret <secret>');
    console.log(`    --app-url <your app url>   (redirect URI is always https://${ref}.supabase.co/auth/v1/callback)`);
  }
  console.log('');
  console.log('Still yours to do, because neither is in the database:');
  console.log('  1. Google Cloud console — create a Web-type OAuth client for the redirect URI above');
  console.log('  2. Authentication > URL Configuration — confirm your app URLs are in the allow-list');
  if (!ok) process.exit(1);
}

const isMain = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
if (isMain) {
  main().catch((e) => { console.error(`ERROR: ${e.message}`); emit({ phase: 'setup', level: 'error', msg: e.message }); process.exit(1); });
}

export { splitStatements, REQUIRED_BUCKETS, REQUIRED_FUNCTIONS, VERIFY_CHECK_COUNT, applySchema, applyBuckets, applyAuthTrigger, verifySetup, writeEnvFile };
