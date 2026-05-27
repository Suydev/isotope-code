/**
 * IsotopeAI — PWA Install Prompt
 *
 * Android/Chrome: captures beforeinstallprompt → shows custom bottom card
 * iOS/Safari:     detects share-sheet path → shows step-by-step modal
 * Post-install:   adds a small "Installed ✓" badge and hides banner
 */
(function () {
  'use strict';

  var DISMISSED_KEY  = '__isotope_install_dismissed__';
  var INSTALLED_KEY  = '__isotope_installed__';
  var CARD_DELAY_MS  = 3200;  // show card 3.2 s after landing

  /* ── Detect environment ──────────────────────────────────────────────── */
  var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  var isStandalone = window.navigator.standalone === true ||
                     window.matchMedia('(display-mode: standalone)').matches;
  var isAndroid = /android/i.test(navigator.userAgent);
  var isDismissed = localStorage.getItem(DISMISSED_KEY) === '1';
  var isInstalledFlag = localStorage.getItem(INSTALLED_KEY) === '1';

  /* Already running as installed PWA — nothing to do */
  if (isStandalone) {
    localStorage.setItem(INSTALLED_KEY, '1');
    return;
  }
  if (isDismissed || isInstalledFlag) return;

  /* ── Capture Android install event immediately ───────────────────────── */
  var deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
  });

  window.addEventListener('appinstalled', function () {
    localStorage.setItem(INSTALLED_KEY, '1');
    hideCard();
    hideIOSModal();
  });

  /* ── Shared styles injected once ─────────────────────────────────────── */
  function injectStyles() {
    if (document.getElementById('__pwa_styles__')) return;
    var s = document.createElement('style');
    s.id = '__pwa_styles__';
    s.textContent = [
      '@keyframes __pwa_slide_up__ {',
      '  from { transform: translateY(110%); opacity: 0; }',
      '  to   { transform: translateY(0);    opacity: 1; }',
      '}',
      '@keyframes __pwa_fade_in__ {',
      '  from { opacity: 0; } to { opacity: 1; }',
      '}',
      '@keyframes __pwa_bounce_share__ {',
      '  0%,100% { transform: translateY(0); }',
      '  50%      { transform: translateY(-5px); }',
      '}',
    ].join('\n');
    document.head.appendChild(s);
  }

  /* ── ANDROID / CHROME — bottom slide-up card ────────────────────────── */
  function showAndroidCard() {
    if (document.getElementById('__pwa_card__')) return;
    injectStyles();

    var card = document.createElement('div');
    card.id = '__pwa_card__';
    card.setAttribute('style', [
      'position:fixed',
      'bottom:16px', 'left:50%', 'transform:translateX(-50%)',
      'z-index:2147483600',
      'width:min(420px,calc(100vw - 32px))',
      'border-radius:20px',
      'overflow:hidden',
      'background:rgba(12,12,18,0.96)',
      'border:1px solid rgba(255,255,255,0.1)',
      'box-shadow:0 24px 64px rgba(0,0,0,0.7),0 0 0 1px rgba(249,115,22,0.12)',
      'backdrop-filter:blur(32px)',
      'animation:__pwa_slide_up__ 0.42s cubic-bezier(0.34,1.2,0.64,1) both',
      'font-family:system-ui,-apple-system,sans-serif',
    ].join(';'));

    card.innerHTML = [
      '<div style="display:flex;align-items:center;gap:14px;padding:18px 18px 14px">',
        '<img src="/icons/icon-192x192.png" width="52" height="52"',
             'style="border-radius:14px;flex-shrink:0;box-shadow:0 4px 16px rgba(249,115,22,0.25)">',
        '<div style="flex:1;min-width:0">',
          '<div style="color:#fff;font-size:15px;font-weight:700;margin-bottom:2px">',
            'Install IsotopeAI',
          '</div>',
          '<div style="color:rgba(255,255,255,0.48);font-size:12px;line-height:1.4">',
            'Works offline &nbsp;·&nbsp; No sign-up &nbsp;·&nbsp; All your data stays on your device',
          '</div>',
        '</div>',
        '<button id="__pwa_close__" style="',
          'background:none;border:none;color:rgba(255,255,255,0.35);',
          'font-size:18px;cursor:pointer;padding:4px;line-height:1;flex-shrink:0">✕</button>',
      '</div>',
      '<div style="display:flex;gap:10px;padding:0 18px 18px">',
        '<button id="__pwa_install_btn__" style="',
          'flex:1;padding:13px 0;border-radius:12px;border:none;',
          'background:linear-gradient(135deg,#f97316,#ea580c);',
          'color:#fff;font-size:14px;font-weight:700;cursor:pointer;',
          'box-shadow:0 4px 20px rgba(249,115,22,0.45);',
          'transition:transform 0.12s ease,box-shadow 0.12s ease">',
          '⬇ Install App',
        '</button>',
        '<button id="__pwa_later_btn__" style="',
          'padding:13px 18px;border-radius:12px;',
          'background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.1);',
          'color:rgba(255,255,255,0.55);font-size:14px;cursor:pointer;',
          'transition:background 0.12s ease">',
          'Later',
        '</button>',
      '</div>',
    ].join('');

    document.body.appendChild(card);

    var installBtn = card.querySelector('#__pwa_install_btn__');
    var laterBtn   = card.querySelector('#__pwa_later_btn__');
    var closeBtn   = card.querySelector('#__pwa_close__');

    installBtn.addEventListener('mouseenter', function () {
      installBtn.style.transform = 'scale(1.03)';
      installBtn.style.boxShadow = '0 6px 28px rgba(249,115,22,0.6)';
    });
    installBtn.addEventListener('mouseleave', function () {
      installBtn.style.transform = '';
      installBtn.style.boxShadow = '0 4px 20px rgba(249,115,22,0.45)';
    });
    laterBtn.addEventListener('mouseenter', function () {
      laterBtn.style.background = 'rgba(255,255,255,0.12)';
    });
    laterBtn.addEventListener('mouseleave', function () {
      laterBtn.style.background = 'rgba(255,255,255,0.07)';
    });

    installBtn.addEventListener('click', function () {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function (r) {
          if (r.outcome === 'accepted') {
            localStorage.setItem(INSTALLED_KEY, '1');
          } else {
            dismiss();
          }
          deferredPrompt = null;
        });
      }
      hideCard();
    });

    laterBtn.addEventListener('click', function () { dismiss(); hideCard(); });
    closeBtn.addEventListener('click', function () { dismiss(); hideCard(); });
  }

  function hideCard() {
    var c = document.getElementById('__pwa_card__');
    if (c) {
      c.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      c.style.transform  = 'translateX(-50%) translateY(120%)';
      c.style.opacity    = '0';
      setTimeout(function () { if (c.parentNode) c.parentNode.removeChild(c); }, 350);
    }
  }

  /* ── iOS / SAFARI — "Add to Home Screen" instruction modal ──────────── */
  function showIOSModal() {
    if (document.getElementById('__pwa_ios_modal__')) return;
    injectStyles();

    var overlay = document.createElement('div');
    overlay.id = '__pwa_ios_modal__';
    overlay.setAttribute('style', [
      'position:fixed', 'inset:0',
      'z-index:2147483600',
      'display:flex', 'align-items:flex-end', 'justify-content:center',
      'background:rgba(0,0,0,0.55)',
      'backdrop-filter:blur(6px)',
      'animation:__pwa_fade_in__ 0.3s ease both',
      'font-family:system-ui,-apple-system,sans-serif',
      'padding-bottom:env(safe-area-inset-bottom,0px)',
    ].join(';'));

    var modal = document.createElement('div');
    modal.setAttribute('style', [
      'width:100%',
      'background:rgba(18,18,26,0.98)',
      'border-radius:24px 24px 0 0',
      'padding:20px 24px 36px',
      'border-top:1px solid rgba(255,255,255,0.1)',
      'animation:__pwa_slide_up__ 0.4s cubic-bezier(0.34,1.15,0.64,1) both',
      'box-shadow:0 -24px 64px rgba(0,0,0,0.6)',
    ].join(';'));

    modal.innerHTML = [
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px">',
        '<div>',
          '<div style="color:#fff;font-size:17px;font-weight:700;margin-bottom:4px">',
            'Install IsotopeAI',
          '</div>',
          '<div style="color:rgba(255,255,255,0.45);font-size:13px">',
            'Add to your Home Screen for the full app experience',
          '</div>',
        '</div>',
        '<button id="__pwa_ios_close__" style="',
          'background:rgba(255,255,255,0.1);border:none;border-radius:50%;',
          'width:28px;height:28px;color:rgba(255,255,255,0.6);',
          'font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center">',
          '✕',
        '</button>',
      '</div>',

      /* Step 1 */
      '<div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;',
               'padding:14px;border-radius:14px;background:rgba(255,255,255,0.05)">',
        '<div style="width:40px;height:40px;border-radius:12px;flex-shrink:0;',
                    'background:rgba(249,115,22,0.15);border:1px solid rgba(249,115,22,0.3);',
                    'display:flex;align-items:center;justify-content:center">',
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"',
               'style="animation:__pwa_bounce_share__ 1.6s ease-in-out 3">',
            '<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>',
            '<polyline points="16 6 12 2 8 6"/>',
            '<line x1="12" y1="2" x2="12" y2="15"/>',
          '</svg>',
        '</div>',
        '<div>',
          '<div style="color:#fff;font-size:14px;font-weight:600;margin-bottom:2px">',
            'Tap the Share button',
          '</div>',
          '<div style="color:rgba(255,255,255,0.45);font-size:12px">',
            'The ',
            '<span style="color:rgba(249,115,22,0.9);font-weight:600">↑</span>',
            ' icon at the bottom of Safari',
          '</div>',
        '</div>',
      '</div>',

      /* Step 2 */
      '<div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;',
               'padding:14px;border-radius:14px;background:rgba(255,255,255,0.05)">',
        '<div style="width:40px;height:40px;border-radius:12px;flex-shrink:0;',
                    'background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.3);',
                    'display:flex;align-items:center;justify-content:center;',
                    'color:rgba(165,180,252,0.9);font-size:22px;line-height:1">',
          '⊞',
        '</div>',
        '<div>',
          '<div style="color:#fff;font-size:14px;font-weight:600;margin-bottom:2px">',
            'Tap "Add to Home Screen"',
          '</div>',
          '<div style="color:rgba(255,255,255,0.45);font-size:12px">',
            'Scroll down in the share sheet to find it',
          '</div>',
        '</div>',
      '</div>',

      /* Step 3 */
      '<div style="display:flex;align-items:center;gap:14px;',
               'padding:14px;border-radius:14px;background:rgba(255,255,255,0.05)">',
        '<div style="width:40px;height:40px;border-radius:12px;flex-shrink:0;',
                    'background:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.3);',
                    'display:flex;align-items:center;justify-content:center;',
                    'color:rgba(134,239,172,0.9);font-size:18px;line-height:1">',
          '✓',
        '</div>',
        '<div>',
          '<div style="color:#fff;font-size:14px;font-weight:600;margin-bottom:2px">',
            'Tap "Add" to confirm',
          '</div>',
          '<div style="color:rgba(255,255,255,0.45);font-size:12px">',
            'IsotopeAI will appear on your Home Screen',
          '</div>',
        '</div>',
      '</div>',

      '<button id="__pwa_ios_got_it__" style="',
        'width:100%;margin-top:20px;padding:15px;border-radius:14px;border:none;',
        'background:linear-gradient(135deg,#f97316,#ea580c);',
        'color:#fff;font-size:15px;font-weight:700;cursor:pointer;',
        'box-shadow:0 4px 20px rgba(249,115,22,0.4)">',
        'Got it — I\'ll add it now',
      '</button>',
    ].join('');

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) { dismiss(); hideIOSModal(); }
    });
    modal.querySelector('#__pwa_ios_close__').addEventListener('click', function () {
      dismiss(); hideIOSModal();
    });
    modal.querySelector('#__pwa_ios_got_it__').addEventListener('click', function () {
      dismiss(); hideIOSModal();
    });
  }

  function hideIOSModal() {
    var el = document.getElementById('__pwa_ios_modal__');
    if (el) {
      el.style.transition = 'opacity 0.3s ease';
      el.style.opacity = '0';
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 350);
    }
  }

  /* ── Persistent "Install" chip injected into the landing page header ── */
  function injectHeaderChip() {
    if (document.getElementById('__pwa_header_chip__')) return;
    /* Only inject on the landing/root route */
    if (location.pathname !== '/' && location.pathname !== '') return;

    var chip = document.createElement('button');
    chip.id  = '__pwa_header_chip__';
    chip.textContent = '⬇ Install';
    chip.setAttribute('style', [
      'position:fixed', 'top:12px', 'right:12px',
      'z-index:2147483400',
      'padding:7px 14px',
      'border-radius:999px',
      'background:rgba(249,115,22,0.15)',
      'border:1px solid rgba(249,115,22,0.4)',
      'color:rgba(249,115,22,1)',
      'font-size:13px', 'font-weight:700',
      'cursor:pointer',
      'font-family:system-ui,-apple-system,sans-serif',
      'backdrop-filter:blur(12px)',
      'transition:background 0.15s ease, box-shadow 0.15s ease',
      'animation:__pwa_fade_in__ 0.4s ease both',
    ].join(';'));

    chip.addEventListener('mouseenter', function () {
      chip.style.background = 'rgba(249,115,22,0.28)';
      chip.style.boxShadow  = '0 4px 20px rgba(249,115,22,0.35)';
    });
    chip.addEventListener('mouseleave', function () {
      chip.style.background = 'rgba(249,115,22,0.15)';
      chip.style.boxShadow  = '';
    });
    chip.addEventListener('click', function () {
      if (deferredPrompt) showAndroidCard();
      else if (isIOS && isSafari) showIOSModal();
    });

    document.body.appendChild(chip);

    /* Hide chip when navigating away from landing page */
    var orig = history.pushState.bind(history);
    history.pushState = function () {
      orig.apply(history, arguments);
      if (location.pathname !== '/' && location.pathname !== '') {
        var c = document.getElementById('__pwa_header_chip__');
        if (c) c.remove();
      }
    };
  }

  /* ── Dismiss helper ──────────────────────────────────────────────────── */
  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, '1');
  }

  /* ── Main trigger logic ──────────────────────────────────────────────── */
  function maybeShow() {
    /* Don't show on /dashboard or /onboarding — only landing + root */
    var path = location.pathname;
    if (path.startsWith('/dashboard') || path.startsWith('/onboarding') ||
        path.startsWith('/focus') || path.startsWith('/study')) return;

    if (deferredPrompt) {
      /* Android/Chrome — slide-up card */
      showAndroidCard();
    } else if (isIOS && isSafari) {
      /* iOS Safari — Add to Home Screen guide */
      showIOSModal();
    }
    /* Other browsers (Firefox, desktop Chrome without prompt yet) — just chip */
  }

  /* Wait for the page to settle, then show */
  function scheduleBanner() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        setTimeout(maybeShow, CARD_DELAY_MS);
        setTimeout(injectHeaderChip, 1800);
      });
    } else {
      setTimeout(maybeShow, CARD_DELAY_MS);
      setTimeout(injectHeaderChip, 1800);
    }
  }

  scheduleBanner();

  /* Expose so pwa-install.js can be triggered by other scripts */
  window.__pwaInstall = {
    show: function () {
      if (deferredPrompt) showAndroidCard();
      else if (isIOS && isSafari) showIOSModal();
    },
    isInstallable: function () {
      return !!deferredPrompt || (isIOS && isSafari && !isStandalone);
    },
  };

})();
