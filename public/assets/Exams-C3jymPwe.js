import {
    j as e,
    r as g,
    f as et
} from "./vendor-react-BfU3Zn2J.js";
import {
    c as _
} from "./utils-D8mZnxMk.js";
import {
    c as tt
} from "./App-pJGjDiPw.js";
import {
    S as st,
    D as at
} from "./DashboardHeader-DNuRMna8.js";
import {
    u as Se,
    f as rt,
    b as ke,
    e as Le,
    T as Pe,
    c as nt,
    S as it,
    g as he,
    a as Ce,
    h as lt,
    i as ct,
    E as ot,
    j as Fe
} from "./ExamCreateEditModal-BdlzfeFO.js";
import {
    p as K,
    u as Re
} from "./useFocusStore-CX_Nyp1h.js";
import {
    S as dt,
    am as oe,
    P as Ne,
    bc as xt,
    b_ as mt,
    B as ye,
    aG as ht,
    bj as ut,
    br as pt,
    X as Oe,
    a as gt,
    aC as bt,
    C as Ie,
    ba as ft,
    bA as jt,
    bG as _e,
    bF as wt,
    b$ as vt,
    bs as kt,
    r as we,
    l as Nt,
    h as Ee,
    T as Be,
    f as yt,
    at as zt,
    L as St,
    b3 as Ct,
    Z as _t,
    aD as Et,
    c0 as Mt,
    c1 as Dt,
    c2 as At,
    aK as Tt,
    bn as $t,
    b5 as Lt,
    bD as Pt
} from "./vendor-icons-CqruUz7g.js";
import {
    m as D,
    A as ce
} from "./vendor-motion-Cp_NPzpZ.js";
import {
    u as G
} from "./vendor-router-CmoTwRnm.js";
import {
    e as We,
    i as Q,
    s as ve,
    f as I,
    m as Z,
    d as Ft,
    p as Rt,
    g as He,
    h as Ot,
    a as Y,
    S as R,
    b as se,
    T as Me,
    j as It,
    k as Bt
} from "./ExamPrimitives-K6hgnm_l.js";
import {
    R as ae,
    A as Wt,
    C as De,
    X as ue,
    Y as pe,
    T as re,
    a as Ht,
    m as Yt,
    P as Kt,
    c as Gt,
    d as ge,
    B as Ae,
    b as Te
} from "./vendor-charts-CFLJvnG7.js";
import {
    c as Ut
} from "./useAIStore-B2cv1FZz.js";
import "./index-BPYJFSVW.js";
import "./vendor-supabase-DAiUAuun.js";
import "./HeadwayUpdatesButton-DUh668tJ.js";
import "./useOnlineStatus-BJOTUERN.js";
import "./timeFormat-CMPo-BX2.js";
import "./MarkdownRenderer-CIV1x0Uq.js";
import "./useSyncStore-vWs_TdIc.js";
import "./useNotificationStore-BS4df28T.js";
import "./IsotopeLogoIcon-oPk5Ru-_.js";
const ne = ({
        value: t,
        label: o,
        pulse: a
    }) => e.jsxs("div", {
        className: "flex flex-col items-center",
        children: [e.jsx(D.span, {
            initial: a ? {
                scale: .92,
                opacity: .6
            } : !1,
            animate: {
                scale: 1,
                opacity: 1
            },
            transition: {
                duration: .18,
                ease: "easeOut"
            },
            className: "text-3xl sm:text-5xl md:text-6xl font-bold tabular-nums tracking-tight text-zinc-900 dark:text-white font-mono",
            children: String(t).padStart(2, "0")
        }, t), e.jsx("span", {
            className: "text-[10px] sm:text-xs uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mt-1",
            children: o
        })]
    }),
    be = () => e.jsx("span", {
        className: "text-2xl sm:text-4xl md:text-5xl font-light text-zinc-300 dark:text-zinc-600 tabular-nums mx-1 sm:mx-2 self-start mt-1",
        children: ":"
    }),
    qt = ({
        percent: t,
        color: o,
        size: a = 88
    }) => {
        const i = (a - 6) / 2,
            r = 2 * Math.PI * i,
            n = r - Math.min(100, Math.max(0, t)) / 100 * r;
        return e.jsxs("svg", {
            width: a,
            height: a,
            viewBox: `0 0 ${a} ${a}`,
            className: "-rotate-90",
            children: [e.jsx("circle", {
                cx: a / 2,
                cy: a / 2,
                r: i,
                fill: "none",
                stroke: "currentColor",
                strokeWidth: 6,
                className: "text-zinc-200 dark:text-white/[0.08]"
            }), e.jsx(D.circle, {
                cx: a / 2,
                cy: a / 2,
                r: i,
                fill: "none",
                stroke: o,
                strokeWidth: 6,
                strokeLinecap: "round",
                strokeDasharray: r,
                initial: {
                    strokeDashoffset: r
                },
                animate: {
                    strokeDashoffset: n
                },
                transition: {
                    duration: .8,
                    ease: "easeOut"
                }
            })]
        })
    },
    Xt = ({
        onSchedule: t
    }) => e.jsxs("div", {
        className: "relative rounded-2xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-8 sm:p-12 text-center overflow-hidden",
        children: [e.jsx("div", {
            className: "absolute inset-0 bg-gradient-to-br from-brand-500/[0.03] via-transparent to-transparent pointer-events-none"
        }), e.jsxs("div", {
            className: "relative",
            children: [e.jsx("div", {
                className: "w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-100 dark:bg-white/[0.04] flex items-center justify-center",
                children: e.jsx(oe, {
                    className: "w-7 h-7 text-zinc-400"
                })
            }), e.jsx("h2", {
                className: "text-xl font-semibold text-zinc-900 dark:text-white mb-2",
                children: "No D-Day exams scheduled"
            }), e.jsx("p", {
                className: "text-sm text-zinc-500 dark:text-zinc-400 mb-6",
                children: "Add a D-Day exam to pin your main countdown and readiness tracking."
            }), e.jsxs("button", {
                onClick: t,
                className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-medium text-sm hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/20",
                children: [e.jsx(Ne, {
                    className: "w-4 h-4"
                }), " Schedule first exam"]
            })]
        })]
    }),
    Vt = ({
        exam: t,
        status: o,
        onEdit: a,
        navigate: s,
        hasSyllabus: i
    }) => e.jsxs("div", {
        className: "flex items-center gap-2 flex-wrap",
        children: [o === "upcoming" && a && e.jsxs("button", {
            onClick: () => a(t),
            className: "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/[0.04] transition-colors",
            children: [e.jsx(xt, {
                className: "w-3 h-3"
            }), " Edit"]
        }), e.jsxs("button", {
            onClick: () => s(`/exams/${t.id}`),
            className: "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/[0.04] transition-colors",
            children: [e.jsx(mt, {
                className: "w-3 h-3"
            }), " View details"]
        }), i && e.jsxs("button", {
            onClick: () => s("/syllabus"),
            className: "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/[0.04] transition-colors",
            children: [e.jsx(ye, {
                className: "w-3 h-3"
            }), " Open syllabus"]
        }), e.jsxs("button", {
            onClick: () => s("/study"),
            className: "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/[0.04] transition-colors",
            children: [e.jsx(ht, {
                className: "w-3 h-3"
            }), " Lock in"]
        })]
    }),
    Zt = ({
        color: t,
        readiness: o,
        studied: a,
        total: s,
        prepVelocity: i
    }) => e.jsx("div", {
        className: "lg:w-56 flex-shrink-0 p-4 rounded-xl bg-zinc-50/80 dark:bg-white/[0.03] border border-zinc-100 dark:border-white/[0.05]",
        children: e.jsxs("div", {
            className: "flex items-center gap-3",
            children: [e.jsxs("div", {
                className: "relative w-[88px] h-[88px] flex-shrink-0",
                children: [e.jsx(qt, {
                    percent: o,
                    color: t,
                    size: 88
                }), e.jsxs("div", {
                    className: "absolute inset-0 flex flex-col items-center justify-center",
                    children: [e.jsx("span", {
                        className: "text-xl font-bold tabular-nums text-zinc-900 dark:text-white",
                        children: o
                    }), e.jsx("span", {
                        className: "text-[9px] uppercase tracking-wider text-zinc-400",
                        children: "readiness"
                    })]
                })]
            }), e.jsxs("div", {
                className: "flex-1 min-w-0 space-y-2.5",
                children: [e.jsxs("div", {
                    children: [e.jsx("div", {
                        className: "text-[10px] uppercase tracking-wider text-zinc-400 font-semibold",
                        children: "Syllabus"
                    }), e.jsxs("div", {
                        className: "text-sm font-bold tabular-nums text-zinc-900 dark:text-white",
                        children: [a, "/", s, e.jsx("span", {
                            className: "text-[10px] font-normal text-zinc-400 ml-1",
                            children: "chapters"
                        })]
                    })]
                }), i && e.jsxs("div", {
                    children: [e.jsx("div", {
                        className: "text-[10px] uppercase tracking-wider text-zinc-400 font-semibold",
                        children: "Cadence"
                    }), e.jsxs("div", {
                        className: "text-sm font-bold tabular-nums text-zinc-900 dark:text-white",
                        children: [i.perWeek.toFixed(1), e.jsx("span", {
                            className: "text-[10px] font-normal text-zinc-400 ml-1",
                            children: "mocks/wk"
                        })]
                    })]
                })]
            })]
        })
    }),
    Qt = ({
        exam: t,
        status: o,
        otherLatestExam: a,
        studiedChapters: s,
        totalChapters: i,
        sameDayExams: r = [],
        prepVelocity: n,
        onEdit: d,
        onSchedule: l,
        onSwitchFeatured: x
    }) => {
        const m = G(),
            j = Se(t),
            k = Se(a ?? null),
            p = rt(t);
        if (!t) return e.jsx(Xt, {
            onSchedule: l
        });
        const u = K(t.date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            }),
            w = t.start_time ? ` at ${t.start_time}` : "",
            E = a ? K(a.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric"
            }) : "",
            L = a ? k.isExpired ? "today" : k.days > 0 ? `${k.days}d ${k.hours}h` : k.hours > 0 ? `${k.hours}h ${k.minutes}m` : `${k.minutes}m` : "",
            b = i && i > 0 ? Math.round((s ?? 0) / i * 100) : 0,
            P = n ? Math.min(100, n.perWeek / 2 * 100) : 0,
            T = Math.round(b * .6 + P * .4);
        return e.jsxs("div", {
            className: _("relative rounded-2xl border overflow-hidden", "bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-white/[0.08]", "shadow-sm dark:shadow-none"),
            children: [e.jsx("div", {
                className: "absolute inset-0 opacity-[0.05] dark:opacity-[0.08] pointer-events-none",
                style: {
                    background: `radial-gradient(circle at 0% 0%, ${t.color}, transparent 50%), radial-gradient(circle at 100% 100%, ${t.color}40, transparent 50%)`
                }
            }), e.jsx("div", {
                className: "absolute left-0 top-0 bottom-0 w-1",
                style: {
                    backgroundColor: t.color
                }
            }), e.jsxs("div", {
                className: "relative p-6 sm:p-8",
                children: [e.jsxs("div", {
                    className: "flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6",
                    children: [e.jsxs("div", {
                        className: "flex-1 min-w-0 space-y-4",
                        children: [e.jsxs("div", {
                            children: [e.jsxs("div", {
                                className: "flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold text-zinc-400 mb-2",
                                children: [e.jsx(dt, {
                                    className: "w-3 h-3"
                                }), "Featured Exam"]
                            }), e.jsx("h1", {
                                className: "text-xl sm:text-3xl font-bold text-zinc-900 dark:text-white truncate",
                                children: t.title
                            }), e.jsxs("div", {
                                className: "flex items-center gap-2 mt-2 flex-wrap",
                                children: [e.jsx(ke, {
                                    type: t.exam_type
                                }), e.jsx(Le, {
                                    priority: t.priority
                                }), t.tags.slice(0, 3).map(M => e.jsx(Pe, {
                                    tag: M,
                                    color: t.tag_colors ?.[M.replace(/^#/, "")]
                                }, M))]
                            })]
                        }), o === "upcoming" && e.jsxs("div", {
                            className: "space-y-3",
                            children: [e.jsxs("div", {
                                className: "flex items-center gap-1 sm:gap-0",
                                children: [e.jsx(ne, {
                                    value: j.days,
                                    label: "Days"
                                }), e.jsx(be, {}), e.jsx(ne, {
                                    value: j.hours,
                                    label: "Hours"
                                }), e.jsx(be, {}), e.jsx(ne, {
                                    value: j.minutes,
                                    label: "Min"
                                }), e.jsx(be, {}), e.jsx(ne, {
                                    value: j.seconds,
                                    label: "Sec",
                                    pulse: !0
                                })]
                            }), e.jsxs("p", {
                                className: "text-sm text-zinc-500 dark:text-zinc-400 inline-flex items-center gap-1.5",
                                children: [e.jsx(oe, {
                                    className: "w-3.5 h-3.5"
                                }), " ", u, w]
                            })]
                        }), o === "in_progress" && e.jsxs("div", {
                            className: "space-y-3",
                            children: [e.jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [e.jsxs("span", {
                                    className: "relative flex h-2.5 w-2.5",
                                    children: [e.jsx("span", {
                                        className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
                                    }), e.jsx("span", {
                                        className: "relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"
                                    })]
                                }), e.jsx("span", {
                                    className: "text-sm font-bold text-green-500 uppercase tracking-wide",
                                    children: "Exam in progress"
                                }), e.jsxs("span", {
                                    className: "text-xs text-zinc-500 tabular-nums ml-2",
                                    children: [Math.round(p.percentage), "% elapsed"]
                                })]
                            }), e.jsx("div", {
                                className: "h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden",
                                children: e.jsx(D.div, {
                                    className: "h-full bg-green-500 rounded-full",
                                    animate: {
                                        width: `${p.percentage}%`
                                    },
                                    transition: {
                                        duration: .5,
                                        ease: "easeOut"
                                    }
                                })
                            }), e.jsxs("div", {
                                className: "flex items-center justify-between text-xs text-zinc-400 tabular-nums",
                                children: [e.jsxs("span", {
                                    children: [p.elapsed, "m elapsed"]
                                }), e.jsxs("span", {
                                    children: [p.remaining, "m remaining"]
                                })]
                            })]
                        }), e.jsx(Vt, {
                            exam: t,
                            status: o,
                            onEdit: d,
                            navigate: m,
                            hasSyllabus: !!i && i > 0
                        })]
                    }), i !== void 0 && i > 0 && e.jsx(Zt, {
                        color: t.color,
                        readiness: T,
                        studied: s ?? 0,
                        total: i,
                        prepVelocity: n
                    })]
                }), a && e.jsxs("div", {
                    className: "mt-4 pt-3 border-t border-zinc-100 dark:border-white/[0.06] flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400",
                    children: [e.jsx("span", {
                        className: "font-semibold uppercase tracking-wider text-zinc-400",
                        children: "Next exam"
                    }), e.jsx("button", {
                        onClick: () => m(`/exams/${a.id}`),
                        className: "min-w-0 truncate font-medium text-zinc-700 dark:text-zinc-200 hover:text-brand-600 dark:hover:text-brand-400 transition-colors",
                        children: a.title
                    }), e.jsx("span", {
                        className: "text-zinc-300 dark:text-zinc-700",
                        children: "·"
                    }), e.jsx("span", {
                        className: "tabular-nums text-zinc-600 dark:text-zinc-300",
                        children: L
                    }), e.jsxs("span", {
                        className: "hidden sm:inline text-zinc-400",
                        children: ["(", E, ")"]
                    })]
                }), r.length > 0 && e.jsxs("div", {
                    className: "mt-4 pt-3 border-t border-zinc-100 dark:border-white/[0.06] flex items-center gap-2 flex-wrap",
                    children: [e.jsx("span", {
                        className: "text-xs text-zinc-400",
                        children: "Also today:"
                    }), r.map(M => e.jsx("button", {
                        onClick: () => x ?.(M),
                        className: "px-2.5 py-1 text-xs font-medium rounded-lg bg-zinc-100 dark:bg-white/[0.06] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/[0.1] transition-colors",
                        children: M.title
                    }, M.id))]
                })]
            })]
        })
    },
    Jt = ({
        exams: t,
        onLogScore: o,
        onSnooze: a,
        onDismiss: s
    }) => {
        const [i, r] = g.useState(null), [n, d] = g.useState(!1);
        if (t.length === 0) return null;
        const l = t[0],
            x = t.slice(1);
        return e.jsx(ce, {
            children: e.jsxs(D.div, {
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
                transition: {
                    duration: .2,
                    ease: "easeOut"
                },
                className: "w-[90%] mx-auto rounded-xl border border-amber-500/20 bg-amber-50 dark:bg-amber-500/[0.06] p-3 sm:p-4",
                children: [e.jsxs("div", {
                    className: "flex items-center justify-between gap-3",
                    children: [e.jsxs("div", {
                        className: "flex items-center gap-3 min-w-0 flex-1",
                        children: [e.jsx("div", {
                            className: "w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0",
                            children: e.jsx(ut, {
                                className: "w-4 h-4 text-amber-600 dark:text-amber-400"
                            })
                        }), e.jsxs("div", {
                            className: "min-w-0 flex-1",
                            children: [e.jsxs("p", {
                                className: "text-sm font-medium text-zinc-900 dark:text-white truncate",
                                children: [e.jsx("span", {
                                    className: "font-semibold",
                                    children: l.title
                                }), e.jsx("span", {
                                    className: "text-zinc-500 dark:text-zinc-400",
                                    children: " — results may be out"
                                })]
                            }), x.length > 0 && e.jsxs("button", {
                                onClick: () => d(!n),
                                className: "text-xs text-amber-600 dark:text-amber-400 hover:underline mt-0.5",
                                children: ["and ", x.length, " other", x.length > 1 ? "s" : "", " ", n ? "▲" : "▼"]
                            })]
                        })]
                    }), e.jsxs("div", {
                        className: "flex items-center gap-2 flex-shrink-0",
                        children: [e.jsx("button", {
                            onClick: () => o(l),
                            className: "px-3 py-1.5 text-xs font-medium rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors",
                            children: "Log score"
                        }), e.jsxs("div", {
                            className: "relative",
                            children: [e.jsx("button", {
                                onClick: () => r(i === l.id ? null : l.id),
                                className: "w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors",
                                "aria-label": "More options",
                                children: e.jsx(pt, {
                                    className: "w-4 h-4 text-zinc-400"
                                })
                            }), i === l.id && e.jsxs("div", {
                                className: "absolute right-0 top-full mt-1 w-40 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-lg z-20 py-1",
                                children: [e.jsx("button", {
                                    onClick: () => {
                                        a(l.id, 1), r(null)
                                    },
                                    className: "w-full text-left px-3 py-2 text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/[0.04]",
                                    children: "Snooze 1 day"
                                }), e.jsx("button", {
                                    onClick: () => {
                                        a(l.id, 3), r(null)
                                    },
                                    className: "w-full text-left px-3 py-2 text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/[0.04]",
                                    children: "Snooze 3 days"
                                }), e.jsx("button", {
                                    onClick: () => {
                                        s(l.id), r(null)
                                    },
                                    className: "w-full text-left px-3 py-2 text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/[0.04]",
                                    children: "Dismiss"
                                })]
                            })]
                        }), e.jsx("button", {
                            onClick: () => s(l.id),
                            className: "w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors",
                            "aria-label": "Dismiss",
                            children: e.jsx(Oe, {
                                className: "w-3.5 h-3.5 text-zinc-400"
                            })
                        })]
                    })]
                }), e.jsx(ce, {
                    children: n && x.length > 0 && e.jsx(D.div, {
                        initial: {
                            height: 0,
                            opacity: 0
                        },
                        animate: {
                            height: "auto",
                            opacity: 1
                        },
                        exit: {
                            height: 0,
                            opacity: 0
                        },
                        transition: {
                            duration: .2
                        },
                        className: "overflow-hidden",
                        children: e.jsx("div", {
                            className: "mt-3 pt-3 border-t border-amber-500/10 space-y-2",
                            children: x.map(m => e.jsxs("div", {
                                className: "flex items-center justify-between",
                                children: [e.jsx("span", {
                                    className: "text-xs text-zinc-600 dark:text-zinc-300 truncate flex-1",
                                    children: m.title
                                }), e.jsx("button", {
                                    onClick: () => o(m),
                                    className: "text-xs font-medium text-brand-500 hover:text-brand-400 flex-shrink-0 ml-2",
                                    children: "Log score"
                                })]
                            }, m.id))
                        })
                    })
                })]
            })
        })
    },
    es = t => t.replace(/^#/, ""),
    Ye = (t, o, a) => {
        const s = es(a);
        return t.tag_colors ?.[s] || o ?.get(s)
    },
    ts = (t, o) => {
        const a = t.tags.map(s => Ye(t, o, s)).filter(s => !!s);
        return a.length > 0 ? Array.from(new Set(a)) : [t.color]
    },
    ss = ({
        data: t,
        color: o,
        width: a = 64,
        height: s = 20
    }) => {
        if (t.length < 2) return null;
        const i = Math.max(...t),
            r = Math.min(...t),
            n = i - r || 1,
            d = t.map((l, x) => {
                const m = x / (t.length - 1) * a,
                    j = s - (l - r) / n * (s - 4) - 2;
                return `${m.toFixed(1)},${j.toFixed(1)}`
            }).join(" ");
        return e.jsxs("svg", {
            width: a,
            height: s,
            className: "overflow-visible",
            children: [e.jsx("polyline", {
                fill: "none",
                stroke: o,
                strokeWidth: "1.5",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                points: d
            }), e.jsx("circle", {
                cx: a,
                cy: s - (t[t.length - 1] - r) / n * (s - 4) - 2,
                r: "2",
                fill: o
            })]
        })
    },
    as = ({
        exam: t,
        linkedMocksCount: o = 0,
        avgMockScore: a,
        mockTrajectory: s,
        studiedChapters: i,
        totalChapters: r,
        tagColors: n,
        onTagClick: d
    }) => {
        const l = G(),
            x = nt(t, new Date),
            j = K(t.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric"
            }),
            k = `${Math.floor(t.duration_minutes/60)}h ${t.duration_minutes%60>0?`${t.duration_minutes%60}m`:""}`.trim(),
            p = t.exam_type === "dday",
            c = t.result ?.percentage,
            u = ts(t, n),
            w = u[0] || t.color,
            E = u.length > 1 ? `linear-gradient(180deg, ${u.join(", ")})` : w,
            L = () => {
                if (x !== "in_progress") return 0;
                const b = t.start_time ? parseInt(t.start_time.split(":")[0]) : 0,
                    P = t.start_time ? parseInt(t.start_time.split(":")[1]) : 0,
                    T = K(t.date);
                T.setHours(b, P, 0, 0);
                const M = (Date.now() - T.getTime()) / 6e4;
                return t.duration_minutes > 0 ? Math.min(100, Math.max(0, M / t.duration_minutes * 100)) : 0
            };
        return e.jsxs(D.div, {
            whileHover: {
                scale: 1.015,
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)"
            },
            transition: {
                duration: .12,
                ease: "easeOut"
            },
            onClick: () => l(`/exams/${t.id}`),
            className: _("relative rounded-xl border cursor-pointer overflow-hidden transition-all", "bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-white/[0.08]", "shadow-sm dark:shadow-none", x === "pending_result" && "opacity-80", x === "result_ready" && "ring-1 ring-amber-500/30", t.priority === "critical" && x !== "result_logged" && x !== "archived" && "ring-1 ring-rose-500/20 dark:ring-rose-400/20", p && "min-h-[180px]"),
            children: [e.jsx("div", {
                className: "absolute inset-0 pointer-events-none",
                style: {
                    background: `linear-gradient(90deg, ${w}17 0%, transparent 34%)`
                }
            }), e.jsx("div", {
                className: _("absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl", x === "in_progress" && "animate-pulse"),
                style: {
                    background: E
                }
            }), u.length > 1 && e.jsx("div", {
                className: "absolute left-3 top-3 flex flex-col gap-1",
                children: u.slice(0, 4).map(b => e.jsx("span", {
                    className: "h-1.5 w-1.5 rounded-full ring-1 ring-white/50 dark:ring-black/30",
                    style: {
                        backgroundColor: b
                    }
                }, b))
            }), p && e.jsx("div", {
                className: "absolute top-3 right-3",
                children: e.jsx("span", {
                    className: "px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 uppercase tracking-wider",
                    children: "D-Day"
                })
            }), e.jsxs("div", {
                className: "pl-4 pr-4 py-4 space-y-3",
                children: [e.jsxs("div", {
                    className: "flex items-start justify-between gap-2",
                    children: [e.jsxs("h3", {
                        className: "text-sm font-semibold text-zinc-900 dark:text-white truncate flex-1 pr-2",
                        children: [x === "in_progress" && e.jsxs("span", {
                            className: "relative inline-flex h-2 w-2 mr-2 align-middle",
                            children: [e.jsx("span", {
                                className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
                            }), e.jsx("span", {
                                className: "relative inline-flex rounded-full h-2 w-2 bg-green-500"
                            })]
                        }), t.title]
                    }), !p && e.jsx(Le, {
                        priority: t.priority
                    })]
                }), e.jsxs("div", {
                    className: "flex items-center gap-2 flex-wrap",
                    children: [e.jsxs("span", {
                        className: "inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400",
                        children: [e.jsx(oe, {
                            className: "w-3 h-3"
                        }), " ", j, t.start_time && ` at ${t.start_time}`]
                    }), e.jsxs("span", {
                        className: "inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400",
                        children: [e.jsx(gt, {
                            className: "w-3 h-3"
                        }), " ", k]
                    }), e.jsx(ke, {
                        type: t.exam_type
                    })]
                }), x === "in_progress" && e.jsxs("div", {
                    className: "space-y-1",
                    children: [e.jsxs("div", {
                        className: "flex items-center justify-between text-xs",
                        children: [e.jsx("span", {
                            className: "font-medium text-green-500",
                            children: "IN PROGRESS"
                        }), e.jsxs("span", {
                            className: "text-zinc-400 tabular-nums",
                            children: [Math.round(L()), "%"]
                        })]
                    }), e.jsx("div", {
                        className: "h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden",
                        children: e.jsx(D.div, {
                            className: "h-full bg-green-500 rounded-full",
                            initial: {
                                width: 0
                            },
                            animate: {
                                width: `${L()}%`
                            },
                            transition: {
                                duration: .4,
                                ease: "easeOut"
                            }
                        })
                    })]
                }), x === "pending_result" && e.jsxs("p", {
                    className: "text-xs text-zinc-400",
                    children: ["Completed ", j, t.result_declaration_date && e.jsxs(e.Fragment, {
                        children: [" ", "· Result expected", " ", K(t.result_declaration_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric"
                        })]
                    })]
                }), x === "result_ready" && e.jsxs("div", {
                    className: "flex items-center justify-between",
                    children: [e.jsx("span", {
                        className: "text-xs font-medium text-amber-500",
                        children: "Results may be out!"
                    }), e.jsx("button", {
                        onClick: b => {
                            b.stopPropagation(), l(`/exams/${t.id}?tab=result`)
                        },
                        className: "text-xs font-medium px-3 py-1 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors",
                        children: "Log score"
                    })]
                }), x === "result_logged" && c !== void 0 && e.jsxs("div", {
                    className: "flex items-center justify-between",
                    children: [e.jsx(it, {
                        percentage: c,
                        size: "sm"
                    }), e.jsxs("div", {
                        className: "flex items-center gap-2 text-xs text-zinc-400",
                        children: [t.result ?.rank && e.jsxs("span", {
                            children: ["Rank #", t.result.rank.toLocaleString()]
                        }), t.result ?.percentile && e.jsxs("span", {
                            children: [t.result.percentile, "%ile"]
                        })]
                    })]
                }), x !== "result_logged" && r !== void 0 && r > 0 && e.jsxs("div", {
                    className: "space-y-1",
                    children: [e.jsxs("div", {
                        className: "flex items-center justify-between text-xs text-zinc-400",
                        children: [e.jsxs("span", {
                            className: "inline-flex items-center gap-1",
                            children: [e.jsx(ye, {
                                className: "w-3 h-3"
                            }), " ", i ?? 0, " / ", r, " chapters"]
                        }), e.jsxs("span", {
                            className: "tabular-nums text-zinc-400",
                            children: [Math.round((i ?? 0) / r * 100), "%"]
                        })]
                    }), e.jsx("div", {
                        className: "h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden",
                        children: e.jsx(D.div, {
                            className: "h-full rounded-full",
                            initial: {
                                width: 0
                            },
                            animate: {
                                width: `${(i??0)/r*100}%`
                            },
                            transition: {
                                duration: .5,
                                ease: "easeOut"
                            },
                            style: {
                                backgroundColor: w
                            }
                        })
                    })]
                }), t.tags.length > 0 && e.jsxs("div", {
                    className: "flex items-center gap-1.5 flex-wrap",
                    children: [t.tags.slice(0, 4).map(b => e.jsx(Pe, {
                        tag: b,
                        color: Ye(t, n, b),
                        onClick: d ? () => d(b) : void 0
                    }, b)), t.tags.length > 4 && e.jsxs("span", {
                        className: "text-xs text-zinc-400",
                        children: ["+", t.tags.length - 4]
                    })]
                }), p && o > 0 && e.jsxs("div", {
                    className: "flex items-center justify-between gap-3 pt-2 border-t border-zinc-100 dark:border-white/[0.06]",
                    children: [e.jsxs("div", {
                        className: "flex items-center gap-3 min-w-0",
                        children: [e.jsxs("span", {
                            className: "text-xs font-semibold text-zinc-700 dark:text-zinc-300",
                            children: [o, " mock", o !== 1 ? "s" : ""]
                        }), a !== void 0 && e.jsxs("span", {
                            className: "text-xs text-zinc-500 inline-flex items-center gap-1 tabular-nums",
                            children: [e.jsx(bt, {
                                className: "w-3 h-3"
                            }), " ", Math.round(a), "% avg"]
                        })]
                    }), s && s.length >= 2 && e.jsx(ss, {
                        data: s,
                        color: w
                    })]
                }), t.dday_exam_id && e.jsxs("p", {
                    className: "text-[11px] text-zinc-400 truncate",
                    children: ["Part of D-Day exam ", e.jsx(Ie, {
                        className: "w-3 h-3 inline"
                    })]
                })]
            })]
        })
    },
    rs = {
        dday: "#f97316",
        mock: "#6366f1",
        sectional: "#10b981",
        practice: "#06b6d4"
    },
    ie = {
        conceptual: "#ef4444",
        silly: "#f97316",
        memory: "#eab308",
        guesswork: "#8b5cf6"
    },
    fe = {
        dday: "D-Day",
        mock: "Mocks",
        sectional: "Sectional",
        practice: "Practice"
    },
    F = t => `${t.toFixed(t>=95?0:1)}%`,
    ns = (t, o, a = 3) => {
        const s = Math.max(0, o - a + 1);
        return Z(t.slice(s, o + 1))
    },
    le = ({
        active: t,
        payload: o,
        label: a
    }) => !t || !o ?.length ? null : e.jsxs("div", {
        className: "rounded-xl border border-zinc-200 bg-white p-3 text-xs shadow-xl dark:border-white/10 dark:bg-zinc-950",
        children: [e.jsx("p", {
            className: "mb-2 font-semibold text-zinc-900 dark:text-white",
            children: a
        }), e.jsx("div", {
            className: "space-y-1.5",
            children: o.map((s, i) => e.jsxs("div", {
                className: "flex items-center justify-between gap-5",
                children: [e.jsx("span", {
                    className: "font-medium",
                    style: {
                        color: s.color
                    },
                    children: s.name
                }), e.jsx("span", {
                    className: "font-bold tabular-nums text-zinc-900 dark:text-white",
                    children: s.value
                })]
            }, `${s.dataKey??s.name}-${i}`))
        })]
    }),
    is = () => e.jsx(R, {
        variant: "tinted",
        padding: "lg",
        accentTone: "brand",
        children: e.jsx("div", {
            className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
            children: e.jsxs("div", {
                className: "max-w-2xl",
                children: [e.jsx("p", {
                    className: "text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-300",
                    children: "Analytics Command Center"
                }), e.jsx("h3", {
                    className: "mt-1 text-lg font-semibold tracking-tight text-zinc-900 dark:text-white",
                    children: "Log a few results to unlock exam intelligence."
                }), e.jsx("p", {
                    className: "mt-1 text-sm text-zinc-500 dark:text-zinc-400",
                    children: "Once results are added, this space will surface trend, consistency, readiness, weak subjects, error patterns, and D-Day calibration."
                })]
            })
        })
    }),
    ls = ({
        exams: t
    }) => {
        const o = G(),
            a = g.useMemo(() => {
                const s = t.filter(h => !h.deleted_at && !h.archived_at),
                    i = We(s.filter(Q)),
                    r = ve(s.filter(h => !h.result && I(h) >= Date.now()));
                if (i.length === 0) return null;
                const n = i.map(h => h.result.percentage),
                    d = n[n.length - 1] ?? 0,
                    l = n[0] ?? d,
                    x = n.slice(-5),
                    m = Z(x),
                    j = Z(n.slice(0, Math.max(1, n.length - x.length))),
                    k = m - j,
                    p = Ft(n),
                    c = Rt(n),
                    u = He(s),
                    w = s.length > 0 ? i.length / s.length * 100 : 0,
                    E = r[0] ?? null,
                    L = 336 * 60 * 60 * 1e3,
                    b = r.filter(h => I(h) - Date.now() <= L).length,
                    P = i.map((h, S) => ({
                        name: `E${S+1}`,
                        title: h.title,
                        score: Number(h.result.percentage.toFixed(1)),
                        rolling: Number(ns(n, S).toFixed(1)),
                        type: fe[h.exam_type]
                    })),
                    T = Object.keys(fe).map(h => {
                        const S = i.filter(z => z.exam_type === h);
                        return {
                            type: fe[h],
                            count: s.filter(z => z.exam_type === h).length,
                            logged: S.length,
                            avg: S.length ? Number(Z(S.map(z => z.result.percentage)).toFixed(1)) : 0,
                            color: rs[h]
                        }
                    }),
                    M = Ot(i).sort((h, S) => h.avgPct - S.avgPct).map(h => ({ ...h,
                        avgPct: Number(h.avgPct.toFixed(1)),
                        trend: Number(h.trend.toFixed(1)),
                        spread: Number((h.bestPct - h.worstPct).toFixed(1))
                    })),
                    U = s.filter(h => h.exam_type === "dday").map(h => {
                        const S = ve(i.filter(B => B.dday_exam_id === h.id)),
                            z = S.map(B => B.result.percentage),
                            q = z.length ? Z(z) : 0,
                            X = z.length >= 2 ? z[z.length - 1] - z[0] : 0,
                            $ = Q(h) ? h.result.percentage : null;
                        return {
                            id: h.id,
                            title: h.title,
                            date: h.date,
                            linkedCount: S.length,
                            mockAvg: q,
                            trend: X,
                            actual: $,
                            readiness: $ ?? q,
                            gap: $ !== null ? $ - q : X
                        }
                    }).sort((h, S) => S.readiness - h.readiness).slice(0, 5),
                    W = i.reduce((h, S) => {
                        const z = S.result.error_breakdown;
                        return z && (h.conceptual += z.conceptual, h.silly += z.silly, h.memory += z.memory, h.guesswork += z.guesswork), h
                    }, {
                        conceptual: 0,
                        silly: 0,
                        memory: 0,
                        guesswork: 0
                    }),
                    A = [{
                        name: "Conceptual",
                        value: W.conceptual,
                        color: ie.conceptual
                    }, {
                        name: "Silly",
                        value: W.silly,
                        color: ie.silly
                    }, {
                        name: "Memory",
                        value: W.memory,
                        color: ie.memory
                    }, {
                        name: "Guesswork",
                        value: W.guesswork,
                        color: ie.guesswork
                    }].filter(h => h.value > 0),
                    H = M[0] ?? null,
                    J = M[M.length - 1] ?? null,
                    de = A.length ? [...A].sort((h, S) => S.value - h.value)[0] : null;
                return {
                    completed: i,
                    completionRate: w,
                    consistency: p,
                    ddayReadiness: U,
                    errorData: A,
                    firstScore: l,
                    lastScore: d,
                    nextExam: E,
                    prediction: c,
                    pressureCount: b,
                    recentAvg: m,
                    scoreDelta: k,
                    scoreTrend: P,
                    strongestSubject: J,
                    subjects: M,
                    topError: de,
                    typeMix: T,
                    velocity: u,
                    weakestSubject: H
                }
            }, [t]);
        return a ? e.jsxs("section", {
            className: "space-y-4",
            children: [e.jsx(Y, {
                eyebrow: "Analytics Command Center",
                title: "Exam Intelligence",
                description: `${a.completed.length} logged results analyzed across score, subject, cadence, errors, and D-Day readiness.`,
                icon: e.jsx(ft, {
                    className: "h-3.5 w-3.5"
                })
            }), e.jsxs("div", {
                className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
                children: [e.jsx(R, {
                    variant: "raised",
                    padding: "md",
                    accentTone: "brand",
                    children: e.jsx(se, {
                        label: "Recent average",
                        value: F(a.recentAvg),
                        delta: a.scoreDelta,
                        icon: e.jsx(jt, {
                            className: "h-4 w-4"
                        }),
                        iconTone: "brand",
                        sub: `Latest: ${F(a.lastScore)} · first: ${F(a.firstScore)}`
                    })
                }), e.jsx(R, {
                    variant: "raised",
                    padding: "md",
                    accentTone: "emerald",
                    children: e.jsx(se, {
                        label: "Projected next",
                        value: F(a.prediction.predicted),
                        icon: e.jsx(_e, {
                            className: "h-4 w-4"
                        }),
                        iconTone: "emerald",
                        sub: `${a.prediction.trend} · ${a.prediction.reliability} confidence`
                    })
                }), e.jsx(R, {
                    variant: "raised",
                    padding: "md",
                    accentTone: "indigo",
                    children: e.jsx(se, {
                        label: "Consistency",
                        value: a.consistency.rating,
                        icon: e.jsx(wt, {
                            className: "h-4 w-4"
                        }),
                        iconTone: "indigo",
                        sub: `Std dev ${a.consistency.stdDev.toFixed(1)} pts`
                    })
                }), e.jsx(R, {
                    variant: "raised",
                    padding: "md",
                    accentTone: "amber",
                    children: e.jsx(se, {
                        label: "Exam pressure",
                        value: a.pressureCount,
                        unit: "soon",
                        icon: e.jsx(vt, {
                            className: "h-4 w-4"
                        }),
                        iconTone: "amber",
                        sub: a.nextExam ? `Next: ${a.nextExam.title}` : `${F(a.completionRate)} completion rate`
                    })
                })]
            }), e.jsxs("div", {
                className: "grid grid-cols-1 gap-4 xl:grid-cols-[1.35fr_0.65fr]",
                children: [e.jsxs(R, {
                    variant: "raised",
                    padding: "lg",
                    className: "min-h-[360px]",
                    children: [e.jsx(Y, {
                        title: "Score Trajectory",
                        description: "Logged score with a rolling 3-exam signal.",
                        icon: e.jsx(_e, {
                            className: "h-4 w-4"
                        }),
                        right: e.jsxs("div", {
                            className: "hidden items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 sm:flex",
                            children: [e.jsxs("span", {
                                className: "inline-flex items-center gap-1.5",
                                children: [e.jsx("span", {
                                    className: "h-2 w-2 rounded-full bg-brand-500"
                                }), "score"]
                            }), e.jsxs("span", {
                                className: "inline-flex items-center gap-1.5",
                                children: [e.jsx("span", {
                                    className: "h-2 w-2 rounded-full bg-emerald-500"
                                }), "rolling avg"]
                            })]
                        })
                    }), e.jsx("div", {
                        className: "mt-5 h-[280px]",
                        children: e.jsx(ae, {
                            width: "100%",
                            height: "100%",
                            children: e.jsxs(Wt, {
                                data: a.scoreTrend,
                                margin: {
                                    top: 12,
                                    right: 12,
                                    bottom: 0,
                                    left: -18
                                },
                                children: [e.jsx("defs", {
                                    children: e.jsxs("linearGradient", {
                                        id: "examScoreFill",
                                        x1: "0",
                                        x2: "0",
                                        y1: "0",
                                        y2: "1",
                                        children: [e.jsx("stop", {
                                            offset: "5%",
                                            stopColor: "#6366f1",
                                            stopOpacity: .28
                                        }), e.jsx("stop", {
                                            offset: "95%",
                                            stopColor: "#6366f1",
                                            stopOpacity: .02
                                        })]
                                    })
                                }), e.jsx(De, {
                                    strokeDasharray: "3 3",
                                    vertical: !1,
                                    className: "stroke-zinc-200 dark:stroke-white/5"
                                }), e.jsx(ue, {
                                    dataKey: "name",
                                    tick: {
                                        fontSize: 11,
                                        fill: "#71717a"
                                    },
                                    axisLine: !1,
                                    tickLine: !1
                                }), e.jsx(pe, {
                                    domain: [0, 100],
                                    tick: {
                                        fontSize: 11,
                                        fill: "#71717a"
                                    },
                                    axisLine: !1,
                                    tickLine: !1
                                }), e.jsx(re, {
                                    content: e.jsx(le, {})
                                }), e.jsx(Ht, {
                                    type: "monotone",
                                    dataKey: "score",
                                    name: "Score %",
                                    stroke: "#6366f1",
                                    strokeWidth: 3,
                                    fill: "url(#examScoreFill)"
                                }), e.jsx(Yt, {
                                    type: "monotone",
                                    dataKey: "rolling",
                                    name: "Rolling avg",
                                    stroke: "#10b981",
                                    strokeWidth: 2.5,
                                    dot: !1
                                })]
                            })
                        })
                    })]
                }), e.jsxs(R, {
                    variant: "raised",
                    padding: "lg",
                    className: "min-h-[360px]",
                    children: [e.jsx(Y, {
                        title: "Exam Mix",
                        description: "Volume and average score by exam type.",
                        icon: e.jsx(kt, {
                            className: "h-4 w-4"
                        })
                    }), e.jsx("div", {
                        className: "mt-5 h-[180px]",
                        children: e.jsx(ae, {
                            width: "100%",
                            height: "100%",
                            children: e.jsxs(Kt, {
                                children: [e.jsx(Gt, {
                                    data: a.typeMix.filter(s => s.count > 0),
                                    dataKey: "count",
                                    innerRadius: 54,
                                    outerRadius: 78,
                                    paddingAngle: 4,
                                    stroke: "none",
                                    children: a.typeMix.map(s => e.jsx(ge, {
                                        fill: s.color
                                    }, s.type))
                                }), e.jsx(re, {
                                    content: e.jsx(le, {})
                                })]
                            })
                        })
                    }), e.jsx("div", {
                        className: "space-y-3",
                        children: a.typeMix.filter(s => s.count > 0).map(s => e.jsxs("div", {
                            className: "flex items-center justify-between gap-3",
                            children: [e.jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [e.jsx("span", {
                                    className: "h-2.5 w-2.5 rounded-full",
                                    style: {
                                        backgroundColor: s.color
                                    }
                                }), e.jsx("span", {
                                    className: "text-sm font-medium text-zinc-700 dark:text-zinc-200",
                                    children: s.type
                                })]
                            }), e.jsxs("div", {
                                className: "text-right text-xs tabular-nums text-zinc-500 dark:text-zinc-400",
                                children: [e.jsx("span", {
                                    className: "font-semibold text-zinc-900 dark:text-white",
                                    children: s.logged
                                }), " ", "logged", s.avg > 0 && e.jsxs("span", {
                                    children: [" · ", F(s.avg)]
                                })]
                            })]
                        }, s.type))
                    })]
                })]
            }), e.jsxs("div", {
                className: "grid grid-cols-1 gap-4 xl:grid-cols-3",
                children: [e.jsxs(R, {
                    variant: "raised",
                    padding: "lg",
                    className: "xl:col-span-2",
                    children: [e.jsx(Y, {
                        title: "Subject Signal",
                        description: "Average score, trend, and volatility across logged subject scores.",
                        icon: e.jsx(Nt, {
                            className: "h-4 w-4"
                        }),
                        right: a.weakestSubject && e.jsxs("button", {
                            onClick: () => o("/syllabus"),
                            className: "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-brand-600 transition-colors hover:bg-brand-500/10 dark:text-brand-300",
                            children: ["Review syllabus", e.jsx(we, {
                                className: "h-3.5 w-3.5"
                            })]
                        })
                    }), e.jsxs("div", {
                        className: "mt-5 grid gap-4 lg:grid-cols-[1fr_0.85fr]",
                        children: [e.jsx("div", {
                            className: "h-[260px]",
                            children: e.jsx(ae, {
                                width: "100%",
                                height: "100%",
                                children: e.jsxs(Ae, {
                                    data: a.subjects.slice(0, 8),
                                    layout: "vertical",
                                    margin: {
                                        top: 0,
                                        right: 12,
                                        bottom: 0,
                                        left: 24
                                    },
                                    children: [e.jsx(De, {
                                        strokeDasharray: "3 3",
                                        horizontal: !1,
                                        className: "stroke-zinc-200 dark:stroke-white/5"
                                    }), e.jsx(ue, {
                                        type: "number",
                                        domain: [0, 100],
                                        hide: !0
                                    }), e.jsx(pe, {
                                        type: "category",
                                        dataKey: "subject_name",
                                        axisLine: !1,
                                        tickLine: !1,
                                        tick: {
                                            fontSize: 11,
                                            fill: "#71717a"
                                        },
                                        width: 86
                                    }), e.jsx(re, {
                                        content: e.jsx(le, {})
                                    }), e.jsx(Te, {
                                        dataKey: "avgPct",
                                        name: "Average %",
                                        radius: [0, 6, 6, 0],
                                        children: a.subjects.slice(0, 8).map(s => e.jsx(ge, {
                                            fill: s.avgPct < 60 ? "#f97316" : s.avgPct < 75 ? "#6366f1" : "#10b981"
                                        }, s.subject_id))
                                    })]
                                })
                            })
                        }), e.jsx("div", {
                            className: "space-y-3",
                            children: a.subjects.slice(0, 5).map(s => e.jsx("div", {
                                className: "rounded-xl bg-zinc-50 p-3 ring-1 ring-zinc-200/70 dark:bg-white/[0.03] dark:ring-white/[0.06]",
                                children: e.jsxs("div", {
                                    className: "flex items-start justify-between gap-3",
                                    children: [e.jsxs("div", {
                                        className: "min-w-0",
                                        children: [e.jsx("p", {
                                            className: "truncate text-sm font-semibold text-zinc-900 dark:text-white",
                                            children: s.subject_name
                                        }), e.jsxs("p", {
                                            className: "text-xs text-zinc-500 dark:text-zinc-400",
                                            children: [s.count, " attempts · spread ", s.spread.toFixed(1), "pp"]
                                        })]
                                    }), e.jsxs("div", {
                                        className: "text-right",
                                        children: [e.jsx("p", {
                                            className: "text-sm font-bold tabular-nums text-zinc-900 dark:text-white",
                                            children: F(s.avgPct)
                                        }), e.jsx(Me, {
                                            delta: s.trend
                                        })]
                                    })]
                                })
                            }, s.subject_id))
                        })]
                    })]
                }), e.jsxs(R, {
                    variant: "raised",
                    padding: "lg",
                    children: [e.jsx(Y, {
                        title: "Action Queue",
                        description: "The next few levers worth attention.",
                        icon: e.jsx(Ee, {
                            className: "h-4 w-4"
                        })
                    }), e.jsxs("div", {
                        className: "mt-5 space-y-3",
                        children: [e.jsxs("div", {
                            className: "rounded-xl bg-amber-500/10 p-3 ring-1 ring-amber-500/20",
                            children: [e.jsxs("div", {
                                className: "flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-300",
                                children: [e.jsx(Be, {
                                    className: "h-4 w-4"
                                }), a.weakestSubject ? "Stabilize weak subject" : "Subject data needed"]
                            }), e.jsx("p", {
                                className: "mt-1 text-xs text-zinc-600 dark:text-zinc-300",
                                children: a.weakestSubject ? `${a.weakestSubject.subject_name} is averaging ${F(a.weakestSubject.avgPct)} with ${a.weakestSubject.spread.toFixed(1)}pp spread.` : "Add subject-wise scores to see targeted recommendations."
                            })]
                        }), e.jsxs("div", {
                            className: "rounded-xl bg-rose-500/10 p-3 ring-1 ring-rose-500/20",
                            children: [e.jsxs("div", {
                                className: "flex items-center gap-2 text-sm font-semibold text-rose-700 dark:text-rose-300",
                                children: [e.jsx(Ee, {
                                    className: "h-4 w-4"
                                }), a.topError ? `${a.topError.name} errors lead` : "Error pattern hidden"]
                            }), e.jsx("p", {
                                className: "mt-1 text-xs text-zinc-600 dark:text-zinc-300",
                                children: a.topError ? `${a.topError.value} logged mistakes. Make this the post-test review theme.` : "Log error breakdowns after exams to reveal repeat mistakes."
                            })]
                        }), e.jsxs("div", {
                            className: "rounded-xl bg-emerald-500/10 p-3 ring-1 ring-emerald-500/20",
                            children: [e.jsxs("div", {
                                className: "flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300",
                                children: [e.jsx(yt, {
                                    className: "h-4 w-4"
                                }), "Cadence is ", a.velocity.trend]
                            }), e.jsxs("p", {
                                className: "mt-1 text-xs text-zinc-600 dark:text-zinc-300",
                                children: ["You are logging ", a.velocity.perWeek.toFixed(1), " results per week over the last 8 weeks."]
                            })]
                        })]
                    }), a.errorData.length > 0 && e.jsx("div", {
                        className: "mt-5 h-[160px]",
                        children: e.jsx(ae, {
                            width: "100%",
                            height: "100%",
                            children: e.jsxs(Ae, {
                                data: a.errorData,
                                margin: {
                                    top: 4,
                                    right: 4,
                                    bottom: 0,
                                    left: -24
                                },
                                children: [e.jsx(ue, {
                                    dataKey: "name",
                                    tick: {
                                        fontSize: 10,
                                        fill: "#71717a"
                                    },
                                    axisLine: !1,
                                    tickLine: !1
                                }), e.jsx(pe, {
                                    allowDecimals: !1,
                                    tick: {
                                        fontSize: 10,
                                        fill: "#71717a"
                                    },
                                    axisLine: !1,
                                    tickLine: !1
                                }), e.jsx(re, {
                                    content: e.jsx(le, {})
                                }), e.jsx(Te, {
                                    dataKey: "value",
                                    name: "Errors",
                                    radius: [6, 6, 0, 0],
                                    children: a.errorData.map(s => e.jsx(ge, {
                                        fill: s.color
                                    }, s.name))
                                })]
                            })
                        })
                    })]
                })]
            }), a.ddayReadiness.length > 0 && e.jsxs(R, {
                variant: "raised",
                padding: "lg",
                children: [e.jsx(Y, {
                    title: "D-Day Readiness",
                    description: "Linked mock average, trend, and actual-vs-mock calibration.",
                    icon: e.jsx(zt, {
                        className: "h-4 w-4"
                    })
                }), e.jsx("div", {
                    className: "mt-5 overflow-x-auto",
                    children: e.jsx("div", {
                        className: "min-w-[680px] space-y-2",
                        children: a.ddayReadiness.map((s, i) => e.jsxs(D.button, {
                            initial: {
                                opacity: 0,
                                y: 8
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            transition: {
                                delay: i * .03,
                                duration: .2
                            },
                            onClick: () => o(`/exams/${s.id}?tab=analytics`),
                            className: "grid w-full grid-cols-[1.4fr_0.6fr_0.7fr_0.7fr_0.8fr] items-center gap-4 rounded-xl bg-zinc-50 px-4 py-3 text-left ring-1 ring-zinc-200/70 transition-colors hover:bg-zinc-100 dark:bg-white/[0.03] dark:ring-white/[0.06] dark:hover:bg-white/[0.05]",
                            children: [e.jsxs("div", {
                                className: "min-w-0",
                                children: [e.jsx("p", {
                                    className: "truncate text-sm font-semibold text-zinc-900 dark:text-white",
                                    children: s.title
                                }), e.jsx("p", {
                                    className: "text-xs text-zinc-500 dark:text-zinc-400",
                                    children: K(s.date).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric"
                                    })
                                })]
                            }), e.jsxs("div", {
                                children: [e.jsx("p", {
                                    className: "text-[10px] uppercase tracking-[0.14em] text-zinc-400",
                                    children: "Mocks"
                                }), e.jsx("p", {
                                    className: "text-sm font-bold tabular-nums text-zinc-900 dark:text-white",
                                    children: s.linkedCount
                                })]
                            }), e.jsxs("div", {
                                children: [e.jsx("p", {
                                    className: "text-[10px] uppercase tracking-[0.14em] text-zinc-400",
                                    children: "Mock avg"
                                }), e.jsx("p", {
                                    className: "text-sm font-bold tabular-nums text-zinc-900 dark:text-white",
                                    children: F(s.mockAvg)
                                })]
                            }), e.jsxs("div", {
                                children: [e.jsx("p", {
                                    className: "text-[10px] uppercase tracking-[0.14em] text-zinc-400",
                                    children: "Actual"
                                }), e.jsx("p", {
                                    className: "text-sm font-bold tabular-nums text-zinc-900 dark:text-white",
                                    children: s.actual === null ? "Pending" : F(s.actual)
                                })]
                            }), e.jsxs("div", {
                                className: "flex items-center justify-between gap-3",
                                children: [e.jsx(Me, {
                                    delta: s.gap
                                }), e.jsx(we, {
                                    className: "h-4 w-4 text-zinc-400"
                                })]
                            })]
                        }, s.id))
                    })
                })]
            })]
        }) : e.jsx(is, {})
    },
    $e = t => t === null ? "bg-zinc-100 dark:bg-white/[0.03] text-zinc-300 dark:text-zinc-700" : t >= 85 ? "bg-emerald-500 text-white" : t >= 70 ? "bg-emerald-400/90 text-white" : t >= 55 ? "bg-amber-400/90 text-zinc-900" : t >= 40 ? "bg-orange-400/90 text-white" : "bg-rose-500/90 text-white",
    cs = ({
        exams: t,
        maxExams: o = 10
    }) => {
        const a = G(),
            [s, i] = g.useState(null),
            r = g.useMemo(() => {
                const d = t.filter(Q);
                if (d.length === 0) return null;
                const l = We(d).slice(-o),
                    x = new Map;
                l.forEach(p => p.result.subject_scores.forEach(c => x.set(c.subject_id, c.subject_name)));
                const m = Array.from(x.entries()).map(([p, c]) => ({
                        id: p,
                        name: c
                    })),
                    j = {};
                l.forEach(p => {
                    j[p.id] = {}, m.forEach(c => {
                        const u = p.result.subject_scores.find(w => w.subject_id === c.id);
                        j[p.id][c.id] = u && u.total_marks > 0 ? u.marks_obtained / u.total_marks * 100 : null
                    })
                });
                const k = {};
                return m.forEach(p => {
                    const c = [];
                    l.forEach(u => {
                        const w = j[u.id][p.id];
                        w !== null && c.push(w)
                    }), k[p.id] = c.length > 0 ? c.reduce((u, w) => u + w, 0) / c.length : 0
                }), {
                    exams: l,
                    subjects: m,
                    matrix: j,
                    subjectAverages: k
                }
            }, [t, o]);
        if (!r) return null;
        const n = s ? (() => {
            const d = r.exams.find(m => m.id === s.examId) ?.title ?? "",
                l = r.subjects.find(m => m.id === s.subjectId) ?.name ?? "",
                x = r.matrix[s.examId] ?.[s.subjectId];
            return {
                examName: d,
                subjectName: l,
                score: x
            }
        })() : null;
        return e.jsxs("div", {
            className: "rounded-2xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-5",
            children: [e.jsxs("div", {
                className: "flex items-center justify-between mb-4",
                children: [e.jsxs("h3", {
                    className: "text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2",
                    children: [e.jsx(St, {
                        className: "w-4 h-4 text-brand-500"
                    }), "Subject Mastery Heatmap"]
                }), e.jsxs("p", {
                    className: "text-xs text-zinc-400",
                    children: ["last ", r.exams.length, " results"]
                })]
            }), e.jsx("div", {
                className: "overflow-x-auto -mx-2 px-2 custom-scrollbar",
                children: e.jsx("div", {
                    className: "inline-block min-w-full",
                    children: e.jsxs("div", {
                        className: "grid gap-1",
                        style: {
                            gridTemplateColumns: `minmax(120px, 160px) repeat(${r.exams.length}, minmax(28px, 44px)) minmax(40px, 56px)`
                        },
                        children: [e.jsx("div", {
                            className: "text-[10px] font-semibold uppercase tracking-wider text-zinc-400 px-2 py-2",
                            children: "Subject"
                        }), r.exams.map(d => e.jsx("button", {
                            onClick: () => a(`/exams/${d.id}`),
                            title: d.title,
                            className: "flex items-center justify-center text-[9px] font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white truncate px-1 py-2 hover:bg-zinc-50 dark:hover:bg-white/[0.04] rounded-md transition-colors",
                            children: e.jsx("span", {
                                className: "truncate",
                                style: {
                                    maxWidth: 38
                                },
                                children: d.title.split(/\s+/)[0]
                            })
                        }, d.id)), e.jsx("div", {
                            className: "text-[10px] font-semibold uppercase tracking-wider text-zinc-400 px-2 py-2 text-right",
                            children: "Avg"
                        }), r.subjects.map(d => e.jsxs(et.Fragment, {
                            children: [e.jsx("div", {
                                className: "px-2 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-200 truncate flex items-center",
                                children: d.name
                            }), r.exams.map(l => {
                                const x = r.matrix[l.id] ?.[d.id] ?? null;
                                return e.jsx("div", {
                                    onMouseEnter: () => i({
                                        examId: l.id,
                                        subjectId: d.id
                                    }),
                                    onMouseLeave: () => i(null),
                                    onClick: () => a(`/exams/${l.id}`),
                                    className: _("aspect-square rounded-md flex items-center justify-center text-[10px] font-bold tabular-nums cursor-pointer transition-all hover:ring-2 hover:ring-brand-500/40 hover:scale-110", $e(x)),
                                    children: x !== null ? Math.round(x) : "—"
                                }, `${l.id}-${d.id}`)
                            }), e.jsxs("div", {
                                className: "px-2 py-1.5 text-xs font-bold text-right tabular-nums text-zinc-700 dark:text-zinc-200 flex items-center justify-end",
                                children: [r.subjectAverages[d.id].toFixed(0), "%"]
                            })]
                        }, d.id))]
                    })
                })
            }), n && n.score !== null && e.jsx("div", {
                className: "mt-3 px-3 py-2 rounded-lg bg-zinc-50 dark:bg-white/[0.04] border border-zinc-100 dark:border-white/[0.06]",
                children: e.jsxs("p", {
                    className: "text-xs text-zinc-500",
                    children: [e.jsx("span", {
                        className: "font-semibold text-zinc-700 dark:text-zinc-200",
                        children: n.subjectName
                    }), " ", "in ", e.jsx("span", {
                        className: "font-semibold",
                        children: n.examName
                    }), ":", " ", e.jsxs("span", {
                        className: "font-bold text-zinc-900 dark:text-white",
                        children: [n.score ?.toFixed(1), "%"]
                    })]
                })
            }), e.jsxs("div", {
                className: "mt-4 flex items-center justify-end gap-1 text-[10px] text-zinc-400",
                children: [e.jsx("span", {
                    className: "mr-1",
                    children: "Lower"
                }), [30, 50, 65, 78, 90].map(d => e.jsx("span", {
                    className: _("w-5 h-3 rounded-sm", $e(d))
                }, d)), e.jsx("span", {
                    className: "ml-1",
                    children: "Higher"
                })]
            })]
        })
    },
    os = ({
        exams: t,
        threshold: o = 60,
        limit: a = 6
    }) => {
        const s = G(),
            {
                subjects: i
            } = Re(),
            r = g.useMemo(() => {
                const n = new Map,
                    d = new Map;
                i.forEach(m => {
                    m.deletedAt || m.chapters.forEach(j => {
                        n.set(j.id, m.id);
                        const k = j.topics.length,
                            p = j.topics.filter(c => c.completed).length;
                        d.set(j.id, {
                            title: j.title,
                            subjectName: m.name,
                            subjectColor: m.color,
                            topicsTotal: k,
                            topicsDone: p
                        })
                    })
                });
                const l = t.filter(Q);
                return It(l, n, o).slice(0, a).map(m => {
                    const j = d.get(m.chapter_id);
                    return j ? { ...m,
                        ...j
                    } : null
                }).filter(m => m !== null)
            }, [t, i, o, a]);
        return r.length === 0 ? null : e.jsxs(D.div, {
            initial: {
                opacity: 0,
                y: 10
            },
            animate: {
                opacity: 1,
                y: 0
            },
            transition: {
                duration: .3
            },
            className: "rounded-2xl border border-rose-200/50 dark:border-rose-500/15 bg-gradient-to-br from-rose-50/40 to-white dark:from-rose-500/[0.04] dark:to-zinc-900/40 p-5",
            children: [e.jsxs("div", {
                className: "flex items-start justify-between mb-4 flex-wrap gap-2",
                children: [e.jsxs("div", {
                    className: "flex items-start gap-3",
                    children: [e.jsx("div", {
                        className: "w-9 h-9 rounded-xl bg-rose-500/15 flex items-center justify-center flex-shrink-0",
                        children: e.jsx(Ct, {
                            className: "w-4 h-4 text-rose-600 dark:text-rose-400"
                        })
                    }), e.jsxs("div", {
                        children: [e.jsx("h3", {
                            className: "text-sm font-bold text-zinc-900 dark:text-white",
                            children: "Chapters that need attention"
                        }), e.jsxs("p", {
                            className: "text-xs text-zinc-500 dark:text-zinc-400 mt-0.5",
                            children: ["Surfaced from results scoring below ", o, "%. Drill in to revise."]
                        })]
                    })]
                }), e.jsxs("button", {
                    onClick: () => s("/syllabus"),
                    className: "text-xs font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 inline-flex items-center gap-1",
                    children: ["Open syllabus ", e.jsx(we, {
                        className: "w-3 h-3"
                    })]
                })]
            }), e.jsx("div", {
                className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5",
                children: r.map((n, d) => {
                    const l = n.topicsTotal > 0 ? Math.round(n.topicsDone / n.topicsTotal * 100) : 0,
                        x = n.worstPct < 40 ? "critical" : n.worstPct < 50 ? "high" : "medium";
                    return e.jsxs(D.button, {
                        initial: {
                            opacity: 0,
                            y: 6
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        transition: {
                            delay: d * .04
                        },
                        onClick: () => s(`/syllabus/chapter/${n.chapter_id}`),
                        className: "group text-left rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-3 hover:border-brand-500/40 dark:hover:border-brand-400/40 hover:shadow-md transition-all",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-2 mb-2",
                            children: [e.jsx("span", {
                                className: "w-2 h-2 rounded-full flex-shrink-0",
                                style: {
                                    backgroundColor: n.subjectColor
                                }
                            }), e.jsx("span", {
                                className: "text-[10px] font-semibold uppercase tracking-wider text-zinc-400 truncate",
                                children: n.subjectName
                            }), e.jsx("span", {
                                className: _("ml-auto text-[10px] px-1.5 py-0.5 rounded-md font-semibold uppercase", x === "critical" && "bg-rose-500/15 text-rose-600 dark:text-rose-400", x === "high" && "bg-orange-500/15 text-orange-600 dark:text-orange-400", x === "medium" && "bg-amber-500/15 text-amber-600 dark:text-amber-400"),
                                children: x
                            })]
                        }), e.jsx("p", {
                            className: "text-sm font-semibold text-zinc-900 dark:text-white truncate mb-2",
                            children: n.title
                        }), e.jsxs("div", {
                            className: "flex items-center gap-3 text-[11px] text-zinc-500",
                            children: [e.jsxs("span", {
                                className: "inline-flex items-center gap-1",
                                children: [e.jsx(Be, {
                                    className: "w-3 h-3"
                                }), e.jsxs("span", {
                                    className: "tabular-nums font-semibold text-rose-500",
                                    children: [Math.round(n.worstPct), "%"]
                                }), "worst score"]
                            }), e.jsxs("span", {
                                className: "inline-flex items-center gap-1",
                                children: [e.jsx(ye, {
                                    className: "w-3 h-3"
                                }), e.jsxs("span", {
                                    className: "tabular-nums",
                                    children: [l, "%"]
                                }), " studied"]
                            })]
                        }), e.jsxs("div", {
                            className: "mt-2.5 flex items-center justify-between text-[10px] text-zinc-400",
                            children: [e.jsxs("span", {
                                className: "truncate",
                                children: ["In ", n.examIds.length, " exam", n.examIds.length !== 1 ? "s" : ""]
                            }), e.jsxs("span", {
                                className: "inline-flex items-center gap-0.5 text-brand-600 dark:text-brand-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity",
                                children: [e.jsx(_t, {
                                    className: "w-3 h-3"
                                }), " Revise"]
                            })]
                        })]
                    }, n.chapter_id)
                })
            })]
        })
    },
    Ke = {
        query: "",
        tags: [],
        types: [],
        priorities: [],
        sort: "date_asc"
    },
    je = {
        date_asc: "Soonest",
        date_desc: "Latest",
        title: "Title",
        priority: "Priority",
        score: "Score"
    },
    ds = ({
        state: t,
        onChange: o,
        allTags: a,
        tagColors: s,
        resultCount: i
    }) => {
        const [r, n] = g.useState(!1), [d, l] = g.useState(!1), x = g.useRef(null);
        g.useEffect(() => {
            if (!d) return;
            const u = w => {
                x.current ?.contains(w.target) || l(!1)
            };
            return window.addEventListener("mousedown", u), () => window.removeEventListener("mousedown", u)
        }, [d]);
        const m = u => o({ ...t,
                ...u
            }),
            j = u => m({
                types: t.types.includes(u) ? t.types.filter(w => w !== u) : [...t.types, u]
            }),
            k = u => m({
                priorities: t.priorities.includes(u) ? t.priorities.filter(w => w !== u) : [...t.priorities, u]
            }),
            p = u => m({
                tags: t.tags.includes(u) ? t.tags.filter(w => w !== u) : [...t.tags, u]
            }),
            c = t.tags.length + t.types.length + t.priorities.length + (t.query ? 1 : 0);
        return e.jsxs("div", {
            className: "space-y-3",
            children: [e.jsxs("div", {
                className: "flex flex-wrap items-center gap-2",
                children: [e.jsxs("div", {
                    className: "relative min-w-[min(100%,16rem)] flex-1",
                    children: [e.jsx(Et, {
                        className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none"
                    }), e.jsx("input", {
                        type: "text",
                        value: t.query,
                        onChange: u => m({
                            query: u.target.value
                        }),
                        placeholder: "Search exams, tags, descriptions...",
                        className: _("w-full pl-9 pr-9 py-2.5 text-sm rounded-xl outline-none", "bg-white dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.08]", "text-zinc-900 dark:text-white placeholder:text-zinc-400", "focus:border-brand-500 dark:focus:border-brand-400 transition-colors")
                    }), t.query && e.jsx("button", {
                        onClick: () => m({
                            query: ""
                        }),
                        className: "absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-white/[0.06] text-zinc-400",
                        "aria-label": "Clear search",
                        children: e.jsx(Oe, {
                            className: "w-3.5 h-3.5"
                        })
                    })]
                }), e.jsxs("button", {
                    onClick: () => n(!r),
                    className: _("inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors flex-shrink-0", r || c > 0 ? "border-brand-500/50 bg-brand-500/10 text-brand-600 dark:text-brand-400" : "border-zinc-200 dark:border-white/[0.08] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/[0.04]"),
                    children: [e.jsx(Mt, {
                        className: "w-3.5 h-3.5"
                    }), e.jsx("span", {
                        className: "hidden sm:inline",
                        children: "Filter"
                    }), c > 0 && e.jsx("span", {
                        className: "px-1.5 py-0.5 text-[10px] rounded-md bg-brand-500 text-white tabular-nums",
                        children: c
                    })]
                }), e.jsxs("div", {
                    ref: x,
                    className: "relative flex-shrink-0",
                    children: [e.jsxs("button", {
                        onClick: () => l(!d),
                        className: "inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.08] text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/[0.04] transition-colors",
                        children: [t.sort === "date_desc" ? e.jsx(Dt, {
                            className: "w-3.5 h-3.5"
                        }) : e.jsx(At, {
                            className: "w-3.5 h-3.5"
                        }), e.jsx("span", {
                            className: "hidden sm:inline",
                            children: je[t.sort]
                        })]
                    }), d && e.jsx("div", {
                        className: "absolute right-0 top-full mt-1 w-[min(11rem,calc(100vw-1.5rem))] rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900 shadow-xl py-1 z-30",
                        children: Object.keys(je).map(u => e.jsx("button", {
                            onClick: () => {
                                m({
                                    sort: u
                                }), l(!1)
                            },
                            className: _("w-full text-left px-3 py-2 text-xs hover:bg-zinc-50 dark:hover:bg-white/[0.04]", t.sort === u ? "text-brand-600 dark:text-brand-400 font-semibold" : "text-zinc-600 dark:text-zinc-300"),
                            children: je[u]
                        }, u))
                    })]
                })]
            }), r && e.jsx(xs, {
                state: t,
                allTags: a,
                tagColors: s,
                toggleType: j,
                togglePriority: k,
                toggleTag: p,
                onClear: () => o({ ...Ke,
                    sort: t.sort
                }),
                resultCount: i
            })]
        })
    },
    xs = ({
        state: t,
        allTags: o,
        tagColors: a,
        toggleType: s,
        togglePriority: i,
        toggleTag: r,
        onClear: n,
        resultCount: d
    }) => e.jsxs("div", {
        className: "rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] p-4 space-y-4",
        children: [e.jsxs("div", {
            className: "space-y-2",
            children: [e.jsx("span", {
                className: "text-[10px] font-semibold uppercase tracking-wider text-zinc-400",
                children: "Type"
            }), e.jsx("div", {
                className: "flex flex-wrap gap-1.5",
                children: Object.keys(he).map(l => {
                    const x = t.types.includes(l);
                    return e.jsxs("button", {
                        onClick: () => s(l),
                        className: _("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors", x ? "bg-brand-500/15 border-brand-500/40 text-brand-600 dark:text-brand-400" : "bg-transparent border-zinc-200 dark:border-white/[0.08] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/[0.04]"),
                        children: [e.jsx("span", {
                            children: he[l].emoji
                        }), he[l].label]
                    }, l)
                })
            })]
        }), e.jsxs("div", {
            className: "space-y-2",
            children: [e.jsx("span", {
                className: "text-[10px] font-semibold uppercase tracking-wider text-zinc-400",
                children: "Priority"
            }), e.jsx("div", {
                className: "flex flex-wrap gap-1.5",
                children: Object.keys(Ce).map(l => {
                    const x = t.priorities.includes(l),
                        m = Ce[l];
                    return e.jsxs("button", {
                        onClick: () => i(l),
                        className: _("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors", x ? `${m.bgColor} ${m.borderColor} ${m.textColor}` : "bg-transparent border-zinc-200 dark:border-white/[0.08] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/[0.04]"),
                        children: [e.jsx("span", {
                            className: _("w-1.5 h-1.5 rounded-full", m.dotColor)
                        }), m.label]
                    }, l)
                })
            })]
        }), o.length > 0 && e.jsxs("div", {
            className: "space-y-2",
            children: [e.jsx("span", {
                className: "text-[10px] font-semibold uppercase tracking-wider text-zinc-400",
                children: "Tags"
            }), e.jsx("div", {
                className: "flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scrollbar",
                children: o.slice(0, 30).map(l => {
                    const x = t.tags.includes(l),
                        m = a ?.get(l);
                    return e.jsxs("button", {
                        onClick: () => r(l),
                        className: _("px-2 py-0.5 rounded-full text-xs font-medium border transition-colors", x ? "bg-brand-500/15 border-brand-500/40 text-brand-600 dark:text-brand-400" : "bg-transparent border-zinc-200 dark:border-white/[0.08] text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/[0.04]"),
                        style: x && m ? {
                            backgroundColor: `${m}1f`,
                            borderColor: `${m}55`,
                            color: m
                        } : void 0,
                        children: [e.jsx("span", {
                            className: "opacity-50",
                            children: "#"
                        }), l]
                    }, l)
                })
            })]
        }), e.jsxs("div", {
            className: "flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-white/[0.06]",
            children: [e.jsxs("span", {
                className: "text-xs text-zinc-500 tabular-nums",
                children: [d, " match", d !== 1 ? "es" : ""]
            }), e.jsx("button", {
                onClick: n,
                className: "text-xs font-medium text-brand-500 hover:text-brand-400",
                children: "Clear all"
            })]
        })]
    }),
    ms = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    hs = ({
        exams: t,
        initialMonth: o
    }) => {
        const a = G(),
            [s, i] = g.useState(() => {
                const c = o ?? new Date;
                return new Date(c.getFullYear(), c.getMonth(), 1)
            }),
            [r, n] = g.useState(null),
            d = g.useMemo(() => Bt(s.getFullYear(), s.getMonth(), t), [s, t]),
            l = s.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric"
            }),
            x = d.filter(c => c.inMonth).reduce((c, u) => c + u.exams.length, 0),
            m = () => i(new Date(s.getFullYear(), s.getMonth() - 1, 1)),
            j = () => i(new Date(s.getFullYear(), s.getMonth() + 1, 1)),
            k = () => {
                const c = new Date;
                i(new Date(c.getFullYear(), c.getMonth(), 1))
            },
            p = r ? d.find(c => c.iso === r) : null;
        return e.jsxs("div", {
            className: "rounded-2xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 overflow-hidden",
            children: [e.jsxs("div", {
                className: "flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-white/[0.06]",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [e.jsx(oe, {
                        className: "w-4 h-4 text-brand-500"
                    }), e.jsx("h3", {
                        className: "text-sm font-bold text-zinc-900 dark:text-white",
                        children: l
                    }), e.jsxs("span", {
                        className: "text-xs text-zinc-400 tabular-nums",
                        children: [x, " exam", x !== 1 ? "s" : ""]
                    })]
                }), e.jsxs("div", {
                    className: "flex items-center gap-1",
                    children: [e.jsx("button", {
                        onClick: k,
                        className: "px-2.5 py-1 text-xs font-medium rounded-lg border border-zinc-200 dark:border-white/[0.08] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/[0.04] transition-colors",
                        children: "Today"
                    }), e.jsx("button", {
                        onClick: m,
                        "aria-label": "Previous month",
                        className: "w-7 h-7 rounded-lg flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-white/[0.06] text-zinc-500 transition-colors",
                        children: e.jsx(Tt, {
                            className: "w-4 h-4"
                        })
                    }), e.jsx("button", {
                        onClick: j,
                        "aria-label": "Next month",
                        className: "w-7 h-7 rounded-lg flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-white/[0.06] text-zinc-500 transition-colors",
                        children: e.jsx(Ie, {
                            className: "w-4 h-4"
                        })
                    })]
                })]
            }), e.jsx("div", {
                className: "grid grid-cols-7 border-b border-zinc-100 dark:border-white/[0.06]",
                children: ms.map(c => e.jsx("div", {
                    className: "px-2 py-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 text-center",
                    children: c
                }, c))
            }), e.jsx("div", {
                className: "grid grid-cols-7",
                children: d.map((c, u) => {
                    const w = r === c.iso,
                        E = c.exams,
                        L = E.length > 0;
                    return e.jsxs("button", {
                        onClick: () => L && n(w ? null : c.iso),
                        className: _("relative min-h-[72px] sm:min-h-[88px] p-1.5 sm:p-2 text-left border-r border-b border-zinc-100 dark:border-white/[0.04] transition-colors", "last:border-r-0", c.inMonth ? "bg-transparent" : "bg-zinc-50/50 dark:bg-white/[0.01] text-zinc-400", L && "hover:bg-zinc-50 dark:hover:bg-white/[0.03] cursor-pointer", w && "bg-brand-500/[0.08] dark:bg-brand-500/[0.12]"),
                        children: [e.jsxs("div", {
                            className: "flex items-center justify-between mb-1",
                            children: [e.jsx("span", {
                                className: _("text-xs tabular-nums", c.isToday ? "inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-500 text-white font-bold" : c.inMonth ? "font-medium text-zinc-700 dark:text-zinc-300" : "text-zinc-400"),
                                children: c.date.getDate()
                            }), E.length > 2 && e.jsxs("span", {
                                className: "text-[9px] font-semibold tabular-nums text-zinc-400",
                                children: ["+", E.length - 2]
                            })]
                        }), e.jsx("div", {
                            className: "space-y-0.5",
                            children: E.slice(0, 2).map(b => e.jsx(D.span, {
                                initial: {
                                    opacity: 0,
                                    y: 2
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                onClick: P => {
                                    P.stopPropagation(), a(`/exams/${b.id}`)
                                },
                                className: "block truncate text-[10px] font-medium px-1.5 py-0.5 rounded-md cursor-pointer hover:opacity-80 transition-opacity",
                                style: {
                                    backgroundColor: `${b.color}20`,
                                    color: b.color,
                                    borderLeft: `2px solid ${b.color}`
                                },
                                children: b.title
                            }, b.id))
                        })]
                    }, u)
                })
            }), p && p.exams.length > 0 && e.jsxs("div", {
                className: "border-t border-zinc-100 dark:border-white/[0.06] p-4 bg-zinc-50/50 dark:bg-white/[0.02]",
                children: [e.jsxs("div", {
                    className: "flex items-center justify-between mb-2",
                    children: [e.jsx("span", {
                        className: "text-xs font-semibold text-zinc-700 dark:text-zinc-300",
                        children: p.date.toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric"
                        })
                    }), e.jsxs("span", {
                        className: "text-xs text-zinc-400 tabular-nums",
                        children: [p.exams.length, " exam", p.exams.length !== 1 ? "s" : ""]
                    })]
                }), e.jsx("div", {
                    className: "space-y-1.5",
                    children: p.exams.map(c => e.jsxs("button", {
                        onClick: () => a(`/exams/${c.id}`),
                        className: "w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.06] hover:border-zinc-300 dark:hover:border-white/[0.12] transition-colors group",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-2 min-w-0 flex-1",
                            children: [e.jsx("span", {
                                className: "w-2 h-2 rounded-full flex-shrink-0",
                                style: {
                                    backgroundColor: c.color
                                }
                            }), e.jsx("span", {
                                className: "text-sm font-medium text-zinc-900 dark:text-white truncate",
                                children: c.title
                            })]
                        }), e.jsxs("div", {
                            className: "flex items-center gap-2 flex-shrink-0",
                            children: [e.jsx(ke, {
                                type: c.exam_type
                            }), c.start_time && e.jsx("span", {
                                className: "text-[10px] tabular-nums text-zinc-400",
                                children: c.start_time
                            })]
                        })]
                    }, c.id))
                })]
            })]
        })
    };

function us(t, o) {
    if (t.chapter_ids.length === 0) return {
        studied: 0,
        total: 0
    };
    let a = 0;
    return o.forEach(s => {
        (s.chapters ?? []).forEach(i => {
            if (t.chapter_ids.includes(i.id)) {
                const r = i.topics ?? [],
                    n = r.length,
                    d = r.filter(l => l.completed).length;
                n > 0 && d === n && a++
            }
        })
    }), {
        studied: a,
        total: t.chapter_ids.length
    }
}
const ps = ({
        activeFilter: t,
        onFilterChange: o,
        statusCounts: a,
        viewMode: s,
        onViewChange: i
    }) => e.jsxs("div", {
        className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
        children: [e.jsx("div", {
            className: "w-full flex-1 overflow-x-auto scrollbar-none -mx-1 px-1",
            children: e.jsx("div", {
                className: "flex items-center gap-1 w-max",
                children: Fe.map(r => {
                    const n = t === r.id,
                        d = a[r.id] ?? 0;
                    return e.jsxs("button", {
                        onClick: () => o(r.id),
                        className: _("relative px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap", n ? "text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"),
                        children: [n && e.jsx(D.div, {
                            layoutId: "activeExamFilter",
                            className: "absolute inset-0 bg-white dark:bg-white/[0.06] rounded-lg shadow-sm dark:shadow-none border border-zinc-200 dark:border-white/[0.08]",
                            transition: {
                                type: "spring",
                                bounce: .15,
                                duration: .4
                            }
                        }), e.jsxs("span", {
                            className: "relative z-10 flex items-center gap-1.5",
                            children: [r.label, e.jsx("span", {
                                className: _("text-[10px] tabular-nums min-w-[18px] h-[18px] flex items-center justify-center rounded-full", n ? "bg-zinc-200 dark:bg-white/10 text-zinc-700 dark:text-zinc-300" : "bg-zinc-100 dark:bg-white/[0.04] text-zinc-400 dark:text-zinc-500"),
                                children: d
                            })]
                        })]
                    }, r.id)
                })
            })
        }), e.jsx("div", {
            className: "flex w-fit items-center gap-0.5 p-0.5 rounded-lg bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.06] flex-shrink-0",
            children: [{
                id: "grid",
                icon: e.jsx($t, {
                    className: "w-3.5 h-3.5"
                }),
                label: "Grid"
            }, {
                id: "list",
                icon: e.jsx(Lt, {
                    className: "w-3.5 h-3.5"
                }),
                label: "List"
            }, {
                id: "calendar",
                icon: e.jsx(Pt, {
                    className: "w-3.5 h-3.5"
                }),
                label: "Calendar"
            }].map(r => e.jsx("button", {
                onClick: () => i(r.id),
                "aria-label": r.label,
                className: _("p-1.5 rounded-md transition-colors", s === r.id ? "bg-white dark:bg-white/10 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"),
                children: r.icon
            }, r.id))
        })]
    }),
    gs = ({
        activeFilter: t,
        onCreate: o
    }) => e.jsxs("div", {
        className: "text-center py-16 rounded-2xl border border-dashed border-zinc-200 dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.01]",
        children: [e.jsx("p", {
            className: "text-sm text-zinc-500 dark:text-zinc-400",
            children: t === "all" ? "No exams match your filters yet." : `No ${Fe.find(a=>a.id===t)?.label.toLowerCase()} exams.`
        }), t === "all" && e.jsxs("button", {
            onClick: o,
            className: "mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/20",
            children: [e.jsx(Ne, {
                className: "w-4 h-4"
            }), "Schedule Exam"]
        })]
    }),
    Rs = ({
        isDark: t,
        toggleTheme: o
    }) => {
        const {
            isPerformanceMode: a
        } = tt(), [s, i] = g.useState(!1), [r, n] = g.useState("Exams"), {
            exams: d,
            fetchExams: l,
            snoozeNudge: x,
            dismissNudge: m
        } = Ut(), {
            fetchSubjects: j,
            subjects: k
        } = Re(), [p, c] = g.useState(!1), [u, w] = g.useState(null), [E, L] = g.useState("all"), [b, P] = g.useState(Ke), [T, M] = g.useState(() => {
            try {
                const f = localStorage.getItem("isotope_exam_view");
                return f && ["grid", "list", "calendar"].includes(f) ? f : "grid"
            } catch {
                return "grid"
            }
        }), [U, W] = g.useState(null);
        g.useEffect(() => {
            l(), j()
        }, [l, j]), g.useEffect(() => {
            try {
                localStorage.setItem("isotope_exam_view", T)
            } catch {}
        }, [T]);
        const A = g.useMemo(() => d.filter(f => !f.deleted_at), [d]),
            {
                examsWithStatus: H,
                featuredExam: J,
                otherLatestExam: de,
                resultReadyExams: h,
                statusCounts: S,
                sameDayExams: z
            } = lt(A),
            {
                allTags: q,
                tagColors: X
            } = ct(A),
            $ = g.useMemo(() => {
                if (U) {
                    const f = H.find(v => v.id === U);
                    if (f) return f
                }
                return J
            }, [U, J, H]),
            B = $ ?._status,
            Ge = B === "upcoming" || B === "in_progress" ? B : null,
            ze = g.useMemo(() => {
                if (!$ || $.chapter_ids.length === 0) return {
                    studied: void 0,
                    total: void 0
                };
                const f = $.chapter_ids.length;
                let v = 0;
                return k.forEach(C => {
                    (C.chapters ?? []).forEach(N => {
                        if ($.chapter_ids.includes(N.id)) {
                            const y = N.topics ?? [],
                                te = y.length,
                                O = y.filter(me => me.completed).length;
                            te > 0 && O === te && v++
                        }
                    })
                }), {
                    studied: v,
                    total: f
                }
            }, [$, k]),
            Ue = g.useMemo(() => He(A), [A]),
            ee = g.useMemo(() => {
                const f = b.query.trim().toLowerCase();
                let v = H.filter(N => {
                    const y = N._status;
                    return !(!(() => {
                        switch (E) {
                            case "all":
                                return y !== "archived";
                            case "upcoming":
                                return y === "upcoming";
                            case "in_progress":
                                return y === "in_progress";
                            case "awaiting_result":
                                return y === "pending_result" || y === "result_ready";
                            case "completed":
                                return y === "result_logged";
                            case "archived":
                                return y === "archived";
                            default:
                                return !0
                        }
                    })() || b.types.length && !b.types.includes(N.exam_type) || b.priorities.length && !b.priorities.includes(N.priority) || b.tags.length && !b.tags.some(O => N.tags.includes(O)) || f && !`${N.title} ${N.description||""} ${N.tags.join(" ")}`.toLowerCase().includes(f))
                });
                const C = {
                    critical: 0,
                    high: 1,
                    medium: 2,
                    low: 3
                };
                switch (b.sort) {
                    case "date_asc":
                        v = [...v].sort((N, y) => I(N) - I(y));
                        break;
                    case "date_desc":
                        v = [...v].sort((N, y) => I(y) - I(N));
                        break;
                    case "title":
                        v = [...v].sort((N, y) => N.title.localeCompare(y.title));
                        break;
                    case "priority":
                        v = [...v].sort((N, y) => C[N.priority] - C[y.priority] || I(N) - I(y));
                        break;
                    case "score":
                        v = [...v].sort((N, y) => (y.result ?.percentage ?? -1) - (N.result ?.percentage ?? -1));
                        break
                }
                return v
            }, [H, E, b]),
            qe = g.useMemo(() => {
                const f = new Map;
                return A.filter(C => C.exam_type === "dday").map(C => C.id).forEach(C => {
                    const N = A.filter(V => V.dday_exam_id === C),
                        y = N.filter(Q),
                        O = ve(y).map(V => V.result.percentage),
                        me = O.length ? O.reduce((V, Je) => V + Je, 0) / O.length : void 0;
                    f.set(C, {
                        count: N.length,
                        avgScore: me,
                        trajectory: O
                    })
                }), f
            }, [A]),
            xe = g.useCallback(() => {
                w(null), c(!0)
            }, []),
            Xe = g.useCallback(f => {
                w(f), c(!0)
            }, []),
            Ve = g.useCallback(f => {
                w(f), c(!0)
            }, []),
            Ze = g.useCallback(f => {
                W(f.id)
            }, []),
            Qe = g.useCallback(f => {
                const v = f.replace(/^#/, "");
                P(C => ({ ...C,
                    tags: C.tags.includes(v) ? C.tags : [...C.tags, v]
                }))
            }, []);
        return e.jsxs("div", {
            className: "app-shell h-screen bg-[#f4f4f5] dark:bg-[#09090b] text-zinc-900 dark:text-white flex overflow-hidden selection:bg-brand-500/30 font-sans",
            children: [e.jsx(st, {
                activeTab: r,
                setActiveTab: n,
                isDark: t,
                toggleTheme: o,
                mobileMenuOpen: s,
                setMobileMenuOpen: i
            }), e.jsxs("main", {
                className: "app-main-shell flex-1 relative flex flex-col h-screen overflow-hidden",
                children: [!a && e.jsxs("div", {
                    className: "app-ambient absolute inset-0 overflow-hidden pointer-events-none",
                    children: [e.jsx("div", {
                        className: "absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-600/10 blur-[120px]"
                    }), e.jsx("div", {
                        className: "absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]"
                    })]
                }), e.jsx(at, {
                    activeTab: "Exams",
                    mobileMenuOpen: s,
                    setMobileMenuOpen: i
                }), e.jsxs("div", {
                    className: "flex-1 overflow-y-auto density-app-shell-x pt-[var(--density-page-y-lg)] custom-scrollbar relative z-10 safe-bottom",
                    children: [e.jsxs("div", {
                        className: "density-app-width density-stack",
                        children: [e.jsx(Qt, {
                            exam: $,
                            status: Ge,
                            otherLatestExam: de,
                            studiedChapters: ze.studied,
                            totalChapters: ze.total,
                            sameDayExams: z,
                            prepVelocity: Ue,
                            onEdit: Xe,
                            onSchedule: xe,
                            onSwitchFeatured: Ze
                        }), e.jsx(Jt, {
                            exams: h,
                            onLogScore: Ve,
                            onSnooze: (f, v) => x(f, v),
                            onDismiss: f => m(f)
                        }), e.jsx(ps, {
                            activeFilter: E,
                            onFilterChange: L,
                            statusCounts: S,
                            viewMode: T,
                            onViewChange: M
                        }), e.jsx(ds, {
                            state: b,
                            onChange: P,
                            allTags: q,
                            tagColors: X,
                            resultCount: ee.length
                        }), e.jsx(ce, {
                            mode: "wait",
                            children: e.jsx(D.div, {
                                initial: {
                                    opacity: 0,
                                    y: 12
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                exit: {
                                    opacity: 0,
                                    y: -8
                                },
                                transition: {
                                    duration: .2
                                },
                                children: ee.length === 0 ? e.jsx(gs, {
                                    activeFilter: E,
                                    onCreate: xe
                                }) : T === "calendar" ? e.jsx(hs, {
                                    exams: ee
                                }) : e.jsx("div", {
                                    className: _(T === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "flex flex-col gap-3"),
                                    children: ee.map(f => {
                                        const v = qe.get(f.id),
                                            C = us(f, k);
                                        return e.jsx(as, {
                                            exam: f,
                                            linkedMocksCount: v ?.count,
                                            avgMockScore: v ?.avgScore,
                                            mockTrajectory: v ?.trajectory,
                                            studiedChapters: C.studied,
                                            totalChapters: C.total,
                                            tagColors: X,
                                            onTagClick: Qe
                                        }, f.id)
                                    })
                                })
                            }, `${E}-${T}`)
                        }), e.jsx(ls, {
                            exams: A
                        }), e.jsx(os, {
                            exams: A
                        }), e.jsx(cs, {
                            exams: A
                        })]
                    }), e.jsx("div", {
                        className: "w-full mt-8 pointer-events-none select-none overflow-hidden leading-none",
                        children: e.jsx("div", {
                            className: "text-[10vw] sm:text-[14vw] md:text-[18vw] lg:text-[20vw] xl:text-[22vw] font-display font-bold text-black/[0.03] dark:text-white/[0.03] whitespace-nowrap text-center tracking-tight",
                            children: "ISOTOPEAI"
                        })
                    })]
                }), e.jsx(D.button, {
                    onClick: xe,
                    initial: {
                        scale: 0
                    },
                    animate: {
                        scale: 1
                    },
                    transition: {
                        type: "spring",
                        bounce: .3,
                        delay: .3
                    },
                    className: "fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[max(1.5rem,env(safe-area-inset-right))] z-40 group",
                    "aria-label": "Schedule new exam",
                    children: e.jsxs("div", {
                        className: "flex items-center gap-2 px-4 py-3 rounded-2xl bg-brand-600 text-white shadow-xl shadow-brand-600/30 hover:bg-brand-700 transition-colors",
                        children: [e.jsx(Ne, {
                            className: "w-5 h-5"
                        }), e.jsx("span", {
                            className: "hidden sm:inline text-sm font-semibold",
                            children: "Schedule Exam"
                        })]
                    })
                }), e.jsx(ce, {
                    children: p && e.jsx(ot, {
                        isOpen: p,
                        onClose: () => {
                            c(!1), w(null)
                        },
                        editExam: u
                    })
                })]
            })]
        })
    };
export {
    Rs as
    default
};