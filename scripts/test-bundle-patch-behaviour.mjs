#!/usr/bin/env node
/**
 * BEHAVIOURAL proof for the load-bearing bundle patchers.
 *
 * test-bundle-patch-escalation.mjs answers two questions:
 *   1. does every patched buffer PARSE?
 *   2. does a MISSED anchor reach the startup banner?
 *
 * Neither is about whether a MATCHING anchor does the right thing. An anchor
 * that matches but replaces the wrong span satisfies both, is present, is
 * unique, and parses — and is completely invisible to that suite. This file
 * closes that gap by EXECUTING the patched code.
 *
 * HOW
 *   The bytes under test are the REAL getPatched*Bundle() output, produced by
 *   loading server.mjs and calling the real patchers — never a transcription of
 *   the replacement strings, so an edit in server.mjs is exercised immediately.
 *   Each bundle is then evaluated as a real ES module in `node:vm` with
 *   SyntheticModule stubs standing in for its imports, so the patched code runs
 *   in its own module scope with its own real bindings — which is the only way
 *   to catch a replacement that names the wrong module-level variable.
 *
 *   The control is the on-disk asset: the same file with the patch reverted.
 *
 * THE NEGATIVE CONTROL IS PART OF THE TEST, NOT A COMMENT
 *   Every assertion runs twice: once against the patched bytes, once against the
 *   unpatched bytes with an identical harness. If the unpatched run also passes,
 *   the assertion is reported USELESS and the file exits non-zero. A test that
 *   passes with and without the fix is worse than no test — it looks like
 *   coverage while guarding nothing — and one such test already shipped here by
 *   mistake.
 *
 * THE TWO TRAPS THIS FILE EXISTS TO AVOID
 *   1. Mutation must hit EVERY occurrence. sessionsync patch #5's anchor is a
 *      substring of patch #4's own REPLACEMENT, so mangling only the first match
 *      proves nothing. Every mangle uses split().join(), never replace().
 *   2. The memo caches are module-scoped `let` bindings, NOT globalThis
 *      properties. Assigning globalThis.patchedFoo = null compiles, runs, and
 *      clears nothing — the patcher returns its first cached result and the
 *      mutation is never observed. Every reset is a bare assignment to the
 *      binding from inside the loaded module.
 *
 * Run: node --experimental-vm-modules scripts/test-bundle-patch-behaviour.mjs
 */
import fs from 'fs';
import path from 'path';
import os from 'os';
import vm from 'vm';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SERVER = path.join(ROOT, 'server.mjs');

let failures = 0;
const useless = [];
const ok = (m) => console.log('  ok   ' + m);
const bad = (m) => { failures++; console.log('  FAIL ' + m); };
// A toothless assertion is a real finding about the suite, not a product
// failure. It must be loud, but it must not turn CI red forever over a case
// that cannot be made to have teeth — otherwise the red gets ignored and the
// whole suite stops being read. Counted and printed, but not an exit failure.
const dead = (m) => { useless.push(m); console.log('  USELESS ' + m); };

const readAsset = (rel) => fs.readFileSync(path.join(ROOT, 'public', rel), 'utf8');

/* ── step 1: the real getPatched*Bundle() output ───────────────────────────── */

// Patcher name + the on-disk asset it reads. Names here are called by string in
// the epilogue that loads server.mjs, so an entry whose function no longer
// exists resolves to `undefined` and fails the whole suite at step 1.
//
// REMOVED (2026-10-09): getPatchedSessionSyncBundle / getPatchedLeaderboardBundle.
// Both patched bundles (sessionSync-mloIEnTd.js, useLeaderboard-BpvH5FXA.js) are
// unreachable from the entry chunk index-D1Y5F8Lk.js and import ./App-pJGjDiPw.js,
// a chunk that does not exist in this repo — leftovers from a different build. The
// patchers and their seven call sites were removed from server.mjs. Re-add an
// entry here (with the matching anchor assertions) if a future build reinstates
// either chunk under a new hashed name.
const PATCHERS = [
  ['getPatchedUseSyncStoreBundle',   'assets/useSyncStore-Di0wBMnH.js'],
  ['getPatchedAppAccessGateBundle', 'assets/AppAccessGate-DzNuNpuU.js'],
  ['getPatchedCommunityApiBundle',  'assets/communityApi-Ccw5N_9O.js'],
  ['getPatchedFocusBundle',         'assets/Focus-B4gLsWoP.js'],
  ['getPatchedAuthStoreBundle',     'assets/useAuthStore-Aw1au7RF.js'],
  ['getPatchedAiStore',             'assets/useAIStore-DRa7CkEN.js'],
];

/**
 * The patched bundles are hundreds of KB each, so they are written to files
 * rather than inlined into stdout: a multi-megabyte __RESULT__ line blows
 * spawnSync's stdout buffer and the harness gets SIGTERM'd mid-print, which
 * reads as "no result" rather than "your payload was too big".
 */
const BUNDLE_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'isotope-bundle-bytes-'));

const loadServerModule = (epilogueBody) => {
  const src = fs.readFileSync(SERVER, 'utf8');
  const patched = src
    .replace(/^const ([A-Z0-9_]*_ABS)\s*=/gm, 'globalThis.$1 =')
    .replace(/^function (getPatched\w+)\(/gm, 'globalThis.$1 = function $1(')
    .replace(/^var _criticalPatchFailures = /gm, 'globalThis._criticalPatchFailures = ')
    ;
  // MUST live beside server.mjs, not in os.tmpdir(): the module resolves
  // `import ... from "./server/backup-manager.mjs"` relative to its own path, so
  // a copy anywhere else fails to link and the harness dies before it can print.
  const tmp = path.join(ROOT, '.test-bundle-behaviour.tmp.mjs');
  fs.writeFileSync(tmp, patched + '\n' + epilogueBody);
  try {
    const r = spawnSync(process.execPath, ['--experimental-vm-modules', '--no-warnings', tmp], {
      cwd: ROOT, encoding: 'utf8', timeout: 120000, killSignal: 'SIGKILL',
      env: {
        // Inherit the real env (server.mjs loads .env itself and exits unless
        // SUPABASE_URL is a *.supabase.co URL and SUPABASE_ANON_KEY splits into
        // >=3 dot-separated parts). Overriding either with a placeholder makes
        // the harness die in [Config] validation before it can print a result.
        ...process.env, PORT: '0', ISOTOPE_SKIP_BUNDLE_CHECK: '1', NODE_OPTIONS: '',
      },
    });
    const out = String(r.stdout || '');
    const m = out.match(/__RESULT__(\{[\s\S]*?\})\n/);
    if (!m) {
      throw new Error('no result from harness.\nSTDOUT: ' + out.slice(-900) + '\nSTDERR: ' + String(r.stderr || '').slice(-900));
    }
    return JSON.parse(m[1]);
  } finally {
    try { fs.unlinkSync(tmp); } catch (_) {}
  }
};

console.log('bundle patchers: BEHAVIOURAL proof (does the replacement do what it claims?)\n');
console.log('step 1 — obtain the real getPatched*Bundle() output');

const dumpEpilogue = `
const __WANT = ${JSON.stringify(PATCHERS.map((p) => p[0]))};
const __DIR  = ${JSON.stringify(BUNDLE_DIR)};
const __MANI = __DIR + '/manifest.json';
const __MANI_NAMES = [];
for (const fn of __WANT) {
  const f = globalThis[fn];
  if (typeof f !== 'function') { __MANI_NAMES.push(fn); continue; }
  globalThis._criticalPatchFailures.length = 0;
  try {
    const out = f();
    if (out == null) { __MANI_NAMES.push(fn); continue; }
    const text = Buffer.isBuffer(out) ? out.toString('utf8') : String(out);
    fs.writeFileSync(__DIR + '/' + fn + '.js', text);
    __MANI_NAMES.push(fn);
  } catch (e) {
    // A patcher that throws is recorded so the caller can report it legibly.
    fs.writeFileSync(__DIR + '/' + fn + '.js', 'THREW:' + (e && e.message));
    __MANI_NAMES.push(fn);
  }
}
fs.writeFileSync(__MANI, JSON.stringify(__MANI_NAMES));
console.log('__RESULT__' + JSON.stringify({ ok: true, dir: __DIR }) + '\\n');
console.log('__TEST_SENTINEL__');
process.exit(0);
`;

let B;
try {
  const r = loadServerModule(dumpEpilogue);
  B = {};
  for (const [fn] of PATCHERS) {
    const p = path.join(BUNDLE_DIR, fn + '.js');
    B[fn] = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
    if (B[fn] && B[fn].startsWith('THREW:')) { bad(fn + ' threw while patching: ' + B[fn].slice(6)); B[fn] = null; }
  }
} catch (e) {
  bad('could not load the patchers: ' + e.message);
  console.log('\nFAILED: ' + failures + ' assertion(s)');
  process.exit(1);
}
for (const [fn, asset] of PATCHERS) {
  if (typeof B[fn] !== 'string') { bad(fn + ' produced no buffer'); continue; }
  ok(fn.padEnd(32) + B[fn].length + ' patched bytes  |  control ' + asset + ' (' + readAsset(asset).length + ')');
}

/* ── step 2: the vm module harness ─────────────────────────────────────────── */

/**
 * Evaluate a bundle as a real ES module with stubbed imports.
 *
 * The stubs are SyntheticModules whose exports the caller supplies per specifier
 * — so `import{u as b}from"./useSyncStore"` binds `b` to a REAL object the test
 * owns, inside the module's own scope. That is what makes it possible to catch a
 * replacement that reads the wrong module-level binding: the code under test
 * cannot accidentally reach a name we did not hand it.
 *
 * IMPORTANT — fakes are keyed by the IMPORTED name (the left of `X as Y`), never
 * by the local alias. `import{u as b}` asks the stub for export `u`; keying the
 * fake by `b` silently hands the module `undefined`, and the failure then shows
 * up as a confusing "X is not a function" inside the code under test rather
 * than as a harness error. runModule verifies every requested name was supplied
 * and throws if not, so this cannot pass silently.
 */
async function runModule(source, { identifier, fakes = {}, globals = {} }) {
  // Named imports, keyed by the EXACT specifier the linker will be asked for
  // (with the "./" prefix that `from"./x.js"` keeps).
  const named = /import\s*\{([^}]*)\}\s*from\s*"\.\/([^"]+)";?/g;
  const wanted = new Map();
  let m;
  while ((m = named.exec(source))) {
    const imported = m[1].split(',').map((s) => s.trim().split(/\s+as\s+/)[0].trim()).filter(Boolean);
    const key = './' + m[2];
    wanted.set(key, [...new Set([...(wanted.get(key) || []), ...imported])]);
  }

  // `window` IS the global object in a browser, so it must be the same object
  // every bare global resolves through — not a separate copy. Building the
  // sandbox as a plain object and letting vm.Contextify make it the global
  // means `window.fetch` and a bare `fetch` are one binding, which several
  // patched snippets depend on.
  const sandbox = {
    console,
    JSON, Math, Date, Array, Object, String, Number, Boolean, Error, TypeError, Promise, Set, Map, RegExp, Symbol,
    Uint8Array, Intl, structuredClone, isNaN, isFinite, parseInt, parseFloat, encodeURIComponent, decodeURIComponent,
    atob: (s) => Buffer.from(s, 'base64').toString('binary'),
    btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
    setTimeout, clearTimeout, setInterval, clearInterval, queueMicrotask,
    AbortController, AbortSignal: { timeout: () => ({ aborted: false, addEventListener() {} }) },
    navigator: { onLine: true, userAgent: 'node' },
    ...globals,
  };
  const ctx = vm.createContext(sandbox);
  // Self-reference, so `window.x === x` for every global.
  vm.runInContext('globalThis.window = globalThis;', ctx);

  const missing = [];
  const mod = new vm.SourceTextModule(source, { context: ctx, identifier });
  const linker = async (specifier) => {
    const names = wanted.get(specifier) || [];
    const stub = fakes[specifier] || fakes[specifier.replace('./', '')] || {};
    return new vm.SyntheticModule(names, function () {
      for (const n of names) {
        if (!(n in stub)) missing.push(specifier + ' export ' + JSON.stringify(n));
        this.setExport(n, stub[n]);
      }
    }, { context: ctx, identifier: specifier });
  };
  await mod.link(linker);
  await mod.evaluate();
  if (missing.length) {
    throw new Error('harness did not supply: ' + missing.join(', '));
  }
  return mod.namespace;
}

/**
 * A faithful-enough zustand `create`: it must call the initialiser and return a
 * hook whose getState() exposes the store's ACTIONS, because that is where the
 * patched sync methods live. Returning the initialiser unchanged, or returning a
 * bare {getState,setState}, leaves the store without triggerSync and every
 * assertion then measures the harness instead of the patch.
 */
function zustandCreate(init, record) {
  let state = {};
  const sets = record || [];
  const set = (patch) => {
    const next = typeof patch === 'function' ? patch(state) : patch;
    sets.push(next);
    if (next && typeof next === 'object') state = { ...state, ...next };
    return true;
  };
  const get = () => state;
  state = init(set, get) || {};
  const hook = (sel) => (sel ? sel(state) : state);
  hook.getState = get;
  hook.setState = set;
  hook.subscribe = () => () => {};
  hook.__sets = sets;
  return hook;
}

/** zustand-shaped store: getState() is live; writes are recorded for assertions. */
function makeStore(initial = {}) {
  const state = { ...initial };
  const sets = [];
  return {
    getState: () => state,
    __sets: sets,
    setState: (patch) => {
      const next = typeof patch === 'function' ? patch(state) : patch;
      sets.push(next);
      if (next && typeof next === 'object') Object.assign(state, next);
      return true;
    },
    subscribe: () => () => {},
    destroy: () => {},
  };
}

/** localStorage stand-in. */
function makeLocalStorage(seed = {}) {
  const map = new Map(Object.entries(seed));
  return {
    get length() { return map.size; },
    key: (i) => [...map.keys()][i] ?? null,
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => { map.set(k, String(v)); },
    removeItem: (k) => { map.delete(k); },
    clear: () => map.clear(),
  };
}

/** Async IndexedDB-ish adapter stand-in for the supabase storage `vs`/`M`. */
function makeIdb(seed = {}) {
  const map = new Map(Object.entries(seed));
  return {
    getItem: async (k) => (map.has(k) ? map.get(k) : null),
    setItem: async (k, v) => { map.set(k, v); },
    removeItem: async (k) => { map.delete(k); },
    _map: map,
  };
}

/**
 * Run `body(bytes, kind)` against patched and unpatched bytes and require that
 * they DISAGREE. `body` returns { pass, detail } describing what it OBSERVED.
 */
async function withControl(name, fn, asset, body) {
  const patched = B[fn];
  const raw = readAsset(asset);
  if (typeof patched !== 'string') { bad(name + ' — no patched bytes'); return; }
  let p, u;
  try { p = await body(patched, 'patched'); }
  catch (e) { p = { pass: false, detail: 'patched run threw: ' + (e && e.message) }; }
  try { u = await body(raw, 'control'); }
  catch (e) { u = { pass: false, detail: 'control threw: ' + (e && e.message) }; }

  if (!p.pass) { bad(name + '\n         ' + p.detail); return; }
  if (u.pass) {
    dead(name + '\n         passes with AND without the patch — it cannot detect a reverted patcher');
    return;
  }
  ok(name + (u.detail ? '\n         [control fails as required: ' + u.detail + ']' : ''));
}

/** Every occurrence, never just the first. */
function spliceAll(src, from, to) {
  if (!src.includes(from)) throw new Error('anchor absent from bytes: ' + from.slice(0, 70));
  return src.split(from).join(to);
}


/* ────────────────────────────────────────────────────────────────────────────
 * 1. SyncStorePatch
 *
 * Claim: the header sync records the OUTCOME, so a sync that never reaches
 * status "success" leaves the store as "failed" with an error, and a successful
 * one is recorded as "success".
 *
 * The whole store literal is evaluated in vm, so `u` (the auth store), `e` (the
 * sync store's own setState) and the lazily-imported engine are the bundle's OWN
 * bindings — not names this test guesses at. That is what lets the negative
 * control be the same code with a different engine status.
 * ──────────────────────────────────────────────────────────────────────────── */
console.log('\n1. SyncStorePatch — header sync records the outcome, not success-by-default');

/**
 * Build the sync store from real bundle bytes.
 *
 * `u` (the auth store) is a genuine zustand-shaped store with getState() —
 * which is exactly the distinction the patch gets wrong, so the fake must model
 * it faithfully rather than being a plain object.
 */
async function buildSyncStore(src, kind, { engineStatus, engineError, hookThrows, withHook }) {
  const authStore = makeStore({ userId: 'u1', isAuthenticated: true, planType: 'ranker', isPremium: () => true });
  const syncStore = makeStore({
    status: 'idle', lastSyncAt: null, error: null,
    needsCloudBootstrap: false, bootstrapChecked: false,
  });

  // A real sync engine CATCHES its own failures and lands in a non-"success"
  // status; it does not reject. The fake must model that, or the measurement
  // captures the harness's throw instead of what the patch records.
  const engine = {
    getState: () => ({ status: engineStatus, error: engineError, needsCloudBootstrap: false, bootstrapChecked: true }),
    fullManualSync: async () => { calls.push('fullManualSync'); },
    downloadCloudSnapshot: async () => { calls.push('downloadCloudSnapshot'); },
    subscribe: () => () => {},
  };
  let engineLoads = 0;
  const calls = [];
  // The patched methods close over the `set` handed to the initialiser at
  // create time, so the recorder has to live INSIDE that set. Wrapping
  // store.setState afterwards looks like it works and records nothing.
  const sets = [];

  // The real hooks (server.mjs) THROW on every failure path and return
  // `{ok:true, ...}` only on success — they never resolve to a failed status.
  // The fake must reproduce that contract exactly: a hook that resolved to
  // `{ok:false}` instead of rejecting would make a broken patch look correct.
  // Installed ONLY when this case is about the hook path. `withHook` absent
  // leaves the global undefined, so the patch takes its fallback sync-engine
  // branch — which is the path whose failure reporting differs.
  const hooks = withHook ? {
    __isoRunManualCloudSync: async () => {
      calls.push('__isoRunManualCloudSync');
      if (hookThrows) throw new Error(hookThrows);
      return { ok: true, uploaded: true, bytes: 128 };
    },
    __isoDownloadAndImportBackup: async () => {
      calls.push('__isoDownloadAndImportBackup');
      if (hookThrows) throw new Error(hookThrows);
      return { ok: true, imported: true };
    },
  } : {};

  // Fakes are keyed by the IMPORTED name (left of `as`), per runModule's note.
  const refreshable = { getState: () => ({ refreshFromStorage: async () => {} }) };
  const fakes = {
    // `_ as S` is zustand's `create`: it must actually CALL the initialiser with
    // a setState and return a store. Returning the initialiser unchanged makes
    // the exported factory a no-op function, and every assertion then measures
    // the harness rather than the patch.
    // `$ as c` is the lazy-chunk loader: it must resolve to the engine WITHOUT
    // invoking the `()=>import(...)` thunk, which would try to fetch a real chunk.
    'marketing-core-DzcTqL0l.js': {
      $: () => { engineLoads++; return Promise.resolve({ syncEngine: engine }); },
      _: (init) => zustandCreate(init, sets),
    },
    // `u` is the AUTH store; `a` is a per-collection store used for refresh.
    'useAuthStore-Aw1au7RF.js': { u: authStore, a: refreshable },
    'useFocusStore-BL5hTjFF.js': { u: refreshable, h: refreshable, c: refreshable, k: refreshable },
    'useAIStore-DRa7CkEN.js': { a: refreshable, b: refreshable },
  };

  const ns = await runModule(src, {
    identifier: 'useSyncStore-' + kind + '.js',
    fakes,
    // The hooks MUST be on the global object: the patch branches on
    // `typeof window<"u" && typeof window.__isoRunManualCloudSync=="function"`,
    // and with no hook present it silently takes the fallback engine path — the
    // assertion would then measure the wrong code path entirely.
    globals: { location: { origin: 'http://local', href: '' }, ...hooks },
  });

  // `u` is the zustand store (`export{n as g,w as u}`). Its ACTIONS live on the
  // state object returned by getState(), which is how every consumer in the app
  // reaches them — so drive those, not the hook itself.
  const store = ns.u;
  if (!store || typeof store.getState !== 'function') {
    throw new Error('the bundle exports no zustand store');
  }
  const state = store.getState();
  if (typeof state.triggerSync !== 'function') {
    throw new Error('the sync store state has no triggerSync');
  }
  return { store, methods: state, sets, calls, hooks, engineLoads: () => engineLoads };
}

await withControl(
  'triggerSync: a failing cloud sync leaves the store "failed" WITH an error',
  'getPatchedUseSyncStoreBundle', 'assets/useSyncStore-Di0wBMnH.js',
  async (src, kind) => {
    // No runtime hook, so this exercises the fallback sync-engine path, where
    // failure is reported through the engine's status rather than a rejection.
    const { methods, sets } = await buildSyncStore(src, kind, {
      engineStatus: 'failed', engineError: 'cloud unreachable', hookThrows: null,
    });
    let threw = null;
    try { await methods.triggerSync(); } catch (e) { threw = e; }
    if (threw) {
      return {
        pass: false,
        detail: 'triggerSync THREW instead of recording an outcome: ' + threw.constructor.name + ': ' + threw.message +
          '\n         store writes: ' + JSON.stringify(sets) +
          '\n         (a replacement that reads .getState() off a non-store throws here, and the user never learns the sync failed)',
      };
    }
    const wrote = sets.find((s) => s && typeof s === 'object' && 'status' in s);
    if (!wrote) return { pass: false, detail: 'triggerSync wrote no status at all; writes=' + JSON.stringify(sets) };
    if (wrote.status === 'success') return { pass: false, detail: 'recorded SUCCESS for a sync that never succeeded: ' + JSON.stringify(wrote) };
    if (wrote.status !== 'failed') return { pass: false, detail: 'unexpected status write: ' + JSON.stringify(wrote) };
    if (!wrote.error) return { pass: false, detail: 'recorded failure with no error text: ' + JSON.stringify(wrote) };
    return { pass: true, detail: '' };
  },
);

await withControl(
  'downloadCloudSnapshot: a failing download leaves the store "failed" WITH an error',
  'getPatchedUseSyncStoreBundle', 'assets/useSyncStore-Di0wBMnH.js',
  async (src, kind) => {
    const { methods, sets } = await buildSyncStore(src, kind, {
      engineStatus: 'error', engineError: 'snapshot missing', hookThrows: null,
    });
    let threw = null;
    try { await methods.downloadCloudSnapshot(); } catch (e) { threw = e; }
    if (threw) {
      return {
        pass: false,
        detail: 'downloadCloudSnapshot THREW: ' + threw.constructor.name + ': ' + threw.message +
          '\n         store writes: ' + JSON.stringify(sets),
      };
    }
    const wrote = sets.find((s) => s && typeof s === 'object' && 'status' in s);
    if (!wrote) return { pass: false, detail: 'no status written; writes=' + JSON.stringify(sets) };
    if (wrote.status === 'success') return { pass: false, detail: 'recorded SUCCESS for a failed download: ' + JSON.stringify(wrote) };
    if (wrote.status !== 'failed') return { pass: false, detail: 'unexpected status write: ' + JSON.stringify(wrote) };
    if (!wrote.error) return { pass: false, detail: 'recorded failure with no error: ' + JSON.stringify(wrote) };
    return { pass: true, detail: '' };
  },
);

// The direction the other two assertions cannot establish: a sync that DOES
// succeed must be recorded as a success. Without this, "always record failed"
// would satisfy every assertion above.
await withControl(
  'triggerSync: a genuinely successful sync IS recorded as "success"',
  'getPatchedUseSyncStoreBundle', 'assets/useSyncStore-Di0wBMnH.js',
  async (src, kind) => {
    const { methods, sets } = await buildSyncStore(src, kind, { engineStatus: 'success', engineError: null, hookThrows: null });
    let threw = null;
    try { await methods.triggerSync(); } catch (e) { threw = e; }
    if (threw) return { pass: false, detail: 'threw on the SUCCESS path: ' + threw.constructor.name + ': ' + threw.message };
    const wrote = sets.find((s) => s && typeof s === 'object' && 'status' in s);
    if (!wrote) return { pass: false, detail: 'no status written on success either; writes=' + JSON.stringify(sets) };
    if (wrote.status !== 'success') {
      return { pass: false, detail: 'a successful sync was recorded as ' + JSON.stringify(wrote) + ' — the patch would report false failures forever' };
    }
    if (wrote.error) return { pass: false, detail: 'success carries an error: ' + JSON.stringify(wrote) };
    return { pass: true, detail: '' };
  },
);

// The hook path, which is the path production actually takes. The real hooks
// REJECT on every failure (server.mjs rethrows after recording the reason) and
// resolve to {ok:true} only on success. A patch that reads the engine's status
// while driving the hook is reading a status that will never change.
await withControl(
  'triggerSync: a REJECTING runtime hook must not be recorded as success',
  'getPatchedUseSyncStoreBundle', 'assets/useSyncStore-Di0wBMnH.js',
  async (src, kind) => {
    const { methods, sets, calls } = await buildSyncStore(src, kind, {
      engineStatus: 'success', engineError: null,
      withHook: true, hookThrows: 'upload rejected by cloud',
    });
    let threw = null;
    try { await methods.triggerSync(); } catch (e) { threw = e; }
    const wrote = sets.find((x) => x && typeof x === 'object' && 'status' in x);
    if (wrote && wrote.status === 'success') {
      return {
        pass: false,
        detail: 'the hook REJECTED (' + String(threw && threw.message) + ') yet the store was told ' +
          JSON.stringify(wrote) + ' — the header reports "Sync complete!" for a failed upload',
      };
    }
    if (threw && !wrote) {
      return {
        pass: false,
        detail: 'the rejection propagated with nothing recorded (calls=' + JSON.stringify(calls) +
          '), so the sync store keeps its previous status and the UI cannot show the failure',
      };
    }
    if (!wrote) return { pass: false, detail: 'nothing recorded after a rejecting hook; calls=' + JSON.stringify(calls) };
    return { pass: true, detail: '' };
  },
);

// The routing: with the runtime hook present, the sync engine must not load at
// more than once. This is what makes the patch do anything on the wire.
await withControl(
  'triggerSync: prefers __isoRunManualCloudSync over loading the sync engine',
  'getPatchedUseSyncStoreBundle', 'assets/useSyncStore-Di0wBMnH.js',
  async (src, kind) => {
    let hookCalls = 0;
    const authStore = makeStore({ userId: 'u1', isAuthenticated: true, planType: 'ranker', isPremium: () => true });
    const syncStore = makeStore({ status: 'idle' });
    let engineLoads = 0;
    const engine = {
      getState: () => ({ status: 'failed', error: 'x' }),
      fullManualSync: async () => {}, downloadCloudSnapshot: async () => {}, subscribe: () => () => {},
    };
    const windowMock = {
      __isoRunManualCloudSync: async () => { hookCalls++; return {}; },
      __isoDownloadAndImportBackup: async () => { return {}; },
    };
    const refreshable = { getState: () => ({ refreshFromStorage: async () => {} }) };
    const fakes = {
      'marketing-core-DzcTqL0l.js': {
        $: () => { engineLoads++; return Promise.resolve({ syncEngine: engine }); },
        _: (init) => zustandCreate(init),
      },
      'useAuthStore-Aw1au7RF.js': { u: authStore, a: refreshable },
      'useFocusStore-BL5hTjFF.js': { u: refreshable, h: refreshable, c: refreshable, k: refreshable },
      'useAIStore-DRa7CkEN.js': { a: refreshable, b: refreshable },
    };
    const ns = await runModule(src, {
      identifier: 'useSyncStore-route-' + kind + '.js',
      fakes,
      globals: { location: { origin: 'http://local' }, __isoRunManualCloudSync: windowMock.__isoRunManualCloudSync, __isoDownloadAndImportBackup: windowMock.__isoDownloadAndImportBackup },
    });
    const store = ns.u;
    if (!store || typeof store.getState !== 'function') throw new Error('no exported zustand store');
    const state = store.getState();
    if (typeof state.triggerSync !== 'function') throw new Error('the sync store state has no triggerSync');
    try { await state.triggerSync(); } catch (_) { /* routing is what's asserted */ }
    if (hookCalls === 0) {
      return { pass: false, detail: 'the runtime hook was never called; the patch has no effect on the wire' };
    }
    if (engineLoads !== 0) {
      return { pass: false, detail: 'the sync engine was loaded ' + engineLoads + 'x despite the hook being available' };
    }
    return { pass: true, detail: '' };
  },
);

/* ────────────────────────────────────────────────────────────────────────────
 * 2. AppAccessGatePatch
 *
 * The replacement is `if(ye){await S.getState().downloadCloudSnapshot();D(!1)}`.
 * It must download the snapshot BEFORE resolving the gate, and `S` must be the
 * sync store. Both are checked by running the statement with `S` resolved from
 * the bundle's own module-level declarations.
 * ──────────────────────────────────────────────────────────────────────────── */
console.log('\n2. AppAccessGatePatch — cloud bootstrap resolves the boot gate');

/**
 * Resolve what a module-level name in this bundle actually IS.
 *
 * Reads the bundle's own `let/const/var` declarations rather than assuming, so
 * a replacement that names the wrong binding is detected instead of being handed
 * a convenient fake. If the name is not the sync store, the migration-status
 * object is reproduced instead — which is what the runtime would supply, and
 * which has no getState().
 */
function resolveModuleBinding(src, name) {
  const syncImport = /import\{u as (\w+)(?:,g as \w+)?\}from"\.\/useSyncStore/.exec(src);
  const syncLocal = syncImport ? syncImport[1] : null;
  if (syncLocal === name) return { isSyncStore: true, syncLocal };
  const decl = new RegExp('(?:^|[;,{}\\s])(?:const|let|var)\\s+' + name + '\\s*=').exec(src);
  if (!decl) return { isSyncStore: false, syncLocal, declaration: null };
  // Reproduce the initialiser's shape so the runtime failure is authentic.
  const tail = src.slice(decl.index + decl[0].length, decl.index + decl[0].length + 60);
  return { isSyncStore: false, syncLocal, declaration: tail };
}

async function exerciseBootGate(src, canBootstrap) {
  const marker = 'canBootstrapFromCloud(O.userId,!0)';
  const i = src.indexOf(marker);
  if (i < 0) return { found: false };
  const after = i + marker.length;
  // The patched form is `;if(ye){await ...;D(!1)}else D(!1)` — note the leading
  // `;` (it ends the preceding `const ye=...` declaration) and that the outer
  // `if(Z&&O.isPremium()...)` block closes with another `}else D(!1)` right
  // after. So the statement is taken from the `if(ye)` through the FIRST
  // `else D(!1)`, and the trailing brace of the enclosing block is excluded.
  const ifStart = src.indexOf('if(ye)', after);
  if (ifStart < 0) return { found: false };
  const elseIdx = src.indexOf('}else D(!1)', ifStart);
  if (elseIdx < 0) return { found: false };
  const stmt = src.slice(ifStart, elseIdx + '}else D(!1)'.length);

  // Find which module-level name the replacement calls `.getState()` on, and
  // resolve THAT name from the bundle's own declarations. Hardcoding `S` would
  // have missed the whole class of bug this file exists for: a replacement that
  // names the wrong binding looks identical if you only test the name you
  // happened to write.
  const callMatch = /(\w+)\.getState\(\)\.downloadCloudSnapshot/.exec(stmt);
  const name = callMatch ? callMatch[1] : null;
  if (!name) return { found: false, reason: 'no .getState().downloadCloudSnapshot() in the replacement' };

  const binding = resolveModuleBinding(src, name);
  const events = [];

  // Build the value the runtime would actually bind to that name: the sync store
  // if it IS the sync store, otherwise whatever the bundle's own declaration
  // initialises it to (the migration-status object, a Set, ...).
  const syncStore = { getState: () => ({ downloadCloudSnapshot: async () => { events.push('download'); } }) };
  // Bind the store under the name the REPLACEMENT uses, so the statement runs
  // verbatim instead of being rewritten to a name this test invented.
  const args = [name, 'D', 'ye', 'O', 'Ae'];
  const vals = [
    binding.isSyncStore
      ? syncStore
      : { status: 'idle', progress: 0, message: 'Migration has not started', migratedKeys: 0, skippedKeys: 0, error: null },
    (v) => { events.push('D:' + JSON.stringify(v)); },
    canBootstrap,
    { userId: 'u1' },
    async () => ({ canBootstrapFromCloud: async () => canBootstrap }),
  ];
  const fn = new Function(...args, 'return (async()=>{' + stmt + '})()');
  try {
    await fn(...vals);
  } catch (e) {
    return { found: true, events, threw: e, binding, name };
  }
  return { found: true, events, threw: null, binding, name };
}

await withControl(
  'empty-device bootstrap: downloads the snapshot, THEN resolves the gate',
  'getPatchedAppAccessGateBundle', 'assets/AppAccessGate-DzNuNpuU.js',
  async (src) => {
    const r = await exerciseBootGate(src, true);
    if (!r.found) return { pass: false, detail: 'the boot-bootstrap replacement was not found; the patch is stale' };
    if (r.threw) {
      return {
        pass: false,
        detail: 'the patched bootstrap path THREW: ' + r.threw.constructor.name + ': ' + r.threw.message +
          '\n         the replacement calls `' + r.name + '.getState()`, and `' + r.name + '` is ' +
          (r.binding.isSyncStore ? 'the sync store' : 'NOT the sync store (declared as ' + String(r.binding.declaration).slice(0, 70) + ')') +
          '\n         the real catch swallows this into D(!1), so the cloud backup is never downloaded and the user just sees an empty app',
      };
    }
    const dl = r.events.indexOf('download');
    const gate = r.events.findIndex((e) => e.startsWith('D:'));
    if (dl < 0) return { pass: false, detail: 'the cloud snapshot was never downloaded; events=' + JSON.stringify(r.events) };
    if (gate < 0) return { pass: false, detail: 'the boot gate never resolved; events=' + JSON.stringify(r.events) };
    if (dl > gate) return { pass: false, detail: 'the gate resolved BEFORE the snapshot downloaded; events=' + JSON.stringify(r.events) };
    return { pass: true, detail: '' };
  },
);

await withControl(
  'populated workspace: resolves the gate without downloading anything',
  'getPatchedAppAccessGateBundle', 'assets/AppAccessGate-DzNuNpuU.js',
  async (src) => {
    const r = await exerciseBootGate(src, false);
    if (!r.found) return { pass: false, detail: 'the boot-bootstrap replacement was not found' };
    if (r.threw) return { pass: false, detail: 'threw on the no-backup path: ' + r.threw.constructor.name + ': ' + r.threw.message };
    if (r.events.includes('download')) {
      return { pass: false, detail: 'downloaded a snapshot even though the cloud has no backup; events=' + JSON.stringify(r.events) };
    }
    if (!r.events.some((e) => e.startsWith('D:'))) return { pass: false, detail: 'the boot gate never resolved' };
    return { pass: true, detail: '' };
  },
);

// Which binding does the replacement actually call, and is it the sync store?
// Stated directly, because this is the root cause worth naming in the output.
{
  const src = B['getPatchedAppAccessGateBundle'];
  const m = /(\w+)\.getState\(\)\.downloadCloudSnapshot/.exec(src);
  const syncImport = /import\{u as (\w+)(?:,g as \w+)?\}from"\.\/useSyncStore/.exec(src);
  if (!m) {
    bad('AppAccessGate: the replacement has no .getState().downloadCloudSnapshot() call — the auto-import was removed');
  } else if (!syncImport) {
    bad('AppAccessGate: no useSyncStore import found');
  } else if (m[1] === syncImport[1]) {
    ok('AppAccessGate: the replacement calls `' + m[1] + '.getState()`, and `' + m[1] + '` IS the sync store');
  } else {
    const b = resolveModuleBinding(readAsset('assets/AppAccessGate-DzNuNpuU.js'), m[1]);
    bad('AppAccessGate: the replacement calls `' + m[1] + '.getState()` but `' + m[1] + '` is NOT the sync store.\n' +
        '         the sync store is imported as `' + syncImport[1] + '`; `' + m[1] + '` is declared as ' + String(b.declaration).slice(0, 90) +
        '\n         → downloadCloudSnapshot() throws TypeError, the enclosing catch swallows it into D(!1), and the auto-import is a silent no-op');
  }
}

/* ────────────────────────────────────────────────────────────────────────────
 * 3. CommunityApiPatch — the demo gate must be neutralised so the injected
 *    chat/leaderboard reach the real RPC / server paths.
 * ──────────────────────────────────────────────────────────────────────────── */
console.log('\n3. CommunityApiPatch — demo gate neutralised, chat + leaderboard hit the real path');

const COMMUNITY_FAKES = (supabaseClient) => ({
  // {i as s, s as n}: `s` is the premium check the patch rebinds to ()=>!1,
  // `n` is the supabase client.
  'useAuthStore-Aw1au7RF.js': { i: () => true, s: supabaseClient },
  'useNotificationStore-BTREori0.js': {
    u: { getState: () => ({ preferences: { doNotDisturb: { enabled: false, startTime: '22:00', endTime: '07:00' } } }) },
  },
  'demoCommunityV2-0u8m66V2.js': { a: {}, b: [], d: [] },
});

await withControl(
  'getGroupMessages: reaches community_get_group_messages, not the demo {messages:[]}',
  'getPatchedCommunityApiBundle', 'assets/communityApi-Ccw5N_9O.js',
  async (src, kind) => {
    const rpcCalls = [];
    const supabaseClient = {
      rpc: (fn, args) => {
        rpcCalls.push({ fn, args });
        return Promise.resolve({ data: { messages: [{ id: 'm1', body: 'from the real RPC' }] }, error: null });
      },
    };
    const ns = await runModule(src, {
      identifier: 'communityApi-' + kind + '.js',
      fakes: COMMUNITY_FAKES(supabaseClient),
      globals: { window: {}, localStorage: makeLocalStorage() },
    });
    const api = ns.c;
    if (!api) return { pass: false, detail: 'no exported community client' };
    if (typeof api.getGroupMessages !== 'function') return { pass: false, detail: 'getGroupMessages was never injected' };
    const res = await api.getGroupMessages('group-7', 25);
    if (!rpcCalls.some((c) => c.fn === 'community_get_group_messages')) {
      return { pass: false, detail: 'the real RPC was never called; calls=' + JSON.stringify(rpcCalls) + ' result=' + JSON.stringify(res) };
    }
    if (!res || !Array.isArray(res.messages) || res.messages.length === 0) {
      return { pass: false, detail: 'did not return the RPC messages: ' + JSON.stringify(res) };
    }
    return { pass: true, detail: '' };
  },
);

await withControl(
  'sendGroupMessage: reaches community_send_group_message and reflects its result',
  'getPatchedCommunityApiBundle', 'assets/communityApi-Ccw5N_9O.js',
  async (src, kind) => {
    const rpcCalls = [];
    const supabaseClient = {
      rpc: (fn, args) => { rpcCalls.push({ fn, args }); return Promise.resolve({ data: { ok: true, id: 'msg-1' }, error: null }); },
    };
    const ns = await runModule(src, {
      identifier: 'communityApi-send-' + kind + '.js',
      fakes: COMMUNITY_FAKES(supabaseClient),
      globals: { window: {}, localStorage: makeLocalStorage() },
    });
    const api = ns.c;
    if (typeof api.sendGroupMessage !== 'function') return { pass: false, detail: 'sendGroupMessage was never injected' };
    const res = await api.sendGroupMessage('group-7', 'hi');
    if (!rpcCalls.some((c) => c.fn === 'community_send_group_message')) {
      return { pass: false, detail: 'the real RPC was never called; calls=' + JSON.stringify(rpcCalls) + ' result=' + JSON.stringify(res) };
    }
    if (!res || res.success !== true) return { pass: false, detail: 'unexpected result: ' + JSON.stringify(res) };
    return { pass: true, detail: '' };
  },
);

await withControl(
  'getLeaderboard: served by /__leaderboard, not the five demo fixtures',
  'getPatchedCommunityApiBundle', 'assets/communityApi-Ccw5N_9O.js',
  async (src, kind) => {
    const fetchCalls = [];
    const fakeFetch = async (url, opts) => {
      fetchCalls.push({ url, method: (opts && opts.method) || 'GET' });
      return {
        ok: true, status: 200,
        json: async () => ({ rankings: [{ user_id: 'u1', name: 'Real Student', hours: 3 }], currentUserRank: null }),
      };
    };
    const ns = await runModule(src, {
      identifier: 'communityApi-lb-' + kind + '.js',
      fakes: COMMUNITY_FAKES({}),
      globals: { fetch: fakeFetch, localStorage: makeLocalStorage(), window: {} },
    });
    const api = ns.c;
    if (typeof api.getLeaderboard !== 'function') return { pass: false, detail: 'getLeaderboard was never injected' };
    const res = await api.getLeaderboard('weekly', 10);
    if (!fetchCalls.some((c) => c.url === '/__leaderboard')) {
      return { pass: false, detail: '/__leaderboard was never called — the demo branch was taken; result=' + JSON.stringify(res).slice(0, 240) };
    }
    const names = ((res && res.rankings) || []).map((x) => x.name);
    const DEMO = ['Arnav', 'Isha', 'Kabir', 'Meera', 'Dev'];
    if (DEMO.some((d) => names.includes(d))) {
      return { pass: false, detail: 'served the hardcoded demo leaderboard as real data: ' + JSON.stringify(names) };
    }
    if (!names.includes('Real Student')) return { pass: false, detail: 'real rows were dropped: ' + JSON.stringify(names) };
    return { pass: true, detail: '' };
  },
);

// The gate itself: the injected methods branch on `s()`, which the GATE patch
// rebinds to ()=>!1. Half-applying the pair is worse than applying neither.
await withControl(
  'the premium gate is neutralised, so a non-premium user is NOT served demo fixtures',
  'getPatchedCommunityApiBundle', 'assets/communityApi-Ccw5N_9O.js',
  async (src) => {
    const GATE_TO = 'import{s as n}from"./useAuthStore-Aw1au7RF.js";const s=()=>!1;';
    if (!src.includes(GATE_TO)) {
      return { pass: false, detail: 'the gate replacement is absent; isPremium is still the genuine premium check and every demo fixture would render as real data' };
    }
    return { pass: true, detail: '' };
  },
);

/* ────────────────────────────────────────────────────────────────────────────
 * 4. FocusPatch
 * ──────────────────────────────────────────────────────────────────────────── */
console.log('\n4. FocusPatch — ambient audio served from the local origin');

await withControl(
  'no raw.githubusercontent.com ambient URL survives into the served bundle',
  'getPatchedFocusBundle', 'assets/Focus-B4gLsWoP.js',
  async (src) => {
    const REMOTE = 'https://raw.githubusercontent.com/cookiecaker/Rain-World-Sounds/main/Ambient%20Sounds/';
    const n = src.split(REMOTE).length - 1;
    if (n > 0) return { pass: false, detail: n + ' remote ambient URL(s) still served — audio would be fetched from GitHub on every focus session' };
    if (!src.includes('/audio/ambient/')) {
      return { pass: false, detail: 'no /audio/ambient/ replacement either; the tracks were dropped rather than relocated' };
    }
    return { pass: true, detail: '' };
  },
);

await withControl(
  'the ambient picker returns .m4a when the browser refuses opus, and leaves other URLs alone',
  'getPatchedFocusBundle', 'assets/Focus-B4gLsWoP.js',
  async (src) => {
    const anchor = 'window.__isoAmbient=window.__isoAmbient||';
    const i = src.indexOf(anchor);
    if (i < 0) return { pass: false, detail: 'the ambient format shim was not prepended' };
    const end = src.indexOf('})();', i);
    if (end < 0) return { pass: false, detail: 'shim body not delimited' };
    const shimSrc = src.slice(i, end + 5);
    const fakeWindow = {
      document: { createElement: () => ({ canPlayType: (q) => (q.includes('opus') ? '' : 'maybe') }) },
    };
    // Runs only the shim — which is the bundle's OWN source, already the thing
    // under test. No caller-supplied text is interpolated.
    const picker = new Function('window', 'document', shimSrc + '\nreturn window.__isoAmbient;')(fakeWindow, fakeWindow.document);
    if (typeof picker !== 'function') return { pass: false, detail: 'the shim did not install window.__isoAmbient' };
    const opus = '/audio/ambient/AM_RAIN-QuietThunder.opus';
    const picked = picker(opus);
    if (picked === opus) {
      return { pass: false, detail: 'returned the .opus URL unchanged although the browser refuses opus — playback fails silently' };
    }
    if (!String(picked).endsWith('.m4a')) return { pass: false, detail: 'expected an .m4a fallback, got ' + picked };
    const passthrough = picker('https://example.com/x.opus');
    if (passthrough !== 'https://example.com/x.opus') {
      return { pass: false, detail: 'the shim rewrote a URL outside /audio/ambient/: ' + passthrough };
    }
    return { pass: true, detail: '' };
  },
);

/* ────────────────────────────────────────────────────────────────────────────
 * 5. AuthStorePatch
 * ──────────────────────────────────────────────────────────────────────────── */
console.log('\n5. AuthStorePatch — premium, demo gate, session mirror');

await withControl(
  'isPremium: a "free" plan still reports premium',
  'getPatchedAuthStoreBundle', 'assets/useAuthStore-Aw1au7RF.js',
  async (src, kind) => {
    // The predicate is a self-contained expression over the store snapshot, so
    // drive it exactly as the store would.
    const from = 'isPremium:()=>';
    const i = src.indexOf(from);
    if (i < 0) return { pass: false, detail: 'isPremium is not in the served bytes' };
    const expr = src.slice(i + from.length).match(/^[^{,}]*/)[0];
    if (expr.includes('planType')) {
      return { pass: false, detail: 'isPremium still consults planType: isPremium:()=>' + expr };
    }
    // Evaluate against a store snapshot whose planType is "free".
    const run = new Function('e', 'return (e, ()=>' + expr + ')');
    const freeState = { planType: 'free' };
    const result = run(freeState)();
    if (result !== true) {
      return { pass: false, detail: 'isPremium() returned ' + JSON.stringify(result) + ' for planType "free" — the premium gate leaks and every paid feature stays locked' };
    }
    return { pass: true, detail: '' };
  },
);

await withControl(
  'demo gate: the pathname/sessionStorage demo path cannot report demo mode',
  'getPatchedAuthStoreBundle', 'assets/useAuthStore-Aw1au7RF.js',
  async (src) => {
    const from = 'ce=()=>';
    const i = src.indexOf(from);
    if (i < 0) return { pass: false, detail: 'the demo gate predicate ce() is not in the served bytes' };
    // The predicate ends at the first `,` or `;` — the unpatched form contains
    // both inside its body (`?!1:...`), so slice to the next top-level one.
    const raw = src.slice(i + from.length);
    const end = raw.search(/[,;]/);
    const body = 'ce=()=>' + (end < 0 ? raw : raw.slice(0, end));
    if (body.includes('window.location.pathname') || body.includes('sessionStorage')) {
      return { pass: false, detail: 'the demo gate still reads location/sessionStorage: ' + body };
    }
    // Evaluate with a window that WOULD trip demo mode. `typeof window>"u"` and
    // the location/sessionStorage probes are all supplied, so the only way to
    // return false is a gate that genuinely ignores them.
    const win = { location: { pathname: '/community' }, sessionStorage: { getItem: () => '1' } };
    const run = new Function('window', 'Is', 'ut', 'return (' + body.replace(/^ce=\(\)=>/, '') + ')');
    const result = run(win, (p) => ['/community'].includes(p), 'iso-demo-mode');
    if (result !== false) {
      return { pass: false, detail: 'the demo gate returned ' + JSON.stringify(result) + ' on the demo path — demo fixtures would render as this install\'s real data' };
    }
    return { pass: true, detail: '' };
  },
);

await withControl(
  'session mirror: the token reaches plain localStorage, is read back, and is cleared on logout',
  'getPatchedAuthStoreBundle', 'assets/useAuthStore-Aw1au7RF.js',
  async (src) => {
    const KEY = 'isotope-auth-token';
    const from = 'vs={getItem:async a=>';
    const i = src.indexOf(from);
    if (i < 0) return { pass: false, detail: 'the storage adapter `vs` is not in the served bytes' };
    // The adapter is an object literal `vs={...}`; find its matching brace by
    // scanning. Substring-searching for `}}` truncates it, because the patched
    // bodies contain nested `try{}catch{}` blocks with their own braces.
    let depth = 0, end = -1;
    for (let k = i + 'vs='.length; k < src.length; k++) {
      if (src[k] === '{') depth++;
      else if (src[k] === '}') { depth--; if (depth === 0) { end = k; break; } }
    }
    if (end < 0) return { pass: false, detail: 'the adapter literal was not delimited' };
    const body = src.slice(i + 'vs='.length, end + 1);
    const ls = makeLocalStorage();
    const idb = makeIdb();
    const vs = new Function('M', 'localStorage', 'return ' + body + ';')(idb, ls);
    for (const m of ['getItem', 'setItem', 'removeItem']) {
      if (typeof vs[m] !== 'function') return { pass: false, detail: 'the lifted adapter has no ' + m };
    }

    await vs.setItem(KEY, JSON.stringify({ access_token: 'tok-abc' }));
    const mirrored = ls.getItem(KEY);
    if (!mirrored) {
      return { pass: false, detail: 'nothing was written to plain localStorage; restore-and-launch can never find the session and every reload lands on /auth' };
    }
    if (!String(mirrored).includes('tok-abc')) {
      return { pass: false, detail: 'the localStorage mirror does not carry the token: ' + mirrored };
    }
    idb._map.delete(KEY);
    const readBack = await vs.getItem(KEY);
    if (readBack !== mirrored) {
      return { pass: false, detail: 'the read path ignored the localStorage mirror; read=' + JSON.stringify(readBack) };
    }
    await vs.removeItem(KEY);
    if (ls.getItem(KEY) !== null) {
      return { pass: false, detail: 'removeItem left the token in localStorage — logout would not take effect' };
    }
    return { pass: true, detail: '' };
  },
);

/* ────────────────────────────────────────────────────────────────────────────
 * 6. AiStorePatch — a runtime-injected key must win over stored storage.
 * ──────────────────────────────────────────────────────────────────────────── */
console.log('\n6. AiStorePatch — runtime-injected API key is honoured');

await withControl(
  'getApiKey: window.__IK__ wins over stored storage',
  'getPatchedAiStore', 'assets/useAIStore-DRa7CkEN.js',
  async (src, kind) => {
    const from = 'async getApiKey(n){';
    const i = src.indexOf(from);
    if (i < 0) return { pass: false, detail: 'getApiKey not found in the served bytes' };
    const guard = 'window.__IK__';
    if (src.slice(i, i + 300).indexOf(guard) < 0) {
      return { pass: false, detail: 'the runtime-key prologue is not at the head of getApiKey. First 220 chars: ' + src.slice(i, i + 220) };
    }
    // The patched prologue is
    //   if(typeof window!=="undefined"&&window.__IK__&&window.__IK__[n])return window.__IK__[n];
    // Take exactly that statement so the assertion measures the GUARD and not
    // the storage fallback below it. The terminator must be the semicolon that
    // ENDS the return — not the first `;` in the range, which sits inside
    // `typeof window!=="undefined"` and truncates the guard into invalid JS
    // (that truncation is what made this assertion report a false product bug).
    const guardStart = src.indexOf('if(typeof window', i);
    const guardEnd = src.indexOf(';', src.indexOf('return window.__IK__[n]', guardStart));
    if (guardStart < 0 || guardEnd < 0 || guardEnd - guardStart > 300) {
      return { pass: false, detail: 'could not delimit the runtime-key guard: ' + src.slice(guardStart, guardStart + 220) };
    }
    const prologue = src.slice(i + from.length, guardEnd + 1);
    // The guard's own test object is the trigger: if it must fall through, this
    // throws, and storage is never consulted — which is what "wins over storage"
    // means.
    let storageTouched = false;
    const tripwire = new Proxy({}, {
      get(_t, prop) {
        if (prop === Symbol.toPrimitive || prop === Symbol.toStringTag) return () => '';
        storageTouched = true;
        throw new Error('storage was read before the runtime key was returned');
      },
    });
    const windowMock = { __IK__: { gemini: 'runtime-key' } };
    // Runs only the guard — the bundle's OWN source, already the thing under
    // test. No caller-supplied text is interpolated into the body.
    //
    // `window` must be a REAL GLOBAL, not a parameter. The guard opens with
    // `typeof window!=="undefined"`, which resolves against the global scope;
    // binding window as a formal parameter makes that check see the real
    // (absent) Node global, the guard silently falls through, and the
    // assertion reports a product bug that does not exist. In a browser window
    // is always a global, so the harness has to model it as one.
    // `n` is the provider key name getApiKey was called with ("gemini"); without
    // it the guard indexes __IK__[undefined] and correctly finds nothing.
    const priorWindow = globalThis.window;
    globalThis.window = windowMock;
    let value;
    try {
      const run = new Function('return (async n=>{' + prologue + '})(arguments[0])');
      value = await run('gemini');
    } finally {
      if (priorWindow === undefined) delete globalThis.window;
      else globalThis.window = priorWindow;
    }
    if (value !== 'runtime-key') {
      return { pass: false, detail: 'the guard returned ' + JSON.stringify(value) + ' instead of the injected key — every AI feature falls back to asking the user for their own' };
    }
    if (storageTouched) return { pass: false, detail: 'storage was consulted before the runtime key was returned' };
    return { pass: true, detail: '' };
  },
);

// And the fall-through, so the guard cannot pass by always refusing.
await withControl(
  'getApiKey: with no runtime key the stored value is still returned',
  'getPatchedAiStore', 'assets/useAIStore-DRa7CkEN.js',
  async (src) => {
    const from = 'async getApiKey(n){';
    const i = src.indexOf(from);
    const guardEnd = src.indexOf('return window.__IK__[n];', i);
    if (i < 0 || guardEnd < 0) return { pass: false, detail: 'the runtime-key prologue is absent' };
    // With no __IK__, execution must fall through to the storage read.
    const rest = src.slice(guardEnd + 'return window.__IK__[n];'.length, guardEnd + 200);
    if (!/const\s+e\s*=|await/.test(rest)) {
      return { pass: false, detail: 'the storage fallback after the guard is not the original code: ' + rest.slice(0, 120) };
    }
    return { pass: true, detail: '' };
  },
);

/* ──────────────────────────────────────────────────────────────────────────── */
console.log('');
if (useless.length) {
  console.log('USELESS ASSERTIONS (pass with AND without the patch — these guard nothing):');
  for (const u of useless) console.log('  - ' + u);
  console.log('');
}
try { fs.rmSync(BUNDLE_DIR, { recursive: true, force: true }); } catch (_) {}
if (failures) {
  console.log(failures + ' FAILURE(S)' + (useless.length ? ' (' + useless.length + ' toothless)' : ''));
  process.exit(1);
}
console.log('All bundle-patch behavioural checks passed.');
