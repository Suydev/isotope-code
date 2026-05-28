/**
 * IsotopeAI — Login / Splash Screen
 * Shows a beautiful branded splash before the app loads on first visit.
 * Credits: Arnav Singh (owner) · Suyash Prabh (developer)
 */
(function () {
  'use strict';

  var SHOWN_KEY = '__isotope_login_v2__';

  // Skip if user has already seen it this session or permanently dismissed
  if (sessionStorage.getItem(SHOWN_KEY) || localStorage.getItem(SHOWN_KEY + '_perm')) {
    return;
  }

  // ── Styles ────────────────────────────────────────────────────────────────────
  var css = `
    #__iso_login__ {
      position: fixed;
      inset: 0;
      z-index: 2147483640;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(6,6,10,0.60);
      backdrop-filter: blur(28px) saturate(160%);
      -webkit-backdrop-filter: blur(28px) saturate(160%);
      opacity: 0;
      transition: opacity 0.55s cubic-bezier(0.22,1,0.36,1);
    }
    #__iso_login__.visible { opacity: 1; }
    #__iso_login__.hiding {
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.45s ease-in;
    }

    /* Ambient glow blobs behind the card */
    #__iso_login__::before {
      content: '';
      position: absolute;
      width: 600px; height: 600px;
      top: -100px; left: 50%;
      transform: translateX(-50%);
      background: radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%);
      pointer-events: none;
      animation: __iso_pulse__ 4s ease-in-out infinite alternate;
    }
    #__iso_login__::after {
      content: '';
      position: absolute;
      width: 400px; height: 400px;
      bottom: -80px; right: 10%;
      background: radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%);
      pointer-events: none;
      animation: __iso_pulse__ 5s ease-in-out infinite alternate-reverse;
    }

    @keyframes __iso_pulse__ {
      0% { transform: translateX(-50%) scale(1); opacity: 0.6; }
      100% { transform: translateX(-50%) scale(1.15); opacity: 1; }
    }

    #__iso_card__ {
      position: relative;
      z-index: 1;
      width: min(420px, 92vw);
      padding: 44px 40px 36px;
      border-radius: 24px;
      background: linear-gradient(
        145deg,
        rgba(255,255,255,0.10) 0%,
        rgba(255,255,255,0.05) 100%
      );
      border: 1px solid rgba(255,255,255,0.14);
      box-shadow:
        0 32px 80px rgba(0,0,0,0.60),
        0 8px 24px rgba(0,0,0,0.35),
        inset 0 1px 0 rgba(255,255,255,0.16);
      backdrop-filter: blur(20px) saturate(150%);
      -webkit-backdrop-filter: blur(20px) saturate(150%);
      animation: __iso_slideup__ 0.6s cubic-bezier(0.22,1,0.36,1) forwards;
      transform: translateY(32px);
    }

    @keyframes __iso_slideup__ {
      to { transform: translateY(0); }
    }

    #__iso_logo_row__ {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 8px;
    }

    #__iso_logo_img__ {
      width: 48px; height: 48px;
      filter: drop-shadow(0 2px 12px rgba(249,115,22,0.6));
    }

    #__iso_app_name__ {
      font-size: 32px;
      font-weight: 700;
      letter-spacing: -0.03em;
      background: linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fdba74 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 2px 12px rgba(249,115,22,0.4));
      margin: 0;
      line-height: 1;
    }

    #__iso_tagline__ {
      text-align: center;
      font-size: 15px;
      color: rgba(255,255,255,0.55);
      margin: 0 0 36px;
      font-weight: 400;
      letter-spacing: 0.01em;
    }

    #__iso_version_badge__ {
      display: inline-block;
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 20px;
      background: rgba(249,115,22,0.15);
      border: 1px solid rgba(249,115,22,0.25);
      color: rgba(249,115,22,0.9);
      margin-bottom: 24px;
      font-weight: 500;
    }

    .iso-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 14px 24px;
      border-radius: 14px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      outline: none;
      transition: all 0.2s cubic-bezier(0.22,1,0.36,1);
      letter-spacing: -0.01em;
      margin-bottom: 10px;
      -webkit-text-fill-color: unset !important;
      text-shadow: none !important;
    }

    #__iso_btn_guest__ {
      background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
      color: #fff !important;
      -webkit-text-fill-color: #fff !important;
      box-shadow: 0 4px 20px rgba(249,115,22,0.45), 0 1px 4px rgba(0,0,0,0.20);
    }
    #__iso_btn_guest__:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(249,115,22,0.55), 0 2px 8px rgba(0,0,0,0.25);
    }
    #__iso_btn_guest__:active { transform: translateY(0); }

    #__iso_btn_signin__ {
      background: rgba(255,255,255,0.07);
      color: rgba(255,255,255,0.82) !important;
      -webkit-text-fill-color: rgba(255,255,255,0.82) !important;
      border: 1px solid rgba(255,255,255,0.14);
    }
    #__iso_btn_signin__:hover {
      background: rgba(255,255,255,0.12);
      border-color: rgba(255,255,255,0.22);
      color: #fff !important;
      -webkit-text-fill-color: #fff !important;
      transform: translateY(-1px);
    }

    #__iso_divider__ {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 14px 0;
      color: rgba(255,255,255,0.22);
      font-size: 12px;
      letter-spacing: 0.05em;
    }
    #__iso_divider__::before,
    #__iso_divider__::after {
      content: '';
      flex: 1;
      height: 1px;
      background: rgba(255,255,255,0.10);
    }

    #__iso_features__ {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin: 20px 0 24px;
      flex-wrap: wrap;
    }

    .iso-feature {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: rgba(255,255,255,0.45);
      text-align: center;
    }

    .iso-feature-icon {
      width: 36px; height: 36px;
      border-radius: 10px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.10);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    #__iso_credits__ {
      text-align: center;
      font-size: 11px;
      color: rgba(255,255,255,0.28);
      margin-top: 20px;
      letter-spacing: 0.02em;
    }

    #__iso_credits__ span {
      color: rgba(249,115,22,0.55);
    }

    #__iso_offline_badge__ {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-size: 11.5px;
      color: rgba(255,255,255,0.38);
      margin-top: 12px;
    }

    #__iso_offline_badge__::before {
      content: '●';
      color: #22c55e;
      font-size: 8px;
      animation: __iso_blink__ 2s ease-in-out infinite;
    }

    @keyframes __iso_blink__ {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    /* Spinner for loading state */
    @keyframes __iso_spin__ {
      to { transform: rotate(360deg); }
    }
    .iso-spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: __iso_spin__ 0.7s linear infinite;
      display: none;
    }
  `;

  // ── Inject styles ────────────────────────────────────────────────────────────
  var styleEl = document.createElement('style');
  styleEl.id = '__iso_login_styles__';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── Build HTML ───────────────────────────────────────────────────────────────
  var overlay = document.createElement('div');
  overlay.id = '__iso_login__';

  overlay.innerHTML = `
    <div id="__iso_card__">
      <div id="__iso_logo_row__">
        <img id="__iso_logo_img__" src="/logo-icon.svg" alt="IsotopeAI" />
        <h1 id="__iso_app_name__">IsotopeAI</h1>
      </div>
      <p id="__iso_tagline__">AI-powered study companion</p>

      <div style="text-align:center;">
        <span id="__iso_version_badge__">v2.0.0 · Offline PWA</span>
      </div>

      <div id="__iso_features__">
        <div class="iso-feature">
          <div class="iso-feature-icon">🧠</div>
          <span>AI Planner</span>
        </div>
        <div class="iso-feature">
          <div class="iso-feature-icon">⏱</div>
          <span>Focus Timer</span>
        </div>
        <div class="iso-feature">
          <div class="iso-feature-icon">📊</div>
          <span>Analytics</span>
        </div>
        <div class="iso-feature">
          <div class="iso-feature-icon">🎯</div>
          <span>Flashcards</span>
        </div>
      </div>

      <button class="iso-btn" id="__iso_btn_guest__">
        <span>⚡ Continue as Guest</span>
        <div class="iso-spinner" id="__iso_spinner__"></div>
      </button>

      <div id="__iso_divider__">or</div>

      <button class="iso-btn" id="__iso_btn_signin__">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Sign in with Google
      </button>

      <div id="__iso_offline_badge__">Works fully offline after first load</div>

      <div id="__iso_credits__">
        Crafted by <span>Arnav Singh</span> &amp; <span>Suyash Prabh</span>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // ── Show with animation ───────────────────────────────────────────────────────
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      overlay.classList.add('visible');
    });
  });

  // ── Dismiss helper ────────────────────────────────────────────────────────────
  function dismiss(permanent) {
    overlay.classList.add('hiding');
    if (permanent) localStorage.setItem(SHOWN_KEY + '_perm', '1');
    sessionStorage.setItem(SHOWN_KEY, '1');
    setTimeout(function () {
      overlay.remove();
      styleEl.remove();
    }, 500);
  }

  // ── Continue as Guest ─────────────────────────────────────────────────────────
  document.getElementById('__iso_btn_guest__').addEventListener('click', function () {
    var spinner = document.getElementById('__iso_spinner__');
    if (spinner) spinner.style.display = 'block';
    this.querySelector('span').textContent = 'Launching…';
    setTimeout(function () { dismiss(true); }, 350);
  });

  // ── Sign In → redirect to auth flow ──────────────────────────────────────────
  document.getElementById('__iso_btn_signin__').addEventListener('click', function () {
    dismiss(false);
    // Navigate to the app's own auth/onboarding route
    setTimeout(function () {
      if (window.location.pathname !== '/onboarding') {
        history.pushState({}, '', '/onboarding');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }, 500);
  });

  // ── Dismiss on Escape key ────────────────────────────────────────────────────
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') dismiss(true);
  }, { once: true });

})();
