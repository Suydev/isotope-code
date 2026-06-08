import {
    r as p,
    j as N
} from "./vendor-react-BfU3Zn2J.js";
const Ue = p.createContext({});

function tt(t) {
    const e = p.useRef(null);
    return e.current === null && (e.current = t()), e.current
}
const Ke = typeof window < "u",
    We = Ke ? p.useLayoutEffect : p.useEffect,
    Qt = p.createContext(null);

function $e(t, e) {
    t.indexOf(e) === -1 && t.push(e)
}

function Ge(t, e) {
    const n = t.indexOf(e);
    n > -1 && t.splice(n, 1)
}

function wr([...t], e, n) {
    const s = e < 0 ? t.length + e : e;
    if (s >= 0 && s < t.length) {
        const i = n < 0 ? t.length + n : n,
            [o] = t.splice(e, 1);
        t.splice(i, 0, o)
    }
    return t
}
const X = (t, e, n) => n > e ? e : n < t ? t : n;
let He = () => {};
const Y = {},
    Ks = t => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(t);

function Ws(t) {
    return typeof t == "object" && t !== null
}
const $s = t => /^0[^.\s]+$/u.test(t);

function ze(t) {
    let e;
    return () => (e === void 0 && (e = t()), e)
}
const G = t => t,
    Vr = (t, e) => n => e(t(n)),
    Bt = (...t) => t.reduce(Vr),
    Rt = (t, e, n) => {
        const s = e - t;
        return s === 0 ? 1 : (n - t) / s
    };
class _e {
    constructor() {
        this.subscriptions = []
    }
    add(e) {
        return $e(this.subscriptions, e), () => Ge(this.subscriptions, e)
    }
    notify(e, n, s) {
        const i = this.subscriptions.length;
        if (i)
            if (i === 1) this.subscriptions[0](e, n, s);
            else
                for (let o = 0; o < i; o++) {
                    const r = this.subscriptions[o];
                    r && r(e, n, s)
                }
    }
    getSize() {
        return this.subscriptions.length
    }
    clear() {
        this.subscriptions.length = 0
    }
}
const z = t => t * 1e3,
    $ = t => t / 1e3;

function Gs(t, e) {
    return e ? t * (1e3 / e) : 0
}
const Hs = (t, e, n) => (((1 - 3 * n + 3 * e) * t + (3 * n - 6 * e)) * t + 3 * e) * t,
    Cr = 1e-7,
    Mr = 12;

function Dr(t, e, n, s, i) {
    let o, r, a = 0;
    do r = e + (n - e) / 2, o = Hs(r, s, i) - t, o > 0 ? n = r : e = r; while (Math.abs(o) > Cr && ++a < Mr);
    return r
}

function jt(t, e, n, s) {
    if (t === e && n === s) return G;
    const i = o => Dr(o, 0, 1, t, n);
    return o => o === 0 || o === 1 ? o : Hs(i(o), e, s)
}
const zs = t => e => e <= .5 ? t(2 * e) / 2 : (2 - t(2 * (1 - e))) / 2,
    _s = t => e => 1 - t(1 - e),
    Xs = jt(.33, 1.53, .69, .99),
    Xe = _s(Xs),
    Ys = zs(Xe),
    qs = t => (t *= 2) < 1 ? .5 * Xe(t) : .5 * (2 - Math.pow(2, -10 * (t - 1))),
    Ye = t => 1 - Math.sin(Math.acos(t)),
    Zs = _s(Ye),
    Js = zs(Ye),
    Rr = jt(.42, 0, 1, 1),
    Er = jt(0, 0, .58, 1),
    Qs = jt(.42, 0, .58, 1),
    Lr = t => Array.isArray(t) && typeof t[0] != "number",
    ti = t => Array.isArray(t) && typeof t[0] == "number",
    kr = {
        linear: G,
        easeIn: Rr,
        easeInOut: Qs,
        easeOut: Er,
        circIn: Ye,
        circInOut: Js,
        circOut: Zs,
        backIn: Xe,
        backInOut: Ys,
        backOut: Xs,
        anticipate: qs
    },
    Fr = t => typeof t == "string",
    An = t => {
        if (ti(t)) {
            He(t.length === 4);
            const [e, n, s, i] = t;
            return jt(e, n, s, i)
        } else if (Fr(t)) return kr[t];
        return t
    },
    Ut = ["setup", "read", "resolveKeyframes", "preUpdate", "update", "preRender", "render", "postRender"];

function Ir(t, e) {
    let n = new Set,
        s = new Set,
        i = !1,
        o = !1;
    const r = new WeakSet;
    let a = {
        delta: 0,
        timestamp: 0,
        isProcessing: !1
    };

    function l(u) {
        r.has(u) && (c.schedule(u), t()), u(a)
    }
    const c = {
        schedule: (u, h = !1, f = !1) => {
            const m = f && i ? n : s;
            return h && r.add(u), m.has(u) || m.add(u), u
        },
        cancel: u => {
            s.delete(u), r.delete(u)
        },
        process: u => {
            if (a = u, i) {
                o = !0;
                return
            }
            i = !0, [n, s] = [s, n], n.forEach(l), n.clear(), i = !1, o && (o = !1, c.process(u))
        }
    };
    return c
}
const Br = 40;

function ei(t, e) {
    let n = !1,
        s = !0;
    const i = {
            delta: 0,
            timestamp: 0,
            isProcessing: !1
        },
        o = () => n = !0,
        r = Ut.reduce((x, A) => (x[A] = Ir(o), x), {}),
        {
            setup: a,
            read: l,
            resolveKeyframes: c,
            preUpdate: u,
            update: h,
            preRender: f,
            render: d,
            postRender: m
        } = r,
        g = () => {
            const x = Y.useManualTiming ? i.timestamp : performance.now();
            n = !1, Y.useManualTiming || (i.delta = s ? 1e3 / 60 : Math.max(Math.min(x - i.timestamp, Br), 1)), i.timestamp = x, i.isProcessing = !0, a.process(i), l.process(i), c.process(i), u.process(i), h.process(i), f.process(i), d.process(i), m.process(i), i.isProcessing = !1, n && e && (s = !1, t(g))
        },
        v = () => {
            n = !0, s = !0, i.isProcessing || t(g)
        };
    return {
        schedule: Ut.reduce((x, A) => {
            const P = r[A];
            return x[A] = (w, V = !1, b = !1) => (n || v(), P.schedule(w, V, b)), x
        }, {}),
        cancel: x => {
            for (let A = 0; A < Ut.length; A++) r[Ut[A]].cancel(x)
        },
        state: i,
        steps: r
    }
}
const {
    schedule: C,
    cancel: q,
    state: I,
    steps: ie
} = ei(typeof requestAnimationFrame < "u" ? requestAnimationFrame : G, !0);
let Gt;

function jr() {
    Gt = void 0
}
const O = {
        now: () => (Gt === void 0 && O.set(I.isProcessing || Y.useManualTiming ? I.timestamp : performance.now()), Gt),
        set: t => {
            Gt = t, queueMicrotask(jr)
        }
    },
    ni = t => e => typeof e == "string" && e.startsWith(t),
    qe = ni("--"),
    Or = ni("var(--"),
    Ze = t => Or(t) ? Nr.test(t.split("/*")[0].trim()) : !1,
    Nr = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu,
    xt = {
        test: t => typeof t == "number",
        parse: parseFloat,
        transform: t => t
    },
    Et = { ...xt,
        transform: t => X(0, 1, t)
    },
    Kt = { ...xt,
        default: 1
    },
    At = t => Math.round(t * 1e5) / 1e5,
    Je = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;

function Ur(t) {
    return t == null
}
const Kr = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,
    Qe = (t, e) => n => !!(typeof n == "string" && Kr.test(n) && n.startsWith(t) || e && !Ur(n) && Object.prototype.hasOwnProperty.call(n, e)),
    si = (t, e, n) => s => {
        if (typeof s != "string") return s;
        const [i, o, r, a] = s.match(Je);
        return {
            [t]: parseFloat(i),
            [e]: parseFloat(o),
            [n]: parseFloat(r),
            alpha: a !== void 0 ? parseFloat(a) : 1
        }
    },
    Wr = t => X(0, 255, t),
    re = { ...xt,
        transform: t => Math.round(Wr(t))
    },
    rt = {
        test: Qe("rgb", "red"),
        parse: si("red", "green", "blue"),
        transform: ({
            red: t,
            green: e,
            blue: n,
            alpha: s = 1
        }) => "rgba(" + re.transform(t) + ", " + re.transform(e) + ", " + re.transform(n) + ", " + At(Et.transform(s)) + ")"
    };

function $r(t) {
    let e = "",
        n = "",
        s = "",
        i = "";
    return t.length > 5 ? (e = t.substring(1, 3), n = t.substring(3, 5), s = t.substring(5, 7), i = t.substring(7, 9)) : (e = t.substring(1, 2), n = t.substring(2, 3), s = t.substring(3, 4), i = t.substring(4, 5), e += e, n += n, s += s, i += i), {
        red: parseInt(e, 16),
        green: parseInt(n, 16),
        blue: parseInt(s, 16),
        alpha: i ? parseInt(i, 16) / 255 : 1
    }
}
const xe = {
        test: Qe("#"),
        parse: $r,
        transform: rt.transform
    },
    Ot = t => ({
        test: e => typeof e == "string" && e.endsWith(t) && e.split(" ").length === 1,
        parse: parseFloat,
        transform: e => `${e}${t}`
    }),
    J = Ot("deg"),
    _ = Ot("%"),
    S = Ot("px"),
    Gr = Ot("vh"),
    Hr = Ot("vw"),
    wn = { ..._,
        parse: t => _.parse(t) / 100,
        transform: t => _.transform(t * 100)
    },
    ft = {
        test: Qe("hsl", "hue"),
        parse: si("hue", "saturation", "lightness"),
        transform: ({
            hue: t,
            saturation: e,
            lightness: n,
            alpha: s = 1
        }) => "hsla(" + Math.round(t) + ", " + _.transform(At(e)) + ", " + _.transform(At(n)) + ", " + At(Et.transform(s)) + ")"
    },
    L = {
        test: t => rt.test(t) || xe.test(t) || ft.test(t),
        parse: t => rt.test(t) ? rt.parse(t) : ft.test(t) ? ft.parse(t) : xe.parse(t),
        transform: t => typeof t == "string" ? t : t.hasOwnProperty("red") ? rt.transform(t) : ft.transform(t),
        getAnimatableNone: t => {
            const e = L.parse(t);
            return e.alpha = 0, L.transform(e)
        }
    },
    zr = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;

function _r(t) {
    return isNaN(t) && typeof t == "string" && (t.match(Je) ?.length || 0) + (t.match(zr) ?.length || 0) > 0
}
const ii = "number",
    ri = "color",
    Xr = "var",
    Yr = "var(",
    Vn = "${}",
    qr = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;

function Lt(t) {
    const e = t.toString(),
        n = [],
        s = {
            color: [],
            number: [],
            var: []
        },
        i = [];
    let o = 0;
    const a = e.replace(qr, l => (L.test(l) ? (s.color.push(o), i.push(ri), n.push(L.parse(l))) : l.startsWith(Yr) ? (s.var.push(o), i.push(Xr), n.push(l)) : (s.number.push(o), i.push(ii), n.push(parseFloat(l))), ++o, Vn)).split(Vn);
    return {
        values: n,
        split: a,
        indexes: s,
        types: i
    }
}

function oi(t) {
    return Lt(t).values
}

function ai(t) {
    const {
        split: e,
        types: n
    } = Lt(t), s = e.length;
    return i => {
        let o = "";
        for (let r = 0; r < s; r++)
            if (o += e[r], i[r] !== void 0) {
                const a = n[r];
                a === ii ? o += At(i[r]) : a === ri ? o += L.transform(i[r]) : o += i[r]
            }
        return o
    }
}
const Zr = t => typeof t == "number" ? 0 : L.test(t) ? L.getAnimatableNone(t) : t;

function Jr(t) {
    const e = oi(t);
    return ai(t)(e.map(Zr))
}
const Q = {
    test: _r,
    parse: oi,
    createTransformer: ai,
    getAnimatableNone: Jr
};

function oe(t, e, n) {
    return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? t + (e - t) * 6 * n : n < 1 / 2 ? e : n < 2 / 3 ? t + (e - t) * (2 / 3 - n) * 6 : t
}

function Qr({
    hue: t,
    saturation: e,
    lightness: n,
    alpha: s
}) {
    t /= 360, e /= 100, n /= 100;
    let i = 0,
        o = 0,
        r = 0;
    if (!e) i = o = r = n;
    else {
        const a = n < .5 ? n * (1 + e) : n + e - n * e,
            l = 2 * n - a;
        i = oe(l, a, t + 1 / 3), o = oe(l, a, t), r = oe(l, a, t - 1 / 3)
    }
    return {
        red: Math.round(i * 255),
        green: Math.round(o * 255),
        blue: Math.round(r * 255),
        alpha: s
    }
}

function Xt(t, e) {
    return n => n > 0 ? e : t
}
const M = (t, e, n) => t + (e - t) * n,
    ae = (t, e, n) => {
        const s = t * t,
            i = n * (e * e - s) + s;
        return i < 0 ? 0 : Math.sqrt(i)
    },
    to = [xe, rt, ft],
    eo = t => to.find(e => e.test(t));

function Cn(t) {
    const e = eo(t);
    if (!e) return !1;
    let n = e.parse(t);
    return e === ft && (n = Qr(n)), n
}
const Mn = (t, e) => {
        const n = Cn(t),
            s = Cn(e);
        if (!n || !s) return Xt(t, e);
        const i = { ...n
        };
        return o => (i.red = ae(n.red, s.red, o), i.green = ae(n.green, s.green, o), i.blue = ae(n.blue, s.blue, o), i.alpha = M(n.alpha, s.alpha, o), rt.transform(i))
    },
    Te = new Set(["none", "hidden"]);

function no(t, e) {
    return Te.has(t) ? n => n <= 0 ? t : e : n => n >= 1 ? e : t
}

function so(t, e) {
    return n => M(t, e, n)
}

function tn(t) {
    return typeof t == "number" ? so : typeof t == "string" ? Ze(t) ? Xt : L.test(t) ? Mn : oo : Array.isArray(t) ? li : typeof t == "object" ? L.test(t) ? Mn : io : Xt
}

function li(t, e) {
    const n = [...t],
        s = n.length,
        i = t.map((o, r) => tn(o)(o, e[r]));
    return o => {
        for (let r = 0; r < s; r++) n[r] = i[r](o);
        return n
    }
}

function io(t, e) {
    const n = { ...t,
            ...e
        },
        s = {};
    for (const i in n) t[i] !== void 0 && e[i] !== void 0 && (s[i] = tn(t[i])(t[i], e[i]));
    return i => {
        for (const o in s) n[o] = s[o](i);
        return n
    }
}

function ro(t, e) {
    const n = [],
        s = {
            color: 0,
            var: 0,
            number: 0
        };
    for (let i = 0; i < e.values.length; i++) {
        const o = e.types[i],
            r = t.indexes[o][s[o]],
            a = t.values[r] ?? 0;
        n[i] = a, s[o]++
    }
    return n
}
const oo = (t, e) => {
    const n = Q.createTransformer(e),
        s = Lt(t),
        i = Lt(e);
    return s.indexes.var.length === i.indexes.var.length && s.indexes.color.length === i.indexes.color.length && s.indexes.number.length >= i.indexes.number.length ? Te.has(t) && !i.values.length || Te.has(e) && !s.values.length ? no(t, e) : Bt(li(ro(s, i), i.values), n) : Xt(t, e)
};

function ui(t, e, n) {
    return typeof t == "number" && typeof e == "number" && typeof n == "number" ? M(t, e, n) : tn(t)(t, e)
}
const ao = t => {
        const e = ({
            timestamp: n
        }) => t(n);
        return {
            start: (n = !0) => C.update(e, n),
            stop: () => q(e),
            now: () => I.isProcessing ? I.timestamp : O.now()
        }
    },
    ci = (t, e, n = 10) => {
        let s = "";
        const i = Math.max(Math.round(e / n), 2);
        for (let o = 0; o < i; o++) s += Math.round(t(o / (i - 1)) * 1e4) / 1e4 + ", ";
        return `linear(${s.substring(0,s.length-2)})`
    },
    Yt = 2e4;

function en(t) {
    let e = 0;
    const n = 50;
    let s = t.next(e);
    for (; !s.done && e < Yt;) e += n, s = t.next(e);
    return e >= Yt ? 1 / 0 : e
}

function lo(t, e = 100, n) {
    const s = n({ ...t,
            keyframes: [0, e]
        }),
        i = Math.min(en(s), Yt);
    return {
        type: "keyframes",
        ease: o => s.next(i * o).value / e,
        duration: $(i)
    }
}
const uo = 5;

function hi(t, e, n) {
    const s = Math.max(e - uo, 0);
    return Gs(n - t(s), e - s)
}
const D = {
        stiffness: 100,
        damping: 10,
        mass: 1,
        velocity: 0,
        duration: 800,
        bounce: .3,
        visualDuration: .3,
        restSpeed: {
            granular: .01,
            default: 2
        },
        restDelta: {
            granular: .005,
            default: .5
        },
        minDuration: .01,
        maxDuration: 10,
        minDamping: .05,
        maxDamping: 1
    },
    le = .001;

function co({
    duration: t = D.duration,
    bounce: e = D.bounce,
    velocity: n = D.velocity,
    mass: s = D.mass
}) {
    let i, o, r = 1 - e;
    r = X(D.minDamping, D.maxDamping, r), t = X(D.minDuration, D.maxDuration, $(t)), r < 1 ? (i = c => {
        const u = c * r,
            h = u * t,
            f = u - n,
            d = Pe(c, r),
            m = Math.exp(-h);
        return le - f / d * m
    }, o = c => {
        const h = c * r * t,
            f = h * n + n,
            d = Math.pow(r, 2) * Math.pow(c, 2) * t,
            m = Math.exp(-h),
            g = Pe(Math.pow(c, 2), r);
        return (-i(c) + le > 0 ? -1 : 1) * ((f - d) * m) / g
    }) : (i = c => {
        const u = Math.exp(-c * t),
            h = (c - n) * t + 1;
        return -le + u * h
    }, o = c => {
        const u = Math.exp(-c * t),
            h = (n - c) * (t * t);
        return u * h
    });
    const a = 5 / t,
        l = fo(i, o, a);
    if (t = z(t), isNaN(l)) return {
        stiffness: D.stiffness,
        damping: D.damping,
        duration: t
    }; {
        const c = Math.pow(l, 2) * s;
        return {
            stiffness: c,
            damping: r * 2 * Math.sqrt(s * c),
            duration: t
        }
    }
}
const ho = 12;

function fo(t, e, n) {
    let s = n;
    for (let i = 1; i < ho; i++) s = s - t(s) / e(s);
    return s
}

function Pe(t, e) {
    return t * Math.sqrt(1 - e * e)
}
const mo = ["duration", "bounce"],
    po = ["stiffness", "damping", "mass"];

function Dn(t, e) {
    return e.some(n => t[n] !== void 0)
}

function go(t) {
    let e = {
        velocity: D.velocity,
        stiffness: D.stiffness,
        damping: D.damping,
        mass: D.mass,
        isResolvedFromDuration: !1,
        ...t
    };
    if (!Dn(t, po) && Dn(t, mo))
        if (t.visualDuration) {
            const n = t.visualDuration,
                s = 2 * Math.PI / (n * 1.2),
                i = s * s,
                o = 2 * X(.05, 1, 1 - (t.bounce || 0)) * Math.sqrt(i);
            e = { ...e,
                mass: D.mass,
                stiffness: i,
                damping: o
            }
        } else {
            const n = co(t);
            e = { ...e,
                ...n,
                mass: D.mass
            }, e.isResolvedFromDuration = !0
        }
    return e
}

function qt(t = D.visualDuration, e = D.bounce) {
    const n = typeof t != "object" ? {
        visualDuration: t,
        keyframes: [0, 1],
        bounce: e
    } : t;
    let {
        restSpeed: s,
        restDelta: i
    } = n;
    const o = n.keyframes[0],
        r = n.keyframes[n.keyframes.length - 1],
        a = {
            done: !1,
            value: o
        },
        {
            stiffness: l,
            damping: c,
            mass: u,
            duration: h,
            velocity: f,
            isResolvedFromDuration: d
        } = go({ ...n,
            velocity: -$(n.velocity || 0)
        }),
        m = f || 0,
        g = c / (2 * Math.sqrt(l * u)),
        v = r - o,
        y = $(Math.sqrt(l / u)),
        T = Math.abs(v) < 5;
    s || (s = T ? D.restSpeed.granular : D.restSpeed.default), i || (i = T ? D.restDelta.granular : D.restDelta.default);
    let x;
    if (g < 1) {
        const P = Pe(y, g);
        x = w => {
            const V = Math.exp(-g * y * w);
            return r - V * ((m + g * y * v) / P * Math.sin(P * w) + v * Math.cos(P * w))
        }
    } else if (g === 1) x = P => r - Math.exp(-y * P) * (v + (m + y * v) * P);
    else {
        const P = y * Math.sqrt(g * g - 1);
        x = w => {
            const V = Math.exp(-g * y * w),
                b = Math.min(P * w, 300);
            return r - V * ((m + g * y * v) * Math.sinh(b) + P * v * Math.cosh(b)) / P
        }
    }
    const A = {
        calculatedDuration: d && h || null,
        next: P => {
            const w = x(P);
            if (d) a.done = P >= h;
            else {
                let V = P === 0 ? m : 0;
                g < 1 && (V = P === 0 ? z(m) : hi(x, P, w));
                const b = Math.abs(V) <= s,
                    k = Math.abs(r - w) <= i;
                a.done = b && k
            }
            return a.value = a.done ? r : w, a
        },
        toString: () => {
            const P = Math.min(en(A), Yt),
                w = ci(V => A.next(P * V).value, P, 30);
            return P + "ms " + w
        },
        toTransition: () => {}
    };
    return A
}
qt.applyToOptions = t => {
    const e = lo(t, 100, qt);
    return t.ease = e.ease, t.duration = z(e.duration), t.type = "keyframes", t
};

function Se({
    keyframes: t,
    velocity: e = 0,
    power: n = .8,
    timeConstant: s = 325,
    bounceDamping: i = 10,
    bounceStiffness: o = 500,
    modifyTarget: r,
    min: a,
    max: l,
    restDelta: c = .5,
    restSpeed: u
}) {
    const h = t[0],
        f = {
            done: !1,
            value: h
        },
        d = b => a !== void 0 && b < a || l !== void 0 && b > l,
        m = b => a === void 0 ? l : l === void 0 || Math.abs(a - b) < Math.abs(l - b) ? a : l;
    let g = n * e;
    const v = h + g,
        y = r === void 0 ? v : r(v);
    y !== v && (g = y - h);
    const T = b => -g * Math.exp(-b / s),
        x = b => y + T(b),
        A = b => {
            const k = T(b),
                B = x(b);
            f.done = Math.abs(k) <= c, f.value = f.done ? y : B
        };
    let P, w;
    const V = b => {
        d(f.value) && (P = b, w = qt({
            keyframes: [f.value, m(f.value)],
            velocity: hi(x, b, f.value),
            damping: i,
            stiffness: o,
            restDelta: c,
            restSpeed: u
        }))
    };
    return V(0), {
        calculatedDuration: null,
        next: b => {
            let k = !1;
            return !w && P === void 0 && (k = !0, A(b), V(b)), P !== void 0 && b >= P ? w.next(b - P) : (!k && A(b), f)
        }
    }
}

function yo(t, e, n) {
    const s = [],
        i = n || Y.mix || ui,
        o = t.length - 1;
    for (let r = 0; r < o; r++) {
        let a = i(t[r], t[r + 1]);
        if (e) {
            const l = Array.isArray(e) ? e[r] || G : e;
            a = Bt(l, a)
        }
        s.push(a)
    }
    return s
}

function fi(t, e, {
    clamp: n = !0,
    ease: s,
    mixer: i
} = {}) {
    const o = t.length;
    if (He(o === e.length), o === 1) return () => e[0];
    if (o === 2 && e[0] === e[1]) return () => e[1];
    const r = t[0] === t[1];
    t[0] > t[o - 1] && (t = [...t].reverse(), e = [...e].reverse());
    const a = yo(e, s, i),
        l = a.length,
        c = u => {
            if (r && u < t[0]) return e[0];
            let h = 0;
            if (l > 1)
                for (; h < t.length - 2 && !(u < t[h + 1]); h++);
            const f = Rt(t[h], t[h + 1], u);
            return a[h](f)
        };
    return n ? u => c(X(t[0], t[o - 1], u)) : c
}

function vo(t, e) {
    const n = t[t.length - 1];
    for (let s = 1; s <= e; s++) {
        const i = Rt(0, e, s);
        t.push(M(n, 1, i))
    }
}

function xo(t) {
    const e = [0];
    return vo(e, t.length - 1), e
}

function To(t, e) {
    return t.map(n => n * e)
}

function Po(t, e) {
    return t.map(() => e || Qs).splice(0, t.length - 1)
}

function wt({
    duration: t = 300,
    keyframes: e,
    times: n,
    ease: s = "easeInOut"
}) {
    const i = Lr(s) ? s.map(An) : An(s),
        o = {
            done: !1,
            value: e[0]
        },
        r = To(n && n.length === e.length ? n : xo(e), t),
        a = fi(r, e, {
            ease: Array.isArray(i) ? i : Po(e, i)
        });
    return {
        calculatedDuration: t,
        next: l => (o.value = a(l), o.done = l >= t, o)
    }
}
const So = t => t !== null;

function nn(t, {
    repeat: e,
    repeatType: n = "loop"
}, s, i = 1) {
    const o = t.filter(So),
        a = i < 0 || e && n !== "loop" && e % 2 === 1 ? 0 : o.length - 1;
    return !a || s === void 0 ? o[a] : s
}
const bo = {
    decay: Se,
    inertia: Se,
    tween: wt,
    keyframes: wt,
    spring: qt
};

function di(t) {
    typeof t.type == "string" && (t.type = bo[t.type])
}
class sn {
    constructor() {
        this.updateFinished()
    }
    get finished() {
        return this._finished
    }
    updateFinished() {
        this._finished = new Promise(e => {
            this.resolve = e
        })
    }
    notifyFinished() {
        this.resolve()
    }
    then(e, n) {
        return this.finished.then(e, n)
    }
}
const Ao = t => t / 100;
class te extends sn {
    constructor(e) {
        super(), this.state = "idle", this.startTime = null, this.isStopped = !1, this.currentTime = 0, this.holdTime = null, this.playbackSpeed = 1, this.stop = () => {
            const {
                motionValue: n
            } = this.options;
            n && n.updatedAt !== O.now() && this.tick(O.now()), this.isStopped = !0, this.state !== "idle" && (this.teardown(), this.options.onStop ?.())
        }, this.options = e, this.initAnimation(), this.play(), e.autoplay === !1 && this.pause()
    }
    initAnimation() {
        const {
            options: e
        } = this;
        di(e);
        const {
            type: n = wt,
            repeat: s = 0,
            repeatDelay: i = 0,
            repeatType: o,
            velocity: r = 0
        } = e;
        let {
            keyframes: a
        } = e;
        const l = n || wt;
        l !== wt && typeof a[0] != "number" && (this.mixKeyframes = Bt(Ao, ui(a[0], a[1])), a = [0, 100]);
        const c = l({ ...e,
            keyframes: a
        });
        o === "mirror" && (this.mirroredGenerator = l({ ...e,
            keyframes: [...a].reverse(),
            velocity: -r
        })), c.calculatedDuration === null && (c.calculatedDuration = en(c));
        const {
            calculatedDuration: u
        } = c;
        this.calculatedDuration = u, this.resolvedDuration = u + i, this.totalDuration = this.resolvedDuration * (s + 1) - i, this.generator = c
    }
    updateTime(e) {
        const n = Math.round(e - this.startTime) * this.playbackSpeed;
        this.holdTime !== null ? this.currentTime = this.holdTime : this.currentTime = n
    }
    tick(e, n = !1) {
        const {
            generator: s,
            totalDuration: i,
            mixKeyframes: o,
            mirroredGenerator: r,
            resolvedDuration: a,
            calculatedDuration: l
        } = this;
        if (this.startTime === null) return s.next(0);
        const {
            delay: c = 0,
            keyframes: u,
            repeat: h,
            repeatType: f,
            repeatDelay: d,
            type: m,
            onUpdate: g,
            finalKeyframe: v
        } = this.options;
        this.speed > 0 ? this.startTime = Math.min(this.startTime, e) : this.speed < 0 && (this.startTime = Math.min(e - i / this.speed, this.startTime)), n ? this.currentTime = e : this.updateTime(e);
        const y = this.currentTime - c * (this.playbackSpeed >= 0 ? 1 : -1),
            T = this.playbackSpeed >= 0 ? y < 0 : y > i;
        this.currentTime = Math.max(y, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = i);
        let x = this.currentTime,
            A = s;
        if (h) {
            const b = Math.min(this.currentTime, i) / a;
            let k = Math.floor(b),
                B = b % 1;
            !B && b >= 1 && (B = 1), B === 1 && k--, k = Math.min(k, h + 1), !!(k % 2) && (f === "reverse" ? (B = 1 - B, d && (B -= d / a)) : f === "mirror" && (A = r)), x = X(0, 1, B) * a
        }
        const P = T ? {
            done: !1,
            value: u[0]
        } : A.next(x);
        o && (P.value = o(P.value));
        let {
            done: w
        } = P;
        !T && l !== null && (w = this.playbackSpeed >= 0 ? this.currentTime >= i : this.currentTime <= 0);
        const V = this.holdTime === null && (this.state === "finished" || this.state === "running" && w);
        return V && m !== Se && (P.value = nn(u, this.options, v, this.speed)), g && g(P.value), V && this.finish(), P
    }
    then(e, n) {
        return this.finished.then(e, n)
    }
    get duration() {
        return $(this.calculatedDuration)
    }
    get iterationDuration() {
        const {
            delay: e = 0
        } = this.options || {};
        return this.duration + $(e)
    }
    get time() {
        return $(this.currentTime)
    }
    set time(e) {
        e = z(e), this.currentTime = e, this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0 ? this.holdTime = e : this.driver && (this.startTime = this.driver.now() - e / this.playbackSpeed), this.driver ?.start(!1)
    }
    get speed() {
        return this.playbackSpeed
    }
    set speed(e) {
        this.updateTime(O.now());
        const n = this.playbackSpeed !== e;
        this.playbackSpeed = e, n && (this.time = $(this.currentTime))
    }
    play() {
        if (this.isStopped) return;
        const {
            driver: e = ao,
            startTime: n
        } = this.options;
        this.driver || (this.driver = e(i => this.tick(i))), this.options.onPlay ?.();
        const s = this.driver.now();
        this.state === "finished" ? (this.updateFinished(), this.startTime = s) : this.holdTime !== null ? this.startTime = s - this.holdTime : this.startTime || (this.startTime = n ?? s), this.state === "finished" && this.speed < 0 && (this.startTime += this.calculatedDuration), this.holdTime = null, this.state = "running", this.driver.start()
    }
    pause() {
        this.state = "paused", this.updateTime(O.now()), this.holdTime = this.currentTime
    }
    complete() {
        this.state !== "running" && this.play(), this.state = "finished", this.holdTime = null
    }
    finish() {
        this.notifyFinished(), this.teardown(), this.state = "finished", this.options.onComplete ?.()
    }
    cancel() {
        this.holdTime = null, this.startTime = 0, this.tick(0), this.teardown(), this.options.onCancel ?.()
    }
    teardown() {
        this.state = "idle", this.stopDriver(), this.startTime = this.holdTime = null
    }
    stopDriver() {
        this.driver && (this.driver.stop(), this.driver = void 0)
    }
    sample(e) {
        return this.startTime = 0, this.tick(e, !0)
    }
    attachTimeline(e) {
        return this.options.allowFlatten && (this.options.type = "keyframes", this.options.ease = "linear", this.initAnimation()), this.driver ?.stop(), e.observe(this)
    }
}

function wo(t) {
    for (let e = 1; e < t.length; e++) t[e] ?? (t[e] = t[e - 1])
}
const ot = t => t * 180 / Math.PI,
    be = t => {
        const e = ot(Math.atan2(t[1], t[0]));
        return Ae(e)
    },
    Vo = {
        x: 4,
        y: 5,
        translateX: 4,
        translateY: 5,
        scaleX: 0,
        scaleY: 3,
        scale: t => (Math.abs(t[0]) + Math.abs(t[3])) / 2,
        rotate: be,
        rotateZ: be,
        skewX: t => ot(Math.atan(t[1])),
        skewY: t => ot(Math.atan(t[2])),
        skew: t => (Math.abs(t[1]) + Math.abs(t[2])) / 2
    },
    Ae = t => (t = t % 360, t < 0 && (t += 360), t),
    Rn = be,
    En = t => Math.sqrt(t[0] * t[0] + t[1] * t[1]),
    Ln = t => Math.sqrt(t[4] * t[4] + t[5] * t[5]),
    Co = {
        x: 12,
        y: 13,
        z: 14,
        translateX: 12,
        translateY: 13,
        translateZ: 14,
        scaleX: En,
        scaleY: Ln,
        scale: t => (En(t) + Ln(t)) / 2,
        rotateX: t => Ae(ot(Math.atan2(t[6], t[5]))),
        rotateY: t => Ae(ot(Math.atan2(-t[2], t[0]))),
        rotateZ: Rn,
        rotate: Rn,
        skewX: t => ot(Math.atan(t[4])),
        skewY: t => ot(Math.atan(t[1])),
        skew: t => (Math.abs(t[1]) + Math.abs(t[4])) / 2
    };

function we(t) {
    return t.includes("scale") ? 1 : 0
}

function Ve(t, e) {
    if (!t || t === "none") return we(e);
    const n = t.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
    let s, i;
    if (n) s = Co, i = n;
    else {
        const a = t.match(/^matrix\(([-\d.e\s,]+)\)$/u);
        s = Vo, i = a
    }
    if (!i) return we(e);
    const o = s[e],
        r = i[1].split(",").map(Do);
    return typeof o == "function" ? o(r) : r[o]
}
const Mo = (t, e) => {
    const {
        transform: n = "none"
    } = getComputedStyle(t);
    return Ve(n, e)
};

function Do(t) {
    return parseFloat(t.trim())
}
const Tt = ["transformPerspective", "x", "y", "z", "translateX", "translateY", "translateZ", "scale", "scaleX", "scaleY", "rotate", "rotateX", "rotateY", "rotateZ", "skew", "skewX", "skewY"],
    Pt = new Set(Tt),
    kn = t => t === xt || t === S,
    Ro = new Set(["x", "y", "z"]),
    Eo = Tt.filter(t => !Ro.has(t));

function Lo(t) {
    const e = [];
    return Eo.forEach(n => {
        const s = t.getValue(n);
        s !== void 0 && (e.push([n, s.get()]), s.set(n.startsWith("scale") ? 1 : 0))
    }), e
}
const at = {
    width: ({
        x: t
    }, {
        paddingLeft: e = "0",
        paddingRight: n = "0"
    }) => t.max - t.min - parseFloat(e) - parseFloat(n),
    height: ({
        y: t
    }, {
        paddingTop: e = "0",
        paddingBottom: n = "0"
    }) => t.max - t.min - parseFloat(e) - parseFloat(n),
    top: (t, {
        top: e
    }) => parseFloat(e),
    left: (t, {
        left: e
    }) => parseFloat(e),
    bottom: ({
        y: t
    }, {
        top: e
    }) => parseFloat(e) + (t.max - t.min),
    right: ({
        x: t
    }, {
        left: e
    }) => parseFloat(e) + (t.max - t.min),
    x: (t, {
        transform: e
    }) => Ve(e, "x"),
    y: (t, {
        transform: e
    }) => Ve(e, "y")
};
at.translateX = at.x;
at.translateY = at.y;
const lt = new Set;
let Ce = !1,
    Me = !1,
    De = !1;

function mi() {
    if (Me) {
        const t = Array.from(lt).filter(s => s.needsMeasurement),
            e = new Set(t.map(s => s.element)),
            n = new Map;
        e.forEach(s => {
            const i = Lo(s);
            i.length && (n.set(s, i), s.render())
        }), t.forEach(s => s.measureInitialState()), e.forEach(s => {
            s.render();
            const i = n.get(s);
            i && i.forEach(([o, r]) => {
                s.getValue(o) ?.set(r)
            })
        }), t.forEach(s => s.measureEndState()), t.forEach(s => {
            s.suspendedScrollY !== void 0 && window.scrollTo(0, s.suspendedScrollY)
        })
    }
    Me = !1, Ce = !1, lt.forEach(t => t.complete(De)), lt.clear()
}

function pi() {
    lt.forEach(t => {
        t.readKeyframes(), t.needsMeasurement && (Me = !0)
    })
}

function ko() {
    De = !0, pi(), mi(), De = !1
}
class rn {
    constructor(e, n, s, i, o, r = !1) {
        this.state = "pending", this.isAsync = !1, this.needsMeasurement = !1, this.unresolvedKeyframes = [...e], this.onComplete = n, this.name = s, this.motionValue = i, this.element = o, this.isAsync = r
    }
    scheduleResolve() {
        this.state = "scheduled", this.isAsync ? (lt.add(this), Ce || (Ce = !0, C.read(pi), C.resolveKeyframes(mi))) : (this.readKeyframes(), this.complete())
    }
    readKeyframes() {
        const {
            unresolvedKeyframes: e,
            name: n,
            element: s,
            motionValue: i
        } = this;
        if (e[0] === null) {
            const o = i ?.get(),
                r = e[e.length - 1];
            if (o !== void 0) e[0] = o;
            else if (s && n) {
                const a = s.readValue(n, r);
                a != null && (e[0] = a)
            }
            e[0] === void 0 && (e[0] = r), i && o === void 0 && i.set(e[0])
        }
        wo(e)
    }
    setFinalKeyframe() {}
    measureInitialState() {}
    renderEndStyles() {}
    measureEndState() {}
    complete(e = !1) {
        this.state = "complete", this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, e), lt.delete(this)
    }
    cancel() {
        this.state === "scheduled" && (lt.delete(this), this.state = "pending")
    }
    resume() {
        this.state === "pending" && this.scheduleResolve()
    }
}
const Fo = t => t.startsWith("--");

function Io(t, e, n) {
    Fo(e) ? t.style.setProperty(e, n) : t.style[e] = n
}
const Bo = ze(() => window.ScrollTimeline !== void 0),
    jo = {};

function Oo(t, e) {
    const n = ze(t);
    return () => jo[e] ?? n()
}
const gi = Oo(() => {
        try {
            document.createElement("div").animate({
                opacity: 0
            }, {
                easing: "linear(0, 1)"
            })
        } catch {
            return !1
        }
        return !0
    }, "linearEasing"),
    bt = ([t, e, n, s]) => `cubic-bezier(${t}, ${e}, ${n}, ${s})`,
    Fn = {
        linear: "linear",
        ease: "ease",
        easeIn: "ease-in",
        easeOut: "ease-out",
        easeInOut: "ease-in-out",
        circIn: bt([0, .65, .55, 1]),
        circOut: bt([.55, 0, 1, .45]),
        backIn: bt([.31, .01, .66, -.59]),
        backOut: bt([.33, 1.53, .69, .99])
    };

function yi(t, e) {
    if (t) return typeof t == "function" ? gi() ? ci(t, e) : "ease-out" : ti(t) ? bt(t) : Array.isArray(t) ? t.map(n => yi(n, e) || Fn.easeOut) : Fn[t]
}

function No(t, e, n, {
    delay: s = 0,
    duration: i = 300,
    repeat: o = 0,
    repeatType: r = "loop",
    ease: a = "easeOut",
    times: l
} = {}, c = void 0) {
    const u = {
        [e]: n
    };
    l && (u.offset = l);
    const h = yi(a, i);
    Array.isArray(h) && (u.easing = h);
    const f = {
        delay: s,
        duration: i,
        easing: Array.isArray(h) ? "linear" : h,
        fill: "both",
        iterations: o + 1,
        direction: r === "reverse" ? "alternate" : "normal"
    };
    return c && (f.pseudoElement = c), t.animate(u, f)
}

function vi(t) {
    return typeof t == "function" && "applyToOptions" in t
}

function Uo({
    type: t,
    ...e
}) {
    return vi(t) && gi() ? t.applyToOptions(e) : (e.duration ?? (e.duration = 300), e.ease ?? (e.ease = "easeOut"), e)
}
class Ko extends sn {
    constructor(e) {
        if (super(), this.finishedTime = null, this.isStopped = !1, !e) return;
        const {
            element: n,
            name: s,
            keyframes: i,
            pseudoElement: o,
            allowFlatten: r = !1,
            finalKeyframe: a,
            onComplete: l
        } = e;
        this.isPseudoElement = !!o, this.allowFlatten = r, this.options = e, He(typeof e.type != "string");
        const c = Uo(e);
        this.animation = No(n, s, i, c, o), c.autoplay === !1 && this.animation.pause(), this.animation.onfinish = () => {
            if (this.finishedTime = this.time, !o) {
                const u = nn(i, this.options, a, this.speed);
                this.updateMotionValue ? this.updateMotionValue(u) : Io(n, s, u), this.animation.cancel()
            }
            l ?.(), this.notifyFinished()
        }
    }
    play() {
        this.isStopped || (this.animation.play(), this.state === "finished" && this.updateFinished())
    }
    pause() {
        this.animation.pause()
    }
    complete() {
        this.animation.finish ?.()
    }
    cancel() {
        try {
            this.animation.cancel()
        } catch {}
    }
    stop() {
        if (this.isStopped) return;
        this.isStopped = !0;
        const {
            state: e
        } = this;
        e === "idle" || e === "finished" || (this.updateMotionValue ? this.updateMotionValue() : this.commitStyles(), this.isPseudoElement || this.cancel())
    }
    commitStyles() {
        this.isPseudoElement || this.animation.commitStyles ?.()
    }
    get duration() {
        const e = this.animation.effect ?.getComputedTiming ?.().duration || 0;
        return $(Number(e))
    }
    get iterationDuration() {
        const {
            delay: e = 0
        } = this.options || {};
        return this.duration + $(e)
    }
    get time() {
        return $(Number(this.animation.currentTime) || 0)
    }
    set time(e) {
        this.finishedTime = null, this.animation.currentTime = z(e)
    }
    get speed() {
        return this.animation.playbackRate
    }
    set speed(e) {
        e < 0 && (this.finishedTime = null), this.animation.playbackRate = e
    }
    get state() {
        return this.finishedTime !== null ? "finished" : this.animation.playState
    }
    get startTime() {
        return Number(this.animation.startTime)
    }
    set startTime(e) {
        this.animation.startTime = e
    }
    attachTimeline({
        timeline: e,
        observe: n
    }) {
        return this.allowFlatten && this.animation.effect ?.updateTiming({
            easing: "linear"
        }), this.animation.onfinish = null, e && Bo() ? (this.animation.timeline = e, G) : n(this)
    }
}
const xi = {
    anticipate: qs,
    backInOut: Ys,
    circInOut: Js
};

function Wo(t) {
    return t in xi
}

function $o(t) {
    typeof t.ease == "string" && Wo(t.ease) && (t.ease = xi[t.ease])
}
const In = 10;
class Go extends Ko {
    constructor(e) {
        $o(e), di(e), super(e), e.startTime && (this.startTime = e.startTime), this.options = e
    }
    updateMotionValue(e) {
        const {
            motionValue: n,
            onUpdate: s,
            onComplete: i,
            element: o,
            ...r
        } = this.options;
        if (!n) return;
        if (e !== void 0) {
            n.set(e);
            return
        }
        const a = new te({ ...r,
                autoplay: !1
            }),
            l = z(this.finishedTime ?? this.time);
        n.setWithVelocity(a.sample(l - In).value, a.sample(l).value, In), a.stop()
    }
}
const Bn = (t, e) => e === "zIndex" ? !1 : !!(typeof t == "number" || Array.isArray(t) || typeof t == "string" && (Q.test(t) || t === "0") && !t.startsWith("url("));

function Ho(t) {
    const e = t[0];
    if (t.length === 1) return !0;
    for (let n = 0; n < t.length; n++)
        if (t[n] !== e) return !0
}

function zo(t, e, n, s) {
    const i = t[0];
    if (i === null) return !1;
    if (e === "display" || e === "visibility") return !0;
    const o = t[t.length - 1],
        r = Bn(i, e),
        a = Bn(o, e);
    return !r || !a ? !1 : Ho(t) || (n === "spring" || vi(n)) && s
}

function Re(t) {
    t.duration = 0, t.type = "keyframes"
}
const _o = new Set(["opacity", "clipPath", "filter", "transform"]),
    Xo = ze(() => Object.hasOwnProperty.call(Element.prototype, "animate"));

function Yo(t) {
    const {
        motionValue: e,
        name: n,
        repeatDelay: s,
        repeatType: i,
        damping: o,
        type: r
    } = t;
    if (!(e ?.owner ?.current instanceof HTMLElement)) return !1;
    const {
        onUpdate: l,
        transformTemplate: c
    } = e.owner.getProps();
    return Xo() && n && _o.has(n) && (n !== "transform" || !c) && !l && !s && i !== "mirror" && o !== 0 && r !== "inertia"
}
const qo = 40;
class Zo extends sn {
    constructor({
        autoplay: e = !0,
        delay: n = 0,
        type: s = "keyframes",
        repeat: i = 0,
        repeatDelay: o = 0,
        repeatType: r = "loop",
        keyframes: a,
        name: l,
        motionValue: c,
        element: u,
        ...h
    }) {
        super(), this.stop = () => {
            this._animation && (this._animation.stop(), this.stopTimeline ?.()), this.keyframeResolver ?.cancel()
        }, this.createdAt = O.now();
        const f = {
                autoplay: e,
                delay: n,
                type: s,
                repeat: i,
                repeatDelay: o,
                repeatType: r,
                name: l,
                motionValue: c,
                element: u,
                ...h
            },
            d = u ?.KeyframeResolver || rn;
        this.keyframeResolver = new d(a, (m, g, v) => this.onKeyframesResolved(m, g, f, !v), l, c, u), this.keyframeResolver ?.scheduleResolve()
    }
    onKeyframesResolved(e, n, s, i) {
        this.keyframeResolver = void 0;
        const {
            name: o,
            type: r,
            velocity: a,
            delay: l,
            isHandoff: c,
            onUpdate: u
        } = s;
        this.resolvedAt = O.now(), zo(e, o, r, a) || ((Y.instantAnimations || !l) && u ?.(nn(e, s, n)), e[0] = e[e.length - 1], Re(s), s.repeat = 0);
        const f = {
                startTime: i ? this.resolvedAt ? this.resolvedAt - this.createdAt > qo ? this.resolvedAt : this.createdAt : this.createdAt : void 0,
                finalKeyframe: n,
                ...s,
                keyframes: e
            },
            d = !c && Yo(f) ? new Go({ ...f,
                element: f.motionValue.owner.current
            }) : new te(f);
        d.finished.then(() => this.notifyFinished()).catch(G), this.pendingTimeline && (this.stopTimeline = d.attachTimeline(this.pendingTimeline), this.pendingTimeline = void 0), this._animation = d
    }
    get finished() {
        return this._animation ? this.animation.finished : this._finished
    }
    then(e, n) {
        return this.finished.finally(e).then(() => {})
    }
    get animation() {
        return this._animation || (this.keyframeResolver ?.resume(), ko()), this._animation
    }
    get duration() {
        return this.animation.duration
    }
    get iterationDuration() {
        return this.animation.iterationDuration
    }
    get time() {
        return this.animation.time
    }
    set time(e) {
        this.animation.time = e
    }
    get speed() {
        return this.animation.speed
    }
    get state() {
        return this.animation.state
    }
    set speed(e) {
        this.animation.speed = e
    }
    get startTime() {
        return this.animation.startTime
    }
    attachTimeline(e) {
        return this._animation ? this.stopTimeline = this.animation.attachTimeline(e) : this.pendingTimeline = e, () => this.stop()
    }
    play() {
        this.animation.play()
    }
    pause() {
        this.animation.pause()
    }
    complete() {
        this.animation.complete()
    }
    cancel() {
        this._animation && this.animation.cancel(), this.keyframeResolver ?.cancel()
    }
}
const Jo = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;

function Qo(t) {
    const e = Jo.exec(t);
    if (!e) return [, ];
    const [, n, s, i] = e;
    return [`--${n??s}`, i]
}

function Ti(t, e, n = 1) {
    const [s, i] = Qo(t);
    if (!s) return;
    const o = window.getComputedStyle(e).getPropertyValue(s);
    if (o) {
        const r = o.trim();
        return Ks(r) ? parseFloat(r) : r
    }
    return Ze(i) ? Ti(i, e, n + 1) : i
}

function on(t, e) {
    return t ?.[e] ?? t ?.default ?? t
}
const Pi = new Set(["width", "height", "top", "left", "right", "bottom", ...Tt]),
    ta = {
        test: t => t === "auto",
        parse: t => t
    },
    Si = t => e => e.test(t),
    bi = [xt, S, _, J, Hr, Gr, ta],
    jn = t => bi.find(Si(t));

function ea(t) {
    return typeof t == "number" ? t === 0 : t !== null ? t === "none" || t === "0" || $s(t) : !0
}
const na = new Set(["brightness", "contrast", "saturate", "opacity"]);

function sa(t) {
    const [e, n] = t.slice(0, -1).split("(");
    if (e === "drop-shadow") return t;
    const [s] = n.match(Je) || [];
    if (!s) return t;
    const i = n.replace(s, "");
    let o = na.has(e) ? 1 : 0;
    return s !== n && (o *= 100), e + "(" + o + i + ")"
}
const ia = /\b([a-z-]*)\(.*?\)/gu,
    Ee = { ...Q,
        getAnimatableNone: t => {
            const e = t.match(ia);
            return e ? e.map(sa).join(" ") : t
        }
    },
    On = { ...xt,
        transform: Math.round
    },
    ra = {
        rotate: J,
        rotateX: J,
        rotateY: J,
        rotateZ: J,
        scale: Kt,
        scaleX: Kt,
        scaleY: Kt,
        scaleZ: Kt,
        skew: J,
        skewX: J,
        skewY: J,
        distance: S,
        translateX: S,
        translateY: S,
        translateZ: S,
        x: S,
        y: S,
        z: S,
        perspective: S,
        transformPerspective: S,
        opacity: Et,
        originX: wn,
        originY: wn,
        originZ: S
    },
    an = {
        borderWidth: S,
        borderTopWidth: S,
        borderRightWidth: S,
        borderBottomWidth: S,
        borderLeftWidth: S,
        borderRadius: S,
        radius: S,
        borderTopLeftRadius: S,
        borderTopRightRadius: S,
        borderBottomRightRadius: S,
        borderBottomLeftRadius: S,
        width: S,
        maxWidth: S,
        height: S,
        maxHeight: S,
        top: S,
        right: S,
        bottom: S,
        left: S,
        padding: S,
        paddingTop: S,
        paddingRight: S,
        paddingBottom: S,
        paddingLeft: S,
        margin: S,
        marginTop: S,
        marginRight: S,
        marginBottom: S,
        marginLeft: S,
        backgroundPositionX: S,
        backgroundPositionY: S,
        ...ra,
        zIndex: On,
        fillOpacity: Et,
        strokeOpacity: Et,
        numOctaves: On
    },
    oa = { ...an,
        color: L,
        backgroundColor: L,
        outlineColor: L,
        fill: L,
        stroke: L,
        borderColor: L,
        borderTopColor: L,
        borderRightColor: L,
        borderBottomColor: L,
        borderLeftColor: L,
        filter: Ee,
        WebkitFilter: Ee
    },
    Ai = t => oa[t];

function wi(t, e) {
    let n = Ai(t);
    return n !== Ee && (n = Q), n.getAnimatableNone ? n.getAnimatableNone(e) : void 0
}
const aa = new Set(["auto", "none", "0"]);

function la(t, e, n) {
    let s = 0,
        i;
    for (; s < t.length && !i;) {
        const o = t[s];
        typeof o == "string" && !aa.has(o) && Lt(o).values.length && (i = t[s]), s++
    }
    if (i && n)
        for (const o of e) t[o] = wi(n, i)
}
class ua extends rn {
    constructor(e, n, s, i, o) {
        super(e, n, s, i, o, !0)
    }
    readKeyframes() {
        const {
            unresolvedKeyframes: e,
            element: n,
            name: s
        } = this;
        if (!n || !n.current) return;
        super.readKeyframes();
        for (let l = 0; l < e.length; l++) {
            let c = e[l];
            if (typeof c == "string" && (c = c.trim(), Ze(c))) {
                const u = Ti(c, n.current);
                u !== void 0 && (e[l] = u), l === e.length - 1 && (this.finalKeyframe = c)
            }
        }
        if (this.resolveNoneKeyframes(), !Pi.has(s) || e.length !== 2) return;
        const [i, o] = e, r = jn(i), a = jn(o);
        if (r !== a)
            if (kn(r) && kn(a))
                for (let l = 0; l < e.length; l++) {
                    const c = e[l];
                    typeof c == "string" && (e[l] = parseFloat(c))
                } else at[s] && (this.needsMeasurement = !0)
    }
    resolveNoneKeyframes() {
        const {
            unresolvedKeyframes: e,
            name: n
        } = this, s = [];
        for (let i = 0; i < e.length; i++)(e[i] === null || ea(e[i])) && s.push(i);
        s.length && la(e, s, n)
    }
    measureInitialState() {
        const {
            element: e,
            unresolvedKeyframes: n,
            name: s
        } = this;
        if (!e || !e.current) return;
        s === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = at[s](e.measureViewportBox(), window.getComputedStyle(e.current)), n[0] = this.measuredOrigin;
        const i = n[n.length - 1];
        i !== void 0 && e.getValue(s, i).jump(i, !1)
    }
    measureEndState() {
        const {
            element: e,
            name: n,
            unresolvedKeyframes: s
        } = this;
        if (!e || !e.current) return;
        const i = e.getValue(n);
        i && i.jump(this.measuredOrigin, !1);
        const o = s.length - 1,
            r = s[o];
        s[o] = at[n](e.measureViewportBox(), window.getComputedStyle(e.current)), r !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = r), this.removedTransforms ?.length && this.removedTransforms.forEach(([a, l]) => {
            e.getValue(a).set(l)
        }), this.resolveNoneKeyframes()
    }
}

function ca(t, e, n) {
    if (t instanceof EventTarget) return [t];
    if (typeof t == "string") {
        let s = document;
        const i = n ?.[t] ?? s.querySelectorAll(t);
        return i ? Array.from(i) : []
    }
    return Array.from(t)
}
const Vi = (t, e) => e && typeof t == "number" ? e.transform(t) : t;

function Ci(t) {
    return Ws(t) && "offsetHeight" in t
}
const Nn = 30,
    ha = t => !isNaN(parseFloat(t)),
    Vt = {
        current: void 0
    };
class fa {
    constructor(e, n = {}) {
        this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = s => {
            const i = O.now();
            if (this.updatedAt !== i && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(s), this.current !== this.prev && (this.events.change ?.notify(this.current), this.dependents))
                for (const o of this.dependents) o.dirty()
        }, this.hasAnimated = !1, this.setCurrent(e), this.owner = n.owner
    }
    setCurrent(e) {
        this.current = e, this.updatedAt = O.now(), this.canTrackVelocity === null && e !== void 0 && (this.canTrackVelocity = ha(this.current))
    }
    setPrevFrameValue(e = this.current) {
        this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt
    }
    onChange(e) {
        return this.on("change", e)
    }
    on(e, n) {
        this.events[e] || (this.events[e] = new _e);
        const s = this.events[e].add(n);
        return e === "change" ? () => {
            s(), C.read(() => {
                this.events.change.getSize() || this.stop()
            })
        } : s
    }
    clearListeners() {
        for (const e in this.events) this.events[e].clear()
    }
    attach(e, n) {
        this.passiveEffect = e, this.stopPassiveEffect = n
    }
    set(e) {
        this.passiveEffect ? this.passiveEffect(e, this.updateAndNotify) : this.updateAndNotify(e)
    }
    setWithVelocity(e, n, s) {
        this.set(n), this.prev = void 0, this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt - s
    }
    jump(e, n = !0) {
        this.updateAndNotify(e), this.prev = e, this.prevUpdatedAt = this.prevFrameValue = void 0, n && this.stop(), this.stopPassiveEffect && this.stopPassiveEffect()
    }
    dirty() {
        this.events.change ?.notify(this.current)
    }
    addDependent(e) {
        this.dependents || (this.dependents = new Set), this.dependents.add(e)
    }
    removeDependent(e) {
        this.dependents && this.dependents.delete(e)
    }
    get() {
        return Vt.current && Vt.current.push(this), this.current
    }
    getPrevious() {
        return this.prev
    }
    getVelocity() {
        const e = O.now();
        if (!this.canTrackVelocity || this.prevFrameValue === void 0 || e - this.updatedAt > Nn) return 0;
        const n = Math.min(this.updatedAt - this.prevUpdatedAt, Nn);
        return Gs(parseFloat(this.current) - parseFloat(this.prevFrameValue), n)
    }
    start(e) {
        return this.stop(), new Promise(n => {
            this.hasAnimated = !0, this.animation = e(n), this.events.animationStart && this.events.animationStart.notify()
        }).then(() => {
            this.events.animationComplete && this.events.animationComplete.notify(), this.clearAnimation()
        })
    }
    stop() {
        this.animation && (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()), this.clearAnimation()
    }
    isAnimating() {
        return !!this.animation
    }
    clearAnimation() {
        delete this.animation
    }
    destroy() {
        this.dependents ?.clear(), this.events.destroy ?.notify(), this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect()
    }
}

function ut(t, e) {
    return new fa(t, e)
}
const {
    schedule: ln
} = ei(queueMicrotask, !1), H = {
    x: !1,
    y: !1
};

function Mi() {
    return H.x || H.y
}

function da(t) {
    return t === "x" || t === "y" ? H[t] ? null : (H[t] = !0, () => {
        H[t] = !1
    }) : H.x || H.y ? null : (H.x = H.y = !0, () => {
        H.x = H.y = !1
    })
}

function Di(t, e) {
    const n = ca(t),
        s = new AbortController,
        i = {
            passive: !0,
            ...e,
            signal: s.signal
        };
    return [n, i, () => s.abort()]
}

function Un(t) {
    return !(t.pointerType === "touch" || Mi())
}

function ma(t, e, n = {}) {
    const [s, i, o] = Di(t, n), r = a => {
        if (!Un(a)) return;
        const {
            target: l
        } = a, c = e(l, a);
        if (typeof c != "function" || !l) return;
        const u = h => {
            Un(h) && (c(h), l.removeEventListener("pointerleave", u))
        };
        l.addEventListener("pointerleave", u, i)
    };
    return s.forEach(a => {
        a.addEventListener("pointerenter", r, i)
    }), o
}
const Ri = (t, e) => e ? t === e ? !0 : Ri(t, e.parentElement) : !1,
    un = t => t.pointerType === "mouse" ? typeof t.button != "number" || t.button <= 0 : t.isPrimary !== !1,
    pa = new Set(["BUTTON", "INPUT", "SELECT", "TEXTAREA", "A"]);

function ga(t) {
    return pa.has(t.tagName) || t.tabIndex !== -1
}
const Ht = new WeakSet;

function Kn(t) {
    return e => {
        e.key === "Enter" && t(e)
    }
}

function ue(t, e) {
    t.dispatchEvent(new PointerEvent("pointer" + e, {
        isPrimary: !0,
        bubbles: !0
    }))
}
const ya = (t, e) => {
    const n = t.currentTarget;
    if (!n) return;
    const s = Kn(() => {
        if (Ht.has(n)) return;
        ue(n, "down");
        const i = Kn(() => {
                ue(n, "up")
            }),
            o = () => ue(n, "cancel");
        n.addEventListener("keyup", i, e), n.addEventListener("blur", o, e)
    });
    n.addEventListener("keydown", s, e), n.addEventListener("blur", () => n.removeEventListener("keydown", s), e)
};

function Wn(t) {
    return un(t) && !Mi()
}

function va(t, e, n = {}) {
    const [s, i, o] = Di(t, n), r = a => {
        const l = a.currentTarget;
        if (!Wn(a)) return;
        Ht.add(l);
        const c = e(l, a),
            u = (d, m) => {
                window.removeEventListener("pointerup", h), window.removeEventListener("pointercancel", f), Ht.has(l) && Ht.delete(l), Wn(d) && typeof c == "function" && c(d, {
                    success: m
                })
            },
            h = d => {
                u(d, l === window || l === document || n.useGlobalTarget || Ri(l, d.target))
            },
            f = d => {
                u(d, !1)
            };
        window.addEventListener("pointerup", h, i), window.addEventListener("pointercancel", f, i)
    };
    return s.forEach(a => {
        (n.useGlobalTarget ? window : a).addEventListener("pointerdown", r, i), Ci(a) && (a.addEventListener("focus", c => ya(c, i)), !ga(a) && !a.hasAttribute("tabindex") && (a.tabIndex = 0))
    }), o
}

function Ei(t) {
    return Ws(t) && "ownerSVGElement" in t
}

function xa(t) {
    return Ei(t) && t.tagName === "svg"
}

function Ta(...t) {
    const e = !Array.isArray(t[0]),
        n = e ? 0 : -1,
        s = t[0 + n],
        i = t[1 + n],
        o = t[2 + n],
        r = t[3 + n],
        a = fi(i, o, r);
    return e ? a(s) : a
}
const E = t => !!(t && t.getVelocity);

function Pa(t, e, n) {
    const s = t.get();
    let i = null,
        o = s,
        r;
    const a = typeof s == "string" ? s.replace(/[\d.-]/g, "") : void 0,
        l = () => {
            i && (i.stop(), i = null)
        },
        c = () => {
            l(), i = new te({
                keyframes: [Gn(t.get()), Gn(o)],
                velocity: t.getVelocity(),
                type: "spring",
                restDelta: .001,
                restSpeed: .01,
                ...n,
                onUpdate: r
            })
        };
    if (t.attach((u, h) => {
            o = u, r = f => h($n(f, a)), C.postRender(c)
        }, l), E(e)) {
        const u = e.on("change", f => t.set($n(f, a))),
            h = t.on("destroy", u);
        return () => {
            u(), h()
        }
    }
    return l
}

function $n(t, e) {
    return e ? t + e : t
}

function Gn(t) {
    return typeof t == "number" ? t : parseFloat(t)
}
const Sa = [...bi, L, Q],
    ba = t => Sa.find(Si(t)),
    ct = p.createContext({
        transformPagePoint: t => t,
        isStatic: !1,
        reducedMotion: "never"
    });

function Hn(t, e) {
    if (typeof t == "function") return t(e);
    t != null && (t.current = e)
}

function Aa(...t) {
    return e => {
        let n = !1;
        const s = t.map(i => {
            const o = Hn(i, e);
            return !n && typeof o == "function" && (n = !0), o
        });
        if (n) return () => {
            for (let i = 0; i < s.length; i++) {
                const o = s[i];
                typeof o == "function" ? o() : Hn(t[i], null)
            }
        }
    }
}

function wa(...t) {
    return p.useCallback(Aa(...t), t)
}
class Va extends p.Component {
    getSnapshotBeforeUpdate(e) {
        const n = this.props.childRef.current;
        if (n && e.isPresent && !this.props.isPresent) {
            const s = n.offsetParent,
                i = Ci(s) && s.offsetWidth || 0,
                o = this.props.sizeRef.current;
            o.height = n.offsetHeight || 0, o.width = n.offsetWidth || 0, o.top = n.offsetTop, o.left = n.offsetLeft, o.right = i - o.width - o.left
        }
        return null
    }
    componentDidUpdate() {}
    render() {
        return this.props.children
    }
}

function Ca({
    children: t,
    isPresent: e,
    anchorX: n,
    root: s
}) {
    const i = p.useId(),
        o = p.useRef(null),
        r = p.useRef({
            width: 0,
            height: 0,
            top: 0,
            left: 0,
            right: 0
        }),
        {
            nonce: a
        } = p.useContext(ct),
        l = wa(o, t ?.ref);
    return p.useInsertionEffect(() => {
        const {
            width: c,
            height: u,
            top: h,
            left: f,
            right: d
        } = r.current;
        if (e || !o.current || !c || !u) return;
        const m = n === "left" ? `left: ${f}` : `right: ${d}`;
        o.current.dataset.motionPopId = i;
        const g = document.createElement("style");
        a && (g.nonce = a);
        const v = s ?? document.head;
        return v.appendChild(g), g.sheet && g.sheet.insertRule(`
          [data-motion-pop-id="${i}"] {
            position: absolute !important;
            width: ${c}px !important;
            height: ${u}px !important;
            ${m}px !important;
            top: ${h}px !important;
          }
        `), () => {
            v.contains(g) && v.removeChild(g)
        }
    }, [e]), N.jsx(Va, {
        isPresent: e,
        childRef: o,
        sizeRef: r,
        children: p.cloneElement(t, {
            ref: l
        })
    })
}
const Ma = ({
    children: t,
    initial: e,
    isPresent: n,
    onExitComplete: s,
    custom: i,
    presenceAffectsLayout: o,
    mode: r,
    anchorX: a,
    root: l
}) => {
    const c = tt(Da),
        u = p.useId();
    let h = !0,
        f = p.useMemo(() => (h = !1, {
            id: u,
            initial: e,
            isPresent: n,
            custom: i,
            onExitComplete: d => {
                c.set(d, !0);
                for (const m of c.values())
                    if (!m) return;
                s && s()
            },
            register: d => (c.set(d, !1), () => c.delete(d))
        }), [n, c, s]);
    return o && h && (f = { ...f
    }), p.useMemo(() => {
        c.forEach((d, m) => c.set(m, !1))
    }, [n]), p.useEffect(() => {
        !n && !c.size && s && s()
    }, [n]), r === "popLayout" && (t = N.jsx(Ca, {
        isPresent: n,
        anchorX: a,
        root: l,
        children: t
    })), N.jsx(Qt.Provider, {
        value: f,
        children: t
    })
};

function Da() {
    return new Map
}

function Li(t = !0) {
    const e = p.useContext(Qt);
    if (e === null) return [!0, null];
    const {
        isPresent: n,
        onExitComplete: s,
        register: i
    } = e, o = p.useId();
    p.useEffect(() => {
        if (t) return i(o)
    }, [t]);
    const r = p.useCallback(() => t && s && s(o), [o, s, t]);
    return !n && s ? [!1, r] : [!0]
}
const Wt = t => t.key || "";

function zn(t) {
    const e = [];
    return p.Children.forEach(t, n => {
        p.isValidElement(n) && e.push(n)
    }), e
}
const pc = ({
        children: t,
        custom: e,
        initial: n = !0,
        onExitComplete: s,
        presenceAffectsLayout: i = !0,
        mode: o = "sync",
        propagate: r = !1,
        anchorX: a = "left",
        root: l
    }) => {
        const [c, u] = Li(r), h = p.useMemo(() => zn(t), [t]), f = r && !c ? [] : h.map(Wt), d = p.useRef(!0), m = p.useRef(h), g = tt(() => new Map), [v, y] = p.useState(h), [T, x] = p.useState(h);
        We(() => {
            d.current = !1, m.current = h;
            for (let w = 0; w < T.length; w++) {
                const V = Wt(T[w]);
                f.includes(V) ? g.delete(V) : g.get(V) !== !0 && g.set(V, !1)
            }
        }, [T, f.length, f.join("-")]);
        const A = [];
        if (h !== v) {
            let w = [...h];
            for (let V = 0; V < T.length; V++) {
                const b = T[V],
                    k = Wt(b);
                f.includes(k) || (w.splice(V, 0, b), A.push(b))
            }
            return o === "wait" && A.length && (w = A), x(zn(w)), y(h), null
        }
        const {
            forceRender: P
        } = p.useContext(Ue);
        return N.jsx(N.Fragment, {
            children: T.map(w => {
                const V = Wt(w),
                    b = r && !c ? !1 : h === T || f.includes(V),
                    k = () => {
                        if (g.has(V)) g.set(V, !0);
                        else return;
                        let B = !0;
                        g.forEach(Z => {
                            Z || (B = !1)
                        }), B && (P ?.(), x(m.current), r && u ?.(), s && s())
                    };
                return N.jsx(Ma, {
                    isPresent: b,
                    initial: !d.current || n ? void 0 : !1,
                    custom: e,
                    presenceAffectsLayout: i,
                    mode: o,
                    root: l,
                    onExitComplete: b ? void 0 : k,
                    anchorX: a,
                    children: w
                }, V)
            })
        })
    },
    ki = p.createContext({
        strict: !1
    }),
    _n = {
        animation: ["animate", "variants", "whileHover", "whileTap", "exit", "whileInView", "whileFocus", "whileDrag"],
        exit: ["exit"],
        drag: ["drag", "dragControls"],
        focus: ["whileFocus"],
        hover: ["whileHover", "onHoverStart", "onHoverEnd"],
        tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
        pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
        inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
        layout: ["layout", "layoutId"]
    },
    vt = {};
for (const t in _n) vt[t] = {
    isEnabled: e => _n[t].some(n => !!e[n])
};

function Ra(t) {
    for (const e in t) vt[e] = { ...vt[e],
        ...t[e]
    }
}
const Ea = new Set(["animate", "exit", "variants", "initial", "style", "values", "variants", "transition", "transformTemplate", "custom", "inherit", "onBeforeLayoutMeasure", "onAnimationStart", "onAnimationComplete", "onUpdate", "onDragStart", "onDrag", "onDragEnd", "onMeasureDragConstraints", "onDirectionLock", "onDragTransitionEnd", "_dragX", "_dragY", "onHoverStart", "onHoverEnd", "onViewportEnter", "onViewportLeave", "globalTapTarget", "ignoreStrict", "viewport"]);

function Zt(t) {
    return t.startsWith("while") || t.startsWith("drag") && t !== "draggable" || t.startsWith("layout") || t.startsWith("onTap") || t.startsWith("onPan") || t.startsWith("onLayout") || Ea.has(t)
}
let Fi = t => !Zt(t);

function Ii(t) {
    typeof t == "function" && (Fi = e => e.startsWith("on") ? !Zt(e) : t(e))
}
try {
    Ii(require("@emotion/is-prop-valid").default)
} catch {}

function La(t, e, n) {
    const s = {};
    for (const i in t) i === "values" && typeof t.values == "object" || (Fi(i) || n === !0 && Zt(i) || !e && !Zt(i) || t.draggable && i.startsWith("onDrag")) && (s[i] = t[i]);
    return s
}

function gc({
    children: t,
    isValidProp: e,
    ...n
}) {
    e && Ii(e), n = { ...p.useContext(ct),
        ...n
    }, n.isStatic = tt(() => n.isStatic);
    const s = p.useMemo(() => n, [JSON.stringify(n.transition), n.transformPagePoint, n.reducedMotion]);
    return N.jsx(ct.Provider, {
        value: s,
        children: t
    })
}
const ee = p.createContext({});

function ne(t) {
    return t !== null && typeof t == "object" && typeof t.start == "function"
}

function kt(t) {
    return typeof t == "string" || Array.isArray(t)
}
const cn = ["animate", "whileInView", "whileFocus", "whileHover", "whileTap", "whileDrag", "exit"],
    hn = ["initial", ...cn];

function se(t) {
    return ne(t.animate) || hn.some(e => kt(t[e]))
}

function Bi(t) {
    return !!(se(t) || t.variants)
}

function ka(t, e) {
    if (se(t)) {
        const {
            initial: n,
            animate: s
        } = t;
        return {
            initial: n === !1 || kt(n) ? n : void 0,
            animate: kt(s) ? s : void 0
        }
    }
    return t.inherit !== !1 ? e : {}
}

function Fa(t) {
    const {
        initial: e,
        animate: n
    } = ka(t, p.useContext(ee));
    return p.useMemo(() => ({
        initial: e,
        animate: n
    }), [Xn(e), Xn(n)])
}

function Xn(t) {
    return Array.isArray(t) ? t.join(" ") : t
}
const Ft = {};

function Ia(t) {
    for (const e in t) Ft[e] = t[e], qe(e) && (Ft[e].isCSSVariable = !0)
}

function ji(t, {
    layout: e,
    layoutId: n
}) {
    return Pt.has(t) || t.startsWith("origin") || (e || n !== void 0) && (!!Ft[t] || t === "opacity")
}
const Ba = {
        x: "translateX",
        y: "translateY",
        z: "translateZ",
        transformPerspective: "perspective"
    },
    ja = Tt.length;

function Oa(t, e, n) {
    let s = "",
        i = !0;
    for (let o = 0; o < ja; o++) {
        const r = Tt[o],
            a = t[r];
        if (a === void 0) continue;
        let l = !0;
        if (typeof a == "number" ? l = a === (r.startsWith("scale") ? 1 : 0) : l = parseFloat(a) === 0, !l || n) {
            const c = Vi(a, an[r]);
            if (!l) {
                i = !1;
                const u = Ba[r] || r;
                s += `${u}(${c}) `
            }
            n && (e[r] = c)
        }
    }
    return s = s.trim(), n ? s = n(e, i ? "" : s) : i && (s = "none"), s
}

function fn(t, e, n) {
    const {
        style: s,
        vars: i,
        transformOrigin: o
    } = t;
    let r = !1,
        a = !1;
    for (const l in e) {
        const c = e[l];
        if (Pt.has(l)) {
            r = !0;
            continue
        } else if (qe(l)) {
            i[l] = c;
            continue
        } else {
            const u = Vi(c, an[l]);
            l.startsWith("origin") ? (a = !0, o[l] = u) : s[l] = u
        }
    }
    if (e.transform || (r || n ? s.transform = Oa(e, t.transform, n) : s.transform && (s.transform = "none")), a) {
        const {
            originX: l = "50%",
            originY: c = "50%",
            originZ: u = 0
        } = o;
        s.transformOrigin = `${l} ${c} ${u}`
    }
}
const dn = () => ({
    style: {},
    transform: {},
    transformOrigin: {},
    vars: {}
});

function Oi(t, e, n) {
    for (const s in e) !E(e[s]) && !ji(s, n) && (t[s] = e[s])
}

function Na({
    transformTemplate: t
}, e) {
    return p.useMemo(() => {
        const n = dn();
        return fn(n, e, t), Object.assign({}, n.vars, n.style)
    }, [e])
}

function Ua(t, e) {
    const n = t.style || {},
        s = {};
    return Oi(s, n, t), Object.assign(s, Na(t, e)), s
}

function Ka(t, e) {
    const n = {},
        s = Ua(t, e);
    return t.drag && t.dragListener !== !1 && (n.draggable = !1, s.userSelect = s.WebkitUserSelect = s.WebkitTouchCallout = "none", s.touchAction = t.drag === !0 ? "none" : `pan-${t.drag==="x"?"y":"x"}`), t.tabIndex === void 0 && (t.onTap || t.onTapStart || t.whileTap) && (n.tabIndex = 0), n.style = s, n
}
const Wa = {
        offset: "stroke-dashoffset",
        array: "stroke-dasharray"
    },
    $a = {
        offset: "strokeDashoffset",
        array: "strokeDasharray"
    };

function Ga(t, e, n = 1, s = 0, i = !0) {
    t.pathLength = 1;
    const o = i ? Wa : $a;
    t[o.offset] = S.transform(-s);
    const r = S.transform(e),
        a = S.transform(n);
    t[o.array] = `${r} ${a}`
}

function Ni(t, {
    attrX: e,
    attrY: n,
    attrScale: s,
    pathLength: i,
    pathSpacing: o = 1,
    pathOffset: r = 0,
    ...a
}, l, c, u) {
    if (fn(t, a, c), l) {
        t.style.viewBox && (t.attrs.viewBox = t.style.viewBox);
        return
    }
    t.attrs = t.style, t.style = {};
    const {
        attrs: h,
        style: f
    } = t;
    h.transform && (f.transform = h.transform, delete h.transform), (f.transform || h.transformOrigin) && (f.transformOrigin = h.transformOrigin ?? "50% 50%", delete h.transformOrigin), f.transform && (f.transformBox = u ?.transformBox ?? "fill-box", delete h.transformBox), e !== void 0 && (h.x = e), n !== void 0 && (h.y = n), s !== void 0 && (h.scale = s), i !== void 0 && Ga(h, i, o, r, !1)
}
const Ui = () => ({ ...dn(),
        attrs: {}
    }),
    Ki = t => typeof t == "string" && t.toLowerCase() === "svg";

function Ha(t, e, n, s) {
    const i = p.useMemo(() => {
        const o = Ui();
        return Ni(o, e, Ki(s), t.transformTemplate, t.style), { ...o.attrs,
            style: { ...o.style
            }
        }
    }, [e]);
    if (t.style) {
        const o = {};
        Oi(o, t.style, t), i.style = { ...o,
            ...i.style
        }
    }
    return i
}
const za = ["animate", "circle", "defs", "desc", "ellipse", "g", "image", "line", "filter", "marker", "mask", "metadata", "path", "pattern", "polygon", "polyline", "rect", "stop", "switch", "symbol", "svg", "text", "tspan", "use", "view"];

function mn(t) {
    return typeof t != "string" || t.includes("-") ? !1 : !!(za.indexOf(t) > -1 || /[A-Z]/u.test(t))
}

function _a(t, e, n, {
    latestValues: s
}, i, o = !1) {
    const a = (mn(t) ? Ha : Ka)(e, s, i, t),
        l = La(e, typeof t == "string", o),
        c = t !== p.Fragment ? { ...l,
            ...a,
            ref: n
        } : {},
        {
            children: u
        } = e,
        h = p.useMemo(() => E(u) ? u.get() : u, [u]);
    return p.createElement(t, { ...c,
        children: h
    })
}

function Yn(t) {
    const e = [{}, {}];
    return t ?.values.forEach((n, s) => {
        e[0][s] = n.get(), e[1][s] = n.getVelocity()
    }), e
}

function pn(t, e, n, s) {
    if (typeof e == "function") {
        const [i, o] = Yn(s);
        e = e(n !== void 0 ? n : t.custom, i, o)
    }
    if (typeof e == "string" && (e = t.variants && t.variants[e]), typeof e == "function") {
        const [i, o] = Yn(s);
        e = e(n !== void 0 ? n : t.custom, i, o)
    }
    return e
}

function zt(t) {
    return E(t) ? t.get() : t
}

function Xa({
    scrapeMotionValuesFromProps: t,
    createRenderState: e
}, n, s, i) {
    return {
        latestValues: Ya(n, s, i, t),
        renderState: e()
    }
}

function Ya(t, e, n, s) {
    const i = {},
        o = s(t, {});
    for (const f in o) i[f] = zt(o[f]);
    let {
        initial: r,
        animate: a
    } = t;
    const l = se(t),
        c = Bi(t);
    e && c && !l && t.inherit !== !1 && (r === void 0 && (r = e.initial), a === void 0 && (a = e.animate));
    let u = n ? n.initial === !1 : !1;
    u = u || r === !1;
    const h = u ? a : r;
    if (h && typeof h != "boolean" && !ne(h)) {
        const f = Array.isArray(h) ? h : [h];
        for (let d = 0; d < f.length; d++) {
            const m = pn(t, f[d]);
            if (m) {
                const {
                    transitionEnd: g,
                    transition: v,
                    ...y
                } = m;
                for (const T in y) {
                    let x = y[T];
                    if (Array.isArray(x)) {
                        const A = u ? x.length - 1 : 0;
                        x = x[A]
                    }
                    x !== null && (i[T] = x)
                }
                for (const T in g) i[T] = g[T]
            }
        }
    }
    return i
}
const Wi = t => (e, n) => {
    const s = p.useContext(ee),
        i = p.useContext(Qt),
        o = () => Xa(t, e, s, i);
    return n ? o() : tt(o)
};

function gn(t, e, n) {
    const {
        style: s
    } = t, i = {};
    for (const o in s)(E(s[o]) || e.style && E(e.style[o]) || ji(o, t) || n ?.getValue(o) ?.liveStyle !== void 0) && (i[o] = s[o]);
    return i
}
const qa = Wi({
    scrapeMotionValuesFromProps: gn,
    createRenderState: dn
});

function $i(t, e, n) {
    const s = gn(t, e, n);
    for (const i in t)
        if (E(t[i]) || E(e[i])) {
            const o = Tt.indexOf(i) !== -1 ? "attr" + i.charAt(0).toUpperCase() + i.substring(1) : i;
            s[o] = t[i]
        }
    return s
}
const Za = Wi({
        scrapeMotionValuesFromProps: $i,
        createRenderState: Ui
    }),
    Ja = Symbol.for("motionComponentSymbol");

function dt(t) {
    return t && typeof t == "object" && Object.prototype.hasOwnProperty.call(t, "current")
}

function Qa(t, e, n) {
    return p.useCallback(s => {
        s && t.onMount && t.onMount(s), e && (s ? e.mount(s) : e.unmount()), n && (typeof n == "function" ? n(s) : dt(n) && (n.current = s))
    }, [e])
}
const yn = t => t.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase(),
    tl = "framerAppearId",
    Gi = "data-" + yn(tl),
    Hi = p.createContext({});

function el(t, e, n, s, i) {
    const {
        visualElement: o
    } = p.useContext(ee), r = p.useContext(ki), a = p.useContext(Qt), l = p.useContext(ct).reducedMotion, c = p.useRef(null);
    s = s || r.renderer, !c.current && s && (c.current = s(t, {
        visualState: e,
        parent: o,
        props: n,
        presenceContext: a,
        blockInitialAnimation: a ? a.initial === !1 : !1,
        reducedMotionConfig: l
    }));
    const u = c.current,
        h = p.useContext(Hi);
    u && !u.projection && i && (u.type === "html" || u.type === "svg") && nl(c.current, n, i, h);
    const f = p.useRef(!1);
    p.useInsertionEffect(() => {
        u && f.current && u.update(n, a)
    });
    const d = n[Gi],
        m = p.useRef(!!d && !window.MotionHandoffIsComplete ?.(d) && window.MotionHasOptimisedAnimation ?.(d));
    return We(() => {
        u && (f.current = !0, window.MotionIsMounted = !0, u.updateFeatures(), u.scheduleRenderMicrotask(), m.current && u.animationState && u.animationState.animateChanges())
    }), p.useEffect(() => {
        u && (!m.current && u.animationState && u.animationState.animateChanges(), m.current && (queueMicrotask(() => {
            window.MotionHandoffMarkAsComplete ?.(d)
        }), m.current = !1), u.enteringChildren = void 0)
    }), u
}

function nl(t, e, n, s) {
    const {
        layoutId: i,
        layout: o,
        drag: r,
        dragConstraints: a,
        layoutScroll: l,
        layoutRoot: c,
        layoutCrossfade: u
    } = e;
    t.projection = new n(t.latestValues, e["data-framer-portal-id"] ? void 0 : zi(t.parent)), t.projection.setOptions({
        layoutId: i,
        layout: o,
        alwaysMeasureLayout: !!r || a && dt(a),
        visualElement: t,
        animationType: typeof o == "string" ? o : "both",
        initialPromotionConfig: s,
        crossfade: u,
        layoutScroll: l,
        layoutRoot: c
    })
}

function zi(t) {
    if (t) return t.options.allowProjection !== !1 ? t.projection : zi(t.parent)
}

function ce(t, {
    forwardMotionProps: e = !1
} = {}, n, s) {
    n && Ra(n);
    const i = mn(t) ? Za : qa;

    function o(a, l) {
        let c;
        const u = { ...p.useContext(ct),
                ...a,
                layoutId: sl(a)
            },
            {
                isStatic: h
            } = u,
            f = Fa(a),
            d = i(a, h);
        if (!h && Ke) {
            il();
            const m = rl(u);
            c = m.MeasureLayout, f.visualElement = el(t, d, u, s, m.ProjectionNode)
        }
        return N.jsxs(ee.Provider, {
            value: f,
            children: [c && f.visualElement ? N.jsx(c, {
                visualElement: f.visualElement,
                ...u
            }) : null, _a(t, a, Qa(d, f.visualElement, l), d, h, e)]
        })
    }
    o.displayName = `motion.${typeof t=="string"?t:`create(${t.displayName??t.name??""})`}`;
    const r = p.forwardRef(o);
    return r[Ja] = t, r
}

function sl({
    layoutId: t
}) {
    const e = p.useContext(Ue).id;
    return e && t !== void 0 ? e + "-" + t : t
}

function il(t, e) {
    p.useContext(ki).strict
}

function rl(t) {
    const {
        drag: e,
        layout: n
    } = vt;
    if (!e && !n) return {};
    const s = { ...e,
        ...n
    };
    return {
        MeasureLayout: e ?.isEnabled(t) || n ?.isEnabled(t) ? s.MeasureLayout : void 0,
        ProjectionNode: s.ProjectionNode
    }
}

function ol(t, e) {
    if (typeof Proxy > "u") return ce;
    const n = new Map,
        s = (o, r) => ce(o, r, t, e),
        i = (o, r) => s(o, r);
    return new Proxy(i, {
        get: (o, r) => r === "create" ? s : (n.has(r) || n.set(r, ce(r, void 0, t, e)), n.get(r))
    })
}

function _i({
    top: t,
    left: e,
    right: n,
    bottom: s
}) {
    return {
        x: {
            min: e,
            max: n
        },
        y: {
            min: t,
            max: s
        }
    }
}

function al({
    x: t,
    y: e
}) {
    return {
        top: e.min,
        right: t.max,
        bottom: e.max,
        left: t.min
    }
}

function ll(t, e) {
    if (!e) return t;
    const n = e({
            x: t.left,
            y: t.top
        }),
        s = e({
            x: t.right,
            y: t.bottom
        });
    return {
        top: n.y,
        left: n.x,
        bottom: s.y,
        right: s.x
    }
}

function he(t) {
    return t === void 0 || t === 1
}

function Le({
    scale: t,
    scaleX: e,
    scaleY: n
}) {
    return !he(t) || !he(e) || !he(n)
}

function it(t) {
    return Le(t) || Xi(t) || t.z || t.rotate || t.rotateX || t.rotateY || t.skewX || t.skewY
}

function Xi(t) {
    return qn(t.x) || qn(t.y)
}

function qn(t) {
    return t && t !== "0%"
}

function Jt(t, e, n) {
    const s = t - n,
        i = e * s;
    return n + i
}

function Zn(t, e, n, s, i) {
    return i !== void 0 && (t = Jt(t, i, s)), Jt(t, n, s) + e
}

function ke(t, e = 0, n = 1, s, i) {
    t.min = Zn(t.min, e, n, s, i), t.max = Zn(t.max, e, n, s, i)
}

function Yi(t, {
    x: e,
    y: n
}) {
    ke(t.x, e.translate, e.scale, e.originPoint), ke(t.y, n.translate, n.scale, n.originPoint)
}
const Jn = .999999999999,
    Qn = 1.0000000000001;

function ul(t, e, n, s = !1) {
    const i = n.length;
    if (!i) return;
    e.x = e.y = 1;
    let o, r;
    for (let a = 0; a < i; a++) {
        o = n[a], r = o.projectionDelta;
        const {
            visualElement: l
        } = o.options;
        l && l.props.style && l.props.style.display === "contents" || (s && o.options.layoutScroll && o.scroll && o !== o.root && pt(t, {
            x: -o.scroll.offset.x,
            y: -o.scroll.offset.y
        }), r && (e.x *= r.x.scale, e.y *= r.y.scale, Yi(t, r)), s && it(o.latestValues) && pt(t, o.latestValues))
    }
    e.x < Qn && e.x > Jn && (e.x = 1), e.y < Qn && e.y > Jn && (e.y = 1)
}

function mt(t, e) {
    t.min = t.min + e, t.max = t.max + e
}

function ts(t, e, n, s, i = .5) {
    const o = M(t.min, t.max, i);
    ke(t, e, n, o, s)
}

function pt(t, e) {
    ts(t.x, e.x, e.scaleX, e.scale, e.originX), ts(t.y, e.y, e.scaleY, e.scale, e.originY)
}

function qi(t, e) {
    return _i(ll(t.getBoundingClientRect(), e))
}

function cl(t, e, n) {
    const s = qi(t, n),
        {
            scroll: i
        } = e;
    return i && (mt(s.x, i.offset.x), mt(s.y, i.offset.y)), s
}
const es = () => ({
        translate: 0,
        scale: 1,
        origin: 0,
        originPoint: 0
    }),
    gt = () => ({
        x: es(),
        y: es()
    }),
    ns = () => ({
        min: 0,
        max: 0
    }),
    R = () => ({
        x: ns(),
        y: ns()
    }),
    Fe = {
        current: null
    },
    Zi = {
        current: !1
    };

function hl() {
    if (Zi.current = !0, !!Ke)
        if (window.matchMedia) {
            const t = window.matchMedia("(prefers-reduced-motion)"),
                e = () => Fe.current = t.matches;
            t.addEventListener("change", e), e()
        } else Fe.current = !1
}
const fl = new WeakMap;

function dl(t, e, n) {
    for (const s in e) {
        const i = e[s],
            o = n[s];
        if (E(i)) t.addValue(s, i);
        else if (E(o)) t.addValue(s, ut(i, {
            owner: t
        }));
        else if (o !== i)
            if (t.hasValue(s)) {
                const r = t.getValue(s);
                r.liveStyle === !0 ? r.jump(i) : r.hasAnimated || r.set(i)
            } else {
                const r = t.getStaticValue(s);
                t.addValue(s, ut(r !== void 0 ? r : i, {
                    owner: t
                }))
            }
    }
    for (const s in n) e[s] === void 0 && t.removeValue(s);
    return e
}
const ss = ["AnimationStart", "AnimationComplete", "Update", "BeforeLayoutMeasure", "LayoutMeasure", "LayoutAnimationStart", "LayoutAnimationComplete"];
class ml {
    scrapeMotionValuesFromProps(e, n, s) {
        return {}
    }
    constructor({
        parent: e,
        props: n,
        presenceContext: s,
        reducedMotionConfig: i,
        blockInitialAnimation: o,
        visualState: r
    }, a = {}) {
        this.current = null, this.children = new Set, this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.values = new Map, this.KeyframeResolver = rn, this.features = {}, this.valueSubscriptions = new Map, this.prevMotionValues = {}, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
            this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection))
        }, this.renderScheduledAt = 0, this.scheduleRender = () => {
            const f = O.now();
            this.renderScheduledAt < f && (this.renderScheduledAt = f, C.render(this.render, !1, !0))
        };
        const {
            latestValues: l,
            renderState: c
        } = r;
        this.latestValues = l, this.baseTarget = { ...l
        }, this.initialValues = n.initial ? { ...l
        } : {}, this.renderState = c, this.parent = e, this.props = n, this.presenceContext = s, this.depth = e ? e.depth + 1 : 0, this.reducedMotionConfig = i, this.options = a, this.blockInitialAnimation = !!o, this.isControllingVariants = se(n), this.isVariantNode = Bi(n), this.isVariantNode && (this.variantChildren = new Set), this.manuallyAnimateOnMount = !!(e && e.current);
        const {
            willChange: u,
            ...h
        } = this.scrapeMotionValuesFromProps(n, {}, this);
        for (const f in h) {
            const d = h[f];
            l[f] !== void 0 && E(d) && d.set(l[f])
        }
    }
    mount(e) {
        this.current = e, fl.set(e, this), this.projection && !this.projection.instance && this.projection.mount(e), this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)), this.values.forEach((n, s) => this.bindToMotionValue(s, n)), Zi.current || hl(), this.shouldReduceMotion = this.reducedMotionConfig === "never" ? !1 : this.reducedMotionConfig === "always" ? !0 : Fe.current, this.parent ?.addChild(this), this.update(this.props, this.presenceContext)
    }
    unmount() {
        this.projection && this.projection.unmount(), q(this.notifyUpdate), q(this.render), this.valueSubscriptions.forEach(e => e()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), this.parent ?.removeChild(this);
        for (const e in this.events) this.events[e].clear();
        for (const e in this.features) {
            const n = this.features[e];
            n && (n.unmount(), n.isMounted = !1)
        }
        this.current = null
    }
    addChild(e) {
        this.children.add(e), this.enteringChildren ?? (this.enteringChildren = new Set), this.enteringChildren.add(e)
    }
    removeChild(e) {
        this.children.delete(e), this.enteringChildren && this.enteringChildren.delete(e)
    }
    bindToMotionValue(e, n) {
        this.valueSubscriptions.has(e) && this.valueSubscriptions.get(e)();
        const s = Pt.has(e);
        s && this.onBindTransform && this.onBindTransform();
        const i = n.on("change", r => {
            this.latestValues[e] = r, this.props.onUpdate && C.preRender(this.notifyUpdate), s && this.projection && (this.projection.isTransformDirty = !0), this.scheduleRender()
        });
        let o;
        window.MotionCheckAppearSync && (o = window.MotionCheckAppearSync(this, e, n)), this.valueSubscriptions.set(e, () => {
            i(), o && o(), n.owner && n.stop()
        })
    }
    sortNodePosition(e) {
        return !this.current || !this.sortInstanceNodePosition || this.type !== e.type ? 0 : this.sortInstanceNodePosition(this.current, e.current)
    }
    updateFeatures() {
        let e = "animation";
        for (e in vt) {
            const n = vt[e];
            if (!n) continue;
            const {
                isEnabled: s,
                Feature: i
            } = n;
            if (!this.features[e] && i && s(this.props) && (this.features[e] = new i(this)), this.features[e]) {
                const o = this.features[e];
                o.isMounted ? o.update() : (o.mount(), o.isMounted = !0)
            }
        }
    }
    triggerBuild() {
        this.build(this.renderState, this.latestValues, this.props)
    }
    measureViewportBox() {
        return this.current ? this.measureInstanceViewportBox(this.current, this.props) : R()
    }
    getStaticValue(e) {
        return this.latestValues[e]
    }
    setStaticValue(e, n) {
        this.latestValues[e] = n
    }
    update(e, n) {
        (e.transformTemplate || this.props.transformTemplate) && this.scheduleRender(), this.prevProps = this.props, this.props = e, this.prevPresenceContext = this.presenceContext, this.presenceContext = n;
        for (let s = 0; s < ss.length; s++) {
            const i = ss[s];
            this.propEventSubscriptions[i] && (this.propEventSubscriptions[i](), delete this.propEventSubscriptions[i]);
            const o = "on" + i,
                r = e[o];
            r && (this.propEventSubscriptions[i] = this.on(i, r))
        }
        this.prevMotionValues = dl(this, this.scrapeMotionValuesFromProps(e, this.prevProps, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue()
    }
    getProps() {
        return this.props
    }
    getVariant(e) {
        return this.props.variants ? this.props.variants[e] : void 0
    }
    getDefaultTransition() {
        return this.props.transition
    }
    getTransformPagePoint() {
        return this.props.transformPagePoint
    }
    getClosestVariantNode() {
        return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0
    }
    addVariantChild(e) {
        const n = this.getClosestVariantNode();
        if (n) return n.variantChildren && n.variantChildren.add(e), () => n.variantChildren.delete(e)
    }
    addValue(e, n) {
        const s = this.values.get(e);
        n !== s && (s && this.removeValue(e), this.bindToMotionValue(e, n), this.values.set(e, n), this.latestValues[e] = n.get())
    }
    removeValue(e) {
        this.values.delete(e);
        const n = this.valueSubscriptions.get(e);
        n && (n(), this.valueSubscriptions.delete(e)), delete this.latestValues[e], this.removeValueFromRenderState(e, this.renderState)
    }
    hasValue(e) {
        return this.values.has(e)
    }
    getValue(e, n) {
        if (this.props.values && this.props.values[e]) return this.props.values[e];
        let s = this.values.get(e);
        return s === void 0 && n !== void 0 && (s = ut(n === null ? void 0 : n, {
            owner: this
        }), this.addValue(e, s)), s
    }
    readValue(e, n) {
        let s = this.latestValues[e] !== void 0 || !this.current ? this.latestValues[e] : this.getBaseTargetFromProps(this.props, e) ?? this.readValueFromInstance(this.current, e, this.options);
        return s != null && (typeof s == "string" && (Ks(s) || $s(s)) ? s = parseFloat(s) : !ba(s) && Q.test(n) && (s = wi(e, n)), this.setBaseTarget(e, E(s) ? s.get() : s)), E(s) ? s.get() : s
    }
    setBaseTarget(e, n) {
        this.baseTarget[e] = n
    }
    getBaseTarget(e) {
        const {
            initial: n
        } = this.props;
        let s;
        if (typeof n == "string" || typeof n == "object") {
            const o = pn(this.props, n, this.presenceContext ?.custom);
            o && (s = o[e])
        }
        if (n && s !== void 0) return s;
        const i = this.getBaseTargetFromProps(this.props, e);
        return i !== void 0 && !E(i) ? i : this.initialValues[e] !== void 0 && s === void 0 ? void 0 : this.baseTarget[e]
    }
    on(e, n) {
        return this.events[e] || (this.events[e] = new _e), this.events[e].add(n)
    }
    notify(e, ...n) {
        this.events[e] && this.events[e].notify(...n)
    }
    scheduleRenderMicrotask() {
        ln.render(this.render)
    }
}
class Ji extends ml {
    constructor() {
        super(...arguments), this.KeyframeResolver = ua
    }
    sortInstanceNodePosition(e, n) {
        return e.compareDocumentPosition(n) & 2 ? 1 : -1
    }
    getBaseTargetFromProps(e, n) {
        return e.style ? e.style[n] : void 0
    }
    removeValueFromRenderState(e, {
        vars: n,
        style: s
    }) {
        delete n[e], delete s[e]
    }
    handleChildMotionValue() {
        this.childSubscription && (this.childSubscription(), delete this.childSubscription);
        const {
            children: e
        } = this.props;
        E(e) && (this.childSubscription = e.on("change", n => {
            this.current && (this.current.textContent = `${n}`)
        }))
    }
}

function Qi(t, {
    style: e,
    vars: n
}, s, i) {
    const o = t.style;
    let r;
    for (r in e) o[r] = e[r];
    i ?.applyProjectionStyles(o, s);
    for (r in n) o.setProperty(r, n[r])
}

function pl(t) {
    return window.getComputedStyle(t)
}
class gl extends Ji {
    constructor() {
        super(...arguments), this.type = "html", this.renderInstance = Qi
    }
    readValueFromInstance(e, n) {
        if (Pt.has(n)) return this.projection ?.isProjecting ? we(n) : Mo(e, n); {
            const s = pl(e),
                i = (qe(n) ? s.getPropertyValue(n) : s[n]) || 0;
            return typeof i == "string" ? i.trim() : i
        }
    }
    measureInstanceViewportBox(e, {
        transformPagePoint: n
    }) {
        return qi(e, n)
    }
    build(e, n, s) {
        fn(e, n, s.transformTemplate)
    }
    scrapeMotionValuesFromProps(e, n, s) {
        return gn(e, n, s)
    }
}
const tr = new Set(["baseFrequency", "diffuseConstant", "kernelMatrix", "kernelUnitLength", "keySplines", "keyTimes", "limitingConeAngle", "markerHeight", "markerWidth", "numOctaves", "targetX", "targetY", "surfaceScale", "specularConstant", "specularExponent", "stdDeviation", "tableValues", "viewBox", "gradientTransform", "pathLength", "startOffset", "textLength", "lengthAdjust"]);

function yl(t, e, n, s) {
    Qi(t, e, void 0, s);
    for (const i in e.attrs) t.setAttribute(tr.has(i) ? i : yn(i), e.attrs[i])
}
class vl extends Ji {
    constructor() {
        super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = R
    }
    getBaseTargetFromProps(e, n) {
        return e[n]
    }
    readValueFromInstance(e, n) {
        if (Pt.has(n)) {
            const s = Ai(n);
            return s && s.default || 0
        }
        return n = tr.has(n) ? n : yn(n), e.getAttribute(n)
    }
    scrapeMotionValuesFromProps(e, n, s) {
        return $i(e, n, s)
    }
    build(e, n, s) {
        Ni(e, n, this.isSVGTag, s.transformTemplate, s.style)
    }
    renderInstance(e, n, s, i) {
        yl(e, n, s, i)
    }
    mount(e) {
        this.isSVGTag = Ki(e.tagName), super.mount(e)
    }
}
const xl = (t, e) => mn(t) ? new vl(e) : new gl(e, {
    allowProjection: t !== p.Fragment
});

function yt(t, e, n) {
    const s = t.getProps();
    return pn(s, e, n !== void 0 ? n : s.custom, t)
}
const Ie = t => Array.isArray(t);

function Tl(t, e, n) {
    t.hasValue(e) ? t.getValue(e).set(n) : t.addValue(e, ut(n))
}

function Pl(t) {
    return Ie(t) ? t[t.length - 1] || 0 : t
}

function Sl(t, e) {
    const n = yt(t, e);
    let {
        transitionEnd: s = {},
        transition: i = {},
        ...o
    } = n || {};
    o = { ...o,
        ...s
    };
    for (const r in o) {
        const a = Pl(o[r]);
        Tl(t, r, a)
    }
}

function bl(t) {
    return !!(E(t) && t.add)
}

function Be(t, e) {
    const n = t.getValue("willChange");
    if (bl(n)) return n.add(e);
    if (!n && Y.WillChange) {
        const s = new Y.WillChange("auto");
        t.addValue("willChange", s), s.add(e)
    }
}

function er(t) {
    return t.props[Gi]
}
const Al = t => t !== null;

function wl(t, {
    repeat: e,
    repeatType: n = "loop"
}, s) {
    const i = t.filter(Al),
        o = e && n !== "loop" && e % 2 === 1 ? 0 : i.length - 1;
    return i[o]
}
const Vl = {
        type: "spring",
        stiffness: 500,
        damping: 25,
        restSpeed: 10
    },
    Cl = t => ({
        type: "spring",
        stiffness: 550,
        damping: t === 0 ? 2 * Math.sqrt(550) : 30,
        restSpeed: 10
    }),
    Ml = {
        type: "keyframes",
        duration: .8
    },
    Dl = {
        type: "keyframes",
        ease: [.25, .1, .35, 1],
        duration: .3
    },
    Rl = (t, {
        keyframes: e
    }) => e.length > 2 ? Ml : Pt.has(t) ? t.startsWith("scale") ? Cl(e[1]) : Vl : Dl;

function El({
    when: t,
    delay: e,
    delayChildren: n,
    staggerChildren: s,
    staggerDirection: i,
    repeat: o,
    repeatType: r,
    repeatDelay: a,
    from: l,
    elapsed: c,
    ...u
}) {
    return !!Object.keys(u).length
}
const vn = (t, e, n, s = {}, i, o) => r => {
    const a = on(s, t) || {},
        l = a.delay || s.delay || 0;
    let {
        elapsed: c = 0
    } = s;
    c = c - z(l);
    const u = {
        keyframes: Array.isArray(n) ? n : [null, n],
        ease: "easeOut",
        velocity: e.getVelocity(),
        ...a,
        delay: -c,
        onUpdate: f => {
            e.set(f), a.onUpdate && a.onUpdate(f)
        },
        onComplete: () => {
            r(), a.onComplete && a.onComplete()
        },
        name: t,
        motionValue: e,
        element: o ? void 0 : i
    };
    El(a) || Object.assign(u, Rl(t, u)), u.duration && (u.duration = z(u.duration)), u.repeatDelay && (u.repeatDelay = z(u.repeatDelay)), u.from !== void 0 && (u.keyframes[0] = u.from);
    let h = !1;
    if ((u.type === !1 || u.duration === 0 && !u.repeatDelay) && (Re(u), u.delay === 0 && (h = !0)), (Y.instantAnimations || Y.skipAnimations) && (h = !0, Re(u), u.delay = 0), u.allowFlatten = !a.type && !a.ease, h && !o && e.get() !== void 0) {
        const f = wl(u.keyframes, a);
        if (f !== void 0) {
            C.update(() => {
                u.onUpdate(f), u.onComplete()
            });
            return
        }
    }
    return a.isSync ? new te(u) : new Zo(u)
};

function Ll({
    protectedKeys: t,
    needsAnimating: e
}, n) {
    const s = t.hasOwnProperty(n) && e[n] !== !0;
    return e[n] = !1, s
}

function nr(t, e, {
    delay: n = 0,
    transitionOverride: s,
    type: i
} = {}) {
    let {
        transition: o = t.getDefaultTransition(),
        transitionEnd: r,
        ...a
    } = e;
    s && (o = s);
    const l = [],
        c = i && t.animationState && t.animationState.getState()[i];
    for (const u in a) {
        const h = t.getValue(u, t.latestValues[u] ?? null),
            f = a[u];
        if (f === void 0 || c && Ll(c, u)) continue;
        const d = {
                delay: n,
                ...on(o || {}, u)
            },
            m = h.get();
        if (m !== void 0 && !h.isAnimating && !Array.isArray(f) && f === m && !d.velocity) continue;
        let g = !1;
        if (window.MotionHandoffAnimation) {
            const y = er(t);
            if (y) {
                const T = window.MotionHandoffAnimation(y, u, C);
                T !== null && (d.startTime = T, g = !0)
            }
        }
        Be(t, u), h.start(vn(u, h, f, t.shouldReduceMotion && Pi.has(u) ? {
            type: !1
        } : d, t, g));
        const v = h.animation;
        v && l.push(v)
    }
    return r && Promise.all(l).then(() => {
        C.update(() => {
            r && Sl(t, r)
        })
    }), l
}

function sr(t, e, n, s = 0, i = 1) {
    const o = Array.from(t).sort((c, u) => c.sortNodePosition(u)).indexOf(e),
        r = t.size,
        a = (r - 1) * s;
    return typeof n == "function" ? n(o, r) : i === 1 ? o * s : a - o * s
}

function je(t, e, n = {}) {
    const s = yt(t, e, n.type === "exit" ? t.presenceContext ?.custom : void 0);
    let {
        transition: i = t.getDefaultTransition() || {}
    } = s || {};
    n.transitionOverride && (i = n.transitionOverride);
    const o = s ? () => Promise.all(nr(t, s, n)) : () => Promise.resolve(),
        r = t.variantChildren && t.variantChildren.size ? (l = 0) => {
            const {
                delayChildren: c = 0,
                staggerChildren: u,
                staggerDirection: h
            } = i;
            return kl(t, e, l, c, u, h, n)
        } : () => Promise.resolve(),
        {
            when: a
        } = i;
    if (a) {
        const [l, c] = a === "beforeChildren" ? [o, r] : [r, o];
        return l().then(() => c())
    } else return Promise.all([o(), r(n.delay)])
}

function kl(t, e, n = 0, s = 0, i = 0, o = 1, r) {
    const a = [];
    for (const l of t.variantChildren) l.notify("AnimationStart", e), a.push(je(l, e, { ...r,
        delay: n + (typeof s == "function" ? 0 : s) + sr(t.variantChildren, l, s, i, o)
    }).then(() => l.notify("AnimationComplete", e)));
    return Promise.all(a)
}

function Fl(t, e, n = {}) {
    t.notify("AnimationStart", e);
    let s;
    if (Array.isArray(e)) {
        const i = e.map(o => je(t, o, n));
        s = Promise.all(i)
    } else if (typeof e == "string") s = je(t, e, n);
    else {
        const i = typeof e == "function" ? yt(t, e, n.custom) : e;
        s = Promise.all(nr(t, i, n))
    }
    return s.then(() => {
        t.notify("AnimationComplete", e)
    })
}

function ir(t, e) {
    if (!Array.isArray(e)) return !1;
    const n = e.length;
    if (n !== t.length) return !1;
    for (let s = 0; s < n; s++)
        if (e[s] !== t[s]) return !1;
    return !0
}
const Il = hn.length;

function rr(t) {
    if (!t) return;
    if (!t.isControllingVariants) {
        const n = t.parent ? rr(t.parent) || {} : {};
        return t.props.initial !== void 0 && (n.initial = t.props.initial), n
    }
    const e = {};
    for (let n = 0; n < Il; n++) {
        const s = hn[n],
            i = t.props[s];
        (kt(i) || i === !1) && (e[s] = i)
    }
    return e
}
const Bl = [...cn].reverse(),
    jl = cn.length;

function Ol(t) {
    return e => Promise.all(e.map(({
        animation: n,
        options: s
    }) => Fl(t, n, s)))
}

function Nl(t) {
    let e = Ol(t),
        n = is(),
        s = !0;
    const i = l => (c, u) => {
        const h = yt(t, u, l === "exit" ? t.presenceContext ?.custom : void 0);
        if (h) {
            const {
                transition: f,
                transitionEnd: d,
                ...m
            } = h;
            c = { ...c,
                ...m,
                ...d
            }
        }
        return c
    };

    function o(l) {
        e = l(t)
    }

    function r(l) {
        const {
            props: c
        } = t, u = rr(t.parent) || {}, h = [], f = new Set;
        let d = {},
            m = 1 / 0;
        for (let v = 0; v < jl; v++) {
            const y = Bl[v],
                T = n[y],
                x = c[y] !== void 0 ? c[y] : u[y],
                A = kt(x),
                P = y === l ? T.isActive : null;
            P === !1 && (m = v);
            let w = x === u[y] && x !== c[y] && A;
            if (w && s && t.manuallyAnimateOnMount && (w = !1), T.protectedKeys = { ...d
                }, !T.isActive && P === null || !x && !T.prevProp || ne(x) || typeof x == "boolean") continue;
            const V = Ul(T.prevProp, x);
            let b = V || y === l && T.isActive && !w && A || v > m && A,
                k = !1;
            const B = Array.isArray(x) ? x : [x];
            let Z = B.reduce(i(y), {});
            P === !1 && (Z = {});
            const {
                prevResolvedValues: Pn = {}
            } = T, br = { ...Pn,
                ...Z
            }, Sn = F => {
                b = !0, f.has(F) && (k = !0, f.delete(F)), T.needsAnimating[F] = !0;
                const U = t.getValue(F);
                U && (U.liveStyle = !1)
            };
            for (const F in br) {
                const U = Z[F],
                    nt = Pn[F];
                if (d.hasOwnProperty(F)) continue;
                let ht = !1;
                Ie(U) && Ie(nt) ? ht = !ir(U, nt) : ht = U !== nt, ht ? U != null ? Sn(F) : f.add(F) : U !== void 0 && f.has(F) ? Sn(F) : T.protectedKeys[F] = !0
            }
            T.prevProp = x, T.prevResolvedValues = Z, T.isActive && (d = { ...d,
                ...Z
            }), s && t.blockInitialAnimation && (b = !1);
            const bn = w && V;
            b && (!bn || k) && h.push(...B.map(F => {
                const U = {
                    type: y
                };
                if (typeof F == "string" && s && !bn && t.manuallyAnimateOnMount && t.parent) {
                    const {
                        parent: nt
                    } = t, ht = yt(nt, F);
                    if (nt.enteringChildren && ht) {
                        const {
                            delayChildren: Ar
                        } = ht.transition || {};
                        U.delay = sr(nt.enteringChildren, t, Ar)
                    }
                }
                return {
                    animation: F,
                    options: U
                }
            }))
        }
        if (f.size) {
            const v = {};
            if (typeof c.initial != "boolean") {
                const y = yt(t, Array.isArray(c.initial) ? c.initial[0] : c.initial);
                y && y.transition && (v.transition = y.transition)
            }
            f.forEach(y => {
                const T = t.getBaseTarget(y),
                    x = t.getValue(y);
                x && (x.liveStyle = !0), v[y] = T ?? null
            }), h.push({
                animation: v
            })
        }
        let g = !!h.length;
        return s && (c.initial === !1 || c.initial === c.animate) && !t.manuallyAnimateOnMount && (g = !1), s = !1, g ? e(h) : Promise.resolve()
    }

    function a(l, c) {
        if (n[l].isActive === c) return Promise.resolve();
        t.variantChildren ?.forEach(h => h.animationState ?.setActive(l, c)), n[l].isActive = c;
        const u = r(l);
        for (const h in n) n[h].protectedKeys = {};
        return u
    }
    return {
        animateChanges: r,
        setActive: a,
        setAnimateFunction: o,
        getState: () => n,
        reset: () => {
            n = is()
        }
    }
}

function Ul(t, e) {
    return typeof e == "string" ? e !== t : Array.isArray(e) ? !ir(e, t) : !1
}

function st(t = !1) {
    return {
        isActive: t,
        protectedKeys: {},
        needsAnimating: {},
        prevResolvedValues: {}
    }
}

function is() {
    return {
        animate: st(!0),
        whileInView: st(),
        whileHover: st(),
        whileTap: st(),
        whileDrag: st(),
        whileFocus: st(),
        exit: st()
    }
}
class et {
    constructor(e) {
        this.isMounted = !1, this.node = e
    }
    update() {}
}
class Kl extends et {
    constructor(e) {
        super(e), e.animationState || (e.animationState = Nl(e))
    }
    updateAnimationControlsSubscription() {
        const {
            animate: e
        } = this.node.getProps();
        ne(e) && (this.unmountControls = e.subscribe(this.node))
    }
    mount() {
        this.updateAnimationControlsSubscription()
    }
    update() {
        const {
            animate: e
        } = this.node.getProps(), {
            animate: n
        } = this.node.prevProps || {};
        e !== n && this.updateAnimationControlsSubscription()
    }
    unmount() {
        this.node.animationState.reset(), this.unmountControls ?.()
    }
}
let Wl = 0;
class $l extends et {
    constructor() {
        super(...arguments), this.id = Wl++
    }
    update() {
        if (!this.node.presenceContext) return;
        const {
            isPresent: e,
            onExitComplete: n
        } = this.node.presenceContext, {
            isPresent: s
        } = this.node.prevPresenceContext || {};
        if (!this.node.animationState || e === s) return;
        const i = this.node.animationState.setActive("exit", !e);
        n && !e && i.then(() => {
            n(this.id)
        })
    }
    mount() {
        const {
            register: e,
            onExitComplete: n
        } = this.node.presenceContext || {};
        n && n(this.id), e && (this.unmount = e(this.id))
    }
    unmount() {}
}
const Gl = {
    animation: {
        Feature: Kl
    },
    exit: {
        Feature: $l
    }
};

function It(t, e, n, s = {
    passive: !0
}) {
    return t.addEventListener(e, n, s), () => t.removeEventListener(e, n)
}

function Nt(t) {
    return {
        point: {
            x: t.pageX,
            y: t.pageY
        }
    }
}
const Hl = t => e => un(e) && t(e, Nt(e));

function Ct(t, e, n, s) {
    return It(t, e, Hl(n), s)
}
const or = 1e-4,
    zl = 1 - or,
    _l = 1 + or,
    ar = .01,
    Xl = 0 - ar,
    Yl = 0 + ar;

function j(t) {
    return t.max - t.min
}

function ql(t, e, n) {
    return Math.abs(t - e) <= n
}

function rs(t, e, n, s = .5) {
    t.origin = s, t.originPoint = M(e.min, e.max, t.origin), t.scale = j(n) / j(e), t.translate = M(n.min, n.max, t.origin) - t.originPoint, (t.scale >= zl && t.scale <= _l || isNaN(t.scale)) && (t.scale = 1), (t.translate >= Xl && t.translate <= Yl || isNaN(t.translate)) && (t.translate = 0)
}

function Mt(t, e, n, s) {
    rs(t.x, e.x, n.x, s ? s.originX : void 0), rs(t.y, e.y, n.y, s ? s.originY : void 0)
}

function os(t, e, n) {
    t.min = n.min + e.min, t.max = t.min + j(e)
}

function Zl(t, e, n) {
    os(t.x, e.x, n.x), os(t.y, e.y, n.y)
}

function as(t, e, n) {
    t.min = e.min - n.min, t.max = t.min + j(e)
}

function Dt(t, e, n) {
    as(t.x, e.x, n.x), as(t.y, e.y, n.y)
}

function W(t) {
    return [t("x"), t("y")]
}
const lr = ({
        current: t
    }) => t ? t.ownerDocument.defaultView : null,
    ls = (t, e) => Math.abs(t - e);

function Jl(t, e) {
    const n = ls(t.x, e.x),
        s = ls(t.y, e.y);
    return Math.sqrt(n ** 2 + s ** 2)
}
class ur {
    constructor(e, n, {
        transformPagePoint: s,
        contextWindow: i = window,
        dragSnapToOrigin: o = !1,
        distanceThreshold: r = 3
    } = {}) {
        if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.updatePoint = () => {
                if (!(this.lastMoveEvent && this.lastMoveEventInfo)) return;
                const f = de(this.lastMoveEventInfo, this.history),
                    d = this.startEvent !== null,
                    m = Jl(f.offset, {
                        x: 0,
                        y: 0
                    }) >= this.distanceThreshold;
                if (!d && !m) return;
                const {
                    point: g
                } = f, {
                    timestamp: v
                } = I;
                this.history.push({ ...g,
                    timestamp: v
                });
                const {
                    onStart: y,
                    onMove: T
                } = this.handlers;
                d || (y && y(this.lastMoveEvent, f), this.startEvent = this.lastMoveEvent), T && T(this.lastMoveEvent, f)
            }, this.handlePointerMove = (f, d) => {
                this.lastMoveEvent = f, this.lastMoveEventInfo = fe(d, this.transformPagePoint), C.update(this.updatePoint, !0)
            }, this.handlePointerUp = (f, d) => {
                this.end();
                const {
                    onEnd: m,
                    onSessionEnd: g,
                    resumeAnimation: v
                } = this.handlers;
                if (this.dragSnapToOrigin && v && v(), !(this.lastMoveEvent && this.lastMoveEventInfo)) return;
                const y = de(f.type === "pointercancel" ? this.lastMoveEventInfo : fe(d, this.transformPagePoint), this.history);
                this.startEvent && m && m(f, y), g && g(f, y)
            }, !un(e)) return;
        this.dragSnapToOrigin = o, this.handlers = n, this.transformPagePoint = s, this.distanceThreshold = r, this.contextWindow = i || window;
        const a = Nt(e),
            l = fe(a, this.transformPagePoint),
            {
                point: c
            } = l,
            {
                timestamp: u
            } = I;
        this.history = [{ ...c,
            timestamp: u
        }];
        const {
            onSessionStart: h
        } = n;
        h && h(e, de(l, this.history)), this.removeListeners = Bt(Ct(this.contextWindow, "pointermove", this.handlePointerMove), Ct(this.contextWindow, "pointerup", this.handlePointerUp), Ct(this.contextWindow, "pointercancel", this.handlePointerUp))
    }
    updateHandlers(e) {
        this.handlers = e
    }
    end() {
        this.removeListeners && this.removeListeners(), q(this.updatePoint)
    }
}

function fe(t, e) {
    return e ? {
        point: e(t.point)
    } : t
}

function us(t, e) {
    return {
        x: t.x - e.x,
        y: t.y - e.y
    }
}

function de({
    point: t
}, e) {
    return {
        point: t,
        delta: us(t, cr(e)),
        offset: us(t, Ql(e)),
        velocity: tu(e, .1)
    }
}

function Ql(t) {
    return t[0]
}

function cr(t) {
    return t[t.length - 1]
}

function tu(t, e) {
    if (t.length < 2) return {
        x: 0,
        y: 0
    };
    let n = t.length - 1,
        s = null;
    const i = cr(t);
    for (; n >= 0 && (s = t[n], !(i.timestamp - s.timestamp > z(e)));) n--;
    if (!s) return {
        x: 0,
        y: 0
    };
    const o = $(i.timestamp - s.timestamp);
    if (o === 0) return {
        x: 0,
        y: 0
    };
    const r = {
        x: (i.x - s.x) / o,
        y: (i.y - s.y) / o
    };
    return r.x === 1 / 0 && (r.x = 0), r.y === 1 / 0 && (r.y = 0), r
}

function eu(t, {
    min: e,
    max: n
}, s) {
    return e !== void 0 && t < e ? t = s ? M(e, t, s.min) : Math.max(t, e) : n !== void 0 && t > n && (t = s ? M(n, t, s.max) : Math.min(t, n)), t
}

function cs(t, e, n) {
    return {
        min: e !== void 0 ? t.min + e : void 0,
        max: n !== void 0 ? t.max + n - (t.max - t.min) : void 0
    }
}

function nu(t, {
    top: e,
    left: n,
    bottom: s,
    right: i
}) {
    return {
        x: cs(t.x, n, i),
        y: cs(t.y, e, s)
    }
}

function hs(t, e) {
    let n = e.min - t.min,
        s = e.max - t.max;
    return e.max - e.min < t.max - t.min && ([n, s] = [s, n]), {
        min: n,
        max: s
    }
}

function su(t, e) {
    return {
        x: hs(t.x, e.x),
        y: hs(t.y, e.y)
    }
}

function iu(t, e) {
    let n = .5;
    const s = j(t),
        i = j(e);
    return i > s ? n = Rt(e.min, e.max - s, t.min) : s > i && (n = Rt(t.min, t.max - i, e.min)), X(0, 1, n)
}

function ru(t, e) {
    const n = {};
    return e.min !== void 0 && (n.min = e.min - t.min), e.max !== void 0 && (n.max = e.max - t.min), n
}
const Oe = .35;

function ou(t = Oe) {
    return t === !1 ? t = 0 : t === !0 && (t = Oe), {
        x: fs(t, "left", "right"),
        y: fs(t, "top", "bottom")
    }
}

function fs(t, e, n) {
    return {
        min: ds(t, e),
        max: ds(t, n)
    }
}

function ds(t, e) {
    return typeof t == "number" ? t : t[e] || 0
}
const au = new WeakMap;
class lu {
    constructor(e) {
        this.openDragLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = {
            x: 0,
            y: 0
        }, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = R(), this.latestPointerEvent = null, this.latestPanInfo = null, this.visualElement = e
    }
    start(e, {
        snapToCursor: n = !1,
        distanceThreshold: s
    } = {}) {
        const {
            presenceContext: i
        } = this.visualElement;
        if (i && i.isPresent === !1) return;
        const o = h => {
                const {
                    dragSnapToOrigin: f
                } = this.getProps();
                f ? this.pauseAnimation() : this.stopAnimation(), n && this.snapToCursor(Nt(h).point)
            },
            r = (h, f) => {
                const {
                    drag: d,
                    dragPropagation: m,
                    onDragStart: g
                } = this.getProps();
                if (d && !m && (this.openDragLock && this.openDragLock(), this.openDragLock = da(d), !this.openDragLock)) return;
                this.latestPointerEvent = h, this.latestPanInfo = f, this.isDragging = !0, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0, this.visualElement.projection.target = void 0), W(y => {
                    let T = this.getAxisMotionValue(y).get() || 0;
                    if (_.test(T)) {
                        const {
                            projection: x
                        } = this.visualElement;
                        if (x && x.layout) {
                            const A = x.layout.layoutBox[y];
                            A && (T = j(A) * (parseFloat(T) / 100))
                        }
                    }
                    this.originPoint[y] = T
                }), g && C.postRender(() => g(h, f)), Be(this.visualElement, "transform");
                const {
                    animationState: v
                } = this.visualElement;
                v && v.setActive("whileDrag", !0)
            },
            a = (h, f) => {
                this.latestPointerEvent = h, this.latestPanInfo = f;
                const {
                    dragPropagation: d,
                    dragDirectionLock: m,
                    onDirectionLock: g,
                    onDrag: v
                } = this.getProps();
                if (!d && !this.openDragLock) return;
                const {
                    offset: y
                } = f;
                if (m && this.currentDirection === null) {
                    this.currentDirection = uu(y), this.currentDirection !== null && g && g(this.currentDirection);
                    return
                }
                this.updateAxis("x", f.point, y), this.updateAxis("y", f.point, y), this.visualElement.render(), v && v(h, f)
            },
            l = (h, f) => {
                this.latestPointerEvent = h, this.latestPanInfo = f, this.stop(h, f), this.latestPointerEvent = null, this.latestPanInfo = null
            },
            c = () => W(h => this.getAnimationState(h) === "paused" && this.getAxisMotionValue(h).animation ?.play()),
            {
                dragSnapToOrigin: u
            } = this.getProps();
        this.panSession = new ur(e, {
            onSessionStart: o,
            onStart: r,
            onMove: a,
            onSessionEnd: l,
            resumeAnimation: c
        }, {
            transformPagePoint: this.visualElement.getTransformPagePoint(),
            dragSnapToOrigin: u,
            distanceThreshold: s,
            contextWindow: lr(this.visualElement)
        })
    }
    stop(e, n) {
        const s = e || this.latestPointerEvent,
            i = n || this.latestPanInfo,
            o = this.isDragging;
        if (this.cancel(), !o || !i || !s) return;
        const {
            velocity: r
        } = i;
        this.startAnimation(r);
        const {
            onDragEnd: a
        } = this.getProps();
        a && C.postRender(() => a(s, i))
    }
    cancel() {
        this.isDragging = !1;
        const {
            projection: e,
            animationState: n
        } = this.visualElement;
        e && (e.isAnimationBlocked = !1), this.panSession && this.panSession.end(), this.panSession = void 0;
        const {
            dragPropagation: s
        } = this.getProps();
        !s && this.openDragLock && (this.openDragLock(), this.openDragLock = null), n && n.setActive("whileDrag", !1)
    }
    updateAxis(e, n, s) {
        const {
            drag: i
        } = this.getProps();
        if (!s || !$t(e, i, this.currentDirection)) return;
        const o = this.getAxisMotionValue(e);
        let r = this.originPoint[e] + s[e];
        this.constraints && this.constraints[e] && (r = eu(r, this.constraints[e], this.elastic[e])), o.set(r)
    }
    resolveConstraints() {
        const {
            dragConstraints: e,
            dragElastic: n
        } = this.getProps(), s = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : this.visualElement.projection ?.layout, i = this.constraints;
        e && dt(e) ? this.constraints || (this.constraints = this.resolveRefConstraints()) : e && s ? this.constraints = nu(s.layoutBox, e) : this.constraints = !1, this.elastic = ou(n), i !== this.constraints && s && this.constraints && !this.hasMutatedConstraints && W(o => {
            this.constraints !== !1 && this.getAxisMotionValue(o) && (this.constraints[o] = ru(s.layoutBox[o], this.constraints[o]))
        })
    }
    resolveRefConstraints() {
        const {
            dragConstraints: e,
            onMeasureDragConstraints: n
        } = this.getProps();
        if (!e || !dt(e)) return !1;
        const s = e.current,
            {
                projection: i
            } = this.visualElement;
        if (!i || !i.layout) return !1;
        const o = cl(s, i.root, this.visualElement.getTransformPagePoint());
        let r = su(i.layout.layoutBox, o);
        if (n) {
            const a = n(al(r));
            this.hasMutatedConstraints = !!a, a && (r = _i(a))
        }
        return r
    }
    startAnimation(e) {
        const {
            drag: n,
            dragMomentum: s,
            dragElastic: i,
            dragTransition: o,
            dragSnapToOrigin: r,
            onDragTransitionEnd: a
        } = this.getProps(), l = this.constraints || {}, c = W(u => {
            if (!$t(u, n, this.currentDirection)) return;
            let h = l && l[u] || {};
            r && (h = {
                min: 0,
                max: 0
            });
            const f = i ? 200 : 1e6,
                d = i ? 40 : 1e7,
                m = {
                    type: "inertia",
                    velocity: s ? e[u] : 0,
                    bounceStiffness: f,
                    bounceDamping: d,
                    timeConstant: 750,
                    restDelta: 1,
                    restSpeed: 10,
                    ...o,
                    ...h
                };
            return this.startAxisValueAnimation(u, m)
        });
        return Promise.all(c).then(a)
    }
    startAxisValueAnimation(e, n) {
        const s = this.getAxisMotionValue(e);
        return Be(this.visualElement, e), s.start(vn(e, s, 0, n, this.visualElement, !1))
    }
    stopAnimation() {
        W(e => this.getAxisMotionValue(e).stop())
    }
    pauseAnimation() {
        W(e => this.getAxisMotionValue(e).animation ?.pause())
    }
    getAnimationState(e) {
        return this.getAxisMotionValue(e).animation ?.state
    }
    getAxisMotionValue(e) {
        const n = `_drag${e.toUpperCase()}`,
            s = this.visualElement.getProps(),
            i = s[n];
        return i || this.visualElement.getValue(e, (s.initial ? s.initial[e] : void 0) || 0)
    }
    snapToCursor(e) {
        W(n => {
            const {
                drag: s
            } = this.getProps();
            if (!$t(n, s, this.currentDirection)) return;
            const {
                projection: i
            } = this.visualElement, o = this.getAxisMotionValue(n);
            if (i && i.layout) {
                const {
                    min: r,
                    max: a
                } = i.layout.layoutBox[n];
                o.set(e[n] - M(r, a, .5))
            }
        })
    }
    scalePositionWithinConstraints() {
        if (!this.visualElement.current) return;
        const {
            drag: e,
            dragConstraints: n
        } = this.getProps(), {
            projection: s
        } = this.visualElement;
        if (!dt(n) || !s || !this.constraints) return;
        this.stopAnimation();
        const i = {
            x: 0,
            y: 0
        };
        W(r => {
            const a = this.getAxisMotionValue(r);
            if (a && this.constraints !== !1) {
                const l = a.get();
                i[r] = iu({
                    min: l,
                    max: l
                }, this.constraints[r])
            }
        });
        const {
            transformTemplate: o
        } = this.visualElement.getProps();
        this.visualElement.current.style.transform = o ? o({}, "") : "none", s.root && s.root.updateScroll(), s.updateLayout(), this.resolveConstraints(), W(r => {
            if (!$t(r, e, null)) return;
            const a = this.getAxisMotionValue(r),
                {
                    min: l,
                    max: c
                } = this.constraints[r];
            a.set(M(l, c, i[r]))
        })
    }
    addListeners() {
        if (!this.visualElement.current) return;
        au.set(this.visualElement, this);
        const e = this.visualElement.current,
            n = Ct(e, "pointerdown", l => {
                const {
                    drag: c,
                    dragListener: u = !0
                } = this.getProps();
                c && u && this.start(l)
            }),
            s = () => {
                const {
                    dragConstraints: l
                } = this.getProps();
                dt(l) && l.current && (this.constraints = this.resolveRefConstraints())
            },
            {
                projection: i
            } = this.visualElement,
            o = i.addEventListener("measure", s);
        i && !i.layout && (i.root && i.root.updateScroll(), i.updateLayout()), C.read(s);
        const r = It(window, "resize", () => this.scalePositionWithinConstraints()),
            a = i.addEventListener("didUpdate", (({
                delta: l,
                hasLayoutChanged: c
            }) => {
                this.isDragging && c && (W(u => {
                    const h = this.getAxisMotionValue(u);
                    h && (this.originPoint[u] += l[u].translate, h.set(h.get() + l[u].translate))
                }), this.visualElement.render())
            }));
        return () => {
            r(), n(), o(), a && a()
        }
    }
    getProps() {
        const e = this.visualElement.getProps(),
            {
                drag: n = !1,
                dragDirectionLock: s = !1,
                dragPropagation: i = !1,
                dragConstraints: o = !1,
                dragElastic: r = Oe,
                dragMomentum: a = !0
            } = e;
        return { ...e,
            drag: n,
            dragDirectionLock: s,
            dragPropagation: i,
            dragConstraints: o,
            dragElastic: r,
            dragMomentum: a
        }
    }
}

function $t(t, e, n) {
    return (e === !0 || e === t) && (n === null || n === t)
}

function uu(t, e = 10) {
    let n = null;
    return Math.abs(t.y) > e ? n = "y" : Math.abs(t.x) > e && (n = "x"), n
}
class cu extends et {
    constructor(e) {
        super(e), this.removeGroupControls = G, this.removeListeners = G, this.controls = new lu(e)
    }
    mount() {
        const {
            dragControls: e
        } = this.node.getProps();
        e && (this.removeGroupControls = e.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || G
    }
    unmount() {
        this.removeGroupControls(), this.removeListeners()
    }
}
const ms = t => (e, n) => {
    t && C.postRender(() => t(e, n))
};
class hu extends et {
    constructor() {
        super(...arguments), this.removePointerDownListener = G
    }
    onPointerDown(e) {
        this.session = new ur(e, this.createPanHandlers(), {
            transformPagePoint: this.node.getTransformPagePoint(),
            contextWindow: lr(this.node)
        })
    }
    createPanHandlers() {
        const {
            onPanSessionStart: e,
            onPanStart: n,
            onPan: s,
            onPanEnd: i
        } = this.node.getProps();
        return {
            onSessionStart: ms(e),
            onStart: ms(n),
            onMove: s,
            onEnd: (o, r) => {
                delete this.session, i && C.postRender(() => i(o, r))
            }
        }
    }
    mount() {
        this.removePointerDownListener = Ct(this.node.current, "pointerdown", e => this.onPointerDown(e))
    }
    update() {
        this.session && this.session.updateHandlers(this.createPanHandlers())
    }
    unmount() {
        this.removePointerDownListener(), this.session && this.session.end()
    }
}
const _t = {
    hasAnimatedSinceResize: !0,
    hasEverUpdated: !1
};

function ps(t, e) {
    return e.max === e.min ? 0 : t / (e.max - e.min) * 100
}
const St = {
        correct: (t, e) => {
            if (!e.target) return t;
            if (typeof t == "string")
                if (S.test(t)) t = parseFloat(t);
                else return t;
            const n = ps(t, e.target.x),
                s = ps(t, e.target.y);
            return `${n}% ${s}%`
        }
    },
    fu = {
        correct: (t, {
            treeScale: e,
            projectionDelta: n
        }) => {
            const s = t,
                i = Q.parse(t);
            if (i.length > 5) return s;
            const o = Q.createTransformer(t),
                r = typeof i[0] != "number" ? 1 : 0,
                a = n.x.scale * e.x,
                l = n.y.scale * e.y;
            i[0 + r] /= a, i[1 + r] /= l;
            const c = M(a, l, .5);
            return typeof i[2 + r] == "number" && (i[2 + r] /= c), typeof i[3 + r] == "number" && (i[3 + r] /= c), o(i)
        }
    };
let me = !1;
class du extends p.Component {
    componentDidMount() {
        const {
            visualElement: e,
            layoutGroup: n,
            switchLayoutGroup: s,
            layoutId: i
        } = this.props, {
            projection: o
        } = e;
        Ia(mu), o && (n.group && n.group.add(o), s && s.register && i && s.register(o), me && o.root.didUpdate(), o.addEventListener("animationComplete", () => {
            this.safeToRemove()
        }), o.setOptions({ ...o.options,
            onExitComplete: () => this.safeToRemove()
        })), _t.hasEverUpdated = !0
    }
    getSnapshotBeforeUpdate(e) {
        const {
            layoutDependency: n,
            visualElement: s,
            drag: i,
            isPresent: o
        } = this.props, {
            projection: r
        } = s;
        return r && (r.isPresent = o, me = !0, i || e.layoutDependency !== n || n === void 0 || e.isPresent !== o ? r.willUpdate() : this.safeToRemove(), e.isPresent !== o && (o ? r.promote() : r.relegate() || C.postRender(() => {
            const a = r.getStack();
            (!a || !a.members.length) && this.safeToRemove()
        }))), null
    }
    componentDidUpdate() {
        const {
            projection: e
        } = this.props.visualElement;
        e && (e.root.didUpdate(), ln.postRender(() => {
            !e.currentAnimation && e.isLead() && this.safeToRemove()
        }))
    }
    componentWillUnmount() {
        const {
            visualElement: e,
            layoutGroup: n,
            switchLayoutGroup: s
        } = this.props, {
            projection: i
        } = e;
        me = !0, i && (i.scheduleCheckAfterUnmount(), n && n.group && n.group.remove(i), s && s.deregister && s.deregister(i))
    }
    safeToRemove() {
        const {
            safeToRemove: e
        } = this.props;
        e && e()
    }
    render() {
        return null
    }
}

function hr(t) {
    const [e, n] = Li(), s = p.useContext(Ue);
    return N.jsx(du, { ...t,
        layoutGroup: s,
        switchLayoutGroup: p.useContext(Hi),
        isPresent: e,
        safeToRemove: n
    })
}
const mu = {
    borderRadius: { ...St,
        applyTo: ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomLeftRadius", "borderBottomRightRadius"]
    },
    borderTopLeftRadius: St,
    borderTopRightRadius: St,
    borderBottomLeftRadius: St,
    borderBottomRightRadius: St,
    boxShadow: fu
};

function pu(t, e, n) {
    const s = E(t) ? t : ut(t);
    return s.start(vn("", s, e, n)), s.animation
}
const gu = (t, e) => t.depth - e.depth;
class yu {
    constructor() {
        this.children = [], this.isDirty = !1
    }
    add(e) {
        $e(this.children, e), this.isDirty = !0
    }
    remove(e) {
        Ge(this.children, e), this.isDirty = !0
    }
    forEach(e) {
        this.isDirty && this.children.sort(gu), this.isDirty = !1, this.children.forEach(e)
    }
}

function vu(t, e) {
    const n = O.now(),
        s = ({
            timestamp: i
        }) => {
            const o = i - n;
            o >= e && (q(s), t(o - e))
        };
    return C.setup(s, !0), () => q(s)
}
const fr = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"],
    xu = fr.length,
    gs = t => typeof t == "string" ? parseFloat(t) : t,
    ys = t => typeof t == "number" || S.test(t);

function Tu(t, e, n, s, i, o) {
    i ? (t.opacity = M(0, n.opacity ?? 1, Pu(s)), t.opacityExit = M(e.opacity ?? 1, 0, Su(s))) : o && (t.opacity = M(e.opacity ?? 1, n.opacity ?? 1, s));
    for (let r = 0; r < xu; r++) {
        const a = `border${fr[r]}Radius`;
        let l = vs(e, a),
            c = vs(n, a);
        if (l === void 0 && c === void 0) continue;
        l || (l = 0), c || (c = 0), l === 0 || c === 0 || ys(l) === ys(c) ? (t[a] = Math.max(M(gs(l), gs(c), s), 0), (_.test(c) || _.test(l)) && (t[a] += "%")) : t[a] = c
    }(e.rotate || n.rotate) && (t.rotate = M(e.rotate || 0, n.rotate || 0, s))
}

function vs(t, e) {
    return t[e] !== void 0 ? t[e] : t.borderRadius
}
const Pu = dr(0, .5, Zs),
    Su = dr(.5, .95, G);

function dr(t, e, n) {
    return s => s < t ? 0 : s > e ? 1 : n(Rt(t, e, s))
}

function xs(t, e) {
    t.min = e.min, t.max = e.max
}

function K(t, e) {
    xs(t.x, e.x), xs(t.y, e.y)
}

function Ts(t, e) {
    t.translate = e.translate, t.scale = e.scale, t.originPoint = e.originPoint, t.origin = e.origin
}

function Ps(t, e, n, s, i) {
    return t -= e, t = Jt(t, 1 / n, s), i !== void 0 && (t = Jt(t, 1 / i, s)), t
}

function bu(t, e = 0, n = 1, s = .5, i, o = t, r = t) {
    if (_.test(e) && (e = parseFloat(e), e = M(r.min, r.max, e / 100) - r.min), typeof e != "number") return;
    let a = M(o.min, o.max, s);
    t === o && (a -= e), t.min = Ps(t.min, e, n, a, i), t.max = Ps(t.max, e, n, a, i)
}

function Ss(t, e, [n, s, i], o, r) {
    bu(t, e[n], e[s], e[i], e.scale, o, r)
}
const Au = ["x", "scaleX", "originX"],
    wu = ["y", "scaleY", "originY"];

function bs(t, e, n, s) {
    Ss(t.x, e, Au, n ? n.x : void 0, s ? s.x : void 0), Ss(t.y, e, wu, n ? n.y : void 0, s ? s.y : void 0)
}

function As(t) {
    return t.translate === 0 && t.scale === 1
}

function mr(t) {
    return As(t.x) && As(t.y)
}

function ws(t, e) {
    return t.min === e.min && t.max === e.max
}

function Vu(t, e) {
    return ws(t.x, e.x) && ws(t.y, e.y)
}

function Vs(t, e) {
    return Math.round(t.min) === Math.round(e.min) && Math.round(t.max) === Math.round(e.max)
}

function pr(t, e) {
    return Vs(t.x, e.x) && Vs(t.y, e.y)
}

function Cs(t) {
    return j(t.x) / j(t.y)
}

function Ms(t, e) {
    return t.translate === e.translate && t.scale === e.scale && t.originPoint === e.originPoint
}
class Cu {
    constructor() {
        this.members = []
    }
    add(e) {
        $e(this.members, e), e.scheduleRender()
    }
    remove(e) {
        if (Ge(this.members, e), e === this.prevLead && (this.prevLead = void 0), e === this.lead) {
            const n = this.members[this.members.length - 1];
            n && this.promote(n)
        }
    }
    relegate(e) {
        const n = this.members.findIndex(i => e === i);
        if (n === 0) return !1;
        let s;
        for (let i = n; i >= 0; i--) {
            const o = this.members[i];
            if (o.isPresent !== !1) {
                s = o;
                break
            }
        }
        return s ? (this.promote(s), !0) : !1
    }
    promote(e, n) {
        const s = this.lead;
        if (e !== s && (this.prevLead = s, this.lead = e, e.show(), s)) {
            s.instance && s.scheduleRender(), e.scheduleRender(), e.resumeFrom = s, n && (e.resumeFrom.preserveOpacity = !0), s.snapshot && (e.snapshot = s.snapshot, e.snapshot.latestValues = s.animationValues || s.latestValues), e.root && e.root.isUpdating && (e.isLayoutDirty = !0);
            const {
                crossfade: i
            } = e.options;
            i === !1 && s.hide()
        }
    }
    exitAnimationComplete() {
        this.members.forEach(e => {
            const {
                options: n,
                resumingFrom: s
            } = e;
            n.onExitComplete && n.onExitComplete(), s && s.options.onExitComplete && s.options.onExitComplete()
        })
    }
    scheduleRender() {
        this.members.forEach(e => {
            e.instance && e.scheduleRender(!1)
        })
    }
    removeLeadSnapshot() {
        this.lead && this.lead.snapshot && (this.lead.snapshot = void 0)
    }
}

function Mu(t, e, n) {
    let s = "";
    const i = t.x.translate / e.x,
        o = t.y.translate / e.y,
        r = n ?.z || 0;
    if ((i || o || r) && (s = `translate3d(${i}px, ${o}px, ${r}px) `), (e.x !== 1 || e.y !== 1) && (s += `scale(${1/e.x}, ${1/e.y}) `), n) {
        const {
            transformPerspective: c,
            rotate: u,
            rotateX: h,
            rotateY: f,
            skewX: d,
            skewY: m
        } = n;
        c && (s = `perspective(${c}px) ${s}`), u && (s += `rotate(${u}deg) `), h && (s += `rotateX(${h}deg) `), f && (s += `rotateY(${f}deg) `), d && (s += `skewX(${d}deg) `), m && (s += `skewY(${m}deg) `)
    }
    const a = t.x.scale * e.x,
        l = t.y.scale * e.y;
    return (a !== 1 || l !== 1) && (s += `scale(${a}, ${l})`), s || "none"
}
const pe = ["", "X", "Y", "Z"],
    Du = 1e3;
let Ru = 0;

function ge(t, e, n, s) {
    const {
        latestValues: i
    } = e;
    i[t] && (n[t] = i[t], e.setStaticValue(t, 0), s && (s[t] = 0))
}

function gr(t) {
    if (t.hasCheckedOptimisedAppear = !0, t.root === t) return;
    const {
        visualElement: e
    } = t.options;
    if (!e) return;
    const n = er(e);
    if (window.MotionHasOptimisedAnimation(n, "transform")) {
        const {
            layout: i,
            layoutId: o
        } = t.options;
        window.MotionCancelOptimisedAnimation(n, "transform", C, !(i || o))
    }
    const {
        parent: s
    } = t;
    s && !s.hasCheckedOptimisedAppear && gr(s)
}

function yr({
    attachResizeListener: t,
    defaultParent: e,
    measureScroll: n,
    checkIsScrollRoot: s,
    resetTransform: i
}) {
    return class {
        constructor(r = {}, a = e ?.()) {
            this.id = Ru++, this.animationId = 0, this.animationCommitId = 0, this.children = new Set, this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = {
                x: 1,
                y: 1
            }, this.eventHandlers = new Map, this.hasTreeAnimated = !1, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
                this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots())
            }, this.updateProjection = () => {
                this.projectionUpdateScheduled = !1, this.nodes.forEach(ku), this.nodes.forEach(ju), this.nodes.forEach(Ou), this.nodes.forEach(Fu)
            }, this.resolvedRelativeTargetAt = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = new Map, this.latestValues = r, this.root = a ? a.root || a : this, this.path = a ? [...a.path, a] : [], this.parent = a, this.depth = a ? a.depth + 1 : 0;
            for (let l = 0; l < this.path.length; l++) this.path[l].shouldResetTransform = !0;
            this.root === this && (this.nodes = new yu)
        }
        addEventListener(r, a) {
            return this.eventHandlers.has(r) || this.eventHandlers.set(r, new _e), this.eventHandlers.get(r).add(a)
        }
        notifyListeners(r, ...a) {
            const l = this.eventHandlers.get(r);
            l && l.notify(...a)
        }
        hasListeners(r) {
            return this.eventHandlers.has(r)
        }
        mount(r) {
            if (this.instance) return;
            this.isSVG = Ei(r) && !xa(r), this.instance = r;
            const {
                layoutId: a,
                layout: l,
                visualElement: c
            } = this.options;
            if (c && !c.current && c.mount(r), this.root.nodes.add(this), this.parent && this.parent.children.add(this), this.root.hasTreeAnimated && (l || a) && (this.isLayoutDirty = !0), t) {
                let u, h = 0;
                const f = () => this.root.updateBlockedByResize = !1;
                C.read(() => {
                    h = window.innerWidth
                }), t(r, () => {
                    const d = window.innerWidth;
                    d !== h && (h = d, this.root.updateBlockedByResize = !0, u && u(), u = vu(f, 250), _t.hasAnimatedSinceResize && (_t.hasAnimatedSinceResize = !1, this.nodes.forEach(Es)))
                })
            }
            a && this.root.registerSharedNode(a, this), this.options.animate !== !1 && c && (a || l) && this.addEventListener("didUpdate", ({
                delta: u,
                hasLayoutChanged: h,
                hasRelativeLayoutChanged: f,
                layout: d
            }) => {
                if (this.isTreeAnimationBlocked()) {
                    this.target = void 0, this.relativeTarget = void 0;
                    return
                }
                const m = this.options.transition || c.getDefaultTransition() || $u,
                    {
                        onLayoutAnimationStart: g,
                        onLayoutAnimationComplete: v
                    } = c.getProps(),
                    y = !this.targetLayout || !pr(this.targetLayout, d),
                    T = !h && f;
                if (this.options.layoutRoot || this.resumeFrom || T || h && (y || !this.currentAnimation)) {
                    this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0);
                    const x = { ...on(m, "layout"),
                        onPlay: g,
                        onComplete: v
                    };
                    (c.shouldReduceMotion || this.options.layoutRoot) && (x.delay = 0, x.type = !1), this.startAnimation(x), this.setAnimationOrigin(u, T)
                } else h || Es(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
                this.targetLayout = d
            })
        }
        unmount() {
            this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
            const r = this.getStack();
            r && r.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, this.eventHandlers.clear(), q(this.updateProjection)
        }
        blockUpdate() {
            this.updateManuallyBlocked = !0
        }
        unblockUpdate() {
            this.updateManuallyBlocked = !1
        }
        isUpdateBlocked() {
            return this.updateManuallyBlocked || this.updateBlockedByResize
        }
        isTreeAnimationBlocked() {
            return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || !1
        }
        startUpdate() {
            this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes && this.nodes.forEach(Nu), this.animationId++)
        }
        getTransformTemplate() {
            const {
                visualElement: r
            } = this.options;
            return r && r.getProps().transformTemplate
        }
        willUpdate(r = !0) {
            if (this.root.hasTreeAnimated = !0, this.root.isUpdateBlocked()) {
                this.options.onExitComplete && this.options.onExitComplete();
                return
            }
            if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && gr(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty) return;
            this.isLayoutDirty = !0;
            for (let u = 0; u < this.path.length; u++) {
                const h = this.path[u];
                h.shouldResetTransform = !0, h.updateScroll("snapshot"), h.options.layoutRoot && h.willUpdate(!1)
            }
            const {
                layoutId: a,
                layout: l
            } = this.options;
            if (a === void 0 && !l) return;
            const c = this.getTransformTemplate();
            this.prevTransformTemplateValue = c ? c(this.latestValues, "") : void 0, this.updateSnapshot(), r && this.notifyListeners("willUpdate")
        }
        update() {
            if (this.updateScheduled = !1, this.isUpdateBlocked()) {
                this.unblockUpdate(), this.clearAllSnapshots(), this.nodes.forEach(Ds);
                return
            }
            if (this.animationId <= this.animationCommitId) {
                this.nodes.forEach(Rs);
                return
            }
            this.animationCommitId = this.animationId, this.isUpdating ? (this.isUpdating = !1, this.nodes.forEach(Bu), this.nodes.forEach(Eu), this.nodes.forEach(Lu)) : this.nodes.forEach(Rs), this.clearAllSnapshots();
            const a = O.now();
            I.delta = X(0, 1e3 / 60, a - I.timestamp), I.timestamp = a, I.isProcessing = !0, ie.update.process(I), ie.preRender.process(I), ie.render.process(I), I.isProcessing = !1
        }
        didUpdate() {
            this.updateScheduled || (this.updateScheduled = !0, ln.read(this.scheduleUpdate))
        }
        clearAllSnapshots() {
            this.nodes.forEach(Iu), this.sharedNodes.forEach(Uu)
        }
        scheduleUpdateProjection() {
            this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0, C.preRender(this.updateProjection, !1, !0))
        }
        scheduleCheckAfterUnmount() {
            C.postRender(() => {
                this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed()
            })
        }
        updateSnapshot() {
            this.snapshot || !this.instance || (this.snapshot = this.measure(), this.snapshot && !j(this.snapshot.measuredBox.x) && !j(this.snapshot.measuredBox.y) && (this.snapshot = void 0))
        }
        updateLayout() {
            if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty)) return;
            if (this.resumeFrom && !this.resumeFrom.instance)
                for (let l = 0; l < this.path.length; l++) this.path[l].updateScroll();
            const r = this.layout;
            this.layout = this.measure(!1), this.layoutCorrected = R(), this.isLayoutDirty = !1, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
            const {
                visualElement: a
            } = this.options;
            a && a.notify("LayoutMeasure", this.layout.layoutBox, r ? r.layoutBox : void 0)
        }
        updateScroll(r = "measure") {
            let a = !!(this.options.layoutScroll && this.instance);
            if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === r && (a = !1), a && this.instance) {
                const l = s(this.instance);
                this.scroll = {
                    animationId: this.root.animationId,
                    phase: r,
                    isRoot: l,
                    offset: n(this.instance),
                    wasRoot: this.scroll ? this.scroll.isRoot : l
                }
            }
        }
        resetTransform() {
            if (!i) return;
            const r = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout,
                a = this.projectionDelta && !mr(this.projectionDelta),
                l = this.getTransformTemplate(),
                c = l ? l(this.latestValues, "") : void 0,
                u = c !== this.prevTransformTemplateValue;
            r && this.instance && (a || it(this.latestValues) || u) && (i(this.instance, c), this.shouldResetTransform = !1, this.scheduleRender())
        }
        measure(r = !0) {
            const a = this.measurePageBox();
            let l = this.removeElementScroll(a);
            return r && (l = this.removeTransform(l)), Gu(l), {
                animationId: this.root.animationId,
                measuredBox: a,
                layoutBox: l,
                latestValues: {},
                source: this.id
            }
        }
        measurePageBox() {
            const {
                visualElement: r
            } = this.options;
            if (!r) return R();
            const a = r.measureViewportBox();
            if (!(this.scroll ?.wasRoot || this.path.some(Hu))) {
                const {
                    scroll: c
                } = this.root;
                c && (mt(a.x, c.offset.x), mt(a.y, c.offset.y))
            }
            return a
        }
        removeElementScroll(r) {
            const a = R();
            if (K(a, r), this.scroll ?.wasRoot) return a;
            for (let l = 0; l < this.path.length; l++) {
                const c = this.path[l],
                    {
                        scroll: u,
                        options: h
                    } = c;
                c !== this.root && u && h.layoutScroll && (u.wasRoot && K(a, r), mt(a.x, u.offset.x), mt(a.y, u.offset.y))
            }
            return a
        }
        applyTransform(r, a = !1) {
            const l = R();
            K(l, r);
            for (let c = 0; c < this.path.length; c++) {
                const u = this.path[c];
                !a && u.options.layoutScroll && u.scroll && u !== u.root && pt(l, {
                    x: -u.scroll.offset.x,
                    y: -u.scroll.offset.y
                }), it(u.latestValues) && pt(l, u.latestValues)
            }
            return it(this.latestValues) && pt(l, this.latestValues), l
        }
        removeTransform(r) {
            const a = R();
            K(a, r);
            for (let l = 0; l < this.path.length; l++) {
                const c = this.path[l];
                if (!c.instance || !it(c.latestValues)) continue;
                Le(c.latestValues) && c.updateSnapshot();
                const u = R(),
                    h = c.measurePageBox();
                K(u, h), bs(a, c.latestValues, c.snapshot ? c.snapshot.layoutBox : void 0, u)
            }
            return it(this.latestValues) && bs(a, this.latestValues), a
        }
        setTargetDelta(r) {
            this.targetDelta = r, this.root.scheduleUpdateProjection(), this.isProjectionDirty = !0
        }
        setOptions(r) {
            this.options = { ...this.options,
                ...r,
                crossfade: r.crossfade !== void 0 ? r.crossfade : !0
            }
        }
        clearMeasurements() {
            this.scroll = void 0, this.layout = void 0, this.snapshot = void 0, this.prevTransformTemplateValue = void 0, this.targetDelta = void 0, this.target = void 0, this.isLayoutDirty = !1
        }
        forceRelativeParentToResolveTarget() {
            this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== I.timestamp && this.relativeParent.resolveTargetDelta(!0)
        }
        resolveTargetDelta(r = !1) {
            const a = this.getLead();
            this.isProjectionDirty || (this.isProjectionDirty = a.isProjectionDirty), this.isTransformDirty || (this.isTransformDirty = a.isTransformDirty), this.isSharedProjectionDirty || (this.isSharedProjectionDirty = a.isSharedProjectionDirty);
            const l = !!this.resumingFrom || this !== a;
            if (!(r || l && this.isSharedProjectionDirty || this.isProjectionDirty || this.parent ?.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize)) return;
            const {
                layout: u,
                layoutId: h
            } = this.options;
            if (!(!this.layout || !(u || h))) {
                if (this.resolvedRelativeTargetAt = I.timestamp, !this.targetDelta && !this.relativeTarget) {
                    const f = this.getClosestProjectingParent();
                    f && f.layout && this.animationProgress !== 1 ? (this.relativeParent = f, this.forceRelativeParentToResolveTarget(), this.relativeTarget = R(), this.relativeTargetOrigin = R(), Dt(this.relativeTargetOrigin, this.layout.layoutBox, f.layout.layoutBox), K(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0
                }
                if (!(!this.relativeTarget && !this.targetDelta) && (this.target || (this.target = R(), this.targetWithTransforms = R()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), Zl(this.target, this.relativeTarget, this.relativeParent.target)) : this.targetDelta ? (this.resumingFrom ? this.target = this.applyTransform(this.layout.layoutBox) : K(this.target, this.layout.layoutBox), Yi(this.target, this.targetDelta)) : K(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget)) {
                    this.attemptToResolveRelativeTarget = !1;
                    const f = this.getClosestProjectingParent();
                    f && !!f.resumingFrom == !!this.resumingFrom && !f.options.layoutScroll && f.target && this.animationProgress !== 1 ? (this.relativeParent = f, this.forceRelativeParentToResolveTarget(), this.relativeTarget = R(), this.relativeTargetOrigin = R(), Dt(this.relativeTargetOrigin, this.target, f.target), K(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0
                }
            }
        }
        getClosestProjectingParent() {
            if (!(!this.parent || Le(this.parent.latestValues) || Xi(this.parent.latestValues))) return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent()
        }
        isProjecting() {
            return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout)
        }
        calcProjection() {
            const r = this.getLead(),
                a = !!this.resumingFrom || this !== r;
            let l = !0;
            if ((this.isProjectionDirty || this.parent ?.isProjectionDirty) && (l = !1), a && (this.isSharedProjectionDirty || this.isTransformDirty) && (l = !1), this.resolvedRelativeTargetAt === I.timestamp && (l = !1), l) return;
            const {
                layout: c,
                layoutId: u
            } = this.options;
            if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(c || u)) return;
            K(this.layoutCorrected, this.layout.layoutBox);
            const h = this.treeScale.x,
                f = this.treeScale.y;
            ul(this.layoutCorrected, this.treeScale, this.path, a), r.layout && !r.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (r.target = r.layout.layoutBox, r.targetWithTransforms = R());
            const {
                target: d
            } = r;
            if (!d) {
                this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
                return
            }!this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (Ts(this.prevProjectionDelta.x, this.projectionDelta.x), Ts(this.prevProjectionDelta.y, this.projectionDelta.y)), Mt(this.projectionDelta, this.layoutCorrected, d, this.latestValues), (this.treeScale.x !== h || this.treeScale.y !== f || !Ms(this.projectionDelta.x, this.prevProjectionDelta.x) || !Ms(this.projectionDelta.y, this.prevProjectionDelta.y)) && (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", d))
        }
        hide() {
            this.isVisible = !1
        }
        show() {
            this.isVisible = !0
        }
        scheduleRender(r = !0) {
            if (this.options.visualElement ?.scheduleRender(), r) {
                const a = this.getStack();
                a && a.scheduleRender()
            }
            this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0)
        }
        createProjectionDeltas() {
            this.prevProjectionDelta = gt(), this.projectionDelta = gt(), this.projectionDeltaWithTransform = gt()
        }
        setAnimationOrigin(r, a = !1) {
            const l = this.snapshot,
                c = l ? l.latestValues : {},
                u = { ...this.latestValues
                },
                h = gt();
            (!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !a;
            const f = R(),
                d = l ? l.source : void 0,
                m = this.layout ? this.layout.source : void 0,
                g = d !== m,
                v = this.getStack(),
                y = !v || v.members.length <= 1,
                T = !!(g && !y && this.options.crossfade === !0 && !this.path.some(Wu));
            this.animationProgress = 0;
            let x;
            this.mixTargetDelta = A => {
                const P = A / 1e3;
                Ls(h.x, r.x, P), Ls(h.y, r.y, P), this.setTargetDelta(h), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (Dt(f, this.layout.layoutBox, this.relativeParent.layout.layoutBox), Ku(this.relativeTarget, this.relativeTargetOrigin, f, P), x && Vu(this.relativeTarget, x) && (this.isProjectionDirty = !1), x || (x = R()), K(x, this.relativeTarget)), g && (this.animationValues = u, Tu(u, c, this.latestValues, P, T, y)), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = P
            }, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0)
        }
        startAnimation(r) {
            this.notifyListeners("animationStart"), this.currentAnimation ?.stop(), this.resumingFrom ?.currentAnimation ?.stop(), this.pendingAnimation && (q(this.pendingAnimation), this.pendingAnimation = void 0), this.pendingAnimation = C.update(() => {
                _t.hasAnimatedSinceResize = !0, this.motionValue || (this.motionValue = ut(0)), this.currentAnimation = pu(this.motionValue, [0, 1e3], { ...r,
                    velocity: 0,
                    isSync: !0,
                    onUpdate: a => {
                        this.mixTargetDelta(a), r.onUpdate && r.onUpdate(a)
                    },
                    onStop: () => {},
                    onComplete: () => {
                        r.onComplete && r.onComplete(), this.completeAnimation()
                    }
                }), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0
            })
        }
        completeAnimation() {
            this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
            const r = this.getStack();
            r && r.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners("animationComplete")
        }
        finishAnimation() {
            this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(Du), this.currentAnimation.stop()), this.completeAnimation()
        }
        applyTransformsToTarget() {
            const r = this.getLead();
            let {
                targetWithTransforms: a,
                target: l,
                layout: c,
                latestValues: u
            } = r;
            if (!(!a || !l || !c)) {
                if (this !== r && this.layout && c && vr(this.options.animationType, this.layout.layoutBox, c.layoutBox)) {
                    l = this.target || R();
                    const h = j(this.layout.layoutBox.x);
                    l.x.min = r.target.x.min, l.x.max = l.x.min + h;
                    const f = j(this.layout.layoutBox.y);
                    l.y.min = r.target.y.min, l.y.max = l.y.min + f
                }
                K(a, l), pt(a, u), Mt(this.projectionDeltaWithTransform, this.layoutCorrected, a, u)
            }
        }
        registerSharedNode(r, a) {
            this.sharedNodes.has(r) || this.sharedNodes.set(r, new Cu), this.sharedNodes.get(r).add(a);
            const c = a.options.initialPromotionConfig;
            a.promote({
                transition: c ? c.transition : void 0,
                preserveFollowOpacity: c && c.shouldPreserveFollowOpacity ? c.shouldPreserveFollowOpacity(a) : void 0
            })
        }
        isLead() {
            const r = this.getStack();
            return r ? r.lead === this : !0
        }
        getLead() {
            const {
                layoutId: r
            } = this.options;
            return r ? this.getStack() ?.lead || this : this
        }
        getPrevLead() {
            const {
                layoutId: r
            } = this.options;
            return r ? this.getStack() ?.prevLead : void 0
        }
        getStack() {
            const {
                layoutId: r
            } = this.options;
            if (r) return this.root.sharedNodes.get(r)
        }
        promote({
            needsReset: r,
            transition: a,
            preserveFollowOpacity: l
        } = {}) {
            const c = this.getStack();
            c && c.promote(this, l), r && (this.projectionDelta = void 0, this.needsReset = !0), a && this.setOptions({
                transition: a
            })
        }
        relegate() {
            const r = this.getStack();
            return r ? r.relegate(this) : !1
        }
        resetSkewAndRotation() {
            const {
                visualElement: r
            } = this.options;
            if (!r) return;
            let a = !1;
            const {
                latestValues: l
            } = r;
            if ((l.z || l.rotate || l.rotateX || l.rotateY || l.rotateZ || l.skewX || l.skewY) && (a = !0), !a) return;
            const c = {};
            l.z && ge("z", r, c, this.animationValues);
            for (let u = 0; u < pe.length; u++) ge(`rotate${pe[u]}`, r, c, this.animationValues), ge(`skew${pe[u]}`, r, c, this.animationValues);
            r.render();
            for (const u in c) r.setStaticValue(u, c[u]), this.animationValues && (this.animationValues[u] = c[u]);
            r.scheduleRender()
        }
        applyProjectionStyles(r, a) {
            if (!this.instance || this.isSVG) return;
            if (!this.isVisible) {
                r.visibility = "hidden";
                return
            }
            const l = this.getTransformTemplate();
            if (this.needsReset) {
                this.needsReset = !1, r.visibility = "", r.opacity = "", r.pointerEvents = zt(a ?.pointerEvents) || "", r.transform = l ? l(this.latestValues, "") : "none";
                return
            }
            const c = this.getLead();
            if (!this.projectionDelta || !this.layout || !c.target) {
                this.options.layoutId && (r.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1, r.pointerEvents = zt(a ?.pointerEvents) || ""), this.hasProjected && !it(this.latestValues) && (r.transform = l ? l({}, "") : "none", this.hasProjected = !1);
                return
            }
            r.visibility = "";
            const u = c.animationValues || c.latestValues;
            this.applyTransformsToTarget();
            let h = Mu(this.projectionDeltaWithTransform, this.treeScale, u);
            l && (h = l(u, h)), r.transform = h;
            const {
                x: f,
                y: d
            } = this.projectionDelta;
            r.transformOrigin = `${f.origin*100}% ${d.origin*100}% 0`, c.animationValues ? r.opacity = c === this ? u.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : u.opacityExit : r.opacity = c === this ? u.opacity !== void 0 ? u.opacity : "" : u.opacityExit !== void 0 ? u.opacityExit : 0;
            for (const m in Ft) {
                if (u[m] === void 0) continue;
                const {
                    correct: g,
                    applyTo: v,
                    isCSSVariable: y
                } = Ft[m], T = h === "none" ? u[m] : g(u[m], c);
                if (v) {
                    const x = v.length;
                    for (let A = 0; A < x; A++) r[v[A]] = T
                } else y ? this.options.visualElement.renderState.vars[m] = T : r[m] = T
            }
            this.options.layoutId && (r.pointerEvents = c === this ? zt(a ?.pointerEvents) || "" : "none")
        }
        clearSnapshot() {
            this.resumeFrom = this.snapshot = void 0
        }
        resetTree() {
            this.root.nodes.forEach(r => r.currentAnimation ?.stop()), this.root.nodes.forEach(Ds), this.root.sharedNodes.clear()
        }
    }
}

function Eu(t) {
    t.updateLayout()
}

function Lu(t) {
    const e = t.resumeFrom ?.snapshot || t.snapshot;
    if (t.isLead() && t.layout && e && t.hasListeners("didUpdate")) {
        const {
            layoutBox: n,
            measuredBox: s
        } = t.layout, {
            animationType: i
        } = t.options, o = e.source !== t.layout.source;
        i === "size" ? W(u => {
            const h = o ? e.measuredBox[u] : e.layoutBox[u],
                f = j(h);
            h.min = n[u].min, h.max = h.min + f
        }) : vr(i, e.layoutBox, n) && W(u => {
            const h = o ? e.measuredBox[u] : e.layoutBox[u],
                f = j(n[u]);
            h.max = h.min + f, t.relativeTarget && !t.currentAnimation && (t.isProjectionDirty = !0, t.relativeTarget[u].max = t.relativeTarget[u].min + f)
        });
        const r = gt();
        Mt(r, n, e.layoutBox);
        const a = gt();
        o ? Mt(a, t.applyTransform(s, !0), e.measuredBox) : Mt(a, n, e.layoutBox);
        const l = !mr(r);
        let c = !1;
        if (!t.resumeFrom) {
            const u = t.getClosestProjectingParent();
            if (u && !u.resumeFrom) {
                const {
                    snapshot: h,
                    layout: f
                } = u;
                if (h && f) {
                    const d = R();
                    Dt(d, e.layoutBox, h.layoutBox);
                    const m = R();
                    Dt(m, n, f.layoutBox), pr(d, m) || (c = !0), u.options.layoutRoot && (t.relativeTarget = m, t.relativeTargetOrigin = d, t.relativeParent = u)
                }
            }
        }
        t.notifyListeners("didUpdate", {
            layout: n,
            snapshot: e,
            delta: a,
            layoutDelta: r,
            hasLayoutChanged: l,
            hasRelativeLayoutChanged: c
        })
    } else if (t.isLead()) {
        const {
            onExitComplete: n
        } = t.options;
        n && n()
    }
    t.options.transition = void 0
}

function ku(t) {
    t.parent && (t.isProjecting() || (t.isProjectionDirty = t.parent.isProjectionDirty), t.isSharedProjectionDirty || (t.isSharedProjectionDirty = !!(t.isProjectionDirty || t.parent.isProjectionDirty || t.parent.isSharedProjectionDirty)), t.isTransformDirty || (t.isTransformDirty = t.parent.isTransformDirty))
}

function Fu(t) {
    t.isProjectionDirty = t.isSharedProjectionDirty = t.isTransformDirty = !1
}

function Iu(t) {
    t.clearSnapshot()
}

function Ds(t) {
    t.clearMeasurements()
}

function Rs(t) {
    t.isLayoutDirty = !1
}

function Bu(t) {
    const {
        visualElement: e
    } = t.options;
    e && e.getProps().onBeforeLayoutMeasure && e.notify("BeforeLayoutMeasure"), t.resetTransform()
}

function Es(t) {
    t.finishAnimation(), t.targetDelta = t.relativeTarget = t.target = void 0, t.isProjectionDirty = !0
}

function ju(t) {
    t.resolveTargetDelta()
}

function Ou(t) {
    t.calcProjection()
}

function Nu(t) {
    t.resetSkewAndRotation()
}

function Uu(t) {
    t.removeLeadSnapshot()
}

function Ls(t, e, n) {
    t.translate = M(e.translate, 0, n), t.scale = M(e.scale, 1, n), t.origin = e.origin, t.originPoint = e.originPoint
}

function ks(t, e, n, s) {
    t.min = M(e.min, n.min, s), t.max = M(e.max, n.max, s)
}

function Ku(t, e, n, s) {
    ks(t.x, e.x, n.x, s), ks(t.y, e.y, n.y, s)
}

function Wu(t) {
    return t.animationValues && t.animationValues.opacityExit !== void 0
}
const $u = {
        duration: .45,
        ease: [.4, 0, .1, 1]
    },
    Fs = t => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(t),
    Is = Fs("applewebkit/") && !Fs("chrome/") ? Math.round : G;

function Bs(t) {
    t.min = Is(t.min), t.max = Is(t.max)
}

function Gu(t) {
    Bs(t.x), Bs(t.y)
}

function vr(t, e, n) {
    return t === "position" || t === "preserve-aspect" && !ql(Cs(e), Cs(n), .2)
}

function Hu(t) {
    return t !== t.root && t.scroll ?.wasRoot
}
const zu = yr({
        attachResizeListener: (t, e) => It(t, "resize", e),
        measureScroll: () => ({
            x: document.documentElement.scrollLeft || document.body.scrollLeft,
            y: document.documentElement.scrollTop || document.body.scrollTop
        }),
        checkIsScrollRoot: () => !0
    }),
    ye = {
        current: void 0
    },
    xr = yr({
        measureScroll: t => ({
            x: t.scrollLeft,
            y: t.scrollTop
        }),
        defaultParent: () => {
            if (!ye.current) {
                const t = new zu({});
                t.mount(window), t.setOptions({
                    layoutScroll: !0
                }), ye.current = t
            }
            return ye.current
        },
        resetTransform: (t, e) => {
            t.style.transform = e !== void 0 ? e : "none"
        },
        checkIsScrollRoot: t => window.getComputedStyle(t).position === "fixed"
    }),
    _u = {
        pan: {
            Feature: hu
        },
        drag: {
            Feature: cu,
            ProjectionNode: xr,
            MeasureLayout: hr
        }
    };

function js(t, e, n) {
    const {
        props: s
    } = t;
    t.animationState && s.whileHover && t.animationState.setActive("whileHover", n === "Start");
    const i = "onHover" + n,
        o = s[i];
    o && C.postRender(() => o(e, Nt(e)))
}
class Xu extends et {
    mount() {
        const {
            current: e
        } = this.node;
        e && (this.unmount = ma(e, (n, s) => (js(this.node, s, "Start"), i => js(this.node, i, "End"))))
    }
    unmount() {}
}
class Yu extends et {
    constructor() {
        super(...arguments), this.isActive = !1
    }
    onFocus() {
        let e = !1;
        try {
            e = this.node.current.matches(":focus-visible")
        } catch {
            e = !0
        }!e || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !0), this.isActive = !0)
    }
    onBlur() {
        !this.isActive || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !1), this.isActive = !1)
    }
    mount() {
        this.unmount = Bt(It(this.node.current, "focus", () => this.onFocus()), It(this.node.current, "blur", () => this.onBlur()))
    }
    unmount() {}
}

function Os(t, e, n) {
    const {
        props: s
    } = t;
    if (t.current instanceof HTMLButtonElement && t.current.disabled) return;
    t.animationState && s.whileTap && t.animationState.setActive("whileTap", n === "Start");
    const i = "onTap" + (n === "End" ? "" : n),
        o = s[i];
    o && C.postRender(() => o(e, Nt(e)))
}
class qu extends et {
    mount() {
        const {
            current: e
        } = this.node;
        e && (this.unmount = va(e, (n, s) => (Os(this.node, s, "Start"), (i, {
            success: o
        }) => Os(this.node, i, o ? "End" : "Cancel")), {
            useGlobalTarget: this.node.props.globalTapTarget
        }))
    }
    unmount() {}
}
const Ne = new WeakMap,
    ve = new WeakMap,
    Zu = t => {
        const e = Ne.get(t.target);
        e && e(t)
    },
    Ju = t => {
        t.forEach(Zu)
    };

function Qu({
    root: t,
    ...e
}) {
    const n = t || document;
    ve.has(n) || ve.set(n, {});
    const s = ve.get(n),
        i = JSON.stringify(e);
    return s[i] || (s[i] = new IntersectionObserver(Ju, {
        root: t,
        ...e
    })), s[i]
}

function tc(t, e, n) {
    const s = Qu(e);
    return Ne.set(t, n), s.observe(t), () => {
        Ne.delete(t), s.unobserve(t)
    }
}
const ec = {
    some: 0,
    all: 1
};
class nc extends et {
    constructor() {
        super(...arguments), this.hasEnteredView = !1, this.isInView = !1
    }
    startObserver() {
        this.unmount();
        const {
            viewport: e = {}
        } = this.node.getProps(), {
            root: n,
            margin: s,
            amount: i = "some",
            once: o
        } = e, r = {
            root: n ? n.current : void 0,
            rootMargin: s,
            threshold: typeof i == "number" ? i : ec[i]
        }, a = l => {
            const {
                isIntersecting: c
            } = l;
            if (this.isInView === c || (this.isInView = c, o && !c && this.hasEnteredView)) return;
            c && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", c);
            const {
                onViewportEnter: u,
                onViewportLeave: h
            } = this.node.getProps(), f = c ? u : h;
            f && f(l)
        };
        return tc(this.node.current, r, a)
    }
    mount() {
        this.startObserver()
    }
    update() {
        if (typeof IntersectionObserver > "u") return;
        const {
            props: e,
            prevProps: n
        } = this.node;
        ["amount", "margin", "root"].some(sc(e, n)) && this.startObserver()
    }
    unmount() {}
}

function sc({
    viewport: t = {}
}, {
    viewport: e = {}
} = {}) {
    return n => t[n] !== e[n]
}
const ic = {
        inView: {
            Feature: nc
        },
        tap: {
            Feature: qu
        },
        focus: {
            Feature: Yu
        },
        hover: {
            Feature: Xu
        }
    },
    rc = {
        layout: {
            ProjectionNode: xr,
            MeasureLayout: hr
        }
    },
    oc = { ...Gl,
        ...ic,
        ..._u,
        ...rc
    },
    Tr = ol(oc, xl);

function xn(t) {
    const e = tt(() => ut(t)),
        {
            isStatic: n
        } = p.useContext(ct);
    if (n) {
        const [, s] = p.useState(t);
        p.useEffect(() => e.on("change", s), [])
    }
    return e
}

function Tn(t, e) {
    const n = xn(e()),
        s = () => n.set(e());
    return s(), We(() => {
        const i = () => C.preRender(s, !1, !0),
            o = t.map(r => r.on("change", i));
        return () => {
            o.forEach(r => r()), q(s)
        }
    }), n
}

function vc(t, ...e) {
    const n = t.length;

    function s() {
        let i = "";
        for (let o = 0; o < n; o++) {
            i += t[o];
            const r = e[o];
            r && (i += E(r) ? r.get() : r)
        }
        return i
    }
    return Tn(e.filter(E), s)
}

function ac(t) {
    Vt.current = [], t();
    const e = Tn(Vt.current, t);
    return Vt.current = void 0, e
}

function Pr(t, e, n, s) {
    if (typeof t == "function") return ac(t);
    const i = typeof e == "function" ? e : Ta(e, n, s);
    return Array.isArray(t) ? Ns(t, i) : Ns([t], ([o]) => i(o))
}

function Ns(t, e) {
    const n = tt(() => []);
    return Tn(t, () => {
        n.length = 0;
        const s = t.length;
        for (let i = 0; i < s; i++) n[i] = t[i].get();
        return e(n)
    })
}

function xc(t, e = {}) {
    const {
        isStatic: n
    } = p.useContext(ct), s = () => E(t) ? t.get() : t;
    if (n) return Pr(s);
    const i = xn(s());
    return p.useInsertionEffect(() => Pa(i, t, e), [i, JSON.stringify(e)]), i
}
const Sr = p.createContext(null);

function lc(t, e, n, s) {
    if (!s) return t;
    const i = t.findIndex(u => u.value === e);
    if (i === -1) return t;
    const o = s > 0 ? 1 : -1,
        r = t[i + o];
    if (!r) return t;
    const a = t[i],
        l = r.layout,
        c = M(l.min, l.max, .5);
    return o === 1 && a.layout.max + n > c || o === -1 && a.layout.min + n < c ? wr(t, i, i + o) : t
}

function uc({
    children: t,
    as: e = "ul",
    axis: n = "y",
    onReorder: s,
    values: i,
    ...o
}, r) {
    const a = tt(() => Tr[e]),
        l = [],
        c = p.useRef(!1),
        u = {
            axis: n,
            registerItem: (h, f) => {
                const d = l.findIndex(m => h === m.value);
                d !== -1 ? l[d].layout = f[n] : l.push({
                    value: h,
                    layout: f[n]
                }), l.sort(hc)
            },
            updateOrder: (h, f, d) => {
                if (c.current) return;
                const m = lc(l, h, f, d);
                l !== m && (c.current = !0, s(m.map(cc).filter(g => i.indexOf(g) !== -1)))
            }
        };
    return p.useEffect(() => {
        c.current = !1
    }), N.jsx(a, { ...o,
        ref: r,
        ignoreStrict: !0,
        children: N.jsx(Sr.Provider, {
            value: u,
            children: t
        })
    })
}
const Tc = p.forwardRef(uc);

function cc(t) {
    return t.value
}

function hc(t, e) {
    return t.layout.min - e.layout.min
}

function Us(t, e = 0) {
    return E(t) ? t : xn(e)
}

function fc({
    children: t,
    style: e = {},
    value: n,
    as: s = "li",
    onDrag: i,
    layout: o = !0,
    ...r
}, a) {
    const l = tt(() => Tr[s]),
        c = p.useContext(Sr),
        u = {
            x: Us(e.x),
            y: Us(e.y)
        },
        h = Pr([u.x, u.y], ([g, v]) => g || v ? 1 : "unset"),
        {
            axis: f,
            registerItem: d,
            updateOrder: m
        } = c;
    return N.jsx(l, {
        drag: f,
        ...r,
        dragSnapToOrigin: !0,
        style: { ...e,
            x: u.x,
            y: u.y,
            zIndex: h
        },
        layout: o,
        onDrag: (g, v) => {
            const {
                velocity: y
            } = v;
            y[f] && m(n, u[f].get(), y[f]), i && i(g, v)
        },
        onLayoutMeasure: g => d(n, g),
        ref: a,
        ignoreStrict: !0,
        children: t
    })
}
const Pc = p.forwardRef(fc);
export {
    pc as A, gc as M, Tc as R, vc as a, xc as b, Pr as c, Pc as d, Tr as m, xn as u
};