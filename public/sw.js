/* Isotope local-server PWA service worker.
   Placeholders are replaced by server.mjs when /sw.js is served. */
'use strict';

const APP_VERSION = '__ISOTOPE_APP_VERSION__';
const APP_SHA = '__ISOTOPE_APP_SHA__';
const CACHE_PREFIX = 'isotope-local';
const SHELL_CACHE = CACHE_PREFIX + '-shell-' + APP_VERSION + '-' + APP_SHA.slice(0, 12);
const RUNTIME_CACHE = CACHE_PREFIX + '-runtime-' + APP_VERSION + '-' + APP_SHA.slice(0, 12);

// CRITICAL: Only files needed for first paint. Everything else loads on demand.
const SHELL_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.webmanifest',
  '/icons/icon.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/maskable-icon-512x512.png',
  '/auth-bridge.js',
  '/fonts/fonts.css',
  '/assets/index-LkPKl--4.css',
  '/assets/vendor-react-BWKHxYQy.js',
  '/assets/index-D1Y5F8Lk.js',
  '/assets/App-CQ9mV4wu.js',
];

// LAZY: Route-specific bundles cached on first navigation (not upfront)
const LAZY_CACHE_URLS = [
  '/assets/vendor-katex-ASjZcBK0.css',
  '/assets/vendor-katex-BSXZKQS3.js',
  '/assets/Dashboard-Dzf-IC_a.js',
  '/assets/Focus-B4gLsWoP.js',
  '/assets/Study-BXfkiHvM.js',
  '/assets/Tasks-CZU6K32u.js',
  '/assets/Community-CEnEgsrd.js',
  '/assets/communityApi-Ccw5N_9O.js',
  '/assets/vendor-router-C2sFoTjv.js',
  '/assets/vendor-query-BnZPC5Kk.js',
  '/assets/vendor-supabase-D_TSSuUW.js',
  '/assets/useAuthStore-Aw1au7RF.js',
  '/assets/useSyncStore-Di0wBMnH.js',
  '/assets/Onboarding-C0svxOgT.js',
  '/assets/Auth-D0Y8CB1f.js',
  '/assets/community-BTpNdnFf.css',
  '/boot-recovery.js',
  '/restore-and-launch.js',
  '/sync/backup-normalizer.js',
  '/sync/local-data-adapter.js',
  '/ux-setup.js',
  '/focus-bg-import.js',
  '/update-checker.js',
  '/pwa-local.js',
];

const RUNTIME_GLUE_PATHS = new Set([
  '/',
  '/index.html',
  '/auth-bridge.js',
  '/restore-and-launch.js',
  '/pwa-local.js',
  '/boot-recovery.js',
  '/ux-setup.js',
  '/focus-bg-import.js',
  '/update-checker.js',
  '/sw.js',
  '/manifest.webmanifest',
]);

const RUNTIME_PATCHED_ASSET_PATHS = new Set([
  '/assets/useAIStore-DRa7CkEN.js',
  '/assets/App-CQ9mV4wu.js',
  '/assets/Auth-D0Y8CB1f.js',
  '/assets/Focus-B4gLsWoP.js',
  '/assets/Onboarding-C0svxOgT.js',
  '/assets/SingleGroup-DU1IhoNK.js',
  '/assets/useLeaderboard-BpvH5FXA.js',
  '/assets/SettingsLayout-DkuooNHv.js',
  '/assets/useSyncStore-Di0wBMnH.js',
  '/assets/AppAccessGate-DzNuNpuU.js',
  '/assets/sessionSync-mloIEnTd.js',
  '/assets/useInvites-D9RLFwf8.js',
  '/assets/Community-CEnEgsrd.js',
  '/assets/communityApi-Ccw5N_9O.js',
  '/assets/CommunityHub-gANxZssO.js',
  '/assets/FocusStore-D5cRXSIr.js',
  '/assets/EventsCalendar-COHF8nOK.js',
  '/assets/usePWA-BOujtGOv.js',
  '/assets/Dashboard-Dzf-IC_a.js',
  '/assets/useAuthStore-Aw1au7RF.js',
  '/assets/marketing-core-DzcTqL0l.js',
  '/assets/index-D1Y5F8Lk.js',
]);

function isApiLike(url) {
  return url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/__admin/') ||
    url.pathname.startsWith('/__auth/') ||
    url.pathname.startsWith('/__supa/') ||
    url.pathname.startsWith('/__isotope/');
}

function isRuntimeGlue(url) {
  return RUNTIME_GLUE_PATHS.has(url.pathname) ||
    RUNTIME_PATCHED_ASSET_PATHS.has(url.pathname) ||
    url.pathname.startsWith('/sync/');
}

async function matchAcrossCaches(request, url) {
  for (const name of [RUNTIME_CACHE, SHELL_CACHE]) {
    let cache;
    try { cache = await caches.open(name); } catch (_) { continue; }
    try {
      const exact = await cache.match(request);
      if (exact) return exact;
    } catch (_) {}
    try {
      const pathOnly = await cache.match(new Request(url.pathname));
      if (pathOnly) return pathOnly;
    } catch (_) {}
  }
  return null;
}

async function cacheFirst(request, url) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await matchAcrossCaches(request, url);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch {}
  return new Response('Offline', {
    status: 503,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}

async function networkFirstStatic(request, url) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const freshRequest = new Request(request.url, {
      method: 'GET',
      headers: request.headers,
      credentials: request.credentials,
      redirect: request.redirect,
      cache: 'no-store',
    });
    const response = await fetch(freshRequest);
    if (response && response.ok) await cache.put(request, response.clone());
    return response;
  } catch {}
  const cached = await matchAcrossCaches(request, url);
  if (cached) return cached;
  return new Response('Offline', {
    status: 503,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}

async function networkFirstNavigation(request) {
  const shell = await caches.open(SHELL_CACHE);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      await shell.put('/index.html', response.clone());
      return response;
    }
  } catch {}
  const cached = await shell.match('/index.html');
  if (cached) {
    return new Response(cached.body, {
      status: cached.status,
      statusText: cached.statusText,
      headers: Object.fromEntries(
        [...cached.headers].filter(([k]) => k.toLowerCase() !== 'content-encoding')
      )
    });
  }
  const offline = await caches.match('/offline.html');
  if (offline) return offline;
  return new Response('Isotope is offline and the app shell is not cached yet.', {
    status: 503,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    // Precache the shell plus the lazy route list. Failures are tolerated:
    // stale hashed entries simply 404 and are skipped, while anything that
    // lands makes the app usable offline sooner.
    await Promise.allSettled(
      [...SHELL_URLS, ...LAZY_CACHE_URLS].map(async (url) => {
        try {
          const req = new Request(url, { cache: 'reload' });
          const resp = await fetch(req);
          if (resp.ok) await cache.put(url, resp);
        } catch (_) {}
      })
    );
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => {
      if (key.startsWith(CACHE_PREFIX) && key !== SHELL_CACHE && key !== RUNTIME_CACHE) {
        return caches.delete(key);
      }
      return Promise.resolve(false);
    }));
    await self.clients.claim();
    const clients = await self.clients.matchAll({ type: 'window' });
    for (const client of clients) {
      try {
        client.postMessage({ type: 'ISOTOPE_SW_READY', version: APP_VERSION, sha: APP_SHA });
      } catch (e) {}
    }
  })());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data && event.data.type === 'GET_VERSION') {
    event.source && event.source.postMessage({ type: 'ISOTOPE_SW_VERSION', version: APP_VERSION, sha: APP_SHA });
  }
  if (event.data && event.data.type === 'CLEAR_ISOTOPE_CACHES') {
    event.waitUntil((async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key.startsWith(CACHE_PREFIX)).map((key) => caches.delete(key)));
      event.source && event.source.postMessage({ type: 'ISOTOPE_CACHES_CLEARED' });
    })());
  }
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  let url;
  try { url = new URL(request.url); } catch { return; }
  if (url.origin !== self.location.origin) return;
  if (url.pathname === '/api/version' || url.pathname === '/api/health') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(new Request(request.url, { cache: 'no-store', headers: request.headers }));
        if (fresh && fresh.ok) {
          const cache = await caches.open(RUNTIME_CACHE);
          cache.put(request, fresh.clone());
          return fresh;
        }
      } catch (_) {}
      const cached = await matchAcrossCaches(request, url);
      if (cached) return cached;
      return new Response(JSON.stringify({ version: APP_VERSION, sha: APP_SHA, offline: true }), {
        status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
      });
    })());
    return;
  }
  if (url.pathname.startsWith('/api/') ||
      url.pathname.startsWith('/__admin/') ||
      url.pathname.startsWith('/__auth/') ||
      url.pathname.startsWith('/__supa/') ||
      url.pathname.startsWith('/__isotope/')) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  // Versioned build output, fonts, and icons are content-addressed — cache
  // them the first time they are fetched so every previously visited route
  // keeps working offline. Do not gate on a hardcoded hash list: any chunk
  // missing from such a list would bypass the SW and fail raw-network when
  // the device is offline.
  if (url.pathname.startsWith('/assets/') ||
      url.pathname.startsWith('/fonts/') ||
      url.pathname.startsWith('/icons/')) {
    event.respondWith(cacheFirst(request, url));
    return;
  }

  // Runtime glue and any other same-origin static file: prefer fresh from the
  // local server, fall back to cache when it cannot be reached.
  event.respondWith(networkFirstStatic(request, url));
});