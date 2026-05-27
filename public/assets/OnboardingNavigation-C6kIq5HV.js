import {
    j as e
} from "./vendor-react-BfU3Zn2J.js";
import {
    j as d,
    i as l,
    d as x,
    r as m
} from "./vendor-icons-CqruUz7g.js";
const z = ({
    onNext: i,
    onBack: n,
    onSkip: t,
    isFirstStep: a,
    isLastStep: c,
    canContinue: r,
    isSubmitting: s = !1,
    skipLabel: o = "Skip for now"
}) => e.jsxs("div", {
    className: "flex items-center justify-between mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800",
    children: [e.jsx("div", {
        className: "w-1/3",
        children: !a && e.jsxs("button", {
            onClick: n,
            className: "flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors",
            children: [e.jsx(d, {
                size: 16
            }), e.jsx("span", {
                children: "Back"
            })]
        })
    }), e.jsx("div", {
        className: "w-1/3 flex justify-center",
        children: t && e.jsx("button", {
            onClick: t,
            className: "text-sm font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors",
            children: o
        })
    }), e.jsx("div", {
        className: "w-1/3 flex justify-end",
        children: e.jsx("button", {
            onClick: i,
            disabled: !r || s,
            className: `flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all
            ${r&&!s?"bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100":"bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed"}
          `,
            children: s ? e.jsxs(e.Fragment, {
                children: [e.jsx(l, {
                    size: 16,
                    className: "animate-spin"
                }), e.jsx("span", {
                    children: "Processing"
                })]
            }) : c ? e.jsxs(e.Fragment, {
                children: [e.jsx("span", {
                    children: "Complete Setup"
                }), e.jsx(x, {
                    size: 16
                })]
            }) : e.jsxs(e.Fragment, {
                children: [e.jsx("span", {
                    children: "Continue"
                }), e.jsx(m, {
                    size: 16
                })]
            })
        })
    })]
});
export {
    z as O
};