import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, 'public');
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
// ── Service-role key → server proxy bypasses ALL Supabase RLS ─────────────────
// Get from: Supabase dashboard → Project Settings → API → service_role key
// Set as env var: SUPABASE_SERVICE_ROLE_KEY=eyJ...
const SUPA_SERVICE_KEY    = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
// Original IsotopeAI project — override with your own free Supabase project:
//   SUPABASE_URL=https://xxxx.supabase.co
//   SUPABASE_ANON_KEY=eyJ...
const SUPA_URL_DEFAULT    = 'https://rcnekgzbdlwhcpmpoogz.supabase.co';
const SUPA_ANON_DEFAULT   = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjbmVrZ3piZGx3aGNwbXBvb2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MjU4MjQsImV4cCI6MjA4MDQwMTgyNH0.4s85XfWCetX1DDE3H7XdyRLogvrtAzpk0CAADaapEUo';
const SUPA_URL            = process.env.SUPABASE_URL      || SUPA_URL_DEFAULT;
const SUPA_ANON_KEY       = process.env.SUPABASE_ANON_KEY || SUPA_ANON_DEFAULT;
const CUSTOM_SUPA         = SUPA_URL !== SUPA_URL_DEFAULT;
const PROXY_PATH          = '/__supa';

if (SUPA_SERVICE_KEY) {
  console.log('[Proxy] Supabase service-role key loaded — RLS fully bypassed for community');
} else {
  console.log('[Proxy] No SUPABASE_SERVICE_ROLE_KEY — using profile-upgrade fallback for community RLS');
}
if (CUSTOM_SUPA) {
  console.log('[Supabase] Custom project:', SUPA_URL);
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

// ── OAuth origin injection ────────────────────────────────────────────────────
const ORIGIN_SCRIPT = `<script>
(function(){
  window.__ISO_ORIGIN__ = window.location.origin;
})();
</script>`;

// ── Combined premium bypass + profile upgrade ─────────────────────────────────
//
// TWO mechanisms work together:
//
// 1. RESPONSE PATCH  – every Supabase JSON response has plan_type→scholar so
//    client-side premium checks always pass.
//
// 2. PROFILE UPGRADE – after login (or on page load with existing session) we
//    PATCH the real Supabase profiles row to plan_type='scholar'.
//    Once saved, is_premium_user() in PostgreSQL returns true, so all RLS
//    policies (groups, group_members, challenges, leaderboard) pass.
//    On success: reload once to flush React Query stale cache.
//    The server-side /__supa/* proxy is available for when you set
//    SUPABASE_SERVICE_ROLE_KEY — it will fully bypass RLS without needing
//    the profile update.
//
const PREMIUM_SCRIPT = `<script>
(function(){
  'use strict';
  var _orig = window.fetch;
  var SUPA  = '${SUPA_URL}';
  var ANON  = '${SUPA_ANON_KEY}';
  var _upgradedUsers = {};

  // ── Upgrade user's real Supabase profile to scholar ─────────────────────────
  // This makes is_premium_user() return true in PostgreSQL, so all RLS
  // SELECT/INSERT/UPDATE policies on community tables pass for this user.
  function upgradeProfile(jwt, userId) {
    if (!jwt || !userId || _upgradedUsers[userId]) return;
    _upgradedUsers[userId] = true;

    var payload = JSON.stringify({
      plan_type:       'scholar',
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
          console.log('[ISO-MOD] \u2705 Profile upgraded to scholar in Supabase DB');
          // Reload once so React Query fetches fresh community data with RLS now passing
          if (!sessionStorage.getItem('__iso_rls_upgraded__')) {
            sessionStorage.setItem('__iso_rls_upgraded__', userId);
            setTimeout(function() { window.location.reload(); }, 400);
          }
        } else {
          console.warn('[ISO-MOD] \u26a0\ufe0f Profile upgrade returned', r && r.status,
            '— RLS may still block community. Set SUPABASE_SERVICE_ROLE_KEY on server for full bypass.');
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

  // ── Intercept fetch ──────────────────────────────────────────────────────────
  window.fetch = function(input, init) {
    var url = input instanceof Request ? input.url : String(input || '');

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
              sessionStorage.removeItem('__iso_rls_upgraded__'); // fresh login = fresh upgrade
              upgradeProfile(jwt, userId);
            }
          }).catch(function(){});
        }
        return patchResp(res);
      });
    }

    // Patch all Supabase REST/RPC responses (plan_type → scholar etc)
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
      function deepPatch(o) {
        if (!o || typeof o !== 'object') return o;
        if (Array.isArray(o)) return o.map(deepPatch);
        var r = Object.assign({}, o);
        if ('plan_type'       in r) r.plan_type       = 'ranker';
        if ('billing_status'  in r) r.billing_status  = 'active';
        if ('plan_expires_at' in r && !r.plan_expires_at) r.plan_expires_at = '2099-12-31T23:59:59.000Z';
        if ('access_ends_at'  in r && !r.access_ends_at)  r.access_ends_at  = '2099-12-31T23:59:59.000Z';
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

  // Clear stale demo-mode sessionStorage flags
  try {
    for (var i = 0; i < sessionStorage.length; i++) {
      var sk = sessionStorage.key(i);
      if (sk && (sk.toLowerCase().includes('demo'))) { sessionStorage.removeItem(sk); break; }
    }
  } catch(e) {}
})();
</script>`;

function injectScripts(html) {
  let out = html.replace('</head>', ORIGIN_SCRIPT + PREMIUM_SCRIPT + '</head>');
  if (KEY_SCRIPT) out = out.replace('</head>', KEY_SCRIPT + '</head>');
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

    // [Patch 4] Custom Supabase project — replace hardcoded URL + anon key
    if (CUSTOM_SUPA) {
      const OLD_URL  = `"${SUPA_URL_DEFAULT}"`;
      const NEW_URL  = `"${SUPA_URL}"`;
      const OLD_ANON = `"${SUPA_ANON_DEFAULT}"`;
      const NEW_ANON = `"${SUPA_ANON_KEY}"`;
      if (patched.includes(SUPA_URL_DEFAULT)) {
        patched = patched.split(SUPA_URL_DEFAULT).join(SUPA_URL);
        console.log('[AppPatch] Supabase URL → custom project');
      }
      if (SUPA_ANON_KEY !== SUPA_ANON_DEFAULT && patched.includes(SUPA_ANON_DEFAULT)) {
        patched = patched.split(SUPA_ANON_DEFAULT).join(SUPA_ANON_KEY);
        console.log('[AppPatch] Supabase anon key → custom project');
      }
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

// Warm up caches
if (GEMINI_API_KEY || GROQ_API_KEY) getPatchedAiStore();
getPatchedFocusBundle();
getPatchedAppBundle();

// ── Supabase community proxy ──────────────────────────────────────────────────
// Handles /__supa/* → forwards to Supabase.
// With SUPABASE_SERVICE_ROLE_KEY: uses service key (full RLS bypass).
// Without: forwards user's Authorization header (relies on profile upgrade).
function handleSupabaseProxy(req, res) {
  const targetPath = req.url.replace(PROXY_PATH, '') || '/';
  const useServiceKey = !!SUPA_SERVICE_KEY;
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

const appStateStore = { timerState: null, localStorage: {} };

const server = http.createServer((req, res) => {
  // ── CORS preflight ──────────────────────────────────────────────────────────
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin':  '*',
      'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization,apikey,x-client-info,prefer,range',
    });
    res.end();
    return;
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
    res.end(JSON.stringify({ ok: true, ts: Date.now(), proxy: !!SUPA_SERVICE_KEY }));
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
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      aiKeys: { gemini: !!GEMINI_API_KEY, groq: !!GROQ_API_KEY },
      supabaseProxy: !!SUPA_SERVICE_KEY,
    }));
    return;
  }

  // ── Static file serving ─────────────────────────────────────────────────────
  let urlPath = req.url.split('?')[0];
  try { urlPath = decodeURIComponent(urlPath); } catch {}
  const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safePath);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey, x-client-info');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');

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

    if ((GEMINI_API_KEY || GROQ_API_KEY) && fp === AI_STORE_ABS) {
      const buf = getPatchedAiStore();
      if (buf) { res.writeHead(200, { 'Content-Type': contentType }); res.end(buf); return; }
    }
    if (fp === FOCUS_BUNDLE_ABS) {
      const buf = getPatchedFocusBundle();
      if (buf) { res.writeHead(200, { 'Content-Type': contentType }); res.end(buf); return; }
    }
    if (fp === APP_BUNDLE_ABS) {
      const buf = getPatchedAppBundle();
      if (buf) { res.writeHead(200, { 'Content-Type': contentType }); res.end(buf); return; }
    }

    fs.readFile(fp, (err, data) => {
      if (err) {
        if (['.js','.mjs','.css','.png','.svg','.woff','.woff2','.ttf','.json'].includes(ext)) {
          res.writeHead(404); res.end('Not found'); return;
        }
        spaFallback();
        return;
      }
      if (ext === '.html') { serveHtml(data); return; }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
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

server.listen(port, '0.0.0.0', () => {
  console.log(`IsotopeAI running on port ${port}`);
  if (SUPA_SERVICE_KEY) console.log('[RLS] Community proxy: service-role key active — full bypass');
  else                  console.log('[RLS] Community proxy: profile-upgrade mode (set SUPABASE_SERVICE_ROLE_KEY for full bypass)');
  if (GEMINI_API_KEY) console.log('Gemini API key: configured');
  if (GROQ_API_KEY)   console.log('Groq API key: configured');
});
