import {
    r as f,
    j as y
} from "./vendor-react-BfU3Zn2J.js";
import {
    j as u,
    l as a,
    k as i,
    m as l
} from "./App-pJGjDiPw.js";
import {
    P as g,
    Q as w
} from "./vendor-query-Rjz85D0S.js";
const h = new Set(["groupActiveSessions"]),
    E = new Set(["allGroupChallenges", "challengeParticipants", "challenges", "discussion", "discussions", "events", "featuredEvent", "group", "group-invites", "groupAnalytics", "groupAnnouncements", "groupChallenges", "groupChallengesWithUpcoming", "groupLeaderboard", "groupMemberPreview", "groupMembers", "groupMembership", "groupMilestones", "groups", "groupStats", "groupTrends", "invite-details", "leaderboard", "memberProfile", "myChallenges", "myEvents", "myGroups", "storeItems", "userInventory", "userPoints", "userStats"]),
    S = {
        queries: {
            staleTime: 1800 * 1e3,
            gcTime: 10080 * 60 * 1e3,
            refetchOnWindowFocus: !1,
            refetchOnReconnect: !1,
            refetchOnMount: !1,
            retry: (r, e) => r < 1 && !l(e),
            retryOnMount: !1
        },
        mutations: {
            retry: (r, e) => r < 1 && !l(e)
        }
    },
    v = new w({
        defaultOptions: S
    }),
    o = "isotope-query-cache",
    C = 2e3,
    d = 5e3,
    c = 4 * 1024 * 1024,
    I = r => {
        const e = r[0];
        return typeof e != "string" ? !1 : E.has(e) && !h.has(e)
    },
    P = r => {
        const e = JSON.stringify(r);
        return e.length <= c ? e : (console.warn(`[QueryProvider] Skipped persisted query cache write because payload was ${Math.round(e.length/1024)} KiB. Budget is ${Math.round(c/1024)} KiB.`), null)
    },
    Q = () => {
        let r = null,
            e = null;
        const n = () => {
                r && (clearTimeout(r), r = null), e !== null && typeof window < "u" && (window.cancelIdleCallback ?.(e), e = null)
            },
            p = s => {
                if (typeof window > "u") {
                    s();
                    return
                }
                const t = window;
                if (typeof t.requestIdleCallback == "function") {
                    e = t.requestIdleCallback(() => {
                        e = null, s()
                    }, {
                        timeout: d
                    });
                    return
                }
                r = setTimeout(() => {
                    r = null, s()
                }, d)
            };
        return {
            persistClient: async s => {
                n(), r = setTimeout(() => {
                    r = null, p(() => {
                        const t = P(s);
                        if (t) {
                            if (u() && typeof window < "u") {
                                window.sessionStorage.setItem(a(o), t);
                                return
                            }
                            i.setItem(o, t).catch(m => {
                                console.error("[QueryProvider] Failed to persist query cache:", m)
                            })
                        }
                    })
                }, C)
            },
            restoreClient: async () => {
                if (u() && typeof window < "u") {
                    const t = window.sessionStorage.getItem(a(o));
                    return t ? JSON.parse(t) : void 0
                }
                const s = await i.getItem(o);
                if (s) try {
                    return JSON.parse(s)
                } catch (t) {
                    console.error("[QueryProvider] Failed to parse cached query data:", t), await i.removeItem(o);
                    return
                }
            },
            removeClient: async () => {
                if (n(), u() && typeof window < "u") {
                    window.sessionStorage.removeItem(a(o));
                    return
                }
                await i.removeItem(o)
            }
        }
    },
    T = ({
        children: r
    }) => {
        const [e] = f.useState(() => Q());
        return y.jsx(g, {
            client: v,
            persistOptions: {
                persister: e,
                maxAge: 10080 * 60 * 1e3,
                buster: u() ? "v2-low-egress-demo" : "v2-low-egress",
                dehydrateOptions: {
                    shouldDehydrateQuery: n => n.state.status !== "success" ? !1 : I(n.queryKey)
                }
            },
            children: r
        })
    };
export {
    T as Q, v as a
};