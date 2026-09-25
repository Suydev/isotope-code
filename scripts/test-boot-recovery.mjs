#!/usr/bin/env node
/**
 * test-boot-recovery.mjs — regression guard for the stuck-splash bug.
 *
 * The app-mount bootstrap (www/assets/index-*.js, here public/assets/index-*.js)
 * wraps ReactDOM.createRoot().render() in try/catch with an error-classifier
 * that decides whether a boot-time error triggers a hard-reload recovery. If the
 * classifier does NOT treat Supabase quota/network errors as retryable
 * (exceed_cached_egress_quota / 429 / 503 / Failed to fetch / NetworkError /
 * rate limit), the catch rethrows -> unhandled rejection -> render() never runs
 * -> the user is stuck on the splash with no login form.
 *
 * CI: `npm run test:boot-recovery` (added to package.json).
 */
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
// This script lives in scripts/, so the project root is one level up.
const ROOT = process.env.ROOT || fileURLToPath(new URL('..', import.meta.url));
const ASSETS = `${ROOT}/public/assets`;
const INDEX = `${ROOT}/index.html`;

function die(msg, code = 1) { process.stderr.write(msg + '\n'); process.exit(code); }

  if (!fs.existsSync(ASSETS)) die(`[boot-recovery] no ${ASSETS} — is this run from isotope-code root?`);

const html = fs.readFileSync(INDEX, 'utf8');
const m = html.match(/assets\/(index-[A-Za-z0-9_]+\.js)/);
if (!m) die('[boot-recovery] public/index.html must reference an assets/index-*.js entrypoint');
const src = fs.readFileSync(`${ASSETS}/${m[1]}`, 'utf8');

const i = src.indexOf('x=e=>e instanceof Error');
if (i < 0) die(`[boot-recovery] app-mount error classifier (x=...) not found in ${m[1]}`);
const classifier = src.slice(i, i + 480);

const REQUIRED = [
  'exceed_cached_egress_quota', '503', '429',
  'Failed to fetch', 'NetworkError', 'rate limit',
];
const missing = REQUIRED.filter((t) => !classifier.includes(t));
if (missing.length) {
  die(`[boot-recovery] FAIL — classifier in ${m[1]} is missing retryable tokens: ` +
    missing.join(', ') + '\n  A throttled Supabase edge (' +
    'exceed_cached_egress_quota) would leave users stuck on the splash with no login form.\n' +
    '  Patch the classifier to treat these as retryable.');
}
console.log(`[boot-recovery] OK — ${m[1]} classifies quota/network errors as retryable`);
