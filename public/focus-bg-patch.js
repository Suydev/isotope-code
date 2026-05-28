/**
 * IsotopeAI — Focus Background Patch v2
 *
 * What this fixes:
 *  1. The Focus tab's "Set background" dialog only accepts http/https URLs.
 *     The server.mjs now patches the bundle's sn() validator to also accept
 *     blob: and data: URLs. This script intercepts the prompt() call to show
 *     our own modal instead of the native browser prompt.
 *
 *  2. Adds "Import from storage" — a file picker that loads any image
 *     from the user's device and applies it as the focus background.
 *
 *  3. Adds "Use wallpaper" — reuses the global app wallpaper (from IDB)
 *     as the focus background.
 *
 * Strategy:
 *  a) window.__isoBgP is set to our custom prompt interceptor.
 *     server.mjs patches the Focus bundle to call (window.__isoBgP||prompt)(...)
 *     so our hook fires instead of the native dialog.
 *  b) window.__isoBgQueued holds a pre-resolved URL (blob/http/data).
 *     When the interceptor fires with a queued URL it returns it immediately,
 *     so the React component's nn()/xe() path runs normally.
 *  c) Without a queued URL the interceptor shows our custom modal and returns
 *     null — the component's if(v) guard silently aborts. When the user
 *     confirms in our modal we store the URL and programmatically re-click
 *     the trigger button (triggering the second call that succeeds).
 *  d) Direct DOM override + MutationObserver as belt-and-suspenders fallback.
 *  e) Persistent storage in IDB so the background survives page reloads.
 *  f) window.__isoBgInvalid is set to a no-op so the "invalid URL" alert is
 *     suppressed (blob: URLs are now valid — the alert is never needed).
 */
(function () {
  'use strict';

  /* ── IDB helpers ──────────────────────────────────────────────────────────── */
  var IDB_NAME  = 'isotope_bg_custom';
  var IDB_STORE = 'media';

  function openIdb() {
    return new Promise(function (res, rej) {
      var r = indexedDB.open(IDB_NAME, 1);
      r.onupgradeneeded = function () { r.result.createObjectStore(IDB_STORE); };
      r.onsuccess = function () { res(r.result); };
      r.onerror   = function () { rej(r.error); };
    });
  }
  function idbGet(key) {
    return openIdb().then(function (db) {
      return new Promise(function (res) {
        var tx = db.transaction(IDB_STORE, 'readonly');
        var req = tx.objectStore(IDB_STORE).get(key);
        req.onsuccess = function () { res(req.result || null); };
        req.onerror   = function () { res(null); };
      });
    });
  }
  function idbPut(key, val) {
    return openIdb().then(function (db) {
      return new Promise(function (res, rej) {
        var tx = db.transaction(IDB_STORE, 'readwrite');
        tx.objectStore(IDB_STORE).put(val, key);
        tx.oncomplete = res; tx.onerror = rej;
      });
    });
  }

  /* ── State ────────────────────────────────────────────────────────────────── */
  var _currentBlobUrl = null;  // current active blob URL (revokable)
  var _styleObs = null;        // MutationObserver on the bg element's style
  var _triggerBtn = null;      // cached reference to the "Set background" button

  /* ── Suppress the "invalid URL" alert (blob: is now valid) ───────────────── */
  window.__isoBgInvalid = function () { /* no-op */ };

  /* ── Custom prompt interceptor ────────────────────────────────────────────── */
  window.__isoBgP = function (message) {
    // If a URL is already queued (from our modal), return it synchronously.
    if (window.__isoBgQueued) {
      var url = window.__isoBgQueued;
      window.__isoBgQueued = null;
      return url;
    }
    // Otherwise, show our modal and return null (the React handler does nothing
    // when prompt returns null/empty, so it cancels cleanly).
    showModal();
    return null;
  };

  /* ── Toast ────────────────────────────────────────────────────────────────── */
  function toast(msg, type) {
    var t = document.createElement('div');
    t.textContent = msg;
    var bg = type === 'error' ? 'rgba(239,68,68,0.92)' : 'rgba(9,9,11,0.92)';
    t.setAttribute('style', [
      'position:fixed', 'bottom:90px', 'left:50%', 'transform:translateX(-50%) translateY(10px)',
      'background:' + bg, 'color:#fff', 'padding:11px 22px', 'border-radius:12px',
      'font-size:13.5px', 'z-index:2147483646', 'border:1px solid rgba(255,255,255,0.10)',
      'backdrop-filter:blur(10px)', 'transition:opacity 0.35s,transform 0.35s',
      'pointer-events:none', 'font-family:system-ui,sans-serif', 'font-weight:500',
    ].join(';'));
    document.body.appendChild(t);
    requestAnimationFrame(function () {
      t.style.opacity = '1';
      t.style.transform = 'translateX(-50%) translateY(0)';
    });
    setTimeout(function () { t.style.opacity = '0'; t.style.transform = 'translateX(-50%) translateY(6px)'; }, 2400);
    setTimeout(function () { t.remove(); }, 2900);
  }

  /* ── Apply blob URL to the Focus background element ──────────────────────── */
  function findFocusBgEl() {
    // The focus background div: fixed, inset-0, z-0, pointer-events-none,
    // but NOT the global bg layers (#isotope-bg-image, __bg_dark__, #__bg_dark__)
    var candidates = document.querySelectorAll(
      '.fixed.inset-0.z-0.pointer-events-none, [class*="fixed"][class*="inset-0"][class*="z-0"][class*="pointer-events-none"]'
    );
    for (var i = 0; i < candidates.length; i++) {
      var el = candidates[i];
      if (el.id === 'isotope-bg-image' || el.id === '__bg_dark__') continue;
      return el;
    }
    return null;
  }

  function applyToDom(url) {
    var el = findFocusBgEl();
    if (!el) return false;
    el.style.backgroundImage    = 'url(' + url + ')';
    el.style.backgroundSize     = 'cover';
    el.style.backgroundPosition = 'center';
    el.style.backgroundRepeat   = 'no-repeat';
    // Watch for React clearing our style and reapply
    if (_styleObs) _styleObs.disconnect();
    _styleObs = new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        if (!m.target.style.backgroundImage || m.target.style.backgroundImage === 'none') {
          m.target.style.backgroundImage    = 'url(' + url + ')';
          m.target.style.backgroundSize     = 'cover';
          m.target.style.backgroundPosition = 'center';
        }
      });
    });
    _styleObs.observe(el, { attributes: true, attributeFilter: ['style'] });
    return true;
  }

  /* ── Walk React fiber to find and call the imageUrl state setter ─────────── */
  function walkFiber(node, fn, depth) {
    if (!node || depth > 800) return;
    fn(node);
    walkFiber(node.child,    fn, depth + 1);
    walkFiber(node.sibling,  fn, depth + 1);
  }

  function callReactSetter(url) {
    var root = document.getElementById('root');
    if (!root) return;
    var fk = Object.keys(root).find(function (k) {
      return k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance');
    });
    if (!fk) return;
    walkFiber(root[fk], function (fiber) {
      var s = fiber.memoizedState;
      while (s) {
        var v = s.memoizedState;
        var q = s.queue;
        // imageUrl state is null or a URL string; next state is blurAmount (number 0-24)
        if (q && q.dispatch && (v === null || (typeof v === 'string' && v !== '')) ) {
          var nx = s.next;
          if (nx && typeof nx.memoizedState === 'number' &&
              nx.memoizedState >= 0 && nx.memoizedState <= 24) {
            try { q.dispatch(url); } catch (_) {}
          }
        }
        s = s.next;
      }
    }, 0);
  }

  /* ── Queue a URL and click the trigger button to apply it ────────────────── */
  function queueAndApply(url) {
    // Revoke old blob
    if (_currentBlobUrl && _currentBlobUrl.startsWith('blob:')) {
      URL.revokeObjectURL(_currentBlobUrl);
    }
    _currentBlobUrl = url;

    // Apply directly to DOM (instant, no round-trip through React)
    var attempts = 0;
    (function tryDom() {
      if (!applyToDom(url) && ++attempts < 30) return setTimeout(tryDom, 200);
    })();

    // Also try the React state setter
    callReactSetter(url);

    // Re-try state setter a few times (component may not be mounted yet)
    [300, 700, 1200].forEach(function (d) {
      setTimeout(function () { callReactSetter(url); }, d);
    });

    // If the trigger button is known, queue the URL and re-click it so the
    // patched bundle's nn()/xe() path runs and persists the setting in IDB.
    if (_triggerBtn) {
      window.__isoBgQueued = url;
      try { _triggerBtn.click(); } catch (_) {}
    }
  }

  /* ── Persist a File blob to our IDB so it survives page reloads ─────────── */
  function persistFile(file) {
    idbPut('focus_custom', file).catch(function () {});
  }
  function persistBlob(key, blob) {
    idbPut(key, blob).catch(function () {});
  }

  /* ── Load previously saved focus background from IDB on startup ─────────── */
  function loadSavedBackground() {
    idbGet('focus_custom').then(function (blob) {
      if (!blob) return idbGet('custom').then(function (wb) {
        if (wb && wb.type && !wb.type.startsWith('video/')) {
          var url = URL.createObjectURL(wb);
          _currentBlobUrl = url;
          applyToDom(url);
          callReactSetter(url);
        }
      });
      if (blob.type && blob.type.startsWith('video/')) return;
      var url = URL.createObjectURL(blob);
      _currentBlobUrl = url;
      applyToDom(url);
      callReactSetter(url);
    }).catch(function () {});
  }

  /* ── MODAL ─────────────────────────────────────────────────────────────────
     Shows a beautiful glassmorphism dialog when the user wants to set a
     focus background. Replaces the native browser prompt().
  ──────────────────────────────────────────────────────────────────────────── */
  var _modalOpen = false;

  function showModal() {
    if (_modalOpen || document.getElementById('__iso_focus_modal__')) return;
    _modalOpen = true;

    // ── Backdrop ──
    var backdrop = document.createElement('div');
    backdrop.id = '__iso_focus_modal__';
    backdrop.setAttribute('style', [
      'position:fixed', 'inset:0', 'z-index:2147483645',
      'background:rgba(0,0,0,0.55)', 'backdrop-filter:blur(18px) saturate(150%)',
      '-webkit-backdrop-filter:blur(18px) saturate(150%)',
      'display:flex', 'align-items:center', 'justify-content:center',
      'opacity:0', 'transition:opacity 0.3s ease',
      'font-family:system-ui,-apple-system,sans-serif',
    ].join(';'));

    // ── Card ──
    var card = document.createElement('div');
    card.setAttribute('style', [
      'width:min(440px,92vw)', 'border-radius:20px', 'overflow:hidden',
      'background:linear-gradient(145deg,rgba(255,255,255,0.10) 0%,rgba(255,255,255,0.04) 100%)',
      'border:1px solid rgba(255,255,255,0.14)',
      'box-shadow:0 24px 60px rgba(0,0,0,0.60),0 4px 16px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.14)',
      'backdrop-filter:blur(24px)', 'transform:translateY(20px) scale(0.97)',
      'transition:transform 0.35s cubic-bezier(0.22,1,0.36,1)',
    ].join(';'));

    // ── Header ──
    var hdr = document.createElement('div');
    hdr.setAttribute('style', [
      'padding:20px 24px 16px', 'border-bottom:1px solid rgba(255,255,255,0.08)',
      'display:flex', 'align-items:center', 'justify-content:space-between',
    ].join(';'));
    hdr.innerHTML =
      '<span style="font-size:16px;font-weight:700;color:rgba(255,255,255,0.96);letter-spacing:-0.02em;">' +
        '🖼&nbsp; Focus Background' +
      '</span>' +
      '<button id="__iso_modal_close__" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);' +
        'border-radius:50%;width:26px;height:26px;cursor:pointer;color:rgba(255,255,255,0.6);font-size:14px;' +
        'display:flex;align-items:center;justify-content:center;padding:0;transition:background 0.15s;">✕</button>';

    // ── Body ──
    var body = document.createElement('div');
    body.setAttribute('style', 'padding:20px 24px;display:flex;flex-direction:column;gap:14px;');

    // Section: Import from storage (file picker)
    var secFile = document.createElement('div');
    secFile.innerHTML =
      '<div style="font-size:11px;font-weight:600;color:rgba(255,255,255,0.38);letter-spacing:0.06em;text-transform:uppercase;margin-bottom:8px;">Import from storage</div>';

    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*,.jpg,.jpeg,.png,.webp,.avif,.gif,.bmp,.tiff';
    fileInput.style.display = 'none';
    fileInput.id = '__iso_focus_file__';

    var fileRow = document.createElement('div');
    fileRow.setAttribute('style', 'display:flex;gap:8px;');

    var fileBtn = mkBtn('📁 Choose image file', 'rgba(249,115,22,0.18)', 'rgba(249,115,22,0.75)', true);
    fileBtn.onclick = function () { fileInput.click(); };

    var wallBtn = mkBtn('🖼 Use app wallpaper', 'rgba(99,102,241,0.15)', 'rgba(99,102,241,0.7)', false);
    wallBtn.onclick = function () {
      idbGet('custom').then(function (blob) {
        if (!blob || (blob.type && blob.type.startsWith('video/'))) {
          toast('No image wallpaper set. Set one via the ◈ wallpaper button first.', 'error');
          return;
        }
        persistBlob('focus_custom', blob);
        var url = URL.createObjectURL(blob);
        closeModal();
        queueAndApply(url);
        toast('Wallpaper applied as focus background!');
      }).catch(function () { toast('Could not load wallpaper.', 'error'); });
    };

    fileInput.onchange = function () {
      var file = fileInput.files && fileInput.files[0];
      if (!file) return;
      persistFile(file);
      var url = URL.createObjectURL(file);
      closeModal();
      queueAndApply(url);
      toast('Focus background updated!');
    };

    fileRow.appendChild(fileBtn);
    fileRow.appendChild(wallBtn);
    secFile.appendChild(fileInput);
    secFile.appendChild(fileRow);

    // Divider
    var div = document.createElement('div');
    div.setAttribute('style', [
      'display:flex', 'align-items:center', 'gap:10px',
      'color:rgba(255,255,255,0.22)', 'font-size:11px',
    ].join(';'));
    div.innerHTML =
      '<div style="flex:1;height:1px;background:rgba(255,255,255,0.08);"></div>' +
      'or enter URL' +
      '<div style="flex:1;height:1px;background:rgba(255,255,255,0.08);"></div>';

    // Section: URL input
    var secUrl = document.createElement('div');
    secUrl.innerHTML =
      '<div style="font-size:11px;font-weight:600;color:rgba(255,255,255,0.38);letter-spacing:0.06em;text-transform:uppercase;margin-bottom:8px;">Image URL</div>';

    var urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.placeholder = 'https://example.com/image.jpg  (http, https, data: accepted)';
    urlInput.setAttribute('style', [
      'width:100%', 'box-sizing:border-box', 'padding:10px 14px', 'border-radius:10px',
      'background:rgba(255,255,255,0.07)', 'border:1px solid rgba(255,255,255,0.14)',
      'color:rgba(255,255,255,0.92)', 'font-size:13.5px', 'outline:none',
      'transition:border-color 0.2s',
    ].join(';'));
    urlInput.onfocus = function () { urlInput.style.borderColor = 'rgba(249,115,22,0.5)'; };
    urlInput.onblur  = function () { urlInput.style.borderColor = 'rgba(255,255,255,0.14)'; };
    urlInput.onkeydown = function (e) { if (e.key === 'Enter') applyUrlInput(); };
    secUrl.appendChild(urlInput);

    // Confirm button
    var applyBtn = mkBtn('Apply Background', 'rgba(249,115,22,1)', '#fff', true);
    applyBtn.style.cssText += ';width:100%;justify-content:center;padding:12px 0;font-size:14px;margin-top:4px;';
    applyBtn.onclick = applyUrlInput;

    // Clear button
    var clearBtn = document.createElement('button');
    clearBtn.textContent = 'Remove current background';
    clearBtn.setAttribute('style', [
      'background:none', 'border:none', 'color:rgba(255,255,255,0.30)', 'font-size:12px',
      'cursor:pointer', 'text-align:center', 'padding:4px 0', 'transition:color 0.15s',
    ].join(';'));
    clearBtn.onmouseenter = function () { clearBtn.style.color = 'rgba(255,255,255,0.6)'; };
    clearBtn.onmouseleave = function () { clearBtn.style.color = 'rgba(255,255,255,0.30)'; };
    clearBtn.onclick = function () {
      if (_currentBlobUrl) { URL.revokeObjectURL(_currentBlobUrl); _currentBlobUrl = null; }
      if (_styleObs) { _styleObs.disconnect(); _styleObs = null; }
      idbPut('focus_custom', null).catch(function () {});
      var el = findFocusBgEl();
      if (el) el.style.backgroundImage = '';
      callReactSetter(null);
      // Queue null to clear via the React component's path
      if (_triggerBtn) { window.__isoBgQueued = null; try { _triggerBtn.click(); } catch (_) {} }
      closeModal();
      toast('Focus background cleared.');
    };

    body.appendChild(secFile);
    body.appendChild(div);
    body.appendChild(secUrl);
    body.appendChild(applyBtn);
    body.appendChild(clearBtn);

    card.appendChild(hdr);
    card.appendChild(body);
    backdrop.appendChild(card);
    document.body.appendChild(backdrop);

    // Animate in
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        backdrop.style.opacity = '1';
        card.style.transform = 'translateY(0) scale(1)';
      });
    });

    // Close handlers
    document.getElementById('__iso_modal_close__').onclick = closeModal;
    backdrop.onclick = function (e) { if (e.target === backdrop) closeModal(); };
    document.addEventListener('keydown', escClose);

    // Auto-focus URL input
    setTimeout(function () { try { urlInput.focus(); } catch (_) {} }, 300);

    function applyUrlInput() {
      var url = urlInput.value.trim();
      if (!url) { toast('Please enter an image URL.', 'error'); return; }
      if (!/^(https?:|blob:|data:)/i.test(url)) {
        toast('URL must start with http://, https://, blob:, or data:', 'error');
        return;
      }
      closeModal();
      queueAndApply(url);
      toast('Focus background applied!');
    }
  }

  function closeModal() {
    _modalOpen = false;
    var m = document.getElementById('__iso_focus_modal__');
    if (!m) return;
    m.style.opacity = '0';
    setTimeout(function () { if (m.parentNode) m.remove(); }, 350);
    document.removeEventListener('keydown', escClose);
  }

  function escClose(e) {
    if (e.key === 'Escape') closeModal();
  }

  /* ── Button factory ─────────────────────────────────────────────────────── */
  function mkBtn(label, bg, color, fill) {
    var b = document.createElement('button');
    b.textContent = label;
    b.setAttribute('style', [
      'display:inline-flex', 'align-items:center', 'gap:6px',
      'padding:9px 14px', 'border-radius:10px', 'font-size:13px', 'font-weight:600',
      'background:' + bg, 'color:' + color,
      'border:1px solid ' + (fill ? 'transparent' : 'rgba(255,255,255,0.14)'),
      'cursor:pointer', 'transition:all 0.15s', 'white-space:nowrap',
    ].join(';'));
    b.onmouseenter = function () { b.style.opacity = '0.85'; b.style.transform = 'translateY(-1px)'; };
    b.onmouseleave = function () { b.style.opacity = '1';    b.style.transform = 'translateY(0)'; };
    return b;
  }

  /* ── Floating trigger button injected into the Focus tab ─────────────────── */
  var _floatInjected = false;

  function injectFloatingBtn() {
    if (_floatInjected || document.getElementById('__iso_focus_float__')) return;
    _floatInjected = true;

    var btn = document.createElement('button');
    btn.id = '__iso_focus_float__';
    btn.title = 'Set focus background (Import from storage or URL)';
    btn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
        '<rect x="3" y="3" width="18" height="18" rx="2"/>' +
        '<circle cx="8.5" cy="8.5" r="1.5"/>' +
        '<polyline points="21 15 16 10 5 21"/>' +
      '</svg>' +
      '<span style="font-size:12px;font-weight:600;letter-spacing:-0.01em;">Set Background</span>';
    btn.setAttribute('style', [
      'position:fixed', 'bottom:76px', 'right:16px', 'z-index:2147483640',
      'display:flex', 'align-items:center', 'gap:7px', 'padding:8px 14px',
      'border-radius:999px',
      'background:linear-gradient(135deg,rgba(249,115,22,0.22) 0%,rgba(249,115,22,0.14) 100%)',
      'border:1px solid rgba(249,115,22,0.35)', 'color:rgba(249,115,22,0.9)',
      'cursor:pointer', 'font-family:system-ui,sans-serif',
      'box-shadow:0 4px 16px rgba(0,0,0,0.40)',
      'backdrop-filter:blur(10px)', 'transition:all 0.2s',
    ].join(';'));
    btn.onmouseenter = function () {
      btn.style.background = 'linear-gradient(135deg,rgba(249,115,22,0.38) 0%,rgba(249,115,22,0.25) 100%)';
      btn.style.transform = 'translateY(-2px)';
      btn.style.boxShadow = '0 8px 24px rgba(249,115,22,0.3)';
    };
    btn.onmouseleave = function () {
      btn.style.background = 'linear-gradient(135deg,rgba(249,115,22,0.22) 0%,rgba(249,115,22,0.14) 100%)';
      btn.style.transform = 'translateY(0)';
      btn.style.boxShadow = '0 4px 16px rgba(0,0,0,0.40)';
    };
    btn.onclick = function () {
      _triggerBtn = btn;  // cache so queueAndApply can re-click
      showModal();
    };

    document.body.appendChild(btn);
  }

  /* ── Route watcher ───────────────────────────────────────────────────────── */
  function isOnFocus() {
    return window.location.pathname.includes('/focus') ||
           window.location.hash.includes('focus');
  }

  function onRouteChange() {
    if (isOnFocus()) {
      setTimeout(injectFloatingBtn, 800);
      // Reapply saved background when navigating TO focus
      if (_currentBlobUrl) {
        var attempts = 0;
        (function retry() {
          if (!applyToDom(_currentBlobUrl)) {
            if (++attempts < 20) return setTimeout(retry, 300);
          }
          callReactSetter(_currentBlobUrl);
        })();
      }
    } else {
      // Hide button when not on focus route
      var b = document.getElementById('__iso_focus_float__');
      if (b) { b.remove(); _floatInjected = false; }
    }
  }

  /* ── History patching ────────────────────────────────────────────────────── */
  ['pushState', 'replaceState'].forEach(function (method) {
    var orig = history[method];
    history[method] = function () {
      orig.apply(history, arguments);
      setTimeout(onRouteChange, 150);
    };
  });
  window.addEventListener('popstate', function () { setTimeout(onRouteChange, 150); });

  /* ── DOM watcher — inject button when focus bg element appears ───────────── */
  var _domObs = new MutationObserver(function () {
    if (isOnFocus()) {
      injectFloatingBtn();
      // Reapply background if it got wiped by a re-render
      if (_currentBlobUrl) {
        var el = findFocusBgEl();
        if (el && !el.style.backgroundImage) {
          applyToDom(_currentBlobUrl);
          callReactSetter(_currentBlobUrl);
        }
      }
    }
  });
  _domObs.observe(document.body, { childList: true, subtree: false });

  /* ── Periodic re-apply (belt-and-suspenders) ─────────────────────────────── */
  setInterval(function () {
    if (!_currentBlobUrl || !isOnFocus()) return;
    var el = findFocusBgEl();
    if (el && !el.style.backgroundImage) {
      applyToDom(_currentBlobUrl);
      callReactSetter(_currentBlobUrl);
    }
  }, 1500);

  /* ── Init ─────────────────────────────────────────────────────────────────── */
  function init() {
    // Load previously saved focus background
    loadSavedBackground();
    // Inject button if already on focus route
    if (isOnFocus()) setTimeout(injectFloatingBtn, 800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
