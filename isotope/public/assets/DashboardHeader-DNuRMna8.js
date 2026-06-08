const __vite__mapDeps = (i, m = __vite__mapDeps, d = (m.f || (m.f = ["assets/ToolsModal-BMUG81iV.js", "assets/vendor-react-BfU3Zn2J.js", "assets/App-pJGjDiPw.js", "assets/index-BPYJFSVW.js", "assets/index-CrO6t5EW.css", "assets/vendor-supabase-DAiUAuun.js", "assets/vendor-motion-Cp_NPzpZ.js", "assets/vendor-icons-CqruUz7g.js", "assets/vendor-router-CmoTwRnm.js", "assets/useAIStore-B2cv1FZz.js", "assets/useFocusStore-CX_Nyp1h.js", "assets/useNotificationStore-BS4df28T.js"]))) => i.map(i => d[i]);
import {
    j as e,
    r as d,
    f as we,
    b as wt
} from "./vendor-react-BfU3Zn2J.js";
import {
    T as Te,
    S as yt,
    O as jt,
    H as vt
} from "./HeadwayUpdatesButton-DUh668tJ.js";
import {
    d as nt,
    p as it,
    e as ot,
    f as lt,
    h as ie,
    _ as kt,
    $ as Nt,
    u as de,
    t as ct,
    c as St
} from "./App-pJGjDiPw.js";
import {
    h as he,
    u as He,
    j as Re,
    k as zt,
    f as Ct,
    g as ge,
    p as Ne
} from "./useFocusStore-CX_Nyp1h.js";
import {
    a as se
} from "./timeFormat-CMPo-BX2.js";
import {
    A as D,
    m as h
} from "./vendor-motion-Cp_NPzpZ.js";
import {
    u as be,
    s as Tt
} from "./useAIStore-B2cv1FZz.js";
import {
    M as It
} from "./MarkdownRenderer-CIV1x0Uq.js";
import {
    X as Fe,
    S as dt,
    aP as ht,
    bM as ut,
    w as $t,
    T as xt,
    aC as Pt,
    Z as ye,
    h as We,
    i as Mt,
    aE as At,
    M as Et,
    P as Lt,
    az as Ot,
    bN as _t,
    A as qt,
    ai as Ht,
    B as Rt,
    bO as Ft,
    b4 as Bt,
    ak as Dt,
    bs as Qt,
    U as Ut,
    al as Wt,
    b0 as Ge,
    b1 as Ve,
    x as Ke,
    bP as Gt,
    bQ as Vt,
    bR as Kt,
    C as Yt,
    a as Ye,
    aG as Je,
    f as Ze,
    am as Xe,
    b2 as Jt,
    b3 as Se,
    aD as et,
    aR as Zt,
    bS as Xt,
    bn as es,
    bT as ts,
    aa as ss,
    bU as as,
    bj as _e
} from "./vendor-icons-CqruUz7g.js";
import {
    u as Be,
    b as rs,
    L as ns
} from "./vendor-router-CmoTwRnm.js";
import {
    _ as is
} from "./index-BPYJFSVW.js";
import {
    u as ze
} from "./useSyncStore-vWs_TdIc.js";
import {
    u as qe,
    N as fe
} from "./useNotificationStore-BS4df28T.js";
import {
    I as tt
} from "./IsotopeLogoIcon-oPk5Ru-_.js";
const st = nt()(it(s => ({
        collapsedCards: {},
        setCollapsed: (n, a) => s(o => ({
            collapsedCards: { ...o.collapsedCards,
                [n]: a
            }
        })),
        toggleCollapsed: n => s(a => ({
            collapsedCards: { ...a.collapsedCards,
                [n]: !(a.collapsedCards[n] ?? !1)
            }
        })),
        clearCardPreference: n => s(a => {
            const o = { ...a.collapsedCards
            };
            return delete o[n], {
                collapsedCards: o
            }
        })
    }), {
        name: "ai-insight-ui",
        storage: ot(() => lt)
    })),
    os = nt()(it((s, n) => ({
        isPinned: !1,
        isHovered: !1,
        showPauseModal: !1,
        showCompleteModal: !1,
        setIsPinned: a => s({
            isPinned: a
        }),
        setIsHovered: a => s({
            isHovered: a
        }),
        togglePinned: () => s({
            isPinned: !n().isPinned
        }),
        setShowPauseModal: a => s({
            showPauseModal: a
        }),
        setShowCompleteModal: a => s({
            showCompleteModal: a
        })
    }), {
        name: "sidebar-storage",
        storage: ot(() => lt),
        partialize: s => ({
            isHovered: s.isHovered
        })
    })),
    ls = s => e.jsx(h.div, { ...s
    }),
    cs = s => e.jsx(D, { ...s
    }),
    at = s => {
        const n = s.questionsAttempted && s.questionsAttempted > 0 ? Math.round((s.questionsCorrect || 0) / s.questionsAttempted * 100) : null,
            a = Math.round((s.totalPauseTime || 0) / 60);
        let o = "This session gave you usable momentum, but the real win is turning it into the next focused rep.";
        s.efficiency >= 85 ? o = "This was a strong session—your focus held up, so protect the same conditions for the next block instead of resetting from scratch." : s.efficiency < 60 && (o = "Your focus was unstable this session, so the next win is reducing friction before you start another block.");
        const l = [];
        return n !== null && (n < 70 ? l.push(`review the missed questions first because ${n}% accuracy means speed without correction will reinforce mistakes`) : l.push(`log the pattern behind your ${n}% accuracy so you can repeat what worked`)), a >= 10 && l.push(`tighten your break plan because ${a} minutes of pauses likely broke momentum`), s.completedTaskIds && s.completedTaskIds.length === 0 && l.push("pick one concrete task or question set before restarting so the next session has a sharper finish line"), l.length === 0 && l.push("write down the exact first 10 minutes of your next session so you restart with less hesitation"), `**Coach read:** ${o}

**Next rep:** ${l[0]}.`
    },
    ds = ({
        sessionData: s,
        onClose: n
    }) => {
        const {
            hasApiKey: a,
            getDirectCompletion: o
        } = be(), {
            sessions: l
        } = he(), {
            subjects: f
        } = He(), {
            tasks: j
        } = Re(), [u, k] = d.useState(null), [N, A] = d.useState(!0), m = we.useRef(!1);
        return d.useEffect(() => {
            (async () => {
                if (!a || m.current) return;
                m.current = !0;
                const z = r => f.find(v => v.id === r) ?.name || r,
                    L = r => {
                        for (const v of f) {
                            const H = v.chapters ?.find(w => w.id === r);
                            if (H) return H.title
                        }
                        return r
                    },
                    C = r => {
                        for (const v of f)
                            for (const H of v.chapters || []) {
                                const w = H.topics ?.find(R => R.id === r);
                                if (w) return w.title
                            }
                        return r
                    },
                    P = r => j.find(v => v.id === r) ?.title || r,
                    M = s.subjects ?.map(z).join(", ") || "N/A",
                    O = s.chapters ?.map(L).join(", ") || "N/A",
                    B = s.topics ?.map(C).join(", ") || "N/A",
                    _ = s.tasks ?.map(P).join(", ") || "None",
                    T = s.mode || "manual",
                    U = T === "pomodoro" ? "Pomodoro timer" : T === "stopwatch" ? "Stopwatch" : "Manual log",
                    W = T === "pomodoro" && !!s.plannedDuration && s.plannedDuration > 0,
                    c = s.pauseLogs && s.pauseLogs.length > 0 ? `
- Breaks: ${s.pauseLogs.length} breaks (Total ${se(s.totalPauseTime||0,"seconds")})
  - Break Reasons: ${s.pauseLogs.map(r=>`${r.reason} (${se(r.duration,"seconds")})`).join(", ")}` : `
- Breaks: None`;
                let q = "";
                if (s.questionsAttempted && s.questionsAttempted > 0) {
                    const r = Math.round((s.questionsCorrect || 0) / s.questionsAttempted * 100);
                    if (q = `
- Questions: ${s.questionsAttempted} attempted (${s.questionsCorrect} correct, ${s.questionsIncorrect} incorrect, ${s.questionsSkipped} skipped). Accuracy: ${r}%`, s.questionsBySubject) {
                        const v = Object.entries(s.questionsBySubject).map(([H, w]) => {
                            const R = z(H),
                                F = w.attempted > 0 ? Math.round(w.correct / w.attempted * 100) : 0;
                            return `${R}: ${w.attempted} q, ${F}% acc`
                        }).join(", ");
                        q += `
  - By Subject: ${v}`
                    }
                }
                let I = "";
                if (W) {
                    const r = Math.round(s.duration / s.plannedDuration * 100);
                    I = `
- Planned Duration: ${se(s.plannedDuration,"minutes")} | Actual: ${se(s.duration,"minutes")} | ${r}% of goal`
                }
                if (s.completedTaskIds && s.completedTaskIds.length > 0) {
                    const r = s.completedTaskIds.map(P).join(", ");
                    I += `
- Tasks Completed During Session: ${r}`
                }
                if (s.timeAllocation) {
                    const r = [];
                    if (s.timeAllocation.bySubject) {
                        const v = Object.entries(s.timeAllocation.bySubject).map(([H, w]) => `${z(H)}: ${se(Math.round(w),"minutes")}`).join(", ");
                        v && r.push(`Subjects: ${v}`)
                    }
                    r.length > 0 && (I += `
- Time Allocation: ${r.join(" | ")}`)
                }
                const E = l.filter(r => r.completed && !r.deletedAt).sort((r, v) => new Date(v.startTime).getTime() - new Date(r.startTime).getTime()).slice(1, 4),
                    J = E.length > 0 ? `
- Recent Trend: Last ${E.length} sessions averaged ${Math.round(E.reduce((r,v)=>r+v.efficiency,0)/E.length)}% efficiency` : "",
                    S = `I just finished a study session. Give me a SHORT, CONCISE coaching tip I can act on immediately.

Session Details:
- Duration: ${se(s.duration,"minutes")}${c}${q}${I}${J}
- Focus Efficiency: ${s.efficiency}%
- Productivity Rating: ${s.rating}/5
- Session Mode: ${U}
- Subject(s): ${M}
- Chapter(s): ${O}
- Topic(s): ${B}
- Task(s): ${_}
- Session Type: ${s.sessionType||s.taskType||"N/A"}
- Notes: ${s.notes||"None"}

CRITICAL INSTRUCTIONS:
- Maximum 2-3 sentences total
- Give ONE specific, actionable tip only
- Be direct and tactical - no fluff or lengthy explanations
- Focus on the immediate next action, not detailed analysis
- Only discuss planned vs actual when Session Mode is Pomodoro timer and a planned duration is provided
- If Session Mode is Stopwatch or Manual log, do not frame feedback as a pomodoro overrun`;
                try {
                    const r = await o(S, void 0, "/focus", "insight"),
                        v = Tt(r) ?.trim();
                    k(v || at(s))
                } catch (r) {
                    console.error("AI Coaching Insight failed:", r), k(at(s)), m.current = !1
                } finally {
                    A(!1)
                }
            })()
        }, [a, s, o, l, f, j]), a ? e.jsxs(h.div, {
            initial: {
                opacity: 0,
                scale: .9
            },
            animate: {
                opacity: 1,
                scale: 1
            },
            className: "bg-brand-600/10 border border-brand-500/20 rounded-2xl p-4 sm:p-5 md:p-6 relative my-3 overflow-hidden",
            children: [e.jsx("div", {
                className: "absolute top-2 right-2 sm:top-3 sm:right-3 z-10",
                children: e.jsx("button", {
                    onClick: n,
                    className: "p-1.5 hover:bg-white/5 rounded-full transition-colors",
                    children: e.jsx(Fe, {
                        className: "w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 hover:text-zinc-300"
                    })
                })
            }), e.jsxs("div", {
                className: "flex items-start gap-3 sm:gap-4 w-full",
                children: [e.jsx("div", {
                    className: "w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-500/20 flex items-center justify-center shrink-0",
                    children: e.jsx(dt, {
                        className: "w-5 h-5 sm:w-6 sm:h-6 text-brand-400"
                    })
                }), e.jsxs("div", {
                    className: "space-y-2 flex-1 min-w-0 pr-8 sm:pr-10 overflow-hidden",
                    children: [e.jsxs("h4", {
                        className: "text-sm sm:text-base font-bold text-white flex items-center gap-2",
                        children: ["AI Coach Tip", N && e.jsx("span", {
                            className: "flex gap-1",
                            children: e.jsx("span", {
                                className: "w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce"
                            })
                        })]
                    }), e.jsx("div", {
                        className: "text-sm sm:text-base text-zinc-300 leading-relaxed italic max-h-[400px] sm:max-h-[500px] overflow-y-auto overflow-x-hidden custom-scrollbar pr-2 break-words",
                        children: N ? e.jsx("p", {
                            className: "text-sm text-zinc-500 animate-pulse",
                            children: "Analyzing your session..."
                        }) : e.jsx(It, {
                            content: u || "",
                            enableCodeHighlight: !1
                        })
                    })]
                })]
            })]
        }) : null
    },
    De = ({
        isOpen: s,
        onClose: n,
        children: a,
        title: o,
        titleEmoji: l
    }) => s ? wt.createPortal(e.jsx("div", {
        className: "fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md",
        children: e.jsxs(h.div, {
            initial: {
                opacity: 0,
                scale: .96,
                y: 16
            },
            animate: {
                opacity: 1,
                scale: 1,
                y: 0
            },
            transition: {
                type: "spring",
                stiffness: 380,
                damping: 30
            },
            className: "w-full max-w-md sm:max-w-lg bg-[#111113] border border-white/[0.08] rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.7)] overflow-hidden",
            children: [e.jsxs("div", {
                className: "flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-white/[0.02]",
                children: [e.jsxs("h3", {
                    className: "text-base sm:text-[17px] font-semibold text-white tracking-tight flex items-center gap-2",
                    children: [l && e.jsx("span", {
                        className: "text-lg",
                        children: l
                    }), o]
                }), e.jsx(h.button, {
                    onClick: n,
                    whileHover: {
                        rotate: 90,
                        scale: 1.1
                    },
                    whileTap: {
                        scale: .9
                    },
                    transition: {
                        duration: .2
                    },
                    className: "w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.05] hover:bg-white/10 border border-white/[0.08] transition-colors",
                    children: e.jsx(Fe, {
                        className: "w-4 h-4 text-white/50"
                    })
                })]
            }), e.jsx("div", {
                className: "px-4 py-5 sm:px-5 sm:py-6 max-h-[min(90vh,600px)] overflow-y-auto custom-scrollbar",
                children: a
            })]
        })
    }), document.body) : null,
    ue = ({
        children: s,
        className: n = ""
    }) => e.jsx("p", {
        className: `text-[11px] font-semibold uppercase tracking-widest text-white/40 mb-3 ${n}`,
        children: s
    }),
    Ms = ({
        isOpen: s,
        onClose: n,
        onStart: a
    }) => {
        const o = ie(m => m.profile ?.focusSettings ?.focusTypes),
            l = we.useMemo(() => kt(o), [o]),
            f = l[0] ?.id || "practice",
            [j, u] = d.useState(f),
            [k, N] = d.useState(""),
            A = m => {
                m.preventDefault(), a(j, k), n(), u(f), N("")
            };
        return we.useEffect(() => {
            l.some(m => m.id === j) || u(f)
        }, [f, l, j]), e.jsx(De, {
            isOpen: s,
            onClose: n,
            title: "Start Focus Session",
            children: e.jsxs("form", {
                onSubmit: A,
                className: "space-y-5",
                children: [e.jsxs("div", {
                    children: [e.jsx(ue, {
                        children: "What type of work are you doing?"
                    }), e.jsx("div", {
                        className: "grid grid-cols-3 gap-2.5",
                        children: l.map((m, $) => {
                            const z = j === m.id;
                            return e.jsxs(h.button, {
                                type: "button",
                                onClick: () => u(m.id),
                                initial: {
                                    opacity: 0,
                                    y: 8
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                transition: {
                                    delay: $ * .04
                                },
                                whileHover: {
                                    scale: 1.03
                                },
                                whileTap: {
                                    scale: .96
                                },
                                className: `relative flex flex-col items-center justify-center gap-2 py-4 rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${z?"bg-brand-500/[0.15] border-brand-500/60 shadow-[0_0_16_rgba(var(--brand-500),0.2)]":"bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.07] hover:border-white/20"}`,
                                children: [e.jsx("span", {
                                    className: "text-2xl leading-none",
                                    children: m.icon
                                }), e.jsx("span", {
                                    className: `text-[13px] font-semibold tracking-tight ${z?"text-brand-300":"text-white/60"}`,
                                    children: m.label
                                }), z && e.jsx(h.div, {
                                    layoutId: "session-type-indicator",
                                    className: "absolute inset-0 rounded-2xl ring-1 ring-brand-400/40"
                                })]
                            }, m.id)
                        })
                    })]
                }), e.jsxs("div", {
                    children: [e.jsx(ue, {
                        children: "Goal / Description (Optional)"
                    }), e.jsx("textarea", {
                        value: k,
                        onChange: m => N(m.target.value),
                        placeholder: "What do you want to achieve in this session?",
                        className: "w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl text-white text-sm placeholder-white/25 focus:outline-none focus:border-brand-500/40 focus:ring-1 focus:ring-brand-500/20 min-h-[90px] resize-none transition-all duration-200"
                    })]
                }), e.jsxs(h.button, {
                    type: "submit",
                    whileHover: {
                        scale: 1.01,
                        boxShadow: "0 0 24px rgba(var(--brand-500), 0.5)"
                    },
                    whileTap: {
                        scale: .98
                    },
                    className: "w-full h-[52px] bg-gradient-to-r from-brand-600 to-brand-400 hover:from-brand-500 hover:to-brand-300 text-white text-[15px] font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2.5 shadow-lg",
                    children: [e.jsx(ht, {
                        className: "w-4 h-4 fill-white"
                    }), "Start Timer"]
                })]
            })
        })
    },
    hs = [{
        value: "Break",
        icon: "☕",
        label: "Break"
    }, {
        value: "Interruption",
        icon: "🔔",
        label: "Interruption"
    }, {
        value: "Distraction",
        icon: "📱",
        label: "Distraction"
    }, {
        value: "Urgent Task",
        icon: "🚨",
        label: "Urgent Task"
    }, {
        value: "Tired",
        icon: "😴",
        label: "Tired"
    }, {
        value: "Other",
        icon: "📌",
        label: "Other"
    }],
    us = ({
        isOpen: s,
        onClose: n,
        onPause: a
    }) => {
        const [o, l] = d.useState(""), f = u => {
            a(u), n(), l("")
        }, j = u => {
            u.preventDefault(), a(o || "Pause"), n(), l("")
        };
        return e.jsx(De, {
            isOpen: s,
            onClose: n,
            title: "Pause Session",
            children: e.jsxs("div", {
                className: "space-y-4",
                children: [e.jsx(ue, {
                    children: "Why are you pausing? (helps track patterns)"
                }), e.jsx("div", {
                    className: "grid grid-cols-2 gap-2.5",
                    children: hs.map((u, k) => e.jsxs(h.button, {
                        type: "button",
                        onClick: () => f(u.value),
                        initial: {
                            opacity: 0,
                            y: 8
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        transition: {
                            delay: k * .04
                        },
                        whileHover: {
                            scale: 1.02,
                            backgroundColor: "rgba(255,255,255,0.09)"
                        },
                        whileTap: {
                            scale: .96
                        },
                        className: "flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.08] text-white/70 hover:text-white transition-all duration-150 cursor-pointer",
                        children: [e.jsx("span", {
                            className: "text-xl leading-none flex-shrink-0",
                            children: u.icon
                        }), e.jsx("span", {
                            className: "text-[13px] font-semibold",
                            children: u.label
                        })]
                    }, u.value))
                }), e.jsxs("form", {
                    onSubmit: j,
                    className: "space-y-3",
                    children: [e.jsx("input", {
                        type: "text",
                        value: o,
                        onChange: u => l(u.target.value),
                        placeholder: "Or type a custom reason…",
                        className: "w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl text-white text-sm placeholder-white/25 focus:outline-none focus:border-brand-500/40 focus:ring-1 focus:ring-brand-500/20 transition-all duration-200"
                    }), e.jsxs(h.button, {
                        type: "submit",
                        whileHover: {
                            scale: 1.01,
                            boxShadow: "0 0 18px rgba(var(--brand-500), 0.3)"
                        },
                        whileTap: {
                            scale: .98
                        },
                        className: "w-full h-[52px] border-2 border-brand-500/50 bg-brand-500/[0.08] hover:bg-brand-500/[0.16] text-brand-300 text-[15px] font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2.5",
                        children: [e.jsx(ut, {
                            className: "w-4 h-4 fill-current"
                        }), "Pause Timer"]
                    })]
                })]
            })
        })
    },
    Ce = ({
        label: s,
        value: n,
        onChange: a,
        accent: o,
        borderColor: l
    }) => e.jsxs("div", {
        className: "flex flex-col gap-1.5",
        children: [e.jsx("label", {
            className: `text-[10px] font-bold uppercase tracking-widest ${o}`,
            children: s
        }), e.jsx("input", {
            type: "number",
            min: "0",
            value: n === 0 ? "" : n,
            onChange: f => a(parseInt(f.target.value) || 0),
            className: `w-full px-3 py-2.5 bg-white/[0.04] border-t-2 ${l} border-x border-b border-white/[0.08] rounded-xl text-white font-bold text-center text-sm focus:outline-none focus:bg-white/[0.07] transition-colors`
        })]
    }),
    xs = ({
        isOpen: s,
        onClose: n,
        onComplete: a
    }) => {
        const [o, l] = d.useState(80), [f, j] = d.useState(4), [u, k] = d.useState(""), [N, A] = d.useState([]), [m, $] = d.useState(!1), [z, L] = d.useState(null), {
            tasks: C
        } = Re(), {
            currentTaskIds: P,
            timeLeft: M,
            totalTime: O,
            mode: B,
            stopwatchTime: _,
            sessionType: T,
            taskType: U,
            questionsAttempted: W,
            questionsCorrect: c,
            questionsIncorrect: q,
            questionsSkipped: I,
            targetQuestions: E,
            updateQuestionStats: J
        } = he(), {
            hasApiKey: S
        } = be(), r = ie(i => i.profile ?.focusSettings ?.focusTypes), v = st(i => !(i.collapsedCards.focusCoachInsight ?? !0)), H = st(i => i.setCollapsed), [w, R] = d.useState(W || 0), [F, Ie] = d.useState(c || 0), [G, $e] = d.useState(q || 0), [oe, je] = d.useState(I || 0), [ae, Z] = d.useState(null), Pe = !!Nt(r, T, U), xe = B === "pomodoro" ? O - M : _, Me = Math.max(1, Math.round(xe / 60)), X = P.map(i => C.find(g => g.id === i)).filter(i => !!i), {
            subjects: me
        } = He.getState(), {
            currentSubjectIds: Ae,
            currentChapterIds: ee,
            currentTopicIds: V,
            pauseLogs: pe
        } = he.getState(), le = me.filter(i => Ae.includes(i.id)), K = le.map(i => i.name), ce = [], ve = [];
        le.forEach(i => {
            i.chapters.forEach(g => {
                ee.includes(g.id) && ce.push(g.title), g.topics.forEach(Y => {
                    V.includes(Y.id) && ve.push(Y.title)
                })
            })
        });
        const Ee = pe.reduce((i, g) => i + g.duration, 0),
            Le = async i => {
                if (i.preventDefault(), !m) {
                    if (Pe) {
                        const g = F + G + oe;
                        if (g > w) {
                            Z(`Sum of parts (${g}) cannot exceed attempted (${w}).`);
                            return
                        }
                        if (w > 0 && g < w) {
                            Z(`You attempted ${w} but only categorized ${g}. Please adjust Correct/Incorrect/Skipped.`);
                            return
                        }
                        Z(null), J({
                            attempted: w,
                            correct: F,
                            incorrect: G,
                            skipped: oe
                        })
                    }
                    $(!0), L(null);
                    try {
                        await a(o, u, f, N), n(), l(80), j(4), k(""), A([])
                    } catch (g) {
                        console.error("[CompleteSessionModal] Failed to complete session:", g), L("Failed to save session. Please try again.")
                    } finally {
                        $(!1)
                    }
                }
            },
            Qe = i => {
                A(g => g.includes(i) ? g.filter(Y => Y !== i) : [...g, i])
            },
            ke = o >= 75 ? "text-emerald-400" : o >= 40 ? "text-amber-400" : "text-rose-400";
        return e.jsx(De, {
            isOpen: s,
            onClose: n,
            title: "Session Complete!",
            titleEmoji: "🎉",
            children: e.jsxs("form", {
                onSubmit: Le,
                className: "space-y-5",
                children: [e.jsxs("div", {
                    className: "bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-4 text-center",
                    children: [e.jsx(ue, {
                        className: "mb-3 text-center",
                        children: "How productive was this session?"
                    }), e.jsx("div", {
                        className: "flex items-center justify-center gap-1.5",
                        children: [1, 2, 3, 4, 5].map((i, g) => e.jsx(h.button, {
                            type: "button",
                            onClick: () => j(i),
                            initial: {
                                scale: 0
                            },
                            animate: {
                                scale: 1
                            },
                            transition: {
                                delay: .1 + g * .05,
                                type: "spring",
                                stiffness: 400,
                                damping: 20
                            },
                            whileHover: {
                                scale: 1.2
                            },
                            whileTap: {
                                scale: .9
                            },
                            children: e.jsx($t, {
                                className: `w-9 h-9 transition-all duration-200 ${i<=f?"fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]":"text-white/15"}`
                            })
                        }, i))
                    }), e.jsxs("div", {
                        className: "flex justify-between text-[11px] text-white/25 mt-3 px-1",
                        children: [e.jsx("span", {
                            children: "Not productive"
                        }), e.jsx("span", {
                            children: "Very productive"
                        })]
                    })]
                }), Pe && e.jsxs("div", {
                    className: "bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 space-y-4",
                    children: [e.jsxs("div", {
                        className: "flex items-center justify-between",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [e.jsx(xt, {
                                className: "w-4 h-4 text-brand-400"
                            }), e.jsx("span", {
                                className: "text-[13px] font-semibold text-white/80",
                                children: "Session Analytics"
                            })]
                        }), E > 0 && e.jsxs("span", {
                            className: "text-[11px] text-white/30 bg-white/[0.05] border border-white/[0.08] px-2 py-0.5 rounded-full",
                            children: ["Target: ", E]
                        })]
                    }), e.jsxs("div", {
                        className: "grid grid-cols-2 gap-3",
                        children: [e.jsxs("div", {
                            className: "flex flex-col items-center justify-center gap-1 bg-emerald-500/[0.08] border border-emerald-500/20 rounded-2xl py-3 shadow-lg shadow-emerald-500/5",
                            children: [e.jsxs("div", {
                                className: "flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-emerald-400/70 font-bold",
                                children: [e.jsx(Pt, {
                                    className: "w-3.5 h-3.5"
                                }), " Accuracy"]
                            }), e.jsxs("div", {
                                className: "text-2xl font-black text-emerald-400",
                                children: [w > 0 ? Math.round(F / w * 100) : 0, "%"]
                            })]
                        }), e.jsxs("div", {
                            className: "flex flex-col items-center justify-center gap-1 bg-brand-500/[0.08] border border-brand-500/20 rounded-2xl py-3 shadow-lg shadow-brand-500/5",
                            children: [e.jsxs("div", {
                                className: "flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-brand-400/70 font-bold",
                                children: [e.jsx(ye, {
                                    className: "w-3.5 h-3.5"
                                }), " Velocity"]
                            }), e.jsxs("div", {
                                className: "text-2xl font-black text-brand-400",
                                children: [w > 0 ? Math.round(xe / w) : 0, e.jsx("span", {
                                    className: "text-xs font-bold text-brand-400/50 ml-1",
                                    children: "s/q"
                                })]
                            })]
                        })]
                    }), e.jsxs("div", {
                        className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
                        children: [e.jsx(Ce, {
                            label: "Total",
                            value: w,
                            onChange: R,
                            accent: "text-white/50",
                            borderColor: "border-white/20"
                        }), e.jsx(Ce, {
                            label: "Correct",
                            value: F,
                            onChange: Ie,
                            accent: "text-emerald-500",
                            borderColor: "border-emerald-500/50"
                        }), e.jsx(Ce, {
                            label: "Incorrect",
                            value: G,
                            onChange: $e,
                            accent: "text-rose-500",
                            borderColor: "border-rose-500/50"
                        }), e.jsx(Ce, {
                            label: "Skipped",
                            value: oe,
                            onChange: je,
                            accent: "text-amber-500",
                            borderColor: "border-amber-500/50"
                        })]
                    }), e.jsx(D, {
                        children: ae && e.jsxs(h.div, {
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
                            className: "flex gap-2 items-start text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2.5",
                            children: [e.jsx(We, {
                                className: "w-4 h-4 shrink-0 mt-0.5"
                            }), e.jsx("span", {
                                children: ae
                            })]
                        })
                    })]
                }), e.jsxs("div", {
                    children: [e.jsxs("div", {
                        className: "flex items-center justify-between mb-3",
                        children: [e.jsx(ue, {
                            className: "mb-0",
                            children: "Focus Efficiency"
                        }), e.jsxs("span", {
                            className: `text-xs font-bold px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] ${ke}`,
                            children: [o, "%"]
                        })]
                    }), e.jsx("input", {
                        type: "range",
                        min: "0",
                        max: "100",
                        value: o,
                        onChange: i => l(parseInt(i.target.value)),
                        className: "w-full h-1.5 rounded-full appearance-none cursor-pointer accent-emerald-400 bg-white/10"
                    }), e.jsxs("div", {
                        className: "flex justify-between text-[11px] text-white/25 mt-2",
                        children: [e.jsx("span", {
                            children: "Distracted"
                        }), e.jsx("span", {
                            children: "Focused"
                        }), e.jsx("span", {
                            children: "Flow State"
                        })]
                    })]
                }), X.length > 0 && e.jsxs("div", {
                    children: [e.jsx(ue, {
                        children: "Tasks completed in this session"
                    }), e.jsx("div", {
                        className: "space-y-1 max-h-32 overflow-y-auto custom-scrollbar",
                        children: X.map(i => e.jsxs("label", {
                            className: "flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.05] cursor-pointer transition-colors group",
                            children: [e.jsx("input", {
                                type: "checkbox",
                                checked: N.includes(i.id),
                                onChange: () => Qe(i.id),
                                className: "w-4 h-4 rounded border-white/20 bg-transparent accent-emerald-400 cursor-pointer"
                            }), e.jsx("span", {
                                className: "text-sm text-white/60 group-hover:text-white/80 transition-colors",
                                children: i.title
                            })]
                        }, i.id))
                    })]
                }), e.jsxs("div", {
                    children: [e.jsxs("div", {
                        className: "flex items-center justify-between mb-3",
                        children: [e.jsx(ue, {
                            className: "mb-0",
                            children: "Session Notes (Optional)"
                        }), S && !v && e.jsxs("button", {
                            type: "button",
                            onClick: () => H("focusCoachInsight", !1),
                            className: "flex items-center gap-1.5 text-[11px] font-semibold text-brand-400 bg-brand-500/[0.08] hover:bg-brand-500/[0.15] border border-brand-500/20 px-2.5 py-1 rounded-full transition-all duration-200",
                            children: [e.jsx(dt, {
                                className: "w-3 h-3"
                            }), "AI Coach Tip"]
                        })]
                    }), e.jsx("textarea", {
                        value: u,
                        onChange: i => k(i.target.value),
                        placeholder: "What did you accomplish?",
                        className: "w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl text-white text-sm placeholder-white/25 focus:outline-none focus:border-brand-500/40 focus:ring-1 focus:ring-brand-500/20 min-h-[72px] max-h-[120px] resize-none transition-all duration-200"
                    })]
                }), v && e.jsx(ds, {
                    sessionData: {
                        duration: Me,
                        efficiency: o,
                        rating: f,
                        notes: u,
                        mode: B,
                        plannedDuration: B === "pomodoro" && O > 0 ? Math.round(O / 60) : void 0,
                        taskType: he.getState().taskType,
                        sessionType: he.getState().sessionType,
                        subjects: K.length > 0 ? K : Array.from(new Set(X.map(i => i.subject).filter(Boolean))),
                        chapters: ce,
                        topics: ve,
                        tasks: X.map(i => i.title),
                        pauseLogs: pe.map(i => ({
                            reason: i.reason,
                            duration: i.duration
                        })),
                        totalPauseTime: Ee,
                        questionsAttempted: w,
                        questionsCorrect: F,
                        questionsIncorrect: G,
                        questionsSkipped: oe
                    },
                    onClose: () => H("focusCoachInsight", !0)
                }), e.jsx(D, {
                    children: z && e.jsxs(h.div, {
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
                        className: "flex gap-2 items-start text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2.5",
                        children: [e.jsx(We, {
                            className: "w-4 h-4 shrink-0 mt-0.5"
                        }), e.jsx("span", {
                            children: z
                        })]
                    })
                }), e.jsx(h.button, {
                    type: "submit",
                    disabled: m,
                    whileHover: m ? {} : {
                        scale: 1.01,
                        boxShadow: "0 0 24px rgba(var(--brand-500), 0.45)"
                    },
                    whileTap: m ? {} : {
                        scale: .98
                    },
                    className: "w-full h-[52px] bg-gradient-to-r from-brand-600 to-brand-400 hover:from-brand-500 hover:to-brand-300 disabled:from-brand-800/40 disabled:to-brand-700/40 disabled:cursor-not-allowed text-white text-[15px] font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2.5 shadow-lg",
                    children: m ? e.jsxs(e.Fragment, {
                        children: [e.jsx(Mt, {
                            className: "w-4 h-4 animate-spin text-white/70"
                        }), e.jsx("span", {
                            children: "Saving…"
                        })]
                    }) : e.jsxs(e.Fragment, {
                        children: [e.jsx(At, {
                            className: "w-4 h-4"
                        }), "Save Session"]
                    })
                })]
            })
        })
    },
    ms = ({
        isExpanded: s
    }) => {
        const {
            timerState: n,
            activePhase: a,
            mode: o,
            timeLeft: l,
            stopwatchTime: f,
            resumeTimer: j,
            pauseTimer: u,
            completeSession: k,
            resetTimer: N,
            addTime: A,
            skipToBreak: m,
            currentSubject: $
        } = he(), [z, L] = d.useState(!1), [C, P] = d.useState(!1), M = ie(c => c.profile ?.focusSettings), O = M ?.showPauseReasonPicker ?? !0, B = M ?.showSessionCompletionCard ?? M ?.showSessionProductivityRating ?? !0, _ = Be(), T = rs();
        if (!((n === "running" || n === "paused" || n === "break") && T.pathname !== "/focus")) return null;
        const W = o === "pomodoro" ? l : f;
        return e.jsx(cs, {
            children: e.jsx(ls, {
                initial: {
                    opacity: 0,
                    scale: .9,
                    y: 10
                },
                animate: {
                    opacity: 1,
                    scale: 1,
                    y: 0
                },
                exit: {
                    opacity: 0,
                    scale: .9,
                    y: 10
                },
                transition: {
                    duration: .2
                },
                className: `
          mx-3 mb-4 p-3.5 rounded-[22px] border transition-all duration-300
          bg-gradient-to-br from-white/10 to-zinc-50/5 dark:from-white/[0.05] dark:to-transparent
          border-zinc-200 dark:border-white/10 shadow-xl shadow-black/5
          ${s?"w-auto":"w-12 flex flex-col items-center"}
        `,
                children: s ? e.jsxs("div", {
                    className: "space-y-3",
                    children: [e.jsxs("div", {
                        className: "flex items-center justify-between",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [e.jsx("div", {
                                className: "p-1.5 rounded-lg bg-brand-500 text-white",
                                children: e.jsx(ye, {
                                    className: "w-3 h-3"
                                })
                            }), e.jsx("span", {
                                className: "text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider",
                                children: n === "break" ? "On Break" : "Active Session"
                            })]
                        }), e.jsx("div", {
                            className: `w-2 h-2 rounded-full ${n==="running"?"bg-emerald-500 animate-pulse":n==="break"?"bg-blue-500 animate-pulse":"bg-amber-500"}`
                        })]
                    }), e.jsxs("div", {
                        className: "cursor-pointer group",
                        onClick: () => _("/focus"),
                        children: [e.jsx("div", {
                            className: "text-2xl font-display font-bold tabular-nums text-zinc-900 dark:text-white group-hover:text-brand-500 transition-colors",
                            children: se(W, "seconds")
                        }), e.jsx("div", {
                            className: "text-[11px] font-medium text-zinc-500 dark:text-zinc-400 truncate max-w-[180px]",
                            children: $ || "Focusing..."
                        })]
                    }), e.jsxs("div", {
                        className: "space-y-3 pt-1",
                        children: [e.jsxs("div", {
                            className: `grid ${o==="pomodoro"?"grid-cols-5":"grid-cols-2"} gap-2`,
                            children: [n === "running" || n === "break" ? e.jsx("button", {
                                onClick: c => {
                                    c.stopPropagation(), O ? L(!0) : u("Pause")
                                },
                                className: "py-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-400 transition-all active:scale-95 flex justify-center border border-zinc-200 dark:border-white/5 shadow-sm",
                                title: a === "break" ? "Pause Break" : "Pause Session",
                                children: e.jsx(ut, {
                                    className: "w-4 h-4"
                                })
                            }) : e.jsx("button", {
                                onClick: c => {
                                    c.stopPropagation(), j()
                                },
                                className: "py-2.5 rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-all active:scale-95 flex justify-center shadow-lg shadow-brand-500/20",
                                title: a === "break" ? "Resume Break" : "Resume Session",
                                children: e.jsx(ht, {
                                    className: "w-4 h-4 fill-current"
                                })
                            }), o === "pomodoro" && e.jsxs(e.Fragment, {
                                children: [e.jsx("button", {
                                    onClick: c => {
                                        c.stopPropagation(), A(-300)
                                    },
                                    className: "py-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-400 transition-all active:scale-95 flex justify-center border border-zinc-200 dark:border-white/5 shadow-sm",
                                    title: "Subtract 5 Minutes",
                                    children: e.jsx(Et, {
                                        className: "w-4 h-4"
                                    })
                                }), e.jsx("button", {
                                    onClick: c => {
                                        c.stopPropagation(), A(300)
                                    },
                                    className: "py-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-400 transition-all active:scale-95 flex justify-center border border-zinc-200 dark:border-white/5 shadow-sm",
                                    title: "Add 5 Minutes",
                                    children: e.jsx(Lt, {
                                        className: "w-4 h-4"
                                    })
                                }), e.jsx("button", {
                                    onClick: c => {
                                        c.stopPropagation(), m()
                                    },
                                    className: "py-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-400 transition-all active:scale-95 flex justify-center border border-zinc-200 dark:border-white/5 shadow-sm",
                                    title: a === "break" ? "Skip Break" : "Skip to Break",
                                    children: e.jsx(Ot, {
                                        className: "w-4 h-4"
                                    })
                                })]
                            }), e.jsx("button", {
                                onClick: c => {
                                    c.stopPropagation(), N()
                                },
                                className: "py-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-400 transition-all active:scale-95 flex justify-center border border-zinc-200 dark:border-white/5 shadow-sm",
                                title: "Reset Timer",
                                children: e.jsx(_t, {
                                    className: "w-4 h-4"
                                })
                            })]
                        }), e.jsxs("button", {
                            onClick: c => {
                                if (c.stopPropagation(), a === "break") {
                                    m();
                                    return
                                }
                                B ? P(!0) : k(void 0, void 0, void 0, void 0)
                            },
                            className: "w-full py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold text-[11px] uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-2 border border-rose-500/20 shadow-sm",
                            children: [e.jsx("div", {
                                className: "w-2.5 h-2.5 rounded-sm bg-rose-500"
                            }), a === "break" ? "End Break" : "Complete Session"]
                        })]
                    }), O && e.jsx(us, {
                        isOpen: z,
                        onClose: () => L(!1),
                        onPause: c => {
                            u(c), L(!1)
                        }
                    }), B && e.jsx(xs, {
                        isOpen: C,
                        onClose: () => P(!1),
                        onComplete: async (c, q, I, E) => {
                            await k(q, c, I, E), P(!1)
                        }
                    })]
                }) : e.jsxs("div", {
                    className: "flex flex-col items-center gap-2 cursor-pointer",
                    onClick: () => _("/focus"),
                    children: [e.jsx("div", {
                        className: `w-2 h-2 rounded-full ${n==="running"?"bg-emerald-500 animate-pulse":n==="break"?"bg-blue-500 animate-pulse":"bg-amber-500"}`
                    }), e.jsx("div", {
                        className: "text-[10px] font-bold tabular-nums text-zinc-900 dark:text-white transform -rotate-90 origin-center whitespace-nowrap my-4",
                        children: se(W, "seconds")
                    }), e.jsx("div", {
                        className: "p-2 rounded-full bg-brand-500 text-white shadow-lg shadow-brand-500/20",
                        children: e.jsx(ye, {
                            className: "w-3 h-3"
                        })
                    })]
                })
            })
        })
    },
    rt = ({
        icon: s,
        label: n,
        isActive: a,
        onClick: o,
        isOpen: l
    }) => e.jsx(h.div, {
        className: "relative px-3 mb-1",
        layout: !0,
        transition: {
            duration: .3,
            ease: "easeInOut"
        },
        children: l ? e.jsxs(h.button, {
            onClick: o,
            className: `
            w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden
            ${a?"text-zinc-900 dark:text-white bg-zinc-100 dark:bg-white/10 border border-zinc-200 dark:border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:shadow-[0_0_15px_rgba(255,255,255,0.05)] translate-x-1":"text-zinc-500 dark:text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white hover:translate-x-1"}
          `,
            whileHover: {
                scale: 1.02
            },
            whileTap: {
                scale: .98
            },
            children: [e.jsx(h.div, {
                animate: {
                    scale: a ? 1.1 : 1
                },
                transition: {
                    duration: .3,
                    ease: "easeInOut"
                },
                children: e.jsx(s, {
                    className: "w-5 h-5 shrink-0 relative z-10"
                })
            }), e.jsx(h.span, {
                className: `text-sm font-medium whitespace-nowrap relative z-10 ${a?"font-semibold":""}`,
                initial: {
                    opacity: 0,
                    x: -10
                },
                animate: {
                    opacity: 1,
                    x: 0
                },
                transition: {
                    duration: .25,
                    ease: "easeInOut"
                },
                children: n
            }), a && e.jsx(h.div, {
                layoutId: "active-sidebar-bg",
                className: "absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
            }), a && e.jsx(h.div, {
                initial: {
                    opacity: 0,
                    x: 5
                },
                animate: {
                    opacity: .5,
                    x: 0
                },
                transition: {
                    duration: .25
                },
                children: e.jsx(Yt, {
                    className: "w-4 h-4 ml-auto relative z-10"
                })
            })]
        }) : e.jsx(Te, {
            content: n,
            side: "right",
            className: "w-full",
            children: e.jsxs(h.button, {
                onClick: o,
                className: `
              w-full p-3 rounded-xl flex justify-center items-center transition-all duration-300 group relative
              ${a?"text-zinc-900 dark:text-white bg-zinc-100 dark:bg-white/10 border border-zinc-200 dark:border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:shadow-[0_0_15px_rgba(255,255,255,0.05)]":"text-zinc-500 dark:text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"}
            `,
                whileHover: {
                    scale: 1.05
                },
                whileTap: {
                    scale: .95
                },
                children: [e.jsx(h.div, {
                    animate: {
                        scale: a ? 1.1 : 1
                    },
                    transition: {
                        duration: .3,
                        ease: "easeInOut"
                    },
                    children: e.jsx(s, {
                        className: `w-5 h-5 relative z-10 ${a?"text-brand-500":""}`
                    })
                }), a && e.jsx(h.div, {
                    layoutId: "active-sidebar-glow",
                    className: "absolute inset-0 rounded-xl bg-white/20 blur-md",
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
                    }
                })]
            })
        })
    }),
    As = ({
        isExpanded: s,
        setIsExpanded: n,
        activeTab: a,
        setActiveTab: o,
        isDark: l,
        toggleTheme: f,
        mobileMenuOpen: j = !1,
        setMobileMenuOpen: u
    }) => {
        const {
            profile: k
        } = ie(), {
            isPremium: N
        } = de(), A = N(), [m, $] = d.useState(!1), [z, L] = d.useState(!1), [C, P] = d.useState(!1), {
            isPinned: M,
            isHovered: O,
            setIsPinned: B,
            setIsHovered: _
        } = os(), T = s ?? M, U = n ?? B, W = m || O;
        d.useEffect(() => {
            const S = window.matchMedia("(hover: none), (pointer: coarse)"),
                r = () => {
                    L(window.innerWidth < 1024), P(S.matches)
                };
            return r(), window.addEventListener("resize", r), S.addEventListener("change", r), () => {
                window.removeEventListener("resize", r), S.removeEventListener("change", r)
            }
        }, []);
        const c = T || !C && W || j,
            q = z || c ? 280 : 88,
            I = Be(),
            E = [{
                icon: Ht,
                label: "Overview",
                path: "/dashboard"
            }, {
                icon: ye,
                label: "Focus",
                path: "/focus"
            }, {
                icon: Rt,
                label: "Study",
                path: "/study"
            }, {
                icon: Ft,
                label: "Syllabus",
                path: "/syllabus"
            }, {
                icon: Bt,
                label: "Exams",
                path: "/exams"
            }, {
                icon: Dt,
                label: "Tasks",
                path: "/tasks"
            }, {
                icon: Qt,
                label: "Analytics",
                path: "/analytics"
            }, {
                icon: Ut,
                label: "Community",
                path: "/community"
            }],
            J = S => {
                o(S.label), S.path && I(S.path), $(!1), _(!1), j && u && u(!1), C && T && U(!1)
            };
        return e.jsxs(e.Fragment, {
            children: [e.jsx(D, {
                children: j && e.jsx(h.div, {
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    exit: {
                        opacity: 0
                    },
                    onClick: () => u ?.(!1),
                    className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                })
            }), e.jsxs(h.aside, {
                initial: !1,
                animate: {
                    width: q
                },
                transition: {
                    type: "spring",
                    stiffness: 280,
                    damping: 32,
                    mass: .8
                },
                onMouseEnter: () => {
                    C || ($(!0), _(!0))
                },
                onMouseLeave: () => {
                    C || ($(!1), _(!1))
                },
                className: `
          fixed lg:static inset-y-0 left-0 z-50 h-screen
          flex flex-col
          app-sidebar bg-white/80 dark:bg-[#0c0c0e]/80 backdrop-blur-xl
          border-r border-zinc-200 dark:border-white/5
          shadow-2xl lg:shadow-none
          ${j?"translate-x-0":"-translate-x-full"} lg:translate-x-0
          transition-transform duration-300 lg:transition-none
        `,
                children: [e.jsxs(ns, {
                    to: "/dashboard",
                    className: `h-24 flex items-center px-6 shrink-0 ${c?"justify-start":"justify-center"}`,
                    children: [e.jsxs("div", {
                        className: "relative group cursor-pointer",
                        children: [e.jsx("div", {
                            className: "absolute inset-0 bg-brand-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                        }), e.jsx("div", {
                            className: "w-10 h-10 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center shrink-0 shadow-lg relative z-10 group-hover:scale-105 transition-transform duration-300",
                            children: e.jsx(qt, {
                                className: "w-6 h-6 text-brand-500 dark:text-brand-600 dark:text-brand-400"
                            })
                        })]
                    }), e.jsx(D, {
                        mode: "wait",
                        children: c && e.jsxs(h.div, {
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
                                x: -10
                            },
                            transition: {
                                duration: .25,
                                ease: "easeInOut"
                            },
                            className: "ml-4",
                            children: [e.jsx("h1", {
                                className: "font-display font-bold text-xl tracking-tight text-zinc-900 dark:text-white leading-none",
                                children: "IsotopeAI"
                            }), e.jsx("p", {
                                className: "text-[10px] text-zinc-500 font-mono mt-1 tracking-wider uppercase",
                                children: "Productivity OS"
                            })]
                        })
                    })]
                }), e.jsxs("div", {
                    className: "flex-1 px-0 py-4 overflow-y-auto overflow-x-hidden custom-scrollbar space-y-1",
                    children: [e.jsx("div", {
                        className: `px-6 mb-2 text-xs font-bold text-zinc-500 dark:text-zinc-400 dark:text-zinc-600 uppercase tracking-widest ${!c&&"hidden"}`,
                        children: "Menu"
                    }), E.map(S => e.jsx(rt, { ...S,
                        isActive: a === S.label,
                        onClick: () => J(S),
                        isOpen: c
                    }, S.label))]
                }), e.jsx(ms, {
                    isExpanded: c
                }), e.jsxs("div", {
                    className: "py-4 mt-auto flex flex-col gap-2 bg-zinc-50/50 dark:bg-white/[0.02] border-t border-zinc-200 dark:border-white/5 backdrop-blur-md",
                    children: [e.jsx(rt, {
                        icon: Wt,
                        label: "Settings",
                        isActive: a === "Settings",
                        onClick: () => {
                            o("Settings"), I("/settings"), j && u && u(!1), C && T && U(!1), $(!1), _(!1)
                        },
                        isOpen: c
                    }), e.jsx("div", {
                        className: "my-2 border-t border-zinc-200 dark:border-white/5 mx-3"
                    }), e.jsx("div", {
                        className: "px-3",
                        children: e.jsx("button", {
                            onClick: f,
                            className: `
                w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group
                text-zinc-500 dark:text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white
                ${c?"":"justify-center"}
              `,
                            children: c ? e.jsxs(e.Fragment, {
                                children: [l ? e.jsx(Ge, {
                                    className: "w-5 h-5 shrink-0 group-hover:rotate-45 transition-transform"
                                }) : e.jsx(Ve, {
                                    className: "w-5 h-5 shrink-0 group-hover:-rotate-12 transition-transform"
                                }), e.jsx("span", {
                                    className: "text-sm font-medium",
                                    children: l ? "Light Mode" : "Dark Mode"
                                })]
                            }) : e.jsx(Te, {
                                content: l ? "Light Mode" : "Dark Mode",
                                side: "right",
                                children: l ? e.jsx(Ge, {
                                    className: "w-5 h-5 group-hover:rotate-45 transition-transform"
                                }) : e.jsx(Ve, {
                                    className: "w-5 h-5 group-hover:-rotate-12 transition-transform"
                                })
                            })
                        })
                    }), e.jsx("div", {
                        className: "px-3",
                        children: e.jsxs("div", {
                            className: `
              relative overflow-hidden
              flex items-center gap-3 p-2.5 rounded-2xl transition-all duration-300
              ${c?"bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10 hover:shadow-md":"justify-center hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl"}
            `,
                            children: [c && e.jsx("div", {
                                className: "absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 dark:opacity-50 pointer-events-none"
                            }), e.jsxs("div", {
                                className: "relative shrink-0",
                                children: [e.jsx("img", {
                                    src: k ?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
                                    alt: "User",
                                    className: "w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 shadow-inner object-cover"
                                }), A ? e.jsx("div", {
                                    className: "absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full border-2 border-white dark:border-[#0c0c0e] flex items-center justify-center shadow-lg",
                                    children: e.jsx(Ke, {
                                        className: "w-3 h-3 text-white"
                                    })
                                }) : e.jsx("div", {
                                    className: "absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0c0c0e]"
                                })]
                            }), e.jsx(D, {
                                mode: "wait",
                                children: c && e.jsxs(h.div, {
                                    initial: {
                                        opacity: 0,
                                        width: 0
                                    },
                                    animate: {
                                        opacity: 1,
                                        width: "auto"
                                    },
                                    exit: {
                                        opacity: 0,
                                        width: 0
                                    },
                                    transition: {
                                        duration: .25,
                                        ease: "easeInOut"
                                    },
                                    className: "flex-1 overflow-hidden relative z-10",
                                    children: [e.jsx("div", {
                                        className: "text-sm font-bold truncate text-zinc-900 dark:text-white",
                                        children: ct(k)
                                    }), e.jsx("div", {
                                        className: "flex items-center gap-1.5 mt-0.5",
                                        children: A ? e.jsxs("div", {
                                            className: "px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1",
                                            children: [e.jsx(Ke, {
                                                className: "w-2.5 h-2.5"
                                            }), "Pro"]
                                        }) : e.jsx("div", {
                                            className: "px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/10 border border-zinc-200 dark:border-white/10 text-[9px] font-bold text-zinc-500 dark:text-zinc-500 dark:text-zinc-400 uppercase tracking-wider",
                                            children: "Free"
                                        })
                                    })]
                                })
                            }), c && e.jsx("button", {
                                onClick: async () => {
                                    await de.getState().signOut(), ie.getState().resetProfile(), I("/")
                                },
                                className: "p-2 hover:bg-red-500/10 text-zinc-500 dark:text-zinc-400 hover:text-red-500 rounded-lg transition-colors relative z-10",
                                children: e.jsx(Gt, {
                                    className: "w-4 h-4"
                                })
                            })]
                        })
                    }), e.jsx("div", {
                        className: `pt-2 hidden lg:flex px-3 ${c?"justify-end":"justify-center"}`,
                        children: e.jsx("button", {
                            onClick: () => U(!T),
                            className: "p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 transition-all",
                            children: T ? e.jsx(Te, {
                                content: "Unpin Sidebar",
                                side: "right",
                                children: e.jsx(Vt, {
                                    className: "w-4 h-4"
                                })
                            }) : e.jsx(Te, {
                                content: "Pin Sidebar Open",
                                side: "right",
                                children: e.jsx(Kt, {
                                    className: "w-4 h-4"
                                })
                            })
                        })
                    })]
                })]
            })]
        })
    },
    ps = () => {
        const {
            isLowEndDevice: s,
            isPerformanceMode: n
        } = St();
        ie(l => l.updateProfile), ie(l => l.profile);
        const [a, o] = d.useState(!1);
        return null
    },
    bs = d.lazy(() => is(() =>
        import ("./ToolsModal-BMUG81iV.js"), __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]))),
    Es = ({
        activeTab: s,
        mobileMenuOpen: n,
        setMobileMenuOpen: a,
        onSearch: o,
        onSubmit: l,
        searchPlaceholder: f = "Quick search...",
        beforeSearchActions: j
    }) => {
        const [u, k] = d.useState(new Date), [N, A] = d.useState(0), [m, $] = d.useState(!1), z = we.useRef(null), {
            profile: L
        } = ie(), {
            sessions: C,
            dailyGoalMinutes: P
        } = he(), {
            tasks: M
        } = Re(), {
            exams: O
        } = zt(), B = de(t => t.isPremium), _ = de(t => t.isTemporaryLocalSession), T = de(t => t.temporaryLocalMessage), U = de(t => t.temporaryLocalWarningDismissedFingerprint), W = de(t => t.dismissTemporaryLocalWarning), c = B(), q = ze(t => t.status), I = ze(t => t.needsCloudBootstrap), E = be(t => t.toggleAssistant), J = be(t => t.hasApiKey), S = be(t => t.settings.isEnabled), {
            inAppNotifications: r,
            markAsRead: v,
            markAllAsRead: H,
            clearAll: w
        } = qe(), [R, F] = d.useState(null), [Ie, G] = d.useState(!1), [$e, oe] = d.useState(!1), je = Be(), ae = Ct(L ?.studyPreferences), Z = ge(new Date, ae), xe = C.filter(t => ge(t.startTime, ae) === Z).reduce((t, b) => t + (b.duration || 0), 0), Me = se(xe), X = M.filter(t => t.status === "done" && t.completedAt ?.startsWith(Z)).length, me = M.filter(t => t.status !== "done").length + X, Ae = () => {
            if (C.length === 0) return 0;
            const t = [...new Set(C.map(y => ge(y.startTime, ae)))].sort(),
                b = ge(new Date, ae),
                p = t[t.length - 1];
            if (p !== b && p !== ge(new Date(Date.now() - 864e5), ae)) return 0;
            let x = 1;
            for (let y = t.length - 1; y > 0; y--) {
                const te = new Date(t[y]),
                    re = new Date(t[y - 1]);
                if ((te.getTime() - re.getTime()) / (1e3 * 3600 * 24) <= 1.1) x++;
                else break
            }
            return x
        }, ee = {
            name: ct(L),
            streak: Ae()
        }, V = d.useMemo(() => {
            const t = new Date;
            t.setHours(0, 0, 0, 0);
            const b = O.filter(Q => !Q.deletedAt && Ne(Q.date) >= t).sort((Q, ne) => Ne(Q.date).getTime() - Ne(ne.date).getTime()),
                x = b.find(Q => Q.isDDay) || b[0];
            if (!x) return null;
            const y = Ne(x.date);
            y.setHours(0, 0, 0, 0);
            const te = y.getTime() - t.getTime(),
                re = Math.max(0, Math.ceil(te / (1e3 * 60 * 60 * 24)));
            return {
                title: x.title,
                days: re
            }
        }, [O]), pe = {
            tasksCompleted: X,
            tasksTotal: me,
            nextExam: V ? V.title : "No Exam",
            daysLeft: V ? V.days : 0,
            completionPercent: me > 0 ? Math.round(X / me * 100) : 0
        }, le = d.useMemo(() => [{
            label: "Create task",
            value: "Study Waves !p1 #Physics"
        }, {
            label: "Ask AI",
            value: "Plan my evening study session"
        }, {
            label: "Get advice",
            value: "How should I revise weak chapters?"
        }, {
            label: "Quick task",
            value: "Make PYQ backlog !p2 #Math"
        }], []), K = [{
            icon: Ye,
            label: `${Me} studied today`,
            color: "brand"
        }, {
            icon: Je,
            label: `${ee.streak}-day streak`,
            color: "amber"
        }, {
            icon: Ze,
            label: `${X}/${me} tasks done`,
            color: "brand"
        }, {
            icon: Xe,
            label: V ? `${V.days} day${V.days===1?"":"s"} to ${V.title}` : "No target exam set",
            color: "red"
        }], ce = r.filter(t => !t.read).length, ve = _ && !!T && U !== T, Ee = t => {
            const b = new Date(t),
                x = Math.floor((new Date().getTime() - b.getTime()) / 1e3);
            return x < 60 ? "Just now" : x < 3600 ? `${Math.floor(x/60)}m ago` : x < 86400 ? `${Math.floor(x/3600)}h ago` : `${Math.floor(x/86400)}d ago`
        };
        d.useEffect(() => {
            const t = setInterval(() => k(new Date), 6e4);
            return () => clearInterval(t)
        }, []), d.useEffect(() => {
            const t = setInterval(() => {
                A(b => (b + 1) % K.length)
            }, 5e3);
            return () => clearInterval(t)
        }, [K.length]);
        const Le = () => {
                const t = u.getHours();
                return t < 12 ? "Good Morning" : t < 17 ? "Good Afternoon" : "Good Evening"
            },
            ke = [{
                icon: es,
                label: "Tools",
                color: "brand",
                onClick: () => oe(!0)
            }, {
                icon: ts,
                label: "Feedback",
                color: "brand",
                onClick: () => window.open("https://isotope.featurebase.app", "_blank")
            }, {
                icon: tt,
                label: "AI Assistant",
                color: "brand",
                onClick: () => {
                    !J || !S ? G(!0) : E(!0)
                }
            }, {
                icon: ss,
                label: I ? "Download" : c ? "Sync" : "Sync (Pro)",
                color: "brand",
                onClick: async () => {
                    if (!(q === "syncing" || !c)) {
                        try {
                            const {
                                triggerSync: t,
                                downloadCloudSnapshot: b
                            } = ze.getState();
                            I ? await b() : await t();
                            const {
                                status: p,
                                error: x
                            } = ze.getState();
                            F(p === "success" ? {
                                show: !0,
                                message: I ? "Cloud data downloaded!" : "Sync complete!",
                                type: "success"
                            } : p === "degraded" ? {
                                show: !0,
                                message: x || "Cloud sync is temporarily unavailable. Local changes will retry later.",
                                type: "warning"
                            } : {
                                show: !0,
                                message: x || "Sync failed",
                                type: "error"
                            })
                        } catch {
                            F({
                                show: !0,
                                message: "Sync failed",
                                type: "error"
                            })
                        }
                        setTimeout(() => F(null), 3e3)
                    }
                },
                isSync: !0
            }],
            [i, g] = d.useState(!1),
            [Y, mt] = d.useState(""),
            [pt, bt] = d.useState(0),
            gt = le[pt % le.length];
        d.useEffect(() => {
            if (Y.trim()) return;
            const t = setInterval(() => {
                bt(b => (b + 1) % le.length)
            }, 2800);
            return () => clearInterval(t)
        }, [le.length, Y]);
        const Oe = t => {
                mt(t), o ?.(t)
            },
            Ue = () => {
                const t = Y.trim();
                if (!t) return;
                const b = He.getState().subjects,
                    p = t.toLowerCase();
                let x = null;
                for (const te of b)
                    for (const re of te.chapters ?? []) {
                        const Q = re.title.toLowerCase();
                        let ne = 0;
                        Q === p ? ne = 1e3 : Q.startsWith(p) ? ne = 500 : Q.includes(p) && (ne = 200 + Math.max(0, 50 - Math.abs(Q.length - p.length))), ne > 0 && (!x || ne > x.score) && (x = {
                            chapterId: re.id,
                            score: ne
                        })
                    }
                if (x && x.score >= 200) {
                    je(`/syllabus/chapter/${x.chapterId}`), Oe(""), g(!1);
                    return
                }(t.split(" ").length > 3 || /how|what|why|create|make|help|plan|schedule|exam|task/i.test(t)) && J ? (E(!0), setTimeout(() => {
                    be.getState().sendMessage(t, {
                        currentPath: window.location.pathname
                    })
                }, 100)) : l && l(t), Oe(""), g(!1)
            };
        d.useEffect(() => {
            const t = b => {
                (b.metaKey || b.ctrlKey) && b.key === "k" && (b.preventDefault(), g(!0), setTimeout(() => z.current ?.focus(), 100)), b.key === "Escape" && i && g(!1)
            };
            return window.addEventListener("keydown", t), () => window.removeEventListener("keydown", t)
        }, [i]);
        const ft = t => {
            t.key === "Enter" && Ue()
        };
        return d.useEffect(() => {
            const {
                sendNotification: t
            } = qe.getState();
            if (r.length === 0 && t(fe.SYSTEM, "👋 Welcome to Your Dashboard", {
                    body: "Your notification center is now active. I will track your tasks, goals, and study streaks for you!",
                    data: {
                        tag: "welcome"
                    }
                }), M.length === 0 && C.length === 0) return;
            const b = new Date;
            if (M.forEach(p => {
                    if (p.status !== "done" && p.dueDate) {
                        const x = new Date(p.dueDate);
                        if (x < b) {
                            const y = `overdue-${p.id}`;
                            r.some(re => re.data ?.tag === y) || t(fe.TASK_DEADLINE, "🚨 Task Overdue", {
                                body: `"${p.title}" was due on ${x.toLocaleDateString()}.`,
                                data: {
                                    tag: y,
                                    url: "/tasks"
                                }
                            })
                        }
                    }
                }), xe >= P && P > 0) {
                const p = `goal-met-${Z}`;
                r.some(y => y.data ?.tag === p) || t(fe.ACHIEVEMENT, "🏆 Daily Goal Reached!", {
                    body: `Congratulations! You've met your daily focus goal of ${P} minutes.`,
                    data: {
                        tag: p,
                        url: "/analytics"
                    }
                })
            }
            if (ee.streak >= 3) {
                const p = `streak-${ee.streak}-${Z}`;
                r.some(y => y.data ?.tag === p) || t(fe.ACHIEVEMENT, "🔥 On Fire!", {
                    body: `You're on a ${ee.streak}-day study streak. Keep the momentum!`,
                    data: {
                        tag: p,
                        url: "/analytics"
                    }
                })
            }
        }, [M, xe, ee.streak, P, r, C.length, Z]), e.jsxs("header", {
            className: "relative z-40 shrink-0",
            children: [e.jsx("div", {
                className: "app-header min-h-20 border-b border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl",
                children: e.jsxs("div", {
                    className: "min-h-20 flex items-center justify-between gap-2 sm:gap-4 px-[var(--density-page-x)] sm:px-[var(--density-page-x-sm)] lg:px-[var(--density-page-x-lg)] py-2",
                    children: [e.jsxs("div", {
                        className: "flex items-center gap-3 lg:gap-4 flex-1 min-w-0",
                        children: [e.jsx("button", {
                            onClick: () => a(!0),
                            className: "touch-target lg:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors shrink-0",
                            "aria-label": "Open app navigation",
                            children: e.jsx(Jt, {
                                className: "w-5 h-5"
                            })
                        }), e.jsxs("div", {
                            className: "flex-1 min-w-0",
                            children: [e.jsxs("div", {
                                className: "flex items-baseline gap-2 min-w-0",
                                children: [e.jsxs("h1", {
                                    className: "text-lg lg:text-xl font-display font-bold text-zinc-900 dark:text-white truncate",
                                    children: [Le(), ", ", ee.name]
                                }), e.jsxs("div", {
                                    className: "hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 shrink-0",
                                    children: [e.jsx(Je, {
                                        className: "w-3.5 h-3.5 text-amber-500"
                                    }), e.jsxs("span", {
                                        className: "text-xs font-bold text-amber-600 dark:text-amber-400",
                                        children: [ee.streak, "d"]
                                    })]
                                }), !J && e.jsxs(h.button, {
                                    initial: {
                                        opacity: 0,
                                        x: -10
                                    },
                                    animate: {
                                        opacity: 1,
                                        x: 0
                                    },
                                    onClick: () => G(!0),
                                    className: "touch-target flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-500/10 border border-brand-500/20 hover:bg-brand-500/20 transition-all shrink-0 group",
                                    children: [e.jsx(Se, {
                                        className: "w-3.5 h-3.5 text-brand-500 group-hover:scale-110 transition-transform"
                                    }), e.jsx("span", {
                                        className: "text-[10px] font-bold text-brand-600 dark:text-brand-600 dark:text-brand-400 uppercase tracking-widest hidden sm:inline",
                                        children: "Setup AI"
                                    })]
                                }), ve && e.jsxs(h.div, {
                                    initial: {
                                        opacity: 0,
                                        x: -10
                                    },
                                    animate: {
                                        opacity: 1,
                                        x: 0
                                    },
                                    className: "flex max-w-[10rem] items-center gap-1.5 rounded-lg border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-amber-700 dark:text-amber-300 sm:max-w-[18rem]",
                                    children: [e.jsx(Se, {
                                        className: "h-3.5 w-3.5 shrink-0"
                                    }), e.jsx("span", {
                                        className: "truncate text-[10px] font-bold uppercase tracking-widest",
                                        children: "Local mode"
                                    }), e.jsx("button", {
                                        type: "button",
                                        onClick: W,
                                        "aria-label": "Dismiss temporary local session warning",
                                        className: "-mr-1 rounded-md p-0.5 transition-colors hover:bg-amber-500/15 hover:text-amber-900 dark:hover:text-white",
                                        children: e.jsx(Fe, {
                                            className: "h-3.5 w-3.5"
                                        })
                                    })]
                                })]
                            }), e.jsx("div", {
                                className: "relative h-5 overflow-hidden mt-0.5",
                                children: e.jsx(D, {
                                    mode: "wait",
                                    children: e.jsxs(h.div, {
                                        initial: {
                                            y: 20,
                                            opacity: 0
                                        },
                                        animate: {
                                            y: 0,
                                            opacity: 1
                                        },
                                        exit: {
                                            y: -20,
                                            opacity: 0
                                        },
                                        transition: {
                                            duration: .3
                                        },
                                        className: "flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-500 dark:text-zinc-400 min-w-0",
                                        children: [we.createElement(K[N].icon, {
                                            className: `w-3.5 h-3.5 ${K[N].color==="brand"?"text-brand-500":K[N].color==="amber"?"text-amber-500":K[N].color==="red"?"text-red-500":"text-brand-500"}`
                                        }), e.jsx("span", {
                                            className: "font-medium truncate",
                                            children: K[N].label
                                        })]
                                    }, N)
                                })
                            })]
                        })]
                    }), e.jsxs("div", {
                        className: "hidden md:flex items-center gap-2 shrink-0",
                        children: [j, e.jsx(D, {
                            mode: "wait",
                            children: i ? e.jsxs(h.div, {
                                initial: {
                                    width: 0,
                                    opacity: 0
                                },
                                animate: {
                                    width: 360,
                                    opacity: 1
                                },
                                exit: {
                                    width: 0,
                                    opacity: 0
                                },
                                transition: {
                                    duration: .2
                                },
                                className: "flex items-center gap-2 px-3 py-2 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm overflow-hidden",
                                children: [e.jsx(et, {
                                    className: "w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0"
                                }), e.jsx("input", {
                                    ref: z,
                                    type: "text",
                                    value: Y,
                                    placeholder: `Try: ${gt?.value||f}`,
                                    autoFocus: !0,
                                    onChange: t => Oe(t.target.value),
                                    onKeyDown: ft,
                                    className: "bg-transparent border-none outline-none text-sm w-full placeholder-zinc-400 text-zinc-700 dark:text-zinc-200"
                                }), e.jsx("button", {
                                    type: "button",
                                    onClick: Ue,
                                    disabled: !Y.trim(),
                                    className: "p-1.5 rounded-full bg-brand-500 text-white hover:bg-brand-600 disabled:bg-zinc-300 disabled:text-zinc-500 dark:disabled:bg-white/10 dark:disabled:text-zinc-500 transition-colors shrink-0",
                                    "aria-label": "Send search",
                                    children: e.jsx(Zt, {
                                        className: "w-3.5 h-3.5"
                                    })
                                })]
                            }, "expanded") : e.jsxs(h.button, {
                                initial: {
                                    scale: .8,
                                    opacity: 0
                                },
                                animate: {
                                    scale: 1,
                                    opacity: 1
                                },
                                exit: {
                                    scale: .8,
                                    opacity: 0
                                },
                                transition: {
                                    duration: .2
                                },
                                onClick: () => g(!0),
                                className: "p-2.5 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors group relative",
                                "aria-label": "Open search",
                                children: [e.jsx(et, {
                                    className: "w-5 h-5 text-zinc-600 dark:text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors"
                                }), e.jsxs("div", {
                                    className: "absolute -top-1 -right-1 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md border border-zinc-300 dark:border-white/10 bg-white dark:bg-white/5 text-[9px] font-mono text-zinc-500 dark:text-zinc-500 dark:text-zinc-400",
                                    children: [e.jsx(Xt, {
                                        className: "w-2.5 h-2.5"
                                    }), "K"]
                                })]
                            }, "collapsed")
                        })]
                    }), e.jsxs("div", {
                        className: "flex items-center gap-1.5 sm:gap-3 lg:gap-4 shrink-0",
                        children: [e.jsx(yt, {
                            panelClassName: "w-[min(22rem,calc(100vw-2rem))]"
                        }), e.jsx(jt, {
                            panelClassName: "w-[min(20rem,calc(100vw-2rem))]"
                        }), e.jsx(vt, {
                            className: "hidden sm:inline-flex"
                        }), e.jsxs("div", {
                            className: "hidden lg:flex flex-col items-end",
                            children: [e.jsx("div", {
                                className: "font-mono text-base font-bold leading-none text-zinc-800 dark:text-zinc-200",
                                children: u.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })
                            }), e.jsx("div", {
                                className: "text-[10px] uppercase tracking-wider text-zinc-500 font-bold mt-0.5",
                                children: u.toLocaleDateString([], {
                                    weekday: "short",
                                    day: "numeric",
                                    month: "short"
                                })
                            })]
                        }), e.jsxs("div", {
                            className: "hidden xl:flex flex-col items-end gap-1 min-w-[100px]",
                            children: [e.jsxs("div", {
                                className: "flex items-center justify-between w-full",
                                children: [e.jsx("span", {
                                    className: "text-[10px] font-bold text-zinc-500 dark:text-zinc-500 dark:text-zinc-400 uppercase tracking-wider",
                                    children: "Progress"
                                }), e.jsxs("span", {
                                    className: "text-[10px] font-mono font-bold text-zinc-700 dark:text-zinc-600 dark:text-zinc-300",
                                    children: [pe.tasksCompleted, "/", pe.tasksTotal]
                                })]
                            }), e.jsx("div", {
                                className: "h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden",
                                children: e.jsx(h.div, {
                                    initial: {
                                        width: 0
                                    },
                                    animate: {
                                        width: `${pe.completionPercent}%`
                                    },
                                    transition: {
                                        duration: 1,
                                        ease: "easeOut",
                                        delay: .3
                                    },
                                    className: "h-full bg-gradient-to-r from-brand-500 to-brand-600"
                                })
                            })]
                        }), e.jsx("div", {
                            className: "hidden lg:block h-10 w-px bg-zinc-200 dark:bg-white/10"
                        }), e.jsx("div", {
                            className: "hidden lg:flex items-center gap-1.5",
                            children: ke.map((t, b) => {
                                const p = t.icon,
                                    x = t.isSync && q === "syncing",
                                    y = t.isSync && !c,
                                    te = t.label === "AI Assistant";
                                return e.jsx(h.button, {
                                    whileHover: y ? {} : {
                                        scale: 1.05
                                    },
                                    whileTap: y ? {} : {
                                        scale: .95
                                    },
                                    onClick: t.onClick,
                                    disabled: y || x,
                                    className: `p-2.5 rounded-xl transition-all group relative ${te?"bg-gradient-to-br from-brand-500 to-brand-600 border-0 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:from-brand-400 hover:to-brand-500":`bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:bg-zinc-200 dark:hover:bg-white/10 ${y?"opacity-50 cursor-not-allowed":""}`}`,
                                    title: t.label,
                                    children: e.jsx(p, {
                                        className: `w-4 h-4 transition-colors ${te?"text-white":"text-zinc-600 dark:text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white"} ${x?"animate-spin":""}`
                                    })
                                }, b)
                            })
                        }), e.jsx("div", {
                            className: "lg:hidden relative",
                            children: e.jsx(gs, {
                                icon: as,
                                isOpen: i,
                                onClick: () => g(!i),
                                children: e.jsx("div", {
                                    className: "absolute right-0 top-full mt-2 w-[min(14rem,calc(100vw-1.5rem))] bg-white dark:bg-[#0e0e11] border border-zinc-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden z-50 p-1",
                                    children: ke.map((t, b) => {
                                        const p = t.icon,
                                            x = t.isSync && q === "syncing",
                                            y = t.isSync && !c;
                                        return e.jsxs("button", {
                                            onClick: () => {
                                                t.onClick && t.onClick()
                                            },
                                            disabled: y || x,
                                            className: `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${y?"opacity-50 cursor-not-allowed text-zinc-500 dark:text-zinc-400":"text-zinc-700 dark:text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5"}`,
                                            children: [e.jsx(p, {
                                                className: `w-4 h-4 ${x?"animate-spin":""}`
                                            }), e.jsx("span", {
                                                children: t.label
                                            })]
                                        }, b)
                                    })
                                })
                            })
                        }), e.jsxs("div", {
                            className: "relative",
                            children: [e.jsxs("button", {
                                onClick: () => $(!m),
                                className: "relative p-2.5 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors",
                                children: [e.jsx(_e, {
                                    className: "w-5 h-5 text-zinc-600 dark:text-zinc-600 dark:text-zinc-300"
                                }), ce > 0 && e.jsx("span", {
                                    className: "absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full border-2 border-white dark:border-[#09090b] flex items-center justify-center text-[10px] font-bold text-white leading-none",
                                    children: ce > 9 ? "9+" : ce
                                }), r.length === 0 && e.jsx(h.button, {
                                    initial: {
                                        opacity: 0,
                                        y: 5
                                    },
                                    animate: {
                                        opacity: 1,
                                        y: 0
                                    },
                                    onClick: t => {
                                        t.stopPropagation(), qe.getState().sendNotification(fe.ACHIEVEMENT, "⚡ System Verified", {
                                            body: "Notifications are working correctly!"
                                        })
                                    },
                                    className: "absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[7px] font-black text-brand-500 uppercase tracking-widest bg-brand-500/5 px-1.5 py-0.5 rounded border border-brand-500/10 hover:bg-brand-500/10 transition-colors",
                                    children: "Verify"
                                })]
                            }), e.jsx(D, {
                                children: m && e.jsxs(e.Fragment, {
                                    children: [e.jsx("div", {
                                        className: "fixed inset-0 z-40",
                                        onClick: () => $(!1)
                                    }), e.jsxs(h.div, {
                                        initial: {
                                            opacity: 0,
                                            y: 10,
                                            scale: .95
                                        },
                                        animate: {
                                            opacity: 1,
                                            y: 0,
                                            scale: 1
                                        },
                                        exit: {
                                            opacity: 0,
                                            y: 10,
                                            scale: .95
                                        },
                                        transition: {
                                            duration: .2
                                        },
                                        className: "absolute right-0 top-full mt-2 w-[min(20rem,calc(100vw-1.5rem))] bg-white dark:bg-[#0e0e11] border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50",
                                        children: [e.jsxs("div", {
                                            className: "p-4 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between bg-zinc-50/50 dark:bg-white/[0.02]",
                                            children: [e.jsxs("div", {
                                                children: [e.jsx("h3", {
                                                    className: "font-bold text-zinc-900 dark:text-white",
                                                    children: "Notifications"
                                                }), e.jsxs("p", {
                                                    className: "text-xs text-zinc-500 dark:text-zinc-500 dark:text-zinc-400 mt-0.5",
                                                    children: [ce, " unread"]
                                                })]
                                            }), r.length > 0 && e.jsx("button", {
                                                onClick: H,
                                                className: "text-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors",
                                                children: "Mark all as read"
                                            })]
                                        }), e.jsx("div", {
                                            className: "max-h-[min(24rem,calc(100dvh-9rem))] overflow-y-auto",
                                            children: r.length === 0 ? e.jsxs("div", {
                                                className: "p-8 text-center",
                                                children: [e.jsx(_e, {
                                                    className: "w-8 h-8 text-zinc-600 dark:text-zinc-300 dark:text-zinc-700 mx-auto mb-3 opacity-20"
                                                }), e.jsx("p", {
                                                    className: "text-sm text-zinc-500 dark:text-zinc-500",
                                                    children: "No notifications yet"
                                                })]
                                            }) : r.map(t => {
                                                const p = (() => {
                                                    switch (t.category) {
                                                        case "study_reminder":
                                                            return Xe;
                                                        case "focus_session":
                                                            return Ye;
                                                        case "habit_reminder":
                                                            return xt;
                                                        case "task_deadline":
                                                            return Se;
                                                        case "achievement":
                                                            return ye;
                                                        default:
                                                            return _e
                                                    }
                                                })();
                                                return e.jsx("div", {
                                                    onClick: () => v(t.id),
                                                    className: `p-4 border-b border-zinc-100 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors cursor-pointer group ${t.read?"":"bg-brand-500/5 dark:bg-brand-500/5"}`,
                                                    children: e.jsxs("div", {
                                                        className: "flex items-start gap-3",
                                                        children: [e.jsx("div", {
                                                            className: `mt-1 p-2 rounded-lg shrink-0 ${t.read?"bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400":"bg-brand-500/10 text-brand-500"}`,
                                                            children: e.jsx(p, {
                                                                className: "w-3.5 h-3.5"
                                                            })
                                                        }), e.jsxs("div", {
                                                            className: "flex-1 min-w-0",
                                                            children: [e.jsx("p", {
                                                                className: `text-sm ${t.read?"text-zinc-600 dark:text-zinc-500 dark:text-zinc-400":"text-zinc-900 dark:text-white font-medium"}`,
                                                                children: t.body || t.title
                                                            }), e.jsxs("div", {
                                                                className: "flex items-center gap-2 mt-1",
                                                                children: [e.jsx("p", {
                                                                    className: "text-[10px] text-zinc-500 dark:text-zinc-500 uppercase tracking-wider font-bold",
                                                                    children: Ee(t.timestamp)
                                                                }), e.jsx("span", {
                                                                    className: "w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"
                                                                }), e.jsx("p", {
                                                                    className: "text-[10px] text-zinc-500 dark:text-zinc-400 dark:text-zinc-600 uppercase tracking-widest font-medium",
                                                                    children: t.category.replace("_", " ")
                                                                })]
                                                            })]
                                                        }), !t.read && e.jsx("div", {
                                                            className: "w-2 h-2 rounded-full bg-brand-500 mt-1.5 shrink-0"
                                                        })]
                                                    })
                                                }, t.id)
                                            })
                                        }), r.length > 0 && e.jsx("div", {
                                            className: "p-3 bg-zinc-50 dark:bg-white/5 border-t border-zinc-200 dark:border-white/10",
                                            children: e.jsx("button", {
                                                onClick: w,
                                                className: "w-full py-2 text-xs font-bold text-zinc-500 hover:text-red-500 transition-colors uppercase tracking-widest",
                                                children: "Clear All"
                                            })
                                        })]
                                    })]
                                })
                            })]
                        })]
                    })]
                })
            }), e.jsx(ps, {}), e.jsx(D, {
                children: R && R.show && e.jsxs(h.div, {
                    initial: {
                        opacity: 0,
                        y: 20
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    exit: {
                        opacity: 0,
                        y: 20
                    },
                    className: `fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-3 ${R.type==="success"?"bg-brand-500/10 border-brand-500/20 text-brand-500":R.type==="warning"?"bg-amber-500/10 border-amber-500/20 text-amber-500":"bg-red-500/10 border-red-500/20 text-red-500"} backdrop-blur-xl`,
                    children: [R.type === "success" ? e.jsx(Ze, {
                        className: "w-5 h-5"
                    }) : R.type === "warning" ? e.jsx(Se, {
                        className: "w-5 h-5"
                    }) : e.jsx("div", {
                        className: "w-5 h-5 rounded-full border-2 border-current flex items-center justify-center font-bold text-xs",
                        children: "!"
                    }), e.jsx("span", {
                        className: "font-medium text-sm",
                        children: R.message
                    })]
                })
            }), e.jsx(D, {
                children: Ie && e.jsx(e.Fragment, {
                    children: e.jsx(h.div, {
                        initial: {
                            opacity: 0
                        },
                        animate: {
                            opacity: 1
                        },
                        exit: {
                            opacity: 0
                        },
                        onClick: () => G(!1),
                        className: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4",
                        children: e.jsxs(h.div, {
                            initial: {
                                opacity: 0,
                                scale: .95
                            },
                            animate: {
                                opacity: 1,
                                scale: 1
                            },
                            exit: {
                                opacity: 0,
                                scale: .95
                            },
                            onClick: t => t.stopPropagation(),
                            className: "bg-white dark:bg-zinc-900 rounded-2xl p-6 max-w-md w-full border border-zinc-200 dark:border-white/10 shadow-2xl",
                            children: [e.jsxs("div", {
                                className: "flex items-center gap-3 mb-4",
                                children: [e.jsx("div", {
                                    className: "p-3 rounded-xl bg-brand-500/10",
                                    children: e.jsx(tt, {
                                        className: "w-6 h-6 text-brand-500"
                                    })
                                }), e.jsx("h3", {
                                    className: "text-lg font-bold text-zinc-900 dark:text-white",
                                    children: "AI Setup Required"
                                })]
                            }), e.jsx("p", {
                                className: "text-sm text-zinc-600 dark:text-zinc-500 dark:text-zinc-400 mb-6",
                                children: "To use the AI Assistant and AI-powered SWOT analysis, you need to configure your AI engine in settings. Gemini is the recommended default and takes just a minute to set up."
                            }), e.jsxs("div", {
                                className: "flex gap-3",
                                children: [e.jsx("button", {
                                    onClick: () => G(!1),
                                    className: "flex-1 px-4 py-2 rounded-xl border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors text-sm font-medium",
                                    children: "Cancel"
                                }), e.jsx("button", {
                                    onClick: () => {
                                        G(!1), je("/settings", {
                                            state: {
                                                tab: "ai"
                                            }
                                        })
                                    },
                                    className: "flex-1 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition-colors",
                                    children: "Go to AI Settings"
                                })]
                            })]
                        })
                    })
                })
            }), e.jsx(d.Suspense, {
                fallback: null,
                children: e.jsx(bs, {
                    isOpen: $e,
                    onClose: () => oe(!1)
                })
            })]
        })
    };

function gs({
    icon: s,
    children: n,
    isOpen: a,
    onClick: o
}) {
    const [l, f] = d.useState(!1), j = a !== void 0 ? a : l, u = () => {
        o ? o() : f(!l)
    }, k = () => {
        o ? a && o() : f(!1)
    };
    return e.jsxs("div", {
        className: "relative",
        children: [e.jsx("button", {
            onClick: u,
            className: "p-2.5 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors",
            children: e.jsx(s, {
                className: "w-5 h-5 text-zinc-600 dark:text-zinc-600 dark:text-zinc-300"
            })
        }), e.jsx(D, {
            children: j && e.jsxs(e.Fragment, {
                children: [e.jsx("div", {
                    className: "fixed inset-0 z-40",
                    onClick: k
                }), e.jsx(h.div, {
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
                    onClick: k,
                    className: "absolute right-0 top-full mt-2 z-50 min-w-[min(12.5rem,calc(100vw-1.5rem))]",
                    children: n
                })]
            })
        })]
    })
}
export {
    xs as C, Es as D, us as P, As as S, Ms as a, st as u
};