import {
    j as e
} from "./vendor-react-BfU3Zn2J.js";
import {
    m as t,
    u as s,
    a as l
} from "./vendor-motion-Cp_NPzpZ.js";
import {
    S as n,
    L as y,
    aj as k,
    ak as f,
    B as v,
    b as j,
    l as C,
    U as z,
    an as N,
    ao as _,
    a3 as M
} from "./vendor-icons-CqruUz7g.js";
const A = [{
    title: "All-in-one study website",
    description: "Everything you need in one place: tasks, focus, syllabus, exams, analytics, and community.",
    icon: y,
    glowColor: "bg-blue-500",
    iconColor: "text-blue-500"
}, {
    title: "Focus Sessions",
    description: "Pomodoro + stopwatch with question tracking, stats, and complete session history.",
    icon: k,
    glowColor: "bg-orange-500",
    iconColor: "text-orange-500"
}, {
    title: "Advanced Task Management",
    description: "Boards, lists, matrix view, habits, recurring tasks, subtasks and AI task planning.",
    icon: f,
    glowColor: "bg-emerald-500",
    iconColor: "text-emerald-500"
}, {
    title: "Syllabus Tracking",
    description: "Track subjects, chapters, and topics with built-in spaced repetition functionality.",
    icon: v,
    glowColor: "bg-cyan-500",
    iconColor: "text-cyan-500"
}, {
    title: "Exam Manager",
    description: "Countdowns, mock tests, prep insights, analytics, and D-day prep tracking.",
    icon: j,
    glowColor: "bg-amber-500",
    iconColor: "text-amber-500"
}, {
    title: "Robust Analytics",
    description: "Daily, weekly, monthly insights, subject-wise breakdowns, and AI-generated summaries.",
    icon: C,
    glowColor: "bg-indigo-500",
    iconColor: "text-indigo-500"
}, {
    title: "Community",
    description: "Study groups, leaderboards, group chat, and challenges to keep you motivated.",
    icon: z,
    glowColor: "bg-purple-500",
    iconColor: "text-purple-500"
}, {
    title: "Offline Ready",
    description: "Works flawlessly without an internet connection, with optional cloud sync.",
    icon: N,
    glowColor: "bg-rose-500",
    iconColor: "text-rose-500"
}, {
    title: "Installable PWA",
    description: "Use like a real app with native notifications and background tracking.",
    icon: _,
    glowColor: "bg-teal-500",
    iconColor: "text-teal-500"
}, {
    title: "AI Insights",
    description: "Personalized suggestions based on actual study data, beyond generic advice.",
    icon: n,
    glowColor: "bg-pink-500",
    iconColor: "text-pink-500"
}, {
    title: "Potato PC Mode",
    description: "Optimized performance so even simple 4GB RAM setups run smoothly.",
    icon: M,
    glowColor: "bg-yellow-500",
    iconColor: "text-yellow-500"
}];

function I({
    title: i,
    description: o,
    icon: c,
    glowColor: d,
    iconColor: p,
    index: x
}) {
    const a = s(0),
        r = s(0);

    function g({
        currentTarget: u,
        clientX: m,
        clientY: b
    }) {
        const {
            left: h,
            top: w
        } = u.getBoundingClientRect();
        a.set(m - h), r.set(b - w)
    }
    return e.jsxs(t.div, {
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
            margin: "-20px"
        },
        transition: {
            delay: x * .03,
            duration: .4,
            ease: "easeOut"
        },
        onMouseMove: g,
        className: "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 bg-white/50 p-5 shadow-sm backdrop-blur-sm transition-all hover:bg-white/80 dark:border-white/5 dark:bg-zinc-900/40 dark:backdrop-blur-xl dark:hover:border-white/10 hover:shadow-md h-full",
        children: [e.jsx(t.div, {
            className: "pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100 dark:hidden",
            style: {
                background: l `
            radial-gradient(
              250px circle at ${a}px ${r}px,
              rgba(0,0,0,0.03),
              transparent 80%
            )
          `
            }
        }), e.jsx(t.div, {
            className: "pointer-events-none absolute -inset-px hidden rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100 dark:block",
            style: {
                background: l `
            radial-gradient(
              350px circle at ${a}px ${r}px,
              rgba(255,255,255,0.08),
              transparent 80%
            )
          `
            }
        }), e.jsx("div", {
            className: `absolute right-0 top-0 h-32 w-32 rounded-full blur-[40px] opacity-10 transition-opacity duration-500 group-hover:opacity-30 dark:opacity-5 dark:group-hover:opacity-20 ${d}`
        }), e.jsxs("div", {
            className: "relative z-10 flex flex-col gap-3",
            children: [e.jsx("div", {
                className: "flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-zinc-200/50 transition-transform duration-500 group-hover:scale-105 dark:bg-zinc-800 dark:ring-white/10",
                children: e.jsx(c, {
                    className: `h-5 w-5 ${p}`
                })
            }), e.jsxs("div", {
                children: [e.jsx("h3", {
                    className: "mb-1 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100",
                    children: i
                }), e.jsx("p", {
                    className: "text-sm leading-snug text-zinc-600 dark:text-zinc-400",
                    children: o
                })]
            })]
        })]
    })
}
const $ = () => e.jsxs("section", {
    className: "relative overflow-hidden bg-zinc-50 py-16 dark:bg-black lg:py-24",
    children: [e.jsx("div", {
        className: "absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-background to-transparent"
    }), e.jsx("div", {
        className: "absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)]"
    }), e.jsxs("div", {
        className: "container relative z-20 mx-auto max-w-7xl px-4 md:px-6",
        children: [e.jsxs("div", {
            className: "mx-auto mb-12 flex max-w-3xl flex-col items-center text-center",
            children: [e.jsxs(t.div, {
                initial: {
                    opacity: 0,
                    scale: .9
                },
                whileInView: {
                    opacity: 1,
                    scale: 1
                },
                viewport: {
                    once: !0
                },
                className: "mb-6 flex items-center justify-center gap-2 rounded-full border border-zinc-200/50 bg-white/50 px-3 py-1 shadow-sm backdrop-blur-md dark:border-white/5 dark:bg-white/5",
                children: [e.jsx(n, {
                    className: "h-3.5 w-3.5 text-orange-500"
                }), e.jsx("span", {
                    className: "text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400",
                    children: "Powerful Capabilities"
                })]
            }), e.jsxs(t.h2, {
                initial: {
                    opacity: 0,
                    y: 15
                },
                whileInView: {
                    opacity: 1,
                    y: 0
                },
                viewport: {
                    once: !0
                },
                className: "mb-4 font-display text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white md:text-5xl lg:text-6xl",
                children: ["Everything you need. ", e.jsx("br", {
                    className: "hidden md:block"
                }), e.jsx("span", {
                    className: "bg-gradient-to-b from-orange-400 to-amber-600 bg-clip-text text-transparent",
                    children: "Nothing you don't."
                })]
            }), e.jsx(t.p, {
                initial: {
                    opacity: 0,
                    y: 15
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
                className: "text-base text-zinc-600 dark:text-zinc-400 md:text-lg",
                children: "A streamlined suite of tools engineered to optimize your learning without the bloat."
            })]
        }), e.jsxs("div", {
            className: "grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4",
            children: [A.map((i, o) => e.jsx(I, {
                index: o,
                ...i
            }, o)), e.jsx("div", {
                className: "hidden sm:flex items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200/50 p-5 dark:border-white/5 transition-colors hover:border-zinc-300 dark:hover:border-white/10 group select-none",
                children: e.jsxs("div", {
                    className: "text-center",
                    children: [e.jsx(n, {
                        className: "h-4 w-4 text-zinc-300 dark:text-zinc-700 mx-auto mb-2 group-hover:text-orange-500/50 transition-colors"
                    }), e.jsxs("span", {
                        className: "text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600",
                        children: ["More features ", e.jsx("br", {}), " coming soon"]
                    })]
                })
            })]
        })]
    })]
});
export {
    $ as
    default
};