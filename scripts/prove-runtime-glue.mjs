import assert from 'node:assert/strict';

const base = process.env.RUNTIME_PROOF_BASE || 'http://127.0.0.1:3000';

async function text(pathname) {
  const response = await fetch(base + pathname, { cache: 'no-store' });
  assert.equal(response.ok, true, `${pathname} returned HTTP ${response.status}`);
  return response.text();
}

async function head(pathname) {
  const response = await fetch(base + pathname, { method: 'HEAD', cache: 'no-store' });
  assert.equal(response.ok, true, `${pathname} HEAD returned HTTP ${response.status}`);
  return response.headers;
}

const rootHtml = await text('/');
assert.match(rootHtml, /\/auth-bridge\.js\?v=5/, 'root HTML does not include auth-bridge.js?v=5');
assert.ok(
  rootHtml.indexOf('/auth-bridge.js?v=5') < rootHtml.indexOf('/restore-and-launch.js'),
  'auth bridge must load before restore-and-launch.js'
);
assert.match(
  rootHtml,
  /last_snapshot_at:\s*snapshotAt/,
  'download/import runtime must record last_snapshot_at so sync UI does not remain pending'
);
assert.match(rootHtml, /window\.__isoGetValidJwt\s*=\s*getValidJwt/, 'runtime must expose canonical Supabase JWT getter');
assert.match(rootHtml, /window\.__isoClearAuthSession\s*=\s*clearStoredSession/, 'runtime must expose auth-session cleanup');

const bridge = await text('/auth-bridge.js');
assert.match(bridge, /window\.__isoLogin\s*=/, 'auth bridge does not define window.__isoLogin');
assert.match(bridge, /window\.__isoUp\s*=/, 'auth bridge does not define window.__isoUp');

// Manual-sync runtime path now lives in the SERVED (patched) useSyncStore
// bundle via server.mjs SyncStorePatch — see assertions below on syncStore.
// The App bundle carries no manual-sync markers anymore.

const syncStore = await text('/assets/useSyncStore-Di0wBMnH.js');
assert.match(syncStore, /header_manual_sync/, 'sync store must route header sync through runtime manual cloud sync');
assert.match(syncStore, /header_download_cloud_data/, 'sync store must route header download through runtime cloud download/import');
// Session/JWT validation moved upstream: triggerSync guards on isAuthenticated
// from the auth store, and __isoRunManualCloudSync (injected runtime) validates
// the JWT via __isoGetValidJwt. Assert the guard survived the build:
assert.match(
  syncStore,
  /triggerSync:async\(\)\=>\{const t=u\.getState\(\),\{userId:a,isAuthenticated:s\}=t,r=t\.isPremium\(\);if\(!s\|\|!a\|\|!r\)return;/,
  'sync store triggerSync must bail without an authenticated premium user'
);
assert.doesNotMatch(
  syncStore,
  /const o = await n\(\);\s*try \{\s*typeof window < "u" && typeof window\.__isoRunManualCloudSync/,
  'header sync must not import old table sync engine before runtime Storage sync'
);

const settingsBundle = await text('/assets/SettingsLayout-DkuooNHv.js');
assert.doesNotMatch(
  settingsBundle,
  /__isoSnapshotOk\s*=\s*__isoMeta\.last_sync_status === "synced" && !!__isoMeta\.last_snapshot_at/,
  'settings sync status must not show green Pending only because legacy last_snapshot_at is missing'
);
assert.match(
  settingsBundle,
  /__isoSnapshotOk\s*=\s*__isoMeta\.last_sync_status\s*===\s*"synced"\s*&&\s*!__isoMeta\.last_error/,
  'settings sync status must trust synced metadata when no error is recorded'
);

const authBridgeCache = (await head('/auth-bridge.js')).get('cache-control') || '';
const restoreCache = (await head('/restore-and-launch.js')).get('cache-control') || '';
const appBundleCache = (await head('/assets/App-CQ9mV4wu.js')).get('cache-control') || '';
const syncStoreCache = (await head('/assets/useSyncStore-Di0wBMnH.js')).get('cache-control') || '';
const settingsCache = (await head('/assets/SettingsLayout-DkuooNHv.js')).get('cache-control') || '';
const swHeaders = await head('/sw.js');
const swCache = swHeaders.get('cache-control') || '';
const swAllowed = swHeaders.get('service-worker-allowed') || '';
const assetCache = (await head('/assets/index-LkPKl--4.css')).get('cache-control') || '';

assert.match(authBridgeCache, /no-store/, 'auth-bridge.js must not be immutable cached');
assert.match(restoreCache, /no-store/, 'restore-and-launch.js must not be immutable cached');
assert.match(appBundleCache, /no-store/, 'runtime-patched App bundle must not be immutable cached');
assert.match(syncStoreCache, /no-store/, 'runtime-patched sync store bundle must not be immutable cached');
assert.match(settingsCache, /no-store/, 'runtime-patched Settings bundle must not be immutable cached');
assert.match(swCache, /no-store/, 'sw.js must not be immutable cached');
assert.equal(swAllowed, '/', 'sw.js must set Service-Worker-Allowed: /');
assert.match(assetCache, /immutable/, 'hashed assets should remain immutable');

const sw = await text('/sw.js');
assert.match(sw, /isRuntimeGlue/, 'service worker must classify runtime glue');
assert.match(sw, /networkFirstStatic/, 'service worker must use network-first for runtime glue');

console.log('PASS runtime glue load order and cache headers');
