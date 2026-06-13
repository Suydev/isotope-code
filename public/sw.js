/* Isotope local-server PWA service worker.
   Placeholders are replaced by server.mjs when /sw.js is served. */
'use strict';

const APP_VERSION = '__ISOTOPE_APP_VERSION__';
const APP_SHA = '__ISOTOPE_APP_SHA__';
const CACHE_PREFIX = 'isotope-local';
const SHELL_CACHE = CACHE_PREFIX + '-shell-' + APP_VERSION + '-' + APP_SHA.slice(0, 12);
const RUNTIME_CACHE = CACHE_PREFIX + '-runtime-' + APP_VERSION + '-' + APP_SHA.slice(0, 12);

const SHELL_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/logo-full.svg',
  '/logo-icon.svg',
  '/icons/icon.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/maskable-icon-512x512.png',
  '/auth-bridge.js',
  '/boot-recovery.js',
  '/restore-and-launch.js',
  '/sync/backup-normalizer.js',
  '/sync/local-data-adapter.js',
  '/ux-setup.js',
  '/focus-bg-import.js',
  '/update-checker.js',
  '/pwa-local.js',
  '/assets/index-CrO6t5EW.css',
  '/assets/vendor-katex-ASjZcBK0.css',
  '/assets/index-BPYJFSVW.js',
  '/assets/index-B45N-99N.js',
  '/assets/vendor-react-BfU3Zn2J.js',
  '/assets/vendor-router-CmoTwRnm.js',
  '/assets/vendor-query-Dco3bNuU.js',
  '/assets/vendor-supabase-CdzVlbop.js',
  '/assets/App-pJGjDiPw.js',
  '/assets/Onboarding-qvAqCBbb.js',
  '/assets/Dashboard-dypAV-0H.js',
  '/assets/Focus-BmgY-9vP.js',
  '/assets/Study-pAdAenIl.js',
  '/assets/Tasks-BYRFOrek.js',
  '/assets/Community-DIqF5406.js',
  '/assets/CommunityHub-gANxZssO.js',
  '/fonts/fonts.css'
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
  '/assets/useAIStore-B2cv1FZz.js',
  '/assets/App-pJGjDiPw.js',
  '/assets/Auth-Cw0VAaCZ.js',
  '/assets/Focus-BmgY-9vP.js',
  '/assets/Onboarding-qvAqCBbb.js',
  '/assets/SingleGroup-DU1IhoNK.js',
  '/assets/useLeaderboard-BpvH5FXA.js',
  '/assets/SettingsLayout-B4OgCkQ5.js',
  '/assets/useSyncStore-vWs_TdIc.js',
  '/assets/AppAccessGate-B975UtK7.js',
  '/assets/sessionSync-mloIEnTd.js',
  '/assets/useInvites-D9RLFwf8.js',
  '/assets/Community-DIqF5406.js',
  '/assets/CommunityHub-gANxZssO.js',
  '/assets/FocusStore-D5cRXSIr.js',
  '/assets/EventsCalendar-COHF8nOK.js',
  '/assets/PWAManager-DjIYufp2.js',
]);

function isApiLike(url) {
  return url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/__admin/') ||
    url.pathname.startsWith('/__auth/') ||
    url.pathname.startsWith('/__supa/') ||
    url.pathname.startsWith('/__isotope/');
}

function isCacheableAsset(request, url) {
  if (request.method !== 'GET' || url.origin !== self.location.origin) return false;
  if (isApiLike(url)) return false;
  return url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/fonts/') ||
    /\.(?:js|css|svg|png|jpg|jpeg|webp|woff2?|ttf|webmanifest)$/i.test(url.pathname);
}

function isRuntimeGlue(url) {
  return RUNTIME_GLUE_PATHS.has(url.pathname) ||
    RUNTIME_PATCHED_ASSET_PATHS.has(url.pathname) ||
    url.pathname.startsWith('/sync/');
}

async function cacheFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response && response.ok) cache.put(request, response.clone());
  return response;
}

async function networkFirstStatic(request) {
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
  const cached = await cache.match(request);
  if (cached) return cached;
  return fetch(request);
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
  return (await shell.match('/index.html')) ||
    (await shell.match('/offline.html')) ||
    new Response('Isotope is offline and the app shell is not cached yet.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    await cache.addAll(SHELL_URLS.map((url) => new Request(url, { cache: 'reload' })).filter(Boolean));
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
      } catch (e) {
        // Client may be detached or unreachable; silently continue
      }
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
  if (isApiLike(url)) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (isRuntimeGlue(url)) {
    event.respondWith(networkFirstStatic(request));
    return;
  }

  if (isCacheableAsset(request, url)) {
    event.respondWith(cacheFirst(request));
  }
});
