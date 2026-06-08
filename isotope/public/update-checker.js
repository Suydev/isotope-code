/**
 * Isotope local-server update checker.
 * Shows a command dialog. It never stops or restarts the local server.
 */
(function () {
  'use strict';

  var POLL_INTERVAL = 10 * 60 * 1000;
  var BANNER_ID = '__iso_update_banner__';
  var DISMISS_KEY = '__iso_update_dismissed__';
  var STALE_UPDATE_KEYS = [
    DISMISS_KEY,
    'update_available',
    'isotope_update_available',
    '__iso_update_available__',
    '__isotope_update_available__'
  ];
  var timer = null;

  function escHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function platformHint() {
    var ua = navigator.userAgent || '';
    if (/Android/i.test(ua)) {
      return 'Android/Termux: run isotope update in Termux. If Termux Widget shortcuts are installed, tap isotope-update from your home screen.';
    }
    if (/Windows/i.test(ua)) return 'Windows: open Command Prompt or PowerShell and run isotope update. If missing, run setup.bat again.';
    if (/Macintosh|Mac OS/i.test(ua)) return 'macOS: open Terminal and run isotope update. If missing, run bash setup.sh again.';
    return 'Linux/Termux: open a terminal and run isotope update. If missing, run bash setup.sh again.';
  }

  function injectStyles() {
    if (document.getElementById('__iso_update_styles__')) return;
    var s = document.createElement('style');
    s.id = '__iso_update_styles__';
    s.textContent = [
      '#' + BANNER_ID + '{position:fixed;top:0;left:0;right:0;z-index:99999;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 20px;background:#18181b;border-bottom:1px solid #3f3f46;animation:iso-slide-down .3s cubic-bezier(.16,1,.3,1);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;transform:translateY(-100%);opacity:0;transition:transform .3s,opacity .3s}',
      '@keyframes iso-slide-down{from{transform:translateY(-100%);opacity:0}to{transform:translateY(0);opacity:1}}',
      '#' + BANNER_ID + '.iso-banner-visible{transform:translateY(0);opacity:1}',
      '#' + BANNER_ID + ' .iso-dot{width:8px;height:8px;border-radius:50%;background:#f59e0b;flex-shrink:0;box-shadow:0 0 8px rgba(245,158,11,.8)}',
      '#' + BANNER_ID + ' .iso-tag{font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#f59e0b;background:rgba(245,158,11,.12);border:1px solid rgba(245,158,11,.25);border-radius:3px;padding:2px 6px;flex-shrink:0}',
      '#' + BANNER_ID + ' .iso-msg{flex:1;color:#a1a1aa;line-height:1.4}',
      '#' + BANNER_ID + ' .iso-msg strong{color:#e4e4e7;font-weight:600}',
      '#' + BANNER_ID + ' .iso-sha{font-family:Consolas,"SFMono-Regular",monospace;font-size:11px;color:#71717a;margin-left:6px}',
      '#' + BANNER_ID + ' .iso-btn-command{padding:6px 14px;border-radius:7px;border:none;cursor:pointer;background:#f59e0b;color:#1c1917;font-size:12px;font-weight:700;white-space:nowrap;flex-shrink:0;transition:background .2s}',
      '#' + BANNER_ID + ' .iso-btn-command:hover{background:#fbbf24}',
      '#' + BANNER_ID + ' .iso-btn-dismiss{background:none;border:none;cursor:pointer;padding:4px 6px;color:#71717a;font-size:18px;line-height:1;flex-shrink:0;border-radius:4px}',
      '#' + BANNER_ID + ' .iso-btn-dismiss:hover{color:#d4d4d8;background:rgba(255,255,255,.06)}'
    ].join('');
    document.head.appendChild(s);
  }

  function copyCommand(btn) {
    var cmd = 'isotope update';
    function set(ok) {
      if (!btn) return;
      var old = btn.textContent;
      btn.textContent = ok ? 'Copied' : 'Copy failed';
      setTimeout(function () { btn.textContent = old; }, 1400);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(cmd).then(function () { set(true); }).catch(function () { set(false); });
      return;
    }
    try {
      var t = document.createElement('textarea');
      t.value = cmd;
      t.style.position = 'fixed';
      t.style.opacity = '0';
      document.body.appendChild(t);
      t.select();
      document.execCommand('copy');
      t.remove();
      set(true);
    } catch (e) { set(false); }
  }

  function showDialog() {
    if (typeof window.__isoShowUpdateDialog === 'function') {
      window.__isoShowUpdateDialog();
      return;
    }

    var old = document.getElementById('__iso_update_modal__');
    if (old) old.remove();
    var wrap = document.createElement('div');
    wrap.id = '__iso_update_modal__';
    wrap.innerHTML =
      '<div class="iso-update-backdrop"></div>' +
      '<section class="iso-update-dialog" role="dialog" aria-modal="true" aria-labelledby="iso-update-title">' +
      '<button class="iso-update-x" type="button" aria-label="Close">x</button>' +
      '<h2 id="iso-update-title">Update available</h2>' +
      '<p>A new version of Isotope is available. Because this app runs locally on your device, update must be applied through the local command system.</p>' +
      '<label>Run this command</label><pre><code>isotope update</code></pre>' +
      '<p class="iso-update-hint">' + escHtml(platformHint()) + '</p>' +
      '<p class="iso-update-hint">After update, run <code>isotope start</code> if the server did not restart automatically.</p>' +
      '<div class="iso-update-actions"><button class="iso-copy" type="button">Copy command</button><button class="iso-later" type="button">Later</button><a class="iso-docs" href="https://github.com/Suydev/isotope-code" target="_blank" rel="noopener">Docs</a></div>' +
      '</section>';
    var css = document.getElementById('__iso_update_modal_css__');
    if (!css) {
      css = document.createElement('style');
      css.id = '__iso_update_modal_css__';
      css.textContent = '#__iso_update_modal__{position:fixed;inset:0;z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#f4f4f5;display:flex;align-items:center;justify-content:center}#__iso_update_modal__ .iso-update-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.5);z-index:-1}#__iso_update_modal__ .iso-update-dialog{background:#18181b;border:1px solid #3f3f46;border-radius:12px;padding:28px;max-width:520px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.4)}#__iso_update_modal__ h2{margin:0 0 12px;font-size:18px;font-weight:700;color:#f4f4f5}#__iso_update_modal__ p{margin:12px 0;font-size:13px;line-height:1.6;color:#a1a1aa}#__iso_update_modal__ label{display:block;font-size:11px;font-weight:700;text-transform:uppercase;color:#71717a;margin:16px 0 8px}#__iso_update_modal__ pre{background:#27272a;border:1px solid #3f3f46;border-radius:8px;padding:12px;overflow-x:auto;margin:8px 0}#__iso_update_modal__ code{font-family:Consolas,"SFMono-Regular",monospace;font-size:12px;color:#e4e4e7}#__iso_update_modal__ .iso-update-hint{font-size:12px;color:#71717a}#__iso_update_modal__ .iso-update-actions{display:flex;gap:8px;margin-top:24px}#__iso_update_modal__ .iso-copy,#__iso_update_modal__ .iso-later,#__iso_update_modal__ .iso-docs{padding:8px 16px;border-radius:7px;border:none;font-size:13px;font-weight:600;cursor:pointer;transition:background .2s;text-decoration:none;display:inline-block;text-align:center}#__iso_update_modal__ .iso-copy{background:#f59e0b;color:#1c1917}#__iso_update_modal__ .iso-copy:hover{background:#fbbf24}#__iso_update_modal__ .iso-later{background:transparent;border:1px solid #3f3f46;color:#a1a1aa}#__iso_update_modal__ .iso-later:hover{background:rgba(255,255,255,.06)}#__iso_update_modal__ .iso-docs{background:transparent;border:1px solid #3f3f46;color:#a1a1aa;flex-shrink:0}#__iso_update_modal__ .iso-docs:hover{background:rgba(255,255,255,.06)}#__iso_update_modal__ .iso-update-x{position:absolute;top:12px;right:12px;background:none;border:none;font-size:24px;color:#71717a;cursor:pointer;padding:4px;line-height:1}#__iso_update_modal__ .iso-update-x:hover{color:#d4d4d8}';
      document.head.appendChild(css);
    }
    document.body.appendChild(wrap);
    var close = function () { if (wrap.parentNode) wrap.remove(); };
    wrap.querySelector('.iso-copy').addEventListener('click', function () { copyCommand(this); });
    wrap.querySelector('.iso-later').addEventListener('click', close);
    wrap.querySelector('.iso-update-x').addEventListener('click', close);
    wrap.querySelector('.iso-update-backdrop').addEventListener('click', close);
  }

  function buildBanner(sha, message) {
    var existing = document.getElementById(BANNER_ID);
    if (existing) existing.remove();
    injectStyles();

    var shortSha = sha ? sha.slice(0, 7) : '';
    var shortMsg = message ? message.slice(0, 72) + (message.length > 72 ? '...' : '') : 'New version available';
    var b = document.createElement('div');
    b.id = BANNER_ID;
    b.dataset.sha = sha || '';
    b.setAttribute('role', 'status');
    b.setAttribute('aria-live', 'polite');
    b.innerHTML = [
      '<div class="iso-dot"></div>',
      '<span class="iso-tag">Update</span>',
      '<div class="iso-msg"><strong>' + escHtml(shortMsg) + '</strong>' +
      (shortSha ? '<span class="iso-sha">#' + escHtml(shortSha) + '</span>' : '') +
      '</div>',
      '<button class="iso-btn-command" type="button">Update command</button>',
      '<button class="iso-btn-dismiss" type="button" aria-label="Dismiss">x</button>'
    ].join('');
    b.querySelector('.iso-btn-command').addEventListener('click', showDialog);
    b.querySelector('.iso-btn-dismiss').addEventListener('click', function () {
      try { localStorage.setItem(DISMISS_KEY, sha); } catch (e) {}
      b.classList.remove('iso-banner-visible');
      setTimeout(function () { if (b.parentNode) b.remove(); }, 300);
    });
    document.body.insertBefore(b, document.body.firstChild);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { b.classList.add('iso-banner-visible'); });
    });
  }

  function clearStaleFlags() {
    try {
      STALE_UPDATE_KEYS.forEach(function (key) { localStorage.removeItem(key); });
    } catch (e) {}
  }

  function hideBanner() {
    var old = document.getElementById(BANNER_ID);
    if (!old) return;
    old.classList.remove('iso-banner-visible');
    setTimeout(function () { if (old.parentNode) old.remove(); }, 300);
  }

  function localServerPreflight() {
    if (!navigator.onLine || window.__isoLocalServerOffline === true) {
      window.__isoLocalServerOffline = true;
      hideBanner();
      clearStaleFlags();
      return Promise.resolve(null);
    }
    return fetch('/api/version', { cache: 'no-store' })
      .then(function (r) {
        if (!r || !r.ok) throw new Error('local server unavailable');
        return r.json();
      })
      .catch(function () {
        window.__isoLocalServerOffline = true;
        hideBanner();
        clearStaleFlags();
        return null;
      });
  }

  function runCheck() {
    localServerPreflight()
      .then(function (version) {
        if (!version) return null;
        window.__isoLocalServerOffline = false;
        return fetch('/api/check-update', { cache: 'no-store' });
      })
      .then(function (r) {
        if (!r) return null;
        if (!r.ok) throw new Error('update check unavailable');
        return r.json();
      })
      .then(function (data) {
        if (!data) return;
        if (!data || !data.hasUpdate || !data.latest) {
          if (data && data.hasUpdate === false) {
            clearStaleFlags();
            hideBanner();
          }
          return;
        }
        var dismissed = '';
        try { dismissed = localStorage.getItem(DISMISS_KEY) || ''; } catch (e) {}
        if (dismissed && dismissed === data.latest) return;
        var existing = document.getElementById(BANNER_ID);
        if (existing && existing.dataset.sha === data.latest) return;
        buildBanner(data.latest, data.message || '');
      })
      .catch(function (err) {
        console.warn('[IsotopeUpdateChecker] Error:', err.message);
        hideBanner();
      });
  }

  function startPolling() {
    clearInterval(timer);
    timer = setInterval(runCheck, POLL_INTERVAL);
  }

  window.__isoShowUpdateCommand = showDialog;
  window.__isoApplyUpdate = showDialog;

  window.addEventListener('online', function () {
    runCheck();
    startPolling();
  });
  window.addEventListener('offline', function () {
    clearInterval(timer);
    window.__isoLocalServerOffline = true;
    hideBanner();
    clearStaleFlags();
  });
  window.addEventListener('isotope:local-status', function (event) {
    var detail = event && event.detail || {};
    if (detail.serverOnline === false || detail.browserOnline === false) {
      clearInterval(timer);
      hideBanner();
      clearStaleFlags();
      return;
    }
    startPolling();
    runCheck();
  });
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && navigator.onLine) runCheck();
  });
  window.addEventListener('beforeunload', function () {
    clearInterval(timer);
  });

  function init() {
    startPolling();
    setTimeout(runCheck, 4000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
