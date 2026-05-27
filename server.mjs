import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, 'public');
const STATE_FILE = path.join(__dirname, 'state.json');
const LOG_FILE   = path.join(__dirname, 'server-verbose.log');
const port = process.env.PORT || 3000;

// ── Verbose logger ──────────────────────────────────────────────────────────
const logLines = [];
function vlog(level, ...args) {
  const ts   = new Date().toISOString();
  const line = `[${ts}] [${level}] ${args.join(' ')}`;
  console.log(line);
  logLines.push(line);
  if (logLines.length > 2000) logLines.shift();
  try { fs.appendFileSync(LOG_FILE, line + '\n'); } catch (_) {}
}
function info(...a)  { vlog('INFO ', ...a); }
function warn(...a)  { vlog('WARN ', ...a); }
function error(...a) { vlog('ERROR', ...a); }
function debug(...a) { vlog('DEBUG', ...a); }

// ── Start-up self-audit (verbose) ───────────────────────────────────────────
function startupAudit() {
  info('=== IsotopeAI Offline Server — startup audit ===');
  info(`PORT=${port}  NODE_ENV=${process.env.NODE_ENV || 'development'}`);
  info(`PUBLIC_DIR=${PUBLIC_DIR}`);
  info(`STATE_FILE=${STATE_FILE}`);

  // Verify critical files
  const critical = [
    // root-level files (served by SPA fallback logic)
    { rel: 'index.html',             base: __dirname },
    // public/ files
    { rel: 'sw.js',                  base: PUBLIC_DIR },
    { rel: 'offline-patches.js',     base: PUBLIC_DIR },
    { rel: 'liquid-glass.css',       base: PUBLIC_DIR },
    { rel: 'boot-recovery.js',       base: PUBLIC_DIR },
    { rel: 'restore-and-launch.js',  base: PUBLIC_DIR },
    { rel: 'manifest.webmanifest',   base: PUBLIC_DIR },
    { rel: 'workbox-1d81fbea.js',    base: PUBLIC_DIR },
    { rel: 'assets/index-BPYJFSVW.js',        base: PUBLIC_DIR },
    { rel: 'assets/index-CrO6t5EW.css',       base: PUBLIC_DIR },
    { rel: 'assets/vendor-react-BfU3Zn2J.js', base: PUBLIC_DIR },
    { rel: 'assets/vendor-katex-ASjZcBK0.css',base: PUBLIC_DIR },
  ];

  let missing = 0;
  for (const { rel: f, base } of critical) {
    const fp = path.join(base, f);
    if (fs.existsSync(fp)) {
      const sz = fs.statSync(fp).size;
      debug(`  ✓  ${f}  (${(sz / 1024).toFixed(1)} KB)`);
    } else {
      error(`  ✗  MISSING: ${f}`);
      missing++;
    }
  }

  // Count assets
  try {
    const assets = fs.readdirSync(path.join(PUBLIC_DIR, 'assets'));
    info(`Assets directory: ${assets.length} files`);
  } catch (e) {
    error(`Cannot read assets/ directory: ${e.message}`);
    missing++;
  }

  // State file
  try {
    const st = readState();
    info(`State file: OK (updatedAt=${st.updatedAt || 'never'})`);
  } catch (e) {
    warn(`State file not yet created (will be created on first POST /api/state)`);
  }

  if (missing === 0) {
    info('=== All critical files present. Server ready. ===');
  } else {
    error(`=== ${missing} critical file(s) MISSING — app may not load correctly ===`);
  }
}

// ── State persistence ───────────────────────────────────────────────────────
function readState() {
  try { return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); } catch { return {}; }
}
function writeState(patch) {
  const merged = Object.assign({}, readState(), patch, { updatedAt: Date.now() });
  fs.writeFileSync(STATE_FILE, JSON.stringify(merged, null, 2), 'utf8');
  return merged;
}

// ── MIME types ──────────────────────────────────────────────────────────────
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
};

// ── Debug error collection ──────────────────────────────────────────────────
const clientErrors = [];
const requestLog   = [];

// ── HTTP server ─────────────────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  const start = Date.now();
  const reqId = Math.random().toString(36).slice(2, 8);

  // Intercept res.writeHead to capture status for logging
  const _writeHead = res.writeHead.bind(res);
  let capturedStatus = 200;
  res.writeHead = function(status, ...rest) {
    capturedStatus = status;
    return _writeHead(status, ...rest);
  };

  res.on('finish', () => {
    const dur = Date.now() - start;
    const logEntry = { ts: Date.now(), id: reqId, method: req.method, url: req.url, status: capturedStatus, ms: dur };
    requestLog.push(logEntry);
    if (requestLog.length > 500) requestLog.shift();

    const lvl = capturedStatus >= 500 ? 'ERROR'
              : capturedStatus >= 400 ? 'WARN '
              : 'INFO ';
    vlog(lvl, `[${reqId}] ${req.method} ${req.url} → ${capturedStatus} (${dur}ms)`);
  });

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end(); return;
  }

  // ── /api/ping ─────────────────────────────────────────────────────────────
  if (req.method === 'GET' && req.url === '/api/ping') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ ok: true, ts: Date.now(), uptime: process.uptime() }));
    return;
  }

  // ── /api/state GET ────────────────────────────────────────────────────────
  if (req.method === 'GET' && req.url === '/api/state') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(readState()));
    return;
  }

  // ── /api/state POST ───────────────────────────────────────────────────────
  if (req.method === 'POST' && (req.url === '/api/state' || req.url === '/state')) {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      try {
        const saved = writeState(JSON.parse(body));
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ ok: true, savedAt: saved.updatedAt }));
      } catch (e) {
        error(`[${reqId}] /api/state parse error: ${e.message}`);
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Bad JSON' }));
      }
    });
    return;
  }

  // ── /debug-error POST (client-side JS errors) ─────────────────────────────
  if (req.method === 'POST' && req.url === '/debug-error') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      try {
        const err = JSON.parse(body);
        clientErrors.push({ ...err, ts: Date.now() });
        if (clientErrors.length > 200) clientErrors.shift();
        error(`[CLIENT-JS] ${err.msg}  @ ${err.file}:${err.line}:${err.col}`);
        if (err.stack) error(`[CLIENT-STACK] ${err.stack}`);
      } catch (_) {}
      res.writeHead(200); res.end('ok');
    });
    return;
  }

  // ── /debug-errors GET (see collected client errors) ───────────────────────
  if (req.method === 'GET' && req.url === '/debug-errors') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ clientErrors, total: clientErrors.length }));
    return;
  }

  // ── /debug-log GET (verbose server request log) ───────────────────────────
  if (req.method === 'GET' && req.url === '/debug-log') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ requests: requestLog.slice(-100), serverLog: logLines.slice(-200) }));
    return;
  }

  // ── /debug-audit GET (re-run startup audit on demand) ────────────────────
  if (req.method === 'GET' && req.url === '/debug-audit') {
    // Run audit and collect output
    const auditLines = [];
    const origInfo  = info, origWarn = warn, origError = error, origDebug = debug;
    const audit = [];
    function _audit(lvl, ...a) { audit.push(`[${lvl.trim()}] ${a.join(' ')}`); vlog(lvl, ...a); }
    const tmpInfo  = (...a) => _audit('INFO ', ...a);
    const tmpWarn  = (...a) => _audit('WARN ', ...a);
    const tmpErr   = (...a) => _audit('ERROR', ...a);
    const tmpDebug = (...a) => _audit('DEBUG', ...a);

    // Run mini audit
    const critical = ['index.html','sw.js','offline-patches.js','liquid-glass.css',
      'boot-recovery.js','restore-and-launch.js','manifest.webmanifest',
      'assets/index-BPYJFSVW.js','assets/index-CrO6t5EW.css',
      'assets/vendor-react-BfU3Zn2J.js'];
    const result = { ok: [], missing: [] };
    for (const f of critical) {
      const fp = path.join(PUBLIC_DIR, f);
      if (fs.existsSync(fp)) result.ok.push(f);
      else result.missing.push(f);
    }
    try { result.assetCount = fs.readdirSync(path.join(PUBLIC_DIR, 'assets')).length; } catch (_) {}
    result.uptime = process.uptime();
    result.state  = readState();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result, null, 2));
    return;
  }

  // ── Static file serving ───────────────────────────────────────────────────
  let urlPath = req.url.split('?')[0];
  try { urlPath = decodeURIComponent(urlPath); } catch (_) {}

  const safePath = path.normalize(urlPath).replace(/^(\.\.[\/\\])+/, '');
  let filePath   = path.join(PUBLIC_DIR, safePath);

  // Common headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  const reqExt = path.extname(urlPath).toLowerCase();
  const isAsset = ['.js','.mjs','.css','.woff2','.woff','.ttf','.png','.svg','.ico','.webp','.jpg','.jpeg'].includes(reqExt);
  res.setHeader('Cache-Control', isAsset ? 'public, max-age=86400' : 'no-store, no-cache, must-revalidate');
  if (!isAsset) res.setHeader('Pragma', 'no-cache');

  const serveFile = (fp) => {
    const ext = path.extname(fp).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    fs.readFile(fp, (err, data) => {
      if (err) {
        if (ext === '.js' || ext === '.mjs' || ext === '.css' || ext === '.png' || ext === '.svg') {
          warn(`[${reqId}] 404 asset: ${fp}`);
          res.writeHead(404); res.end('Not found'); return;
        }
        // SPA fallback
        const indexPath = path.join(__dirname, 'index.html');
        debug(`[${reqId}] SPA fallback → index.html for: ${urlPath}`);
        fs.readFile(indexPath, (err2, indexData) => {
          if (err2) { error(`Cannot read index.html: ${err2.message}`); res.writeHead(500); res.end('Server error'); return; }
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(indexData);
        });
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  };

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isDirectory()) {
      const indexInDir = path.join(filePath, 'index.html');
      fs.access(indexInDir, fs.constants.F_OK, (e) => {
        if (!e) { serveFile(indexInDir); return; }
        const indexPath = path.join(__dirname, 'index.html');
        fs.readFile(indexPath, (err2, data) => {
          if (err2) { res.writeHead(500); res.end('Server error'); return; }
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(data);
        });
      });
    } else {
      serveFile(filePath);
    }
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log('');
  console.log('  ★  IsotopeAI Offline Server (verbose mode)');
  console.log('');
  console.log(`  ➜  http://localhost:${port}`);
  console.log(`  ➜  Verbose log: ${LOG_FILE}`);
  console.log(`  ➜  Debug API:   http://localhost:${port}/debug-log`);
  console.log(`  ➜  Audit:       http://localhost:${port}/debug-audit`);
  console.log(`  ➜  JS Errors:   http://localhost:${port}/debug-errors`);
  console.log('');
  startupAudit();
});

server.on('error', (e) => {
  error(`Server error: ${e.message}`);
  if (e.code === 'EADDRINUSE') {
    error(`Port ${port} already in use. Kill the existing process or change PORT.`);
    process.exit(1);
  }
});

process.on('uncaughtException',  (e) => error(`Uncaught exception: ${e.message}\n${e.stack}`));
process.on('unhandledRejection', (r) => error(`Unhandled rejection: ${r}`));
