/**
 * IsotopeAI — GitHub Update Checker
 * Polls /api/check-update when the user is online.
 * Shows a polished slide-in banner when a new commit is available on GitHub.
 * Checks: on load, every 10 min, on tab focus, on offline→online transition.
 */
(function () {
  'use strict';

  var POLL_INTERVAL  = 10 * 60 * 1000;   // 10 minutes
  var BANNER_ID      = '__iso_update_banner__';
  var DISMISS_KEY    = '__iso_update_dismissed__';
  var _timer         = null;
  var _lastLatestSha = null;

  // ── Inject CSS once ─────────────────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('__iso_update_styles__')) return;
    var s = document.createElement('style');
    s.id = '__iso_update_styles__';
    s.textContent = [
      '#' + BANNER_ID + '{',
        'position:fixed;top:0;left:0;right:0;z-index:99999;',
        'display:flex;align-items:center;justify-content:space-between;gap:12px;',
        'padding:11px 20px;',
        'background:linear-gradient(135deg,#18181b 0%,#1c1917 100%);',
        'border-bottom:1px solid rgba(245,158,11,0.35);',
        'box-shadow:0 2px 24px rgba(0,0,0,0.55),0 1px 0 rgba(245,158,11,0.15) inset;',
        'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;',
        'font-size:13px;color:#e4e4e7;',
        'transform:translateY(-100%);opacity:0;',
        'transition:transform 0.35s cubic-bezier(.22,.68,0,1.2),opacity 0.3s ease;',
      '}',
      '#' + BANNER_ID + '.iso-banner-visible{transform:translateY(0);opacity:1;}',
      '#' + BANNER_ID + ' .iso-dot{',
        'width:8px;height:8px;border-radius:50%;background:#f59e0b;flex-shrink:0;',
        'box-shadow:0 0 8px rgba(245,158,11,0.8);',
        'animation:iso-pulse 2s ease-in-out infinite;',
      '}',
      '@keyframes iso-pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.5;transform:scale(1.3);}}',
      '#' + BANNER_ID + ' .iso-tag{',
        'font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;',
        'color:#f59e0b;background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.25);',
        'border-radius:4px;padding:2px 7px;flex-shrink:0;',
      '}',
      '#' + BANNER_ID + ' .iso-msg{flex:1;color:#a1a1aa;line-height:1.4;}',
      '#' + BANNER_ID + ' .iso-msg strong{color:#e4e4e7;font-weight:600;}',
      '#' + BANNER_ID + ' .iso-sha{',
        'font-family:"SFMono-Regular",Consolas,monospace;font-size:11px;',
        'color:#71717a;margin-left:6px;',
      '}',
      '#' + BANNER_ID + ' .iso-btn-reload{',
        'display:inline-flex;align-items:center;gap:6px;',
        'padding:6px 14px;border-radius:8px;border:none;cursor:pointer;',
        'background:#f59e0b;color:#1c1917;font-size:12px;font-weight:700;',
        'white-space:nowrap;transition:background .15s,transform .1s;flex-shrink:0;',
      '}',
      '#' + BANNER_ID + ' .iso-btn-reload:hover{background:#fbbf24;}',
      '#' + BANNER_ID + ' .iso-btn-reload:active{transform:scale(.96);}',
      '#' + BANNER_ID + ' .iso-btn-dismiss{',
        'background:none;border:none;cursor:pointer;padding:4px 6px;',
        'color:#52525b;font-size:18px;line-height:1;flex-shrink:0;',
        'transition:color .15s;border-radius:4px;',
      '}',
      '#' + BANNER_ID + ' .iso-btn-dismiss:hover{color:#a1a1aa;background:rgba(255,255,255,0.06);}',
    ].join('');
    document.head.appendChild(s);
  }

  // ── Build banner DOM ─────────────────────────────────────────────────────────
  function buildBanner(sha, message) {
    var b = document.getElementById(BANNER_ID);
    if (b) b.remove();

    injectStyles();

    b = document.createElement('div');
    b.id = BANNER_ID;
    b.setAttribute('role', 'status');
    b.setAttribute('aria-live', 'polite');

    var shortSha  = sha ? sha.slice(0, 7) : '';
    var shortMsg  = message ? message.slice(0, 72) + (message.length > 72 ? '…' : '') : 'New version available';

    b.innerHTML = [
      '<div class="iso-dot"></div>',
      '<span class="iso-tag">Update</span>',
      '<div class="iso-msg">',
        '<strong>' + escHtml(shortMsg) + '</strong>',
        shortSha ? '<span class="iso-sha">#' + shortSha + '</span>' : '',
      '</div>',
      '<button class="iso-btn-reload" onclick="window.__isoApplyUpdate()">',
        '<svg width="13" height="13" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">',
          '<path d="M13.5 2.5A7 7 0 1 0 14.9 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
          '<polyline points="11,0 14.9,2.5 12.4,6.3" fill="currentColor"/>',
        '</svg>',
        'Reload to update',
      '</button>',
      '<button class="iso-btn-dismiss" onclick="window.__isoDismissUpdate(\'' + shortSha + '\')" aria-label="Dismiss">&#x2715;</button>',
    ].join('');

    document.body.insertBefore(b, document.body.firstChild);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { b.classList.add('iso-banner-visible'); });
    });
  }

  function hideBanner() {
    var b = document.getElementById(BANNER_ID);
    if (!b) return;
    b.classList.remove('iso-banner-visible');
    setTimeout(function () { if (b.parentNode) b.remove(); }, 400);
  }

  function escHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── Apply update: trigger SW refresh then hard-reload ───────────────────────
  window.__isoApplyUpdate = function () {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(function (reg) {
        if (reg) {
          reg.update().then(function () {
            if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' });
            setTimeout(function () { window.location.reload(true); }, 200);
          }).catch(function () { window.location.reload(true); });
        } else {
          window.location.reload(true);
        }
      }).catch(function () { window.location.reload(true); });
    } else {
      window.location.reload(true);
    }
  };

  // ── Dismiss: remember this SHA so banner won't re-appear ────────────────────
  window.__isoDismissUpdate = function (sha) {
    try { localStorage.setItem(DISMISS_KEY, sha); } catch (e) {}
    hideBanner();
  };

  // ── Core check ───────────────────────────────────────────────────────────────
  function runCheck() {
    if (!navigator.onLine) return;

    fetch('/api/check-update', { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data || !data.hasUpdate) return;

        var latestSha = data.latest || '';
        _lastLatestSha = latestSha;

        // Don't show if user already dismissed this exact version
        var dismissed = '';
        try { dismissed = localStorage.getItem(DISMISS_KEY) || ''; } catch (e) {}
        if (dismissed && latestSha.startsWith(dismissed)) return;

        // Don't show if banner already visible for same SHA
        var existing = document.getElementById(BANNER_ID);
        if (existing && existing.dataset.sha === latestSha) return;

        buildBanner(latestSha, data.message || '');
        if (existing) existing.dataset.sha = latestSha;
      })
      .catch(function () {
        // Silent — network blip, server not yet ready, etc.
      });
  }

  // ── Schedule ─────────────────────────────────────────────────────────────────
  function startPolling() {
    clearInterval(_timer);
    _timer = setInterval(runCheck, POLL_INTERVAL);
  }

  // ── Event hooks ──────────────────────────────────────────────────────────────
  window.addEventListener('online', function () {
    runCheck();
    startPolling();
  });
  window.addEventListener('offline', function () {
    clearInterval(_timer);
  });
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && navigator.onLine) runCheck();
  });

  // ── Boot ─────────────────────────────────────────────────────────────────────
  function init() {
    startPolling();
    // Small delay on first run so the app shell is painted first
    setTimeout(runCheck, 4000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
