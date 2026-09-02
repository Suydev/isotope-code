#!/usr/bin/env node
// IsotopeAI full Supabase backup/restore (DB data + auth users + storage).
// Uses the management API (SUPABASE_ACCESS_TOKEN) for SQL and the REST API
// (SUPABASE_SERVICE_ROLE_KEY) for storage. Schema is handled by
// scripts/schema-dump.mjs (see backup.sh).
//
// backup:  node scripts/supabase-backup.mjs backup --out DIR [--no-storage]
// restore: node scripts/supabase-backup.mjs restore --src DIR
//            --supabase-url URL --anon-key K --service-key K --pat TOKEN
//            [--no-storage] [--schema-only]
//
//   --schema-only  structure without people: skips auth users, table rows and
//                  storage FILES. Buckets and their policies still arrive, since
//                  those come from schema.sql. Use for standing up a new empty
//                  project; omit it for disaster recovery.
import { readFileSync, writeFileSync, mkdirSync, existsSync, appendFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const ROOT = dirname(fileURLToPath(import.meta.url)) === process.cwd()
  ? process.cwd()
  : join(dirname(fileURLToPath(import.meta.url)), '..');

// ── Structured progress ──────────────────────────────────────────────────────
// The web console reads THESE events, never the human-readable log. Parsing prose
// produces a UI that breaks whenever a message is reworded, and the log is also
// where errors are truncated for readability — the wrong source for a progress bar.
//
// Writes are append-only single lines so a reader tailing the file can never see a
// half-written record: it stops at the last newline. Silent no-op when
// ISO_PROGRESS_FILE is unset, so nothing changes for plain CLI use.
const PROGRESS_FILE = process.env.ISO_PROGRESS_FILE || null;
function emit(event) {
  if (!PROGRESS_FILE) return;
  try {
    appendFileSync(PROGRESS_FILE, JSON.stringify({ t: Date.now(), ...event }) + '\n');
  } catch {
    // Progress reporting must never be able to fail the job it is reporting on.
  }
}

const EXCLUDE_SCHEMAS = new Set([
  'pg_catalog', 'information_schema', 'pg_toast', 'auth', 'storage', 'vault',
  'extensions', 'supabase_migrations', 'realtime', '_realtime', 'net',
  'pgbouncer', 'supabase_functions', 'cron', 'graphql', 'graphql_public',
]);

// ── Buckets the app requires, declared here rather than inferred ─────────────
//
// A backup can only dump buckets that EXIST, so a bucket the code uploads to and
// the database lacks is invisible to a tool whose reference point is the
// database. That is not hypothetical: `group-icons` and `study-material` were
// referenced by the shipped bridge (android-bridge.js:2479, :2512, :5306-5307)
// and absent from the project, so every group-icon and study-material upload
// returned
//     400 {"statusCode":"404","error":"Bucket not found","code":"NoSuchBucket"}
// while backup and verify both reported 3/3 buckets fine.
//
// Declaring the required set means a RESTORE creates all five even when the
// source project was missing some, and `verify` fails when one is absent. The
// database is no longer the only source of truth about what the app needs.
//
// Limits and mime lists match supabase/023_wire_missing_storage_buckets.sql;
// if you change one, change both.
//
// `notes` is deliberately absent. It had a 10 MB limit, zero objects, and zero
// references — no upload path in the bridge, no reachable web bundle. It is not
// listed as required, but a backup that CONTAINS it will still restore it, because
// restore takes the union of the manifest and this set: an existing project's data
// is never dropped just because the app no longer needs the bucket.
const REQUIRED_BUCKETS = {
  'user-content':   { public: false, file_size_limit: 52428800 },
  'avatars':        { public: true,  file_size_limit: 2097152,
                      allowed_mime_types: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] },
  'group-icons':    { public: true,  file_size_limit: 10485760,
                      allowed_mime_types: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'] },
  'study-material': { public: false, file_size_limit: 104857600 },
};

function loadEnv() {
  const env = { ...process.env };
  // .backup_env (keeper-project backup keys) wins over .env — same precedence
  // as backup.sh. Only fills keys not already set.
  for (const name of ['.backup_env', '.env']) {
    const envPath = join(ROOT, name);
    if (!existsSync(envPath)) continue;
    for (const raw of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
      const m = raw.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (m && !env[m[1]]) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  }
  return env;
}

function parseArgs(argv = process.argv.slice(2)) {
  const a = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      if (argv[i + 1] && !argv[i + 1].startsWith('--')) a[key] = argv[++i];
      else a[key] = true;
    } else if (!a._cmd) a._cmd = arg;
  }
  return a;
}

const CAST = {
  smallint: 'smallint', integer: 'integer', bigint: 'bigint', numeric: 'numeric',
  decimal: 'numeric', real: 'real', 'double precision': 'double precision',
  boolean: 'boolean', text: 'text', 'character varying': 'text', character: 'text',
  date: 'date', 'timestamp without time zone': 'timestamp',
  'timestamp with time zone': 'timestamptz', 'time without time zone': 'time',
  'time with time zone': 'timetz', uuid: 'uuid', json: 'jsonb', jsonb: 'jsonb',
  bytea: 'bytea', interval: 'interval', bigserial: 'bigint', serial: 'integer',
};

const PG_CAST = {
  int2: 'smallint', int4: 'integer', int8: 'bigint', float4: 'real',
  float8: 'double precision', bool: 'boolean', numeric: 'numeric',
  text: 'text', varchar: 'text', bpchar: 'text', name: 'text',
  date: 'date', timestamp: 'timestamp', timestamptz: 'timestamptz',
  time: 'time', timetz: 'timetz', uuid: 'uuid', json: 'jsonb', jsonb: 'jsonb',
  bytea: 'bytea', interval: 'interval',
};

function castFor(col) {
  if (col.data_type === 'ARRAY') return `${PG_CAST[col.udt_name.replace(/^_/, '')] || 'text'}[]`;
  if (col.data_type === 'USER-DEFINED') return `${col.udt_schema || 'public'}.${col.udt_name}`;
  return CAST[col.data_type] || 'text';
}

function lit(v, cast) {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number' || typeof v === 'boolean') return `${String(v)}::${cast}`;
  // Postgres ARRAY columns need `{a,b}`, not JSON `["a","b"]`.
  //
  // The management API returns a text[] as a real JS array, and JSON.stringify
  // turned it into `["Physics"]`, which Postgres rejects with
  //     22P02 malformed array literal: "["Physics"]"
  // So five of eleven `groups` rows never restored — and because group_members
  // and group_chat_messages FK to groups, that cascaded into 13 more row failures
  // that looked like an ordering problem even after the ordering was fixed.
  //
  // Emitted as an ARRAY[…] constructor rather than a hand-built `{…}` string:
  // element quoting inside an array literal has its own escaping rules for
  // commas, braces, backslashes and NULL-vs-"NULL", and a constructor lets
  // Postgres apply them instead of reimplementing them here.
  if (Array.isArray(v) && /\[\]$/.test(String(cast || ''))) {
    if (!v.length) return `ARRAY[]::${cast}`;
    // Elements are left unannotated and the whole constructor is cast instead:
    // ARRAY['a','b']::text[] is unambiguous, and casting each element as well
    // would be redundant. (An earlier draft computed the element type here and
    // never used it.)
    const elems = v.map((e) => (e === null || e === undefined
      ? 'NULL'
      : `'${(typeof e === 'string' ? e : JSON.stringify(e)).replace(/'/g, "''")}'`));
    return `ARRAY[${elems.join(', ')}]::${cast}`;
  }
  const s = typeof v === 'string' ? v : JSON.stringify(v);
  return `'${s.replace(/'/g, "''")}'::${cast}`;
}


async function sha256(buf) {
  const { createHash } = await import('crypto');
  return createHash('sha256').update(buf).digest('hex');
}

// ── SQL access via management API ───────────────────────────────────────────
const sleep = (ms) => new Promise((r) => { setTimeout(r, ms); });
let _lastCall = 0;
const MIN_GAP = 120;

function createSqlClient(projectRef, pat) {
  const url = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;
  async function query(sql, _retries = 0) {
    // Reserve this call's slot BEFORE awaiting. Reading _lastCall, awaiting, then
    // writing it meant two concurrent queries both computed their wait from the
    // same stale timestamp and fired together, defeating the rate limit and
    // risking 429s from the management API mid-backup.
    if (_retries === 0) {
      const now = Date.now();
      const slot = Math.max(now, _lastCall + MIN_GAP);
      _lastCall = slot;
      const wait = slot - now;
      if (wait > 0) await sleep(wait);
    } else {
      _lastCall = Date.now();
    }
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${pat}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: sql }),
    });
    const text = await res.text();
    if (res.status === 429 || res.status >= 500) {
      if (_retries < 6) {
        await sleep(500 * 2 ** _retries + Math.floor(Math.random() * 300));
        return query(sql, _retries + 1);
      }
      throw new Error(`SQL HTTP ${res.status} (after retries): ${text.slice(0, 400)}`);
    }
    if (res.status !== 200 && res.status !== 201) {
      throw new Error(`SQL HTTP ${res.status}: ${text.slice(0, 400)}`);
    }
    try { return JSON.parse(text); } catch { return []; }
  }
  async function runBatched(sql, onProgress, batchSize = 30) {
    const stmts = splitStatements(sql);
    let ok = 0, failed = 0;
    for (let i = 0; i < stmts.length; i += batchSize) {
      const chunk = stmts.slice(i, i + batchSize).join(';\n');
      if (!chunk.trim()) continue;
      try {
        await query(chunk);
        ok += batchSize;
        if (onProgress) onProgress(Math.min(i + batchSize, stmts.length), stmts.length);
      } catch (e) {
        for (const stmt of stmts.slice(i, i + batchSize)) {
          try { await query(stmt); ok++; }
          catch { failed++; if (onProgress) onProgress(`ERROR ${e.message.slice(0, 200)}`); }
        }
      }
    }
    return { total: stmts.length, ok, failed };
  }
  return { query, runBatched };
}

// Split SQL on top-level ';' — aware of quotes, comments and dollar-quoting.
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
      while (i < n && sql[i] !== "'") { if (sql[i] === '\\' && sql[i + 1] !== undefined && sql[i + 1] !== "'") { cur += sql[i] + sql[i + 1]; i += 2; continue; } cur += sql[i]; i++; }
      if (i < n) { cur += "'"; i++; }
      continue;
    }
    if (c === '-' && nx === '-') {
      while (i < n && sql[i] !== '\n') { cur += sql[i]; i++; }
      continue;
    }
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

// ── Storage access via REST API ─────────────────────────────────────────────
function createStorageClient(baseUrl, serviceKey) {
  const H = { apikey: serviceKey, authorization: `Bearer ${serviceKey}` };
  const url = (p) => `${baseUrl.replace(/\/$/, '')}/storage/v1/${p}`;
  async function listBuckets() {
    const res = await fetch(url('bucket'), { headers: H });
    if (!res.ok) throw new Error(`list buckets HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
    return res.json();
  }
  async function listObjects(bucket, prefix, offset, limit = 1000) {
    const res = await fetch(url(`object/list/${bucket}`), {
      method: 'POST', headers: { ...H, 'content-type': 'application/json' },
      body: JSON.stringify({ prefix, limit, offset, sortBy: { column: 'name', order: 'asc' } }),
    });
    if (!res.ok) throw new Error(`list ${bucket} HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
    return res.json();
  }
  async function download(bucket, path) {
    const res = await fetch(url(`object/${bucket}/${path.split('/').map(encodeURIComponent).join('/')}`), { headers: H });
    if (!res.ok) throw new Error(`download ${bucket}/${path} HTTP ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  }
  const MIME_BY_EXT = {
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.webp': 'image/webp', '.gif': 'image/gif', '.json': 'application/json',
    '.txt': 'text/plain', '.pdf': 'application/pdf',
  };
  async function upload(bucket, path, buf, upsert = true) {
    const ext = path.slice(path.lastIndexOf('.')).toLowerCase();
    const res = await fetch(url(`object/${bucket}/${path.split('/').map(encodeURIComponent).join('/')}`), {
      method: 'POST', headers: { ...H, 'content-type': MIME_BY_EXT[ext] || 'application/octet-stream', 'x-upsert': String(upsert) },
      body: buf,
    });
    if (!res.ok) throw new Error(`upload ${bucket}/${path} HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
  async function createBucket(id, isPublic, options = {}) {
    const body = { id, name: id, public: !!isPublic };
    if (options.file_size_limit) body.file_size_limit = options.file_size_limit;
    if (options.allowed_mime_types) body.allowed_mime_types = options.allowed_mime_types;
    const res = await fetch(url('bucket'), {
      method: 'POST', headers: { ...H, 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    if (!res.ok && !/already exists|duplicate/i.test(text)) throw new Error(`create bucket ${id} HTTP ${res.status}: ${text.slice(0, 200)}`);
  }
  return { listBuckets, listObjects, download, upload, createBucket };
}

async function userSchemas(sql) {
  const rows = await sql.query(`select nspname from pg_namespace
    where nspname not in (${[...EXCLUDE_SCHEMAS].map((s) => `'${s}'`).join(',')})
      and nspname not like 'pg\\_%' and nspname not like 'pg_toast%' and nspname not like 'pg_temp%'
    order by nspname`);
  return rows.map((r) => r.nspname);
}


async function tableList(sql) {
  const rows = await sql.query(`select table_schema, table_name
    from information_schema.tables
    where table_schema not in (${[...EXCLUDE_SCHEMAS].map((s) => `'${s}'`).join(',')})
      and table_type = 'BASE TABLE' order by table_schema, table_name`);
  return rows.map((r) => ({ schema: r.table_schema, table: r.table_name }));
}

async function foreignKeys(sql, schemas) {
  const inList = `(${schemas.map((s) => `'${s.replace(/'/g, "''")}'`).join(',')})`;
  // Schema and table are selected SEPARATELY, never via ::regclass::text.
  //
  // regclass output is search_path-dependent: for a table in `public` (which is
  // always on the path) it renders the BARE name, `groups`, not `public.groups`.
  // decodeRegclass then split that on the wrong dot and returned `group.s`, which
  // matched no table, so topoSort dropped almost every edge and fk_order came out
  // in plain alphabetical order. That put group_chat_messages (17) and
  // group_members (19) ahead of groups (21), and the restore failed 22 rows on
  // `violates foreign key constraint … group_id_fkey` — a data-phase symptom whose
  // cause was one string in the backup phase.
  return sql.query(`select
      rn.nspname as schema,      r.relname  as tbl,
      fn.nspname as fschema,     f.relname  as ftbl
    from pg_constraint c
    join pg_class r      on r.oid  = c.conrelid
    join pg_namespace rn on rn.oid = r.relnamespace
    join pg_class f      on f.oid  = c.confrelid
    join pg_namespace fn on fn.oid = f.relnamespace
    where c.contype = 'f' and rn.nspname in ${inList}`);
}

function topoSort(tables, fks) {
  const keyOf = (t) => t.key || `${t.schema}.${t.table}`;
  const deps = new Map(tables.map((t) => [keyOf(t), []]));
  for (const fk of fks) {
    const from = fk.from, to = fk.to;
    if (deps.has(from) && deps.has(to) && from !== to) deps.get(from).push(to);
  }
  const done = new Set(), order = [];

  const visit = (k, stack) => {
    if (done.has(k)) return;
    if (stack.has(k)) return;
    stack.add(k);
    for (const d of deps.get(k) || []) visit(d, stack);
    stack.delete(k);
    done.add(k);
    order.push(k);
  };
  for (const t of tables) visit(keyOf(t), new Set());
  const byKey = new Map(tables.map((t) => [keyOf(t), t]));
  return order.map((k) => byKey.get(k));
}

// ── BACKUP ──────────────────────────────────────────────────────────────────
async function backup(args, env) {
  if (!env.SUPABASE_URL) throw new Error('SUPABASE_URL missing');
  if (!env.SUPABASE_ACCESS_TOKEN) throw new Error('SUPABASE_ACCESS_TOKEN missing');
  if (!args.out) throw new Error('--out DIR required');
  const project = new URL(env.SUPABASE_URL).hostname.split('.')[0];
  const sql = createSqlClient(project, env.SUPABASE_ACCESS_TOKEN);
  mkdirSync(join(args.out, 'db'), { recursive: true });

  console.log(`[backup] project ${project} → ${args.out}`);

  const schemas = await userSchemas(sql);
  console.log('[backup] schemas:', schemas.join(', '));

  const manifest = {
    tool: 'isotope-supabase-backup',
    created_at: new Date().toISOString(),
    source_project: project,
    schemas,
    tables: [],
    auth_columns: [],
    fk_order: [],
    buckets: [],
    storage_files: [],
    // Routine/trigger/policy inventories. Verify previously checked only row
    // counts, so a restore that applied every table but almost no functions
    // still reported "91/91 checks passed" — which is exactly what happened when
    // the BEGIN-stripping regex ate the `begin` from every plpgsql body. Counting
    // these makes that class of failure visible instead of silent.
    routines: [],
    triggers: [],
    policies: [],
    notes: [],
  };

  // data tables (exclude auth — handled separately)
  const tables = (await tableList(sql)).filter((t) => t.schema !== 'auth');
  console.log(`[backup] tables: ${tables.length}`);
  emit({ phase: 'dump', state: 'running', done: 0, total: tables.length, failed: 0 });
  let dumped = 0, dumpFailed = 0;
  const allCols = await sql.query(`select table_schema, table_name, column_name,
      is_nullable, is_generated, data_type, udt_schema, udt_name
    from information_schema.columns
    order by table_schema, table_name, ordinal_position`);
  const colsByTable = new Map();
  for (const c of allCols) {
    const k = `${c.table_schema}.${c.table_name}`;
    if (!colsByTable.has(k)) colsByTable.set(k, []);
    colsByTable.get(k).push(c);
  }
  const byKey = new Map();
  for (const t of tables) {
    const cols = colsByTable.get(`${t.schema}.${t.table}`) || [];
    const dumpCols = cols.filter((c) => c.is_generated !== 'ALWAYS');
    const info = {
      schema: t.schema, table: t.table, count: 0,
      columns: dumpCols.map((c) => ({
        name: c.column_name,
        cast: castFor(c),
        generated: c.is_generated,
      })),
      fk_to: [],
    };
    const file = join(args.out, 'db', `${t.schema}.${t.table}.jsonl`);
    let rows = [];
    try {
      rows = await sql.query(`select ${dumpCols.map((c) => `"${c.column_name}"`).join(', ')} from "${t.schema}"."${t.table}"`);
    } catch (e) {
      manifest.notes.push(`table ${t.schema}.${t.table}: select failed — ${e.message.slice(0, 150)}`);
      console.log(`[backup] SKIP ${t.schema}.${t.table}: ${e.message.slice(0, 120)}`);
      dumpFailed++;
      emit({ phase: 'dump', level: 'error', msg: `${t.schema}.${t.table}: ${e.message.slice(0, 160)}` });
      emit({ phase: 'dump', done: ++dumped, total: tables.length, failed: dumpFailed });
      continue;
    }
    writeFileSync(file, rows.map((r) => JSON.stringify(r)).join('\n') + (rows.length ? '\n' : ''));
    info.count = rows.length;
    byKey.set(`${t.schema}.${t.table}`, info);
    manifest.tables.push(info);
    console.log(`[backup] ${t.schema}.${t.table}: ${rows.length} rows`);
    emit({ phase: 'dump', done: ++dumped, total: tables.length, failed: dumpFailed, table: `${t.schema}.${t.table}`, rows: rows.length });
  }
  emit({ phase: 'dump', state: 'done', done: dumped, total: tables.length, failed: dumpFailed });

  // FK order (auth.users counted as a source that never depends on us)
  const fks = await foreignKeys(sql, [...schemas, 'auth']);
  const edges = fks.map((fk) => ({
    from: `${fk.schema}.${fk.tbl}`,
    to: `${fk.fschema}.${fk.ftbl}`,
  }));
  for (const e of edges) {
    const t = byKey.get(e.from);
    if (t) t.fk_to.push(e.to);
  }
  manifest.fk_order = topoSort(manifest.tables, edges)
    .map((t) => `${t.schema}.${t.table}`);

  // A dependency-ordered restore is the whole point of fk_order, and an order
  // that silently degrades to alphabetical looks fine in the manifest. Assert the
  // property instead: every referenced table must appear before the table that
  // references it. Self-references and cycles are skipped (a cycle has no valid
  // order and the per-row fallback handles those).
  {
    const pos = new Map(manifest.fk_order.map((k, i) => [k, i]));
    const known = new Set(manifest.tables.map((t) => `${t.schema}.${t.table}`));
    const violations = edges.filter((e) => e.from !== e.to
      && known.has(e.from) && known.has(e.to)
      && !edges.some((r) => r.from === e.to && r.to === e.from)  // mutual cycle
      && pos.get(e.to) > pos.get(e.from));
    if (violations.length) {
      const detail = violations.slice(0, 5).map((v) => `${v.from} -> ${v.to}`).join(', ');
      manifest.notes.push(`fk_order violates ${violations.length} dependency edge(s): ${detail}`);
      console.log(`[backup] WARN fk_order violates ${violations.length} edge(s): ${detail}`);
    } else {
      console.log(`[backup] fk_order verified: ${edges.length} FK edge(s) satisfied`);
    }
  }

  // auth.users (metadata only; encrypted_password carries the bcrypt hash)
  const authCols = (colsByTable.get('auth.users') || []);
  const authDump = authCols.filter((c) => c.is_generated !== 'ALWAYS' && !/(confirmation|recovery|change|reauth|otp|updated_|phone_change|email_change|invited|last_sign|is_anonymous|is_sso|is_phone)/i.test(c.column_name) && c.column_name !== 'instance_id');
  manifest.auth_columns = authDump.map((c) => ({ name: c.column_name, cast: castFor(c) }));
  const authRows = await sql.query(`select ${authDump.map((c) => `"${c.column_name}"`).join(', ')} from auth.users`);
  writeFileSync(join(args.out, 'db', 'auth.users.jsonl'), authRows.map((r) => JSON.stringify(r)).join('\n') + (authRows.length ? '\n' : ''));
  console.log(`[backup] auth.users: ${authRows.length} users`);

  // Routine / trigger / policy inventory. Recorded so verify can prove the
  // restored project actually has the code, not just the tables.
  const schemaList = schemas.map((s) => `'${s.replace(/'/g, "''")}'`).join(', ');
  manifest.routines = (await sql.query(`
    select n.nspname as schema, p.proname as name,
           pg_get_function_identity_arguments(p.oid) as args
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname in (${schemaList}) and p.prokind in ('f','p')
      and not exists (select 1 from pg_depend d where d.objid = p.oid and d.deptype = 'i')
    order by 1, 2, 3`)).map((r) => `${r.schema}.${r.name}(${r.args})`);
  // Triggers, INCLUDING those on auth.users.
  //
  // `auth` is in EXCLUDE_SCHEMAS, which is correct for tables — auth.users rows
  // are dumped separately and the auth schema itself is Supabase-managed — but it
  // also meant a trigger attached to an auth table was never captured. The one
  // that matters is `on_auth_user_created`, which fires handle_new_user() to seed
  // public.users, user_profiles, user_points, user_stats_summary and
  // user_presence for every signup.
  //
  // Its absence is invisible: the 14 public triggers all fire on INSERT INTO
  // public.users, i.e. the SECOND stage. Verification passed 94/94 with every
  // recorded trigger present, on a database that could not accept a single
  // signup — enrolment failed 409 23503 because user_onboarding FKs to a
  // public.users row that nothing created. Measured on prod: 43 auth users,
  // 11 public.users rows, 32 orphaned.
  //
  // The trigger is emitted by scripts/schema-dump.mjs; this inventory is what
  // makes `verify` able to notice when it did not arrive.
  const triggerSchemaList = [...schemas, 'auth'].map((s) => `'${s.replace(/'/g, "''")}'`).join(', ');
  manifest.triggers = (await sql.query(`
    select n.nspname as schema, c.relname as tbl, t.tgname as name
    from pg_trigger t
    join pg_class c on c.oid = t.tgrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname in (${triggerSchemaList}) and not t.tgisinternal
    order by 1, 2, 3`)).map((r) => `${r.schema}.${r.tbl}.${r.name}`);
  manifest.policies = (await sql.query(`
    select n.nspname as schema, c.relname as tbl, pol.polname as name
    from pg_policy pol
    join pg_class c on c.oid = pol.polrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname in (${schemaList})
    order by 1, 2, 3`)).map((r) => `${r.schema}.${r.tbl}.${r.name}`);
  console.log(`[backup] code: ${manifest.routines.length} routines, ` +
    `${manifest.triggers.length} triggers, ${manifest.policies.length} policies`);

  // storage buckets + objects
  if (!args['no-storage']) {
    if (!env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log('[backup] WARN: SUPABASE_SERVICE_ROLE_KEY missing — skipping storage');
      manifest.notes.push('storage skipped: no SUPABASE_SERVICE_ROLE_KEY');
    } else {
      const st = createStorageClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
      const buckets = await st.listBuckets();
      manifest.buckets = buckets.map((b) => ({ id: b.id, public: !!b.public }));
      const listAll = async (bucket, prefix) => {
        const out = [];
        for (let off = 0; ; off += 1000) {
          const page = await st.listObjects(bucket, prefix, off, 1000);
          for (const o of page) {
            if (o.metadata && o.id) out.push(`${prefix}${o.name}`);
            else if (o.name) out.push(...await listAll(bucket, `${prefix}${o.name}/`));
          }
          if (page.length < 1000) break;
        }
        return out;
      };
      for (const b of buckets) {
        let files = [];
        try {
          files = await listAll(b.id, '');
        } catch (e) {
          manifest.notes.push(`storage bucket ${b.id}: list failed — ${e.message.slice(0, 150)}`);
          console.log(`[backup] SKIP bucket ${b.id}: ${e.message.slice(0, 120)}`);
          continue;
        }
        console.log(`[backup] bucket ${b.id}: ${files.length} objects`);
        emit({ phase: 'fetch', state: 'running', bucket: b.id, total: files.length, done: 0 });
        let got = 0;
        for (const rel of files) {
          const file = join(args.out, 'storage', b.id, ...rel.split('/'));
          try {
            const buf = await st.download(b.id, rel);
            mkdirSync(dirname(file), { recursive: true });
            writeFileSync(file, buf);
            manifest.storage_files.push({ bucket: b.id, path: rel, size: buf.length, sha256: await sha256(buf) });
            emit({ phase: 'fetch', bucket: b.id, done: ++got, total: files.length });
          } catch (e) {
            manifest.notes.push(`storage ${b.id}/${rel}: download failed — ${e.message.slice(0, 150)}`);
            console.log(`[backup] FAIL ${b.id}/${rel}: ${e.message.slice(0, 120)}`);
            emit({ phase: 'fetch', level: 'error', msg: `${b.id}/${rel}: ${e.message.slice(0, 160)}` });
          }
        }
      }
    }
  }

  writeFileSync(join(args.out, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  console.log(`[backup] DONE: ${manifest.tables.length} tables, ${authRows.length} auth users, ${manifest.storage_files.length} storage files`);
  emit({ phase: 'backup', state: 'done', tables: manifest.tables.length, users: authRows.length, files: manifest.storage_files.length });
  if (manifest.notes.length) console.log('[backup] notes:\n  ' + manifest.notes.join('\n  '));
}

// ── RESTORE ─────────────────────────────────────────────────────────────────
async function restore(args, env) {
  const url = args['supabase-url'] || env.SUPABASE_URL;
  const service = args['service-key'] || env.SUPABASE_SERVICE_ROLE_KEY;
  const pat = args.pat || env.SUPABASE_ACCESS_TOKEN;
  if (!url || !pat) throw new Error('restore needs --supabase-url and --pat (or env vars)');
  if (!existsSync(join(args.src, 'manifest.json'))) throw new Error(`no manifest.json in ${args.src}`);
  const project = new URL(url).hostname.split('.')[0];
  const sql = createSqlClient(project, pat);
  const manifest = JSON.parse(readFileSync(join(args.src, 'manifest.json'), 'utf8'));

  console.log(`[restore] target project ${project}`);

  // 0. sanity check connectivity
  await sql.query('select 1');
  console.log('[restore] management API ok');

  // 1. schema (produced by scripts/schema-dump.mjs)
  //    Execute ONE statement at a time — the management API may partially apply
  //    a multi-statement batch before reporting failure, causing duplicate
  //    constraint errors on retry. Strip BEGIN/COMMIT since we're not in a transaction.
  const schemaFile = join(args.src, 'schema.sql');
  if (existsSync(schemaFile)) {
    const sqlText = readFileSync(schemaFile, 'utf8');
    // Split FIRST, then drop the transaction wrappers as whole statements.
    //
    // This used to run
    //     sqlText.replace(/^\s*BEGIN\s*;?\s*\n/gim, '')
    // over the raw file. With the `m` flag `^` matches the start of EVERY line,
    // so it deleted the `begin` keyword from inside every plpgsql function body
    // as well as the file's own BEGIN; wrapper. Every function with a
    // `declare … begin … end` block then failed with
    //     syntax error at or near "if" / "INSERT" / "IF TG_OP"
    // and the restore silently produced a database with tables but almost no
    // RPCs. Removing wrappers at statement granularity cannot touch a body.
    //
    // The wrapper test must ignore LEADING COMMENTS, and that is not cosmetic.
    // splitStatements keeps comments attached to the statement that follows them,
    // so the file's opening `BEGIN;` arrives as a single statement consisting of
    // the entire 18-line header banner followed by `BEGIN`. `s.trim()` on that is
    // not `"BEGIN"`, so the filter did not match and the BEGIN survived — while
    // the trailing `COMMIT;`, which has no comment in front of it, was correctly
    // removed.
    //
    // The result was a restore that opened a transaction in the first batch and
    // never committed it. The management API request ended, the transaction rolled
    // back, and the 31 tables created in batch 1 vanished. Batches 2+ then ran in
    // autocommit, so the 11 tables declared later DID persist — which is exactly
    // the "42 tables expected, 11 present" state seen on the target, and why every
    // `ADD CONSTRAINT … _pkey` for the first 31 tables failed with 42P01, and why
    // every insert into public.users then failed inside the
    // _ensure_community_enrollment() trigger.
    //
    // Strip comment lines before testing, so the banner cannot hide a wrapper.
    const bareStatement = (s) => s
      .split('\n')
      .filter((l) => !/^\s*--/.test(l))
      .join('\n')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .trim();
    const stmts = splitStatements(sqlText)
      .filter((s) => {
        const bare = bareStatement(s);
        if (!bare) return false;   // comment-only chunk
        return !/^(BEGIN|COMMIT|ROLLBACK|START\s+TRANSACTION|END)\s*;?$/i.test(bare);
      });

    // A surviving wrapper is unrecoverable and silent, so assert rather than trust
    // the filter above. Cheap, and it fails in one line instead of 40 minutes later
    // as thirteen tables of mysterious row errors.
    const strayWrapper = stmts.findIndex((s) => /^(BEGIN|COMMIT|ROLLBACK|START\s+TRANSACTION)\s*;?$/i.test(bareStatement(s)));
    if (strayWrapper !== -1) {
      throw new Error(`transaction wrapper survived statement splitting at index ${strayWrapper} — ` +
        'batches would run inside an uncommitted transaction and roll back');
    }

    // Applied in BATCHES, in order.
    //
    // One statement per HTTP request meant 1772 round-trips — 30-60 minutes on a
    // mobile connection. Measured against the management API: a single statement
    // costs ~2200ms, fifty in one request ~845ms. Batching turns the whole schema
    // into ~36 requests, well under a minute.
    //
    // Order is PRESERVED and batches are sequential: the dump is
    // dependency-ordered (tables -> constraints -> functions -> triggers ->
    // policies), so running parts concurrently would attempt a foreign key
    // against a table another part had not created yet.
    //
    // On a batch failure the batch is REPLAYED one statement at a time, so a
    // real error is still reported with its exact statement. That replay is safe
    // because every emitted statement is idempotent (IF NOT EXISTS, guarded
    // ADD CONSTRAINT, DROP POLICY IF EXISTS), so re-running a partially applied
    // batch cannot corrupt anything.
    const BATCH = 50;
    // "Already there" errors, and ONLY those.
    //
    // `does not exist` used to be in this list, and it is the reason a restore
    // could report "0 failed" while creating 11 of 42 tables. When a batch fails
    // it is replayed one statement at a time; a statement that legitimately fails
    // because its dependency was never created says
    //     relation "public.community_enrollments" does not exist
    // which matched, so it was counted as an idempotent skip and never reported.
    // The restore then walked into the data phase against a schema that was 3/4
    // missing, and every insert into public.users failed inside the
    // _ensure_community_enrollment() trigger — 13 tables of "N row(s) failed"
    // whose real cause was 500 statements silently discarded 40 minutes earlier.
    //
    // `is not a` and `must be owner` were equally unsafe: "x is not a table" and
    // "must be owner of relation x" are refusals, not no-ops.
    const IDEMPOTENT = /already exists|duplicate key|duplicate object|multiple primary keys/i;
    // Statements that cannot be executed by the management API role at all. These
    // ARE expected and are not failures: hypopg's LANGUAGE c functions and the two
    // views built on them (42501 permission denied for language c).
    const UNPRIVILEGED = /permission denied for language|must be superuser/i;
    console.log(`[restore] applying schema (${stmts.length} statements in batches of ${BATCH})…`);
    emit({ phase: 'schema', state: 'running', done: 0, total: stmts.length, failed: 0, skipped: 0 });
    let ok = 0, skipped = 0, failed = 0;
    const failures = [];

    const applyOne = async (stmt) => {
      try { await sql.query(stmt); ok++; }
      catch (e) {
        const msg = e.message || '';
        if (IDEMPOTENT.test(msg) || UNPRIVILEGED.test(msg)) { skipped++; return; }
        failed++;
        if (failures.length < 20) failures.push({ stmt: stmt.slice(0, 160), msg: msg.slice(0, 220) });
        emit({ phase: 'schema', level: 'error', msg: msg.slice(0, 220), stmt: stmt.slice(0, 160) });
      }
    };

    for (let i = 0; i < stmts.length; i += BATCH) {
      const chunk = stmts.slice(i, i + BATCH);
      try {
        await sql.query(chunk.join(';\n') + ';');
        ok += chunk.length;
      } catch (e) {
        // Batch failed: find out precisely which statement, and why.
        for (const stmt of chunk) await applyOne(stmt);
      }
      process.stdout.write(`  ${Math.min(i + BATCH, stmts.length)}/${stmts.length}…\r`);
      emit({ phase: 'schema', done: Math.min(i + BATCH, stmts.length), total: stmts.length, ok, failed, skipped });
    }
    console.log(`[restore] schema: ${ok} applied, ${skipped} skipped (already present / unprivileged), ${failed} failed`);
    emit({ phase: 'schema', state: 'done', done: stmts.length, total: stmts.length, ok, failed, skipped });
    for (const f of failures) {
      console.log(`  schema FAILED: ${f.msg}`);
      console.log(`             at: ${f.stmt.replace(/\s+/g, ' ')}`);
    }

    // A schema that did not land cannot be papered over by the data phase: every
    // insert would fail on a missing relation or inside a trigger, producing a
    // pile of row errors whose real cause is here. Stop while the reason is still
    // on screen.
    if (failed > 0) {
      throw new Error(`schema restore failed on ${failed} statement(s) — see the errors above; ` +
        'the target is incomplete and the data phase would fail against it');
    }
    // Independent check: the dump says which tables it creates, so compare against
    // what the target actually has. This catches the failure mode above even if a
    // future misclassification hides the individual errors again.
    const expectTables = manifest.tables.map((t) => `${t.schema}.${t.table}`);
    if (expectTables.length) {
      const live = new Set((await sql.query(`
        select table_schema, table_name from information_schema.tables
        where table_type = 'BASE TABLE'
      `)).map((r) => `${r.table_schema}.${r.table_name}`));
      const missing = expectTables.filter((k) => !live.has(k));
      if (missing.length) {
        throw new Error(`schema incomplete: ${missing.length}/${expectTables.length} table(s) missing on the target ` +
          `(${missing.slice(0, 8).join(', ')}${missing.length > 8 ? ' …' : ''})`);
      }
      console.log(`[restore] schema verified: all ${expectTables.length} tables present`);
      emit({ phase: 'schema', state: 'verified', tables: expectTables.length });
    }
  } else {
    console.log('[restore] no schema.sql — assuming target already has schema');
  }

  // --schema-only: structure without people or their data. This is the "fresh
  // project" case — a new project should not receive 43 real emails and bcrypt
  // hashes, and copying them around is the kind of thing that quietly spreads PII.
  const schemaOnly = Boolean(args['schema-only']);
  if (schemaOnly) console.log('[restore] --schema-only: skipping auth users, table rows and storage files');

  // 2. auth.users (must come before user tables that FK to it)
  const authFile = join(args.src, 'db', 'auth.users.jsonl');
  if (!schemaOnly && existsSync(authFile)) {
    const rows = readFileSync(authFile, 'utf8').split('\n').filter(Boolean).map(JSON.parse);
    const cols = manifest.auth_columns;
    console.log(`[restore] auth.users: ${rows.length} users`);
    emit({ phase: 'auth', state: 'running', done: 0, total: rows.length, failed: 0 });
    let ok = 0, failed = 0;
    const colList = cols.map((c) => `"${c.name}"`).join(', ');
    const valuesFor = (r) => `(${cols.map((c) => lit(r[c.name], c.cast)).join(', ')})`;

    // Batched, same reasoning as the schema: one request per user was 43 round
    // trips. On batch failure, fall back to per-row so a single bad user cannot
    // hide the other 42 — and so its error is still reported by email.
    const AUTH_BATCH = 25;
    for (let i = 0; i < rows.length; i += AUTH_BATCH) {
      const chunk = rows.slice(i, i + AUTH_BATCH);
      try {
        await sql.query(`insert into auth.users (${colList}) values ${chunk.map(valuesFor).join(', ')} on conflict (id) do nothing`);
        ok += chunk.length;
        continue;
      } catch (e) { /* fall through to per-row */ }
      for (const r of chunk) {
        try {
          await sql.query(`insert into auth.users (${colList}) values ${valuesFor(r)} on conflict (id) do nothing`);
          ok++;
        } catch (e) {
          // ON CONFLICT can fail if the PK constraint name differs on the target
          try {
            await sql.query(`insert into auth.users (${colList}) values ${valuesFor(r)}`);
            ok++;
          } catch (e2) {
            failed++;
            emit({ phase: 'auth', level: 'error', msg: `${r.email || r.id}: ${e2.message.slice(0, 180)}` });
            if (failed <= 10) console.log(`  auth user ${r.email || r.id} FAILED: ${e2.message.slice(0, 200)}`);
          }
        }
      }
    }
    console.log(`[restore] auth.users: ${ok} ok, ${failed} failed`);
    emit({ phase: 'auth', state: 'done', done: rows.length, total: rows.length, ok, failed });
  }

  // 3. data tables in FK order (guard against degenerate manifests from older
  //    backups whose fk_order lists only a subset — append every table missed)
  const allKeys = manifest.tables.map((t) => `${t.schema}.${t.table}`);
  let order = manifest.fk_order.length ? manifest.fk_order : allKeys;
  const missing = allKeys.filter((k) => !order.includes(k));
  if (missing.length) {
    order = [...order, ...missing];
    console.log(`[restore] manifest fk_order incomplete — appended ${missing.length} missing table(s)`);
  }
  emit({ phase: 'data', state: 'running', done: 0, total: schemaOnly ? 0 : order.length, failed: 0 });
  let tablesDone = 0, tablesFailed = 0;
  for (const key of schemaOnly ? [] : order) {
    const info = manifest.tables.find((t) => `${t.schema}.${t.table}` === key);
    if (!info) continue;
    const file = join(args.src, 'db', `${key}.jsonl`);
    if (!existsSync(file)) { console.log(`[restore] ${key}: no file`); continue; }
    const rows = readFileSync(file, 'utf8').split('\n').filter(Boolean).map(JSON.parse);
    if (!rows.length) { console.log(`[restore] ${key}: 0 rows`); continue; }
    const cols = info.columns;
    const colList = cols.map((c) => `"${c.name}"`).join(', ');
    let ok = 0, failed = 0;
    // Keep the FIRST reason per table. Previously the per-row fallback was
    // `catch { failed++; }`, which discarded the message entirely — so a restore
    // reported "public.users: 0 ok, 11 failed" with no way to tell whether that
    // was a foreign key, a trigger, a check constraint or a type cast. Thirteen
    // tables failing for an unknown reason is not an actionable report.
    let firstErr = null;
    for (const chunk of chunkRows(rows, 100)) {
      const values = chunk.map((r) => `(${cols.map((c) => lit(r[c.name], c.cast)).join(', ')})`).join(', ');
      for (const over of [true, false]) {
        try {
          await sql.query(`insert into "${info.schema}"."${info.table}" (${colList})${over ? ' overriding system value' : ''} values ${values} on conflict do nothing`);
          ok += chunk.length; break;
        } catch (e) {
          if (over) continue;
          for (const r of chunk) {
            try {
              await sql.query(`insert into "${info.schema}"."${info.table}" (${colList}) overriding system value values (${cols.map((c) => lit(r[c.name], c.cast)).join(', ')}) on conflict do nothing`);
              ok++;
            } catch (e2) {
              failed++;
              if (!firstErr) firstErr = String(e2 && e2.message || e2).replace(/\s+/g, ' ').slice(0, 260);
            }
          }
        }
      }
    }
    console.log(`[restore] ${key}: ${ok} ok, ${failed} failed${firstErr ? ` — first error: ${firstErr}` : ''}`);
    tablesDone++;
    if (failed) tablesFailed++;
    if (failed) {
      emit({
        phase: 'data', level: 'error',
        msg: `${key}: ${failed} row(s) failed${firstErr ? ` — ${firstErr}` : ''}`,
      });
    }
    emit({ phase: 'data', done: tablesDone, total: order.length, failed: tablesFailed, table: key, rows: ok });
  }
  emit({ phase: 'data', state: 'done', done: order.length, total: order.length, failed: tablesFailed });

  // 4. advance sequences
  for (const info of manifest.tables) {
    const idCol = info.columns.find((c) => /id$/.test(c.name));
    if (!idCol) continue;
    try {
      const seq = await sql.query(`select pg_get_serial_sequence('"${info.schema}"."${info.table}"', '${idCol.name}') as seq`);
      if (seq[0] && seq[0].seq) {
        await sql.query(`select setval('${seq[0].seq.replace(/'/g, "''")}', coalesce((select max("${idCol.name}") from "${info.schema}"."${info.table}"), 1), (select max("${idCol.name}") from "${info.schema}"."${info.table}") is not null)`);
      }
    } catch {}
  }

  // 5. storage — buckets themselves come from schema.sql; this uploads FILES.
  if (!args['no-storage'] && !schemaOnly) {
    if (!service) {
      console.log('[restore] WARN: no service key — skipping storage');
    } else {
      const st = createStorageClient(url, service);
      // Union of what the source had and what the app requires. Restoring only
      // manifest.buckets reproduced the source's gaps: a project missing
      // group-icons produced a restore that also could not accept a group icon.
      const wanted = new Map();
      for (const [id, cfg] of Object.entries(REQUIRED_BUCKETS)) {
        wanted.set(id, { id, public: cfg.public, cfg });
      }
      for (const b of manifest.buckets) {
        const cfg = REQUIRED_BUCKETS[b.id] || {};
        // The source project's `public` flag wins for a bucket it actually had —
        // it is the live answer for that deployment. REQUIRED_BUCKETS only
        // supplies a default for buckets the source did not have at all.
        wanted.set(b.id, { id: b.id, public: b.public, cfg });
      }
      for (const b of wanted.values()) {
        const { public: _pub, ...opts } = b.cfg;
        try {
          await st.createBucket(b.id, b.public, opts);
          const extra = REQUIRED_BUCKETS[b.id] && !manifest.buckets.some((m) => m.id === b.id)
            ? ' (required by the app; absent from the backup)' : '';
          console.log(`[restore] bucket ${b.id} ready (public=${b.public})${extra}`);
        } catch (e) { console.log(`[restore] bucket ${b.id}: ${e.message.slice(0, 150)}`); }
      }
      let ok = 0, failed = 0;
      emit({ phase: 'storage', state: 'running', done: 0, total: manifest.storage_files.length, failed: 0 });
      const retries = (fn, n = 3) => fn().catch(async (e) => {
        if (n <= 1 || !/fetch failed|ECONNRESET|ETIMEDOUT|socket/i.test(e.message || '')) throw e;
        await new Promise((r) => { setTimeout(r, 1500); });
        return retries(fn, n - 1);
      });
      for (const f of manifest.storage_files) {
        const file = join(args.src, 'storage', f.bucket, ...f.path.split('/'));
        if (!existsSync(file)) { failed++; console.log(`  MISSING ${f.bucket}/${f.path}`); continue; }
        try {
          const buf = readFileSync(file);
          if (f.sha256) {
            const h = await sha256(buf);
            if (h !== f.sha256) { failed++; console.log(`  HASH MISMATCH ${f.bucket}/${f.path}`); continue; }
          }
          await retries(() => st.upload(f.bucket, f.path, buf, true));
          ok++;
        } catch (e) {
          failed++;
          emit({ phase: 'storage', level: 'error', msg: `${f.bucket}/${f.path}: ${e.message.slice(0, 160)}` });
          console.log(`  upload FAILED ${f.bucket}/${f.path}: ${e.message.slice(0, 150)}`);
        }
        emit({ phase: 'storage', done: ok + failed, total: manifest.storage_files.length, ok, failed });
      }
      console.log(`[restore] storage: ${ok} ok, ${failed} failed`);
      emit({ phase: 'storage', state: 'done', done: ok + failed, total: manifest.storage_files.length, ok, failed });
    }
  }

  console.log(`[restore] DONE (${project})`);
  emit({ phase: 'restore', state: 'done', msg: `restore finished on ${project}` });
}

function chunkRows(rows, n) {
  const out = [];
  for (let i = 0; i < rows.length; i += n) out.push(rows.slice(i, i + n));
  return out;
}

// ── VERIFY ─────────────────────────────────────────────────────────────────
// Cross-checks an extracted backup dir (manifest + data files) against a live
// Supabase project: table existence, row counts, auth.users count and storage
// buckets/object counts. Prints PASS/FAIL per check; returns true if every
// check passed.
async function verify(args, env) {
  const url = args['supabase-url'] || env.SUPABASE_URL;
  const service = args['service-key'] || env.SUPABASE_SERVICE_ROLE_KEY;
  const pat = args.pat || env.SUPABASE_ACCESS_TOKEN;
  const src = args.src;
  if (!url || !pat) throw new Error('verify needs --supabase-url and --pat (or env vars)');
  if (!existsSync(join(src, 'manifest.json'))) throw new Error(`no manifest.json in ${src}`);
  const project = new URL(url).hostname.split('.')[0];
  const sql = createSqlClient(project, pat);
  const manifest = JSON.parse(readFileSync(join(src, 'manifest.json'), 'utf8'));

  console.log(`[verify] backup: source ${manifest.source_project}, created ${manifest.created_at}, ${manifest.tables.length} tables, ${manifest.storage_files.length} storage files`);
  console.log(`[verify] target: ${project}`);
  await sql.query('select 1');
  console.log('[verify] management API ok');

  let fail = 0, checked = 0;
  const check = (ok, label, detail = '') => {
    checked++;
    if (!ok) fail++;
    emit({ phase: 'verify', done: checked, failed: fail, label, ok });
    if (!ok) emit({ phase: 'verify', level: 'error', msg: `${label} — ${detail}` });
    console.log(`  ${ok ? 'PASS' : 'FAIL'} ${label}${detail ? ` — ${detail}` : ''}`);
  };

  // 1. every table in the manifest exists on the target
  const liveTables = await sql.query(`select table_schema, table_name
    from information_schema.tables
    where table_type = 'BASE TABLE'
      and table_schema not in (${[...EXCLUDE_SCHEMAS].map((s) => `'${s}'`).join(',')})`);
  const liveKeys = new Set(liveTables.map((r) => `${r.table_schema}.${r.table_name}`));
  const present = manifest.tables.filter((t) => liveKeys.has(`${t.schema}.${t.table}`));
  for (const t of manifest.tables) {
    const key = `${t.schema}.${t.table}`;
    check(liveKeys.has(key), `table ${key}`, liveKeys.has(key) ? undefined : 'MISSING on target');
  }

  // 2. row counts (single batched query; skip tables missing on target)
  const countsQ = present
    .map((t) => `select '${t.schema}.${t.table.replace(/'/g, "''")}'::text as k, count(*)::bigint as n from "${t.schema}"."${t.table}"`)
    .join(' union all ');
  const liveCounts = new Map();
  if (countsQ) {
    try {
      for (const r of await sql.query(countsQ)) liveCounts.set(r.k, Number(r.n));
    } catch (e) {
      check(false, 'row counts', e.message.slice(0, 150));
    }
  }
  for (const t of manifest.tables) {
    const key = `${t.schema}.${t.table}`;
    if (!liveKeys.has(key)) continue;
    const actual = liveCounts.get(key);
    check(actual === t.count, `rows ${key}`, actual === undefined ? 'count query failed' : `${actual} ${actual === t.count ? '==' : '!='} ${t.count}`);
  }

  // 3. auth.users count matches the dump
  const authFile = join(src, 'db', 'auth.users.jsonl');
  if (existsSync(authFile)) {
    const expectAuth = readFileSync(authFile, 'utf8').split('\n').filter(Boolean).length;
    const [r] = await sql.query('select count(*)::bigint as n from auth.users');
    check(Number(r.n) === expectAuth, 'auth.users', `${r.n} ${Number(r.n) === expectAuth ? '==' : '!='} ${expectAuth}`);
  }

  // 4. storage buckets + object counts (needs service key)
  if (args['no-storage']) {
    console.log('  --no-storage: storage checks skipped');
  } else if (!service) {
    console.log('  WARN: no SUPABASE_SERVICE_ROLE_KEY — storage checks skipped');
  } else {
    const st = createStorageClient(url, service);
    const buckets = await st.listBuckets();
    const liveBuckets = new Map(buckets.map((b) => [b.id, !!b.public]));
    for (const b of manifest.buckets) {
      const live = liveBuckets.has(b.id);
      check(live && liveBuckets.get(b.id) === !!b.public, `bucket ${b.id}`,
        live ? `public=${liveBuckets.get(b.id)}` : 'MISSING on target');
    }
    // Buckets the APP requires, whether or not the backup contained them. Checking
    // only manifest.buckets validated the target against the source's gaps: a
    // source missing group-icons passed 3/3 while both projects rejected every
    // group-icon upload with NoSuchBucket.
    for (const [id, cfg] of Object.entries(REQUIRED_BUCKETS)) {
      if (manifest.buckets.some((b) => b.id === id)) continue;  // already checked above
      const live = liveBuckets.has(id);
      check(live, `bucket ${id} (required by the app)`,
        live ? `public=${liveBuckets.get(id)}` : 'MISSING — uploads to it will 404');
      if (live && liveBuckets.get(id) !== !!cfg.public) {
        check(false, `bucket ${id} visibility`,
          `public=${liveBuckets.get(id)}, expected ${!!cfg.public}`);
      }
    }
    // Must recurse into folder prefixes, exactly like the backup-side listAll().
    // Supabase's list endpoint is NOT recursive: for a nested layout it returns
    // pseudo-folder entries (no .id / .metadata) at the root, which this filter
    // discards — so a bucket whose every object lives under `<uid>/…` counted as
    // 0 and verification failed with "0 != 53" on a backup that was actually
    // complete. That false FAIL is worse than no check: it trains you to ignore
    // the verifier, or to pass --no-verify and lose the real checks too.
    const countObjects = async (bucket, prefix = '') => {
      let n = 0;
      for (let off = 0; ; off += 1000) {
        const page = await st.listObjects(bucket, prefix, off, 1000);
        for (const o of page) {
          if (o.metadata && o.id) n += 1;
          else if (o.name) n += await countObjects(bucket, `${prefix}${o.name}/`);
        }
        if (page.length < 1000) break;
      }
      return n;
    };
    for (const b of manifest.buckets) {
      if (!liveBuckets.has(b.id)) continue;
      const expect = manifest.storage_files.filter((f) => f.bucket === b.id).length;
      let actual;
      try { actual = await countObjects(b.id); } catch (e) { check(false, `objects ${b.id}`, e.message.slice(0, 120)); continue; }
      check(actual === expect, `objects ${b.id}`, `${actual} ${actual === expect ? '==' : '!='} ${expect}`);
    }
  }

  // ── routines / triggers / policies ────────────────────────────────────────
  // The gap that let a broken restore report 91/91: only row counts were
  // checked, so a target with every table and almost no functions passed. A
  // database with no RPCs cannot run the app, and that must fail verification.
  const codeSchemas = (manifest.schemas || ['public'])
    .map((s) => `'${s.replace(/'/g, "''")}'`).join(', ');
  if (Array.isArray(manifest.routines) && manifest.routines.length) {
    const live = new Set((await sql.query(`
      select n.nspname as schema, p.proname as name,
             pg_get_function_identity_arguments(p.oid) as args
      from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
      where n.nspname in (${codeSchemas}) and p.prokind in ('f','p')
        and not exists (select 1 from pg_depend d where d.objid = p.oid and d.deptype = 'i')
    `)).map((r) => `${r.schema}.${r.name}(${r.args})`));
    const missing = manifest.routines.filter((k) => !live.has(k));
    check(missing.length === 0, `routines ${live.size}/${manifest.routines.length}`,
      missing.length ? `MISSING ${missing.length}: ${missing.slice(0, 5).join(', ')}${missing.length > 5 ? ' …' : ''}` : 'all present');
  } else {
    console.log('  WARN routines — backup predates routine inventory, cannot verify code');
  }
  if (Array.isArray(manifest.triggers) && manifest.triggers.length) {
    // `auth` is added explicitly: manifest.schemas holds only user schemas, but
    // the manifest now records auth.users.on_auth_user_created, and a check that
    // cannot see the schema it is checking reports every such trigger missing.
    const triggerSchemas = `${codeSchemas}, 'auth'`;
    const live = new Set((await sql.query(`
      select n.nspname as schema, c.relname as tbl, t.tgname as name
      from pg_trigger t
      join pg_class c on c.oid = t.tgrelid
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname in (${triggerSchemas}) and not t.tgisinternal
    `)).map((r) => `${r.schema}.${r.tbl}.${r.name}`));
    const missing = manifest.triggers.filter((k) => !live.has(k));
    check(missing.length === 0, `triggers ${live.size}/${manifest.triggers.length}`,
      missing.length ? `MISSING ${missing.length}: ${missing.slice(0, 5).join(', ')}` : 'all present');
  }
  // Signup is the one path where a missing object is silent AND fatal: without
  // on_auth_user_created every new account gets an auth identity and none of the
  // five rows the app reads, so enrolment fails 23503 and the user appears
  // signed-in-but-broken. Checked unconditionally, not just when the manifest
  // happens to list it, since backups taken before the inventory fix do not.
  {
    const [t] = await sql.query(`
      select count(*)::int as n from pg_trigger
       where tgname = 'on_auth_user_created'
         and tgrelid = 'auth.users'::regclass
         and not tgisinternal`);
    check(Number(t.n) > 0, 'trigger auth.users.on_auth_user_created',
      Number(t.n) > 0 ? 'present' : 'MISSING — new signups will not get a public.users row');
    const [o] = await sql.query(`
      select count(*)::int as n from auth.users a
       where not exists (select 1 from public.users u where u.id = a.id)`);
    check(Number(o.n) === 0, 'auth users with a public.users row',
      Number(o.n) === 0 ? 'all present' : `${o.n} orphaned auth user(s)`);
  }
  if (Array.isArray(manifest.policies) && manifest.policies.length) {
    const live = new Set((await sql.query(`
      select n.nspname as schema, c.relname as tbl, pol.polname as name
      from pg_policy pol
      join pg_class c on c.oid = pol.polrelid
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname in (${codeSchemas})
    `)).map((r) => `${r.schema}.${r.tbl}.${r.name}`));
    const missing = manifest.policies.filter((k) => !live.has(k));
    check(missing.length === 0, `policies ${live.size}/${manifest.policies.length}`,
      missing.length ? `MISSING ${missing.length}: ${missing.slice(0, 5).join(', ')}` : 'all present');
  }

  const status = fail ? 'FAIL' : 'PASS';
  console.log(`[verify] RESULT: ${status} (${checked - fail}/${checked} checks passed)`);
  emit({ phase: 'verify', state: 'done', done: checked, total: checked, failed: fail, result: status });
  return fail === 0;
}

const args = parseArgs();
const env = loadEnv();
const isMain = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
if (isMain) {
  try {
    if (args._cmd === 'backup') await backup(args, env);
    else if (args._cmd === 'restore') await restore(args, env);
    else if (args._cmd === 'verify') process.exit((await verify(args, env)) ? 0 : 1);
    else {
      console.log(`usage:
  node scripts/supabase-backup.mjs backup --out DIR [--no-storage]
  node scripts/supabase-backup.mjs restore --src DIR
      --supabase-url URL --anon-key K --service-key K --pat TOKEN [--no-storage]
  node scripts/supabase-backup.mjs verify --src DIR
      --supabase-url URL --service-key K --pat TOKEN [--no-storage]
(keys fall back to .env values)`);
      process.exit(1);
    }
  } catch (e) {
    console.error(`ERROR: ${e.message}`);
    process.exit(1);
  }
}

export { lit, castFor, splitStatements, chunkRows, verify, CAST, PG_CAST, REQUIRED_BUCKETS };
