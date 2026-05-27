import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, 'public');
const STATE_FILE = path.join(__dirname, 'state.json');
const port = process.env.PORT || 3000;

// ── State persistence — survives terminal restarts ──────────────────────────
function readState() {
  try { return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); } catch { return {}; }
}
function writeState(patch) {
  const merged = Object.assign({}, readState(), patch, { updatedAt: Date.now() });
  fs.writeFileSync(STATE_FILE, JSON.stringify(merged, null, 2), 'utf8');
  return merged;
}

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

const debugErrors = [];

const server = http.createServer((req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' });
    res.end(); return;
  }

  // ── Heartbeat ──────────────────────────────────────────────────────────
  if (req.method === 'GET' && req.url === '/api/ping') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ ok: true, ts: Date.now() })); return;
  }

  // ── State GET ──────────────────────────────────────────────────────────
  if (req.method === 'GET' && req.url === '/api/state') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(readState())); return;
  }

  // ── State POST — merge timer state + localStorage into state.json ──────
  if (req.method === 'POST' && (req.url === '/api/state' || req.url === '/state')) {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      try {
        const saved = writeState(JSON.parse(body));
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ ok: true, savedAt: saved.updatedAt }));
      } catch(e) { res.writeHead(400); res.end(JSON.stringify({ error: 'Bad JSON' })); }
    }); return;
  }

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

  // Parse URL and strip query string
  let urlPath = req.url.split('?')[0];
  
  // Decode URI
  try { urlPath = decodeURIComponent(urlPath); } catch(e) {}

  // Security: prevent directory traversal
  const safePath = path.normalize(urlPath).replace(/^(\.\.[\/\\])+/, '');
  
  let filePath = path.join(PUBLIC_DIR, safePath);

  // CORS + cache headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  // Assets → cacheable for 1 day; HTML → no-store (SPA routing)
  const reqExt = path.extname(urlPath).toLowerCase();
  const isAsset = ['.js','.css','.woff2','.woff','.ttf','.png','.svg','.ico','.webp','.jpg','.jpeg'].includes(reqExt);
  res.setHeader('Cache-Control', isAsset ? 'public, max-age=86400' : 'no-store, no-cache, must-revalidate');
  if (!isAsset) res.setHeader('Pragma', 'no-cache');

  const serveFile = (fp) => {
    const ext = path.extname(fp).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    
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
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(indexData);
        });
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
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
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
  console.log('  ➜  Install as PWA (Android):');
  console.log('     Chrome → ⋮ → "Add to Home Screen"');
  console.log('');
  console.log('  ➜  State auto-saved → state.json (timer survives restarts)');
  console.log('');
  console.log('  Press Ctrl+C to stop');
  console.log('');
});
