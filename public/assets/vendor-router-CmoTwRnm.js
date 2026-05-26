import {
    r as i
} from "./vendor-react-BfU3Zn2J.js";
/**
 * react-router v7.9.6
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
var ue = "popstate";

function $e(e = {}) {
    function t(n, a) {
        let {
            pathname: o,
            search: l,
            hash: s
        } = n.location;
        return q("", {
            pathname: o,
            search: l,
            hash: s
        }, a.state && a.state.usr || null, a.state && a.state.key || "default")
    }

    function r(n, a) {
        return typeof a == "string" ? a : A(a)
    }
    return Ne(t, r, null, e)
}

function E(e, t) {
    if (e === !1 || e === null || typeof e > "u") throw new Error(t)
}

function x(e, t) {
    if (!e) {
        typeof console < "u" && console.warn(t);
        try {
            throw new Error(t)
        } catch {}
    }
}

function Fe() {
    return Math.random().toString(36).substring(2, 10)
}

function se(e, t) {
    return {
        usr: e.state,
        key: e.key,
        idx: t
    }
}

function q(e, t, r = null, n) {
    return {
        pathname: typeof e == "string" ? e : e.pathname,
        search: "",
        hash: "",
        ...typeof t == "string" ? I(t) : t,
        state: r,
        key: t && t.key || n || Fe()
    }
}

function A({
    pathname: e = "/",
    search: t = "",
    hash: r = ""
}) {
    return t && t !== "?" && (e += t.charAt(0) === "?" ? t : "?" + t), r && r !== "#" && (e += r.charAt(0) === "#" ? r : "#" + r), e
}

function I(e) {
    let t = {};
    if (e) {
        let r = e.indexOf("#");
        r >= 0 && (t.hash = e.substring(r), e = e.substring(0, r));
        let n = e.indexOf("?");
        n >= 0 && (t.search = e.substring(n), e = e.substring(0, n)), e && (t.pathname = e)
    }
    return t
}

function Ne(e, t, r, n = {}) {
    let {
        window: a = document.defaultView,
        v5Compat: o = !1
    } = n, l = a.history, s = "POP", u = null, c = f();
    c == null && (c = 0, l.replaceState({ ...l.state,
        idx: c
    }, ""));

    function f() {
        return (l.state || {
            idx: null
        }).idx
    }

    function h() {
        s = "POP";
        let d = f(),
            m = d == null ? null : d - c;
        c = d, u && u({
            action: s,
            location: w.location,
            delta: m
        })
    }

    function y(d, m) {
        s = "PUSH";
        let p = q(w.location, d, m);
        c = f() + 1;
        let R = se(p, c),
            C = w.createHref(p);
        try {
            l.pushState(R, "", C)
        } catch (b) {
            if (b instanceof DOMException && b.name === "DataCloneError") throw b;
            a.location.assign(C)
        }
        o && u && u({
            action: s,
            location: w.location,
            delta: 1
        })
    }

    function g(d, m) {
        s = "REPLACE";
        let p = q(w.location, d, m);
        c = f();
        let R = se(p, c),
            C = w.createHref(p);
        l.replaceState(R, "", C), o && u && u({
            action: s,
            location: w.location,
            delta: 0
        })
    }

    function v(d) {
        return Ie(d)
    }
    let w = {
        get action() {
            return s
        },
        get location() {
            return e(a, l)
        },
        listen(d) {
            if (u) throw new Error("A history only accepts one active listener");
            return a.addEventListener(ue, h), u = d, () => {
                a.removeEventListener(ue, h), u = null
            }
        },
        createHref(d) {
            return t(a, d)
        },
        createURL: v,
        encodeLocation(d) {
            let m = v(d);
            return {
                pathname: m.pathname,
                search: m.search,
                hash: m.hash
            }
        },
        push: y,
        replace: g,
        go(d) {
            return l.go(d)
        }
    };
    return w
}

function Ie(e, t = !1) {
    let r = "http://localhost";
    typeof window < "u" && (r = window.location.origin !== "null" ? window.location.origin : window.location.href), E(r, "No window.location.(origin|href) available to create URL");
    let n = typeof e == "string" ? e : A(e);
    return n = n.replace(/ $/, "%20"), !t && n.startsWith("//") && (n = r + n), new URL(n, r)
}

function pe(e, t, r = "/") {
    return Te(e, t, r, !1)
}

function Te(e, t, r, n) {
    let a = typeof t == "string" ? I(t) : t,
        o = $(a.pathname || "/", r);
    if (o == null) return null;
    let l = me(e);
    Be(l);
    let s = null;
    for (let u = 0; s == null && u < l.length; ++u) {
        let c = Ve(o);
        s = ze(l[u], c, n)
    }
    return s
}

function me(e, t = [], r = [], n = "", a = !1) {
    let o = (l, s, u = a, c) => {
        let f = {
            relativePath: c === void 0 ? l.path || "" : c,
            caseSensitive: l.caseSensitive === !0,
            childrenIndex: s,
            route: l
        };
        if (f.relativePath.startsWith("/")) {
            if (!f.relativePath.startsWith(n) && u) return;
            E(f.relativePath.startsWith(n), `Absolute route path "${f.relativePath}" nested under path "${n}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`), f.relativePath = f.relativePath.slice(n.length)
        }
        let h = k([n, f.relativePath]),
            y = r.concat(f);
        l.children && l.children.length > 0 && (E(l.index !== !0, `Index routes must not have child routes. Please remove all child routes from route path "${h}".`), me(l.children, t, y, h, u)), !(l.path == null && !l.index) && t.push({
            path: h,
            score: He(h, l.index),
            routesMeta: y
        })
    };
    return e.forEach((l, s) => {
        if (l.path === "" || !l.path ?.includes("?")) o(l, s);
        else
            for (let u of ye(l.path)) o(l, s, !0, u)
    }), t
}

function ye(e) {
    let t = e.split("/");
    if (t.length === 0) return [];
    let [r, ...n] = t, a = r.endsWith("?"), o = r.replace(/\?$/, "");
    if (n.length === 0) return a ? [o, ""] : [o];
    let l = ye(n.join("/")),
        s = [];
    return s.push(...l.map(u => u === "" ? o : [o, u].join("/"))), a && s.push(...l), s.map(u => e.startsWith("/") && u === "" ? "/" : u)
}

function Be(e) {
    e.sort((t, r) => t.score !== r.score ? r.score - t.score : _e(t.routesMeta.map(n => n.childrenIndex), r.routesMeta.map(n => n.childrenIndex)))
}
var De = /^:[\w-]+$/,
    Me = 3,
    Ae = 2,
    Oe = 1,
    Ue = 10,
    We = -2,
    ce = e => e === "*";

function He(e, t) {
    let r = e.split("/"),
        n = r.length;
    return r.some(ce) && (n += We), t && (n += Ae), r.filter(a => !ce(a)).reduce((a, o) => a + (De.test(o) ? Me : o === "" ? Oe : Ue), n)
}

function _e(e, t) {
    return e.length === t.length && e.slice(0, -1).every((n, a) => n === t[a]) ? e[e.length - 1] - t[t.length - 1] : 0
}

function ze(e, t, r = !1) {
    let {
        routesMeta: n
    } = e, a = {}, o = "/", l = [];
    for (let s = 0; s < n.length; ++s) {
        let u = n[s],
            c = s === n.length - 1,
            f = o === "/" ? t : t.slice(o.length) || "/",
            h = V({
                path: u.relativePath,
                caseSensitive: u.caseSensitive,
                end: c
            }, f),
            y = u.route;
        if (!h && c && r && !n[n.length - 1].route.index && (h = V({
                path: u.relativePath,
                caseSensitive: u.caseSensitive,
                end: !1
            }, f)), !h) return null;
        Object.assign(a, h.params), l.push({
            params: a,
            pathname: k([o, h.pathname]),
            pathnameBase: qe(k([o, h.pathnameBase])),
            route: y
        }), h.pathnameBase !== "/" && (o = k([o, h.pathnameBase]))
    }
    return l
}

function V(e, t) {
    typeof e == "string" && (e = {
        path: e,
        caseSensitive: !1,
        end: !0
    });
    let [r, n] = je(e.path, e.caseSensitive, e.end), a = t.match(r);
    if (!a) return null;
    let o = a[0],
        l = o.replace(/(.)\/+$/, "$1"),
        s = a.slice(1);
    return {
        params: n.reduce((c, {
            paramName: f,
            isOptional: h
        }, y) => {
            if (f === "*") {
                let v = s[y] || "";
                l = o.slice(0, o.length - v.length).replace(/(.)\/+$/, "$1")
            }
            const g = s[y];
            return h && !g ? c[f] = void 0 : c[f] = (g || "").replace(/%2F/g, "/"), c
        }, {}),
        pathname: o,
        pathnameBase: l,
        pattern: e
    }
}

function je(e, t = !1, r = !0) {
    x(e === "*" || !e.endsWith("*") || e.endsWith("/*"), `Route path "${e}" will be treated as if it were "${e.replace(/\*$/,"/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${e.replace(/\*$/,"/*")}".`);
    let n = [],
        a = "^" + e.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(/\/:([\w-]+)(\?)?/g, (l, s, u) => (n.push({
            paramName: s,
            isOptional: u != null
        }), u ? "/?([^\\/]+)?" : "/([^\\/]+)")).replace(/\/([\w-]+)\?(\/|$)/g, "(/$1)?$2");
    return e.endsWith("*") ? (n.push({
        paramName: "*"
    }), a += e === "*" || e === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$") : r ? a += "\\/*$" : e !== "" && e !== "/" && (a += "(?:(?=\\/|$))"), [new RegExp(a, t ? void 0 : "i"), n]
}

function Ve(e) {
    try {
        return e.split("/").map(t => decodeURIComponent(t).replace(/\//g, "%2F")).join("/")
    } catch (t) {
        return x(!1, `The URL path "${e}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${t}).`), e
    }
}

function $(e, t) {
    if (t === "/") return e;
    if (!e.toLowerCase().startsWith(t.toLowerCase())) return null;
    let r = t.endsWith("/") ? t.length - 1 : t.length,
        n = e.charAt(r);
    return n && n !== "/" ? null : e.slice(r) || "/"
}
var Je = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
    Ke = e => Je.test(e);

function Ye(e, t = "/") {
    let {
        pathname: r,
        search: n = "",
        hash: a = ""
    } = typeof e == "string" ? I(e) : e, o;
    if (r)
        if (Ke(r)) o = r;
        else {
            if (r.includes("//")) {
                let l = r;
                r = r.replace(/\/\/+/g, "/"), x(!1, `Pathnames cannot have embedded double slashes - normalizing ${l} -> ${r}`)
            }
            r.startsWith("/") ? o = fe(r.substring(1), "/") : o = fe(r, t)
        }
    else o = t;
    return {
        pathname: o,
        search: Xe(n),
        hash: Qe(a)
    }
}

function fe(e, t) {
    let r = t.replace(/\/+$/, "").split("/");
    return e.split("/").forEach(a => {
        a === ".." ? r.length > 1 && r.pop() : a !== "." && r.push(a)
    }), r.length > 1 ? r.join("/") : "/"
}

function Y(e, t, r, n) {
    return `Cannot include a '${e}' character in a manually specified \`to.${t}\` field [${JSON.stringify(n)}].  Please separate it out to the \`to.${r}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`
}

function Ge(e) {
    return e.filter((t, r) => r === 0 || t.route.path && t.route.path.length > 0)
}

function Z(e) {
    let t = Ge(e);
    return t.map((r, n) => n === t.length - 1 ? r.pathname : r.pathnameBase)
}

function ee(e, t, r, n = !1) {
    let a;
    typeof e == "string" ? a = I(e) : (a = { ...e
    }, E(!a.pathname || !a.pathname.includes("?"), Y("?", "pathname", "search", a)), E(!a.pathname || !a.pathname.includes("#"), Y("#", "pathname", "hash", a)), E(!a.search || !a.search.includes("#"), Y("#", "search", "hash", a)));
    let o = e === "" || a.pathname === "",
        l = o ? "/" : a.pathname,
        s;
    if (l == null) s = r;
    else {
        let h = t.length - 1;
        if (!n && l.startsWith("..")) {
            let y = l.split("/");
            for (; y[0] === "..";) y.shift(), h -= 1;
            a.pathname = y.join("/")
        }
        s = h >= 0 ? t[h] : "/"
    }
    let u = Ye(a, s),
        c = l && l !== "/" && l.endsWith("/"),
        f = (o || l === ".") && r.endsWith("/");
    return !u.pathname.endsWith("/") && (c || f) && (u.pathname += "/"), u
}
var k = e => e.join("/").replace(/\/\/+/g, "/"),
    qe = e => e.replace(/\/+$/, "").replace(/^\/*/, "/"),
    Xe = e => !e || e === "?" ? "" : e.startsWith("?") ? e : "?" + e,
    Qe = e => !e || e === "#" ? "" : e.startsWith("#") ? e : "#" + e;

function Ze(e) {
    return e != null && typeof e.status == "number" && typeof e.statusText == "string" && typeof e.internal == "boolean" && "data" in e
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
var ge = ["POST", "PUT", "PATCH", "DELETE"];
new Set(ge);
var et = ["GET", ...ge];
new Set(et);
var T = i.createContext(null);
T.displayName = "DataRouter";
var J = i.createContext(null);
J.displayName = "DataRouterState";
i.createContext(!1);
var ve = i.createContext({
    isTransitioning: !1
});
ve.displayName = "ViewTransition";
var tt = i.createContext(new Map);
tt.displayName = "Fetchers";
var rt = i.createContext(null);
rt.displayName = "Await";
var S = i.createContext(null);
S.displayName = "Navigation";
var O = i.createContext(null);
O.displayName = "Location";
var L = i.createContext({
    outlet: null,
    matches: [],
    isDataRoute: !1
});
L.displayName = "Route";
var te = i.createContext(null);
te.displayName = "RouteError";

function nt(e, {
    relative: t
} = {}) {
    E(B(), "useHref() may be used only in the context of a <Router> component.");
    let {
        basename: r,
        navigator: n
    } = i.useContext(S), {
        hash: a,
        pathname: o,
        search: l
    } = U(e, {
        relative: t
    }), s = o;
    return r !== "/" && (s = o === "/" ? r : k([r, o])), n.createHref({
        pathname: s,
        search: l,
        hash: a
    })
}

function B() {
    return i.useContext(O) != null
}

function F() {
    return E(B(), "useLocation() may be used only in the context of a <Router> component."), i.useContext(O).location
}
var we = "You should call navigate() in a React.useEffect(), not when your component is first rendered.";

function Re(e) {
    i.useContext(S).static || i.useLayoutEffect(e)
}

function re() {
    let {
        isDataRoute: e
    } = i.useContext(L);
    return e ? yt() : at()
}

function at() {
    E(B(), "useNavigate() may be used only in the context of a <Router> component.");
    let e = i.useContext(T),
        {
            basename: t,
            navigator: r
        } = i.useContext(S),
        {
            matches: n
        } = i.useContext(L),
        {
            pathname: a
        } = F(),
        o = JSON.stringify(Z(n)),
        l = i.useRef(!1);
    return Re(() => {
        l.current = !0
    }), i.useCallback((u, c = {}) => {
        if (x(l.current, we), !l.current) return;
        if (typeof u == "number") {
            r.go(u);
            return
        }
        let f = ee(u, JSON.parse(o), a, c.relative === "path");
        e == null && t !== "/" && (f.pathname = f.pathname === "/" ? t : k([t, f.pathname])), (c.replace ? r.replace : r.push)(f, c.state, c)
    }, [t, r, o, a, e])
}
i.createContext(null);

function Zt() {
    let {
        matches: e
    } = i.useContext(L), t = e[e.length - 1];
    return t ? t.params : {}
}

function U(e, {
    relative: t
} = {}) {
    let {
        matches: r
    } = i.useContext(L), {
        pathname: n
    } = F(), a = JSON.stringify(Z(r));
    return i.useMemo(() => ee(e, JSON.parse(a), n, t === "path"), [e, a, n, t])
}

function ot(e, t) {
    return Ee(e, t)
}

function Ee(e, t, r, n, a) {
    E(B(), "useRoutes() may be used only in the context of a <Router> component.");
    let {
        navigator: o
    } = i.useContext(S), {
        matches: l
    } = i.useContext(L), s = l[l.length - 1], u = s ? s.params : {}, c = s ? s.pathname : "/", f = s ? s.pathnameBase : "/", h = s && s.route; {
        let p = h && h.path || "";
        xe(c, !h || p.endsWith("*") || p.endsWith("*?"), `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${c}" (under <Route path="${p}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${p}"> to <Route path="${p==="/"?"*":`${p}/*`}">.`)
    }
    let y = F(),
        g;
    if (t) {
        let p = typeof t == "string" ? I(t) : t;
        E(f === "/" || p.pathname ?.startsWith(f), `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${f}" but pathname "${p.pathname}" was given in the \`location\` prop.`), g = p
    } else g = y;
    let v = g.pathname || "/",
        w = v;
    if (f !== "/") {
        let p = f.replace(/^\//, "").split("/");
        w = "/" + v.replace(/^\//, "").split("/").slice(p.length).join("/")
    }
    let d = pe(e, {
        pathname: w
    });
    x(h || d != null, `No routes matched location "${g.pathname}${g.search}${g.hash}" `), x(d == null || d[d.length - 1].route.element !== void 0 || d[d.length - 1].route.Component !== void 0 || d[d.length - 1].route.lazy !== void 0, `Matched leaf route at location "${g.pathname}${g.search}${g.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`);
    let m = ct(d && d.map(p => Object.assign({}, p, {
        params: Object.assign({}, u, p.params),
        pathname: k([f, o.encodeLocation ? o.encodeLocation(p.pathname.replace(/\?/g, "%3F").replace(/#/g, "%23")).pathname : p.pathname]),
        pathnameBase: p.pathnameBase === "/" ? f : k([f, o.encodeLocation ? o.encodeLocation(p.pathnameBase.replace(/\?/g, "%3F").replace(/#/g, "%23")).pathname : p.pathnameBase])
    })), l, r, n, a);
    return t && m ? i.createElement(O.Provider, {
        value: {
            location: {
                pathname: "/",
                search: "",
                hash: "",
                state: null,
                key: "default",
                ...g
            },
            navigationType: "POP"
        }
    }, m) : m
}

function lt() {
    let e = mt(),
        t = Ze(e) ? `${e.status} ${e.statusText}` : e instanceof Error ? e.message : JSON.stringify(e),
        r = e instanceof Error ? e.stack : null,
        n = "rgba(200,200,200, 0.5)",
        a = {
            padding: "0.5rem",
            backgroundColor: n
        },
        o = {
            padding: "2px 4px",
            backgroundColor: n
        },
        l = null;
    return console.error("Error handled by React Router default ErrorBoundary:", e), l = i.createElement(i.Fragment, null, i.createElement("p", null, "💿 Hey developer 👋"), i.createElement("p", null, "You can provide a way better UX than this when your app throws errors by providing your own ", i.createElement("code", {
        style: o
    }, "ErrorBoundary"), " or", " ", i.createElement("code", {
        style: o
    }, "errorElement"), " prop on your route.")), i.createElement(i.Fragment, null, i.createElement("h2", null, "Unexpected Application Error!"), i.createElement("h3", {
        style: {
            fontStyle: "italic"
        }
    }, t), r ? i.createElement("pre", {
        style: a
    }, r) : null, l)
}
var it = i.createElement(lt, null),
    ut = class extends i.Component {
        constructor(e) {
            super(e), this.state = {
                location: e.location,
                revalidation: e.revalidation,
                error: e.error
            }
        }
        static getDerivedStateFromError(e) {
            return {
                error: e
            }
        }
        static getDerivedStateFromProps(e, t) {
            return t.location !== e.location || t.revalidation !== "idle" && e.revalidation === "idle" ? {
                error: e.error,
                location: e.location,
                revalidation: e.revalidation
            } : {
                error: e.error !== void 0 ? e.error : t.error,
                location: t.location,
                revalidation: e.revalidation || t.revalidation
            }
        }
        componentDidCatch(e, t) {
            this.props.onError ? this.props.onError(e, t) : console.error("React Router caught the following error during render", e)
        }
        render() {
            return this.state.error !== void 0 ? i.createElement(L.Provider, {
                value: this.props.routeContext
            }, i.createElement(te.Provider, {
                value: this.state.error,
                children: this.props.component
            })) : this.props.children
        }
    };

function st({
    routeContext: e,
    match: t,
    children: r
}) {
    let n = i.useContext(T);
    return n && n.static && n.staticContext && (t.route.errorElement || t.route.ErrorBoundary) && (n.staticContext._deepestRenderedBoundaryId = t.route.id), i.createElement(L.Provider, {
        value: e
    }, r)
}

function ct(e, t = [], r = null, n = null, a = null) {
    if (e == null) {
        if (!r) return null;
        if (r.errors) e = r.matches;
        else if (t.length === 0 && !r.initialized && r.matches.length > 0) e = r.matches;
        else return null
    }
    let o = e,
        l = r ?.errors;
    if (l != null) {
        let f = o.findIndex(h => h.route.id && l ?.[h.route.id] !== void 0);
        E(f >= 0, `Could not find a matching route for errors on route IDs: ${Object.keys(l).join(",")}`), o = o.slice(0, Math.min(o.length, f + 1))
    }
    let s = !1,
        u = -1;
    if (r)
        for (let f = 0; f < o.length; f++) {
            let h = o[f];
            if ((h.route.HydrateFallback || h.route.hydrateFallbackElement) && (u = f), h.route.id) {
                let {
                    loaderData: y,
                    errors: g
                } = r, v = h.route.loader && !y.hasOwnProperty(h.route.id) && (!g || g[h.route.id] === void 0);
                if (h.route.lazy || v) {
                    s = !0, u >= 0 ? o = o.slice(0, u + 1) : o = [o[0]];
                    break
                }
            }
        }
    let c = r && n ? (f, h) => {
        n(f, {
            location: r.location,
            params: r.matches ?.[0] ?.params ?? {},
            errorInfo: h
        })
    } : void 0;
    return o.reduceRight((f, h, y) => {
        let g, v = !1,
            w = null,
            d = null;
        r && (g = l && h.route.id ? l[h.route.id] : void 0, w = h.route.errorElement || it, s && (u < 0 && y === 0 ? (xe("route-fallback", !1, "No `HydrateFallback` element provided to render during initial hydration"), v = !0, d = null) : u === y && (v = !0, d = h.route.hydrateFallbackElement || null)));
        let m = t.concat(o.slice(0, y + 1)),
            p = () => {
                let R;
                return g ? R = w : v ? R = d : h.route.Component ? R = i.createElement(h.route.Component, null) : h.route.element ? R = h.route.element : R = f, i.createElement(st, {
                    match: h,
                    routeContext: {
                        outlet: f,
                        matches: m,
                        isDataRoute: r != null
                    },
                    children: R
                })
            };
        return r && (h.route.ErrorBoundary || h.route.errorElement || y === 0) ? i.createElement(ut, {
            location: r.location,
            revalidation: r.revalidation,
            component: w,
            error: g,
            children: p(),
            routeContext: {
                outlet: null,
                matches: m,
                isDataRoute: !0
            },
            onError: c
        }) : p()
    }, null)
}

function ne(e) {
    return `${e} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`
}

function ft(e) {
    let t = i.useContext(T);
    return E(t, ne(e)), t
}

function ht(e) {
    let t = i.useContext(J);
    return E(t, ne(e)), t
}

function dt(e) {
    let t = i.useContext(L);
    return E(t, ne(e)), t
}

function ae(e) {
    let t = dt(e),
        r = t.matches[t.matches.length - 1];
    return E(r.route.id, `${e} can only be used on routes that contain a unique "id"`), r.route.id
}

function pt() {
    return ae("useRouteId")
}

function mt() {
    let e = i.useContext(te),
        t = ht("useRouteError"),
        r = ae("useRouteError");
    return e !== void 0 ? e : t.errors ?.[r]
}

function yt() {
    let {
        router: e
    } = ft("useNavigate"), t = ae("useNavigate"), r = i.useRef(!1);
    return Re(() => {
        r.current = !0
    }), i.useCallback(async (a, o = {}) => {
        x(r.current, we), r.current && (typeof a == "number" ? e.navigate(a) : await e.navigate(a, {
            fromRouteId: t,
            ...o
        }))
    }, [e, t])
}
var he = {};

function xe(e, t, r) {
    !t && !he[e] && (he[e] = !0, x(!1, r))
}
i.memo(gt);

function gt({
    routes: e,
    future: t,
    state: r,
    unstable_onError: n
}) {
    return Ee(e, void 0, r, n, t)
}

function er({
    to: e,
    replace: t,
    state: r,
    relative: n
}) {
    E(B(), "<Navigate> may be used only in the context of a <Router> component.");
    let {
        static: a
    } = i.useContext(S);
    x(!a, "<Navigate> must not be used on the initial render in a <StaticRouter>. This is a no-op, but you should modify your code so the <Navigate> is only ever rendered in response to some user interaction or state change.");
    let {
        matches: o
    } = i.useContext(L), {
        pathname: l
    } = F(), s = re(), u = ee(e, Z(o), l, n === "path"), c = JSON.stringify(u);
    return i.useEffect(() => {
        s(JSON.parse(c), {
            replace: t,
            state: r,
            relative: n
        })
    }, [s, c, n, t, r]), null
}

function vt(e) {
    E(!1, "A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.")
}

function wt({
    basename: e = "/",
    children: t = null,
    location: r,
    navigationType: n = "POP",
    navigator: a,
    static: o = !1
}) {
    E(!B(), "You cannot render a <Router> inside another <Router>. You should never have more than one in your app.");
    let l = e.replace(/^\/*/, "/"),
        s = i.useMemo(() => ({
            basename: l,
            navigator: a,
            static: o,
            future: {}
        }), [l, a, o]);
    typeof r == "string" && (r = I(r));
    let {
        pathname: u = "/",
        search: c = "",
        hash: f = "",
        state: h = null,
        key: y = "default"
    } = r, g = i.useMemo(() => {
        let v = $(u, l);
        return v == null ? null : {
            location: {
                pathname: v,
                search: c,
                hash: f,
                state: h,
                key: y
            },
            navigationType: n
        }
    }, [l, u, c, f, h, y, n]);
    return x(g != null, `<Router basename="${l}"> is not able to match the URL "${u}${c}${f}" because it does not start with the basename, so the <Router> won't render anything.`), g == null ? null : i.createElement(S.Provider, {
        value: s
    }, i.createElement(O.Provider, {
        children: t,
        value: g
    }))
}

function tr({
    children: e,
    location: t
}) {
    return ot(X(e), t)
}

function X(e, t = []) {
    let r = [];
    return i.Children.forEach(e, (n, a) => {
        if (!i.isValidElement(n)) return;
        let o = [...t, a];
        if (n.type === i.Fragment) {
            r.push.apply(r, X(n.props.children, o));
            return
        }
        E(n.type === vt, `[${typeof n.type=="string"?n.type:n.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`), E(!n.props.index || !n.props.children, "An index route cannot have child routes.");
        let l = {
            id: n.props.id || o.join("-"),
            caseSensitive: n.props.caseSensitive,
            element: n.props.element,
            Component: n.props.Component,
            index: n.props.index,
            path: n.props.path,
            middleware: n.props.middleware,
            loader: n.props.loader,
            action: n.props.action,
            hydrateFallbackElement: n.props.hydrateFallbackElement,
            HydrateFallback: n.props.HydrateFallback,
            errorElement: n.props.errorElement,
            ErrorBoundary: n.props.ErrorBoundary,
            hasErrorBoundary: n.props.hasErrorBoundary === !0 || n.props.ErrorBoundary != null || n.props.errorElement != null,
            shouldRevalidate: n.props.shouldRevalidate,
            handle: n.props.handle,
            lazy: n.props.lazy
        };
        n.props.children && (l.children = X(n.props.children, o)), r.push(l)
    }), r
}
var z = "get",
    j = "application/x-www-form-urlencoded";

function K(e) {
    return e != null && typeof e.tagName == "string"
}

function Rt(e) {
    return K(e) && e.tagName.toLowerCase() === "button"
}

function Et(e) {
    return K(e) && e.tagName.toLowerCase() === "form"
}

function xt(e) {
    return K(e) && e.tagName.toLowerCase() === "input"
}

function Ct(e) {
    return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
}

function bt(e, t) {
    return e.button === 0 && (!t || t === "_self") && !Ct(e)
}

function Q(e = "") {
    return new URLSearchParams(typeof e == "string" || Array.isArray(e) || e instanceof URLSearchParams ? e : Object.keys(e).reduce((t, r) => {
        let n = e[r];
        return t.concat(Array.isArray(n) ? n.map(a => [r, a]) : [
            [r, n]
        ])
    }, []))
}

function Pt(e, t) {
    let r = Q(e);
    return t && t.forEach((n, a) => {
        r.has(a) || t.getAll(a).forEach(o => {
            r.append(a, o)
        })
    }), r
}
var _ = null;

function St() {
    if (_ === null) try {
        new FormData(document.createElement("form"), 0), _ = !1
    } catch {
        _ = !0
    }
    return _
}
var Lt = new Set(["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"]);

function G(e) {
    return e != null && !Lt.has(e) ? (x(!1, `"${e}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${j}"`), null) : e
}

function kt(e, t) {
    let r, n, a, o, l;
    if (Et(e)) {
        let s = e.getAttribute("action");
        n = s ? $(s, t) : null, r = e.getAttribute("method") || z, a = G(e.getAttribute("enctype")) || j, o = new FormData(e)
    } else if (Rt(e) || xt(e) && (e.type === "submit" || e.type === "image")) {
        let s = e.form;
        if (s == null) throw new Error('Cannot submit a <button> or <input type="submit"> without a <form>');
        let u = e.getAttribute("formaction") || s.getAttribute("action");
        if (n = u ? $(u, t) : null, r = e.getAttribute("formmethod") || s.getAttribute("method") || z, a = G(e.getAttribute("formenctype")) || G(s.getAttribute("enctype")) || j, o = new FormData(s, e), !St()) {
            let {
                name: c,
                type: f,
                value: h
            } = e;
            if (f === "image") {
                let y = c ? `${c}.` : "";
                o.append(`${y}x`, "0"), o.append(`${y}y`, "0")
            } else c && o.append(c, h)
        }
    } else {
        if (K(e)) throw new Error('Cannot submit element that is not <form>, <button>, or <input type="submit|image">');
        r = z, n = null, a = j, l = e
    }
    return o && a === "text/plain" && (l = o, o = void 0), {
        action: n,
        method: r.toLowerCase(),
        encType: a,
        formData: o,
        body: l
    }
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");

function oe(e, t) {
    if (e === !1 || e === null || typeof e > "u") throw new Error(t)
}

function $t(e, t, r) {
    let n = typeof e == "string" ? new URL(e, typeof window > "u" ? "server://singlefetch/" : window.location.origin) : e;
    return n.pathname === "/" ? n.pathname = `_root.${r}` : t && $(n.pathname, t) === "/" ? n.pathname = `${t.replace(/\/$/,"")}/_root.${r}` : n.pathname = `${n.pathname.replace(/\/$/,"")}.${r}`, n
}
async function Ft(e, t) {
    if (e.id in t) return t[e.id];
    try {
        let r = await
        import (e.module);
        return t[e.id] = r, r
    } catch (r) {
        return console.error(`Error loading route module \`${e.module}\`, reloading page...`), console.error(r), window.__reactRouterContext && window.__reactRouterContext.isSpaMode, window.location.reload(), new Promise(() => {})
    }
}

function Nt(e) {
    return e == null ? !1 : e.href == null ? e.rel === "preload" && typeof e.imageSrcSet == "string" && typeof e.imageSizes == "string" : typeof e.rel == "string" && typeof e.href == "string"
}
async function It(e, t, r) {
    let n = await Promise.all(e.map(async a => {
        let o = t.routes[a.route.id];
        if (o) {
            let l = await Ft(o, r);
            return l.links ? l.links() : []
        }
        return []
    }));
    return Mt(n.flat(1).filter(Nt).filter(a => a.rel === "stylesheet" || a.rel === "preload").map(a => a.rel === "stylesheet" ? { ...a,
        rel: "prefetch",
        as: "style"
    } : { ...a,
        rel: "prefetch"
    }))
}

function de(e, t, r, n, a, o) {
    let l = (u, c) => r[c] ? u.route.id !== r[c].route.id : !0,
        s = (u, c) => r[c].pathname !== u.pathname || r[c].route.path ?.endsWith("*") && r[c].params["*"] !== u.params["*"];
    return o === "assets" ? t.filter((u, c) => l(u, c) || s(u, c)) : o === "data" ? t.filter((u, c) => {
        let f = n.routes[u.route.id];
        if (!f || !f.hasLoader) return !1;
        if (l(u, c) || s(u, c)) return !0;
        if (u.route.shouldRevalidate) {
            let h = u.route.shouldRevalidate({
                currentUrl: new URL(a.pathname + a.search + a.hash, window.origin),
                currentParams: r[0] ?.params || {},
                nextUrl: new URL(e, window.origin),
                nextParams: u.params,
                defaultShouldRevalidate: !0
            });
            if (typeof h == "boolean") return h
        }
        return !0
    }) : []
}

function Tt(e, t, {
    includeHydrateFallback: r
} = {}) {
    return Bt(e.map(n => {
        let a = t.routes[n.route.id];
        if (!a) return [];
        let o = [a.module];
        return a.clientActionModule && (o = o.concat(a.clientActionModule)), a.clientLoaderModule && (o = o.concat(a.clientLoaderModule)), r && a.hydrateFallbackModule && (o = o.concat(a.hydrateFallbackModule)), a.imports && (o = o.concat(a.imports)), o
    }).flat(1))
}

function Bt(e) {
    return [...new Set(e)]
}

function Dt(e) {
    let t = {},
        r = Object.keys(e).sort();
    for (let n of r) t[n] = e[n];
    return t
}

function Mt(e, t) {
    let r = new Set;
    return new Set(t), e.reduce((n, a) => {
        let o = JSON.stringify(Dt(a));
        return r.has(o) || (r.add(o), n.push({
            key: o,
            link: a
        })), n
    }, [])
}

function Ce() {
    let e = i.useContext(T);
    return oe(e, "You must render this element inside a <DataRouterContext.Provider> element"), e
}

function At() {
    let e = i.useContext(J);
    return oe(e, "You must render this element inside a <DataRouterStateContext.Provider> element"), e
}
var le = i.createContext(void 0);
le.displayName = "FrameworkContext";

function be() {
    let e = i.useContext(le);
    return oe(e, "You must render this element inside a <HydratedRouter> element"), e
}

function Ot(e, t) {
    let r = i.useContext(le),
        [n, a] = i.useState(!1),
        [o, l] = i.useState(!1),
        {
            onFocus: s,
            onBlur: u,
            onMouseEnter: c,
            onMouseLeave: f,
            onTouchStart: h
        } = t,
        y = i.useRef(null);
    i.useEffect(() => {
        if (e === "render" && l(!0), e === "viewport") {
            let w = m => {
                    m.forEach(p => {
                        l(p.isIntersecting)
                    })
                },
                d = new IntersectionObserver(w, {
                    threshold: .5
                });
            return y.current && d.observe(y.current), () => {
                d.disconnect()
            }
        }
    }, [e]), i.useEffect(() => {
        if (n) {
            let w = setTimeout(() => {
                l(!0)
            }, 100);
            return () => {
                clearTimeout(w)
            }
        }
    }, [n]);
    let g = () => {
            a(!0)
        },
        v = () => {
            a(!1), l(!1)
        };
    return r ? e !== "intent" ? [o, y, {}] : [o, y, {
        onFocus: M(s, g),
        onBlur: M(u, v),
        onMouseEnter: M(c, g),
        onMouseLeave: M(f, v),
        onTouchStart: M(h, g)
    }] : [!1, y, {}]
}

function M(e, t) {
    return r => {
        e && e(r), r.defaultPrevented || t(r)
    }
}

function Ut({
    page: e,
    ...t
}) {
    let {
        router: r
    } = Ce(), n = i.useMemo(() => pe(r.routes, e, r.basename), [r.routes, e, r.basename]);
    return n ? i.createElement(Ht, {
        page: e,
        matches: n,
        ...t
    }) : null
}

function Wt(e) {
    let {
        manifest: t,
        routeModules: r
    } = be(), [n, a] = i.useState([]);
    return i.useEffect(() => {
        let o = !1;
        return It(e, t, r).then(l => {
            o || a(l)
        }), () => {
            o = !0
        }
    }, [e, t, r]), n
}

function Ht({
    page: e,
    matches: t,
    ...r
}) {
    let n = F(),
        {
            manifest: a,
            routeModules: o
        } = be(),
        {
            basename: l
        } = Ce(),
        {
            loaderData: s,
            matches: u
        } = At(),
        c = i.useMemo(() => de(e, t, u, a, n, "data"), [e, t, u, a, n]),
        f = i.useMemo(() => de(e, t, u, a, n, "assets"), [e, t, u, a, n]),
        h = i.useMemo(() => {
            if (e === n.pathname + n.search + n.hash) return [];
            let v = new Set,
                w = !1;
            if (t.forEach(m => {
                    let p = a.routes[m.route.id];
                    !p || !p.hasLoader || (!c.some(R => R.route.id === m.route.id) && m.route.id in s && o[m.route.id] ?.shouldRevalidate || p.hasClientLoader ? w = !0 : v.add(m.route.id))
                }), v.size === 0) return [];
            let d = $t(e, l, "data");
            return w && v.size > 0 && d.searchParams.set("_routes", t.filter(m => v.has(m.route.id)).map(m => m.route.id).join(",")), [d.pathname + d.search]
        }, [l, s, n, a, c, t, e, o]),
        y = i.useMemo(() => Tt(f, a), [f, a]),
        g = Wt(f);
    return i.createElement(i.Fragment, null, h.map(v => i.createElement("link", {
        key: v,
        rel: "prefetch",
        as: "fetch",
        href: v,
        ...r
    })), y.map(v => i.createElement("link", {
        key: v,
        rel: "modulepreload",
        href: v,
        ...r
    })), g.map(({
        key: v,
        link: w
    }) => i.createElement("link", {
        key: v,
        nonce: r.nonce,
        ...w
    })))
}

function _t(...e) {
    return t => {
        e.forEach(r => {
            typeof r == "function" ? r(t) : r != null && (r.current = t)
        })
    }
}
var Pe = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
try {
    Pe && (window.__reactRouterVersion = "7.9.6")
} catch {}

function rr({
    basename: e,
    children: t,
    window: r
}) {
    let n = i.useRef();
    n.current == null && (n.current = $e({
        window: r,
        v5Compat: !0
    }));
    let a = n.current,
        [o, l] = i.useState({
            action: a.action,
            location: a.location
        }),
        s = i.useCallback(u => {
            i.startTransition(() => l(u))
        }, [l]);
    return i.useLayoutEffect(() => a.listen(s), [a, s]), i.createElement(wt, {
        basename: e,
        children: t,
        location: o.location,
        navigationType: o.action,
        navigator: a
    })
}
var Se = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
    Le = i.forwardRef(function({
        onClick: t,
        discover: r = "render",
        prefetch: n = "none",
        relative: a,
        reloadDocument: o,
        replace: l,
        state: s,
        target: u,
        to: c,
        preventScrollReset: f,
        viewTransition: h,
        ...y
    }, g) {
        let {
            basename: v
        } = i.useContext(S), w = typeof c == "string" && Se.test(c), d, m = !1;
        if (typeof c == "string" && w && (d = c, Pe)) try {
            let P = new URL(window.location.href),
                N = c.startsWith("//") ? new URL(P.protocol + c) : new URL(c),
                ie = $(N.pathname, v);
            N.origin === P.origin && ie != null ? c = ie + N.search + N.hash : m = !0
        } catch {
            x(!1, `<Link to="${c}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`)
        }
        let p = nt(c, {
                relative: a
            }),
            [R, C, b] = Ot(n, y),
            W = Jt(c, {
                replace: l,
                state: s,
                target: u,
                preventScrollReset: f,
                relative: a,
                viewTransition: h
            });

        function D(P) {
            t && t(P), P.defaultPrevented || W(P)
        }
        let H = i.createElement("a", { ...y,
            ...b,
            href: d || p,
            onClick: m || o ? t : D,
            ref: _t(g, C),
            target: u,
            "data-discover": !w && r === "render" ? "true" : void 0
        });
        return R && !w ? i.createElement(i.Fragment, null, H, i.createElement(Ut, {
            page: p
        })) : H
    });
Le.displayName = "Link";
var zt = i.forwardRef(function({
    "aria-current": t = "page",
    caseSensitive: r = !1,
    className: n = "",
    end: a = !1,
    style: o,
    to: l,
    viewTransition: s,
    children: u,
    ...c
}, f) {
    let h = U(l, {
            relative: c.relative
        }),
        y = F(),
        g = i.useContext(J),
        {
            navigator: v,
            basename: w
        } = i.useContext(S),
        d = g != null && Xt(h) && s === !0,
        m = v.encodeLocation ? v.encodeLocation(h).pathname : h.pathname,
        p = y.pathname,
        R = g && g.navigation && g.navigation.location ? g.navigation.location.pathname : null;
    r || (p = p.toLowerCase(), R = R ? R.toLowerCase() : null, m = m.toLowerCase()), R && w && (R = $(R, w) || R);
    const C = m !== "/" && m.endsWith("/") ? m.length - 1 : m.length;
    let b = p === m || !a && p.startsWith(m) && p.charAt(C) === "/",
        W = R != null && (R === m || !a && R.startsWith(m) && R.charAt(m.length) === "/"),
        D = {
            isActive: b,
            isPending: W,
            isTransitioning: d
        },
        H = b ? t : void 0,
        P;
    typeof n == "function" ? P = n(D) : P = [n, b ? "active" : null, W ? "pending" : null, d ? "transitioning" : null].filter(Boolean).join(" ");
    let N = typeof o == "function" ? o(D) : o;
    return i.createElement(Le, { ...c,
        "aria-current": H,
        className: P,
        ref: f,
        style: N,
        to: l,
        viewTransition: s
    }, typeof u == "function" ? u(D) : u)
});
zt.displayName = "NavLink";
var jt = i.forwardRef(({
    discover: e = "render",
    fetcherKey: t,
    navigate: r,
    reloadDocument: n,
    replace: a,
    state: o,
    method: l = z,
    action: s,
    onSubmit: u,
    relative: c,
    preventScrollReset: f,
    viewTransition: h,
    ...y
}, g) => {
    let v = Gt(),
        w = qt(s, {
            relative: c
        }),
        d = l.toLowerCase() === "get" ? "get" : "post",
        m = typeof s == "string" && Se.test(s),
        p = R => {
            if (u && u(R), R.defaultPrevented) return;
            R.preventDefault();
            let C = R.nativeEvent.submitter,
                b = C ?.getAttribute("formmethod") || l;
            v(C || R.currentTarget, {
                fetcherKey: t,
                method: b,
                navigate: r,
                replace: a,
                state: o,
                relative: c,
                preventScrollReset: f,
                viewTransition: h
            })
        };
    return i.createElement("form", {
        ref: g,
        method: d,
        action: w,
        onSubmit: n ? u : p,
        ...y,
        "data-discover": !m && e === "render" ? "true" : void 0
    })
});
jt.displayName = "Form";

function Vt(e) {
    return `${e} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`
}

function ke(e) {
    let t = i.useContext(T);
    return E(t, Vt(e)), t
}

function Jt(e, {
    target: t,
    replace: r,
    state: n,
    preventScrollReset: a,
    relative: o,
    viewTransition: l
} = {}) {
    let s = re(),
        u = F(),
        c = U(e, {
            relative: o
        });
    return i.useCallback(f => {
        if (bt(f, t)) {
            f.preventDefault();
            let h = r !== void 0 ? r : A(u) === A(c);
            s(e, {
                replace: h,
                state: n,
                preventScrollReset: a,
                relative: o,
                viewTransition: l
            })
        }
    }, [u, s, c, r, n, t, e, a, o, l])
}

function nr(e) {
    x(typeof URLSearchParams < "u", "You cannot use the `useSearchParams` hook in a browser that does not support the URLSearchParams API. If you need to support Internet Explorer 11, we recommend you load a polyfill such as https://github.com/ungap/url-search-params.");
    let t = i.useRef(Q(e)),
        r = i.useRef(!1),
        n = F(),
        a = i.useMemo(() => Pt(n.search, r.current ? null : t.current), [n.search]),
        o = re(),
        l = i.useCallback((s, u) => {
            const c = Q(typeof s == "function" ? s(new URLSearchParams(a)) : s);
            r.current = !0, o("?" + c, u)
        }, [o, a]);
    return [a, l]
}
var Kt = 0,
    Yt = () => `__${String(++Kt)}__`;

function Gt() {
    let {
        router: e
    } = ke("useSubmit"), {
        basename: t
    } = i.useContext(S), r = pt();
    return i.useCallback(async (n, a = {}) => {
        let {
            action: o,
            method: l,
            encType: s,
            formData: u,
            body: c
        } = kt(n, t);
        if (a.navigate === !1) {
            let f = a.fetcherKey || Yt();
            await e.fetch(f, r, a.action || o, {
                preventScrollReset: a.preventScrollReset,
                formData: u,
                body: c,
                formMethod: a.method || l,
                formEncType: a.encType || s,
                flushSync: a.flushSync
            })
        } else await e.navigate(a.action || o, {
            preventScrollReset: a.preventScrollReset,
            formData: u,
            body: c,
            formMethod: a.method || l,
            formEncType: a.encType || s,
            replace: a.replace,
            state: a.state,
            fromRouteId: r,
            flushSync: a.flushSync,
            viewTransition: a.viewTransition
        })
    }, [e, t, r])
}

function qt(e, {
    relative: t
} = {}) {
    let {
        basename: r
    } = i.useContext(S), n = i.useContext(L);
    E(n, "useFormAction must be used inside a RouteContext");
    let [a] = n.matches.slice(-1), o = { ...U(e || ".", {
            relative: t
        })
    }, l = F();
    if (e == null) {
        o.search = l.search;
        let s = new URLSearchParams(o.search),
            u = s.getAll("index");
        if (u.some(f => f === "")) {
            s.delete("index"), u.filter(h => h).forEach(h => s.append("index", h));
            let f = s.toString();
            o.search = f ? `?${f}` : ""
        }
    }
    return (!e || e === ".") && a.route.index && (o.search = o.search ? o.search.replace(/^\?/, "?index&") : "?index"), r !== "/" && (o.pathname = o.pathname === "/" ? r : k([r, o.pathname])), A(o)
}

function Xt(e, {
    relative: t
} = {}) {
    let r = i.useContext(ve);
    E(r != null, "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?");
    let {
        basename: n
    } = ke("useViewTransitionState"), a = U(e, {
        relative: t
    });
    if (!r.isTransitioning) return !1;
    let o = $(r.currentLocation.pathname, n) || r.currentLocation.pathname,
        l = $(r.nextLocation.pathname, n) || r.nextLocation.pathname;
    return V(a.pathname, l) != null || V(a.pathname, o) != null
}
export {
    rr as B, Le as L, er as N, tr as R, Zt as a, F as b, nr as c, vt as d, re as u
};