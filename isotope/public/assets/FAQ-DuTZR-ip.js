import {
    j as e,
    r as d
} from "./vendor-react-BfU3Zn2J.js";
import {
    u as n
} from "./useSupportModalStore-BkYsnKtG.js";
import {
    s as x,
    I as p,
    M as m,
    P as u
} from "./vendor-icons-CqruUz7g.js";
import {
    m as o,
    A as h
} from "./vendor-motion-Cp_NPzpZ.js";
import "./App-pJGjDiPw.js";
import "./index-BPYJFSVW.js";
import "./vendor-supabase-DAiUAuun.js";
import "./vendor-router-CmoTwRnm.js";
const g = ({
        question: r,
        answer: s,
        index: a,
        hasInfo: i
    }) => {
        const [t, l] = d.useState(!1);
        return e.jsxs(o.div, {
            initial: {
                opacity: 0,
                y: 20
            },
            whileInView: {
                opacity: 1,
                y: 0
            },
            transition: {
                delay: a * .1
            },
            className: `group mb-4 rounded-2xl border transition-all duration-300 overflow-hidden ${t?"bg-zinc-50 dark:bg-zinc-900/80 border-orange-500/30 dark:border-orange-500/30 shadow-lg shadow-orange-500/5":"bg-white dark:bg-black border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"}`,
            children: [e.jsxs("button", {
                onClick: () => l(!t),
                className: "w-full px-6 py-5 text-left flex justify-between items-center",
                children: [e.jsxs("div", {
                    className: "flex items-center gap-4",
                    children: [e.jsxs("span", {
                        className: `font-mono text-xs font-bold uppercase tracking-widest px-2 py-1 rounded ${t?"bg-orange-500 text-white":"bg-zinc-100 dark:bg-zinc-900 text-zinc-500"}`,
                        children: ["Q", a + 1]
                    }), e.jsxs("div", {
                        className: `font-display font-semibold text-lg flex items-center gap-2 transition-colors ${t?"dark:text-white text-black":"text-zinc-700 dark:text-zinc-300"}`,
                        children: [e.jsx("span", {
                            children: r
                        }), i && e.jsx("div", {
                            onClick: c => {
                                c.stopPropagation(), n.getState().openModal()
                            },
                            className: "text-orange-400/50 hover:text-orange-500 transition-colors p-1 rounded-full hover:bg-zinc-800/10 dark:hover:bg-zinc-800/50 flex-shrink-0 cursor-pointer",
                            title: "Why Premium?",
                            children: e.jsx(p, {
                                className: "w-5 h-5"
                            })
                        })]
                    })]
                }), e.jsx("div", {
                    className: `w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${t?"bg-orange-500 border-orange-500 rotate-180":"bg-transparent border-zinc-200 dark:border-zinc-800"}`,
                    children: t ? e.jsx(m, {
                        className: "w-4 h-4 text-white"
                    }) : e.jsx(u, {
                        className: "w-4 h-4 text-zinc-500"
                    })
                })]
            }), e.jsx(h, {
                children: t && e.jsx(o.div, {
                    initial: {
                        height: 0,
                        opacity: 0
                    },
                    animate: {
                        height: "auto",
                        opacity: 1
                    },
                    exit: {
                        height: 0,
                        opacity: 0
                    },
                    transition: {
                        duration: .3,
                        ease: "circOut"
                    },
                    children: e.jsxs("div", {
                        className: "px-6 pb-6 pl-[4.5rem] pr-8",
                        children: [e.jsx("div", {
                            className: "h-px w-full bg-gradient-to-r from-orange-500/20 to-transparent mb-4"
                        }), e.jsx("p", {
                            className: "text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg",
                            children: s
                        })]
                    })
                })
            })]
        })
    },
    z = () => {
        const r = [{
            q: "Is IsotopeAI really free?",
            a: "Yes. The core product stays free for everyone because we believe in equal access to education. Paid plans exist for closer community access, premium roles, WhatsApp groups, sync, and to help keep the platform running.",
            hasInfo: !0
        }, {
            q: "Which exams does this support?",
            a: "The design is universal. Whether you are preparing for JEE, NEET, UPSC, SAT, GRE, or University Finals, you build your own syllabus blocks. If it has a curriculum, IsotopeAI can track it."
        }, {
            q: "Do I have to join a study group?",
            a: "No. IsotopeAI functions perfectly as a solo 'Monk Mode' dashboard. However, our data shows that users who join silent study rooms maintain 40% longer focus streaks on average."
        }, {
            q: "How secure is my performance data?",
            a: "Your data is encrypted and yours alone. We do not sell student profiles to coaching institutes or advertisers. We use aggregated, anonymous data only to improve global difficulty benchmarks."
        }];
        return e.jsxs("section", {
            className: "py-32 dark:bg-zinc-950 bg-zinc-50 relative",
            children: [e.jsx("div", {
                className: "absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none"
            }), e.jsxs("div", {
                className: "container mx-auto px-6 max-w-4xl relative z-10",
                children: [e.jsxs("div", {
                    className: "flex flex-col items-center mb-16 text-center",
                    children: [e.jsx("div", {
                        className: "w-12 h-12 rounded-2xl bg-black dark:bg-white flex items-center justify-center mb-6 shadow-xl rotate-3",
                        children: e.jsx(x, {
                            className: "w-6 h-6 text-white dark:text-black"
                        })
                    }), e.jsx("h2", {
                        className: "text-4xl md:text-5xl font-display font-bold dark:text-white text-black mb-6",
                        children: "Frequently Asked Questions."
                    }), e.jsx("p", {
                        className: "text-zinc-500 dark:text-zinc-400 text-lg max-w-lg",
                        children: "Common queries regarding the Isotope Platform."
                    })]
                }), e.jsx("div", {
                    className: "space-y-2",
                    children: r.map((s, a) => e.jsx(g, {
                        question: s.q,
                        answer: s.a,
                        index: a,
                        hasInfo: s.hasInfo
                    }, a))
                }), e.jsx("div", {
                    className: "mt-12 p-6 rounded-xl bg-orange-500/5 border border-orange-500/10 text-center",
                    children: e.jsxs("p", {
                        className: "text-zinc-600 dark:text-zinc-400 text-sm",
                        children: ["Have a technical question?", " ", e.jsx("button", {
                            type: "button",
                            onClick: () => n.getState().openModal(),
                            className: "text-orange-500 font-bold hover:underline",
                            children: "Contact support"
                        }), "."]
                    })
                })]
            })]
        })
    };
export {
    z as
    default
};