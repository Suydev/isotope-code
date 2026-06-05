/**
 * Isotope local-server update checker.
 * Shows a command dialog. It never stops or restarts the local server.
 */
(function () {
  'use strict';

  var POLL_INTERVAL = 10 * 60 * 1000;
  var BANNER_ID = '__iso_update_banner__';
  var DISMISS_KEY = '__iso_update_dismissed__';
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
      '#' + BANNER_ID + '{position:fixed;top:0;left:0;right:0;z-index:99999;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 20px;background:#18181b;border-bottom:1px solid rgba(245,158,11,.35);box-shadow:0 2px 24px rgba(0,0,0,.45);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:13px;color:#e4e4e7;transform:translateY(-100%);opacity:0;transition:transform .3s ease,opacity .25s ease}',
      '#' + BANNER_ID + '.iso-banner-visible{transform:translateY(0);opacity:1}',
      '#' + BANNER_ID + ' .iso-dot{width:8px;height:8px;border-radius:50%;background:#f59e0b;flex-shrink:0;box-shadow:0 0 8px rgba(245,158,11,.8)}',
      '#' + BANNER_ID + ' .iso-tag{font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#f59e0b;background:rgba(245,158,11,.12);border:1px solid rgba(245,158,11,.25);border-radius:4px;padding:2px 7px;flex-shrink:0}',
      '#' + BANNER_ID + ' .iso-msg{flex:1;color:#a1a1aa;line-height:1.4}',
      '#' + BANNER_ID + ' .iso-msg strong{color:#e4e4e7;font-weight:600}',
      '#' + BANNER_ID + ' .iso-sha{font-family:Consolas,"SFMono-Regular",monospace;font-size:11px;color:#71717a;margin-left:6px}',
      '#' + BANNER_ID + ' .iso-btn-command{padding:6px 14px;border-radius:7px;border:none;cursor:pointer;background:#f59e0b;color:#1c1917;font-size:12px;font-weight:700;white-space:nowrap;flex-shrink:0}',
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
      '<div class="iso-update-actions"><button class="iso-copy" type="button">Copy command</button><button class="iso-later" type="button">Later</button><a class="iso-docs" href="https://github.com/Suydev/isotope-code/blob/main/README.md#updating" target="_blank" rel="noreferrer">Open docs / troubleshooting</a></div>' +
      '</section>';
    var css = document.getElementById('__iso_update_modal_css__');
    if (!css) {
      css = document.createElement('style');
      css.id = '__iso_update_modal_css__';
      css.textContent = '#__iso_update_modal__{position:fixed;inset:0;z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#f4f4f5}#__iso_update_modal__ .iso-update-backdrop{position:absolute;inset:0;background:rgba(9,9,11,.72);backdrop-filter:blur(5px)}#__iso_update_modal__ .iso-update-dialog{position:relative;margin:72px auto 0;width:min(520px,calc(100vw - 28px));background:#18181b;border:1px solid rgba(245,158,11,.32);border-radius:8px;box-shadow:0 24px 80px rgba(0,0,0,.45);padding:22px}#__iso_update_modal__ h2{margin:0 32px 10px 0;font-size:22px;letter-spacing:0;color:#fff}#__iso_update_modal__ p{margin:10px 0;color:#d4d4d8;font-size:14px;line-height:1.5}#__iso_update_modal__ label{display:block;margin-top:16px;margin-bottom:6px;color:#a1a1aa;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em}#__iso_update_modal__ pre{margin:0;background:#09090b;border:1px solid #3f3f46;border-radius:7px;padding:14px;overflow:auto}#__iso_update_modal__ code{font-family:Consolas,"SFMono-Regular",monospace;color:#fbbf24;font-size:14px}#__iso_update_modal__ .iso-update-hint{font-size:13px;color:#a1a1aa}#__iso_update_modal__ .iso-update-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}#__iso_update_modal__ button,#__iso_update_modal__ .iso-docs{border-radius:7px;padding:9px 13px;font-size:13px;font-weight:700;text-decoration:none;cursor:pointer}#__iso_update_modal__ .iso-copy{border:0;background:#f59e0b;color:#18181b}#__iso_update_modal__ .iso-later{border:1px solid #3f3f46;background:#27272a;color:#f4f4f5}#__iso_update_modal__ .iso-docs{border:1px solid #52525b;color:#e4e4e7;background:transparent}#__iso_update_modal__ .iso-update-x{position:absolute;right:14px;top:12px;border:0;background:transparent;color:#a1a1aa;padding:6px 9px;font-size:16px}';
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
      '<div class="iso-msg"><strong>' + escHtml(shortMsg) + '</strong>',
      shortSha ? '<span class="iso-sha">#' + escHtml(shortSha) + '</span>' : '',
      '</div>',
      '<button class="iso-btn-command" type="button">Update command</button>',
      '<button class="iso-btn-dismiss" type="button" aria-label="Dismiss">x</button>'
    ].join('');
    b.querySelector('.iso-btn-command').addEventListener('click', showDialog);
    b.querySelector('.iso-btn-dismiss').addEventListener('click', function () {
      try { localStorage.setItem(DISMISS_KEY, shortSha); } catch (e) {}
      b.classList.remove('iso-banner-visible');
      setTimeout(function () { if (b.parentNode) b.remove(); }, 300);
    });
    document.body.insertBefore(b, document.body.firstChild);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { b.classList.add('iso-banner-visible'); });
    });
  }

  function runCheck() {
    if (!navigator.onLine) return;
    fetch('/api/check-update', { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data || !data.hasUpdate || !data.latest) return;
        var dismissed = '';
        try { dismissed = localStorage.getItem(DISMISS_KEY) || ''; } catch (e) {}
        if (dismissed && data.latest.indexOf(dismissed) === 0) return;
        var existing = document.getElementById(BANNER_ID);
        if (existing && existing.dataset.sha === data.latest) return;
        buildBanner(data.latest, data.message || '');
      })
      .catch(function () {});
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
  });
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && navigator.onLine) runCheck();
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
