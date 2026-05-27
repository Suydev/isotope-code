import {
    j as e
} from "./vendor-react-BfU3Zn2J.js";
import {
    Z as r,
    S as i,
    v as n,
    L as o
} from "./vendor-icons-CqruUz7g.js";
const s = ({
        children: t,
        className: a,
        delay: l = 0,
        duration: d = 6
    }) => e.jsx("div", {
        className: `absolute ${a}`,
        children: e.jsx("div", {
            className: "animate-float rounded-[inherit] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl",
            style: {
                animationDelay: `${l}s`,
                animationDuration: `${d}s`
            },
            children: t
        })
    }),
    m = () => e.jsxs("section", {
        className: "min-h-[80vh] relative overflow-hidden bg-black flex items-center justify-center py-20",
        children: [e.jsx("div", {
            className: "absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-900/40 via-black to-black"
        }), e.jsx("div", {
            className: "absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"
        }), e.jsx("div", {
            className: "absolute inset-0 opacity-20",
            style: {
                backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
                backgroundSize: "50px 50px"
            }
        }), e.jsx("div", {
            className: "absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/30 rounded-full blur-[128px] animate-pulse-slow"
        }), e.jsx("div", {
            className: "absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-600/30 rounded-full blur-[128px] animate-pulse-slow",
            style: {
                animationDelay: "1s"
            }
        }), e.jsxs("div", {
            className: "absolute inset-0 overflow-hidden pointer-events-none",
            children: [e.jsx(s, {
                className: "top-[10%] left-[10%] w-48 h-32 rounded-2xl p-4 rotate-[-6deg]",
                delay: .2,
                duration: 7,
                children: e.jsx("div", {
                    className: "h-full flex items-end gap-1",
                    children: [40, 70, 50, 90, 60, 80].map((t, a) => e.jsx("div", {
                        style: {
                            height: `${t}%`
                        },
                        className: "flex-1 bg-gradient-to-t from-brand-500 to-brand-500 rounded-sm opacity-80"
                    }, a))
                })
            }), e.jsx(s, {
                className: "top-[20%] right-[15%] w-64 rounded-full p-3 rotate-[3deg]",
                delay: .4,
                duration: 6.5,
                children: e.jsxs("div", {
                    className: "flex items-center gap-3",
                    children: [e.jsx("div", {
                        className: "w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center",
                        children: e.jsx(r, {
                            className: "w-5 h-5 text-emerald-400"
                        })
                    }), e.jsxs("div", {
                        children: [e.jsx("div", {
                            className: "h-2 w-24 bg-white/20 rounded mb-1.5"
                        }), e.jsx("div", {
                            className: "h-2 w-16 bg-white/10 rounded"
                        })]
                    })]
                })
            }), e.jsx(s, {
                className: "bottom-[15%] left-[20%] w-32 h-32 rounded-full flex items-center justify-center rotate-[-12deg]",
                delay: .6,
                duration: 7.5,
                children: e.jsx("div", {
                    className: "w-24 h-24 rounded-full border-4 border-brand-500/30 border-t-brand-500 flex items-center justify-center",
                    children: e.jsx("span", {
                        className: "font-mono text-xl font-bold text-white",
                        children: "98%"
                    })
                })
            }), e.jsx(s, {
                className: "bottom-[25%] right-[10%] w-56 p-4 rounded-xl rotate-[6deg]",
                delay: .8,
                duration: 8,
                children: [1, 2, 3].map(t => e.jsxs("div", {
                    className: "flex items-center gap-3 mb-3 last:mb-0",
                    children: [e.jsx("div", {
                        className: "w-4 h-4 rounded-full border border-white/20"
                    }), e.jsx("div", {
                        className: "h-2 flex-1 bg-white/10 rounded"
                    })]
                }, t))
            })]
        }), e.jsxs("div", {
            className: "relative z-10 container mx-auto px-6 text-center",
            children: [e.jsx("div", {
                className: "inline-block mb-6",
                children: e.jsxs("div", {
                    className: "flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md",
                    children: [e.jsx(i, {
                        className: "w-4 h-4 text-brand-400"
                    }), e.jsx("span", {
                        className: "text-sm font-bold tracking-widest uppercase bg-gradient-to-r from-brand-300 to-white bg-clip-text text-transparent",
                        children: "Coming Soon"
                    })]
                })
            }), e.jsxs("h2", {
                className: "text-5xl md:text-7xl lg:text-9xl font-display font-bold text-white tracking-tighter mb-8 leading-[0.9]",
                children: ["The Isotope ", e.jsx("br", {}), e.jsx("span", {
                    className: "text-transparent bg-clip-text bg-gradient-to-b from-brand-300 via-brand-300 to-brand-900",
                    children: "Study App"
                })]
            }), e.jsxs("div", {
                className: "max-w-2xl mx-auto space-y-8",
                children: [e.jsxs("p", {
                    className: "text-xl md:text-2xl text-brand-100/70 leading-relaxed font-light",
                    children: ["Your entire study universe, condensed. Powerful tools for deep focus, now in your pocket.", " ", e.jsx("span", {
                        className: "text-white font-medium",
                        children: "It's not just an app. It's an unfair advantage."
                    })]
                }), e.jsxs("div", {
                    className: "flex flex-wrap justify-center gap-4",
                    children: [e.jsxs("div", {
                        className: "px-6 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-3",
                        children: [e.jsx(n, {
                            className: "w-5 h-5 text-brand-400"
                        }), e.jsx("span", {
                            className: "text-sm font-medium text-white/80",
                            children: "Mind-Blowing UI"
                        })]
                    }), e.jsxs("div", {
                        className: "px-6 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-3",
                        children: [e.jsx(o, {
                            className: "w-5 h-5 text-brand-400"
                        }), e.jsx("span", {
                            className: "text-sm font-medium text-white/80",
                            children: "Tailored for Students"
                        })]
                    }), e.jsxs("div", {
                        className: "px-6 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-3",
                        children: [e.jsx(r, {
                            className: "w-5 h-5 text-emerald-400"
                        }), e.jsx("span", {
                            className: "text-sm font-medium text-white/80",
                            children: "Lightning Fast"
                        })]
                    })]
                }), e.jsx("div", {
                    className: "pt-8",
                    children: e.jsxs("button", {
                        disabled: !0,
                        className: "group relative px-10 py-5 bg-white text-black rounded-full font-bold text-lg overflow-hidden transition-transform hover:scale-105 cursor-default",
                        children: [e.jsx("div", {
                            className: "absolute inset-0 bg-gradient-to-r from-brand-400 via-brand-400 to-brand-400 opacity-0 group-hover:opacity-20 transition-opacity"
                        }), e.jsx("span", {
                            className: "relative z-10",
                            children: "Dropping Q4 2026"
                        })]
                    })
                })]
            })]
        })]
    });
export {
    m as
    default
};