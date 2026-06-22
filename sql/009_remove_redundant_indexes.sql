-- IsotopeAI — remove indexes proven redundant by live catalog and usage checks.
--
-- Each removed single-column index is covered by a unique or composite btree
-- whose leftmost column is identical. Keeping both adds write and maintenance
-- cost without providing a distinct access path.

begin;

drop index if exists public.idx_gann_group;
drop index if exists public.idx_gm_user;
drop index if exists public.idx_presence_status;
drop index if exists public.sync_items_user_id_idx;
drop index if exists public.idx_inventory_user;

commit;
