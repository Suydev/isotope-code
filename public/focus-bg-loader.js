/* Loads the Focus background editor only on Focus routes. */
(function () {
  'use strict';

  var loaded = false;
  var scheduled = null;

  function isFocusRoute() {
    return window.location.pathname === '/focus' || window.location.pathname.indexOf('/focus/') === 0;
  }

  function loadForCurrentRoute() {
    if (loaded || !isFocusRoute()) return;
    loaded = true;
    var script = document.createElement('script');
    script.src = '/focus-bg-import.js';
    script.defer = true;
    script.onerror = function () { loaded = false; };
    document.head.appendChild(script);
  }

  function schedule() {
    clearTimeout(scheduled);
    scheduled = setTimeout(loadForCurrentRoute, 0);
  }

  ['pushState', 'replaceState'].forEach(function (method) {
    var original = history[method];
    if (typeof original !== 'function') return;
    history[method] = function () {
      var result = original.apply(this, arguments);
      schedule();
      return result;
    };
  });

  window.addEventListener('popstate', schedule);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule, { once: true });
  } else {
    schedule();
  }
})();
