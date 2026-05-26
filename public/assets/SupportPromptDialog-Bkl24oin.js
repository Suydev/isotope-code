import {
    j as e
} from "./vendor-react-BfU3Zn2J.js";
import {
    u as d
} from "./App-pJGjDiPw.js";
import {
    S as c
} from "./SupportMessage-BE7j-Ezd.js";
import {
    u as m
} from "./useSupportModalStore-BkYsnKtG.js";
import {
    A as p,
    m as s
} from "./vendor-motion-Cp_NPzpZ.js";
import {
    X as h,
    q as u,
    S as x
} from "./vendor-icons-CqruUz7g.js";
import {
    u as b
} from "./vendor-router-CmoTwRnm.js";
import "./index-BPYJFSVW.js";
import "./vendor-supabase-DAiUAuun.js";
import "./utils-D8mZnxMk.js";
import "./vendor-charts-CFLJvnG7.js";
const C = () => {
    const {
        isOpen: o,
        closeModal: a
    } = m(), i = b(), r = d(n => n.isAuthenticated), t = () => {
        a(), localStorage.setItem("isotope_support_dialog_seen", "true")
    }, l = () => {
        t(), i(r ? "/subscription" : "/auth")
    };
    return e.jsx(p, {
        children: o && e.jsx(s.div, {
            initial: {
                opacity: 0
            },
            animate: {
                opacity: 1
            },
            exit: {
                opacity: 0
            },
            className: "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm",
            children: e.jsxs(s.div, {
                initial: {
                    scale: .95,
                    opacity: 0,
                    y: 20
                },
                animate: {
                    scale: 1,
                    opacity: 1,
                    y: 0
                },
                exit: {
                    scale: .95,
                    opacity: 0,
                    y: 20
                },
                className: "relative w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-3xl",
                children: [e.jsx("button", {
                    onClick: t,
                    className: "absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-900/50 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors",
                    children: e.jsx(h, {
                        className: "w-5 h-5"
                    })
                }), e.jsxs("div", {
                    className: "relative bg-zinc-950 border border-zinc-800/50 rounded-3xl overflow-hidden",
                    children: [e.jsxs("div", {
                        className: "relative h-32 md:h-40 bg-gradient-to-br from-rose-600 to-orange-500 overflow-hidden",
                        children: [e.jsx("div", {
                            className: "absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"
                        }), e.jsx("div", {
                            className: "absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 blur-3xl rounded-full"
                        }), e.jsx("div", {
                            className: "absolute -top-10 -left-10 w-40 h-40 bg-white/20 blur-3xl rounded-full"
                        }), e.jsx("div", {
                            className: "absolute inset-0 flex items-center justify-center",
                            children: e.jsx(s.div, {
                                animate: {
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 5, -5, 0]
                                },
                                transition: {
                                    duration: 4,
                                    repeat: 1 / 0,
                                    ease: "easeInOut"
                                },
                                className: "p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl",
                                children: e.jsx(u, {
                                    className: "w-10 h-10 text-white fill-white/50"
                                })
                            })
                        })]
                    }), e.jsxs("div", {
                        className: "p-6 md:p-8",
                        children: [e.jsxs("div", {
                            className: "text-center mb-8",
                            children: [e.jsx("h2", {
                                className: "text-2xl md:text-3xl font-bold text-white mb-3",
                                children: "A Message from the Creator"
                            }), e.jsx("p", {
                                className: "text-zinc-400",
                                children: "Thank you immensely for finding value in Isotope. Before you dive back into studying, please take a moment to understand our premium plans and how they keep the platform alive."
                            })]
                        }), e.jsx(c, {
                            className: "mb-8 border-transparent bg-zinc-900/50 shadow-none",
                            compact: !0
                        }), e.jsxs("div", {
                            className: "flex flex-col gap-3",
                            children: [e.jsxs("button", {
                                onClick: l,
                                className: "group relative w-full py-4 px-6 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold text-lg shadow-xl shadow-rose-500/20 hover:shadow-rose-500/40 transition-all overflow-hidden",
                                children: [e.jsx("div", {
                                    className: "absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none"
                                }), e.jsxs("div", {
                                    className: "relative flex items-center justify-center gap-2",
                                    children: [e.jsx(x, {
                                        className: "w-5 h-5"
                                    }), "Support the Developer"]
                                })]
                            }), e.jsx("button", {
                                onClick: t,
                                className: "w-full py-3 px-6 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 transition-colors text-sm font-medium",
                                children: "Close"
                            })]
                        })]
                    })]
                })]
            })
        })
    })
};
export {
    C as SupportPromptDialog
};