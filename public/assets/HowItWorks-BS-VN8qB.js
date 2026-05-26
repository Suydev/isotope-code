import {
    j as e
} from "./vendor-react-BfU3Zn2J.js";
import {
    S as d,
    t as c,
    T as x,
    u as p,
    r as a
} from "./vendor-icons-CqruUz7g.js";
import {
    m as o
} from "./vendor-motion-Cp_NPzpZ.js";
const t = ({
        num: r,
        icon: i,
        title: n,
        text: s,
        delay: l
    }) => e.jsxs(o.div, {
        initial: {
            opacity: 0,
            y: 20
        },
        whileInView: {
            opacity: 1,
            y: 0
        },
        viewport: {
            once: !0,
            margin: "-50px"
        },
        transition: {
            delay: l,
            duration: .5,
            ease: "easeOut"
        },
        className: "group relative h-full",
        children: [e.jsx("div", {
            className: "absolute -inset-0.5 bg-gradient-to-br from-orange-500 to-brand-500 rounded-[2.2rem] opacity-0 group-hover:opacity-50 blur-md transition-opacity duration-500"
        }), e.jsxs("div", {
            className: "relative h-full bg-zinc-50 dark:bg-[#0c0c0e] border border-zinc-200 dark:border-white/10 rounded-[2rem] p-8 md:p-10 overflow-hidden flex flex-col transition-transform duration-500 group-hover:-translate-y-1",
            children: [e.jsx("div", {
                className: "absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            }), e.jsx("div", {
                className: "absolute bottom-0 left-0 w-48 h-48 bg-brand-500/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            }), e.jsx("div", {
                className: "absolute -right-6 -top-6 text-[10rem] font-display font-bold text-zinc-200 dark:text-zinc-800/30 select-none group-hover:text-orange-500/10 transition-colors duration-500 leading-none pointer-events-none",
                children: r
            }), e.jsxs("div", {
                className: "relative z-10 flex flex-col h-full",
                children: [e.jsx("div", {
                    className: "w-16 h-16 mb-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-orange-500/20 transition-all duration-500",
                    children: e.jsx(i, {
                        className: "w-8 h-8 text-zinc-700 dark:text-zinc-300 group-hover:text-orange-500 transition-colors"
                    })
                }), e.jsx("h3", {
                    className: "text-3xl font-display font-bold text-zinc-900 dark:text-white mb-4 tracking-tight",
                    children: n
                }), e.jsx("p", {
                    className: "text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed mb-10",
                    children: s
                }), e.jsxs("div", {
                    className: "mt-auto flex items-center justify-between pt-8 border-t border-zinc-200 dark:border-zinc-800/50",
                    children: [e.jsxs("span", {
                        className: "font-mono text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-orange-500 transition-colors",
                        children: ["Step 0", r]
                    }), e.jsx("div", {
                        className: "w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center group-hover:bg-orange-500 group-hover:border-orange-500 group-hover:text-white transition-all duration-300",
                        children: e.jsx(a, {
                            className: "w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform"
                        })
                    })]
                })]
            })]
        })]
    }),
    h = () => e.jsxs("section", {
        className: "py-32 dark:bg-black bg-white relative overflow-hidden",
        children: [e.jsx("div", {
            className: "absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
        }), e.jsxs("div", {
            className: "container mx-auto px-6 relative z-10",
            children: [e.jsxs("div", {
                className: "text-center mb-24 max-w-3xl mx-auto",
                children: [e.jsxs("div", {
                    className: "inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400",
                    children: [e.jsx(d, {
                        className: "w-3 h-3 text-orange-500"
                    }), "Simple Workflow"]
                }), e.jsxs("h2", {
                    className: "text-5xl md:text-7xl font-display font-bold dark:text-white text-black mb-8 tracking-tight leading-[0.95]",
                    children: ["Simplify Success ", e.jsx("br", {}), " in ", e.jsx("span", {
                        className: "text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-500",
                        children: "3 Steps."
                    })]
                }), e.jsx("p", {
                    className: "text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed",
                    children: "Complexity is the enemy of execution. We stripped away the noise to give you a linear path to mastery."
                })]
            }), e.jsxs("div", {
                className: "grid md:grid-cols-3 gap-8 relative max-w-7xl mx-auto",
                children: [e.jsx(t, {
                    num: "1",
                    icon: c,
                    title: "Join",
                    text: "Create your free account. No credit card, no trials. Access the full productivity suite instantly and join the network.",
                    delay: .1
                }), e.jsx(t, {
                    num: "2",
                    icon: x,
                    title: "Plan",
                    text: "Import your specific exam syllabus. Drag-and-drop topics into your Kanban board. Set your difficulty parameters.",
                    delay: .2
                }), e.jsx(t, {
                    num: "3",
                    icon: p,
                    title: "Focus",
                    text: "Enter deep focus mode. Study, track time, and let the analytics engine build your performance profile automatically.",
                    delay: .3
                })]
            }), e.jsx(o.div, {
                initial: {
                    opacity: 0,
                    y: 20
                },
                whileInView: {
                    opacity: 1,
                    y: 0
                },
                viewport: {
                    once: !0
                },
                className: "mt-24 text-center",
                children: e.jsxs("button", {
                    className: "group relative px-10 py-5 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-lg overflow-hidden hover:scale-105 transition-transform shadow-2xl shadow-orange-500/20",
                    children: [e.jsx("div", {
                        className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-black/10 to-transparent -translate-x-full group-hover:animate-shimmer"
                    }), e.jsxs("span", {
                        className: "flex items-center gap-3",
                        children: ["Start Studying Now ", e.jsx(a, {
                            className: "w-5 h-5 group-hover:translate-x-1 transition-transform"
                        })]
                    })]
                })
            })]
        })]
    });
export {
    h as
    default
};