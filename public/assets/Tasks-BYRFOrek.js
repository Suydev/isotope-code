import {
    j as e,
    r as s,
    b as Lt,
    f as Ft
} from "./vendor-react-BfU3Zn2J.js";
import {
    p as me,
    e as Ne,
    j as le,
    u as Ie,
    l as qe,
    m as et,
    h as Ht,
    f as Bt,
    i as Ot
} from "./useFocusStore-CX_Nyp1h.js";
import {
    u as _t,
    C as Gt,
    a as Ut,
    b as tt,
    D as Kt,
    e as Wt,
    p as Zt,
    r as Qt,
    c as Yt,
    s as Vt,
    K as Xt,
    P as Jt,
    f as qt,
    S as es,
    v as ts
} from "./sortable.esm-BBuGRz7f.js";
import {
    A as Ue,
    T as ss
} from "./TaskCardModal-DZvd1GWt.js";
import {
    m as N,
    A as X
} from "./vendor-motion-Cp_NPzpZ.js";
import {
    a as be
} from "./timeFormat-CMPo-BX2.js";
import {
    a as as
} from "./subjectBranding-DaDo_h8r.js";
import {
    i as Se,
    f as Ke
} from "./taskAvailability-B1aDS_ww.js";
import {
    aq as rs,
    Z as Ae,
    aV as it,
    g as he,
    m as os,
    a as je,
    aj as ct,
    am as Ce,
    ap as dt,
    aP as Pe,
    P as fe,
    X as ie,
    C as He,
    aw as $e,
    cn as xt,
    as as ls,
    r as ut,
    ar as ns,
    br as is,
    bc as cs,
    ab as We,
    f as ds,
    d as Ze,
    aK as xs,
    bN as us,
    bM as ps,
    az as ms,
    aG as hs,
    V as Be,
    c9 as bs,
    aA as fs,
    B as ys,
    L as gs,
    aS as vs,
    b6 as js,
    S as Oe,
    i as ks,
    T as st,
    b3 as ws,
    aB as at,
    bn as Ns,
    b5 as Ss,
    co as Cs,
    aD as Ts,
    cp as Ds,
    ch as zs,
    cq as $s,
    bm as Is,
    cr as As,
    cs as Ps
} from "./vendor-icons-CqruUz7g.js";
import {
    u as Qe
} from "./vendor-router-CmoTwRnm.js";
import {
    S as ue,
    w as pt,
    x as mt,
    g as rt,
    h as ht,
    c as Es,
    u as Ms
} from "./App-pJGjDiPw.js";
import {
    a as bt,
    u as ft
} from "./useAIStore-B2cv1FZz.js";
import {
    S as Rs,
    D as Ls
} from "./DashboardHeader-DNuRMna8.js";
import {
    P as Fs
} from "./PremiumEffects-BX6T03yQ.js";
import {
    g as Hs,
    a as Bs
} from "./studyPreferences-BBZvHe-O.js";
import {
    A as Os
} from "./AIAnalysisCard-qrpOk1g6.js";
import "./index-BPYJFSVW.js";
import "./useNotificationStore-BS4df28T.js";
import "./utils-D8mZnxMk.js";
import "./vendor-charts-CFLJvnG7.js";
import "./vendor-supabase-DAiUAuun.js";
import "./HeadwayUpdatesButton-DUh668tJ.js";
import "./useOnlineStatus-BJOTUERN.js";
import "./MarkdownRenderer-CIV1x0Uq.js";
import "./useSyncStore-vWs_TdIc.js";
import "./IsotopeLogoIcon-oPk5Ru-_.js";
const _s = ({
        progress: a,
        segments: o = 5,
        color: r = "emerald",
        showPercentage: m = !0,
        label: u,
        height: i = "h-1.5"
    }) => {
        const p = Math.floor(a / 100 * o),
            g = a / 100 * o % 1,
            L = {
                emerald: "bg-emerald-500",
                teal: "bg-teal-500",
                amber: "bg-amber-500",
                orange: "bg-orange-500",
                rose: "bg-rose-500"
            },
            y = {
                emerald: "shadow-[0_0_8px_rgba(16,185,129,0.4)]",
                teal: "shadow-[0_0_8px_rgba(20,184,166,0.4)]",
                amber: "shadow-[0_0_8px_rgba(245,158,11,0.4)]",
                orange: "shadow-[0_0_8px_rgba(249,115,22,0.4)]",
                rose: "shadow-[0_0_8px_rgba(244,63,94,0.4)]"
            };
        return e.jsxs("div", {
            className: "w-full",
            children: [(u || m) && e.jsxs("div", {
                className: "flex items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-400 mb-1.5 font-medium",
                children: [u && e.jsx("span", {
                    children: u
                }), m && e.jsxs("span", {
                    className: "tabular-nums",
                    children: [Math.round(a), "%"]
                })]
            }), e.jsx("div", {
                className: "flex gap-1",
                children: Array.from({
                    length: o
                }).map((n, t) => {
                    const b = t < p,
                        P = t === p && g > 0 ? g * 100 : b ? 100 : 0;
                    return e.jsx("div", {
                        className: `flex-1 ${i} bg-zinc-100 dark:bg-white/5 rounded-full overflow-hidden relative`,
                        children: e.jsx(N.div, {
                            className: `h-full rounded-full ${L[r]} ${P>0?y[r]:""}`,
                            initial: {
                                width: "0%"
                            },
                            animate: {
                                width: `${P}%`
                            },
                            transition: {
                                duration: .6,
                                delay: t * .05,
                                ease: [.23, 1, .32, 1]
                            }
                        })
                    }, t)
                })
            })]
        })
    },
    yt = "isotope-tasks-ui-prefs";

function gt() {
    try {
        const a = localStorage.getItem(yt);
        if (!a) return {};
        const o = JSON.parse(a);
        return {
            density: o.density,
            groupBy: o.groupBy,
            sortBy: o.sortBy,
            sortDir: o.sortDir,
            showScheduledTasks: o.showScheduledTasks,
            kanbanZoom: o.kanbanZoom
        }
    } catch {
        return {}
    }
}

function Gs(a) {
    try {
        const o = gt();
        localStorage.setItem(yt, JSON.stringify({ ...o,
            ...a
        }))
    } catch {}
}

function Us() {
    const a = gt(),
        [o, r] = s.useState(a.density || "default"),
        [m, u] = s.useState(a.groupBy || "status"),
        [i, p] = s.useState(a.sortBy || "priority"),
        [g, L] = s.useState(a.sortDir || "asc"),
        [y, n] = s.useState([]),
        [t, b] = s.useState(""),
        [d, P] = s.useState(a.showScheduledTasks ?? !1),
        [I, S] = s.useState(!1),
        [O, h] = s.useState(new Set),
        [z, R] = s.useState(null),
        [B, C] = s.useState([]),
        [W, T] = s.useState(!navigator.onLine),
        [j, x] = s.useState(!1),
        [H, Q] = s.useState(a.kanbanZoom || 100);
    s.useEffect(() => {
        Gs({
            density: o,
            groupBy: m,
            sortBy: i,
            sortDir: g,
            showScheduledTasks: d,
            kanbanZoom: H
        })
    }, [o, m, i, g, d, H]), s.useEffect(() => {
        const k = () => T(!1),
            M = () => T(!0);
        return window.addEventListener("online", k), window.addEventListener("offline", M), () => {
            window.removeEventListener("online", k), window.removeEventListener("offline", M)
        }
    }, []);
    const D = s.useCallback(k => {
            r(k)
        }, []),
        A = s.useCallback(k => u(k), []),
        Z = s.useCallback(k => p(k), []),
        f = s.useCallback(k => L(k), []),
        U = s.useCallback(k => {
            n(M => M.findIndex(Y => Y.key === k.key && Y.value === k.value) >= 0 ? M : [...M, k])
        }, []),
        V = s.useCallback((k, M) => {
            n(K => K.filter(Y => !(Y.key === k && Y.value === M)))
        }, []),
        re = s.useCallback(() => {
            n([]), b("")
        }, []),
        J = s.useCallback(k => {
            h(M => {
                const K = new Set(M);
                return K.has(k) ? K.delete(k) : K.add(k), K
            })
        }, []),
        w = s.useCallback(k => {
            h(new Set(k))
        }, []),
        _ = s.useCallback(() => {
            h(new Set)
        }, []),
        ee = s.useCallback(k => {
            R(k)
        }, []),
        se = s.useCallback(() => {
            R(null)
        }, []),
        c = s.useCallback((k, M) => {
            const K = crypto.randomUUID(),
                Y = setTimeout(() => {
                    C(G => G.filter(v => v.id !== K))
                }, 6e3),
                F = {
                    id: K,
                    label: k,
                    undo: M,
                    timeout: Y
                };
            return C(G => [...G.slice(-2), F]), K
        }, []),
        E = s.useCallback(k => {
            C(M => {
                const K = M.find(Y => Y.id === k);
                return K && (clearTimeout(K.timeout), K.undo()), M.filter(Y => Y.id !== k)
            })
        }, []),
        te = s.useCallback(k => {
            C(M => {
                const K = M.find(Y => Y.id === k);
                return K && clearTimeout(K.timeout), M.filter(Y => Y.id !== k)
            })
        }, []),
        ae = s.useCallback(k => {
            Q(Math.max(75, Math.min(125, k)))
        }, []),
        ne = s.useCallback(k => {
            let M = k.filter(F => !F.deletedAt);
            if (d || (M = M.filter(F => F.status === "done" || Se(F))), t.trim()) {
                const F = t.toLowerCase();
                M = M.filter(G => G.title.toLowerCase().includes(F) || (G.description || "").toLowerCase().includes(F) || G.subject.toLowerCase().includes(F))
            }
            for (const F of y) F.key === "status" ? M = M.filter(G => G.status === F.value) : F.key === "priority" ? M = M.filter(G => G.priority === F.value) : F.key === "subject" && (M = M.filter(G => G.subject === F.value || G.subjectId === F.value));
            const K = {
                    p1: 0,
                    p2: 1,
                    p3: 2,
                    p4: 3
                },
                Y = {
                    "in-progress": 0,
                    todo: 1,
                    review: 2,
                    backlog: 3,
                    done: 4
                };
            return M.sort((F, G) => {
                let v = 0;
                if (i === "priority") v = (K[F.priority] ?? 4) - (K[G.priority] ?? 4);
                else if (i === "releaseDate") {
                    const ye = F.releaseDate ? me(F.releaseDate).getTime() : 0,
                        ke = G.releaseDate ? me(G.releaseDate).getTime() : 0;
                    v = ye - ke
                } else i === "dueDate" ? v = me(F.dueDate).getTime() - me(G.dueDate).getTime() : i === "created" ? v = new Date(F.createdAt).getTime() - new Date(G.createdAt).getTime() : i === "title" ? v = F.title.localeCompare(G.title) : i === "status" && (v = (Y[F.status] ?? 5) - (Y[G.status] ?? 5));
                return g === "desc" ? -v : v
            }), M
        }, [t, y, d, i, g]);
    return {
        density: o,
        groupBy: m,
        sortBy: i,
        sortDir: g,
        filters: y,
        searchQuery: t,
        showScheduledTasks: d,
        isSearchFocused: I,
        selectedTaskIds: O,
        openPanelTaskId: z,
        undoStack: B,
        isOffline: W,
        showKeyboardHelp: j,
        kanbanZoom: H,
        setDensity: D,
        setGroupBy: A,
        setSortBy: Z,
        setSortDir: f,
        addFilter: U,
        removeFilter: V,
        clearFilters: re,
        setShowScheduledTasks: P,
        setSearchQuery: b,
        setIsSearchFocused: S,
        toggleSelectTask: J,
        selectAllTasks: w,
        clearSelection: _,
        openPanel: ee,
        closePanel: se,
        pushUndo: c,
        executeUndo: E,
        dismissUndo: te,
        setKanbanZoom: ae,
        setShowKeyboardHelp: x,
        applyFiltersAndSort: ne
    }
}

function Te(a) {
    return as(a)
}

function Ks(a, o) {
    const r = parseInt(a.slice(1, 3), 16),
        m = parseInt(a.slice(3, 5), 16),
        u = parseInt(a.slice(5, 7), 16);
    return `rgba(${r},${m},${u},${o})`
}

function vt(a) {
    const o = Ne(a, new Date);
    return o < 0 ? "overdue" : o === 0 ? "today" : o <= 3 ? "soon" : "normal"
}

function jt(a) {
    const o = Ne(a, new Date),
        r = me(a);
    return o < -1 ? `${Math.abs(o)}d overdue` : o === -1 ? "Yesterday" : o === 0 ? "Today" : o === 1 ? "Tomorrow" : o <= 7 ? `In ${o}d` : r.toLocaleDateString(void 0, {
        month: "short",
        day: "numeric"
    })
}
const ot = {
        p1: {
            label: "Critical",
            color: "#ef4444",
            bgColor: "rgba(239,68,68,0.08)"
        },
        p2: {
            label: "High",
            color: "#f97316",
            bgColor: "rgba(249,115,22,0.08)"
        },
        p3: {
            label: "Medium",
            color: "#3b82f6",
            bgColor: "rgba(59,130,246,0.08)"
        },
        p4: {
            label: "Low",
            color: "#10b981",
            bgColor: "rgba(16,185,129,0.08)"
        }
    },
    kt = ({
        task: a,
        onClick: o,
        accentColor: r = "#f97316"
    }) => {
        const {
            attributes: m,
            listeners: u,
            setNodeRef: i,
            transform: p,
            transition: g,
            isDragging: L
        } = _t({
            id: a.id,
            data: {
                type: "Task",
                task: a
            }
        }), y = Qe(), {
            moveTask: n,
            duplicateTask: t
        } = le(), {
            subjects: b
        } = Ie(), d = {
            transform: Gt.Transform.toString(p),
            transition: g
        }, P = U => {
            U.stopPropagation(), !D && y("/focus", {
                state: {
                    taskId: a.id,
                    taskTitle: a.title,
                    duration: a.effort * 60
                }
            })
        }, I = U => {
            U.stopPropagation(), t(a.id, {
                resetStatus: !0
            })
        }, S = U => {
            D || n(a.id, U ? "done" : "todo")
        }, O = () => {
            o && !L && o(a)
        }, h = a.subtasks ?.filter(U => U.completed).length || 0, z = a.subtasks ?.length || 0, R = z > 0 ? h / z * 100 : 0, B = ot[a.priority] || ot.p4, C = b.find(U => U.id === a.subjectId), W = C ? Te(C.color) : "#8b5cf6", T = C ?.chapters.find(U => U.id === a.chapterId), x = T ?.topics.find(U => U.id === a.topicId) ?.title || T ?.title, H = a.dueDate ? vt(a.dueDate) : "normal", Q = a.dueDate ? jt(a.dueDate) : "", D = !Se(a) && a.status !== "done", A = a.releaseDate ? Ke(a.releaseDate) : "", Z = H === "overdue" ? "#ef4444" : H === "today" ? "#f97316" : H === "soon" ? "#f59e0b" : "var(--color-text-muted)", f = a.status === "done";
        return L ? e.jsx("div", {
            ref: i,
            className: "mb-2.5 rounded-[14px] border-2 border-dashed h-[118px]",
            style: { ...d,
                borderColor: W + "60",
                background: W + "06"
            }
        }) : e.jsx("div", {
            ref: i,
            style: d,
            ...m,
            className: "group relative w-full mb-2.5 select-none",
            onClick: O,
            children: e.jsxs(N.div, {
                whileHover: {
                    y: -2,
                    boxShadow: `0 6px 20px rgba(0,0,0,0.12), 0 0 0 1px ${W}35`
                },
                whileTap: {
                    scale: .982
                },
                initial: {
                    opacity: 0,
                    y: 6
                },
                animate: {
                    opacity: f ? .6 : D ? .72 : 1,
                    y: 0
                },
                transition: {
                    duration: .18,
                    ease: [.16, 1, .3, 1]
                },
                className: "relative overflow-hidden cursor-pointer",
                style: {
                    background: `linear-gradient(160deg, ${W}05 0%, var(--color-surface) 40%)`,
                    border: "1px solid var(--color-border)",
                    borderLeft: `3px solid ${W}`,
                    borderRadius: 14,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                    transition: "box-shadow 0.2s ease, border-color 0.2s ease"
                },
                children: [e.jsx("div", {
                    style: {
                        height: 2,
                        background: `linear-gradient(to right, ${B.color}cc, ${B.color}33)`,
                        borderRadius: "14px 14px 0 0"
                    }
                }), e.jsxs("div", {
                    className: "px-3.5 pt-3 pb-2.5 flex flex-col gap-2",
                    children: [e.jsxs("div", {
                        className: "flex items-center justify-between gap-2",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-1.5 min-w-0",
                            children: [e.jsx("div", { ...u,
                                className: "flex-shrink-0 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-30 hover:!opacity-70 transition-opacity -ml-0.5",
                                onClick: U => U.stopPropagation(),
                                children: e.jsx(rs, {
                                    size: 13,
                                    style: {
                                        color: "var(--color-text-muted)"
                                    }
                                })
                            }), e.jsx("span", {
                                className: "text-[10px] font-bold uppercase tracking-widest px-2 py-[2px] rounded-full truncate max-w-[100px] flex-shrink-0",
                                style: {
                                    background: W + "18",
                                    color: W,
                                    border: `1px solid ${W}28`,
                                    letterSpacing: "0.07em"
                                },
                                children: a.subject
                            }), x && e.jsxs("span", {
                                className: "text-[10px] truncate max-w-[70px]",
                                style: {
                                    color: "var(--color-text-muted)"
                                },
                                children: ["· ", x]
                            })]
                        }), e.jsxs("div", {
                            className: "flex items-center gap-1.5 flex-shrink-0",
                            children: [a.energy === "high" && e.jsx(Ae, {
                                size: 11,
                                style: {
                                    color: "#f59e0b"
                                }
                            }), a.isRecurring && e.jsx(it, {
                                size: 10,
                                style: {
                                    color: "var(--color-text-muted)"
                                }
                            }), D && e.jsx(he, {
                                size: 10,
                                style: {
                                    color: "#6366f1"
                                }
                            }), e.jsx("span", {
                                className: "text-[9px] font-bold uppercase tracking-wider px-1.5 py-[1px] rounded-full",
                                style: {
                                    background: B.bgColor,
                                    color: B.color
                                },
                                children: B.label
                            })]
                        })]
                    }), e.jsxs("div", {
                        className: "flex items-start gap-2.5",
                        children: [e.jsx("div", {
                            className: "flex-shrink-0 mt-[1px]",
                            children: e.jsx(Ue, {
                                checked: f,
                                onChange: S,
                                disabled: D,
                                size: "md",
                                accentColor: r
                            })
                        }), e.jsxs("div", {
                            className: "flex-1 min-w-0",
                            children: [e.jsx("p", {
                                className: "text-[13px] font-semibold leading-snug line-clamp-2",
                                style: {
                                    color: f ? "var(--color-text-disabled)" : "var(--color-text-primary)",
                                    textDecoration: f ? "line-through" : "none",
                                    textDecorationColor: "var(--color-text-muted)"
                                },
                                title: a.title,
                                children: a.title
                            }), a.description && !f && e.jsx("p", {
                                className: "text-[11px] leading-relaxed mt-0.5 line-clamp-1 opacity-60",
                                style: {
                                    color: "var(--color-text-secondary)"
                                },
                                children: a.description
                            }), D && e.jsxs("div", {
                                className: "mt-1 flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                                style: {
                                    background: "#6366f11a",
                                    color: "#6366f1",
                                    border: "1px solid #6366f12e"
                                },
                                children: [e.jsx(he, {
                                    size: 10
                                }), A]
                            }), z > 0 && e.jsxs("div", {
                                className: "flex items-center gap-1 mt-1",
                                children: [e.jsx(os, {
                                    size: 10,
                                    style: {
                                        color: "var(--color-text-muted)"
                                    }
                                }), e.jsxs("span", {
                                    className: "text-[10px]",
                                    style: {
                                        color: "var(--color-text-muted)"
                                    },
                                    children: [h, "/", z]
                                })]
                            })]
                        })]
                    }), z > 0 && e.jsx("div", {
                        className: "opacity-60 group-hover:opacity-100 transition-opacity",
                        children: e.jsx(_s, {
                            progress: R,
                            segments: z,
                            color: "emerald",
                            showPercentage: !1,
                            height: "h-[2px]"
                        })
                    }), e.jsxs("div", {
                        className: "flex items-center justify-between pt-1.5 border-t",
                        style: {
                            borderColor: "var(--color-border)"
                        },
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-2.5",
                            children: [e.jsxs("div", {
                                className: "flex items-center gap-1",
                                style: {
                                    color: "var(--color-text-muted)"
                                },
                                children: [e.jsx(je, {
                                    size: 10
                                }), e.jsx("span", {
                                    className: "text-[10px] font-medium tabular-nums",
                                    children: be(a.effort)
                                })]
                            }), a.totalFocusTime != null && a.totalFocusTime > 0 && e.jsxs("div", {
                                className: "flex items-center gap-1",
                                style: {
                                    color: "#10b981"
                                },
                                children: [e.jsx(ct, {
                                    size: 10
                                }), e.jsx("span", {
                                    className: "text-[10px] font-bold tabular-nums",
                                    children: be(a.totalFocusTime)
                                })]
                            }), a.dueDate && e.jsxs("div", {
                                className: "flex items-center gap-1",
                                children: [e.jsx(Ce, {
                                    size: 10,
                                    style: {
                                        color: Z
                                    }
                                }), e.jsx("span", {
                                    className: "text-[10px] font-semibold",
                                    style: {
                                        color: Z
                                    },
                                    children: Q
                                })]
                            })]
                        }), e.jsxs("div", {
                            className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150",
                            children: [e.jsx("button", {
                                onClick: I,
                                title: "Duplicate",
                                className: "p-1.5 rounded-lg transition-all hover:bg-black/5 dark:hover:bg-white/8",
                                style: {
                                    color: "var(--color-text-muted)"
                                },
                                children: e.jsx(dt, {
                                    size: 11
                                })
                            }), e.jsx(X, {
                                children: !f && e.jsxs(N.button, {
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
                                    onClick: P,
                                    disabled: D,
                                    title: D ? A : "Focus now",
                                    className: "flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold",
                                    style: {
                                        background: D ? "var(--color-bg)" : r,
                                        border: D ? "1px solid var(--color-border)" : "1px solid transparent",
                                        color: D ? "var(--color-text-muted)" : "white",
                                        boxShadow: D ? "none" : `0 2px 8px ${r}50`
                                    },
                                    children: [D ? e.jsx(he, {
                                        size: 9
                                    }) : e.jsx(Pe, {
                                        size: 9,
                                        className: "fill-current"
                                    }), D ? "Locked" : "Focus"]
                                })
                            })]
                        })]
                    })]
                })]
            })
        })
    },
    _e = {
        backlog: {
            title: "Backlog",
            emoji: "📋",
            accent: "#78716c",
            description: "Ideas & future work"
        },
        todo: {
            title: "Today's Focus",
            emoji: "🎯",
            accent: "#f59e0b",
            description: "Planned for today"
        },
        "in-progress": {
            title: "In Progress",
            emoji: "⚡",
            accent: "#06b6d4",
            description: "Currently working on"
        },
        review: {
            title: "Review",
            emoji: "🔍",
            accent: "#8b5cf6",
            description: "Needs checking"
        },
        done: {
            title: "Done",
            emoji: "✅",
            accent: "#10b981",
            description: "Finished"
        }
    },
    Ws = {
        backlog: "Queue up future work here",
        todo: "Plan your day here",
        "in-progress": "Drag tasks here to start",
        review: "Tasks pending review",
        done: "Completions will appear here"
    },
    Zs = ({
        id: a,
        title: o,
        tasks: r,
        onTaskClick: m,
        onAddTask: u,
        isOver: i,
        accentColor: p
    }) => {
        const {
            setNodeRef: g
        } = qt({
            id: a
        }), {
            addTask: L
        } = le(), y = _e[a] || {
            title: o,
            emoji: "📌",
            accent: "#71717a"
        }, [n, t] = s.useState(!1), [b, d] = s.useState(""), P = s.useRef(null), I = () => {
            t(!0), setTimeout(() => P.current ?.focus(), 40)
        }, S = () => {
            b.trim() && (L({
                title: b.trim(),
                status: a,
                priority: "p3",
                dueDate: new Date().toISOString(),
                effort: 30,
                energy: "medium",
                subject: "General",
                description: "",
                subtasks: []
            }), d("")), t(!1)
        }, O = () => {
            d(""), t(!1)
        };
        return e.jsxs("div", {
            ref: g,
            className: "group flex flex-col w-[min(300px,calc(100vw-2rem))] min-w-[min(300px,calc(100vw-2rem))] max-h-full transition-all duration-200 snap-start",
            style: {
                background: i ? `${y.accent}0a` : "var(--color-surface)",
                border: `1px solid ${i?y.accent+"45":"var(--color-border)"}`,
                borderRadius: 18,
                boxShadow: i ? `0 0 0 2px ${y.accent}22, var(--shadow-2)` : "var(--shadow-1)"
            },
            children: [e.jsx("div", {
                style: {
                    height: 3,
                    background: y.accent,
                    borderRadius: "18px 18px 0 0",
                    opacity: i ? 1 : .5,
                    transition: "opacity 0.2s"
                }
            }), e.jsxs("div", {
                className: "flex items-center justify-between px-4 py-3 flex-shrink-0",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-2.5 min-w-0",
                    children: [e.jsx("span", {
                        className: "text-base leading-none",
                        children: y.emoji
                    }), e.jsx("div", {
                        className: "min-w-0",
                        children: e.jsx("h3", {
                            className: "text-[11px] font-bold uppercase tracking-[0.06em] truncate",
                            style: {
                                color: "var(--color-text-primary)",
                                letterSpacing: "0.06em"
                            },
                            children: y.title
                        })
                    })]
                }), e.jsxs("div", {
                    className: "flex items-center gap-1.5",
                    children: [e.jsx("span", {
                        className: "flex items-center justify-center min-w-[20px] h-[20px] px-1.5 text-[10px] font-bold rounded-full tabular-nums",
                        style: {
                            background: r.length > 0 ? `${y.accent}1a` : "var(--color-bg)",
                            color: r.length > 0 ? y.accent : "var(--color-text-muted)",
                            border: `1px solid ${r.length>0?y.accent+"28":"var(--color-border)"}`
                        },
                        children: r.length
                    }), e.jsx("button", {
                        type: "button",
                        onClick: I,
                        className: "p-1 rounded-lg transition-all opacity-0 group-hover:opacity-100",
                        style: {
                            color: "var(--color-text-muted)"
                        },
                        title: `Add task to ${y.title}`,
                        children: e.jsx(fe, {
                            size: 13,
                            strokeWidth: 2.5
                        })
                    })]
                })]
            }), e.jsx("div", {
                className: "mx-4 border-t",
                style: {
                    borderColor: "var(--color-border)"
                }
            }), e.jsx(es, {
                id: a,
                items: r.map(h => h.id),
                strategy: ts,
                children: e.jsxs("div", {
                    className: "flex-1 overflow-y-auto tasks-scrollbar p-3",
                    children: [e.jsx(X, {
                        mode: "popLayout",
                        children: r.map(h => e.jsx(kt, {
                            task: h,
                            onClick: m
                        }, h.id))
                    }), r.length === 0 && e.jsx("div", {
                        className: "h-[90px] rounded-[10px] flex flex-col items-center justify-center gap-1.5 transition-all duration-200",
                        style: {
                            border: `2px dashed ${i?y.accent:"var(--color-border)"}`,
                            background: i ? `${y.accent}08` : "transparent"
                        },
                        children: i ? e.jsx("span", {
                            className: "text-xs font-semibold",
                            style: {
                                color: y.accent
                            },
                            children: "↓ Drop here"
                        }) : e.jsxs(e.Fragment, {
                            children: [e.jsx("span", {
                                className: "text-lg opacity-30",
                                children: y.emoji
                            }), e.jsx("span", {
                                className: "text-[10px] text-center px-4 leading-snug",
                                style: {
                                    color: "var(--color-text-muted)"
                                },
                                children: Ws[a]
                            })]
                        })
                    })]
                })
            }), e.jsx(X, {
                children: n ? e.jsx(N.div, {
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
                    className: "px-3 pb-3 flex-shrink-0",
                    children: e.jsxs("div", {
                        className: "rounded-xl overflow-hidden",
                        style: {
                            border: `1px solid ${y.accent}50`,
                            boxShadow: `0 0 0 2px ${y.accent}18`
                        },
                        children: [e.jsx("input", {
                            ref: P,
                            value: b,
                            onChange: h => d(h.target.value),
                            maxLength: ue.taskTitle.maxChars,
                            onKeyDown: h => {
                                h.key === "Enter" && S(), h.key === "Escape" && O()
                            },
                            onBlur: () => setTimeout(S, 120),
                            placeholder: "Task title…",
                            className: "w-full px-3 py-2.5 text-[12px] bg-transparent border-none outline-none",
                            style: {
                                background: "var(--color-surface)",
                                color: "var(--color-text-primary)"
                            }
                        }), e.jsxs("div", {
                            className: "flex items-center gap-1 px-2 pb-2 pt-0",
                            children: [e.jsx("button", {
                                onClick: S,
                                className: "px-2.5 py-1 rounded-lg text-[10px] font-bold text-white",
                                style: {
                                    background: y.accent
                                },
                                children: "Add"
                            }), e.jsx("button", {
                                onClick: O,
                                className: "p-1 rounded-lg",
                                style: {
                                    color: "var(--color-text-muted)"
                                },
                                children: e.jsx(ie, {
                                    size: 11
                                })
                            })]
                        })]
                    })
                }) : e.jsxs(N.button, {
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    exit: {
                        opacity: 0
                    },
                    onClick: I,
                    className: "mx-3 mb-3 flex items-center gap-1.5 w-[calc(100%-24px)] px-3 py-2 rounded-xl text-[11px] font-medium transition-all flex-shrink-0 opacity-0 group-hover:opacity-100",
                    style: {
                        background: y.accent + "0c",
                        border: `1px dashed ${y.accent}30`,
                        color: "var(--color-text-muted)"
                    },
                    children: [e.jsx(fe, {
                        size: 12
                    }), "Add task"]
                })
            })]
        })
    },
    Qs = ({
        onTaskClick: a,
        onAddTask: o,
        filteredTasks: r,
        zoom: m = 100,
        accentColor: u = "#f97316"
    }) => {
        const {
            tasks: i,
            moveTask: p
        } = le(), [g, L] = s.useState(null), [y, n] = s.useState(null), t = Object.keys(_e), b = Ut(tt(Jt, {
            activationConstraint: {
                distance: 5
            }
        }), tt(Xt, {
            coordinateGetter: Vt
        })), d = h => {
            h.active.data.current ?.type === "Task" && L(h.active.data.current.task)
        }, P = h => {
            const {
                over: z
            } = h;
            if (!z) {
                n(null);
                return
            }
            const R = t.includes(z.id) ? String(z.id) : String(z.data.current ?.sortable ?.containerId || z.id);
            n(R)
        }, I = h => {
            L(null), n(null);
            const {
                active: z,
                over: R
            } = h;
            if (!R) return;
            const B = z.id,
                C = R.id;
            if (!(B === C || !i.find(T => T.id === B)))
                if (t.includes(C)) p(B, C);
                else {
                    const T = i.find(j => j.id === C);
                    T && p(B, T.status, T.id)
                }
        }, S = r ?? i.filter(h => !h.deletedAt), O = t.reduce((h, z) => (h[z] = S.filter(R => R.status === z).sort((R, B) => {
            const C = (R.order ?? Number.MAX_SAFE_INTEGER) - (B.order ?? Number.MAX_SAFE_INTEGER);
            return C !== 0 ? C : new Date(R.createdAt).getTime() - new Date(B.createdAt).getTime()
        }), h), {
            backlog: [],
            todo: [],
            "in-progress": [],
            review: [],
            done: []
        });
        return e.jsx("div", {
            className: "h-full w-full overflow-x-auto overflow-y-hidden bg-transparent overscroll-x-contain",
            children: e.jsxs(Kt, {
                sensors: b,
                collisionDetection: h => {
                    const z = Zt(h);
                    if (z.length > 0) return z;
                    const R = Qt(h);
                    return R.length > 0 ? R : Yt(h)
                },
                onDragStart: d,
                onDragOver: P,
                onDragEnd: I,
                children: [e.jsx("div", {
                    className: "flex gap-3 sm:gap-4 h-full min-w-max px-2 sm:px-6 pt-2 pb-6 safe-bottom snap-x snap-mandatory",
                    style: {
                        zoom: `${m}%`
                    },
                    children: t.map(h => e.jsx(Zs, {
                        id: h,
                        title: _e[h].title,
                        tasks: O[h],
                        onTaskClick: a,
                        onAddTask: o,
                        isOver: y === h,
                        accentColor: u
                    }, h))
                }), Lt.createPortal(e.jsx(Wt, {
                    dropAnimation: {
                        duration: 200,
                        easing: "cubic-bezier(0.16, 1, 0.3, 1)"
                    },
                    children: g && e.jsx("div", {
                        className: "rotate-2 scale-[1.03] cursor-grabbing opacity-95",
                        children: e.jsx(kt, {
                            task: g
                        })
                    })
                }), document.body)]
            })
        })
    },
    Ge = {
        p1: {
            icon: ns,
            hex: "#ef4444",
            label: "Critical",
            order: 0
        },
        p2: {
            icon: ut,
            hex: "#f97316",
            label: "High",
            order: 1
        },
        p3: {
            icon: ls,
            hex: "#f59e0b",
            label: "Medium",
            order: 2
        },
        p4: {
            icon: xt,
            hex: "#10b981",
            label: "Low",
            order: 3
        }
    },
    wt = {
        backlog: {
            label: "Backlog",
            hex: "#78716c",
            emoji: "📋",
            order: 0
        },
        todo: {
            label: "To Do",
            hex: "#f59e0b",
            emoji: "🎯",
            order: 1
        },
        "in-progress": {
            label: "In Progress",
            hex: "#06b6d4",
            emoji: "⚡",
            order: 2
        },
        review: {
            label: "Review",
            hex: "#8b5cf6",
            emoji: "🔍",
            order: 3
        },
        done: {
            label: "Done",
            hex: "#10b981",
            emoji: "✅",
            order: 4
        }
    };

function Ys(a, o, r) {
    if (o === "none") return [{
        key: "all",
        label: "All Tasks",
        color: "#78716c",
        emoji: "📋",
        tasks: a
    }];
    if (o === "status") {
        const m = ["todo", "in-progress", "review", "backlog", "done"],
            u = new Map;
        return m.forEach(i => u.set(i, [])), a.forEach(i => {
            const p = i.status ?? "backlog";
            u.has(p) || u.set(p, []), u.get(p).push(i)
        }), m.filter(i => (u.get(i) ?.length ?? 0) > 0).map(i => {
            const p = wt[i] ?? {
                label: i,
                hex: "#78716c",
                emoji: "📌"
            };
            return {
                key: i,
                label: p.label,
                color: p.hex,
                emoji: p.emoji,
                tasks: u.get(i)
            }
        })
    }
    if (o === "priority") {
        const m = ["p1", "p2", "p3", "p4"],
            u = new Map;
        return m.forEach(i => u.set(i, [])), a.forEach(i => {
            const p = i.priority ?? "p4";
            u.has(p) || u.set(p, []), u.get(p).push(i)
        }), m.filter(i => (u.get(i) ?.length ?? 0) > 0).map(i => {
            const p = Ge[i];
            return {
                key: i,
                label: p.label,
                color: p.hex,
                emoji: "🎯",
                tasks: u.get(i)
            }
        })
    }
    if (o === "subject") {
        const m = new Map;
        return a.forEach(u => {
            const i = u.subject ?? "General";
            m.has(i) || m.set(i, []), m.get(i).push(u)
        }), Array.from(m.entries()).map(([u, i]) => {
            const p = r.find(L => L.name === u),
                g = p ? Te(p.color) : "#8b5cf6";
            return {
                key: u,
                label: u,
                color: g,
                emoji: "📚",
                tasks: i
            }
        })
    }
    return [{
        key: "all",
        label: "All Tasks",
        color: "#78716c",
        emoji: "📋",
        tasks: a
    }]
}
const Vs = ({
        onTaskClick: a,
        filteredTasks: o,
        density: r = "default",
        groupBy: m = "none",
        accentColor: u = "#f97316"
    }) => {
        const {
            tasks: i,
            moveTask: p,
            deleteTask: g,
            updateTask: L
        } = le(), {
            subjects: y
        } = Ie(), n = Qe(), [t, b] = s.useState(null), [d, P] = s.useState(null), [I, S] = s.useState(new Set), [O, h] = s.useState(null), [z, R] = s.useState(""), B = s.useRef(null), C = o ?? i.filter(A => !A.deletedAt), W = Ys(C, m, y), T = s.useCallback((A, Z) => {
            p(A.id, Z ? "done" : "todo")
        }, [p]), j = A => {
            S(Z => {
                const f = new Set(Z);
                return f.has(A) ? f.delete(A) : f.add(A), f
            })
        }, x = (A, Z) => {
            A.stopPropagation(), h(Z.id), R(Z.title), setTimeout(() => B.current ?.focus(), 50)
        }, H = () => {
            O && z.trim() && L(O, {
                title: z.trim()
            }), h(null), R("")
        }, Q = r === "compact" ? "5px" : r === "comfortable" ? "14px" : "9px", D = r === "compact" ? "12px" : r === "comfortable" ? "14px" : "13px";
        return C.length === 0 ? e.jsxs("div", {
            className: "flex flex-col items-center justify-center py-24 gap-4 opacity-60",
            children: [e.jsx("span", {
                className: "text-5xl",
                children: "📋"
            }), e.jsxs("div", {
                className: "text-center",
                children: [e.jsx("p", {
                    className: "text-sm font-semibold",
                    style: {
                        color: "var(--color-text-primary)"
                    },
                    children: "No tasks to display"
                }), e.jsx("p", {
                    className: "text-xs mt-1",
                    style: {
                        color: "var(--color-text-muted)"
                    },
                    children: "Try adjusting filters or create a new task"
                })]
            })]
        }) : e.jsxs("div", {
            className: "w-full overflow-x-auto overflow-y-visible tasks-scrollbar pb-8 overscroll-x-contain",
            children: [e.jsx("div", {
                className: "sticky top-0 z-20 mb-1 px-3 py-2 backdrop-blur-xl rounded-xl",
                style: {
                    background: "var(--color-surface-overlay)",
                    border: "1px solid var(--color-border)",
                    boxShadow: "var(--shadow-1)"
                },
                children: e.jsxs("div", {
                    className: "grid min-w-[760px] grid-cols-[28px,2fr,100px,90px,80px,70px,80px,32px] gap-2 text-[9px] font-bold uppercase tracking-[0.1em]",
                    style: {
                        color: "var(--color-text-muted)"
                    },
                    children: [e.jsx("div", {}), e.jsx("div", {
                        children: "Task"
                    }), e.jsx("div", {
                        children: "Subject"
                    }), e.jsx("div", {
                        children: "Status"
                    }), e.jsx("div", {
                        children: "Priority"
                    }), e.jsx("div", {
                        children: "Duration"
                    }), e.jsx("div", {
                        children: "Due"
                    }), e.jsx("div", {})]
                })
            }), W.map(A => {
                const Z = I.has(A.key);
                return e.jsxs("div", {
                    className: "mb-2",
                    children: [m !== "none" && e.jsxs("button", {
                        onClick: () => j(A.key),
                        className: "w-full flex items-center gap-2 px-3 py-1.5 mb-1 rounded-xl transition-all text-left",
                        style: {
                            background: A.color + "10",
                            border: `1px solid ${A.color}22`
                        },
                        children: [e.jsx("div", {
                            style: {
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: A.color,
                                flexShrink: 0
                            }
                        }), e.jsx("span", {
                            className: "text-[11px] font-bold",
                            style: {
                                color: A.color
                            },
                            children: A.label
                        }), e.jsxs("span", {
                            className: "text-[10px] font-medium",
                            style: {
                                color: "var(--color-text-muted)"
                            },
                            children: ["(", A.tasks.length, ")"]
                        }), e.jsx("div", {
                            className: "ml-auto",
                            style: {
                                color: "var(--color-text-muted)"
                            },
                            children: Z ? e.jsx(He, {
                                size: 12
                            }) : e.jsx($e, {
                                size: 12
                            })
                        })]
                    }), e.jsx(X, {
                        children: !Z && e.jsx(N.div, {
                            initial: m !== "none" ? {
                                height: 0,
                                opacity: 0
                            } : !1,
                            animate: {
                                height: "auto",
                                opacity: 1
                            },
                            exit: {
                                height: 0,
                                opacity: 0
                            },
                            transition: {
                                duration: .2,
                                ease: "easeOut"
                            },
                            className: "overflow-hidden flex flex-col gap-1",
                            children: A.tasks.map((f, U) => {
                                const V = Ge[f.priority] ?? Ge.p4,
                                    re = V.icon,
                                    J = wt[f.status] ?? {
                                        label: f.status,
                                        hex: "#78716c"
                                    },
                                    w = t === f.id,
                                    _ = O === f.id,
                                    ee = f.status === "done",
                                    se = !Se(f) && !ee,
                                    c = f.releaseDate ? Ke(f.releaseDate) : "",
                                    E = f.subtasks ?.filter(v => v.completed).length ?? 0,
                                    te = f.subtasks ?.length ?? 0,
                                    ae = te > 0 ? E / te * 100 : 0,
                                    ne = y.find(v => v.id === f.subjectId),
                                    k = ne ? Te(ne.color) : "#8b5cf6",
                                    M = ne ?.chapters.find(v => v.id === f.chapterId),
                                    K = M ?.topics.find(v => v.id === f.topicId),
                                    Y = [M ?.title, K ?.title].filter(Boolean).join(" · "),
                                    F = f.dueDate && !ee && new Date(f.dueDate) < new Date,
                                    G = f.dueDate && !ee && new Date(f.dueDate).toDateString() === new Date().toDateString();
                                return e.jsxs("div", {
                                    children: [e.jsxs(N.div, {
                                        initial: {
                                            opacity: 0,
                                            y: 4
                                        },
                                        animate: {
                                            opacity: ee ? .6 : se ? .72 : 1,
                                            y: 0
                                        },
                                        transition: {
                                            delay: Math.min(U * .01, .15),
                                            duration: .18
                                        },
                                        onClick: () => !_ && a ?.(f),
                                        className: "group grid min-w-[760px] grid-cols-[28px,2fr,100px,90px,80px,70px,80px,32px] gap-2 items-center px-3 cursor-pointer rounded-xl transition-all relative overflow-visible",
                                        style: {
                                            paddingTop: Q,
                                            paddingBottom: Q,
                                            background: "var(--color-surface)",
                                            border: "1px solid var(--color-border)",
                                            borderLeft: `3px solid ${k}`,
                                            fontSize: D
                                        },
                                        onMouseEnter: v => {
                                            v.currentTarget.style.background = k + "08", v.currentTarget.style.borderColor = k + "50", v.currentTarget.style.borderLeftColor = k, v.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)"
                                        },
                                        onMouseLeave: v => {
                                            v.currentTarget.style.background = "var(--color-surface)", v.currentTarget.style.borderColor = "var(--color-border)", v.currentTarget.style.borderLeftColor = k, v.currentTarget.style.boxShadow = "none"
                                        },
                                        children: [e.jsx("div", {
                                            className: "flex items-center justify-center",
                                            onClick: v => v.stopPropagation(),
                                            children: e.jsx(Ue, {
                                                checked: ee,
                                                onChange: v => T(f, v),
                                                disabled: se,
                                                size: "sm",
                                                accentColor: u
                                            })
                                        }), e.jsxs("div", {
                                            className: "flex items-center gap-1.5 min-w-0",
                                            children: [te > 0 && e.jsx("button", {
                                                onClick: v => {
                                                    v.stopPropagation(), b(w ? null : f.id)
                                                },
                                                style: {
                                                    color: "var(--color-text-muted)",
                                                    flexShrink: 0
                                                },
                                                children: w ? e.jsx($e, {
                                                    size: 11
                                                }) : e.jsx(He, {
                                                    size: 11
                                                })
                                            }), e.jsxs("div", {
                                                className: "flex flex-col min-w-0 flex-1",
                                                children: [_ ? e.jsx("input", {
                                                    ref: B,
                                                    value: z,
                                                    onChange: v => R(v.target.value),
                                                    onBlur: H,
                                                    onKeyDown: v => {
                                                        v.key === "Enter" && H(), v.key === "Escape" && (h(null), R(""))
                                                    },
                                                    onClick: v => v.stopPropagation(),
                                                    className: "bg-transparent border-none outline-none font-medium w-full",
                                                    style: {
                                                        fontSize: D,
                                                        color: "var(--color-text-primary)",
                                                        borderBottom: `1px solid ${u}`
                                                    }
                                                }) : e.jsx("span", {
                                                    className: "font-medium truncate",
                                                    style: {
                                                        color: ee ? "var(--color-text-disabled)" : "var(--color-text-primary)",
                                                        textDecoration: ee ? "line-through" : "none"
                                                    },
                                                    onDoubleClick: v => x(v, f),
                                                    title: f.title,
                                                    children: f.title
                                                }), te > 0 && e.jsxs("div", {
                                                    className: "flex items-center gap-1 mt-0.5",
                                                    children: [e.jsx("div", {
                                                        className: "h-[2px] w-12 rounded-full overflow-hidden",
                                                        style: {
                                                            background: "var(--color-border)"
                                                        },
                                                        children: e.jsx("div", {
                                                            className: "h-full rounded-full",
                                                            style: {
                                                                width: `${ae}%`,
                                                                background: "#10b981"
                                                            }
                                                        })
                                                    }), e.jsxs("span", {
                                                        className: "text-[9px] tabular-nums",
                                                        style: {
                                                            color: "var(--color-text-muted)"
                                                        },
                                                        children: [E, "/", te]
                                                    })]
                                                }), se && e.jsxs("span", {
                                                    className: "mt-1 flex w-fit items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold",
                                                    style: {
                                                        background: "#6366f11a",
                                                        color: "#6366f1",
                                                        border: "1px solid #6366f12e"
                                                    },
                                                    children: [e.jsx(he, {
                                                        size: 9
                                                    }), c]
                                                })]
                                            })]
                                        }), e.jsxs("div", {
                                            className: "min-w-0",
                                            children: [e.jsx("span", {
                                                className: "px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide w-fit truncate max-w-[90px] block",
                                                style: {
                                                    background: k + "18",
                                                    color: k,
                                                    border: `1px solid ${k}28`
                                                },
                                                children: f.subject || "General"
                                            }), Y && e.jsx("span", {
                                                className: "text-[9px] truncate block",
                                                style: {
                                                    color: "var(--color-text-muted)"
                                                },
                                                children: Y
                                            })]
                                        }), e.jsxs("div", {
                                            className: "flex items-center gap-1",
                                            children: [e.jsx("div", {
                                                style: {
                                                    width: 5,
                                                    height: 5,
                                                    borderRadius: "50%",
                                                    background: J.hex,
                                                    flexShrink: 0
                                                }
                                            }), e.jsx("span", {
                                                className: "text-[10px] truncate",
                                                style: {
                                                    color: "var(--color-text-secondary)"
                                                },
                                                children: J.label
                                            })]
                                        }), e.jsxs("div", {
                                            className: "flex items-center gap-1",
                                            children: [e.jsx(re, {
                                                size: 10,
                                                style: {
                                                    color: V.hex,
                                                    flexShrink: 0
                                                },
                                                strokeWidth: 2.5
                                            }), e.jsx("span", {
                                                className: "text-[10px] font-semibold",
                                                style: {
                                                    color: V.hex
                                                },
                                                children: V.label
                                            })]
                                        }), e.jsxs("div", {
                                            className: "flex items-center gap-0.5",
                                            style: {
                                                color: "var(--color-text-muted)"
                                            },
                                            children: [e.jsx(je, {
                                                size: 10
                                            }), e.jsx("span", {
                                                className: "text-[10px] tabular-nums",
                                                children: be(f.effort, "minutes")
                                            })]
                                        }), e.jsxs("div", {
                                            className: "flex items-center gap-0.5",
                                            children: [e.jsx(Ce, {
                                                size: 10,
                                                style: {
                                                    color: F ? "#ef4444" : G ? "#f59e0b" : "var(--color-text-muted)"
                                                }
                                            }), e.jsx("span", {
                                                className: "text-[10px] tabular-nums",
                                                style: {
                                                    color: F ? "#ef4444" : G ? "#f59e0b" : "var(--color-text-muted)"
                                                },
                                                children: f.dueDate ? me(f.dueDate).toLocaleDateString(void 0, {
                                                    month: "short",
                                                    day: "numeric"
                                                }) : "—"
                                            })]
                                        }), e.jsxs("div", {
                                            className: `relative flex justify-end ${d===f.id?"opacity-100":"opacity-0 group-hover:opacity-100"} transition-opacity`,
                                            children: [e.jsx("button", {
                                                className: "p-1 rounded-lg",
                                                style: {
                                                    color: "var(--color-text-muted)"
                                                },
                                                onClick: v => {
                                                    v.stopPropagation(), P(d === f.id ? null : f.id)
                                                },
                                                onBlur: () => setTimeout(() => P(null), 150),
                                                children: e.jsx(is, {
                                                    size: 13
                                                })
                                            }), e.jsx(X, {
                                                children: d === f.id && e.jsxs(N.div, {
                                                    initial: {
                                                        opacity: 0,
                                                        scale: .9,
                                                        y: 4
                                                    },
                                                    animate: {
                                                        opacity: 1,
                                                        scale: 1,
                                                        y: 0
                                                    },
                                                    exit: {
                                                        opacity: 0,
                                                        scale: .9,
                                                        y: 4
                                                    },
                                                    onClick: v => v.stopPropagation(),
                                                    className: "absolute right-0 top-full mt-1 w-36 rounded-xl overflow-hidden z-50 p-1",
                                                    style: {
                                                        background: "var(--color-surface)",
                                                        border: "1px solid var(--color-border)",
                                                        boxShadow: "var(--shadow-4)"
                                                    },
                                                    children: [e.jsxs("button", {
                                                        onClick: v => {
                                                            v.stopPropagation(), x(v, f), P(null)
                                                        },
                                                        className: "task-context-menu-item w-full",
                                                        children: [e.jsx(cs, {
                                                            size: 11
                                                        }), "Rename"]
                                                    }), e.jsxs("button", {
                                                        onClick: v => {
                                                            v.stopPropagation(), !se && n("/focus", {
                                                                state: {
                                                                    taskId: f.id,
                                                                    taskTitle: f.title,
                                                                    duration: f.effort * 60
                                                                }
                                                            })
                                                        },
                                                        disabled: se,
                                                        className: "task-context-menu-item w-full",
                                                        title: se ? c : "Focus",
                                                        children: [se ? e.jsx(he, {
                                                            size: 11
                                                        }) : e.jsx(Pe, {
                                                            size: 11
                                                        }), se ? "Locked" : "Focus"]
                                                    }), e.jsx("div", {
                                                        style: {
                                                            height: 1,
                                                            background: "var(--color-border)",
                                                            margin: "3px 0"
                                                        }
                                                    }), e.jsxs("button", {
                                                        onClick: () => {
                                                            g(f.id), P(null)
                                                        },
                                                        className: "task-context-menu-item danger w-full",
                                                        children: [e.jsx(We, {
                                                            size: 11
                                                        }), "Delete"]
                                                    })]
                                                })
                                            })]
                                        })]
                                    }), e.jsx(X, {
                                        children: w && te > 0 && e.jsx(N.div, {
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
                                                className: "ml-10 mr-2 my-1 p-2.5 rounded-xl flex flex-col gap-1",
                                                style: {
                                                    background: "var(--color-bg)",
                                                    border: "1px solid var(--color-border)"
                                                },
                                                children: f.subtasks ?.map((v, ye) => e.jsxs("div", {
                                                    className: "flex items-center gap-2 text-[11px] py-0.5 rounded-lg",
                                                    style: {
                                                        color: v.completed ? "var(--color-text-muted)" : "var(--color-text-secondary)"
                                                    },
                                                    children: [v.completed ? e.jsx(ds, {
                                                        size: 11,
                                                        style: {
                                                            color: "#10b981",
                                                            flexShrink: 0
                                                        }
                                                    }) : e.jsx(xt, {
                                                        size: 11,
                                                        style: {
                                                            color: "var(--color-border)",
                                                            flexShrink: 0
                                                        }
                                                    }), e.jsx("span", {
                                                        style: {
                                                            textDecoration: v.completed ? "line-through" : "none"
                                                        },
                                                        children: v.title
                                                    })]
                                                }, ye))
                                            })
                                        })
                                    })]
                                }, f.id)
                            })
                        })
                    })]
                }, A.key)
            })]
        })
    },
    lt = {
        p1: {
            hex: "#ef4444",
            label: "Critical"
        },
        p2: {
            hex: "#f97316",
            label: "High"
        },
        p3: {
            hex: "#3b82f6",
            label: "Medium"
        },
        p4: {
            hex: "#10b981",
            label: "Low"
        }
    },
    ve = 1500,
    we = 300,
    Xs = ({
        progress: a,
        size: o,
        stroke: r,
        color: m,
        isBreak: u
    }) => {
        const i = (o - r) / 2,
            p = 2 * Math.PI * i,
            g = p * (1 - a);
        return e.jsxs("svg", {
            width: o,
            height: o,
            style: {
                transform: "rotate(-90deg)",
                display: "block"
            },
            children: [e.jsx("circle", {
                cx: o / 2,
                cy: o / 2,
                r: i,
                fill: "none",
                stroke: "var(--color-border)",
                strokeWidth: r
            }), e.jsx("circle", {
                cx: o / 2,
                cy: o / 2,
                r: i,
                fill: "none",
                stroke: u ? "#10b981" : m,
                strokeWidth: r,
                strokeDasharray: p,
                strokeDashoffset: g,
                strokeLinecap: "round",
                style: {
                    transition: "stroke-dashoffset 0.9s linear, stroke 0.3s ease"
                }
            })]
        })
    },
    Js = ({
        onTaskClick: a,
        filteredTasks: o,
        accentColor: r = "#f97316"
    }) => {
        const {
            tasks: m,
            updateTask: u
        } = le(), {
            subjects: i
        } = Ie(), [p, g] = s.useState(ve), [L, y] = s.useState(!1), [n, t] = s.useState(!1), [b, d] = s.useState(0), [P, I] = s.useState(0), S = s.useRef(null), h = p / (n ? we : ve), z = Math.floor(p / 60).toString().padStart(2, "0"), R = (p % 60).toString().padStart(2, "0");
        s.useEffect(() => (L ? S.current = setInterval(() => {
            g(w => w <= 1 ? (clearInterval(S.current), y(!1), n || d(_ => _ + 1), t(_ => !_), n ? ve : we) : w - 1)
        }, 1e3) : S.current && clearInterval(S.current), () => {
            S.current && clearInterval(S.current)
        }), [L, n]);
        const B = () => {
                y(!1), g(n ? we : ve)
            },
            C = () => {
                y(!1), t(w => !w), g(n ? ve : we)
            },
            T = (o ?? m.filter(w => !w.deletedAt)).filter(w => ["todo", "in-progress"].includes(w.status)),
            [j, x] = s.useState(0),
            [H, Q] = s.useState(0);
        s.useEffect(() => {
            j >= T.length && T.length > 0 && x(T.length - 1)
        }, [T.length, j]);
        const D = T[j],
            A = s.useCallback(() => {
                j < T.length - 1 && (Q(1), x(w => w + 1))
            }, [j, T.length]),
            Z = s.useCallback(() => {
                j > 0 && (Q(-1), x(w => w - 1))
            }, [j]),
            f = s.useCallback(() => {
                D && (u(D.id, {
                    status: "done"
                }), I(w => w + 1), j >= T.length - 1 && j > 0 && x(w => w - 1))
            }, [D, j, T.length, u]);
        s.useEffect(() => {
            const w = _ => {
                _.key === "ArrowRight" && A(), _.key === "ArrowLeft" && Z(), _.key === " " && (_.preventDefault(), f())
            };
            return window.addEventListener("keydown", w), () => window.removeEventListener("keydown", w)
        }, [A, Z, f]);
        const U = {
                enter: w => ({
                    x: w > 0 ? 1e3 : -1e3,
                    opacity: 0,
                    scale: .9,
                    rotateY: w > 0 ? 45 : -45
                }),
                center: {
                    zIndex: 1,
                    x: 0,
                    opacity: 1,
                    scale: 1,
                    rotateY: 0,
                    transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                    }
                },
                exit: w => ({
                    zIndex: 0,
                    x: w < 0 ? 1e3 : -1e3,
                    opacity: 0,
                    scale: .9,
                    rotateY: w < 0 ? 45 : -45,
                    transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                    }
                })
            },
            V = lt[D ?.priority ?? "p4"] ?? lt.p4,
            re = i.find(w => w.name === D ?.subject || w.id === D ?.subjectId),
            J = re ? Te(re.color) : r;
        return T.length === 0 ? e.jsx("div", {
            className: "w-full flex flex-col items-center justify-center py-24 gap-5 text-center",
            children: e.jsxs(N.div, {
                initial: {
                    opacity: 0,
                    scale: .88
                },
                animate: {
                    opacity: 1,
                    scale: 1
                },
                transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                },
                className: "flex flex-col items-center gap-4",
                children: [e.jsx("div", {
                    className: "w-20 h-20 rounded-full flex items-center justify-center text-4xl",
                    style: {
                        background: "rgba(16,185,129,0.1)",
                        border: "2px solid rgba(16,185,129,0.2)"
                    },
                    children: "✅"
                }), e.jsx("h2", {
                    className: "text-3xl font-bold",
                    style: {
                        color: "var(--color-text-primary)",
                        letterSpacing: "-0.02em"
                    },
                    children: "All Caught Up!"
                }), e.jsx("p", {
                    style: {
                        color: "var(--color-text-muted)"
                    },
                    children: "You've cleared your focus queue. Take a break or add more tasks."
                })]
            })
        }) : e.jsxs("div", {
            className: "w-full min-h-[calc(100vh-140px)] flex flex-col lg:flex-row items-center justify-center gap-6 p-4 relative overflow-hidden",
            children: [e.jsxs("div", {
                className: "absolute inset-0 overflow-hidden pointer-events-none",
                children: [e.jsx("div", {
                    className: "absolute top-0 left-0 w-full h-full",
                    style: {
                        background: `radial-gradient(ellipse at 30% 30%, ${J}0a 0%, transparent 70%)`
                    }
                }), e.jsx("div", {
                    className: "absolute bottom-0 right-0 w-full h-full",
                    style: {
                        background: `radial-gradient(ellipse at 70% 70%, ${r}08 0%, transparent 70%)`
                    }
                })]
            }), e.jsxs("div", {
                className: "relative z-10 w-full max-w-xl flex flex-col gap-4",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-1.5 justify-center",
                    children: [T.slice(0, 12).map((w, _) => e.jsx(N.div, {
                        animate: {
                            width: _ === j ? 16 : 5,
                            background: _ < j ? "#10b981" : _ === j ? r : "var(--color-border)"
                        },
                        transition: {
                            type: "spring",
                            stiffness: 400,
                            damping: 25
                        },
                        style: {
                            height: 5,
                            borderRadius: 99,
                            flexShrink: 0
                        }
                    }, _)), T.length > 12 && e.jsxs("span", {
                        className: "text-[10px]",
                        style: {
                            color: "var(--color-text-muted)"
                        },
                        children: ["+", T.length - 12]
                    }), e.jsxs("span", {
                        className: "ml-2 text-[11px] tabular-nums",
                        style: {
                            color: "var(--color-text-muted)"
                        },
                        children: [j + 1, "/", T.length]
                    })]
                }), e.jsx("div", {
                    className: "relative",
                    style: {
                        perspective: 1e3
                    },
                    children: e.jsx(X, {
                        initial: !1,
                        custom: H,
                        mode: "wait",
                        children: e.jsxs(N.div, {
                            custom: H,
                            variants: U,
                            initial: "enter",
                            animate: "center",
                            exit: "exit",
                            className: "w-full flex flex-col rounded-3xl overflow-hidden",
                            style: {
                                background: "var(--color-surface)",
                                border: "1px solid var(--color-border)",
                                boxShadow: `0 0 0 1px ${J}20, 0 24px 60px rgba(0,0,0,0.12)`
                            },
                            children: [e.jsx("div", {
                                style: {
                                    height: 3,
                                    background: `linear-gradient(to right, ${J}, ${J}55)`
                                }
                            }), e.jsxs("div", {
                                className: "px-8 pt-6 pb-8 flex flex-col gap-5",
                                children: [e.jsxs("div", {
                                    className: "flex items-center justify-between gap-2",
                                    children: [e.jsxs("div", {
                                        className: "flex items-center gap-2 flex-wrap",
                                        children: [e.jsx("span", {
                                            className: "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                            style: {
                                                background: V.hex + "15",
                                                color: V.hex,
                                                border: `1px solid ${V.hex}25`
                                            },
                                            children: V.label
                                        }), D.subject && e.jsx("span", {
                                            className: "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                            style: {
                                                background: J + "15",
                                                color: J,
                                                border: `1px solid ${J}25`
                                            },
                                            children: D.subject
                                        })]
                                    }), e.jsxs("div", {
                                        className: "flex items-center gap-1",
                                        style: {
                                            color: "var(--color-text-muted)"
                                        },
                                        children: [e.jsx(je, {
                                            size: 12
                                        }), e.jsx("span", {
                                            className: "text-[11px] tabular-nums",
                                            children: be(D.effort)
                                        })]
                                    })]
                                }), e.jsxs("div", {
                                    className: "text-center cursor-pointer",
                                    onClick: () => a ?.(D),
                                    children: [e.jsx("h1", {
                                        className: "text-2xl md:text-3xl font-bold leading-tight",
                                        style: {
                                            color: "var(--color-text-primary)",
                                            letterSpacing: "-0.025em"
                                        },
                                        children: D.title
                                    }), D.description && e.jsx("p", {
                                        className: "mt-2 text-sm leading-relaxed line-clamp-2 max-w-md mx-auto",
                                        style: {
                                            color: "var(--color-text-muted)"
                                        },
                                        children: D.description
                                    })]
                                }), (D.subtasks ?.length ?? 0) > 0 && e.jsxs("div", {
                                    className: "flex items-center gap-2",
                                    children: [e.jsx("div", {
                                        className: "h-1.5 flex-1 rounded-full overflow-hidden",
                                        style: {
                                            background: "var(--color-border)"
                                        },
                                        children: e.jsx("div", {
                                            className: "h-full rounded-full transition-all duration-500",
                                            style: {
                                                width: `${(D.subtasks?.filter(w=>w.completed).length??0)/(D.subtasks?.length??1)*100}%`,
                                                background: "#10b981"
                                            }
                                        })
                                    }), e.jsxs("span", {
                                        className: "text-[11px] tabular-nums",
                                        style: {
                                            color: "var(--color-text-muted)"
                                        },
                                        children: [D.subtasks ?.filter(w => w.completed).length, "/", D.subtasks ?.length]
                                    })]
                                }), e.jsxs(N.button, {
                                    whileHover: {
                                        scale: 1.03
                                    },
                                    whileTap: {
                                        scale: .97
                                    },
                                    onClick: f,
                                    className: "flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm w-full",
                                    style: {
                                        background: r,
                                        color: "white",
                                        boxShadow: `0 4px 18px ${r}45`
                                    },
                                    children: [e.jsx(Ze, {
                                        size: 16,
                                        strokeWidth: 3
                                    }), "Mark Complete", e.jsx("kbd", {
                                        className: "task-kbd opacity-60 ml-1",
                                        children: "Space"
                                    })]
                                })]
                            })]
                        }, D.id)
                    })
                }), e.jsxs("div", {
                    className: "flex items-center justify-between",
                    children: [e.jsxs(N.button, {
                        whileHover: {
                            scale: 1.06
                        },
                        whileTap: {
                            scale: .92
                        },
                        onClick: Z,
                        disabled: j === 0,
                        className: "flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-medium disabled:opacity-30 disabled:cursor-not-allowed",
                        style: {
                            background: "var(--color-surface)",
                            border: "1px solid var(--color-border)",
                            color: "var(--color-text-secondary)"
                        },
                        children: [e.jsx(xs, {
                            size: 14
                        }), " Prev"]
                    }), e.jsx("div", {
                        className: "flex items-center gap-1 text-[10px]",
                        style: {
                            color: "var(--color-text-muted)"
                        },
                        children: P > 0 && e.jsxs("span", {
                            className: "flex items-center gap-1",
                            children: [e.jsx(Ae, {
                                size: 10,
                                style: {
                                    color: "#10b981"
                                }
                            }), P, " done"]
                        })
                    }), e.jsxs(N.button, {
                        whileHover: {
                            scale: 1.06
                        },
                        whileTap: {
                            scale: .92
                        },
                        onClick: A,
                        disabled: j === T.length - 1,
                        className: "flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-medium disabled:opacity-30 disabled:cursor-not-allowed",
                        style: {
                            background: "var(--color-surface)",
                            border: "1px solid var(--color-border)",
                            color: "var(--color-text-secondary)"
                        },
                        children: ["Next ", e.jsx(He, {
                            size: 14
                        })]
                    })]
                })]
            }), e.jsxs("div", {
                className: "relative z-10 flex flex-col items-center gap-4 flex-shrink-0",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-1 p-1 rounded-full",
                    style: {
                        background: "var(--color-surface)",
                        border: "1px solid var(--color-border)"
                    },
                    children: [e.jsx("button", {
                        onClick: () => {
                            t(!1), y(!1), g(ve)
                        },
                        className: "px-3 py-1 rounded-full text-[11px] font-bold transition-all",
                        style: {
                            background: n ? "transparent" : r,
                            color: n ? "var(--color-text-muted)" : "white"
                        },
                        children: "Focus"
                    }), e.jsx("button", {
                        onClick: () => {
                            t(!0), y(!1), g(we)
                        },
                        className: "px-3 py-1 rounded-full text-[11px] font-bold transition-all",
                        style: {
                            background: n ? "#10b981" : "transparent",
                            color: n ? "white" : "var(--color-text-muted)"
                        },
                        children: "Break"
                    })]
                }), e.jsxs("div", {
                    className: "relative",
                    style: {
                        width: 160,
                        height: 160
                    },
                    children: [e.jsx(Xs, {
                        progress: h,
                        size: 160,
                        stroke: 8,
                        color: r,
                        isBreak: n
                    }), e.jsxs("div", {
                        className: "absolute inset-0 flex flex-col items-center justify-center",
                        children: [e.jsxs("span", {
                            className: "text-3xl font-bold tabular-nums",
                            style: {
                                color: "var(--color-text-primary)",
                                letterSpacing: "-0.03em"
                            },
                            children: [z, ":", R]
                        }), e.jsx("span", {
                            className: "text-[10px] font-semibold uppercase tracking-widest mt-0.5",
                            style: {
                                color: n ? "#10b981" : r
                            },
                            children: n ? "Break" : "Focus"
                        })]
                    })]
                }), e.jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [e.jsx(N.button, {
                        whileHover: {
                            scale: 1.1
                        },
                        whileTap: {
                            scale: .9
                        },
                        onClick: B,
                        title: "Reset",
                        className: "w-9 h-9 rounded-full flex items-center justify-center",
                        style: {
                            background: "var(--color-surface)",
                            border: "1px solid var(--color-border)",
                            color: "var(--color-text-muted)"
                        },
                        children: e.jsx(us, {
                            size: 14
                        })
                    }), e.jsx(N.button, {
                        whileHover: {
                            scale: 1.08
                        },
                        whileTap: {
                            scale: .92
                        },
                        onClick: () => y(w => !w),
                        className: "w-12 h-12 rounded-full flex items-center justify-center text-white",
                        style: {
                            background: n ? "#10b981" : r,
                            boxShadow: `0 4px 16px ${n?"#10b98150":r+"50"}`
                        },
                        children: L ? e.jsx(ps, {
                            size: 18
                        }) : e.jsx(Pe, {
                            size: 18,
                            className: "ml-0.5"
                        })
                    }), e.jsx(N.button, {
                        whileHover: {
                            scale: 1.1
                        },
                        whileTap: {
                            scale: .9
                        },
                        onClick: C,
                        title: "Skip",
                        className: "w-9 h-9 rounded-full flex items-center justify-center",
                        style: {
                            background: "var(--color-surface)",
                            border: "1px solid var(--color-border)",
                            color: "var(--color-text-muted)"
                        },
                        children: e.jsx(ms, {
                            size: 14
                        })
                    })]
                }), b > 0 && e.jsxs("div", {
                    className: "flex items-center gap-1.5 text-[11px] font-medium",
                    style: {
                        color: "var(--color-text-muted)"
                    },
                    children: [e.jsx(ct, {
                        size: 11
                    }), b, " pomodoro", b !== 1 ? "s" : "", " completed"]
                }), e.jsxs("div", {
                    className: "text-[10px] flex gap-3",
                    style: {
                        color: "var(--color-text-muted)"
                    },
                    children: [e.jsxs("span", {
                        children: [e.jsx("kbd", {
                            className: "task-kbd",
                            children: "Space"
                        }), " done"]
                    }), e.jsxs("span", {
                        children: [e.jsx("kbd", {
                            className: "task-kbd",
                            children: "←/→"
                        }), " nav"]
                    })]
                })]
            })]
        })
    },
    qs = ({
        onAddHabit: a,
        onEditHabit: o
    }) => {
        const {
            habits: r,
            fetchHabits: m,
            toggleHabit: u
        } = bt();
        s.useEffect(() => {
            m()
        }, [m]);
        const i = r.filter(p => p.completed).length;
        return e.jsxs("div", {
            className: "rounded-2xl px-4 py-3 mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-3",
            style: {
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                boxShadow: "var(--shadow-1)"
            },
            children: [e.jsxs("div", {
                className: "flex flex-col shrink-0 min-w-[100px]",
                children: [e.jsx("span", {
                    className: "text-[9px] font-bold uppercase tracking-[0.1em]",
                    style: {
                        color: "var(--color-text-muted)"
                    },
                    children: "Daily Habits"
                }), e.jsxs("div", {
                    className: "flex items-center gap-1 mt-0.5",
                    children: [e.jsx("span", {
                        className: "text-sm font-bold",
                        style: {
                            color: "var(--color-text-primary)"
                        },
                        children: r.length > 0 ? `${i}/${r.length}` : "Track yours"
                    }), i > 0 && i === r.length && e.jsx("span", {
                        className: "text-sm",
                        children: "🔥"
                    })]
                })]
            }), e.jsx("div", {
                className: "flex items-center gap-2 overflow-x-auto flex-1 pb-1 no-scrollbar",
                children: r.length === 0 ? e.jsx("span", {
                    className: "text-xs italic",
                    style: {
                        color: "var(--color-text-muted)"
                    },
                    children: "No habits yet — add one!"
                }) : r.map(p => e.jsxs("div", {
                    className: "relative shrink-0 group",
                    children: [e.jsxs(N.button, {
                        whileTap: {
                            scale: .94
                        },
                        type: "button",
                        onClick: () => u(p.id),
                        className: "habit-pill min-h-[56px] pr-12 pt-4",
                        style: p.completed ? {
                            background: "rgba(16,185,129,0.08)",
                            borderColor: "rgba(16,185,129,0.25)"
                        } : {},
                        children: [e.jsx("span", {
                            className: "text-sm leading-none",
                            children: p.icon
                        }), e.jsxs("div", {
                            className: "flex flex-col leading-tight text-left",
                            children: [e.jsx("span", {
                                className: "text-[11px] font-bold whitespace-nowrap",
                                style: {
                                    color: "var(--color-text-primary)"
                                },
                                children: p.name
                            }), e.jsxs("span", {
                                className: "flex items-center gap-0.5 text-[9px]",
                                style: {
                                    color: "var(--color-text-muted)"
                                },
                                children: [e.jsx(hs, {
                                    size: 8,
                                    className: "fill-current",
                                    style: {
                                        color: p.streak > 0 ? "#f59e0b" : void 0
                                    }
                                }), p.streak, "d"]
                            })]
                        }), e.jsx(X, {
                            children: p.completed && e.jsx(N.div, {
                                initial: {
                                    scale: 0
                                },
                                animate: {
                                    scale: 1
                                },
                                exit: {
                                    scale: 0
                                },
                                transition: {
                                    type: "spring",
                                    stiffness: 600,
                                    damping: 20
                                },
                                children: e.jsx(Ze, {
                                    size: 11,
                                    style: {
                                        color: "#10b981"
                                    },
                                    strokeWidth: 3
                                })
                            })
                        })]
                    }), e.jsx("div", {
                        className: "absolute top-1.5 right-1.5 z-20 flex items-center gap-1 pointer-events-none",
                        children: e.jsx("button", {
                            onClick: g => {
                                g.stopPropagation(), o ?.(p)
                            },
                            type: "button",
                            "aria-label": `Edit ${p.name}`,
                            className: "pointer-events-auto flex h-6 w-6 items-center justify-center rounded-full shadow-sm opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100",
                            style: {
                                background: "#0f766e",
                                color: "white"
                            },
                            children: e.jsx(Be, {
                                size: 10,
                                strokeWidth: 3
                            })
                        })
                    })]
                }, p.id))
            }), e.jsxs(N.button, {
                whileHover: {
                    scale: 1.05
                },
                whileTap: {
                    scale: .95
                },
                onClick: a,
                className: "flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold shrink-0",
                style: {
                    background: "var(--color-bg)",
                    color: "var(--color-text-secondary)",
                    border: "1px solid var(--color-border)"
                },
                children: [e.jsx(fe, {
                    size: 12,
                    strokeWidth: 2.5
                }), "Add"]
            })]
        })
    },
    ea = [{
        key: "p1",
        title: "Do First",
        sub: "Urgent + Important",
        hex: "#ef4444",
        emoji: "🔥",
        urgent: !0,
        important: !0
    }, {
        key: "p3",
        title: "Schedule",
        sub: "Not Urgent + Important",
        hex: "#3b82f6",
        emoji: "📅",
        urgent: !1,
        important: !0
    }, {
        key: "p2",
        title: "Delegate",
        sub: "Urgent + Not Important",
        hex: "#f59e0b",
        emoji: "⚡",
        urgent: !0,
        important: !1
    }, {
        key: "p4",
        title: "Eliminate",
        sub: "Not Urgent + Not Important",
        hex: "#78716c",
        emoji: "🗑",
        urgent: !1,
        important: !1
    }],
    ta = ({
        onTaskClick: a,
        filteredTasks: o,
        accentColor: r = "#f97316"
    }) => {
        const {
            tasks: m,
            addTask: u
        } = le(), [i, p] = s.useState(null), [g, L] = s.useState(""), y = s.useRef(null), n = b => {
            p(b), L(""), setTimeout(() => y.current ?.focus(), 50)
        }, t = b => {
            if (g.trim()) {
                const d = {
                    p1: "p1",
                    p2: "p2",
                    p3: "p3",
                    p4: "p4"
                };
                u({
                    title: g.trim(),
                    priority: d[b] ?? "p3",
                    status: "todo",
                    dueDate: new Date().toISOString(),
                    effort: 30,
                    energy: "medium",
                    subject: "General",
                    description: "",
                    subtasks: []
                })
            }
            p(null), L("")
        };
        return e.jsx("div", {
            className: "grid grid-cols-1 md:grid-cols-2 gap-4 h-full pb-4",
            children: ea.map(b => {
                const P = (o ?? m).filter(I => I.priority === b.key && !I.deletedAt && I.status !== "done" && (o ? !0 : Se(I)));
                return e.jsxs("div", {
                    className: "eis-quadrant",
                    style: {
                        borderColor: `${b.hex}22`
                    },
                    children: [e.jsx("div", {
                        style: {
                            height: 3,
                            background: b.hex,
                            flexShrink: 0
                        }
                    }), e.jsxs("div", {
                        className: "eis-quadrant-header flex items-center justify-between",
                        style: {
                            borderColor: `${b.hex}18`,
                            background: `${b.hex}07`
                        },
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [e.jsx("span", {
                                className: "text-base leading-none",
                                children: b.emoji
                            }), e.jsxs("div", {
                                children: [e.jsx("h3", {
                                    className: "text-[12px] font-bold",
                                    style: {
                                        color: "var(--color-text-primary)"
                                    },
                                    children: b.title
                                }), e.jsx("p", {
                                    className: "text-[9px]",
                                    style: {
                                        color: "var(--color-text-muted)"
                                    },
                                    children: b.sub
                                })]
                            })]
                        }), e.jsxs("div", {
                            className: "flex items-center gap-1.5",
                            children: [e.jsx("span", {
                                className: "flex items-center justify-center min-w-[20px] h-[20px] text-[10px] font-bold rounded-full px-1",
                                style: {
                                    background: `${b.hex}18`,
                                    color: b.hex,
                                    border: `1px solid ${b.hex}28`
                                },
                                children: P.length
                            }), e.jsx("button", {
                                onClick: () => n(b.key),
                                title: "Add task",
                                className: "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                                style: {
                                    background: b.hex + "18",
                                    color: b.hex
                                },
                                children: e.jsx(fe, {
                                    size: 11
                                })
                            })]
                        })]
                    }), e.jsxs("div", {
                        className: "flex-1 overflow-y-auto tasks-scrollbar p-3 flex flex-col gap-2",
                        children: [P.map(I => e.jsxs(N.div, {
                            onClick: () => a(I),
                            whileHover: {
                                y: -1
                            },
                            className: "px-3 py-2.5 rounded-[10px] cursor-pointer transition-all",
                            style: {
                                background: "var(--color-bg)",
                                border: "1px solid var(--color-border)",
                                boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
                            },
                            onMouseEnter: S => {
                                S.currentTarget.style.borderColor = b.hex + "35", S.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"
                            },
                            onMouseLeave: S => {
                                S.currentTarget.style.borderColor = "var(--color-border)", S.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)"
                            },
                            children: [e.jsx("p", {
                                className: "text-[12px] font-medium line-clamp-2",
                                style: {
                                    color: "var(--color-text-primary)"
                                },
                                children: I.title
                            }), e.jsxs("div", {
                                className: "flex items-center gap-2 mt-1.5",
                                children: [I.subject && e.jsx("span", {
                                    className: "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full",
                                    style: {
                                        background: b.hex + "12",
                                        color: b.hex
                                    },
                                    children: I.subject
                                }), I.dueDate && e.jsxs("span", {
                                    className: "flex items-center gap-0.5 text-[9px]",
                                    style: {
                                        color: "var(--color-text-muted)"
                                    },
                                    children: [e.jsx(Ce, {
                                        size: 9
                                    }), me(I.dueDate).toLocaleDateString(void 0, {
                                        month: "short",
                                        day: "numeric"
                                    })]
                                }), I.effort && e.jsxs("span", {
                                    className: "flex items-center gap-0.5 text-[9px]",
                                    style: {
                                        color: "var(--color-text-muted)"
                                    },
                                    children: [e.jsx(je, {
                                        size: 9
                                    }), I.effort, "m"]
                                })]
                            })]
                        }, I.id)), e.jsx(X, {
                            children: i === b.key && e.jsx(N.div, {
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
                                className: "overflow-hidden mb-1",
                                children: e.jsx("div", {
                                    className: "rounded-[10px] overflow-hidden",
                                    style: {
                                        border: `1px solid ${b.hex}50`
                                    },
                                    children: e.jsx("input", {
                                        ref: y,
                                        value: g,
                                        onChange: I => L(I.target.value),
                                        maxLength: ue.taskTitle.maxChars,
                                        onKeyDown: I => {
                                            I.key === "Enter" && t(b.key), I.key === "Escape" && p(null)
                                        },
                                        onBlur: () => setTimeout(() => t(b.key), 120),
                                        placeholder: "Task title…",
                                        className: "w-full px-3 py-2 text-[12px] border-none outline-none",
                                        style: {
                                            background: "var(--color-surface)",
                                            color: "var(--color-text-primary)"
                                        }
                                    })
                                })
                            })
                        }), P.length === 0 && i !== b.key && e.jsxs("div", {
                            className: "flex-1 flex flex-col items-center justify-center gap-2 py-4 opacity-40",
                            children: [e.jsx("span", {
                                className: "text-2xl",
                                children: b.emoji
                            }), e.jsx("span", {
                                className: "text-[10px] text-center",
                                style: {
                                    color: "var(--color-text-muted)"
                                },
                                children: "No tasks — click + to add"
                            })]
                        })]
                    })]
                }, b.key)
            })
        })
    },
    sa = [{
        group: "Navigation",
        items: [{
            keys: ["1"],
            action: "Switch to List view"
        }, {
            keys: ["2"],
            action: "Switch to Board view"
        }, {
            keys: ["3"],
            action: "Switch to Matrix view"
        }, {
            keys: ["Z"],
            action: "Switch to Zen mode"
        }]
    }, {
        group: "Tasks",
        items: [{
            keys: ["N"],
            action: "Create new task"
        }, {
            keys: ["F"],
            action: "Focus search bar"
        }, {
            keys: ["?"],
            action: "Show this help"
        }, {
            keys: ["Esc"],
            action: "Close panel / Cancel"
        }]
    }, {
        group: "Actions",
        items: [{
            keys: ["⌘", "Z"],
            action: "Undo last action"
        }, {
            keys: ["⌘", "Enter"],
            action: "Save & close panel"
        }]
    }],
    aa = ({
        onClose: a
    }) => e.jsx(N.div, {
        initial: {
            opacity: 0
        },
        animate: {
            opacity: 1
        },
        exit: {
            opacity: 0
        },
        className: "fixed inset-0 z-[450] flex items-center justify-center task-kb-overlay",
        onClick: a,
        children: e.jsxs(N.div, {
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
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 30
            },
            onClick: o => o.stopPropagation(),
            className: "relative w-full max-w-lg mx-4 rounded-2xl overflow-hidden",
            style: {
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                boxShadow: "var(--shadow-5)"
            },
            children: [e.jsxs("div", {
                className: "flex items-center justify-between px-6 py-5 border-b",
                style: {
                    borderColor: "var(--color-border)"
                },
                children: [e.jsxs("div", {
                    children: [e.jsx("h2", {
                        className: "task-subheading",
                        style: {
                            color: "var(--color-text-primary)"
                        },
                        children: "Keyboard Shortcuts"
                    }), e.jsx("p", {
                        className: "task-body-sm mt-0.5",
                        style: {
                            color: "var(--color-text-muted)"
                        },
                        children: "Controls for power users"
                    })]
                }), e.jsx("button", {
                    onClick: a,
                    "aria-label": "Close keyboard help",
                    className: "p-2 rounded-xl transition-all hover:bg-white/5",
                    style: {
                        color: "var(--color-text-muted)"
                    },
                    children: e.jsx(ie, {
                        className: "w-5 h-5"
                    })
                })]
            }), e.jsx("div", {
                className: "p-6 grid grid-cols-1 sm:grid-cols-2 gap-6",
                children: sa.map((o, r) => e.jsxs("div", {
                    children: [e.jsxs("div", {
                        className: "flex items-center gap-2 mb-3",
                        children: [e.jsx("div", {
                            className: "w-4 h-[2px] rounded-full",
                            style: {
                                background: "var(--color-accent, #f97316)",
                                opacity: .7
                            }
                        }), e.jsx("p", {
                            className: "text-[9px] font-bold uppercase tracking-[0.1em]",
                            style: {
                                color: "var(--color-text-muted)"
                            },
                            children: o.group
                        })]
                    }), e.jsx("div", {
                        className: "space-y-2",
                        children: o.items.map(m => e.jsxs("div", {
                            className: "flex items-center justify-between gap-3 py-0.5",
                            children: [e.jsx("span", {
                                className: "text-[12px]",
                                style: {
                                    color: "var(--color-text-secondary)"
                                },
                                children: m.action
                            }), e.jsx("div", {
                                className: "flex items-center gap-1 flex-shrink-0",
                                children: m.keys.map((u, i) => e.jsx("kbd", {
                                    className: "task-kbd",
                                    children: u
                                }, i))
                            })]
                        }, m.action))
                    })]
                }, o.group))
            }), e.jsx("div", {
                className: "px-6 py-3.5 border-t text-center",
                style: {
                    borderColor: "var(--color-border)",
                    background: "var(--color-bg)"
                },
                children: e.jsxs("p", {
                    className: "text-[11px]",
                    style: {
                        color: "var(--color-text-muted)"
                    },
                    children: ["Press ", e.jsx("kbd", {
                        className: "task-kbd",
                        children: "Esc"
                    }), " or click outside to close"]
                })
            })]
        })
    }),
    ra = ({
        undoStack: a,
        onUndo: o,
        onDismiss: r
    }) => e.jsx("div", {
        className: "fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-[500] pointer-events-none",
        children: e.jsx(X, {
            children: a.map(m => e.jsxs(N.div, {
                initial: {
                    opacity: 0,
                    y: 24,
                    scale: .88
                },
                animate: {
                    opacity: 1,
                    y: 0,
                    scale: 1
                },
                exit: {
                    opacity: 0,
                    y: -12,
                    scale: .9
                },
                transition: {
                    type: "spring",
                    stiffness: 420,
                    damping: 26
                },
                className: "flex items-center gap-3 pointer-events-auto px-4 py-3 rounded-2xl",
                style: {
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1)",
                    backdropFilter: "blur(20px)"
                },
                children: [e.jsx("span", {
                    className: "text-[13px] font-medium",
                    style: {
                        color: "var(--color-text-primary)"
                    },
                    children: m.label
                }), e.jsxs(N.button, {
                    whileHover: {
                        scale: 1.05
                    },
                    whileTap: {
                        scale: .95
                    },
                    onClick: () => o(m.id),
                    className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold",
                    style: {
                        background: "var(--color-accent, #f97316)",
                        color: "white",
                        boxShadow: "0 2px 8px var(--color-accent-ring, rgba(249,115,22,0.3))"
                    },
                    children: [e.jsx(bs, {
                        size: 11
                    }), "Undo"]
                }), e.jsx("button", {
                    onClick: () => r(m.id),
                    "aria-label": "Dismiss",
                    className: "p-1 rounded-lg transition-all",
                    style: {
                        color: "var(--color-text-muted)"
                    },
                    onMouseEnter: u => u.currentTarget.style.color = "var(--color-text-primary)",
                    onMouseLeave: u => u.currentTarget.style.color = "var(--color-text-muted)",
                    children: e.jsx(ie, {
                        size: 13
                    })
                })]
            }, m.id))
        })
    }),
    nt = {
        p1: {
            label: "Critical",
            icon: "🔴",
            color: "#ef4444",
            bg: "rgba(239,68,68,0.1)"
        },
        p2: {
            label: "High",
            icon: "🟠",
            color: "#f97316",
            bg: "rgba(249,115,22,0.1)"
        },
        p3: {
            label: "Medium",
            icon: "🔵",
            color: "#3b82f6",
            bg: "rgba(59,130,246,0.1)"
        },
        p4: {
            label: "Low",
            icon: "🟢",
            color: "#10b981",
            bg: "rgba(16,185,129,0.1)"
        }
    },
    pe = {
        backlog: {
            label: "Backlog",
            color: "#71717a",
            bg: "rgba(113,113,122,0.1)"
        },
        todo: {
            label: "To Do",
            color: "#f59e0b",
            bg: "rgba(245,158,11,0.1)"
        },
        "in-progress": {
            label: "In Progress",
            color: "#06b6d4",
            bg: "rgba(6,182,212,0.1)"
        },
        review: {
            label: "Review",
            color: "#8b5cf6",
            bg: "rgba(139,92,246,0.1)"
        },
        done: {
            label: "Done",
            color: "#10b981",
            bg: "rgba(16,185,129,0.1)"
        }
    },
    oa = ({
        taskId: a,
        onClose: o,
        accentColor: r,
        onUndo: m
    }) => {
        const u = Qe(),
            {
                tasks: i,
                updateTask: p,
                deleteTask: g,
                duplicateTask: L
            } = le(),
            {
                subjects: y,
                fetchSubjects: n
            } = Ie(),
            {
                generateTaskBreakdown: t,
                hasApiKey: b
            } = ft(),
            d = s.useMemo(() => i.find(l => l.id === a), [i, a]),
            [P, I] = s.useState(""),
            [S, O] = s.useState(""),
            [h, z] = s.useState("backlog"),
            [R, B] = s.useState("p3"),
            [C, W] = s.useState(""),
            [T, j] = s.useState(""),
            [x, H] = s.useState(30),
            [Q, D] = s.useState("medium"),
            [A, Z] = s.useState(""),
            [f, U] = s.useState("General"),
            [V, re] = s.useState(""),
            [J, w] = s.useState(""),
            [_, ee] = s.useState([]),
            [se, c] = s.useState("idle"),
            [E, te] = s.useState(!1),
            [ae, ne] = s.useState(""),
            [k, M] = s.useState(""),
            [K, Y] = s.useState(!1),
            [F, G] = s.useState("details"),
            [v, ye] = s.useState(!1),
            [ke, Nt] = s.useState(480),
            Ee = s.useRef(!1),
            Me = s.useRef(void 0),
            Ye = pt(S, "taskDescription");
        s.useEffect(() => {
            d && (I(d.title), O(d.description || ""), z(d.status), B(d.priority), W(d.releaseDate ? qe(d.releaseDate) : ""), j(d.dueDate ? qe(d.dueDate) : ""), H(d.effort), D(d.energy), Z(d.subjectId || ""), U(d.subject), re(d.chapterId || ""), w(d.topicId || ""), ee(d.subtasks || []))
        }, [a]), s.useEffect(() => {
            n()
        }, [n]);
        const Re = s.useMemo(() => y.find(l => l.id === A), [y, A]),
            De = Re ? Te(Re.color) : "#8b5cf6",
            St = s.useCallback(() => {
                d && (c("saving"), clearTimeout(Me.current), Me.current = setTimeout(async () => {
                    try {
                        await p(d.id, {
                            title: P.trim() || d.title,
                            description: S.trim() || void 0,
                            status: h,
                            priority: R,
                            releaseDate: C ? et(C) : void 0,
                            dueDate: T ? et(T) : d.dueDate,
                            effort: x,
                            energy: Q,
                            subjectId: A || void 0,
                            subject: f || "General",
                            chapterId: V || void 0,
                            topicId: J || void 0,
                            subtasks: _
                        }), c("saved"), setTimeout(() => c("idle"), 2e3)
                    } catch {
                        c("idle")
                    }
                }, 800))
            }, [d, P, S, h, R, C, T, x, Q, A, f, V, J, _, p]);
        s.useEffect(() => {
            if (d) return St(), () => clearTimeout(Me.current)
        }, [P, S, h, R, C, T, x, Q, A, f, V, J, _]), s.useEffect(() => {
            const l = $ => {
                $.key === "Escape" && o(), ($.metaKey || $.ctrlKey) && $.key === "Enter" && o()
            };
            return window.addEventListener("keydown", l), () => window.removeEventListener("keydown", l)
        }, [o]);
        const Ct = s.useCallback(l => {
            l.preventDefault(), Ee.current = !0;
            const $ = l.clientX,
                q = ke,
                oe = Mt => {
                    if (!Ee.current) return;
                    const Rt = $ - Mt.clientX;
                    Nt(Math.max(320, Math.min(700, q + Rt)))
                },
                Et = () => {
                    Ee.current = !1
                };
            return window.addEventListener("mousemove", oe), window.addEventListener("mouseup", Et, {
                once: !0
            }), () => {
                window.removeEventListener("mousemove", oe)
            }
        }, [ke]);
        if (!d) return null;
        const Le = _.filter(l => l.completed).length,
            ge = _.length,
            Ve = ge > 0 ? Le / ge * 100 : 0,
            Fe = T ? vt(T) : "normal",
            Tt = T ? jt(T) : "No due date",
            Xe = C ? Ke(C) : "",
            ce = !Se({
                releaseDate: C
            }) && d.status !== "done",
            Je = y.find(l => l.id === A),
            Dt = Je ?.chapters.find(l => l.id === V),
            zt = () => {
                ce || (u("/focus", {
                    state: {
                        taskId: d.id,
                        taskTitle: d.title,
                        duration: d.effort * 60
                    }
                }), o())
            },
            $t = async () => {
                const l = d.title,
                    $ = { ...d
                    };
                await g(d.id), m ?.(`Deleted "${l}"`, async () => {
                    await le.getState().addTask({
                        title: $.title,
                        subject: $.subject,
                        status: $.status,
                        priority: $.priority,
                        dueDate: $.dueDate,
                        effort: $.effort,
                        energy: $.energy,
                        releaseDate: $.releaseDate,
                        description: $.description,
                        subtasks: $.subtasks
                    })
                }), o()
            },
            It = async () => {
                await L(d.id, {
                    resetStatus: !0
                }), o()
            },
            At = l => {
                l ?.preventDefault(), ae.trim() && (ee($ => [...$, {
                    id: rt(),
                    title: ae.trim(),
                    completed: !1
                }]), ne(""))
            },
            Pt = async () => {
                if (!(!d.title || !k.trim() || !b)) {
                    te(!0);
                    try {
                        const $ = (await t(d.title, k, S)).map(q => ({
                            id: rt(),
                            title: q,
                            completed: !1
                        }));
                        ee(q => [...q, ...$]), M("")
                    } catch {} finally {
                        te(!1)
                    }
                }
            };
        return e.jsxs(e.Fragment, {
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
                onClick: o,
                className: "fixed inset-0 z-[350] md:hidden",
                style: {
                    background: "rgba(0,0,0,0.4)",
                    backdropFilter: "blur(4px)"
                }
            }), e.jsxs(N.aside, {
                role: "complementary",
                "aria-label": "Task detail",
                initial: {
                    x: "100%",
                    opacity: 0
                },
                animate: {
                    x: 0,
                    opacity: 1
                },
                exit: {
                    x: "100%",
                    opacity: 0
                },
                transition: {
                    type: "spring",
                    stiffness: 500,
                    damping: 50,
                    mass: .8
                },
                className: "task-detail-panel",
                style: {
                    width: `${ke}px`
                },
                children: [e.jsx("div", {
                    onMouseDown: Ct,
                    className: "absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize z-10 opacity-0 hover:opacity-100 transition-opacity",
                    style: {
                        background: r
                    }
                }), e.jsxs("div", {
                    className: "task-detail-header-tint relative px-6 pt-6 pb-4 flex-shrink-0",
                    style: {
                        "--subject-color-raw": Ks(De, .12)
                    },
                    children: [e.jsxs("div", {
                        className: "flex items-center justify-between mb-3",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [e.jsxs("div", {
                                className: "relative",
                                children: [e.jsxs("button", {
                                    onClick: () => ye(!v),
                                    className: "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all",
                                    style: {
                                        background: pe[h] ?.bg,
                                        color: pe[h] ?.color
                                    },
                                    children: [e.jsx("span", {
                                        className: "w-1.5 h-1.5 rounded-full",
                                        style: {
                                            background: pe[h] ?.color
                                        }
                                    }), pe[h] ?.label, e.jsx($e, {
                                        className: "w-3 h-3"
                                    })]
                                }), e.jsx(X, {
                                    children: v && e.jsx(N.div, {
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
                                        className: "absolute left-0 top-full mt-1 rounded-xl overflow-hidden z-50 py-1",
                                        style: {
                                            background: "var(--color-surface)",
                                            border: "1px solid var(--color-border)",
                                            boxShadow: "var(--shadow-4)",
                                            minWidth: "140px"
                                        },
                                        children: Object.keys(pe).map(l => e.jsxs("button", {
                                            onClick: () => {
                                                z(l), ye(!1)
                                            },
                                            className: "w-full flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-white/5 transition-colors",
                                            style: {
                                                color: pe[l] ?.color
                                            },
                                            children: [e.jsx("span", {
                                                className: "w-1.5 h-1.5 rounded-full",
                                                style: {
                                                    background: pe[l] ?.color
                                                }
                                            }), pe[l] ?.label, h === l && e.jsx(Ze, {
                                                className: "w-3 h-3 ml-auto"
                                            })]
                                        }, l))
                                    })
                                })]
                            }), se === "saving" && e.jsx("span", {
                                className: "task-saving text-xs",
                                style: {
                                    color: "var(--color-text-muted)"
                                },
                                children: "Saving…"
                            }), se === "saved" && e.jsx("span", {
                                className: "text-xs",
                                style: {
                                    color: "#10b981"
                                },
                                children: "✓ Saved"
                            })]
                        }), e.jsxs("div", {
                            className: "flex items-center gap-1",
                            children: [d.status !== "done" && e.jsxs("button", {
                                onClick: zt,
                                disabled: ce,
                                title: ce ? Xe : "Focus",
                                className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                                style: {
                                    background: ce ? "var(--color-bg)" : r,
                                    border: ce ? "1px solid var(--color-border)" : "1px solid transparent",
                                    color: ce ? "var(--color-text-muted)" : "white"
                                },
                                children: [ce ? e.jsx(he, {
                                    className: "w-3.5 h-3.5"
                                }) : e.jsx(Pe, {
                                    className: "w-3.5 h-3.5 fill-current"
                                }), ce ? "Locked" : "Focus"]
                            }), e.jsx("button", {
                                onClick: It,
                                "aria-label": "Duplicate task",
                                title: "Duplicate",
                                className: "p-2 rounded-lg transition-all hover:bg-white/10",
                                style: {
                                    color: "var(--color-text-muted)"
                                },
                                children: e.jsx(dt, {
                                    className: "w-4 h-4"
                                })
                            }), e.jsxs("div", {
                                className: "relative",
                                children: [e.jsx("button", {
                                    onClick: () => Y(!K),
                                    "aria-label": "Delete task",
                                    title: "Delete",
                                    className: "p-2 rounded-lg transition-all hover:bg-red-500/10 hover:text-red-400",
                                    style: {
                                        color: "var(--color-text-muted)"
                                    },
                                    children: e.jsx(We, {
                                        className: "w-4 h-4"
                                    })
                                }), e.jsx(X, {
                                    children: K && e.jsxs(N.div, {
                                        initial: {
                                            opacity: 0,
                                            scale: .9,
                                            y: -4
                                        },
                                        animate: {
                                            opacity: 1,
                                            scale: 1,
                                            y: 0
                                        },
                                        exit: {
                                            opacity: 0,
                                            scale: .9,
                                            y: -4
                                        },
                                        className: "absolute right-0 top-full mt-1 rounded-xl p-3 z-50 space-y-2",
                                        style: {
                                            background: "var(--color-surface)",
                                            border: "1px solid rgba(239,68,68,0.3)",
                                            boxShadow: "var(--shadow-4)",
                                            minWidth: "160px"
                                        },
                                        children: [e.jsx("p", {
                                            className: "text-xs font-medium",
                                            style: {
                                                color: "var(--color-text-primary)"
                                            },
                                            children: "Delete this task?"
                                        }), e.jsxs("div", {
                                            className: "flex gap-2",
                                            children: [e.jsx("button", {
                                                onClick: $t,
                                                className: "flex-1 py-1.5 rounded-lg text-xs font-bold transition-all",
                                                style: {
                                                    background: "#ef4444",
                                                    color: "white"
                                                },
                                                children: "Delete"
                                            }), e.jsx("button", {
                                                onClick: () => Y(!1),
                                                className: "flex-1 py-1.5 rounded-lg text-xs font-medium transition-all",
                                                style: {
                                                    background: "var(--color-bg)",
                                                    color: "var(--color-text-secondary)"
                                                },
                                                children: "Cancel"
                                            })]
                                        })]
                                    })
                                })]
                            }), e.jsx("button", {
                                onClick: o,
                                "aria-label": "Close panel",
                                title: "Close (Esc)",
                                className: "p-2 rounded-lg transition-all hover:bg-white/10",
                                style: {
                                    color: "var(--color-text-muted)"
                                },
                                children: e.jsx(ie, {
                                    className: "w-4 h-4"
                                })
                            })]
                        })]
                    }), e.jsx("input", {
                        type: "text",
                        value: P,
                        onChange: l => I(l.target.value),
                        maxLength: ue.taskTitle.maxChars,
                        className: "w-full bg-transparent border-none outline-none font-bold leading-tight mt-1",
                        style: {
                            fontSize: "1.25rem",
                            color: "var(--color-text-primary)",
                            letterSpacing: "-0.02em"
                        },
                        placeholder: "Task title",
                        "aria-label": "Task title"
                    }), e.jsx("div", {
                        className: "absolute bottom-0 left-0 right-0 h-[2px]",
                        style: {
                            background: `linear-gradient(to right, ${De}, ${De}44)`
                        }
                    })]
                }), e.jsx("div", {
                    className: "flex items-center gap-0.5 px-4 py-2 border-b flex-shrink-0",
                    style: {
                        borderColor: "var(--color-border)",
                        background: "var(--color-bg)"
                    },
                    children: [{
                        id: "details",
                        label: "Details",
                        icon: "📋"
                    }, {
                        id: "subtasks",
                        label: ge > 0 ? `Subtasks · ${Le}/${ge}` : "Subtasks",
                        icon: "✓"
                    }, {
                        id: "recurring",
                        label: "Recurrence",
                        icon: "🔁"
                    }].map(l => {
                        const $ = F === l.id;
                        return e.jsxs("button", {
                            onClick: () => G(l.id),
                            className: "relative px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all",
                            style: {
                                background: $ ? `${r}18` : "transparent",
                                color: $ ? r : "var(--color-text-muted)"
                            },
                            children: [l.label, $ && e.jsx(N.div, {
                                layoutId: "tab-indicator",
                                className: "absolute bottom-0 left-2 right-2 h-[2px] rounded-t-full",
                                style: {
                                    background: r
                                },
                                transition: {
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 30
                                }
                            })]
                        }, l.id)
                    })
                }), e.jsxs("div", {
                    className: "flex-1 overflow-y-auto tasks-scrollbar px-6 py-5 space-y-6",
                    children: [F === "details" && e.jsxs("div", {
                        className: "space-y-5",
                        children: [e.jsx(de, {
                            label: "Priority",
                            icon: fs,
                            children: e.jsx("div", {
                                className: "flex gap-1 p-1 rounded-xl",
                                style: {
                                    background: "var(--color-bg)",
                                    border: "1px solid var(--color-border)"
                                },
                                children: Object.keys(nt).map(l => {
                                    const $ = nt[l],
                                        q = R === l;
                                    return e.jsxs("button", {
                                        onClick: () => B(l),
                                        title: $.label,
                                        className: "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all",
                                        style: {
                                            background: q ? $.bg : "transparent",
                                            color: q ? $.color : "var(--color-text-muted)"
                                        },
                                        children: [e.jsx("span", {
                                            children: $.icon
                                        }), e.jsx("span", {
                                            className: "hidden sm:inline",
                                            children: $.label
                                        })]
                                    }, l)
                                })
                            })
                        }), e.jsx(de, {
                            label: "Due Date",
                            icon: Ce,
                            children: e.jsxs("div", {
                                className: "relative",
                                children: [e.jsx("input", {
                                    type: "date",
                                    value: T,
                                    onChange: l => j(l.target.value),
                                    className: "w-full px-4 py-2.5 rounded-xl text-sm border-none outline-none appearance-none",
                                    style: {
                                        background: "var(--color-bg)",
                                        border: "1px solid var(--color-border)",
                                        color: "var(--color-text-primary)"
                                    }
                                }), T && e.jsx("span", {
                                    className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold pointer-events-none",
                                    style: {
                                        color: Fe === "overdue" ? "#ef4444" : Fe === "today" ? "#f97316" : Fe === "soon" ? "#f59e0b" : "var(--color-text-muted)"
                                    },
                                    children: Tt
                                })]
                            })
                        }), e.jsx(de, {
                            label: "Release Date",
                            icon: he,
                            children: e.jsxs("div", {
                                className: "relative",
                                children: [e.jsx("input", {
                                    type: "date",
                                    value: C,
                                    onChange: l => W(l.target.value),
                                    className: "w-full px-4 py-2.5 rounded-xl text-sm border-none outline-none appearance-none",
                                    style: {
                                        background: "var(--color-bg)",
                                        border: "1px solid var(--color-border)",
                                        color: "var(--color-text-primary)"
                                    }
                                }), C && e.jsx("span", {
                                    className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold pointer-events-none",
                                    style: {
                                        color: ce ? "#6366f1" : "#10b981"
                                    },
                                    children: Xe
                                })]
                            })
                        }), e.jsx(de, {
                            label: "Subject",
                            icon: ys,
                            children: e.jsxs("div", {
                                className: "relative",
                                children: [e.jsxs("select", {
                                    value: A,
                                    onChange: l => {
                                        Z(l.target.value);
                                        const $ = y.find(q => q.id === l.target.value);
                                        U($ ?.name || "General"), re(""), w("")
                                    },
                                    className: "w-full appearance-none px-4 py-2.5 pr-8 rounded-xl text-sm border-none outline-none cursor-pointer",
                                    style: {
                                        background: "var(--color-bg)",
                                        border: "1px solid var(--color-border)",
                                        color: "var(--color-text-primary)"
                                    },
                                    children: [e.jsx("option", {
                                        value: "",
                                        children: "Select Subject"
                                    }), y.map(l => e.jsx("option", {
                                        value: l.id,
                                        children: l.name
                                    }, l.id)), e.jsx("option", {
                                        value: "",
                                        children: "General"
                                    })]
                                }), Re && e.jsx("span", {
                                    className: "absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full pointer-events-none",
                                    style: {
                                        background: De
                                    }
                                }), e.jsx($e, {
                                    className: "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none",
                                    style: {
                                        color: "var(--color-text-muted)"
                                    }
                                })]
                            })
                        }), A && e.jsxs("div", {
                            className: "grid grid-cols-2 gap-3",
                            children: [e.jsx(de, {
                                label: "Chapter",
                                icon: gs,
                                children: e.jsxs("select", {
                                    value: V,
                                    onChange: l => {
                                        re(l.target.value), w("")
                                    },
                                    className: "w-full appearance-none px-3 py-2 rounded-xl text-sm cursor-pointer",
                                    style: {
                                        background: "var(--color-bg)",
                                        border: "1px solid var(--color-border)",
                                        color: "var(--color-text-primary)"
                                    },
                                    children: [e.jsx("option", {
                                        value: "",
                                        children: "Select"
                                    }), [...Je ?.chapters || []].sort((l, $) => (l.order ?? 0) - ($.order ?? 0)).map(l => e.jsx("option", {
                                        value: l.id,
                                        children: l.title
                                    }, l.id))]
                                })
                            }), e.jsx(de, {
                                label: "Topic",
                                icon: vs,
                                children: e.jsxs("select", {
                                    value: J,
                                    onChange: l => w(l.target.value),
                                    disabled: !V,
                                    className: "w-full appearance-none px-3 py-2 rounded-xl text-sm cursor-pointer disabled:opacity-50",
                                    style: {
                                        background: "var(--color-bg)",
                                        border: "1px solid var(--color-border)",
                                        color: "var(--color-text-primary)"
                                    },
                                    children: [e.jsx("option", {
                                        value: "",
                                        children: "Select"
                                    }), [...Dt ?.topics || []].sort((l, $) => (l.order ?? 0) - ($.order ?? 0)).map(l => e.jsx("option", {
                                        value: l.id,
                                        children: l.title
                                    }, l.id))]
                                })
                            })]
                        }), e.jsxs(de, {
                            label: `Duration · ${be(x)}`,
                            icon: je,
                            children: [e.jsx("input", {
                                type: "number",
                                min: 5,
                                step: 5,
                                value: x,
                                onChange: l => H(Math.max(5, Number(l.target.value) || 5)),
                                className: "w-full px-3 py-2 rounded-xl text-sm font-semibold outline-none",
                                style: {
                                    background: "var(--color-bg)",
                                    border: "1px solid var(--color-border)",
                                    color: "var(--color-text-primary)"
                                },
                                "aria-label": "Duration in minutes"
                            }), e.jsxs("div", {
                                className: "flex justify-between mt-1",
                                children: [e.jsx("span", {
                                    className: "text-xs",
                                    style: {
                                        color: "var(--color-text-muted)"
                                    },
                                    children: "5 min"
                                }), e.jsx("span", {
                                    className: "text-xs",
                                    style: {
                                        color: "var(--color-text-muted)"
                                    },
                                    children: "No upper limit"
                                })]
                            })]
                        }), e.jsx(de, {
                            label: "Energy Level",
                            icon: Ae,
                            children: e.jsx("div", {
                                className: "flex gap-1 p-1 rounded-xl",
                                style: {
                                    background: "var(--color-bg)",
                                    border: "1px solid var(--color-border)"
                                },
                                children: ["high", "medium", "low"].map(l => {
                                    const $ = {
                                            high: "⚡ High",
                                            medium: "〜 Medium",
                                            low: "💤 Low"
                                        },
                                        q = {
                                            high: "#f59e0b",
                                            medium: "#3b82f6",
                                            low: "#71717a"
                                        },
                                        oe = Q === l;
                                    return e.jsx("button", {
                                        onClick: () => D(l),
                                        className: "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                                        style: {
                                            background: oe ? `${q[l]}20` : "transparent",
                                            color: oe ? q[l] : "var(--color-text-muted)"
                                        },
                                        children: $[l]
                                    }, l)
                                })
                            })
                        }), e.jsxs(de, {
                            label: "Notes",
                            icon: js,
                            children: [e.jsx("textarea", {
                                value: S,
                                onChange: l => O(l.target.value),
                                placeholder: "Add details, notes, or context…",
                                rows: 4,
                                className: "w-full px-4 py-3 rounded-xl text-sm resize-none border-none outline-none",
                                style: {
                                    background: "var(--color-bg)",
                                    border: "1px solid var(--color-border)",
                                    color: "var(--color-text-primary)"
                                }
                            }), e.jsx("p", {
                                className: `text-xs ${Ye?.tone==="danger"?"text-amber-500":"text-zinc-500"}`,
                                children: Ye ?.message || `${S.length}/${ue.taskDescription.maxChars} local chars. First ${mt("taskDescription","cloud")} sync to cloud.`
                            })]
                        }), d.totalFocusTime && d.totalFocusTime > 0 ? e.jsxs("div", {
                            className: "flex items-center gap-3 px-4 py-3 rounded-xl",
                            style: {
                                background: `${r}10`,
                                border: `1px solid ${r}20`
                            },
                            children: [e.jsx(je, {
                                className: "w-4 h-4",
                                style: {
                                    color: r
                                }
                            }), e.jsxs("span", {
                                className: "text-sm",
                                style: {
                                    color: "var(--color-text-secondary)"
                                },
                                children: [e.jsx("strong", {
                                    style: {
                                        color: r
                                    },
                                    children: be(d.totalFocusTime)
                                }), " ", "focused on this task"]
                            })]
                        }) : null]
                    }), F === "subtasks" && e.jsxs("div", {
                        className: "space-y-4",
                        children: [ge > 0 && e.jsxs("div", {
                            className: "space-y-2",
                            children: [e.jsxs("div", {
                                className: "flex justify-between",
                                children: [e.jsxs("span", {
                                    className: "task-caption",
                                    style: {
                                        color: "var(--color-text-muted)"
                                    },
                                    children: [Le, "/", ge, " completed"]
                                }), e.jsxs("span", {
                                    className: "task-caption font-semibold",
                                    style: {
                                        color: r
                                    },
                                    children: [Math.round(Ve), "%"]
                                })]
                            }), e.jsx("div", {
                                className: "h-1.5 rounded-full overflow-hidden",
                                style: {
                                    background: "var(--color-bg)",
                                    border: "1px solid var(--color-border)"
                                },
                                children: e.jsx(N.div, {
                                    className: "h-full rounded-full",
                                    style: {
                                        background: r
                                    },
                                    initial: {
                                        width: 0
                                    },
                                    animate: {
                                        width: `${Ve}%`
                                    },
                                    transition: {
                                        duration: .5,
                                        ease: [.16, 1, .3, 1]
                                    }
                                })
                            })]
                        }), e.jsx("div", {
                            className: "space-y-1.5",
                            children: e.jsx(X, {
                                children: _.map(l => e.jsxs(N.div, {
                                    initial: {
                                        opacity: 0,
                                        x: -8
                                    },
                                    animate: {
                                        opacity: 1,
                                        x: 0
                                    },
                                    exit: {
                                        opacity: 0,
                                        x: 8,
                                        height: 0
                                    },
                                    className: "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                                    style: {
                                        background: "var(--color-bg)",
                                        border: "1px solid var(--color-border)"
                                    },
                                    children: [e.jsx(Ue, {
                                        checked: l.completed,
                                        onChange: $ => ee(q => q.map(oe => oe.id === l.id ? { ...oe,
                                            completed: $
                                        } : oe)),
                                        size: "sm",
                                        accentColor: r
                                    }), e.jsx("input", {
                                        type: "text",
                                        value: l.title,
                                        onChange: $ => ee(q => q.map(oe => oe.id === l.id ? { ...oe,
                                            title: $.target.value
                                        } : oe)),
                                        maxLength: ue.subtaskTitle.maxChars,
                                        className: "flex-1 bg-transparent border-none outline-none text-sm",
                                        style: {
                                            color: l.completed ? "var(--color-text-disabled)" : "var(--color-text-primary)",
                                            textDecoration: l.completed ? "line-through" : "none"
                                        }
                                    }), e.jsx("button", {
                                        onClick: () => ee($ => $.filter(q => q.id !== l.id)),
                                        "aria-label": "Delete subtask",
                                        className: "opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-500/10",
                                        style: {
                                            color: "#ef4444"
                                        },
                                        children: e.jsx(ie, {
                                            className: "w-3.5 h-3.5"
                                        })
                                    })]
                                }, l.id))
                            })
                        }), e.jsxs("form", {
                            onSubmit: At,
                            className: "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                            style: {
                                background: "var(--color-bg)",
                                border: "1px dashed var(--color-border)"
                            },
                            children: [e.jsx(fe, {
                                className: "w-4 h-4 flex-shrink-0",
                                style: {
                                    color: "var(--color-text-muted)"
                                }
                            }), e.jsx("input", {
                                type: "text",
                                value: ae,
                                onChange: l => ne(l.target.value),
                                placeholder: "Add a subtask…",
                                maxLength: ue.subtaskTitle.maxChars,
                                className: "flex-1 bg-transparent border-none outline-none text-sm",
                                style: {
                                    color: "var(--color-text-primary)"
                                }
                            }), ae.trim() && e.jsx("button", {
                                type: "submit",
                                style: {
                                    color: r
                                },
                                children: e.jsx(ut, {
                                    className: "w-4 h-4"
                                })
                            })]
                        }), e.jsxs("div", {
                            className: "rounded-xl p-4 space-y-3",
                            style: {
                                background: "var(--color-bg)",
                                border: "1px solid var(--color-border)"
                            },
                            children: [e.jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [e.jsx(Oe, {
                                    className: "w-4 h-4",
                                    style: {
                                        color: "#f59e0b"
                                    }
                                }), e.jsx("span", {
                                    className: "text-xs font-bold",
                                    style: {
                                        color: "var(--color-text-secondary)"
                                    },
                                    children: "AI Subtask Generator"
                                })]
                            }), e.jsx("textarea", {
                                value: k,
                                onChange: l => M(l.target.value),
                                placeholder: "Paste notes, chapter outline, or topic list for AI to convert into subtasks…",
                                maxLength: ue.taskDescription.maxChars,
                                rows: 3,
                                className: "w-full px-3 py-2 rounded-lg text-sm resize-none border-none outline-none",
                                style: {
                                    background: "var(--color-surface)",
                                    border: "1px solid var(--color-border)",
                                    color: "var(--color-text-primary)"
                                }
                            }), e.jsxs("button", {
                                onClick: Pt,
                                disabled: E || !P.trim() || !k.trim() || !b,
                                className: "w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50",
                                style: {
                                    background: "#f59e0b18",
                                    color: "#f59e0b",
                                    border: "1px solid #f59e0b30"
                                },
                                children: [E ? e.jsx(ks, {
                                    className: "w-4 h-4 animate-spin"
                                }) : e.jsx(Oe, {
                                    className: "w-4 h-4"
                                }), E ? "Generating…" : b ? "Generate Subtasks" : "Add AI key in settings"]
                            })]
                        })]
                    }), F === "recurring" && e.jsxs("div", {
                        className: "space-y-4",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-3 p-4 rounded-xl",
                            style: {
                                background: "var(--color-bg)",
                                border: "1px solid var(--color-border)"
                            },
                            children: [e.jsx(it, {
                                className: "w-4 h-4",
                                style: {
                                    color: "var(--color-text-muted)"
                                }
                            }), e.jsxs("div", {
                                children: [e.jsx("p", {
                                    className: "text-sm font-semibold",
                                    style: {
                                        color: "var(--color-text-primary)"
                                    },
                                    children: d.isRecurring ? "✅ Recurring Task" : "Not a recurring task"
                                }), d.isRecurring && d.recurringConfig && e.jsxs("p", {
                                    className: "text-xs mt-0.5",
                                    style: {
                                        color: "var(--color-text-muted)"
                                    },
                                    children: ["Repeats ", d.recurringConfig.recurrenceType, " ·", " ", d.recurringConfig.occurrencesCreated || 1, " instances created"]
                                })]
                            })]
                        }), e.jsx("p", {
                            className: "text-sm",
                            style: {
                                color: "var(--color-text-muted)"
                            },
                            children: "Recurrence settings can be configured when creating a new task. To change this task's recurrence, duplicate it with new settings."
                        })]
                    })]
                })]
            }, "task-panel")]
        })
    },
    de = ({
        label: a,
        icon: o,
        children: r
    }) => e.jsxs("div", {
        className: "space-y-1.5",
        children: [e.jsxs("label", {
            className: "flex items-center gap-1.5",
            style: {
                color: "var(--color-text-muted)",
                fontSize: "10px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em"
            },
            children: [e.jsx(o, {
                size: 11
            }), a]
        }), r]
    }),
    ze = ["📚", "💪", "🧘", "🏃", "💧", "🥗", "😴", "✍️", "🎯", "🔥", "⏰", "🎨", "🎵", "🧠", "💻", "📖"],
    la = [{
        value: 0,
        label: "Sun"
    }, {
        value: 1,
        label: "Mon"
    }, {
        value: 2,
        label: "Tue"
    }, {
        value: 3,
        label: "Wed"
    }, {
        value: 4,
        label: "Thu"
    }, {
        value: 5,
        label: "Fri"
    }, {
        value: 6,
        label: "Sat"
    }],
    na = ({
        isOpen: a,
        onClose: o,
        habitToEdit: r
    }) => {
        const {
            addHabit: m,
            updateHabit: u,
            deleteHabit: i
        } = bt(), [p, g] = s.useState(!1), [L, y] = s.useState(!1), [n, t] = s.useState({}), [b, d] = s.useState(""), [P, I] = s.useState(ze[0]), [S, O] = s.useState("daily"), [h, z] = s.useState([1, 2, 3, 4, 5]), R = pt(b, "habitName");
        Ft.useEffect(() => {
            if (a) {
                if (r) {
                    d(r.name), I(r.icon || ze[0]), O(r.frequency || "daily"), z(r.frequency === "weekly" && r.targetDays ?.length ? [...r.targetDays].sort() : [1, 2, 3, 4, 5]), y(!1), t({});
                    return
                }
                d(""), I(ze[0]), O("daily"), z([1, 2, 3, 4, 5]), y(!1), t({})
            }
        }, [r, a]);
        const B = () => {
                const j = {};
                return b.trim() || (j.name = "Habit name is required"), b.trim().length < 2 && (j.name = "Habit name must be at least 2 characters"), S === "weekly" && h.length === 0 && (j.targetDays = "Select at least one day for weekly habits"), t(j), Object.keys(j).length === 0
            },
            C = async j => {
                if (j.preventDefault(), !!B()) {
                    g(!0);
                    try {
                        r ? await u(r.id, {
                            name: b.trim(),
                            icon: P,
                            frequency: S,
                            targetDays: S === "weekly" ? h : void 0
                        }) : await m(b.trim(), P, S, h), o()
                    } catch (x) {
                        console.error("Failed to save habit:", x), t({
                            submit: "Failed to save habit. Please try again."
                        })
                    } finally {
                        g(!1)
                    }
                }
            },
            W = async () => {
                if (r) {
                    y(!0);
                    try {
                        await i(r.id), o()
                    } catch (j) {
                        console.error("Failed to delete habit:", j), t({
                            submit: "Failed to delete habit. Please try again."
                        })
                    } finally {
                        y(!1)
                    }
                }
            },
            T = j => {
                h.includes(j) ? z(h.filter(x => x !== j)) : z([...h, j].sort())
            };
        return e.jsx(X, {
            children: a && e.jsxs(e.Fragment, {
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
                    onClick: o,
                    className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                }), e.jsx(N.div, {
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
                    className: "fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none",
                    children: e.jsxs("div", {
                        className: "bg-white dark:bg-[#0e0e11] rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden pointer-events-auto border border-zinc-200 dark:border-white/10",
                        onClick: j => j.stopPropagation(),
                        children: [e.jsxs("div", {
                            className: "flex items-center justify-between p-6 border-b border-zinc-200 dark:border-white/10",
                            children: [e.jsxs("div", {
                                children: [e.jsxs("h2", {
                                    className: "text-2xl font-display font-bold text-zinc-900 dark:text-white flex items-center gap-2",
                                    children: [r ? e.jsx(Be, {
                                        className: "w-6 h-6 text-emerald-500"
                                    }) : e.jsx(st, {
                                        className: "w-6 h-6 text-emerald-500"
                                    }), r ? "Edit Habit" : "Create New Habit"]
                                }), e.jsx("p", {
                                    className: "text-sm text-zinc-500 dark:text-zinc-400 mt-1",
                                    children: r ? "Update your habit schedule and tracking rules" : "Build consistency with daily tracking"
                                })]
                            }), e.jsx("button", {
                                onClick: o,
                                className: "p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-full transition-colors",
                                children: e.jsx(ie, {
                                    className: "w-5 h-5 text-zinc-400"
                                })
                            })]
                        }), e.jsxs("form", {
                            onSubmit: C,
                            className: "p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)] custom-scrollbar",
                            children: [e.jsxs("div", {
                                children: [e.jsx("label", {
                                    className: "block text-sm font-bold text-zinc-900 dark:text-white mb-2",
                                    children: "Habit Name *"
                                }), e.jsx("input", {
                                    type: "text",
                                    value: b,
                                    onChange: j => d(j.target.value),
                                    placeholder: "e.g., Morning Study Session, Daily Exercise",
                                    maxLength: ue.habitName.maxChars,
                                    className: `w-full px-4 py-3 bg-zinc-50 dark:bg-black/40 border ${n.name?"border-red-500":"border-zinc-200 dark:border-white/10"} rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 text-zinc-900 dark:text-white`,
                                    autoFocus: !0
                                }), n.name && e.jsx("p", {
                                    className: "text-red-500 text-xs mt-1",
                                    children: n.name
                                }), e.jsx("p", {
                                    className: `mt-1 text-xs ${R?.tone==="danger"?"text-amber-500":"text-zinc-500"}`,
                                    children: R ?.message || `${b.length}/${ue.habitName.maxChars} chars. Habit names sync fully up to ${mt("habitName","cloud")} chars.`
                                })]
                            }), e.jsxs("div", {
                                children: [e.jsx("label", {
                                    className: "block text-sm font-bold text-zinc-900 dark:text-white mb-3",
                                    children: "Choose Icon"
                                }), e.jsx("div", {
                                    className: "grid grid-cols-8 gap-2",
                                    children: ze.map((j, x) => e.jsx("button", {
                                        type: "button",
                                        onClick: () => I(j),
                                        className: `aspect-square text-2xl flex items-center justify-center rounded-xl border-2 transition-all ${P===j?"border-emerald-500 bg-emerald-500/10 scale-110":"border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 bg-zinc-50 dark:bg-black/40"}`,
                                        children: j
                                    }, x))
                                })]
                            }), e.jsxs("div", {
                                children: [e.jsxs("label", {
                                    className: "block text-sm font-bold text-zinc-900 dark:text-white mb-3 flex items-center gap-2",
                                    children: [e.jsx(Ce, {
                                        className: "w-4 h-4"
                                    }), "Frequency"]
                                }), e.jsxs("div", {
                                    className: "grid grid-cols-2 gap-3",
                                    children: [e.jsxs("button", {
                                        type: "button",
                                        onClick: () => O("daily"),
                                        className: `p-4 rounded-xl border-2 transition-all ${S==="daily"?"border-emerald-500 bg-emerald-500/10":"border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 bg-zinc-50 dark:bg-black/40"}`,
                                        children: [e.jsx("div", {
                                            className: "text-2xl mb-2",
                                            children: "📅"
                                        }), e.jsx("div", {
                                            className: `text-sm font-bold ${S==="daily"?"text-emerald-600 dark:text-emerald-400":"text-zinc-600 dark:text-zinc-400"}`,
                                            children: "Daily"
                                        }), e.jsx("div", {
                                            className: "text-xs text-zinc-500 dark:text-zinc-400 mt-1",
                                            children: "Every day"
                                        })]
                                    }), e.jsxs("button", {
                                        type: "button",
                                        onClick: () => O("weekly"),
                                        className: `p-4 rounded-xl border-2 transition-all ${S==="weekly"?"border-emerald-500 bg-emerald-500/10":"border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 bg-zinc-50 dark:bg-black/40"}`,
                                        children: [e.jsx("div", {
                                            className: "text-2xl mb-2",
                                            children: "📆"
                                        }), e.jsx("div", {
                                            className: `text-sm font-bold ${S==="weekly"?"text-emerald-600 dark:text-emerald-400":"text-zinc-600 dark:text-zinc-400"}`,
                                            children: "Weekly"
                                        }), e.jsx("div", {
                                            className: "text-xs text-zinc-500 dark:text-zinc-400 mt-1",
                                            children: "Specific days"
                                        })]
                                    })]
                                })]
                            }), S === "weekly" && e.jsxs("div", {
                                children: [e.jsx("label", {
                                    className: "block text-sm font-bold text-zinc-900 dark:text-white mb-3",
                                    children: "Target Days *"
                                }), e.jsx("div", {
                                    className: "flex gap-2",
                                    children: la.map(j => e.jsx("button", {
                                        type: "button",
                                        onClick: () => T(j.value),
                                        className: `flex-1 py-2 rounded-lg border-2 text-xs font-bold transition-all ${h.includes(j.value)?"border-emerald-500 bg-emerald-500 text-white":"border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20 bg-zinc-50 dark:bg-black/40"}`,
                                        children: j.label
                                    }, j.value))
                                }), n.targetDays && e.jsx("p", {
                                    className: "text-red-500 text-xs mt-1",
                                    children: n.targetDays
                                })]
                            }), e.jsxs("div", {
                                className: "p-6 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-black border border-zinc-200 dark:border-zinc-800",
                                children: [e.jsx("p", {
                                    className: "text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3",
                                    children: "Preview"
                                }), e.jsxs("div", {
                                    className: "flex items-center gap-4",
                                    children: [e.jsx("div", {
                                        className: "w-12 h-12 rounded-xl bg-white dark:bg-[#0e0e11] border border-zinc-200 dark:border-white/10 flex items-center justify-center text-2xl",
                                        children: P
                                    }), e.jsxs("div", {
                                        className: "flex-1",
                                        children: [e.jsx("div", {
                                            className: "text-sm font-bold text-zinc-900 dark:text-white",
                                            children: b || "Habit Name"
                                        }), e.jsx("div", {
                                            className: "text-xs text-zinc-500 dark:text-zinc-400 mt-1",
                                            children: S === "daily" ? "🔥 Daily habit" : `📆 ${h.length} days/week`
                                        })]
                                    }), e.jsxs("div", {
                                        className: "text-right",
                                        children: [e.jsx("div", {
                                            className: "text-2xl font-display font-bold text-emerald-600 dark:text-emerald-400",
                                            children: "0"
                                        }), e.jsx("div", {
                                            className: "text-xs text-zinc-500 dark:text-zinc-400",
                                            children: "day streak"
                                        })]
                                    })]
                                })]
                            }), n.submit && e.jsx("div", {
                                className: "p-3 bg-red-500/10 border border-red-500/20 rounded-xl",
                                children: e.jsx("p", {
                                    className: "text-red-600 dark:text-red-400 text-sm",
                                    children: n.submit
                                })
                            })]
                        }), e.jsxs("div", {
                            className: "flex items-center justify-between gap-3 p-6 border-t border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/20",
                            children: [e.jsx("div", {
                                children: r && e.jsxs("button", {
                                    type: "button",
                                    onClick: W,
                                    className: "px-5 py-3 rounded-xl font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
                                    disabled: p || L,
                                    children: [L ? e.jsx("div", {
                                        className: "w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin"
                                    }) : e.jsx(We, {
                                        className: "w-4 h-4"
                                    }), L ? "Deleting..." : "Delete Habit"]
                                })
                            }), e.jsxs("div", {
                                className: "flex items-center gap-3",
                                children: [e.jsx("button", {
                                    type: "button",
                                    onClick: o,
                                    className: "px-6 py-3 rounded-xl font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors",
                                    disabled: p || L,
                                    children: "Cancel"
                                }), e.jsx("button", {
                                    onClick: C,
                                    disabled: p || L,
                                    className: "px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
                                    children: p ? e.jsxs(e.Fragment, {
                                        children: [e.jsx("div", {
                                            className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                                        }), r ? "Saving..." : "Creating..."]
                                    }) : e.jsxs(e.Fragment, {
                                        children: [r ? e.jsx(Be, {
                                            className: "w-4 h-4"
                                        }) : e.jsx(st, {
                                            className: "w-4 h-4"
                                        }), r ? "Save Habit" : "Create Habit"]
                                    })
                                })]
                            })]
                        })]
                    })
                })]
            })
        })
    },
    xe = a => {
        const o = a / 60;
        return `${o%1===0?o.toFixed(0):o.toFixed(1)}h`
    },
    ia = () => {
        const {
            dailyInsights: a,
            generateDailyInsight: o
        } = ft(), {
            tasks: r
        } = le(), {
            profile: m
        } = ht(), {
            sessions: u
        } = Ht(), i = Array.isArray(r) ? r : [], p = Array.isArray(u) ? u : [], g = Hs({
            tasks: i,
            sessions: p,
            profile: m
        }), L = async () => {
            const y = new Date,
                n = Bt(m ?.studyPreferences),
                t = i.filter(x => x.status !== "done" && !x.deletedAt),
                b = t.filter(x => x.status === "backlog").length,
                d = t.filter(x => x.status === "todo").length,
                P = t.filter(x => x.status === "in-progress").length,
                I = t.filter(x => x.priority === "p1").slice(0, 5).map(x => {
                    const H = x.dueDate ? me(x.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric"
                    }) : "No due date";
                    let Q = `- ${x.title} (Due: ${H})`;
                    if (x.effort && (Q += ` [${x.effort} min duration]`), x.energy && (Q += ` [${x.energy} energy]`), x.subtasks && x.subtasks.length > 0) {
                        const D = x.subtasks.filter(A => A.completed).length;
                        Q += ` (${D}/${x.subtasks.length} subtasks)`
                    }
                    return Q
                }).join(`
`),
                S = t.filter(x => x.dueDate && Ne(x.dueDate, y, n) < 0).length,
                O = t.filter(x => x.dueDate && Ot(x.dueDate, y, n)).length,
                h = t.filter(x => {
                    if (!x.dueDate) return !1;
                    const H = Ne(x.dueDate, y, n);
                    return H > 0 && H <= 7
                }).length,
                z = p.filter(x => {
                    if (!x.completed || x.deletedAt) return !1;
                    const H = Ne(x.startTime, y, n);
                    return H <= 0 && H >= -6
                }),
                R = z.reduce((x, H) => x + H.duration, 0),
                B = z.length > 0 ? Math.round(z.reduce((x, H) => x + H.efficiency, 0) / z.length) : 0,
                C = {};
            t.forEach(x => {
                x.subject && (C[x.subject] = (C[x.subject] || 0) + 1)
            });
            const W = Object.entries(C).map(([x, H]) => `${x}: ${H} tasks`).join(", "),
                j = `Analyze my current task backlog and suggest a "Plan of Attack" for today.
${`
Current Task State:
- Backlog: ${b} | Todo: ${d} | In Progress: ${P}
- Overdue: ${S} | Due Today: ${O} | Due This Week: ${h}
- Total Active: ${t.length}

High Priority (P1) Tasks:
${I||"None"}

Tasks by Subject: ${W||"None specified"}

Recent Study Pattern (Last 7 Days):
- Total Study: ${be(R,"minutes")}
- Avg Efficiency: ${B}%
- Sessions: ${z.length}

User Goal: ${m?.studyPreferences?.dailyGoalHours||6} hours/day study.
${g.isConfigured?`Weekly Capacity:
- Capacity: ${g.capacityHours}h
- Already logged: ${xe(g.loggedMinutes)}
- Due-this-week task duration: ${xe(g.plannedMinutes)}
- Projected weekly load: ${xe(g.projectedMinutes)}
- Capacity status: ${g.isOverCapacity?`OVER by ${xe(g.overloadMinutes)}`:`${xe(g.remainingMinutes)} remaining`}`:""}
`}

Output format:
**The Critical 3**: The 3 absolute must-do tasks today based on priority/deadlines.
**Batching Strategy**: Suggest how to group smaller tasks by subject/energy level.
**Reality Check**: One sentence on if my workload is realistic vs my goal.
**Energy Matching**: Match high-energy tasks to appropriate times based on my energy tags.

Be direct, concise, and strategic. If the workload is unrealistic, call it out clearly and tell me what to cut, defer, or sequence first. If task data is sparse, say so and suggest the best next planning action inside the task system.`;
            await o("taskPlanner", j, "/tasks")
        };
        return e.jsxs("div", {
            className: "mb-0",
            children: [g.isConfigured && e.jsx("div", {
                className: `mb-4 rounded-2xl border p-4 ${g.isOverCapacity?"border-rose-500/20 bg-rose-500/5":"border-emerald-500/20 bg-emerald-500/5"}`,
                children: e.jsxs("div", {
                    className: "flex items-start gap-3",
                    children: [e.jsx("div", {
                        className: `mt-0.5 rounded-lg p-2 ${g.isOverCapacity?"bg-rose-500/10 text-rose-500":"bg-emerald-500/10 text-emerald-500"}`,
                        children: e.jsx(ws, {
                            className: "w-4 h-4"
                        })
                    }), e.jsxs("div", {
                        className: "flex-1",
                        children: [e.jsxs("div", {
                            className: "flex items-center justify-between gap-3",
                            children: [e.jsx("h3", {
                                className: "font-semibold text-zinc-900 dark:text-white",
                                children: "Weekly Capacity Check"
                            }), e.jsxs("span", {
                                className: `text-sm font-bold ${g.isOverCapacity?"text-rose-500":"text-emerald-500"}`,
                                children: [g.utilizationPercent, "% planned"]
                            })]
                        }), e.jsxs("p", {
                            className: "mt-1 text-sm text-zinc-600 dark:text-zinc-300",
                            children: [xe(g.loggedMinutes), " logged +", " ", xe(g.plannedMinutes), " still due this week against a", " ", g.capacityHours, "h capacity."]
                        }), e.jsx("p", {
                            className: "mt-1 text-xs text-zinc-500 dark:text-zinc-400",
                            children: g.isOverCapacity ? `You are overloaded by ${xe(g.overloadMinutes)}. The AI planner will factor this into its plan of attack.` : `${xe(g.remainingMinutes)} remain before you hit your current weekly cap.`
                        })]
                    })]
                })
            }), e.jsx(Os, {
                cardId: "taskPlanner",
                title: "AI Tactical Planner",
                subtitle: "Turn your backlog into a battle plan",
                icon: at,
                onAnalyze: L,
                analysisContent: a ?.taskPlanner ?.content,
                glowColor: "emerald",
                emptyState: e.jsxs("div", {
                    className: "text-center",
                    children: [e.jsx(at, {
                        className: "w-8 h-8 mx-auto mb-2 opacity-50 text-emerald-400"
                    }), e.jsx("p", {
                        className: "text-sm text-zinc-500",
                        children: "Overwhelmed by tasks? Let AI prioritize your day."
                    })]
                })
            })]
        })
    },
    ca = [{
        id: "board",
        icon: Ns,
        label: "Board",
        shortcut: "2"
    }, {
        id: "table",
        icon: Ss,
        label: "List",
        shortcut: "1"
    }, {
        id: "zen",
        icon: Ae,
        label: "Zen",
        shortcut: "Z"
    }, {
        id: "eisenhower",
        icon: Cs,
        label: "Matrix",
        shortcut: "3"
    }],
    da = [{
        value: "priority",
        label: "Priority"
    }, {
        value: "dueDate",
        label: "Due Date"
    }, {
        value: "created",
        label: "Date Created"
    }, {
        value: "title",
        label: "Title"
    }, {
        value: "status",
        label: "Status"
    }],
    Fa = ({
        isDark: a,
        toggleTheme: o
    }) => {
        const {
            isPerformanceMode: r
        } = Es(), {
            view: m,
            setView: u,
            addTask: i,
            checkRecurringTasks: p,
            tasks: g
        } = le(), {
            isPremium: L
        } = Ms(), {
            profile: y
        } = ht(), n = y ?.personalization ?.accentColor || "#f97316", t = Us(), [b, d] = s.useState("Tasks"), [P, I] = s.useState(!1), [S, O] = s.useState(!1), [h, z] = s.useState(!1), [R, B] = s.useState(null), [C, W] = s.useState(!1), [T, j] = s.useState(!1), [x, H] = s.useState(!1), [Q, D] = s.useState(!1), A = s.useRef(null), Z = s.useRef(null), f = s.useRef(null);
        s.useEffect(() => {
            document.documentElement.style.setProperty("--color-accent", n)
        }, [n]), s.useEffect(() => {
            p()
        }, [p]), s.useEffect(() => {
            m === "calendar" && u("board")
        }, [m, u]), s.useEffect(() => {
            const c = y ?.workflowPreferences ?.taskOrganizationStyle;
            !c || f.current === c || (Bs(c, {
                setView: u,
                setSortBy: t.setSortBy,
                setGroupBy: t.setGroupBy
            }), f.current = c)
        }, [y ?.workflowPreferences ?.taskOrganizationStyle, u, t.setGroupBy, t.setSortBy]), s.useEffect(() => {
            const c = E => {
                Z.current && !Z.current.contains(E.target) && W(!1)
            };
            return C && document.addEventListener("mousedown", c), () => document.removeEventListener("mousedown", c)
        }, [C]), s.useEffect(() => {
            const c = E => {
                const te = E.target;
                if (!(te.tagName === "INPUT" || te.tagName === "TEXTAREA" || te.isContentEditable)) {
                    if (E.key === "?") {
                        E.preventDefault(), t.setShowKeyboardHelp(!0);
                        return
                    }
                    if (E.key === "Escape") {
                        if (t.showKeyboardHelp) {
                            t.setShowKeyboardHelp(!1);
                            return
                        }
                        if (t.openPanelTaskId) {
                            t.closePanel();
                            return
                        }
                        if (C) {
                            W(!1);
                            return
                        }
                    }
                    if (E.key === "n" || E.key === "N") {
                        E.preventDefault(), O(!0);
                        return
                    }
                    if (E.key === "f" || E.key === "F") {
                        E.preventDefault(), A.current ?.focus();
                        return
                    }
                    if (E.key === "z" || E.key === "Z") {
                        u("zen");
                        return
                    }
                    if (E.key === "1") {
                        u("table");
                        return
                    }
                    if (E.key === "2") {
                        u("board");
                        return
                    }
                    if (E.key === "3") {
                        u("eisenhower");
                        return
                    }
                    if ((E.metaKey || E.ctrlKey) && E.key === "z") {
                        E.preventDefault();
                        const ae = t.undoStack[t.undoStack.length - 1];
                        ae && t.executeUndo(ae.id)
                    }
                }
            };
            return window.addEventListener("keydown", c), () => window.removeEventListener("keydown", c)
        }, [t, u, C]);
        const U = s.useCallback(c => {
                if (!c.trim()) return;
                const E = c.match(/!p([1-4])/),
                    te = E ? `p${E[1]}` : "p4",
                    ae = c.match(/#(\w+)/),
                    ne = ae ? ae[1] : "General",
                    k = c.replace(/!p[1-4]/, "").replace(/#\w+/, "").trim();
                i({
                    title: k || "New Task",
                    subject: ne,
                    status: "backlog",
                    priority: te,
                    dueDate: new Date().toISOString(),
                    effort: 30,
                    energy: "medium",
                    description: "",
                    subtasks: []
                })
            }, [i]),
            V = s.useCallback(c => {
                t.openPanel(c.id)
            }, [t]),
            re = s.useCallback(c => {
                B(c ?? null), z(!0)
            }, []),
            J = s.useCallback(() => {
                z(!1), B(null)
            }, []),
            w = t.applyFiltersAndSort(g),
            _ = t.filters.length > 0 || t.searchQuery.trim().length > 0,
            ee = w.length,
            se = g.filter(c => !c.deletedAt).length;
        return e.jsxs("div", {
            className: `h-screen flex overflow-hidden ${a?"dark":""}`,
            style: {
                background: "var(--color-bg, #f4f4f5)"
            },
            "data-density": t.density,
            children: [e.jsx(X, {
                children: t.isOffline && e.jsx(N.div, {
                    initial: {
                        y: -40,
                        opacity: 0
                    },
                    animate: {
                        y: 0,
                        opacity: 1
                    },
                    exit: {
                        y: -40,
                        opacity: 0
                    },
                    className: "task-offline-banner fixed top-0 left-0 right-0 z-[500] text-center text-sm py-2 px-4 font-medium",
                    children: "📡 You're offline — changes will sync when reconnected"
                })
            }), e.jsx(Rs, {
                activeTab: b,
                setActiveTab: d,
                isDark: a,
                toggleTheme: o,
                mobileMenuOpen: P,
                setMobileMenuOpen: I
            }), e.jsxs("main", {
                className: "flex-1 relative flex flex-col h-screen overflow-hidden",
                style: {
                    background: "var(--color-bg, #f4f4f5)"
                },
                children: [!r && e.jsxs("div", {
                    className: "fixed inset-0 z-0 pointer-events-none overflow-hidden",
                    children: [e.jsx("div", {
                        className: "absolute top-[-15%] left-[-5%] w-[600px] h-[600px] rounded-full blur-[120px]",
                        style: {
                            background: `${n}08`
                        }
                    }), e.jsx("div", {
                        className: "absolute bottom-[-15%] right-[-5%] w-[500px] h-[500px] rounded-full blur-[100px]",
                        style: {
                            background: "#10b98108"
                        }
                    })]
                }), e.jsx(Ls, {
                    activeTab: b,
                    mobileMenuOpen: P,
                    setMobileMenuOpen: I,
                    onSubmit: U,
                    searchPlaceholder: "Add task… (e.g. 'Study Waves !p1 #Physics')"
                }), e.jsx("div", {
                    className: "flex-1 overflow-y-auto tasks-scrollbar z-10",
                    children: e.jsxs("div", {
                        className: "density-app-width w-full px-3 sm:px-4 md:px-6 pt-3 safe-bottom",
                        children: [e.jsxs("div", {
                            className: "sticky top-0 z-[200] rounded-2xl mb-3 overflow-visible",
                            style: {
                                background: "var(--color-surface-overlay)",
                                backdropFilter: "blur(24px) saturate(1.8)",
                                WebkitBackdropFilter: "blur(24px) saturate(1.8)",
                                border: "1px solid var(--color-border)",
                                boxShadow: "0 2px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)"
                            },
                            children: [e.jsxs("div", {
                                className: "flex flex-wrap items-center gap-2 px-3 py-2",
                                children: [e.jsxs("div", {
                                    className: "flex min-w-0 items-center gap-2 flex-shrink-0",
                                    children: [e.jsx("span", {
                                        className: "text-sm font-bold tracking-tight",
                                        style: {
                                            color: "var(--color-text-primary)",
                                            letterSpacing: "-0.01em"
                                        },
                                        children: "Tasks"
                                    }), L() && e.jsx(Fs, {
                                        size: "sm"
                                    }), e.jsx("span", {
                                        className: "px-1.5 py-0.5 rounded-full text-[10px] font-bold tabular-nums",
                                        style: {
                                            background: n + "18",
                                            color: n,
                                            border: `1px solid ${n}28`
                                        },
                                        children: _ ? `${ee}/${se}` : se
                                    })]
                                }), e.jsx("div", {
                                    className: "hidden sm:block w-px h-5 flex-shrink-0",
                                    style: {
                                        background: "var(--color-border)"
                                    }
                                }), e.jsx("div", {
                                    className: "flex items-center p-0.5 rounded-xl gap-0.5 flex-shrink-0",
                                    style: {
                                        background: "var(--color-bg)",
                                        border: "1px solid var(--color-border)"
                                    },
                                    role: "tablist",
                                    children: ca.map(c => {
                                        const E = m === c.id;
                                        return e.jsxs("button", {
                                            role: "tab",
                                            "aria-selected": E,
                                            onClick: () => u(c.id),
                                            title: `${c.label} (${c.shortcut})`,
                                            className: "relative flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors whitespace-nowrap",
                                            style: {
                                                color: E ? n : "var(--color-text-muted)"
                                            },
                                            children: [E && e.jsx(N.div, {
                                                layoutId: "taskViewIndicator",
                                                className: "absolute inset-0 rounded-lg",
                                                style: {
                                                    background: n + "16",
                                                    boxShadow: `0 0 0 1px ${n}28`
                                                },
                                                transition: {
                                                    type: "spring",
                                                    stiffness: 500,
                                                    damping: 40
                                                }
                                            }), e.jsxs("span", {
                                                className: "relative z-10 flex items-center gap-1",
                                                children: [e.jsx(c.icon, {
                                                    size: 12
                                                }), e.jsx("span", {
                                                    className: "hidden sm:inline",
                                                    children: c.label
                                                })]
                                            })]
                                        }, c.id)
                                    })
                                }), e.jsx("div", {
                                    className: "hidden lg:block flex-1"
                                }), e.jsxs(N.div, {
                                    animate: {
                                        boxShadow: T ? `0 0 0 2px ${n}28` : "none"
                                    },
                                    className: "flex items-center gap-1.5 rounded-xl px-2.5 h-8 transition-all",
                                    style: {
                                        background: "var(--color-bg)",
                                        border: `1px solid ${T?n+"60":"var(--color-border)"}`,
                                        width: T ? "min(100%, 220px)" : "min(100%, 140px)",
                                        flex: "1 1 11rem",
                                        transition: "width 0.2s ease, border-color 0.15s ease"
                                    },
                                    children: [e.jsx(Ts, {
                                        size: 12,
                                        style: {
                                            color: "var(--color-text-muted)",
                                            flexShrink: 0
                                        }
                                    }), e.jsx("input", {
                                        ref: A,
                                        type: "text",
                                        value: t.searchQuery,
                                        onChange: c => t.setSearchQuery(c.target.value),
                                        onFocus: () => j(!0),
                                        onBlur: () => j(!1),
                                        placeholder: "Search…",
                                        "aria-label": "Search tasks",
                                        className: "flex-1 bg-transparent border-none outline-none text-xs min-w-0",
                                        style: {
                                            color: "var(--color-text-primary)"
                                        }
                                    }), t.searchQuery && e.jsx("button", {
                                        onClick: () => t.setSearchQuery(""),
                                        "aria-label": "Clear search",
                                        children: e.jsx(ie, {
                                            size: 11,
                                            style: {
                                                color: "var(--color-text-muted)"
                                            }
                                        })
                                    })]
                                }), e.jsxs("div", {
                                    className: "relative flex-shrink-0",
                                    ref: Z,
                                    children: [e.jsxs("button", {
                                        onClick: () => W(c => !c),
                                        title: "Sort & Group",
                                        className: "flex items-center gap-1 px-2.5 h-8 rounded-xl text-[11px] font-semibold transition-all",
                                        style: {
                                            background: C ? n : "var(--color-bg)",
                                            border: "1px solid var(--color-border)",
                                            color: C ? "white" : "var(--color-text-secondary)"
                                        },
                                        children: [e.jsx(Ds, {
                                            size: 12
                                        }), e.jsx("span", {
                                            className: "hidden sm:inline",
                                            children: "Sort"
                                        }), t.groupBy !== "none" && e.jsxs("span", {
                                            className: "hidden sm:inline",
                                            style: {
                                                color: C ? "white" : n
                                            },
                                            children: ["· ", t.groupBy]
                                        })]
                                    }), e.jsx(X, {
                                        children: C && e.jsxs(N.div, {
                                            initial: {
                                                opacity: 0,
                                                scale: .95,
                                                y: -6
                                            },
                                            animate: {
                                                opacity: 1,
                                                scale: 1,
                                                y: 0
                                            },
                                            exit: {
                                                opacity: 0,
                                                scale: .95,
                                                y: -6
                                            },
                                            transition: {
                                                duration: .12,
                                                ease: [.16, 1, .3, 1]
                                            },
                                            className: "absolute right-0 top-full mt-2 w-[min(13rem,calc(100vw-1.5rem))] rounded-2xl overflow-hidden z-[300] p-1.5",
                                            style: {
                                                background: "var(--color-surface)",
                                                border: "1px solid var(--color-border)",
                                                boxShadow: "var(--shadow-4)"
                                            },
                                            children: [e.jsx("p", {
                                                className: "text-[9px] font-bold uppercase tracking-widest px-2.5 py-1.5",
                                                style: {
                                                    color: "var(--color-text-muted)"
                                                },
                                                children: "Sort By"
                                            }), da.map(c => e.jsxs("button", {
                                                onClick: () => {
                                                    t.sortBy === c.value ? t.setSortDir(t.sortDir === "asc" ? "desc" : "asc") : (t.setSortBy(c.value), t.setSortDir("asc"))
                                                },
                                                className: "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-all",
                                                style: {
                                                    background: t.sortBy === c.value ? `${n}14` : "transparent",
                                                    color: t.sortBy === c.value ? n : "var(--color-text-secondary)"
                                                },
                                                children: [c.label, t.sortBy === c.value && e.jsx("span", {
                                                    className: "text-xs opacity-70",
                                                    children: t.sortDir === "asc" ? "↑" : "↓"
                                                })]
                                            }, c.value)), e.jsx("div", {
                                                className: "border-t my-1.5 mx-1",
                                                style: {
                                                    borderColor: "var(--color-border)"
                                                }
                                            }), e.jsx("p", {
                                                className: "text-[9px] font-bold uppercase tracking-widest px-2.5 py-1.5",
                                                style: {
                                                    color: "var(--color-text-muted)"
                                                },
                                                children: "Group By"
                                            }), ["none", "status", "priority", "subject"].map(c => e.jsxs("button", {
                                                onClick: () => t.setGroupBy(c),
                                                className: "w-full flex items-center px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-all capitalize",
                                                style: {
                                                    background: t.groupBy === c ? `${n}14` : "transparent",
                                                    color: t.groupBy === c ? n : "var(--color-text-secondary)"
                                                },
                                                children: [c === "none" ? "No grouping" : `By ${c}`, t.groupBy === c && e.jsx("span", {
                                                    className: "ml-auto text-xs",
                                                    children: "✓"
                                                })]
                                            }, c))]
                                        })
                                    })]
                                }), e.jsxs("button", {
                                    onClick: () => {
                                        const c = ["compact", "default", "comfortable"],
                                            E = c.indexOf(t.density);
                                        t.setDensity(c[(E + 1) % c.length])
                                    },
                                    title: `Density: ${t.density}`,
                                    className: "flex items-center gap-1 px-2.5 h-8 rounded-xl text-[11px] font-semibold transition-all flex-shrink-0",
                                    style: {
                                        background: "var(--color-bg)",
                                        border: "1px solid var(--color-border)",
                                        color: "var(--color-text-secondary)"
                                    },
                                    children: [t.density === "compact" && e.jsx(zs, {
                                        size: 12
                                    }), t.density === "default" && e.jsx($s, {
                                        size: 12
                                    }), t.density === "comfortable" && e.jsx(Is, {
                                        size: 12
                                    }), e.jsx("span", {
                                        className: "hidden md:inline capitalize",
                                        children: t.density
                                    })]
                                }), m === "board" && e.jsx("div", {
                                    className: "items-center gap-0.5 hidden sm:flex flex-shrink-0",
                                    children: [75, 100, 125].map(c => e.jsxs("button", {
                                        onClick: () => t.setKanbanZoom(c),
                                        className: "px-2 h-8 rounded-lg text-[11px] font-bold transition-all",
                                        style: {
                                            background: t.kanbanZoom === c ? n : "var(--color-bg)",
                                            border: "1px solid var(--color-border)",
                                            color: t.kanbanZoom === c ? "white" : "var(--color-text-secondary)"
                                        },
                                        children: [c, "%"]
                                    }, c))
                                }), e.jsxs("button", {
                                    onClick: () => H(c => !c),
                                    title: "Daily habits",
                                    className: "flex items-center gap-1 px-2.5 h-8 rounded-xl text-[11px] font-semibold transition-all flex-shrink-0",
                                    style: {
                                        background: x ? n + "18" : "var(--color-bg)",
                                        border: `1px solid ${x?n+"40":"var(--color-border)"}`,
                                        color: x ? n : "var(--color-text-muted)"
                                    },
                                    children: [e.jsx(As, {
                                        size: 12
                                    }), e.jsx("span", {
                                        className: "hidden md:inline",
                                        children: "Habits"
                                    })]
                                }), e.jsxs("button", {
                                    onClick: () => D(c => !c),
                                    title: "AI Task Planner",
                                    className: "flex items-center gap-1 px-2.5 h-8 rounded-xl text-[11px] font-semibold transition-all flex-shrink-0",
                                    style: {
                                        background: Q ? n + "18" : "var(--color-bg)",
                                        border: `1px solid ${Q?n+"40":"var(--color-border)"}`,
                                        color: Q ? n : "var(--color-text-muted)"
                                    },
                                    children: [e.jsx(Oe, {
                                        size: 12
                                    }), e.jsx("span", {
                                        className: "hidden md:inline",
                                        children: "AI"
                                    })]
                                }), e.jsx("button", {
                                    onClick: () => t.setShowKeyboardHelp(!0),
                                    "aria-label": "Keyboard shortcuts",
                                    title: "Keyboard shortcuts (?)",
                                    className: "flex items-center justify-center w-8 h-8 rounded-xl transition-all flex-shrink-0",
                                    style: {
                                        background: "var(--color-bg)",
                                        border: "1px solid var(--color-border)",
                                        color: "var(--color-text-muted)"
                                    },
                                    children: e.jsx(Ps, {
                                        size: 12
                                    })
                                }), e.jsx("div", {
                                    className: "w-px h-5 flex-shrink-0 hidden sm:block",
                                    style: {
                                        background: "var(--color-border)"
                                    }
                                }), e.jsxs(N.button, {
                                    onClick: () => O(!0),
                                    whileHover: {
                                        scale: 1.04
                                    },
                                    whileTap: {
                                        scale: .96
                                    },
                                    className: "hidden sm:flex items-center gap-1.5 px-3 h-8 rounded-xl text-[11px] font-bold text-white flex-shrink-0",
                                    style: {
                                        background: n,
                                        boxShadow: `0 2px 10px ${n}40`
                                    },
                                    children: [e.jsx(fe, {
                                        size: 13,
                                        strokeWidth: 2.5
                                    }), "New Task"]
                                })]
                            }), e.jsx(X, {
                                children: (t.filters.length > 0 || _) && e.jsx(N.div, {
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
                                    className: "overflow-hidden",
                                    children: e.jsxs("div", {
                                        className: "flex flex-wrap items-center gap-1.5 px-3 pb-2 pt-0",
                                        children: [e.jsx("span", {
                                            className: "text-[10px] font-bold uppercase tracking-wider",
                                            style: {
                                                color: "var(--color-text-muted)"
                                            },
                                            children: "Filtered:"
                                        }), t.filters.map(c => e.jsxs(N.button, {
                                            initial: {
                                                opacity: 0,
                                                scale: .85
                                            },
                                            animate: {
                                                opacity: 1,
                                                scale: 1
                                            },
                                            exit: {
                                                opacity: 0,
                                                scale: .85
                                            },
                                            onClick: () => t.removeFilter(c.key, c.value),
                                            className: "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold hover:opacity-70 transition-opacity",
                                            style: {
                                                background: `${n}18`,
                                                border: `1px solid ${n}30`,
                                                color: n
                                            },
                                            children: [c.label, e.jsx(ie, {
                                                size: 9
                                            })]
                                        }, `${c.key}-${c.value}`)), t.searchQuery && e.jsxs("span", {
                                            className: "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold",
                                            style: {
                                                background: `${n}18`,
                                                border: `1px solid ${n}30`,
                                                color: n
                                            },
                                            children: ['"', t.searchQuery, '"', e.jsx("button", {
                                                onClick: () => t.setSearchQuery(""),
                                                children: e.jsx(ie, {
                                                    size: 9
                                                })
                                            })]
                                        }), e.jsx("button", {
                                            onClick: t.clearFilters,
                                            className: "text-[10px] font-medium ml-1 hover:opacity-70 transition-opacity",
                                            style: {
                                                color: "var(--color-text-muted)"
                                            },
                                            children: "Clear all"
                                        })]
                                    })
                                })
                            })]
                        }), e.jsx(X, {
                            children: x && e.jsx(N.div, {
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
                                    duration: .2,
                                    ease: [.16, 1, .3, 1]
                                },
                                className: "overflow-hidden mb-3",
                                children: e.jsx(qs, {
                                    onAddHabit: () => re(),
                                    onEditHabit: c => re(c)
                                })
                            })
                        }), e.jsx(X, {
                            children: Q && e.jsx(N.div, {
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
                                    duration: .2,
                                    ease: [.16, 1, .3, 1]
                                },
                                className: "overflow-hidden mb-3",
                                children: e.jsx(ia, {})
                            })
                        }), e.jsx(X, {
                            mode: "wait",
                            children: e.jsxs(N.div, {
                                initial: {
                                    opacity: 0,
                                    y: 6
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                exit: {
                                    opacity: 0,
                                    y: -6
                                },
                                transition: {
                                    duration: .15,
                                    ease: [.16, 1, .3, 1]
                                },
                                children: [m === "board" && e.jsx(Qs, {
                                    onTaskClick: V,
                                    filteredTasks: w,
                                    zoom: t.kanbanZoom,
                                    accentColor: n
                                }), m === "table" && e.jsx(Vs, {
                                    onTaskClick: V,
                                    filteredTasks: w,
                                    density: t.density,
                                    groupBy: t.groupBy,
                                    accentColor: n
                                }), m === "zen" && e.jsx(Js, {
                                    onTaskClick: V,
                                    filteredTasks: w,
                                    accentColor: n
                                }), m === "eisenhower" && e.jsx(ta, {
                                    onTaskClick: V,
                                    accentColor: n
                                })]
                            }, m)
                        }), e.jsx("div", {
                            className: "w-full mt-8 pointer-events-none select-none overflow-hidden leading-none",
                            children: e.jsx("div", {
                                className: "text-[10vw] sm:text-[14vw] md:text-[18vw] lg:text-[20vw] xl:text-[22vw] font-display font-bold text-black/[0.03] dark:text-white/[0.03] whitespace-nowrap text-center tracking-tight",
                                children: "ISOTOPEAI"
                            })
                        })]
                    })
                }), e.jsx(N.button, {
                    onClick: () => O(!0),
                    initial: {
                        scale: 0,
                        opacity: 0
                    },
                    animate: {
                        scale: 1,
                        opacity: 1
                    },
                    transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 22,
                        delay: .3
                    },
                    whileHover: {
                        scale: 1.1
                    },
                    whileTap: {
                        scale: .9
                    },
                    "aria-label": "Create new task",
                    title: "New task (N)",
                    className: "md:hidden fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[max(1.5rem,env(safe-area-inset-right))] w-14 h-14 rounded-2xl text-white flex items-center justify-center z-40 shadow-2xl",
                    style: {
                        background: n,
                        boxShadow: `0 8px 28px ${n}55, 0 2px 8px ${n}30`
                    },
                    children: e.jsx(N.div, {
                        whileHover: {
                            rotate: 90
                        },
                        transition: {
                            duration: .2
                        },
                        children: e.jsx(fe, {
                            size: 24,
                            strokeWidth: 2.5
                        })
                    })
                }), e.jsx(X, {
                    children: t.selectedTaskIds.size > 0 && e.jsx(xa, {
                        selectedCount: t.selectedTaskIds.size,
                        selectedIds: Array.from(t.selectedTaskIds),
                        onClear: t.clearSelection
                    })
                }), e.jsx(X, {
                    children: t.openPanelTaskId && e.jsx(oa, {
                        taskId: t.openPanelTaskId,
                        onClose: t.closePanel,
                        accentColor: n,
                        onUndo: t.pushUndo
                    })
                }), e.jsx(ss, {
                    isOpen: S && !t.openPanelTaskId,
                    onClose: () => O(!1)
                }), e.jsx(na, {
                    isOpen: h,
                    onClose: J,
                    habitToEdit: R
                }), e.jsx(X, {
                    children: t.showKeyboardHelp && e.jsx(aa, {
                        onClose: () => t.setShowKeyboardHelp(!1)
                    })
                }), e.jsx(ra, {
                    undoStack: t.undoStack,
                    onUndo: t.executeUndo,
                    onDismiss: t.dismissUndo
                })]
            })]
        })
    },
    xa = ({
        selectedCount: a,
        selectedIds: o,
        onClear: r
    }) => {
        const {
            deleteTask: m,
            moveTask: u
        } = le();
        return e.jsxs(N.div, {
            initial: {
                y: 100,
                opacity: 0
            },
            animate: {
                y: 0,
                opacity: 1
            },
            exit: {
                y: 100,
                opacity: 0
            },
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 40
            },
            className: "task-bulk-bar fixed bottom-[max(7rem,calc(env(safe-area-inset-bottom)+5.5rem))] left-1/2 -translate-x-1/2 flex max-w-[calc(100vw-1.5rem)] flex-wrap items-center justify-center gap-2 px-4 sm:px-5 py-3 rounded-2xl z-[410]",
            children: [e.jsxs("span", {
                className: "text-sm font-semibold",
                style: {
                    color: "var(--color-text-primary)"
                },
                children: [a, " selected"]
            }), e.jsx("div", {
                className: "w-px h-4",
                style: {
                    background: "var(--color-border)"
                }
            }), e.jsx("button", {
                onClick: () => {
                    o.forEach(i => u(i, "done")), r()
                },
                className: "text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-80",
                style: {
                    background: "#10b98118",
                    color: "#10b981"
                },
                children: "✓ Complete"
            }), e.jsx("button", {
                onClick: () => {
                    window.confirm(`Delete ${a} tasks?`) && (o.forEach(i => m(i)), r())
                },
                className: "text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-80",
                style: {
                    background: "#ef444418",
                    color: "#ef4444"
                },
                children: "🗑 Delete"
            }), e.jsx("button", {
                onClick: r,
                "aria-label": "Cancel selection",
                children: e.jsx(ie, {
                    className: "w-4 h-4",
                    style: {
                        color: "var(--color-text-muted)"
                    }
                })
            })]
        })
    };
export {
    Fa as
    default
};