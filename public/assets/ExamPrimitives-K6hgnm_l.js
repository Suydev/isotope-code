import {
    p as y
} from "./useFocusStore-CX_Nyp1h.js";
import {
    j as i
} from "./vendor-react-BfU3Zn2J.js";
import {
    c as p
} from "./utils-D8mZnxMk.js";
import {
    m as j
} from "./vendor-motion-Cp_NPzpZ.js";
import {
    aC as v,
    aX as D,
    M
} from "./vendor-icons-CqruUz7g.js";
const h = t => typeof t == "number" && Number.isFinite(t),
    T = t => !!t && typeof t.logged_at == "string" && t.logged_at.length > 0 && h(t.percentage) && h(t.score_obtained) && Array.isArray(t.subject_scores),
    k = t => T(t.result) && !t.deleted_at,
    N = t => {
        const s = y(t.date);
        if (Number.isNaN(s.getTime())) return Number.MAX_SAFE_INTEGER;
        if (t.start_time) {
            const [e, n] = t.start_time.split(":").map(r => parseInt(r, 10));
            s.setHours(Number.isFinite(e) ? e : 0, Number.isFinite(n) ? n : 0, 0, 0)
        }
        return s.getTime()
    },
    A = t => [...t].sort((s, e) => N(s) - N(e)),
    S = t => [...t].sort((s, e) => new Date(s.result.logged_at).getTime() - new Date(e.result.logged_at).getTime()),
    g = t => t.length === 0 ? 0 : t.reduce((s, e) => s + e, 0) / t.length,
    z = t => {
        if (t.length < 2) return 0;
        const s = g(t),
            e = t.reduce((n, r) => n + (r - s) ** 2, 0) / t.length;
        return Math.sqrt(e)
    };

function R(t) {
    if (t.length < 2) return {
        mean: t[0] ?? 0,
        stdDev: 0,
        cv: 0,
        rating: "No Data",
        score: 0
    };
    const s = g(t),
        e = z(t),
        n = s > 0 ? e / s * 100 : 0,
        r = n < 5 ? "Excellent" : n < 10 ? "Good" : n < 15 ? "Fair" : "Poor";
    return {
        mean: s,
        stdDev: e,
        cv: n,
        rating: r,
        score: Math.max(0, Math.min(100, 100 - n))
    }
}

function X(t) {
    if (t.length < 3) return {
        predicted: t[t.length - 1] ?? 0,
        slope: 0,
        rSquared: 0,
        trend: "stable",
        reliability: "No Data"
    };
    const s = t.length,
        e = Array.from({
            length: s
        }, (x, u) => u),
        n = e.reduce((x, u) => x + u, 0),
        r = t.reduce((x, u) => x + u, 0),
        o = e.reduce((x, u, _) => x + u * t[_], 0),
        c = e.reduce((x, u) => x + u * u, 0),
        d = (s * o - n * r) / (s * c - n * n || 1),
        l = (r - d * n) / s,
        a = r / s,
        m = t.reduce((x, u) => x + (u - a) ** 2, 0),
        f = t.reduce((x, u, _) => x + (u - (d * e[_] + l)) ** 2, 0),
        b = m > 0 ? 1 - f / m : 0;
    return {
        predicted: Math.max(0, Math.min(100, d * s + l)),
        slope: d,
        rSquared: b,
        trend: d > .5 ? "improving" : d < -.5 ? "declining" : "stable",
        reliability: b > .6 ? "High" : b > .3 ? "Medium" : "Low"
    }
}

function G(t) {
    const s = new Map;
    for (const e of S(t))
        for (const n of e.result.subject_scores ?? []) {
            if (!h(n.total_marks) || n.total_marks <= 0) continue;
            const r = h(n.marks_obtained) ? n.marks_obtained : 0,
                o = r / n.total_marks * 100,
                c = s.get(n.subject_id);
            c ? (c.totalObtained += r, c.totalMarks += n.total_marks, c.count += 1, c.scores.push(o)) : s.set(n.subject_id, {
                subject_id: n.subject_id,
                subject_name: n.subject_name,
                totalObtained: r,
                totalMarks: n.total_marks,
                count: 1,
                scores: [o],
                accuracy: 0,
                avgPct: 0,
                bestPct: 0,
                worstPct: 0,
                trend: 0
            })
        }
    return Array.from(s.values()).map(e => ({ ...e,
        accuracy: e.totalMarks > 0 ? e.totalObtained / e.totalMarks * 100 : 0,
        avgPct: g(e.scores),
        bestPct: e.scores.length ? Math.max(...e.scores) : 0,
        worstPct: e.scores.length ? Math.min(...e.scores) : 0,
        trend: e.scores.length >= 2 ? e.scores[e.scores.length - 1] - e.scores[0] : 0
    }))
}

function B(t, s, e = 60) {
    const n = new Map;
    for (const r of t)
        for (const o of r.chapter_ids ?? []) {
            const c = s.get(o);
            if (!c) continue;
            const d = r.result.subject_scores.find(f => f.subject_id === c);
            if (!d || !h(d.total_marks) || d.total_marks <= 0) continue;
            const a = (h(d.marks_obtained) ? d.marks_obtained : 0) / d.total_marks * 100;
            if (a >= e) continue;
            const m = n.get(o) ?? {
                chapter_id: o,
                examIds: [],
                examTitles: [],
                worstPct: a
            };
            m.examIds.push(r.id), m.examTitles.push(r.title), m.worstPct = Math.min(m.worstPct, a), n.set(o, m)
        }
    return Array.from(n.values()).sort((r, o) => r.worstPct - o.worstPct)
}

function L(t, s) {
    if (t.exam_type !== "dday" || !k(t)) return null;
    const e = s.filter(r => r.dday_exam_id === t.id && k(r));
    if (e.length === 0) return null;
    const n = g(e.map(r => r.result.percentage));
    return {
        examId: t.id,
        title: t.title,
        mockAvg: n,
        actual: t.result.percentage,
        diff: t.result.percentage - n
    }
}

function V(t, s, e) {
    const n = new Date(t, s, 1),
        r = new Date(n);
    r.setDate(r.getDate() - n.getDay());
    const o = new Date;
    o.setHours(0, 0, 0, 0);
    const c = new Map;
    for (const l of e) {
        if (!l.date) continue;
        const a = y(l.date);
        if (Number.isNaN(a.getTime())) continue;
        const m = `${a.getFullYear()}-${String(a.getMonth()+1).padStart(2,"0")}-${String(a.getDate()).padStart(2,"0")}`,
            f = c.get(m) ?? [];
        f.push(l), c.set(m, f)
    }
    const d = [];
    for (let l = 0; l < 42; l++) {
        const a = new Date(r);
        a.setDate(r.getDate() + l);
        const m = `${a.getFullYear()}-${String(a.getMonth()+1).padStart(2,"0")}-${String(a.getDate()).padStart(2,"0")}`;
        d.push({
            date: a,
            iso: m,
            inMonth: a.getMonth() === s,
            isToday: a.getTime() === o.getTime(),
            exams: c.get(m) ?? []
        })
    }
    return d
}

function Y(t) {
    const s = Date.now(),
        e = 10080 * 60 * 1e3,
        n = Array(8).fill(0);
    for (const l of t) {
        if (!k(l)) continue;
        const a = new Date(l.result.logged_at).getTime(),
            m = Math.floor((s - a) / e);
        m >= 0 && m < 8 && (n[7 - m] += 1)
    }
    const r = g(n),
        o = g(n.slice(0, 4)),
        c = g(n.slice(4)),
        d = c > o + .25 ? "up" : c < o - .25 ? "down" : "flat";
    return {
        perWeek: r,
        recentWeeks: n,
        trend: d
    }
}

function q(t, s, e) {
    return !s && !e ? null : {
        pctOfTopper: s ? t / s * 100 : null,
        aboveAverage: e ? t - e : null,
        isAboveAverage: e ? t >= e : null
    }
}

function U(t, s) {
    const e = s.filter(r => k(r) ? t.exam_type === "dday" ? r.dday_exam_id === t.id : t.dday_exam_id ? r.dday_exam_id === t.dday_exam_id || r.id === t.id : r.id === t.id ? !0 : r.exam_type === t.exam_type && (r.tags ?? []).some(o => (t.tags ?? []).includes(o)) : !1);
    return !e.find(r => r.id === t.id) && k(t) && e.push(t), A(e).map((r, o) => ({
        name: `T${o+1}`,
        title: r.title,
        score: r.result.percentage,
        isCurrent: r.id === t.id,
        date: r.date
    }))
}
const P = {
        none: "",
        sm: "p-4",
        md: "p-5 sm:p-6",
        lg: "p-6 sm:p-8"
    },
    O = {
        brand: "before:bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] before:from-brand-500/10 before:to-transparent",
        emerald: "before:bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] before:from-emerald-500/10 before:to-transparent",
        amber: "before:bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] before:from-amber-500/10 before:to-transparent",
        rose: "before:bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] before:from-rose-500/10 before:to-transparent",
        indigo: "before:bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] before:from-indigo-500/10 before:to-transparent"
    },
    J = ({
        variant: t = "flat",
        spineColor: s,
        interactive: e,
        padding: n = "md",
        accentTone: r,
        className: o,
        children: c,
        ...d
    }) => i.jsxs("div", { ...d,
        className: p("relative rounded-3xl overflow-hidden isolate transition-all duration-300", t === "flat" && "bg-white dark:bg-[#111111] border border-zinc-200/60 dark:border-white/[0.04]", t === "raised" && "bg-white dark:bg-[#111111] border border-zinc-200/60 dark:border-white/[0.04] shadow-sm", t === "tinted" && "bg-zinc-50/50 dark:bg-white/[0.02] border border-zinc-200/60 dark:border-white/[0.04]", t === "outline" && "border border-zinc-200/60 dark:border-white/[0.06] bg-transparent", r && p("before:absolute before:inset-0 before:pointer-events-none before:-z-10", O[r]), e && "cursor-pointer hover:-translate-y-1 hover:shadow-md dark:hover:border-white/[0.08]", P[n], o),
        children: [s && i.jsx("span", {
            "aria-hidden": !0,
            className: "absolute left-0 top-0 bottom-0 w-[4px]",
            style: {
                backgroundColor: s
            }
        }), c]
    }),
    K = ({
        eyebrow: t,
        title: s,
        description: e,
        right: n,
        icon: r,
        className: o
    }) => i.jsxs("div", {
        className: p("flex items-start justify-between gap-4 flex-wrap", o),
        children: [i.jsxs("div", {
            className: "min-w-0 flex-1",
            children: [t && i.jsxs("div", {
                className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2",
                children: [r && i.jsx("span", {
                    className: "text-zinc-400 dark:text-zinc-500",
                    children: r
                }), t]
            }), i.jsx("h3", {
                className: "text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight",
                children: s
            }), e && i.jsx("p", {
                className: "text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed max-w-2xl",
                children: e
            })]
        }), n && i.jsx("div", {
            className: "flex items-center gap-3 flex-shrink-0",
            children: n
        })]
    }),
    F = ({
        delta: t,
        threshold: s = .5,
        showValue: e = !0,
        unit: n = "pp",
        invert: r = !1,
        className: o,
        size: c = "sm"
    }) => {
        const d = t > s,
            l = t < -s,
            a = !r,
            m = d ? a ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400" : l ? a ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400" : "text-zinc-400",
            f = d ? v : l ? D : M,
            b = c === "sm" ? "w-3 h-3" : "w-3.5 h-3.5";
        return i.jsxs("span", {
            className: p("inline-flex items-center gap-1 font-medium tabular-nums", m, o),
            children: [i.jsx(f, {
                className: b
            }), e && i.jsxs("span", {
                className: c === "sm" ? "text-[11px]" : "text-xs",
                children: [t > 0 ? "+" : "", Math.abs(t) < 10 ? t.toFixed(1) : t.toFixed(0), n && i.jsx("span", {
                    className: "opacity-60 ml-0.5",
                    children: n
                })]
            })]
        })
    },
    I = {
        brand: "bg-brand-500/10 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400",
        emerald: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
        amber: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
        rose: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400",
        indigo: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400",
        zinc: "bg-zinc-100 text-zinc-600 dark:bg-white/10 dark:text-zinc-300"
    },
    Q = ({
        label: t,
        value: s,
        unit: e,
        sub: n,
        delta: r,
        invertDelta: o,
        icon: c,
        iconTone: d = "zinc",
        size: l = "md",
        align: a = "left",
        className: m
    }) => {
        const f = l === "lg" ? "text-4xl sm:text-5xl font-black tracking-tighter" : l === "sm" ? "text-lg sm:text-xl font-bold tracking-tight" : "text-2xl sm:text-3xl font-bold tracking-tight";
        return i.jsxs("div", {
            className: p("flex flex-col gap-2", a === "center" && "items-center text-center", m),
            children: [i.jsxs("div", {
                className: p("flex items-center gap-2", a === "center" && "justify-center"),
                children: [c && i.jsx("span", {
                    className: p("inline-flex items-center justify-center rounded-xl flex-shrink-0", l === "lg" ? "w-10 h-10" : "w-8 h-8", I[d]),
                    children: c
                }), i.jsx("span", {
                    className: "text-[11px] font-semibold uppercase tracking-widest text-zinc-500",
                    children: t
                })]
            }), i.jsxs("div", {
                className: "flex items-baseline gap-1",
                children: [i.jsx("span", {
                    className: p("text-zinc-900 dark:text-zinc-50 font-display tabular-nums", f),
                    children: s
                }), e && i.jsx("span", {
                    className: "text-sm font-medium text-zinc-400 ml-1",
                    children: e
                }), r !== void 0 && i.jsx(F, {
                    delta: r,
                    invert: o,
                    className: "ml-2"
                })]
            }), n && i.jsx("p", {
                className: "text-xs font-medium text-zinc-500 dark:text-zinc-400 leading-snug",
                children: n
            })]
        })
    },
    Z = ({
        value: t,
        size: s = 96,
        stroke: e = 8,
        color: n = "#fb923c",
        secondary: r,
        label: o,
        caption: c,
        className: d
    }) => {
        const l = (s - e) / 2,
            a = 2 * Math.PI * l,
            m = w => Math.max(0, Math.min(100, w)),
            f = a - m(t) / 100 * a,
            b = r ? a - m(r.value) / 100 * a : 0;
        return i.jsxs("div", {
            className: p("relative flex-shrink-0 flex items-center justify-center", d),
            style: {
                width: s,
                height: s
            },
            children: [i.jsxs("svg", {
                width: s,
                height: s,
                viewBox: `0 0 ${s} ${s}`,
                className: "-rotate-90 absolute inset-0",
                children: [i.jsx("circle", {
                    cx: s / 2,
                    cy: s / 2,
                    r: l,
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: e,
                    className: "text-zinc-100 dark:text-white/[0.04]"
                }), r && i.jsx(j.circle, {
                    cx: s / 2,
                    cy: s / 2,
                    r: l,
                    fill: "none",
                    stroke: r.color,
                    strokeOpacity: .25,
                    strokeWidth: e,
                    strokeLinecap: "round",
                    strokeDasharray: a,
                    initial: {
                        strokeDashoffset: a
                    },
                    animate: {
                        strokeDashoffset: b
                    },
                    transition: {
                        duration: .7,
                        ease: "easeOut"
                    }
                }), i.jsx(j.circle, {
                    cx: s / 2,
                    cy: s / 2,
                    r: l,
                    fill: "none",
                    stroke: n,
                    strokeWidth: e,
                    strokeLinecap: "round",
                    strokeDasharray: a,
                    initial: {
                        strokeDashoffset: a
                    },
                    animate: {
                        strokeDashoffset: f
                    },
                    transition: {
                        duration: .8,
                        ease: "easeOut"
                    }
                })]
            }), i.jsxs("div", {
                className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none",
                children: [o, c && i.jsx("span", {
                    className: "text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mt-1",
                    children: c
                })]
            })]
        })
    };
export {
    Z as R, J as S, F as T, K as a, Q as b, L as c, R as d, S as e, N as f, Y as g, G as h, k as i, B as j, V as k, g as m, X as p, q as r, A as s, U as t
};