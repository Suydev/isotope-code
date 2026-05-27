import {
    j as e
} from "./vendor-react-BfU3Zn2J.js";
import {
    u as l
} from "./useSupportModalStore-BkYsnKtG.js";
import {
    m as s
} from "./vendor-motion-Cp_NPzpZ.js";
import {
    B as i,
    I as r,
    af as n,
    f as o
} from "./vendor-icons-CqruUz7g.js";
import "./App-pJGjDiPw.js";
import "./index-BPYJFSVW.js";
import "./vendor-supabase-DAiUAuun.js";
import "./vendor-router-CmoTwRnm.js";
const f = () => e.jsxs("section", {
    className: "py-32 relative overflow-hidden dark:bg-[#050505] bg-zinc-50",
    children: [e.jsx("div", {
        className: "absolute top-0 right-0 w-[50vw] h-full bg-zinc-100 dark:bg-zinc-900/30 skew-x-12 translate-x-1/4 pointer-events-none"
    }), e.jsx("div", {
        className: "container mx-auto px-6 relative z-10",
        children: e.jsxs("div", {
            className: "flex flex-col lg:flex-row gap-20 items-center",
            children: [e.jsxs(s.div, {
                initial: {
                    opacity: 0,
                    x: -30
                },
                whileInView: {
                    opacity: 1,
                    x: 0
                },
                viewport: {
                    once: !0
                },
                className: "lg:w-1/2",
                children: [e.jsxs("div", {
                    className: "inline-flex items-center gap-2 mb-8 opacity-50",
                    children: [e.jsx(i, {
                        className: "w-4 h-4 dark:text-white text-black"
                    }), e.jsx("span", {
                        className: "text-xs font-mono uppercase tracking-[0.3em] dark:text-white text-black",
                        children: "Our Story"
                    })]
                }), e.jsxs("h2", {
                    className: "text-5xl md:text-7xl font-display font-bold dark:text-white text-black mb-10 leading-[0.95] tracking-tight",
                    children: ["We Built What We ", e.jsx("br", {}), e.jsx("span", {
                        className: "text-zinc-400 dark:text-zinc-600",
                        children: "Wish We Had."
                    })]
                }), e.jsxs("div", {
                    className: "space-y-6 text-lg md:text-xl leading-relaxed dark:text-zinc-300 text-zinc-600 font-light",
                    children: [e.jsx("p", {
                        children: "We were students drowning in chaos. Syllabus pdfs on WhatsApp, timers on our phone, notes in Notion, and the crushing anxiety of not knowing where we actually stood."
                    }), e.jsx("p", {
                        className: "dark:text-white text-black font-medium",
                        children: 'The "productivity" tools were the distraction.'
                    }), e.jsx("p", {
                        children: "So we built the solution to fix it. IsotopeAI is your command center. One tab. Deep focus. Real data. No fluff."
                    })]
                }), e.jsx("div", {
                    className: "mt-16 flex items-center gap-8",
                    children: e.jsxs("div", {
                        className: "relative group cursor-default",
                        children: [e.jsx("div", {
                            className: "absolute inset-0 bg-emerald-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"
                        }), e.jsxs("div", {
                            className: "relative flex items-center gap-3 px-6 py-3 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold text-xl uppercase tracking-widest rounded-lg -rotate-3 group-hover:rotate-0 transition-transform bg-emerald-500/5",
                            children: [e.jsx("span", {
                                children: "100% Free Forever"
                            }), e.jsx("button", {
                                onClick: t => {
                                    t.stopPropagation(), l.getState().openModal()
                                },
                                className: "text-emerald-500/50 hover:text-emerald-400 transition-colors p-1 rounded-full hover:bg-emerald-500/10 pointer-events-auto",
                                title: "Why Premium?",
                                children: e.jsx(r, {
                                    className: "w-5 h-5"
                                })
                            })]
                        })]
                    })
                })]
            }), e.jsx(s.div, {
                initial: {
                    opacity: 0,
                    scale: .95
                },
                whileInView: {
                    opacity: 1,
                    scale: 1
                },
                viewport: {
                    once: !0
                },
                className: "lg:w-1/2 w-full",
                children: e.jsxs("div", {
                    className: "relative",
                    children: [e.jsx("div", {
                        className: "absolute top-0 right-0 w-full h-full transform translate-x-4 -translate-y-4 rotate-6 opacity-50 blur-[1px] pointer-events-none",
                        children: e.jsxs("div", {
                            className: "bg-zinc-200 dark:bg-zinc-800 rounded-2xl p-8 h-full border border-zinc-300 dark:border-zinc-700 flex flex-col gap-4",
                            children: [e.jsxs("div", {
                                className: "flex items-center gap-3 text-red-500/50",
                                children: [e.jsx(n, {
                                    className: "w-6 h-6"
                                }), e.jsx("span", {
                                    className: "font-bold text-xl line-through decoration-2",
                                    children: "Chaos"
                                })]
                            }), e.jsxs("div", {
                                className: "space-y-3 opacity-50",
                                children: [e.jsx("div", {
                                    className: "h-4 bg-zinc-400/20 rounded w-3/4"
                                }), e.jsx("div", {
                                    className: "h-4 bg-zinc-400/20 rounded w-full"
                                }), e.jsx("div", {
                                    className: "h-4 bg-zinc-400/20 rounded w-1/2"
                                })]
                            })]
                        })
                    }), e.jsxs("div", {
                        className: "relative bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800",
                        children: [e.jsxs("div", {
                            className: "flex items-center justify-between mb-8",
                            children: [e.jsxs("div", {
                                className: "flex items-center gap-3 text-emerald-500",
                                children: [e.jsx(o, {
                                    className: "w-6 h-6"
                                }), e.jsx("span", {
                                    className: "font-bold text-xl",
                                    children: "Clarity"
                                })]
                            }), e.jsx("div", {
                                className: "px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-mono text-zinc-500",
                                children: "SYSTEM_OPTIMAL"
                            })]
                        }), e.jsx("div", {
                            className: "space-y-6",
                            children: [{
                                label: "Syllabus Coverage",
                                val: "94%",
                                color: "bg-emerald-500"
                            }, {
                                label: "Daily Focus Goal",
                                val: "4.5h / 5h",
                                color: "bg-brand-500"
                            }, {
                                label: "Retention Rate",
                                val: "High",
                                color: "bg-blue-500"
                            }].map((t, a) => e.jsxs("div", {
                                children: [e.jsxs("div", {
                                    className: "flex justify-between text-sm font-medium mb-2 dark:text-zinc-300 text-zinc-700",
                                    children: [e.jsx("span", {
                                        children: t.label
                                    }), e.jsx("span", {
                                        children: t.val
                                    })]
                                }), e.jsx("div", {
                                    className: "h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden",
                                    children: e.jsx(s.div, {
                                        initial: {
                                            width: 0
                                        },
                                        whileInView: {
                                            width: "100%"
                                        },
                                        transition: {
                                            duration: 1,
                                            delay: a * .2
                                        },
                                        className: `h-full ${t.color}`
                                    })
                                })]
                            }, a))
                        }), e.jsxs("div", {
                            className: "mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between",
                            children: [e.jsx("div", {
                                className: "flex -space-x-2",
                                children: [1, 2, 3].map(t => e.jsx("div", {
                                    className: "w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 border-2 border-white dark:border-zinc-900"
                                }, t))
                            }), e.jsxs("div", {
                                className: "text-sm text-zinc-500",
                                children: [e.jsx("span", {
                                    className: "dark:text-white text-black font-bold",
                                    children: "6,000+"
                                }), " logged in users"]
                            })]
                        })]
                    })]
                })
            })]
        })
    })]
});
export {
    f as
    default
};