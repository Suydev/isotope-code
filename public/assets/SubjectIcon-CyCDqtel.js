import {
    j as s
} from "./vendor-react-BfU3Zn2J.js";
import {
    g
} from "./subjectBranding-DaDo_h8r.js";
import {
    c
} from "./utils-D8mZnxMk.js";
import {
    D as i,
    E as m,
    A as u,
    F as C,
    J as b,
    p as h,
    K as d,
    Z as N,
    W as S,
    N as y,
    O as T,
    T as w,
    S as k,
    Q as v,
    V as F,
    Y as I,
    _ as L,
    $ as B,
    a0 as D,
    b as G,
    a1 as A,
    a2 as E,
    a3 as M,
    a4 as O,
    a5 as P,
    a6 as W,
    a7 as Z,
    G as H,
    a8 as x,
    a9 as J,
    B as p
} from "./vendor-icons-CqruUz7g.js";
const _ = ({
    icon: f,
    name: n,
    className: l,
    size: t = "md"
}) => {
    const o = g(f),
        e = c({
            sm: "w-3.5 h-3.5",
            md: "w-5 h-5",
            lg: "w-8 h-8",
            xl: "w-12 h-12"
        }[t], l);
    if (o.type === "emoji") return s.jsx("span", {
        className: c("leading-none flex items-center justify-center", {
            "text-xs": t === "sm",
            "text-base": t === "md",
            "text-2xl": t === "lg",
            "text-4xl": t === "xl"
        }, l),
        children: o.value
    });
    const r = {
        BookOpen: p,
        Calculator: J,
        FlaskConical: x,
        Globe: H,
        Palette: Z,
        Music: W,
        Camera: P,
        Code: O,
        Cpu: M,
        Database: E,
        FileText: A,
        GraduationCap: G,
        History: D,
        Languages: B,
        Leaf: L,
        Microscope: I,
        Pencil: F,
        Scale: v,
        Sparkles: k,
        Target: w,
        TestTube: T,
        Triangle: y,
        Waves: S,
        Zap: N,
        Brain: d,
        Compass: h,
        Lightbulb: b,
        Scroll: C,
        Atom: u,
        Dna: m,
        Sigma: i
    };
    if (o.type === "lucide" && r[o.value]) {
        const a = r[o.value];
        return s.jsx(a, {
            className: e
        })
    }
    if (n) {
        const a = n.trim().toLowerCase();
        if (a === "physics") return s.jsx(u, {
            className: e
        });
        if (a === "mathematics" || a === "math") return s.jsx(i, {
            className: e
        });
        if (a === "chemistry") return s.jsx(x, {
            className: e
        });
        if (a === "biology") return s.jsx(m, {
            className: e
        })
    }
    const j = p;
    return s.jsx(j, {
        className: e
    })
};
export {
    _ as S
};