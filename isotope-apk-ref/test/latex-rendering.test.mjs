import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
// Support both CI layout (../isotope-code) and local layout (./isotope-code)
const SOURCE_REPO = (() => {
  const nested = path.resolve(ROOT, 'isotope-code');
  if (fs.existsSync(nested)) return nested;
  return path.resolve(ROOT, '../isotope-code');
})();

function runPrepareWww() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'isotope-latex-www-'));
  const result = spawnSync(process.execPath, ['scripts/prepare-www.js'], {
    cwd: ROOT,
    env: {
      ...process.env,
      REPO_DIR: SOURCE_REPO,
      SOURCE_DIR: path.join(SOURCE_REPO, 'public'),
      WWW_DIR: tmp,
      BRIDGE_FILE: path.join(ROOT, 'android-bridge.js'),
      FLOATING_TIMER_BRIDGE_FILE: path.join(ROOT, 'android-floating-timer-bridge.js'),
    },
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  return tmp;
}

test('Android package resolves every KaTeX CSS font reference for offline LaTeX rendering', () => {
  const wwwDir = runPrepareWww();
  const html = fs.readFileSync(path.join(wwwDir, 'index.html'), 'utf8');
  const assetsDir = path.join(wwwDir, 'assets');
  const katexCssName = fs.readdirSync(assetsDir).find((name) => /^vendor-katex-.*\.css$/.test(name));

  assert.ok(katexCssName, 'vendor-katex CSS should be packaged');
  assert.match(html, new RegExp(`/assets/${katexCssName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));

  const css = fs.readFileSync(path.join(assetsDir, katexCssName), 'utf8');
  const refs = [...css.matchAll(/url\(([^)]+)\)/g)]
    .map((match) => match[1].trim().replace(/^['"]|['"]$/g, ''))
    .filter((ref) => ref && !ref.startsWith('data:'));
  const missing = refs.filter((ref) => {
    const relative = ref.startsWith('/assets/') ? ref.slice('/assets/'.length) : ref;
    return !fs.existsSync(path.join(assetsDir, relative));
  });

  assert.equal(missing.length, 0, `Missing KaTeX fonts:\n${missing.join('\n')}`);
  assert.ok(refs.length >= 50, 'KaTeX CSS should declare the expected font set');
});

test('Markdown renderer keeps LaTeX delimiters and KaTeX rendering plugins wired', () => {
  const wwwDir = runPrepareWww();
  const assetsDir = path.join(wwwDir, 'assets');
  const rendererName = fs.readdirSync(assetsDir).find((name) => /^MarkdownRendererContent-.*\.js$/.test(name));
  assert.ok(rendererName, 'MarkdownRendererContent chunk should exist');

  const renderer = fs.readFileSync(path.join(assetsDir, rendererName), 'utf8');
  assert.match(renderer, /vendor-katex-.*\.js/);
  assert.match(renderer, /replace\(\/\\\\\\\[\/g/);
  assert.match(renderer, /replace\(\/\\\\\\\(\/g/);
  assert.match(renderer, /e\.push\(z\)/);
  assert.match(renderer, /r\?\[v\]:\[\]/);
});
