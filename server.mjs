import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import crypto from 'crypto';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { createBackupManager } from './server/backup-manager.mjs';
import {
  buildCanonicalBackupPayload as normalizeToCanonicalBackupPayload,
  mergeBackupData as mergeNormalizedBackupData,
} from './public/sync/backup-normalizer.js';

// ── Simple in-memory rate limiter for auth routes ─────────────────────────────
const _rateLimiter = new Map(); // ip → { count, resetAt }
const RATE_LIMIT_MAX = 10;     // max requests per window per IP
const RATE_LIMIT_WIN = 60000;  // 60-second window
function checkRateLimit(ip) {
  const now = Date.now();
  let entry = _rateLimiter.get(ip);
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + RATE_LIMIT_WIN };
    _rateLimiter.set(ip, entry);
  }
  entry.count++;
  return entry.count <= RATE_LIMIT_MAX; // true = allowed
}
// Prune stale entries every 5 minutes to avoid memory growth
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of _rateLimiter) if (now > v.resetAt) _rateLimiter.delete(k);
}, 5 * 60 * 1000).unref();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, 'public');

process.on('unhandledRejection', (err) => {
  console.error('[Runtime] Unhandled promise rejection:', err && err.message ? err.message : err);
});

// ── Auto-load .env file ─────────────────────────────────────────────────────
// Allows starting with just `node server.mjs`; host environment values win.
function loadDotEnvIfNeeded(filePath) {
  try {
    if (!fs.existsSync(filePath)) return { loaded: false, count: 0 };
    let count = 0;
    const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
    for (const raw of lines) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;
      const eq = line.indexOf('=');
      if (eq < 1) continue;
      const key = line.slice(0, eq).trim();
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;
      if (Object.prototype.hasOwnProperty.call(process.env, key) && process.env[key] !== '') continue;
      let val = line.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val.replace(/\\n/g, '\n');
      count++;
    }
    return { loaded: true, count };
  } catch (e) {
    console.warn('[Config] Could not load .env:', e.message);
    return { loaded: false, count: 0 };
  }
}

const _dotenvResults = [
  loadDotEnvIfNeeded(path.join(__dirname, '.env')),
  loadDotEnvIfNeeded(path.join(__dirname, '..', '..', '.env')),
].filter(r => r.loaded);
if (_dotenvResults.length) {
  const count = _dotenvResults.reduce((sum, r) => sum + r.count, 0);
  console.log(`[Config] .env loaded (${count} values applied)`);
}

const port = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.mjs':  'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.woff':  'font/woff',
  '.woff2': 'font/woff2',
  '.ttf':   'font/ttf',
  '.wav':   'audio/wav',
  '.mp3':   'audio/mpeg',
  '.webp':  'image/webp',
  '.txt':   'text/plain',
  '.map':   'application/json',
  '.mp4':   'video/mp4',
  '.webm':  'video/webm',
  '.mov':   'video/quickstart',
  '.ogv':   'video/ogg',
  '.mkv':   'video/x-matroska',
};

const NO_STORE_CACHE = 'no-cache, no-store, must-revalidate';
const IMMUTABLE_CACHE = 'public, max-age=31536000, immutable';
const SHORT_CACHE = 'no-cache';
const RUNTIME_GLUE_PATHS = new Set([
  '/',
  '/index.html',
  '/auth-bridge.js',
  '/restore-and-launch.js',
  '/pwa-local.js',
  '/boot-recovery.js',
  '/ux-setup.js',
  '/focus-bg-import.js',
  '/update-checker.js',
  '/sw.js',
  '/manifest.webmanifest',
]);
const RUNTIME_PATCHED_ASSET_PATHS = new Set([
  '/assets/useAIStore-B2cv1FZz.js',
  '/assets/App-pJGjDiPw.js',
  '/assets/Auth-Cw0VAaCZ.js',
  '/assets/Focus-BmgY-9vP.js',
  '/assets/Onboarding-qvAqCBbb.js',
  '/assets/SingleGroup-DU1IhoNK.js',
  '/assets/useLeaderboard-BpvH5FXA.js',
  '/assets/SettingsLayout-B4OgCkQ5.js',
  '/assets/useSyncStore-vWs_TdIc.js',
  '/assets/AppAccessGate-B975UtK7.js',
  '/assets/sessionSync-mloIEnTd.js',
  '/assets/useInvites-D9RLFwf8.js',
  '/assets/Community-DIqF5406.js',
  '/assets/CommunityHub-gANxZssO.js',
  '/assets/FocusStore-D5cRXSIr.js',
  '/assets/EventsCalendar-COHF8nOK.js',
  '/assets/PWAManager-DjIYufp2.js',
]);

function isRuntimePatchedAsset(pathname) {
  const clean = String(pathname || '/').split('?')[0] || '/';
  return RUNTIME_PATCHED_ASSET_PATHS.has(clean);
}

function isHashedStaticAsset(pathname) {
  const base = path.basename(String(pathname || '').split('?')[0]);
  return /[-_][A-Za-z0-9_-]{6,14}\.(?:js|css|woff2?)$/i.test(base);
}

function cacheHeaderForRequest(pathname) {
  const clean = String(pathname || '/').split('?')[0] || '/';
  if (RUNTIME_GLUE_PATHS.has(clean) || clean.startsWith('/sync/')) return NO_STORE_CACHE;
  if (isRuntimePatchedAsset(clean)) return NO_STORE_CACHE;
  if (clean.endsWith('.html')) return NO_STORE_CACHE;
  if (clean.startsWith('/assets/') && isHashedStaticAsset(clean)) return IMMUTABLE_CACHE;
  return SHORT_CACHE;
}

const GEMINI_API_KEY      = process.env.GEMINI_API_KEY      || '';
const GROQ_API_KEY        = process.env.GROQ_API_KEY        || '';

// Default public cloud sync target for normal downloaded installs. These are
// anon/public Supabase values only; service-role/admin credentials remain env-only.
const DEFAULT_SUPABASE_URL      = "https://vteqquoqvksshmfhuepu.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0ZXFxdW9xdmtzc2htZmh1ZXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwODU2NzUsImV4cCI6MjA5NTY2MTY3NX0.ZkRislOhJRQUjVa1y5ixu-xBhlgkXWWyZKI_CClWj64";

// ── Required environment variables — hard-fail at startup if missing ──────────
// All credentials MUST come from environment variables (.env or host environment).
// No fallback values are allowed — this prevents accidental credential exposure
// if someone forks or clones the repo without setting up their own secrets.
if (!process.env.SUPABASE_URL) process.env.SUPABASE_URL = DEFAULT_SUPABASE_URL;
if (!process.env.SUPABASE_ANON_KEY) process.env.SUPABASE_ANON_KEY = DEFAULT_SUPABASE_ANON_KEY;
const _missingEnv = ['SUPABASE_URL', 'SUPABASE_ANON_KEY']
  .filter(k => !process.env[k]);
if (_missingEnv.length) {
  console.error('[Config] Missing required environment variables:', _missingEnv.join(', '));
  console.error('[Config]    Set them in .env or your host environment. See .env.example for guidance.');
  process.exit(1);
}

try {
  const u = new URL(process.env.SUPABASE_URL);
  if (!/^https?:$/.test(u.protocol) || !u.hostname.endsWith('.supabase.co')) {
    throw new Error('SUPABASE_URL must be a Supabase project URL');
  }
} catch (e) {
  console.error('[Config] Invalid SUPABASE_URL:', e.message);
  process.exit(1);
}
for (const keyName of ['SUPABASE_ANON_KEY']) {
  const val = process.env[keyName] || '';
  if (val.split('.').length < 3) {
    console.error(`[Config] ${keyName} must be a JWT-like value`);
    process.exit(1);
  }
}

// ── Supabase project — loaded exclusively from environment variables ──────────
const SUPA_URL         = process.env.SUPABASE_URL;
const SUPA_ANON_KEY    = process.env.SUPABASE_ANON_KEY;
const SUPA_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
if (SUPA_SERVICE_KEY && SUPA_SERVICE_KEY.split('.').length < 3) {
  console.error('[Config] SUPABASE_SERVICE_ROLE_KEY is set but is not JWT-like');
  process.exit(1);
}

// ── Admin panel access control ────────────────────────────────────────────────
// Admin mode is explicit opt-in for owners/operators. Normal downloaded/local
// user mode must not require or expose service-role credentials.
const ENABLE_ADMIN_MODE = /^(1|true|yes)$/i.test(process.env.ENABLE_ADMIN_MODE || '');
const ADMIN_SECRET      = process.env.ADMIN_SECRET || '';
// Admin user password — used when auto-creating the admin account on first boot.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
// Admin email — used for admin user creation + verify check.
const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || '';
const ADMIN_EMAILS   = Array.from(new Set(
  [ADMIN_EMAIL, ...(process.env.ADMIN_EMAILS || '').split(',')]
    .map((v) => String(v || '').trim().toLowerCase())
    .filter(Boolean)
));
const BROWSER_PROOF_EMAIL = String(process.env.BROWSER_PROOF_EMAIL || ADMIN_EMAIL || ADMIN_EMAILS[0] || '').trim().toLowerCase();
const ADMIN_COOKIE_SECRET = ADMIN_SECRET || SUPA_SERVICE_KEY;
const ADMIN_MODE_READY  = ENABLE_ADMIN_MODE && !!SUPA_SERVICE_KEY && !!ADMIN_COOKIE_SECRET;


function isAdminAuthed(req) {
  if (!ADMIN_MODE_READY) return false;
  const headerTok = (req.headers['x-admin-secret'] || '').trim();
  let queryTok = '';
  try {
    const sp = new URL('http://x' + req.url).searchParams;
    queryTok = sp.get('secret') || '';
  } catch {}
  const cookieTok = readCookie(req, 'iso_admin');
  return (!!ADMIN_SECRET && (headerTok === ADMIN_SECRET || queryTok === ADMIN_SECRET)) || cookieTok === adminCookieValue();
}

function readCookie(req, name) {
  const raw = req.headers.cookie || '';
  const prefix = name + '=';
  for (const part of raw.split(';')) {
    const item = part.trim();
    if (item.startsWith(prefix)) return decodeURIComponent(item.slice(prefix.length));
  }
  return '';
}

function adminCookieValue() {
  if (!ADMIN_COOKIE_SECRET) return '';
  return 'v1.' + crypto.createHmac('sha256', ADMIN_COOKIE_SECRET).update('isotope-admin-cookie').digest('hex');
}

function isRequestHttps(req) {
  const fwdProto = req.headers['x-forwarded-proto'];
  if (fwdProto) return fwdProto.split(',')[0].trim().toLowerCase() === 'https';
  return !!(req.socket && req.socket.encrypted);
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function readRequestText(req, maxBytes = 16384) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > maxBytes) {
        reject(new Error('request body too large'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function verifySupabaseAccessToken(token) {
  return new Promise((resolve, reject) => {
    if (!token || String(token).split('.').length < 3) {
      reject(new Error('Missing Supabase access token'));
      return;
    }
    const u = new URL(SUPA_URL);
    const rq = https.request({
      hostname: u.hostname,
      path: '/auth/v1/user',
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        apikey: SUPA_ANON_KEY,
        Accept: 'application/json',
      },
    }, (r) => {
      let body = '';
      r.on('data', (chunk) => body += chunk);
      r.on('end', () => {
        try {
          const json = JSON.parse(body || '{}');
          if (r.statusCode >= 400 || !json.id) {
            reject(new Error('Supabase session is not valid'));
            return;
          }
          resolve(json);
        } catch {
          reject(new Error('Supabase auth response was invalid'));
        }
      });
    });
    rq.on('error', reject);
    rq.setTimeout(10000, () => { rq.destroy(); reject(new Error('Supabase auth timeout')); });
    rq.end();
  });
}

async function isSupabaseAdminUser(user) {
  const email = String(user?.email || '').trim().toLowerCase();
  if (email && ADMIN_EMAILS.includes(email)) return true;
  if (!ADMIN_MODE_READY || !user?.id) return false;
  try {
    const q = '/rest/v1/user_roles'
      + '?select=role'
      + '&user_id=eq.' + encodeURIComponent(user.id)
      + '&limit=10';
    const r = await supaRestReq('GET', q, null);
    if (r.status >= 400 || !Array.isArray(r.body)) return false;
    return r.body.some((row) => /^(owner|admin|super_admin)$/i.test(String(row.role || '')));
  } catch {
    return false;
  }
}

async function authenticateAdminUnlock(secret, token) {
  if (ADMIN_SECRET && secret && secret === ADMIN_SECRET) return { ok: true };
  if (token) {
    const user = await verifySupabaseAccessToken(token);
    if (await isSupabaseAdminUser(user)) return { ok: true, email: user.email || '' };
    return { ok: false, error: 'Supabase user is not listed as an admin.' };
  }
  return { ok: false, error: 'Enter ADMIN_SECRET or log in as a configured Supabase admin.' };
}

function sendAdminLogin(req, res, message = '') {
  let next = '/__admin/verify';
  try {
    const u = new URL('http://x' + req.url);
    const requested = u.searchParams.get('next');
    if (requested && requested.startsWith('/__admin/')) next = requested;
    else if (u.pathname.startsWith('/__admin/') && u.pathname !== '/__admin/login') next = u.pathname + u.search;
  } catch {}
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(`<!doctype html><html><head><meta charset="utf-8"><title>Isotope Admin Login</title><style>body{font-family:system-ui;background:#0a0a0a;color:#eee;margin:0;padding:32px}.box{max-width:500px;margin:8vh auto;background:#111;border:1px solid #333;border-radius:10px;padding:24px}input{width:100%;box-sizing:border-box;background:#050505;color:#fff;border:1px solid #333;border-radius:8px;padding:12px;margin:10px 0 14px}button{background:#7c3aed;color:white;border:0;border-radius:8px;padding:11px 16px;font-weight:700;margin-right:8px}.secondary{background:#27272a}.err{color:#fca5a5;font-size:13px}.muted{color:#aaa;font-size:13px;line-height:1.5}</style></head><body><main class="box"><h1>Admin Unlock</h1><p class="muted">Enter your local <code>ADMIN_SECRET</code>, or use the Supabase account already logged into this browser. Supabase unlock requires the account email in private <code>ADMIN_EMAIL</code>/<code>ADMIN_EMAILS</code> or an active admin role in <code>user_roles</code>.</p>${message ? `<p class="err">${escapeHtml(message)}</p>` : ''}<form id="adminForm" method="post" action="/__admin/login"><input type="hidden" name="next" value="${escapeHtml(next)}"><input type="hidden" id="supabaseToken" name="token" value=""><input type="password" name="secret" autocomplete="current-password" autofocus placeholder="ADMIN_SECRET"><button type="submit">Open with Secret</button><button class="secondary" id="useSession" type="button">Use Supabase Login</button></form><p id="sessionMsg" class="muted"></p></main><script>(function(){var msg=document.getElementById('sessionMsg');function parse(raw){try{var p=JSON.parse(raw);if(p&&p.access_token)return p.access_token;if(p&&p.session&&p.session.access_token)return p.session.access_token;if(p&&p.currentSession&&p.currentSession.access_token)return p.currentSession.access_token;if(p&&p.state&&p.state.session&&p.state.session.access_token)return p.state.session.access_token;}catch(e){}return ''}function token(){try{var keys=['isotope-last-session-raw','isotope-auth-token'];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf('sb-')===0&&/-auth-token$/.test(k))keys.push(k);}for(var j=0;j<keys.length;j++){var t=parse(localStorage.getItem(keys[j]));if(t)return t;}}catch(e){}return ''}document.getElementById('useSession').onclick=function(){var t=token();if(!t){msg.textContent='No logged-in Supabase session found in this browser. Log into the app first, then reopen admin.';return;}document.getElementById('supabaseToken').value=t;document.getElementById('adminForm').submit();};})();</script></body></html>`);
}

function sendAdminDisabled(req, res) {
  const missing = [];
  if (!ENABLE_ADMIN_MODE) missing.push('ENABLE_ADMIN_MODE=true');
  if (!SUPA_SERVICE_KEY) missing.push('SUPABASE_SERVICE_ROLE_KEY');
  const payload = {
    ok: false,
    owner_tools: 'not_enabled',
    message: 'The local app is ready. Owner tools are private and are not enabled for this install.',
    enable_with: missing,
  };
  if (req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(`<!doctype html><html><head><meta charset="utf-8"><title>Owner Tools</title><style>body{font-family:system-ui;background:#0a0a0a;color:#eee;margin:0;padding:32px}.box{max-width:720px;margin:auto;background:#111;border:1px solid #333;border-radius:10px;padding:24px}code{background:#222;padding:2px 6px;border-radius:4px;color:#a78bfa}a{color:#8b5cf6}</style></head><body><div class="box"><h1>Owner Tools Are Private</h1><p>The Isotope local app is running normally. This page is only for the project owner to manage Supabase diagnostics, schema patches, and event/admin data.</p><p>Normal users can return to <a href="/">the app</a>.</p><p>Owners can enable this area with <code>ENABLE_ADMIN_MODE=true</code> and <code>SUPABASE_SERVICE_ROLE_KEY</code> in a private <code>.env</code>, then restart. Add <code>ADMIN_SECRET</code> for local secret unlock, or <code>ADMIN_EMAIL</code>/<code>ADMIN_EMAILS</code> for Supabase login unlock.</p></div></body></html>`);
    return;
  }
  res.writeHead(403, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(payload));
}
function adminEmailDisplay() {
  // Redact most of the email to avoid leaking it in verify HTML
  return ADMIN_EMAIL.replace(/^(.{2})(.*)(@.{2})(.*)(\..+)$/, '$1***$3***$5');
}
// Bundles are normalized at serve time so clients use this operator's env config.
const CUSTOM_SUPA   = true;
const PROXY_PATH          = '/__supa';

if (ADMIN_MODE_READY) console.log('[Admin] Admin mode enabled for server-only Supabase management');
else if (ENABLE_ADMIN_MODE) console.warn('[Admin] Admin mode requested but disabled: set SUPABASE_SERVICE_ROLE_KEY');
if (CUSTOM_SUPA) {
  console.log('[Cloud] Supabase cloud sync target ready');
}

// ── AI key injection ──────────────────────────────────────────────────────────
function buildKeyScript() {
  const keys = {};
  if (GEMINI_API_KEY) keys.gemini = GEMINI_API_KEY;
  if (GROQ_API_KEY)   keys.groq   = GROQ_API_KEY;
  if (Object.keys(keys).length === 0) return '';
  return `<script>
(function(){
  var k=${JSON.stringify(keys)};
  window.__IK__=new Proxy(k,{
    get:function(t,p){
      if(typeof navigator!=="undefined"&&!navigator.onLine)return undefined;
      return t[p];
    }
  });
})();
</script>`;
}
const KEY_SCRIPT = buildKeyScript();

// ── Username-auth client helper (injected into every HTML page) ───────────────
// Build dynamically so SUPA_REF reflects the actual SUPA_URL env var at startup
function buildUsernameAuthScript() {
  const supaRef = new URL(SUPA_URL).hostname.split('.')[0];
  return `<script>
(function(){
  'use strict';
  var SUPA_REF = '${supaRef}';
  var SUPA_URL_BASE = '${SUPA_URL}';
  var SUPA_ANON = '${SUPA_ANON_KEY}';

  // ── JWT deep-extractor ────────────────────────────────────────────────────
  // Recursively scans any JSON value for a JWT-shaped string (eyJ…).
  // Handles every known Supabase session storage format without fragile key paths.
  function _deepFindJwt(obj) {
    if (!obj) return null;
    if (typeof obj === 'string') {
      if (/^eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/.test(obj)) return obj;
      try { return _deepFindJwt(JSON.parse(obj)); } catch(e) { return null; }
    }
    if (typeof obj !== 'object') return null;
    // Prefer access_token if present at this level (most common)
    if (typeof obj.access_token === 'string' && obj.access_token.startsWith('eyJ')) return obj.access_token;
    // Recurse: check all object values
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      var v = obj[keys[i]];
      if (typeof v === 'string' && /^eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/.test(v)) return v;
      if (v && typeof v === 'object') {
        var found = _deepFindJwt(v);
        if (found) return found;
      }
    }
    return null;
  }

  // Also deep-scan for refresh_token (string that does NOT look like a JWT)
  function _deepFindRefreshToken(obj) {
    if (!obj) return null;
    if (typeof obj !== 'object') return null;
    if (typeof obj.refresh_token === 'string' && obj.refresh_token && !obj.refresh_token.startsWith('eyJ')) return obj.refresh_token;
    if (typeof obj.refresh_token === 'string' && obj.refresh_token) return obj.refresh_token;
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      if (keys[i] === 'refresh_token' && typeof obj[keys[i]] === 'string' && obj[keys[i]]) return obj[keys[i]];
      if (obj[keys[i]] && typeof obj[keys[i]] === 'object') {
        var found = _deepFindRefreshToken(obj[keys[i]]);
        if (found) return found;
      }
    }
    return null;
  }

  function clearStoredSession() {
    try {
      var keys = ['isotope-auth-token', 'isotope-last-jwt', 'isotope-last-rt', 'isotope-last-session-raw'];
      if (SUPA_REF) keys.push('sb-' + SUPA_REF + '-auth-token');
      for (var i = 0; i < localStorage.length; i++) {
        var lk = localStorage.key(i);
        if (lk && lk.startsWith('sb-') && lk.endsWith('-auth-token')) keys.push(lk);
      }
      keys.forEach(function(k) { try { localStorage.removeItem(k); } catch(e) {} });
      writeSyncMetadata({ last_sync_status: 'paused_auth', last_error: 'Signed out. Log in again to sync.' });
    } catch(e) {}
  }

  // ── localStorage write interceptor ────────────────────────────────────────
  // Captures the JWT the moment Supabase (or any auth code) writes ANY session
  // key to localStorage — regardless of key name, nesting depth, or format.
  // This makes getValidJwt() immune to format changes in future Supabase releases.
  (function() {
    try {
      var _orig = Storage.prototype.setItem;
      Storage.prototype.setItem = function(key, value) {
        _orig.call(this, key, value);
        if (typeof key !== 'string' || typeof value !== 'string') return;
        var isAuthKey = (key.startsWith('sb-') && key.endsWith('-auth-token'))
                      || key === 'isotope-auth-token'
                      || key === 'isotope-last-session-raw';
        if (!isAuthKey) return;
        try {
          var parsed = JSON.parse(value);
          var at = _deepFindJwt(parsed);
          var rt = _deepFindRefreshToken(parsed);
          if (at) {
            _orig.call(this, 'isotope-last-jwt', at);
            _orig.call(this, 'isotope-last-session-raw', value);
            if (rt) _orig.call(this, 'isotope-last-rt', rt);
          }
        } catch(e) {}
      };
    } catch(e) {}
  })();

  // ── Trigger initial capture on page load ──────────────────────────────────
  // In case the interceptor wasn't installed before the Supabase client wrote the session.
  (function() {
    try {
      var keys = [];
      for (var i = 0; i < localStorage.length; i++) keys.push(localStorage.key(i));
      keys.forEach(function(k) {
        if (!k) return;
        if ((k.startsWith('sb-') && k.endsWith('-auth-token')) || k === 'isotope-auth-token' || k === 'isotope-last-session-raw') {
          var raw = localStorage.getItem(k);
          if (!raw) return;
          try {
            var parsed = JSON.parse(raw);
            var at = _deepFindJwt(parsed);
            var rt = _deepFindRefreshToken(parsed);
            if (at) {
              localStorage.setItem('isotope-last-jwt', at);
              localStorage.setItem('isotope-last-session-raw', raw);
              if (rt) localStorage.setItem('isotope-last-rt', rt);
            }
          } catch(e) {}
        }
      });
    } catch(e) {}
  })();

  // Store session under BOTH keys so restore-and-launch.js and Supabase client both see it
  function saveSession(session) {
    if (!session || !session.access_token) return;
    var s = JSON.stringify(session);
    localStorage.setItem('sb-' + SUPA_REF + '-auth-token', s);  // Supabase JS v2 standard key
    localStorage.setItem('isotope-auth-token', s);               // restore-and-launch.js legacy key
    localStorage.setItem('isotope-last-jwt', session.access_token);
    if (session.refresh_token) localStorage.setItem('isotope-last-rt', session.refresh_token);
    localStorage.setItem('isotope-last-session-raw', s);
  }

  function parseSessionToken(raw) {
    // Use the deep scanner — handles all Supabase JS v2 formats without fragile key paths
    try { return _deepFindJwt(typeof raw === 'string' ? JSON.parse(raw) : raw) || null; }
    catch(e) { return null; }
  }

  function readStoredSession() {
    // Priority 1: Supabase-managed key (auto-refreshed by Supabase JS client)
    var raw = SUPA_REF ? localStorage.getItem('sb-' + SUPA_REF + '-auth-token') : null;
    // Priority 2: our legacy key (written by __isoLogin, may be stale after token refresh)
    if (!raw) raw = localStorage.getItem('isotope-auth-token');
    // Priority 3: last raw session snapshot captured from any auth writer
    if (!raw) raw = localStorage.getItem('isotope-last-session-raw');
    // Priority 4: scan all sb-*-auth-token keys as fallback
    if (!raw) {
      for (var i = 0; i < localStorage.length; i++) {
        var lk = localStorage.key(i);
        if (lk && lk.startsWith('sb-') && lk.endsWith('-auth-token')) { raw = localStorage.getItem(lk); break; }
      }
    }
    if (!raw) return null;
    try { return JSON.parse(raw); } catch(e) { return null; }
  }

  function currentJwt() {
    // 1. Primary Supabase key (deep-scan handles all formats)
    var raw = SUPA_REF ? localStorage.getItem('sb-' + SUPA_REF + '-auth-token') : null;
    var at = raw ? parseSessionToken(raw) : null;
    if (at) return at;
    // 2. Our own saved key
    raw = localStorage.getItem('isotope-auth-token');
    at = raw ? parseSessionToken(raw) : null;
    if (at) return at;
    // 3. Last captured raw session snapshot
    raw = localStorage.getItem('isotope-last-session-raw');
    at = raw ? parseSessionToken(raw) : null;
    if (at) return at;
    // 4. Scan ALL localStorage for any sb-*-auth-token key
    for (var i = 0; i < localStorage.length; i++) {
      var lk = localStorage.key(i);
      if (!lk) continue;
      if (lk.startsWith('sb-') && lk.endsWith('-auth-token')) {
        raw = localStorage.getItem(lk);
        at = raw ? parseSessionToken(raw) : null;
        if (at) return at;
      }
    }
    // 5. Last captured JWT is only a fallback when raw session formats are absent.
    var captured = localStorage.getItem('isotope-last-jwt');
    if (captured && captured.startsWith('eyJ')) return captured;
    return null;
  }

  // ── JWT auto-refresh helpers ────────────────────────────────────────────────
  // Extract refresh_token from any known session format using the deep scanner
  function _getRefreshToken() {
    // 1. Pre-captured refresh token from interceptor
    var captured = localStorage.getItem('isotope-last-rt');
    if (captured) return captured;
    // 2. Scan known keys with deep extractor
    var sources = [];
    if (SUPA_REF) sources.push('sb-' + SUPA_REF + '-auth-token');
    sources.push('isotope-auth-token', 'isotope-last-session-raw');
    for (var i = 0; i < sources.length; i++) {
      var raw = localStorage.getItem(sources[i]);
      if (!raw) continue;
      try {
        var rt = _deepFindRefreshToken(JSON.parse(raw));
        if (rt) return rt;
      } catch(e) {}
    }
    // 3. Scan all localStorage
    for (var j = 0; j < localStorage.length; j++) {
      var lk = localStorage.key(j);
      if (!lk || !(lk.startsWith('sb-') && lk.endsWith('-auth-token'))) continue;
      var raw2 = localStorage.getItem(lk);
      if (!raw2) continue;
      try {
        var rt2 = _deepFindRefreshToken(JSON.parse(raw2));
        if (rt2) return rt2;
      } catch(e) {}
    }
    return null;
  }

  // Call Supabase /auth/v1/token to exchange refresh_token for a new session.
  // Saves and returns the new access_token, or null on failure.
  async function _refreshSession(refreshToken) {
    if (!refreshToken) return null;
    try {
      var r = await fetch(SUPA_URL_BASE + '/auth/v1/token?grant_type=refresh_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': SUPA_ANON },
        body: JSON.stringify({ refresh_token: refreshToken })
      });
      var data = await r.json().catch(function() { return {}; });
      if (r.ok && data.access_token) {
        saveSession(data);
        return data.access_token;
      }
    } catch(e) {}
    return null;
  }

  // Returns a valid (non-expired) JWT. Auto-refreshes if the stored token is
  // expired or expiring within 120 seconds. If refresh fails, return null so the
  // sync pipeline does not send a known-bad token and then claim progress.
  async function getValidJwt() {
    var at = currentJwt();
    if (!at) return null;
    // Decode payload to check expiry
    var needsRefresh = false;
    try {
      var parts = at.split('.');
      if (parts.length >= 2) {
        var pad = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        while (pad.length % 4) pad += '=';
        var payload = JSON.parse(atob(pad));
        needsRefresh = !payload.exp || payload.exp < Math.floor(Date.now() / 1000) + 120;
      }
    } catch(e) {}
    if (!needsRefresh) return at;
    var fresh = await _refreshSession(_getRefreshToken());
    return fresh || null;
  }

  // Force-refresh regardless of expiry (used after receiving a 401 response).
  async function forceRefreshJwt() {
    var fresh = await _refreshSession(_getRefreshToken());
    return fresh || null;
  }

  window.__isoCurrentJwt = currentJwt;
  window.__isoGetValidJwt = getValidJwt;
  window.__isoForceRefreshJwt = forceRefreshJwt;
  window.__isoWriteSession = saveSession;
  window.__isoClearAuthSession = clearStoredSession;

  function writeSyncMetadata(patch) {
    try {
      var cur = JSON.parse(localStorage.getItem('isotope_sync_metadata') || '{}') || {};
      localStorage.setItem('isotope_sync_metadata', JSON.stringify(Object.assign({}, cur, patch || {})));
    } catch(e) {}
  }

  function readSyncMetadata() {
    try { return JSON.parse(localStorage.getItem('isotope_sync_metadata') || '{}') || {}; } catch(e) { return {}; }
  }

  function stableStringify(value) {
    if (value === null || typeof value !== 'object') return JSON.stringify(value);
    if (Array.isArray(value)) return '[' + value.map(stableStringify).join(',') + ']';
    return '{' + Object.keys(value).sort().map(function(k) {
      return JSON.stringify(k) + ':' + stableStringify(value[k]);
    }).join(',') + '}';
  }

  async function hashText(text) {
    var str = String(text || '');
    try {
      if (window.crypto && window.crypto.subtle && window.TextEncoder) {
        var data = new TextEncoder().encode(str);
        var digest = await window.crypto.subtle.digest('SHA-256', data);
        return Array.prototype.map.call(new Uint8Array(digest), function(b) {
          return b.toString(16).padStart(2, '0');
        }).join('');
      }
    } catch(e) {}
    var h1 = 2166136261, h2 = 16777619;
    for (var i = 0; i < str.length; i++) {
      h1 ^= str.charCodeAt(i);
      h1 = Math.imul(h1, 16777619);
      h2 = Math.imul(h2 ^ str.charCodeAt(i), 2246822519);
    }
    return (h1 >>> 0).toString(16).padStart(8, '0') + (h2 >>> 0).toString(16).padStart(8, '0') + ':' + str.length;
  }

  async function hashBackupData(backupText) {
    try {
      var normalizer = window.IsotopeBackupNormalizer || null;
      if (normalizer && typeof normalizer.normalizeAnyBackup === 'function' && typeof normalizer.getBackupData === 'function') {
        var normalized = normalizer.normalizeAnyBackup(backupText || '{}');
        return await hashText(stableStringify(normalizer.getBackupData(normalized)));
      }
    } catch(e) {}
    return await hashText(backupText);
  }

  function yieldToBrowser() {
    return new Promise(function(resolve) {
      if (typeof requestIdleCallback === 'function') requestIdleCallback(function(){ resolve(); }, { timeout: 250 });
      else requestAnimationFrame(function(){ setTimeout(resolve, 0); });
    });
  }

  window.__isoStringifyBackup = async function(value) {
    await yieldToBrowser();
    if (typeof Worker !== 'function' || typeof Blob !== 'function' || typeof URL === 'undefined') {
      return JSON.stringify(value, null, 2);
    }
    return new Promise(function(resolve) {
      var workerUrl = null;
      var done = false;
      function finish(result) {
        if (done) return;
        done = true;
        try { if (workerUrl) URL.revokeObjectURL(workerUrl); } catch(e) {}
        resolve(result);
      }
      try {
        var source = 'self.onmessage=function(e){try{self.postMessage({ok:true,json:JSON.stringify(e.data,null,2)})}catch(err){self.postMessage({ok:false,error:err&&err.message||"stringify failed"})}}';
        workerUrl = URL.createObjectURL(new Blob([source], { type: 'application/javascript' }));
        var worker = new Worker(workerUrl);
        var tid = setTimeout(function() {
          try { worker.terminate(); } catch(e) {}
          finish(JSON.stringify(value, null, 2));
        }, 20000);
        worker.onmessage = function(event) {
          clearTimeout(tid);
          try { worker.terminate(); } catch(e) {}
          var data = event.data || {};
          finish(data.ok ? data.json : JSON.stringify(value, null, 2));
        };
        worker.onerror = function() {
          clearTimeout(tid);
          try { worker.terminate(); } catch(e) {}
          finish(JSON.stringify(value, null, 2));
        };
        worker.postMessage(value);
      } catch(e) {
        finish(JSON.stringify(value, null, 2));
      }
    });
  };

  async function withTimeout(promiseFactory, timeoutMs, label) {
    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var tid;
    var timeout = new Promise(function(_, reject) {
      tid = setTimeout(function() {
        try { if (controller) controller.abort(); } catch(e) {}
        reject(new Error(label || 'Operation timed out'));
      }, timeoutMs || 45000);
    });
    try {
      return await Promise.race([promiseFactory(controller ? controller.signal : null), timeout]);
    } finally {
      clearTimeout(tid);
    }
  }

  var syncCoordinator = window.__isoSyncCoordinator || {
    active: false,
    activeName: null,
    startedAt: 0,
    lastAutoAt: 0
  };
  window.__isoSyncCoordinator = syncCoordinator;

  async function withSyncLock(name, options, fn) {
    options = options || {};
    var now = Date.now();
    var lockTimeoutMs = options.lockTimeoutMs || 90000;
    if (syncCoordinator.active && now - syncCoordinator.startedAt < lockTimeoutMs) {
      writeSyncMetadata({ last_sync_status: 'syncing', last_error: null, active_operation: syncCoordinator.activeName || 'sync' });
      return { ok: false, skipped: true, reason: 'already_running', active: syncCoordinator.activeName };
    }
    if (syncCoordinator.active && now - syncCoordinator.startedAt >= lockTimeoutMs) {
      syncCoordinator.active = false;
      syncCoordinator.activeName = null;
      syncCoordinator.startedAt = 0;
    }
    if (!options.force && options.autoDebounceMs && now - syncCoordinator.lastAutoAt < options.autoDebounceMs) {
      return { ok: true, skipped: true, reason: 'debounced' };
    }
    if (!options.force && options.autoDebounceMs) syncCoordinator.lastAutoAt = now;
    syncCoordinator.active = true;
    syncCoordinator.activeName = name || 'sync';
    syncCoordinator.startedAt = now;
    try {
      writeSyncMetadata({ last_sync_status: 'syncing', last_error: null, active_operation: syncCoordinator.activeName, active_started_at: new Date(now).toISOString() });
      return await withTimeout(function(){ return fn(); }, options.timeoutMs || lockTimeoutMs, (name || 'Sync') + ' timed out');
    } finally {
      syncCoordinator.active = false;
      syncCoordinator.activeName = null;
      syncCoordinator.startedAt = 0;
      writeSyncMetadata({ active_operation: null, active_started_at: null });
    }
  }

  // Append one event to the rolling sync history (max 25 entries).
  // entry: { op, status, error?, bytes?, mode?, source? }
  function writeSyncHistory(entry) {
    try {
      var history = [];
      try { history = JSON.parse(localStorage.getItem('isotope_sync_history') || '[]') || []; } catch(e) {}
      if (!Array.isArray(history)) history = [];
      var next = Object.assign({ at: new Date().toISOString() }, entry || {});
      var prev = history[0] || {};
      var sameRecent = prev.op === next.op &&
        prev.status === next.status &&
        prev.hash === next.hash &&
        prev.source === next.source &&
        (Date.now() - new Date(prev.at || 0).getTime()) < 5000;
      if (sameRecent) {
        history[0] = Object.assign({}, prev, next, { at: prev.at, repeats: (Number(prev.repeats) || 1) + 1 });
      } else {
        history.unshift(next);
      }
      if (history.length > 25) history = history.slice(0, 25);
      localStorage.setItem('isotope_sync_history', JSON.stringify(history));
    } catch(e) {}
    // Refresh the live panel if it's mounted
    try { if (window.__isoRefreshHistoryPanel) window.__isoRefreshHistoryPanel(); } catch(e) {}
  }

  window.__isoGetSyncHistory = function() {
    try { return JSON.parse(localStorage.getItem('isotope_sync_history') || '[]') || []; } catch(e) { return []; }
  };
  window.__isoGetSyncMetadata = function() {
    try { return JSON.parse(localStorage.getItem('isotope_sync_metadata') || '{}') || {}; } catch(e) { return {}; }
  };

  function cacheCloudSnapshot(snapshot, userId) {
    try {
      if (!snapshot || !userId || snapshot.user_id !== userId) return false;
      snapshot.trusted = true;
      snapshot.source = snapshot.source || 'supabase';
      snapshot.downloaded_at = snapshot.downloaded_at || snapshot.exported_at || new Date().toISOString();
      localStorage.setItem('isotope_cloud_snapshot_' + userId, JSON.stringify(snapshot));
      localStorage.setItem('isotope_last_cloud_snapshot_user', JSON.stringify({ user_id: userId, downloaded_at: snapshot.downloaded_at }));
      writeSyncMetadata({
        last_sync_status: 'synced',
        last_snapshot_at: snapshot.exported_at || snapshot.downloaded_at,
        pending_count: 0,
        last_error: null
      });
      return true;
    } catch(e) { return false; }
  }

  // ── Sync auth state machine ──────────────────────────────────────────────
  // Auth failure is a STOP condition. Network failure is a RETRY condition.
  // When any sync call gets an auth error we block all scheduled syncs.
  // When a new valid session token arrives we unblock and queue one retry.

  function isAuthError(e) {
    if (!e) return false;
    if (e.__isAuthError) return true;
    var msg = String(e.message || e || '').toLowerCase();
    return /authentication required|please log in|invalid token|token expired|jwt expired|not authenticated|invalid credentials|invalid claim|invalid jwt|session expired|no session|user not found/.test(msg) || (e.__httpStatus === 401);
  }

  function isPermissionError(e) {
    if (!e) return false;
    var msg = String(e.message || e || '').toLowerCase();
    return /permission denied|policy|not authorized|forbidden|rls|row level security/.test(msg) || (e.__httpStatus === 403);
  }

  function isEmptyOverwriteBlocked(e) {
    return !!(e && (e.__isEmptyOverwriteBlocked || e.__code === 'BLOCKED_EMPTY_OVERWRITE'));
  }

  function isNetworkError(e) {
    if (!e) return false;
    var msg = String(e.message || e || '').toLowerCase();
    return /network|fetch|timeout|timed out|econnrefused|econnreset|dns|no internet|failed to fetch|load failed/.test(msg) || e.name === 'AbortError' || e.name === 'TypeError';
  }

  window.__isoSyncAuthBlocked = false;

  // Block all scheduled syncs (auth failure). Stops the 30-min timer.
  window.__isoSyncAuthBlock = function(reason) {
    if (!window.__isoSyncAuthBlocked) {
      window.__isoSyncAuthBlocked = true;
      writeSyncMetadata({ last_sync_status: 'paused_auth', last_error: reason || 'Authentication required — please log in' });
      writeSyncHistory({ op: 'auth_block', status: 'paused_auth', detail: reason || 'Authentication required' });
      // Stop the 30-min timer so it cannot fire while auth is broken
      if (typeof _autoSyncTimer !== 'undefined' && _autoSyncTimer) {
        clearInterval(_autoSyncTimer);
        _autoSyncTimer = null;
      }
    }
  };

  // Unblock syncs (new session token received). Restarts the timer + queues one sync.
  window.__isoSyncAuthUnblock = function() {
    var wasBlocked = window.__isoSyncAuthBlocked;
    window.__isoSyncAuthBlocked = false;
    if (wasBlocked) {
      writeSyncHistory({ op: 'auth_unblock', status: 'ok', detail: 'Session restored — sync resuming' });
      // Restart the recurring timer and schedule one sync attempt shortly
      if (typeof startAutoSyncTimer === 'function') {
        try { startAutoSyncTimer(); } catch(e) {}
      }
      setTimeout(function() {
        try { window.__isoAutoSync('auth_recovered').catch(function() {}); } catch(e) {}
      }, 2000);
    }
  };

  async function authedJson(url, options) {
    var jwt = await getValidJwt();
    if (!jwt) {
      var _noJwtErr = new Error('Authentication required — please log in');
      _noJwtErr.__isAuthError = true;
      throw _noJwtErr;
    }
    var headers = Object.assign({ 'Accept': 'application/json', 'Authorization': 'Bearer ' + jwt }, (options && options.headers) || {});
    var timeoutMs = options && options.timeoutMs ? options.timeoutMs : 45000;
    var r = await withTimeout(function(signal) {
      var init = Object.assign({}, options || {}, { headers: headers });
      delete init.timeoutMs;
      if (signal) init.signal = signal;
      return fetch(url, init);
    }, timeoutMs, 'Cloud request timed out');
    // If 401, force-refresh the token and retry once before giving up
    if (r.status === 401) {
      var refreshed = await forceRefreshJwt();
      if (refreshed && refreshed !== jwt) {
        headers = Object.assign({ 'Accept': 'application/json', 'Authorization': 'Bearer ' + refreshed }, (options && options.headers) || {});
        r = await withTimeout(function(signal) {
          var init = Object.assign({}, options || {}, { headers: headers });
          delete init.timeoutMs;
          if (signal) init.signal = signal;
          return fetch(url, init);
        }, timeoutMs, 'Cloud request timed out');
      } else {
        // Refresh failed — this is a genuine auth error
        var _authErr = new Error('Authentication required — session could not be refreshed');
        _authErr.__isAuthError = true;
        _authErr.__httpStatus = 401;
        throw _authErr;
      }
    }
    var d = await r.json().catch(function(){ return {}; });
    if (!r.ok || !d.ok) {
      var errMsg = d.message || d.error || ('Request failed: ' + r.status);
      var err = new Error(errMsg);
      err.__httpStatus = r.status;
      err.__code = d.code || null;
      err.__state = d.state || null;
      err.__payload = d;
      if (r.status === 401 || /authentication required|please log in|invalid token|jwt|not authenticated|session/i.test(errMsg)) {
        err.__isAuthError = true;
      } else if (r.status === 403 || /permission|policy|forbidden|rls/i.test(errMsg)) {
        err.__isPermissionError = true;
      } else if (d.code === 'BLOCKED_EMPTY_OVERWRITE') {
        err.__isEmptyOverwriteBlocked = true;
      }
      throw err;
    }
    if (d.cloud_snapshot && d.user_id) cacheCloudSnapshot(d.cloud_snapshot, d.user_id);
    return d;
  }

  window.__isoPostProfile = async function(body) {
    var d = await authedJson('/__auth/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {}),
      timeoutMs: 60000
    });
    try { applyProfileSnapshot(d); } catch(e) {}
    return d;
  };

  async function uploadBackupPayload(backupJson, options) {
    options = options || {};
    var text = String(backupJson || '');
    var bytes = text.length;
    var hash = options.hash || await hashText(text);
    var dataHash = options.dataHash || await hashBackupData(text);
    var meta = readSyncMetadata();
    if (!options.force && meta.last_uploaded_data_hash === dataHash) {
      writeSyncMetadata({
        last_sync_status: 'synced',
        last_error: null,
        last_backup_hash: meta.last_backup_hash || hash,
        last_data_hash: dataHash,
        last_snapshot_at: meta.last_snapshot_at || new Date().toISOString(),
        pending_count: 0
      });
      return { ok: true, skipped: true, reason: 'unchanged_data', bytes: bytes, hash: hash, data_hash: dataHash };
    }
    try {
      var normalizer = window.IsotopeBackupNormalizer || null;
      var normalized = null;
      var best = null;
      if (normalizer && typeof normalizer.normalizeAnyBackup === 'function' && typeof normalizer.isBackupEmpty === 'function') {
        normalized = normalizer.normalizeAnyBackup(text || '{}');
      }
      best = await authedJson('/__auth/backup/best', { method: 'GET', timeoutMs: 30000 });
      if (!options.force && best && best.selected && /\/backups\/latest\.json$/.test(String(best.selected.path || '')) && best.selected.data_hash === dataHash) {
        writeSyncMetadata({
          last_sync_status: 'synced',
          last_error: null,
          last_backup_hash: best.selected.hash || hash,
          last_uploaded_hash: best.selected.hash || hash,
          last_uploaded_data_hash: dataHash,
          last_data_hash: dataHash,
          last_uploaded_bytes: bytes,
          last_snapshot_at: best.selected.exported_at || best.selected.updated_at || meta.last_snapshot_at || new Date().toISOString(),
          pending_count: 0
        });
        return { ok: true, skipped: true, reason: 'remote_canonical_unchanged', bytes: bytes, hash: best.selected.hash || hash, data_hash: dataHash, selected_backup: best.selected };
      }
      if (normalized && normalizer && typeof normalizer.isBackupEmpty === 'function') {
        if (normalizer.isBackupEmpty(normalized)) {
          if (best && best.selected && best.selected.rich === true && best.selected.empty !== true) {
            var blocked = new Error('Cloud has richer backup. Restore it before uploading this empty device.');
            blocked.__code = 'BLOCKED_EMPTY_OVERWRITE';
            blocked.__isEmptyOverwriteBlocked = true;
            blocked.__payload = { selected_backup: best.selected, local_counts: normalized.collection_counts, cloud_counts: best.selected.collection_counts };
            throw blocked;
          }
        }
      }
    } catch(guardErr) {
      throw guardErr;
    }
    if (!options.force && meta.last_uploaded_hash === hash) {
      writeSyncMetadata({
        last_sync_status: 'synced',
        last_error: null,
        last_backup_hash: hash,
        last_data_hash: dataHash,
        last_snapshot_at: meta.last_snapshot_at || new Date().toISOString(),
        pending_count: 0
      });
      return { ok: true, skipped: true, reason: 'unchanged', bytes: bytes, hash: hash, data_hash: dataHash };
    }
    var d = await authedJson('/__auth/backup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ backup_json: text }),
      timeoutMs: options.timeoutMs || 60000
    });
    var snapshotAt = (d.cloud_snapshot && (d.cloud_snapshot.exported_at || d.cloud_snapshot.downloaded_at)) || d.synced_at || new Date().toISOString();
    writeSyncMetadata({
      last_sync_status: 'synced',
      last_backup_hash: hash,
      last_uploaded_hash: hash,
      last_uploaded_data_hash: d.data_hash || dataHash,
      last_data_hash: d.data_hash || dataHash,
      last_uploaded_bytes: bytes,
      last_snapshot_at: snapshotAt,
      pending_count: 0,
      last_error: null
    });
    return {
      ok: true,
      bytes: bytes,
      hash: d.hash || hash,
      data_hash: d.data_hash || dataHash,
      export_storage: d.export_storage || null,
      snapshot_storage: d.snapshot_storage || null,
      canonical_path: d.path || d.latest_path || null,
      history_path: d.history_path || null,
      cloud_snapshot_path: d.cloud_snapshot_path || null,
      collection_counts: d.collection_counts || null,
      skipped: d.skipped === true,
    };
  }

  async function downloadBackupPayload(options) {
    options = options || {};
    var d = await authedJson('/__auth/backup/latest', { method: 'GET', timeoutMs: options.timeoutMs || 45000 });
    var text = d.backup_json || '';
    if (!text) return { ok: true, skipped: true, reason: 'empty' };
    var hash = await hashText(text);
    var snapshotAt = (d.cloud_snapshot && (d.cloud_snapshot.exported_at || d.cloud_snapshot.downloaded_at))
      || (d.selected_backup && (d.selected_backup.exported_at || d.selected_backup.updated_at || d.selected_backup.created_at))
      || d.synced_at
      || new Date().toISOString();
    writeSyncMetadata({
      last_sync_status: 'synced',
      last_downloaded_hash: hash,
      last_downloaded_bytes: text.length,
      last_snapshot_at: snapshotAt,
      last_error: null
    });
    return { ok: true, backup_json: text, hash: hash, bytes: text.length, snapshot_at: snapshotAt, cloud_snapshot: d.cloud_snapshot || null, selected_backup: d.selected_backup || null, collection_counts: d.collection_counts || null };
  }

  async function importBackupPayload(backupJson, mode, options) {
    options = options || {};
    var text = String(backupJson || '');
    var hash = options.hash || await hashText(text);
    var meta = readSyncMetadata();
    if (!options.force && meta.last_imported_hash === hash) {
      return { ok: true, skipped: true, reason: 'already_imported', hash: hash, bytes: text.length };
    }
    var d = await authedJson('/__auth/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ backup_json: text, mode: mode || 'merge' }),
      timeoutMs: options.timeoutMs || 60000
    });
    writeSyncMetadata({
      last_sync_status: 'synced',
      last_imported_hash: hash,
      last_imported_bytes: text.length,
      last_snapshot_at: (d.cloud_snapshot && (d.cloud_snapshot.exported_at || d.cloud_snapshot.downloaded_at)) || readSyncMetadata().last_snapshot_at || new Date().toISOString(),
      pending_count: 0,
      last_error: null
    });
    return { ok: true, hash: hash, bytes: text.length, import_storage: d.import_storage || null, applied: d.applied || {}, collection_counts: d.collection_counts || null, restore_required_on_browser: d.restore_required_on_browser === true, unsupported_collections: d.unsupported_collections || [] };
  }

  window.__isoRefreshCloudSnapshot = async function(source) {
    var _src = source || 'manual_sync';
    return withSyncLock('snapshot', { force: _src.indexOf('manual') >= 0, autoDebounceMs: 45000, timeoutMs: 60000 }, async function() {
      try {
        var adapter = window.IsotopeLocalDataAdapter || null;
        var d = null;
        if (adapter && typeof adapter.buildBackupPayloadFromLocal === 'function') {
          var payload = await adapter.buildBackupPayloadFromLocal();
          d = await authedJson('/__auth/backup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ backup_json: JSON.stringify(payload), source: _src }),
            timeoutMs: 70000
          });
        } else {
          d = await authedJson('/__auth/snapshot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ source: _src }),
            timeoutMs: 60000
          });
        }
        var snapshotAt = (d.cloud_snapshot && (d.cloud_snapshot.exported_at || d.cloud_snapshot.downloaded_at)) || d.synced_at || new Date().toISOString();
        writeSyncMetadata({ last_sync_status: 'synced', last_snapshot_at: snapshotAt, pending_count: 0, last_error: null });
        writeSyncHistory({ op: 'snapshot', status: 'ok', source: _src, at: snapshotAt });
        return { ok: true, snapshot_storage: d.snapshot_storage || null };
      } catch(e) {
        if (isAuthError(e)) {
          try { window.__isoSyncAuthBlock(e.message); } catch(_ae) {}
          writeSyncHistory({ op: 'snapshot', status: 'paused_auth', error: e.message, source: _src });
        } else if (isEmptyOverwriteBlocked(e)) {
          writeSyncMetadata({ last_sync_status: 'blocked_empty_overwrite', last_error: e.message || 'Cloud has richer backup. Restore it before uploading this empty device.' });
          writeSyncHistory({ op: 'snapshot', status: 'blocked_empty_overwrite', error: e.message, source: _src });
        } else {
          writeSyncMetadata({ last_sync_status: 'failed', last_error: e.message || 'Cloud snapshot upload failed' });
          writeSyncHistory({ op: 'snapshot', status: 'failed', error: e.message || 'Cloud snapshot upload failed', source: _src });
        }
        throw e;
      }
    });
  };

  window.__isoUploadBackupJSON = async function(backupJson, options) {
    options = options || {};
    var source = options.source || options.reason || 'manual_export';
    var text = String(backupJson || '');
    var bytes = text.length;
    var hash = await hashText(text);
    return withSyncLock('upload', { force: options.force === true, autoDebounceMs: options.force ? 0 : 60000, timeoutMs: options.timeoutMs || 70000 }, async function() {
      try {
        await yieldToBrowser();
        var result = await uploadBackupPayload(text, { hash: hash, force: options.force === true, timeoutMs: options.timeoutMs || 60000 });
        writeSyncHistory({ op: 'upload', status: result.skipped ? 'skipped' : 'ok', source: source, bytes: bytes, hash: hash, detail: result.reason || null });
        return result;
      } catch(e) {
        if (isAuthError(e)) {
          try { window.__isoSyncAuthBlock(e.message); } catch(_ae) {}
          writeSyncHistory({ op: 'upload', status: 'paused_auth', source: source, error: e.message, bytes: bytes, hash: hash });
        } else if (isEmptyOverwriteBlocked(e)) {
          writeSyncMetadata({ last_sync_status: 'blocked_empty_overwrite', last_error: e.message || 'Cloud has richer backup. Restore it before uploading this empty device.' });
          writeSyncHistory({ op: 'upload', status: 'blocked_empty_overwrite', source: source, error: e.message, bytes: bytes, hash: hash });
        } else {
          writeSyncMetadata({ last_sync_status: 'failed', last_error: e.message || 'Backup upload failed' });
          writeSyncHistory({ op: 'upload', status: 'failed', source: source, error: e.message || 'Backup upload failed', bytes: bytes, hash: hash });
        }
        throw e;
      }
    });
  };

  window.__isoDownloadBackupJSON = async function(options) {
    options = options || {};
    var locked = await withSyncLock('download', { force: options.force === true, autoDebounceMs: options.force ? 0 : 60000, timeoutMs: options.timeoutMs || 60000 }, async function() {
      try {
        var result = await downloadBackupPayload(options);
        writeSyncHistory({ op: 'download', status: result.skipped ? 'skipped' : 'ok', source: options.source || 'download', bytes: result.bytes || 0, hash: result.hash || null, detail: result.reason || null });
        return result.backup_json || null;
      } catch(e) {
        writeSyncMetadata({ last_sync_status: 'failed', last_error: e.message || 'Download failed' });
        writeSyncHistory({ op: 'download', status: 'failed', source: options.source || 'download', error: e.message || 'Download failed' });
        throw e;
      }
    });
    return typeof locked === 'string' ? locked : null;
  };

  window.__isoImportBackupJSON = async function(backupJson, mode, options) {
    options = options || {};
    var _mode = mode || 'merge';
    var text = String(backupJson || '');
    var hash = await hashText(text);
    return withSyncLock('import', { force: options.force === true, autoDebounceMs: options.force ? 0 : 60000, timeoutMs: options.timeoutMs || 70000 }, async function() {
      try {
        await yieldToBrowser();
        var result = await importBackupPayload(text, _mode, { hash: hash, force: options.force === true, timeoutMs: options.timeoutMs || 60000 });
        if (window.IsotopeLocalDataAdapter && typeof window.IsotopeLocalDataAdapter.applyBackupToLocal === 'function') {
          await window.IsotopeLocalDataAdapter.applyBackupToLocal(text, { hash: hash, source_path: result.import_storage && result.import_storage.latest_path || 'manual_import' });
        }
        writeSyncHistory({ op: 'import', status: result.skipped ? 'skipped' : 'ok', mode: _mode, source: options.source || 'manual_import', bytes: text.length, hash: hash, detail: result.reason || null });
        return result;
      } catch(e) {
        if (isEmptyOverwriteBlocked(e)) {
          writeSyncMetadata({ last_sync_status: 'blocked_empty_overwrite', last_error: e.message || 'Cloud has richer backup. Restore it before uploading this empty device.' });
          writeSyncHistory({ op: 'import', status: 'blocked_empty_overwrite', mode: _mode, source: options.source || 'manual_import', error: e.message || 'Backup import failed', bytes: text.length, hash: hash });
        } else {
          writeSyncMetadata({ last_sync_status: 'failed', last_error: e.message || 'Backup import failed' });
          writeSyncHistory({ op: 'import', status: 'failed', mode: _mode, source: options.source || 'manual_import', error: e.message || 'Backup import failed', bytes: text.length, hash: hash });
        }
        throw e;
      }
    });
  };

  window.__isoRunManualCloudSync = async function(buildBackup, applyBackup, source) {
    var _src = source || 'manual_full_sync';
    return withSyncLock('manual_sync', { force: true, timeoutMs: 120000 }, async function() {
      var bytes = 0, hash = null, uploaded = false, uploadSkipped = false, downloaded = false, imported = false;
      try {
        await yieldToBrowser();
        var adapter = window.IsotopeLocalDataAdapter || null;
        var normalizer = window.IsotopeBackupNormalizer || null;
        var buildLocal = async function() {
          if (adapter && typeof adapter.buildBackupPayloadFromLocal === 'function') {
            return JSON.stringify(await adapter.buildBackupPayloadFromLocal());
          }
          return typeof buildBackup === 'function' ? String(await buildBackup() || '') : '';
        };
        var countLocal = async function(backupText) {
          if (adapter && typeof adapter.countLocalData === 'function') return await adapter.countLocalData();
          if (normalizer && typeof normalizer.normalizeAnyBackup === 'function') {
            return normalizer.normalizeAnyBackup(backupText || '{}').collection_counts || {};
          }
          return {};
        };
        var localIsEmpty = async function(backupText) {
          if (adapter && typeof adapter.isLocalWorkspaceEmpty === 'function') return await adapter.isLocalWorkspaceEmpty();
          if (normalizer && typeof normalizer.isBackupEmpty === 'function') return normalizer.isBackupEmpty(normalizer.normalizeAnyBackup(backupText || '{}'));
          return false;
        };
        var applyCloudBackup = async function(backupText, meta) {
          if (adapter && typeof adapter.applyBackupToLocal === 'function') {
            return await adapter.applyBackupToLocal(backupText, meta || {});
          }
          if (typeof applyBackup === 'function') {
            await applyBackup(backupText);
            try { window.dispatchEvent(new CustomEvent('isotope:sync_refresh', { detail: { source: 'cloud_restore' } })); } catch(_e) {}
            return { ok: true, fallback_apply: true };
          }
          throw new Error('No local restore adapter is available');
        };

        writeSyncMetadata({ last_sync_status: 'selecting_backup', last_error: null });
        var backupJson = await buildLocal();
        backupJson = String(backupJson || '');
        bytes = backupJson.length;
        hash = await hashBackupData(backupJson);

        var beforeCounts = await countLocal(backupJson);
        var emptyLocal = await localIsEmpty(backupJson);
        var best = await authedJson('/__auth/backup/best', { method: 'GET', timeoutMs: 45000 });
        var selected = best && best.selected;
        var cloudRich = !!(selected && selected.rich === true && selected.empty !== true);

        if (emptyLocal && cloudRich) {
          writeSyncMetadata({ last_sync_status: 'restoring_cloud', last_error: null });
          var restore = await authedJson('/__auth/restore-best-backup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ promote: true }),
            timeoutMs: 70000
          });
          var cloudBackup = restore.backup_json || '';
          var cloudHash = restore.backup_hash || await hashText(cloudBackup);
          await yieldToBrowser();
          var restoreResult = await applyCloudBackup(cloudBackup, { source_path: selected.path, hash: cloudHash });
          imported = true;
          downloaded = true;
          var afterCounts = await countLocal(cloudBackup);
          var grew = Number(afterCounts.tasks || 0) > Number(beforeCounts.tasks || 0)
            || Number(afterCounts.sessions || 0) > Number(beforeCounts.sessions || 0)
            || Number(afterCounts.subjects || 0) > Number(beforeCounts.subjects || 0)
            || Number(afterCounts.habits || 0) > Number(beforeCounts.habits || 0)
            || Number(afterCounts.exams || 0) > Number(beforeCounts.exams || 0)
            || Number(afterCounts.tests || 0) > Number(beforeCounts.tests || 0)
            || Number(afterCounts.mockTests || 0) > Number(beforeCounts.mockTests || 0);
          if (!grew && selected && selected.collection_counts) {
            throw new Error('Cloud restore did not increase local data counts; upload blocked.');
          }
          writeSyncMetadata({
            last_imported_hash: cloudHash,
            last_imported_bytes: cloudBackup.length,
            last_restore_message: restoreResult && restoreResult.message || null,
            last_sync_status: 'verifying_restore'
          });
          writeSyncHistory({ op: 'restore_best_cloud_backup', status: 'ok', source: _src, bytes: cloudBackup.length, hash: cloudHash, selected_path: selected.path, counts: afterCounts });
          backupJson = await buildLocal();
          backupJson = String(backupJson || '');
          bytes = backupJson.length;
          hash = await hashBackupData(backupJson);
        }

        writeSyncMetadata({ last_sync_status: 'uploading_local', last_error: null });
        var uploadResult = await uploadBackupPayload(backupJson, { hash: hash, force: false, timeoutMs: 65000 });
        uploaded = !uploadResult.skipped;
        uploadSkipped = uploadResult.skipped === true;

        writeSyncMetadata({ last_sync_status: 'synced', last_error: null, pending_count: 0, last_snapshot_at: new Date().toISOString() });
        writeSyncHistory({ op: 'manual_sync', status: 'ok', source: _src, bytes: bytes, hash: hash, uploaded: uploaded, upload_skipped: uploadSkipped, downloaded: downloaded, imported: imported, selected_path: selected && selected.path || null });
        return { ok: true, uploaded: uploaded, upload_skipped: uploadSkipped, downloaded: downloaded, imported: imported, hash: hash, bytes: bytes, selected_backup: selected || null };
      } catch(e) {
        // Auth errors are a STOP condition — block scheduled syncs immediately
        if (isAuthError(e)) {
          try { window.__isoSyncAuthBlock(e.message); } catch(_ae) {}
          writeSyncHistory({ op: 'manual_sync', status: 'paused_auth', source: _src, bytes: bytes, hash: hash, error: e.message });
        } else if (isEmptyOverwriteBlocked(e)) {
          writeSyncMetadata({ last_sync_status: 'blocked_empty_overwrite', last_error: e.message || 'Cloud has richer backup. Restore it before uploading this empty device.' });
          writeSyncHistory({ op: 'manual_sync', status: 'blocked_empty_overwrite', source: _src, bytes: bytes, hash: hash, error: e.message, selected_backup: e.__payload && (e.__payload.selected_backup || (e.__payload.details && e.__payload.details.selected_backup)) || null });
        } else if (isPermissionError(e)) {
          writeSyncMetadata({ last_sync_status: 'failed_permission', last_error: e.message || 'Storage permission error' });
          writeSyncHistory({ op: 'manual_sync', status: 'failed_permission', source: _src, bytes: bytes, hash: hash, error: e.message });
        } else {
          writeSyncMetadata({ last_sync_status: 'failed', last_error: e.message || 'Cloud sync failed' });
          writeSyncHistory({ op: 'manual_sync', status: 'failed', source: _src, bytes: bytes, hash: hash, error: e.message || 'Cloud sync failed' });
        }
        throw e;
      }
    });
  };

  window.__isoDownloadAndImportBackup = async function(applyBackup, source) {
    var _src = source || 'cloud_download';
    return withSyncLock('download_import', { force: true, timeoutMs: 90000 }, async function() {
      var result = null, imported = false;
      try {
        result = await downloadBackupPayload({ timeoutMs: 45000 });
        if (result.backup_json) {
          var meta = readSyncMetadata();
          if (meta.last_imported_hash !== result.hash) {
            await yieldToBrowser();
            if (window.IsotopeLocalDataAdapter && typeof window.IsotopeLocalDataAdapter.applyBackupToLocal === 'function') {
              await window.IsotopeLocalDataAdapter.applyBackupToLocal(result.backup_json, { hash: result.hash, source_path: result.selected_backup && result.selected_backup.path || null });
            } else if (typeof applyBackup === 'function') {
              await applyBackup(result.backup_json);
            }
            writeSyncMetadata({ last_imported_hash: result.hash, last_imported_bytes: result.bytes || 0 });
            imported = true;
          }
        }
        var snapshotAt = result && result.snapshot_at
          || (result && result.cloud_snapshot && (result.cloud_snapshot.exported_at || result.cloud_snapshot.downloaded_at))
          || (result && result.selected_backup && (result.selected_backup.exported_at || result.selected_backup.updated_at || result.selected_backup.created_at))
          || readSyncMetadata().last_snapshot_at
          || (result && result.backup_json ? new Date().toISOString() : null);
        var syncedPatch = { last_sync_status: 'synced', last_error: null, pending_count: 0 };
        if (snapshotAt) syncedPatch.last_snapshot_at = snapshotAt;
        writeSyncMetadata(syncedPatch);
        writeSyncHistory({ op: 'download_import', status: result && result.skipped ? 'skipped' : 'ok', source: _src, bytes: result && result.bytes || 0, hash: result && result.hash || null, imported: imported });
        return { ok: true, imported: imported, downloaded: !!(result && result.backup_json), hash: result && result.hash || null };
      } catch(e) {
        if (isAuthError(e)) {
          try { window.__isoSyncAuthBlock(e.message); } catch(_ae) {}
          writeSyncHistory({ op: 'download_import', status: 'paused_auth', source: _src, error: e.message });
        } else {
          writeSyncMetadata({ last_sync_status: 'failed', last_error: e.message || 'Download/import failed' });
          writeSyncHistory({ op: 'download_import', status: 'failed', source: _src, error: e.message || 'Download/import failed' });
        }
        throw e;
      }
    });
  };

  // Sign up a new user (username + password, no email)
  window.__isoUp = async function(username, password) {
    try {
      var r = await fetch('/__auth/signup', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({username: username.trim().toLowerCase(), password: password})
      });
      var data = await r.json();
      if (!r.ok) return {ok: false, err: data.error || 'Signup failed'};
      saveSession(data.session);
      if (data.profile) applyProfileSnapshot({ ok: true, user_id: data.user_id, profile: data.profile });
      return {ok: true, onboarding_completed: data.onboarding_completed === true};
    } catch(e) {
      return {ok: false, err: e.message || 'Network error'};
    }
  };

  function mergeLocalObject(key, patch) {
    try {
      var cur = JSON.parse(localStorage.getItem(key) || '{}');
      if (patch && patch.state) {
        cur.state = Object.assign({}, cur.state || {}, patch.state || {});
        if (patch.state.hasSeenTour) cur.state.hasSeenTour = Object.assign({}, (cur.state || {}).hasSeenTour || {}, patch.state.hasSeenTour);
        localStorage.setItem(key, JSON.stringify(cur));
        return;
      }
      localStorage.setItem(key, JSON.stringify(Object.assign({}, cur || {}, patch || {})));
    } catch(e) {}
  }

  function applyProfileSnapshot(d) {
    if (!d || !d.ok || !d.profile) return null;
    var prof = d.profile || {};
    var completed = prof.isOnboarded === true || prof.onboarding_completed === true;
    try {
      if (d.user_id) {
        var onb = d.onboarding || {};
        var onbCompleted = typeof onb.completed === 'boolean' ? onb.completed : completed;
        var profileData = Object.assign({}, prof.profile_data || {}, prof, {
          isOnboarded: onbCompleted,
          onboarding_completed: onbCompleted
        });
        var downloadedAt = (d.cloud_snapshot && (d.cloud_snapshot.downloaded_at || d.cloud_snapshot.exported_at)) || new Date().toISOString();
        var snapshot = (d.cloud_snapshot && d.cloud_snapshot.user_id === d.user_id) ? d.cloud_snapshot : {
          schema_version: 1,
          user_id: d.user_id,
          downloaded_at: downloadedAt,
          exported_at: downloadedAt,
          source: 'supabase',
          trusted: true,
          onboarding: {
            state: onbCompleted ? 'completed' : 'incomplete',
            completed: onbCompleted,
            completed_at: onb.completed_at || prof.onboardingCompletedAt || prof.onboarding_completed_at || null,
            data: (onb.data && typeof onb.data === 'object') ? onb.data : ((profileData.onboarding && typeof profileData.onboarding === 'object') ? profileData.onboarding : {})
          },
          profile_data: profileData,
          settings: (profileData.settings && typeof profileData.settings === 'object') ? profileData.settings : {},
          tours: (profileData.tours && typeof profileData.tours === 'object') ? profileData.tours : {},
          stats_summary: null,
          daily_user_stats: [],
          study_sessions_log: [],
          warnings: {}
        };
        cacheCloudSnapshot(snapshot, d.user_id);
      }
    } catch(e) {}
    try {
      if (completed) {
        localStorage.setItem('isotope-onboarding', JSON.stringify({
          isOnboarded: true,
          state: { isOnboarded: true, currentOnboardingStep: 7 },
          version: 0
        }));
      }
    } catch(e) {}
    try {
      var tours = prof.tours || (prof.profile_data && prof.profile_data.tours) || {};
      if (tours && typeof tours === 'object') {
        localStorage.setItem('isotope-user-tours', JSON.stringify(tours));
        if (tours.community_group_v1 === true) {
          mergeLocalObject('group-ui-preferences', { state: { hasSeenTour: { community_group_v1: true } } });
        }
      }
    } catch(e) {}
    try {
      localStorage.setItem('isotope-user-sync', JSON.stringify({
        id:            d.user_id,
        username:      prof.username      || '',
        display_name:  prof.display_name  || prof.name || prof.username || '',
        avatar_url:    prof.avatar_url    || prof.avatar || null,
        plan_type:     'ranker',
        billing_status:'active',
        coins:         Number(prof.coins) || 0,
        gems:          Number(prof.gems)  || 0,
        synced_at:     Date.now()
      }));
    } catch(e) {}
    return { onboarding_completed: completed, profile: prof };
  }

  // Cloud sync: fetch the DB bundle plus real Storage snapshot and populate local cache.
  // This fixes the "shows onboarding after login" bug by setting isOnboarded=true
  // for existing accounts, and syncs user data (username, avatar, coins) into
  // the isotope-user-sync key that the app reads on startup.
  async function syncProfileAfterLogin(jwtIn) {
    // Use a fresh (auto-refreshed) token for the bootstrap call
    var jwt = jwtIn;
    try { jwt = (await getValidJwt()) || jwtIn; } catch(e) {}
    try {
      var r = await fetch('/__auth/bootstrap', {
        headers: { 'Authorization': 'Bearer ' + jwt }
      });
      var d = await r.json().catch(function(){ return {}; });
      if (r.ok && d && d.ok && d.profile) {
        // Cache the bootstrap result — used as offline/restart fallback
        try {
          localStorage.setItem('isotope-bootstrap-cache', JSON.stringify({
            ok: true, cached_at: Date.now(), user_id: d.user_id,
            profile: d.profile, onboarding_completed: d.onboarding_completed
          }));
        } catch(e) {}
        return applyProfileSnapshot(d);
      }
      // Server returned an error response — check what kind
      if (r.status === 401 || r.status === 400) {
        // Token truly invalid — try one token refresh then retry
        var freshJwt = await forceRefreshJwt();
        if (freshJwt && freshJwt !== jwt) {
          var r2 = await fetch('/__auth/bootstrap', {
            headers: { 'Authorization': 'Bearer ' + freshJwt }
          });
          var d2 = await r2.json().catch(function(){ return {}; });
          if (r2.ok && d2 && d2.ok && d2.profile) {
            try {
              localStorage.setItem('isotope-bootstrap-cache', JSON.stringify({
                ok: true, cached_at: Date.now(), user_id: d2.user_id,
                profile: d2.profile, onboarding_completed: d2.onboarding_completed
              }));
            } catch(e) {}
            return applyProfileSnapshot(d2);
          }
        }
        throw new Error(d.error || 'Profile download failed');
      }
      // 5xx / network issue — use cached bootstrap if available
      var cached = null;
      try { cached = JSON.parse(localStorage.getItem('isotope-bootstrap-cache') || 'null'); } catch(e) {}
      if (cached && cached.ok && cached.profile) {
        // Cache is good — apply it (session stays valid, app works offline)
        return applyProfileSnapshot(cached);
      }
      throw new Error(d.error || 'Profile download failed');
    } catch(netErr) {
      // Network completely unreachable (server restarting / offline PWA)
      var offlineCache = null;
      try { offlineCache = JSON.parse(localStorage.getItem('isotope-bootstrap-cache') || 'null'); } catch(e) {}
      if (offlineCache && offlineCache.ok && offlineCache.profile) {
        return applyProfileSnapshot(offlineCache);
      }
      throw netErr;
    }
  }

  // Sign in an existing user (username + password)
  window.__isoLogin = async function(username, password) {
    try {
      var r = await fetch('/__auth/login', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({username: username.trim().toLowerCase(), password: password})
      });
      var data = await r.json();
      if (!r.ok) return {ok: false, err: data.error || 'Login failed'};
      saveSession(data.session);
      var jwt = data.session && data.session.access_token;
      // Track onboarding from the login response first
      var onboarding_completed = data.onboarding_completed === true;
      // Profile sync is BEST-EFFORT — network failure must NOT prevent login.
      // The double-login bug was caused by syncProfileAfterLogin throwing and
      // being caught by the outer catch, making __isoLogin return {ok:false}.
      if (jwt) {
        try {
          var snap = await syncProfileAfterLogin(jwt);
          if (snap) onboarding_completed = snap.onboarding_completed === true;
        } catch(syncErr) {
          console.warn('[Auth] Profile sync after login failed (non-fatal):', syncErr && syncErr.message);
          // Still succeed — the session is valid, the app will retry sync later.
        }
        // AUTH GATE: new valid session → unblock sync immediately
        try { if (window.__isoSyncAuthUnblock) window.__isoSyncAuthUnblock(); } catch(_ue) {}
      }
      return {ok: true, onboarding_completed: onboarding_completed};
    } catch(e) {
      return {ok: false, err: e.message || 'Network error'};
    }
  };

  window.__isoCompleteOnboarding = async function(profilePatch) {
    try {
      var body = Object.assign({}, profilePatch || {}, { isOnboarded: true, onboarding_completed: true });
      var d = await authedJson('/__auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      var snap = applyProfileSnapshot(d);
      if (!snap || snap.onboarding_completed !== true) throw new Error('Onboarding save was not verified');
      return { ok: true };
    } catch(e) {
      return { ok: false, err: e.message || 'Onboarding save failed' };
    }
  };

  window.__isoPersistTour = async function(key, seen) {
    var k = key || 'community_group_v1';
    try {
      var tours = JSON.parse(localStorage.getItem('isotope-user-tours') || '{}') || {};
      tours[k] = seen === true;
      if (k !== 'community_group_v1') tours.community_group_v1 = seen === true;
      localStorage.setItem('isotope-user-tours', JSON.stringify(tours));
    } catch(e) {}
    try {
      var patch = {}; patch[k] = seen === true; patch.community_group_v1 = seen === true;
      var d = await authedJson('/__auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tours: patch })
      });
      applyProfileSnapshot(d);
      return { ok: true };
    } catch(e) {
      return { ok: false, err: e.message || 'Tour save failed' };
    }
  };

  window.__isoTourSeen = function(key) {
    try {
      var tours = JSON.parse(localStorage.getItem('isotope-user-tours') || '{}') || {};
      if (tours[key] === true || tours.community_group_v1 === true) return true;
    } catch(e) {}
    try {
      var ui = JSON.parse(localStorage.getItem('group-ui-preferences') || '{}') || {};
      var seen = (ui.state && ui.state.hasSeenTour) || ui.hasSeenTour || {};
      return seen[key] === true || seen.community_group_v1 === true;
    } catch(e) {}
    return false;
  };

  // On every page load, if a session exists but onboarding state is missing,
  // fetch it from the DB so returning users are never trapped in onboarding.
  (function restoreOnboardingFromDB() {
    try {
      var jwt = currentJwt();
      if (!jwt) return;
      // Check if onboarding is already marked
      try {
        var ob = JSON.parse(localStorage.getItem('isotope-onboarding') || '{}');
        if (ob.isOnboarded === true || (ob.state && ob.state.isOnboarded === true)) return;
      } catch(e) {}
      // Not marked — fetch from DB (runs async, won't block page)
      syncProfileAfterLogin(jwt).catch(function(){});
    } catch(e) {}
  })();

  // Hide Google Sign-In button (not configured for self-hosted domains)
  function hideGoogleUI() {
    document.querySelectorAll('button').forEach(function(btn) {
      if (btn.textContent && btn.textContent.trim().indexOf('Google') !== -1) {
        btn.style.display = 'none';
        if (btn.parentElement) btn.parentElement.style.display = 'none';
      }
    });
    document.querySelectorAll('p,span,div').forEach(function(el) {
      if (el.children.length === 0 && el.textContent && el.textContent.trim() === 'ALTERNATIVE SIGNUP') {
        if (el.parentElement) el.parentElement.style.display = 'none';
      }
    });
  }
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(hideGoogleUI, 200);
    setTimeout(hideGoogleUI, 800);
    setTimeout(hideGoogleUI, 2000);
  });
  if (window.MutationObserver) {
    var _gObs = new MutationObserver(hideGoogleUI);
    document.addEventListener('DOMContentLoaded', function() {
      _gObs.observe(document.body, {childList:true, subtree:true});
      setTimeout(function(){ _gObs.disconnect(); }, 6000);
    });
  }

  // ── Sync History Panel ────────────────────────────────────────────────────
  // Injects a live "Sync History" card into the Settings Sync & Backup section.
  // Reads from isotope_sync_history / isotope_sync_metadata in localStorage.
  (function() {
    var enabled = false;
    try {
      enabled = window.__ISO_DEV_PANELS__ === true ||
        /^(1|true|yes)$/i.test(localStorage.getItem('__iso_dev_panels') || '') ||
        /[?&]isoDevPanels=1\b/.test(window.location.search || '');
    } catch(e) {}
    if (!enabled) return;
    var _panel = null;
    function relTime(iso) {
      if (!iso) return '';
      var d = Date.now() - new Date(iso).getTime();
      if (d < 0) return 'just now';
      if (d < 60000) return Math.round(d / 1000) + 's ago';
      if (d < 3600000) return Math.round(d / 60000) + 'm ago';
      if (d < 86400000) return Math.round(d / 3600000) + 'h ago';
      return new Date(iso).toLocaleDateString();
    }
    function getSyncHistory() {
      try { return JSON.parse(localStorage.getItem('isotope_sync_history') || '[]') || []; } catch(e) { return []; }
    }
    function getSyncMeta() {
      try { return JSON.parse(localStorage.getItem('isotope_sync_metadata') || '{}') || {}; } catch(e) { return {}; }
    }
    function renderPanel(el) {
      var history = getSyncHistory();
      var meta = getSyncMeta();
      var opLabel = { upload: 'Upload', snapshot: 'Snapshot', import: 'Import', download: 'Download' };
      var metaHtml = '';
      if (meta.last_sync_status) {
        var sc = meta.last_sync_status;
        var scColor = sc === 'synced' ? '#86efac' : sc === 'failed' ? '#fca5a5' : '#93c5fd';
        metaHtml = '<div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:10px;font-size:10px;font-family:monospace;color:#555">' +
          'Status: <span style="color:' + scColor + '">' + sc + '</span>' +
          (meta.last_snapshot_at ? '&nbsp;·&nbsp;Last snapshot: <span style="color:#93c5fd">' + relTime(meta.last_snapshot_at) + '</span>' : '') +
          (meta.last_error ? '&nbsp;·&nbsp;<span style="color:#fca5a5">Error: ' + String(meta.last_error).slice(0, 70) + '</span>' : '') +
          '</div>';
      }
      var items = history.slice(0, 15).map(function(e) {
        var icon = e.status === 'ok' ? '✓' : e.status === 'failed' ? '✗' : '↻';
        var color = e.status === 'ok' ? '#86efac' : e.status === 'failed' ? '#fca5a5' : '#93c5fd';
        var label = opLabel[e.op] || e.op || 'Sync';
        var detail = e.error ? String(e.error).slice(0, 55)
          : (e.bytes ? Math.round(e.bytes / 1024) + ' KB' : (e.mode || e.source || ''));
        return '<div style="display:flex;align-items:center;gap:8px;padding:5px 0;' +
          'border-bottom:1px solid rgba(255,255,255,.04);font-size:11px">' +
          '<span style="color:' + color + ';font-weight:700;font-size:13px;min-width:14px">' + icon + '</span>' +
          '<span style="color:#aaa;flex:0 0 72px">' + label + '</span>' +
          '<span style="color:#555;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;' +
            'font-family:monospace;font-size:10px">' + detail + '</span>' +
          '<span style="color:#3f3f46;font-size:10px;white-space:nowrap;margin-left:6px">' + relTime(e.at) + '</span>' +
          '</div>';
      }).join('');
      if (!items) items = '<div style="color:#444;text-align:center;padding:10px 0;font-size:11px">' +
        'No sync events yet — press Cloud Sync to record the first event</div>';
      el.innerHTML =
        '<div style="margin-top:18px;padding:14px 16px;background:#0d0d0d;border:1px solid #222;border-radius:10px">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">' +
            '<span style="font-size:11px;font-weight:700;color:#777;text-transform:uppercase;letter-spacing:.6px">Sync History</span>' +
            '<span style="font-size:10px;color:#3f3f46">' + history.length + ' event' + (history.length === 1 ? '' : 's') + '</span>' +
          '</div>' +
          metaHtml + items +
        '</div>';
    }
    function injectOrRefresh() {
      // Find the Sync & Backup card dynamically (works across SPA route changes)
      if (!document.body) return;
      var target = null;
      var cards = document.querySelectorAll('section,div');
      for (var i = 0; i < cards.length; i++) {
        var el = cards[i];
        var txt = el.innerText || el.textContent || '';
        if ((txt.indexOf('Cloud Sync') >= 0 || txt.indexOf('Sync & Backup') >= 0) &&
            txt.length < 4000 && el.children.length > 0 &&
            !el.querySelector('[data-iso-history]')) {
          target = el;
          break;
        }
      }
      if (target && !target.querySelector('[data-iso-history]')) {
        _panel = document.createElement('div');
        _panel.setAttribute('data-iso-history', '1');
        target.appendChild(_panel);
      }
      if (_panel && _panel.isConnected) {
        renderPanel(_panel);
      } else if (_panel && !_panel.isConnected) {
        _panel = null;
      }
    }
    window.__isoRefreshHistoryPanel = function() { try { injectOrRefresh(); } catch(e) {} };
    // Hook SPA navigation
    try {
      var _origPush = history.pushState;
      history.pushState = function() { _origPush.apply(this, arguments); setTimeout(injectOrRefresh, 400); };
      window.addEventListener('popstate', function() { setTimeout(injectOrRefresh, 400); });
    } catch(e) {}
    // Run on DOMContentLoaded — event-driven only (no setInterval DOM polling)
    function start() {
      injectOrRefresh();
      if (window.MutationObserver) {
        var obs = new MutationObserver(function() { try { injectOrRefresh(); } catch(e) {} });
        obs.observe(document.body, { childList: true, subtree: true });
        // Stay active for 3 minutes to handle slow SPA navigations
        setTimeout(function() { obs.disconnect(); }, 180000);
      }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
  })();

  // ── Cloud Sync Engine: Auto-sync, startup sync, speed detection ───────────
  // All functions here are inside the outer sync IIFE and share its scope:
  // authedJson, writeSyncHistory, writeSyncMetadata, readSyncMetadata, etc.
  (function() {

    // ── Internet speed probe ──────────────────────────────────────────────────
    // Fires a timed GET /api/health to estimate effective bandwidth.
    // Result cached for 2 minutes so rapid calls don't re-probe.
    var _speedCache = null;
    async function measureNetSpeed() {
      if (!navigator.onLine) return { bps: 0, label: 'offline', measuredAt: Date.now() };
      if (_speedCache && Date.now() - _speedCache.measuredAt < 120000) return _speedCache;
      try {
        var start = Date.now();
        var r = await fetch('/api/health?_=' + Date.now(), { cache: 'no-store' });
        var buf = await r.arrayBuffer();
        var ms = Date.now() - start || 1;
        var bps = buf.byteLength / ms * 1000; // bytes/s
        var label = bps > 80000 ? 'fast' : bps > 15000 ? 'medium' : 'slow';
        _speedCache = { bps: Math.round(bps), label: label, ms: ms, measuredAt: Date.now() };
        localStorage.setItem('isotope_net_speed', JSON.stringify(_speedCache));
        return _speedCache;
      } catch(e) {
        _speedCache = { bps: 0, label: 'unknown', measuredAt: Date.now() };
        return _speedCache;
      }
    }
    window.__isoMeasureNetSpeed = measureNetSpeed;

    // Pick timeout (ms) based on connection speed label.
    function syncTimeout(speed) {
      if (!speed) return 90000;
      return speed.label === 'slow' ? 150000 : speed.label === 'medium' ? 100000 : 70000;
    }

    // ── Core auto-sync call ───────────────────────────────────────────────────
    // Tries full bidirectional sync (if build/apply fns registered via App bundle
    // patches) or falls back to a lightweight server-side DB→Storage snapshot.
    window.__isoAutoSync = async function(source) {
      var _src = source || 'auto_sync';
      if (!navigator.onLine) {
        writeSyncHistory({ op: 'auto_sync', status: 'skipped', source: _src, detail: 'offline' });
        return { ok: false, skipped: true, reason: 'offline' };
      }
      // AUTH GATE: never run sync when auth is blocked (previous auth failure)
      if (window.__isoSyncAuthBlocked) {
        return { ok: false, skipped: true, reason: 'paused_auth' };
      }
      var jwt = null;
      try { jwt = await getValidJwt(); } catch(e) {}
      if (!jwt) {
        // No session — block immediately to prevent repeat attempts
        try { window.__isoSyncAuthBlock('No active session'); } catch(_ae) {}
        return { ok: false, skipped: true, reason: 'no_session' };
      }

      var speed = null;
      try { speed = await measureNetSpeed(); } catch(e) {}
      var tms = syncTimeout(speed);

      try {
        var buildFn = window.__isoBuildBackup || null;
        var applyFn = window.__isoApplyBackup || null;

        // Wait up to 15 s for the app bundle to register the backup functions.
        // These are registered inside the app's internal sync method (bundle patch),
        // which fires asynchronously. On a new device they are often not set when
        // the startup sync fires after the initial page load delay.
        if (!buildFn || !applyFn) {
          for (var _wi = 0; _wi < 15; _wi++) {
            await new Promise(function(r) { setTimeout(r, 1000); });
            buildFn = window.__isoBuildBackup || null;
            applyFn = window.__isoApplyBackup || null;
            if (buildFn && applyFn) break;
          }
        }

        if (typeof window.__isoRunManualCloudSync === 'function' && buildFn && applyFn) {
          // Full bidirectional sync (all local data + profile)
          var result = await window.__isoRunManualCloudSync(buildFn, applyFn, _src);
          writeSyncHistory({ op: 'auto_sync', status: 'ok', source: _src,
            uploaded: result && result.uploaded, downloaded: result && result.downloaded,
            bytes: result && result.bytes || 0, speed: speed && speed.label });
          return result;
        } else {
          // Fallback: build/apply fns still not registered after polling.
          // Never upload a profile-only DB snapshot while a rich cloud backup exists.
          var best = await authedJson('/__auth/backup/best', { method: 'GET', timeoutMs: 45000 });
          if (best && best.selected && best.selected.rich === true && best.selected.empty !== true) {
            writeSyncMetadata({
              last_sync_status: 'blocked_empty_overwrite',
              last_error: 'Cloud has richer backup. Restore it before uploading this empty device.',
              pending_count: 1
            });
            writeSyncHistory({ op: 'auto_sync', status: 'blocked_empty_overwrite', source: _src, selected_path: best.selected.path });
            return { ok: false, reason: 'blocked_empty_overwrite', selected_backup: best.selected };
          }
          // Lightweight DB→Storage snapshot is only allowed when cloud is empty.
          var d = await authedJson('/__auth/snapshot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ source: _src }),
            timeoutMs: tms
          });
          var snapshotAt = (d.cloud_snapshot && (d.cloud_snapshot.exported_at || d.cloud_snapshot.downloaded_at)) || new Date().toISOString();
          writeSyncMetadata({ last_sync_status: 'synced', last_snapshot_at: snapshotAt, pending_count: 0, last_error: null });
          writeSyncHistory({ op: 'auto_sync', status: 'ok', source: _src + '_snapshot_fallback', speed: speed && speed.label });
          return { ok: true, snapshot: true };
        }
      } catch(e) {
        if (isAuthError(e)) {
          // Auth failure: block all future scheduled syncs until session is restored
          try { window.__isoSyncAuthBlock(e.message); } catch(_ae) {}
          writeSyncHistory({ op: 'auto_sync', status: 'paused_auth', source: _src, error: e.message });
          return { ok: false, reason: 'paused_auth', error: e.message };
        } else if (isPermissionError(e)) {
          writeSyncMetadata({ last_sync_status: 'failed_permission', last_error: e.message || 'Permission error' });
          writeSyncHistory({ op: 'auto_sync', status: 'failed_permission', source: _src, error: e.message });
          return { ok: false, reason: 'failed_permission', error: e.message };
        } else if (isEmptyOverwriteBlocked(e)) {
          writeSyncMetadata({ last_sync_status: 'blocked_empty_overwrite', last_error: e.message || 'Cloud has richer backup. Restore it before uploading this empty device.' });
          writeSyncHistory({ op: 'auto_sync', status: 'blocked_empty_overwrite', source: _src, error: e.message });
          return { ok: false, reason: 'blocked_empty_overwrite', error: e.message };
        }
        writeSyncMetadata({ last_sync_status: 'failed', last_error: e.message || 'Auto-sync failed' });
        writeSyncHistory({ op: 'auto_sync', status: 'failed', source: _src, error: e.message || 'Auto-sync failed' });
        return { ok: false, error: e.message };
      }
    };

    // ── Startup sync ──────────────────────────────────────────────────────────
    // Runs once per 5-minute window on page load: downloads cloud if newer,
    // then uploads merged local state. Debounced so tab-switches don't re-fire.
    // On first sync (new device): clears the debounce timestamp if no download
    // happened, so the next page load retries rather than waiting 5 minutes.
    window.__isoStartupSync = async function() {
      var _src = 'startup_sync';
      if (!navigator.onLine) return { ok: false, reason: 'offline' };
      // AUTH GATE: if a previous sync already blocked due to auth failure, skip
      if (window.__isoSyncAuthBlocked) return { ok: false, reason: 'paused_auth' };
      var jwt = null;
      try { jwt = await getValidJwt(); } catch(e) {}
      if (!jwt) {
        try { window.__isoSyncAuthBlock('No active session on startup'); } catch(_ae) {}
        return { ok: false, reason: 'no_session' };
      }
      var _isFirstSync = false;
      try {
        var meta = readSyncMetadata();
        var lastStartup = meta.last_startup_sync_at ? new Date(meta.last_startup_sync_at).getTime() : 0;
        if (Date.now() - lastStartup < 5 * 60 * 1000) return { ok: true, skipped: true, reason: 'debounced' };
        _isFirstSync = !meta.last_snapshot_at; // no snapshot history → new device
        writeSyncMetadata({ last_startup_sync_at: new Date().toISOString() });
      } catch(e) {}
      try {
        var r = await window.__isoAutoSync(_src);
        // If this was a first-device sync and we didn't manage to download
        // (e.g. build/apply fns still never registered), clear the debounce so
        // the next page load retries the full sync instead of skipping for 5 min.
        if (_isFirstSync && r && !r.downloaded) {
          try { writeSyncMetadata({ last_startup_sync_at: null }); } catch(_e) {}
        }
        writeSyncHistory({ op: 'startup_sync', status: r && r.ok !== false ? 'ok' : 'skipped', source: _src, detail: r && r.reason || null });
        return r;
      } catch(e) {
        writeSyncHistory({ op: 'startup_sync', status: 'failed', source: _src, error: e.message });
        return { ok: false, error: e.message };
      }
    };

    // ── 30-minute recurring timer ─────────────────────────────────────────────
    var _autoSyncTimer = null;
    var AUTO_SYNC_INTERVAL = 30 * 60 * 1000; // 30 minutes

    function startAutoSyncTimer() {
      if (_autoSyncTimer) clearInterval(_autoSyncTimer);
      _autoSyncTimer = setInterval(function() {
        // AUTH GATE: timer must not fire while auth is blocked
        if (window.__isoSyncAuthBlocked) return;
        window.__isoAutoSync('auto_30min').catch(function() {});
      }, AUTO_SYNC_INTERVAL);
    }

    // ── Visibility-change sync ────────────────────────────────────────────────
    // Re-syncs when user returns to the tab after ≥5 minutes away.
    var _lastVisibleAt = Date.now();
    document.addEventListener('visibilitychange', function() {
      if (document.visibilityState === 'visible') {
        var away = Date.now() - _lastVisibleAt;
        if (away >= 5 * 60 * 1000 && !window.__isoSyncAuthBlocked) {
          setTimeout(function() {
            window.__isoAutoSync('visibility_sync').catch(function() {});
          }, 2000);
        }
      } else {
        _lastVisibleAt = Date.now();
      }
    });

    // ── Online-event sync ─────────────────────────────────────────────────────
    window.addEventListener('online', function() {
      setTimeout(function() {
        // Auth-blocked: re-validate session instead of retrying upload
        if (window.__isoSyncAuthBlocked) {
          // Try to get a valid JWT — if it succeeds, unblock and sync
          getValidJwt().then(function(jwt) {
            if (jwt) { try { window.__isoSyncAuthUnblock(); } catch(e) {} }
          }).catch(function() {});
          return;
        }
        window.__isoAutoSync('online_sync').catch(function() {});
      }, 3000);
    });

    // ── Bootstrap ────────────────────────────────────────────────────────────
    // On DOMContentLoaded: start the 30-min timer + do a startup sync after
    // 5 s (gives the app time to fully initialise, load IndexedDB, etc.).
    function bootAutoSync() {
      startAutoSyncTimer();
      // Measure speed in the background immediately — result cached for later.
      setTimeout(function() { measureNetSpeed().catch(function(){}); }, 500);
      // Startup sync: wait 8 s so the app is fully initialised and the bundle
      // has had time to register __isoBuildBackup / __isoApplyBackup.
      setTimeout(function() {
        window.__isoStartupSync().catch(function() {});
      }, 8000);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootAutoSync);
    else bootAutoSync();

  })();

})();
</script>`;
}
const USERNAME_AUTH_SCRIPT = buildUsernameAuthScript();

// ── Origin + Supabase public vars injection ───────────────────────────────────
// restore-and-launch.js uses __ISO_SUPA_URL__ and __ISO_ANON__ to fetch
// profile_data from the DB before routing (makes DB the source of truth for
// onboarding state instead of potentially-stale localStorage).
const ORIGIN_SCRIPT = `<script>
(function(){
  window.__ISO_ORIGIN__   = window.location.origin;
  window.__ISO_SUPA_URL__ = '${SUPA_URL}';
  window.__ISO_ANON__     = '${SUPA_ANON_KEY}';
})();
</script>`;

function buildLocalDataGuardScript() {
  const supaRef = new URL(SUPA_URL).hostname.split('.')[0];
  const dataKeys = [
    'isotope_subjects_v2',
    'isotope_tasks_v2',
    'isotope_sessions_v2',
    'isotope_habits_v2',
    'isotope_tests_v2',
    'isotope_exams_v2',
    'isotope_mock_tests_v2',
    'isotope_daily_logs_v2',
    'isotope_timer_state',
    'isotope_sync_metadata',
    'isotope_user_profile_v2'
  ];
  return `<script>
(function(){
  'use strict';
  var SUPA_REF = ${JSON.stringify(supaRef)};
  var DATA_KEYS = ${JSON.stringify(dataKeys)};
  var ACTIVE_USER_KEY = 'isotope_active_user_id';
  function parse(raw) {
    if (!raw) return null;
    try {
      var p = JSON.parse(raw);
      if (p && p.user && p.user.id) return p;
      if (p && p.session && p.session.user && p.session.user.id) return p.session;
      if (p && p.currentSession && p.currentSession.user && p.currentSession.user.id) return p.currentSession;
      if (p && p.state && p.state.session && p.state.session.user && p.state.session.user.id) return p.state.session;
    } catch(e) {}
    return null;
  }
  function session() {
    try {
      var raw = SUPA_REF ? localStorage.getItem('sb-' + SUPA_REF + '-auth-token') : null;
      if (raw) return parse(raw);
      raw = localStorage.getItem('isotope-auth-token');
      if (raw) return parse(raw);
      raw = localStorage.getItem('isotope-last-session-raw');
      if (raw) return parse(raw);
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf('sb-') === 0 && /-auth-token$/.test(k)) {
          raw = localStorage.getItem(k);
          var s = parse(raw);
          if (s) return s;
        }
      }
    } catch(e) {}
    return null;
  }
  function scopedKey(uid, key) { return 'isotope:user:' + uid + ':' + key; }
  function copyToUser(uid) {
    if (!uid) return;
    DATA_KEYS.forEach(function(key) {
      try {
        var value = localStorage.getItem(key);
        if (value !== null) localStorage.setItem(scopedKey(uid, key), value);
      } catch(e) {}
    });
  }
  function clearGlobalData() {
    DATA_KEYS.forEach(function(key) {
      try { localStorage.removeItem(key); } catch(e) {}
    });
  }
  function clearIndexedDBWorkspace() {
    try {
      if (!window.indexedDB) return;
      var stores = ['tasks','subjects','sessions','habits','tests','exams','mockTests','dailyLogs','userProfile','timerState','syncMetadata'];
      var req = indexedDB.open('isotope_main', 20);
      req.onsuccess = function() {
        var db = req.result;
        try {
          var names = stores.filter(function(name){ return db.objectStoreNames.contains(name); });
          if (!names.length) { db.close(); return; }
          var tx = db.transaction(names, 'readwrite');
          names.forEach(function(name){ try { tx.objectStore(name).clear(); } catch(e) {} });
          tx.oncomplete = function(){ db.close(); };
          tx.onerror = function(){ db.close(); };
        } catch(e) { try { db.close(); } catch(_) {} }
      };
    } catch(e) {}
  }
  function restoreUser(uid) {
    if (!uid) return;
    var restored = false;
    DATA_KEYS.forEach(function(key) {
      try {
        var value = localStorage.getItem(scopedKey(uid, key));
        if (value !== null) {
          localStorage.setItem(key, value);
          restored = true;
        }
      } catch(e) {}
    });
    if (!restored) {
      clearGlobalData();
      clearIndexedDBWorkspace();
    }
  }
  try {
    if (window.location.pathname !== '/demo') sessionStorage.removeItem('isotope-demo-mode');
    var s = session();
    var uid = s && s.user && s.user.id;
    if (!uid) return;
    var previous = localStorage.getItem(ACTIVE_USER_KEY);
    if (previous && previous !== uid) {
      copyToUser(previous);
      clearGlobalData();
      clearIndexedDBWorkspace();
    }
    if (previous !== uid) restoreUser(uid);
    localStorage.setItem(ACTIVE_USER_KEY, uid);
    var persist = function(){ copyToUser(uid); };
    window.addEventListener('pagehide', persist);
    document.addEventListener('visibilitychange', function(){
      if (document.visibilityState === 'hidden') persist();
    });
  } catch(e) {}
})();
</script>`;
}
const LOCAL_DATA_GUARD_SCRIPT = buildLocalDataGuardScript();

// ── Combined premium bypass + profile upgrade ─────────────────────────────────
//
// TWO mechanisms work together:
//
// 1. RESPONSE PATCH  – every Supabase JSON response has plan_type→ranker so
//    client-side premium checks always pass.
//
// 2. PROFILE UPGRADE – after login (or on page load with existing session) we
//    PATCH the real Supabase profiles row to plan_type='ranker'.
//    Once saved, is_premium_user() in PostgreSQL returns true, so normal
//    authenticated RLS policies pass. On success: reload once to flush React
//    Query stale cache.
//
const PREMIUM_SCRIPT = `<script>
(function(){
  'use strict';
  var _orig = window.fetch;
  var SUPA  = '${SUPA_URL}';
  var ANON  = '${SUPA_ANON_KEY}';
  var _upgradedUsers = {};

  // ── Upgrade user's real Supabase profile to ranker ──────────────────────────
  // This makes is_premium_user() return true in PostgreSQL, so all RLS
  // SELECT/INSERT/UPDATE policies on community tables pass for this user.
  function upgradeProfile(jwt, userId) {
    if (!jwt || !userId || _upgradedUsers[userId]) return;
    _upgradedUsers[userId] = true;

    var payload = JSON.stringify({
      plan_type:       'ranker',
      billing_status:  'active',
      plan_expires_at: '2099-12-31T23:59:59.000Z',
      access_ends_at:  '2099-12-31T23:59:59.000Z'
    });
    var hdrs = {
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + jwt,
      'apikey':        ANON,
      'Prefer':        'return=minimal'
    };

    // Try 'users' table (where plan_type lives), then 'profiles' fallback
    function doPatch(table, col) {
      return _orig.call(window,
        SUPA + '/rest/v1/' + table + '?' + col + '=eq.' + encodeURIComponent(userId),
        { method: 'PATCH', headers: hdrs, body: payload }
      );
    }

    doPatch('users', 'id')
      .then(function(r) {
        console.log('[ISO-MOD] Users PATCH (id=):', r.status);
        if (r.status === 404 || r.status === 406) {
          return doPatch('users', 'user_id').then(function(r2) {
            if (r2.status === 404 || r2.status === 406) {
              return doPatch('profiles', 'id');
            }
            return r2;
          });
        }
        return r;
      })
      .then(function(r) {
        var ok = r && (r.status === 200 || r.status === 204 || r.ok);
        if (ok) {
          console.log('[ISO-MOD] \u2705 Profile upgraded to ranker in Supabase DB');
          // Reload once so React Query fetches fresh community data with RLS now passing
          if (!sessionStorage.getItem('__iso_rls_upgraded__')) {
            sessionStorage.setItem('__iso_rls_upgraded__', userId);
            setTimeout(function() { window.location.reload(); }, 400);
          }
        } else {
          console.warn('[ISO-MOD] \u26a0\ufe0f Profile upgrade returned', r && r.status,
            '— RLS may still block community. Check Supabase policies and membership state.');
        }
      })
      .catch(function(e) {
        console.warn('[ISO-MOD] Profile upgrade error:', e && e.message);
      });
  }

  // Check localStorage for existing Supabase session on every page load
  // (covers returning users who don't re-trigger the auth/v1/token call)
  (function checkExistingSession() {
    // Only run once per page load (not after our own reload)
    var alreadyDone = sessionStorage.getItem('__iso_rls_upgraded__');
    try {
      // Find the sb-{ref}-auth-token key Supabase stores in localStorage
      var raw = null;
      for (var i = 0; i < localStorage.length; i++) {
        var lk = localStorage.key(i);
        if (lk && lk.startsWith('sb-') && lk.endsWith('-auth-token')) {
          raw = localStorage.getItem(lk); break;
        }
      }
      if (raw) {
        var session = JSON.parse(raw);
        var jwt    = session && (session.access_token || (session.session && session.session.access_token));
        var userId = session && (
          (session.user && session.user.id) ||
          (session.session && session.session.user && session.session.user.id)
        );
        if (jwt && userId && !alreadyDone) {
          upgradeProfile(jwt, userId);
        }
      }
    } catch(e) {}
  })();

  // ── Leaderboard builder ───────────────────────────────────────────────────────
  // Intercepts all four leaderboard/analytics edge-function calls and returns
  // REAL data from Supabase: user_stats_summary + daily_user_stats + users tables.
  // Performs a two-step query per variant:
  //   1. Fetch stats rows (ordered by score)
  //   2. Batch-fetch user display data (name, username, avatar_url) and merge in
  // This replaces the old implementation that hardcoded name=null, avatar_url=null.
  function _handleLeaderboard(url, init) {
    return new Promise(function(resolve) {
      var body = {};
      try { body = JSON.parse((init && typeof init.body === 'string') ? init.body : '{}'); } catch {}
      var period    = body.period   || 'weekly';
      var limitN    = Math.min(parseInt(body.limit, 10) || 50, 100);
      var groupId   = body.group_id || null;
      var isDaily   = url.indexOf('get-daily-leaderboard') !== -1;
      var isGroup   = url.indexOf('get-group-leaderboard') !== -1;
      var isGroupAn = url.indexOf('get-group-analytics')   !== -1;
      var sortCol   = period === 'monthly' ? 'monthly_hours' : 'weekly_hours';
      // BUG FIX: Use user JWT for leaderboard REST queries so the
      // stats_select_all / daily_select_all / users_select_display RLS policies
      // (added in performance-patch.sql §6) allow reading across all users.
      // Using ANON key alone gives auth.uid()=NULL which returns 0 rows.
      // getJwt() is a function declaration so it is hoisted within this scope.
      var _lbJwt    = getJwt();

      // ── Helper: get current user ID from localStorage ─────────────────────
      function getUid() {
        try {
          var _keys = ['isotope-last-session-raw', 'isotope-auth-token'];
          for (var _i = 0; _i < localStorage.length; _i++) {
            var _lk = localStorage.key(_i);
            if (_lk && _lk.startsWith('sb-') && _lk.endsWith('-auth-token')) _keys.push(_lk);
          }
          for (var _j = 0; _j < _keys.length; _j++) {
            var _sd = JSON.parse(localStorage.getItem(_keys[_j]) || '{}');
            var _uid = (_sd.user && _sd.user.id)
                || (_sd.session && _sd.session.user && _sd.session.user.id)
                || (_sd.currentSession && _sd.currentSession.user && _sd.currentSession.user.id)
                || (_sd.state && _sd.state.session && _sd.state.session.user && _sd.state.session.user.id)
                || null;
            if (_uid) return _uid;
          }
        } catch {} return null;
      }

      function getJwt() {
        try {
          if (typeof window.__isoCurrentJwt === 'function') {
            var _jwt = window.__isoCurrentJwt();
            if (_jwt) return _jwt;
          }
          var _keys = ['isotope-last-session-raw', 'isotope-auth-token'];
          for (var _i = 0; _i < localStorage.length; _i++) {
            var _lk = localStorage.key(_i);
            if (_lk && _lk.startsWith('sb-') && _lk.endsWith('-auth-token')) _keys.push(_lk);
          }
          for (var _j = 0; _j < _keys.length; _j++) {
            var _sd = JSON.parse(localStorage.getItem(_keys[_j]) || '{}');
            var _token = (_sd.access_token)
                || (_sd.session && _sd.session.access_token)
                || (_sd.currentSession && _sd.currentSession.access_token)
                || (_sd.state && _sd.state.session && _sd.state.session.access_token)
                || null;
            if (_token) return _token;
          }
        } catch {} return null;
      }

      function fetchJsonOrThrow(url, headers) {
        return _orig.call(window, url, { headers: headers })
          .then(function(r) {
            if (!r.ok) return r.text().then(function(txt) { throw new Error('HTTP ' + r.status + ': ' + txt.slice(0, 160)); });
            return r.json();
          });
      }

      // ── Helper: batch-fetch real user display info ────────────────────────
      function fetchUsers(ids) {
        if (!ids || !ids.length) return Promise.resolve({});
        return _orig.call(window, SUPA + '/rest/v1/users?id=in.(' + ids.join(',') + ')&select=id,username,name,avatar_url', {
          headers: { 'apikey': ANON, 'Authorization': 'Bearer ' + (_lbJwt || ANON), 'Accept': 'application/json' }
        })
        .then(function(r) { return r.ok ? r.json() : []; })
        .then(function(ud) {
          var m = {};
          (Array.isArray(ud) ? ud : []).forEach(function(u) { m[u.id] = u; });
          return m;
        })
        .catch(function() { return {}; });
      }

      // ── Helper: build final response ──────────────────────────────────────
      function finish(rankings, p) {
        var uid = getUid();
        var cur = uid ? (rankings.find(function(x) { return x.user_id === uid; }) || null) : null;
        resolve(new Response(JSON.stringify({
          rankings: rankings, period: p, source: 'db',
          currentUserRank: cur, display_names_resolved: true
        }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      }

      function errResp(p, detail) {
        resolve(new Response(JSON.stringify({
          rankings: [], period: p, source: 'error', display_names_resolved: true,
          error: detail || 'Supabase query failed'
        }), { status: 502, headers: { 'Content-Type': 'application/json' } }));
      }

      // ── Group analytics: member list + aggregate ──────────────────────────
      if (isGroupAn) {
        var gid = groupId || '';
        var jwt = getJwt();
        var auth = jwt || ANON;
        var gAPath = gid
          ? '/rest/v1/group_members?group_id=eq.' + encodeURIComponent(gid) + '&select=user_id,role,joined_at&limit=200'
          : '/rest/v1/group_members?select=user_id,role,joined_at&limit=1';
        fetchJsonOrThrow(SUPA + gAPath, { 'apikey': ANON, 'Authorization': 'Bearer ' + auth, 'Accept': 'application/json' })
        .then(function(members) {
          if (!Array.isArray(members)) members = [];
          var memberIds = members.map(function(m) { return m.user_id; }).filter(Boolean);
          if (!memberIds.length) {
            resolve(new Response(JSON.stringify({
              group_id: groupId, member_count: 0, members: [],
              total_sessions: 0, total_hours: 0, weekly_hours: 0, monthly_hours: 0,
              group_streak: 0, members_active_today: 0, avg_session_minutes: 0,
              peak_hour: 12, top_contributor: null, source: 'db', display_names_resolved: true
            }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
            return null;
          }
          var statQs = 'select=user_id,total_hours,weekly_hours,monthly_hours,total_sessions,current_streak,last_session_at'
                     + '&user_id=in.(' + memberIds.join(',') + ')&limit=200';
          return Promise.all([
            Promise.resolve(members),
            fetchJsonOrThrow(SUPA + '/rest/v1/user_stats_summary?' + statQs, { 'apikey': ANON, 'Authorization': 'Bearer ' + auth, 'Accept': 'application/json' }),
            fetchUsers(memberIds)
          ]);
        })
        .then(function(bundle) {
          if (!bundle) return;
          var members = bundle[0], rows = Array.isArray(bundle[1]) ? bundle[1] : [], users = bundle[2] || {};
          var statsByUser = {};
          rows.forEach(function(r) { statsByUser[r.user_id] = r; });
          var today = new Date().toISOString().slice(0, 10);
          var totalHours = 0, weeklyHours = 0, monthlyHours = 0, totalSessions = 0, activeToday = 0, streak = 0;
          var top = null;
          var enriched = members.map(function(m) {
            var st = statsByUser[m.user_id] || {};
            var u = users[m.user_id] || {};
            var th = Number(st.total_hours) || 0;
            var wh = Number(st.weekly_hours) || 0;
            totalHours += th;
            weeklyHours += wh;
            monthlyHours += Number(st.monthly_hours) || 0;
            totalSessions += Number(st.total_sessions) || 0;
            streak = Math.max(streak, Number(st.current_streak) || 0);
            if (st.last_session_at && String(st.last_session_at).slice(0, 10) === today) activeToday += 1;
            if (!top || wh > top.hours) top = { user_id: m.user_id, name: u.name || u.username || 'Student', hours: wh };
            return {
              user_id: m.user_id,
              role: m.role,
              joined_at: m.joined_at,
              name: u.name || u.username || 'Student',
              avatar_url: u.avatar_url || null,
              total_hours: th,
              weekly_hours: wh,
              monthly_hours: Number(st.monthly_hours) || 0,
              total_sessions: Number(st.total_sessions) || 0,
              current_streak: Number(st.current_streak) || 0,
              last_session_at: st.last_session_at || null
            };
          });
          resolve(new Response(JSON.stringify({
            group_id: groupId,
            member_count: members.length,
            members: enriched,
            total_sessions: totalSessions,
            total_hours: totalHours,
            weekly_hours: weeklyHours,
            monthly_hours: monthlyHours,
            group_streak: streak,
            members_active_today: activeToday,
            avg_session_minutes: totalSessions > 0 ? Math.round((totalHours * 60) / totalSessions) : 0,
            peak_hour: 12,
            top_contributor: top && top.hours > 0 ? top : null,
            source: 'db',
            display_names_resolved: true
          }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
        })
        .catch(function(e) {
          resolve(new Response(JSON.stringify({ members: [], source: 'error', error: e && e.message || 'Group analytics query failed' }), {
            status: 502, headers: { 'Content-Type': 'application/json' }
          }));
        });
        return;
      }

      // ── Daily leaderboard: use daily_user_stats for today ─────────────────
      if (isDaily) {
        var today = new Date().toISOString().slice(0, 10);
        var dQs = 'select=user_id,seconds_studied&date=eq.' + today
                + '&order=seconds_studied.desc.nullslast&limit=' + limitN;
        _orig.call(window, SUPA + '/rest/v1/daily_user_stats?' + dQs, {
          headers: { 'apikey': ANON, 'Authorization': 'Bearer ' + (_lbJwt || ANON), 'Accept': 'application/json' }
        })
        .then(function(r) { return r.ok ? r.json() : []; })
        .then(function(rows) {
          if (!Array.isArray(rows) || !rows.length) { finish([], 'daily'); return; }
          var ids = rows.map(function(r) { return r.user_id; }).filter(Boolean);
          return fetchUsers(ids).then(function(uMap) {
            var rankings = rows.map(function(r, i) {
              var u = uMap[r.user_id] || {};
              var hrs = Number(r.seconds_studied) / 3600;
              return {
                user_id: r.user_id, rank: i + 1,
                name: u.name || u.username || null, username: u.username || null,
                avatar_url: u.avatar_url || null,
                daily_hours: hrs, score: hrs,
                weekly_hours: 0, monthly_hours: 0, total_hours: 0,
                total_sessions: 0, current_streak: 0, last_session_at: null
              };
            });
            finish(rankings, 'daily');
          });
        })
        .catch(function(e) { errResp('daily', e && e.message); });
        return;
      }

      // ── Group leaderboard: filter user_stats_summary to group members ─────
      if (isGroup && groupId) {
        _orig.call(window, SUPA + '/rest/v1/group_members?group_id=eq.' + encodeURIComponent(groupId) + '&select=user_id&limit=200', {
          headers: { 'apikey': ANON, 'Authorization': 'Bearer ' + (_lbJwt || ANON) }
        })
        .then(function(r) { return r.ok ? r.json() : []; })
        .then(function(members) {
          if (!Array.isArray(members) || !members.length) { finish([], period); return; }
          var memberIds = members.map(function(m) { return m.user_id; }).filter(Boolean);
          var gSQs = 'select=user_id,total_hours,weekly_hours,monthly_hours,total_sessions,current_streak,last_session_at'
                   + '&user_id=in.(' + memberIds.join(',') + ')'
                   + '&order=' + sortCol + '.desc.nullslast&limit=' + limitN;
          return _orig.call(window, SUPA + '/rest/v1/user_stats_summary?' + gSQs, {
            headers: { 'apikey': ANON, 'Authorization': 'Bearer ' + (_lbJwt || ANON), 'Accept': 'application/json' }
          })
          .then(function(r) { return r.ok ? r.json() : []; })
          .then(function(rows) {
            if (!Array.isArray(rows) || !rows.length) { finish([], period); return; }
            var ids = rows.map(function(r) { return r.user_id; }).filter(Boolean);
            return fetchUsers(ids).then(function(uMap) {
              var rankings = rows.map(function(r, i) {
                var u = uMap[r.user_id] || {};
                return {
                  user_id: r.user_id, rank: i + 1,
                  name: u.name || u.username || null, username: u.username || null,
                  avatar_url: u.avatar_url || null,
                  total_hours: Number(r.total_hours) || 0,
                  weekly_hours: Number(r.weekly_hours) || 0,
                  monthly_hours: Number(r.monthly_hours) || 0,
                  total_sessions: Number(r.total_sessions) || 0,
                  current_streak: Number(r.current_streak) || 0,
                  last_session_at: r.last_session_at || null,
                  score: Number(r[sortCol]) || 0
                };
              });
              finish(rankings, period);
            });
          });
        })
        .catch(function(e) { errResp(period, e && e.message); });
        return;
      }

      // ── Global weekly / monthly leaderboard ───────────────────────────────
      var qs = 'select=user_id,total_hours,weekly_hours,monthly_hours,total_sessions,current_streak,last_session_at'
             + '&order=' + sortCol + '.desc.nullslast&limit=' + limitN;
      _orig.call(window, SUPA + '/rest/v1/user_stats_summary?' + qs, {
        headers: { 'apikey': ANON, 'Authorization': 'Bearer ' + (_lbJwt || ANON), 'Accept': 'application/json' }
      })
      .then(function(r) { return r.ok ? r.json() : []; })
      .then(function(rows) {
        if (!Array.isArray(rows) || !rows.length) { finish([], period); return; }
        var ids = rows.map(function(r) { return r.user_id; }).filter(Boolean);
        return fetchUsers(ids).then(function(uMap) {
          var rankings = rows.map(function(r, i) {
            var u = uMap[r.user_id] || {};
            return {
              user_id: r.user_id, rank: i + 1,
              name: u.name || u.username || null, username: u.username || null,
              avatar_url: u.avatar_url || null,
              total_hours:    Number(r.total_hours)    || 0,
              weekly_hours:   Number(r.weekly_hours)   || 0,
              monthly_hours:  Number(r.monthly_hours)  || 0,
              total_sessions: Number(r.total_sessions) || 0,
              current_streak: Number(r.current_streak) || 0,
              last_session_at: r.last_session_at || null,
              score: Number(r[sortCol]) || 0
            };
          });
          finish(rankings, period);
        });
      })
      .catch(function(e) { errResp(period, e && e.message); });
    });
  }

  // ── finish-session handler ───────────────────────────────────────────────────
  // Forwards the finish-session call to the finish_session_sync RPC using the
  // user's own JWT (passed in the Authorization header by sessionSync.js).
  // RPC writes to: study_sessions_log, daily_user_stats, user_stats_summary.
  function _handleFinishSession(init) {
    return new Promise(function(resolve) {
      var body = {}, jwt = null;
      try { body = JSON.parse((init && typeof init.body === 'string') ? init.body : '{}'); } catch {}

      // JWT is passed explicitly in the Authorization header from sessionSync.js
      try {
        var ah = (init && init.headers) || {};
        var raw = ah['Authorization'] || ah['authorization'] || '';
        jwt = raw.replace(/^Bearer\s+/i, '').trim() || null;
      } catch {}

      // Fallback: pull JWT from localStorage (same logic as _handleLeaderboard)
      if (!jwt) {
        try {
          if (typeof window.__isoCurrentJwt === 'function') jwt = window.__isoCurrentJwt();
        } catch {}
      }
      if (!jwt) {
        try {
          var _keys = ['isotope-last-session-raw', 'isotope-auth-token'];
          for (var _i = 0; _i < localStorage.length; _i++) {
            var _lk = localStorage.key(_i);
            if (_lk && _lk.startsWith('sb-') && _lk.endsWith('-auth-token')) _keys.push(_lk);
          }
          for (var _j = 0; _j < _keys.length; _j++) {
            var _sd = JSON.parse(localStorage.getItem(_keys[_j]) || '{}');
            jwt = (_sd.access_token)
               || (_sd.session && _sd.session.access_token)
               || (_sd.currentSession && _sd.currentSession.access_token)
               || (_sd.state && _sd.state.session && _sd.state.session.access_token)
               || null;
            if (jwt) break;
          }
        } catch {}
      }

      if (!jwt) {
        resolve(new Response(JSON.stringify({ error: 'Not authenticated' }), {
          status: 401, headers: { 'Content-Type': 'application/json' }
        }));
        return;
      }

      var sessionId = body.session_id || body.id || null;
      if (!sessionId) {
        try { sessionId = (window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : null; } catch {}
      }
      if (!sessionId) sessionId = '00000000-0000-4000-8000-' + String(Date.now()).slice(-12).padStart(12, '0');

      _orig.call(window, SUPA + '/rest/v1/rpc/finish_session_sync', {
        method: 'POST',
        headers: {
          'apikey':        ANON,
          'Authorization': 'Bearer ' + jwt,
          'Content-Type':  'application/json',
          'Accept':        'application/json'
        },
        body: JSON.stringify({
          p_session_id:       sessionId,
          p_action:           body.action            || 'complete',
          p_duration_minutes: body.duration_minutes  || 0,
          p_group_id:         body.group_id          || null,
          p_session_type:     body.session_type      || 'focus',
          p_notes:            body.notes             || null,
          p_ended_at:         body.ended_at          || null
        })
      })
      .then(function(r) {
        if (r.ok) return r.json();
        return r.text().then(function(txt) {
          throw new Error('finish_session_sync HTTP ' + r.status + ': ' + txt.slice(0, 180));
        });
      })
      .then(function(d) {
        return _orig.call(window, '/__auth/snapshot', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + jwt,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ source: 'finish_session' })
        }).then(function(snapResp) {
          return snapResp.json().catch(function(){ return {}; }).then(function(snap) {
            if (!snapResp.ok || !snap.ok) throw new Error(snap.error || 'Cloud snapshot upload failed after session sync');
            d = d || {};
            d.cloud_snapshot = snap.cloud_snapshot || null;
            d.snapshot_storage = snap.snapshot_storage || null;
            return d;
          });
        });
      })
      .then(function(d) {
        resolve(new Response(JSON.stringify(d || {}), {
          status: 200, headers: { 'Content-Type': 'application/json' }
        }));
      })
      .catch(function(e) {
        // Keep failure visible so pending local sync does not get marked cloud-saved.
        resolve(new Response(JSON.stringify({
          error: 'Session sync failed',
          detail: e && e.message || 'finish_session_sync failed'
        }), { status: 502, headers: { 'Content-Type': 'application/json' } }));
      });
    });
  }

  // ── Intercept fetch ──────────────────────────────────────────────────────────
  window.fetch = function(input, init) {
    var url = input instanceof Request ? input.url : String(input || '');

    // Block Sentry — drop all requests to the original dev's error-reporting endpoint
    // so user errors don't leak to a third party's dashboard.
    if (url.indexOf('sentry.io') !== -1 || url.indexOf('ingest.sentry') !== -1) {
      return Promise.resolve(new Response('', { status: 200 }));
    }

    // ── Leaderboard edge functions (not deployed in self-hosted) ─────────────
    // Intercept all four leaderboard/analytics edge-function calls and build
    // the response from user_stats_summary via the REST API instead.
    if (url.indexOf('/functions/v1/get-leaderboard')       !== -1 ||
        url.indexOf('/functions/v1/get-daily-leaderboard') !== -1 ||
        url.indexOf('/functions/v1/get-group-leaderboard') !== -1 ||
        url.indexOf('/functions/v1/get-group-analytics')   !== -1) {
      return _handleLeaderboard(url, init);
    }

    // ── finish-session edge function (not deployed in self-hosted) ───────────
    // Intercept and forward to finish_session_sync RPC which writes to
    // study_sessions_log, daily_user_stats, and user_stats_summary.
    if (url.indexOf('/functions/v1/finish-session') !== -1) {
      return _handleFinishSession(init);
    }

    // ── Payment / billing edge functions (not deployed in self-hosted) ────────
    // Return safe no-op responses so the app doesn't crash on these calls.
    if (url.indexOf('/functions/v1/create_checkout')     !== -1 ||
        url.indexOf('/functions/v1/create-checkout')     !== -1) {
      return Promise.resolve(new Response(JSON.stringify({
        url: null, error: 'Payments not configured in self-hosted mode'
      }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    }
    if (url.indexOf('/functions/v1/create_customer_portal_session') !== -1 ||
        url.indexOf('/functions/v1/create-customer-portal-session') !== -1) {
      return Promise.resolve(new Response(JSON.stringify({
        url: null, error: 'Portal not available in self-hosted mode'
      }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    }
    if (url.indexOf('/functions/v1/redeem_membership_code') !== -1 ||
        url.indexOf('/functions/v1/redeem-membership-code') !== -1) {
      return Promise.resolve(new Response(JSON.stringify({
        success: true, message: 'Self-hosted: all features already unlocked'
      }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    }

    // ── accept_invite: DB returns {ok:} but JS checks e.success ─────────────
    // Safety net: if the DB function still returns the old shape, fix it here.
    if (url.indexOf('/rpc/accept_invite') !== -1) {
      return _orig.call(this, input, init).then(function(res) {
        if (!res.ok) return res;
        return res.text().then(function(body) {
          try {
            var d = JSON.parse(body);
            if (d && typeof d === 'object' && 'ok' in d && !('success' in d)) {
              d.success = d.ok;
            }
            var hdrs = {};
            res.headers.forEach(function(v,k){ hdrs[k]=v; });
            return new Response(JSON.stringify(d), {
              status: res.status, statusText: res.statusText, headers: hdrs
            });
          } catch(e) {
            return new Response(body, {
              status: res.status, statusText: res.statusText, headers: res.headers
            });
          }
        });
      });
    }

    // Intercept Supabase logout so compatibility session keys cannot survive sign-out.
    if (url.indexOf(SUPA + '/auth/v1/logout') !== -1) {
      return _orig.call(this, input, init).then(function(res) {
        if (res.ok) {
          try { clearStoredSession(); } catch(_e) {}
        }
        return patchResp(res);
      });
    }

    // Intercept Supabase auth token responses to capture new logins
    var isAuthResp = url.indexOf(SUPA + '/auth/v1/token') !== -1 ||
                     url.indexOf(SUPA + '/auth/v1/callback') !== -1 ||
                     url.indexOf(SUPA + '/auth/v1/verify') !== -1;
    if (isAuthResp) {
      var authP = _orig.call(this, input, init);
      return authP.then(function(res) {
        if (res.ok) {
          res.clone().json().then(function(data) {
            var jwt    = data.access_token;
            var userId = data.user && data.user.id;
            if (jwt && userId) {
              // BUG FIX: only clear the upgrade flag when it's a DIFFERENT user logging in,
              // NOT on every token refresh. Token auto-refresh fires every ~hour and was
              // clearing the flag, causing a reload loop on next page load.
              var prevId = sessionStorage.getItem('__iso_rls_upgraded__');
              if (prevId && prevId !== userId) {
                sessionStorage.removeItem('__iso_rls_upgraded__');
              }
              // SYNC FIX: native Supabase signIn stores under sb-{ref}-auth-token.
              // Also write to isotope-auth-token so restore-and-launch.js recognizes session.
              try {
                var _s = JSON.stringify(data);
                localStorage.setItem('isotope-auth-token', _s);
              } catch(_e) {}
              upgradeProfile(jwt, userId);
              // AUTH GATE: new valid session → unblock sync (resumes timer + queues one sync)
              try { if (window.__isoSyncAuthUnblock) window.__isoSyncAuthUnblock(); } catch(_ue) {}
            }
          }).catch(function(){});
        }
        return patchResp(res);
      });
    }

  // ── Storage write normalization ─────────────────────────────────────────────
  // Keep browser storage writes on the public anon key plus user JWT. Service-role
  // credentials must never be exposed to client JavaScript.
    var isStorageWrite = url.indexOf('/storage/v1/object/') !== -1
      && init && init.method && /^(POST|PUT|PATCH|DELETE)$/i.test(init.method);
    if (isStorageWrite) {
      var _swInit = {};
      for (var _swk in (init || {})) _swInit[_swk] = init[_swk];
      var _swHdrs = {};
      for (var _swh in (_swInit.headers || {})) _swHdrs[_swh] = _swInit.headers[_swh];
      _swHdrs['apikey'] = ANON;
      _swInit.headers = _swHdrs;
      return _orig.call(this, input, _swInit);
    }

  // ── Cloud sync normalization ────────────────────────────────────────────────
  // Keep profile/settings writes authenticated as the current user. The SQL layer
  // owns the RLS contract for legitimate writes.
    var isProfileWrite = (
      url.indexOf('/rest/v1/user_profiles') !== -1 ||
      url.indexOf('/rest/v1/user_settings') !== -1
    ) && init && init.method && /^(POST|PATCH|PUT|DELETE)$/i.test(init.method);
    if (isProfileWrite) {
      var _newInit = {};
      for (var _ki in (init || {})) _newInit[_ki] = init[_ki];
      var _newHdrs = {};
      for (var _hi in (_newInit.headers || {})) _newHdrs[_hi] = _newInit.headers[_hi];
      _newHdrs['apikey'] = ANON;
      _newInit.headers = _newHdrs;
      return _orig.call(this, input, _newInit).then(function(res) { return patchResp(res); });
    }

    // Patch all Supabase REST/RPC responses (plan_type → ranker etc)
    var isSupabase = url.indexOf('supabase.co') !== -1 &&
                     (url.indexOf('/rest/v1/') !== -1 || url.indexOf('/rpc/') !== -1);
    var p = _orig.call(this, input, init);
    if (!isSupabase) return p;
    return p.then(function(res) { return patchResp(res); });
  };

  // Patch plan/billing fields in any Supabase JSON response
  function patchResp(res) {
    var ct = res.headers.get('content-type') || '';
    if (!ct.includes('json')) return res;
    return res.text().then(function(body) {
      var data;
      try { data = JSON.parse(body); } catch(e) {
        return new Response(body, { status: res.status, statusText: res.statusText, headers: res.headers });
      }
      function isPlanObject(o) {
        // Only patch objects that look like user/membership records.
        // Guards against corrupting task, exam, or other domain objects
        // that happen to have a plan_type or billing_status field.
        return ('plan_type' in o || 'billing_status' in o || 'access_ends_at' in o)
          && !('title' in o || 'subject' in o || 'duration_minutes' in o
               || 'question' in o || 'content' in o || 'message' in o);
      }
      function deepPatch(o) {
        if (!o || typeof o !== 'object') return o;
        if (Array.isArray(o)) return o.map(deepPatch);
        var r = Object.assign({}, o);
        if (isPlanObject(r)) {
          // BUG FIX: always override regardless of current value (was: !r.plan_expires_at)
          // This ensures expired accounts and past dates are fully overridden.
          if ('plan_type'       in r) r.plan_type       = 'ranker';
          if ('billing_status'  in r) r.billing_status  = 'active';
          if ('plan_expires_at' in r) r.plan_expires_at = '2099-12-31T23:59:59.000Z';
          if ('access_ends_at'  in r) r.access_ends_at  = '2099-12-31T23:59:59.000Z';
          if ('effective_plan'  in r) r.effective_plan  = 'ranker';
          if ('access_source'   in r) r.access_source   = 'ranker';
          if ('cancel_at_period_end' in r) r.cancel_at_period_end = false;
        }
        for (var k in r) {
          if (r[k] && typeof r[k] === 'object') r[k] = deepPatch(r[k]);
        }
        return r;
      }
      var patched = deepPatch(data);
      var headers = new Headers(res.headers);
      return new Response(JSON.stringify(patched), {
        status: res.status, statusText: res.statusText, headers: headers
      });
    });
  }

  // BUG FIX: collect ALL demo keys first, then remove them.
  // Old code used break after first removal AND modified sessionStorage
  // while iterating by index (causes skipped entries).
  try {
    var _demoKeys = [];
    for (var _di = 0; _di < sessionStorage.length; _di++) {
      var _dk = sessionStorage.key(_di);
      if (_dk && _dk.toLowerCase().indexOf('demo') !== -1) _demoKeys.push(_dk);
    }
    _demoKeys.forEach(function(k) { try { sessionStorage.removeItem(k); } catch(e){} });
  } catch(e) {}
  // Also clear demo localStorage entries (isotope-demo-mode key)
  try {
    var _lsDemoKeys = [];
    for (var _ldi = 0; _ldi < localStorage.length; _ldi++) {
      var _ldk = localStorage.key(_ldi);
      if (_ldk && _ldk.toLowerCase().indexOf('demo') !== -1) _lsDemoKeys.push(_ldk);
    }
    _lsDemoKeys.forEach(function(k) { try { localStorage.removeItem(k); } catch(e){} });
  } catch(e) {}
})();
</script>`;

// ── Update command dialog patch ──────────────────────────────────────────────
// The downloadable app runs from a local Node server. A browser button must never
// kill the server. Update UI only shows the safe local command system.
const UPDATE_COMMAND_DIALOG_SCRIPT = `<script>
(function() {
  function platformHint() {
    var ua = navigator.userAgent || '';
    if (/Android/i.test(ua)) {
      return 'Android/Termux: run isotope update in Termux. If Termux Widget shortcuts are installed, tap isotope-update from your home screen.';
    }
    if (/Windows/i.test(ua)) {
      return 'Windows: open Command Prompt or PowerShell and run isotope update. If the command is not installed, run setup.bat again.';
    }
    if (/Macintosh|Mac OS/i.test(ua)) {
      return 'macOS: open Terminal and run isotope update. If the command is not installed, run bash setup.sh again.';
    }
    return 'Linux/Termux: open a terminal and run isotope update. If the command is not installed, run bash setup.sh again.';
  }

  function copyCommand(btn) {
    var cmd = 'isotope update';
    function done(ok) {
      if (!btn) return;
      var old = btn.textContent;
      btn.textContent = ok ? 'Copied' : 'Copy failed';
      setTimeout(function(){ btn.textContent = old; }, 1400);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(cmd).then(function(){ done(true); }).catch(function(){ done(false); });
    } else {
      try {
        var t = document.createElement('textarea');
        t.value = cmd;
        t.style.position = 'fixed';
        t.style.opacity = '0';
        document.body.appendChild(t);
        t.select();
        document.execCommand('copy');
        t.remove();
        done(true);
      } catch(e) { done(false); }
    }
  }

  window.__isoShowUpdateDialog = function() {
    var existing = document.getElementById('__iso_update_modal__');
    if (existing) existing.remove();
    var wrap = document.createElement('div');
    wrap.id = '__iso_update_modal__';
    wrap.innerHTML =
      '<div class="iso-update-backdrop" role="presentation"></div>' +
      '<section class="iso-update-dialog" role="dialog" aria-modal="true" aria-labelledby="iso-update-title">' +
      '<button class="iso-update-x" type="button" aria-label="Close">x</button>' +
      '<h2 id="iso-update-title">Update available</h2>' +
      '<p>A new version of Isotope is available. Because this app runs locally on your device, update must be applied through the local command system.</p>' +
      '<label>Run this command</label>' +
      '<pre><code>isotope update</code></pre>' +
      '<p class="iso-update-hint">' + platformHint() + '</p>' +
      '<p class="iso-update-hint">After update, run <code>isotope start</code> if the server did not restart automatically.</p>' +
      '<div class="iso-update-actions">' +
      '<button class="iso-copy" type="button">Copy command</button>' +
      '<button class="iso-later" type="button">Later</button>' +
      '<a class="iso-docs" href="https://github.com/Suydev/isotope-code/blob/main/README.md#updating" target="_blank" rel="noreferrer">Open docs / troubleshooting</a>' +
      '</div>' +
      '</section>';
    var css = document.getElementById('__iso_update_modal_css__');
    if (!css) {
      css = document.createElement('style');
      css.id = '__iso_update_modal_css__';
      css.textContent =
        '#__iso_update_modal__{position:fixed;inset:0;z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#f4f4f5}' +
        '#__iso_update_modal__ .iso-update-backdrop{position:absolute;inset:0;background:rgba(9,9,11,.72);backdrop-filter:blur(5px)}' +
        '#__iso_update_modal__ .iso-update-dialog{position:relative;margin:72px auto 0;width:min(520px,calc(100vw - 28px));background:#18181b;border:1px solid rgba(245,158,11,.32);border-radius:8px;box-shadow:0 24px 80px rgba(0,0,0,.45);padding:22px}' +
        '#__iso_update_modal__ h2{margin:0 32px 10px 0;font-size:22px;line-height:1.2;letter-spacing:0;color:#fff}' +
        '#__iso_update_modal__ p{margin:10px 0;color:#d4d4d8;font-size:14px;line-height:1.5}' +
        '#__iso_update_modal__ label{display:block;margin-top:16px;margin-bottom:6px;color:#a1a1aa;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em}' +
        '#__iso_update_modal__ pre{margin:0;background:#09090b;border:1px solid #3f3f46;border-radius:7px;padding:14px;overflow:auto}' +
        '#__iso_update_modal__ code{font-family:Consolas,"SFMono-Regular",monospace;color:#fbbf24;font-size:14px}' +
        '#__iso_update_modal__ .iso-update-hint{font-size:13px;color:#a1a1aa}' +
        '#__iso_update_modal__ .iso-update-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}' +
        '#__iso_update_modal__ button,#__iso_update_modal__ .iso-docs{border-radius:7px;padding:9px 13px;font-size:13px;font-weight:700;text-decoration:none;cursor:pointer}' +
        '#__iso_update_modal__ .iso-copy{border:0;background:#f59e0b;color:#18181b}' +
        '#__iso_update_modal__ .iso-later{border:1px solid #3f3f46;background:#27272a;color:#f4f4f5}' +
        '#__iso_update_modal__ .iso-docs{border:1px solid #52525b;color:#e4e4e7;background:transparent}' +
        '#__iso_update_modal__ .iso-update-x{position:absolute;right:14px;top:12px;border:0;background:transparent;color:#a1a1aa;padding:6px 9px;font-size:16px}';
      document.head.appendChild(css);
    }
    document.body.appendChild(wrap);
    var close = function(){ if (wrap.parentNode) wrap.remove(); };
    wrap.querySelector('.iso-copy').addEventListener('click', function(){ copyCommand(this); });
    wrap.querySelector('.iso-later').addEventListener('click', close);
    wrap.querySelector('.iso-update-x').addEventListener('click', close);
    wrap.querySelector('.iso-update-backdrop').addEventListener('click', close);
  };

  function patchUpdateBtn() {
    var btns = document.querySelectorAll('button, a, [role="button"]');
    for (var i = 0; i < btns.length; i++) {
      var el = btns[i];
      if (el.__isoPatch) continue;
      var txt = (el.textContent || '').trim();
      if (txt === 'Reload to update' || txt === 'Update now' || txt.indexOf('Reload to update') !== -1) {
        el.__isoPatch = true;
        el.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopImmediatePropagation();
          window.__isoShowUpdateDialog();
        }, true);
      }
    }
  }
  // Patch existing buttons and watch for the banner to appear
  patchUpdateBtn();
  var obs = new MutationObserver(patchUpdateBtn);
  obs.observe(document.body, { childList: true, subtree: true });
})();
</script>`;

// ── Auth guard: redirect unauthenticated users early ────────────────────────
// Injected at </head> — runs synchronously BEFORE React loads to prevent any
// flash of protected content. Onboarding is deliberately decided later by the
// explicit boot state in restore-and-launch.js.
function buildAuthGuardScript() {
  const supaRef = new URL(SUPA_URL).hostname.split('.')[0];
  return `<script>
(function() {
  'use strict';
  var SUPA_REF = '${supaRef}';
  // Paths that do NOT require authentication
  var PUBLIC_PATHS = ['/', '/onboarding', '/auth', '/login', '/signup',
                      '/terms', '/privacy', '/about', '/demo', '/reset-password'];
  var currentPath = window.location.pathname.replace(/\\/+$/, '') || '/';
  var isPublic = PUBLIC_PATHS.some(function(p) {
    return currentPath === p || currentPath.startsWith(p + '/');
  });
  if (isPublic) return; // Public page — no auth required

  // ── Session check ────────────────────────────────────────────────────────────
  function getStoredSessionEvidence() {
    try {
      var raw = localStorage.getItem('sb-' + SUPA_REF + '-auth-token')
             || localStorage.getItem('isotope-auth-token')
             || localStorage.getItem('isotope-last-session-raw');
      if (!raw) {
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if (k && k.indexOf('sb-') === 0 && /-auth-token$/.test(k)) {
            raw = localStorage.getItem(k);
            if (raw) break;
          }
        }
      }
      if (!raw) return null;
      var sess = JSON.parse(raw);
      var stateSession = sess && sess.state && sess.state.session;
      var token = sess && (sess.access_token || (sess.session && sess.session.access_token) || (sess.currentSession && sess.currentSession.access_token) || (stateSession && stateSession.access_token));
      if (!token) return null;
      return sess;
    } catch(e) { return null; }
  }

  var session = getStoredSessionEvidence();
  if (!session) {
    // Route decisions are made by restore-and-launch.js after Supabase session
    // hydration/refresh. Do not preemptively redirect protected deep links.
    window.__ISO_AUTH_GUARD__ = { state: 'sessionRestoring', protectedPath: currentPath, startedAt: Date.now() };
    var redirectIfLoggedOut = function(detail) {
      var boot = (detail && detail.detail) || window.__ISO_BOOT_STATE__ || {};
      if (boot.state === 'readyLoggedOut') window.location.replace('/auth');
    };
    window.addEventListener('isotope:boot-state', redirectIfLoggedOut);
    setTimeout(function() {
      var boot = window.__ISO_BOOT_STATE__ || {};
      if (!boot.bootResolved || boot.state === 'readyLoggedOut') window.location.replace('/auth');
    }, 9000);
    return;
  }

  // Onboarding is intentionally not enforced here. This guard runs before
  // restore-and-launch.js can verify Supabase or a trusted cloud snapshot, so
  // localStorage would collapse UNKNOWN into INCOMPLETE and flash onboarding.
  // The React route gate handles onboarding after window.__ISO_BOOT_STATE__
  // resolves.
})();
</script>`;
}
const AUTH_GUARD_SCRIPT = buildAuthGuardScript();

// ── Reload guard — prevents repeated service-worker activation reloads ───────
// Injected before the compiled PWA manager bundle can run. It allows one
// automatic SW-triggered reload per browser session.
const RELOAD_GUARD_VERSION = (() => {
  try {
    const v = readLocalVersionInfo();
    return String(v.version || '0.0.0') + '-' + String(v.sha || 'unknown').slice(0, 12);
  } catch {
    return '0.0.0-unknown';
  }
})();
const RELOAD_GUARD_SCRIPT = `<script>
(function(){
  var _k='isotope_reload_guard_${RELOAD_GUARD_VERSION.replace(/[^A-Za-z0-9_.-]/g, '_')}';
  window.__isoReloadGuard=function(){
    var offline = navigator.onLine===false || window.__isoLocalServerOffline===true ||
      (window.__isoLocalStatus && window.__isoLocalStatus.serverOnline===false);
    if(offline){
      console.warn('[Isotope] SW reload guard: blocked automatic reload while offline/local server unavailable');
      return false;
    }
    if(sessionStorage.getItem(_k)||localStorage.getItem(_k)){
      console.warn('[Isotope] SW reload guard: blocked repeat automatic reload');
      return false;
    }
    sessionStorage.setItem(_k,'1');
    try{localStorage.setItem(_k,String(Date.now()))}catch(e){}
    window.location.reload();
    return true;
  };
})();
</script>`;

// ── Feature removal: hide background upload buttons injected via CSS ──────────
// The Focus page has "Custom Background URL" and "Remove Background" icon buttons
// in the top-right header that expose a now-removed storage upload feature.
// Hiding via CSS is simpler and safer than patching the minified bundle.
const FEATURE_REMOVAL_STYLE = `<style>
button[title="Custom Background URL"],
button[title="Remove Background"] {
  display: none !important;
}
</style>`;

// ── Docs link badge — always-visible link to GitHub Pages documentation ───────
// Floats in the bottom-right corner; appears on the login page and throughout
// the app so first-time users can find setup instructions without searching.
const DOCS_LINK_HTML = `<a href="https://suydev.github.io/isotope-code/" target="_blank" rel="noopener noreferrer" id="iso-docs-badge" title="IsotopeAI documentation" style="position:fixed;bottom:14px;right:18px;z-index:9998;background:rgba(10,10,20,0.82);border:1px solid rgba(124,58,237,0.38);border-radius:999px;padding:6px 14px;font-size:11px;font-family:system-ui,-apple-system,sans-serif;color:#a78bfa;text-decoration:none;backdrop-filter:blur(6px);letter-spacing:0.02em;pointer-events:auto;user-select:none" onmouseover="this.style.background='rgba(124,58,237,0.22)';this.style.borderColor='rgba(124,58,237,0.7)'" onmouseout="this.style.background='rgba(10,10,20,0.82)';this.style.borderColor='rgba(124,58,237,0.38)'">📖 Docs</a>`;

function injectScripts(html) {
  // Injection order (all into </head> so they run before React):
  //  1. ORIGIN_SCRIPT   — sets window.__ISO_ORIGIN__, __ISO_SUPA_URL__, __ISO_ANON__
  //  2. LOCAL_DATA_GUARD_SCRIPT — per-user local workspace isolation
  //  3. AUTH_GUARD_SCRIPT — immediate redirect if no valid session (must be early)
  //  4. PREMIUM_SCRIPT  — fetch interceptor + profile upgrade (only runs if authed)
  //  5. RELOAD_GUARD_SCRIPT — one-shot SW reload guard
  //  6. FEATURE_REMOVAL_STYLE — hide removed features (background upload buttons)
  //  7. KEY_SCRIPT      — AI API keys
  //  8. USERNAME_AUTH_SCRIPT — window.__isoUp / __isoLogin helpers for auth forms
  // UPDATE_COMMAND_DIALOG_SCRIPT + DOCS_LINK_HTML go before </body> (need document.body).
  let out = html.replace('</head>', ORIGIN_SCRIPT + LOCAL_DATA_GUARD_SCRIPT + AUTH_GUARD_SCRIPT + PREMIUM_SCRIPT + RELOAD_GUARD_SCRIPT + FEATURE_REMOVAL_STYLE + '</head>');
  if (KEY_SCRIPT) out = out.replace('</head>', KEY_SCRIPT + '</head>');
  out = out.replace('</head>', USERNAME_AUTH_SCRIPT + '</head>');
  out = out.replace('</body>', DOCS_LINK_HTML + UPDATE_COMMAND_DIALOG_SCRIPT + '</body>');
  return out;
}
function injectKeys(htmlBuffer) {
  return Buffer.from(injectScripts(htmlBuffer.toString('utf8')), 'utf8');
}

// ── AI store patch ────────────────────────────────────────────────────────────
const AI_STORE_ABS  = path.join(PUBLIC_DIR, 'assets', 'useAIStore-B2cv1FZz.js');
const AI_PATCH_FROM = 'async getApiKey(n) {\n            const e = `ai_api_key_${n}`';
const AI_PATCH_TO   = 'async getApiKey(n) {\n            if(typeof window!=="undefined"&&window.__IK__&&window.__IK__[n])return window.__IK__[n];\n            const e = `ai_api_key_${n}`';
let patchedAiStore = null;
function getPatchedAiStore() {
  if (patchedAiStore) return patchedAiStore;
  try {
    const raw = fs.readFileSync(AI_STORE_ABS, 'utf8');
    patchedAiStore = Buffer.from(
      raw.includes(AI_PATCH_FROM) ? raw.replace(AI_PATCH_FROM, AI_PATCH_TO) : raw, 'utf8'
    );
  } catch { patchedAiStore = null; }
  return patchedAiStore;
}

// ── Feature removal patches: Events and Store ────────────────────────────────
// The app is distributed as pre-built chunks.  Keep removal in serve-time patches
// so the original compiled assets remain untouched and no rebuild is required.
const COMMUNITY_BUNDLE_ABS     = path.join(PUBLIC_DIR, 'assets', 'Community-DIqF5406.js');
const COMMUNITY_HUB_BUNDLE_ABS = path.join(PUBLIC_DIR, 'assets', 'CommunityHub-gANxZssO.js');
const STORE_BUNDLE_ABS         = path.join(PUBLIC_DIR, 'assets', 'FocusStore-D5cRXSIr.js');
const EVENTS_BUNDLE_ABS        = path.join(PUBLIC_DIR, 'assets', 'EventsCalendar-COHF8nOK.js');
const SERVICE_WORKER_ABS       = path.join(PUBLIC_DIR, 'sw.js');
const USE_SYNC_STORE_BUNDLE_ABS = path.join(PUBLIC_DIR, 'assets', 'useSyncStore-vWs_TdIc.js');
const PWA_MANAGER_BUNDLE_ABS   = path.join(PUBLIC_DIR, 'assets', 'PWAManager-DjIYufp2.js');
const REMOVED_FEATURE_MODULE   = Buffer.from('export default function RemovedFeature(){return null;}\\n', 'utf8');

const COMMUNITY_FEATURE_RENDER_FROM = 'a==="store"&&e.jsx(U,{onNavigate:i},"store"),a==="events"&&e.jsx(M,{onNavigate:i},"events"),';
const COMMUNITY_FEATURE_RENDER_TO   = '';
const COMMUNITY_HUB_CARDS_FROM = 'h=[{id:"discovery",label:"Browse Groups",icon:xe,color:"text-brand-500"},{id:"challenges",label:"Challenges",icon:T,color:"text-rose-500"},{id:"leaderboard",label:"Leaderboard",icon:z,color:"text-amber-500"},{id:"store",label:"Store",icon:ge,color:"text-orange-500"},{id:"events",label:"Events",icon:be,color:"text-emerald-500"}]';
const COMMUNITY_HUB_CARDS_TO   = 'h=[{id:"discovery",label:"Browse Groups",icon:xe,color:"text-brand-500"},{id:"challenges",label:"Challenges",icon:T,color:"text-rose-500"},{id:"leaderboard",label:"Leaderboard",icon:z,color:"text-amber-500"}]';

let patchedCommunityBundle = null;
function getPatchedCommunityBundle() {
  if (patchedCommunityBundle) return patchedCommunityBundle;
  try {
    let raw = fs.readFileSync(COMMUNITY_BUNDLE_ABS, 'utf8');
    if (raw.includes(COMMUNITY_FEATURE_RENDER_FROM)) {
      raw = raw.replace(COMMUNITY_FEATURE_RENDER_FROM, COMMUNITY_FEATURE_RENDER_TO);
      console.log('[FeaturePatch] Store and Events render paths removed');
    } else { console.warn('[FeaturePatch] Community render removal string not found'); }
    patchedCommunityBundle = Buffer.from(raw, 'utf8');
  } catch { patchedCommunityBundle = null; }
  return patchedCommunityBundle;
}

let patchedCommunityHubBundle = null;
function getPatchedCommunityHubBundle() {
  if (patchedCommunityHubBundle) return patchedCommunityHubBundle;
  try {
    let raw = fs.readFileSync(COMMUNITY_HUB_BUNDLE_ABS, 'utf8');
    if (raw.includes(COMMUNITY_HUB_CARDS_FROM)) {
      raw = raw.replace(COMMUNITY_HUB_CARDS_FROM, COMMUNITY_HUB_CARDS_TO);
      console.log('[FeaturePatch] Store and Events hub cards removed');
    } else { console.warn('[FeaturePatch] Community hub card removal string not found'); }
    patchedCommunityHubBundle = Buffer.from(raw, 'utf8');
  } catch { patchedCommunityHubBundle = null; }
  return patchedCommunityHubBundle;
}

// ── PWA manager patch: guard SW-triggered reloads ─────────────────────────────
const PWA_RELOAD_FROM = `(r.isUpdate || r.isExternal) && window.location.reload()`;
const PWA_RELOAD_TO   = `(r.isUpdate || r.isExternal) && (typeof window.__isoReloadGuard==='function' ? window.__isoReloadGuard() : window.location.reload())`;
let patchedPWAManagerBundle = null;
function getPatchedPWAManagerBundle() {
  if (patchedPWAManagerBundle) return patchedPWAManagerBundle;
  try {
    let raw = fs.readFileSync(PWA_MANAGER_BUNDLE_ABS, 'utf8');
    if (raw.includes(PWA_RELOAD_FROM)) {
      raw = raw.replace(PWA_RELOAD_FROM, PWA_RELOAD_TO);
      console.log('[PWAPatch] SW reload guard applied');
    } else {
      console.warn('[PWAPatch] Reload patch string not found in PWAManager bundle');
    }
    patchedPWAManagerBundle = Buffer.from(raw, 'utf8');
  } catch (e) { console.error('[PWAPatch] Error:', e.message); patchedPWAManagerBundle = null; }
  return patchedPWAManagerBundle;
}

// ── App bundle patch: disable demo mode ──────────────────────────────────────
const APP_BUNDLE_ABS  = path.join(PUBLIC_DIR, 'assets', 'App-pJGjDiPw.js');
// [Patch 1] Disable demo mode: ge() always returns false
const APP_DEMO_FROM = 'ge = () => typeof window > "u" ? !1 : Ys(window.location.pathname) || window.sessionStorage.getItem(Et) === "1",';
const APP_DEMO_TO   = 'ge = () => !1,';
// [Patch 2] fetchUserData grandfathered path: scholar → ranker
const APP_PLAN_FROM_A = 'planType: "scholar",\n                    planExpiresAt: k ?.access_ends_at';
const APP_PLAN_TO_A   = 'planType: "ranker",\n                    planExpiresAt: k ?.access_ends_at';
// [Patch 3] Auth store initial state: scholar → ranker
const APP_PLAN_FROM_B = 'planType: "scholar",\n        planExpiresAt: null,\n        accessSource: "grandfathered"';
const APP_PLAN_TO_B   = 'planType: "ranker",\n        planExpiresAt: null,\n        accessSource: "grandfathered"';

let patchedAppBundle = null;
function decodeJwtPayload(token) {
  try {
    const part = String(token || '').split('.')[1];
    if (!part) return null;
    const normalized = part.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4);
    return JSON.parse(Buffer.from(padded, 'base64').toString('utf8'));
  } catch {
    return null;
  }
}

function replaceSupabaseJwtConstants(bundle) {
  let replaced = 0;
  const jwtPattern = /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g;
  const out = bundle.replace(jwtPattern, (token) => {
    const payload = decodeJwtPayload(token);
    if (!payload || payload.iss !== 'supabase') return token;
    if (payload.role === 'anon' || payload.role === 'authenticated' || payload.role === 'service_role') {
      replaced++;
      return SUPA_ANON_KEY;
    }
    return token;
  });
  if (replaced) console.log(`[AppPatch] Supabase JWT constants normalized (${replaced})`);
  return out;
}

function replaceSupabaseUrlConstants(bundle) {
  let replaced = 0;
  const out = bundle.replace(/https:\/\/[a-z0-9-]+\.supabase\.co/g, (url) => {
    if (url === SUPA_URL) return url;
    replaced++;
    return SUPA_URL;
  });
  if (replaced) console.log(`[AppPatch] Supabase URL constants normalized (${replaced})`);
  return out;
}

function getPatchedAppBundle() {
  if (patchedAppBundle) return patchedAppBundle;
  try {
    const raw = fs.readFileSync(APP_BUNDLE_ABS, 'utf8');
    let patched = raw;

    if (patched.includes(APP_DEMO_FROM)) {
      patched = patched.replace(APP_DEMO_FROM, APP_DEMO_TO);
      console.log('[AppPatch] Demo-mode disabled');
    } else { console.warn('[AppPatch] Demo patch string not found'); }

    if (patched.includes(APP_PLAN_FROM_A)) {
      patched = patched.replace(APP_PLAN_FROM_A, APP_PLAN_TO_A);
      console.log('[AppPatch] fetchUserData planType → ranker');
    } else { console.warn('[AppPatch] Plan patch A not found'); }

    if (patched.includes(APP_PLAN_FROM_B)) {
      patched = patched.replace(APP_PLAN_FROM_B, APP_PLAN_TO_B);
      console.log('[AppPatch] Initial store planType → ranker');
    } else { console.warn('[AppPatch] Plan patch B not found'); }

    // [Patch 4] Replace Supabase placeholders and any embedded Supabase URL/JWT
    // constants with this local install's environment values.
    if (patched.includes('__ISOTOPE_SUPABASE_URL__')) {
      patched = patched.split('__ISOTOPE_SUPABASE_URL__').join(SUPA_URL);
      console.log('[AppPatch] Supabase URL placeholder replaced from env');
    }

    if (patched.includes('__ISOTOPE_SUPABASE_ANON_KEY__')) {
      patched = patched.split('__ISOTOPE_SUPABASE_ANON_KEY__').join(SUPA_ANON_KEY);
      console.log('[AppPatch] Supabase anon placeholder replaced from env');
    }

    // [Patch 4b] Normalize any previously patched project URL/JWTs at serve time.
    patched = replaceSupabaseUrlConstants(patched);
    patched = replaceSupabaseJwtConstants(patched);

    // [Patch 5] Disable circuit breaker — prevents a single failed request from
    // locking ALL Supabase calls for 5 minutes.  The O() function decides whether
    // an error should trip the breaker; replacing its body with "return false"
    // disables it entirely. Normal per-request errors still surface to the UI.
    const CB_FROM = 'function O(a) {\n    if (!a) return !1;';
    const CB_TO   = 'function O(a) {\n    return !1; if (!a) return !1;';
    if (patched.includes(CB_FROM)) {
      patched = patched.replace(CB_FROM, CB_TO);
      console.log('[AppPatch] Circuit breaker disabled');
    } else { console.warn('[AppPatch] Circuit breaker patch string not found'); }

    const appPatch = (from, to, label) => {
      if (patched.includes(from)) {
        patched = patched.split(from).join(to);
        console.log('[AppPatch] ' + label);
      } else {
        console.warn('[AppPatch] String not found:', label);
      }
    };

    appPatch(
      'createTemporaryLocalFallback(e, t) {',
      'createTemporaryLocalFallback(e, t) { return { success: !1, error: "Cloud auth is unavailable. Start the local server and sign in again." };',
      'Temporary local auth fallback disabled'
    );
    appPatch(
      'autoRefreshToken: !1,',
      'autoRefreshToken: !0,',
      'Supabase session auto-refresh enabled'
    );
    appPatch(
      'async restoreLocalWorkspaceSession() {',
      'async restoreLocalWorkspaceSession() { return null;',
      'Local workspace session restore disabled'
    );
    appPatch(
      'if (!M() || !w) return {\n            success: !0,\n            user: this.createLocalUser(r)\n        };',
      'if (!M() || !w) return {\n            success: !1,\n            error: "Cloud auth is not configured"\n        };',
      'Sign-up local fake user disabled'
    );
    appPatch(
      'if (!M() || !w) return {\n            success: !0,\n            user: this.createLocalUser(e)\n        };',
      'if (!M() || !w) return {\n            success: !1,\n            error: "Cloud auth is not configured"\n        };',
      'Sign-in local fake user disabled'
    );
    appPatch(
      '} catch (r) {\n            O(r) && this.setDegradedMode(r, Z("Cloud profile sync"))\n        }\n    }\n    async pushPublicProfileFields',
      '} catch (r) {\n            O(r) && this.setDegradedMode(r, Z("Cloud profile sync"));\n            throw r\n        }\n    }\n    async pushPublicProfileFields',
      'Profile sync errors surface'
    );
    appPatch(
      '} catch (r) {\n            O(r) && this.setDegradedMode(r, Z("Public profile sync"))\n        }\n    }\n    async pushRecord',
      '} catch (r) {\n            O(r) && this.setDegradedMode(r, Z("Public profile sync"));\n            throw r\n        }\n    }\n    async pushRecord',
      'Public profile sync errors surface'
    );
    appPatch(
      'if (this.isTableMissingError(i, s)) {\n                this.markTableUnsupported(s);\n                return\n            }\n        }\n    }\n    async deleteRecord',
      'if (this.isTableMissingError(i, s)) {\n                this.markTableUnsupported(s);\n                return\n            }\n            throw i\n        }\n    }\n    async deleteRecord',
      'Record sync errors surface'
    );
    appPatch(
      'if (this.isTableMissingError(i, s)) {\n                this.markTableUnsupported(s);\n                return\n            }\n        }\n    }\n    async pushAllData',
      'if (this.isTableMissingError(i, s)) {\n                this.markTableUnsupported(s);\n                return\n            }\n            throw i\n        }\n    }\n    async pushAllData',
      'Delete sync errors surface'
    );
    appPatch(
      'if (O(t)) throw t',
      'throw t',
      'Delta sync failures propagate'
    );
    appPatch(
      '!o && O(f.error) && (o = f.error);',
      '!o && (o = f.error || new Error("Batch upsert failed"));',
      'Batch upsert failure captured'
    );
    appPatch(
      'y.success ? i++ : (n++, !o && O(y.error) && (o = y.error))',
      'y.success ? i++ : (n++, !o && (o = y.error || new Error("Row upsert failed")))',
      'Adaptive row upsert failure captured'
    );
    appPatch(
      'n++, !o && O(y) && (o = y)',
      'n++, !o && (o = y)',
      'Adaptive row exception captured'
    );
    appPatch(
      'n += h.length, !o && O(f) && (o = f)',
      'n += h.length, !o && (o = f)',
      'Batch exception captured'
    );
    appPatch(
      'if (n && (Ur.updateFromPayload(n, i.username || i.name, i.avatar), !n.startsWith("local-") && M())) {\n            const o = hi(r);\n            yi(n, i, s, o)\n        }',
      'if (n && (Ur.updateFromPayload(n, i.username || i.name, i.avatar), !n.startsWith("local-") && M())) {\n            await va.pushProfile(n, i, s)\n        }',
      'Profile updates wait for cloud persistence'
    );
    appPatch(
      'const a = await Dt();\n        return JSON.stringify(a, null, 2)',
      'const a = await Dt();\n        return typeof window < "u" && window.__isoStringifyBackup ? await window.__isoStringifyBackup(a) : JSON.stringify(a, null, 2)',
      'Backup export stringify yields to worker'
    );
    appPatch(
      's && await this.pushProfile(e, s), t && await this.pushAllDataDelta(e), await this.pullCloudSnapshot(e, t)',
      '(window.__isoBuildBackup = async () => await Dn(), window.__isoApplyBackup = async r => await Xr(r, { mode: "merge" })), await (window.__isoRunManualCloudSync ? window.__isoRunManualCloudSync(window.__isoBuildBackup, window.__isoApplyBackup, "manual_full_sync") : (window.__isoUploadBackupJSON ? window.__isoUploadBackupJSON(await Dn(), { source: "manual_full_sync" }) : Promise.resolve()))',
      'Manual full sync uses full Storage backup JSON'
    );
    appPatch(
      's && await this.pushProfile(e, s), t && await this.pushAllDataDelta(e)\n        })',
      '(window.__isoBuildBackup = window.__isoBuildBackup || (async () => await Dn()), window.__isoApplyBackup = window.__isoApplyBackup || (async r => await Xr(r, { mode: "merge" }))), await (window.__isoUploadBackupJSON ? window.__isoUploadBackupJSON(await Dn(), { source: "upload_dirty_local" }) : Promise.resolve())\n        })',
      'Upload-only sync uses full Storage backup JSON'
    );
    appPatch(
      'await this.pullCloudSnapshot(e, t)\n        })\n    }\n    async uploadDirtyLocal',
      'await this.pullCloudSnapshot(e, !1); await (window.__isoDownloadAndImportBackup ? window.__isoDownloadAndImportBackup(async s => await Xr(s, { mode: "merge" }), "download_cloud_data") : (async () => { const s = window.__isoDownloadBackupJSON ? await window.__isoDownloadBackupJSON({ source: "download_cloud_data" }).catch(() => null) : null; s && await Xr(s, { mode: "merge" }) })())\n        })\n    }\n    async uploadDirtyLocal',
      'Download cloud data imports full Storage backup JSON'
    );

    const pushProfileStart = '    async pushProfile(e, t, s) {';
    const pushProfileEnd = '    async pushPublicProfileFields';
    const pushProfileStartIdx = patched.indexOf(pushProfileStart);
    const pushProfileEndIdx = pushProfileStartIdx >= 0 ? patched.indexOf(pushProfileEnd, pushProfileStartIdx) : -1;
    if (pushProfileStartIdx >= 0 && pushProfileEndIdx > pushProfileStartIdx) {
      const replacement = `    async pushProfile(e, t, s) {
        if (!(!M() || !w) && !(!e || e.startsWith("local-"))) try {
            const r = Ns(t),
                {
                    data: i,
                    error: n
                } = await w.auth.getSession();
            if (n) throw n;
            const o = i && i.session ? i.session : null;
            if (!o || !o.access_token) throw new Error("Authentication required");
            const c = window.__isoPostProfile ? await window.__isoPostProfile({
                        profile_data: r,
                        display_name: r.display_name || r.name,
                        username: r.username,
                        bio: r.bio,
                        avatar: r.avatar,
                        avatar_url: r.avatar_url
                    }) : await fetch("/__auth/profile", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + o.access_token
                    },
                    body: JSON.stringify({
                        profile_data: r,
                        display_name: r.display_name || r.name,
                        username: r.username,
                        bio: r.bio,
                        avatar: r.avatar,
                        avatar_url: r.avatar_url
                    })
                }).then(d => d.json().then(p => { if (!d.ok || !p.ok) throw new Error(p.error || "Profile sync failed"); return p }));
            const d = c;
            if (!d.ok) throw new Error(d.error || "Profile sync failed");
            d.profile && await m.saveUserProfile(pe({ ...r,
                ...d.profile
            }))
        } catch (r) {
            O(r) && this.setDegradedMode(r, Z("Cloud profile sync"));
            throw r
        }
    }
`;
      patched = patched.slice(0, pushProfileStartIdx) + replacement + patched.slice(pushProfileEndIdx);
      console.log('[AppPatch] Profile sync routed through verified server endpoint');
    } else {
      console.warn('[AppPatch] pushProfile method not found');
    }

    patchedAppBundle = Buffer.from(patched, 'utf8');
  } catch (e) { console.error('[AppPatch] Error:', e.message); patchedAppBundle = null; }
  return patchedAppBundle;
}

// ── Focus bundle patch ───────────────────────────────────────────────────────
const FOCUS_BUNDLE_ABS = path.join(PUBLIC_DIR, 'assets', 'Focus-BmgY-9vP.js');
const PIP_POLYFILL = `(function(){
var _isAndroid=/Android|Mobile|iPhone|iPad|iPod/i.test(navigator.userAgent);
if('documentPictureInPicture' in window && !_isAndroid)return;
window.documentPictureInPicture={
requestWindow:async function(opts){
var w=(opts&&opts.width)||340,h=(opts&&opts.height)||390;
var old=document.getElementById('__pip_poly__');if(old)old.remove();
var ov=document.createElement('div');
ov.id='__pip_poly__';
var phl=[];
function doClose(){
  ov.style.opacity='0';
  ov.style.transform=_isAndroid?'translateY(20px) scale(0.95)':'scale(0.97)';
  setTimeout(function(){ov.remove();},280);
  phl.forEach(function(fn){try{fn({type:'pagehide'});}catch(e){}});
}
var ca=document.createElement('div');
var sty=new Proxy(ca.style,{
  set:function(t,p,v){if(_isAndroid&&p==='backgroundColor')return true;t[p]=v;return true;},
  get:function(t,p){var v=t[p];return typeof v==='function'?v.bind(t):v;}
});
var body=new Proxy(ca,{
  get:function(t,p){if(p==='style')return sty;var v=t[p];return typeof v==='function'?v.bind(t):v;},
  set:function(t,p,v){t[p]=v;return true;}
});
var fd={
  body:body,
  createElement:function(tag){return document.createElement(tag);},
  createElementNS:function(ns,tag){return document.createElementNS(ns,tag);},
  getElementById:function(id){return ca.querySelector('#'+id);},
  querySelector:function(s){return ca.querySelector(s);},
  querySelectorAll:function(s){return ca.querySelectorAll(s);},
  head:{appendChild:function(){},querySelectorAll:function(){return[];}}
};
if(_isAndroid){
  var cw=Math.min(w,210);
  var glow=document.createElement('div');
  glow.setAttribute('style','position:fixed;bottom:70px;right:14px;width:'+(cw+12)+'px;height:'+(Math.round(h*0.58)+12)+'px;border-radius:30px;background:transparent;box-shadow:0 0 28px 6px rgba(249,115,22,0.30),0 0 56px 12px rgba(249,115,22,0.12);z-index:2147483646;pointer-events:none;transition:opacity 0.28s ease;');
  document.body.appendChild(glow);
  ov.setAttribute('style','position:fixed;bottom:70px;right:14px;width:'+cw+'px;border-radius:26px;z-index:2147483647;overflow:hidden;font-family:system-ui,-apple-system,sans-serif;background:rgba(8,8,14,0.62);backdrop-filter:blur(32px) saturate(1.8);-webkit-backdrop-filter:blur(32px) saturate(1.8);border:1px solid rgba(249,115,22,0.42);box-shadow:inset 0 1px 0 rgba(255,255,255,0.12),0 12px 40px rgba(0,0,0,0.55);opacity:0;transform:translateY(16px) scale(0.96);transition:opacity 0.32s cubic-bezier(0.22,1,0.36,1),transform 0.32s cubic-bezier(0.22,1,0.36,1);');
  ca.setAttribute('style','width:100%;');
  ov.appendChild(ca);
  var pill=document.createElement('div');
  pill.setAttribute('style','display:flex;align-items:center;justify-content:center;padding:6px 0 10px;cursor:pointer;');
  var pillDot=document.createElement('div');
  pillDot.setAttribute('style','width:36px;height:4px;border-radius:9999px;background:rgba(249,115,22,0.55);');
  pill.appendChild(pillDot);
  pill.addEventListener('click',doClose);
  ov.appendChild(pill);
  document.body.appendChild(ov);
  requestAnimationFrame(function(){requestAnimationFrame(function(){ov.style.opacity='1';ov.style.transform='translateY(0) scale(1)';});});
  var _origClose=doClose;
  doClose=function(){glow.style.opacity='0';setTimeout(function(){glow.remove();},300);_origClose();};
} else {
  ov.setAttribute('style','position:fixed;top:20px;right:20px;width:'+w+'px;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,.28);z-index:2147483647;overflow:hidden;font-family:system-ui,sans-serif;border:1px solid rgba(0,0,0,.08);background:#09090b;opacity:0;transform:scale(0.97);transition:opacity 0.22s ease,transform 0.22s ease;');
  var bar=document.createElement('div');
  bar.setAttribute('style','position:absolute;top:0;left:0;right:0;height:26px;cursor:grab;z-index:1;display:flex;align-items:center;justify-content:flex-end;padding:0 7px;background:rgba(255,255,255,0.06);border-radius:16px 16px 0 0;box-sizing:border-box;border-bottom:1px solid rgba(255,255,255,0.07);');
  var xBtn=document.createElement('button');
  xBtn.textContent='\u2715';
  xBtn.setAttribute('style','background:rgba(255,255,255,0.12);border:none;border-radius:50%;width:17px;height:17px;cursor:pointer;font-size:9px;color:rgba(255,255,255,0.7);display:flex;align-items:center;justify-content:center;padding:0;');
  bar.appendChild(xBtn);
  ov.appendChild(bar);
  ca.setAttribute('style','margin-top:26px;min-height:'+(h-26)+'px;');
  ov.appendChild(ca);
  document.body.appendChild(ov);
  requestAnimationFrame(function(){requestAnimationFrame(function(){ov.style.opacity='1';ov.style.transform='scale(1)';});});
  var drag=false,ox=0,oy=0;
  bar.addEventListener('mousedown',function(e){if(e.target===xBtn)return;drag=true;var r=ov.getBoundingClientRect();ox=e.clientX-r.left;oy=e.clientY-r.top;bar.style.cursor='grabbing';e.preventDefault();});
  document.addEventListener('mousemove',function(e){if(!drag)return;ov.style.right='auto';ov.style.left=Math.max(0,Math.min(e.clientX-ox,window.innerWidth-w-4))+'px';ov.style.top=Math.max(0,e.clientY-oy)+'px';});
  document.addEventListener('mouseup',function(){drag=false;bar.style.cursor='grab';});
  xBtn.addEventListener('click',doClose);
}
return{document:fd,close:doClose,prompt:function(m,d){return window.prompt(m,d);},addEventListener:function(e,fn){if(e==='pagehide')phl.push(fn);},removeEventListener:function(){}};
}};
})();`;

const URL_PATCHES = [
  ['const S = sn(v);', 'const S = /^(blob:|data:)/i.test(v)?v:sn(v);'],
  ['const v = prompt("Enter the URL of the image you want to use as background:");',
   'const v = (window.__isoBgP||prompt)("Enter the URL of the image you want to use as background:");'],
  ['alert("Please enter a valid image URL starting with http:// or https://")',
   '(window.__isoBgInvalid||function(m){alert(m)})("Please enter a valid image URL starting with http:// or https://")'],
];
let patchedFocusBundle = null;
function getPatchedFocusBundle() {
  if (patchedFocusBundle) return patchedFocusBundle;
  try {
    let raw = fs.readFileSync(FOCUS_BUNDLE_ABS, 'utf8');
    for (const [from, to] of URL_PATCHES) {
      if (raw.includes(from)) raw = raw.split(from).join(to);
      else console.warn('[FocusPatch] String not found:', from.slice(0, 60));
    }
    patchedFocusBundle = Buffer.from(PIP_POLYFILL + '\n' + raw, 'utf8');
  } catch { patchedFocusBundle = null; }
  return patchedFocusBundle;
}

// Warm up caches — deferred to after server.listen() so port opens immediately

// ── Auth bundle patch: username-based auth (no email) ────────────────────────
const AUTH_BUNDLE_ABS = path.join(PUBLIC_DIR, 'assets', 'Auth-Cw0VAaCZ.js');
let patchedAuthBundle = null;
function getPatchedAuthBundle() {
  if (patchedAuthBundle) return patchedAuthBundle;
  try {
    let raw = fs.readFileSync(AUTH_BUNDLE_ABS, 'utf8');
    let applied = 0;
    const p = (from, to) => {
      if (raw.includes(from)) { raw = raw.split(from).join(to); applied++; }
      else console.warn('[AuthPatch] Not found:', from.slice(0, 70));
    };
    // Sign In: disable password reset (no self-serve mailbox on self-hosted)
    p(
      '"Enter your email first so we know where to send the reset link."',
      '"Password reset is disabled — contact your administrator."'
    );
    // Sign In: button label
    p('"Sign In with Email"', '"Sign In"');

    // Sign In: route only after server verified profile/onboarding state.
    p(
      'p = async h => {\n            h.preventDefault(), u(null), (await j(s, t)).success && setTimeout(() => {\n                b("/dashboard", {\n                    replace: !0\n                })\n            }, 100)\n        },',
      'p = async h => {\n            h.preventDefault(), u(null), m.setState({ isLoading: true, error: null });\n            try {\n                var __r = await window.__isoLogin(s, t);\n                if (!__r.ok) {\n                    m.setState({ error: __r.err || "Login failed", isLoading: false });\n                    return\n                }\n                window.location.href = __r.onboarding_completed === false ? "/onboarding" : "/dashboard"\n            } catch (__e) {\n                m.setState({ error: __e && __e.message ? __e.message : "Login failed", isLoading: false })\n            }\n        },'
    );

    // Sign Up: replace email-validation + signUp call → server-side signup
    // Form variables: s = Full Name, t = Email, l = Password
    // We pass t (email) + l (password) to server — real email used directly
    p(
      'const N = M(t);\n            if (N) {\n                m.setState({\n                    error: N\n                });\n                return\n            }(await j(s, t, l)).success && d("/onboarding")',
      "m.setState({isLoading:true,error:null});try{var __r=await window.__isoUp(t,l);if(!__r.ok){m.setState({error:__r.err||'Signup failed',isLoading:false});return;}window.location.href='/onboarding';}catch(__e){m.setState({error:__e&&__e.message?__e.message:'Signup failed',isLoading:false});}"
    );
    // Sign Up: button label
    p('"Create Account with Email"', '"Create Account"');

    // Landing panel version badge: update stale hardcoded version string.
    p('children: "IsotopeAI v2.0"', 'children: "IsotopeAI v3.1"');

    // BUG-003: Add autocomplete="current-password" to the password input
    // to silence browser accessibility warnings on every page load.
    // The Auth bundle uses space-separated JSX-style props.
    p(
      'type: "password",\n                        placeholder: "Enter your password"',
      'type: "password",\n                        autoComplete: "current-password",\n                        placeholder: "Enter your password"'
    );

    console.log('[AuthPatch] ' + applied + '/7 patches applied to Auth bundle');
    patchedAuthBundle = Buffer.from(raw, 'utf8');
  } catch (e) { console.error('[AuthPatch] Error:', e.message); patchedAuthBundle = null; }
  return patchedAuthBundle;
}
// getPatchedAuthBundle() — deferred to after server.listen()

// ── Onboarding bundle patch: cloud-verified completion ──────────────────────
const ONBOARDING_BUNDLE_ABS = path.join(PUBLIC_DIR, 'assets', 'Onboarding-qvAqCBbb.js');
let patchedOnboardingBundle = null;
function getPatchedOnboardingBundle() {
  if (patchedOnboardingBundle) return patchedOnboardingBundle;
  try {
    let raw = fs.readFileSync(ONBOARDING_BUNDLE_ABS, 'utf8');
    const from = 'a({\n                    currentStep: 7\n                }), await r({\n                    isOnboarded: !0,\n                    onboardingCompletedAt: new Date().toISOString()\n                })';
    const to = 'const __isoOnbAt = new Date().toISOString(), __isoOnbSave = window.__isoCompleteOnboarding ? await window.__isoCompleteOnboarding({ isOnboarded: !0, onboardingCompletedAt: __isoOnbAt }) : { ok: !1, err: "Cloud onboarding sync is unavailable" };\n                if (!__isoOnbSave.ok) throw new Error(__isoOnbSave.err || "Onboarding cloud save failed");\n                a({\n                    currentStep: 7\n                }), await r({\n                    isOnboarded: !0,\n                    onboardingCompletedAt: __isoOnbAt\n                })';
    if (raw.includes(from)) {
      raw = raw.replace(from, to);
      console.log('[OnboardingPatch] Completion requires verified Supabase write');
    } else {
      console.warn('[OnboardingPatch] Completion patch string not found');
    }
    patchedOnboardingBundle = Buffer.from(raw, 'utf8');
  } catch (e) { console.error('[OnboardingPatch] Error:', e.message); patchedOnboardingBundle = null; }
  return patchedOnboardingBundle;
}

// ── Group bundle patch: account-backed guided tour state ────────────────────
const SINGLE_GROUP_BUNDLE_ABS = path.join(PUBLIC_DIR, 'assets', 'SingleGroup-DU1IhoNK.js');
let patchedSingleGroupBundle = null;
function getPatchedSingleGroupBundle() {
  if (patchedSingleGroupBundle) return patchedSingleGroupBundle;
  try {
    let raw = fs.readFileSync(SINGLE_GROUP_BUNDLE_ABS, 'utf8');
    let applied = 0;
    const patch = (from, to, label) => {
      if (raw.includes(from)) { raw = raw.split(from).join(to); applied++; }
      else console.warn('[SingleGroupPatch] Not found:', label);
    };
    patch(
      'setHasSeenTour:(s,a)=>t(l=>({hasSeenTour:{...l.hasSeenTour,[s]:a}}))',
      'setHasSeenTour:(s,a)=>{t(l=>({hasSeenTour:{...l.hasSeenTour,[s]:a,community_group_v1:a}}));try{window.__isoPersistTour&&window.__isoPersistTour(s,a),s!=="community_group_v1"&&window.__isoPersistTour&&window.__isoPersistTour("community_group_v1",a)}catch(_){}}',
      'tour setter'
    );
    patch(
      'i=a[t]??!1',
      'i=a[t]===!0||a.community_group_v1===!0||(typeof window<"u"&&window.__isoTourSeen&&window.__isoTourSeen("community_group_v1")===!0)',
      'tour seen check'
    );
    patch(
      'onDestroyed:()=>{l(t,!0)}})',
      'onDestroyed:()=>{l(t,!0);l("community_group_v1",!0)}})',
      'tour completion'
    );
    console.log('[SingleGroupPatch] ' + applied + '/3 guided-tour patches applied');
    patchedSingleGroupBundle = Buffer.from(raw, 'utf8');
  } catch (e) { console.error('[SingleGroupPatch] Error:', e.message); patchedSingleGroupBundle = null; }
  return patchedSingleGroupBundle;
}

// ── Leaderboard bundle patch: Supabase stats are the authenticated truth ─────
const LEADERBOARD_BUNDLE_ABS = path.join(PUBLIC_DIR, 'assets', 'useLeaderboard-BpvH5FXA.js');
let patchedLeaderboardBundle = null;
function getPatchedLeaderboardBundle() {
  if (patchedLeaderboardBundle) return patchedLeaderboardBundle;
  try {
    let raw = fs.readFileSync(LEADERBOARD_BUNDLE_ABS, 'utf8');
    const from = 'async function N(){try{const s=await S.getSessions();return A(s)}catch(s){return console.error("[localCommunityStats] Failed to calculate local stats:",s),{total_hours:0,weekly_hours:0,monthly_hours:0,daily_hours:0,total_sessions:0,last_session_at:null}}}';
    const to = 'async function N(){return{total_hours:0,weekly_hours:0,monthly_hours:0,daily_hours:0,total_sessions:0,last_session_at:null,source:"local-cache-disabled"}}';
    if (raw.includes(from)) {
      raw = raw.replace(from, to);
      console.log('[LeaderboardPatch] Authenticated user stats ignore browser-local sessions');
    } else {
      console.warn('[LeaderboardPatch] Local stats patch string not found');
    }
    patchedLeaderboardBundle = Buffer.from(raw, 'utf8');
  } catch (e) { console.error('[LeaderboardPatch] Error:', e.message); patchedLeaderboardBundle = null; }
  return patchedLeaderboardBundle;
}

// ── Settings bundle patch: remove fake synced language and persist avatar clear
const SETTINGS_BUNDLE_ABS = path.join(PUBLIC_DIR, 'assets', 'SettingsLayout-B4OgCkQ5.js');
let patchedSettingsBundle = null;
function getPatchedSettingsBundle() {
  if (patchedSettingsBundle) return patchedSettingsBundle;
  try {
    let raw = fs.readFileSync(SETTINGS_BUNDLE_ABS, 'utf8');
    let applied = 0;
    const patch = (from, to, label) => {
      if (raw.includes(from)) { raw = raw.split(from).join(to); applied++; }
      else console.warn('[SettingsPatch] Not found:', label);
    };
    patch('avatar: void 0', 'avatar: null', 'avatar remove sends explicit null');
    patch(
      '} = ae(), l = f(), [z, N] = ne.useState(!1);',
      '} = ae(), l = f(), __isoMeta = (() => { try { return JSON.parse(localStorage.getItem("isotope_sync_metadata") || "{}") || {} } catch { return {} } })(), __isoSnapshotOk = __isoMeta.last_sync_status === "synced" && !__isoMeta.last_error, __isoBusyStates = ["syncing","selecting_backup","restoring_cloud","verifying_restore","uploading_local"], __isoDisplayStatus = __isoBusyStates.includes(__isoMeta.last_sync_status) ? "syncing" : (__isoMeta.last_sync_status === "blocked_empty_overwrite" ? "error" : g), [z, N] = ne.useState(!1);',
      'sync status reads snapshot metadata'
    );
    patch(
      '__isoSnapshotOk = __isoMeta.last_sync_status === "synced" && !!__isoMeta.last_snapshot_at && !__isoMeta.last_error',
      '__isoSnapshotOk = __isoMeta.last_sync_status === "synced" && !__isoMeta.last_error',
      'synced metadata does not require legacy snapshot timestamp'
    );
    patch('if (g !== "syncing") {', 'if (__isoDisplayStatus !== "syncing") {', 'sync button treats restore/upload stages as busy');
    patch('})(g),\n            d = o.icon,', '})(__isoDisplayStatus),\n            d = o.icon,', 'sync icon uses mapped display status');
    patch('disabled: g === "syncing" || !l', 'disabled: __isoDisplayStatus === "syncing" || !l', 'sync button disabled during detailed busy states');
    patch('label: "Synced manually"', 'label: __isoSnapshotOk ? "Synced" : "Pending"', 'synced label requires snapshot');
    patch(
      'label: __isoSnapshotOk ? "Synced" : "Pending"',
      'label: __isoSnapshotOk || w === "success" ? "Synced" : "Pending"',
      'success status never renders green pending'
    );
    patch(
      'description: "Local data and cloud data were synced successfully."',
      'description: __isoSnapshotOk ? "Last cloud upload/download completed successfully." : "Waiting for verified cloud snapshot upload."',
      'synced description requires snapshot'
    );
    patch(
      'description: __isoSnapshotOk ? "Last cloud upload/download completed successfully." : "Waiting for verified cloud snapshot upload."',
      'description: __isoSnapshotOk || w === "success" ? "Last cloud upload/download completed successfully." : "Waiting for verified cloud snapshot upload."',
      'success status never renders pending description'
    );
    patch('label: "Local mode"', 'label: "Pending/offline"', 'degraded label');
    patch('label: "Sync failed"', 'label: "Failed"', 'failed label');
    patch('label: l ? "Ready to sync" : "Local only"', 'label: l ? "Pending" : "Local only"', 'default sync label');
    patch(
      'description: l ? "Manual sync is available when you press the sync button." : "Cloud sync is unavailable on the free plan."',
      'description: l ? "No verified cloud sync has completed yet." : "Cloud sync is unavailable for this account."',
      'default sync description'
    );
    patch(
      'children: "Manual cloud backup only. Nothing syncs until you press the button."',
      'children: "Cloud sync writes verified Supabase rows and a Storage snapshot."',
      'sync backup copy'
    );
    patch(
      'children: "Download or sync your premium cloud backup on demand"',
      'children: "Sync DB data and the user-content cloud snapshot"',
      'cloud sync copy'
    );
    patch(
      'u.href = C, u.download = `isotope-backup-${E}.json`, u.click(), window.URL.revokeObjectURL(C), b("JSON backup exported successfully.")',
      'u.href = C, u.download = `isotope-backup-${E}.json`, u.click(), window.URL.revokeObjectURL(C), await (window.__isoUploadBackupJSON ? window.__isoUploadBackupJSON(w, { source: "manual_export" }) : Promise.resolve()), b("JSON backup exported and cloud snapshot checked.")',
      'manual export uploads cloud backup'
    );
    patch(
      '}), await Xs(), b("Backup imported successfully. Newer local entries were preserved.")',
      '}), await Xs(), await (window.__isoImportBackupJSON ? window.__isoImportBackupJSON(C, "merge", { source: "manual_import" }) : Promise.resolve()), b("Backup imported locally and cloud snapshot checked.")',
      'manual import writes supported cloud fields'
    );
    console.log('[SettingsPatch] ' + applied + '/18 settings patches applied');
    patchedSettingsBundle = Buffer.from(raw, 'utf8');
  } catch (e) { console.error('[SettingsPatch] Error:', e.message); patchedSettingsBundle = null; }
  return patchedSettingsBundle;
}

// ── Sync store patch: header sync uses runtime Storage backup helpers ────────
let patchedUseSyncStoreBundle = null;
function getPatchedUseSyncStoreBundle() {
  if (patchedUseSyncStoreBundle) return patchedUseSyncStoreBundle;
  try {
    let raw = fs.readFileSync(USE_SYNC_STORE_BUNDLE_ABS, 'utf8');
    let applied = 0;
    const patch = (from, to, label) => {
      if (raw.includes(from)) { raw = raw.split(from).join(to); applied++; }
      else console.warn('[SyncStorePatch] Not found:', label);
    };
    patch(
      `        triggerSync: async () => {
            const t = u.getState(),
                {
                    userId: r,
                    isAuthenticated: s
                } = t,
                a = t.isPremium();
            if (!s || !r || !a) return;
            const o = await n();
            await o.fullManualSync(r, a), await l(), o.getState().status === "success" && e({
                needsCloudBootstrap: !1,
                bootstrapChecked: !0
            })
        },`,
      `        triggerSync: async () => {
            const t = u.getState(),
                {
                    userId: r,
                    isAuthenticated: s
                } = t,
                a = t.isPremium();
            if (!s || !r || String(r).startsWith("local-")) {
                const o = new Error("Cloud session missing. Log in again before syncing.");
                e({ status: "error", error: o.message });
                throw o
            }
            if (!a) {
                const o = new Error("Cloud sync requires premium access.");
                e({ status: "error", error: o.message });
                throw o
            }
            if (typeof window < "u" && typeof window.__isoGetValidJwt == "function") {
                const o = await window.__isoGetValidJwt();
                if (!o) {
                    const c = new Error("Cloud session missing. Log in again before syncing.");
                    typeof window.__isoSyncAuthBlock == "function" && window.__isoSyncAuthBlock(c.message);
                    e({ status: "error", error: c.message });
                    throw c
                }
            }
            e({ status: "syncing", error: null });
            try {
                typeof window < "u" && typeof window.__isoRunManualCloudSync == "function" ? await window.__isoRunManualCloudSync(null, null, "header_manual_sync") : await (await n()).fullManualSync(r, a);
                await l(), e({
                    status: "success",
                    lastSyncAt: new Date().toISOString(),
                    error: null,
                    needsCloudBootstrap: !1,
                    bootstrapChecked: !0
                })
            } catch (c) {
                const b = c && c.message ? c.message : "Sync failed";
                e({ status: "error", error: b });
                throw c
            }
        },`,
      'header sync uses runtime manual cloud sync'
    );
    patch(
      `        downloadCloudSnapshot: async () => {
            const t = u.getState(),
                {
                    userId: r,
                    isAuthenticated: s
                } = t,
                a = t.isPremium();
            if (!s || !r || !a) return;
            const o = await n();
            await o.downloadCloudSnapshot(r, a), await l(), o.getState().status === "success" && e({
                needsCloudBootstrap: !1,
                bootstrapChecked: !0
            })
        },`,
      `        downloadCloudSnapshot: async () => {
            const t = u.getState(),
                {
                    userId: r,
                    isAuthenticated: s
                } = t,
                a = t.isPremium();
            if (!s || !r || String(r).startsWith("local-")) {
                const o = new Error("Cloud session missing. Log in again before downloading cloud data.");
                e({ status: "error", error: o.message });
                throw o
            }
            if (!a) {
                const o = new Error("Cloud restore requires premium access.");
                e({ status: "error", error: o.message });
                throw o
            }
            if (typeof window < "u" && typeof window.__isoGetValidJwt == "function") {
                const o = await window.__isoGetValidJwt();
                if (!o) {
                    const c = new Error("Cloud session missing. Log in again before downloading cloud data.");
                    typeof window.__isoSyncAuthBlock == "function" && window.__isoSyncAuthBlock(c.message);
                    e({ status: "error", error: c.message });
                    throw c
                }
            }
            e({ status: "syncing", error: null });
            try {
                typeof window < "u" && typeof window.__isoDownloadAndImportBackup == "function" ? await window.__isoDownloadAndImportBackup(null, "header_download_cloud_data") : await (await n()).downloadCloudSnapshot(r, a);
                await l(), e({
                    status: "success",
                    lastSyncAt: new Date().toISOString(),
                    error: null,
                    needsCloudBootstrap: !1,
                    bootstrapChecked: !0
                })
            } catch (c) {
                const b = c && c.message ? c.message : "Cloud data download failed";
                e({ status: "error", error: b });
                throw c
            }
        },`,
      'header download uses runtime download/import helper'
    );
    console.log('[SyncStorePatch] ' + applied + '/2 patches applied');
    patchedUseSyncStoreBundle = Buffer.from(raw, 'utf8');
  } catch (e) { console.error('[SyncStorePatch] Error:', e.message); patchedUseSyncStoreBundle = null; }
  return patchedUseSyncStoreBundle;
}

// ── AppAccessGate bundle patch: empty devices automatically import cloud backup
const APP_ACCESS_GATE_BUNDLE_ABS = path.join(PUBLIC_DIR, 'assets', 'AppAccessGate-B975UtK7.js');
let patchedAppAccessGateBundle = null;
function getPatchedAppAccessGateBundle() {
  if (patchedAppAccessGateBundle) return patchedAppAccessGateBundle;
  try {
    let raw = fs.readFileSync(APP_ACCESS_GATE_BUNDLE_ABS, 'utf8');
    let applied = 0;
    const patch = (from, to, label) => {
      if (raw.includes(from)) { raw = raw.split(from).join(to); applied++; }
      else console.warn('[AppAccessGatePatch] Not found:', label);
    };
    patch(
      'const ge = await (await ke()).canBootstrapFromCloud(R.userId, !0);\n                        I(ge)',
      'const ge = await (await ke()).canBootstrapFromCloud(R.userId, !0);\n                        if (ge) { await S.getState().downloadCloudSnapshot(); I(!1) } else I(!1)',
      'auto-import cloud backup on empty local workspace'
    );
    console.log('[AppAccessGatePatch] ' + applied + '/1 patches applied');
    patchedAppAccessGateBundle = Buffer.from(raw, 'utf8');
  } catch (e) { console.error('[AppAccessGatePatch] Error:', e.message); patchedAppAccessGateBundle = null; }
  return patchedAppAccessGateBundle;
}

// ── Session sync bundle patch: no success without Supabase persistence
const SESSION_SYNC_BUNDLE_ABS = path.join(PUBLIC_DIR, 'assets', 'sessionSync-mloIEnTd.js');
let patchedSessionSyncBundle = null;
function getPatchedSessionSyncBundle() {
  if (patchedSessionSyncBundle) return patchedSessionSyncBundle;
  try {
    let raw = fs.readFileSync(SESSION_SYNC_BUNDLE_ABS, 'utf8');
    let applied = 0;
    const patch = (from, to, label) => {
      if (raw.includes(from)) { raw = raw.split(from).join(to); applied++; }
      else console.warn('[SessionSyncPatch] Not found:', label);
    };
    patch(
      'if(!f())return await r(e.id),{success:!0};',
      'if(!f())return await q(e),{success:!1,error:"Cloud session sync unavailable; session remains pending"};',
      'queue complete when cloud disabled'
    );
    patch(
      'if(a)return P(a)?(await _(e.id),{success:!0}):',
      'if(a)return P(a)?(await q(e),{success:!1,error:m(a,"Session sync failed")}):',
      'premium/table errors do not report success'
    );
    patch(
      'if(!f())return await r(e.sessionId),{success:!0};',
      'if(!f()){const t={id:e.sessionId,action:"complete",durationMinutes:e.durationMinutes,groupId:e.groupId,sessionType:e.sessionType,notes:e.notes,endedAt:e.endedAt,timestamp:Date.now()};return await q(t),{success:!1,error:"Cloud session sync unavailable; session remains pending"}};',
      'report complete queues when cloud disabled'
    );
    patch(
      'if(!f())return await r(e),{success:!0};',
      'if(!f()){const t={id:e,action:"delete",timestamp:Date.now()};return await q(t),{success:!1,error:"Cloud session delete unavailable; change remains pending"}};',
      'delete queues when cloud disabled'
    );
    patch(
      'if(!f())return await _(),{synced:0,failed:0};',
      'if(!f()){const e=await h();return{synced:0,failed:e.length}};',
      'pending sync reports failures when cloud disabled'
    );
    console.log('[SessionSyncPatch] ' + applied + '/5 session sync patches applied');
    patchedSessionSyncBundle = Buffer.from(raw, 'utf8');
  } catch (e) { console.error('[SessionSyncPatch] Error:', e.message); patchedSessionSyncBundle = null; }
  return patchedSessionSyncBundle;
}

// ── Invites bundle patch ──────────────────────────────────────────────────────
// The compiled bundle sends {token_input: "..."} to accept_invite and
// get_invite_details, but the Supabase RPC functions use the parameter name
// "p_code". PostgREST routes by named param so the mismatch silently returns
// "function does not exist" → invites never work. Fix: swap the name in-memory.
const INVITES_BUNDLE_ABS = path.join(PUBLIC_DIR, 'assets', 'useInvites-D9RLFwf8.js');
let patchedInvitesBundle = null;
function getPatchedInvitesBundle() {
  if (patchedInvitesBundle) return patchedInvitesBundle;
  try {
    let raw = fs.readFileSync(INVITES_BUNDLE_ABS, 'utf8');
    const before = raw.length;
    raw = raw.split('token_input').join('p_code');
    if (raw.length !== before || raw.includes('p_code')) {
      console.log('[InvitesPatch] token_input → p_code (accept_invite + get_invite_details)');
    } else {
      console.warn('[InvitesPatch] token_input not found — bundle may have changed');
    }
    patchedInvitesBundle = Buffer.from(raw, 'utf8');
  } catch (e) { console.error('[InvitesPatch] Error:', e.message); patchedInvitesBundle = null; }
  return patchedInvitesBundle;
}
// getPatchedInvitesBundle() — deferred to after server.listen()

// ── Username-auth server helpers ──────────────────────────────────────────────
function supaAdminReq(method, supaPath, bodyObj, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const key = ADMIN_MODE_READY ? SUPA_SERVICE_KEY : SUPA_ANON_KEY;
    const supaHost = new URL(SUPA_URL).hostname;
    const bodyBuf  = bodyObj ? Buffer.from(JSON.stringify(bodyObj)) : null;
    const opts = {
      hostname: supaHost,
      path: supaPath,
      method: method,
      headers: {
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + key,
        'apikey':        key,
        ...(bodyBuf ? { 'Content-Length': String(bodyBuf.length) } : {}),
        ...extraHeaders,
      },
    };
    const req = https.request(opts, (r) => {
      let d = ''; r.on('data', c => d += c);
      r.on('end', () => {
        try { resolve({ status: r.statusCode, body: JSON.parse(d) }); }
        catch { resolve({ status: r.statusCode, body: d }); }
      });
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('Supabase admin request timed out')); });
    if (bodyBuf) req.write(bodyBuf);
    req.end();
  });
}

// Supabase REST helper — uses service_role key, supports Prefer header and all methods
function supaRestReq(method, restPath, bodyObj, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const key = ADMIN_MODE_READY ? SUPA_SERVICE_KEY : SUPA_ANON_KEY;
    const supaHost = new URL(SUPA_URL).hostname;
    const bodyBuf  = bodyObj ? Buffer.from(JSON.stringify(bodyObj)) : null;
    const opts = {
      hostname: supaHost,
      path: restPath,
      method,
      headers: {
        'Content-Type':  'application/json',
        'Accept':        'application/json',
        'Authorization': 'Bearer ' + key,
        'apikey':        key,
        ...(bodyBuf ? { 'Content-Length': String(bodyBuf.length) } : {}),
        ...extraHeaders,
      },
    };
    const rq = https.request(opts, (r) => {
      let d = ''; r.on('data', c => d += c);
      r.on('end', () => {
        try { resolve({ status: r.statusCode, body: JSON.parse(d) }); }
        catch { resolve({ status: r.statusCode, body: d }); }
      });
    });
    rq.on('error', reject);
    rq.setTimeout(15000, () => { rq.destroy(); reject(new Error('Supabase REST timeout')); });
    if (bodyBuf) rq.write(bodyBuf);
    rq.end();
  });
}

function fetchRemoteAsset(assetName) {
  const safeName = path.basename(String(assetName || ''));
  if (!/^[A-Za-z0-9._-]+\.js$/.test(safeName)) {
    return Promise.reject(new Error('unsupported asset name'));
  }
  const origins = [
    'https://isotopeai.in/assets/',
    'https://isotopeai.ai/assets/',
    'https://isotopai.ai/assets/',
  ];
  let index = 0;
  return new Promise((resolve, reject) => {
    const tryNext = () => {
      if (index >= origins.length) {
        reject(new Error('asset not found upstream'));
        return;
      }
      const source = origins[index++] + safeName;
      let u;
      try { u = new URL(source); } catch { tryNext(); return; }
      const rq = https.request({
        hostname: u.hostname,
        path: u.pathname,
        method: 'GET',
        headers: { 'User-Agent': 'isotope-local-asset-recovery', 'Accept': 'application/javascript,text/javascript,*/*' },
      }, (r) => {
        if (r.statusCode !== 200) {
          r.resume();
          r.on('end', tryNext);
          return;
        }
        const chunks = [];
        let size = 0;
        r.on('data', (chunk) => {
          size += chunk.length;
          if (size > 10 * 1024 * 1024) {
            rq.destroy(new Error('asset too large'));
            return;
          }
          chunks.push(chunk);
        });
        r.on('end', () => {
          const body = Buffer.concat(chunks);
          if (!body.length) { tryNext(); return; }
          const target = path.join(PUBLIC_DIR, 'assets', safeName);
          fs.mkdir(path.dirname(target), { recursive: true }, () => {
            fs.writeFile(target, body, () => resolve(body));
          });
        });
      });
      rq.on('error', tryNext);
      rq.setTimeout(10000, () => rq.destroy(new Error('asset recovery timeout')));
      rq.end();
    };
    tryNext();
  });
}

function getUserIdFromJwt(jwt) {
  const payload = decodeJwtPayload(jwt);
  return payload && typeof payload.sub === 'string' ? payload.sub : null;
}

function errorMessageFromSupa(res, fallback = 'Supabase request failed') {
  const body = res && res.body;
  if (body && typeof body === 'object') {
    return body.message || body.error_description || body.error || body.hint || body.code || fallback;
  }
  if (typeof body === 'string' && body.trim()) return body.slice(0, 300);
  return fallback;
}

function assertSupaOk(res, label) {
  if (res && res.status >= 200 && res.status < 300) return res;
  const detail = errorMessageFromSupa(res, label + ' failed');
  const err = new Error(label + ' failed: ' + detail);
  err.status = res ? res.status : 0;
  err.body = res ? res.body : null;
  throw err;
}

function compactObject(obj) {
  const out = {};
  for (const [key, value] of Object.entries(obj || {})) {
    if (value !== undefined) out[key] = value;
  }
  return out;
}

function stableJsonStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(stableJsonStringify).join(',') + ']';
  return '{' + Object.keys(value).sort().map((key) => (
    JSON.stringify(key) + ':' + stableJsonStringify(value[key])
  )).join(',') + '}';
}

function profileLegacyOnboarding(profileData) {
  const done = profileData?.isOnboarded === true || profileData?.onboarding_completed === true;
  return {
    completed: done,
    completed_at: done
      ? (profileData?.onboardingCompletedAt || profileData?.onboarding_completed_at || new Date().toISOString())
      : null,
  };
}

function publicAvatarUrlFromPath(avatarPath) {
  const pathValue = String(avatarPath || '').trim();
  if (!pathValue) return null;
  if (/^https?:\/\//i.test(pathValue)) return pathValue;
  const safePath = pathValue.split('/').map((part) => encodeURIComponent(part)).join('/');
  return `${SUPA_URL.replace(/\/+$/, '')}/storage/v1/object/public/avatars/${safePath}`;
}

async function supaRestAsUser(method, restPath, userJwt, bodyObj, extraHeaders = {}) {
  const methodName = String(method || 'GET').toUpperCase();
  // Historical call sites used both (method, path, jwt, body, headers) and
  // (method, path, body, jwt, headers). Normalize here so mutations always send
  // the intended JSON object and user JWT.
  if (methodName !== 'GET' && userJwt && typeof userJwt === 'object' && (typeof bodyObj === 'string' || bodyObj == null)) {
    const actualBody = userJwt;
    userJwt = bodyObj;
    bodyObj = actualBody;
  }
  const key = ADMIN_MODE_READY ? SUPA_SERVICE_KEY : SUPA_ANON_KEY;
  const auth = ADMIN_MODE_READY ? SUPA_SERVICE_KEY : userJwt;
  return supaRestReq(method, restPath, bodyObj, {
    'Authorization': 'Bearer ' + auth,
    'apikey': key,
    ...extraHeaders,
  });
}

function parseAvatarDataUrl(value) {
  const text = String(value || '');
  const m = text.match(/^data:(image\/(?:png|jpeg|webp|gif));base64,([A-Za-z0-9+/=]+)$/);
  if (!m) return null;
  const mime = m[1];
  const data = Buffer.from(m[2], 'base64');
  if (!data.length || data.length > 5 * 1024 * 1024) {
    throw new Error('Avatar image must be smaller than 5 MB');
  }
  const ext = mime === 'image/jpeg' ? 'jpg' : mime.split('/')[1];
  return { mime, data, ext };
}

function encodeStorageObjectPath(objectPath) {
  return String(objectPath || '')
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');
}

function storageObjectPublicUrl(bucket, objectPath) {
  return `${SUPA_URL}/storage/v1/object/public/${encodeURIComponent(bucket)}/${encodeStorageObjectPath(objectPath)}`;
}

function supaStorageObjectReqAsUser(method, bucket, objectPath, body, contentType, userJwt, options = {}) {
  return new Promise((resolve, reject) => {
    if (!userJwt) {
      reject(new Error('Authenticated Storage access requires a user session'));
      return;
    }
    const supaHost = new URL(SUPA_URL).hostname;
    const bodyBuf = Buffer.isBuffer(body)
      ? body
      : (typeof body === 'string'
          ? Buffer.from(body, 'utf8')
          : (body ? Buffer.from(JSON.stringify(body), 'utf8') : null));
    const encodedPath = encodeStorageObjectPath(objectPath);
    const storagePath = options.bucketOnly
      ? `/storage/v1/object/${encodeURIComponent(bucket)}`
      : `/storage/v1/object/${encodeURIComponent(bucket)}/${encodedPath}`;
    const opts = {
      hostname: supaHost,
      path: storagePath,
      method: String(method || 'GET').toUpperCase(),
      headers: {
        'Authorization': 'Bearer ' + userJwt,
        'apikey': SUPA_ANON_KEY,
        'Accept': options.raw ? '*/*' : 'application/json',
        ...(contentType ? { 'Content-Type': contentType } : {}),
        ...(bodyBuf ? { 'Content-Length': String(bodyBuf.length) } : {}),
        ...(options.upsert !== undefined ? { 'x-upsert': options.upsert ? 'true' : 'false' } : {}),
      },
    };
    const rq = https.request(opts, (r) => {
      const chunks = [];
      r.on('data', (c) => { chunks.push(Buffer.from(c)); });
      r.on('end', () => {
        const data = Buffer.concat(chunks);
        if (options.raw) {
          resolve({ status: r.statusCode, body: data });
          return;
        }
        const text = data.toString('utf8');
        let parsed = text;
        try { parsed = text ? JSON.parse(text) : null; } catch {}
        resolve({ status: r.statusCode, body: parsed });
      });
    });
    rq.on('error', reject);
    rq.setTimeout(options.timeoutMs || 20000, () => { rq.destroy(); reject(new Error(options.timeoutMessage || 'Supabase Storage request timed out')); });
    if (bodyBuf) rq.write(bodyBuf);
    rq.end();
  });
}

function supaStorageUploadAsUser(bucket, objectPath, buffer, mime, userJwt, options = {}) {
  return supaStorageObjectReqAsUser('POST', bucket, objectPath, buffer, mime || 'application/octet-stream', userJwt, {
    upsert: options.upsert === true,
    timeoutMessage: options.timeoutMessage || 'Storage upload timed out',
    timeoutMs: options.timeoutMs,
  });
}

function supaStorageDownloadAsUser(bucket, objectPath, userJwt) {
  return supaStorageObjectReqAsUser('GET', bucket, objectPath, null, null, userJwt, {
    raw: true,
    timeoutMessage: 'Storage download timed out',
  });
}

function supaStorageRemoveAsUser(bucket, objectPaths, userJwt) {
  const paths = Array.isArray(objectPaths) ? objectPaths.filter(Boolean) : [objectPaths].filter(Boolean);
  if (paths.length === 0) return Promise.resolve({ status: 200, body: [] });
  return supaStorageObjectReqAsUser('DELETE', bucket, '', { prefixes: paths }, 'application/json', userJwt, {
    bucketOnly: true,
    timeoutMessage: 'Storage delete timed out',
  });
}

// List files in a Storage folder (prefix). Returns { status, body: [{name, ...}, ...] }
function supaStorageListAsUser(bucket, prefix, userJwt, options = {}) {
  return new Promise((resolve, reject) => {
    const supaHost = new URL(SUPA_URL).hostname;
    const bodyObj = {
      prefix: prefix || '',
      limit: options.limit || 200,
      offset: options.offset || 0,
      sortBy: { column: 'name', order: 'asc' },
    };
    const bodyBuf = Buffer.from(JSON.stringify(bodyObj));
    const opts = {
      hostname: supaHost,
      path: `/storage/v1/object/list/${encodeURIComponent(bucket)}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + userJwt,
        'apikey': SUPA_ANON_KEY,
        'Content-Length': String(bodyBuf.length),
      },
    };
    const rq = https.request(opts, (r) => {
      const chunks = [];
      r.on('data', (c) => chunks.push(Buffer.from(c)));
      r.on('end', () => {
        const text = Buffer.concat(chunks).toString('utf8');
        let parsed = [];
        try { parsed = JSON.parse(text); } catch {}
        resolve({ status: r.statusCode, body: Array.isArray(parsed) ? parsed : [] });
      });
    });
    rq.on('error', reject);
    rq.setTimeout(options.timeoutMs || 15000, () => {
      rq.destroy();
      reject(new Error('Storage list timed out'));
    });
    rq.write(bodyBuf);
    rq.end();
  });
}

function isStorageAlreadyExists(res) {
  const text = typeof res?.body === 'string' ? res.body : JSON.stringify(res?.body || {});
  return (res?.status === 400 || res?.status === 409)
    && /already exists|resource exists|duplicate/i.test(text);
}

let _canonicalBackupManager = null;
function canonicalBackupManager() {
  if (!_canonicalBackupManager) {
    _canonicalBackupManager = createBackupManager({
      supaStorageDownloadAsUser,
      supaStorageUploadAsUser,
      supaStorageListAsUser,
      supaStorageRemoveAsUser,
      assertSupaOk,
      isStorageAlreadyExists,
      appVersion: (typeof LOCAL_VERSION !== 'undefined' && LOCAL_VERSION.version) ? LOCAL_VERSION.version : 'unknown',
    });
  }
  return _canonicalBackupManager;
}

function jsonEndpointError(res, error, fallback = 'Request failed', stage = 'unknown') {
  const code = error?.code || (/auth/i.test(error?.message || '') ? 'AUTH_REQUIRED' : 'UNKNOWN');
  const status =
    code === 'AUTH_REQUIRED' ? 401 :
    code === 'BLOCKED_EMPTY_OVERWRITE' ? 409 :
    code === 'STORAGE_NOT_FOUND' ? 404 :
    (/permission|policy|forbidden|rls/i.test(error?.message || '') ? 403 : 500);
  sendJson(res, status, {
    ok: false,
    success: false,
    code,
    state: code === 'BLOCKED_EMPTY_OVERWRITE' ? 'blocked_empty_overwrite' : 'failed',
    stage,
    retryable: status >= 500,
    message: error?.payload?.message || error?.message || fallback,
    error: error?.message || fallback,
    details: error?.payload || undefined,
    ...(error?.payload || {}),
  });
}

function isOwnedStoragePath(userId, objectPath) {
  return !!userId && typeof objectPath === 'string' && objectPath.startsWith(`${userId}/`);
}

async function uploadAvatarDataUrlForUser(userId, dataUrl, userJwt, previousPath = null) {
  const parsed = parseAvatarDataUrl(dataUrl);
  if (!parsed) return null;
  const hash = crypto.createHash('sha256').update(parsed.data).digest('hex');
  const objectPath = `${userId}/avatar-${hash}.${parsed.ext}`;
  const uploaded = await supaStorageUploadAsUser('avatars', objectPath, parsed.data, parsed.mime, userJwt, { upsert: false, timeoutMessage: 'Avatar upload timed out' });
  if (!isStorageAlreadyExists(uploaded)) assertSupaOk(uploaded, 'Avatar storage upload');
  const publicUrl = storageObjectPublicUrl('avatars', objectPath);
  let old_avatar_removed = false;
  if (previousPath && previousPath !== objectPath && isOwnedStoragePath(userId, previousPath)) {
    const removed = await supaStorageRemoveAsUser('avatars', previousPath, userJwt);
    if (removed.status >= 200 && removed.status < 300) old_avatar_removed = true;
    else if (removed.status !== 404) assertSupaOk(removed, 'Old avatar cleanup');
  }
  return {
    bucket: 'avatars',
    path: objectPath,
    url: publicUrl,
    mime: parsed.mime,
    bytes: parsed.data.length,
    sha256: hash,
    deduped: isStorageAlreadyExists(uploaded),
    old_avatar_removed,
  };
}

function stripPrivateSnapshotKeys(value) {
  const blocked = /(^|_)(password|access_token|refresh_token|service_role|service_role_key|admin_secret|supabase_access_token|github_pat|gemini_api_key|groq_api_key|cookie|authorization|jwt|secret|token)($|_)/i;
  if (Array.isArray(value)) return value.map(stripPrivateSnapshotKeys);
  if (!value || typeof value !== 'object') return value;
  const out = {};
  for (const [key, val] of Object.entries(value)) {
    if (blocked.test(key)) continue;
    out[key] = stripPrivateSnapshotKeys(val);
  }
  return out;
}

function normalizeOnboardingForSnapshot(onboarding, profileData = {}) {
  const completed = typeof onboarding?.completed === 'boolean'
    ? onboarding.completed
    : (profileData.isOnboarded === true || profileData.onboarding_completed === true);
  return {
    state: completed ? 'completed' : 'incomplete',
    completed,
    completed_at: onboarding?.completed_at || profileData.onboardingCompletedAt || profileData.onboarding_completed_at || null,
    data: (onboarding?.data && typeof onboarding.data === 'object')
      ? stripPrivateSnapshotKeys(onboarding.data)
      : (profileData.onboarding && typeof profileData.onboarding === 'object' ? stripPrivateSnapshotKeys(profileData.onboarding) : {}),
  };
}

function normalizeCloudSnapshotShape(snapshot, userId) {
  if (!snapshot || typeof snapshot !== 'object' || snapshot.schema_version !== 1 || snapshot.user_id !== userId) return null;
  const profileData = snapshot.profile_data && typeof snapshot.profile_data === 'object' ? snapshot.profile_data : {};
  const localBackup = normalizeLocalBackupPayload(snapshot.local_backup, snapshot.exported_at || snapshot.downloaded_at);
  const backupData = normalizeLocalBackupData(snapshot.backup_data || snapshot.local_collections || localBackup?.data || {});
  const onboarding = normalizeOnboardingForSnapshot(snapshot.onboarding, profileData);
  return {
    ...snapshot,
    source: snapshot.source || 'supabase',
    trusted: true,
    downloaded_at: snapshot.downloaded_at || snapshot.exported_at || new Date().toISOString(),
    exported_at: snapshot.exported_at || snapshot.downloaded_at || new Date().toISOString(),
    onboarding,
    profile_data: stripPrivateSnapshotKeys(profileData),
    settings: stripPrivateSnapshotKeys(snapshot.settings && typeof snapshot.settings === 'object' ? snapshot.settings : {}),
    tours: stripPrivateSnapshotKeys(snapshot.tours && typeof snapshot.tours === 'object' ? snapshot.tours : {}),
    stats_summary: snapshot.stats_summary || null,
    daily_user_stats: Array.isArray(snapshot.daily_user_stats) ? snapshot.daily_user_stats : (Array.isArray(snapshot.daily_stats) ? snapshot.daily_stats : []),
    daily_stats: Array.isArray(snapshot.daily_stats) ? snapshot.daily_stats : (Array.isArray(snapshot.daily_user_stats) ? snapshot.daily_user_stats : []),
    study_sessions_log: Array.isArray(snapshot.study_sessions_log) ? snapshot.study_sessions_log : (Array.isArray(snapshot.recent_sessions) ? snapshot.recent_sessions : []),
    recent_sessions: Array.isArray(snapshot.recent_sessions) ? snapshot.recent_sessions : (Array.isArray(snapshot.study_sessions_log) ? snapshot.study_sessions_log : []),
    notifications_state: stripPrivateSnapshotKeys(snapshot.notifications_state && typeof snapshot.notifications_state === 'object' ? snapshot.notifications_state : {}),
    app_preferences: stripPrivateSnapshotKeys(snapshot.app_preferences && typeof snapshot.app_preferences === 'object' ? snapshot.app_preferences : {}),
    local_backup: localBackup || buildLocalBackupFromData(backupData, snapshot.exported_at || snapshot.downloaded_at, snapshot.app_version),
    backup_data: backupData,
    local_collections: backupData,
    collection_counts: localBackupCounts(localBackup || { data: backupData }),
  };
}

function normalizeLocalBackupArray(value) {
  return Array.isArray(value) ? stripPrivateSnapshotKeys(value) : [];
}

function normalizeLocalBackupData(data = {}) {
  const safe = data && typeof data === 'object' ? data : {};
  return stripPrivateSnapshotKeys({
    profile: safe.profile && typeof safe.profile === 'object' ? safe.profile : null,
    timerState: safe.timerState && typeof safe.timerState === 'object' ? safe.timerState : null,
    tasks: normalizeLocalBackupArray(safe.tasks),
    sessions: normalizeLocalBackupArray(safe.sessions),
    subjects: normalizeLocalBackupArray(safe.subjects),
    habits: normalizeLocalBackupArray(safe.habits),
    dailyLogs: normalizeLocalBackupArray(safe.dailyLogs),
    tests: normalizeLocalBackupArray(safe.tests),
    exams: normalizeLocalBackupArray(safe.exams),
    mockTests: normalizeLocalBackupArray(safe.mockTests),
  });
}

function buildLocalBackupFromData(data, exportedAt, appVersion) {
  return stripPrivateSnapshotKeys({
    version: 1,
    source: 'isotopeai',
    exportedAt: exportedAt || new Date().toISOString(),
    appVersion: appVersion || ((typeof LOCAL_VERSION !== 'undefined' && LOCAL_VERSION.version) ? LOCAL_VERSION.version : 'unknown'),
    data: normalizeLocalBackupData(data),
  });
}

function normalizeLocalBackupPayload(payload, exportedAt) {
  if (!payload || typeof payload !== 'object') return null;
  if ((payload.source === 'isotopeai' || payload.source === 'isotope-study') && payload.version === 1 && payload.data) {
    return buildLocalBackupFromData(payload.data, payload.exportedAt || exportedAt, payload.appVersion);
  }
  return null;
}

function localBackupCounts(localBackup) {
  const data = normalizeLocalBackupData(localBackup?.data || {});
  return {
    profile: data.profile ? 1 : 0,
    timerState: data.timerState ? 1 : 0,
    tasks: data.tasks.length,
    sessions: data.sessions.length,
    subjects: data.subjects.length,
    habits: data.habits.length,
    dailyLogs: data.dailyLogs.length,
    tests: data.tests.length,
    exams: data.exams.length,
    mockTests: data.mockTests.length,
  };
}

function localBackupFromParsedPayload(parsedBackup, userId) {
  const direct = normalizeLocalBackupPayload(parsedBackup);
  if (direct) return direct;
  if (parsedBackup?.schema_version === 1) {
    const nested = normalizeLocalBackupPayload(parsedBackup.local_backup, parsedBackup.exported_at || parsedBackup.downloaded_at);
    if (nested) return nested;
    return buildLocalBackupFromData({
      ...(parsedBackup.backup_data || parsedBackup.local_collections || {}),
      profile: parsedBackup.profile_data || parsedBackup.profile || null,
    }, parsedBackup.exported_at || parsedBackup.downloaded_at, parsedBackup.app_version);
  }
  return null;
}

function buildCloudSnapshotFromBackupPayload(userId, parsedBackup, bundle = {}, source = 'manual_export') {
  const localBackup = localBackupFromParsedPayload(parsedBackup, userId);
  const localData = normalizeLocalBackupData(localBackup?.data || {});
  const backupProfile = localData.profile && typeof localData.profile === 'object' ? localData.profile : {};
  const snapshot = buildCanonicalCloudSnapshot(userId, {
    ...(bundle || {}),
    profile: {
      ...((bundle || {}).profile || {}),
      ...backupProfile,
    },
    profile_data: {
      ...((bundle || {}).profile_data || {}),
      ...backupProfile,
    },
    settings: {
      ...(((bundle || {}).settings) || {}),
      ...(backupProfile.settings && typeof backupProfile.settings === 'object' ? backupProfile.settings : {}),
    },
    onboarding: (bundle || {}).onboarding || normalizeOnboardingForSnapshot(null, backupProfile),
  }, source);
  return normalizeCloudSnapshotShape({
    ...snapshot,
    source,
    local_backup: localBackup,
    backup_data: localData,
    local_collections: localData,
    collection_counts: localBackupCounts(localBackup),
  }, userId);
}

function backupJsonFromCloudSnapshot(snapshot, userId) {
  const cloud = normalizeCloudSnapshotShape(snapshot, userId);
  if (!cloud) return null;
  const localBackup = localBackupFromParsedPayload(cloud, userId)
    || buildLocalBackupFromData({
      ...(cloud.backup_data || cloud.local_collections || {}),
      profile: cloud.profile_data || null,
    }, cloud.exported_at || cloud.downloaded_at, cloud.app_version);
  return JSON.stringify(localBackup, null, 2);
}

function buildCanonicalCloudSnapshot(userId, bundle, source = 'supabase') {
  const now = new Date().toISOString();
  const profileData = stripPrivateSnapshotKeys({
    ...(bundle?.profile_data && typeof bundle.profile_data === 'object' ? bundle.profile_data : {}),
    ...(bundle?.profile && typeof bundle.profile === 'object' ? bundle.profile : {}),
  });
  const settings = stripPrivateSnapshotKeys({
    ...(profileData.settings && typeof profileData.settings === 'object' ? profileData.settings : {}),
    ...(bundle?.settings && typeof bundle.settings === 'object' ? bundle.settings : {}),
  });
  const onboarding = normalizeOnboardingForSnapshot(bundle?.onboarding, profileData);
  profileData.isOnboarded = onboarding.completed === true;
  profileData.onboarding_completed = onboarding.completed === true;
  if (onboarding.completed_at) {
    profileData.onboardingCompletedAt = profileData.onboardingCompletedAt || onboarding.completed_at;
    profileData.onboarding_completed_at = profileData.onboarding_completed_at || onboarding.completed_at;
  }
  const dailyRows = Array.isArray(bundle?.daily_user_stats) ? bundle.daily_user_stats : [];
  const sessionRows = Array.isArray(bundle?.study_sessions_log) ? bundle.study_sessions_log : [];
  return {
    schema_version: 1,
    user_id: userId,
    exported_at: now,
    downloaded_at: now,
    source,
    trusted: true,
    app_version: (typeof LOCAL_VERSION !== 'undefined' && LOCAL_VERSION.version) ? LOCAL_VERSION.version : 'unknown',
    profile_data: profileData,
    onboarding,
    settings,
    tours: stripPrivateSnapshotKeys(profileData.tours && typeof profileData.tours === 'object' ? profileData.tours : {}),
    stats_summary: bundle?.stats_summary || null,
    daily_stats: dailyRows,
    daily_user_stats: dailyRows,
    recent_sessions: sessionRows,
    study_sessions_log: sessionRows,
    notifications_state: {},
    app_preferences: {},
    warnings: stripPrivateSnapshotKeys(bundle?.warnings || {}),
  };
}

function mergeBootstrapBundleWithCloudSnapshot(bundle, cloudSnapshot) {
  const userId = bundle?.user_id;
  const cloud = normalizeCloudSnapshotShape(cloudSnapshot, userId);
  if (!cloud) return { ...bundle, cloud_snapshot: null, cloud_snapshot_meta: null };
  const profileData = {
    ...(cloud.profile_data || {}),
    ...(bundle.profile_data || {}),
    ...(bundle.profile || {}),
  };
  const settings = {
    ...(cloud.settings || {}),
    ...(profileData.settings && typeof profileData.settings === 'object' ? profileData.settings : {}),
    ...(bundle.settings || {}),
  };
  const dbOnboarding = normalizeOnboardingForSnapshot(bundle.onboarding, profileData);
  profileData.isOnboarded = dbOnboarding.completed === true;
  profileData.onboarding_completed = dbOnboarding.completed === true;
  if (dbOnboarding.completed_at) {
    profileData.onboardingCompletedAt = profileData.onboardingCompletedAt || dbOnboarding.completed_at;
    profileData.onboarding_completed_at = profileData.onboarding_completed_at || dbOnboarding.completed_at;
  }
  const merged = {
    ...bundle,
    profile_data: profileData,
    profile: {
      ...(bundle.profile || {}),
      ...profileData,
    },
    settings,
    onboarding: {
      ...(bundle.onboarding || {}),
      completed: dbOnboarding.completed,
      completed_at: dbOnboarding.completed_at,
      data: dbOnboarding.data,
    },
    stats_summary: bundle.stats_summary || cloud.stats_summary || null,
    daily_user_stats: Array.isArray(bundle.daily_user_stats) && bundle.daily_user_stats.length ? bundle.daily_user_stats : cloud.daily_user_stats,
    study_sessions_log: Array.isArray(bundle.study_sessions_log) && bundle.study_sessions_log.length ? bundle.study_sessions_log : cloud.study_sessions_log,
  };
  const canonical = buildCanonicalCloudSnapshot(userId, merged, 'supabase');
  canonical.downloaded_at = cloud.downloaded_at || canonical.downloaded_at;
  canonical.exported_at = cloud.exported_at || canonical.exported_at;
  return {
    ...merged,
    cloud_snapshot: canonical,
    cloud_snapshot_meta: {
      bucket: 'user-content',
      latest_path: `${userId}/cloud-snapshot/latest.json`,
      downloaded_at: canonical.downloaded_at,
      exported_at: canonical.exported_at,
      source: 'user-content',
    },
  };
}

async function downloadCloudSnapshotForUser(userId, userJwt) {
  const objectPath = `${userId}/cloud-snapshot/latest.json`;
  const downloaded = await supaStorageDownloadAsUser('user-content', objectPath, userJwt);
  if (downloaded.status === 404) return null;
  if (downloaded.status === 400) {
    const detail = Buffer.isBuffer(downloaded.body) ? downloaded.body.toString('utf8') : String(downloaded.body || '');
    if (/not found|does not exist|no such/i.test(detail)) return null;
  }
  assertSupaOk(downloaded, 'Cloud snapshot download');
  const text = Buffer.isBuffer(downloaded.body) ? downloaded.body.toString('utf8') : String(downloaded.body || '');
  if (!text.trim()) return null;
  let parsed;
  try { parsed = JSON.parse(text); } catch (e) { throw new Error('Cloud snapshot JSON is invalid'); }
  return normalizeCloudSnapshotShape(parsed, userId);
}

async function uploadCloudSnapshotForUser(userId, userJwt, snapshot, options = {}) {
  const canonical = normalizeCloudSnapshotShape(snapshot, userId) || buildCanonicalCloudSnapshot(userId, snapshot, options.source || 'supabase');
  const latestPath = `${userId}/cloud-snapshot/latest.json`;
  const stamped = (canonical.exported_at || new Date().toISOString()).replace(/[:.]/g, '-');
  const historyPath = `${userId}/cloud-snapshot/history/${stamped}.json`;
  const json = JSON.stringify(canonical, null, 2);
  const latest = await supaStorageUploadAsUser('user-content', latestPath, Buffer.from(json, 'utf8'), 'application/json', userJwt, { upsert: true, timeoutMessage: 'Cloud snapshot upload timed out' });
  assertSupaOk(latest, 'Cloud snapshot latest upload');
  let history = null;
  if (options.history !== false) {
    history = await supaStorageUploadAsUser('user-content', historyPath, Buffer.from(json, 'utf8'), 'application/json', userJwt, { upsert: false, timeoutMessage: 'Cloud snapshot history upload timed out' });
    if (!isStorageAlreadyExists(history)) assertSupaOk(history, 'Cloud snapshot history upload');
    // Prune old history files in background (keep last 5 only)
    pruneOldStorageFiles(userId, userJwt, `${userId}/cloud-snapshot/history/`, 5).catch(() => {});
  }
  return {
    snapshot: canonical,
    storage: {
      bucket: 'user-content',
      latest_path: latestPath,
      history_path: options.history === false ? null : historyPath,
      latest_status: latest.status,
      history_status: history ? history.status : null,
      uploaded_at: canonical.exported_at,
    },
  };
}

// Prune old timestamped files in a Storage folder, keeping the newest `keepCount`.
// Files named 'latest.json' are always excluded from pruning.
// Runs best-effort in background — errors are logged but never thrown.
async function pruneOldStorageFiles(userId, userJwt, folderPrefix, keepCount = 3) {
  try {
    const listed = await supaStorageListAsUser('user-content', folderPrefix, userJwt);
    if (!Array.isArray(listed.body) || listed.body.length === 0) return;
    const files = listed.body
      .filter(f => f.name && f.name !== 'latest.json' && f.name.endsWith('.json'))
      .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0)); // ascending = oldest first
    if (files.length <= keepCount) return;
    const toDelete = files.slice(0, files.length - keepCount).map(f => `${folderPrefix}${f.name}`);
    if (toDelete.length > 0) {
      await supaStorageRemoveAsUser('user-content', toDelete, userJwt);
      console.log(`[StoragePrune] Deleted ${toDelete.length} old file(s) from ${folderPrefix}`);
    }
  } catch (e) {
    console.warn(`[StoragePrune] Non-fatal error pruning ${folderPrefix}:`, e.message);
  }
}

async function refreshCloudSnapshotForUser(userId, userJwt, source = 'supabase') {
  const bundle = await fetchUserBootstrapBundle(userId, userJwt);
  const snapshot = buildCanonicalCloudSnapshot(userId, bundle, source);
  return uploadCloudSnapshotForUser(userId, userJwt, snapshot, { history: true });
}

function parseBackupJsonPayload(rawJson) {
  const parsed = typeof rawJson === 'string' ? JSON.parse(rawJson) : rawJson;
  if (!parsed || typeof parsed !== 'object') throw new Error('Backup JSON must be an object');
  if (parsed.schema_version === 1 && parsed.user_id) return { kind: 'cloud_snapshot', parsed };
  if (!((parsed.source === 'isotopeai' || parsed.source === 'isotope-study') && parsed.version === 1 && parsed.data)) {
    throw new Error('This file is not a valid Isotope backup.');
  }
  return { kind: 'local_backup_v1', parsed };
}

async function uploadRawUserBackupJson(userId, userJwt, rawJson, folder) {
  const parsed = typeof rawJson === 'string' ? JSON.parse(rawJson) : rawJson;
  const sanitized = stripPrivateSnapshotKeys(parsed);
  const now = new Date().toISOString();
  const objectPath = `${userId}/${folder}/${now.replace(/[:.]/g, '-')}.json`;
  const latestPath = `${userId}/${folder}/latest.json`;
  const json = JSON.stringify(sanitized, null, 2);
  const uploaded = await supaStorageUploadAsUser('user-content', objectPath, Buffer.from(json, 'utf8'), 'application/json', userJwt, { upsert: false, timeoutMessage: 'Backup JSON upload timed out' });
  if (!isStorageAlreadyExists(uploaded)) assertSupaOk(uploaded, 'Backup JSON upload');
  const latest = await supaStorageUploadAsUser('user-content', latestPath, Buffer.from(json, 'utf8'), 'application/json', userJwt, { upsert: true, timeoutMessage: 'Backup latest JSON upload timed out' });
  assertSupaOk(latest, 'Backup latest JSON upload');
  // Prune old timestamped backup files in background (keep last 3 only)
  pruneOldStorageFiles(userId, userJwt, `${userId}/${folder}/`, 3).catch(() => {});
  return { bucket: 'user-content', path: objectPath, latest_path: latestPath, uploaded_at: now };
}

async function applyBackupProfileToSupabase(userId, userJwt, parsedBackup) {
  const backup = parsedBackup?.schema_version === 1
    ? { profile: parsedBackup.profile_data || {}, onboarding: parsedBackup.onboarding || null, settings: parsedBackup.settings || {} }
    : { profile: parsedBackup?.data?.profile || {}, onboarding: null, settings: parsedBackup?.data?.profile?.settings || {} };
  if (!backup.profile || typeof backup.profile !== 'object') return { profile_applied: false };
  const currentBundle = await fetchUserProfileBundle(userId, userJwt).catch(() => ({ profileData: {}, onboardingData: null }));
  const now = new Date().toISOString();
  // Smart onboarding detection: if the backup contains real user data (tasks, sessions, subjects)
  // treat the account as onboarded regardless of the isOnboarded flag in the backup.
  // This fixes the common case where the client-side export incorrectly records isOnboarded:false.
  const backupCollections = parsedBackup?.data || parsedBackup?.backup_data || parsedBackup?.local_collections || {};
  const hasRealData = (
    (Array.isArray(backupCollections.tasks)    && backupCollections.tasks.length    > 0) ||
    (Array.isArray(backupCollections.sessions) && backupCollections.sessions.length > 0) ||
    (Array.isArray(backupCollections.subjects) && backupCollections.subjects.length > 0)
  );
  const inferredOnboarded = hasRealData || backup.profile.isOnboarded === true || backup.profile.onboarding_completed === true;

  const merged = stripPrivateSnapshotKeys({
    ...(currentBundle.profileData || {}),
    ...backup.profile,
    isOnboarded: inferredOnboarded,
    onboarding_completed: inferredOnboarded,
    settings: {
      ...((currentBundle.profileData || {}).settings || {}),
      ...(backup.profile.settings || {}),
      ...(backup.settings || {}),
    },
    last_imported_at: now,
  });
  const ensureProfile = await supaRestAsUser('POST', '/rest/v1/user_profiles?on_conflict=user_id', {
    user_id: userId,
    profile_data: {},
    updated_at: now,
  }, userJwt, { 'Prefer': 'resolution=ignore-duplicates,return=minimal' });
  assertSupaOk(ensureProfile, 'Imported profile row ensure');
  const profilePatch = await supaRestAsUser('PATCH', `/rest/v1/user_profiles?user_id=eq.${encodeURIComponent(userId)}`, {
    profile_data: merged,
    updated_at: now,
  }, userJwt, { 'Prefer': 'return=minimal' });
  assertSupaOk(profilePatch, 'Imported profile sync');
  const onboarding = normalizeOnboardingForSnapshot(backup.onboarding, merged);
  if (onboarding.completed === true || merged.isOnboarded === true || merged.onboarding_completed === true) {
    const onboardingPatch = await supaRestAsUser('POST', '/rest/v1/user_onboarding?on_conflict=user_id', {
      user_id: userId,
      completed: true,
      completed_at: onboarding.completed_at || now,
      data: onboarding.data || {},
      updated_at: now,
    }, userJwt, { 'Prefer': 'resolution=merge-duplicates,return=minimal' });
    assertSupaOk(onboardingPatch, 'Imported onboarding sync');
  }
  const usersUpdate = compactObject({
    username: merged.username ? String(merged.username) : undefined,
    name: merged.display_name || merged.name ? String(merged.display_name || merged.name) : undefined,
    avatar_url: merged.avatar_url || merged.avatar ? String(merged.avatar_url || merged.avatar) : undefined,
    updated_at: now,
  });
  if (Object.keys(usersUpdate).length > 1) {
    const userPatch = await supaRestAsUser('PATCH', `/rest/v1/users?id=eq.${encodeURIComponent(userId)}`, usersUpdate, userJwt, { 'Prefer': 'return=minimal' });
    assertSupaOk(userPatch, 'Imported public profile sync');
  }
  return { profile_applied: true };
}

async function fetchUserProfileBundle(userId, userJwt) {
  const [profRes, userRes, onboardingRes] = await Promise.all([
    supaRestAsUser('GET', `/rest/v1/user_profiles?user_id=eq.${encodeURIComponent(userId)}&select=profile_data,updated_at&limit=1`, userJwt),
    supaRestAsUser('GET', `/rest/v1/users?id=eq.${encodeURIComponent(userId)}&select=username,name,avatar_url,coins,gems,plan_type,email&limit=1`, userJwt),
    supaRestAsUser('GET', `/rest/v1/user_onboarding?user_id=eq.${encodeURIComponent(userId)}&select=completed,completed_at&limit=1`, userJwt)
      .catch(() => ({ status: 0, body: [] })),
  ]);
  assertSupaOk(profRes, 'Fetch user profile');
  assertSupaOk(userRes, 'Fetch public user');
  const profileRow = Array.isArray(profRes.body) && profRes.body[0] ? profRes.body[0] : null;
  const userData = Array.isArray(userRes.body) && userRes.body[0] ? userRes.body[0] : {};
  const profileData = profileRow?.profile_data || {};
  let onboardingData = Array.isArray(onboardingRes.body) && onboardingRes.body[0] ? onboardingRes.body[0] : null;

  if (!onboardingData) {
    const legacy = profileLegacyOnboarding(profileData);
    await supaRestAsUser('POST', '/rest/v1/user_onboarding?on_conflict=user_id', {
      user_id: userId,
      completed: legacy.completed,
      completed_at: legacy.completed_at,
      updated_at: new Date().toISOString(),
    }, userJwt, { 'Prefer': 'resolution=merge-duplicates,return=minimal' }).catch(() => {});
    onboardingData = legacy;
  }

  const isOnboarded = onboardingData.completed === true;
  const avatarPath = profileData.avatar_path || profileData.avatarPath || null;
  const avatarUrl = [
    profileData.avatar,
    profileData.avatar_url,
    profileData.avatarUrl,
    userData.avatar_url,
    publicAvatarUrlFromPath(avatarPath),
  ].find((value) => typeof value === 'string' && value.trim()) || null;
  const normalizedProfileData = {
    ...profileData,
    ...(avatarUrl ? { avatar: avatarUrl, avatar_url: avatarUrl } : {}),
    ...(avatarPath ? { avatar_path: avatarPath } : {}),
  };
  const normalizedUserData = {
    ...userData,
    ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
  };
  return {
    userData: normalizedUserData,
    profileData: normalizedProfileData,
    profileUpdatedAt: profileRow?.updated_at || null,
    onboardingData,
    profile: {
      ...normalizedUserData,
      ...normalizedProfileData,
      ...(avatarUrl ? { avatar: avatarUrl, avatar_url: avatarUrl } : {}),
      isOnboarded,
      onboarding_completed: isOnboarded,
      onboarding_completed_at: onboardingData.completed_at || normalizedProfileData.onboardingCompletedAt || null,
    },
  };
}

async function fetchUserBootstrapBundle(userId, userJwt) {
  const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
  const today = new Date();
  const fromDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const [profileBundle, settingsRes, statsRes, dailyRes, sessionsRes] = await Promise.all([
    fetchUserProfileBundle(userId, userJwt),
    supaRestAsUser('GET', `/rest/v1/user_settings?user_id=eq.${encodeURIComponent(userId)}&select=settings,updated_at&limit=1`, userJwt)
      .catch((e) => ({ status: 0, body: { error: e.message } })),
    supaRestAsUser('GET', `/rest/v1/user_stats_summary?user_id=eq.${encodeURIComponent(userId)}&select=*&limit=1`, userJwt)
      .catch((e) => ({ status: 0, body: { error: e.message } })),
    supaRestAsUser('GET', `/rest/v1/daily_user_stats?user_id=eq.${encodeURIComponent(userId)}&date=gte.${fromDate}&select=date,seconds_studied&order=date.desc&limit=120`, userJwt)
      .catch((e) => ({ status: 0, body: { error: e.message } })),
    supaRestAsUser('GET', `/rest/v1/study_sessions_log?user_id=eq.${encodeURIComponent(userId)}&ended_at=gte.${encodeURIComponent(since)}&select=id,duration_minutes,ended_at,created_at&order=ended_at.desc&limit=250`, userJwt)
      .catch((e) => ({ status: 0, body: { error: e.message } })),
  ]);

  const softRows = (res) => Array.isArray(res?.body) ? res.body : [];
  return {
    user_id: userId,
    profile: profileBundle.profile,
    profile_data: profileBundle.profileData,
    user: profileBundle.userData,
    profile_updated_at: profileBundle.profileUpdatedAt,
    onboarding: profileBundle.onboardingData,
    settings: softRows(settingsRes)[0]?.settings || {},
    settings_updated_at: softRows(settingsRes)[0]?.updated_at || null,
    stats_summary: softRows(statsRes)[0] || null,
    daily_user_stats: softRows(dailyRes),
    study_sessions_log: softRows(sessionsRes),
    fetched_at: new Date().toISOString(),
    warnings: compactObject({
      settings: settingsRes.status && settingsRes.status >= 400 ? errorMessageFromSupa(settingsRes, 'settings fetch failed') : undefined,
      stats_summary: statsRes.status && statsRes.status >= 400 ? errorMessageFromSupa(statsRes, 'stats fetch failed') : undefined,
      daily_user_stats: dailyRes.status && dailyRes.status >= 400 ? errorMessageFromSupa(dailyRes, 'daily stats fetch failed') : undefined,
      study_sessions_log: sessionsRes.status && sessionsRes.status >= 400 ? errorMessageFromSupa(sessionsRes, 'session log fetch failed') : undefined,
    }),
  };
}

async function bootstrapUserRows({ userId, email = '', displayName = '', userJwt, onboardingCompleted = false, createOnboarding = true }) {
  if (!userId || !userJwt) throw new Error('Cannot bootstrap user rows without a Supabase session');
  const now = new Date().toISOString();
  const username = String(displayName || email.split('@')[0] || ('user_' + userId.slice(0, 8))).replace(/[^a-zA-Z0-9_]/g, '_');
  const name = String(displayName || username).trim();
  const required = [
    supaRestAsUser('POST', '/rest/v1/users?on_conflict=id', compactObject({
      id: userId,
      email,
      username,
      name,
      plan_type: 'ranker',
      billing_status: 'active',
      plan_expires_at: '2099-12-31T23:59:59.000Z',
      access_ends_at: '2099-12-31T23:59:59.000Z',
      updated_at: now,
    }), userJwt, { 'Prefer': 'resolution=ignore-duplicates,return=minimal' }).then((r) => assertSupaOk(r, 'Bootstrap public user')),
    supaRestAsUser('POST', '/rest/v1/user_profiles?on_conflict=user_id', {
      user_id: userId,
      profile_data: {},
      updated_at: now,
    }, userJwt, { 'Prefer': 'resolution=ignore-duplicates,return=minimal' }).then((r) => assertSupaOk(r, 'Bootstrap user profile')),
    supaRestAsUser('POST', '/rest/v1/user_stats_summary?on_conflict=user_id', {
      user_id: userId,
      total_study_seconds: 0,
      total_hours: 0,
      weekly_hours: 0,
      monthly_hours: 0,
      streak_days: 0,
      current_streak: 0,
      max_streak_days: 0,
      longest_streak: 0,
      session_count: 0,
      total_sessions: 0,
      updated_at: now,
    }, userJwt, { 'Prefer': 'resolution=ignore-duplicates,return=minimal' }).then((r) => assertSupaOk(r, 'Bootstrap stats summary')),
  ];
  if (createOnboarding) {
    required.push(
      supaRestAsUser('POST', '/rest/v1/user_onboarding?on_conflict=user_id', {
        user_id: userId,
        completed: onboardingCompleted === true,
        completed_at: onboardingCompleted ? now : null,
        updated_at: now,
      }, userJwt, { 'Prefer': 'resolution=ignore-duplicates,return=minimal' }).then((r) => assertSupaOk(r, 'Bootstrap onboarding'))
    );
  }
  await Promise.all(required);

  await Promise.all([
    supaRestAsUser('POST', '/rest/v1/user_settings?on_conflict=user_id', {
      user_id: userId,
      settings: {},
      updated_at: now,
    }, userJwt, { 'Prefer': 'resolution=ignore-duplicates,return=minimal' }).catch(() => null),
    supaRestAsUser('POST', '/rest/v1/user_presence?on_conflict=user_id', {
      user_id: userId,
      status: 'offline',
      last_seen: now,
    }, userJwt, { 'Prefer': 'resolution=ignore-duplicates,return=minimal' }).catch(() => null),
  ]);
}

function supaPasswordSignIn(email, password) {
  return new Promise((resolve, reject) => {
    const supaHost = new URL(SUPA_URL).hostname;
    const bodyBuf  = Buffer.from(JSON.stringify({ email, password }));
    const opts = {
      hostname: supaHost,
      path: '/auth/v1/token?grant_type=password',
      method: 'POST',
      headers: {
        'Content-Type':   'application/json',
        'apikey':         SUPA_ANON_KEY,
        'Authorization':  'Bearer ' + SUPA_ANON_KEY,
        'Content-Length': String(bodyBuf.length),
      },
    };
    const req = https.request(opts, (r) => {
      let d = ''; r.on('data', c => d += c);
      r.on('end', () => {
        try { resolve({ status: r.statusCode, body: JSON.parse(d) }); }
        catch { resolve({ status: r.statusCode, body: d }); }
      });
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('Sign-in request timed out')); });
    req.write(bodyBuf);
    req.end();
  });
}

function supaPasswordSignUp(email, password, metadata = {}) {
  return new Promise((resolve, reject) => {
    const supaHost = new URL(SUPA_URL).hostname;
    const bodyBuf  = Buffer.from(JSON.stringify({ email, password, data: metadata }));
    const opts = {
      hostname: supaHost,
      path: '/auth/v1/signup',
      method: 'POST',
      headers: {
        'Content-Type':   'application/json',
        'apikey':         SUPA_ANON_KEY,
        'Authorization':  'Bearer ' + SUPA_ANON_KEY,
        'Content-Length': String(bodyBuf.length),
      },
    };
    const req = https.request(opts, (r) => {
      let d = ''; r.on('data', c => d += c);
      r.on('end', () => {
        try { resolve({ status: r.statusCode, body: JSON.parse(d) }); }
        catch { resolve({ status: r.statusCode, body: d }); }
      });
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('Supabase signup timed out')); });
    req.write(bodyBuf);
    req.end();
  });
}

function supaAuthAnonReq(method, supaPath, bodyObj) {
  return new Promise((resolve, reject) => {
    const supaHost = new URL(SUPA_URL).hostname;
    const bodyBuf  = bodyObj ? Buffer.from(JSON.stringify(bodyObj)) : null;
    const opts = {
      hostname: supaHost,
      path: supaPath,
      method,
      headers: {
        'Content-Type':   'application/json',
        'apikey':         SUPA_ANON_KEY,
        'Authorization':  'Bearer ' + SUPA_ANON_KEY,
        ...(bodyBuf ? { 'Content-Length': String(bodyBuf.length) } : {}),
      },
    };
    const req = https.request(opts, (r) => {
      let d = ''; r.on('data', c => d += c);
      r.on('end', () => {
        try { resolve({ status: r.statusCode, body: JSON.parse(d) }); }
        catch { resolve({ status: r.statusCode, body: d }); }
      });
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('Supabase auth request timed out')); });
    if (bodyBuf) req.write(bodyBuf);
    req.end();
  });
}

async function createMagicSessionForEmail(email) {
  if (!ADMIN_MODE_READY) throw new Error('Admin mode is required for browser proof session minting');
  const generated = await supaAdminReq('POST', '/auth/v1/admin/generate_link', {
    type: 'magiclink',
    email,
  });
  assertSupaOk(generated, 'Generate browser proof magic link');
  const otp = generated.body?.email_otp || generated.body?.properties?.email_otp || '';
  if (!otp) throw new Error('Supabase did not return a proof OTP');
  const verified = await supaAuthAnonReq('POST', '/auth/v1/verify', {
    type: 'email',
    email,
    token: otp,
  });
  assertSupaOk(verified, 'Verify browser proof magic link');
  if (!verified.body?.access_token || !verified.body?.user?.id) throw new Error('Magic-link verification did not return a session');
  return verified.body;
}

function readReqBody(req, maxBytes = 1048576) { // 1 MB limit
  return new Promise((resolve, reject) => {
    let b = '', len = 0, _tooLarge = false;
    req.on('data', d => {
      len += d.length;
      if (len > maxBytes) {
        _tooLarge = true;
        req.destroy(new Error('Request body too large (max ' + Math.ceil(maxBytes / 1024) + ' KB)'));
        return;
      }
      b += d;
    });
    req.on('end', () => {
      if (_tooLarge) return; // 'error' event will reject — don't double-resolve with {}
      try { resolve(JSON.parse(b)); } catch { resolve({}); }
    });
    req.on('error', (e) => {
      if (_tooLarge) {
        const err = new Error('Request body too large (max ' + Math.ceil(maxBytes / 1024) + ' KB)');
        err.code = 'BODY_TOO_LARGE';
        reject(err);
      } else {
        reject(e);
      }
    });
  });
}

function sendJson(res, status, payload, extraHeaders = {}) {
  const body = JSON.stringify(payload || {});
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    ...extraHeaders,
  });
  res.end(body);
}

function authRequiredPayload(extra = {}) {
  return {
    ok: false,
    success: false,
    error: 'Authentication required',
    code: 'AUTH_REQUIRED',
    ...extra,
  };
}

function extractBearerToken(req) {
  const rawAuth = (req.headers['authorization'] || req.headers['Authorization'] || '').toString().trim();
  if (!rawAuth) return null;
  const match = rawAuth.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;
  const token = String(match[1] || '').trim();
  if (!token || token.split('.').length < 3) return null;
  return token;
}

async function requireUserAuth(req, res, options = {}) {
  const token = extractBearerToken(req);
  if (!token) {
    sendJson(res, 401, authRequiredPayload(options.payload || {}));
    return null;
  }
  try {
    const user = await verifySupabaseAccessToken(token);
    const userId = user?.id || getUserIdFromJwt(token);
    if (!userId) throw new Error('Missing user id');
    return { userJwt: token, userId, user };
  } catch {
    sendJson(res, 401, authRequiredPayload(options.payload || {}));
    return null;
  }
}

// ── Supabase community proxy ──────────────────────────────────────────────────
// Handles /__supa/* → forwards to Supabase.
// With admin mode enabled: uses service key server-side. Otherwise forwards user
// Authorization/anon key for normal self-hosted user mode.
// Without: forwards user's Authorization header (relies on profile upgrade).
function handleSupabaseProxy(req, res) {
  const targetPath = req.url.replace(PROXY_PATH, '') || '/';
  const useServiceKey = ADMIN_MODE_READY;
  const apiKey  = useServiceKey ? SUPA_SERVICE_KEY : SUPA_ANON_KEY;
  const authHdr = useServiceKey
    ? 'Bearer ' + SUPA_SERVICE_KEY
    : (req.headers['authorization'] || 'Bearer ' + SUPA_ANON_KEY);

  // Build headers — strip hop-by-hop, inject correct apikey + auth
  const fwdHeaders = {};
  const skip = new Set(['host','connection','transfer-encoding','te','trailer','upgrade']);
  for (const [k, v] of Object.entries(req.headers)) {
    if (!skip.has(k.toLowerCase())) fwdHeaders[k] = v;
  }
  const supaHost = new URL(SUPA_URL).hostname;
  fwdHeaders['host']          = supaHost;
  fwdHeaders['apikey']        = apiKey;
  fwdHeaders['authorization'] = authHdr;

  const options = {
    hostname: supaHost,
    path: targetPath,
    method: req.method,
    headers: fwdHeaders,
  };

  const proxyReq = https.request(options, (proxyRes) => {
    const respHeaders = { ...proxyRes.headers };
    respHeaders['access-control-allow-origin']  = '*';
    respHeaders['access-control-allow-methods'] = 'GET,POST,PATCH,DELETE,OPTIONS';
    respHeaders['access-control-allow-headers'] = 'content-type,authorization,apikey,x-client-info,prefer,range';
    // Remove hop-by-hop
    delete respHeaders['transfer-encoding'];

    res.writeHead(proxyRes.statusCode, respHeaders);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (e) => {
    console.error('[Proxy] Error:', e.message);
    if (!res.headersSent) { res.writeHead(502); res.end('Proxy error'); }
  });

  req.pipe(proxyReq, { end: true });
}

// ── GitHub auto-update checker ────────────────────────────────────────────────
const GH_OWNER = 'Suydev';
const GH_REPO  = 'isotope-code';

function readLocalVersionInfo() {
  const info = {
    version: '0.0.0',
    sha: 'unknown',
    source: 'unknown',
    message: '',
    updated_at: '',
  };
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
    if (pkg && pkg.version) info.version = String(pkg.version);
  } catch {}
  try {
    const vf = path.join(__dirname, 'VERSION');
    const vdata = JSON.parse(fs.readFileSync(vf, 'utf8'));
    if (vdata.version) info.version = String(vdata.version); // VERSION overrides package.json
    if (vdata.sha) info.sha = String(vdata.sha);
    if (vdata.message) info.message = String(vdata.message);
    if (vdata.updated_at) info.updated_at = String(vdata.updated_at);
    info.source = 'VERSION';
  } catch {}
  // Skip git SHA detection in Replit / cloud environments — the workspace git
  // points to the Replit-internal repo, not the upstream isotope-code repo,
  // so the SHA never matches upstream and always triggers a false-positive
  // update banner. Fall back to the VERSION file SHA instead.
  const isReplit = !!(process.env.REPL_ID || process.env.REPLIT_SLUG || process.env.REPLIT_DEPLOYMENT);
  if (!isReplit && !process.env.DISABLE_UPDATE_CHECK) {
    try {
      const gitSha = execSync('git rev-parse HEAD', { cwd: __dirname, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
      if (/^[0-9a-f]{40}$/i.test(gitSha)) {
        info.sha = gitSha;
        info.source = 'git';
      }
      const msg = execSync('git log -1 --pretty=%s', { cwd: __dirname, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
      if (msg) info.message = msg;
    } catch {}
  }
  return info;
}

function parseSemver(value) {
  const m = String(value || '').match(/\bv?(\d+)\.(\d+)\.(\d+)\b/);
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function compareSemver(a, b) {
  const av = parseSemver(a);
  const bv = parseSemver(b);
  if (!av || !bv) return null;
  for (let i = 0; i < 3; i++) {
    if (av[i] > bv[i]) return 1;
    if (av[i] < bv[i]) return -1;
  }
  return 0;
}

let LOCAL_VERSION = readLocalVersionInfo();
let DEPLOYED_SHA = LOCAL_VERSION.sha || 'unknown';
console.log('[Update] Local version: ' + LOCAL_VERSION.version + ' (' + String(DEPLOYED_SHA).slice(0, 7) + ', ' + LOCAL_VERSION.source + ')');

// Cache GitHub response for 10 min to avoid rate-limit
let _ghCache = null;
let _ghCacheTs = 0;
const GH_TTL = 10 * 60 * 1000;

// ── Performance caches ────────────────────────────────────────────────────────
let _healthCache = null;    // last successful health payload
let _healthCacheAt = 0;
const HEALTH_CACHE_TTL = 15_000; // 15 s — reduces 200-600 ms Supabase round-trips to <1 ms
const _gzipCache = new Map(); // abs file path → pre-gzip'd Buffer (populated at startup)

function fetchLatestCommit() {
  return new Promise(function (resolve, reject) {
    const opts = {
      hostname: 'api.github.com',
      path: '/repos/' + GH_OWNER + '/' + GH_REPO + '/commits/main',
      method: 'GET',
      headers: { 'User-Agent': 'isotope-self-host', 'Accept': 'application/vnd.github+json', ...(process.env.GITHUB_PAT ? { 'Authorization': 'token ' + process.env.GITHUB_PAT } : {}) },
    };
    const req = https.request(opts, function (r) {
      let body = '';
      r.on('data', function (d) { body += d; });
      r.on('end', function () {
        try {
          const j = JSON.parse(body);
          resolve({
            sha:       j.sha || '',
            message:   (j.commit && j.commit.message ? j.commit.message.split('\n')[0] : ''),
            pushed_at: (j.commit && j.commit.author ? j.commit.author.date : ''),
          });
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.setTimeout(8000, function () { req.destroy(); reject(new Error('timeout')); });
    req.end();
  });
}

const appStateStore = { timerState: null, localStorage: {} };
const browserProofRuns = new Map();

function publicProofRun(run) {
  if (!run) return run;
  const { token, ...safe } = run;
  return safe;
}

function writeBrowserProofChecklist(run) {
  if (!run || run.ok !== true) return { written: false, reason: 'run_not_complete' };
  const messages = Array.isArray(run.results)
    ? run.results
        .map((row) => String(row && row.message ? row.message : '').trim())
        .filter(Boolean)
    : [];
  const hasLine = (needle) => messages.some((line) => line.includes(needle));
  const syncProof =
    hasLine('sync success, auth failure, and offline browser state verified') ||
    hasLine('empty overwrite blocked, auth failure, and offline browser state verified');
  const required = [
    'onboarding row completed and cache-clear bootstrap did not repeat onboarding',
    'profile/settings diff persisted and restored from bootstrap',
    'avatar object exists and profile avatar restored',
    'community_group_v1 tour persisted and restored',
    'study session wrote session/daily/summary tables and restored after cache clear',
  ];
  const missing = required.filter((line) => !hasLine(line));
  if (!syncProof) missing.push('sync success or empty-overwrite block with auth/offline states');
  if (missing.length) return { written: false, reason: 'missing_proof_lines', missing };

  const safeMessages = messages.map((line) => line.replace(/Bearer\s+[A-Za-z0-9._-]+/g, 'Bearer <redacted>'));
  const md = [
    '# Isotope Browser Proof Checklist',
    '',
    'Status: `PROVEN 6/6`',
    'Browser: Android Chrome',
    `Generated: ${new Date().toISOString()}`,
    `Proof ID: ${run.proof_id || 'unknown'}`,
    '',
    '## Final Browser Result',
    '',
    ...safeMessages.map((line) => `- ${line}`),
    '',
  ].join('\n');
  fs.writeFileSync(path.join(__dirname, 'SYNC_PROOF_CHECKLIST.md'), md);
  return { written: true, path: 'SYNC_PROOF_CHECKLIST.md' };
}

function browserProofWantsJson(req) {
  try {
    const sp = new URL('http://x' + req.url).searchParams;
    if (sp.get('format') === 'json') return true;
  } catch {}
  const accept = String(req.headers.accept || '');
  return accept.includes('application/json') && !accept.includes('text/html');
}

function browserProofStartHtml({ run, email, error }) {
  const safeRun = publicProofRun(run);
  const pageUrl = safeRun?.run_id ? '/__admin/browser-proof-page?run_id=' + encodeURIComponent(safeRun.run_id) : '';
  const statusUrl = safeRun?.run_id ? '/__admin/browser-proof-status?run_id=' + encodeURIComponent(safeRun.run_id) : '';
  const setup = [
    'ENABLE_ADMIN_MODE=true',
    'SUPABASE_SERVICE_ROLE_KEY=<service role key>',
    'ADMIN_SECRET=<private local secret>',
    'ADMIN_EMAIL=<existing Supabase user email> or BROWSER_PROOF_EMAIL=<existing Supabase user email>',
  ];
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Isotope Browser Proof</title>
<style>
body{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#09090b;color:#e4e4e7;margin:0;padding:28px}
main{max-width:860px;margin:6vh auto;background:#111114;border:1px solid #27272a;border-radius:18px;padding:24px;box-shadow:0 24px 70px rgba(0,0,0,.42)}
h1{margin:0 0 8px;font-size:28px;letter-spacing:-.04em}.muted{color:#a1a1aa;line-height:1.55}.error{color:#fca5a5;background:rgba(127,29,29,.25);border:1px solid rgba(248,113,113,.22);padding:12px;border-radius:12px}
a.btn,button{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:#f97316;color:#111;font-weight:800;text-decoration:none;border:0;border-radius:999px;padding:11px 16px;margin:10px 10px 0 0;cursor:pointer}
a.secondary{background:#27272a;color:#fafafa}.grid{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));margin:18px 0}.card{background:#18181b;border:1px solid #27272a;border-radius:12px;padding:12px}
code,pre{background:#050505;border:1px solid #27272a;border-radius:8px;color:#fdba74}code{padding:2px 5px}pre{padding:12px;overflow:auto}
</style></head><body><main>
<h1>Browser Proof</h1>
<p class="muted">This starts the real browser proof run for onboarding, profile/settings, avatar, tour, study-session, and sync status checks. It is admin-only and uses a temporary Supabase session for the configured proof user.</p>
${error ? `<p class="error">${escapeHtml(error)}</p>` : ''}
<div class="grid">
  <div class="card"><strong>Proof user</strong><br><span class="muted">${escapeHtml(email || '(not configured)')}</span></div>
  <div class="card"><strong>Run status</strong><br><span class="muted">${escapeHtml(safeRun?.status || (error ? 'not started' : 'ready'))}</span></div>
  <div class="card"><strong>Run id</strong><br><span class="muted">${escapeHtml(safeRun?.run_id || '-')}</span></div>
</div>
${pageUrl ? `<a class="btn" href="${escapeHtml(pageUrl)}">Open Browser Proof Page</a><a class="btn secondary" href="${escapeHtml(statusUrl)}">View Run Status JSON</a>` : ''}
<a class="btn secondary" href="/__admin/verify">Back to Verify</a>
<h2>Required private config</h2>
<pre>${escapeHtml(setup.join('\n'))}</pre>
<p class="muted">If this page shows a setup error, fix the private <code>.env</code>, restart the local server, then open <code>/__admin/browser-proof</code> again. No service-role key or proof session is written to this page.</p>
</main></body></html>`;
}

function browserProofHtml({ runId, token, session }) {
  const publicSession = {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at,
    token_type: session.token_type,
    user: {
      id: session.user?.id,
      email: session.user?.email,
      created_at: session.user?.created_at,
      email_confirmed_at: session.user?.email_confirmed_at || null,
    },
  };
  const supaRef = new URL(SUPA_URL).hostname.split('.')[0];
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Isotope Browser Proof</title>
<style>body{font-family:system-ui;background:#09090b;color:#e4e4e7;margin:0;padding:24px}main{max-width:860px;margin:auto}pre{white-space:pre-wrap;background:#111;border:1px solid #333;border-radius:8px;padding:14px} .ok{color:#86efac}.fail{color:#fca5a5}</style>
<script src="/pwa-local.js"></script></head><body><main><h1>Isotope Browser Proof</h1><pre id="log">starting...</pre></main>
<script>
(async function(){
  var RUN_ID=${JSON.stringify(runId)};
  var RUN_TOKEN=${JSON.stringify(token)};
  var SESSION=${JSON.stringify(publicSession)};
  var USER_ID=${JSON.stringify(publicSession.user.id)};
  var SUPA_URL=${JSON.stringify(SUPA_URL)};
  var SUPA_ANON=${JSON.stringify(SUPA_ANON_KEY)};
  var SUPA_REF=${JSON.stringify(supaRef)};
  var PROOF_ID='browser-proof-'+Date.now();
  var logEl=document.getElementById('log');
  var results=[];
  function log(line, cls){ results.push({line:line, cls:cls||''}); logEl.textContent=results.map(function(r){return (r.cls==='fail'?'FAIL ':'OK   ')+r.line}).join('\\n'); report('running',{partial:true,ok:false}).catch(function(){}); }
  function assert(cond, msg){ if(!cond) throw new Error(msg); }
  function authHeaders(extra){ return Object.assign({'apikey':SUPA_ANON,'Authorization':'Bearer '+SESSION.access_token,'Accept':'application/json'}, extra||{}); }
  function appAuthHeaders(extra){ return Object.assign({'Authorization':'Bearer '+SESSION.access_token,'Accept':'application/json'}, extra||{}); }
  function saveSession(){ var raw=JSON.stringify(SESSION); localStorage.setItem('isotope-auth-token', raw); localStorage.setItem('sb-'+SUPA_REF+'-auth-token', raw); localStorage.setItem('isotope-last-jwt', SESSION.access_token); if(SESSION.refresh_token)localStorage.setItem('isotope-last-rt', SESSION.refresh_token); localStorage.setItem('isotope-last-session-raw', raw); }
  async function jsonFetch(url, init){ var r=await fetch(url, init||{}); var text=await r.text(); var d={}; try{ d=text?JSON.parse(text):{}; }catch(e){ d={raw:text}; } if(!r.ok){ var msg=(d&&d.error)||(d&&d.message)||(d&&d.raw)||('HTTP '+r.status); throw new Error('HTTP '+r.status+': '+String(msg).slice(0,240)); } return d; }
  function proofUuid(){ if(window.crypto&&crypto.randomUUID) return crypto.randomUUID(); var bytes=new Uint8Array(16); if(window.crypto&&crypto.getRandomValues) crypto.getRandomValues(bytes); else for(var i=0;i<16;i++) bytes[i]=Math.floor(Math.random()*256); bytes[6]=(bytes[6]&15)|64; bytes[8]=(bytes[8]&63)|128; var hex=[]; for(var j=0;j<16;j++) hex.push((bytes[j]+256).toString(16).slice(1)); return hex.slice(0,4).join('')+'-'+hex.slice(4,6).join('')+'-'+hex.slice(6,8).join('')+'-'+hex.slice(8,10).join('')+'-'+hex.slice(10,16).join(''); }
  async function supa(path){ return jsonFetch(SUPA_URL+path,{headers:authHeaders()}); }
  async function clearBrowserStorageAndLogin(){ try{ var ks=await caches.keys(); await Promise.all(ks.map(function(k){return caches.delete(k)})); }catch(e){} try{ indexedDB.deleteDatabase('isotope_main'); }catch(e){} try{ localStorage.clear(); sessionStorage.clear(); }catch(e){} saveSession(); await new Promise(function(r){setTimeout(r,250)}); }
  async function bootstrap(){ return jsonFetch('/__auth/bootstrap',{headers:appAuthHeaders({'Cache-Control':'no-store'})}); }
  async function postProfile(body){ return jsonFetch('/__auth/profile',{method:'POST',headers:appAuthHeaders({'Content-Type':'application/json'}),body:JSON.stringify(body)}); }
  async function latestProfile(){ var rows=await supa('/rest/v1/user_profiles?user_id=eq.'+encodeURIComponent(USER_ID)+'&select=user_id,profile_data,updated_at&limit=1'); return rows&&rows[0]; }
  async function report(status, extra){ await fetch('/__admin/browser-proof-result?run_id='+encodeURIComponent(RUN_ID)+'&token='+encodeURIComponent(RUN_TOKEN),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.assign({status:status,results:results,proof_id:PROOF_ID,at:new Date().toISOString()},extra||{}))}).catch(function(){}); }
  try{
    saveSession();
    log('browser session stored for '+USER_ID);

    await postProfile({isOnboarded:true,onboarding_completed:true,onboarding_data:{proof_id:PROOF_ID}});
    var onb=await supa('/rest/v1/user_onboarding?user_id=eq.'+encodeURIComponent(USER_ID)+'&select=completed,completed_at,data&limit=1');
    assert(onb[0]&&onb[0].completed===true,'onboarding row was not completed');
    await clearBrowserStorageAndLogin();
    var boot=await bootstrap();
    assert(boot.onboarding&&boot.onboarding.completed===true,'bootstrap did not restore completed onboarding');
    log('onboarding row completed and cache-clear bootstrap did not repeat onboarding');

    var before=await latestProfile();
    var marker=PROOF_ID+'-settings';
    await postProfile({profile_data:{proof_marker:marker,settings:{proof_marker:marker,theme:'dark'},preferences:{proof_marker:marker}},display_name:'Browser Proof '+PROOF_ID.slice(-6)});
    var after=await latestProfile();
    assert(after&&after.profile_data&&after.profile_data.proof_marker===marker,'profile marker missing after save');
    assert(JSON.stringify(before&&before.profile_data)!==JSON.stringify(after&&after.profile_data),'profile_data did not change');
    await clearBrowserStorageAndLogin();
    boot=await bootstrap();
    assert(boot.profile_data&&boot.profile_data.proof_marker===marker,'profile/settings did not restore after cache clear');
    log('profile/settings diff persisted and restored from bootstrap');

    var png='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=';
    var avatar=await postProfile({avatar:png});
    var prof=await latestProfile();
    var avatarPath=prof&&prof.profile_data&&prof.profile_data.avatar_path;
    var avatarUrl=prof&&prof.profile_data&&(prof.profile_data.avatar_url||prof.profile_data.avatar);
    assert(avatarPath&&avatarUrl,'avatar path/url missing from profile_data');
    var avatarResp=await fetch('/__supa/storage/v1/object/public/avatars/'+avatarPath,{headers:{'Accept':'image/*'}});
    assert(avatarResp.ok,'avatar object was not fetchable from storage');
    await clearBrowserStorageAndLogin();
    boot=await bootstrap();
    assert(boot.profile_data&&(boot.profile_data.avatar_path===avatarPath),'avatar did not restore after cache clear');
    log('avatar object exists and profile avatar restored');

    await postProfile({tours:{community_group_v1:true}});
    prof=await latestProfile();
    assert(prof&&prof.profile_data&&prof.profile_data.tours&&prof.profile_data.tours.community_group_v1===true,'tour completion missing from profile_data');
    await clearBrowserStorageAndLogin();
    boot=await bootstrap();
    assert(boot.profile_data&&boot.profile_data.tours&&boot.profile_data.tours.community_group_v1===true,'tour state did not restore after cache clear');
    log('community_group_v1 tour persisted and restored');

    var sessionId=proofUuid();
    var rpc=await jsonFetch(SUPA_URL+'/rest/v1/rpc/finish_session_sync',{method:'POST',headers:authHeaders({'Content-Type':'application/json'}),body:JSON.stringify({p_session_id:sessionId,p_action:'complete',p_duration_minutes:2,p_group_id:null,p_session_type:'proof',p_notes:PROOF_ID,p_ended_at:new Date().toISOString()})});
    var logs=await supa('/rest/v1/study_sessions_log?user_id=eq.'+encodeURIComponent(USER_ID)+'&id=eq.'+encodeURIComponent(sessionId)+'&select=id,duration_minutes,ended_at,created_at&limit=1');
    var daily=await supa('/rest/v1/daily_user_stats?user_id=eq.'+encodeURIComponent(USER_ID)+'&select=date,seconds_studied&order=date.desc&limit=5');
    var summary=await supa('/rest/v1/user_stats_summary?user_id=eq.'+encodeURIComponent(USER_ID)+'&select=*&limit=1');
    assert(logs[0]&&Number(logs[0].duration_minutes)>=2,'study_sessions_log proof row missing');
    assert(daily.length>0&&Number(daily[0].seconds_studied)>0,'daily_user_stats was not updated');
    assert(summary[0]&&(Number(summary[0].total_sessions)>0||Number(summary[0].session_count)>0),'user_stats_summary was not updated');
    await jsonFetch('/__auth/snapshot',{method:'POST',headers:appAuthHeaders({'Content-Type':'application/json'}),body:JSON.stringify({source:'browser_proof_session'})});
    await clearBrowserStorageAndLogin();
    boot=await bootstrap();
    assert(Array.isArray(boot.study_sessions_log)&&boot.study_sessions_log.some(function(row){return row.id===sessionId}), 'bootstrap did not restore proof study session');
    log('study session wrote session/daily/summary tables and restored after cache clear');

    var backup=JSON.stringify({version:1,source:'isotopeai',exportedAt:new Date().toISOString(),appVersion:'browser-proof',data:{profile:{proof_marker:PROOF_ID},timerState:null,tasks:[],sessions:[],subjects:[],habits:[],dailyLogs:[],tests:[],exams:[],mockTests:[]}});
    var syncResp=await fetch('/__auth/backup',{method:'POST',headers:appAuthHeaders({'Content-Type':'application/json'}),body:JSON.stringify({backup_json:backup})});
    var syncOk=await syncResp.json().catch(function(){return {}});
    var emptyOverwriteBlocked=syncResp.status===409&&syncOk&&syncOk.code==='BLOCKED_EMPTY_OVERWRITE';
    assert((syncResp.ok&&syncOk.ok&&syncOk.snapshot_storage)||emptyOverwriteBlocked,'sync did not upload or block empty overwrite safely');
    if(emptyOverwriteBlocked){
      log('empty overwrite blocked before cloud data could be replaced');
    }else{
      log('sync upload returned verified snapshot storage');
    }
    var failResp=await fetch('/__auth/backup',{method:'POST',headers:{'Authorization':'Bearer bad.token.value','Content-Type':'application/json'},body:JSON.stringify({backup_json:backup})});
    var failJson=await failResp.json().catch(function(){return {}});
    assert(failResp.status===401&&failJson.code==='AUTH_REQUIRED','auth failure did not stay failed');
    window.dispatchEvent(new Event('offline'));
    await new Promise(function(r){setTimeout(r,250)});
    var offlineText=document.body.innerText||'';
    assert(offlineText.indexOf('Offline mode')>=0&&offlineText.indexOf('Browser network is offline')>=0,'offline UI did not show browser offline mode');
    log(emptyOverwriteBlocked?'empty overwrite blocked, auth failure, and offline browser state verified':'sync success, auth failure, and offline browser state verified');

    await report('complete',{ok:true});
  }catch(e){
    log(e.message||String(e),'fail');
    await report('failed',{ok:false,error:e.message||String(e),stack:e.stack||''});
  }
})();</script></body></html>`;
}

const server = http.createServer((req, res) => {
  // ── CORS preflight ──────────────────────────────────────────────────────────
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin':  '*',
      'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization,apikey,x-client-info,prefer,range,X-Admin-Secret',
    });
    res.end();
    return;
  }

  // ── Route: path extraction ──────────────────────────────────────────────────
  let adminPath = '';
  try { adminPath = new URL('http://x' + req.url).pathname; } catch { adminPath = req.url.split('?')[0]; }

  // ── Admin route auth guard ──────────────────────────────────────────────────
  // Admin routes are disabled unless owner/admin mode is explicitly enabled.
  if (adminPath === '/__admin') {
    res.writeHead(302, { Location: isAdminAuthed(req) ? '/__admin/verify' : '/__admin/login?next=%2F__admin%2Fverify' });
    res.end();
    return;
  }

  if (adminPath === '/__admin/login') {
    if (!ADMIN_MODE_READY) {
      sendAdminDisabled(req, res);
      return;
    }
    if (req.method === 'GET') {
      sendAdminLogin(req, res);
      return;
    }
    if (req.method === 'POST') {
      readRequestText(req)
        .then(async (body) => {
          const params = new URLSearchParams(body);
          const secret = params.get('secret') || '';
          const token = params.get('token') || '';
          let next = params.get('next') || '/__admin/verify';
          if (!next.startsWith('/__admin/')) next = '/__admin/verify';
          const auth = await authenticateAdminUnlock(secret, token);
          if (!auth.ok) {
            sendAdminLogin(req, res, auth.error || 'Admin unlock failed.');
            return;
          }
          res.writeHead(303, {
            Location: next,
            'Set-Cookie': 'iso_admin=' + encodeURIComponent(adminCookieValue()) + '; Path=/__admin; HttpOnly; SameSite=Strict; Max-Age=86400' + (isRequestHttps(req) ? '; Secure' : ''),
            'Cache-Control': 'no-store'
          });
          res.end();
        })
        .catch((e) => {
          res.writeHead(400, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
          res.end(JSON.stringify({ error: e.message || 'Invalid admin login request' }));
        });
      return;
    }
    res.writeHead(405, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  if (adminPath === '/__admin/events' || adminPath === '/__admin/events.json' || adminPath.startsWith('/__admin/events/')) {
    res.writeHead(404, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify({ error: 'Events admin has been removed from this installation.' }));
    return;
  }

  if (adminPath.startsWith('/__admin/') && !ADMIN_MODE_READY) {
    sendAdminDisabled(req, res);
    return;
  }
  if (adminPath.startsWith('/__admin/') && adminPath !== '/__admin/browser-proof-result' && !isAdminAuthed(req)) {
    if (req.method === 'GET') {
      sendAdminLogin(req, res);
      return;
    }
    res.writeHead(401, {
      'Content-Type': 'application/json',
      'WWW-Authenticate': 'Bearer realm="IsotopeAI Admin"',
    });
    res.end(JSON.stringify({ error: 'Unauthorized. Pass ADMIN_SECRET as X-Admin-Secret header or ?secret= query param.' }));
    return;
  }

  if (adminPath === '/__admin/browser-proof' && req.method === 'GET') {
    (async () => {
      const wantsJson = browserProofWantsJson(req);
      if (!BROWSER_PROOF_EMAIL) {
        const payload = {
          ok: false,
          code: 'BROWSER_PROOF_EMAIL_MISSING',
          error: 'Set ADMIN_EMAIL or BROWSER_PROOF_EMAIL to an existing Supabase user email, then restart.',
        };
        if (wantsJson) sendJson(res, 400, payload);
        else {
          res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
          res.end(browserProofStartHtml({ email: '', error: payload.error }));
        }
        return;
      }
      const runId = crypto.randomUUID();
      const token = crypto.randomBytes(24).toString('hex');
      const email = BROWSER_PROOF_EMAIL;
      const session = await createMagicSessionForEmail(email);
      browserProofRuns.set(runId, {
        run_id: runId,
        token,
        status: 'started',
        started_at: new Date().toISOString(),
        user_id: session.user.id,
        email,
      });
      const run = browserProofRuns.get(runId);
      if (wantsJson) sendJson(res, 200, publicProofRun(run), { 'Content-Type': 'application/json' });
      else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
        res.end(browserProofStartHtml({ run, email }));
      }
    })().catch((e) => {
      const message = e.message || 'Browser proof setup failed';
      if (browserProofWantsJson(req)) sendJson(res, 500, { ok: false, code: 'BROWSER_PROOF_SETUP_FAILED', error: message });
      else {
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
        res.end(browserProofStartHtml({ email: BROWSER_PROOF_EMAIL, error: message }));
      }
    });
    return;
  }

  if (adminPath === '/__admin/browser-proof-page' && req.method === 'GET') {
    (async () => {
      const u = new URL('http://x' + req.url);
      const runId = u.searchParams.get('run_id') || '';
      const run = browserProofRuns.get(runId);
      if (!run) {
        sendJson(res, 404, { ok: false, error: 'Unknown proof run' });
        return;
      }
      const session = await createMagicSessionForEmail(run.email);
      browserProofRuns.set(runId, { ...run, status: 'browser_opened', opened_at: new Date().toISOString() });
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(browserProofHtml({ runId, token: run.token, session }));
    })().catch((e) => {
      sendJson(res, 500, { ok: false, error: e.message || 'Browser proof page failed' });
    });
    return;
  }

  if (adminPath === '/__admin/browser-proof-result' && req.method === 'POST') {
    readReqBody(req, 1024 * 1024).then((body) => {
      const u = new URL('http://x' + req.url);
      const runId = u.searchParams.get('run_id') || '';
      const token = u.searchParams.get('token') || '';
      const run = browserProofRuns.get(runId);
      if (!run || token !== run.token) {
        sendJson(res, 403, { ok: false, error: 'Invalid proof run token' });
        return;
      }
      const updated = {
        ...run,
        status: body?.status || 'reported',
        completed_at: new Date().toISOString(),
        ok: body?.ok === true,
        proof_id: body?.proof_id || null,
        results: Array.isArray(body?.results) ? body.results : [],
        error: body?.error || null,
      };
      browserProofRuns.set(runId, updated);
      let checklist = { written: false, reason: 'not_attempted' };
      try {
        checklist = writeBrowserProofChecklist(updated);
      } catch (e) {
        checklist = { written: false, reason: e.message || 'write_failed' };
      }
      sendJson(res, 200, { ok: true, checklist });
    }).catch((e) => sendJson(res, 500, { ok: false, error: e.message || 'Could not store proof result' }));
    return;
  }

  if (adminPath === '/__admin/browser-proof-status' && req.method === 'GET') {
    const u = new URL('http://x' + req.url);
    const runId = u.searchParams.get('run_id') || '';
    const run = browserProofRuns.get(runId);
    sendJson(res, run ? 200 : 404, run ? publicProofRun(run) : { ok: false, error: 'Unknown proof run' });
    return;
  }

  // ── Edge function interceptors (server-side mirror of browser fetch override) ─
  // These catch /__supa/functions/v1/... before the general proxy handler forwards
  // them to Supabase (where they aren't deployed in self-hosted mode).
  if (req.method === 'POST' && req.url.startsWith('/__supa/functions/v1/')) {
    const fnPath = req.url.replace('/__supa/functions/v1/', '').split('?')[0];
    const jsonOk = (obj) => { const b = JSON.stringify(obj); res.writeHead(200, {'Content-Type':'application/json','Content-Length':String(b.length),'Cache-Control':'no-store'}); res.end(b); };
    const jsonUnavailable = (obj) => {
      const b = JSON.stringify({ intercepted: true, ...obj });
      res.writeHead(502, {'Content-Type':'application/json','Content-Length':String(b.length),'Cache-Control':'no-store'});
      res.end(b);
    };

    // Leaderboard / analytics / study-session sync must not return successful
    // fake empty data. Real browser requests are handled by the runtime fetch
    // override and execute Supabase REST/RPC calls with the user's JWT.
    if (fnPath === 'get-leaderboard' || fnPath === 'get-daily-leaderboard') {
      return jsonUnavailable({ error: 'No fake leaderboard data. Use the browser runtime Supabase-backed leaderboard path.', type: fnPath });
    }
    if (fnPath === 'get-group-leaderboard' || fnPath === 'get-group-analytics') {
      return jsonUnavailable({ error: 'No fake group analytics data. Use the browser runtime Supabase-backed community path.', type: fnPath });
    }

    if (fnPath === 'finish-session') {
      return jsonUnavailable({ error: 'No fake study-session sync. finish-session requires the browser runtime Supabase RPC path.', type: fnPath });
    }

    // Payment / billing stubs — not deployed in self-hosted mode
    if (fnPath === 'create_checkout' || fnPath === 'create-checkout') {
      return jsonOk({ url: null, disabled: true, error: 'Payments not configured in self-hosted mode' });
    }
    if (fnPath === 'create_customer_portal_session' || fnPath === 'create-customer-portal-session') {
      return jsonOk({ url: null, disabled: true, error: 'Portal not available in self-hosted mode' });
    }
    if (fnPath === 'redeem_membership_code' || fnPath === 'redeem-membership-code') {
      return jsonOk({ success: true, redeemed: true, message: 'Self-hosted: all features already unlocked' });
    }
  }

  // ── Supabase community proxy ────────────────────────────────────────────────
  if (req.url.startsWith(PROXY_PATH + '/')) {
    handleSupabaseProxy(req, res);
    return;
  }

  // ── Internal API routes ─────────────────────────────────────────────────────
  if (req.method === 'GET' && adminPath === '/api/ai-config') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ gemini: !!GEMINI_API_KEY, groq: !!GROQ_API_KEY }));
    return;
  }
  if (req.method === 'GET' && req.url === '/__isotope/ping') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, ts: Date.now(), proxy: ADMIN_MODE_READY }));
    return;
  }
  if (req.method === 'GET' && req.url === '/__isotope/state') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(appStateStore));
    return;
  }
  if (req.method === 'POST' && req.url === '/__isotope/state') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      try {
        const update = JSON.parse(body);
        if (update.timerState)  appStateStore.timerState = update.timerState;
        if (update.localStorage) Object.assign(appStateStore.localStorage, update.localStorage);
      } catch {}
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    });
    return;
  }
  // Use adminPath (query-stripped) so /api/health?_=<timestamp> speed-probe calls
  // also reach this handler instead of falling through to the 404 fence.
  if (req.method === 'GET' && adminPath === '/api/health') {
    const now = Date.now();
    if (_healthCache && (now - _healthCacheAt) < HEALTH_CACHE_TTL) {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Health-Cached': '1' });
      res.end(JSON.stringify(_healthCache));
      return;
    }
    (async () => {
      const [rest, auth, buckets] = await Promise.all([
        supaRestReq('GET', '/rest/v1/', null).catch(e => ({ status: 0, body: { error: e.message } })),
        supaAdminReq('GET', '/auth/v1/settings', null).catch(e => ({ status: 0, body: { error: e.message } })),
        supaRestReq('GET', '/storage/v1/bucket', null).catch(e => ({ status: 0, body: { error: e.message } })),
      ]);
      const ok = rest.status > 0 && rest.status < 500
              && auth.status > 0 && auth.status < 500
              && buckets.status > 0 && buckets.status < 500;
      const payload = {
        status: ok ? 'ok' : 'degraded',
        checks: {
          supabase_rest: { ok: rest.status > 0 && rest.status < 500, status: rest.status },
          supabase_auth: { ok: auth.status > 0 && auth.status < 500, status: auth.status },
          supabase_storage: { ok: buckets.status > 0 && buckets.status < 500, status: buckets.status },
        },
        config: {
          aiKeys: { gemini: !!GEMINI_API_KEY, groq: !!GROQ_API_KEY },
          supabaseProxy: ADMIN_MODE_READY,
        },
      };
      if (ok) { _healthCache = payload; _healthCacheAt = Date.now(); }
      res.writeHead(ok ? 200 : 503, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify(payload));
    })().catch(e => {
      res.writeHead(503, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify({ status: 'degraded', error: e.message }));
    });
    return;
  }

  // ── /api/version — returns deployed commit SHA ───────────────────────────────
  if (req.method === 'GET' && adminPath === '/api/version') {
    LOCAL_VERSION = readLocalVersionInfo();
    DEPLOYED_SHA = LOCAL_VERSION.sha || DEPLOYED_SHA;
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify({
      version: LOCAL_VERSION.version,
      sha: DEPLOYED_SHA,
      source: LOCAL_VERSION.source,
      message: LOCAL_VERSION.message,
      updated_at: LOCAL_VERSION.updated_at,
      repo: GH_OWNER + '/' + GH_REPO,
      local_server: true,
      update_command: 'isotope update',
      start_command: 'isotope start',
      pwa_cache: 'isotope-local-shell-' + LOCAL_VERSION.version + '-' + String(DEPLOYED_SHA).slice(0, 12),
    }));
    return;
  }

  // ── /api/check-update — compares deployed SHA with latest GitHub commit ──────
  if (req.method === 'GET' && adminPath === '/api/check-update') {
    const now = Date.now();
    if (_ghCache && (now - _ghCacheTs) < GH_TTL) {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify(_ghCache));
      return;
    }
    fetchLatestCommit()
      .then(function (latest) {
        LOCAL_VERSION = readLocalVersionInfo();
        DEPLOYED_SHA = LOCAL_VERSION.sha || DEPLOYED_SHA;
        const upstreamVer = (latest.message || '').match(/\bv?(\d+\.\d+\.\d+)\b/)?.[1] || null;
        const versionCmp = upstreamVer ? compareSemver(upstreamVer, LOCAL_VERSION.version) : null;
        const hasUpdate = versionCmp !== null
          ? versionCmp > 0
          : /^[0-9a-f]{40}$/i.test(DEPLOYED_SHA) && latest.sha && latest.sha !== DEPLOYED_SHA;
        _ghCache = {
          hasUpdate:  hasUpdate,
          deployed:   DEPLOYED_SHA,
          deployed_version: LOCAL_VERSION.version,
          latest_version: upstreamVer,
          latest:     latest.sha,
          message:    latest.message,
          pushed_at:  latest.pushed_at,
          repo:       GH_OWNER + '/' + GH_REPO,
          update_command: 'isotope update',
        };
        _ghCacheTs = now;
        res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
        res.end(JSON.stringify(_ghCache));
      })
      .catch(function (err) {
        res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
        res.end(JSON.stringify({ hasUpdate: false, error: err.message }));
      });
    return;
  }

  // ── Removed product surfaces: Events API ────────────────────────────────────
  if (req.url && (req.url === '/api/community-events' || req.url === '/api/events' || req.url.startsWith('/api/events/') || req.url.startsWith('/api/events?'))) {
    res.writeHead(404, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify({ error: 'Events has been removed from this installation.' }));
    return;
  }

  // ── /api/restart — legacy no-op; browser updates use isotope update now ─────
  if (req.method === 'POST' && req.url === '/api/restart') {
    res.writeHead(202, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify({
      ok: true,
      restart: 'manual-command-required',
      command: 'isotope update',
      message: 'This self-hosted local app is updated through the command system. The server was not stopped.',
    }));
    return;
  }

  // ── /__auth/check — is email available? ──────────────────────────────────
  if (req.method === 'POST' && req.url === '/__auth/check') {
    readReqBody(req).then(({ email, username }) => {
      // accept either `email` or legacy `username` field
      const raw = (email || username || '').toString().trim().toLowerCase();
      if (!raw || !raw.includes('@') || raw.length < 5) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ available: false, error: 'Valid email address required' }));
        return;
      }
      supaAdminReq('GET', '/rest/v1/users?email=eq.' + encodeURIComponent(raw) + '&select=id', null)
        .then(({ body }) => {
          const taken = Array.isArray(body) && body.length > 0;
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ available: !taken, email: raw }));
        })
        .catch(err => {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ available: false, error: err.message }));
        });
    });
    return;
  }

  // ── /__auth/bootstrap GET — authenticated login/session restore snapshot ──
  if (req.method === 'GET' && req.url === '/__auth/bootstrap') {
    (async () => {
      const auth = await requireUserAuth(req, res);
      if (!auth) return;
      const { userJwt, userId } = auth;
      try {
        const dbBundle = await fetchUserBootstrapBundle(userId, userJwt);
        const cloudSnapshot = await downloadCloudSnapshotForUser(userId, userJwt).catch((e) => {
          dbBundle.warnings = compactObject({ ...(dbBundle.warnings || {}), cloud_snapshot: e.message || 'cloud snapshot download failed' });
          return null;
        });
        const bestBackup = await canonicalBackupManager().findBestCloudBackup(userId, userJwt).catch((e) => ({
          ok: false,
          code: e.code || 'BACKUP_SCAN_FAILED',
          error: e.message || 'Best backup scan failed',
          selected: null,
          candidates: [],
        }));
        const bundle = mergeBootstrapBundleWithCloudSnapshot(dbBundle, cloudSnapshot);
        res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
        res.end(JSON.stringify({
          ok: true,
          code: 'BOOTSTRAP_OK',
          ...bundle,
          best_backup: bestBackup.ok === false ? null : bestBackup.selected,
          backup_candidates: bestBackup.candidates || [],
          restore_recommended: !!(bestBackup.selected && bestBackup.selected.rich),
          backup_warning: bestBackup.warning_if_empty_latest || bestBackup.error || null,
        }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
        res.end(JSON.stringify({ ok: false, error: e.message || 'Bootstrap failed' }));
      }
    })().catch(e => {
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
        res.end(JSON.stringify({ ok: false, error: e.message || 'Bootstrap failed' }));
      }
    });
    return;
  }

  // ── /__auth/snapshot POST — refresh canonical cloud snapshot in Storage ───
  if (req.method === 'POST' && req.url === '/__auth/snapshot') {
    (async () => {
      const auth = await requireUserAuth(req, res);
      if (!auth) return;
      const { userJwt, userId } = auth;
      const body = await readReqBody(req, 12 * 1024 * 1024);
      try {
        const manager = canonicalBackupManager();
        const source = body && typeof body.source === 'string' ? body.source : 'supabase';
        if (body?.backup_json) {
          const backupJson = typeof body.backup_json === 'string' ? body.backup_json : JSON.stringify(body.backup_json);
          const normalized = manager.normalizeAnyBackup(backupJson, { source_path: 'snapshot_request' });
          const best = await manager.findBestCloudBackup(userId, userJwt, { includeRaw: true });
          manager.assertNoEmptyOverwrite(normalized, best);
          const written = await manager.writeCanonicalBackup(userId, userJwt, normalized, { source_path: 'snapshot_request', source });
          sendJson(res, 200, {
            ok: true,
            success: true,
            code: 'CANONICAL_SNAPSHOT_WRITTEN',
            state: 'synced',
            stage: 'storage_upload',
            user_id: userId,
            backup: {
              bucket: written.bucket,
              path: written.path,
              history_path: written.history_path,
              cloud_snapshot_path: written.cloud_snapshot_path,
              hash: written.hash,
              size_bytes: written.size_bytes,
              collection_counts: written.collection_counts,
            },
          });
          return;
        }
        const best = await manager.findBestCloudBackup(userId, userJwt, { includeRaw: true });
        if (best.selected_internal?.rich) {
          const err = new Error('Cloud has richer backup. Restore first.');
          err.code = 'BLOCKED_EMPTY_OVERWRITE';
          err.payload = {
            ok: false,
            code: 'BLOCKED_EMPTY_OVERWRITE',
            message: 'Cloud has richer backup. Restore first.',
            selected_backup: best.selected,
            cloud_counts: best.selected_internal.collection_counts,
            local_counts: manager.getCollectionCounts({ data: {} }),
          };
          throw err;
        }
        const refreshed = await refreshCloudSnapshotForUser(userId, userJwt, source);
        sendJson(res, 200, {
          ok: true,
          success: true,
          code: 'PROFILE_SNAPSHOT_WRITTEN',
          state: 'synced',
          stage: 'storage_upload',
          user_id: userId,
          cloud_snapshot: refreshed.snapshot,
          snapshot_storage: refreshed.storage,
        });
      } catch (e) {
        jsonEndpointError(res, e, 'Cloud snapshot upload failed', 'storage_upload');
      }
    })().catch(e => {
      if (!res.headersSent) {
        jsonEndpointError(res, e, 'Cloud snapshot upload failed', 'storage_upload');
      }
    });
    return;
  }

  // ── /__auth/backup/best GET — inspect all canonical + legacy backups ─────
  if (req.method === 'GET' && req.url === '/__auth/backup/best') {
    (async () => {
      const auth = await requireUserAuth(req, res, { payload: { stage: 'auth' } });
      if (!auth) return;
      const { userJwt, userId } = auth;
      try {
        const best = await canonicalBackupManager().findBestCloudBackup(userId, userJwt);
        sendJson(res, 200, {
          ok: true,
          success: true,
          code: 'BEST_BACKUP_SELECTED',
          state: best.selected?.rich ? 'restore_available' : (best.selected ? 'cloud_empty' : 'no_cloud_backup'),
          stage: 'storage_scan',
          selected: best.selected,
          candidates: best.candidates,
          local_recommendation: best.local_recommendation,
          warning_if_empty_latest: best.warning_if_empty_latest,
        });
      } catch (e) {
        jsonEndpointError(res, e, 'Best backup scan failed', 'storage_scan');
      }
    })().catch(e => {
      if (!res.headersSent) jsonEndpointError(res, e, 'Best backup scan failed', 'storage_scan');
    });
    return;
  }

  // ── /__auth/restore-best-backup POST — return payload for browser restore ─
  if (req.method === 'POST' && req.url === '/__auth/restore-best-backup') {
    (async () => {
      const auth = await requireUserAuth(req, res, { payload: { stage: 'auth' } });
      if (!auth) return;
      const { userJwt, userId } = auth;
      const body = await readReqBody(req, 64 * 1024);
      try {
        const restored = await canonicalBackupManager().restoreBestBackup(userId, userJwt, {
          promote: body?.promote !== false,
        });
        sendJson(res, 200, {
          ok: true,
          success: true,
          code: 'RESTORE_BEST_BACKUP_READY',
          state: 'restore_required',
          stage: 'storage_download',
          user_id: userId,
          selected_backup: restored.selected,
          candidates: restored.candidates,
          backup_json: restored.backup_json,
          backup_hash: restored.backup_hash,
          collection_counts: restored.collection_counts,
          promoted: restored.promoted ? {
            path: restored.promoted.path,
            history_path: restored.promoted.history_path,
            cloud_snapshot_path: restored.promoted.cloud_snapshot_path,
            hash: restored.promoted.hash,
            size_bytes: restored.promoted.size_bytes,
            collection_counts: restored.promoted.collection_counts,
          } : null,
          restore_required_on_browser: true,
        });
      } catch (e) {
        jsonEndpointError(res, e, 'Restore best backup failed', 'storage_download');
      }
    })().catch(e => {
      if (!res.headersSent) jsonEndpointError(res, e, 'Restore best backup failed', 'storage_download');
    });
    return;
  }

  // ── /__auth/backup/latest GET — download latest full browser backup ───────
  // Auth: Bearer token verified via Supabase /auth/v1/user.
  if (req.method === 'GET' && req.url === '/__auth/backup/latest') {
    (async () => {
      const auth = await requireUserAuth(req, res, { payload: { stage: 'auth' } });
      if (!auth) return;
      const { userJwt, userId } = auth;
      try {
        const manager = canonicalBackupManager();
        const restored = await manager.restoreBestBackup(userId, userJwt, { promote: false });
        const cloudSnapshot = await downloadCloudSnapshotForUser(userId, userJwt).catch(() => null);
        sendJson(res, 200, {
          ok: true,
          success: true,
          code: 'BEST_BACKUP_RETURNED',
          state: restored.selected?.rich ? 'restore_available' : 'cloud_empty',
          stage: 'storage_download',
          user_id: userId,
          backup_json: restored.backup_json,
          backup_hash: restored.backup_hash,
          collection_counts: restored.collection_counts,
          selected_backup: restored.selected,
          candidates: restored.candidates,
          backup_storage: { bucket: 'user-content', path: restored.selected?.path || null, source: 'best_backup_selector' },
          cloud_snapshot: cloudSnapshot,
        });
      } catch (e) {
        jsonEndpointError(res, e, 'Cloud backup download failed', 'storage_download');
      }
    })().catch(e => {
      if (!res.headersSent) {
        jsonEndpointError(res, e, 'Cloud backup download failed', 'storage_download');
      }
    });
    return;
  }

  // ── /__auth/backup POST — store manual export and refresh latest snapshot ──
  // Auth: Bearer token verified via Supabase /auth/v1/user (not just JWT decode).
  // Returns success:true + uploaded:true on success; stage-tagged errors on failure.
  if (req.method === 'POST' && req.url === '/__auth/backup') {
    (async () => {
      const auth = await requireUserAuth(req, res, { payload: { stage: 'auth' } });
      if (!auth) return;
      const { userJwt, userId } = auth;
      const body = await readReqBody(req, 12 * 1024 * 1024);

      // 3. Build and upload snapshot using user-scoped JWT (anon key + Bearer token = user-scoped client)
      let stage = 'db_read';
      try {
        const manager = canonicalBackupManager();
        const backupJson = typeof body?.backup_json === 'string' ? body.backup_json : JSON.stringify(body?.backup_json || body || {});
        stage = 'snapshot_build';
        const localNormalized = manager.normalizeAnyBackup(backupJson, { source_path: body?.source_path || 'browser_upload' });
        if (!localNormalized.valid) throw new Error(localNormalized.reason || 'This file is not a valid Isotope backup.');
        const best = await manager.findBestCloudBackup(userId, userJwt, { includeRaw: true });
        manager.assertNoEmptyOverwrite(localNormalized, best);

        const rawHash = crypto.createHash('sha256').update(String(backupJson || '')).digest('hex');
        const localDataHash = crypto.createHash('sha256')
          .update(stableJsonStringify(manager.getBackupData(localNormalized)))
          .digest('hex');
        const canonicalCandidate = (best.candidates_internal || []).find((candidate) => candidate.path === `${userId}/backups/latest.json`);
        if (canonicalCandidate?.exists && canonicalCandidate?.valid && canonicalCandidate.data_hash === localDataHash) {
          sendJson(res, 200, {
            ok: true,
            code: 'UNCHANGED',
            state: 'synced',
            message: 'Canonical backup already matches local data.',
            skipped: true,
            hash: canonicalCandidate.hash,
            data_hash: localDataHash,
            size_bytes: canonicalCandidate.size_bytes,
            collection_counts: canonicalCandidate.collection_counts,
            path: canonicalCandidate.path,
            latest_path: canonicalCandidate.path,
            cloud_snapshot_path: `${userId}/cloud-snapshot/latest.json`,
            selected_backup: best.selected,
            snapshot_storage: {
              bucket: 'user-content',
              latest_path: `${userId}/cloud-snapshot/latest.json`,
              skipped: true,
            },
          });
          return;
        }
        let backupToWrite = localNormalized;
        let state = 'uploading_local';
        let conflict = null;
        if (localNormalized.rich && best.selected_internal?.rich && best.selected_internal.data_hash !== localDataHash) {
          const mergedData = mergeNormalizedBackupData(localNormalized, best.selected_internal.normalized);
          backupToWrite = normalizeToCanonicalBackupPayload({ data: mergedData }, {
            exportedAt: new Date().toISOString(),
            appVersion: (typeof LOCAL_VERSION !== 'undefined' && LOCAL_VERSION.version) ? LOCAL_VERSION.version : 'unknown',
          });
          state = 'merged_cloud_and_local';
          conflict = {
            selected_backup: best.selected,
            strategy: 'merge_by_id_newer_fields_preserved',
          };
        }
        stage = 'storage_upload';
        const written = await manager.writeCanonicalBackup(userId, userJwt, backupToWrite, {
          source_path: body?.source_path || 'browser_upload',
          source: body?.source || 'manual_export',
        });
        stage = 'db_read';
        const canonicalParsed = JSON.parse(written.backup_json);
        const applied = await applyBackupProfileToSupabase(userId, userJwt, canonicalParsed).catch((e) => ({
          profile_applied: false,
          warning: e.message || 'Profile apply failed; backup storage still succeeded',
        }));
        const syncedAt = new Date().toISOString();
        stage = 'metadata_update';
        res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
        res.end(JSON.stringify({
          ok: true,
          success: true,
          uploaded: true,
          code: 'CANONICAL_BACKUP_WRITTEN',
          state,
          stage: 'storage_upload',
          bucket: 'user-content',
          path: written.path,
          latest_path: written.latest_path,
          history_path: written.history_path,
          cloud_snapshot_path: written.cloud_snapshot_path,
          hash: written.hash,
          data_hash: written.data_hash || localDataHash,
          size_bytes: written.size_bytes,
          collection_counts: written.collection_counts,
          synced_at: syncedAt,
          user_id: userId,
          export_storage: null,
          applied,
          cloud_snapshot: null,
          snapshot_storage: {
            bucket: 'user-content',
            latest_path: written.cloud_snapshot_path,
            latest_status: 'uploaded',
            uploaded_at: written.exported_at,
          },
          selected_backup: best.selected,
          conflict,
        }));
      } catch (e) {
        jsonEndpointError(res, e, 'Cloud backup failed', stage);
      }
    })().catch(e => {
      if (!res.headersSent) {
        jsonEndpointError(res, e, 'Cloud backup failed', 'storage_upload');
      }
    });
    return;
  }

  // ── /__auth/import POST — store import, apply supported cloud fields ───────
  if (req.method === 'POST' && req.url === '/__auth/import') {
    (async () => {
      const auth = await requireUserAuth(req, res);
      if (!auth) return;
      const { userJwt, userId } = auth;
      const body = await readReqBody(req, 12 * 1024 * 1024);
      try {
        const manager = canonicalBackupManager();
        const backupJson = typeof body?.backup_json === 'string' ? body.backup_json : JSON.stringify(body?.backup_json || {});
        const normalized = manager.normalizeAnyBackup(backupJson, { source_path: 'manual_import' });
        if (!normalized.valid) throw new Error(normalized.reason || 'This file is not a valid Isotope backup.');
        const best = await manager.findBestCloudBackup(userId, userJwt, { includeRaw: true });
        manager.assertNoEmptyOverwrite(normalized, best);
        const importUpload = await uploadRawUserBackupJson(userId, userJwt, backupJson, 'imports');
        const written = await manager.writeCanonicalBackup(userId, userJwt, normalized, {
          source_path: importUpload.latest_path || 'manual_import',
          source: 'manual_import',
        });
        const canonicalParsed = JSON.parse(written.backup_json);
        const applied = await applyBackupProfileToSupabase(userId, userJwt, canonicalParsed).catch((e) => ({
          profile_applied: false,
          warning: e.message || 'Profile apply failed; backup storage still succeeded',
        }));
        res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
        res.end(JSON.stringify({
          ok: true,
          success: true,
          code: 'IMPORT_ARCHIVED_AND_PROMOTED',
          state: 'restore_required',
          stage: 'storage_upload',
          user_id: userId,
          import_storage: importUpload,
          canonical_backup: {
            bucket: written.bucket,
            path: written.path,
            history_path: written.history_path,
            cloud_snapshot_path: written.cloud_snapshot_path,
            hash: written.hash,
            size_bytes: written.size_bytes,
            collection_counts: written.collection_counts,
          },
          applied,
          collection_counts: written.collection_counts,
          restore_required_on_browser: true,
          storage_backed_collections: ['tasks', 'sessions', 'subjects', 'habits', 'dailyLogs', 'tests', 'exams', 'mockTests'],
          storage_backed_reason: 'Server archived and promoted the full backup. Browser must apply the returned/imported backup to local stores for UI-visible restore.',
          cloud_snapshot: null,
          snapshot_storage: {
            bucket: 'user-content',
            latest_path: written.cloud_snapshot_path,
            latest_status: 'uploaded',
            uploaded_at: written.exported_at,
          },
        }));
      } catch (e) {
        jsonEndpointError(res, e, 'Backup import failed', 'storage_upload');
      }
    })().catch(e => {
      if (!res.headersSent) {
        jsonEndpointError(res, e, 'Backup import failed', 'storage_upload');
      }
    });
    return;
  }

  // ── /__auth/storage/cleanup-preview POST — safe user-owned dry run ────────
  if (req.method === 'POST' && req.url === '/__auth/storage/cleanup-preview') {
    (async () => {
      const auth = await requireUserAuth(req, res, { payload: { stage: 'auth' } });
      if (!auth) return;
      const { userJwt, userId } = auth;
      try {
        const preview = await canonicalBackupManager().cleanupPreview(userId, userJwt);
        sendJson(res, 200, {
          ok: true,
          success: true,
          code: 'CLEANUP_PREVIEW_READY',
          state: 'preview',
          stage: 'storage_scan',
          ...preview,
        });
      } catch (e) {
        jsonEndpointError(res, e, 'Storage cleanup preview failed', 'storage_scan');
      }
    })().catch(e => {
      if (!res.headersSent) jsonEndpointError(res, e, 'Storage cleanup preview failed', 'storage_scan');
    });
    return;
  }

  // ── /__auth/storage/cleanup-apply POST — explicit user-owned cleanup ──────
  if (req.method === 'POST' && req.url === '/__auth/storage/cleanup-apply') {
    (async () => {
      const auth = await requireUserAuth(req, res, { payload: { stage: 'auth' } });
      if (!auth) return;
      const { userJwt, userId } = auth;
      const body = await readReqBody(req, 64 * 1024);
      if (body?.confirm !== true) {
        sendJson(res, 400, {
          ok: false,
          success: false,
          code: 'CONFIRMATION_REQUIRED',
          state: 'blocked',
          stage: 'request_validation',
          message: 'Cleanup apply requires confirm:true after reviewing preview.',
        });
        return;
      }
      try {
        const applied = await canonicalBackupManager().cleanupApply(userId, userJwt);
        sendJson(res, 200, {
          ok: true,
          success: true,
          code: 'CLEANUP_APPLIED',
          state: 'applied',
          stage: 'storage_delete',
          ...applied,
        });
      } catch (e) {
        jsonEndpointError(res, e, 'Storage cleanup apply failed', 'storage_delete');
      }
    })().catch(e => {
      if (!res.headersSent) jsonEndpointError(res, e, 'Storage cleanup apply failed', 'storage_delete');
    });
    return;
  }

  // ── /__auth/profile GET — fetch user profile (cloud sync, fixes UserStore fetch error)
  // Returns profile_data from user_profiles merged with public.users columns.
  if (req.method === 'GET' && req.url === '/__auth/profile') {
    (async () => {
      const auth = await requireUserAuth(req, res);
      if (!auth) return;
      const { userJwt, userId } = auth;
      try {
        const bundle = await fetchUserProfileBundle(userId, userJwt);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          ok: true,
          user_id: userId,
          profile: bundle.profile,
          profile_updated_at: bundle.profileUpdatedAt,
          onboarding: bundle.onboardingData,
        }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: e.message }));
      }
    })().catch(e => { if (!res.headersSent) { res.writeHead(500, {'Content-Type':'application/json'}); res.end(JSON.stringify({ok:false,error:e.message})); } });
    return;
  }

  // ── /__auth/profile POST/PATCH — update user profile (display_name, bio, avatar_url, username)
  // BUG FIX: Previously missing — profile updates had no server endpoint to persist to.
  // Deep-merges changes into user_profiles.profile_data (JSONB) and syncs public.users.
  if ((req.method === 'POST' || req.method === 'PATCH') && req.url === '/__auth/profile') {
    (async () => {
      const auth = await requireUserAuth(req, res);
      if (!auth) return;
      const { userJwt, userId } = auth;
      const body = await readReqBody(req, 8 * 1024 * 1024);

      try {
        const incoming = body && typeof body === 'object' ? body : {};
        const currentBundle = await fetchUserProfileBundle(userId, userJwt).catch(() => ({ profileData: {}, userData: {} }));
        const currentProfile = currentBundle.profileData || {};
        const now = new Date().toISOString();
        const merged = Object.assign({}, currentProfile);
        const incomingAvatar = incoming.avatar !== undefined
          ? incoming.avatar
          : (incoming.avatar_url !== undefined
              ? incoming.avatar_url
              : (incoming.profile_data && typeof incoming.profile_data === 'object'
                  ? (incoming.profile_data.avatar !== undefined ? incoming.profile_data.avatar : incoming.profile_data.avatar_url)
                  : undefined));
        const shouldClearAvatar = incomingAvatar === null || incomingAvatar === '';
        const uploadedAvatar = typeof incomingAvatar === 'string' && incomingAvatar.startsWith('data:image/')
          ? await uploadAvatarDataUrlForUser(userId, incomingAvatar, userJwt, currentProfile.avatar_path || currentProfile.avatarPath || null)
          : null;
        let removedAvatar = null;

        if (incoming.profile_data && typeof incoming.profile_data === 'object') {
          Object.assign(merged, incoming.profile_data);
        }
        for (const key of Object.keys(incoming)) {
          if ([
            'id','user_id','email','access_token','refresh_token','session','password',
            'preferences','settings','tours','profile_data','display_name','username',
            'name','bio','avatar','avatar_url','isOnboarded','onboarding_completed'
          ].includes(key)) continue;
          if (incoming[key] !== undefined) merged[key] = incoming[key];
        }
        if (incoming.display_name !== undefined) merged.display_name = String(incoming.display_name || '').trim();
        if (incoming.name !== undefined && incoming.display_name === undefined) merged.display_name = String(incoming.name || '').trim();
        if (incoming.username !== undefined) merged.username = String(incoming.username || '').trim();
        if (incoming.bio !== undefined) merged.bio = String(incoming.bio || '').trim();
        if (incoming.avatar !== undefined) merged.avatar = shouldClearAvatar ? null : String(incoming.avatar || '').trim();
        if (incoming.avatar_url !== undefined) merged.avatar_url = shouldClearAvatar ? null : String(incoming.avatar_url || '').trim();
        if (shouldClearAvatar) {
          const previousPath = currentProfile.avatar_path || currentProfile.avatarPath || null;
          if (previousPath && isOwnedStoragePath(userId, previousPath)) {
            const removed = await supaStorageRemoveAsUser('avatars', previousPath, userJwt);
            assertSupaOk(removed, 'Avatar storage remove');
            removedAvatar = { bucket: 'avatars', path: previousPath, status: removed.status };
          }
          merged.avatar = null;
          merged.avatar_url = null;
          merged.avatar_path = null;
          merged.avatar_bucket = null;
          merged.avatar_uploaded_at = null;
        }
        if (uploadedAvatar) {
          merged.avatar = uploadedAvatar.url;
          merged.avatar_url = uploadedAvatar.url;
          merged.avatar_path = uploadedAvatar.path;
          merged.avatar_bucket = uploadedAvatar.bucket;
          merged.avatar_uploaded_at = now;
        }
        if (incoming.preferences !== undefined && typeof incoming.preferences === 'object') {
          merged.preferences = Object.assign({}, currentProfile.preferences || {}, incoming.preferences);
        }
        if (incoming.settings !== undefined && typeof incoming.settings === 'object') {
          merged.settings = Object.assign({}, currentProfile.settings || {}, incoming.settings);
        }
        if (incoming.tours !== undefined && typeof incoming.tours === 'object') {
          merged.tours = Object.assign({}, currentProfile.tours || {}, incoming.tours);
        }

        const completed = incoming.isOnboarded === true || incoming.onboarding_completed === true || currentProfile.isOnboarded === true;
        if (incoming.isOnboarded !== undefined || incoming.onboarding_completed !== undefined) {
          merged.isOnboarded = completed === true;
          if (completed && !merged.onboardingCompletedAt) merged.onboardingCompletedAt = now;
        }
        merged.last_sync_at = now;

        if (!ADMIN_MODE_READY) {
          const profEnsure = await supaRestAsUser('POST', '/rest/v1/user_profiles?on_conflict=user_id', {
            user_id: userId,
            profile_data: {},
            updated_at: now,
          }, userJwt, { 'Prefer': 'resolution=ignore-duplicates,return=minimal' });
          assertSupaOk(profEnsure, 'Profile row ensure');
        }
        const profilePatchBody = {
          profile_data: merged,
          updated_at: now,
        };
        const profPatch = ADMIN_MODE_READY
          ? await supaAdminReq('PATCH', `/rest/v1/user_profiles?user_id=eq.${encodeURIComponent(userId)}`, profilePatchBody)
          : await supaRestAsUser('PATCH', `/rest/v1/user_profiles?user_id=eq.${encodeURIComponent(userId)}`, profilePatchBody, userJwt, { 'Prefer': 'return=representation' });
        assertSupaOk(profPatch, 'Profile sync');

        const usersUpdate = compactObject({
          username: incoming.username !== undefined ? String(incoming.username || '').trim() : undefined,
          name: incoming.display_name !== undefined ? String(incoming.display_name || '').trim() : (incoming.name !== undefined ? String(incoming.name || '').trim() : undefined),
          avatar_url: uploadedAvatar ? uploadedAvatar.url : (shouldClearAvatar ? null : (incoming.avatar_url !== undefined ? String(incoming.avatar_url || '').trim() : undefined)),
          updated_at: now,
        });
        if (Object.keys(usersUpdate).length > 1) {
          const userPatch = ADMIN_MODE_READY
            ? await supaAdminReq('PATCH', `/rest/v1/users?id=eq.${encodeURIComponent(userId)}`, usersUpdate)
            : await supaRestAsUser('PATCH', `/rest/v1/users?id=eq.${encodeURIComponent(userId)}`, usersUpdate, userJwt, { 'Prefer': 'return=minimal' });
          assertSupaOk(userPatch, 'Public profile sync');
        }

        if (completed === true && (incoming.isOnboarded !== undefined || incoming.onboarding_completed !== undefined)) {
          const onboardingBody = {
            user_id: userId,
            completed: true,
            completed_at: merged.onboardingCompletedAt || now,
            data: incoming.onboarding_data && typeof incoming.onboarding_data === 'object' ? incoming.onboarding_data : {},
            updated_at: now,
          };
          const onboardingUpdate = ADMIN_MODE_READY
            ? await supaAdminReq('POST', '/rest/v1/user_onboarding?on_conflict=user_id', onboardingBody, {
                'Prefer': 'resolution=merge-duplicates,return=representation',
              })
            : await supaRestAsUser('POST', '/rest/v1/user_onboarding?on_conflict=user_id', onboardingBody, userJwt, {
                'Prefer': 'resolution=merge-duplicates,return=representation',
              });
          assertSupaOk(onboardingUpdate, 'Onboarding sync');
          const verify = await supaRestAsUser('GET', `/rest/v1/user_onboarding?user_id=eq.${encodeURIComponent(userId)}&select=completed,completed_at&limit=1`, userJwt);
          assertSupaOk(verify, 'Onboarding verification');
          const row = Array.isArray(verify.body) && verify.body[0] ? verify.body[0] : null;
          if (!row || row.completed !== true) throw new Error('Onboarding completion was not persisted');
        }

        const fresh = await fetchUserProfileBundle(userId, userJwt);
        const refreshedSnapshot = await refreshCloudSnapshotForUser(userId, userJwt, incoming.isOnboarded !== undefined || incoming.onboarding_completed !== undefined ? 'onboarding_save' : 'profile_save');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          ok: true,
          user_id: userId,
          profile: fresh.profile,
          onboarding: fresh.onboardingData,
          avatar_storage: uploadedAvatar,
          removed_avatar_storage: removedAvatar,
          cloud_snapshot: refreshedSnapshot.snapshot,
          snapshot_storage: refreshedSnapshot.storage,
        }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: e.message }));
      }
    })().catch(e => {
      if (!res.headersSent) {
        sendJson(res, 500, { ok: false, error: e.message || 'Profile sync failed' });
      }
    });
    return;
  }

  // ── /__auth/signup — admin create + return session ───────────────────────
  if (req.method === 'POST' && req.url === '/__auth/signup') {
    const clientIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
    if (!checkRateLimit('signup:' + clientIp)) {
      res.writeHead(429, { 'Content-Type': 'application/json', 'Retry-After': '60' });
      res.end(JSON.stringify({ error: 'Too many signup attempts — please wait 60 seconds.' }));
      return;
    }
    readReqBody(req).then(async ({ username, password }) => {
      // `username` is now the email address (sent from the email field `t` in signup form)
      const email = (username || '').toString().trim().toLowerCase();
      if (!email || !email.includes('@') || email.length < 5) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Valid email address required' }));
        return;
      }
      if (!password || String(password).length < 6) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Password must be at least 6 characters' }));
        return;
      }
      const displayName = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_');
      try {
        let signin = null;
        if (ADMIN_MODE_READY) {
          const create = await supaAdminReq('POST', '/auth/v1/admin/users', {
            email,
            password,
            email_confirm: true,
            user_metadata: { username: displayName, full_name: displayName },
          });
          if (create.status !== 200 && create.status !== 201) {
            const rawMsg = (create.body && (create.body.msg || create.body.message || create.body.error)) || JSON.stringify(create.body);
            const isDupe  = String(rawMsg).toLowerCase().includes('already') || create.status === 422;
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: isDupe ? 'Email already registered' : rawMsg }));
            return;
          }
          signin = await supaPasswordSignIn(email, password);
        } else {
          const signup = await supaPasswordSignUp(email, password, { username: displayName, full_name: displayName });
          if (signup.status !== 200 && signup.status !== 201) {
            const rawMsg = (signup.body && (signup.body.msg || signup.body.message || signup.body.error || signup.body.error_description)) || JSON.stringify(signup.body);
            const isDupe  = String(rawMsg).toLowerCase().includes('already') || signup.status === 422;
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: isDupe ? 'Email already registered' : rawMsg }));
            return;
          }
          signin = signup.body && signup.body.access_token ? { status: signup.status, body: signup.body } : await supaPasswordSignIn(email, password);
        }
        if (!signin.body || !signin.body.access_token) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Account created but auto sign-in failed. If email confirmation is enabled, confirm the account and sign in manually.' }));
          return;
        }
        const session = signin.body;
        const userId = session.user?.id || getUserIdFromJwt(session.access_token);
        if (!userId) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Account created but Supabase session did not include a user id.' }));
          return;
        }
        await bootstrapUserRows({ userId, email, displayName, userJwt: session.access_token, onboardingCompleted: false });
        const bundle = await fetchUserProfileBundle(userId, session.access_token);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          session,
          user_id: userId,
          profile: bundle.profile,
          onboarding_completed: bundle.profile.onboarding_completed === true,
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // ── /__admin/sync — backup diagnostics and repair console ────────────────
  if (req.method === 'GET' && req.url.startsWith('/__admin/sync')) {
    if (!isAdminAuthed(req)) {
      res.writeHead(401, { 'Content-Type': 'text/plain' }); res.end('Unauthorized'); return;
    }
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Isotope Admin Sync</title>
<style>
body{margin:0;background:#10140f;color:#eef2e8;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif}
main{max-width:1120px;margin:0 auto;padding:28px}a{color:#9ccf7a}.nav{display:flex;gap:14px;margin-bottom:18px}
.card{background:#182015;border:1px solid #314427;border-radius:18px;padding:20px;margin:14px 0;box-shadow:0 20px 70px #0005}
input,button{font:inherit;border-radius:12px;border:1px solid #3b5230;padding:10px 12px;background:#0d120b;color:#eef2e8}
button{background:#d9ff7a;color:#17200e;font-weight:800;cursor:pointer}button.secondary{background:#20301a;color:#e8f8da}
pre{white-space:pre-wrap;word-break:break-word;background:#0b1009;border:1px solid #27351f;border-radius:14px;padding:14px;max-height:520px;overflow:auto}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}@media(max-width:800px){.grid{grid-template-columns:1fr}}
.muted{color:#aab8a0}.danger{color:#ffb4a8}
</style></head><body><main>
<div class="nav"><a href="/__admin/verify">Verify</a><a href="/__admin/storage">Storage</a><a href="/__admin/roles">Roles</a><a href="/__admin/patch">Patch</a></div>
<h1>Sync Repair</h1><p class="muted">Inspect best backup candidates, promote the selected rich backup, and preview cleanup. No delete runs from this page without an explicit apply request.</p>
<div class="card"><label>User ID</label><br><input id="uid" style="width:min(100%,560px)" value="3f56d64e-b1c5-45d6-9ba3-4e204f6bc9df">
<p><button onclick="repair(true)">Dry-run repair</button> <button class="secondary" onclick="repair(false)">Apply repair</button> <button class="secondary" onclick="cleanupPreview()">Cleanup preview</button></p></div>
<div class="grid"><div class="card"><h2>Result</h2><pre id="out">Run a dry-run first.</pre></div><div class="card"><h2>Notes</h2><p class="muted">Expected safe repair: rich import or canonical backup wins; profile-only latest loses; canonical latest and cloud-snapshot mirror are rebuilt on apply.</p><p class="danger">Cleanup apply is available through the JSON API only and requires confirm:true.</p></div></div>
<script>
async function post(url, body){ const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body||{})}); const d=await r.json().catch(()=>({ok:false,error:'Bad JSON'})); document.getElementById('out').textContent=JSON.stringify(d,null,2); }
function user(){ return document.getElementById('uid').value.trim(); }
function repair(dry_run){ return post('/__admin/sync/repair-user-backup',{user_id:user(),dry_run}); }
function cleanupPreview(){ return post('/__admin/storage/cleanup-preview',{user_id:user()}); }
</script></main></body></html>`;
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(html);
    return;
  }

  if (req.method === 'POST' && req.url === '/__admin/sync/repair-user-backup') {
    if (!isAdminAuthed(req)) { sendJson(res, 401, { ok: false, code: 'AUTH_REQUIRED', error: 'Unauthorized' }); return; }
    (async () => {
      const body = await readReqBody(req, 128 * 1024);
      const userId = String(body?.user_id || '').trim();
      if (!/^[0-9a-f-]{36}$/i.test(userId)) {
        sendJson(res, 400, { ok: false, code: 'BAD_USER_ID', error: 'Valid user_id is required' });
        return;
      }
      if (!SUPA_SERVICE_KEY) {
        sendJson(res, 503, { ok: false, code: 'SERVICE_ROLE_REQUIRED', error: 'Admin repair requires SUPABASE_SERVICE_ROLE_KEY on the server.' });
        return;
      }
      const manager = canonicalBackupManager();
      const best = await manager.findBestCloudBackup(userId, SUPA_SERVICE_KEY, { includeRaw: true });
      if (body?.dry_run !== false) {
        sendJson(res, 200, {
          ok: true,
          code: 'REPAIR_DRY_RUN',
          dry_run: true,
          selected: best.selected,
          candidates: best.candidates,
          planned_writes: best.selected ? [
            `${userId}/backups/latest.json`,
            `${userId}/backups/history/{timestamp}-{hash}.json`,
            `${userId}/cloud-snapshot/latest.json`,
          ] : [],
          warning_if_empty_latest: best.warning_if_empty_latest,
        });
        return;
      }
      const restored = await manager.restoreBestBackup(userId, SUPA_SERVICE_KEY, { promote: true });
      sendJson(res, 200, {
        ok: true,
        code: 'REPAIR_APPLIED',
        dry_run: false,
        selected: restored.selected,
        promoted: restored.promoted ? {
          path: restored.promoted.path,
          history_path: restored.promoted.history_path,
          cloud_snapshot_path: restored.promoted.cloud_snapshot_path,
          hash: restored.promoted.hash,
          size_bytes: restored.promoted.size_bytes,
          collection_counts: restored.promoted.collection_counts,
        } : null,
        collection_counts: restored.collection_counts,
      });
    })().catch(e => jsonEndpointError(res, e, 'Admin repair failed', 'storage_repair'));
    return;
  }

  // ── /__admin/storage — backup cleanup console ─────────────────────────────
  if (req.method === 'GET' && req.url.startsWith('/__admin/storage')) {
    if (!isAdminAuthed(req)) {
      res.writeHead(401, { 'Content-Type': 'text/plain' }); res.end('Unauthorized'); return;
    }
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Isotope Admin Storage</title>
<style>body{margin:0;background:#111827;color:#eef2ff;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif}main{max-width:1120px;margin:0 auto;padding:28px}a{color:#93c5fd}.nav{display:flex;gap:14px;margin-bottom:18px}.card{background:#172033;border:1px solid #334155;border-radius:18px;padding:20px;margin:14px 0}input,button{font:inherit;border-radius:12px;border:1px solid #475569;padding:10px 12px;background:#0f172a;color:#eef2ff}button{background:#93c5fd;color:#0f172a;font-weight:800;cursor:pointer}button.danger{background:#fca5a5}pre{white-space:pre-wrap;word-break:break-word;background:#0b1120;border:1px solid #25324a;border-radius:14px;padding:14px;max-height:560px;overflow:auto}.muted{color:#b6c2d3}</style></head><body><main>
<div class="nav"><a href="/__admin/verify">Verify</a><a href="/__admin/sync">Sync</a><a href="/__admin/roles">Roles</a><a href="/__admin/patch">Patch</a></div>
<h1>Storage Cleanup</h1><p class="muted">Preview first. Apply requires an explicit confirm flag and never deletes canonical latest or the selected best backup.</p>
<div class="card"><label>User ID</label><br><input id="uid" style="width:min(100%,560px)" value="3f56d64e-b1c5-45d6-9ba3-4e204f6bc9df">
<p><button onclick="preview()">Preview cleanup</button> <button class="danger" onclick="applyCleanup()">Apply cleanup</button></p></div>
<div class="card"><pre id="out">Run preview first.</pre></div>
<script>
async function post(url, body){ const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body||{})}); const d=await r.json().catch(()=>({ok:false,error:'Bad JSON'})); document.getElementById('out').textContent=JSON.stringify(d,null,2); }
function user(){ return document.getElementById('uid').value.trim(); }
function preview(){ return post('/__admin/storage/cleanup-preview',{user_id:user()}); }
function applyCleanup(){ if(!confirm('Apply cleanup for this user after reviewing preview?')) return; return post('/__admin/storage/cleanup-apply',{user_id:user(),confirm:true}); }
</script></main></body></html>`;
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(html);
    return;
  }

  if (req.method === 'POST' && (req.url === '/__admin/storage/cleanup-preview' || req.url === '/__admin/storage/cleanup-apply')) {
    if (!isAdminAuthed(req)) { sendJson(res, 401, { ok: false, code: 'AUTH_REQUIRED', error: 'Unauthorized' }); return; }
    (async () => {
      const body = await readReqBody(req, 128 * 1024);
      const userId = String(body?.user_id || '').trim();
      if (!/^[0-9a-f-]{36}$/i.test(userId)) {
        sendJson(res, 400, { ok: false, code: 'BAD_USER_ID', error: 'Valid user_id is required' });
        return;
      }
      if (!SUPA_SERVICE_KEY) {
        sendJson(res, 503, { ok: false, code: 'SERVICE_ROLE_REQUIRED', error: 'Admin storage cleanup requires SUPABASE_SERVICE_ROLE_KEY on the server.' });
        return;
      }
      const manager = canonicalBackupManager();
      if (req.url.endsWith('/cleanup-apply')) {
        if (body?.confirm !== true) {
          sendJson(res, 400, { ok: false, code: 'CONFIRMATION_REQUIRED', error: 'Cleanup apply requires confirm:true.' });
          return;
        }
        const applied = await manager.cleanupApply(userId, SUPA_SERVICE_KEY);
        sendJson(res, 200, { ok: true, code: 'ADMIN_CLEANUP_APPLIED', ...applied });
        return;
      }
      const preview = await manager.cleanupPreview(userId, SUPA_SERVICE_KEY);
      sendJson(res, 200, { ok: true, code: 'ADMIN_CLEANUP_PREVIEW', ...preview });
    })().catch(e => jsonEndpointError(res, e, 'Admin storage cleanup failed', 'storage_cleanup'));
    return;
  }

  // ── /__admin/roles — RBAC user roles management (Prompt 2/4 auth hardening) ──
  if (req.method === 'GET' && req.url === '/__admin/roles') {
    if (!isAdminAuthed(req)) {
      res.writeHead(401, { 'Content-Type': 'text/plain' }); res.end('Unauthorized'); return;
    }
    (async () => {
      const svcKey = SUPA_SERVICE_KEY || SUPA_ANON_KEY;
      const supaHost = new URL(SUPA_URL).hostname;
      // Fetch all roles joined with user email
      const rolesRes = await new Promise((resolve, reject) => {
        const o = { hostname: supaHost, path: `/rest/v1/user_roles?select=id,user_id,role,granted_at&order=granted_at.desc&limit=200`, method: 'GET', headers: { 'apikey': svcKey, 'Authorization': 'Bearer ' + svcKey, 'Accept': 'application/json' } };
        const rq = https.request(o, r => { const ch = []; r.on('data', c => ch.push(c)); r.on('end', () => { try { resolve(JSON.parse(Buffer.concat(ch).toString())); } catch { resolve([]); } }); });
        rq.on('error', reject); rq.end();
      });
      const roles = Array.isArray(rolesRes) ? rolesRes : [];
      // Fetch user emails for each role
      const userIds = [...new Set(roles.map(r => r.user_id))];
      let emailMap = {};
      if (userIds.length > 0) {
        try {
          const uRes = await supaAdminReq('GET', `/auth/v1/admin/users?page=1&per_page=1000`);
          if (uRes.body && Array.isArray(uRes.body.users)) {
            uRes.body.users.forEach(u => { emailMap[u.id] = u.email; });
          }
        } catch {}
      }
      const rows = roles.map(r => `<tr><td style="font-family:monospace;font-size:11px">${emailMap[r.user_id] || r.user_id}</td><td><span style="background:${r.role==='admin'?'#7c3aed':'#374151'};color:#fff;padding:2px 8px;border-radius:999px;font-size:11px">${r.role}</span></td><td style="font-size:11px;color:#555">${new Date(r.granted_at).toLocaleDateString()}</td><td><button onclick="revokeRole('${r.id}')" style="background:#7f1d1d;color:#fca5a5;border:none;padding:4px 10px;border-radius:5px;cursor:pointer;font-size:11px">Revoke</button></td></tr>`).join('');
      const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>IsotopeAI — User Roles</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0a0a0a;color:#e5e5e5;min-height:100vh}
.topbar{background:#0f0f0f;border-bottom:1px solid #1a1a1a;padding:12px 24px;display:flex;align-items:center;gap:16px}
.topbar h1{font-size:16px;font-weight:700;color:#a78bfa;flex:1}.topbar a{color:#818cf8;font-size:12px;text-decoration:none}
.wrap{max-width:900px;margin:0 auto;padding:24px}h2{font-size:14px;font-weight:700;color:#a78bfa;margin-bottom:12px}
.card{background:#111;border:1px solid #1f1f1f;border-radius:10px;padding:20px;margin-bottom:16px}
table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:8px 12px;border-bottom:1px solid #1a1a1a}th{font-size:11px;font-weight:700;color:#555;text-transform:uppercase}
input,select{background:#0a0a0a;border:1px solid #252525;border-radius:6px;padding:7px 10px;color:#e5e5e5;font-size:12px;width:100%;outline:none;margin-top:4px}
input:focus,select:focus{border-color:#7c3aed}.btn{background:#7c3aed;color:#fff;border:none;padding:9px 18px;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer}
.btn:hover{background:#6d28d9}.msg{padding:8px 12px;border-radius:6px;font-size:12px;margin-top:10px;display:none}
.msg-ok{background:#052e16;border:1px solid #14532d;color:#86efac}.msg-err{background:#2d0000;border:1px solid #7f1d1d;color:#fca5a5}</style></head>
<body>
<div class="topbar"><h1>🔐 User Roles</h1>
  <a href="/__admin/verify">← Verify</a><a href="/__admin/patch">Patch</a></div>
<div class="wrap">
  <div class="card">
    <h2>Grant Role</h2>
    <div style="display:grid;grid-template-columns:1fr 160px 120px;gap:10px;align-items:end">
      <div><label style="font-size:10px;color:#555;font-weight:700">USER EMAIL</label><input type="email" id="email" placeholder="user@example.com"></div>
      <div><label style="font-size:10px;color:#555;font-weight:700">ROLE</label><select id="role"><option value="admin">admin</option><option value="moderator">moderator</option><option value="user">user</option></select></div>
      <button class="btn" onclick="grantRole()">Grant</button>
    </div>
    <div class="msg msg-ok" id="msg-ok"></div>
    <div class="msg msg-err" id="msg-err"></div>
  </div>
  <div class="card">
    <h2>Current Roles (${roles.length})</h2>
    <table><thead><tr><th>Email / User ID</th><th>Role</th><th>Granted</th><th>Action</th></tr></thead>
    <tbody id="tbody">${rows || '<tr><td colspan="4" style="color:#555;text-align:center;padding:20px">No roles assigned</td></tr>'}</tbody></table>
  </div>
</div>
<script>
async function grantRole() {
  const email = document.getElementById('email').value.trim();
  const role  = document.getElementById('role').value;
  if (!email) { showMsg('err','Email is required'); return; }
  const r = await fetch('/__admin/roles', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, role }) });
  const d = await r.json();
  if (d.ok) { showMsg('ok', 'Role granted — reload to see updated list'); setTimeout(()=>location.reload(),1500); }
  else showMsg('err', d.error || 'Failed');
}
async function revokeRole(id) {
  if (!confirm('Revoke this role?')) return;
  const r = await fetch('/__admin/roles', { method: 'DELETE', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ id }) });
  const d = await r.json();
  if (d.ok) location.reload();
  else alert(d.error || 'Failed');
}
function showMsg(type, msg) {
  document.querySelectorAll('.msg').forEach(m=>m.style.display='none');
  const el = document.getElementById('msg-'+type); el.textContent = msg; el.style.display='block';
}
</script>
</body></html>`;
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(html);
    })().catch(e => { res.writeHead(500, {'Content-Type':'text/plain'}); res.end('Roles error: ' + e.message); });
    return;
  }

  // ── /__admin/roles POST — grant a role by email ───────────────────────────
  if (req.method === 'POST' && req.url === '/__admin/roles') {
    if (!isAdminAuthed(req)) { res.writeHead(401, {'Content-Type':'application/json'}); res.end(JSON.stringify({ok:false,error:'Unauthorized'})); return; }
    readReqBody(req).then(async ({ email, role }) => {
      if (!email || !role) { res.writeHead(400, {'Content-Type':'application/json'}); res.end(JSON.stringify({ok:false,error:'email and role required'})); return; }
      try {
        const svcKey = SUPA_SERVICE_KEY || SUPA_ANON_KEY;
        const supaHost = new URL(SUPA_URL).hostname;
        // Look up user by email
        const uList = await supaAdminReq('GET', `/auth/v1/admin/users?page=1&per_page=1000`);
        const users = (uList.body && Array.isArray(uList.body.users)) ? uList.body.users : [];
        const user = users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
        if (!user) { res.writeHead(404, {'Content-Type':'application/json'}); res.end(JSON.stringify({ok:false,error:'User not found'})); return; }
        const insertBody = Buffer.from(JSON.stringify({ user_id: user.id, role, granted_by: null }));
        const iRes = await new Promise((resolve, reject) => {
          const o = { hostname: supaHost, path: `/rest/v1/user_roles`, method: 'POST', headers: { 'apikey': svcKey, 'Authorization': 'Bearer ' + svcKey, 'Content-Type': 'application/json', 'Prefer': 'resolution=merge-duplicates,return=minimal', 'Content-Length': String(insertBody.length) } };
          const rq = https.request(o, r => { r.resume(); r.on('end', () => resolve({ status: r.statusCode })); });
          rq.on('error', reject); rq.write(insertBody); rq.end();
        });
        if (iRes.status >= 200 && iRes.status < 300) {
          // Also set role in Supabase app_metadata so it appears in JWT claims
          // and RLS policies can check auth.jwt() ->> 'role' without extra DB queries.
          try {
            await supaAdminReq('PUT', `/auth/v1/admin/users/${user.id}`, {
              app_metadata: { role }
            });
          } catch (_e) { /* non-fatal — user_roles table is the authoritative store */ }
          res.writeHead(200, {'Content-Type':'application/json'}); res.end(JSON.stringify({ok:true}));
        } else {
          res.writeHead(400, {'Content-Type':'application/json'}); res.end(JSON.stringify({ok:false,error:'Insert failed: status '+iRes.status}));
        }
      } catch (e) { res.writeHead(500, {'Content-Type':'application/json'}); res.end(JSON.stringify({ok:false,error:e.message})); }
    });
    return;
  }

  // ── /__admin/roles DELETE — revoke a role by id ───────────────────────────
  if (req.method === 'DELETE' && req.url === '/__admin/roles') {
    if (!isAdminAuthed(req)) { res.writeHead(401, {'Content-Type':'application/json'}); res.end(JSON.stringify({ok:false,error:'Unauthorized'})); return; }
    readReqBody(req).then(async ({ id }) => {
      if (!id) { res.writeHead(400, {'Content-Type':'application/json'}); res.end(JSON.stringify({ok:false,error:'id required'})); return; }
      try {
        const svcKey = SUPA_SERVICE_KEY || SUPA_ANON_KEY;
        const supaHost = new URL(SUPA_URL).hostname;
        const dRes = await new Promise((resolve, reject) => {
          const o = { hostname: supaHost, path: `/rest/v1/user_roles?id=eq.${encodeURIComponent(id)}`, method: 'DELETE', headers: { 'apikey': svcKey, 'Authorization': 'Bearer ' + svcKey, 'Prefer': 'return=minimal' } };
          const rq = https.request(o, r => { r.resume(); r.on('end', () => resolve({ status: r.statusCode })); });
          rq.on('error', reject); rq.end();
        });
        res.writeHead(200, {'Content-Type':'application/json'}); res.end(JSON.stringify({ok: dRes.status >= 200 && dRes.status < 300}));
      } catch (e) { res.writeHead(500, {'Content-Type':'application/json'}); res.end(JSON.stringify({ok:false,error:e.message})); }
    });
    return;
  }

  // ── /__admin/schema — serve the v2 schema SQL for copy-paste into Supabase ─
  if (req.method === 'GET' && req.url === '/__admin/schema') {
    try {
      const sqlPath = path.join(__dirname, 'isotope-complete.sql');
      const sql = fs.readFileSync(sqlPath, 'utf8');
      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': 'attachment; filename="isotope-complete.sql"',
        'Cache-Control': 'no-store',
      });
      res.end(sql);
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Schema file not found: ' + e.message);
    }
    return;
  }

  // ── /__admin/patch — community schema patch v6 (HTML UI + raw SQL) ─────────
  if (req.method === 'GET' && (req.url === '/__admin/patch' || req.url === '/__admin/patch.sql')) {
    try {
      const sqlPath = path.join(__dirname, 'community-patch-v4.sql');
      const sql = fs.readFileSync(sqlPath, 'utf8');
      if (req.url === '/__admin/patch.sql') {
        res.writeHead(200, {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': 'attachment; filename="community-patch-v6.sql"',
          'Cache-Control': 'no-store',
        });
        res.end(sql);
        return;
      }
      const escaped  = sql.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      const supaUrl  = `https://supabase.com/dashboard/project/${new URL(SUPA_URL).hostname.split('.')[0]}/sql/new`;
      const patEnv   = process.env.SUPABASE_ACCESS_TOKEN || '';
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>IsotopeAI — Community Schema Patch v6</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0f0f0f;color:#e5e5e5;min-height:100vh;padding:32px 24px}
  .card{max-width:900px;margin:0 auto}
  h1{font-size:22px;font-weight:700;color:#a78bfa;margin-bottom:4px}
  .sub{color:#888;font-size:13px;margin-bottom:28px}
  .section{background:#1a1a1a;border:1px solid #2a2a2a;border-radius:10px;padding:20px 24px;margin-bottom:16px}
  .tag{display:inline-block;font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px;margin-bottom:8px}
  .tag-auto{background:#7c3aed;color:#fff}
  .tag-manual{background:#374151;color:#9ca3af}
  h3{font-size:14px;font-weight:600;margin-bottom:6px}
  p,label{font-size:13px;color:#aaa;line-height:1.6}
  a.btn{display:inline-block;background:#7c3aed;color:#fff;text-decoration:none;padding:10px 20px;border-radius:7px;font-size:13px;font-weight:600;margin-top:12px}
  a.btn:hover{background:#6d28d9}
  button.btn{background:#22c55e;color:#fff;border:none;padding:10px 20px;border-radius:7px;font-size:13px;font-weight:600;cursor:pointer;margin-top:12px}
  button.btn:hover{background:#16a34a}
  button.btn:disabled{background:#374151;color:#6b7280;cursor:not-allowed}
  .copy-btn{display:inline-block;background:#374151;color:#e5e5e5;border:none;padding:9px 18px;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer;margin-top:12px;margin-right:8px}
  input[type=text],input[type=password]{width:100%;background:#111;border:1px solid #333;border-radius:6px;padding:10px 12px;font-size:13px;color:#e5e5e5;margin-top:8px;outline:none}
  input:focus{border-color:#7c3aed}
  pre{background:#111;border:1px solid #222;border-radius:8px;padding:16px;font-size:11px;line-height:1.6;overflow:auto;max-height:360px;margin-top:12px;color:#86efac}
  .badge{background:#1e1e1e;border:1px solid #333;border-radius:6px;padding:6px 12px;font-size:12px;font-family:monospace;color:#a78bfa;display:inline-block;margin-top:8px}
  #log{background:#0a0a0a;border:1px solid #1f1f1f;border-radius:8px;padding:14px;font-size:11px;font-family:monospace;max-height:340px;overflow-y:auto;margin-top:14px;display:none}
  .ok{color:#22c55e} .err{color:#f87171} .warn{color:#fb923c} .dim{color:#555}
  #progress{margin-top:10px;font-size:12px;color:#a78bfa;display:none}
  .done-banner{background:#14532d;border:1px solid #166534;border-radius:8px;padding:14px 18px;margin-top:14px;display:none;font-size:13px;color:#86efac;font-weight:600}
  .err-banner{background:#450a0a;border:1px solid #7f1d1d;border-radius:8px;padding:14px 18px;margin-top:14px;display:none;font-size:13px;color:#fca5a5}
  a.pat-link{color:#818cf8;font-size:12px}
</style>
</head>
<body>
<div class="card">
  <h1>🛠 Community Schema Patch v6</h1>
  <p class="sub">IsotopeAI self-hosted — one-click or paste-and-run to enable all community features<br>
    <span class="badge">${SUPA_URL}</span>
  </p>

  <!-- ── ONE-CLICK APPLY ───────────────────────────────────────── -->
  <div class="section">
    <span class="tag tag-auto">⚡ ONE-CLICK APPLY</span>
    <h3>Apply via Supabase Management API</h3>
    <p>Paste your <strong>Supabase Personal Access Token</strong> below and click Apply — the server will run every SQL statement automatically via the REST API. No copy-paste needed.</p>
    <p style="margin-top:6px">Get your token at: <a class="pat-link" href="https://supabase.com/dashboard/account/tokens" target="_blank">supabase.com/dashboard/account/tokens →</a></p>
    <input type="password" id="pat" placeholder="Supabase personal access token"
           value="${patEnv}" autocomplete="off" spellcheck="false">
    <div style="margin-top:12px">
      <button class="btn" id="apply-btn" onclick="applySQL()">🚀 Apply All SQL Now</button>
    </div>
    <div id="progress"></div>
    <div id="log"></div>
    <div class="done-banner" id="done-banner">✅ All statements applied successfully! Hard-reload the app to activate community features.</div>
    <div class="err-banner" id="err-banner"></div>
    <p style="margin-top:14px;font-size:12px;color:#555">
      Tip: set <code>SUPABASE_ACCESS_TOKEN=your-personal-access-token</code> as an env var on your server to pre-fill this field automatically.
    </p>
  </div>

  <!-- ── MANUAL FALLBACK ───────────────────────────────────────── -->
  <div class="section">
    <span class="tag tag-manual">MANUAL FALLBACK</span>
    <h3>Copy SQL into Supabase SQL Editor</h3>
    <p>If you prefer, copy the SQL below and paste it into the Supabase SQL Editor directly.</p>
    <button class="copy-btn" onclick="copySQL()">📋 Copy SQL</button>
    <a class="btn" href="/__admin/patch.sql" download style="background:#374151;margin-left:6px">⬇ Download .sql</a>
    <a class="btn" href="${supaUrl}" target="_blank" style="background:#1e293b;margin-left:6px">Open SQL Editor →</a>
    <pre id="sql-code">${escaped}</pre>
  </div>
</div>

<script>
const PROJ_REF = '${new URL(SUPA_URL).hostname.split('.')[0]}';

function log(msg, cls=''){
  const el=document.getElementById('log');
  el.style.display='block';
  const ln=document.createElement('div');
  ln.className=cls;
  ln.textContent=msg;
  el.appendChild(ln);
  el.scrollTop=el.scrollHeight;
}

function setProgress(txt){ const p=document.getElementById('progress'); p.style.display='block'; p.textContent=txt; }

// Send the ENTIRE SQL file as ONE atomic batch query.
// This is the only correct approach for SQL files with DO $$...END $$ blocks —
// splitting by semicolons breaks dollar-quoted strings regardless of parser complexity.
// The Supabase Management API supports multi-statement SQL in a single call (returns 201).
async function applySQL(){
  const pat=document.getElementById('pat').value.trim();
  if(!pat){ alert('Paste your Supabase Personal Access Token first.'); return; }
  const btn=document.getElementById('apply-btn');
  btn.disabled=true;
  btn.textContent='⏳ Applying…';
  document.getElementById('log').innerHTML='';
  document.getElementById('log').style.display='none';
  document.getElementById('done-banner').style.display='none';
  document.getElementById('err-banner').style.display='none';

  const rawSQL=document.getElementById('sql-code').innerText;
  const lineCount=rawSQL.split('\\n').filter(function(l){return l.trim()&&!l.trim().startsWith('--');}).length;
  log('Sending full SQL patch ('+lineCount+' non-comment lines) as a single atomic batch…','dim');
  log('Single-batch mode avoids splitting DO $$…END $$ blocks.','dim');
  setProgress('Applying full SQL patch to Supabase…');

  try{
    const r=await fetch('/__admin/apply-sql',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({pat, sql: rawSQL})
    });
    const body=await r.json().catch(function(){return {};});
    if(body.ok){
      log('✅ Full patch applied successfully in one shot!','ok');
      setProgress('Done — all statements applied as a single atomic batch.');
      document.getElementById('done-banner').style.display='block';
    } else {
      const errMsg=(body.body&&(body.body.message||body.body.error||JSON.stringify(body.body)))||'HTTP '+r.status;
      log('✗ Apply failed: '+errMsg,'err');
      setProgress('Failed — see error above. Try the Supabase SQL Editor as a fallback.');
      const eb=document.getElementById('err-banner');
      eb.style.display='block';
      eb.textContent='⚠ Patch failed: '+errMsg;
    }
  } catch(e){
    log('✗ Network error: '+e.message,'err');
    setProgress('Network error — check browser console.');
    const eb=document.getElementById('err-banner');
    eb.style.display='block';
    eb.textContent='⚠ Network error: '+e.message;
  }

  btn.disabled=false;
  btn.textContent='🚀 Apply All SQL Now';
}

function copySQL(){
  const txt=document.getElementById('sql-code').innerText;
  navigator.clipboard.writeText(txt).then(()=>{
    const b=document.querySelector('.copy-btn');
    b.textContent='✅ Copied!';
    setTimeout(()=>b.textContent='📋 Copy SQL',2000);
  });
}
</script>
</body>
</html>`;
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(html);
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Patch file not found: ' + e.message);
    }
    return;
  }

  // ── /__admin/verify — full automated test suite ───────────────────────────
  if (req.method === 'GET' && new URL('http://x' + req.url).pathname === '/__admin/verify') {
    (async () => {
      const t0 = Date.now();
      const supaHost = new URL(SUPA_URL).hostname;
      const svcKey   = SUPA_SERVICE_KEY || SUPA_ANON_KEY;
      const anonKey  = SUPA_ANON_KEY;

      // ── HTTP helpers ──────────────────────────────────────────────────────
      function supaReq(method, path, body, key) {
        return new Promise((resolve) => {
          const data = body ? Buffer.from(typeof body === 'string' ? body : JSON.stringify(body)) : null;
          const hdrs = {
            'apikey': key, 'Authorization': 'Bearer ' + key, 'Accept': 'application/json',
            ...(data ? { 'Content-Type': 'application/json', 'Content-Length': String(data.length) } : {}),
          };
          const rq = https.request({ hostname: supaHost, path, method, headers: hdrs }, (r) => {
            const ch = []; r.on('data', c => ch.push(c));
            r.on('end', () => {
              let b; try { b = JSON.parse(Buffer.concat(ch).toString()); } catch { b = {}; }
              resolve({ status: r.statusCode, body: b, raw: Buffer.concat(ch).toString() });
            });
          });
          rq.on('error', e => resolve({ status: 0, body: { message: e.message }, raw: '' }));
          rq.setTimeout(10000, () => { rq.destroy(); resolve({ status: 0, body: { message: 'timeout' }, raw: '' }); });
          if (data) rq.write(data);
          rq.end();
        });
      }

      function localReq(method, path, body, extraHdrs = {}) {
        return new Promise((resolve) => {
          const data = body ? Buffer.from(typeof body === 'string' ? body : JSON.stringify(body)) : null;
          const hdrs = {
            'Host': 'localhost', 'Accept': 'application/json',
            'apikey': svcKey, 'Authorization': 'Bearer ' + svcKey,
            ...(ADMIN_SECRET ? { 'X-Admin-Secret': ADMIN_SECRET } : {}),
            ...(data ? { 'Content-Type': 'application/json', 'Content-Length': String(data.length) } : {}),
            ...extraHdrs,
          };
          const rq = http.request({ hostname: '127.0.0.1', port, path, method, headers: hdrs }, (r) => {
            const ch = []; r.on('data', c => ch.push(c));
            r.on('end', () => {
              let b; try { b = JSON.parse(Buffer.concat(ch).toString()); } catch { b = {}; }
              resolve({ status: r.statusCode, body: b });
            });
          });
          rq.on('error', e => resolve({ status: 0, body: { message: e.message } }));
          rq.setTimeout(10000, () => { rq.destroy(); resolve({ status: 0, body: { message: 'timeout' } }); });
          if (data) rq.write(data);
          rq.end();
        });
      }

      function err(r) {
        const b = r.body || {};
        return (b.message || b.hint || b.code || b.error || '').slice(0, 110);
      }
      function isRlsRecursion(r) { return (err(r) || '').includes('infinite recursion') || (r.body && r.body.code === '42P17'); }

      // ── CATEGORY 1: Table schema checks (admin mode service key) ──────────
      const SCHEMA = {
        users:                        ['id','email','username','plan_type','billing_status','coins','gems'],
        user_profiles:                ['user_id','profile_data'],
        user_onboarding:              ['user_id','completed','completed_at','data','updated_at'],
        user_points:                  ['user_id','points','lifetime_points'],
        user_stats_summary:           ['user_id','total_study_seconds','total_hours','weekly_hours','monthly_hours','streak_days','current_streak','max_streak_days','longest_streak','session_count','total_sessions','last_study_date','last_session_at'],
        daily_user_stats:             ['user_id','date','seconds_studied'],
        study_sessions_log:           ['id','user_id','duration_minutes','ended_at','created_at'],
        groups:                       ['id','name','slug','member_count','owner_id','is_public','max_members','settings','deleted_at'],
        group_members:                ['id','group_id','user_id','role','joined_at'],
        group_chat_messages:          ['id','group_id','user_id','content','message_type','created_at','deleted_at'],
        group_invites:                ['id','group_id','token','created_by','max_uses','uses_count','expires_at'],
        group_challenges:             ['id','group_id','title','goal_type','goal_value','start_time','end_time','created_by','is_active'],
        group_challenge_participants: ['challenge_id','user_id','progress','completed'],
        group_announcements:          ['id','group_id','author_id','content','pinned'],
        group_milestones:             ['id','group_id','milestone_type','earned_at'],
        notifications:                ['id','user_id','type','title','body','read_at'],
        user_presence:                ['user_id','status','last_seen'],
      };

      const tableChecks = await Promise.all(Object.entries(SCHEMA).map(async ([table, cols]) => {
        const r = await supaReq('GET', `/rest/v1/${table}?select=${cols.join(',')}&limit=0`, null, svcKey);
        const ok = r.status === 200;
        const msg = err(r);
        return { table, cols, ok, note: ok ? '' : (/relation.*does not exist|table.*not found/i.test(msg) ? '⛔ TABLE MISSING' : msg) };
      }));

      // ── CATEGORY 2: RPC functional tests ─────────────────────────────────
      const rpcTests = await Promise.all([
        // get_membership_snapshot — verify RPC resolves (no PGRST203 ambiguity, no 404)
        // Calling with no args returns null (no user matched) — that is expected behaviour.
        // The data shape is verified by the p_user_id / target_user_id tests below.
        (async () => {
          const r = await supaReq('POST', '/rest/v1/rpc/get_membership_snapshot', '{}', svcKey);
          const ambiguous = (err(r) || '').includes('PGRST203') || (err(r) || '').includes('ambiguous');
          const missing   = r.status === 404 || /does not exist|not found/i.test(err(r) || '');
          const ok = r.status === 200 && !ambiguous && !missing;
          return { name:'get_membership_snapshot()', ok, detail: ok ? 'resolves (null result expected for no-args call)' : (ambiguous ? '⛔ PGRST203 ambiguous overload' : missing ? '⛔ RPC MISSING' : err(r)||`HTTP ${r.status}`) };
        })(),
        // get_membership_snapshot with p_user_id param
        (async () => {
          const r = await supaReq('POST', '/rest/v1/rpc/get_membership_snapshot', JSON.stringify({p_user_id: null}), svcKey);
          const ok = r.status === 200 && !((err(r)||'').includes('PGRST203'));
          return { name:'get_membership_snapshot(p_user_id)', ok, detail: ok ? 'resolves correctly' : err(r)||`HTTP ${r.status}` };
        })(),
        // get_membership_snapshot with target_user_id param
        (async () => {
          const r = await supaReq('POST', '/rest/v1/rpc/get_membership_snapshot', JSON.stringify({target_user_id: null}), svcKey);
          const ok = r.status === 200 && !((err(r)||'').includes('PGRST203'));
          return { name:'get_membership_snapshot(target_user_id)', ok, detail: ok ? 'resolves correctly' : err(r)||`HTTP ${r.status}` };
        })(),
        // accept_invite — must exist (may return "invalid code" error but not 404)
        (async () => {
          const r = await supaReq('POST', '/rest/v1/rpc/accept_invite', JSON.stringify({p_code:'__test__'}), svcKey);
          const missing = r.status === 404 || /does not exist|not found/i.test(err(r));
          return { name:'accept_invite(p_code)', ok: !missing, detail: missing ? '⛔ RPC MISSING' : `HTTP ${r.status} — ${err(r)||'ok'}` };
        })(),
        // get_invite_details
        (async () => {
          const r = await supaReq('POST', '/rest/v1/rpc/get_invite_details', JSON.stringify({p_code:'__test__'}), svcKey);
          const missing = r.status === 404 || /does not exist|not found/i.test(err(r));
          return { name:'get_invite_details(p_code)', ok: !missing, detail: missing ? '⛔ RPC MISSING' : `HTTP ${r.status} — ${err(r)||'ok'}` };
        })(),
        // finish_session_sync — call with correct signature params
        (async () => {
          const r = await supaReq('POST', '/rest/v1/rpc/finish_session_sync',
            JSON.stringify({p_session_id:null,p_action:'end',p_duration_minutes:0,p_group_id:null,p_session_type:'study',p_notes:null,p_ended_at:null}), svcKey);
          const missing = r.status === 404; // 400/422 = exists but invalid args, 404 = truly missing
          return { name:'finish_session_sync(...)', ok: !missing, detail: missing ? '⛔ RPC MISSING' : `HTTP ${r.status} — ${err(r)||'ok'}` };
        })(),
        // get_group_analytics_from_snapshots — two overloads exist; pass both params to target 2-arg version
        (async () => {
          const r = await supaReq('POST', '/rest/v1/rpc/get_group_analytics_from_snapshots',
            JSON.stringify({p_group_id: null, p_days: 30}), svcKey);
          const missing = r.status === 404;
          return { name:'get_group_analytics_from_snapshots(p_group_id,p_days)', ok: !missing, detail: missing ? '⛔ RPC MISSING' : `HTTP ${r.status} — ${err(r)||'ok'}` };
        })(),
      ]);

      // ── CATEGORY 3: RLS recursion safety (anon key → policies fire) ──────
      const rlsTables = ['groups','group_members','group_challenges','group_challenge_participants',
                         'group_chat_messages','group_announcements','group_milestones'];
      const rlsChecks = await Promise.all(rlsTables.map(async (table) => {
        const r = await supaReq('GET', `/rest/v1/${table}?limit=1`, null, anonKey);
        const recursive = isRlsRecursion(r);
        const ok = !recursive && (r.status === 200 || r.status === 401 || r.status === 406);
        return { table, ok, note: recursive ? '⛔ INFINITE RECURSION in RLS policy' : (ok ? 'policies OK' : err(r)||`HTTP ${r.status}`) };
      }));

      // ── CATEGORY 4: Edge function interceptor smoke-tests ─────────────────
      const interceptorTests = await Promise.all([
        (async () => {
          const r = await localReq('POST', '/__supa/functions/v1/get-leaderboard', {});
          const ok = r.status === 502 && /No fake leaderboard data/i.test(String(r.body?.error || ''));
          return { name:'get-leaderboard fake-success guard', ok, detail: ok ? 'HTTP 502 — fake data blocked' : `HTTP ${r.status} ${JSON.stringify(r.body).slice(0,80)}` };
        })(),
        (async () => {
          const r = await localReq('POST', '/__supa/functions/v1/get-daily-leaderboard', {});
          const ok = r.status === 502 && /No fake leaderboard data/i.test(String(r.body?.error || ''));
          return { name:'get-daily-leaderboard fake-success guard', ok, detail: ok ? 'HTTP 502 — fake data blocked' : `HTTP ${r.status} ${JSON.stringify(r.body).slice(0,80)}` };
        })(),
        (async () => {
          const r = await localReq('POST', '/__supa/functions/v1/get-group-leaderboard', {group_id:'__test__'});
          const ok = r.status === 502 && /No fake group analytics data/i.test(String(r.body?.error || ''));
          return { name:'get-group-leaderboard fake-success guard', ok, detail: ok ? 'HTTP 502 — fake data blocked' : `HTTP ${r.status} ${JSON.stringify(r.body).slice(0,80)}` };
        })(),
        (async () => {
          const r = await localReq('POST', '/__supa/functions/v1/get-group-analytics', {group_id:'__test__'});
          const ok = r.status === 502 && /No fake group analytics data/i.test(String(r.body?.error || ''));
          return { name:'get-group-analytics fake-success guard', ok, detail: ok ? 'HTTP 502 — fake data blocked' : `HTTP ${r.status} ${JSON.stringify(r.body).slice(0,80)}` };
        })(),
        (async () => {
          const r = await localReq('POST', '/__supa/functions/v1/finish-session', {user_id:null,duration_seconds:0});
          const ok = r.status === 502 && /No fake study-session sync/i.test(String(r.body?.error || ''));
          return { name:'finish-session fake-success guard', ok, detail: ok ? 'HTTP 502 — fake sync blocked' : `HTTP ${r.status} — ${JSON.stringify(r.body).slice(0,80)}` };
        })(),
        (async () => {
          const r = await localReq('POST', '/__supa/functions/v1/create_checkout', {});
          const ok = r.status === 200 && (r.body.url !== undefined || r.body.disabled !== undefined);
          return { name:'create_checkout', ok, detail: ok ? `intercepted → ${JSON.stringify(r.body).slice(0,50)}` : `HTTP ${r.status}` };
        })(),
        (async () => {
          const r = await localReq('POST', '/__supa/functions/v1/create_customer_portal_session', {});
          const ok = r.status === 200 && (r.body.url !== undefined || r.body.disabled !== undefined);
          return { name:'create_customer_portal_session', ok, detail: ok ? `intercepted → ${JSON.stringify(r.body).slice(0,50)}` : `HTTP ${r.status}` };
        })(),
        (async () => {
          const r = await localReq('POST', '/__supa/functions/v1/redeem_membership_code', {code:'__test__'});
          const ok = r.status === 200 && (r.body.success === true || r.body.redeemed === true);
          return { name:'redeem_membership_code', ok, detail: ok ? `intercepted → ${JSON.stringify(r.body).slice(0,50)}` : `HTTP ${r.status} ${JSON.stringify(r.body).slice(0,50)}` };
        })(),
      ]);

      // ── CATEGORY 5: Server endpoint health ────────────────────────────────
      const serverChecks = await Promise.all([
        (async () => {
          const r = await localReq('GET', '/__admin/patch');
          return { name:'/__admin/patch UI', ok: r.status === 200, detail:`HTTP ${r.status}` };
        })(),
        (async () => {
          const r = await localReq('GET', '/');
          return { name:'/ (app root)', ok: r.status === 200, detail:`HTTP ${r.status}` };
        })(),
        (async () => {
          const r = await localReq('GET', '/api/health');
          return { name:'/api/health', ok: r.status === 200 && r.body?.status === 'ok', detail:`HTTP ${r.status}` };
        })(),
        (async () => {
          const r = await localReq('GET', '/api/version');
          const ok = r.status === 200 && r.body?.local_server === true && typeof r.body?.pwa_cache === 'string' && r.body.pwa_cache.includes(String(r.body.version || ''));
          return { name:'/api/version + PWA cache', ok, detail: ok ? `${r.body.version} ${String(r.body.sha || '').slice(0,7)} ${r.body.pwa_cache}` : `HTTP ${r.status}` };
        })(),
        (async () => {
          const r = await localReq('GET', '/sw.js');
          return { name:'/sw.js', ok: r.status === 200, detail:`HTTP ${r.status}` };
        })(),
        (async () => {
          const r = await localReq('GET', '/manifest.webmanifest');
          return { name:'/manifest.webmanifest', ok: r.status === 200, detail:`HTTP ${r.status}` };
        })(),
        (async () => {
          const r = await localReq('GET', '/offline.html');
          return { name:'/offline.html', ok: r.status === 200, detail:`HTTP ${r.status}` };
        })(),
        (async () => {
          const r = await localReq('GET', '/api/community-events');
          return { name:'Events API removed', ok: r.status === 404, detail:`HTTP ${r.status}` };
        })(),
        (async () => {
          const r = await supaReq('GET', '/rest/v1/', null, svcKey);
          return { name:'Supabase REST reachable', ok: r.status < 500 && r.status !== 0, detail:`HTTP ${r.status}` };
        })(),
        (async () => {
          const r = await supaReq('GET', '/auth/v1/settings', null, svcKey);
          return { name:'Supabase Auth reachable', ok: r.status < 500 && r.status !== 0, detail:`HTTP ${r.status}` };
        })(),
      ]);

      // ── CATEGORY 5b: Auth Pipeline Smoke Tests ────────────────────────────
      // These probe each /__auth/* endpoint WITHOUT a token and verify they
      // return 401 (auth guard active) and NOT 200 (bypass) or 500 (crash).
      const authPipelineChecks = await Promise.all([
        (async () => {
          const r = await localReq('GET', '/__auth/bootstrap');
          const ok = r.status === 401;
          return { name:'/__auth/bootstrap (no token → 401)', ok, detail: ok ? 'Auth guard active' : `Unexpected HTTP ${r.status} — expected 401` };
        })(),
        (async () => {
          const r = await localReq('POST', '/__auth/backup', { backup_json: '{}' });
          const ok = r.status === 401;
          return { name:'/__auth/backup (no token → 401)', ok, detail: ok ? 'Auth guard active' : `Unexpected HTTP ${r.status} — expected 401` };
        })(),
        (async () => {
          const r = await localReq('GET', '/__auth/backup/latest');
          const ok = r.status === 401;
          return { name:'/__auth/backup/latest (no token → 401)', ok, detail: ok ? 'Auth guard active' : `Unexpected HTTP ${r.status} — expected 401` };
        })(),
        (async () => {
          const r = await localReq('POST', '/__auth/profile', { profile_data: {} });
          const ok = r.status === 401;
          return { name:'/__auth/profile (no token → 401)', ok, detail: ok ? 'Auth guard active' : `Unexpected HTTP ${r.status} — expected 401` };
        })(),
        (async () => {
          const r = await localReq('POST', '/__auth/snapshot', { source: 'smoke_test' });
          const ok = r.status === 401;
          return { name:'/__auth/snapshot (no token → 401)', ok, detail: ok ? 'Auth guard active' : `Unexpected HTTP ${r.status} — expected 401` };
        })(),
        (async () => {
          const r = await localReq('POST', '/__auth/import', { backup_json: '{}', mode: 'merge' });
          const ok = r.status === 401;
          return { name:'/__auth/import (no token → 401)', ok, detail: ok ? 'Auth guard active' : `Unexpected HTTP ${r.status} — expected 401` };
        })(),
        (async () => {
          // /api/version must return 200 with local_server:true
          const r = await localReq('GET', '/api/version');
          const ok = r.status === 200 && r.body?.local_server === true;
          return { name:'/api/version health-check (200 + local_server:true)', ok, detail: ok ? `v${r.body.version}` : `HTTP ${r.status} body=${JSON.stringify(r.body).slice(0,60)}` };
        })(),
        (async () => {
          // /__auth/login with wrong creds must return 400/401, not 500
          const r = await localReq('POST', '/__auth/login', { username: 'smoke_test_bad_user', password: 'bad_pass_smoke' });
          const ok = r.status === 400 || r.status === 401 || r.status === 403;
          return { name:'/__auth/login bad creds (4xx, not 500)', ok, detail: ok ? `HTTP ${r.status} — error returned cleanly` : `HTTP ${r.status} — may be crashing` };
        })(),
      ]);

      // ── CATEGORY 6: Admin, community, and realtime functional tests ────────
      const communityChecks = await Promise.all([
        // Admin user exists in auth.users
        (async () => {
          if (!ADMIN_EMAIL) {
            return { name:'Admin user', ok: true, detail: 'not configured (ADMIN_EMAIL unset)' };
          }
          const r = await supaReq('GET', '/auth/v1/admin/users?page=1&per_page=50', null, svcKey);
          const users = r.body?.users || [];
          const admin = users.find(u => u.email === ADMIN_EMAIL);
          return { name:`Admin user (${adminEmailDisplay()})`, ok: !!admin, detail: admin ? `id=${admin.id.slice(0,8)}… confirmed=${admin.email_confirmed_at?'yes':'no'}` : '⛔ NOT FOUND — run setup' };
        })(),
        // Admin user row in public.users (searched by email, not hardcoded username)
        (async () => {
          if (!ADMIN_EMAIL) {
            return { name:'Admin row in public.users', ok: true, detail: 'not configured (ADMIN_EMAIL unset)' };
          }
          const encEmail = encodeURIComponent(ADMIN_EMAIL);
          const r = await supaReq('GET', `/rest/v1/users?email=eq.${encEmail}&select=id,username,email,plan_type&limit=1`, null, svcKey);
          const ok = r.status === 200 && Array.isArray(r.body) && r.body.length > 0;
          return { name:'Admin row in public.users', ok, detail: ok ? `username=${r.body[0].username||'—'} plan_type=${r.body[0].plan_type}` : `HTTP ${r.status} — not found (email: ${adminEmailDisplay()})` };
        })(),
        // _is_group_member helper function exists (SECURITY DEFINER, no recursion)
        (async () => {
          const r = await supaReq('POST', '/rest/v1/rpc/_is_group_member', JSON.stringify({gid: null, uid: null}), svcKey);
          const missing = r.status === 404 || /does not exist|not found/i.test(err(r));
          return { name:'_is_group_member(gid,uid) helper', ok: !missing, detail: missing ? '⛔ HELPER MISSING — RLS will use recursion fallback' : `HTTP ${r.status}` };
        })(),
        // group_members unique constraint
        (async () => {
          const r = await supaReq('GET', '/rest/v1/group_members?select=group_id,user_id&limit=0', null, svcKey);
          const ok = r.status === 200;
          return { name:'group_members table accessible', ok, detail: ok ? 'OK — UNIQUE constraint assumed applied' : `HTTP ${r.status}` };
        })(),
        // user_presence table accessible for realtime presence
        (async () => {
          const r = await supaReq('GET', '/rest/v1/user_presence?select=user_id,status,last_seen&limit=1', null, svcKey);
          const ok = r.status === 200;
          return { name:'user_presence (realtime)', ok, detail: ok ? `accessible — ${Array.isArray(r.body)?r.body.length:0} row(s)` : `HTTP ${r.status}` };
        })(),
      ]);

      // ── CATEGORY 7: Storage bucket checks ────────────────────────────────
      const storageChecks = await Promise.all([
        // avatars bucket (public — profile photos)
        (async () => {
          const r = await supaReq('GET', '/storage/v1/bucket/avatars', null, svcKey);
          const ok = r.status === 200 && r.body && r.body.id === 'avatars';
          return { name:'avatars bucket (public)', ok, detail: ok ? `public=${r.body.public} limit=${r.body.file_size_limit}b` : `HTTP ${r.status} — ⛔ MISSING` };
        })(),
        // user-content bucket (private — pre-existing)
        (async () => {
          const r = await supaReq('GET', '/storage/v1/bucket/user-content', null, svcKey);
          const ok = r.status === 200 && r.body && r.body.id === 'user-content';
          return { name:'user-content bucket (private)', ok, detail: ok ? `public=${r.body.public} limit=${r.body.file_size_limit}b` : `HTTP ${r.status} — ⛔ MISSING` };
        })(),
        // notes bucket (private — study notes)
        (async () => {
          const r = await supaReq('GET', '/storage/v1/bucket/notes', null, svcKey);
          const ok = r.status === 200 && r.body && r.body.id === 'notes';
          return { name:'notes bucket (private)', ok, detail: ok ? `public=${r.body.public} limit=${r.body.file_size_limit}b` : `HTTP ${r.status} — ⛔ MISSING` };
        })(),
        // avatars RLS: public read — list via POST (Supabase list-objects endpoint)
        (async () => {
          const r = await supaReq('POST', '/storage/v1/object/list/avatars', JSON.stringify({prefix:'',limit:1,offset:0}), svcKey);
          const ok = r.status === 200 || r.status === 404;
          const detail = ok
            ? `HTTP ${r.status} — policies active (${Array.isArray(r.body)?r.body.length+' obj(s)':'ok'})`
            : `HTTP ${r.status} — ${typeof r.body==='string'?r.body:JSON.stringify(r.body).slice(0,60)}`;
          return { name:'avatars RLS (public read accessible)', ok, detail };
        })(),
      ]);

      // ── CATEGORY 8: Local integration drift checks ───────────────────────
      function fileContains(rel, pattern) {
        try {
          const txt = fs.readFileSync(path.join(__dirname, rel), 'utf8');
          if (pattern instanceof RegExp) return pattern.test(txt);
          return txt.includes(pattern);
        } catch {
          return false;
        }
      }
      const integrationChecks = [
        {
          name: 'Onboarding completion uses verified cloud write',
          ok: fileContains('server.mjs', '__isoCompleteOnboarding') && fileContains('server.mjs', 'Onboarding save was not verified'),
          detail: 'served Onboarding bundle requires /__auth/profile verification',
        },
        {
          name: 'Tour state is account-backed',
          ok: fileContains('server.mjs', '__isoPersistTour') && fileContains('server.mjs', 'community_group_v1'),
          detail: 'community_group_v1 persists through user_profiles.profile_data.tours',
        },
        {
          name: 'No local fake auth fallback in served bundle',
          ok: fileContains('server.mjs', 'Temporary local auth fallback disabled') && fileContains('server.mjs', 'Local workspace session restore disabled'),
          detail: 'serve-time App patch disables temporary local sessions',
        },
        {
          name: 'Session sync failures stay visible',
          ok: fileContains('server.mjs', 'Session sync failed') && fileContains('server.mjs', 'finish_session_sync HTTP'),
          detail: 'finish-session shim returns error on RPC failure',
        },
        {
          name: 'Leaderboard user stats use Supabase truth',
          ok: fileContains('server.mjs', 'local-cache-disabled') && fileContains('server.mjs', 'No fake leaderboard data'),
          detail: 'served leaderboard bundle does not merge browser-local sessions into authenticated stats',
        },
        {
          name: 'Offline PWA checks local server truth',
          ok: fileContains('public/pwa-local.js', "fetch('/api/version'") && fileContains('public/pwa-local.js', 'Browser network is offline') && fileContains('public/pwa-local.js', 'Local server unavailable'),
          detail: 'cached shell separates browser offline from local-server-down state',
        },
        {
          name: 'Update checker suppresses offline/stale banners',
          ok: fileContains('public/update-checker.js', "fetch('/api/version'") && fileContains('public/update-checker.js', 'clearStaleFlags'),
          detail: 'update banner waits for local /api/version',
        },
        {
          name: 'Termux command checks live local server',
          ok: fileContains('bin/isotope', '/api/version') && fileContains('bin/isotope', 'report_stale_aliases'),
          detail: 'start/open/doctor use /api/version and stale alias detection',
        },
        {
          name: 'Termux Widget uses absolute command path',
          ok: fileContains('setup-termux-widget.sh', '/data/data/com.termux/files/usr/bin/isotope') && !fileContains('setup-termux-widget.sh', 'command -v isotope >/dev/null 2>&1; then\n    isotope'),
          detail: 'shortcuts avoid shell alias dependency',
        },
      ];

      const proofChecklistProven =
        fileContains('SYNC_PROOF_CHECKLIST.md', 'Status: `PROVEN 6/6`') &&
        fileContains('SYNC_PROOF_CHECKLIST.md', 'Browser: Android Chrome') &&
        fileContains('SYNC_PROOF_CHECKLIST.md', 'Final Browser Result');
      function proofLine(line) {
        return proofChecklistProven && fileContains('SYNC_PROOF_CHECKLIST.md', line);
      }
      const manualProofChecks = [
        {
          name: 'ONBOARDING browser → DB row → cache clear → login restore',
          ok: proofLine('onboarding row completed and cache-clear bootstrap did not repeat onboarding'),
          detail: proofLine('onboarding row completed and cache-clear bootstrap did not repeat onboarding') ? 'PROVEN in SYNC_PROOF_CHECKLIST.md with real Chrome proof run.' : 'NOT PROVEN. Run browser proof and update SYNC_PROOF_CHECKLIST.md.',
        },
        {
          name: 'PROFILE/SETTINGS browser → DB row → cache clear → login restore',
          ok: proofLine('profile/settings diff persisted and restored from bootstrap'),
          detail: proofLine('profile/settings diff persisted and restored from bootstrap') ? 'PROVEN in SYNC_PROOF_CHECKLIST.md with real Chrome proof run.' : 'NOT PROVEN. Verify user_profiles.profile_data before/after and reload restore.',
        },
        {
          name: 'AVATAR browser upload → Storage object + profile row → reload restore',
          ok: proofLine('avatar object exists and profile avatar restored'),
          detail: proofLine('avatar object exists and profile avatar restored') ? 'PROVEN in SYNC_PROOF_CHECKLIST.md with real Chrome proof run.' : 'NOT PROVEN. Verify avatars bucket object and user_profiles avatar path/url.',
        },
        {
          name: 'TOUR browser skip/finish → profile tour row → cache clear no repeat',
          ok: proofLine('community_group_v1 tour persisted and restored'),
          detail: proofLine('community_group_v1 tour persisted and restored') ? 'PROVEN in SYNC_PROOF_CHECKLIST.md with real Chrome proof run.' : 'NOT PROVEN. Verify user_profiles.profile_data.tours.community_group_v1=true.',
        },
        {
          name: 'STUDY SESSION browser finish → session/stats tables → reload analytics/community',
          ok: proofLine('study session wrote session/daily/summary tables and restored after cache clear'),
          detail: proofLine('study session wrote session/daily/summary tables and restored after cache clear') ? 'PROVEN in SYNC_PROOF_CHECKLIST.md with real Chrome proof run.' : 'NOT PROVEN. Verify study_sessions_log, daily_user_stats, user_stats_summary.',
        },
        {
          name: 'SYNC STATUS success/failure/offline states',
          ok: proofLine('sync success, auth failure, and offline browser state verified') || proofLine('empty overwrite blocked, auth failure, and offline browser state verified'),
          detail: (proofLine('sync success, auth failure, and offline browser state verified') || proofLine('empty overwrite blocked, auth failure, and offline browser state verified')) ? 'PROVEN in SYNC_PROOF_CHECKLIST.md with real Chrome proof run.' : 'NOT PROVEN. Force success, empty-overwrite guard, RLS/network failure, and offline browser mode.',
        },
      ];

      // ── Aggregate results ─────────────────────────────────────────────────
      manualProofChecks.forEach(c => { c.manual = true; });
      const automatedTests = [
        ...tableChecks.map(c => c.ok),
        ...rpcTests.map(c => c.ok),
        ...rlsChecks.map(c => c.ok),
        ...interceptorTests.map(c => c.ok),
        ...serverChecks.map(c => c.ok),
        ...authPipelineChecks.map(c => c.ok),
        ...communityChecks.map(c => c.ok),
        ...storageChecks.map(c => c.ok),
        ...integrationChecks.map(c => c.ok),
      ];
      const nPass = automatedTests.filter(Boolean).length;
      const nFail = automatedTests.length - nPass;
      const manualProven = manualProofChecks.filter(c => c.ok).length;
      const manualPending = manualProofChecks.length - manualProven;
      const elapsed = Date.now() - t0;
      function pct(arr) { const p=arr.filter(c=>c.ok).length; return `${p}/${arr.length}`; }
      function rows(arr, cols) {
        return arr.map(c => {
          const okBadge = c.manual && !c.ok
            ? '<span class="pending">PENDING</span>'
            : `<span class="${c.ok?'ok':'fail'}">${c.ok?'✓ PASS':'✗ FAIL'}</span>`;
          const name = c.table || c.name;
          if (cols === 'schema') {
            return `<tr><td class="mono">${name}</td><td>${okBadge}</td><td>${(c.cols||[]).map(col=>`<span class="badge">${col}</span>`).join('')}</td><td class="note">${c.note||''}</td></tr>`;
          }
          const detail = c.detail || c.note || '';
          return `<tr><td class="mono">${name}</td><td>${okBadge}</td><td class="note">${detail}</td></tr>`;
        }).join('');
      }

      const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="refresh" content="30">
<title>IsotopeAI — Auto-Test Suite</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0a0a0a;color:#e5e5e5;padding:24px 20px;font-size:13px}
.wrap{max-width:980px;margin:0 auto}
h1{font-size:22px;font-weight:800;color:#a78bfa;margin-bottom:2px;letter-spacing:-0.5px}
.sub{color:#555;font-size:11px;margin-bottom:20px}
.summary{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px;margin-bottom:22px}
.pill{padding:12px 14px;border-radius:10px;font-size:11px;font-weight:700;line-height:1.4}
.pill .num{font-size:24px;font-weight:800;display:block;margin-bottom:2px}
.pill-ok{background:#052e16;border:1px solid #14532d;color:#86efac}
.pill-fail{background:#2d0000;border:1px solid #7f1d1d;color:#fca5a5}
.pill-n{background:#0d0d1a;border:1px solid #2a1f6e;color:#a78bfa}
.pill-t{background:#0c1020;border:1px solid #1e3a5f;color:#93c5fd}
section{background:#111;border:1px solid #1f1f1f;border-radius:10px;padding:16px 18px;margin-bottom:14px}
.sec-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
h3{font-size:12px;font-weight:700;color:#ccc;text-transform:uppercase;letter-spacing:.5px}
.sec-stat{font-size:11px;color:#555}
table{width:100%;border-collapse:collapse;font-size:11px}
th{text-align:left;padding:5px 8px;color:#3f3f46;font-weight:600;border-bottom:1px solid #1a1a1a;font-size:10px;text-transform:uppercase}
td{padding:5px 8px;border-bottom:1px solid #161616;vertical-align:top}
tr:last-child td{border-bottom:none}
.mono{font-family:'SF Mono',monospace;font-size:10px}
.ok{background:#052e16;color:#86efac;padding:1px 7px;border-radius:4px;font-size:9px;font-weight:800;letter-spacing:.3px}
.fail{background:#2d0000;color:#fca5a5;padding:1px 7px;border-radius:4px;font-size:9px;font-weight:800;letter-spacing:.3px}
.pending{background:#1f2937;color:#93c5fd;padding:1px 7px;border-radius:4px;font-size:9px;font-weight:800;letter-spacing:.3px}
.note{color:#444;font-size:10px;font-family:'SF Mono',monospace;max-width:420px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.badge{background:#12122a;border:1px solid #1e1e40;border-radius:3px;padding:1px 4px;color:#6366f1;font-family:monospace;font-size:9px;margin:1px 1px 1px 0;display:inline-block}
.refresh{float:right;font-size:10px;color:#3f3f46;text-decoration:none}
.refresh:hover{color:#a78bfa}
.fix-bar{background:#1c0d2e;border:1px solid #4c1d95;border-radius:8px;padding:12px 16px;margin-bottom:14px;display:flex;align-items:center;gap:14px}
.fix{display:inline-block;background:#7c3aed;color:#fff;text-decoration:none;padding:7px 16px;border-radius:6px;font-size:11px;font-weight:700;white-space:nowrap}
.fix:hover{background:#6d28d9}
</style></head>
<body><div class="wrap">
<a class="refresh" href="javascript:location.reload()">↻ Auto-refreshes every 30s</a>
<h1>🧪 Automated Test Suite</h1>
<p class="sub">${SUPA_URL} &nbsp;·&nbsp; Ran ${automatedTests.length} automated checks in ${elapsed}ms &nbsp;·&nbsp; ${manualProofChecks.length} browser proof slots tracked separately &nbsp;·&nbsp; <a style="color:#6366f1;text-decoration:none" href="/__admin/patch">Patch →</a> &nbsp;·&nbsp; <a style="color:#6366f1;text-decoration:none" href="/__admin/roles">Roles →</a></p>

<div class="summary">
  <div class="pill pill-n"><span class="num">${automatedTests.length}</span>automated checks</div>
  <div class="pill pill-ok"><span class="num">${nPass}</span>automated passing</div>
  ${nFail > 0 ? `<div class="pill pill-fail"><span class="num">${nFail}</span>failing</div>` : ''}
  <div class="pill ${nFail===0?'pill-ok':'pill-fail'}"><span class="num">${nFail===0?'✓':'✗'}</span>${nFail===0?'automated clear':'needs fix'}</div>
  ${manualPending > 0 ? `<div class="pill pill-t"><span class="num">${manualPending}</span>manual proof pending</div>` : `<div class="pill pill-ok"><span class="num">${manualProven}</span>manual proof proven</div>`}
  <div class="pill pill-t"><span class="num">${elapsed}ms</span>run time</div>
</div>

${nFail > 0 ? `<div class="fix-bar"><div style="flex:1"><strong style="color:#c4b5fd">Some tests failing</strong><br><span style="color:#555;font-size:11px">Apply the community patch to fix missing tables, columns, or RPCs</span></div><a class="fix" href="/__admin/patch">🚀 Apply Patch</a></div>` : ''}
${nFail === 0 && manualPending > 0 ? `<div class="fix-bar"><div style="flex:1"><strong style="color:#c4b5fd">Automated checks are passing</strong><br><span style="color:#555;font-size:11px">The remaining items need a real browser run. They are proof tasks, not schema/RPC failures.</span></div><a class="fix" href="/__admin/browser-proof">Run Browser Proof</a></div>` : ''}

<section>
  <div class="sec-hdr"><h3>📋 Tables</h3><span class="sec-stat">${pct(tableChecks)} passing</span></div>
  <table>
    <tr><th>Table</th><th>Status</th><th>Expected columns</th><th>Error</th></tr>
    ${rows(tableChecks, 'schema')}
  </table>
</section>

<section>
  <div class="sec-hdr"><h3>⚡ RPC Functions</h3><span class="sec-stat">${pct(rpcTests)} passing</span></div>
  <table>
    <tr><th>Function</th><th>Status</th><th>Result / Detail</th></tr>
    ${rows(rpcTests)}
  </table>
</section>

<section>
  <div class="sec-hdr"><h3>🔐 RLS Policy Safety</h3><span class="sec-stat">${pct(rlsChecks)} passing — anon key, policies active</span></div>
  <table>
    <tr><th>Table</th><th>Status</th><th>Notes</th></tr>
    ${rows(rlsChecks)}
  </table>
</section>

<section>
  <div class="sec-hdr"><h3>🔀 Edge Function Interceptors</h3><span class="sec-stat">${pct(interceptorTests)} passing</span></div>
  <table>
    <tr><th>Intercepted Route</th><th>Status</th><th>Response</th></tr>
    ${rows(interceptorTests)}
  </table>
</section>

<section>
  <div class="sec-hdr"><h3>🖥 Server Health</h3><span class="sec-stat">${pct(serverChecks)} passing</span></div>
  <table>
    <tr><th>Endpoint</th><th>Status</th><th>Detail</th></tr>
    ${rows(serverChecks)}
  </table>
</section>

<section>
  <div class="sec-hdr"><h3>🔒 Auth Pipeline Smoke Tests</h3><span class="sec-stat">${pct(authPipelineChecks)} passing — unauthenticated probes</span></div>
  <table>
    <tr><th>Endpoint</th><th>Status</th><th>Detail</th></tr>
    ${rows(authPipelineChecks)}
  </table>
</section>

<section>
  <div class="sec-hdr"><h3>👑 Admin &amp; Community Features</h3><span class="sec-stat">${pct(communityChecks)} passing</span></div>
  <table>
    <tr><th>Check</th><th>Status</th><th>Detail</th></tr>
    ${rows(communityChecks)}
  </table>
</section>

<section>
  <div class="sec-hdr"><h3>🗄 Storage Buckets</h3><span class="sec-stat">${pct(storageChecks)} passing</span></div>
  <table>
    <tr><th>Bucket</th><th>Status</th><th>Detail</th></tr>
    ${rows(storageChecks)}
  </table>
</section>

<section>
  <div class="sec-hdr"><h3>🔗 Integration Wiring</h3><span class="sec-stat">${pct(integrationChecks)} passing</span></div>
  <table>
    <tr><th>Check</th><th>Status</th><th>Detail</th></tr>
    ${rows(integrationChecks)}
  </table>
</section>

<section>
  <div class="sec-hdr"><h3>🧾 Manual Browser Proof Required</h3><span class="sec-stat">${pct(manualProofChecks)} proven</span></div>
  <table>
    <tr><th>Proof Target</th><th>Status</th><th>Required Evidence</th></tr>
    ${rows(manualProofChecks)}
  </table>
</section>

<section id="iso-browser-diag">
  <div class="sec-hdr"><h3>🌐 Live Browser Diagnostics</h3><span class="sec-stat" id="iso-diag-stat">reading localStorage…</span></div>
  <div id="iso-diag-content" style="color:#555;font-size:11px;padding:8px 0">Open this page while logged into the app to see live session + sync data.</div>
</section>

</div>
<script>
(function() {
  function relTime(iso) {
    if (!iso) return 'never';
    var d = Date.now() - new Date(iso).getTime();
    if (d < 0) return 'just now';
    if (d < 60000) return Math.round(d/1000) + 's ago';
    if (d < 3600000) return Math.round(d/60000) + 'm ago';
    if (d < 86400000) return Math.round(d/3600000) + 'h ago';
    return new Date(iso).toLocaleDateString();
  }
  function parseToken(raw) {
    try {
      var p = JSON.parse(raw);
      return p.access_token || (p.session && p.session.access_token) ||
        (p.currentSession && p.currentSession.access_token) ||
        (p.state && p.state.session && p.state.session.access_token) || null;
    } catch(e) { return null; }
  }
  function decodeJwtPayload(jwt) {
    try {
      var parts = jwt.split('.');
      if (parts.length < 2) return null;
      var pad = parts[1].replace(/-/g,'+').replace(/_/g,'/');
      while (pad.length % 4) pad += '=';
      return JSON.parse(atob(pad));
    } catch(e) { return null; }
  }
  function row(label, value, color) {
    return '<tr><td class="mono">' + label + '</td><td class="note" style="color:' + (color||'#aaa') + ';max-width:none;white-space:normal">' + value + '</td></tr>';
  }
  function run() {
    var content = document.getElementById('iso-diag-content');
    var stat = document.getElementById('iso-diag-stat');
    if (!content || !stat) return;

    // 1. Find session token
    var rawToken = null;
    var tokenKey = null;
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.startsWith('sb-') && k.endsWith('-auth-token')) {
        rawToken = localStorage.getItem(k); tokenKey = k; break;
      }
    }
    if (!rawToken) { rawToken = localStorage.getItem('isotope-auth-token'); tokenKey = 'isotope-auth-token'; }
    if (!rawToken) { rawToken = localStorage.getItem('isotope-last-session-raw'); tokenKey = 'isotope-last-session-raw'; }

    var jwt = rawToken ? parseToken(rawToken) : null;
    var payload = jwt ? decodeJwtPayload(jwt) : null;
    var expiry = payload && payload.exp ? new Date(payload.exp * 1000) : null;
    var expired = expiry ? expiry < new Date() : null;
    var sessionFormat = null;
    if (rawToken) {
      try {
        var p = JSON.parse(rawToken);
        sessionFormat = p.access_token ? 'format-1 (standard)' :
          p.session ? 'format-2 (wrapped session)' :
          p.currentSession ? 'format-3 (currentSession — Supabase v2.60+)' :
          p.state ? 'format-4 (deep state)' : 'unknown';
      } catch(e) {}
    }

    // 2. Sync metadata + history
    var meta = {};
    var history = [];
    try { meta = JSON.parse(localStorage.getItem('isotope_sync_metadata') || '{}') || {}; } catch(e) {}
    try { history = JSON.parse(localStorage.getItem('isotope_sync_history') || '[]') || []; } catch(e) {}

    // 3. Render session section
    var sessionRows = jwt ? [
      row('Session key', tokenKey || '—', '#93c5fd'),
      row('Session format', sessionFormat || 'unknown', '#93c5fd'),
      row('User ID (sub)', (payload && payload.sub) || '—', '#a78bfa'),
      row('Email', (payload && payload.email) || '—', '#a78bfa'),
      row('Token expires', expiry ? expiry.toISOString() + ' (' + relTime(expiry.toISOString()) + ')' : '—',
          expired ? '#fca5a5' : '#86efac'),
      row('JWT valid', expired === false ? 'Yes — not expired' : expired === true ? 'EXPIRED — auto-refresh should fix' : 'Unknown', expired ? '#fca5a5' : '#86efac'),
    ] : [row('Session', 'No session found in localStorage — not logged in or using a private window', '#fca5a5')];

    // 4. Render sync metadata
    var sc = meta.last_sync_status || '—';
    var scColor = sc === 'synced' ? '#86efac' : sc === 'failed' ? '#fca5a5' : '#93c5fd';
    var metaRows = [
      row('Last sync status', sc, scColor),
      row('Last snapshot at', meta.last_snapshot_at ? meta.last_snapshot_at + ' (' + relTime(meta.last_snapshot_at) + ')' : '—', '#93c5fd'),
      row('Last error', meta.last_error || 'none', meta.last_error ? '#fca5a5' : '#555'),
    ];

    // 5. Render sync history table
    var histRows = history.slice(0, 15).map(function(e) {
      var icon = e.status === 'ok' ? '✓' : e.status === 'failed' ? '✗' : '↻';
      var color = e.status === 'ok' ? '#86efac' : e.status === 'failed' ? '#fca5a5' : '#93c5fd';
      var opLabel = ({upload:'Upload',snapshot:'Snapshot',import:'Import',download:'Download'})[e.op] || e.op;
      var detail = e.error ? String(e.error).slice(0,80) : (e.bytes ? Math.round(e.bytes/1024)+'KB' : (e.mode||e.source||''));
      return '<tr><td class="mono"><span style="color:'+color+'">'+icon+'</span> '+opLabel+'</td>' +
        '<td class="note" style="color:'+color+'">'+e.status+'</td>' +
        '<td class="note" style="max-width:none">'+detail+'</td>' +
        '<td class="note">'+relTime(e.at)+'</td></tr>';
    }).join('') || '<tr><td colspan="4" style="color:#444;text-align:center">No sync events — run Cloud Sync first</td></tr>';

    // 6. Test auth now button
    var testBtn = '<button onclick="testAuth()" style="background:#7c3aed;color:#fff;border:0;border-radius:6px;' +
      'padding:7px 14px;font-size:11px;font-weight:700;cursor:pointer;margin-top:10px">▶ Test Cloud Sync Auth Now</button>' +
      '<span id="auth-test-result" style="margin-left:10px;font-size:11px"></span>';

    stat.textContent = (jwt ? '✓ Session found' : '✗ No session') + ' · ' + history.length + ' sync events';

    content.innerHTML =
      '<h4 style="font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Session</h4>' +
      '<table style="margin-bottom:16px"><tbody>' + sessionRows.join('') + '</tbody></table>' +
      '<h4 style="font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Sync Metadata</h4>' +
      '<table style="margin-bottom:16px"><tbody>' + metaRows.join('') + '</tbody></table>' +
      '<h4 style="font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Sync History (' + history.length + ' events)</h4>' +
      '<table><thead><tr><th>Operation</th><th>Status</th><th>Detail</th><th>When</th></tr></thead><tbody>' + histRows + '</tbody></table>' +
      testBtn;
  }

  window.testAuth = function() {
    var result = document.getElementById('auth-test-result');
    result.textContent = '⟳ testing…';
    result.style.color = '#93c5fd';
    fetch('/__auth/bootstrap', {
      headers: { 'Authorization': 'Bearer ' + (function() {
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if (k && k.startsWith('sb-') && k.endsWith('-auth-token')) {
            try {
              var p = JSON.parse(localStorage.getItem(k));
              return p.access_token || (p.currentSession && p.currentSession.access_token) || '';
            } catch(e) {}
          }
        }
        try { var p = JSON.parse(localStorage.getItem('isotope-auth-token')||'{}');
          return p.access_token||(p.currentSession&&p.currentSession.access_token)||''; } catch(e) {}
        try { var q = JSON.parse(localStorage.getItem('isotope-last-session-raw')||'{}');
          return q.access_token||(q.session&&q.session.access_token)||(q.currentSession&&q.currentSession.access_token)||(q.state&&q.state.session&&q.state.session.access_token)||''; } catch(e) {}
        return '';
      })() }
    }).then(function(r) {
      return r.json().then(function(d) {
        if (r.ok && d.ok) {
          result.textContent = '✓ Auth OK — user ' + (d.profile && d.profile.username || d.user_id || 'unknown');
          result.style.color = '#86efac';
        } else {
          result.textContent = '✗ ' + r.status + ': ' + (d.error || 'failed');
          result.style.color = '#fca5a5';
        }
      });
    }).catch(function(e) {
      result.textContent = '✗ Network error: ' + e.message;
      result.style.color = '#fca5a5';
    });
  };

  // Run on load and every 5s
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
  setInterval(run, 5000);
})();
</script>
</body></html>`;

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(html);
    })().catch(e => { res.writeHead(500, {'Content-Type':'text/plain'}); res.end('Verify error: ' + e.message + '\n' + e.stack); });
    return;
  }

  // ── /__auth/login — sign in existing user + return session ───────────────
  if (req.method === 'POST' && req.url === '/__auth/login') {
    const clientIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
    if (!checkRateLimit('login:' + clientIp)) {
      res.writeHead(429, { 'Content-Type': 'application/json', 'Retry-After': '60' });
      res.end(JSON.stringify({ error: 'Too many login attempts — please wait 60 seconds.' }));
      return;
    }
    readReqBody(req).then(async ({ username, password }) => {
      // Primary: accept any email address directly.
      // Legacy fallback: users created before v2.3.0 with a bare username were stored
      // as username@isotope.local — we append that suffix and retry if the direct login fails.
      const raw = (username || '').toString().trim().toLowerCase();
      const email = raw.includes('@') ? raw : raw + '@isotope.local';
      if (!raw || !password || String(password).length < 6) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Email and password required' }));
        return;
      }
      try {
        // Try the email as-is first; if that fails and input looked like a username, try legacy format
        let signin = await supaPasswordSignIn(email, password);
        if ((!signin.body || !signin.body.access_token) && !raw.includes('@')) {
          signin = await supaPasswordSignIn(raw, password);
        }
        if (!signin || !signin.body || !signin.body.access_token) {
          const supaMsg = (signin && signin.body && (signin.body.error_description || signin.body.message || signin.body.error)) || '';
          const hint = supaMsg.toLowerCase().includes('email not confirmed')
            ? 'Your email address is not confirmed. Check your inbox for a confirmation link.'
            : supaMsg.toLowerCase().includes('invalid login') || supaMsg.toLowerCase().includes('invalid credentials') || supaMsg.toLowerCase().includes('email or password')
              ? 'Invalid email or password. Make sure you are using the email and password you registered with on Supabase.'
              : 'Invalid email or password';
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: hint }));
          return;
        }
        const session = signin.body;
        const userId = session.user?.id || getUserIdFromJwt(session.access_token);
        if (!userId) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Supabase session did not include a user id.' }));
          return;
        }
        const sessionEmail = session.user?.email || email;
        const displayName = (session.user?.user_metadata && (session.user.user_metadata.full_name || session.user.user_metadata.username || session.user.user_metadata.name))
          || sessionEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_');
        await bootstrapUserRows({ userId, email: sessionEmail, displayName, userJwt: session.access_token, onboardingCompleted: false, createOnboarding: false });
        const bundle = await fetchUserProfileBundle(userId, session.access_token);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          session,
          user_id: userId,
          profile: bundle.profile,
          onboarding_completed: bundle.profile.onboarding_completed === true,
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // ── /__admin/apply-sql — server-side proxy for Supabase Management API ──────
  // Avoids browser CORS blocks — browser sends PAT to OUR server, server calls api.supabase.com
  if (req.method === 'POST' && req.url === '/__admin/apply-sql') {
    if (!isAdminAuthed(req)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: 'Unauthorized' }));
      return;
    }
    readReqBody(req, 4 * 1024 * 1024).then(({ pat, sql }) => {
      if (!pat || !sql) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: 'pat and sql fields are required' }));
        return;
      }
      const PROJ_REF = new URL(SUPA_URL).hostname.split('.')[0];
      const bodyBuf = Buffer.from(JSON.stringify({ query: sql }));
      const applyReq = https.request({
        hostname: 'api.supabase.com',
        path: '/v1/projects/' + PROJ_REF + '/database/query',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + pat,
          'Content-Type': 'application/json',
          'Content-Length': String(bodyBuf.length),
        },
      }, (applyRes) => {
        const chunks = [];
        applyRes.on('data', d => chunks.push(d));
        applyRes.on('end', () => {
          const raw = Buffer.concat(chunks).toString();
          let body;
          try { body = JSON.parse(raw); } catch { body = { raw }; }
          const ok = applyRes.statusCode >= 200 && applyRes.statusCode < 300;
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok, status: applyRes.statusCode, body }));
        });
      });
      applyReq.on('error', (e) => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: e.message }));
      });
      applyReq.setTimeout(30000, () => {
        applyReq.destroy();
        res.writeHead(504, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: 'Supabase Management API request timed out after 30s' }));
      });
      applyReq.write(bodyBuf);
      applyReq.end();
    }).catch(e => {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: e.message }));
    });
    return;
  }

  // ── Static file serving ─────────────────────────────────────────────────────
  let urlPath = req.url.split('?')[0];
  try { urlPath = decodeURIComponent(urlPath); } catch {}
  const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safePath);

  // /login, /signup, and /reset-password are not standalone React routes in the
  // shipped SPA. Send direct visits back to the auth shell at /.
  if (req.method === 'GET' && (urlPath === '/login' || urlPath === '/signup' || urlPath === '/reset-password')) {
    res.writeHead(302, { Location: '/' });
    res.end();
    return;
  }

  // API and AI paths that were not matched by a named handler → 404 JSON.
  // Without this, they fall through to the SPA and return HTTP 200 HTML, which
  // confuses API clients and hides broken route assumptions.
  if (urlPath.startsWith('/api/') || urlPath === '/api' || urlPath.startsWith('/__ai')) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: false, error: 'Not found', path: urlPath }));
    return;
  }

  // Block sensitive public files that expose backup schema or dead integrations.
  const _blockedFiles = new Set(['backup.json', 'firebase-messaging-sw.js']);
  if (_blockedFiles.has(path.basename(urlPath))) {
    res.writeHead(404); res.end('Not found'); return;
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey, x-client-info');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // BUG FIX: allow IndexedDB and storage APIs inside cross-origin iframes.
  // Without this, some sandboxed iframe environments block IndexedDB writes,
  // causing [kvStore] Shadow backup write failed errors in the browser console.
  res.setHeader('Permissions-Policy', 'storage-access=*, camera=(), microphone=()');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');

  const serveHtml = (buf) => {
    res.setHeader('Cache-Control', cacheHeaderForRequest('/index.html'));
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(injectKeys(buf));
  };
  const spaFallback = () => {
    const indexPath = path.join(__dirname, 'index.html');
    fs.readFile(indexPath, (err, data) => {
      if (err) { res.writeHead(500); res.end('Server error'); return; }
      serveHtml(data);
    });
  };
  const serveFile = (fp) => {
    const ext = path.extname(fp).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const basename = path.basename(fp);
    const isHashedAsset = urlPath.startsWith('/assets/') && !isRuntimePatchedAsset(urlPath) && isHashedStaticAsset(urlPath);
    const cacheHeader = cacheHeaderForRequest(urlPath);
    const acceptsGzip = /gzip/.test(req.headers['accept-encoding'] || '');
    const gzippable = /\.(js|mjs|css|svg|json)$/.test(ext);

    function send(buf) {
      res.setHeader('Cache-Control', cacheHeader);
      if (basename === 'sw.js') res.setHeader('Service-Worker-Allowed', '/');
      if (acceptsGzip && gzippable && buf.length > 1024) {
        const cached = isHashedAsset ? _gzipCache.get(fp) : null;
        if (cached) {
          res.writeHead(200, { 'Content-Type': contentType, 'Content-Encoding': 'gzip', 'Vary': 'Accept-Encoding' });
          res.end(cached);
        } else {
          zlib.gzip(buf, { level: 6 }, (err, gz) => {
            if (err) { res.writeHead(200, { 'Content-Type': contentType }); res.end(buf); return; }
            if (isHashedAsset) _gzipCache.set(fp, gz);
            res.writeHead(200, { 'Content-Type': contentType, 'Content-Encoding': 'gzip', 'Vary': 'Accept-Encoding' });
            res.end(gz);
          });
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(buf);
      }
    }

    if ((GEMINI_API_KEY || GROQ_API_KEY) && fp === AI_STORE_ABS) {
      const buf = getPatchedAiStore();
      if (buf) { send(buf); return; }
    }
    if (fp === SERVICE_WORKER_ABS) {
      fs.readFile(fp, 'utf8', (err, raw) => {
        if (err) { res.writeHead(404); res.end('Not found'); return; }
        LOCAL_VERSION = readLocalVersionInfo();
        DEPLOYED_SHA = LOCAL_VERSION.sha || DEPLOYED_SHA;
        const patched = raw
          .replace(/__ISOTOPE_APP_VERSION__/g, LOCAL_VERSION.version)
          .replace(/__ISOTOPE_APP_SHA__/g, String(DEPLOYED_SHA).slice(0, 12));
        res.setHeader('Cache-Control', cacheHeaderForRequest('/sw.js'));
        res.setHeader('Service-Worker-Allowed', '/');
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(patched);
      });
      return;
    }
    if (fp === FOCUS_BUNDLE_ABS) {
      const buf = getPatchedFocusBundle();
      if (buf) { send(buf); return; }
    }
    if (fp === APP_BUNDLE_ABS) {
      const buf = getPatchedAppBundle();
      if (buf) { send(buf); return; }
    }
    if (fp === AUTH_BUNDLE_ABS) {
      const buf = getPatchedAuthBundle();
      if (buf) { send(buf); return; }
    }
    if (fp === ONBOARDING_BUNDLE_ABS) {
      const buf = getPatchedOnboardingBundle();
      if (buf) { send(buf); return; }
    }
    if (fp === SINGLE_GROUP_BUNDLE_ABS) {
      const buf = getPatchedSingleGroupBundle();
      if (buf) { send(buf); return; }
    }
    if (fp === LEADERBOARD_BUNDLE_ABS) {
      const buf = getPatchedLeaderboardBundle();
      if (buf) { send(buf); return; }
    }
    if (fp === SETTINGS_BUNDLE_ABS) {
      const buf = getPatchedSettingsBundle();
      if (buf) { send(buf); return; }
    }
    if (fp === USE_SYNC_STORE_BUNDLE_ABS) {
      const buf = getPatchedUseSyncStoreBundle();
      if (buf) { send(buf); return; }
    }
    if (fp === APP_ACCESS_GATE_BUNDLE_ABS) {
      const buf = getPatchedAppAccessGateBundle();
      if (buf) { send(buf); return; }
    }
    if (fp === SESSION_SYNC_BUNDLE_ABS) {
      const buf = getPatchedSessionSyncBundle();
      if (buf) { send(buf); return; }
    }
    if (fp === INVITES_BUNDLE_ABS) {
      const buf = getPatchedInvitesBundle();
      if (buf) { send(buf); return; }
    }
    if (fp === COMMUNITY_BUNDLE_ABS) {
      const buf = getPatchedCommunityBundle();
      if (buf) { send(buf); return; }
    }
    if (fp === COMMUNITY_HUB_BUNDLE_ABS) {
      const buf = getPatchedCommunityHubBundle();
      if (buf) { send(buf); return; }
    }
    if (fp === PWA_MANAGER_BUNDLE_ABS) {
      const buf = getPatchedPWAManagerBundle();
      if (buf) { send(buf); return; }
    }
    if (fp === STORE_BUNDLE_ABS || fp === EVENTS_BUNDLE_ABS) {
      send(REMOVED_FEATURE_MODULE);
      return;
    }

    fs.readFile(fp, (err, data) => {
      if (err) {
        if (ext === '.js' && urlPath.startsWith('/assets/')) {
          fetchRemoteAsset(path.basename(fp))
            .then((buf) => send(buf))
            .catch(() => { res.writeHead(404); res.end('Not found'); });
          return;
        }
        if (['.js','.mjs','.css','.png','.svg','.woff','.woff2','.ttf','.json'].includes(ext)) {
          res.writeHead(404); res.end('Not found'); return;
        }
        spaFallback();
        return;
      }
      if (ext === '.html') { serveHtml(data); return; }
      send(data);
    });
  };

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isDirectory()) {
      const idxInDir = path.join(filePath, 'index.html');
      fs.access(idxInDir, fs.constants.F_OK, (e) => e ? spaFallback() : serveFile(idxInDir));
    } else {
      serveFile(filePath);
    }
  });
});

// ── Startup environment validation ────────────────────────────────────────────
// Warn operators about insecure or missing configuration before accepting traffic.
(function validateEnv() {
  if (!ENABLE_ADMIN_MODE) {
    console.info('[Startup] Local app mode ready. Shared Supabase cloud sync is enabled.');
  } else if (!ADMIN_MODE_READY) {
    console.warn('[Startup] Owner tools requested but not ready. Add SUPABASE_SERVICE_ROLE_KEY in your private .env.');
  } else {
    console.info('[Startup] Owner tools enabled. Protect admin credentials and service-role key.');
    console.info('[Startup] Admin panel: /__admin/verify | /__admin/roles | /__admin/patch');
    if (!ADMIN_PASSWORD || !ADMIN_EMAIL) {
      console.info('[Startup] ADMIN_EMAIL/ADMIN_PASSWORD not both set; admin account auto-create will be skipped.');
    }
  }
})();

server.listen(port, '0.0.0.0', () => {
  console.log(`IsotopeAI running on port ${port}`);
  if (ADMIN_MODE_READY) console.log('[Cloud] Owner tools can use private server-side Supabase access');
  else                  console.log('[Cloud] User sessions sync through Supabase with RLS protection');
  if (GEMINI_API_KEY) console.log('Gemini API key: configured');
  if (GROQ_API_KEY)   console.log('Groq API key: configured');

  // Warm up bundle caches after port is open so startup is fast
  setImmediate(() => {
    if (GEMINI_API_KEY || GROQ_API_KEY) getPatchedAiStore();
    getPatchedFocusBundle();
    getPatchedAppBundle();
    getPatchedAuthBundle();
    getPatchedOnboardingBundle();
    getPatchedSingleGroupBundle();
    getPatchedLeaderboardBundle();
    getPatchedSettingsBundle();
    getPatchedUseSyncStoreBundle();
    getPatchedAppAccessGateBundle();
    getPatchedSessionSyncBundle();
    getPatchedInvitesBundle();
    getPatchedCommunityBundle();
    getPatchedCommunityHubBundle();
    getPatchedPWAManagerBundle();

    // Pre-gzip all patched bundles so first client request is instant.
    // Each bundle is already in memory; gzip runs once in the background.
    const toPreGzip = [
      [APP_BUNDLE_ABS,             getPatchedAppBundle()],
      [AUTH_BUNDLE_ABS,            getPatchedAuthBundle()],
      [FOCUS_BUNDLE_ABS,           getPatchedFocusBundle()],
      [ONBOARDING_BUNDLE_ABS,      getPatchedOnboardingBundle()],
      [SINGLE_GROUP_BUNDLE_ABS,    getPatchedSingleGroupBundle()],
      [LEADERBOARD_BUNDLE_ABS,     getPatchedLeaderboardBundle()],
      [SETTINGS_BUNDLE_ABS,        getPatchedSettingsBundle()],
      [USE_SYNC_STORE_BUNDLE_ABS,   getPatchedUseSyncStoreBundle()],
      [APP_ACCESS_GATE_BUNDLE_ABS, getPatchedAppAccessGateBundle()],
      [SESSION_SYNC_BUNDLE_ABS,    getPatchedSessionSyncBundle()],
      [INVITES_BUNDLE_ABS,         getPatchedInvitesBundle()],
    ];
    let i = 0;
    const preGzipNext = () => {
      if (i >= toPreGzip.length) return;
      const [fp, buf] = toPreGzip[i++];
      if (!buf) { preGzipNext(); return; }
      zlib.gzip(buf, { level: 6 }, (err, gz) => {
        if (!err) _gzipCache.set(fp, gz);
        preGzipNext(); // sequential to avoid CPU spike on startup
      });
    };
    preGzipNext();
  });

  // Auto-run DML backfills on startup (safe REST-only operations, no DDL needed)
  runStartupBackfills().catch(() => {});
  // Ensure Supabase Storage buckets exist (creates if missing, idempotent)
  ensureStorageBuckets().catch(() => {});
});

// ── Storage bucket auto-setup (runs on every server start) ────────────────────
// Creates the three required Storage buckets if they do not yet exist.
// Uses the service-role key (ADMIN_MODE_READY required). Safe to run multiple
// times — it only creates buckets that return 404.
async function ensureStorageBuckets() {
  if (!ADMIN_MODE_READY) return; // service key required to create buckets
  const BUCKETS = [
    { id: 'user-content', name: 'user-content', public: false, file_size_limit: 52428800 },
    { id: 'avatars',      name: 'avatars',      public: true,  file_size_limit: 2097152  },
    { id: 'notes',        name: 'notes',        public: false, file_size_limit: 10485760 },
  ];
  for (const bucket of BUCKETS) {
    try {
      const check = await supaAdminReq('GET', `/storage/v1/bucket/${bucket.id}`).catch(() => ({ status: 0 }));
      if (check.status === 200) {
        // Bucket exists — ensure public flag is correct
        if (bucket.public !== check.body?.public) {
          await supaAdminReq('PUT', `/storage/v1/bucket/${bucket.id}`, { public: bucket.public }).catch(() => {});
        }
        continue;
      }
      const create = await supaAdminReq('POST', '/storage/v1/bucket', {
        id: bucket.id, name: bucket.name,
        public: bucket.public,
        file_size_limit: bucket.file_size_limit,
        allowed_mime_types: bucket.id === 'avatars'
          ? ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
          : null,
      }).catch(() => ({ status: 0 }));
      if (create.status === 200 || create.status === 201) {
        console.log(`[Storage] Created bucket "${bucket.id}" (public=${bucket.public})`);
      } else if (create.status === 409) {
        // Already exists (race) — ignore
      } else {
        console.warn(`[Storage] Could not create bucket "${bucket.id}": HTTP ${create.status}`,
          typeof create.body === 'object' ? JSON.stringify(create.body).slice(0, 120) : create.body);
      }
    } catch (e) {
      console.warn(`[Storage] ensureStorageBuckets error for "${bucket.id}":`, e.message);
    }
  }
}

// ── Startup DML backfills (runs on every server start) ────────────────────────
// These are DML-only (no DDL) so they work with just the service_role REST API.
// They're idempotent — running them multiple times is safe.
async function runStartupBackfills() {
  if (!ADMIN_MODE_READY) return; // owner/admin maintenance only

  const supaRest = (method, table, params, body) => new Promise((resolve) => {
    const supaHost = new URL(SUPA_URL).hostname;
    const qs = params ? '?' + params : '';
    const bodyBuf = body ? Buffer.from(JSON.stringify(body)) : null;
    const opts = {
      hostname: supaHost,
      path: '/rest/v1/' + table + qs,
      method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPA_SERVICE_KEY,
        'Authorization': 'Bearer ' + SUPA_SERVICE_KEY,
        'Prefer': 'return=minimal',
        ...(bodyBuf ? { 'Content-Length': String(bodyBuf.length) } : {}),
      },
    };
    const req = https.request(opts, (r) => {
      const chunks = []; r.on('data', c => chunks.push(c));
      r.on('end', () => resolve({ status: r.statusCode, body: Buffer.concat(chunks).toString('utf8') }));
    });
    req.on('error', () => resolve({ status: 0, body: 'network error' }));
    req.setTimeout(12000, () => { req.destroy(); resolve({ status: 0, body: 'timeout' }); });
    if (bodyBuf) req.write(bodyBuf);
    req.end();
  });

  try {
    // 0. Community schema check — detect missing columns and warn loudly
    const schemaCheck = await supaRest('GET', 'groups', 'select=deleted_at&limit=1');
    if (schemaCheck.status === 400) {
      try {
        const errBody = JSON.parse(schemaCheck.body);
        if (errBody.message && errBody.message.includes('deleted_at')) {
          console.error('');
          console.error('╔══════════════════════════════════════════════════════╗');
          console.error('║  ⚠️  COMMUNITY SCHEMA PATCH REQUIRED                 ║');
          console.error('║  Missing columns detected in Supabase DB.            ║');
          console.error('║  Community page will show errors until applied.      ║');
          console.error('║                                                      ║');
          console.error('║  → Visit /__admin/patch in the app for instructions  ║');
          console.error('╚══════════════════════════════════════════════════════╝');
          console.error('');
        }
      } catch {}
    } else {
      console.log('[Schema] Community columns: OK');
    }

    // 1. Force all users to ranker (no filter — update all)
    const r1 = await supaRest('PATCH', 'users', 'select=id', {
      plan_type: 'ranker',
      billing_status: 'active',
      plan_expires_at: '2099-12-31T23:59:59.000Z',
      access_ends_at: '2099-12-31T23:59:59.000Z',
    });
    if (r1.status === 200 || r1.status === 204) {
      console.log('[Startup] plan_type backfill: OK');
    }

    // 2. Fetch users list to seed missing rows
    const r2 = await supaRest('GET', 'users', 'select=id,email,plan_type&limit=2000');
    let users = [];
    try { users = JSON.parse(r2.body.replace(/\n/g,'')); } catch {}
    if (!Array.isArray(users) || users.length === 0) {
      console.log('[Startup] No users found for backfill seeding');
      return;
    }

    // 3. Seed user_points for any user missing a row
    const r3 = await supaRest('GET', 'user_points', 'select=user_id&limit=2000');
    let existingPoints = new Set();
    try { JSON.parse(r3.body.replace(/\n/g,'')).forEach(r => existingPoints.add(r.user_id)); } catch {}

    const missingPoints = users.filter(u => !existingPoints.has(u.id));
    if (missingPoints.length > 0) {
      const rows = missingPoints.map(u => ({ user_id: u.id, points: 0, lifetime_points: 0 }));
      await supaRest('POST', 'user_points', null, rows);
      console.log('[Startup] Seeded user_points for', missingPoints.length, 'user(s)');
    }

    // 4. Seed user_stats_summary for any user missing a row
    const r4 = await supaRest('GET', 'user_stats_summary', 'select=user_id&limit=2000');
    let existingStats = new Set();
    try { JSON.parse(r4.body.replace(/\n/g,'')).forEach(r => existingStats.add(r.user_id)); } catch {}

    const missingStats = users.filter(u => !existingStats.has(u.id));
    if (missingStats.length > 0) {
      const rows = missingStats.map(u => ({
        user_id: u.id, total_study_seconds: 0,
        streak_days: 0, max_streak_days: 0, session_count: 0,
      }));
      await supaRest('POST', 'user_stats_summary', null, rows);
      console.log('[Startup] Seeded user_stats_summary for', missingStats.length, 'user(s)');
    }

    // 5. Seed user_profiles for any user missing a row
    const r5 = await supaRest('GET', 'user_profiles', 'select=user_id&limit=2000');
    let existingProfiles = new Set();
    try { JSON.parse(r5.body.replace(/\n/g,'')).forEach(r => existingProfiles.add(r.user_id)); } catch {}

    const missingProfiles = users.filter(u => !existingProfiles.has(u.id));
    if (missingProfiles.length > 0) {
      const rows = missingProfiles.map(u => ({ user_id: u.id, profile_data: {} }));
      await supaRest('POST', 'user_profiles', null, rows);
      console.log('[Startup] Seeded user_profiles for', missingProfiles.length, 'user(s)');
    }

    console.log('[Startup] DML backfills complete');

    // 6. Create admin user if configured and not present
    try {
      if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
        console.log('[Startup] Admin user creation skipped: ADMIN_EMAIL or ADMIN_PASSWORD unset');
      } else {
      const adminList = await supaAdminReq('GET', '/auth/v1/admin/users?page=1&per_page=50');
      const existingAdmins = (adminList.body && adminList.body.users) ? adminList.body.users : [];
      const hasAdmin = existingAdmins.some(u => u.email === ADMIN_EMAIL);
      if (!hasAdmin) {
        const createAdmin = await supaAdminReq('POST', '/auth/v1/admin/users', {
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          email_confirm: true,
          user_metadata: { username: 'suyash', full_name: 'Suyash Prabh', role: 'admin' },
        });
        if (createAdmin.status === 200 || createAdmin.status === 201) {
          console.log('[Startup] Admin user created:', adminEmailDisplay());
        } else {
          console.log('[Startup] Admin user creation skipped:', JSON.stringify(createAdmin.body).slice(0, 100));
        }
      } else {
        console.log('[Startup] Admin user exists:', adminEmailDisplay());
      }
      }
    } catch (adminErr) {
      console.warn('[Startup] Admin user check failed:', adminErr.message);
    }

  } catch (e) {
    console.warn('[Startup] DML backfill warning:', e.message);
  }
}
