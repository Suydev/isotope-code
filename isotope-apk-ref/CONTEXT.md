# Context for Isotope-APK Rebuild

**Date:** 2026-08-12
**From:** Guide agent (opencode)
**For:** Builder agent (handling APK rebuild)

---

## What's Done

1. **FocusPatch anchors fixed** — `server.mjs` URL_PATCHES updated for new minified bundle (`sn(v)` → `pn(p)`, `const v` → `const p`). Commit: `18fee79`.

2. **prepare-www.js patched** — Fixed restore-and-launch.js patch target (try/catch wrapper around `localStorage.removeItem`). The script should now run clean.

3. **Server running** — `isotope start` on port 3000. All patches applied.

4. **Schema dump** — `sql/isotope-schema-restore.sql` (4244 lines, Aug 9). All SQL files listed below.

---

## SQL Files (Latest)

### sql/ (main repo)
| File | Lines | Description |
|------|-------|-------------|
| `isotope-schema-restore.sql` | 4244 | Full schema dump (Aug 9) |
| `009_community_hardening.sql` | 531 | Community features RLS |
| `v3.3.7-sync-schema.sql` | 133 | Sync schema |
| `006_security_policy_cleanup.sql` | 68 | Security policies |
| `verify-security.sql` | 68 | Security verification |
| `010_cleanup_group_members_rls.sql` | 72 | Group members RLS |
| `011_community_join_guard.sql` | 40 | Community join guard |
| `backup_manifests.sql` | 52 | Backup manifests |

### isotope-apk-ref/supabase/ (APK-specific)
| File | Lines | Description |
|------|-------|-------------|
| `013_fix_missing_grants_and_announcements_rls.sql` | 168 | Grants + announcements RLS |
| `013b_harden_rls_security.sql` | 167 | RLS hardening |
| `repair_invite_rpc_slug_contract.sql` | 122 | Invite RPC repair |
| `013c_consolidate_and_harden_rls.sql` | 96 | Consolidated RLS |
| `013d_add_missing_user_fks_and_profile_read.sql` | 93 | User FKs + profile read |
| `create_android_storage_buckets.sql` | 58 | Android storage buckets |
| `011_fix_rls_recursion.sql` | 3 | RLS recursion fix |
| `repair_android_community_api_grants.sql` | 8 | Community API grants |

---

## Build Commands

```bash
cd isotope-apk-ref
REPO_DIR=/data/data/com.termux/files/home/isotope-code node scripts/prepare-www.js
node scripts/apply-android-patches.js
npx cap sync android
cd android && ./gradlew assembleDebug --no-daemon
```

---

## Known Issues

1. **Update button showing** — The isotope app shows "update available" despite being latest. Root cause: stale web assets in `www/`. The rebuild with fresh assets should fix this.

2. **prepare-www.js patch target** — Was failing on restore-and-launch.js (try/catch wrapper). NOW FIXED in the script.

3. **apply-android-patches.js** — May have stale anchors if bundle filenames changed. Check patch targets match current `www/assets/` filenames.

---

## Key Files

| File | Purpose |
|------|---------|
| `isotope-apk-ref/scripts/prepare-www.js` | Copies web assets to www/ |
| `isotope-apk-ref/scripts/apply-android-patches.js` | Patches bundles for Android |
| `isotope-apk-ref/capacitor.config.json` | Capacitor config |
| `isotope-apk-ref/android-bridge.js` | Auth/supabase bridge |
| `isotope-apk-ref/android-floating-timer-bridge.js` | Timer overlay bridge |
| `server.mjs` | Server with all patches (reference) |

---

## Environment

- **Device:** 10.171.170.148:38011 (adb connected)
- **Server:** 127.0.0.1:3000 (isotope start)
- **Repo:** /data/data/com.termux/files/home/isotope-code
- **Latest commit:** `18fee79` (FocusPatch fix)

---

## Instructions

1. Read `.agent/CURRENT_STATE.md` and `.agent/NEXT_TASKS.md` first
2. Run `npm run agent:resume` before starting
3. Fix any remaining patch anchor issues in `apply-android-patches.js`
4. Build the APK with `npm run build && npm run android:debug`
5. Test on device (adb install)
6. Run `npm run agent:handoff` before ending session
