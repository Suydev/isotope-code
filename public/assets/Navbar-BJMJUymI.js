import {
    j as e,
    r as n
} from "./vendor-react-BfU3Zn2J.js";
import {
    A as p,
    a$ as k,
    b0 as d,
    b1 as h,
    X as v,
    b2 as w
} from "./vendor-icons-CqruUz7g.js";
import {
    u as j
} from "./App-pJGjDiPw.js";
import {
    S as x,
    O as m,
    H as y,
    T as N
} from "./HeadwayUpdatesButton-DUh668tJ.js";
import {
    P as z
} from "./PremiumEffects-BX6T03yQ.js";
import {
    m as b,
    A as S
} from "./vendor-motion-Cp_NPzpZ.js";
import {
    L as s
} from "./vendor-router-CmoTwRnm.js";
const L = () => e.jsx("footer", {
        className: "dark:bg-black bg-white pt-24 pb-8 relative",
        children: e.jsxs("div", {
            className: "density-public-container relative z-10",
            children: [e.jsxs("div", {
                className: "grid lg:grid-cols-2 gap-[var(--density-stack-gap-lg)] mb-24",
                children: [e.jsxs("div", {
                    children: [e.jsxs("div", {
                        className: "flex items-center gap-2 mb-6 dark:text-white text-black font-display font-bold text-2xl",
                        children: [e.jsx(p, {
                            className: "w-8 h-8"
                        }), " ISOTOPE", e.jsx("span", {
                            className: "opacity-50",
                            children: "AI"
                        })]
                    }), e.jsxs("h3", {
                        className: "text-4xl md:text-5xl font-display font-bold dark:text-white text-black mb-8 leading-tight",
                        children: ["The Study Platform ", e.jsx("br", {}), " for High Performers."]
                    }), e.jsxs("div", {
                        className: "flex flex-wrap gap-4",
                        children: [e.jsx("a", {
                            href: "/auth?mode=signup",
                            className: "px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold hover:scale-105 transition-transform",
                            children: "Get Started Free"
                        }), e.jsx("a", {
                            href: "https://discord.gg/QfmQGmKJUD",
                            target: "_blank",
                            rel: "noreferrer",
                            className: "px-8 py-4 rounded-full border border-zinc-200 dark:border-zinc-800 font-bold dark:text-white text-black hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors",
                            children: "Join Discord"
                        })]
                    })]
                }), e.jsx("div", {
                    className: "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:pl-20",
                    children: [{
                        h: "Platform",
                        l: [{
                            t: "Features",
                            h: "/#features"
                        }, {
                            t: "Pricing",
                            h: "/#pricing"
                        }, {
                            t: "Get Started",
                            h: "/auth?mode=signup"
                        }]
                    }, {
                        h: "Company",
                        l: [{
                            t: "About Us",
                            h: "/about"
                        }, {
                            t: "Mission",
                            h: "/about"
                        }, {
                            t: "Support",
                            h: "mailto:isotopeai@icloud.com?subject=Isotope%20Support"
                        }]
                    }, {
                        h: "Community",
                        l: [{
                            t: "Discord",
                            h: "https://discord.gg/QfmQGmKJUD"
                        }, {
                            t: "Reddit",
                            h: "https://www.reddit.com/r/Isotope/"
                        }, {
                            t: "Instagram Soon",
                            h: "/about"
                        }, {
                            t: "YouTube Soon",
                            h: "/about"
                        }, {
                            t: "X Maybe",
                            h: "/about"
                        }]
                    }, {
                        h: "Resources",
                        l: [{
                            t: "Privacy Policy",
                            h: "/privacy"
                        }, {
                            t: "Terms",
                            h: "/terms"
                        }, {
                            t: "Sitemap",
                            h: "/sitemap.xml"
                        }]
                    }].map((a, o) => e.jsxs("div", {
                        children: [e.jsx("h4", {
                            className: "font-bold dark:text-white text-black mb-6",
                            children: a.h
                        }), e.jsx("ul", {
                            className: "space-y-4",
                            children: a.l.map(t => e.jsx("li", {
                                children: e.jsxs("a", {
                                    href: t.h,
                                    target: t.h.startsWith("http") ? "_blank" : void 0,
                                    rel: t.h.startsWith("http") ? "noreferrer" : void 0,
                                    className: "text-zinc-500 hover:dark:text-white hover:text-black transition-colors flex items-center gap-1 group",
                                    children: [t.t, " ", e.jsx(k, {
                                        className: "w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity -translate-y-1 translate-x-1"
                                    })]
                                })
                            }, t.t))
                        })]
                    }, o))
                })]
            }), e.jsxs("div", {
                className: "border-t border-zinc-200 dark:border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4",
                children: [e.jsxs("div", {
                    className: "flex flex-col md:flex-row items-center gap-4 text-sm text-zinc-500",
                    children: [e.jsx("p", {
                        children: "© 2026 IsotopeAI Inc. Focus. Track. Achieve."
                    }), e.jsx("span", {
                        className: "hidden md:inline text-zinc-300 dark:text-zinc-800",
                        children: "|"
                    }), e.jsxs("p", {
                        className: "font-mono",
                        children: ["v", "0.9.0"]
                    })]
                }), e.jsxs("div", {
                    className: "flex flex-wrap items-center justify-center gap-4 text-sm",
                    children: [e.jsx("a", {
                        href: "/about",
                        className: "text-zinc-500 hover:dark:text-white hover:text-black transition-colors",
                        children: "About"
                    }), e.jsx("a", {
                        href: "mailto:isotopeai@icloud.com?subject=Isotope%20Support",
                        className: "text-zinc-500 hover:dark:text-white hover:text-black transition-colors",
                        children: "Support"
                    }), e.jsx("a", {
                        href: "https://discord.gg/QfmQGmKJUD",
                        target: "_blank",
                        rel: "noreferrer",
                        className: "text-zinc-500 hover:dark:text-white hover:text-black transition-colors",
                        children: "Discord"
                    }), e.jsx("a", {
                        href: "https://www.reddit.com/r/Isotope/",
                        target: "_blank",
                        rel: "noreferrer",
                        className: "text-zinc-500 hover:dark:text-white hover:text-black transition-colors",
                        children: "Reddit"
                    }), e.jsx("a", {
                        href: "/privacy",
                        className: "text-zinc-500 hover:dark:text-white hover:text-black transition-colors",
                        children: "Privacy Policy"
                    }), e.jsx("a", {
                        href: "/terms",
                        className: "text-zinc-500 hover:dark:text-white hover:text-black transition-colors",
                        children: "Terms"
                    })]
                })]
            })]
        })
    }),
    O = ({
        isDark: a,
        toggleTheme: o
    }) => {
        const [t, u] = n.useState(!1), [l, i] = n.useState(!1), {
            isAuthenticated: f,
            isPremium: g
        } = j(), c = f ? "/dashboard" : "/auth?mode=signup";
        return n.useEffect(() => {
            const r = () => {
                u(window.scrollY > 50)
            };
            return window.addEventListener("scroll", r), () => window.removeEventListener("scroll", r)
        }, []), e.jsx(e.Fragment, {
            children: e.jsxs("nav", {
                className: `fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex justify-center ${t?"py-[var(--density-nav-y-scrolled)]":"py-[var(--density-nav-y)]"}`,
                children: [e.jsxs(b.div, {
                    initial: {
                        width: "100%"
                    },
                    animate: {
                        width: t ? "min(calc(100% - 1rem), 1200px)" : "min(calc(100% - 1rem), 1400px)",
                        borderRadius: t ? "99px" : "16px"
                    },
                    className: `
              relative flex items-center justify-between px-[var(--density-navbar-x)] py-[var(--density-navbar-y)] transition-all duration-500
              ${t?"bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-2xl shadow-black/5 dark:shadow-black/50 border border-black/5 dark:border-white/10":"bg-transparent"}
           `,
                    children: [e.jsxs(s, {
                        to: "/",
                        className: "flex items-center gap-2 cursor-pointer group",
                        children: [e.jsxs("div", {
                            className: "relative",
                            children: [e.jsx("div", {
                                className: "absolute inset-0 bg-brand-500/50 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            }), e.jsx(p, {
                                className: "w-8 h-8 dark:text-white text-black relative z-10 transition-transform duration-700 group-hover:rotate-180"
                            })]
                        }), e.jsxs("span", {
                            className: "text-lg font-display font-bold tracking-wider dark:text-white text-black max-[380px]:hidden",
                            children: ["ISOTOPE", e.jsx("span", {
                                className: "opacity-50",
                                children: "AI"
                            })]
                        }), g() && e.jsx(z, {
                            size: "sm"
                        })]
                    }), e.jsxs("div", {
                        className: "hidden md:flex items-center gap-1 p-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-sm",
                        children: [e.jsx(s, {
                            to: "/about",
                            className: "px-5 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors relative group rounded-full hover:bg-white dark:hover:bg-zinc-800",
                            children: "About"
                        }), ["Features", "Pricing", "FAQ"].map(r => e.jsx("a", {
                            href: `/#${r.toLowerCase()}`,
                            className: "px-5 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors relative group rounded-full hover:bg-white dark:hover:bg-zinc-800",
                            children: r
                        }, r)), e.jsx(s, {
                            to: "/privacy",
                            className: "px-5 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors relative group rounded-full hover:bg-white dark:hover:bg-zinc-800",
                            children: "Privacy Policy"
                        })]
                    }), e.jsxs("div", {
                        className: "hidden md:flex items-center gap-3",
                        children: [e.jsx(x, {}), e.jsx(m, {}), e.jsx(y, {}), e.jsx(N, {
                            content: a ? "Light Mode" : "Dark Mode",
                            children: e.jsx("button", {
                                onClick: o,
                                className: "w-10 h-10 rounded-full flex items-center justify-center dark:bg-white/5 bg-black/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors",
                                children: a ? e.jsx(d, {
                                    className: "w-4 h-4 text-yellow-300"
                                }) : e.jsx(h, {
                                    className: "w-4 h-4 text-zinc-600"
                                })
                            })
                        }), e.jsx(s, {
                            to: c,
                            className: "px-6 py-2.5 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-bold shadow-lg hover:shadow-xl transition-shadow",
                            children: "Start Studying"
                        })]
                    }), e.jsxs("div", {
                        className: "md:hidden flex items-center gap-2",
                        children: [e.jsx(x, {
                            buttonClassName: "h-9 w-9",
                            panelClassName: "w-[min(18rem,calc(100vw-2rem))]"
                        }), e.jsx(m, {
                            buttonClassName: "h-9 w-9",
                            panelClassName: "w-[min(18rem,calc(100vw-2rem))]"
                        }), e.jsx("button", {
                            onClick: o,
                            className: "touch-target flex h-9 w-9 items-center justify-center rounded-full dark:bg-white/5 bg-black/5",
                            "aria-label": a ? "Switch to light mode" : "Switch to dark mode",
                            children: a ? e.jsx(d, {
                                className: "w-4 h-4 text-yellow-300"
                            }) : e.jsx(h, {
                                className: "w-4 h-4 text-zinc-700"
                            })
                        }), e.jsx("button", {
                            onClick: () => i(!l),
                            className: "touch-target flex h-9 w-9 items-center justify-center rounded-full dark:text-white text-black",
                            "aria-expanded": l,
                            "aria-label": "Toggle navigation menu",
                            children: l ? e.jsx(v, {}) : e.jsx(w, {})
                        })]
                    })]
                }), e.jsx(S, {
                    children: l && e.jsxs(b.div, {
                        initial: {
                            opacity: 0,
                            y: -20
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        exit: {
                            opacity: 0,
                            y: -20
                        },
                        className: "mobile-scroll-panel absolute top-20 left-3 right-3 rounded-3xl dark:bg-zinc-900 bg-white shadow-2xl border dark:border-white/10 border-black/10 overflow-hidden md:hidden z-50 density-card-surface flex flex-col gap-2",
                        children: [e.jsx(s, {
                            to: "/about",
                            onClick: () => i(!1),
                            className: "p-4 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium dark:text-zinc-300 text-zinc-700",
                            children: "About"
                        }), ["Features", "Pricing", "FAQ"].map(r => e.jsx("a", {
                            href: `/#${r.toLowerCase()}`,
                            className: "p-4 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium dark:text-zinc-300 text-zinc-700",
                            onClick: () => i(!1),
                            children: r
                        }, r)), e.jsx(s, {
                            to: "/privacy",
                            onClick: () => i(!1),
                            className: "p-4 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium dark:text-zinc-300 text-zinc-700",
                            children: "Privacy Policy"
                        }), e.jsx(s, {
                            to: c,
                            onClick: () => i(!1),
                            className: "w-full py-4 rounded-xl dark:bg-white dark:text-black bg-black text-white font-bold mt-2 text-center",
                            children: "Start Free"
                        })]
                    })
                })]
            })
        })
    };
export {
    L as F, O as N
};