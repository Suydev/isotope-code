import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const indexHtml = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const restoreSource = fs.readFileSync(new URL('../public/restore-and-launch.js', import.meta.url), 'utf8');
const swSource = fs.readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8');
const pwaSource = fs.readFileSync(new URL('../public/pwa-local.js', import.meta.url), 'utf8');

assert.equal(
  (indexHtml.match(/vendor-react-BfU3Zn2J\.js/g) || []).length,
  1,
  'vendor React modulepreload must appear exactly once'
);
assert.match(indexHtml, /rel="modulepreload"[^>]+index-BPYJFSVW\.js/, 'entry bundle must be discovered from HTML');
assert.doesNotMatch(
  restoreSource,
  /link\.href\s*=\s*['"]\/assets\/vendor-react-BfU3Zn2J\.js/,
  'restore launcher must not append a duplicate vendor preload'
);
assert.ok(
  restoreSource.indexOf('launchApp();') < restoreSource.indexOf('await purgeStaleFakeData()'),
  'entry mount must start before asynchronous boot cleanup'
);
assert.match(restoreSource, /notifyMountedAppOfBootResolution\(\)/, 'early mount must be notified after boot routing');

const shellMatch = swSource.match(/const SHELL_URLS = \[([\s\S]*?)\];/);
assert.ok(shellMatch, 'service worker shell list missing');
const shellUrls = Array.from(shellMatch[1].matchAll(/'([^']+)'/g), (match) => match[1]);
assert.deepEqual(shellUrls, ['/offline.html'], 'first SW install should precache only the offline fallback');
assert.match(pwaSource, /hadControllerAtRegistration\s*=\s*!!navigator\.serviceWorker\.controller/);
assert.match(
  pwaSource,
  /if \(hadControllerAtRegistration && !swActivationReloadGuard/,
  'SW activation reload must require a prior controller'
);
assert.match(pwaSource, /serverCheckPromise/, 'server version probes must share an in-flight request');
assert.match(
  pwaSource,
  /checkServer\(\{ dispatchEvent: false \}\)/,
  'initial status check must not trigger update-checker duplicate preflight'
);

async function verifyFreshServiceWorkerInstall() {
  const serviceWorkerListeners = {};
  const documentListeners = {};
  const windowListeners = {};
  let versionFetches = 0;
  let reloads = 0;
  const statusElement = {
    classList: { add() {}, remove() {} },
    innerHTML: '',
    querySelector() { return null; },
    setAttribute() {},
  };
  const context = vm.createContext({
    CustomEvent: class CustomEvent {
      constructor(type, init) {
        this.type = type;
        this.detail = init?.detail;
      }
    },
    Date,
    Promise,
    clearInterval() {},
    clearTimeout,
    console,
    document: {
      body: { appendChild() {} },
      head: { appendChild() {} },
      hidden: false,
      readyState: 'complete',
      addEventListener(type, listener) { documentListeners[type] = listener; },
      createElement() { return statusElement; },
      getElementById(id) {
        if (id === '__iso_offline_status_css__') return {};
        if (id === '__iso_offline_status__') return statusElement;
        return null;
      },
    },
    fetch: async (url) => {
      if (url === '/api/version') versionFetches += 1;
      return { ok: true };
    },
    localStorage: createLocalStorage(),
    navigator: {
      onLine: true,
      serviceWorker: {
        controller: null,
        async register() { return { waiting: null }; },
        addEventListener(type, listener) { serviceWorkerListeners[type] = listener; },
      },
    },
    setInterval() { return 1; },
    setTimeout,
    window: {
      __ISO_BOOT_STATE__: {},
      addEventListener(type, listener) { windowListeners[type] = listener; },
      dispatchEvent() {},
      location: { reload() { reloads += 1; } },
    },
  });
  vm.runInContext(pwaSource, context);
  await new Promise((resolve) => setTimeout(resolve, 0));
  serviceWorkerListeners.message({
    data: { type: 'ISOTOPE_SW_READY', version: '3.3.8', sha: 'fresh' },
  });
  assert.equal(reloads, 0, 'fresh SW install must not reload an uncontrolled page');
  windowListeners.online();
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(versionFetches, 1, 'near-simultaneous version probes must be deduplicated');
}

function createLocalStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    get length() { return data.size; },
    key(index) { return Array.from(data.keys())[index] ?? null; },
    getItem(key) { return data.has(key) ? data.get(key) : null; },
    setItem(key, value) { data.set(key, String(value)); },
    removeItem(key) { data.delete(key); },
    snapshot() { return Object.fromEntries(data); },
  };
}

function session({ access, refresh, expiresAt, userId = 'user-1' }) {
  return JSON.stringify({
    access_token: access,
    refresh_token: refresh,
    expires_at: expiresAt,
    user: { id: userId },
  });
}

function loadRestoreHelpers(localStorage, fetchImpl = async () => {
  throw new Error('unexpected fetch');
}) {
  const helperSource = restoreSource.slice(0, restoreSource.indexOf('// ── Main'));
  const context = vm.createContext({
    AbortController,
    URL,
    atob,
    clearTimeout,
    console,
    fetch: fetchImpl,
    indexedDB: {},
    localStorage,
    setTimeout,
    window: {
      __ISO_SUPA_URL__: 'https://project.supabase.co',
      __ISO_ANON__: 'anon',
      dispatchEvent() {},
    },
  });
  vm.runInContext(`${helperSource}
globalThis.__restoreTest = {
  findSessionRaw,
  parseSession,
  refreshStoredSessionIfNeeded
};`, context);
  return context.__restoreTest;
}

await verifyFreshServiceWorkerInstall();

const nowSeconds = Math.floor(Date.now() / 1000);
{
  const staleLegacy = session({ access: 'legacy-old', refresh: 'rt-old', expiresAt: nowSeconds + 300 });
  const canonical = session({ access: 'canonical-new', refresh: 'rt-new', expiresAt: nowSeconds + 3600 });
  const storage = createLocalStorage({
    'isotope-auth-token': staleLegacy,
    'sb-project-auth-token': canonical,
    'isotope-last-session-raw': staleLegacy,
    'sb-unrelated-auth-token': session({
      access: 'unrelated-project',
      refresh: 'unrelated-refresh',
      expiresAt: nowSeconds + 10800,
      userId: 'other-user',
    }),
  });
  const helpers = loadRestoreHelpers(storage);
  assert.equal(helpers.parseSession(helpers.findSessionRaw()).access_token, 'canonical-new');
}

{
  const canonicalOld = session({ access: 'canonical-old', refresh: 'rt-old', expiresAt: nowSeconds + 300 });
  const legacyNew = session({ access: 'legacy-new', refresh: 'rt-new', expiresAt: nowSeconds + 7200 });
  const storage = createLocalStorage({
    'sb-project-auth-token': canonicalOld,
    'isotope-auth-token': legacyNew,
  });
  const helpers = loadRestoreHelpers(storage);
  assert.equal(
    helpers.parseSession(helpers.findSessionRaw()).access_token,
    'legacy-new',
    'freshest valid session should beat a stale canonical mirror'
  );
}

{
  const stale = JSON.parse(session({
    access: 'stale-access',
    refresh: 'missing-refresh',
    expiresAt: nowSeconds - 60,
  }));
  const staleRaw = JSON.stringify(stale);
  const newerRaw = session({
    access: 'newer-access',
    refresh: 'newer-refresh',
    expiresAt: nowSeconds + 7200,
  });
  const storage = createLocalStorage({
    'isotope-auth-token': staleRaw,
    'sb-project-auth-token': staleRaw,
    'sb-other-auth-token': newerRaw,
    'isotope-last-session-raw': staleRaw,
    'isotope-last-jwt': stale.access_token,
    'isotope-last-rt': stale.refresh_token,
  });
  const helpers = loadRestoreHelpers(storage, async () => ({
    ok: false,
    status: 400,
    async json() { return { error_code: 'refresh_token_not_found' }; },
  }));
  assert.equal(await helpers.refreshStoredSessionIfNeeded(stale), null);
  assert.equal(helpers.refreshStoredSessionIfNeeded.lastFailure, 'auth');
  const remaining = storage.snapshot();
  assert.equal(remaining['isotope-auth-token'], undefined);
  assert.equal(remaining['sb-project-auth-token'], undefined);
  assert.equal(remaining['isotope-last-session-raw'], undefined);
  assert.equal(remaining['isotope-last-jwt'], undefined);
  assert.equal(remaining['isotope-last-rt'], undefined);
  assert.equal(remaining['sb-other-auth-token'], newerRaw, 'unrelated newer session must be preserved');
}

console.log('PASS boot performance and session mirror verification');
