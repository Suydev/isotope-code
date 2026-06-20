import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'public', 'auth-bridge.js'), 'utf8');

const store = new Map();
const localStorage = {
  getItem(key) { return store.has(key) ? store.get(key) : null; },
  setItem(key, value) { store.set(String(key), String(value)); },
  removeItem(key) { store.delete(String(key)); },
  key(index) { return Array.from(store.keys())[index] || null; },
  clear() { store.clear(); },
  get length() { return store.size; },
};

const events = [];
const fakeSession = {
  access_token: 'eyJhbGciOi.fake.access',
  refresh_token: 'fake-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: {
    id: '11111111-1111-4111-8111-111111111111',
    email: 'student@example.com',
  },
};

let tokenCalls = 0;
let signupCalls = 0;
let bootstrapCalls = 0;
let fetchMode = 'success';

function assertAnonAuthRequest(textUrl, options) {
  assert.ok(textUrl.startsWith('https://runtimeproject.supabase.co/'), `unexpected Supabase URL: ${textUrl}`);
  assert.equal(options.method, 'POST');
  assert.equal(options.headers.apikey, 'runtime.anon.jwt');
  assert.equal(options.headers.Authorization, 'Bearer runtime.anon.jwt');
  assert.equal(options.cache, 'no-store');
  assert.ok(options.signal instanceof AbortSignal);
}

function abortableHang(signal) {
  return new Promise((resolve, reject) => {
    signal.addEventListener('abort', () => {
      const error = new Error('aborted');
      error.name = 'AbortError';
      reject(error);
    }, { once: true });
  });
}

async function successfulResponse(data) {
  await new Promise((resolve) => setTimeout(resolve, 5));
  return { ok: true, status: 200, json: async () => data };
}

global.window = {
  dispatchEvent(event) { events.push(event.type); },
};
global.localStorage = localStorage;
global.CustomEvent = class CustomEvent {
  constructor(type, init = {}) {
    this.type = type;
    this.detail = init.detail;
  }
};
global.Event = class Event {
  constructor(type) {
    this.type = type;
  }
};
global.URL = URL;
global.fetch = async (url, options = {}) => {
  const textUrl = String(url);
  if (textUrl.includes('/auth/v1/token?grant_type=password')) {
    tokenCalls += 1;
    assert.equal(textUrl, 'https://runtimeproject.supabase.co/auth/v1/token?grant_type=password');
    assertAnonAuthRequest(textUrl, options);
    const body = JSON.parse(options.body || '{}');
    assert.equal(body.email, 'student@example.com');
    assert.equal(body.password, 'secret-password');
    if (fetchMode === 'timeout-login') return abortableHang(options.signal);
    return successfulResponse(fakeSession);
  }
  if (textUrl.includes('/auth/v1/signup')) {
    signupCalls += 1;
    assert.equal(textUrl, 'https://runtimeproject.supabase.co/auth/v1/signup');
    assertAnonAuthRequest(textUrl, options);
    const body = JSON.parse(options.body || '{}');
    assert.equal(body.email, 'new@example.com');
    assert.equal(body.password, 'secret-password');
    if (fetchMode === 'timeout-signup') return abortableHang(options.signal);
    return successfulResponse({ ...fakeSession, user: fakeSession.user });
  }
  if (textUrl === '/__auth/bootstrap') {
    bootstrapCalls += 1;
    assert.equal(options.headers.Authorization, `Bearer ${fakeSession.access_token}`);
    assert.ok(options.signal instanceof AbortSignal);
    if (fetchMode === 'timeout-bootstrap') return abortableHang(options.signal);
    return successfulResponse({
      ok: true,
      user_id: fakeSession.user.id,
      onboarding_completed: true,
      profile: { email: fakeSession.user.email },
    });
  }
  throw new Error(`Unexpected fetch: ${textUrl}`);
};

vm.runInThisContext(source, { filename: 'public/auth-bridge.js' });

assert.equal(typeof window.__isoLogin, 'function');
assert.equal(typeof window.__isoUp, 'function');

// The bridge is loaded before server-injected globals in index.html. Prove it
// reads Supabase config lazily at login/signup time, not only at script load.
window.__ISO_SUPA_URL__ = 'https://runtimeproject.supabase.co';
window.__ISO_ANON__ = 'runtime.anon.jwt';
window.__ISO_AUTH_DEADLINE_MS__ = 25;
assert.equal(window.__ISO_AUTH_BRIDGE__.project_ref, 'runtimeproject');

const loginPromise = window.__isoLogin('STUDENT@example.com', 'secret-password');
const duplicateLoginPromise = window.__isoLogin('student@example.com', 'secret-password');
const signupPromise = window.__isoUp('new@example.com', 'secret-password');
const duplicateSignupPromise = window.__isoUp('NEW@example.com', 'secret-password');
assert.strictEqual(loginPromise, duplicateLoginPromise);
assert.strictEqual(signupPromise, duplicateSignupPromise);

const [login, duplicateLogin, signup, duplicateSignup] = await Promise.all([
  loginPromise,
  duplicateLoginPromise,
  signupPromise,
  duplicateSignupPromise,
]);
assert.equal(login.ok, true);
assert.equal(login.success, true);
assert.equal(login.onboarding_completed, true);
assert.strictEqual(login, duplicateLogin);
assert.equal(signup.ok, true);
assert.equal(signup.success, true);
assert.strictEqual(signup, duplicateSignup);

const ref = 'runtimeproject';
for (const key of [
  'isotope-auth-token',
  `sb-${ref}-auth-token`,
  'isotope-last-jwt',
  'isotope-last-rt',
  'isotope-last-session-raw',
]) {
  assert.ok(localStorage.getItem(key), `${key} was not written`);
}

assert.equal(localStorage.getItem('isotope-last-jwt'), fakeSession.access_token);
assert.equal(localStorage.getItem('isotope-last-rt'), fakeSession.refresh_token);
assert.ok(events.includes('isotope:auth-session'));
assert.ok(events.includes('isotope:auth-unblock'));
assert.ok(events.includes('isotope:sync_refresh'));

assert.equal(tokenCalls, 1);
assert.equal(signupCalls, 1);
assert.equal(bootstrapCalls, 1);

fetchMode = 'timeout-login';
const timedOutLogin = await window.__isoLogin('student@example.com', 'secret-password');
assert.deepEqual(timedOutLogin, {
  ok: false,
  success: false,
  err: 'Request timed out.',
});

fetchMode = 'timeout-signup';
const timedOutSignup = await window.__isoUp('new@example.com', 'secret-password');
assert.deepEqual(timedOutSignup, {
  ok: false,
  success: false,
  err: 'Request timed out.',
});

fetchMode = 'timeout-bootstrap';
const loginWithTimedOutBootstrap = await window.__isoLogin('student@example.com', 'secret-password');
assert.equal(loginWithTimedOutBootstrap.ok, true);
assert.equal(loginWithTimedOutBootstrap.success, true);
assert.equal(loginWithTimedOutBootstrap.bootstrap, null);

assert.equal(tokenCalls, 3);
assert.equal(signupCalls, 2);
assert.equal(bootstrapCalls, 2);

console.log('PASS auth bridge deadlines, single-flight, globals, and session storage');
