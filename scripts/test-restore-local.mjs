#!/usr/bin/env node
// Restore-pipeline validation against a local Postgres cluster.
// Exercises the exact SQL-building code from supabase-backup.mjs
// (lit/castFor/splitStatements/chunkRows) without needing a second Supabase.
// Usage: node scripts/test-restore-local.mjs <backup-dir> [pg-socket-dir]
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { execFileSync } from 'child_process';
import { lit, splitStatements, chunkRows } from './supabase-backup.mjs';

const src = process.argv[2] || 'backups/work-test';
const socketDir = process.argv[3] || '/data/data/com.termux/files/home/.cache/opencode/tmp/pgscratch';
const psqlLoose = (sql) => execFileSync('psql', [
  '-h', socketDir, '-p', '55432', '-U', 'postgres', '-d', 'isorest',
  '-v', 'ON_ERROR_STOP=0', '-q',
], { input: sql, encoding: 'utf8', maxBuffer: 1 << 26 }).toString();
const psqlStrict = (sql) => execFileSync('psql', [
  '-h', socketDir, '-p', '55432', '-U', 'postgres', '-d', 'isorest',
  '-v', 'ON_ERROR_STOP=1', '-q',
], { input: sql, encoding: 'utf8', maxBuffer: 1 << 26 }).toString();
const psqlOut = (sql) => execFileSync('psql', [
  '-h', socketDir, '-p', '55432', '-U', 'postgres', '-d', 'isorest', '-t', '-A',
], { input: sql, encoding: 'utf8', maxBuffer: 1 << 26 }).toString().trim();

const manifest = JSON.parse(readFileSync(join(src, 'manifest.json'), 'utf8'));
const dbDir = join(src, 'db');

console.log('--- 0. roles (supabase roles absent on scratch)');
psqlLoose("create role anon nologin; create role authenticated nologin; create role service_role nologin;");
psqlLoose('create schema if not exists auth;');

console.log('--- 1. schema');
if (existsSync(join(src, 'schema.sql'))) {
  const stmts = splitStatements(readFileSync(join(src, 'schema.sql'), 'utf8'));
  let ok = 0, failed = 0;
  for (const stmt of stmts) {
    try { psqlLoose(stmt); ok++; }
    catch (e) { failed++; if (failed <= 10) console.log(`  FAILED: ${e.message.split('\n')[0]}`); }
  }
  console.log(`schema: ${ok} ok, ${failed} failed`);
} else console.log('no schema.sql');

console.log('--- 2. auth.users stub + data');
const authFile = join(dbDir, 'auth.users.jsonl');
if (existsSync(authFile)) {
  const rows = readFileSync(authFile, 'utf8').split('\n').filter(Boolean).map(JSON.parse);
  const cols = manifest.auth_columns;
  const colDefs = cols.map((c) => `"${c.name}" ${c.cast}`).join(', ');
  psqlStrict(`create table if not exists auth.users (${colDefs});`);
  let ok = 0, failed = 0;
  for (const chunk of chunkRows(rows, 25)) {
    const values = chunk.map((r) => `(${cols.map((c) => lit(r[c.name], c.cast)).join(', ')})`).join(', ');
    try { psqlStrict(`insert into auth.users ("id") values (NULL); rollback;`); } catch {}
    try {
      psqlStrict(`insert into auth.users (${cols.map((c) => `"${c.name}"`).join(', ')}) values ${values} on conflict (id) do nothing;`);
      ok += chunk.length;
    } catch (e) { failed += chunk.length; console.log(`  auth chunk FAILED: ${e.message.split('\n')[0]}`); }
  }
  console.log(`auth.users: ${ok} ok, ${failed} failed (expect ${rows.length})`);
}

console.log('--- 3. data tables in FK order');
const order = manifest.fk_order.length ? manifest.fk_order : manifest.tables.map((t) => `${t.schema}.${t.table}`);
const tablesById = new Map(manifest.tables.map((t) => [`${t.schema}.${t.table}`, t]));
for (const key of order) {
  const info = tablesById.get(key);
  const file = join(dbDir, `${key}.jsonl`);
  if (!existsSync(file)) { console.log(`  MISSING FILE ${key}`); continue; }
  const rows = readFileSync(file, 'utf8').split('\n').filter(Boolean).map(JSON.parse);
  if (!rows.length) continue;
  const cols = info.columns;
  const colList = cols.map((c) => `"${c.name}"`).join(', ');
  let ok = 0, failed = 0;
  for (const chunk of chunkRows(rows, 100)) {
    const values = chunk.map((r) => `(${cols.map((c) => lit(r[c.name], c.cast)).join(', ')})`).join(', ');
    try {
      psqlStrict(`insert into "${info.schema}"."${info.table}" (${colList}) overriding system value values ${values} on conflict do nothing;`);
      ok += chunk.length;
    } catch (e) {
      for (const r of chunk) {
        try {
          psqlStrict(`insert into "${info.schema}"."${info.table}" (${colList}) overriding system value values (${cols.map((c) => lit(r[c.name], c.cast)).join(', ')}) on conflict do nothing;`);
          ok++;
        } catch (e2) { failed++; console.log(`  row FAILED ${key}: ${e2.message.split('\n')[0]}`); }
      }
    }
  }
  const hasErr = ok !== rows.length;
  console.log(`  ${hasErr ? 'FAIL' : 'OK  '} ${key}: ${ok}/${rows.length}${failed ? ` (+${failed} row failures)` : ''}`);
}

console.log('--- 4. sequences');
for (const info of manifest.tables) {
  const idCol = info.columns.find((c) => /id$/.test(c.name));
  if (!idCol) continue;
  try {
    const seq = psqlOut(`select pg_get_serial_sequence('"${info.schema}"."${info.table}"', '${idCol.name}');`);
    if (seq && seq !== '') {
      psqlLoose(`select setval('${seq.replace(/'/g, "''")}', coalesce((select max("${idCol.name}") from "${info.schema}"."${info.table}"), 1));`);
    }
  } catch {}
}

console.log('--- 5. verification');
let allOk = true;
for (const t of manifest.tables) {
  const expect = t.count;
  if (expect === 0) continue;
  try {
    const actual = Number(psqlOut(`select count(*) from "${t.schema}"."${t.table}";`));
    const flag = actual === expect ? 'OK  ' : 'FAIL';
    if (actual !== expect) allOk = false;
    console.log(`  ${flag} ${t.schema}.${t.table}: ${actual}/${expect}`);
  } catch { console.log(`  ERR  ${t.schema}.${t.table}`); allOk = false; }
}
console.log(allOk ? '\nRESULT: ALL COUNTS MATCH' : '\nRESULT: MISMATCHES FOUND');
process.exit(allOk ? 0 : 1);