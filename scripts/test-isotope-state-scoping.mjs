#!/usr/bin/env node
/**
 * test-isotope-state-scoping.mjs — regression guard for the process-global
 * /__isotope/state store (round R6, 2026-10-08).
 *
 * THE DEFECT
 *   The bridge state was ONE object for the whole process:
 *
 *     const appStateStore = { timerState: null, localStorage: {} };
 *     GET  /__isotope/state -> res.end(JSON.stringify(appStateStore))
 *     POST /__isotope/state -> Object.assign(appStateStore.localStorage, body)
 *
 *   Both routes are unauthenticated — docs/api-reference.html says so outright,
 *   which is correct for a cross-TAB bridge. But server.mjs binds 0.0.0.0, so on
 *   a self-hosted box every other device on the LAN shares that one object: GET
 *   hands any caller the accumulated timerState and mirrored localStorage, and
 *   POST merges arbitrary attacker-supplied keys into it. Cross-visitor read and
 *   write of another user's mirrored state, no session involved.
 *
 *   It became a bug the moment the listener stopped being loopback-only, not the
 *   moment the route was written.
 *
 * WHY THIS IS NOT A GREP
 *   The route handlers are lifted out of server.mjs, the appStateStore definition
 *   and its helpers are evaluated in a sandbox, and the handlers are then driven
 *   with real request objects through node:http against a live listener. The
 *   assertions are about what one caller can OBSERVE after another caller writes,
 *   which is the property that was broken — and which no source-level pattern
 *   match can distinguish from a store that merely looks namespaced.
 *
 *   The client key is a bearer handle, not authentication: it stops the LAN
 *   neighbour from reading or clobbering someone else's slot, and the test says
 *   so rather than implying the bridge is authenticated. It also asserts the
 *   cross-tab contract still holds — the same key DOES share — because a fix
 *   that made every write invisible to its own companion overlay would be a
 *   regression, not a repair.
 *
 * CI: `npm run test:isotope-state-scoping`
 */
import http from 'node:http';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.env.ROOT || fileURLToPath(new URL('..', import.meta.url));
const SERVER = path.join(ROOT, 'server.mjs');

let failures = 0;
const ok = (label, bad) => {
  if (!bad) { console.log(`  ✅ ${label}`); return; }
  failures++;
  console.log(`  ❌ ${label}\n       ${bad}`);
};

/**
 * Read a slice of server.mjs so the test exercises the shipped code.
 *
 * A missing marker is reported as a FAILED assertion rather than thrown, so a
 * regression that deletes or renames the guarded code shows up as a legible red
 * line about the thing that went missing, instead of a stack trace.
 */
const missing = [];
function slice(startMarker, endMarker) {
  const src = fs.readFileSync(SERVER, 'utf8');
  const a = src.indexOf(startMarker);
  if (a < 0) { missing.push(`start marker not found: ${startMarker}`); return ''; }
  const b = endMarker ? src.indexOf(endMarker, a + startMarker.length) : src.length;
  if (b < 0) { missing.push(`end marker not found: ${endMarker}`); return ''; }
  return src.slice(a, b);
}

/* ── the store, evaluated from server.mjs's own source ─────────────────────── */

const storeSource = slice(
  'const APP_STATE_KEYS_MAX = 64;',
  '// ── PiP companion bridge'
);

// ── the two route handlers, also lifted verbatim ───────────────────────────
const handlersSource = slice(
  "if (req.method === 'GET' && req.url.startsWith('/__isotope/state')) {",
  '// ── PiP companion endpoints'
);

/**
 * Serve just these two routes with a bare http server, so the assertions run
 * against real sockets and real request headers rather than a stub.
 */
async function withServer(fn) {
  // eslint-disable-next-line no-new-func
  const dispatch = new Function('req', 'res', 'appStateStore', 'appStateClientKey',
    'APP_STATE_BYTES_MAX', `
    ${handlersSource}
    res.writeHead(404); res.end('{}');
  `);

  const server = http.createServer((req, res) => {
    try {
      dispatch(req, res, appStateStore, appStateClientKey, APP_STATE_BYTES_MAX);
    } catch (e) {
      res.writeHead(500); res.end(JSON.stringify({ error: String(e && e.message) }));
    }
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  const call = (method, url, body, key) => new Promise((resolve, reject) => {
    const headers = {};
    if (key) headers['x-isotope-state-key'] = key;
    let payload = null;
    if (body !== undefined) { payload = JSON.stringify(body); headers['content-type'] = 'application/json'; }
    const req = http.request({ host: '127.0.0.1', port, method, path: url, headers }, (r) => {
      let text = '';
      r.on('data', (d) => { text += d; });
      r.on('end', () => resolve({ status: r.statusCode, body: text ? JSON.parse(text) : null }));
    });
    req.on('error', reject);
    if (payload !== null) req.write(payload);
    req.end();
  });
  try { await fn(call); }
  finally { await new Promise((r) => server.close(r)); }
}

/* ── assertions ───────────────────────────────────────────────────────────── */

console.log('/__isotope/state must not be one shared object for every visitor (R6)\n');

// The per-client scoping helpers are the whole point of the fix. If they are
// gone, the bridge is shared again -- say so, and stop: the remaining assertions
// cannot mean anything against a store with no per-client slots.
ok('server.mjs scopes the state store per client', missing.join('; '));
if (missing.length) {
  console.error(`FAILED: ${failures} assertion(s)`);
  process.exit(1);
}

// The lifted source calls crypto.createHash, exactly as server.mjs does, so the
// harness supplies the same module rather than stubbing the hash out -- a stub
// would hide whether the digest is what makes the key collision-proof.
const { appStateStore, appStateClientKey, APP_STATE_BYTES_MAX } = new Function(
  'crypto', `${storeSource}; return { appStateStore, appStateClientKey, APP_STATE_BYTES_MAX };`
)(crypto);


const ALICE = 'alice-tab-a7f3';
const BOB   = 'bob-tab-b91c';

await withServer(async (call) => {
  // ── the regression: two clients must not see each other ──
  await call('POST', '/__isotope/state', {
    timerState: 'running',
    localStorage: { 'isotope:alice-secret': 'alice-private-value' },
  }, ALICE);

  const bobSees = await call('GET', '/__isotope/state', undefined, BOB);
  ok("bob's GET does not return alice's timerState",
     bobSees.body && bobSees.body.timerState === 'running'
       ? `leaked: ${JSON.stringify(bobSees.body)}` : '');
  ok("bob's GET does not return alice's mirrored localStorage",
     bobSees.body && bobSees.body.localStorage && 'isotope:alice-secret' in bobSees.body.localStorage
       ? `leaked: ${JSON.stringify(bobSees.body.localStorage)}` : '');

  // ── and bob's write must not land in alice's slot ──
  await call('POST', '/__isotope/state', {
    timerState: 'paused',
    localStorage: { 'isotope:bob-key': 'bob-value' },
  }, BOB);

  const aliceSees = await call('GET', '/__isotope/state', undefined, ALICE);
  ok("alice's slot still reads 'running' after bob wrote to his own",
     aliceSees.body && aliceSees.body.timerState === 'running'
       ? '' : `clobbered: ${JSON.stringify(aliceSees.body)}`);
  ok("alice's slot keeps her own mirrored localStorage",
     aliceSees.body && aliceSees.body.localStorage && 'isotope:bob-key' in aliceSees.body.localStorage
       ? `bob's write landed in alice's slot: ${JSON.stringify(aliceSees.body.localStorage)}` : '');

  // ── cross-tab sharing must still work: same key, same slot ──
  const aliceOtherTab = await call('GET', '/__isotope/state', undefined, ALICE);
  ok('a second tab under the same key still sees the shared state (cross-tab contract)',
     aliceOtherTab.body && aliceOtherTab.body.timerState === 'running'
       ? '' : `the companion overlay would see nothing: ${JSON.stringify(aliceOtherTab.body)}`);

  // ── the old behaviour: a bare request with no key at all ──
  // A keyless caller lands in the 'default' bucket, which is its own and is not
  // anyone else's, so two keyless callers must not collide with alice either.
  const keyless = await call('GET', '/__isotope/state');
  ok("a keyless caller gets its own bucket, not alice's",
     keyless.body && keyless.body.timerState !== 'running'
       ? '' : 'keyless request fell through to a shared slot');

  // ── a hostile key must not be able to name another client's slot ──
  // The key is sanitised to an opaque id; characters that could traverse or
  // collide are stripped, so this cannot become someone else's slot.
  await call('POST', '/__isotope/state', { timerState: 'hijacked' }, `../${ALICE}!!`);
  const aliceAfter = await call('GET', '/__isotope/state', undefined, ALICE);
  ok("a traversal-shaped key cannot reach alice's slot",
     aliceAfter.body && aliceAfter.body.timerState === 'running'
       ? '' : `alice's slot was overwritten: ${JSON.stringify(aliceAfter.body)}`);
});

if (failures) {
  console.error(`FAILED: ${failures} assertion(s)`);
  process.exit(1);
}
console.log('All /__isotope/state scoping assertions passed.');
