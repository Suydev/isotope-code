---
name: Community SQL hardening
description: History of community table migrations and the RLS infinite-recursion bug introduced by 009 and fixed by 011.
---

## Rule
After applying migration 009 + 010 + 011, the community is safe. Never write inline `group_members` subqueries inside RLS policies — always use SECURITY DEFINER functions.

## What was applied
1. **009_community_hardening.sql** — 7 community RPCs, updated RLS policies
2. **010_cleanup_group_members_rls.sql** — restored `gm_client_insert_compat` (allows `user_id = auth.uid()` INSERT)
3. **011_fix_rls_recursion.sql** — **CRITICAL FIX: eliminated HTTP 500 infinite recursion**

## Root cause of 500 (migration 011 fixed)
Migration 009 created `gm_read_members` with a SELF-REFERENTIAL subquery:
```sql
FOR SELECT USING (
  group_id IN (SELECT gm2.group_id FROM group_members gm2 WHERE gm2.user_id = auth.uid())
)
```
When `gchall_manager_write` (also from 009) subqueried `group_members`, PostgreSQL
applied `gm_read_members` to that inner scan → `gm_read_members` fired again → recursion → HTTP 500.
The circuit breaker tripped on the 500 and blocked ALL subsequent queries (groups list, etc.).

## Fix applied (011)
- `gm_read_members`: replaced self-referential subquery with `user_id = auth.uid() OR public._is_group_member()` [SECURITY DEFINER, no RLS, no recursion]
- Dropped `gchall_manager_write` and `gann_manager_write` (caused recursion; redundant with `private.can_manage_group` policies)
- `gchall_read`: active challenges now discoverable by all authenticated users
- `GRANT SELECT ON group_challenges TO anon`
- Backfilled group categories

## Current group_members policies (post-011)
- `gm_admin_update` UPDATE — `user_id = auth.uid() OR _is_group_member(...)`
- `gm_client_insert_compat` INSERT — `user_id = auth.uid()`
- `gm_read_members` SELECT — `user_id = auth.uid() OR _is_group_member(...)` ← NO RECURSION
- `gm_self_delete` DELETE — `user_id = auth.uid()`

## Why
Inline `group_members` subqueries in RLS policies trigger `gm_read_members` recursively.
SECURITY DEFINER functions (`_is_group_member`, `private.is_group_member`, `private.can_manage_group`) bypass RLS and do not recurse.

## How to apply
If you ever write a new policy on `group_challenges`, `group_announcements`, or any table
that indirectly reads `group_members`, use SECURITY DEFINER functions only. Never write:
```sql
FOR SELECT USING (group_id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid()))
```
Always use:
```sql
FOR SELECT USING (public._is_group_member(group_id, (SELECT auth.uid())))
```
