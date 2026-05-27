/**
 * IsotopeAI — Glass Settings Panel
 * Adjustable controls for glassmorphism appearance:
 *   - Blur intensity
 *   - Glass opacity
 *   - Glass tint (hue + saturation)
 *   - Background video dimming
 *
 * Settings are saved in localStorage and applied as CSS custom properties
 * on :root so every glass surface updates instantly.
 */
(function () {
  'use strict';

  var LS = 'isotope_glass_settings';
  var DEFAULTS = {
    blur:    56,   // px — backdrop-filter blur value
    opacity: 8,    // % — glass background opacity (0–30)
    tintH:   0,    // hue 0–360
    tintS:   0,    // saturation 0–100
    dim:     15,   // % — background video dimming overlay (lowered so wallpaper shows)
  };

  function load() {
    try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(LS) || '{}')); }
    catch (e) { return Object.assign({}, DEFAULTS); }
  }

  function save(s) {
    try { localStorage.setItem(LS, JSON.stringify(s)); } catch (e) {}
  }

  function applyToRoot(s) {
    var r = document.documentElement;
    var blur = s.blur;
    var op   = (s.opacity / 100).toFixed(3);
    var opMd = Math.min((s.opacity * 1.5) / 100, 0.30).toFixed(3);
    var opSt = Math.min((s.opacity * 2)   / 100, 0.40).toFixed(3);
    var tint = s.tintS > 0
      ? 'hsla(' + s.tintH + ',' + s.tintS + '%,60%,' + Math.min(s.opacity * 0.003, 0.06).toFixed(3) + ')'
      : 'transparent';

    r.style.setProperty('--lg-blur',     'blur(' + blur + 'px) saturate(210%) brightness(1.08)');
    r.style.setProperty('--lg-blur-md',  'blur(' + Math.round(blur * 0.64) + 'px) saturate(190%) brightness(1.05)');
    r.style.setProperty('--lg-blur-sm',  'blur(' + Math.round(blur * 0.36) + 'px) saturate(160%) brightness(1.03)');
    r.style.setProperty('--lg-blur-xs',  'blur(' + Math.round(blur * 0.18) + 'px) saturate(140%) brightness(1.02)');
    r.style.setProperty('--lg-bg',       'rgba(255,255,255,' + op + ')');
    r.style.setProperty('--lg-bg-md',    'rgba(255,255,255,' + opMd + ')');
    r.style.setProperty('--lg-bg-strong','rgba(255,255,255,' + opSt + ')');
    r.style.setProperty('--lg-tint',     tint);

    // Background video dimming
    var dimEl = document.getElementById('__isotope_dim__');
    if (dimEl) dimEl.style.opacity = (s.dim / 100).toFixed(3);
  }

  // Create a persistent dimming overlay for the background video
  function ensureDimOverlay() {
    if (document.getElementById('__isotope_dim__')) return;
    var el = document.createElement('div');
    el.id = '__isotope_dim__';
    el.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:3',
      'background:#09090b',
      'pointer-events:none',
      'transition:opacity 0.4s ease',
    ].join(';');
    document.body.insertBefore(el, document.body.firstChild);
  }

  // ── Panel Builder ────────────────────────────────────────────────────────────
  function buildPanel() {
    if (document.getElementById('__gs_panel__')) return;

    var settings = load();

    // Floating trigger button (bottom-left, stacked above perf-mode button)
    var trigger = document.createElement('button');
    trigger.id = '__gs_trigger__';
    trigger.title = 'Glass Settings';
    trigger.innerHTML = '◈';
    trigger.setAttribute('style', [
      'position:fixed', 'bottom:136px', 'left:14px',
      'z-index:2147483600',
      'width:38px', 'height:38px',
      'border-radius:50%',
      'border:1px solid rgba(255,255,255,0.12)',
      'background:rgba(8,8,14,0.72)',
      'backdrop-filter:blur(20px) saturate(1.6)',
      '-webkit-backdrop-filter:blur(20px) saturate(1.6)',
      'color:rgba(255,255,255,0.65)',
      'font-size:16px',
      'cursor:pointer',
      'display:flex', 'align-items:center', 'justify-content:center',
      'box-shadow:0 4px 16px rgba(0,0,0,0.4)',
      'transition:background 0.15s ease,color 0.15s ease,transform 0.15s ease',
      'font-family:system-ui,-apple-system,sans-serif',
    ].join(';'));
    trigger.addEventListener('mouseenter', function () {
      trigger.style.background = 'rgba(249,115,22,0.18)';
      trigger.style.color = 'rgba(255,255,255,0.9)';
      trigger.style.borderColor = 'rgba(249,115,22,0.4)';
    });
    trigger.addEventListener('mouseleave', function () {
      trigger.style.background = 'rgba(8,8,14,0.72)';
      trigger.style.color = 'rgba(255,255,255,0.65)';
      trigger.style.borderColor = 'rgba(255,255,255,0.12)';
    });

    // Panel
    var panel = document.createElement('div');
    panel.id = '__gs_panel__';
    panel.setAttribute('style', [
      'position:fixed', 'bottom:180px', 'left:14px',
      'z-index:2147483601',
      'width:228px',
      'background:rgba(8,8,14,0.90)',
      'backdrop-filter:blur(28px) saturate(1.6)',
      '-webkit-backdrop-filter:blur(28px) saturate(1.6)',
      'border:1px solid rgba(255,255,255,0.10)',
      'border-radius:20px',
      'box-shadow:0 16px 48px rgba(0,0,0,0.65),0 0 0 1px rgba(249,115,22,0.05)',
      'padding:16px',
      'display:none',
      'flex-direction:column',
      'gap:14px',
      'font-family:system-ui,-apple-system,sans-serif',
      'color:rgba(255,255,255,0.80)',
    ].join(';'));

    // Header
    var hdr = document.createElement('div');
    hdr.setAttribute('style', 'display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;');
    var hdrLabel = document.createElement('span');
    hdrLabel.textContent = 'Glass Settings';
    hdrLabel.setAttribute('style', 'font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:rgba(255,255,255,0.45);');
    var resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset';
    resetBtn.setAttribute('style', 'background:none;border:none;color:rgba(249,115,22,0.7);font-size:11px;cursor:pointer;padding:0;');
    resetBtn.addEventListener('click', function () {
      settings = Object.assign({}, DEFAULTS);
      save(settings);
      applyToRoot(settings);
      rebuildSliders();
    });
    hdr.appendChild(hdrLabel);
    hdr.appendChild(resetBtn);
    panel.appendChild(hdr);

    var sliderDefs = [
      { key: 'blur',    label: 'Blur',       min: 0,   max: 120, unit: 'px', step: 2 },
      { key: 'opacity', label: 'Opacity',    min: 0,   max: 30,  unit: '%',  step: 1 },
      { key: 'tintH',  label: 'Tint Hue',   min: 0,   max: 360, unit: '°',  step: 5 },
      { key: 'tintS',  label: 'Tint Sat.',  min: 0,   max: 100, unit: '%',  step: 5 },
      { key: 'dim',    label: 'BG Dim',     min: 0,   max: 90,  unit: '%',  step: 5 },
    ];

    var sliderEls = {};

    function makeSlider(def) {
      var row = document.createElement('div');
      row.setAttribute('style', 'display:flex;flex-direction:column;gap:5px;');

      var lbl = document.createElement('div');
      lbl.setAttribute('style', 'display:flex;justify-content:space-between;align-items:center;');
      var lblText = document.createElement('span');
      lblText.textContent = def.label;
      lblText.setAttribute('style', 'font-size:12px;color:rgba(255,255,255,0.60);');
      var valText = document.createElement('span');
      valText.textContent = settings[def.key] + def.unit;
      valText.setAttribute('style', 'font-size:12px;font-weight:600;color:rgba(249,115,22,0.9);min-width:36px;text-align:right;');
      lbl.appendChild(lblText);
      lbl.appendChild(valText);

      var input = document.createElement('input');
      input.type = 'range';
      input.min = def.min;
      input.max = def.max;
      input.step = def.step;
      input.value = settings[def.key];
      input.setAttribute('style', [
        'width:100%', '-webkit-appearance:none',
        'height:4px', 'border-radius:4px',
        'background:rgba(255,255,255,0.12)',
        'outline:none', 'cursor:pointer',
        'accent-color:#f97316',
      ].join(';'));

      input.addEventListener('input', function () {
        settings[def.key] = parseFloat(input.value);
        valText.textContent = settings[def.key] + def.unit;
        save(settings);
        applyToRoot(settings);
      });

      sliderEls[def.key] = { input: input, val: valText };
      row.appendChild(lbl);
      row.appendChild(input);
      return row;
    }

    var slidersContainer = document.createElement('div');
    slidersContainer.id = '__gs_sliders__';
    slidersContainer.setAttribute('style', 'display:flex;flex-direction:column;gap:12px;');

    function rebuildSliders() {
      slidersContainer.innerHTML = '';
      sliderDefs.forEach(function (def) {
        slidersContainer.appendChild(makeSlider(def));
      });
    }
    rebuildSliders();
    panel.appendChild(slidersContainer);

    // Toggle
    var open = false;
    trigger.addEventListener('click', function () {
      open = !open;
      panel.style.display = open ? 'flex' : 'none';
      trigger.style.transform = open ? 'rotate(45deg)' : '';
      trigger.style.color = open ? 'rgba(249,115,22,0.9)' : 'rgba(255,255,255,0.65)';
    });

    document.body.appendChild(trigger);
    document.body.appendChild(panel);
  }

  // ── Init ─────────────────────────────────────────────────────────────────────
  function init() {
    var settings = load();
    applyToRoot(settings);

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        ensureDimOverlay();
        applyToRoot(settings);
        setTimeout(buildPanel, 1200);
      });
    } else {
      ensureDimOverlay();
      applyToRoot(settings);
      setTimeout(buildPanel, 1200);
    }
  }

  init();
})();
