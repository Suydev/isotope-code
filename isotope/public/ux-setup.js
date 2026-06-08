/**
 * IsotopeAI — UX Setup Helper v2.0
 *
 * Provides helper utilities for the onboarding wizard.
 * Steps 1-6 are ALL left for the user to fill in manually.
 *
 * fillRequiredDefaults() is exposed on window so other scripts
 * can call it if needed, but nothing auto-advances any step.
 */
(function () {
  'use strict';

  function setReactValue(el, value) {
    try {
      var setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(el, value);
      el.dispatchEvent(new Event('input',  { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    } catch (_) {}
  }

  function fillRequiredDefaults() {
    document.querySelectorAll('input[type="text"]:not([readonly])').forEach(function (inp) {
      if (inp.value.trim()) return;
      var ph = (inp.placeholder || '').toLowerCase();
      if (ph.includes('school') || ph.includes('institution')) setReactValue(inp, 'My School');
      else if (ph.includes('grade') || ph.includes('year'))    setReactValue(inp, '12');
    });
  }

  window.__isoFillDefaults = fillRequiredDefaults;

})();
