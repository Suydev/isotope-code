/**
 * IsotopeAI — Focus Background Import v1.0
 *
 * Injects a floating button in the TOP-RIGHT corner of the Focus tab.
 * Opens a modal with two tabs:
 *   📷 Gallery  — pick any image from device
 *   🎬 Video    — pick an MP4/WebM video
 * Also supports entering a URL directly.
 * Background persists in IndexedDB across page reloads.
 */
(function () {
  'use strict';

  /* ── IndexedDB ─────────────────────────────────────────────────────────── */
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
  function idbPut(key, val) {
    return openIdb().then(function (db) {
      return new Promise(function (res, rej) {
        var tx = db.transaction(IDB_STORE, 'readwrite');
        tx.objectStore(IDB_STORE).put(val, key);
        tx.oncomplete = res; tx.onerror = rej;
      });
    });
  }
  function idbGet(key) {
    return openIdb().then(function (db) {
      return new Promise(function (res) {
        var tx  = db.transaction(IDB_STORE, 'readonly');
        var req = tx.objectStore(IDB_STORE).get(key);
        req.onsuccess = function () { res(req.result || null); };
        req.onerror   = function () { res(null); };
      });
    });
  }

  /* ── State ─────────────────────────────────────────────────────────────── */
  var _blob     = null; // current active blob URL
  var _styleObs = null;

  /* ── Toast ─────────────────────────────────────────────────────────────── */
  function toast(msg, type) {
    var t = document.createElement('div');
    t.textContent = msg;
    t.setAttribute('style', [
      'position:fixed', 'bottom:88px', 'left:50%',
      'transform:translateX(-50%) translateY(8px)',
      'background:' + (type === 'error' ? 'rgba(239,68,68,0.92)' : 'rgba(9,9,11,0.92)'),
      'color:#fff', 'padding:10px 20px', 'border-radius:12px',
      'font-size:13px', 'z-index:2147483646',
      'border:1px solid rgba(255,255,255,0.10)',
      'backdrop-filter:blur(10px)',
      'transition:opacity 0.3s,transform 0.3s',
      'pointer-events:none',
      'font-family:system-ui,sans-serif', 'font-weight:500',
    ].join(';'));
    document.body.appendChild(t);
    requestAnimationFrame(function () {
      t.style.opacity = '1'; t.style.transform = 'translateX(-50%) translateY(0)';
    });
    setTimeout(function () { t.style.opacity = '0'; }, 2400);
    setTimeout(function () { if (t.parentNode) t.remove(); }, 2800);
  }

  /* ── Apply background to Focus element ─────────────────────────────────── */
  function findFocusBgEl() {
    var candidates = document.querySelectorAll(
      '.fixed.inset-0.z-0.pointer-events-none, [class*="fixed"][class*="inset-0"][class*="z-0"]'
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

  function applyVideoToDom(url) {
    var vid = document.getElementById('__iso_focus_vid__');
    if (!vid) {
      vid = document.createElement('video');
      vid.id = '__iso_focus_vid__';
      vid.setAttribute('autoplay', '');
      vid.setAttribute('loop', '');
      vid.setAttribute('muted', '');
      vid.setAttribute('playsinline', '');
      vid.style.cssText = [
        'position:fixed', 'inset:0', 'width:100vw', 'height:100vh',
        'object-fit:cover', 'z-index:0', 'pointer-events:none',
      ].join(';');
      document.body.insertBefore(vid, document.body.firstChild);
    }
    vid.src = url;
    vid.load();
    var p = vid.play();
    if (p && p.catch) p.catch(function () {});
    vid.style.display = 'block';
  }

  function applyBackground(url, isVideo) {
    if (_blob) URL.revokeObjectURL(_blob);
    _blob = url;
    if (isVideo) {
      applyVideoToDom(url);
    } else {
      var attempts = 0;
      (function retry() {
        if (!applyToDom(url) && ++attempts < 20) setTimeout(retry, 250);
      })();
    }
  }

  /* ── Load saved background ──────────────────────────────────────────────── */
  function loadSaved() {
    idbGet('focus_custom').then(function (blob) {
      if (!blob) return;
      var url = URL.createObjectURL(blob);
      _blob = url;
      var isVid = blob.type && blob.type.startsWith('video/');
      applyBackground(url, isVid);
    }).catch(function () {});
  }

  /* ── MODAL ──────────────────────────────────────────────────────────────── */
  var _modalOpen = false;
  var _activeTab = 'image'; // 'image' | 'video'

  function showModal() {
    if (_modalOpen || document.getElementById('__iso_fbg_modal__')) return;
    _modalOpen = true;

    /* Backdrop */
    var backdrop = document.createElement('div');
    backdrop.id = '__iso_fbg_modal__';
    backdrop.setAttribute('style', [
      'position:fixed', 'inset:0', 'z-index:2147483644',
      'background:rgba(0,0,0,0.6)', 'backdrop-filter:blur(18px)',
      'display:flex', 'align-items:center', 'justify-content:center',
      'opacity:0', 'transition:opacity 0.3s',
      'font-family:system-ui,-apple-system,sans-serif',
    ].join(';'));

    /* Card */
    var card = document.createElement('div');
    card.setAttribute('style', [
      'width:min(460px,94vw)', 'border-radius:20px', 'overflow:hidden',
      'background:linear-gradient(145deg,rgba(20,20,28,0.98),rgba(12,12,18,0.98))',
      'border:1px solid rgba(255,255,255,0.12)',
      'box-shadow:0 28px 70px rgba(0,0,0,0.65),inset 0 1px 0 rgba(255,255,255,0.10)',
      'transform:translateY(18px) scale(0.97)',
      'transition:transform 0.35s cubic-bezier(0.22,1,0.36,1)',
    ].join(';'));

    /* Header */
    var hdr = document.createElement('div');
    hdr.setAttribute('style', [
      'padding:18px 22px 14px', 'border-bottom:1px solid rgba(255,255,255,0.07)',
      'display:flex', 'align-items:center', 'justify-content:space-between',
    ].join(';'));
    hdr.innerHTML =
      '<span style="font-size:15px;font-weight:700;color:rgba(255,255,255,0.94);letter-spacing:-0.02em;">' +
        '🖼&nbsp; Focus Background' +
      '</span>' +
      '<button id="__iso_fbg_close__" style="background:rgba(255,255,255,0.07);' +
        'border:1px solid rgba(255,255,255,0.10);border-radius:50%;width:26px;height:26px;' +
        'cursor:pointer;color:rgba(255,255,255,0.55);font-size:13px;display:flex;' +
        'align-items:center;justify-content:center;padding:0;">✕</button>';

    /* Tabs */
    var tabBar = document.createElement('div');
    tabBar.setAttribute('style', [
      'display:flex', 'padding:12px 22px 0',
      'gap:6px', 'border-bottom:1px solid rgba(255,255,255,0.07)',
    ].join(';'));

    function mkTab(id, label, icon) {
      var t = document.createElement('button');
      t.id = '__iso_tab_' + id + '__';
      t.innerHTML = icon + ' ' + label;
      t.setAttribute('style', [
        'padding:8px 16px', 'border-radius:10px 10px 0 0',
        'font-size:13px', 'font-weight:600', 'cursor:pointer',
        'border:1px solid transparent', 'border-bottom:none',
        'transition:all 0.15s', 'margin-bottom:-1px',
        'background:' + (_activeTab === id ? 'rgba(249,115,22,0.18)' : 'transparent'),
        'color:' + (_activeTab === id ? 'rgba(249,115,22,1)' : 'rgba(255,255,255,0.45)'),
        'border-color:' + (_activeTab === id ? 'rgba(249,115,22,0.3)' : 'transparent'),
      ].join(';'));
      t.addEventListener('click', function () {
        _activeTab = id;
        renderTabContent();
        // Update tab styles
        ['image', 'video'].forEach(function (tid) {
          var btn = document.getElementById('__iso_tab_' + tid + '__');
          if (!btn) return;
          var active = tid === id;
          btn.style.background    = active ? 'rgba(249,115,22,0.18)' : 'transparent';
          btn.style.color         = active ? 'rgba(249,115,22,1)' : 'rgba(255,255,255,0.45)';
          btn.style.borderColor   = active ? 'rgba(249,115,22,0.3)' : 'transparent';
        });
      });
      return t;
    }

    tabBar.appendChild(mkTab('image', 'Gallery Image', '📷'));
    tabBar.appendChild(mkTab('video', 'Video',         '🎬'));

    /* Body */
    var body = document.createElement('div');
    body.id = '__iso_fbg_body__';
    body.setAttribute('style', 'padding:20px 22px;');

    /* Hidden file inputs */
    var imgInput = document.createElement('input');
    imgInput.type   = 'file';
    imgInput.accept = 'image/*,.jpg,.jpeg,.png,.webp,.avif,.gif,.bmp';
    imgInput.style.display = 'none';
    imgInput.id = '__iso_img_pick__';

    var vidInput = document.createElement('input');
    vidInput.type   = 'file';
    vidInput.accept = 'video/*,.mp4,.webm,.mov,.mkv';
    vidInput.style.display = 'none';
    vidInput.id = '__iso_vid_pick__';

    imgInput.onchange = function () {
      var file = imgInput.files && imgInput.files[0];
      if (!file) return;
      idbPut('focus_custom', file).catch(function () {});
      var url = URL.createObjectURL(file);
      closeModal();
      applyBackground(url, false);
      toast('🖼 Background applied!');
    };

    vidInput.onchange = function () {
      var file = vidInput.files && vidInput.files[0];
      if (!file) return;
      idbPut('focus_custom', file).catch(function () {});
      var url = URL.createObjectURL(file);
      closeModal();
      applyBackground(url, true);
      toast('🎬 Video background applied!');
    };

    /* URL input */
    var urlInput = document.createElement('input');
    urlInput.type        = 'text';
    urlInput.placeholder = 'https://example.com/wallpaper.jpg';
    urlInput.setAttribute('style', [
      'width:100%', 'box-sizing:border-box', 'padding:10px 13px',
      'border-radius:10px', 'background:rgba(255,255,255,0.06)',
      'border:1px solid rgba(255,255,255,0.12)', 'color:rgba(255,255,255,0.9)',
      'font-size:13px', 'outline:none', 'transition:border-color 0.2s',
      'margin-top:14px',
    ].join(';'));
    urlInput.id = '__iso_url_input__';
    urlInput.onfocus = function () { urlInput.style.borderColor = 'rgba(249,115,22,0.5)'; };
    urlInput.onblur  = function () { urlInput.style.borderColor = 'rgba(255,255,255,0.12)'; };

    function applyUrl() {
      var url = urlInput.value.trim();
      if (!url) { toast('Enter a URL first', 'error'); return; }
      if (!/^https?:/i.test(url)) { toast('Must start with http:// or https://', 'error'); return; }
      closeModal();
      applyBackground(url, false);
      toast('Background applied!');
    }
    urlInput.onkeydown = function (e) { if (e.key === 'Enter') applyUrl(); };

    /* Render tab body */
    function renderTabContent() {
      var b = document.getElementById('__iso_fbg_body__');
      if (!b) return;
      b.innerHTML = '';

      if (_activeTab === 'image') {
        var importBtn = mkActionBtn('📷 Choose Image from Gallery', 'rgba(249,115,22,0.85)', '#fff');
        importBtn.addEventListener('click', function () { imgInput.click(); });
        b.appendChild(importBtn);

        var sep = document.createElement('div');
        sep.innerHTML =
          '<div style="display:flex;align-items:center;gap:10px;margin:16px 0 4px;color:rgba(255,255,255,0.22);font-size:11px;">' +
          '<div style="flex:1;height:1px;background:rgba(255,255,255,0.07);"></div>or URL<div style="flex:1;height:1px;background:rgba(255,255,255,0.07);"></div></div>';
        b.appendChild(sep);

        urlInput.placeholder = 'https://example.com/wallpaper.jpg';
        b.appendChild(urlInput);

        var applyBtn = mkActionBtn('Apply URL', 'rgba(249,115,22,1)', '#fff');
        applyBtn.style.marginTop = '10px';
        applyBtn.addEventListener('click', applyUrl);
        b.appendChild(applyBtn);

      } else {
        var vidBtn = mkActionBtn('🎬 Choose Video from Device', 'rgba(99,102,241,0.85)', '#fff');
        vidBtn.addEventListener('click', function () { vidInput.click(); });
        b.appendChild(vidBtn);

        var note = document.createElement('p');
        note.textContent = 'Supported: MP4, WebM, MOV. The video will loop silently as your focus background.';
        note.style.cssText = 'color:rgba(255,255,255,0.35);font-size:11.5px;margin:12px 0 0;line-height:1.5;';
        b.appendChild(note);

        var sep2 = document.createElement('div');
        sep2.innerHTML =
          '<div style="display:flex;align-items:center;gap:10px;margin:16px 0 4px;color:rgba(255,255,255,0.22);font-size:11px;">' +
          '<div style="flex:1;height:1px;background:rgba(255,255,255,0.07);"></div>or URL<div style="flex:1;height:1px;background:rgba(255,255,255,0.07);"></div></div>';
        b.appendChild(sep2);

        urlInput.placeholder = 'https://example.com/loop.mp4';
        b.appendChild(urlInput);

        var vidApply = mkActionBtn('Apply Video URL', 'rgba(99,102,241,1)', '#fff');
        vidApply.style.marginTop = '10px';
        vidApply.addEventListener('click', function () {
          var url = urlInput.value.trim();
          if (!url) { toast('Enter a video URL', 'error'); return; }
          closeModal();
          applyBackground(url, true);
          toast('🎬 Video background applied!');
        });
        b.appendChild(vidApply);
      }

      /* Clear button */
      var clearBtn = document.createElement('button');
      clearBtn.textContent = 'Remove current background';
      clearBtn.setAttribute('style', [
        'display:block', 'width:100%', 'margin-top:16px',
        'background:none', 'border:none',
        'color:rgba(255,255,255,0.27)', 'font-size:12px',
        'cursor:pointer', 'text-align:center', 'padding:4px 0',
        'transition:color 0.15s',
      ].join(';'));
      clearBtn.onmouseenter = function () { clearBtn.style.color = 'rgba(255,255,255,0.55)'; };
      clearBtn.onmouseleave = function () { clearBtn.style.color = 'rgba(255,255,255,0.27)'; };
      clearBtn.addEventListener('click', function () {
        if (_blob) { URL.revokeObjectURL(_blob); _blob = null; }
        if (_styleObs) { _styleObs.disconnect(); _styleObs = null; }
        idbPut('focus_custom', null).catch(function () {});
        var el = findFocusBgEl();
        if (el) el.style.backgroundImage = '';
        var vid = document.getElementById('__iso_focus_vid__');
        if (vid) { vid.pause(); vid.style.display = 'none'; vid.src = ''; }
        closeModal();
        toast('Background cleared.');
      });
      b.appendChild(clearBtn);
    }

    renderTabContent();
    card.appendChild(hdr);
    card.appendChild(tabBar);
    card.appendChild(imgInput);
    card.appendChild(vidInput);
    card.appendChild(body);
    backdrop.appendChild(card);
    document.body.appendChild(backdrop);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        backdrop.style.opacity = '1';
        card.style.transform   = 'translateY(0) scale(1)';
      });
    });

    document.getElementById('__iso_fbg_close__').onclick = closeModal;
    backdrop.onclick = function (e) { if (e.target === backdrop) closeModal(); };
    document.addEventListener('keydown', escClose);
  }

  function closeModal() {
    _modalOpen = false;
    var m = document.getElementById('__iso_fbg_modal__');
    if (!m) return;
    m.style.opacity = '0';
    setTimeout(function () { if (m.parentNode) m.remove(); }, 320);
    document.removeEventListener('keydown', escClose);
  }

  function escClose(e) { if (e.key === 'Escape') closeModal(); }

  function mkActionBtn(label, bg, color) {
    var b = document.createElement('button');
    b.textContent = label;
    b.setAttribute('style', [
      'display:flex', 'align-items:center', 'justify-content:center',
      'width:100%', 'padding:12px 18px', 'border-radius:12px',
      'font-size:14px', 'font-weight:600', 'cursor:pointer',
      'background:' + bg, 'color:' + color, 'border:none',
      'box-shadow:0 4px 16px rgba(0,0,0,0.3)',
      'transition:opacity 0.15s,transform 0.15s',
    ].join(';'));
    b.onmouseenter = function () { b.style.opacity = '0.88'; b.style.transform = 'translateY(-1px)'; };
    b.onmouseleave = function () { b.style.opacity = '1';    b.style.transform = 'translateY(0)'; };
    return b;
  }

  /* ── Floating trigger button (top-right corner) ──────────────────────── */
  var _btnInjected = false;

  function injectBtn() {
    if (_btnInjected || document.getElementById('__iso_fbg_btn__')) return;
    _btnInjected = true;

    var btn = document.createElement('button');
    btn.id = '__iso_fbg_btn__';
    btn.title = 'Set Focus Background';
    btn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" ' +
        'stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">' +
        '<rect x="3" y="3" width="18" height="18" rx="2"/>' +
        '<circle cx="8.5" cy="8.5" r="1.5"/>' +
        '<polyline points="21 15 16 10 5 21"/>' +
      '</svg>' +
      '<span style="font-size:12px;font-weight:600;">Background</span>';
    btn.setAttribute('style', [
      'position:fixed',
      'top:14px',      // top-right, below any nav bar
      'right:16px',
      'z-index:2147483640',
      'display:flex', 'align-items:center', 'gap:6px',
      'padding:7px 13px', 'border-radius:999px',
      'background:rgba(9,9,11,0.75)',
      'border:1px solid rgba(249,115,22,0.4)',
      'color:rgba(249,115,22,0.95)',
      'cursor:pointer', 'backdrop-filter:blur(12px)',
      'box-shadow:0 4px 16px rgba(0,0,0,0.45)',
      'transition:all 0.2s',
    ].join(';'));
    btn.onmouseenter = function () {
      btn.style.background    = 'rgba(249,115,22,0.20)';
      btn.style.borderColor   = 'rgba(249,115,22,0.7)';
      btn.style.transform     = 'translateY(-1px)';
    };
    btn.onmouseleave = function () {
      btn.style.background    = 'rgba(9,9,11,0.75)';
      btn.style.borderColor   = 'rgba(249,115,22,0.4)';
      btn.style.transform     = 'translateY(0)';
    };
    btn.onclick = showModal;
    document.body.appendChild(btn);
  }

  function removeBtn() {
    var b = document.getElementById('__iso_fbg_btn__');
    if (b) { b.remove(); _btnInjected = false; }
  }

  /* ── Route watcher ──────────────────────────────────────────────────── */
  function isOnFocus() {
    return /\/focus(\b|$)/i.test(window.location.pathname);
  }

  function onRoute() {
    if (isOnFocus()) {
      setTimeout(injectBtn, 600);
      if (_blob) {
        var a = 0;
        (function retry() {
          if (!applyToDom(_blob) && ++a < 20) setTimeout(retry, 300);
        })();
      }
    } else {
      removeBtn();
    }
  }

  ['pushState', 'replaceState'].forEach(function (m) {
    var orig = history[m];
    history[m] = function () { orig.apply(history, arguments); setTimeout(onRoute, 120); };
  });
  window.addEventListener('popstate', function () { setTimeout(onRoute, 120); });

  /* ── DOM observer ────────────────────────────────────────────────────── */
  new MutationObserver(function () {
    if (isOnFocus()) {
      injectBtn();
      if (_blob) {
        var el = findFocusBgEl();
        if (el && !el.style.backgroundImage) applyToDom(_blob);
      }
    }
  }).observe(document.body, { childList: true, subtree: false });

  /* ── Init ────────────────────────────────────────────────────────────── */
  function init() {
    loadSaved();
    if (isOnFocus()) setTimeout(injectBtn, 700);
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); }
  else { init(); }

})();
