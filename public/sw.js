// ── Offline patches ─────────────────────────────────────────────────────────
// Intercept DiceBear avatar requests and serve locally-generated SVGs
self.addEventListener('fetch', function(event) {
  if (event.request.url.includes('api.dicebear.com')) {
    var url = new URL(event.request.url);
    var seed = url.searchParams.get('seed') || 'user';
    event.respondWith(new Response(generateAvatar(seed), {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=604800',
        'Access-Control-Allow-Origin': '*'
      }
    }));
    return;
  }
});

function generateAvatar(seed) {
  var hash = 0;
  for (var i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  var hue = Math.abs(hash % 360);
  var sat = 55 + Math.abs((hash >> 4) % 20);
  var bg = 'hsl(' + hue + ',' + sat + '%,82%)';
  var fg = 'hsl(' + hue + ',' + sat + '%,28%)';
  var letter = seed.charAt(0).toUpperCase();
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">'
    + '<circle cx="50" cy="50" r="50" fill="' + bg + '"/>'
    + '<text x="50" y="67" text-anchor="middle" font-size="46" '
    + 'font-family="Arial,sans-serif" fill="' + fg + '" font-weight="bold">'
    + letter + '</text></svg>';
}
// ── End offline patches ──────────────────────────────────────────────────────

if (!self.define) {
    let e, s = {};
    const n = (n, i) => (n = new URL(n + ".js", i).href, s[n] || new Promise(s => {
        if ("document" in self) {
            const e = document.createElement("script");
            e.src = n, e.onload = s, document.head.appendChild(e)
        } else e = n, importScripts(n), s()
    }).then(() => {
        let e = s[n];
        if (!e) throw new Error(`Module ${n} didn’t register its module`);
        return e
    }));
    self.define = (i, c) => {
        const o = e || ("document" in self ? document.currentScript.src : "") || location.href;
        if (s[o]) return;
        let a = {};
        const t = e => n(e, o),
            r = {
                module: {
                    uri: o
                },
                exports: a,
                require: t
            };
        s[o] = Promise.all(i.map(e => r[e] || t(e))).then(e => (c(...e), a))
    }
}
define(["./workbox-1d81fbea"], function(e) {
    "use strict";
    self.skipWaiting(), e.clientsClaim(), e.precacheAndRoute([{
        url: "manifest.webmanifest",
        revision: "eff06a9f41f4ccf1537c02d95a0c71b3"
    }, {
        url: "firebase-messaging-sw.js",
        revision: "99624eba3a96ba659521c8bd58960fea"
    }, {
        url: "boot-recovery.js",
        revision: "89e90dfa8643df782c254b917302b7ec"
    }, {
        url: "assets/workbox-window.prod.es5-BIl4cyR9.js",
        revision: null
    }, {
        url: "assets/index-CrO6t5EW.css",
        revision: null
    }, {
        url: "assets/index-BPYJFSVW.js",
        revision: null
    }, {
        url: "assets/index-B45N-99N.js",
        revision: null
    }, {
        url: "favicon.svg",
        revision: "435d22c8ea18ac71e67255bc61137741"
    }, {
        url: "logo-full.svg",
        revision: "3762adb267cb8939a9ce8f108c03f507"
    }, {
        url: "logo-icon.svg",
        revision: "435d22c8ea18ac71e67255bc61137741"
    }, {
        url: "robots.txt",
        revision: "3c7ca073d358bd5c79b0916467d1c159"
    }, {
        url: "icons/apple-touch-icon.png",
        revision: "cabfd0f3744a9567bdfc1c6e6007410f"
    }, {
        url: "icons/icon-192x192.png",
        revision: "6e36efc1e740f1e06d062f36c9414cc6"
    }, {
        url: "icons/icon-512x512.png",
        revision: "9379f90ebc76a0f00eab0335a2e4fecb"
    }, {
        url: "icons/icon.svg",
        revision: "435d22c8ea18ac71e67255bc61137741"
    }, {
        url: "icons/maskable-icon-512x512.png",
        revision: "9379f90ebc76a0f00eab0335a2e4fecb"
    }, {
        url: "screenshots/desktop-1.png",
        revision: "207c88de95d20f1682a95dd127d96ad4"
    }, {
        url: "screenshots/desktop-2.png",
        revision: "9c404ea02962a926f1654168c8189618"
    }, {
        url: "manifest.webmanifest",
        revision: "eff06a9f41f4ccf1537c02d95a0c71b3"
    }], {})
// Offline ambient sounds — served from cache when network is unavailable
e.registerRoute(
  ({url}) => url.pathname.startsWith('/sounds/'),
  new e.CacheFirst({
    cacheName: 'isotope-sounds-v1',
    plugins: [
      new e.ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 30 * 24 * 60 * 60 })
    ]
  })
);
e.cleanupOutdatedCaches(), e.registerRoute(({
        request: e,
        url: s
    }) => "navigate" === e.mode && s.origin === self.location.origin && offlineRouteAllowlist.some(e => e.test(s.pathname)) && !offlineRouteDenylist.some(e => e.test(s.pathname)), new e.NetworkFirst({
        cacheName: "html-navigation-cache",
        networkTimeoutSeconds: 3,
        plugins: [new e.ExpirationPlugin({
            maxEntries: 20,
            maxAgeSeconds: 86400
        }), new e.CacheableResponsePlugin({
            statuses: [200]
        })]
    }), "GET"), e.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new e.CacheFirst({
        cacheName: "google-fonts-cache",
        plugins: [new e.ExpirationPlugin({
            maxEntries: 10,
            maxAgeSeconds: 31536e3
        }), new e.CacheableResponsePlugin({
            statuses: [0, 200]
        })]
    }), "GET"), e.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new e.CacheFirst({
        cacheName: "gstatic-fonts-cache",
        plugins: [new e.ExpirationPlugin({
            maxEntries: 10,
            maxAgeSeconds: 31536e3
        }), new e.CacheableResponsePlugin({
            statuses: [0, 200]
        })]
    }), "GET"), e.registerRoute(/\.(?:woff2|woff|ttf|eot)$/i, new e.CacheFirst({
        cacheName: "font-assets-cache",
        plugins: [new e.ExpirationPlugin({
            maxEntries: 20,
            maxAgeSeconds: 2592e3
        }), new e.CacheableResponsePlugin({
            statuses: [0, 200]
        })]
    }), "GET"), e.registerRoute(({
        request: e,
        url: s
    }) => s.origin === self.location.origin && ("image" === e.destination || /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/i.test(s.pathname)), new e.CacheFirst({
        cacheName: "images-cache",
        plugins: [new e.ExpirationPlugin({
            maxEntries: 80,
            maxAgeSeconds: 1209600
        }), new e.CacheableResponsePlugin({
            statuses: [0, 200]
        })]
    }), "GET"), e.registerRoute(/\.(?:js|css)$/, new e.StaleWhileRevalidate({
        cacheName: "static-resources",
        plugins: [new e.ExpirationPlugin({
            maxEntries: 30,
            maxAgeSeconds: 604800
        }), new e.CacheableResponsePlugin({
            statuses: [0, 200]
        })]
    }), "GET")
});