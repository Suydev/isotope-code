/**
 * IsotopeAI Offline Patches
 * 1. Timer/focus state persistence across terminal restarts
 * 2. Community & payment route removal
 * 3. Liquid glass SVG filter injection
 * 4. Android PWA fixes
 */
(function () {
  'use strict';

  var DB_NAME = 'isotope_main';
  var STATE_ENDPOINT = '/api/state';
  var SNAPSHOT_INTERVAL = 4000; // save every 4 seconds

  // ── 1. Inject SVG Liquid Glass filter ──────────────────────────────────
  function injectLiquidGlassFilter() {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'liquid-glass-filters');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = [
      '<defs>',
      '  <filter id="liquid-glass" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">',
      '    <feTurbulence type="fractalNoise" baseFrequency="0.9 0.9" numOctaves="4" seed="3" result="noise"/>',
      '    <feColorMatrix type="saturate" values="8" in="noise" result="colorNoise"/>',
      '    <feComposite in="colorNoise" in2="SourceGraphic" operator="in" result="clipped"/>',
      '    <feBlend in="SourceGraphic" in2="clipped" mode="screen" result="blended"/>',
      '    <feGaussianBlur stdDeviation="0.5" in="blended" result="blurred"/>',
      '    <feDisplacementMap in="blurred" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G"/>',
      '  </filter>',
      '  <filter id="liquid-glass-subtle" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">',
      '    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" seed="5" result="noise"/>',
      '    <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G"/>',
      '  </filter>',
      '</defs>',
    ].join('');
    document.body.appendChild(svg);
  }

  // ── 2. Community & payment route blocking ───────────────────────────────
  function blockOfflineOnlyRoutes() {
    var BLOCKED = [
      '/community', '/invite', '/subscription', '/pricing',
      '/group', '/leaderboard', '/challenges', '/friends',
    ];

    function shouldBlock(path) {
      return BLOCKED.some(function (b) {
        return path === b || path.startsWith(b + '/') || path.startsWith(b + '?');
      });
    }

    function redirectIfBlocked() {
      var p = window.location.pathname;
      if (shouldBlock(p)) {
        window.history.replaceState(null, '', '/dashboard');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }

    redirectIfBlocked();

    var _pushState = history.pushState.bind(history);
    var _replaceState = history.replaceState.bind(history);

    history.pushState = function (state, title, url) {
      if (url && shouldBlock(String(url).replace(/\?.*$/, ''))) {
        return _pushState(state, title, '/dashboard');
      }
      return _pushState(state, title, url);
    };

    history.replaceState = function (state, title, url) {
      if (url && shouldBlock(String(url).replace(/\?.*$/, ''))) {
        return _replaceState(state, title, '/dashboard');
      }
      return _replaceState(state, title, url);
    };

    window.addEventListener('popstate', redirectIfBlocked);
  }

  // ── 3. IDB helper ───────────────────────────────────────────────────────
  function openDB() {
    return new Promise(function (resolve, reject) {
      var req = indexedDB.open(DB_NAME, 20);
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
      req.onupgradeneeded = function () {
        var db = req.result;
        var stores = ['timerState', 'kv', 'tasks', 'subjects', 'sessions', 'habits', 'exams'];
        stores.forEach(function (s) {
          if (!db.objectStoreNames.contains(s)) {
            db.createObjectStore(s, { keyPath: s === 'kv' ? 'key' : 'id' });
          }
        });
      };
    });
  }

  function idbGet(db, storeName, key) {
    return new Promise(function (resolve) {
      if (!db.objectStoreNames.contains(storeName)) { resolve(null); return; }
      var tx = db.transaction(storeName, 'readonly');
      var req = tx.objectStore(storeName).get(key);
      req.onsuccess = function () { resolve(req.result || null); };
      req.onerror = function () { resolve(null); };
    });
  }

  function idbPut(db, storeName, record) {
    return new Promise(function (resolve) {
      if (!db.objectStoreNames.contains(storeName)) { resolve(); return; }
      var tx = db.transaction(storeName, 'readwrite');
      tx.objectStore(storeName).put(record);
      tx.oncomplete = resolve;
      tx.onerror = resolve;
    });
  }

  // ── 4. Timer state persistence ──────────────────────────────────────────
  var _db = null;

  function getDB() {
    if (_db) return Promise.resolve(_db);
    return openDB().then(function (db) { _db = db; return db; });
  }

  // Restore timer state from server (survives Node.js restart)
  function restoreTimerFromServer() {
    return fetch(STATE_ENDPOINT)
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (serverState) {
        if (!serverState || !serverState.timerState) return;
        var ts = serverState.timerState;
        // If timer was running when server stopped, mark it paused now
        if (ts.isRunning || ts.status === 'running') {
          ts.isRunning = false;
          ts.status = 'paused';
          ts.pausedAt = ts.pausedAt || Date.now();
        }
        return getDB().then(function (db) {
          return idbGet(db, 'timerState', ts.id || 'primary').then(function (current) {
            // Only restore if the server snapshot is newer or IDB has nothing
            var serverTs = ts.savedAt || ts.updatedAt || 0;
            var idbTs = (current && (current.savedAt || current.updatedAt)) || 0;
            if (!current || serverTs >= idbTs) {
              return idbPut(db, 'timerState', Object.assign({}, ts, { id: ts.id || 'primary' }));
            }
          });
        });
      })
      .catch(function () { /* server not available yet, fine */ });
  }

  // Save timer state snapshot to server
  function saveTimerSnapshot() {
    return getDB()
      .then(function (db) { return idbGet(db, 'timerState', 'primary'); })
      .then(function (ts) {
        if (!ts) return;
        var payload = Object.assign({}, ts, { savedAt: Date.now() });
        return fetch(STATE_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ timerState: payload }),
        }).catch(function () {});
      })
      .catch(function () {});
  }

  // Also save localStorage keys that matter
  function saveLocalStorageSnapshot() {
    var KEYS = ['isotope-auth', 'isotope-onboarding', 'isotope_intro_seen', 'isotope_restore_done_v1'];
    var snap = {};
    KEYS.forEach(function (k) {
      var v = localStorage.getItem(k);
      if (v) snap[k] = v;
    });
    if (Object.keys(snap).length === 0) return;
    fetch(STATE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ localStorage: snap }),
    }).catch(function () {});
  }

  function restoreLocalStorageFromServer(serverState) {
    if (!serverState || !serverState.localStorage) return;
    var snap = serverState.localStorage;
    Object.keys(snap).forEach(function (k) {
      if (!localStorage.getItem(k)) {
        localStorage.setItem(k, snap[k]);
      }
    });
  }

  // ── 5. Hide payment / premium UI elements ───────────────────────────────
  function injectHideStyles() {
    var style = document.createElement('style');
    style.id = 'isotope-offline-hide';
    style.textContent = [
      /* hide upgrade/premium CTAs */
      '[class*="premium-gate"],[class*="PremiumGate"],[data-testid*="premium"]{display:none!important}',
      '[class*="upgrade-banner"],[class*="UpgradeBanner"]{display:none!important}',
      /* hide community nav items */
      'a[href*="/community"],a[href*="/invite"],a[href*="/leaderboard"],a[href*="/group"]{display:none!important}',
      /* hide subscription page elements */
      'a[href*="/subscription"],a[href*="/pricing"]{display:none!important}',
    ].join('\n');
    document.head.appendChild(style);
  }

  // ── 6. Android / PWA fixes ──────────────────────────────────────────────
  function applyAndroidFixes() {
    // Fix: 100vh on mobile browsers includes address bar
    function setVh() {
      var vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', vh + 'px');
    }
    setVh();
    window.addEventListener('resize', setVh);

    // Fix: Prevent double-tap zoom on buttons/links
    var lastTouch = 0;
    document.addEventListener('touchend', function (e) {
      var now = Date.now();
      if (now - lastTouch < 300) {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' ||
            e.target.closest('button') || e.target.closest('a')) {
          e.preventDefault();
        }
      }
      lastTouch = now;
    }, { passive: false });

    // Fix: smooth scrolling for momentum on iOS/Android
    document.documentElement.style.webkitOverflowScrolling = 'touch';

    // Fix: status bar safe area (notch support)
    var metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport) {
      metaViewport.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover';
    }
  }

  // ── 7. Server online guard — pause timer when server stops ──────────────
  function startHeartbeat() {
    var wasDown = false;
    setInterval(function () {
      fetch('/api/ping').then(function (r) {
        if (!r.ok) throw new Error('down');
        if (wasDown) {
          wasDown = false;
          // Server came back — restore state
          restoreTimerFromServer();
        }
      }).catch(function () {
        if (!wasDown) {
          wasDown = true;
          // Server went down — force-pause the timer via IDB
          getDB().then(function (db) {
            return idbGet(db, 'timerState', 'primary').then(function (ts) {
              if (!ts) return;
              if (ts.isRunning || ts.status === 'running') {
                return idbPut(db, 'timerState', Object.assign({}, ts, {
                  isRunning: false,
                  status: 'paused',
                  pausedAt: Date.now(),
                  savedAt: Date.now(),
                }));
              }
            });
          }).catch(function () {});
        }
      });
    }, 10000); // check every 10s
  }

  // ── Boot sequence ────────────────────────────────────────────────────────
  function boot() {
    injectHideStyles();
    blockOfflineOnlyRoutes();
    applyAndroidFixes();

    // Restore localStorage from server first (for fresh installs)
    fetch(STATE_ENDPOINT)
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (serverState) {
        restoreLocalStorageFromServer(serverState);
        return restoreTimerFromServer();
      })
      .catch(function () {})
      .finally(function () {
        // Start periodic save
        setInterval(saveTimerSnapshot, SNAPSHOT_INTERVAL);
        setInterval(saveLocalStorageSnapshot, 15000);
        startHeartbeat();
      });

    // Inject SVG filter after DOM is ready
    if (document.body) {
      injectLiquidGlassFilter();
    } else {
      document.addEventListener('DOMContentLoaded', injectLiquidGlassFilter);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
