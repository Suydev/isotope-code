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
  console.log('  ➜  Install as app (Android):');
  console.log('     Chrome → ⋮ → "Add to Home Screen"');
  console.log('');
  console.log('  Press Ctrl+C to stop');
  console.log('');
});
