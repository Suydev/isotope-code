import {
    j as e,
    f as we,
    r as t,
    b as fs
} from "./vendor-react-BfU3Zn2J.js";
import {
    S as gs,
    D as ws,
    a as ks,
    P as vs,
    C as js
} from "./DashboardHeader-DNuRMna8.js";
import {
    m as g,
    A as _
} from "./vendor-motion-Cp_NPzpZ.js";
import {
    aj as pt,
    bh as ys,
    bj as Ns,
    M as Ss,
    bN as zs,
    bM as Ts,
    aP as Cs,
    az as ft,
    P as Be,
    f as Re,
    a as ke,
    aG as Is,
    V as ct,
    d as Ee,
    X as ae,
    T as gt,
    B as wt,
    ab as de,
    a0 as $s,
    L as Ps,
    Z as kt,
    af as Ms,
    c9 as Es,
    ca as As,
    aT as Bs,
    cb as vt,
    cc as lt,
    cd as Rs,
    c5 as Ds,
    ce as Gs,
    ae as jt,
    ak as dt,
    b3 as Ls,
    cf as ut,
    cg as mt,
    ch as xt,
    c6 as Os
} from "./vendor-icons-CqruUz7g.js";
import {
    a as ue,
    c as Fs
} from "./timeFormat-CMPo-BX2.js";
import {
    h as B,
    f as Qs,
    g as ne,
    u as De,
    j as Ae,
    A as qs
} from "./useFocusStore-CX_Nyp1h.js";
import {
    h as Y,
    O as ge,
    g as Us,
    $ as yt,
    k as ve,
    a4 as Hs,
    c as _s,
    u as Ws
} from "./App-pJGjDiPw.js";
import {
    S as Vs,
    H as Zs
} from "./SessionEditModal-CNi_rT0l.js";
import {
    a as Ks
} from "./subjectBranding-DaDo_h8r.js";
import {
    u as Nt,
    N as Xs
} from "./useNotificationStore-BS4df28T.js";
import {
    a as Js
} from "./PremiumEffects-BX6T03yQ.js";
import {
    u as Ys
} from "./useAIStore-B2cv1FZz.js";
import {
    D as en,
    g as tn,
    c as bt,
    s as sn,
    a as nn
} from "./focusBackground-t8AknbRg.js";
import "./HeadwayUpdatesButton-DUh668tJ.js";
import "./useOnlineStatus-BJOTUERN.js";
import "./MarkdownRenderer-CIV1x0Uq.js";
import "./index-BPYJFSVW.js";
import "./vendor-router-CmoTwRnm.js";
import "./useSyncStore-vWs_TdIc.js";
import "./IsotopeLogoIcon-oPk5Ru-_.js";
import "./vendor-supabase-DAiUAuun.js";
import "./studyTimeMaps-B0T_-AX0.js";
import "./taskAvailability-B1aDS_ww.js";
import "./utils-D8mZnxMk.js";
import "./vendor-charts-CFLJvnG7.js";
import "./SubjectIcon-CyCDqtel.js";
const an = ({
        mode: s,
        onChange: a
    }) => e.jsxs("div", {
        className: "bg-zinc-100 dark:bg-zinc-900/50 p-1 rounded-2xl inline-flex border border-zinc-200 dark:border-white/5 mb-8",
        children: [e.jsxs("button", {
            onClick: () => a("pomodoro"),
            className: `relative px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-300 ${s==="pomodoro"?"text-zinc-900 dark:text-white":"text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`,
            children: [s === "pomodoro" && e.jsx(g.div, {
                layoutId: "active-tab",
                className: "absolute inset-0 bg-brand-500/10 dark:bg-brand-500/20 rounded-xl shadow-[0_0_12px_rgba(var(--brand-500),0.2)] border border-brand-500/30",
                transition: {
                    type: "spring",
                    bounce: .2,
                    duration: .6
                }
            }), e.jsxs("span", {
                className: `relative z-10 flex items-center gap-2 ${s==="pomodoro"?"text-brand-600 dark:text-brand-400":""}`,
                children: [e.jsx(pt, {
                    className: "w-4 h-4"
                }), " Pomodoro"]
            })]
        }), e.jsxs("button", {
            onClick: () => a("stopwatch"),
            className: `relative px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-300 ${s==="stopwatch"?"text-zinc-900 dark:text-white":"text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`,
            children: [s === "stopwatch" && e.jsx(g.div, {
                layoutId: "active-tab",
                className: "absolute inset-0 bg-brand-500/10 dark:bg-brand-500/20 rounded-xl shadow-[0_0_12px_rgba(var(--brand-500),0.2)] border border-brand-500/30",
                transition: {
                    type: "spring",
                    bounce: .2,
                    duration: .6
                }
            }), e.jsxs("span", {
                className: `relative z-10 flex items-center gap-2 ${s==="stopwatch"?"text-brand-600 dark:text-brand-400":""}`,
                children: [e.jsx(ys, {
                    className: "w-4 h-4"
                }), " Stopwatch"]
            })]
        })]
    }),
    rn = ({
        timeLeft: s,
        totalTime: a,
        mode: w,
        state: i,
        activePhase: x = null,
        pomodoroCycle: d = 1,
        hasBackgroundImage: l = !1,
        isImmersive: c = !1
    }) => {
        const {
            currentSubject: b,
            currentTopic: m,
            sessionDescription: j
        } = B(), p = Y(T => T.profile ?.studyPreferences ?.pomodoroSettings ?.sessionsUntilLongBreak || 4), N = we.useMemo(() => new Date(Date.now() + s * 1e3).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: !1
        }), [s]), h = ue(s, "seconds"), o = h.length > 7, n = h.length > 4, u = x === "break" ? i === "paused" ? "Break Paused" : "Break Time" : i === "paused" ? "Focus Paused" : "Focus Session", k = o ? "text-6xl md:text-7xl lg:text-[6.5rem]" : n ? "text-7xl md:text-8xl lg:text-[8.5rem]" : "text-8xl md:text-9xl lg:text-[10rem]";
        return e.jsxs("div", {
            className: "relative flex flex-col items-center justify-center group mx-auto",
            children: [e.jsx(_, {
                children: (b || m || j) && (c ? e.jsxs(g.div, {
                    initial: {
                        opacity: 0,
                        y: -8
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    exit: {
                        opacity: 0,
                        y: -8
                    },
                    className: "mb-4 text-center pointer-events-none w-full",
                    children: [b && m && e.jsx("div", {
                        className: "text-white/50 font-bold uppercase tracking-widest text-[10px] mb-1",
                        children: b
                    }), (m || b) && e.jsx("h2", {
                        className: "text-xl lg:text-3xl font-bold bg-gradient-to-r from-brand-400 to-brand-500 bg-clip-text text-transparent truncate max-w-full",
                        children: m || b
                    }), j && e.jsx("p", {
                        className: "text-sm text-white/40 mt-1 italic font-medium",
                        children: j
                    })]
                }, "immersive-context") : e.jsxs(g.div, {
                    initial: {
                        opacity: 0,
                        y: -10
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    exit: {
                        opacity: 0,
                        y: -10
                    },
                    className: "absolute -top-14 text-center pointer-events-none w-[120%]",
                    children: [b && m && e.jsx("div", {
                        className: "text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest text-[10px] mb-1",
                        children: b
                    }), (m || b) && e.jsx("h2", {
                        className: "text-xl lg:text-3xl font-bold bg-gradient-to-r from-brand-500 to-brand-500 bg-clip-text text-transparent truncate max-w-full",
                        children: m || b
                    }), j && e.jsx("p", {
                        className: "text-sm text-zinc-400 dark:text-zinc-500 mt-1 italic font-medium",
                        children: j
                    })]
                }, "normal-context"))
            }), e.jsxs("div", {
                className: `relative z-10 text-center transition-all duration-300 max-w-[95vw] ${l?"bg-white/30 dark:bg-black/40 backdrop-blur-3xl backdrop-saturate-150 border border-white/40 dark:border-white/10 shadow-lg rounded-[2.5rem] px-10 py-8 ring-1 ring-black/5 dark:ring-white/5":""}`,
                children: [e.jsx("div", {
                    className: `${k} whitespace-nowrap leading-none font-display font-bold tracking-tighter tabular-nums ${l?"text-zinc-900 dark:text-white":"bg-gradient-to-b from-zinc-800 to-black dark:from-white dark:to-zinc-500 bg-clip-text text-transparent"} drop-shadow-2xl select-none transition-all duration-300 ${l?"[text-shadow:_0_2px_20px_rgba(255,255,255,0.3)] dark:[text-shadow:none]":""}`,
                    children: h
                }), w === "pomodoro" && e.jsxs("div", {
                    className: "flex flex-col items-center gap-4 mt-6",
                    children: [e.jsxs("div", {
                        className: "text-zinc-400 font-medium flex items-center justify-center gap-3 uppercase tracking-widest text-xs lg:text-sm",
                        children: [e.jsx("span", {
                            className: `w-2.5 h-2.5 rounded-full ${x==="break"?"bg-sky-500 animate-pulse":i==="running"?"bg-emerald-500 animate-pulse":"bg-zinc-700"}`
                        }), u, " • Pomodoro ", d, " of ", p]
                    }), (i === "running" || i === "break") && e.jsxs(g.div, {
                        initial: {
                            opacity: 0,
                            scale: .95
                        },
                        animate: {
                            opacity: 1,
                            scale: 1
                        },
                        className: "flex items-center gap-2 px-3 py-1 bg-zinc-100 dark:bg-zinc-800/40 backdrop-blur-md border border-zinc-200 dark:border-white/10 rounded-full shadow-sm",
                        children: [e.jsx(Ns, {
                            className: "w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400"
                        }), e.jsx("span", {
                            className: "text-sm font-bold text-zinc-600 dark:text-zinc-200 tabular-nums",
                            children: N
                        })]
                    })]
                })]
            })]
        })
    },
    le = ({
        onClick: s,
        icon: a,
        label: w,
        primary: i,
        success: x,
        className: d,
        hasBackgroundImage: l
    }) => e.jsx(g.button, {
        whileHover: {
            scale: 1.05,
            backgroundColor: l ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.15)"
        },
        whileTap: {
            scale: .95
        },
        onClick: s,
        title: w,
        className: `
            w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300
            backdrop-blur-md shadow-sm border
            ${i?"bg-zinc-900 dark:bg-white text-white dark:text-black border-zinc-800 dark:border-white shadow-lg shadow-black/10 dark:shadow-white/10":x?"bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 border-brand-500/20 dark:border-brand-500/30":l?"bg-white/10 dark:bg-white/5 text-white dark:text-zinc-400 border-white/20 dark:border-white/10 hover:bg-white/20":"bg-zinc-100/80 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-white/10 hover:bg-zinc-200/80 dark:hover:bg-white/10"}
            ${d}
        `,
        children: e.jsx(a, {
            className: `w-6 h-6 ${i?"fill-current":""}`,
            strokeWidth: 2
        })
    }),
    on = ({
        isRunning: s,
        mode: a,
        timerState: w = "idle",
        activePhase: i = null,
        onToggle: x,
        onReset: d,
        onSkip: l,
        onAddTime: c,
        onRemoveTime: b,
        onComplete: m,
        hasBackgroundImage: j
    }) => {
        const p = i === "break" ? "Skip Break" : "Skip to Break",
            N = w === "paused" ? i === "break" ? "Resume Break" : "Resume Session" : s ? i === "break" ? "Pause Break" : "Pause Session" : "Start Session";
        return e.jsxs("div", {
            className: "flex items-center gap-4 lg:gap-6 justify-center flex-nowrap whitespace-nowrap",
            children: [a === "pomodoro" && e.jsx(g.div, {
                initial: {
                    opacity: 0,
                    x: 20
                },
                animate: {
                    opacity: 1,
                    x: 0
                },
                transition: {
                    delay: .1
                },
                children: e.jsx(le, {
                    onClick: b,
                    icon: Ss,
                    hasBackgroundImage: j
                })
            }), e.jsx(g.div, {
                initial: {
                    opacity: 0,
                    x: 20
                },
                animate: {
                    opacity: 1,
                    x: 0
                },
                transition: {
                    delay: .1
                },
                children: e.jsx(le, {
                    onClick: d,
                    icon: zs,
                    hasBackgroundImage: j
                })
            }), e.jsxs(g.button, {
                whileHover: {
                    scale: 1.05,
                    boxShadow: "0 0 40px -10px rgb(var(--brand-500) / 0.5)"
                },
                whileTap: {
                    scale: .95
                },
                onClick: x,
                title: N,
                className: `
                    relative w-24 h-16 rounded-2xl flex items-center justify-center transition-all duration-500
                    shadow-2xl border backdrop-blur-xl group flex-shrink-0
                    ${s?j?"bg-white/20 text-white border-white/30":"bg-white/70 dark:bg-zinc-900/80 text-zinc-800 dark:text-white border-zinc-200/50 dark:border-white/5":"bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-brand-500/30 border-brand-500/50"}
                `,
                children: [e.jsx("div", {
                    className: `absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${s?"bg-black/5 dark:bg-white/5":"bg-white/20"}`
                }), s ? e.jsx(Ts, {
                    className: "w-8 h-8 fill-current",
                    strokeWidth: 0
                }) : e.jsx(Cs, {
                    className: "w-8 h-8 fill-current ml-1",
                    strokeWidth: 0
                })]
            }), e.jsx(g.div, {
                initial: {
                    opacity: 0,
                    x: -20
                },
                animate: {
                    opacity: 1,
                    x: 0
                },
                transition: {
                    delay: .1
                },
                className: "flex gap-4",
                children: a === "pomodoro" ? e.jsxs(e.Fragment, {
                    children: [e.jsx(le, {
                        onClick: l,
                        icon: ft,
                        label: p,
                        hasBackgroundImage: j
                    }), e.jsx(le, {
                        onClick: c,
                        icon: Be,
                        hasBackgroundImage: j
                    })]
                }) : e.jsx(le, {
                    onClick: m,
                    icon: Re,
                    success: !0,
                    hasBackgroundImage: j
                })
            })]
        })
    },
    cn = ({
        hasBackgroundImage: s = !1
    }) => {
        const {
            sessions: a
        } = B(), {
            profile: w
        } = Y(), i = Qs(w ?.studyPreferences), x = t.useMemo(() => {
            const d = ne(new Date, i),
                l = a.filter(p => ne(p.startTime, i) === d && p.completed),
                c = l.reduce((p, N) => p + N.duration, 0),
                b = new Set(a.filter(p => p.completed).map(p => ne(p.startTime, i)));
            let m = 0;
            const j = new Date;
            for (;;) {
                const p = ne(j, i);
                if (b.has(p)) m++, j.setDate(j.getDate() - 1);
                else break
            }
            return [{
                icon: Re,
                label: "Today",
                value: `${l.length}`,
                color: "text-emerald-500"
            }, {
                icon: ke,
                label: "Focus Time",
                value: ue(c),
                color: "text-brand-500"
            }, {
                icon: Is,
                label: "Streak",
                value: m > 0 ? `${m} Day${m>1?"s":""}` : "Start!",
                color: "text-orange-500"
            }]
        }, [i, a]);
        return e.jsx("div", {
            className: `border rounded-3xl p-5 transition-all ring-1 ring-black/5 dark:ring-white/5 flex items-center justify-between ${s?"bg-white/30 dark:bg-black/40 backdrop-blur-2xl backdrop-saturate-150 border-white/40 dark:border-white/10 shadow-lg":"bg-white dark:bg-zinc-900/40 backdrop-blur-md border-zinc-200/60 dark:border-white/[0.06] shadow-sm"}`,
            children: x.map((d, l) => e.jsxs(we.Fragment, {
                children: [e.jsxs("div", {
                    className: "flex flex-col items-center justify-center text-center flex-1",
                    children: [e.jsx(d.icon, {
                        className: `w-5 h-5 ${d.color} mb-2 drop-shadow-sm`
                    }), e.jsx("div", {
                        className: "text-xl font-bold text-zinc-900 dark:text-white leading-none mb-1.5",
                        children: d.value
                    }), e.jsx("div", {
                        className: "text-[10px] text-zinc-500 uppercase tracking-widest font-semibold",
                        children: d.label
                    })]
                }), l < x.length - 1 && e.jsx("div", {
                    className: "w-[1px] h-10 bg-zinc-200 dark:bg-white/10"
                })]
            }, l))
        })
    },
    ln = ({
        hasBackgroundImage: s = !1
    }) => {
        const {
            calculateTodayMinutes: a,
            sessions: w
        } = B(), {
            profile: i,
            updateProfile: x
        } = Y(), {
            subjects: d
        } = De(), l = i ?.studyPreferences ?.dayOffset ?? 0, [c, b] = t.useState(!1), [m, j] = t.useState(6), [p, N] = t.useState(!1), [h, o] = t.useState(0), [n, u] = t.useState([]), [k, T] = t.useState(!1), [z, $] = t.useState(""), [f, M] = t.useState(20), R = i ?.studyPreferences ?.dailyGoalHours ? i.studyPreferences.dailyGoalHours * 60 : i ?.focusSettings ?.dailyGoalMinutes || 360, G = a(), F = Math.min(G / R * 100, 100), E = t.useMemo(() => {
            const r = i ?.studyPreferences ?.dailyQuestionGoal || 0,
                y = i ?.studyPreferences ?.subjectQuestionGoals || {},
                I = ne(new Date, l),
                L = w.filter(O => ne(O.startTime, l) === I && O.questionsAttempted && O.questionsAttempted > 0),
                re = L.reduce((O, K) => O + (K.questionsAttempted || 0), 0),
                H = {};
            return L.forEach(O => {
                O.subjectIds && O.subjectIds.forEach(K => {
                    const ie = O.questionsAttempted || 0,
                        me = O.subjectIds.length;
                    H[K] = (H[K] || 0) + Math.floor(ie / me)
                })
            }), {
                dailyGoal: r,
                todayQuestions: re,
                questionsBySubject: H,
                subjectGoals: y
            }
        }, [l, i ?.studyPreferences, w]), U = t.useMemo(() => {
            const r = E.questionsBySubject;
            return n.map(y => {
                const I = r[y.subjectId] || 0,
                    L = d.find(H => H.id === y.subjectId),
                    re = Ks(L ?.color);
                return { ...y,
                    subjectName: L ?.name || "Unknown",
                    subjectColor: re,
                    current: I,
                    percentage: Math.min(I / y.target * 100, 100)
                }
            })
        }, [n, E, d]), q = E.dailyGoal > 0 ? Math.min(E.todayQuestions / E.dailyGoal * 100, 100) : 0;
        t.useEffect(() => {
            const r = [],
                y = i ?.studyPreferences ?.subjectQuestionGoals || {};
            Object.entries(y).forEach(([I, L]) => {
                L > 0 && r.push({
                    subjectId: I,
                    target: L
                })
            }), u(r), o(i ?.studyPreferences ?.dailyQuestionGoal || 0)
        }, [i ?.studyPreferences]);
        const V = () => {
                const r = Math.max(1, Math.min(24, m)),
                    y = { ...i ?.studyPreferences,
                        dailyGoalHours : r
                    },
                    I = { ...i ?.focusSettings,
                        dailyGoalMinutes : r * 60
                    };
                x({
                    studyPreferences: y,
                    focusSettings: I
                }), b(!1)
            },
            W = () => {
                const r = { ...i ?.studyPreferences,
                    dailyQuestionGoal : h,
                    subjectQuestionGoals: n.reduce((y, I) => (y[I.subjectId] = I.target, y), {})
                };
                x({
                    studyPreferences: r
                }), N(!1)
            },
            Q = () => {
                if (!z) return;
                const r = n.findIndex(y => y.subjectId === z);
                if (r >= 0) {
                    const y = [...n];
                    y[r].target = f, u(y)
                } else u([...n, {
                    subjectId: z,
                    target: f
                }]);
                T(!1), $(""), M(20)
            },
            Z = r => {
                u(n.filter(y => y.subjectId !== r))
            },
            ee = d.filter(r => !n.find(y => y.subjectId === r.id));
        return e.jsxs("div", {
            className: `border rounded-3xl p-5 transition-all ring-1 ring-black/5 dark:ring-white/5 ${s?"bg-white/30 dark:bg-black/40 backdrop-blur-2xl backdrop-saturate-150 border-white/40 dark:border-white/10 shadow-lg":"bg-white dark:bg-zinc-900/40 backdrop-blur-md border-zinc-200/60 dark:border-white/[0.06] shadow-sm"}`,
            children: [e.jsxs("div", {
                className: "mb-6",
                children: [e.jsxs("div", {
                    className: "flex items-center justify-between mb-4",
                    children: [e.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [e.jsx("span", {
                            className: "text-xs font-bold text-zinc-500 uppercase tracking-widest",
                            children: "Daily Study Goal"
                        }), !c && e.jsx("button", {
                            onClick: () => b(!0),
                            className: "p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors",
                            children: e.jsx(ct, {
                                className: "w-3 h-3"
                            })
                        })]
                    }), c ? e.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [e.jsx("input", {
                            type: "number",
                            min: "1",
                            max: "24",
                            className: "w-12 px-1 py-0.5 text-sm bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-brand-500",
                            value: m,
                            onChange: r => j(parseInt(r.target.value) || 0)
                        }), e.jsx("span", {
                            className: "text-xs text-zinc-500",
                            children: "hrs"
                        }), e.jsx("button", {
                            onClick: V,
                            className: "p-1 text-brand-500 hover:bg-brand-500/10 rounded-full",
                            children: e.jsx(Ee, {
                                className: "w-3 h-3"
                            })
                        }), e.jsx("button", {
                            onClick: () => b(!1),
                            className: "p-1 text-red-500 hover:bg-red-500/10 rounded-full",
                            children: e.jsx(ae, {
                                className: "w-3 h-3"
                            })
                        })]
                    }) : e.jsxs("span", {
                        className: "text-sm font-bold text-zinc-900 dark:text-white",
                        children: [ue(G), " / ", ue(R)]
                    })]
                }), e.jsx("div", {
                    className: "h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden",
                    children: e.jsx(g.div, {
                        initial: {
                            width: 0
                        },
                        animate: {
                            width: `${F}%`
                        },
                        transition: {
                            duration: 1,
                            ease: "easeOut"
                        },
                        className: "h-full bg-gradient-to-r from-brand-500 to-brand-500"
                    })
                }), F >= 100 && e.jsx("div", {
                    className: "mt-2 text-xs text-emerald-400 font-medium text-center",
                    children: "🎉 Study goal achieved!"
                })]
            }), e.jsxs("div", {
                className: "border-t border-zinc-100 dark:border-white/5 pt-4",
                children: [e.jsxs("div", {
                    className: "flex items-center justify-between mb-4",
                    children: [e.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [e.jsx(gt, {
                            className: "w-4 h-4 text-brand-500"
                        }), e.jsx("span", {
                            className: "text-xs font-bold text-brand-500 uppercase tracking-widest",
                            children: "Daily Question Goal"
                        }), !p && e.jsx("button", {
                            onClick: () => N(!0),
                            className: "p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors",
                            children: e.jsx(ct, {
                                className: "w-3 h-3"
                            })
                        })]
                    }), p ? e.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [e.jsx("input", {
                            type: "number",
                            min: "0",
                            max: "500",
                            className: "w-16 px-1 py-0.5 text-sm bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-brand-500",
                            value: h,
                            onChange: r => o(parseInt(r.target.value) || 0)
                        }), e.jsx("span", {
                            className: "text-xs text-zinc-500",
                            children: "ques"
                        }), e.jsx("button", {
                            onClick: W,
                            className: "p-1 text-brand-500 hover:bg-brand-500/10 rounded-full",
                            children: e.jsx(Ee, {
                                className: "w-3 h-3"
                            })
                        }), e.jsx("button", {
                            onClick: () => N(!1),
                            className: "p-1 text-red-500 hover:bg-red-500/10 rounded-full",
                            children: e.jsx(ae, {
                                className: "w-3 h-3"
                            })
                        })]
                    }) : e.jsxs("span", {
                        className: "text-sm font-bold text-zinc-900 dark:text-white",
                        children: [E.todayQuestions, " / ", E.dailyGoal || "-"]
                    })]
                }), E.dailyGoal > 0 && e.jsx("div", {
                    className: "h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden mb-3",
                    children: e.jsx(g.div, {
                        initial: {
                            width: 0
                        },
                        animate: {
                            width: `${q}%`
                        },
                        transition: {
                            duration: 1,
                            ease: "easeOut"
                        },
                        className: "h-full bg-gradient-to-r from-brand-500 to-brand-400"
                    })
                }), q >= 100 && E.dailyGoal > 0 && e.jsx("div", {
                    className: "mb-3 text-xs text-amber-400 font-medium text-center",
                    children: "🎉 Question goal achieved!"
                }), U.length > 0 && e.jsxs("div", {
                    className: "space-y-3 mt-4",
                    children: [e.jsxs("div", {
                        className: "flex items-center gap-2 mb-3",
                        children: [e.jsx(wt, {
                            className: "w-4 h-4 text-brand-500"
                        }), e.jsx("span", {
                            className: "text-xs font-bold text-zinc-500 uppercase tracking-widest",
                            children: "Subject-wise Progress"
                        })]
                    }), U.map(r => e.jsxs("div", {
                        className: "relative",
                        children: [e.jsxs("div", {
                            className: "flex items-center justify-between mb-1",
                            children: [e.jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [e.jsx("div", {
                                    className: "w-2 h-2 rounded-full",
                                    style: {
                                        backgroundColor: r.subjectColor
                                    }
                                }), e.jsx("span", {
                                    className: "text-xs text-zinc-600 dark:text-zinc-300",
                                    children: r.subjectName
                                })]
                            }), e.jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [e.jsxs("span", {
                                    className: "text-xs text-zinc-500",
                                    children: [r.current, " / ", r.target]
                                }), p && e.jsx("button", {
                                    onClick: () => Z(r.subjectId),
                                    className: "p-0.5 text-red-400 hover:text-red-600",
                                    children: e.jsx(de, {
                                        className: "w-3 h-3"
                                    })
                                })]
                            })]
                        }), e.jsx("div", {
                            className: "h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden",
                            children: e.jsx(g.div, {
                                initial: {
                                    width: 0
                                },
                                animate: {
                                    width: `${r.percentage}%`
                                },
                                transition: {
                                    duration: .5
                                },
                                className: "h-full rounded-full",
                                style: {
                                    backgroundColor: r.subjectColor
                                }
                            })
                        })]
                    }, r.subjectId))]
                }), p && e.jsx("div", {
                    className: "mt-4",
                    children: k ? e.jsxs("div", {
                        className: "flex items-center gap-2 p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg",
                        children: [e.jsxs("select", {
                            value: z,
                            onChange: r => $(r.target.value),
                            className: "flex-1 px-2 py-1 text-xs bg-white dark:bg-zinc-700 rounded border border-zinc-200 dark:border-zinc-600 focus:outline-none",
                            children: [e.jsx("option", {
                                value: "",
                                children: "Select Subject"
                            }), ee.map(r => e.jsx("option", {
                                value: r.id,
                                children: r.name
                            }, r.id))]
                        }), e.jsx("input", {
                            type: "number",
                            min: "1",
                            max: "200",
                            value: f,
                            onChange: r => M(parseInt(r.target.value) || 0),
                            className: "w-16 px-2 py-1 text-xs bg-white dark:bg-zinc-700 rounded border border-zinc-200 dark:border-zinc-600 focus:outline-none",
                            placeholder: "Target"
                        }), e.jsx("button", {
                            onClick: Q,
                            disabled: !z,
                            className: "p-1 text-brand-500 hover:bg-brand-500/10 rounded disabled:opacity-50",
                            children: e.jsx(Ee, {
                                className: "w-4 h-4"
                            })
                        }), e.jsx("button", {
                            onClick: () => T(!1),
                            className: "p-1 text-red-500 hover:bg-red-500/10 rounded",
                            children: e.jsx(ae, {
                                className: "w-4 h-4"
                            })
                        })]
                    }) : ee.length > 0 && e.jsxs("button", {
                        onClick: () => T(!0),
                        className: "flex items-center gap-1 text-xs text-brand-500 hover:text-brand-600 transition-colors",
                        children: [e.jsx(Be, {
                            className: "w-3 h-3"
                        }), "Add Subject Goal"]
                    })
                })]
            })]
        })
    },
    dn = ({
        hasBackgroundImage: s = !1
    }) => {
        const {
            sessions: a,
            currentSubjectIds: w,
            currentChapterIds: i,
            currentTopicIds: x,
            currentTaskIds: d,
            currentSubject: l,
            currentSubjectId: c
        } = B(), [b, m] = we.useState(null), [j, p] = we.useState(!1), N = () => {
            const n = {
                id: Us(),
                subjectIds: w,
                chapterIds: i,
                topicIds: x,
                taskIds: d,
                subject: l || "General",
                subjectId: c || void 0,
                topic: "Manual Session",
                duration: 25,
                startTime: ge(),
                endTime: ge(),
                type: "Practice",
                taskType: "practice",
                pauseLogs: [],
                totalPauseTime: 0,
                efficiency: 100,
                productivityRating: 5,
                completed: !0,
                createdAt: ge(),
                updatedAt: ge()
            };
            m(n), p(!0)
        }, h = [...a].filter(n => n.completed).sort((n, u) => new Date(u.startTime).getTime() - new Date(n.startTime).getTime()).slice(0, 5), o = n => {
            const u = new Date(n),
                T = new Date().getTime() - u.getTime(),
                z = Math.floor(T / 6e4),
                $ = Math.floor(z / 60),
                f = Math.floor($ / 24);
            return z < 60 ? `${z}m ago` : $ < 24 ? `${$}h ago` : f === 1 ? "Yesterday" : `${f}d ago`
        };
        return e.jsxs("div", {
            className: `border rounded-3xl p-5 relative transition-all ring-1 ring-black/5 dark:ring-white/5 ${s?"bg-white/30 dark:bg-black/40 backdrop-blur-2xl backdrop-saturate-150 border-white/40 dark:border-white/10 shadow-lg":"bg-white dark:bg-zinc-900/40 backdrop-blur-md border-zinc-200/60 dark:border-white/[0.06] shadow-sm"}`,
            children: [e.jsxs("div", {
                className: "flex items-center justify-between mb-4",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [e.jsx($s, {
                        className: "w-4 h-4 text-zinc-500"
                    }), e.jsx("h3", {
                        className: "text-xs font-bold text-zinc-500 uppercase tracking-widest",
                        children: "Recent Sessions"
                    })]
                }), e.jsx("button", {
                    onClick: N,
                    className: "p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors",
                    title: "Log past session",
                    children: e.jsx(Be, {
                        className: "w-4 h-4"
                    })
                })]
            }), e.jsx(_, {
                children: b && e.jsx(Vs, {
                    session: b,
                    isOpen: !!b,
                    onClose: () => {
                        m(null), p(!1)
                    },
                    isNew: j
                })
            }), e.jsx("div", {
                className: "space-y-3",
                children: h.length === 0 ? e.jsxs("div", {
                    className: "text-center py-6",
                    children: [e.jsx("div", {
                        className: "text-zinc-500 text-sm mb-1",
                        children: "No sessions yet"
                    }), e.jsx("div", {
                        className: "text-zinc-400 dark:text-zinc-600 text-xs",
                        children: "Start a focus session to see your history"
                    })]
                }) : h.map((n, u) => e.jsxs("div", {
                    className: "flex flex-col gap-3 rounded-xl bg-zinc-50/50 p-3 transition-colors hover:bg-zinc-100 dark:bg-white/[0.02] dark:hover:bg-white/[0.06] min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between",
                    onClick: () => m(n),
                    children: [e.jsxs("div", {
                        className: "flex-1 min-w-0",
                        children: [e.jsx("div", {
                            className: "mb-1 line-clamp-2 text-sm font-medium text-zinc-900 dark:text-white",
                            children: n.topic || n.subject
                        }), e.jsxs("div", {
                            className: "flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500",
                            children: [e.jsxs("span", {
                                className: "flex items-center gap-1",
                                children: [e.jsx(ke, {
                                    className: "w-3 h-3"
                                }), ue(n.duration)]
                            }), e.jsx("span", {
                                "aria-hidden": "true",
                                children: "•"
                            }), e.jsx("span", {
                                children: o(n.startTime)
                            })]
                        })]
                    }), e.jsx("div", {
                        className: "w-fit rounded-lg border border-zinc-300 bg-zinc-200 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:border-white/5 dark:bg-zinc-800 dark:text-zinc-400 min-[420px]:ml-2",
                        children: n.type || "Focus"
                    })]
                }, `${n.id}-${u}`))
            })]
        })
    },
    un = () => {
        const {
            mode: s,
            sessionType: a,
            taskType: w,
            questionsAttempted: i,
            questionsCorrect: x,
            questionsIncorrect: d,
            questionsSkipped: l,
            targetQuestions: c,
            stopwatchTime: b,
            timeLeft: m,
            totalTime: j,
            timerState: p,
            setTargetQuestions: N,
            recordQuestionResult: h,
            undoLastQuestionResult: o,
            questionActionHistory: n,
            currentSubjectIds: u,
            currentChapterIds: k
        } = B(), {
            subjects: T
        } = De(), z = Y(r => r.profile ?.focusSettings ?.focusTypes), [$, f] = t.useState(!1), [M, R] = t.useState(""), G = u.map(r => T.find(y => y.id === r)).filter(Boolean), F = k.map(r => {
            for (const y of T) {
                const I = y.chapters.find(L => L.id === r);
                if (I) return { ...I,
                    subjectName: y.name
                }
            }
            return null
        }).filter(Boolean), U = !!yt(z, a, w), q = t.useRef({
            handleAction: h,
            handleUndo: o
        });
        if (t.useEffect(() => {
                q.current = {
                    handleAction: h,
                    handleUndo: o
                }
            }, [h, o]), t.useEffect(() => {
                if (!U || p !== "running") return;
                const r = y => {
                    if (!(document.activeElement ?.tagName === "INPUT" || document.activeElement ?.tagName === "TEXTAREA")) switch (y.key.toLowerCase()) {
                        case "c":
                            q.current.handleAction("correct");
                            break;
                        case "x":
                            q.current.handleAction("incorrect");
                            break;
                        case "s":
                            q.current.handleAction("skipped");
                            break;
                        case "z":
                            (y.ctrlKey || y.metaKey) && q.current.handleUndo();
                            break
                    }
                };
                return window.addEventListener("keydown", r), () => window.removeEventListener("keydown", r)
            }, [U, p]), !U) return null;
        const V = s === "stopwatch" ? Math.max(0, b) : Math.max(0, j - m),
            W = i > 0 ? V / i : 0;
        let Q = null,
            Z = "text-zinc-400";
        if (c > 0 && V > 0) {
            const r = c / j * V;
            i >= r ? (Q = "On Pace", Z = "text-emerald-400 dark:text-emerald-500") : (Q = "Behind Pace", Z = "text-rose-400 dark:text-rose-500")
        }
        const ee = r => {
            if (r === 0) return "--";
            if (r < 60) return `${Math.round(r)}s/q`;
            const y = Math.floor(r / 60),
                I = Math.round(r % 60);
            return `${y}m ${I}s/q`
        };
        return e.jsxs(g.div, {
            initial: {
                opacity: 0,
                y: 10
            },
            animate: {
                opacity: 1,
                y: 0
            },
            className: "mt-6 flex flex-col items-center justify-center gap-4 w-full",
            children: [(G.length > 0 || F.length > 0) && e.jsxs("div", {
                className: "flex items-center gap-2 text-xs text-zinc-400",
                children: [G.length > 0 && e.jsxs("div", {
                    className: "flex items-center gap-1",
                    children: [e.jsx(wt, {
                        className: "w-3 h-3"
                    }), e.jsx("span", {
                        children: G.map(r => r ?.name).join(", ")
                    })]
                }), F.length > 0 && e.jsxs("div", {
                    className: "flex items-center gap-1",
                    children: [e.jsx(Ps, {
                        className: "w-3 h-3"
                    }), e.jsx("span", {
                        children: F.map(r => r ?.title).join(", ")
                    })]
                })]
            }), e.jsxs("div", {
                className: "flex flex-col sm:flex-row items-center gap-4 sm:gap-6 px-6 py-3 bg-white/50 dark:bg-black/20 backdrop-blur-md rounded-full border border-zinc-200/50 dark:border-white/10 shadow-lg relative z-20",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-4 border-b sm:border-b-0 sm:border-r border-zinc-200 dark:border-white/10 pb-3 sm:pb-0 sm:pr-4",
                    children: [e.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [e.jsx("span", {
                            className: "text-2xl font-bold bg-gradient-to-r from-brand-400 to-brand-400 bg-clip-text text-transparent leading-none tabular-nums",
                            children: i
                        }), c > 0 ? e.jsxs("span", {
                            className: "text-zinc-500 text-sm font-medium",
                            children: ["/ ", c]
                        }) : e.jsxs("button", {
                            onClick: () => f(!0),
                            className: "text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer flex items-center gap-1",
                            children: [e.jsx(gt, {
                                className: "w-3 h-3"
                            }), " Target"]
                        })]
                    }), e.jsxs("div", {
                        className: "flex items-center gap-3 text-xs font-medium",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400",
                            children: [e.jsx(kt, {
                                className: "w-3.5 h-3.5 text-amber-500/70"
                            }), ee(W)]
                        }), Q && e.jsx("div", {
                            className: `${Z} px-2 py-0.5 rounded-full bg-black/5 dark:bg-black/20`,
                            children: Q
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [e.jsx("button", {
                        onClick: () => h("correct"),
                        className: "flex items-center justify-center w-10 h-10 bg-emerald-500/10 hover:bg-emerald-500/20 active:bg-emerald-500/30 border border-emerald-500/20 rounded-full transition-all hover:scale-105 group relative overflow-hidden",
                        title: "Shortcut: C",
                        children: e.jsx(Re, {
                            className: "w-5 h-5 text-emerald-400 relative z-10"
                        })
                    }), e.jsx("span", {
                        className: "text-emerald-400 font-bold text-sm w-4 text-center tabular-nums",
                        children: x
                    }), e.jsx("button", {
                        onClick: () => h("incorrect"),
                        className: "flex items-center justify-center w-10 h-10 bg-rose-500/10 hover:bg-rose-500/20 active:bg-rose-500/30 border border-rose-500/20 rounded-full transition-all hover:scale-105 group ml-2 relative overflow-hidden",
                        title: "Shortcut: X",
                        children: e.jsx(Ms, {
                            className: "w-5 h-5 text-rose-400 relative z-10"
                        })
                    }), e.jsx("span", {
                        className: "text-rose-400 font-bold text-sm w-4 text-center tabular-nums",
                        children: d
                    }), e.jsx("button", {
                        onClick: () => h("skipped"),
                        className: "flex items-center justify-center w-10 h-10 bg-amber-500/10 hover:bg-amber-500/20 active:bg-amber-500/30 border border-amber-500/20 rounded-full transition-all hover:scale-105 group ml-2 relative overflow-hidden",
                        title: "Shortcut: S",
                        children: e.jsx(ft, {
                            className: "w-5 h-5 text-amber-400 relative z-10"
                        })
                    }), e.jsx("span", {
                        className: "text-amber-400 font-bold text-sm w-4 text-center tabular-nums",
                        children: l
                    })]
                })]
            }), e.jsx(_, {
                children: n.length > 0 && e.jsx(g.div, {
                    initial: {
                        opacity: 0,
                        y: -10,
                        scale: .9
                    },
                    animate: {
                        opacity: 1,
                        y: 0,
                        scale: 1
                    },
                    exit: {
                        opacity: 0,
                        y: -10,
                        scale: .9
                    },
                    className: "relative z-10",
                    children: e.jsxs("button", {
                        onClick: o,
                        className: "flex items-center gap-1.5 px-3 py-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 bg-white/60 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 border border-zinc-200/50 dark:border-white/5 rounded-full transition-colors text-[11px] uppercase tracking-wider font-semibold shadow-sm",
                        title: "Shortcut: Ctrl+Z or Cmd+Z",
                        children: [e.jsx(Es, {
                            className: "w-3 h-3"
                        }), "Undo Last (", n[n.length - 1].action, ")"]
                    })
                })
            }), e.jsx(_, {
                children: $ && e.jsx(g.div, {
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    exit: {
                        opacity: 0
                    },
                    className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50",
                    onClick: () => f(!1),
                    children: e.jsxs(g.div, {
                        initial: {
                            scale: .9,
                            opacity: 0
                        },
                        animate: {
                            scale: 1,
                            opacity: 1
                        },
                        exit: {
                            scale: .9,
                            opacity: 0
                        },
                        className: "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl",
                        onClick: r => r.stopPropagation(),
                        children: [e.jsxs("div", {
                            className: "flex items-center justify-between mb-4",
                            children: [e.jsx("h3", {
                                className: "text-lg font-semibold text-zinc-900 dark:text-white",
                                children: "Set Target Questions"
                            }), e.jsx("button", {
                                onClick: () => f(!1),
                                className: "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white transition-colors",
                                children: e.jsx(ae, {
                                    className: "w-5 h-5"
                                })
                            })]
                        }), e.jsx("input", {
                            type: "number",
                            value: M,
                            onChange: r => R(r.target.value),
                            placeholder: "Enter number of questions",
                            className: "w-full px-4 py-3 bg-zinc-50 dark:bg-black/30 border border-zinc-200 dark:border-white/10 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 mb-4",
                            autoFocus: !0,
                            min: 1
                        }), e.jsxs("div", {
                            className: "flex gap-3",
                            children: [e.jsx("button", {
                                onClick: () => f(!1),
                                className: "flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-colors",
                                children: "Cancel"
                            }), e.jsx("button", {
                                onClick: () => {
                                    const r = parseInt(M, 10);
                                    !isNaN(r) && r > 0 && (N(r), R(""), f(!1))
                                },
                                className: "flex-1 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl transition-colors",
                                children: "Set Target"
                            })]
                        })]
                    })
                })
            })]
        })
    },
    mn = ({
        hasBackgroundImage: s = !1
    }) => {
        const [a, w] = t.useState(null), [i, x] = t.useState(50), d = t.useRef(null), l = [{
            id: "rain",
            icon: As,
            label: "Rain",
            url: "/sounds/rain.wav"
        }, {
            id: "Cricket",
            icon: Bs,
            label: "Cricket",
            url: "/sounds/crickets.wav"
        }, {
            id: "wind",
            icon: vt,
            label: "Wind",
            url: "/sounds/wind.wav"
        }];
        return t.useEffect(() => {
            if (d.current && (d.current.pause(), d.current = null), a) {
                const c = l.find(b => b.id === a);
                if (c && c.url) {
                    const b = new Audio(c.url);
                    b.loop = !0, b.volume = i / 100, b.play().catch(m => console.error("Audio play failed:", m)), d.current = b
                }
            }
        }, [a]), t.useEffect(() => {
            d.current && (d.current.volume = i / 100)
        }, [i]), e.jsxs("div", {
            className: `border rounded-3xl p-5 mb-6 transition-all ring-1 ring-black/5 dark:ring-white/5 ${s?"bg-white/30 dark:bg-black/40 backdrop-blur-2xl backdrop-saturate-150 border-white/40 dark:border-white/10 shadow-lg":"bg-white dark:bg-zinc-900/40 backdrop-blur-md border-zinc-200/60 dark:border-white/[0.06] shadow-sm"}`,
            children: [e.jsxs("div", {
                className: "flex items-center justify-between mb-4",
                children: [e.jsx("h3", {
                    className: "text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest flex items-center gap-2",
                    children: "Ambient Sounds"
                }), a && e.jsx(lt, {
                    className: "w-4 h-4 text-brand-500"
                })]
            }), e.jsxs("div", {
                className: `flex gap-2 ${a?"mb-5":""}`,
                children: [e.jsxs("button", {
                    onClick: () => w(null),
                    className: `flex-1 p-3 rounded-2xl transition-all flex flex-col items-center gap-2 border ${a===null?"bg-zinc-100 dark:bg-white/10 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white shadow-sm":"bg-zinc-50/50 dark:bg-white/[0.02] border-zinc-200/50 dark:border-white/[0.05] text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/[0.06]"}`,
                    children: [e.jsx(Rs, {
                        className: "w-5 h-5"
                    }), e.jsx("span", {
                        className: "text-[11px] font-semibold tracking-wide",
                        children: "Off"
                    })]
                }), l.map(c => e.jsxs("button", {
                    onClick: () => w(c.id),
                    className: `flex-1 p-3 rounded-2xl transition-all flex flex-col items-center gap-2 border ${a===c.id?"bg-brand-500/10 border-brand-500/20 text-brand-600 dark:text-brand-400 shadow-sm":"bg-zinc-50/50 dark:bg-white/[0.02] border-zinc-200/50 dark:border-white/[0.05] text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/[0.06]"}`,
                    children: [e.jsx(c.icon, {
                        className: "w-5 h-5"
                    }), e.jsx("span", {
                        className: "text-[11px] font-semibold tracking-wide",
                        children: c.label
                    })]
                }, c.id))]
            }), a && e.jsxs("div", {
                className: "flex items-center gap-3",
                children: [e.jsx(lt, {
                    className: "w-4 h-4 text-zinc-500"
                }), e.jsx("input", {
                    type: "range",
                    min: "0",
                    max: "100",
                    value: i,
                    onChange: c => x(parseInt(c.target.value)),
                    className: "flex-1 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                })]
            })]
        })
    },
    xn = () => {
        const s = [{
            icon: Ds,
            label: "Stretch",
            desc: "Stand up and move around"
        }, {
            icon: Gs,
            label: "Hydrate",
            desc: "Drink a glass of water"
        }, {
            icon: jt,
            label: "Relax",
            desc: "Take deep breaths"
        }];
        return e.jsxs("div", {
            className: "bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 mb-6",
            children: [e.jsx("h3", {
                className: "text-lg font-bold text-emerald-400 mb-4",
                children: "Break Time! 🌿"
            }), e.jsx("div", {
                className: "grid grid-cols-3 gap-3",
                children: s.map((a, w) => e.jsxs("div", {
                    className: "bg-emerald-500/10 rounded-xl p-3 text-center hover:bg-emerald-500/20 transition-colors cursor-pointer",
                    children: [e.jsx(a.icon, {
                        className: "w-6 h-6 text-emerald-400 mx-auto mb-2"
                    }), e.jsx("div", {
                        className: "text-xs font-bold text-emerald-300",
                        children: a.label
                    })]
                }, w))
            })]
        })
    },
    bn = ({
        hasBackgroundImage: s = !1
    }) => {
        const [a, w] = t.useState([]), [i, x] = t.useState("");
        t.useEffect(() => {
            (async () => {
                const l = await ve.getItem("focus-distractions");
                if (l) try {
                    w(JSON.parse(l))
                } catch (c) {
                    console.error("Failed to parse distractions:", c)
                }
            })()
        }, []), t.useEffect(() => {
            ve.setItem("focus-distractions", JSON.stringify(a))
        }, [a]);
        const d = l => {
            l.key === "Enter" && i.trim() && (w([...a, i.trim()]), x(""))
        };
        return e.jsxs("div", {
            className: `border rounded-3xl p-5 h-full max-h-[300px] flex flex-col transition-all ring-1 ring-black/5 dark:ring-white/5 ${s?"bg-white/30 dark:bg-black/40 backdrop-blur-2xl backdrop-saturate-150 border-white/40 dark:border-white/10 shadow-lg":"bg-white dark:bg-zinc-900/40 backdrop-blur-md border-zinc-200/60 dark:border-white/[0.06] shadow-sm"}`,
            children: [e.jsx("h3", {
                className: "text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-4",
                children: "Distraction Pad"
            }), e.jsxs("div", {
                className: "flex-1 overflow-y-auto mb-3 space-y-2 custom-scrollbar",
                children: [a.length === 0 && e.jsx("div", {
                    className: "text-zinc-400 dark:text-zinc-600 text-xs italic text-center mt-4",
                    children: "Dump distracting thoughts here..."
                }), a.map((l, c) => e.jsxs("div", {
                    className: "text-sm text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-white/5 p-2 rounded-lg flex justify-between group",
                    children: [e.jsx("span", {
                        className: "truncate",
                        children: l
                    }), e.jsx("button", {
                        onClick: () => w(a.filter((b, m) => m !== c)),
                        className: "opacity-0 group-hover:opacity-100 text-zinc-400 dark:text-zinc-600 hover:text-rose-500 transition-all",
                        children: e.jsx(de, {
                            className: "w-3 h-3"
                        })
                    })]
                }, c))]
            }), e.jsx("input", {
                type: "text",
                value: i,
                onChange: l => x(l.target.value),
                onKeyDown: d,
                placeholder: "Type & Enter...",
                className: "w-full bg-zinc-50 dark:bg-white/[0.03] border-none rounded-xl px-3 py-2.5 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-brand-500/30 transition-colors"
            })]
        })
    },
    hn = ({
        hasBackgroundImage: s = !1
    }) => {
        const a = B(o => o.currentTaskIds),
            w = Ae(o => o.tasks),
            i = Ae(o => o.updateTask),
            [x, d] = t.useState([]),
            [l, c] = t.useState("");
        t.useEffect(() => {
            (async () => {
                const o = await ve.getItem("session-custom-goals");
                if (o) try {
                    d(JSON.parse(o))
                } catch (n) {
                    console.error("Failed to parse custom goals:", n)
                }
            })()
        }, []), t.useEffect(() => {
            ve.setItem("session-custom-goals", JSON.stringify(x))
        }, [x]);
        const b = w.filter(o => a.includes(o.id)),
            m = o => {
                if (o.key === "Enter" && l.trim()) {
                    const n = {
                        id: `custom-${Date.now()}`,
                        text: l.trim(),
                        completed: !1
                    };
                    d([...x, n]), c("")
                }
            },
            j = o => {
                d(x.map(n => n.id === o ? { ...n,
                    completed: !n.completed
                } : n))
            },
            p = o => {
                d(x.filter(n => n.id !== o))
            },
            N = async o => {
                const n = w.find(k => k.id === o);
                if (!n) return;
                const u = n.status === "done" ? "in-progress" : "done";
                await i(o, {
                    status: u
                })
            },
            h = [...b.map(o => ({
                id: o.id,
                text: o.title,
                completed: o.status === "done",
                isTask: !0
            })), ...x.map(o => ({ ...o,
                isTask: !1
            }))];
        return e.jsxs("div", {
            className: `border rounded-3xl p-5 transition-all ring-1 ring-black/5 dark:ring-white/5 ${s?"bg-white/30 dark:bg-black/40 backdrop-blur-2xl backdrop-saturate-150 border-white/40 dark:border-white/10 shadow-lg":"bg-white dark:bg-zinc-900/40 backdrop-blur-md border-zinc-200/60 dark:border-white/[0.06] shadow-sm"}`,
            children: [e.jsxs("h3", {
                className: "text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2",
                children: [e.jsx(dt, {
                    className: "w-4 h-4"
                }), "Session Goals"]
            }), e.jsxs("div", {
                className: "space-y-1.5 mb-3",
                children: [h.length === 0 && e.jsx("div", {
                    className: "text-zinc-400 dark:text-zinc-600 text-xs italic text-center py-4",
                    children: "No goals set. Add tasks to your session or create custom goals below."
                }), h.map(o => e.jsxs("div", {
                    className: `
              flex items-center gap-3 p-2 rounded-xl transition-colors group
              ${o.completed?"text-zinc-400 dark:text-zinc-500 line-through select-none":"bg-zinc-50/50 dark:bg-white/[0.02] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.06] cursor-pointer"}
            `,
                    children: [e.jsxs("div", {
                        onClick: () => o.isTask ? N(o.id) : j(o.id),
                        className: "flex items-center gap-3 flex-1 cursor-pointer min-w-0",
                        children: [e.jsx("div", {
                            className: `w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors ${o.completed?"border-brand-500/50 bg-brand-500/20 text-brand-500 dark:text-brand-400":"border-zinc-300 dark:border-zinc-600"}`,
                            children: o.completed && e.jsx(dt, {
                                className: "w-3 h-3 text-brand-500 dark:text-brand-400"
                            })
                        }), e.jsx("span", {
                            className: "text-sm truncate",
                            title: o.text,
                            children: o.text
                        })]
                    }), !o.isTask && e.jsx("button", {
                        onClick: () => p(o.id),
                        className: "opacity-0 group-hover:opacity-100 text-zinc-400 dark:text-zinc-600 hover:text-rose-500 transition-all flex-shrink-0",
                        children: e.jsx(de, {
                            className: "w-3 h-3"
                        })
                    })]
                }, o.id))]
            }), e.jsx("input", {
                type: "text",
                value: l,
                onChange: o => c(o.target.value),
                onKeyDown: m,
                placeholder: "Add a mini-goal...",
                className: "w-full bg-zinc-50 dark:bg-white/[0.03] border-none rounded-xl px-3 py-2.5 mt-2 text-sm text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-brand-500/30 transition-colors"
            })]
        })
    },
    pn = ({
        onClose: s
    }) => {
        const [a, w] = t.useState("Inhale"), [i, x] = t.useState(1), [d, l] = t.useState(60), [c, b] = t.useState(!1), [m, j] = t.useState(!1), p = t.useRef(null), N = t.useRef(null);
        t.useEffect(() => {
            l(i * 60)
        }, [i]), t.useEffect(() => {
            if (!c) return;
            const n = setInterval(() => {
                    w(k => k === "Inhale" ? "Hold" : k === "Hold" ? "Exhale" : "Inhale")
                }, 4e3),
                u = setInterval(() => {
                    l(k => k <= 1 ? (b(!1), j(!1), 0) : k - 1)
                }, 1e3);
            return () => {
                clearInterval(n), clearInterval(u)
            }
        }, [c]), t.useEffect(() => {
            if (m && c) try {
                const n = window.AudioContext || window.webkitAudioContext;
                p.current || (p.current = new n);
                const u = p.current,
                    k = u.createOscillator(),
                    T = u.createGain();
                k.type = "sine", k.frequency.setValueAtTime(432, u.currentTime);
                const z = u.createOscillator();
                z.type = "sine", z.frequency.setValueAtTime(.1, u.currentTime);
                const $ = u.createGain();
                $.gain.setValueAtTime(5, u.currentTime), z.connect($), $.connect(k.frequency), z.start(), k.connect(T), T.connect(u.destination), T.gain.setValueAtTime(0, u.currentTime), T.gain.linearRampToValueAtTime(.1, u.currentTime + 2), k.start(), N.current = k
            } catch (n) {
                console.error("Audio context error", n)
            } else if (N.current) {
                try {
                    N.current.stop(), N.current.disconnect()
                } catch {}
                N.current = null
            }
            return () => {
                if (N.current) try {
                    N.current.stop()
                } catch {}
            }
        }, [m, c]);
        const h = () => {
                b(!c), !c && d === 0 && l(i * 60)
            },
            o = n => {
                const u = Math.floor(n / 86400),
                    k = Math.floor(n % 86400 / 3600),
                    T = Math.floor(n % 3600 / 60),
                    z = n % 60;
                return u > 0 ? `${u}d ${k}:${T.toString().padStart(2,"0")}:${z.toString().padStart(2,"0")}` : k > 0 ? `${k}:${T.toString().padStart(2,"0")}:${z.toString().padStart(2,"0")}` : `${T}:${z.toString().padStart(2,"0")}`
            };
        return e.jsxs("div", {
            className: "fixed inset-0 z-[100] bg-white/90 dark:bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center",
            children: [e.jsx("button", {
                onClick: s,
                className: "absolute top-8 right-8 p-2 rounded-full bg-zinc-200 dark:bg-white/10 hover:bg-zinc-300 dark:hover:bg-white/20 text-zinc-900 dark:text-white transition-colors",
                children: e.jsx(ae, {
                    className: "w-6 h-6"
                })
            }), !c && e.jsxs("div", {
                className: "absolute top-8 left-8 flex gap-4",
                children: [e.jsx("div", {
                    className: "flex bg-zinc-100 dark:bg-white/5 rounded-full p-1 border border-zinc-200 dark:border-white/10",
                    children: [1, 3, 5].map(n => e.jsxs("button", {
                        onClick: () => x(n),
                        className: `px-4 py-1.5 rounded-full text-sm font-medium transition-all ${i===n?"bg-white dark:bg-white/20 text-zinc-900 dark:text-white shadow-sm":"text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"}`,
                        children: [n, "m"]
                    }, n))
                }), e.jsx("button", {
                    onClick: () => j(!m),
                    className: `px-4 py-1.5 rounded-full text-sm font-medium transition-all border flex items-center gap-2 ${m?"bg-brand-500/10 border-brand-500/50 text-brand-600 dark:text-brand-400":"bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400"}`,
                    children: m ? "Sound On" : "Sound Off"
                })]
            }), e.jsxs("div", {
                className: "relative flex items-center justify-center mb-12",
                children: [e.jsx(g.div, {
                    animate: {
                        scale: c ? a === "Inhale" ? 1.5 : a === "Exhale" ? 1 : 1.5 : 1,
                        opacity: a === "Hold" ? .8 : .5
                    },
                    transition: {
                        duration: 4,
                        ease: "easeInOut"
                    },
                    className: "w-64 h-64 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 blur-3xl absolute"
                }), e.jsx(g.div, {
                    animate: {
                        scale: c ? a === "Inhale" ? 1.2 : a === "Exhale" ? .8 : 1.2 : 1
                    },
                    transition: {
                        duration: 4,
                        ease: "easeInOut"
                    },
                    className: "w-48 h-48 rounded-full border-4 border-zinc-300 dark:border-white/20 flex items-center justify-center relative z-10 backdrop-blur-sm cursor-pointer hover:scale-105 transition-transform",
                    onClick: h,
                    children: e.jsxs("div", {
                        className: "flex flex-col items-center",
                        children: [e.jsx("div", {
                            className: "text-3xl font-bold text-zinc-900 dark:text-white tracking-widest uppercase",
                            children: c ? a : "START"
                        }), c && e.jsx("div", {
                            className: "text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-2 font-mono",
                            children: o(d)
                        })]
                    })
                })]
            }), e.jsx("p", {
                className: "text-zinc-600 dark:text-zinc-400 text-sm max-w-md text-center",
                children: c ? "Focus on your breath. Inhale deeply, hold, and release slowly." : "Select duration and click circle to start."
            })]
        })
    },
    fn = ({
        isOpen: s,
        onClose: a,
        onContinue: w,
        onTakeBreak: i,
        onExtendTime: x,
        sessionDurationMinutes: d,
        responseDeadline: l
    }) => {
        const [c, b] = t.useState(0);
        t.useEffect(() => {
            if (!s || !l) return;
            const T = () => {
                const $ = Date.now(),
                    f = Math.max(0, Math.floor((l - $) / 1e3));
                b(f)
            };
            T();
            const z = setInterval(T, 1e3);
            return () => clearInterval(z)
        }, [s, l]);
        const m = t.useCallback(() => {
                w(), a()
            }, [w, a]),
            j = t.useCallback(() => {
                i(), a()
            }, [i, a]),
            p = t.useCallback(() => {
                x(), a()
            }, [x, a]),
            N = t.useCallback(() => {
                a()
            }, [a]),
            h = Math.floor(d / 60),
            o = d % 60,
            n = h > 0 ? `${h}h ${o}m` : `${o}m`,
            u = c <= 60,
            k = c <= 120 && c > 60;
        return s ? fs.createPortal(e.jsx(_, {
            children: s && e.jsxs("div", {
                className: "fixed inset-0 z-[9999] isolate flex items-center justify-center p-4 sm:p-6",
                children: [e.jsx(g.div, {
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    exit: {
                        opacity: 0
                    },
                    transition: {
                        duration: .3
                    },
                    className: "absolute inset-0 bg-black/60 backdrop-blur-sm",
                    onClick: N
                }), e.jsxs(g.div, {
                    initial: {
                        opacity: 0,
                        scale: .9,
                        y: 20
                    },
                    animate: {
                        opacity: 1,
                        scale: 1,
                        y: 0
                    },
                    exit: {
                        opacity: 0,
                        scale: .9,
                        y: 20
                    },
                    transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                        opacity: {
                            duration: .2
                        }
                    },
                    className: "relative w-full max-w-sm bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden",
                    children: [e.jsx("div", {
                        className: "absolute -top-20 -right-20 w-40 h-40 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"
                    }), e.jsx("div", {
                        className: "absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"
                    }), e.jsxs("div", {
                        className: "relative px-6 py-8 sm:px-8 sm:py-10",
                        children: [e.jsx(g.button, {
                            onClick: N,
                            whileHover: {
                                scale: 1.1,
                                rotate: 90
                            },
                            whileTap: {
                                scale: .9
                            },
                            className: "absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.05] hover:bg-white/10 border border-white/[0.08] transition-colors",
                            children: e.jsx(ae, {
                                className: "w-4 h-4 text-white/50"
                            })
                        }), e.jsx(g.div, {
                            initial: {
                                scale: 0
                            },
                            animate: {
                                scale: 1
                            },
                            transition: {
                                delay: .1,
                                type: "spring",
                                stiffness: 400
                            },
                            className: "flex justify-center mb-6",
                            children: e.jsx("div", {
                                className: `w-16 h-16 rounded-2xl flex items-center justify-center ${u?"bg-rose-500/20 border border-rose-500/30":k?"bg-amber-500/20 border border-amber-500/30":"bg-brand-500/20 border border-brand-500/30"}`,
                                children: u ? e.jsx(Ls, {
                                    className: "w-8 h-8 text-rose-400"
                                }) : e.jsx(ke, {
                                    className: "w-8 h-8 text-brand-400"
                                })
                            })
                        }), e.jsx(g.h2, {
                            initial: {
                                opacity: 0,
                                y: 10
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            transition: {
                                delay: .15
                            },
                            className: "text-xl sm:text-2xl font-bold text-white text-center mb-2",
                            children: u ? "Session Ending Soon!" : "How's it going?"
                        }), e.jsxs(g.p, {
                            initial: {
                                opacity: 0,
                                y: 10
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            transition: {
                                delay: .2
                            },
                            className: "text-sm text-white/60 text-center mb-6",
                            children: ["You've been focused for", " ", e.jsx("span", {
                                className: "text-white font-semibold",
                                children: n
                            }), u ? ". Session will auto-pause soon." : ". Take a moment to check in."]
                        }), e.jsx(g.div, {
                            initial: {
                                opacity: 0,
                                scale: .9
                            },
                            animate: {
                                opacity: 1,
                                scale: 1
                            },
                            transition: {
                                delay: .25
                            },
                            className: "mb-6",
                            children: e.jsxs("div", {
                                className: `relative overflow-hidden rounded-2xl p-4 ${u?"bg-rose-500/10 border border-rose-500/20":k?"bg-amber-500/10 border border-amber-500/20":"bg-white/[0.04] border border-white/[0.08]"}`,
                                children: [e.jsx("div", {
                                    className: "absolute inset-0 bg-white/[0.02]"
                                }), e.jsx(g.div, {
                                    initial: {
                                        width: "100%"
                                    },
                                    animate: {
                                        width: `${c/300*100}%`
                                    },
                                    transition: {
                                        duration: .5,
                                        ease: "easeOut"
                                    },
                                    className: `absolute inset-y-0 left-0 ${u?"bg-rose-500/20":k?"bg-amber-500/20":"bg-brand-500/20"}`
                                }), e.jsxs("div", {
                                    className: "relative flex items-center justify-between",
                                    children: [e.jsxs("div", {
                                        className: "flex items-center gap-3",
                                        children: [e.jsx(pt, {
                                            className: `w-5 h-5 ${u?"text-rose-400":k?"text-amber-400":"text-brand-400"}`
                                        }), e.jsxs("div", {
                                            children: [e.jsx("p", {
                                                className: "text-xs text-white/50 font-medium",
                                                children: "Auto-pause in"
                                            }), e.jsx("p", {
                                                className: `text-2xl font-bold tabular-nums ${u?"text-rose-400":k?"text-amber-400":"text-white"}`,
                                                children: Fs(c)
                                            })]
                                        })]
                                    }), e.jsx("div", {
                                        className: `px-3 py-1.5 rounded-full text-xs font-semibold ${u?"bg-rose-500/20 text-rose-300":k?"bg-amber-500/20 text-amber-300":"bg-brand-500/20 text-brand-300"}`,
                                        children: u ? "Urgent" : k ? "Warning" : "Active"
                                    })]
                                })]
                            })
                        }), e.jsxs(g.div, {
                            initial: {
                                opacity: 0,
                                y: 10
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            transition: {
                                delay: .3
                            },
                            className: "space-y-3",
                            children: [e.jsxs(g.button, {
                                onClick: m,
                                whileHover: {
                                    scale: 1.02
                                },
                                whileTap: {
                                    scale: .98
                                },
                                className: "w-full h-14 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg shadow-brand-500/20",
                                children: [e.jsx(kt, {
                                    className: "w-5 h-5"
                                }), "I'm Still Focusing"]
                            }), e.jsxs("div", {
                                className: "grid grid-cols-2 gap-3",
                                children: [e.jsxs(g.button, {
                                    onClick: j,
                                    whileHover: {
                                        scale: 1.02
                                    },
                                    whileTap: {
                                        scale: .98
                                    },
                                    className: "h-12 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] text-white/70 hover:text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2",
                                    children: [e.jsx(jt, {
                                        className: "w-4 h-4"
                                    }), "Take Break"]
                                }), e.jsxs(g.button, {
                                    onClick: p,
                                    whileHover: {
                                        scale: 1.02
                                    },
                                    whileTap: {
                                        scale: .98
                                    },
                                    className: "h-12 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] text-white/70 hover:text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2",
                                    children: [e.jsx(ke, {
                                        className: "w-4 h-4"
                                    }), "Extend Time"]
                                })]
                            })]
                        }), e.jsx(g.p, {
                            initial: {
                                opacity: 0
                            },
                            animate: {
                                opacity: 1
                            },
                            transition: {
                                delay: .4
                            },
                            className: "text-[11px] text-white/30 text-center mt-6",
                            children: "This gentle nudge helps prevent accidental marathon sessions"
                        })]
                    })]
                })]
            })
        }), document.body) : null
    },
    gn = () => {
        const s = "ontouchstart" in window || navigator.maxTouchPoints > 0,
            a = window.innerWidth,
            w = s && a >= 600 && a <= 1024,
            i = s && a < 600;
        return !w && !i
    },
    ht = 300,
    wn = s => {
        const a = s.mode === "pomodoro" ? Math.max(0, s.totalTime - s.timeLeft) : Math.max(0, s.stopwatchTime);
        return Math.floor(a / 60)
    },
    kn = s => {
        const a = Math.floor(s / 60),
            w = s % 60,
            i = a > 0 ? `${a}h ${w}m` : `${w}m`;
        Nt.getState().sendNotification(Xs.FOCUS_SESSION, "⏰ Session Check-in", {
            body: `You've been focused for ${i}. Check in now or the session will auto-pause in 5 minutes.`,
            icon: "/icons/icon-192x192.svg",
            badge: "/icons/icon-96x96.svg",
            tag: "session-nudge",
            requireInteraction: !0,
            data: {
                url: `${window.location.origin}/focus`
            }
        })
    },
    vn = () => {
        const {
            timerState: s,
            sessionStartTime: a,
            pauseTimer: w,
            addTime: i
        } = B(), [x, d] = t.useState({
            isActive: !1,
            nudgeCount: 0,
            lastNudgeTime: null,
            nextNudgeTime: null,
            responseDeadline: null
        }), [l, c] = t.useState(!0), b = Y(f => f.profile ?.focusSettings ?.notificationInterval) ?? Hs.notificationInterval ?? 195, m = t.useRef(null), j = t.useRef(null), p = t.useRef(null), N = t.useRef(x);
        t.useEffect(() => {
            N.current = x
        }, [x]);
        const h = t.useCallback(() => {
                j.current && (clearTimeout(j.current), j.current = null)
            }, []),
            o = t.useCallback(() => {
                const f = N.current;
                if (!f.isActive || !f.responseDeadline || Date.now() < f.responseDeadline) return;
                const M = B.getState();
                M.timerState === "running" && M.pauseTimer("Auto-paused: No response to session nudge"), h(), d(R => ({ ...R,
                    isActive: !1,
                    nextNudgeTime: null,
                    responseDeadline: null
                }))
            }, [h]);
        t.useEffect(() => {
            const f = () => {
                c(gn())
            };
            return f(), window.addEventListener("resize", f), () => window.removeEventListener("resize", f)
        }, []), t.useEffect(() => {
            s === "running" && a ? p.current = new Date(a).getTime() : s !== "running" && (p.current = null, d(f => ({ ...f,
                isActive: !1,
                nextNudgeTime: null,
                responseDeadline: null
            })), m.current && (clearTimeout(m.current), m.current = null), h())
        }, [s, a, h]);
        const n = t.useCallback(() => {
                const f = B.getState();
                if (f.timerState !== "running" || !l) return;
                const M = Date.now(),
                    R = M + ht * 1e3,
                    F = p.current ? wn(f) : 0;
                kn(F), d(E => ({ ...E,
                    isActive: !0,
                    nudgeCount: E.nudgeCount + 1,
                    lastNudgeTime: M,
                    responseDeadline: R
                })), h(), j.current = setTimeout(() => {
                    o()
                }, ht * 1e3)
            }, [l, h, o]),
            u = t.useCallback(() => {
                if (m.current && clearTimeout(m.current), !l) return;
                const f = Math.max(1, b) * 60 * 1e3,
                    M = Date.now() + f;
                d(R => ({ ...R,
                    nextNudgeTime: M
                })), m.current = setTimeout(() => {
                    n()
                }, f)
            }, [l, b, n]),
            k = t.useCallback(() => {
                h(), d(f => ({ ...f,
                    isActive: !1,
                    responseDeadline: null
                })), u()
            }, [u, h]),
            T = t.useCallback(() => {
                h(), d(f => ({ ...f,
                    isActive: !1,
                    responseDeadline: null
                })), w("User took a break")
            }, [w, h]),
            z = t.useCallback(() => {
                h(), d(f => ({ ...f,
                    isActive: !1,
                    responseDeadline: null
                })), i(1800), u()
            }, [i, u, h]),
            $ = t.useCallback(() => {
                k()
            }, [k]);
        return t.useEffect(() => (s === "running" && p.current && u(), () => {
            m.current && clearTimeout(m.current), h()
        }), [s, u, h]), t.useEffect(() => {
            if (!x.isActive || !x.responseDeadline) return;
            const f = setInterval(() => {
                o()
            }, 1e3);
            return () => clearInterval(f)
        }, [x.isActive, x.responseDeadline, o]), {
            nudgeState: x,
            handleNudgeResponse: k,
            handleTakeBreak: T,
            handleExtendTime: z,
            dismissNudge: $,
            isDesktop: l
        }
    },
    jn = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"),
    Zn = ({
        isDark: s,
        toggleTheme: a
    }) => {
        const {
            isPerformanceMode: w,
            shouldReduceMotion: i
        } = _s(), {
            sessions: x,
            timerState: d,
            mode: l,
            timeLeft: c,
            totalTime: b,
            stopwatchTime: m,
            pomodoroCycle: j,
            activePhase: p,
            currentSubject: N,
            currentSubjectIds: h,
            currentChapterIds: o,
            currentTopicIds: n,
            currentTaskIds: u,
            sessionStartTime: k,
            setMode: T,
            setCurrentContext: z,
            startTimer: $,
            pauseTimer: f,
            resumeTimer: M,
            resetTimer: R,
            completeSession: G
        } = B(), {
            nudgeState: F,
            handleNudgeResponse: E,
            handleTakeBreak: U,
            handleExtendTime: q,
            isDesktop: V
        } = vn(), [W, Q] = t.useState(!1), Z = t.useCallback(() => {
            E(), Q(!1)
        }, [E]), ee = t.useCallback(() => {
            U(), Q(!1)
        }, [U]), r = t.useCallback(() => {
            q(), Q(!1)
        }, [q]), y = t.useCallback(() => {
            Q(!1)
        }, []), {
            subjects: I
        } = De(), {
            tasks: L
        } = Ae(), {
            isPremium: re
        } = Ws(), H = Y(v => v.profile ?.focusSettings), O = H ?.showPauseReasonPicker ?? !0, K = H ?.showSessionCompletionCard ?? H ?.showSessionProductivityRating ?? !0, {
            setPageContext: ie
        } = Ys(), me = t.useMemo(() => Math.floor(l === "pomodoro" ? c / 60 : m / 60), [l, m, c]), Ge = t.useMemo(() => {
            const v = I.filter(S => h.includes(S.id)).map(S => ({
                id: S.id,
                name: S.name,
                chapterCount: S.chapters.length,
                topicCount: S.chapters.reduce((A, X) => A + X.topics.length, 0)
            }));
            return {
                timerState: d,
                mode: l,
                timeLeftMinutes: me,
                subject: N || "None",
                status: d === "running" ? "Focusing" : d === "break" ? "On break" : "Idle",
                activeSubjectIds: h,
                activeChapterIds: o,
                activeTopicIds: n,
                activeTaskIds: u,
                activeSubjects: v
            }
        }, [o, N, h, u, n, me, l, d, I]);
        t.useEffect(() => (ie({
            type: "focus",
            data: Ge,
            description: "User is in the Focus Zone. They might be studying or taking a break."
        }), () => ie(null)), [Ge, ie]), t.useEffect(() => {
            F.isActive && Q(!0)
        }, [F.isActive]);
        const St = t.useMemo(() => {
                if (!k) return 0;
                const v = l === "pomodoro" ? Math.max(0, b - c) : Math.max(0, m);
                return Math.floor(v / 60)
            }, [k, l, m, c, b]),
            [Le, Oe] = t.useState(!1),
            [Fe, zt] = t.useState("Focus"),
            [Qe, qe] = t.useState(!1),
            [Ue, He] = t.useState(!1),
            [_e, We] = t.useState(!1),
            je = t.useRef(!1),
            ye = h.length > 0 || o.length > 0 || n.length > 0 || u.length > 0,
            te = t.useMemo(() => qs(x, I, L.map(v => v.id)), [x, I, L]);
        t.useEffect(() => {
            !je.current && !ye && te && x.length > 0 && d === "idle" ? (je.current = !0, z(te.subjectIds, te.chapterIds, te.topicIds, te.taskIds)) : ye && (je.current = !0)
        }, [ye, te, z, x.length, d]);
        const [Tt, Ne] = t.useState(!0), [Se, Ve] = t.useState(!1), [Ct, Ze] = t.useState(!1), oe = t.useRef(null), [D, xe] = t.useState(null), [ce, It] = t.useState(en), se = t.useRef(null);
        t.useEffect(() => {
            (async () => {
                const v = await tn();
                xe(v.imageUrl), It(v.blurAmount)
            })()
        }, []);
        const Ke = () => {
                const v = prompt("Enter the URL of the image you want to use as background:");
                if (v) {
                    const S = sn(v);
                    S ? (nn({
                        imageUrl: S,
                        blurAmount: ce
                    }), xe(S)) : alert("Please enter a valid image URL starting with http:// or https://")
                }
            },
            Xe = async () => {
                if (!("documentPictureInPicture" in window)) {
                    alert("Picture-in-Picture is not supported in this browser.");
                    return
                }
                try {
                    if (se.current) {
                        se.current.close(), se.current = null;
                        return
                    }
                    const S = await window.documentPictureInPicture.requestWindow({
                        width: 340,
                        height: 390
                    });
                    se.current = S, S.document.body.style.backgroundColor = s ? "#000000" : "#f4f4f5", S.document.body.style.color = s ? "white" : "black", S.document.body.style.margin = "0", S.document.body.style.padding = "0", S.document.body.style.fontFamily = "system-ui, sans-serif";
                    const A = S.document.createElement("div");
                    A.id = "pip-root", A.style.display = "flex", A.style.flexDirection = "column", A.style.alignItems = "center", A.style.justifyContent = "center", A.style.height = "100vh", A.style.width = "100vw", A.style.backgroundColor = s ? "#000000" : "#f4f4f5", A.style.color = s ? "white" : "black", A.style.transition = "all 0.3s ease", S.document.body.append(A);
                    const X = () => {
                            if (!se.current) return;
                            const Zt = B.getState(),
                                {
                                    mode: nt,
                                    timeLeft: Kt,
                                    stopwatchTime: Xt,
                                    timerState: J,
                                    sessionType: Jt,
                                    taskType: Yt,
                                    questionsAttempted: es,
                                    questionsCorrect: ts,
                                    questionsIncorrect: ss,
                                    questionsSkipped: ns,
                                    targetQuestions: ze,
                                    questionActionHistory: Te,
                                    recordQuestionResult: Ce,
                                    undoLastQuestionResult: as,
                                    setTargetQuestions: rs
                                } = Zt,
                                at = Y.getState().profile ?.focusSettings,
                                is = at ?.focusTypes,
                                os = at ?.showQuestionTrackingInTimerPip ?? !0,
                                he = yt(is, Jt, Yt),
                                rt = os && !!he,
                                pe = nt === "pomodoro" ? Kt : Xt,
                                it = Math.floor(pe / 86400),
                                Ie = Math.floor(pe % 86400 / 3600),
                                $e = Math.floor(pe % 3600 / 60),
                                Pe = pe % 60;
                            let fe;
                            it > 0 ? fe = `${it}d ${Ie}:${$e.toString().padStart(2,"0")}:${Pe.toString().padStart(2,"0")}` : Ie > 0 ? fe = `${Ie}:${$e.toString().padStart(2,"0")}:${Pe.toString().padStart(2,"0")}` : fe = `${$e}:${Pe.toString().padStart(2,"0")}`;
                            const cs = nt === "pomodoro" ? "Pomodoro" : "Stopwatch",
                                ls = rt && he ? `${he.icon} ${jn(he.label)}` : "",
                                ds = J === "running" ? "Focusing..." : J === "paused" ? "Paused" : J === "break" ? "Break" : "Idle",
                                us = J === "running" ? s ? "#22c55e" : "#16a34a" : J === "paused" ? s ? "#f59e0b" : "#d97706" : J === "break" ? s ? "#3b82f6" : "#2563eb" : "#6b7280",
                                Me = "border: 0; border-radius: 14px; padding: 10px 12px; color: white; font-size: 0.78rem; font-weight: 800; cursor: pointer; min-width: 72px;";
                            A.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 20px; text-align: center; width: 100%; box-sizing: border-box;">
                        <div style="font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.7;">${cs}</div>
                        <div style="font-size: 3.1rem; font-weight: 800; line-height: 1; letter-spacing: -0.025em;">${fe}</div>
                        <div style="display: flex; align-items: center; gap: 8px; font-size: 0.875rem; opacity: 0.8;">
                            <span style="width: 6px; height: 6px; border-radius: 50%; background-color: ${us}; animation: ${J==="running"?"pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite":"none"};"></span>
                            ${ds}
                        </div>
                        ${rt?`
                              <div style="width: 100%; border-top: 1px solid ${s?"rgba(255,255,255,0.12)":"rgba(24,24,27,0.12)"}; padding-top: 14px; display: flex; flex-direction: column; gap: 10px;">
                                <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                                  <div style="text-align: left;">
                                    <div style="font-size: 0.78rem; opacity: 0.66; font-weight: 700;">${ls}</div>
                                    <div style="font-size: 1.55rem; font-weight: 900;">${es}${ze>0?`<span style="font-size: 0.9rem; opacity: 0.55;"> / ${ze}</span>`:""}</div>
                                  </div>
                                  <button id="pip-target" style="border: 1px solid ${s?"rgba(255,255,255,0.16)":"rgba(24,24,27,0.16)"}; background: ${s?"rgba(255,255,255,0.07)":"rgba(255,255,255,0.8)"}; color: ${s?"white":"#18181b"}; border-radius: 999px; padding: 8px 10px; font-size: 0.72rem; font-weight: 800; cursor: pointer;">Target</button>
                                </div>
                                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                                  <button id="pip-correct" style="${Me} background: #059669;">✓ ${ts}</button>
                                  <button id="pip-incorrect" style="${Me} background: #e11d48;">✕ ${ss}</button>
                                  <button id="pip-skipped" style="${Me} background: #d97706;">Skip ${ns}</button>
                                </div>
                                <button id="pip-undo" ${Te.length===0?"disabled":""} style="border: 1px solid ${s?"rgba(255,255,255,0.14)":"rgba(24,24,27,0.14)"}; background: transparent; color: ${s?"rgba(255,255,255,0.72)":"rgba(24,24,27,0.72)"}; border-radius: 999px; padding: 8px 10px; font-size: 0.72rem; font-weight: 800; cursor: ${Te.length===0?"not-allowed":"pointer"}; opacity: ${Te.length===0?"0.45":"1"};">Undo last</button>
                              </div>
                            `:""}
                    </div>
                    <style>
                        @keyframes pulse {
                            0%, 100% { opacity: 1; }
                            50% { opacity: 0.5; }
                        }
                    </style>
                `;
                            const ms = S.document.getElementById("pip-correct"),
                                xs = S.document.getElementById("pip-incorrect"),
                                bs = S.document.getElementById("pip-skipped"),
                                hs = S.document.getElementById("pip-undo"),
                                ps = S.document.getElementById("pip-target");
                            ms ?.addEventListener("click", () => Ce("correct")), xs ?.addEventListener("click", () => Ce("incorrect")), bs ?.addEventListener("click", () => Ce("skipped")), hs ?.addEventListener("click", () => as()), ps ?.addEventListener("click", () => {
                                const ot = S.prompt("Set target questions", String(ze || ""));
                                ot !== null && rs(Math.max(0, parseInt(ot, 10) || 0))
                            })
                        },
                        Wt = setInterval(X, 1e3);
                    X();
                    const Vt = B.subscribe(() => {
                        X()
                    });
                    S.addEventListener("pagehide", () => {
                        clearInterval(Wt), Vt(), se.current = null
                    })
                } catch (v) {
                    console.error("Failed to open PIP window", v)
                }
            },
            C = d,
            be = l,
            $t = c,
            Pt = b,
            Mt = m,
            Et = j,
            At = C === "running" || C === "break",
            Je = h,
            Ye = o,
            et = n,
            tt = u,
            Bt = `${Je.join(",")}|${Ye.join(",")}|${et.join(",")}|${tt.join(",")}`,
            st = () => {
                Se ? (document.fullscreenElement && document.exitFullscreen().catch(() => {}), Ve(!1)) : (document.documentElement.requestFullscreen && document.documentElement.requestFullscreen().catch(() => {}), Ve(!0))
            };
        t.useEffect(() => {
            const v = () => {
                Ne(!0), oe.current && clearTimeout(oe.current), oe.current = setTimeout(() => {
                    C === "running" && Ne(!1)
                }, 3e3)
            };
            return window.addEventListener("mousemove", v), window.addEventListener("keydown", v), window.addEventListener("click", v), () => {
                window.removeEventListener("mousemove", v), window.removeEventListener("keydown", v), window.removeEventListener("click", v), oe.current && clearTimeout(oe.current)
            }
        }, [C]), t.useEffect(() => {
            C !== "running" && Ne(!0)
        }, [C]);
        const P = C === "running" && !Tt || Se,
            Rt = t.useCallback(v => {
                T(v)
            }, [T]),
            Dt = t.useCallback(() => {
                C === "idle" ? qe(!0) : C === "running" || C === "break" ? O ? He(!0) : f("Pause") : C === "paused" && M()
            }, [C, O, f, M]),
            Gt = t.useCallback(() => {
                R()
            }, [R]),
            Lt = t.useCallback(() => {
                if (p === "break") {
                    B.getState().finishBreak();
                    return
                }
                G(void 0, void 0, void 0, void 0, {
                    transitionToBreak: !0
                })
            }, [p, G]),
            Ot = t.useCallback(() => {
                const {
                    addTime: v
                } = B.getState();
                v(300)
            }, []),
            Ft = t.useCallback(() => {
                const {
                    addTime: v
                } = B.getState();
                v(-300)
            }, []),
            Qt = t.useCallback(async () => {
                if (K) {
                    We(!0);
                    return
                }
                await G(void 0, void 0, void 0, void 0)
            }, [G, K]),
            qt = (v, S) => {
                "Notification" in window && Notification.permission === "default" && Nt.getState().requestPermission(), $(v, S)
            },
            Ut = v => {
                f(v)
            },
            Ht = async (v, S, A, X) => {
                await G(S, v, A, X)
            },
            _t = t.useCallback(v => {
                z(v.subjectIds, v.chapterIds, v.topicIds, v.taskIds)
            }, [z]);
        return e.jsxs("div", {
            className: "app-shell h-screen bg-[#f4f4f5] dark:bg-[#09090b] text-zinc-900 dark:text-white flex overflow-hidden selection:bg-brand-500/30",
            children: [e.jsxs("div", {
                className: "fixed inset-0 z-0 pointer-events-none transition-all duration-700",
                style: D ? {
                    backgroundImage: `url(${D})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                } : {},
                children: [D && e.jsx("div", {
                    className: "absolute inset-0 bg-white/30 dark:bg-black/60 transition-colors duration-700",
                    style: {
                        backdropFilter: ce > 0 ? `blur(${ce}px)` : "none",
                        WebkitBackdropFilter: ce > 0 ? `blur(${ce}px)` : "none"
                    }
                }), !D && !w && e.jsxs(e.Fragment, {
                    children: [e.jsx(g.div, {
                        animate: {
                            opacity: P ? .8 : .5
                        },
                        className: `app-ambient absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] transition-colors duration-1000 ${C==="running"?"bg-brand-500/20":C==="break"?"bg-emerald-500/20":"bg-blue-500/20"}`
                    }), e.jsx(g.div, {
                        animate: {
                            opacity: P ? .6 : .3
                        },
                        className: "app-ambient absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px]"
                    }), re() && e.jsx(Js, {
                        className: "app-ambient top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-20 animate-pulse"
                    })]
                })]
            }), e.jsx(g.div, {
                className: "app-sidebar z-50 flex-shrink-0 overflow-hidden bg-white dark:bg-[#0c0c0e] border-r border-zinc-200 dark:border-white/5",
                animate: {
                    width: P ? 0 : "auto",
                    opacity: P ? 0 : 1
                },
                transition: {
                    duration: i ? 0 : .5,
                    ease: "easeInOut"
                },
                children: e.jsx("div", {
                    className: "h-full",
                    children: e.jsx(gs, {
                        activeTab: Fe,
                        setActiveTab: zt,
                        isDark: s,
                        toggleTheme: a,
                        mobileMenuOpen: Le,
                        setMobileMenuOpen: Oe
                    })
                })
            }), e.jsxs("main", {
                className: "flex-1 relative flex flex-col h-screen overflow-hidden",
                children: [e.jsx(g.div, {
                    animate: {
                        height: P ? 0 : "auto",
                        opacity: P ? 0 : 1,
                        marginBottom: 0
                    },
                    transition: {
                        duration: .5,
                        ease: "easeInOut"
                    },
                    className: "app-header z-40 relative flex-shrink-0 bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-md border-b border-zinc-200 dark:border-white/5",
                    children: e.jsx(ws, {
                        activeTab: Fe,
                        mobileMenuOpen: Le,
                        setMobileMenuOpen: Oe
                    })
                }), e.jsx("div", {
                    className: `flex-1 relative z-10 density-app-shell-x pt-[var(--density-page-y)] lg:pt-[var(--density-page-y-lg)] transition-all duration-500 ${P?"overflow-hidden":"overflow-y-auto custom-scrollbar safe-bottom"}`,
                    children: e.jsxs("div", {
                        className: `mx-auto flex flex-col h-full ${P?"max-w-full":"density-app-width"}`,
                        children: [!P && e.jsxs("div", {
                            className: "flex flex-wrap justify-between items-center gap-3 mb-[var(--density-stack-gap)]",
                            children: [e.jsx(g.div, {
                                animate: {
                                    opacity: 1
                                },
                                className: "text-sm font-medium text-zinc-500",
                                children: C === "running" ? "Focus Session Active" : C === "break" ? "Break Time" : C === "paused" ? p === "break" ? "Break Paused" : "Session Paused" : "Ready to Focus"
                            }), e.jsxs("div", {
                                className: "flex flex-wrap items-center gap-2 sm:gap-3",
                                children: [e.jsx("button", {
                                    onClick: Ke,
                                    className: "p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-500 transition-colors",
                                    title: "Custom Background URL",
                                    children: e.jsx(ut, {
                                        className: "w-5 h-5"
                                    })
                                }), D && e.jsx("button", {
                                    onClick: () => {
                                        xe(null), bt()
                                    },
                                    className: "p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-white/10 text-rose-500 transition-colors",
                                    title: "Remove Background",
                                    children: e.jsx(de, {
                                        className: "w-5 h-5"
                                    })
                                }), e.jsx("button", {
                                    onClick: Xe,
                                    className: "p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-500 transition-colors",
                                    title: "Picture-in-Picture",
                                    children: e.jsx(mt, {
                                        className: "w-5 h-5"
                                    })
                                }), e.jsx("button", {
                                    onClick: st,
                                    className: "p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-500 transition-colors",
                                    title: "Toggle Zen Mode",
                                    children: Se ? e.jsx(xt, {
                                        className: "w-5 h-5"
                                    }) : e.jsx(Os, {
                                        className: "w-5 h-5"
                                    })
                                })]
                            })]
                        }), e.jsxs("div", {
                            className: `grid density-grid-gap flex-1 ${P?"grid-cols-1":"grid-cols-1 lg:grid-cols-12"}`,
                            children: [!P && e.jsxs(g.div, {
                                className: "lg:col-span-3 density-stack flex flex-col justify-start",
                                animate: {
                                    x: 0,
                                    opacity: 1
                                },
                                children: [e.jsx(mn, {
                                    hasBackgroundImage: !!D
                                }), e.jsxs("button", {
                                    onClick: () => Ze(!0),
                                    className: "w-full py-3.5 rounded-3xl bg-cyan-500/[0.08] dark:bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 dark:text-cyan-400 font-bold hover:bg-cyan-500/[0.12] dark:hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2 shadow-sm",
                                    children: [e.jsx(vt, {
                                        className: "w-4 h-4"
                                    }), "Take a Breath"]
                                }), e.jsx(hn, {
                                    hasBackgroundImage: !!D
                                }), e.jsx(bn, {
                                    hasBackgroundImage: !!D
                                })]
                            }), e.jsxs(g.div, {
                                layout: !0,
                                className: `transition-all duration-700 flex flex-col items-center ${P?"col-span-1 justify-center h-full py-6":"lg:col-span-6 justify-start pt-8 lg:pt-12"}`,
                                children: [e.jsx(_, {
                                    mode: "wait",
                                    children: C === "idle" && e.jsx(g.div, {
                                        initial: {
                                            opacity: 0,
                                            y: -20
                                        },
                                        animate: {
                                            opacity: 1,
                                            y: 0
                                        },
                                        exit: {
                                            opacity: 0,
                                            y: -20
                                        },
                                        className: "w-full flex justify-center",
                                        children: e.jsx(an, {
                                            mode: be,
                                            onChange: Rt
                                        })
                                    })
                                }), e.jsx("div", {
                                    className: `${P?"my-4":"my-8"} w-full flex justify-center transition-opacity duration-200 ${W?"opacity-0 pointer-events-none":"opacity-100"}`,
                                    "aria-hidden": W,
                                    children: e.jsx(rn, {
                                        timeLeft: be === "pomodoro" ? $t : Mt,
                                        totalTime: Pt,
                                        mode: be,
                                        state: C,
                                        activePhase: p,
                                        pomodoroCycle: Et,
                                        hasBackgroundImage: !!D,
                                        isImmersive: P
                                    })
                                }), e.jsx("div", {
                                    className: `${P?"mb-4":"mb-8"} w-full max-w-md`,
                                    children: e.jsx(Zs, {
                                        onSelect: _t,
                                        disabled: C !== "idle",
                                        initialSubjectIds: Je,
                                        initialChapterIds: Ye,
                                        initialTopicIds: et,
                                        initialTaskIds: tt,
                                        expandOnDesktop: !0
                                    }, Bt)
                                }), e.jsx(on, {
                                    isRunning: At,
                                    mode: be,
                                    activePhase: p,
                                    timerState: C,
                                    onToggle: Dt,
                                    onReset: Gt,
                                    onSkip: Lt,
                                    onAddTime: Ot,
                                    onRemoveTime: Ft,
                                    onComplete: Qt,
                                    hasBackgroundImage: !!D
                                }), e.jsx(un, {})]
                            }), !P && e.jsxs(g.div, {
                                className: "lg:col-span-3 density-stack flex flex-col justify-start",
                                animate: {
                                    x: 0,
                                    opacity: 1
                                },
                                children: [e.jsx(cn, {
                                    hasBackgroundImage: !!D
                                }), e.jsx(ln, {
                                    hasBackgroundImage: !!D
                                }), e.jsx(dn, {
                                    hasBackgroundImage: !!D
                                }), C === "break" && e.jsx(xn, {})]
                            })]
                        })]
                    })
                }), e.jsx(_, {
                    children: P && e.jsxs(g.div, {
                        initial: {
                            opacity: 0,
                            y: 20,
                            scale: .9
                        },
                        animate: {
                            opacity: 1,
                            y: 0,
                            scale: 1
                        },
                        exit: {
                            opacity: 0,
                            y: 20,
                            scale: .9
                        },
                        transition: {
                            duration: .3,
                            ease: "easeOut"
                        },
                        className: "fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[max(1.5rem,env(safe-area-inset-right))] z-50 flex max-w-[calc(100vw-1.5rem)] flex-wrap items-center gap-2 px-3 py-2.5 rounded-2xl bg-black/30 dark:bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl opacity-80 sm:opacity-30 hover:opacity-100 transition-opacity duration-300",
                        children: [e.jsx("button", {
                            onClick: Ke,
                            className: "p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors",
                            title: "Custom Background URL",
                            children: e.jsx(ut, {
                                className: "w-4 h-4"
                            })
                        }), D && e.jsx("button", {
                            onClick: () => {
                                xe(null), bt()
                            },
                            className: "p-2 rounded-full hover:bg-white/10 text-rose-400 hover:text-rose-300 transition-colors",
                            title: "Remove Background",
                            children: e.jsx(de, {
                                className: "w-4 h-4"
                            })
                        }), e.jsx("button", {
                            onClick: Xe,
                            className: "p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors",
                            title: "Picture-in-Picture",
                            children: e.jsx(mt, {
                                className: "w-4 h-4"
                            })
                        }), e.jsx("button", {
                            onClick: st,
                            className: "p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors",
                            title: "Exit Zen Mode",
                            children: e.jsx(xt, {
                                className: "w-4 h-4"
                            })
                        })]
                    }, "immersive-buttons")
                }), e.jsx(_, {
                    children: Ct && e.jsx(pn, {
                        onClose: () => Ze(!1)
                    })
                }), e.jsxs(_, {
                    children: [Qe && e.jsx(ks, {
                        isOpen: Qe,
                        onClose: () => qe(!1),
                        onStart: qt
                    }), Ue && e.jsx(vs, {
                        isOpen: Ue,
                        onClose: () => He(!1),
                        onPause: Ut
                    }), _e && e.jsx(js, {
                        isOpen: _e,
                        onClose: () => We(!1),
                        onComplete: Ht
                    }), W && V && e.jsx(fn, {
                        isOpen: W,
                        onClose: y,
                        onContinue: Z,
                        onTakeBreak: ee,
                        onExtendTime: r,
                        sessionDurationMinutes: St,
                        responseDeadline: F.responseDeadline
                    })]
                })]
            })]
        })
    };
export {
    Zn as
    default
};