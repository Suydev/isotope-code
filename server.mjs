import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, 'public');
const port = process.env.PORT || 3000;

// ── MIME types ────────────────────────────────────────────────────────────────
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
};

// ── Startup health check ──────────────────────────────────────────────────────
// Warn on startup if critical files are missing so users get a clear message
// instead of a silent failure.
const REQUIRED_FILES = [
  'index.html',
  'public/sw.js',
  'public/assets/analyticsWorker-BnmTlfYB.js',
];

const missingFiles = REQUIRED_FILES.filter(
  f => !fs.existsSync(path.join(__dirname, f))
);

// ── AI key injection ──────────────────────────────────────────────────────────
// Set GEMINI_API_KEY and/or GROQ_API_KEY environment variables to enable AI
// features without using the in-app key manager.
// Keys are injected via a window.__IK__ Proxy that returns undefined when the
// browser is offline, automatically disabling AI calls without internet.
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

function injectKeys(htmlBuffer) {
  if (!KEY_SCRIPT) return htmlBuffer;
  const html = htmlBuffer.toString('utf8');
  return Buffer.from(html.replace('</head>', KEY_SCRIPT + '</head>'), 'utf8');
}

// Patch the AI store bundle so env-var keys bypass IndexedDB encryption.
const AI_STORE_ABS   = path.join(PUBLIC_DIR, 'assets', 'useAIStore-B2cv1FZz.js');
const AI_PATCH_FROM  = 'async getApiKey(n) {\n            const e = `ai_api_key_${n}`';
const AI_PATCH_TO    = 'async getApiKey(n) {\n            if(typeof window!=="undefined"&&window.__IK__&&window.__IK__[n])return window.__IK__[n];\n            const e = `ai_api_key_${n}`';

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
// ─────────────────────────────────────────────────────────────────────────────

const debugErrors = [];

const server = http.createServer((req, res) => {
  // ── Special API routes ──────────────────────────────────────────────────────
  if (req.method === 'POST' && req.url === '/debug-error') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      try { debugErrors.push(JSON.parse(body)); } catch {}
      res.writeHead(200); res.end('ok');
    });
    return;
  }

  if (req.method === 'GET' && req.url === '/debug-errors') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(debugErrors));
    return;
  }

  // AI config status (boolean only — never exposes raw key values)
  if (req.method === 'GET' && req.url === '/api/ai-config') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ gemini: !!GEMINI_API_KEY, groq: !!GROQ_API_KEY }));
    return;
  }

  // Health check for launchers
  if (req.method === 'GET' && req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      missingFiles,
      aiKeys: { gemini: !!GEMINI_API_KEY, groq: !!GROQ_API_KEY },
    }));
    return;
  }

  // ── URL parsing ─────────────────────────────────────────────────────────────
  let urlPath = req.url.split('?')[0];
  try { urlPath = decodeURIComponent(urlPath); } catch {}
  const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safePath);

  // ── Response headers ────────────────────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', '*');
  // same-origin-allow-popups lets the Document Picture-in-Picture API (Focus
  // timer PiP window) work correctly while still providing COOP protection.
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');

  // ── File serving helpers ────────────────────────────────────────────────────
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

    // Serve patched AI store when keys are configured
    if ((GEMINI_API_KEY || GROQ_API_KEY) && fp === AI_STORE_ABS) {
      const buf = getPatchedAiStore();
      if (buf) { res.writeHead(200, { 'Content-Type': contentType }); res.end(buf); return; }
    }

    fs.readFile(fp, (err, data) => {
      if (err) {
        // Static assets return 404 directly (no SPA fallback) so the app's
        // missing-file recovery logic can detect them instead of looping.
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
  const divider = '  ' + '─'.repeat(43);
  console.log('');
  console.log(divider);
  console.log('  ★  IsotopeAI is running!');
  console.log(divider);
  console.log('');
  console.log(`  ➜  Open in browser:  http://localhost:${port}`);
  console.log('');

  if (GEMINI_API_KEY) console.log('  ✓  Gemini API key configured (AI online-only)');
  if (GROQ_API_KEY)   console.log('  ✓  Groq API key configured   (AI online-only)');
  if (!GEMINI_API_KEY && !GROQ_API_KEY)
    console.log('  ℹ  No AI keys — use Settings → AI Features to add keys in-app');

  if (missingFiles.length > 0) {
    console.log('');
    console.log('  ⚠  WARNING: Some files are missing:');
    missingFiles.forEach(f => console.log(`     • ${f}`));
    console.log('     Re-download the ZIP from the releases page to fix this.');
  }

  console.log('');
  console.log('  ➜  Picture-in-Picture timer: requires Chrome 116+ or Edge 116+');
  console.log('  ➜  Install as app: Chrome → ⋮ → "Add to Home Screen"');
  console.log('');
  console.log('  Press Ctrl+C to stop');
  console.log(divider);
  console.log('');
});
