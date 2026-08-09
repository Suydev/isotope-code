---
name: GitHub Actions workflow action versions
description: Correct action versions for isotope-apk android.yml — previous versions were all invalid
---

## Problem
.github/workflows/android.yml used non-existent action versions:
- actions/checkout@v7 (latest is v4)
- actions/setup-node@v6 (latest is v4)
- actions/setup-java@v5 (latest is v4)
- actions/upload-artifact@v7 (latest is v4)
- android-actions/setup-android@v4 (latest is v3)

**Why they were wrong:** These versions simply don't exist on GitHub Marketplace. CI would fail on every action step.

## Correct versions (as of 2026-07)
| Action | Use |
|--------|-----|
| actions/checkout | @v4 |
| actions/setup-node | @v4 |
| actions/setup-java | @v4 |
| actions/upload-artifact | @v4 |
| android-actions/setup-android | @v3 |

Fixed with `sed -i` across all occurrences in both debug and release jobs.
