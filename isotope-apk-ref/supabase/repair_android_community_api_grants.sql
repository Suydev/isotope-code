-- Repair API permissions required by the compiled Android web bundle.
-- RLS policies still enforce ownership/admin rules; these grants only allow
-- authenticated clients to reach the policy checks instead of failing early.

grant update on public.group_challenge_participants to authenticated;
grant insert, update, delete on public.user_inventory to authenticated;
grant insert, update on public.user_points to authenticated;
grant update on public.group_members to authenticated;
