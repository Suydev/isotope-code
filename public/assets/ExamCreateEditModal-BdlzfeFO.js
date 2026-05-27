import {
    r as x,
    j as e
} from "./vendor-react-BfU3Zn2J.js";
import {
    c as h
} from "./utils-D8mZnxMk.js";
import {
    c as ie
} from "./useAIStore-B2cv1FZz.js";
import {
    p as y,
    u as le,
    l as X,
    m as V
} from "./useFocusStore-CX_Nyp1h.js";
import {
    bu as oe,
    aE as ce,
    bj as de,
    bv as ue,
    ba as me,
    a as xe,
    X as pe,
    d as be,
    bw as A,
    aw as I,
    i as he
} from "./vendor-icons-CqruUz7g.js";
import {
    A as ge,
    m as J
} from "./vendor-motion-Cp_NPzpZ.js";

function w(a) {
    const n = y(a.date),
        s = a.start_time ? parseInt(a.start_time.split(":")[0], 10) : 0,
        l = a.start_time ? parseInt(a.start_time.split(":")[1], 10) : 0;
    return n.setHours(s, l, 0, 0), n.getTime()
}

function F(a = 1e3) {
    const [n, s] = x.useState(() => new Date);
    return x.useEffect(() => {
        const l = setInterval(() => s(new Date), a);
        return () => clearInterval(l)
    }, [a]), n
}

function _e(a, n) {
    if (a.archived_at) return "archived";
    if (a.result ?.logged_at) return "result_logged";
    const s = y(a.date),
        l = a.start_time ? parseInt(a.start_time.split(":")[0], 10) : 0,
        u = a.start_time ? parseInt(a.start_time.split(":")[1], 10) : 0,
        d = new Date(s);
    d.setHours(l, u, 0, 0);
    const m = new Date(d.getTime() + a.duration_minutes * 60 * 1e3);
    if (n >= d && n < m) return "in_progress";
    if (n < d) return "upcoming";
    if (a.result_declaration_date) {
        const o = y(a.result_declaration_date),
            c = new Date(o.getTime() + 10080 * 60 * 1e3);
        if (n < o) return "pending_result";
        if (n >= o || n > c) return "result_ready"
    }
    return (n.getTime() - m.getTime()) / (1e3 * 60 * 60 * 24) <= 7 ? "pending_result" : "result_ready"
}

function Ee(a) {
    const n = F(1e3);
    return x.useMemo(() => {
        if (!a) return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            totalSeconds: 0,
            isExpired: !0
        };
        const s = y(a.date),
            l = a.start_time ? parseInt(a.start_time.split(":")[0], 10) : 0,
            u = a.start_time ? parseInt(a.start_time.split(":")[1], 10) : 0,
            d = new Date(s);
        d.setHours(l, u, 0, 0);
        const m = d.getTime() - n.getTime();
        if (m <= 0) return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            totalSeconds: 0,
            isExpired: !0
        };
        const b = Math.floor(m / 1e3),
            o = Math.floor(b / 86400),
            c = Math.floor(b % 86400 / 3600),
            f = Math.floor(b % 3600 / 60),
            g = b % 60;
        return {
            days: o,
            hours: c,
            minutes: f,
            seconds: g,
            totalSeconds: b,
            isExpired: !1
        }
    }, [a, n])
}

function Ae(a) {
    const n = F(1e3);
    return x.useMemo(() => {
        if (!a) return {
            elapsed: 0,
            total: 0,
            remaining: 0,
            percentage: 0
        };
        const s = y(a.date),
            l = a.start_time ? parseInt(a.start_time.split(":")[0], 10) : 0,
            u = a.start_time ? parseInt(a.start_time.split(":")[1], 10) : 0,
            d = new Date(s);
        d.setHours(l, u, 0, 0);
        const m = a.duration_minutes,
            b = n.getTime() - d.getTime(),
            o = Math.max(0, Math.min(m, b / 6e4)),
            c = Math.max(0, m - o),
            f = m > 0 ? Math.min(100, o / m * 100) : 0;
        return {
            elapsed: Math.round(o),
            total: m,
            remaining: Math.round(c),
            percentage: f
        }
    }, [a, n])
}

function Ie(a) {
    const n = F(6e4),
        s = x.useMemo(() => a.map(o => ({ ...o,
            _status: _e(o, n)
        })), [a, n]),
        l = x.useMemo(() => {
            const o = s.filter(g => g.exam_type === "dday"),
                c = o.filter(g => g._status === "in_progress").sort((g, j) => w(g) - w(j));
            return c.length > 0 ? c[0] : o.filter(g => g._status === "upcoming").sort((g, j) => w(g) - w(j))[0] || null
        }, [s]),
        u = x.useMemo(() => s.filter(c => c._status === "upcoming" && c.id !== l ?.id).sort((c, f) => w(c) - w(f))[0] || null, [s, l]),
        d = x.useMemo(() => {
            if (!l) return [];
            const o = y(l.date).toDateString();
            return s.filter(c => c.id !== l.id && c.exam_type === "dday" && y(c.date).toDateString() === o && (c._status === "upcoming" || c._status === "in_progress"))
        }, [s, l]),
        m = x.useMemo(() => s.filter(o => o._status === "result_ready" && !o.result_reminder_dismissed && (!o.result_reminder_snoozed_until || new Date(o.result_reminder_snoozed_until) <= n)), [s, n]),
        b = x.useMemo(() => {
            const o = {
                all: 0,
                upcoming: 0,
                in_progress: 0,
                awaiting_result: 0,
                completed: 0,
                archived: 0
            };
            return s.forEach(c => {
                c._status !== "archived" && o.all++, c._status === "upcoming" && o.upcoming++, c._status === "in_progress" && o.in_progress++, (c._status === "pending_result" || c._status === "result_ready") && o.awaiting_result++, c._status === "result_logged" && o.completed++, c._status === "archived" && o.archived++
            }), o
        }, [s]);
    return {
        examsWithStatus: s,
        featuredExam: l,
        otherLatestExam: u,
        resultReadyExams: m,
        statusCounts: b,
        sameDayExams: d
    }
}

function fe(a) {
    const n = x.useMemo(() => {
            const u = new Map;
            return a.forEach(d => {
                Object.entries(d.tag_colors || {}).forEach(([m, b]) => {
                    const o = m.replace(/^#/, "");
                    o && b && !u.has(o) && u.set(o, b)
                })
            }), u
        }, [a]),
        s = x.useMemo(() => {
            const u = new Map;
            return a.forEach(d => {
                d.tags.forEach(m => {
                    const b = m.replace(/^#/, "");
                    u.set(b, (u.get(b) || 0) + 1)
                })
            }), Array.from(u.entries()).sort((d, m) => m[1] - d[1]).map(([d]) => d)
        }, [a]),
        l = x.useCallback(u => {
            const d = u.replace(/^#/, "").toLowerCase();
            return d ? s.filter(m => m.toLowerCase().includes(d)).slice(0, 10) : s.slice(0, 10)
        }, [s]);
    return {
        allTags: s,
        tagColors: n,
        getSuggestions: l
    }
}
const ke = {
        title: "",
        description: "",
        exam_type: "mock",
        dday_exam_id: "",
        priority: "medium",
        color: "#6366f1",
        tags: [],
        tag_colors: {},
        date: "",
        start_time: "",
        duration_minutes: 180,
        chapter_ids: [],
        total_marks: "",
        correct_marks: "",
        negative_marks: "",
        result_declaration_date: "",
        result_declaration_url: "",
        remind_on_result: !1
    },
    K = ["#6366f1", "#8b5cf6", "#ec4899", "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4"],
    R = {
        dday: {
            label: "D-Day Exam",
            emoji: "🎯",
            description: "Real, high-stakes exam"
        },
        mock: {
            label: "Full Mock",
            emoji: "📋",
            description: "Full-length practice attempt"
        },
        sectional: {
            label: "Sectional Test",
            emoji: "📚",
            description: "Subject or chapter specific"
        },
        practice: {
            label: "Practice",
            emoji: "✏️",
            description: "Loose, uncategorized attempt"
        }
    },
    P = {
        critical: {
            label: "Critical",
            description: "Must-not-miss",
            dotColor: "bg-red-500",
            bgColor: "bg-red-500/10",
            textColor: "text-red-500 dark:text-red-400",
            borderColor: "border-red-500/30"
        },
        high: {
            label: "High",
            description: "Very important",
            dotColor: "bg-orange-500",
            bgColor: "bg-orange-500/10",
            textColor: "text-orange-500 dark:text-orange-400",
            borderColor: "border-orange-500/30"
        },
        medium: {
            label: "Medium",
            description: "Standard",
            dotColor: "bg-blue-500",
            bgColor: "bg-blue-500/10",
            textColor: "text-blue-500 dark:text-blue-400",
            borderColor: "border-blue-500/30"
        },
        low: {
            label: "Low",
            description: "Supplementary",
            dotColor: "bg-zinc-400",
            bgColor: "bg-zinc-400/10",
            textColor: "text-zinc-500 dark:text-zinc-400",
            borderColor: "border-zinc-400/30"
        }
    },
    ye = {
        upcoming: {
            label: "Upcoming",
            icon: "clock",
            colorClass: "text-blue-500 dark:text-blue-400",
            bgClass: "bg-blue-500/10"
        },
        in_progress: {
            label: "In Progress",
            icon: "activity",
            colorClass: "text-green-500 dark:text-green-400",
            bgClass: "bg-green-500/10"
        },
        pending_result: {
            label: "Result Pending",
            icon: "hourglass",
            colorClass: "text-zinc-500 dark:text-zinc-400",
            bgClass: "bg-zinc-500/10"
        },
        result_ready: {
            label: "Results Out",
            icon: "bell",
            colorClass: "text-amber-500 dark:text-amber-400",
            bgClass: "bg-amber-500/10"
        },
        result_logged: {
            label: "Completed",
            icon: "check-circle",
            colorClass: "text-emerald-500 dark:text-emerald-400",
            bgClass: "bg-emerald-500/10"
        },
        archived: {
            label: "Archived",
            icon: "archive",
            colorClass: "text-zinc-400 dark:text-zinc-500",
            bgClass: "bg-zinc-400/10"
        }
    },
    Re = [{
        id: "all",
        label: "All"
    }, {
        id: "upcoming",
        label: "Upcoming"
    }, {
        id: "in_progress",
        label: "In Progress"
    }, {
        id: "awaiting_result",
        label: "Awaiting Result"
    }, {
        id: "completed",
        label: "Completed"
    }, {
        id: "archived",
        label: "Archived"
    }],
    we = {
        upcoming: xe,
        in_progress: me,
        pending_result: ue,
        result_ready: de,
        result_logged: ce,
        archived: oe
    },
    Pe = ({
        status: a,
        className: n,
        size: s = "sm"
    }) => {
        const l = ye[a],
            u = we[a];
        return e.jsxs("span", {
            className: h("inline-flex items-center gap-1.5 font-medium rounded-full", l.bgClass, l.colorClass, s === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm", n),
            children: [a === "in_progress" ? e.jsxs("span", {
                className: "relative flex h-2 w-2",
                children: [e.jsx("span", {
                    className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
                }), e.jsx("span", {
                    className: "relative inline-flex rounded-full h-2 w-2 bg-green-500"
                })]
            }) : e.jsx(u, {
                className: s === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"
            }), l.label]
        })
    },
    Fe = ({
        priority: a,
        className: n,
        showLabel: s = !0
    }) => {
        const l = P[a];
        return e.jsxs("span", {
            className: h("inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full", l.bgColor, l.textColor, n),
            children: [e.jsx("span", {
                className: h("w-1.5 h-1.5 rounded-full", l.dotColor)
            }), s && l.label]
        })
    },
    Le = ({
        type: a,
        className: n
    }) => {
        const s = R[a];
        return e.jsxs("span", {
            className: h("inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full", "bg-zinc-100 dark:bg-white/[0.06] text-zinc-600 dark:text-zinc-300", a === "dday" && "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20", n),
            children: [e.jsx("span", {
                className: "text-[10px]",
                children: s.emoji
            }), s.label]
        })
    };

function je(a) {
    let n = 0;
    for (let l = 0; l < a.length; l++) n = a.charCodeAt(l) + ((n << 5) - n);
    const s = ["bg-blue-500/10 text-blue-600 dark:text-blue-400", "bg-purple-500/10 text-purple-600 dark:text-purple-400", "bg-pink-500/10 text-pink-600 dark:text-pink-400", "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", "bg-amber-500/10 text-amber-600 dark:text-amber-400", "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400", "bg-rose-500/10 text-rose-600 dark:text-rose-400", "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"];
    return s[Math.abs(n) % s.length]
}
const ve = ({
        tag: a,
        color: n,
        onRemove: s,
        onClick: l,
        className: u
    }) => e.jsxs("span", {
        className: h("inline-flex items-center gap-0.5 px-2 py-0.5 text-xs font-medium rounded-full transition-all duration-150", !n && je(a.replace(/^#/, "")), l && "cursor-pointer hover:opacity-80", u),
        style: n ? {
            backgroundColor: `${n}1f`,
            color: n,
            borderColor: `${n}40`
        } : void 0,
        onClick: l,
        children: [e.jsx("span", {
            className: "opacity-50",
            children: "#"
        }), a.replace(/^#/, ""), s && e.jsx("button", {
            onClick: d => {
                d.stopPropagation(), s()
            },
            className: "ml-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10",
            "aria-label": `Remove tag ${a}`,
            children: e.jsx("span", {
                className: "text-[10px] leading-none",
                children: "×"
            })
        })]
    }),
    Oe = ({
        percentage: a,
        size: n = "md",
        className: s
    }) => {
        const l = a >= 70 ? "text-emerald-500 dark:text-emerald-400" : a >= 50 ? "text-amber-500 dark:text-amber-400" : "text-rose-500 dark:text-rose-400",
            u = n === "sm" ? "text-lg" : n === "lg" ? "text-4xl" : "text-2xl";
        return e.jsxs("span", {
            className: h(u, "font-bold tabular-nums", l, s),
            children: [Math.round(a * 10) / 10, e.jsx("span", {
                className: "text-[0.6em] ml-0.5",
                children: "%"
            })]
        })
    },
    ze = ({
        color: a,
        size: n = 10,
        className: s
    }) => e.jsx("span", {
        className: h("inline-block rounded-full flex-shrink-0", s),
        style: {
            width: n,
            height: n,
            backgroundColor: a
        }
    }),
    He = ({
        isOpen: a,
        onClose: n,
        editExam: s,
        prefillType: l,
        prefillDDayId: u
    }) => {
        const {
            exams: d,
            addExam: m,
            updateExam: b,
            deleteExam: o,
            archiveExam: c
        } = ie(), {
            subjects: f
        } = le(), {
            tagColors: g,
            getSuggestions: j
        } = fe(d), v = !!s, z = x.useCallback(() => s ? {
            title: s.title,
            description: s.description || "",
            exam_type: s.exam_type,
            dday_exam_id: s.dday_exam_id || "",
            priority: s.priority,
            color: s.color,
            tags: [...s.tags],
            tag_colors: s.tag_colors || {},
            date: s.date ? X(s.date) : "",
            start_time: s.start_time || "",
            duration_minutes: s.duration_minutes,
            chapter_ids: [...s.chapter_ids],
            total_marks: s.total_marks ?.toString() || "",
            correct_marks: s.marking_scheme ?.correct_marks ?.toString() || "",
            negative_marks: s.marking_scheme ?.negative_marks ?.toString() || "",
            result_declaration_date: s.result_declaration_date ? X(s.result_declaration_date) : "",
            result_declaration_url: s.result_declaration_url || "",
            remind_on_result: !!s.result_declaration_date
        } : { ...ke,
            exam_type: l || "mock",
            dday_exam_id: u || ""
        }, [s, u, l]), [r, L] = x.useState(z), [N, O] = x.useState(!1), [C, S] = x.useState(""), [H, M] = x.useState([]), [T, Y] = x.useState(!1), [D, W] = x.useState(!1), [E, q] = x.useState(!1);
        x.useEffect(() => {
            a && L(z())
        }, [a, s, z]);
        const p = t => L(i => ({ ...i,
                ...t
            })),
            G = d.filter(t => t.exam_type === "dday" && !t.deleted_at && !t.archived_at),
            Q = `${Math.floor(r.duration_minutes/60)}h ${r.duration_minutes%60>0?`${r.duration_minutes%60}m`:""}`.trim(),
            Z = t => t.trim().replace(/^#/, ""),
            U = t => {
                const i = Z(t);
                !i || r.tags.includes(i) || r.tags.length >= 10 || p({
                    tags: [...r.tags, i],
                    tag_colors: { ...r.tag_colors,
                        [i]: g.get(i) || r.color
                    }
                })
            },
            ee = t => {
                const i = { ...r.tag_colors
                };
                delete i[t], p({
                    tags: r.tags.filter(_ => _ !== t),
                    tag_colors: i
                })
            },
            $ = (t, i) => {
                p({
                    tag_colors: { ...r.tag_colors,
                        [t]: i
                    }
                })
            },
            te = t => {
                (t.key === "Enter" || t.key === ",") && C.trim() && (t.preventDefault(), U(C), S(""), M([]))
            },
            re = t => {
                S(t), M(t.length > 0 ? j(t) : [])
            },
            se = async () => {
                if (!(!r.title.trim() || !r.date)) {
                    O(!0);
                    try {
                        const t = r.correct_marks && r.negative_marks ? {
                                correct_marks: parseFloat(r.correct_marks),
                                negative_marks: parseFloat(r.negative_marks)
                            } : void 0,
                            i = {
                                title: r.title.trim(),
                                description: r.description.trim() || void 0,
                                exam_type: r.exam_type,
                                dday_exam_id: r.exam_type !== "dday" && r.dday_exam_id ? r.dday_exam_id : void 0,
                                priority: r.priority,
                                color: r.color,
                                tags: r.tags,
                                tag_colors: r.tags.reduce((_, k) => {
                                    const B = r.tag_colors[k];
                                    return B && (_[k] = B), _
                                }, {}),
                                date: V(r.date),
                                start_time: r.start_time || void 0,
                                duration_minutes: r.duration_minutes,
                                chapter_ids: r.chapter_ids,
                                total_marks: r.total_marks ? parseFloat(r.total_marks) : void 0,
                                marking_scheme: t,
                                result_declaration_date: r.result_declaration_date ? V(r.result_declaration_date) : void 0,
                                result_declaration_url: r.result_declaration_url || void 0
                            };
                        v && s ? await b(s.id, i) : await m(i), n()
                    } catch (t) {
                        console.error("[ExamModal] Save failed:", t)
                    } finally {
                        O(!1)
                    }
                }
            },
            ae = async () => {
                !s || !window.confirm("Delete this exam? This cannot be undone.") || (await o(s.id), n())
            },
            ne = async () => {
                s && (await c(s.id), n())
            };
        return a ? e.jsx(ge, {
            children: e.jsxs(J.div, {
                className: "fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-4",
                initial: {
                    opacity: 0
                },
                animate: {
                    opacity: 1
                },
                exit: {
                    opacity: 0
                },
                children: [e.jsx("div", {
                    className: "absolute inset-0 bg-black/50 backdrop-blur-sm",
                    onClick: n
                }), e.jsxs(J.div, {
                    initial: {
                        opacity: 0,
                        scale: .96,
                        y: 20
                    },
                    animate: {
                        opacity: 1,
                        scale: 1,
                        y: 0
                    },
                    exit: {
                        opacity: 0,
                        scale: .96,
                        y: 20
                    },
                    transition: {
                        duration: .2,
                        ease: "easeOut"
                    },
                    className: h("relative w-full max-w-3xl max-h-[min(92dvh,50rem)] overflow-hidden rounded-2xl", "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/[0.08]", "shadow-2xl flex flex-col"),
                    children: [e.jsxs("div", {
                        className: "flex items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 border-b border-zinc-100 dark:border-white/[0.06]",
                        children: [e.jsx("h2", {
                            className: "text-lg font-semibold text-zinc-900 dark:text-white",
                            children: v ? "Edit Exam" : "Schedule Exam"
                        }), e.jsx("button", {
                            onClick: n,
                            className: "w-8 h-8 rounded-lg flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors",
                            children: e.jsx(pe, {
                                className: "w-4 h-4 text-zinc-400"
                            })
                        })]
                    }), e.jsxs("div", {
                        className: "flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 space-y-5 sm:space-y-6",
                        children: [e.jsxs("div", {
                            className: "space-y-4",
                            children: [e.jsx("input", {
                                type: "text",
                                value: r.title,
                                onChange: t => p({
                                    title: t.target.value
                                }),
                                placeholder: "e.g. JEE Mains January Session",
                                className: "w-full text-lg font-medium bg-transparent border-b-2 border-zinc-200 dark:border-white/10 focus:border-brand-500 dark:focus:border-brand-400 outline-none pb-2 text-zinc-900 dark:text-white placeholder:text-zinc-400 transition-colors",
                                autoFocus: !0
                            }), e.jsxs("div", {
                                children: [e.jsx("label", {
                                    className: "text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2 block",
                                    children: "Exam Type"
                                }), e.jsx("div", {
                                    className: "grid grid-cols-2 sm:grid-cols-4 gap-2",
                                    children: Object.keys(R).map(t => {
                                        const i = R[t],
                                            _ = r.exam_type === t;
                                        return e.jsxs("button", {
                                            onClick: () => p({
                                                exam_type: t
                                            }),
                                            className: h("flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all", _ ? "border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400" : "border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-white/20"),
                                            children: [e.jsx("span", {
                                                children: i.emoji
                                            }), " ", i.label]
                                        }, t)
                                    })
                                })]
                            }), r.exam_type !== "dday" && e.jsxs("div", {
                                children: [e.jsx("label", {
                                    className: "text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 block",
                                    children: "Link to D-Day Exam (optional)"
                                }), e.jsxs("select", {
                                    value: r.dday_exam_id,
                                    onChange: t => p({
                                        dday_exam_id: t.target.value
                                    }),
                                    className: "w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-white outline-none focus:border-brand-500",
                                    children: [e.jsx("option", {
                                        value: "",
                                        children: "None"
                                    }), G.map(t => e.jsx("option", {
                                        value: t.id,
                                        children: t.title
                                    }, t.id))]
                                })]
                            }), e.jsx("textarea", {
                                value: r.description,
                                onChange: t => p({
                                    description: t.target.value
                                }),
                                placeholder: "Any notes about this exam...",
                                rows: 2,
                                className: "w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-white outline-none focus:border-brand-500 resize-none placeholder:text-zinc-400"
                            })]
                        }), e.jsxs("div", {
                            className: "space-y-3",
                            children: [e.jsx("h3", {
                                className: "text-xs font-semibold text-zinc-400 uppercase tracking-wider",
                                children: "Schedule"
                            }), e.jsxs("div", {
                                className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
                                children: [e.jsxs("div", {
                                    children: [e.jsx("label", {
                                        className: "text-xs text-zinc-500 dark:text-zinc-400 mb-1 block",
                                        children: "Date"
                                    }), e.jsx("input", {
                                        type: "date",
                                        value: r.date,
                                        onChange: t => p({
                                            date: t.target.value
                                        }),
                                        className: "w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-white outline-none focus:border-brand-500"
                                    })]
                                }), e.jsxs("div", {
                                    children: [e.jsx("label", {
                                        className: "text-xs text-zinc-500 dark:text-zinc-400 mb-1 block",
                                        children: "Start Time"
                                    }), e.jsx("input", {
                                        type: "time",
                                        value: r.start_time,
                                        onChange: t => p({
                                            start_time: t.target.value
                                        }),
                                        className: "w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-white outline-none focus:border-brand-500"
                                    })]
                                }), e.jsxs("div", {
                                    children: [e.jsx("label", {
                                        className: "text-xs text-zinc-500 dark:text-zinc-400 mb-1 block",
                                        children: "Duration (min)"
                                    }), e.jsxs("div", {
                                        className: "flex items-center gap-2",
                                        children: [e.jsx("input", {
                                            type: "number",
                                            value: r.duration_minutes,
                                            onChange: t => p({
                                                duration_minutes: Math.max(1, parseInt(t.target.value) || 0)
                                            }),
                                            className: "flex-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-white outline-none focus:border-brand-500"
                                        }), e.jsx("span", {
                                            className: "text-xs text-zinc-400 whitespace-nowrap",
                                            children: Q
                                        })]
                                    })]
                                })]
                            })]
                        }), e.jsxs("div", {
                            className: "space-y-4",
                            children: [e.jsx("h3", {
                                className: "text-xs font-semibold text-zinc-400 uppercase tracking-wider",
                                children: "Identity"
                            }), e.jsxs("div", {
                                children: [e.jsx("label", {
                                    className: "text-xs text-zinc-500 dark:text-zinc-400 mb-2 block",
                                    children: "Priority"
                                }), e.jsx("div", {
                                    className: "grid grid-cols-2 sm:grid-cols-4 gap-2",
                                    children: Object.keys(P).map(t => {
                                        const i = P[t],
                                            _ = r.priority === t;
                                        return e.jsxs("button", {
                                            onClick: () => p({
                                                priority: t
                                            }),
                                            className: h("flex flex-col items-start px-3 py-2.5 rounded-xl border text-left transition-all", _ ? "border-brand-500 bg-brand-500/10" : "border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20"),
                                            children: [e.jsxs("span", {
                                                className: "flex items-center gap-1.5",
                                                children: [e.jsx("span", {
                                                    className: h("w-2 h-2 rounded-full", i.dotColor)
                                                }), e.jsx("span", {
                                                    className: "text-sm font-medium text-zinc-900 dark:text-white",
                                                    children: i.label
                                                })]
                                            }), e.jsx("span", {
                                                className: "text-[11px] text-zinc-400 mt-0.5",
                                                children: i.description
                                            })]
                                        }, t)
                                    })
                                })]
                            }), e.jsxs("div", {
                                children: [e.jsx("label", {
                                    className: "text-xs text-zinc-500 dark:text-zinc-400 mb-2 block",
                                    children: "Color"
                                }), e.jsx("div", {
                                    className: "flex items-center gap-2 flex-wrap",
                                    children: K.map(t => e.jsx("button", {
                                        onClick: () => p({
                                            color: t
                                        }),
                                        className: h("w-8 h-8 rounded-full flex items-center justify-center transition-all border-2", r.color === t ? "border-zinc-900 dark:border-white scale-110" : "border-transparent hover:scale-105"),
                                        style: {
                                            backgroundColor: t
                                        },
                                        children: r.color === t && e.jsx(be, {
                                            className: "w-3.5 h-3.5 text-white"
                                        })
                                    }, t))
                                })]
                            }), e.jsxs("div", {
                                children: [e.jsx("label", {
                                    className: "text-xs text-zinc-500 dark:text-zinc-400 mb-1.5 block",
                                    children: "Tags"
                                }), e.jsxs("div", {
                                    className: "flex flex-wrap items-center gap-1.5 p-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800/50 min-h-[40px]",
                                    children: [r.tags.map(t => e.jsx(ve, {
                                        tag: t,
                                        color: r.tag_colors[t],
                                        onRemove: () => ee(t)
                                    }, t)), e.jsx("input", {
                                        type: "text",
                                        value: C,
                                        onChange: t => re(t.target.value),
                                        onKeyDown: te,
                                        placeholder: r.tags.length === 0 ? "Type a tag and press Enter..." : "",
                                        className: "flex-1 min-w-[80px] text-sm bg-transparent outline-none text-zinc-900 dark:text-white placeholder:text-zinc-400"
                                    })]
                                }), H.length > 0 && e.jsx("div", {
                                    className: "mt-1 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-lg py-1 max-h-32 overflow-y-auto",
                                    children: H.map(t => e.jsxs("button", {
                                        onClick: () => {
                                            U(t), S(""), M([])
                                        },
                                        className: "w-full text-left px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/[0.04]",
                                        children: ["#", t]
                                    }, t))
                                }), r.tags.length > 0 && e.jsx("div", {
                                    className: "mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2",
                                    children: r.tags.map(t => e.jsxs("div", {
                                        className: "flex items-center justify-between gap-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/80 dark:bg-white/[0.03] px-3 py-2",
                                        children: [e.jsxs("div", {
                                            className: "min-w-0 flex items-center gap-2",
                                            children: [e.jsx(ze, {
                                                color: r.tag_colors[t] || r.color,
                                                size: 12
                                            }), e.jsxs("span", {
                                                className: "truncate text-xs font-medium text-zinc-700 dark:text-zinc-300",
                                                children: ["#", t]
                                            })]
                                        }), e.jsxs("div", {
                                            className: "flex items-center gap-1.5",
                                            children: [K.map(i => e.jsx("button", {
                                                type: "button",
                                                onClick: () => $(t, i),
                                                "aria-label": `Set ${t} tag color`,
                                                className: h("w-5 h-5 rounded-full border transition-transform hover:scale-110", (r.tag_colors[t] || r.color) === i ? "border-zinc-900 dark:border-white" : "border-transparent"),
                                                style: {
                                                    backgroundColor: i
                                                }
                                            }, `${t}-${i}`)), e.jsx("input", {
                                                type: "color",
                                                value: r.tag_colors[t] || r.color,
                                                onChange: i => $(t, i.target.value),
                                                "aria-label": `Pick custom color for ${t}`,
                                                className: "w-6 h-6 rounded-md border-0 bg-transparent p-0 cursor-pointer"
                                            })]
                                        })]
                                    }, t))
                                })]
                            })]
                        }), e.jsxs("button", {
                            onClick: () => Y(!T),
                            className: "flex items-center justify-between w-full py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300",
                            children: ["Scoring Setup (optional)", T ? e.jsx(A, {
                                className: "w-4 h-4"
                            }) : e.jsx(I, {
                                className: "w-4 h-4"
                            })]
                        }), T && e.jsxs("div", {
                            className: "space-y-3 pl-1",
                            children: [e.jsxs("div", {
                                className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
                                children: [e.jsxs("div", {
                                    children: [e.jsx("label", {
                                        className: "text-xs text-zinc-400 mb-1 block",
                                        children: "Total Marks"
                                    }), e.jsx("input", {
                                        type: "number",
                                        value: r.total_marks,
                                        onChange: t => p({
                                            total_marks: t.target.value
                                        }),
                                        placeholder: "e.g. 300",
                                        className: "w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-white outline-none focus:border-brand-500"
                                    })]
                                }), e.jsxs("div", {
                                    children: [e.jsx("label", {
                                        className: "text-xs text-zinc-400 mb-1 block",
                                        children: "+ per correct"
                                    }), e.jsx("input", {
                                        type: "number",
                                        value: r.correct_marks,
                                        onChange: t => p({
                                            correct_marks: t.target.value
                                        }),
                                        placeholder: "+4",
                                        className: "w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-white outline-none focus:border-brand-500"
                                    })]
                                }), e.jsxs("div", {
                                    children: [e.jsx("label", {
                                        className: "text-xs text-zinc-400 mb-1 block",
                                        children: "- per wrong"
                                    }), e.jsx("input", {
                                        type: "number",
                                        value: r.negative_marks,
                                        onChange: t => p({
                                            negative_marks: t.target.value
                                        }),
                                        placeholder: "-1",
                                        className: "w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-white outline-none focus:border-brand-500"
                                    })]
                                })]
                            }), e.jsx("p", {
                                className: "text-[11px] text-zinc-400",
                                children: "Used to calculate net marks when you log your result."
                            })]
                        }), e.jsxs("button", {
                            onClick: () => W(!D),
                            className: "flex items-center justify-between w-full py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300",
                            children: ["Result Timeline (optional)", D ? e.jsx(A, {
                                className: "w-4 h-4"
                            }) : e.jsx(I, {
                                className: "w-4 h-4"
                            })]
                        }), D && e.jsx("div", {
                            className: "space-y-3 pl-1",
                            children: e.jsxs("div", {
                                className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
                                children: [e.jsxs("div", {
                                    children: [e.jsx("label", {
                                        className: "text-xs text-zinc-400 mb-1 block",
                                        children: "Expected Result Date"
                                    }), e.jsx("input", {
                                        type: "date",
                                        value: r.result_declaration_date,
                                        onChange: t => p({
                                            result_declaration_date: t.target.value
                                        }),
                                        className: "w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-white outline-none focus:border-brand-500"
                                    })]
                                }), e.jsxs("div", {
                                    children: [e.jsx("label", {
                                        className: "text-xs text-zinc-400 mb-1 block",
                                        children: "Result Portal URL"
                                    }), e.jsx("input", {
                                        type: "url",
                                        value: r.result_declaration_url,
                                        onChange: t => p({
                                            result_declaration_url: t.target.value
                                        }),
                                        placeholder: "Link to check results online",
                                        className: "w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800/50 text-sm text-zinc-900 dark:text-white outline-none focus:border-brand-500"
                                    })]
                                })]
                            })
                        }), e.jsxs("button", {
                            onClick: () => q(!E),
                            className: "flex items-center justify-between w-full py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300",
                            children: [e.jsxs("span", {
                                children: ["Map Chapters", " ", r.chapter_ids.length > 0 && e.jsxs("span", {
                                    className: "text-brand-500 ml-1",
                                    children: [r.chapter_ids.length, " selected"]
                                })]
                            }), E ? e.jsx(A, {
                                className: "w-4 h-4"
                            }) : e.jsx(I, {
                                className: "w-4 h-4"
                            })]
                        }), E && e.jsxs("div", {
                            className: "space-y-2 max-h-60 overflow-y-auto pl-1",
                            children: [f.filter(t => !t.deletedAt).map(t => e.jsxs("div", {
                                className: "space-y-1",
                                children: [e.jsxs("div", {
                                    className: "flex items-center justify-between",
                                    children: [e.jsxs("span", {
                                        className: "text-xs font-medium text-zinc-600 dark:text-zinc-300 flex items-center gap-2",
                                        children: [e.jsx("span", {
                                            className: "w-2 h-2 rounded-full",
                                            style: {
                                                backgroundColor: t.color
                                            }
                                        }), t.name]
                                    }), e.jsx("button", {
                                        onClick: () => {
                                            const i = t.chapters.map(k => k.id),
                                                _ = i.every(k => r.chapter_ids.includes(k));
                                            p(_ ? {
                                                chapter_ids: r.chapter_ids.filter(k => !i.includes(k))
                                            } : {
                                                chapter_ids: [...new Set([...r.chapter_ids, ...i])]
                                            })
                                        },
                                        className: "text-[10px] text-brand-500 hover:text-brand-400",
                                        children: t.chapters.every(i => r.chapter_ids.includes(i.id)) ? "Deselect all" : "Select all"
                                    })]
                                }), t.chapters.map(i => e.jsxs("label", {
                                    className: "flex items-center gap-2 pl-4 py-1 cursor-pointer hover:bg-zinc-50 dark:hover:bg-white/[0.02] rounded-lg",
                                    children: [e.jsx("input", {
                                        type: "checkbox",
                                        checked: r.chapter_ids.includes(i.id),
                                        onChange: () => {
                                            p({
                                                chapter_ids: r.chapter_ids.includes(i.id) ? r.chapter_ids.filter(_ => _ !== i.id) : [...r.chapter_ids, i.id]
                                            })
                                        },
                                        className: "w-3.5 h-3.5 rounded border-zinc-300 dark:border-zinc-600 text-brand-600 focus:ring-brand-500"
                                    }), e.jsx("span", {
                                        className: "text-xs text-zinc-600 dark:text-zinc-300",
                                        children: i.title
                                    }), e.jsxs("span", {
                                        className: "text-[10px] text-zinc-400 ml-auto",
                                        children: [i.topics.length, " topics"]
                                    })]
                                }, i.id))]
                            }, t.id)), f.filter(t => !t.deletedAt).length === 0 && e.jsx("p", {
                                className: "text-xs text-zinc-400 text-center py-4",
                                children: "No subjects found. Add subjects in Syllabus first."
                            })]
                        })]
                    }), e.jsxs("div", {
                        className: "flex flex-col items-stretch justify-between gap-3 px-4 py-3 sm:flex-row sm:items-center sm:px-6 sm:py-4 border-t border-zinc-100 dark:border-white/[0.06]",
                        children: [e.jsx("div", {
                            className: "flex items-center gap-3",
                            children: v && e.jsxs(e.Fragment, {
                                children: [e.jsx("button", {
                                    onClick: ae,
                                    className: "text-xs text-red-500 hover:text-red-400 font-medium",
                                    children: "Delete"
                                }), e.jsx("button", {
                                    onClick: ne,
                                    className: "text-xs text-zinc-400 hover:text-zinc-300 font-medium",
                                    children: "Archive"
                                })]
                            })
                        }), e.jsxs("div", {
                            className: "flex items-center justify-end gap-3",
                            children: [e.jsx("button", {
                                onClick: n,
                                className: "px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.06] rounded-xl transition-colors",
                                children: "Cancel"
                            }), e.jsxs("button", {
                                onClick: se,
                                disabled: N || !r.title.trim() || !r.date,
                                className: h("inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-xl transition-colors", "bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-600/20", "disabled:opacity-50 disabled:cursor-not-allowed"),
                                children: [N && e.jsx(he, {
                                    className: "w-3.5 h-3.5 animate-spin"
                                }), N ? "Saving..." : "Save"]
                            })]
                        })]
                    })]
                })]
            })
        }) : null
    };
export {
    ze as C, He as E, Oe as S, ve as T, P as a, Le as b, _e as c, Pe as d, Fe as e, Ae as f, R as g, Ie as h, fe as i, Re as j, Ee as u
};