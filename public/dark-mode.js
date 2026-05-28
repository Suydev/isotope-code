/**
 * IsotopeAI — Theme Initializer
 * Runs SYNCHRONOUSLY in <head> before React boots.
 * Applies dark/light based on stored preference; defaults to dark.
 * The app can freely toggle themes — NO lock is applied.
 */
(function () {
  'use strict';

  var PROFILE_KEYS = [
    'isotope-profile',
    'isotope_profile',
    'isotopeProfile',
  ];

  function getStoredTheme() {
    try {
      var flat = localStorage.getItem('theme');
      if (flat === 'light' || flat === 'dark') return flat;

      for (var i = 0; i < PROFILE_KEYS.length; i++) {
        var raw = localStorage.getItem(PROFILE_KEYS[i]);
        if (!raw) continue;
        try {
          var profile = JSON.parse(raw);
          if (profile && profile.settings && profile.settings.theme) return profile.settings.theme;
          if (profile && (profile.theme === 'light' || profile.theme === 'dark')) return profile.theme;
        } catch (_) {}
      }
    } catch (_) {}
    return null;
  }

  var stored = getStoredTheme();
  var isDark = stored !== 'light'; // default to dark

  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }

  // Persist resolved theme so React's store initialises correctly
  try {
    var resolved = isDark ? 'dark' : 'light';
    localStorage.setItem('theme', resolved);
    PROFILE_KEYS.forEach(function (key) {
      var raw = localStorage.getItem(key);
      if (!raw) return;
      try {
        var p = JSON.parse(raw);
        if (p && p.settings) { p.settings.theme = resolved; localStorage.setItem(key, JSON.stringify(p)); }
        else if (p && p.theme !== undefined) { p.theme = resolved; localStorage.setItem(key, JSON.stringify(p)); }
      } catch (_) {}
    });
  } catch (_) {}

})();
