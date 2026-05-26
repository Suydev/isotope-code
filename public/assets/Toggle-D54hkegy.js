import {
    j as t
} from "./vendor-react-BfU3Zn2J.js";
const e = ({
    checked: n,
    onChange: o,
    ariaLabel: a,
    className: r = ""
}) => t.jsx("button", {
    onClick: o,
    type: "button",
    role: "switch",
    "aria-checked": n,
    "aria-label": a,
    className: `
        relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500/20 flex-shrink-0
        ${n?"bg-brand-500":"bg-zinc-200 dark:bg-white/10"}
        ${r}
      `,
    children: t.jsx("span", {
        className: `
          absolute top-1 left-1
          inline-block w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out
          ${n?"translate-x-5":"translate-x-0"}
        `
    })
});
export {
    e as T
};