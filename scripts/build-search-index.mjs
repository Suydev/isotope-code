/**
 * Build the documentation search index.
 * ──────────────────────────────────────────────────────────────────────────────
 *   node scripts/build-search-index.mjs
 *
 * Writes docs/assets/search-index.json.
 *
 * Why a build step rather than runtime indexing
 * ---------------------------------------------
 * The search bar has to find text on pages the reader is not currently on. A
 * browser cannot read 22 HTML files without 22 requests, and doing that on
 * keystroke would be absurd — so the text is extracted once, here, and shipped
 * as one small JSON file.
 *
 * Why sections rather than pages
 * ------------------------------
 * "Find the page containing iOS" is much less useful than "take me to the
 * paragraph about iOS". The index is therefore keyed on `<h2 id>` / `<h3 id>`
 * boundaries, so every hit carries an anchor. Content before the first heading
 * is attributed to the page itself, since there is nothing to link to.
 *
 * Run from CI (see ci.yml) so the index cannot drift from the pages.
 * ──────────────────────────────────────────────────────────────────────────────
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const DOCS = 'docs';
const OUT = join(DOCS, 'assets', 'search-index.json');

/** Strip markup and decode the entities the pages actually use. */
function toText(html) {
  return html
    // Elements whose text is not prose. Dropping code blocks entirely would
    // lose real search terms — `BLOCKED_EMPTY_OVERWRITE` only exists inside a
    // <pre> — so they are kept, but SVG and script content is discarded.
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    // The anchor glyph beside every heading would otherwise appear in snippets.
    .replace(/<a class="anchor"[\s\S]*?<\/a>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&middot;/g, '·')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '…')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const pages = readdirSync(DOCS).filter(f => f.endsWith('.html'));
const entries = [];

for (const file of pages) {
  const html = readFileSync(join(DOCS, file), 'utf8');

  const title = (html.match(/<title>([^<]*)<\/title>/) || [, file])[1]
    .replace(/\s*—\s*IsotopeAI docs?$/, '')
    .trim();

  const main =
    (html.match(/<main[^>]*class="content"[^>]*>([\s\S]*?)<\/main>/) ||
     html.match(/<main[^>]*>([\s\S]*?)<\/main>/) || [, ''])[1];
  if (!main) continue;

  // Split so each chunk begins with the heading that owns it.
  const parts = main.split(/(<h[23][^>]*\bid="[^"]+"[^>]*>)/);

  // Everything before the first heading: the lead paragraph and intro callouts.
  const intro = toText(parts[0]);
  if (intro.length > 40) {
    entries.push({ f: file, t: title, h: '', s: title, x: intro });
  }

  for (let i = 1; i < parts.length; i += 2) {
    const open = parts[i];
    const rest = parts[i + 1] || '';
    const id = (open.match(/\bid="([^"]+)"/) || [, ''])[1];
    const level = open.charAt(2);
    // The heading's own text, minus the anchor glyph.
    const heading = toText(open + rest.split(/<\/h[23]>/)[0]);
    const bodyText = toText(rest.replace(/^[\s\S]*?<\/h[23]>/, ''));
    if (!id) continue;
    entries.push({
      f: file,
      t: title,
      h: id,
      s: heading,
      // Cap the stored text. Sections run long, and a search index is not an
      // archive — 1200 characters is enough to match on and to excerpt from.
      x: bodyText.slice(0, 1200),
      d: level === '3' ? 1 : 0,   // depth, for indenting results
    });
  }
}

const json = JSON.stringify({ built: new Date().toISOString(), n: entries.length, e: entries });
writeFileSync(OUT, json);

const kb = (json.length / 1024).toFixed(1);
console.log(`search index: ${entries.length} sections across ${pages.length} pages → ${OUT} (${kb} KB)`);

// A silently empty index would make search look broken rather than fail loudly.
if (entries.length < 50) {
  console.error(`Only ${entries.length} sections indexed — expected 150+. Did the page markup change?`);
  process.exit(1);
}
