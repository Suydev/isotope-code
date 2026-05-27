const __vite__mapDeps = (i, m = __vite__mapDeps, d = (m.f || (m.f = ["assets/FAQ-DuTZR-ip.js", "assets/vendor-react-BfU3Zn2J.js", "assets/useSupportModalStore-BkYsnKtG.js", "assets/App-pJGjDiPw.js", "assets/index-BPYJFSVW.js", "assets/index-CrO6t5EW.css", "assets/vendor-supabase-DAiUAuun.js", "assets/vendor-motion-Cp_NPzpZ.js", "assets/vendor-icons-CqruUz7g.js", "assets/vendor-router-CmoTwRnm.js", "assets/HowItWorks-BS-VN8qB.js", "assets/MobileAppTeaser-BkZkKuC5.js", "assets/Pricing-D9PNd5BR.js", "assets/Story-TXs13Cjc.js", "assets/Testimonials-CnzXcixO.js", "assets/WebsiteShowcase-DUy56Ho8.js", "assets/FeaturesSection-DQ9ZRk3R.js"]))) => i.map(i => d[i]);
import {
    _ as x
} from "./index-BPYJFSVW.js";
import {
    r as s,
    j as e
} from "./vendor-react-BfU3Zn2J.js";
import {
    N as q,
    F as K
} from "./Navbar-BJMJUymI.js";
import {
    u as J,
    c as R
} from "./App-pJGjDiPw.js";
import {
    u as ee
} from "./useSupportModalStore-BkYsnKtG.js";
import {
    u as N,
    b as y,
    c as u,
    m as b
} from "./vendor-motion-Cp_NPzpZ.js";
import {
    I as ae,
    aP as z,
    Z as se,
    x as te,
    a as re,
    aG as _,
    w as le,
    B as ne,
    aC as ie,
    am as de,
    K as S,
    aV as I,
    T as oe,
    l as ce,
    U as A,
    S as xe,
    aW as me
} from "./vendor-icons-CqruUz7g.js";
import {
    L as E
} from "./vendor-router-CmoTwRnm.js";
import {
    L as o,
    S as c
} from "./LazySection-7u6SQGE2.js";
import "./HeadwayUpdatesButton-DUh668tJ.js";
import "./useOnlineStatus-BJOTUERN.js";
import "./PremiumEffects-BX6T03yQ.js";
import "./utils-D8mZnxMk.js";
import "./vendor-charts-CFLJvnG7.js";
import "./vendor-supabase-DAiUAuun.js";
const be = () => {
        const n = s.useRef(null),
            i = s.useRef(null),
            d = s.useRef(null),
            m = J(t => t.isAuthenticated),
            {
                shouldReduceMotion: a,
                isLowEndDevice: v
            } = R(),
            [l, V] = s.useState(!1),
            g = N(0),
            j = N(0),
            w = y(g, {
                stiffness: 150,
                damping: 15
            }),
            k = y(j, {
                stiffness: 150,
                damping: 15
            }),
            W = u(k, [-.5, .5], ["8deg", "-8deg"]),
            Y = u(w, [-.5, .5], ["-8deg", "8deg"]),
            h = u(w, [-.5, .5], ["-20px", "20px"]),
            p = u(k, [-.5, .5], ["-20px", "20px"]);
        s.useEffect(() => {
            if (typeof window > "u" || typeof window.matchMedia != "function") return;
            const t = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)"),
                r = () => {
                    V(t.matches && !a && !v)
                };
            return r(), t.addEventListener("change", r), () => {
                t.removeEventListener("change", r)
            }
        }, [v, a]), s.useEffect(() => () => {
            i.current !== null && window.cancelAnimationFrame(i.current)
        }, []);
        const Z = a ? {} : {
                initial: {
                    opacity: 0,
                    y: 20
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                transition: {
                    duration: .8,
                    ease: [.16, 1, .3, 1]
                }
            },
            B = t => {
                if (!l || !d.current) return;
                const r = d.current;
                i.current !== null && window.cancelAnimationFrame(i.current), i.current = window.requestAnimationFrame(() => {
                    const H = t.clientX - r.left,
                        Q = t.clientY - r.top,
                        U = H / r.width - .5,
                        X = Q / r.height - .5;
                    g.set(U), j.set(X)
                })
            },
            G = () => {
                d.current = null, g.set(0), j.set(0)
            };
        return e.jsxs("section", {
            className: "relative flex min-h-screen items-center overflow-hidden pt-20 lg:min-h-[calc(100dvh+4rem)]",
            children: [e.jsx("div", {
                className: `absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/20 rounded-full blur-[100px] opacity-30 pointer-events-none ${a?"":"animate-blob"}`
            }), e.jsx("div", {
                className: `absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[100px] opacity-30 pointer-events-none ${a?"":"animate-blob animation-delay-2000"}`
            }), e.jsxs("div", {
                className: "container z-10 mx-auto grid items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)] lg:gap-10 xl:gap-16",
                children: [e.jsxs(b.div, { ...Z,
                    className: "max-w-3xl text-center lg:max-w-none lg:text-left",
                    children: [e.jsxs("div", {
                        className: "inline-flex items-center gap-3 px-4 py-2 rounded-full dark:bg-white/5 bg-white/60 backdrop-blur-md border dark:border-white/10 border-black/5 text-xs font-mono dark:text-zinc-300 text-zinc-600 mb-8 hover:scale-105 transition-transform shadow-lg shadow-emerald-500/5 cursor-default group relative",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [e.jsxs("span", {
                                className: "relative flex h-2 w-2",
                                children: [e.jsx("span", {
                                    className: `absolute inline-flex h-full w-full rounded-full dark:bg-emerald-400 bg-emerald-500 opacity-75 ${a?"":"animate-ping"}`
                                }), e.jsx("span", {
                                    className: "relative inline-flex rounded-full h-2 w-2 dark:bg-emerald-400 bg-emerald-500"
                                })]
                            }), e.jsx("span", {
                                className: "tracking-wide font-semibold",
                                children: "100% FREE"
                            })]
                        }), e.jsx("div", {
                            className: "w-px h-3 bg-zinc-300 dark:bg-zinc-700"
                        }), e.jsx("button", {
                            onClick: t => {
                                t.stopPropagation(), ee.getState().openModal()
                            },
                            className: "text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors p-0.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10",
                            title: "Why Premium?",
                            children: e.jsx(ae, {
                                className: "w-4 h-4"
                            })
                        })]
                    }), e.jsxs("h1", {
                        className: "mb-6 font-display text-5xl font-bold leading-[0.95] tracking-tighter text-black dark:text-white sm:text-6xl md:text-7xl lg:text-[clamp(4.5rem,7vw,6.5rem)] xl:mb-8 xl:text-8xl",
                        children: ["Focus. Track. Achieve. ", e.jsx("br", {}), e.jsxs("span", {
                            className: "relative inline-block",
                            children: [e.jsx("span", {
                                className: "relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 via-black to-zinc-500 dark:from-zinc-400 dark:via-white dark:to-zinc-400 animate-shimmer bg-[length:200%_100%]",
                                children: "It's Isotope."
                            }), e.jsx("span", {
                                className: "absolute bottom-2 left-0 w-full h-4 bg-orange-500/20 -z-10 skew-x-12 blur-md"
                            })]
                        })]
                    }), e.jsx("p", {
                        className: "mx-auto mb-5 max-w-2xl text-lg font-medium text-zinc-600 dark:text-zinc-400 sm:text-xl md:text-2xl lg:mx-0",
                        children: "Your all-in-one AI-powered study ecosystem."
                    }), e.jsx("p", {
                        className: "mx-auto mb-8 max-w-xl text-base leading-relaxed text-slate-500 dark:text-slate-400 lg:mx-0 lg:mb-10",
                        children: "AI assistant, syllabus tracking, focus timers, spaced repetition, exam countdown, deep analytics, study groups, gamification, and silent community accountability. Everything you need to ace your exams."
                    }), e.jsxs("div", {
                        className: "mb-10 flex flex-col justify-center gap-4 sm:flex-row lg:mb-12 lg:justify-start xl:gap-5",
                        children: [e.jsxs(E, {
                            to: m ? "/dashboard" : "/auth",
                            className: "group relative overflow-hidden rounded-xl bg-black px-6 py-3.5 text-base font-bold text-white shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] dark:bg-white dark:text-black sm:px-8 sm:py-4 sm:text-lg",
                            children: [e.jsx("div", {
                                className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]"
                            }), e.jsx("span", {
                                className: "flex items-center gap-2 relative z-10",
                                children: m ? "Continue" : "Get Started"
                            })]
                        }), e.jsxs(E, {
                            to: "/demo",
                            className: "group flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-6 py-3.5 text-base font-bold text-black shadow-[0_0_40px_-16px_rgba(132,204,22,0.7)] transition-all duration-300 hover:scale-105 hover:bg-lime-300 sm:px-8 sm:py-4 sm:text-lg",
                            children: [e.jsx(z, {
                                className: "w-4 h-4"
                            }), "Try Demo"]
                        }), e.jsxs("button", {
                            onClick: () => {
                                document.getElementById("features") ?.scrollIntoView({
                                    behavior: "smooth"
                                })
                            },
                            className: "group flex items-center justify-center gap-2 rounded-xl border border-black/20 bg-transparent px-6 py-3.5 font-semibold text-black backdrop-blur-sm transition-all hover:bg-black/5 dark:border-white/20 dark:text-white hover:dark:bg-white/5 sm:px-8 sm:py-4",
                            children: [e.jsx(se, {
                                className: "w-4 h-4"
                            }), "Learn More"]
                        })]
                    }), e.jsxs("div", {
                        className: "mb-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start",
                        children: [e.jsx("a", {
                            href: "https://discord.gg/QfmQGmKJUD",
                            target: "_blank",
                            rel: "noreferrer",
                            className: "rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10",
                            children: "Discord Community"
                        }), e.jsx("a", {
                            href: "https://www.reddit.com/r/Isotope/",
                            target: "_blank",
                            rel: "noreferrer",
                            className: "rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10",
                            children: "Reddit Community"
                        })]
                    }), e.jsxs("div", {
                        className: "flex flex-wrap justify-center lg:justify-start gap-4 text-xs font-medium dark:text-zinc-500 text-zinc-400 border-t dark:border-white/5 border-black/5 pt-6",
                        children: [e.jsxs("span", {
                            className: "flex items-center gap-2",
                            children: [e.jsx("div", {
                                className: "w-1.5 h-1.5 rounded-full bg-emerald-500"
                            }), " AI Assistant"]
                        }), e.jsxs("span", {
                            className: "flex items-center gap-2",
                            children: [e.jsx("div", {
                                className: "w-1.5 h-1.5 rounded-full bg-emerald-500"
                            }), " Syllabus Tracker"]
                        }), e.jsxs("span", {
                            className: "flex items-center gap-2",
                            children: [e.jsx("div", {
                                className: "w-1.5 h-1.5 rounded-full bg-emerald-500"
                            }), " Focus Timers"]
                        }), e.jsxs("span", {
                            className: "flex items-center gap-2",
                            children: [e.jsx("div", {
                                className: `w-1.5 h-1.5 rounded-full bg-orange-500 ${a?"":"animate-pulse"}`
                            }), " ", "Question Tracking"]
                        }), e.jsxs("span", {
                            className: "flex items-center gap-2",
                            children: [e.jsx("div", {
                                className: "w-1.5 h-1.5 rounded-full bg-emerald-500"
                            }), " Spaced Repetition"]
                        }), e.jsxs("span", {
                            className: "flex items-center gap-2",
                            children: [e.jsx("div", {
                                className: "w-1.5 h-1.5 rounded-full bg-emerald-500"
                            }), " Exam Tracker"]
                        }), e.jsxs("span", {
                            className: "flex items-center gap-2",
                            children: [e.jsx("div", {
                                className: "w-1.5 h-1.5 rounded-full bg-emerald-500"
                            }), " Analytics"]
                        }), e.jsxs("span", {
                            className: "flex items-center gap-2",
                            children: [e.jsx("div", {
                                className: "w-1.5 h-1.5 rounded-full bg-emerald-500"
                            }), " Study Groups"]
                        }), e.jsxs("span", {
                            className: "flex items-center gap-2",
                            children: [e.jsx("div", {
                                className: "w-1.5 h-1.5 rounded-full bg-emerald-500"
                            }), " Gamification"]
                        })]
                    })]
                }), e.jsx("div", {
                    className: "perspective-1000 relative hidden items-center justify-center py-14 lg:flex xl:py-20",
                    onMouseEnter: () => {
                        d.current = n.current ?.getBoundingClientRect() ?? null
                    },
                    onMouseMove: B,
                    onMouseLeave: G,
                    ref: n,
                    children: e.jsxs(b.div, {
                        style: {
                            rotateX: l ? W : "0deg",
                            rotateY: l ? Y : "0deg",
                            transformStyle: "preserve-3d",
                            willChange: l ? "transform" : "auto"
                        },
                        className: "relative aspect-[16/11] w-full max-w-[min(34rem,46vw)]",
                        children: [e.jsx("div", {
                            className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-brand-500/20 to-orange-500/20 rounded-full blur-[80px] -z-10",
                            style: {
                                transform: "translateZ(-100px)"
                            }
                        }), e.jsxs("div", {
                            className: "relative w-full h-full dark:bg-[#09090b] bg-white rounded-3xl shadow-2xl border dark:border-white/[0.08] border-black/[0.03] overflow-hidden group transform transition-transform duration-200",
                            children: [e.jsx("div", {
                                className: "absolute inset-0 bg-gradient-to-br from-orange-500/[0.03] via-transparent to-brand-500/[0.03] pointer-events-none"
                            }), e.jsx("div", {
                                className: "absolute inset-0 bg-noise opacity-[0.15] pointer-events-none"
                            }), e.jsx("div", {
                                className: `absolute -top-24 -right-24 w-48 h-48 bg-orange-500/20 rounded-full blur-[60px] ${a?"":"animate-pulse"}`
                            }), e.jsx("div", {
                                className: `absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-[60px] ${a?"":"animate-pulse animation-delay-2000"}`
                            }), e.jsxs("div", {
                                className: "h-14 border-b dark:border-white/[0.06] border-black/[0.04] flex items-center px-5 justify-between dark:bg-white/[0.02] bg-black/[0.01]",
                                children: [e.jsxs("div", {
                                    className: "flex items-center gap-3",
                                    children: [e.jsxs("div", {
                                        className: "flex gap-2",
                                        children: [e.jsx("div", {
                                            className: "w-3 h-3 rounded-full bg-gradient-to-br from-red-400 to-red-500"
                                        }), e.jsx("div", {
                                            className: "w-3 h-3 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500"
                                        }), e.jsx("div", {
                                            className: "w-3 h-3 rounded-full bg-gradient-to-br from-green-400 to-green-500"
                                        })]
                                    }), e.jsx("div", {
                                        className: "h-4 w-[1px] dark:bg-white/10 bg-black/10"
                                    }), e.jsxs("div", {
                                        className: "flex items-center gap-2 px-3 py-1.5 rounded-full dark:bg-orange-500/10 bg-orange-50 dark:border-orange-500/20 border-orange-100",
                                        children: [e.jsx("div", {
                                            className: `w-2 h-2 rounded-full bg-orange-500 ${a?"":"animate-pulse"}`
                                        }), e.jsx("span", {
                                            className: "text-[10px] font-semibold dark:text-orange-300 text-orange-600",
                                            children: "AI Active"
                                        })]
                                    })]
                                }), e.jsxs("div", {
                                    className: "flex items-center gap-2",
                                    children: [e.jsxs("div", {
                                        className: "flex items-center gap-1.5 px-2.5 py-1 rounded-full dark:bg-amber-500/10 bg-amber-50",
                                        children: [e.jsx(te, {
                                            className: "w-3 h-3 text-amber-500"
                                        }), e.jsx("span", {
                                            className: "text-[9px] font-bold text-amber-600 dark:text-amber-400",
                                            children: "SCHOLAR"
                                        })]
                                    }), e.jsx("div", {
                                        className: "w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-brand-500 flex items-center justify-center text-[10px] font-bold text-white",
                                        children: "A"
                                    })]
                                })]
                            }), e.jsxs("div", {
                                className: "p-4 h-[calc(100%-56px)] flex flex-col gap-3",
                                children: [e.jsxs("div", {
                                    className: "flex gap-3",
                                    children: [e.jsxs("div", {
                                        className: "flex-1 p-4 rounded-2xl dark:bg-gradient-to-br dark:from-orange-500/10 dark:to-brand-500/5 bg-gradient-to-br from-orange-50 to-brand-50 dark:border-orange-500/20 border-orange-100 border flex items-center justify-between",
                                        children: [e.jsxs("div", {
                                            children: [e.jsx("div", {
                                                className: "text-[9px] font-bold uppercase tracking-widest dark:text-orange-400 text-orange-600 mb-2",
                                                children: "Focus Session"
                                            }), e.jsxs("div", {
                                                className: "flex items-baseline gap-1",
                                                children: [e.jsx("span", {
                                                    className: "text-4xl font-mono font-bold dark:text-white text-black",
                                                    children: "25:00"
                                                }), e.jsx("span", {
                                                    className: "text-xs dark:text-zinc-500 text-zinc-400",
                                                    children: "/ 4 sessions"
                                                })]
                                            }), e.jsxs("div", {
                                                className: "flex items-center gap-2 mt-2",
                                                children: [e.jsx("div", {
                                                    className: "flex -space-x-1",
                                                    children: [1, 2, 3].map(t => e.jsx("div", {
                                                        className: "w-4 h-4 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 ring-2 ring-white dark:ring-zinc-900"
                                                    }, t))
                                                }), e.jsx("span", {
                                                    className: "text-[9px] dark:text-zinc-400 text-zinc-500",
                                                    children: "+847 studying"
                                                })]
                                            })]
                                        }), e.jsxs("div", {
                                            className: "relative",
                                            children: [e.jsx("div", {
                                                className: "w-20 h-20 rounded-2xl dark:bg-orange-500/20 bg-orange-100 flex items-center justify-center",
                                                children: e.jsx(re, {
                                                    className: "w-8 h-8 text-orange-500"
                                                })
                                            }), e.jsx("div", {
                                                className: "absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center",
                                                children: e.jsx(z, {
                                                    className: "w-3 h-3 text-white fill-white"
                                                })
                                            })]
                                        })]
                                    }), e.jsxs("div", {
                                        className: "w-32 flex flex-col gap-2",
                                        children: [e.jsxs("div", {
                                            className: "flex-1 p-3 rounded-xl dark:bg-emerald-500/10 bg-emerald-50 dark:border-emerald-500/20 border-emerald-100 border",
                                            children: [e.jsxs("div", {
                                                className: "flex items-center justify-between mb-1",
                                                children: [e.jsx(_, {
                                                    className: "w-3.5 h-3.5 text-orange-500"
                                                }), e.jsx("span", {
                                                    className: "text-[8px] font-bold text-orange-500 uppercase",
                                                    children: "Streak"
                                                })]
                                            }), e.jsx("div", {
                                                className: "text-xl font-bold dark:text-white text-black",
                                                children: "15"
                                            })]
                                        }), e.jsxs("div", {
                                            className: "flex-1 p-3 rounded-xl dark:bg-amber-500/10 bg-amber-50 dark:border-amber-500/20 border-amber-100 border",
                                            children: [e.jsxs("div", {
                                                className: "flex items-center justify-between mb-1",
                                                children: [e.jsx(le, {
                                                    className: "w-3.5 h-3.5 text-amber-500"
                                                }), e.jsx("span", {
                                                    className: "text-[8px] font-bold text-amber-500 uppercase",
                                                    children: "Points"
                                                })]
                                            }), e.jsx("div", {
                                                className: "text-xl font-bold dark:text-white text-black",
                                                children: "2.4k"
                                            })]
                                        })]
                                    })]
                                }), e.jsxs("div", {
                                    className: "flex-1 grid grid-cols-3 gap-3",
                                    children: [e.jsxs("div", {
                                        className: "col-span-1 p-3 rounded-2xl dark:bg-white/[0.03] bg-black/[0.02] dark:border-white/[0.06] border-black/[0.04] border flex flex-col",
                                        children: [e.jsxs("div", {
                                            className: "flex items-center justify-between mb-3",
                                            children: [e.jsxs("div", {
                                                className: "flex items-center gap-2",
                                                children: [e.jsx("div", {
                                                    className: "w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center",
                                                    children: e.jsx(ne, {
                                                        className: "w-3 h-3 text-white"
                                                    })
                                                }), e.jsx("span", {
                                                    className: "text-[10px] font-bold dark:text-white text-black",
                                                    children: "Syllabus"
                                                })]
                                            }), e.jsx("span", {
                                                className: "text-xs font-bold text-emerald-500",
                                                children: "72%"
                                            })]
                                        }), e.jsx("div", {
                                            className: "flex-1 space-y-2",
                                            children: [{
                                                name: "Physics",
                                                progress: 85,
                                                color: "orange"
                                            }, {
                                                name: "Chemistry",
                                                progress: 68,
                                                color: "emerald"
                                            }, {
                                                name: "Math",
                                                progress: 54,
                                                color: "amber"
                                            }, {
                                                name: "Biology",
                                                progress: 78,
                                                color: "pink"
                                            }].map((t, r) => e.jsxs("div", {
                                                className: "space-y-1",
                                                children: [e.jsxs("div", {
                                                    className: "flex justify-between text-[9px]",
                                                    children: [e.jsx("span", {
                                                        className: "dark:text-zinc-400 text-zinc-500",
                                                        children: t.name
                                                    }), e.jsxs("span", {
                                                        className: "font-mono dark:text-zinc-500 text-zinc-400",
                                                        children: [t.progress, "%"]
                                                    })]
                                                }), e.jsx("div", {
                                                    className: "h-1.5 rounded-full dark:bg-white/10 bg-black/10 overflow-hidden",
                                                    children: e.jsx("div", {
                                                        className: `h-full rounded-full bg-${t.color}-500`,
                                                        style: {
                                                            width: `${t.progress}%`
                                                        }
                                                    })
                                                })]
                                            }, r))
                                        }), e.jsx("div", {
                                            className: "mt-3 pt-2 border-t dark:border-white/5 border-black/5",
                                            children: e.jsx("div", {
                                                className: "text-[8px] dark:text-zinc-500 text-zinc-400",
                                                children: "32 topics mastered this week"
                                            })
                                        })]
                                    }), e.jsxs("div", {
                                        className: "col-span-1 flex flex-col gap-3",
                                        children: [e.jsxs("div", {
                                            className: "flex-1 p-3 rounded-2xl dark:bg-white/[0.03] bg-black/[0.02] dark:border-white/[0.06] border-black/[0.04] border",
                                            children: [e.jsxs("div", {
                                                className: "flex items-center justify-between mb-2",
                                                children: [e.jsx("span", {
                                                    className: "text-[10px] font-bold dark:text-white text-black",
                                                    children: "This Week"
                                                }), e.jsxs("div", {
                                                    className: "flex items-center gap-1 text-[9px] text-emerald-500",
                                                    children: [e.jsx(ie, {
                                                        className: "w-3 h-3"
                                                    }), e.jsx("span", {
                                                        children: "+12%"
                                                    })]
                                                })]
                                            }), e.jsx("div", {
                                                className: "h-16 flex items-end justify-between gap-1",
                                                children: [40, 65, 45, 85, 60, 95, 75].map((t, r) => e.jsxs("div", {
                                                    className: "flex-1 rounded-sm relative group cursor-pointer overflow-hidden",
                                                    style: {
                                                        height: `${t}%`
                                                    },
                                                    children: [e.jsx("div", {
                                                        className: `absolute inset-0 ${r===5?"bg-orange-500":"dark:bg-white/30 bg-black/30"}`
                                                    }), r === 5 && e.jsx("div", {
                                                        className: `absolute inset-0 bg-orange-400/50 ${a?"":"animate-pulse"}`
                                                    })]
                                                }, r))
                                            }), e.jsxs("div", {
                                                className: "flex justify-between mt-2 text-[8px] dark:text-zinc-500 text-zinc-400",
                                                children: [e.jsx("span", {
                                                    children: "Mon"
                                                }), e.jsx("span", {
                                                    children: "Tue"
                                                }), e.jsx("span", {
                                                    children: "Wed"
                                                }), e.jsx("span", {
                                                    children: "Thu"
                                                }), e.jsx("span", {
                                                    children: "Fri"
                                                }), e.jsx("span", {
                                                    children: "Sat"
                                                }), e.jsx("span", {
                                                    children: "Sun"
                                                })]
                                            })]
                                        }), e.jsxs("div", {
                                            className: "p-3 rounded-2xl dark:bg-gradient-to-br dark:from-orange-500/10 dark:to-red-500/5 bg-gradient-to-br from-orange-50 to-red-50 dark:border-orange-500/20 border-orange-100 border",
                                            children: [e.jsxs("div", {
                                                className: "flex items-center justify-between mb-2",
                                                children: [e.jsxs("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [e.jsx(de, {
                                                        className: "w-4 h-4 text-orange-500"
                                                    }), e.jsx("span", {
                                                        className: "text-[10px] font-bold dark:text-white text-black",
                                                        children: "JEE Mains"
                                                    })]
                                                }), e.jsx("span", {
                                                    className: "px-2 py-0.5 rounded-full bg-orange-500/20 text-[8px] font-bold text-orange-500",
                                                    children: "D-15"
                                                })]
                                            }), e.jsx("div", {
                                                className: "text-[9px] dark:text-zinc-400 text-zinc-500",
                                                children: "Syllabus: 72% • Mock Tests: 8/12"
                                            })]
                                        })]
                                    }), e.jsxs("div", {
                                        className: "col-span-1 grid grid-cols-2 gap-2",
                                        children: [e.jsxs("div", {
                                            className: "col-span-2 p-3 rounded-2xl dark:bg-gradient-to-br dark:from-orange-500/10 dark:to-brand-500/5 bg-gradient-to-br from-orange-50 to-brand-50 dark:border-orange-500/20 border-orange-100 border flex items-center gap-3",
                                            children: [e.jsx("div", {
                                                className: "w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-brand-600 flex items-center justify-center flex-shrink-0",
                                                children: e.jsx(S, {
                                                    className: "w-5 h-5 text-white"
                                                })
                                            }), e.jsxs("div", {
                                                className: "flex-1 min-w-0",
                                                children: [e.jsx("div", {
                                                    className: "text-[10px] font-bold dark:text-white text-black",
                                                    children: "AI Assistant"
                                                }), e.jsx("div", {
                                                    className: "text-[9px] dark:text-zinc-400 text-zinc-500 truncate",
                                                    children: "Ready to help • 4 models"
                                                })]
                                            }), e.jsx("div", {
                                                className: `w-2 h-2 rounded-full bg-emerald-500 ${a?"":"animate-pulse"}`
                                            })]
                                        }), e.jsxs("div", {
                                            className: "p-2.5 rounded-xl dark:bg-cyan-500/10 bg-cyan-50 dark:border-cyan-500/20 border-cyan-100 border flex flex-col items-center justify-center text-center",
                                            children: [e.jsx(I, {
                                                className: "w-4 h-4 text-cyan-500 mb-1"
                                            }), e.jsx("span", {
                                                className: "text-[9px] font-bold dark:text-white text-black",
                                                children: "Spaced Rep"
                                            }), e.jsx("span", {
                                                className: "text-[8px] dark:text-zinc-400 text-zinc-500",
                                                children: "12 due"
                                            })]
                                        }), e.jsxs("div", {
                                            className: "p-2.5 rounded-xl dark:bg-emerald-500/10 bg-emerald-50 dark:border-emerald-500/20 border-emerald-100 border flex flex-col items-center justify-center text-center",
                                            children: [e.jsx(oe, {
                                                className: "w-4 h-4 text-emerald-500 mb-1"
                                            }), e.jsx("span", {
                                                className: "text-[9px] font-bold dark:text-white text-black",
                                                children: "Tasks"
                                            }), e.jsx("span", {
                                                className: "text-[8px] dark:text-zinc-400 text-zinc-500",
                                                children: "5 pending"
                                            })]
                                        }), e.jsxs("div", {
                                            className: "p-2.5 rounded-xl dark:bg-blue-500/10 bg-blue-50 dark:border-blue-500/20 border-blue-100 border flex flex-col items-center justify-center text-center",
                                            children: [e.jsx(ce, {
                                                className: "w-4 h-4 text-blue-500 mb-1"
                                            }), e.jsx("span", {
                                                className: "text-[9px] font-bold dark:text-white text-black",
                                                children: "Analytics"
                                            }), e.jsx("span", {
                                                className: "text-[8px] dark:text-zinc-400 text-zinc-500",
                                                children: "4.2h today"
                                            })]
                                        }), e.jsxs("div", {
                                            className: "p-2.5 rounded-xl dark:bg-pink-500/10 bg-pink-50 dark:border-pink-500/20 border-pink-100 border flex flex-col items-center justify-center text-center",
                                            children: [e.jsx(A, {
                                                className: "w-4 h-4 text-pink-500 mb-1"
                                            }), e.jsx("span", {
                                                className: "text-[9px] font-bold dark:text-white text-black",
                                                children: "Community"
                                            }), e.jsx("span", {
                                                className: "text-[8px] dark:text-zinc-400 text-zinc-500",
                                                children: "1.2k online"
                                            })]
                                        })]
                                    })]
                                }), e.jsxs("div", {
                                    className: "p-3 rounded-xl dark:bg-gradient-to-r dark:from-orange-500/10 dark:via-brand-500/10 dark:to-orange-500/10 bg-gradient-to-r from-orange-50 via-brand-50 to-orange-50 dark:border-orange-500/20 border-orange-100 border flex items-center gap-3",
                                    children: [e.jsx("div", {
                                        className: "w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-brand-500 flex items-center justify-center flex-shrink-0",
                                        children: e.jsx(xe, {
                                            className: "w-4 h-4 text-white"
                                        })
                                    }), e.jsx("div", {
                                        className: "flex-1 min-w-0",
                                        children: e.jsx("div", {
                                            className: "text-[10px] font-medium dark:text-white text-black",
                                            children: "AI Insight: Your Electromagnetism scores improved 23% this week. Keep it up!"
                                        })
                                    }), e.jsx("button", {
                                        className: "px-3 py-1.5 rounded-lg dark:bg-orange-500 bg-orange-600 text-white text-[9px] font-bold whitespace-nowrap hover:opacity-90 transition-opacity",
                                        children: "View Details"
                                    })]
                                })]
                            })]
                        }), e.jsx(b.div, {
                            style: {
                                x: l ? h : 0,
                                y: l ? p : 0,
                                transform: "translateZ(50px)"
                            },
                            className: "absolute right-0 top-0 z-20 translate-x-4 xl:-right-20 xl:translate-x-0",
                            animate: a ? void 0 : {
                                y: [0, -12, 0]
                            },
                            transition: a ? void 0 : {
                                duration: 4,
                                repeat: 1 / 0,
                                ease: "easeInOut"
                            },
                            children: e.jsx("div", {
                                className: "p-3 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/20",
                                children: e.jsxs("div", {
                                    className: "flex items-center gap-3",
                                    children: [e.jsx("div", {
                                        className: "w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30",
                                        children: e.jsx(me, {
                                            className: "w-5 h-5 text-white"
                                        })
                                    }), e.jsxs("div", {
                                        children: [e.jsx("div", {
                                            className: "text-[9px] font-bold dark:text-zinc-400 text-zinc-500 uppercase tracking-wider",
                                            children: "Achievement"
                                        }), e.jsx("div", {
                                            className: "text-sm font-bold dark:text-white text-black",
                                            children: "15 Day Streak!"
                                        }), e.jsxs("div", {
                                            className: "flex items-center gap-1 mt-0.5",
                                            children: [e.jsx(_, {
                                                className: "w-3 h-3 text-orange-500"
                                            }), e.jsx("span", {
                                                className: "text-[9px] text-orange-500 font-medium",
                                                children: "On fire!"
                                            })]
                                        })]
                                    })]
                                })
                            })
                        }), e.jsx(b.div, {
                            style: {
                                x: l ? h : 0,
                                y: l ? p : 0,
                                transform: "translateZ(30px)"
                            },
                            className: "absolute left-0 top-1/4 z-20 -translate-x-4 xl:-left-20 xl:translate-x-0",
                            animate: a ? void 0 : {
                                y: [0, 10, 0]
                            },
                            transition: a ? void 0 : {
                                duration: 5,
                                repeat: 1 / 0,
                                ease: "easeInOut",
                                delay: 1
                            },
                            children: e.jsx("div", {
                                className: "p-2.5 rounded-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/20",
                                children: e.jsxs("div", {
                                    className: "flex items-center gap-2.5",
                                    children: [e.jsx("div", {
                                        className: "w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-brand-600 flex items-center justify-center",
                                        children: e.jsx(S, {
                                            className: "w-4 h-4 text-white"
                                        })
                                    }), e.jsxs("div", {
                                        children: [e.jsx("div", {
                                            className: "text-[8px] font-bold dark:text-zinc-400 text-zinc-500 uppercase",
                                            children: "AI Suggestion"
                                        }), e.jsx("div", {
                                            className: "text-[11px] font-semibold dark:text-white text-black",
                                            children: "Focus on Mechanics"
                                        })]
                                    })]
                                })
                            })
                        }), e.jsx(b.div, {
                            style: {
                                x: l ? h : 0,
                                y: l ? p : 0,
                                transform: "translateZ(40px)"
                            },
                            className: "absolute bottom-12 right-0 z-20 translate-x-4 xl:-right-16 xl:translate-x-0",
                            animate: a ? void 0 : {
                                y: [0, -8, 0]
                            },
                            transition: a ? void 0 : {
                                duration: 6,
                                repeat: 1 / 0,
                                ease: "easeInOut",
                                delay: 2
                            },
                            children: e.jsx("div", {
                                className: "p-2.5 rounded-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/20",
                                children: e.jsxs("div", {
                                    className: "flex items-center gap-2.5",
                                    children: [e.jsx("div", {
                                        className: "w-9 h-9 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center",
                                        children: e.jsx(A, {
                                            className: "w-4 h-4 text-white"
                                        })
                                    }), e.jsxs("div", {
                                        children: [e.jsx("div", {
                                            className: "text-[8px] font-bold dark:text-zinc-400 text-zinc-500 uppercase",
                                            children: "Community"
                                        }), e.jsx("div", {
                                            className: "text-[11px] font-semibold dark:text-white text-black",
                                            children: "1,247 online"
                                        })]
                                    })]
                                })
                            })
                        }), e.jsx(b.div, {
                            style: {
                                x: l ? h : 0,
                                y: l ? p : 0,
                                transform: "translateZ(25px)"
                            },
                            className: "absolute bottom-0 left-0 z-20 -translate-x-4 xl:-left-16 xl:translate-x-0",
                            animate: a ? void 0 : {
                                y: [0, 8, 0]
                            },
                            transition: a ? void 0 : {
                                duration: 5.5,
                                repeat: 1 / 0,
                                ease: "easeInOut",
                                delay: .5
                            },
                            children: e.jsx("div", {
                                className: "p-2.5 rounded-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/20",
                                children: e.jsxs("div", {
                                    className: "flex items-center gap-2.5",
                                    children: [e.jsx("div", {
                                        className: "w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center",
                                        children: e.jsx(I, {
                                            className: "w-4 h-4 text-white"
                                        })
                                    }), e.jsxs("div", {
                                        children: [e.jsx("div", {
                                            className: "text-[8px] font-bold dark:text-zinc-400 text-zinc-500 uppercase",
                                            children: "Spaced Rep"
                                        }), e.jsx("div", {
                                            className: "text-[11px] font-semibold dark:text-white text-black",
                                            children: "12 cards due"
                                        })]
                                    })]
                                })
                            })
                        })]
                    })
                })]
            })]
        })
    },
    C = () => x(() =>
        import ("./FAQ-DuTZR-ip.js"), __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])),
    P = () => x(() =>
        import ("./HowItWorks-BS-VN8qB.js"), __vite__mapDeps([10, 1, 8, 7])),
    M = () => x(() =>
        import ("./MobileAppTeaser-BkZkKuC5.js"), __vite__mapDeps([11, 1, 8])),
    L = () => x(() =>
        import ("./Pricing-D9PNd5BR.js"), __vite__mapDeps([12, 1, 3, 4, 5, 6, 7, 8, 9, 2])),
    D = () => x(() =>
        import ("./Story-TXs13Cjc.js"), __vite__mapDeps([13, 1, 2, 3, 4, 5, 6, 7, 8, 9])),
    O = () => x(() =>
        import ("./Testimonials-CnzXcixO.js"), __vite__mapDeps([14, 1, 8])),
    F = () => x(() =>
        import ("./WebsiteShowcase-DUy56Ho8.js"), __vite__mapDeps([15, 1, 8])),
    $ = () => x(() =>
        import ("./FeaturesSection-DQ9ZRk3R.js"), __vite__mapDeps([16, 1, 7, 8])),
    he = s.lazy(C),
    pe = s.lazy(P),
    ue = s.lazy(M),
    fe = s.lazy(L),
    ge = s.lazy(D),
    je = s.lazy(O),
    ve = s.lazy(F),
    we = s.lazy($),
    ke = [F, $, M, D, P, L, O, C],
    Ne = (n, i = 1200) => {
        if (typeof window > "u") return () => {};
        const d = window;
        if (typeof d.requestIdleCallback == "function") {
            const a = d.requestIdleCallback(() => n(), {
                timeout: i
            });
            return () => {
                d.cancelIdleCallback ?.(a)
            }
        }
        const m = window.setTimeout(n, i);
        return () => window.clearTimeout(m)
    },
    f = () => e.jsxs("div", {
        className: "relative py-8 lg:py-12 flex items-center justify-center pointer-events-none overflow-hidden",
        children: [e.jsx("div", {
            className: "absolute inset-0 flex items-center justify-center",
            children: e.jsx("div", {
                className: "density-public-container",
                children: e.jsx("div", {
                    className: "w-full h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-800 to-transparent"
                })
            })
        }), e.jsx("div", {
            className: "relative z-10 flex items-center justify-center w-6 h-6 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#000000] shadow-lg",
            children: e.jsx("div", {
                className: "w-1 h-1 rounded-full bg-zinc-400"
            })
        })]
    }),
    T = ({
        text: n
    }) => e.jsxs("div", {
        className: "relative py-12 lg:py-16 overflow-hidden w-full",
        children: [e.jsx("div", {
            className: "absolute inset-0 flex items-center justify-center opacity-5 dark:opacity-20",
            children: e.jsx("div", {
                className: "w-full h-16 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#fbbf24_10px,#fbbf24_20px)] dark:bg-[repeating-linear-gradient(45deg,#000,#000_10px,#fbbf24_10px,#fbbf24_20px)]"
            })
        }), e.jsx("div", {
            className: "absolute inset-0 flex items-center",
            children: e.jsx("div", {
                className: "w-full h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"
            })
        }), e.jsx("div", {
            className: "relative flex justify-center z-10",
            children: e.jsx("div", {
                className: "bg-background px-4",
                children: e.jsx("div", {
                    className: "relative overflow-hidden rounded-full border border-yellow-500/50 bg-white/80 dark:bg-yellow-500/10 px-6 py-2 backdrop-blur-sm shadow-[0_0_25px_rgba(234,179,8,0.2)] group hover:shadow-[0_0_35px_rgba(234,179,8,0.4)] transition-shadow cursor-default",
                    children: e.jsxs("div", {
                        className: "relative z-10 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-700 dark:text-yellow-400",
                        children: [e.jsxs("span", {
                            className: "relative flex h-2 w-2",
                            children: [e.jsx("span", {
                                className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"
                            }), e.jsx("span", {
                                className: "relative inline-flex rounded-full h-2 w-2 bg-yellow-500"
                            })]
                        }), n, e.jsxs("span", {
                            className: "relative flex h-2 w-2",
                            children: [e.jsx("span", {
                                className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"
                            }), e.jsx("span", {
                                className: "relative inline-flex rounded-full h-2 w-2 bg-yellow-500"
                            })]
                        })]
                    })
                })
            })
        })]
    }),
    Fe = ({
        isDark: n,
        toggleTheme: i
    }) => {
        const {
            isPerformanceMode: d
        } = R();
        return s.useEffect(() => {
            if (typeof navigator > "u") return;
            const m = navigator;
            if (!(m.connection ?.saveData || m.connection ?.effectiveType === "2g")) return Ne(() => {
                Promise.allSettled(ke.map(a => a()))
            })
        }, []), e.jsxs("div", {
            className: `relative min-h-screen bg-background text-primary selection:bg-orange-500 selection:text-white overflow-x-hidden ${n?"dark":""}`,
            children: [!d && e.jsxs("div", {
                className: "app-ambient absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-50",
                "aria-hidden": "true",
                children: [e.jsx("div", {
                    className: "absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 dark:bg-orange-900/10 rounded-full blur-[100px] animate-blob"
                }), e.jsx("div", {
                    className: "absolute top-1/3 right-1/4 w-96 h-96 bg-amber-500/10 dark:bg-amber-900/10 rounded-full blur-[100px] animate-blob animation-delay-2000"
                }), e.jsx("div", {
                    className: "absolute bottom-0 left-1/3 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-900/10 rounded-full blur-[100px] animate-blob animation-delay-4000"
                })]
            }), e.jsx(q, {
                isDark: n,
                toggleTheme: i,
                onStart: () => {}
            }), e.jsxs("main", {
                className: "relative z-10",
                children: [e.jsx(be, {}), e.jsx(o, {
                    id: "features-showcase",
                    children: e.jsx(s.Suspense, {
                        fallback: e.jsx(c, {}),
                        children: e.jsx(ve, {})
                    })
                }), e.jsx(o, {
                    id: "features",
                    children: e.jsx(s.Suspense, {
                        fallback: e.jsx(c, {}),
                        children: e.jsx(we, {})
                    })
                }), e.jsx(T, {
                    text: "In Development // Coming Soon"
                }), e.jsx(o, {
                    children: e.jsx(s.Suspense, {
                        fallback: e.jsx(c, {}),
                        children: e.jsx(ue, {})
                    })
                }), e.jsx(T, {
                    text: "Ready to Achieve?"
                }), e.jsx(o, {
                    children: e.jsx(s.Suspense, {
                        fallback: e.jsx(c, {}),
                        children: e.jsx(ge, {})
                    })
                }), e.jsx(f, {}), e.jsx(o, {
                    children: e.jsx(s.Suspense, {
                        fallback: e.jsx(c, {}),
                        children: e.jsx(pe, {})
                    })
                }), e.jsx(f, {}), e.jsx(o, {
                    id: "pricing",
                    children: e.jsx(s.Suspense, {
                        fallback: e.jsx(c, {}),
                        children: e.jsx(fe, {})
                    })
                }), e.jsx(f, {}), e.jsx(o, {
                    children: e.jsx(s.Suspense, {
                        fallback: e.jsx(c, {}),
                        children: e.jsx(je, {})
                    })
                }), e.jsx(f, {}), e.jsx(o, {
                    id: "faq",
                    children: e.jsx(s.Suspense, {
                        fallback: e.jsx(c, {}),
                        children: e.jsx(he, {})
                    })
                })]
            }), e.jsx(K, {})]
        })
    };
export {
    Fe as
    default
};