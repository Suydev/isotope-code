/**
 * IsotopeAI — Focus Background Patch
 *
 * Fixes:
 *  1. Focus background rejects blob: URLs (only accepts https?://)
 *  2. Bridges the global bg-video IDB storage → focus background
 *
 * Adds:
 *  • "Import from wallpaper" button inside the focus settings panel
 *  • File picker to upload a focus-specific background directly
 *
 * Strategy:
 *  a) On load, read the custom blob from IDB (same store as bg-video.js)
 *  b) Apply it to the focus background div via direct style override
 *  c) MutationObserver keeps it applied if React re-renders clear it
 *  d) React fiber walk calls the imageUrl state setter with the blob URL,
 *     bypassing the https?:// validator entirely
 *  e) Intercept localStorage for 'focus-bg-image' to allow blob: URLs
 */
(function () {
  'use strict';

  var IDB_NAME  = 'isotope_bg_custom';
  var IDB_STORE = 'media';
  var FOCUS_LS  = 'focus-bg-image';

  // ── IDB helpers (same store as bg-video.js) ─────────────────────────────────
  function openIdb() {
    return new Promise(function (res, rej) {
      var r = indexedDB.open(IDB_NAME, 1);
      r.onupgradeneeded = function () { r.result.createObjectStore(IDB_STORE); };
      r.onsuccess = function () { res(r.result); };
      r.onerror   = function () { rej(r.error); };
    });
  }
  function idbLoad(key) {
    return openIdb().then(function (db) {
      return new Promise(function (res) {
        var tx = db.transaction(IDB_STORE, 'readonly');
        var r  = tx.objectStore(IDB_STORE).get(key);
        r.onsuccess = function () { res(r.result || null); };
        r.onerror   = function () { res(null); };
      });
    });
  }
  function idbSave(key, val) {
    return openIdb().then(function (db) {
      return new Promise(function (res, rej) {
        var tx = db.transaction(IDB_STORE, 'readwrite');
        tx.objectStore(IDB_STORE).put(val, key);
        tx.oncomplete = res; tx.onerror = rej;
      });
    });
  }

  // ── State ────────────────────────────────────────────────────────────────────
  var _blobUrl   = null;
  var _styleObs  = null;
  var _domObs    = null;
  var _applied   = false;

  // ── (a) Patch localStorage so blob: URLs pass the https?:// guard ────────────
  // The focusBackground module reads via localStorage.getItem('focus-bg-image')
  // (or a thin Promise-wrapper over localStorage). We intercept getItem/setItem
  // so blob: values round-trip correctly.
  var _lsOrig = Storage.prototype.getItem;
  Storage.prototype.getItem = function (key) {
    var raw = _lsOrig.call(this, key);
    if (key === FOCUS_LS && _blobUrl && (!raw || raw.startsWith('blob:'))) {
      return _blobUrl;
    }
    return raw;
  };

  // ── (b) Find the focus background element ────────────────────────────────────
  // Compiled bundle renders:
  //   <div className="fixed inset-0 z-0 pointer-events-none transition-all duration-700"
  //        style={{ backgroundImage: `url(${imageUrl})`, ... }}>
  var SEL = '.fixed.inset-0.z-0.pointer-events-none';

  function findFocusBg() {
    var els = document.querySelectorAll(SEL);
    for (var i = 0; i < els.length; i++) {
      // The focus bg is inside the focus route — skip the global bg layers
      if (els[i].id && (els[i].id === 'isotope-bg-image' || els[i].id === '__bg_dark__')) continue;
      return els[i];
    }
    return null;
  }

  // ── (c) Apply blob URL to DOM ─────────────────────────────────────────────────
  function applyStyle(el, url) {
    el.style.backgroundImage    = 'url(' + url + ')';
    el.style.backgroundSize     = 'cover';
    el.style.backgroundPosition = 'center';
    el.style.backgroundRepeat   = 'no-repeat';
  }

  function applyToDom(url) {
    var el = findFocusBg();
    if (!el) return false;
    applyStyle(el, url);
    watchStyle(el, url);
    _applied = true;
    return true;
  }

  // ── (d) MutationObserver — keep style when React re-renders ──────────────────
  function watchStyle(el, url) {
    if (_styleObs) _styleObs.disconnect();
    _styleObs = new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        var t = m.target;
        if (!t.style.backgroundImage || t.style.backgroundImage === 'none') {
          applyStyle(t, url);
        }
      });
    });
    _styleObs.observe(el, { attributes: true, attributeFilter: ['style'] });
  }

  // ── (e) React fiber walk — call the imageUrl state setter directly ────────────
  function walkFiber(node, fn, depth) {
    if (!node || depth > 500) return;
    fn(node);
    walkFiber(node.child, fn, depth + 1);
    walkFiber(node.sibling, fn, depth + 1);
  }

  function trySetReactImageUrl(url) {
    var root = document.getElementById('root');
    if (!root) return;
    var fk = Object.keys(root).find(function (k) {
      return k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance');
    });
    if (!fk) return;

    walkFiber(root[fk], function (fiber) {
      var s = fiber.memoizedState;
      while (s) {
        // imageUrl state: null or a URL string (either http or blob)
        var v = s.memoizedState;
        var q = s.queue;
        if (q && q.dispatch && (v === null || typeof v === 'string') &&
            typeof v !== 'boolean' && typeof v !== 'number') {
          // Check sibling state is blurAmount (a number 0-24)
          var next = s.next;
          if (next && typeof next.memoizedState === 'number' &&
              next.memoizedState >= 0 && next.memoizedState <= 24) {
            try { q.dispatch(url); } catch (_) {}
          }
        }
        s = s.next;
      }
    }, 0);
  }

  // ── Main apply pipeline ───────────────────────────────────────────────────────
  function applyBlobUrl(url) {
    _blobUrl = url;
    try { localStorage.setItem(FOCUS_LS, url); } catch (_) {}

    var attempts = 0;
    function tryApply() {
      var ok = applyToDom(url);
      trySetReactImageUrl(url);
      if (!ok && ++attempts < 40) setTimeout(tryApply, 250);
    }
    tryApply();
  }

  // ── Load from IDB ────────────────────────────────────────────────────────────
  function loadFromIdb() {
    idbLoad('custom').then(function (blob) {
      if (!blob) return;
      // Skip video blobs for the focus background image
      if (blob.type && blob.type.startsWith('video/')) return;
      if (_blobUrl) URL.revokeObjectURL(_blobUrl);
      applyBlobUrl(URL.createObjectURL(blob));
    }).catch(function () {});
  }

  // ── "Import from wallpaper" button ───────────────────────────────────────────
  function makeBtn(label, onClick) {
    var btn = document.createElement('button');
    btn.innerHTML = label;
    btn.style.cssText = [
      'display:inline-flex', 'align-items:center', 'gap:5px',
      'padding:5px 12px', 'border-radius:8px', 'font-size:12px', 'font-weight:500',
      'background:rgba(249,115,22,0.15)', 'color:rgb(249,115,22)',
      'border:1px solid rgba(249,115,22,0.3)', 'cursor:pointer',
      'transition:background 0.15s', 'white-space:nowrap',
    ].join(';');
    btn.onmouseenter = function () { btn.style.background = 'rgba(249,115,22,0.28)'; };
    btn.onmouseleave = function () { btn.style.background = 'rgba(249,115,22,0.15)'; };
    btn.onclick = onClick;
    return btn;
  }

  function injectImportButton() {
    if (document.getElementById('__focus_bg_bar__')) return;

    // Find the focus background trigger button (the one that prompts for URL)
    var allBtns = Array.from(document.querySelectorAll('button'));
    var trigger = allBtns.find(function (b) {
      var txt = (b.textContent || '').trim().toLowerCase();
      var cls = (b.className || '').toLowerCase();
      return txt.includes('background') || txt.includes('wallpaper') ||
             txt.includes('image') || cls.includes('bg') || cls.includes('background');
    });

    if (!trigger) {
      // Try: find the icon button near blur controls (focus settings area)
      var sliders = document.querySelectorAll('input[type="range"]');
      if (!sliders.length) return; // Not on focus settings
      trigger = sliders[0].closest('div') || sliders[0].parentElement;
    }

    var bar = document.createElement('div');
    bar.id = '__focus_bg_bar__';
    bar.style.cssText = 'display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:8px;';

    // Button 1: Import from global wallpaper IDB storage
    bar.appendChild(makeBtn('📁 Use global wallpaper', function () {
      idbLoad('custom').then(function (blob) {
        if (!blob || (blob.type && blob.type.startsWith('video/'))) {
          showToast('No image wallpaper found. Set one via the ◈ button first.');
          return;
        }
        if (_blobUrl) URL.revokeObjectURL(_blobUrl);
        applyBlobUrl(URL.createObjectURL(blob));
        showToast('Wallpaper applied to Focus background!');
      });
    }));

    // Button 2: Upload a focus-specific image
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*,.jpg,.jpeg,.png,.webp,.avif,.gif';
    fileInput.style.display = 'none';
    fileInput.onchange = function () {
      var file = fileInput.files && fileInput.files[0];
      if (!file) return;
      idbSave('focus_custom', file).catch(function () {});
      if (_blobUrl) URL.revokeObjectURL(_blobUrl);
      applyBlobUrl(URL.createObjectURL(file));
      showToast('Focus background updated!');
    };
    document.body.appendChild(fileInput);

    bar.appendChild(makeBtn('🖼 Upload image', function () { fileInput.click(); }));

    // Button 3: Clear
    bar.appendChild(makeBtn('✕ Clear', function () {
      if (_blobUrl) { URL.revokeObjectURL(_blobUrl); _blobUrl = null; }
      if (_styleObs) { _styleObs.disconnect(); _styleObs = null; }
      try { localStorage.removeItem(FOCUS_LS); } catch (_) {}
      var el = findFocusBg();
      if (el) { el.style.backgroundImage = ''; }
      trySetReactImageUrl(null);
      showToast('Focus background cleared.');
    }));

    // Insert after trigger or into the focus panel
    if (trigger && trigger.parentElement) {
      trigger.parentElement.insertBefore(bar, trigger.nextSibling);
    } else {
      // Fallback: floating toolbar at bottom of focus pane
      bar.style.cssText += ';position:fixed;bottom:72px;right:16px;z-index:9999;' +
        'background:rgba(9,9,11,0.85);backdrop-filter:blur(12px);' +
        'padding:8px 12px;border-radius:12px;border:1px solid rgba(255,255,255,0.08);';
      document.body.appendChild(bar);
    }
  }

  // ── Toast notification ────────────────────────────────────────────────────────
  function showToast(msg) {
    var t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = [
      'position:fixed', 'bottom:80px', 'left:50%', 'transform:translateX(-50%)',
      'background:rgba(9,9,11,0.92)', 'color:#fff', 'padding:10px 20px',
      'border-radius:10px', 'font-size:13px', 'z-index:2147483640',
      'border:1px solid rgba(255,255,255,0.1)', 'backdrop-filter:blur(8px)',
      'transition:opacity 0.4s', 'pointer-events:none',
    ].join(';');
    document.body.appendChild(t);
    setTimeout(function () { t.style.opacity = '0'; }, 2200);
    setTimeout(function () { t.remove(); }, 2700);
  }

  // ── Route watcher ─────────────────────────────────────────────────────────────
  function isOnFocus() {
    return window.location.pathname.includes('/focus') ||
           window.location.hash.includes('focus');
  }

  function onRouteChange() {
    if (!isOnFocus()) return;
    if (_blobUrl) {
      var attempts = 0;
      function retry() {
        if (applyToDom(_blobUrl)) { trySetReactImageUrl(_blobUrl); return; }
        if (++attempts < 20) setTimeout(retry, 300);
      }
      retry();
    }
    setTimeout(injectImportButton, 1200);
  }

  function patchHistory() {
    ['pushState', 'replaceState'].forEach(function (method) {
      var orig = history[method];
      history[method] = function () {
        orig.apply(history, arguments);
        setTimeout(onRouteChange, 100);
      };
    });
    window.addEventListener('popstate', function () { setTimeout(onRouteChange, 100); });
  }

  // ── MutationObserver: watch for focus bg element arriving in DOM ──────────────
  function watchDomForFocusBg() {
    if (_domObs) return;
    _domObs = new MutationObserver(function () {
      if (_blobUrl && !_applied) {
        var el = findFocusBg();
        if (el) {
          applyStyle(el, _blobUrl);
          watchStyle(el, _blobUrl);
          _applied = true;
          trySetReactImageUrl(_blobUrl);
        }
      }
      if (isOnFocus() && !document.getElementById('__focus_bg_bar__')) {
        injectImportButton();
      }
    });
    _domObs.observe(document.body, { childList: true, subtree: true });
  }

  // ── Init ──────────────────────────────────────────────────────────────────────
  function init() {
    patchHistory();
    watchDomForFocusBg();

    // Check if a focus-specific blob was saved previously
    idbLoad('focus_custom').then(function (blob) {
      if (blob && !blob.type.startsWith('video/')) {
        if (_blobUrl) URL.revokeObjectURL(_blobUrl);
        applyBlobUrl(URL.createObjectURL(blob));
      } else {
        // Fall back to global wallpaper from bg-video.js
        loadFromIdb();
      }
    }).catch(loadFromIdb);

    // Periodic re-apply on focus route (in case SPA re-mounts the component)
    setInterval(function () {
      if (!_blobUrl || !isOnFocus()) return;
      var el = findFocusBg();
      if (el && !el.style.backgroundImage) {
        applyStyle(el, _blobUrl);
        watchStyle(el, _blobUrl);
        trySetReactImageUrl(_blobUrl);
      }
    }, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
