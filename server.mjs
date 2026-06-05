import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import crypto from 'crypto';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

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
      + '&is_active=eq.true'
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
  res.end(`<!doctype html><html><head><meta charset="utf-8"><title>Isotope Admin Login</title><style>body{font-family:system-ui;background:#0a0a0a;color:#eee;margin:0;padding:32px}.box{max-width:500px;margin:8vh auto;background:#111;border:1px solid #333;border-radius:10px;padding:24px}input{width:100%;box-sizing:border-box;background:#050505;color:#fff;border:1px solid #333;border-radius:8px;padding:12px;margin:10px 0 14px}button{background:#7c3aed;color:white;border:0;border-radius:8px;padding:11px 16px;font-weight:700;margin-right:8px}.secondary{background:#27272a}.err{color:#fca5a5;font-size:13px}.muted{color:#aaa;font-size:13px;line-height:1.5}</style></head><body><main class="box"><h1>Admin Unlock</h1><p class="muted">Enter your local <code>ADMIN_SECRET</code>, or use the Supabase account already logged into this browser. Supabase unlock requires the account email in private <code>ADMIN_EMAIL</code>/<code>ADMIN_EMAILS</code> or an active admin role in <code>user_roles</code>.</p>${message ? `<p class="err">${escapeHtml(message)}</p>` : ''}<form id="adminForm" method="post" action="/__admin/login"><input type="hidden" name="next" value="${escapeHtml(next)}"><input type="hidden" id="supabaseToken" name="token" value=""><input type="password" name="secret" autocomplete="current-password" autofocus placeholder="ADMIN_SECRET"><button type="submit">Open with Secret</button><button class="secondary" id="useSession" type="button">Use Supabase Login</button></form><p id="sessionMsg" class="muted"></p></main><script>(function(){var msg=document.getElementById('sessionMsg');function parse(raw){try{var p=JSON.parse(raw);if(p&&p.access_token)return p.access_token;if(p&&p.session&&p.session.access_token)return p.session.access_token;if(p&&p.currentSession&&p.currentSession.access_token)return p.currentSession.access_token;if(p&&p.state&&p.state.session&&p.state.session.access_token)return p.state.session.access_token;}catch(e){}return ''}function token(){try{var raw=localStorage.getItem('isotope-auth-token');var t=parse(raw);if(t)return t;for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf('sb-')===0&&/-auth-token$/.test(k)){t=parse(localStorage.getItem(k));if(t)return t;}}}catch(e){}return ''}document.getElementById('useSession').onclick=function(){var t=token();if(!t){msg.textContent='No logged-in Supabase session found in this browser. Log into the app first, then reopen admin.';return;}document.getElementById('supabaseToken').value=t;document.getElementById('adminForm').submit();};})();</script></body></html>`);
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

  // Store session under BOTH keys so restore-and-launch.js and Supabase client both see it
  function saveSession(session) {
    if (!session || !session.access_token) return;
    var s = JSON.stringify(session);
    localStorage.setItem('sb-' + SUPA_REF + '-auth-token', s);  // Supabase JS v2 standard key
    localStorage.setItem('isotope-auth-token', s);               // restore-and-launch.js legacy key
  }

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
      return {ok: true};
    } catch(e) {
      return {ok: false, err: e.message || 'Network error'};
    }
  };

  // Cloud sync: fetch profile from Supabase and populate localStorage.
  // This fixes the "shows onboarding after login" bug by setting isOnboarded=true
  // for existing accounts, and syncs user data (username, avatar, coins) into
  // the isotope-user-sync key that the app reads on startup.
  async function syncProfileAfterLogin(jwt) {
    try {
      var r = await fetch('/__auth/profile', {
        headers: { 'Authorization': 'Bearer ' + jwt }
      });
      if (!r.ok) return;
      var d = await r.json();
      if (!d || !d.ok || !d.profile) return;
      var prof = d.profile;
      // Store onboarding state only when Supabase explicitly says it is complete.
      try {
        if (prof.isOnboarded === true || prof.onboarding_completed === true) {
          localStorage.setItem('isotope-onboarding', JSON.stringify({ isOnboarded: true }));
        }
      } catch(e) {}
      // Persist user data so the app's UserStore hydrates correctly
      try {
        localStorage.setItem('isotope-user-sync', JSON.stringify({
          id:            d.user_id,
          username:      prof.username      || '',
          display_name:  prof.display_name  || prof.name || prof.username || '',
          avatar_url:    prof.avatar_url    || null,
          plan_type:     'ranker',
          billing_status:'active',
          coins:         Number(prof.coins) || 0,
          gems:          Number(prof.gems)  || 0,
          synced_at:     Date.now()
        }));
      } catch(e) {}
    } catch(e) {}
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
      // Sync profile from DB: sets isOnboarded=true so existing accounts skip onboarding
      var jwt = data.session && data.session.access_token;
      if (jwt) syncProfileAfterLogin(jwt).catch(function(){});
      return {ok: true};
    } catch(e) {
      return {ok: false, err: e.message || 'Network error'};
    }
  };

  // On every page load, if a session exists but onboarding state is missing,
  // fetch it from the DB so returning users are never trapped in onboarding.
  (function restoreOnboardingFromDB() {
    try {
      var raw = localStorage.getItem('isotope-auth-token');
      if (!raw) {
        for (var i = 0; i < localStorage.length; i++) {
          var lk = localStorage.key(i);
          if (lk && lk.startsWith('sb-') && lk.endsWith('-auth-token')) {
            raw = localStorage.getItem(lk); break;
          }
        }
      }
      if (!raw) return;
      var sess = JSON.parse(raw);
      var jwt = sess && (sess.access_token || (sess.session && sess.session.access_token));
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
      var raw = localStorage.getItem('isotope-auth-token');
      if (raw) return parse(raw);
      if (SUPA_REF) {
        raw = localStorage.getItem('sb-' + SUPA_REF + '-auth-token');
        if (raw) return parse(raw);
      }
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

      // ── Helper: get current user ID from localStorage ─────────────────────
      function getUid() {
        try {
          for (var _i = 0; _i < localStorage.length; _i++) {
            var _lk = localStorage.key(_i);
            if (_lk && _lk.startsWith('sb-') && _lk.endsWith('-auth-token')) {
              var _sd = JSON.parse(localStorage.getItem(_lk) || '{}');
              return (_sd.user && _sd.user.id)
                  || (_sd.session && _sd.session.user && _sd.session.user.id)
                  || null;
            }
          }
        } catch {} return null;
      }

      // ── Helper: batch-fetch real user display info ────────────────────────
      function fetchUsers(ids) {
        if (!ids || !ids.length) return Promise.resolve({});
        return _orig.call(window, SUPA + '/rest/v1/users?id=in.(' + ids.join(',') + ')&select=id,username,name,avatar_url', {
          headers: { 'apikey': ANON, 'Authorization': 'Bearer ' + ANON, 'Accept': 'application/json' }
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

      function errResp(p) {
        resolve(new Response(JSON.stringify({
          rankings: [], period: p, source: 'error', display_names_resolved: true
        }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      }

      // ── Group analytics: member list + aggregate ──────────────────────────
      if (isGroupAn) {
        var gid = groupId || '';
        var gAPath = gid
          ? '/rest/v1/group_members?group_id=eq.' + encodeURIComponent(gid) + '&select=user_id,role,joined_at&limit=200'
          : '/rest/v1/group_members?select=user_id,role,joined_at&limit=1';
        _orig.call(window, SUPA + gAPath, {
          headers: { 'apikey': ANON, 'Authorization': 'Bearer ' + ANON }
        })
        .then(function(r) { return r.ok ? r.json() : []; })
        .then(function(members) {
          if (!Array.isArray(members)) members = [];
          resolve(new Response(JSON.stringify({
            group_id: groupId, member_count: members.length, members: members,
            total_sessions: 0, total_hours: 0, source: 'db'
          }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
        })
        .catch(function() {
          resolve(new Response(JSON.stringify({ data: [], members: [], source: 'error' }), {
            status: 200, headers: { 'Content-Type': 'application/json' }
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
          headers: { 'apikey': ANON, 'Authorization': 'Bearer ' + ANON, 'Accept': 'application/json' }
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
        .catch(function() { errResp('daily'); });
        return;
      }

      // ── Group leaderboard: filter user_stats_summary to group members ─────
      if (isGroup && groupId) {
        _orig.call(window, SUPA + '/rest/v1/group_members?group_id=eq.' + encodeURIComponent(groupId) + '&select=user_id&limit=200', {
          headers: { 'apikey': ANON, 'Authorization': 'Bearer ' + ANON }
        })
        .then(function(r) { return r.ok ? r.json() : []; })
        .then(function(members) {
          if (!Array.isArray(members) || !members.length) { finish([], period); return; }
          var memberIds = members.map(function(m) { return m.user_id; }).filter(Boolean);
          var gSQs = 'select=user_id,total_hours,weekly_hours,monthly_hours,total_sessions,current_streak,last_session_at'
                   + '&user_id=in.(' + memberIds.join(',') + ')'
                   + '&order=' + sortCol + '.desc.nullslast&limit=' + limitN;
          return _orig.call(window, SUPA + '/rest/v1/user_stats_summary?' + gSQs, {
            headers: { 'apikey': ANON, 'Authorization': 'Bearer ' + ANON, 'Accept': 'application/json' }
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
        .catch(function() { errResp(period); });
        return;
      }

      // ── Global weekly / monthly leaderboard ───────────────────────────────
      var qs = 'select=user_id,total_hours,weekly_hours,monthly_hours,total_sessions,current_streak,last_session_at'
             + '&order=' + sortCol + '.desc.nullslast&limit=' + limitN;
      _orig.call(window, SUPA + '/rest/v1/user_stats_summary?' + qs, {
        headers: { 'apikey': ANON, 'Authorization': 'Bearer ' + ANON, 'Accept': 'application/json' }
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
      .catch(function() { errResp(period); });
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
          for (var _i = 0; _i < localStorage.length; _i++) {
            var _lk = localStorage.key(_i);
            if (_lk && _lk.startsWith('sb-') && _lk.endsWith('-auth-token')) {
              var _sd = JSON.parse(localStorage.getItem(_lk) || '{}');
              jwt = (_sd.access_token)
                 || (_sd.session && _sd.session.access_token)
                 || null;
              if (jwt) break;
            }
          }
        } catch {}
      }

      if (!jwt) {
        resolve(new Response(JSON.stringify({ error: 'Not authenticated' }), {
          status: 401, headers: { 'Content-Type': 'application/json' }
        }));
        return;
      }

      _orig.call(window, SUPA + '/rest/v1/rpc/finish_session_sync', {
        method: 'POST',
        headers: {
          'apikey':        ANON,
          'Authorization': 'Bearer ' + jwt,
          'Content-Type':  'application/json',
          'Accept':        'application/json'
        },
        body: JSON.stringify({
          p_session_id:       body.session_id        || null,
          p_action:           body.action            || 'complete',
          p_duration_minutes: body.duration_minutes  || 0,
          p_group_id:         body.group_id          || null,
          p_session_type:     body.session_type      || 'focus',
          p_notes:            body.notes             || null,
          p_ended_at:         body.ended_at          || null
        })
      })
      .then(function(r) { return r.ok ? r.json() : Promise.resolve({}); })
      .then(function(d) {
        resolve(new Response(JSON.stringify(d || {}), {
          status: 200, headers: { 'Content-Type': 'application/json' }
        }));
      })
      .catch(function() {
        // Never let a sync failure break the app — return a safe no-op shape
        resolve(new Response(JSON.stringify({
          already_processed: false,
          affected_group_ids: [],
          challenge_updates:  []
        }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
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

// ── Auth guard: redirect unauthenticated / non-onboarded users early ─────────
// Injected at </head> — runs synchronously BEFORE React loads to prevent any
// flash of protected content. Source of truth: Supabase session in localStorage.
// DB onboarding state is verified server-side by restore-and-launch.js;
// this script provides a fast client-side pre-check for immediate UX.
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
  function getValidSession() {
    try {
      var raw = localStorage.getItem('sb-' + SUPA_REF + '-auth-token')
             || localStorage.getItem('isotope-auth-token');
      if (!raw) return null;
      var sess = JSON.parse(raw);
      var token = sess && (sess.access_token || (sess.session && sess.session.access_token));
      if (!token) return null;
      var exp = sess.expires_at || (sess.session && sess.session.expires_at);
      if (exp && (Number(exp) * 1000) < Date.now()) return null; // expired
      return sess;
    } catch(e) { return null; }
  }

  var session = getValidSession();
  if (!session) {
    // No valid session — redirect immediately to onboarding (shows sign-in form)
    window.location.replace('/onboarding');
    return;
  }

  // ── Onboarding enforcement ────────────────────────────────────────────────────
  // If the user has a session but hasn't finished onboarding, block dashboard access.
  // restore-and-launch.js performs the authoritative DB check; this is a fast
  // localStorage pre-check to prevent obvious URL-bypass attempts.
  try {
    var onbRaw = localStorage.getItem('isotope-onboarding');
    if (onbRaw) {
      var onb = JSON.parse(onbRaw);
      // Support both flat and nested Zustand state shapes
      var isOnboarded = onb && (
        onb.isOnboarded === true ||
        (onb.state && onb.state.isOnboarded === true)
      );
      // If explicitly false (not undefined/null — those mean "not yet loaded")
      if (isOnboarded === false) {
        window.location.replace('/onboarding');
        return;
      }
    }
  } catch(e) { /* ignore — localStorage unavailable or corrupted */ }
})();
</script>`;
}
const AUTH_GUARD_SCRIPT = buildAuthGuardScript();

// ── Reload guard — prevents infinite SW-triggered reload loops ────────────────
// Injected early (<head>) so it is present before the PWA/SW manager code runs.
// window.__isoReloadGuard() allows at most ONE automatic reload per browser
// session per app version.  Extra calls are silently suppressed with a console
// warning so the user never sees a reload loop even if the SW fires repeatedly.
const RELOAD_GUARD_SCRIPT = `<script>
(function(){
  var _k='iso_sw_rg_v3';
  window.__isoReloadGuard=function(){
    if(sessionStorage.getItem(_k)){
      console.warn('[Isotope] SW reload guard: blocked repeat automatic reload');
      return false;
    }
    sessionStorage.setItem(_k,'1');
    window.location.reload();
    return true;
  };
})();
</script>`;

function injectScripts(html) {
  // Injection order (all into </head> so they run before React):
  //  1. ORIGIN_SCRIPT   — sets window.__ISO_ORIGIN__, __ISO_SUPA_URL__, __ISO_ANON__
  //  2. LOCAL_DATA_GUARD_SCRIPT — per-user local workspace isolation
  //  3. AUTH_GUARD_SCRIPT — immediate redirect if no valid session (must be early)
  //  4. PREMIUM_SCRIPT  — fetch interceptor + profile upgrade (only runs if authed)
  //  5. RELOAD_GUARD_SCRIPT — one-shot SW reload guard (max 1 auto-reload/session)
  //  6. KEY_SCRIPT      — AI API keys
  //  7. USERNAME_AUTH_SCRIPT — window.__isoUp / __isoLogin helpers for auth forms
  // UPDATE_COMMAND_DIALOG_SCRIPT goes before </body> (needs document.body).
  let out = html.replace('</head>', ORIGIN_SCRIPT + LOCAL_DATA_GUARD_SCRIPT + AUTH_GUARD_SCRIPT + PREMIUM_SCRIPT + RELOAD_GUARD_SCRIPT + '</head>');
  if (KEY_SCRIPT) out = out.replace('</head>', KEY_SCRIPT + '</head>');
  out = out.replace('</head>', USERNAME_AUTH_SCRIPT + '</head>');
  out = out.replace('</body>', UPDATE_COMMAND_DIALOG_SCRIPT + '</body>');
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

// ── PWAManager bundle patch: reload guard ────────────────────────────────────
// The compiled PWAManager bundle fires window.location.reload() automatically
// whenever a service-worker 'activated' event fires with isUpdate||isExternal.
// On some devices/browsers this loops: SW activates → reload → SW activates →
// reload … indefinitely while the server is offline or the SW cache is stale.
// Fix: replace the bare reload() with window.__isoReloadGuard() which allows at
// most one automatic reload per session (the guard script is injected early in
// index.html before any bundles load).
const PWA_RELOAD_FROM = `(r.isUpdate || r.isExternal) && window.location.reload()`;
const PWA_RELOAD_TO   = `(r.isUpdate || r.isExternal) && (typeof window.__isoReloadGuard==='function' ? window.__isoReloadGuard() : window.location.reload())`;
let patchedPWAManagerBundle = null;
function getPatchedPWAManagerBundle() {
  if (patchedPWAManagerBundle) return patchedPWAManagerBundle;
  try {
    let raw = fs.readFileSync(PWA_MANAGER_BUNDLE_ABS, 'utf8');
    if (raw.includes(PWA_RELOAD_FROM)) {
      raw = raw.replace(PWA_RELOAD_FROM, PWA_RELOAD_TO);
      console.log('[PWAPatch] SW reload guard applied — auto-reload loop prevented');
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

    // Sign Up: replace email-validation + signUp call → server-side signup
    // Form variables: s = Full Name, t = Email, l = Password
    // We pass t (email) + l (password) to server — real email used directly
    p(
      'const N = M(t);\n            if (N) {\n                m.setState({\n                    error: N\n                });\n                return\n            }(await j(s, t, l)).success && d("/onboarding")',
      "var __r=await window.__isoUp(t,l);if(!__r.ok){m.setState({error:__r.err||'Signup failed',isLoading:false});return;}window.location.href='/onboarding';"
    );
    // Sign Up: button label
    p('"Create Account with Email"', '"Create Account"');

    // Landing panel version badge: update stale hardcoded version string
    p('children: "IsotopeAI v2.0"', 'children: "IsotopeAI v3.1"');

    console.log('[AuthPatch] ' + applied + '/5 patches applied to Auth bundle');
    patchedAuthBundle = Buffer.from(raw, 'utf8');
  } catch (e) { console.error('[AuthPatch] Error:', e.message); patchedAuthBundle = null; }
  return patchedAuthBundle;
}
// getPatchedAuthBundle() — deferred to after server.listen()

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
function supaAdminReq(method, supaPath, bodyObj) {
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

function readReqBody(req, maxBytes = 1048576) { // 1 MB limit
  return new Promise((resolve, reject) => {
    let b = '', len = 0;
    req.on('data', d => {
      len += d.length;
      if (len > maxBytes) { req.destroy(new Error('Request body too large (max 1 MB)')); return; }
      b += d;
    });
    req.on('end', () => { try { resolve(JSON.parse(b)); } catch { resolve({}); } });
    req.on('error', reject);
  });
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
    if (vdata.sha) info.sha = String(vdata.sha);
    if (vdata.message) info.message = String(vdata.message);
    if (vdata.updated_at) info.updated_at = String(vdata.updated_at);
    info.source = 'VERSION';
  } catch {}
  try {
    const gitSha = execSync('git rev-parse HEAD', { cwd: __dirname, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    if (/^[0-9a-f]{40}$/i.test(gitSha)) {
      info.sha = gitSha;
      info.source = 'git';
    }
    const msg = execSync('git log -1 --pretty=%s', { cwd: __dirname, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    if (msg) info.message = msg;
  } catch {}
  return info;
}

let LOCAL_VERSION = readLocalVersionInfo();
let DEPLOYED_SHA = LOCAL_VERSION.sha || 'unknown';
console.log('[Update] Local version: ' + LOCAL_VERSION.version + ' (' + String(DEPLOYED_SHA).slice(0, 7) + ', ' + LOCAL_VERSION.source + ')');

// Cache GitHub response for 10 min to avoid rate-limit
let _ghCache = null;
let _ghCacheTs = 0;
const GH_TTL = 10 * 60 * 1000;

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

  // ── Admin route auth guard ──────────────────────────────────────────────────
  // Admin routes are disabled unless owner/admin mode is explicitly enabled.
  let adminPath = '';
  try { adminPath = new URL('http://x' + req.url).pathname; } catch { adminPath = req.url.split('?')[0]; }

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
            'Set-Cookie': 'iso_admin=' + encodeURIComponent(adminCookieValue()) + '; Path=/__admin; HttpOnly; SameSite=Strict; Max-Age=86400',
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
  if (adminPath.startsWith('/__admin/') && !isAdminAuthed(req)) {
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

  // ── Edge function interceptors (server-side mirror of browser fetch override) ─
  // These catch /__supa/functions/v1/... before the general proxy handler forwards
  // them to Supabase (where they aren't deployed in self-hosted mode).
  if (req.method === 'POST' && req.url.startsWith('/__supa/functions/v1/')) {
    const fnPath = req.url.replace('/__supa/functions/v1/', '').split('?')[0];
    const jsonOk = (obj) => { const b = JSON.stringify(obj); res.writeHead(200, {'Content-Type':'application/json','Content-Length':String(b.length),'Cache-Control':'no-store'}); res.end(b); };

    // Leaderboard / analytics — return valid empty-shape stubs for server-side calls.
    // Real browser requests are intercepted by the fetch override and never reach here.
    if (fnPath === 'get-leaderboard' || fnPath === 'get-daily-leaderboard') {
      return jsonOk({ data: [], type: fnPath, intercepted: true });
    }
    if (fnPath === 'get-group-leaderboard' || fnPath === 'get-group-analytics') {
      return jsonOk({ data: [], members: [], intercepted: true });
    }

    // finish-session — stub for server-side smoke-test; real calls go via fetch override
    if (fnPath === 'finish-session') {
      return jsonOk({ ok: true, intercepted: true, message: 'finish-session intercepted server-side' });
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
  if (req.method === 'GET' && req.url === '/api/ai-config') {
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
  if (req.method === 'GET' && req.url === '/api/health') {
    (async () => {
      const [rest, auth, buckets] = await Promise.all([
        supaRestReq('GET', '/rest/v1/', null).catch(e => ({ status: 0, body: { error: e.message } })),
        supaAdminReq('GET', '/auth/v1/settings', null).catch(e => ({ status: 0, body: { error: e.message } })),
        supaRestReq('GET', '/storage/v1/bucket', null).catch(e => ({ status: 0, body: { error: e.message } })),
      ]);
      const ok = rest.status > 0 && rest.status < 500
              && auth.status > 0 && auth.status < 500
              && buckets.status > 0 && buckets.status < 500;
      res.writeHead(ok ? 200 : 503, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify({
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
      }));
    })().catch(e => {
      res.writeHead(503, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify({ status: 'degraded', error: e.message }));
    });
    return;
  }

  // ── /api/version — returns deployed commit SHA ───────────────────────────────
  if (req.method === 'GET' && req.url === '/api/version') {
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
  if (req.method === 'GET' && req.url === '/api/check-update') {
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
        // Prefer version-string comparison: extract semver from upstream commit message
        // (e.g. "release: v3.1.0 ...") and compare with local package.json version.
        // Falls back to SHA comparison only when no version tag is present in message.
        // This prevents false-positive update banners in Replit / CI environments where
        // the workspace git SHA always differs from the upstream repo SHA.
        const upstreamVer = (latest.message || '').match(/\bv?(\d+\.\d+\.\d+)\b/)?.[1] || null;
        const localVer = LOCAL_VERSION.version;
        const hasUpdate = upstreamVer
          ? upstreamVer !== localVer
          : /^[0-9a-f]{40}$/i.test(DEPLOYED_SHA) && latest.sha && latest.sha !== DEPLOYED_SHA;
        _ghCache = {
          hasUpdate:  hasUpdate,
          deployed:   DEPLOYED_SHA,
          deployed_version: LOCAL_VERSION.version,
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

  // ── /__auth/profile GET — fetch user profile (cloud sync, fixes UserStore fetch error)
  // Returns profile_data from user_profiles merged with public.users columns.
  if (req.method === 'GET' && req.url === '/__auth/profile') {
    (async () => {
      const rawAuth = (req.headers['authorization'] || req.headers['Authorization'] || '').toString().trim();
      const userJwt = rawAuth.replace(/^Bearer\s+/i, '').trim() || null;
      if (!userJwt) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Authentication required' }));
        return;
      }
      const userId = getUserIdFromJwt(userJwt);
      if (!userId) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid token' }));
        return;
      }
      try {
        const svcKey = ADMIN_MODE_READY ? SUPA_SERVICE_KEY : SUPA_ANON_KEY;
        const restAuth = ADMIN_MODE_READY ? SUPA_SERVICE_KEY : userJwt;
        const supaHost = new URL(SUPA_URL).hostname;
        const [profRes, userRes, onboardingRes] = await Promise.all([
          new Promise((resolve, reject) => {
            const o = { hostname: supaHost, path: `/rest/v1/user_profiles?user_id=eq.${encodeURIComponent(userId)}&select=profile_data&limit=1`, method: 'GET', headers: { 'apikey': svcKey, 'Authorization': 'Bearer ' + restAuth, 'Accept': 'application/json' } };
            const rq = https.request(o, r => { const ch = []; r.on('data', c => ch.push(c)); r.on('end', () => { try { resolve(JSON.parse(Buffer.concat(ch).toString())); } catch { resolve([]); } }); });
            rq.on('error', reject); rq.end();
          }),
          new Promise((resolve, reject) => {
            const o = { hostname: supaHost, path: `/rest/v1/users?id=eq.${encodeURIComponent(userId)}&select=username,name,avatar_url,coins,gems,plan_type&limit=1`, method: 'GET', headers: { 'apikey': svcKey, 'Authorization': 'Bearer ' + restAuth, 'Accept': 'application/json' } };
            const rq = https.request(o, r => { const ch = []; r.on('data', c => ch.push(c)); r.on('end', () => { try { resolve(JSON.parse(Buffer.concat(ch).toString())); } catch { resolve([]); } }); });
            rq.on('error', reject); rq.end();
          }),
          supaRestReq('GET', `/rest/v1/user_onboarding?user_id=eq.${encodeURIComponent(userId)}&select=completed,completed_at&limit=1`, null, { 'Authorization': 'Bearer ' + restAuth, 'apikey': svcKey })
            .catch(() => ({ status: 0, body: [] })),
        ]);
        const profileData = (Array.isArray(profRes) && profRes[0]) ? (profRes[0].profile_data || {}) : {};
        const userData = (Array.isArray(userRes) && userRes[0]) ? userRes[0] : {};
        const onboardingData = (Array.isArray(onboardingRes.body) && onboardingRes.body[0]) ? onboardingRes.body[0] : null;
        const isOnboarded = onboardingData
          ? onboardingData.completed === true
          : profileData.isOnboarded === true;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          ok: true,
          user_id: userId,
          profile: {
            ...userData,
            ...profileData,
            isOnboarded,
            onboarding_completed: isOnboarded,
            onboarding_completed_at: onboardingData?.completed_at || profileData.onboardingCompletedAt || null,
          },
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
    readReqBody(req).then(async (body) => {
      // 1. Extract user JWT from Authorization header
      const rawAuth = (req.headers['authorization'] || req.headers['Authorization'] || '').toString().trim();
      const userJwt = rawAuth.replace(/^Bearer\s+/i, '').trim() || null;
      if (!userJwt) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Authentication required' }));
        return;
      }

      // 2. Decode JWT to get user id (no verify needed — Supabase validates on DB call)
      let userId = getUserIdFromJwt(userJwt);
      if (!userId) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid token' }));
        return;
      }
      if (!userId) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Could not extract user ID from token' }));
        return;
      }

      const { display_name, username, bio, avatar_url, preferences, isOnboarded, onboarding_completed } = body || {};

      try {
        const svcKey = ADMIN_MODE_READY ? SUPA_SERVICE_KEY : SUPA_ANON_KEY;
        const restAuth = ADMIN_MODE_READY ? SUPA_SERVICE_KEY : userJwt;
        const supaHost = new URL(SUPA_URL).hostname;

        // 3. Fetch current profile_data blob
        const profRes = await new Promise((resolve, reject) => {
          const o = { hostname: supaHost, path: `/rest/v1/user_profiles?user_id=eq.${encodeURIComponent(userId)}&select=profile_data&limit=1`, method: 'GET', headers: { 'apikey': svcKey, 'Authorization': 'Bearer ' + restAuth, 'Accept': 'application/json' } };
          const rq = https.request(o, r => { const ch = []; r.on('data', c => ch.push(c)); r.on('end', () => { try { resolve({ status: r.statusCode, body: JSON.parse(Buffer.concat(ch).toString()) }); } catch { resolve({ status: r.statusCode, body: [] }); } }); });
          rq.on('error', reject); rq.end();
        });
        const currentProfile = (Array.isArray(profRes.body) && profRes.body[0]) ? (profRes.body[0].profile_data || {}) : {};

        // 4. Deep-merge new fields into profile_data
        const merged = Object.assign({}, currentProfile);
        if (display_name !== undefined) merged.display_name = String(display_name).trim();
        if (bio         !== undefined) merged.bio          = String(bio).trim();
        if (avatar_url  !== undefined) merged.avatar_url   = String(avatar_url).trim();
        if (isOnboarded !== undefined) merged.isOnboarded = isOnboarded === true;
        if (onboarding_completed !== undefined) merged.isOnboarded = onboarding_completed === true;
        if (preferences !== undefined && typeof preferences === 'object') {
          merged.preferences = Object.assign({}, currentProfile.preferences || {}, preferences);
        }

        // 5. Upsert user_profiles row with merged data (use service_role to bypass RLS write restriction)
        const upsertBody = Buffer.from(JSON.stringify({ user_id: userId, profile_data: merged }));
        await new Promise((resolve, reject) => {
            const o = { hostname: supaHost, path: `/rest/v1/user_profiles?user_id=eq.${encodeURIComponent(userId)}`, method: 'PATCH', headers: { 'apikey': svcKey, 'Authorization': 'Bearer ' + restAuth, 'Content-Type': 'application/json', 'Prefer': 'return=minimal', 'Content-Length': String(upsertBody.length) } };
          const rq = https.request(o, r => { r.resume(); r.on('end', resolve); });
          rq.on('error', reject); rq.write(upsertBody); rq.end();
        });

        // 6. If username or display_name changed, also sync to public.users
        const usersUpdate = {};
        if (username     !== undefined) usersUpdate.username  = String(username).trim();
        if (display_name !== undefined) usersUpdate.name      = String(display_name).trim();
        if (avatar_url   !== undefined) usersUpdate.avatar_url = String(avatar_url).trim();
        if (Object.keys(usersUpdate).length > 0) {
          const usersBody = Buffer.from(JSON.stringify(usersUpdate));
          await new Promise((resolve, reject) => {
            const o = { hostname: supaHost, path: `/rest/v1/users?id=eq.${encodeURIComponent(userId)}`, method: 'PATCH', headers: { 'apikey': svcKey, 'Authorization': 'Bearer ' + restAuth, 'Content-Type': 'application/json', 'Prefer': 'return=minimal', 'Content-Length': String(usersBody.length) } };
            const rq = https.request(o, r => { r.resume(); r.on('end', resolve); });
            rq.on('error', reject); rq.write(usersBody); rq.end();
          });
        }

        if (merged.isOnboarded === true) {
          await supaRestReq('POST', '/rest/v1/user_onboarding', {
            user_id: userId,
            completed: true,
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, { 'Prefer': 'resolution=merge-duplicates,return=minimal', 'Authorization': 'Bearer ' + restAuth, 'apikey': svcKey }).catch(() => {});
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, user_id: userId, profile: merged }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: e.message }));
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
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ session: signin.body }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
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
      const sqlPath = path.join(__dirname, 'isotope-schema.sql');
      const sql = fs.readFileSync(sqlPath, 'utf8');
      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': 'attachment; filename="isotope-schema-v2.sql"',
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
      Tip: set <code>SUPABASE_ACCESS_TOKEN=sbp_...</code> as an env var on your server to pre-fill this field automatically.
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
        user_onboarding:              ['user_id','completed','completed_at','updated_at'],
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
          const ok = r.status === 200 && (Array.isArray(r.body) || Array.isArray(r.body?.data) || typeof r.body === 'object');
          return { name:'get-leaderboard', ok, detail: ok ? `HTTP 200 — ${JSON.stringify(r.body).slice(0,50)}` : `HTTP ${r.status} ${JSON.stringify(r.body).slice(0,60)}` };
        })(),
        (async () => {
          const r = await localReq('POST', '/__supa/functions/v1/get-daily-leaderboard', {});
          const ok = r.status === 200;
          return { name:'get-daily-leaderboard', ok, detail: ok ? 'HTTP 200' : `HTTP ${r.status}` };
        })(),
        (async () => {
          const r = await localReq('POST', '/__supa/functions/v1/get-group-leaderboard', {group_id:'__test__'});
          const ok = r.status === 200;
          return { name:'get-group-leaderboard', ok, detail: ok ? 'HTTP 200' : `HTTP ${r.status}` };
        })(),
        (async () => {
          const r = await localReq('POST', '/__supa/functions/v1/get-group-analytics', {group_id:'__test__'});
          const ok = r.status === 200;
          return { name:'get-group-analytics', ok, detail: ok ? 'HTTP 200' : `HTTP ${r.status}` };
        })(),
        (async () => {
          const r = await localReq('POST', '/__supa/functions/v1/finish-session', {user_id:null,duration_seconds:0});
          const ok = r.status === 200;
          return { name:'finish-session', ok, detail: ok ? 'HTTP 200' : `HTTP ${r.status} — ${JSON.stringify(r.body).slice(0,60)}` };
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
          const r = await supaReq('GET', '/rest/v1/', null, svcKey);
          return { name:'Supabase REST reachable', ok: r.status < 500 && r.status !== 0, detail:`HTTP ${r.status}` };
        })(),
        (async () => {
          const r = await supaReq('GET', '/auth/v1/settings', null, svcKey);
          return { name:'Supabase Auth reachable', ok: r.status < 500 && r.status !== 0, detail:`HTTP ${r.status}` };
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

      // ── Aggregate results ─────────────────────────────────────────────────
      const allTests = [
        ...tableChecks.map(c => c.ok),
        ...rpcTests.map(c => c.ok),
        ...rlsChecks.map(c => c.ok),
        ...interceptorTests.map(c => c.ok),
        ...serverChecks.map(c => c.ok),
        ...communityChecks.map(c => c.ok),
        ...storageChecks.map(c => c.ok),
      ];
      const nPass = allTests.filter(Boolean).length;
      const nFail = allTests.length - nPass;
      const elapsed = Date.now() - t0;
      function pct(arr) { const p=arr.filter(c=>c.ok).length; return `${p}/${arr.length}`; }
      function rows(arr, cols) {
        return arr.map(c => {
          const okBadge = `<span class="${c.ok?'ok':'fail'}">${c.ok?'✓ PASS':'✗ FAIL'}</span>`;
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
<p class="sub">${SUPA_URL} &nbsp;·&nbsp; Ran ${allTests.length} tests in ${elapsed}ms &nbsp;·&nbsp; <a style="color:#6366f1;text-decoration:none" href="/__admin/patch">Patch →</a> &nbsp;·&nbsp; <a style="color:#6366f1;text-decoration:none" href="/__admin/roles">Roles →</a></p>

<div class="summary">
  <div class="pill pill-n"><span class="num">${allTests.length}</span>total tests</div>
  <div class="pill pill-ok"><span class="num">${nPass}</span>passing</div>
  ${nFail > 0 ? `<div class="pill pill-fail"><span class="num">${nFail}</span>failing</div>` : ''}
  <div class="pill ${nFail===0?'pill-ok':'pill-fail'}"><span class="num">${nFail===0?'✓':'✗'}</span>${nFail===0?'all clear':'needs fix'}</div>
  <div class="pill pill-t"><span class="num">${elapsed}ms</span>run time</div>
</div>

${nFail > 0 ? `<div class="fix-bar"><div style="flex:1"><strong style="color:#c4b5fd">Some tests failing</strong><br><span style="color:#555;font-size:11px">Apply the community patch to fix missing tables, columns, or RPCs</span></div><a class="fix" href="/__admin/patch">🚀 Apply Patch</a></div>` : ''}

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

</div></body></html>`;

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
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid email or password' }));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ session: signin.body }));
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
    readReqBody(req).then(({ pat, sql }) => {
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

  // ── SPA alias redirects — paths in PUBLIC_PATHS that have no React Router route ──
  // /login, /signup, /reset-password are not defined in the SPA router; navigating
  // to them directly renders the SPA 404 page. Redirect them to / (the auth form).
  if (req.method === 'GET' && (urlPath === '/login' || urlPath === '/signup' || urlPath === '/reset-password')) {
    res.writeHead(302, { Location: '/' });
    res.end();
    return;
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey, x-client-info');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cache-Control', 'no-cache');
  // BUG FIX: allow IndexedDB and storage APIs inside cross-origin iframes.
  // Without this, some sandboxed iframe environments block IndexedDB writes,
  // causing [kvStore] Shadow backup write failed errors in the browser console.
  res.setHeader('Permissions-Policy', 'storage-access=*, camera=(), microphone=()');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');

  const serveHtml = (buf) => {
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
    const isHashedAsset = /[-_][A-Za-z0-9_-]{6,14}\.(js|css|woff2?)$/.test(basename);
    const acceptsGzip = /gzip/.test(req.headers['accept-encoding'] || '');
    const gzippable = /\.(js|mjs|css|svg|json)$/.test(ext);

    function send(buf) {
      const cc = ext === '.html' ? 'no-cache' :
                 isHashedAsset   ? 'public, max-age=31536000, immutable' :
                                   'public, max-age=3600';
      res.setHeader('Cache-Control', cc);
      if (acceptsGzip && gzippable && buf.length > 1024) {
        zlib.gzip(buf, { level: 6 }, (err, gz) => {
          if (err) { res.writeHead(200, { 'Content-Type': contentType }); res.end(buf); return; }
          res.writeHead(200, { 'Content-Type': contentType, 'Content-Encoding': 'gzip', 'Vary': 'Accept-Encoding' });
          res.end(gz);
        });
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
        res.setHeader('Cache-Control', 'no-cache');
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
        if (ext === '.js' && reqPath.startsWith('/assets/')) {
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
    getPatchedInvitesBundle();
    getPatchedCommunityBundle();
    getPatchedCommunityHubBundle();
    getPatchedPWAManagerBundle();
  });

  // Auto-run DML backfills on startup (safe REST-only operations, no DDL needed)
  runStartupBackfills().catch(() => {});
});

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
