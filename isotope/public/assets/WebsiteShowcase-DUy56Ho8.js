import {
    j as e
} from "./vendor-react-BfU3Zn2J.js";
import {
    ai as n,
    aj as l,
    l as c,
    T as d,
    B as m,
    ak as g,
    U as x,
    b as p,
    S as h,
    al as b,
    am as u
} from "./vendor-icons-CqruUz7g.js";
const i = [{
        title: "Dashboard",
        icon: n,
        accentColor: "#f97316",
        imageSrc: "https://i.postimg.cc/xX7d52Gf/Dashboard.png"
    }, {
        title: "Focus Timer",
        icon: l,
        accentColor: "#f97316",
        imageSrc: "https://i.postimg.cc/hJzBtQd9/Focus-Timer.png"
    }, {
        title: "Analytics",
        icon: c,
        accentColor: "#10b981",
        imageSrc: "https://i.postimg.cc/0z3NnsGK/Focus-Analytics.png"
    }, {
        title: "Question Tracker",
        icon: d,
        accentColor: "#6366f1",
        imageSrc: "https://i.postimg.cc/hXwGsB87/Question-Analytics.png"
    }, {
        title: "Study Materials",
        icon: m,
        accentColor: "#06b6d4",
        imageSrc: "https://i.postimg.cc/VJTNg899/Syllabus-Tracking.png"
    }, {
        title: "Tasks",
        icon: g,
        accentColor: "rgb(var(--brand-500))",
        imageSrc: "https://i.postimg.cc/f39Rgr53/Task-Manager.png"
    }, {
        title: "Community",
        icon: x,
        accentColor: "#a855f7",
        imageSrc: "https://i.postimg.cc/gx50sWyJ/Community-Preview.png"
    }, {
        title: "Exams",
        icon: p,
        accentColor: "#f59e0b",
        imageSrc: "https://i.postimg.cc/sM82mrPf/Exam-Tracking.png"
    }, {
        title: "AI Assistant",
        icon: h,
        accentColor: "#d946ef",
        imageSrc: "https://i.postimg.cc/ZWgqHSPq/AI-Preview.png"
    }, {
        title: "Settings",
        icon: b,
        accentColor: "#71717a",
        imageSrc: "https://i.postimg.cc/bvn4wPWJ/Settings-Preview.png"
    }, {
        title: "Calendar",
        icon: u,
        accentColor: "#0ea5e9",
        imageSrc: "https://i.postimg.cc/LJ7sDpkz/Study-Calendar.png"
    }],
    o = ({
        page: t,
        index: s
    }) => {
        const r = t.icon;
        return e.jsxs("div", {
            className: "group relative flex-shrink-0 w-[300px] md:w-[420px] select-none",
            style: {
                animationDelay: `${s*.1}s`
            },
            children: [e.jsx("div", {
                className: "absolute -inset-1 rounded-2xl opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20 pointer-events-none",
                style: {
                    backgroundColor: t.accentColor
                }
            }), e.jsxs("div", {
                className: "relative flex flex-col rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0c0c0e] shadow-xl transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-2 [transform-style:preserve-3d] [backface-visibility:hidden]",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-2 px-4 py-3 bg-zinc-50 dark:bg-[#111113] border-b border-zinc-200 dark:border-white/10 z-10",
                    children: [e.jsxs("div", {
                        className: "flex gap-1.5",
                        children: [e.jsx("div", {
                            className: "w-2.5 h-2.5 rounded-full bg-red-400 dark:bg-red-500/30"
                        }), e.jsx("div", {
                            className: "w-2.5 h-2.5 rounded-full bg-yellow-400 dark:bg-yellow-500/30"
                        }), e.jsx("div", {
                            className: "w-2.5 h-2.5 rounded-full bg-green-400 dark:bg-green-500/30"
                        })]
                    }), e.jsx("div", {
                        className: "flex-1 flex items-center justify-center",
                        children: e.jsxs("div", {
                            className: "flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm dark:shadow-none min-w-[140px] md:min-w-[200px] justify-center",
                            children: [e.jsx("div", {
                                className: "w-1.5 h-1.5 rounded-full",
                                style: {
                                    background: t.accentColor
                                }
                            }), e.jsxs("span", {
                                className: "text-[10px] font-mono text-zinc-500 truncate lowercase",
                                children: ["isotopeai.in/", t.title.toLowerCase().replace(" ", "-")]
                            })]
                        })
                    })]
                }), e.jsxs("div", {
                    className: "relative aspect-[16/10] bg-zinc-100 dark:bg-zinc-900 overflow-hidden",
                    children: [e.jsx("div", {
                        className: "absolute inset-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900/50",
                        children: e.jsxs("div", {
                            className: "flex flex-col items-center gap-3",
                            children: [e.jsx("div", {
                                className: "p-4 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm",
                                children: e.jsx(r, {
                                    className: "w-8 h-8 opacity-40",
                                    style: {
                                        color: t.accentColor
                                    }
                                })
                            }), e.jsxs("span", {
                                className: "text-[10px] font-bold text-zinc-400 dark:text-zinc-500 tracking-wider uppercase",
                                children: ["Add ", t.title, " Preview"]
                            })]
                        })
                    }), e.jsx("img", {
                        src: t.imageSrc,
                        alt: `${t.title} interface`,
                        width: 1680,
                        height: 1050,
                        className: "absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 z-10 [image-rendering:auto] [transform-style:preserve-3d] [backface-visibility:hidden] brightness-[1.01] contrast-[1.01]",
                        loading: "eager",
                        decoding: "async",
                        fetchPriority: "auto",
                        referrerPolicy: "no-referrer",
                        draggable: !1,
                        onError: a => {
                            a.currentTarget.style.display = "none"
                        }
                    }), e.jsx("div", {
                        className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-20"
                    }), e.jsxs("div", {
                        className: "absolute bottom-4 left-4 right-4 flex items-center gap-3 p-2.5 rounded-2xl bg-white/95 dark:bg-black/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl transform translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-30",
                        children: [e.jsx("div", {
                            className: "w-10 h-10 rounded-xl flex items-center justify-center shadow-inner",
                            style: {
                                backgroundColor: `${t.accentColor}15`
                            },
                            children: e.jsx(r, {
                                className: "w-5 h-5",
                                style: {
                                    color: t.accentColor
                                }
                            })
                        }), e.jsxs("div", {
                            className: "flex flex-col",
                            children: [e.jsx("span", {
                                className: "text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-none mb-1",
                                children: t.title
                            }), e.jsx("span", {
                                className: "text-[10px] text-zinc-500 font-medium",
                                children: "Core Interface"
                            })]
                        })]
                    })]
                })]
            })]
        })
    },
    w = () => {
        const t = i.slice(0, 5),
            s = i.slice(5);
        return e.jsxs("section", {
            className: "py-24 lg:py-32 relative overflow-hidden bg-zinc-50/50 dark:bg-[#030303]",
            children: [e.jsx("div", {
                className: "absolute inset-0 pointer-events-none",
                children: e.jsx("div", {
                    className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-orange-500/5 rounded-full blur-[120px]"
                })
            }), e.jsx("div", {
                className: "container mx-auto px-6 relative z-10 mb-20",
                children: e.jsxs("div", {
                    className: "text-center",
                    children: [e.jsxs("div", {
                        className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-[0.2em] mb-8 shadow-sm",
                        children: [e.jsx("div", {
                            className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
                        }), "Seamless Integration"]
                    }), e.jsx("h2", {
                        className: "text-4xl md:text-6xl font-display font-extrabold text-zinc-900 dark:text-white mb-6 tracking-tight",
                        children: "Your Complete Study Ecosystem"
                    }), e.jsx("p", {
                        className: "text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed",
                        children: "Every tool you need, beautifully designed and working together in a single, powerful platform."
                    })]
                })
            }), e.jsxs("div", {
                className: "space-y-8",
                children: [e.jsxs("div", {
                    className: "relative group/marquee overflow-hidden",
                    children: [e.jsx("div", {
                        className: "absolute left-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-r from-zinc-50/50 dark:from-[#030303] to-transparent z-20 pointer-events-none"
                    }), e.jsx("div", {
                        className: "absolute right-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-l from-zinc-50/50 dark:from-[#030303] to-transparent z-20 pointer-events-none"
                    }), e.jsx("div", {
                        className: "flex gap-8 w-max animate-marquee-left hover:[animation-play-state:paused] pr-8 will-change-transform",
                        children: [...t, ...t].map((r, a) => e.jsx(o, {
                            page: r,
                            index: a % t.length
                        }, `r1-${a}`))
                    })]
                }), e.jsxs("div", {
                    className: "relative group/marquee overflow-hidden",
                    children: [e.jsx("div", {
                        className: "absolute left-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-r from-zinc-50/50 dark:from-[#030303] to-transparent z-20 pointer-events-none"
                    }), e.jsx("div", {
                        className: "absolute right-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-l from-zinc-50/50 dark:from-[#030303] to-transparent z-20 pointer-events-none"
                    }), e.jsx("div", {
                        className: "flex gap-8 w-max animate-marquee-right hover:[animation-play-state:paused] pr-8 will-change-transform",
                        children: [...s, ...s].map((r, a) => e.jsx(o, {
                            page: r,
                            index: a % s.length
                        }, `r2-${a}`))
                    })]
                })]
            })]
        })
    };
export {
    w as
    default
};