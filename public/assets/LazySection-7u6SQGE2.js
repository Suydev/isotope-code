import {
    r as v,
    j as p
} from "./vendor-react-BfU3Zn2J.js";
var y = new Map,
    x = new WeakMap,
    E = 0,
    O;

function _(e) {
    return e ? (x.has(e) || (E += 1, x.set(e, E.toString())), x.get(e)) : "0"
}

function M(e) {
    return Object.keys(e).sort().filter(t => e[t] !== void 0).map(t => `${t}_${t==="root"?_(e.root):e[t]}`).toString()
}

function N(e) {
    const t = M(e);
    let n = y.get(t);
    if (!n) {
        const c = new Map;
        let u;
        const i = new IntersectionObserver(s => {
            s.forEach(r => {
                var o;
                const g = r.isIntersecting && u.some(d => r.intersectionRatio >= d);
                e.trackVisibility && typeof r.isVisible > "u" && (r.isVisible = g), [...(o = c.get(r.target)) != null ? o : []].forEach(d => {
                    d(g, r)
                })
            })
        }, e);
        u = i.thresholds || (Array.isArray(e.threshold) ? e.threshold : [e.threshold || 0]), n = {
            id: t,
            observer: i,
            elements: c
        }, y.set(t, n)
    }
    return n
}

function T(e, t, n = {}, c = O) {
    if (typeof window.IntersectionObserver > "u" && c !== void 0) {
        const o = e.getBoundingClientRect();
        return t(c, {
            isIntersecting: c,
            target: e,
            intersectionRatio: typeof n.threshold == "number" ? n.threshold : 0,
            time: 0,
            boundingClientRect: o,
            intersectionRect: o,
            rootBounds: o
        }), () => {}
    }
    const {
        id: u,
        observer: i,
        elements: s
    } = N(n), r = s.get(e) || [];
    return s.has(e) || s.set(e, r), r.push(t), i.observe(e),
        function() {
            r.splice(r.indexOf(t), 1), r.length === 0 && (s.delete(e), i.unobserve(e)), s.size === 0 && (i.disconnect(), y.delete(u))
        }
}

function $({
    threshold: e,
    delay: t,
    trackVisibility: n,
    rootMargin: c,
    root: u,
    triggerOnce: i,
    skip: s,
    initialInView: r,
    fallbackInView: o,
    onChange: g
} = {}) {
    var d;
    const [b, I] = v.useState(null), R = v.useRef(g), l = v.useRef(r), [S, w] = v.useState({
        inView: !!r,
        entry: void 0
    });
    R.current = g, v.useEffect(() => {
        if (l.current === void 0 && (l.current = r), s || !b) return;
        let f;
        return f = T(b, (h, m) => {
            const A = l.current;
            l.current = h, !(A === void 0 && !h) && (w({
                inView: h,
                entry: m
            }), R.current && R.current(h, m), m.isIntersecting && i && f && (f(), f = void 0))
        }, {
            root: u,
            rootMargin: c,
            threshold: e,
            trackVisibility: n,
            delay: t
        }, o), () => {
            f && f()
        }
    }, [Array.isArray(e) ? e.toString() : e, b, u, c, i, s, n, o, t]);
    const j = (d = S.entry) == null ? void 0 : d.target,
        z = v.useRef(void 0);
    !b && j && !i && !s && z.current !== j && (z.current = j, w({
        inView: !!r,
        entry: void 0
    }), l.current = r);
    const a = [I, S.inView, S.entry];
    return a.ref = a[0], a.inView = a[1], a.entry = a[2], a
}
const B = ({
        className: e
    }) => p.jsx("div", {
        className: `w-full h-96 animate-pulse bg-zinc-100/5 dark:bg-zinc-900/50 flex items-center justify-center ${e}`,
        children: p.jsx("div", {
            className: "h-8 w-32 bg-zinc-200/20 dark:bg-zinc-800/50 rounded-lg"
        })
    }),
    V = ({
        children: e,
        fallback: t = p.jsx(B, {}),
        threshold: n = .1,
        rootMargin: c = "900px 0px",
        id: u
    }) => {
        const {
            ref: i,
            inView: s
        } = $({
            threshold: n,
            rootMargin: c,
            triggerOnce: !0
        });
        return p.jsx("div", {
            ref: i,
            className: "min-h-[200px] content-visibility-auto [contain-intrinsic-size:1px_900px]",
            id: u,
            children: s ? e : t
        })
    };
export {
    V as L, B as S
};