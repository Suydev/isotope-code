import {
    k as l
} from "./App-pJGjDiPw.js";
const r = {
        GROUP_DETAILS: e => `isotope:group:${e}:details`,
        GROUP_ANALYTICS: e => `isotope:group:${e}:analytics:v5`,
        GROUP_TRENDS: e => `isotope:group:${e}:trends:v3`,
        GROUP_LEADERBOARD: (e, n) => `isotope:group:${e}:lb:${n}`,
        GROUP_MILESTONES: e => `isotope:group:${e}:milestones:v2`,
        GROUP_MEMBERS: e => `isotope:group:${e}:members`,
        GROUP_CHAT: e => `isotope:group:${e}:chat:${o()}`,
        GROUP_ANNOUNCEMENTS: e => `isotope:group:${e}:announcements`
    },
    S = {
        DETAILS: 360 * 60 * 1e3,
        ANALYTICS: 7200 * 1e3,
        TRENDS: 7200 * 1e3,
        LEADERBOARD: 3600 * 1e3,
        MILESTONES: 1440 * 60 * 1e3,
        MEMBERS: 360 * 60 * 1e3,
        CHAT: "midnight",
        ANNOUNCEMENTS: 7200 * 1e3
    },
    y = "isotope:group:",
    s = new Map;
let h = !1;
const c = () => {
        h || (h = !0, (async () => {
            const e = await l.getByPrefix(y);
            Object.entries(e).forEach(([n, t]) => {
                typeof t == "string" && s.set(n, t)
            })
        })())
    },
    R = e => (c(), s.get(e) ?? null),
    p = (e, n) => {
        c(), s.set(e, n), l.setItem(e, n)
    },
    i = e => {
        c(), s.delete(e), l.removeItem(e)
    };

function o() {
    const e = new Date;
    return `${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`
}

function E(e) {
    return e !== o()
}

function d(e) {
    try {
        const n = R(e);
        if (!n) return null;
        const t = JSON.parse(n);
        return t.dateKey && E(t.dateKey) || t.expiry && Date.now() > t.expiry ? (i(e), null) : t.data
    } catch {
        return null
    }
}

function f(e, n, t) {
    try {
        const a = {
            data: n,
            expiry: t === "midnight" ? 0 : Date.now() + t,
            dateKey: t === "midnight" ? o() : void 0
        };
        p(e, JSON.stringify(a))
    } catch (a) {
        console.warn("[groupCache] Cache write failed, clearing old entries and retrying:", a), O();
        try {
            const u = {
                data: n,
                expiry: t === "midnight" ? 0 : Date.now() + t,
                dateKey: t === "midnight" ? o() : void 0
            };
            p(e, JSON.stringify(u))
        } catch (u) {
            console.warn("[groupCache] Cache write retry failed:", u)
        }
    }
}

function g(e) {
    i(e)
}

function C(e) {
    [r.GROUP_DETAILS(e), r.GROUP_ANALYTICS(e), r.GROUP_TRENDS(e), r.GROUP_LEADERBOARD(e, "daily"), r.GROUP_LEADERBOARD(e, "weekly"), r.GROUP_LEADERBOARD(e, "alltime"), r.GROUP_MILESTONES(e), r.GROUP_MEMBERS(e), r.GROUP_ANNOUNCEMENTS(e)].forEach(t => i(t))
}

function O() {
    c();
    const e = [];
    for (const [n, t] of s.entries())
        if (n.startsWith(y)) try {
            const a = JSON.parse(t);
            (a.expiry && Date.now() > a.expiry || a.dateKey && E(a.dateKey)) && e.push(n)
        } catch {
            e.push(n)
        }
    e.forEach(n => i(n))
}

function A(e) {
    return d(e) !== null
}

function N(e) {
    try {
        const n = R(e);
        if (!n) return null;
        const t = JSON.parse(n);
        return t.dateKey && E(t.dateKey) || t.expiry && Date.now() > t.expiry ? (i(e), null) : {
            data: t.data,
            age: t.expiry ? t.expiry - Date.now() : 0
        }
    } catch {
        return null
    }
}
const G = {
    get: d,
    set: f,
    invalidate: g,
    invalidateGroup: C,
    clearOld: O,
    isValid: A,
    getWithMeta: N,
    keys: r,
    ttl: S,
    getTodayKey: o
};
export {
    r as C, G, S as a
};