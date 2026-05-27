import {
    j as e
} from "./vendor-react-BfU3Zn2J.js";
import {
    c as a
} from "./utils-D8mZnxMk.js";
import {
    m as i
} from "./vendor-motion-Cp_NPzpZ.js";
import {
    q as r,
    S as l,
    ad as o,
    ae as n
} from "./vendor-icons-CqruUz7g.js";
const h = ({
    className: t,
    compact: s = !1
}) => e.jsxs(i.div, {
    initial: {
        opacity: 0,
        y: 10
    },
    animate: {
        opacity: 1,
        y: 0
    },
    className: a("relative overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.02] p-6 md:p-8 backdrop-blur-xl shadow-2xl", t),
    children: [e.jsx("div", {
        className: "absolute -top-32 -right-32 w-64 h-64 bg-rose-500/10 blur-[80px] rounded-full pointer-events-none mix-blend-screen"
    }), e.jsx("div", {
        className: "absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none mix-blend-screen"
    }), e.jsxs("div", {
        className: "relative z-10 flex flex-col gap-8 md:flex-row md:items-start",
        children: [!s && e.jsx("div", {
            className: "hidden md:flex flex-shrink-0 mt-1",
            children: e.jsxs("div", {
                className: "relative w-16 h-16 rounded-2xl bg-gradient-to-b from-rose-500/20 to-rose-900/10 border border-rose-500/20 flex items-center justify-center shadow-inner",
                children: [e.jsx("div", {
                    className: "absolute inset-0 bg-rose-400/5 rounded-2xl"
                }), e.jsx(r, {
                    className: "w-8 h-8 text-rose-400 fill-rose-500/50 drop-shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-[pulse_3s_ease-in-out_infinite]"
                })]
            })
        }), e.jsxs("div", {
            className: "flex-1 space-y-6 text-sm md:text-base leading-relaxed text-zinc-400",
            children: [e.jsxs("div", {
                className: "flex flex-col gap-1",
                children: [s && e.jsx(r, {
                    className: "w-6 h-6 text-rose-400 fill-rose-500/30 mb-3 animate-[pulse_3s_ease-in-out_infinite]"
                }), e.jsxs("h3", {
                    className: "text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2",
                    children: ["A Message from the Developer", e.jsx(l, {
                        className: "w-5 h-5 text-amber-400 animate-pulse"
                    })]
                }), e.jsx("div", {
                    className: "w-12 h-1 rounded-full bg-gradient-to-r from-rose-400 to-transparent mt-2"
                })]
            }), e.jsxs("p", {
                className: "text-zinc-300",
                children: ["Hi there! First of all, ", e.jsx("strong", {
                    className: "text-white",
                    children: "thank you so much"
                }), " for choosing Isotope. As a solo student developer building this platform, I strongly believe that", e.jsx("span", {
                    className: "text-white font-medium bg-white/5 rounded-md px-2 py-0.5 mx-1 border border-white/10",
                    children: "core study features should be 100% free without compromise"
                }), ". However, keeping a platform of this scale running isn't free."]
            }), e.jsxs("div", {
                className: "grid grid-cols-1 sm:grid-cols-2 gap-4 py-2",
                children: [e.jsxs("div", {
                    className: "flex flex-col gap-2 p-5 rounded-2xl bg-[#09090b]/80 border border-white/5 shadow-inner",
                    children: [e.jsxs("div", {
                        className: "flex items-center gap-3",
                        children: [e.jsx("div", {
                            className: "p-2 rounded-xl bg-blue-500/10 border border-blue-500/20",
                            children: e.jsx(o, {
                                className: "w-5 h-5 text-blue-400"
                            })
                        }), e.jsxs("span", {
                            className: "font-bold text-lg text-white",
                            children: ["₹2,500 ", e.jsx("span", {
                                className: "text-sm font-medium text-zinc-500",
                                children: "/ mo"
                            })]
                        })]
                    }), e.jsx("span", {
                        className: "text-xs font-semibold uppercase tracking-wider text-zinc-500",
                        children: "Global Server Costs"
                    })]
                }), e.jsxs("div", {
                    className: "flex flex-col gap-2 p-5 rounded-2xl bg-[#09090b]/80 border border-white/5 shadow-inner",
                    children: [e.jsxs("div", {
                        className: "flex items-center gap-3",
                        children: [e.jsx("div", {
                            className: "p-2 rounded-xl bg-amber-500/10 border border-amber-500/20",
                            children: e.jsx(n, {
                                className: "w-5 h-5 text-amber-400"
                            })
                        }), e.jsxs("span", {
                            className: "font-bold text-lg text-white",
                            children: ["100% ", e.jsx("span", {
                                className: "text-sm font-medium text-zinc-500",
                                children: "Reinvested"
                            })]
                        })]
                    }), e.jsx("span", {
                        className: "text-xs font-semibold uppercase tracking-wider text-zinc-500",
                        children: "To maintain fast servers"
                    })]
                })]
            }), e.jsxs("p", {
                className: "leading-7",
                children: ["Features like the", " ", e.jsx("strong", {
                    className: "text-rose-400 font-semibold border-b border-rose-500/30 pb-0.5",
                    children: "Community Hub"
                }), ", live rooms, and real-time sync require robust cloud infrastructure, which is why they are exclusively available for our premium members."]
            }), e.jsxs("p", {
                className: "leading-7",
                children: ["By upgrading, you aren't just unlocking tools—", e.jsx("strong", {
                    className: "text-white font-medium",
                    children: "you're directly paying the server bills"
                }), " ", "that keep Isotope sustainable and free for thousands of students worldwide who can't afford to pay."]
            }), e.jsxs("div", {
                className: "pt-4 mt-2 border-t border-white/5",
                children: [e.jsxs("div", {
                    className: "mb-4 flex flex-wrap gap-3",
                    children: [e.jsx("a", {
                        href: "https://discord.gg/QfmQGmKJUD",
                        target: "_blank",
                        rel: "noreferrer",
                        className: "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/10",
                        children: "Join Discord"
                    }), e.jsx("a", {
                        href: "https://www.reddit.com/r/Isotope/",
                        target: "_blank",
                        rel: "noreferrer",
                        className: "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/10",
                        children: "Visit Reddit"
                    })]
                }), e.jsxs("p", {
                    className: "text-sm text-zinc-500 italic font-medium flex items-center justify-between",
                    children: [e.jsx("span", {
                        children: "Thank you for supporting independent student developers!"
                    }), e.jsx("span", {
                        className: "text-rose-500 text-lg shadow-sm",
                        children: "❤️"
                    })]
                })]
            })]
        })]
    })]
});
export {
    h as S
};