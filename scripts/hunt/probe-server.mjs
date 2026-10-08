/**
 * probe-server.mjs — boot the real server.mjs in a child process on a private
 * port with a controlled env, so hunt tests can drive REAL handlers over HTTP.
 *
 * Usage:  const srv = await startProbe({ env }); ... srv.stop();
 */
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');

export async function startProbe({ env = {}, port = 3411, readyTimeoutMs = 15000 } = {}) {
  const child = spawn(process.execPath, ['server.mjs'], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(port), ...env },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let log = '';
  child.stdout.on('data', (d) => { log += d; });
  child.stderr.on('data', (d) => { log += d; });

  const base = `http://127.0.0.1:${port}`;
  const deadline = Date.now() + readyTimeoutMs;
  for (;;) {
    if (child.exitCode !== null) throw new Error(`server exited (${child.exitCode}):\n${log}`);
    try {
      const r = await fetch(base + '/api/ping', { cache: 'no-store' });
      if (r.status === 200) break;
    } catch { /* not up yet */ }
    if (Date.now() > deadline) throw new Error(`server did not come up in ${readyTimeoutMs}ms:\n${log}`);
    await new Promise((r) => setTimeout(r, 120));
  }
  return {
    base,
    port,
    get log() { return log; },
    async stop() {
      child.kill('SIGKILL');
      await new Promise((r) => child.on('exit', r));
    },
  };
}
