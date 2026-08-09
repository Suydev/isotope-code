---
name: Test SOURCE_REPO path resolution
description: All isotope-apk test files must resolve isotope-code path dynamically
---

## Problem
Three test files hardcoded `SOURCE_REPO = path.resolve(ROOT, '../isotope-code')`.
In CI this is correct (isotope-code is checked out as a sibling).
Locally (isotope-code cloned inside workspace), it resolves to a non-existent path → 12 test failures.

## Fix applied to all three files
```javascript
const SOURCE_REPO = (() => {
  const nested = path.resolve(ROOT, 'isotope-code');
  if (fs.existsSync(nested)) return nested;
  return path.resolve(ROOT, '../isotope-code');
})();
```

## Files updated
- test/prepare-patches.test.mjs
- test/floating-timer-native.test.mjs
- test/latex-rendering.test.mjs

**Result:** 47/47 tests pass locally with ./isotope-code; CI continues to work with ../isotope-code.
