/**
 * IsotopeAI — Community Page: Coming Soon
 * Overlays the community route with a "Coming Soon" screen.
 * Uses MutationObserver + history patching to catch React Router navigations.
 */
(function () {
  'use strict';

  var OVERLAY_ID = '__isotope_community_soon__';
  var COMMUNITY_PATHS = ['/community', '/challenges', '/community-hub'];

  function isCommunityPath(p) {
    return COMMUNITY_PATHS.some(function (c) { return p === c || p.startsWith(c + '/') || p.startsWith(c + '?'); });
  }

  function showOverlay() {
    if (document.getElementById(OVERLAY_ID)) return;
    var el = document.createElement('div');
    el.id = OVERLAY_ID;
    el.setAttribute('style', [
      'position:fixed', 'inset:0',
      'z-index:2147483500',
      'display:flex', 'flex-direction:column',
      'align-items:center', 'justify-content:center',
      'background:rgba(9,9,11,0.88)',
      'backdrop-filter:blur(32px) saturate(1.6)',
      '-webkit-backdrop-filter:blur(32px) saturate(1.6)',
      'font-family:system-ui,-apple-system,sans-serif',
      'color:#fff',
      'text-align:center',
      'padding:32px',
    ].join(';'));

    el.innerHTML = [
      '<div style="max-width:440px;display:flex;flex-direction:column;align-items:center;gap:20px;">',
        '<div style="width:72px;height:72px;border-radius:24px;',
          'background:linear-gradient(135deg,rgba(249,115,22,0.18),rgba(249,115,22,0.06));',
          'border:1px solid rgba(249,115,22,0.30);',
          'display:flex;align-items:center;justify-content:center;',
          'box-shadow:0 0 32px rgba(249,115,22,0.12);">',
          '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">',
            '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>',
            '<circle cx="9" cy="7" r="4"/>',
            '<path d="M23 21v-2a4 4 0 0 0-3-3.87"/>',
            '<path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
          '</svg>',
        '</div>',
        '<div>',
          '<h2 style="margin:0 0 8px;font-size:26px;font-weight:700;letter-spacing:-0.02em;',
            'background:linear-gradient(135deg,#fff 40%,rgba(249,115,22,0.8));',
            '-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">',
            'Community',
          '</h2>',
          '<div style="font-size:13px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;',
            'color:rgba(249,115,22,0.70);margin-bottom:14px;">Coming Soon</div>',
          '<p style="margin:0;font-size:15px;line-height:1.6;color:rgba(255,255,255,0.55);">',
            'Connect with study partners, join accountability groups,',
            '<br>and track leaderboards — launching soon.',
          '</p>',
        '</div>',
        '<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">',
          '<span style="padding:5px 14px;border-radius:999px;font-size:12px;font-weight:500;',
            'background:rgba(249,115,22,0.10);border:1px solid rgba(249,115,22,0.20);',
            'color:rgba(249,115,22,0.80);">Study Groups</span>',
          '<span style="padding:5px 14px;border-radius:999px;font-size:12px;font-weight:500;',
            'background:rgba(249,115,22,0.10);border:1px solid rgba(249,115,22,0.20);',
            'color:rgba(249,115,22,0.80);">Leaderboards</span>',
          '<span style="padding:5px 14px;border-radius:999px;font-size:12px;font-weight:500;',
            'background:rgba(249,115,22,0.10);border:1px solid rgba(249,115,22,0.20);',
            'color:rgba(249,115,22,0.80);">Challenges</span>',
        '</div>',
        '<button onclick="window.history.back()" style="',
          'margin-top:6px;padding:10px 24px;border-radius:12px;border:1px solid rgba(255,255,255,0.12);',
          'background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.70);',
          'font-size:13px;font-weight:500;cursor:pointer;font-family:inherit;',
          'transition:background 0.15s ease;">',
          '← Go Back',
        '</button>',
      '</div>',
    ].join('');

    document.body.appendChild(el);
  }

  function hideOverlay() {
    var el = document.getElementById(OVERLAY_ID);
    if (el) el.remove();
  }

  function check() {
    if (isCommunityPath(location.pathname)) {
      showOverlay();
    } else {
      hideOverlay();
    }
  }

  // Patch history API to catch pushState/replaceState
  ['pushState', 'replaceState'].forEach(function (method) {
    var orig = history[method];
    history[method] = function () {
      orig.apply(this, arguments);
      setTimeout(check, 50);
    };
  });
  window.addEventListener('popstate', check);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', check);
  } else {
    check();
  }
  // Re-check after React hydrates
  setTimeout(check, 800);
  setTimeout(check, 2000);
})();
