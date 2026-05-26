import {
    i as l,
    g as c,
    p as r
} from "./useFocusStore-CX_Nyp1h.js";
const a = e => e.status !== "done" || !e.completedAt ? null : r(e.completedAt),
    i = (e, t, o = new Date) => {
        const n = a(e);
        return !!n && n >= t && n <= o
    },
    m = (e, t, o = new Date) => e.filter(n => i(n, t, o)).length,
    u = (e, t, o = 0) => e.filter(n => {
        const s = a(n);
        return !!s && l(s, t, o)
    }).length,
    g = e => {
        const t = a(e);
        return t ? t.getHours() : null
    },
    D = (e, t = 0) => {
        const o = a(e);
        return o ? c(o, t) : null
    };
export {
    g as a, D as b, u as c, m as d, a as g
};