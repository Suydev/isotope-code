/**
 * IsotopeAI — UX Friction Reducers
 *
 * 1a. Signup/auth page (/onboarding with email+password): inject "Try without signing up" escape
 * 1b. Step wizard (after auth): surface hidden "Skip for now" + "⚡ Quick Setup" auto-advance
 * 2.  Landing page: return-visitor shortcut + "Try Demo" as primary CTA
 * 3.  Glass settings button: first-visit pulse + tooltip
 */
(function () {
  'use strict';

  /* ─── helpers ─────────────────────────────────────────────────────────── */

  var SEEN_KEY = '__isotope_ux_seen__';
  var ONBOARD_KEY = 'isotope-onboarding';

  function isFirstVisit() {
    return !localStorage.getItem(SEEN_KEY);
  }
  function markVisitSeen() {
    try { localStorage.setItem(SEEN_KEY, '1'); } catch (_) {}
  }
  function hasCompletedOnboarding() {
    return !!localStorage.getItem(ONBOARD_KEY);
  }

  // Set a React-controlled input value and fire synthetic events
  function setReactValue(el, value) {
    try {
      var setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(el, value);
      el.dispatchEvent(new Event('input',  { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    } catch (_) {}
  }

  // Find the enabled "Next / Continue / Complete" button in the onboarding nav
  function findNextButton() {
    // OnboardingNavigation places it in the right 1/3 div — it's the button
    // with white background (dark mode) or zinc-900 bg (enabled state)
    var btns = document.querySelectorAll('button:not([disabled])');
    for (var i = 0; i < btns.length; i++) {
      var b = btns[i];
      var txt = b.textContent.trim().toLowerCase();
      if (txt === 'next' || txt === 'continue' || txt === 'complete setup' ||
          txt === "let's go" || txt === 'finish' || txt === 'get started') {
        return b;
      }
    }
    // Fallback: the rightmost enabled button in the bottom nav bar
    var navBar = document.querySelector('.border-t.border-zinc-200, .border-t.border-zinc-800');
    if (navBar) {
      var rightDiv = navBar.querySelector('.flex.justify-end');
      if (rightDiv) {
        var candidate = rightDiv.querySelector('button:not([disabled])');
        if (candidate) return candidate;
      }
    }
    return null;
  }

  // Fill any unfilled required text inputs on the current step
  function fillDefaults() {
    var inputs = document.querySelectorAll('input[type="text"]:not([readonly]), input[type="email"]:not([readonly])');
    for (var i = 0; i < inputs.length; i++) {
      if (!inputs[i].value.trim()) {
        var ph = (inputs[i].placeholder || '').toLowerCase();
        if (ph.includes('name') || ph.includes('username'))  setReactValue(inputs[i], 'Student');
        else if (ph.includes('institution') || ph.includes('school')) setReactValue(inputs[i], 'My School');
        else if (ph.includes('grade') || ph.includes('year')) setReactValue(inputs[i], '12');
        else setReactValue(inputs[i], 'Student');
      }
    }
  }

  /* ─── 1a. SIGNUP / AUTH PAGE ─────────────────────────────────────────────
     The /onboarding route first shows a Google + email/password signup form.
     Inject a highly visible "Try without signing up →" escape that goes
     straight to /dashboard — exactly what "Try Demo" does from the landing page. */

  function isAuthPage() {
    // Auth page has an email input AND a password input
    return !!(document.querySelector('input[type="password"]') &&
              document.querySelector('input[type="email"], input[type="text"]'));
  }

  function injectAuthEscape() {
    if (document.getElementById('__ux_auth_escape__')) return;

    var wrap = document.createElement('div');
    wrap.id = '__ux_auth_escape__';
    wrap.setAttribute('style', [
      'position:fixed',
      'bottom:0', 'left:0', 'right:0',
      'z-index:2147483500',
      'padding:14px 20px',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'gap:10px',
      'background:rgba(8,8,14,0.9)',
      'backdrop-filter:blur(20px)',
      'border-top:1px solid rgba(255,255,255,0.08)',
      'font-family:system-ui,-apple-system,sans-serif',
    ].join(';'));

    var label = document.createElement('span');
    label.textContent = 'Just exploring?';
    label.style.cssText = 'color:rgba(255,255,255,0.45);font-size:13px;';

    var btn = document.createElement('button');
    btn.textContent = '⚡ Try without signing up';
    btn.style.cssText = [
      'background:rgba(249,115,22,0.92)',
      'color:#fff',
      'border:none',
      'border-radius:999px',
      'font-size:14px',
      'font-weight:700',
      'padding:9px 22px',
      'cursor:pointer',
      'box-shadow:0 4px 20px rgba(249,115,22,0.4)',
      'transition:transform 0.12s ease,box-shadow 0.12s ease',
    ].join(';');
    btn.addEventListener('mouseenter', function () {
      btn.style.transform = 'scale(1.04)';
      btn.style.boxShadow = '0 6px 28px rgba(249,115,22,0.55)';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.transform = 'scale(1)';
      btn.style.boxShadow = '0 4px 20px rgba(249,115,22,0.4)';
    });
    btn.addEventListener('click', function () {
      wrap.remove();
      // Navigate to dashboard — same destination as "Try Demo" on landing page
      history.pushState({}, '', '/dashboard');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    wrap.appendChild(label);
    wrap.appendChild(btn);
    document.body.appendChild(wrap);
  }

  function removeAuthEscape() {
    var el = document.getElementById('__ux_auth_escape__');
    if (el) el.remove();
  }

  /* ─── 1b. STEP WIZARD FRICTION ───────────────────────────────────────────
     a) Make "Skip for now" buttons highly visible
     b) "⚡ Skip remaining steps" floating button (steps 3+)
     c) AUTO-ADVANCE: once the user completes step 2 (subjects), steps 3-6
        are automatically skipped so they land on the dashboard immediately  */

  function styleSkipButtons() {
    var btns = document.querySelectorAll('button');
    btns.forEach(function (b) {
      if (b.textContent.trim() === 'Skip for now' && !b.dataset.__uxStyled) {
        b.dataset.__uxStyled = '1';
        b.style.cssText = [
          'color: rgba(249,115,22,0.9) !important',
          'font-weight: 600 !important',
          'font-size: 13px !important',
          'opacity: 1 !important',
          'text-decoration: underline',
          'text-underline-offset: 3px',
        ].join(';');
      }
    });
  }

  /* Read the "X/Y" step counter rendered by the progress bar component */
  function getCurrentStep() {
    var spans = document.querySelectorAll('span');
    for (var i = 0; i < spans.length; i++) {
      var m = spans[i].textContent.trim().match(/^(\d+)\/(\d+)$/);
      if (m) return { current: parseInt(m[1], 10), total: parseInt(m[2], 10) };
    }
    return null;
  }

  var quickSetupActive = false;
  function startQuickSetup() {
    if (quickSetupActive) return;
    quickSetupActive = true;

    var steps = 0;
    var maxSteps = 12;

    var btn = document.getElementById('__ux_quick_setup__');
    if (btn) {
      btn.textContent = '⏳ Setting up…';
      btn.style.opacity = '0.7';
      btn.disabled = true;
    }

    function advance() {
      if (steps >= maxSteps) return;
      fillDefaults();
      var nextBtn = findNextButton();
      if (nextBtn) {
        steps++;
        nextBtn.click();
        setTimeout(advance, 300);
      } else {
        setTimeout(advance, 400);
      }
    }
    setTimeout(advance, 200);
  }

  /* AUTO-SKIP STEPS 3+ — runs on every mutation while in onboarding wizard.
     Once the user has advanced past step 2, keep clicking Next automatically. */
  var autoSkipEnabled   = false;
  var autoSkipScheduled = false;

  function tryAutoSkip() {
    autoSkipScheduled = false;
    if (!autoSkipEnabled) return;
    if (!location.pathname.startsWith('/onboarding')) return;
    if (isAuthPage()) return;

    var s = getCurrentStep();
    if (!s) return;

    // Only auto-advance steps 3 and beyond
    if (s.current < 3) return;

    fillDefaults();
    var nextBtn = findNextButton();
    if (nextBtn) {
      nextBtn.click();
    }
  }

  function scheduleAutoSkip() {
    if (autoSkipScheduled) return;
    autoSkipScheduled = true;
    setTimeout(tryAutoSkip, 320);
  }

  /* Activate auto-skip when user moves from step 2 → step 3 */
  function checkAndEnableAutoSkip() {
    if (autoSkipEnabled) { scheduleAutoSkip(); return; }
    var s = getCurrentStep();
    if (s && s.current >= 3) {
      autoSkipEnabled = true;
      scheduleAutoSkip();
    }
  }

  function injectQuickSetupButton() {
    if (document.getElementById('__ux_quick_setup__')) return;
    // Only show the manual button if not in auto-skip mode
    var s = getCurrentStep();
    if (s && s.current >= 3 && autoSkipEnabled) return; // auto mode handles it

    var btn = document.createElement('button');
    btn.id = '__ux_quick_setup__';
    btn.textContent = '⚡ Skip remaining steps';
    btn.setAttribute('style', [
      'position:fixed',
      'top:16px',
      'right:16px',
      'z-index:2147483500',
      'padding:8px 16px',
      'border-radius:999px',
      'background:rgba(249,115,22,0.92)',
      'color:#fff',
      'font-size:13px',
      'font-weight:600',
      'font-family:system-ui,-apple-system,sans-serif',
      'border:none',
      'cursor:pointer',
      'box-shadow:0 4px 20px rgba(249,115,22,0.35)',
      'backdrop-filter:blur(12px)',
      'transition:opacity 0.15s ease,transform 0.15s ease',
      'letter-spacing:0.01em',
    ].join(';'));
    btn.addEventListener('mouseenter', function () { btn.style.transform = 'scale(1.05)'; });
    btn.addEventListener('mouseleave', function () { btn.style.transform = 'scale(1)'; });
    btn.addEventListener('click', startQuickSetup);
    document.body.appendChild(btn);
  }

  function removeQuickSetupButton() {
    var btn = document.getElementById('__ux_quick_setup__');
    if (btn) btn.remove();
  }

  /* ─── 2. LANDING PAGE ───────────────────────────────────────────────────
     a) Return visitor: top banner → one-click dashboard jump
     b) Make "Try Demo" visually equal to (or larger than) "Get Started"    */

  function injectReturnVisitorBanner() {
    if (!hasCompletedOnboarding()) return;
    if (document.getElementById('__ux_return_banner__')) return;

    var bar = document.createElement('div');
    bar.id = '__ux_return_banner__';
    bar.setAttribute('style', [
      'position:fixed',
      'top:0',
      'left:0',
      'right:0',
      'z-index:2147483400',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'gap:12px',
      'padding:10px 20px',
      'background:rgba(8,8,14,0.86)',
      'backdrop-filter:blur(20px)',
      'border-bottom:1px solid rgba(249,115,22,0.25)',
      'font-family:system-ui,-apple-system,sans-serif',
    ].join(';'));

    var msg = document.createElement('span');
    msg.textContent = 'Welcome back 👋';
    msg.style.cssText = 'color:rgba(255,255,255,0.7);font-size:14px;';

    var goBtn = document.createElement('button');
    goBtn.textContent = '→ Continue studying';
    goBtn.style.cssText = [
      'background:rgba(249,115,22,0.15)',
      'border:1px solid rgba(249,115,22,0.5)',
      'color:rgba(249,115,22,1)',
      'font-size:13px',
      'font-weight:700',
      'padding:5px 14px',
      'border-radius:999px',
      'cursor:pointer',
      'transition:background 0.15s ease',
    ].join(';');
    goBtn.addEventListener('mouseenter', function () {
      goBtn.style.background = 'rgba(249,115,22,0.28)';
    });
    goBtn.addEventListener('mouseleave', function () {
      goBtn.style.background = 'rgba(249,115,22,0.15)';
    });
    goBtn.addEventListener('click', function () {
      history.pushState({}, '', '/dashboard');
      window.dispatchEvent(new PopStateEvent('popstate'));
      bar.remove();
    });

    var closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = [
      'position:absolute', 'right:16px', 'top:50%', 'transform:translateY(-50%)',
      'background:none', 'border:none', 'color:rgba(255,255,255,0.4)',
      'font-size:13px', 'cursor:pointer',
    ].join(';');
    closeBtn.addEventListener('click', function () { bar.remove(); });

    bar.appendChild(msg);
    bar.appendChild(goBtn);
    bar.appendChild(closeBtn);
    document.body.appendChild(bar);
  }

  function boostTryDemoButton() {
    var btns = document.querySelectorAll('button');
    btns.forEach(function (b) {
      if (b.textContent.trim() === 'Try Demo' && !b.dataset.__uxBoosted) {
        b.dataset.__uxBoosted = '1';
        // Make it look primary: solid orange fill, slightly larger
        b.style.cssText = [
          'background: rgba(249,115,22,1) !important',
          'color: #fff !important',
          'border-color: transparent !important',
          'font-weight: 700 !important',
          'font-size: 15px !important',
          'padding: 14px 28px !important',
          'box-shadow: 0 4px 24px rgba(249,115,22,0.4) !important',
        ].join(';');

        // Demote "Get Started" to outlined
        btns.forEach(function (b2) {
          if (b2.textContent.trim() === 'Get Started' && !b2.dataset.__uxDemoted) {
            b2.dataset.__uxDemoted = '1';
            b2.style.cssText = [
              'background: transparent !important',
              'color: rgba(255,255,255,0.75) !important',
              'border: 1.5px solid rgba(255,255,255,0.3) !important',
              'font-size: 14px !important',
            ].join(';');
          }
        });
      }
    });
  }

  /* ─── 3. GLASS SETTINGS BUTTON DISCOVERABILITY ──────────────────────────
     Pulse ring + tooltip on first visit, clears after first click          */

  function pulseGlassButton() {
    var btn = document.getElementById('__gs_trigger__');
    if (!btn || btn.dataset.__uxPulsed) return;
    btn.dataset.__uxPulsed = '1';

    // Inject keyframe
    if (!document.getElementById('__ux_pulse_style__')) {
      var style = document.createElement('style');
      style.id = '__ux_pulse_style__';
      style.textContent = [
        '@keyframes __ux_ring_pulse__ {',
        '  0%   { box-shadow: 0 0 0 0 rgba(249,115,22,0.55), 0 4px 16px rgba(0,0,0,0.4); }',
        '  70%  { box-shadow: 0 0 0 10px rgba(249,115,22,0), 0 4px 16px rgba(0,0,0,0.4); }',
        '  100% { box-shadow: 0 0 0 0 rgba(249,115,22,0), 0 4px 16px rgba(0,0,0,0.4); }',
        '}',
      ].join('\n');
      document.head.appendChild(style);
    }

    btn.style.animation = '__ux_ring_pulse__ 1.4s ease-out 3';
    btn.title = 'Glass & Wallpaper Settings';

    // Tooltip label
    var tip = document.createElement('div');
    tip.id = '__ux_gs_tip__';
    tip.textContent = 'Appearance';
    tip.setAttribute('style', [
      'position:fixed',
      'bottom:130px',
      'left:58px',
      'z-index:2147483500',
      'background:rgba(249,115,22,0.9)',
      'color:#fff',
      'font-size:11px',
      'font-weight:700',
      'padding:4px 10px',
      'border-radius:999px',
      'pointer-events:none',
      'font-family:system-ui,-apple-system,sans-serif',
      'white-space:nowrap',
      'box-shadow:0 2px 8px rgba(0,0,0,0.35)',
      'animation:__ux_ring_pulse__ 1.4s ease-out 3',
    ].join(';'));
    document.body.appendChild(tip);

    // Remove after animation (3 pulses × 1.4s ≈ 4.2s)
    setTimeout(function () {
      btn.style.animation = '';
      var t = document.getElementById('__ux_gs_tip__');
      if (t) t.remove();
    }, 5000);

    // Also remove immediately on click
    btn.addEventListener('click', function () {
      btn.style.animation = '';
      var t = document.getElementById('__ux_gs_tip__');
      if (t) t.remove();
    }, { once: true });
  }

  /* ─── ROUTE WATCHER ─────────────────────────────────────────────────────
     React Router changes the URL without full reloads — watch for it      */

  var currentPath = location.pathname;

  function onRouteChange() {
    var path = location.pathname;
    if (path === currentPath) return;
    currentPath = path;

    if (path.startsWith('/onboarding')) {
      removeReturnBanner();
      injectOnboardingPatches();
    } else if (path === '/' || path === '') {
      removeQuickSetupButton();
      removeAuthEscape();
      injectLandingPatches();
    } else {
      removeQuickSetupButton();
      removeAuthEscape();
      removeReturnBanner();
    }
  }

  function removeReturnBanner() {
    var b = document.getElementById('__ux_return_banner__');
    if (b) b.remove();
  }

  function injectOnboardingPatches() {
    // Wait for React to render content
    setTimeout(function () {
      if (isAuthPage()) {
        // Signup/auth form: show bottom escape bar
        removeQuickSetupButton();
        injectAuthEscape();
      } else {
        // Step-based wizard (after auth): show quick-advance controls
        removeAuthEscape();
        styleSkipButtons();
        injectQuickSetupButton();
      }
    }, 400);
  }

  function injectLandingPatches() {
    setTimeout(function () {
      injectReturnVisitorBanner();
      boostTryDemoButton();
    }, 600);
  }

  /* ─── MUTATION OBSERVER ─────────────────────────────────────────────────
     Picks up React re-renders so we can re-run patches on new content      */

  var debounceTimer = null;
  var obs = new MutationObserver(function (mutations) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      var path = location.pathname;

      if (path.startsWith('/onboarding')) {
        if (isAuthPage()) {
          if (!document.getElementById('__ux_auth_escape__')) injectAuthEscape();
        } else {
          removeAuthEscape();
          styleSkipButtons();
          checkAndEnableAutoSkip();  // auto-skip steps 3+
          if (!autoSkipEnabled && !document.getElementById('__ux_quick_setup__')) {
            injectQuickSetupButton();
          }
        }
      } else if (path === '/' || path === '') {
        boostTryDemoButton();
      }

      // Glass button pulse — once per session
      if (isFirstVisit()) {
        pulseGlassButton();
        if (document.getElementById('__gs_trigger__')) markVisitSeen();
      }

      onRouteChange();
    }, 150);
  });

  /* ─── INIT ───────────────────────────────────────────────────────────── */

  function init() {
    obs.observe(document.body, { childList: true, subtree: true });

    var path = location.pathname;
    if (path.startsWith('/onboarding')) {
      injectOnboardingPatches();
    } else if (path === '/' || path === '') {
      injectLandingPatches();
    }

    // Intercept pushState / replaceState for React Router SPA navigation
    var origPush    = history.pushState.bind(history);
    var origReplace = history.replaceState.bind(history);
    history.pushState = function () {
      origPush.apply(history, arguments);
      setTimeout(onRouteChange, 50);
    };
    history.replaceState = function () {
      origReplace.apply(history, arguments);
      setTimeout(onRouteChange, 50);
    };
    window.addEventListener('popstate', function () {
      setTimeout(onRouteChange, 50);
    });
  }

  if (document.body) {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }

})();
