import {
    u as w,
    c as E,
    a as d,
    b as y
} from "./vendor-query-Rjz85D0S.js";
import {
    u as c,
    j as a,
    s as o,
    o as g,
    q as b
} from "./App-pJGjDiPw.js";
import {
    G as h,
    C as v
} from "./groupCache-DVHvdGlY.js";
import {
    g as f,
    a as Q
} from "./demoCommunity-DUJ4Y1zo.js";
const q = 20;

function x(r = {}) {
    const {
        searchQuery: i,
        category: e,
        enabled: t = !0
    } = r, s = c(n => n.isPremium());
    return E({
        queryKey: ["groups", i, e],
        queryFn: async ({
            pageParam: n
        }) => {
            if (a()) {
                const p = i ?.trim().toLowerCase();
                return f().groups.filter(_ => {
                    const G = !e || _.category === e,
                        K = !p || _.name.toLowerCase().includes(p) || (_.description || "").toLowerCase().includes(p);
                    return G && K
                })
            }
            if (!o) throw new Error("Supabase not configured");
            let u = o.from("groups").select("id, name, description, cover_url, logo_url, category, slug, member_count, owner_id, is_public, created_at").eq("is_public", !0).is("deleted_at", null).order("created_at", {
                ascending: !1
            }).limit(q);
            n && (u = u.lt("created_at", n)), e && (u = u.eq("category", e)), i && i.trim().length > 0 && (u = u.textSearch("fts", i.trim(), {
                type: "websearch"
            }));
            const {
                data: l,
                error: m
            } = await u;
            if (m) throw console.error("[useGroups] Error:", m), m;
            return l
        },
        initialPageParam: null,
        getNextPageParam: n => {
            if (!(!n || n.length < q)) return n[n.length - 1].created_at
        },
        enabled: t && s && (a() || !!o),
        staleTime: 1800 * 1e3,
        gcTime: 1440 * 60 * 1e3
    })
}
const C = r => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(r);

function F(r) {
    const i = c(e => e.isPremium());
    return w({
        queryKey: ["group", r],
        queryFn: async () => {
            if (a()) {
                const n = Q(r);
                return n ? { ...n,
                    max_members: 150
                } : null
            }
            if (!o) throw new Error("Supabase not configured");
            let e = o.from("groups").select("id, name, description, cover_url, logo_url, category, slug, member_count, owner_id, is_public, max_members, created_at");
            C(r) ? e = e.eq("id", r) : e = e.eq("slug", r);
            const {
                data: t,
                error: s
            } = await e.maybeSingle();
            if (s) throw s;
            return t
        },
        enabled: i && (a() || !!o) && !!r,
        staleTime: 3600 * 1e3,
        gcTime: 1440 * 60 * 1e3
    })
}

function N(r) {
    const i = c(t => t.userId),
        e = c(t => t.isPremium());
    return w({
        queryKey: ["groupMembership", r, i],
        queryFn: async () => {
            if (a()) return f().memberships[r] || null;
            if (!o || !i) throw new Error("Not authenticated");
            const {
                data: t,
                error: s
            } = await o.from("group_members").select("id, role, joined_at").eq("group_id", r).eq("user_id", i).maybeSingle();
            if (s) throw s;
            return t
        },
        enabled: e && (a() || !!o) && !!r && !!i,
        staleTime: 3600 * 1e3,
        gcTime: 1440 * 60 * 1e3
    })
}

function L() {
    const r = d(),
        i = c(e => e.userId);
    return y({
        mutationFn: async e => {
            if (a()) return f().memberships[e] || null;
            if (!o || !i) throw new Error("Not authenticated");
            const {
                data: t,
                error: s
            } = await o.from("group_members").insert({
                group_id: e,
                user_id: i,
                role: "member"
            }).select("id, role, joined_at").single();
            if (s) throw s;
            return t
        },
        onSuccess: (e, t) => {
            h.invalidate(v.GROUP_MEMBERS(t)), r.invalidateQueries({
                queryKey: ["groupMembership", t]
            }), r.invalidateQueries({
                queryKey: ["groupMembers", t]
            }), r.invalidateQueries({
                queryKey: ["group", t]
            }), r.invalidateQueries({
                queryKey: ["groupMemberPreview", t]
            }), r.invalidateQueries({
                queryKey: ["groups"]
            }), r.invalidateQueries({
                queryKey: ["myGroups"]
            })
        }
    })
}

function j() {
    const r = d(),
        i = c(e => e.userId);
    return y({
        mutationFn: async e => {
            if (a()) return;
            if (!o || !i) throw new Error("Not authenticated");
            const {
                error: t
            } = await o.from("group_members").delete().eq("group_id", e).eq("user_id", i);
            if (t) throw t
        },
        onSuccess: (e, t) => {
            h.invalidate(v.GROUP_MEMBERS(t)), r.invalidateQueries({
                queryKey: ["groupMembership", t]
            }), r.invalidateQueries({
                queryKey: ["groupMembers", t]
            }), r.invalidateQueries({
                queryKey: ["group", t]
            }), r.invalidateQueries({
                queryKey: ["groupMemberPreview", t]
            }), r.invalidateQueries({
                queryKey: ["groups"]
            }), r.invalidateQueries({
                queryKey: ["myGroups"]
            })
        }
    })
}

function B() {
    const r = d(),
        i = c(e => e.userId);
    return y({
        mutationFn: async e => {
            if (a()) return;
            if (!o || !i) throw new Error("Not authenticated");
            const {
                error: t
            } = await o.from("groups").delete().eq("id", e).eq("owner_id", i);
            if (t) throw t
        },
        onSuccess: () => {
            r.invalidateQueries({
                queryKey: ["groups"]
            }), r.invalidateQueries({
                queryKey: ["myGroups"]
            })
        }
    })
}

function R(r = {}) {
    const i = c(s => s.userId),
        e = c(s => s.isPremium()),
        {
            enabled: t = !0
        } = r;
    return w({
        queryKey: ["myGroups", i],
        queryFn: async () => {
            if (a()) return f().myGroups;
            if (!o || !i) throw new Error("Not authenticated");
            const {
                data: s,
                error: n
            } = await o.from("group_members").select(`
          group_id,
          group:groups (
            id,
            name,
            description,
            cover_url,
            logo_url,
            category,
            slug,
            member_count,
            owner_id,
            is_public,
            created_at
          )
        `).eq("user_id", i);
            if (n) throw n;
            return s.map(u => u.group).filter(u => !!u ?.id)
        },
        enabled: t && e && (a() || !!o) && !!i,
        staleTime: 1800 * 1e3,
        gcTime: 1440 * 60 * 1e3,
        refetchOnMount: !1
    })
}

function U() {
    const r = d(),
        i = c(e => e.userId);
    return y({
        mutationFn: async e => {
            if (a()) {
                const m = e.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                return {
                    id: `demo-group-${m}`,
                    name: e.name,
                    description: e.description || null,
                    cover_url: e.cover_url || null,
                    logo_url: null,
                    category: e.category || "Demo",
                    slug: m,
                    member_count: 1,
                    owner_id: i || "demo-jee-ranker",
                    is_public: e.is_public ?? !0,
                    created_at: new Date().toISOString()
                }
            }
            if (!o || !i) throw new Error("Not authenticated");
            const t = g(e.name, "groupName", "cloud"),
                s = g(e.description, "groupDescription", "cloud");
            if (!t) throw new Error("Group name is required.");
            b(t, "Group name"), b(s, "Group description");
            const {
                data: n,
                error: u
            } = await o.from("groups").insert({ ...e,
                name: t,
                description: s,
                owner_id: i,
                member_count: 0
            }).select("id, name, description, cover_url, logo_url, category, slug, member_count, owner_id, is_public, created_at").single();
            if (u) throw u;
            const {
                error: l
            } = await o.from("group_members").insert({
                group_id: n.id,
                user_id: i,
                role: "owner"
            });
            return l && console.error("[useCreateGroup] Failed to add owner as member:", l), n
        },
        onSuccess: () => {
            r.invalidateQueries({
                queryKey: ["groups"]
            }), r.invalidateQueries({
                queryKey: ["myGroups"]
            })
        }
    })
}
export {
    L as a, R as b, U as c, F as d, N as e, j as f, B as g, x as u
};