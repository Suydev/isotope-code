/* Isotope local-server PWA support. */
(function () {
  'use strict';

  var STATUS_ID = '__iso_offline_status__';
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
      '#' + STATUS_ID + ' span{color:#a1a1aa}'
    ].join('');
    document.head.appendChild(style);
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
    var snapshotText = 'Last cloud snapshot: ' + formatSnapshotTime(state.lastSnapshotAt) + '. ';
    if (!state.browserOnline) {
      message = '<strong>Offline mode.</strong> <span>' + snapshotText + 'Browser network is offline. Cloud sync is pending.</span>';
    } else if (!state.serverOnline) {
      message = '<strong>Local server unavailable.</strong> <span>' + snapshotText + 'Browser is online, but the Isotope local server is not responding.</span>';
    }

    if (!message) {
      el.classList.remove('show');
      el.innerHTML = '';
      return;
    }
    el.innerHTML = '<div class="dot"></div><div>' + message + '</div>';
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
        state.swVersion = data.version || '';
        state.swSha = data.sha || '';
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

  function init() {
    registerServiceWorker();
    checkServer();
    setInterval(checkServer, 10000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
