import {
    j as e
} from "./vendor-react-BfU3Zn2J.js";
import {
    c as n
} from "./utils-D8mZnxMk.js";
import {
    an as i,
    j as c
} from "./vendor-icons-CqruUz7g.js";
import {
    L as x
} from "./vendor-router-CmoTwRnm.js";

function s({
    className: a,
    ...l
}) {
    return e.jsx("div", {
        className: n("animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800", a),
        ...l
    })
}
const u = () => e.jsx("div", {
        className: "min-h-screen bg-[#09090b] flex flex-col items-center justify-center gap-6",
        children: e.jsxs("div", {
            className: "flex flex-col items-center gap-4",
            children: [e.jsx("div", {
                className: "animate-pulse text-white font-display text-2xl",
                children: "IsotopeAI"
            }), e.jsxs("div", {
                className: "flex gap-2",
                children: [e.jsx(s, {
                    className: "h-2 w-2 rounded-full bg-brand-500"
                }), e.jsx(s, {
                    className: "h-2 w-2 rounded-full bg-brand-500 delay-75"
                }), e.jsx(s, {
                    className: "h-2 w-2 rounded-full bg-brand-500 delay-150"
                })]
            })]
        })
    }),
    b = () => e.jsxs("div", {
        className: "min-h-screen bg-[#09090b] flex",
        children: [e.jsxs("div", {
            className: "w-64 border-r border-zinc-800 p-4 hidden lg:flex flex-col gap-4",
            children: [e.jsx(s, {
                className: "h-8 w-32 mb-8"
            }), [1, 2, 3, 4, 5].map(a => e.jsx(s, {
                className: "h-10 w-full"
            }, a))]
        }), e.jsxs("div", {
            className: "flex-1 p-8 flex flex-col gap-8",
            children: [e.jsxs("div", {
                className: "flex justify-between items-center",
                children: [e.jsx(s, {
                    className: "h-12 w-64"
                }), e.jsx(s, {
                    className: "h-10 w-10 rounded-full"
                })]
            }), e.jsxs("div", {
                className: "grid grid-cols-1 md:grid-cols-3 gap-6",
                children: [e.jsx(s, {
                    className: "h-48 w-full rounded-2xl"
                }), e.jsx(s, {
                    className: "h-48 w-full rounded-2xl"
                }), e.jsx(s, {
                    className: "h-48 w-full rounded-2xl"
                })]
            }), e.jsx(s, {
                className: "h-96 w-full rounded-2xl"
            })]
        })]
    }),
    j = ({
        title: a,
        description: l,
        ctaLabel: t,
        ctaTo: r,
        eyebrow: d = "Offline only"
    }) => e.jsx("div", {
        className: "min-h-screen bg-[#f4f4f5] px-4 py-10 text-zinc-900 dark:bg-[#09090b] dark:text-white",
        children: e.jsx("div", {
            className: "mx-auto flex min-h-[calc(100vh-5rem)] max-w-2xl items-center justify-center",
            children: e.jsxs("div", {
                "data-testid": "network-required-state",
                className: "w-full rounded-[2rem] border border-zinc-200 bg-white p-8 text-center shadow-xl dark:border-white/10 dark:bg-white/5",
                children: [e.jsx("div", {
                    className: "mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-500",
                    children: e.jsx(i, {
                        className: "h-7 w-7"
                    })
                }), e.jsx("p", {
                    className: "mb-3 text-xs font-bold uppercase tracking-[0.2em] text-amber-500",
                    children: d
                }), e.jsx("h1", {
                    className: "mb-3 text-3xl font-display font-bold",
                    children: a
                }), e.jsx("p", {
                    className: "mx-auto mb-8 max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-300",
                    children: l
                }), e.jsxs(x, {
                    to: r,
                    className: "inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black",
                    children: [e.jsx(c, {
                        className: "h-4 w-4"
                    }), t]
                })]
            })
        })
    });
export {
    u as A, b as D, j as N
};