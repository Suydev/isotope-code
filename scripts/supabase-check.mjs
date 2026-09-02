#!/usr/bin/env node
/**
 * supabase-check.mjs — read-only report on whether a project can run IsotopeAI.
 *
 *   node scripts/supabase-check.mjs --ref abc123      (SUPABASE_ACCESS_TOKEN in env)
 *
 * Changes nothing. Exists because "is this project set up?" was previously only
 * answerable by running a setup or a restore and reading the failures, and because
 * every check here corresponds to something that has silently failed in the past:
 *
 *   * 31 of 42 tables missing while the tool reported "0 failed"
 *   * the signup trigger absent, so 32 of 43 accounts had no public.users row
 *   * two buckets the app uploads to never created, so every group-icon upload 404'd
 *   * user_profiles.handle NULL for every user, so every buddy request failed
 *
 * Exit 0 if the project is usable, 1 if anything required is missing.
 */

import { existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MGMT = 'https://api.supabase.com';

// `notes` is not here: zero objects, zero references, no upload path. A required
// check for a bucket no feature uses fails for no reason and trains people to
// ignore the report.
const REQUIRED_BUCKETS = ['user-content', 'avatars', 'group-icons', 'study-material'];

// Thresholds, with the reason each number is what it is. Getting these wrong in
// either direction is worse than not checking: too high and a healthy project
// reports broken, too low and a quarter-applied schema reports fine.
//
// Counted on a correctly provisioned project (2026-08-30):
//   tables            42  in `public`
//   functions         73  in `public` — 72 distinct names, 8 of them overloaded;
//                     80 across public + rpc_private + private. The docs have
//                     conflated these three figures before, so this checks the
//                     `public` count and labels it as such.
//   policies         153  RLS policies in `public`
//   indexes          124  total in `public`, of which 66 are not constraint-backed
//                     (a PK or UNIQUE constraint owns an index too). 66 is what
//                     schema-dump.mjs reports; 124 is what pg_indexes returns.
const EXPECT = {
  tables: 42,
  functionsPublic: 73,
  policies: 153,
  indexes: 124,
};

// Tables handle_new_user() writes on signup. If any is absent the trigger fires
// and fails, which surfaces to the user as a successful signup into a broken app.
const SIGNUP_TABLES = ['users', 'user_profiles', 'user_points', 'user_stats_summary', 'user_presence', 'user_onboarding'];

// RPCs the compiled bundle calls directly. A missing one is a dead feature with no
// error until a user taps the thing.
const CRITICAL_RPCS = [
  'handle_new_user',
  'community_bootstrap_profile',
  'community_get_overview',
  'community_request_buddy',
  'community_respond_buddy',
  'community_remove_buddy',
  'community_discover_groups',
  'community_preview_invite',
  'community_redeem_invite',
  'community_create_invite',
];

function parseArgs(argv = process.argv.slice(2)) {
  const a = {};
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) continue;
    const k = argv[i].slice(2);
    a[k] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
  }
  return a;
}

function envKey(name) {
  if (process.env[name]) return process.env[name];
  for (const f of ['.backup_env', '.env']) {
    const p = join(ROOT, f);
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (m && m[1] === name && m[2].trim()) return m[2].trim().replace(/^["']|["']$/g, '');
    }
  }
  return null;
}

const args = parseArgs();
const pat = args.pat || envKey('SUPABASE_ACCESS_TOKEN');
const ref = args.ref;
if (!pat) { console.error('ERROR: SUPABASE_ACCESS_TOKEN or --pat required'); process.exit(1); }
if (!ref) { console.error('ERROR: --ref <project-ref> required'); process.exit(1); }

async function q(sql) {
  const res = await fetch(`${MGMT}/v1/projects/${ref}/database/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${pat}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: sql }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
  return JSON.parse(text);
}

/**
 * A query that may reference objects the project does not have yet.
 *
 * The whole point of this tool is to run against an EMPTY project, where
 * `select count(*) from public.users` is a hard 42P01 rather than a zero. A check
 * that cannot survive the state it exists to diagnose is not a check, so anything
 * touching app tables goes through here and reports the absence instead of
 * crashing on it.
 */
async function tryQ(sql, fallback = null) {
  try { return await q(sql); }
  catch (e) {
    if (/42P01|does not exist|42883/i.test(e.message)) return fallback;
    throw e;
  }
}

const rows = [];
const add = (ok, area, label, detail, fix) => rows.push({ ok, area, label, detail, fix });

// Header only in text mode: --json must emit nothing but JSON, or the consumer
// has to strip a preamble, which is the kind of coupling that breaks quietly.
if (!args.json) {
  console.log(`project: ${ref}`);
  console.log('');
}

// ── schema ───────────────────────────────────────────────────────────────────
const [c] = await q(`
  select
    (select count(*) from pg_tables   where schemaname = 'public')                   as tables,
    (select count(*) from pg_policies where schemaname = 'public')                   as policies,
    (select count(*) from pg_proc p join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and p.prokind = 'f')                                as functions,
    (select count(*) from pg_indexes  where schemaname = 'public')                   as indexes,
    (select count(*) from pg_trigger  where not tgisinternal)                        as triggers`);

add(Number(c.tables) >= EXPECT.tables, 'schema', 'tables',
  `${c.tables} (expect ${EXPECT.tables})`, './supabase.sh setup --ref ' + ref);
add(Number(c.functions) >= EXPECT.functionsPublic, 'schema', 'functions (public)',
  `${c.functions} (expect ${EXPECT.functionsPublic})`, './supabase.sh setup --ref ' + ref);
add(Number(c.policies) >= EXPECT.policies, 'schema', 'RLS policies',
  `${c.policies} (expect ${EXPECT.policies})`, './supabase.sh setup --ref ' + ref);
add(Number(c.indexes) >= EXPECT.indexes, 'schema', 'indexes',
  `${c.indexes} (expect ${EXPECT.indexes}; 66 excluding constraint-backed)`,
  './supabase.sh setup --ref ' + ref);

const missingTables = (await q(`
  select t from unnest(array[${SIGNUP_TABLES.map((t) => `'${t}'`).join(',')}]) t
   where t not in (select table_name from information_schema.tables where table_schema = 'public')`))
  .map((r) => r.t);
add(missingTables.length === 0, 'schema', 'signup target tables',
  missingTables.length ? `MISSING ${missingTables.join(', ')}` : `${SIGNUP_TABLES.length}/${SIGNUP_TABLES.length}`,
  './supabase.sh setup --ref ' + ref);

const missingRpcs = (await q(`
  select f from unnest(array[${CRITICAL_RPCS.map((f) => `'${f}'`).join(',')}]) f
   where f not in (select p.proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                    where n.nspname = 'public')`))
  .map((r) => r.f);
add(missingRpcs.length === 0, 'schema', 'critical RPCs',
  missingRpcs.length ? `MISSING ${missingRpcs.join(', ')}` : `${CRITICAL_RPCS.length}/${CRITICAL_RPCS.length}`,
  './supabase.sh setup --ref ' + ref);

// ── auth ─────────────────────────────────────────────────────────────────────
const [t] = await tryQ(`
  select
    (select count(*)::int from pg_trigger
      where tgname = 'on_auth_user_created' and tgrelid = 'auth.users'::regclass and not tgisinternal) as trg,
    (select count(*)::int from auth.users)   as auth_users,
    (select count(*)::int from public.users) as pub_users,
    (select count(*)::int from auth.users a
      where not exists (select 1 from public.users u where u.id = a.id))              as orphaned`,
  // public.users absent: fall back to the parts that do not depend on it, so the
  // report still says whether the trigger exists.
  await tryQ(`
    select
      (select count(*)::int from pg_trigger
        where tgname = 'on_auth_user_created' and tgrelid = 'auth.users'::regclass and not tgisinternal) as trg,
      (select count(*)::int from auth.users) as auth_users,
      0 as pub_users,
      (select count(*)::int from auth.users) as orphaned`, [{ trg: 0, auth_users: 0, pub_users: 0, orphaned: 0 }]));

add(Number(t.trg) === 1, 'auth', 'signup trigger on auth.users',
  Number(t.trg) === 1 ? 'present' : 'MISSING — every new account will be broken',
  'apply supabase/022_restore_signup_trigger.sql');
add(Number(t.orphaned) === 0, 'auth', 'accounts with app rows',
  Number(t.orphaned) === 0 ? `${t.auth_users}/${t.auth_users}` : `${t.orphaned} of ${t.auth_users} auth user(s) have no public.users row`,
  'apply supabase/022_restore_signup_trigger.sql (it backfills)');

// ── community / buddy ────────────────────────────────────────────────────────
const [b] = await tryQ(`
  select
    (select count(*)::int from public.user_profiles)                        as profiles,
    (select count(*)::int from public.user_profiles where handle is not null) as handles`,
  [{ profiles: 0, handles: 0 }]);
// Only meaningful once there are profiles: a brand-new project has 0 of both,
// which is correct rather than broken.
if (Number(b.profiles) > 0) {
  add(Number(b.handles) > 0, 'community', 'buddy handles populated',
    `${b.handles}/${b.profiles} profiles have a handle`,
    'apply supabase/021_fix_buddy_handle_and_overview.sql');
} else {
  add(true, 'community', 'buddy handles populated', 'no profiles yet', '');
}
const overviewRows = await tryQ('select k from jsonb_object_keys(public.community_get_overview()) k', null);
if (overviewRows === null) {
  add(false, 'community', 'overview returns buddies', 'community_get_overview() is missing',
    './supabase.sh setup --ref ' + ref);
} else {
  const overviewKeys = overviewRows.map((r) => r.k).sort();
  add(overviewKeys.includes('buddies'), 'community', 'overview returns buddies',
    overviewKeys.join(', ') || '(none)',
    'apply supabase/021_fix_buddy_handle_and_overview.sql');
}

// The buddy payload SHAPE, not just its presence.
//
// The compiled Community bundle dereferences `buddy.presence.state` and
// `.subject` at 22 sites with no optional chaining, including the mapper that
// builds a member row. An overview that returns flat `status`/`currentSubject`
// only — which the first version of 021 did — makes `presence` undefined for
// every buddy, and the first accepted buddy request blanks the page with
// `Cannot read properties of undefined (reading 'state')` inside render.
//
// Object counts cannot catch that: the RPC exists, returns `buddies`, and every
// other check passes.
//
// It is checked by reading the FUNCTION BODY, not by calling the function.
// community_get_overview() filters on auth.uid(), and the management API query
// endpoint runs as `postgres` with no JWT — auth.uid() is NULL — so the array is
// always empty here no matter how many buddy rows exist. On the test project:
//     auth.uid() -> null,  community_friends -> 1 row,  buddies -> 0
// Calling it and inspecting the result would therefore report on a payload no
// user will ever receive, which is worse than not checking. The body is the one
// piece of evidence that does not depend on who is asking.
const [src] = await tryQ(`
  select
    (pg_get_functiondef(p.oid) like '%''presence'', jsonb_build_object%')::boolean as nested,
    (pg_get_functiondef(p.oid) like '%''status''%')::boolean                       as flat_status,
    (pg_get_functiondef(p.oid) like '%''currentSubject''%')::boolean               as flat_subject,
    (pg_get_functiondef(p.oid) like '%''connectionId''%')::boolean                 as connection_id
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where n.nspname = 'public' and p.proname = 'community_get_overview'`,
  [{ nested: false, flat_status: false, flat_subject: false, connection_id: false }]);
{
  const want = { presence: src?.nested, status: src?.flat_status, currentSubject: src?.flat_subject, connectionId: src?.connection_id };
  const missing = Object.entries(want).filter(([, v]) => !v).map(([k]) => k);
  add(missing.length === 0, 'community', 'buddy payload shape',
    missing.length
      ? `MISSING ${missing.join(', ')} — Community crashes on the first accepted buddy`
      : 'presence{state,subject,task} + flat status/currentSubject',
    'apply supabase/021_fix_buddy_handle_and_overview.sql');
}

// ── storage ──────────────────────────────────────────────────────────────────
const buckets = await q(`
  select b from unnest(array[${REQUIRED_BUCKETS.map((x) => `'${x}'`).join(',')}]) b
   where b not in (select id from storage.buckets)`);
const missingBuckets = buckets.map((r) => r.b);
add(missingBuckets.length === 0, 'storage', 'buckets',
  missingBuckets.length ? `MISSING ${missingBuckets.join(', ')} — uploads to them return 404`
    : `${REQUIRED_BUCKETS.length}/${REQUIRED_BUCKETS.length}`,
  'apply supabase/023_wire_missing_storage_buckets.sql');

const [sp] = await q("select count(*)::int as n from pg_policies where schemaname = 'storage' and tablename = 'objects'");
add(Number(sp.n) >= 8, 'storage', 'object policies', `${sp.n} (expect 16)`,
  Number(sp.n) >= 8 ? '' : 'apply supabase/023_wire_missing_storage_buckets.sql');

// ── report ───────────────────────────────────────────────────────────────────
const failed = rows.filter((r) => !r.ok);

// --json for machines, aligned text for people.
//
// The web console used to parse the human output, and it silently lost a check:
// the label "signup trigger on auth.users" is exactly 28 characters, so
// `padEnd(28)` emitted no trailing spaces and a `\s{2,}` separator no longer
// matched — 13 checks became 12, with the missing one being the single most
// important check in the file. Column alignment is a presentation detail and must
// not be load-bearing, so the console now consumes this instead.
if (args.json) {
  process.stdout.write(JSON.stringify({
    ref,
    ready: failed.length === 0,
    total: rows.length,
    failed: failed.length,
    checks: rows.map((r) => ({ ok: r.ok, group: r.area, label: r.label, detail: r.detail, fix: r.fix || null })),
    fixes: [...new Set(failed.map((r) => r.fix).filter(Boolean))],
    manual: [
      { label: 'Google OAuth client', where: 'Authentication > Providers',
        detail: `redirect URI https://${ref}.supabase.co/auth/v1/callback` },
      { label: 'Redirect allow-list', where: 'Authentication > URL Configuration',
        detail: 'add your app URLs' },
    ],
  }, null, 2) + '\n');
  process.exit(failed.length ? 1 : 0);
}

let area = null;
for (const r of rows) {
  if (r.area !== area) { area = r.area; console.log(area.toUpperCase()); }
  console.log(`  ${r.ok ? 'ok  ' : 'FAIL'} ${r.label.padEnd(30)}  ${r.detail}`);
}
console.log('');
if (!failed.length) {
  console.log(`All ${rows.length} checks passed — this project can run the app.`);
  console.log('');
  console.log('Not checkable from the database (auth config, not schema):');
  console.log('  * Google OAuth client — Authentication > Providers');
  console.log(`    redirect URI  https://${ref}.supabase.co/auth/v1/callback`);
  console.log('  * redirect allow-list — Authentication > URL Configuration');
  process.exit(0);
}
console.log(`${failed.length} of ${rows.length} checks FAILED.`);
console.log('');
console.log('To fix:');
for (const f of [...new Set(failed.map((r) => r.fix).filter(Boolean))]) console.log(`  ${f}`);
process.exit(1);
