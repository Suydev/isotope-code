import {
    r as o,
    f as Be,
    j as e,
    b as Qe
} from "./vendor-react-BfU3Zn2J.js";
import {
    j as Oe,
    u as Ke,
    h as Xe,
    B as Ze,
    C as Je
} from "./useFocusStore-CX_Nyp1h.js";
import {
    b as et,
    a as W
} from "./timeFormat-CMPo-BX2.js";
import {
    b as tt
} from "./studyTimeMaps-B0T_-AX0.js";
import {
    i as Fe
} from "./taskAvailability-B1aDS_ww.js";
import {
    c as g
} from "./utils-D8mZnxMk.js";
import {
    d as st
} from "./subjectBranding-DaDo_h8r.js";
import {
    S as Te
} from "./SubjectIcon-CyCDqtel.js";
import {
    aD as at,
    X as le,
    az as rt,
    ci as je,
    d as xe,
    B as De,
    a as ae,
    S as Le,
    L as nt,
    aw as it,
    T as we,
    aW as Ye,
    Z as Ue,
    am as $e,
    cj as ot,
    ck as ct,
    aB as lt,
    C as He,
    aK as dt,
    ab as Ve,
    w as xt,
    ac as mt
} from "./vendor-icons-CqruUz7g.js";
import {
    m as M,
    A as Ie
} from "./vendor-motion-Cp_NPzpZ.js";
const de = t => Array.isArray(t.chapters) ? t.chapters : [],
    Me = t => Array.isArray(t.topics) ? t.topics : [],
    Ee = t => typeof t.subject == "string" ? t.subject : "";

function ut({
    subjects: t,
    tasks: n,
    selection: N
}) {
    const [w, y] = o.useState(""), [x, C] = o.useState([]), [k, S] = o.useState(null), {
        selection: f
    } = N, j = o.useMemo(() => {
        if (f.subjects.length === 0) return [];
        const l = [];
        return f.subjects.forEach(u => {
            const A = t.find(D => D.id === u);
            A && [...de(A)].sort((L, O) => (L.order ?? 0) - (O.order ?? 0)).forEach(L => {
                l.push({ ...L,
                    subjectId: u,
                    subjectName: A.name
                })
            })
        }), l
    }, [t, f.subjects]), z = o.useMemo(() => {
        if (f.chapters.length === 0) return [];
        const l = [];
        return f.subjects.forEach(u => {
            const A = t.find(D => D.id === u);
            A && [...de(A)].sort((L, O) => (L.order ?? 0) - (O.order ?? 0)).forEach(L => {
                f.chapters.includes(L.id) && [...Me(L)].sort((H, R) => (H.order ?? 0) - (R.order ?? 0)).forEach(H => {
                    l.push({ ...H,
                        subjectId: u,
                        chapterId: L.id,
                        chapterTitle: L.title
                    })
                })
            })
        }), l
    }, [t, f.subjects, f.chapters]), r = o.useMemo(() => f.subjects.length === 0 ? n.filter(l => l.status !== "done" && Fe(l)) : n.filter(l => {
        if (l.status === "done" || !Fe(l)) return !1;
        const u = t.find(A => A.name === Ee(l) || A.id === l.subjectId);
        return u && f.subjects.includes(u.id)
    }), [n, t, f.subjects]), s = o.useCallback((l, u) => {
        if (!u) return !0;
        const A = l.toLowerCase(),
            D = u.toLowerCase();
        let L = 0;
        for (let O = 0; O < A.length && L < D.length; O++) A[O] === D[L] && L++;
        return L === D.length
    }, []), c = o.useMemo(() => w ? t.filter(l => s(l.name, w) || s(l.icon || "", w)) : t, [t, w, s]), m = o.useMemo(() => w ? j.filter(l => s(l.title, w) || s(l.subjectName, w)) : j, [j, w, s]), h = o.useMemo(() => {
        let l = z;
        return w && (l = l.filter(u => s(u.title, w) || s(u.chapterTitle, w))), x.includes("completed") && (l = l.filter(u => u.completed)), x.includes("inProgress") && (l = l.filter(u => !u.completed)), x.includes("pinned") && (l = l.filter(u => u.isPinned)), k && (l = l.filter(u => {
            const A = ["novice", "beginner", "intermediate", "advanced", "expert"],
                D = A.indexOf(u.mastery || "novice"),
                L = A.indexOf(k);
            return D >= L
        })), l
    }, [z, w, x, k, s]), p = o.useMemo(() => w ? r.filter(l => s(l.title, w) || s(Ee(l), w)) : r, [r, w, s]), d = o.useCallback(l => {
        C(u => u.includes(l) ? u.filter(A => A !== l) : [...u, l])
    }, []), b = o.useCallback(() => {
        C([]), S(null)
    }, []);
    return {
        query: w,
        setQuery: y,
        filteredSubjects: c,
        filteredChapters: m,
        filteredTopics: h,
        filteredTasks: p,
        availableChapters: j,
        availableTopics: z,
        availableTasks: r,
        activeFilters: x,
        toggleFilter: d,
        clearFilters: b,
        priorityFilter: k,
        setPriorityFilter: S
    }
}

function ht({
    selectedTasks: t,
    selectedTopics: n,
    tasks: N,
    topics: w,
    defaultDuration: y = 25
}) {
    const x = o.useMemo(() => {
            let S = 0;
            return t.forEach(f => {
                const j = N.find(z => z.id === f);
                j && j.effort ? S += j.effort : S += y
            }), t.length === 0 && n.length > 0 && n.forEach(f => {
                const j = w.find(z => z.id === f);
                if (j) {
                    const z = y,
                        r = {
                            novice: 1.5,
                            beginner: 1.2,
                            intermediate: 1,
                            advanced: .8,
                            expert: .5
                        }[j.mastery || "novice"] || 1;
                    S += Math.round(z * r)
                }
            }), t.length === 0 && n.length === 0 && (S = y), S
        }, [t, n, N, w, y]),
        C = o.useMemo(() => {
            const S = {
                tasks: [],
                topics: []
            };
            return t.forEach(f => {
                const j = N.find(z => z.id === f);
                j && S.tasks.push({
                    id: f,
                    title: j.title,
                    estimatedMinutes: j.effort || y
                })
            }), n.forEach(f => {
                const j = w.find(z => z.id === f);
                if (j) {
                    const z = y,
                        r = {
                            novice: 1.5,
                            beginner: 1.2,
                            intermediate: 1,
                            advanced: .8,
                            expert: .5
                        }[j.mastery || "novice"] || 1;
                    S.topics.push({
                        id: f,
                        title: j.title,
                        estimatedMinutes: Math.round(z * r)
                    })
                }
            }), S
        }, [t, n, N, w, y]),
        k = S => et(S);
    return {
        estimatedTimeMinutes: x,
        timeBreakdown: C,
        formattedTime: k(x),
        formatTime: k
    }
}
const bt = {
        enter: t => ({
            x: t === "forward" ? 50 : -50,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: t => ({
            x: t === "forward" ? -50 : 50,
            opacity: 0
        })
    },
    pt = {
        type: "spring",
        stiffness: 300,
        damping: 30
    },
    Ae = {
        hidden: {
            opacity: 0
        },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: .05,
                delayChildren: .1
            }
        },
        exit: {
            opacity: 0,
            transition: {
                staggerChildren: .03,
                staggerDirection: -1
            }
        }
    },
    qe = {
        hidden: {
            opacity: 0,
            y: 10,
            scale: .95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 25
            }
        },
        exit: {
            opacity: 0,
            scale: .95,
            transition: {
                duration: .15
            }
        }
    },
    Pe = ({
        value: t,
        onChange: n,
        placeholder: N = "Search...",
        className: w,
        autoFocus: y = !1
    }) => {
        const x = Be.useRef(null);
        return Be.useEffect(() => {
            y && x.current && x.current.focus()
        }, [y]), e.jsxs("div", {
            className: g("relative flex items-center", w),
            children: [e.jsx(at, {
                className: "absolute left-3.5 w-4 h-4 text-zinc-400"
            }), e.jsx("input", {
                ref: x,
                type: "text",
                value: t,
                onChange: C => n(C.target.value),
                placeholder: N,
                className: g("w-full pl-10 pr-10 py-2", "bg-zinc-50 dark:bg-white/5", "border border-zinc-200 dark:border-white/10", "rounded-xl", "text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400", "focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-300 dark:focus:border-orange-500/30", "transition-all duration-200", "placeholder:text-xs")
            }), t && e.jsx(M.button, {
                initial: {
                    opacity: 0,
                    scale: .8
                },
                animate: {
                    opacity: 1,
                    scale: 1
                },
                exit: {
                    opacity: 0,
                    scale: .8
                },
                onClick: () => n(""),
                className: "absolute right-3 p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors",
                children: e.jsx(le, {
                    className: "w-3.5 h-3.5 text-zinc-400"
                })
            })]
        })
    },
    gt = ({
        subjects: t,
        selection: n,
        studyTimeBySubject: N = {},
        onToggle: w,
        searchQuery: y,
        onSearchChange: x,
        showSearch: C = !0,
        canSelectMore: k,
        onSkip: S
    }) => {
        const f = y ? t.filter(j => j.name.toLowerCase().includes(y.toLowerCase()) || j.icon && j.icon.toLowerCase().includes(y.toLowerCase())) : t;
        return e.jsxs("div", {
            className: "p-3 space-y-3",
            children: [e.jsxs("div", {
                className: "flex items-center justify-between",
                children: [e.jsxs("div", {
                    className: "space-y-0.5",
                    children: [e.jsx("h3", {
                        className: "text-base font-semibold text-zinc-900 dark:text-white",
                        children: "What are you studying?"
                    }), e.jsx("p", {
                        className: "text-xs text-zinc-500 dark:text-zinc-400",
                        children: "Pick one or more subjects to focus on"
                    })]
                }), e.jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [n.subjects.length > 0 && e.jsxs("span", {
                        className: "text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-2 py-1 rounded-full",
                        children: [n.subjects.length, " selected"]
                    }), n.subjects.length > 0 && S && e.jsx(M.button, {
                        initial: {
                            scale: .8,
                            opacity: 0
                        },
                        animate: {
                            scale: 1,
                            opacity: 1
                        },
                        onClick: S,
                        className: g("p-2 rounded-xl flex items-center justify-center", "bg-orange-500 hover:bg-orange-600 text-white", "transition-all shadow-lg shadow-orange-500/25", "hover:shadow-orange-500/40 hover:scale-105", "active:scale-95"),
                        title: "Continue with selection",
                        children: e.jsx(rt, {
                            className: "w-4 h-4"
                        })
                    })]
                })]
            }), C && e.jsx(Pe, {
                value: y,
                onChange: x,
                placeholder: "Search subjects..."
            }), e.jsx(M.div, {
                variants: Ae,
                initial: "hidden",
                animate: "visible",
                exit: "exit",
                className: "grid grid-cols-2 sm:grid-cols-3 gap-2.5",
                children: f.map(j => {
                    const z = n.subjects.includes(j.id),
                        r = !z && !k,
                        s = N[j.id] || 0,
                        c = de(j).length;
                    return e.jsxs(M.button, {
                        variants: qe,
                        onClick: () => !r && w(j.id),
                        disabled: r,
                        whileHover: r ? {} : {
                            scale: 1.02,
                            y: -2
                        },
                        whileTap: r ? {} : {
                            scale: .98
                        },
                        className: g("relative p-3.5 rounded-2xl border-2 text-left transition-all duration-200", "flex flex-col items-center gap-2", "min-h-[130px]", z && ["bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30", "shadow-lg shadow-orange-500/15"], !z && !r && ["bg-white dark:bg-zinc-900/50 border-zinc-100 dark:border-white/10", "hover:border-orange-200 dark:hover:border-orange-500/20", "hover:shadow-md hover:shadow-zinc-200/50 dark:hover:shadow-none", "dark:hover:bg-zinc-800/50"], r && ["bg-zinc-50 dark:bg-white/5 border-zinc-100 dark:border-white/5", "opacity-40 cursor-not-allowed"]),
                        children: [z && e.jsx("div", {
                            className: "absolute inset-0 rounded-2xl opacity-30",
                            style: {
                                backgroundImage: st(j.gradient, "to bottom right")
                            }
                        }), e.jsxs("div", {
                            className: "relative",
                            children: [j.icon ? e.jsx(Te, {
                                icon: j.icon,
                                name: j.name,
                                className: "w-10 h-10 text-zinc-700 dark:text-zinc-200"
                            }) : e.jsx("div", {
                                className: g("w-14 h-14 rounded-2xl flex items-center justify-center", z ? "bg-orange-100 dark:bg-orange-500/20" : "bg-zinc-100 dark:bg-white/10"),
                                children: e.jsx(je, {
                                    className: g("w-7 h-7", z ? "text-orange-600 dark:text-orange-400" : "text-zinc-400")
                                })
                            }), z && e.jsx(M.div, {
                                initial: {
                                    scale: 0,
                                    rotate: -180
                                },
                                animate: {
                                    scale: 1,
                                    rotate: 0
                                },
                                className: g("absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center", "bg-gradient-to-br from-orange-500 to-orange-600", "shadow-lg shadow-orange-500/40"),
                                children: e.jsx(xe, {
                                    className: "w-3.5 h-3.5 text-white"
                                })
                            })]
                        }), e.jsxs("div", {
                            className: "relative text-center space-y-0.5 w-full",
                            children: [e.jsx("span", {
                                className: g("text-sm font-semibold block truncate", z ? "text-orange-900 dark:text-orange-100" : "text-zinc-700 dark:text-zinc-200"),
                                children: j.name
                            }), e.jsxs("div", {
                                className: "flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400",
                                children: [e.jsx(De, {
                                    className: "w-3 h-3"
                                }), e.jsxs("span", {
                                    children: [c, " ", c === 1 ? "chapter" : "chapters"]
                                })]
                            }), s > 0 && e.jsxs("div", {
                                className: "flex items-center justify-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400",
                                children: [e.jsx(ae, {
                                    className: "w-3 h-3"
                                }), e.jsx("span", {
                                    children: W(s)
                                })]
                            })]
                        })]
                    }, j.id)
                })
            }), f.length === 0 && e.jsxs(M.div, {
                initial: {
                    opacity: 0,
                    y: 10
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                className: "text-center py-12 px-4",
                children: [e.jsx("div", {
                    className: "w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-100 dark:bg-white/10 flex items-center justify-center",
                    children: e.jsx(Le, {
                        className: "w-8 h-8 text-zinc-400"
                    })
                }), e.jsx("h4", {
                    className: "text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1",
                    children: y ? "No subjects found" : "No subjects yet"
                }), e.jsx("p", {
                    className: "text-xs text-zinc-500 dark:text-zinc-400",
                    children: y ? "Try a different search term" : "Create your first subject to start tracking"
                })]
            })]
        })
    },
    ft = ({
        chapters: t,
        selection: n,
        studyTimeByChapter: N = {},
        onToggle: w,
        onSelectAll: y,
        searchQuery: x,
        onSearchChange: C,
        showSearch: k = !0,
        canSelectMore: S
    }) => {
        const [f, j] = o.useState([]), z = x ? t.filter(m => m.title.toLowerCase().includes(x.toLowerCase()) || m.subjectName.toLowerCase().includes(x.toLowerCase())) : t, r = z.reduce((m, h) => (m[h.subjectId] || (m[h.subjectId] = {
            subjectName: h.subjectName,
            chapters: []
        }), m[h.subjectId].chapters.push(h), m), {}), s = m => {
            const h = r[m] ?.chapters.map(d => d.id) || [];
            if (h.every(d => n.chapters.includes(d))) {
                const d = n.chapters.filter(b => !h.includes(b));
                y(d)
            } else {
                const d = [...new Set([...n.chapters, ...h])];
                y(d)
            }
        }, c = m => {
            j(h => h.includes(m) ? h.filter(p => p !== m) : [...h, m])
        };
        return e.jsxs("div", {
            className: "p-3 space-y-3",
            children: [e.jsxs("div", {
                className: "flex items-center justify-between",
                children: [e.jsxs("div", {
                    className: "space-y-0.5",
                    children: [e.jsx("h3", {
                        className: "text-base font-semibold text-zinc-900 dark:text-white",
                        children: "Which chapters?"
                    }), e.jsx("p", {
                        className: "text-xs text-zinc-500 dark:text-zinc-400",
                        children: "Optional - pick specific chapters if you want"
                    })]
                }), n.chapters.length > 0 && e.jsxs("span", {
                    className: "text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-2 py-1 rounded-full",
                    children: [n.chapters.length, " selected"]
                })]
            }), k && e.jsx(Pe, {
                value: x,
                onChange: C,
                placeholder: "Search chapters..."
            }), e.jsx(M.div, {
                variants: Ae,
                initial: "hidden",
                animate: "visible",
                exit: "exit",
                className: "space-y-3",
                children: Object.entries(r).map(([m, {
                    subjectName: h,
                    chapters: p
                }]) => e.jsxs(M.div, {
                    variants: qe,
                    className: "bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-white/10 overflow-hidden",
                    children: [e.jsxs("div", {
                        className: "px-4 py-3 bg-zinc-50/80 dark:bg-white/[0.02] border-b border-zinc-100 dark:border-white/5 flex items-center justify-between",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [e.jsx(nt, {
                                className: "w-4 h-4 text-zinc-400"
                            }), e.jsx("span", {
                                className: "text-sm font-semibold text-zinc-700 dark:text-zinc-300",
                                children: h
                            })]
                        }), e.jsx("button", {
                            onClick: () => s(m),
                            className: g("text-xs font-medium px-2.5 py-1 rounded-lg transition-colors", p.every(d => n.chapters.includes(d.id)) ? "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300" : "text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10"),
                            children: p.every(d => n.chapters.includes(d.id)) ? "Deselect All" : "Select All"
                        })]
                    }), e.jsx("div", {
                        className: "p-2 space-y-1",
                        children: p.map(d => {
                            const b = n.chapters.includes(d.id),
                                l = !b && !S,
                                u = d.topics ?.length || 0,
                                A = d.topics ?.filter(H => H.completed) ?.length || 0,
                                D = u > 0 ? A / u * 100 : 0,
                                L = N[d.id] || 0,
                                O = f.includes(d.id);
                            return e.jsxs(M.button, {
                                onClick: () => !l && w(d.id),
                                disabled: l,
                                whileHover: l ? {} : {
                                    x: 2
                                },
                                className: g("w-full p-3 rounded-xl text-left transition-all duration-200", "flex items-center gap-3", b && ["bg-orange-50 dark:bg-orange-500/10 border border-orange-200/50 dark:border-orange-500/20"], !b && !l && ["hover:bg-zinc-50 dark:hover:bg-white/5", "border border-transparent"], l && ["opacity-40 cursor-not-allowed"]),
                                children: [e.jsx("div", {
                                    className: g("w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0", b ? "bg-gradient-to-br from-orange-500 to-orange-600 border-orange-500" : "border-zinc-300 dark:border-zinc-600 hover:border-orange-400"),
                                    children: b && e.jsx(xe, {
                                        className: "w-3 h-3 text-white"
                                    })
                                }), e.jsxs("div", {
                                    className: "flex-1 min-w-0",
                                    children: [e.jsxs("div", {
                                        className: "flex items-center gap-2",
                                        children: [e.jsx(De, {
                                            className: g("w-4 h-4 flex-shrink-0", b ? "text-orange-500" : "text-zinc-400")
                                        }), e.jsx("span", {
                                            className: g("text-sm font-medium truncate", b ? "text-orange-900 dark:text-orange-100" : "text-zinc-700 dark:text-zinc-300"),
                                            children: d.title
                                        }), u > 0 && e.jsx("button", {
                                            onClick: H => {
                                                H.stopPropagation(), c(d.id)
                                            },
                                            className: g("p-0.5 rounded hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors", O && "rotate-180"),
                                            children: e.jsx(it, {
                                                className: "w-3.5 h-3.5 text-zinc-400"
                                            })
                                        })]
                                    }), e.jsx(Ie, {
                                        children: O && u > 0 && e.jsxs(M.div, {
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
                                            className: "mt-2 ml-6 space-y-1 overflow-hidden",
                                            children: [d.topics ?.slice(0, 5).map(H => e.jsxs("div", {
                                                className: "flex items-center gap-2 text-[11px] text-zinc-500",
                                                children: [e.jsx("div", {
                                                    className: g("w-1.5 h-1.5 rounded-full", H.completed ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-600")
                                                }), e.jsx("span", {
                                                    className: "truncate",
                                                    children: H.title
                                                })]
                                            }, H.id)), d.topics && d.topics.length > 5 && e.jsxs("div", {
                                                className: "text-[10px] text-zinc-400",
                                                children: ["+", d.topics.length - 5, " more topics"]
                                            })]
                                        })
                                    }), u > 0 && !O && e.jsxs("div", {
                                        className: "mt-2 flex items-center gap-3",
                                        children: [e.jsx("div", {
                                            className: "flex-1 h-1.5 bg-zinc-100 dark:bg-white/10 rounded-full overflow-hidden",
                                            children: e.jsx(M.div, {
                                                initial: {
                                                    width: 0
                                                },
                                                animate: {
                                                    width: `${D}%`
                                                },
                                                className: g("h-full rounded-full", D >= 100 ? "bg-emerald-500" : "bg-gradient-to-r from-orange-400 to-orange-500")
                                            })
                                        }), e.jsxs("span", {
                                            className: "text-[11px] text-zinc-500 whitespace-nowrap",
                                            children: [A, "/", u]
                                        }), L > 0 && e.jsxs("span", {
                                            className: "text-[11px] font-medium text-emerald-600 dark:text-emerald-400 whitespace-nowrap flex items-center gap-0.5",
                                            children: [e.jsx(ae, {
                                                className: "w-2.5 h-2.5"
                                            }), W(L)]
                                        })]
                                    })]
                                })]
                            }, d.id)
                        })
                    })]
                }, m))
            }), z.length === 0 && e.jsxs(M.div, {
                initial: {
                    opacity: 0,
                    y: 10
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                className: "text-center py-12 px-4",
                children: [e.jsx("div", {
                    className: "w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-100 dark:bg-white/10 flex items-center justify-center",
                    children: e.jsx(Le, {
                        className: "w-8 h-8 text-zinc-400"
                    })
                }), e.jsx("h4", {
                    className: "text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1",
                    children: x ? "No chapters found" : "No chapters available"
                }), e.jsx("p", {
                    className: "text-xs text-zinc-500 dark:text-zinc-400",
                    children: x ? "Try a different search term" : "Add chapters to your subjects first"
                })]
            })]
        })
    },
    Re = {
        novice: {
            bg: "bg-zinc-100 dark:bg-zinc-800",
            text: "text-zinc-600 dark:text-zinc-400",
            label: "Novice",
            icon: e.jsx(Ue, {
                className: "w-2.5 h-2.5"
            })
        },
        beginner: {
            bg: "bg-blue-50 dark:bg-blue-500/10",
            text: "text-blue-600 dark:text-blue-400",
            label: "Beginner",
            icon: e.jsx(we, {
                className: "w-2.5 h-2.5"
            })
        },
        intermediate: {
            bg: "bg-amber-50 dark:bg-amber-500/10",
            text: "text-amber-600 dark:text-amber-400",
            label: "Learning",
            icon: e.jsx(we, {
                className: "w-2.5 h-2.5"
            })
        },
        advanced: {
            bg: "bg-orange-50 dark:bg-orange-500/10",
            text: "text-orange-600 dark:text-orange-400",
            label: "Advanced",
            icon: e.jsx(we, {
                className: "w-2.5 h-2.5"
            })
        },
        expert: {
            bg: "bg-emerald-50 dark:bg-emerald-500/10",
            text: "text-emerald-600 dark:text-emerald-400",
            label: "Expert",
            icon: e.jsx(Ye, {
                className: "w-2.5 h-2.5"
            })
        }
    },
    jt = ({
        topics: t,
        selection: n,
        studyTimeByTopic: N = {},
        onToggle: w,
        onSelectAll: y,
        searchQuery: x,
        onSearchChange: C,
        showSearch: k = !0,
        canSelectMore: S
    }) => {
        const f = x ? t.filter(s => s.title.toLowerCase().includes(x.toLowerCase()) || s.chapterTitle.toLowerCase().includes(x.toLowerCase())) : t,
            j = f.reduce((s, c) => (s[c.chapterId] || (s[c.chapterId] = {
                chapterTitle: c.chapterTitle,
                topics: []
            }), s[c.chapterId].topics.push(c), s), {}),
            z = s => {
                const c = j[s] ?.topics.map(h => h.id) || [];
                if (c.every(h => n.topics.includes(h))) {
                    const h = n.topics.filter(p => !c.includes(p));
                    y(h)
                } else {
                    const h = [...new Set([...n.topics, ...c])];
                    y(h)
                }
            },
            r = s => !s || s === 0 ? null : W(s);
        return e.jsxs("div", {
            className: "p-3 space-y-3",
            children: [e.jsxs("div", {
                className: "flex items-center justify-between",
                children: [e.jsxs("div", {
                    className: "space-y-0.5",
                    children: [e.jsx("h3", {
                        className: "text-base font-semibold text-zinc-900 dark:text-white",
                        children: "Which topics?"
                    }), e.jsx("p", {
                        className: "text-xs text-zinc-500 dark:text-zinc-400",
                        children: "Optional - narrow down to specific topics"
                    })]
                }), n.topics.length > 0 && e.jsxs("span", {
                    className: "text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-2 py-1 rounded-full",
                    children: [n.topics.length, " selected"]
                })]
            }), k && e.jsx(Pe, {
                value: x,
                onChange: C,
                placeholder: "Search topics..."
            }), e.jsx(M.div, {
                variants: Ae,
                initial: "hidden",
                animate: "visible",
                exit: "exit",
                className: "space-y-3",
                children: Object.entries(j).map(([s, {
                    chapterTitle: c,
                    topics: m
                }]) => e.jsxs(M.div, {
                    variants: qe,
                    className: "bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-white/10 overflow-hidden",
                    children: [e.jsxs("div", {
                        className: "px-4 py-3 bg-zinc-50/80 dark:bg-white/[0.02] border-b border-zinc-100 dark:border-white/5 flex items-center justify-between",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [e.jsx(we, {
                                className: "w-4 h-4 text-zinc-400"
                            }), e.jsx("span", {
                                className: "text-sm font-semibold text-zinc-700 dark:text-zinc-300",
                                children: c
                            })]
                        }), e.jsx("button", {
                            onClick: () => z(s),
                            className: g("text-xs font-medium px-2.5 py-1 rounded-lg transition-colors", m.every(h => n.topics.includes(h.id)) ? "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300" : "text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10"),
                            children: m.every(h => n.topics.includes(h.id)) ? "Deselect All" : "Select All"
                        })]
                    }), e.jsx("div", {
                        className: "p-2 grid grid-cols-1 sm:grid-cols-2 gap-2",
                        children: m.map(h => {
                            const p = n.topics.includes(h.id),
                                d = !p && !S,
                                b = Re[h.mastery || "novice"] || Re.novice,
                                l = r(N[h.id] || 0);
                            return e.jsxs(M.button, {
                                onClick: () => !d && w(h.id),
                                disabled: d,
                                whileHover: d ? {} : {
                                    scale: 1.01
                                },
                                whileTap: d ? {} : {
                                    scale: .99
                                },
                                className: g("relative p-3 rounded-xl text-left transition-all duration-200", "flex flex-col gap-2", p && ["bg-orange-50 dark:bg-orange-500/10 border border-orange-200/50 dark:border-orange-500/20"], !p && !d && ["bg-white dark:bg-zinc-800/50", "border border-zinc-100 dark:border-white/10", "hover:border-orange-200 dark:hover:border-orange-500/20", "hover:bg-zinc-50 dark:hover:bg-zinc-800"], d && ["opacity-40 cursor-not-allowed", "bg-zinc-50 dark:bg-white/5"]),
                                children: [e.jsxs("div", {
                                    className: "flex items-start gap-2.5",
                                    children: [e.jsx("div", {
                                        className: g("w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200", p ? "bg-gradient-to-br from-orange-500 to-orange-600 border-orange-500" : "border-zinc-300 dark:border-zinc-600 hover:border-orange-400"),
                                        children: p && e.jsx(xe, {
                                            className: "w-3 h-3 text-white"
                                        })
                                    }), e.jsx("div", {
                                        className: "flex-1 min-w-0",
                                        children: e.jsx("span", {
                                            className: g("text-sm font-medium block truncate", p ? "text-orange-900 dark:text-orange-100" : "text-zinc-700 dark:text-zinc-300"),
                                            children: h.title
                                        })
                                    })]
                                }), e.jsxs("div", {
                                    className: "flex items-center gap-2 ml-7",
                                    children: [e.jsxs("span", {
                                        className: g("text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1", b.bg, b.text),
                                        children: [b.icon, b.label]
                                    }), l && e.jsxs("span", {
                                        className: "text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5",
                                        children: [e.jsx(ae, {
                                            className: "w-2.5 h-2.5"
                                        }), l]
                                    }), h.completed && e.jsxs("span", {
                                        className: "text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5",
                                        children: [e.jsx(Ye, {
                                            className: "w-2.5 h-2.5"
                                        }), "Done"]
                                    }), h.isPinned && e.jsx("span", {
                                        className: "text-[10px] text-amber-500",
                                        children: "★"
                                    })]
                                })]
                            }, h.id)
                        })
                    })]
                }, s))
            }), f.length === 0 && e.jsxs(M.div, {
                initial: {
                    opacity: 0,
                    y: 10
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                className: "text-center py-12 px-4",
                children: [e.jsx("div", {
                    className: "w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-100 dark:bg-white/10 flex items-center justify-center",
                    children: e.jsx(Le, {
                        className: "w-8 h-8 text-zinc-400"
                    })
                }), e.jsx("h4", {
                    className: "text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1",
                    children: x ? "No topics found" : "No topics available"
                }), e.jsx("p", {
                    className: "text-xs text-zinc-500 dark:text-zinc-400",
                    children: x ? "Try a different search term" : "Add topics to your chapters first"
                })]
            })]
        })
    },
    _e = {
        p1: {
            color: "text-red-600 dark:text-red-400",
            label: "High",
            bg: "bg-red-50 dark:bg-red-500/10"
        },
        p2: {
            color: "text-orange-600 dark:text-orange-400",
            label: "Medium",
            bg: "bg-orange-50 dark:bg-orange-500/10"
        },
        p3: {
            color: "text-blue-600 dark:text-blue-400",
            label: "Low",
            bg: "bg-blue-50 dark:bg-blue-500/10"
        },
        p4: {
            color: "text-zinc-500",
            label: "None",
            bg: "bg-zinc-50 dark:bg-white/5"
        }
    },
    wt = {
        high: {
            icon: e.jsx(Ue, {
                className: "w-3 h-3"
            }),
            color: "text-red-500"
        },
        medium: {
            icon: e.jsx(ct, {
                className: "w-3 h-3"
            }),
            color: "text-amber-500"
        },
        low: {
            icon: e.jsx(ot, {
                className: "w-3 h-3"
            }),
            color: "text-emerald-500"
        }
    },
    vt = ({
        tasks: t,
        selection: n,
        onToggle: N,
        onSelectAll: w,
        searchQuery: y,
        onSearchChange: x,
        showSearch: C = !0,
        canSelectMore: k
    }) => {
        const S = y ? t.filter(r => r.title.toLowerCase().includes(y.toLowerCase()) || Ee(r).toLowerCase().includes(y.toLowerCase())) : t,
            f = S.reduce((r, s) => {
                const c = Ee(s) || "General";
                return r[c] || (r[c] = []), r[c].push(s), r
            }, {}),
            j = r => {
                const s = f[r] ?.map(m => m.id) || [];
                if (s.every(m => n.tasks.includes(m))) {
                    const m = n.tasks.filter(h => !s.includes(h));
                    w(m)
                } else {
                    const m = [...new Set([...n.tasks, ...s])];
                    w(m)
                }
            },
            z = r => {
                const s = new Date(r),
                    c = new Date,
                    m = Math.ceil((s.getTime() - c.getTime()) / (1e3 * 60 * 60 * 24));
                return m < 0 ? {
                    text: "Overdue",
                    color: "text-red-500",
                    bg: "bg-red-50 dark:bg-red-500/10"
                } : m === 0 ? {
                    text: "Today",
                    color: "text-orange-500",
                    bg: "bg-orange-50 dark:bg-orange-500/10"
                } : m === 1 ? {
                    text: "Tomorrow",
                    color: "text-amber-500",
                    bg: "bg-amber-50 dark:bg-amber-500/10"
                } : m <= 7 ? {
                    text: `${m}d`,
                    color: "text-blue-500",
                    bg: "bg-blue-50 dark:bg-blue-500/10"
                } : {
                    text: s.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric"
                    }),
                    color: "text-zinc-400",
                    bg: "bg-zinc-50 dark:bg-white/5"
                }
            };
        return e.jsxs("div", {
            className: "p-3 space-y-3",
            children: [e.jsxs("div", {
                className: "flex items-center justify-between",
                children: [e.jsxs("div", {
                    className: "space-y-0.5",
                    children: [e.jsx("h3", {
                        className: "text-base font-semibold text-zinc-900 dark:text-white",
                        children: "Add tasks to focus on?"
                    }), e.jsx("p", {
                        className: "text-xs text-zinc-500 dark:text-zinc-400",
                        children: "Optional - link specific tasks to this session"
                    })]
                }), n.tasks.length > 0 && e.jsxs("span", {
                    className: "text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-2 py-1 rounded-full",
                    children: [n.tasks.length, " selected"]
                })]
            }), C && e.jsx(Pe, {
                value: y,
                onChange: x,
                placeholder: "Search tasks..."
            }), e.jsx(M.div, {
                variants: Ae,
                initial: "hidden",
                animate: "visible",
                exit: "exit",
                className: "space-y-3",
                children: Object.entries(f).map(([r, s]) => e.jsxs(M.div, {
                    variants: qe,
                    className: "bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-white/10 overflow-hidden",
                    children: [e.jsxs("div", {
                        className: "px-4 py-3 bg-zinc-50/80 dark:bg-white/[0.02] border-b border-zinc-100 dark:border-white/5 flex items-center justify-between",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [e.jsx($e, {
                                className: "w-4 h-4 text-zinc-400"
                            }), e.jsx("span", {
                                className: "text-sm font-semibold text-zinc-700 dark:text-zinc-300",
                                children: r
                            })]
                        }), e.jsx("button", {
                            onClick: () => j(r),
                            className: g("text-xs font-medium px-2.5 py-1 rounded-lg transition-colors", s.every(c => n.tasks.includes(c.id)) ? "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300" : "text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10"),
                            children: s.every(c => n.tasks.includes(c.id)) ? "Deselect All" : "Select All"
                        })]
                    }), e.jsx("div", {
                        className: "p-2 space-y-1",
                        children: s.map(c => {
                            const m = n.tasks.includes(c.id),
                                h = !m && !k,
                                p = _e[c.priority] || _e.p4,
                                d = c.dueDate ? z(c.dueDate) : null,
                                b = c.energy ? wt[c.energy] : null;
                            return e.jsxs(M.button, {
                                onClick: () => !h && N(c.id),
                                disabled: h,
                                whileHover: h ? {} : {
                                    x: 2
                                },
                                whileTap: h ? {} : {
                                    scale: .99
                                },
                                className: g("w-full p-3 rounded-xl text-left transition-all duration-200", "flex items-center gap-3", m && ["bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-500/20"], !m && !h && ["hover:bg-zinc-50 dark:hover:bg-white/5", "border border-transparent"], h && ["opacity-40 cursor-not-allowed"]),
                                children: [e.jsx("div", {
                                    className: g("w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0", m ? "bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-500" : "border-zinc-300 dark:border-zinc-600 hover:border-emerald-400"),
                                    children: m && e.jsx(xe, {
                                        className: "w-3 h-3 text-white"
                                    })
                                }), e.jsxs("div", {
                                    className: "flex-1 min-w-0",
                                    children: [e.jsx("div", {
                                        className: "flex items-center gap-2",
                                        children: e.jsx("span", {
                                            className: g("text-sm font-medium truncate", m ? "text-emerald-900 dark:text-emerald-100" : "text-zinc-700 dark:text-zinc-300"),
                                            children: c.title
                                        })
                                    }), e.jsxs("div", {
                                        className: "mt-1.5 flex items-center gap-2 flex-wrap",
                                        children: [e.jsxs("span", {
                                            className: g("text-[10px] px-2 py-0.5 rounded-full font-medium", p.bg, p.color),
                                            children: [p.label, " Priority"]
                                        }), c.effort > 0 && e.jsxs("span", {
                                            className: "text-[10px] text-zinc-500 flex items-center gap-0.5",
                                            children: [e.jsx(ae, {
                                                className: "w-2.5 h-2.5"
                                            }), W(c.effort)]
                                        }), c.totalFocusTime && c.totalFocusTime > 0 && e.jsxs("span", {
                                            className: g("text-[10px] font-medium flex items-center gap-0.5", m ? "text-emerald-600 dark:text-emerald-400" : "text-emerald-500"),
                                            children: [e.jsx(ae, {
                                                className: "w-2.5 h-2.5"
                                            }), W(c.totalFocusTime)]
                                        }), d && e.jsxs("span", {
                                            className: g("text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5", d.bg, d.color),
                                            children: [e.jsx($e, {
                                                className: "w-2.5 h-2.5"
                                            }), d.text]
                                        }), b && e.jsx("span", {
                                            className: g("text-[10px]", b.color),
                                            children: b.icon
                                        })]
                                    })]
                                })]
                            }, c.id)
                        })
                    })]
                }, r))
            }), S.length === 0 && e.jsxs(M.div, {
                initial: {
                    opacity: 0,
                    y: 10
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                className: "text-center py-12 px-4",
                children: [e.jsx("div", {
                    className: "w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-100 dark:bg-white/10 flex items-center justify-center",
                    children: e.jsx(Le, {
                        className: "w-8 h-8 text-zinc-400"
                    })
                }), e.jsx("h4", {
                    className: "text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1",
                    children: y ? "No tasks found" : "No tasks available"
                }), e.jsx("p", {
                    className: "text-xs text-zinc-500 dark:text-zinc-400",
                    children: y ? "Try a different search term" : "Create tasks to focus on specific goals"
                })]
            })]
        })
    },
    yt = {
        subjects: e.jsx(je, {
            className: "w-3.5 h-3.5"
        }),
        chapters: e.jsx(De, {
            className: "w-3.5 h-3.5"
        }),
        topics: e.jsx(we, {
            className: "w-3.5 h-3.5"
        }),
        tasks: e.jsx(lt, {
            className: "w-3.5 h-3.5"
        })
    },
    kt = ({
        steps: t,
        currentStep: n,
        onStepClick: N,
        className: w
    }) => {
        const y = t.findIndex(x => x.id === n);
        return e.jsx("div", {
            className: g("flex items-center justify-between px-3 sm:px-4 py-2", "bg-zinc-50/50 dark:bg-white/[0.02]", "border-b border-zinc-200 dark:border-white/[0.06]", w),
            children: t.map((x, C) => {
                const k = x.id === n,
                    S = C < y,
                    f = N && C <= y;
                return e.jsxs(Be.Fragment, {
                    children: [e.jsxs(M.button, {
                        onClick: () => f && N(x.id),
                        disabled: !f,
                        className: g("relative flex flex-col items-center gap-1.5", "transition-all duration-200", f ? "cursor-pointer" : "cursor-default", f && "group"),
                        whileTap: f ? {
                            scale: .95
                        } : void 0,
                        children: [e.jsxs(M.div, {
                            className: g("relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center", "text-xs sm:text-sm font-semibold", "transition-all duration-300", k && ["bg-gradient-to-br from-orange-500 to-orange-600 text-white", "shadow-lg shadow-orange-500/25", "ring-2 ring-orange-500/20"], S && ["bg-emerald-500 text-white", "shadow-md shadow-emerald-500/20"], !k && !S && ["bg-zinc-100 dark:bg-white/10 text-zinc-400 dark:text-zinc-500", "group-hover:bg-zinc-200 dark:group-hover:bg-white/15", "group-hover:text-zinc-600 dark:group-hover:text-zinc-300"]),
                            animate: k ? {
                                scale: [1, 1.08, 1],
                                transition: {
                                    duration: .4,
                                    ease: "easeOut"
                                }
                            } : {},
                            children: [S ? e.jsx(xe, {
                                className: "w-4 h-4"
                            }) : yt[x.id], k && e.jsx(M.div, {
                                className: "absolute inset-0 rounded-xl bg-white/20",
                                initial: {
                                    opacity: 0
                                },
                                animate: {
                                    opacity: [0, .3, 0]
                                },
                                transition: {
                                    duration: 1.5,
                                    repeat: 1 / 0
                                }
                            })]
                        }), e.jsx("span", {
                            className: g("text-[10px] font-medium tracking-wide hidden sm:block", k && "text-orange-600 dark:text-orange-400", S && "text-emerald-600 dark:text-emerald-400", !k && !S && "text-zinc-400 dark:text-zinc-500"),
                            children: x.label
                        }), k && e.jsx(M.div, {
                            className: "absolute -bottom-1.5 sm:hidden w-1 h-1 rounded-full bg-orange-500",
                            layoutId: "activeDot"
                        })]
                    }), C < t.length - 1 && e.jsx("div", {
                        className: "flex-1 h-px mx-1.5 sm:mx-3 bg-zinc-200 dark:bg-white/[0.08]",
                        children: e.jsx(M.div, {
                            className: "h-full bg-gradient-to-r from-orange-500 to-orange-400",
                            initial: {
                                width: "0%"
                            },
                            animate: {
                                width: S ? "100%" : "0%"
                            },
                            transition: {
                                duration: .35,
                                ease: "easeInOut"
                            }
                        })
                    })]
                }, x.id)
            })
        })
    },
    Nt = ({
        selection: t,
        subjects: n,
        studyTimeBySubject: N = {},
        studyTimeByChapter: w = {},
        studyTimeByTopic: y = {},
        onRemove: x,
        className: C
    }) => {
        const {
            selection: k
        } = t;
        if (!Object.values(k).some(r => r.length > 0)) return null;
        const f = r => {
                const s = n.find(c => c.id === r);
                return {
                    name: s ?.name || "Unknown",
                    icon: s ?.icon || null,
                    studyTime: N[r] || 0
                }
            },
            j = r => {
                for (const s of n) {
                    const c = de(s).find(m => m.id === r);
                    if (c) return {
                        title: c.title,
                        studyTime: w[r] || 0
                    }
                }
                return {
                    title: "Chapter",
                    studyTime: 0
                }
            },
            z = r => {
                for (const s of n)
                    for (const c of de(s)) {
                        const m = Me(c).find(h => h.id === r);
                        if (m) return {
                            title: m.title,
                            studyTime: y[r] || 0
                        }
                    }
                return {
                    title: "Unknown Topic",
                    studyTime: 0
                }
            };
        return e.jsx("div", {
            className: g("px-4 py-2 border-b border-zinc-100 dark:border-white/[0.06]", "bg-zinc-50/50 dark:bg-white/[0.02]", C),
            children: e.jsx("div", {
                className: "max-h-[80px] overflow-y-auto custom-scrollbar scrollbar-thin",
                children: e.jsx("div", {
                    className: "flex flex-wrap gap-2",
                    children: e.jsxs(Ie, {
                        mode: "popLayout",
                        children: [k.subjects.map(r => {
                            const s = f(r);
                            return e.jsxs(M.button, {
                                layout: !0,
                                initial: {
                                    opacity: 0,
                                    scale: .8,
                                    y: -10
                                },
                                animate: {
                                    opacity: 1,
                                    scale: 1,
                                    y: 0
                                },
                                exit: {
                                    opacity: 0,
                                    scale: .8,
                                    y: -10
                                },
                                onClick: () => x ?.("subjects", r),
                                className: g("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl", "bg-gradient-to-r from-orange-100 to-orange-50 dark:from-orange-500/20 dark:to-orange-500/10", "text-orange-700 dark:text-orange-300 text-xs font-medium", "border border-orange-200/50 dark:border-orange-500/20", "hover:from-orange-200 hover:to-orange-100 dark:hover:from-orange-500/30 dark:hover:to-orange-500/20", "transition-all duration-200", "min-h-[28px]"),
                                children: [s.icon ? e.jsx(Te, {
                                    icon: s.icon,
                                    name: s.name,
                                    size: "sm",
                                    className: "text-orange-500 dark:text-orange-300"
                                }) : e.jsx(je, {
                                    className: "w-3 h-3"
                                }), e.jsx("span", {
                                    className: "truncate max-w-[120px]",
                                    children: s.name
                                }), s.studyTime > 0 && e.jsx("span", {
                                    className: "text-[10px] opacity-70",
                                    children: W(s.studyTime)
                                }), x && e.jsx(le, {
                                    className: "w-3 h-3 ml-0.5"
                                })]
                            }, `subject-${r}`)
                        }), k.chapters.map(r => {
                            const s = j(r);
                            return e.jsxs(M.button, {
                                layout: !0,
                                initial: {
                                    opacity: 0,
                                    scale: .8,
                                    y: -10
                                },
                                animate: {
                                    opacity: 1,
                                    scale: 1,
                                    y: 0
                                },
                                exit: {
                                    opacity: 0,
                                    scale: .8,
                                    y: -10
                                },
                                onClick: () => x ?.("chapters", r),
                                className: g("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl", "bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-500/20 dark:to-blue-500/10", "text-blue-700 dark:text-blue-300 text-xs font-medium", "border border-blue-200/50 dark:border-blue-500/20", "hover:from-blue-200 hover:to-blue-100 dark:hover:from-blue-500/30 dark:hover:to-blue-500/20", "transition-all duration-200", "min-h-[28px]"),
                                children: [e.jsx(De, {
                                    className: "w-3 h-3"
                                }), e.jsx("span", {
                                    className: "truncate max-w-[120px]",
                                    children: s.title
                                }), s.studyTime > 0 && e.jsx("span", {
                                    className: "text-[10px] opacity-70",
                                    children: W(s.studyTime)
                                }), x && e.jsx(le, {
                                    className: "w-3 h-3 ml-0.5"
                                })]
                            }, `chapter-${r}`)
                        }), k.topics.map(r => {
                            const s = z(r);
                            return e.jsxs(M.button, {
                                layout: !0,
                                initial: {
                                    opacity: 0,
                                    scale: .8,
                                    y: -10
                                },
                                animate: {
                                    opacity: 1,
                                    scale: 1,
                                    y: 0
                                },
                                exit: {
                                    opacity: 0,
                                    scale: .8,
                                    y: -10
                                },
                                onClick: () => x ?.("topics", r),
                                className: g("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl", "bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-500/20 dark:to-amber-500/10", "text-amber-700 dark:text-amber-300 text-xs font-medium", "border border-amber-200/50 dark:border-amber-500/20", "hover:from-amber-200 hover:to-amber-100 dark:hover:from-amber-500/30 dark:hover:to-amber-500/20", "transition-all duration-200", "min-h-[28px]"),
                                children: [e.jsx(we, {
                                    className: "w-3 h-3"
                                }), e.jsx("span", {
                                    className: "truncate max-w-[120px]",
                                    children: s.title
                                }), s.studyTime > 0 && e.jsx("span", {
                                    className: "text-[10px] opacity-70",
                                    children: W(s.studyTime)
                                }), x && e.jsx(le, {
                                    className: "w-3 h-3 ml-0.5"
                                })]
                            }, `topic-${r}`)
                        }), k.tasks.map(r => {
                            const s = Oe.getState().tasks.find(c => c.id === r);
                            return e.jsxs(M.button, {
                                layout: !0,
                                initial: {
                                    opacity: 0,
                                    scale: .8,
                                    y: -10
                                },
                                animate: {
                                    opacity: 1,
                                    scale: 1,
                                    y: 0
                                },
                                exit: {
                                    opacity: 0,
                                    scale: .8,
                                    y: -10
                                },
                                onClick: () => x ?.("tasks", r),
                                className: g("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl", "bg-gradient-to-r from-emerald-100 to-emerald-50 dark:from-emerald-500/20 dark:to-emerald-500/10", "text-emerald-700 dark:text-emerald-300 text-xs font-medium", "border border-emerald-200/50 dark:border-emerald-500/20", "hover:from-emerald-200 hover:to-emerald-100 dark:hover:from-emerald-500/30 dark:hover:to-emerald-500/20", "transition-all duration-200", "min-h-[28px]"),
                                children: [e.jsx(xe, {
                                    className: "w-3 h-3"
                                }), e.jsx("span", {
                                    className: "truncate max-w-[120px]",
                                    children: s ?.title || "Task"
                                }), s ?.totalFocusTime && s.totalFocusTime > 0 && e.jsx("span", {
                                    className: "text-[10px] opacity-70",
                                    children: W(s.totalFocusTime)
                                }), x && e.jsx(le, {
                                    className: "w-3 h-3 ml-0.5"
                                })]
                            }, `task-${r}`)
                        })]
                    })
                })
            })
        })
    },
    se = [{
        id: "subjects",
        label: "Subjects",
        icon: "subjects",
        isOptional: !1
    }, {
        id: "chapters",
        label: "Chapters",
        icon: "chapters",
        isOptional: !0
    }, {
        id: "topics",
        label: "Topics",
        icon: "topics",
        isOptional: !0
    }, {
        id: "tasks",
        label: "Tasks",
        icon: "tasks",
        isOptional: !0
    }],
    zt = 720,
    St = 960,
    Ct = 680,
    We = 760,
    Tt = (t, n) => {
        if (typeof t == "number") return t;
        const N = Number.parseInt(t, 10);
        return Number.isNaN(N) ? n : N
    };

function It({
    initialSubjectIds: t = [],
    initialChapterIds: n = [],
    initialTopicIds: N = [],
    initialTaskIds: w = [],
    mode: y = "multi",
    maxSelections: x = {}
}) {
    const [C, k] = o.useState({
        subjects: t,
        chapters: n,
        topics: N,
        tasks: w
    }), S = o.useCallback((p, d) => {
        k(b => {
            const l = b[p],
                u = x[p === "subjects" ? "subjects" : p === "chapters" ? "chapters" : p === "topics" ? "topics" : "tasks"];
            return y === "single" ? { ...b,
                [p]: l.includes(d) ? [] : [d]
            } : l.includes(d) ? { ...b,
                [p]: l.filter(D => D !== d)
            } : u && l.length >= u ? b : { ...b,
                [p]: [...l, d]
            }
        })
    }, [y, x]), f = o.useCallback((p, d) => {
        k(b => ({ ...b,
            [p]: d
        }))
    }, []), j = o.useCallback(p => {
        k(d => ({ ...d,
            [p]: []
        }))
    }, []), z = o.useCallback(() => {
        k({
            subjects: [],
            chapters: [],
            topics: [],
            tasks: []
        })
    }, []), r = o.useCallback((p, d) => {
        const b = x[p === "subjects" ? "subjects" : p === "chapters" ? "chapters" : p === "topics" ? "topics" : "tasks"];
        b && d.length > b ? k(l => ({ ...l,
            [p]: d.slice(0, b)
        })) : k(l => ({ ...l,
            [p]: d
        }))
    }, [x]), s = o.useCallback(p => C[p].length, [C]), c = o.useMemo(() => Object.values(C).flat().length, [C]), m = o.useCallback((p, d) => C[p].includes(d), [C]), h = o.useCallback(p => {
        const d = x[p === "subjects" ? "subjects" : p === "chapters" ? "chapters" : p === "topics" ? "topics" : "tasks"];
        return d ? C[p].length < d : !0
    }, [C, x]);
    return {
        selection: C,
        toggleSelection: S,
        setSelectionForStep: f,
        clearStep: j,
        clearAll: z,
        selectAll: r,
        getSelectionCount: s,
        getTotalSelections: c,
        isSelected: m,
        canSelectMore: h
    }
}
const Mt = ({
        initialSubjectIds: t = [],
        initialChapterIds: n = [],
        initialTopicIds: N = [],
        initialTaskIds: w = [],
        onSelect: y,
        onCancel: x,
        onStepChange: C,
        mode: k = "multi",
        requiredSteps: S = ["subjects"],
        allowSkip: f = !0,
        maxSelections: j,
        showTimePreview: z = !1,
        showSearch: r = !0,
        showStepIndicator: s = !0,
        maxHeight: c = "500px",
        dropdownZIndex: m = 1001,
        expandOnDesktop: h = !1,
        className: p,
        disabled: d = !1
    }) => {
        const [b, l] = o.useState("subjects"), [u, A] = o.useState("forward"), [D, L] = o.useState(!1), O = o.useRef(null), H = o.useRef(null), [R, ve] = o.useState({
            top: 0,
            left: 0,
            width: 0,
            maxHeight: 500,
            height: void 0
        }), {
            subjects: _
        } = Ke(), ye = Xe(a => a.sessions), {
            tasks: me
        } = Oe(), X = o.useMemo(() => tt(ye, _), [ye, _]), v = It({
            initialSubjectIds: t,
            initialChapterIds: n,
            initialTopicIds: N,
            initialTaskIds: w,
            mode: k,
            maxSelections: j
        }), $ = ut({
            subjects: _,
            tasks: me,
            selection: {
                selection: v.selection
            }
        }), re = o.useMemo(() => {
            const a = [];
            return v.selection.subjects.forEach(T => {
                const P = _.find(I => I.id === T);
                P && de(P).forEach(I => {
                    v.selection.chapters.includes(I.id) && Me(I).forEach(E => {
                        a.push({
                            id: E.id,
                            title: E.title,
                            completed: E.completed,
                            lastStudied: E.lastStudied,
                            nextReview: E.nextReview,
                            easeFactor: E.easeFactor,
                            interval: E.interval,
                            repetitions: E.repetitions,
                            mastery: E.mastery,
                            resources: E.resources,
                            flashcards: E.flashcards,
                            studyTime: X.byTopic[E.id] || 0,
                            successRate: E.successRate,
                            scratchpad: E.scratchpad,
                            isPinned: E.isPinned
                        })
                    })
                })
            }), a
        }, [X.byTopic, _, v.selection.subjects, v.selection.chapters]), Z = ht({
            selectedTasks: v.selection.tasks,
            selectedTopics: v.selection.topics,
            tasks: me,
            topics: re
        });
        o.useEffect(() => {
            !r && $.query && $.setQuery("")
        }, [r, $]);
        const Y = o.useCallback(a => {
                const T = se.findIndex(I => I.id === b),
                    P = se.findIndex(I => I.id === a);
                A(P > T ? "forward" : "backward"), l(a), C ?.(a)
            }, [b, C]),
            ke = o.useCallback(() => {
                const a = se.findIndex(T => T.id === b);
                a < se.length - 1 && Y(se[a + 1].id)
            }, [b, Y]),
            ne = o.useCallback(() => {
                const a = se.findIndex(T => T.id === b);
                a > 0 && Y(se[a - 1].id)
            }, [b, Y]),
            ue = o.useCallback(() => {
                const a = {
                    subjectIds: v.selection.subjects,
                    chapterIds: v.selection.chapters,
                    topicIds: v.selection.topics,
                    taskIds: v.selection.tasks,
                    estimatedTimeMinutes: Z.estimatedTimeMinutes
                };
                y(a), L(!1)
            }, [v.selection, Z.estimatedTimeMinutes, y]),
            he = o.useCallback(() => {
                L(!1), x ?.()
            }, [x]),
            oe = o.useMemo(() => se.find(T => T.id === b) ? S.includes(b) ? v.getSelectionCount(b) > 0 : !0 : !1, [b, S, v]),
            Se = b === "tasks",
            be = b === "subjects",
            pe = o.useCallback(() => {
                if (!O.current || typeof window > "u") return;
                const a = O.current.getBoundingClientRect(),
                    T = window.innerWidth,
                    P = window.innerHeight,
                    I = 16,
                    E = 8,
                    G = T < 768,
                    V = G ? Math.min(T - I * 2, 400) : Math.min(a.width, T - I * 2);
                if (h && !G) {
                    const U = Math.min(Math.max(a.width + 180, zt), Math.min(St, T - I * 2)),
                        fe = Tt(c, We),
                        K = Math.min(P - I * 2, Math.min(We, Math.max(fe, Ct))),
                        Q = a.left + a.width / 2 - U / 2,
                        ze = Math.max(I, Math.min(Q, T - U - I)),
                        ee = a.top - 72,
                        te = Math.max(I, Math.min(ee, P - K - I));
                    ve({
                        top: te,
                        left: ze,
                        width: U,
                        maxHeight: K,
                        height: K
                    });
                    return
                }
                const J = G ? (T - V) / 2 : Math.max(I, Math.min(a.left, T - V - I)),
                    Ne = P - a.bottom - I - E,
                    i = a.top - I - E,
                    q = Ne < 320 && i > Ne,
                    F = q ? i : Ne;
                let B;
                G ? B = Math.min(F, 480) : B = Math.max(200, Math.min(560, F));
                const ge = q ? a.top - B - E : a.bottom + E;
                ve({
                    top: ge,
                    left: J,
                    width: V,
                    maxHeight: B,
                    height: void 0
                })
            }, [h, c]);
        o.useEffect(() => {
            if (!D) return;
            const a = () => {
                requestAnimationFrame(() => {
                    pe()
                })
            };
            a();
            const T = () => a();
            return window.addEventListener("resize", T), window.addEventListener("scroll", T, !0), () => {
                window.removeEventListener("resize", T), window.removeEventListener("scroll", T, !0)
            }
        }, [D, pe]), o.useEffect(() => {
            if (!D || typeof document > "u") return;
            const a = P => {
                    const I = P.target;
                    if (!I) return;
                    const E = O.current ?.contains(I),
                        G = H.current ?.contains(I);
                    E || G || L(!1)
                },
                T = P => {
                    P.key === "Escape" && L(!1)
                };
            return document.addEventListener("mousedown", a), document.addEventListener("touchstart", a), window.addEventListener("keydown", T), () => {
                document.removeEventListener("mousedown", a), document.removeEventListener("touchstart", a), window.removeEventListener("keydown", T)
            }
        }, [D]);
        const Ce = () => {
                switch (b) {
                    case "subjects":
                        return e.jsx(gt, {
                            subjects: _,
                            selection: v.selection,
                            studyTimeBySubject: X.bySubject,
                            onToggle: a => v.toggleSelection("subjects", a),
                            searchQuery: $.query,
                            onSearchChange: $.setQuery,
                            showSearch: r,
                            canSelectMore: v.canSelectMore("subjects"),
                            onSkip: ue
                        });
                    case "chapters":
                        return e.jsx(ft, {
                            chapters: $.availableChapters,
                            selection: v.selection,
                            studyTimeByChapter: X.byChapter,
                            onToggle: a => v.toggleSelection("chapters", a),
                            onSelectAll: a => v.selectAll("chapters", a),
                            searchQuery: $.query,
                            onSearchChange: $.setQuery,
                            showSearch: r,
                            canSelectMore: v.canSelectMore("chapters")
                        });
                    case "topics":
                        return e.jsx(jt, {
                            topics: $.availableTopics,
                            selection: v.selection,
                            studyTimeByTopic: X.byTopic,
                            onToggle: a => v.toggleSelection("topics", a),
                            onSelectAll: a => v.selectAll("topics", a),
                            searchQuery: $.query,
                            onSearchChange: $.setQuery,
                            showSearch: r,
                            canSelectMore: v.canSelectMore("topics")
                        });
                    case "tasks":
                        return e.jsx(vt, {
                            tasks: $.availableTasks,
                            selection: v.selection,
                            onToggle: a => v.toggleSelection("tasks", a),
                            onSelectAll: a => v.selectAll("tasks", a),
                            searchQuery: $.query,
                            onSearchChange: $.setQuery,
                            showSearch: r,
                            canSelectMore: v.canSelectMore("tasks")
                        });
                    default:
                        return null
                }
            },
            ce = () => {
                const {
                    subjects: a,
                    chapters: T,
                    topics: P,
                    tasks: I
                } = v.selection;
                if (a.length === 0) return "Select Subjects & Tasks...";
                if (I.length === 1 && a.length === 1) {
                    const G = me.find(V => V.id === I[0]);
                    if (G) return `${G.title} (${W(G.totalFocusTime||0)} spent)`
                }
                if (P.length === 1 && a.length === 1) {
                    const G = _.find(J => J.id === a[0]),
                        V = de(G ?? {
                            chapters: []
                        }).flatMap(J => Me(J)).find(J => J.id === P[0]);
                    if (V) return `${V.title} (${W(X.byTopic[V.id]||0)} spent)`
                }
                const E = [];
                return a.length > 0 && E.push(`${a.length} subject${a.length>1?"s":""}`), T.length > 0 && E.push(`${T.length} chapter${T.length>1?"s":""}`), P.length > 0 && E.push(`${P.length} topic${P.length>1?"s":""}`), I.length > 0 && E.push(`${I.length} task${I.length>1?"s":""}`), E.join(", ")
            },
            ie = () => v.selection.subjects.map(a => _.find(T => T.id === a)).filter(a => !!a).slice(0, 3);
        return d ? e.jsx("div", {
            className: g("w-full p-1 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10", "opacity-70 cursor-not-allowed", p),
            children: e.jsxs("div", {
                className: "flex items-center gap-4 p-3",
                children: [e.jsx("div", {
                    className: g("w-12 h-12 rounded-xl flex items-center justify-center", "bg-zinc-100 dark:bg-white/5", "border border-zinc-200 dark:border-white/10"),
                    children: v.selection.subjects.length > 0 ? ie()[0] ? e.jsx(Te, {
                        icon: ie()[0] ?.icon,
                        name: ie()[0] ?.name,
                        className: "w-6 h-6 text-brand-500"
                    }) : e.jsx(je, {
                        className: "w-6 h-6 text-zinc-400"
                    }) : e.jsx(je, {
                        className: "w-6 h-6 text-zinc-400"
                    })
                }), e.jsxs("div", {
                    className: "flex-1 text-left min-w-0",
                    children: [e.jsx("div", {
                        className: "text-xs text-zinc-400 font-medium uppercase tracking-wider mb-0.5",
                        children: "Active Focus Context"
                    }), e.jsx("div", {
                        className: "text-zinc-700 dark:text-zinc-300 font-medium truncate text-sm sm:text-base",
                        title: ce(),
                        children: ce()
                    })]
                })]
            })
        }) : e.jsxs("div", {
            className: g("w-full relative z-50", p),
            children: [e.jsx("div", {
                ref: O,
                children: e.jsx("button", {
                    type: "button",
                    onClick: a => {
                        a.preventDefault(), L(!D)
                    },
                    className: g("w-full p-1 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10", "transition-all duration-200 group", "hover:border-brand-300 dark:hover:border-brand-500/30", "hover:shadow-lg hover:shadow-brand-500/10"),
                    children: e.jsxs("div", {
                        className: "flex items-center gap-4 p-3",
                        children: [e.jsx("div", {
                            className: g("w-12 h-12 rounded-xl flex items-center justify-center", "bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-500/10 dark:to-brand-500/5", "border border-brand-200/50 dark:border-brand-500/20", "transition-all duration-200", "group-hover:scale-105"),
                            children: v.selection.subjects.length > 0 ? ie()[0] ? e.jsx(Te, {
                                icon: ie()[0] ?.icon,
                                name: ie()[0] ?.name,
                                className: "w-6 h-6 text-brand-500"
                            }) : e.jsx(je, {
                                className: "w-6 h-6 text-brand-500"
                            }) : e.jsx(ae, {
                                className: "w-6 h-6 text-brand-500"
                            })
                        }), e.jsxs("div", {
                            className: "flex-1 text-left min-w-0",
                            children: [e.jsx("div", {
                                className: "text-xs text-brand-600 dark:text-brand-400 font-semibold uppercase tracking-wider mb-0.5",
                                children: "Focus Context"
                            }), e.jsx("div", {
                                className: "text-zinc-900 dark:text-white font-medium truncate text-sm sm:text-base",
                                title: ce(),
                                children: ce()
                            }), z && Z.estimatedTimeMinutes > 0 && e.jsxs("div", {
                                className: "mt-1 text-xs text-brand-600 dark:text-brand-400 font-medium",
                                children: ["Estimated time: ", W(Z.estimatedTimeMinutes)]
                            })]
                        }), e.jsx("div", {
                            className: g("p-2 rounded-xl bg-zinc-100 dark:bg-white/10", "group-hover:bg-brand-100 dark:group-hover:bg-brand-500/20", "transition-all duration-200"),
                            children: e.jsx(He, {
                                className: g("w-4 h-4 text-zinc-400 group-hover:text-brand-500", "transition-transform duration-200", D && "rotate-90")
                            })
                        })]
                    })
                })
            }), typeof document < "u" && Qe.createPortal(e.jsx(Ie, {
                children: D && e.jsxs(M.div, {
                    ref: H,
                    initial: {
                        opacity: 0,
                        y: 12,
                        scale: .96
                    },
                    animate: {
                        opacity: 1,
                        y: 0,
                        scale: 1
                    },
                    exit: {
                        opacity: 0,
                        y: 12,
                        scale: .96
                    },
                    transition: {
                        duration: .2,
                        ease: "easeOut"
                    },
                    className: g("fixed", "bg-white dark:bg-zinc-900", "border border-zinc-200 dark:border-white/10", "rounded-2xl shadow-2xl shadow-zinc-200/50 dark:shadow-black/40 overflow-hidden", "flex flex-col"),
                    style: {
                        top: R.top,
                        left: R.left,
                        width: R.width,
                        height: R.height,
                        maxHeight: R.height ?? (typeof c == "number" ? Math.min(c, R.maxHeight) : isNaN(parseInt(c)) ? R.maxHeight : Math.min(parseInt(c), R.maxHeight)),
                        zIndex: m
                    },
                    children: [s && e.jsx(kt, {
                        steps: se,
                        currentStep: b,
                        onStepClick: Y
                    }), e.jsx(Nt, {
                        selection: {
                            selection: v.selection
                        },
                        subjects: _,
                        studyTimeBySubject: X.bySubject,
                        studyTimeByChapter: X.byChapter,
                        studyTimeByTopic: X.byTopic,
                        onRemove: (a, T) => v.toggleSelection(a, T)
                    }), e.jsx("div", {
                        className: "flex-1 flex flex-col min-h-0 overflow-hidden relative",
                        children: e.jsx(Ie, {
                            mode: "wait",
                            custom: u,
                            children: e.jsx(M.div, {
                                custom: u,
                                variants: bt,
                                initial: "enter",
                                animate: "center",
                                exit: "exit",
                                transition: pt,
                                className: "flex-1 min-h-0 overflow-y-auto overscroll-contain custom-scrollbar",
                                children: Ce()
                            }, b)
                        })
                    }), e.jsx("div", {
                        className: "p-3 border-t border-zinc-100 dark:border-white/[0.06] bg-zinc-50/50 dark:bg-white/[0.02]",
                        children: e.jsxs("div", {
                            className: "flex items-center justify-between gap-2",
                            children: [e.jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [x && e.jsx("button", {
                                    onClick: he,
                                    className: g("px-4 py-2.5 sm:py-2 rounded-xl text-sm font-medium transition-all duration-200 min-h-[44px]", "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10 active:scale-[0.98]"),
                                    children: "Cancel"
                                }), e.jsxs("button", {
                                    onClick: ne,
                                    disabled: be,
                                    className: g("px-4 py-2.5 sm:py-2 rounded-xl text-sm font-medium transition-all duration-200 min-h-[44px]", "flex items-center gap-1.5", be ? "text-zinc-400 cursor-not-allowed" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10 active:scale-[0.98]"),
                                    children: [e.jsx(dt, {
                                        className: "w-4 h-4"
                                    }), e.jsx("span", {
                                        className: "hidden sm:inline",
                                        children: "Back"
                                    })]
                                }), v.getTotalSelections > 0 && e.jsxs("button", {
                                    onClick: () => v.clearAll(),
                                    className: g("px-3 py-2.5 sm:py-2 rounded-xl text-sm font-medium transition-all duration-200 min-h-[44px]", "flex items-center gap-1.5", "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 active:scale-[0.98]"),
                                    children: [e.jsx(Ve, {
                                        className: "w-4 h-4"
                                    }), e.jsx("span", {
                                        className: "hidden sm:inline",
                                        children: "Clear"
                                    })]
                                })]
                            }), e.jsxs("div", {
                                className: "flex items-center gap-3",
                                children: [z && Z.estimatedTimeMinutes > 0 && e.jsxs("div", {
                                    className: "hidden sm:flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400",
                                    children: [e.jsx(ae, {
                                        className: "w-3.5 h-3.5"
                                    }), e.jsxs("span", {
                                        children: [W(Z.estimatedTimeMinutes), " planned"]
                                    })]
                                }), Se ? e.jsxs("button", {
                                    onClick: ue,
                                    disabled: !oe,
                                    className: g("px-5 py-2.5 sm:py-2 rounded-xl text-sm font-semibold transition-all duration-200 min-h-[44px]", "flex items-center gap-1.5", oe ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 active:scale-[0.98]" : "bg-zinc-200 dark:bg-zinc-700 text-zinc-400 cursor-not-allowed"),
                                    children: [e.jsx(xe, {
                                        className: "w-4 h-4"
                                    }), "Done"]
                                }) : e.jsxs("button", {
                                    onClick: ke,
                                    disabled: !oe && !f,
                                    className: g("px-4 py-2.5 sm:py-2 rounded-xl text-sm font-semibold transition-all duration-200 min-h-[44px]", "flex items-center gap-1.5", oe || f ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 active:scale-[0.98]" : "bg-zinc-200 dark:bg-zinc-700 text-zinc-400 cursor-not-allowed"),
                                    children: ["Next", e.jsx(He, {
                                        className: "w-4 h-4"
                                    })]
                                })]
                            })]
                        })
                    })]
                })
            }), document.body)]
        })
    },
    Et = (t, n) => {
        switch (t) {
            case "lecture":
                return "Lecture";
            case "revision":
                return "Revision";
            case "questions":
            case "practice":
                return "Practice";
            case "theory":
            case "other":
                return "Other";
            default:
                return n || "Practice"
        }
    },
    Ge = t => {
        const n = new Date(t);
        if (Number.isNaN(n.getTime())) return "";
        const N = S => String(S).padStart(2, "0"),
            w = n.getFullYear(),
            y = N(n.getMonth() + 1),
            x = N(n.getDate()),
            C = N(n.getHours()),
            k = N(n.getMinutes());
        return `${w}-${y}-${x}T${C}:${k}`
    },
    Rt = ({
        session: t,
        isOpen: n,
        onClose: N,
        isNew: w
    }) => {
        const {
            updateSession: y,
            deleteSession: x,
            addSession: C
        } = Xe(), {
            subjects: k
        } = Ke(), {
            tasks: S
        } = Oe(), [f, j] = o.useState(t.efficiency), [z, r] = o.useState(t.productivityRating || 3), [s, c] = o.useState(t.notes || ""), [m, h] = o.useState(t.taskType || "practice"), [p, d] = o.useState(t.description || ""), [b, l] = o.useState(t.pauseLogs || []), [u, A] = o.useState(t.subjectIds || (t.subjectId ? [t.subjectId] : [])), [D, L] = o.useState(t.chapterIds || []), [O, H] = o.useState(t.topicIds || []), [R, ve] = o.useState(t.taskIds || []), [_, ye] = o.useState(t.duration), [me, X] = o.useState(Ge(t.startTime)), [v, $] = o.useState(t.questionsAttempted || 0), [re, Z] = o.useState(t.questionsCorrect || 0), [Y, ke] = o.useState(t.questionsIncorrect || 0), [ne, ue] = o.useState(t.questionsSkipped || 0), [he, oe] = o.useState(t.targetQuestions || 0), [Se, be] = o.useState(null), [pe, Ce] = o.useState(t.questionsBySubject || {}), [ce, ie] = o.useState(t.questionsByChapter || {}), a = m === "practice" || m === "revision" || m === "questions";
        o.useEffect(() => {
            j(t.efficiency), r(t.productivityRating || 3), c(t.notes || ""), h(t.taskType || "practice"), d(t.description || ""), l(t.pauseLogs || []), A(t.subjectIds || (t.subjectId ? [t.subjectId] : [])), L(t.chapterIds || []), H(t.topicIds || []), ve(t.taskIds || []), ye(t.duration), X(Ge(t.startTime)), $(t.questionsAttempted || 0), Z(t.questionsCorrect || 0), ke(t.questionsIncorrect || 0), ue(t.questionsSkipped || 0), oe(t.targetQuestions || 0), Ce(t.questionsBySubject || {}), ie(t.questionsByChapter || {})
        }, [t]);
        const T = o.useCallback(() => {
            N()
        }, [N]);
        o.useEffect(() => {
            if (!n) return;
            const i = q => {
                q.key === "Escape" && N()
            };
            return window.addEventListener("keydown", i), () => window.removeEventListener("keydown", i)
        }, [n, N]);
        const P = (i, q, F) => {
                Ce(B => {
                    const ge = B[i] || {
                            attempted: 0,
                            correct: 0,
                            incorrect: 0,
                            skipped: 0
                        },
                        U = { ...B,
                            [i]: { ...ge,
                                [q]: F
                            }
                        },
                        fe = u.reduce((ee, te) => ee + (U[te] ?.attempted || 0), 0),
                        K = u.reduce((ee, te) => ee + (U[te] ?.correct || 0), 0),
                        Q = u.reduce((ee, te) => ee + (U[te] ?.incorrect || 0), 0),
                        ze = u.reduce((ee, te) => ee + (U[te] ?.skipped || 0), 0);
                    return $(fe), Z(K), ke(Q), ue(ze), U
                })
            },
            I = async () => {
                if (be(null), a) {
                    const Q = re + Y + ne;
                    if (Q > v) {
                        be(`Sum of parts (${Q}) cannot exceed attempted (${v}).`);
                        return
                    }
                    if (v > 0 && Q < v) {
                        be(`You attempted ${v} but only categorized ${Q}. Please adjust Correct/Incorrect/Skipped counts.`);
                        return
                    }
                }
                const i = b.reduce((Q, ze) => Q + ze.duration, 0),
                    q = new Date(me),
                    F = new Date(q.getTime() + _ * 6e4 + i * 1e3),
                    B = (m || "other").toLowerCase(),
                    ge = Et(B, t.type),
                    U = a ? u.length === 1 ? { ...pe,
                        [u[0]]: {
                            attempted: v,
                            correct: re,
                            incorrect: Y,
                            skipped: ne
                        }
                    } : pe : void 0,
                    fe = Ze({
                        durationMinutes: _,
                        subjectIds: u,
                        chapterIds: D,
                        topicIds: O,
                        taskIds: R
                    }),
                    K = { ...t,
                        efficiency: f,
                        productivityRating: z,
                        notes: s,
                        type: ge,
                        taskType: B,
                        sessionType: B,
                        description: p,
                        pauseLogs: b,
                        totalPauseTime: i,
                        subjectIds: u,
                        chapterIds: D,
                        topicIds: O,
                        taskIds: R,
                        duration: _,
                        startTime: q.toISOString(),
                        endTime: F.toISOString(),
                        questionsAttempted: a ? v : void 0,
                        questionsCorrect: a ? re : void 0,
                        questionsIncorrect: a ? Y : void 0,
                        questionsSkipped: a ? ne : void 0,
                        targetQuestions: a ? he : void 0,
                        questionsBySubject: U,
                        questionsByChapter: a ? ce : void 0,
                        timeAllocation: fe,
                        allocationStrategy: "hierarchical",
                        subjectId: u.length > 0 ? u[0] : void 0,
                        subject: u.length > 0 ? k.find(Q => Q.id === u[0]) ?.name : void 0,
                        updatedAt: new Date().toISOString()
                    };
                w ? (await C(K), Je({
                    sessionId: K.id,
                    durationMinutes: K.duration,
                    sessionType: K.sessionType,
                    taskType: K.taskType,
                    notes: K.notes,
                    endedAt: K.endTime
                })) : await y(t.id, {
                    efficiency: f,
                    productivityRating: z,
                    notes: s,
                    type: ge,
                    taskType: B,
                    sessionType: B,
                    description: p,
                    pauseLogs: b,
                    totalPauseTime: i,
                    subjectIds: u,
                    chapterIds: D,
                    topicIds: O,
                    taskIds: R,
                    duration: _,
                    startTime: q.toISOString(),
                    endTime: F.toISOString(),
                    questionsAttempted: a ? v : void 0,
                    questionsCorrect: a ? re : void 0,
                    questionsIncorrect: a ? Y : void 0,
                    questionsSkipped: a ? ne : void 0,
                    targetQuestions: a ? he : void 0,
                    questionsBySubject: U,
                    questionsByChapter: a ? ce : void 0,
                    timeAllocation: fe,
                    allocationStrategy: "hierarchical",
                    subjectId: u.length > 0 ? u[0] : void 0,
                    subject: u.length > 0 ? k.find(Q => Q.id === u[0]) ?.name : void 0
                }), N()
            },
            E = async () => {
                window.confirm("Are you sure you want to delete this session? This action cannot be undone.") && (await x(t.id), N())
            },
            G = (i, q) => {
                const F = [...b];
                F[i].reason = q, l(F)
            },
            V = i => {
                l(b.filter((q, F) => F !== i))
            },
            J = i => {
                A(i.subjectIds), L(i.chapterIds), H(i.topicIds), ve(i.taskIds)
            },
            Ne = [{
                value: "theory",
                label: "Theory",
                icon: "📚"
            }, {
                value: "questions",
                label: "Questions",
                icon: "❓"
            }, {
                value: "lecture",
                label: "Lecture",
                icon: "🎓"
            }, {
                value: "revision",
                label: "Revision",
                icon: "📝"
            }, {
                value: "practice",
                label: "Practice",
                icon: "💪"
            }, {
                value: "other",
                label: "Other",
                icon: "📌"
            }];
        return (t.subjectIds || []).map(i => k.find(q => q.id === i) ?.name).filter(Boolean), (t.taskIds || []).map(i => S.find(q => q.id === i) ?.title).filter(Boolean), n ? Qe.createPortal(e.jsx("div", {
            className: "fixed inset-0 z-[9999] flex flex-col items-center justify-start bg-black/60 backdrop-blur-sm overflow-y-auto p-4 sm:p-6 md:p-8 pt-20 md:pt-24",
            onClick: T,
            children: e.jsxs(M.div, {
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
                onClick: i => i.stopPropagation(),
                className: "w-full max-w-2xl bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative my-auto",
                children: [e.jsxs("div", {
                    className: "flex justify-between items-center p-4 border-b border-white/5",
                    children: [e.jsxs("div", {
                        children: [e.jsx("h3", {
                            className: "text-lg font-semibold text-white",
                            children: w ? "Log Session" : "Edit Session"
                        }), e.jsxs("p", {
                            className: "text-sm text-zinc-500",
                            children: [new Date(t.startTime).toLocaleDateString(), " •", " ", W(t.duration)]
                        })]
                    }), e.jsx("button", {
                        onClick: N,
                        className: "p-1 hover:bg-white/10 rounded-lg transition-colors",
                        children: e.jsx(le, {
                            className: "w-5 h-5 text-zinc-500 dark:text-zinc-400"
                        })
                    })]
                }), e.jsxs("div", {
                    className: "flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6",
                    children: [e.jsxs("div", {
                        className: "bg-white/5 rounded-xl p-4 border border-white/5 space-y-4",
                        children: [e.jsx("h4", {
                            className: "text-sm font-semibold text-zinc-500 dark:text-zinc-400",
                            children: "Session Details"
                        }), e.jsxs("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                            children: [e.jsxs("div", {
                                children: [e.jsx("label", {
                                    className: "block text-xs text-zinc-500 mb-1",
                                    children: "Start Time & Date"
                                }), e.jsx("input", {
                                    type: "datetime-local",
                                    value: me,
                                    onChange: i => X(i.target.value),
                                    className: "w-full bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-brand-500"
                                })]
                            }), e.jsxs("div", {
                                children: [e.jsx("label", {
                                    className: "block text-xs text-zinc-500 mb-1",
                                    children: "Duration (minutes)"
                                }), e.jsxs("div", {
                                    className: "flex items-center gap-3",
                                    children: [e.jsx(ae, {
                                        className: "w-4 h-4 text-zinc-500 dark:text-zinc-400"
                                    }), e.jsx("input", {
                                        type: "number",
                                        min: "1",
                                        value: _,
                                        onChange: i => ye(parseInt(i.target.value) || 0),
                                        className: "bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm w-full focus:outline-none focus:border-brand-500"
                                    })]
                                })]
                            })]
                        }), e.jsxs("div", {
                            className: "space-y-2",
                            children: [e.jsx("label", {
                                className: "block text-xs text-zinc-500",
                                children: "Focus Context (Subjects, Chapters, Topics, Tasks)"
                            }), e.jsx(Mt, {
                                initialSubjectIds: u,
                                initialChapterIds: D,
                                initialTopicIds: O,
                                initialTaskIds: R,
                                onSelect: J,
                                maxHeight: "300px",
                                dropdownZIndex: 10001,
                                expandOnDesktop: !0
                            })]
                        })]
                    }), e.jsxs("div", {
                        children: [e.jsx("label", {
                            className: "block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2",
                            children: "Task Type"
                        }), e.jsx("div", {
                            className: "grid grid-cols-3 gap-2",
                            children: Ne.map(i => e.jsxs("button", {
                                type: "button",
                                onClick: () => h(i.value),
                                className: `px-3 py-2 rounded-lg text-sm font-medium transition-colors border flex flex-col items-center gap-1 ${m===i.value?"bg-brand-500/20 border-brand-500 text-brand-200":"bg-white/5 border-transparent text-zinc-500 dark:text-zinc-400 hover:bg-white/10"}`,
                                children: [e.jsx("span", {
                                    className: "text-lg",
                                    children: i.icon
                                }), e.jsx("span", {
                                    children: i.label
                                })]
                            }, i.value))
                        })]
                    }), a && e.jsxs("div", {
                        className: "bg-white/5 rounded-xl p-4 border border-white/5 space-y-4",
                        children: [e.jsx("h4", {
                            className: "text-sm font-semibold text-zinc-500 dark:text-zinc-400",
                            children: "Questions Performance"
                        }), e.jsxs("div", {
                            className: "grid grid-cols-2 lg:grid-cols-5 gap-2",
                            children: [e.jsxs("div", {
                                children: [e.jsx("label", {
                                    className: "block text-xs uppercase text-zinc-500 font-bold mb-1",
                                    children: "Target"
                                }), e.jsx("input", {
                                    type: "number",
                                    min: "0",
                                    value: he === 0 ? "" : he,
                                    onChange: i => oe(parseInt(i.target.value) || 0),
                                    className: "w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white font-bold text-center focus:border-brand-500"
                                })]
                            }), e.jsxs("div", {
                                children: [e.jsx("label", {
                                    className: "block text-xs uppercase text-zinc-500 font-bold mb-1",
                                    children: "Attempted"
                                }), e.jsx("input", {
                                    type: "number",
                                    min: "0",
                                    value: v === 0 ? "" : v,
                                    onChange: i => $(parseInt(i.target.value) || 0),
                                    className: "w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white font-bold text-center focus:border-brand-500"
                                })]
                            }), e.jsxs("div", {
                                children: [e.jsx("label", {
                                    className: "block text-xs uppercase text-emerald-500/70 font-bold mb-1",
                                    children: "Correct"
                                }), e.jsx("input", {
                                    type: "number",
                                    min: "0",
                                    value: re === 0 ? "" : re,
                                    onChange: i => Z(parseInt(i.target.value) || 0),
                                    className: "w-full px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 font-bold text-center focus:border-emerald-500"
                                })]
                            }), e.jsxs("div", {
                                children: [e.jsx("label", {
                                    className: "block text-xs uppercase text-rose-500/70 font-bold mb-1",
                                    children: "Incorrect"
                                }), e.jsx("input", {
                                    type: "number",
                                    min: "0",
                                    value: Y === 0 ? "" : Y,
                                    onChange: i => ke(parseInt(i.target.value) || 0),
                                    className: "w-full px-3 py-2 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 font-bold text-center focus:border-rose-500"
                                })]
                            }), e.jsxs("div", {
                                children: [e.jsx("label", {
                                    className: "block text-xs uppercase text-amber-500/70 font-bold mb-1",
                                    children: "Skipped"
                                }), e.jsx("input", {
                                    type: "number",
                                    min: "0",
                                    value: ne === 0 ? "" : ne,
                                    onChange: i => ue(parseInt(i.target.value) || 0),
                                    className: "w-full px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 font-bold text-center focus:border-amber-500"
                                })]
                            })]
                        }), Se && e.jsx("div", {
                            className: "text-xs text-rose-400 bg-rose-500/10 p-2 rounded border border-rose-500/20",
                            children: Se
                        }), u.length > 0 && e.jsxs("div", {
                            className: "mt-4 space-y-3",
                            children: [e.jsx("h5", {
                                className: "text-xs font-semibold text-zinc-500",
                                children: "Questions by Subject"
                            }), u.map(i => {
                                const q = k.find(B => B.id === i);
                                if (!q) return null;
                                const F = pe[i] || {
                                    attempted: 0,
                                    correct: 0,
                                    incorrect: 0,
                                    skipped: 0
                                };
                                return e.jsxs("div", {
                                    className: "bg-black/20 rounded-lg p-3 space-y-2",
                                    children: [e.jsxs("div", {
                                        className: "flex items-center justify-between",
                                        children: [e.jsx("span", {
                                            className: "text-sm text-zinc-600 dark:text-zinc-300",
                                            style: {
                                                color: q.color
                                            },
                                            children: q.name
                                        }), e.jsxs("span", {
                                            className: "text-xs text-zinc-500",
                                            children: [F.attempted, " attempted"]
                                        })]
                                    }), e.jsxs("div", {
                                        className: "grid grid-cols-4 gap-2",
                                        children: [e.jsx("input", {
                                            type: "number",
                                            min: "0",
                                            placeholder: "0",
                                            value: F.attempted || "",
                                            onChange: B => P(i, "attempted", parseInt(B.target.value) || 0),
                                            className: "px-2 py-1 bg-black/40 border border-white/10 rounded text-white text-xs text-center focus:border-brand-500"
                                        }), e.jsx("input", {
                                            type: "number",
                                            min: "0",
                                            placeholder: "0",
                                            value: F.correct || "",
                                            onChange: B => P(i, "correct", parseInt(B.target.value) || 0),
                                            className: "px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400 text-xs text-center focus:border-emerald-500"
                                        }), e.jsx("input", {
                                            type: "number",
                                            min: "0",
                                            placeholder: "0",
                                            value: F.incorrect || "",
                                            onChange: B => P(i, "incorrect", parseInt(B.target.value) || 0),
                                            className: "px-2 py-1 bg-rose-500/10 border border-rose-500/30 rounded text-rose-400 text-xs text-center focus:border-rose-500"
                                        }), e.jsx("input", {
                                            type: "number",
                                            min: "0",
                                            placeholder: "0",
                                            value: F.skipped || "",
                                            onChange: B => P(i, "skipped", parseInt(B.target.value) || 0),
                                            className: "px-2 py-1 bg-amber-500/10 border border-amber-500/30 rounded text-amber-400 text-xs text-center focus:border-amber-500"
                                        })]
                                    }), e.jsxs("div", {
                                        className: "flex gap-4 text-[10px] text-zinc-500",
                                        children: [e.jsx("span", {
                                            children: "Attempted"
                                        }), e.jsx("span", {
                                            className: "text-emerald-500/70",
                                            children: "Correct"
                                        }), e.jsx("span", {
                                            className: "text-rose-500/70",
                                            children: "Incorrect"
                                        }), e.jsx("span", {
                                            className: "text-amber-500/70",
                                            children: "Skipped"
                                        })]
                                    })]
                                }, i)
                            })]
                        })]
                    }), e.jsxs("div", {
                        children: [e.jsx("label", {
                            className: "block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2",
                            children: "Description"
                        }), e.jsx("textarea", {
                            value: p,
                            onChange: i => d(i.target.value),
                            placeholder: "What was this session about?",
                            className: "w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500/50 min-h-[80px] resize-none"
                        })]
                    }), e.jsxs("div", {
                        children: [e.jsx("label", {
                            className: "block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2",
                            children: "Productivity Rating"
                        }), e.jsx("div", {
                            className: "flex items-center gap-2 justify-center bg-white/5 rounded-xl p-4",
                            children: [1, 2, 3, 4, 5].map(i => e.jsx("button", {
                                type: "button",
                                onClick: () => r(i),
                                className: "transition-transform hover:scale-110",
                                children: e.jsx(xt, {
                                    className: `w-8 h-8 ${i<=z?"fill-yellow-500 text-yellow-500":"text-zinc-600"}`
                                })
                            }, i))
                        })]
                    }), e.jsxs("div", {
                        children: [e.jsxs("label", {
                            className: "block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2",
                            children: ["Focus Efficiency: ", f, "%"]
                        }), e.jsx("input", {
                            type: "range",
                            min: "0",
                            max: "100",
                            value: f,
                            onChange: i => j(parseInt(i.target.value)),
                            className: "w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        }), e.jsxs("div", {
                            className: "flex justify-between text-xs text-zinc-600 mt-1",
                            children: [e.jsx("span", {
                                children: "Distracted"
                            }), e.jsx("span", {
                                children: "Focused"
                            }), e.jsx("span", {
                                children: "Flow State"
                            })]
                        })]
                    }), b.length > 0 && e.jsxs("div", {
                        children: [e.jsxs("label", {
                            className: "block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2",
                            children: ["Pause Logs (", b.length, ")"]
                        }), e.jsx("div", {
                            className: "space-y-2 bg-white/5 rounded-xl p-3 border border-white/5 max-h-48 overflow-y-auto",
                            children: b.map((i, q) => e.jsxs("div", {
                                className: "flex items-center gap-3 bg-black/20 rounded-lg p-2",
                                children: [e.jsx(ae, {
                                    className: "w-4 h-4 text-zinc-500"
                                }), e.jsx("input", {
                                    type: "text",
                                    value: i.reason,
                                    onChange: F => G(q, F.target.value),
                                    className: "flex-1 bg-transparent text-sm text-white focus:outline-none"
                                }), e.jsx("span", {
                                    className: "text-xs text-zinc-500",
                                    children: W(i.duration, "seconds")
                                }), e.jsx("button", {
                                    onClick: () => V(q),
                                    className: "p-1 hover:bg-red-500/20 rounded transition-colors",
                                    children: e.jsx(le, {
                                        className: "w-4 h-4 text-red-400"
                                    })
                                })]
                            }, q))
                        })]
                    }), e.jsxs("div", {
                        children: [e.jsx("label", {
                            className: "block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2",
                            children: "Session Notes"
                        }), e.jsx("textarea", {
                            value: s,
                            onChange: i => c(i.target.value),
                            placeholder: "What did you accomplish? Any learnings or blockers?",
                            className: "w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 min-h-[120px] resize-none"
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "p-4 border-t border-white/5 bg-zinc-900/50 flex gap-3",
                    children: [e.jsxs("button", {
                        onClick: E,
                        className: `px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors flex items-center gap-2 ${w?"hidden":""}`,
                        children: [e.jsx(Ve, {
                            className: "w-4 h-4"
                        }), "Delete"]
                    }), e.jsx("div", {
                        className: "flex-1"
                    }), e.jsx("button", {
                        onClick: N,
                        className: "px-6 py-2 bg-white/5 text-zinc-500 dark:text-zinc-400 rounded-xl hover:bg-white/10 transition-colors",
                        children: "Cancel"
                    }), e.jsxs("button", {
                        onClick: I,
                        className: "px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl transition-colors flex items-center gap-2",
                        children: [e.jsx(mt, {
                            className: "w-4 h-4"
                        }), w ? "Log Session" : "Save Changes"]
                    })]
                })]
            })
        }), document.body) : null
    };
export {
    Mt as H, Rt as S
};