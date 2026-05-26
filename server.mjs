import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, 'public');
const port = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.webp': 'image/webp',
  '.txt': 'text/plain',
};

// ── AI key injection ──────────────────────────────────────────────────────────
// Read API keys from env vars at startup.  Keys are only injected into the app
// when they are present; when absent the app falls back to its built-in key
// management UI.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GROQ_API_KEY   = process.env.GROQ_API_KEY   || '';

// Build the <script> tag injected into every HTML response.
// The Proxy makes window.__IK__[key] return undefined when the browser is
// offline so that the app disables AI features automatically.
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

// Inject KEY_SCRIPT before </head> in an HTML buffer.
function injectKeys(htmlBuffer) {
  if (!KEY_SCRIPT) return htmlBuffer;
  const html = htmlBuffer.toString('utf8');
  const patched = html.replace('</head>', KEY_SCRIPT + '</head>');
  return Buffer.from(patched, 'utf8');
}

// The AI store bundle path (relative to PUBLIC_DIR) and the patch we apply.
// We insert a window.__IK__ check at the top of getApiKey() so env-var keys
// are used without touching IndexedDB encryption.
const AI_STORE_REL = '/assets/useAIStore-B2cv1FZz.js';
const AI_STORE_ABS = path.join(PUBLIC_DIR, 'assets', 'useAIStore-B2cv1FZz.js');

const AI_PATCH_FROM = 'async getApiKey(n) {\n            const e = `ai_api_key_${n}`';
const AI_PATCH_TO   = 'async getApiKey(n) {\n            if(typeof window!=="undefined"&&window.__IK__&&window.__IK__[n])return window.__IK__[n];\n            const e = `ai_api_key_${n}`';

// Cache the patched bundle so we only do string-replace once.
let patchedAiStore = null;
function getPatchedAiStore() {
  if (patchedAiStore) return patchedAiStore;
  try {
    const raw = fs.readFileSync(AI_STORE_ABS, 'utf8');
    const patched = raw.includes(AI_PATCH_FROM)
      ? raw.replace(AI_PATCH_FROM, AI_PATCH_TO)
      : raw;
    patchedAiStore = Buffer.from(patched, 'utf8');
  } catch {
    patchedAiStore = null;
  }
  return patchedAiStore;
}

// Pre-warm the patch cache at startup.
if (GEMINI_API_KEY || GROQ_API_KEY) getPatchedAiStore();
// ─────────────────────────────────────────────────────────────────────────────

const debugErrors = [];

const server = http.createServer((req, res) => {
  // Debug error collection endpoint
  if (req.method === 'POST' && req.url === '/debug-error') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      try {
        const err = JSON.parse(body);
        debugErrors.push(err);
        console.log('[DEBUG ERROR]', JSON.stringify(err));
      } catch(e) {}
      res.writeHead(200);
      res.end('ok');
    });
    return;
  }
  if (req.method === 'GET' && req.url === '/debug-errors') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(debugErrors));
    return;
  }

  // AI config status endpoint (boolean only — never exposes raw key values)
  if (req.method === 'GET' && req.url === '/api/ai-config') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
      gemini: !!GEMINI_API_KEY,
      groq:   !!GROQ_API_KEY,
    }));
    return;
  }

  // Parse URL and strip query string
  let urlPath = req.url.split('?')[0];
  
  // Decode URI
  try { urlPath = decodeURIComponent(urlPath); } catch(e) {}

  // Security: prevent directory traversal
  const safePath = path.normalize(urlPath).replace(/^(\.\.[\/\\])+/, '');
  
  let filePath = path.join(PUBLIC_DIR, safePath);

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  // Prevent caching during development
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');

  const serveHtml = (htmlBuffer) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(injectKeys(htmlBuffer));
  };

  const serveFile = (fp) => {
    const ext = path.extname(fp).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Serve patched AI store bundle when keys are configured
    if ((GEMINI_API_KEY || GROQ_API_KEY) && fp === AI_STORE_ABS) {
      const buf = getPatchedAiStore();
      if (buf) {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(buf);
        return;
      }
    }
    
    fs.readFile(fp, (err, data) => {
      if (err) {
        // For JS modules, try to return 404 rather than falling through to index
        if (ext === '.js' || ext === '.css' || ext === '.png' || ext === '.svg') {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
        // SPA fallback - serve index.html
        const indexPath = path.join(__dirname, 'index.html');
        fs.readFile(indexPath, (err2, indexData) => {
          if (err2) { res.writeHead(500); res.end('Server error'); return; }
          serveHtml(indexData);
        });
        return;
      }

      if (ext === '.html') {
        serveHtml(data);
        return;
      }

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  };

  // Check if it's a directory - serve index.html from it if exists
  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isDirectory()) {
      const indexInDir = path.join(filePath, 'index.html');
      fs.access(indexInDir, fs.constants.F_OK, (e) => {
        if (!e) serveFile(indexInDir);
        else {
          // SPA fallback
          const indexPath = path.join(__dirname, 'index.html');
          fs.readFile(indexPath, (err2, data) => {
            if (err2) { res.writeHead(500); res.end('Server error'); return; }
            serveHtml(data);
          });
        }
      });
    } else {
      serveFile(filePath);
    }
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log('');
  console.log('  ★  IsotopeAI is running!');
  console.log('');
  console.log(`  ➜  Open in browser:  http://localhost:${port}`);
  console.log('');
  if (GEMINI_API_KEY) console.log('  ✓  Gemini API key configured');
  if (GROQ_API_KEY)   console.log('  ✓  Groq API key configured');
  if (!GEMINI_API_KEY && !GROQ_API_KEY) {
    console.log('  ℹ  No AI keys set — AI features will use the in-app key manager');
  }
  console.log('');
  console.log('  ➜  Install as app (Android):');
  console.log('     Chrome → ⋮ → "Add to Home Screen"');
  console.log('');
  console.log('  Press Ctrl+C to stop');
  console.log('');
});
