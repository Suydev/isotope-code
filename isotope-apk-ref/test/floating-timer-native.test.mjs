import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
// Support both CI layout (../isotope-code) and local layout (./isotope-code)
const SOURCE_REPO = (() => {
  const nested = path.resolve(ROOT, 'isotope-code');
  if (fs.existsSync(nested)) return nested;
  return path.resolve(ROOT, '../isotope-code');
})();

function runPrepareWww() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'isotope-floating-www-'));
  const result = spawnSync(process.execPath, ['scripts/prepare-www.js'], {
    cwd: ROOT,
    env: {
      ...process.env,
      REPO_DIR: SOURCE_REPO,
      SOURCE_DIR: path.join(SOURCE_REPO, 'public'),
      WWW_DIR: tmp,
      BRIDGE_FILE: path.join(ROOT, 'android-bridge.js'),
      FLOATING_TIMER_BRIDGE_FILE: path.join(ROOT, 'android-floating-timer-bridge.js'),
    },
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  return tmp;
}

test('prepare-www packages Android Floating Timer bridge after the main bridge', () => {
  const wwwDir = runPrepareWww();
  const html = fs.readFileSync(path.join(wwwDir, 'index.html'), 'utf8');
  const floatingBridge = fs.readFileSync(path.join(wwwDir, 'android-floating-timer-bridge.js'), 'utf8');

  assert.ok(html.includes('/android-bridge.js'));
  assert.ok(html.includes('/android-floating-timer-bridge.js'));
  assert.equal(html.includes('/android-pip-bridge.js'), false);
  assert.ok(html.indexOf('/android-bridge.js') < html.indexOf('/android-floating-timer-bridge.js'));
  assert.match(floatingBridge, /__isoOpenFloatingTimer/);
  assert.match(floatingBridge, /__ISO_FLOATING_TIMER__/);
  assert.match(floatingBridge, /__isoNormalizeFocusIcon/);
  assert.doesNotMatch(floatingBridge, /documentPictureInPicture/);
});

test('native Android project exposes Floating Timer overlay service and action replay', () => {
  const activity = fs.readFileSync(
    path.join(ROOT, 'android/app/src/main/java/in/isotopeai/app/MainActivity.java'),
    'utf8',
  );
  const service = fs.readFileSync(
    path.join(ROOT, 'android/app/src/main/java/in/isotopeai/app/FloatingTimerService.java'),
    'utf8',
  );
  const manifest = fs.readFileSync(path.join(ROOT, 'android/app/src/main/AndroidManifest.xml'), 'utf8');

  assert.match(manifest, /android\.permission\.SYSTEM_ALERT_WINDOW/);
  assert.match(manifest, /android\.permission\.FOREGROUND_SERVICE_SPECIAL_USE/);
  assert.match(manifest, /android:hardwareAccelerated="true"/);
  assert.match(manifest, /android:name="\.FloatingTimerService"/);
  assert.match(manifest, /android:foregroundServiceType="specialUse"/);
  assert.match(activity, /configureWebViewForAndroidApp/);
  assert.match(activity, /LAYER_TYPE_HARDWARE/);
  assert.match(activity, /setRendererPriorityPolicy\(WebView\.RENDERER_PRIORITY_IMPORTANT, true\)/);
  assert.match(activity, /hasOverlayPermission/);
  assert.match(activity, /requestOverlayPermission/);
  assert.match(activity, /startFloatingTimer/);
  assert.match(activity, /replayFloatingTimerActions/);
  assert.match(activity, /evaluateJavascript\(script/);
  assert.match(activity, /removeQueuedAction\(MainActivity\.this, actionId\)/);
  assert.match(service, /TYPE_APPLICATION_OVERLAY/);
  assert.match(service, /WindowManager\.LayoutParams/);
  assert.match(service, /PixelFormat\.TRANSLUCENT/);
  assert.match(service, /PREF_WIDTH/);
  assert.match(service, /PREF_HEIGHT/);
  assert.match(service, /handleResizeTouch/);
  assert.match(service, /showTargetDialog/);
  assert.match(service, /AlertDialog\.Builder/);
  assert.match(service, /setTitle\("Set target questions"\)/);
  assert.match(service, /InputType\.TYPE_CLASS_NUMBER/);
  assert.match(service, /clampOverlayWidth/);
  assert.match(service, /clampOverlayHeight/);
  assert.match(service, /handleResizeTouch[\s\S]*putInt\(\s*PREF_WIDTH\s*,/);
  assert.match(service, /handleResizeTouch[\s\S]*putInt\(\s*PREF_HEIGHT\s*,/);
  assert.match(service, /startForeground\(NOTIFICATION_ID/);
  assert.match(service, /dispatchAction\("correct"/);
  assert.match(service, /dispatchAction\("incorrect"/);
  assert.match(service, /dispatchAction\("skipped"/);
  assert.match(service, /dispatchAction\("undo"/);
  assert.match(service, /dispatchAction\("setTarget"/);
  assert.match(service, /Color\.rgb\(\s*5\s*,\s*150\s*,\s*105\s*\)/);
  assert.match(service, /Color\.rgb\(\s*225\s*,\s*29\s*,\s*72\s*\)/);
  assert.match(service, /Color\.rgb\(\s*217\s*,\s*119\s*,\s*6\s*\)/);
  assert.doesNotMatch(activity, /setActions\(buildPipActions\(\)\)/);
  assert.equal(fs.existsSync(path.join(ROOT, 'android/app/src/main/res/drawable/ic_pip_correct.xml')), false);
  assert.equal(fs.existsSync(path.join(ROOT, 'android/app/src/main/res/drawable/ic_pip_incorrect.xml')), false);
  assert.equal(fs.existsSync(path.join(ROOT, 'android/app/src/main/res/drawable/ic_pip_skip.xml')), false);
});
