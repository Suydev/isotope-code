/**
 * IsotopeAI — Background Manager
 *
 * Z-index layout (position:fixed):
 *   0 — dark base         (#__bg_dark__)
 *   1 — video layer       (#isotope-bg-video)
 *   2 — gradient/image    (#isotope-bg-image)
 *   3 — dim overlay       (#__isotope_dim__ — glass-settings.js)
 *   4 — React app root    (#root)
 *
 * Exposes window.__bgManager__ = { apply(opts), currentId(), onChange(fn) }
 */
(function () {
  'use strict';

  var LS_KEY = 'isotope_bg_settings';

  // ── IndexedDB helpers ─────────────────────────────────────────────────────────
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
  function idbSave(key, val) {
    return openIdb().then(function (db) {
      return new Promise(function (res, rej) {
        var tx = db.transaction(IDB_STORE, 'readwrite');
        tx.objectStore(IDB_STORE).put(val, key);
        tx.oncomplete = res; tx.onerror = rej;
      });
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

  // ── Settings helpers ──────────────────────────────────────────────────────────
  function loadSettings() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); }
    catch (e) { return {}; }
  }
  function saveSettings(s) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch (e) {}
  }

  // ── DOM layer references ──────────────────────────────────────────────────────
  var darkDiv  = null;
  var videoEl  = null;
  var imageEl  = null;
  var _customBlobUrl = null;
  var _listeners = [];

  function ensureDarkDiv() {
    if (darkDiv) return;
    darkDiv = document.createElement('div');
    darkDiv.id = '__bg_dark__';
    darkDiv.style.cssText = 'position:fixed;inset:0;z-index:0;background:#09090b;pointer-events:none;';
    document.body.insertBefore(darkDiv, document.body.firstChild);
  }

  function ensureVideoEl() {
    if (videoEl) return;
    videoEl = document.createElement('video');
    videoEl.id = 'isotope-bg-video';
    videoEl.setAttribute('autoplay', '');
    videoEl.setAttribute('loop', '');
    videoEl.setAttribute('muted', '');
    videoEl.setAttribute('playsinline', '');
    videoEl.setAttribute('aria-hidden', 'true');
    videoEl.style.cssText = [
      'position:fixed', 'inset:0', 'width:100vw', 'height:100vh',
      'object-fit:cover', 'z-index:1', 'pointer-events:none',
      'opacity:0', 'transition:opacity 1.4s cubic-bezier(0.22,1,0.36,1)', 'display:none',
    ].join(';');
    document.body.insertBefore(videoEl, document.body.firstChild);
  }

  function ensureImageEl() {
    if (imageEl) return;
    imageEl = document.createElement('div');
    imageEl.id = 'isotope-bg-image';
    imageEl.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:2', 'pointer-events:none',
      'opacity:0', 'transition:opacity 1.2s ease',
      'background-size:cover', 'background-position:center',
      'background-repeat:no-repeat', 'display:none',
    ].join(';');
    document.body.insertBefore(imageEl, document.body.firstChild);
  }

  function ensureLayers() {
    ensureDarkDiv(); ensureVideoEl(); ensureImageEl();
  }

  // ── Core apply ────────────────────────────────────────────────────────────────
  function applyOpts(opts) {
    ensureLayers();
    var id   = opts.id   || opts.type || 'video';
    var type = opts.type || id;

    // Hide all media layers
    videoEl.style.display = 'none'; videoEl.style.opacity = '0';
    imageEl.style.display = 'none'; imageEl.style.opacity = '0';

    if (type === 'video') {
      var src = opts.videoSrc || '/bg.mp4';
      videoEl.style.display = 'block';
      if (videoEl.getAttribute('data-src') !== src) {
        videoEl.setAttribute('data-src', src);
        videoEl.src = src;
        videoEl.load();
      }
      var p = videoEl.play();
      if (p && p.catch) p.catch(function () {});
      setTimeout(function () { videoEl.style.opacity = '1'; }, 200);
      saveSettings({ type: 'video' });

    } else if (type === 'gradient') {
      imageEl.style.background = opts.gradientCss || '#09090b';
      imageEl.style.display = 'block';
      setTimeout(function () { imageEl.style.opacity = '1'; }, 80);
      saveSettings({ type: type, gradientCss: opts.gradientCss, id: id });

    } else if (type === 'image') {
      if (opts.blobUrl) {
        imageEl.style.background = 'url(' + opts.blobUrl + ') center/cover no-repeat';
        imageEl.style.display = 'block';
        setTimeout(function () { imageEl.style.opacity = '1'; }, 80);
      }
      if (opts.blob) {
        idbSave('custom', opts.blob).catch(function () {});
      }
      saveSettings({ type: 'image' });

    } else if (type === 'video-custom') {
      // uploaded video
      videoEl.style.display = 'block';
      var vsrc = opts.blobUrl;
      videoEl.setAttribute('data-src', vsrc);
      videoEl.src = vsrc;
      videoEl.load();
      var pp = videoEl.play();
      if (pp && pp.catch) pp.catch(function () {});
      setTimeout(function () { videoEl.style.opacity = '1'; }, 200);
      if (opts.blob) idbSave('custom', opts.blob).catch(function () {});
      saveSettings({ type: 'video-custom' });

    } else if (type === 'dark') {
      saveSettings({ type: 'dark' });
    }

    _listeners.forEach(function (fn) { try { fn(id); } catch (e) {} });
  }

  // ── Autoplay unlock ───────────────────────────────────────────────────────────
  function addAutoplayUnlock() {
    var unlocked = false;
    function unlock() {
      if (unlocked) return; unlocked = true;
      if (videoEl && videoEl.paused) {
        var p = videoEl.play();
        if (p && p.then) p.then(function () { videoEl.style.opacity = '1'; }).catch(function () {});
      }
    }
    ['click', 'touchstart', 'keydown'].forEach(function (ev) {
      document.addEventListener(ev, unlock, { once: true, passive: true });
    });
  }

  // ── Restore from storage ──────────────────────────────────────────────────────
  function restore() {
    var s = loadSettings();
    var t = s.type || 'video';

    if (t === 'image' || t === 'video-custom') {
      idbLoad('custom').then(function (blob) {
        if (!blob) { applyOpts({ type: 'video' }); return; }
        if (_customBlobUrl) URL.revokeObjectURL(_customBlobUrl);
        _customBlobUrl = URL.createObjectURL(blob);
        var isVid = blob.type && blob.type.startsWith('video/');
        applyOpts({ type: isVid ? 'video-custom' : 'image', blobUrl: _customBlobUrl });
      }).catch(function () { applyOpts({ type: 'video' }); });
    } else if (t === 'gradient') {
      applyOpts({ type: 'gradient', gradientCss: s.gradientCss || '#09090b', id: s.id || 'space' });
    } else if (t === 'dark') {
      applyOpts({ type: 'dark' });
    } else {
      applyOpts({ type: 'video' });
    }
  }

  // ── Public API ────────────────────────────────────────────────────────────────
  window.__bgManager__ = {
    apply: function (opts) {
      applyOpts(opts);
      // If caller passes a file for custom, store it
      if (opts.file) {
        var url = URL.createObjectURL(opts.file);
        if (_customBlobUrl) URL.revokeObjectURL(_customBlobUrl);
        _customBlobUrl = url;
        var isVid = opts.file.type && opts.file.type.startsWith('video/');
        applyOpts({ type: isVid ? 'video-custom' : 'image', blobUrl: url, blob: opts.file });
      }
    },
    currentId: function () {
      var s = loadSettings();
      return s.id || s.type || 'video';
    },
    customBlobUrl: function () { return _customBlobUrl; },
    onChange: function (fn) { _listeners.push(fn); },
  };

  // ── Init ──────────────────────────────────────────────────────────────────────
  function init() {
    ensureLayers();
    restore();
    addAutoplayUnlock();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
