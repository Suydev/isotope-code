#!/usr/bin/env node
// Fails when isotope-complete.sql drifts behind the live Supabase schema.
//
// This exists because a fresh install silently broke: the CREATE TABLE blocks in
// isotope-complete.sql fell behind the live project, §11 RPC bodies referenced
// the missing columns, and `psql -v ON_ERROR_STOP=1` aborted at the FIRST one
// ("column visual_key does not exist") — hiding drift across nine other tables.
//
// Requires SUPABASE_URL + SUPABASE_ACCESS_TOKEN (Management API PAT). When they
// are absent the check skips with exit 0, so it never breaks forks or PRs from
// contributors who have no project credentials.
//
// Run: node scripts/check-schema-drift.mjs
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function loadEnv() {
  const env = { ...process.env };
  for (const name of ['.backup_env', '.env']) {
    try {
      for (const raw of readFileSync(join(ROOT, name), 'utf8').split(/\r?\n/)) {
        const m = raw.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
        if (m && !env[m[1]]) env[m[1]] = m[2].trim();
      }
    } catch {}
  }
  return env;
}

const env = loadEnv();
if (!env.SUPABASE_URL || !env.SUPABASE_ACCESS_TOKEN) {
  console.log('SKIP: SUPABASE_URL / SUPABASE_ACCESS_TOKEN not set — cannot compare against a live project.');
  process.exit(0);
}

const project = new URL(env.SUPABASE_URL).hostname.split('.')[0];

function query(sql) {
  return new Promise((resolve, reject) => {
    const body = Buffer.from(JSON.stringify({ query: sql }));
    const req = https.request({
      hostname: 'api.supabase.com',
      path: `/v1/projects/${project}/database/query`,
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + env.SUPABASE_ACCESS_TOKEN,
        'Content-Type': 'application/json',
        'Content-Length': String(body.length),
      },
    }, (r) => {
      let d = '';
      r.on('data', (c) => d += c);
      r.on('end', () => {
        try {
          const j = JSON.parse(d);
          if (Array.isArray(j)) return resolve(j);
          reject(new Error(j.message || d.slice(0, 300)));
        } catch (e) { reject(new Error(`bad response: ${d.slice(0, 200)}`)); }
      });
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('timeout')); });
    req.write(body);
    req.end();
  });
}

const src = readFileSync(join(ROOT, 'isotope-complete.sql'), 'utf8');
const declared = [...new Set([...src.matchAll(/CREATE TABLE IF NOT EXISTS public\.([a-z_]+)/g)].map(m => m[1]))].sort();

// A column counts as "covered" if it appears in the CREATE TABLE body, in an
// `ADD COLUMN IF NOT EXISTS`, or in an information_schema guard (the pattern the
// generated-column blocks use).
function coveredColumns(table) {
  const cols = new Set();
  const body = src.match(new RegExp(`CREATE TABLE IF NOT EXISTS public\\.${table}\\s*\\(([\\s\\S]*?)\\n\\);`));
  if (body) {
    for (const line of body[1].split('\n')) {
      const m = line.match(/^ {2}([a-z_]+)\s/);
      if (m) cols.add(m[1]);
    }
  }
  for (const m of src.matchAll(new RegExp(`ALTER TABLE public\\.${table}\\s+ADD COLUMN IF NOT EXISTS\\s+([a-z_]+)`, 'g'))) cols.add(m[1]);
  for (const m of src.matchAll(new RegExp(`table_name='${table}' AND column_name='([a-z_]+)'`, 'g'))) cols.add(m[1]);
  return cols;
}

const rows = await query(
  `SELECT table_name, column_name FROM information_schema.columns
   WHERE table_schema='public' ORDER BY table_name, ordinal_position;`
);
const live = new Map();
for (const r of rows) {
  if (!live.has(r.table_name)) live.set(r.table_name, new Set());
  live.get(r.table_name).add(r.column_name);
}

let drift = 0;
const missingTables = [];
for (const t of declared) {
  if (!live.has(t)) { missingTables.push(t); continue; }
  const miss = [...live.get(t)].filter((c) => !coveredColumns(t).has(c)).sort();
  if (miss.length) {
    drift++;
    console.error(`DRIFT  public.${t} — live has columns the schema file never creates: ${miss.join(', ')}`);
  }
}

// Tables that exist live but are not in the schema file at all.
const undeclared = [...live.keys()]
  .filter((t) => !declared.includes(t) && !t.startsWith('hypopg'))
  .sort();

console.log(`\nChecked ${declared.length} declared table(s) against project ${project}.`);
if (missingTables.length) console.log(`NOTE: declared but absent live (fine for a fresh install): ${missingTables.join(', ')}`);
if (undeclared.length) console.log(`NOTE: live but not declared in isotope-complete.sql: ${undeclared.join(', ')}`);

if (drift) {
  console.error(`\n${drift} table(s) drifted. Add the missing columns to isotope-complete.sql §5b.`);
  console.error('Generate exact statements with types/defaults from information_schema before editing.');
  process.exit(1);
}
console.log('No column drift.');
