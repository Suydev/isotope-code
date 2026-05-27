const __vite__mapDeps = (i, m = __vite__mapDeps, d = (m.f || (m.f = ["assets/MarkdownRendererContent-DBrMkHal.js", "assets/index-BPYJFSVW.js", "assets/vendor-react-BfU3Zn2J.js", "assets/index-CrO6t5EW.css", "assets/vendor-katex-BSXZKQS3.js", "assets/vendor-katex-ASjZcBK0.css", "assets/App-pJGjDiPw.js", "assets/vendor-supabase-DAiUAuun.js", "assets/vendor-motion-Cp_NPzpZ.js", "assets/vendor-icons-CqruUz7g.js", "assets/vendor-router-CmoTwRnm.js", "assets/vendor-markdown-core-Pkt6xPHa.js"]))) => i.map(i => d[i]);
import {
    _ as n
} from "./index-BPYJFSVW.js";
import {
    j as r,
    r as s
} from "./vendor-react-BfU3Zn2J.js";
const d = s.lazy(() => n(() =>
        import ("./MarkdownRendererContent-DBrMkHal.js"), __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]))),
    i = ({
        content: e,
        className: o = ""
    }) => r.jsx("div", {
        className: `markdown-content w-full overflow-hidden ${o}`,
        children: r.jsx("div", {
            className: "whitespace-pre-wrap break-words text-inherit",
            children: e
        })
    }),
    p = ({
        content: e,
        className: o = "",
        enableLatex: t = !0,
        enableCodeHighlight: a = !0
    }) => r.jsx(s.Suspense, {
        fallback: r.jsx(i, {
            content: e,
            className: o
        }),
        children: r.jsx(d, {
            content: e,
            className: o,
            enableLatex: t,
            enableCodeHighlight: a
        })
    });
export {
    p as M
};