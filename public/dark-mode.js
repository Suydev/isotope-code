/**
 * IsotopeAI — Dark Mode Lock
 * Runs SYNCHRONOUSLY in <head> before React boots.
 * Forces the `dark` Tailwind class on <html> at all times so the glass UI
 * never renders in light mode regardless of the user's system theme.
 */
(function () {
  'use strict';

  // 1. Add dark class immediately (synchronous, before any CSS is applied)
  document.documentElement.classList.add('dark');

  // 2. Persist 'dark' in the isotope profile so React's theme store
  //    initialises to dark instead of fighting us
  try {
    var PROFILE_KEYS = [
      'isotope-profile',
      'isotope_profile',
      'isotopeProfile',
    ];
    PROFILE_KEYS.forEach(function (key) {
      var raw = localStorage.getItem(key);
      if (!raw) return;
      try {
        var profile = JSON.parse(raw);
        if (profile && profile.settings) {
          profile.settings.theme = 'dark';
          localStorage.setItem(key, JSON.stringify(profile));
        } else if (profile && profile.theme !== undefined) {
          profile.theme = 'dark';
          localStorage.setItem(key, JSON.stringify(profile));
        }
      } catch (_) {}
    });

    // Also try flat 'theme' key some Tailwind setups use
    localStorage.setItem('theme', 'dark');
  } catch (_) {}

  // 3. MutationObserver — if React ever removes 'dark', re-add it immediately
  //    (fires synchronously before browser paints)
  try {
    var obs = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        if (m.type === 'attributes' && m.attributeName === 'class') {
          if (!document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.add('dark');
          }
        }
      }
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
  } catch (_) {}

})();
