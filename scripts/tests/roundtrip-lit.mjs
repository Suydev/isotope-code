#!/usr/bin/env node
/**
 * Prove that the SQL literal `lit()` emits round-trips back to the original value,
 * under EVERY standard_conforming_strings setting, not just today's default.
 *
 * There is no Postgres on this box, so what is under test is the EMITTED TEXT,
 * not the server's answer. The reader below implements Postgres' own lexical
 * rules for a string constant, parameterised by the session GUC:
 *
 *   - `E'...'`: the prefix makes a backslash an escape introducer regardless of
 *     standard_conforming_strings. \b \f \n \r \t \\ \' \" \xHH \uXXXX \UXXXXXXXX
 *     and octal \NNN are special; a backslash before anything else is NOT special
 *     and yields the backslash itself followed by that character.
 *   - `'...'` with standard_conforming_strings=on: the backslash is an ordinary
 *     character with no meaning at all, and only '' is an escape. The literal
 *     therefore always ends at the first unpaired apostrophe.
 *   - `'...'` with standard_conforming_strings=off: the backslash IS an escape
 *     introducer, so a trailing `\'` does not close the literal and the string
 *     runs on into whatever follows it in the statement.
 *
 * That last mode is the whole point. The old emitter produced `'a\'::text` for a
 * value ending in a backslash. Under today's default that happens to parse to
 * the right value, which is why the bug stayed latent; under
 * standard_conforming_strings=off the same bytes fuse the value to its terminator
 * and the literal swallows the rest of the statement. `E'...'` is the only form
 * that is correct under both, so that is what this asserts.
 *
 * Run: node scripts/tests/roundtrip-lit.mjs
 */
import { lit, escStr } from '../supabase-backup.mjs';

const E_SPECIAL = { b: '\b', f: '\f', n: '\n', r: '\r', t: '\t' };

/** Decode one SQL literal at `i`. Throws with a Postgres-shaped message. */
function readLiteral(sql, i, scs = true) {
  let escape = false;
  if (sql[i] === 'E' || sql[i] === 'e') { escape = true; i++; }
  // Without the E prefix, a non-standard-conforming session treats the backslash
  // as an escape introducer exactly as if E had been written.
  else if (!scs) escape = true;
  if (sql[i] !== "'") throw new Error('syntax error at or near "' + sql.slice(i, i + 8) + '"');
  i++;
  let out = '';
  for (;;) {
    if (i >= sql.length) throw new Error('unterminated quoted string');
    const c = sql[i];
    if (escape && c === '\\') {
      const n = sql[i + 1];
      if (n === undefined) throw new Error('unterminated quoted string');
      if (Object.prototype.hasOwnProperty.call(E_SPECIAL, n)) {
        out += E_SPECIAL[n]; i += 2; continue;
      }
      // \\ , \' and \" stand for themselves; a backslash before anything else
      // is not a recognised escape, so Postgres yields the backslash itself
      // and then the character, having consumed both.
      if (n === '\\' || n === "'" || n === '"') { out += n; i += 2; continue; }
      if (n === 'x') {
        const hex = /^[0-9a-fA-F]{1,2}/.exec(sql.slice(i + 2));
        if (!hex) throw new Error('invalid hexadecimal escape: ' + sql.slice(i, i + 8));
        out += String.fromCharCode(parseInt(hex[0], 16));
        i += 2 + hex[0].length;
        continue;
      }
      if (n === 'u' || n === 'U') {
        const width = n === 'u' ? 4 : 8;
        const hex = sql.slice(i + 2, i + 2 + width);
        if (hex.length !== width || !/^[0-9a-fA-F]+$/.test(hex)) {
          throw new Error('invalid Unicode escape: ' + sql.slice(i, i + 12));
        }
        out += String.fromCodePoint(parseInt(hex, 16));
        i += 2 + width;
        continue;
      }
      if (n >= '0' && n <= '7') {
        const oct = /^[0-7]{1,3}/.exec(sql.slice(i + 1));
        out += String.fromCharCode(parseInt(oct[0], 8));
        i += 1 + oct[0].length;
        continue;
      }
      // Unrecognised escape: the backslash survives, then the next character.
      out += '\\';
      out += n;
      i += 2;
      continue;
    }
    if (c === "'") {
      if (sql[i + 1] === "'") { out += "'"; i += 2; continue; }
      return { value: out, end: i + 1 };
    }
    out += c;
    i++;
  }
}

/** Decode a whole `lit()` expression, e.g. `E'..'::text`, into value + cast. */
function decodeLiteral(emitted, scs = true) {
  const r = readLiteral(emitted, 0, scs);
  return { value: r.value, tail: emitted.slice(r.end) };
}

let failures = 0;
function check(name, cond, detail) {
  if (cond) { console.log('  PASS ' + name); return; }
  failures++;
  console.error('  FAIL ' + name + (detail ? ' - ' + detail : ''));
}

const BS = String.fromCharCode(92);
const SQ = String.fromCharCode(39);
const NUL = String.fromCharCode(0);

// ── The regression: a text value ending in a backslash ──────────────────────
{
  const v = 'a' + BS;
  const emitted = lit(v, 'text');
  for (const scs of [true, false]) {
    let decoded = null;
    let err = null;
    try {
      const r = decodeLiteral(emitted, scs);
      if (r.tail !== '::text') err = 'tail was ' + JSON.stringify(r.tail) + ', expected ::text';
      decoded = r.value;
    } catch (e) { err = e.message; }
    check('NEW emitter: trailing backslash round-trips (scs=' + scs + ')',
      !err && decoded === v, err ? 'emitted ' + emitted + ' -> ' + err
        : 'emitted ' + emitted + ' -> ' + JSON.stringify(decoded));
  }
}

// The old emitter, byte for byte: `'a\'::text`. These assertions pin down what
// that form actually does, because the reason the bug was invisible is that its
// breakage depends on a session GUC the code never set and cannot observe.
{
  const broken = "'a" + BS + "'::text";
  const v = 'a' + BS;

  // scs=on: a backslash has no meaning at all, the literal closes at the next
  // apostrophe, and the stored value is correct. This is why nobody noticed.
  const on = decodeLiteral(broken, true);
  check('OLD emitter looks fine under scs=on (why the bug was latent)',
    on.value === v && on.tail === '::text',
    'value=' + JSON.stringify(on.value) + ' tail=' + JSON.stringify(on.tail));

  // scs=off: `\'` is an escaped apostrophe, so the terminator is consumed and
  // the literal runs on. Either the value loses its backslash or the literal
  // never closes. Both are corruption; both are silent at the call site.
  let offBroken = false;
  let offDetail = '';
  try {
    const off = decodeLiteral(broken, false);
    offBroken = off.value !== v || off.tail !== '::text';
    offDetail = 'value=' + JSON.stringify(off.value) + ' tail=' + JSON.stringify(off.tail);
  } catch (e) {
    offBroken = true;
    offDetail = e.message;
  }
  check('OLD emitter corrupts a trailing backslash under scs=off', offBroken, offDetail);
}

// The splicing failure, which is the serious one and needs scs=off. Under
// standard_conforming_strings=on a backslash is never special, so the literal
// ALWAYS closes at the first unpaired apostrophe and no splice is possible;
// the old form's exposure is specifically the non-default mode.
{
  const v = 'a' + BS;
  const head = 'insert into "public"."t" ("c") values (';
  const mid = '::text), (';
  const stmt = head + "'" + v + "'" + mid + "'b'::text) returning 1";

  const on = (() => {
    try {
      const r = readLiteral(stmt, head.length, true);
      return { value: r.value, rest: stmt.slice(r.end) };
    } catch (e) { return { value: '<threw> ' + e.message, rest: '' }; }
  })();
  check('OLD emitter, two rows under scs=on: first value is clean',
    on.value === v, 'got ' + JSON.stringify(on.value));

  const off = (() => {
    try {
      const r = readLiteral(stmt, head.length, false);
      return { value: r.value, rest: stmt.slice(r.end) };
    } catch (e) { return { value: '<threw> ' + e.message, rest: '' }; }
  })();
  // The first value has swallowed the ::text), ( that separated the rows.
  check('OLD emitter splices the row separator into the value under scs=off',
    off.value !== v && off.value.indexOf('::text') !== -1,
    'got ' + JSON.stringify(off.value));
}

console.log('--- required value shapes');
const STRINGS = [
  ['trailing backslash', 'a' + BS],
  ['two trailing backslashes', 'a' + BS + BS],
  ['interior backslash', 'C:' + BS + 'Users' + BS + 'me'],
  ['lone backslash', BS],
  ['leading backslash', BS + 'leading'],
  ['apostrophe', 'it' + SQ + 's'],
  ['trailing apostrophe', 'abc' + SQ],
  ['quote and backslash together', 'a' + BS + SQ + 'b' + BS],
  ['double apostrophe', 'a' + SQ + SQ + 'b'],
  ['only an apostrophe', SQ],
  ['newline', 'line1\nline2'],
  ['trailing newline', 'abc\n'],
  ['only a newline', '\n'],
  ['cr + lf + tab', 'a\r\nb\tc'],
  ['unicode', 'héllo ☃ 日本語 \u{1F393}'],
  ['empty string', ''],
  ['escape lookalikes', BS + 'n' + BS + 't' + BS + BS],
  ['null byte', 'a' + NUL + 'b'],
  ['long tail', 'x'.repeat(5000) + BS],
  ['sql-ish payload', SQ + '); drop table users; --' + BS],
];

for (const pair of STRINGS) {
  const name = pair[0];
  const v = pair[1];
  const emitted = lit(v, 'text');
  for (const scs of [true, false]) {
    let ok = false;
    let detail = '';
    try {
      const r = decodeLiteral(emitted, scs);
      if (r.tail !== '::text') detail = 'tail ' + JSON.stringify(r.tail);
      else if (r.value !== v) detail = 'got ' + JSON.stringify(r.value);
      else ok = true;
    } catch (e) { detail = e.message; }
    check('NEW emitter: string: ' + name + ' (scs=' + scs + ')', ok, detail);
  }
}

// The value has to survive being embedded between a column list and an
// ON CONFLICT clause — that is where a fused literal eats the rest of the
// statement. `lit()` emits `E'..'::text`, so the cast sits between the closing
// quote and the closing paren; the assertion accounts for it.
console.log('--- embedded in a full INSERT ... ON CONFLICT');
{
  // Build the statement the way restore() does, so the assertion is about the
  // real text rather than a hand-assembled approximation that can drift from it.
  const v = 'it' + SQ + 's a path' + BS;
  const emitted = lit(v, 'text');
  const head = 'insert into "public"."users" ("bio") values (';
  const stmt = head + emitted + ') on conflict do nothing returning 1';
  // readLiteral stops at the closing QUOTE, not at the end of the expression, so
  // lit()'s own ::text cast is part of the remainder. Assert that composed
  // remainder rather than assuming it: getting this wrong is exactly what made
  // these two checks fail on the first run.
  const expectedRest = '::text) on conflict do nothing returning 1';
  for (const scs of [true, false]) {
    let ok = false;
    let detail = '';
    try {
      const r = readLiteral(stmt, head.length, scs);
      const rest = stmt.slice(r.end);
      if (r.value !== v) detail = 'got ' + JSON.stringify(r.value);
      else if (rest !== expectedRest) detail = 'rest was ' + JSON.stringify(rest);
      else ok = true;
    } catch (e) { detail = e.message; }
    check('NEW emitter: value survives inside an INSERT clause (scs=' + scs + ')', ok, detail);
  }
}

console.log('--- ARRAY[...] elements');
{
  const arr = ['plain', 'quo' + SQ + 'te', 'trail' + BS, '', '☃'];
  const emitted = lit(arr, 'text[]');
  for (const scs of [true, false]) {
    let ok = false;
    let detail = '';
    try {
      const inner = emitted.slice('ARRAY['.length, emitted.lastIndexOf(']::text[]'));
      const got = [];
      let i = 0;
      while (i < inner.length) {
        if (inner[i] === ',' || inner[i] === ' ') { i++; continue; }
        if (inner.startsWith('NULL', i)) { got.push(null); i += 4; continue; }
        const r = readLiteral(inner, i, scs);
        got.push(r.value);
        i = r.end;
      }
      if (JSON.stringify(got) !== JSON.stringify(arr)) detail = 'got ' + JSON.stringify(got);
      else ok = true;
    } catch (e) { detail = e.message; }
    check('NEW emitter: array elements round-trip (scs=' + scs + ')', ok, detail);
  }
}

console.log('--- non-string values untouched');
check('null stays NULL', lit(null, 'text') === 'NULL', lit(null, 'text'));
check('undefined stays NULL', lit(undefined, 'text') === 'NULL', lit(undefined, 'text'));
check('number keeps its cast', lit(42, 'integer') === '42::integer', lit(42, 'integer'));
check('boolean keeps its cast', lit(true, 'boolean') === 'true::boolean', lit(true, 'boolean'));
check('empty array keeps its cast', lit([], 'text[]') === 'ARRAY[]::text[]', lit([], 'text[]'));
check('escStr doubles quotes and backslashes',
  escStr('a' + BS + 'b' + SQ + 'c') === 'a' + BS + BS + 'b' + SQ + SQ + 'c',
  escStr('a' + BS + 'b' + SQ + 'c'));
check('every string literal is E-prefixed', lit('x', 'text').startsWith("E'"), lit('x', 'text'));

console.log('--- fuzz: 4000 random values under both GUC settings');
{
  const alphabet = ['a', 'Z', '0', BS, SQ, '\n', '\t', '\r', ' ', '☃', '"', '$', ';', '-'];
  let seed = 1234567;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  let bad = 0;
  let firstDetail = '';
  for (let n = 0; n < 4000; n++) {
    const len = Math.floor(rnd() * 12);
    let v = '';
    for (let k = 0; k < len; k++) v += alphabet[Math.floor(rnd() * alphabet.length)];
    const emitted = lit(v, 'text');
    for (const scs of [true, false]) {
      try {
        const r = decodeLiteral(emitted, scs);
        if (r.value !== v || r.tail !== '::text') {
          bad++;
          if (!firstDetail) firstDetail = JSON.stringify(v) + ' -> ' + emitted + ' scs=' + scs;
        }
      } catch (e) {
        bad++;
        if (!firstDetail) firstDetail = JSON.stringify(v) + ' -> ' + emitted + ' scs=' + scs + ' -> ' + e.message;
      }
    }
  }
  check('fuzz corpus round-trips under both settings', bad === 0, firstDetail + ' (' + bad + ' bad)');
}

console.log(failures ? '\nFAILED: ' + failures : '\nALL PASS');
process.exit(failures ? 1 : 0);
