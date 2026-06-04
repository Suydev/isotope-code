import {
    j as e,
    r as l,
    b as kt,
    i as Ye
} from "./vendor-react-BfU3Zn2J.js";
import {
    S as Ve
} from "./SubjectIcon-CyCDqtel.js";
import {
    S as Le,
    D as Fe
} from "./DashboardHeader-DNuRMna8.js";
import {
    m as N,
    A as Y,
    R as Ct,
    d as St
} from "./vendor-motion-Cp_NPzpZ.js";
import {
    d as Me
} from "./subjectBranding-DaDo_h8r.js";
import {
    bV as Ee,
    P as V,
    bi as $e,
    L as Ke,
    T as Xe,
    M as Ze,
    aC as zt,
    aG as Tt,
    aw as De,
    X as be,
    w as Ie,
    bW as Oe,
    aZ as Je,
    ab as et,
    aq as Ne,
    C as Re,
    f as _e,
    a as tt,
    aB as st,
    al as rt,
    d as we,
    bU as at,
    bX as $t,
    aD as Mt,
    be as Et,
    bY as He,
    bN as Dt,
    b4 as It,
    S as je,
    bZ as Ue,
    ac as Ot,
    I as Rt,
    bO as At,
    at as _t
} from "./vendor-icons-CqruUz7g.js";
import {
    u as it,
    a as nt,
    b as ye,
    s as lt,
    K as ot,
    P as ct,
    C as dt,
    D as xt,
    c as mt,
    S as ht,
    v as pt,
    d as bt
} from "./sortable.esm-BBuGRz7f.js";
import {
    d as pe
} from "./useAIStore-B2cv1FZz.js";
import {
    u as le,
    f as Pt,
    g as Bt,
    h as ut
} from "./useFocusStore-CX_Nyp1h.js";
import {
    I as qe,
    h as Lt,
    g as Ft
} from "./App-pJGjDiPw.js";
import {
    c as ae
} from "./utils-D8mZnxMk.js";
import {
    a as gt
} from "./timeFormat-CMPo-BX2.js";
import {
    u as Ht,
    c as Ut
} from "./vendor-router-CmoTwRnm.js";
import {
    T as qt
} from "./TaskCardModal-DZvd1GWt.js";
import {
    S as Qe
} from "./SubjectCreateModal-DhD_Cwbk.js";
import {
    E as Ge
} from "./ExamTemplateSelectorModal-DsEPEF5X.js";
import {
    b as Qt
} from "./studyTimeMaps-B0T_-AX0.js";
import "./HeadwayUpdatesButton-DUh668tJ.js";
import "./useOnlineStatus-BJOTUERN.js";
import "./MarkdownRenderer-CIV1x0Uq.js";
import "./index-BPYJFSVW.js";
import "./useSyncStore-vWs_TdIc.js";
import "./useNotificationStore-BS4df28T.js";
import "./IsotopeLogoIcon-oPk5Ru-_.js";
import "./vendor-supabase-DAiUAuun.js";
import "./vendor-charts-CFLJvnG7.js";
import "./taskAvailability-B1aDS_ww.js";
const Gt = ({
        percent: r,
        size: t = 80,
        strokeWidth: s = 6,
        showLabel: h = !0,
        className: m = ""
    }) => {
        const x = (t - s) / 2,
            c = 2 * Math.PI * x,
            C = c - r / 100 * c,
            j = r >= 80 ? {
                stroke: "#10b981",
                glow: "rgba(16, 185, 129, 0.3)"
            } : r >= 50 ? {
                stroke: "#f59e0b",
                glow: "rgba(245, 158, 11, 0.3)"
            } : r >= 25 ? {
                stroke: "#3b82f6",
                glow: "rgba(59, 130, 246, 0.3)"
            } : {
                stroke: "#6b7280",
                glow: "rgba(107, 114, 128, 0.2)"
            };
        return e.jsxs("div", {
            className: `relative inline-flex items-center justify-center ${m}`,
            children: [e.jsxs("svg", {
                width: t,
                height: t,
                className: "-rotate-90",
                children: [e.jsx("circle", {
                    cx: t / 2,
                    cy: t / 2,
                    r: x,
                    stroke: "currentColor",
                    strokeWidth: s,
                    fill: "none",
                    className: "text-white/5"
                }), e.jsx(N.circle, {
                    cx: t / 2,
                    cy: t / 2,
                    r: x,
                    stroke: j.stroke,
                    strokeWidth: s,
                    fill: "none",
                    strokeLinecap: "round",
                    strokeDasharray: c,
                    initial: {
                        strokeDashoffset: c
                    },
                    animate: {
                        strokeDashoffset: C
                    },
                    transition: {
                        duration: 1,
                        ease: [.22, 1, .36, 1],
                        delay: .3
                    },
                    style: {
                        filter: `drop-shadow(0 0 6px ${j.glow})`
                    }
                })]
            }), h && e.jsxs("div", {
                className: "absolute inset-0 flex flex-col items-center justify-center",
                children: [e.jsxs(N.span, {
                    initial: {
                        opacity: 0,
                        scale: .5
                    },
                    animate: {
                        opacity: 1,
                        scale: 1
                    },
                    transition: {
                        delay: .5,
                        duration: .3
                    },
                    className: "text-lg font-bold text-white tabular-nums",
                    children: [r, "%"]
                }), e.jsx("span", {
                    className: "text-[9px] text-zinc-500 font-medium uppercase tracking-wider",
                    children: "Complete"
                })]
            })]
        })
    },
    Wt = ({
        subject: r,
        chapterCount: t,
        columnCount: s,
        progressPercent: h,
        onEditColumns: m,
        onAddChapter: x,
        onEditSubject: c
    }) => {
        const C = h >= 80 ? "text-emerald-300 border-emerald-400/25 bg-emerald-500/10" : h >= 50 ? "text-amber-300 border-amber-400/25 bg-amber-500/10" : "text-brand-300 border-brand-400/25 bg-brand-500/10";
        return e.jsxs(N.div, {
            initial: {
                opacity: 0,
                y: -8
            },
            animate: {
                opacity: 1,
                y: 0
            },
            className: "relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0a0d]/95 shadow-[0_4px_32px_-8px_rgba(0,0,0,0.8)] backdrop-blur-2xl",
            children: [e.jsx("div", {
                className: "absolute inset-0 opacity-[0.12]",
                style: {
                    backgroundImage: Me(r.gradient, "to right")
                }
            }), e.jsx("div", {
                className: "absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.2),rgba(0,0,0,0.7)_60%,rgba(0,0,0,0.92))]"
            }), e.jsx("div", {
                className: "absolute -left-12 -top-12 w-40 h-40 rounded-full bg-brand-500/10 blur-[60px] pointer-events-none"
            }), e.jsxs("div", {
                className: "relative z-10 px-4 py-3 flex flex-col gap-3 sm:px-5",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-3",
                    children: [e.jsx("div", {
                        className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 relative overflow-hidden shadow-[0_0_16px_rgba(255,255,255,0.06)]",
                        style: {
                            backgroundImage: Me(r.gradient, "to bottom right")
                        },
                        children: e.jsx(Ve, {
                            icon: r.icon,
                            name: r.name,
                            className: "w-4.5 h-4.5 text-white drop-shadow",
                            size: "sm"
                        })
                    }), e.jsxs("div", {
                        className: "flex items-center gap-2 min-w-0 flex-1",
                        children: [e.jsx("h1", {
                            className: "text-base font-extrabold tracking-tight text-white leading-none truncate",
                            children: r.name
                        }), e.jsxs("button", {
                            onClick: c,
                            className: "inline-flex shrink-0 items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-bold tracking-widest uppercase text-zinc-500 transition-all hover:border-white/20 hover:text-zinc-300 active:scale-95",
                            title: "Edit Subject",
                            children: [e.jsx(Ee, {
                                className: "w-2.5 h-2.5"
                            }), "Edit"]
                        })]
                    }), e.jsx("div", {
                        className: "hidden md:flex items-center gap-2 shrink-0 ml-auto",
                        children: e.jsx(Gt, {
                            percent: h,
                            size: 38,
                            strokeWidth: 4
                        })
                    }), e.jsxs("div", {
                        className: "hidden md:flex items-center gap-2 shrink-0",
                        children: [e.jsx("div", {
                            className: "h-5 w-px bg-white/10 mx-1"
                        }), e.jsxs(N.button, {
                            whileHover: {
                                scale: 1.03
                            },
                            whileTap: {
                                scale: .96
                            },
                            onClick: x,
                            className: "flex items-center gap-1.5 rounded-xl border border-brand-400/20 bg-brand-500 hover:bg-brand-400 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wider text-white transition-all shadow-[0_0_14px_rgba(168,85,247,0.2)] hover:shadow-[0_0_22px_rgba(168,85,247,0.4)]",
                            children: [e.jsx(V, {
                                className: "w-3 h-3 stroke-[2.5]"
                            }), "Add Chapter"]
                        }), e.jsxs(N.button, {
                            whileHover: {
                                scale: 1.03
                            },
                            whileTap: {
                                scale: .96
                            },
                            onClick: m,
                            className: "flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wider text-zinc-300 hover:text-white transition-all",
                            children: [e.jsx($e, {
                                className: "w-3 h-3 text-emerald-400"
                            }), "Manage Types"]
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "flex flex-wrap items-center gap-2",
                    children: [e.jsxs("div", {
                        className: "inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-semibold text-zinc-300",
                        children: [e.jsx(Ke, {
                            className: "h-3 w-3 text-brand-400 shrink-0"
                        }), e.jsx("span", {
                            className: "text-white font-bold",
                            children: t
                        }), e.jsx("span", {
                            className: "text-zinc-500 uppercase tracking-wider text-[10px]",
                            children: "Chapters"
                        })]
                    }), e.jsxs("div", {
                        className: "inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-semibold text-zinc-300",
                        children: [e.jsx($e, {
                            className: "h-3 w-3 text-emerald-400 shrink-0"
                        }), e.jsx("span", {
                            className: "text-white font-bold",
                            children: s
                        }), e.jsx("span", {
                            className: "text-zinc-500 uppercase tracking-wider text-[10px]",
                            children: "Tracking Types"
                        })]
                    }), e.jsxs("div", {
                        className: `inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-semibold ${C}`,
                        children: [e.jsx(Xe, {
                            className: "h-3 w-3 shrink-0"
                        }), e.jsxs("span", {
                            className: "font-bold",
                            children: [h, "%"]
                        }), e.jsx("span", {
                            className: "opacity-60 uppercase tracking-wider text-[10px]",
                            children: "Coverage"
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "flex gap-2 md:hidden",
                    children: [e.jsxs(N.button, {
                        whileHover: {
                            scale: 1.02
                        },
                        whileTap: {
                            scale: .97
                        },
                        onClick: x,
                        className: "flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-brand-400/20 bg-brand-500 hover:bg-brand-400 px-4 py-2.5 text-[11px] font-black uppercase tracking-wider text-white transition-all shadow-[0_0_14px_rgba(168,85,247,0.2)]",
                        children: [e.jsx(V, {
                            className: "w-3.5 h-3.5 stroke-[2.5]"
                        }), "Add Chapter"]
                    }), e.jsxs(N.button, {
                        whileHover: {
                            scale: 1.02
                        },
                        whileTap: {
                            scale: .97
                        },
                        onClick: m,
                        className: "flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] px-4 py-2.5 text-[11px] font-black uppercase tracking-wider text-zinc-300 hover:text-white transition-all",
                        children: [e.jsx($e, {
                            className: "w-3.5 h-3.5 text-emerald-400"
                        }), "Manage Types"]
                    })]
                })]
            })]
        })
    },
    We = {
        high: {
            label: "High",
            bg: "bg-red-500/15",
            text: "text-red-400",
            border: "border-red-500/20",
            icon: Tt,
            dot: "bg-red-500"
        },
        medium: {
            label: "Medium",
            bg: "bg-amber-500/15",
            text: "text-amber-400",
            border: "border-amber-500/20",
            icon: zt,
            dot: "bg-amber-500"
        },
        low: {
            label: "Low",
            bg: "bg-emerald-500/15",
            text: "text-emerald-400",
            border: "border-emerald-500/20",
            icon: Ze,
            dot: "bg-emerald-500"
        }
    },
    Yt = ({
        priority: r,
        onChange: t
    }) => {
        const [s, h] = l.useState(!1), m = l.useRef(null);
        l.useEffect(() => {
            const c = C => {
                m.current && !m.current.contains(C.target) && h(!1)
            };
            return document.addEventListener("mousedown", c), () => document.removeEventListener("mousedown", c)
        }, []);
        const x = r ? We[r] : null;
        return e.jsxs("div", {
            ref: m,
            className: "relative",
            children: [e.jsxs("button", {
                onClick: c => {
                    c.stopPropagation(), h(!s)
                },
                className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${x?`${x.bg} ${x.text} ${x.border} hover:brightness-125`:"bg-white/5 text-zinc-500 border-white/10 hover:bg-white/10 hover:text-zinc-300"}`,
                children: [x ? e.jsxs(e.Fragment, {
                    children: [e.jsx("span", {
                        className: `w-2 h-2 rounded-full ${x.dot}`
                    }), x.label]
                }) : "Set Priority", e.jsx(De, {
                    className: `w-3 h-3 transition-transform ${s?"rotate-180":""}`
                })]
            }), e.jsx(Y, {
                children: s && e.jsx(N.div, {
                    initial: {
                        opacity: 0,
                        y: -4,
                        scale: .95
                    },
                    animate: {
                        opacity: 1,
                        y: 0,
                        scale: 1
                    },
                    exit: {
                        opacity: 0,
                        y: -4,
                        scale: .95
                    },
                    transition: {
                        duration: .15
                    },
                    className: "absolute right-0 top-full mt-1 w-36 bg-[#18181b] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[60] p-1",
                    children: ["high", "medium", "low"].map(c => {
                        const C = We[c];
                        return e.jsxs("button", {
                            onClick: R => {
                                R.stopPropagation(), t(r === c ? null : c), h(!1)
                            },
                            className: `w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${r===c?`${C.bg} ${C.text}`:"text-zinc-400 hover:bg-white/5 hover:text-zinc-200"}`,
                            children: [e.jsx("span", {
                                className: `w-2 h-2 rounded-full ${C.dot}`
                            }), C.label]
                        }, c)
                    })
                })
            })]
        })
    },
    Vt = ({
        isOpen: r,
        onClose: t,
        title: s,
        type: h,
        difficulty: m,
        resources: x,
        onSaveTitle: c,
        onSaveDifficulty: C,
        onAddResource: R,
        onRemoveResource: j
    }) => {
        const [u, y] = l.useState("details"), [S, D] = l.useState(s), [M, P] = l.useState(""), [v, d] = l.useState(""), I = [{
            value: "easy",
            label: "Easy",
            color: "emerald",
            description: "Concepts are clear, minimal review needed."
        }, {
            value: "medium",
            label: "Medium",
            color: "amber",
            description: "Requires some review and practice."
        }, {
            value: "hard",
            label: "Hard",
            color: "rose",
            description: "Needs significant effort and revision."
        }], [K, q] = l.useState(!1);
        l.useEffect(() => {
            q(!0)
        }, []), l.useEffect(() => {
            r && (D(s), y("details"))
        }, [r, s]);
        const b = () => {
                if (!M.trim()) return;
                const p = v.trim(),
                    z = qe(p);
                if (p && !z) {
                    alert("Resource links must start with http:// or https://");
                    return
                }
                R({
                    title: M.trim(),
                    link: z,
                    type: "article"
                }), P(""), d("")
            },
            B = () => {
                const p = S.trim();
                !p || p === s.trim() || c(p)
            };
        return K ? kt.createPortal(e.jsx(Y, {
            children: r && e.jsxs("div", {
                className: "fixed inset-0 z-[100] flex items-center justify-center p-4",
                children: [e.jsx(N.div, {
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    exit: {
                        opacity: 0
                    },
                    onClick: t,
                    className: "absolute inset-0 bg-black/60 backdrop-blur-sm"
                }), e.jsxs(N.div, {
                    initial: {
                        opacity: 0,
                        scale: .95,
                        y: 10
                    },
                    animate: {
                        opacity: 1,
                        scale: 1,
                        y: 0
                    },
                    exit: {
                        opacity: 0,
                        scale: .95,
                        y: 10
                    },
                    className: "relative w-full max-w-md bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col",
                    children: [e.jsxs("div", {
                        className: "flex items-start justify-between p-5 border-b border-white/5",
                        children: [e.jsxs("div", {
                            children: [e.jsxs("span", {
                                className: "text-xs font-medium text-brand-400 uppercase tracking-wider mb-1 block",
                                children: ["Manage ", h === "chapter" ? "Chapter" : "Topic"]
                            }), e.jsx("h3", {
                                className: "text-lg font-semibold text-white line-clamp-1 pr-4",
                                children: s
                            })]
                        }), e.jsx("button", {
                            onClick: t,
                            className: "p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors",
                            children: e.jsx(be, {
                                className: "w-5 h-5"
                            })
                        })]
                    }), e.jsxs("div", {
                        className: "flex p-2 border-b border-white/5 gap-1 bg-black/20",
                        children: [e.jsxs("button", {
                            onClick: () => y("details"),
                            className: `flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${u==="details"?"bg-white/10 text-white":"text-zinc-400 hover:text-zinc-200 hover:bg-white/5"}`,
                            children: [e.jsx(V, {
                                className: `w-4 h-4 ${u==="details"?"text-emerald-400":""}`
                            }), "Details"]
                        }), e.jsxs("button", {
                            onClick: () => y("difficulty"),
                            className: `flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${u==="difficulty"?"bg-white/10 text-white":"text-zinc-400 hover:text-zinc-200 hover:bg-white/5"}`,
                            children: [e.jsx(Ie, {
                                className: `w-4 h-4 ${u==="difficulty"?"text-indigo-400":""}`
                            }), "Difficulty"]
                        }), e.jsxs("button", {
                            onClick: () => y("resources"),
                            className: `flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${u==="resources"?"bg-white/10 text-white":"text-zinc-400 hover:text-zinc-200 hover:bg-white/5"}`,
                            children: [e.jsx(Oe, {
                                className: `w-4 h-4 ${u==="resources"?"text-sky-400":""}`
                            }), "Resources", x ?.length > 0 && e.jsx("span", {
                                className: "bg-white/10 px-1.5 py-0.5 rounded text-[10px] ml-1",
                                children: x.length
                            })]
                        })]
                    }), e.jsx("div", {
                        className: "p-5 h-[320px] overflow-y-auto custom-scrollbar",
                        children: e.jsx(Y, {
                            mode: "wait",
                            children: u === "details" ? e.jsx(N.div, {
                                initial: {
                                    opacity: 0,
                                    x: -10
                                },
                                animate: {
                                    opacity: 1,
                                    x: 0
                                },
                                exit: {
                                    opacity: 0,
                                    x: 10
                                },
                                className: "space-y-5",
                                children: e.jsxs("div", {
                                    className: "space-y-3 rounded-xl border border-white/5 bg-black/20 p-4",
                                    children: [e.jsxs("div", {
                                        className: "space-y-1",
                                        children: [e.jsx("label", {
                                            className: "text-xs font-medium text-zinc-400",
                                            children: h === "chapter" ? "Chapter Name" : "Topic Name"
                                        }), e.jsx("input", {
                                            type: "text",
                                            value: S,
                                            onChange: p => D(p.target.value),
                                            placeholder: h === "chapter" ? "Enter chapter name" : "Enter topic name",
                                            className: "w-full rounded-lg border border-white/10 bg-[#0c0c0e] px-3 py-2 text-sm text-white transition-all placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                                        })]
                                    }), e.jsxs("p", {
                                        className: "text-xs leading-relaxed text-zinc-500",
                                        children: ["Update the ", h, " title here and the syllabus table will refresh immediately."]
                                    }), e.jsxs("button", {
                                        onClick: B,
                                        disabled: !S.trim() || S.trim() === s.trim(),
                                        className: "w-full rounded-lg bg-emerald-500/10 py-2 text-sm font-medium text-emerald-400 transition-all hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-emerald-500/10",
                                        children: ["Save ", h === "chapter" ? "Chapter" : "Topic", " Name"]
                                    })]
                                })
                            }, "details") : u === "difficulty" ? e.jsxs(N.div, {
                                initial: {
                                    opacity: 0,
                                    x: -10
                                },
                                animate: {
                                    opacity: 1,
                                    x: 0
                                },
                                exit: {
                                    opacity: 0,
                                    x: 10
                                },
                                className: "space-y-3",
                                children: [I.map(p => {
                                    const z = m === p.value,
                                        A = p.color === "emerald" ? "emerald" : p.color === "amber" ? "amber" : "rose";
                                    return e.jsxs("button", {
                                        onClick: () => C(p.value),
                                        className: `w-full text-left p-4 rounded-xl border transition-all duration-200 ${z?`bg-${A}-500/10 border-${A}-500/50 shadow-inner group`:"bg-white/[0.02] border-white/5 hover:border-white/20"}`,
                                        children: [e.jsxs("div", {
                                            className: "flex items-center justify-between mb-1",
                                            children: [e.jsx("span", {
                                                className: `text-base font-semibold capitalize ${z?`text-${A}-400`:"text-zinc-300"}`,
                                                children: p.label
                                            }), z && e.jsx("div", {
                                                className: `w-2 h-2 rounded-full bg-${A}-400 animate-pulse`
                                            })]
                                        }), e.jsx("p", {
                                            className: `text-xs ${z?"text-zinc-300":"text-zinc-500"}`,
                                            children: p.description
                                        })]
                                    }, p.value)
                                }), m && e.jsx("button", {
                                    onClick: () => C(void 0),
                                    className: "w-full mt-2 text-center p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 text-zinc-400 hover:text-white transition-all text-sm font-medium",
                                    children: "Clear Difficulty"
                                })]
                            }, "difficulty") : e.jsxs(N.div, {
                                initial: {
                                    opacity: 0,
                                    x: 10
                                },
                                animate: {
                                    opacity: 1,
                                    x: 0
                                },
                                exit: {
                                    opacity: 0,
                                    x: -10
                                },
                                className: "space-y-5",
                                children: [e.jsxs("div", {
                                    className: "space-y-3 p-4 bg-black/20 rounded-xl border border-white/5",
                                    children: [e.jsxs("div", {
                                        className: "space-y-1",
                                        children: [e.jsx("label", {
                                            className: "text-xs font-medium text-zinc-400",
                                            children: "Resource Title"
                                        }), e.jsx("input", {
                                            type: "text",
                                            value: M,
                                            onChange: p => P(p.target.value),
                                            placeholder: "e.g. YouTube Lecture",
                                            className: "w-full bg-[#0c0c0e] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 placeholder:text-zinc-600 transition-all"
                                        })]
                                    }), e.jsxs("div", {
                                        className: "space-y-1",
                                        children: [e.jsx("label", {
                                            className: "text-xs font-medium text-zinc-400",
                                            children: "Link (Optional)"
                                        }), e.jsx("input", {
                                            type: "url",
                                            value: v,
                                            onChange: p => d(p.target.value),
                                            placeholder: "https://...",
                                            className: "w-full bg-[#0c0c0e] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 placeholder:text-zinc-600 transition-all"
                                        })]
                                    }), e.jsxs("button", {
                                        onClick: b,
                                        disabled: !M.trim(),
                                        className: "w-full flex items-center justify-center gap-2 py-2 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 disabled:opacity-50 disabled:hover:bg-sky-500/10 rounded-lg text-sm font-medium transition-all",
                                        children: [e.jsx(V, {
                                            className: "w-4 h-4"
                                        }), "Add Resource"]
                                    })]
                                }), x ?.length > 0 ? e.jsxs("div", {
                                    className: "space-y-2",
                                    children: [e.jsx("h4", {
                                        className: "text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2",
                                        children: "Saved Resources"
                                    }), x.map((p, z) => {
                                        const A = qe(p.link);
                                        return e.jsxs("div", {
                                            className: "flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group",
                                            children: [e.jsxs("div", {
                                                className: "flex flex-col min-w-0 flex-1 mr-3",
                                                children: [e.jsx("span", {
                                                    className: "text-sm font-medium text-zinc-200 line-clamp-1",
                                                    children: p.title
                                                }), A && e.jsxs("a", {
                                                    href: A,
                                                    target: "_blank",
                                                    rel: "noopener noreferrer",
                                                    className: "text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 mt-0.5 line-clamp-1",
                                                    children: [e.jsx(Je, {
                                                        className: "w-3 h-3 shrink-0"
                                                    }), e.jsx("span", {
                                                        className: "truncate",
                                                        children: A
                                                    })]
                                                })]
                                            }), j && e.jsx("button", {
                                                onClick: () => j(z),
                                                className: "p-1.5 rounded-md text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all shrink-0",
                                                children: e.jsx(et, {
                                                    className: "w-4 h-4"
                                                })
                                            })]
                                        }, z)
                                    })]
                                }) : e.jsxs("div", {
                                    className: "text-center py-8",
                                    children: [e.jsx(Oe, {
                                        className: "w-8 h-8 text-zinc-600 mx-auto mb-2"
                                    }), e.jsx("p", {
                                        className: "text-sm text-zinc-400",
                                        children: "No resources added yet."
                                    })]
                                })]
                            }, "resources")
                        })
                    })]
                })]
            })
        }), document.body) : null
    },
    Ae = [{
        value: "brand",
        label: "Brand",
        bg: "bg-brand-500/15",
        text: "text-brand-400",
        border: "border-brand-500/30",
        checkBg: "bg-brand-500"
    }, {
        value: "emerald",
        label: "Emerald",
        bg: "bg-emerald-500/15",
        text: "text-emerald-400",
        border: "border-emerald-500/30",
        checkBg: "bg-emerald-500"
    }, {
        value: "amber",
        label: "Amber",
        bg: "bg-amber-500/15",
        text: "text-amber-400",
        border: "border-amber-500/30",
        checkBg: "bg-amber-500"
    }, {
        value: "rose",
        label: "Rose",
        bg: "bg-rose-500/15",
        text: "text-rose-400",
        border: "border-rose-500/30",
        checkBg: "bg-rose-500"
    }, {
        value: "violet",
        label: "Violet",
        bg: "bg-violet-500/15",
        text: "text-violet-400",
        border: "border-violet-500/30",
        checkBg: "bg-violet-500"
    }, {
        value: "cyan",
        label: "Cyan",
        bg: "bg-cyan-500/15",
        text: "text-cyan-400",
        border: "border-cyan-500/30",
        checkBg: "bg-cyan-500"
    }, {
        value: "orange",
        label: "Orange",
        bg: "bg-orange-500/15",
        text: "text-orange-400",
        border: "border-orange-500/30",
        checkBg: "bg-orange-500"
    }, {
        value: "sky",
        label: "Sky",
        bg: "bg-sky-500/15",
        text: "text-sky-400",
        border: "border-sky-500/30",
        checkBg: "bg-sky-500"
    }, {
        value: "indigo",
        label: "Indigo",
        bg: "bg-indigo-500/15",
        text: "text-indigo-400",
        border: "border-indigo-500/30",
        checkBg: "bg-indigo-500"
    }, {
        value: "lime",
        label: "Lime",
        bg: "bg-lime-500/15",
        text: "text-lime-400",
        border: "border-lime-500/30",
        checkBg: "bg-lime-500"
    }, {
        value: "pink",
        label: "Pink",
        bg: "bg-pink-500/15",
        text: "text-pink-400",
        border: "border-pink-500/30",
        checkBg: "bg-pink-500"
    }, {
        value: "teal",
        label: "Teal",
        bg: "bg-teal-500/15",
        text: "text-teal-400",
        border: "border-teal-500/30",
        checkBg: "bg-teal-500"
    }, {
        value: "fuchsia",
        label: "Fuchsia",
        bg: "bg-fuchsia-500/15",
        text: "text-fuchsia-400",
        border: "border-fuchsia-500/30",
        checkBg: "bg-fuchsia-500"
    }, {
        value: "blue",
        label: "Blue",
        bg: "bg-blue-500/15",
        text: "text-blue-400",
        border: "border-blue-500/30",
        checkBg: "bg-blue-500"
    }],
    Pe = r => Ae.find(t => t.value === r) || Ae[1],
    Kt = [{
        name: "NCERT",
        icon: "📖",
        color: "emerald"
    }, {
        name: "PYQs",
        icon: "📅",
        color: "amber"
    }, {
        name: "Exemplar",
        icon: "💎",
        color: "fuchsia"
    }, {
        name: "Notes",
        icon: "📝",
        color: "teal"
    }, {
        name: "Lecture",
        icon: "🎓",
        color: "indigo"
    }, {
        name: "Revision",
        icon: "🔄",
        color: "rose"
    }, {
        name: "DPPs",
        icon: "✏️",
        color: "orange"
    }, {
        name: "Tests",
        icon: "📊",
        color: "sky"
    }, {
        name: "Practice",
        icon: "🎯",
        color: "lime"
    }, {
        name: "Concept",
        icon: "💡",
        color: "pink"
    }],
    ft = ({
        children: r,
        buttonLabel: t,
        buttonClassName: s
    }) => {
        const [h, m] = l.useState(!1), [x, c] = l.useState({}), C = l.useRef(null), R = j => {
            if (j.stopPropagation(), !C.current) return;
            const u = C.current.getBoundingClientRect(),
                y = 208,
                S = 280,
                P = window.innerHeight - u.bottom < S && u.top > S / 2 ? Math.max(8, u.top - S - 4) : u.bottom + 4,
                d = window.innerWidth - u.left + 8 + y > window.innerWidth ? Math.max(8, u.right - y) : u.left - y - 8;
            c({
                top: P,
                left: d,
                position: "fixed"
            }), m(!0)
        };
        return e.jsxs(e.Fragment, {
            children: [e.jsx("button", {
                ref: C,
                "aria-label": t,
                onClick: R,
                className: s ?? "p-1.5 rounded-lg opacity-0 group-hover:opacity-100 group-hover/topic:opacity-100 hover:bg-white/10 text-zinc-400 hover:text-zinc-200 transition-all",
                children: e.jsx(at, {
                    className: "w-4 h-4"
                })
            }), Ye.createPortal(e.jsx(Y, {
                children: h && e.jsxs(e.Fragment, {
                    children: [e.jsx("div", {
                        className: "fixed inset-0 z-[9998]",
                        onClick: j => {
                            j.stopPropagation(), m(!1)
                        }
                    }), e.jsx(N.div, {
                        initial: {
                            opacity: 0,
                            scale: .95,
                            y: -4
                        },
                        animate: {
                            opacity: 1,
                            scale: 1,
                            y: 0
                        },
                        exit: {
                            opacity: 0,
                            scale: .95,
                            y: -4
                        },
                        transition: {
                            duration: .12
                        },
                        style: x,
                        onClick: j => {
                            j.stopPropagation(), m(!1)
                        },
                        className: "z-[9999] w-52 bg-[#18181b] border border-white/10 rounded-xl shadow-2xl overflow-hidden p-1",
                        children: r
                    })]
                })
            }), document.body)]
        })
    },
    ve = () => e.jsx("div", {
        className: "h-px bg-white/10 my-1 mx-2"
    }),
    Xt = ({
        subtopic: r,
        sortedColumnsCount: t,
        onToggleComplete: s,
        onDelete: h
    }) => e.jsxs(N.tr, {
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
            duration: .15
        },
        className: "border-b border-white/[0.02] group/subtopic",
        style: {
            backgroundColor: "rgba(8,8,10,0.7)"
        },
        children: [e.jsx("td", {
            className: "px-2 py-2 sticky left-0 z-10 border-r border-white/5 w-10 text-center bg-[#08080a]",
            children: e.jsx("div", {
                className: "w-7 h-7"
            })
        }), e.jsxs("td", {
            className: "px-4 py-2 sticky left-[2.5rem] z-10 min-w-[160px] sm:min-w-[300px] border-r border-white/5 bg-[#08080a] relative",
            children: [e.jsx("div", {
                className: "absolute left-8 sm:left-10 top-0 bottom-0 w-px bg-white/[0.06]"
            }), e.jsx("div", {
                className: "absolute left-8 sm:left-10 top-1/2 w-5 h-px bg-white/[0.06]"
            }), e.jsxs("div", {
                className: "flex items-center gap-2 pl-14 sm:pl-16",
                children: [e.jsx("button", {
                    onClick: m => {
                        m.stopPropagation(), s()
                    },
                    className: "p-0.5 rounded hover:bg-white/10 shrink-0 transition-colors",
                    children: r.completed ? e.jsx(_e, {
                        className: "w-3.5 h-3.5 text-emerald-500"
                    }) : e.jsx("div", {
                        className: "w-3.5 h-3.5 rounded-full border border-zinc-700 group-hover/subtopic:border-zinc-500 transition-colors"
                    })
                }), e.jsx("span", {
                    className: ae("text-[12px] transition-colors select-none", r.completed ? "text-zinc-600 line-through decoration-zinc-600/50" : "text-zinc-400 group-hover/subtopic:text-zinc-300"),
                    children: r.title
                })]
            })]
        }), Array.from({
            length: t
        }).map((m, x) => e.jsx("td", {
            className: "border-r border-white/5 px-4 py-2"
        }, x)), e.jsx("td", {
            className: "text-center px-4 py-2 border-r border-white/5",
            children: e.jsx("button", {
                onClick: m => {
                    m.stopPropagation(), h()
                },
                className: "opacity-0 group-hover/subtopic:opacity-100 p-1 rounded text-rose-500/60 hover:text-rose-400 hover:bg-rose-500/10 transition-all",
                children: e.jsx(be, {
                    className: "w-3.5 h-3.5"
                })
            })
        })]
    }),
    wt = ({
        placeholder: r,
        sortedColumnsCount: t,
        indentClass: s,
        onAdd: h,
        onCancel: m
    }) => {
        const [x, c] = l.useState(""), C = l.useRef(null);
        l.useEffect(() => {
            C.current ?.focus()
        }, []);
        const R = () => {
            x.trim() ? (h(x.trim()), c("")) : m()
        };
        return e.jsxs(N.tr, {
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
                duration: .15
            },
            style: {
                backgroundColor: "rgba(10,10,14,0.8)"
            },
            className: "border-b border-brand-500/10",
            children: [e.jsx("td", {
                className: "px-2 py-2.5 sticky left-0 z-10 border-r border-white/5 w-10 bg-[#0a0a0e]"
            }), e.jsx("td", {
                className: ae("px-4 py-2.5 sticky left-[2.5rem] z-10 min-w-[160px] sm:min-w-[300px] border-r border-white/5 bg-[#0a0a0e]", s),
                children: e.jsxs("div", {
                    className: "flex items-center gap-2.5",
                    children: [e.jsx("div", {
                        className: "w-3.5 h-3.5 rounded-full border border-brand-500/50 shrink-0"
                    }), e.jsx("input", {
                        ref: C,
                        value: x,
                        onChange: j => c(j.target.value),
                        onKeyDown: j => {
                            j.key === "Enter" && (j.preventDefault(), x.trim() && (h(x.trim()), c(""))), j.key === "Escape" && m()
                        },
                        onBlur: R,
                        placeholder: r,
                        className: "flex-1 bg-transparent text-[13px] text-zinc-200 placeholder-zinc-600 outline-none border-b border-brand-500/30 focus:border-brand-500/60 pb-0.5 transition-colors"
                    }), e.jsxs("div", {
                        className: "flex items-center gap-1 shrink-0",
                        children: [e.jsx("kbd", {
                            className: "text-[10px] text-zinc-600 bg-white/5 px-1.5 py-0.5 rounded border border-white/10",
                            children: "↵"
                        }), e.jsx("kbd", {
                            className: "text-[10px] text-zinc-600 bg-white/5 px-1.5 py-0.5 rounded border border-white/10",
                            children: "Esc"
                        })]
                    })]
                })
            }), Array.from({
                length: t
            }).map((j, u) => e.jsx("td", {
                className: "border-r border-white/5"
            }, u)), e.jsx("td", {
                className: "border-r border-white/5"
            })]
        })
    },
    jt = ({
        subjectId: r,
        itemId: t,
        column: s,
        config: h,
        compact: m = !1
    }) => {
        const {
            toggleCheck: x,
            incrementCount: c,
            decrementCount: C
        } = pe(), R = `${t}::${s.id}`, j = Pe(s.color), u = s.trackingMode === "count", y = h.countState ?.[R] || 0, S = s.targetCount && s.targetCount > 0 ? s.targetCount : null, D = S ? y >= S : y > 0, M = h.checkState[R] || !1, P = m ? "h-5 w-5" : "h-6 w-6";
        return u ? e.jsx("div", {
            className: "flex items-center justify-center",
            children: e.jsxs("div", {
                className: ae("inline-flex items-center rounded-lg border bg-black/20 p-0.5 transition-colors", D ? `${j.border} ${j.bg}` : "border-white/10"),
                children: [e.jsx("button", {
                    type: "button",
                    "aria-label": `Decrease ${s.name} count`,
                    onClick: v => {
                        v.stopPropagation(), C(r, t, s.id)
                    },
                    disabled: y <= 0,
                    className: "flex h-6 w-6 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-white/10 hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-30",
                    children: e.jsx(Ze, {
                        className: "h-3.5 w-3.5"
                    })
                }), e.jsx("button", {
                    type: "button",
                    "aria-label": `${s.name}: ${S?`${y} of ${S}`:`${y} completed`}`,
                    onClick: v => {
                        v.stopPropagation(), c(r, t, s.id)
                    },
                    className: ae("min-w-10 px-1.5 text-center text-[11px] font-black tabular-nums transition-colors", D ? j.text : "text-zinc-400 hover:text-zinc-100"),
                    children: S ? `${y}/${S}` : y
                }), e.jsx("button", {
                    type: "button",
                    "aria-label": `Increase ${s.name} count`,
                    onClick: v => {
                        v.stopPropagation(), c(r, t, s.id)
                    },
                    className: ae("flex h-6 w-6 items-center justify-center rounded-md transition-colors hover:bg-white/10", D ? j.text : "text-zinc-400 hover:text-zinc-100"),
                    children: e.jsx(V, {
                        className: "h-3.5 w-3.5"
                    })
                })]
            })
        }) : e.jsx("button", {
            type: "button",
            onClick: v => {
                v.stopPropagation(), x(r, t, s.id)
            },
            className: "inline-flex items-center justify-center p-1 rounded-md hover:bg-white/5 transition-colors group/check",
            children: e.jsx("div", {
                className: `${P} rounded-md border-2 flex items-center justify-center transition-all duration-200 ${M?`${j.checkBg} border-transparent shadow-[0_0_12px_rgba(0,0,0,0.2)]`:"border-zinc-700 hover:border-zinc-500 bg-transparent group-hover/check:border-zinc-400"}`,
                children: e.jsx(Y, {
                    mode: "wait",
                    children: M && e.jsx(N.div, {
                        initial: {
                            scale: 0,
                            opacity: 0
                        },
                        animate: {
                            scale: 1,
                            opacity: 1
                        },
                        exit: {
                            scale: 0,
                            opacity: 0
                        },
                        transition: {
                            type: "spring",
                            stiffness: 500,
                            damping: 25
                        },
                        children: e.jsx(we, {
                            className: m ? "h-3.5 w-3.5 text-white" : "h-4 w-4 text-white",
                            strokeWidth: 3
                        })
                    })
                })
            })
        })
    },
    Zt = (r, t, s) => {
        const h = `${r}::${t.id}`;
        if (t.trackingMode === "count") {
            const x = t.targetCount && t.targetCount > 0 ? t.targetCount : 1,
                c = s.countState ?.[h] || 0;
            return {
                checked: Math.min(c, x),
                total: x,
                complete: c >= x
            }
        }
        const m = s.checkState[h] || !1;
        return {
            checked: m ? 1 : 0,
            total: 1,
            complete: m
        }
    },
    Jt = ({
        subjectId: r,
        chapter: t,
        topic: s,
        sortedColumns: h,
        config: m,
        topicStats: x,
        studyTimeByTopic: c,
        highlightedTopicId: C,
        onToggleComplete: R,
        onScheduleTopic: j,
        onBuildTopicTaskInitialData: u,
        onManageTopic: y,
        onDeleteTopic: S,
        onAddSubtopic: D,
        onDeleteSubtopic: M,
        onToggleSubtopicComplete: P
    }) => {
        const {
            attributes: v,
            listeners: d,
            setNodeRef: I,
            transform: K,
            transition: q,
            isDragging: b
        } = it({
            id: s.id,
            data: {
                type: "topic",
                topicId: s.id,
                chapterId: t.id
            }
        }), [B, p] = l.useState(!1), [z, A] = l.useState(!1), L = [...s.subtopics ?? []].sort((k, Q) => (k.order ?? 0) - (Q.order ?? 0)), Z = L.length > 0 || z, F = L.filter(k => k.completed).length, X = {
            transform: dt.Transform.toString(K),
            transition: q
        }, J = k => {
            D(s.id, k), A(!1), p(!0)
        };
        return e.jsxs(e.Fragment, {
            children: [e.jsxs(N.tr, {
                ref: I,
                id: `syllabus-topic-${s.id}`,
                style: X,
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
                className: ae("border-b transition-colors group/topic relative", s.completed ? "bg-emerald-500/[0.02] border-emerald-500/[0.05]" : "bg-[#0c0c0e]/40 hover:bg-[#0c0c0e]/60 border-white/[0.02]", C === s.id && "border-brand-500/20 bg-brand-500/[0.08] shadow-[inset_0_0_0_1px_rgba(139,92,246,0.18)]", b && "opacity-70 z-20"),
                children: [e.jsx("td", {
                    className: `px-2 py-3 sticky left-0 z-10 border-r border-white/5 w-10 text-center ${s.completed?"bg-[#09090b]":"bg-[#0c0c0e]"}`,
                    children: e.jsx("button", {
                        type: "button",
                        "aria-label": `Drag to reorder topic ${s.title}`,
                        className: ae("mx-auto inline-flex h-7 w-7 items-center justify-center rounded-md transition-all", b ? "cursor-grabbing bg-brand-500/10 text-brand-300" : "cursor-grab text-zinc-500 hover:bg-white/10 hover:text-zinc-200"),
                        onClick: k => k.stopPropagation(),
                        ...v,
                        ...d,
                        children: e.jsx(Ne, {
                            className: "h-4 w-4"
                        })
                    })
                }), e.jsxs("td", {
                    className: `px-4 py-3 sticky left-[2.5rem] z-10 min-w-[160px] sm:min-w-[300px] border-r border-white/5 relative pl-10 sm:pl-12 lg:shadow-[4px_0_12px_rgba(0,0,0,0.5)] ${s.completed?"bg-[#09090b]":"bg-[#0c0c0e]"}`,
                    children: [e.jsx("div", {
                        className: "absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-white/[0.1] -mt-1"
                    }), e.jsx("div", {
                        className: "absolute left-4 sm:left-6 top-6 w-4 h-px bg-white/[0.1]"
                    }), e.jsxs("div", {
                        className: "flex items-start gap-3 relative z-10",
                        children: [e.jsx("button", {
                            onClick: k => {
                                k.stopPropagation(), R(s)
                            },
                            className: "mt-0.5 p-1 rounded-md hover:bg-white/10 shrink-0",
                            children: s.completed ? e.jsx(_e, {
                                className: "w-4 h-4 text-emerald-500"
                            }) : e.jsx("div", {
                                className: "w-4 h-4 rounded-full border-2 border-zinc-600 group-hover/topic:border-zinc-400 transition-colors"
                            })
                        }), e.jsxs("div", {
                            className: "flex flex-col min-w-0",
                            children: [e.jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [Z && e.jsx("button", {
                                    onClick: k => {
                                        k.stopPropagation(), p(Q => !Q)
                                    },
                                    className: "p-0.5 rounded hover:bg-white/10 transition-colors shrink-0",
                                    children: e.jsx(Re, {
                                        className: ae("w-3.5 h-3.5 text-zinc-500 transition-transform", B && "rotate-90")
                                    })
                                }), e.jsx("span", {
                                    className: `text-[13px] font-medium transition-colors line-clamp-2 pr-6 ${s.completed?"text-zinc-500 line-through decoration-emerald-500/40 decoration-2":"text-zinc-300"}`,
                                    children: s.title
                                })]
                            }), L.length > 0 && e.jsxs("button", {
                                onClick: k => {
                                    k.stopPropagation(), p(Q => !Q)
                                },
                                className: "mt-0.5 text-[10px] text-zinc-600 hover:text-zinc-400 flex items-center gap-1 transition-colors w-fit",
                                children: [e.jsx($t, {
                                    className: "w-3 h-3"
                                }), F, "/", L.length, " subtopics"]
                            }), (c[s.id] || 0) > 0 ? e.jsxs("div", {
                                className: "flex items-center gap-1.5 mt-1 text-[10px] text-zinc-500 font-medium",
                                children: [e.jsx(tt, {
                                    className: "w-3 h-3 text-blue-400/80"
                                }), e.jsxs("span", {
                                    children: [gt(Math.round(c[s.id] || 0)), " spent"]
                                })]
                            }) : null, e.jsxs("div", {
                                className: "flex items-center gap-2 mt-1 flex-wrap",
                                children: [x.attempted > 0 && e.jsxs("div", {
                                    className: "flex items-center gap-1.5 mr-1 pt-1 pb-1",
                                    children: [e.jsxs("div", {
                                        className: "flex items-center -space-x-1",
                                        children: [e.jsx("div", {
                                            className: "w-1 h-1 rounded-full bg-emerald-500",
                                            title: "Correct"
                                        }), e.jsx("div", {
                                            className: "w-1 h-1 rounded-full bg-rose-500",
                                            title: "Incorrect"
                                        }), e.jsx("div", {
                                            className: "w-1 h-1 rounded-full bg-amber-500",
                                            title: "Skipped"
                                        })]
                                    }), e.jsxs("span", {
                                        className: "text-[9px] font-bold text-zinc-500 flex items-center gap-0.5",
                                        children: [x.attempted, " Qs •", e.jsx("span", {
                                            className: "text-emerald-500/80",
                                            children: x.correct
                                        }), "/", e.jsx("span", {
                                            className: "text-rose-500/80",
                                            children: x.incorrect
                                        }), "/", e.jsx("span", {
                                            className: "text-amber-500/80",
                                            children: x.skipped
                                        }), e.jsxs("span", {
                                            className: "ml-0.5 px-0.5 py-px rounded bg-emerald-500/5 text-emerald-500/70 border border-emerald-500/10",
                                            children: [Math.round(x.correct / Math.max(x.attempted, 1) * 100), "%"]
                                        })]
                                    })]
                                }), s.difficulty && e.jsx("span", {
                                    className: `text-[9px] px-1.5 py-0.5 rounded font-medium border ${s.difficulty==="hard"?"bg-rose-500/10 border-rose-500/20 text-rose-400":s.difficulty==="medium"?"bg-amber-500/10 border-amber-500/20 text-amber-400":"bg-emerald-500/10 border-emerald-500/20 text-emerald-400"}`,
                                    children: s.difficulty.charAt(0).toUpperCase() + s.difficulty.slice(1)
                                }), s.resources && s.resources.length > 0 && e.jsxs("span", {
                                    className: "text-[9px] font-medium text-zinc-400 bg-white/5 rounded px-1.5 py-0.5",
                                    children: [s.resources.length, " Resource(s)"]
                                })]
                            })]
                        })]
                    })]
                }), h.map(k => e.jsx("td", {
                    className: "text-center px-4 py-3 border-r border-white/5",
                    children: e.jsx(jt, {
                        subjectId: r,
                        itemId: s.id,
                        column: k,
                        config: m,
                        compact: !0
                    })
                }, k.id)), e.jsx("td", {
                    className: "text-center px-4 py-3 border-r border-white/5 relative bg-inherit",
                    children: e.jsx("div", {
                        className: "flex items-center justify-center",
                        children: e.jsxs(ft, {
                            buttonLabel: `Open topic actions for ${s.title}`,
                            children: [e.jsxs("button", {
                                onClick: () => j ?.(u(s)),
                                className: "w-full text-left px-3 py-2 text-xs font-medium hover:bg-white/5 flex items-center gap-2 text-brand-400 rounded-lg",
                                children: [e.jsx(st, {
                                    className: "w-3.5 h-3.5"
                                }), "Schedule Task"]
                            }), e.jsxs("button", {
                                onClick: () => {
                                    A(!0), p(!0)
                                },
                                className: "w-full text-left px-3 py-2 text-xs font-medium hover:bg-white/5 flex items-center gap-2 text-violet-400 rounded-lg",
                                children: [e.jsx(V, {
                                    className: "w-3.5 h-3.5"
                                }), "Add Subtopic"]
                            }), e.jsx(ve, {}), e.jsxs("button", {
                                onClick: () => y(s.id),
                                className: "w-full text-left px-3 py-2 text-xs font-medium hover:bg-white/5 flex items-center gap-2 text-zinc-300 hover:text-white rounded-lg",
                                children: [e.jsx(rt, {
                                    className: "w-3.5 h-3.5"
                                }), "Manage"]
                            }), e.jsx(ve, {}), e.jsxs("button", {
                                onClick: () => S(s.id),
                                className: "w-full text-left px-3 py-2 text-xs font-medium hover:bg-rose-500/10 flex items-center gap-2 text-rose-400 rounded-lg",
                                children: [e.jsx(be, {
                                    className: "w-3.5 h-3.5"
                                }), "Delete Topic"]
                            })]
                        })
                    })
                })]
            }), e.jsx(Y, {
                children: B && e.jsxs(e.Fragment, {
                    children: [L.map(k => e.jsx(Xt, {
                        subtopic: k,
                        sortedColumnsCount: h.length,
                        onToggleComplete: () => P(s.id, k.id),
                        onDelete: () => M(s.id, k.id)
                    }, k.id)), z && e.jsx(wt, {
                        placeholder: "Subtopic name… (Enter to add, Esc to cancel)",
                        sortedColumnsCount: h.length,
                        indentClass: "pl-16 sm:pl-20",
                        onAdd: J,
                        onCancel: () => A(!1)
                    }, "add-subtopic")]
                })
            })]
        })
    },
    es = ({
        subject: r,
        chapter: t,
        index: s,
        sortedColumns: h,
        config: m,
        questionsStats: x,
        studyTimeByChapter: c = {},
        studyTimeByTopic: C = {},
        chapterDragDisabled: R,
        highlightedChapterId: j,
        highlightedTopicId: u,
        onScheduleChapter: y,
        onScheduleTopic: S
    }) => {
        const [D, M] = l.useState(!1), [P, v] = l.useState(!1), [d, I] = l.useState(null), K = Ht(), q = () => K(`/syllabus/chapter/${t.id}`), {
            setPriority: b
        } = pe(), {
            markChapterForRevision: B,
            updateChapter: p,
            updateTopic: z,
            setTopicOrder: A,
            deleteTopic: L,
            deleteChapter: Z,
            addSubtopic: F,
            updateSubtopic: X,
            deleteSubtopic: J
        } = le(), {
            attributes: k,
            listeners: Q,
            setNodeRef: G,
            transform: ee,
            transition: o,
            isDragging: g
        } = it({
            id: t.id,
            data: {
                type: "chapter",
                chapterId: t.id
            },
            disabled: R
        }), $ = h.map(n => Zt(t.id, n, m)), T = $.length > 0 && $.every(n => n.complete), _ = $.reduce((n, E) => n + E.checked, 0), i = $.reduce((n, E) => n + E.total, 0), O = t.metadata ?.needsRevision || !1, W = x.byChapter[t.id] || {
            attempted: 0,
            correct: 0,
            incorrect: 0,
            skipped: 0
        }, ue = c[t.id] || 0, ke = async n => {
            await z(r.id, t.id, n.id, {
                completed: !n.completed
            })
        }, Ce = (n, E) => {
            F(r.id, t.id, n, E)
        }, Se = (n, E) => {
            J(r.id, t.id, n, E)
        }, ge = (n, E) => {
            const xe = t.topics.find(he => he.id === n);
            if (!xe) return;
            const me = (xe.subtopics ?? []).find(he => he.id === E);
            me && X(r.id, t.id, n, E, {
                completed: !me.completed
            })
        }, te = [...t.topics].sort((n, E) => (n.order ?? 0) - (E.order ?? 0)), {
            profile: ze
        } = Lt(), Te = Pt(ze ?.studyPreferences), fe = nt(ye(ct, {
            activationConstraint: {
                distance: 6
            }
        }), ye(ot, {
            coordinateGetter: lt
        })), oe = Bt(new Date, Te), ce = j === t.id, se = !!(u ? te.find(n => n.id === u) ?? null : null), H = d ?.topicId ? t.topics.find(n => n.id === d.topicId) ?? null : null, a = d ?.type === "chapter" ? t.title : H ?.title ?? "";
        l.useEffect(() => {
            se && M(!0)
        }, [se]), l.useEffect(() => {
            if (se && !D) return;
            const n = se ? `syllabus-topic-${u}` : ce ? `syllabus-chapter-${t.id}` : null;
            if (!n) return;
            const E = window.requestAnimationFrame(() => {
                document.getElementById(n) ?.scrollIntoView({
                    block: "center",
                    behavior: "smooth"
                })
            });
            return () => window.cancelAnimationFrame(E)
        }, [t.id, se, u, D, ce]);
        const f = () => ({
                title: `Study: ${t.title}`,
                subject: r.name,
                subjectId: r.id,
                chapterId: t.id,
                status: "todo",
                priority: "p2",
                dueDate: oe,
                subtasks: te.filter(n => n.title.trim().length > 0).map(n => ({
                    id: Ft(),
                    title: n.title.trim(),
                    completed: !1
                }))
            }),
            w = n => ({
                title: `Study: ${n.title}`,
                subject: r.name,
                subjectId: r.id,
                chapterId: t.id,
                topicId: n.id,
                status: "todo",
                priority: "p2",
                dueDate: oe
            }),
            re = async n => {
                const {
                    active: E,
                    over: xe
                } = n;
                if (!xe || E.id === xe.id) return;
                const me = te.map(Nt => Nt.id),
                    he = me.indexOf(String(E.id)),
                    Be = me.indexOf(String(xe.id));
                he === -1 || Be === -1 || await A(r.id, t.id, bt(me, he, Be))
            },
            de = n => {
                le.getState().addTopic(r.id, t.id, n)
            },
            ne = {
                high: "bg-rose-500/[0.04] hover:bg-rose-500/[0.08] border-rose-500/10",
                medium: "bg-amber-500/[0.04] hover:bg-amber-500/[0.08] border-amber-500/10",
                low: "bg-sky-500/[0.04] hover:bg-sky-500/[0.08] border-sky-500/10",
                none: T ? "bg-emerald-500/[0.02] hover:bg-emerald-500/[0.04] border-emerald-500/10" : s % 2 === 0 ? "bg-transparent hover:bg-white/[0.02] border-white/[0.03]" : "bg-white/[0.01] hover:bg-white/[0.02] border-white/[0.03]"
            },
            U = m.priorities[t.id],
            yt = U ? ne[U] : ne.none,
            vt = {
                transform: dt.Transform.toString(ee),
                transition: o
            };
        return e.jsxs(e.Fragment, {
            children: [e.jsxs(N.tr, {
                ref: G,
                id: `syllabus-chapter-${t.id}`,
                style: vt,
                initial: {
                    opacity: 0
                },
                animate: {
                    opacity: 1
                },
                transition: {
                    delay: s * .02
                },
                className: ae("border-b transition-all duration-300 group relative", yt, (ce || se) && "border-brand-500/20 bg-brand-500/[0.06] shadow-[inset_0_0_0_1px_rgba(139,92,246,0.2)]", g && "opacity-70 z-20"),
                children: [e.jsxs("td", {
                    className: "px-2 py-4 sticky left-0 bg-[#09090b] z-10 border-r border-white/5 w-10 text-center",
                    children: [U && e.jsx("div", {
                        className: "absolute left-0 top-0 bottom-0 w-1 sm:w-0.5 sm:rounded-r-full shadow-[0_0_10px_currentColor]",
                        style: {
                            backgroundColor: U === "high" ? "#f43f5e" : U === "medium" ? "#f59e0b" : "#0ea5e9",
                            color: U === "high" ? "#f43f5e" : U === "medium" ? "#f59e0b" : "#0ea5e9"
                        }
                    }), e.jsx("button", {
                        type: "button",
                        "aria-label": `Drag to reorder chapter ${t.title}`,
                        title: R ? "Clear filters to reorder chapters" : `Drag to reorder chapter ${t.title}`,
                        disabled: R,
                        className: ae("mx-auto inline-flex h-7 w-7 items-center justify-center rounded-md transition-all", R ? "cursor-not-allowed text-zinc-700" : g ? "cursor-grabbing bg-brand-500/10 text-brand-300" : "cursor-grab text-zinc-500 hover:bg-white/10 hover:text-zinc-200"),
                        onClick: n => n.stopPropagation(),
                        ...k,
                        ...Q,
                        children: e.jsx(Ne, {
                            className: "h-4 w-4"
                        })
                    })]
                }), e.jsx("td", {
                    className: "px-4 py-4 sticky left-[2.5rem] bg-[#09090b] z-10 min-w-[160px] sm:min-w-[300px] border-r border-white/5 lg:shadow-[4px_0_12px_rgba(0,0,0,0.5)]",
                    children: e.jsxs("div", {
                        className: "flex items-start gap-2",
                        children: [e.jsx("button", {
                            onClick: () => M(!D),
                            className: `p-1 rounded-md hover:bg-white/10 transition-colors ${t.topics.length===0?"invisible":""} mt-0.5`,
                            children: e.jsx(Re, {
                                className: `w-4 h-4 text-zinc-400 transition-transform ${D?"rotate-90":""}`
                            })
                        }), e.jsxs("div", {
                            className: "flex flex-col",
                            children: [e.jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [e.jsx("button", {
                                    type: "button",
                                    onClick: n => {
                                        n.stopPropagation(), q()
                                    },
                                    title: "Open Chapter Hub",
                                    className: `font-semibold text-sm transition-all text-left hover:underline decoration-brand-400/50 underline-offset-2 ${T||t.topics.length>0&&t.topics.every(n=>n.completed)?"text-emerald-400/80 line-through decoration-emerald-500/50 decoration-2":"text-zinc-200 group-hover:text-white"}`,
                                    children: t.title
                                }), T && e.jsx(N.div, {
                                    initial: {
                                        scale: 0
                                    },
                                    animate: {
                                        scale: 1
                                    },
                                    children: e.jsx(_e, {
                                        className: "w-4 h-4 text-emerald-400"
                                    })
                                }), !T && _ > 0 && e.jsxs("span", {
                                    className: "text-[10px] font-bold text-zinc-600 bg-white/5 px-1.5 py-0.5 rounded-full",
                                    children: [_, "/", i]
                                }), O && e.jsx(Ie, {
                                    className: "w-3.5 h-3.5 fill-amber-500 text-amber-500"
                                }), (ce || se) && e.jsxs("span", {
                                    className: "inline-flex items-center gap-1 rounded-full border border-brand-500/20 bg-brand-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-300",
                                    children: [e.jsx(Oe, {
                                        className: "h-3 w-3"
                                    }), "Linked"]
                                })]
                            }), e.jsxs("div", {
                                className: "flex items-center gap-3 mt-1.5 flex-wrap",
                                children: [t.topics.length > 0 && e.jsxs("span", {
                                    className: "text-[10px] text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded font-medium",
                                    children: ["Topics: ", t.topics.filter(n => n.completed).length, "/", t.topics.length]
                                }), ue > 0 && e.jsxs("span", {
                                    className: "text-[10px] flex items-center gap-1 font-medium text-blue-400/80",
                                    children: [e.jsx(tt, {
                                        className: "w-3 h-3"
                                    }), gt(ue), " spent"]
                                }), W.attempted > 0 && e.jsxs("div", {
                                    className: "flex items-center gap-1.5 mt-1",
                                    children: [e.jsxs("div", {
                                        className: "flex items-center -space-x-1.5",
                                        children: [e.jsx("div", {
                                            className: "w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]",
                                            title: "Correct"
                                        }), e.jsx("div", {
                                            className: "w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]",
                                            title: "Incorrect"
                                        }), e.jsx("div", {
                                            className: "w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]",
                                            title: "Skipped"
                                        })]
                                    }), e.jsxs("span", {
                                        className: "text-[10px] flex items-center gap-1 font-bold text-zinc-400 group-hover:text-zinc-200 transition-colors",
                                        children: [W.attempted, " Qs •", e.jsx("span", {
                                            className: "text-emerald-400",
                                            children: W.correct
                                        }), "/", e.jsx("span", {
                                            className: "text-rose-400",
                                            children: W.incorrect
                                        }), "/", e.jsx("span", {
                                            className: "text-amber-400",
                                            children: W.skipped
                                        }), e.jsxs("span", {
                                            className: "ml-1 px-1 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/10",
                                            children: [W.attempted > 0 ? Math.round(W.correct / W.attempted * 100) : 0, "%"]
                                        })]
                                    })]
                                }), t.metadata ?.difficulty && e.jsx("span", {
                                    className: `text-[10px] px-1.5 py-0.5 rounded font-medium border ${t.metadata.difficulty==="hard"?"bg-rose-500/10 text-rose-400 border-rose-500/20":t.metadata.difficulty==="medium"?"bg-amber-500/10 text-amber-400 border-amber-500/20":"bg-emerald-500/10 text-emerald-400 border-emerald-500/20"}`,
                                    children: t.metadata.difficulty.charAt(0).toUpperCase() + t.metadata.difficulty.slice(1)
                                }), t.metadata ?.resources && t.metadata.resources.length > 0 && e.jsxs("span", {
                                    className: "text-[10px] text-zinc-400 bg-white/5 px-1.5 py-0.5 rounded font-medium flex items-center gap-1",
                                    children: ["[", t.metadata.resources.length, " Resource(s)]"]
                                })]
                            })]
                        })]
                    })
                }), h.map(n => e.jsx("td", {
                    className: "text-center px-4 py-4 border-r border-white/5",
                    children: e.jsx(jt, {
                        subjectId: r.id,
                        itemId: t.id,
                        column: n,
                        config: m
                    })
                }, n.id)), e.jsx("td", {
                    className: "text-center px-4 py-4 border-r border-white/5 relative bg-inherit",
                    children: e.jsxs("div", {
                        className: "flex items-center justify-center gap-3",
                        children: [e.jsx(Yt, {
                            priority: m.priorities[t.id] ?? null,
                            onChange: n => b(r.id, t.id, n)
                        }), e.jsxs(ft, {
                            buttonLabel: `Open chapter actions for ${t.title}`,
                            children: [e.jsxs("button", {
                                onClick: q,
                                className: "w-full text-left px-3 py-2 text-xs font-medium hover:bg-white/5 flex items-center gap-2 text-brand-300 rounded-lg",
                                children: [e.jsx(Je, {
                                    className: "w-3.5 h-3.5"
                                }), "Open Chapter Hub"]
                            }), e.jsxs("button", {
                                onClick: () => B(r.id, t.id, !O),
                                className: "w-full text-left px-3 py-2 text-xs font-medium hover:bg-white/5 flex items-center gap-2 text-amber-400 rounded-lg",
                                children: [e.jsx(Ie, {
                                    className: `w-3.5 h-3.5 ${O?"fill-amber-500":""}`
                                }), O ? "Remove Revision Mark" : "Mark for Revision"]
                            }), e.jsxs("button", {
                                onClick: () => y ?.(f()),
                                className: "w-full text-left px-3 py-2 text-xs font-medium hover:bg-white/5 flex items-center gap-2 text-brand-400 rounded-lg",
                                children: [e.jsx(st, {
                                    className: "w-3.5 h-3.5"
                                }), "Schedule Chapter Task"]
                            }), t.topics.length > 0 && e.jsxs("button", {
                                onClick: () => M(n => !n),
                                className: "w-full text-left px-3 py-2 text-xs font-medium hover:bg-white/5 flex items-center gap-2 text-brand-400/70 rounded-lg",
                                children: [e.jsx(Re, {
                                    className: `w-3.5 h-3.5 transition-transform ${D?"rotate-90":""}`
                                }), D ? "Hide Topics" : "Show Topics"]
                            }), e.jsxs("button", {
                                onClick: () => {
                                    M(!0), v(!0)
                                },
                                className: "w-full text-left px-3 py-2 text-xs font-medium hover:bg-white/5 flex items-center gap-2 text-emerald-400 rounded-lg",
                                children: [e.jsx(V, {
                                    className: "w-3.5 h-3.5"
                                }), "Add Topic"]
                            }), e.jsx(ve, {}), e.jsxs("button", {
                                onClick: () => I({
                                    isOpen: !0,
                                    type: "chapter"
                                }),
                                className: "w-full text-left px-3 py-2 text-xs font-medium hover:bg-white/5 flex items-center gap-2 text-zinc-300 hover:text-white rounded-lg",
                                children: [e.jsx(rt, {
                                    className: "w-3.5 h-3.5"
                                }), "Manage"]
                            }), e.jsx(ve, {}), e.jsxs("button", {
                                onClick: () => Z(r.id, t.id),
                                className: "w-full text-left px-3 py-2 text-xs font-medium hover:bg-rose-500/10 flex items-center gap-2 text-rose-400 rounded-lg",
                                children: [e.jsx(be, {
                                    className: "w-3.5 h-3.5"
                                }), "Delete Chapter"]
                            })]
                        })]
                    })
                })]
            }), e.jsx(Y, {
                children: D && e.jsx(xt, {
                    sensors: fe,
                    collisionDetection: mt,
                    onDragEnd: re,
                    children: e.jsx(ht, {
                        items: te.map(n => n.id),
                        strategy: pt,
                        children: te.map(n => e.jsx(Jt, {
                            subjectId: r.id,
                            chapter: t,
                            topic: n,
                            sortedColumns: h,
                            config: m,
                            topicStats: x.byTopic ?.[n.id] || {
                                attempted: 0,
                                correct: 0,
                                incorrect: 0,
                                skipped: 0
                            },
                            studyTimeByTopic: C,
                            highlightedTopicId: u,
                            onToggleComplete: ke,
                            onScheduleTopic: S,
                            onBuildTopicTaskInitialData: w,
                            onManageTopic: E => I({
                                isOpen: !0,
                                type: "topic",
                                topicId: E
                            }),
                            onDeleteTopic: E => L(r.id, t.id, E),
                            onAddSubtopic: Ce,
                            onDeleteSubtopic: Se,
                            onToggleSubtopicComplete: ge
                        }, n.id))
                    })
                })
            }), e.jsx(Y, {
                children: P && e.jsx(wt, {
                    placeholder: "Topic name… (Enter to add, Esc to cancel)",
                    sortedColumnsCount: h.length,
                    indentClass: "pl-10 sm:pl-12",
                    onAdd: n => {
                        de(n), M(!0)
                    },
                    onCancel: () => v(!1)
                }, "add-topic")
            }), e.jsx(Y, {
                children: D && !P && e.jsxs(N.tr, {
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    exit: {
                        opacity: 0
                    },
                    className: "border-b border-white/[0.02]",
                    style: {
                        backgroundColor: "rgba(10,10,14,0.4)"
                    },
                    children: [e.jsx("td", {
                        className: "px-2 py-1.5 sticky left-0 z-10 border-r border-white/5 w-10 bg-[#0a0a0e]/80"
                    }), e.jsx("td", {
                        className: "px-4 py-1.5 sticky left-[2.5rem] z-10 border-r border-white/5 bg-[#0a0a0e]/80 pl-10 sm:pl-12",
                        colSpan: 1,
                        children: e.jsxs("button", {
                            onClick: () => v(!0),
                            className: "flex items-center gap-2 text-[11px] text-zinc-600 hover:text-emerald-400 transition-colors group/add py-0.5",
                            children: [e.jsx(V, {
                                className: "w-3.5 h-3.5 text-zinc-700 group-hover/add:text-emerald-400 transition-colors"
                            }), "Add topic"]
                        })
                    }), h.map(n => e.jsx("td", {
                        className: "border-r border-white/5 bg-[#0a0a0e]/80"
                    }, n.id)), e.jsx("td", {
                        className: "border-r border-white/5 bg-[#0a0a0e]/80"
                    })]
                })
            }), d ?.isOpen && e.jsx(Vt, {
                isOpen: !0,
                onClose: () => I(null),
                title: a,
                type: d.type,
                difficulty: d.type === "chapter" ? t.metadata ?.difficulty : H ?.difficulty,
                resources: d.type === "chapter" ? t.metadata ?.resources || [] : H ?.resources || [],
                onSaveTitle: n => {
                    d.type === "chapter" ? p(r.id, t.id, {
                        title: n
                    }) : H && z(r.id, t.id, H.id, {
                        title: n
                    })
                },
                onSaveDifficulty: n => {
                    d.type === "chapter" ? le.getState().updateChapterMetadata(r.id, t.id, {
                        difficulty: n
                    }) : H && z(r.id, t.id, H.id, { ...H,
                        difficulty: n
                    })
                },
                onAddResource: n => {
                    if (d.type === "chapter") {
                        const E = t.metadata ?.resources || [];
                        le.getState().updateChapterMetadata(r.id, t.id, {
                            resources: [...E, n]
                        })
                    } else H && le.getState().addResource(r.id, t.id, H.id, n)
                },
                onRemoveResource: n => {
                    if (d.type === "chapter") {
                        const E = [...t.metadata ?.resources || []];
                        E.splice(n, 1), le.getState().updateChapterMetadata(r.id, t.id, {
                            resources: E
                        })
                    } else if (H) {
                        const E = [...H.resources || []];
                        E.splice(n, 1), z(r.id, t.id, H.id, { ...H,
                            resources: E
                        })
                    }
                }
            })]
        })
    },
    ts = (r, t, s, h) => {
        const m = `${r}::${t.id}`;
        if (t.trackingMode === "count") {
            const x = t.targetCount && t.targetCount > 0 ? t.targetCount : 1;
            return (h ?.[m] || 0) >= x
        }
        return s[m] || !1
    },
    ss = ({
        subject: r,
        highlightedChapterId: t,
        highlightedTopicId: s,
        studyTimeByChapter: h = {},
        studyTimeByTopic: m = {},
        onScheduleChapter: x,
        onScheduleTopic: c
    }) => {
        const {
            getOrCreateConfig: C,
            bulkSetColumn: R
        } = pe(), {
            setChapterOrder: j
        } = le(), {
            sessions: u
        } = ut(), y = C(r.id), S = l.useMemo(() => [...y.columns].sort((o, g) => o.order - g.order), [y.columns]), D = l.useMemo(() => [...r.chapters].sort((o, g) => (o.order ?? 0) - (g.order ?? 0)), [r.chapters]), [M, P] = l.useState(""), [v, d] = l.useState("all"), [I, K] = l.useState("all"), [q, b] = l.useState(!1), [B, p] = l.useState(!1), [z, A] = l.useState(null), L = l.useRef({}), Z = o => {
            const g = L.current[o];
            if (!g) return;
            const $ = g.getBoundingClientRect(),
                T = 160,
                _ = 88,
                O = window.innerHeight - $.bottom < _ ? $.top - _ - 4 : $.bottom + 4,
                W = Math.max(8, Math.min($.left - T / 2 + $.width / 2, window.innerWidth - T - 8));
            A({
                colId: o,
                style: {
                    position: "fixed",
                    top: O,
                    left: W
                }
            })
        }, F = () => A(null), X = nt(ye(ct, {
            activationConstraint: {
                distance: 6
            }
        }), ye(ot, {
            coordinateGetter: lt
        })), J = l.useMemo(() => {
            const o = {},
                g = {};
            return u.forEach($ => {
                $.questionsByChapter && Object.entries($.questionsByChapter).forEach(([T, _]) => {
                    o[T] || (o[T] = {
                        attempted: 0,
                        correct: 0,
                        incorrect: 0,
                        skipped: 0
                    }), o[T].attempted += _.attempted || 0, o[T].correct += _.correct || 0, o[T].incorrect += _.incorrect || 0, o[T].skipped += _.skipped || 0
                }), $.questionsByTopic && Object.entries($.questionsByTopic).forEach(([T, _]) => {
                    g[T] || (g[T] = {
                        attempted: 0,
                        correct: 0,
                        incorrect: 0,
                        skipped: 0
                    }), g[T].attempted += _.attempted || 0, g[T].correct += _.correct || 0, g[T].incorrect += _.incorrect || 0, g[T].skipped += _.skipped || 0
                })
            }), {
                byChapter: o,
                byTopic: g
            }
        }, [u]), k = l.useMemo(() => {
            let o = D;
            if (M.trim()) {
                const g = M.toLowerCase();
                o = o.filter($ => $.title.toLowerCase().includes(g))
            }
            return v !== "all" && (o = o.filter(g => (y.priorities[g.id] ?? null) === v)), I !== "all" && (o = o.filter(g => {
                const $ = S.length > 0 && S.every(T => ts(g.id, T, y.checkState, y.countState));
                return I === "completed" ? $ : !$
            })), o
        }, [D, M, v, y.priorities, I, S, y.checkState]), Q = r.chapters.map(o => o.id), G = M.trim() !== "" || v !== "all" || I !== "all", ee = async o => {
            const {
                active: g,
                over: $
            } = o;
            if (G || !$ || g.id === $.id) return;
            const T = D.map(O => O.id),
                _ = T.indexOf(String(g.id)),
                i = T.indexOf(String($.id));
            _ === -1 || i === -1 || await j(r.id, bt(T, _, i))
        };
        return e.jsxs("div", {
            className: "space-y-4 pb-32",
            children: [e.jsxs("div", {
                className: "flex flex-wrap items-center gap-2 sm:gap-3",
                children: [e.jsxs("div", {
                    className: "relative min-w-[min(100%,16rem)] flex-1 sm:max-w-sm",
                    children: [e.jsx(Mt, {
                        className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
                    }), e.jsx("input", {
                        value: M,
                        onChange: o => P(o.target.value),
                        placeholder: "Search chapters...",
                        className: "w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500/30 transition-colors"
                    })]
                }), e.jsxs("div", {
                    className: "relative",
                    children: [e.jsxs("button", {
                        onClick: () => {
                            b(!q), p(!1)
                        },
                        className: `flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${v!=="all"?"bg-brand-500/10 text-brand-400 border-brand-500/20":"bg-white/[0.03] text-zinc-400 border-white/5 hover:bg-white/5"}`,
                        children: [e.jsx(Et, {
                            className: "w-4 h-4 hidden sm:block"
                        }), v !== "all" ? `${v.charAt(0).toUpperCase()+v.slice(1)}` : "Priority", e.jsx(De, {
                            className: `w-3 h-3 transition-transform ${q?"rotate-180":""}`
                        })]
                    }), e.jsx(Y, {
                        children: q && e.jsxs(e.Fragment, {
                            children: [e.jsx("div", {
                                className: "fixed inset-0 z-40",
                                onClick: () => b(!1)
                            }), e.jsx(N.div, {
                                initial: {
                                    opacity: 0,
                                    y: -4
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                exit: {
                                    opacity: 0,
                                    y: -4
                                },
                                className: "absolute right-0 top-full mt-1 w-[min(10rem,calc(100vw-1.5rem))] bg-[#18181b] border border-white/10 rounded-xl shadow-2xl z-[50] p-1",
                                children: ["all", "high", "medium", "low"].map(o => e.jsx("button", {
                                    onClick: () => {
                                        d(o), b(!1)
                                    },
                                    className: `w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors ${v===o?"bg-brand-500/10 text-brand-400":"text-zinc-400 hover:bg-white/5 hover:text-zinc-200"}`,
                                    children: o === "all" ? "All Priorities" : o.charAt(0).toUpperCase() + o.slice(1)
                                }, o))
                            })]
                        })
                    })]
                }), e.jsxs("div", {
                    className: "relative",
                    children: [e.jsxs("button", {
                        onClick: () => {
                            p(!B), b(!1)
                        },
                        className: `flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${I!=="all"?"bg-emerald-500/10 text-emerald-400 border-emerald-500/20":"bg-white/[0.03] text-zinc-400 border-white/5 hover:bg-white/5"}`,
                        children: [e.jsx(He, {
                            className: "w-4 h-4 hidden sm:block"
                        }), I !== "all" ? `${I.charAt(0).toUpperCase()+I.slice(1)}` : "Status", e.jsx(De, {
                            className: `w-3 h-3 transition-transform ${B?"rotate-180":""}`
                        })]
                    }), e.jsx(Y, {
                        children: B && e.jsxs(e.Fragment, {
                            children: [e.jsx("div", {
                                className: "fixed inset-0 z-40",
                                onClick: () => p(!1)
                            }), e.jsx(N.div, {
                                initial: {
                                    opacity: 0,
                                    y: -4
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                exit: {
                                    opacity: 0,
                                    y: -4
                                },
                                className: "absolute right-0 top-full mt-1 w-[min(10rem,calc(100vw-1.5rem))] bg-[#18181b] border border-white/10 rounded-xl shadow-2xl z-[50] p-1",
                                children: ["all", "completed", "incomplete"].map(o => e.jsx("button", {
                                    onClick: () => {
                                        K(o), p(!1)
                                    },
                                    className: `w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors ${I===o?"bg-emerald-500/10 text-emerald-400":"text-zinc-400 hover:bg-white/5 hover:text-zinc-200"}`,
                                    children: o === "all" ? "All" : o.charAt(0).toUpperCase() + o.slice(1)
                                }, o))
                            })]
                        })
                    })]
                })]
            }), e.jsx("div", {
                className: "relative overflow-x-auto overscroll-x-contain custom-scrollbar rounded-xl border border-white/5 bg-[#09090b]/80 backdrop-blur-2xl shadow-xl",
                children: e.jsxs("table", {
                    className: "w-full min-w-[720px] text-sm",
                    children: [e.jsx("thead", {
                        children: e.jsxs("tr", {
                            className: "border-b border-white/5 bg-[#09090b]",
                            children: [e.jsx("th", {
                                className: "sticky top-0 left-0 z-40 w-10 border-r border-white/5 bg-[#09090b]/95 px-2 py-4 text-center text-[11px] font-extrabold uppercase tracking-widest text-zinc-500 backdrop-blur",
                                children: "#"
                            }), e.jsx("th", {
                                className: "sticky top-0 left-[2.5rem] z-40 min-w-[160px] border-r border-white/5 bg-[#09090b]/95 px-4 py-4 text-left text-[11px] font-extrabold uppercase tracking-widest text-zinc-500 backdrop-blur sm:min-w-[300px] lg:shadow-[4px_0_12px_rgba(0,0,0,0.5)]",
                                children: "Chapter / Topics"
                            }), S.map(o => {
                                const g = Pe(o.color);
                                return e.jsx("th", {
                                    className: "group/th sticky top-0 z-30 min-w-[120px] border-r border-white/5 bg-[#09090b]/95 px-4 py-4 text-center backdrop-blur",
                                    children: e.jsxs("div", {
                                        className: "flex items-center justify-center gap-2 group",
                                        children: [e.jsxs("div", {
                                            className: `flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all shadow-md group-hover/th:scale-105 duration-300 ${g.bg} ${g.text} ${g.border}`,
                                            children: [o.icon && e.jsx("span", {
                                                className: "text-base group-hover:rotate-12 transition-transform",
                                                children: o.icon
                                            }), e.jsx("span", {
                                                className: "text-[10px] font-black uppercase tracking-wider",
                                                children: o.name
                                            })]
                                        }), e.jsx("button", {
                                            ref: $ => {
                                                L.current[o.id] = $
                                            },
                                            onClick: () => {
                                                z ?.colId === o.id ? F() : Z(o.id)
                                            },
                                            className: "p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-white/10 text-zinc-600 hover:text-zinc-300 transition-all",
                                            children: e.jsx(at, {
                                                className: "w-3 h-3"
                                            })
                                        })]
                                    })
                                }, o.id)
                            }), e.jsx("th", {
                                className: "sticky top-0 z-30 min-w-[120px] sm:min-w-[150px] border-r border-white/5 bg-[#09090b]/95 px-4 py-4 text-center text-[11px] font-extrabold uppercase tracking-widest text-zinc-500 backdrop-blur",
                                children: e.jsx("div", {
                                    className: "flex items-center justify-center gap-1",
                                    children: "Priority / Status"
                                })
                            })]
                        })
                    }), e.jsx("tbody", {
                        children: k.length === 0 ? e.jsx("tr", {
                            children: e.jsx("td", {
                                colSpan: S.length + 3,
                                className: "text-center py-12 text-zinc-600",
                                children: M || v !== "all" || I !== "all" ? "No chapters match your filters" : "No chapters in this subject"
                            })
                        }) : e.jsx(xt, {
                            sensors: X,
                            collisionDetection: mt,
                            onDragEnd: ee,
                            children: e.jsx(ht, {
                                items: k.map(o => o.id),
                                strategy: pt,
                                children: k.map((o, g) => e.jsx(es, {
                                    subject: r,
                                    chapter: o,
                                    index: g,
                                    sortedColumns: S,
                                    config: y,
                                    questionsStats: J,
                                    studyTimeByChapter: h,
                                    studyTimeByTopic: m,
                                    chapterDragDisabled: G,
                                    highlightedChapterId: t,
                                    highlightedTopicId: s,
                                    onScheduleChapter: x,
                                    onScheduleTopic: c
                                }, o.id))
                            })
                        })
                    })]
                })
            }), Ye.createPortal(e.jsx(Y, {
                children: z && e.jsxs(e.Fragment, {
                    children: [e.jsx("div", {
                        className: "fixed inset-0 z-[9998]",
                        onClick: F
                    }), e.jsxs(N.div, {
                        initial: {
                            opacity: 0,
                            scale: .95,
                            y: -4
                        },
                        animate: {
                            opacity: 1,
                            scale: 1,
                            y: 0
                        },
                        exit: {
                            opacity: 0,
                            scale: .95,
                            y: -4
                        },
                        transition: {
                            duration: .12
                        },
                        style: z.style,
                        className: "z-[9999] w-44 bg-[#18181b] border border-white/10 rounded-xl shadow-2xl p-1",
                        children: [e.jsxs("button", {
                            onClick: () => {
                                R(r.id, z.colId, Q, !0), F()
                            },
                            className: "w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:bg-white/5 flex items-center gap-2",
                            children: [e.jsx(He, {
                                className: "w-3.5 h-3.5 text-emerald-400"
                            }), "Check All"]
                        }), e.jsxs("button", {
                            onClick: () => {
                                R(r.id, z.colId, Q, !1), F()
                            },
                            className: "w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:bg-white/5 flex items-center gap-2",
                            children: [e.jsx(Dt, {
                                className: "w-3.5 h-3.5 text-amber-400"
                            }), "Uncheck All"]
                        })]
                    })]
                })
            }), document.body), k.length > 0 && e.jsxs("div", {
                className: "flex items-center justify-between px-2 text-xs text-zinc-600",
                children: [e.jsxs("span", {
                    children: ["Showing ", k.length, " of ", r.chapters.length, " chapters"]
                }), e.jsx("span", {
                    children: G ? "Clear filters to reorder chapters" : `${S.length} tracking columns`
                })]
            })]
        })
    },
    rs = ({
        isOpen: r,
        onClose: t,
        columns: s,
        onAddColumn: h,
        onRemoveColumn: m,
        onUpdateColumn: x,
        onReorderColumns: c,
        onApplyToAll: C,
        canApplyToAll: R = !1
    }) => {
        const [j, u] = l.useState(!1), [y, S] = l.useState(""), [D, M] = l.useState(""), [P, v] = l.useState("brand"), [d, I] = l.useState("check"), [K, q] = l.useState("4"), [b, B] = l.useState(null), [p, z] = l.useState(""), [A, L] = l.useState(""), [Z, F] = l.useState("brand"), [X, J] = l.useState("check"), [k, Q] = l.useState("4"), [G, ee] = l.useState([]);
        l.useEffect(() => {
            ee([...s].sort((i, O) => i.order - O.order).map(i => i.id))
        }, [s, r]);
        const o = () => {
                if (!y.trim()) return;
                const i = Number.parseInt(K, 10);
                h(y.trim(), P, D.trim() || void 0, d, d === "count" && i > 0 ? i : null), S(""), M("");
                const O = ["emerald", "amber", "violet", "cyan", "rose", "orange", "sky", "indigo", "lime", "pink", "teal", "fuchsia"],
                    W = (O.indexOf(P) + 1) % O.length;
                v(O[W]), u(!1)
            },
            g = i => {
                B(i.id), z(i.name), L(i.icon || ""), F(i.color || "emerald"), J(i.trackingMode || "check"), Q(i.targetCount ? String(i.targetCount) : "4")
            },
            $ = () => {
                if (b && p.trim()) {
                    const i = Number.parseInt(k, 10);
                    x(b, {
                        name: p.trim(),
                        icon: A.trim() || void 0,
                        color: Z,
                        trackingMode: X,
                        targetCount: X === "count" && i > 0 ? i : null
                    })
                }
                B(null)
            },
            T = i => {
                S(i.name), M(i.icon), v(i.color), u(!0)
            },
            _ = G.map(i => s.find(O => O.id === i)).filter(Boolean);
        return e.jsx(Y, {
            children: r && e.jsxs("div", {
                className: "fixed inset-0 z-[100] flex items-center justify-center p-4",
                children: [e.jsx(N.div, {
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    exit: {
                        opacity: 0
                    },
                    onClick: t,
                    className: "absolute inset-0 bg-black/70 backdrop-blur-md"
                }), e.jsxs(N.div, {
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
                    className: "relative w-full max-w-lg bg-[#0c0c0e] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]",
                    children: [e.jsxs("div", {
                        className: "flex items-center justify-between p-6 border-b border-white/5 bg-white/5",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-4",
                            children: [e.jsx("div", {
                                className: "w-12 h-12 rounded-2xl bg-brand-500/20 flex items-center justify-center",
                                children: e.jsx(It, {
                                    className: "w-6 h-6 text-brand-400"
                                })
                            }), e.jsxs("div", {
                                children: [e.jsx("h3", {
                                    className: "text-xl font-black text-white tracking-tight",
                                    children: "Syllabus Columns"
                                }), e.jsx("p", {
                                    className: "text-xs text-zinc-500 font-medium",
                                    children: "Customize your tracking workflow"
                                })]
                            })]
                        }), e.jsx("button", {
                            onClick: t,
                            className: "w-10 h-10 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-all flex items-center justify-center border border-white/5",
                            children: e.jsx(be, {
                                className: "w-5 h-5"
                            })
                        })]
                    }), e.jsxs("div", {
                        className: "flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8",
                        children: [!j && !b && e.jsxs("div", {
                            children: [e.jsxs("div", {
                                className: "flex items-center gap-2 mb-4",
                                children: [e.jsx(je, {
                                    className: "w-4 h-4 text-amber-400"
                                }), e.jsx("span", {
                                    className: "text-xs font-bold text-zinc-400 uppercase tracking-widest",
                                    children: "Quick Picks"
                                })]
                            }), e.jsx("div", {
                                className: "flex flex-wrap gap-2",
                                children: Kt.map(i => e.jsxs("button", {
                                    onClick: () => T(i),
                                    className: "px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5 hover:border-brand-500/30 hover:bg-brand-500/5 text-zinc-400 hover:text-white transition-all flex items-center gap-2 text-sm font-bold group",
                                    children: [e.jsx("span", {
                                        className: "text-base group-hover:scale-125 transition-transform",
                                        children: i.icon
                                    }), i.name]
                                }, i.name))
                            })]
                        }), e.jsx(Y, {
                            mode: "wait",
                            children: (j || b) && e.jsxs(N.div, {
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
                                className: "p-5 rounded-3xl bg-white/[0.03] border border-white/5 space-y-5",
                                children: [e.jsxs("div", {
                                    className: "flex items-center justify-between mb-2",
                                    children: [e.jsxs("span", {
                                        className: "text-sm font-black text-white flex items-center gap-2",
                                        children: [b ? e.jsx(Ee, {
                                            className: "w-4 h-4 text-brand-400"
                                        }) : e.jsx(V, {
                                            className: "w-4 h-4 text-emerald-400"
                                        }), b ? "Edit Column" : "Add New Column"]
                                    }), e.jsx("button", {
                                        onClick: () => {
                                            u(!1), B(null)
                                        },
                                        className: "text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest",
                                        children: "Cancel"
                                    })]
                                }), e.jsxs("div", {
                                    className: "grid grid-cols-4 gap-4",
                                    children: [e.jsxs("div", {
                                        className: "col-span-3",
                                        children: [e.jsx("label", {
                                            className: "text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2 px-1",
                                            children: "Column Name"
                                        }), e.jsx("input", {
                                            autoFocus: !0,
                                            value: b ? p : y,
                                            onChange: i => b ? z(i.target.value) : S(i.target.value),
                                            placeholder: "e.g. 2026 PYQs",
                                            className: "w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold placeholder-zinc-700 focus:outline-none focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10 transition-all"
                                        })]
                                    }), e.jsxs("div", {
                                        className: "col-span-1",
                                        children: [e.jsx("label", {
                                            className: "text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2 px-1 text-center",
                                            children: "Icon"
                                        }), e.jsx("input", {
                                            value: b ? A : D,
                                            onChange: i => b ? L(i.target.value) : M(i.target.value),
                                            placeholder: "📌",
                                            className: "w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-center text-xl focus:outline-none focus:border-brand-500/50 transition-all"
                                        })]
                                    })]
                                }), e.jsxs("div", {
                                    children: [e.jsx("label", {
                                        className: "text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-3 px-1",
                                        children: "Theme Color"
                                    }), e.jsx("div", {
                                        className: "flex flex-wrap gap-2",
                                        children: Ae.map(i => e.jsx("button", {
                                            onClick: () => b ? F(i.value) : v(i.value),
                                            className: `w-9 h-9 rounded-xl transition-all relative ${i.checkBg} ${(b?Z:P)===i.value?"ring-2 ring-white ring-offset-4 ring-offset-[#0c0c0e] scale-110":"opacity-40 hover:opacity-100 hover:scale-105"}`,
                                            children: (b ? Z : P) === i.value && e.jsx(we, {
                                                className: "w-4 h-4 text-white absolute inset-0 m-auto"
                                            })
                                        }, i.value))
                                    })]
                                }), e.jsxs("div", {
                                    className: "space-y-3",
                                    children: [e.jsx("label", {
                                        className: "text-[10px] font-bold text-zinc-500 uppercase tracking-widest block px-1",
                                        children: "Tracking"
                                    }), e.jsx("div", {
                                        className: "grid grid-cols-2 gap-2",
                                        children: [{
                                            value: "check",
                                            label: "Single Tick",
                                            hint: "Done or pending"
                                        }, {
                                            value: "count",
                                            label: "Counter",
                                            hint: "Repeatable reps"
                                        }].map(i => {
                                            const O = (b ? X : d) === i.value;
                                            return e.jsxs("button", {
                                                type: "button",
                                                onClick: () => b ? J(i.value) : I(i.value),
                                                className: `rounded-2xl border px-3 py-3 text-left transition-all ${O?"border-brand-500/40 bg-brand-500/10 text-white":"border-white/5 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.05]"}`,
                                                children: [e.jsxs("span", {
                                                    className: "flex items-center gap-2 text-xs font-black",
                                                    children: [i.value === "count" ? e.jsx(Ue, {
                                                        className: "h-3.5 w-3.5"
                                                    }) : e.jsx(we, {
                                                        className: "h-3.5 w-3.5"
                                                    }), i.label]
                                                }), e.jsx("span", {
                                                    className: "mt-1 block text-[10px] font-medium text-zinc-500",
                                                    children: i.hint
                                                })]
                                            }, i.value)
                                        })
                                    }), (b ? X : d) === "count" && e.jsxs("div", {
                                        className: "grid grid-cols-[1fr_auto] items-end gap-3 rounded-2xl border border-white/5 bg-black/20 p-3",
                                        children: [e.jsxs("div", {
                                            children: [e.jsx("label", {
                                                className: "block px-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500",
                                                children: "Target Reps"
                                            }), e.jsx("p", {
                                                className: "mt-1 px-1 text-[10px] font-medium text-zinc-600",
                                                children: "Leave blank for an unlimited counter."
                                            })]
                                        }), e.jsx("input", {
                                            type: "number",
                                            min: 1,
                                            value: b ? k : K,
                                            onChange: i => b ? Q(i.target.value) : q(i.target.value),
                                            placeholder: "Any",
                                            className: "w-20 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center text-sm font-black text-white outline-none transition-all focus:border-brand-500/50"
                                        })]
                                    })]
                                }), e.jsxs("button", {
                                    onClick: b ? $ : o,
                                    disabled: b ? !p.trim() : !y.trim(),
                                    className: `w-full py-4 rounded-2xl font-black text-white flex items-center justify-center gap-3 transition-all ${b?"bg-brand-600 hover:bg-brand-500":"bg-emerald-600 hover:bg-emerald-500"} disabled:opacity-40 shadow-lg shadow-black/20`,
                                    children: [b ? e.jsx(we, {
                                        className: "w-5 h-5"
                                    }) : e.jsx(V, {
                                        className: "w-5 h-5"
                                    }), b ? "Save Changes" : "Create Column"]
                                })]
                            })
                        }), e.jsxs("div", {
                            className: "space-y-4",
                            children: [e.jsxs("div", {
                                className: "flex items-center justify-between mb-2 px-1",
                                children: [e.jsxs("div", {
                                    className: "flex items-center gap-2",
                                    children: [e.jsx("span", {
                                        className: "text-[10px] font-extrabold text-zinc-500 uppercase tracking-[0.2em]",
                                        children: "Active Columns"
                                    }), e.jsx("span", {
                                        className: "px-1.5 py-0.5 rounded-md bg-white/5 text-zinc-400 text-[10px] font-black",
                                        children: s.length
                                    })]
                                }), e.jsxs("div", {
                                    className: "flex items-center gap-3",
                                    children: [R && C && !j && !b && s.length > 0 && e.jsxs("button", {
                                        onClick: C,
                                        className: "text-[10px] font-bold text-emerald-400 hover:text-emerald-300 uppercase tracking-widest flex items-center gap-1.5 transition-colors",
                                        children: [e.jsx(Ot, {
                                            className: "w-3 h-3"
                                        }), " Apply To All"]
                                    }), !j && !b && e.jsxs("button", {
                                        onClick: () => u(!0),
                                        className: "text-[10px] font-bold text-brand-400 hover:text-brand-300 uppercase tracking-widest flex items-center gap-1.5 transition-colors",
                                        children: [e.jsx(V, {
                                            className: "w-3 h-3"
                                        }), " New"]
                                    })]
                                })]
                            }), e.jsx(Ct, {
                                axis: "y",
                                values: G,
                                onReorder: i => {
                                    ee(i), c(i)
                                },
                                className: "space-y-3",
                                children: _.map(i => {
                                    const O = Pe(i.color);
                                    return e.jsxs(St, {
                                        value: i.id,
                                        className: "group relative flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all cursor-grab active:cursor-grabbing",
                                        children: [e.jsx(Ne, {
                                            className: "w-4 h-4 text-zinc-700 group-hover:text-zinc-500 transition-colors shrink-0"
                                        }), e.jsx("div", {
                                            className: `w-10 h-10 rounded-xl ${O.bg} ${O.text} border ${O.border} flex items-center justify-center text-lg shrink-0`,
                                            children: i.icon || "📌"
                                        }), e.jsxs("div", {
                                            className: "flex-1 min-w-0",
                                            children: [e.jsx("span", {
                                                className: `text-sm font-black tracking-tight ${O.text}`,
                                                children: i.name
                                            }), i.trackingMode === "count" && e.jsxs("span", {
                                                className: "mt-1 inline-flex w-fit items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold text-zinc-500",
                                                children: [e.jsx(Ue, {
                                                    className: "h-3 w-3"
                                                }), i.targetCount && i.targetCount > 0 ? `0/${i.targetCount} reps` : "unlimited reps"]
                                            })]
                                        }), e.jsxs("div", {
                                            className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0",
                                            children: [e.jsx("button", {
                                                onClick: () => g(i),
                                                className: "p-2 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-all underline decoration-zinc-800 decoration-2",
                                                children: e.jsx(Ee, {
                                                    className: "w-4 h-4"
                                                })
                                            }), e.jsx("button", {
                                                onClick: () => {
                                                    s.length > 1 && window.confirm(`Delete "${i.name}"? This will clear all checkmarks in this column.`) && m(i.id)
                                                },
                                                disabled: s.length <= 1,
                                                className: "p-2 rounded-lg hover:bg-rose-500/10 text-zinc-500 hover:text-rose-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed",
                                                children: e.jsx(et, {
                                                    className: "w-4 h-4"
                                                })
                                            })]
                                        })]
                                    }, i.id)
                                })
                            })]
                        })]
                    }), e.jsxs("div", {
                        className: "p-4 bg-white/5 border-t border-white/5 flex items-center justify-center gap-2",
                        children: [e.jsx(Rt, {
                            className: "w-3.5 h-3.5 text-zinc-500"
                        }), e.jsx("p", {
                            className: "text-[10px] text-zinc-500 font-bold uppercase tracking-widest text-center",
                            children: "Drag columns to reorder your syllabus view"
                        })]
                    })]
                })]
            })
        })
    },
    as = ({
        onCreateSubject: r,
        onLoadTemplate: t
    }) => e.jsx("div", {
        className: "flex-1 flex items-center justify-center p-8",
        children: e.jsxs(N.div, {
            initial: {
                opacity: 0,
                y: 30
            },
            animate: {
                opacity: 1,
                y: 0
            },
            transition: {
                duration: .6,
                ease: [.22, 1, .36, 1]
            },
            className: "max-w-md w-full text-center",
            children: [e.jsxs(N.div, {
                initial: {
                    scale: .8
                },
                animate: {
                    scale: 1
                },
                transition: {
                    delay: .2,
                    type: "spring",
                    stiffness: 200
                },
                className: "w-28 h-28 mx-auto mb-8 relative",
                children: [e.jsx("div", {
                    className: "absolute inset-0 bg-gradient-to-br from-brand-500/20 to-emerald-500/20 rounded-3xl blur-2xl"
                }), e.jsx("div", {
                    className: "relative w-full h-full bg-gradient-to-br from-brand-500/10 to-emerald-500/10 rounded-3xl border border-brand-500/20 flex items-center justify-center backdrop-blur-sm",
                    children: e.jsx(At, {
                        className: "w-14 h-14 text-brand-500"
                    })
                }), e.jsx(N.div, {
                    animate: {
                        rotate: 360
                    },
                    transition: {
                        duration: 20,
                        repeat: 1 / 0,
                        ease: "linear"
                    },
                    className: "absolute -top-2 -right-2 w-8 h-8 bg-emerald-500/20 rounded-lg border border-emerald-500/30 flex items-center justify-center",
                    children: e.jsx(je, {
                        className: "w-4 h-4 text-emerald-400"
                    })
                })]
            }), e.jsx("h2", {
                className: "text-3xl font-bold text-zinc-900 dark:text-white mb-3",
                children: "No Subjects Yet"
            }), e.jsx("p", {
                className: "text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed",
                children: "Create your first subject or load a template to start tracking your syllabus with custom columns and checkmarks."
            }), e.jsxs("div", {
                className: "flex flex-col sm:flex-row gap-3 justify-center",
                children: [e.jsxs(N.button, {
                    whileHover: {
                        scale: 1.05
                    },
                    whileTap: {
                        scale: .95
                    },
                    onClick: r,
                    className: "px-8 py-3.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white rounded-xl font-bold shadow-lg shadow-brand-900/20 transition-all flex items-center justify-center gap-2",
                    children: [e.jsx(V, {
                        className: "w-5 h-5"
                    }), "Create Subject"]
                }), e.jsxs(N.button, {
                    whileHover: {
                        scale: 1.05
                    },
                    whileTap: {
                        scale: .95
                    },
                    onClick: t,
                    className: "px-8 py-3.5 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white rounded-xl font-bold hover:bg-zinc-50 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2",
                    children: [e.jsx(je, {
                        className: "w-5 h-5 text-emerald-500"
                    }), "Load Template"]
                })]
            })]
        })
    }),
    Ds = ({
        isDark: r,
        toggleTheme: t
    }) => {
        const [s, h] = Ut(), [m, x] = l.useState("Syllabus"), {
            subjects: c,
            addChapter: C,
            reorderSubjects: R
        } = le(), {
            getOrCreateConfig: j,
            hasColumnsConfigured: u,
            addColumn: y,
            removeColumn: S,
            updateColumn: D,
            reorderColumns: M,
            applyColumnsToSubjects: P,
            getProgress: v
        } = pe(), [d, I] = l.useState(null), [K, q] = l.useState(null), [b, B] = l.useState(!1), [p, z] = l.useState(!1), [A, L] = l.useState(!1), [Z, F] = l.useState(!1), [X, J] = l.useState(!1), [k, Q] = l.useState(void 0), [G, ee] = l.useState(null), [o, g] = l.useState(null), $ = l.useRef(null), T = s.get("subjectId"), _ = s.get("chapterId"), i = s.get("topicId"), O = d && !u(d.id);
        l.useEffect(() => {
            if (O && d) {
                const a = setTimeout(() => {
                    F(!0)
                }, 500);
                return () => clearTimeout(a)
            }
        }, [O, d]), l.useEffect(() => {
            if (c.length === 0) {
                I(null);
                return
            }
            if (T) {
                const a = c.find(f => f.id === T);
                if (a) {
                    d ?.id !== a.id && I(a);
                    return
                }
            }
            d || I(c[0])
        }, [T, c]), l.useEffect(() => {
            if (!d) return;
            const a = c.find(f => f.id === d.id);
            a && a !== d ? I(a) : a || I(c[0] ?? null)
        }, [d, c]);
        const W = a => {
                I(a);
                const f = new URLSearchParams(s);
                f.set("subjectId", a.id), h(f)
            },
            ue = a => ee(a),
            ke = (a, f) => {
                a.preventDefault(), g(f)
            },
            Ce = (a, f) => {
                if (a.preventDefault(), !G || G === f) {
                    ee(null), g(null);
                    return
                }
                const w = c.map(U => U.id),
                    re = w.indexOf(G),
                    de = w.indexOf(f),
                    ne = [...w];
                ne.splice(re, 1), ne.splice(de, 0, G), R(ne), ee(null), g(null)
            },
            Se = () => {
                ee(null), g(null)
            },
            ge = a => {
                Q(a), J(!0)
            },
            te = d ? j(d.id) : null,
            ze = d ? d.chapters.map(a => a.id) : [],
            Te = d ? v(d.id, ze) : {
                percent: 0
            },
            fe = ut(a => a.sessions),
            oe = Array.isArray(fe) ? fe : [],
            ce = l.useMemo(() => {
                const a = {};
                for (const f of oe)
                    if (f.questionsBySubject)
                        for (const [w, re] of Object.entries(f.questionsBySubject)) a[w] = (a[w] ?? 0) + (re.attempted ?? 0);
                    else if (f.questionsAttempted && f.questionsAttempted > 0) {
                    const w = f.subjectIds ?.[0] ?? f.subjectId;
                    w && (a[w] = (a[w] ?? 0) + f.questionsAttempted)
                }
                return a
            }, [oe]),
            ie = l.useMemo(() => Qt(oe, c), [oe, c]),
            se = l.useMemo(() => c.map(a => {
                const f = a.chapters.map(re => re.id),
                    w = v(a.id, f);
                return {
                    subject: a,
                    progress: w
                }
            }), [c, v, pe.getState().configs]),
            H = l.useMemo(() => {
                const a = se.reduce((f, w) => (f.checked += w.progress.checked, f.total += w.progress.total, f), {
                    checked: 0,
                    total: 0
                });
                return { ...a,
                    totalChapters: c.reduce((f, w) => f + w.chapters.length, 0),
                    percent: a.total > 0 ? Math.round(a.checked / a.total * 100) : 0
                }
            }, [se, c]);
        return c.length === 0 ? e.jsxs("div", {
            className: "h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-white flex overflow-hidden",
            children: [e.jsx(Le, {
                activeTab: m,
                setActiveTab: x,
                isDark: r,
                toggleTheme: t,
                mobileMenuOpen: b,
                setMobileMenuOpen: B
            }), e.jsxs("main", {
                className: "flex-1 relative flex flex-col h-screen overflow-hidden",
                children: [e.jsx(Fe, {
                    activeTab: m,
                    mobileMenuOpen: b,
                    setMobileMenuOpen: B
                }), e.jsx(as, {
                    onCreateSubject: () => z(!0),
                    onLoadTemplate: () => L(!0)
                })]
            }), e.jsx(Qe, {
                isOpen: p,
                onClose: () => z(!1),
                subjectToEdit: null
            }), e.jsx(Ge, {
                isOpen: A,
                onClose: () => L(!1),
                isDark: r
            })]
        }) : e.jsxs("div", {
            className: "app-shell h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-white flex overflow-hidden selection:bg-brand-500/30",
            children: [e.jsxs("div", {
                className: "app-ambient fixed inset-0 z-0 pointer-events-none opacity-20 dark:opacity-100",
                children: [e.jsx("div", {
                    className: "absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[120px]"
                }), e.jsx("div", {
                    className: "absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]"
                })]
            }), e.jsx(Le, {
                activeTab: m,
                setActiveTab: x,
                isDark: r,
                toggleTheme: t,
                mobileMenuOpen: b,
                setMobileMenuOpen: B
            }), e.jsxs("main", {
                className: "app-main-shell flex-1 relative flex flex-col h-screen overflow-hidden bg-transparent",
                children: [e.jsx(Fe, {
                    activeTab: m,
                    mobileMenuOpen: b,
                    setMobileMenuOpen: B
                }), e.jsxs("div", {
                    className: "flex-1 overflow-y-auto density-app-shell-x pt-[var(--density-page-y-lg)] lg:pt-0 custom-scrollbar safe-bottom",
                    children: [e.jsxs("div", {
                        className: "density-wide-width mt-6 density-stack",
                        children: [e.jsx(N.div, {
                            initial: {
                                opacity: 0,
                                y: 10
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5",
                            children: e.jsxs("div", {
                                children: [e.jsx("h2", {
                                    className: "text-2xl font-semibold tracking-tight text-white",
                                    children: "Syllabus"
                                }), e.jsxs("div", {
                                    className: "mt-2 flex items-center gap-3 text-sm text-zinc-400",
                                    children: [e.jsxs("span", {
                                        className: "flex items-center gap-1.5",
                                        children: [e.jsx(Ke, {
                                            className: "w-3.5 h-3.5"
                                        }), " ", c.length, " subjects"]
                                    }), e.jsx("span", {
                                        className: "w-1 h-1 rounded-full bg-zinc-700"
                                    }), e.jsxs("span", {
                                        className: "flex items-center gap-1.5",
                                        children: [e.jsx(Xe, {
                                            className: "w-3.5 h-3.5"
                                        }), " ", H.totalChapters, " chapters"]
                                    }), e.jsx("span", {
                                        className: "w-1 h-1 rounded-full bg-zinc-700"
                                    }), e.jsxs("span", {
                                        className: "flex items-center gap-1.5",
                                        children: [e.jsx(_t, {
                                            className: "w-3.5 h-3.5 text-amber-400"
                                        }), " ", H.percent, "% overall"]
                                    })]
                                })]
                            })
                        }), e.jsx(N.div, {
                            initial: {
                                opacity: 0,
                                y: 6
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            transition: {
                                delay: .08
                            },
                            className: "relative",
                            children: e.jsxs("div", {
                                ref: $,
                                className: "flex items-center gap-2 overflow-x-auto pb-1",
                                style: {
                                    scrollbarWidth: "none",
                                    msOverflowStyle: "none"
                                },
                                children: [se.map(({
                                    subject: a,
                                    progress: f
                                }) => {
                                    const w = d ?.id === a.id,
                                        re = G === a.id,
                                        de = o === a.id && G !== a.id,
                                        ne = Me(a.gradient, "to right");
                                    return e.jsxs("div", {
                                        draggable: !0,
                                        role: "button",
                                        tabIndex: 0,
                                        "aria-label": `${a.name} ${a.chapters.length} chapters`,
                                        onDragStart: () => ue(a.id),
                                        onDragOver: U => ke(U, a.id),
                                        onDrop: U => Ce(U, a.id),
                                        onDragEnd: Se,
                                        onClick: () => W(a),
                                        onKeyDown: U => {
                                            (U.key === "Enter" || U.key === " ") && (U.preventDefault(), W(a))
                                        },
                                        className: ["relative group/pill flex-shrink-0 flex items-center gap-2 px-3.5 py-2.5 rounded-2xl", "border cursor-pointer select-none transition-all duration-200", w ? "text-white border-transparent shadow-lg shadow-black/30" : "border-white/[0.08] bg-white/[0.025] text-zinc-400 hover:border-white/[0.15] hover:bg-white/[0.05] hover:text-zinc-200", re ? "opacity-30 scale-[0.94]" : "", de ? "border-brand-400/60 bg-brand-500/10 scale-[1.04]" : ""].join(" "),
                                        style: w ? {
                                            backgroundImage: ne
                                        } : {},
                                        children: [e.jsx(Ne, {
                                            className: `w-3 h-3 shrink-0 transition-opacity ${w?"opacity-40 text-white":"opacity-0 group-hover/pill:opacity-50 text-zinc-500"}`
                                        }), e.jsx("div", {
                                            className: `w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${w?"bg-white/25":"bg-white/[0.06]"}`,
                                            children: e.jsx(Ve, {
                                                icon: a.icon,
                                                name: a.name,
                                                className: w ? "text-white" : "text-zinc-400",
                                                size: "sm"
                                            })
                                        }), e.jsx("span", {
                                            className: "text-sm font-semibold whitespace-nowrap tracking-tight",
                                            children: a.name
                                        }), f.total > 0 && e.jsxs("span", {
                                            className: `text-[10px] font-black tabular-nums px-1.5 py-0.5 rounded-md ${w?"bg-white/25 text-white":f.percent>=80?"bg-emerald-500/15 text-emerald-400":f.percent>=45?"bg-amber-500/15 text-amber-400":"bg-zinc-700/60 text-zinc-400"}`,
                                            children: [f.percent, "%"]
                                        }), e.jsx("span", {
                                            className: `w-0.5 h-0.5 rounded-full shrink-0 ${w?"bg-white/40":"bg-zinc-600"}`
                                        }), (ie.bySubject[a.id] ?? 0) > 0 && e.jsx("span", {
                                            className: `text-[10px] font-semibold tabular-nums whitespace-nowrap ${w?"text-white/70":"text-zinc-500"}`,
                                            children: ie.bySubject[a.id] >= 60 ? `${Math.floor(ie.bySubject[a.id]/60)}h${ie.bySubject[a.id]%60>0?` ${ie.bySubject[a.id]%60}m`:""}` : `${ie.bySubject[a.id]}m`
                                        }), (ce[a.id] ?? 0) > 0 && e.jsxs("span", {
                                            className: `text-[10px] font-semibold tabular-nums whitespace-nowrap ${w?"text-white/70":"text-zinc-500"}`,
                                            children: ["· ", ce[a.id], "q"]
                                        }), w && e.jsx("span", {
                                            className: "w-1.5 h-1.5 rounded-full bg-white/50 shrink-0"
                                        })]
                                    }, a.id)
                                }), c.length > 0 && e.jsx("div", {
                                    className: "w-px self-stretch bg-white/5 mx-1 shrink-0"
                                }), e.jsx("button", {
                                    onClick: () => {
                                        q(null), z(!0)
                                    },
                                    title: "Add Subject",
                                    className: "flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border border-dashed border-white/[0.12] text-zinc-500 hover:border-brand-400/50 hover:text-brand-300 hover:bg-brand-500/[0.08] transition-all",
                                    children: e.jsx(V, {
                                        className: "w-4 h-4"
                                    })
                                })]
                            })
                        }), d && te && e.jsxs(N.div, {
                            initial: {
                                opacity: 0,
                                y: 20
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            transition: {
                                duration: .4
                            },
                            className: "space-y-6",
                            children: [te.columns.length === 0 && e.jsx("div", {
                                className: "mb-6 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-brand-500/10 via-violet-500/10 to-amber-500/10 border border-brand-500/20",
                                children: e.jsxs("div", {
                                    className: "flex flex-col sm:flex-row items-start gap-4",
                                    children: [e.jsx("div", {
                                        className: "w-12 h-12 rounded-2xl bg-brand-500/20 flex items-center justify-center shrink-0",
                                        children: e.jsx(je, {
                                            className: "w-6 h-6 text-brand-400"
                                        })
                                    }), e.jsxs("div", {
                                        className: "flex-1",
                                        children: [e.jsx("h3", {
                                            className: "text-lg font-black text-white mb-1",
                                            children: "Set Up Your Syllabus Columns"
                                        }), e.jsx("p", {
                                            className: "text-sm text-zinc-400 mb-4",
                                            children: "Create tracking columns to monitor your study progress. You can add columns like NCERT, PYQs, Revision, Notes, and more."
                                        }), e.jsxs("button", {
                                            onClick: () => F(!0),
                                            className: "px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-sm transition-all flex items-center gap-2",
                                            children: [e.jsx(V, {
                                                className: "w-4 h-4"
                                            }), "Add Your First Column"]
                                        })]
                                    })]
                                })
                            }), e.jsx(Wt, {
                                subject: d,
                                chapterCount: d.chapters.length,
                                columnCount: te.columns.length,
                                progressPercent: Te.percent,
                                onEditColumns: () => F(!0),
                                onAddMaterial: () => F(!0),
                                onAddChapter: () => {
                                    const a = prompt("Enter new chapter title:");
                                    a && C(d.id, a)
                                },
                                onEditSubject: () => {
                                    q(d), z(!0)
                                }
                            }), e.jsx(ss, {
                                subject: d,
                                highlightedChapterId: _,
                                highlightedTopicId: i,
                                studyTimeByChapter: ie.byChapter,
                                studyTimeByTopic: ie.byTopic,
                                onScheduleChapter: ge,
                                onScheduleTopic: ge
                            })]
                        }, d.id)]
                    }), e.jsx("div", {
                        className: "w-full mt-8 pointer-events-none select-none overflow-hidden leading-none",
                        children: e.jsx("div", {
                            className: "text-[10vw] sm:text-[14vw] md:text-[18vw] lg:text-[20vw] xl:text-[22vw] font-display font-bold text-black/[0.03] dark:text-white/[0.03] whitespace-nowrap text-center tracking-tight",
                            children: "ISOTOPEAI"
                        })
                    })]
                })]
            }), e.jsx(Qe, {
                isOpen: p,
                onClose: () => {
                    z(!1), q(null)
                },
                subjectToEdit: K
            }), e.jsx(Ge, {
                isOpen: A,
                onClose: () => L(!1),
                isDark: r
            }), d && te && e.jsx(rs, {
                isOpen: Z,
                onClose: () => F(!1),
                columns: te.columns,
                onAddColumn: (a, f, w, re, de) => y(d.id, a, f, w, re, de),
                onRemoveColumn: a => S(d.id, a),
                onUpdateColumn: (a, f) => D(d.id, a, f),
                onReorderColumns: a => M(d.id, a),
                onApplyToAll: () => {
                    const a = c.filter(w => w.id !== d.id).map(w => w.id);
                    a.length === 0 || a.filter(w => u(w)).length > 0 && !window.confirm("Apply these columns to all other subjects? Existing syllabus columns in those subjects will be replaced.") || P(d.id, a)
                },
                canApplyToAll: c.length > 1
            }), e.jsx(qt, {
                isOpen: X,
                onClose: () => {
                    J(!1), Q(void 0)
                },
                initialData: k
            })]
        })
    };
export {
    Ds as
    default
};