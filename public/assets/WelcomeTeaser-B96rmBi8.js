import {
    r,
    j as t
} from "./vendor-react-BfU3Zn2J.js";
import {
    k as d
} from "./App-pJGjDiPw.js";
import {
    A as m,
    m as e
} from "./vendor-motion-Cp_NPzpZ.js";
import {
    aU as h,
    N as u,
    aS as y,
    r as g,
    d as b,
    Z as f
} from "./vendor-icons-CqruUz7g.js";
import "./index-BPYJFSVW.js";
import "./vendor-supabase-DAiUAuun.js";
import "./vendor-router-CmoTwRnm.js";
const z = () => {
    const [o, l] = r.useState(!1), [n, p] = r.useState(!1), [i, c] = r.useState(0);
    r.useEffect(() => {
        let s = null,
            a = null;
        return (async () => await d.getItem("isotope_intro_seen") || (l(!0), s = setTimeout(() => c(1), 500), a = setTimeout(() => c(2), 2500)))(), () => {
            s && clearTimeout(s), a && clearTimeout(a)
        }
    }, []);
    const x = () => {
        n && d.setItem("isotope_intro_seen", "true"), l(!1)
    };
    return o ? t.jsx(m, {
        children: o && t.jsxs(e.div, {
            initial: {
                opacity: 0
            },
            animate: {
                opacity: 1
            },
            exit: {
                opacity: 0,
                scale: 1.05,
                filter: "blur(20px)"
            },
            transition: {
                duration: .8,
                ease: [.22, 1, .36, 1]
            },
            className: "fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden",
            style: {
                background: "radial-gradient(circle at center, #0a0a0a 0%, #000000 100%)"
            },
            children: [t.jsxs("div", {
                className: "absolute inset-0 pointer-events-none",
                children: [t.jsx(e.div, {
                    animate: {
                        opacity: [.2, .4, .2],
                        scale: [1, 1.2, 1]
                    },
                    transition: {
                        duration: 10,
                        repeat: 1 / 0,
                        ease: "easeInOut"
                    },
                    className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] opacity-30",
                    style: {
                        background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)"
                    }
                }), t.jsx(e.div, {
                    animate: {
                        opacity: [.1, .3, .1],
                        scale: [1.1, 1, 1.1]
                    },
                    transition: {
                        duration: 8,
                        repeat: 1 / 0,
                        ease: "easeInOut",
                        delay: 1
                    },
                    className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]",
                    style: {
                        background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 60%)"
                    }
                })]
            }), t.jsx(e.div, {
                initial: {
                    opacity: 0
                },
                animate: {
                    opacity: .03
                },
                transition: {
                    delay: .5,
                    duration: 1
                },
                className: "absolute inset-0 pointer-events-none",
                style: {
                    backgroundImage: `
                linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
                    backgroundSize: "80px 80px",
                    maskImage: "radial-gradient(circle at center, black, transparent 80%)",
                    WebkitMaskImage: "radial-gradient(circle at center, black, transparent 80%)"
                }
            }), [...Array(12)].map((s, a) => t.jsx(e.div, {
                initial: {
                    opacity: 0
                },
                animate: {
                    opacity: [0, .1, 0],
                    y: [0, -100 - a * 20],
                    x: Math.sin(a) * 50,
                    rotate: [0, 360]
                },
                transition: {
                    duration: 8 + a * .5,
                    repeat: 1 / 0,
                    delay: a * .3,
                    ease: "linear"
                },
                className: "absolute pointer-events-none",
                style: {
                    left: `${10+a*7}%`,
                    bottom: "-50px"
                },
                children: a % 3 === 0 ? t.jsx(h, {
                    className: "w-6 h-6 text-white",
                    strokeWidth: .5
                }) : a % 3 === 1 ? t.jsx(u, {
                    className: "w-5 h-5 text-white",
                    strokeWidth: .5
                }) : t.jsx(y, {
                    className: "w-4 h-4 text-white",
                    strokeWidth: .5
                })
            }, a)), t.jsxs(e.svg, {
                initial: {
                    opacity: 0
                },
                animate: {
                    opacity: .15
                },
                transition: {
                    delay: 1,
                    duration: 1
                },
                className: "absolute top-0 left-0 w-64 h-64 pointer-events-none",
                viewBox: "0 0 200 200",
                children: [t.jsx(e.path, {
                    d: "M0,0 L200,0 L0,200 Z",
                    fill: "none",
                    stroke: "white",
                    strokeWidth: "0.5",
                    initial: {
                        pathLength: 0
                    },
                    animate: {
                        pathLength: 1
                    },
                    transition: {
                        duration: 2,
                        delay: 1
                    }
                }), t.jsx(e.circle, {
                    cx: "50",
                    cy: "50",
                    r: "30",
                    fill: "none",
                    stroke: "white",
                    strokeWidth: "0.5",
                    initial: {
                        scale: 0
                    },
                    animate: {
                        scale: 1
                    },
                    transition: {
                        duration: 1,
                        delay: 1.5
                    }
                })]
            }), t.jsxs(e.svg, {
                initial: {
                    opacity: 0
                },
                animate: {
                    opacity: .15
                },
                transition: {
                    delay: 1.2,
                    duration: 1
                },
                className: "absolute bottom-0 right-0 w-64 h-64 pointer-events-none",
                viewBox: "0 0 200 200",
                children: [t.jsx(e.path, {
                    d: "M200,200 L0,200 L200,0 Z",
                    fill: "none",
                    stroke: "white",
                    strokeWidth: "0.5",
                    initial: {
                        pathLength: 0
                    },
                    animate: {
                        pathLength: 1
                    },
                    transition: {
                        duration: 2,
                        delay: 1.2
                    }
                }), t.jsx(e.rect, {
                    x: "140",
                    y: "140",
                    width: "40",
                    height: "40",
                    fill: "none",
                    stroke: "white",
                    strokeWidth: "0.5",
                    initial: {
                        rotate: 0
                    },
                    animate: {
                        rotate: 45
                    },
                    transition: {
                        duration: 1,
                        delay: 1.7
                    }
                })]
            }), t.jsx(e.div, {
                animate: {
                    y: ["-100%", "200%"],
                    opacity: [0, .15, 0]
                },
                transition: {
                    duration: 4,
                    repeat: 1 / 0,
                    ease: "linear",
                    repeatDelay: 2
                },
                className: "absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none"
            }), t.jsxs("div", {
                className: "relative z-10 max-w-6xl w-full px-6 text-center",
                children: [t.jsxs("div", {
                    className: "mb-8 relative",
                    children: [t.jsx(e.h1, {
                        initial: {
                            y: 100,
                            opacity: 0
                        },
                        animate: i >= 1 ? {
                            y: 0,
                            opacity: 1
                        } : {},
                        transition: {
                            duration: 1,
                            ease: [.22, 1, .36, 1]
                        },
                        className: "text-3xl md:text-5xl font-bold tracking-tight text-zinc-400 mb-4",
                        children: "PREPARE TO BE"
                    }), t.jsxs("div", {
                        className: "relative",
                        children: [t.jsx(e.h2, {
                            initial: {
                                opacity: 0,
                                scale: 1.5,
                                filter: "blur(30px)"
                            },
                            animate: i >= 1 ? {
                                opacity: 1,
                                scale: 1,
                                filter: "blur(0px)"
                            } : {},
                            transition: {
                                delay: .3,
                                duration: 1,
                                ease: [.22, 1, .36, 1]
                            },
                            className: "text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white relative z-10 leading-none",
                            style: {
                                textShadow: "0 0 60px rgba(255,255,255,0.3)",
                                whiteSpace: "nowrap"
                            },
                            children: "OVERWHELMED"
                        }), t.jsx(e.div, {
                            animate: {
                                opacity: [.2, .5, .2],
                                scale: [.95, 1.05, .95]
                            },
                            transition: {
                                duration: 3,
                                repeat: 1 / 0,
                                ease: "easeInOut"
                            },
                            className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-32 blur-[60px] -z-10",
                            style: {
                                background: "radial-gradient(ellipse, rgba(255,255,255,0.3) 0%, transparent 70%)"
                            }
                        })]
                    })]
                }), t.jsxs(e.div, {
                    initial: {
                        opacity: 0,
                        y: 20
                    },
                    animate: i >= 1 ? {
                        opacity: 1,
                        y: 0
                    } : {},
                    transition: {
                        delay: .8,
                        duration: .8
                    },
                    className: "mb-16",
                    children: [t.jsx("p", {
                        className: "text-xl md:text-2xl text-zinc-300 font-light tracking-wide mb-2",
                        children: "The ultimate productivity website for students."
                    }), t.jsx("p", {
                        className: "text-base md:text-lg text-zinc-600 tracking-wider",
                        children: "PRECISION · FOCUS · MASTERY"
                    })]
                }), t.jsxs(e.div, {
                    initial: {
                        opacity: 0,
                        y: 30
                    },
                    animate: i >= 2 ? {
                        opacity: 1,
                        y: 0
                    } : {},
                    transition: {
                        duration: .8
                    },
                    className: "flex flex-col items-center gap-6",
                    children: [t.jsxs("button", {
                        onClick: x,
                        className: "group relative px-10 py-5 bg-white text-black font-bold text-base md:text-lg rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]",
                        children: [t.jsx("div", {
                            className: "absolute inset-0 bg-gradient-to-r from-zinc-100 to-white opacity-0 group-hover:opacity-100 transition-opacity"
                        }), t.jsxs("span", {
                            className: "relative flex items-center gap-3",
                            children: ["ENTER THE SYSTEM", t.jsx(g, {
                                className: "w-5 h-5 transition-transform group-hover:translate-x-1"
                            })]
                        })]
                    }), t.jsxs("div", {
                        onClick: () => p(!n),
                        className: "flex items-center gap-3 cursor-pointer group",
                        children: [t.jsx("div", {
                            className: `w-5 h-5 rounded border transition-all ${n?"bg-white border-white":"bg-transparent border-zinc-700 group-hover:border-zinc-500"}`,
                            children: n && t.jsx(e.div, {
                                initial: {
                                    scale: 0
                                },
                                animate: {
                                    scale: 1
                                },
                                transition: {
                                    type: "spring",
                                    damping: 10
                                },
                                children: t.jsx(b, {
                                    className: "w-5 h-5 text-black",
                                    strokeWidth: 3
                                })
                            })
                        }), t.jsx("span", {
                            className: "text-zinc-500 text-sm group-hover:text-zinc-300 transition-colors",
                            children: "Don't show this masterpiece again"
                        })]
                    })]
                })]
            }), t.jsxs(e.div, {
                initial: {
                    opacity: 0,
                    y: 20
                },
                animate: i >= 1 ? {
                    opacity: 1,
                    y: 0
                } : {},
                transition: {
                    delay: 1.5,
                    duration: 1
                },
                className: "absolute bottom-8 left-0 right-0 flex items-center justify-center gap-2 text-zinc-800 text-xs tracking-[0.25em] uppercase font-mono",
                children: [t.jsx(f, {
                    className: "w-3 h-3"
                }), t.jsx("span", {
                    children: "If this can't motivate you, nothing can!"
                })]
            })]
        })
    }) : null
};
export {
    z as WelcomeTeaser
};