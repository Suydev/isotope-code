import assert from 'node:assert/strict';
import https from 'node:https';
import { PassThrough, Readable } from 'node:stream';

const anonKey = makeJwt({ iss: 'supabase', role: 'anon' });
const serviceKey = makeJwt({ iss: 'supabase', role: 'service_role' });
const userJwt = makeJwt({
  iss: 'https://security-test.supabase.co/auth/v1',
  role: 'authenticated',
  sub: '11111111-1111-4111-8111-111111111111',
});
const geminiSecret = 'gemini-regression-secret-value';
const groqSecret = 'groq-regression-secret-value';

process.env.ISOTOPE_TEST_MODE = '1';
process.env.SUPABASE_URL = 'https://security-test.supabase.co';
process.env.SUPABASE_ANON_KEY = anonKey;
process.env.SUPABASE_SERVICE_ROLE_KEY = serviceKey;
process.env.ENABLE_ADMIN_MODE = 'true';
process.env.ADMIN_SECRET = 'admin-regression-secret';
process.env.GEMINI_API_KEY = geminiSecret;
process.env.GROQ_API_KEY = groqSecret;

const {
  bindHost,
  buildSupabaseProxyHeaders,
  injectScripts,
  isAdminMutationOriginAllowed,
  isCorsOriginAllowed,
  resolveSupabaseProxyTarget,
  server,
} = await import('../server.mjs');

assert.equal(bindHost, '127.0.0.1', 'the default bind host must be loopback');

const anonymousHeaders = buildSupabaseProxyHeaders({
  apikey: serviceKey,
  'x-admin-secret': process.env.ADMIN_SECRET,
});
assert.equal(anonymousHeaders.apikey, anonKey, 'anonymous proxy traffic must use the anon apikey');
assert.equal(anonymousHeaders.authorization, `Bearer ${anonKey}`, 'anonymous proxy traffic must use anon authorization');
assert.equal(anonymousHeaders['x-admin-secret'], undefined, 'admin credentials must not be forwarded upstream');

const userHeaders = buildSupabaseProxyHeaders({
  authorization: `Bearer ${userJwt}`,
  apikey: serviceKey,
});
assert.equal(userHeaders.apikey, anonKey, 'authenticated proxy traffic must still use the anon apikey');
assert.equal(userHeaders.authorization, `Bearer ${userJwt}`, 'authenticated proxy traffic must preserve the user JWT');

assert.throws(
  () => buildSupabaseProxyHeaders({ authorization: `Bearer ${serviceKey}` }),
  /Service-role credentials are not accepted/,
  'the general proxy must reject service-role bearer credentials'
);
assert.equal(
  resolveSupabaseProxyTarget('/__supa/rest/v1/profiles?select=id', 'GET'),
  '/rest/v1/profiles?select=id'
);
assert.throws(
  () => resolveSupabaseProxyTarget('/__supa/auth/v1/admin/users', 'GET'),
  /path is not allowed/
);

const html = injectScripts('<!doctype html><html><head></head><body></body></html>');
assert.doesNotMatch(html, new RegExp(escapeRegExp(geminiSecret)), 'served HTML must not contain the Gemini key');
assert.doesNotMatch(html, new RegExp(escapeRegExp(groqSecret)), 'served HTML must not contain the Groq key');
assert.doesNotMatch(html, /window\.__IK__/, 'served HTML must not expose the former browser key bridge');
const authHtml = injectScripts(
  '<!doctype html><html><head></head><body></body></html>',
  '/auth',
);
assert.match(authHtml, /window\.__ISO_SUPA_URL__/, 'auth HTML must retain public Supabase configuration');
assert.doesNotMatch(authHtml, /__isoAutoSync/, 'auth HTML must not include app-only sync runtime');
assert.doesNotMatch(authHtml, /_handleLeaderboard/, 'auth HTML must not include leaderboard compatibility code');
assert.ok(Buffer.byteLength(authHtml) < 10 * 1024, 'auth HTML injection must remain below 10 KB');

const sameOriginReq = {
  headers: { host: '127.0.0.1:3000', origin: 'http://127.0.0.1:3000' },
  socket: {},
};
const hostileOriginReq = {
  headers: { host: '127.0.0.1:3000', origin: 'https://attacker.example' },
  socket: {},
};
assert.equal(isCorsOriginAllowed(sameOriginReq), true, 'same-origin local requests must remain allowed');
assert.equal(isCorsOriginAllowed(hostileOriginReq), false, 'arbitrary origins must not receive CORS access');
assert.equal(isAdminMutationOriginAllowed({
  method: 'POST',
  headers: { host: '127.0.0.1:3000', origin: 'http://127.0.0.1:3000' },
  socket: {},
}), true, 'same-origin browser admin mutations must remain allowed');
assert.equal(isAdminMutationOriginAllowed({
  method: 'POST',
  headers: { host: '127.0.0.1:3000', origin: 'https://attacker.example' },
  socket: {},
}), false, 'cross-site browser admin mutations must be blocked');
assert.equal(isAdminMutationOriginAllowed({
  method: 'POST',
  headers: { host: '127.0.0.1:3000', 'x-admin-secret': process.env.ADMIN_SECRET },
  socket: {},
}), true, 'explicit CLI admin authentication must not require a browser Origin');

await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(0, '127.0.0.1', resolve);
});
try {
  const address = server.address();
  const base = `http://127.0.0.1:${address.port}`;

  const rootResponse = await fetch(base + '/', { headers: { Origin: base } });
  assert.equal(rootResponse.status, 200);
  assert.equal(rootResponse.headers.get('access-control-allow-origin'), base);
  const servedHtml = await rootResponse.text();
  assert.equal(servedHtml.includes(geminiSecret), false, 'actual served HTML must not contain the Gemini key');
  assert.equal(servedHtml.includes(groqSecret), false, 'actual served HTML must not contain the Groq key');

  const hostileResponse = await fetch(base + '/', {
    headers: { Origin: 'https://attacker.example' },
  });
  assert.equal(hostileResponse.status, 200, 'ordinary same-site serving behavior should remain intact');
  assert.equal(hostileResponse.headers.get('access-control-allow-origin'), null);

  const hostilePreflight = await fetch(base + '/__supa/rest/v1/profiles', {
    method: 'OPTIONS',
    headers: {
      Origin: 'https://attacker.example',
      'Access-Control-Request-Method': 'GET',
    },
  });
  assert.equal(hostilePreflight.status, 403);
  assert.equal(hostilePreflight.headers.get('access-control-allow-origin'), null);

  const querySecret = await fetch(base + '/__admin/verify?secret=' + encodeURIComponent(process.env.ADMIN_SECRET), {
    redirect: 'manual',
  });
  assert.equal(querySecret.status, 200, 'unauthenticated admin GET should show the login page');
  assert.match(await querySecret.text(), /Admin Unlock/, 'admin secrets in URLs must not authenticate');

  const originalHttpsRequest = https.request;
  const capturedRequests = [];
  https.request = (options, callback) => {
    capturedRequests.push(options);
    const request = new PassThrough();
    process.nextTick(() => {
      const response = Readable.from(['[]']);
      response.statusCode = 200;
      response.headers = { 'content-type': 'application/json' };
      callback(response);
    });
    return request;
  };
  try {
    const anonymousProxy = await fetch(base + '/__supa/rest/v1/profiles?select=id');
    assert.equal(anonymousProxy.status, 200);
    assert.equal(capturedRequests[0].headers.apikey, anonKey);
    assert.equal(capturedRequests[0].headers.authorization, `Bearer ${anonKey}`);

    const userProxy = await fetch(base + '/__supa/rest/v1/profiles?select=id', {
      headers: { Authorization: `Bearer ${userJwt}` },
    });
    assert.equal(userProxy.status, 200);
    assert.equal(capturedRequests[1].headers.apikey, anonKey);
    assert.equal(capturedRequests[1].headers.authorization, `Bearer ${userJwt}`);
  } finally {
    https.request = originalHttpsRequest;
  }

  const serviceRoleProxy = await fetch(base + '/__supa/rest/v1/profiles', {
    headers: { Authorization: `Bearer ${serviceKey}` },
  });
  assert.equal(serviceRoleProxy.status, 403);
  assert.match(await serviceRoleProxy.text(), /Service-role credentials are not accepted/);
} finally {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}

console.log('PASS server proxy authority, HTML secret isolation, and CORS policy');

function makeJwt(payload) {
  return [
    encode({ alg: 'HS256', typ: 'JWT' }),
    encode(payload),
    'test-signature',
  ].join('.');
}

function encode(value) {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
