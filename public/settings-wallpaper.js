/**
 * IsotopeAI — Settings Wallpaper Section
 *
 * Injects a beautiful Apple-style "App Wallpaper" section into the /settings page.
 * Works by scanning the DOM for the settings container and prepending the card.
 * Listens for React Router navigation changes and re-injects on each visit.
 */
(function () {
  'use strict';

  var CARD_ID = '__isotope_wallpaper_section__';

  // ── Gradient definitions (all dark, white text always readable) ──────────────
  var PRESETS = [
    {
      id: 'video',
      label: 'Video',
      thumb: 'linear-gradient(145deg,#1a0a00 0%,#0f0700 35%,#050505 80%,#000000 100%)',
      icon:  'M5 3l14 9-14 9V3z',       // play icon path
    },
    {
      id: 'dark',
      label: 'Pure Dark',
      thumb: '#09090b',
      icon:  null,
    },
    {
      id: 'space',
      label: 'Space',
      thumb: 'radial-gradient(ellipse at 25% 25%,#140835 0%,#07041a 55%),linear-gradient(145deg,#060425 0%,#020210 100%)',
      gradient: 'radial-gradient(ellipse at 30% 25%,#16093c 0%,#07041a 50%),linear-gradient(145deg,#08052a 0%,#020210 100%)',
    },
    {
      id: 'ember',
      label: 'Ember',
      thumb: 'radial-gradient(ellipse at 50% 85%,rgba(249,115,22,0.35) 0%,transparent 55%),linear-gradient(145deg,#200a00 0%,#0f0600 50%,#0a000a 100%)',
      gradient: 'radial-gradient(ellipse at 50% 90%,rgba(249,115,22,0.30) 0%,transparent 55%),radial-gradient(ellipse at 80% 15%,rgba(200,50,10,0.12) 0%,transparent 40%),linear-gradient(145deg,#1e0900 0%,#110600 50%,#09000b 100%)',
    },
    {
      id: 'abyss',
      label: 'Abyss',
      thumb: 'radial-gradient(ellipse at 50% 10%,rgba(30,100,220,0.22) 0%,transparent 55%),linear-gradient(145deg,#010b1f 0%,#020e28 50%,#010913 100%)',
      gradient: 'radial-gradient(ellipse at 50% 0%,rgba(30,100,220,0.20) 0%,transparent 55%),radial-gradient(ellipse at 80% 85%,rgba(0,50,140,0.14) 0%,transparent 45%),linear-gradient(145deg,#010b1e 0%,#020e26 50%,#010912 100%)',
    },
    {
      id: 'forest',
      label: 'Forest',
      thumb: 'radial-gradient(ellipse at 50% 85%,rgba(16,185,129,0.18) 0%,transparent 55%),linear-gradient(145deg,#010c04 0%,#020f06 50%,#010a02 100%)',
      gradient: 'radial-gradient(ellipse at 50% 85%,rgba(16,185,129,0.15) 0%,transparent 55%),radial-gradient(ellipse at 20% 15%,rgba(10,120,60,0.12) 0%,transparent 40%),linear-gradient(145deg,#010c03 0%,#020f05 50%,#010a02 100%)',
    },
    {
      id: 'custom',
      label: 'Upload',
      isUpload: true,
      thumb: null,
    },
  ];

  // ── Helpers ───────────────────────────────────────────────────────────────────
  function currentId() {
    try {
      var s = JSON.parse(localStorage.getItem('isotope_bg_settings') || '{}');
      return s.id || s.type || 'video';
    } catch (e) { return 'video'; }
  }

  function applyPreset(id, file) {
    var mgr = window.__bgManager__;
    if (!mgr) return;
    if (id === 'video') {
      mgr.apply({ id: 'video', type: 'video', videoSrc: '/bg.mp4' });
    } else if (id === 'dark') {
      mgr.apply({ id: 'dark', type: 'dark' });
    } else if (id === 'custom' && file) {
      mgr.apply({ id: 'custom', file: file });
    } else {
      var preset = PRESETS.find(function (p) { return p.id === id; });
      if (preset && preset.gradient) {
        mgr.apply({ id: id, type: 'gradient', gradientCss: preset.gradient });
      }
    }
  }

  // ── Build the card DOM ────────────────────────────────────────────────────────
  function buildCard(activId) {
    var card = document.createElement('div');
    card.id = CARD_ID;
    card.style.cssText = [
      'margin:0 0 20px 0',
      'padding:18px 18px 16px',
      'border-radius:20px',
      'background:rgba(255,255,255,0.04)',
      'border:1px solid rgba(255,255,255,0.09)',
      'backdrop-filter:blur(16px)',
      '-webkit-backdrop-filter:blur(16px)',
      'color:#fff',
      'font-family:system-ui,-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif',
      'box-shadow:0 2px 16px rgba(0,0,0,0.25)',
    ].join(';');

    // ── Header ──────────────────────────────────────────────────────────────────
    var hdr = document.createElement('div');
    hdr.style.cssText = 'display:flex;align-items:center;gap:12px;margin-bottom:16px;';

    var iconBox = document.createElement('div');
    iconBox.style.cssText = [
      'width:36px', 'height:36px', 'border-radius:10px',
      'background:linear-gradient(135deg,rgba(249,115,22,0.18),rgba(249,115,22,0.06))',
      'border:1px solid rgba(249,115,22,0.28)',
      'display:flex', 'align-items:center', 'justify-content:center', 'flex-shrink:0',
    ].join(';');
    iconBox.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(249,115,22,0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
    hdr.appendChild(iconBox);

    var hdrText = document.createElement('div');
    hdrText.innerHTML = [
      '<div style="font-size:15px;font-weight:600;letter-spacing:-0.01em;color:#fff;">App Wallpaper</div>',
      '<div style="font-size:12px;color:rgba(255,255,255,0.45);margin-top:1px;">Full-screen background behind the glass UI</div>',
    ].join('');
    hdr.appendChild(hdrText);
    card.appendChild(hdr);

    // ── Grid ────────────────────────────────────────────────────────────────────
    var grid = document.createElement('div');
    grid.id = '__wpp_grid__';
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(72px,1fr));gap:10px;margin-bottom:14px;';

    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*,video/*,.mp4,.webm,.mov,.jpg,.jpeg,.png,.gif,.webp,.avif';
    fileInput.style.display = 'none';
    card.appendChild(fileInput);

    fileInput.addEventListener('change', function () {
      var file = fileInput.files && fileInput.files[0];
      fileInput.value = '';
      if (!file) return;
      applyPreset('custom', file);
      updateSelection('custom');
      updateStatus('custom');
    });

    PRESETS.forEach(function (preset) {
      var tile = document.createElement('button');
      tile.setAttribute('data-wpp-id', preset.id);
      var isActive = preset.id === activId;

      tile.style.cssText = [
        'position:relative',
        'width:100%',
        'aspect-ratio:1',
        'border-radius:14px',
        'border:2px solid ' + (isActive ? 'rgba(249,115,22,0.65)' : 'rgba(255,255,255,0.08)'),
        'box-shadow:' + (isActive ? '0 0 0 1px rgba(249,115,22,0.25),0 4px 12px rgba(249,115,22,0.15)' : 'none'),
        'background:' + (preset.thumb || 'rgba(255,255,255,0.05)'),
        'cursor:pointer',
        'overflow:hidden',
        'transition:border-color 0.18s ease,box-shadow 0.18s ease,transform 0.12s ease',
        'display:flex',
        'flex-direction:column',
        'align-items:center',
        'justify-content:center',
        'gap:4px',
        'padding:0',
        'outline:none',
      ].join(';');

      // Inner content
      if (preset.isUpload) {
        tile.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
      } else if (preset.id === 'video') {
        tile.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.60)" stroke="none"><path d="M5 3l14 9-14 9V3z"/></svg>';
      } else if (preset.id === 'dark') {
        tile.innerHTML = '<div style="width:24px;height:24px;border-radius:50%;background:rgba(255,255,255,0.12);border:1.5px solid rgba(255,255,255,0.20);"></div>';
      }

      // Checkmark for selected
      if (isActive) {
        var chk = document.createElement('div');
        chk.className = '__wpp_chk__';
        chk.style.cssText = [
          'position:absolute', 'top:5px', 'right:5px',
          'width:18px', 'height:18px', 'border-radius:50%',
          'background:rgba(249,115,22,0.90)',
          'display:flex', 'align-items:center', 'justify-content:center',
        ].join(';');
        chk.innerHTML = '<svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="2 6 5 9 10 3"/></svg>';
        tile.appendChild(chk);
      }

      tile.addEventListener('mouseenter', function () {
        if (tile.getAttribute('data-wpp-id') !== currentId()) tile.style.transform = 'scale(1.04)';
      });
      tile.addEventListener('mouseleave', function () { tile.style.transform = ''; });
      tile.addEventListener('click', function () {
        if (preset.isUpload) { fileInput.click(); return; }
        applyPreset(preset.id);
        updateSelection(preset.id);
        updateStatus(preset.id);
      });
      grid.appendChild(tile);
    });

    card.appendChild(grid);

    // ── Status line ─────────────────────────────────────────────────────────────
    var status = document.createElement('div');
    status.id = '__wpp_status__';
    var statusLabel = PRESETS.find(function (p) { return p.id === activId; });
    status.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.38);padding-top:2px;';
    status.textContent = 'Active: ' + (statusLabel ? statusLabel.label : 'Default Video');
    card.appendChild(status);

    return card;
  }

  // ── Update selection visuals ──────────────────────────────────────────────────
  function updateSelection(newId) {
    var card = document.getElementById(CARD_ID);
    if (!card) return;
    card.querySelectorAll('[data-wpp-id]').forEach(function (tile) {
      var tid = tile.getAttribute('data-wpp-id');
      var active = tid === newId;
      tile.style.borderColor     = active ? 'rgba(249,115,22,0.65)' : 'rgba(255,255,255,0.08)';
      tile.style.boxShadow       = active ? '0 0 0 1px rgba(249,115,22,0.25),0 4px 12px rgba(249,115,22,0.15)' : 'none';
      // Remove old checkmarks
      tile.querySelectorAll('.__wpp_chk__').forEach(function (c) { c.remove(); });
      if (active) {
        var chk = document.createElement('div');
        chk.className = '__wpp_chk__';
        chk.style.cssText = 'position:absolute;top:5px;right:5px;width:18px;height:18px;border-radius:50%;background:rgba(249,115,22,0.90);display:flex;align-items:center;justify-content:center;';
        chk.innerHTML = '<svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="2 6 5 9 10 3"/></svg>';
        tile.appendChild(chk);
      }
    });
  }

  function updateStatus(newId) {
    var status = document.getElementById('__wpp_status__');
    if (!status) return;
    var preset = PRESETS.find(function (p) { return p.id === newId; });
    status.textContent = 'Active: ' + (preset ? preset.label : newId);
  }

  // ── Find settings scrollable container ────────────────────────────────────────
  function findContainer() {
    // Look for the settings overflow-y:auto container that has settings content
    var candidates = Array.prototype.slice.call(
      document.querySelectorAll('[class*="overflow-y"]')
    ).concat(Array.prototype.slice.call(document.querySelectorAll('main')));

    for (var i = 0; i < candidates.length; i++) {
      var el = candidates[i];
      if (el.offsetHeight < 300) continue;
      var txt = el.textContent || '';
      // The settings page uniquely contains both of these strings
      if (txt.includes('Appearance') && txt.includes('Account') && el !== document.body) {
        return el;
      }
    }
    return null;
  }

  // ── Inject into settings page ─────────────────────────────────────────────────
  var injectAttempts = 0;
  function tryInject() {
    if (!location.pathname.startsWith('/settings')) { injectAttempts = 0; return; }
    if (document.getElementById(CARD_ID)) return; // already present
    injectAttempts++;

    var container = findContainer();
    if (!container) {
      if (injectAttempts < 20) setTimeout(tryInject, 250);
      return;
    }
    injectAttempts = 0;

    var card = buildCard(currentId());

    // Try to inject before the first section-like child
    var first = container.firstElementChild;
    if (first) {
      container.insertBefore(card, first);
    } else {
      container.appendChild(card);
    }
  }

  // ── Route change watching ─────────────────────────────────────────────────────
  function onRouteChange() {
    setTimeout(tryInject, 80);
    setTimeout(tryInject, 400);
    setTimeout(tryInject, 1000);
    setTimeout(tryInject, 2000);
  }

  ['pushState', 'replaceState'].forEach(function (method) {
    var orig = history[method];
    history[method] = function () {
      orig.apply(this, arguments);
      onRouteChange();
    };
  });
  window.addEventListener('popstate', onRouteChange);

  // Also watch DOM mutations — React may re-render the settings page
  var observer = new MutationObserver(function () {
    if (location.pathname.startsWith('/settings') && !document.getElementById(CARD_ID)) {
      tryInject();
    }
  });

  // ── Init ──────────────────────────────────────────────────────────────────────
  function init() {
    observer.observe(document.body, { childList: true, subtree: true });
    onRouteChange();
    // Initial check in case page loads directly on /settings
    setTimeout(tryInject, 500);
    setTimeout(tryInject, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
