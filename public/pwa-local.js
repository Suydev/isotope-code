/* Isotope local-server PWA support. */
(function () {
  'use strict';

  var STATUS_ID = '__iso_offline_status__';
  var state = {
    browserOnline: navigator.onLine,
    serverOnline: true,
    swVersion: '',
    swSha: ''
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

  function renderStatus() {
    ensureStyles();
    var el = document.getElementById(STATUS_ID);
    if (!el) {
      el = document.createElement('div');
      el.id = STATUS_ID;
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }

    var message = '';
    if (!state.browserOnline) {
      message = '<strong>Offline mode.</strong> <span>Cached screens may load, but Supabase auth, cloud sync, storage, realtime, and community features are unavailable.</span>';
    } else if (!state.serverOnline) {
      message = '<strong>Local server unavailable.</strong> <span>The cached app shell is running, but local API routes will not work. Run isotope start.</span>';
    }

    if (!message) {
      el.classList.remove('show');
      el.innerHTML = '';
      return;
    }
    el.innerHTML = '<div class="dot"></div><div>' + message + '</div>';
    el.classList.add('show');
  }

  function checkServer() {
    if (!navigator.onLine) {
      state.browserOnline = false;
      renderStatus();
      return;
    }
    state.browserOnline = true;
    fetch('/__isotope/ping', { cache: 'no-store' })
      .then(function (r) { state.serverOnline = !!(r && r.ok); })
      .catch(function () { state.serverOnline = false; })
      .finally(renderStatus);
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
