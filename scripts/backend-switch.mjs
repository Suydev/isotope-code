#!/usr/bin/env node
/**
 * backend-switch.mjs — apply numbered schema migrations to a Supabase project.
 *
 *   node scripts/backend-switch.mjs migrate --ref abc123 [--from 029] [--only 029] [--list] [--dry-run]
 *
 * Why this file exists. `transfer.mjs` has spawned `backend-switch.mjs migrate`
 * since commit 1367a88, but no such file ever existed in this repository — the
 * spawn died with "Cannot find module", `transfer.mjs` swallowed the non-zero
 * exit, set `migrationFailures = 1`, and went on to print "transfer complete".
 * A transfer reported itself as successful while applying zero migrations.
 * The implementation lived the whole time in the sibling repo
 * (`~/isotope-apk/scripts/backend-switch.mjs`) and was never copied here, so
 * this is that migrate verb, re-homed onto the helpers this repo already has.
 *
 * Where the migrations live. NOT `ROOT/supabase` — this repo has no such
 * directory. The canonical numbered store is the sibling `isotope-apk`
 * checkout, which is what `schema-dump.mjs` itself treats as the source of
 * truth for the watermark:
 *
 *   scripts/schema-dump.mjs:87
 *   const APPLIED_FILE = join(ROOT, '..', 'isotope-apk', 'supabase', '.applied');
 *
 * So the watermark in `isotope-complete.sql` is read from that store, and the
 * migrations above it are read from that same store. Override with
 * ISO_MIGRATIONS_DIR when the store is somewhere else.
 *
 * The watermark contract: `schema-dump.mjs` bakes the end state of every
 * numbered migration up to `supabase/.applied` into the dump. Only files
 * numbered strictly ABOVE that watermark are new work, and only those are
 * applied to a transfer target. Replaying the whole history is not redundant,
 * it is destructive — four conflicting definitions of accept_invite /
 * get_invite_details mean filename order cannot reproduce live.
 *
 * Secrets: the PAT is read from SUPABASE_ACCESS_TOKEN, never from argv.
 */

'use strict';

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { splitStatements } from './supabase-setup.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MGMT = 'https://api.supabase.com';

/**
 * Candidate numbered-migration directories, most specific first. The sibling
 * isotope-apk checkout is canonical because schema-dump.mjs reads its
 * `.applied` from there; ROOT/supabase is kept so this repo can grow its own
 * store without another edit.
 */
const MIGRATION_DIR_CANDIDATES = [
  process.env.ISO_MIGRATIONS_DIR,
  join(ROOT, 'supabase'),
  join(ROOT, '..', 'isotope-apk', 'supabase'),
].filter(Boolean);

const say = (s) => console.log(`[switch] ${s}`);
const warn = (s) => console.error(`[switch] ${s}`);

// ── arg parsing ──────────────────────────────────────────────────────────────

export function parseArgs(argv) {
  const a = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    let key, value;
    const eq = arg.indexOf('=');
    if (eq !== -1) {
      key = arg.slice(2, eq);
      value = arg.slice(eq + 1);
    } else {
      key = arg.slice(2);
      value = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
    }
    if (a[key] === undefined) a[key] = value;
    else a[key] = [].concat(a[key], value);
  }
  return a;
}

// ── migration discovery ──────────────────────────────────────────────────────

/**
 * First candidate directory that exists and actually holds numbered migrations.
 * Throws when none does — an absent migration store is a hard error, never a
 * silent "nothing to do", because "no directory" and "no pending files" are
 * different facts and only one of them means the target is up to date.
 */
export function resolveMigrationsDir(candidates = MIGRATION_DIR_CANDIDATES) {
  const seen = [];
  for (const dir of candidates) {
    if (seen.includes(dir)) continue;
    seen.push(dir);
    if (!existsSync(dir)) continue;
    let entries;
    try { entries = readdirSync(dir); } catch { continue; }
    if (entries.some((f) => f.endsWith('.sql') && migrationKey(f))) return dir;
  }
  throw new Error(
    `no numbered-migration directory found — looked in: ${seen.join(', ')}. ` +
    'The migrations are the input to this verb; without them it cannot do anything, ' +
    'so it refuses rather than reporting a vacuous success. Set ISO_MIGRATIONS_DIR to override.',
  );
}

/** `013b_harden_rls.sql` → { num: '013', letter: 'b', key: '013b' }. */
export function migrationKey(name) {
  const m = /^(\d{3})([a-z]?)_/.exec(basename(name));
  return m ? { num: m[1], letter: m[2], key: m[1] + m[2] } : null;
}

export function listMigrations(dir) {
  return readdirSync(dir)
    .filter((f) => f.endsWith('.sql') && migrationKey(f))
    .sort((a, b) => {
      const ka = migrationKey(a).key, kb = migrationKey(b).key;
      return ka < kb ? -1 : ka > kb ? 1 : a.localeCompare(b);
    });
}

/**
 * Files to apply. `from` is EXCLUSIVE (the watermark is already in the dump);
 * `only` pins an exact migration. `_rollback_*.sql` files never match because
 * they do not start with three digits — deliberate: a rollback re-breaks
 * working code.
 */
export function selectMigrations(files, { from, only } = {}) {
  const norm = (v) => String(v).trim().replace(/\.sql$/i, '').replace(/^(\d{1,3})/, (m) => m.padStart(3, '0'));
  const fromKey = from ? (migrationKey(norm(from) + '_x') || {}).key : null;
  return files.filter((f) => {
    const k = migrationKey(f);
    if (!k) return false;
    if (only) {
      const o = norm(only);
      return f === `${o}.sql` || f.startsWith(`${o}_`) || k.key === o;
    }
    if (fromKey && !(k.key >= fromKey)) return false;
    return true;
  });
}

// ── SQL execution ────────────────────────────────────────────────────────────

/** Management-API query. Same channel transfer.mjs already uses. */
export async function adminQuery(pat, ref, sql) {
  const res = await fetch(`${MGMT}/v1/projects/${ref}/database/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${pat}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: sql }),
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

const bareStmt = (s) => s
  .split('\n').filter((l) => !/^\s*--/.test(l)).join('\n')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .trim();

const TXN = /^(BEGIN|COMMIT|ROLLBACK|START\s+TRANSACTION|END)\s*;?$/i;
const IDEMPOTENT = /already exists|duplicate key|duplicate object|multiple primary keys/i;

export async function applyMigration(pat, ref, dir, file, { dryRun = false, log = say } = {}) {
  const text = readFileSync(join(dir, file), 'utf8');
  const stmts = splitStatements(text).filter((s) => bareStmt(s) && !TXN.test(bareStmt(s)));
  if (dryRun) {
    log(`${file}: ${stmts.length} statement(s) [dry-run]`);
    return { file, statements: stmts.length, ok: 0, skipped: 0, failed: 0, dryRun: true };
  }
  let ok = 0, skipped = 0, failed = 0;
  const failures = [];
  const BATCH = 50;
  for (let i = 0; i < stmts.length; i += BATCH) {
    const chunk = stmts.slice(i, i + BATCH);
    try {
      await adminQuery(pat, ref, chunk.map((s) => s.replace(/;+$/, '')).join(';\n') + ';');
      ok += chunk.length;
    } catch {
      // Batched call failed: retry statement by statement so one bad statement
      // cannot mask the fate of the rest.
      for (const s of chunk) {
        try { await adminQuery(pat, ref, s); ok++; }
        catch (e) {
          if (IDEMPOTENT.test(e.message || '')) skipped++;
          else { failed++; if (failures.length < 10) failures.push({ stmt: s.slice(0, 160), msg: (e.message || '').slice(0, 200) }); }
        }
      }
    }
  }
  log(`${file}: ${ok} applied, ${skipped} already-present, ${failed} failed`);
  for (const f of failures) warn(`  FAILED: ${f.msg}\n    at ${f.stmt}`);
  return { file, statements: stmts.length, ok, skipped, failed, failures };
}

// ── migrate ──────────────────────────────────────────────────────────────────

export async function cmdMigrate(args, env) {
  const pat = args.pat || env.SUPABASE_ACCESS_TOKEN;
  if (!pat) throw new Error('migrate requires --pat or SUPABASE_ACCESS_TOKEN');
  const ref = args.ref;
  if (!ref) throw new Error('migrate requires --ref <project-ref>');

  // Resolve the store BEFORE deciding there is nothing to do. If the store is
  // missing this throws; it never returns an empty list that reads as success.
  const dir = resolveMigrationsDir();
  const all = listMigrations(dir);
  const files = selectMigrations(all, args);

  say(`migration store: ${dir} (${all.length} committed migration(s))`);

  if (!files.length) {
    const from = args.from ? ` above ${args.from}` : '';
    say(`nothing to apply${from} — the target already carries every committed migration`);
    return { dir, total: all.length, applied: [], failed: 0 };
  }

  say(`${args['dry-run'] ? '[dry-run] ' : ''}applying ${files.length} migration(s) to ${ref}`);
  const applied = [];
  let failed = 0;
  for (const f of files) {
    const r = await applyMigration(pat, ref, dir, f, { dryRun: Boolean(args['dry-run']) });
    applied.push(r);
    failed += r.failed || 0;
  }
  if (failed) {
    // Non-zero exit. transfer.mjs's run() rejects on this, which is the whole
    // point: the caller must be able to tell that migrations did not complete.
    warn(`${failed} statement(s) failed`);
    const err = new Error(`${failed} statement(s) failed across ${files.length} migration(s)`);
    err.failed = failed;
    throw err;
  }
  say(`done — ${files.length} migration(s) applied`);
  return { dir, total: all.length, applied, failed: 0 };
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  const [verb, ...rest] = process.argv.slice(2);
  const args = parseArgs(rest);

  switch (verb) {
    case 'migrate':
      return cmdMigrate(args, process.env);
    case 'list': {
      const dir = resolveMigrationsDir();
      const all = listMigrations(dir);
      const files = selectMigrations(all, args);
      say(`migration store: ${dir} (${all.length} committed)`);
      say(`${files.length} selected${args.from ? ` from ${args.from}` : ''}${args.only ? ` matching ${args.only}` : ''}:`);
      for (const f of files) say(`  ${f}`);
      return;
    }
    case 'migrate-dry-run':
      return cmdMigrate({ ...args, 'dry-run': true }, process.env);
    default:
      console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8')
        .split('\n').filter((l) => /^\s*(\*|node scripts\/backend-switch)/.test(l))
        .map((l) => l.replace(/^\s*\*\/?\s?/, '').replace(/^\s*\*\s?/, ''))
        .join('\n').slice(0, 1400));
      if (verb) { warn(`unknown verb: ${verb}`); process.exit(2); }
  }
}

const isMain = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
if (isMain) {
  main().catch((e) => {
    warn(`ERROR: ${e.message}`);
    process.exit(1);
  });
}