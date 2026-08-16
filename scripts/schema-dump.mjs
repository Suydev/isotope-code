// Full portable schema dump for IsotopeAI (no user data).
// Uses the Supabase PAT (SUPABASE_ACCESS_TOKEN) via the Management API query
// endpoint. Output: sql/isotope-schema-restore.sql
// Run:  node scripts/schema-dump.mjs
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const ROOT = dirname(fileURLToPath(import.meta.url)) === process.cwd()
  ? process.cwd()
  : join(dirname(fileURLToPath(import.meta.url)), '..');
// Keys: process env wins (backup.sh may pass CLI keys via env), .env is the
// fallback so the script still works when invoked directly.
function loadEnv() {
  const env = { ...process.env };
  // Same precedence as backup.sh: .backup_env (keeper project) > .env.
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
  console.error('ERROR: SUPABASE_URL and SUPABASE_ACCESS_TOKEN required (set in .env or export them)');
  process.exit(1);
}
const project = new URL(env.SUPABASE_URL).hostname.split('.')[0];

process.on('uncaughtException', (e) => {
  console.error(`ERROR: ${e.message}`);
  process.exit(1);
});

const query = (sql) => new Promise((resolve, reject) => {
  const req = https.request({
    hostname: 'api.supabase.com',
    path: `/v1/projects/${project}/database/query`,
    method: 'POST',
    headers: { Authorization: 'Bearer ' + env.SUPABASE_ACCESS_TOKEN, 'Content-Type': 'application/json' },
  }, (r) => {
    let b = ''; r.on('data', (c) => (b += c)); r.on('end', () => {
      if (r.statusCode === 201 || r.statusCode === 200) {
        try { resolve(JSON.parse(b)); } catch (e) { reject(new Error('bad json: ' + b.slice(0, 200))); }
      } else reject(new Error(`HTTP ${r.statusCode}: ${b.slice(0, 300)}`));
    });
  });
  req.on('error', reject);
  req.write(JSON.stringify({ query: sql })); req.end();
});

const out = [];
const counts = { schemas: 0, extensions: 0, types: 0, sequences: 0, tables: 0, views: 0, pks: 0, fks: 0, unique: 0, checks: 0, indexes: 0, functions: 0, triggers: 0, rls: 0, policies: 0, tableGrants: 0, fnGrants: 0 };
const add = (s) => { if (s) out.push(s); };
const scq = (schema) => quoteIdent(schema);

// 0. user schemas (exclude system + Supabase-managed)
const EXCLUDE_SCHEMAS = "'pg_catalog','information_schema','pg_toast','auth','storage','vault','extensions','supabase_migrations','realtime','_realtime','net','pgbouncer','supabase_functions','cron','graphql','graphql_public'";
let rows = await query(`
select n.nspname, n.nspacl::text as acl
from pg_namespace n
where n.nspname not in (${EXCLUDE_SCHEMAS})
  and n.nspname not like 'pg\\\\_%'
  and n.nspname not like 'pg_toast%'
  and n.nspname not like 'pg_temp%'
  and n.nspname not like 'pg_toast_temp%'
order by n.nspname;`);
const SCHEMAS = rows.map((r) => r.nspname).sort((a, b) => (a === 'public' ? 1 : b === 'public' ? -1 : a.localeCompare(b)));
console.log('schemas to dump:', SCHEMAS.join(', ') + ' (public last so dependent schemas/functions come first)');
const schemaAcl = Object.fromEntries(rows.map((r) => [r.nspname, r.acl]));
for (const s of SCHEMAS) {
  add(`CREATE SCHEMA IF NOT EXISTS ${sc(s)};`);
  counts.schemas++;
  if (schemaAcl[s]) {
    for (const g of schemaAcl[s].match(/([^=,{ ]+)=([^,}]+)/g) || []) {
      const role = g.split('=')[0];
      const privs = g.split('=')[1];
      if (role === 'postgres' || role === 'pg_database_owner') continue;
      if (privs.includes('U')) add(`GRANT USAGE ON SCHEMA ${sc(s)} TO ${role};`);
      if (privs.includes('C')) add(`GRANT CREATE ON SCHEMA ${sc(s)} TO ${role};`);
    }
  }
}
add('');
add(`GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;`);
add('');

// 1. extensions
rows = await query("select extname from pg_extension order by extname;");
for (const r of rows) { add(`CREATE EXTENSION IF NOT EXISTS ${quoteIdent(r.extname)};`); counts.extensions++; }
add('');

// 2. enum/domain types (all user schemas)
for (const s of SCHEMAS) {
  rows = await query(`
  select t.typname, t.typtype,
    (select string_agg(e.enumlabel::text, ',' order by e.enumsortorder)
       from pg_enum e where e.enumtypid = t.oid) as labels
  from pg_type t
  join pg_namespace n on n.oid = t.typnamespace and n.nspname = '${s.replace(/'/g, "''")}'
  where t.typtype in ('e','d') and not exists (select 1 from pg_type el where el.typrelid = t.oid and el.typtype <> t.typtype)
  order by t.typname;`);
  for (const r of rows) {
    if (r.typtype === 'e') add(`DO $$ BEGIN\n  CREATE TYPE ${sc(s)}.${quoteIdent(r.typname)} AS ENUM (${r.labels.split(',').map((l) => quoteLiteral(l)).join(', ')});\nEXCEPTION WHEN duplicate_object THEN null;\nEND $$;`);
    else add(`DO $$ BEGIN\n  CREATE DOMAIN ${sc(s)}.${quoteIdent(r.typname)} AS ${r.labels};\nEXCEPTION WHEN duplicate_object THEN null;\nEND $$;`);
    counts.types++;
  }
}
add('');

// 3. sequences
for (const s of SCHEMAS) {
  rows = await query(`
  select s.relname as seqname, t.relname as tblname, a.attname as colname
  from pg_class s
  join pg_namespace n on n.oid = s.relnamespace and n.nspname = '${s.replace(/'/g, "''")}' and s.relkind = 'S'
  left join pg_depend d on d.objid = s.oid and d.classid = 'pg_class'::regclass and d.deptype in ('a','i')
  left join pg_class t on t.oid = d.refobjid
  left join pg_attribute a on a.attrelid = d.refobjid and a.attnum = d.refobjsubid
  where not exists (select 1 from pg_depend di where di.objid = s.oid and di.deptype = 'i')
  order by s.relname;`);
  for (const r of rows) {
    add(`CREATE SEQUENCE IF NOT EXISTS ${sc(s)}.${quoteIdent(r.seqname)};`);
    if (r.tblname) add(`ALTER SEQUENCE ${sc(s)}.${quoteIdent(r.seqname)} OWNED BY ${sc(s)}.${quoteIdent(r.tblname)}.${quoteIdent(r.colname)};`);
    counts.sequences++;
  }
}
add('');

// 4. tables
const schemaOf = new Map(); // relname(schema-qualified) -> [col defs]
for (const s of SCHEMAS) {
  rows = await query(`
  select c.relname, c.relkind,
    a.attname, format_type(a.atttypid, a.atttypmod) as ftype,
    a.attnotnull, a.attidentity, a.attgenerated,
    (select pg_get_expr(ad.adbin, ad.adrelid) from pg_attrdef ad
      where ad.adrelid = c.oid and ad.adnum = a.attnum) as def
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace and n.nspname = '${s.replace(/'/g, "''")}'
  join pg_attribute a on a.attrelid = c.oid and a.attnum > 0 and not a.attisdropped
  where c.relkind in ('r','p')
  order by c.relname, a.attnum;`);
  for (const r of rows) {
    const key = s + '.' + r.relname;
    if (!schemaOf.has(key)) schemaOf.set(key, []);
    const colParts = [quoteIdent(r.attname), r.ftype];
    if (r.attgenerated === 's') colParts.push('generated always as (' + r.def + ') stored');
    else if (r.attgenerated === 'v') colParts.push('generated always as (' + r.def + ') virtual');
    else {
      if (r.attidentity === 'a') colParts.push('generated always as identity');
      else if (r.attidentity === 'd') colParts.push('generated by default as identity');
      if (r.attnotnull) colParts.push('not null');
      if (r.def) colParts.push('default ' + r.def);
    }
    schemaOf.get(key).push(colParts.join(' '));
  }
}
for (const [key, cols] of schemaOf) {
  const [s, name] = key.split('.');
  add(`CREATE TABLE IF NOT EXISTS ${sc(s)}.${quoteIdent(name)} (\n  ${cols.join(',\n  ')}\n);`);
  counts.tables++;
}
add('');

// 5. views / matviews
for (const s of SCHEMAS) {
  rows = await query(`
  select c.relname, c.relkind, pg_get_viewdef(c.oid) as def
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace and n.nspname = '${s.replace(/'/g, "''")}'
  where c.relkind in ('v','m') order by c.relname;`);
  for (const r of rows) {
    const kw = r.relkind === 'm' ? 'MATERIALIZED VIEW' : 'VIEW';
    add(`CREATE OR REPLACE ${kw} ${sc(s)}.${quoteIdent(r.relname)} AS\n${r.def.trimEnd()};`);
    counts.views++;
  }
}
add('');

// 6. primary keys
for (const s of SCHEMAS) {
  rows = await query(`
  select tc.table_name, string_agg(kcu.column_name, ', ' order by kcu.ordinal_position) as cols, tc.constraint_name
  from information_schema.table_constraints tc
  join information_schema.key_column_usage kcu
    on kcu.constraint_name = tc.constraint_name and kcu.table_schema = tc.table_schema
  where tc.constraint_type = 'PRIMARY KEY' and tc.table_schema = '${s.replace(/'/g, "''")}'
  group by tc.table_name, tc.constraint_name order by tc.table_name;`);
  for (const r of rows) {
    add(`ALTER TABLE ONLY ${sc(s)}.${quoteIdent(r.table_name)} ADD CONSTRAINT ${quoteIdent(r.constraint_name)} PRIMARY KEY (${r.cols});`);
    counts.pks++;
  }
}
add('');

// 7-9. FK / unique / check constraints
for (const s of SCHEMAS) {
  rows = await query(`
  select conname, conrelid::regclass::text as tbl, pg_get_constraintdef(oid) as def, contype
  from pg_constraint where connamespace = '${s.replace(/'/g, "''")}'::regnamespace and contype = 'f'
  order by conname;`);
  for (const r of rows) {
    add(`ALTER TABLE ONLY ${sc(s)}.${quoteIdent(r.tbl.split('.').pop())} ADD CONSTRAINT ${quoteIdent(r.conname)} ${r.def};`);
    counts.fks++;
  }
  rows = await query(`
  select conname, conrelid::regclass::text as tbl, pg_get_constraintdef(oid) as def
  from pg_constraint where connamespace = '${s.replace(/'/g, "''")}'::regnamespace and contype = 'u'
  order by conname;`);
  for (const r of rows) {
    add(`ALTER TABLE ONLY ${sc(s)}.${quoteIdent(r.tbl.split('.').pop())} ADD CONSTRAINT ${quoteIdent(r.conname)} ${r.def};`);
    counts.unique++;
  }
  rows = await query(`
  select conname, conrelid::regclass::text as tbl, pg_get_constraintdef(oid) as def
  from pg_constraint where connamespace = '${s.replace(/'/g, "''")}'::regnamespace and contype = 'c'
  order by conname;`);
  for (const r of rows) {
    add(`ALTER TABLE ONLY ${sc(s)}.${quoteIdent(r.tbl.split('.').pop())} ADD CONSTRAINT ${quoteIdent(r.conname)} ${r.def};`);
    counts.checks++;
  }
}
add('');

// 10. indexes
for (const s of SCHEMAS) {
  rows = await query(`
  select i.indexrelid::regclass::text as name, pg_get_indexdef(i.indexrelid) as def
  from pg_index i
  join pg_class c on c.oid = i.indrelid
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = '${s.replace(/'/g, "''")}' and not i.indisprimary
    and not exists (select 1 from pg_constraint con where con.conindid = i.indexrelid)
  order by name;`);
  for (const r of rows) {
    add(r.def.replace(/^CREATE INDEX/, 'CREATE INDEX IF NOT EXISTS') + ';');
    counts.indexes++;
  }
}
add('');

// 11. functions — rebuilt from pg_proc components with a collision-proof
// dollar-quote delimiter (pg_get_functiondef is NOT round-trip safe: some
// bodies contain stray `$function$` text that breaks the emitted delimiter).
for (const s of SCHEMAS) {
  rows = await query(`
  select p.proname, p.oid,
    pg_get_function_arguments(p.oid) as args,
    pg_get_function_result(p.oid) as result,
    p.provolatile, p.prosecdef, p.proisstrict,
    l.lanname,
    array_to_json(p.proconfig) as setconfigs_json,
    p.prosrc
  from pg_proc p
  join pg_language l on l.oid = p.prolang
  join pg_namespace n on n.oid = p.pronamespace and n.nspname = '${s.replace(/'/g, "''")}'
  where p.prokind in ('f','p') and not exists (
    select 1 from pg_depend d where d.objid = p.oid and d.deptype = 'i')
  order by p.proname;`);
  for (const r of rows) {
    add(buildFunctionDef(s, r));
    counts.functions++;
  }
}
add('');

// 12. triggers
for (const s of SCHEMAS) {
  rows = await query(`
  select t.tgname, pg_get_triggerdef(t.oid) as def, c.relname as tbl
  from pg_trigger t
  join pg_class c on c.oid = t.tgrelid
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = '${s.replace(/'/g, "''")}' and not t.tgisinternal
  order by t.tgname;`);
  for (const r of rows) {
    add(`DROP TRIGGER IF EXISTS ${quoteIdent(r.tgname)} ON ${sc(s)}.${quoteIdent(r.tbl)};`);
    add(r.def + ';');
    counts.triggers++;
  }
}
add('');

// 13. RLS enablement
for (const s of SCHEMAS) {
  rows = await query(`
  select c.relname from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = '${s.replace(/'/g, "''")}' and c.relrowsecurity order by c.relname;`);
  for (const r of rows) {
    add(`ALTER TABLE ${sc(s)}.${quoteIdent(r.relname)} ENABLE ROW LEVEL SECURITY;`);
    counts.rls++;
  }
}
add('');

// 14. policies
for (const s of SCHEMAS) {
  rows = await query(`
  select c.relname, p.polname, p.polcmd, p.polpermissive,
    array_to_string(array(select rr.rolname from unnest(p.polroles) pr(rr) join pg_roles rr on rr.oid = pr.rr), ',') as roles,
    pg_get_expr(p.polqual, p.polrelid) as qual,
    pg_get_expr(p.polwithcheck, p.polrelid) as withcheck
  from pg_policy p
  join pg_class c on c.oid = p.polrelid
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = '${s.replace(/'/g, "''")}'
  order by c.relname, p.polname;`);
  for (const r of rows) {
    add(`DROP POLICY IF EXISTS ${quoteIdent(r.polname)} ON ${sc(s)}.${quoteIdent(r.relname)};`);
    const permissive = r.polpermissive ? 'AS PERMISSIVE' : 'AS RESTRICTIVE';
    const CMD_WORDS = { r: 'SELECT', a: 'INSERT', w: 'UPDATE', d: 'DELETE', '*': 'ALL' };
    const cmd = CMD_WORDS[r.polcmd] || r.polcmd.toUpperCase();
    const roles = r.roles ? `TO ${r.roles.split(',').map((x) => x.trim()).join(', ')}` : '';
    let stmt = `CREATE POLICY ${quoteIdent(r.polname)} ON ${sc(s)}.${quoteIdent(r.relname)} ${permissive} FOR ${cmd} ${roles} `;
    if (r.qual) stmt += `USING (${r.qual}) `;
    if (r.withcheck) stmt += `WITH CHECK (${r.withcheck})`;
    add(stmt.trimEnd() + ';');
    counts.policies++;
  }
}
add('');

// 15. grants on tables/sequences/views
for (const s of SCHEMAS) {
  rows = await query(`
  select c.relname, c.relkind, g.grantee::regrole::text as grantee, g.privilege_type as priv, g.is_grantable
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace and n.nspname = '${s.replace(/'/g, "''")}'
  cross join lateral aclexplode(c.relacl) g
  where c.relkind in ('r','S','v','m') and g.grantee::regrole::text in ('anon','authenticated','service_role')
  order by c.relname, grantee, priv;`);
  for (const r of rows) {
    const kind = r.relkind === 'S' ? 'SEQUENCE' : 'TABLE';
    add(`GRANT ${r.priv} ON ${kind} ${scIdent(s)}.${quoteIdent(r.relname)} TO ${r.grantee}${r.is_grantable ? ' WITH GRANT OPTION' : ''};`);
    counts.tableGrants++;
  }
}
add('');

// 16. function execute grants
for (const s of SCHEMAS) {
  rows = await query(`
  select p.proname, pg_get_function_identity_arguments(p.oid) as ident, g.grantee::regrole as grantee
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace and n.nspname = '${s.replace(/'/g, "''")}'
  cross join lateral aclexplode(p.proacl) g
  where g.grantee::regrole::text in ('anon','authenticated','service_role') and g.privilege_type = 'EXECUTE'
  order by p.proname, ident, grantee;`);
  let prevSig = '';
  for (const r of rows) {
    const sig = `${r.proname}|${r.ident}`;
    if (sig === prevSig) continue;
    prevSig = sig;
    add(`GRANT EXECUTE ON FUNCTION ${scIdent(s)}.${quoteIdent(r.proname)}(${r.ident}) TO ${r.grantee};`);
    counts.fnGrants++;
  }
}
add('');

const header = `-- =============================================================================
-- IsotopeAI — full portable schema dump (NO user data)
-- Generated: ${new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC
-- Project ref: ${project}
-- Schemas: ${SCHEMAS.join(', ')}
--
-- HOW TO RESTORE INTO A FRESH SUPABASE PROJECT:
--   1. Create a new Supabase project.
--   2. Open the SQL editor and run this ENTIRE file (it is transactional).
--   3. (Optional) recreate storage buckets used by the app (e.g. 'avatars').
--   4. Update .env: SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY
--      (and SUPABASE_ACCESS_TOKEN) to the new project's values, then restart.
--
-- NOTE: auth.* and storage.* schemas are managed by Supabase and are NOT
-- included. User data (profiles, groups, sessions, chat, stats) is excluded
-- intentionally. RLS policies, functions, triggers, indexes and grants are
-- fully restored so the app works out of the box.
-- =============================================================================
BEGIN;

`;
const footer = `COMMIT;
`;
const final = header + out.join('\n') + '\n' + footer;
const target = join(ROOT, 'sql', 'isotope-schema-restore.sql');
writeFileSync(target, final, 'utf8');

console.log('Wrote ' + target + ' (' + (final.length / 1024).toFixed(1) + ' KB)');
console.log('Counts:', JSON.stringify(counts));

function quoteIdent(x) { return '"' + String(x).replace(/"/g, '""') + '"'; }
function sc(s) { return quoteIdent(s); }
function scIdent(s) { return quoteIdent(s); }
function quoteLiteral(x) { return "'" + String(x).replace(/'/g, "''") + "'"; }

function buildFunctionDef(s, r) {
  const parts = [`CREATE OR REPLACE FUNCTION ${sc(s)}.${quoteIdent(r.proname)}(${r.args})`];
  parts.push(` RETURNS ${r.result}`);
  parts.push(` LANGUAGE ${r.lanname}`);
  parts.push(r.provolatile === 'v' ? ' VOLATILE' : r.provolatile === 's' ? ' STABLE' : ' IMMUTABLE');
  if (r.prosecdef) parts.push(' SECURITY DEFINER');
  if (r.proisstrict) parts.push(' STRICT');
  if (Array.isArray(r.setconfigs_json)) {
    for (const cfg of r.setconfigs_json) {
      const eq = cfg.indexOf('=');
      if (eq < 0) continue;
      const key = cfg.slice(0, eq).trim();
      const val = cfg.slice(eq + 1).trim();
      parts.push(` SET ${quoteIdent(key)} TO ${quoteLiteral(val)}`);
    }
  }
  const body = (r.prosrc || '').trimEnd();
  let tag = '$iso_fn$';
  let k = 0;
  while (body.includes(tag)) { k++; tag = '$iso_fn' + k + '$'; }
  parts.push(' AS ' + tag);
  parts.push(body);
  parts.push(tag + ';');
  return parts.join('\n');
}
const searchPathKw = 'search_path';