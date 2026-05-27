/**
 * IsotopeAI Background Video System
 * - User imports their own video file via a floating button
 * - Video is stored in IndexedDB — survives page refresh
 * - Full-screen looping video plays behind all glass UI
 * - Toggle visibility, remove, or replace at any time
 */
(function () {
  'use strict';

  var DB_NAME   = 'isotope_bgvideo';
  var STORE     = 'video';
  var KEY       = 'bg';
  var LS_ENABLED = 'isotope_bgvideo_enabled';
  var LS_OPACITY = 'isotope_bgvideo_opacity';

  // ── IndexedDB helpers ───────────────────────────────────────────────────────
  function openDB() {
    return new Promise(function (resolve, reject) {
      var req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = function () { req.result.createObjectStore(STORE); };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror   = function () { reject(req.error); };
    });
  }
  function saveBlob(blob) {
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).put(blob, KEY);
        tx.oncomplete = resolve;
        tx.onerror    = reject;
      });
    });
  }
  function loadBlob() {
    return openDB().then(function (db) {
      return new Promise(function (resolve) {
        var tx  = db.transaction(STORE, 'readonly');
        var req = tx.objectStore(STORE).get(KEY);
        req.onsuccess = function () { resolve(req.result || null); };
        req.onerror   = function () { resolve(null); };
      });
    });
  }
  function deleteBlob() {
    return openDB().then(function (db) {
      return new Promise(function (resolve) {
        var tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).delete(KEY);
        tx.oncomplete = resolve;
        tx.onerror    = resolve;
      });
    });
  }

  // ── Video element ───────────────────────────────────────────────────────────
  var videoEl       = null;
  var blobUrl       = null;
  var hasVideo      = false;

  function getOpacity() {
    var v = parseFloat(localStorage.getItem(LS_OPACITY));
    return isNaN(v) ? 0.40 : Math.min(1, Math.max(0.05, v));
  }

  function isEnabled() {
    return localStorage.getItem(LS_ENABLED) !== '0';
  }

  function createVideoEl() {
    if (videoEl) return;
    videoEl = document.createElement('video');
    videoEl.id = 'isotope-bg-video';
    videoEl.setAttribute('autoplay', '');
    videoEl.setAttribute('loop', '');
    videoEl.setAttribute('muted', '');
    videoEl.setAttribute('playsinline', '');
    videoEl.setAttribute('aria-hidden', 'true');
    videoEl.style.cssText = [
      'position:fixed', 'top:0', 'left:0',
      'width:100vw', 'height:100vh',
      'object-fit:cover',
      'z-index:-2',
      'pointer-events:none',
      'opacity:0',
      'transition:opacity 1.4s cubic-bezier(0.22,1,0.36,1)',
    ].join(';');
    document.body.insertBefore(videoEl, document.body.firstChild);
  }

  function setSource(blob) {
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    blobUrl = URL.createObjectURL(blob);
    createVideoEl();
    videoEl.src = blobUrl;
    videoEl.load();
    var p = videoEl.play();
    if (p && p.catch) p.catch(function () {});
    hasVideo = true;
    updateVisibility();
  }

  function updateVisibility() {
    if (!videoEl) return;
    videoEl.style.opacity = (hasVideo && isEnabled()) ? String(getOpacity()) : '0';
  }

  // ── Toast notification ──────────────────────────────────────────────────────
  function toast(msg) {
    var el = document.createElement('div');
    el.textContent = msg;
    el.style.cssText = [
      'position:fixed', 'bottom:100px', 'left:50%',
      'transform:translateX(-50%) translateY(0)',
      'background:rgba(15,15,20,0.75)',
      'backdrop-filter:blur(20px)', '-webkit-backdrop-filter:blur(20px)',
      'border:1px solid rgba(249,115,22,0.35)',
      'color:rgba(255,255,255,0.9)', 'font-size:13px', 'font-weight:500',
      'font-family:system-ui,-apple-system,sans-serif',
      'padding:9px 18px', 'border-radius:999px',
      'z-index:2147483647', 'pointer-events:none',
      'opacity:1', 'transition:opacity 0.5s ease',
      'white-space:nowrap',
      'box-shadow:0 4px 20px rgba(0,0,0,0.35)',
    ].join(';');
    document.body.appendChild(el);
    setTimeout(function () {
      el.style.opacity = '0';
      setTimeout(function () { el.remove(); }, 500);
    }, 2200);
  }

  // ── Opacity slider ──────────────────────────────────────────────────────────
  function buildSlider(onChange) {
    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;align-items:center;gap:8px;padding:4px 14px 10px;';

    var label = document.createElement('span');
    label.textContent = 'Opacity';
    label.style.cssText = 'color:rgba(255,255,255,0.5);font-size:11px;min-width:44px;font-family:system-ui,sans-serif;';

    var slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '5';
    slider.max = '100';
    slider.step = '5';
    slider.value = String(Math.round(getOpacity() * 100));
    slider.style.cssText = [
      'flex:1', 'appearance:none', '-webkit-appearance:none',
      'height:3px', 'border-radius:9999px',
      'background:rgba(255,255,255,0.15)',
      'outline:none', 'cursor:pointer',
    ].join(';');
    slider.addEventListener('input', function () {
      var v = parseInt(slider.value) / 100;
      localStorage.setItem(LS_OPACITY, String(v));
      if (videoEl) videoEl.style.opacity = (hasVideo && isEnabled()) ? String(v) : '0';
      if (onChange) onChange();
    });

    wrap.appendChild(label);
    wrap.appendChild(slider);
    return wrap;
  }

  // ── Main UI ─────────────────────────────────────────────────────────────────
  function buildUI() {
    // ── File input ────────────────────────────────────────────────────────────
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'video/*,.mp4,.webm,.mov,.mkv,.avi';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    // ── Panel ─────────────────────────────────────────────────────────────────
    var panel = document.createElement('div');
    panel.id = 'isotope-bgvideo-panel';
    panel.style.cssText = [
      'position:fixed', 'bottom:134px', 'right:18px',
      'background:rgba(12,12,16,0.82)',
      'backdrop-filter:blur(28px)', '-webkit-backdrop-filter:blur(28px)',
      'border:1px solid rgba(255,255,255,0.10)',
      'border-radius:18px', 'padding:6px 0 4px',
      'z-index:9998', 'display:none', 'flex-direction:column', 'gap:1px',
      'min-width:192px',
      'box-shadow:0 12px 40px rgba(0,0,0,0.5),0 2px 8px rgba(0,0,0,0.3)',
      'font-family:system-ui,-apple-system,sans-serif',
      'overflow:hidden',
    ].join(';');

    function item(icon, label, fn, destructive) {
      var b = document.createElement('button');
      b.style.cssText = [
        'display:flex', 'align-items:center', 'gap:10px',
        'padding:9px 14px', 'border:none', 'background:transparent',
        'color:' + (destructive ? 'rgba(248,113,113,0.85)' : 'rgba(255,255,255,0.80)'),
        'font-size:13px', 'font-weight:500', 'cursor:pointer',
        'border-radius:12px', 'margin:0 4px', 'width:calc(100% - 8px)',
        'text-align:left', 'transition:background 0.12s ease',
      ].join(';');
      b.innerHTML = '<span style="opacity:0.7;line-height:0">' + icon + '</span><span>' + label + '</span>';
      b.addEventListener('mouseenter', function () {
        b.style.background = destructive ? 'rgba(248,113,113,0.10)' : 'rgba(255,255,255,0.07)';
      });
      b.addEventListener('mouseleave', function () {
        b.style.background = 'transparent';
      });
      b.addEventListener('click', function () { closePanel(); fn(); });
      return b;
    }

    var importBtn = item(
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
      'Import video…',
      function () { fileInput.click(); }
    );

    var toggleLabel = document.createElement('span');
    var toggleBtn = item(
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>',
      isEnabled() ? 'Hide video' : 'Show video',
      function () {
        var next = !isEnabled();
        localStorage.setItem(LS_ENABLED, next ? '1' : '0');
        updateVisibility();
        toggleBtn.querySelector('span:last-child').textContent = next ? 'Hide video' : 'Show video';
        mainBtn.style.opacity = (next && hasVideo) ? '1' : '0.5';
        toast(next ? 'Background video shown' : 'Background video hidden');
      }
    );

    var sep = document.createElement('div');
    sep.style.cssText = 'height:1px;background:rgba(255,255,255,0.07);margin:4px 8px;';

    var sliderRow = buildSlider(function () {});

    var sep2 = document.createElement('div');
    sep2.style.cssText = 'height:1px;background:rgba(255,255,255,0.07);margin:4px 8px;';

    var removeBtn = item(
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>',
      'Remove video',
      function () {
        deleteBlob().then(function () {
          hasVideo = false;
          updateVisibility();
          if (blobUrl) { URL.revokeObjectURL(blobUrl); blobUrl = null; }
          if (videoEl) { videoEl.src = ''; videoEl.load(); }
          localStorage.removeItem(LS_ENABLED);
          mainBtn.style.opacity = '0.5';
          toast('Background video removed');
        });
      },
      true
    );

    panel.appendChild(importBtn);
    panel.appendChild(toggleBtn);
    panel.appendChild(sep);
    panel.appendChild(sliderRow);
    panel.appendChild(sep2);
    panel.appendChild(removeBtn);
    document.body.appendChild(panel);

    // ── Main floating button ──────────────────────────────────────────────────
    var mainBtn = document.createElement('button');
    mainBtn.id = 'isotope-bgvideo-btn';
    mainBtn.setAttribute('aria-label', 'Background Video');
    mainBtn.title = 'Background Video';
    mainBtn.innerHTML = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>';
    mainBtn.style.cssText = [
      'position:fixed', 'bottom:82px', 'right:18px',
      'width:40px', 'height:40px', 'border-radius:50%',
      'background:rgba(255,255,255,0.07)',
      'backdrop-filter:blur(20px)', '-webkit-backdrop-filter:blur(20px)',
      'border:1px solid rgba(255,255,255,0.12)',
      'color:rgba(255,255,255,0.65)', 'cursor:pointer',
      'display:flex', 'align-items:center', 'justify-content:center',
      'z-index:9999',
      'box-shadow:0 4px 16px rgba(0,0,0,0.25)',
      'transition:all 0.2s cubic-bezier(0.22,1,0.36,1)',
      'opacity:' + ((hasVideo && isEnabled()) ? '1' : '0.5'),
    ].join(';');

    var panelOpen = false;

    function closePanel() {
      panelOpen = false;
      panel.style.display = 'none';
      mainBtn.style.background = 'rgba(255,255,255,0.07)';
      mainBtn.style.borderColor = 'rgba(255,255,255,0.12)';
    }

    mainBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      panelOpen = !panelOpen;
      panel.style.display = panelOpen ? 'flex' : 'none';
      mainBtn.style.background = panelOpen
        ? 'rgba(249,115,22,0.18)' : 'rgba(255,255,255,0.07)';
      mainBtn.style.borderColor = panelOpen
        ? 'rgba(249,115,22,0.40)' : 'rgba(255,255,255,0.12)';
    });

    mainBtn.addEventListener('mouseenter', function () {
      if (!panelOpen) {
        mainBtn.style.background  = 'rgba(249,115,22,0.12)';
        mainBtn.style.borderColor = 'rgba(249,115,22,0.30)';
      }
      mainBtn.style.transform = 'scale(1.06)';
    });
    mainBtn.addEventListener('mouseleave', function () {
      if (!panelOpen) {
        mainBtn.style.background  = 'rgba(255,255,255,0.07)';
        mainBtn.style.borderColor = 'rgba(255,255,255,0.12)';
      }
      mainBtn.style.transform = 'scale(1)';
    });

    document.addEventListener('click', function (e) {
      if (panelOpen && !panel.contains(e.target) && e.target !== mainBtn) {
        closePanel();
      }
    });

    // ── File import handler ───────────────────────────────────────────────────
    fileInput.addEventListener('change', function () {
      var file = fileInput.files && fileInput.files[0];
      fileInput.value = '';
      if (!file) return;
      toast('Importing video…');
      saveBlob(file)
        .then(function () {
          setSource(file);
          localStorage.setItem(LS_ENABLED, '1');
          mainBtn.style.opacity = '1';
          toggleBtn.querySelector('span:last-child').textContent = 'Hide video';
          toast('Background video imported ✓');
        })
        .catch(function () { toast('Could not save video — try a smaller file'); });
    });

    document.body.appendChild(mainBtn);
  }

  // ── Init ─────────────────────────────────────────────────────────────────────
  function init() {
    buildUI();
    loadBlob().then(function (blob) {
      if (blob) setSource(blob);
    }).catch(function () {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
