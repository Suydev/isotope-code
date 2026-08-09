/**
 * test/android-layout-parity.test.mjs
 *
 * Verifies that android-bridge.js, apply-android-patches.js, and
 * FloatingTimerService.java contain the required layout/safety fixes
 * documented in the IsotopeAI Android tablet UI hardening spec.
 *
 * These tests check behaviour (markers that prove the fix is present),
 * NOT exact whitespace or minified class ordering.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

const bridge  = fs.readFileSync(path.join(ROOT, 'android-bridge.js'), 'utf8');
const patches = fs.readFileSync(path.join(ROOT, 'scripts/apply-android-patches.js'), 'utf8');
const service = fs.readFileSync(
  path.join(ROOT, 'android/app/src/main/java/in/isotopeai/app/FloatingTimerService.java'),
  'utf8',
);

// ── android-bridge.js checks ─────────────────────────────────────────────────

test('android-bridge injects global error capture (window.onerror)', () => {
  assert.match(bridge, /window\.__ISO_LAST_RUNTIME_ERROR__/);
  assert.match(bridge, /IsotopeAndroidRuntime/);
  assert.match(bridge, /window\.onerror\s*=/);
});

test('android-bridge injects unhandledrejection capture', () => {
  assert.match(bridge, /window\.onunhandledrejection\s*=/);
  assert.match(bridge, /Unhandled (promise )?rejection/i);
});

test('android-bridge adds iso-android CSS class to html element', () => {
  assert.match(bridge, /classList\.add\(['"](iso-android)['"]\)/);
});

test('android-bridge injects tablet layout CSS style element', () => {
  assert.match(bridge, /__iso_android_layout_css/);
  // Notification dropdown clamp must be present
  assert.match(bridge, /notification/i);
  assert.match(bridge, /max-height/);
  // Touch target min size
  assert.match(bridge, /44px/);
});

test('android-bridge does not globally shrink the entire app', () => {
  // Must not set font-size or zoom on html/body globally
  assert.doesNotMatch(bridge, /html\.iso-android\s*\{[^}]*font-size:\s*(?!1[0-9][0-9])/);
  assert.doesNotMatch(bridge, /body\s*\{\s*zoom:/);
});

// ── apply-android-patches.js checks ─────────────────────────────────────────

test('patches pass pomodoroCycle to native floating timer state', () => {
  assert.match(patches, /pomodoroCycle/);
  assert.match(patches, /pomodoroSessionsUntilLongBreak/);
});

test('patches do not rewrite create_community_group RPC in a broken APK-only way', () => {
  // The APK must not introduce its own divergent community group creation that
  // bypasses the server-side RPC defined in sql/009_community_hardening.sql.
  // Acceptable: the patch may call create_community_group (the RPC) or use
  // direct insert — but must not redefine it differently from isotope-code.
  // This test ensures we never inject a LOCAL re-implementation of the RPC body.
  assert.doesNotMatch(
    patches,
    /INSERT INTO.*groups[\s\S]{0,200}INSERT INTO.*group_members[\s\S]{0,200}INSERT INTO.*groups/,
  );
});

test('patches preserve notification panel classes matching isotope-code', () => {
  // The old divergent patches that changed p-4→p-3, items-center→items-start,
  // or added gap-3 to the notification panel header must NOT be present.
  assert.doesNotMatch(patches, /items-start justify-between gap-3/);
  assert.doesNotMatch(patches, /p-3 border-b.*flex items-start/);
  // Mark-all button must not be restyled to shrink-0 / max-w-[6.5rem]
  assert.doesNotMatch(patches, /shrink-0 max-w-\[6\.5rem\]/);
});

// ── FloatingTimerService.java checks ────────────────────────────────────────

test('FloatingTimerService uses landscape-aware overlay width clamping', () => {
  // Must check orientation and limit landscape width to ~36% of screen
  assert.match(service, /ORIENTATION_LANDSCAPE/);
  assert.match(service, /0\.36f/);
});

test('FloatingTimerService caps overlay height at 70% of screen', () => {
  assert.match(service, /0\.70f/);
});

test('FloatingTimerService default overlay size is compact (≤300dp wide)', () => {
  // Default width must be ≤ 300dp so it doesn't cover screen center by default
  assert.match(service, /PREF_WIDTH,\s*dp\((?:240|260|280|300)\)\)/);
});

test('FloatingTimerService brand color is violet-500 not orange', () => {
  // Brand color must be violet (139, 92, 246) — NOT orange (249, 115, 22)
  assert.match(service, /BRAND_500.*Color\.rgb\(139\s*,\s*92\s*,\s*246\)/s);
  assert.doesNotMatch(service, /BRAND_500.*Color\.rgb\(249\s*,\s*115\s*,\s*22\)/s);
});

test('FloatingTimerService has pomodoro cycle display field', () => {
  assert.match(service, /pomodoroCycle/);
  assert.match(service, /pomodoroSessionsUntilLongBreak/);
});

test('FloatingTimerService shows progress strip fill view', () => {
  assert.match(service, /progressFill/);
  assert.match(service, /setScaleX/);
  assert.match(service, /setPivotX\(0/);
});

test('FloatingTimerService uses rounded-2xl style buttons (16dp radius)', () => {
  assert.match(service, /setCornerRadius\(dp\(16\)\)/);
});
