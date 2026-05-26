import {
    r as s,
    j as e
} from "./vendor-react-BfU3Zn2J.js";
import {
    b as L
} from "./useGroups-vEjDKzZY.js";
import {
    u as R
} from "./App-pJGjDiPw.js";
import {
    u as g
} from "./useUIStore-JhKp1ywd.js";
import {
    G as A
} from "./GroupChat-j6zM76h9.js";
import {
    c as w
} from "./utils-D8mZnxMk.js";
import {
    A as c,
    m as l
} from "./vendor-motion-Cp_NPzpZ.js";
import {
    aL as O,
    X as I,
    aK as Q,
    aS as W,
    C as M,
    U
} from "./vendor-icons-CqruUz7g.js";
import "./vendor-query-Rjz85D0S.js";
import "./groupCache-DVHvdGlY.js";
import "./demoCommunity-DUJ4Y1zo.js";
import "./index-BPYJFSVW.js";
import "./vendor-supabase-DAiUAuun.js";
import "./vendor-router-CmoTwRnm.js";
import "./vendor-charts-CFLJvnG7.js";
const ee = ({
    className: j
}) => {
    const [n, d] = s.useState(!1), [r, p] = s.useState(null), x = g(t => t.isQuickChatOpen), h = g(t => t.toggleQuickChat), {
        isPremium: k
    } = R(), o = s.useRef(null), [v, y] = s.useState(!1), [N, z] = s.useState(!1), C = s.useRef(null), {
        data: i,
        isLoading: S
    } = L({
        enabled: n
    });
    s.useEffect(() => {
        i && i.length > 0 && !r && p(i[0].id)
    }, [i, r]), s.useEffect(() => {
        const t = a => {
            a.key === "Escape" && (d(!1), h(!1))
        };
        return window.addEventListener("keydown", t), () => window.removeEventListener("keydown", t)
    }, [h]), s.useEffect(() => {
        x !== n && d(x)
    }, [x, n]);
    const u = t => {
            d(t), h(t)
        },
        m = () => {
            if (o.current) {
                const {
                    scrollLeft: t,
                    scrollWidth: a,
                    clientWidth: G
                } = o.current;
                y(t > 0), z(t < a - G - 5)
            }
        };
    s.useEffect(() => {
        m()
    }, [i]);
    const b = t => {
            o.current && (o.current.scrollBy({
                left: t === "left" ? -100 : 100,
                behavior: "smooth"
            }), setTimeout(m, 150))
        },
        E = i ?.find(t => t.id === r),
        f = i ?.slice(0, 3) || [];
    return k() ? e.jsxs(e.Fragment, {
        children: [e.jsx(c, {
            children: n && e.jsx(l.div, {
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
                    duration: .2
                },
                onClick: () => u(!1),
                className: "fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            })
        }), e.jsx("div", {
            ref: C,
            className: w("fixed bottom-0 left-0 right-0 z-50 pointer-events-none", j),
            children: e.jsx(c, {
                mode: "wait",
                children: n ? e.jsxs(l.div, {
                    initial: {
                        opacity: 0,
                        y: 50,
                        scale: .95
                    },
                    animate: {
                        opacity: 1,
                        y: 0,
                        scale: 1
                    },
                    exit: {
                        opacity: 0,
                        y: 50,
                        scale: .95
                    },
                    transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        mass: .8
                    },
                    className: "absolute bottom-[20px] right-4 w-[90vw] sm:w-[400px] lg:w-[450px] bg-white dark:bg-[#0c0c0e] rounded-3xl shadow-2xl border border-zinc-200 dark:border-white/10 overflow-hidden pointer-events-auto",
                    children: [e.jsxs("div", {
                        className: "flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-white/5 bg-white dark:bg-[#0c0c0e]",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-2.5",
                            children: [e.jsx("div", {
                                className: "p-2 rounded-xl bg-brand-500/10 dark:bg-brand-500/20",
                                children: e.jsx(O, {
                                    className: "w-4 h-4 text-brand-600 dark:text-brand-400"
                                })
                            }), e.jsxs("div", {
                                children: [e.jsx("h3", {
                                    className: "text-sm font-semibold text-zinc-900 dark:text-white",
                                    children: E ?.name || "Group Chat"
                                }), e.jsxs("p", {
                                    className: "text-[10px] text-zinc-500",
                                    children: [i ?.length || 0, " groups"]
                                })]
                            })]
                        }), e.jsx("button", {
                            onClick: () => u(!1),
                            className: "p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-all",
                            children: e.jsx(I, {
                                className: "w-4 h-4"
                            })
                        })]
                    }), e.jsx("div", {
                        className: "border-b border-zinc-100 dark:border-white/5 bg-zinc-50/50 dark:bg-white/[0.02] relative",
                        children: S ? e.jsx("div", {
                            className: "flex gap-2 px-3 py-2",
                            children: [1, 2, 3].map(t => e.jsx("div", {
                                className: "h-8 w-24 rounded-lg bg-zinc-200 dark:bg-white/5 animate-pulse flex-shrink-0"
                            }, t))
                        }) : f.length === 0 ? e.jsx("div", {
                            className: "text-center py-3 text-xs text-zinc-500",
                            children: "No groups joined yet"
                        }) : e.jsxs("div", {
                            className: "relative flex items-center",
                            children: [e.jsx(c, {
                                children: v && e.jsx(l.button, {
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
                                    onClick: () => b("left"),
                                    className: "absolute left-1 z-10 p-1 rounded-full bg-white dark:bg-zinc-800 shadow-md border border-zinc-200 dark:border-white/10 text-zinc-500 hover:text-brand-500 transition-colors",
                                    children: e.jsx(Q, {
                                        className: "w-3.5 h-3.5"
                                    })
                                })
                            }), e.jsx("div", {
                                ref: o,
                                onScroll: m,
                                className: "flex gap-1.5 px-3 py-2 overflow-x-auto scrollbar-hide",
                                style: {
                                    scrollbarWidth: "none",
                                    msOverflowStyle: "none",
                                    WebkitOverflowScrolling: "touch"
                                },
                                children: f.map((t, a) => e.jsxs(l.button, {
                                    initial: {
                                        opacity: 0,
                                        scale: .9
                                    },
                                    animate: {
                                        opacity: 1,
                                        scale: 1
                                    },
                                    transition: {
                                        delay: a * .05
                                    },
                                    onClick: () => p(t.id),
                                    className: w("flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex-shrink-0 select-none", r === t.id ? "bg-brand-500 text-white shadow-md shadow-brand-500/20" : "bg-white dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/10 border border-zinc-200 dark:border-white/5"),
                                    children: [t.logo_url ? e.jsx("img", {
                                        src: t.logo_url,
                                        alt: "",
                                        className: "w-4 h-4 rounded-full object-cover"
                                    }) : e.jsx(W, {
                                        className: "w-3.5 h-3.5"
                                    }), e.jsx("span", {
                                        className: "truncate max-w-[100px]",
                                        children: t.name
                                    })]
                                }, t.id))
                            }), e.jsx(c, {
                                children: N && e.jsx(l.button, {
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
                                        x: 10
                                    },
                                    onClick: () => b("right"),
                                    className: "absolute right-1 z-10 p-1 rounded-full bg-white dark:bg-zinc-800 shadow-md border border-zinc-200 dark:border-white/10 text-zinc-500 hover:text-brand-500 transition-colors",
                                    children: e.jsx(M, {
                                        className: "w-3.5 h-3.5"
                                    })
                                })
                            })]
                        })
                    }), e.jsx("div", {
                        className: "h-[400px] sm:h-[450px]",
                        children: r ? e.jsx(A, {
                            groupId: r
                        }) : e.jsxs("div", {
                            className: "h-full flex flex-col items-center justify-center text-center p-6",
                            children: [e.jsx("div", {
                                className: "w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center mb-4",
                                children: e.jsx(U, {
                                    className: "w-8 h-8 text-zinc-400"
                                })
                            }), e.jsx("h3", {
                                className: "text-sm font-medium text-zinc-900 dark:text-white mb-1",
                                children: "No Group Selected"
                            }), e.jsx("p", {
                                className: "text-xs text-zinc-500",
                                children: "Join a group to start chatting"
                            })]
                        })
                    })]
                }, "chat-panel") : null
            })
        })]
    }) : null
};
export {
    ee as
    default
};