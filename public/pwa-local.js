/* Isotope local-server PWA support. */
(function () {
  'use strict';

  var STATUS_ID = '__iso_offline_status__';
  var DISMISS_KEY = 'isotope_offline_status_dismissed';
  var swActivationReloadGuard = false;
  var state = {
    browserOnline: navigator.onLine,
    serverOnline: true,
    swVersion: '',
    swSha: '',
    lastSnapshotAt: ''
  };

  function ensureStyles() {
    if (document.getElementById('__iso_offline_status_css__')) return;
    var style = document.createElement('style');
    style.id = '__iso_offline_status_css__';
    style.textContent = [
      '#' + STATUS_ID + '{position:fixed;left:12px;right:12px;bottom:12px;z-index:99998;',
      'display:none;align-items:center;gap:10px;max-width:680px;margin:0 auto;',
      'padding:10px 12px;border-radius:8px;border:1px solid #3f3f46;background:#18181b;',
      'box-shadow:0 16px 48px rgba(0,0,0,.35);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;',
      'font-size:13px;line-height:1.4;color:#e4e4e7}',
      '#' + STATUS_ID + '.show{display:flex}',
      '#' + STATUS_ID + ' .dot{width:8px;height:8px;border-radius:50%;background:#f59e0b;flex:0 0 auto}',
      '#' + STATUS_ID + ' strong{color:#fff}',
      '#' + STATUS_ID + ' span{color:#a1a1aa}',
      '#' + STATUS_ID + ' .message{flex:1;min-width:0}',
      '#' + STATUS_ID + ' .dismiss{appearance:none;border:1px solid #52525b;background:#27272a;color:#d4d4d8;',
      'border-radius:999px;width:26px;height:26px;display:inline-flex;align-items:center;justify-content:center;',
      'font-size:15px;line-height:1;cursor:pointer;flex:0 0 auto}',
      '#' + STATUS_ID + ' .dismiss:hover{background:#3f3f46;color:#fff}'
    ].join('');
    document.head.appendChild(style);
  }

  function statusKind() {
    if (!state.browserOnline) return 'browser_offline';
    if (!state.serverOnline) return 'server_offline';
    return '';
  }

  function readDismissed() {
    try { return JSON.parse(localStorage.getItem(DISMISS_KEY) || 'null') || null; } catch (e) { return null; }
  }

  function isDismissed(kind) {
    var d = readDismissed();
    return !!(d && d.kind === kind && Number(d.until) > Date.now());
  }

  function dismiss(kind) {
    try {
      localStorage.setItem(DISMISS_KEY, JSON.stringify({
        kind: kind,
        until: Date.now() + 30 * 60 * 1000
      }));
    } catch (e) {}
  }

  function clearDismissed() {
    try { localStorage.removeItem(DISMISS_KEY); } catch (e) {}
  }

  function readLastSnapshotAt() {
    var boot = window.__ISO_BOOT_STATE__ || {};
    if (boot.snapshotDownloadedAt) return boot.snapshotDownloadedAt;
    try {
      var last = JSON.parse(localStorage.getItem('isotope_last_cloud_snapshot_user') || 'null');
      if (last && last.downloaded_at) return last.downloaded_at;
    } catch (e) {}
    return '';
  }

  function formatSnapshotTime(value) {
    if (!value) return 'unknown';
    try {
      var date = new Date(value);
      if (Number.isNaN(date.getTime())) return 'unknown';
      return date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    } catch (e) {
      return 'unknown';
    }
  }

  function renderStatus() {
    ensureStyles();
    state.lastSnapshotAt = readLastSnapshotAt();
    var el = document.getElementById(STATUS_ID);
    if (!el) {
      el = document.createElement('div');
      el.id = STATUS_ID;
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }

    var message = '';
    var kind = statusKind();
    var snapshotText = 'Last cloud snapshot: ' + formatSnapshotTime(state.lastSnapshotAt) + '. ';
    if (!state.browserOnline) {
      message = '<strong>Offline mode.</strong> <span>' + snapshotText + 'Browser network is offline. Cloud sync is pending.</span>';
    } else if (!state.serverOnline) {
      message = '<strong>Local server unavailable.</strong> <span>' + snapshotText + 'Browser is online, but the Isotope local server is not responding.</span>';
    }

    if (!message) {
      clearDismissed();
      el.classList.remove('show');
      el.innerHTML = '';
      return;
    }
    if (isDismissed(kind)) {
      el.classList.remove('show');
      el.innerHTML = '';
      return;
    }
    el.innerHTML = '<div class="dot"></div><div class="message">' + message + '</div>' +
      '<button class="dismiss" type="button" aria-label="Dismiss offline status">×</button>';
    var close = el.querySelector('.dismiss');
    if (close) {
      close.onclick = function () {
        dismiss(kind);
        el.classList.remove('show');
      };
    }
    el.classList.add('show');
  }

  function publishStatus() {
    state.lastSnapshotAt = readLastSnapshotAt();
    window.__isoLocalStatus = state;
    window.__isoBrowserOffline = !state.browserOnline;
    window.__isoLocalServerOffline = state.browserOnline && !state.serverOnline;
    try {
      window.dispatchEvent(new CustomEvent('isotope:local-status', { detail: {
        browserOnline: state.browserOnline,
        serverOnline: state.serverOnline,
        swVersion: state.swVersion,
        swSha: state.swSha,
        lastSnapshotAt: state.lastSnapshotAt
      }}));
    } catch (e) {}
  }

  function checkServer() {
    if (!navigator.onLine) {
      state.browserOnline = false;
      state.serverOnline = false;
      publishStatus();
      renderStatus();
      return;
    }
    state.browserOnline = true;
    fetch('/api/version', { cache: 'no-store' })
      .then(function (r) { state.serverOnline = !!(r && r.ok); })
      .catch(function () { state.serverOnline = false; })
      .finally(function () {
        publishStatus();
        renderStatus();
      });
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(function (registration) {
        if (registration.waiting) registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      })
      .catch(function () {});

    navigator.serviceWorker.addEventListener('message', function (event) {
      var data = event.data || {};
      if (data.type === 'ISOTOPE_SW_READY' || data.type === 'ISOTOPE_SW_VERSION') {
        var newVersion = data.version || '';
        var newSha = data.sha || '';
        // One-shot reload guard: only reload on first SW activation with new version
        if (!swActivationReloadGuard && newVersion && newVersion !== state.swVersion) {
          swActivationReloadGuard = true;
          state.swVersion = newVersion;
          state.swSha = newSha;
          window.location.reload();
          return;
        }
        state.swVersion = newVersion;
        state.swSha = newSha;
      }
    });
  }

  window.__isoLocalStatus = state;

  window.addEventListener('online', function () {
    state.browserOnline = true;
    checkServer();
  });
  window.addEventListener('offline', function () {
    state.browserOnline = false;
    state.serverOnline = false;
    publishStatus();
    renderStatus();
  });
  window.addEventListener('isotope:boot-state', function () {
    renderStatus();
  });

  var _serverCheckTimer = null;

  function scheduleServerCheck(delayMs) {
    clearTimeout(_serverCheckTimer);
    _serverCheckTimer = setTimeout(checkServer, delayMs);
  }

  function init() {
    registerServiceWorker();
    checkServer();
    // Visibility-change recheck: triggers when user returns to the tab.
    // This replaces aggressive 10s polling with event-driven refresh.
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) {
        scheduleServerCheck(800);
      }
    });
    // Long-running session keepalive: one recheck every 5 minutes.
    // Covers cases where the browser tab stays open without visibility changes.
    setInterval(checkServer, 5 * 60 * 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
