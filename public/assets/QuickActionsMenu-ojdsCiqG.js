import {
    r,
    j as e
} from "./vendor-react-BfU3Zn2J.js";
import {
    u as E
} from "./useAIStore-B2cv1FZz.js";
import {
    u as C
} from "./App-pJGjDiPw.js";
import {
    u as l
} from "./useUIStore-JhKp1ywd.js";
import {
    A as c,
    m as i
} from "./vendor-motion-Cp_NPzpZ.js";
import {
    X as I,
    aL as S,
    aj as T,
    ak as L,
    b as B,
    aT as R
} from "./vendor-icons-CqruUz7g.js";
import {
    u as G
} from "./vendor-router-CmoTwRnm.js";
import "./useFocusStore-CX_Nyp1h.js";
import "./index-BPYJFSVW.js";
import "./useNotificationStore-BS4df28T.js";
import "./vendor-supabase-DAiUAuun.js";
const H = ({
        className: a
    }) => e.jsxs("svg", {
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: a,
        children: [e.jsx("circle", {
            cx: "12",
            cy: "12",
            r: "1"
        }), e.jsx("path", {
            d: "M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z"
        }), e.jsx("path", {
            d: "M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z"
        })]
    }),
    h = [{
        id: "chat",
        label: "Group Chats",
        icon: S,
        action: "chat"
    }, {
        id: "ai",
        label: "AI Assistant",
        icon: H,
        action: "ai"
    }, {
        id: "timer",
        label: "Start Timer",
        icon: T,
        path: "/focus"
    }, {
        id: "task",
        label: "Add Task",
        icon: L,
        action: "task"
    }, {
        id: "exam",
        label: "Add Exam",
        icon: B,
        action: "exam"
    }, {
        id: "bug",
        label: "Report Bug",
        icon: R,
        action: "bug"
    }],
    J = () => {
        const [a, s] = r.useState(!1), [m, d] = r.useState(null), b = G(), f = E(t => t.toggleAssistant), k = C(t => t.isAuthenticated), w = l(t => t.toggleQuickChat), y = l(t => t.toggleTaskModal), v = l(t => t.toggleExamModal);
        if (r.useEffect(() => {
                const t = o => {
                    o.key === "Escape" && a && s(!1)
                };
                return window.addEventListener("keydown", t), () => window.removeEventListener("keydown", t)
            }, [a]), !k) return null;
        const j = t => {
                s(!1), t.path ? b(t.path) : t.action === "ai" ? f() : t.action === "chat" ? w(!0) : t.action === "task" ? y(!0) : t.action === "exam" ? v(!0) : t.action === "bug" && window.open("https://isotope.featurebase.app", "_blank")
            },
            p = 150,
            x = -70,
            z = 70;
        return e.jsxs("div", {
            className: "fixed right-0 top-1/2 -translate-y-1/2 z-[100] h-[600px] flex items-center pointer-events-none",
            children: [e.jsx("div", {
                className: "absolute right-0 h-full w-4 pointer-events-auto",
                onMouseEnter: () => s(!0)
            }), e.jsx(c, {
                children: !a && e.jsx(i.div, {
                    className: "absolute right-0 w-1.5 h-32 bg-gradient-to-b from-orange-400/40 via-orange-500/80 to-amber-500/40 rounded-l-full blur-[1px] shadow-[-2px_0_15px_rgba(249,115,22,0.4)] pointer-events-none z-[80]",
                    initial: {
                        opacity: 0,
                        x: 5
                    },
                    animate: {
                        opacity: 1,
                        x: 0
                    },
                    exit: {
                        opacity: 0,
                        x: 5
                    },
                    transition: {
                        duration: .4
                    }
                })
            }), e.jsx(c, {
                children: a && e.jsxs(i.div, {
                    className: "absolute right-0 w-[240px] h-[550px] pointer-events-auto flex items-center justify-end",
                    onMouseLeave: () => {
                        s(!1), d(null)
                    },
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    exit: {
                        opacity: 0,
                        transition: {
                            duration: .3,
                            delay: .1
                        }
                    },
                    children: [e.jsxs(i.div, {
                        className: "absolute right-[-70px] w-[140px] h-[140px] bg-zinc-900 dark:bg-white backdrop-blur-2xl rounded-full shadow-[0_0_50px_rgba(0,0,0,0.2)] dark:shadow-[0_0_30px_rgba(255,255,255,0.4)] border border-zinc-800 dark:border-zinc-200 flex items-center pl-8 cursor-pointer z-20 group overflow-hidden",
                        onClick: () => s(!1),
                        initial: {
                            scale: 0,
                            x: 100,
                            opacity: 0
                        },
                        animate: {
                            scale: 1,
                            x: 0,
                            opacity: 1
                        },
                        exit: {
                            scale: 0,
                            x: 100,
                            opacity: 0
                        },
                        transition: {
                            type: "spring",
                            stiffness: 350,
                            damping: 25
                        },
                        children: [e.jsx("div", {
                            className: "absolute inset-0 bg-gradient-to-br from-white/5 to-transparent dark:from-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        }), e.jsx(I, {
                            className: "w-8 h-8 text-white dark:text-zinc-900 transition-colors duration-300 relative z-10",
                            strokeWidth: 2.5
                        })]
                    }), e.jsx("div", {
                        className: "absolute right-[0px] w-0 h-0 z-10",
                        children: h.map((t, o) => {
                            const u = h.length,
                                _ = (z - x) / (u - 1),
                                g = (x + o * _) * Math.PI / 180,
                                A = -(p * Math.cos(g)) - 15,
                                M = p * Math.sin(g),
                                n = m === t.id;
                            return e.jsxs(i.button, {
                                onClick: N => {
                                    N.stopPropagation(), j(t)
                                },
                                className: "absolute w-[56px] h-[56px] -mt-[28px] -mr-[28px] rounded-full flex items-center justify-center cursor-pointer outline-none",
                                initial: {
                                    x: 0,
                                    y: 0,
                                    scale: 0,
                                    opacity: 0
                                },
                                animate: {
                                    x: A,
                                    y: M,
                                    scale: 1,
                                    opacity: 1,
                                    transition: {
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 25,
                                        delay: o * .03 + .05
                                    }
                                },
                                exit: {
                                    x: 0,
                                    y: 0,
                                    scale: 0,
                                    opacity: 0,
                                    transition: {
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 25,
                                        delay: Math.abs(u - 1 - o) * .02
                                    }
                                },
                                onMouseEnter: () => d(t.id),
                                whileHover: {
                                    scale: 1.15
                                },
                                whileTap: {
                                    scale: .9
                                },
                                children: [e.jsx("div", {
                                    className: "absolute inset-0 rounded-full bg-zinc-900 dark:bg-white shadow-[0_8px_20px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_20px_rgba(255,255,255,0.3)] border border-zinc-800 dark:border-zinc-200 transition-all duration-300"
                                }), n && e.jsx(i.div, {
                                    layoutId: "activeGlow",
                                    className: "absolute inset-0 rounded-full bg-zinc-800 dark:bg-zinc-100 border border-zinc-700 dark:border-zinc-300",
                                    transition: {
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 30,
                                        mass: 1
                                    }
                                }), e.jsx(t.icon, {
                                    className: `w-[22px] h-[22px] relative z-10 transition-colors duration-300 ${n?"text-white dark:text-zinc-900":"text-zinc-400 dark:text-zinc-500"}`,
                                    strokeWidth: 2.5
                                }), e.jsx(c, {
                                    children: n && e.jsx(i.div, {
                                        initial: {
                                            opacity: 0,
                                            x: 10,
                                            scale: .9,
                                            filter: "blur(4px)"
                                        },
                                        animate: {
                                            opacity: 1,
                                            x: 0,
                                            scale: 1,
                                            filter: "blur(0px)"
                                        },
                                        exit: {
                                            opacity: 0,
                                            x: 5,
                                            scale: .95,
                                            filter: "blur(2px)"
                                        },
                                        transition: {
                                            duration: .2
                                        },
                                        className: "absolute right-[calc(100%+20px)] px-4 py-2 bg-zinc-950/90 dark:bg-white/95 backdrop-blur-xl border border-zinc-800/50 dark:border-zinc-200/80 text-white dark:text-zinc-900 text-[13px] font-semibold tracking-wide rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.1)] whitespace-nowrap pointer-events-none",
                                        children: t.label
                                    })
                                })]
                            }, t.id)
                        })
                    })]
                })
            })]
        })
    };
export {
    J as QuickActionsMenu
};