import {
    r as g,
    j as e,
    f as gt,
    b as ft
} from "./vendor-react-BfU3Zn2J.js";
import {
    S as Oe,
    D as wt
} from "./DashboardHeader-DNuRMna8.js";
import {
    v as jt,
    s as vt,
    t as Je,
    x as Nt,
    u as te,
    f as Ze,
    g as J,
    p as _,
    k as oe,
    j as et,
    h as tt,
    D as yt,
    o as kt
} from "./useFocusStore-CX_Nyp1h.js";
import {
    h as Me,
    u as Pe
} from "./App-pJGjDiPw.js";
import {
    A as ie,
    m as A
} from "./vendor-motion-Cp_NPzpZ.js";
import {
    am as pe,
    aD as $e,
    X as ge,
    be as zt,
    h as se,
    Z,
    a as Ce,
    ay as he,
    A as ke,
    a9 as St,
    a8 as Mt,
    f as ue,
    bU as Ct,
    a$ as Ee,
    aV as Et,
    r as ze,
    T as ee,
    P as ce,
    at as Tt,
    l as At,
    cl as Dt,
    ab as st,
    C as at,
    S as ne,
    d as rt,
    bL as It,
    bb as Rt,
    a1 as _t,
    bN as Fe,
    aK as Lt,
    aG as Te,
    B as Ae,
    k as He,
    ae as Ot,
    aP as Pt,
    cm as $t
} from "./vendor-icons-CqruUz7g.js";
import {
    E as Ge
} from "./ExamCreateEditModal-BdlzfeFO.js";
import {
    S as Ye
} from "./SubjectCreateModal-DhD_Cwbk.js";
import {
    T as Ft
} from "./TaskCardModal-DZvd1GWt.js";
import {
    c as Y
} from "./utils-D8mZnxMk.js";
import {
    u as De
} from "./vendor-router-CmoTwRnm.js";
import {
    E as Be
} from "./ExamTemplateSelectorModal-DsEPEF5X.js";
import {
    f as U,
    u as Ht,
    h as we
} from "./useAIStore-B2cv1FZz.js";
import {
    b as Gt
} from "./studyTimeMaps-B0T_-AX0.js";
import {
    M as Yt
} from "./MarkdownRenderer-CIV1x0Uq.js";
import {
    d as je,
    a as nt
} from "./subjectBranding-DaDo_h8r.js";
import {
    a as T
} from "./timeFormat-CMPo-BX2.js";
import {
    S as Ie
} from "./SubjectIcon-CyCDqtel.js";
import {
    e as Bt
} from "./endOfMonth-BISTJu4P.js";
import {
    u as Ut
} from "./useSyncStore-vWs_TdIc.js";
import "./HeadwayUpdatesButton-DUh668tJ.js";
import "./useOnlineStatus-BJOTUERN.js";
import "./index-BPYJFSVW.js";
import "./useNotificationStore-BS4df28T.js";
import "./IsotopeLogoIcon-oPk5Ru-_.js";
import "./vendor-supabase-DAiUAuun.js";
import "./taskAvailability-B1aDS_ww.js";
import "./vendor-charts-CFLJvnG7.js";

function qt(t, r) {
    const [a, x] = jt(t, r.start, r.end);
    return {
        start: a,
        end: x
    }
}

function Wt(t, r) {
    const {
        start: a,
        end: x
    } = qt(r ?.in, t);
    let i = +a > +x;
    const o = i ? +a : +x,
        s = i ? x : a;
    s.setHours(0, 0, 0, 0);
    let d = 1;
    const w = [];
    for (; + s <= o;) w.push(vt(a, s)), s.setDate(s.getDate() + d), s.setHours(0, 0, 0, 0);
    return i ? w.reverse() : w
}

function re(t, r) {
    const a = Je(t, r ?.in);
    return a.setDate(1), a.setHours(0, 0, 0, 0), a
}

function Vt(t, r) {
    const a = Nt(),
        x = a.weekStartsOn ?? a.locale ?.options ?.weekStartsOn ?? 0,
        i = Je(t, r ?.in),
        o = i.getDay(),
        s = (o < x ? -7 : 0) + 6 - (o - x);
    return i.setDate(i.getDate() + s), i.setHours(23, 59, 59, 999), i
}
const Ue = {
        Physics: {
            icon: ke,
            color: "text-brand-500",
            bg: "bg-brand-500/10",
            border: "border-brand-500/20"
        },
        Chemistry: {
            icon: Mt,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20"
        },
        Mathematics: {
            icon: St,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            border: "border-amber-500/20"
        },
        Default: {
            icon: ke,
            color: "text-zinc-500",
            bg: "bg-zinc-500/10",
            border: "border-zinc-500/20"
        }
    },
    Kt = ({
        isOpen: t,
        onClose: r
    }) => {
        const {
            subjects: a
        } = te(), {
            profile: x
        } = Me(), [i, o] = g.useState("all"), [s, d] = g.useState(""), w = Ze(x ?.studyPreferences), f = g.useMemo(() => {
            const u = [],
                n = new Date,
                m = J(n, w);
            return a.forEach(b => {
                b.chapters.forEach(c => {
                    c.topics.forEach(k => {
                        if (k.nextReview) {
                            const h = new Date(k.nextReview),
                                y = J(k.nextReview, w);
                            let z = "upcoming";
                            h < n && y !== m ? z = "overdue" : y === m && (z = "due");
                            const L = {
                                Novice: 20,
                                Apprentice: 40,
                                Guru: 60,
                                Master: 80,
                                Enlightened: 100
                            };
                            u.push({
                                id: k.id,
                                topic: k.title,
                                subject: b.name,
                                date: y,
                                time: h.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                }),
                                status: z,
                                interval: `${k.interval}d`,
                                difficulty: "Good",
                                mastery: L[k.mastery] || 0
                            })
                        }
                    })
                })
            }), u.sort((b, c) => _(b.date).getTime() - _(c.date).getTime())
        }, [w, a]), p = g.useMemo(() => {
            let u = f;
            return i === "overdue" && (u = u.filter(n => n.status === "overdue")), i === "today" && (u = u.filter(n => n.status === "due")), i === "upcoming" && (u = u.filter(n => n.status === "upcoming")), s && (u = u.filter(n => n.topic.toLowerCase().includes(s.toLowerCase()) || n.subject.toLowerCase().includes(s.toLowerCase()))), u
        }, [i, s, f]), j = g.useMemo(() => {
            const u = {};
            return p.forEach(n => {
                u[n.date] || (u[n.date] = []), u[n.date].push(n)
            }), u
        }, [p]);
        return e.jsx(ie, {
            children: t && e.jsxs("div", {
                className: "fixed inset-0 z-[9999] flex items-center justify-center p-4 lg:p-8",
                children: [e.jsx(A.div, {
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    exit: {
                        opacity: 0
                    },
                    onClick: r,
                    className: "absolute inset-0 bg-black/60 backdrop-blur-md"
                }), e.jsxs(A.div, {
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
                    className: "relative w-full max-w-5xl h-[85vh] bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col",
                    children: [e.jsxs("div", {
                        className: "flex items-center justify-between p-6 border-b border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-white/[0.02] backdrop-blur-xl z-20",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-4",
                            children: [e.jsx("div", {
                                className: "w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20",
                                children: e.jsx(pe, {
                                    className: "w-6 h-6 text-brand-500"
                                })
                            }), e.jsxs("div", {
                                children: [e.jsx("h2", {
                                    className: "text-2xl font-bold text-zinc-900 dark:text-white",
                                    children: "Revision Schedule"
                                }), e.jsxs("div", {
                                    className: "flex items-center gap-2 text-sm text-zinc-400",
                                    children: [e.jsx("span", {
                                        className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
                                    }), p.length, " Sessions Scheduled"]
                                })]
                            })]
                        }), e.jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [e.jsxs("div", {
                                className: "relative hidden md:block",
                                children: [e.jsx($e, {
                                    className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
                                }), e.jsx("input", {
                                    type: "text",
                                    placeholder: "Search topics...",
                                    value: s,
                                    onChange: u => d(u.target.value),
                                    className: "w-64 bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500/50 transition-colors"
                                })]
                            }), e.jsx("button", {
                                onClick: r,
                                className: "w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors",
                                children: e.jsx(ge, {
                                    className: "w-5 h-5"
                                })
                            })]
                        })]
                    }), e.jsxs("div", {
                        className: "flex-1 flex overflow-hidden",
                        children: [e.jsxs("div", {
                            className: "w-64 border-r border-white/5 p-6 space-y-8 hidden md:block overflow-y-auto custom-scrollbar bg-white/[0.01]",
                            children: [e.jsxs("div", {
                                children: [e.jsx("h3", {
                                    className: "text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4",
                                    children: "View"
                                }), e.jsx("div", {
                                    className: "space-y-2",
                                    children: [{
                                        id: "all",
                                        label: "All Reviews",
                                        icon: zt
                                    }, {
                                        id: "overdue",
                                        label: "Overdue",
                                        icon: se,
                                        count: 1
                                    }, {
                                        id: "today",
                                        label: "Due Today",
                                        icon: Z,
                                        count: 2
                                    }, {
                                        id: "upcoming",
                                        label: "Upcoming",
                                        icon: Ce,
                                        count: 7
                                    }].map(u => e.jsxs("button", {
                                        onClick: () => o(u.id),
                                        className: `
                          w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-all
                          ${i===u.id?"bg-brand-500/10 text-brand-400 border border-brand-500/20":"text-zinc-400 hover:bg-white/5 hover:text-zinc-200 border border-transparent"}
                        `,
                                        children: [e.jsxs("div", {
                                            className: "flex items-center gap-3",
                                            children: [e.jsx(u.icon, {
                                                className: "w-4 h-4"
                                            }), u.label]
                                        }), u.count !== void 0 && e.jsx("span", {
                                            className: `text-xs px-2 py-0.5 rounded-full ${i===u.id?"bg-brand-500/20":"bg-white/5"}`,
                                            children: u.count
                                        })]
                                    }, u.id))
                                })]
                            }), e.jsxs("div", {
                                className: "bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-2xl p-4 border border-emerald-500/20",
                                children: [e.jsxs("div", {
                                    className: "flex items-center gap-3 mb-3",
                                    children: [e.jsx("div", {
                                        className: "p-2 rounded-lg bg-emerald-500/20",
                                        children: e.jsx(he, {
                                            className: "w-4 h-4 text-emerald-500"
                                        })
                                    }), e.jsx("div", {
                                        className: "text-sm font-bold text-white",
                                        children: "Retention"
                                    })]
                                }), e.jsx("div", {
                                    className: "text-2xl font-bold text-white mb-1",
                                    children: "92%"
                                }), e.jsx("div", {
                                    className: "text-xs text-emerald-400/80",
                                    children: "+4% vs last week"
                                }), e.jsx("div", {
                                    className: "mt-4 h-1.5 w-full bg-emerald-900/30 rounded-full overflow-hidden",
                                    children: e.jsx("div", {
                                        className: "h-full bg-emerald-500 w-[92%]"
                                    })
                                })]
                            })]
                        }), e.jsx("div", {
                            className: "flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 space-y-8",
                            children: Object.keys(j).length === 0 ? e.jsxs("div", {
                                className: "flex flex-col items-center justify-center h-full text-zinc-500",
                                children: [e.jsx($e, {
                                    className: "w-12 h-12 mb-4 opacity-20"
                                }), e.jsx("p", {
                                    children: "No revisions found for this filter."
                                })]
                            }) : Object.entries(j).sort().map(([u, n]) => e.jsxs("div", {
                                className: "space-y-4",
                                children: [e.jsxs("div", {
                                    className: "flex items-center gap-3 sticky top-0 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-sm py-2 z-10",
                                    children: [e.jsx("div", {
                                        className: "h-px flex-1 bg-zinc-200 dark:bg-white/10"
                                    }), e.jsx("span", {
                                        className: "text-xs font-bold text-zinc-500 uppercase tracking-wider border border-zinc-200 dark:border-white/10 px-3 py-1 rounded-full bg-zinc-100 dark:bg-[#09090b]",
                                        children: new Date(u).toLocaleDateString("en-US", {
                                            weekday: "long",
                                            month: "short",
                                            day: "numeric"
                                        })
                                    }), e.jsx("div", {
                                        className: "h-px flex-1 bg-zinc-200 dark:bg-white/10"
                                    })]
                                }), e.jsx("div", {
                                    className: "grid grid-cols-1 gap-3",
                                    children: n.map((m, b) => {
                                        const c = Ue[m.subject] || Ue.Default;
                                        return e.jsxs(A.div, {
                                            initial: {
                                                opacity: 0,
                                                y: 10
                                            },
                                            animate: {
                                                opacity: 1,
                                                y: 0
                                            },
                                            transition: {
                                                delay: b * .05
                                            },
                                            className: "group relative bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-2xl p-4 flex items-center gap-4 transition-all duration-300",
                                            children: [e.jsx("div", {
                                                className: `absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${m.status==="overdue"?"bg-rose-500":m.status==="due"?"bg-emerald-500":"bg-zinc-700"}`
                                            }), e.jsxs("div", {
                                                className: "pl-3 flex flex-col items-center min-w-[4rem]",
                                                children: [e.jsx("span", {
                                                    className: "text-sm font-bold text-white",
                                                    children: m.time
                                                }), e.jsx("span", {
                                                    className: "text-[10px] text-zinc-500 font-medium uppercase",
                                                    children: m.status
                                                })]
                                            }), e.jsx("div", {
                                                className: `w-12 h-12 rounded-xl ${c.bg} ${c.border} border flex items-center justify-center flex-shrink-0`,
                                                children: e.jsx(c.icon, {
                                                    className: `w-6 h-6 ${c.color}`
                                                })
                                            }), e.jsxs("div", {
                                                className: "flex-1 min-w-0",
                                                children: [e.jsxs("div", {
                                                    className: "flex items-center gap-2 mb-1",
                                                    children: [e.jsx("h3", {
                                                        className: "text-base font-bold text-zinc-200 group-hover:text-white transition-colors truncate",
                                                        children: m.topic
                                                    }), m.status === "overdue" && e.jsx("span", {
                                                        className: "px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 text-[10px] font-bold uppercase border border-rose-500/20",
                                                        children: "Overdue"
                                                    })]
                                                }), e.jsxs("div", {
                                                    className: "flex items-center gap-4 text-xs text-zinc-500",
                                                    children: [e.jsxs("span", {
                                                        className: "flex items-center gap-1.5",
                                                        children: [e.jsx(he, {
                                                            className: "w-3 h-3"
                                                        }), "Interval:", " ", e.jsx("span", {
                                                            className: "text-zinc-400",
                                                            children: m.interval
                                                        })]
                                                    }), e.jsxs("span", {
                                                        className: "flex items-center gap-1.5",
                                                        children: [e.jsx(ue, {
                                                            className: "w-3 h-3"
                                                        }), "Mastery:", " ", e.jsxs("span", {
                                                            className: `font-bold ${m.mastery>80?"text-emerald-400":"text-amber-400"}`,
                                                            children: [m.mastery, "%"]
                                                        })]
                                                    })]
                                                })]
                                            }), e.jsxs("div", {
                                                className: "flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0",
                                                children: [e.jsx("button", {
                                                    className: "p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors",
                                                    children: e.jsx(Ct, {
                                                        className: "w-5 h-5"
                                                    })
                                                }), e.jsxs("button", {
                                                    className: "px-4 py-2 bg-white text-black rounded-xl font-bold text-sm hover:bg-zinc-200 transition-colors flex items-center gap-2",
                                                    children: ["Review", e.jsx(Ee, {
                                                        className: "w-4 h-4"
                                                    })]
                                                })]
                                            })]
                                        }, m.id)
                                    })
                                })]
                            }, u))
                        })]
                    })]
                })]
            })
        })
    },
    Qt = () => {
        const [t, r] = g.useState(!1), {
            subjects: a,
            fetchSubjects: x
        } = te();
        g.useEffect(() => {
            x()
        }, [x]);
        const i = a.flatMap(o => o.chapters.flatMap(s => s.topics.filter(d => d.nextReview).map(d => ({
            id: d.id,
            topic: d.title,
            subject: o.name,
            dateObj: new Date(d.nextReview),
            status: new Date(d.nextReview) <= new Date ? "due" : "upcoming",
            time: "9:00 AM",
            method: "x²",
            step: `x=${Math.floor(Math.random()*5)+1}`
        })))).sort((o, s) => o.dateObj.getTime() - s.dateObj.getTime()).slice(0, 6).map(o => ({ ...o,
            date: o.dateObj.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric"
            }) === new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric"
            }) ? "Today" : o.dateObj.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric"
            })
        }));
        return e.jsxs("div", {
            className: "mt-12 space-y-8",
            children: [e.jsxs("div", {
                className: "flex items-center justify-between",
                children: [e.jsxs("div", {
                    children: [e.jsxs("h2", {
                        className: "text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-3",
                        children: [e.jsx(Et, {
                            className: "w-6 h-6 text-emerald-500"
                        }), "Smart Revision Timeline"]
                    }), e.jsx("p", {
                        className: "text-zinc-500 dark:text-zinc-400 text-sm mt-1",
                        children: "Optimized by RecallMaster™ Algorithm to maximize retention."
                    })]
                }), e.jsx("button", {
                    onClick: () => r(!0),
                    className: "px-4 py-2 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 border border-zinc-200 dark:border-white/10 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-300 transition-colors",
                    children: "View Full Schedule"
                })]
            }), e.jsxs("div", {
                className: "relative",
                children: [e.jsx("div", {
                    className: "absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500/50 via-brand-500/50 to-transparent -translate-y-1/2 hidden md:block"
                }), e.jsx("div", {
                    className: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 relative z-10",
                    children: i.length === 0 ? e.jsx("div", {
                        className: "col-span-full text-center py-8 text-zinc-500 bg-zinc-100 dark:bg-white/5 rounded-2xl border border-zinc-200 dark:border-white/5",
                        children: "No upcoming revisions scheduled. Start studying to populate your timeline!"
                    }) : i.map((o, s) => e.jsxs(A.div, {
                        initial: {
                            opacity: 0,
                            y: 20
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        transition: {
                            delay: s * .1
                        },
                        className: `
                relative p-4 rounded-2xl border backdrop-blur-md flex flex-col gap-3 group
                ${o.status==="due"?"bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]":"bg-white dark:bg-[#0c0c0e] border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20"}
              `,
                        children: [e.jsx("div", {
                            className: `
                absolute -top-[26px] left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 z-20 hidden md:block
                ${o.status==="due"?"bg-emerald-500 border-emerald-900":"bg-white dark:bg-[#0c0c0e] border-zinc-400 dark:border-zinc-600"}
              `,
                            children: o.status === "due" && e.jsx("div", {
                                className: "absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75"
                            })
                        }), e.jsxs("div", {
                            className: "flex items-center justify-between mb-1",
                            children: [e.jsx("span", {
                                className: `text-xs font-bold uppercase tracking-wider ${o.status==="due"?"text-emerald-400":"text-zinc-500"}`,
                                children: o.date
                            }), e.jsx(Ce, {
                                className: "w-3 h-3 text-zinc-500"
                            })]
                        }), e.jsxs("div", {
                            children: [e.jsx("div", {
                                className: "text-sm font-bold text-zinc-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors",
                                children: o.topic
                            }), e.jsxs("div", {
                                className: "flex items-center gap-2 mt-0.5",
                                children: [e.jsx("span", {
                                    className: "text-xs text-zinc-500 dark:text-zinc-400",
                                    children: o.subject
                                }), e.jsx("span", {
                                    className: "text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/5 text-zinc-500 border border-zinc-200 dark:border-white/5 font-mono",
                                    children: o.method
                                })]
                            })]
                        }), e.jsxs("div", {
                            className: `
                mt-auto pt-3 border-t border-zinc-200 dark:border-white/5 flex items-center justify-between text-xs
                ${o.status==="due"?"text-emerald-600 dark:text-emerald-300":"text-zinc-500"}
              `,
                            children: [e.jsx("span", {
                                className: "font-mono",
                                children: o.step
                            }), o.status === "due" && e.jsx(Z, {
                                className: "w-3 h-3 fill-current"
                            })]
                        })]
                    }, o.id))
                })]
            }), e.jsxs("div", {
                className: "grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16",
                children: [e.jsx("div", {
                    className: "bg-gradient-to-br from-brand-500/10 to-brand-600/5 rounded-3xl p-1 border border-brand-500/20",
                    children: e.jsxs("div", {
                        className: "bg-white/90 dark:bg-[#0c0c0e]/90 backdrop-blur-xl h-full rounded-[20px] p-8 relative overflow-hidden",
                        children: [e.jsx("div", {
                            className: "absolute top-0 right-0 p-32 bg-brand-500/10 rounded-full blur-[100px]"
                        }), e.jsxs("div", {
                            className: "relative z-10",
                            children: [e.jsxs("div", {
                                className: "flex items-center gap-4 mb-6",
                                children: [e.jsx("div", {
                                    className: "w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center",
                                    children: e.jsx(he, {
                                        className: "w-6 h-6 text-brand-500 dark:text-brand-400"
                                    })
                                }), e.jsxs("div", {
                                    children: [e.jsx("h3", {
                                        className: "text-xl font-bold text-zinc-900 dark:text-white",
                                        children: "The Quadratic Method"
                                    }), e.jsx("div", {
                                        className: "text-sm font-mono text-brand-600 dark:text-brand-400",
                                        children: "Interval = x²"
                                    })]
                                })]
                            }), e.jsxs("p", {
                                className: "text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6",
                                children: ["Ideal for long-term retention. On the day you finish a chapter, write in your planner: ", e.jsx("strong", {
                                    className: "text-zinc-900 dark:text-white",
                                    children: '"x²: Chapter Name"'
                                }), "."]
                            }), e.jsx("div", {
                                className: "space-y-3",
                                children: [{
                                    x: 1,
                                    calc: "1² = 1",
                                    label: "1 day later (1st revision)"
                                }, {
                                    x: 2,
                                    calc: "2² = 4",
                                    label: "4 days later (2nd revision)"
                                }, {
                                    x: 3,
                                    calc: "3² = 9",
                                    label: "9 days later"
                                }, {
                                    x: 4,
                                    calc: "4² = 16",
                                    label: "16 days later"
                                }].map((o, s) => e.jsxs("div", {
                                    className: "flex items-center gap-3 p-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5",
                                    children: [e.jsxs("div", {
                                        className: "w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-300 font-bold text-sm",
                                        children: ["x=", o.x]
                                    }), e.jsx("div", {
                                        className: "flex-1",
                                        children: e.jsxs("div", {
                                            className: "flex items-center gap-2",
                                            children: [e.jsx("span", {
                                                className: "text-zinc-900 dark:text-white font-mono text-sm",
                                                children: o.calc
                                            }), e.jsx(ze, {
                                                className: "w-3 h-3 text-zinc-400 dark:text-zinc-600"
                                            }), e.jsx("span", {
                                                className: "text-zinc-600 dark:text-zinc-300 text-sm",
                                                children: o.label
                                            })]
                                        })
                                    })]
                                }, s))
                            }), e.jsx("div", {
                                className: "mt-6 p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-700 dark:text-brand-200 leading-relaxed",
                                children: "By the time JEE arrives, you'll have naturally completed 10–15 spaced revisions of each chapter."
                            })]
                        })]
                    })
                }), e.jsx("div", {
                    className: "bg-gradient-to-br from-emerald-500/10 to-teal-600/5 rounded-3xl p-1 border border-emerald-500/20",
                    children: e.jsxs("div", {
                        className: "bg-white/90 dark:bg-[#0c0c0e]/90 backdrop-blur-xl h-full rounded-[20px] p-8 relative overflow-hidden",
                        children: [e.jsx("div", {
                            className: "absolute top-0 right-0 p-32 bg-emerald-500/10 rounded-full blur-[100px]"
                        }), e.jsxs("div", {
                            className: "relative z-10",
                            children: [e.jsxs("div", {
                                className: "flex items-center gap-4 mb-6",
                                children: [e.jsx("div", {
                                    className: "w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center",
                                    children: e.jsx(Z, {
                                        className: "w-6 h-6 text-emerald-500 dark:text-emerald-400"
                                    })
                                }), e.jsxs("div", {
                                    children: [e.jsx("h3", {
                                        className: "text-xl font-bold text-zinc-900 dark:text-white",
                                        children: "The Exponential Method"
                                    }), e.jsx("div", {
                                        className: "text-sm font-mono text-emerald-600 dark:text-emerald-400",
                                        children: "Interval = 2^(x-1)"
                                    })]
                                })]
                            }), e.jsx("p", {
                                className: "text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6",
                                children: "For faster-cycle spaced repetition. Use a steeper revision curve for topics you studied today."
                            }), e.jsx("div", {
                                className: "space-y-3",
                                children: [{
                                    x: 1,
                                    calc: "2⁰ = 1",
                                    label: "1 day later"
                                }, {
                                    x: 2,
                                    calc: "2¹ = 2",
                                    label: "2 days later"
                                }, {
                                    x: 3,
                                    calc: "2² = 4",
                                    label: "4 days later"
                                }, {
                                    x: 4,
                                    calc: "2³ = 8",
                                    label: "8 days later"
                                }].map((o, s) => e.jsxs("div", {
                                    className: "flex items-center gap-3 p-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5",
                                    children: [e.jsxs("div", {
                                        className: "w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-300 font-bold text-sm",
                                        children: ["x=", o.x]
                                    }), e.jsx("div", {
                                        className: "flex-1",
                                        children: e.jsxs("div", {
                                            className: "flex items-center gap-2",
                                            children: [e.jsx("span", {
                                                className: "text-zinc-900 dark:text-white font-mono text-sm",
                                                children: o.calc
                                            }), e.jsx(ze, {
                                                className: "w-3 h-3 text-zinc-400 dark:text-zinc-600"
                                            }), e.jsx("span", {
                                                className: "text-zinc-600 dark:text-zinc-300 text-sm",
                                                children: o.label
                                            })]
                                        })
                                    })]
                                }, s))
                            }), e.jsx("div", {
                                className: "mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-200 leading-relaxed",
                                children: "By following these mathematically spaced intervals consistently, your retention skyrockets and each chapter becomes almost automatic."
                            })]
                        })]
                    })
                })]
            }), e.jsx(Kt, {
                isOpen: t,
                onClose: () => r(!1)
            })]
        })
    },
    Xt = t => Number.isFinite(t) ? Math.round(t) : 0,
    it = ({
        onAdd: t,
        className: r
    }) => e.jsxs(A.div, {
        initial: {
            opacity: 0,
            y: 10
        },
        animate: {
            opacity: 1,
            y: 0
        },
        whileHover: {
            y: -2
        },
        onClick: t,
        className: Y("relative overflow-hidden rounded-2xl cursor-pointer group", "bg-gradient-to-br from-brand-600/10 via-white/5 to-transparent", "border border-brand-500/20 hover:border-brand-500/40", "p-6 transition-all duration-300", r),
        children: [e.jsx("div", {
            className: "absolute -top-12 -right-12 w-32 h-32 bg-brand-600/10 rounded-full blur-3xl group-hover:bg-brand-600/20 transition-colors"
        }), e.jsxs("div", {
            className: "relative z-10 flex flex-col items-center text-center",
            children: [e.jsx("div", {
                className: "w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center mb-4 border border-brand-500/20 group-hover:scale-110 transition-transform",
                children: e.jsx(ee, {
                    className: "w-6 h-6 text-brand-400"
                })
            }), e.jsx("h4", {
                className: "text-white font-bold mb-1",
                children: "Schedule Your Next Exam"
            }), e.jsx("p", {
                className: "text-zinc-500 text-xs mb-4 max-w-[200px]",
                children: "Track countdowns, syllabus progress, and performance analytics."
            }), e.jsxs("div", {
                className: "flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 text-white text-xs font-bold shadow-lg shadow-brand-600/20 group-hover:bg-brand-500 transition-colors",
                children: [e.jsx(ce, {
                    className: "w-3.5 h-3.5",
                    strokeWidth: 3
                }), "Create Schedule"]
            })]
        })]
    }),
    Jt = ({
        onAddExam: t
    }) => {
        const {
            exams: r,
            deleteExam: a
        } = oe(), x = De(), i = g.useMemo(() => [...r].filter(s => !s.deletedAt).sort((s, d) => _(s.date).getTime() - _(d.date).getTime()), [r]), o = s => {
            const d = _(s),
                w = new Date;
            d.setHours(0, 0, 0, 0), w.setHours(0, 0, 0, 0);
            const f = d.getTime() - w.getTime();
            return Math.ceil(f / (1e3 * 3600 * 24))
        };
        return e.jsxs("div", {
            className: "app-card bg-white dark:bg-[#0c0c0e] rounded-2xl border border-zinc-200 dark:border-white/5 p-6 relative overflow-hidden group shadow-sm dark:shadow-none",
            children: [e.jsxs("div", {
                className: "flex items-center justify-between mb-6 relative z-20",
                children: [e.jsxs("h3", {
                    className: "font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2",
                    children: [e.jsx(pe, {
                        className: "w-5 h-5 text-brand-500"
                    }), "Exam Countdowns"]
                }), e.jsx("button", {
                    type: "button",
                    onClick: s => {
                        s.stopPropagation(), t()
                    },
                    className: "relative z-30 p-2 rounded-lg bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all active:scale-95 cursor-pointer",
                    title: "Schedule New Exam",
                    children: e.jsx(ce, {
                        className: "w-4 h-4"
                    })
                })]
            }), e.jsx("div", {
                className: "max-h-[min(26rem,60vh)] overflow-y-auto custom-scrollbar space-y-3 pr-2 relative z-10 min-h-0",
                children: i.length === 0 ? e.jsx(it, {
                    onAdd: t
                }) : i.map(s => {
                    const d = o(s.date),
                        w = d < 0,
                        f = d <= 7 && !w;
                    return e.jsxs("div", {
                        onClick: () => x(`/exams/${s.id}`),
                        className: "group/item relative bg-zinc-50 dark:bg-white/5 rounded-xl p-4 border border-zinc-200 dark:border-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 transition-all cursor-pointer",
                        children: [e.jsx("div", {
                            className: "absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity z-20",
                            children: e.jsx("button", {
                                onClick: p => {
                                    p.stopPropagation(), window.confirm("Are you sure you want to delete this exam countdown?") && a(s.id)
                                },
                                className: "p-1.5 rounded-lg bg-black/40 backdrop-blur-md text-zinc-300 hover:text-rose-400 border border-white/5",
                                children: e.jsx(ge, {
                                    className: "w-3 h-3"
                                })
                            })
                        }), e.jsxs("div", {
                            className: "flex items-center justify-between mb-2",
                            children: [e.jsx("span", {
                                className: "font-bold text-zinc-900 dark:text-zinc-200",
                                children: s.title
                            }), w ? e.jsx("button", {
                                onClick: p => {
                                    p.stopPropagation(), x(`/exams/${s.id}?tab=result`)
                                },
                                className: "text-xs font-bold px-3 py-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20 animate-pulse",
                                children: "Log Result"
                            }) : e.jsx("span", {
                                className: `text-xs font-bold px-2 py-1 rounded-lg ${f?"bg-rose-500/20 text-rose-400":"bg-emerald-500/20 text-emerald-400"}`,
                                children: d === 0 ? "Today!" : d === 1 ? "Tomorrow" : `${d} Days Left`
                            })]
                        }), !w && e.jsx("div", {
                            className: "w-full h-1.5 bg-black/20 rounded-full overflow-hidden",
                            children: e.jsx("div", {
                                className: `h-full rounded-full ${f?"bg-rose-500":"bg-emerald-500"}`,
                                style: {
                                    width: `${(()=>{const p=_(s.date).getTime()-new Date(s.createdAt||Date.now()).getTime(),j=new Date().getTime()-new Date(s.createdAt||Date.now()).getTime(),u=Math.min(100,Math.max(0,j/Math.max(1,p)*100));return isNaN(u)?0:u})()}%`
                                }
                            })
                        }), e.jsxs("div", {
                            className: "mt-2 text-[10px] text-zinc-500 flex justify-between",
                            children: [e.jsx("span", {
                                children: _(s.date).toLocaleDateString()
                            }), e.jsx("span", {
                                children: w ? "Exam Over" : "Target: Ace it! 🎯"
                            })]
                        })]
                    }, s.id)
                })
            })]
        })
    },
    Zt = ({
        onAddResult: t,
        onEditResult: r
    }) => {
        const {
            tests: a,
            exams: x,
            mockTests: i,
            deleteTest: o
        } = oe(), {
            subjects: s
        } = te(), d = g.useMemo(() => {
            const p = a.map(n => ({
                    id: n.id,
                    title: n.title,
                    date: n.date,
                    percentage: n.percentage,
                    scoredMarks: n.scoredMarks,
                    totalMarks: n.totalMarks,
                    subjects: n.subjects,
                    subjectId: n.subjectId,
                    type: "test",
                    original: n
                })),
                j = x.filter(n => n.result && !n.deletedAt).map(n => ({
                    id: n.id,
                    title: n.title,
                    date: n.result.resultDate || n.date,
                    percentage: n.result.percentage,
                    scoredMarks: n.result.scoredMarks,
                    totalMarks: n.result.totalMarks,
                    subjects: n.result.subjectResults,
                    subjectId: void 0,
                    type: "exam",
                    original: n
                })),
                u = i.filter(n => n.status === "completed" && !n.deletedAt).map(n => ({
                    id: n.id,
                    title: n.name,
                    date: n.date,
                    percentage: n.percentage,
                    scoredMarks: n.scoredMarks,
                    totalMarks: n.totalMarks,
                    subjects: n.subjectPerformance,
                    subjectId: void 0,
                    type: "mock",
                    original: n
                }));
            return [...p, ...j, ...u].sort((n, m) => _(m.date).getTime() - _(n.date).getTime())
        }, [a, x, i]), w = d.slice(0, 5), f = d.length > 0 ? Math.round(d.reduce((p, j) => p + j.percentage, 0) / d.length) : 0;
        return e.jsxs("div", {
            className: "space-y-6",
            children: [e.jsxs("div", {
                className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
                children: [e.jsxs("h2", {
                    className: "flex items-center gap-3 text-2xl font-bold text-zinc-900 dark:text-white",
                    children: [e.jsx(At, {
                        className: "w-6 h-6 text-brand-500"
                    }), "Test Analysis"]
                }), e.jsxs("button", {
                    onClick: t,
                    className: "flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-brand-900/20 transition-all hover:bg-brand-500 sm:w-auto",
                    children: [e.jsx(ce, {
                        className: "w-4 h-4"
                    }), "Log Test Result"]
                })]
            }), e.jsxs("div", {
                className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                children: [e.jsxs("div", {
                    className: "app-card bg-white dark:bg-[#0c0c0e] p-5 rounded-2xl border border-zinc-200 dark:border-white/5 shadow-sm dark:shadow-none",
                    children: [e.jsx("div", {
                        className: "text-zinc-500 dark:text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1",
                        children: "Average Score"
                    }), e.jsxs("div", {
                        className: "text-2xl font-bold text-zinc-900 dark:text-white",
                        children: [f, "%"]
                    })]
                }), e.jsxs("div", {
                    className: "app-card bg-white dark:bg-[#0c0c0e] p-5 rounded-2xl border border-zinc-200 dark:border-white/5 shadow-sm dark:shadow-none",
                    children: [e.jsx("div", {
                        className: "text-zinc-500 dark:text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1",
                        children: "Tests Taken"
                    }), e.jsx("div", {
                        className: "text-2xl font-bold text-zinc-900 dark:text-white",
                        children: d.length
                    })]
                }), e.jsxs("div", {
                    className: "app-card bg-white dark:bg-[#0c0c0e] p-5 rounded-2xl border border-zinc-200 dark:border-white/5 shadow-sm dark:shadow-none",
                    children: [e.jsx("div", {
                        className: "text-zinc-500 dark:text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1",
                        children: "Best Subject"
                    }), e.jsx("div", {
                        className: "text-2xl font-bold text-zinc-900 dark:text-white",
                        children: (() => {
                            if (d.length === 0) return "-";
                            const p = {};
                            d.forEach(n => {
                                if (n.subjects) n.subjects.forEach(m => {
                                    const b = m.subjectName || s.find(k => k.id === m.subjectId) ?.name || "Unknown";
                                    p[b] || (p[b] = {
                                        total: 0,
                                        count: 0
                                    });
                                    const c = m.percentage || (m.totalMarks > 0 ? (m.scoredMarks || m.marksObtained) / m.totalMarks * 100 : 0);
                                    p[b].total += c, p[b].count++
                                });
                                else if (n.subjectId) {
                                    const m = s.find(b => b.id === n.subjectId) ?.name || "Unknown";
                                    p[m] || (p[m] = {
                                        total: 0,
                                        count: 0
                                    }), p[m].total += n.percentage, p[m].count++
                                }
                            });
                            let j = "-",
                                u = -1;
                            return Object.entries(p).forEach(([n, m]) => {
                                const b = m.total / m.count;
                                b > u && (u = b, j = n)
                            }), j
                        })()
                    })]
                })]
            }), e.jsxs("div", {
                className: "app-card bg-white dark:bg-[#0c0c0e] rounded-2xl border border-zinc-200 dark:border-white/5 overflow-hidden shadow-sm dark:shadow-none",
                children: [e.jsx("div", {
                    className: "p-4 border-b border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-white/[0.02] flex items-center justify-between",
                    children: e.jsx("h3", {
                        className: "font-bold text-zinc-900 dark:text-zinc-200",
                        children: "Recent Performance"
                    })
                }), d.length === 0 ? e.jsx("div", {
                    className: "p-8 text-center text-zinc-500",
                    children: "No test results logged yet."
                }) : e.jsx("div", {
                    className: "divide-y divide-white/5",
                    children: w.map(p => e.jsxs("div", {
                        className: "group flex flex-col gap-3 p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between",
                        children: [e.jsxs("div", {
                            className: "flex min-w-0 items-center gap-4",
                            children: [e.jsxs("div", {
                                className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-800 text-lg font-bold text-white",
                                children: [Xt(p.percentage), "%"]
                            }), e.jsxs("div", {
                                className: "min-w-0",
                                children: [e.jsx("div", {
                                    className: "line-clamp-2 font-bold text-zinc-900 dark:text-zinc-200",
                                    children: p.title
                                }), e.jsxs("div", {
                                    className: "flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500",
                                    children: [e.jsx("span", {
                                        children: new Date(p.date).toLocaleDateString()
                                    }), e.jsx("span", {
                                        children: "•"
                                    }), e.jsxs("span", {
                                        className: "capitalize",
                                        children: [p.type, " Result"]
                                    })]
                                })]
                            })]
                        }), e.jsxs("div", {
                            className: "flex items-center justify-between gap-2 sm:justify-end",
                            children: [e.jsx("div", {
                                className: "text-right opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2",
                                children: p.type === "test" && e.jsxs(e.Fragment, {
                                    children: [e.jsx("button", {
                                        onClick: () => r(p.original),
                                        className: "p-2 rounded-lg bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors",
                                        children: e.jsx(Dt, {
                                            className: "w-4 h-4"
                                        })
                                    }), e.jsx("button", {
                                        onClick: () => {
                                            window.confirm("Are you sure you want to delete this test result?") && o(p.id)
                                        },
                                        className: "p-2 rounded-lg bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-400 hover:text-rose-400 transition-colors",
                                        children: e.jsx(st, {
                                            className: "w-4 h-4"
                                        })
                                    })]
                                })
                            }), e.jsxs("div", {
                                className: "text-right",
                                children: [e.jsxs("div", {
                                    className: "text-sm font-medium text-zinc-300",
                                    children: [p.scoredMarks, "/", p.totalMarks]
                                }), e.jsx("div", {
                                    className: "text-xs text-zinc-500",
                                    children: "Total Marks"
                                })]
                            }), e.jsx(at, {
                                className: "w-5 h-5 text-zinc-600 group-hover:text-zinc-400 transition-colors"
                            })]
                        })]
                    }, p.id))
                })]
            })]
        })
    },
    qe = ({
        onClose: t
    }) => {
        const {
            subjects: r,
            updateTopicSRS: a
        } = te(), x = () => {
            const b = new Date;
            return r.flatMap(c => c.chapters.flatMap(k => k.topics.filter(h => !h.nextReview || new Date(h.nextReview) <= b).map(h => ({ ...h,
                subjectId: c.id,
                chapterId: k.id,
                subjectName: c.name
            }))))
        }, [i] = g.useState(() => x()), [o, s] = g.useState(0), [d, w] = g.useState(!1), [f, p] = g.useState(!1), [j, u] = g.useState(!1), n = i[o], m = async b => {
            if (!(!n || j)) {
                u(!0);
                try {
                    await a(n.subjectId, n.chapterId, n.id, b), o < i.length - 1 ? (w(!1), s(c => c + 1)) : p(!0)
                } finally {
                    u(!1)
                }
            }
        };
        return i.length === 0 ? e.jsx("div", {
            className: "fixed inset-0 z-[100] bg-zinc-900/90 backdrop-blur-xl flex flex-col items-center justify-center p-6",
            children: e.jsxs("div", {
                className: "bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-white/10 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl",
                children: [e.jsx("div", {
                    className: "w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center mx-auto mb-4",
                    children: e.jsx(ue, {
                        className: "w-8 h-8 text-brand-500"
                    })
                }), e.jsx("h2", {
                    className: "text-2xl font-bold text-zinc-900 dark:text-white mb-2",
                    children: "All Caught Up!"
                }), e.jsx("p", {
                    className: "text-zinc-500 dark:text-zinc-400 mb-6",
                    children: "You have no topics due for review right now. Great job!"
                }), e.jsx("button", {
                    onClick: t,
                    className: "w-full py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold transition-colors",
                    children: "Close"
                })]
            })
        }) : f ? e.jsx("div", {
            className: "fixed inset-0 z-[100] bg-zinc-900/90 backdrop-blur-xl flex flex-col items-center justify-center p-6",
            children: e.jsxs(A.div, {
                initial: {
                    scale: .9,
                    opacity: 0
                },
                animate: {
                    scale: 1,
                    opacity: 1
                },
                className: "bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-white/10 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl",
                children: [e.jsx("div", {
                    className: "w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4",
                    children: e.jsx(Tt, {
                        className: "w-8 h-8 text-emerald-500"
                    })
                }), e.jsx("h2", {
                    className: "text-2xl font-bold text-zinc-900 dark:text-white mb-2",
                    children: "Session Complete!"
                }), e.jsxs("p", {
                    className: "text-zinc-500 dark:text-zinc-400 mb-6",
                    children: ["You've reviewed ", i.length, " topics. Keep up the streak!"]
                }), e.jsx("button", {
                    onClick: t,
                    className: "w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors",
                    children: "Finish"
                })]
            })
        }) : e.jsxs("div", {
            className: "fixed inset-0 z-[100] bg-zinc-900/95 backdrop-blur-xl flex flex-col items-center p-6 overflow-y-auto custom-scrollbar",
            children: [e.jsx("button", {
                onClick: t,
                className: "fixed top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50",
                children: e.jsx(ge, {
                    className: "w-6 h-6"
                })
            }), e.jsxs("div", {
                className: "w-full max-w-2xl my-auto py-12",
                children: [e.jsxs("div", {
                    className: "flex justify-between items-center mb-8",
                    children: [e.jsxs("div", {
                        className: "flex items-center gap-3",
                        children: [e.jsx("div", {
                            className: "w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20",
                            children: e.jsx(ee, {
                                className: "w-6 h-6 text-brand-500"
                            })
                        }), e.jsxs("div", {
                            children: [e.jsx("h2", {
                                className: "text-xl font-bold text-white",
                                children: "Recall Session"
                            }), e.jsx("p", {
                                className: "text-sm text-zinc-400",
                                children: n.subjectName
                            })]
                        })]
                    }), e.jsx("div", {
                        className: "flex items-center gap-2",
                        children: e.jsxs("div", {
                            className: "text-zinc-400 font-mono bg-white/5 px-4 py-2 rounded-xl border border-white/5",
                            children: [e.jsx("span", {
                                className: "text-white font-bold",
                                children: o + 1
                            }), " /", " ", i.length]
                        })
                    })]
                }), e.jsxs(A.div, {
                    layout: !0,
                    className: "w-full bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-white/10 rounded-[2rem] shadow-2xl overflow-hidden",
                    onClick: () => !d && w(!0),
                    children: [e.jsxs(A.div, {
                        layout: !0,
                        className: `p-10 md:p-12 flex flex-col items-center justify-center text-center ${d?"":"cursor-pointer"}`,
                        children: [e.jsx("div", {
                            className: "text-sm font-bold text-brand-500 dark:text-brand-400 uppercase tracking-widest mb-6",
                            children: "Topic Summary"
                        }), e.jsx("h3", {
                            className: "text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-6 leading-tight",
                            children: n.title
                        }), e.jsx("p", {
                            className: "text-lg text-zinc-600 dark:text-zinc-400 max-w-md leading-relaxed",
                            children: "Explain the key concepts, formulas, and details of this topic out loud or write them down."
                        }), !d && e.jsx(A.div, {
                            initial: {
                                opacity: 0,
                                y: 10
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            className: "mt-12 text-zinc-500 font-medium tracking-wide flex flex-col items-center gap-2 animate-bounce cursor-pointer",
                            children: e.jsx("span", {
                                children: "Tap anywhere to reveal"
                            })
                        })]
                    }), e.jsx(ie, {
                        children: d && e.jsx(A.div, {
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
                            className: "border-t border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-white/[0.02]",
                            children: e.jsxs("div", {
                                className: "p-8 md:p-10",
                                children: [e.jsxs("div", {
                                    className: "text-center mb-8",
                                    children: [e.jsx("h3", {
                                        className: "text-xl font-bold text-zinc-900 dark:text-white mb-2",
                                        children: "How well did you recall this?"
                                    }), e.jsx("p", {
                                        className: "text-sm text-zinc-500",
                                        children: "Pick the honestly assessed difficulty level"
                                    })]
                                }), e.jsxs("div", {
                                    className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                                    children: [e.jsxs("button", {
                                        onClick: b => {
                                            b.stopPropagation(), m("again")
                                        },
                                        disabled: j,
                                        className: "group p-5 bg-white dark:bg-white/5 border border-rose-200 dark:border-rose-500/20 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl transition-all shadow-sm hover:shadow-md text-left flex flex-col gap-1 items-center text-center",
                                        children: [e.jsx("span", {
                                            className: "text-rose-500 dark:text-rose-400 font-bold text-lg",
                                            children: "Again"
                                        }), e.jsx("span", {
                                            className: "text-xs text-zinc-500 dark:text-zinc-400",
                                            children: "Completely forgot"
                                        })]
                                    }), e.jsxs("button", {
                                        onClick: b => {
                                            b.stopPropagation(), m("hard")
                                        },
                                        disabled: j,
                                        className: "group p-5 bg-white dark:bg-white/5 border border-orange-200 dark:border-orange-500/20 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-2xl transition-all shadow-sm hover:shadow-md text-left flex flex-col gap-1 items-center text-center",
                                        children: [e.jsx("span", {
                                            className: "text-orange-500 dark:text-orange-400 font-bold text-lg",
                                            children: "Hard"
                                        }), e.jsx("span", {
                                            className: "text-xs text-zinc-500 dark:text-zinc-400",
                                            children: "Struggled to remember"
                                        })]
                                    }), e.jsxs("button", {
                                        onClick: b => {
                                            b.stopPropagation(), m("good")
                                        },
                                        disabled: j,
                                        className: "group p-5 bg-white dark:bg-white/5 border border-blue-200 dark:border-blue-500/20 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-2xl transition-all shadow-sm hover:shadow-md text-left flex flex-col gap-1 items-center text-center",
                                        children: [e.jsx("span", {
                                            className: "text-blue-500 dark:text-blue-400 font-bold text-lg",
                                            children: "Good"
                                        }), e.jsx("span", {
                                            className: "text-xs text-zinc-500 dark:text-zinc-400",
                                            children: "Remembered with effort"
                                        })]
                                    }), e.jsxs("button", {
                                        onClick: b => {
                                            b.stopPropagation(), m("easy")
                                        },
                                        disabled: j,
                                        className: "group p-5 bg-white dark:bg-white/5 border border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-2xl transition-all shadow-sm hover:shadow-md text-left flex flex-col gap-1 items-center text-center",
                                        children: [e.jsx("span", {
                                            className: "text-emerald-500 dark:text-emerald-400 font-bold text-lg",
                                            children: "Easy"
                                        }), e.jsx("span", {
                                            className: "text-xs text-zinc-500 dark:text-zinc-400",
                                            children: "Perfect recall"
                                        })]
                                    })]
                                })]
                            })
                        })
                    })]
                })]
            })]
        })
    },
    es = ({
        isOpen: t,
        onClose: r,
        strategy: a,
        onRegenerate: x,
        isGenerating: i = !1
    }) => {
        const {
            addTask: o
        } = et(), [s, d] = gt.useState(null);
        if (!t) return null;
        const w = async f => {
            d(f);
            try {
                await o({
                    title: f,
                    status: "todo",
                    priority: "p2",
                    dueDate: new Date().toISOString(),
                    effort: 45,
                    energy: "medium",
                    subtasks: [],
                    subject: "AI Recommendation"
                }), setTimeout(() => d(null), 2e3)
            } catch {
                d(null)
            }
        };
        return e.jsx(ie, {
            children: e.jsxs("div", {
                className: "fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6",
                children: [e.jsx(A.div, {
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    exit: {
                        opacity: 0
                    },
                    onClick: r,
                    className: "absolute inset-0 bg-black/80 backdrop-blur-md"
                }), e.jsxs(A.div, {
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
                    className: "relative w-full max-w-4xl max-h-[90vh] bg-[#0c0c0e] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col",
                    children: [e.jsxs("div", {
                        className: "p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-brand-500/10 to-transparent",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [e.jsx("div", {
                                className: "w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/30",
                                children: e.jsx(ne, {
                                    className: "w-6 h-6 text-white"
                                })
                            }), e.jsxs("div", {
                                children: [e.jsx("h2", {
                                    className: "text-xl font-bold text-white leading-tight",
                                    children: "AI Study Strategy"
                                }), e.jsxs("div", {
                                    className: "text-xs text-zinc-500 flex items-center gap-2",
                                    children: [e.jsxs("span", {
                                        children: ["Generated on", " ", a ? U(new Date(a.updatedAt), "MMM d, h:mm a") : "N/A"]
                                    }), e.jsx("span", {
                                        className: "w-1 h-1 rounded-full bg-zinc-700"
                                    }), e.jsx("span", {
                                        className: "text-brand-400",
                                        children: "Personalized Insights"
                                    })]
                                })]
                            })]
                        }), e.jsx("button", {
                            onClick: r,
                            className: "p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors",
                            children: e.jsx(ge, {
                                className: "w-5 h-5"
                            })
                        })]
                    }), e.jsx("div", {
                        className: "flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar",
                        children: i ? e.jsxs("div", {
                            className: "flex flex-col items-center justify-center py-20 text-center",
                            children: [e.jsxs("div", {
                                className: "relative mb-6",
                                children: [e.jsx("div", {
                                    className: "w-16 h-16 rounded-full border-2 border-brand-500/20 animate-ping absolute inset-0"
                                }), e.jsx("div", {
                                    className: "w-16 h-16 rounded-full border-2 border-t-brand-500 border-zinc-800 animate-spin"
                                })]
                            }), e.jsx("h3", {
                                className: "text-lg font-bold text-white mb-2",
                                children: "Analyzing Your Progress..."
                            }), e.jsx("p", {
                                className: "text-zinc-500 max-w-xs mx-auto text-sm",
                                children: "Isotope AI is crunching your exam dates, syllabus coverage, and performance trends to build your perfect plan."
                            })]
                        }) : a ? e.jsxs("div", {
                            className: "space-y-8",
                            children: [e.jsx("div", {
                                className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                                children: [{
                                    label: "Key Focus",
                                    color: "emerald",
                                    icon: ee,
                                    item: a.actionItems[0]
                                }, {
                                    label: "Quick Action",
                                    color: "amber",
                                    icon: Z,
                                    item: a.actionItems[1]
                                }, {
                                    label: "Deadline Goal",
                                    color: "blue",
                                    icon: pe,
                                    item: a.actionItems[2]
                                }].map((f, p) => e.jsxs("div", {
                                    className: "group/card p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-3 hover:bg-white/[0.08] transition-all",
                                    children: [e.jsxs("div", {
                                        className: "flex items-start justify-between",
                                        children: [e.jsx("div", {
                                            className: Y("p-2 rounded-lg", f.color === "emerald" ? "bg-emerald-500/10 text-emerald-500" : f.color === "amber" ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"),
                                            children: e.jsx(f.icon, {
                                                className: "w-4 h-4"
                                            })
                                        }), e.jsx("button", {
                                            onClick: () => w(f.item),
                                            disabled: s === f.item,
                                            className: Y("p-2 rounded-lg bg-white/5 opacity-0 group-hover/card:opacity-100 transition-all", s === f.item ? "text-emerald-500" : "text-zinc-500 hover:text-white"),
                                            children: s === f.item ? e.jsx(rt, {
                                                className: "w-4 h-4"
                                            }) : e.jsx(ce, {
                                                className: "w-4 h-4"
                                            })
                                        })]
                                    }), e.jsxs("div", {
                                        children: [e.jsx("div", {
                                            className: "text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1",
                                            children: f.label
                                        }), e.jsx("div", {
                                            className: "text-sm text-zinc-200 font-medium leading-relaxed",
                                            children: f.item
                                        })]
                                    })]
                                }, p))
                            }), e.jsxs("div", {
                                className: "bg-zinc-900/40 rounded-3xl p-6 md:p-8 border border-white/5 relative overflow-hidden",
                                children: [e.jsx("div", {
                                    className: "absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none",
                                    children: e.jsx(ne, {
                                        className: "w-64 h-64 text-brand-500"
                                    })
                                }), e.jsx(Yt, {
                                    content: a.content,
                                    enableCodeHighlight: !1
                                })]
                            }), e.jsxs("div", {
                                className: "flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5",
                                children: [e.jsxs("button", {
                                    onClick: x,
                                    className: "flex-1 px-6 py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-brand-600/20 active:scale-[0.98] flex items-center justify-center gap-2",
                                    children: [e.jsx(Z, {
                                        className: "w-4 h-4"
                                    }), "Refine Strategy"]
                                }), e.jsxs("div", {
                                    className: "flex gap-2",
                                    children: [e.jsxs("button", {
                                        className: "flex-1 sm:flex-none p-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all flex items-center justify-center gap-2 border border-white/5",
                                        children: [e.jsx(It, {
                                            className: "w-4 h-4"
                                        }), e.jsx("span", {
                                            className: "sm:hidden",
                                            children: "Export"
                                        })]
                                    }), e.jsxs("button", {
                                        className: "flex-1 sm:flex-none p-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all flex items-center justify-center gap-2 border border-white/5",
                                        onClick: () => {
                                            a && (navigator.clipboard.writeText(a.content), alert("Strategy copied to clipboard!"))
                                        },
                                        children: [e.jsx(Rt, {
                                            className: "w-4 h-4"
                                        }), e.jsx("span", {
                                            className: "sm:hidden",
                                            children: "Copy"
                                        })]
                                    })]
                                })]
                            })]
                        }) : e.jsxs("div", {
                            className: "flex flex-col items-center justify-center py-20 text-center",
                            children: [e.jsx("div", {
                                className: "w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6",
                                children: e.jsx(ee, {
                                    className: "w-8 h-8 text-zinc-600"
                                })
                            }), e.jsx("h3", {
                                className: "text-xl font-bold text-white mb-2",
                                children: "No Strategy Generated Yet"
                            }), e.jsx("p", {
                                className: "text-zinc-500 max-w-sm mx-auto mb-8",
                                children: "Get a personalized, data-driven study plan based on your current subjects, exams, and performance."
                            }), e.jsxs("button", {
                                onClick: x,
                                className: "px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-brand-600/20 flex items-center gap-2",
                                children: [e.jsx(ne, {
                                    className: "w-4 h-4"
                                }), "Generate My Strategy"]
                            })]
                        })
                    })]
                })]
            })
        })
    },
    ts = ({
        onAddExam: t,
        onEditSubject: r
    }) => {
        const a = De(),
            {
                subjects: x
            } = te(),
            i = tt(h => h.sessions),
            {
                exams: o,
                deleteExam: s
            } = oe(),
            {
                studyStrategy: d,
                generateStudyStrategy: w,
                isLoading: f
            } = Ht(),
            [p, j] = g.useState(!1),
            u = Array.isArray(x) ? x : [],
            n = Array.isArray(o) ? o : [],
            m = g.useMemo(() => Gt(Array.isArray(i) ? i : [], Array.isArray(x) ? x : []), [i, x]),
            b = Array.isArray(d ?.actionItems) ? d.actionItems : [],
            c = h => {
                const y = new Date(h),
                    z = new Date;
                y.setHours(0, 0, 0, 0), z.setHours(0, 0, 0, 0);
                const L = y.getTime() - z.getTime();
                return Math.ceil(L / (1e3 * 3600 * 24))
            },
            k = async (h, y) => {
                y.stopPropagation(), window.confirm("Are you sure you want to delete this exam?") && await s(h)
            };
        return e.jsxs("div", {
            className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8",
            children: [e.jsxs("div", {
                className: "app-card bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-white/5 rounded-2xl p-5 relative overflow-hidden group shadow-sm dark:shadow-none",
                children: [e.jsx("div", {
                    className: "absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity",
                    children: e.jsx(pe, {
                        className: "w-16 h-16 text-brand-500"
                    })
                }), e.jsxs("div", {
                    className: "flex items-center justify-between mb-4 relative z-10",
                    children: [e.jsx("h3", {
                        className: "text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider",
                        children: "Exam Countdown"
                    }), e.jsx("button", {
                        type: "button",
                        onClick: h => {
                            h.stopPropagation(), t()
                        },
                        className: "p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all active:scale-95 cursor-pointer",
                        title: "Schedule New Exam",
                        children: e.jsx(ce, {
                            className: "w-3.5 h-3.5"
                        })
                    })]
                }), n.filter(h => !h.deletedAt && c(h.date) >= 0).length === 0 ? e.jsx(it, {
                    onAdd: t,
                    className: "py-4 bg-transparent border-dashed"
                }) : e.jsx("div", {
                    className: "max-h-[min(26rem,60vh)] overflow-y-auto custom-scrollbar space-y-3 pr-2 min-h-0",
                    children: n.filter(h => !h.deletedAt && c(h.date) >= 0).sort((h, y) => _(h.date).getTime() - _(y.date).getTime()).map((h, y) => {
                        const z = c(h.date),
                            L = z <= 7 ? "rose" : z <= 30 ? "amber" : "emerald",
                            E = {
                                rose: {
                                    bg: "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-500/10 via-rose-500/5 to-transparent",
                                    border: "border-rose-500/20 hover:border-rose-500/40",
                                    text: "text-rose-500",
                                    badgeBg: "bg-rose-500/10 text-rose-400"
                                },
                                amber: {
                                    bg: "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-amber-500/5 to-transparent",
                                    border: "border-amber-500/20 hover:border-amber-500/40",
                                    text: "text-amber-500",
                                    badgeBg: "bg-amber-500/10 text-amber-400"
                                },
                                emerald: {
                                    bg: "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-emerald-500/5 to-transparent",
                                    border: "border-emerald-500/20 hover:border-emerald-500/40",
                                    text: "text-emerald-500",
                                    badgeBg: "bg-emerald-500/10 text-emerald-400"
                                }
                            }[L];
                        return e.jsx(A.div, {
                            layoutId: `exam-${h.id}`,
                            onClick: () => a(`/exams/${h.id}`),
                            className: `group/exam cursor-pointer relative overflow-hidden rounded-2xl border transition-all duration-300 p-4 ${E.bg} ${E.border}`,
                            children: e.jsxs("div", {
                                className: "flex items-center justify-between relative z-10",
                                children: [e.jsxs("div", {
                                    className: "flex items-center gap-3",
                                    children: [e.jsx("button", {
                                        onClick: H => k(h.id, H),
                                        className: "p-1.5 rounded-lg bg-black/20 hover:bg-rose-500/20 text-zinc-500 hover:text-rose-500 transition-colors opacity-0 group-hover/exam:opacity-100 absolute -left-2",
                                        children: e.jsx(st, {
                                            className: "w-3.5 h-3.5"
                                        })
                                    }), e.jsxs("div", {
                                        className: "transform transition-transform duration-300 group-hover/exam:translate-x-6",
                                        children: [e.jsx("div", {
                                            className: "text-zinc-900 dark:text-zinc-100 font-bold text-sm tracking-tight truncate max-w-[130px]",
                                            children: h.title
                                        }), e.jsx("div", {
                                            className: "text-[11px] text-zinc-500 dark:text-zinc-400 font-medium mt-0.5",
                                            children: _(h.date).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric"
                                            })
                                        })]
                                    })]
                                }), e.jsx("div", {
                                    className: "text-right flex flex-col items-end shrink-0",
                                    children: e.jsxs("div", {
                                        className: `px-3 py-1.5 rounded-xl ${E.badgeBg} flex items-baseline gap-1.5 backdrop-blur-md border border-white/5`,
                                        children: [e.jsx("span", {
                                            className: "text-xl font-black tracking-tighter leading-none",
                                            children: z
                                        }), e.jsx("span", {
                                            className: "text-[10px] font-bold uppercase tracking-widest opacity-80",
                                            children: z === 1 ? "DAY" : "DAYS"
                                        })]
                                    })
                                })]
                            })
                        }, h.id)
                    })
                })]
            }), e.jsxs("div", {
                className: "app-card bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-white/5 rounded-2xl p-5 relative overflow-hidden shadow-sm dark:shadow-none flex flex-col",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-2 mb-4",
                    children: [e.jsx("div", {
                        className: "p-1.5 rounded-lg bg-brand-500/10",
                        children: e.jsx(ee, {
                            className: "w-3.5 h-3.5 text-brand-500"
                        })
                    }), e.jsx("h3", {
                        className: "text-zinc-600 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider",
                        children: "Syllabus Coverage"
                    })]
                }), u.length === 0 ? e.jsx("div", {
                    className: "text-center py-8 text-zinc-400 text-sm",
                    children: "Add subjects to track coverage"
                }) : e.jsx("div", {
                    className: "max-h-[min(26rem,60vh)] overflow-y-auto overscroll-contain custom-scrollbar space-y-3 pr-2 min-h-0",
                    children: u.map((h, y) => {
                        const z = h.chapters.reduce((M, G) => M + G.topics.length, 0),
                            L = h.chapters.reduce((M, G) => M + G.topics.filter(D => D.completed).length, 0),
                            I = z > 0 ? Math.round(L / z * 100) : 0,
                            E = m.bySubject[h.id] || 0,
                            H = E > 0 ? T(Math.round(E), "minutes") : "—",
                            V = I >= 80 ? "text-emerald-400" : I >= 45 ? "text-amber-400" : "text-brand-400";
                        return e.jsxs(A.div, {
                            initial: {
                                opacity: 0,
                                y: 10
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            transition: {
                                delay: y * .05,
                                duration: .3
                            },
                            className: "relative overflow-hidden rounded-2xl border border-zinc-200/50 dark:border-white/[0.05] hover:border-zinc-300 dark:hover:border-white/[0.1] hover:shadow-md transition-all group/sub bg-zinc-50/50 dark:bg-[#121215]",
                            children: [e.jsx("div", {
                                className: "absolute top-0 right-0 w-32 h-32 opacity-10 dark:opacity-20 blur-[40px] rounded-full mix-blend-screen pointer-events-none transition-opacity group-hover/sub:opacity-30",
                                style: {
                                    backgroundImage: je(h.gradient, "to bottom right")
                                }
                            }), e.jsxs("div", {
                                className: "relative z-10 p-3.5 flex flex-col gap-3",
                                children: [e.jsxs("div", {
                                    className: "flex items-center gap-3.5",
                                    children: [e.jsx("div", {
                                        className: "w-11 h-11 rounded-[14px] flex items-center justify-center text-sm shrink-0 shadow-sm border border-black/5 dark:border-white/10",
                                        style: {
                                            backgroundImage: je(h.gradient, "to bottom right")
                                        },
                                        children: e.jsx(Ie, {
                                            icon: h.icon,
                                            name: h.name,
                                            className: "w-[22px] h-[22px] text-white drop-shadow-sm"
                                        })
                                    }), e.jsxs("div", {
                                        className: "flex-1 min-w-0 flex flex-col justify-center",
                                        children: [e.jsxs("div", {
                                            className: "flex items-center justify-between mb-1",
                                            children: [e.jsx("span", {
                                                className: "text-zinc-800 dark:text-zinc-100 font-bold text-[15px] tracking-tight truncate pr-2",
                                                children: h.name
                                            }), e.jsxs("span", {
                                                className: `font-black tracking-tight text-[15px] tabular-nums drop-shadow-sm ${V}`,
                                                children: [I, "%"]
                                            })]
                                        }), e.jsxs("div", {
                                            className: "flex items-center gap-3 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400",
                                            children: [e.jsxs("div", {
                                                className: "flex items-center gap-1.5",
                                                title: "Completed Topics",
                                                children: [e.jsx(rt, {
                                                    className: "w-3.5 h-3.5 text-emerald-500/90"
                                                }), e.jsxs("span", {
                                                    className: "tabular-nums tracking-tight",
                                                    children: [L, "/", z]
                                                })]
                                            }), e.jsx("div", {
                                                className: "w-[3px] h-[3px] rounded-full bg-zinc-300 dark:bg-white/15"
                                            }), e.jsxs("div", {
                                                className: "flex items-center gap-1.5",
                                                title: "Time Spent",
                                                children: [e.jsx(Ce, {
                                                    className: "w-3 h-3 text-sky-500/90"
                                                }), e.jsx("span", {
                                                    className: "tabular-nums tracking-tight",
                                                    children: H
                                                })]
                                            }), e.jsx("div", {
                                                className: "w-[3px] h-[3px] rounded-full bg-zinc-300 dark:bg-white/15"
                                            }), e.jsxs("div", {
                                                className: "flex items-center gap-1.5",
                                                title: "Chapters",
                                                children: [e.jsx(_t, {
                                                    className: "w-3 h-3 text-violet-500/90"
                                                }), e.jsxs("span", {
                                                    className: "tabular-nums tracking-tight",
                                                    children: [h.chapters.length, " ", e.jsx("span", {
                                                        className: "opacity-70 text-[10px]",
                                                        children: "ch"
                                                    })]
                                                })]
                                            })]
                                        })]
                                    })]
                                }), e.jsx("div", {
                                    className: "h-1.5 w-full bg-zinc-200/60 dark:bg-white/5 rounded-full overflow-hidden flex shadow-inner",
                                    children: e.jsx(A.div, {
                                        initial: {
                                            width: 0
                                        },
                                        animate: {
                                            width: `${I}%`
                                        },
                                        transition: {
                                            duration: 1,
                                            ease: [.34, 1.56, .64, 1],
                                            delay: y * .1 + .2
                                        },
                                        className: "h-full rounded-full relative",
                                        style: {
                                            backgroundImage: je(h.gradient, "to right")
                                        }
                                    })
                                })]
                            })]
                        }, h.id)
                    })
                })]
            }), e.jsxs("div", {
                className: "bg-gradient-to-br from-amber-500/5 to-orange-600/5 dark:from-amber-500/10 dark:to-orange-600/10 border border-amber-500/20 rounded-2xl p-5 relative overflow-hidden group shadow-sm dark:shadow-none",
                children: [e.jsx("div", {
                    className: "absolute top-0 right-0 p-4 opacity-20",
                    children: e.jsx(Z, {
                        className: "w-16 h-16 text-amber-500"
                    })
                }), e.jsx("h3", {
                    className: "text-amber-500 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2",
                    children: f ? e.jsxs(e.Fragment, {
                        children: [e.jsx(A.div, {
                            animate: {
                                rotate: 360
                            },
                            transition: {
                                duration: 2,
                                repeat: 1 / 0,
                                ease: "linear"
                            },
                            children: e.jsx(Fe, {
                                className: "w-3 h-3"
                            })
                        }), "Generating Strategy..."]
                    }) : e.jsxs(e.Fragment, {
                        children: [e.jsx(ne, {
                            className: "w-3 h-3"
                        }), "AI Study Co-Pilot"]
                    })
                }), d ? e.jsxs(e.Fragment, {
                    children: [e.jsx("div", {
                        className: "text-zinc-900 dark:text-white font-extrabold text-2xl tracking-tight mb-4 flex items-center gap-2",
                        children: e.jsx("span", {
                            className: "bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-400",
                            children: "7-Day Blueprint"
                        })
                    }), e.jsx("div", {
                        className: "max-h-[min(20rem,50vh)] overflow-y-auto custom-scrollbar space-y-4 mb-6 pr-2 min-h-0",
                        children: b.map((h, y) => e.jsxs(A.div, {
                            initial: {
                                opacity: 0,
                                x: -10
                            },
                            animate: {
                                opacity: 1,
                                x: 0
                            },
                            transition: {
                                delay: y * .1
                            },
                            className: "flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500/10 transition-colors",
                            children: [e.jsx("div", {
                                className: "mt-1.5 w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] shrink-0"
                            }), e.jsx("span", {
                                className: "text-sm font-medium text-zinc-700 dark:text-zinc-200 leading-snug",
                                children: h
                            })]
                        }, y))
                    }), e.jsxs("div", {
                        className: "flex gap-3 mt-auto",
                        children: [e.jsx("button", {
                            onClick: () => j(!0),
                            className: "flex-1 px-4 py-3 bg-amber-500 hover:bg-amber-400 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98]",
                            children: "View Full Masterplan"
                        }), e.jsx("button", {
                            onClick: () => w(),
                            className: "p-2 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-lg transition-colors border border-white/5",
                            title: "Regenerate",
                            disabled: f,
                            children: e.jsx(Fe, {
                                className: Y("w-4 h-4", f && "animate-spin")
                            })
                        })]
                    })]
                }) : e.jsxs(e.Fragment, {
                    children: [e.jsx("div", {
                        className: "text-zinc-900 dark:text-white font-bold text-lg mb-2",
                        children: "Optimize Your Prep"
                    }), e.jsx("p", {
                        className: "text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-4 font-medium",
                        children: "Analyze your current progress and get a personalized, data-driven study strategy for the upcoming week."
                    }), e.jsx("button", {
                        onClick: () => w(),
                        disabled: f,
                        className: "w-full px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-900/20 active:scale-[0.98] flex items-center justify-center gap-2",
                        children: f ? "Analyzing..." : e.jsxs(e.Fragment, {
                            children: [e.jsx(Z, {
                                className: "w-4 h-4"
                            }), "Generate AI Strategy"]
                        })
                    })]
                }), e.jsx(es, {
                    isOpen: p,
                    onClose: () => j(!1),
                    strategy: d,
                    onRegenerate: () => w(),
                    isGenerating: f
                })]
            })]
        })
    },
    ss = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function as({
    initialMonth: t,
    selectedDateKey: r,
    dayDataByKey: a = {},
    getDateKey: x,
    renderDayContent: i,
    onDaySelect: o,
    onDayHoverStart: s,
    onDayHoverEnd: d,
    onDayFocus: w,
    onDayBlur: f,
    disableFutureMonths: p = !1,
    legend: j,
    headerActions: u,
    className: n
}) {
    const m = g.useMemo(() => new Date, []),
        [b, c] = g.useState(() => re(t ?? m)),
        k = re(b),
        h = yt(k),
        y = Vt(Bt(b)),
        z = Wt({
            start: h,
            end: y
        }),
        L = z.length > 35 ? "grid-rows-6" : "grid-rows-5",
        I = x(m),
        E = g.useMemo(() => p ? re(we(b, 1)).getTime() <= re(m).getTime() : !0, [p, m, b]),
        H = () => {
            c(re(m))
        },
        V = () => {
            E && c(M => we(M, 1))
        };
    return e.jsxs("div", {
        className: Y("w-full", n),
        children: [e.jsxs("div", {
            className: "flex flex-col gap-3 px-1 pb-4 md:flex-row md:items-center md:justify-between",
            children: [e.jsx("div", {
                className: "flex items-center gap-3",
                children: e.jsx("h3", {
                    className: "text-xl font-display font-bold text-zinc-800 dark:text-zinc-100 tracking-tight md:text-2xl",
                    children: U(b, "MMMM yyyy")
                })
            }), e.jsxs("div", {
                className: "flex items-center justify-between gap-3 sm:justify-end",
                children: [u ?.({
                    visibleMonth: b,
                    goToToday: H
                }), e.jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [e.jsx("button", {
                        type: "button",
                        "aria-label": "Previous month",
                        onClick: () => c(M => we(M, -1)),
                        className: "rounded-xl border border-zinc-200 bg-zinc-100 p-2 text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:border-white/5 dark:bg-white/5 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white dark:focus-visible:ring-offset-[#0c0c0e]",
                        children: e.jsx(Lt, {
                            className: "h-5 w-5"
                        })
                    }), e.jsx("button", {
                        type: "button",
                        "aria-label": "Next month",
                        onClick: V,
                        disabled: !E,
                        className: Y("rounded-xl border border-zinc-200 bg-zinc-100 p-2 text-zinc-500 transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:border-white/5 dark:bg-white/5 dark:text-zinc-400 dark:focus-visible:ring-offset-[#0c0c0e]", E ? "hover:bg-zinc-200 hover:text-zinc-900 dark:hover:bg-white/10 dark:hover:text-white" : "cursor-not-allowed opacity-30"),
                        children: e.jsx(at, {
                            className: "h-5 w-5"
                        })
                    })]
                })]
            })]
        }), j && e.jsx("div", {
            className: "mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 px-1 text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400",
            children: j
        }), e.jsxs("div", {
            className: "app-calendar-shell overflow-hidden rounded-3xl border border-zinc-200/70 bg-white/70 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.35)] backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-900/50",
            children: [e.jsx("div", {
                className: "app-calendar-header sticky top-0 z-10 grid grid-cols-7 border-b border-zinc-200/70 bg-white/90 dark:border-zinc-800/60 dark:bg-[#0f0f11]/95",
                children: ss.map((M, G) => e.jsx("div", {
                    className: Y("py-2.5 text-center text-[9px] font-bold uppercase tracking-[0.16em] sm:py-3 sm:text-[10px] sm:tracking-[0.24em]", G === 0 || G === 6 ? "text-zinc-400 dark:text-zinc-600" : "text-zinc-500 dark:text-zinc-400"),
                    children: M
                }, M))
            }), e.jsx("div", {
                className: Y("grid grid-cols-7", L),
                role: "grid",
                "aria-label": U(b, "MMMM yyyy"),
                children: z.map((M, G) => {
                    const D = new Date(M.getFullYear(), M.getMonth(), M.getDate(), 12, 0, 0, 0),
                        B = x(D),
                        C = {
                            date: M,
                            dateKey: B,
                            data: a[B],
                            index: G,
                            isCurrentMonth: M.getMonth() === b.getMonth(),
                            isToday: B === I,
                            isSelected: r === B
                        },
                        W = C.isCurrentMonth && !!o;
                    return e.jsxs(A.div, {
                        initial: {
                            opacity: 0
                        },
                        animate: {
                            opacity: 1
                        },
                        transition: {
                            delay: G * .01
                        },
                        role: "gridcell",
                        "aria-selected": C.isSelected,
                        "aria-current": C.isToday ? "date" : void 0,
                        "aria-label": U(M, "EEEE, MMMM d, yyyy"),
                        tabIndex: W ? 0 : -1,
                        onClick: () => W && o ?.(C),
                        onMouseEnter: () => C.isCurrentMonth && s ?.(C),
                        onMouseLeave: () => C.isCurrentMonth && d ?.(C),
                        onFocus: () => C.isCurrentMonth && w ?.(C),
                        onBlur: () => C.isCurrentMonth && f ?.(C),
                        onKeyDown: q => {
                            W && (q.key === "Enter" || q.key === " ") && (q.preventDefault(), o ?.(C))
                        },
                        className: Y("group/day relative flex min-h-[88px] flex-col border-b border-r border-zinc-100/80 p-1.5 transition-colors sm:min-h-[104px] sm:p-2 md:min-h-[112px] md:p-2.5 lg:min-h-[128px] dark:border-zinc-800/40", C.isCurrentMonth ? "app-calendar-hover bg-transparent hover:bg-white/60 dark:hover:bg-zinc-800/40" : "app-calendar-outside pointer-events-none bg-zinc-50/40 opacity-30 dark:bg-zinc-950/20", C.isSelected && "ring-2 ring-brand-500/50 ring-inset dark:ring-brand-400/50", W && "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-inset", (G + 1) % 7 === 0 && "border-r-0"),
                        children: [e.jsx("div", {
                            className: "mb-1 flex items-start justify-between gap-2 sm:mb-1.5",
                            children: e.jsx("div", {
                                className: Y("flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors sm:h-7 sm:w-7 md:text-sm", C.isToday ? "bg-zinc-900 text-white shadow-sm dark:bg-white dark:text-zinc-900" : C.isCurrentMonth ? "text-zinc-700 dark:text-zinc-300" : "text-zinc-400 dark:text-zinc-700"),
                                children: U(M, "d")
                            })
                        }), i(C)]
                    }, M.toISOString())
                })
            })]
        })]
    })
}
const We = {
        exams: [],
        tasks: [],
        sessions: [],
        studyMinutes: 0,
        taskDurationMinutes: 0,
        taskActualMinutes: 0
    },
    Ve = {
        p1: 0,
        p2: 1,
        p3: 2,
        p4: 3
    },
    Ke = {
        high: 0,
        medium: 1,
        low: 2
    },
    rs = {
        p1: "#ef4444",
        p2: "#f97316",
        p3: "#f59e0b",
        p4: "#10b981"
    },
    Se = "#fb7185",
    ns = 320,
    is = 420,
    Qe = 14,
    Xe = 16,
    ls = 300,
    ds = 2,
    ve = t => new Date(t.getFullYear(), t.getMonth(), t.getDate(), 12, 0, 0, 0),
    le = (t = 500) => `rgb(var(--brand-${t}))`,
    F = (t, r) => {
        const a = t.replace("#", "");
        if (/^[A-Fa-f0-9]{3}$/.test(a)) {
            const [x, i, o] = a.split("").map(s => parseInt(`${s}${s}`, 16));
            return `rgba(${x}, ${i}, ${o}, ${r})`
        }
        if (/^[A-Fa-f0-9]{6}$/.test(a)) {
            const x = parseInt(a.substring(0, 2), 16),
                i = parseInt(a.substring(2, 4), 16),
                o = parseInt(a.substring(4, 6), 16);
            return `rgba(${x}, ${i}, ${o}, ${r})`
        }
        return `color-mix(in srgb, ${t} ${Math.round(r*100)}%, transparent)`
    },
    os = (t, r) => !!t.isDDay != !!r.isDDay ? t.isDDay ? -1 : 1 : (Ke[t.priority ?? "low"] ?? Number.MAX_SAFE_INTEGER) - (Ke[r.priority ?? "low"] ?? Number.MAX_SAFE_INTEGER) || _(t.date).getTime() - _(r.date).getTime(),
    cs = (t, r) => (Ve[t.priority] ?? Number.MAX_SAFE_INTEGER) - (Ve[r.priority] ?? Number.MAX_SAFE_INTEGER) || _(t.dueDate).getTime() - _(r.dueDate).getTime(),
    xs = (t, r, a, x) => {
        if (t === 0) return;
        const i = le(),
            o = r > 0 ? t / r : 0;
        if (x) return {
            backgroundColor: F(i, a ? .28 : .18),
            borderColor: F(i, a ? .45 : .3)
        };
        const s = a ? .05 + Math.min(o, 1.35) * .16 : .04 + Math.min(o, 1.35) * .11;
        return {
            backgroundColor: F(i, s),
            borderColor: F(i, s + (a ? .08 : .06))
        }
    },
    lt = (t, r, a, x) => t && a.has(t) ? a.get(t) ?? null : r ? x.get(r.trim().toLowerCase()) ?? null : null,
    Re = (t, r, a, x) => {
        const i = lt(t.subjectId, t.subject, r, a);
        return i ?.color ? nt(i.color, x) : rs[t.priority]
    },
    _e = (t, r, a) => lt(t.subjectId, t.subject, r, a) ?.name || t.subject || "General",
    de = (t, r) => ({
        borderColor: r ? "rgba(255, 255, 255, 0.08)" : "rgba(24, 24, 27, 0.08)",
        backgroundColor: r ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.86)",
        boxShadow: `inset 0 1px 0 ${F("#ffffff",r?.02:.45)}`
    }),
    be = (t, r) => ({
        backgroundColor: t,
        boxShadow: `0 0 0 1px ${F(t,r?.24:.14)}`
    }),
    ae = (t, r) => ({
        color: t,
        borderColor: F(t, r ? .34 : .24),
        backgroundColor: F(t, r ? .16 : .1)
    }),
    dt = (t, r) => ({
        backgroundColor: F(t, r ? .14 : .1)
    }),
    ot = t => ({
        background: `linear-gradient(90deg, ${F(t,.92)} 0%, ${t} 100%)`,
        boxShadow: `0 10px 24px -14px ${F(t,.85)}`
    }),
    ms = t => {
        const r = String(t.taskType || t.sessionType || t.type || "other").trim().toLowerCase();
        return {
            theory: "Theory",
            lecture: "Lecture",
            practice: "Practice",
            questions: "Questions",
            revision: "Revision",
            other: "Other",
            manual: "Manual"
        }[r] || `${r.charAt(0).toUpperCase()}${r.slice(1)}`
    },
    ct = t => Object.entries(t).sort((r, a) => a[1] - r[1]).slice(0, 3).map(([r]) => r),
    xt = (t, r = "h-4 w-4") => e.jsx(Ie, {
        icon: t ?.icon,
        name: t ?.name,
        className: r,
        size: "sm"
    }),
    mt = (t, r, a, x) => {
        const i = new Map,
            o = (s, d, w) => {
                const f = s ?.id ?? d.trim().toLowerCase(),
                    p = i.get(f);
                if (p) {
                    p.minutes += w;
                    return
                }
                i.set(f, {
                    id: f,
                    name: s ?.name ?? d,
                    minutes: w,
                    accentColor: s ?.color ? nt(s.color, x) : le(),
                    sessionCount: 0,
                    questionsAttempted: 0,
                    sessionTypes: {}
                })
            };
        return t.forEach(s => {
            const d = ms(s),
                w = Object.entries(s.timeAllocation ?.bySubject ?? {}).filter(([, u]) => u > 0);
            if (w.length > 0) {
                if (w.forEach(([u, n]) => {
                        const m = r.get(u) ?? null;
                        o(m, m ?.name ?? "Focus", n);
                        const b = i.get(m ?.id ?? (m ?.name ?? "focus").trim().toLowerCase());
                        if (b) {
                            b.sessionCount += 1, b.sessionTypes[d] = (b.sessionTypes[d] || 0) + 1;
                            const c = s.questionsBySubject ?.[u] ?.attempted;
                            typeof c == "number" && (b.questionsAttempted += c)
                        }
                    }), !s.questionsBySubject && (s.questionsAttempted || 0) > 0) {
                    const u = (s.questionsAttempted || 0) / w.length;
                    w.forEach(([n]) => {
                        const m = r.get(n) ?? null,
                            b = i.get(m ?.id ?? (m ?.name ?? "focus").trim().toLowerCase());
                        b && (b.questionsAttempted += u)
                    })
                }
                return
            }
            const f = s.subjectIds ?.length ? s.subjectIds : s.subjectId ? [s.subjectId] : [];
            if (f.length > 0) {
                const u = s.duration / f.length,
                    n = (s.questionsAttempted || 0) / f.length;
                f.forEach(m => {
                    const b = r.get(m) ?? null;
                    o(b, b ?.name ?? s.subject ?? "Focus", u);
                    const c = i.get(b ?.id ?? (b ?.name ?? "focus").trim().toLowerCase());
                    c && (c.sessionCount += 1, c.sessionTypes[d] = (c.sessionTypes[d] || 0) + 1, s.questionsBySubject ?.[m] ?.attempted !== void 0 ? c.questionsAttempted += s.questionsBySubject[m].attempted : c.questionsAttempted += n)
                });
                return
            }
            const p = s.subject ? a.get(s.subject.trim().toLowerCase()) ?? null : null;
            o(p, p ?.name ?? s.subject ?? "Focus", s.duration);
            const j = i.get((p ?.id ?? p ?.name ?? s.subject ?? "focus").trim().toLowerCase());
            j && (j.sessionCount += 1, j.sessionTypes[d] = (j.sessionTypes[d] || 0) + 1, j.questionsAttempted += s.questionsAttempted || 0)
        }), Array.from(i.values()).sort((s, d) => d.minutes - s.minutes)
    },
    ht = (t, r, a = !1) => {
        const x = t.subjectId ? r.get(t.subjectId) : null,
            i = x ?.chapters.find(d => d.id === t.chapterId),
            o = i ?.topics.find(d => d.id === t.topicId);
        return (a ? [t.subject || x ?.name || "General", i ?.title, o ?.title] : [i ?.title, o ?.title]).filter(Boolean).join(" • ")
    },
    hs = t => {
        if (!t.subjectId || !t.chapterId && !t.topicId) return null;
        const r = new URLSearchParams({
            subjectId: t.subjectId
        });
        return t.chapterId && r.set("chapterId", t.chapterId), t.topicId && r.set("topicId", t.topicId), `/syllabus?${r.toString()}`
    },
    us = (t, r, a, x) => {
        const i = t.tasks.map(s => {
                const d = Re(s, r, a, x);
                return {
                    id: s.id,
                    type: "task",
                    title: s.title,
                    accentColor: d,
                    surfaceStyle: de(d, x),
                    indicatorStyle: be(d, x),
                    subjectLabel: _e(s, r, a),
                    priorityLabel: s.priority.toUpperCase(),
                    durationLabel: T(s.effort),
                    actualLabel: (s.totalFocusTime || 0) > 0 ? T(s.totalFocusTime || 0) : void 0,
                    isSyllabusLinked: !!(s.chapterId || s.topicId)
                }
            }),
            o = t.exams.map(s => {
                const d = s.isDDay ? le() : Se;
                return {
                    id: s.id,
                    type: "exam",
                    title: s.title,
                    accentColor: d,
                    surfaceStyle: {
                        borderColor: F(d, s.isDDay ? .32 : .24),
                        backgroundColor: F(d, s.isDDay ? .16 : .12)
                    },
                    indicatorStyle: be(d, x),
                    priorityLabel: s.isDDay ? "D-Day" : (s.priority ?? "Exam").toUpperCase(),
                    isDDay: !!s.isDDay
                }
            });
        return [...i, ...o]
    },
    Ne = ({
        icon: t,
        title: r,
        count: a,
        children: x
    }) => e.jsxs("div", {
        className: "space-y-3",
        children: [e.jsxs("div", {
            className: "flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400",
            children: [t, e.jsxs("span", {
                children: [r, typeof a == "number" ? ` (${a})` : ""]
            })]
        }), e.jsx("div", {
            className: "space-y-2",
            children: x
        })]
    }),
    ye = ({
        children: t,
        accent: r,
        className: a,
        style: x
    }) => e.jsxs("div", {
        className: Y("app-card-soft flex items-start gap-3 rounded-2xl border border-zinc-200/70 bg-zinc-50/80 p-3 dark:border-white/5 dark:bg-white/[0.04]", a),
        style: x,
        children: [r && e.jsx("div", {
            className: "pt-1",
            children: r
        }), e.jsx("div", {
            className: "min-w-0 flex-1",
            children: t
        })]
    }),
    bs = ({
        dateKey: t,
        date: r,
        dayData: a,
        subjectsById: x,
        subjectsByName: i,
        anchorRef: o,
        isDark: s,
        dailyGoalMinutes: d,
        onPreviewEnter: w,
        onPreviewLeave: f
    }) => {
        const [p, j] = g.useState(null), u = a.tasks, n = a.exams.slice(0, 2), m = mt(a.sessions, x, i, s).slice(0, 6), b = u.length > 4 || m.length > 3 ? is : ns;
        return g.useLayoutEffect(() => {
            const c = () => {
                const k = o.current;
                if (!k) return;
                const h = k.getBoundingClientRect(),
                    y = h.top,
                    z = window.innerHeight - h.bottom,
                    L = z >= ls || z >= y ? "bottom" : "top",
                    I = h.left + h.width / 2 - b / 2,
                    E = Math.min(Math.max(I, Xe), window.innerWidth - b - Xe);
                j({
                    left: E,
                    top: L === "bottom" ? h.bottom + Qe : h.top - Qe,
                    placement: L
                })
            };
            return c(), window.addEventListener("resize", c), window.addEventListener("scroll", c, !0), () => {
                window.removeEventListener("resize", c), window.removeEventListener("scroll", c, !0)
            }
        }, [o, r, a, b]), !p || typeof document > "u" ? null : ft.createPortal(e.jsx("div", {
            className: "fixed z-[120] hidden md:block",
            "data-testid": "your-calendar-day-preview",
            onMouseEnter: () => w(t),
            onMouseLeave: () => f(t),
            style: {
                left: p.left,
                top: p.top,
                transform: p.placement === "top" ? "translateY(-100%)" : void 0,
                width: b
            },
            children: e.jsxs("div", {
                className: "app-card overflow-hidden rounded-[24px] border border-zinc-200/80 bg-white/95 shadow-[0_28px_80px_-28px_rgba(0,0,0,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0f0f11]/95",
                children: [e.jsxs("div", {
                    className: "border-b border-zinc-200/70 px-4 py-3 dark:border-white/5",
                    children: [e.jsx("div", {
                        className: "text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400",
                        children: U(r, "EEE, MMM d")
                    }), e.jsxs("div", {
                        className: "mt-1 flex items-center justify-between gap-3",
                        children: [e.jsxs("div", {
                            className: "text-sm font-semibold text-zinc-900 dark:text-zinc-100",
                            children: [a.tasks.length + a.exams.length, " scheduled items"]
                        }), e.jsxs("div", {
                            className: "text-right text-xs font-medium text-zinc-500 dark:text-zinc-400",
                            children: [e.jsxs("div", {
                                children: [T(a.taskDurationMinutes), " planned"]
                            }), e.jsxs("div", {
                                children: [T(a.taskActualMinutes), " actual"]
                            })]
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "space-y-3 px-4 py-3 text-left",
                    children: [n.length > 0 && e.jsxs("div", {
                        className: "space-y-1.5",
                        children: [e.jsx("div", {
                            className: "text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400",
                            children: "Exams"
                        }), n.map(c => e.jsxs("div", {
                            className: "flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-300",
                            children: [c.isDDay ? e.jsx(Te, {
                                className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-400"
                            }) : e.jsx(se, {
                                className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-400"
                            }), e.jsx("span", {
                                className: "truncate font-medium",
                                children: c.title
                            })]
                        }, c.id))]
                    }), u.length > 0 && e.jsxs("div", {
                        className: "space-y-1.5",
                        children: [e.jsx("div", {
                            className: "text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400",
                            children: "Tasks"
                        }), e.jsx("div", {
                            className: Y("grid gap-2", u.length > 4 && "grid-cols-2"),
                            children: u.map(c => {
                                const k = ht(c, x, !0),
                                    h = Re(c, x, i, s),
                                    y = _e(c, x, i);
                                return e.jsx("div", {
                                    className: "rounded-2xl border px-3 py-2 text-xs",
                                    style: de(h, s),
                                    children: e.jsxs("div", {
                                        className: "flex items-start gap-2 text-zinc-600 dark:text-zinc-300",
                                        children: [e.jsx("span", {
                                            className: "mt-1 h-2.5 w-2.5 shrink-0 rounded-full",
                                            style: be(h, s)
                                        }), e.jsxs("div", {
                                            className: "min-w-0 flex-1",
                                            children: [e.jsxs("div", {
                                                className: "flex items-center gap-2",
                                                children: [e.jsx("span", {
                                                    className: "inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em]",
                                                    style: ae(h, s),
                                                    children: y
                                                }), e.jsx("span", {
                                                    className: "text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400",
                                                    children: c.priority
                                                })]
                                            }), e.jsx("div", {
                                                className: "mt-1 truncate font-medium text-zinc-900 dark:text-zinc-100",
                                                children: c.title
                                            }), k && e.jsx("div", {
                                                className: "truncate text-[11px] text-zinc-500 dark:text-zinc-400",
                                                children: k
                                            }), e.jsxs("div", {
                                                className: "mt-1 flex flex-wrap items-center gap-1.5 text-[10px] font-semibold text-zinc-500 dark:text-zinc-400",
                                                children: [e.jsxs("span", {
                                                    children: [T(c.effort), " planned"]
                                                }), (c.totalFocusTime || 0) > 0 && e.jsxs("span", {
                                                    className: "text-emerald-600 dark:text-emerald-400",
                                                    children: [T(c.totalFocusTime || 0), " actual"]
                                                })]
                                            })]
                                        })]
                                    })
                                }, c.id)
                            })
                        })]
                    }), m.length > 0 && e.jsxs("div", {
                        className: "space-y-1.5",
                        children: [e.jsx("div", {
                            className: "text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400",
                            children: "Subject Time"
                        }), e.jsx("div", {
                            className: Y("grid gap-2", m.length > 3 && "grid-cols-2"),
                            children: m.map(c => {
                                const k = x.get(c.id) ?? i.get(c.name.trim().toLowerCase()) ?? null,
                                    h = d > 0 ? Math.min(c.minutes / d, 1) : 0,
                                    y = ct(c.sessionTypes);
                                return e.jsxs("div", {
                                    className: "rounded-2xl border px-3 py-2 text-xs text-zinc-600 dark:text-zinc-300",
                                    style: de(c.accentColor, s),
                                    children: [e.jsxs("div", {
                                        className: "flex items-center gap-2",
                                        children: [e.jsx("div", {
                                            className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border",
                                            style: ae(c.accentColor, s),
                                            children: xt(k, "h-4 w-4")
                                        }), e.jsxs("div", {
                                            className: "min-w-0 flex-1",
                                            children: [e.jsx("div", {
                                                className: "truncate font-medium text-zinc-900 dark:text-zinc-100",
                                                children: c.name
                                            }), e.jsxs("div", {
                                                className: "text-[11px] text-zinc-500 dark:text-zinc-400",
                                                children: [c.sessionCount, " ", c.sessionCount === 1 ? "session" : "sessions"]
                                            })]
                                        })]
                                    }), e.jsx("div", {
                                        className: "mt-2 h-1.5 overflow-hidden rounded-full",
                                        style: dt(c.accentColor, s),
                                        children: e.jsx("div", {
                                            className: "h-full rounded-full",
                                            style: { ...ot(c.accentColor),
                                                width: `${Math.max(h*100,h>0?8:0)}%`
                                            }
                                        })
                                    }), e.jsxs("div", {
                                        className: "mt-2 flex items-center justify-between rounded-xl bg-zinc-100/70 px-2 py-1 dark:bg-white/[0.04]",
                                        children: [e.jsx("span", {
                                            className: "text-[10px] font-bold uppercase tracking-[0.18em]",
                                            style: {
                                                color: c.accentColor
                                            },
                                            children: "Target"
                                        }), e.jsxs("span", {
                                            className: "font-semibold text-zinc-900 dark:text-zinc-100",
                                            children: [T(Math.round(c.minutes)), " /", " ", T(d)]
                                        })]
                                    }), e.jsxs("div", {
                                        className: "mt-2 flex flex-wrap items-center gap-1.5",
                                        children: [e.jsxs("span", {
                                            className: "rounded-full border border-zinc-200/80 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 dark:border-white/10 dark:text-zinc-300",
                                            children: [Math.round(c.questionsAttempted), " Q"]
                                        }), y.map(z => e.jsx("span", {
                                            className: "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                                            style: ae(c.accentColor, s),
                                            children: z
                                        }, z))]
                                    })]
                                }, c.id)
                            })
                        })]
                    })]
                })]
            })
        }), document.body)
    },
    ps = ({
        date: t,
        dateKey: r,
        dayData: a,
        isCurrentMonth: x,
        isSelected: i,
        previewDateKey: o,
        onPreviewEnter: s,
        onPreviewLeave: d,
        subjectsById: w,
        subjectsByName: f,
        dailyGoalMinutes: p,
        isDark: j
    }) => {
        const u = g.useRef(null),
            n = us(a, w, f, j),
            m = n.slice(0, ds),
            b = Math.max(0, n.length - m.length),
            c = o === r,
            k = xs(a.studyMinutes, p, j, i),
            h = n.length > 0;
        return e.jsxs(e.Fragment, {
            children: [k && e.jsx("div", {
                className: "pointer-events-none absolute inset-[1px] rounded-[18px] border",
                style: k
            }), e.jsxs("div", {
                ref: u,
                className: "relative z-10 flex min-h-0 flex-1 flex-col gap-1.5",
                children: [e.jsx("div", {
                    className: "min-h-0 flex-1",
                    children: h ? e.jsxs("div", {
                        className: "flex h-full min-h-0 flex-col gap-1",
                        children: [m.map(y => e.jsxs("div", {
                            className: "flex min-w-0 items-center gap-1.5 rounded-xl border px-1.5 py-1 text-[8px] font-medium text-zinc-800 md:text-[9px] dark:text-zinc-100",
                            style: y.surfaceStyle,
                            children: [y.type === "exam" ? y.isDDay ? e.jsx(Te, {
                                className: "h-2.5 w-2.5 shrink-0",
                                style: {
                                    color: y.accentColor
                                }
                            }) : e.jsx(se, {
                                className: "h-2.5 w-2.5 shrink-0",
                                style: {
                                    color: y.accentColor
                                }
                            }) : e.jsx("span", {
                                className: "h-2 w-2 shrink-0 rounded-full",
                                style: y.indicatorStyle
                            }), e.jsx("span", {
                                className: "min-w-0 flex-1 truncate leading-tight",
                                children: y.title
                            }), y.isSyllabusLinked && y.type === "task" && e.jsx(Ae, {
                                className: "h-2.5 w-2.5 shrink-0 text-zinc-500 dark:text-zinc-300"
                            })]
                        }, `${r}-${y.id}`)), b > 0 && e.jsxs("div", {
                            className: "flex min-w-0 items-center justify-between rounded-xl border border-dashed border-zinc-200/90 bg-zinc-50/85 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.18em] text-zinc-500 md:text-[9px] dark:border-white/10 dark:bg-white/[0.035] dark:text-zinc-300",
                            children: [e.jsxs("span", {
                                children: ["+", b, " more"]
                            }), e.jsx(Ee, {
                                className: "h-2.5 w-2.5 shrink-0"
                            })]
                        })]
                    }) : null
                }), e.jsxs("div", {
                    className: "flex min-w-0 flex-col gap-1 text-[9px] font-medium text-zinc-500 dark:text-zinc-400 sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:text-[10px]",
                    children: [a.taskDurationMinutes > 0 ? e.jsxs("span", {
                        className: "min-w-0 leading-tight sm:truncate",
                        children: [T(a.taskDurationMinutes), " planned"]
                    }) : a.studyMinutes > 0 ? e.jsxs("span", {
                        className: "min-w-0 leading-tight sm:truncate",
                        children: [T(a.studyMinutes), " studied"]
                    }) : x ? e.jsx("span", {
                        className: "uppercase tracking-[0.24em]",
                        children: "Rest"
                    }) : e.jsx("span", {}), h && e.jsxs("span", {
                        className: "w-fit rounded-full bg-zinc-100/80 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-500 dark:bg-white/[0.08] dark:text-zinc-300 sm:tracking-[0.18em]",
                        children: [a.tasks.length, "T ", a.exams.length, "E"]
                    })]
                })]
            }), c && x && (a.studyMinutes > 0 || h || a.sessions.length > 0) && e.jsx(bs, {
                dateKey: r,
                date: t,
                dayData: a,
                subjectsById: w,
                subjectsByName: f,
                anchorRef: u,
                isDark: j,
                dailyGoalMinutes: p,
                onPreviewEnter: s,
                onPreviewLeave: d
            }), e.jsxs("span", {
                className: "sr-only",
                children: [U(t, "MMMM d, yyyy"), ". ", T(a.studyMinutes, "minutes"), " study time. ", T(a.taskDurationMinutes, "minutes"), " planned task duration.", " ", T(a.taskActualMinutes, "minutes"), " actual task time.", " ", a.tasks.length, " tasks. ", a.exams.length, " exams."]
            })]
        })
    },
    gs = ({
        isDark: t,
        onScheduleTask: r,
        onScheduleExam: a
    }) => {
        const x = De(),
            {
                subjects: i
            } = te(),
            {
                tasks: o
            } = et(),
            {
                exams: s
            } = oe(),
            {
                sessions: d,
                todayMinutes: w = 0,
                dailyGoalMinutes: f = 360
            } = tt(),
            p = Me.getState().profile,
            j = Ze(p ?.studyPreferences),
            u = g.useMemo(() => ve(new Date), []),
            [n, m] = g.useState(u),
            [b, c] = g.useState(null),
            [k, h] = g.useState(null),
            [y, z] = g.useState(() => typeof window < "u" ? window.innerWidth >= 1280 : !1),
            L = g.useRef(null),
            I = g.useRef(null),
            E = g.useMemo(() => new Map(i.map(l => [l.id, l])), [i]),
            H = g.useMemo(() => new Map(i.map(l => [l.name.trim().toLowerCase(), l])), [i]);
        g.useEffect(() => {
            const l = () => c(null);
            return window.addEventListener("scroll", l, !0), window.addEventListener("resize", l), () => {
                window.removeEventListener("scroll", l, !0), window.removeEventListener("resize", l)
            }
        }, []), g.useEffect(() => {
            const l = () => {
                z(window.innerWidth >= 1280)
            };
            return l(), window.addEventListener("resize", l), () => {
                window.removeEventListener("resize", l)
            }
        }, []), g.useEffect(() => () => {
            I.current !== null && window.clearTimeout(I.current)
        }, []);
        const V = g.useMemo(() => {
                const l = {},
                    R = v => (l[v] || (l[v] = {
                        exams: [],
                        tasks: [],
                        sessions: [],
                        studyMinutes: 0,
                        taskDurationMinutes: 0,
                        taskActualMinutes: 0
                    }), l[v]);
                return o.filter(v => !!v.dueDate && !v.deletedAt).forEach(v => {
                    const O = J(_(v.dueDate), j),
                        P = R(O);
                    P.tasks.push(v), P.taskDurationMinutes += v.effort || 0, P.taskActualMinutes += v.totalFocusTime || 0
                }), s.filter(v => !!v.date && !v.deletedAt).forEach(v => {
                    const O = J(_(v.date), j);
                    R(O).exams.push(v)
                }), d.filter(v => v.completed && !v.deletedAt).forEach(v => {
                    const O = J(v.startTime, j),
                        P = R(O);
                    P.sessions.push(v), P.studyMinutes += v.duration
                }), Object.values(l).forEach(v => {
                    v.exams.sort(os), v.tasks.sort(cs), v.sessions.sort((O, P) => new Date(P.startTime).getTime() - new Date(O.startTime).getTime())
                }), l
            }, [j, s, d, o]),
            M = g.useMemo(() => J(ve(n), j), [j, n]),
            G = g.useMemo(() => U(n, "yyyy-MM-dd"), [n]),
            D = V[M] ?? We,
            B = g.useMemo(() => mt(D.sessions, E, H, t), [t, D.sessions, E, H]),
            C = s.filter(l => !l.deletedAt).length,
            W = o.filter(l => !l.deletedAt).length;
        g.useLayoutEffect(() => {
            const l = L.current;
            if (!l || !y) {
                h(null);
                return
            }
            const R = () => {
                h(l.getBoundingClientRect().height)
            };
            R();
            const v = new ResizeObserver(R);
            return v.observe(l), () => {
                v.disconnect()
            }
        }, [M, y]);
        const q = () => {
                I.current !== null && (window.clearTimeout(I.current), I.current = null)
            },
            K = l => {
                q(), c(l)
            },
            Q = l => {
                q(), I.current = window.setTimeout(() => {
                    c(R => R === l ? null : R), I.current = null
                }, 120)
            },
            xe = ({
                data: l,
                date: R,
                dateKey: v,
                isCurrentMonth: O,
                isSelected: P
            }) => {
                const fe = l ?? We;
                return e.jsx(ps, {
                    date: R,
                    dateKey: v,
                    dayData: fe,
                    isCurrentMonth: O,
                    isSelected: P,
                    previewDateKey: b,
                    onPreviewEnter: K,
                    onPreviewLeave: Q,
                    subjectsById: E,
                    subjectsByName: H,
                    dailyGoalMinutes: f,
                    isDark: t
                })
            };
        return e.jsxs("section", {
            "aria-label": "Your Calendar",
            className: "relative w-full space-y-5",
            "data-testid": "your-calendar",
            children: [e.jsx("div", {
                className: "app-ambient pointer-events-none absolute inset-x-0 top-12 -z-10 h-48 rounded-[40px] bg-gradient-to-r from-brand-500/10 via-cyan-500/5 to-emerald-500/10 blur-3xl"
            }), e.jsxs("div", {
                className: "flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between",
                children: [e.jsxs("div", {
                    children: [e.jsx("h2", {
                        className: "text-2xl font-display font-bold text-zinc-900 dark:text-white",
                        children: "Your Calendar"
                    }), e.jsx("p", {
                        className: "mt-1 text-sm text-zinc-500 dark:text-zinc-400",
                        children: "Study time, exams, and your scheduled tasks — all on one month grid."
                    })]
                }), e.jsxs("div", {
                    className: "flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-300",
                    children: [e.jsxs("div", {
                        className: "app-pill rounded-full border border-zinc-200 bg-white/90 px-3 py-1.5 shadow-sm dark:border-white/5 dark:bg-white/[0.04]",
                        children: [e.jsx("span", {
                            className: "text-zinc-500 dark:text-zinc-400",
                            children: "Today:"
                        }), " ", e.jsx("span", {
                            className: "font-bold",
                            children: T(w)
                        })]
                    }), e.jsxs("div", {
                        className: "app-pill rounded-full border border-zinc-200 bg-white/90 px-3 py-1.5 shadow-sm dark:border-white/5 dark:bg-white/[0.04]",
                        children: [e.jsx("span", {
                            className: "text-zinc-500 dark:text-zinc-400",
                            children: "Tasks:"
                        }), " ", e.jsx("span", {
                            className: "font-bold",
                            children: W
                        })]
                    }), e.jsxs("div", {
                        className: "app-pill rounded-full border border-zinc-200 bg-white/90 px-3 py-1.5 shadow-sm dark:border-white/5 dark:bg-white/[0.04]",
                        children: [e.jsx("span", {
                            className: "text-zinc-500 dark:text-zinc-400",
                            children: "Exams:"
                        }), " ", e.jsx("span", {
                            className: "font-bold",
                            children: C
                        })]
                    })]
                })]
            }), e.jsxs("div", {
                className: "grid grid-cols-1 items-stretch gap-5 xl:grid-cols-[minmax(0,1fr)_340px]",
                children: [e.jsx("div", {
                    ref: L,
                    children: e.jsx(as, {
                        initialMonth: n,
                        selectedDateKey: M,
                        dayDataByKey: V,
                        getDateKey: l => J(l, j),
                        disableFutureMonths: !0,
                        onDayHoverStart: l => K(l.dateKey),
                        onDayHoverEnd: l => Q(l.dateKey),
                        onDayFocus: l => K(l.dateKey),
                        onDayBlur: l => Q(l.dateKey),
                        onDaySelect: l => m(ve(l.date)),
                        headerActions: ({
                            goToToday: l
                        }) => e.jsx("button", {
                            type: "button",
                            onClick: () => {
                                l(), m(u)
                            },
                            className: "rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-[0.24em] text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white dark:focus-visible:ring-offset-[#0c0c0e]",
                            children: "Today"
                        }),
                        legend: e.jsxs(e.Fragment, {
                            children: [e.jsxs("span", {
                                className: "flex items-center gap-2",
                                children: [e.jsx("span", {
                                    className: "h-2.5 w-2.5 rounded-full bg-brand-500/40"
                                }), "Study intensity"]
                            }), e.jsxs("span", {
                                className: "flex items-center gap-2",
                                children: [e.jsx("span", {
                                    className: "h-2.5 w-2.5 rounded-full bg-cyan-500/70"
                                }), "Subject task"]
                            }), e.jsxs("span", {
                                className: "flex items-center gap-2",
                                children: [e.jsx("span", {
                                    className: "h-2.5 w-2.5 rounded-full bg-rose-500"
                                }), "Exam"]
                            })]
                        }),
                        renderDayContent: xe
                    })
                }), e.jsxs("aside", {
                    className: "app-card flex h-full flex-col overflow-hidden rounded-[28px] border border-zinc-200/70 bg-white/85 p-5 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.35)] backdrop-blur-xl dark:border-white/5 dark:bg-[#0f0f11]/85",
                    "data-testid": "your-calendar-day-details",
                    style: {
                        height: y && k ? k : "32rem"
                    },
                    children: [e.jsxs("div", {
                        className: "flex items-start justify-between gap-3 border-b border-zinc-200/70 pb-4 dark:border-white/5",
                        children: [e.jsxs("div", {
                            children: [e.jsx("div", {
                                className: "text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400",
                                children: "Selected Day"
                            }), e.jsx("h3", {
                                className: "mt-1 text-lg font-bold text-zinc-900 dark:text-white",
                                children: U(n, "EEEE, MMM d")
                            }), e.jsx("p", {
                                className: "mt-1 text-sm text-zinc-500 dark:text-zinc-400",
                                children: kt(n, new Date, j)
                            })]
                        }), e.jsxs("div", {
                            className: "grid grid-cols-2 gap-2 text-right text-xs",
                            children: [e.jsxs("div", {
                                className: "rounded-2xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 dark:bg-amber-500/15",
                                children: [e.jsx("div", {
                                    className: "font-black text-amber-600 dark:text-amber-300",
                                    children: T(D.taskDurationMinutes)
                                }), e.jsx("div", {
                                    className: "mt-0.5 text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400",
                                    children: "planned"
                                })]
                            }), e.jsxs("div", {
                                className: "rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 dark:bg-emerald-500/15",
                                children: [e.jsx("div", {
                                    className: "font-black text-emerald-600 dark:text-emerald-300",
                                    children: T(D.taskActualMinutes)
                                }), e.jsx("div", {
                                    className: "mt-0.5 text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400",
                                    children: "actual"
                                })]
                            })]
                        })]
                    }), (r || a) && e.jsxs("div", {
                        className: "mt-4 flex flex-wrap gap-2",
                        children: [r && e.jsxs("button", {
                            type: "button",
                            onClick: () => r(G),
                            className: "inline-flex items-center gap-2 rounded-xl border border-brand-500/20 bg-brand-500/10 px-3 py-2 text-xs font-bold text-brand-500 transition-colors hover:bg-brand-500/15",
                            children: [e.jsx(ee, {
                                className: "h-3.5 w-3.5"
                            }), "Schedule task"]
                        }), a && e.jsxs("button", {
                            type: "button",
                            onClick: () => a(G),
                            className: "inline-flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-500 transition-colors hover:bg-rose-500/15",
                            children: [e.jsx(se, {
                                className: "h-3.5 w-3.5"
                            }), "Schedule exam"]
                        })]
                    }), e.jsxs("div", {
                        className: "mt-5 min-h-0 flex-1 space-y-5 overflow-y-auto pr-1 custom-scrollbar",
                        children: [D.exams.length > 0 && e.jsx(Ne, {
                            icon: e.jsx(se, {
                                className: "h-3.5 w-3.5 text-rose-400"
                            }),
                            title: "Exams",
                            count: D.exams.length,
                            children: D.exams.map(l => e.jsxs(ye, {
                                accent: l.isDDay ? e.jsx(Te, {
                                    className: "h-4 w-4 text-brand-400"
                                }) : e.jsx(se, {
                                    className: "h-4 w-4 text-rose-400"
                                }),
                                style: {
                                    borderColor: F(l.isDDay ? le() : Se, .2),
                                    backgroundColor: F(l.isDDay ? le() : Se, t ? .1 : .08)
                                },
                                children: [e.jsx("div", {
                                    className: "font-semibold text-zinc-900 dark:text-zinc-100",
                                    children: l.title
                                }), e.jsxs("div", {
                                    className: "mt-1 text-xs text-zinc-500 dark:text-zinc-400",
                                    children: [l.isDDay ? "D-Day" : l.priority ?? "Exam", " •", " ", U(_(l.date), "MMM d")]
                                })]
                            }, l.id))
                        }), D.tasks.length > 0 && e.jsx(Ne, {
                            icon: e.jsx(ee, {
                                className: "h-3.5 w-3.5 text-brand-400"
                            }),
                            title: "Tasks",
                            count: D.tasks.length,
                            children: D.tasks.map(l => {
                                const R = ht(l, E),
                                    v = hs(l),
                                    O = Re(l, E, H, t),
                                    P = _e(l, E, H);
                                return e.jsxs(ye, {
                                    accent: e.jsx("span", {
                                        className: "mt-1 h-2.5 w-2.5 rounded-full",
                                        style: be(O, t)
                                    }),
                                    style: de(O, t),
                                    children: [e.jsxs("div", {
                                        className: "flex items-center gap-2",
                                        children: [e.jsx("span", {
                                            className: "inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em]",
                                            style: ae(O, t),
                                            children: P
                                        }), e.jsx("div", {
                                            className: "truncate font-semibold text-zinc-900 dark:text-zinc-100",
                                            children: l.title
                                        }), (l.chapterId || l.topicId) && e.jsx(Ae, {
                                            className: "h-3 w-3 shrink-0 text-zinc-500 dark:text-zinc-400"
                                        }), l.status === "done" && e.jsx(ue, {
                                            className: "h-3.5 w-3.5 shrink-0 text-emerald-500"
                                        })]
                                    }), e.jsxs("div", {
                                        className: "mt-1 text-xs text-zinc-500 dark:text-zinc-400",
                                        children: [R ? `${R} • ` : "", l.priority.toUpperCase(), " • ", l.status]
                                    }), e.jsxs("div", {
                                        className: "mt-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400",
                                        children: [e.jsxs("span", {
                                            className: "inline-flex items-center gap-1 rounded-full border border-zinc-200/80 px-2 py-0.5 dark:border-white/10",
                                            children: [e.jsx(He, {
                                                className: "h-3 w-3"
                                            }), T(l.effort), " planned"]
                                        }), e.jsxs("span", {
                                            className: "inline-flex items-center gap-1 rounded-full border border-emerald-500/20 px-2 py-0.5 text-emerald-600 dark:text-emerald-400",
                                            children: [e.jsx(ue, {
                                                className: "h-3 w-3"
                                            }), T(l.totalFocusTime || 0), " actual"]
                                        })]
                                    }), v && e.jsxs("button", {
                                        type: "button",
                                        onClick: () => x(v),
                                        className: "mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-500 transition-colors hover:text-brand-400",
                                        children: [e.jsx(Ee, {
                                            className: "h-3.5 w-3.5"
                                        }), "Open in syllabus"]
                                    })]
                                }, l.id)
                            })
                        }), B.length > 0 && e.jsx(Ne, {
                            icon: e.jsx(He, {
                                className: "h-3.5 w-3.5 text-brand-400"
                            }),
                            title: "Subject Time",
                            count: B.length,
                            children: B.map(l => {
                                const R = E.get(l.id) ?? H.get(l.name.trim().toLowerCase()) ?? null,
                                    v = f > 0 ? Math.min(l.minutes / f, 1) : 0,
                                    O = ct(l.sessionTypes);
                                return e.jsxs(ye, {
                                    accent: e.jsx("div", {
                                        className: "flex h-10 w-10 items-center justify-center rounded-2xl border",
                                        style: ae(l.accentColor, t),
                                        children: xt(R, "h-4 w-4")
                                    }),
                                    style: de(l.accentColor, t),
                                    children: [e.jsxs("div", {
                                        className: "flex items-center justify-between gap-3",
                                        children: [e.jsxs("div", {
                                            className: "min-w-0",
                                            children: [e.jsx("div", {
                                                className: "truncate font-semibold text-zinc-900 dark:text-zinc-100",
                                                children: l.name
                                            }), e.jsxs("div", {
                                                className: "mt-1 text-xs text-zinc-500 dark:text-zinc-400",
                                                children: [l.sessionCount, " ", l.sessionCount === 1 ? "session" : "sessions", " logged"]
                                            })]
                                        }), e.jsxs("div", {
                                            className: "text-right",
                                            children: [e.jsx("div", {
                                                className: "text-sm font-black",
                                                style: {
                                                    color: l.accentColor
                                                },
                                                children: T(Math.round(l.minutes))
                                            }), e.jsxs("div", {
                                                className: "text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400",
                                                children: ["of ", T(f), " target"]
                                            })]
                                        })]
                                    }), e.jsx("div", {
                                        className: "mt-3 h-2 overflow-hidden rounded-full",
                                        style: dt(l.accentColor, t),
                                        children: e.jsx("div", {
                                            className: "h-full rounded-full",
                                            style: { ...ot(l.accentColor),
                                                width: `${Math.max(v*100,v>0?8:0)}%`
                                            }
                                        })
                                    }), e.jsxs("div", {
                                        className: "mt-3 flex flex-wrap items-center gap-2",
                                        children: [e.jsxs("span", {
                                            className: "rounded-full border border-zinc-200/80 px-2.5 py-1 text-[10px] font-semibold text-zinc-600 dark:border-white/10 dark:text-zinc-300",
                                            children: [Math.round(l.questionsAttempted), " questions"]
                                        }), O.map(P => e.jsx("span", {
                                            className: "rounded-full px-2.5 py-1 text-[10px] font-semibold",
                                            style: ae(l.accentColor, t),
                                            children: P
                                        }, P))]
                                    })]
                                }, l.id)
                            })
                        }), D.studyMinutes === 0 && D.exams.length === 0 && D.tasks.length === 0 && D.sessions.length === 0 && e.jsxs("div", {
                            className: "flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 px-4 py-10 text-center dark:border-white/10",
                            children: [e.jsx(Ot, {
                                className: "h-6 w-6 text-zinc-400"
                            }), e.jsx("div", {
                                className: "mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100",
                                children: "Rest day"
                            }), e.jsx("div", {
                                className: "mt-1 text-sm text-zinc-500 dark:text-zinc-400",
                                children: "No sessions, exams, or scheduled tasks on this logical day."
                            })]
                        })]
                    })]
                })]
            })]
        })
    },
    fs = (t, r = "w-5 h-5 text-white") => e.jsx(Ie, {
        icon: t.icon,
        name: t.name,
        className: r
    }),
    Ws = ({
        isDark: t,
        toggleTheme: r
    }) => {
        const [a, x] = g.useState("Study"), {
            subjects: i,
            deleteSubject: o,
            createSubjectsFromTemplate: s
        } = te(), {
            mockTests: d
        } = oe(), [w, f] = g.useState(null), [, p] = g.useState(""), [j, u] = g.useState(!1), [n, m] = g.useState(!1), [b, c] = g.useState(null), [k, h] = g.useState(!1), [y, z] = g.useState(!1), [L, I] = g.useState("create"), [E, H] = g.useState(null), [V, M] = g.useState(null), [G, D] = g.useState(void 0), [B, C] = g.useState(!1), [W, q] = g.useState(void 0), [K, Q] = g.useState(!1), xe = Pe(N => N.isAuthenticated), l = Pe(N => N.isPremium()), R = Ut(N => N.collectionStatus.subjects), v = g.useMemo(() => i.flatMap(N => N.chapters.flatMap(S => S.topics)), [i]), O = g.useMemo(() => i.reduce((N, S) => N + S.chapters.reduce(($, X) => $ + X.topics.filter(Le => Le.nextReview && new Date(Le.nextReview) <= new Date).length, 0), 0), [i]), P = g.useMemo(() => {
            if (v.length === 0) return 0;
            const N = {
                    Enlightened: 100,
                    Master: 100,
                    Guru: 80,
                    Apprentice: 60,
                    Novice: 40
                },
                S = v.reduce(($, X) => $ + (N[X.mastery] || 40), 0);
            return Math.round(S / v.length)
        }, [v]), fe = g.useMemo(() => i.flatMap(N => N.chapters.flatMap(S => S.topics.map($ => ({ ...$,
            subjectName: N.name
        })))).filter(N => N.nextReview).sort((N, S) => new Date(N.nextReview).getTime() - new Date(S.nextReview).getTime()).slice(0, 3), [i]), ut = g.useMemo(() => i.some(N => N.chapters.some(S => S.topics.some($ => !!$.nextReview))), [i]), bt = N => {
            const S = N.linkedMockTestIds ?.[0];
            return S && d.find($ => $.id === S) || null
        }, me = (N, S = null, $) => {
            I(N), H(S), M(S ? bt(S) : null), D($), z(!0)
        }, pt = N => {
            q(N), C(!0)
        };
        return g.useEffect(() => {
            (async () => {
                if (i.length > 0 || xe && l && R !== "success") return;
                const {
                    profile: S
                } = Me.getState();
                S ?.academic ?.targetExams && S.academic.targetExams.some(X => X.toLowerCase().includes("jee")) && await s("jee-main-advanced")
            })()
        }, [s, xe, l, R, i.length]), g.useEffect(() => {
            if (i.length > 0 && !w) f(i[0]);
            else if (w) {
                const N = i.find(S => S.id === w.id);
                N && f(N)
            }
        }, [i, w]), w ? e.jsxs("div", {
            className: "app-shell h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-white flex overflow-hidden selection:bg-brand-500/30",
            children: [e.jsxs("div", {
                className: "app-ambient fixed inset-0 z-0 pointer-events-none opacity-20 dark:opacity-100",
                children: [e.jsx("div", {
                    className: "absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[120px]"
                }), e.jsx("div", {
                    className: "absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[120px]"
                }), e.jsx("div", {
                    className: "absolute top-[40%] left-[40%] w-[400px] h-[400px] bg-brand-500/5 rounded-full blur-[100px]"
                })]
            }), e.jsx(Oe, {
                activeTab: a,
                setActiveTab: x,
                isDark: t,
                toggleTheme: r,
                mobileMenuOpen: K,
                setMobileMenuOpen: Q
            }), e.jsxs("main", {
                className: "app-main-shell flex-1 relative flex flex-col h-screen overflow-hidden bg-transparent",
                children: [e.jsx(wt, {
                    activeTab: a,
                    mobileMenuOpen: K,
                    setMobileMenuOpen: Q,
                    onSearch: p
                }), e.jsxs("div", {
                    className: "flex-1 overflow-y-auto density-app-shell-x pt-[var(--density-page-y-lg)] lg:pt-0 custom-scrollbar safe-bottom",
                    children: [e.jsxs("div", {
                        className: "density-wide-width mt-6 density-stack",
                        children: [e.jsx(ts, {
                            onAddExam: () => me("create")
                        }), e.jsxs("div", {
                            className: "density-stack",
                            children: [e.jsx(gs, {
                                isDark: t,
                                onScheduleTask: N => pt({
                                    dueDate: N
                                }),
                                onScheduleExam: N => me("create", null, N)
                            }), e.jsxs("div", {
                                className: "grid grid-cols-1 lg:grid-cols-3 density-grid-gap",
                                children: [e.jsx(Jt, {
                                    onAddExam: () => me("create")
                                }), e.jsx("div", {
                                    className: "bg-gradient-to-b from-brand-500/10 to-brand-600/5 rounded-3xl p-1 border border-brand-500/20",
                                    children: e.jsxs("div", {
                                        className: "app-card bg-[#0c0c0e] rounded-[24px] density-card-surface relative overflow-hidden h-full flex flex-col items-center justify-between border border-white/5 shadow-2xl shadow-black",
                                        children: [e.jsx("div", {
                                            className: "app-ambient absolute top-0 right-0 w-48 h-48 bg-brand-500/20 rounded-full blur-[60px] opacity-40 mix-blend-screen pointer-events-none"
                                        }), e.jsxs("div", {
                                            className: "relative z-10 flex flex-col flex-1 w-full",
                                            children: [e.jsxs("div", {
                                                className: "flex items-center gap-3 mb-6",
                                                children: [e.jsx("div", {
                                                    className: "p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 shadow-[0_0_15px_rgba(168,85,247,0.2)]",
                                                    children: e.jsx(he, {
                                                        className: "w-6 h-6 text-brand-400"
                                                    })
                                                }), e.jsxs("div", {
                                                    children: [e.jsx("h3", {
                                                        className: "font-extrabold text-xl text-white tracking-tight",
                                                        children: "RecallMaster™"
                                                    }), e.jsx("p", {
                                                        className: "text-[10px] font-bold text-brand-400 uppercase tracking-widest",
                                                        children: "FSRS v4 Engine Activity"
                                                    })]
                                                })]
                                            }), e.jsxs("div", {
                                                className: "bg-white/5 rounded-2xl p-4 border border-white/5 mb-6",
                                                children: [e.jsxs("div", {
                                                    className: "flex items-center justify-between mb-3",
                                                    children: [e.jsx("span", {
                                                        className: "text-xs font-semibold text-zinc-400 uppercase tracking-wider",
                                                        children: "Retention Target"
                                                    }), e.jsx("span", {
                                                        className: "text-sm font-black text-brand-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]",
                                                        children: "90%"
                                                    })]
                                                }), e.jsx("div", {
                                                    className: "w-full h-2.5 bg-black/50 rounded-full overflow-hidden shadow-inner flex relative",
                                                    children: e.jsx(A.div, {
                                                        initial: {
                                                            width: 0
                                                        },
                                                        animate: {
                                                            width: "90%"
                                                        },
                                                        transition: {
                                                            duration: 1.5,
                                                            ease: "easeOut"
                                                        },
                                                        className: "h-full bg-gradient-to-r from-brand-600 to-brand-400 shadow-[0_0_10px_rgba(168,85,247,0.8)] relative",
                                                        children: e.jsx("div", {
                                                            className: "absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] animate-[shimmer_2s_infinite]"
                                                        })
                                                    })
                                                })]
                                            }), e.jsxs("div", {
                                                className: "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6",
                                                children: [e.jsxs("div", {
                                                    className: "bg-black/40 rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group/stat",
                                                    children: [e.jsx("div", {
                                                        className: "absolute inset-0 bg-brand-500/10 opacity-0 group-hover/stat:opacity-100 transition-opacity"
                                                    }), e.jsx("div", {
                                                        className: "text-3xl font-black text-white mb-1 drop-shadow-md",
                                                        children: O
                                                    }), e.jsx("div", {
                                                        className: "text-[10px] font-bold text-zinc-500 uppercase tracking-widest",
                                                        children: "Due Today"
                                                    })]
                                                }), e.jsxs("div", {
                                                    className: "bg-black/40 rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group/stat",
                                                    children: [e.jsx("div", {
                                                        className: "absolute inset-0 bg-brand-500/10 opacity-0 group-hover/stat:opacity-100 transition-opacity"
                                                    }), e.jsxs("div", {
                                                        className: "text-3xl font-black text-white mb-1 drop-shadow-md",
                                                        children: [P, "%"]
                                                    }), e.jsx("div", {
                                                        className: "text-[10px] font-bold text-zinc-500 uppercase tracking-widest",
                                                        children: "Retention"
                                                    })]
                                                })]
                                            }), e.jsxs("button", {
                                                onClick: () => u(!0),
                                                className: "w-full py-3.5 bg-white text-black hover:bg-zinc-200 rounded-xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-95 mt-auto",
                                                children: [e.jsx(Pt, {
                                                    className: "w-4 h-4 fill-current"
                                                }), "Start Review"]
                                            })]
                                        })]
                                    })
                                }), e.jsxs("div", {
                                    className: "app-card bg-white dark:bg-[#0c0c0e] rounded-2xl border border-zinc-200 dark:border-white/5 density-card-surface h-full flex flex-col",
                                    children: [e.jsxs("h3", {
                                        className: "font-bold text-lg text-zinc-900 dark:text-white mb-4 flex items-center gap-2",
                                        children: [e.jsx($t, {
                                            className: "w-5 h-5 text-amber-500"
                                        }), "Up Next"]
                                    }), e.jsxs("div", {
                                        className: "space-y-3 flex-1",
                                        children: [i.length > 0 && fe.map((N, S) => e.jsxs(A.div, {
                                            whileHover: {
                                                scale: 1.02
                                            },
                                            className: "flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-50 dark:bg-[#121215] border border-zinc-200/50 dark:border-white/[0.05] hover:border-amber-500/30 transition-all cursor-pointer shadow-sm relative overflow-hidden group/upnext",
                                            children: [e.jsx("div", {
                                                className: "absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/0 to-amber-500/5 opacity-0 group-hover/upnext:opacity-100 transition-opacity"
                                            }), e.jsx("div", {
                                                className: "w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]",
                                                children: (() => {
                                                    const $ = i.find(X => X.name === N.subjectName);
                                                    return $ ? fs($, "w-5 h-5 text-amber-500") : e.jsx(ke, {
                                                        className: "w-5 h-5 text-amber-500"
                                                    })
                                                })()
                                            }), e.jsxs("div", {
                                                className: "flex-1 min-w-0 z-10",
                                                children: [e.jsx("div", {
                                                    className: "font-bold text-sm text-zinc-800 dark:text-zinc-100 truncate pb-0.5",
                                                    children: N.title
                                                }), e.jsxs("div", {
                                                    className: "text-[11px] font-semibold text-zinc-500 uppercase tracking-wider",
                                                    children: [N.subjectName, " ", e.jsx("span", {
                                                        className: "mx-1 opacity-50",
                                                        children: "•"
                                                    }), " Due", " ", new Date(N.nextReview).toLocaleDateString("en-GB", {
                                                        day: "2-digit",
                                                        month: "short"
                                                    })]
                                                })]
                                            }), e.jsx("div", {
                                                className: "w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse"
                                            })]
                                        }, S)), !ut && e.jsx("div", {
                                            className: "text-zinc-500 text-sm text-center py-4",
                                            children: "No reviews pending!"
                                        })]
                                    })]
                                })]
                            })]
                        }), e.jsx(Zt, {
                            onAddResult: () => me("create"),
                            onEditResult: N => {
                                alert("Legacy test editing not supported in new modal yet.")
                            }
                        }), e.jsx(Qt, {}), !w ?.examTemplateId && e.jsxs(A.div, {
                            initial: {
                                opacity: 0,
                                y: 20
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            className: "relative group mt-12 mb-8",
                            children: [e.jsx("div", {
                                className: "absolute -inset-1 bg-gradient-to-r from-brand-500 via-violet-500 to-fuchsia-500 rounded-[28px] blur-xl opacity-10 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"
                            }), e.jsxs("button", {
                                onClick: () => h(!0),
                                className: `relative w-full overflow-hidden rounded-[24px] border transition-all duration-500 group/btn ${t?"bg-[#0c0c0e]/80 border-white/5 hover:border-brand-500/30":"bg-white border-zinc-200 hover:border-brand-300 shadow-xl shadow-zinc-200/50 hover:shadow-brand-500/10"}`,
                                children: [e.jsx("div", {
                                    className: "absolute inset-0 bg-gradient-to-br from-brand-600/5 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"
                                }), e.jsxs("div", {
                                    className: "px-4 py-5 sm:px-8 sm:py-7 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 md:gap-6 text-left",
                                    children: [e.jsxs("div", {
                                        className: "flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 min-w-0",
                                        children: [e.jsxs("div", {
                                            className: `relative flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden ${t?"bg-brand-500/10":"bg-brand-50"}`,
                                            children: [e.jsx("div", {
                                                className: "absolute inset-0 bg-gradient-to-br from-brand-500/20 to-transparent animate-pulse"
                                            }), e.jsx(ne, {
                                                className: `w-8 h-8 relative z-10 ${t?"text-brand-400":"text-brand-600"}`
                                            })]
                                        }), e.jsxs("div", {
                                            className: "min-w-0",
                                            children: [e.jsxs("h3", {
                                                className: `text-xl font-bold tracking-tight mb-1 ${t?"text-white":"text-zinc-900"}`,
                                                children: ["Want to skip the manual setup?", " ", e.jsx("span", {
                                                    className: "text-brand-500",
                                                    children: "Fast-track"
                                                }), " your prep."]
                                            }), e.jsx("p", {
                                                className: `text-sm font-medium ${t?"text-zinc-400":"text-zinc-500"}`,
                                                children: "Load professional syllabuses for JEE, NEET, UPSC & 20+ other exams instantly."
                                            })]
                                        })]
                                    }), e.jsx("div", {
                                        className: "flex items-center gap-4 w-full md:w-auto",
                                        children: e.jsxs("div", {
                                            className: `flex w-full md:w-auto items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-xl font-bold transition-all ${t?"bg-brand-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.2)] group-hover/btn:shadow-[0_0_25px_rgba(139,92,246,0.4)]":"bg-zinc-900 text-white group-hover/btn:bg-brand-600"}`,
                                            children: [e.jsx("span", {
                                                children: "Browse Templates"
                                            }), e.jsx(ze, {
                                                className: "w-5 h-5 group-hover/btn:translate-x-1 transition-transform"
                                            })]
                                        })
                                    })]
                                })]
                            })]
                        })]
                    }), e.jsx("div", {
                        className: "w-full mt-8 pointer-events-none select-none overflow-hidden leading-none",
                        children: e.jsx("div", {
                            className: "text-[10vw] sm:text-[14vw] md:text-[18vw] lg:text-[20vw] xl:text-[22vw] font-display font-bold text-black/[0.03] dark:text-white/[0.03] whitespace-nowrap text-center tracking-tight",
                            children: "ISOTOPEAI"
                        })
                    })]
                }), e.jsx(ie, {
                    children: j && e.jsx(qe, {
                        onClose: () => u(!1)
                    })
                }), e.jsx(Ye, {
                    isOpen: n,
                    onClose: () => {
                        m(!1), c(null)
                    },
                    subjectToEdit: b,
                    onDelete: N => {
                        o(N), w ?.id === N && f(i.find(S => S.id !== N) || null)
                    }
                }), e.jsx(Be, {
                    isOpen: k,
                    onClose: () => h(!1),
                    isDark: t
                }), e.jsx(Ge, {
                    isOpen: y,
                    onClose: () => {
                        z(!1)
                    },
                    prefillType: "mock"
                }), e.jsx(Ft, {
                    isOpen: B,
                    onClose: () => {
                        C(!1), q(void 0)
                    },
                    initialData: W
                })]
            })]
        }) : e.jsxs("div", {
            className: "app-shell h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-white flex overflow-hidden",
            children: [e.jsx(Oe, {
                activeTab: a,
                setActiveTab: x,
                isDark: t,
                toggleTheme: r,
                mobileMenuOpen: K,
                setMobileMenuOpen: Q
            }), e.jsx("main", {
                className: "flex-1 relative flex flex-col h-screen overflow-hidden items-center justify-center p-4 sm:p-8",
                children: e.jsxs("div", {
                    className: "max-w-md w-full text-center",
                    children: [e.jsx("div", {
                        className: "w-24 h-24 bg-brand-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-brand-500/20",
                        children: e.jsx(Ae, {
                            className: "w-12 h-12 text-brand-500"
                        })
                    }), e.jsx("h2", {
                        className: "text-3xl font-bold text-zinc-900 dark:text-white mb-3",
                        children: "No Subjects Yet"
                    }), e.jsx("p", {
                        className: "text-zinc-500 dark:text-zinc-400 mb-8",
                        children: "Create your first subject to start tracking your syllabus and study progress."
                    }), e.jsx("button", {
                        onClick: () => m(!0),
                        className: "px-8 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold shadow-lg shadow-brand-900/20 transition-all hover:scale-105",
                        children: "Create Subject"
                    })]
                })
            }), e.jsx(ie, {
                children: j && e.jsx(qe, {
                    onClose: () => u(!1)
                })
            }), e.jsx(Ye, {
                isOpen: n,
                onClose: () => m(!1),
                subjectToEdit: b
            }), e.jsx(Ge, {
                isOpen: y,
                onClose: () => z(!1),
                prefillType: "mock"
            }), e.jsx(Be, {
                isOpen: k,
                onClose: () => h(!1),
                isDark: t
            })]
        })
    };
export {
    Ws as
    default
};