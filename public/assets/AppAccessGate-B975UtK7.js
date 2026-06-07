const __vite__mapDeps = (i, m = __vite__mapDeps, d = (m.f || (m.f = ["assets/AIAssistant--spCOe6W.js", "assets/vendor-react-BfU3Zn2J.js", "assets/useAIStore-B2cv1FZz.js", "assets/App-pJGjDiPw.js", "assets/index-BPYJFSVW.js", "assets/index-CrO6t5EW.css", "assets/vendor-supabase-DAiUAuun.js", "assets/vendor-motion-Cp_NPzpZ.js", "assets/vendor-icons-CqruUz7g.js", "assets/vendor-router-CmoTwRnm.js", "assets/useFocusStore-CX_Nyp1h.js", "assets/useNotificationStore-BS4df28T.js", "assets/utils-D8mZnxMk.js", "assets/vendor-charts-CFLJvnG7.js", "assets/IsotopeLogoIcon-oPk5Ru-_.js", "assets/MarkdownRenderer-CIV1x0Uq.js", "assets/GlobalPresenceBroadcaster-C5JADiwL.js", "assets/useGroups-vEjDKzZY.js", "assets/vendor-query-Rjz85D0S.js", "assets/groupCache-DVHvdGlY.js", "assets/demoCommunity-DUJ4Y1zo.js", "assets/useGroupPresence-BmkfUzH6.js", "assets/GlobalTimer-DUR6TMoR.js", "assets/QuickChatMenu-BUr6NG9I.js", "assets/useUIStore-JhKp1ywd.js", "assets/GroupChat-j6zM76h9.js", "assets/QuickActionsMenu-ojdsCiqG.js", "assets/WelcomeTeaser-B96rmBi8.js", "assets/SyncListener-BMsBLWig.js", "assets/GlobalQuickActionsModals-BIoAwrDz.js", "assets/TaskCardModal-DZvd1GWt.js", "assets/timeFormat-CMPo-BX2.js", "assets/taskAvailability-B1aDS_ww.js", "assets/ExamCreateEditModal-BdlzfeFO.js", "assets/bootstrap-D1vc155U.js", "assets/useOnlineStatus-BJOTUERN.js", "assets/TaskController-BUyiMYKC.js", "assets/index-B45N-99N.js", "assets/endOfDay-CZDDeNMb.js", "assets/useSyncStore-vWs_TdIc.js", "assets/QueryProvider-DusNhG9D.js", "assets/NetworkRequiredState-O9ZdVBEy.js"]))) => i.map(i => d[i]);
import {
    j as r,
    r as p
} from "./vendor-react-BfU3Zn2J.js";
import {
    _ as x
} from "./index-BPYJFSVW.js";
import {
    u as N
} from "./useOnlineStatus-BJOTUERN.js";
import {
    t as ee
} from "./TaskController-BUyiMYKC.js";
import {
    GoogleCalendarWorker as he,
    GoogleTasksWorker as ye
} from "./index-B45N-99N.js";
import {
    u as f,
    j as M,
    r as Se,
    a0 as xe,
    c as be,
    h as E,
    a1 as w,
    a2 as c,
    k as we,
    a3 as C
} from "./App-pJGjDiPw.js";
import {
    u as S,
    g as ke
} from "./useSyncStore-vWs_TdIc.js";
import {
    c3 as te,
    i as _e,
    b3 as Ee,
    X as ce,
    bN as Ae
} from "./vendor-icons-CqruUz7g.js";
import {
    a as se,
    Q as Te
} from "./QueryProvider-DusNhG9D.js";
import {
    u as ve,
    b as Ie,
    N as z
} from "./vendor-router-CmoTwRnm.js";
import {
    u as re,
    j as je,
    h as K,
    k as P
} from "./useFocusStore-CX_Nyp1h.js";
import {
    a as Me,
    b as Ne,
    u as Le,
    m as De
} from "./useAIStore-B2cv1FZz.js";
import {
    A as ae,
    D as oe,
    N as ne
} from "./NetworkRequiredState-O9ZdVBEy.js";
const Re = () => {
        const {
            isOnline: e
        } = N(), s = S(u => u.needsCloudBootstrap), t = S(u => u.status), a = S(u => u.downloadCloudSnapshot);
        if (!s) return null;
        const n = t === "syncing";
        return r.jsx("div", {
            className: "pointer-events-none fixed left-1/2 top-4 z-[76] w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 px-2",
            children: r.jsx("div", {
                role: "status",
                className: "pointer-events-auto rounded-2xl border border-sky-500/25 bg-sky-500/10 px-4 py-3 text-sky-950 shadow-xl backdrop-blur dark:text-sky-50",
                children: r.jsxs("div", {
                    className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
                    children: [r.jsxs("div", {
                        className: "flex items-start gap-3",
                        children: [r.jsx("div", {
                            className: "mt-0.5 rounded-full bg-sky-500/20 p-2 text-sky-600 dark:text-sky-300",
                            children: r.jsx(te, {
                                className: "h-4 w-4"
                            })
                        }), r.jsxs("div", {
                            className: "space-y-1",
                            children: [r.jsx("p", {
                                className: "text-xs font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300",
                                children: "Cloud data available"
                            }), r.jsx("p", {
                                className: "text-sm font-medium leading-6 text-sky-950 dark:text-sky-50",
                                children: "This device doesn't have your local study data yet. Download your premium cloud backup when you're ready."
                            })]
                        })]
                    }), r.jsxs("button", {
                        type: "button",
                        onClick: () => {
                            a()
                        },
                        disabled: !e || n,
                        className: "inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60",
                        children: [n ? r.jsx(_e, {
                            className: "h-4 w-4 animate-spin"
                        }) : r.jsx(te, {
                            className: "h-4 w-4"
                        }), n ? "Downloading..." : e ? "Download cloud data" : "Reconnect to download"]
                    })]
                })
            })
        })
    },
    Ce = () => {
        const e = f(l => l.isTemporaryLocalSession),
            s = f(l => l.temporaryLocalMessage),
            t = f(l => l.temporaryLocalNoticeSeenFingerprint),
            a = f(l => l.acknowledgeTemporaryLocalNotice),
            [n, u] = p.useState(null);
        return p.useEffect(() => {
            if (!e || !s) {
                u(null);
                return
            }
            t !== s && (u(s), a())
        }, [a, e, s, t]), p.useEffect(() => {
            if (!n) return;
            const l = window.setTimeout(() => {
                u(null)
            }, 9e3);
            return () => window.clearTimeout(l)
        }, [n]), !e || !s || n !== s ? null : r.jsx("div", {
            className: "pointer-events-none fixed left-1/2 top-4 z-[75] w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 px-2",
            children: r.jsx("div", {
                role: "status",
                "data-testid": "temporary-local-session-notice",
                className: "pointer-events-auto rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-amber-950 shadow-xl backdrop-blur dark:text-amber-50",
                children: r.jsxs("div", {
                    className: "flex items-start gap-3",
                    children: [r.jsx("div", {
                        className: "mt-0.5 rounded-full bg-amber-500/20 p-2 text-amber-600 dark:text-amber-300",
                        children: r.jsx(Ee, {
                            className: "h-4 w-4"
                        })
                    }), r.jsxs("div", {
                        className: "min-w-0 flex-1 space-y-1",
                        children: [r.jsx("p", {
                            className: "text-xs font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-300",
                            children: "Temporary local session"
                        }), r.jsx("p", {
                            className: "text-sm font-medium leading-6 text-amber-950 dark:text-amber-50",
                            children: s
                        })]
                    }), r.jsx("button", {
                        type: "button",
                        onClick: () => u(null),
                        "aria-label": "Dismiss temporary local session notice",
                        className: "rounded-lg p-1.5 text-amber-700 transition-colors hover:bg-amber-500/15 hover:text-amber-900 dark:text-amber-200 dark:hover:text-white",
                        children: r.jsx(ce, {
                            className: "h-4 w-4"
                        })
                    })]
                })
            })
        })
    },
    ze = () => {
        const e = ve();
        if (!M()) return null;
        const s = () => {
                Se(), se.clear(), window.location.replace("/dashboard")
            },
            t = () => {
                xe(), se.clear(), e("/", {
                    replace: !0
                }), window.location.reload()
            };
        return r.jsx("div", {
            className: "fixed bottom-4 left-1/2 z-[90] -translate-x-1/2 rounded-full border border-black/10 bg-white/90 px-3 py-2 text-xs font-semibold text-zinc-700 shadow-lg backdrop-blur dark:border-white/10 dark:bg-zinc-950/90 dark:text-zinc-200",
            children: r.jsxs("div", {
                className: "flex items-center gap-2",
                children: [r.jsx("span", {
                    className: "h-2 w-2 rounded-full bg-lime-500"
                }), r.jsx("span", {
                    children: "Ranker demo"
                }), r.jsxs("button", {
                    type: "button",
                    onClick: s,
                    className: "inline-flex items-center gap-1 rounded-full px-2 py-1 text-zinc-500 transition hover:bg-black/5 hover:text-zinc-900 dark:hover:bg-white/10 dark:hover:text-white",
                    title: "Reset demo data",
                    children: [r.jsx(Ae, {
                        className: "h-3 w-3"
                    }), "Reset"]
                }), r.jsxs("button", {
                    type: "button",
                    onClick: t,
                    className: "inline-flex items-center gap-1 rounded-full px-2 py-1 text-zinc-500 transition hover:bg-black/5 hover:text-zinc-900 dark:hover:bg-white/10 dark:hover:text-white",
                    title: "Exit demo",
                    children: [r.jsx(ce, {
                        className: "h-3 w-3"
                    }), "Exit"]
                })]
            })
        })
    },
    Ke = 1500,
    Pe = 3500,
    Oe = 60 * 1e3,
    Be = p.lazy(() => x(() =>
        import ("./AIAssistant--spCOe6W.js"), __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]))),
    Fe = p.lazy(() => x(() =>
        import ("./GlobalPresenceBroadcaster-C5JADiwL.js"), __vite__mapDeps([16, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 17, 18, 19, 20, 21]))),
    Ye = p.lazy(() => x(() =>
        import ("./GlobalTimer-DUR6TMoR.js"), __vite__mapDeps([22, 1, 10, 4, 5, 3, 6, 7, 8, 9, 11]))),
    Ve = p.lazy(() => x(() =>
        import ("./QuickChatMenu-BUr6NG9I.js"), __vite__mapDeps([23, 1, 17, 18, 3, 4, 5, 6, 7, 8, 9, 19, 20, 24, 25, 12, 13]))),
    Ge = p.lazy(() => x(() =>
        import ("./QuickActionsMenu-ojdsCiqG.js"), __vite__mapDeps([26, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 24])).then(e => ({
        default: e.QuickActionsMenu
    }))),
    Ue = p.lazy(() => x(() =>
        import ("./WelcomeTeaser-B96rmBi8.js"), __vite__mapDeps([27, 1, 3, 4, 5, 6, 7, 8, 9])).then(e => ({
        default: e.WelcomeTeaser
    }))),
    $e = p.lazy(() => x(() =>
        import ("./SyncListener-BMsBLWig.js"), __vite__mapDeps([28, 1, 10, 4, 5, 3, 6, 7, 8, 9, 11, 2])).then(e => ({
        default: e.SyncListener
    }))),
    We = p.lazy(() => x(() =>
        import ("./GlobalQuickActionsModals-BIoAwrDz.js"), __vite__mapDeps([29, 1, 24, 3, 4, 5, 6, 7, 8, 9, 30, 10, 11, 2, 12, 13, 31, 32, 33])).then(e => ({
        default: e.GlobalQuickActionsModals
    }))),
    Qe = () => {
        const e = f(i => i.isAuthenticated),
            s = f(i => i.isInitialized),
            t = f(i => i.isTemporaryLocalSession),
            a = f(i => i.recoverCloudSession),
            n = S(i => i.clearDegradedStatus),
            {
                isOnline: u
            } = N(),
            {
                isPerformanceMode: l
            } = be(),
            [d, h] = p.useState(!1);
        return p.useEffect(() => {
            if (!s || !e) {
                h(!1);
                return
            }
            let i = null;
            const g = window.setTimeout(() => {
                if (typeof window.requestIdleCallback == "function") {
                    i = window.requestIdleCallback(() => {
                        h(!0)
                    }, {
                        timeout: 2e3
                    });
                    return
                }
                h(!0)
            }, l ? Pe : Ke);
            return () => {
                window.clearTimeout(g), i !== null && window.cancelIdleCallback ?.(i)
            }
        }, [e, s, l]), p.useEffect(() => {
            if (!s || !e || !t || !u) return;
            const i = async () => {
                (await a()).success && n()
            };
            i();
            const g = window.setInterval(() => {
                i()
            }, Oe);
            return () => window.clearInterval(g)
        }, [n, e, s, u, t, a]), p.useEffect(() => {
            d && (ee.registerWorker(new he), ee.registerWorker(new ye))
        }, [d]), r.jsxs(p.Suspense, {
            fallback: null,
            children: [r.jsx(Ce, {}), r.jsx(Re, {}), r.jsx(ze, {}), r.jsx(Ye, {}), d && r.jsx(Xe, {})]
        })
    },
    Xe = () => {
        const {
            isOnline: e
        } = N(), s = Ie(), t = e && s.pathname.startsWith("/community");
        return r.jsxs(r.Fragment, {
            children: [t && r.jsx(Fe, {}), r.jsx($e, {}), r.jsx(Ue, {}), r.jsx(Ve, {}), r.jsx(Be, {}), r.jsx(Ge, {}), r.jsx(We, {})]
        })
    },
    He = async () => {
        const {
            bootstrapApp: e
        } = await x(async () => {
            const {
                bootstrapApp: s
            } = await
            import ("./bootstrap-D1vc155U.js");
            return {
                bootstrapApp: s
            }
        }, __vite__mapDeps([34, 3, 4, 1, 5, 6, 7, 8, 9, 35, 36, 2, 10, 11, 37, 38, 39, 40, 18, 41, 12, 13]));
        await e()
    },
    qe = () => {
        const [e, s] = p.useState(!1), [t, a] = p.useState(!1), n = p.useRef(!1), u = p.useRef(null), l = f(o => o.initializeAuth), d = f(o => o.isInitialized), h = f(o => o.isAuthenticated), i = f(o => o.userId), g = f(o => o.planType), A = E(o => o.fetchProfile), T = re(o => o.fetchSubjects), v = je(o => o.fetchTasks), m = K(o => o.fetchSessions), F = Me(o => o.fetchHabits), Y = P(o => o.fetchTests), V = P(o => o.fetchExams), G = P(o => o.fetchMockTests), U = Ne(o => o.fetchLogs), $ = K(o => o.restoreTimerState), W = K(o => o.initializeFromUserProfile), Q = S(o => o.subscribe), X = S(o => o.markBootstrapPending), I = S(o => o.setBootstrapState), H = re(o => o.repairTemplateSubjects);
        return p.useEffect(() => {
            if (n.current) return;
            n.current = !0, (async () => {
                try {
                    await He()
                } catch {} finally {
                    a(!0)
                }
                try {
                    f.getState().isInitialized || await l()
                } catch {}
            })();
            const q = Q();
            return () => q()
        }, [l, Q]), p.useEffect(() => {
            if (!t || !d) return;
            const o = `${h?i??"unknown":"guest"}:${g}`;
            if (u.current === o) return;
            u.current = o, s(!1), X(), (async () => {
                try {
                    await A();
                    const k = f.getState(),
                        J = !M() && k.isAuthenticated && !!k.userId && !k.userId.startsWith("local-"),
                        Z = typeof E.getState == "function" ? E.getState() : null;
                    J && k.userId && Z ?.fetchCloudProfile && Z.fetchCloudProfile(k.userId, {
                        planType: k.planType
                    }), W(), await Promise.all([T(), v(), m(), F(), Y(), V(), G(), U(), $(), Le.getState().initializeAI()]), await De(), await H();
                    const R = f.getState();
                    if (J && R.isPremium() && R.userId) {
                        const ge = await (await ke()).canBootstrapFromCloud(R.userId, !0);
                        I(ge)
                    } else I(!1)
                } catch {
                    I(!1)
                } finally {
                    s(!0)
                }
            })()
        }, [W, F, U, A, m, T, v, Y, V, G, h, d, t, X, g, H, $, I, i]), e
    },
    le = "__migrated__",
    Je = 720 * 60 * 60 * 1e3,
    de = () => typeof window < "u" && typeof window.localStorage < "u",
    Ze = e => {
        const s = e.split("__");
        if (s.length < 4) return null;
        const t = Number(s[2]);
        return Number.isNaN(t) ? null : t
    },
    et = (e, s) => `${le}${e}__${s}`,
    tt = (e, s, t) => {
        if (de()) try {
            window.localStorage.setItem(et(e, s), t)
        } catch {}
    },
    ie = () => {
        if (!de()) return;
        const e = Date.now(),
            s = [];
        for (let t = 0; t < window.localStorage.length; t += 1) {
            const a = window.localStorage.key(t);
            if (!a || !a.startsWith(le)) continue;
            const n = Ze(a);
            if (!n) {
                s.push(a);
                continue
            }
            e - n > Je && s.push(a)
        }
        for (const t of s) window.localStorage.removeItem(t)
    },
    O = "indexeddb_migration_complete_v3",
    ue = new Set([c.TASKS, c.SESSIONS, c.SUBJECTS, c.HABITS, c.DAILY_LOGS, c.TESTS, c.EXAMS, c.MOCK_TESTS, c.USER_PROFILE, c.TIMER_STATE, c.SYNC_METADATA, c.SCHEMA_VERSION]),
    st = new Set(["isotope-auth", "isotope-onboarding", "isotope-notifications", "isotope-tools-storage", "ai-storage", "isotope-quotes", "sidebar-storage", "group-ui-preferences", "isotope-query-cache", "isotope-auth-token", "isotope:pending_session_sync", "isotope_device_id", "device_id", "isotope_intro_seen", "focus-bg-image", "focus-distractions", "session-custom-goals", "pwa-banner-dismissed", "pwa-install-dismissed", "notification-prompt-dismissed", "challenge_reminders", "isotope_scheduled_challenges", "isotope_completed_challenges", "tools-last-reset"]),
    rt = ["last_premium_sync_", "isotope_wrapped_", "victory_shown_", "isotope:user:", "isotope:group:", "ai_api_key_", "ai_encrypted_"],
    at = e => ue.has(e) || st.has(e) ? !0 : rt.some(s => e.startsWith(s)),
    L = () => typeof window < "u" && typeof window.localStorage < "u",
    j = e => {
        if (!e) return null;
        try {
            return JSON.parse(e)
        } catch {
            return null
        }
    },
    ot = (e, s) => {
        const t = j(e);
        return Array.isArray(t) ? t.filter(a => a !== null && typeof a == "object").map(a => {
            const n = a.createdAt ?? new Date().toISOString(),
                u = a.updatedAt ?? n;
            return s === c.DAILY_LOGS && !a.id && a.date ? { ...a,
                id: `log-${String(a.date)}`,
                createdAt: n,
                updatedAt: u
            } : { ...a,
                createdAt: n,
                updatedAt: u
            }
        }) : []
    },
    nt = "__migrated__",
    it = e => !!e.startsWith(nt),
    D = () => {
        const e = [];
        for (let s = 0; s < window.localStorage.length; s += 1) {
            const t = window.localStorage.key(s);
            t && (it(t) || at(t) && e.push(t))
        }
        return e
    },
    pe = async (e, s, t) => {
        const a = [{
            key: c.TASKS,
            store: "tasks"
        }, {
            key: c.SESSIONS,
            store: "sessions"
        }, {
            key: c.SUBJECTS,
            store: "subjects"
        }, {
            key: c.HABITS,
            store: "habits"
        }, {
            key: c.DAILY_LOGS,
            store: "dailyLogs"
        }, {
            key: c.TESTS,
            store: "tests"
        }, {
            key: c.EXAMS,
            store: "exams"
        }, {
            key: c.MOCK_TESTS,
            store: "mockTests"
        }];
        for (const {
                key: d,
                store: h
            } of a) {
            const i = window.localStorage.getItem(d);
            if (!i) continue;
            const g = ot(i, d);
            if (g.length === 0) {
                s.push(d);
                continue
            }
            await w.bulkPut(h, g), e.push(d)
        }
        t ?.({
            phase: "Migrating singleton records",
            progress: 45
        });
        const n = window.localStorage.getItem(c.USER_PROFILE);
        if (n) {
            const d = j(n);
            d && typeof d == "object" ? (await w.put("userProfile", { ...d,
                id: d.id || "primary"
            }), e.push(c.USER_PROFILE)) : s.push(c.USER_PROFILE)
        }
        const u = window.localStorage.getItem(c.TIMER_STATE);
        if (u) {
            const d = j(u);
            d && typeof d == "object" ? (await w.put("timerState", { ...d,
                id: "current"
            }), e.push(c.TIMER_STATE)) : s.push(c.TIMER_STATE)
        }
        const l = window.localStorage.getItem(c.SYNC_METADATA);
        if (l) {
            const d = j(l);
            if (d && typeof d == "object") {
                const h = Object.entries(d).filter(([i, g]) => !!i && typeof g == "string").map(([i, g]) => ({
                    collection: i,
                    lastSync: g
                }));
                await w.bulkPut("syncMetadata", h), e.push(c.SYNC_METADATA)
            } else s.push(c.SYNC_METADATA)
        }
    },
    me = async (e, s, t, a) => {
        const n = e.filter(l => !ue.has(l));
        if (n.length === 0) {
            a ?.({
                phase: "Migrating key-value data",
                progress: 70
            });
            return
        }
        let u = 0;
        for (const l of n) {
            const d = window.localStorage.getItem(l);
            if (d === null) {
                t.push(l), u += 1;
                continue
            }
            try {
                await we.setItem(l, d), s.push(l)
            } catch (i) {
                console.error(`[Migration] Failed to migrate KV key: ${l}`, i), t.push(l)
            }
            u += 1;
            const h = 45 + Math.floor(u / n.length * 25);
            a ?.({
                phase: "Migrating key-value data",
                progress: h
            })
        }
    },
    fe = (e, s) => {
        for (const t of e) {
            const a = window.localStorage.getItem(t);
            a !== null && (tt(s, t, a), window.localStorage.removeItem(t))
        }
    },
    ct = async () => !L() || (await w.get("migrationMeta", O)) ?.value ? !1 : D().length > 0,
    lt = () => L() ? D().length > 0 : !1,
    dt = async () => {
        if (!L()) return {
            success: !0,
            migratedKeys: [],
            skippedKeys: []
        };
        const e = D();
        if (e.length === 0) return {
            success: !0,
            migratedKeys: [],
            skippedKeys: []
        };
        const s = [],
            t = [];
        try {
            await pe(s, t), await me(e, s, t);
            const a = Date.now();
            return fe(s, a), {
                success: !0,
                migratedKeys: s,
                skippedKeys: t
            }
        } catch (a) {
            return console.error("[Migration] Failed to migrate orphaned keys:", a), {
                success: !1,
                migratedKeys: s,
                skippedKeys: t,
                error: a instanceof Error ? a.message : "Orphaned key migration failed"
            }
        }
    },
    ut = async e => {
        if (!L()) return {
            success: !0,
            migratedKeys: [],
            skippedKeys: []
        };
        const s = D();
        if (s.length === 0) return await w.put("migrationMeta", {
            key: O,
            value: !0,
            completedAt: new Date().toISOString()
        }), {
            success: !0,
            migratedKeys: [],
            skippedKeys: []
        };
        const t = [],
            a = [];
        try {
            e ?.({
                phase: "Preparing migration",
                progress: 10
            }), await pe(t, a, e), await me(s, t, a, e), e ?.({
                phase: "Backing up legacy keys",
                progress: 75
            });
            const n = Date.now();
            return fe(t, n), a.length > 0 ? {
                success: !1,
                migratedKeys: t,
                skippedKeys: a,
                error: `Migration skipped ${a.length} legacy key(s); kept them in localStorage for retry`
            } : (e ?.({
                phase: "Finalizing migration",
                progress: 90
            }), await w.put("migrationMeta", {
                key: O,
                value: !0,
                completedAt: new Date().toISOString(),
                migratedCount: t.length,
                skippedCount: a.length
            }), e ?.({
                phase: "Migration complete",
                progress: 100
            }), {
                success: !0,
                migratedKeys: t,
                skippedKeys: a
            })
        } catch (n) {
            return {
                success: !1,
                migratedKeys: t,
                skippedKeys: a,
                error: n instanceof Error ? n.message : "Migration failed"
            }
        }
    },
    pt = {
        status: "idle",
        progress: 0,
        message: "Migration has not started",
        migratedKeys: 0,
        skippedKeys: 0,
        error: null
    };
let y = pt,
    _ = null;
const B = new Set,
    b = e => {
        y = { ...y,
            ...e
        }, B.forEach(s => s(y))
    },
    mt = () => y,
    ft = e => (B.add(e), e(y), () => {
        B.delete(e)
    }),
    Nt = async () => _ || (_ = (async () => {
        if (b({
                status: "running",
                progress: 5,
                message: "Checking IndexedDB availability",
                error: null
            }), !await w.isAvailable()) return C("IndexedDB is unavailable in this browser session. Keeping the app in local backup mode."), b({
            status: "skipped",
            progress: 100,
            message: "IndexedDB is unavailable; startup continued in local backup mode",
            error: "IndexedDB unavailable"
        }), y;
        try {
            if (!await ct()) return ie(), lt() && await dt(), b({
                status: "skipped",
                progress: 100,
                message: "No legacy localStorage data found",
                migratedKeys: 0,
                skippedKeys: 0,
                error: null
            }), y;
            b({
                status: "running",
                progress: 15,
                message: "Migrating legacy localStorage data"
            });
            const t = await ut(a => {
                b({
                    status: "running",
                    progress: a.progress,
                    message: a.phase
                })
            });
            return ie(), t.success ? (b({
                status: "success",
                progress: 100,
                message: "Migration complete",
                migratedKeys: t.migratedKeys.length,
                skippedKeys: t.skippedKeys.length,
                error: null
            }), y) : (C(t.error || "Storage migration could not finish. Legacy data was kept for retry."), b({
                status: "skipped",
                progress: 100,
                message: t.error || "Migration skipped; legacy data was kept for retry",
                migratedKeys: t.migratedKeys.length,
                skippedKeys: t.skippedKeys.length,
                error: t.error || "Migration failed"
            }), y)
        } catch (s) {
            return C("Storage migration bootstrap failed. Startup continued safely."), b({
                status: "skipped",
                progress: 100,
                message: "Migration bootstrap skipped; startup continued safely",
                error: s instanceof Error ? s.message : "Unknown bootstrap error"
            }), y
        }
    })(), _.finally(() => {
        _ = null
    }), _),
    gt = () => {
        const [e, s] = p.useState(() => mt());
        if (p.useEffect(() => ft(a => {
                s(a)
            }), []), e.status !== "running" && e.status !== "error") return null;
        const t = e.status === "error";
        return r.jsx("div", {
            className: "fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6",
            children: r.jsxs("div", {
                className: "w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-6 text-white shadow-2xl",
                children: [r.jsx("h2", {
                    className: "text-xl font-bold mb-2",
                    children: t ? "Storage Migration Failed" : "Migrating Your Data"
                }), r.jsx("p", {
                    className: "text-sm text-zinc-300 mb-4",
                    children: e.message
                }), !t && r.jsxs(r.Fragment, {
                    children: [r.jsx("div", {
                        className: "h-2 w-full rounded-full bg-zinc-700 overflow-hidden mb-3",
                        children: r.jsx("div", {
                            className: "h-full bg-brand-500 transition-all duration-300",
                            style: {
                                width: `${Math.min(100,Math.max(0,e.progress))}%`
                            }
                        })
                    }), r.jsxs("p", {
                        className: "text-xs text-zinc-400",
                        children: [e.progress, "% complete"]
                    })]
                }), t && r.jsx("button", {
                    onClick: () => window.location.reload(),
                    className: "mt-4 inline-flex items-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition-colors",
                    children: "Reload App"
                })]
            })
        })
    },
    ht = ({
        children: e,
        mode: s,
        onlineOnly: t
    }) => {
        const a = qe(),
            {
                isOnline: n
            } = N(),
            u = f(m => m.isAuthenticated),
            l = f(m => m.isInitialized),
            d = f(m => m.isLoading),
            h = f(m => m.isTemporaryLocalSession),
            i = E(m => m.profile),
            g = E(m => m.isProfileLoaded),
            A = E(m => m.isLoading),
            T = S(m => m.needsCloudBootstrap),
            v = S(m => m.bootstrapChecked);
        const F = typeof window < "u" ? window.__ISO_BOOT_STATE__ : null,
            Y = F && F.state,
            V = F && F.onboarding,
            G = V && V.completed === true,
            U = V && V.completed === false;
        if (!a) return r.jsx(ae, {});
        if (!l) return r.jsx(ae, {});
        if (Y === "authChecking" || Y === "cloudLoading") return r.jsx(ae, {});
        if (Y === "readyLoggedOut") return r.jsx(z, {
            to: "/auth",
            replace: !0
        });
        if (Y === "syncFailed") return r.jsx(ne, {
            eyebrow: "Cached offline mode",
            title: "Cloud state is unavailable",
            description: "Local server not running or Supabase cannot be reached. No trusted completed cloud snapshot is available on this device, so onboarding will not be shown until cloud state is verified.",
            ctaLabel: "Retry from home",
            ctaTo: "/"
        });
        if ((Y === "readyDashboard" || Y === "offlineCached" && G) && s === "private") return r.jsx(z, {
            to: "/dashboard",
            replace: !0
        });
        if ((Y === "readyNeedsOnboarding" || Y === "offlineCached" && U) && s !== "private") return r.jsx(z, {
            to: "/onboarding",
            replace: !0
        });
        if (s === "private") {
            if (T) return r.jsx(z, {
                to: "/dashboard",
                replace: !0
            })
        } else {
            if (!g || A || d) return r.jsx(oe, {});
            if (!v) return r.jsx(oe, {});

        }
        return t && !M() && !n ? r.jsx(ne, {
            title: t.title,
            description: t.description,
            ctaLabel: t.ctaLabel,
            ctaTo: t.ctaTo
        }) : t && !M() && h ? r.jsx(ne, {
            eyebrow: "Local workspace",
            title: "This feature needs cloud access",
            description: "You’re working locally on this device. Your study data stays available, but community, billing, invites, and cloud sync need a cloud sign-in.",
            ctaLabel: t.ctaLabel,
            ctaTo: t.ctaTo
        }) : r.jsxs(Te, {
            children: [r.jsx(gt, {}), e, r.jsx(p.Suspense, {
                fallback: null,
                children: r.jsx(Qe, {})
            })]
        })
    },
    Lt = Object.freeze(Object.defineProperty({
        __proto__: null,
        default: ht
    }, Symbol.toStringTag, {
        value: "Module"
    }));
export {
    Lt as A, Nt as r
};
