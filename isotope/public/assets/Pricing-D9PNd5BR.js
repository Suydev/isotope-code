import {
    j as e,
    f as m
} from "./vendor-react-BfU3Zn2J.js";
import {
    u
} from "./App-pJGjDiPw.js";
import {
    u as h
} from "./useSupportModalStore-BkYsnKtG.js";
import {
    m as c
} from "./vendor-motion-Cp_NPzpZ.js";
import {
    S as x,
    s as p,
    w as b,
    Z as g,
    x as f,
    R as v,
    y,
    z as w,
    d as j,
    X as N,
    I as k
} from "./vendor-icons-CqruUz7g.js";
import {
    u as z
} from "./vendor-router-CmoTwRnm.js";
import "./index-BPYJFSVW.js";
import "./vendor-supabase-DAiUAuun.js";
const _ = () => {
        const t = z(),
            o = [{
                name: "The Aspirant",
                price: "₹0",
                period: "/forever",
                description: "Everything you need to study, track, and stay accountable.",
                features: [{
                    name: "FREE access to ALL features",
                    included: !0,
                    hasInfo: !0
                }, {
                    name: "Discord Server Access",
                    included: !0
                }, {
                    name: "Advanced Analytics",
                    included: !0
                }, {
                    name: "Cloud Sync",
                    included: !1,
                    detail: "Local-first only"
                }, {
                    name: "Daily Goals & Streaks",
                    included: !0
                }, {
                    name: "Premium Community Access",
                    included: !1,
                    detail: "Scholar & Ranker only"
                }],
                cta: "Start Free",
                ctaAction: "start-free",
                theme: "zinc",
                popular: !1,
                icon: b
            }, {
                name: "The Scholar",
                price: "₹55",
                period: "/month",
                description: "For students who want a tighter community and better accountability.",
                features: [{
                    name: "Everything in Aspirant",
                    included: !0
                }, {
                    name: "Scholar Gold Badge",
                    included: !0,
                    icon: f
                }, {
                    name: "Special Scholar Role in Discord",
                    included: !0
                }, {
                    name: "Scholar WhatsApp Group",
                    included: !0
                }, {
                    name: "Cloud Sync",
                    included: !0,
                    detail: "Across your devices"
                }, {
                    name: "Complete Access to Community",
                    included: !0
                }, {
                    name: "Study Buddy",
                    included: !0
                }, {
                    name: "Custom Themes",
                    included: !0
                }, {
                    name: "Priority support",
                    included: !0
                }],
                cta: "Join Scholar",
                ctaAction: "upgrade-scholar",
                theme: "amber",
                popular: !0,
                icon: g
            }, {
                name: "The Ranker",
                price: "₹105",
                period: "/mo",
                description: "For students who want the closest circle, strongest accountability, and top-tier access.",
                features: [{
                    name: "Everything in Scholar",
                    included: !0
                }, {
                    name: "Special Ranker Diamond Badge",
                    included: !0,
                    icon: y
                }, {
                    name: "Special Ranker Role in Discord",
                    included: !0
                }, {
                    name: "Special Ranker WhatsApp Group",
                    included: !0
                }, {
                    name: "Top-priority support",
                    included: !0
                }, {
                    name: "Early access to premium drops",
                    included: !0
                }, {
                    name: "3 free monthly JEE/NEET mentorship sessions",
                    included: !0,
                    detail: "Coming soon"
                }],
                cta: "Join Ranker",
                ctaAction: "upgrade-ranker",
                theme: "platinum",
                popular: !1,
                icon: v
            }],
            n = r => {
                switch (r) {
                    case "start-free":
                        t("/auth?mode=signup");
                        break;
                    case "upgrade-scholar":
                        {
                            const {
                                isAuthenticated: a
                            } = u.getState();t(a ? "/subscription?upgrade=scholar" : "/auth?mode=signup&redirect=/subscription?upgrade=scholar");
                            break
                        }
                    case "upgrade-ranker":
                        {
                            const {
                                isAuthenticated: a
                            } = u.getState();t(a ? "/subscription?upgrade=ranker" : "/auth?mode=signup&redirect=/subscription?upgrade=ranker");
                            break
                        }
                }
            };
        return e.jsxs("section", {
            className: "py-32 relative overflow-hidden bg-black text-white",
            children: [e.jsxs("div", {
                className: "absolute inset-0 pointer-events-none",
                children: [e.jsx("div", {
                    className: "absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
                }), e.jsx("div", {
                    className: "absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"
                }), e.jsx("div", {
                    className: "absolute inset-0 bg-gradient-to-r from-black via-transparent to-black"
                }), e.jsx("div", {
                    className: "absolute top-1/4 left-1/4 w-96 h-96 bg-zinc-800/20 rounded-full blur-[128px]"
                }), e.jsx("div", {
                    className: "absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-800/20 rounded-full blur-[128px]"
                })]
            }), e.jsxs("div", {
                className: "container mx-auto px-6 relative z-10",
                children: [e.jsxs("div", {
                    className: "text-center max-w-3xl mx-auto mb-20",
                    children: [e.jsxs(c.div, {
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
                        className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/50 border border-zinc-800 text-xs font-medium text-zinc-400 mb-6 backdrop-blur-sm",
                        children: [e.jsx(x, {
                            className: "w-3 h-3 text-amber-500"
                        }), e.jsx("span", {
                            children: "Unlock Your Potential"
                        })]
                    }), e.jsxs(c.h2, {
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
                        transition: {
                            delay: .1
                        },
                        className: "text-5xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight",
                        children: ["Invest in Your", " ", e.jsx("span", {
                            className: "text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500",
                            children: "Rank."
                        })]
                    }), e.jsx(c.p, {
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
                        transition: {
                            delay: .2
                        },
                        className: "text-zinc-400 text-lg leading-relaxed mb-10 max-w-2xl mx-auto",
                        children: "Keep the core product free, then upgrade only if you want closer community access and stronger accountability."
                    })]
                }), e.jsx("div", {
                    className: "flex justify-center mb-12",
                    children: e.jsxs("button", {
                        onClick: () => h.getState().openModal(),
                        className: "group flex items-center gap-3 px-6 py-3 rounded-full bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 transition-all backdrop-blur-sm shadow-xl shadow-black/50",
                        children: [e.jsx("div", {
                            className: "w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform",
                            children: e.jsx(p, {
                                className: "w-4 h-4 text-rose-400"
                            })
                        }), e.jsx("span", {
                            className: "text-sm font-medium text-zinc-300 group-hover:text-white transition-colors",
                            children: "If features are 100% free, why premium plans?"
                        })]
                    })
                }), e.jsx("div", {
                    className: "grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto mb-32",
                    children: o.map((r, a) => e.jsx(S, {
                        tier: r,
                        index: a,
                        onCtaClick: n
                    }, r.name))
                }), e.jsx("div", {
                    className: "max-w-2xl mx-auto",
                    children: e.jsx(E, {
                        icon: w,
                        title: "Ranker Mentorship",
                        description: "Ranker will include 3 free monthly JEE/NEET mentorship slots soon.",
                        accent: "emerald"
                    })
                })]
            })]
        })
    },
    S = ({
        tier: t,
        index: o,
        onCtaClick: n
    }) => {
        const r = t.theme === "platinum",
            a = t.theme === "amber";
        return e.jsxs(c.div, {
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
            transition: {
                delay: o * .1
            },
            className: `relative group p-1 rounded-3xl transition-all duration-300 ${t.popular?"hover:-translate-y-2":"hover:-translate-y-1"}`,
            children: [e.jsx("div", {
                className: `absolute inset-0 rounded-3xl transition-opacity duration-500 blur-xl ${r?"opacity-40 bg-white/10 group-hover:opacity-100 group-hover:bg-white/20":a?"opacity-30 bg-amber-500/10 group-hover:opacity-100 group-hover:bg-amber-500/20":"opacity-0 bg-zinc-500/10 group-hover:opacity-100"}`
            }), e.jsxs("div", {
                className: `relative h-full p-8 rounded-[22px] bg-zinc-900/80 backdrop-blur-xl border flex flex-col transition-colors ${r?"border-zinc-500/50 group-hover:border-white/50 shadow-lg shadow-white/5":a?"border-amber-500/30 group-hover:border-amber-500/50 shadow-lg shadow-amber-500/5":"border-zinc-800 group-hover:border-zinc-600"}`,
                children: [t.popular && e.jsx("div", {
                    className: "absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-500 text-black text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-500/20",
                    children: "Most Popular"
                }), e.jsxs("div", {
                    className: "mb-8",
                    children: [e.jsx("div", {
                        className: `w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300 ${r?"bg-white text-black":a?"bg-amber-500 text-black":"bg-zinc-800 text-zinc-400"}`,
                        children: e.jsx(t.icon, {
                            className: "w-6 h-6"
                        })
                    }), e.jsx("h3", {
                        className: `text-2xl font-bold mb-2 ${r?"text-white":a?"text-amber-500":"text-zinc-300"}`,
                        children: t.name
                    }), e.jsx("p", {
                        className: "text-sm text-zinc-500 h-10 leading-relaxed",
                        children: t.description
                    })]
                }), e.jsx("div", {
                    className: "mb-8",
                    children: e.jsxs("div", {
                        className: "flex flex-col gap-1",
                        children: [e.jsxs("div", {
                            className: "flex items-baseline gap-1",
                            children: [e.jsx("span", {
                                className: "text-5xl font-bold tracking-tight text-white",
                                children: t.price
                            }), e.jsx("span", {
                                className: "text-zinc-500",
                                children: t.period
                            })]
                        }), t.secondaryPrice && e.jsx("div", {
                            className: `text-sm font-medium ${r?"text-zinc-400":"text-zinc-500"}`,
                            children: t.secondaryPrice
                        })]
                    })
                }), e.jsx("div", {
                    className: "space-y-4 mb-8 flex-1",
                    children: t.features.map((i, d) => e.jsxs("div", {
                        className: "flex items-start gap-3 group/feature",
                        children: [i.included ? e.jsx("div", {
                            className: `mt-1 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${r?"bg-white text-black":a?"bg-amber-500/20 text-amber-500":"bg-zinc-800 text-zinc-500"}`,
                            children: e.jsx(j, {
                                className: "w-3 h-3"
                            })
                        }) : e.jsx("div", {
                            className: "mt-1 w-5 h-5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0",
                            children: e.jsx(N, {
                                className: "w-3 h-3 text-zinc-700"
                            })
                        }), e.jsxs("div", {
                            children: [e.jsxs("div", {
                                className: `text-sm transition-colors flex items-center gap-1.5 ${i.included?"text-zinc-300 group-hover/feature:text-white":"text-zinc-600"}`,
                                children: [e.jsx("span", {
                                    children: i.name
                                }), i.hasInfo && e.jsx("button", {
                                    onClick: s => {
                                        s.stopPropagation(), h.getState().openModal()
                                    },
                                    className: "text-zinc-500 hover:text-amber-400 transition-colors p-0.5 rounded-full hover:bg-zinc-800 flex-shrink-0",
                                    title: "Why Premium?",
                                    children: e.jsx(k, {
                                        className: "w-3.5 h-3.5"
                                    })
                                })]
                            }), i.detail && e.jsx("div", {
                                className: `text-xs font-bold mt-0.5 ${r?"text-white/70":a?"text-amber-500/70":"text-zinc-500"}`,
                                children: i.detail
                            })]
                        })]
                    }, d))
                }), e.jsx("button", {
                    onClick: () => n(t.ctaAction),
                    className: `w-full py-4 rounded-xl font-bold transition-all duration-300 ${r?"bg-white text-black hover:bg-zinc-200 shadow-lg shadow-white/20 hover:scale-[1.02] active:scale-[0.98]":a?"bg-amber-500 text-black hover:bg-amber-400 shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98]":"bg-zinc-800 text-white hover:bg-zinc-700 hover:scale-[1.02] active:scale-[0.98]"}`,
                    children: t.cta
                })]
            })]
        })
    },
    E = ({
        icon: t,
        title: o,
        description: n,
        accent: r
    }) => {
        const a = r === "emerald",
            i = () => a ? n.split(/(3 free monthly JEE\/NEET mentorship sessions|soon)/g).map((s, l) => s === "3 free monthly JEE/NEET mentorship sessions" ? e.jsx("span", {
                className: "text-amber-500 font-bold",
                children: s
            }, l) : s === "soon" ? e.jsx("span", {
                className: "font-bold text-white",
                children: s
            }, l) : e.jsx(m.Fragment, {
                children: s
            }, l)) : n.split("Free").map((d, s, l) => e.jsxs(m.Fragment, {
                children: [d, s < l.length - 1 && e.jsx("span", {
                    className: "text-white font-bold",
                    children: "Free"
                })]
            }, s));
        return e.jsxs(c.div, {
            whileHover: {
                y: -5
            },
            className: `p-8 rounded-2xl border bg-zinc-900/50 backdrop-blur-sm flex items-center gap-6 transition-colors ${a?"border-emerald-500/20 hover:border-emerald-500/40":"border-rose-500/20 hover:border-rose-500/40"}`,
            children: [e.jsx("div", {
                className: `w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${a?"bg-emerald-500/10 text-emerald-500":"bg-rose-500/10 text-rose-500"}`,
                children: e.jsx(t, {
                    className: "w-8 h-8"
                })
            }), e.jsxs("div", {
                children: [e.jsx("h4", {
                    className: "font-bold text-white text-xl mb-2",
                    children: o
                }), e.jsx("p", {
                    className: "text-zinc-400 leading-relaxed",
                    children: i()
                })]
            })]
        })
    };
export {
    _ as
    default
};