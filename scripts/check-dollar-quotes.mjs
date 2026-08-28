#!/usr/bin/env node
// Structural check for dollar-quoted SQL bodies.
//
// Catches the class of bug where an editing slip leaves a stray terminator and
// silently truncates every function defined after it. A real instance of this
// shipped in isotope-complete.sql: an orphan `$$;` after get_event_attendees
// swallowed the following CREATE FUNCTION header, and psql only reported a
// confusing "syntax error at or near RETURNS" thousands of lines later.
//
// Why this is a Node script rather than a shell one-liner:
//   * `grep -o '\$\$' | wc -l` exits 1 under `set -o pipefail` on any file with
//     zero matches, failing the whole CI step (events-expansion.sql has none).
//   * Counting raw `$` characters breaks on custom tags: the generated dump
//     sql/isotope-schema-restore.sql uses `$iso_fn$` and `$i$`, so a naive
//     halving of the `$` count reports a false imbalance.
// Tags are matched properly here, and each tag is balanced independently.
//
// Run: node scripts/check-dollar-quotes.mjs
import { readFileSync, readdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function sqlFiles() {
  const out = [];
  for (const f of readdirSync(ROOT)) if (f.endsWith('.sql')) out.push(f);
  const sub = join(ROOT, 'sql');
  if (existsSync(sub)) {
    for (const f of readdirSync(sub)) if (f.endsWith('.sql')) out.push(join('sql', f));
  }
  return out.sort();
}

// Strip `--` line comments and '...' string literals so a dollar sign inside
// either cannot register as a delimiter. Block comments are left alone: these
// files do not use them, and treating them naively would risk false negatives.
function stripNoise(sql) {
  let out = '';
  let i = 0;
  while (i < sql.length) {
    if (sql[i] === '-' && sql[i + 1] === '-') {
      while (i < sql.length && sql[i] !== '\n') i++;
      continue;
    }
    if (sql[i] === "'") {
      i++;
      while (i < sql.length) {
        if (sql[i] === "'" && sql[i + 1] === "'") { i += 2; continue; }
        if (sql[i] === "'") { i++; break; }
        i++;
      }
      out += "''";
      continue;
    }
    out += sql[i++];
  }
  return out;
}

let failed = 0;
for (const rel of sqlFiles()) {
  const raw = readFileSync(join(ROOT, rel), 'utf8');
  const body = stripNoise(raw);
  const counts = new Map();
  for (const m of body.matchAll(/\$[A-Za-z_][A-Za-z0-9_]*\$|\$\$/g)) {
    counts.set(m[0], (counts.get(m[0]) || 0) + 1);
  }
  const odd = [...counts.entries()].filter(([, n]) => n % 2 !== 0);
  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  if (odd.length) {
    failed++;
    const detail = odd.map(([t, n]) => `${t}×${n}`).join(', ');
    console.error(`::error file=${rel}::unbalanced dollar-quote tag(s): ${detail} — an odd count means a body is left open or a stray terminator truncates the next statement`);
  } else {
    const tags = [...counts.keys()].join(',') || 'none';
    console.log(`OK   ${rel} (${total} delimiter(s); tags: ${tags})`);
  }
}

if (failed) {
  console.error(`\n${failed} file(s) have unbalanced dollar-quoted bodies.`);
  process.exit(1);
}
console.log('\nAll dollar-quoted bodies balanced.');
