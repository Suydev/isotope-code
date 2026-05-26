import {
    r as h,
    b as k,
    j as e
} from "./vendor-react-BfU3Zn2J.js";
import {
    d as z,
    p as j,
    e as N,
    h as p,
    k as g,
    f as S
} from "./App-pJGjDiPw.js";
import {
    b as q
} from "./useAIStore-B2cv1FZz.js";
import {
    g as y
} from "./useFocusStore-CX_Nyp1h.js";
import {
    A as T,
    m as b
} from "./vendor-motion-Cp_NPzpZ.js";
import {
    aK as A,
    b8 as D,
    T as C,
    a6 as L,
    a9 as Q,
    b9 as M,
    a8 as E,
    ba as I,
    X as P
} from "./vendor-icons-CqruUz7g.js";
import "./index-BPYJFSVW.js";
import "./vendor-supabase-DAiUAuun.js";
import "./vendor-router-CmoTwRnm.js";
import "./useNotificationStore-BS4df28T.js";
const c = async (i, s, t) => {
        const r = p.getState().profile ?.studyPreferences ?.dayOffset ?? 0,
            n = y(new Date, r),
            u = q.getState(),
            a = u.getLogByDate(n),
            m = { ...a,
                id: a ?.id || `log-${n}`,
                date: n,
                sleepHours: a ?.sleepHours || 8,
                sleepQuality: a ?.sleepQuality || "good",
                energyLevel: a ?.energyLevel || 7,
                mood: a ?.mood || "Neutral",
                questionsSolved: i,
                questionsAttempted: s,
                questionsTarget: t,
                createdAt: a ?.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
        await u.addLog(m)
    },
    B = z()(j((i, s) => ({
        questionsTarget: 50,
        questionsSolved: 0,
        questionsAttempted: 0,
        quickNotes: "",
        setQuestionsTarget: async t => {
            i({
                questionsTarget: t
            }), await c(s().questionsSolved, s().questionsAttempted, t)
        },
        setQuestionsSolved: async t => {
            i({
                questionsSolved: t
            }), await c(t, s().questionsAttempted, s().questionsTarget)
        },
        setQuestionsAttempted: async t => {
            i({
                questionsAttempted: t
            }), await c(s().questionsSolved, t, s().questionsTarget)
        },
        incrementQuestionsSolved: async (t = 1) => {
            const r = s().questionsSolved + t,
                n = Math.max(s().questionsAttempted, r);
            i({
                questionsSolved: r,
                questionsAttempted: n
            }), await c(r, n, s().questionsTarget)
        },
        incrementQuestionsAttempted: async (t = 1) => {
            const r = s().questionsAttempted + t;
            i({
                questionsAttempted: r
            }), await c(s().questionsSolved, r, s().questionsTarget)
        },
        setQuickNotes: t => i({
            quickNotes: t
        }),
        syncToDailyLog: async () => await c(s().questionsSolved, s().questionsAttempted, s().questionsTarget)
    }), {
        name: "isotope-tools-storage",
        storage: N(() => S),
        onRehydrateStorage: () => i => {
            (async () => {
                if (!i) return;
                const s = p.getState().profile ?.studyPreferences ?.dayOffset ?? 0,
                    t = y(new Date, s);
                await g.getItem("tools-last-reset") !== t && (i.questionsSolved = 0, i.questionsAttempted = 0, await g.setItem("tools-last-reset", t))
            })()
        }
    })),
    G = ({
        isOpen: i,
        onClose: s
    }) => {
        const [t, r] = h.useState(null), {
            questionsTarget: n,
            questionsSolved: u,
            quickNotes: a,
            setQuestionsTarget: m,
            setQuestionsSolved: w,
            setQuickNotes: v
        } = B(), l = u, x = w;
        h.useEffect(() => {
            i || r(null)
        }, [i]), h.useEffect(() => {
            if (!i) return;
            const o = f => {
                f.key === "Escape" && s()
            };
            return window.addEventListener("keydown", o), () => window.removeEventListener("keydown", o)
        }, [i, s]);
        const d = [{
            id: "notes",
            name: "Quick Notes",
            icon: D,
            color: "text-yellow-500",
            bg: "bg-yellow-500/10"
        }, {
            id: "questions",
            name: "Daily Questions",
            icon: C,
            color: "text-rose-500",
            bg: "bg-rose-500/10"
        }, {
            id: "music",
            name: "Music Bar",
            icon: L,
            color: "text-green-500",
            bg: "bg-green-500/10"
        }, {
            id: "calculator",
            name: "Study Calculator",
            icon: Q,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            iframeSrc: "https://www.desmos.com/scientific"
        }, {
            id: "graphing",
            name: "Graphing Calculator",
            icon: M,
            color: "text-indigo-500",
            bg: "bg-indigo-500/10",
            iframeSrc: "https://www.desmos.com/calculator"
        }, {
            id: "periodic",
            name: "Periodic Table",
            icon: E,
            color: "text-brand-500",
            bg: "bg-brand-500/10",
            iframeSrc: "https://ptable.com/"
        }, {
            id: "converter",
            name: "Unit Converter",
            icon: I,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            iframeSrc: "https://www.unitconverters.net/"
        }];
        return i ? k.createPortal(e.jsx(T, {
            children: e.jsx("div", {
                className: "fixed inset-0 z-[9999] flex items-end justify-center bg-black/50 backdrop-blur-sm p-3 sm:items-center sm:p-4",
                onClick: s,
                children: e.jsxs(b.div, {
                    initial: {
                        opacity: 0,
                        scale: .95,
                        y: 20
                    },
                    animate: {
                        opacity: 1,
                        scale: 1,
                        y: 0
                    },
                    exit: {
                        opacity: 0,
                        scale: .95,
                        y: 20
                    },
                    onClick: o => o.stopPropagation(),
                    className: "bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[min(90dvh,46rem)] flex flex-col overflow-hidden shadow-2xl",
                    children: [e.jsxs("div", {
                        className: "flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 z-10",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [t && e.jsx("button", {
                                onClick: () => r(null),
                                className: "p-2 -ml-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors",
                                children: e.jsx(A, {
                                    className: "w-5 h-5 text-zinc-500 dark:text-zinc-400"
                                })
                            }), e.jsx("h2", {
                                className: "text-xl font-bold font-display text-zinc-900 dark:text-white",
                                children: t ? d.find(o => o.id === t) ?.name : "Study Tools"
                            })]
                        }), e.jsx("button", {
                            onClick: s,
                            className: "p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors",
                            children: e.jsx(P, {
                                className: "w-5 h-5 text-zinc-500 dark:text-zinc-400"
                            })
                        })]
                    }), e.jsx("div", {
                        className: "p-6 overflow-y-auto flex-1 dark:bg-zinc-900/50",
                        children: t ? e.jsxs("div", {
                            className: "h-full",
                            children: [t === "notes" && e.jsx("div", {
                                className: "h-full flex flex-col h-[400px]",
                                children: e.jsx("textarea", {
                                    value: a,
                                    onChange: o => v(o.target.value),
                                    placeholder: "Jot down quick thoughts or formulas here...",
                                    className: "flex-1 w-full bg-yellow-50 dark:bg-zinc-800 border items-start justify-start border-yellow-200 dark:border-zinc-700 rounded-xl p-4 text-zinc-800 dark:text-zinc-200 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                                })
                            }), t === "questions" && e.jsxs("div", {
                                className: "flex flex-col items-center justify-center p-8 text-center space-y-8 h-full min-h-[400px]",
                                children: [e.jsxs("div", {
                                    className: "space-y-2",
                                    children: [e.jsx("h3", {
                                        className: "text-2xl font-bold text-zinc-900 dark:text-white",
                                        children: "Daily Target"
                                    }), e.jsx("p", {
                                        className: "text-zinc-500 dark:text-zinc-400",
                                        children: "Track how many questions you solve today."
                                    })]
                                }), e.jsxs("div", {
                                    className: "relative w-48 h-48 flex items-center justify-center",
                                    children: [e.jsxs("svg", {
                                        viewBox: "0 0 100 100",
                                        className: "w-full h-full -rotate-90",
                                        children: [e.jsx("circle", {
                                            cx: "50",
                                            cy: "50",
                                            r: "45",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "8",
                                            className: "text-zinc-200 dark:text-zinc-800"
                                        }), e.jsx(b.circle, {
                                            cx: "50",
                                            cy: "50",
                                            r: "45",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "8",
                                            strokeLinecap: "round",
                                            className: "text-rose-500",
                                            initial: {
                                                strokeDasharray: "283",
                                                strokeDashoffset: "283"
                                            },
                                            animate: {
                                                strokeDashoffset: 283 - 283 * Math.min(l / Math.max(n, 1), 1)
                                            },
                                            transition: {
                                                duration: 1,
                                                ease: "easeOut"
                                            }
                                        })]
                                    }), e.jsxs("div", {
                                        className: "absolute flex flex-col items-center",
                                        children: [e.jsx("span", {
                                            className: "text-4xl font-display font-bold text-zinc-900 dark:text-white",
                                            children: l
                                        }), e.jsxs("span", {
                                            className: "text-sm font-medium text-zinc-500",
                                            children: ["/ ", n]
                                        })]
                                    })]
                                }), e.jsxs("div", {
                                    className: "flex items-center gap-4",
                                    children: [e.jsx("button", {
                                        onClick: () => x(Math.max(0, l - 1)),
                                        className: "w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 font-bold text-xl text-zinc-700 dark:text-zinc-300",
                                        children: "-"
                                    }), e.jsx("button", {
                                        onClick: () => x(l + 1),
                                        className: "w-16 h-12 rounded-xl bg-rose-500 flex items-center justify-center hover:bg-rose-600 font-bold text-xl text-white",
                                        children: "+"
                                    }), e.jsx("button", {
                                        onClick: () => x(l + 5),
                                        className: "w-16 h-12 rounded-xl bg-rose-500 flex items-center justify-center hover:bg-rose-600 font-bold text-lg text-white",
                                        children: "+5"
                                    })]
                                }), e.jsxs("div", {
                                    className: "pt-6 border-t border-zinc-200 dark:border-zinc-800 w-full flex items-center justify-between",
                                    children: [e.jsx("span", {
                                        className: "font-medium text-zinc-700 dark:text-zinc-300",
                                        children: "Set New Target:"
                                    }), e.jsx("input", {
                                        type: "number",
                                        value: n,
                                        onChange: o => m(parseInt(o.target.value) || 0),
                                        className: "w-24 text-center px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/50 dark:text-white"
                                    })]
                                })]
                            }), t === "music" && e.jsxs("div", {
                                className: "flex flex-col h-[450px] space-y-4",
                                children: [e.jsx("p", {
                                    className: "text-sm text-zinc-500 dark:text-zinc-400",
                                    children: "Study Lo-Fi Mix via Spotify"
                                }), e.jsx("iframe", {
                                    src: "https://open.spotify.com/embed/playlist/0vvXsWCC9xrXsKd4FyS8kM?utm_source=generator&theme=0",
                                    width: "100%",
                                    height: "380",
                                    frameBorder: "0",
                                    allow: "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture",
                                    loading: "lazy",
                                    className: "rounded-xl shadow-lg border-0"
                                })]
                            }), d.find(o => o.id === t) ?.iframeSrc && e.jsx("div", {
                                className: "flex flex-col h-[min(600px,60dvh)] w-full bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-inner border border-zinc-200 dark:border-zinc-700",
                                children: e.jsx("iframe", {
                                    src: d.find(o => o.id === t) ?.iframeSrc,
                                    className: "w-full h-full border-0 bg-white",
                                    title: d.find(o => o.id === t) ?.name
                                })
                            })]
                        }) : e.jsx("div", {
                            className: "grid grid-cols-2 md:grid-cols-3 gap-4",
                            children: d.map(o => {
                                const f = o.icon;
                                return e.jsxs("button", {
                                    onClick: () => {
                                        r(o.id)
                                    },
                                    className: "flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-brand-500/50 hover:shadow-lg transition-all group",
                                    children: [e.jsx("div", {
                                        className: `p-4 rounded-xl ${o.bg} group-hover:scale-110 transition-transform`,
                                        children: e.jsx(f, {
                                            className: `w-8 h-8 ${o.color}`
                                        })
                                    }), e.jsx("span", {
                                        className: "font-semibold text-zinc-700 dark:text-zinc-300 text-center",
                                        children: o.name
                                    })]
                                }, o.id)
                            })
                        })
                    })]
                })
            })
        }), document.body) : null
    };
export {
    G as
    default
};