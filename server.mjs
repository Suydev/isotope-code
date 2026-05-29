import http from 'http';
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
  '.mov':   'video/quicktime',
  '.ogv':   'video/ogg',
  '.mkv':   'video/x-matroska',
};

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GROQ_API_KEY   = process.env.GROQ_API_KEY   || '';

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
// Injects window.__ISO_ORIGIN__ so the compiled App bundle uses the correct
// local server URL as the Supabase OAuth redirectTo.
// Requires http://localhost:<PORT> to be in Supabase's allowed redirect URLs.
const ORIGIN_SCRIPT = `<script>
(function(){
  // Set the OAuth redirect base to this server's actual origin.
  // The compiled App bundle uses: window.__ISO_ORIGIN__ || window.location.origin
  window.__ISO_ORIGIN__ = "http://localhost:${port}";
})();
</script>`;

function injectOrigin(html) {
  return html.replace('</head>', ORIGIN_SCRIPT + '</head>');
}


function injectKeys(htmlBuffer) {
  let html = htmlBuffer.toString('utf8');
  // Always inject origin (needed for OAuth redirect on local installs)
  html = injectOrigin(html);
  // Inject AI keys if configured
  if (KEY_SCRIPT) html = html.replace('</head>', KEY_SCRIPT + '</head>');
  return Buffer.from(html, 'utf8');
}

const AI_STORE_ABS  = path.join(PUBLIC_DIR, 'assets', 'useAIStore-B2cv1FZz.js');
const AI_PATCH_FROM = 'async getApiKey(n) {\n            const e = `ai_api_key_${n}`';
const AI_PATCH_TO   = 'async getApiKey(n) {\n            if(typeof window!=="undefined"&&window.__IK__&&window.__IK__[n])return window.__IK__[n];\n            const e = `ai_api_key_${n}`';

let patchedAiStore = null;
function getPatchedAiStore() {
  if (patchedAiStore) return patchedAiStore;
  try {
    const raw = fs.readFileSync(AI_STORE_ABS, 'utf8');
    patchedAiStore = Buffer.from(
      raw.includes(AI_PATCH_FROM) ? raw.replace(AI_PATCH_FROM, AI_PATCH_TO) : raw,
      'utf8'
    );
  } catch { patchedAiStore = null; }
  return patchedAiStore;
}

if (GEMINI_API_KEY || GROQ_API_KEY) getPatchedAiStore();

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

// Ambient sounds are pre-patched in the Focus bundle — no runtime replacement needed.

// Fix the Focus background URL validator so blob:/data: URLs are accepted,
// and route the prompt() call through our custom hook so focus-bg-patch.js
// can intercept it and show a file-picker + URL modal instead.
const URL_PATCHES = [
  // 1. Make sn() validator accept blob: and data: URLs (in addition to http/https)
  [
    'const S = sn(v);',
    'const S = /^(blob:|data:)/i.test(v)?v:sn(v);',
  ],
  // 2. Route the prompt() call through our custom function (set by focus-bg-patch.js)
  [
    'const v = prompt("Enter the URL of the image you want to use as background:");',
    'const v = (window.__isoBgP||prompt)("Enter the URL of the image you want to use as background:");',
  ],
  // 3. Suppress the "invalid URL" alert — it won't fire for blob URLs after fix #1
  //    but keep it silent for truly invalid entries (custom hook handles feedback)
  [
    'alert("Please enter a valid image URL starting with http:// or https://")',
    '(window.__isoBgInvalid||function(m){alert(m)})("Please enter a valid image URL starting with http:// or https://")',
  ],
];

let patchedFocusBundle = null;
function getPatchedFocusBundle() {
  if (patchedFocusBundle) return patchedFocusBundle;
  try {
    let raw = fs.readFileSync(FOCUS_BUNDLE_ABS, 'utf8');
    // Apply focus-background URL patches
    for (const [from, to] of URL_PATCHES) {
      if (raw.includes(from)) {
        raw = raw.split(from).join(to);
      } else {
        console.warn('[FocusPatch] String not found (bundle may have changed):', from.slice(0, 60));
      }
    }
    patchedFocusBundle = Buffer.from(PIP_POLYFILL + '\n' + raw, 'utf8');
  } catch { patchedFocusBundle = null; }
  return patchedFocusBundle;
}
getPatchedFocusBundle();

const appStateStore = { timerState: null, localStorage: {} };

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/api/ai-config') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ gemini: !!GEMINI_API_KEY, groq: !!GROQ_API_KEY }));
    return;
  }

  if (req.method === 'GET' && req.url === '/__isotope/ping') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, ts: Date.now() }));
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
    }));
    return;
  }

  let urlPath = req.url.split('?')[0];
  try { urlPath = decodeURIComponent(urlPath); } catch {}
  const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safePath);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
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
  if (GEMINI_API_KEY) console.log('Gemini API key: configured');
  if (GROQ_API_KEY)   console.log('Groq API key: configured');
  if (!GEMINI_API_KEY && !GROQ_API_KEY)
    console.log('No AI keys set. Use GEMINI_API_KEY / GROQ_API_KEY env vars.');
});
