---
name: Group creation error handling
description: useGroups createGroup mutation silently swallowed group_members INSERT failure; must throw.
---

## Rule
In `useGroups-*.js` `U()` mutation, the `group_members` INSERT error (`l`) must be thrown, not swallowed.

## Why
The original code used `return l && console.error(...), n` — if the owner membership INSERT failed (e.g. RLS error), the group was returned as if creation succeeded. The `onSuccess` callback ran, queries were invalidated, but the user had no group membership and couldn't see/manage their group. No error was shown to the user.

After Supabase migration 010 restored `gm_client_insert_compat` (allows `user_id = auth.uid()` INSERT), this should succeed for new groups. But if it fails for any reason, the error now surfaces.

## How to apply
In `scripts/apply-android-patches.js`, the `useGroups` `patchFile` call has an entry:
```
old: 'return l && console.error("[useCreateGroup] Failed to add owner as member:", l), n'
new: 'if (l) { console.error(...); throw new Error(l.message || "Failed to add you as group owner..."); }\n return n'
```

## Known gap
Group creation is still non-atomic: if `group_members` INSERT fails, the `groups` row is orphaned (no owner). Long-term fix: use `create_community_group` RPC (SECURITY DEFINER, available since migration 009).

## Test
`test/prepare-patches.test.mjs` asserts `throw new Error(l.message || "Failed to add you as group owner"` present, and `return l && console.error("[useCreateGroup]"` absent.
