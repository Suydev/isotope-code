import {
    j as r
} from "./vendor-react-BfU3Zn2J.js";
import {
    c as t
} from "./utils-D8mZnxMk.js";
import {
    c as s
} from "./App-pJGjDiPw.js";
const i = {
        scholar: {
            border: "from-amber-500/30 via-yellow-500/30 to-amber-500/30",
            shimmer: "via-yellow-400/20",
            badge: "from-amber-200 to-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.4)]",
            glow: "from-amber-500/20 to-yellow-500/20",
            text: "text-amber-400",
            name: "SCHOLAR"
        },
        ranker: {
            border: "from-brand-500/30 via-brand-500/30 to-cyan-500/30",
            shimmer: "via-brand-400/20",
            badge: "from-cyan-300 via-brand-300 to-brand-300 shadow-[0_0_20px_rgba(192,132,252,0.4)]",
            glow: "from-brand-500/20 via-brand-500/20 to-cyan-500/20",
            text: "text-brand-400",
            name: "RANKER"
        }
    },
    u = ({
        children: a,
        className: e,
        isPremium: n = !1,
        plan: o = "scholar"
    }) => {
        const {
            isPerformanceMode: d
        } = s();
        if (!n || o === "free") return r.jsx("div", {
            className: e,
            children: a
        });
        if (d) return r.jsx("div", {
            className: t("rounded-2xl border border-amber-500/20", e),
            children: r.jsx("div", {
                className: "bg-white dark:bg-zinc-900 rounded-2xl h-full w-full",
                children: a
            })
        });
        const l = i[o === "ranker" ? "ranker" : "scholar"];
        return r.jsxs("div", {
            className: t("relative group p-[1px] rounded-2xl overflow-hidden isolation-auto", e),
            children: [r.jsx("div", {
                className: t("absolute inset-0 bg-gradient-to-r opacity-60 group-hover:opacity-100 transition-opacity duration-500", l.border)
            }), r.jsx("div", {
                className: t("absolute inset-0 bg-gradient-to-r from-transparent to-transparent translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite]", l.shimmer)
            }), r.jsx("div", {
                className: "relative bg-white dark:bg-zinc-900 rounded-2xl h-full w-full",
                children: a
            })]
        })
    },
    x = ({
        size: a = "md",
        plan: e = "scholar"
    }) => {
        const {
            isPerformanceMode: n
        } = s();
        if (e === "free") return null;
        const o = i[e === "ranker" ? "ranker" : "scholar"];
        return r.jsxs("div", {
            className: t("inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r text-black font-bold font-display uppercase tracking-wider", o.badge, a === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"),
            children: [r.jsx("span", {
                children: o.name
            }), r.jsx("span", {
                className: t("w-1.5 h-1.5 rounded-full bg-white shadow-sm", !n && "animate-pulse")
            })]
        })
    },
    f = ({
        className: a,
        plan: e = "scholar"
    }) => {
        const {
            isPerformanceMode: n
        } = s(), o = i[e === "ranker" ? "ranker" : "scholar"];
        return n ? null : r.jsx("div", {
            className: t("absolute pointer-events-none rounded-full blur-[100px] bg-gradient-to-tr opacity-40 mix-blend-screen", o.glow, a)
        })
    };
export {
    x as P, f as a, u as b
};