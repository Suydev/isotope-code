// Minimal static file server for previewing the prebuilt www/ bundle.
// Used only for local UI inspection/debugging, not part of the app build.
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "www");
const PORT = process.env.PORT || 5000;

// --- Dev-only auth helper -----------------------------------------------
// GET /dev-login: signs in with a test account (email query param + PASS
// secret from env, never logged/echoed) via the Supabase Auth REST API,
// then returns a tiny HTML page that seeds the supabase-js localStorage
// session and redirects to "/". Local debugging only; not used by the
// built app or CI.
const SUPABASE_URL = "https://vteqquoqvksshmfhuepu.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0ZXFxdW9xdmtzc2htZmh1ZXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwODU2NzUsImV4cCI6MjA5NTY2MTY3NX0.ZkRislOhJRQUjVa1y5ixu-xBhlgkXWWyZKI_CClWj64";
const SUPABASE_REF = "vteqquoqvksshmfhuepu";

function handleDevLogin(req, res) {
  const params = new URL(req.url, "http://localhost").searchParams;
  const email = params.get("email");
  const password = process.env.PASS;
  if (!email || !password) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    return res.end("Missing email query param or PASS secret");
  }
  const body = JSON.stringify({ email, password });
  const reqUrl = new URL(`${SUPABASE_URL}/auth/v1/token?grant_type=password`);
  const proxyReq = https.request(
    {
      hostname: reqUrl.hostname,
      path: reqUrl.pathname + reqUrl.search,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
        apikey: SUPABASE_ANON_KEY,
      },
    },
    (proxyRes) => {
      let raw = "";
      proxyRes.on("data", (c) => (raw += c));
      proxyRes.on("end", () => {
        let json;
        try {
          json = JSON.parse(raw);
        } catch {
          console.log("[dev-login] non-JSON response, status=" + proxyRes.statusCode + " body=" + raw.slice(0, 500));
          res.writeHead(502, { "Content-Type": "text/plain" });
          return res.end("Bad response from Supabase auth (status " + proxyRes.statusCode + ")");
        }
        if (!json.access_token) {
          res.writeHead(401, { "Content-Type": "text/plain" });
          return res.end("Login failed: " + (json.error_description || json.msg || "unknown error"));
        }
        const session = {
          access_token: json.access_token,
          token_type: json.token_type || "bearer",
          expires_in: json.expires_in,
          expires_at: Math.floor(Date.now() / 1000) + (json.expires_in || 3600),
          refresh_token: json.refresh_token,
          user: json.user,
        };
        const sessionRaw = JSON.stringify(session);
        const redirectTo = params.get("to") || "/";
        const html = `<!doctype html><html><body>Signing in...<script>
try {
  var raw = ${JSON.stringify(sessionRaw)};
  localStorage.setItem("isotope-auth-token", raw);
  localStorage.setItem(${JSON.stringify(`sb-${SUPABASE_REF}-auth-token`)}, raw);
  localStorage.setItem("isotope-last-jwt", ${JSON.stringify(session.access_token)});
  localStorage.setItem("isotope-last-rt", ${JSON.stringify(session.refresh_token || "")});
  localStorage.setItem("isotope-last-session-raw", raw);
} catch (e) {}
window.location.href = ${JSON.stringify(redirectTo)};
</script></body></html>`;
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(html);
      });
    }
  );
  proxyReq.on("error", (e) => {
    res.writeHead(502, { "Content-Type": "text/plain" });
    res.end("Proxy error: " + e.message);
  });
  proxyReq.write(body);
  proxyReq.end();
}

// Dev-only: spoof Capacitor presence so android-bridge.js's `isAndroid`
// check activates its /__auth/* interception layer (handleBootstrap(),
// handleLogin(), etc.) exactly as it does in the real packaged app —
// otherwise the bridge is a no-op in a plain desktop browser and boot
// state falls through to SYNC_FAILED for lack of __ISO_SUPA_URL__/__ISO_ANON__.
const CAPACITOR_SPOOF = `<script>
window.Capacitor = window.Capacitor || {};
window.addEventListener('error', function(e){
  try { console.error('[dev-diag] error: ' + (e.error && (e.error.stack || e.error.message) || e.message)); } catch(_){}
});
window.addEventListener('unhandledrejection', function(e){
  try {
    var r = e.reason;
    var msg = r && (r.stack || r.message) || (typeof r === 'object' ? JSON.stringify(r) : String(r));
    console.error('[dev-diag] unhandledrejection: ' + msg);
  } catch(_){}
});
</script>`;
function injectCapacitorSpoof(html) {
  const str = html.toString("utf8");
  if (str.includes("<head>")) return str.replace("<head>", "<head>" + CAPACITOR_SPOOF);
  return CAPACITOR_SPOOF + str;
}

const MIME = {
  ".html": "text/html", ".js": "application/javascript", ".css": "text/css",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".webp": "image/webp",
  ".woff": "font/woff", ".woff2": "font/woff2", ".ttf": "font/ttf",
  ".ico": "image/x-icon", ".mp3": "audio/mpeg", ".wasm": "application/wasm",
};

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/dev-login") return handleDevLogin(req, res);
  let filePath = path.join(ROOT, urlPath);
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); return res.end("Forbidden"); }
  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isDirectory()) filePath = path.join(filePath, "index.html");
    fs.readFile(filePath, (err2, data) => {
      if (err2) {
        // SPA fallback
        return fs.readFile(path.join(ROOT, "index.html"), (err3, html) => {
          if (err3) { res.writeHead(404); return res.end("Not found"); }
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(injectCapacitorSpoof(html));
        });
      }
      const ext = path.extname(filePath);
      res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
      res.end(ext === ".html" ? injectCapacitorSpoof(data) : data);
    });
  });
}).listen(PORT, "0.0.0.0", () => console.log(`Static preview server on :${PORT}`));
