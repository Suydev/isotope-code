import {
    r as d,
    j as e
} from "./vendor-react-BfU3Zn2J.js";
import {
    u as y,
    s as P
} from "./useAIStore-B2cv1FZz.js";
import {
    u as f
} from "./DashboardHeader-DNuRMna8.js";
import {
    M as _
} from "./MarkdownRenderer-CIV1x0Uq.js";
import {
    m as l,
    A as E
} from "./vendor-motion-Cp_NPzpZ.js";
import {
    i as c,
    S as j,
    aa as K
} from "./vendor-icons-CqruUz7g.js";
const q = ({
    cardId: o,
    title: w,
    subtitle: v,
    icon: k,
    onAnalyze: N,
    analysisContent: z,
    onRefresh: x,
    isLoading: A = !1,
    emptyState: m,
    contextTag: C = "AI Analysis",
    glowColor: S = "brand"
}) => {
    const p = y(t => t.hasApiKey),
        h = y(t => t.dailyInsightStatus[o]),
        a = f(t => t.collapsedCards[o] ?? !1),
        I = f(t => t.setCollapsed),
        [R, L] = d.useState(null),
        [$, g] = d.useState(!1),
        s = A || $ || h ?.isLoading === !0,
        r = h ?.error ?? null,
        u = z ?? R,
        i = d.useMemo(() => P(u), [u]),
        b = async () => {
            if (p) {
                g(!0);
                try {
                    const t = await N();
                    typeof t == "string" && L(t)
                } catch (t) {
                    console.error("AI Analysis Failed", t)
                } finally {
                    g(!1)
                }
            }
        },
        M = async t => {
            t.stopPropagation(), x ? await x() : await b()
        },
        n = {
            brand: "bg-brand-500/10 border-brand-500/20 text-brand-600 dark:text-brand-600 dark:text-brand-400",
            emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
            amber: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
            rose: "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400",
            cyan: "bg-cyan-500/10 border-cyan-500/20 text-cyan-600 dark:text-cyan-400"
        }[S];
    return p ? e.jsxs(l.div, {
        initial: {
            opacity: 0,
            scale: .98
        },
        animate: {
            opacity: 1,
            scale: 1
        },
        className: `rounded-2xl px-[var(--density-card-padding)] py-[calc(var(--density-card-padding)-0.125rem)] lg:px-[var(--density-card-padding-lg)] lg:py-[calc(var(--density-card-padding-lg)-0.125rem)] border bg-white dark:bg-[#0a0a0a] backdrop-blur-md relative overflow-hidden group transition-all duration-300 shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] ${a?"mb-2":""} ${n.replace("text-","border-").split(" ")[1]}`,
        children: [e.jsx("div", {
            className: `absolute top-0 right-0 w-[400px] h-[400px] rounded-full ${n.split(" ")[0]} blur-[100px] opacity-10 group-hover:opacity-25 transition-opacity pointer-events-none`
        }), e.jsxs("div", {
            className: "relative z-10",
            children: [e.jsxs("div", {
                className: `flex items-center justify-between cursor-pointer select-none ${a?"":"mb-3"}`,
                onClick: () => I(o, !a),
                children: [e.jsxs("div", {
                    className: "flex items-center gap-3",
                    children: [e.jsx("div", {
                        className: `p-2 rounded-xl shrink-0 ${n}`,
                        children: e.jsx(k, {
                            className: "w-4 h-4 md:w-5 md:h-5"
                        })
                    }), e.jsxs("div", {
                        children: [e.jsxs("h3", {
                            className: "text-sm md:text-base font-bold text-zinc-900 dark:text-white leading-tight flex items-center gap-2",
                            children: [w, a && i && e.jsx("span", {
                                className: "w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse"
                            })]
                        }), !a && e.jsx("p", {
                            className: "text-[10px] md:text-xs text-zinc-500 font-medium",
                            children: v
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [!i && !a && e.jsxs("button", {
                        onClick: t => {
                            t.stopPropagation(), b()
                        },
                        disabled: s,
                        className: `flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${n} hover:bg-opacity-20`,
                        children: [s ? e.jsx(c, {
                            className: "w-3 h-3 animate-spin"
                        }) : e.jsx(j, {
                            className: "w-3 h-3"
                        }), s ? "Analyzing..." : "Analyze"]
                    }), e.jsx(l.div, {
                        animate: {
                            rotate: a ? 0 : 180
                        },
                        className: "text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors",
                        children: e.jsx("svg", {
                            className: "w-4 h-4",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            children: e.jsx("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M19 9l-7 7-7-7"
                            })
                        })
                    })]
                })]
            }), e.jsx(E, {
                children: !a && e.jsx(l.div, {
                    initial: {
                        opacity: 0,
                        height: 0
                    },
                    animate: {
                        opacity: 1,
                        height: "auto"
                    },
                    exit: {
                        opacity: 0,
                        height: 0
                    },
                    transition: {
                        duration: .2
                    },
                    children: i ? e.jsxs("div", {
                        className: "space-y-3 pt-2",
                        children: [s && e.jsxs("div", {
                            className: "flex items-center gap-2 rounded-xl border border-brand-500/20 bg-brand-500/5 px-3 py-2 text-[11px] font-medium text-zinc-600 dark:text-zinc-300",
                            children: [e.jsx(c, {
                                className: "w-3 h-3 animate-spin text-brand-500"
                            }), "Refreshing this insight without clearing your last good result."]
                        }), r && !s && e.jsxs("div", {
                            className: "rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-[11px] font-medium text-zinc-600 dark:text-zinc-300",
                            children: ["Couldn't refresh just now. Showing your last successful insight.", " ", r]
                        }), e.jsx("div", {
                            className: "prose dark:prose-invert prose-xs md:prose-sm max-w-none text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed",
                            children: e.jsx(_, {
                                content: i,
                                enableCodeHighlight: !1
                            })
                        }), e.jsx("div", {
                            className: "flex justify-end pt-2 border-t border-zinc-100 dark:border-white/5",
                            children: e.jsxs("button", {
                                onClick: M,
                                disabled: s,
                                className: "text-[10px] md:text-xs font-medium text-zinc-500 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1.5 transition-colors",
                                children: [s ? e.jsx(c, {
                                    className: "w-3 h-3 animate-spin"
                                }) : e.jsx(K, {
                                    className: "w-3 h-3"
                                }), s ? "Refreshing..." : "Regenerate"]
                            })
                        })]
                    }) : e.jsx("div", {
                        className: "flex items-center justify-center rounded-xl bg-zinc-50/50 dark:bg-white/[0.015] border border-zinc-100/50 dark:border-white/[0.03] p-2.5 mt-2 transition-colors group-hover:dark:bg-white/[0.02]",
                        children: e.jsxs("div", {
                            className: "w-full space-y-3",
                            children: [r && !s && e.jsxs("div", {
                                className: "rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-[11px] font-medium text-zinc-600 dark:text-zinc-300",
                                children: ["Couldn't generate an insight yet. ", r]
                            }), m || e.jsxs("div", {
                                className: "flex items-center gap-3",
                                children: [e.jsx(j, {
                                    className: `w-4 h-4 opacity-50 ${n.split(" ")[2]}`
                                }), e.jsx("p", {
                                    className: "text-xs text-zinc-500 font-medium tracking-wide",
                                    children: s ? "Crunching your academic data..." : "Ready for strategic analysis."
                                })]
                            }), !m && !s && !r && e.jsx("p", {
                                className: "text-[11px] text-zinc-400 font-medium",
                                children: C
                            })]
                        })
                    })
                })
            })]
        })]
    }) : null
};
export {
    q as A
};