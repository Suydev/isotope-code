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
/**
 * When `i` points at the `E` of a block-terminating `END IF;`, return the offset
 * of the `;` that closes it; otherwise -1.
 *
 * The terminator has to be matched positionally. Searching forward for the next
 * `IF` instead would sail past this one and latch onto an unrelated `IF` further
 * down the body, and plain matchWord() cannot be used on the `IF` either,
 * because `D` is a word character and would read as a prefix.
 */
function endIfSemi(src, i) {
  if (!matchWord(src, i, 'END')) return -1;
  let k = i + 3;
  while (k < src.length && /[\s]/.test(src[k])) k++;
  if (!matchWord(src, k, 'IF')) return -1;
  if (src[k + 2] !== ';') return -1;
  return k + 2;
}

function parseBlock(src, i = 0, stopAt = null) {   // stopAt: 'END' | 'ELSE' | null
  const nodes = [];
  while (i < src.length) {
    while (i < src.length && /[\s;]/.test(src[i])) i++;
    if (i >= src.length) break;

    // A block terminator at THIS level ends the block; it belongs to the caller,
    // so consume nothing. `END` is only a terminator when we are looking for one
    // -- otherwise it is the start of `END IF;`, handled below.
    if (stopAt === 'END' && matchWord(src, i, 'END')) return { nodes, i, stopped: 'END' };
    if (matchWord(src, i, 'ELSE')) return { nodes, i, stopped: 'ELSE' };

    if (matchWord(src, i, 'IF')) {
      const thenAt = findWord(src, i + 2, 'THEN');
      if (thenAt < 0) throw new Error(`IF without THEN at offset ${i}`);
      const pred = src.slice(i + 2, thenAt).trim();

      const t = parseBlock(src, thenAt + 4, 'END');
      if (t.stopped !== 'END') throw new Error(`unterminated IF at offset ${i}`);
      const closeSemi = endIfSemi(src, t.i);
      if (closeSemi < 0) throw new Error(`IF without END IF at offset ${i}`);

      let elseNodes = null;
      let end = closeSemi + 1;
      if (matchWord(src, end, 'ELSE')) {
        const e = parseBlock(src, end + 4, 'END');
        if (e.stopped !== 'END') throw new Error(`unterminated ELSE at offset ${i}`);
        const eClose = endIfSemi(src, e.i);
        if (eClose < 0) throw new Error(`ELSE without END IF at offset ${i}`);
        elseNodes = e.nodes;
        end = eClose + 1;
      }

      nodes.push({ kind: 'if', pred, then: t.nodes, else: elseNodes });
      if (end <= i) throw new Error(`parser made no progress at offset ${i}`);
      i = end;
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
 * Map the dumped Postgres source onto the local tables. Only the two
 * Postgres-specific spellings these bodies use are rewritten: the schema
 * qualifier, and community_update_group's jsonb patch (`::` casts on jsonb
 * fragments) which is replaced by the same columns it assigns. The membership
 * lookup stays in the source as a real statement, so the harness records what
 * it returns the same way PostgreSQL would.
 *
 * The <expr> fed to `SELECT <expr> INTO v_role` is supplied by the engine from
 * the fixture, so a caller with no membership row yields NULL -- the exact
 * value that defeated the original guard.
 */
function dialect(sql, { role }) {
  let s = sql
    .replace(/\bpublic\.group_members\b/gi, 'group_members')
    .replace(/\bpublic\.groups\b/gi, 'groups');

  // The membership lookup: the harness RECORDS what row exists for this caller
  // in the target group. A stranger has none.
  s = s.replace(
    /SELECT\s+role\s+INTO\s+v_role\s+FROM\s+group_members\s+WHERE\s+group_id\s*=\s*p_group_id\s+AND\s+user_id\s*=\s*v_uid/i,
    `SELECT ${role === null ? 'NULL' : `'${role}'`} AS v_role`
  );

  // community_update_group's UPDATE rewrites a jsonb patch through casts that
  // SQLite does not share; the WHERE target -- the security-relevant part -- is
  // preserved verbatim.
  s = s.replace(
    /UPDATE\s+groups\s+SET[\s\S]*?WHERE\s+id\s*=\s*p_group_id/i,
    `UPDATE groups SET name = 'pwned', deleted_at = 1 WHERE id = p_group_id`
  );
  s = s.replace(/UPDATE\s+groups\s+SET\s+deleted_at\s*=\s*now\(\)\s+WHERE\s+id\s*=\s*p_group_id/i,
    `UPDATE groups SET deleted_at = 1 WHERE id = p_group_id`);

  // PostgreSQL `::type` casts have no SQLite spelling. Strip them FIRST, before
  // the ALL form is expanded, so the casts inside ARRAY['owner'::text, ...]
  // are gone by the time that list is split. None of these casts appear inside a
  // guard predicate -- only in the statements behind it -- so dropping them
  // changes nothing the harness is testing.
  s = s.replace(/'::\s*[A-Za-z_][A-Za-z0-9_ ]*/g, "'");
  s = s.replace(/\)\s*::\s*[A-Za-z_][A-Za-z0-9_ ]*(?=\)|\s|,|$)/g, ')');

  // `IS DISTINCT FROM ALL (ARRAY[...])` is Postgres spelling for "not one of
  // these". SQLite has no ALL form, so expand it to the pairwise form, which
  // has identical NULL semantics: PG also treats a NULL left operand here as
  // NOT DISTINCT FROM NULL, i.e. true, keeping the denial path intact.
  s = s.replace(
    /(\w+)\s+IS\s+DISTINCT\s+FROM\s+ALL\s*\(\s*ARRAY\[([^\]]*)\]\s*\)/i,
    (_m, varName, list) => {
      const parts = list.split(',').map((x) => x.trim()).filter(Boolean);
      return `(${parts.map((x) => `${varName} IS DISTINCT FROM ${x}`).join(' AND ')})`;
    }
  );

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
    INSERT INTO group_members VALUES ('${GROUP_B}', '${VICTIM}', 'member');
  `);
  // The caller's own membership row, in the caller's OWN group. This is what
  // makes "the stranger has no row in the target group" a property of the
  // caller-vs-target pair rather than of the fixture set, and it is what a
  // blanket deny would break.
  db.prepare('INSERT INTO group_members VALUES (?, ?, ?)').run(GROUP_A, CALLER, callerRole);
}

function snapshot(db) {
  return JSON.stringify({
    m: db.prepare('SELECT group_id, user_id, role FROM group_members ORDER BY group_id, user_id').all(),
    g: db.prepare('SELECT id, name, deleted_at FROM groups ORDER BY id').all(),
  });
}

/**
 * Execute the parsed tree, binding plpgsql variables the way the block does:
 * `SELECT x INTO v` ASSIGNS, it does not yield rows, and `v` is scoped to the
 * whole block. So a bare assignment is recorded, and any predicate that reads a
 * variable reads it out of that scope. This matters: the guard is evaluated
 * AFTER the lookup in source order, and a harness that evaluated the predicate
 * eagerly would be testing a different program than the one that ships.
 */
function execute(db, nodes, scope) {
  for (const n of nodes) {
    if (n.kind === 'if') {
      const truthy = evaluate(db, n.pred, scope);
      const taken = execute(db, truthy ? n.then : (n.else || []), scope);
      if (taken) return taken;          // RETURN leaves the whole block
    } else if (n.kind === 'return') {
      return { returned: n.expr };
    } else {
      const into = execStatement(db, n.sql, scope);
      if (into) scope[into.var] = into.value;
    }
  }
  return null;
}

/** Evaluate a guard predicate with PostgreSQL's three-valued IF rule. */
function evaluate(db, pred, scope) {
  const row = db.prepare(`SELECT (${bind(pred, scope)}) AS v`).get();
  return row.v !== null && row.v !== 0 && row.v !== false;
}

/** Run one statement; report `SELECT <expr> INTO <var>` as an assignment. */
function execStatement(db, sql, scope) {
  const m = /^\s*SELECT\s+([\s\S]+?)\s+AS\s+([A-Za-z_][A-Za-z0-9_]*)\s*$/i.exec(sql);
  if (m) {
    // Evaluate the VALUE only. The `AS <var>` alias names the target plpgsql
    // variable, so it must not be bound like an expression -- substituting it
    // would rename the assignment to `AS 'owner'` and the variable would never
    // be set, leaving every later guard to read an undefined value.
    const value = db.prepare(`SELECT (${bind(m[1], scope)}) AS v`).get().v;
    return { var: m[2], value };
  }
  db.exec(`${bind(sql, scope)};`);
  return null;
}

/**
 * Substitute plpgsql variables with the literals the harness recorded.
 *
 * The regex runs exactly once over the source, so the text it introduces (a
 * quoted uid, the word NULL) can never be rescanned and mistaken for another
 * variable reference. A loop over the scope would have that problem: the
 * output of one substitution is the input to the next.
 */
function bind(sql, scope) {
  return sql.replace(/\b([A-Za-z_][A-Za-z0-9_]*)\b/g, (word) => {
    if (!(word in scope)) return word;
    const v = scope[word];
    return v === null ? 'NULL' : `'${v}'`;
  });
}

function run(body, { callerRole, prole }) {
  const db = new DatabaseSync(':memory:');
  seed(db, callerRole);
  const before = snapshot(db);
  const tree = parseBlock(denoise(body)).nodes;
  let sink = {}, error = null;
  try {
    sink = execute(db, tree, {
      v_uid: CALLER,
      p_group_id: GROUP_B,
      p_user_id: VICTIM,
      p_role: prole,
      // community_transfer_group's second parameter: the user ownership is
      // handed to. Point it at the victim so the escalation the stranger was
      // denied earlier would still show up if it ever happened.
      p_new_owner: VICTIM,
    });
  } catch (e) { error = e.message; }
  const after = snapshot(db);
  db.close();
  return { mutated: before !== after, returned: sink.returned || '', error };
}

const ROLE_OF = { stranger: null, member: 'member', moderator: 'moderator', admin: 'admin', owner: 'owner' };

/**
 * What the function's own `SELECT role INTO v_role` finds for this caller in the
 * target group. 'stranger' means the caller holds no membership row there at
 * all, so the lookup yields nothing and v_role stays NULL -- the value that
 * defeated the old guard.
 */
function lookupRole(callerRole) { return ROLE_OF[callerRole] || null; }

/* ── the spec: which roles each RPC must admit ─────────────────────────────── */

/**
 * `admit` lists the roles the RPC must let through, taken from the predicate it
 * has always used -- these are the roles the surrounding UI offers, and
 * changing who may manage a group is a product decision, not part of this fix.
 * Only two things are asserted here: that a role OUTSIDE `admit` is refused
 * (the defect), and that every role INSIDE it still works (so the fix cannot be
 * satisfied by denying everyone).
 */
const SPECS = [
  { fn: 'community_set_group_role',      admit: ['owner'],                  deny: 'Only owner can set roles' },
  { fn: 'community_transfer_group',      admit: ['owner'],                  deny: 'Only owner can transfer' },
  { fn: 'community_update_group',        admit: ['owner', 'admin'],         deny: 'Insufficient permissions' },
  { fn: 'community_delete_group',        admit: ['owner'],                  deny: 'Only owner can delete' },
  { fn: 'community_remove_group_member', admit: ['owner', 'admin'],         deny: 'Insufficient permissions' },
];

/* ── main ──────────────────────────────────────────────────────────────────── */

console.log('community_* group-role guards — a non-member must be refused (R5)\n');

for (const dump of DUMPS) {
  const sql = fs.readFileSync(dump, 'utf8');
  console.log(`── ${dump.replace(`${ROOT}/`, '')}`);

  for (const spec of SPECS) {
    const body = extractBody(sql, spec.fn);
    if (!body) { ok(`${spec.fn}: body located in dump`); continue; }

    // Every role the RPC defines, split by whether it must be admitted. The
    // stranger is the case the defect lived in: not merely a low role, but NO
    // membership row at all, so the lookup yields NULL rather than a value.
    const refused = ['stranger', 'member', 'moderator', 'admin'].filter((r) => !spec.admit.includes(r));
    const admitted = spec.admit;

    // The role the RPC writes onto its target. For the two functions that hand
    // out authority that is deliberately the highest one the client could ask
    // for ('owner'), so the test grants nothing by accident.
    const PROLE = 'owner';

    for (const callerRole of [...refused, ...admitted]) {
      const r = run(dialect(denoise(body), { role: lookupRole(callerRole) }), {
        callerRole, prole: PROLE,
      });
      const shouldBeAdmitted = spec.admit.includes(callerRole);
      const label = `${spec.fn}: ${callerRole.padEnd(9)} -> ${shouldBeAdmitted ? 'allowed' : 'REFUSED'}`;

      if (r.error) { ok(label, `engine error: ${r.error}`); continue; }
      if (shouldBeAdmitted) {
        ok(label, r.error ? `engine error: ${r.error}` : (r.mutated ? '' : `reached the guard and refused a legitimate caller (blanket deny); returned=${r.returned}`));
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
    const guard = /v_role\s+IS\s+DISTINCT\s+FROM/i.test(body);
    ok(`${spec.fn}: deny guard is NULL-safe (IS DISTINCT FROM)`, guard ? '' : 'v_role may be NULL on the admit path');
  }
  console.log('');
}

if (failures) {
  console.error(`FAILED: ${failures} assertion(s)`);
  process.exit(1);
}
console.log('All group-role guard assertions passed.');
