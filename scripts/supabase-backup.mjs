#!/usr/bin/env node
// IsotopeAI full Supabase backup/restore (DB data + auth users + storage).
// Uses the management API (SUPABASE_ACCESS_TOKEN) for SQL and the REST API
// (SUPABASE_SERVICE_ROLE_KEY) for storage. Schema is handled by
// scripts/schema-dump.mjs (see backup.sh).
//
// backup:  node scripts/supabase-backup.mjs backup --out DIR [--no-storage]
// restore: node scripts/supabase-backup.mjs restore --src DIR
//            --supabase-url URL --anon-key K --service-key K --pat TOKEN
//            [--no-storage]
import { readFileSync, writeFileSync, mkdirSync, createWriteStream, existsSync } from 'fs';
import { dirname, join, sep, relative } from 'path';
import { fileURLToPath } from 'url';

const ROOT = dirname(fileURLToPath(import.meta.url)) === process.cwd()
  ? process.cwd()
  : join(dirname(fileURLToPath(import.meta.url)), '..');

const EXCLUDE_SCHEMAS = new Set([
  'pg_catalog', 'information_schema', 'pg_toast', 'auth', 'storage', 'vault',
  'extensions', 'supabase_migrations', 'realtime', '_realtime', 'net',
  'pgbouncer', 'supabase_functions', 'cron', 'graphql', 'graphql_public',
]);

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
  const s = typeof v === 'string' ? v : JSON.stringify(v);
  return `'${s.replace(/'/g, "''")}'::${cast}`;
}

function streamToFile(res, file) {
  return new Promise((resolve, reject) => {
    const ws = createWriteStream(file);
    res.body.pipe(ws);
    ws.on('finish', resolve);
    ws.on('error', reject);
    res.body.on('error', reject);
  });
}

async function sha256(buf) {
  const { createHash } = await import('crypto');
  return createHash('sha256').update(buf).digest('hex');
}

// ── SQL access via management API ───────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let _lastCall = 0;
const MIN_GAP = 120;

function createSqlClient(projectRef, pat) {
  const url = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;
  async function query(sql, _retries = 0) {
    const wait = Math.max(0, MIN_GAP - (Date.now() - _lastCall));
    if (wait && _retries === 0) await sleep(wait);
    _lastCall = Date.now();
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
  async function createBucket(id, isPublic) {
    const res = await fetch(url('bucket'), {
      method: 'POST', headers: { ...H, 'content-type': 'application/json' },
      body: JSON.stringify({ id, name: id, public: !!isPublic }),
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

async function tableColumns(sql, schema, table) {
  return sql.query(`select column_name, is_nullable, is_generated, data_type, udt_schema, udt_name
    from information_schema.columns
    where table_schema = '${schema.replace(/'/g, "''")}' and table_name = '${table.replace(/'/g, "''")}'
    order by ordinal_position`);
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
  return sql.query(`select c.conrelid::regclass::text as tbl, c.confrelid::regclass::text as ftbl
    from pg_constraint c
    join pg_class r on r.oid = c.conrelid
    join pg_namespace n on n.oid = r.relnamespace
    where c.contype = 'f' and n.nspname in ${inList}`);
}

function topoSort(tables, fks) {
  const keyOf = (t) => t.key || `${t.schema}.${t.table}`;
  const qualify = (x) => {
    const m = String(x).match(/^"?([^".]+)"?\.?"?([^".]+)"?$/);
    if (m && m[2]) return `${m[1]}.${m[2]}`;
    const bare = String(x).replace(/"/g, '');
    return deps.has(`public.${bare}`) ? `public.${bare}` : bare;
  };
  const deps = new Map(tables.map((t) => [keyOf(t), []]));
  for (const fk of fks) {
    const from = qualify(decodeRegclass(fk.tbl)), to = qualify(decodeRegclass(fk.ftbl));
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

function decodeRegclass(s) {
  const m = String(s).match(/^"?([^".]+)"?\.?"?([^".]+)"?$/);
  return m ? `${m[1].replace(/"/g, '')}.${m[2].replace(/"/g, '')}` : String(s);
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
    notes: [],
  };

  // data tables (exclude auth — handled separately)
  const tables = (await tableList(sql)).filter((t) => t.schema !== 'auth');
  console.log(`[backup] tables: ${tables.length}`);
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
      continue;
    }
    writeFileSync(file, rows.map((r) => JSON.stringify(r)).join('\n') + (rows.length ? '\n' : ''));
    info.count = rows.length;
    byKey.set(`${t.schema}.${t.table}`, info);
    manifest.tables.push(info);
    console.log(`[backup] ${t.schema}.${t.table}: ${rows.length} rows`);
  }

  // FK order (auth.users counted as a source that never depends on us)
  const fks = await foreignKeys(sql, [...schemas, 'auth']);
  for (const fk of fks) {
    const from = decodeRegclass(fk.tbl), to = decodeRegclass(fk.ftbl);
    const t = byKey.get(from);
    if (t) t.fk_to.push(to);
  }
  manifest.fk_order = topoSort(
    manifest.tables,
    manifest.tables.flatMap((t) => t.fk_to.map((to) => ({ tbl: t.schema + '.' + t.table, ftbl: to })))
  ).map((t) => `${t.schema}.${t.table}`);

  // auth.users (metadata only; encrypted_password carries the bcrypt hash)
  const authCols = (colsByTable.get('auth.users') || []);
  const authDump = authCols.filter((c) => c.is_generated !== 'ALWAYS' && !/(confirmation|recovery|change|reauth|otp|updated_|phone_change|email_change|invited|last_sign|is_anonymous|is_sso|is_phone)/i.test(c.column_name) && c.column_name !== 'instance_id');
  manifest.auth_columns = authDump.map((c) => ({ name: c.column_name, cast: castFor(c) }));
  const authRows = await sql.query(`select ${authDump.map((c) => `"${c.column_name}"`).join(', ')} from auth.users`);
  writeFileSync(join(args.out, 'db', 'auth.users.jsonl'), authRows.map((r) => JSON.stringify(r)).join('\n') + (authRows.length ? '\n' : ''));
  console.log(`[backup] auth.users: ${authRows.length} users`);

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
        for (const rel of files) {
          const file = join(args.out, 'storage', b.id, ...rel.split('/'));
          try {
            const buf = await st.download(b.id, rel);
            mkdirSync(dirname(file), { recursive: true });
            writeFileSync(file, buf);
            manifest.storage_files.push({ bucket: b.id, path: rel, size: buf.length, sha256: await sha256(buf) });
          } catch (e) {
            manifest.notes.push(`storage ${b.id}/${rel}: download failed — ${e.message.slice(0, 150)}`);
            console.log(`[backup] FAIL ${b.id}/${rel}: ${e.message.slice(0, 120)}`);
          }
        }
      }
    }
  }

  writeFileSync(join(args.out, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  console.log(`[backup] DONE: ${manifest.tables.length} tables, ${authRows.length} auth users, ${manifest.storage_files.length} storage files`);
  if (manifest.notes.length) console.log('[backup] notes:\n  ' + manifest.notes.join('\n  '));
}

// ── RESTORE ─────────────────────────────────────────────────────────────────
async function restore(args, env) {
  const url = args['supabase-url'] || env.SUPABASE_URL;
  const anon = args['anon-key'] || env.SUPABASE_ANON_KEY;
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
    let sqlText = readFileSync(schemaFile, 'utf8');
    // Strip transaction wrappers — management API doesn't support multi-statement transactions
    sqlText = sqlText.replace(/^\s*BEGIN\s*;?\s*\n/gim, '').replace(/^\s*COMMIT\s*;?\s*\n/gim, '');
    const stmts = splitStatements(sqlText);
    console.log(`[restore] applying schema (${stmts.length} statements, one at a time)…`);
    let ok = 0, skipped = 0, failed = 0;
    for (const stmt of stmts) {
      try { await sql.query(stmt); ok++; }
      catch (e) {
        const msg = e.message || '';
        // "already exists" / "does not exist" / "multiple primary keys" are expected idempotency errors — safe to skip
        if (/already exists|does not exist|duplicate|skipping|multiple primary keys/i.test(msg)) { skipped++; continue; }
        failed++;
        if (failed <= 20) console.log(`  schema FAILED: ${msg.slice(0, 250)}`);
      }
      if ((ok + failed) % 100 === 0) process.stdout.write(`  ${ok + failed}/${stmts.length}…\r`);
    }
    console.log(`[restore] schema: ${ok} applied, ${skipped} skipped (idempotent), ${failed} failed`);
  } else {
    console.log('[restore] no schema.sql — assuming target already has schema');
  }

  // 2. auth.users (must come before user tables that FK to it)
  const authFile = join(args.src, 'db', 'auth.users.jsonl');
  if (existsSync(authFile)) {
    const rows = readFileSync(authFile, 'utf8').split('\n').filter(Boolean).map(JSON.parse);
    const cols = manifest.auth_columns;
    console.log(`[restore] auth.users: ${rows.length} users`);
    let ok = 0, failed = 0;
    for (const r of rows) {
      try {
        await sql.query(`insert into auth.users (${cols.map((c) => `"${c.name}"`).join(', ')}) values (${cols.map((c) => lit(r[c.name], c.cast)).join(', ')}) on conflict (id) do nothing`);
        ok++;
      } catch (e) {
        // ON CONFLICT might fail if PK constraint name differs — try plain insert
        try {
          await sql.query(`insert into auth.users (${cols.map((c) => `"${c.name}"`).join(', ')}) values (${cols.map((c) => lit(r[c.name], c.cast)).join(', ')})`);
          ok++;
        } catch (e2) {
          failed++;
          if (failed <= 10) console.log(`  auth user ${r.email || r.id} FAILED: ${e2.message.slice(0, 200)}`);
        }
      }
    }
    console.log(`[restore] auth.users: ${ok} ok, ${failed} failed`);
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
  for (const key of order) {
    const info = manifest.tables.find((t) => `${t.schema}.${t.table}` === key);
    if (!info) continue;
    const file = join(args.src, 'db', `${key}.jsonl`);
    if (!existsSync(file)) { console.log(`[restore] ${key}: no file`); continue; }
    const rows = readFileSync(file, 'utf8').split('\n').filter(Boolean).map(JSON.parse);
    if (!rows.length) { console.log(`[restore] ${key}: 0 rows`); continue; }
    const cols = info.columns;
    const colList = cols.map((c) => `"${c.name}"`).join(', ');
    let ok = 0, failed = 0;
    for (const chunk of chunkRows(rows, 100)) {
      const values = chunk.map((r) => `(${cols.map((c) => lit(r[c.name], c.cast)).join(', ')})`).join(', ');
      let inserted = false;
      for (const over of [true, false]) {
        try {
          await sql.query(`insert into "${info.schema}"."${info.table}" (${colList})${over ? ' overriding system value' : ''} values ${values} on conflict do nothing`);
          ok += chunk.length; inserted = true; break;
        } catch (e) {
          if (over) continue;
          for (const r of chunk) {
            try {
              await sql.query(`insert into "${info.schema}"."${info.table}" (${colList}) overriding system value values (${cols.map((c) => lit(r[c.name], c.cast)).join(', ')}) on conflict do nothing`);
              ok++;
            } catch { failed++; }
          }
        }
      }
    }
    console.log(`[restore] ${key}: ${ok} ok, ${failed} failed`);
  }

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

  // 5. storage
  if (!args['no-storage']) {
    if (!service) {
      console.log('[restore] WARN: no service key — skipping storage');
    } else {
      const st = createStorageClient(url, service);
      for (const b of manifest.buckets) {
        try {
          await st.createBucket(b.id, b.public);
          console.log(`[restore] bucket ${b.id} ready (public=${b.public})`);
        } catch (e) { console.log(`[restore] bucket ${b.id}: ${e.message.slice(0, 150)}`); }
      }
      let ok = 0, failed = 0;
      const retries = (fn, n = 3) => fn().catch(async (e) => {
        if (n <= 1 || !/fetch failed|ECONNRESET|ETIMEDOUT|socket/i.test(e.message || '')) throw e;
        await new Promise((r) => setTimeout(r, 1500));
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
        } catch (e) { failed++; console.log(`  upload FAILED ${f.bucket}/${f.path}: ${e.message.slice(0, 150)}`); }
      }
      console.log(`[restore] storage: ${ok} ok, ${failed} failed`);
    }
  }

  console.log(`[restore] DONE (${project})`);
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
    check(actual === t.count, `rows ${key}`, actual === undefined ? 'count query failed' : `${actual} != ${t.count}`);
  }

  // 3. auth.users count matches the dump
  const authFile = join(src, 'db', 'auth.users.jsonl');
  if (existsSync(authFile)) {
    const expectAuth = readFileSync(authFile, 'utf8').split('\n').filter(Boolean).length;
    const [r] = await sql.query('select count(*)::bigint as n from auth.users');
    check(Number(r.n) === expectAuth, 'auth.users', `${r.n} != ${expectAuth}`);
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
    const countObjects = async (bucket) => {
      let n = 0;
      for (let off = 0; ; off += 1000) {
        const page = await st.listObjects(bucket, '', off, 1000);
        n += page.filter((o) => o.metadata && o.id).length;
        if (page.length < 1000) break;
      }
      return n;
    };
    for (const b of manifest.buckets) {
      if (!liveBuckets.has(b.id)) continue;
      const expect = manifest.storage_files.filter((f) => f.bucket === b.id).length;
      let actual;
      try { actual = await countObjects(b.id); } catch (e) { check(false, `objects ${b.id}`, e.message.slice(0, 120)); continue; }
      check(actual === expect, `objects ${b.id}`, `${actual} != ${expect}`);
    }
  }

  const status = fail ? 'FAIL' : 'PASS';
  console.log(`[verify] RESULT: ${status} (${checked - fail}/${checked} checks passed)`);
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

export { lit, castFor, splitStatements, chunkRows, verify, CAST, PG_CAST };
