#!/usr/bin/env node
/**
 * test-group-role-guards.mjs — regression guard for the plpgsql NULL-guard bug in
 * the community_* group-management RPCs (round R5, 2026-10-08).
 *
 * THE DEFECT
 *   Five SECURITY DEFINER RPCs do the same two-step authorization dance:
 *
 *     SELECT role INTO v_role FROM public.group_members
 *      WHERE group_id = p_group_id AND user_id = v_uid;
 *     IF v_role != 'owner' THEN RETURN ...error...; END IF;
 *     <mutating body>
 *
 *   The body runs with the definer's rights, so that guard is the ONLY thing
 *   between a stranger and the mutation. But a user who is not a member has no
 *   group_members row, so SELECT ... INTO finds nothing and leaves v_role NULL.
 *   In plpgsql `IF NULL != 'owner'` evaluates to NULL, and `IF NULL THEN` takes
 *   the FALSE branch — the guard silently did nothing and the body ran for ANY
 *   signed-in caller. `IF v_role NOT IN ('owner','admin')` fails the same way.
 *
 *   Impact, per function:
 *     community_set_group_role       any user -> group_members.role = 'owner'
 *                                    for an arbitrary user_id (self-promotion)
 *     community_transfer_group       any user -> role='owner' for an arbitrary uid
 *     community_update_group        any user -> rewrite any groups row by id
 *     community_delete_group        any user -> soft-delete any group by id
 *     community_remove_group_member any user -> delete any member row by id
 *
 * WHY THIS IS NOT A GREP
 *   "Assert the source says IS DISTINCT FROM" would pass on text the database
 *   never executes, and this whole bug class lives in the gap between how a
 *   PL/pgSQL guard READS and how it EVALUATES. So this script does not
 *   pattern-match the guard. It:
 *
 *     1. lifts the real function body out of isotope-complete.sql,
 *     2. PARSES the body's IF/ELSE/END IF structure into a control-flow tree,
 *     3. runs that tree against a real SQL engine (node:sqlite), evaluating the
 *        guard's own predicate text against real rows, and executing every
 *        statement the tree reaches,
 *     4. asserts the tenant's rows are untouched for a stranger, and untouched
 *        for nobody who legitimately holds the role.
 *
 *   SQLite reproduces PostgreSQL's three-valued IF rule exactly: a WHEN/IF is
 *   taken only for a value that is neither 0/false nor NULL. That is the whole
 *   reason the bug exists, so the harness must model it — and it does so by
 *   asking the engine, not by reimplementing the comparison in JavaScript.
 *
 *   Three roles are recorded per RPC: a stranger (no membership row at all ->
 *   the NULL case that triggered the bug), a plain 'member', and the 'owner'
 *   as a positive control. Without the positive control a harness that denied
 *   everybody would pass, so the test also asserts the owner still gets through
 *   and an 'admin' still gets through where the function allows it.
 *
 *   The target group is always one the caller does NOT belong to, so a denial
 *   can only come from the guard and never from a missing membership fixture.
 *
 * CI: `npm run test:group-role-guards`
 */
import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';

const ROOT = process.env.ROOT || fileURLToPath(new URL('..', import.meta.url));
const DUMPS = [`${ROOT}/isotope-complete.sql`, `${ROOT}/sql/isotope-schema-restore.sql`];

// opaque to the engine; short readable ids keep the fixtures legible
const GROUP_A = 'grp-foreign-caller-belongs-here';
const GROUP_B = 'grp-victim-tenant';
const CALLER = 'usr-caller';
const VICTIM = 'usr-victim-owner';

let failures = 0;
const ok = (label, extra) => {
  if (!extra) { console.log(`  ✅ ${label}`); return; }
  console.log(`  ❌ ${label}\n       ${extra}`);
  failures++;
};

/* ── lifting the body out of the dump ─────────────────────────────────────── */

function extractBody(sql, fn) {
  const start = sql.indexOf(`CREATE OR REPLACE FUNCTION "public"."${fn}"(`);
  if (start < 0) return null;
  const end = sql.indexOf('\n$iso_fn$;', start);
  if (end < 0) return null;
  const block = sql.slice(start, end);
  const open = block.indexOf('BEGIN');
  if (open < 0) return null;
  const close = block.lastIndexOf('\nEND;');
  if (close < 0) return null;
  return block.slice(open + 'BEGIN'.length, close);
}

/* ── plpgsql -> control-flow tree ─────────────────────────────────────────── */

/** Strip `--` comments and collapse whitespace noise, preserving line order. */
function denoise(body) {
  return body
    .split('\n')
    .map((l) => { const i = l.indexOf('--'); return i < 0 ? l : l.slice(0, i); })
    .join('\n');
}

/**
 * Parse a block of plpgsql into [{stmt}|{if}] nodes.
 *
 * Only the constructs these five functions actually use are accepted: a bare
 * statement, `IF <pred> THEN ... [ELSE ...] END IF;`, and `RETURN <expr>;`.
 * Anything else throws, so the harness can never silently stop covering a
 * statement and start passing vacuously.
 */
function parseBlock(src, i = 0, stopAt = null) {   // stopAt: 'END' | 'ELSE' | null
  const nodes = [];
  let depth = 0;
  while (i < src.length) {
    while (i < src.length && /[\s;]/.test(src[i])) i++;
    if (i >= src.length) break;

    // a block terminator at this level ends the block; it belongs to the caller
    if (stopAt === 'END' && matchWord(src, i, 'END')) return { nodes, i, stopped: 'END' };
    if (matchWord(src, i, 'ELSE')) return { nodes, i, stopped: 'ELSE' };

    if (matchWord(src, i, 'IF')) {
      const thenAt = findWord(src, i + 2, 'THEN');
      if (thenAt < 0) throw new Error(`IF without THEN at offset ${i}`);
      const pred = src.slice(i + 2, thenAt).trim();
      const t = parseBlock(src, thenAt + 4, 'END');
      if (t.stopped !== 'END') throw new Error(`unterminated IF at offset ${i}`);
      const ifAt = findWord(t.i, 'IF');   // t.i points at the END of `END IF;`
      if (ifAt < 0) throw new Error(`IF without END IF at offset ${i}`);
      const semi = src.indexOf(';', ifAt);
      if (semi < 0) throw new Error(`END IF without ';' at offset ${ifAt}`);
      let elseNodes = null;
      let end = semi + 1;
      const afterEndIf = semi + 1;
      if (matchWord(src, afterEndIf, 'ELSE')) {
        const e = parseBlock(src, afterEndIf + 4, 'END');
        if (e.stopped !== 'END') throw new Error(`unterminated ELSE at offset ${i}`);
        const eIf = findWord(e.i, 'IF');
        if (eIf < 0) throw new Error(`ELSE without END IF at offset ${i}`);
        const eSemi = src.indexOf(';', eIf);
        if (eSemi < 0) throw new Error(`END IF without ';' at offset ${eIf}`);
        elseNodes = e.nodes;
        end = eSemi + 1;
      }
      nodes.push({ kind: 'if', pred, then: t.nodes, else: elseNodes });
      i = end;
      if (++depth > 40) throw new Error('parse did not converge');
      continue;
    }

    const semi = findTopLevelSemi(src, i);
    if (semi < 0) throw new Error(`unterminated statement at ${i}: ${src.slice(i, i + 60)}`);
    const text = src.slice(i, semi).trim();
    if (matchWord(text, 0, 'RETURN')) nodes.push({ kind: 'return', expr: text.slice(6).trim() });
    else nodes.push({ kind: 'stmt', sql: text });
    i = semi + 1;
  }
  if (stopAt) throw new Error(`unterminated ${stopAt} block`);
  return { nodes, i, stopped: null };
}

function matchWord(src, i, word) {
  if (src.slice(i, i + word.length).toUpperCase() !== word.toUpperCase()) return false;
  const before = src[i - 1], after = src[i + word.length];
  const bad = (c) => c && /[A-Za-z0-9_$]/.test(c);
  return !bad(before) && !bad(after);
}
function findWord(src, i, word) {
  if (typeof i !== 'number' || Number.isNaN(i) || i < 0) return -1;
  for (let k = i; k < src.length; k++) if (matchWord(src, k, word)) return k;
  return -1;
}
/** index of the ';' that closes the statement starting at i, outside quotes/parens */
function findTopLevelSemi(src, i) {
  let depth = 0, quote = null;
  for (let k = i; k < src.length; k++) {
    const c = src[k];
    if (quote) { if (c === quote) quote = null; continue; }
    if (c === "'" || c === '"') { quote = c; continue; }
    if (c === '(') depth++;
    else if (c === ')') depth--;
    else if (c === ';' && depth === 0) return k;
  }
  return -1;
}

/* ── rewriting the five bodies into engine-dialect SQL ─────────────────────── */

/**
 * Map the dumped Postgres source onto the local tables and supply the one row
 * the function looks up for itself. Everything that survives is still the real
 * predicate and the real statements; only the table plumbing changes.
 */
function dialect(sql, { role }) {
  let s = sql;

  // The membership lookup: the harness RECORDS what row exists for this caller.
  // A stranger has none, which is exactly the NULL that defeated the old guard.
  s = s.replace(
    /SELECT\s+role\s+INTO\s+v_role\s+FROM\s+public\.group_members\s+WHERE\s+group_id\s*=\s*p_group_id\s+AND\s+user_id\s*=\s*v_uid/i,
    `SELECT ${role === null ? 'NULL' : `'${role}'`} AS v_role`
  );

  // The "are you authenticated" pre-check: harness always supplies a caller, so
  // bind it to false rather than dropping the check.
  s = s.replace(/v_uid\s+IS\s+NULL/i, '0');

  s = s
    .replace(/\bpublic\.group_members\b/gi, 'group_members')
    .replace(/\bpublic\.groups\b/gi, 'groups');

  // community_update_group's UPDATE rewrites a jsonb patch through ::casts that
  // SQLite does not share. The security-relevant part is the WHERE target, which
  // is preserved verbatim below.
  s = s.replace(
    /UPDATE\s+groups\s+SET[\s\S]*?WHERE\s+id\s*=\s*p_group_id/i,
    `UPDATE groups SET name = 'pwned', deleted_at = 1 WHERE id = p_group_id`
  );
  s = s.replace(/UPDATE\s+groups\s+SET\s+deleted_at\s*=\s*now\(\)\s+WHERE\s+id\s*=\s*p_group_id/i,
    `UPDATE groups SET deleted_at = 1 WHERE id = p_group_id`);

  s = s.replace(/SET\s+role\s*=\s*p_role/i, `SET role = 'owner'`);           // set_group_role
  s = s.replace(/SET\s+role\s*=\s*'owner'/i, `SET role = 'owner'`);         // transfer: target
  s = s.replace(/SET\s+role\s*=\s*'admin'/i, `SET role = 'admin'`);         // transfer: demote self

  s = s.replace(/\bp_user_id\b/g, `'${VICTIM}'`);
  s = s.replace(/\bv_uid\b/g, `'${CALLER}'`);
  s = s.replace(/\bp_group_id\b/g, `'${GROUP_B}'`);
  s = s.replace(/\bnow\(\)/gi, `1`);

  return s;
}

/* ── the engine ────────────────────────────────────────────────────────────── */

function seed(db, callerRole) {
  db.exec(`
    CREATE TABLE group_members (group_id TEXT, user_id TEXT, role TEXT);
    CREATE TABLE groups (id TEXT, name TEXT, deleted_at INTEGER);
    INSERT INTO groups VALUES
      ('${GROUP_A}', 'group-a', 0),
      ('${GROUP_B}', 'group-b', 0);
    INSERT INTO group_members VALUES ('${GROUP_B}', '${VICTIM}', 'owner');
  `);
  // The caller's own membership, in the caller's own group. This is what makes
  // "the stranger has no row" a property of the CALLER-vs-TARGET pair rather
  // than of the fixture set, and it is what a blanket deny would break.
  db.prepare(`INSERT INTO group_members VALUES (?, ?, ?)`).run(GROUP_A, CALLER, callerRole);
}

function snapshot(db) {
  return JSON.stringify({
    m: db.prepare('SELECT group_id, user_id, role FROM group_members ORDER BY group_id, user_id').all(),
    g: db.prepare('SELECT id, name, deleted_at FROM groups ORDER BY id').all(),
  });
}

/** Execute the parsed tree. Returns {mutated, returned, error}. */
function execute(db, nodes, sink) {
  for (const n of nodes) {
    if (n.kind === 'if') {
      // Ask the engine whether the predicate is TRUE. PostgreSQL takes the THEN
      // branch only for a non-null true value; SQLite's WHERE does the same.
      const row = db.prepare(`SELECT (${n.pred}) AS v`).get();
      const truthy = row.v !== null && row.v !== 0 && row.v !== false;
      execute(db, truthy ? n.then : (n.else || []), sink);
    } else if (n.kind === 'return') {
      sink.returned = n.expr;
      return true;
    } else {
      db.exec(`${n.sql};`);
    }
  }
  return false;
}

function run(body, { callerRole }) {
  const db = new DatabaseSync(':memory:');
  seed(db, callerRole);
  const before = snapshot(db);
  const sink = {};
  let error = null;
  try {
    execute(db, parseBlock(dialect(denoise(body), { role: lookupRole(callerRole) })).nodes, sink);
  } catch (e) { error = e.message; }
  const after = snapshot(db);
  db.close();
  return { mutated: before !== after, returned: sink.returned || '', error };
}

/**
 * What the function's own SELECT ... INTO would find for this caller.
 * `null`  -> caller holds no role at all in the target group (the bug's case)
 * otherwise the literal that row carries.
 */
const ROLE_OF = { stranger: null, member: 'member', moderator: 'moderator', admin: 'admin', owner: 'owner' };

/**
 * What the function's own `SELECT role INTO v_role` finds for this caller in the
 * target group. 'stranger' means the caller holds no membership row there at
 * all, so the lookup yields nothing and v_role stays NULL -- the value that
 * defeated the old guard.
 */
function lookupRole(callerRole) { return ROLE_OF[callerRole] || null; }

/* ── the spec: which roles each RPC must admit ─────────────────────────────── */

// ownerOnly: whether a plain member is refused. admins: whether an 'admin' is
// admitted. Both come from the intent the function's own error strings state.
const SPECS = [
  { fn: 'community_set_group_role',      ownerOnly: true,  admins: false, deny: 'Only owner can set roles' },
  { fn: 'community_transfer_group',      ownerOnly: true,  admins: false, deny: 'Only owner can transfer' },
  { fn: 'community_update_group',        ownerOnly: false, admins: true,  deny: 'Insufficient permissions' },
  { fn: 'community_delete_group',        ownerOnly: true,  admins: false, deny: 'Only owner can delete' },
  { fn: 'community_remove_group_member', ownerOnly: false, admins: true,  deny: 'Insufficient permissions' },
];

/* ── main ──────────────────────────────────────────────────────────────────── */

console.log('community_* group-role guards — a non-member must be refused (R5)\n');

for (const dump of DUMPS) {
  const sql = fs.readFileSync(dump, 'utf8');
  console.log(`── ${dump.replace(`${ROOT}/`, '')}`);

  for (const spec of SPECS) {
    const body = extractBody(sql, spec.fn);
    if (!body) { ok(`${spec.fn}: body located in dump`); continue; }

    const admitted = [];
    if (!spec.ownerOnly) admitted.push('member', 'moderator');
    if (spec.admins) admitted.push('admin');
    admitted.push('owner');

    for (const callerRole of ['stranger', ...admitted]) {
      const r = run(body, { callerRole });
      const shouldBeAdmitted = callerRole !== 'stranger';
      const label = `${spec.fn}: ${callerRole.padEnd(9)} -> ${shouldBeAdmitted ? 'allowed' : 'REFUSED'}`;

      if (r.error) { ok(label, `engine error: ${r.error}`); continue; }
      if (shouldBeAdmitted) {
        ok(label, r.mutated ? '' : 'the RPC reached its guard and refused a legitimate caller (blanket deny)');
      } else {
        if (r.mutated) {
          ok(label, 'rows changed — the stranger got through:\n       ' + r.returned);
        } else if (r.returned && !r.returned.includes(spec.deny)) {
          ok(label, `refused, but not by the guard (returned: ${r.returned})`);
        } else {
          ok(label);
        }
      }
    }

    // Explicit statement of the defect this round fixed, so a regression reads
    // as the specific bug rather than one more red line.
    const guard = /IF\s+v_role\s+IS\s+DISTINCT\s+FROM\s+ALL?\s*(?:\(|\x27)/i.test(body);
    ok(`${spec.fn}: deny guard is NULL-safe (IS DISTINCT FROM)`, guard ? '' : 'v_role may be NULL on the admit path');
  }
  console.log('');
}

if (failures) {
  console.error(`FAILED: ${failures} assertion(s)`);
  process.exit(1);
}
console.log('All group-role guard assertions passed.');
