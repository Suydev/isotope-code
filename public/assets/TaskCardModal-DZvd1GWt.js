import {
    j as e,
    r as a
} from "./vendor-react-BfU3Zn2J.js";
import {
    j as ft,
    u as yt,
    l as R,
    p as Y,
    m as Ge
} from "./useFocusStore-CX_Nyp1h.js";
import {
    u as vt
} from "./useAIStore-B2cv1FZz.js";
import {
    w as jt,
    S as Q,
    x as Nt,
    g as We
} from "./App-pJGjDiPw.js";
import {
    c as i
} from "./utils-D8mZnxMk.js";
import {
    m as h,
    A as Ce
} from "./vendor-motion-Cp_NPzpZ.js";
import {
    d as wt,
    T as He,
    P as kt,
    ap as St,
    ab as Se,
    X as zt,
    b3 as Ve,
    aj as Ue,
    L as B,
    g as Xe,
    aP as Ct,
    i as qe,
    ac as Tt,
    b4 as Dt,
    aS as ze,
    aV as ee,
    B as It,
    aw as Rt,
    am as At,
    aA as Je,
    b5 as Mt,
    Z as te,
    a as Lt,
    b6 as Et,
    S as Ke,
    r as Ft,
    b7 as Pt
} from "./vendor-icons-CqruUz7g.js";
import {
    a as Ze
} from "./timeFormat-CMPo-BX2.js";
import {
    i as Ot,
    f as $t
} from "./taskAvailability-B1aDS_ww.js";
import {
    u as Bt
} from "./vendor-router-CmoTwRnm.js";
const Gt = ({
        checked: d,
        onChange: p,
        size: j = "md",
        disabled: n = !1,
        accentColor: A
    }) => {
        const G = {
                sm: 16,
                md: 20,
                lg: 24
            },
            W = {
                sm: 9,
                md: 11,
                lg: 14
            },
            se = {
                sm: 4,
                md: 6,
                lg: 7
            },
            H = G[j],
            re = W[j],
            z = se[j],
            M = A || "var(--color-accent, #f97316)";
        return e.jsx(h.button, {
            type: "button",
            role: "checkbox",
            "aria-checked": d,
            disabled: n,
            onClick: ae => {
                ae.stopPropagation(), p(!d)
            },
            className: i("flex-shrink-0 flex items-center justify-center focus-visible:outline-none", n ? "opacity-50 cursor-not-allowed" : "cursor-pointer"),
            style: {
                width: H,
                height: H,
                borderRadius: z,
                border: `2px solid ${d?M:"var(--color-border, rgba(0,0,0,0.15))"}`,
                backgroundColor: d ? M : "transparent",
                transition: "border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease",
                boxShadow: d ? `0 0 0 3px ${A?A+"28":"var(--color-accent-ring, rgba(249,115,22,0.22))"}` : "none"
            },
            whileTap: n ? {} : {
                scale: .8
            },
            whileHover: n ? {} : {
                scale: 1.12
            },
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 20
            },
            children: e.jsx(Ce, {
                mode: "wait",
                children: d && e.jsx(h.div, {
                    initial: {
                        scale: 0,
                        opacity: 0,
                        rotate: -20
                    },
                    animate: {
                        scale: 1,
                        opacity: 1,
                        rotate: 0
                    },
                    exit: {
                        scale: 0,
                        opacity: 0,
                        rotate: 15
                    },
                    transition: {
                        type: "spring",
                        stiffness: 700,
                        damping: 20,
                        mass: .5
                    },
                    style: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    },
                    children: e.jsx(wt, {
                        size: re,
                        className: "text-white",
                        strokeWidth: 3.5
                    })
                }, "check")
            })
        })
    },
    _e = {
        p1: {
            label: "Critical",
            color: "bg-red-500",
            textColor: "text-red-500",
            borderColor: "border-red-500/20",
            bgColor: "bg-red-500/10"
        },
        p2: {
            label: "High",
            color: "bg-amber-500",
            textColor: "text-amber-500",
            borderColor: "border-amber-500/20",
            bgColor: "bg-amber-500/10"
        },
        p3: {
            label: "Medium",
            color: "bg-blue-500",
            textColor: "text-blue-500",
            borderColor: "border-blue-500/20",
            bgColor: "bg-blue-500/10"
        },
        p4: {
            label: "Low",
            color: "bg-emerald-500",
            textColor: "text-emerald-500",
            borderColor: "border-emerald-500/20",
            bgColor: "bg-emerald-500/10"
        }
    },
    Ye = {
        high: {
            label: "High Energy",
            icon: te,
            color: "text-amber-400",
            bgColor: "bg-amber-400/10"
        },
        medium: {
            label: "Medium",
            icon: te,
            color: "text-blue-400",
            bgColor: "bg-blue-400/10"
        },
        low: {
            label: "Low Energy",
            icon: te,
            color: "text-zinc-400",
            bgColor: "bg-zinc-400/10"
        }
    },
    Wt = [{
        value: "backlog",
        label: "Backlog"
    }, {
        value: "todo",
        label: "To Do"
    }, {
        value: "in-progress",
        label: "In Progress"
    }, {
        value: "review",
        label: "Review"
    }, {
        value: "done",
        label: "Done"
    }],
    Qt = ({
        isOpen: d,
        onClose: p,
        taskId: j,
        initialData: n
    }) => {
        const A = Bt(),
            {
                tasks: G,
                addTask: W,
                updateTask: se,
                deleteTask: H,
                duplicateTask: re
            } = ft(),
            {
                subjects: z,
                fetchSubjects: M
            } = yt(),
            {
                generateTaskBreakdown: ae,
                hasApiKey: oe
            } = vt(),
            s = a.useMemo(() => j ? G.find(t => t.id === j) : null, [j, G]),
            c = !!s,
            o = c && s ?.status === "done",
            [f, le] = a.useState(""),
            [ne, ce] = a.useState(""),
            [b, ie] = a.useState(""),
            [N, V] = a.useState(""),
            [U, L] = a.useState(""),
            [E, de] = a.useState("backlog"),
            [X, xe] = a.useState("p3"),
            [x, ue] = a.useState(""),
            [y, me] = a.useState(""),
            [F, pe] = a.useState(30),
            [q, be] = a.useState("medium"),
            [w, ge] = a.useState(""),
            [u, k] = a.useState([]),
            [J, he] = a.useState(""),
            [fe, ye] = a.useState(""),
            [v, ve] = a.useState(!1),
            [K, Te] = a.useState("daily"),
            [De, Ie] = a.useState(3),
            [Z, Re] = a.useState(""),
            [P, Ae] = a.useState(7),
            [Me, Le] = a.useState(24),
            [Ee, je] = a.useState(!1),
            [C, T] = a.useState(!1),
            [Ne, Fe] = a.useState(!1),
            [m, O] = a.useState({}),
            [$, Pe] = a.useState("details"),
            [Qe, we] = a.useState(!1),
            [et, Oe] = a.useState(!1),
            $e = jt(w, "taskDescription");
        a.useEffect(() => {
            d && M()
        }, [d, M]), a.useEffect(() => {
            d && (s ? (le(s.title), ce(s.subject), ie(s.subjectId || ""), V(s.chapterId || ""), L(s.topicId || ""), de(s.status), xe(s.priority), ue(s.releaseDate ? R(s.releaseDate) : ""), me(R(s.dueDate)), pe(s.effort), be(s.energy), ge(s.description || ""), k(s.subtasks || []), ve(s.isRecurring || !1), s.recurringConfig && (Te(s.recurringConfig.recurrenceType), Ie(s.recurringConfig.customDays || 3), Ae(s.recurringConfig.maxOccurrences || 7), Le(s.recurringConfig.createNextThreshold || 24), Re(s.recurringConfig.endDate || ""), je(s.isRecurring || !1))) : (le(n ?.title || ""), ce(n ?.subject || ""), ie(n ?.subjectId || ""), V(n ?.chapterId || ""), L(n ?.topicId || ""), de(n ?.status || "backlog"), xe(n ?.priority || "p3"), ue(n ?.releaseDate ? R(n.releaseDate) : ""), me(R(n ?.dueDate)), pe(30), be("medium"), ge(""), k(n ?.subtasks ?.map(t => ({ ...t
            })) || []), ve(!1), je(!1)), he(""), ye(""), O({}), Oe(!1), Pe("details"), we(!1))
        }, [d, s, n]), a.useEffect(() => {
            if (!c || !s) return;
            const t = {
                    title: f,
                    subject: ne,
                    subjectId: b,
                    chapterId: N,
                    topicId: U,
                    status: E,
                    priority: X,
                    releaseDate: x,
                    dueDate: y,
                    effort: F,
                    energy: q,
                    description: w,
                    subtasks: u,
                    isRecurring: v
                },
                r = {
                    title: s.title,
                    subject: s.subject,
                    subjectId: s.subjectId || "",
                    chapterId: s.chapterId || "",
                    topicId: s.topicId || "",
                    status: s.status,
                    priority: s.priority,
                    releaseDate: s.releaseDate ? R(s.releaseDate) : "",
                    dueDate: R(s.dueDate),
                    effort: s.effort,
                    energy: s.energy,
                    description: s.description || "",
                    subtasks: s.subtasks,
                    isRecurring: s.isRecurring || !1
                },
                l = JSON.stringify(t) !== JSON.stringify(r);
            Oe(l)
        }, [f, ne, b, N, U, E, X, x, y, F, q, w, u, v, c, s]);
        const tt = () => {
                const t = {};
                return f.trim() || (t.title = "Task title is required"), y || (t.dueDate = "Due date is required"), x && y && Y(x) > Y(y) && (t.releaseDate = "Release date must be on or before the deadline"), v && P > 30 && (t.maxOccurrences = "Max 30 occurrences allowed"), O(t), Object.keys(t).length === 0
            },
            st = async t => {
                if (t && t.preventDefault(), !!tt()) {
                    T(!0);
                    try {
                        const r = {
                            title: f.trim(),
                            subject: ne || "General",
                            subjectId: b === "general" ? void 0 : b || void 0,
                            chapterId: N || void 0,
                            topicId: U || void 0,
                            status: E,
                            priority: X,
                            releaseDate: x ? Ge(x) : void 0,
                            dueDate: Ge(y),
                            effort: F,
                            energy: q,
                            description: w.trim() || void 0,
                            subtasks: u
                        };
                        c && s ? await se(s.id, r) : v ? await W({ ...r,
                            isRecurring: !0,
                            recurringConfig: {
                                isRecurring: !0,
                                recurrenceType: K,
                                customDays: K === "custom" ? De : void 0,
                                endDate: Z || void 0,
                                maxOccurrences: P || void 0,
                                createNextThreshold: Me || 24,
                                occurrencesCreated: 1
                            }
                        }) : await W(r), p()
                    } catch (r) {
                        console.error("Failed to save task:", r), O({
                            submit: "Failed to save task. Please try again."
                        })
                    } finally {
                        T(!1)
                    }
                }
            },
            rt = async () => {
                if (s) {
                    T(!0);
                    try {
                        await H(s.id), p()
                    } catch (t) {
                        console.error("Failed to delete task:", t), O({
                            submit: "Failed to delete task."
                        })
                    } finally {
                        T(!1)
                    }
                }
            },
            at = async () => {
                if (s) {
                    T(!0);
                    try {
                        await re(s.id, {
                            resetStatus: !0
                        }), p()
                    } catch (t) {
                        console.error("Failed to duplicate task:", t), O({
                            submit: "Failed to duplicate task."
                        })
                    } finally {
                        T(!1)
                    }
                }
            },
            ot = () => {
                s && (D || (A("/focus", {
                    state: {
                        taskId: s.id,
                        taskTitle: s.title,
                        duration: s.effort * 60
                    }
                }), p()))
            },
            lt = async () => {
                const t = fe.trim();
                if (!(!f.trim() || !t || !oe)) {
                    Fe(!0);
                    try {
                        const r = await ae(f, t, w);
                        if (r.length > 0) {
                            const l = r.map(I => ({
                                id: We(),
                                title: I,
                                completed: !1
                            }));
                            k(I => [...I, ...l]), ye("")
                        }
                    } catch (r) {
                        console.error("AI Breakdown failed:", r)
                    } finally {
                        Fe(!1)
                    }
                }
            },
            nt = t => {
                if (t && t.preventDefault(), !J.trim()) return;
                const r = {
                    id: We(),
                    title: J.trim(),
                    completed: !1
                };
                k(l => [...l, r]), he("")
            },
            ct = t => {
                const r = u.map(l => l.id === t ? { ...l,
                    completed: !l.completed
                } : l);
                k(r)
            },
            it = t => {
                k(u.filter(r => r.id !== t))
            },
            dt = (t, r) => {
                k(u.map(l => l.id === t ? { ...l,
                    title: r
                } : l))
            },
            _ = u.filter(t => t.completed).length,
            g = u.length,
            Be = g > 0 ? _ / g * 100 : 0,
            D = !!s && !Ot({
                releaseDate: x
            }) && s.status !== "done",
            xt = x ? $t(x) : "",
            ke = a.useMemo(() => z.find(t => t.id === b), [b, z]),
            ut = a.useMemo(() => ke ?.chapters.find(t => t.id === N), [ke, N]),
            S = "var(--color-accent, #f97316)",
            mt = () => e.jsx("div", {
                className: "flex w-max min-w-full items-center gap-0.5 p-1 rounded-xl sm:w-auto sm:min-w-0",
                style: {
                    background: "var(--color-bg)",
                    border: "1px solid var(--color-border)"
                },
                children: [{
                    id: "details",
                    label: "Details",
                    icon: Dt
                }, {
                    id: "subtasks",
                    label: g > 0 ? `Subtasks ${_}/${g}` : "Subtasks",
                    icon: B
                }, ...c ? [{
                    id: "metadata",
                    label: "Metadata",
                    icon: ze
                }] : [], ...c ? [] : [{
                    id: "recurring",
                    label: "Recurring",
                    icon: ee
                }]].map(({
                    id: t,
                    label: r,
                    icon: l
                }) => {
                    const I = $ === t;
                    return e.jsxs("button", {
                        onClick: () => Pe(t),
                        className: "flex shrink-0 items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all",
                        style: {
                            background: I ? "var(--color-accent, #f97316)18" : "transparent",
                            color: I ? "var(--color-accent, #f97316)" : "var(--color-text-muted)"
                        },
                        children: [e.jsx(l, {
                            size: 12
                        }), r]
                    }, t)
                })
            }),
            pt = () => e.jsxs("div", {
                className: "space-y-5 animate-in fade-in duration-300",
                children: [e.jsxs("div", {
                    className: "space-y-1.5",
                    children: [e.jsxs("label", {
                        className: "flex items-center gap-1.5",
                        style: {
                            fontSize: 10,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            color: "var(--color-text-muted)"
                        },
                        children: [e.jsx(He, {
                            size: 11
                        }), "Task Title"]
                    }), e.jsx("input", {
                        type: "text",
                        value: f,
                        onChange: t => le(t.target.value),
                        placeholder: "What needs to be done?",
                        maxLength: Q.taskTitle.maxChars,
                        disabled: o,
                        className: i("w-full bg-transparent text-2xl font-bold border-none outline-none focus:ring-0 p-0", o && "opacity-60 cursor-not-allowed"),
                        style: {
                            color: "var(--color-text-primary)",
                            letterSpacing: "-0.02em"
                        },
                        autoFocus: !c
                    }), m.title && e.jsxs("p", {
                        className: "text-xs flex items-center gap-1",
                        style: {
                            color: "#ef4444"
                        },
                        children: [e.jsx(Ve, {
                            size: 11
                        }), m.title]
                    })]
                }), e.jsxs("div", {
                    className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                    children: [e.jsxs("div", {
                        className: "space-y-1.5",
                        children: [e.jsxs("label", {
                            className: "flex items-center gap-1.5",
                            style: {
                                fontSize: 10,
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                color: "var(--color-text-muted)"
                            },
                            children: [e.jsx(It, {
                                size: 11
                            }), "Subject"]
                        }), e.jsxs("div", {
                            className: "relative",
                            children: [e.jsxs("select", {
                                value: b,
                                onChange: t => {
                                    ie(t.target.value);
                                    const r = z.find(l => l.id === t.target.value);
                                    ce(r ?.name || "General"), V(""), L("")
                                },
                                disabled: o,
                                className: i("w-full appearance-none rounded-xl px-3 py-2.5 outline-none transition-all cursor-pointer text-sm", o && "opacity-60 cursor-not-allowed"),
                                style: {
                                    background: "var(--color-bg)",
                                    border: "1px solid var(--color-border)",
                                    color: "var(--color-text-primary)"
                                },
                                children: [e.jsx("option", {
                                    value: "",
                                    children: "Select Subject"
                                }), z.map(t => e.jsx("option", {
                                    value: t.id,
                                    children: t.name
                                }, t.id)), e.jsx("option", {
                                    value: "general",
                                    children: "General Task"
                                })]
                            }), e.jsx(Rt, {
                                size: 13,
                                className: "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none",
                                style: {
                                    color: "var(--color-text-muted)"
                                }
                            })]
                        })]
                    }), e.jsxs("div", {
                        className: "space-y-1.5",
                        children: [e.jsxs("label", {
                            className: "flex items-center gap-1.5",
                            style: {
                                fontSize: 10,
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                color: "var(--color-text-muted)"
                            },
                            children: [e.jsx(Xe, {
                                size: 11
                            }), "Release Date"]
                        }), e.jsx("input", {
                            type: "date",
                            value: x,
                            onChange: t => ue(t.target.value),
                            disabled: o,
                            className: i("w-full rounded-xl px-3 py-2.5 outline-none transition-all text-sm", o && "opacity-60 cursor-not-allowed"),
                            style: {
                                background: "var(--color-bg)",
                                border: "1px solid var(--color-border)",
                                color: "var(--color-text-primary)"
                            }
                        }), m.releaseDate ? e.jsx("p", {
                            className: "text-xs",
                            style: {
                                color: "#ef4444"
                            },
                            children: m.releaseDate
                        }) : e.jsx("p", {
                            className: "text-[10px]",
                            style: {
                                color: "var(--color-text-muted)"
                            },
                            children: "Optional. Hidden until this day."
                        })]
                    }), e.jsxs("div", {
                        className: "space-y-1.5",
                        children: [e.jsxs("label", {
                            className: "flex items-center gap-1.5",
                            style: {
                                fontSize: 10,
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                color: "var(--color-text-muted)"
                            },
                            children: [e.jsx(At, {
                                size: 11
                            }), "Deadline"]
                        }), e.jsx("input", {
                            type: "date",
                            value: y,
                            onChange: t => me(t.target.value),
                            disabled: o,
                            className: i("w-full rounded-xl px-3 py-2.5 outline-none transition-all text-sm", o && "opacity-60 cursor-not-allowed"),
                            style: {
                                background: "var(--color-bg)",
                                border: "1px solid var(--color-border)",
                                color: "var(--color-text-primary)"
                            }
                        }), m.dueDate && e.jsx("p", {
                            className: "text-xs",
                            style: {
                                color: "#ef4444"
                            },
                            children: m.dueDate
                        })]
                    })]
                }), b && b !== "general" && e.jsxs("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-300",
                    children: [e.jsxs("div", {
                        className: "space-y-2",
                        children: [e.jsx("label", {
                            className: "text-xs font-bold text-zinc-500 uppercase tracking-wider",
                            children: "Chapter"
                        }), e.jsxs("div", {
                            className: "relative",
                            children: [e.jsxs("select", {
                                value: N,
                                onChange: t => {
                                    V(t.target.value), L("")
                                },
                                disabled: o,
                                className: i("w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-200 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all cursor-pointer", o && "opacity-60 cursor-not-allowed"),
                                children: [e.jsx("option", {
                                    value: "",
                                    className: "bg-zinc-900",
                                    children: "Select Chapter"
                                }), [...ke ?.chapters || []].sort((t, r) => (t.order ?? 0) - (r.order ?? 0)).map(t => e.jsx("option", {
                                    value: t.id,
                                    className: "bg-zinc-900",
                                    children: t.title
                                }, t.id))]
                            }), e.jsx(B, {
                                className: "absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none"
                            })]
                        })]
                    }), e.jsxs("div", {
                        className: "space-y-2",
                        children: [e.jsx("label", {
                            className: "text-xs font-bold text-zinc-500 uppercase tracking-wider",
                            children: "Topic"
                        }), e.jsxs("div", {
                            className: "relative",
                            children: [e.jsxs("select", {
                                value: U,
                                onChange: t => L(t.target.value),
                                disabled: !N || o,
                                className: i("w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-200 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all cursor-pointer disabled:opacity-50", o && "opacity-60 cursor-not-allowed"),
                                children: [e.jsx("option", {
                                    value: "",
                                    className: "bg-zinc-900",
                                    children: "Select Topic"
                                }), [...ut ?.topics || []].sort((t, r) => (t.order ?? 0) - (r.order ?? 0)).map(t => e.jsx("option", {
                                    value: t.id,
                                    className: "bg-zinc-900",
                                    children: t.title
                                }, t.id))]
                            }), e.jsx(ze, {
                                className: "absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none"
                            })]
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "space-y-4",
                    children: [e.jsxs("label", {
                        className: "text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2",
                        children: [e.jsx(Je, {
                            className: "w-3.5 h-3.5"
                        }), "Status & Priority"]
                    }), e.jsxs("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                        children: [e.jsxs("div", {
                            className: "relative",
                            children: [e.jsx("select", {
                                value: E,
                                onChange: t => de(t.target.value),
                                disabled: o,
                                className: i("w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-200 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all cursor-pointer", o && "opacity-60 cursor-not-allowed"),
                                children: Wt.map(t => e.jsx("option", {
                                    value: t.value,
                                    className: "bg-zinc-900",
                                    children: t.label
                                }, t.value))
                            }), e.jsx(Mt, {
                                className: "absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none"
                            })]
                        }), e.jsx("div", {
                            className: "bg-white/5 border border-white/10 rounded-xl p-1 flex",
                            children: Object.keys(_e).map(t => {
                                const r = _e[t],
                                    l = X === t;
                                return e.jsxs("button", {
                                    type: "button",
                                    onClick: () => xe(t),
                                    disabled: o,
                                    className: i("flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all", l ? `${r.color} text-white shadow-lg` : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5", o && "opacity-60 cursor-not-allowed"),
                                    children: [e.jsx(Je, {
                                        className: "w-3 h-3"
                                    }), t.toUpperCase()]
                                }, t)
                            })
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "space-y-4",
                    children: [e.jsxs("label", {
                        className: "text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2",
                        children: [e.jsx(te, {
                            className: "w-3.5 h-3.5"
                        }), "Energy & Duration"]
                    }), e.jsxs("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                        children: [e.jsx("div", {
                            className: "bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl p-1.5 flex gap-1",
                            children: Object.keys(Ye).map(t => {
                                const r = Ye[t],
                                    l = q === t;
                                return e.jsxs("button", {
                                    type: "button",
                                    onClick: () => be(t),
                                    disabled: o,
                                    className: i("flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl text-[10px] font-bold transition-all duration-300", l ? "bg-white dark:bg-zinc-800 text-brand-500 shadow-sm border border-zinc-200 dark:border-white/10" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-white/50 dark:hover:bg-white/5 border border-transparent", o && "opacity-60 cursor-not-allowed"),
                                    children: [e.jsx(r.icon, {
                                        className: i("w-4 h-4", l ? "text-brand-500" : "text-zinc-400")
                                    }), r.label.split(" ")[0]]
                                }, t)
                            })
                        }), e.jsxs("div", {
                            className: "space-y-4 px-1",
                            children: [e.jsxs("div", {
                                className: "flex items-center justify-between",
                                children: [e.jsxs("label", {
                                    className: "text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2",
                                    children: [e.jsx(Lt, {
                                        className: "w-3.5 h-3.5"
                                    }), "Duration"]
                                }), e.jsxs("div", {
                                    className: "flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 shadow-sm shadow-brand-500/5 animate-in fade-in zoom-in duration-500",
                                    children: [e.jsx("div", {
                                        className: "w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"
                                    }), e.jsx("span", {
                                        className: "text-xs font-bold text-brand-500 font-mono tracking-tight",
                                        children: Ze(F)
                                    })]
                                })]
                            }), e.jsxs("div", {
                                className: "relative group",
                                children: [e.jsx("input", {
                                    type: "number",
                                    min: "5",
                                    step: "5",
                                    value: F,
                                    onChange: t => pe(Math.max(5, Number(t.target.value) || 5)),
                                    disabled: o,
                                    className: i("w-full rounded-2xl border border-zinc-200 bg-white/50 px-4 py-3.5 text-base font-bold text-zinc-900 outline-none transition-all duration-300 dark:border-white/10 dark:bg-white/5 dark:text-white", "focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10 focus:bg-white dark:focus:bg-zinc-900", o && "opacity-60 cursor-not-allowed"),
                                    "aria-label": "Duration in minutes"
                                }), e.jsx("span", {
                                    className: "absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest pointer-events-none group-focus-within:text-brand-500 transition-colors",
                                    children: "mins"
                                })]
                            }), e.jsx("p", {
                                className: "text-[10px] text-zinc-400 font-medium italic pl-1 leading-relaxed",
                                children: "* Estimate time in minutes for better session tracking"
                            })]
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "space-y-2",
                    children: [e.jsxs("label", {
                        className: "text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2",
                        children: [e.jsx(Et, {
                            className: "w-3.5 h-3.5"
                        }), "Description"]
                    }), e.jsx("textarea", {
                        value: w,
                        onChange: t => ge(t.target.value),
                        placeholder: "Add details, notes, or context...",
                        disabled: o,
                        className: i("w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-4 text-zinc-800 placeholder-zinc-400 transition-all duration-300 min-h-[120px] resize-none text-sm leading-relaxed", "dark:bg-white/5 dark:border-white/10 dark:text-zinc-200 dark:placeholder-zinc-600", "focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10 focus:bg-white dark:focus:bg-zinc-900", o && "opacity-60 cursor-not-allowed")
                    }), e.jsx("p", {
                        className: i("text-xs", $e ?.tone === "danger" ? "text-amber-400" : "text-zinc-500"),
                        children: $e ?.message || `${w.length}/${Q.taskDescription.maxChars} local chars. First ${Nt("taskDescription","cloud")} sync to cloud.`
                    })]
                })]
            }),
            bt = () => e.jsxs("div", {
                className: "space-y-6 animate-in fade-in duration-300",
                children: [e.jsxs("div", {
                    className: "flex items-center justify-between",
                    children: [e.jsxs("label", {
                        className: "text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2",
                        children: [e.jsx(B, {
                            className: "w-3.5 h-3.5"
                        }), "Subtasks"]
                    }), g > 0 && e.jsxs("span", {
                        className: "text-xs font-bold text-zinc-400",
                        children: [_, "/", g, " completed (", Math.round(Be), "%)"]
                    })]
                }), g > 0 && e.jsx("div", {
                    className: "h-[3px] rounded-full overflow-hidden",
                    style: {
                        background: "var(--color-border)"
                    },
                    children: e.jsx(h.div, {
                        style: {
                            background: S,
                            height: "100%",
                            borderRadius: "99px"
                        },
                        initial: {
                            width: 0
                        },
                        animate: {
                            width: `${Be}%`
                        },
                        transition: {
                            duration: .5,
                            ease: "easeOut"
                        }
                    })
                }), !o && e.jsxs("div", {
                    className: "space-y-3 rounded-2xl p-4",
                    style: {
                        background: "var(--color-bg)",
                        border: "1px solid var(--color-border)"
                    },
                    children: [e.jsxs("div", {
                        className: "flex items-center gap-2",
                        style: {
                            fontSize: 10,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            color: "var(--color-text-muted)"
                        },
                        children: [e.jsx(Ke, {
                            size: 11,
                            style: {
                                color: S
                            }
                        }), "AI Subtask Generator"]
                    }), e.jsx("p", {
                        className: "text-[12px]",
                        style: {
                            color: "var(--color-text-muted)"
                        },
                        children: "Paste a plan, chapter outline, or notes. AI will generate actionable subtasks."
                    }), e.jsx("textarea", {
                        value: fe,
                        onChange: t => ye(t.target.value),
                        placeholder: "Paste chapter topics, notes, or plan...",
                        maxLength: Q.taskDescription.maxChars,
                        className: "min-h-[90px] w-full resize-none rounded-xl px-3 py-2.5 text-sm outline-none transition-all",
                        style: {
                            background: "var(--color-surface)",
                            border: "1px solid var(--color-border)",
                            color: "var(--color-text-primary)"
                        }
                    }), e.jsxs("button", {
                        type: "button",
                        onClick: lt,
                        disabled: Ne || !f.trim() || !fe.trim() || !oe,
                        className: "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                        style: {
                            background: S + "14",
                            border: `1px solid ${S}28`,
                            color: S
                        },
                        children: [Ne ? e.jsx(qe, {
                            size: 14,
                            className: "animate-spin"
                        }) : e.jsx(Ke, {
                            size: 14
                        }), Ne ? "Generating..." : oe ? "Generate Subtasks" : "Add AI key to generate"]
                    })]
                }), e.jsxs("div", {
                    className: "space-y-1.5",
                    children: [u.map(t => e.jsxs(h.div, {
                        initial: {
                            opacity: 0,
                            x: -12
                        },
                        animate: {
                            opacity: 1,
                            x: 0
                        },
                        className: "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                        style: {
                            background: "var(--color-bg)",
                            border: "1px solid var(--color-border)"
                        },
                        children: [e.jsx(Gt, {
                            checked: t.completed,
                            onChange: () => !o && ct(t.id),
                            size: "sm",
                            accentColor: S
                        }), e.jsx("input", {
                            type: "text",
                            value: t.title,
                            onChange: r => !o && dt(t.id, r.target.value),
                            disabled: o,
                            className: "flex-1 bg-transparent border-none outline-none text-sm p-0",
                            style: {
                                color: t.completed ? "var(--color-text-muted)" : "var(--color-text-primary)",
                                textDecoration: t.completed ? "line-through" : "none"
                            }
                        }), !o && e.jsx("button", {
                            type: "button",
                            onClick: () => it(t.id),
                            className: "opacity-0 group-hover:opacity-100 p-1 rounded-lg transition-all",
                            style: {
                                color: "var(--color-text-muted)"
                            },
                            onMouseEnter: r => r.currentTarget.style.color = "#ef4444",
                            onMouseLeave: r => r.currentTarget.style.color = "var(--color-text-muted)",
                            children: e.jsx(Se, {
                                size: 13
                            })
                        })]
                    }, t.id)), !o && e.jsxs("form", {
                        onSubmit: nt,
                        className: "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                        style: {
                            background: "var(--color-bg)",
                            border: "1px solid var(--color-border)"
                        },
                        children: [e.jsx("div", {
                            className: "w-4 h-4 rounded-md border-2 border-dashed flex-shrink-0",
                            style: {
                                borderColor: "var(--color-border)"
                            }
                        }), e.jsx("input", {
                            type: "text",
                            value: J,
                            onChange: t => he(t.target.value),
                            placeholder: "Add a subtask...",
                            maxLength: Q.subtaskTitle.maxChars,
                            className: "flex-1 bg-transparent text-sm outline-none",
                            style: {
                                color: "var(--color-text-primary)"
                            }
                        }), J.trim() && e.jsx("button", {
                            type: "submit",
                            className: "p-1 rounded-lg",
                            style: {
                                color: S
                            },
                            children: e.jsx(Ft, {
                                size: 14
                            })
                        })]
                    })]
                }), u.length === 0 && !o && e.jsxs("div", {
                    className: "text-center py-6 opacity-50",
                    children: [e.jsx(B, {
                        size: 36,
                        className: "mx-auto mb-2",
                        style: {
                            color: "var(--color-text-muted)"
                        }
                    }), e.jsx("p", {
                        className: "text-sm",
                        style: {
                            color: "var(--color-text-muted)"
                        },
                        children: "No subtasks yet"
                    }), e.jsx("p", {
                        className: "text-xs mt-0.5",
                        style: {
                            color: "var(--color-text-muted)"
                        },
                        children: "Add steps above or use AI to generate them"
                    })]
                })]
            }),
            gt = () => e.jsxs("div", {
                className: "space-y-6 animate-in fade-in duration-300",
                children: [e.jsxs("div", {
                    className: "flex items-center justify-between",
                    children: [e.jsxs("label", {
                        className: "text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2",
                        children: [e.jsx(ee, {
                            className: "w-3.5 h-3.5"
                        }), "Recurring Task"]
                    }), e.jsxs("button", {
                        type: "button",
                        onClick: () => je(!Ee),
                        className: i("flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all", v ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10"),
                        children: [e.jsx(ee, {
                            className: "w-3.5 h-3.5"
                        }), v ? "Enabled" : "One-time"]
                    })]
                }), Ee && e.jsxs("div", {
                    className: "bg-white/5 border border-white/10 rounded-xl p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300",
                    children: [e.jsxs("div", {
                        className: "flex items-center gap-3",
                        children: [e.jsx("input", {
                            type: "checkbox",
                            id: "isRecurring",
                            checked: v,
                            onChange: t => ve(t.target.checked),
                            className: "w-4 h-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500/50"
                        }), e.jsx("label", {
                            htmlFor: "isRecurring",
                            className: "text-sm text-zinc-300",
                            children: "Make this a recurring task"
                        })]
                    }), v && e.jsxs("div", {
                        className: "space-y-4 pt-4 border-t border-white/10",
                        children: [e.jsxs("div", {
                            className: "space-y-2",
                            children: [e.jsx("label", {
                                className: "text-xs text-zinc-500",
                                children: "Repeat"
                            }), e.jsx("div", {
                                className: "grid grid-cols-3 gap-2",
                                children: ["daily", "weekly", "custom"].map(t => e.jsxs("button", {
                                    type: "button",
                                    onClick: () => Te(t),
                                    className: i("px-3 py-2 rounded-lg text-xs font-medium transition-all", K === t ? "bg-emerald-500 text-white" : "bg-white/5 text-zinc-400 hover:bg-white/10"),
                                    children: [t === "daily" && "Daily", t === "weekly" && "Weekly", t === "custom" && "Custom"]
                                }, t))
                            })]
                        }), K === "custom" && e.jsxs("div", {
                            className: "space-y-2",
                            children: [e.jsx("label", {
                                className: "text-xs text-zinc-500",
                                children: "Every X days"
                            }), e.jsx("input", {
                                type: "number",
                                min: "1",
                                max: "365",
                                value: De,
                                onChange: t => Ie(Math.max(1, parseInt(t.target.value) || 1)),
                                className: "w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:border-emerald-500/50 outline-none"
                            })]
                        }), e.jsxs("div", {
                            className: "space-y-2",
                            children: [e.jsx("label", {
                                className: "text-xs text-zinc-500",
                                children: "Number of occurrences (max 30)"
                            }), e.jsx("input", {
                                type: "number",
                                min: "1",
                                max: "30",
                                value: P,
                                onChange: t => Ae(Math.min(30, Math.max(1, parseInt(t.target.value) || 1))),
                                className: "w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:border-emerald-500/50 outline-none"
                            }), m.maxOccurrences && e.jsx("p", {
                                className: "text-red-500 text-xs",
                                children: m.maxOccurrences
                            })]
                        }), e.jsxs("div", {
                            className: "space-y-2",
                            children: [e.jsx("label", {
                                className: "text-xs text-zinc-500",
                                children: "Create next task when"
                            }), e.jsxs("select", {
                                value: Me,
                                onChange: t => Le(Number(t.target.value)),
                                className: "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:border-emerald-500/50 outline-none cursor-pointer",
                                children: [e.jsx("option", {
                                    value: 6,
                                    children: "6 hours before due"
                                }), e.jsx("option", {
                                    value: 12,
                                    children: "12 hours before due"
                                }), e.jsx("option", {
                                    value: 24,
                                    children: "24 hours before due"
                                }), e.jsx("option", {
                                    value: 48,
                                    children: "2 days before due"
                                }), e.jsx("option", {
                                    value: 72,
                                    children: "3 days before due"
                                })]
                            })]
                        }), e.jsxs("div", {
                            className: "space-y-2",
                            children: [e.jsx("label", {
                                className: "text-xs text-zinc-500",
                                children: "End date (optional)"
                            }), e.jsx("input", {
                                type: "date",
                                value: Z,
                                onChange: t => Re(t.target.value),
                                className: "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:border-emerald-500/50 outline-none color-scheme-dark"
                            })]
                        }), e.jsx("div", {
                            className: "text-xs text-zinc-500 bg-white/5 rounded-lg p-3",
                            children: e.jsxs("p", {
                                className: "flex items-center gap-2",
                                children: [e.jsx(Pt, {
                                    className: "w-3 h-3"
                                }), "First task on ", Y(y).toLocaleDateString(), ".", P > 1 && ` ${P} total occurrences.`, Z && ` Ends ${Y(Z).toLocaleDateString()}.`]
                            })
                        })]
                    })]
                })]
            }),
            ht = () => s ? e.jsxs("div", {
                className: "space-y-6 animate-in fade-in duration-300",
                children: [e.jsxs("label", {
                    className: "text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2",
                    children: [e.jsx(ze, {
                        className: "w-3.5 h-3.5"
                    }), "Task Metadata"]
                }), e.jsxs("div", {
                    className: "grid grid-cols-2 gap-4",
                    children: [e.jsxs("div", {
                        className: "bg-white/5 border border-white/10 rounded-xl p-4",
                        children: [e.jsx("label", {
                            className: "text-xs text-zinc-500 block mb-1",
                            children: "Created"
                        }), e.jsx("p", {
                            className: "text-sm text-zinc-300",
                            children: new Date(s.createdAt).toLocaleDateString()
                        }), e.jsx("p", {
                            className: "text-xs text-zinc-600",
                            children: new Date(s.createdAt).toLocaleTimeString()
                        })]
                    }), e.jsxs("div", {
                        className: "bg-white/5 border border-white/10 rounded-xl p-4",
                        children: [e.jsx("label", {
                            className: "text-xs text-zinc-500 block mb-1",
                            children: "Last Updated"
                        }), e.jsx("p", {
                            className: "text-sm text-zinc-300",
                            children: new Date(s.updatedAt).toLocaleDateString()
                        }), e.jsx("p", {
                            className: "text-xs text-zinc-600",
                            children: new Date(s.updatedAt).toLocaleTimeString()
                        })]
                    }), s.completedAt && e.jsxs("div", {
                        className: "bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 col-span-2",
                        children: [e.jsx("label", {
                            className: "text-xs text-emerald-500 block mb-1",
                            children: "Completed"
                        }), e.jsx("p", {
                            className: "text-sm text-emerald-400",
                            children: new Date(s.completedAt).toLocaleDateString()
                        }), e.jsx("p", {
                            className: "text-xs text-emerald-600",
                            children: new Date(s.completedAt).toLocaleTimeString()
                        })]
                    }), s.totalFocusTime !== void 0 && s.totalFocusTime > 0 && e.jsxs("div", {
                        className: "bg-amber-500/10 border border-amber-500/20 rounded-xl p-4",
                        children: [e.jsxs("label", {
                            className: "text-xs text-amber-500 block mb-1 flex items-center gap-1",
                            children: [e.jsx(Ue, {
                                className: "w-3 h-3"
                            }), " Time Spent"]
                        }), e.jsx("p", {
                            className: "text-2xl font-bold text-amber-400",
                            children: s.totalFocusTime
                        }), e.jsx("p", {
                            className: "text-xs text-amber-600",
                            children: "minutes"
                        })]
                    }), s.isRecurring && e.jsxs("div", {
                        className: "bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4",
                        children: [e.jsxs("label", {
                            className: "text-xs text-emerald-500 block mb-1 flex items-center gap-1",
                            children: [e.jsx(ee, {
                                className: "w-3 h-3"
                            }), " Recurring"]
                        }), e.jsx("p", {
                            className: "text-sm text-emerald-400 capitalize",
                            children: s.recurringConfig ?.recurrenceType
                        }), e.jsxs("p", {
                            className: "text-xs text-emerald-600",
                            children: [s.recurringConfig ?.occurrencesCreated, " of", " ", s.recurringConfig ?.maxOccurrences, " created"]
                        })]
                    }), s.isRecurringInstance && s.parentTaskId && e.jsxs("div", {
                        className: "bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 col-span-2",
                        children: [e.jsx("label", {
                            className: "text-xs text-blue-500 block mb-1",
                            children: "Recurring Instance"
                        }), e.jsxs("p", {
                            className: "text-xs text-blue-600",
                            children: ["Parent: ", s.parentTaskId.slice(0, 8), "..."]
                        })]
                    })]
                }), e.jsx("div", {
                    className: "pt-4 border-t border-white/10",
                    children: e.jsxs("p", {
                        className: "text-xs text-zinc-600 font-mono",
                        children: ["Task ID: ", s.id]
                    })
                })]
            }) : null;
        return e.jsx(Ce, {
            children: d && e.jsxs("div", {
                className: "fixed inset-0 z-[100] flex items-end justify-center p-3 sm:items-center sm:p-4",
                children: [e.jsx(h.div, {
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    exit: {
                        opacity: 0
                    },
                    className: "absolute inset-0 bg-black/70 backdrop-blur-md",
                    onClick: p
                }), e.jsxs(h.div, {
                    initial: {
                        opacity: 0,
                        scale: .97,
                        y: 16
                    },
                    animate: {
                        opacity: 1,
                        scale: 1,
                        y: 0
                    },
                    exit: {
                        opacity: 0,
                        scale: .97,
                        y: 16
                    },
                    transition: {
                        type: "spring",
                        stiffness: 320,
                        damping: 28
                    },
                    className: "relative w-full max-w-2xl rounded-3xl overflow-hidden flex flex-col max-h-[min(92dvh,48rem)]",
                    style: {
                        background: "var(--color-surface)",
                        border: "1px solid var(--color-border)",
                        boxShadow: "0 40px 100px rgba(0,0,0,0.3), 0 0 0 1px var(--color-border)"
                    },
                    children: [e.jsxs("div", {
                        className: "flex items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 border-b",
                        style: {
                            borderColor: "var(--color-border)",
                            background: "var(--color-bg)"
                        },
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [e.jsx("div", {
                                className: "p-2 rounded-xl",
                                style: {
                                    background: "var(--color-accent, #f97316)15",
                                    border: "1px solid var(--color-accent, #f97316)25"
                                },
                                children: c ? e.jsx(He, {
                                    size: 16,
                                    style: {
                                        color: "var(--color-accent, #f97316)"
                                    }
                                }) : e.jsx(kt, {
                                    size: 16,
                                    style: {
                                        color: "var(--color-accent, #f97316)"
                                    }
                                })
                            }), e.jsxs("div", {
                                children: [e.jsx("h2", {
                                    className: "text-base font-bold",
                                    style: {
                                        color: "var(--color-text-primary)",
                                        letterSpacing: "-0.01em"
                                    },
                                    children: c ? "Edit Task" : "New Task"
                                }), e.jsx("p", {
                                    className: "text-[11px]",
                                    style: {
                                        color: "var(--color-text-muted)"
                                    },
                                    children: c ? "Update your objective" : "Define your objective"
                                })]
                            })]
                        }), e.jsxs("div", {
                            className: "flex items-center gap-1.5",
                            children: [c && !o && e.jsxs(e.Fragment, {
                                children: [e.jsx("button", {
                                    onClick: at,
                                    disabled: C,
                                    className: "p-2 rounded-lg transition-all",
                                    style: {
                                        color: "var(--color-text-muted)"
                                    },
                                    onMouseEnter: t => {
                                        t.currentTarget.style.background = "var(--color-bg)", t.currentTarget.style.color = "var(--color-text-primary)"
                                    },
                                    onMouseLeave: t => {
                                        t.currentTarget.style.background = "transparent", t.currentTarget.style.color = "var(--color-text-muted)"
                                    },
                                    title: "Duplicate task",
                                    children: e.jsx(St, {
                                        size: 15
                                    })
                                }), e.jsx("button", {
                                    onClick: () => we(!0),
                                    disabled: C,
                                    className: "p-2 rounded-lg transition-all",
                                    style: {
                                        color: "var(--color-text-muted)"
                                    },
                                    onMouseEnter: t => {
                                        t.currentTarget.style.background = "rgba(239,68,68,0.08)", t.currentTarget.style.color = "#ef4444"
                                    },
                                    onMouseLeave: t => {
                                        t.currentTarget.style.background = "transparent", t.currentTarget.style.color = "var(--color-text-muted)"
                                    },
                                    title: "Delete task",
                                    children: e.jsx(Se, {
                                        size: 15
                                    })
                                })]
                            }), e.jsx("button", {
                                onClick: p,
                                className: "p-2 rounded-lg transition-all",
                                style: {
                                    color: "var(--color-text-muted)"
                                },
                                onMouseEnter: t => {
                                    t.currentTarget.style.background = "var(--color-bg)", t.currentTarget.style.color = "var(--color-text-primary)"
                                },
                                onMouseLeave: t => {
                                    t.currentTarget.style.background = "transparent", t.currentTarget.style.color = "var(--color-text-muted)"
                                },
                                children: e.jsx(zt, {
                                    size: 17
                                })
                            })]
                        })]
                    }), e.jsx("div", {
                        className: "px-4 pt-3 pb-2 sm:px-6 sm:pt-4 overflow-x-auto",
                        children: mt()
                    }), e.jsxs("div", {
                        className: "flex-1 overflow-y-auto tasks-scrollbar p-4 sm:p-6",
                        style: {
                            background: "var(--color-surface)"
                        },
                        children: [$ === "details" && pt(), $ === "subtasks" && bt(), $ === "recurring" && gt(), $ === "metadata" && ht(), m.submit && e.jsxs("div", {
                            className: "mt-4 p-3 rounded-xl flex items-center gap-2 text-sm",
                            style: {
                                background: "rgba(239,68,68,0.08)",
                                border: "1px solid rgba(239,68,68,0.2)",
                                color: "#ef4444"
                            },
                            children: [e.jsx(Ve, {
                                size: 14
                            }), m.submit]
                        })]
                    }), e.jsxs("div", {
                        className: "px-4 py-3 sm:px-6 sm:py-4 border-t flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center",
                        style: {
                            borderColor: "var(--color-border)",
                            background: "var(--color-bg)"
                        },
                        children: [e.jsxs("div", {
                            className: "flex flex-wrap items-center gap-2",
                            children: [c && (s ?.totalFocusTime ?? 0) > 0 && e.jsxs("div", {
                                className: "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg",
                                style: {
                                    background: "rgba(251,191,36,0.1)",
                                    border: "1px solid rgba(251,191,36,0.2)"
                                },
                                children: [e.jsx(Ue, {
                                    size: 12,
                                    style: {
                                        color: "#fbbf24"
                                    }
                                }), e.jsxs("span", {
                                    className: "text-[11px] font-bold",
                                    style: {
                                        color: "#fbbf24"
                                    },
                                    children: [Ze(s.totalFocusTime), " spent"]
                                })]
                            }), g > 0 && e.jsxs("div", {
                                className: "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg",
                                style: {
                                    background: "var(--color-surface)",
                                    border: "1px solid var(--color-border)"
                                },
                                children: [e.jsx(B, {
                                    size: 11,
                                    style: {
                                        color: "var(--color-text-muted)"
                                    }
                                }), e.jsxs("span", {
                                    className: "text-[11px] font-bold",
                                    style: {
                                        color: "var(--color-text-muted)"
                                    },
                                    children: [_, "/", g]
                                })]
                            })]
                        }), e.jsxs("div", {
                            className: "flex flex-wrap items-center justify-end gap-2",
                            children: [e.jsx("button", {
                                onClick: p,
                                className: "px-4 py-2 rounded-xl font-semibold text-sm transition-all",
                                style: {
                                    color: "var(--color-text-muted)"
                                },
                                onMouseEnter: t => {
                                    t.currentTarget.style.background = "var(--color-surface)", t.currentTarget.style.color = "var(--color-text-primary)"
                                },
                                onMouseLeave: t => {
                                    t.currentTarget.style.background = "transparent", t.currentTarget.style.color = "var(--color-text-muted)"
                                },
                                children: "Cancel"
                            }), c && E !== "done" && e.jsxs("button", {
                                onClick: ot,
                                disabled: D,
                                title: D ? xt : "Focus",
                                className: "px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 text-sm",
                                style: {
                                    background: "var(--color-surface)",
                                    color: "var(--color-text-secondary)",
                                    border: "1px solid var(--color-border)"
                                },
                                onMouseEnter: t => {
                                    D || (t.currentTarget.style.borderColor = "var(--color-accent, #f97316)", t.currentTarget.style.color = "var(--color-accent, #f97316)")
                                },
                                onMouseLeave: t => {
                                    t.currentTarget.style.borderColor = "var(--color-border)", t.currentTarget.style.color = "var(--color-text-secondary)"
                                },
                                children: [D ? e.jsx(Xe, {
                                    size: 12
                                }) : e.jsx(Ct, {
                                    size: 12,
                                    className: "fill-current"
                                }), D ? "Locked" : "Focus"]
                            }), e.jsx(h.button, {
                                whileHover: {
                                    scale: 1.03
                                },
                                whileTap: {
                                    scale: .97
                                },
                                onClick: st,
                                disabled: C || c && !et,
                                className: "px-5 py-2 rounded-xl font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
                                style: {
                                    background: "var(--color-accent, #f97316)",
                                    color: "white",
                                    boxShadow: "0 4px 14px var(--color-accent-ring, rgba(249,115,22,0.35))"
                                },
                                children: C ? e.jsxs(e.Fragment, {
                                    children: [e.jsx(qe, {
                                        size: 14,
                                        className: "animate-spin"
                                    }), c ? "Saving..." : "Creating..."]
                                }) : e.jsxs(e.Fragment, {
                                    children: [e.jsx(Tt, {
                                        size: 14
                                    }), c ? "Save Changes" : "Create Task"]
                                })
                            })]
                        })]
                    }), e.jsx(Ce, {
                        children: Qe && e.jsx(h.div, {
                            initial: {
                                opacity: 0
                            },
                            animate: {
                                opacity: 1
                            },
                            exit: {
                                opacity: 0
                            },
                            className: "absolute inset-0 bg-black/80 backdrop-blur-sm z-10 flex items-center justify-center p-6",
                            children: e.jsxs(h.div, {
                                initial: {
                                    scale: .92,
                                    opacity: 0
                                },
                                animate: {
                                    scale: 1,
                                    opacity: 1
                                },
                                exit: {
                                    scale: .92,
                                    opacity: 0
                                },
                                className: "max-w-xs w-full text-center rounded-2xl p-6",
                                style: {
                                    background: "var(--color-surface)",
                                    border: "1px solid var(--color-border)",
                                    boxShadow: "var(--shadow-4)"
                                },
                                children: [e.jsx("div", {
                                    className: "w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4",
                                    style: {
                                        background: "rgba(239,68,68,0.1)"
                                    },
                                    children: e.jsx(Se, {
                                        size: 20,
                                        style: {
                                            color: "#ef4444"
                                        }
                                    })
                                }), e.jsx("h3", {
                                    className: "text-base font-bold mb-2",
                                    style: {
                                        color: "var(--color-text-primary)"
                                    },
                                    children: "Delete Task?"
                                }), e.jsx("p", {
                                    className: "text-sm mb-6",
                                    style: {
                                        color: "var(--color-text-muted)"
                                    },
                                    children: "This action cannot be undone. The task will be permanently removed."
                                }), e.jsxs("div", {
                                    className: "flex gap-2",
                                    children: [e.jsx("button", {
                                        onClick: () => we(!1),
                                        className: "flex-1 px-4 py-2 rounded-xl font-semibold text-sm transition-all",
                                        style: {
                                            background: "var(--color-bg)",
                                            color: "var(--color-text-secondary)",
                                            border: "1px solid var(--color-border)"
                                        },
                                        children: "Cancel"
                                    }), e.jsx("button", {
                                        onClick: rt,
                                        disabled: C,
                                        className: "flex-1 px-4 py-2 rounded-xl font-bold text-sm transition-all disabled:opacity-50",
                                        style: {
                                            background: "#ef4444",
                                            color: "white"
                                        },
                                        children: C ? "Deleting..." : "Delete"
                                    })]
                                })]
                            })
                        })
                    })]
                })]
            })
        })
    };
export {
    Gt as A, Qt as T
};