// Vercel serverless adapter for server.mjs.
//
// server.mjs is a long-running http server (http.createServer + listen). Vercel
// functions must export a request handler instead. This adapter intercepts
// http.createServer BEFORE server.mjs is imported, captures its request
// handler, fakes the listen lifecycle (the warm-up hooks registered in the
// listen callback run once per cold start), and re-exports the handler.
//
// Zero changes to server.mjs: it still validates env, builds its bundle-patch
// caches, and dispatches every route (static assets, patched bundles, auth,
// community, AI proxy) through the same code path it uses locally.
//
// Import specifiers are relative to THIS file (api/index.js), not to
// server.mjs — Vercel's bundler starts the module graph at api/index.js and
// would mis-resolve server.mjs's "./server/..." and "./public/..." imports
// after copying them into the bundle. Importing via absolute-from-root
// specifiers here keeps the bundler's copy of server.mjs anchored to
// <project-root>/server.mjs so its relative imports still resolve.
import http from 'http';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

let requestHandler = null;
const realCreateServer = http.createServer;

http.createServer = (handler) => {
  requestHandler = handler;
  return {
    listen(_port, _host, cb) {
      // Warm-up hooks are deferred to the listen callback so the port opens
      // immediately in a long-running process. In serverless there is no port;
      // running them here warms the patch caches once per cold start.
      if (typeof cb === 'function') cb();
      return { close() {}, on() {}, address() { return { port: 0 }; } };
    },
    on() {},
    once() {},
    close() {},
  };
};

try {
  await import(pathToFileURL(path.join(ROOT_DIR, 'server.mjs')).href);
} finally {
  http.createServer = realCreateServer;
}

if (!requestHandler) {
  throw new Error('[Vercel] server.mjs did not register a request handler');
}

export default function handler(req, res) {
  return requestHandler(req, res);
}
