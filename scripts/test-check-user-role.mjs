#!/usr/bin/env node
/**
 * test-check-user-role.mjs — regression guard for the admin-enumeration oracle
 * in public.check_user_role (round R5b, 2026-10-08).
 *
 * THE DEFECT
 *   check_user_role(p_user_id uuid, p_role text) is SECURITY DEFINER and read
 *
 *     SELECT EXISTS (SELECT 1 FROM public.user_roles
 *                    WHERE user_id = p_user_id AND role = p_role);
 *
 *   Being a definer function is what makes it useful (RLS on user_roles would
 *   otherwise blank the answer), but it also means the CALLER picks which user
 *   is asked about -- there was no link between p_user_id and auth.uid() at all.
 *   anon held EXECUTE, so anyone could ask "does <uuid> hold role X" for any
 *   user id, one request per guess.
 *
 *   That matters because user_roles is the authoritative admin store:
 *   server.mjs isSupabaseAdminUser() promotes a row whose role is
 *   owner|admin|super_admin into an admin session. So the leak answers exactly
 *   the question worth asking before targeting an account.
 *
 * WHY THIS IS NOT A GREP
 *   The test lifts the real body out of the dump and runs it against real rows
 *   in node:sqlite, with auth.uid() bound the way the RPC sees it. It asserts
 *   the answer for a stranger is false no matter which role is guessed, that the
 *   subject's own roles are still readable, and that a genuine admin row is
 *   still detected -- so neither a blanket-false nor a broken lookup passes.
 *
 * CI: `npm run test:check-user-role`
 */
import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';

const ROOT = process.env.ROOT || fileURLToPath(new URL('..', import.meta.url));
const DUMPS = [`${ROOT}/isotope-complete.sql`, `${ROOT}/sql/isotope-schema-restore.sql`];

const CALLER  = 'usr-caller';
const ADMIN   = 'usr-somebody-else-admin';
const STRANGER_ROLE = 'admin';

let failures = 0;
const ok = (label, bad) => {
  if (!bad) { console.log(`  ✅ ${label}`); return; }
  failures++;
  console.log(`  ❌ ${label}\n       ${bad}`);
};

/** Pull the function body out of the dump, verbatim. */
function extractBody(sql, fn) {
  const start = sql.indexOf(`CREATE OR REPLACE FUNCTION "public"."${fn}"(`);
  if (start < 0) return null;
  const end = sql.indexOf('\n$iso_fn$;', start);
  if (end < 0) return null;
  const block = sql.slice(start, end);
  return block.slice(block.indexOf('AS $iso_fn$') + 'AS $iso_fn$'.length);
}

/**
 * Reduce the dumped body to the one SELECT it performs, with the plpgsql
 * parameters left as named placeholders.
 *
 * `p_user_id` and `p_role` stay as parameters rather than literals, because
 * whether they are constrained to the caller is exactly what is under test --
 * substituting them here would hide the very predicate being asserted on.
 * auth.uid() becomes a third placeholder, bound per invocation.
 */
function bodyToSelect(body) {
  const sql = body
    .split('\n')
    .map((l) => { const i = l.indexOf('--'); return i < 0 ? l : l.slice(0, i); })
    .join('\n');
  // Accept both layouts: the multi-line EXISTS(...) block and the original
  // single-line `SELECT EXISTS (SELECT 1 FROM ... WHERE ...);`.
  const m = /SELECT\s+EXISTS\s*\([\s\S]*?\)\s*;/i.exec(sql);
  if (!m) throw new Error('could not find the EXISTS(SELECT ...) the function performs');
  // Walk the text left to right so each '?' records which term it stands for,
  // in the order the function actually compares them. Substituting a fixed
  // order would assume the very thing the test is checking.
  const order = [];
  const out = m[0].replace(/;\s*$/, '').replace(
    // auth.uid() FIRST: `p_role` would not match it, but the ordering of
    // the alternatives still decides how a term is classified, so the longest
    // and most specific pattern goes first.
    /\(SELECT auth\.uid\(\)\)|\bp_user_id\b|\bp_role\b/gi,
    (term) => { order.push(/^\(SELECT/i.test(term) ? 'uid' : term.toLowerCase()); return '?'; }
  );
  return { sql: out, order };
}

/**
 * Evaluate the function as the caller `uid` asking about `subject` for `role`.
 * Parameters bind in the order their placeholders appear in the source, which
 * is the order the function actually compares them -- read off the statement
 * rather than assumed.
 */
function ask(db, uid, subject, role) {
  const values = { p_user_id: subject, p_role: role, uid };
  const args = SELECT_CACHE.order.map((k) => values[k]);
  // Postgres' EXISTS yields a boolean; SQLite yields 0/1 under the same name the
  // function projects, so read the single column whatever it is called.
  const row = db.prepare(SELECT_CACHE.sql).get(...args);
  return Object.values(row)[0] === 1;
}

let SELECT_CACHE = { sql: '', order: [] };

/** Count how many distinct parameters the function actually references. */
function referencedParams(body) {
  const found = new Set((body.match(/\bp_(user_id|role)\b/gi) || []).map((x) => x.toLowerCase()));
  return found;
}

function run(dump) {
  const sql = fs.readFileSync(dump, 'utf8');
  const label = dump.replace(`${ROOT}/`, '');
  console.log(`── ${label}`);

  const body = extractBody(sql, 'check_user_role');
  if (!body) { ok('check_user_role: body located in dump', 'not found'); return; }
  try { SELECT_CACHE = bodyToSelect(body); }
  catch (e) { ok('check_user_role: body reduced to its SELECT', e.message); return; }
  ok('every parameter the function reads is bound', SELECT_CACHE.order.every((k) => k in { p_user_id: 1, p_role: 1, uid: 1 })
     ? '' : `unbound: ${SELECT_CACHE.order.join(',')}`);

  // If the function never references p_user_id at all it cannot leak, but that
  // would also make it ignore its argument -- assert the pin exists instead of
  // relying on that coincidence.
  const pinsSubject = /\bp_user_id\b/i.test(body) && /(auth\.uid\(\)|auth\.role\(\))/i.test(body);
  ok('the subject id is tied to the caller', pinsSubject ? '' : 'p_user_id is not constrained by auth');

  const db = new DatabaseSync(':memory:');
  db.exec(`
    ATTACH DATABASE ':memory:' AS public;
    CREATE TABLE public.user_roles (user_id TEXT, role TEXT);
    INSERT INTO public.user_roles VALUES
      ('${ADMIN}',   '${STRANGER_ROLE}'),
      ('${CALLER}', 'user');
  `);

  // 1. The defect: asking about somebody ELSE must never answer yes.
  for (const role of ['admin', 'owner', 'super_admin']) {
    const hit = ask(db, CALLER, ADMIN, role);
    ok(`stranger cannot learn that ${ADMIN} holds '${role}'`,
       hit ? 'the function returned true about another user' : '');
  }

  // 2. anon (auth.uid() IS NULL) must learn nothing at all.
  const anonHit = ask(db, null, ADMIN, STRANGER_ROLE);
  ok('anonymous caller learns nothing about any user', anonHit ? 'returned true' : '');

  // 3. The caller's own roles are still answerable -- the function is not a stub.
  const ownUser = ask(db, CALLER, CALLER, 'user');
  ok('caller can still read their own role', ownUser ? '' : 'own role came back false (function is now useless)');

  const ownAdmin = ask(db, CALLER, CALLER, STRANGER_ROLE);
  ok("caller who is not admin gets false for their own 'admin'",
     ownAdmin ? 'claimed admin' : '');

  // 4. A real admin row is still detected when asked about themselves, so the
  //    predicate itself is still doing its job.
  const realAdmin = ask(db, ADMIN, ADMIN, STRANGER_ROLE);
  ok('a genuine admin row is still detected for its owner', realAdmin ? '' : 'admin row not found');

  // 5. anon must not even hold EXECUTE.
  const grants = sql.includes('GRANT EXECUTE ON FUNCTION "public"."check_user_role"(p_user_id uuid, p_role text) TO anon;');
  ok('anon holds no EXECUTE grant on check_user_role', grants ? 'anon can still call it' : '');

  db.close();
  console.log('');
}

console.log("check_user_role must not answer questions about anybody but the caller (R5b)\n");
for (const dump of DUMPS) run(dump);

if (failures) {
  console.error(`FAILED: ${failures} assertion(s)`);
  process.exit(1);
}
console.log('All check_user_role assertions passed.');
