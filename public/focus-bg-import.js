/**
 * IsotopeAI Focus Background Import
 *
 * Adds image/video import to the existing Focus toolbar instead of placing a
 * separate fixed button over the app header. Custom media is stored in
 * IndexedDB; URL images are also written through the native Focus background
 * settings module when available. Blur follows Settings > Focus Background.
 */
(function () {
  'use strict';

  var IDB_NAME = 'isotope_bg_custom';
  var IDB_STORE = 'media';
  var CUSTOM_KEY = 'focus_custom';
  var FOCUS_BG_MODULE = '/assets/focusBackground-t8AknbRg.js';
  var MAX_VIDEO_SECONDS = 60;

  var _activeUrl = null;
  var _activeKind = 'image';
  var _objectUrl = null;
  var _styleObs = null;
  var _focusBgApiPromise = null;
  var _routeTimer = null;
  var _modalOpen = false;
  var _activeTab = 'image';
  var _lastAppliedBlur = 0;
  var _renderedUrl = null;
  var _renderedKind = null;
  var _renderedTarget = null;

  function openIdb() {
    return new Promise(function (resolve, reject) {
      var req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = function () {
        if (!req.result.objectStoreNames.contains(IDB_STORE)) req.result.createObjectStore(IDB_STORE);
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
  }

  function idbPut(key, value) {
    return openIdb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(IDB_STORE, 'readwrite');
        tx.objectStore(IDB_STORE).put(value, key);
        tx.oncomplete = resolve;
        tx.onerror = reject;
      });
    });
  }

  function idbGet(key) {
    return openIdb().then(function (db) {
      return new Promise(function (resolve) {
        var tx = db.transaction(IDB_STORE, 'readonly');
        var req = tx.objectStore(IDB_STORE).get(key);
        req.onsuccess = function () { resolve(req.result || null); };
        req.onerror = function () { resolve(null); };
      });
    });
  }

  function idbDelete(key) {
    return openIdb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(IDB_STORE, 'readwrite');
        tx.objectStore(IDB_STORE).delete(key);
        tx.oncomplete = resolve;
        tx.onerror = reject;
      });
    });
  }

  function focusBgApi() {
    if (!_focusBgApiPromise) {
      _focusBgApiPromise = import(FOCUS_BG_MODULE).catch(function () { return null; });
    }
    return _focusBgApiPromise;
  }

  function clampBlur(value) {
    var n = Number(value);
    if (!Number.isFinite(n)) return 0;
    return Math.min(24, Math.max(0, Math.round(n)));
  }

  function parseStoredValue(raw) {
    if (raw == null) return null;
    if (typeof raw !== 'string') return raw;
    try { return JSON.parse(raw); } catch (e) { return raw; }
  }

  function extractBlurValue(value) {
    if (value == null) return 0;
    if (typeof value === 'number' || typeof value === 'string') return clampBlur(value);
    if (typeof value !== 'object') return 0;
    var direct = [
      value.blurAmount,
      value.blur,
      value.value,
      value.state && value.state.blurAmount,
      value.state && value.state.blur,
      value.state && value.state.value,
    ];
    for (var i = 0; i < direct.length; i += 1) {
      var amount = clampBlur(direct[i]);
      if (amount > 0) return amount;
    }
    return 0;
  }

  function readStoredBlur() {
    var keys = ['focus-bg-blur'];
    try {
      for (var i = 0; i < localStorage.length; i += 1) {
        var key = localStorage.key(i);
        if (key && /focus-bg-blur$/i.test(key) && keys.indexOf(key) === -1) keys.push(key);
      }
      for (var j = 0; j < keys.length; j += 1) {
        var amount = extractBlurValue(parseStoredValue(localStorage.getItem(keys[j])));
        if (amount > 0) return amount;
      }
    } catch (e) {}
    return 0;
  }

  function readNativeBlur() {
    return focusBgApi().then(function (api) {
      if (api && typeof api.g === 'function') {
        return api.g().then(function (cfg) {
          if (cfg && Object.prototype.hasOwnProperty.call(cfg, 'blurAmount')) {
            return clampBlur(cfg.blurAmount);
          }
          return readStoredBlur();
        });
      }
      return readStoredBlur();
    }).catch(function () {
      return readStoredBlur();
    });
  }

  function saveNativeImageUrl(url) {
    return Promise.all([focusBgApi(), readNativeBlur()]).then(function (parts) {
      var api = parts[0];
      var blur = parts[1];
      if (api && typeof api.a === 'function') return api.a({ imageUrl: url, blurAmount: blur });
      return null;
    }).catch(function () { return null; });
  }

  function clearNativeImageUrl() {
    return focusBgApi().then(function (api) {
      if (api && typeof api.c === 'function') return api.c();
      return null;
    }).catch(function () { return null; });
  }

  function toast(message, type) {
    var t = document.createElement('div');
    t.textContent = message;
    t.setAttribute('style', [
      'position:fixed', 'bottom:88px', 'left:50%',
      'transform:translateX(-50%) translateY(8px)',
      'background:' + (type === 'error' ? 'rgba(239,68,68,0.94)' : 'rgba(9,9,11,0.92)'),
      'color:#fff', 'padding:10px 18px', 'border-radius:12px',
      'font-size:13px', 'z-index:2147483000',
      'border:1px solid rgba(255,255,255,0.12)',
      'backdrop-filter:blur(10px)',
      'transition:opacity 0.3s,transform 0.3s',
      'pointer-events:none',
      'font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
      'font-weight:600',
    ].join(';'));
    document.body.appendChild(t);
    requestAnimationFrame(function () {
      t.style.opacity = '1';
      t.style.transform = 'translateX(-50%) translateY(0)';
    });
    setTimeout(function () { t.style.opacity = '0'; }, 2400);
    setTimeout(function () { if (t.parentNode) t.remove(); }, 2850);
  }

  function isOnFocus() {
    return /\/focus(\b|$)/i.test(window.location.pathname);
  }

  function isVisible(el) {
    if (!el || !document.body.contains(el)) return false;
    var style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
    var rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function findFocusBgEl() {
    var candidates = document.querySelectorAll(
      '.fixed.inset-0.z-0.pointer-events-none, [class*="fixed"][class*="inset-0"][class*="z-0"]'
    );
    for (var i = 0; i < candidates.length; i += 1) {
      var el = candidates[i];
      if (!isVisible(el)) continue;
      if (el.id === 'isotope-bg-image' || el.id === '__bg_dark__') continue;
      if (el.id === '__iso_focus_bg_layer__' || el.id === '__iso_focus_vid__') continue;
      return el;
    }
    return null;
  }

  function cssUrl(url) {
    return 'url("' + String(url).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '")';
  }

  function isSafeImageUrl(url) {
    return /^blob:/i.test(url) || /^https?:\/\//i.test(url) || /^data:image\//i.test(url);
  }

  function isSafeVideoUrl(url) {
    return /^blob:/i.test(url) || /^https?:\/\//i.test(url) || /^data:video\//i.test(url);
  }

  function looksLikeVideoFile(fileLike) {
    var mime = String((fileLike && (fileLike.type || fileLike.mime)) || '').toLowerCase();
    var name = String((fileLike && fileLike.name) || '').toLowerCase();
    return mime.indexOf('video/') === 0 || /\.(mp4|webm|mov|m4v|mkv)$/i.test(name);
  }

  function looksLikeImageFile(fileLike) {
    var mime = String((fileLike && (fileLike.type || fileLike.mime)) || '').toLowerCase();
    var name = String((fileLike && fileLike.name) || '').toLowerCase();
    return mime.indexOf('image/') === 0 || /\.(jpg|jpeg|png|webp|avif|gif|bmp)$/i.test(name);
  }

  function mediaRecord(kind, file) {
    return {
      type: 'blob',
      kind: kind,
      blob: file,
      name: file && file.name ? file.name : '',
      mime: file && file.type ? file.type : '',
      size: file && typeof file.size === 'number' ? file.size : 0,
      savedAt: new Date().toISOString(),
    };
  }

  function readVideoDuration(url) {
    return new Promise(function (resolve, reject) {
      var video = document.createElement('video');
      var done = false;
      var timer = setTimeout(function () {
        finish(new Error('Could not read video length. Use MP4 or WebM under 60 seconds.'));
      }, 8000);
      function finish(err, duration) {
        if (done) return;
        done = true;
        clearTimeout(timer);
        video.onloadedmetadata = null;
        video.onerror = null;
        try { video.removeAttribute('src'); video.load(); } catch (e) {}
        if (err) reject(err);
        else resolve(duration);
      }
      video.preload = 'metadata';
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.onloadedmetadata = function () {
        var duration = Number(video.duration);
        if (!Number.isFinite(duration) || duration <= 0) {
          finish(new Error('Could not read video length. Use MP4 or WebM under 60 seconds.'));
          return;
        }
        finish(null, duration);
      };
      video.onerror = function () {
        finish(new Error('This video could not be opened. Use MP4 or WebM under 60 seconds.'));
      };
      video.src = url;
      try { video.load(); } catch (e) { finish(e); }
    });
  }

  function assertVideoDuration(url) {
    return readVideoDuration(url).then(function (duration) {
      if (duration > MAX_VIDEO_SECONDS + 0.25) {
        throw new Error('Video background must be 60 seconds or shorter.');
      }
      return duration;
    });
  }

  function validateVideoDurationIfReadable(url) {
    return assertVideoDuration(url).then(function (duration) {
      return { ok: true, duration: duration, unknown: false };
    }).catch(function (err) {
      var message = err && err.message ? err.message : '';
      if (/60 seconds or shorter/i.test(message)) {
        return { ok: false, message: message, unknown: false };
      }
      return { ok: true, duration: null, unknown: true, message: message };
    });
  }

  function prepareTarget(el) {
    el.style.backgroundImage = 'none';
    el.style.backgroundSize = '';
    el.style.backgroundPosition = '';
    el.style.backgroundRepeat = '';
    el.style.overflow = 'hidden';
  }

  function removeImageLayer() {
    var layer = document.getElementById('__iso_focus_bg_layer__');
    if (layer && layer.parentNode) layer.parentNode.removeChild(layer);
    if (_renderedKind === 'image') {
      _renderedUrl = null;
      _renderedKind = null;
      _renderedTarget = null;
    }
  }

  function removeVideoLayer() {
    var vid = document.getElementById('__iso_focus_vid__');
    if (vid) {
      try { vid.pause(); } catch (e) {}
      vid.removeAttribute('src');
      vid.load();
      if (vid.parentNode) vid.parentNode.removeChild(vid);
    }
    if (_renderedKind === 'video') {
      _renderedUrl = null;
      _renderedKind = null;
      _renderedTarget = null;
    }
  }

  function applyFilterToMedia(node, blur) {
    if (!node) return;
    var amount = clampBlur(blur);
    var filter = amount > 0 ? 'blur(' + amount + 'px) saturate(1.05)' : 'none';
    var scale = Math.min(1.2, 1 + amount / 120);
    node.style.filter = filter;
    node.style.webkitFilter = filter;
    node.style.transform = amount > 0 ? 'scale(' + scale.toFixed(3) + ') translateZ(0)' : 'translateZ(0)';
  }

  function refreshBlur() {
    return readNativeBlur().then(function (blur) {
      _lastAppliedBlur = clampBlur(blur);
      applyFilterToMedia(document.getElementById('__iso_focus_bg_layer__'), _lastAppliedBlur);
      applyFilterToMedia(document.getElementById('__iso_focus_vid__'), _lastAppliedBlur);
      return _lastAppliedBlur;
    });
  }

  function observeTarget(el) {
    if (_styleObs) _styleObs.disconnect();
    _styleObs = new MutationObserver(function () {
      if (!_activeUrl || !isOnFocus()) return;
      if (_activeKind === 'video') {
        if (!document.getElementById('__iso_focus_vid__')) applyVideoToDom(_activeUrl);
      } else if (!document.getElementById('__iso_focus_bg_layer__')) {
        applyToDom(_activeUrl);
      }
    });
    _styleObs.observe(el, { childList: true, attributes: true, attributeFilter: ['style'] });
  }

  function applyToDom(url) {
    if (!url || !isSafeImageUrl(url)) return false;
    var el = findFocusBgEl();
    if (!el) return false;
    prepareTarget(el);
    removeVideoLayer();

    var layer = document.getElementById('__iso_focus_bg_layer__');
    if (!layer) {
      layer = document.createElement('div');
      layer.id = '__iso_focus_bg_layer__';
      layer.setAttribute('aria-hidden', 'true');
    }
    if (layer.parentNode === el && _renderedUrl === url && _renderedKind === 'image') {
      observeTarget(el);
      refreshBlur();
      return true;
    }
    if (layer.parentNode !== el) el.appendChild(layer);
    layer.style.cssText = [
      'position:absolute', 'inset:-32px',
      'background-size:cover', 'background-position:center', 'background-repeat:no-repeat',
      'pointer-events:none', 'z-index:0',
      'will-change:filter,transform,background-image',
      'transform-origin:center',
      'background-image:' + cssUrl(url),
    ].join(';');
    layer.setAttribute('data-isotope-bg-url', url);
    _renderedUrl = url;
    _renderedKind = 'image';
    _renderedTarget = el;
    observeTarget(el);
    refreshBlur();
    return true;
  }

  function applyVideoToDom(url) {
    if (!url || !isSafeVideoUrl(url)) return false;
    var el = findFocusBgEl();
    if (!el) return false;
    prepareTarget(el);
    removeImageLayer();

    var vid = document.getElementById('__iso_focus_vid__');
    if (!vid) {
      vid = document.createElement('video');
      vid.id = '__iso_focus_vid__';
      vid.setAttribute('autoplay', '');
      vid.setAttribute('loop', '');
      vid.setAttribute('muted', '');
      vid.setAttribute('playsinline', '');
      vid.setAttribute('preload', 'metadata');
      vid.setAttribute('aria-hidden', 'true');
    }
    if (vid.parentNode === el && _renderedUrl === url && _renderedKind === 'video') {
      refreshBlur();
      var replay = vid.play();
      if (replay && replay.catch) replay.catch(function () {});
      observeTarget(el);
      return true;
    }
    if (vid.parentNode !== el) el.appendChild(vid);
    vid.style.cssText = [
      'position:absolute', 'inset:-32px',
      'width:calc(100% + 64px)', 'height:calc(100% + 64px)',
      'max-width:none', 'object-fit:cover',
      'pointer-events:none', 'z-index:0',
      'will-change:filter,transform',
      'transform-origin:center',
    ].join(';');
    if (vid.src !== url) vid.src = url;
    vid.autoplay = true;
    vid.muted = true;
    vid.defaultMuted = true;
    vid.volume = 0;
    vid.loop = true;
    vid.playsInline = true;
    vid.controls = false;
    vid.setAttribute('autoplay', '');
    vid.setAttribute('loop', '');
    vid.setAttribute('muted', '');
    vid.setAttribute('playsinline', '');
    vid.setAttribute('disableRemotePlayback', '');
    vid.setAttribute('controlsList', 'nodownload noplaybackrate noremoteplayback');
    try { vid.disablePictureInPicture = true; } catch (e) {}
    vid.onloadedmetadata = function () {
      var duration = Number(vid.duration);
      if (Number.isFinite(duration) && duration > MAX_VIDEO_SECONDS + 0.25) {
        toast('Video background must be 60 seconds or shorter.', 'error');
        clearBackground();
        return;
      }
      var playAfterMeta = vid.play();
      if (playAfterMeta && playAfterMeta.catch) playAfterMeta.catch(function () {});
    };
    vid.onerror = function () {
      toast('This video could not play. Use MP4 or WebM for best support.', 'error');
    };
    vid.load();
    var play = vid.play();
    if (play && play.catch) play.catch(function () {});
    _renderedUrl = url;
    _renderedKind = 'video';
    _renderedTarget = el;
    observeTarget(el);
    refreshBlur();
    return true;
  }

  function ensureActiveBackground() {
    if (!_activeUrl || !isOnFocus()) return;
    if (_renderedUrl === _activeUrl && _renderedKind === _activeKind && _renderedTarget && isVisible(_renderedTarget)) {
      refreshBlur();
      return;
    }
    if (_activeKind === 'video') applyVideoToDom(_activeUrl);
    else applyToDom(_activeUrl);
  }

  function applyBackground(url, isVideo, ownsObjectUrl) {
    if (_objectUrl && _objectUrl !== url) {
      try { URL.revokeObjectURL(_objectUrl); } catch (e) {}
    }
    _objectUrl = ownsObjectUrl ? url : null;
    _activeUrl = url;
    _activeKind = isVideo ? 'video' : 'image';

    var attempts = 0;
    (function retry() {
      var ok = isVideo ? applyVideoToDom(url) : applyToDom(url);
      if (!ok && ++attempts < 24) {
        setTimeout(retry, 220);
      } else if (!ok) {
        toast('Open the Focus page first, then apply the background.', 'error');
      }
    })();
  }

  function clearBackground() {
    if (_objectUrl) {
      try { URL.revokeObjectURL(_objectUrl); } catch (e) {}
    }
    _objectUrl = null;
    _activeUrl = null;
    _activeKind = 'image';
    _renderedUrl = null;
    _renderedKind = null;
    _renderedTarget = null;
    if (_styleObs) {
      _styleObs.disconnect();
      _styleObs = null;
    }
    removeImageLayer();
    removeVideoLayer();
    var el = findFocusBgEl();
    if (el) el.style.backgroundImage = '';
    idbDelete(CUSTOM_KEY).catch(function () {});
    clearNativeImageUrl();
  }

  function loadSaved() {
    idbGet(CUSTOM_KEY).then(function (saved) {
      if (!saved) return;
      if (saved && saved.type === 'blob' && saved.blob instanceof Blob) {
        var savedUrl = URL.createObjectURL(saved.blob);
        var savedIsVideo = saved.kind === 'video' || looksLikeVideoFile(saved);
        applyBackground(savedUrl, savedIsVideo, true);
        return;
      }
      if (saved instanceof Blob) {
        var blobUrl = URL.createObjectURL(saved);
        applyBackground(blobUrl, looksLikeVideoFile(saved) && !looksLikeImageFile(saved), true);
        return;
      }
      if (saved && saved.type === 'url' && saved.url) {
        applyBackground(saved.url, saved.kind === 'video', false);
      }
    }).catch(function () {});
  }

  function showModal() {
    if (_modalOpen || document.getElementById('__iso_fbg_modal__')) return;
    _modalOpen = true;

    var backdrop = document.createElement('div');
    backdrop.id = '__iso_fbg_modal__';
    backdrop.setAttribute('style', [
      'position:fixed', 'inset:0', 'z-index:2147483001',
      'background:radial-gradient(circle at 20% 10%,rgba(249,115,22,0.16),transparent 34%),radial-gradient(circle at 85% 20%,rgba(34,211,238,0.14),transparent 32%),rgba(3,7,18,0.72)',
      'backdrop-filter:blur(22px) saturate(1.2)',
      'display:flex', 'align-items:center', 'justify-content:center',
      'opacity:0', 'transition:opacity 0.25s',
      'font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
    ].join(';'));

    var card = document.createElement('div');
    card.setAttribute('style', [
      'width:min(500px,94vw)', 'border-radius:28px', 'overflow:hidden',
      'background:linear-gradient(145deg,rgba(24,24,27,0.86),rgba(9,9,11,0.94))',
      'border:1px solid rgba(255,255,255,0.16)',
      'box-shadow:0 34px 90px rgba(0,0,0,0.68),inset 0 1px 0 rgba(255,255,255,0.12)',
      'transform:translateY(16px) scale(0.98)',
      'transition:transform 0.28s cubic-bezier(0.22,1,0.36,1)',
    ].join(';'));

    var hdr = document.createElement('div');
    hdr.setAttribute('style', [
      'padding:22px 24px 16px', 'border-bottom:1px solid rgba(255,255,255,0.08)',
      'display:flex', 'align-items:center', 'justify-content:space-between',
      'background:linear-gradient(90deg,rgba(249,115,22,0.16),rgba(34,211,238,0.06),transparent)',
    ].join(';'));
    hdr.innerHTML =
      '<div><div style="font-size:17px;font-weight:900;color:rgba(255,255,255,0.96);letter-spacing:-0.03em;">Focus background</div>' +
      '<div style="font-size:12px;color:rgba(255,255,255,0.50);margin-top:3px;">Import a calm image or a muted loop for the Focus room.</div></div>' +
      '<button id="__iso_fbg_close__" aria-label="Close" style="background:rgba(255,255,255,0.08);' +
      'border:1px solid rgba(255,255,255,0.14);border-radius:50%;width:32px;height:32px;' +
      'cursor:pointer;color:rgba(255,255,255,0.72);font-size:13px;display:flex;' +
      'align-items:center;justify-content:center;padding:0;">x</button>';

    var tabBar = document.createElement('div');
    tabBar.setAttribute('style', [
      'display:flex', 'margin:16px 22px 0', 'padding:4px',
      'gap:4px', 'border:1px solid rgba(255,255,255,0.10)',
      'border-radius:999px', 'background:rgba(255,255,255,0.06)',
    ].join(';'));

    function mkTab(id, label) {
      var t = document.createElement('button');
      t.id = '__iso_tab_' + id + '__';
      t.textContent = label;
      t.setAttribute('style', [
        'flex:1', 'padding:9px 14px', 'border-radius:999px',
        'font-size:13px', 'font-weight:700', 'cursor:pointer',
        'border:0',
        'transition:all 0.15s',
        'background:' + (_activeTab === id ? 'linear-gradient(135deg,rgba(249,115,22,0.95),rgba(34,211,238,0.74))' : 'transparent'),
        'color:' + (_activeTab === id ? '#09090b' : 'rgba(255,255,255,0.58)'),
        'box-shadow:' + (_activeTab === id ? '0 10px 26px rgba(249,115,22,0.20)' : 'none'),
      ].join(';'));
      t.addEventListener('click', function () {
        _activeTab = id;
        renderTabContent();
        ['image', 'video'].forEach(function (tid) {
          var btn = document.getElementById('__iso_tab_' + tid + '__');
          if (!btn) return;
          var active = tid === id;
          btn.style.background = active ? 'linear-gradient(135deg,rgba(249,115,22,0.95),rgba(34,211,238,0.74))' : 'transparent';
          btn.style.color = active ? '#09090b' : 'rgba(255,255,255,0.58)';
          btn.style.boxShadow = active ? '0 10px 26px rgba(249,115,22,0.20)' : 'none';
        });
      });
      return t;
    }

    tabBar.appendChild(mkTab('image', 'Image'));
    tabBar.appendChild(mkTab('video', 'Video'));

    var body = document.createElement('div');
    body.id = '__iso_fbg_body__';
    body.setAttribute('style', 'padding:20px 22px 22px;');

    var imgInput = document.createElement('input');
    imgInput.type = 'file';
    imgInput.accept = 'image/*,.jpg,.jpeg,.png,.webp,.avif,.gif,.bmp';
    imgInput.style.display = 'none';
    imgInput.id = '__iso_img_pick__';

    var vidInput = document.createElement('input');
    vidInput.type = 'file';
    vidInput.accept = 'video/*,.mp4,.webm,.mov,.mkv';
    vidInput.style.display = 'none';
    vidInput.id = '__iso_vid_pick__';

    imgInput.onchange = function () {
      var file = imgInput.files && imgInput.files[0];
      if (!file) return;
      idbPut(CUSTOM_KEY, mediaRecord('image', file)).catch(function () {});
      var url = URL.createObjectURL(file);
      closeModal();
      applyBackground(url, false, true);
      toast('Image background applied.');
    };

    vidInput.onchange = function () {
      var file = vidInput.files && vidInput.files[0];
      if (!file) return;
      var url = URL.createObjectURL(file);
      toast('Checking video length...');
      validateVideoDurationIfReadable(url).then(function (result) {
        if (!result.ok) {
          try { URL.revokeObjectURL(url); } catch (e) {}
          toast(result.message || 'Use a video under 60 seconds.', 'error');
          vidInput.value = '';
          return;
        }
        if (result.unknown) toast('Length check unavailable; applying and enforcing after load.');
        idbPut(CUSTOM_KEY, mediaRecord('video', file)).catch(function () {});
        closeModal();
        applyBackground(url, true, true);
        toast('Video background applied muted and looping.');
      }).catch(function (err) {
        try { URL.revokeObjectURL(url); } catch (e) {}
        toast(err && err.message ? err.message : 'Use a video under 60 seconds.', 'error');
        vidInput.value = '';
      });
    };

    var urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.placeholder = 'https://example.com/wallpaper.jpg';
    urlInput.id = '__iso_url_input__';
    urlInput.setAttribute('style', [
      'width:100%', 'box-sizing:border-box', 'padding:12px 14px',
      'border-radius:16px', 'background:rgba(255,255,255,0.07)',
      'border:1px solid rgba(255,255,255,0.14)', 'color:rgba(255,255,255,0.92)',
      'font-size:13px', 'outline:none', 'transition:border-color 0.2s',
      'margin-top:14px',
    ].join(';'));
    urlInput.onfocus = function () { urlInput.style.borderColor = 'rgba(34,211,238,0.55)'; };
    urlInput.onblur = function () { urlInput.style.borderColor = 'rgba(255,255,255,0.14)'; };

    function applyImageUrl() {
      var url = urlInput.value.trim();
      if (!url) { toast('Enter an image URL first.', 'error'); return; }
      if (!/^https?:\/\//i.test(url)) { toast('Use an http or https image URL.', 'error'); return; }
      idbPut(CUSTOM_KEY, { type: 'url', kind: 'image', url: url, savedAt: new Date().toISOString() }).catch(function () {});
      saveNativeImageUrl(url);
      closeModal();
      applyBackground(url, false, false);
      toast('Image URL applied.');
    }

    function applyVideoUrl() {
      var url = urlInput.value.trim();
      if (!url) { toast('Enter a video URL first.', 'error'); return; }
      if (!/^https?:\/\//i.test(url)) { toast('Use an http or https video URL.', 'error'); return; }
      toast('Checking video length...');
      validateVideoDurationIfReadable(url).then(function (result) {
        if (!result.ok) {
          toast(result.message || 'Use a video URL under 60 seconds.', 'error');
          return;
        }
        if (result.unknown) toast('Length check unavailable; applying and enforcing after load.');
        idbPut(CUSTOM_KEY, { type: 'url', kind: 'video', url: url, savedAt: new Date().toISOString() }).catch(function () {});
        closeModal();
        applyBackground(url, true, false);
        toast('Video URL applied muted and looping.');
      }).catch(function (err) {
        toast(err && err.message ? err.message : 'Use a video URL under 60 seconds.', 'error');
      });
    }

    urlInput.onkeydown = function (event) {
      if (event.key === 'Enter') (_activeTab === 'video' ? applyVideoUrl : applyImageUrl)();
    };

    function renderTabContent() {
      var b = document.getElementById('__iso_fbg_body__');
      if (!b) return;
      while (b.firstChild) b.removeChild(b.firstChild);

      if (_activeTab === 'image') {
        var importBtn = mkActionBtn('Choose image from device', 'linear-gradient(135deg,#f97316,#facc15)', '#111827');
        importBtn.addEventListener('click', function () { imgInput.click(); });
        b.appendChild(importBtn);

        appendDivider(b, 'or URL');
        urlInput.placeholder = 'https://example.com/wallpaper.jpg';
        b.appendChild(urlInput);

        var applyBtn = mkActionBtn('Apply image URL', 'linear-gradient(135deg,#f97316,#22d3ee)', '#061018');
        applyBtn.style.marginTop = '10px';
        applyBtn.addEventListener('click', applyImageUrl);
        b.appendChild(applyBtn);
      } else {
        var vidBtn = mkActionBtn('Choose video from device', 'linear-gradient(135deg,#22d3ee,#6366f1)', '#fff');
        vidBtn.addEventListener('click', function () { vidInput.click(); });
        b.appendChild(vidBtn);

        var note = document.createElement('p');
        note.textContent = 'Supported: MP4, WebM, MOV, MKV. Max 60 seconds. Playback is always muted and looped.';
        note.style.cssText = 'color:rgba(255,255,255,0.52);font-size:12px;margin:12px 0 0;line-height:1.5;padding:10px 12px;border:1px solid rgba(34,211,238,0.18);border-radius:14px;background:rgba(34,211,238,0.07);';
        b.appendChild(note);

        appendDivider(b, 'or URL');
        urlInput.placeholder = 'https://example.com/loop.mp4';
        b.appendChild(urlInput);

        var vidApply = mkActionBtn('Apply video URL', 'linear-gradient(135deg,#6366f1,#22d3ee)', '#fff');
        vidApply.style.marginTop = '10px';
        vidApply.addEventListener('click', applyVideoUrl);
        b.appendChild(vidApply);
      }

      var blurNote = document.createElement('p');
      blurNote.textContent = 'Blur follows Settings > Focus Background.';
      blurNote.style.cssText = 'color:rgba(255,255,255,0.42);font-size:11.5px;margin:14px 0 0;line-height:1.5;text-align:center;';
      b.appendChild(blurNote);

      var clearBtn = document.createElement('button');
      clearBtn.textContent = 'Remove current background';
      clearBtn.setAttribute('style', [
        'display:block', 'width:100%', 'margin-top:14px',
        'background:none', 'border:none',
        'color:rgba(255,255,255,0.34)', 'font-size:12px',
        'cursor:pointer', 'text-align:center', 'padding:5px 0',
        'transition:color 0.15s',
      ].join(';'));
      clearBtn.onmouseenter = function () { clearBtn.style.color = 'rgba(255,255,255,0.68)'; };
      clearBtn.onmouseleave = function () { clearBtn.style.color = 'rgba(255,255,255,0.34)'; };
      clearBtn.addEventListener('click', function () {
        clearBackground();
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
      backdrop.style.opacity = '1';
      card.style.transform = 'translateY(0) scale(1)';
    });

    document.getElementById('__iso_fbg_close__').onclick = closeModal;
    backdrop.onclick = function (event) { if (event.target === backdrop) closeModal(); };
    document.addEventListener('keydown', escClose);
  }

  function closeModal() {
    _modalOpen = false;
    var modal = document.getElementById('__iso_fbg_modal__');
    if (!modal) return;
    modal.style.opacity = '0';
    setTimeout(function () { if (modal.parentNode) modal.remove(); }, 260);
    document.removeEventListener('keydown', escClose);
  }

  function escClose(event) {
    if (event.key === 'Escape') closeModal();
  }

  function appendDivider(parent, label) {
    var outer = document.createElement('div');
    outer.style.cssText = 'display:flex;align-items:center;gap:10px;margin:16px 0 4px;color:rgba(255,255,255,0.24);font-size:11px;';
    var lineL = document.createElement('div');
    lineL.style.cssText = 'flex:1;height:1px;background:rgba(255,255,255,0.07);';
    var lineR = document.createElement('div');
    lineR.style.cssText = 'flex:1;height:1px;background:rgba(255,255,255,0.07);';
    outer.appendChild(lineL);
    outer.appendChild(document.createTextNode(label));
    outer.appendChild(lineR);
    parent.appendChild(outer);
  }

  function mkActionBtn(label, bg, color) {
    var b = document.createElement('button');
    b.textContent = label;
    b.setAttribute('style', [
      'display:flex', 'align-items:center', 'justify-content:center',
      'width:100%', 'padding:13px 18px', 'border-radius:16px',
      'font-size:14px', 'font-weight:850', 'letter-spacing:-0.01em', 'cursor:pointer',
      'background:' + bg, 'color:' + color, 'border:none',
      'box-shadow:0 14px 36px rgba(0,0,0,0.32),inset 0 1px 0 rgba(255,255,255,0.20)',
      'transition:opacity 0.15s,transform 0.15s,filter 0.15s',
    ].join(';'));
    b.onmouseenter = function () { b.style.opacity = '0.94'; b.style.transform = 'translateY(-1px)'; b.style.filter = 'saturate(1.1)'; };
    b.onmouseleave = function () { b.style.opacity = '1'; b.style.transform = 'translateY(0)'; b.style.filter = 'none'; };
    return b;
  }

  function createToolbarButton() {
    var btn = document.createElement('button');
    btn.id = '__iso_fbg_btn__';
    btn.type = 'button';
    btn.title = 'Import image or video background';
    btn.setAttribute('aria-label', 'Import image or video background');
    btn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
      '<rect x="3" y="4" width="18" height="16" rx="2"/>' +
      '<circle cx="8.5" cy="9.5" r="1.5"/>' +
      '<path d="M21 15l-4.5-4.5L5 20"/>' +
      '</svg>';
    btn.onclick = showModal;
    return btn;
  }

  function styleDockedButton(btn) {
    btn.setAttribute('style', [
      'position:static', 'z-index:auto',
      'display:inline-flex', 'align-items:center', 'justify-content:center',
      'width:34px', 'height:34px', 'min-width:34px',
      'padding:0', 'border-radius:999px',
      'background:rgba(255,255,255,0.08)',
      'border:1px solid rgba(255,255,255,0.12)',
      'color:rgba(255,255,255,0.82)',
      'cursor:pointer', 'backdrop-filter:blur(10px)',
      'box-shadow:none', 'transition:background 0.16s,border-color 0.16s,color 0.16s',
    ].join(';'));
    btn.onmouseenter = function () {
      btn.style.background = 'rgba(249,115,22,0.20)';
      btn.style.borderColor = 'rgba(249,115,22,0.42)';
      btn.style.color = 'rgba(255,255,255,0.96)';
    };
    btn.onmouseleave = function () {
      btn.style.background = 'rgba(255,255,255,0.08)';
      btn.style.borderColor = 'rgba(255,255,255,0.12)';
      btn.style.color = 'rgba(255,255,255,0.82)';
    };
  }

  function styleFallbackButton(btn) {
    btn.setAttribute('style', [
      'position:fixed',
      'right:max(16px,env(safe-area-inset-right))',
      'bottom:calc(76px + env(safe-area-inset-bottom))',
      'z-index:60',
      'display:inline-flex', 'align-items:center', 'justify-content:center',
      'width:38px', 'height:38px', 'padding:0', 'border-radius:999px',
      'background:rgba(9,9,11,0.82)',
      'border:1px solid rgba(249,115,22,0.4)',
      'color:rgba(249,115,22,0.95)',
      'cursor:pointer', 'backdrop-filter:blur(12px)',
      'box-shadow:0 4px 16px rgba(0,0,0,0.36)',
      'transition:background 0.16s,border-color 0.16s,color 0.16s',
    ].join(';'));
  }

  function findControlBar() {
    var selectors = [
      'button[title="Picture-in-Picture"]',
      'button[title="Toggle Zen Mode"]',
      'button[title="Exit Zen Mode"]',
      'button[title="Custom Background URL"]'
    ];
    for (var i = 0; i < selectors.length; i += 1) {
      var matches = document.querySelectorAll(selectors[i]);
      for (var j = 0; j < matches.length; j += 1) {
        var button = matches[j];
        if (!isVisible(button) || !button.parentElement) continue;
        var parent = button.parentElement;
        if (isVisible(parent) && parent.querySelectorAll('button').length >= 2) return parent;
      }
    }
    return null;
  }

  function insertDockedButton(bar, btn) {
    var before =
      bar.querySelector('button[title="Picture-in-Picture"]') ||
      bar.querySelector('button[title="Toggle Zen Mode"]') ||
      bar.querySelector('button[title="Exit Zen Mode"]') ||
      null;
    if (before && before !== btn) bar.insertBefore(btn, before);
    else if (btn.parentNode !== bar) bar.appendChild(btn);
  }

  function syncButtonPlacement() {
    var btn = document.getElementById('__iso_fbg_btn__');
    if (!isOnFocus()) {
      if (btn) btn.remove();
      return;
    }
    if (!btn) btn = createToolbarButton();

    var bar = findControlBar();
    if (bar) {
      styleDockedButton(btn);
      insertDockedButton(bar, btn);
    } else {
      styleFallbackButton(btn);
      if (btn.parentNode !== document.body) document.body.appendChild(btn);
    }
  }

  function scheduleRouteWork(delay) {
    clearTimeout(_routeTimer);
    _routeTimer = setTimeout(function () {
      syncButtonPlacement();
      ensureActiveBackground();
    }, delay || 120);
  }

  ['pushState', 'replaceState'].forEach(function (method) {
    var original = history[method];
    history[method] = function () {
      var result = original.apply(history, arguments);
      scheduleRouteWork(140);
      return result;
    };
  });

  window.addEventListener('popstate', function () { scheduleRouteWork(140); });
  window.addEventListener('storage', function (event) {
    if (event && event.key && /focus-bg-blur$/i.test(event.key)) refreshBlur();
  });
  window.addEventListener('focus', function () {
    if (_activeUrl && isOnFocus()) refreshBlur();
  });
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && _activeUrl && isOnFocus()) refreshBlur();
  });
  window.addEventListener('isotope:sync_refresh', function () {
    if (_activeUrl && isOnFocus()) refreshBlur();
  });
  window.__isoRefreshFocusBgBlur = refreshBlur;
  window.__isoGetFocusBgBlur = function () { return _lastAppliedBlur; };

  new MutationObserver(function () { scheduleRouteWork(160); })
    .observe(document.documentElement, { childList: true, subtree: true });

  // setInterval removed: the MutationObserver above already triggers
  // scheduleRouteWork on DOM changes, which calls refreshBlur when on the
  // Focus page. Polling every 850 ms was redundant and wasteful on battery.

  function init() {
    loadSaved();
    scheduleRouteWork(700);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
