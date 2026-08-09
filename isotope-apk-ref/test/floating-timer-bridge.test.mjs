import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = path.resolve(import.meta.dirname, '..');
const BRIDGE_PATH = path.join(ROOT, 'android-floating-timer-bridge.js');

class MemoryStorage {
  constructor() {
    this.map = new Map();
    this.setCount = 0;
  }
  getItem(key) {
    return this.map.has(String(key)) ? this.map.get(String(key)) : null;
  }
  setItem(key, value) {
    this.setCount += 1;
    this.map.set(String(key), String(value));
  }
  removeItem(key) {
    this.map.delete(String(key));
  }
}

function createHarness(native = {}) {
  const localStorage = new MemoryStorage();
  const events = new Map();
  const window = {
    __ISO_IS_ANDROID__: true,
    IsotopeAndroid: native,
    localStorage,
    location: { pathname: '/focus' },
    history: { pushState() {} },
    addEventListener(type, callback) {
      if (!events.has(type)) events.set(type, []);
      events.get(type).push(callback);
    },
    dispatchEvent(event) {
      for (const callback of events.get(event.type) || []) callback(event);
      return true;
    },
    console,
  };
  window.window = window;
  const context = {
    window,
    localStorage,
    console,
    Intl,
    Date,
    Math,
    Number,
    String,
    JSON,
    Array,
    Object,
    Promise,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(BRIDGE_PATH, 'utf8'), context, { filename: BRIDGE_PATH });
  return { window, localStorage, context };
}

test('focus icon normalization is grapheme-safe and repairs corrupted Lecture icon', () => {
  const { window } = createHarness();

  assert.equal(window.__isoNormalizeFocusIcon('👨‍🏫', 'lecture'), '👨‍🏫');
  assert.equal(window.__isoNormalizeFocusIcon('����', 'lecture'), '🎓');
  assert.equal(window.__isoNormalizeFocusIcon('\uFFFD', 'lecture'), '🎓');
  assert.equal(window.__isoNormalizeFocusIcon('ï¿½', 'questions'), '❓');
  assert.equal(window.__isoNormalizeFocusIcon('\uD83D', 'questions'), '❓');
  assert.equal(window.__isoNormalizeFocusIcon('🧪', 'custom-lab'), '🧪');
});

test('focus profile repair preserves canonical and custom focus types', () => {
  const { window } = createHarness();
  const profile = {
    focusSettings: {
      focusTypes: [
        { id: 'theory', label: 'Theory', icon: '📚', trackQuestions: false },
        { id: 'lecture', label: 'Lecture', icon: '����', trackQuestions: false },
        { id: 'mock', label: 'Mock Drill', icon: '🧠', trackQuestions: true },
      ],
    },
  };

  const repaired = window.__isoRepairFocusTypesInProfile(profile);

  assert.equal(repaired.changed, true);
  assert.equal(repaired.profile.focusSettings.focusTypes[0].icon, '📚');
  assert.equal(repaired.profile.focusSettings.focusTypes[1].icon, '🎓');
  assert.equal(repaired.profile.focusSettings.focusTypes[2].icon, '🧠');
  assert.equal(repaired.profile.focusSettings.focusTypes[2].trackQuestions, true);
});

test('corrupted stored focus icons persist exactly once', () => {
  const native = {};
  const localStorage = new MemoryStorage();
  localStorage.setItem('isotope_user_profile_v2', JSON.stringify({
    name: 'Student',
    focusSettings: {
      focusTypes: [
        { id: 'lecture', label: 'Lecture', icon: '����', trackQuestions: false },
      ],
    },
  }));
  const initialSetCount = localStorage.setCount;
  const window = {
    __ISO_IS_ANDROID__: true,
    IsotopeAndroid: native,
    localStorage,
    addEventListener() {},
    console,
  };
  window.window = window;
  const context = {
    window,
    localStorage,
    console,
    Intl,
    Date,
    Math,
    Number,
    String,
    JSON,
    Array,
    Object,
    Promise,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(BRIDGE_PATH, 'utf8'), context, { filename: BRIDGE_PATH });

  const repaired = JSON.parse(localStorage.getItem('isotope_user_profile_v2'));
  assert.equal(repaired.focusSettings.focusTypes[0].icon, '🎓');
  assert.equal(localStorage.setCount, initialSetCount + 1);
  assert.equal(window.__isoRepairStoredFocusIconsOnce().changed, false);
  assert.equal(localStorage.setCount, initialSetCount + 1);
});

test('Floating Timer permission denial opens overlay settings and does not start service', async () => {
  let requested = 0;
  let started = 0;
  const { window } = createHarness({
    hasOverlayPermission() { return false; },
    requestOverlayPermission() { requested += 1; },
    startFloatingTimer() { started += 1; },
  });

  const result = await window.__isoOpenFloatingTimer({
    getState: () => ({ timerState: 'running', displayedSeconds: 1500, mode: 'pomodoro' }),
    dispatch: () => true,
  });

  assert.equal(result.ok, false);
  assert.equal(result.permissionRequired, true);
  assert.equal(requested, 1);
  assert.equal(started, 0);
});

test('Floating Timer routes question actions to the real store and bounds target', async () => {
  const started = [];
  const updates = [];
  let stopped = 0;
  let replayed = 0;
  const dispatched = [];
  const { window } = createHarness({
    hasOverlayPermission() { return true; },
    startFloatingTimer(payload) { started.push(JSON.parse(payload)); },
    updateFloatingTimerState(payload) { updates.push(JSON.parse(payload)); },
    stopFloatingTimer() { stopped += 1; },
    replayFloatingTimerActions() { replayed += 1; },
    expandFloatingTimer() {},
  });

  const result = await window.__isoOpenFloatingTimer({
    getState: () => ({
      timerState: 'running',
      mode: 'pomodoro',
      displayedSeconds: 1500,
      totalSeconds: 1500,
      completionAtMs: Date.now() + 1500_000,
      focusTypeId: 'questions',
      focusTypeLabel: 'Questions',
      focusTypeIcon: '❓',
      showQuestionControls: true,
      trackQuestions: true,
      questionsAttempted: 3,
      questionsCorrect: 2,
      questionsIncorrect: 1,
      questionsSkipped: 0,
      targetQuestions: 20,
      undoAvailable: true,
    }),
    subscribe: () => () => {},
    dispatch: (action) => {
      dispatched.push(action);
      return true;
    },
  });

  assert.equal(result.ok, true);
  assert.equal(started.length, 1);
  assert.equal(started[0].showQuestionControls, true);
  assert.equal(replayed, 1);
  assert.equal(window.__ISO_FLOATING_TIMER__.handleNativeAction({ type: 'correct' }), true);
  assert.equal(window.__ISO_FLOATING_TIMER__.handleNativeAction({ type: 'incorrect' }), true);
  assert.equal(window.__ISO_FLOATING_TIMER__.handleNativeAction({ type: 'skipped' }), true);
  assert.equal(window.__ISO_FLOATING_TIMER__.handleNativeAction({ type: 'undo' }), true);
  assert.equal(window.__ISO_FLOATING_TIMER__.handleNativeAction({ type: 'setTarget', value: 20000 }), true);
  assert.deepEqual(dispatched.map((item) => item.type), ['correct', 'incorrect', 'skipped', 'undo', 'setTarget']);
  assert.equal(dispatched.at(-1).value, 9999);
  assert.ok(updates.length >= 0);
  window.__ISO_FLOATING_TIMER__.handleNativeAction({ type: 'close' });
  assert.equal(stopped, 1);
});

test('Floating Timer hides question controls for idle and non-tracked states', () => {
  const { window } = createHarness();

  const idle = window.__ISO_FLOATING_TIMER__.normalizeTimerState({
    timerState: 'idle',
    showQuestionControls: true,
    displayedSeconds: 1500,
  });
  const nonTracked = window.__ISO_FLOATING_TIMER__.normalizeTimerState({
    timerState: 'running',
    mode: 'pomodoro',
    displayedSeconds: 1500,
    showQuestionControls: false,
    trackQuestions: false,
  });

  assert.equal(idle.active, false);
  assert.equal(nonTracked.showQuestionControls, false);
});
