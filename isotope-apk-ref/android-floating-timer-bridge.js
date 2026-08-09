/**
 * IsotopeAI Android Floating Timer bridge.
 *
 * This bridge does not emulate browser Document Picture-in-Picture. Android
 * system PiP cannot host directly clickable app UI, so the Android build uses a
 * native overlay service for the interactive focus timer card.
 */
(function () {
  'use strict';

  if (typeof window === 'undefined' || !window.__ISO_IS_ANDROID__) return;

  var FALLBACK_ICONS = {
    theory: '📚',
    questions: '❓',
    lecture: '🎓',
    revision: '📝',
    practice: '💪',
    other: '📌'
  };
  var PROFILE_KEY = 'isotope_user_profile_v2';
  var activeController = null;
  var unsubscribeStore = null;
  var stateTimer = null;

  function nativeBridge() {
    try { return window.IsotopeAndroid || null; }
    catch (error) { return null; }
  }

  function clampNumber(value, min, max, fallback) {
    var n = Number(value);
    if (!Number.isFinite(n)) return fallback;
    return Math.min(max, Math.max(min, Math.floor(n)));
  }

  function hasUnpairedSurrogate(value) {
    for (var i = 0; i < value.length; i += 1) {
      var code = value.charCodeAt(i);
      if (code >= 0xD800 && code <= 0xDBFF) {
        var next = value.charCodeAt(i + 1);
        if (!(next >= 0xDC00 && next <= 0xDFFF)) return true;
        i += 1;
      } else if (code >= 0xDC00 && code <= 0xDFFF) {
        return true;
      }
    }
    return false;
  }

  function isControlOnly(value) {
    var sawPrintable = false;
    for (var i = 0; i < value.length; i += 1) {
      var code = value.charCodeAt(i);
      if (code > 0x20 && !(code >= 0x7F && code <= 0x9F)) {
        sawPrintable = true;
        break;
      }
    }
    return !sawPrintable;
  }

  function firstGrapheme(value) {
    if (!value) return '';
    if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
      try {
        var segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
        var iterator = segmenter.segment(value)[Symbol.iterator]();
        var first = iterator.next();
        return first && first.value && first.value.segment ? first.value.segment : '';
      } catch (error) {}
    }
    return Array.from(value)[0] || '';
  }

  function fallbackIcon(id) {
    var key = String(id || '').trim().toLowerCase();
    return FALLBACK_ICONS[key] || FALLBACK_ICONS.other;
  }

  function normalizeFocusIcon(icon, id) {
    var raw = typeof icon === 'string' ? icon.trim() : '';
    if (
      !raw ||
      raw.indexOf('\uFFFD') !== -1 ||
      raw.indexOf('ï¿½') !== -1 ||
      hasUnpairedSurrogate(raw) ||
      isControlOnly(raw)
    ) {
      return fallbackIcon(id);
    }
    var grapheme = firstGrapheme(raw);
    if (
      !grapheme ||
      grapheme.indexOf('\uFFFD') !== -1 ||
      grapheme.indexOf('ï¿½') !== -1 ||
      hasUnpairedSurrogate(grapheme) ||
      isControlOnly(grapheme)
    ) {
      return fallbackIcon(id);
    }
    return grapheme;
  }

  function repairFocusTypesInProfile(profile) {
    if (!profile || typeof profile !== 'object') return { profile: profile, changed: false };
    var settings = profile.focusSettings;
    var types = settings && Array.isArray(settings.focusTypes) ? settings.focusTypes : null;
    if (!types) return { profile: profile, changed: false };

    var changed = false;
    var nextTypes = types.map(function (type) {
      if (!type || typeof type !== 'object') return type;
      var nextIcon = normalizeFocusIcon(type.icon, type.id);
      if (nextIcon === type.icon) return type;
      changed = true;
      return Object.assign({}, type, { icon: nextIcon });
    });
    if (!changed) return { profile: profile, changed: false };

    return {
      changed: true,
      profile: Object.assign({}, profile, {
        focusSettings: Object.assign({}, settings, { focusTypes: nextTypes })
      })
    };
  }

  function repairStoredFocusIconsOnce() {
    try {
      if (!window.localStorage) return { changed: false };
      var raw = window.localStorage.getItem(PROFILE_KEY);
      if (!raw) return { changed: false };
      var parsed = JSON.parse(raw);
      var repaired = repairFocusTypesInProfile(parsed);
      if (!repaired.changed) return { changed: false };
      window.localStorage.setItem(PROFILE_KEY, JSON.stringify(repaired.profile));
      return { changed: true };
    } catch (error) {
      return { changed: false, error: error && error.message || 'repair failed' };
    }
  }

  function stopStatePump() {
    if (stateTimer !== null) {
      clearInterval(stateTimer);
      stateTimer = null;
    }
    if (typeof unsubscribeStore === 'function') {
      try { unsubscribeStore(); } catch (error) {}
      unsubscribeStore = null;
    }
  }

  function isActiveTimerState(state) {
    return !!state && (state.timerState === 'running' || state.timerState === 'paused' || state.timerState === 'break');
  }

  function normalizeTimerState(raw) {
    raw = raw && typeof raw === 'object' ? raw : {};
    var mode = raw.mode === 'stopwatch' ? 'stopwatch' : 'pomodoro';
    var timerState = ['idle', 'running', 'paused', 'break'].indexOf(raw.timerState) >= 0 ? raw.timerState : 'idle';
    var activePhase = raw.activePhase === 'break' ? 'break' : raw.activePhase === 'focus' ? 'focus' : null;
    var displayedSeconds = clampNumber(raw.displayedSeconds, 0, 365 * 24 * 3600, 0);
    var totalSeconds = clampNumber(raw.totalSeconds, 0, 365 * 24 * 3600, displayedSeconds);
    var targetQuestions = clampNumber(raw.targetQuestions, 0, 9999, 0);
    var now = Date.now();
    var completionAtMs = raw.completionAtMs ? clampNumber(raw.completionAtMs, 0, 9999999999999, 0) : 0;
    var updatedAtMs = raw.updatedAtMs ? clampNumber(raw.updatedAtMs, 0, 9999999999999, now) : now;
    var focusTypeId = String(raw.focusTypeId || raw.taskType || raw.sessionType || 'other').trim().toLowerCase() || 'other';
    var focusTypeLabel = String(raw.focusTypeLabel || raw.taskType || raw.sessionType || 'Focus').trim().slice(0, 48) || 'Focus';

    return {
      mode: mode,
      timerState: timerState,
      activePhase: activePhase,
      startedAt: raw.startedAt || null,
      completionAtMs: completionAtMs || null,
      updatedAtMs: updatedAtMs,
      displayedSeconds: displayedSeconds,
      totalSeconds: totalSeconds,
      sessionType: String(raw.sessionType || '').slice(0, 64),
      taskType: String(raw.taskType || '').slice(0, 64),
      focusTypeId: focusTypeId,
      focusTypeLabel: focusTypeLabel,
      focusTypeIcon: normalizeFocusIcon(raw.focusTypeIcon, focusTypeId),
      questionTrackingEnabled: raw.questionTrackingEnabled !== false,
      trackQuestions: !!raw.trackQuestions,
      showQuestionControls: !!raw.showQuestionControls,
      questionsAttempted: clampNumber(raw.questionsAttempted, 0, 999999, 0),
      questionsCorrect: clampNumber(raw.questionsCorrect, 0, 999999, 0),
      questionsIncorrect: clampNumber(raw.questionsIncorrect, 0, 999999, 0),
      questionsSkipped: clampNumber(raw.questionsSkipped, 0, 999999, 0),
      targetQuestions: targetQuestions,
      undoAvailable: !!raw.undoAvailable,
      theme: raw.theme === 'light' ? 'light' : 'dark',
      route: raw.route || '/focus',
      active: timerState === 'running' || timerState === 'paused' || timerState === 'break'
    };
  }

  function getControllerState() {
    if (!activeController || typeof activeController.getState !== 'function') return null;
    try { return normalizeTimerState(activeController.getState()); }
    catch (error) {
      console.error('[IsotopeAI Floating Timer] Failed to read timer state:', error);
      return null;
    }
  }

  function sendStateToNative() {
    var bridge = nativeBridge();
    var state = getControllerState();
    if (!bridge || !state) return false;
    if (!isActiveTimerState(state)) {
      try { if (typeof bridge.stopFloatingTimer === 'function') bridge.stopFloatingTimer(); } catch (error) {}
      stopStatePump();
      activeController = null;
      return false;
    }
    var payload = JSON.stringify(state);
    try {
      if (typeof bridge.updateFloatingTimerState === 'function') bridge.updateFloatingTimerState(payload);
      return true;
    } catch (error) {
      console.error('[IsotopeAI Floating Timer] Native state update failed:', error);
      return false;
    }
  }

  function startStatePump() {
    stopStatePump();
    if (activeController && typeof activeController.subscribe === 'function') {
      try { unsubscribeStore = activeController.subscribe(sendStateToNative); } catch (error) {}
    }
    stateTimer = setInterval(sendStateToNative, 1000);
  }

  function validateAction(input) {
    var type = typeof input === 'string' ? input : input && input.type;
    if (['correct', 'incorrect', 'skipped', 'undo', 'expand', 'close'].indexOf(type) >= 0) {
      return { type: type };
    }
    if (type === 'setTarget') {
      return { type: 'setTarget', value: clampNumber(input && input.value, 0, 9999, 0) };
    }
    return null;
  }

  function dispatchToStore(action) {
    if (!activeController || typeof activeController.dispatch !== 'function') return false;
    try {
      return activeController.dispatch(action) !== false;
    } catch (error) {
      console.error('[IsotopeAI Floating Timer] Action dispatch failed:', error);
      return false;
    }
  }

  window.__isoNormalizeFocusIcon = normalizeFocusIcon;
  window.__isoRepairFocusTypesInProfile = repairFocusTypesInProfile;
  window.__isoRepairStoredFocusIconsOnce = repairStoredFocusIconsOnce;

  window.__ISO_FLOATING_TIMER__ = {
    normalizeTimerState: normalizeTimerState,
    handleNativeAction: function (input) {
      var action = validateAction(input);
      var bridge = nativeBridge();
      if (!action) return false;
      if (action.type === 'expand') {
        try {
          if (bridge && typeof bridge.expandFloatingTimer === 'function') bridge.expandFloatingTimer();
          if (window.location && window.location.pathname !== '/focus') window.history.pushState(null, '', '/focus');
        } catch (error) {}
        return true;
      }
      if (action.type === 'close') {
        try { if (bridge && typeof bridge.stopFloatingTimer === 'function') bridge.stopFloatingTimer(); } catch (error) {}
        stopStatePump();
        activeController = null;
        return true;
      }
      if (!dispatchToStore(action)) return false;
      setTimeout(sendStateToNative, 0);
      return true;
    },
    close: function () {
      var bridge = nativeBridge();
      try { if (bridge && typeof bridge.stopFloatingTimer === 'function') bridge.stopFloatingTimer(); } catch (error) {}
      stopStatePump();
      activeController = null;
    },
    sendState: sendStateToNative
  };

  window.__isoOpenFloatingTimer = function (controller) {
    var bridge = nativeBridge();
    if (!bridge || typeof bridge.startFloatingTimer !== 'function') {
      return Promise.resolve({ ok: false, reason: 'Android Floating Timer bridge is unavailable.' });
    }
    if (!controller || typeof controller.getState !== 'function' || typeof controller.dispatch !== 'function') {
      return Promise.resolve({ ok: false, reason: 'Focus timer state is not ready.' });
    }

    activeController = controller;
    var state = getControllerState();
    if (!isActiveTimerState(state)) {
      activeController = null;
      return Promise.resolve({ ok: false, reason: 'Start a focus session before opening Floating Timer.' });
    }

    try {
      if (typeof bridge.hasOverlayPermission === 'function' && !bridge.hasOverlayPermission()) {
        if (typeof bridge.requestOverlayPermission === 'function') bridge.requestOverlayPermission();
        activeController = null;
        return Promise.resolve({
          ok: false,
          permissionRequired: true,
          reason: 'Enable Display over other apps for IsotopeAI, then open Floating Timer again.'
        });
      }
      bridge.startFloatingTimer(JSON.stringify(state));
      startStatePump();
      if (typeof bridge.replayFloatingTimerActions === 'function') bridge.replayFloatingTimerActions();
      return Promise.resolve({ ok: true, floatingTimer: true });
    } catch (error) {
      activeController = null;
      stopStatePump();
      return Promise.resolve({ ok: false, reason: error && error.message || 'Floating Timer could not be opened.' });
    }
  };

  repairStoredFocusIconsOnce();
  window.addEventListener('beforeunload', function () {
    try { window.__ISO_FLOATING_TIMER__.close(); } catch (error) {}
  });

  console.log('[IsotopeAI] Android Floating Timer bridge installed');
})();
