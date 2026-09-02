#!/usr/bin/env node
/**
 * check-ui-refs.mjs — static gate for scripts/backup-ui.html.
 *
 * The console is a single HTML file with an inline script, which means two whole
 * classes of error ship silently:
 *
 *   1. A syntax error in the inline script. `node --check` on the .html file does
 *      nothing, and no test imports it, so the page just renders dead.
 *   2. A `$('some-id')` that no longer matches an element. Renaming a section and
 *      missing one reference gives a null dereference on click, in a console whose
 *      whole job is to be trusted while it rewrites a database.
 *
 * This exists as a file rather than an inline CI step because the check needs both
 * quote styles and a regex containing `$(`, which is unquotable inside a YAML
 * `run:` block without escaping that obscures what is being matched.
 *
 * Usage: node scripts/check-ui-refs.mjs [file.html]
 */

import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const file = process.argv[2] || join(ROOT, 'scripts', 'backup-ui.html');

if (!existsSync(file)) {
  console.error(`ERROR: ${file} not found`);
  process.exit(1);
}
const html = readFileSync(file, 'utf8');
const fails = [];

// ── 1. the inline script must parse ─────────────────────────────────────────
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) {
  fails.push('no inline <script> block found');
} else {
  try {
    // new Function parses without executing — the script touches document on load.
    new Function(m[1]);
    console.log('  ok  inline script parses');
  } catch (e) {
    fails.push(`inline script syntax error: ${e.message}`);
  }
}

// ── 2. every $('literal-id') must exist in the markup ───────────────────────
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((x) => x[1]));
if (m) {
  // Only LITERAL single-quoted ids are statically checkable. A wildcard quote
  // would also match $(inputId + '-err') and produce nonsense.
  const used = new Set([...m[1].matchAll(/\$\('([A-Za-z0-9_-]+)'\)/g)].map((x) => x[1]));
  const missing = [...used].filter((i) => !ids.has(i));
  if (missing.length) fails.push(`$() references missing ids: ${missing.join(', ')}`);
  else console.log(`  ok  ${used.size} element reference(s) resolve against ${ids.size} ids`);
}

// ── 3. ids must be unique ───────────────────────────────────────────────────
const all = [...html.matchAll(/\sid="([^"]+)"/g)].map((x) => x[1]);
const dupes = [...new Set(all.filter((i, n) => all.indexOf(i) !== n))];
if (dupes.length) fails.push(`duplicate ids: ${dupes.join(', ')}`);
else console.log('  ok  ids are unique');

// ── 4. accessibility invariants that are cheap to regress ───────────────────
// Each of these was a real defect in an earlier revision of this page, so each is
// worth a line of CI rather than a code review someone has to remember to do.
const a11y = [
  ['viewport allows zoom', !/user-scalable\s*=\s*no|maximum-scale/.test(html)],
  ['skip link present', /class="skip"/.test(html)],
  ['prefers-reduced-motion honoured', /prefers-reduced-motion/.test(html)],
  ['no outline:none', !/outline\s*:\s*none/.test(html)],
  ['aria-live region present', /aria-live="polite"/.test(html)],
  ['field errors use role=alert', /role="alert"/.test(html)],
  ['progress bars expose aria-valuenow', /aria-valuenow/.test(html)],
  // The dialog is built at runtime, so its attributes are setAttribute calls
  // rather than literal markup. Match either form — asserting only the literal
  // shape made this check fail on a page that does it correctly.
  ['dialog is aria-modal', /aria-modal="true"|setAttribute\('aria-modal', *'true'\)/.test(html)],
  ['dialog traps Tab', /e\.key !== 'Tab'|key === 'Tab'/.test(html)],
  ['Escape dismisses the dialog', /e\.key === 'Escape'/.test(html)],
  ['inputs are 16px (no iOS auto-zoom)', /font-size:\s*1rem/.test(html)],
  ['44px tap target token', /--tap:\s*44px/.test(html)],
  ['safe-area insets used', /env\(safe-area-inset/.test(html)],
  ['no emoji glyphs', !/[\u{1F300}-\u{1FAFF}]/u.test(html)],
];
for (const [label, ok] of a11y) {
  if (ok) console.log(`  ok  ${label}`);
  else fails.push(`accessibility: ${label}`);
}

if (fails.length) {
  console.error(`\n${fails.length} problem(s) in ${file}:`);
  for (const f of fails) console.error(`  FAIL ${f}`);
  process.exit(1);
}
console.log(`\n${file.replace(ROOT + '/', '')} passed all checks.`);
