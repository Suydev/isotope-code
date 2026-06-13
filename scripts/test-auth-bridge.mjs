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

function assertAnonAuthRequest(textUrl, options) {
  assert.ok(textUrl.startsWith('https://runtimeproject.supabase.co/'), `unexpected Supabase URL: ${textUrl}`);
  assert.equal(options.method, 'POST');
  assert.equal(options.headers.apikey, 'runtime.anon.jwt');
  assert.equal(options.headers.Authorization, 'Bearer runtime.anon.jwt');
  assert.equal(options.cache, 'no-store');
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
    return { ok: true, status: 200, json: async () => fakeSession };
  }
  if (textUrl.includes('/auth/v1/signup')) {
    signupCalls += 1;
    assert.equal(textUrl, 'https://runtimeproject.supabase.co/auth/v1/signup');
    assertAnonAuthRequest(textUrl, options);
    const body = JSON.parse(options.body || '{}');
    assert.equal(body.email, 'new@example.com');
    assert.equal(body.password, 'secret-password');
    return { ok: true, status: 200, json: async () => ({ ...fakeSession, user: fakeSession.user }) };
  }
  if (textUrl === '/__auth/bootstrap') {
    bootstrapCalls += 1;
    assert.equal(options.headers.Authorization, `Bearer ${fakeSession.access_token}`);
    return {
      ok: true,
      status: 200,
      json: async () => ({
        ok: true,
        user_id: fakeSession.user.id,
        onboarding_completed: true,
        profile: { email: fakeSession.user.email },
      }),
    };
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
assert.equal(window.__ISO_AUTH_BRIDGE__.project_ref, 'runtimeproject');

const login = await window.__isoLogin('STUDENT@example.com', 'secret-password');
assert.equal(login.ok, true);
assert.equal(login.success, true);
assert.equal(login.onboarding_completed, true);

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

const signup = await window.__isoUp('new@example.com', 'secret-password');
assert.equal(signup.ok, true);
assert.equal(signup.success, true);

assert.equal(tokenCalls, 1);
assert.equal(signupCalls, 1);
assert.equal(bootstrapCalls, 2);

console.log('PASS auth bridge globals and session storage');
