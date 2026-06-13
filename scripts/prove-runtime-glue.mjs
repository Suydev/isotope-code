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

const appBundle = await text('/assets/App-pJGjDiPw.js');
assert.match(appBundle, /header_manual_sync|manual_full_sync/, 'served app bundle should expose manual sync runtime path');
assert.doesNotMatch(
  appBundle,
  /s && await this\.pushProfile\(e, s\), await \(window\.__isoRunManualCloudSync/,
  'manual sync must not block Storage backup sync behind profile-table push'
);

const syncStore = await text('/assets/useSyncStore-vWs_TdIc.js');
assert.match(syncStore, /header_manual_sync/, 'sync store must route header sync through runtime manual cloud sync');
assert.match(syncStore, /header_download_cloud_data/, 'sync store must route header download through runtime cloud download/import');
assert.match(syncStore, /Cloud session missing\. Log in again before syncing\./, 'sync store must require a real Supabase session');
assert.match(syncStore, /__isoGetValidJwt/, 'sync store must validate the runtime Supabase JWT before syncing');
assert.doesNotMatch(
  syncStore,
  /const o = await n\(\);\s*try \{\s*typeof window < "u" && typeof window\.__isoRunManualCloudSync/,
  'header sync must not import old table sync engine before runtime Storage sync'
);

const settingsBundle = await text('/assets/SettingsLayout-B4OgCkQ5.js');
assert.doesNotMatch(
  settingsBundle,
  /__isoSnapshotOk = __isoMeta\.last_sync_status === "synced" && !!__isoMeta\.last_snapshot_at/,
  'settings sync status must not show green Pending only because legacy last_snapshot_at is missing'
);
assert.match(
  settingsBundle,
  /__isoSnapshotOk = __isoMeta\.last_sync_status === "synced" && !__isoMeta\.last_error/,
  'settings sync status must trust synced metadata when no error is recorded'
);

const authBridgeCache = (await head('/auth-bridge.js')).get('cache-control') || '';
const restoreCache = (await head('/restore-and-launch.js')).get('cache-control') || '';
const appBundleCache = (await head('/assets/App-pJGjDiPw.js')).get('cache-control') || '';
const syncStoreCache = (await head('/assets/useSyncStore-vWs_TdIc.js')).get('cache-control') || '';
const settingsCache = (await head('/assets/SettingsLayout-B4OgCkQ5.js')).get('cache-control') || '';
const swHeaders = await head('/sw.js');
const swCache = swHeaders.get('cache-control') || '';
const swAllowed = swHeaders.get('service-worker-allowed') || '';
const assetCache = (await head('/assets/index-CrO6t5EW.css')).get('cache-control') || '';

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
