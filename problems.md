# Isotope Code — Problems

Last verified: 2026-08-27 · Repo root: `isotope-code` · Served entry: `public/assets/index-D1Y5F8Lk.js`

**Status: the 2026-08-09 audit backlog is closed.** H1–H4, M1–M6 and L1–L3 are all
fixed and verified against the current tree. What remains open is L4–L7 below, all
accepted-risk or low-priority.

This file previously described those items as open, with line numbers from the
2026-08-09 tree. Following it verbatim would now *re-introduce* bugs — most
sharply H3, whose prescribed fix (`if (!isAdminAuthed(req))` on
`/api/update-now`) is exactly the regression that made the in-app Update button a
permanent 403 on every install running `ENABLE_ADMIN_MODE=false`. The historical
detail is kept below each heading for provenance; the **Status** line is
authoritative.

---

## Verification commands

Anchor health is now self-reporting: every patch logs on apply and warns on miss,
and misses are additionally collected into `_criticalPatchFailures`, which renders
a banner in served HTML. So the check is just "start the server and read the log".

```bash
# Zero output = every anchor matched.
bash bin/isotope restart && sleep 6
grep -iE 'anchor not found|String not found' ~/.isotope/logs/server.log

# What did apply (52 lines at time of writing).
grep -E '^\[[A-Za-z]+(Patch|CrashFix|KeyboardFix)' ~/.isotope/logs/server.log | sort -u

# Every patched bundle must return 200 and parse.
for f in useAIStore-DRa7CkEN App-CQ9mV4wu Auth-D0Y8CB1f Focus-B4gLsWoP \
         Onboarding-C0svxOgT SingleGroup-DU1IhoNK useLeaderboard-BpvH5FXA \
         SettingsLayout-DkuooNHv useSyncStore-Di0wBMnH AppAccessGate-DzNuNpuU \
         sessionSync-mloIEnTd useInvites-D9RLFwf8 Community-CEnEgsrd \
         communityApi-Ccw5N_9O CommunityHub-gANxZssO CommunityVisuals-mHr4KGyg \
         Dashboard-Dzf-IC_a Study-BXfkiHvM useNotificationStore-BTREori0 \
         usePWA-BOujtGOv marketing-core-DzcTqL0l useAuthStore-Aw1au7RF \
         index-D1Y5F8Lk; do
  T=$(mktemp)
  code=$(curl -s -o "$T" -w '%{http_code}' "http://127.0.0.1:3000/assets/$f.js")
  [ "$code" = 200 ] && node --check "$T" || echo "FAIL $f ($code)"
done

node --check server.mjs && node --check public/sw.js
```

Two invariants worth asserting after any bundle rebuild:

```bash
# 1. The two RUNTIME_PATCHED_ASSET_PATHS sets must be identical.
python3 - <<'PY'
import re
def s(p):
    m = re.search(r'RUNTIME_PATCHED_ASSET_PATHS\s*=\s*new Set\(\[(.*?)\]\)',
                  open(p, encoding='utf8').read(), re.S)
    return set(re.findall(r"'([^']+)'", m.group(1)))
a, b = s('server.mjs'), s('public/sw.js')
print('IN SYNC' if a == b else f'OUT OF SYNC\n  server only: {sorted(a-b)}\n  sw only: {sorted(b-a)}')
PY

# 2. Every *_ABS asset the server patches must be in that set, or it ships immutable.
```

---

# CRITICAL / HIGH — all closed

## H1. Patch anchors targeted the OLD build — 5 patches silently dead
**Status: ✅ FIXED.** All anchors match. `grep -iE 'anchor not found|String not found'`
on a fresh server log returns nothing, and 52 patches report applied.

Re-anchoring happened in stages. The last two were fixed 2026-08-27 and are worth
recording because they shared a root cause: the anchor was written against
*pretty-printed* source while the shipped bundle is minified.

| Anchor | Was | Is |
|---|---|---|
| `STUDY_SYLLABUS_FROM` | `Y.filter((m) => I.syllabusIds.includes(...))` | `Y.filter(m=>I.syllabusIds.includes(...))` |
| Onboarding completion | `a({\n  currentStep: 7\n}), await r({...})` | `a({currentStep:C}),await r({...})` |

`APP_DEMO_FROM` and `CB_FROM` no longer exist under those names — the demo gate and
circuit breaker both moved into `useAuthStore-Aw1au7RF.js` and are now
`DEMO_GATE_FROM` / `CB_FROM` inside `getPatchedAuthStoreBundle()`.
`COMMUNITY_FEATURE_RENDER_FROM` became obsolete (the current Community bundle has
no store/events feature switch); the removal is handled by
`COMMUNITY_HUB_CARDS_FROM` against `CommunityHub-gANxZssO.js` instead.

**Lesson, applied:** anchors were failing silently. Each patch now logs on apply,
warns on miss, and pushes to `_criticalPatchFailures` so a miss surfaces in the UI
rather than only in a log nobody reads. `StudyPatch` additionally counts hits
instead of re-testing `raw.includes(FROM)` after the replace — that bug made it
warn even on success.

## H2. `/__supa/*` proxy exposed the Supabase service-role key
**Status: ✅ FIXED.** `handleSupabaseProxy` gates escalation on
`const useServiceKey = ADMIN_MODE_READY && isAdminAuthed(req);`. Non-admin callers
are forwarded with their own `Authorization` header plus the anon key.

## H3. `/api/update-now` spawned a shell command without auth
**Status: ✅ FIXED — but NOT with the fix originally prescribed here.**

The original prescription was `if (!isAdminAuthed(req)) return 401`. That closes
the hole but breaks the feature: `ADMIN_MODE_READY` requires
`ENABLE_ADMIN_MODE=true` **and** a service-role key, which a normal self-hosted
install has neither of. The button became a permanent 403 with a redirect to a
login page that was itself disabled.

Current design authorizes on **admin cookie OR loopback**:

- `isLoopbackRequest(req)` returns true only when `req.socket.remoteAddress` is
  `127.0.0.1`/`::1`, **and** no `x-forwarded-for` / `x-forwarded-host` header is
  present — any proxy in front means the real client is elsewhere, so we refuse.
- LAN and remote callers still get 403, with `admin_available` in the body so the
  UI only offers admin unlock when unlock can actually work.

`isotope update` is a local `git pull`; the operator at the machine is precisely
who should be allowed to run it.

**Additionally**, because `git pull` auto-stashes a dirty tree, a bare POST now
returns **409 `confirmation_required`** with `dirty_count` when
`git status --porcelain` is non-empty. `?confirm=1` proceeds. `GET
/api/update-status` reports `{authorized, admin_available, dirty, dirty_count,
dirty_files, branch}` so the pill can warn *before* acting. This was added after
a test run silently stashed 15 modified files.

## H4. Client-side premium escalation via self-PATCH
**Status: ✅ ACCEPTED (owner-approved), documented at `server.mjs:2413-2416`.**
This install intentionally grants itself `plan_type='ranker'`. Not a defect here.

---

# MEDIUM — all closed

## M1. Unhandled promise rejections from `readReqBody(...).then(...)`
**Status: ✅ FIXED.** All eight chains have `.catch()`.

## M2. index.html loaded STALE build assets
**Status: ✅ FIXED.** Now `index-LkPKl--4.css` and `vendor-react-BWKHxYQy.js`.

## M3. `public/focus-bg-import.js` referenced a stale focusBackground chunk
**Status: ✅ FIXED.** Now `focusBackground-Dc8Rc9XQ.js`.

## M4. Unguarded `localStorage.removeItem` could abort app boot
**Status: ✅ FIXED.** Both call sites wrapped in try/catch.

## M5. `public/manifest.webmanifest` — broken screenshot references
**Status: ✅ FIXED.** Points at `hero-dashboard.png` / `community.png`, both present.

## M6. Refresh tokens in plaintext localStorage
**Status: ✅ ACCEPTED (owner-approved), comment-only.**

---

# LOW

## L1. Dead builds accumulating in `public/assets`
**Status: ✅ FIXED (2026-08-10).**

## L2. Duplicate entry in `public/sw.js` `RUNTIME_PATCHED_ASSET_PATHS`
**Status: ✅ FIXED (2026-08-10).** See also L7 — the two sets drifted again later
and are now checked by an invariant.

## L3. Dead duplicate `public/manifest.json`
**Status: ✅ FIXED (2026-08-10).** Deleted; `manifest.webmanifest` is canonical.

## L4. Hardcoded fallback Supabase creds in source — OPEN (accepted)
`server.mjs:180-181` — `DEFAULT_SUPABASE_URL` and `DEFAULT_SUPABASE_ANON_KEY`.
Anon-scope only and deliberate: they let a downloaded copy reach shared cloud sync
with no setup. Low risk.

Note the secondary finding in the original entry **is fixed**:
`ADMIN_COOKIE_SECRET` no longer falls back to the service key. It is now
`ADMIN_SECRET || crypto.randomBytes(32).toString('hex')` (`server.mjs:241`), so an
unconfigured install gets a random per-boot secret instead of reusing a credential.

## L5. `/api/ai-config` discloses which AI providers are configured — OPEN (minor)
`server.mjs:6839-6843` returns `{gemini: bool, groq: bool}` unauthenticated. No key
material. Restrict to authenticated callers if it ever matters.

## L6. `POST /__errors` is an unauthenticated append-only log sink — OPEN (minor)
`server.mjs:6600`. Appends caller-supplied JSON to
`~/.isotope/logs/browser-errors.log`. 1 MB cap per request, but no rate limit and
no ceiling on total file size. Local-only surface; worth a cap if the server is
ever LAN-exposed.

## L7. Two copies of `RUNTIME_PATCHED_ASSET_PATHS` — OPEN (structural)
The set lives in both `server.mjs` and `public/sw.js` and must stay identical; they
have drifted twice. Both are correct and in sync as of 2026-08-27 (25 entries), and
the stale `/assets/PWAManager-CUuXr3sv.js` entry is gone from `server.mjs`.

The failure mode is quiet and expensive: a serve-time-patched asset missing from
the set matches `isHashedStaticAsset()` and ships
`Cache-Control: public, max-age=31536000, immutable`, so browsers pin the
*unpatched* body for a year. This is what produced the recurring community black
screens. Mitigated — `sw.js` cache names now include a `BUILD_TOKEN` digest of
VERSION + `server.mjs` mtime, so editing a patch rotates the cache — but a single
generated source of truth would remove the class entirely.

---

# CHECKED / CLEAN
- No TODO/FIXME/HACK markers.
- No SQL string-concatenation injection. `community_discover_groups` was
  parameterised with `quote_literal()` and escaped LIKE operands.
- All 27 `*_BUNDLE_ABS` / `*_ABS` target files exist.
- Both `RUNTIME_PATCHED_ASSET_PATHS` sets identical, and every `*_ABS` asset the
  server patches is present in them.
- `node --check` clean across `server.mjs`, `public/sw.js`, `server/backup-manager.mjs`,
  both `public/sync/*`, the 7 runtime glue scripts, and all 17 `scripts/*.mjs`.
- `bash -n` clean across all 9 shell scripts.
- `test:auth-bridge`, `prove-runtime-glue`, `validate-docs` (34 checks, 0 errors),
  and the CI backup-normalizer smoke all pass.
- Dollar-quote delimiters balanced in every `*.sql` and `sql/*.sql` (now gated in
  `schema-lint.yml` — a stray `$$;` in `isotope-complete.sql` had been silently
  truncating every function after line 1305).
- `pwa-local.js`, `update-checker.js`, `boot-recovery.js`: storage guarded, no XSS
  vectors in banners.
- `src/components` (shadcn/ui scaffold): no missing keys, no hooks in conditionals;
  the only `dangerouslySetInnerHTML` is `src/components/ui/chart.tsx:79`
  (component config only).

# SCAFFOLD NOTE (not a shipped app issue)
`src/` is a Vite/React shadcn scaffold. The app actually served is the pre-built
bundle set in `public/assets/`, patched at serve time by `server.mjs`. Editing
`src/` has no effect on what users get.
