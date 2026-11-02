/* ============================================================================
   app.js — bootstrap, routing, and ONE delegated click handler.

   Why delegation: every control in every view is stamped `data-act` by the D.*
   helpers. A single document-level listener therefore wires all of them. If a
   view ever emits a control with no `data-act`, this file's self-check catches it
   at load and says so in the UI — the failure mode this project keeps hitting
   ("the button clicks and nothing happens") becomes loud instead of silent.
   ========================================================================= */

(function (global) {
  'use strict';
  var d = global.D, PV = global.PV, S = PV.S;

  var ROUTES = {
    '/dashboard':    function () { return global.VIEWS.dashboard(); },
    '/focus':        function () { return global.VIEWS.focus(); },
    '/tasks':        function () { return global.VIEWS_B.tasks(); },
    '/exams':        function () { return global.VIEWS_B.exams(); },
    '/syllabus':     function () { return global.VIEWS_B.syllabus(); },
    '/community':    function () { return global.VIEWS_C.community(); },
    '/settings':     function () { return global.VIEWS_C.settings(); },
    '/study':        function () { return global.VIEWS_C.study(); },
    '/analytics':    function () { return global.VIEWS_C.analytics(); },
    '/progress':     function () { return global.VIEWS_C.analytics(); },
    '/subscription': function () { return global.VIEWS_C.subscription(); },
    '/onboarding':   function () { return global.VIEWS_C.onboarding(); }
  };

  /* The nav rail. Names verified on the live app: 9 destinations, icon-only. */
  var NAV = [
    { path: '/dashboard', label: 'Today',     glyph: '☀️' },
    { path: '/focus',     label: 'Focus',     glyph: '⏱' },
    { path: '/study',     label: 'Study',     glyph: '📖' },
    { path: '/syllabus',  label: 'Syllabus',  glyph: '🗂' },
    { path: '/exams',     label: 'Exams',     glyph: '📅' },
    { path: '/tasks',     label: 'Tasks',     glyph: '✅' },
    { path: '/analytics', label: 'Analytics', glyph: '📊' },
    { path: '/community', label: 'Community', glyph: '👥' },
    { path: '/settings',  label: 'Settings',  glyph: '⚙' }
  ];

  var el = {};

  function shell(inner) {
    var navHtml = NAV.map(function (n) {
      var current = S.route === n.path;
      return '<button class="nav__item" ' + attrsOf({
          'aria-current': current ? 'page' : null,
          'aria-label': n.label, title: n.label
        }) + ' data-act="navigate" data-arg="' + n.path + '">' +
        '<span class="nav__glyph" aria-hidden="true">' + n.glyph + '</span>' +
        '<span class="sr-only">' + d.esc(n.label) + '</span></button>';
    }).join('');

    return '<div class="shell">' +
      '<aside class="rail" aria-label="Main">' +
        '<a class="rail__mark" href="#" data-act="navigate" data-arg="/dashboard">ISOTOPE</a>' +
        '<nav class="nav">' + navHtml + '</nav>' +
        '<div class="rail__foot">' +
          '<button class="nav__item" aria-label="' + (S.theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode') + '" ' +
            'title="Switch theme" data-act="theme.toggle"><span class="nav__glyph" aria-hidden="true">' +
            (S.theme === 'light' ? '🌙' : '☀️') + '</span></button>' +
          '<button class="avatar avatar--sm" aria-label="Account" data-act="account.open">' +
            d.esc(global.ISO_DEMO.FIRST.charAt(0)) + '</button>' +
        '</div>' +
      '</aside>' +
      '<div style="flex:1;min-width:0;display:flex;flex-direction:column">' +
        '<header class="top">' +
          '<span class="top__brand">' + d.esc(global.ISO_DEMO.NAME) + '</span>' +
          '<button class="top__exam" data-act="exams.select" data-arg="JEE Mains">JEE Mains' +
            '<span class="top__dot">· Add exam date</span></button>' +
          '<div class="spacer"></div>' +
          '<input class="search" type="search" placeholder="Search tasks, chapters, exams…" ' +
            'aria-label="Search tasks, chapters, and exams" data-input="search.query">' +
          '<button class="iconbtn" aria-label="Customize Today dashboard" data-act="dashboard.customize">⚙</button>' +
          '<button class="iconbtn" aria-label="Storage safety status" data-act="storage.open">💾</button>' +
          '<button class="iconbtn" aria-label="View product updates" data-act="updates.open">📣</button>' +
          '<button class="iconbtn iconbtn--avatar" aria-label="Account" data-act="account.open">RK</button>' +
        '</header>' +
        '<main class="main">' + inner + '</main>' +
      '</div>' +
      (S.teaserDismissed ? '' : teaser()) +
      (S.dialog ? dialogHtml() : '') +
      toastsHtml() +
      '<div class="sr-only" id="audit-report" aria-live="polite"></div>' +
    '</div>';
  }

  function attrsOf(o) {
    return Object.keys(o).filter(function (k) { return o[k] !== null && o[k] !== false; })
      .map(function (k) { return k + '="' + d.esc(o[k]) + '"'; }).join(' ');
  }

  /* OBSERVED verbatim on every authenticated page in the real app. */
  function teaser() {
    return '<aside class="teaser" aria-label="IsotopeAI">' +
      '<div><div class="teaser__kicker">PREPARE TO BE</div>' +
      '<div class="teaser__hero">OVERWHELMED</div></div>' +
      '<div class="teaser__body">The ultimate productivity website for students.<br>PRECISION · FOCUS · MASTERY</div>' +
      '<button class="teaser__cta" data-act="teaser.enter">ENTER THE SYSTEM</button>' +
      '<button class="teaser__dismiss" data-act="teaser.dismiss">Don’t show this masterpiece again</button>' +
      '</aside>';
  }

  function dialogHtml() {
    var c = S.dialog;
    return '<div class="scrim" data-act="noop" role="presentation">' +
      '<div class="dialog" role="dialog" aria-modal="true" aria-label="' + d.esc(c.title) + '">' +
        '<div class="dialog__head"><h2 class="dialog__title">' + d.esc(c.title) + '</h2>' +
        '<button class="iconbtn" aria-label="Close" data-act="dialog.close">✕</button></div>' +
        (c.sub ? '<p class="dialog__sub">' + d.esc(c.sub) + '</p>' : '') +
        (typeof c.body === 'function' ? c.body() : (c.body || '')) +
        '<div class="dialog__foot">' + (c.actions || []).map(function (a) {
          return d.btn(a.label, a.act, null, { cls: a.primary ? 'btn--primary' : '' });
        }).join('') + '</div>' +
      '</div></div>';
  }

  function toastsHtml() {
    if (!S.toasts.length) return '';
    return '<div class="toasts" role="status" aria-live="polite">' + S.toasts.map(function (t) {
      return '<div class="toast">' + d.esc(t.text) + '</div>';
    }).join('') + '</div>';
  }

  /* ── Render ───────────────────────────────────────────────────────────── */

  function render() {
    PV.syncAttrs();
    var fn = ROUTES[S.route];
    var inner = fn ? fn() : ROUTES['/dashboard']();
    // /onboarding renders its own full-screen shell.
    el.app.innerHTML = (S.route === '/onboarding') ? inner : shell(inner);
    audit();
  }
  PV.setRender(render);

  /* ── Self-check ─────────────────────────────────────────────────────────
     Every enabled control must carry data-act. A control without one is a dead
     control by definition, so we count them and say so loudly.               */
  var lastDead = -1;
  function audit() {
    var all = el.app.querySelectorAll('button, a[href], input:not([type=hidden]), select, textarea, [role=switch], [role=tab]');
    var dead = [];
    for (var i = 0; i < all.length; i++) {
      var n = all[i];
      if (n.disabled) continue;
      if (!n.hasAttribute('data-act') && !n.hasAttribute('data-input') &&
          !n.hasAttribute('data-range') && !n.hasAttribute('data-select') &&
          !n.hasAttribute('data-onb') && !n.hasAttribute('data-text')) {
        dead.push(n.tagName.toLowerCase() + (n.getAttribute('aria-label') ? '[' + n.getAttribute('aria-label') + ']' : ''));
      }
    }
    if (dead.length !== lastDead) {
      lastDead = dead.length;
      var r = document.getElementById('audit-report');
      if (r) r.textContent = dead.length ? ('Build error: ' + dead.length + ' control(s) with no action: ' + dead.join(', '))
                                          : 'All controls wired.';
      if (dead.length && global.console) console.error('[preview] DEAD CONTROLS:', dead);
      if (dead.length) PV.toast('Build error: ' + dead.length + ' control(s) are not wired to an action.');
    }
  }

  /* ── Events ───────────────────────────────────────────────────────────── */

  function onClick(e) {
    var t = e.target;
    while (t && t !== document.body && !t.hasAttribute && !t.hasAttribute('data-act')) t = t.parentNode;
    if (!t || !t.getAttribute || !t.hasAttribute('data-act')) return;
    if (t.hasAttribute('disabled')) return;
    var act = t.getAttribute('data-act');
    var raw = t.getAttribute('data-arg');
    var argv = null;
    if (raw !== null && raw !== '') {
      // data-arg may be a JSON payload (object/array/number/bool) or a plain string.
      var first = raw.charAt(0);
      if (first === '{' || first === '[' || first === '"' || /^-?\d/.test(first) || raw === 'true' || raw === 'false') {
        try { argv = JSON.parse(raw); } catch (e) { argv = raw; }
      } else argv = raw;
    }
    e.preventDefault();
    PV.act(act, argv);
  }

  function onInput(e) {
    var t = e.target;
    if (t.hasAttribute && t.hasAttribute('data-input')) { PV.act(t.getAttribute('data-input'), t.value); return; }
    if (t.hasAttribute && t.hasAttribute('data-text')) { PV.act('settings.set', { id: t.getAttribute('data-text'), value: t.value }); return; }
    if (t.hasAttribute && t.hasAttribute('data-onb')) { PV.act('onboarding.' + t.getAttribute('data-onb'), t.value); return; }
    if (t.hasAttribute && t.hasAttribute('data-select')) { PV.act('settings.set', { id: t.getAttribute('data-select'), value: t.value }); return; }
    if (t.hasAttribute && t.hasAttribute('data-range')) {
      var out = t.parentNode.querySelector('.counter');
      if (out) out.textContent = t.value + ' min';
      PV.act('settings.set', { id: t.getAttribute('data-range'), value: Number(t.value) });
      return;
    }
  }

  function onKey(e) {
    if (e.key === 'Escape' && S.dialog) { PV.act('dialog.close'); return; }
    // The real app shows a ⌘K badge on search but never binds the shortcut.
    // The spec recommends wiring it; that is a deliberate improvement.
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); PV.act('search.open'); }
  }

  /* ── Boot ─────────────────────────────────────────────────────────────── */

  function boot() {
    el.app = document.getElementById('app');

    // Route from the hash so the preview deep-links, but never let it throw:
    // an unknown path falls back to the dashboard rather than a blank page.
    var h = (location.hash || '').replace(/^#/, '');
    if (ROUTES[h]) S.route = h;

    document.addEventListener('click', onClick, true);
    document.addEventListener('input', onInput, true);
    document.addEventListener('change', onInput, true);
    document.addEventListener('keydown', onKey);
    window.addEventListener('hashchange', function () {
      var r = (location.hash || '').replace(/^#/, '');
      if (ROUTES[r]) { S.route = r; render(); }
    });

    // Expose for the verification harness.
    global.__PREVIEW = {
      act: PV.act, state: S, render: render,
      missing: PV.missing,
      dead: function () {
        return (document.getElementById('audit-report') || {}).textContent || '';
      }
    };

    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);