/**
 * IsotopeAI — UX Setup Helper v1.4
 *
 * After a user signs in and the onboarding wizard opens, auto-advance
 * Steps 3-6 (preference pickers) so setup feels instant.
 *
 * Steps 1-2 (name + academic info) are left alone for the user to fill in.
 *
 * Nothing here touches auth, Supabase, or any Zustand store.
 */
(function () {
  'use strict';

  function getCurrentStep() {
    var spans = document.querySelectorAll('span');
    for (var i = 0; i < spans.length; i++) {
      var m = spans[i].textContent.trim().match(/^(\d+)\/(\d+)$/);
      if (m) return { current: +m[1], total: +m[2] };
    }
    return null;
  }

  function findNextBtn() {
    var keywords = ['next', 'continue', 'complete setup', "let's go", 'finish', 'get started'];
    var btns = Array.from(document.querySelectorAll('button:not([disabled])'));
    for (var i = 0; i < btns.length; i++) {
      if (keywords.indexOf(btns[i].textContent.trim().toLowerCase()) !== -1) return btns[i];
    }
    return null;
  }

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

  var _skipTimer = null;
  var _lastStep  = -1;

  function scheduleSkip(step) {
    if (step === _lastStep) return; // don't re-trigger same step
    _lastStep = step;
    clearTimeout(_skipTimer);
    _skipTimer = setTimeout(function () {
      if (!location.pathname.startsWith('/onboarding')) return;
      var s = getCurrentStep();
      if (!s || s.current < 3) return;
      fillRequiredDefaults();
      var nb = findNextBtn();
      if (nb) nb.click();
    }, 500);
  }

  var _debounce = null;
  new MutationObserver(function () {
    clearTimeout(_debounce);
    _debounce = setTimeout(function () {
      if (!location.pathname.startsWith('/onboarding')) return;
      var s = getCurrentStep();
      if (s && s.current >= 3) scheduleSkip(s.current);
    }, 220);
  }).observe(document.body, { childList: true, subtree: true });

})();
