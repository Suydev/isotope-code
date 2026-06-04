import {
    r as o,
    j as r
} from "./vendor-react-BfU3Zn2J.js";
import {
    X as z,
    d as k
} from "./vendor-icons-CqruUz7g.js";
const N = ({
    options: b,
    selected: t,
    onChange: m,
    placeholder: p,
    maxSelections: a,
    minSelections: v,
    label: f,
    onChipClick: c,
    onCreate: l
}) => {
    const [n, d] = o.useState(""), [g, i] = o.useState(!1), u = o.useRef(null), x = b.filter(e => e.toLowerCase().includes(n.toLowerCase()) && !t.includes(e));
    o.useEffect(() => {
        const e = s => {
            u.current && !u.current.contains(s.target) && i(!1)
        };
        return document.addEventListener("mousedown", e), () => document.removeEventListener("mousedown", e)
    }, []);
    const h = e => {
        if (t.includes(e)) m(t.filter(s => s !== e));
        else {
            if (a && t.length >= a) return;
            m([...t, e]), d("")
        }
    };
    return r.jsxs("div", {
        className: "w-full space-y-2",
        ref: u,
        children: [f && r.jsx("label", {
            className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
            children: f
        }), r.jsxs("div", {
            className: `min-h-[48px] p-2 rounded-lg border transition-all duration-200 flex flex-wrap gap-2 items-center cursor-text
          ${g?"border-brand-500 bg-white dark:bg-zinc-800 ring-2 ring-brand-500/20":"border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600"}
        `,
            onClick: () => i(!0),
            children: [t.map(e => r.jsxs("span", {
                onClick: s => {
                    c && (s.stopPropagation(), c(e))
                },
                className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-white ${c?"cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-600":""}`,
                children: [e, r.jsx("button", {
                    onClick: s => {
                        s.stopPropagation(), h(e)
                    },
                    className: "hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-full p-0.5 transition-colors",
                    children: r.jsx(z, {
                        size: 12
                    })
                })]
            }, e)), r.jsx("input", {
                type: "text",
                value: n,
                onChange: e => {
                    d(e.target.value), i(!0)
                },
                onFocus: () => i(!0),
                placeholder: t.length === 0 ? p : "",
                className: "flex-1 min-w-[100px] bg-transparent border-none outline-none text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400"
            })]
        }), g && (x.length > 0 || l && n.trim()) && r.jsxs("div", {
            className: "relative z-50 w-full mt-1 p-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-lg max-h-60 overflow-y-auto",
            children: [x.map(e => r.jsxs("button", {
                onClick: () => h(e),
                className: "w-full text-left px-3 py-2 rounded-md text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors flex items-center justify-between",
                children: [e, t.includes(e) && r.jsx(k, {
                    size: 14
                })]
            }, e)), l && n.trim() && !x.includes(n.trim()) && !t.includes(n.trim()) && r.jsx("button", {
                onClick: () => {
                    l(n.trim()), d(""), i(!1)
                },
                className: "w-full text-left px-3 py-2 rounded-md text-sm text-brand-600 dark:text-brand-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2",
                children: r.jsxs("span", {
                    className: "font-medium",
                    children: ['Create "', n, '"']
                })
            })]
        }), a && r.jsxs("p", {
            className: "text-xs text-zinc-400 text-right",
            children: [t.length, "/", a, " selected"]
        })]
    })
};
export {
    N as C
};