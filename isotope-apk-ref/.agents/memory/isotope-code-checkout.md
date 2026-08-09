---
name: isotope-code checkout & KaTeX font gap
description: How to get a real isotope-code checkout working in this workspace, and a known real asset bug it revealed
---

## Cloning isotope-code into this workspace
- `isotope-code/` is already gitignored in isotope-apk's `.gitignore`, so cloning it directly into the workspace root (`./isotope-code`) is safe — it won't be committed.
- Tests resolve `SOURCE_REPO` by checking `./isotope-code` first, then falling back to `../isotope-code` — cloning at workspace root satisfies both local test runs and matches CI's nested-checkout expectation.
- Clone with the PAT: `git clone --depth 1 "https://${GITHUB_PAT}@github.com/Suydev/isotope-code.git" isotope-code`, then reset the remote URL to the plain HTTPS form (no embedded token) to avoid leaking it into `.git/config`.
- Once cloned, `npm test` goes from 50/62 pass (12 skipped/failing due to missing repo) to a **different, smaller real failure set** — the missing-repo failures were masking a real bug.

## Real bug this uncovered: missing KaTeX fonts — FIXED upstream
`isotope-code/public/assets/vendor-katex-*.css` referenced KaTeX_Size3, KaTeX_Size4, and KaTeX_Typewriter font files (woff/woff2/ttf, 8 files total) that did not exist anywhere in `public/assets/` at HEAD. Confirmed the exact katex npm version by sha256-matching an existing font file (`KaTeX_AMS-Regular`) against `npm pack katex` output — got a byte-identical match at katex@0.17.0, so the missing 8 files were copied from that package and renamed to the exact hashed filenames the CSS expects. Fixed and pushed to isotope-code main; pinned ref bumped in isotope-apk's `android.yml`/`release.yml`.

**Why this matters:** `scripts/prepare-www.js` Step 6b hard-fails (exit 1) when these fonts are missing, which cascades to fail ~10 unrelated downstream tests. When debugging APK build test failures, always check Step 6b's output first before assuming the failures are independent bugs.

**General technique:** when a build references a hashed static asset that's missing but the asset is a well-known third-party library file (fonts, polyfills, etc.), checksum-match an existing sibling file against the npm package to identify the exact version, then copy+rename the missing files rather than trying to rebuild/regenerate them.

## isotope-code has its own asset-diff tool
`npm run assets:compare` (scripts/compare-remote-assets.mjs) in isotope-code compares local `public/assets/` against the live `https://isotopeai.in/assets/` and writes `artifacts/asset-diff/summary.md`. Expect large "missing" counts even when nothing is broken — the live site redeploys continuously with new content hashes, so local vs. remote drift is normal and not itself a bug signal. Only trust *internal* consistency checks (like the KaTeX one) as real bugs.
