/**
 * IsotopeAI Android Native Bridge v1.0
 *
 * Intercepts fetch() calls to:
 *   /__auth/*        → Direct Supabase JS client calls
 *   /__supa/*        → Passthrough to Supabase base URL
 *   /api/version     → Local version response
 *   /api/health      → Local health response
 *   /api/ai-config   → Local AI config response
 *   /__isotope/ping  → Local pong response
 *
 * Also disables the server-check loop in pwa-local.js and
 * suppresses "local server unavailable" UI in Android context.
 */
(function () {
  'use strict';

  // ── Constants ───────────────────────────────────────────────────────────────
  var APP_VERSION    = '3.3.9';
  var SUPA_URL       = 'https://vteqquoqvksshmfhuepu.supabase.co';
  var SUPA_ANON_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0ZXFxdW9xdmtzc2htZmh1ZXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwODU2NzUsImV4cCI6MjA5NTY2MTY3NX0.ZkRislOhJRQUjVa1y5ixu-xBhlgkXWWyZKI_CClWj64';

  // ── Android detection ───────────────────────────────────────────────────────
  var isAndroid = (
    typeof window !== 'undefined' &&
    (
      typeof window.Capacitor !== 'undefined' ||
      /Android/i.test(navigator.userAgent) ||
      window.location.protocol === 'capacitor:'
    )
  );

  if (!isAndroid) return; // Only intercept in Capacitor/Android context

  // ── Inject global config so existing scripts see correct values ─────────────
  window.__ISO_SUPA_URL__  = SUPA_URL;
  window.__ISO_ANON__      = SUPA_ANON_KEY;
  window.__ISO_IS_ANDROID__ = true;
  window.__ISO_VERSION__   = APP_VERSION;
  window.__ISO_INVITE_DOMAIN__ = 'isotopeai:/';

  // Canonical invite URL generator — never uses window.location.origin
  window.__isoGetInviteUrl = function (code, type) {
    var clean = String(code || '').trim();
    if (!clean) return null;
    if (type === 'app') return 'isotopeai://invite/' + clean;
    return (window.__ISO_INVITE_DOMAIN__ || 'https://isotopeai.in') + '/invite/' + clean;
  };

  // Seed current user ID from persisted session (updated on login)
  window.__ISO_CURRENT_USER_ID__ = (function () {
    try {
      var raw = localStorage.getItem('isotope-auth-token') ||
                localStorage.getItem('sb-vteqquoqvksshmfhuepu-auth-token');
      if (!raw) return '';
      var p = JSON.parse(raw);
      return (p && p.user && p.user.id) || '';
    } catch (e) { return ''; }
  })();

  // Signal to pwa-local.js that server is "online" (no node server needed)
  window.__ISO_ANDROID_NATIVE__ = true;
  window.__ISO_ANDROID_ONLINE__ = true;

  // ── Runtime error capture — logs to Logcat via console.error ────────────
  window.__ISO_LAST_RUNTIME_ERROR__ = null;
  (function installErrorCapture() {
    var _prevOnerror = window.onerror;
    window.onerror = function (msg, src, line, col, err) {
      var entry = {
        message: String(msg || ''),
        source: String(src || ''),
        line: line || 0,
        col: col || 0,
        stack: err && err.stack ? String(err.stack) : '',
        ts: Date.now()
      };
      window.__ISO_LAST_RUNTIME_ERROR__ = entry;
      try {
        console.error('[IsotopeAndroidRuntime] JS Error: ' + entry.message +
          ' @ ' + entry.source + ':' + entry.line + '\n' + entry.stack);
      } catch (e) {}
      if (typeof _prevOnerror === 'function') _prevOnerror.apply(this, arguments);
      return false; // allow browser default handling
    };
    var _prevUnhandled = window.onunhandledrejection;
    window.onunhandledrejection = function (event) {
      var reason = event && event.reason;
      var entry = {
        message: reason ? String(reason.message || reason) : 'Unhandled promise rejection',
        stack: reason && reason.stack ? String(reason.stack) : '',
        ts: Date.now()
      };
      window.__ISO_LAST_RUNTIME_ERROR__ = entry;
      try {
        console.error('[IsotopeAndroidRuntime] Unhandled rejection: ' + entry.message +
          '\n' + entry.stack);
      } catch (e) {}
      if (typeof _prevUnhandled === 'function') _prevUnhandled.apply(this, arguments);
    };
  })();

  // ── Android tablet layout safety layer ──────────────────────────────────
  // Adds 'iso-android' class to <html> and injects targeted CSS fixes.
  // All DOM calls fully guarded — safe in Node.js test environments.
  (function injectAndroidLayoutLayer() {
    var styleId = '__iso_android_layout_css';
    function inject() {
      if (typeof document === 'undefined') return;
      // Guard: getElementById may not exist in test mocks
      if (typeof document.getElementById === 'function' && document.getElementById(styleId)) return;
      // Guard: classList may not exist on documentElement mock
      var de = document.documentElement;
      if (de && de.classList && typeof de.classList.add === 'function') {
        de.classList.add('iso-android');
      }
      // Guard: createElement / head required to inject style
      if (typeof document.createElement !== 'function' || !document.head) return;
      var s = document.createElement('style');
      s.id = styleId;
      s.textContent = [
        'html.iso-android [role="dialog"]{max-width:min(92vw,480px)!important;margin:auto!important;}',
        'html.iso-android [data-radix-popper-content-wrapper]{max-width:min(92vw,480px)!important;}',
        'html.iso-android [data-notification-panel]{max-height:min(24rem,calc(100dvh - 9rem))!important;overflow-y:auto!important;width:min(20rem,calc(100vw - 1.5rem))!important;right:0!important;left:auto!important;}',
        'html.iso-android [class*="podium"],[class*="leaderboard"]{max-width:100%!important;overflow-x:hidden!important;}',
        'html.iso-android [class*="avatar-stack"] [class*="skeleton"]:empty,html.iso-android [class*="avatar-stack"] div:empty{display:none!important;}',
        'html.iso-android button[class*="p-2"]{min-width:44px!important;min-height:44px!important;}',
        'html.iso-android [class*="max-h-\\[min\\(24rem"]{max-height:min(24rem,calc(100dvh - 9rem))!important;}',
      ].join('\n');
      document.head.appendChild(s);
    }
    // Inject immediately if DOM is ready, otherwise wait for DOMContentLoaded
    if (typeof document !== 'undefined') {
      if (document.head) {
        try { inject(); } catch (e) {}
      } else if (typeof document.addEventListener === 'function') {
        document.addEventListener('DOMContentLoaded', function () {
          try { inject(); } catch (e) {}
        }, { once: true });
      }
    }
  })();

  // ── Scroll enabler for long-content pages (Privacy, About, Settings, etc.) ──
  // Android WebView inherits the app's `overflow: hidden` on html/body, which
  // blocks scrolling on the landing-page static routes. This IIFE listens for
  // navigation and forces native scroll on those pages.
  (function installScrollEnabler() {
    // Guard: bail out in non-browser environments (Node.js test harness, SSR).
    // window.history may not exist even when window does (e.g. vm sandbox).
    if (typeof window === 'undefined' || typeof window.history === 'undefined') return;
    // pushState/replaceState may not exist in test harnesses (Node.js vm sandbox).
    // Skip all install including history patching in that case — safe because
    // Android WebView always has a full History API.
    if (typeof window.history.pushState !== 'function' ||
        typeof window.history.replaceState !== 'function') {
      return;
    }
    // One-time install guard — safe to call the outer IIFE multiple times.
    if (window.__isoScrollEnablerInstalled) return;
    window.__isoScrollEnablerInstalled = true;

    var SCROLLABLE_PATHS = [
      '/privacy', '/about', '/features', '/pricing', '/faq',
      '/terms', '/contact', '/blog'
    ];

    function needsScroll(path) {
      if (!path) return false;
      var p = String(path).toLowerCase().split('?')[0];
      for (var i = 0; i < SCROLLABLE_PATHS.length; i++) {
        if (p === SCROLLABLE_PATHS[i] || p.indexOf(SCROLLABLE_PATHS[i] + '/') === 0) {
          return true;
        }
      }
      return false;
    }

    function applyScrollFix() {
      try {
        var path = window.location.pathname;
        if (!needsScroll(path)) return;
        var style = document.getElementById('__iso_scroll_fix__');
        if (!style) {
          style = document.createElement('style');
          style.id = '__iso_scroll_fix__';
          document.head.appendChild(style);
        }
        style.textContent = [
          'html, body { overflow-y: auto !important; overflow-x: hidden !important; height: auto !important; min-height: 100%; }',
          '#root, [data-scroll-fix] { overflow-y: auto !important; height: auto !important; -webkit-overflow-scrolling: touch !important; }',
          '.landing-content, main, article, section { overflow-y: visible !important; }'
        ].join('\n');
      } catch (e) {}
    }

    function removeScrollFix() {
      try {
        var style = document.getElementById('__iso_scroll_fix__');
        if (style) style.textContent = '';
      } catch (e) {}
    }

    function onNavigate() {
      if (needsScroll(window.location.pathname)) {
        applyScrollFix();
      } else {
        removeScrollFix();
      }
    }

    window.addEventListener('popstate', onNavigate, { passive: true });

    // Use window.history explicitly — bare `history` is undefined in Node.js/vm contexts.
    var _origPushState = window.history.pushState.bind(window.history);
    window.history.pushState = function () {
      _origPushState.apply(window.history, arguments);
      setTimeout(onNavigate, 0);
    };
    var _origReplaceState = window.history.replaceState.bind(window.history);
    window.history.replaceState = function () {
      _origReplaceState.apply(window.history, arguments);
      setTimeout(onNavigate, 0);
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', onNavigate, { once: true });
    } else {
      onNavigate();
    }
  })();

  function getCapacitorPlugin(name) {
    try {
      return window.Capacitor &&
             window.Capacitor.Plugins &&
             window.Capacitor.Plugins[name] || null;
    } catch (e) { return null; }
  }

  function dispatchAndroidEvent(name, detail) {
    try {
      window.dispatchEvent(new CustomEvent(name, { detail: detail || {} }));
    } catch (e) {}
  }

  function setNativeOnline(connected, source) {
    var next = connected !== false;
    var previous = window.__ISO_ANDROID_ONLINE__ !== false;
    window.__ISO_ANDROID_ONLINE__ = next;
    try {
      if (window.__iso_set_server_online && next) window.__iso_set_server_online(true);
    } catch (e) {}
    dispatchAndroidEvent('isotope:network', {
      connected: next,
      online: next,
      source: source || 'android'
    });
    if (previous !== next) {
      try { window.dispatchEvent(new Event(next ? 'online' : 'offline')); } catch (e) {}
    }
  }

  window.__isoIsOnline = function () {
    return window.__ISO_ANDROID_ONLINE__ !== false;
  };

  // ── Community namespace — Join-with-Code modal (replaces window.prompt) ────
  window.IsotopeAndroidCommunity = (function () {
    function openJoinModal() {
      try {
        var existing = document.getElementById('__iso_join_modal');
        if (existing) existing.remove();

        var overlay = document.createElement('div');
        overlay.id = '__iso_join_modal';
        overlay.style.cssText = [
          'position:fixed;inset:0;z-index:9999;',
          'background:rgba(0,0,0,0.65);',
          'display:flex;align-items:center;justify-content:center;',
          'padding:1.5rem;box-sizing:border-box;'
        ].join('');

        var card = document.createElement('div');
        card.style.cssText = [
          'background:#0e0e11;',
          'border:1px solid rgba(255,255,255,0.1);',
          'border-radius:1.25rem;',
          'width:100%;max-width:22rem;',
          'padding:1.5rem;',
          'box-shadow:0 8px 32px rgba(0,0,0,0.5);',
          'display:flex;flex-direction:column;gap:1rem;',
          'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;'
        ].join('');

        card.innerHTML = [
          '<h2 style="margin:0;font-size:1.125rem;font-weight:700;color:#fff;">Join with Code</h2>',
          '<p style="margin:0;font-size:0.875rem;color:#a1a1aa;line-height:1.4;">',
          'Paste an invite code or an invite link to join a group.</p>',
          '<input id="__iso_join_input" type="text"',
          ' placeholder="Code or invite link..."',
          ' autocomplete="off" autocorrect="off" spellcheck="false"',
          ' style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.13);',
          'border-radius:0.75rem;padding:0.75rem 1rem;color:#fff;font-size:1rem;',
          'outline:none;width:100%;box-sizing:border-box;" />',
          '<div id="__iso_join_error" style="display:none;color:#ef4444;font-size:0.8rem;margin-top:-0.5rem;"></div>',
          '<div style="display:flex;gap:0.75rem;">',
          '<button id="__iso_join_cancel"',
          ' style="flex:1;padding:0.625rem;background:rgba(255,255,255,0.07);',
          'border:1px solid rgba(255,255,255,0.1);border-radius:0.75rem;',
          'color:#a1a1aa;font-size:0.875rem;font-weight:600;cursor:pointer;">Cancel</button>',
          '<button id="__iso_join_submit"',
          ' style="flex:2;padding:0.625rem;background:#7c3aed;border:none;',
          'border-radius:0.75rem;color:#fff;font-size:0.875rem;font-weight:700;cursor:pointer;">',
          'Join Group</button>',
          '</div>'
        ].join('');

        overlay.appendChild(card);
        document.body.appendChild(overlay);

        var inp = document.getElementById('__iso_join_input');
        var errEl = document.getElementById('__iso_join_error');
        setTimeout(function () { try { inp && inp.focus(); } catch (e) {} }, 80);

        function dismiss() { try { overlay.remove(); } catch (e) {} }

        function showErr(msg) {
          if (!errEl) return;
          errEl.textContent = msg;
          errEl.style.display = 'block';
          if (inp) inp.style.borderColor = '#ef4444';
        }

        function submit() {
          var val = (inp && inp.value || '').trim();
          if (!val) { showErr('Please enter an invite code or link.'); return; }
          // Extract code from full URL or bare code
          var code = val.replace(/[?#].*$/, '').split(/[\/\\]/).filter(Boolean).pop();
          if (!code) { showErr('Could not parse invite code.'); return; }
          dismiss();
          try {
            // Prefer React-router navigation (no full reload) when available
            if (window.__iso_navigate && typeof window.__iso_navigate === 'function') {
              window.__iso_navigate('/invite/' + encodeURIComponent(code));
            } else if (window.history && typeof window.history.pushState === 'function') {
              window.history.pushState({}, '', '/invite/' + encodeURIComponent(code));
              window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
            } else {
              window.location.href = '/invite/' + encodeURIComponent(code);
            }
          } catch (e) {
            window.location.href = '/invite/' + encodeURIComponent(code);
          }
        }

        document.getElementById('__iso_join_cancel').onclick = dismiss;
        document.getElementById('__iso_join_submit').onclick = submit;
        overlay.onclick = function (ev) { if (ev.target === overlay) dismiss(); };
        if (inp) {
          inp.onkeydown = function (ev) {
            if (ev.key === 'Enter') submit();
            if (ev.key === 'Escape') dismiss();
          };
        }
      } catch (e) {
        // Fallback: native prompt
        var val = window.prompt('Enter invite code or invite link');
        if (val) {
          var code = String(val).trim().split(/[\/\\]/).filter(Boolean).pop();
          if (code) window.location.href = '/invite/' + encodeURIComponent(code);
        }
      }
    }

    return { openJoinModal: openJoinModal };
  })();

  try {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      get: function () { return window.__isoIsOnline(); }
    });
  } catch (e) {}

  (function setupAndroidNetworkBridge() {
    var listenerInstalled = false;
    var pollCount = 0;

    function install() {
      var network = getCapacitorPlugin('Network');
      if (!network) return false;
      if (typeof network.getStatus === 'function') {
        try {
          network.getStatus().then(function (status) {
            setNativeOnline(!status || status.connected !== false, 'capacitor:getStatus');
          }).catch(function () {
            setNativeOnline(true, 'capacitor:getStatus-error');
          });
        } catch (e) {
          setNativeOnline(true, 'capacitor:getStatus-exception');
        }
      }
      if (!listenerInstalled && typeof network.addListener === 'function') {
        listenerInstalled = true;
        try {
          network.addListener('networkStatusChange', function (status) {
            setNativeOnline(!status || status.connected !== false, 'capacitor:networkStatusChange');
          });
        } catch (e) {}
      }
      return true;
    }

    function poll() {
      pollCount++;
      if (install()) return;
      if (pollCount < 30) setTimeout(poll, 100);
    }

    setNativeOnline(true, 'android-default');
    poll();
    try { document.addEventListener('deviceready', install); } catch (e) {}
    try { document.addEventListener('DOMContentLoaded', install); } catch (e) {}
  })();

  (function setupAndroidRenderRecovery() {
    var reloadAttempted = false;

    function forceRepaint(source) {
      try {
        var root = document.documentElement;
        if (root) root.classList.add('iso-android-repaint');
        if (document.body) {
          document.body.style.webkitTransform = 'translateZ(0)';
          document.body.style.transform = 'translateZ(0)';
          void document.body.offsetHeight;
        }
        setTimeout(function () {
          try {
            if (document.body) {
              document.body.style.webkitTransform = '';
              document.body.style.transform = '';
            }
            if (root) root.classList.remove('iso-android-repaint');
          } catch (e) {}
        }, 120);
      } catch (e) {}
      dispatchAndroidEvent('isotope:android-resume', { source: source || 'android-bridge' });
    }

    function checkBlankRoot() {
      setTimeout(function () {
        try {
          var root = document.getElementById && document.getElementById('root');
          var blank = root && root.children && root.children.length === 0;
          if (blank && !reloadAttempted) {
            reloadAttempted = true;
            window.location.reload();
          }
        } catch (e) {}
      }, 1200);
    }

    function installStyles() {
      if (!document.head || document.getElementById && document.getElementById('iso-android-render-style')) return;
      try {
        var style = document.createElement('style');
        style.id = 'iso-android-render-style';
        style.textContent = [
          'html.iso-android-stable-render .app-ambient { display: none !important; }',
          'html.iso-android-stable-render .recharts-wrapper, html.iso-android-stable-render .recharts-surface { transform: translateZ(0); backface-visibility: hidden; }',
          'html.iso-android-stable-render [class*="blur-[100px]"], html.iso-android-stable-render [class*="blur-[120px]"] { filter: none !important; }',
          'html.iso-android-stable-render [data-framer-name], html.iso-android-stable-render .recharts-wrapper * { transition-duration: 0s !important; }',
          'html.iso-android-repaint body { min-height: calc(100% + 1px); }'
        ].join('\n');
        document.head.appendChild(style);
        document.documentElement.classList.add('iso-android-stable-render');
      } catch (e) {}
    }

    window.__isoAndroidForceRepaint = forceRepaint;
    try { document.addEventListener('DOMContentLoaded', installStyles); } catch (e) {}
    try { document.addEventListener('visibilitychange', function () { if (!document.hidden) { forceRepaint('visibilitychange'); checkBlankRoot(); } }); } catch (e) {}
    try { window.addEventListener('focus', function () { forceRepaint('focus'); checkBlankRoot(); }); } catch (e) {}
    // Android rotates the WebView via onConfigurationChanged (activity is not recreated
    // because the manifest declares configChanges="orientation|screenSize|..."), which
    // fires neither 'visibilitychange' nor 'focus'. Without a repaint hook here the
    // WebView's compositor can leave the screen fully black after rotation with no
    // built-in recovery. 'orientationchange' fires before layout settles, so also debounce
    // a 'resize' repaint (resize fires once the new viewport size is applied).
    try {
      window.addEventListener('orientationchange', function () {
        forceRepaint('orientationchange');
        setTimeout(function () { forceRepaint('orientationchange-settled'); checkBlankRoot(); }, 300);
      });
    } catch (e) {}
    try {
      var resizeRepaintTimer = null;
      window.addEventListener('resize', function () {
        if (resizeRepaintTimer) clearTimeout(resizeRepaintTimer);
        resizeRepaintTimer = setTimeout(function () { forceRepaint('resize'); checkBlankRoot(); }, 200);
      });
    } catch (e) {}

    (function installCapacitorResume() {
      var attempts = 0;
      function install() {
        attempts++;
        var app = getCapacitorPlugin('App');
        if (app && typeof app.addListener === 'function') {
          try {
            app.addListener('resume', function () { forceRepaint('capacitor:resume'); checkBlankRoot(); });
            app.addListener('appStateChange', function (state) {
              if (!state || state.isActive !== false) {
                forceRepaint('capacitor:appStateChange');
                checkBlankRoot();
              }
            });
            return;
          } catch (e) {}
        }
        if (attempts < 30) setTimeout(install, 100);
      }
      install();
    })();
  })();

  // ── Inject __IK__ global (mirrors server-side injection) ───────────────────
  // The AI store reads window.__IK__.supa / .anon / .gemini / .groq
  // Without this, all AI features are broken on Android.
  window.__IK__ = {
    supa:   SUPA_URL,
    anon:   SUPA_ANON_KEY,
    gemini: '',
    groq:   ''
  };

  // ── Helper: read session from localStorage ──────────────────────────────────
  function getSession() {
    try {
      var ref = 'vteqquoqvksshmfhuepu';
      var raw = localStorage.getItem('sb-' + ref + '-auth-token')
             || localStorage.getItem('isotope-auth-token')
             || localStorage.getItem('isotope-last-session-raw');
      if (!raw) return null;
      var s = JSON.parse(raw);
      if (s && s.session && s.session.access_token) s = s.session;
      if (s && s.currentSession && s.currentSession.access_token) s = s.currentSession;
      if (s && s.state && s.state.session && s.state.session.access_token) s = s.state.session;
      // Check expiry
      var exp = s.expires_at || 0;
      if (exp && exp < Math.floor(Date.now() / 1000) - 60) {
        // Try to return expired session anyway — Supabase client will refresh
      }
      return s;
    } catch (e) { return null; }
  }

  function getAccessToken() {
    var s = getSession();
    return s && s.access_token ? s.access_token : null;
  }

  // ── Helper: supabase fetch ──────────────────────────────────────────────────
  function supaFetch(path, opts) {
    var token = getAccessToken();
    var headers = Object.assign({}, {
      'apikey': SUPA_ANON_KEY,
      'Authorization': 'Bearer ' + (token || SUPA_ANON_KEY),
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }, opts && opts.headers ? opts.headers : {});
    return fetch(SUPA_URL + path, Object.assign({}, opts, { headers: headers, credentials: 'omit' }));
  }

  // ── Helper: json response ───────────────────────────────────────────────────
  function jsonResponse(data, status) {
    return new Response(JSON.stringify(data), {
      status: status || 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  function errorResponse(msg, status) {
    return jsonResponse({ ok: false, error: msg }, status || 500);
  }

  function safeJsonParse(text, fallback) {
    try { return typeof text === 'string' ? JSON.parse(text) : (text || fallback); }
    catch (e) { return fallback; }
  }

  function isObject(value) {
    return !!value && typeof value === 'object' && !Array.isArray(value);
  }

  function compactObject(obj) {
    var out = {};
    Object.keys(obj || {}).forEach(function (key) {
      if (obj[key] !== undefined) out[key] = obj[key];
    });
    return out;
  }

  function fetchJson(url, opts) {
    return fetch(url, opts).then(function (r) {
      return r.text().then(function (text) {
        return { ok: r.ok, status: r.status, body: safeJsonParse(text, text ? { raw: text } : null) };
      });
    });
  }

  function supaJson(path, opts) {
    return supaFetch(path, opts).then(function (r) {
      return r.text().then(function (text) {
        return { ok: r.ok, status: r.status, body: safeJsonParse(text, text ? { raw: text } : null) };
      });
    });
  }

  function firstRow(res) {
    return res && Array.isArray(res.body) && res.body.length ? res.body[0] : null;
  }

  function publicAvatarUrlFromPath(avatarPath) {
    var pathValue = String(avatarPath || '').trim();
    if (!pathValue) return null;
    if (/^https?:\/\//i.test(pathValue)) return pathValue;
    return SUPA_URL + '/storage/v1/object/public/avatars/' + pathValue.split('/').map(encodeURIComponent).join('/');
  }

  function onboardingFromProfileData(profileData) {
    if (!isObject(profileData)) return null;
    if (typeof profileData.isOnboarded === 'boolean') {
      return {
        state: profileData.isOnboarded ? 'completed' : 'incomplete',
        completed: profileData.isOnboarded,
        completed_at: profileData.onboardingCompletedAt || profileData.onboarding_completed_at || null,
        data: isObject(profileData.onboarding) ? profileData.onboarding : {}
      };
    }
    if (typeof profileData.onboarding_completed === 'boolean') {
      return {
        state: profileData.onboarding_completed ? 'completed' : 'incomplete',
        completed: profileData.onboarding_completed,
        completed_at: profileData.onboarding_completed_at || profileData.onboardingCompletedAt || null,
        data: isObject(profileData.onboarding) ? profileData.onboarding : {}
      };
    }
    return null;
  }

  function hasMeaningfulLegacyData(profileData, statsSummary, sessionsLog) {
    if (Array.isArray(sessionsLog) && sessionsLog.length > 0) return true;
    if (statsSummary && (
      Number(statsSummary.total_sessions || 0) > 0 ||
      Number(statsSummary.session_count || 0) > 0 ||
      Number(statsSummary.total_study_seconds || 0) > 0 ||
      Number(statsSummary.total_hours || 0) > 0
    )) return true;
    if (!isObject(profileData)) return false;
    var ignored = {
      settings: true, tours: true, isOnboarded: true, onboarding_completed: true,
      onboardingCompletedAt: true, onboarding_completed_at: true
    };
    return Object.keys(profileData).some(function (key) {
      return !ignored[key] && profileData[key] !== null && profileData[key] !== '' && profileData[key] !== false;
    });
  }

  function normalizeOnboarding(onboardingRow, profileData, legacyCompleted) {
    if (onboardingRow && typeof onboardingRow.completed === 'boolean') {
      return {
        state: onboardingRow.completed ? 'completed' : 'incomplete',
        completed: onboardingRow.completed,
        completed_at: onboardingRow.completed_at || null,
        data: isObject(onboardingRow.data) ? onboardingRow.data : (isObject(profileData && profileData.onboarding) ? profileData.onboarding : {})
      };
    }
    var fromProfile = onboardingFromProfileData(profileData);
    if (fromProfile) return fromProfile;
    if (legacyCompleted === true) {
      return { state: 'completed', completed: true, completed_at: new Date().toISOString(), data: {} };
    }
    return { state: 'incomplete', completed: false, completed_at: null, data: {} };
  }

  function getBackupData(raw) {
    raw = safeJsonParse(raw, raw);
    var source = raw && typeof raw === 'object' ? raw : {};
    var localBackup = isObject(source.local_backup) ? source.local_backup : {};
    var data = isObject(source.data) ? source.data
      : (isObject(source.backup_data) ? source.backup_data
        : (isObject(source.local_collections) ? source.local_collections
          : (isObject(localBackup.data) ? localBackup.data : {})));
    return {
      profile: isObject(data.profile) ? data.profile : (isObject(source.profile_data) ? source.profile_data : null),
      timerState: isObject(data.timerState) ? data.timerState : (isObject(data.timer_state) ? data.timer_state : null),
      tasks: Array.isArray(data.tasks) ? data.tasks : [],
      sessions: Array.isArray(data.sessions) ? data.sessions : [],
      subjects: Array.isArray(data.subjects) ? data.subjects : [],
      habits: Array.isArray(data.habits) ? data.habits : [],
      dailyLogs: Array.isArray(data.dailyLogs) ? data.dailyLogs : [],
      tests: Array.isArray(data.tests) ? data.tests : [],
      exams: Array.isArray(data.exams) ? data.exams : [],
      mockTests: Array.isArray(data.mockTests) ? data.mockTests : []
    };
  }

  function getCollectionCounts(raw) {
    var data = getBackupData(raw);
    return {
      profile: data.profile ? 1 : 0,
      timerState: data.timerState ? 1 : 0,
      tasks: data.tasks.length,
      sessions: data.sessions.length,
      subjects: data.subjects.length,
      habits: data.habits.length,
      dailyLogs: data.dailyLogs.length,
      tests: data.tests.length,
      exams: data.exams.length,
      mockTests: data.mockTests.length
    };
  }

  function stableStringify(value) {
    if (value === null || typeof value !== 'object') return JSON.stringify(value);
    if (Array.isArray(value)) return '[' + value.map(stableStringify).join(',') + ']';
    return '{' + Object.keys(value).sort().map(function (key) {
      return JSON.stringify(key) + ':' + stableStringify(value[key]);
    }).join(',') + '}';
  }

  function hashText(text) {
    var str = String(text || '');
    var h1 = 2166136261;
    var h2 = 16777619;
    for (var i = 0; i < str.length; i++) {
      var code = str.charCodeAt(i);
      h1 ^= code;
      h1 = Math.imul(h1, 16777619);
      h2 = Math.imul(h2 ^ code, 2246822519);
    }
    return (h1 >>> 0).toString(16).padStart(8, '0')
      + (h2 >>> 0).toString(16).padStart(8, '0')
      + str.length.toString(16).padStart(8, '0');
  }

  function byteSize(value) {
    var text = typeof value === 'string' ? value : JSON.stringify(value || {});
    try {
      if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(text).length;
    } catch (e) {}
    return text.length;
  }

  function normalizeBackup(raw, meta) {
    var text = typeof raw === 'string' ? raw : JSON.stringify(raw || {});
    var parsed = safeJsonParse(text, null);
    var fallbackCounts = getCollectionCounts({ data: {} });
    if (!isObject(parsed)) {
      return {
        valid: false,
        kind: 'invalid',
        reason: 'Backup JSON must be an object',
        raw: null,
        data: getBackupData({ data: {} }),
        collection_counts: fallbackCounts,
        exported_at: null,
        size_bytes: byteSize(text),
        empty: true,
        rich: false,
        rich_score: 0
      };
    }
    var data = getBackupData(parsed);
    var counts = getCollectionCounts(parsed);
    var size = Number(meta && (meta.size_bytes || meta.size || 0)) || byteSize(text);
    var localBackup = isObject(parsed.local_backup) ? parsed.local_backup : {};
    var kind = parsed.schema_version === 1
      ? 'cloud_snapshot'
      : ((parsed.version === 1 && (parsed.source === 'isotopeai' || parsed.source === 'isotope-study')) ? 'local_backup_v1' : 'unknown');
    var hasAnyData = !!data.profile || !!data.timerState || [
      'tasks', 'sessions', 'subjects', 'habits', 'dailyLogs', 'tests', 'exams', 'mockTests'
    ].some(function (key) { return Array.isArray(data[key]) && data[key].length > 0; });
    var exportedAt = parsed.exported_at || parsed.exportedAt || localBackup.exportedAt || parsed.downloaded_at
      || meta && (meta.exported_at || meta.updated_at) || null;
    var rich = isCountsRich(counts, size);
    var empty = isCountsEmpty(counts);
    return {
      valid: kind !== 'unknown' || hasAnyData,
      kind: kind,
      reason: rich ? 'rich backup' : (empty ? 'profile-only or empty backup' : 'valid sparse backup'),
      raw: parsed,
      data: data,
      collection_counts: counts,
      exported_at: exportedAt,
      app_version: parsed.appVersion || parsed.app_version || localBackup.appVersion || null,
      size_bytes: size,
      hash: meta && meta.hash || hashText(text),
      data_hash: hashText(stableStringify(data)),
      source_path: meta && (meta.source_path || meta.path) || null,
      updated_at: meta && meta.updated_at || null,
      empty: empty,
      rich: rich,
      rich_score: backupScore(counts, size)
    };
  }

  function buildCanonicalBackupPayload(normalizedOrRaw, options) {
    var normalized = normalizedOrRaw && normalizedOrRaw.collection_counts
      ? normalizedOrRaw
      : normalizeBackup(normalizedOrRaw, options || {});
    return {
      version: 1,
      source: 'isotopeai',
      exportedAt: options && options.exportedAt || normalized.exported_at || new Date().toISOString(),
      appVersion: options && options.appVersion || normalized.app_version || APP_VERSION,
      data: getBackupData(normalized.raw || { data: normalized.data })
    };
  }

  function buildCloudSnapshotMirror(userId, normalizedOrRaw, options) {
    var canonical = buildCanonicalBackupPayload(normalizedOrRaw, options || {});
    var normalized = normalizeBackup(canonical, options || {});
    return {
      schema_version: 1,
      user_id: userId,
      exported_at: canonical.exportedAt,
      downloaded_at: options && options.downloaded_at || canonical.exportedAt,
      source: options && options.source || 'canonical_backup',
      trusted: true,
      app_version: canonical.appVersion,
      profile_data: canonical.data.profile || {},
      local_backup: canonical,
      backup_data: canonical.data,
      local_collections: canonical.data,
      collection_counts: normalized.collection_counts
    };
  }

  function latestRecordTime(record) {
    var value = record && (record.updatedAt || record.updated_at || record.lastModified || record.createdAt || record.created_at);
    var time = new Date(value || 0).getTime();
    return Number.isFinite(time) ? time : 0;
  }

  function mergeById(localRecords, cloudRecords) {
    var out = new Map();
    function push(record, source) {
      if (!record || typeof record !== 'object') return;
      var id = record.id || record._id || null;
      var key = id || (source + ':' + stableStringify(record));
      var existing = out.get(key);
      if (!existing) {
        out.set(key, record);
        return;
      }
      if (!latestRecordTime(existing) || latestRecordTime(record) >= latestRecordTime(existing)) {
        out.set(key, Object.assign({}, existing, record));
      }
    }
    (Array.isArray(cloudRecords) ? cloudRecords : []).forEach(function (record) { push(record, 'cloud'); });
    (Array.isArray(localRecords) ? localRecords : []).forEach(function (record) { push(record, 'local'); });
    return Array.from(out.values());
  }

  function mergeObjects(base, overlay) {
    var out = Object.assign({}, isObject(base) ? base : {});
    Object.keys(isObject(overlay) ? overlay : {}).forEach(function (key) {
      var value = overlay[key];
      if (value === undefined) return;
      if (isObject(value)) out[key] = mergeObjects(out[key], value);
      else if (value !== null && value !== '') out[key] = value;
      else if (!(key in out)) out[key] = value;
    });
    return out;
  }

  function persistCompletedOnboardingIfNeeded(userId, profileData) {
    if (!userId || !isObject(profileData)) return Promise.resolve(null);
    var completed = profileData.isOnboarded === true || profileData.onboarding_completed === true;
    if (!completed) return Promise.resolve(null);
    var now = new Date().toISOString();
    var completedAt = profileData.onboardingCompletedAt || profileData.onboarding_completed_at || now;
    var onboardingData = compactObject({
      academic: isObject(profileData.academic) ? profileData.academic : undefined,
      studyPreferences: isObject(profileData.studyPreferences) ? profileData.studyPreferences : undefined,
      workflowPreferences: isObject(profileData.workflowPreferences) ? profileData.workflowPreferences : undefined,
      communityPreferences: isObject(profileData.communityPreferences) ? profileData.communityPreferences : undefined,
      personalization: isObject(profileData.personalization) ? profileData.personalization : undefined,
      settings: isObject(profileData.settings) ? profileData.settings : undefined,
      onboarding: isObject(profileData.onboarding) ? profileData.onboarding : undefined
    });
    return supaJson('/rest/v1/user_onboarding?on_conflict=user_id', {
      method: 'POST',
      headers: { 'Prefer': 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify({
        user_id: userId,
        completed: true,
        completed_at: completedAt,
        data: onboardingData,
        updated_at: now
      })
    }).then(function (result) {
      if (!result.ok) return { ok: false, warning: result.body && (result.body.message || result.body.error) || 'Onboarding completion upsert failed' };
      var row = Array.isArray(result.body) ? result.body[0] : result.body;
      if (!row || row.completed !== true) return { ok: false, warning: 'Onboarding completion was not verified' };
      return row;
    }).catch(function (e) {
      return { ok: false, warning: e && e.message || 'Onboarding completion upsert failed' };
    });
  }

  function mergeBackupData(localBackup, cloudBackup) {
    var localData = getBackupData(localBackup && (localBackup.raw || { data: localBackup.data }) || {});
    var cloudData = getBackupData(cloudBackup && (cloudBackup.raw || { data: cloudBackup.data }) || {});
    var out = {
      profile: mergeObjects(cloudData.profile || {}, localData.profile || {}),
      timerState: null,
      tasks: mergeById(localData.tasks, cloudData.tasks),
      sessions: mergeById(localData.sessions, cloudData.sessions),
      subjects: mergeById(localData.subjects, cloudData.subjects),
      habits: mergeById(localData.habits, cloudData.habits),
      dailyLogs: mergeById(localData.dailyLogs, cloudData.dailyLogs),
      tests: mergeById(localData.tests, cloudData.tests),
      exams: mergeById(localData.exams, cloudData.exams),
      mockTests: mergeById(localData.mockTests, cloudData.mockTests)
    };
    var localTimer = localData.timerState;
    var cloudTimer = cloudData.timerState;
    out.timerState = localTimer && cloudTimer
      ? (latestRecordTime(localTimer) >= latestRecordTime(cloudTimer) ? localTimer : cloudTimer)
      : (localTimer || cloudTimer || null);
    return out;
  }

  function isCountsRich(counts, sizeBytes) {
    return ['tasks', 'sessions', 'subjects', 'habits', 'tests', 'exams', 'mockTests'].some(function (key) {
      return Number(counts[key] || 0) > 0;
    }) || (Number(sizeBytes || 0) > 100 * 1024 && ['tasks', 'sessions', 'subjects', 'habits', 'dailyLogs', 'tests', 'exams', 'mockTests'].some(function (key) {
      return Number(counts[key] || 0) > 0;
    }));
  }

  function isCountsEmpty(counts) {
    return ['tasks', 'sessions', 'subjects', 'habits', 'dailyLogs', 'tests', 'exams', 'mockTests'].every(function (key) {
      return Number(counts[key] || 0) === 0;
    }) && Number(counts.timerState || 0) === 0;
  }

  function backupScore(counts, sizeBytes) {
    return (isCountsRich(counts, sizeBytes) ? 100000 : 0)
      + Number(counts.tasks || 0) * 10
      + Number(counts.sessions || 0) * 8
      + Number(counts.subjects || 0) * 10
      + Number(counts.exams || 0) * 8
      + Number(counts.tests || 0) * 8
      + Number(counts.mockTests || 0) * 8
      + Number(counts.habits || 0) * 5
      + Number(counts.dailyLogs || 0) * 2
      + Number(counts.profile || 0)
      + Number(counts.timerState || 0)
      + Math.min(5000, Math.floor(Number(sizeBytes || 0) / 1024));
  }

  function backupExportedAt(raw, meta) {
    raw = safeJsonParse(raw, raw);
    return (raw && (raw.exported_at || raw.exportedAt || (raw.local_backup && raw.local_backup.exportedAt) || raw.downloaded_at))
      || (meta && (meta.updated_at || meta.created_at))
      || null;
  }

  function backupKindFromPath(path) {
    if (path.indexOf('/backups/history/') !== -1) return 'backup_history';
    if (/\/backups\/latest\.json$/.test(path)) return 'backup_latest';
    if (path.indexOf('/cloud-snapshot/history/') !== -1) return 'cloud_snapshot_history';
    if (/\/cloud-snapshot\/latest\.json$/.test(path)) return 'cloud_snapshot_latest';
    if (path.indexOf('/imports/') !== -1) return /\/latest\.json$/.test(path) ? 'import_latest' : 'import_archive';
    if (path.indexOf('/exports/') !== -1) return /\/latest\.json$/.test(path) ? 'export_latest' : 'export_archive';
    return 'unknown';
  }

  function buildBackupCandidate(userId, path, text, meta) {
    var normalized = normalizeBackup(text, Object.assign({}, meta || {}, { path: path, source_path: path }));
    var counts = normalized.collection_counts;
    var size = normalized.size_bytes;
    return {
      bucket: 'user-content',
      path: path,
      exists: typeof text === 'string' && text.length > 0,
      valid: normalized.valid,
      kind: backupKindFromPath(path),
      hash: normalized.hash,
      data_hash: normalized.data_hash,
      size_bytes: size,
      exported_at: normalized.exported_at || backupExportedAt(text, meta),
      updated_at: meta && (meta.updated_at || meta.created_at) || null,
      collection_counts: counts,
      rich_score: normalized.rich_score,
      rich: normalized.rich,
      empty: normalized.empty,
      reason: normalized.reason,
      raw_text: text,
      normalized: normalized
    };
  }

  function storageDownloadText(userId, objectPath) {
    var session = getSession();
    if (!session || !session.access_token) return Promise.resolve(null);
    return fetch(SUPA_URL + '/storage/v1/object/user-content/' + objectPath, {
      headers: { 'Authorization': 'Bearer ' + session.access_token, 'apikey': SUPA_ANON_KEY },
      credentials: 'omit'
    }).then(function (r) {
      if (!r.ok) return null;
      return r.text();
    }).catch(function () { return null; });
  }

  function storageList(prefix) {
    var session = getSession();
    if (!session || !session.access_token) return Promise.resolve([]);
    return fetch(SUPA_URL + '/storage/v1/object/list/user-content', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + session.access_token,
        'apikey': SUPA_ANON_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prefix: prefix || '', limit: 200, offset: 0, sortBy: { column: 'name', order: 'asc' } }),
      credentials: 'omit'
    }).then(function (r) {
      if (!r.ok) return [];
      return r.json().catch(function () { return []; });
    }).catch(function () { return []; });
  }

  function newestFilesFirst(files) {
    return (Array.isArray(files) ? files.slice() : []).sort(function (a, b) {
      var at = new Date(a && (a.updated_at || a.created_at) || 0).getTime() || 0;
      var bt = new Date(b && (b.updated_at || b.created_at) || 0).getTime() || 0;
      if (bt !== at) return bt - at;
      return String(b && b.name || '').localeCompare(String(a && a.name || ''));
    });
  }

  function pathPriority(path) {
    if (/\/backups\/latest\.json$/.test(path)) return 100;
    if (/\/cloud-snapshot\/latest\.json$/.test(path)) return 90;
    if (/\/imports\/latest\.json$/.test(path)) return 80;
    if (/\/exports\/latest\.json$/.test(path)) return 70;
    if (path.indexOf('/backups/history/') !== -1) return 60;
    if (path.indexOf('/imports/') !== -1) return 50;
    if (path.indexOf('/exports/') !== -1) return 40;
    if (path.indexOf('/cloud-snapshot/history/') !== -1) return 30;
    return 0;
  }

  function candidateTime(candidate) {
    var values = [candidate && candidate.exported_at, candidate && candidate.updated_at, candidate && candidate.created_at];
    return Math.max.apply(Math, values.map(function (value) {
      var time = new Date(value || 0).getTime();
      return Number.isFinite(time) ? time : 0;
    }));
  }

  function compareBackupCandidate(a, b) {
    if (a.valid !== b.valid) return a.valid ? -1 : 1;
    if (a.rich !== b.rich) return a.rich ? -1 : 1;
    if (a.empty !== b.empty) return a.empty ? 1 : -1;
    if (a.hash && b.hash && a.hash === b.hash) return pathPriority(b.path) - pathPriority(a.path);
    var at = candidateTime(a);
    var bt = candidateTime(b);
    if (Math.abs(bt - at) > 10000) return bt - at;
    var priorityDelta = pathPriority(b.path) - pathPriority(a.path);
    if (priorityDelta !== 0) return priorityDelta;
    return Number(b.rich_score || 0) - Number(a.rich_score || 0);
  }

  function publicBackupCandidate(candidate) {
    if (!candidate) return null;
    var copy = Object.assign({}, candidate);
    delete copy.raw_text;
    delete copy.normalized;
    return copy;
  }

  function findBestCloudBackup(userId, options) {
    var basePaths = [
      userId + '/backups/latest.json',
      userId + '/cloud-snapshot/latest.json',
      userId + '/imports/latest.json',
      userId + '/exports/latest.json'
    ];
    var historyPrefixes = [
      userId + '/backups/history/',
      userId + '/imports/',
      userId + '/exports/',
      userId + '/cloud-snapshot/history/'
    ];
    return Promise.all(historyPrefixes.map(storageList)).then(function (lists) {
      var seen = {};
      var metas = basePaths.map(function (path) { return { path: path }; });
      lists.forEach(function (files, idx) {
        var prefix = historyPrefixes[idx];
        newestFilesFirst(files).slice(0, 50).forEach(function (file) {
          if (!file || !file.name || file.name === 'history') return;
          var path = prefix + file.name;
          metas.push({ path: path, updated_at: file.updated_at || file.created_at || null, size_bytes: file.metadata && file.metadata.size || file.size || null });
        });
      });
      metas = metas.filter(function (meta) {
        if (!meta.path || seen[meta.path] || !/\.json$/.test(meta.path)) return false;
        seen[meta.path] = true;
        return true;
      });
      return Promise.all(metas.map(function (meta) {
        return storageDownloadText(userId, meta.path).then(function (text) {
          return text ? buildBackupCandidate(userId, meta.path, text, meta) : null;
        });
      }));
    }).then(function (candidates) {
      var valid = candidates.filter(function (candidate) {
        return candidate && candidate.exists && candidate.valid;
      }).sort(compareBackupCandidate);
      var selected = valid[0] || null;
      var emptyLatest = valid.find(function (candidate) {
        return candidate.empty && (/\/backups\/latest\.json$/.test(candidate.path) || /\/exports\/latest\.json$/.test(candidate.path) || /\/cloud-snapshot\/latest\.json$/.test(candidate.path));
      });
      var richLegacy = valid.find(function (candidate) {
        return candidate.rich && (candidate.path.indexOf('/imports/') !== -1 || candidate.path.indexOf('/exports/') !== -1 || candidate.path.indexOf('/cloud-snapshot/') !== -1);
      });
      return {
        ok: true,
        selected: publicBackupCandidate(selected),
        selected_internal: options && options.includeRaw ? selected : undefined,
        candidates: valid.map(publicBackupCandidate),
        candidates_internal: options && options.includeRaw ? valid : undefined,
        local_recommendation: selected && selected.rich ? 'restore_or_merge_before_upload' : (selected ? 'cloud_empty_upload_allowed_if_local_rich' : 'upload_local_if_rich'),
        warning_if_empty_latest: emptyLatest && richLegacy && richLegacy.path !== emptyLatest.path
          ? 'A latest backup is empty/profile-only while a richer backup exists. Do not upload empty local data.'
          : null
      };
    });
  }

  function downloadCloudSnapshot(userId) {
    return storageDownloadText(userId, userId + '/cloud-snapshot/latest.json').then(function (text) {
      var parsed = safeJsonParse(text, null);
      return parsed && parsed.user_id === userId ? parsed : null;
    });
  }

  function storageResultBody(response) {
    return response.text().then(function (text) {
      return { ok: response.ok, status: response.status, body: safeJsonParse(text, text || null), text: text };
    });
  }

  function storageUploadText(objectPath, text, upsert) {
    var session = getSession();
    if (!session || !session.access_token) return Promise.reject(new Error('no_session'));
    return fetch(SUPA_URL + '/storage/v1/object/user-content/' + objectPath, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + session.access_token,
        'apikey': SUPA_ANON_KEY,
        'Content-Type': 'application/json',
        'x-upsert': upsert ? 'true' : 'false'
      },
      body: text,
      credentials: 'omit'
    }).then(storageResultBody);
  }

  function encodeStoragePath(pathValue) {
    return String(pathValue || '').split('/').map(encodeURIComponent).join('/');
  }

  function publicStorageUrl(bucket, objectPath) {
    return SUPA_URL + '/storage/v1/object/public/' + encodeURIComponent(bucket) + '/' + encodeStoragePath(objectPath);
  }

  function sanitizeStorageSegment(value, fallback) {
    var text = String(value || fallback || 'file')
      .split(/[\\/]/).pop()
      .replace(/[^a-zA-Z0-9._-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 96);
    if (!text || text === '.' || text === '..') return fallback || 'file';
    return text;
  }

  function extensionForContentType(contentType) {
    var type = String(contentType || '').toLowerCase().split(';')[0].trim();
    if (type === 'image/jpeg') return 'jpg';
    if (type === 'image/png') return 'png';
    if (type === 'image/webp') return 'webp';
    if (type === 'image/gif') return 'gif';
    if (type === 'image/svg+xml') return 'svg';
    if (type === 'application/pdf') return 'pdf';
    if (type === 'text/plain') return 'txt';
    if (type === 'text/markdown') return 'md';
    if (type === 'application/json') return 'json';
    return 'bin';
  }

  function extensionFromName(fileName) {
    var match = String(fileName || '').match(/\.([a-zA-Z0-9]{1,12})$/);
    return match ? match[1].toLowerCase() : null;
  }

  function bytesFromBase64(value) {
    if (typeof atob !== 'function' || typeof Uint8Array === 'undefined') return null;
    var binary = atob(String(value || ''));
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  function resolveUploadBody(input, options) {
    options = options || {};
    var optionContentType = options.contentType || options.content_type;
    var optionFileName = options.fileName || options.file_name;
    if (typeof Blob !== 'undefined' && input instanceof Blob) {
      return Promise.resolve({
        body: input,
        content_type: optionContentType || input.type || 'application/octet-stream',
        size_bytes: Number(input.size || 0),
        file_name: sanitizeStorageSegment(optionFileName || input.name || 'upload.bin', 'upload.bin')
      });
    }
    if (input && typeof ArrayBuffer !== 'undefined' && input instanceof ArrayBuffer) {
      return Promise.resolve({
        body: input,
        content_type: optionContentType || 'application/octet-stream',
        size_bytes: input.byteLength || 0,
        file_name: sanitizeStorageSegment(optionFileName || 'upload.bin', 'upload.bin')
      });
    }
    if (input && typeof ArrayBuffer !== 'undefined' && input.buffer instanceof ArrayBuffer && input.byteLength !== undefined) {
      return Promise.resolve({
        body: input,
        content_type: optionContentType || 'application/octet-stream',
        size_bytes: input.byteLength || 0,
        file_name: sanitizeStorageSegment(optionFileName || 'upload.bin', 'upload.bin')
      });
    }
    if (isObject(input) && (input.data_url || input.dataUrl || input.content || input.text || input.body)) {
      return resolveUploadBody(input.data_url || input.dataUrl || input.content || input.text || input.body, Object.assign({}, options, {
        contentType: optionContentType || input.content_type || input.contentType,
        fileName: optionFileName || input.file_name || input.fileName || input.name
      }));
    }
    var text = String(input === undefined || input === null ? '' : input);
    var dataUrl = text.match(/^data:([^;,]+)?(;base64)?,([\s\S]*)$/);
    if (dataUrl) {
      var dataType = optionContentType || dataUrl[1] || 'application/octet-stream';
      var encoded = dataUrl[3] || '';
      var body = dataUrl[2] ? bytesFromBase64(encoded) : decodeURIComponent(encoded);
      if (body && typeof Blob !== 'undefined' && body instanceof Uint8Array) {
        body = new Blob([body], { type: dataType });
      }
      if (!body) body = encoded;
      return Promise.resolve({
        body: body,
        content_type: dataType,
        size_bytes: body && typeof body.size === 'number' ? body.size : (body.byteLength || body.length || 0),
        file_name: sanitizeStorageSegment(optionFileName || 'upload.' + extensionForContentType(dataType), 'upload.bin')
      });
    }
    return Promise.resolve({
      body: text,
      content_type: optionContentType || 'text/plain',
      size_bytes: byteSize(text),
      file_name: sanitizeStorageSegment(optionFileName || 'upload.txt', 'upload.txt')
    });
  }

  function storageUploadObject(bucket, objectPath, body, contentType, upsert) {
    var session = getSession();
    if (!session || !session.access_token) return Promise.reject(new Error('no_session'));
    return fetch(SUPA_URL + '/storage/v1/object/' + encodeURIComponent(bucket) + '/' + encodeStoragePath(objectPath), {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + session.access_token,
        'apikey': SUPA_ANON_KEY,
        'Content-Type': contentType || 'application/octet-stream',
        'x-upsert': upsert ? 'true' : 'false'
      },
      body: body,
      credentials: 'omit'
    }).then(storageResultBody);
  }

  function uploadGroupIconCompat(input, options) {
    options = options || {};
    var session = getSession();
    var userId = session && session.user && session.user.id;
    if (!session || !session.access_token) return Promise.reject(new Error('no_session'));
    if (!userId) return Promise.reject(new Error('no_user_id'));
    return resolveUploadBody(input, options).then(function (resolved) {
      var contentType = String(resolved.content_type || '').toLowerCase().split(';')[0].trim();
      if (!/^image\/(png|jpe?g|webp|gif|svg\+xml)$/.test(contentType)) {
        var typeErr = new Error('Group icon must be a PNG, JPEG, WebP, GIF, or SVG image.');
        typeErr.status = 400;
        typeErr.code = 'UNSUPPORTED_GROUP_ICON_TYPE';
        throw typeErr;
      }
      if (resolved.size_bytes > 10 * 1024 * 1024) {
        var sizeErr = new Error('Group icon exceeds the 10 MB bucket limit.');
        sizeErr.status = 413;
        sizeErr.code = 'GROUP_ICON_TOO_LARGE';
        throw sizeErr;
      }
      var groupId = sanitizeStorageSegment(options.groupId || options.group_id || 'unassigned', 'unassigned');
      var baseName = sanitizeStorageSegment(options.fileName || options.file_name || resolved.file_name || 'group-icon', 'group-icon');
      var ext = extensionFromName(baseName) || extensionForContentType(contentType);
      var nameWithoutExt = baseName.replace(/\.[a-zA-Z0-9]{1,12}$/, '') || 'group-icon';
      var objectPath = userId + '/groups/' + groupId + '/' + safeIsoStamp(new Date().toISOString()) + '-' + hashText(nameWithoutExt).slice(0, 10) + '.' + ext;
      return storageUploadObject('group-icons', objectPath, resolved.body, contentType, options.upsert === true)
        .then(function (result) {
          assertStorageOk(result, 'Group icon upload');
          return {
            ok: true,
            bucket: 'group-icons',
            path: objectPath,
            public_url: publicStorageUrl('group-icons', objectPath),
            content_type: contentType,
            size_bytes: resolved.size_bytes,
            uploaded_at: new Date().toISOString()
          };
        });
    });
  }

  function uploadStudyMaterialCompat(input, options) {
    options = options || {};
    var session = getSession();
    var userId = session && session.user && session.user.id;
    if (!session || !session.access_token) return Promise.reject(new Error('no_session'));
    if (!userId) return Promise.reject(new Error('no_user_id'));
    return resolveUploadBody(input, options).then(function (resolved) {
      if (resolved.size_bytes > 100 * 1024 * 1024) {
        var sizeErr = new Error('Study material exceeds the 100 MB bucket limit.');
        sizeErr.status = 413;
        sizeErr.code = 'STUDY_MATERIAL_TOO_LARGE';
        throw sizeErr;
      }
      var folder = sanitizeStorageSegment(options.folder || options.subjectId || options.subject_id || 'general', 'general');
      var fileName = sanitizeStorageSegment(options.fileName || options.file_name || resolved.file_name || 'study-material.bin', 'study-material.bin');
      if (!extensionFromName(fileName)) fileName += '.' + extensionForContentType(resolved.content_type);
      var objectPath = userId + '/study-material/' + folder + '/' + safeIsoStamp(new Date().toISOString()) + '-' + fileName;
      return storageUploadObject('study-material', objectPath, resolved.body, resolved.content_type, options.upsert === true)
        .then(function (result) {
          assertStorageOk(result, 'Study material upload');
          return {
            ok: true,
            bucket: 'study-material',
            path: objectPath,
            content_type: resolved.content_type,
            size_bytes: resolved.size_bytes,
            uploaded_at: new Date().toISOString()
          };
        });
    });
  }

  function isStorageAlreadyExists(result) {
    var text = result && (result.text || JSON.stringify(result.body || {})) || '';
    return (result && (result.status === 400 || result.status === 409)) && /already exists|resource exists|duplicate/i.test(text);
  }

  function assertStorageOk(result, label, options) {
    if (result && result.ok) return result;
    if (options && options.ignoreAlreadyExists && isStorageAlreadyExists(result)) return result;
    var errText = result && (result.body && (result.body.message || result.body.error) || result.text) || 'Storage request failed';
    var err = new Error(label + ': ' + errText);
    err.status = result && result.status || 500;
    err.code = /permission|policy|forbidden|rls/i.test(errText) ? 'STORAGE_PERMISSION_DENIED' : 'STORAGE_REQUEST_FAILED';
    throw err;
  }

  function isOwnedJsonPath(userId, objectPath) {
    return !!userId
      && typeof objectPath === 'string'
      && objectPath.startsWith(userId + '/')
      && /\.json$/.test(objectPath)
      && objectPath.indexOf('..') === -1;
  }

  function storageRemove(userId, objectPaths) {
    var session = getSession();
    if (!session || !session.access_token) return Promise.reject(new Error('no_session'));
    var paths = (Array.isArray(objectPaths) ? objectPaths : [objectPaths]).filter(function (path) {
      return isOwnedJsonPath(userId, path);
    });
    if (!paths.length) return Promise.resolve({ ok: true, status: 200, body: [], deleted: [] });
    return fetch(SUPA_URL + '/storage/v1/object/user-content', {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + session.access_token,
        'apikey': SUPA_ANON_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prefixes: paths }),
      credentials: 'omit'
    }).then(storageResultBody).then(function (result) {
      result.deleted = paths;
      return result;
    });
  }

  function safeIsoStamp(value) {
    return String(value || new Date().toISOString()).replace(/[:.]/g, '-');
  }

  function canonicalBackupJson(normalized, options) {
    return JSON.stringify(buildCanonicalBackupPayload(normalized, options || {}), null, 2);
  }

  function cloudSnapshotJson(userId, normalized, options) {
    return JSON.stringify(buildCloudSnapshotMirror(userId, normalized, options || {}), null, 2);
  }

  function hasHistoryHash(userId, hashPrefix) {
    return storageList(userId + '/backups/history/').then(function (files) {
      return newestFilesFirst(files).some(function (file) {
        return file && file.name && String(file.name).indexOf(hashPrefix) !== -1;
      });
    });
  }

  function writeCanonicalBackup(userId, backupInput, options) {
    options = options || {};
    var normalized = backupInput && backupInput.collection_counts
      ? backupInput
      : normalizeBackup(backupInput, { source_path: options.source_path || null });
    if (!normalized.valid) {
      var invalid = new Error(normalized.reason || 'This file is not a valid Isotope backup.');
      invalid.status = 400;
      invalid.code = 'INVALID_BACKUP';
      throw invalid;
    }
    var exportedAt = options.exportedAt || normalized.exported_at || new Date().toISOString();
    var canonical = canonicalBackupJson(normalized, { exportedAt: exportedAt, appVersion: APP_VERSION });
    var canonicalHash = hashText(canonical);
    var canonicalNormalized = normalizeBackup(canonical, { hash: canonicalHash, source_path: userId + '/backups/latest.json' });
    var canonicalDataHash = canonicalNormalized.data_hash;
    var latestPath = userId + '/backups/latest.json';
    var hashPrefix = canonicalHash.slice(0, 16);
    var historyPath = userId + '/backups/history/' + safeIsoStamp(exportedAt) + '-' + hashPrefix + '.json';
    var mirrorPath = userId + '/cloud-snapshot/latest.json';
    var mirror = cloudSnapshotJson(userId, canonicalNormalized, {
      exportedAt: exportedAt,
      appVersion: APP_VERSION,
      source: options.source || 'canonical_backup'
    });
    var historyStatus = 'skipped_duplicate';
    return storageUploadText(latestPath, canonical, true)
      .then(function (result) { return assertStorageOk(result, 'Storage upload ' + latestPath); })
      .then(function () { return hasHistoryHash(userId, hashPrefix); })
      .then(function (exists) {
        if (exists) return null;
        return storageUploadText(historyPath, canonical, false).then(function (result) {
          assertStorageOk(result, 'Storage upload ' + historyPath, { ignoreAlreadyExists: true });
          historyStatus = result.status || 'uploaded';
          return result;
        });
      })
      .then(function () {
        return storageUploadText(mirrorPath, mirror, true).then(function (result) {
          return assertStorageOk(result, 'Storage upload ' + mirrorPath);
        });
      })
      .then(function () { return storageDownloadText(userId, latestPath); })
      .then(function (readback) {
        if (hashText(readback || '') !== canonicalHash) {
          var mismatch = new Error('Canonical latest backup readback hash mismatch');
          mismatch.code = 'STORAGE_READBACK_MISMATCH';
          throw mismatch;
        }
        return {
          ok: true,
          bucket: 'user-content',
          path: latestPath,
          latest_path: latestPath,
          history_path: historyPath,
          history_status: historyStatus,
          cloud_snapshot_path: mirrorPath,
          hash: canonicalHash,
          data_hash: canonicalDataHash,
          cloud_snapshot_hash: hashText(mirror),
          size_bytes: byteSize(canonical),
          cloud_snapshot_size_bytes: byteSize(mirror),
          exported_at: exportedAt,
          collection_counts: canonicalNormalized.collection_counts,
          rich: canonicalNormalized.rich,
          empty: canonicalNormalized.empty,
          backup_json: canonical,
          cloud_snapshot_json: mirror
        };
      });
  }

  function cleanupPreview(userId) {
    return findBestCloudBackup(userId, { includeRaw: true }).then(function (best) {
      var selectedPath = best.selected_internal && best.selected_internal.path || null;
      var candidates = best.candidates_internal || [];
      var canonical = candidates.find(function (candidate) { return candidate.path === userId + '/backups/latest.json'; });
      var canonicalHash = canonical && canonical.hash || null;
      var seenHash = {};
      var backupHistory = candidates.filter(function (candidate) {
        return candidate.path.indexOf('/backups/history/') !== -1;
      }).sort(compareBackupCandidate);
      var importArchives = candidates.filter(function (candidate) {
        return candidate.path.indexOf('/imports/') !== -1 && !/\/latest\.json$/.test(candidate.path);
      }).sort(compareBackupCandidate);
      var exportArchives = candidates.filter(function (candidate) {
        return candidate.path.indexOf('/exports/') !== -1 && !/\/latest\.json$/.test(candidate.path);
      }).sort(compareBackupCandidate);
      var decisions = candidates.map(function (candidate) {
        var action = 'keep';
        var reason = 'active candidate';
        var protectedLatest = [
          userId + '/backups/latest.json',
          userId + '/cloud-snapshot/latest.json',
          userId + '/imports/latest.json',
          userId + '/exports/latest.json'
        ].indexOf(candidate.path) !== -1;
        if (protectedLatest) {
          reason = 'latest protected path';
        } else if (candidate.path === selectedPath) {
          reason = 'selected best backup';
        } else if (candidate.path.indexOf('/backups/history/') !== -1 && backupHistory.findIndex(function (row) { return row.path === candidate.path; }) < 5) {
          reason = 'backup history keep-latest-5 policy';
        } else if (candidate.hash && canonicalHash && candidate.hash === canonicalHash) {
          action = 'delete';
          reason = 'duplicate of canonical latest';
        } else if (candidate.empty && best.selected_internal && best.selected_internal.rich) {
          action = 'delete';
          reason = 'profile-only backup superseded by richer cloud backup';
        } else if (candidate.hash && seenHash[candidate.hash]) {
          action = 'delete';
          reason = 'duplicate of ' + seenHash[candidate.hash];
        } else if (candidate.path.indexOf('/backups/history/') !== -1 && backupHistory.findIndex(function (row) { return row.path === candidate.path; }) >= 5) {
          action = 'delete';
          reason = 'backup history beyond keep-latest-5 policy';
        } else if (candidate.path.indexOf('/imports/') !== -1 && !/\/latest\.json$/.test(candidate.path) && importArchives.findIndex(function (row) { return row.path === candidate.path; }) >= 3) {
          action = 'delete';
          reason = 'import archive beyond keep-latest-3 policy';
        } else if (candidate.path.indexOf('/exports/') !== -1 && !/\/latest\.json$/.test(candidate.path) && exportArchives.findIndex(function (row) { return row.path === candidate.path; }) >= 3) {
          action = 'delete';
          reason = 'export archive beyond keep-latest-3 policy';
        }
        if (candidate.hash && !seenHash[candidate.hash]) seenHash[candidate.hash] = candidate.path;
        return {
          action: action,
          reason: reason,
          bucket: 'user-content',
          path: candidate.path,
          hash: candidate.hash,
          size_bytes: candidate.size_bytes,
          bytes_freed: action === 'delete' ? candidate.size_bytes : 0,
          collection_counts: candidate.collection_counts
        };
      });
      return {
        ok: true,
        selected: best.selected,
        decisions: decisions,
        bytes_freed: decisions.reduce(function (sum, row) { return sum + Number(row.bytes_freed || 0); }, 0),
        dry_run: true
      };
    });
  }

  function cleanupApply(userId) {
    return cleanupPreview(userId).then(function (preview) {
      var toDelete = preview.decisions.filter(function (row) {
        return row.action === 'delete' && isOwnedJsonPath(userId, row.path);
      }).map(function (row) { return row.path; });
      if (!toDelete.length) {
        return Object.assign({}, preview, { dry_run: false, deleted: [], deleted_count: 0 });
      }
      return storageRemove(userId, toDelete).then(function (removed) {
        assertStorageOk(removed, 'Storage cleanup delete');
        return Object.assign({}, preview, {
          dry_run: false,
          deleted: toDelete,
          deleted_count: toDelete.length
        });
      });
    });
  }

  function blockedEmptyOverwrite(localNormalized, best) {
    var selected = best && best.selected_internal;
    return !!(localNormalized && localNormalized.empty && selected && selected.rich);
  }

  function blockedEmptyOverwriteResponse(localNormalized, best) {
    var selected = best && best.selected_internal;
    return jsonResponse({
      ok: false,
      success: false,
      code: 'BLOCKED_EMPTY_OVERWRITE',
      state: 'blocked_empty_overwrite',
      stage: 'storage_scan',
      message: 'Cloud has richer backup. Restore first.',
      error: 'Cloud has richer backup. Restore first.',
      selected_backup: publicBackupCandidate(selected),
      backup_candidates: best && best.candidates || [],
      local_counts: localNormalized && localNormalized.collection_counts || {},
      cloud_counts: selected && selected.collection_counts || {}
    }, 409);
  }

  function backupErrorResponse(error, fallback, stage) {
    var code = error && error.code || (/auth/i.test(error && error.message || '') ? 'AUTH_REQUIRED' : 'UNKNOWN');
    var status = error && error.status
      || (code === 'AUTH_REQUIRED' ? 401 : (code === 'INVALID_BACKUP' ? 400 : (code === 'STORAGE_NOT_FOUND' ? 404 : 500)));
    return jsonResponse({
      ok: false,
      success: false,
      code: code,
      state: 'failed',
      stage: stage || 'storage',
      retryable: status >= 500,
      message: error && error.message || fallback,
      error: error && error.message || fallback
    }, status);
  }

  // ── Endpoint handlers ───────────────────────────────────────────────────────

  // GET /api/version, /api/health, /api/healthz, /api/status, /__isotope/ping
  function handleLocalStatus(url) {
    var p = new URL(url).pathname;
    if (p === '/__isotope/ping') {
      return Promise.resolve(jsonResponse({ pong: true, android: true }));
    }
    if (p === '/__isotope/state') {
      return Promise.resolve(jsonResponse({ android: true, version: APP_VERSION, serverOnline: true }));
    }
    if (p.startsWith('/api/health') || p === '/api/status') {
      return Promise.resolve(jsonResponse({ status: 'ok', android: true, version: APP_VERSION }));
    }
    if (p === '/api/version') {
      return Promise.resolve(jsonResponse({
        version: APP_VERSION,
        android: true,
        commit: 'local',
        update_available: false
      }));
    }
    if (p === '/api/ai-config') {
      return Promise.resolve(jsonResponse({ enabled: false, android: true }));
    }
    if (p === '/api/community-events') {
      // Return empty events — community still works via Supabase Realtime
      return Promise.resolve(jsonResponse({ events: [], android: true }));
    }
    return null;
  }

  // POST /__auth/login
  function handleLogin(body) {
    return fetch(SUPA_URL + '/auth/v1/token?grant_type=password', {
      method: 'POST',
      headers: { 'apikey': SUPA_ANON_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: body.username || body.email, password: body.password }),
      credentials: 'omit'
    }).then(function (r) {
      return r.json().then(function (d) {
        if (r.ok && d.access_token) {
          var session = {
            access_token: d.access_token,
            refresh_token: d.refresh_token,
            expires_in: d.expires_in,
            expires_at: Math.floor(Date.now() / 1000) + Number(d.expires_in || 3600),
            token_type: d.token_type || 'bearer',
            user: d.user
          };
          // Write session to localStorage (mirrors what auth-bridge.js does)
          try {
            var raw = JSON.stringify(session);
            var ref = 'vteqquoqvksshmfhuepu';
            localStorage.setItem('isotope-auth-token', raw);
            localStorage.setItem('sb-' + ref + '-auth-token', raw);
            localStorage.setItem('isotope-last-jwt', d.access_token);
            if (d.refresh_token) localStorage.setItem('isotope-last-rt', d.refresh_token);
          } catch (e) {}
          // Keep current-user-ID global in sync for community features
          try {
            if (d.user && d.user.id) window.__ISO_CURRENT_USER_ID__ = d.user.id;
          } catch (e) {}
          return jsonResponse({ ok: true, session: session, user: d.user });
        } else {
          var errMsg = d.error_description || d.msg || d.message || d.error || 'Login failed';
          return jsonResponse({ ok: false, error: errMsg }, r.status >= 400 ? r.status : 401);
        }
      });
    }).catch(function (e) {
      return errorResponse(e.message || 'Network error during login');
    });
  }

  // POST /__auth/check — neutral preflight only. Never probe signup.
  function handleCheck(body) {
    var email = body.email || body.username || '';
    return Promise.resolve(jsonResponse({
      ok: true,
      available: true,
      neutral: true,
      checked: false,
      email: email || null
    }));
  }

  // POST /__auth/signup
  function handleSignup(body) {
    return fetch(SUPA_URL + '/auth/v1/signup', {
      method: 'POST',
      headers: { 'apikey': SUPA_ANON_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
        data: compactObject({ name: body.name || body.full_name || body.fullName })
      }),
      credentials: 'omit'
    }).then(function (r) {
      return r.json().then(function (d) {
        if (r.ok) {
          var hasSession = !!(d && d.session && d.session.access_token);
          return jsonResponse({
            ok: hasSession,
            success: hasSession,
            data: d,
            session: d && d.session || null,
            user: d && d.user || null,
            email_confirmation_required: !hasSession,
            code: hasSession ? 'SIGNED_UP' : 'EMAIL_CONFIRMATION_REQUIRED',
            message: hasSession
              ? 'Account created.'
              : 'Confirmation email sent. Check your inbox and confirm your email before logging in.'
          }, hasSession ? 200 : 202);
        }
        return jsonResponse({ ok: false, error: d.error_description || d.msg || d.message || 'Signup failed' }, r.status || 400);
      });
    }).catch(function (e) { return errorResponse(e.message); });
  }

  // GET /__auth/bootstrap — check session and load profile
  function handleBootstrap() {
    var session = getSession();
    if (!session || !session.access_token) {
      return Promise.resolve(jsonResponse({
        ok: false, reason: 'no_session', session: null, user: null, profile: null,
        user_id: null, onboarding: { state: 'unknown' }, onboarding_completed: undefined,
        restore_recommended: false, best_backup: null, cloud_snapshot: null,
        backup_candidates: [], backup_warning: null
      }, 401));
    }
    var userId = session.user && session.user.id;
    if (!userId) {
      return Promise.resolve(jsonResponse({ ok: false, error: 'no_user_id', session: session, user_id: null }, 401));
    }

    var since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    var fromDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    var profilePromise = supaJson('/rest/v1/user_profiles?select=profile_data,updated_at&user_id=eq.' + encodeURIComponent(userId) + '&limit=1', { method: 'GET' });
    var userPromise = supaJson('/rest/v1/users?select=username,name,avatar_url,coins,gems,plan_type,email&id=eq.' + encodeURIComponent(userId) + '&limit=1', { method: 'GET' });
    var onboardingPromise = supaJson('/rest/v1/user_onboarding?select=completed,completed_at,data&user_id=eq.' + encodeURIComponent(userId) + '&limit=1', { method: 'GET' });
    var settingsPromise = supaJson('/rest/v1/user_settings?select=settings,updated_at&user_id=eq.' + encodeURIComponent(userId) + '&limit=1', { method: 'GET' }).catch(function (e) { return { ok: false, status: 0, body: { error: e.message } }; });
    var statsPromise = supaJson('/rest/v1/user_stats_summary?select=*&user_id=eq.' + encodeURIComponent(userId) + '&limit=1', { method: 'GET' }).catch(function (e) { return { ok: false, status: 0, body: { error: e.message } }; });
    var dailyPromise = supaJson('/rest/v1/daily_user_stats?select=date,seconds_studied&user_id=eq.' + encodeURIComponent(userId) + '&date=gte.' + encodeURIComponent(fromDate) + '&order=date.desc&limit=120', { method: 'GET' }).catch(function (e) { return { ok: false, status: 0, body: { error: e.message } }; });
    var sessionsPromise = supaJson('/rest/v1/study_sessions_log?select=id,duration_minutes,ended_at,created_at&user_id=eq.' + encodeURIComponent(userId) + '&ended_at=gte.' + encodeURIComponent(since) + '&order=ended_at.desc&limit=250', { method: 'GET' }).catch(function (e) { return { ok: false, status: 0, body: { error: e.message } }; });

    return Promise.all([
      profilePromise, userPromise, onboardingPromise,
      settingsPromise, statsPromise, dailyPromise, sessionsPromise,
      downloadCloudSnapshot(userId).catch(function () { return null; }),
      findBestCloudBackup(userId).catch(function (e) {
        return { ok: false, selected: null, candidates: [], error: e.message || 'Best backup scan failed' };
      })
    ]).then(function (results) {
        var profileRes = results[0];
        var userRes = results[1];
        var onboardingRes = results[2];
        if (!profileRes.ok || !userRes.ok || !onboardingRes.ok) {
          return jsonResponse({
            ok: false,
            error: 'bootstrap_db_unavailable',
            user_id: userId,
            session: session,
            onboarding: { state: 'unknown' },
            onboarding_completed: undefined
          }, 503);
        }
        var profileRow = firstRow(profileRes);
        var userRow = firstRow(userRes) || (session.user || {});
        var onboardingRow = firstRow(onboardingRes);
        var settingsRow = firstRow(results[3]);
        var statsSummary = firstRow(results[4]);
        var dailyRows = Array.isArray(results[5].body) ? results[5].body : [];
        var sessionRows = Array.isArray(results[6].body) ? results[6].body : [];
        var cloudSnapshot = results[7] || null;
        var bestBackup = results[8] || { selected: null, candidates: [] };
        var profileData = isObject(profileRow && profileRow.profile_data) ? profileRow.profile_data : {};
        var legacyMeaningful = !onboardingRow && hasMeaningfulLegacyData(profileData, statsSummary, sessionRows);
        var onboarding = normalizeOnboarding(onboardingRow, profileData, legacyMeaningful);
        if (!onboardingRow && legacyMeaningful) {
          supaJson('/rest/v1/user_onboarding?on_conflict=user_id', {
            method: 'POST',
            headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
            body: JSON.stringify({
              user_id: userId,
              completed: true,
              completed_at: onboarding.completed_at || new Date().toISOString(),
              data: onboarding.data || {},
              source: 'android_legacy_migration',
              updated_at: new Date().toISOString()
            })
          }).catch(function () {});
        }
        var avatarPath = profileData.avatar_path || profileData.avatarPath || null;
        var avatarUrl = [
          profileData.avatar,
          profileData.avatar_url,
          profileData.avatarUrl,
          userRow.avatar_url,
          publicAvatarUrlFromPath(avatarPath)
        ].find(function (value) { return typeof value === 'string' && value.trim(); }) || null;
        var rawProfileData = Object.assign({}, profileData);
        if (avatarUrl) {
          rawProfileData.avatar = rawProfileData.avatar || avatarUrl;
          rawProfileData.avatar_url = rawProfileData.avatar_url || avatarUrl;
        }
        if (avatarPath) rawProfileData.avatar_path = avatarPath;
        var normalizedProfile = Object.assign({}, userRow || {}, rawProfileData, compactObject({
          avatar: avatarUrl || undefined,
          avatar_url: avatarUrl || undefined,
          isOnboarded: onboarding.completed,
          onboarding_completed: onboarding.completed,
          onboarding_completed_at: onboarding.completed_at || rawProfileData.onboardingCompletedAt || null
        }));
        var settings = isObject(settingsRow && settingsRow.settings) ? settingsRow.settings : (isObject(rawProfileData.settings) ? rawProfileData.settings : {});
        var tours = isObject(rawProfileData.tours) ? rawProfileData.tours : {};
        return jsonResponse({
          ok: true,
          code: 'BOOTSTRAP_OK',
          user_id: userId,
          session: session,
          user: userRow || null,
          profile: normalizedProfile,
          profile_data: rawProfileData,
          profile_updated_at: profileRow && profileRow.updated_at || null,
          onboarding: onboarding,
          onboarding_completed: onboarding.completed,
          settings: settings,
          tours: tours,
          stats_summary: statsSummary || null,
          daily_user_stats: dailyRows,
          study_sessions_log: sessionRows,
          cloud_snapshot: cloudSnapshot,
          best_backup: bestBackup.selected || null,
          backup_candidates: bestBackup.candidates || [],
          restore_recommended: !!(bestBackup.selected && bestBackup.selected.rich),
          backup_warning: bestBackup.warning_if_empty_latest || bestBackup.error || null,
          fetched_at: new Date().toISOString()
        });
      })
      .catch(function (e) {
        // Network failure during DB fetch — preserve local state and let boot use cached snapshots/retry.
        return jsonResponse({
          ok: false,
          error: e && e.message || 'bootstrap_failed',
          session: session,
          profile: null,
          user_id: userId,
          onboarding: { state: 'unknown' },
          onboarding_completed: undefined,
          best_backup: null,
          backup_candidates: [],
          backup_warning: null
        }, 503);
      });
  }

  // GET /__auth/profile
  function handleGetProfile() {
    var session = getSession();
    if (!session) return Promise.resolve(jsonResponse({ ok: false, error: 'no_session' }, 401));
    var userId = session.user && session.user.id;
    if (!userId) return Promise.resolve(jsonResponse({ ok: false, error: 'no_user_id' }, 401));

    return supaFetch('/rest/v1/user_profiles?select=*&user_id=eq.' + userId + '&limit=1', { method: 'GET' })
      .then(function (r) {
        return r.json().then(function (rows) {
          var profile = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
          return jsonResponse({ ok: true, profile_data: profile ? profile.profile_data : null, profile: profile });
        });
      }).catch(function (e) { return errorResponse(e.message); });
  }

  // POST /__auth/profile
  function handlePostProfile(body) {
    var session = getSession();
    if (!session) return Promise.resolve(jsonResponse({ ok: false, error: 'no_session' }, 401));
    var userId = session.user && session.user.id;
    if (!userId) return Promise.resolve(jsonResponse({ ok: false, error: 'no_user_id' }, 401));

    var incomingProfileData = isObject(body && body.profile_data)
      ? body.profile_data
      : (isObject(body && body.profile) ? body.profile : (isObject(body) ? body : {}));
    return supaJson('/rest/v1/user_profiles?select=profile_data&user_id=eq.' + encodeURIComponent(userId) + '&limit=1', {
      method: 'GET'
    }).then(function (existingResult) {
      var existingRow = existingResult.ok ? firstRow(existingResult) : null;
      var existingProfileData = isObject(existingRow && existingRow.profile_data) ? existingRow.profile_data : {};
      var mergedProfileData = mergeObjects(existingProfileData, incomingProfileData);
      return supaJson('/rest/v1/user_profiles?on_conflict=user_id', {
        method: 'POST',
        headers: { 'Prefer': 'return=representation,resolution=merge-duplicates' },
        body: JSON.stringify({
          user_id: userId,
          profile_data: mergedProfileData,
          updated_at: new Date().toISOString()
        })
      }).then(function (result) {
        if (!result.ok) {
          return jsonResponse({
            ok: false,
            error: result.body && (result.body.message || result.body.error) || 'Profile upsert failed',
            detail: result.body || null
          }, result.status || 500);
        }
        var row = Array.isArray(result.body) ? result.body[0] : result.body;
        return persistCompletedOnboardingIfNeeded(userId, mergedProfileData).then(function (onboardingResult) {
          return jsonResponse({
            ok: true,
            profile: row,
            profile_data: row && row.profile_data || mergedProfileData,
            onboarding: onboardingResult || null
          });
        });
      });
    }).catch(function (e) { return errorResponse(e.message); });
  }

  // POST /__auth/backup — upload backup JSON to Supabase Storage
  function handleUploadBackup(body) {
    var session = getSession();
    if (!session) return Promise.resolve(jsonResponse({ ok: false, error: 'no_session' }, 401));
    var userId = session.user && session.user.id;
    if (!userId) return Promise.resolve(jsonResponse({ ok: false, error: 'no_user_id' }, 401));

    var rawBackup = body && (body.backup_json !== undefined ? body.backup_json : (body.backup !== undefined ? body.backup : null));
    if (rawBackup === null || rawBackup === undefined) return Promise.resolve(errorResponse('No backup_json provided', 400));
    var backupText = typeof rawBackup === 'string' ? rawBackup : JSON.stringify(rawBackup);
    var localNormalized = normalizeBackup(backupText, { source_path: body && body.source_path || 'android_upload' });
    if (!localNormalized.valid) return Promise.resolve(backupErrorResponse({ code: 'INVALID_BACKUP', status: 400, message: localNormalized.reason }, 'Invalid backup', 'request_validation'));

    return findBestCloudBackup(userId, { includeRaw: true }).then(function (best) {
      if (blockedEmptyOverwrite(localNormalized, best)) return blockedEmptyOverwriteResponse(localNormalized, best);
      var localDataHash = localNormalized.data_hash;
      var canonicalCandidate = (best.candidates_internal || []).find(function (candidate) {
        return candidate.path === userId + '/backups/latest.json';
      });
      if (canonicalCandidate && canonicalCandidate.valid && canonicalCandidate.data_hash === localDataHash) {
        return jsonResponse({
          ok: true,
          success: true,
          uploaded: false,
          skipped: true,
          code: 'UNCHANGED',
          state: 'synced',
          message: 'Canonical backup already matches local data.',
          bucket: 'user-content',
          path: canonicalCandidate.path,
          latest_path: canonicalCandidate.path,
          cloud_snapshot_path: userId + '/cloud-snapshot/latest.json',
          hash: canonicalCandidate.hash,
          data_hash: localDataHash,
          size_bytes: canonicalCandidate.size_bytes,
          collection_counts: canonicalCandidate.collection_counts,
          selected_backup: best.selected,
          backup_candidates: best.candidates || [],
          snapshot_storage: {
            bucket: 'user-content',
            latest_path: userId + '/cloud-snapshot/latest.json',
            skipped: true
          }
        });
      }

      var backupToWrite = localNormalized;
      var conflict = null;
      var state = 'uploading_local';
      if (localNormalized.rich && best.selected_internal && best.selected_internal.rich && best.selected_internal.data_hash !== localDataHash) {
        backupToWrite = normalizeBackup({
          version: 1,
          source: 'isotopeai',
          exportedAt: new Date().toISOString(),
          appVersion: APP_VERSION,
          data: mergeBackupData(localNormalized, best.selected_internal.normalized)
        }, { source_path: 'android_merged_cloud_local' });
        state = 'merged_cloud_and_local';
        conflict = {
          selected_backup: best.selected,
          strategy: 'merge_by_id_newer_fields_preserved'
        };
      }

      return writeCanonicalBackup(userId, backupToWrite, {
        source_path: body && body.source_path || 'android_upload',
        source: body && body.source || 'android_backup'
      }).then(function (written) {
        var manifestPromise = supaFetch('/rest/v1/backup_manifests', {
          method: 'POST',
          headers: { 'Prefer': 'return=representation' },
          body: JSON.stringify({
            user_id: userId,
            file_name: written.history_path.split('/').pop(),
            storage_path: written.latest_path,
            history_path: written.history_path,
            size_bytes: written.size_bytes,
            hash: written.hash,
            data_hash: written.data_hash,
            created_at: new Date().toISOString()
          })
        }).then(function (r) { return r.ok; }).catch(function () { return false; });
        var cleanupPromise = body && body.cleanup === false
          ? Promise.resolve(null)
          : cleanupApply(userId).catch(function (e) {
            return { ok: false, error: e && e.message || 'Storage cleanup failed' };
          });
        return Promise.all([manifestPromise, cleanupPromise]).then(function (extras) {
          return jsonResponse({
            ok: true,
            success: true,
            uploaded: true,
            code: 'CANONICAL_BACKUP_WRITTEN',
            state: state,
            stage: 'storage_upload',
            bucket: 'user-content',
            path: written.path,
            latest_path: written.latest_path,
            history_path: written.history_path,
            history_status: written.history_status,
            cloud_snapshot_path: written.cloud_snapshot_path,
            hash: written.hash,
            data_hash: written.data_hash,
            size_bytes: written.size_bytes,
            collection_counts: written.collection_counts,
            synced_at: new Date().toISOString(),
            user_id: userId,
            manifest_recorded: extras[0],
            cleanup: extras[1],
            selected_backup: best.selected,
            backup_candidates: best.candidates || [],
            conflict: conflict,
            snapshot_storage: {
              bucket: 'user-content',
              latest_path: written.cloud_snapshot_path,
              latest_status: 'uploaded',
              uploaded_at: written.exported_at
            }
          });
        });
      });
    }).catch(function (e) {
      return backupErrorResponse(e, 'Cloud backup failed', 'storage_upload');
    });
  }

  // GET /__auth/backup/latest
  function handleGetLatestBackup() {
    var session = getSession();
    if (!session) return Promise.resolve(jsonResponse({ ok: false, error: 'no_session' }, 401));
    var userId = session.user && session.user.id;
    if (!userId) return Promise.resolve(jsonResponse({ ok: false, error: 'no_user_id' }, 401));

    return findBestCloudBackup(userId, { includeRaw: true }).then(function (best) {
      var selected = best.selected_internal;
      if (!selected || !selected.valid) {
        return jsonResponse({
          ok: true,
          success: true,
          code: 'NO_CLOUD_BACKUP',
          state: 'no_cloud_backup',
          backup_json: null,
          backup: null,
          empty: true,
          selected_backup: null,
          candidates: best.candidates || []
        });
      }
      var backupJson = canonicalBackupJson(selected.normalized, {
        exportedAt: selected.exported_at || new Date().toISOString(),
        appVersion: APP_VERSION
      });
      return downloadCloudSnapshot(userId).catch(function () { return null; }).then(function (cloudSnapshot) {
        return jsonResponse({
          ok: true,
          success: true,
          code: 'BEST_BACKUP_RETURNED',
          state: selected.rich ? 'restore_available' : 'cloud_empty',
          stage: 'storage_download',
          user_id: userId,
          backup_json: backupJson,
          backup: backupJson,
          backup_hash: hashText(backupJson),
          collection_counts: getCollectionCounts(backupJson),
          selected_backup: publicBackupCandidate(selected),
          candidates: best.candidates || [],
          backup_storage: { bucket: 'user-content', path: selected.path, source: 'best_backup_selector' },
          cloud_snapshot: cloudSnapshot
        });
      });
    }).catch(function (e) { return backupErrorResponse(e, 'Cloud backup download failed', 'storage_download'); });
  }

  // GET /__auth/backup/best — find the richest backup
  function handleGetBestBackup() {
    var session = getSession();
    if (!session) return Promise.resolve(jsonResponse({ ok: false, error: 'no_session' }, 401));
    var userId = session.user && session.user.id;
    if (!userId) return Promise.resolve(jsonResponse({ ok: false, error: 'no_user_id' }, 401));

    return findBestCloudBackup(userId, { includeRaw: true }).then(function (best) {
      var selected = best.selected_internal;
      var backupJson = selected && selected.valid ? canonicalBackupJson(selected.normalized, {
        exportedAt: selected.exported_at || new Date().toISOString(),
        appVersion: APP_VERSION
      }) : null;
      return jsonResponse({
        ok: true,
        success: true,
        code: 'BEST_BACKUP_SELECTED',
        state: selected && selected.rich ? 'restore_available' : (selected ? 'cloud_empty' : 'no_cloud_backup'),
        stage: 'storage_scan',
        selected: best.selected,
        selected_backup: best.selected,
        candidates: best.candidates || [],
        backup_json: backupJson,
        backup: backupJson,
        backup_hash: backupJson ? hashText(backupJson) : null,
        collection_counts: backupJson ? getCollectionCounts(backupJson) : null,
        local_recommendation: best.local_recommendation,
        warning_if_empty_latest: best.warning_if_empty_latest,
        empty: !selected
      });
    }).catch(function (e) { return backupErrorResponse(e, 'Best backup scan failed', 'storage_scan'); });
  }

  // POST /__auth/logout
  function handleLogout() {
    var session = getSession();
    var token = session && session.access_token;

    // Clear all local auth storage regardless of network outcome
    function clearLocal() {
      try {
        var ref = 'vteqquoqvksshmfhuepu';
        localStorage.removeItem('isotope-auth-token');
        localStorage.removeItem('sb-' + ref + '-auth-token');
        localStorage.removeItem('isotope-last-jwt');
        localStorage.removeItem('isotope-last-rt');
        localStorage.removeItem('isotope-last-session-raw');
      } catch (e) {}
    }

    if (!token) {
      clearLocal();
      return Promise.resolve(jsonResponse({ ok: true, android: true }));
    }

    // Revoke session on Supabase, then clear local
    return fetch(SUPA_URL + '/auth/v1/logout', {
      method: 'POST',
      headers: { 'apikey': SUPA_ANON_KEY, 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      credentials: 'omit'
    }).then(function () {
      clearLocal();
      return jsonResponse({ ok: true, android: true });
    }).catch(function () {
      clearLocal();
      return jsonResponse({ ok: true, android: true }); // logout succeeds locally even if network fails
    });
  }

  function uploadRawBackupJson(userId, rawJson, folder) {
    var text = typeof rawJson === 'string' ? rawJson : JSON.stringify(rawJson || {});
    var parsed = safeJsonParse(text, null);
    if (!isObject(parsed)) {
      var invalid = new Error('Backup JSON must be an object');
      invalid.status = 400;
      invalid.code = 'INVALID_BACKUP';
      throw invalid;
    }
    var now = new Date().toISOString();
    var prefix = folder === 'exports' ? 'exports' : 'imports';
    var hashPrefix = hashText(text).slice(0, 16);
    var archivePath = userId + '/' + prefix + '/' + safeIsoStamp(now) + '-' + hashPrefix + '.json';
    var latestPath = userId + '/' + prefix + '/latest.json';
    var pretty = JSON.stringify(parsed, null, 2);
    return storageUploadText(archivePath, pretty, false)
      .then(function (result) {
        assertStorageOk(result, 'Storage upload ' + archivePath, { ignoreAlreadyExists: true });
        return storageUploadText(latestPath, pretty, true);
      })
      .then(function (result) {
        assertStorageOk(result, 'Storage upload ' + latestPath);
        return {
          bucket: 'user-content',
          path: archivePath,
          latest_path: latestPath,
          hash: hashText(pretty),
          size_bytes: byteSize(pretty),
          uploaded_at: now
        };
      });
  }

  function applyBackupProfileToSupabase(userId, backupJson) {
    var data = getBackupData(backupJson);
    if (!data.profile) return Promise.resolve({ profile_applied: false });
    return supaJson('/rest/v1/user_profiles?on_conflict=user_id', {
      method: 'POST',
      headers: { 'Prefer': 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify({
        user_id: userId,
        profile_data: data.profile,
        updated_at: new Date().toISOString()
      })
    }).then(function (result) {
      if (!result.ok) {
        return {
          profile_applied: false,
          warning: result.body && (result.body.message || result.body.error) || 'Profile apply failed'
        };
      }
      return { profile_applied: true };
    }).catch(function (e) {
      return { profile_applied: false, warning: e && e.message || 'Profile apply failed' };
    });
  }

  // POST /__auth/import
  function handleImport(body) {
    var session = getSession();
    if (!session) return Promise.resolve(jsonResponse({ ok: false, error: 'no_session' }, 401));
    var userId = session.user && session.user.id;
    if (!userId) return Promise.resolve(jsonResponse({ ok: false, error: 'no_user_id' }, 401));

    var rawBackup = body && (body.backup_json !== undefined ? body.backup_json : (body.backup !== undefined ? body.backup : null));
    if (rawBackup === null || rawBackup === undefined) return Promise.resolve(errorResponse('No backup_json provided', 400));
    var backupText = typeof rawBackup === 'string' ? rawBackup : JSON.stringify(rawBackup);
    var normalized = normalizeBackup(backupText, { source_path: 'android_import' });
    if (!normalized.valid) return Promise.resolve(backupErrorResponse({ code: 'INVALID_BACKUP', status: 400, message: normalized.reason }, 'Invalid backup', 'request_validation'));

    return findBestCloudBackup(userId, { includeRaw: true }).then(function (best) {
      if (blockedEmptyOverwrite(normalized, best)) return blockedEmptyOverwriteResponse(normalized, best);
      return uploadRawBackupJson(userId, backupText, 'imports').then(function (importUpload) {
        return writeCanonicalBackup(userId, normalized, {
          source_path: importUpload.latest_path,
          source: 'android_manual_import'
        }).then(function (written) {
          return Promise.all([
            applyBackupProfileToSupabase(userId, written.backup_json),
            cleanupApply(userId).catch(function (e) { return { ok: false, error: e && e.message || 'Storage cleanup failed' }; })
          ]).then(function (extras) {
            return jsonResponse({
              ok: true,
              success: true,
              imported: true,
              code: 'IMPORT_ARCHIVED_AND_PROMOTED',
              state: 'restore_required',
              stage: 'storage_upload',
              user_id: userId,
              import_storage: importUpload,
              canonical_backup: {
                bucket: written.bucket,
                path: written.path,
                history_path: written.history_path,
                cloud_snapshot_path: written.cloud_snapshot_path,
                hash: written.hash,
                size_bytes: written.size_bytes,
                collection_counts: written.collection_counts
              },
              backup_json: written.backup_json,
              backup_hash: written.hash,
              applied: extras[0],
              cleanup: extras[1],
              collection_counts: written.collection_counts,
              restore_required_on_browser: true,
              storage_backed_collections: ['tasks', 'sessions', 'subjects', 'habits', 'dailyLogs', 'tests', 'exams', 'mockTests'],
              storage_backed_reason: 'Android archived and promoted the full backup. WebView must apply backup_json to local stores for UI-visible restore.',
              snapshot_storage: {
                bucket: 'user-content',
                latest_path: written.cloud_snapshot_path,
                latest_status: 'uploaded',
                uploaded_at: written.exported_at
              }
            });
          });
        });
      });
    }).catch(function (e) {
      return backupErrorResponse(e, 'Backup import failed', 'storage_upload');
    });
  }

  // POST /__auth/onboarding-complete — mark onboarding done for the current user
  function handleOnboardingComplete(body) {
    var session = getSession();
    if (!session) return Promise.resolve(jsonResponse({ ok: false, error: 'no_session' }, 401));
    var userId = session.user && session.user.id;
    if (!userId) return Promise.resolve(jsonResponse({ ok: false, error: 'no_user_id' }, 401));

    var now = new Date().toISOString();
    var onboardingData = body && (body.data || body.onboarding_data || body.onboarding);
    return supaJson('/rest/v1/user_onboarding?on_conflict=user_id', {
      method: 'POST',
      headers: { 'Prefer': 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify({
        user_id: userId,
        completed: true,
        completed_at: now,
        data: isObject(onboardingData) ? onboardingData : {},
        updated_at: now
      })
    }).then(function (result) {
      if (!result.ok) {
        return jsonResponse({ ok: false, error: result.body && (result.body.message || result.body.error) || 'Onboarding upsert failed' }, result.status || 500);
      }
      var row = Array.isArray(result.body) ? result.body[0] : result.body;
      if (!row || row.completed !== true) {
        return jsonResponse({ ok: false, error: 'Onboarding completion was not persisted' }, 500);
      }
      return jsonResponse({ ok: true, android: true, onboarding: row, onboarding_completed: true });
    }).catch(function (e) {
      return errorResponse(e.message);
    });
  }

  // POST /__auth/snapshot
  function handleSnapshot(body) {
    var session = getSession();
    if (!session) return Promise.resolve(jsonResponse({ ok: false, error: 'no_session' }, 401));
    var userId = session.user && session.user.id;
    if (!userId) return Promise.resolve(jsonResponse({ ok: false, error: 'no_user_id' }, 401));

    if (body && body.backup_json) {
      return handleUploadBackup(Object.assign({}, body, { source: body.source || 'android_snapshot' }));
    }

    if (window.IsotopeLocalDataAdapter && typeof window.IsotopeLocalDataAdapter.buildBackupPayloadFromLocal === 'function') {
      return Promise.resolve()
        .then(function () { return window.IsotopeLocalDataAdapter.buildBackupPayloadFromLocal(); })
        .then(function (payload) {
          return handleUploadBackup({
            backup_json: payload,
            source: body && body.source || 'android_local_snapshot',
            source_path: 'android_local_adapter'
          });
        })
        .catch(function (e) {
          return backupErrorResponse(e, 'Local backup adapter snapshot failed', 'local_snapshot');
        });
    }

    return Promise.resolve(jsonResponse({
      ok: false,
      success: false,
      code: 'LOCAL_BACKUP_ADAPTER_UNAVAILABLE',
      state: 'pending_local',
      stage: 'local_snapshot',
      retryable: true,
      error: 'Local backup adapter is not ready; snapshot was not uploaded.'
    }, 503));
  }

  // ── Edge function interceptors (mirrors server-side /__supa/functions/v1/* logic) ─
  // The server normally intercepts these before they hit Supabase edge functions.
  // On Android we must handle them in the bridge.

  // POST /__supa/functions/v1/finish-session — calls finish_session_sync RPC
  function handleFinishSession(body) {
    var session = getSession();
    if (!session) return Promise.resolve(jsonResponse({ ok: false, error: 'no_session' }, 401));
    var sessionId = body && (body.session_id || body.id) || null;
    if (!sessionId) {
      try { sessionId = window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : null; } catch (e) {}
    }
    if (!sessionId) sessionId = '00000000-0000-4000-8000-' + String(Date.now()).slice(-12).padStart(12, '0');
    var duration = body && (body.duration_minutes !== undefined ? body.duration_minutes : body.durationMinutes);
    var rpcBody = {
      p_session_id: sessionId,
      p_action: body && body.action || 'complete',
      p_duration_minutes: Math.max(0, parseInt(duration, 10) || 0),
      p_group_id: body && (body.group_id || body.groupId) || null,
      p_session_type: body && (body.session_type || body.sessionType) || 'focus',
      p_notes: body && body.notes || null,
      p_ended_at: body && (body.ended_at || body.endedAt) || null
    };
    return fetch(SUPA_URL + '/rest/v1/rpc/finish_session_sync', {
      method: 'POST',
      headers: {
        'apikey': SUPA_ANON_KEY,
        'Authorization': 'Bearer ' + session.access_token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rpcBody),
      credentials: 'omit'
    }).then(function (r) {
      return r.json().then(function (d) {
        if (!r.ok || d && d.error) {
          return jsonResponse({
            ok: false,
            success: false,
            error: d && (d.error || d.message) || 'Session sync failed',
            detail: d,
            data: d
          }, r.ok ? 502 : (r.status || 502));
        }
        return handleSnapshot({ source: 'finish_session' }).then(function (snapshotResp) {
          return snapshotResp.json().catch(function () { return {}; }).then(function (snapshot) {
            if (!snapshotResp.ok || snapshot.ok === false) {
              return jsonResponse({
                ok: false,
                success: false,
                error: snapshot.error || 'Cloud snapshot upload failed after session sync',
                detail: snapshot,
                data: d
              }, snapshotResp.status || 502);
            }
            var payload = Object.assign({}, d || {}, {
              ok: true,
              success: true,
              cloud_snapshot: snapshot.cloud_snapshot || null,
              snapshot_storage: snapshot.snapshot_storage || null
            });
            return jsonResponse(payload);
          });
        });
      });
    }).catch(function (e) {
      return errorResponse(e.message);
    });
  }

  function intFrom(value, fallback, min, max) {
    var n = parseInt(value, 10);
    if (!Number.isFinite(n)) n = fallback;
    if (typeof min === 'number') n = Math.max(min, n);
    if (typeof max === 'number') n = Math.min(max, n);
    return n;
  }

  function rpcPost(path, body, fallbackError, mapper, allowAnon) {
    var session = getSession();
    var token = session && session.access_token || (allowAnon ? SUPA_ANON_KEY : null);
    if (!token) return Promise.resolve(jsonResponse({ ok: false, error: 'no_session' }, 401));
    return fetch(SUPA_URL + path, {
      method: 'POST',
      headers: {
        'apikey': SUPA_ANON_KEY,
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body || {}),
      credentials: 'omit'
    }).then(function (r) {
      return r.text().then(function (text) {
        var d = safeJsonParse(text, text ? { raw: text } : null);
        if (!r.ok) return jsonResponse({ ok: false, error: d && (d.message || d.error) || fallbackError, data: null, detail: d }, r.status || 500);
        return jsonResponse(mapper ? mapper(d) : { ok: true, data: d, android: true });
      });
    }).catch(function (e) {
      return jsonResponse({ ok: false, error: e && e.message || fallbackError, data: null, android: true }, 503);
    });
  }

  function leaderboardPayloadFromRows(rows, period) {
    var rankings = Array.isArray(rows) ? rows : [];
    return {
      ok: true,
      rankings: rankings,
      data: rankings,
      period: period,
      source: 'rpc',
      currentUserRank: null,
      display_names_resolved: true,
      android: true
    };
  }

  // GET /__supa/functions/v1/get-leaderboard — live leaderboard from DB
  function handleGetLeaderboard(searchParams, body) {
    body = body || {};
    var limit = body.limit || (searchParams && searchParams.get ? searchParams.get('limit') : null) || 50;
    var offset = body.offset || (searchParams && searchParams.get ? searchParams.get('offset') : null) || 0;
    var period = body.period || (searchParams && searchParams.get ? searchParams.get('period') : null) || 'weekly';
    var rpcBody = {
      p_period: String(period || 'weekly'),
      p_limit: intFrom(limit, 50, 1, 100),
      p_offset: intFrom(offset, 0, 0, 5000)
    };
    return rpcPost('/rest/v1/rpc/get_leaderboard', rpcBody, 'Leaderboard RPC failed', function (rows) {
      return leaderboardPayloadFromRows(rows, rpcBody.p_period);
    }, false);
  }

  // GET /__supa/functions/v1/get-daily-leaderboard
  // When invoked from SingleGroup with a groupId, route to the group-specific
  // leaderboard RPC (get_group_leaderboard) so members see group-scoped rankings.
  // When invoked globally (no groupId), fall back to the global daily leaderboard.
  function handleGetDailyLeaderboard(searchParams, body) {
    body = body || {};
    var groupId = body.groupId || body.group_id || (searchParams && searchParams.get ? searchParams.get('groupId') : null);
    if (groupId) {
      return handleGetGroupLeaderboard(Object.assign({}, body, { groupId: groupId, period: 'daily' }));
    }
    return handleGetLeaderboard(searchParams, Object.assign({}, body, { period: 'daily' }));
  }

  // POST /__supa/functions/v1/get-group-leaderboard
  function handleGetGroupLeaderboard(body) {
    var groupId = body && (body.group_id || body.groupId || body.id) || null;
    if (!groupId) return Promise.resolve(jsonResponse({ ok: false, error: 'group_id_required', data: [] }, 400));
    var rpcBody = {
      p_group_id: groupId,
      p_limit: intFrom(body && body.limit, 20, 1, 100)
    };
    return rpcPost('/rest/v1/rpc/get_group_leaderboard', rpcBody, 'Group leaderboard RPC failed', function (rows) {
      var raw = Array.isArray(rows) ? rows : [];
      // Normalize every row: RPC returns `points` (integer); ensure no NaN
      var rankings = raw.map(function (row, idx) {
        var pts  = Number.isFinite(Number(row.points))       ? Number(row.points)       : 0;
        var hrs  = Number.isFinite(Number(row.hours))        ? Number(row.hours)        : pts / 3600;
        var thrs = Number.isFinite(Number(row.total_hours))  ? Number(row.total_hours)  : hrs;
        var rnk  = Number.isFinite(Number(row.rank))         ? Number(row.rank)         : idx + 1;
        return Object.assign({}, row, {
          rank:        rnk,
          points:      pts,
          hours:       hrs,
          total_hours: thrs,
          score:       Number.isFinite(Number(row.score)) ? Number(row.score) : pts
        });
      });
      return {
        ok: true,
        rankings: rankings,
        data: rankings,
        period: body && body.period || 'weekly',
        source: 'rpc',
        currentUserRank: null,
        display_names_resolved: true,
        android: true
      };
    });
  }

  // POST /__supa/functions/v1/get-group-analytics
  function handleGetGroupAnalytics(body) {
    var groupId = body && (body.group_id || body.groupId || body.id) || null;
    if (!groupId) return Promise.resolve(jsonResponse({ ok: false, error: 'group_id_required', data: null }, 400));
    var rpcBody = {
      p_group_id: groupId,
      p_days: intFrom(body && (body.days || body.p_days), 30, 1, 366)
    };
    return rpcPost('/rest/v1/rpc/get_group_analytics_from_snapshots', rpcBody, 'Group analytics RPC failed', function (rows) {
      var series = Array.isArray(rows) ? rows : [];
      var totalSeconds = series.reduce(function (sum, row) { return sum + Number(row.total_seconds || 0); }, 0);
      var memberCount = series.reduce(function (max, row) { return Math.max(max, Number(row.member_count || 0)); }, 0);
      return {
        ok: true,
        data: series,
        group_id: groupId,
        member_count: memberCount,
        total_sessions: 0,
        total_hours: Math.round((totalSeconds / 3600) * 100) / 100,
        weekly_hours: Math.round((totalSeconds / 3600) * 100) / 100,
        monthly_hours: Math.round((totalSeconds / 3600) * 100) / 100,
        group_streak: 0,
        members_active_today: 0,
        avg_session_minutes: 0,
        peak_hour: 12,
        top_contributor: null,
        source: 'rpc',
        display_names_resolved: true,
        android: true
      };
    });
  }

  // POST /__auth/restore-best-backup
  function handleRestoreBestBackup(body) {
    var session = getSession();
    if (!session) return Promise.resolve(jsonResponse({ ok: false, error: 'no_session' }, 401));
    var userId = session.user && session.user.id;
    if (!userId) return Promise.resolve(jsonResponse({ ok: false, error: 'no_user_id' }, 401));
    return findBestCloudBackup(userId, { includeRaw: true }).then(function (best) {
      var selected = best.selected_internal;
      if (!selected || !selected.valid) {
        return jsonResponse({ ok: false, success: false, code: 'STORAGE_NOT_FOUND', error: 'No valid cloud backup exists' }, 404);
      }
      var backupJson = canonicalBackupJson(selected.normalized, {
        exportedAt: selected.exported_at || new Date().toISOString(),
        appVersion: APP_VERSION
      });
      var promotePromise = body && body.promote === false
        ? Promise.resolve(null)
        : writeCanonicalBackup(userId, selected.normalized, { source_path: selected.path, source: 'android_restore_best_backup' });
      return promotePromise.then(function (promoted) {
        return jsonResponse({
          ok: true,
          success: true,
          code: 'RESTORE_BEST_BACKUP_READY',
          state: 'restore_required',
          stage: 'storage_download',
          user_id: userId,
          selected_backup: publicBackupCandidate(selected),
          candidates: best.candidates || [],
          backup_json: backupJson,
          backup: backupJson,
          backup_hash: hashText(backupJson),
          collection_counts: getCollectionCounts(backupJson),
          promoted: promoted ? {
            path: promoted.path,
            history_path: promoted.history_path,
            cloud_snapshot_path: promoted.cloud_snapshot_path,
            hash: promoted.hash,
            size_bytes: promoted.size_bytes,
            collection_counts: promoted.collection_counts
          } : null,
          restore_required_on_browser: true,
          android: true
        });
      });
    }).catch(function (e) {
      return backupErrorResponse(e, 'Restore best backup failed', 'storage_download');
    });
  }

  // ── Browser sync helper compatibility ─────────────────────────────────────
  // The compiled web app expects server.mjs to install these helpers. Android
  // does not run server.mjs, so the bridge owns the same local restore/upload
  // state machine.
  var syncLocks = {};

  function readSyncMetadata() {
    return safeJsonParse(localStorage.getItem('isotope_sync_metadata') || '{}', {}) || {};
  }

  function writeSyncMetadata(patch) {
    var next = Object.assign({}, readSyncMetadata(), patch || {});
    localStorage.setItem('isotope_sync_metadata', JSON.stringify(next));
    try {
      window.dispatchEvent(new CustomEvent('isotope:sync_metadata', { detail: next }));
    } catch (e) {}
    return next;
  }

  function writeSyncHistory(entry) {
    var rows = safeJsonParse(localStorage.getItem('isotope_sync_history') || '[]', []);
    if (!Array.isArray(rows)) rows = [];
    rows.unshift(Object.assign({ at: new Date().toISOString() }, entry || {}));
    localStorage.setItem('isotope_sync_history', JSON.stringify(rows.slice(0, 80)));
  }

  function yieldToWebView() {
    return new Promise(function (resolve) { setTimeout(resolve, 0); });
  }

  function responseJson(response, fallback) {
    return response.json().catch(function () { return {}; }).then(function (data) {
      if (response.ok && data && data.ok !== false) return data;
      var err = new Error(data && (data.message || data.error) || fallback || 'Request failed');
      err.status = response.status;
      err.code = data && data.code || (response.status === 401 ? 'AUTH_REQUIRED' : 'REQUEST_FAILED');
      err.payload = data || {};
      throw err;
    });
  }

  function isAuthError(error) {
    return !!error && (error.status === 401 || error.code === 'AUTH_REQUIRED' || /no_session|auth|log in|session missing/i.test(error.message || ''));
  }

  function isEmptyOverwriteBlocked(error) {
    return !!error && (error.code === 'BLOCKED_EMPTY_OVERWRITE' || error.__isEmptyOverwriteBlocked || /richer backup|empty overwrite/i.test(error.message || ''));
  }

  function isPermissionError(error) {
    return !!error && (error.code === 'STORAGE_PERMISSION_DENIED' || error.status === 403 || /permission|policy|forbidden|rls/i.test(error.message || ''));
  }

  function syncAuthBlock(reason) {
    window.__isoSyncAuthBlocked = true;
    writeSyncMetadata({
      last_sync_status: 'paused_auth',
      last_error: reason || 'Authentication required. Log in again to sync.'
    });
  }

  function withSyncLock(name, fn) {
    if (syncLocks[name]) {
      var locked = new Error('Cloud sync is already running.');
      locked.code = 'SYNC_ALREADY_RUNNING';
      return Promise.reject(locked);
    }
    syncLocks[name] = true;
    writeSyncMetadata({
      last_sync_status: 'syncing',
      last_error: null,
      active_operation: name,
      active_started_at: new Date().toISOString()
    });
    return Promise.resolve()
      .then(fn)
      .finally(function () {
        syncLocks[name] = false;
        writeSyncMetadata({ active_operation: null, active_started_at: null });
      });
  }

  function buildLocalBackupText(buildBackup) {
    var adapter = window.IsotopeLocalDataAdapter || null;
    if (adapter && typeof adapter.buildBackupPayloadFromLocal === 'function') {
      return Promise.resolve(adapter.buildBackupPayloadFromLocal()).then(function (payload) {
        return JSON.stringify(payload || {});
      });
    }
    if (typeof buildBackup === 'function') {
      return Promise.resolve(buildBackup()).then(function (payload) {
        return typeof payload === 'string' ? payload : JSON.stringify(payload || {});
      });
    }
    return Promise.resolve('');
  }

  function countLocalData(backupText) {
    var adapter = window.IsotopeLocalDataAdapter || null;
    if (adapter && typeof adapter.countLocalData === 'function') {
      return Promise.resolve(adapter.countLocalData());
    }
    return Promise.resolve(getCollectionCounts(backupText || '{}'));
  }

  function isLocalWorkspaceEmpty(backupText) {
    var adapter = window.IsotopeLocalDataAdapter || null;
    if (adapter && typeof adapter.isLocalWorkspaceEmpty === 'function') {
      return Promise.resolve(adapter.isLocalWorkspaceEmpty());
    }
    return Promise.resolve(normalizeBackup(backupText || '{}').empty);
  }

  function applyCloudBackupToLocal(backupText, meta, applyBackup) {
    var adapter = window.IsotopeLocalDataAdapter || null;
    if (adapter && typeof adapter.applyBackupToLocal === 'function') {
      return Promise.resolve(adapter.applyBackupToLocal(backupText, meta || {}));
    }
    if (typeof applyBackup === 'function') {
      return Promise.resolve(applyBackup(backupText)).then(function () {
        try {
          window.dispatchEvent(new CustomEvent('isotope:sync_refresh', { detail: { source: 'cloud_restore' } }));
        } catch (e) {}
        return { ok: true, fallback_apply: true };
      });
    }
    var err = new Error('No local restore adapter is available.');
    err.code = 'LOCAL_RESTORE_ADAPTER_UNAVAILABLE';
    throw err;
  }

  function didCountsGrow(before, after) {
    before = before || {};
    after = after || {};
    return ['tasks', 'sessions', 'subjects', 'habits', 'exams', 'tests', 'mockTests'].some(function (key) {
      return Number(after[key] || 0) > Number(before[key] || 0);
    });
  }

  function uploadBackupJsonCompat(backupJson, options) {
    options = options || {};
    var text = typeof backupJson === 'string' ? backupJson : JSON.stringify(backupJson || {});
    var hash = hashText(text);
    return withSyncLock('upload', function () {
      return yieldToWebView()
        .then(function () {
          return handleUploadBackup({
            backup_json: text,
            source: options.source || options.reason || 'android_manual_export',
            source_path: options.source_path || 'android_runtime_helper',
            cleanup: options.cleanup
          });
        })
        .then(function (response) { return responseJson(response, 'Backup upload failed'); })
        .then(function (data) {
          writeSyncMetadata({
            last_sync_status: 'synced',
            last_backup_hash: data.hash || hash,
            last_uploaded_hash: data.hash || hash,
            last_uploaded_data_hash: data.data_hash || null,
            last_uploaded_bytes: text.length,
            last_snapshot_at: data.synced_at || new Date().toISOString(),
            pending_count: 0,
            last_error: null
          });
          writeSyncHistory({
            op: 'upload',
            status: data.skipped ? 'skipped' : 'ok',
            source: options.source || 'android_upload',
            bytes: text.length,
            hash: data.hash || hash
          });
          return data;
        });
    }).catch(function (error) {
      if (isAuthError(error)) syncAuthBlock(error.message);
      else if (isEmptyOverwriteBlocked(error)) writeSyncMetadata({ last_sync_status: 'blocked_empty_overwrite', last_error: error.message });
      else writeSyncMetadata({ last_sync_status: isPermissionError(error) ? 'failed_permission' : 'failed', last_error: error.message || 'Backup upload failed' });
      writeSyncHistory({ op: 'upload', status: 'failed', source: options.source || 'android_upload', error: error.message || 'Backup upload failed' });
      throw error;
    });
  }

  function downloadBackupJsonCompat(options) {
    options = options || {};
    return withSyncLock('download', function () {
      return handleGetLatestBackup()
        .then(function (response) { return responseJson(response, 'Download failed'); })
        .then(function (data) {
          var text = data.backup_json || '';
          if (!text) return null;
          var hash = data.backup_hash || hashText(text);
          writeSyncMetadata({
            last_sync_status: 'synced',
            last_downloaded_hash: hash,
            last_downloaded_bytes: text.length,
            last_snapshot_at: data.synced_at || data.snapshot_at || new Date().toISOString(),
            last_error: null
          });
          writeSyncHistory({
            op: 'download',
            status: 'ok',
            source: options.source || 'android_download',
            bytes: text.length,
            hash: hash
          });
          return text;
        });
    }).catch(function (error) {
      if (isAuthError(error)) syncAuthBlock(error.message);
      writeSyncMetadata({ last_sync_status: 'failed', last_error: error.message || 'Download failed' });
      writeSyncHistory({ op: 'download', status: 'failed', source: options.source || 'android_download', error: error.message || 'Download failed' });
      throw error;
    });
  }

  function importBackupJsonCompat(backupJson, mode, options) {
    options = options || {};
    var text = typeof backupJson === 'string' ? backupJson : JSON.stringify(backupJson || {});
    var hash = options.hash || hashText(text);
    return withSyncLock('import', function () {
      return yieldToWebView()
        .then(function () {
          return handleImport({ backup_json: text, mode: mode || 'merge' });
        })
        .then(function (response) { return responseJson(response, 'Backup import failed'); })
        .then(function (data) {
          return applyCloudBackupToLocal(text, {
            hash: hash,
            source_path: data.import_storage && (data.import_storage.latest_path || data.import_storage.path) || 'android_import'
          }, null).then(function (restoreResult) {
            writeSyncMetadata({
              last_sync_status: 'synced',
              last_imported_hash: hash,
              last_imported_bytes: text.length,
              last_snapshot_at: new Date().toISOString(),
              pending_count: 0,
              last_error: null
            });
            writeSyncHistory({
              op: 'import',
              status: 'ok',
              mode: mode || 'merge',
              source: options.source || 'android_import',
              bytes: text.length,
              hash: hash
            });
            return Object.assign({}, data, { restore_result: restoreResult });
          });
        });
    }).catch(function (error) {
      if (isAuthError(error)) syncAuthBlock(error.message);
      else if (isEmptyOverwriteBlocked(error)) writeSyncMetadata({ last_sync_status: 'blocked_empty_overwrite', last_error: error.message });
      else writeSyncMetadata({ last_sync_status: isPermissionError(error) ? 'failed_permission' : 'failed', last_error: error.message || 'Backup import failed' });
      writeSyncHistory({ op: 'import', status: 'failed', source: options.source || 'android_import', error: error.message || 'Backup import failed' });
      throw error;
    });
  }

  function refreshCloudSnapshotCompat(source) {
    var src = source || 'android_snapshot';
    return withSyncLock('snapshot', function () {
      return handleSnapshot({ source: src })
        .then(function (response) { return responseJson(response, 'Cloud snapshot upload failed'); })
        .then(function (data) {
          writeSyncMetadata({
            last_sync_status: 'synced',
            last_snapshot_at: data.synced_at || new Date().toISOString(),
            pending_count: 0,
            last_error: null
          });
          writeSyncHistory({ op: 'snapshot', status: 'ok', source: src });
          return data;
        });
    }).catch(function (error) {
      if (isAuthError(error)) syncAuthBlock(error.message);
      else if (isEmptyOverwriteBlocked(error)) writeSyncMetadata({ last_sync_status: 'blocked_empty_overwrite', last_error: error.message });
      else writeSyncMetadata({ last_sync_status: isPermissionError(error) ? 'failed_permission' : 'failed', last_error: error.message || 'Cloud snapshot upload failed' });
      writeSyncHistory({ op: 'snapshot', status: 'failed', source: src, error: error.message || 'Cloud snapshot upload failed' });
      throw error;
    });
  }

  function runManualCloudSyncCompat(buildBackup, applyBackup, source) {
    var src = source || 'manual_full_sync';
    return withSyncLock('manual_sync', function () {
      var bytes = 0;
      var hash = null;
      var uploaded = false;
      var uploadSkipped = false;
      var downloaded = false;
      var imported = false;
      var selected = null;
      var backupJson = '';
      return yieldToWebView()
        .then(function () {
          writeSyncMetadata({ last_sync_status: 'selecting_backup', last_error: null });
          return buildLocalBackupText(buildBackup);
        })
        .then(function (text) {
          backupJson = String(text || '');
          bytes = backupJson.length;
          hash = hashText(stableStringify(getBackupData(backupJson || '{}')));
          return Promise.all([
            countLocalData(backupJson),
            isLocalWorkspaceEmpty(backupJson),
            handleGetBestBackup().then(function (response) { return responseJson(response, 'Best backup scan failed'); })
          ]);
        })
        .then(function (parts) {
          var beforeCounts = parts[0] || {};
          var emptyLocal = parts[1] === true;
          var best = parts[2] || {};
          selected = best.selected || best.selected_backup || null;
          var cloudRich = !!(selected && selected.rich === true && selected.empty !== true);
          if (!emptyLocal || !cloudRich) return null;
          writeSyncMetadata({ last_sync_status: 'restoring_cloud', last_error: null });
          return handleRestoreBestBackup({ promote: true })
            .then(function (response) { return responseJson(response, 'Restore best backup failed'); })
            .then(function (restore) {
              var cloudBackup = restore.backup_json || '';
              var cloudHash = restore.backup_hash || hashText(cloudBackup);
              if (!cloudBackup) throw new Error('Selected cloud backup did not include backup_json.');
              return yieldToWebView()
                .then(function () { return applyCloudBackupToLocal(cloudBackup, { source_path: selected && selected.path || null, hash: cloudHash }, applyBackup); })
                .then(function (restoreResult) {
                  imported = true;
                  downloaded = true;
                  return countLocalData(cloudBackup).then(function (afterCounts) {
                    if (!didCountsGrow(beforeCounts, afterCounts) && selected && selected.collection_counts) {
                      throw new Error('Cloud restore did not increase local data counts; upload blocked.');
                    }
                    writeSyncMetadata({
                      last_imported_hash: cloudHash,
                      last_imported_bytes: cloudBackup.length,
                      last_restore_message: restoreResult && restoreResult.message || null,
                      last_sync_status: 'verifying_restore'
                    });
                    writeSyncHistory({
                      op: 'restore_best_cloud_backup',
                      status: 'ok',
                      source: src,
                      bytes: cloudBackup.length,
                      hash: cloudHash,
                      selected_path: selected && selected.path || null,
                      counts: afterCounts
                    });
                    return buildLocalBackupText(buildBackup).then(function (rebuilt) {
                      backupJson = String(rebuilt || '');
                      bytes = backupJson.length;
                      hash = hashText(stableStringify(getBackupData(backupJson || '{}')));
                    });
                  });
                });
            });
        })
        .then(function () {
          writeSyncMetadata({ last_sync_status: 'uploading_local', last_error: null });
          return handleUploadBackup({
            backup_json: backupJson,
            source: src,
            source_path: 'android_manual_sync'
          });
        })
        .then(function (response) { return responseJson(response, 'Cloud sync failed'); })
        .then(function (uploadResult) {
          uploaded = uploadResult.skipped !== true;
          uploadSkipped = uploadResult.skipped === true;
          writeSyncMetadata({
            last_sync_status: 'synced',
            last_error: null,
            pending_count: 0,
            last_snapshot_at: uploadResult.synced_at || new Date().toISOString()
          });
          writeSyncHistory({
            op: 'manual_sync',
            status: 'ok',
            source: src,
            bytes: bytes,
            hash: hash,
            uploaded: uploaded,
            upload_skipped: uploadSkipped,
            downloaded: downloaded,
            imported: imported,
            selected_path: selected && selected.path || null
          });
          return {
            ok: true,
            uploaded: uploaded,
            upload_skipped: uploadSkipped,
            downloaded: downloaded,
            imported: imported,
            hash: hash,
            bytes: bytes,
            selected_backup: selected,
            upload: uploadResult
          };
        });
    }).catch(function (error) {
      if (isAuthError(error)) syncAuthBlock(error.message);
      else if (isEmptyOverwriteBlocked(error)) writeSyncMetadata({ last_sync_status: 'blocked_empty_overwrite', last_error: error.message || 'Cloud has richer backup. Restore it before uploading this empty device.' });
      else if (isPermissionError(error)) writeSyncMetadata({ last_sync_status: 'failed_permission', last_error: error.message || 'Storage permission error' });
      else writeSyncMetadata({ last_sync_status: 'failed', last_error: error.message || 'Cloud sync failed' });
      writeSyncHistory({
        op: 'manual_sync',
        status: isAuthError(error) ? 'paused_auth' : (isPermissionError(error) ? 'failed_permission' : 'failed'),
        source: src,
        error: error.message || 'Cloud sync failed'
      });
      throw error;
    });
  }

  function downloadAndImportBackupCompat(applyBackup, source) {
    var src = source || 'cloud_download';
    return withSyncLock('download_import', function () {
      var result = null;
      var imported = false;
      return handleGetLatestBackup()
        .then(function (response) { return responseJson(response, 'Download/import failed'); })
        .then(function (data) {
          result = data;
          if (!data.backup_json) return null;
          var hash = data.backup_hash || hashText(data.backup_json);
          var meta = readSyncMetadata();
          if (meta.last_imported_hash === hash) return null;
          return yieldToWebView()
            .then(function () {
              return applyCloudBackupToLocal(data.backup_json, {
                hash: hash,
                source_path: data.selected_backup && data.selected_backup.path || null
              }, applyBackup);
            })
            .then(function () {
              imported = true;
              writeSyncMetadata({ last_imported_hash: hash, last_imported_bytes: data.backup_json.length });
            });
        })
        .then(function () {
          var snapshotAt = result && (result.synced_at || result.snapshot_at)
            || result && result.cloud_snapshot && (result.cloud_snapshot.exported_at || result.cloud_snapshot.downloaded_at)
            || result && result.selected_backup && (result.selected_backup.exported_at || result.selected_backup.updated_at || result.selected_backup.created_at)
            || (result && result.backup_json ? new Date().toISOString() : null);
          var patch = { last_sync_status: 'synced', last_error: null, pending_count: 0 };
          if (snapshotAt) patch.last_snapshot_at = snapshotAt;
          writeSyncMetadata(patch);
          writeSyncHistory({
            op: 'download_import',
            status: result && result.backup_json ? 'ok' : 'skipped',
            source: src,
            bytes: result && result.backup_json ? result.backup_json.length : 0,
            hash: result && (result.backup_hash || (result.backup_json ? hashText(result.backup_json) : null)) || null,
            imported: imported
          });
          return {
            ok: true,
            imported: imported,
            downloaded: !!(result && result.backup_json),
            hash: result && (result.backup_hash || (result.backup_json ? hashText(result.backup_json) : null)) || null,
            selected_backup: result && result.selected_backup || null
          };
        });
    }).catch(function (error) {
      if (isAuthError(error)) syncAuthBlock(error.message);
      else writeSyncMetadata({ last_sync_status: 'failed', last_error: error.message || 'Download/import failed' });
      writeSyncHistory({ op: 'download_import', status: 'failed', source: src, error: error.message || 'Download/import failed' });
      throw error;
    });
  }

  // /__supa/* — proxy to Supabase directly
  function handleSupaProxy(url, opts, body) {
    var supaPath = url.replace(/^[^/]*\/\/[^/]*/, '').replace(/^\/__supa/, '');
    var token = getAccessToken();
    var headers = Object.assign({}, opts.headers || {}, {
      'apikey': SUPA_ANON_KEY,
      'Authorization': 'Bearer ' + (token || SUPA_ANON_KEY)
    });
    return fetch(SUPA_URL + supaPath, Object.assign({}, opts, {
      headers: headers,
      body: body,
      credentials: 'omit'
    })).catch(function (e) {
      return errorResponse('Supabase proxy error: ' + e.message);
    });
  }

  function fetchGroupSlugForInvite(groupId) {
    if (!groupId) return Promise.resolve(null);
    return supaJson('/rest/v1/groups?select=slug&id=eq.' + encodeURIComponent(groupId) + '&limit=1', {
      method: 'GET'
    }).then(function (result) {
      var row = result.ok ? firstRow(result) : null;
      return row && row.slug || null;
    }).catch(function () {
      return null;
    });
  }

  function normalizeInviteRpcPayload(payload) {
    var item = Array.isArray(payload) ? payload[0] : payload;
    if (!isObject(item)) return Promise.resolve(payload);
    var normalized = Object.assign({}, item);
    if (typeof normalized.success !== 'boolean' && typeof normalized.ok === 'boolean') normalized.success = normalized.ok;
    if (typeof normalized.success !== 'boolean' && (normalized.group_id || normalized.group_slug || normalized.slug)) normalized.success = true;
    var groupId = normalized.group_id || normalized.groupId || null;
    if (normalized.group_slug || normalized.slug || !groupId) {
      if (!normalized.group_slug && normalized.slug) normalized.group_slug = normalized.slug;
      if (!normalized.slug && normalized.group_slug) normalized.slug = normalized.group_slug;
      return Promise.resolve(Array.isArray(payload) ? [normalized] : normalized);
    }
    return fetchGroupSlugForInvite(groupId).then(function (slug) {
      normalized.group_slug = slug || groupId;
      normalized.slug = normalized.group_slug;
      return Array.isArray(payload) ? [normalized] : normalized;
    });
  }

  function handleDirectInviteRpc(url, init) {
    return _originalFetch.call(window, url, init || {}).then(function (response) {
      return response.text().then(function (text) {
        var payload = safeJsonParse(text, text ? { raw: text } : null);
        if (!response.ok) {
          return jsonResponse(payload || { ok: false, error: 'Invite RPC failed' }, response.status || 500);
        }
        return normalizeInviteRpcPayload(payload).then(function (normalized) {
          return jsonResponse(normalized, response.status || 200);
        });
      });
    }).catch(function (e) {
      return jsonResponse({ ok: false, success: false, error: e && e.message || 'Invite RPC failed' }, 503);
    });
  }

  // ── Main fetch interceptor ──────────────────────────────────────────────────
  var _originalFetch = window.fetch || fetch;
  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url ? input.url : String(input));
    var method = (init && init.method ? init.method : 'GET').toUpperCase();

    // Resolve relative URLs
    try {
      if (url.startsWith('/') || !url.includes('://')) {
        url = window.location.origin + (url.startsWith('/') ? '' : '/') + url;
      }
    } catch (e) {}

    var pathname;
    try { pathname = new URL(url).pathname; } catch (e) { pathname = url; }

    // ── Local static responses ────────────────────────────────────────────────
    var localResp = handleLocalStatus(url);
    if (localResp) return localResp;

    // ── Server-check from pwa-local.js: suppress and return ok ───────────────
    // pwa-local.js pings /api/version to check if local server is up.
    // In Android mode, always report server as online.
    if (pathname === '/api/version') {
      return Promise.resolve(jsonResponse({ version: APP_VERSION, android: true }));
    }

    // ── Auth routes ───────────────────────────────────────────────────────────
    if (pathname.startsWith('/__auth/') || pathname.startsWith('/__auth')) {
      var bodyPromise;
      if (init && init.body) {
        bodyPromise = Promise.resolve().then(function () {
          try {
            var b = init.body;
            if (typeof b === 'string') return JSON.parse(b);
            return b;
          } catch (e) { return {}; }
        });
      } else {
        bodyPromise = Promise.resolve({});
      }

      return bodyPromise.then(function (body) {
        if (pathname === '/__auth/login') return handleLogin(body);
        if (pathname === '/__auth/signup') return handleSignup(body);
        if (pathname === '/__auth/check')  return handleCheck(body);
        if (pathname === '/__auth/logout') return handleLogout();
        if (pathname === '/__auth/bootstrap') return handleBootstrap();
        if (pathname === '/__auth/profile') {
          return method === 'POST' ? handlePostProfile(body) : handleGetProfile();
        }
        if (pathname === '/__auth/backup') {
          return method === 'POST' ? handleUploadBackup(body) : handleGetLatestBackup();
        }
        if (pathname === '/__auth/backup/latest') return handleGetLatestBackup();
        if (pathname === '/__auth/backup/best')   return handleGetBestBackup();
        if (pathname === '/__auth/import')              return handleImport(body);
        if (pathname === '/__auth/snapshot')            return handleSnapshot(body);
        if (pathname === '/__auth/restore-best-backup') return handleRestoreBestBackup(body);
        if (pathname === '/__auth/storage/group-icon') {
          return uploadGroupIconCompat(body && (body.data_url || body.dataUrl || body.content || body.body || body.file), body || {})
            .then(function (result) { return jsonResponse(result); })
            .catch(function (e) {
              return jsonResponse({
                ok: false,
                error: e && e.message || 'Group icon upload failed',
                code: e && e.code || 'GROUP_ICON_UPLOAD_FAILED'
              }, e && e.status || 500);
            });
        }
        if (pathname === '/__auth/storage/study-material') {
          return uploadStudyMaterialCompat(body && (body.data_url || body.dataUrl || body.content || body.body || body.file), body || {})
            .then(function (result) { return jsonResponse(result); })
            .catch(function (e) {
              return jsonResponse({
                ok: false,
                error: e && e.message || 'Study material upload failed',
                code: e && e.code || 'STUDY_MATERIAL_UPLOAD_FAILED'
              }, e && e.status || 500);
            });
        }
        if (pathname === '/__auth/storage/cleanup-preview') {
          var session = getSession();
          var userId = session && session.user && session.user.id;
          if (!session) return jsonResponse({ ok: false, error: 'no_session' }, 401);
          if (!userId) return jsonResponse({ ok: false, error: 'no_user_id' }, 401);
          return cleanupPreview(userId).then(function (preview) {
            return jsonResponse(Object.assign({
              ok: true,
              success: true,
              code: 'CLEANUP_PREVIEW_READY',
              state: 'preview',
              stage: 'storage_scan'
            }, preview));
          }).catch(function (e) {
            return backupErrorResponse(e, 'Storage cleanup preview failed', 'storage_scan');
          });
        }
        if (pathname === '/__auth/storage/cleanup-apply') {
          var cleanupSession = getSession();
          var cleanupUserId = cleanupSession && cleanupSession.user && cleanupSession.user.id;
          if (!cleanupSession) return jsonResponse({ ok: false, error: 'no_session' }, 401);
          if (!cleanupUserId) return jsonResponse({ ok: false, error: 'no_user_id' }, 401);
          if (!body || body.confirm !== true) {
            return jsonResponse({
              ok: false,
              success: false,
              code: 'CONFIRMATION_REQUIRED',
              state: 'blocked',
              stage: 'request_validation',
              message: 'Cleanup apply requires confirm:true after reviewing preview.'
            }, 400);
          }
          return cleanupApply(cleanupUserId).then(function (applied) {
            return jsonResponse(Object.assign({
              ok: true,
              success: true,
              code: 'CLEANUP_APPLIED',
              state: 'applied',
              stage: 'storage_delete'
            }, applied));
          }).catch(function (e) {
            return backupErrorResponse(e, 'Storage cleanup apply failed', 'storage_delete');
          });
        }
        if (pathname === '/__auth/onboarding-complete') return handleOnboardingComplete(body);

        // Unknown auth route — return 404
        return Promise.resolve(jsonResponse({ ok: false, error: 'Unknown auth route: ' + pathname }, 404));
      });
    }

    // ── Edge function interceptors (__supa/functions/v1/* and direct Supabase functions) ──
    // These mirror what the server-side proxy intercepts before hitting Supabase.
    var isDirectSupabaseFunction = false;
    try {
      var parsedFunctionUrl = new URL(url);
      isDirectSupabaseFunction = parsedFunctionUrl.origin === SUPA_URL && pathname.startsWith('/functions/v1/');
    } catch (e) {}
    if (pathname.startsWith('/__supa/functions/v1/') || isDirectSupabaseFunction) {
      var fnName = pathname.startsWith('/__supa/functions/v1/')
        ? pathname.replace('/__supa/functions/v1/', '').split('?')[0]
        : pathname.replace('/functions/v1/', '').split('?')[0];
      var bodyPromiseEF;
      if (init && init.body) {
        bodyPromiseEF = Promise.resolve().then(function () {
          try { var b = init.body; return typeof b === 'string' ? JSON.parse(b) : b; }
          catch (e) { return {}; }
        });
      } else {
        bodyPromiseEF = Promise.resolve({});
      }
      var searchParamsEF;
      try { searchParamsEF = new URL(url).searchParams; } catch (e) { searchParamsEF = { get: function() { return null; } }; }

      return bodyPromiseEF.then(function (efBody) {
        // Payments — always disabled in self-hosted mode
        if (fnName === 'create_checkout' || fnName === 'create-checkout') {
          return jsonResponse({ url: null, disabled: true, android: true });
        }
        if (fnName === 'create_customer_portal_session' || fnName === 'create-customer-portal-session') {
          return jsonResponse({ url: null, disabled: true, android: true });
        }
        // Membership redemption — always grant ranker in self-hosted mode
        if (fnName === 'redeem_membership_code' || fnName === 'redeem-membership-code') {
          return jsonResponse({ success: true, redeemed: true, plan_type: 'ranker', android: true });
        }
        // Focus session sync — calls finish_session_sync RPC with user JWT
        if (fnName === 'finish-session' || fnName === 'finish_session') {
          return handleFinishSession(efBody);
        }
        // Leaderboards
        if (fnName === 'get-leaderboard' || fnName === 'get_leaderboard') {
          return handleGetLeaderboard(searchParamsEF, efBody);
        }
        if (fnName === 'get-daily-leaderboard' || fnName === 'get_daily_leaderboard') {
          return handleGetDailyLeaderboard(searchParamsEF, efBody);
        }
        if (fnName === 'get-group-leaderboard' || fnName === 'get_group_leaderboard') {
          return handleGetGroupLeaderboard(efBody);
        }
        if (fnName === 'get-group-analytics' || fnName === 'get_group_analytics') {
          return handleGetGroupAnalytics(efBody);
        }
        // Unknown edge function — fall through to proxy
        return handleSupaProxy(url, init || {}, init && init.body);
      });
    }

    // ── Direct Supabase RPC compatibility for community invites ──────────────
    try {
      var parsedRestUrl = new URL(url);
      if (
        parsedRestUrl.origin === SUPA_URL &&
        (pathname === '/rest/v1/rpc/accept_invite' || pathname === '/rest/v1/rpc/get_invite_details')
      ) {
        return handleDirectInviteRpc(url, init || {});
      }
    } catch (e) {}

    // ── Supabase proxy (__supa/*) ─────────────────────────────────────────────
    if (pathname.startsWith('/__supa/')) {
      return handleSupaProxy(url, init || {}, init && init.body);
    }

    // ── Avatar proxy  ─────────────────────────────────────────────────────────
    if (pathname.includes('/avatars/') && (url.includes('/__supa/') || !url.includes('://'))) {
      var avatarPath = pathname.replace(/.*\/avatars\//, '');
      return fetch(SUPA_URL + '/storage/v1/object/public/avatars/' + avatarPath, {
        headers: { 'apikey': SUPA_ANON_KEY },
        credentials: 'omit'
      });
    }

    // ── All other requests pass through ──────────────────────────────────────
    return _originalFetch.apply(this, arguments);
  };

  // ── Expose auth globals required by auth-bridge.js ───────────────────────
  // auth-bridge.js defines window.__isoLogin and window.__isoUp as entry points.
  // On Android these must call our bridge handlers directly.
  window.__isoLogin = function (email, password) {
    return handleLogin({ email: email, password: password }).then(function (r) {
      return r.json();
    });
  };
  window.__isoUp = function (email, password) {
    return handleSignup({ email: email, password: password }).then(function (r) {
      return r.json();
    });
  };
  window.__isoGetValidJwt = function () {
    return getAccessToken();
  };
  window.__isoSyncAuthBlocked = false;
  window.__isoSyncAuthBlock = syncAuthBlock;
  window.__isoRefreshCloudSnapshot = refreshCloudSnapshotCompat;
  window.__isoUploadBackupJSON = uploadBackupJsonCompat;
  window.__isoDownloadBackupJSON = downloadBackupJsonCompat;
  window.__isoImportBackupJSON = importBackupJsonCompat;
  window.__isoRunManualCloudSync = runManualCloudSyncCompat;
  window.__isoDownloadAndImportBackup = downloadAndImportBackupCompat;
  window.__isoAndroidStorageBuckets = {
    groupIcons: { bucket: 'group-icons', public: true, user_scoped: true },
    studyMaterial: { bucket: 'study-material', public: false, user_scoped: true }
  };
  window.__isoUploadGroupIcon = uploadGroupIconCompat;
  window.__isoUploadStudyMaterial = uploadStudyMaterialCompat;

  window.__isoAndroidPipSupported = function () {
    try {
      return !!(window.IsotopeAndroid &&
                typeof window.IsotopeAndroid.isPipSupported === 'function' &&
                window.IsotopeAndroid.isPipSupported());
    } catch (e) { return false; }
  };

  window.__isoEnterFocusPip = function (payload) {
    payload = payload || {};
    try {
      localStorage.setItem('isotope-focus-pip-state', JSON.stringify({
        route: payload.route || '/focus',
        requested_at: new Date().toISOString()
      }));
    } catch (e) {}
    try {
      if (window.IsotopeAndroid && typeof window.IsotopeAndroid.enterFocusPip === 'function') {
        window.IsotopeAndroid.enterFocusPip();
        return Promise.resolve({ ok: true, native: true });
      }
      return Promise.resolve({ ok: false, native: false, reason: 'Android PiP bridge unavailable' });
    } catch (e) {
      return Promise.resolve({ ok: false, native: false, reason: e && e.message || 'Android PiP failed' });
    }
  };

  // ── Patch update-checker: suppress GitHub update checks on Android ──────────
  // update-checker.js polls GitHub API — no need on Android APK
  window.__ISO_SUPPRESS_UPDATE_CHECK__ = true;

  // ── Signal to pwa-local.js that there's no local server to check ─────────
  // pwa-local.js checks navigator.onLine + fetch('/api/version')
  // We've intercepted /api/version above, so server check always returns ok.
  // Also override the server-state object if it exists
  setTimeout(function () {
    if (window.__iso_set_server_online) {
      try { window.__iso_set_server_online(true); } catch (e) {}
    }
  }, 100);

  // ── Capacitor-specific setup ──────────────────────────────────────────────
  // Wait for Capacitor to be ready, then set up native integrations
  document.addEventListener('DOMContentLoaded', function () {
    // Adjust viewport for Android safe areas
    var meta = document.querySelector('meta[name="viewport"]');
    if (meta) {
      meta.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover';
    }

    // Apply safe-area padding to body
    var style = document.createElement('style');
    style.textContent = [
      ':root {',
      '  --safe-area-top: env(safe-area-inset-top, 0px);',
      '  --safe-area-bottom: env(safe-area-inset-bottom, 0px);',
      '  --safe-area-left: env(safe-area-inset-left, 0px);',
      '  --safe-area-right: env(safe-area-inset-right, 0px);',
      '}',
      'html {',
      '  text-size-adjust: 100%;',
      '  -webkit-text-size-adjust: 100%;',
      '}',
      'html, body, #root {',
      '  min-height: 100%;',
      '  overscroll-behavior: none;',
      '}',
      'body {',
      '  padding-top: env(safe-area-inset-top, 0px);',
      '  padding-bottom: env(safe-area-inset-bottom, 0px);',
      '}',
      /* Prevent text selection on long-press (Android default) */
      '.no-select, button, [role="button"] { -webkit-user-select: none; user-select: none; }'
    ].join('\n');
    document.head.appendChild(style);

    try {
      var fontScale = Number(localStorage.getItem('isotope-font-scale') || '100');
      if (Number.isFinite(fontScale) && fontScale >= 90 && fontScale <= 120) {
        document.documentElement.style.fontSize = String(fontScale) + '%';
      }
    } catch (e) {}
  });

  (function setupAndroidBackButton() {
    var installed = false;
    var attempts = 0;

    function hasOpenDialog() {
      try {
        return !!document.querySelector('[role="dialog"], [aria-modal="true"]');
      } catch (e) { return false; }
    }

    function closeTopDialog() {
      try {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        return true;
      } catch (e) { return false; }
    }

    function install() {
      if (installed) return true;
      var app = getCapacitorPlugin('App');
      if (!app || typeof app.addListener !== 'function') return false;
      installed = true;
      try {
        app.addListener('backButton', function (event) {
          var path = window.location && window.location.pathname || '/';
          if (hasOpenDialog() && closeTopDialog()) return;
          if (path && path !== '/' && path !== '/dashboard' && path !== '/auth' && path !== '/login') {
            try { window.history.back(); return; } catch (e) {}
          }
          if (event && event.canGoBack) {
            try { window.history.back(); return; } catch (e) {}
          }
          if (typeof app.minimizeApp === 'function') {
            app.minimizeApp();
          }
        });
      } catch (e) {
        installed = false;
        return false;
      }
      return true;
    }

    function poll() {
      attempts++;
      if (install()) return;
      if (attempts < 30) setTimeout(poll, 100);
    }

    poll();
    try { document.addEventListener('deviceready', install); } catch (e) {}
    try { document.addEventListener('DOMContentLoaded', install); } catch (e) {}
  })();

  // ── Web Notification API polyfill ─────────────────────────────────────────
  // Android WebView does NOT implement window.Notification.
  // The app's useNotificationStore calls Notification.requestPermission() and
  // new Notification(title, {body}) for focus session check-ins.
  // We polyfill window.Notification using Capacitor's LocalNotifications plugin
  // so these calls work natively (real Android system notifications).
  (function setupNotificationPolyfill() {
    if (typeof window.Notification !== 'undefined') {
      console.log('[IsotopeAI] Web Notification API already present — replacing with native Capacitor bridge');
    }

    var _permission = 'default';
    var _notifIdCounter = 1000;
    var _nativeListenerInstalled = false;
    var _nativeChannelReady = false;

    function getLocalNotifications() {
      try {
        return window.Capacitor &&
               window.Capacitor.Plugins &&
               window.Capacitor.Plugins.LocalNotifications || null;
      } catch (e) { return null; }
    }

    function nativeNotificationId(id) {
      if (typeof id === 'number' && Number.isFinite(id)) return Math.max(1, Math.floor(id));
      var s = String(id || 'isotope-notification');
      var hash = 0;
      for (var i = 0; i < s.length; i++) hash = ((hash << 5) - hash + s.charCodeAt(i)) | 0;
      return Math.abs(hash % 1000000000) + 1;
    }

    function installNativeNotificationTapHandler(ln) {
      if (_nativeListenerInstalled || !ln || typeof ln.addListener !== 'function') return;
      _nativeListenerInstalled = true;
      try {
        ln.addListener('localNotificationActionPerformed', function (event) {
          var extra = event && event.notification && event.notification.extra || {};
          var route = extra.route || extra.url || extra.data && extra.data.url || '/focus';
          try {
            if (route && typeof route === 'string') {
              window.history.pushState(null, '', route.charAt(0) === '/' ? route : '/' + route);
              window.dispatchEvent(new PopStateEvent('popstate'));
            }
          } catch (e) {
            window.location.href = route || '/focus';
          }
        });
      } catch (e) {
        console.warn('[IsotopeAI] notification tap listener failed:', e && e.message);
      }
    }

    function createNativeNotificationChannel(ln) {
      if (!ln || !ln.createChannel) return Promise.resolve(false);
      installNativeNotificationTapHandler(ln);
      if (_nativeChannelReady) return Promise.resolve(true);
      return ln.createChannel({
        id: 'isotope-focus',
        name: 'Focus Sessions',
        description: 'Focus session completion and study reminders',
        importance: 4,
        visibility: 1,
        sound: 'default',
        vibration: true,
        lights: true,
        lightColor: '#6366F1'
      }).then(function () {
        _nativeChannelReady = true;
        console.log('[IsotopeAI] Notification channel created: isotope-focus');
        return true;
      }).catch(function (e) {
        console.warn('[IsotopeAI] createChannel error:', e && e.message);
        return false;
      });
    }

    window.__isoEnsureNotificationPermission = function (opts) {
      var ln = getLocalNotifications();
      opts = opts || {};
      if (!ln) {
        _permission = 'denied';
        IsotopeNotification.permission = 'denied';
        return Promise.resolve({ ok: false, permission: 'denied', reason: 'LocalNotifications unavailable' });
      }
      return createNativeNotificationChannel(ln).then(function () {
        if (!ln.checkPermissions) return { display: 'prompt' };
        return ln.checkPermissions();
      }).then(function (result) {
        if (result && result.display === 'granted') {
          _permission = 'granted';
          IsotopeNotification.permission = 'granted';
          return { ok: true, permission: 'granted' };
        }
        if (opts.request === false || !ln.requestPermissions) {
          _permission = result && result.display === 'denied' ? 'denied' : 'default';
          IsotopeNotification.permission = _permission;
          return { ok: false, permission: _permission };
        }
        return ln.requestPermissions().then(function (requested) {
          var granted = requested && requested.display === 'granted';
          _permission = granted ? 'granted' : 'denied';
          IsotopeNotification.permission = _permission;
          return { ok: granted, permission: _permission };
        });
      }).catch(function (e) {
        _permission = 'denied';
        IsotopeNotification.permission = 'denied';
        return { ok: false, permission: 'denied', reason: e && e.message };
      });
    };

    window.__isoScheduleNativeNotification = function (payload) {
      var ln = getLocalNotifications();
      if (!ln || !ln.schedule) return Promise.resolve({ ok: false, reason: 'LocalNotifications unavailable' });
      payload = payload || {};
      var at = payload.at || payload.scheduledFor || Date.now();
      var when = at instanceof Date ? at : new Date(at);
      if (Number.isNaN(when.getTime())) when = new Date(Date.now() + 500);
      if (when.getTime() < Date.now() + 250) when = new Date(Date.now() + 500);
      var data = payload.data || {};
      return window.__isoEnsureNotificationPermission({ request: payload.requestPermission !== false }).then(function (permission) {
        if (!permission.ok) return permission;
        var numericId = nativeNotificationId(payload.id || payload.tag || payload.title || Date.now());
        return ln.schedule({
          notifications: [{
            id: numericId,
            title: payload.title || 'IsotopeAI',
            body: payload.body || '',
            schedule: { at: when, allowWhileIdle: true },
            channelId: payload.channelId || 'isotope-focus',
            smallIcon: 'ic_notification',
            iconColor: payload.iconColor || '#6366f1',
            extra: {
              notificationId: payload.id || String(numericId),
              tag: payload.tag || '',
              route: payload.route || data.url || '/focus',
              url: payload.route || data.url || '/focus',
              data: data
            }
          }]
        }).then(function () {
          return { ok: true, id: payload.id || String(numericId), native_id: numericId, scheduled_at: when.toISOString() };
        });
      }).catch(function (e) {
        console.warn('[IsotopeAI] native notification schedule failed:', e && e.message);
        return { ok: false, reason: e && e.message };
      });
    };

    window.__isoCancelNativeNotification = function (id) {
      var ln = getLocalNotifications();
      if (!ln || !ln.cancel) return Promise.resolve({ ok: false, reason: 'LocalNotifications unavailable' });
      return ln.cancel({ notifications: [{ id: nativeNotificationId(id) }] })
        .then(function () { return { ok: true }; })
        .catch(function (e) { return { ok: false, reason: e && e.message }; });
    };

    window.__isoScheduleFocusTimer = function (payload) {
      payload = payload || {};
      var schedulePayload = {
        id: 'isotope-focus-complete',
        title: payload.title || 'Focus session complete',
        body: payload.body || 'Your IsotopeAI focus session is complete.',
        at: payload.at,
        route: '/focus',
        channelId: 'isotope-focus',
        data: { url: '/focus', kind: 'focus-complete' }
      };
      return window.__isoCancelNativeNotification('isotope-focus-complete')
        .catch(function () {})
        .then(function () { return window.__isoScheduleNativeNotification(schedulePayload); });
    };

    window.__isoCancelFocusTimer = function () {
      return window.__isoCancelNativeNotification('isotope-focus-complete');
    };

    // Constructor: new Notification(title, options)
    function IsotopeNotification(title, opts) {
      var body    = (opts && opts.body)  || '';
      var tag     = (opts && opts.tag)   || '';
      var id      = _notifIdCounter++;
      this.title  = title;
      this.body   = body;
      this.tag    = tag;
      this.onclick = null;
      this.onclose = null;
      this.close = function () {};

      if (_permission !== 'granted') return;
      var ln = getLocalNotifications();
      if (!ln) return;

      // Schedule immediately (500 ms delay so Capacitor has time to process)
      ln.schedule({
        notifications: [{
          id: id,
          title: title,
          body: body,
          schedule: { at: new Date(Date.now() + 500), allowWhileIdle: true },
          channelId: 'isotope-focus',
          smallIcon: 'ic_notification',
          iconColor: '#6366f1',
          extra: { tag: tag }
        }]
      }).catch(function (e) {
        console.warn('[IsotopeAI] LocalNotification.schedule failed:', e && e.message);
      });
    }

    IsotopeNotification.permission = _permission;

    IsotopeNotification.requestPermission = function () {
      var ln = getLocalNotifications();
      if (!ln) {
        IsotopeNotification.permission = 'denied';
        _permission = 'denied';
        return Promise.resolve('denied');
      }
      return window.__isoEnsureNotificationPermission({ request: true }).then(function (result) {
        if (result && result.permission) {
          _permission = result.permission;
          IsotopeNotification.permission = _permission;
          console.log('[IsotopeAI] Notification permission:', _permission);
          return _permission;
        }
        return ln.requestPermissions().then(function (result) {
        var granted = result && result.display === 'granted';
        _permission = granted ? 'granted' : 'denied';
        IsotopeNotification.permission = _permission;
        console.log('[IsotopeAI] Notification permission:', _permission);
        return _permission;
        });
      }).catch(function (e) {
        console.warn('[IsotopeAI] requestPermissions error:', e && e.message);
        _permission = 'denied';
        IsotopeNotification.permission = 'denied';
        return 'denied';
      });
    };

    window.Notification = IsotopeNotification;
    console.log('[IsotopeAI] Web Notification API polyfill installed');

    // ── Create notification channel and check permissions once Capacitor ready ──
    // Capacitor's LocalNotifications requires a channel on Android 8+ (API 26+)
    document.addEventListener('deviceready', function () {
      setupCapacitorNotifications();
    });

    // Capacitor fires 'DOMContentLoaded' is too early; use a short poll instead
    var _capReadyPoll = 0;
    function pollCapacitorReady() {
      _capReadyPoll++;
      var ln = getLocalNotifications();
      if (ln) {
        setupCapacitorNotifications();
        return;
      }
      if (_capReadyPoll < 20) { // Try for up to 2 seconds
        setTimeout(pollCapacitorReady, 100);
      }
    }
    setTimeout(pollCapacitorReady, 300);

    function setupCapacitorNotifications() {
      var ln = getLocalNotifications();
      if (!ln || !ln.createChannel) return;

      createNativeNotificationChannel(ln);

      // Check current permission state and sync to polyfill
      if (ln.checkPermissions) {
        ln.checkPermissions().then(function (result) {
          if (result && result.display === 'granted') {
            _permission = 'granted';
            IsotopeNotification.permission = 'granted';
            console.log('[IsotopeAI] Notification permission already granted');
          } else if (result && result.display === 'prompt') {
            _permission = 'default';
            IsotopeNotification.permission = 'default';
            try {
              if (!localStorage.getItem('isotope-native-notification-prompted-v1')) {
                localStorage.setItem('isotope-native-notification-prompted-v1', String(Date.now()));
                setTimeout(function () {
                  window.__isoEnsureNotificationPermission({ request: true });
                }, 1200);
              }
            } catch (e) {}
          } else {
            _permission = 'denied';
            IsotopeNotification.permission = 'denied';
          }
        }).catch(function () {});
      }
    }
  })();

  console.log('[IsotopeAI] Android bridge initialized — version ' + APP_VERSION);
})();

// === IsotopeAI Android notification dropdown parity: start ===
(() => {
  "use strict";

  if (
    typeof window === "undefined" ||
    typeof document === "undefined" ||
    typeof document.querySelectorAll !== "function"
  ) {
    return;
  }

  const STYLE_ID = "isotope-android-notification-style";
  const PANEL_ATTR = "data-isotope-android-notification-panel";
  const SCROLLER_ATTR = "data-isotope-android-notification-scroller";
  const ENHANCED_ATTR = "data-isotope-android-notification-enhanced";

  let scheduled = false;

  const isElement = (value) =>
    Boolean(
      value &&
      value.nodeType === 1 &&
      typeof value.querySelector === "function"
    );

  const isHtmlElement = (value) =>
    Boolean(
      isElement(value) &&
      value.style &&
      typeof value.setAttribute === "function"
    );

  function isAndroidApp() {
    return Boolean(
      window.__ISO_IS_ANDROID__ ||
      window.Capacitor?.isNativePlatform?.() ||
      window.Capacitor?.getPlatform?.() === "android"
    );
  }

  function installStyles() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    const style = document.createElement("style");

    style.id = STYLE_ID;
    style.textContent = `
      [${PANEL_ATTR}="true"] {
        position: fixed !important;
        right: auto !important;
        margin-top: 0 !important;
        width: min(20rem, calc(100vw - 1.5rem)) !important;
        max-width: calc(100vw - 1.5rem) !important;
        overflow: hidden !important;
        overscroll-behavior: contain;
        z-index: 2147483000 !important;
        transform: none !important;
        isolation: isolate;
      }

      [${SCROLLER_ATTR}="true"] {
        overflow-x: hidden !important;
        overflow-y: auto !important;
        overscroll-behavior-y: contain;
        touch-action: pan-y;
        -webkit-overflow-scrolling: touch;
      }
    `;

    (document.head || document.documentElement).appendChild(style);
  }

  function findNotificationPanel() {
    for (const heading of document.querySelectorAll("h3")) {
      if (heading.textContent?.trim() !== "Notifications") {
        continue;
      }

      const header = heading.parentElement?.parentElement;
      const panel = header?.parentElement;

      if (
        isHtmlElement(panel) &&
        panel
          .querySelector("button")
          ?.textContent
          ?.includes("Mark all as read")
      ) {
        return panel;
      }
    }

    return null;
  }

  function findBellButton(panel) {
    const wrapper = panel.parentElement;

    if (!wrapper) {
      return null;
    }

    for (const child of wrapper.children) {
      if (
        isHtmlElement(child) &&
        child.tagName === "BUTTON" &&
        child.querySelector(".lucide-bell")
      ) {
        return child;
      }
    }

    return wrapper.querySelector("button");
  }

  function findScroller(panel) {
    for (const child of panel.children) {
      if (
        isHtmlElement(child) &&
        child.classList?.contains("overflow-y-auto")
      ) {
        return child;
      }
    }

    const fallback = panel.children?.[1];

    return isHtmlElement(fallback)
      ? fallback
      : null;
  }

  function keepTouchInsideScroller(scroller) {
    if (scroller.getAttribute(ENHANCED_ATTR) === "true") {
      return;
    }

    scroller.setAttribute(ENHANCED_ATTR, "true");

    let previousTouchY = 0;

    scroller.addEventListener(
      "touchstart",
      (event) => {
        previousTouchY =
          event.touches[0]?.clientY ?? 0;
      },
      {
        passive: true,
      }
    );

    scroller.addEventListener(
      "touchmove",
      (event) => {
        const currentTouchY =
          event.touches[0]?.clientY ?? previousTouchY;

        const movingDown =
          currentTouchY > previousTouchY;

        const movingUp =
          currentTouchY < previousTouchY;

        const atTop =
          scroller.scrollTop <= 0;

        const atBottom =
          Math.ceil(
            scroller.scrollTop +
            scroller.clientHeight
          ) >= scroller.scrollHeight;

        if (
          scroller.scrollHeight <= scroller.clientHeight ||
          (atTop && movingDown) ||
          (atBottom && movingUp)
        ) {
          event.preventDefault();
        }

        event.stopPropagation();
        previousTouchY = currentTouchY;
      },
      {
        passive: false,
      }
    );

    scroller.addEventListener(
      "wheel",
      (event) => {
        event.stopPropagation();
      },
      {
        passive: true,
      }
    );
  }

  function positionPanel(
    panel,
    bellButton,
    scroller
  ) {
    const viewport = window.visualViewport;

    const viewportLeft =
      viewport?.offsetLeft ?? 0;

    const viewportTop =
      viewport?.offsetTop ?? 0;

    const viewportWidth =
      viewport?.width ?? window.innerWidth;

    const viewportHeight =
      viewport?.height ?? window.innerHeight;

    const edge = 12;
    const gap = 8;

    // Matches:
    // w-[min(20rem,calc(100vw-1.5rem))]
    const panelWidth = Math.max(
      1,
      Math.min(
        320,
        viewportWidth - edge * 2
      )
    );

    const bellRect =
      bellButton.getBoundingClientRect();

    const preferredLeft =
      viewportLeft +
      bellRect.right -
      panelWidth;

    const minimumLeft =
      viewportLeft + edge;

    const maximumLeft =
      viewportLeft +
      viewportWidth -
      panelWidth -
      edge;

    const left = Math.min(
      Math.max(
        preferredLeft,
        minimumLeft
      ),
      Math.max(
        minimumLeft,
        maximumLeft
      )
    );

    let top =
      viewportTop +
      bellRect.bottom +
      gap;

    let availableHeight =
      viewportTop +
      viewportHeight -
      top -
      edge;

    if (availableHeight < 180) {
      top = viewportTop + edge;

      availableHeight =
        viewportTop +
        viewportHeight -
        top -
        edge;
    }

    availableHeight = Math.max(
      120,
      availableHeight
    );

    panel.style.left =
      `${Math.round(left)}px`;

    panel.style.top =
      `${Math.round(top)}px`;

    panel.style.width =
      `${Math.round(panelWidth)}px`;

    panel.style.maxHeight =
      `${Math.round(availableHeight)}px`;

    const header =
      panel.firstElementChild;

    const headerHeight =
      isHtmlElement(header)
        ? header.getBoundingClientRect().height
        : 73;

    // Matches the HTML5 max-h of 24rem.
    const scrollerHeight = Math.min(
      384,
      Math.max(
        120,
        Math.floor(
          availableHeight -
          headerHeight
        )
      )
    );

    scroller.style.maxHeight =
      `${scrollerHeight}px`;
  }

  function enhanceNotificationPanel() {
    scheduled = false;

    if (!isAndroidApp()) {
      return;
    }

    const panel =
      findNotificationPanel();

    if (!panel) {
      return;
    }

    const bellButton =
      findBellButton(panel);

    const scroller =
      findScroller(panel);

    if (
      !isHtmlElement(bellButton) ||
      !isHtmlElement(scroller)
    ) {
      return;
    }

    installStyles();

    panel.setAttribute(
      PANEL_ATTR,
      "true"
    );

    scroller.setAttribute(
      SCROLLER_ATTR,
      "true"
    );

    keepTouchInsideScroller(scroller);

    positionPanel(
      panel,
      bellButton,
      scroller
    );
  }

  function scheduleEnhancement() {
    if (scheduled) {
      return;
    }

    scheduled = true;

    const run =
      typeof window.requestAnimationFrame === "function"
        ? window.requestAnimationFrame.bind(window)
        : (callback) =>
            window.setTimeout(callback, 0);

    run(enhanceNotificationPanel);
  }

  function start() {
    if (!isAndroidApp()) {
      return;
    }

    scheduleEnhancement();

    const root =
      document.body ||
      document.documentElement;

    if (
      root &&
      typeof MutationObserver !== "undefined"
    ) {
      const observer =
        new MutationObserver(
          scheduleEnhancement
        );

      observer.observe(root, {
        childList: true,
        subtree: true,
      });
    }

    window.addEventListener(
      "resize",
      scheduleEnhancement,
      {
        passive: true,
      }
    );

    window.addEventListener(
      "scroll",
      scheduleEnhancement,
      {
        passive: true,
      }
    );

    window.visualViewport?.addEventListener(
      "resize",
      scheduleEnhancement,
      {
        passive: true,
      }
    );

    window.visualViewport?.addEventListener(
      "scroll",
      scheduleEnhancement,
      {
        passive: true,
      }
    );

    document.addEventListener(
      "click",
      (event) => {
        const target =
          isElement(event.target)
            ? event.target
            : null;

        const button =
          target?.closest?.("button");

        if (
          button
            ?.querySelector
            ?.(".lucide-bell")
        ) {
          window.setTimeout(
            scheduleEnhancement,
            0
          );
        }
      },
      true
    );
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      start,
      {
        once: true,
      }
    );
  } else {
    start();
  }
})();
// === IsotopeAI Android notification dropdown parity: end ===
