import {
    r as Re,
    d as Bm,
    g as Um
} from "./vendor-react-BfU3Zn2J.js";

function Hm(e, t) {
    for (var n = 0; n < t.length; n++) {
        const r = t[n];
        if (typeof r != "string" && !Array.isArray(r)) {
            for (const o in r)
                if (o !== "default" && !(o in e)) {
                    const s = Object.getOwnPropertyDescriptor(r, o);
                    s && Object.defineProperty(e, o, s.get ? s : {
                        enumerable: !0,
                        get: () => r[o]
                    })
                }
        }
    }
    return Object.freeze(Object.defineProperty(e, Symbol.toStringTag, {
        value: "Module"
    }))
}
const R = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__,
    $ = globalThis,
    qt = "10.32.1";

function Pt() {
    return qr($), $
}

function qr(e) {
    const t = e.__SENTRY__ = e.__SENTRY__ || {};
    return t.version = t.version || qt, t[qt] = t[qt] || {}
}

function hr(e, t, n = $) {
    const r = n.__SENTRY__ = n.__SENTRY__ || {},
        o = r[qt] = r[qt] || {};
    return o[e] || (o[e] = t())
}
const Fa = ["debug", "info", "warn", "error", "log", "assert", "trace"],
    Wm = "Sentry Logger ",
    ns = {};

function on(e) {
    if (!("console" in $)) return e();
    const t = $.console,
        n = {},
        r = Object.keys(ns);
    r.forEach(o => {
        const s = ns[o];
        n[o] = t[o], t[o] = s
    });
    try {
        return e()
    } finally {
        r.forEach(o => {
            t[o] = n[o]
        })
    }
}

function jm() {
    Ba().enabled = !0
}

function zm() {
    Ba().enabled = !1
}

function Bd() {
    return Ba().enabled
}

function qm(...e) {
    $a("log", ...e)
}

function Gm(...e) {
    $a("warn", ...e)
}

function Vm(...e) {
    $a("error", ...e)
}

function $a(e, ...t) {
    R && Bd() && on(() => {
        $.console[e](`${Wm}[${e}]:`, ...t)
    })
}

function Ba() {
    return R ? hr("loggerSettings", () => ({
        enabled: !1
    })) : {
        enabled: !1
    }
}
const g = {
        enable: jm,
        disable: zm,
        isEnabled: Bd,
        log: qm,
        warn: Gm,
        error: Vm
    },
    Ud = 50,
    gt = "?",
    ou = /\(error: (.*)\)/,
    su = /captureMessage|captureException/;

function Hd(...e) {
    const t = e.sort((n, r) => n[0] - r[0]).map(n => n[1]);
    return (n, r = 0, o = 0) => {
        const s = [],
            i = n.split(`
`);
        for (let a = r; a < i.length; a++) {
            let c = i[a];
            c.length > 1024 && (c = c.slice(0, 1024));
            const u = ou.test(c) ? c.replace(ou, "$1") : c;
            if (!u.match(/\S*Error: /)) {
                for (const d of t) {
                    const l = d(u);
                    if (l) {
                        s.push(l);
                        break
                    }
                }
                if (s.length >= Ud + o) break
            }
        }
        return Km(s.slice(o))
    }
}

function Jm(e) {
    return Array.isArray(e) ? Hd(...e) : e
}

function Km(e) {
    if (!e.length) return [];
    const t = Array.from(e);
    return /sentryWrapped/.test(go(t).function || "") && t.pop(), t.reverse(), su.test(go(t).function || "") && (t.pop(), su.test(go(t).function || "") && t.pop()), t.slice(0, Ud).map(n => ({ ...n,
        filename: n.filename || go(t).filename,
        function: n.function || gt
    }))
}

function go(e) {
    return e[e.length - 1] || {}
}
const yi = "<anonymous>";

function At(e) {
    try {
        return !e || typeof e != "function" ? yi : e.name || yi
    } catch {
        return yi
    }
}

function Qi(e) {
    const t = e.exception;
    if (t) {
        const n = [];
        try {
            return t.values.forEach(r => {
                r.stacktrace.frames && n.push(...r.stacktrace.frames)
            }), n
        } catch {
            return
        }
    }
}

function Wd(e) {
    return "__v_isVNode" in e && e.__v_isVNode ? "[VueVNode]" : "[VueViewModel]"
}
const Po = {},
    iu = {};

function sn(e, t) {
    Po[e] = Po[e] || [], Po[e].push(t)
}

function an(e, t) {
    if (!iu[e]) {
        iu[e] = !0;
        try {
            t()
        } catch (n) {
            R && g.error(`Error while instrumenting ${e}`, n)
        }
    }
}

function Qe(e, t) {
    const n = e && Po[e];
    if (n)
        for (const r of n) try {
            r(t)
        } catch (o) {
            R && g.error(`Error while triggering instrumentation handler.
Type: ${e}
Name: ${At(r)}
Error:`, o)
        }
}
let Si = null;

function jd(e) {
    const t = "error";
    sn(t, e), an(t, Ym)
}

function Ym() {
    Si = $.onerror, $.onerror = function(e, t, n, r, o) {
        return Qe("error", {
            column: r,
            error: o,
            line: n,
            msg: e,
            url: t
        }), Si ? Si.apply(this, arguments) : !1
    }, $.onerror.__SENTRY_INSTRUMENTED__ = !0
}
let bi = null;

function zd(e) {
    const t = "unhandledrejection";
    sn(t, e), an(t, Xm)
}

function Xm() {
    bi = $.onunhandledrejection, $.onunhandledrejection = function(e) {
        return Qe("unhandledrejection", e), bi ? bi.apply(this, arguments) : !0
    }, $.onunhandledrejection.__SENTRY_INSTRUMENTED__ = !0
}
const qd = Object.prototype.toString;

function kt(e) {
    switch (qd.call(e)) {
        case "[object Error]":
        case "[object Exception]":
        case "[object DOMException]":
        case "[object WebAssembly.Exception]":
            return !0;
        default:
            return xt(e, Error)
    }
}

function mr(e, t) {
    return qd.call(e) === `[object ${t}]`
}

function Gd(e) {
    return mr(e, "ErrorEvent")
}

function au(e) {
    return mr(e, "DOMError")
}

function Qm(e) {
    return mr(e, "DOMException")
}

function st(e) {
    return mr(e, "String")
}

function Ls(e) {
    return typeof e == "object" && e !== null && "__sentry_template_string__" in e && "__sentry_template_values__" in e
}

function Zt(e) {
    return e === null || Ls(e) || typeof e != "object" && typeof e != "function"
}

function mt(e) {
    return mr(e, "Object")
}

function Ds(e) {
    return typeof Event < "u" && xt(e, Event)
}

function Zm(e) {
    return typeof Element < "u" && xt(e, Element)
}

function eg(e) {
    return mr(e, "RegExp")
}

function Pn(e) {
    return !!(e ?.then && typeof e.then == "function")
}

function tg(e) {
    return mt(e) && "nativeEvent" in e && "preventDefault" in e && "stopPropagation" in e
}

function xt(e, t) {
    try {
        return e instanceof t
    } catch {
        return !1
    }
}

function Vd(e) {
    return !!(typeof e == "object" && e !== null && (e.__isVue || e._isVue || e.__v_isVNode))
}

function Ua(e) {
    return typeof Request < "u" && xt(e, Request)
}
const Ha = $,
    ng = 80;

function je(e, t = {}) {
    if (!e) return "<unknown>";
    try {
        let n = e;
        const r = 5,
            o = [];
        let s = 0,
            i = 0;
        const a = " > ",
            c = a.length;
        let u;
        const d = Array.isArray(t) ? t : t.keyAttrs,
            l = !Array.isArray(t) && t.maxStringLength || ng;
        for (; n && s++ < r && (u = rg(n, d), !(u === "html" || s > 1 && i + o.length * c + u.length >= l));) o.push(u), i += u.length, n = n.parentNode;
        return o.reverse().join(a)
    } catch {
        return "<unknown>"
    }
}

function rg(e, t) {
    const n = e,
        r = [];
    if (!n ?.tagName) return "";
    if (Ha.HTMLElement && n instanceof HTMLElement && n.dataset) {
        if (n.dataset.sentryComponent) return n.dataset.sentryComponent;
        if (n.dataset.sentryElement) return n.dataset.sentryElement
    }
    r.push(n.tagName.toLowerCase());
    const o = t ?.length ? t.filter(i => n.getAttribute(i)).map(i => [i, n.getAttribute(i)]) : null;
    if (o ?.length) o.forEach(i => {
        r.push(`[${i[0]}="${i[1]}"]`)
    });
    else {
        n.id && r.push(`#${n.id}`);
        const i = n.className;
        if (i && st(i)) {
            const a = i.split(/\s+/);
            for (const c of a) r.push(`.${c}`)
        }
    }
    const s = ["aria-label", "type", "name", "title", "alt"];
    for (const i of s) {
        const a = n.getAttribute(i);
        a && r.push(`[${i}="${a}"]`)
    }
    return r.join("")
}

function Ln() {
    try {
        return Ha.document.location.href
    } catch {
        return ""
    }
}

function Jd(e) {
    if (!Ha.HTMLElement) return null;
    let t = e;
    const n = 5;
    for (let r = 0; r < n; r++) {
        if (!t) return null;
        if (t instanceof HTMLElement) {
            if (t.dataset.sentryComponent) return t.dataset.sentryComponent;
            if (t.dataset.sentryElement) return t.dataset.sentryElement
        }
        t = t.parentNode
    }
    return null
}

function xe(e, t, n) {
    if (!(t in e)) return;
    const r = e[t];
    if (typeof r != "function") return;
    const o = n(r);
    typeof o == "function" && Kd(o, r);
    try {
        e[t] = o
    } catch {
        R && g.log(`Failed to replace method "${t}" in object`, e)
    }
}

function we(e, t, n) {
    try {
        Object.defineProperty(e, t, {
            value: n,
            writable: !0,
            configurable: !0
        })
    } catch {
        R && g.log(`Failed to add non-enumerable property "${t}" to object`, e)
    }
}

function Kd(e, t) {
    try {
        const n = t.prototype || {};
        e.prototype = t.prototype = n, we(e, "__sentry_original__", t)
    } catch {}
}

function Wa(e) {
    return e.__sentry_original__
}

function Yd(e) {
    if (kt(e)) return {
        message: e.message,
        name: e.name,
        stack: e.stack,
        ...uu(e)
    };
    if (Ds(e)) {
        const t = {
            type: e.type,
            target: cu(e.target),
            currentTarget: cu(e.currentTarget),
            ...uu(e)
        };
        return typeof CustomEvent < "u" && xt(e, CustomEvent) && (t.detail = e.detail), t
    } else return e
}

function cu(e) {
    try {
        return Zm(e) ? je(e) : Object.prototype.toString.call(e)
    } catch {
        return "<unknown>"
    }
}

function uu(e) {
    if (typeof e == "object" && e !== null) {
        const t = {};
        for (const n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
        return t
    } else return {}
}

function og(e) {
    const t = Object.keys(Yd(e));
    return t.sort(), t[0] ? t.join(", ") : "[object has no keys]"
}

function Dr(e, t = 0) {
    return typeof e != "string" || t === 0 || e.length <= t ? e : `${e.slice(0,t)}...`
}

function Ei(e, t) {
    let n = e;
    const r = n.length;
    if (r <= 150) return n;
    t > r && (t = r);
    let o = Math.max(t - 60, 0);
    o < 5 && (o = 0);
    let s = Math.min(o + 140, r);
    return s > r - 5 && (s = r), s === r && (o = Math.max(s - 140, 0)), n = n.slice(o, s), o > 0 && (n = `'{snip} ${n}`), s < r && (n += " {snip}"), n
}

function rs(e, t) {
    if (!Array.isArray(e)) return "";
    const n = [];
    for (let r = 0; r < e.length; r++) {
        const o = e[r];
        try {
            Vd(o) ? n.push(Wd(o)) : n.push(String(o))
        } catch {
            n.push("[value cannot be serialized]")
        }
    }
    return n.join(t)
}

function Lo(e, t, n = !1) {
    return st(e) ? eg(t) ? t.test(e) : st(t) ? n ? e === t : e.includes(t) : !1 : !1
}

function it(e, t = [], n = !1) {
    return t.some(r => Lo(e, r, n))
}

function sg() {
    const e = $;
    return e.crypto || e.msCrypto
}
let vi;

function ig() {
    return Math.random() * 16
}

function Ie(e = sg()) {
    try {
        if (e ?.randomUUID) return e.randomUUID().replace(/-/g, "")
    } catch {}
    return vi || (vi = "10000000100040008000" + 1e11), vi.replace(/[018]/g, t => (t ^ (ig() & 15) >> t / 4).toString(16))
}

function Xd(e) {
    return e.exception ?.values ?.[0]
}

function hn(e) {
    const {
        message: t,
        event_id: n
    } = e;
    if (t) return t;
    const r = Xd(e);
    return r ? r.type && r.value ? `${r.type}: ${r.value}` : r.type || r.value || n || "<unknown>" : n || "<unknown>"
}

function Zi(e, t, n) {
    const r = e.exception = e.exception || {},
        o = r.values = r.values || [],
        s = o[0] = o[0] || {};
    s.value || (s.value = t || ""), s.type || (s.type = "Error")
}

function Mt(e, t) {
    const n = Xd(e);
    if (!n) return;
    const r = {
            type: "generic",
            handled: !0
        },
        o = n.mechanism;
    if (n.mechanism = { ...r,
            ...o,
            ...t
        }, t && "data" in t) {
        const s = { ...o ?.data,
            ...t.data
        };
        n.mechanism.data = s
    }
}

function ag(e, t, n = 5) {
    if (t.lineno === void 0) return;
    const r = e.length,
        o = Math.max(Math.min(r - 1, t.lineno - 1), 0);
    t.pre_context = e.slice(Math.max(0, o - n), o).map(i => Ei(i, 0));
    const s = Math.min(r - 1, o);
    t.context_line = Ei(e[s], t.colno || 0), t.post_context = e.slice(Math.min(o + 1, r), o + 1 + n).map(i => Ei(i, 0))
}

function lu(e) {
    if (cg(e)) return !0;
    try {
        we(e, "__sentry_captured__", !0)
    } catch {}
    return !1
}

function cg(e) {
    try {
        return e.__sentry_captured__
    } catch {}
}
const Qd = 1e3;

function Dn() {
    return Date.now() / Qd
}

function ug() {
    const {
        performance: e
    } = $;
    if (!e ?.now || !e.timeOrigin) return Dn;
    const t = e.timeOrigin;
    return () => (t + e.now()) / Qd
}
let du;

function he() {
    return (du ?? (du = ug()))()
}
let Ti;

function lg() {
    const {
        performance: e
    } = $;
    if (!e ?.now) return [void 0, "none"];
    const t = 3600 * 1e3,
        n = e.now(),
        r = Date.now(),
        o = e.timeOrigin ? Math.abs(e.timeOrigin + n - r) : t,
        s = o < t,
        i = e.timing ?.navigationStart,
        c = typeof i == "number" ? Math.abs(i + n - r) : t,
        u = c < t;
    return s || u ? o <= c ? [e.timeOrigin, "timeOrigin"] : [i, "navigationStart"] : [r, "dateNow"]
}

function Oe() {
    return Ti || (Ti = lg()), Ti[0]
}

function dg(e) {
    const t = he(),
        n = {
            sid: Ie(),
            init: !0,
            timestamp: t,
            started: t,
            duration: 0,
            status: "ok",
            errors: 0,
            ignoreDuration: !1,
            toJSON: () => pg(n)
        };
    return e && Zn(n, e), n
}

function Zn(e, t = {}) {
    if (t.user && (!e.ipAddress && t.user.ip_address && (e.ipAddress = t.user.ip_address), !e.did && !t.did && (e.did = t.user.id || t.user.email || t.user.username)), e.timestamp = t.timestamp || he(), t.abnormal_mechanism && (e.abnormal_mechanism = t.abnormal_mechanism), t.ignoreDuration && (e.ignoreDuration = t.ignoreDuration), t.sid && (e.sid = t.sid.length === 32 ? t.sid : Ie()), t.init !== void 0 && (e.init = t.init), !e.did && t.did && (e.did = `${t.did}`), typeof t.started == "number" && (e.started = t.started), e.ignoreDuration) e.duration = void 0;
    else if (typeof t.duration == "number") e.duration = t.duration;
    else {
        const n = e.timestamp - e.started;
        e.duration = n >= 0 ? n : 0
    }
    t.release && (e.release = t.release), t.environment && (e.environment = t.environment), !e.ipAddress && t.ipAddress && (e.ipAddress = t.ipAddress), !e.userAgent && t.userAgent && (e.userAgent = t.userAgent), typeof t.errors == "number" && (e.errors = t.errors), t.status && (e.status = t.status)
}

function fg(e, t) {
    let n = {};
    e.status === "ok" && (n = {
        status: "exited"
    }), Zn(e, n)
}

function pg(e) {
    return {
        sid: `${e.sid}`,
        init: e.init,
        started: new Date(e.started * 1e3).toISOString(),
        timestamp: new Date(e.timestamp * 1e3).toISOString(),
        status: e.status,
        errors: e.errors,
        did: typeof e.did == "number" || typeof e.did == "string" ? `${e.did}` : void 0,
        duration: e.duration,
        abnormal_mechanism: e.abnormal_mechanism,
        attrs: {
            release: e.release,
            environment: e.environment,
            ip_address: e.ipAddress,
            user_agent: e.userAgent
        }
    }
}

function Gr(e, t, n = 2) {
    if (!t || typeof t != "object" || n <= 0) return t;
    if (e && Object.keys(t).length === 0) return e;
    const r = { ...e
    };
    for (const o in t) Object.prototype.hasOwnProperty.call(t, o) && (r[o] = Gr(r[o], t[o], n - 1));
    return r
}

function _t() {
    return Ie()
}

function Rt() {
    return Ie().substring(16)
}
const ea = "_sentrySpan";

function yt(e, t) {
    t ? we(e, ea, t) : delete e[ea]
}

function er(e) {
    return e[ea]
}
const hg = 100;
class St {
    constructor() {
        this._notifyingListeners = !1, this._scopeListeners = [], this._eventProcessors = [], this._breadcrumbs = [], this._attachments = [], this._user = {}, this._tags = {}, this._attributes = {}, this._extra = {}, this._contexts = {}, this._sdkProcessingMetadata = {}, this._propagationContext = {
            traceId: _t(),
            sampleRand: Math.random()
        }
    }
    clone() {
        const t = new St;
        return t._breadcrumbs = [...this._breadcrumbs], t._tags = { ...this._tags
        }, t._attributes = { ...this._attributes
        }, t._extra = { ...this._extra
        }, t._contexts = { ...this._contexts
        }, this._contexts.flags && (t._contexts.flags = {
            values: [...this._contexts.flags.values]
        }), t._user = this._user, t._level = this._level, t._session = this._session, t._transactionName = this._transactionName, t._fingerprint = this._fingerprint, t._eventProcessors = [...this._eventProcessors], t._attachments = [...this._attachments], t._sdkProcessingMetadata = { ...this._sdkProcessingMetadata
        }, t._propagationContext = { ...this._propagationContext
        }, t._client = this._client, t._lastEventId = this._lastEventId, yt(t, er(this)), t
    }
    setClient(t) {
        this._client = t
    }
    setLastEventId(t) {
        this._lastEventId = t
    }
    getClient() {
        return this._client
    }
    lastEventId() {
        return this._lastEventId
    }
    addScopeListener(t) {
        this._scopeListeners.push(t)
    }
    addEventProcessor(t) {
        return this._eventProcessors.push(t), this
    }
    setUser(t) {
        return this._user = t || {
            email: void 0,
            id: void 0,
            ip_address: void 0,
            username: void 0
        }, this._session && Zn(this._session, {
            user: t
        }), this._notifyScopeListeners(), this
    }
    getUser() {
        return this._user
    }
    setTags(t) {
        return this._tags = { ...this._tags,
            ...t
        }, this._notifyScopeListeners(), this
    }
    setTag(t, n) {
        return this.setTags({
            [t]: n
        })
    }
    setAttributes(t) {
        return this._attributes = { ...this._attributes,
            ...t
        }, this._notifyScopeListeners(), this
    }
    setAttribute(t, n) {
        return this.setAttributes({
            [t]: n
        })
    }
    removeAttribute(t) {
        return t in this._attributes && (delete this._attributes[t], this._notifyScopeListeners()), this
    }
    setExtras(t) {
        return this._extra = { ...this._extra,
            ...t
        }, this._notifyScopeListeners(), this
    }
    setExtra(t, n) {
        return this._extra = { ...this._extra,
            [t]: n
        }, this._notifyScopeListeners(), this
    }
    setFingerprint(t) {
        return this._fingerprint = t, this._notifyScopeListeners(), this
    }
    setLevel(t) {
        return this._level = t, this._notifyScopeListeners(), this
    }
    setTransactionName(t) {
        return this._transactionName = t, this._notifyScopeListeners(), this
    }
    setContext(t, n) {
        return n === null ? delete this._contexts[t] : this._contexts[t] = n, this._notifyScopeListeners(), this
    }
    setSession(t) {
        return t ? this._session = t : delete this._session, this._notifyScopeListeners(), this
    }
    getSession() {
        return this._session
    }
    update(t) {
        if (!t) return this;
        const n = typeof t == "function" ? t(this) : t,
            r = n instanceof St ? n.getScopeData() : mt(n) ? t : void 0,
            {
                tags: o,
                attributes: s,
                extra: i,
                user: a,
                contexts: c,
                level: u,
                fingerprint: d = [],
                propagationContext: l
            } = r || {};
        return this._tags = { ...this._tags,
            ...o
        }, this._attributes = { ...this._attributes,
            ...s
        }, this._extra = { ...this._extra,
            ...i
        }, this._contexts = { ...this._contexts,
            ...c
        }, a && Object.keys(a).length && (this._user = a), u && (this._level = u), d.length && (this._fingerprint = d), l && (this._propagationContext = l), this
    }
    clear() {
        return this._breadcrumbs = [], this._tags = {}, this._attributes = {}, this._extra = {}, this._user = {}, this._contexts = {}, this._level = void 0, this._transactionName = void 0, this._fingerprint = void 0, this._session = void 0, yt(this, void 0), this._attachments = [], this.setPropagationContext({
            traceId: _t(),
            sampleRand: Math.random()
        }), this._notifyScopeListeners(), this
    }
    addBreadcrumb(t, n) {
        const r = typeof n == "number" ? n : hg;
        if (r <= 0) return this;
        const o = {
            timestamp: Dn(),
            ...t,
            message: t.message ? Dr(t.message, 2048) : t.message
        };
        return this._breadcrumbs.push(o), this._breadcrumbs.length > r && (this._breadcrumbs = this._breadcrumbs.slice(-r), this._client ?.recordDroppedEvent("buffer_overflow", "log_item")), this._notifyScopeListeners(), this
    }
    getLastBreadcrumb() {
        return this._breadcrumbs[this._breadcrumbs.length - 1]
    }
    clearBreadcrumbs() {
        return this._breadcrumbs = [], this._notifyScopeListeners(), this
    }
    addAttachment(t) {
        return this._attachments.push(t), this
    }
    clearAttachments() {
        return this._attachments = [], this
    }
    getScopeData() {
        return {
            breadcrumbs: this._breadcrumbs,
            attachments: this._attachments,
            contexts: this._contexts,
            tags: this._tags,
            attributes: this._attributes,
            extra: this._extra,
            user: this._user,
            level: this._level,
            fingerprint: this._fingerprint || [],
            eventProcessors: this._eventProcessors,
            propagationContext: this._propagationContext,
            sdkProcessingMetadata: this._sdkProcessingMetadata,
            transactionName: this._transactionName,
            span: er(this)
        }
    }
    setSDKProcessingMetadata(t) {
        return this._sdkProcessingMetadata = Gr(this._sdkProcessingMetadata, t, 2), this
    }
    setPropagationContext(t) {
        return this._propagationContext = t, this
    }
    getPropagationContext() {
        return this._propagationContext
    }
    captureException(t, n) {
        const r = n ?.event_id || Ie();
        if (!this._client) return R && g.warn("No client configured on scope - will not capture exception!"), r;
        const o = new Error("Sentry syntheticException");
        return this._client.captureException(t, {
            originalException: t,
            syntheticException: o,
            ...n,
            event_id: r
        }, this), r
    }
    captureMessage(t, n, r) {
        const o = r ?.event_id || Ie();
        if (!this._client) return R && g.warn("No client configured on scope - will not capture message!"), o;
        const s = r ?.syntheticException ?? new Error(t);
        return this._client.captureMessage(t, n, {
            originalException: t,
            syntheticException: s,
            ...r,
            event_id: o
        }, this), o
    }
    captureEvent(t, n) {
        const r = n ?.event_id || Ie();
        return this._client ? (this._client.captureEvent(t, { ...n,
            event_id: r
        }, this), r) : (R && g.warn("No client configured on scope - will not capture event!"), r)
    }
    _notifyScopeListeners() {
        this._notifyingListeners || (this._notifyingListeners = !0, this._scopeListeners.forEach(t => {
            t(this)
        }), this._notifyingListeners = !1)
    }
}

function mg() {
    return hr("defaultCurrentScope", () => new St)
}

function gg() {
    return hr("defaultIsolationScope", () => new St)
}
class _g {
    constructor(t, n) {
        let r;
        t ? r = t : r = new St;
        let o;
        n ? o = n : o = new St, this._stack = [{
            scope: r
        }], this._isolationScope = o
    }
    withScope(t) {
        const n = this._pushScope();
        let r;
        try {
            r = t(n)
        } catch (o) {
            throw this._popScope(), o
        }
        return Pn(r) ? r.then(o => (this._popScope(), o), o => {
            throw this._popScope(), o
        }) : (this._popScope(), r)
    }
    getClient() {
        return this.getStackTop().client
    }
    getScope() {
        return this.getStackTop().scope
    }
    getIsolationScope() {
        return this._isolationScope
    }
    getStackTop() {
        return this._stack[this._stack.length - 1]
    }
    _pushScope() {
        const t = this.getScope().clone();
        return this._stack.push({
            client: this.getClient(),
            scope: t
        }), t
    }
    _popScope() {
        return this._stack.length <= 1 ? !1 : !!this._stack.pop()
    }
}

function tr() {
    const e = Pt(),
        t = qr(e);
    return t.stack = t.stack || new _g(mg(), gg())
}

function yg(e) {
    return tr().withScope(e)
}

function Sg(e, t) {
    const n = tr();
    return n.withScope(() => (n.getStackTop().scope = e, t(e)))
}

function fu(e) {
    return tr().withScope(() => e(tr().getIsolationScope()))
}

function bg() {
    return {
        withIsolationScope: fu,
        withScope: yg,
        withSetScope: Sg,
        withSetIsolationScope: (e, t) => fu(t),
        getCurrentScope: () => tr().getScope(),
        getIsolationScope: () => tr().getIsolationScope()
    }
}

function cn(e) {
    const t = qr(e);
    return t.acs ? t.acs : bg()
}

function j() {
    const e = Pt();
    return cn(e).getCurrentScope()
}

function ke() {
    const e = Pt();
    return cn(e).getIsolationScope()
}

function Gt() {
    return hr("globalScope", () => new St)
}

function Ke(...e) {
    const t = Pt(),
        n = cn(t);
    if (e.length === 2) {
        const [r, o] = e;
        return r ? n.withSetScope(r, o) : n.withScope(o)
    }
    return n.withScope(e[0])
}

function Mx(...e) {
    const t = Pt(),
        n = cn(t);
    if (e.length === 2) {
        const [r, o] = e;
        return r ? n.withSetIsolationScope(r, o) : n.withIsolationScope(o)
    }
    return n.withIsolationScope(e[0])
}

function C() {
    return j().getClient()
}

function Zd(e) {
    const t = e.getPropagationContext(),
        {
            traceId: n,
            parentSpanId: r,
            propagationSpanId: o
        } = t,
        s = {
            trace_id: n,
            span_id: o || Rt()
        };
    return r && (s.parent_span_id = r), s
}
const ae = "sentry.source",
    ja = "sentry.sample_rate",
    ef = "sentry.previous_trace_sample_rate",
    pe = "sentry.op",
    G = "sentry.origin",
    Fr = "sentry.idle_span_finish_reason",
    Vr = "sentry.measurement_unit",
    Jr = "sentry.measurement_value",
    ta = "sentry.custom_span_name",
    za = "sentry.profile_id",
    gr = "sentry.exclusive_time",
    Eg = "http.request.method",
    vg = "url.full",
    Tg = "sentry.link.type",
    Ig = 0,
    Fs = 1,
    Z = 2;

function wg(e) {
    if (e < 400 && e >= 100) return {
        code: Fs
    };
    if (e >= 400 && e < 500) switch (e) {
        case 401:
            return {
                code: Z,
                message: "unauthenticated"
            };
        case 403:
            return {
                code: Z,
                message: "permission_denied"
            };
        case 404:
            return {
                code: Z,
                message: "not_found"
            };
        case 409:
            return {
                code: Z,
                message: "already_exists"
            };
        case 413:
            return {
                code: Z,
                message: "failed_precondition"
            };
        case 429:
            return {
                code: Z,
                message: "resource_exhausted"
            };
        case 499:
            return {
                code: Z,
                message: "cancelled"
            };
        default:
            return {
                code: Z,
                message: "invalid_argument"
            }
    }
    if (e >= 500 && e < 600) switch (e) {
        case 501:
            return {
                code: Z,
                message: "unimplemented"
            };
        case 503:
            return {
                code: Z,
                message: "unavailable"
            };
        case 504:
            return {
                code: Z,
                message: "deadline_exceeded"
            };
        default:
            return {
                code: Z,
                message: "internal_error"
            }
    }
    return {
        code: Z,
        message: "internal_error"
    }
}

function os(e, t) {
    e.setAttribute("http.response.status_code", t);
    const n = wg(t);
    n.message !== "unknown_error" && e.setStatus(n)
}
const tf = "_sentryScope",
    nf = "_sentryIsolationScope";

function kg(e) {
    try {
        const t = $.WeakRef;
        if (typeof t == "function") return new t(e)
    } catch {}
    return e
}

function Rg(e) {
    if (e) {
        if (typeof e == "object" && "deref" in e && typeof e.deref == "function") try {
            return e.deref()
        } catch {
            return
        }
        return e
    }
}

function Cg(e, t, n) {
    e && (we(e, nf, kg(n)), we(e, tf, t))
}

function ss(e) {
    const t = e;
    return {
        scope: t[tf],
        isolationScope: Rg(t[nf])
    }
}
const qa = "sentry-",
    Ag = /^sentry-/,
    xg = 8192;

function Ga(e) {
    const t = Mg(e);
    if (!t) return;
    const n = Object.entries(t).reduce((r, [o, s]) => {
        if (o.match(Ag)) {
            const i = o.slice(qa.length);
            r[i] = s
        }
        return r
    }, {});
    if (Object.keys(n).length > 0) return n
}

function rf(e) {
    if (!e) return;
    const t = Object.entries(e).reduce((n, [r, o]) => (o && (n[`${qa}${r}`] = o), n), {});
    return Ng(t)
}

function Mg(e) {
    if (!(!e || !st(e) && !Array.isArray(e))) return Array.isArray(e) ? e.reduce((t, n) => {
        const r = pu(n);
        return Object.entries(r).forEach(([o, s]) => {
            t[o] = s
        }), t
    }, {}) : pu(e)
}

function pu(e) {
    return e.split(",").map(t => {
        const n = t.indexOf("=");
        if (n === -1) return [];
        const r = t.slice(0, n),
            o = t.slice(n + 1);
        return [r, o].map(s => {
            try {
                return decodeURIComponent(s.trim())
            } catch {
                return
            }
        })
    }).reduce((t, [n, r]) => (n && r && (t[n] = r), t), {})
}

function Ng(e) {
    if (Object.keys(e).length !== 0) return Object.entries(e).reduce((t, [n, r], o) => {
        const s = `${encodeURIComponent(n)}=${encodeURIComponent(r)}`,
            i = o === 0 ? s : `${t},${s}`;
        return i.length > xg ? (R && g.warn(`Not adding key: ${n} with val: ${r} to baggage header due to exceeding baggage size limits.`), t) : i
    }, "")
}
const Og = /^o(\d+)\./,
    Pg = /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+)?)?@)([\w.-]+)(?::(\d+))?\/(.+)/;

function Lg(e) {
    return e === "http" || e === "https"
}

function Lt(e, t = !1) {
    const {
        host: n,
        path: r,
        pass: o,
        port: s,
        projectId: i,
        protocol: a,
        publicKey: c
    } = e;
    return `${a}://${c}${t&&o?`:${o}`:""}@${n}${s?`:${s}`:""}/${r&&`${r}/`}${i}`
}

function of (e) {
    const t = Pg.exec(e);
    if (!t) {
        on(() => {
            console.error(`Invalid Sentry Dsn: ${e}`)
        });
        return
    }
    const [n, r, o = "", s = "", i = "", a = ""] = t.slice(1);
    let c = "",
        u = a;
    const d = u.split("/");
    if (d.length > 1 && (c = d.slice(0, -1).join("/"), u = d.pop()), u) {
        const l = u.match(/^\d+/);
        l && (u = l[0])
    }
    return sf({
        host: s,
        pass: o,
        path: c,
        projectId: u,
        port: i,
        protocol: n,
        publicKey: r
    })
}

function sf(e) {
    return {
        protocol: e.protocol,
        publicKey: e.publicKey || "",
        pass: e.pass || "",
        host: e.host,
        port: e.port || "",
        path: e.path || "",
        projectId: e.projectId
    }
}

function Dg(e) {
    if (!R) return !0;
    const {
        port: t,
        projectId: n,
        protocol: r
    } = e;
    return ["protocol", "publicKey", "host", "projectId"].find(i => e[i] ? !1 : (g.error(`Invalid Sentry Dsn: ${i} missing`), !0)) ? !1 : n.match(/^\d+$/) ? Lg(r) ? t && isNaN(parseInt(t, 10)) ? (g.error(`Invalid Sentry Dsn: Invalid port ${t}`), !1) : !0 : (g.error(`Invalid Sentry Dsn: Invalid protocol ${r}`), !1) : (g.error(`Invalid Sentry Dsn: Invalid projectId ${n}`), !1)
}

function Fg(e) {
    return e.match(Og) ?.[1]
}

function af(e) {
    const t = e.getOptions(),
        {
            host: n
        } = e.getDsn() || {};
    let r;
    return t.orgId ? r = String(t.orgId) : n && (r = Fg(n)), r
}

function cf(e) {
    const t = typeof e == "string" ? of (e) : sf(e);
    if (!(!t || !Dg(t))) return t
}

function wn(e) {
    if (typeof e == "boolean") return Number(e);
    const t = typeof e == "string" ? parseFloat(e) : e;
    if (!(typeof t != "number" || isNaN(t) || t < 0 || t > 1)) return t
}
const uf = new RegExp("^[ \\t]*([0-9a-f]{32})?-?([0-9a-f]{16})?-?([01])?[ \\t]*$");

function $g(e) {
    if (!e) return;
    const t = e.match(uf);
    if (!t) return;
    let n;
    return t[3] === "1" ? n = !0 : t[3] === "0" && (n = !1), {
        traceId: t[1],
        parentSampled: n,
        parentSpanId: t[2]
    }
}

function lf(e, t) {
    const n = $g(e),
        r = Ga(t);
    if (!n ?.traceId) return {
        traceId: _t(),
        sampleRand: Math.random()
    };
    const o = Bg(n, r);
    r && (r.sample_rand = o.toString());
    const {
        traceId: s,
        parentSpanId: i,
        parentSampled: a
    } = n;
    return {
        traceId: s,
        parentSpanId: i,
        sampled: a,
        dsc: r || {},
        sampleRand: o
    }
}

function df(e = _t(), t = Rt(), n) {
    let r = "";
    return n !== void 0 && (r = n ? "-1" : "-0"), `${e}-${t}${r}`
}

function ff(e = _t(), t = Rt(), n) {
    return `00-${e}-${t}-${n?"01":"00"}`
}

function Bg(e, t) {
    const n = wn(t ?.sample_rand);
    if (n !== void 0) return n;
    const r = wn(t ?.sample_rate);
    return r && e ?.parentSampled !== void 0 ? e.parentSampled ? Math.random() * r : r + Math.random() * (1 - r) : Math.random()
}

function Ug(e, t) {
    const n = af(e);
    return t && n && t !== n ? (g.log(`Won't continue trace because org IDs don't match (incoming baggage: ${t}, SDK options: ${n})`), !1) : (e.getOptions().strictTraceContinuation || !1) && (t && !n || !t && n) ? (g.log(`Starting a new trace because strict trace continuation is enabled but one org ID is missing (incoming baggage: ${t}, Sentry client: ${n})`), !1) : !0
}
const pf = 0,
    Va = 1;
let hu = !1;

function Hg(e) {
    const {
        spanId: t,
        traceId: n
    } = e.spanContext(), {
        data: r,
        op: o,
        parent_span_id: s,
        status: i,
        origin: a,
        links: c
    } = F(e);
    return {
        parent_span_id: s,
        span_id: t,
        trace_id: n,
        data: r,
        op: o,
        status: i,
        origin: a,
        links: c
    }
}

function hf(e) {
    const {
        spanId: t,
        traceId: n,
        isRemote: r
    } = e.spanContext(), o = r ? t : F(e).parent_span_id, s = ss(e).scope, i = r ? s ?.getPropagationContext().propagationSpanId || Rt() : t;
    return {
        parent_span_id: o,
        span_id: i,
        trace_id: n
    }
}

function Wg(e) {
    const {
        traceId: t,
        spanId: n
    } = e.spanContext(), r = un(e);
    return df(t, n, r)
}

function jg(e) {
    const {
        traceId: t,
        spanId: n
    } = e.spanContext(), r = un(e);
    return ff(t, n, r)
}

function mf(e) {
    if (e && e.length > 0) return e.map(({
        context: {
            spanId: t,
            traceId: n,
            traceFlags: r,
            ...o
        },
        attributes: s
    }) => ({
        span_id: t,
        trace_id: n,
        sampled: r === Va,
        attributes: s,
        ...o
    }))
}

function En(e) {
    return typeof e == "number" ? mu(e) : Array.isArray(e) ? e[0] + e[1] / 1e9 : e instanceof Date ? mu(e.getTime()) : he()
}

function mu(e) {
    return e > 9999999999 ? e / 1e3 : e
}

function F(e) {
    if (qg(e)) return e.getSpanJSON();
    const {
        spanId: t,
        traceId: n
    } = e.spanContext();
    if (zg(e)) {
        const {
            attributes: r,
            startTime: o,
            name: s,
            endTime: i,
            status: a,
            links: c
        } = e, u = "parentSpanId" in e ? e.parentSpanId : "parentSpanContext" in e ? e.parentSpanContext ?.spanId : void 0;
        return {
            span_id: t,
            trace_id: n,
            data: r,
            description: s,
            parent_span_id: u,
            start_timestamp: En(o),
            timestamp: En(i) || void 0,
            status: gf(a),
            op: r[pe],
            origin: r[G],
            links: mf(c)
        }
    }
    return {
        span_id: t,
        trace_id: n,
        start_timestamp: 0,
        data: {}
    }
}

function zg(e) {
    const t = e;
    return !!t.attributes && !!t.startTime && !!t.name && !!t.endTime && !!t.status
}

function qg(e) {
    return typeof e.getSpanJSON == "function"
}

function un(e) {
    const {
        traceFlags: t
    } = e.spanContext();
    return t === Va
}

function gf(e) {
    if (!(!e || e.code === Ig)) return e.code === Fs ? "ok" : e.message || "internal_error"
}
const vn = "_sentryChildSpans",
    na = "_sentryRootSpan";

function _f(e, t) {
    const n = e[na] || e;
    we(t, na, n), e[vn] ? e[vn].add(t) : we(e, vn, new Set([t]))
}

function Gg(e, t) {
    e[vn] && e[vn].delete(t)
}

function Do(e) {
    const t = new Set;

    function n(r) {
        if (!t.has(r) && un(r)) {
            t.add(r);
            const o = r[vn] ? Array.from(r[vn]) : [];
            for (const s of o) n(s)
        }
    }
    return n(e), Array.from(t)
}

function Se(e) {
    return e[na] || e
}

function Ee() {
    const e = Pt(),
        t = cn(e);
    return t.getActiveSpan ? t.getActiveSpan() : er(j())
}

function ra() {
    hu || (on(() => {
        console.warn("[Sentry] Returning null from `beforeSendSpan` is disallowed. To drop certain spans, configure the respective integrations directly or use `ignoreSpans`.")
    }), hu = !0)
}

function Nx(e, t) {
    e.updateName(t), e.setAttributes({
        [ae]: "custom",
        [ta]: t
    })
}
let gu = !1;

function Vg() {
    if (gu) return;

    function e() {
        const t = Ee(),
            n = t && Se(t);
        if (n) {
            const r = "internal_error";
            R && g.log(`[Tracing] Root span: ${r} -> Global error occurred`), n.setStatus({
                code: Z,
                message: r
            })
        }
    }
    e.tag = "sentry_tracingErrorCallback", gu = !0, jd(e), zd(e)
}

function Ze(e) {
    if (typeof __SENTRY_TRACING__ == "boolean" && !__SENTRY_TRACING__) return !1;
    const t = e || C() ?.getOptions();
    return !!t && (t.tracesSampleRate != null || !!t.tracesSampler)
}

function _u(e) {
    g.log(`Ignoring span ${e.op} - ${e.description} because it matches \`ignoreSpans\`.`)
}

function is(e, t) {
    if (!t ?.length || !e.description) return !1;
    for (const n of t) {
        if (Kg(n)) {
            if (Lo(e.description, n)) return R && _u(e), !0;
            continue
        }
        if (!n.name && !n.op) continue;
        const r = n.name ? Lo(e.description, n.name) : !0,
            o = n.op ? e.op && Lo(e.op, n.op) : !0;
        if (r && o) return R && _u(e), !0
    }
    return !1
}

function Jg(e, t) {
    const n = t.parent_span_id,
        r = t.span_id;
    if (n)
        for (const o of e) o.parent_span_id === r && (o.parent_span_id = n)
}

function Kg(e) {
    return typeof e == "string" || e instanceof RegExp
}
const $s = "production",
    yf = "_frozenDsc";

function Fo(e, t) {
    we(e, yf, t)
}

function Sf(e, t) {
    const n = t.getOptions(),
        {
            publicKey: r
        } = t.getDsn() || {},
        o = {
            environment: n.environment || $s,
            release: n.release,
            public_key: r,
            trace_id: e,
            org_id: af(t)
        };
    return t.emit("createDsc", o), o
}

function Ja(e, t) {
    const n = t.getPropagationContext();
    return n.dsc || Sf(n.traceId, e)
}

function ut(e) {
    const t = C();
    if (!t) return {};
    const n = Se(e),
        r = F(n),
        o = r.data,
        s = n.spanContext().traceState,
        i = s ?.get("sentry.sample_rate") ?? o[ja] ?? o[ef];

    function a(h) {
        return (typeof i == "number" || typeof i == "string") && (h.sample_rate = `${i}`), h
    }
    const c = n[yf];
    if (c) return a(c);
    const u = s ?.get("sentry.dsc"),
        d = u && Ga(u);
    if (d) return a(d);
    const l = Sf(e.spanContext().traceId, t),
        f = o[ae],
        p = r.description;
    return f !== "url" && p && (l.transaction = p), Ze() && (l.sampled = String(un(n)), l.sample_rand = s ?.get("sentry.sample_rand") ?? ss(n).scope ?.getPropagationContext().sampleRand.toString()), a(l), t.emit("createDsc", l, n), l
}

function Ox(e) {
    const t = ut(e);
    return rf(t)
}
class Nt {
    constructor(t = {}) {
        this._traceId = t.traceId || _t(), this._spanId = t.spanId || Rt()
    }
    spanContext() {
        return {
            spanId: this._spanId,
            traceId: this._traceId,
            traceFlags: pf
        }
    }
    end(t) {}
    setAttribute(t, n) {
        return this
    }
    setAttributes(t) {
        return this
    }
    setStatus(t) {
        return this
    }
    updateName(t) {
        return this
    }
    isRecording() {
        return !1
    }
    addEvent(t, n, r) {
        return this
    }
    addLink(t) {
        return this
    }
    addLinks(t) {
        return this
    }
    recordException(t, n) {}
}

function Ge(e, t = 100, n = 1 / 0) {
    try {
        return oa("", e, t, n)
    } catch (r) {
        return {
            ERROR: `**non-serializable** (${r})`
        }
    }
}

function bf(e, t = 3, n = 100 * 1024) {
    const r = Ge(e, t);
    return Zg(r) > n ? bf(e, t - 1, n) : r
}

function oa(e, t, n = 1 / 0, r = 1 / 0, o = e_()) {
    const [s, i] = o;
    if (t == null || ["boolean", "string"].includes(typeof t) || typeof t == "number" && Number.isFinite(t)) return t;
    const a = Yg(e, t);
    if (!a.startsWith("[object ")) return a;
    if (t.__sentry_skip_normalization__) return t;
    const c = typeof t.__sentry_override_normalization_depth__ == "number" ? t.__sentry_override_normalization_depth__ : n;
    if (c === 0) return a.replace("object ", "");
    if (s(t)) return "[Circular ~]";
    const u = t;
    if (u && typeof u.toJSON == "function") try {
        const p = u.toJSON();
        return oa("", p, c - 1, r, o)
    } catch {}
    const d = Array.isArray(t) ? [] : {};
    let l = 0;
    const f = Yd(t);
    for (const p in f) {
        if (!Object.prototype.hasOwnProperty.call(f, p)) continue;
        if (l >= r) {
            d[p] = "[MaxProperties ~]";
            break
        }
        const h = f[p];
        d[p] = oa(p, h, c - 1, r, o), l++
    }
    return i(t), d
}

function Yg(e, t) {
    try {
        if (e === "domain" && t && typeof t == "object" && t._events) return "[Domain]";
        if (e === "domainEmitter") return "[DomainEmitter]";
        if (typeof global < "u" && t === global) return "[Global]";
        if (typeof window < "u" && t === window) return "[Window]";
        if (typeof document < "u" && t === document) return "[Document]";
        if (Vd(t)) return Wd(t);
        if (tg(t)) return "[SyntheticEvent]";
        if (typeof t == "number" && !Number.isFinite(t)) return `[${t}]`;
        if (typeof t == "function") return `[Function: ${At(t)}]`;
        if (typeof t == "symbol") return `[${String(t)}]`;
        if (typeof t == "bigint") return `[BigInt: ${String(t)}]`;
        const n = Xg(t);
        return /^HTML(\w*)Element$/.test(n) ? `[HTMLElement: ${n}]` : `[object ${n}]`
    } catch (n) {
        return `**non-serializable** (${n})`
    }
}

function Xg(e) {
    const t = Object.getPrototypeOf(e);
    return t ?.constructor ? t.constructor.name : "null prototype"
}

function Qg(e) {
    return ~-encodeURI(e).split(/%..|./).length
}

function Zg(e) {
    return Qg(JSON.stringify(e))
}

function e_() {
    const e = new WeakSet;

    function t(r) {
        return e.has(r) ? !0 : (e.add(r), !1)
    }

    function n(r) {
        e.delete(r)
    }
    return [t, n]
}

function lt(e, t = []) {
    return [e, t]
}

function t_(e, t) {
    const [n, r] = e;
    return [n, [...r, t]]
}

function kn(e, t) {
    const n = e[1];
    for (const r of n) {
        const o = r[0].type;
        if (t(r, o)) return !0
    }
    return !1
}

function yu(e, t) {
    return kn(e, (n, r) => t.includes(r))
}

function as(e) {
    const t = qr($);
    return t.encodePolyfill ? t.encodePolyfill(e) : new TextEncoder().encode(e)
}

function n_(e) {
    const t = qr($);
    return t.decodePolyfill ? t.decodePolyfill(e) : new TextDecoder().decode(e)
}

function cs(e) {
    const [t, n] = e;
    let r = JSON.stringify(t);

    function o(s) {
        typeof r == "string" ? r = typeof s == "string" ? r + s : [as(r), s] : r.push(typeof s == "string" ? as(s) : s)
    }
    for (const s of n) {
        const [i, a] = s;
        if (o(`
${JSON.stringify(i)}
`), typeof a == "string" || a instanceof Uint8Array) o(a);
        else {
            let c;
            try {
                c = JSON.stringify(a)
            } catch {
                c = JSON.stringify(Ge(a))
            }
            o(c)
        }
    }
    return typeof r == "string" ? r : r_(r)
}

function r_(e) {
    const t = e.reduce((o, s) => o + s.length, 0),
        n = new Uint8Array(t);
    let r = 0;
    for (const o of e) n.set(o, r), r += o.length;
    return n
}

function o_(e) {
    let t = typeof e == "string" ? as(e) : e;

    function n(i) {
        const a = t.subarray(0, i);
        return t = t.subarray(i + 1), a
    }

    function r() {
        let i = t.indexOf(10);
        return i < 0 && (i = t.length), JSON.parse(n_(n(i)))
    }
    const o = r(),
        s = [];
    for (; t.length;) {
        const i = r(),
            a = typeof i.length == "number" ? i.length : void 0;
        s.push([i, a ? n(a) : r()])
    }
    return [o, s]
}

function s_(e) {
    return [{
        type: "span"
    }, e]
}

function i_(e) {
    const t = typeof e.data == "string" ? as(e.data) : e.data;
    return [{
        type: "attachment",
        length: t.length,
        filename: e.filename,
        content_type: e.contentType,
        attachment_type: e.attachmentType
    }, t]
}
const a_ = {
    session: "session",
    sessions: "session",
    attachment: "attachment",
    transaction: "transaction",
    event: "error",
    client_report: "internal",
    user_report: "default",
    profile: "profile",
    profile_chunk: "profile",
    replay_event: "replay",
    replay_recording: "replay",
    check_in: "monitor",
    feedback: "feedback",
    span: "span",
    raw_security: "security",
    log: "log_item",
    metric: "metric",
    trace_metric: "metric"
};

function Su(e) {
    return a_[e]
}

function Bs(e) {
    if (!e ?.sdk) return;
    const {
        name: t,
        version: n
    } = e.sdk;
    return {
        name: t,
        version: n
    }
}

function Ef(e, t, n, r) {
    const o = e.sdkProcessingMetadata ?.dynamicSamplingContext;
    return {
        event_id: e.event_id,
        sent_at: new Date().toISOString(),
        ...t && {
            sdk: t
        },
        ...!!n && r && {
            dsn: Lt(r)
        },
        ...o && {
            trace: o
        }
    }
}

function c_(e, t) {
    if (!t) return e;
    const n = e.sdk || {};
    return e.sdk = { ...n,
        name: n.name || t.name,
        version: n.version || t.version,
        integrations: [...e.sdk ?.integrations || [], ...t.integrations || []],
        packages: [...e.sdk ?.packages || [], ...t.packages || []],
        settings: e.sdk ?.settings || t.settings ? { ...e.sdk ?.settings,
            ...t.settings
        } : void 0
    }, e
}

function u_(e, t, n, r) {
    const o = Bs(n),
        s = {
            sent_at: new Date().toISOString(),
            ...o && {
                sdk: o
            },
            ...!!r && t && {
                dsn: Lt(t)
            }
        },
        i = "aggregates" in e ? [{
            type: "sessions"
        }, e] : [{
            type: "session"
        }, e.toJSON()];
    return lt(s, [i])
}

function l_(e, t, n, r) {
    const o = Bs(n),
        s = e.type && e.type !== "replay_event" ? e.type : "event";
    c_(e, n ?.sdk);
    const i = Ef(e, o, r, t);
    return delete e.sdkProcessingMetadata, lt(i, [
        [{
            type: s
        }, e]
    ])
}

function d_(e, t) {
    function n(p) {
        return !!p.trace_id && !!p.public_key
    }
    const r = ut(e[0]),
        o = t ?.getDsn(),
        s = t ?.getOptions().tunnel,
        i = {
            sent_at: new Date().toISOString(),
            ...n(r) && {
                trace: r
            },
            ...!!s && o && {
                dsn: Lt(o)
            }
        },
        {
            beforeSendSpan: a,
            ignoreSpans: c
        } = t ?.getOptions() || {},
        u = c ?.length ? e.filter(p => !is(F(p), c)) : e,
        d = e.length - u.length;
    d && t ?.recordDroppedEvent("before_send", "span", d);
    const l = a ? p => {
            const h = F(p),
                m = a(h);
            return m || (ra(), h)
        } : F,
        f = [];
    for (const p of u) {
        const h = l(p);
        h && f.push(s_(h))
    }
    return lt(i, f)
}

function f_(e) {
    if (!R) return;
    const {
        description: t = "< unknown name >",
        op: n = "< unknown op >",
        parent_span_id: r
    } = F(e), {
        spanId: o
    } = e.spanContext(), s = un(e), i = Se(e), a = i === e, c = `[Tracing] Starting ${s?"sampled":"unsampled"} ${a?"root ":""}span`, u = [`op: ${n}`, `name: ${t}`, `ID: ${o}`];
    if (r && u.push(`parent ID: ${r}`), !a) {
        const {
            op: d,
            description: l
        } = F(i);
        u.push(`root ID: ${i.spanContext().spanId}`), d && u.push(`root op: ${d}`), l && u.push(`root description: ${l}`)
    }
    g.log(`${c}
  ${u.join(`
  `)}`)
}

function p_(e) {
    if (!R) return;
    const {
        description: t = "< unknown name >",
        op: n = "< unknown op >"
    } = F(e), {
        spanId: r
    } = e.spanContext(), s = Se(e) === e, i = `[Tracing] Finishing "${n}" ${s?"root ":""}span "${t}" with ID ${r}`;
    g.log(i)
}

function h_(e, t, n, r = Ee()) {
    const o = r && Se(r);
    o && (R && g.log(`[Measurement] Setting measurement on root span: ${e} = ${t} ${n}`), o.addEvent(e, {
        [Jr]: t,
        [Vr]: n
    }))
}

function bu(e) {
    if (!e || e.length === 0) return;
    const t = {};
    return e.forEach(n => {
        const r = n.attributes || {},
            o = r[Vr],
            s = r[Jr];
        typeof o == "string" && typeof s == "number" && (t[n.name] = {
            value: s,
            unit: o
        })
    }), t
}
const Eu = 1e3;
class Us {
    constructor(t = {}) {
        this._traceId = t.traceId || _t(), this._spanId = t.spanId || Rt(), this._startTime = t.startTimestamp || he(), this._links = t.links, this._attributes = {}, this.setAttributes({
            [G]: "manual",
            [pe]: t.op,
            ...t.attributes
        }), this._name = t.name, t.parentSpanId && (this._parentSpanId = t.parentSpanId), "sampled" in t && (this._sampled = t.sampled), t.endTimestamp && (this._endTime = t.endTimestamp), this._events = [], this._isStandaloneSpan = t.isStandalone, this._endTime && this._onSpanEnded()
    }
    addLink(t) {
        return this._links ? this._links.push(t) : this._links = [t], this
    }
    addLinks(t) {
        return this._links ? this._links.push(...t) : this._links = t, this
    }
    recordException(t, n) {}
    spanContext() {
        const {
            _spanId: t,
            _traceId: n,
            _sampled: r
        } = this;
        return {
            spanId: t,
            traceId: n,
            traceFlags: r ? Va : pf
        }
    }
    setAttribute(t, n) {
        return n === void 0 ? delete this._attributes[t] : this._attributes[t] = n, this
    }
    setAttributes(t) {
        return Object.keys(t).forEach(n => this.setAttribute(n, t[n])), this
    }
    updateStartTime(t) {
        this._startTime = En(t)
    }
    setStatus(t) {
        return this._status = t, this
    }
    updateName(t) {
        return this._name = t, this.setAttribute(ae, "custom"), this
    }
    end(t) {
        this._endTime || (this._endTime = En(t), p_(this), this._onSpanEnded())
    }
    getSpanJSON() {
        return {
            data: this._attributes,
            description: this._name,
            op: this._attributes[pe],
            parent_span_id: this._parentSpanId,
            span_id: this._spanId,
            start_timestamp: this._startTime,
            status: gf(this._status),
            timestamp: this._endTime,
            trace_id: this._traceId,
            origin: this._attributes[G],
            profile_id: this._attributes[za],
            exclusive_time: this._attributes[gr],
            measurements: bu(this._events),
            is_segment: this._isStandaloneSpan && Se(this) === this || void 0,
            segment_id: this._isStandaloneSpan ? Se(this).spanContext().spanId : void 0,
            links: mf(this._links)
        }
    }
    isRecording() {
        return !this._endTime && !!this._sampled
    }
    addEvent(t, n, r) {
        R && g.log("[Tracing] Adding an event to span:", t);
        const o = vu(n) ? n : r || he(),
            s = vu(n) ? {} : n || {},
            i = {
                name: t,
                time: En(o),
                attributes: s
            };
        return this._events.push(i), this
    }
    isStandaloneSpan() {
        return !!this._isStandaloneSpan
    }
    _onSpanEnded() {
        const t = C();
        if (t && t.emit("spanEnd", this), !(this._isStandaloneSpan || this === Se(this))) return;
        if (this._isStandaloneSpan) {
            this._sampled ? g_(d_([this], t)) : (R && g.log("[Tracing] Discarding standalone span because its trace was not chosen to be sampled."), t && t.recordDroppedEvent("sample_rate", "span"));
            return
        }
        const r = this._convertSpanToTransaction();
        r && (ss(this).scope || j()).captureEvent(r)
    }
    _convertSpanToTransaction() {
        if (!Tu(F(this))) return;
        this._name || (R && g.warn("Transaction has no name, falling back to `<unlabeled transaction>`."), this._name = "<unlabeled transaction>");
        const {
            scope: t,
            isolationScope: n
        } = ss(this), r = t ?.getScopeData().sdkProcessingMetadata ?.normalizedRequest;
        if (this._sampled !== !0) return;
        const s = Do(this).filter(d => d !== this && !m_(d)).map(d => F(d)).filter(Tu),
            i = this._attributes[ae];
        delete this._attributes[ta], s.forEach(d => {
            delete d.data[ta]
        });
        const a = {
                contexts: {
                    trace: Hg(this)
                },
                spans: s.length > Eu ? s.sort((d, l) => d.start_timestamp - l.start_timestamp).slice(0, Eu) : s,
                start_timestamp: this._startTime,
                timestamp: this._endTime,
                transaction: this._name,
                type: "transaction",
                sdkProcessingMetadata: {
                    capturedSpanScope: t,
                    capturedSpanIsolationScope: n,
                    dynamicSamplingContext: ut(this)
                },
                request: r,
                ...i && {
                    transaction_info: {
                        source: i
                    }
                }
            },
            c = bu(this._events);
        return c && Object.keys(c).length && (R && g.log("[Measurements] Adding measurements to transaction event", JSON.stringify(c, void 0, 2)), a.measurements = c), a
    }
}

function vu(e) {
    return e && typeof e == "number" || e instanceof Date || Array.isArray(e)
}

function Tu(e) {
    return !!e.start_timestamp && !!e.timestamp && !!e.span_id && !!e.trace_id
}

function m_(e) {
    return e instanceof Us && e.isStandaloneSpan()
}

function g_(e) {
    const t = C();
    if (!t) return;
    const n = e[1];
    if (!n || n.length === 0) {
        t.recordDroppedEvent("before_send", "span");
        return
    }
    t.sendEnvelope(e)
}

function Hs(e, t, n = () => {}, r = () => {}) {
    let o;
    try {
        o = e()
    } catch (s) {
        throw t(s), n(), s
    }
    return __(o, t, n, r)
}

function __(e, t, n, r) {
    return Pn(e) ? e.then(o => (n(), r(o), o), o => {
        throw t(o), n(), o
    }) : (n(), r(e), e)
}

function y_(e, t, n) {
    if (!Ze(e)) return [!1];
    let r, o;
    typeof e.tracesSampler == "function" ? (o = e.tracesSampler({ ...t,
        inheritOrSampleWith: a => typeof t.parentSampleRate == "number" ? t.parentSampleRate : typeof t.parentSampled == "boolean" ? Number(t.parentSampled) : a
    }), r = !0) : t.parentSampled !== void 0 ? o = t.parentSampled : typeof e.tracesSampleRate < "u" && (o = e.tracesSampleRate, r = !0);
    const s = wn(o);
    if (s === void 0) return R && g.warn(`[Tracing] Discarding root span because of invalid sample rate. Sample rate must be a boolean or a number between 0 and 1. Got ${JSON.stringify(o)} of type ${JSON.stringify(typeof o)}.`), [!1];
    if (!s) return R && g.log(`[Tracing] Discarding transaction because ${typeof e.tracesSampler=="function"?"tracesSampler returned 0 or false":"a negative sampling decision was inherited or tracesSampleRate is set to 0"}`), [!1, s, r];
    const i = n < s;
    return i || R && g.log(`[Tracing] Discarding transaction because it's not included in the random sample (sampling rate = ${Number(o)})`), [i, s, r]
}
const us = "__SENTRY_SUPPRESS_TRACING__";

function ln(e, t) {
    const n = Kr();
    if (n.startSpan) return n.startSpan(e, t);
    const r = Ya(e),
        {
            forceTransaction: o,
            parentSpan: s,
            scope: i
        } = e,
        a = i ?.clone();
    return Ke(a, () => vf(s)(() => {
        const u = j(),
            d = Xa(u, s),
            f = e.onlyIfParent && !d ? new Nt : Ka({
                parentSpan: d,
                spanArguments: r,
                forceTransaction: o,
                scope: u
            });
        return yt(u, f), Hs(() => t(f), () => {
            const {
                status: p
            } = F(f);
            f.isRecording() && (!p || p === "ok") && f.setStatus({
                code: Z,
                message: "internal_error"
            })
        }, () => {
            f.end()
        })
    }))
}

function jt(e, t) {
    const n = Kr();
    if (n.startSpanManual) return n.startSpanManual(e, t);
    const r = Ya(e),
        {
            forceTransaction: o,
            parentSpan: s,
            scope: i
        } = e,
        a = i ?.clone();
    return Ke(a, () => vf(s)(() => {
        const u = j(),
            d = Xa(u, s),
            f = e.onlyIfParent && !d ? new Nt : Ka({
                parentSpan: d,
                spanArguments: r,
                forceTransaction: o,
                scope: u
            });
        return yt(u, f), Hs(() => t(f, () => f.end()), () => {
            const {
                status: p
            } = F(f);
            f.isRecording() && (!p || p === "ok") && f.setStatus({
                code: Z,
                message: "internal_error"
            })
        })
    }))
}

function at(e) {
    const t = Kr();
    if (t.startInactiveSpan) return t.startInactiveSpan(e);
    const n = Ya(e),
        {
            forceTransaction: r,
            parentSpan: o
        } = e;
    return (e.scope ? i => Ke(e.scope, i) : o !== void 0 ? i => nr(o, i) : i => i())(() => {
        const i = j(),
            a = Xa(i, o);
        return e.onlyIfParent && !a ? new Nt : Ka({
            parentSpan: a,
            spanArguments: n,
            forceTransaction: r,
            scope: i
        })
    })
}
const Px = (e, t) => {
    const n = Pt(),
        r = cn(n);
    if (r.continueTrace) return r.continueTrace(e, t);
    const {
        sentryTrace: o,
        baggage: s
    } = e, i = C(), a = Ga(s);
    return i && !Ug(i, a ?.org_id) ? b_(t) : Ke(c => {
        const u = lf(o, s);
        return c.setPropagationContext(u), yt(c, void 0), t()
    })
};

function nr(e, t) {
    const n = Kr();
    return n.withActiveSpan ? n.withActiveSpan(e, t) : Ke(r => (yt(r, e || void 0), t(r)))
}

function S_(e) {
    const t = Kr();
    return t.suppressTracing ? t.suppressTracing(e) : Ke(n => {
        n.setSDKProcessingMetadata({
            [us]: !0
        });
        const r = e();
        return n.setSDKProcessingMetadata({
            [us]: void 0
        }), r
    })
}

function b_(e) {
    return Ke(t => (t.setPropagationContext({
        traceId: _t(),
        sampleRand: Math.random()
    }), R && g.log(`Starting a new trace with id ${t.getPropagationContext().traceId}`), nr(null, e)))
}

function Ka({
    parentSpan: e,
    spanArguments: t,
    forceTransaction: n,
    scope: r
}) {
    if (!Ze()) {
        const i = new Nt;
        if (n || !e) {
            const a = {
                sampled: "false",
                sample_rate: "0",
                transaction: t.name,
                ...ut(i)
            };
            Fo(i, a)
        }
        return i
    }
    const o = ke();
    let s;
    if (e && !n) s = E_(e, r, t), _f(e, s);
    else if (e) {
        const i = ut(e),
            {
                traceId: a,
                spanId: c
            } = e.spanContext(),
            u = un(e);
        s = Iu({
            traceId: a,
            parentSpanId: c,
            ...t
        }, r, u), Fo(s, i)
    } else {
        const {
            traceId: i,
            dsc: a,
            parentSpanId: c,
            sampled: u
        } = { ...o.getPropagationContext(),
            ...r.getPropagationContext()
        };
        s = Iu({
            traceId: i,
            parentSpanId: c,
            ...t
        }, r, u), a && Fo(s, a)
    }
    return f_(s), Cg(s, r, o), s
}

function Ya(e) {
    const n = {
        isStandalone: (e.experimental || {}).standalone,
        ...e
    };
    if (e.startTime) {
        const r = { ...n
        };
        return r.startTimestamp = En(e.startTime), delete r.startTime, r
    }
    return n
}

function Kr() {
    const e = Pt();
    return cn(e)
}

function Iu(e, t, n) {
    const r = C(),
        o = r ?.getOptions() || {},
        {
            name: s = ""
        } = e,
        i = {
            spanAttributes: { ...e.attributes
            },
            spanName: s,
            parentSampled: n
        };
    r ?.emit("beforeSampling", i, {
        decision: !1
    });
    const a = i.parentSampled ?? n,
        c = i.spanAttributes,
        u = t.getPropagationContext(),
        [d, l, f] = t.getScopeData().sdkProcessingMetadata[us] ? [!1] : y_(o, {
            name: s,
            parentSampled: a,
            attributes: c,
            parentSampleRate: wn(u.dsc ?.sample_rate)
        }, u.sampleRand),
        p = new Us({ ...e,
            attributes: {
                [ae]: "custom",
                [ja]: l !== void 0 && f ? l : void 0,
                ...c
            },
            sampled: d
        });
    return !d && r && (R && g.log("[Tracing] Discarding root span because its trace was not chosen to be sampled."), r.recordDroppedEvent("sample_rate", "transaction")), r && r.emit("spanStart", p), p
}

function E_(e, t, n) {
    const {
        spanId: r,
        traceId: o
    } = e.spanContext(), s = t.getScopeData().sdkProcessingMetadata[us] ? !1 : un(e), i = s ? new Us({ ...n,
        parentSpanId: r,
        traceId: o,
        sampled: s
    }) : new Nt({
        traceId: o
    });
    _f(e, i);
    const a = C();
    return a && (a.emit("spanStart", i), n.endTimestamp && a.emit("spanEnd", i)), i
}

function Xa(e, t) {
    if (t) return t;
    if (t === null) return;
    const n = er(e);
    if (!n) return;
    const r = C();
    return (r ? r.getOptions() : {}).parentSpanIsAlwaysRootSpan ? Se(n) : n
}

function vf(e) {
    return e !== void 0 ? t => nr(e, t) : t => t()
}
const $o = {
        idleTimeout: 1e3,
        finalTimeout: 3e4,
        childSpanTimeout: 15e3
    },
    v_ = "heartbeatFailed",
    T_ = "idleTimeout",
    I_ = "finalTimeout",
    w_ = "externalFinish";

function Tf(e, t = {}) {
    const n = new Map;
    let r = !1,
        o, s = w_,
        i = !t.disableAutoFinish;
    const a = [],
        {
            idleTimeout: c = $o.idleTimeout,
            finalTimeout: u = $o.finalTimeout,
            childSpanTimeout: d = $o.childSpanTimeout,
            beforeSpanEnd: l,
            trimIdleSpanEndTimestamp: f = !0
        } = t,
        p = C();
    if (!p || !Ze()) {
        const S = new Nt,
            x = {
                sample_rate: "0",
                sampled: "false",
                ...ut(S)
            };
        return Fo(S, x), S
    }
    const h = j(),
        m = Ee(),
        _ = k_(e);
    _.end = new Proxy(_.end, {
        apply(S, x, B) {
            if (l && l(_), x instanceof Nt) return;
            const [E, ...O] = B, k = E || he(), P = En(k), D = Do(_).filter(w => w !== _), ee = F(_);
            if (!D.length || !f) return A(P), Reflect.apply(S, x, [P, ...O]);
            const Y = p.getOptions().ignoreSpans,
                ne = D ?.reduce((w, V) => {
                    const se = F(V);
                    return !se.timestamp || Y && is(se, Y) ? w : w ? Math.max(w, se.timestamp) : se.timestamp
                }, void 0),
                v = ee.start_timestamp,
                z = Math.min(v ? v + u / 1e3 : 1 / 0, Math.max(v || -1 / 0, Math.min(P, ne || 1 / 0)));
            return A(z), Reflect.apply(S, x, [z, ...O])
        }
    });

    function y() {
        o && (clearTimeout(o), o = void 0)
    }

    function b(S) {
        y(), o = setTimeout(() => {
            !r && n.size === 0 && i && (s = T_, _.end(S))
        }, c)
    }

    function N(S) {
        o = setTimeout(() => {
            !r && i && (s = v_, _.end(S))
        }, d)
    }

    function T(S) {
        y(), n.set(S, !0);
        const x = he();
        N(x + d / 1e3)
    }

    function L(S) {
        if (n.has(S) && n.delete(S), n.size === 0) {
            const x = he();
            b(x + c / 1e3)
        }
    }

    function A(S) {
        r = !0, n.clear(), a.forEach(D => D()), yt(h, m);
        const x = F(_),
            {
                start_timestamp: B
            } = x;
        if (!B) return;
        x.data[Fr] || _.setAttribute(Fr, s);
        const O = x.status;
        (!O || O === "unknown") && _.setStatus({
            code: Fs
        }), g.log(`[Tracing] Idle span "${x.op}" finished`);
        const k = Do(_).filter(D => D !== _);
        let P = 0;
        k.forEach(D => {
            D.isRecording() && (D.setStatus({
                code: Z,
                message: "cancelled"
            }), D.end(S), R && g.log("[Tracing] Cancelling span since span ended early", JSON.stringify(D, void 0, 2)));
            const ee = F(D),
                {
                    timestamp: Y = 0,
                    start_timestamp: ne = 0
                } = ee,
                v = ne <= S,
                z = (u + c) / 1e3,
                w = Y - ne <= z;
            if (R) {
                const V = JSON.stringify(D, void 0, 2);
                v ? w || g.log("[Tracing] Discarding span since it finished after idle span final timeout", V) : g.log("[Tracing] Discarding span since it happened after idle span was finished", V)
            }(!w || !v) && (Gg(_, D), P++)
        }), P > 0 && _.setAttribute("sentry.idle_span_discarded_spans", P)
    }
    return a.push(p.on("spanStart", S => {
        if (r || S === _ || F(S).timestamp || S instanceof Us && S.isStandaloneSpan()) return;
        Do(_).includes(S) && T(S.spanContext().spanId)
    })), a.push(p.on("spanEnd", S => {
        r || L(S.spanContext().spanId)
    })), a.push(p.on("idleSpanEnableAutoFinish", S => {
        S === _ && (i = !0, b(), n.size && N())
    })), t.disableAutoFinish || b(), setTimeout(() => {
        r || (_.setStatus({
            code: Z,
            message: "deadline_exceeded"
        }), s = I_, _.end())
    }, u), _
}

function k_(e) {
    const t = at(e);
    return yt(j(), t), R && g.log("[Tracing] Started span is an idle span"), t
}
const Ii = 0,
    wu = 1,
    ku = 2;

function Ws(e) {
    return new $r(t => {
        t(e)
    })
}

function Qa(e) {
    return new $r((t, n) => {
        n(e)
    })
}
class $r {
    constructor(t) {
        this._state = Ii, this._handlers = [], this._runExecutor(t)
    }
    then(t, n) {
        return new $r((r, o) => {
            this._handlers.push([!1, s => {
                if (!t) r(s);
                else try {
                    r(t(s))
                } catch (i) {
                    o(i)
                }
            }, s => {
                if (!n) o(s);
                else try {
                    r(n(s))
                } catch (i) {
                    o(i)
                }
            }]), this._executeHandlers()
        })
    } catch (t) {
        return this.then(n => n, t)
    } finally(t) {
        return new $r((n, r) => {
            let o, s;
            return this.then(i => {
                s = !1, o = i, t && t()
            }, i => {
                s = !0, o = i, t && t()
            }).then(() => {
                if (s) {
                    r(o);
                    return
                }
                n(o)
            })
        })
    }
    _executeHandlers() {
        if (this._state === Ii) return;
        const t = this._handlers.slice();
        this._handlers = [], t.forEach(n => {
            n[0] || (this._state === wu && n[1](this._value), this._state === ku && n[2](this._value), n[0] = !0)
        })
    }
    _runExecutor(t) {
        const n = (s, i) => {
                if (this._state === Ii) {
                    if (Pn(i)) {
                        i.then(r, o);
                        return
                    }
                    this._state = s, this._value = i, this._executeHandlers()
                }
            },
            r = s => {
                n(wu, s)
            },
            o = s => {
                n(ku, s)
            };
        try {
            t(r, o)
        } catch (s) {
            o(s)
        }
    }
}

function R_(e, t, n, r = 0) {
    try {
        const o = sa(t, n, e, r);
        return Pn(o) ? o : Ws(o)
    } catch (o) {
        return Qa(o)
    }
}

function sa(e, t, n, r) {
    const o = n[r];
    if (!e || !o) return e;
    const s = o({ ...e
    }, t);
    return R && s === null && g.log(`Event processor "${o.id||"?"}" dropped event`), Pn(s) ? s.then(i => sa(i, t, n, r + 1)) : sa(s, t, n, r + 1)
}

function C_(e, t) {
    const {
        fingerprint: n,
        span: r,
        breadcrumbs: o,
        sdkProcessingMetadata: s
    } = t;
    A_(e, t), r && N_(e, r), O_(e, n), x_(e, o), M_(e, s)
}

function rr(e, t) {
    const {
        extra: n,
        tags: r,
        attributes: o,
        user: s,
        contexts: i,
        level: a,
        sdkProcessingMetadata: c,
        breadcrumbs: u,
        fingerprint: d,
        eventProcessors: l,
        attachments: f,
        propagationContext: p,
        transactionName: h,
        span: m
    } = t;
    wr(e, "extra", n), wr(e, "tags", r), wr(e, "attributes", o), wr(e, "user", s), wr(e, "contexts", i), e.sdkProcessingMetadata = Gr(e.sdkProcessingMetadata, c, 2), a && (e.level = a), h && (e.transactionName = h), m && (e.span = m), u.length && (e.breadcrumbs = [...e.breadcrumbs, ...u]), d.length && (e.fingerprint = [...e.fingerprint, ...d]), l.length && (e.eventProcessors = [...e.eventProcessors, ...l]), f.length && (e.attachments = [...e.attachments, ...f]), e.propagationContext = { ...e.propagationContext,
        ...p
    }
}

function wr(e, t, n) {
    e[t] = Gr(e[t], n, 1)
}

function A_(e, t) {
    const {
        extra: n,
        tags: r,
        user: o,
        contexts: s,
        level: i,
        transactionName: a
    } = t;
    Object.keys(n).length && (e.extra = { ...n,
        ...e.extra
    }), Object.keys(r).length && (e.tags = { ...r,
        ...e.tags
    }), Object.keys(o).length && (e.user = { ...o,
        ...e.user
    }), Object.keys(s).length && (e.contexts = { ...s,
        ...e.contexts
    }), i && (e.level = i), a && e.type !== "transaction" && (e.transaction = a)
}

function x_(e, t) {
    const n = [...e.breadcrumbs || [], ...t];
    e.breadcrumbs = n.length ? n : void 0
}

function M_(e, t) {
    e.sdkProcessingMetadata = { ...e.sdkProcessingMetadata,
        ...t
    }
}

function N_(e, t) {
    e.contexts = {
        trace: hf(t),
        ...e.contexts
    }, e.sdkProcessingMetadata = {
        dynamicSamplingContext: ut(t),
        ...e.sdkProcessingMetadata
    };
    const n = Se(t),
        r = F(n).description;
    r && !e.transaction && e.type === "transaction" && (e.transaction = r)
}

function O_(e, t) {
    e.fingerprint = e.fingerprint ? Array.isArray(e.fingerprint) ? e.fingerprint : [e.fingerprint] : [], t && (e.fingerprint = e.fingerprint.concat(t)), e.fingerprint.length || delete e.fingerprint
}
let fn, Ru, Cu, Bt;

function If(e) {
    const t = $._sentryDebugIds,
        n = $._debugIds;
    if (!t && !n) return {};
    const r = t ? Object.keys(t) : [],
        o = n ? Object.keys(n) : [];
    if (Bt && r.length === Ru && o.length === Cu) return Bt;
    Ru = r.length, Cu = o.length, Bt = {}, fn || (fn = {});
    const s = (i, a) => {
        for (const c of i) {
            const u = a[c],
                d = fn ?.[c];
            if (d && Bt && u) Bt[d[0]] = u, fn && (fn[c] = [d[0], u]);
            else if (u) {
                const l = e(c);
                for (let f = l.length - 1; f >= 0; f--) {
                    const h = l[f] ?.filename;
                    if (h && Bt && fn) {
                        Bt[h] = u, fn[c] = [h, u];
                        break
                    }
                }
            }
        }
    };
    return t && s(r, t), n && s(o, n), Bt
}

function P_(e, t) {
    const n = If(e);
    if (!n) return [];
    const r = [];
    for (const o of t) o && n[o] && r.push({
        type: "sourcemap",
        code_file: o,
        debug_id: n[o]
    });
    return r
}

function wf(e, t, n, r, o, s) {
    const {
        normalizeDepth: i = 3,
        normalizeMaxBreadth: a = 1e3
    } = e, c = { ...t,
        event_id: t.event_id || n.event_id || Ie(),
        timestamp: t.timestamp || Dn()
    }, u = n.integrations || e.integrations.map(_ => _.name);
    L_(c, e), $_(c, u), o && o.emit("applyFrameMetadata", t), t.type === void 0 && D_(c, e.stackParser);
    const d = U_(r, n.captureContext);
    n.mechanism && Mt(c, n.mechanism);
    const l = o ? o.getEventProcessors() : [],
        f = Gt().getScopeData();
    if (s) {
        const _ = s.getScopeData();
        rr(f, _)
    }
    if (d) {
        const _ = d.getScopeData();
        rr(f, _)
    }
    const p = [...n.attachments || [], ...f.attachments];
    p.length && (n.attachments = p), C_(c, f);
    const h = [...l, ...f.eventProcessors];
    return R_(h, c, n).then(_ => (_ && F_(_), typeof i == "number" && i > 0 ? B_(_, i, a) : _))
}

function L_(e, t) {
    const {
        environment: n,
        release: r,
        dist: o,
        maxValueLength: s
    } = t;
    e.environment = e.environment || n || $s, !e.release && r && (e.release = r), !e.dist && o && (e.dist = o);
    const i = e.request;
    i ?.url && s && (i.url = Dr(i.url, s)), s && e.exception ?.values ?.forEach(a => {
        a.value && (a.value = Dr(a.value, s))
    })
}

function D_(e, t) {
    const n = If(t);
    e.exception ?.values ?.forEach(r => {
        r.stacktrace ?.frames ?.forEach(o => {
            o.filename && (o.debug_id = n[o.filename])
        })
    })
}

function F_(e) {
    const t = {};
    if (e.exception ?.values ?.forEach(r => {
            r.stacktrace ?.frames ?.forEach(o => {
                o.debug_id && (o.abs_path ? t[o.abs_path] = o.debug_id : o.filename && (t[o.filename] = o.debug_id), delete o.debug_id)
            })
        }), Object.keys(t).length === 0) return;
    e.debug_meta = e.debug_meta || {}, e.debug_meta.images = e.debug_meta.images || [];
    const n = e.debug_meta.images;
    Object.entries(t).forEach(([r, o]) => {
        n.push({
            type: "sourcemap",
            code_file: r,
            debug_id: o
        })
    })
}

function $_(e, t) {
    t.length > 0 && (e.sdk = e.sdk || {}, e.sdk.integrations = [...e.sdk.integrations || [], ...t])
}

function B_(e, t, n) {
    if (!e) return null;
    const r = { ...e,
        ...e.breadcrumbs && {
            breadcrumbs: e.breadcrumbs.map(o => ({ ...o,
                ...o.data && {
                    data: Ge(o.data, t, n)
                }
            }))
        },
        ...e.user && {
            user: Ge(e.user, t, n)
        },
        ...e.contexts && {
            contexts: Ge(e.contexts, t, n)
        },
        ...e.extra && {
            extra: Ge(e.extra, t, n)
        }
    };
    return e.contexts ?.trace && r.contexts && (r.contexts.trace = e.contexts.trace, e.contexts.trace.data && (r.contexts.trace.data = Ge(e.contexts.trace.data, t, n))), e.spans && (r.spans = e.spans.map(o => ({ ...o,
        ...o.data && {
            data: Ge(o.data, t, n)
        }
    }))), e.contexts ?.flags && r.contexts && (r.contexts.flags = Ge(e.contexts.flags, 3, n)), r
}

function U_(e, t) {
    if (!t) return e;
    const n = e ? e.clone() : new St;
    return n.update(t), n
}

function H_(e) {
    if (e) return W_(e) ? {
        captureContext: e
    } : z_(e) ? {
        captureContext: e
    } : e
}

function W_(e) {
    return e instanceof St || typeof e == "function"
}
const j_ = ["user", "level", "extra", "contexts", "tags", "fingerprint", "propagationContext"];

function z_(e) {
    return Object.keys(e).some(t => j_.includes(t))
}

function _e(e, t) {
    return j().captureException(e, H_(t))
}

function q_(e, t) {
    const n = typeof t == "string" ? t : void 0,
        r = typeof t != "string" ? {
            captureContext: t
        } : void 0;
    return j().captureMessage(e, n, r)
}

function Yr(e, t) {
    return j().captureEvent(e, t)
}

function kf(e, t) {
    ke().setContext(e, t)
}

function Lx(e) {
    ke().setExtras(e)
}

function Dx(e, t) {
    ke().setExtra(e, t)
}

function Fx(e) {
    ke().setTags(e)
}

function $x(e, t) {
    ke().setTag(e, t)
}

function Bx(e) {
    ke().setUser(e)
}

function G_() {
    return ke().lastEventId()
}
async function Ux(e) {
    const t = C();
    return t ? t.flush(e) : (R && g.warn("Cannot flush events. No client defined."), Promise.resolve(!1))
}
async function Hx(e) {
    const t = C();
    return t ? t.close(e) : (R && g.warn("Cannot flush events and disable SDK. No client defined."), Promise.resolve(!1))
}

function Wx() {
    return !!C()
}

function V_() {
    const e = C();
    return e ?.getOptions().enabled !== !1 && !!e ?.getTransport()
}

function J_(e) {
    ke().addEventProcessor(e)
}

function Au(e) {
    const t = ke(),
        n = j(),
        {
            userAgent: r
        } = $.navigator || {},
        o = dg({
            user: n.getUser() || t.getUser(),
            ...r && {
                userAgent: r
            },
            ...e
        }),
        s = t.getSession();
    return s ?.status === "ok" && Zn(s, {
        status: "exited"
    }), Rf(), t.setSession(o), o
}

function Rf() {
    const e = ke(),
        n = j().getSession() || e.getSession();
    n && fg(n), Cf(), e.setSession()
}

function Cf() {
    const e = ke(),
        t = C(),
        n = e.getSession();
    n && t && t.captureSession(n)
}

function xu(e = !1) {
    if (e) {
        Rf();
        return
    }
    Cf()
}
const K_ = "7";

function Af(e) {
    const t = e.protocol ? `${e.protocol}:` : "",
        n = e.port ? `:${e.port}` : "";
    return `${t}//${e.host}${n}${e.path?`/${e.path}`:""}/api/`
}

function Y_(e) {
    return `${Af(e)}${e.projectId}/envelope/`
}

function X_(e, t) {
    const n = {
        sentry_version: K_
    };
    return e.publicKey && (n.sentry_key = e.publicKey), t && (n.sentry_client = `${t.name}/${t.version}`), new URLSearchParams(n).toString()
}

function xf(e, t, n) {
    return t || `${Y_(e)}?${X_(e,n)}`
}

function Q_(e, t) {
    const n = cf(e);
    if (!n) return "";
    const r = `${Af(n)}embed/error-page/`;
    let o = `dsn=${Lt(n)}`;
    for (const s in t)
        if (s !== "dsn" && s !== "onClose")
            if (s === "user") {
                const i = t.user;
                if (!i) continue;
                i.name && (o += `&name=${encodeURIComponent(i.name)}`), i.email && (o += `&email=${encodeURIComponent(i.email)}`)
            } else o += `&${encodeURIComponent(s)}=${encodeURIComponent(t[s])}`;
    return `${r}?${o}`
}
const Mu = [];

function Z_(e) {
    const t = {};
    return e.forEach(n => {
        const {
            name: r
        } = n, o = t[r];
        o && !o.isDefaultInstance && n.isDefaultInstance || (t[r] = n)
    }), Object.values(t)
}

function ey(e) {
    const t = e.defaultIntegrations || [],
        n = e.integrations;
    t.forEach(o => {
        o.isDefaultInstance = !0
    });
    let r;
    if (Array.isArray(n)) r = [...t, ...n];
    else if (typeof n == "function") {
        const o = n(t);
        r = Array.isArray(o) ? o : [o]
    } else r = t;
    return Z_(r)
}

function ty(e, t) {
    const n = {};
    return t.forEach(r => {
        r && Mf(e, r, n)
    }), n
}

function Nu(e, t) {
    for (const n of t) n ?.afterAllSetup && n.afterAllSetup(e)
}

function Mf(e, t, n) {
    if (n[t.name]) {
        R && g.log(`Integration skipped because it was already installed: ${t.name}`);
        return
    }
    if (n[t.name] = t, !Mu.includes(t.name) && typeof t.setupOnce == "function" && (t.setupOnce(), Mu.push(t.name)), t.setup && typeof t.setup == "function" && t.setup(e), typeof t.preprocessEvent == "function") {
        const r = t.preprocessEvent.bind(t);
        e.on("preprocessEvent", (o, s) => r(o, s, e))
    }
    if (typeof t.processEvent == "function") {
        const r = t.processEvent.bind(t),
            o = Object.assign((s, i) => r(s, i, e), {
                id: t.name
            });
        e.addEventProcessor(o)
    }
    R && g.log(`Integration installed: ${t.name}`)
}

function Ou(e) {
    const t = C();
    if (!t) {
        R && g.warn(`Cannot add integration "${e.name}" because no SDK Client is available.`);
        return
    }
    t.addIntegration(e)
}

function ny(e) {
    return typeof e == "object" && e != null && !Array.isArray(e) && Object.keys(e).includes("value")
}

function ry(e, t) {
    const {
        value: n,
        unit: r
    } = ny(e) ? e : {
        value: e,
        unit: void 0
    }, o = oy(n), s = r && typeof r == "string" ? {
        unit: r
    } : {};
    if (o) return { ...o,
        ...s
    };
    if (!t) return;
    let i = "";
    try {
        i = JSON.stringify(n) ?? ""
    } catch {}
    return {
        value: i,
        type: "string",
        ...s
    }
}

function Pu(e, t = !1) {
    const n = {};
    for (const [r, o] of Object.entries(e)) {
        const s = ry(o, t);
        s && (n[r] = s)
    }
    return n
}

function oy(e) {
    const t = typeof e == "string" ? "string" : typeof e == "boolean" ? "boolean" : typeof e == "number" && !Number.isNaN(e) ? Number.isInteger(e) ? "integer" : "double" : null;
    if (t) return {
        value: e,
        type: t
    }
}

function Nf(e, t) {
    return t ? Ke(t, () => {
        const n = Ee(),
            r = n ? hf(n) : Zd(t);
        return [n ? ut(n) : Ja(e, t), r]
    }) : [void 0, void 0]
}
const sy = {
    trace: 1,
    debug: 5,
    info: 9,
    warn: 13,
    error: 17,
    fatal: 21
};

function iy(e) {
    return [{
        type: "log",
        item_count: e.length,
        content_type: "application/vnd.sentry.items.log+json"
    }, {
        items: e
    }]
}

function ay(e, t, n, r) {
    const o = {};
    return t ?.sdk && (o.sdk = {
        name: t.sdk.name,
        version: t.sdk.version
    }), n && r && (o.dsn = Lt(r)), lt(o, [iy(e)])
}
const cy = 100;

function pt(e, t, n, r = !0) {
    n && (!e[t] || r) && (e[t] = n)
}

function uy(e, t) {
    const n = ec(),
        r = Of(e);
    r === void 0 ? n.set(e, [t]) : r.length >= cy ? (Za(e, r), n.set(e, [t])) : n.set(e, [...r, t])
}

function ls(e, t = j(), n = uy) {
    const r = t ?.getClient() ?? C();
    if (!r) {
        R && g.warn("No client available to capture log.");
        return
    }
    const {
        release: o,
        environment: s,
        enableLogs: i = !1,
        beforeSendLog: a
    } = r.getOptions();
    if (!i) {
        R && g.warn("logging option not enabled, log will not be captured.");
        return
    }
    const [, c] = Nf(r, t), u = { ...e.attributes
    }, {
        user: {
            id: d,
            email: l,
            username: f
        },
        attributes: p = {}
    } = ly(t);
    pt(u, "user.id", d, !1), pt(u, "user.email", l, !1), pt(u, "user.name", f, !1), pt(u, "sentry.release", o), pt(u, "sentry.environment", s);
    const {
        name: h,
        version: m
    } = r.getSdkMetadata() ?.sdk ?? {};
    pt(u, "sentry.sdk.name", h), pt(u, "sentry.sdk.version", m);
    const _ = r.getIntegrationByName("Replay"),
        y = _ ?.getReplayId(!0);
    pt(u, "sentry.replay_id", y), y && _ ?.getRecordingMode() === "buffer" && pt(u, "sentry._internal.replay_is_buffering", !0);
    const b = e.message;
    if (Ls(b)) {
        const {
            __sentry_template_string__: O,
            __sentry_template_values__: k = []
        } = b;
        k ?.length && (u["sentry.message.template"] = O), k.forEach((P, D) => {
            u[`sentry.message.parameter.${D}`] = P
        })
    }
    const N = er(t);
    pt(u, "sentry.trace.parent_span_id", N ?.spanContext().spanId);
    const T = { ...e,
        attributes: u
    };
    r.emit("beforeCaptureLog", T);
    const L = a ? on(() => a(T)) : T;
    if (!L) {
        r.recordDroppedEvent("before_send", "log_item", 1), R && g.warn("beforeSendLog returned null, log will not be captured.");
        return
    }
    const {
        level: A,
        message: S,
        attributes: x = {},
        severityNumber: B
    } = L, E = {
        timestamp: he(),
        level: A,
        body: S,
        trace_id: c ?.trace_id,
        severity_number: B ?? sy[A],
        attributes: { ...Pu(p),
            ...Pu(x, !0)
        }
    };
    n(r, E), r.emit("afterCaptureLog", L)
}

function Za(e, t) {
    const n = t ?? Of(e) ?? [];
    if (n.length === 0) return;
    const r = e.getOptions(),
        o = ay(n, r._metadata, r.tunnel, e.getDsn());
    ec().set(e, []), e.emit("flushLogs"), e.sendEnvelope(o)
}

function Of(e) {
    return ec().get(e)
}

function ly(e) {
    const t = Gt().getScopeData();
    return rr(t, ke().getScopeData()), rr(t, e.getScopeData()), t
}

function ec() {
    return hr("clientToLogBufferMap", () => new WeakMap)
}

function dy(e) {
    return [{
        type: "trace_metric",
        item_count: e.length,
        content_type: "application/vnd.sentry.items.trace-metric+json"
    }, {
        items: e
    }]
}

function fy(e, t, n, r) {
    const o = {};
    return t ?.sdk && (o.sdk = {
        name: t.sdk.name,
        version: t.sdk.version
    }), n && r && (o.dsn = Lt(r)), lt(o, [dy(e)])
}
const py = 1e3;

function hy(e) {
    switch (typeof e) {
        case "number":
            return Number.isInteger(e) ? {
                value: e,
                type: "integer"
            } : {
                value: e,
                type: "double"
            };
        case "boolean":
            return {
                value: e,
                type: "boolean"
            };
        case "string":
            return {
                value: e,
                type: "string"
            };
        default:
            {
                let t = "";
                try {
                    t = JSON.stringify(e) ?? ""
                } catch {}
                return {
                    value: t,
                    type: "string"
                }
            }
    }
}

function vt(e, t, n, r = !0) {
    n && (r || !(t in e)) && (e[t] = n)
}

function my(e, t) {
    const n = nc(),
        r = Pf(e);
    r === void 0 ? n.set(e, [t]) : r.length >= py ? (tc(e, r), n.set(e, [t])) : n.set(e, [...r, t])
}

function gy(e, t, n) {
    const {
        release: r,
        environment: o
    } = t.getOptions(), s = { ...e.attributes
    }, {
        user: {
            id: i,
            email: a,
            username: c
        }
    } = Sy(n);
    vt(s, "user.id", i, !1), vt(s, "user.email", a, !1), vt(s, "user.name", c, !1), vt(s, "sentry.release", r), vt(s, "sentry.environment", o);
    const {
        name: u,
        version: d
    } = t.getSdkMetadata() ?.sdk ?? {};
    vt(s, "sentry.sdk.name", u), vt(s, "sentry.sdk.version", d);
    const l = t.getIntegrationByName("Replay"),
        f = l ?.getReplayId(!0);
    return vt(s, "sentry.replay_id", f), f && l ?.getRecordingMode() === "buffer" && vt(s, "sentry._internal.replay_is_buffering", !0), { ...e,
        attributes: s
    }
}

function _y(e, t, n) {
    const r = {};
    for (const c in e.attributes) e.attributes[c] !== void 0 && (r[c] = hy(e.attributes[c]));
    const [, o] = Nf(t, n), s = er(n), i = s ? s.spanContext().traceId : o ?.trace_id, a = s ? s.spanContext().spanId : void 0;
    return {
        timestamp: he(),
        trace_id: i ?? "",
        span_id: a,
        name: e.name,
        type: e.type,
        unit: e.unit,
        value: e.value,
        attributes: r
    }
}

function yy(e, t) {
    const n = t ?.scope ?? j(),
        r = t ?.captureSerializedMetric ?? my,
        o = n ?.getClient() ?? C();
    if (!o) {
        R && g.warn("No client available to capture metric.");
        return
    }
    const {
        _experiments: s,
        enableMetrics: i,
        beforeSendMetric: a
    } = o.getOptions();
    if (!(i ?? s ?.enableMetrics ?? !0)) {
        R && g.warn("metrics option not enabled, metric will not be captured.");
        return
    }
    const u = gy(e, o, n);
    o.emit("processMetric", u);
    const d = a || s ?.beforeSendMetric,
        l = d ? d(u) : u;
    if (!l) {
        R && g.log("`beforeSendMetric` returned `null`, will not send metric.");
        return
    }
    const f = _y(l, o, n);
    R && g.log("[Metric]", f), r(o, f), o.emit("afterCaptureMetric", l)
}

function tc(e, t) {
    const n = t ?? Pf(e) ?? [];
    if (n.length === 0) return;
    const r = e.getOptions(),
        o = fy(n, r._metadata, r.tunnel, e.getDsn());
    nc().set(e, []), e.emit("flushMetrics"), e.sendEnvelope(o)
}

function Pf(e) {
    return nc().get(e)
}

function Sy(e) {
    const t = Gt().getScopeData();
    return rr(t, ke().getScopeData()), rr(t, e.getScopeData()), t
}

function nc() {
    return hr("clientToMetricBufferMap", () => new WeakMap)
}
const rc = Symbol.for("SentryBufferFullError");

function oc(e = 100) {
    const t = new Set;

    function n() {
        return t.size < e
    }

    function r(i) {
        t.delete(i)
    }

    function o(i) {
        if (!n()) return Qa(rc);
        const a = i();
        return t.add(a), a.then(() => r(a), () => r(a)), a
    }

    function s(i) {
        if (!t.size) return Ws(!0);
        const a = Promise.allSettled(Array.from(t)).then(() => !0);
        if (!i) return a;
        const c = [a, new Promise(u => setTimeout(() => u(!1), i))];
        return Promise.race(c)
    }
    return {
        get $() {
            return Array.from(t)
        },
        add: o,
        drain: s
    }
}
const by = 60 * 1e3;

function Lf(e, t = Date.now()) {
    const n = parseInt(`${e}`, 10);
    if (!isNaN(n)) return n * 1e3;
    const r = Date.parse(`${e}`);
    return isNaN(r) ? by : r - t
}

function Ey(e, t) {
    return e[t] || e.all || 0
}

function Df(e, t, n = Date.now()) {
    return Ey(e, t) > n
}

function Ff(e, {
    statusCode: t,
    headers: n
}, r = Date.now()) {
    const o = { ...e
        },
        s = n ?.["x-sentry-rate-limits"],
        i = n ?.["retry-after"];
    if (s)
        for (const a of s.trim().split(",")) {
            const [c, u, , , d] = a.split(":", 5), l = parseInt(c, 10), f = (isNaN(l) ? 60 : l) * 1e3;
            if (!u) o.all = r + f;
            else
                for (const p of u.split(";")) p === "metric_bucket" ? (!d || d.split(";").includes("custom")) && (o[p] = r + f) : o[p] = r + f
        } else i ? o.all = r + Lf(i, r) : t === 429 && (o.all = r + 60 * 1e3);
    return o
}
const $f = 64;

function vy(e, t, n = oc(e.bufferSize || $f)) {
    let r = {};
    const o = i => n.drain(i);

    function s(i) {
        const a = [];
        if (kn(i, (l, f) => {
                const p = Su(f);
                Df(r, p) ? e.recordDroppedEvent("ratelimit_backoff", p) : a.push(l)
            }), a.length === 0) return Promise.resolve({});
        const c = lt(i[0], a),
            u = l => {
                kn(c, (f, p) => {
                    e.recordDroppedEvent(l, Su(p))
                })
            },
            d = () => t({
                body: cs(c)
            }).then(l => (l.statusCode !== void 0 && (l.statusCode < 200 || l.statusCode >= 300) && R && g.warn(`Sentry responded with status code ${l.statusCode} to sent event.`), r = Ff(r, l), l), l => {
                throw u("network_error"), R && g.error("Encountered error running transport request:", l), l
            });
        return n.add(d).then(l => l, l => {
            if (l === rc) return R && g.error("Skipped sending event because buffer is full."), u("queue_overflow"), Promise.resolve({});
            throw l
        })
    }
    return {
        send: s,
        flush: o
    }
}

function Ty(e, t, n) {
    const r = [{
        type: "client_report"
    }, {
        timestamp: Dn(),
        discarded_events: e
    }];
    return lt(t ? {
        dsn: t
    } : {}, [r])
}

function Bf(e) {
    const t = [];
    e.message && t.push(e.message);
    try {
        const n = e.exception.values[e.exception.values.length - 1];
        n ?.value && (t.push(n.value), n.type && t.push(`${n.type}: ${n.value}`))
    } catch {}
    return t
}

function Iy(e) {
    const {
        trace_id: t,
        parent_span_id: n,
        span_id: r,
        status: o,
        origin: s,
        data: i,
        op: a
    } = e.contexts ?.trace ?? {};
    return {
        data: i ?? {},
        description: e.transaction,
        op: a,
        parent_span_id: n,
        span_id: r ?? "",
        start_timestamp: e.start_timestamp ?? 0,
        status: o,
        timestamp: e.timestamp,
        trace_id: t ?? "",
        origin: s,
        profile_id: i ?.[za],
        exclusive_time: i ?.[gr],
        measurements: e.measurements,
        is_segment: !0
    }
}

function wy(e) {
    return {
        type: "transaction",
        timestamp: e.timestamp,
        start_timestamp: e.start_timestamp,
        transaction: e.description,
        contexts: {
            trace: {
                trace_id: e.trace_id,
                span_id: e.span_id,
                parent_span_id: e.parent_span_id,
                op: e.op,
                status: e.status,
                origin: e.origin,
                data: { ...e.data,
                    ...e.profile_id && {
                        [za]: e.profile_id
                    },
                    ...e.exclusive_time && {
                        [gr]: e.exclusive_time
                    }
                }
            }
        },
        measurements: e.measurements
    }
}
const Lu = "Not capturing exception because it's already been captured.",
    Du = "Discarded session because of missing or non-string release",
    Uf = Symbol.for("SentryInternalError"),
    Hf = Symbol.for("SentryDoNotSendEventError"),
    ky = 5e3;

function Bo(e) {
    return {
        message: e,
        [Uf]: !0
    }
}

function wi(e) {
    return {
        message: e,
        [Hf]: !0
    }
}

function Fu(e) {
    return !!e && typeof e == "object" && Uf in e
}

function $u(e) {
    return !!e && typeof e == "object" && Hf in e
}

function Bu(e, t, n, r, o) {
    let s = 0,
        i, a = !1;
    e.on(n, () => {
        s = 0, clearTimeout(i), a = !1
    }), e.on(t, c => {
        s += r(c), s >= 8e5 ? o(e) : a || (a = !0, i = setTimeout(() => {
            o(e)
        }, ky))
    }), e.on("flush", () => {
        o(e)
    })
}
class Ry {
    constructor(t) {
        if (this._options = t, this._integrations = {}, this._numProcessing = 0, this._outcomes = {}, this._hooks = {}, this._eventProcessors = [], this._promiseBuffer = oc(t.transportOptions ?.bufferSize ?? $f), t.dsn ? this._dsn = cf(t.dsn) : R && g.warn("No DSN provided, client will not send events."), this._dsn) {
            const r = xf(this._dsn, t.tunnel, t._metadata ? t._metadata.sdk : void 0);
            this._transport = t.transport({
                tunnel: this._options.tunnel,
                recordDroppedEvent: this.recordDroppedEvent.bind(this),
                ...t.transportOptions,
                url: r
            })
        }
        this._options.enableLogs = this._options.enableLogs ?? this._options._experiments ?.enableLogs, this._options.enableLogs && Bu(this, "afterCaptureLog", "flushLogs", My, Za), (this._options.enableMetrics ?? this._options._experiments ?.enableMetrics ?? !0) && Bu(this, "afterCaptureMetric", "flushMetrics", xy, tc)
    }
    captureException(t, n, r) {
        const o = Ie();
        if (lu(t)) return R && g.log(Lu), o;
        const s = {
            event_id: o,
            ...n
        };
        return this._process(() => this.eventFromException(t, s).then(i => this._captureEvent(i, s, r)).then(i => i), "error"), s.event_id
    }
    captureMessage(t, n, r, o) {
        const s = {
                event_id: Ie(),
                ...r
            },
            i = Ls(t) ? t : String(t),
            a = Zt(t),
            c = a ? this.eventFromMessage(i, n, s) : this.eventFromException(t, s);
        return this._process(() => c.then(u => this._captureEvent(u, s, o)), a ? "unknown" : "error"), s.event_id
    }
    captureEvent(t, n, r) {
        const o = Ie();
        if (n ?.originalException && lu(n.originalException)) return R && g.log(Lu), o;
        const s = {
                event_id: o,
                ...n
            },
            i = t.sdkProcessingMetadata || {},
            a = i.capturedSpanScope,
            c = i.capturedSpanIsolationScope,
            u = Uu(t.type);
        return this._process(() => this._captureEvent(t, s, a || r, c), u), s.event_id
    }
    captureSession(t) {
        this.sendSession(t), Zn(t, {
            init: !1
        })
    }
    getDsn() {
        return this._dsn
    }
    getOptions() {
        return this._options
    }
    getSdkMetadata() {
        return this._options._metadata
    }
    getTransport() {
        return this._transport
    }
    async flush(t) {
        const n = this._transport;
        if (!n) return !0;
        this.emit("flush");
        const r = await this._isClientDoneProcessing(t),
            o = await n.flush(t);
        return r && o
    }
    async close(t) {
        const n = await this.flush(t);
        return this.getOptions().enabled = !1, this.emit("close"), n
    }
    getEventProcessors() {
        return this._eventProcessors
    }
    addEventProcessor(t) {
        this._eventProcessors.push(t)
    }
    init() {
        (this._isEnabled() || this._options.integrations.some(({
            name: t
        }) => t.startsWith("Spotlight"))) && this._setupIntegrations()
    }
    getIntegrationByName(t) {
        return this._integrations[t]
    }
    addIntegration(t) {
        const n = this._integrations[t.name];
        Mf(this, t, this._integrations), n || Nu(this, [t])
    }
    sendEvent(t, n = {}) {
        this.emit("beforeSendEvent", t, n);
        let r = l_(t, this._dsn, this._options._metadata, this._options.tunnel);
        for (const o of n.attachments || []) r = t_(r, i_(o));
        this.sendEnvelope(r).then(o => this.emit("afterSendEvent", t, o))
    }
    sendSession(t) {
        const {
            release: n,
            environment: r = $s
        } = this._options;
        if ("aggregates" in t) {
            const s = t.attrs || {};
            if (!s.release && !n) {
                R && g.warn(Du);
                return
            }
            s.release = s.release || n, s.environment = s.environment || r, t.attrs = s
        } else {
            if (!t.release && !n) {
                R && g.warn(Du);
                return
            }
            t.release = t.release || n, t.environment = t.environment || r
        }
        this.emit("beforeSendSession", t);
        const o = u_(t, this._dsn, this._options._metadata, this._options.tunnel);
        this.sendEnvelope(o)
    }
    recordDroppedEvent(t, n, r = 1) {
        if (this._options.sendClientReports) {
            const o = `${t}:${n}`;
            R && g.log(`Recording outcome: "${o}"${r>1?` (${r} times)`:""}`), this._outcomes[o] = (this._outcomes[o] || 0) + r
        }
    }
    on(t, n) {
        const r = this._hooks[t] = this._hooks[t] || new Set,
            o = (...s) => n(...s);
        return r.add(o), () => {
            r.delete(o)
        }
    }
    emit(t, ...n) {
        const r = this._hooks[t];
        r && r.forEach(o => o(...n))
    }
    async sendEnvelope(t) {
        if (this.emit("beforeEnvelope", t), this._isEnabled() && this._transport) try {
            return await this._transport.send(t)
        } catch (n) {
            return R && g.error("Error while sending envelope:", n), {}
        }
        return R && g.error("Transport disabled"), {}
    }
    _setupIntegrations() {
        const {
            integrations: t
        } = this._options;
        this._integrations = ty(this, t), Nu(this, t)
    }
    _updateSessionFromEvent(t, n) {
        let r = n.level === "fatal",
            o = !1;
        const s = n.exception ?.values;
        if (s) {
            o = !0, r = !1;
            for (const c of s)
                if (c.mechanism ?.handled === !1) {
                    r = !0;
                    break
                }
        }
        const i = t.status === "ok";
        (i && t.errors === 0 || i && r) && (Zn(t, { ...r && {
                status: "crashed"
            },
            errors: t.errors || Number(o || r)
        }), this.captureSession(t))
    }
    async _isClientDoneProcessing(t) {
        let n = 0;
        for (; !t || n < t;) {
            if (await new Promise(r => setTimeout(r, 1)), !this._numProcessing) return !0;
            n++
        }
        return !1
    }
    _isEnabled() {
        return this.getOptions().enabled !== !1 && this._transport !== void 0
    }
    _prepareEvent(t, n, r, o) {
        const s = this.getOptions(),
            i = Object.keys(this._integrations);
        return !n.integrations && i ?.length && (n.integrations = i), this.emit("preprocessEvent", t, n), t.type || o.setLastEventId(t.event_id || n.event_id), wf(s, t, n, r, this, o).then(a => {
            if (a === null) return a;
            this.emit("postprocessEvent", a, n), a.contexts = {
                trace: Zd(r),
                ...a.contexts
            };
            const c = Ja(this, r);
            return a.sdkProcessingMetadata = {
                dynamicSamplingContext: c,
                ...a.sdkProcessingMetadata
            }, a
        })
    }
    _captureEvent(t, n = {}, r = j(), o = ke()) {
        return R && ia(t) && g.log(`Captured error event \`${Bf(t)[0]||"<unknown>"}\``), this._processEvent(t, n, r, o).then(s => s.event_id, s => {
            R && ($u(s) ? g.log(s.message) : Fu(s) ? g.warn(s.message) : g.warn(s))
        })
    }
    _processEvent(t, n, r, o) {
        const s = this.getOptions(),
            {
                sampleRate: i
            } = s,
            a = Wf(t),
            c = ia(t),
            d = `before send for type \`${t.type||"error"}\``,
            l = typeof i > "u" ? void 0 : wn(i);
        if (c && typeof l == "number" && Math.random() > l) return this.recordDroppedEvent("sample_rate", "error"), Qa(wi(`Discarding event because it's not included in the random sample (sampling rate = ${i})`));
        const f = Uu(t.type);
        return this._prepareEvent(t, n, r, o).then(p => {
            if (p === null) throw this.recordDroppedEvent("event_processor", f), wi("An event processor returned `null`, will not send event.");
            if (n.data && n.data.__sentry__ === !0) return p;
            const m = Ay(this, s, p, n);
            return Cy(m, d)
        }).then(p => {
            if (p === null) {
                if (this.recordDroppedEvent("before_send", f), a) {
                    const y = 1 + (t.spans || []).length;
                    this.recordDroppedEvent("before_send", "span", y)
                }
                throw wi(`${d} returned \`null\`, will not send event.`)
            }
            const h = r.getSession() || o.getSession();
            if (c && h && this._updateSessionFromEvent(h, p), a) {
                const _ = p.sdkProcessingMetadata ?.spanCountBeforeProcessing || 0,
                    y = p.spans ? p.spans.length : 0,
                    b = _ - y;
                b > 0 && this.recordDroppedEvent("before_send", "span", b)
            }
            const m = p.transaction_info;
            if (a && m && p.transaction !== t.transaction) {
                const _ = "custom";
                p.transaction_info = { ...m,
                    source: _
                }
            }
            return this.sendEvent(p, n), p
        }).then(null, p => {
            throw $u(p) || Fu(p) ? p : (this.captureException(p, {
                mechanism: {
                    handled: !1,
                    type: "internal"
                },
                data: {
                    __sentry__: !0
                },
                originalException: p
            }), Bo(`Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.
Reason: ${p}`))
        })
    }
    _process(t, n) {
        this._numProcessing++, this._promiseBuffer.add(t).then(r => (this._numProcessing--, r), r => (this._numProcessing--, r === rc && this.recordDroppedEvent("queue_overflow", n), r))
    }
    _clearOutcomes() {
        const t = this._outcomes;
        return this._outcomes = {}, Object.entries(t).map(([n, r]) => {
            const [o, s] = n.split(":");
            return {
                reason: o,
                category: s,
                quantity: r
            }
        })
    }
    _flushOutcomes() {
        R && g.log("Flushing outcomes...");
        const t = this._clearOutcomes();
        if (t.length === 0) {
            R && g.log("No outcomes to send");
            return
        }
        if (!this._dsn) {
            R && g.log("No dsn provided, will not send outcomes");
            return
        }
        R && g.log("Sending outcomes:", t);
        const n = Ty(t, this._options.tunnel && Lt(this._dsn));
        this.sendEnvelope(n)
    }
}

function Uu(e) {
    return e === "replay_event" ? "replay" : e || "error"
}

function Cy(e, t) {
    const n = `${t} must return \`null\` or a valid event.`;
    if (Pn(e)) return e.then(r => {
        if (!mt(r) && r !== null) throw Bo(n);
        return r
    }, r => {
        throw Bo(`${t} rejected with ${r}`)
    });
    if (!mt(e) && e !== null) throw Bo(n);
    return e
}

function Ay(e, t, n, r) {
    const {
        beforeSend: o,
        beforeSendTransaction: s,
        beforeSendSpan: i,
        ignoreSpans: a
    } = t;
    let c = n;
    if (ia(c) && o) return o(c, r);
    if (Wf(c)) {
        if (i || a) {
            const u = Iy(c);
            if (a ?.length && is(u, a)) return null;
            if (i) {
                const d = i(u);
                d ? c = Gr(n, wy(d)) : ra()
            }
            if (c.spans) {
                const d = [],
                    l = c.spans;
                for (const p of l) {
                    if (a ?.length && is(p, a)) {
                        Jg(l, p);
                        continue
                    }
                    if (i) {
                        const h = i(p);
                        h ? d.push(h) : (ra(), d.push(p))
                    } else d.push(p)
                }
                const f = c.spans.length - d.length;
                f && e.recordDroppedEvent("before_send", "span", f), c.spans = d
            }
        }
        if (s) {
            if (c.spans) {
                const u = c.spans.length;
                c.sdkProcessingMetadata = { ...n.sdkProcessingMetadata,
                    spanCountBeforeProcessing: u
                }
            }
            return s(c, r)
        }
    }
    return c
}

function ia(e) {
    return e.type === void 0
}

function Wf(e) {
    return e.type === "transaction"
}

function xy(e) {
    let t = 0;
    return e.name && (t += e.name.length * 2), t += 8, t + jf(e.attributes)
}

function My(e) {
    let t = 0;
    return e.message && (t += e.message.length * 2), t + jf(e.attributes)
}

function jf(e) {
    if (!e) return 0;
    let t = 0;
    return Object.values(e).forEach(n => {
        Array.isArray(n) ? t += n.length * Hu(n[0]) : Zt(n) ? t += Hu(n) : t += 100
    }), t
}

function Hu(e) {
    return typeof e == "string" ? e.length * 2 : typeof e == "number" ? 8 : typeof e == "boolean" ? 4 : 0
}

function Ny(e, t) {
    t.debug === !0 && (R ? g.enable() : on(() => {
        console.warn("[Sentry] Cannot initialize SDK with `debug` option using a non-debug bundle.")
    })), j().update(t.initialScope);
    const r = new e(t);
    return Oy(r), r.init(), r
}

function Oy(e) {
    j().setClient(e)
}
const ki = 100,
    Ri = 5e3,
    Py = 36e5;

function Ly(e) {
    function t(...n) {
        R && g.log("[Offline]:", ...n)
    }
    return n => {
        const r = e(n);
        if (!n.createStore) throw new Error("No `createStore` function was provided");
        const o = n.createStore(n);
        let s = Ri,
            i;

        function a(l, f, p) {
            return yu(l, ["client_report"]) ? !1 : n.shouldStore ? n.shouldStore(l, f, p) : !0
        }

        function c(l) {
            i && clearTimeout(i), i = setTimeout(async () => {
                i = void 0;
                const f = await o.shift();
                f && (t("Attempting to send previously queued event"), f[0].sent_at = new Date().toISOString(), d(f, !0).catch(p => {
                    t("Failed to retry sending", p)
                }))
            }, l), typeof i != "number" && i.unref && i.unref()
        }

        function u() {
            i || (c(s), s = Math.min(s * 2, Py))
        }
        async function d(l, f = !1) {
            if (!f && yu(l, ["replay_event", "replay_recording"])) return await o.push(l), c(ki), {};
            try {
                if (n.shouldSend && await n.shouldSend(l) === !1) throw new Error("Envelope not sent because `shouldSend` callback returned false");
                const p = await r.send(l);
                let h = ki;
                if (p) {
                    if (p.headers ?.["retry-after"]) h = Lf(p.headers["retry-after"]);
                    else if (p.headers ?.["x-sentry-rate-limits"]) h = 6e4;
                    else if ((p.statusCode || 0) >= 400) return p
                }
                return c(h), s = Ri, p
            } catch (p) {
                if (await a(l, p, s)) return f ? await o.unshift(l) : await o.push(l), u(), t("Error sending. Event queued.", p), {};
                throw p
            }
        }
        return n.flushAtStartup && u(), {
            send: d,
            flush: l => (l === void 0 && (s = Ri, c(ki)), r.flush(l))
        }
    }
}
const Ci = "MULTIPLEXED_TRANSPORT_EXTRA_KEY";

function zf(e, t) {
    let n;
    return kn(e, (r, o) => (t.includes(o) && (n = Array.isArray(r) ? r[1] : void 0), !!n)), n
}

function Dy(e, t) {
    return n => {
        const r = e(n);
        return { ...r,
            send: async o => {
                const s = zf(o, ["event", "transaction", "profile", "replay_event"]);
                return s && (s.release = t), r.send(o)
            }
        }
    }
}

function Fy(e, t) {
    return lt(t ? { ...e[0],
        dsn: t
    } : e[0], e[1])
}

function jx(e, t) {
    return n => {
        const r = e(n),
            o = new Map,
            s = t || (u => {
                const d = u.getEvent();
                return d ?.extra ?.[Ci] && Array.isArray(d.extra[Ci]) ? d.extra[Ci] : []
            });

        function i(u, d) {
            const l = d ? `${u}:${d}` : u;
            let f = o.get(l);
            if (!f) {
                const p = of (u);
                if (!p) return;
                const h = xf(p, n.tunnel);
                f = d ? Dy(e, d)({ ...n,
                    url: h
                }) : e({ ...n,
                    url: h
                }), o.set(l, f)
            }
            return [u, f]
        }
        async function a(u) {
            function d(h) {
                const m = h ?.length ? h : ["event"];
                return zf(u, m)
            }
            const l = s({
                    envelope: u,
                    getEvent: d
                }).map(h => typeof h == "string" ? i(h, void 0) : i(h.dsn, h.release)).filter(h => !!h),
                f = l.length ? l : [
                    ["", r]
                ];
            return (await Promise.all(f.map(([h, m]) => m.send(Fy(u, h)))))[0]
        }
        async function c(u) {
            const d = [...o.values(), r];
            return (await Promise.all(d.map(f => f.flush(u)))).every(f => f)
        }
        return {
            send: a,
            flush: c
        }
    }
}
const $y = "thismessage:/";

function sc(e) {
    return "isRelative" in e
}

function ic(e, t) {
    const n = e.indexOf("://") <= 0 && e.indexOf("//") !== 0,
        r = n ? $y : void 0;
    try {
        if ("canParse" in URL && !URL.canParse(e, r)) return;
        const o = new URL(e, r);
        return n ? {
            isRelative: n,
            pathname: o.pathname,
            search: o.search,
            hash: o.hash
        } : o
    } catch {}
}

function By(e) {
    if (sc(e)) return e.pathname;
    const t = new URL(e);
    return t.search = "", t.hash = "", ["80", "443"].includes(t.port) && (t.port = ""), t.password && (t.password = "%filtered%"), t.username && (t.username = "%filtered%"), t.toString()
}

function Tn(e) {
    if (!e) return {};
    const t = e.match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
    if (!t) return {};
    const n = t[6] || "",
        r = t[8] || "";
    return {
        host: t[4],
        path: t[5],
        protocol: t[2],
        search: n,
        hash: r,
        relative: t[5] + n + r
    }
}

function qf(e) {
    return e.split(/[?#]/, 1)[0]
}

function Gf(e, t) {
    const n = t ?.getDsn(),
        r = t ?.getOptions().tunnel;
    return Hy(e, n) || Uy(e, r)
}

function Uy(e, t) {
    return t ? Wu(e) === Wu(t) : !1
}

function Hy(e, t) {
    const n = ic(e);
    return !n || sc(n) ? !1 : t ? n.host.includes(t.host) && /(^|&|\?)sentry_key=/.test(n.search) : !1
}

function Wu(e) {
    return e[e.length - 1] === "/" ? e.slice(0, -1) : e
}

function Wy(e, ...t) {
    const n = new String(String.raw(e, ...t));
    return n.__sentry_template_string__ = e.join("\0").replace(/%/g, "%%").replace(/\0/g, "%s"), n.__sentry_template_values__ = t, n
}
const jy = Wy;

function zy(e) {
    "aggregates" in e ? e.attrs ?.ip_address === void 0 && (e.attrs = { ...e.attrs,
        ip_address: "{{auto}}"
    }) : e.ipAddress === void 0 && (e.ipAddress = "{{auto}}")
}

function Vf(e, t, n = [t], r = "npm") {
    const o = e._metadata || {};
    o.sdk || (o.sdk = {
        name: `sentry.javascript.${t}`,
        packages: n.map(s => ({
            name: `${r}:@sentry/${s}`,
            version: qt
        })),
        version: qt
    }), e._metadata = o
}

function Jf(e = {}) {
    const t = e.client || C();
    if (!V_() || !t) return {};
    const n = Pt(),
        r = cn(n);
    if (r.getTraceData) return r.getTraceData(e);
    const o = e.scope || j(),
        s = e.span || Ee(),
        i = s ? Wg(s) : qy(o),
        a = s ? ut(s) : Ja(t, o),
        c = rf(a);
    if (!uf.test(i)) return g.warn("Invalid sentry-trace data. Cannot generate trace data"), {};
    const d = {
        "sentry-trace": i,
        baggage: c
    };
    return e.propagateTraceparent && (d.traceparent = s ? jg(s) : Gy(o)), d
}

function qy(e) {
    const {
        traceId: t,
        sampled: n,
        propagationSpanId: r
    } = e.getPropagationContext();
    return df(t, r, n)
}

function Gy(e) {
    const {
        traceId: t,
        sampled: n,
        propagationSpanId: r
    } = e.getPropagationContext();
    return ff(t, r, n)
}

function Vy(e, t, n) {
    let r, o, s;
    const i = n ?.maxWait ? Math.max(n.maxWait, t) : 0,
        a = n ?.setTimeoutImpl || setTimeout;

    function c() {
        return u(), r = e(), r
    }

    function u() {
        o !== void 0 && clearTimeout(o), s !== void 0 && clearTimeout(s), o = s = void 0
    }

    function d() {
        return o !== void 0 || s !== void 0 ? c() : r
    }

    function l() {
        return o && clearTimeout(o), o = a(c, t), i && s === void 0 && (s = a(c, i)), r
    }
    return l.cancel = u, l.flush = d, l
}
const Jy = 100;

function bt(e, t) {
    const n = C(),
        r = ke();
    if (!n) return;
    const {
        beforeBreadcrumb: o = null,
        maxBreadcrumbs: s = Jy
    } = n.getOptions();
    if (s <= 0) return;
    const a = {
            timestamp: Dn(),
            ...e
        },
        c = o ? on(() => o(a, t)) : a;
    c !== null && (n.emit && n.emit("beforeAddBreadcrumb", c, t), r.addBreadcrumb(c, s))
}
let ju;
const Ky = "FunctionToString",
    zu = new WeakMap,
    Yy = (() => ({
        name: Ky,
        setupOnce() {
            ju = Function.prototype.toString;
            try {
                Function.prototype.toString = function(...e) {
                    const t = Wa(this),
                        n = zu.has(C()) && t !== void 0 ? t : this;
                    return ju.apply(n, e)
                }
            } catch {}
        },
        setup(e) {
            zu.set(e, !0)
        }
    })),
    Xy = Yy,
    Qy = [/^Script error\.?$/, /^Javascript error: Script error\.? on line 0$/, /^ResizeObserver loop completed with undelivered notifications.$/, /^Cannot redefine property: googletag$/, /^Can't find variable: gmo$/, /^undefined is not an object \(evaluating 'a\.[A-Z]'\)$/, `can't redefine non-configurable property "solana"`, "vv().getRestrictions is not a function. (In 'vv().getRestrictions(1,a)', 'vv().getRestrictions' is undefined)", "Can't find variable: _AutofillCallbackHandler", /^Non-Error promise rejection captured with value: Object Not Found Matching Id:\d+, MethodName:simulateEvent, ParamCount:\d+$/, /^Java exception was raised during method invocation$/],
    Zy = "EventFilters",
    eS = (e = {}) => {
        let t;
        return {
            name: Zy,
            setup(n) {
                const r = n.getOptions();
                t = qu(e, r)
            },
            processEvent(n, r, o) {
                if (!t) {
                    const s = o.getOptions();
                    t = qu(e, s)
                }
                return nS(n, t) ? null : n
            }
        }
    },
    tS = ((e = {}) => ({ ...eS(e),
        name: "InboundFilters"
    }));

function qu(e = {}, t = {}) {
    return {
        allowUrls: [...e.allowUrls || [], ...t.allowUrls || []],
        denyUrls: [...e.denyUrls || [], ...t.denyUrls || []],
        ignoreErrors: [...e.ignoreErrors || [], ...t.ignoreErrors || [], ...e.disableErrorDefaults ? [] : Qy],
        ignoreTransactions: [...e.ignoreTransactions || [], ...t.ignoreTransactions || []]
    }
}

function nS(e, t) {
    if (e.type) {
        if (e.type === "transaction" && oS(e, t.ignoreTransactions)) return R && g.warn(`Event dropped due to being matched by \`ignoreTransactions\` option.
Event: ${hn(e)}`), !0
    } else {
        if (rS(e, t.ignoreErrors)) return R && g.warn(`Event dropped due to being matched by \`ignoreErrors\` option.
Event: ${hn(e)}`), !0;
        if (cS(e)) return R && g.warn(`Event dropped due to not having an error message, error type or stacktrace.
Event: ${hn(e)}`), !0;
        if (sS(e, t.denyUrls)) return R && g.warn(`Event dropped due to being matched by \`denyUrls\` option.
Event: ${hn(e)}.
Url: ${ds(e)}`), !0;
        if (!iS(e, t.allowUrls)) return R && g.warn(`Event dropped due to not being matched by \`allowUrls\` option.
Event: ${hn(e)}.
Url: ${ds(e)}`), !0
    }
    return !1
}

function rS(e, t) {
    return t ?.length ? Bf(e).some(n => it(n, t)) : !1
}

function oS(e, t) {
    if (!t ?.length) return !1;
    const n = e.transaction;
    return n ? it(n, t) : !1
}

function sS(e, t) {
    if (!t ?.length) return !1;
    const n = ds(e);
    return n ? it(n, t) : !1
}

function iS(e, t) {
    if (!t ?.length) return !0;
    const n = ds(e);
    return n ? it(n, t) : !0
}

function aS(e = []) {
    for (let t = e.length - 1; t >= 0; t--) {
        const n = e[t];
        if (n && n.filename !== "<anonymous>" && n.filename !== "[native code]") return n.filename || null
    }
    return null
}

function ds(e) {
    try {
        const n = [...e.exception ?.values ?? []].reverse().find(r => r.mechanism ?.parent_id === void 0 && r.stacktrace ?.frames ?.length) ?.stacktrace ?.frames;
        return n ? aS(n) : null
    } catch {
        return R && g.error(`Cannot extract url for event ${hn(e)}`), null
    }
}

function cS(e) {
    return e.exception ?.values ?.length ? !e.message && !e.exception.values.some(t => t.stacktrace || t.type && t.type !== "Error" || t.value) : !1
}

function uS(e, t, n, r, o, s) {
    if (!o.exception ?.values || !s || !xt(s.originalException, Error)) return;
    const i = o.exception.values.length > 0 ? o.exception.values[o.exception.values.length - 1] : void 0;
    i && (o.exception.values = aa(e, t, r, s.originalException, n, o.exception.values, i, 0))
}

function aa(e, t, n, r, o, s, i, a) {
    if (s.length >= n + 1) return s;
    let c = [...s];
    if (xt(r[o], Error)) {
        Gu(i, a);
        const u = e(t, r[o]),
            d = c.length;
        Vu(u, o, d, a), c = aa(e, t, n, r[o], o, [u, ...c], u, d)
    }
    return Array.isArray(r.errors) && r.errors.forEach((u, d) => {
        if (xt(u, Error)) {
            Gu(i, a);
            const l = e(t, u),
                f = c.length;
            Vu(l, `errors[${d}]`, f, a), c = aa(e, t, n, u, o, [l, ...c], l, f)
        }
    }), c
}

function Gu(e, t) {
    e.mechanism = {
        handled: !0,
        type: "auto.core.linked_errors",
        ...e.mechanism,
        ...e.type === "AggregateError" && {
            is_exception_group: !0
        },
        exception_id: t
    }
}

function Vu(e, t, n, r) {
    e.mechanism = {
        handled: !0,
        ...e.mechanism,
        type: "chained",
        source: t,
        exception_id: n,
        parent_id: r
    }
}
const Kf = new Map,
    Ju = new Set;

function lS(e) {
    if ($._sentryModuleMetadata)
        for (const t of Object.keys($._sentryModuleMetadata)) {
            const n = $._sentryModuleMetadata[t];
            if (Ju.has(t)) continue;
            Ju.add(t);
            const r = e(t);
            for (const o of r.reverse())
                if (o.filename) {
                    Kf.set(o.filename, n);
                    break
                }
        }
}

function dS(e, t) {
    return lS(e), Kf.get(t)
}

function Yf(e, t) {
    t.exception ?.values ?.forEach(n => {
        n.stacktrace ?.frames ?.forEach(r => {
            if (!r.filename || r.module_metadata) return;
            const o = dS(e, r.filename);
            o && (r.module_metadata = o)
        })
    })
}

function Xf(e) {
    e.exception ?.values ?.forEach(t => {
        t.stacktrace ?.frames ?.forEach(n => {
            delete n.module_metadata
        })
    })
}
const zx = () => ({
    name: "ModuleMetadata",
    setup(e) {
        e.on("beforeEnvelope", t => {
            kn(t, (n, r) => {
                if (r === "event") {
                    const o = Array.isArray(n) ? n[1] : void 0;
                    o && (Xf(o), n[1] = o)
                }
            })
        }), e.on("applyFrameMetadata", t => {
            if (t.type) return;
            const n = e.getOptions().stackParser;
            Yf(n, t)
        })
    }
});

function ac(e) {
    const t = "console";
    sn(t, e), an(t, fS)
}

function fS() {
    "console" in $ && Fa.forEach(function(e) {
        e in $.console && xe($.console, e, function(t) {
            return ns[e] = t,
                function(...n) {
                    Qe("console", {
                        args: n,
                        level: e
                    }), ns[e] ?.apply($.console, n)
                }
        })
    })
}

function fs(e) {
    return e === "warn" ? "warning" : ["fatal", "error", "warning", "log", "info", "debug"].includes(e) ? e : "log"
}
const pS = "CaptureConsole",
    hS = ((e = {}) => {
        const t = e.levels || Fa,
            n = e.handled ?? !0;
        return {
            name: pS,
            setup(r) {
                "console" in $ && ac(({
                    args: o,
                    level: s
                }) => {
                    C() !== r || !t.includes(s) || mS(o, s, n)
                })
            }
        }
    }),
    qx = hS;

function mS(e, t, n) {
    const r = fs(t),
        o = new Error,
        s = {
            level: fs(t),
            extra: {
                arguments: e
            }
        };
    Ke(i => {
        if (i.addEventProcessor(u => (u.logger = "console", Mt(u, {
                handled: n,
                type: "auto.core.capture_console"
            }), u)), t === "assert") {
            if (!e[0]) {
                const u = `Assertion failed: ${rs(e.slice(1)," ")||"console.assert"}`;
                i.setExtra("arguments", e.slice(1)), i.captureMessage(u, r, {
                    captureContext: s,
                    syntheticException: o
                })
            }
            return
        }
        const a = e.find(u => u instanceof Error);
        if (a) {
            _e(a, s);
            return
        }
        const c = rs(e, " ");
        i.captureMessage(c, r, {
            captureContext: s,
            syntheticException: o
        })
    })
}
const gS = "Dedupe",
    _S = (() => {
        let e;
        return {
            name: gS,
            processEvent(t) {
                if (t.type) return t;
                try {
                    if (SS(t, e)) return R && g.warn("Event dropped due to being a duplicate of previously captured event."), null
                } catch {}
                return e = t
            }
        }
    }),
    yS = _S;

function SS(e, t) {
    return t ? !!(bS(e, t) || ES(e, t)) : !1
}

function bS(e, t) {
    const n = e.message,
        r = t.message;
    return !(!n && !r || n && !r || !n && r || n !== r || !Zf(e, t) || !Qf(e, t))
}

function ES(e, t) {
    const n = Ku(t),
        r = Ku(e);
    return !(!n || !r || n.type !== r.type || n.value !== r.value || !Zf(e, t) || !Qf(e, t))
}

function Qf(e, t) {
    let n = Qi(e),
        r = Qi(t);
    if (!n && !r) return !0;
    if (n && !r || !n && r || (n = n, r = r, r.length !== n.length)) return !1;
    for (let o = 0; o < r.length; o++) {
        const s = r[o],
            i = n[o];
        if (s.filename !== i.filename || s.lineno !== i.lineno || s.colno !== i.colno || s.function !== i.function) return !1
    }
    return !0
}

function Zf(e, t) {
    let n = e.fingerprint,
        r = t.fingerprint;
    if (!n && !r) return !0;
    if (n && !r || !n && r) return !1;
    n = n, r = r;
    try {
        return n.join("") === r.join("")
    } catch {
        return !1
    }
}

function Ku(e) {
    return e.exception ?.values ?.[0]
}
const vS = "ExtraErrorData",
    TS = ((e = {}) => {
        const {
            depth: t = 3,
            captureErrorCause: n = !0
        } = e;
        return {
            name: vS,
            processEvent(r, o, s) {
                const {
                    maxValueLength: i
                } = s.getOptions();
                return IS(r, o, t, n, i)
            }
        }
    }),
    Gx = TS;

function IS(e, t = {}, n, r, o) {
    if (!t.originalException || !kt(t.originalException)) return e;
    const s = t.originalException.name || t.originalException.constructor.name,
        i = ep(t.originalException, r, o);
    if (i) {
        const a = { ...e.contexts
            },
            c = Ge(i, n);
        return mt(c) && (we(c, "__sentry_skip_normalization__", !0), a[s] = c), { ...e,
            contexts: a
        }
    }
    return e
}

function ep(e, t, n) {
    try {
        const r = ["name", "message", "stack", "line", "column", "fileName", "lineNumber", "columnNumber", "toJSON"],
            o = {};
        for (const s of Object.keys(e)) {
            if (r.indexOf(s) !== -1) continue;
            const i = e[s];
            o[s] = kt(i) || typeof i == "string" ? n ? Dr(`${i}`, n) : `${i}` : i
        }
        if (t && e.cause !== void 0)
            if (kt(e.cause)) {
                const s = e.cause.name || e.cause.constructor.name;
                o.cause = {
                    [s]: ep(e.cause, !1, n)
                }
            } else o.cause = e.cause;
        if (typeof e.toJSON == "function") {
            const s = e.toJSON();
            for (const i of Object.keys(s)) {
                const a = s[i];
                o[i] = kt(a) ? a.toString() : a
            }
        }
        return o
    } catch (r) {
        R && g.error("Unable to extract extra data from the Error object:", r)
    }
    return null
}

function wS(e, t) {
    let n = 0;
    for (let r = e.length - 1; r >= 0; r--) {
        const o = e[r];
        o === "." ? e.splice(r, 1) : o === ".." ? (e.splice(r, 1), n++) : n && (e.splice(r, 1), n--)
    }
    if (t)
        for (; n--; n) e.unshift("..");
    return e
}
const kS = /^(\S+:\\|\/?)([\s\S]*?)((?:\.{1,2}|[^/\\]+?|)(\.[^./\\]*|))(?:[/\\]*)$/;

function RS(e) {
    const t = e.length > 1024 ? `<truncated>${e.slice(-1024)}` : e,
        n = kS.exec(t);
    return n ? n.slice(1) : []
}

function Yu(...e) {
    let t = "",
        n = !1;
    for (let r = e.length - 1; r >= -1 && !n; r--) {
        const o = r >= 0 ? e[r] : "/";
        o && (t = `${o}/${t}`, n = o.charAt(0) === "/")
    }
    return t = wS(t.split("/").filter(r => !!r), !n).join("/"), (n ? "/" : "") + t || "."
}

function Xu(e) {
    let t = 0;
    for (; t < e.length && e[t] === ""; t++);
    let n = e.length - 1;
    for (; n >= 0 && e[n] === ""; n--);
    return t > n ? [] : e.slice(t, n - t + 1)
}

function CS(e, t) {
    e = Yu(e).slice(1), t = Yu(t).slice(1);
    const n = Xu(e.split("/")),
        r = Xu(t.split("/")),
        o = Math.min(n.length, r.length);
    let s = o;
    for (let a = 0; a < o; a++)
        if (n[a] !== r[a]) {
            s = a;
            break
        }
    let i = [];
    for (let a = s; a < n.length; a++) i.push("..");
    return i = i.concat(r.slice(s)), i.join("/")
}

function AS(e, t) {
    return RS(e)[2] || ""
}
const xS = "RewriteFrames",
    Vx = (e = {}) => {
        const t = e.root,
            n = e.prefix || "app:///",
            r = "window" in $ && !!$.window,
            o = e.iteratee || MS({
                isBrowser: r,
                root: t,
                prefix: n
            });

        function s(a) {
            try {
                return { ...a,
                    exception: { ...a.exception,
                        values: a.exception.values.map(c => ({ ...c,
                            ...c.stacktrace && {
                                stacktrace: i(c.stacktrace)
                            }
                        }))
                    }
                }
            } catch {
                return a
            }
        }

        function i(a) {
            return { ...a,
                frames: a ?.frames ?.map(c => o(c))
            }
        }
        return {
            name: xS,
            processEvent(a) {
                let c = a;
                return a.exception && Array.isArray(a.exception.values) && (c = s(c)), c
            }
        }
    };

function MS({
    isBrowser: e,
    root: t,
    prefix: n
}) {
    return r => {
        if (!r.filename) return r;
        const o = /^[a-zA-Z]:\\/.test(r.filename) || r.filename.includes("\\") && !r.filename.includes("/"),
            s = /^\//.test(r.filename);
        if (e) {
            if (t) {
                const i = r.filename;
                i.indexOf(t) === 0 && (r.filename = i.replace(t, n))
            }
        } else if (o || s) {
            const i = o ? r.filename.replace(/^[a-zA-Z]:/, "").replace(/\\/g, "/") : r.filename,
                a = t ? CS(t, i) : AS(i);
            r.filename = `${n}${a}`
        }
        return r
    }
}
const NS = ["reauthenticate", "signInAnonymously", "signInWithOAuth", "signInWithIdToken", "signInWithOtp", "signInWithPassword", "signInWithSSO", "signOut", "signUp", "verifyOtp"],
    OS = ["createUser", "deleteUser", "listUsers", "getUserById", "updateUserById", "inviteUserByEmail"],
    PS = {
        eq: "eq",
        neq: "neq",
        gt: "gt",
        gte: "gte",
        lt: "lt",
        lte: "lte",
        like: "like",
        "like(all)": "likeAllOf",
        "like(any)": "likeAnyOf",
        ilike: "ilike",
        "ilike(all)": "ilikeAllOf",
        "ilike(any)": "ilikeAnyOf",
        is: "is",
        in: "in",
        cs: "contains",
        cd: "containedBy",
        sr: "rangeGt",
        nxl: "rangeGte",
        sl: "rangeLt",
        nxr: "rangeLte",
        adj: "rangeAdjacent",
        ov: "overlaps",
        fts: "",
        plfts: "plain",
        phfts: "phrase",
        wfts: "websearch",
        not: "not"
    },
    tp = ["select", "insert", "upsert", "update", "delete"];

function js(e) {
    try {
        e.__SENTRY_INSTRUMENTED__ = !0
    } catch {}
}

function zs(e) {
    try {
        return e.__SENTRY_INSTRUMENTED__
    } catch {
        return !1
    }
}

function LS(e, t = {}) {
    switch (e) {
        case "GET":
            return "select";
        case "POST":
            return t.Prefer ?.includes("resolution=") ? "upsert" : "insert";
        case "PATCH":
            return "update";
        case "DELETE":
            return "delete";
        default:
            return "<unknown-op>"
    }
}

function DS(e, t) {
    if (t === "" || t === "*") return "select(*)";
    if (e === "select") return `select(${t})`;
    if (e === "or" || e.endsWith(".or")) return `${e}${t}`;
    const [n, ...r] = t.split(".");
    let o;
    return n ?.startsWith("fts") ? o = "textSearch" : n ?.startsWith("plfts") ? o = "textSearch[plain]" : n ?.startsWith("phfts") ? o = "textSearch[phrase]" : n ?.startsWith("wfts") ? o = "textSearch[websearch]" : o = n && PS[n] || "filter", `${o}(${e}, ${r.join(".")})`
}

function Qu(e, t = !1) {
    return new Proxy(e, {
        apply(n, r, o) {
            return ln({
                name: `auth ${t?"(admin) ":""}${e.name}`,
                attributes: {
                    [G]: "auto.db.supabase",
                    [pe]: "db",
                    "db.system": "postgresql",
                    "db.operation": `auth.${t?"admin.":""}${e.name}`
                }
            }, s => Reflect.apply(n, r, o).then(i => (i && typeof i == "object" && "error" in i && i.error ? (s.setStatus({
                code: Z
            }), _e(i.error, {
                mechanism: {
                    handled: !1,
                    type: "auto.db.supabase.auth"
                }
            })) : s.setStatus({
                code: Fs
            }), s.end(), i)).catch(i => {
                throw s.setStatus({
                    code: Z
                }), s.end(), _e(i, {
                    mechanism: {
                        handled: !1,
                        type: "auto.db.supabase.auth"
                    }
                }), i
            }).then(...o))
        }
    })
}

function FS(e) {
    const t = e.auth;
    if (!(!t || zs(e.auth))) {
        for (const n of NS) {
            const r = t[n];
            r && typeof e.auth[n] == "function" && (e.auth[n] = Qu(r))
        }
        for (const n of OS) {
            const r = t.admin[n];
            r && typeof e.auth.admin[n] == "function" && (e.auth.admin[n] = Qu(r, !0))
        }
        js(e.auth)
    }
}

function $S(e) {
    zs(e.prototype.from) || (e.prototype.from = new Proxy(e.prototype.from, {
        apply(t, n, r) {
            const o = Reflect.apply(t, n, r),
                s = o.constructor;
            return US(s), o
        }
    }), js(e.prototype.from))
}

function BS(e) {
    zs(e.prototype.then) || (e.prototype.then = new Proxy(e.prototype.then, {
        apply(t, n, r) {
            const o = tp,
                s = n,
                i = LS(s.method, s.headers);
            if (!o.includes(i) || !s ?.url ?.pathname || typeof s.url.pathname != "string") return Reflect.apply(t, n, r);
            const a = s.url.pathname.split("/"),
                c = a.length > 0 ? a[a.length - 1] : "",
                u = [];
            for (const [p, h] of s.url.searchParams.entries()) u.push(DS(p, h));
            const d = Object.create(null);
            if (mt(s.body))
                for (const [p, h] of Object.entries(s.body)) d[p] = h;
            const l = `${i==="select"?"":`${i}${d?"(...) ":""}`}${u.join(" ")} from(${c})`,
                f = {
                    "db.table": c,
                    "db.schema": s.schema,
                    "db.url": s.url.origin,
                    "db.sdk": s.headers["X-Client-Info"],
                    "db.system": "postgresql",
                    "db.operation": i,
                    [G]: "auto.db.supabase",
                    [pe]: "db"
                };
            return u.length && (f["db.query"] = u), Object.keys(d).length && (f["db.body"] = d), ln({
                name: l,
                attributes: f
            }, p => Reflect.apply(t, n, []).then(h => {
                if (p && (h && typeof h == "object" && "status" in h && os(p, h.status || 500), p.end()), h.error) {
                    const y = new Error(h.error.message);
                    h.error.code && (y.code = h.error.code), h.error.details && (y.details = h.error.details);
                    const b = {};
                    u.length && (b.query = u), Object.keys(d).length && (b.body = d), _e(y, N => (N.addEventProcessor(T => (Mt(T, {
                        handled: !1,
                        type: "auto.db.supabase.postgres"
                    }), T)), N.setContext("supabase", b), N))
                }
                const m = {
                        type: "supabase",
                        category: `db.${i}`,
                        message: l
                    },
                    _ = {};
                return u.length && (_.query = u), Object.keys(d).length && (_.body = d), Object.keys(_).length && (m.data = _), bt(m), h
            }, h => {
                throw p && (os(p, 500), p.end()), h
            }).then(...r))
        }
    }), js(e.prototype.then))
}

function US(e) {
    for (const t of tp) zs(e.prototype[t]) || (e.prototype[t] = new Proxy(e.prototype[t], {
        apply(n, r, o) {
            const s = Reflect.apply(n, r, o),
                i = s.constructor;
            return R && g.log(`Instrumenting ${t} operation's PostgRESTFilterBuilder`), BS(i), s
        }
    }), js(e.prototype[t]))
}
const HS = e => {
        if (!e) {
            R && g.warn("Supabase integration was not installed because no Supabase client was provided.");
            return
        }
        const t = e.constructor === Function ? e : e.constructor;
        $S(t), FS(e)
    },
    WS = "Supabase",
    jS = (e => ({
        setupOnce() {
            HS(e)
        },
        name: WS
    })),
    Jx = e => jS(e.supabaseClient),
    zS = 10,
    qS = "ZodErrors";

function GS(e) {
    return kt(e) && e.name === "ZodError" && Array.isArray(e.issues)
}

function VS(e) {
    return { ...e,
        path: "path" in e && Array.isArray(e.path) ? e.path.join(".") : void 0,
        keys: "keys" in e ? JSON.stringify(e.keys) : void 0,
        unionErrors: "unionErrors" in e ? JSON.stringify(e.unionErrors) : void 0
    }
}

function JS(e) {
    return e.map(t => typeof t == "number" ? "<array>" : t).join(".")
}

function KS(e) {
    const t = new Set;
    for (const r of e.issues) {
        const o = JS(r.path);
        o.length > 0 && t.add(o)
    }
    const n = Array.from(t);
    if (n.length === 0) {
        let r = "variable";
        if (e.issues.length > 0) {
            const o = e.issues[0];
            o !== void 0 && "expected" in o && typeof o.expected == "string" && (r = o.expected)
        }
        return `Failed to validate ${r}`
    }
    return `Failed to validate keys: ${Dr(n.join(", "),100)}`
}

function YS(e, t = !1, n, r) {
    if (!n.exception ?.values || !r.originalException || !GS(r.originalException) || r.originalException.issues.length === 0) return n;
    try {
        const s = (t ? r.originalException.issues : r.originalException.issues.slice(0, e)).map(VS);
        return t && (Array.isArray(r.attachments) || (r.attachments = []), r.attachments.push({
            filename: "zod_issues.json",
            data: JSON.stringify({
                issues: s
            })
        })), { ...n,
            exception: { ...n.exception,
                values: [{ ...n.exception.values[0],
                    value: KS(r.originalException)
                }, ...n.exception.values.slice(1)]
            },
            extra: { ...n.extra,
                "zoderror.issues": s.slice(0, e)
            }
        }
    } catch (o) {
        return { ...n,
            extra: { ...n.extra,
                "zoderrors sentry integration parse error": {
                    message: "an exception was thrown while processing ZodError within applyZodErrorsToEvent()",
                    error: o instanceof Error ? `${o.name}: ${o.message}
${o.stack}` : "unknown"
                }
            }
        }
    }
}
const XS = ((e = {}) => {
        const t = e.limit ?? zS;
        return {
            name: qS,
            processEvent(n, r) {
                return YS(t, e.saveZodIssuesAsAttachment, n, r)
            }
        }
    }),
    Kx = XS,
    Yx = e => ({
        name: "ThirdPartyErrorsFilter",
        setup(t) {
            t.on("beforeEnvelope", n => {
                kn(n, (r, o) => {
                    if (o === "event") {
                        const s = Array.isArray(r) ? r[1] : void 0;
                        s && (Xf(s), r[1] = s)
                    }
                })
            }), t.on("applyFrameMetadata", n => {
                if (n.type) return;
                const r = t.getOptions().stackParser;
                Yf(r, n)
            })
        },
        processEvent(t) {
            const n = QS(t);
            if (n) {
                const r = e.behaviour === "drop-error-if-contains-third-party-frames" || e.behaviour === "apply-tag-if-contains-third-party-frames" ? "some" : "every";
                if (n[r](s => !s.some(i => e.filterKeys.includes(i)))) {
                    if (e.behaviour === "drop-error-if-contains-third-party-frames" || e.behaviour === "drop-error-if-exclusively-contains-third-party-frames") return null;
                    t.tags = { ...t.tags,
                        third_party_code: !0
                    }
                }
            }
            return t
        }
    });

function QS(e) {
    const t = Qi(e);
    if (t) return t.filter(n => !!n.filename && (n.lineno ?? n.colno) != null).map(n => n.module_metadata ? Object.keys(n.module_metadata).filter(r => r.startsWith(Zu)).map(r => r.slice(Zu.length)) : [])
}
const Zu = "_sentryBundlerPluginAppKey:",
    ZS = 100,
    eb = 10,
    _o = "flag.evaluation.";

function _r(e) {
    const n = j().getScopeData().contexts.flags,
        r = n ? n.values : [];
    return r.length && (e.contexts === void 0 && (e.contexts = {}), e.contexts.flags = {
        values: [...r]
    }), e
}

function Rn(e, t, n = ZS) {
    const r = j().getScopeData().contexts;
    r.flags || (r.flags = {
        values: []
    });
    const o = r.flags.values;
    tb(o, e, t, n)
}

function tb(e, t, n, r) {
    if (typeof n != "boolean") return;
    if (e.length > r) {
        R && g.error(`[Feature Flags] insertToFlagBuffer called on a buffer larger than maxSize=${r}`);
        return
    }
    const o = e.findIndex(s => s.flag === t);
    o !== -1 && e.splice(o, 1), e.length === r && e.shift(), e.push({
        flag: t,
        result: n
    })
}

function Cn(e, t, n = eb) {
    if (typeof t != "boolean") return;
    const r = Ee();
    if (!r) return;
    const o = F(r).data;
    if (`${_o}${e}` in o) {
        r.setAttribute(`${_o}${e}`, t);
        return
    }
    Object.keys(o).filter(i => i.startsWith(_o)).length < n && r.setAttribute(`${_o}${e}`, t)
}
const Xx = () => ({
        name: "FeatureFlags",
        processEvent(e, t, n) {
            return _r(e)
        },
        addFeatureFlag(e, t) {
            Rn(e, t), Cn(e, t)
        }
    }),
    nb = ({
        growthbookClass: e
    }) => ({
        name: "GrowthBook",
        setupOnce() {
            const t = e.prototype;
            typeof t.isOn == "function" && xe(t, "isOn", el), typeof t.getFeatureValue == "function" && xe(t, "getFeatureValue", el)
        },
        processEvent(t, n, r) {
            return _r(t)
        }
    });

function el(e) {
    return function(...t) {
        const n = t[0],
            r = e.apply(this, t);
        return typeof n == "string" && typeof r == "boolean" && (Rn(n, r), Cn(n, r)), r
    }
}

function rb(e, t, n, r, o) {
    if (!e.fetchData) return;
    const {
        method: s,
        url: i
    } = e.fetchData, a = Ze() && t(i);
    if (e.endTimestamp && a) {
        const p = e.fetchData.__span;
        if (!p) return;
        const h = r[p];
        h && (ib(h, e), ob(h, e, o), delete r[p]);
        return
    }
    const {
        spanOrigin: c = "auto.http.browser",
        propagateTraceparent: u = !1
    } = typeof o == "object" ? o : {
        spanOrigin: o
    }, d = !!Ee(), l = a && d ? at(cb(i, s, c)) : new Nt;
    if (e.fetchData.__span = l.spanContext().spanId, r[l.spanContext().spanId] = l, n(e.fetchData.url)) {
        const p = e.args[0],
            h = e.args[1] || {},
            m = sb(p, h, Ze() && d ? l : void 0, u);
        m && (e.args[1] = h, h.headers = m)
    }
    const f = C();
    if (f) {
        const p = {
            input: e.args,
            response: e.response,
            startTimestamp: e.startTimestamp,
            endTimestamp: e.endTimestamp
        };
        f.emit("beforeOutgoingRequestSpan", l, p)
    }
    return l
}

function ob(e, t, n) {
    (typeof n == "object" && n !== null ? n.onRequestSpanEnd : void 0) ?.(e, {
        headers: t.response ?.headers,
        error: t.error
    })
}

function sb(e, t, n, r) {
    const o = Jf({
            span: n,
            propagateTraceparent: r
        }),
        s = o["sentry-trace"],
        i = o.baggage,
        a = o.traceparent;
    if (!s) return;
    const c = t.headers || (Ua(e) ? e.headers : void 0);
    if (c)
        if (ab(c)) {
            const u = new Headers(c);
            if (u.get("sentry-trace") || u.set("sentry-trace", s), r && a && !u.get("traceparent") && u.set("traceparent", a), i) {
                const d = u.get("baggage");
                d ? yo(d) || u.set("baggage", `${d},${i}`) : u.set("baggage", i)
            }
            return u
        } else if (Array.isArray(c)) {
        const u = [...c];
        c.find(l => l[0] === "sentry-trace") || u.push(["sentry-trace", s]), r && a && !c.find(l => l[0] === "traceparent") && u.push(["traceparent", a]);
        const d = c.find(l => l[0] === "baggage" && yo(l[1]));
        return i && !d && u.push(["baggage", i]), u
    } else {
        const u = "sentry-trace" in c ? c["sentry-trace"] : void 0,
            d = "traceparent" in c ? c.traceparent : void 0,
            l = "baggage" in c ? c.baggage : void 0,
            f = l ? Array.isArray(l) ? [...l] : [l] : [],
            p = l && (Array.isArray(l) ? l.find(m => yo(m)) : yo(l));
        i && !p && f.push(i);
        const h = { ...c,
            "sentry-trace": u ?? s,
            baggage: f.length > 0 ? f.join(",") : void 0
        };
        return r && a && !d && (h.traceparent = a), h
    } else return { ...o
    }
}

function ib(e, t) {
    if (t.response) {
        os(e, t.response.status);
        const n = t.response ?.headers ?.get("content-length");
        if (n) {
            const r = parseInt(n);
            r > 0 && e.setAttribute("http.response_content_length", r)
        }
    } else t.error && e.setStatus({
        code: Z,
        message: "internal_error"
    });
    e.end()
}

function yo(e) {
    return e.split(",").some(t => t.trim().startsWith(qa))
}

function ab(e) {
    return typeof Headers < "u" && xt(e, Headers)
}

function cb(e, t, n) {
    const r = ic(e);
    return {
        name: r ? `${t} ${By(r)}` : t,
        attributes: ub(e, r, t, n)
    }
}

function ub(e, t, n, r) {
    const o = {
        url: e,
        type: "fetch",
        "http.method": n,
        [G]: r,
        [pe]: "http.client"
    };
    return t && (sc(t) || (o["http.url"] = t.href, o["server.address"] = t.host), t.search && (o["http.query"] = t.search), t.hash && (o["http.fragment"] = t.hash)), o
}

function lb(e, t = {}, n = j()) {
    const {
        message: r,
        name: o,
        email: s,
        url: i,
        source: a,
        associatedEventId: c,
        tags: u
    } = e, d = {
        contexts: {
            feedback: {
                contact_email: s,
                name: o,
                message: r,
                url: i,
                source: a,
                associated_event_id: c
            }
        },
        type: "feedback",
        level: "info",
        tags: u
    }, l = n ?.getClient() || C();
    return l && l.emit("beforeSendFeedback", d, t), n.captureEvent(d, t)
}

function yr(e, t, n, r, o) {
    ls({
        level: e,
        message: t,
        attributes: n,
        severityNumber: o
    }, r)
}

function db(e, t, {
    scope: n
} = {}) {
    yr("trace", e, t, n)
}

function fb(e, t, {
    scope: n
} = {}) {
    yr("debug", e, t, n)
}

function pb(e, t, {
    scope: n
} = {}) {
    yr("info", e, t, n)
}

function hb(e, t, {
    scope: n
} = {}) {
    yr("warn", e, t, n)
}

function mb(e, t, {
    scope: n
} = {}) {
    yr("error", e, t, n)
}

function gb(e, t, {
    scope: n
} = {}) {
    yr("fatal", e, t, n)
}
const Qx = Object.freeze(Object.defineProperty({
    __proto__: null,
    debug: fb,
    error: mb,
    fatal: gb,
    fmt: jy,
    info: pb,
    trace: db,
    warn: hb
}, Symbol.toStringTag, {
    value: "Module"
}));

function ca(e, t, n) {
    return "util" in $ && typeof $.util.format == "function" ? $.util.format(...e) : _b(e, t, n)
}

function _b(e, t, n) {
    return e.map(r => Zt(r) ? String(r) : JSON.stringify(Ge(r, t, n))).join(" ")
}

function yb(e) {
    return /%[sdifocO]/.test(e)
}

function Sb(e, t) {
    const n = {},
        r = new Array(t.length).fill("{}").join(" ");
    return n["sentry.message.template"] = `${e} ${r}`, t.forEach((o, s) => {
        n[`sentry.message.parameter.${s}`] = o
    }), n
}
const bb = "ConsoleLogs",
    tl = {
        [G]: "auto.log.console"
    },
    Eb = ((e = {}) => {
        const t = e.levels || Fa;
        return {
            name: bb,
            setup(n) {
                const {
                    enableLogs: r,
                    normalizeDepth: o = 3,
                    normalizeMaxBreadth: s = 1e3
                } = n.getOptions();
                if (!r) {
                    R && g.warn("`enableLogs` is not enabled, ConsoleLogs integration disabled");
                    return
                }
                ac(({
                    args: i,
                    level: a
                }) => {
                    if (C() !== n || !t.includes(a)) return;
                    const c = i[0],
                        u = i.slice(1);
                    if (a === "assert") {
                        if (!c) {
                            const p = u.length > 0 ? `Assertion failed: ${ca(u,o,s)}` : "Assertion failed";
                            ls({
                                level: "error",
                                message: p,
                                attributes: tl
                            })
                        }
                        return
                    }
                    const d = a === "log",
                        l = i.length > 1 && typeof i[0] == "string" && !yb(i[0]),
                        f = { ...tl,
                            ...l ? Sb(c, u) : {}
                        };
                    ls({
                        level: d ? "info" : a,
                        message: ca(i, o, s),
                        severityNumber: d ? 10 : void 0,
                        attributes: f
                    })
                })
            }
        }
    }),
    Zx = Eb;

function cc(e, t, n, r) {
    yy({
        type: e,
        name: t,
        value: n,
        unit: r ?.unit,
        attributes: r ?.attributes
    }, {
        scope: r ?.scope
    })
}

function vb(e, t = 1, n) {
    cc("counter", e, t, n)
}

function Tb(e, t, n) {
    cc("gauge", e, t, n)
}

function Ib(e, t, n) {
    cc("distribution", e, t, n)
}
const eM = Object.freeze(Object.defineProperty({
        __proto__: null,
        count: vb,
        distribution: Ib,
        gauge: Tb
    }, Symbol.toStringTag, {
        value: "Module"
    })),
    wb = ["trace", "debug", "info", "warn", "error", "fatal"];

function tM(e = {}) {
    const t = new Set(e.levels ?? wb),
        n = e.client;
    return {
        log(r) {
            const {
                type: o,
                level: s,
                message: i,
                args: a,
                tag: c,
                date: u,
                ...d
            } = r, l = n || C();
            if (!l) return;
            const f = Cb(o, s);
            if (!t.has(f)) return;
            const {
                normalizeDepth: p = 3,
                normalizeMaxBreadth: h = 1e3
            } = l.getOptions(), m = [];
            i && m.push(i), a && a.length > 0 && m.push(ca(a, p, h));
            const _ = m.join(" ");
            d["sentry.origin"] = "auto.log.consola", c && (d["consola.tag"] = c), o && (d["consola.type"] = o), s != null && typeof s == "number" && (d["consola.level"] = s), ls({
                level: f,
                message: _,
                attributes: d
            })
        }
    }
}
const kb = {
        silent: "trace",
        fatal: "fatal",
        error: "error",
        warn: "warn",
        log: "info",
        info: "info",
        success: "info",
        fail: "error",
        ready: "info",
        start: "info",
        box: "info",
        debug: "debug",
        trace: "trace",
        verbose: "debug",
        critical: "fatal",
        notice: "info"
    },
    Rb = {
        0: "fatal",
        1: "warn",
        2: "info",
        3: "info",
        4: "debug",
        5: "trace"
    };

function Cb(e, t) {
    if (e === "verbose") return "debug";
    if (e === "silent") return "trace";
    if (e) {
        const n = kb[e];
        if (n) return n
    }
    if (typeof t == "number") {
        const n = Rb[t];
        if (n) return n
    }
    return "info"
}
const Ab = "gen_ai.prompt",
    qs = "gen_ai.system",
    We = "gen_ai.request.model",
    uc = "gen_ai.request.stream",
    Gs = "gen_ai.request.temperature",
    lc = "gen_ai.request.max_tokens",
    Vs = "gen_ai.request.frequency_penalty",
    dc = "gen_ai.request.presence_penalty",
    Js = "gen_ai.request.top_p",
    np = "gen_ai.request.top_k",
    xb = "gen_ai.request.encoding_format",
    Mb = "gen_ai.request.dimensions",
    dn = "gen_ai.response.finish_reasons",
    Dt = "gen_ai.response.model",
    Sr = "gen_ai.response.id",
    Nb = "gen_ai.response.stop_reason",
    An = "gen_ai.usage.input_tokens",
    xn = "gen_ai.usage.output_tokens",
    Mn = "gen_ai.usage.total_tokens",
    en = "gen_ai.operation.name",
    tn = "gen_ai.request.messages",
    et = "gen_ai.response.text",
    Ks = "gen_ai.request.available_tools",
    Ys = "gen_ai.response.streaming",
    Et = "gen_ai.response.tool_calls",
    rp = "gen_ai.agent.name",
    Ob = "gen_ai.pipeline.name",
    Pb = "gen_ai.usage.cache_creation_input_tokens",
    Lb = "gen_ai.usage.cache_read_input_tokens",
    Db = "gen_ai.invoke_agent",
    Fb = "openai.response.id",
    op = "openai.response.model",
    $b = "openai.response.timestamp",
    Bb = "openai.usage.completion_tokens",
    Ub = "openai.usage.prompt_tokens",
    Ai = {
        CHAT: "chat",
        RESPONSES: "responses",
        EMBEDDINGS: "embeddings"
    },
    nl = "anthropic.response.timestamp",
    sp = 2e4,
    ps = e => new TextEncoder().encode(e).length,
    hs = e => ps(JSON.stringify(e));

function fc(e, t) {
    if (ps(e) <= t) return e;
    let n = 0,
        r = e.length,
        o = "";
    for (; n <= r;) {
        const s = Math.floor((n + r) / 2),
            i = e.slice(0, s);
        ps(i) <= t ? (o = i, n = s + 1) : r = s - 1
    }
    return o
}

function Hb(e) {
    return typeof e == "string" ? e : "text" in e ? e.text : ""
}

function rl(e, t) {
    return typeof e == "string" ? t : { ...e,
        text: t
    }
}

function Wb(e) {
    return e !== null && typeof e == "object" && "content" in e && typeof e.content == "string"
}

function jb(e) {
    return e !== null && typeof e == "object" && "content" in e && Array.isArray(e.content)
}

function Mr(e) {
    return !e || typeof e != "object" ? !1 : zb(e) || ip(e) || "media_type" in e && typeof e.media_type == "string" && "data" in e || "image_url" in e && typeof e.image_url == "string" && e.image_url.startsWith("data:") || "type" in e && (e.type === "blob" || e.type === "base64") || "b64_json" in e || "type" in e && "result" in e && e.type === "image_generation" || "uri" in e && typeof e.uri == "string" && e.uri.startsWith("data:")
}

function zb(e) {
    return "type" in e && typeof e.type == "string" && "source" in e && Mr(e.source)
}

function ip(e) {
    return "inlineData" in e && !!e.inlineData && typeof e.inlineData == "object" && "data" in e.inlineData && typeof e.inlineData.data == "string"
}

function ap(e) {
    return e !== null && typeof e == "object" && "parts" in e && Array.isArray(e.parts) && e.parts.length > 0
}

function qb(e, t) {
    const n = { ...e,
            content: ""
        },
        r = hs(n),
        o = t - r;
    if (o <= 0) return [];
    const s = fc(e.content, o);
    return [{ ...e,
        content: s
    }]
}

function Gb(e, t) {
    const {
        parts: n
    } = e, r = n.map(a => rl(a, "")), o = hs({ ...e,
        parts: r
    });
    let s = t - o;
    if (s <= 0) return [];
    const i = [];
    for (const a of n) {
        const c = Hb(a),
            u = ps(c);
        if (u <= s) i.push(a), s -= u;
        else if (i.length === 0) {
            const d = fc(c, s);
            d && i.push(rl(a, d));
            break
        } else break
    }
    return i.length <= 0 ? [] : [{ ...e,
        parts: i
    }]
}

function Vb(e, t) {
    return !e || typeof e != "object" ? [] : Wb(e) ? qb(e, t) : ap(e) ? Gb(e, t) : []
}
const ol = "[Filtered]",
    Jb = ["image_url", "data", "content", "b64_json", "result", "uri"];

function Uo(e) {
    const t = { ...e
    };
    Mr(t.source) && (t.source = Uo(t.source)), ip(e) && (t.inlineData = { ...e.inlineData,
        data: ol
    });
    for (const n of Jb) typeof t[n] == "string" && (t[n] = ol);
    return t
}

function ua(e) {
    return e.map(n => {
        let r;
        return n && typeof n == "object" && (jb(n) ? r = { ...n,
            content: ua(n.content)
        } : "content" in n && Mr(n.content) && (r = { ...n,
            content: Uo(n.content)
        }), ap(n) && (r = { ...r ?? n,
            parts : ua(n.parts)
        }), Mr(r) ? r = Uo(r) : Mr(n) && (r = Uo(n))), r ?? n
    })
}

function Kb(e, t) {
    if (!Array.isArray(e) || e.length === 0) return e;
    const n = ua(e);
    if (hs(n) <= t) return n;
    const o = n.map(hs);
    let s = 0,
        i = n.length;
    for (let a = n.length - 1; a >= 0; a--) {
        const c = o[a];
        if (c && s + c > t) break;
        c && (s += c), i = a
    }
    if (i === n.length) {
        const a = n[n.length - 1];
        return Vb(a, t)
    }
    return n.slice(i)
}

function Xs(e) {
    return Kb(e, sp)
}

function Yb(e) {
    return fc(e, sp)
}

function Xr(e) {
    return e.includes("messages") ? "messages" : e.includes("completions") ? "completions" : e.includes("models") ? "models" : e.includes("chat") ? "chat" : e.split(".").pop() || "unknown"
}

function ms(e) {
    return `gen_ai.${Xr(e)}`
}

function cp(e, t) {
    return e ? `${e}.${t}` : t
}

function pc(e, t, n, r, o) {
    if (t !== void 0 && e.setAttributes({
            [An]: t
        }), n !== void 0 && e.setAttributes({
            [xn]: n
        }), t !== void 0 || n !== void 0 || r !== void 0 || o !== void 0) {
        const s = (t ?? 0) + (n ?? 0) + (r ?? 0) + (o ?? 0);
        e.setAttributes({
            [Mn]: s
        })
    }
}

function gs(e) {
    if (typeof e == "string") return Yb(e);
    if (Array.isArray(e)) {
        const t = Xs(e);
        return JSON.stringify(t)
    }
    return JSON.stringify(e)
}
const Xb = ["responses.create", "chat.completions.create", "embeddings.create"],
    Qb = ["response.output_item.added", "response.function_call_arguments.delta", "response.function_call_arguments.done", "response.output_item.done"],
    Zb = ["response.created", "response.in_progress", "response.failed", "response.completed", "response.incomplete", "response.queued", "response.output_text.delta", ...Qb];

function hc(e) {
    return e.includes("chat.completions") ? Ai.CHAT : e.includes("responses") ? Ai.RESPONSES : e.includes("embeddings") ? Ai.EMBEDDINGS : e.split(".").pop() || "unknown"
}

function sl(e) {
    return `gen_ai.${hc(e)}`
}

function eE(e) {
    return Xb.includes(e)
}

function tE(e, t) {
    return e ? `${e}.${t}` : t
}

function nE(e) {
    return e !== null && typeof e == "object" && "object" in e && e.object === "chat.completion"
}

function rE(e) {
    return e !== null && typeof e == "object" && "object" in e && e.object === "response"
}

function oE(e) {
    if (e === null || typeof e != "object" || !("object" in e)) return !1;
    const t = e;
    return t.object === "list" && typeof t.model == "string" && t.model.toLowerCase().includes("embedding")
}

function sE(e) {
    return e !== null && typeof e == "object" && "type" in e && typeof e.type == "string" && e.type.startsWith("response.")
}

function iE(e) {
    return e !== null && typeof e == "object" && "object" in e && e.object === "chat.completion.chunk"
}

function aE(e, t, n) {
    if (mc(e, t.id, t.model, t.created), t.usage && Qs(e, t.usage.prompt_tokens, t.usage.completion_tokens, t.usage.total_tokens), Array.isArray(t.choices)) {
        const r = t.choices.map(o => o.finish_reason).filter(o => o !== null);
        if (r.length > 0 && e.setAttributes({
                [dn]: JSON.stringify(r)
            }), n) {
            const o = t.choices.map(s => s.message ?.tool_calls).filter(s => Array.isArray(s) && s.length > 0).flat();
            o.length > 0 && e.setAttributes({
                [Et]: JSON.stringify(o)
            })
        }
    }
}

function cE(e, t, n) {
    if (mc(e, t.id, t.model, t.created_at), t.status && e.setAttributes({
            [dn]: JSON.stringify([t.status])
        }), t.usage && Qs(e, t.usage.input_tokens, t.usage.output_tokens, t.usage.total_tokens), n) {
        const r = t;
        if (Array.isArray(r.output) && r.output.length > 0) {
            const o = r.output.filter(s => typeof s == "object" && s !== null && s.type === "function_call");
            o.length > 0 && e.setAttributes({
                [Et]: JSON.stringify(o)
            })
        }
    }
}

function uE(e, t) {
    e.setAttributes({
        [op]: t.model,
        [Dt]: t.model
    }), t.usage && Qs(e, t.usage.prompt_tokens, void 0, t.usage.total_tokens)
}

function Qs(e, t, n, r) {
    t !== void 0 && e.setAttributes({
        [Ub]: t,
        [An]: t
    }), n !== void 0 && e.setAttributes({
        [Bb]: n,
        [xn]: n
    }), r !== void 0 && e.setAttributes({
        [Mn]: r
    })
}

function mc(e, t, n, r) {
    e.setAttributes({
        [Fb]: t,
        [Sr]: t
    }), e.setAttributes({
        [op]: n,
        [Dt]: n
    }), e.setAttributes({
        [$b]: new Date(r * 1e3).toISOString()
    })
}

function lE(e, t) {
    for (const n of e) {
        const r = n.index;
        if (!(r === void 0 || !n.function))
            if (!(r in t.chatCompletionToolCalls)) t.chatCompletionToolCalls[r] = { ...n,
                function: {
                    name: n.function.name,
                    arguments: n.function.arguments || ""
                }
            };
            else {
                const o = t.chatCompletionToolCalls[r];
                n.function.arguments && o ?.function && (o.function.arguments += n.function.arguments)
            }
    }
}

function dE(e, t, n) {
    t.responseId = e.id ?? t.responseId, t.responseModel = e.model ?? t.responseModel, t.responseTimestamp = e.created ?? t.responseTimestamp, e.usage && (t.promptTokens = e.usage.prompt_tokens, t.completionTokens = e.usage.completion_tokens, t.totalTokens = e.usage.total_tokens);
    for (const r of e.choices ?? []) n && (r.delta ?.content && t.responseTexts.push(r.delta.content), r.delta ?.tool_calls && lE(r.delta.tool_calls, t)), r.finish_reason && t.finishReasons.push(r.finish_reason)
}

function fE(e, t, n, r) {
    if (!(e && typeof e == "object")) {
        t.eventTypes.push("unknown:non-object");
        return
    }
    if (e instanceof Error) {
        r.setStatus({
            code: Z,
            message: "internal_error"
        }), _e(e, {
            mechanism: {
                handled: !1,
                type: "auto.ai.openai.stream-response"
            }
        });
        return
    }
    if (!("type" in e)) return;
    const o = e;
    if (!Zb.includes(o.type)) {
        t.eventTypes.push(o.type);
        return
    }
    if (n && (o.type === "response.output_item.done" && "item" in o && t.responsesApiToolCalls.push(o.item), o.type === "response.output_text.delta" && "delta" in o && o.delta)) {
        t.responseTexts.push(o.delta);
        return
    }
    if ("response" in o) {
        const {
            response: s
        } = o;
        t.responseId = s.id ?? t.responseId, t.responseModel = s.model ?? t.responseModel, t.responseTimestamp = s.created_at ?? t.responseTimestamp, s.usage && (t.promptTokens = s.usage.input_tokens, t.completionTokens = s.usage.output_tokens, t.totalTokens = s.usage.total_tokens), s.status && t.finishReasons.push(s.status), n && s.output_text && t.responseTexts.push(s.output_text)
    }
}
async function* pE(e, t, n) {
    const r = {
        eventTypes: [],
        responseTexts: [],
        finishReasons: [],
        responseId: "",
        responseModel: "",
        responseTimestamp: 0,
        promptTokens: void 0,
        completionTokens: void 0,
        totalTokens: void 0,
        chatCompletionToolCalls: {},
        responsesApiToolCalls: []
    };
    try {
        for await (const o of e) iE(o) ? dE(o, r, n) : sE(o) && fE(o, r, n, t), yield o
    } finally {
        mc(t, r.responseId, r.responseModel, r.responseTimestamp), Qs(t, r.promptTokens, r.completionTokens, r.totalTokens), t.setAttributes({
            [Ys]: !0
        }), r.finishReasons.length && t.setAttributes({
            [dn]: JSON.stringify(r.finishReasons)
        }), n && r.responseTexts.length && t.setAttributes({
            [et]: r.responseTexts.join("")
        });
        const s = [...Object.values(r.chatCompletionToolCalls), ...r.responsesApiToolCalls];
        s.length > 0 && t.setAttributes({
            [Et]: JSON.stringify(s)
        }), t.end()
    }
}

function hE(e, t) {
    const n = {
        [qs]: "openai",
        [en]: hc(t),
        [G]: "auto.ai.openai"
    };
    if (e.length > 0 && typeof e[0] == "object" && e[0] !== null) {
        const r = e[0],
            o = Array.isArray(r.tools) ? r.tools : [],
            i = r.web_search_options && typeof r.web_search_options == "object" ? [{
                type: "web_search_options",
                ...r.web_search_options
            }] : [],
            a = [...o, ...i];
        a.length > 0 && (n[Ks] = JSON.stringify(a))
    }
    if (e.length > 0 && typeof e[0] == "object" && e[0] !== null) {
        const r = e[0];
        n[We] = r.model ?? "unknown", "temperature" in r && (n[Gs] = r.temperature), "top_p" in r && (n[Js] = r.top_p), "frequency_penalty" in r && (n[Vs] = r.frequency_penalty), "presence_penalty" in r && (n[dc] = r.presence_penalty), "stream" in r && (n[uc] = r.stream), "encoding_format" in r && (n[xb] = r.encoding_format), "dimensions" in r && (n[Mb] = r.dimensions)
    } else n[We] = "unknown";
    return n
}

function mE(e, t, n) {
    if (!t || typeof t != "object") return;
    const r = t;
    if (nE(r)) {
        if (aE(e, r, n), n && r.choices ?.length) {
            const o = r.choices.map(s => s.message ?.content || "");
            e.setAttributes({
                [et]: JSON.stringify(o)
            })
        }
    } else rE(r) ? (cE(e, r, n), n && r.output_text && e.setAttributes({
        [et]: r.output_text
    })) : oE(r) && uE(e, r)
}

function il(e, t) {
    if ("messages" in t) {
        const n = gs(t.messages);
        e.setAttributes({
            [tn]: n
        })
    }
    if ("input" in t) {
        const n = gs(t.input);
        e.setAttributes({
            [tn]: n
        })
    }
}

function gE(e, t, n, r) {
    return async function(...s) {
        const i = hE(s, t),
            a = i[We] || "unknown",
            c = hc(t),
            u = s[0];
        return u && typeof u == "object" && u.stream === !0 ? jt({
            name: `${c} ${a} stream-response`,
            op: sl(t),
            attributes: i
        }, async l => {
            try {
                r.recordInputs && u && il(l, u);
                const f = await e.apply(n, s);
                return pE(f, l, r.recordOutputs ?? !1)
            } catch (f) {
                throw l.setStatus({
                    code: Z,
                    message: "internal_error"
                }), _e(f, {
                    mechanism: {
                        handled: !1,
                        type: "auto.ai.openai.stream",
                        data: {
                            function: t
                        }
                    }
                }), l.end(), f
            }
        }) : ln({
            name: `${c} ${a}`,
            op: sl(t),
            attributes: i
        }, async l => {
            try {
                r.recordInputs && u && il(l, u);
                const f = await e.apply(n, s);
                return mE(l, f, r.recordOutputs), f
            } catch (f) {
                throw _e(f, {
                    mechanism: {
                        handled: !1,
                        type: "auto.ai.openai",
                        data: {
                            function: t
                        }
                    }
                }), f
            }
        })
    }
}

function up(e, t = "", n) {
    return new Proxy(e, {
        get(r, o) {
            const s = r[o],
                i = tE(t, String(o));
            return typeof s == "function" && eE(i) ? gE(s, i, r, n) : typeof s == "function" ? s.bind(r) : s && typeof s == "object" ? up(s, i, n) : s
        }
    })
}

function nM(e, t) {
    const n = !!C() ?.getOptions().sendDefaultPii,
        r = {
            recordInputs: n,
            recordOutputs: n,
            ...t
        };
    return up(e, "", r)
}

function _E(e, t) {
    return "type" in e && typeof e.type == "string" && e.type === "error" ? (t.setStatus({
        code: Z,
        message: e.error ?.type ?? "internal_error"
    }), _e(e.error, {
        mechanism: {
            handled: !1,
            type: "auto.ai.anthropic.anthropic_error"
        }
    }), !0) : !1
}

function yE(e, t) {
    if (e.type === "message_delta" && e.usage && "output_tokens" in e.usage && typeof e.usage.output_tokens == "number" && (t.completionTokens = e.usage.output_tokens), e.message) {
        const n = e.message;
        n.id && (t.responseId = n.id), n.model && (t.responseModel = n.model), n.stop_reason && t.finishReasons.push(n.stop_reason), n.usage && (typeof n.usage.input_tokens == "number" && (t.promptTokens = n.usage.input_tokens), typeof n.usage.cache_creation_input_tokens == "number" && (t.cacheCreationInputTokens = n.usage.cache_creation_input_tokens), typeof n.usage.cache_read_input_tokens == "number" && (t.cacheReadInputTokens = n.usage.cache_read_input_tokens))
    }
}

function SE(e, t) {
    e.type !== "content_block_start" || typeof e.index != "number" || !e.content_block || (e.content_block.type === "tool_use" || e.content_block.type === "server_tool_use") && (t.activeToolBlocks[e.index] = {
        id: e.content_block.id,
        name: e.content_block.name,
        inputJsonParts: []
    })
}

function bE(e, t, n) {
    if (!(e.type !== "content_block_delta" || !e.delta)) {
        if (typeof e.index == "number" && "partial_json" in e.delta && typeof e.delta.partial_json == "string") {
            const r = t.activeToolBlocks[e.index];
            r && r.inputJsonParts.push(e.delta.partial_json)
        }
        n && typeof e.delta.text == "string" && t.responseTexts.push(e.delta.text)
    }
}

function EE(e, t) {
    if (e.type !== "content_block_stop" || typeof e.index != "number") return;
    const n = t.activeToolBlocks[e.index];
    if (!n) return;
    const r = n.inputJsonParts.join("");
    let o;
    try {
        o = r ? JSON.parse(r) : {}
    } catch {
        o = {
            __unparsed: r
        }
    }
    t.toolCalls.push({
        type: "tool_use",
        id: n.id,
        name: n.name,
        input: o
    }), delete t.activeToolBlocks[e.index]
}

function lp(e, t, n, r) {
    !(e && typeof e == "object") || _E(e, r) || (yE(e, t), SE(e, t), bE(e, t, n), EE(e, t))
}

function vE(e, t, n) {
    t.isRecording() && (e.responseId && t.setAttributes({
        [Sr]: e.responseId
    }), e.responseModel && t.setAttributes({
        [Dt]: e.responseModel
    }), pc(t, e.promptTokens, e.completionTokens, e.cacheCreationInputTokens, e.cacheReadInputTokens), t.setAttributes({
        [Ys]: !0
    }), e.finishReasons.length > 0 && t.setAttributes({
        [dn]: JSON.stringify(e.finishReasons)
    }), n && e.responseTexts.length > 0 && t.setAttributes({
        [et]: e.responseTexts.join("")
    }), n && e.toolCalls.length > 0 && t.setAttributes({
        [Et]: JSON.stringify(e.toolCalls)
    }), t.end())
}
async function* TE(e, t, n) {
    const r = {
        responseTexts: [],
        finishReasons: [],
        responseId: "",
        responseModel: "",
        promptTokens: void 0,
        completionTokens: void 0,
        cacheCreationInputTokens: void 0,
        cacheReadInputTokens: void 0,
        toolCalls: [],
        activeToolBlocks: {}
    };
    try {
        for await (const o of e) lp(o, r, n, t), yield o
    } finally {
        r.responseId && t.setAttributes({
            [Sr]: r.responseId
        }), r.responseModel && t.setAttributes({
            [Dt]: r.responseModel
        }), pc(t, r.promptTokens, r.completionTokens, r.cacheCreationInputTokens, r.cacheReadInputTokens), t.setAttributes({
            [Ys]: !0
        }), r.finishReasons.length > 0 && t.setAttributes({
            [dn]: JSON.stringify(r.finishReasons)
        }), n && r.responseTexts.length > 0 && t.setAttributes({
            [et]: r.responseTexts.join("")
        }), n && r.toolCalls.length > 0 && t.setAttributes({
            [Et]: JSON.stringify(r.toolCalls)
        }), t.end()
    }
}

function IE(e, t, n) {
    const r = {
        responseTexts: [],
        finishReasons: [],
        responseId: "",
        responseModel: "",
        promptTokens: void 0,
        completionTokens: void 0,
        cacheCreationInputTokens: void 0,
        cacheReadInputTokens: void 0,
        toolCalls: [],
        activeToolBlocks: {}
    };
    return e.on("streamEvent", o => {
        lp(o, r, n, t)
    }), e.on("message", () => {
        vE(r, t, n)
    }), e.on("error", o => {
        _e(o, {
            mechanism: {
                handled: !1,
                type: "auto.ai.anthropic.stream_error"
            }
        }), t.isRecording() && (t.setStatus({
            code: Z,
            message: "stream_error"
        }), t.end())
    }), e
}
const wE = ["messages.create", "messages.stream", "messages.countTokens", "models.get", "completions.create", "models.retrieve", "beta.messages.create"];

function kE(e) {
    return wE.includes(e)
}

function RE(e, t) {
    t.error && (e.setStatus({
        code: Z,
        message: t.error.type || "internal_error"
    }), _e(t.error, {
        mechanism: {
            handled: !1,
            type: "auto.ai.anthropic.anthropic_error"
        }
    }))
}

function CE(e) {
    const {
        system: t,
        messages: n
    } = e, r = typeof t == "string" ? [{
        role: "system",
        content: e.system
    }] : [], o = Array.isArray(n) ? n : n != null ? [n] : [];
    return [...r, ...o]
}

function AE(e, t) {
    const n = {
        [qs]: "anthropic",
        [en]: Xr(t),
        [G]: "auto.ai.anthropic"
    };
    if (e.length > 0 && typeof e[0] == "object" && e[0] !== null) {
        const r = e[0];
        r.tools && Array.isArray(r.tools) && (n[Ks] = JSON.stringify(r.tools)), n[We] = r.model ?? "unknown", "temperature" in r && (n[Gs] = r.temperature), "top_p" in r && (n[Js] = r.top_p), "stream" in r && (n[uc] = r.stream), "top_k" in r && (n[np] = r.top_k), "frequency_penalty" in r && (n[Vs] = r.frequency_penalty), "max_tokens" in r && (n[lc] = r.max_tokens)
    } else t === "models.retrieve" || t === "models.get" ? n[We] = e[0] : n[We] = "unknown";
    return n
}

function la(e, t) {
    const n = CE(t);
    if (n.length) {
        const r = gs(n);
        e.setAttributes({
            [tn]: r
        })
    }
    if ("input" in t) {
        const r = gs(t.input);
        e.setAttributes({
            [tn]: r
        })
    }
    "prompt" in t && e.setAttributes({
        [Ab]: JSON.stringify(t.prompt)
    })
}

function xE(e, t) {
    if ("content" in t && Array.isArray(t.content)) {
        e.setAttributes({
            [et]: t.content.map(r => r.text).filter(r => !!r).join("")
        });
        const n = [];
        for (const r of t.content)(r.type === "tool_use" || r.type === "server_tool_use") && n.push(r);
        n.length > 0 && e.setAttributes({
            [Et]: JSON.stringify(n)
        })
    }
    "completion" in t && e.setAttributes({
        [et]: t.completion
    }), "input_tokens" in t && e.setAttributes({
        [et]: JSON.stringify(t.input_tokens)
    })
}

function ME(e, t) {
    "id" in t && "model" in t && (e.setAttributes({
        [Sr]: t.id,
        [Dt]: t.model
    }), "created" in t && typeof t.created == "number" && e.setAttributes({
        [nl]: new Date(t.created * 1e3).toISOString()
    }), "created_at" in t && typeof t.created_at == "number" && e.setAttributes({
        [nl]: new Date(t.created_at * 1e3).toISOString()
    }), "usage" in t && t.usage && pc(e, t.usage.input_tokens, t.usage.output_tokens, t.usage.cache_creation_input_tokens, t.usage.cache_read_input_tokens))
}

function NE(e, t, n) {
    if (!(!t || typeof t != "object")) {
        if ("type" in t && t.type === "error") {
            RE(e, t);
            return
        }
        n && xE(e, t), ME(e, t)
    }
}

function al(e, t, n) {
    throw _e(e, {
        mechanism: {
            handled: !1,
            type: "auto.ai.anthropic",
            data: {
                function: n
            }
        }
    }), t.isRecording() && (t.setStatus({
        code: Z,
        message: "internal_error"
    }), t.end()), e
}

function OE(e, t, n, r, o, s, i, a, c, u, d) {
    const l = o[We] ?? "unknown",
        f = {
            name: `${s} ${l} stream-response`,
            op: ms(i),
            attributes: o
        };
    return u && !d ? jt(f, async p => {
        try {
            c.recordInputs && a && la(p, a);
            const h = await e.apply(n, r);
            return TE(h, p, c.recordOutputs ?? !1)
        } catch (h) {
            return al(h, p, i)
        }
    }) : jt(f, p => {
        try {
            c.recordInputs && a && la(p, a);
            const h = t.apply(n, r);
            return IE(h, p, c.recordOutputs ?? !1)
        } catch (h) {
            return al(h, p, i)
        }
    })
}

function PE(e, t, n, r) {
    return new Proxy(e, {
        apply(o, s, i) {
            const a = AE(i, t),
                c = a[We] ?? "unknown",
                u = Xr(t),
                d = typeof i[0] == "object" ? i[0] : void 0,
                l = !!d ?.stream,
                f = t === "messages.stream";
            return l || f ? OE(e, o, n, i, a, u, t, d, r, l, f) : ln({
                name: `${u} ${c}`,
                op: ms(t),
                attributes: a
            }, p => (r.recordInputs && d && la(p, d), Hs(() => o.apply(n, i), h => {
                _e(h, {
                    mechanism: {
                        handled: !1,
                        type: "auto.ai.anthropic",
                        data: {
                            function: t
                        }
                    }
                })
            }, () => {}, h => NE(p, h, r.recordOutputs))))
        }
    })
}

function dp(e, t = "", n) {
    return new Proxy(e, {
        get(r, o) {
            const s = r[o],
                i = cp(t, String(o));
            return typeof s == "function" && kE(i) ? PE(s, i, r, n) : typeof s == "function" ? s.bind(r) : s && typeof s == "object" ? dp(s, i, n) : s
        }
    })
}

function rM(e, t) {
    const n = !!C() ?.getOptions().sendDefaultPii,
        r = {
            recordInputs: n,
            recordOutputs: n,
            ...t
        };
    return dp(e, "", r)
}
const cl = ["models.generateContent", "models.generateContentStream", "chats.create", "sendMessage", "sendMessageStream"],
    LE = "google_genai",
    fp = "chats.create",
    DE = "chat";

function FE(e, t) {
    const n = e ?.promptFeedback;
    if (n ?.blockReason) {
        const r = n.blockReasonMessage ?? n.blockReason;
        return t.setStatus({
            code: Z,
            message: `Content blocked: ${r}`
        }), _e(`Content blocked: ${r}`, {
            mechanism: {
                handled: !1,
                type: "auto.ai.google_genai"
            }
        }), !0
    }
    return !1
}

function $E(e, t) {
    typeof e.responseId == "string" && (t.responseId = e.responseId), typeof e.modelVersion == "string" && (t.responseModel = e.modelVersion);
    const n = e.usageMetadata;
    n && (typeof n.promptTokenCount == "number" && (t.promptTokens = n.promptTokenCount), typeof n.candidatesTokenCount == "number" && (t.completionTokens = n.candidatesTokenCount), typeof n.totalTokenCount == "number" && (t.totalTokens = n.totalTokenCount))
}

function BE(e, t, n) {
    Array.isArray(e.functionCalls) && t.toolCalls.push(...e.functionCalls);
    for (const r of e.candidates ?? []) {
        r ?.finishReason && !t.finishReasons.includes(r.finishReason) && t.finishReasons.push(r.finishReason);
        for (const o of r ?.content ?.parts ?? []) n && o.text && t.responseTexts.push(o.text), o.functionCall && t.toolCalls.push({
            type: "function",
            id: o.functionCall.id,
            name: o.functionCall.name,
            arguments: o.functionCall.args
        })
    }
}

function UE(e, t, n, r) {
    !e || FE(e, r) || ($E(e, t), BE(e, t, n))
}
async function* HE(e, t, n) {
    const r = {
        responseTexts: [],
        finishReasons: [],
        toolCalls: []
    };
    try {
        for await (const o of e) UE(o, r, n, t), yield o
    } finally {
        const o = {
            [Ys]: !0
        };
        r.responseId && (o[Sr] = r.responseId), r.responseModel && (o[Dt] = r.responseModel), r.promptTokens !== void 0 && (o[An] = r.promptTokens), r.completionTokens !== void 0 && (o[xn] = r.completionTokens), r.totalTokens !== void 0 && (o[Mn] = r.totalTokens), r.finishReasons.length && (o[dn] = JSON.stringify(r.finishReasons)), n && r.responseTexts.length && (o[et] = r.responseTexts.join("")), n && r.toolCalls.length && (o[Et] = JSON.stringify(r.toolCalls)), t.setAttributes(o), t.end()
    }
}

function WE(e) {
    if (cl.includes(e)) return !0;
    const t = e.split(".").pop();
    return cl.includes(t)
}

function jE(e) {
    return e.includes("Stream")
}

function Cr(e, t = "user") {
    return typeof e == "string" ? [{
        role: t,
        content: e
    }] : Array.isArray(e) ? e.flatMap(n => Cr(n, t)) : typeof e != "object" || !e ? [] : "role" in e && typeof e.role == "string" ? [e] : "parts" in e ? [{ ...e,
        role: t
    }] : [{
        role: t,
        content: e
    }]
}

function ul(e, t) {
    if ("model" in e && typeof e.model == "string") return e.model;
    if (t && typeof t == "object") {
        const n = t;
        if ("model" in n && typeof n.model == "string") return n.model;
        if ("modelVersion" in n && typeof n.modelVersion == "string") return n.modelVersion
    }
    return "unknown"
}

function zE(e) {
    const t = {};
    return "temperature" in e && typeof e.temperature == "number" && (t[Gs] = e.temperature), "topP" in e && typeof e.topP == "number" && (t[Js] = e.topP), "topK" in e && typeof e.topK == "number" && (t[np] = e.topK), "maxOutputTokens" in e && typeof e.maxOutputTokens == "number" && (t[lc] = e.maxOutputTokens), "frequencyPenalty" in e && typeof e.frequencyPenalty == "number" && (t[Vs] = e.frequencyPenalty), "presencePenalty" in e && typeof e.presencePenalty == "number" && (t[dc] = e.presencePenalty), t
}

function qE(e, t, n) {
    const r = {
        [qs]: LE,
        [en]: Xr(e),
        [G]: "auto.ai.google_genai"
    };
    if (t) {
        if (r[We] = ul(t, n), "config" in t && typeof t.config == "object" && t.config) {
            const o = t.config;
            if (Object.assign(r, zE(o)), "tools" in o && Array.isArray(o.tools)) {
                const s = o.tools.flatMap(i => i.functionDeclarations);
                r[Ks] = JSON.stringify(s)
            }
        }
    } else r[We] = ul({}, n);
    return r
}

function ll(e, t) {
    const n = [];
    "config" in t && t.config && typeof t.config == "object" && "systemInstruction" in t.config && t.config.systemInstruction && n.push(...Cr(t.config.systemInstruction, "system")), "history" in t && n.push(...Cr(t.history, "user")), "contents" in t && n.push(...Cr(t.contents, "user")), "message" in t && n.push(...Cr(t.message, "user")), n.length && e.setAttributes({
        [tn]: JSON.stringify(Xs(n))
    })
}

function GE(e, t, n) {
    if (!(!t || typeof t != "object")) {
        if (t.modelVersion && e.setAttribute(Dt, t.modelVersion), t.usageMetadata && typeof t.usageMetadata == "object") {
            const r = t.usageMetadata;
            typeof r.promptTokenCount == "number" && e.setAttributes({
                [An]: r.promptTokenCount
            }), typeof r.candidatesTokenCount == "number" && e.setAttributes({
                [xn]: r.candidatesTokenCount
            }), typeof r.totalTokenCount == "number" && e.setAttributes({
                [Mn]: r.totalTokenCount
            })
        }
        if (n && Array.isArray(t.candidates) && t.candidates.length > 0) {
            const r = t.candidates.map(o => o.content ?.parts && Array.isArray(o.content.parts) ? o.content.parts.map(s => typeof s.text == "string" ? s.text : "").filter(s => s.length > 0).join("") : "").filter(o => o.length > 0);
            r.length > 0 && e.setAttributes({
                [et]: r.join("")
            })
        }
        if (n && t.functionCalls) {
            const r = t.functionCalls;
            Array.isArray(r) && r.length > 0 && e.setAttributes({
                [Et]: JSON.stringify(r)
            })
        }
    }
}

function dl(e, t, n, r) {
    const o = t === fp;
    return new Proxy(e, {
        apply(s, i, a) {
            const c = a[0],
                u = qE(t, c, n),
                d = u[We] ?? "unknown",
                l = Xr(t);
            return jE(t) ? jt({
                name: `${l} ${d} stream-response`,
                op: ms(t),
                attributes: u
            }, async f => {
                try {
                    r.recordInputs && c && ll(f, c);
                    const p = await s.apply(n, a);
                    return HE(p, f, !!r.recordOutputs)
                } catch (p) {
                    throw f.setStatus({
                        code: Z,
                        message: "internal_error"
                    }), _e(p, {
                        mechanism: {
                            handled: !1,
                            type: "auto.ai.google_genai",
                            data: {
                                function: t
                            }
                        }
                    }), f.end(), p
                }
            }) : ln({
                name: o ? `${l} ${d} create` : `${l} ${d}`,
                op: ms(t),
                attributes: u
            }, f => (r.recordInputs && c && ll(f, c), Hs(() => s.apply(n, a), p => {
                _e(p, {
                    mechanism: {
                        handled: !1,
                        type: "auto.ai.google_genai",
                        data: {
                            function: t
                        }
                    }
                })
            }, () => {}, p => {
                o || GE(f, p, r.recordOutputs)
            })))
        }
    })
}

function da(e, t = "", n) {
    return new Proxy(e, {
        get: (r, o, s) => {
            const i = Reflect.get(r, o, s),
                a = cp(t, String(o));
            if (typeof i == "function" && WE(a)) {
                if (a === fp) {
                    const c = dl(i, a, r, n);
                    return function(...d) {
                        const l = c(...d);
                        return l && typeof l == "object" ? da(l, DE, n) : l
                    }
                }
                return dl(i, a, r, n)
            }
            return typeof i == "function" ? i.bind(r) : i && typeof i == "object" ? da(i, a, n) : i
        }
    })
}

function oM(e, t) {
    const n = !!C() ?.getOptions().sendDefaultPii,
        r = {
            recordInputs: n,
            recordOutputs: n,
            ...t
        };
    return da(e, "", r)
}
const Ar = "auto.ai.langchain",
    VE = {
        human: "user",
        ai: "assistant",
        assistant: "assistant",
        system: "system",
        function: "function",
        tool: "tool"
    },
    It = (e, t, n) => {
        n != null && (e[t] = n)
    },
    qe = (e, t, n) => {
        const r = Number(n);
        Number.isNaN(r) || (e[t] = r)
    };

function He(e) {
    if (typeof e == "string") return e;
    try {
        return JSON.stringify(e)
    } catch {
        return String(e)
    }
}

function kr(e) {
    const t = e.toLowerCase();
    return VE[t] ?? t
}

function fl(e) {
    return e.includes("System") ? "system" : e.includes("Human") ? "user" : e.includes("AI") || e.includes("Assistant") ? "assistant" : e.includes("Function") ? "function" : e.includes("Tool") ? "tool" : "user"
}

function pl(e) {
    if (!(!e || Array.isArray(e))) return e.invocation_params
}

function gc(e) {
    return e.map(t => {
        const n = t._getType;
        if (typeof n == "function") {
            const o = n.call(t);
            return {
                role: kr(o),
                content: He(t.content)
            }
        }
        const r = t.constructor ?.name;
        if (r) return {
            role: kr(fl(r)),
            content: He(t.content)
        };
        if (t.type) {
            const o = String(t.type).toLowerCase();
            return {
                role: kr(o),
                content: He(t.content)
            }
        }
        if (t.role) return {
            role: kr(String(t.role)),
            content: He(t.content)
        };
        if (t.lc === 1 && t.kwargs) {
            const o = t.id,
                s = Array.isArray(o) && o.length > 0 ? o[o.length - 1] : "",
                i = typeof s == "string" ? fl(s) : "user";
            return {
                role: kr(i),
                content: He(t.kwargs ?.content)
            }
        }
        return {
            role: "user",
            content: He(t.content)
        }
    })
}

function JE(e, t, n) {
    const r = {},
        o = "kwargs" in e ? e.kwargs : void 0,
        s = t ?.temperature ?? n ?.ls_temperature ?? o ?.temperature;
    qe(r, Gs, s);
    const i = t ?.max_tokens ?? n ?.ls_max_tokens ?? o ?.max_tokens;
    qe(r, lc, i);
    const a = t ?.top_p ?? o ?.top_p;
    qe(r, Js, a);
    const c = t ?.frequency_penalty;
    qe(r, Vs, c);
    const u = t ?.presence_penalty;
    return qe(r, dc, u), t && "stream" in t && It(r, uc, !!t.stream), r
}

function pp(e, t, n, r, o, s) {
    return {
        [qs]: He(e ?? "langchain"),
        [en]: n,
        [We]: He(t),
        [G]: Ar,
        ...JE(r, o, s)
    }
}

function KE(e, t, n, r, o) {
    const s = o ?.ls_provider,
        i = r ?.model ?? o ?.ls_model_name ?? "unknown",
        a = pp(s, i, "pipeline", e, r, o);
    if (n && Array.isArray(t) && t.length > 0) {
        const c = t.map(u => ({
            role: "user",
            content: u
        }));
        It(a, tn, He(c))
    }
    return a
}

function YE(e, t, n, r, o) {
    const s = o ?.ls_provider ?? e.id ?.[2],
        i = r ?.model ?? o ?.ls_model_name ?? "unknown",
        a = pp(s, i, "chat", e, r, o);
    if (n && Array.isArray(t) && t.length > 0) {
        const c = gc(t.flat()),
            u = Xs(c);
        It(a, tn, He(u))
    }
    return a
}

function XE(e, t) {
    const n = [],
        r = e.flat();
    for (const o of r) {
        const s = o.message ?.content;
        if (Array.isArray(s))
            for (const i of s) {
                const a = i;
                a.type === "tool_use" && n.push(a)
            }
    }
    n.length > 0 && It(t, Et, He(n))
}

function QE(e, t) {
    if (!e) return;
    const n = e.tokenUsage,
        r = e.usage;
    if (n) qe(t, An, n.promptTokens), qe(t, xn, n.completionTokens), qe(t, Mn, n.totalTokens);
    else if (r) {
        qe(t, An, r.input_tokens), qe(t, xn, r.output_tokens);
        const o = Number(r.input_tokens),
            s = Number(r.output_tokens),
            i = (Number.isNaN(o) ? 0 : o) + (Number.isNaN(s) ? 0 : s);
        i > 0 && qe(t, Mn, i), r.cache_creation_input_tokens !== void 0 && qe(t, Pb, r.cache_creation_input_tokens), r.cache_read_input_tokens !== void 0 && qe(t, Lb, r.cache_read_input_tokens)
    }
}

function ZE(e, t) {
    if (!e) return;
    const n = {};
    if (Array.isArray(e.generations)) {
        const u = e.generations.flat().map(d => d.generationInfo ?.finish_reason ? d.generationInfo.finish_reason : d.generation_info ?.finish_reason ? d.generation_info.finish_reason : null).filter(d => typeof d == "string");
        if (u.length > 0 && It(n, dn, He(u)), XE(e.generations, n), t) {
            const d = e.generations.flat().map(l => l.text ?? l.message ?.content).filter(l => typeof l == "string");
            d.length > 0 && It(n, et, He(d))
        }
    }
    QE(e.llmOutput, n);
    const r = e.llmOutput,
        s = e.generations ?.[0] ?.[0] ?.message,
        i = r ?.model_name ?? r ?.model ?? s ?.response_metadata ?.model_name;
    i && It(n, Dt, i);
    const a = r ?.id ?? s ?.id;
    a && It(n, Sr, a);
    const c = r ?.stop_reason ?? s ?.response_metadata ?.finish_reason;
    return c && It(n, Nb, He(c)), n
}

function sM(e = {}) {
    const t = e.recordInputs ?? !1,
        n = e.recordOutputs ?? !1,
        r = new Map,
        o = i => {
            const a = r.get(i);
            a ?.isRecording() && (a.end(), r.delete(i))
        },
        s = {
            lc_serializable: !1,
            lc_namespace: ["langchain_core", "callbacks", "sentry"],
            lc_secrets: void 0,
            lc_attributes: void 0,
            lc_aliases: void 0,
            lc_serializable_keys: void 0,
            lc_id: ["langchain_core", "callbacks", "sentry"],
            lc_kwargs: {},
            name: "SentryCallbackHandler",
            ignoreLLM: !1,
            ignoreChain: !1,
            ignoreAgent: !1,
            ignoreRetriever: !1,
            ignoreCustomEvent: !1,
            raiseError: !1,
            awaitHandlers: !0,
            handleLLMStart(i, a, c, u, d, l, f, p) {
                const h = pl(l),
                    m = KE(i, a, t, h, f),
                    _ = m[We],
                    y = m[en];
                jt({
                    name: `${y} ${_}`,
                    op: "gen_ai.pipeline",
                    attributes: { ...m,
                        [pe]: "gen_ai.pipeline"
                    }
                }, b => (r.set(c, b), b))
            },
            handleChatModelStart(i, a, c, u, d, l, f, p) {
                const h = pl(l),
                    m = YE(i, a, t, h, f),
                    _ = m[We],
                    y = m[en];
                jt({
                    name: `${y} ${_}`,
                    op: "gen_ai.chat",
                    attributes: { ...m,
                        [pe]: "gen_ai.chat"
                    }
                }, b => (r.set(c, b), b))
            },
            handleLLMEnd(i, a, c, u, d) {
                const l = r.get(a);
                if (l ?.isRecording()) {
                    const f = ZE(i, n);
                    f && l.setAttributes(f), o(a)
                }
            },
            handleLLMError(i, a) {
                const c = r.get(a);
                c ?.isRecording() && (c.setStatus({
                    code: Z,
                    message: "llm_error"
                }), o(a)), _e(i, {
                    mechanism: {
                        handled: !1,
                        type: `${Ar}.llm_error_handler`
                    }
                })
            },
            handleChainStart(i, a, c, u) {
                const d = i.name || "unknown_chain",
                    l = {
                        [G]: "auto.ai.langchain",
                        "langchain.chain.name": d
                    };
                t && (l["langchain.chain.inputs"] = JSON.stringify(a)), jt({
                    name: `chain ${d}`,
                    op: "gen_ai.invoke_agent",
                    attributes: { ...l,
                        [pe]: "gen_ai.invoke_agent"
                    }
                }, f => (r.set(c, f), f))
            },
            handleChainEnd(i, a) {
                const c = r.get(a);
                c ?.isRecording() && (n && c.setAttributes({
                    "langchain.chain.outputs": JSON.stringify(i)
                }), o(a))
            },
            handleChainError(i, a) {
                const c = r.get(a);
                c ?.isRecording() && (c.setStatus({
                    code: Z,
                    message: "chain_error"
                }), o(a)), _e(i, {
                    mechanism: {
                        handled: !1,
                        type: `${Ar}.chain_error_handler`
                    }
                })
            },
            handleToolStart(i, a, c, u) {
                const d = i.name || "unknown_tool",
                    l = {
                        [G]: Ar,
                        "gen_ai.tool.name": d
                    };
                t && (l["gen_ai.tool.input"] = a), jt({
                    name: `execute_tool ${d}`,
                    op: "gen_ai.execute_tool",
                    attributes: { ...l,
                        [pe]: "gen_ai.execute_tool"
                    }
                }, f => (r.set(c, f), f))
            },
            handleToolEnd(i, a) {
                const c = r.get(a);
                c ?.isRecording() && (n && c.setAttributes({
                    "gen_ai.tool.output": JSON.stringify(i)
                }), o(a))
            },
            handleToolError(i, a) {
                const c = r.get(a);
                c ?.isRecording() && (c.setStatus({
                    code: Z,
                    message: "tool_error"
                }), o(a)), _e(i, {
                    mechanism: {
                        handled: !1,
                        type: `${Ar}.tool_error_handler`
                    }
                })
            },
            copy() {
                return s
            },
            toJSON() {
                return {
                    lc: 1,
                    type: "not_implemented",
                    id: s.lc_id
                }
            },
            toJSONNotImplemented() {
                return {
                    lc: 1,
                    type: "not_implemented",
                    id: s.lc_id
                }
            }
        };
    return s
}
const hp = "auto.ai.langgraph";

function ev(e) {
    if (!e || e.length === 0) return null;
    const t = [];
    for (const n of e)
        if (n && typeof n == "object") {
            const r = n.tool_calls;
            r && Array.isArray(r) && t.push(...r)
        }
    return t.length > 0 ? t : null
}

function tv(e) {
    const t = e;
    let n = 0,
        r = 0,
        o = 0;
    if (t.usage_metadata && typeof t.usage_metadata == "object") {
        const s = t.usage_metadata;
        return typeof s.input_tokens == "number" && (n = s.input_tokens), typeof s.output_tokens == "number" && (r = s.output_tokens), typeof s.total_tokens == "number" && (o = s.total_tokens), {
            inputTokens: n,
            outputTokens: r,
            totalTokens: o
        }
    }
    if (t.response_metadata && typeof t.response_metadata == "object") {
        const s = t.response_metadata;
        if (s.tokenUsage && typeof s.tokenUsage == "object") {
            const i = s.tokenUsage;
            typeof i.promptTokens == "number" && (n = i.promptTokens), typeof i.completionTokens == "number" && (r = i.completionTokens), typeof i.totalTokens == "number" && (o = i.totalTokens)
        }
    }
    return {
        inputTokens: n,
        outputTokens: r,
        totalTokens: o
    }
}

function nv(e, t) {
    const n = t;
    if (n.response_metadata && typeof n.response_metadata == "object") {
        const r = n.response_metadata;
        r.model_name && typeof r.model_name == "string" && e.setAttribute(Dt, r.model_name), r.finish_reason && typeof r.finish_reason == "string" && e.setAttribute(dn, [r.finish_reason])
    }
}

function rv(e) {
    if (!e.builder ?.nodes ?.tools ?.runnable ?.tools) return null;
    const t = e.builder ?.nodes ?.tools ?.runnable ?.tools;
    return !t || !Array.isArray(t) || t.length === 0 ? null : t.map(n => ({
        name: n.lc_kwargs ?.name,
        description: n.lc_kwargs ?.description,
        schema: n.lc_kwargs ?.schema
    }))
}

function ov(e, t, n) {
    const o = n ?.messages;
    if (!o || !Array.isArray(o)) return;
    const s = t ?.length ?? 0,
        i = o.length > s ? o.slice(s) : [];
    if (i.length === 0) return;
    const a = ev(i);
    a && e.setAttribute(Et, JSON.stringify(a));
    const c = gc(i);
    e.setAttribute(et, JSON.stringify(c));
    let u = 0,
        d = 0,
        l = 0;
    for (const f of i) {
        const p = tv(f);
        u += p.inputTokens, d += p.outputTokens, l += p.totalTokens, nv(e, f)
    }
    u > 0 && e.setAttribute(An, u), d > 0 && e.setAttribute(xn, d), l > 0 && e.setAttribute(Mn, l)
}

function sv(e, t) {
    return new Proxy(e, {
        apply(n, r, o) {
            return ln({
                op: "gen_ai.create_agent",
                name: "create_agent",
                attributes: {
                    [G]: hp,
                    [pe]: "gen_ai.create_agent",
                    [en]: "create_agent"
                }
            }, s => {
                try {
                    const i = Reflect.apply(n, r, o),
                        a = o.length > 0 ? o[0] : {};
                    a ?.name && typeof a.name == "string" && (s.setAttribute(rp, a.name), s.updateName(`create_agent ${a.name}`));
                    const c = i.invoke;
                    return c && typeof c == "function" && (i.invoke = iv(c.bind(i), i, a, t)), i
                } catch (i) {
                    throw s.setStatus({
                        code: Z,
                        message: "internal_error"
                    }), _e(i, {
                        mechanism: {
                            handled: !1,
                            type: "auto.ai.langgraph.error"
                        }
                    }), i
                }
            })
        }
    })
}

function iv(e, t, n, r) {
    return new Proxy(e, {
        apply(o, s, i) {
            return ln({
                op: "gen_ai.invoke_agent",
                name: "invoke_agent",
                attributes: {
                    [G]: hp,
                    [pe]: Db,
                    [en]: "invoke_agent"
                }
            }, async a => {
                try {
                    const c = n ?.name;
                    c && typeof c == "string" && (a.setAttribute(Ob, c), a.setAttribute(rp, c), a.updateName(`invoke_agent ${c}`));
                    const u = rv(t);
                    u && a.setAttribute(Ks, JSON.stringify(u));
                    const d = r.recordInputs,
                        l = r.recordOutputs,
                        f = i.length > 0 ? i[0].messages ?? [] : [];
                    if (f && d) {
                        const h = gc(f),
                            m = Xs(h);
                        a.setAttribute(tn, JSON.stringify(m))
                    }
                    const p = await Reflect.apply(o, s, i);
                    return l && ov(a, f ?? null, p), p
                } catch (c) {
                    throw a.setStatus({
                        code: Z,
                        message: "internal_error"
                    }), _e(c, {
                        mechanism: {
                            handled: !1,
                            type: "auto.ai.langgraph.error"
                        }
                    }), c
                }
            })
        }
    })
}

function iM(e, t) {
    const n = t || {};
    return e.compile = sv(e.compile.bind(e), n), e
}

function mp(e) {
    if (e !== void 0) return e >= 400 && e < 500 ? "warning" : e >= 500 ? "error" : void 0
}
const or = $;

function av() {
    return "history" in or && !!or.history
}

function cv() {
    if (!("fetch" in or)) return !1;
    try {
        return new Headers, new Request("data:,"), new Response, !0
    } catch {
        return !1
    }
}

function fa(e) {
    return e && /^function\s+\w+\(\)\s+\{\s+\[native code\]\s+\}$/.test(e.toString())
}

function gp() {
    if (typeof EdgeRuntime == "string") return !0;
    if (!cv()) return !1;
    if (fa(or.fetch)) return !0;
    let e = !1;
    const t = or.document;
    if (t && typeof t.createElement == "function") try {
        const n = t.createElement("iframe");
        n.hidden = !0, t.head.appendChild(n), n.contentWindow ?.fetch && (e = fa(n.contentWindow.fetch)), t.head.removeChild(n)
    } catch (n) {
        R && g.warn("Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ", n)
    }
    return e
}

function uv() {
    return "ReportingObserver" in or
}

function _c(e, t) {
    const n = "fetch";
    sn(n, e), an(n, () => _p(void 0, t))
}

function lv(e) {
    const t = "fetch-body-resolved";
    sn(t, e), an(t, () => _p(fv))
}

function _p(e, t = !1) {
    t && !gp() || xe($, "fetch", function(n) {
        return function(...r) {
            const o = new Error,
                {
                    method: s,
                    url: i
                } = pv(r),
                a = {
                    args: r,
                    fetchData: {
                        method: s,
                        url: i
                    },
                    startTimestamp: he() * 1e3,
                    virtualError: o,
                    headers: hv(r)
                };
            return e || Qe("fetch", { ...a
            }), n.apply($, r).then(async c => (e ? e(c) : Qe("fetch", { ...a,
                endTimestamp: he() * 1e3,
                response: c
            }), c), c => {
                if (Qe("fetch", { ...a,
                        endTimestamp: he() * 1e3,
                        error: c
                    }), kt(c) && c.stack === void 0 && (c.stack = o.stack, we(c, "framesToPop", 1)), c instanceof TypeError && (c.message === "Failed to fetch" || c.message === "Load failed" || c.message === "NetworkError when attempting to fetch resource.")) try {
                    const u = new URL(a.fetchData.url);
                    c.message = `${c.message} (${u.host})`
                } catch {}
                throw c
            })
        }
    })
}
async function dv(e, t) {
    if (e ?.body) {
        const n = e.body,
            r = n.getReader(),
            o = setTimeout(() => {
                n.cancel().then(null, () => {})
            }, 90 * 1e3);
        let s = !0;
        for (; s;) {
            let i;
            try {
                i = setTimeout(() => {
                    n.cancel().then(null, () => {})
                }, 5e3);
                const {
                    done: a
                } = await r.read();
                clearTimeout(i), a && (t(), s = !1)
            } catch {
                s = !1
            } finally {
                clearTimeout(i)
            }
        }
        clearTimeout(o), r.releaseLock(), n.cancel().then(null, () => {})
    }
}

function fv(e) {
    let t;
    try {
        t = e.clone()
    } catch {
        return
    }
    dv(t, () => {
        Qe("fetch-body-resolved", {
            endTimestamp: he() * 1e3,
            response: e
        })
    })
}

function Ho(e, t) {
    return !!e && typeof e == "object" && !!e[t]
}

function hl(e) {
    return typeof e == "string" ? e : e ? Ho(e, "url") ? e.url : e.toString ? e.toString() : "" : ""
}

function pv(e) {
    if (e.length === 0) return {
        method: "GET",
        url: ""
    };
    if (e.length === 2) {
        const [n, r] = e;
        return {
            url: hl(n),
            method: Ho(r, "method") ? String(r.method).toUpperCase() : Ua(n) && Ho(n, "method") ? String(n.method).toUpperCase() : "GET"
        }
    }
    const t = e[0];
    return {
        url: hl(t),
        method: Ho(t, "method") ? String(t.method).toUpperCase() : "GET"
    }
}

function hv(e) {
    const [t, n] = e;
    try {
        if (typeof n == "object" && n !== null && "headers" in n && n.headers) return new Headers(n.headers);
        if (Ua(t)) return new Headers(t.headers)
    } catch {}
}

function mv() {
    return typeof __SENTRY_BROWSER_BUNDLE__ < "u" && !!__SENTRY_BROWSER_BUNDLE__
}

function gv() {
    return "npm"
}

function _v() {
    return !mv() && Object.prototype.toString.call(typeof process < "u" ? process : 0) === "[object process]"
}

function _s() {
    return typeof window < "u" && (!_v() || yv())
}

function yv() {
    return $.process ?.type === "renderer"
}
const ot = $,
    ce = ot.document,
    xr = ot.navigator,
    yp = "Report a Bug",
    Sv = "Cancel",
    bv = "Send Bug Report",
    Ev = "Confirm",
    vv = "Report a Bug",
    Tv = "your.email@example.org",
    Iv = "Email",
    wv = "What's the bug? What did you expect?",
    kv = "Description",
    Rv = "Your Name",
    Cv = "Name",
    Av = "Thank you for your report!",
    xv = "(required)",
    Mv = "Add a screenshot",
    Nv = "Remove screenshot",
    Ov = "Highlight",
    Pv = "Hide",
    Lv = "Remove",
    Dv = "widget",
    Fv = "api",
    $v = 5e3,
    Bv = (e, t = {
        includeReplay: !0
    }) => {
        if (!e.message) throw new Error("Unable to submit feedback with empty message");
        const n = C();
        if (!n) throw new Error("No client setup, cannot send feedback.");
        e.tags && Object.keys(e.tags).length && j().setTags(e.tags);
        const r = lb({
            source: Fv,
            url: Ln(),
            ...e
        }, t);
        return new Promise((o, s) => {
            const i = setTimeout(() => s("Unable to determine if Feedback was correctly sent."), 3e4),
                a = n.on("afterSendEvent", (c, u) => {
                    if (c.event_id === r) return clearTimeout(i), a(), u ?.statusCode && u.statusCode >= 200 && u.statusCode < 300 ? o(r) : u ?.statusCode === 403 ? s("Unable to send feedback. This could be because this domain is not in your list of allowed domains.") : s("Unable to send feedback. This could be because of network issues, or because you are using an ad-blocker.")
                })
        })
    },
    Wo = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__;

function Uv() {
    return !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(xr.userAgent) || /Macintosh/i.test(xr.userAgent) && xr.maxTouchPoints && xr.maxTouchPoints > 1 || !isSecureContext)
}

function So(e, t) {
    return { ...e,
        ...t,
        tags: { ...e.tags,
            ...t.tags
        },
        onFormOpen: () => {
            t.onFormOpen ?.(), e.onFormOpen ?.()
        },
        onFormClose: () => {
            t.onFormClose ?.(), e.onFormClose ?.()
        },
        onSubmitSuccess: (n, r) => {
            t.onSubmitSuccess ?.(n, r), e.onSubmitSuccess ?.(n, r)
        },
        onSubmitError: n => {
            t.onSubmitError ?.(n), e.onSubmitError ?.(n)
        },
        onFormSubmitted: () => {
            t.onFormSubmitted ?.(), e.onFormSubmitted ?.()
        },
        themeDark: { ...e.themeDark,
            ...t.themeDark
        },
        themeLight: { ...e.themeLight,
            ...t.themeLight
        }
    }
}

function Hv(e) {
    const t = ce.createElement("style");
    return t.textContent = `
.widget__actor {
  position: fixed;
  z-index: var(--z-index);
  margin: var(--page-margin);
  inset: var(--actor-inset);

  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;

  font-family: inherit;
  font-size: var(--font-size);
  font-weight: 600;
  line-height: 1.14em;
  text-decoration: none;

  background: var(--actor-background, var(--background));
  border-radius: var(--actor-border-radius, 1.7em/50%);
  border: var(--actor-border, var(--border));
  box-shadow: var(--actor-box-shadow, var(--box-shadow));
  color: var(--actor-color, var(--foreground));
  fill: var(--actor-color, var(--foreground));
  cursor: pointer;
  opacity: 1;
  transition: transform 0.2s ease-in-out;
  transform: translate(0, 0) scale(1);
}
.widget__actor[aria-hidden="true"] {
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  transform: translate(0, 16px) scale(0.98);
}

.widget__actor:hover {
  background: var(--actor-hover-background, var(--background));
  filter: var(--interactive-filter);
}

.widget__actor svg {
  width: 1.14em;
  height: 1.14em;
}

@media (max-width: 600px) {
  .widget__actor span {
    display: none;
  }
}
`, e && t.setAttribute("nonce", e), t
}

function Je(e, t) {
    return Object.entries(t).forEach(([n, r]) => {
        e.setAttributeNS(null, n, r)
    }), e
}
const $n = 20,
    Wv = "http://www.w3.org/2000/svg";

function jv() {
    const e = a => ot.document.createElementNS(Wv, a),
        t = Je(e("svg"), {
            width: `${$n}`,
            height: `${$n}`,
            viewBox: `0 0 ${$n} ${$n}`,
            fill: "var(--actor-color, var(--foreground))"
        }),
        n = Je(e("g"), {
            clipPath: "url(#clip0_57_80)"
        }),
        r = Je(e("path"), {
            "fill-rule": "evenodd",
            "clip-rule": "evenodd",
            d: "M15.6622 15H12.3997C12.2129 14.9959 12.031 14.9396 11.8747 14.8375L8.04965 12.2H7.49956V19.1C7.4875 19.3348 7.3888 19.5568 7.22256 19.723C7.05632 19.8892 6.83435 19.9879 6.59956 20H2.04956C1.80193 19.9968 1.56535 19.8969 1.39023 19.7218C1.21511 19.5467 1.1153 19.3101 1.11206 19.0625V12.2H0.949652C0.824431 12.2017 0.700142 12.1783 0.584123 12.1311C0.468104 12.084 0.362708 12.014 0.274155 11.9255C0.185602 11.8369 0.115689 11.7315 0.0685419 11.6155C0.0213952 11.4995 -0.00202913 11.3752 -0.00034808 11.25V3.75C-0.00900498 3.62067 0.0092504 3.49095 0.0532651 3.36904C0.0972798 3.24712 0.166097 3.13566 0.255372 3.04168C0.344646 2.94771 0.452437 2.87327 0.571937 2.82307C0.691437 2.77286 0.82005 2.74798 0.949652 2.75H8.04965L11.8747 0.1625C12.031 0.0603649 12.2129 0.00407221 12.3997 0H15.6622C15.9098 0.00323746 16.1464 0.103049 16.3215 0.278167C16.4966 0.453286 16.5964 0.689866 16.5997 0.9375V3.25269C17.3969 3.42959 18.1345 3.83026 18.7211 4.41679C19.5322 5.22788 19.9878 6.32796 19.9878 7.47502C19.9878 8.62209 19.5322 9.72217 18.7211 10.5333C18.1345 11.1198 17.3969 11.5205 16.5997 11.6974V14.0125C16.6047 14.1393 16.5842 14.2659 16.5395 14.3847C16.4948 14.5035 16.4268 14.6121 16.3394 14.7042C16.252 14.7962 16.147 14.8698 16.0307 14.9206C15.9144 14.9714 15.7891 14.9984 15.6622 15ZM1.89695 10.325H1.88715V4.625H8.33715C8.52423 4.62301 8.70666 4.56654 8.86215 4.4625L12.6872 1.875H14.7247V13.125H12.6872L8.86215 10.4875C8.70666 10.3835 8.52423 10.327 8.33715 10.325H2.20217C2.15205 10.3167 2.10102 10.3125 2.04956 10.3125C1.9981 10.3125 1.94708 10.3167 1.89695 10.325ZM2.98706 12.2V18.1625H5.66206V12.2H2.98706ZM16.5997 9.93612V5.01393C16.6536 5.02355 16.7072 5.03495 16.7605 5.04814C17.1202 5.13709 17.4556 5.30487 17.7425 5.53934C18.0293 5.77381 18.2605 6.06912 18.4192 6.40389C18.578 6.73866 18.6603 7.10452 18.6603 7.47502C18.6603 7.84552 18.578 8.21139 18.4192 8.54616C18.2605 8.88093 18.0293 9.17624 17.7425 9.41071C17.4556 9.64518 17.1202 9.81296 16.7605 9.90191C16.7072 9.91509 16.6536 9.9265 16.5997 9.93612Z"
        });
    t.appendChild(n).appendChild(r);
    const o = e("defs"),
        s = Je(e("clipPath"), {
            id: "clip0_57_80"
        }),
        i = Je(e("rect"), {
            width: `${$n}`,
            height: `${$n}`,
            fill: "white"
        });
    return s.appendChild(i), o.appendChild(s), t.appendChild(o).appendChild(s).appendChild(i), t
}

function zv({
    triggerLabel: e,
    triggerAriaLabel: t,
    shadow: n,
    styleNonce: r
}) {
    const o = ce.createElement("button");
    if (o.type = "button", o.className = "widget__actor", o.ariaHidden = "false", o.ariaLabel = t || e || yp, o.appendChild(jv()), e) {
        const i = ce.createElement("span");
        i.appendChild(ce.createTextNode(e)), o.appendChild(i)
    }
    const s = Hv(r);
    return {
        el: o,
        appendToDom() {
            n.appendChild(s), n.appendChild(o)
        },
        removeFromDom() {
            o.remove(), s.remove()
        },
        show() {
            o.ariaHidden = "false"
        },
        hide() {
            o.ariaHidden = "true"
        }
    }
}
const Sp = "rgba(88, 74, 192, 1)",
    qv = {
        foreground: "#2b2233",
        background: "#ffffff",
        accentForeground: "white",
        accentBackground: Sp,
        successColor: "#268d75",
        errorColor: "#df3338",
        border: "1.5px solid rgba(41, 35, 47, 0.13)",
        boxShadow: "0px 4px 24px 0px rgba(43, 34, 51, 0.12)",
        outline: "1px auto var(--accent-background)",
        interactiveFilter: "brightness(95%)"
    },
    ml = {
        foreground: "#ebe6ef",
        background: "#29232f",
        accentForeground: "white",
        accentBackground: Sp,
        successColor: "#2da98c",
        errorColor: "#f55459",
        border: "1.5px solid rgba(235, 230, 239, 0.15)",
        boxShadow: "0px 4px 24px 0px rgba(43, 34, 51, 0.12)",
        outline: "1px auto var(--accent-background)",
        interactiveFilter: "brightness(150%)"
    };

function gl(e) {
    return `
  --foreground: ${e.foreground};
  --background: ${e.background};
  --accent-foreground: ${e.accentForeground};
  --accent-background: ${e.accentBackground};
  --success-color: ${e.successColor};
  --error-color: ${e.errorColor};
  --border: ${e.border};
  --box-shadow: ${e.boxShadow};
  --outline: ${e.outline};
  --interactive-filter: ${e.interactiveFilter};
  `
}

function Gv({
    colorScheme: e,
    themeDark: t,
    themeLight: n,
    styleNonce: r
}) {
    const o = ce.createElement("style");
    return o.textContent = `
:host {
  --font-family: system-ui, 'Helvetica Neue', Arial, sans-serif;
  --font-size: 14px;
  --z-index: 100000;

  --page-margin: 16px;
  --inset: auto 0 0 auto;
  --actor-inset: var(--inset);

  font-family: var(--font-family);
  font-size: var(--font-size);

  ${e!=="system"?"color-scheme: only light;":""}

  ${gl(e==="dark"?{...ml,...t}:{...qv,...n})}
}

${e==="system"?`
@media (prefers-color-scheme: dark) {
  :host {
    ${gl({...ml,...t})}
  }
}`:""}
}
`, r && o.setAttribute("nonce", r), o
}
const bp = ({
    lazyLoadIntegration: e,
    getModalIntegration: t,
    getScreenshotIntegration: n
}) => (({
    id: o = "sentry-feedback",
    autoInject: s = !0,
    showBranding: i = !0,
    isEmailRequired: a = !1,
    isNameRequired: c = !1,
    showEmail: u = !0,
    showName: d = !0,
    enableScreenshot: l = !0,
    useSentryUser: f = {
        email: "email",
        name: "username"
    },
    tags: p,
    styleNonce: h,
    scriptNonce: m,
    colorScheme: _ = "system",
    themeLight: y = {},
    themeDark: b = {},
    addScreenshotButtonLabel: N = Mv,
    cancelButtonLabel: T = Sv,
    confirmButtonLabel: L = Ev,
    emailLabel: A = Iv,
    emailPlaceholder: S = Tv,
    formTitle: x = vv,
    isRequiredLabel: B = xv,
    messageLabel: E = kv,
    messagePlaceholder: O = wv,
    nameLabel: k = Cv,
    namePlaceholder: P = Rv,
    removeScreenshotButtonLabel: D = Nv,
    submitButtonLabel: ee = bv,
    successMessageText: Y = Av,
    triggerLabel: ne = yp,
    triggerAriaLabel: v = "",
    highlightToolText: z = Ov,
    hideToolText: w = Pv,
    removeHighlightText: V = Lv,
    onFormOpen: se,
    onFormClose: re,
    onSubmitSuccess: ve,
    onSubmitError: Pe,
    onFormSubmitted: Ft
} = {}) => {
    const Le = {
        id: o,
        autoInject: s,
        showBranding: i,
        isEmailRequired: a,
        isNameRequired: c,
        showEmail: u,
        showName: d,
        enableScreenshot: l,
        useSentryUser: f,
        tags: p,
        styleNonce: h,
        scriptNonce: m,
        colorScheme: _,
        themeDark: b,
        themeLight: y,
        triggerLabel: ne,
        triggerAriaLabel: v,
        cancelButtonLabel: T,
        submitButtonLabel: ee,
        confirmButtonLabel: L,
        formTitle: x,
        emailLabel: A,
        emailPlaceholder: S,
        messageLabel: E,
        messagePlaceholder: O,
        nameLabel: k,
        namePlaceholder: P,
        successMessageText: Y,
        isRequiredLabel: B,
        addScreenshotButtonLabel: N,
        removeScreenshotButtonLabel: D,
        highlightToolText: z,
        hideToolText: w,
        removeHighlightText: V,
        onFormClose: re,
        onFormOpen: se,
        onSubmitError: Pe,
        onSubmitSuccess: ve,
        onFormSubmitted: Ft
    };
    let Be = null,
        dt = [];
    const $t = ie => {
            if (!Be) {
                const me = ce.createElement("div");
                me.id = String(ie.id), ce.body.appendChild(me), Be = me.attachShadow({
                    mode: "open"
                }), Be.appendChild(Gv(ie))
            }
            return Be
        },
        vr = async ie => {
            const me = ie.enableScreenshot && Uv();
            let Ye, Ce;
            try {
                Ye = (t ? t() : await e("feedbackModalIntegration", m))(), Ou(Ye)
            } catch {
                throw Wo && g.error("[Feedback] Error when trying to load feedback integrations. Try using `feedbackSyncIntegration` in your `Sentry.init`."), new Error("[Feedback] Missing feedback modal integration!")
            }
            try {
                const ft = me ? n ? n() : await e("feedbackScreenshotIntegration", m) : void 0;
                ft && (Ce = ft(), Ou(Ce))
            } catch {
                Wo && g.error("[Feedback] Missing feedback screenshot integration. Proceeding without screenshots.")
            }
            const Me = Ye.createDialog({
                options: { ...ie,
                    onFormClose: () => {
                        Me ?.close(), ie.onFormClose ?.()
                    },
                    onFormSubmitted: () => {
                        Me ?.close(), ie.onFormSubmitted ?.()
                    }
                },
                screenshotIntegration: Ce,
                sendFeedback: Bv,
                shadow: $t(ie)
            });
            return Me
        },
        mo = (ie, me = {}) => {
            const Ye = So(Le, me),
                Ce = typeof ie == "string" ? ce.querySelector(ie) : typeof ie.addEventListener == "function" ? ie : null;
            if (!Ce) throw Wo && g.error("[Feedback] Unable to attach to target element"), new Error("Unable to attach to target element");
            let Me = null;
            const ft = async () => {
                Me || (Me = await vr({ ...Ye,
                    onFormSubmitted: () => {
                        Me ?.removeFromDom(), Ye.onFormSubmitted ?.()
                    }
                })), Me.appendToDom(), Me.open()
            };
            Ce.addEventListener("click", ft);
            const X = () => {
                dt = dt.filter(ze => ze !== X), Me ?.removeFromDom(), Me = null, Ce.removeEventListener("click", ft)
            };
            return dt.push(X), X
        },
        Tr = (ie = {}) => {
            const me = So(Le, ie),
                Ye = $t(me),
                Ce = zv({
                    triggerLabel: me.triggerLabel,
                    triggerAriaLabel: me.triggerAriaLabel,
                    shadow: Ye,
                    styleNonce: h
                });
            return mo(Ce.el, { ...me,
                onFormOpen() {
                    Ce.hide()
                },
                onFormClose() {
                    Ce.show()
                },
                onFormSubmitted() {
                    Ce.show()
                }
            }), Ce
        };
    return {
        name: "Feedback",
        setupOnce() {
            !_s() || !Le.autoInject || (ce.readyState === "loading" ? ce.addEventListener("DOMContentLoaded", () => Tr().appendToDom()) : Tr().appendToDom())
        },
        attachTo: mo,
        createWidget(ie = {}) {
            const me = Tr(So(Le, ie));
            return me.appendToDom(), me
        },
        async createForm(ie = {}) {
            return vr(So(Le, ie))
        },
        remove() {
            Be && (Be.parentElement ?.remove(), Be = null), dt.forEach(ie => ie()), dt = []
        }
    }
});

function aM() {
    return C() ?.getIntegrationByName("Feedback")
}
var Zs, le, Ep, mn, _l, vp, pa, Br = {},
    yc = [],
    Vv = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,
    Sc = Array.isArray;

function zt(e, t) {
    for (var n in t) e[n] = t[n];
    return e
}

function Tp(e) {
    var t = e.parentNode;
    t && t.removeChild(e)
}

function K(e, t, n) {
    var r, o, s, i = {};
    for (s in t) s == "key" ? r = t[s] : s == "ref" ? o = t[s] : i[s] = t[s];
    if (arguments.length > 2 && (i.children = arguments.length > 3 ? Zs.call(arguments, 2) : n), typeof e == "function" && e.defaultProps != null)
        for (s in e.defaultProps) i[s] === void 0 && (i[s] = e.defaultProps[s]);
    return jo(e, i, r, o, null)
}

function jo(e, t, n, r, o) {
    var s = {
        type: e,
        props: t,
        key: n,
        ref: r,
        __k: null,
        __: null,
        __b: 0,
        __e: null,
        __d: void 0,
        __c: null,
        constructor: void 0,
        __v: o ?? ++Ep,
        __i: -1,
        __u: 0
    };
    return o == null && le.vnode != null && le.vnode(s), s
}

function Qr(e) {
    return e.children
}

function zo(e, t) {
    this.props = e, this.context = t
}

function sr(e, t) {
    if (t == null) return e.__ ? sr(e.__, e.__i + 1) : null;
    for (var n; t < e.__k.length; t++)
        if ((n = e.__k[t]) != null && n.__e != null) return n.__e;
    return typeof e.type == "function" ? sr(e) : null
}

function Jv(e, t, n) {
    var r, o = e.__v,
        s = o.__e,
        i = e.__P;
    if (i) return (r = zt({}, o)).__v = o.__v + 1, le.vnode && le.vnode(r), bc(i, r, o, e.__n, i.ownerSVGElement !== void 0, 32 & o.__u ? [s] : null, t, s ?? sr(o), !!(32 & o.__u), n), r.__.__k[r.__i] = r, r.__d = void 0, r.__e != s && Ip(r), r
}

function Ip(e) {
    var t, n;
    if ((e = e.__) != null && e.__c != null) {
        for (e.__e = e.__c.base = null, t = 0; t < e.__k.length; t++)
            if ((n = e.__k[t]) != null && n.__e != null) {
                e.__e = e.__c.base = n.__e;
                break
            }
        return Ip(e)
    }
}

function yl(e) {
    (!e.__d && (e.__d = !0) && mn.push(e) && !ys.__r++ || _l !== le.debounceRendering) && ((_l = le.debounceRendering) || vp)(ys)
}

function ys() {
    var e, t, n, r = [],
        o = [];
    for (mn.sort(pa); e = mn.shift();) e.__d && (n = mn.length, t = Jv(e, r, o) || t, n === 0 || mn.length > n ? (ha(r, t, o), o.length = r.length = 0, t = void 0, mn.sort(pa)) : t && le.__c && le.__c(t, yc));
    t && ha(r, t, o), ys.__r = 0
}

function wp(e, t, n, r, o, s, i, a, c, u, d) {
    var l, f, p, h, m, _ = r && r.__k || yc,
        y = t.length;
    for (n.__d = c, Kv(n, t, _), c = n.__d, l = 0; l < y; l++)(p = n.__k[l]) != null && typeof p != "boolean" && typeof p != "function" && (f = p.__i === -1 ? Br : _[p.__i] || Br, p.__i = l, bc(e, p, f, o, s, i, a, c, u, d), h = p.__e, p.ref && f.ref != p.ref && (f.ref && Ec(f.ref, null, p), d.push(p.ref, p.__c || h, p)), m == null && h != null && (m = h), 65536 & p.__u || f.__k === p.__k ? c = kp(p, c, e) : typeof p.type == "function" && p.__d !== void 0 ? c = p.__d : h && (c = h.nextSibling), p.__d = void 0, p.__u &= -196609);
    n.__d = c, n.__e = m
}

function Kv(e, t, n) {
    var r, o, s, i, a, c = t.length,
        u = n.length,
        d = u,
        l = 0;
    for (e.__k = [], r = 0; r < c; r++)(o = e.__k[r] = (o = t[r]) == null || typeof o == "boolean" || typeof o == "function" ? null : typeof o == "string" || typeof o == "number" || typeof o == "bigint" || o.constructor == String ? jo(null, o, null, null, o) : Sc(o) ? jo(Qr, {
        children: o
    }, null, null, null) : o.constructor === void 0 && o.__b > 0 ? jo(o.type, o.props, o.key, o.ref ? o.ref : null, o.__v) : o) != null ? (o.__ = e, o.__b = e.__b + 1, a = Yv(o, n, i = r + l, d), o.__i = a, s = null, a !== -1 && (d--, (s = n[a]) && (s.__u |= 131072)), s == null || s.__v === null ? (a == -1 && l--, typeof o.type != "function" && (o.__u |= 65536)) : a !== i && (a === i + 1 ? l++ : a > i ? d > c - i ? l += a - i : l-- : l = a < i && a == i - 1 ? a - i : 0, a !== r + l && (o.__u |= 65536))) : (s = n[r]) && s.key == null && s.__e && (s.__e == e.__d && (e.__d = sr(s)), ma(s, s, !1), n[r] = null, d--);
    if (d)
        for (r = 0; r < u; r++)(s = n[r]) != null && (131072 & s.__u) == 0 && (s.__e == e.__d && (e.__d = sr(s)), ma(s, s))
}

function kp(e, t, n) {
    var r, o;
    if (typeof e.type == "function") {
        for (r = e.__k, o = 0; r && o < r.length; o++) r[o] && (r[o].__ = e, t = kp(r[o], t, n));
        return t
    }
    e.__e != t && (n.insertBefore(e.__e, t || null), t = e.__e);
    do t = t && t.nextSibling; while (t != null && t.nodeType === 8);
    return t
}

function Yv(e, t, n, r) {
    var o = e.key,
        s = e.type,
        i = n - 1,
        a = n + 1,
        c = t[n];
    if (c === null || c && o == c.key && s === c.type) return n;
    if (r > (c != null && (131072 & c.__u) == 0 ? 1 : 0))
        for (; i >= 0 || a < t.length;) {
            if (i >= 0) {
                if ((c = t[i]) && (131072 & c.__u) == 0 && o == c.key && s === c.type) return i;
                i--
            }
            if (a < t.length) {
                if ((c = t[a]) && (131072 & c.__u) == 0 && o == c.key && s === c.type) return a;
                a++
            }
        }
    return -1
}

function Sl(e, t, n) {
    t[0] === "-" ? e.setProperty(t, n ?? "") : e[t] = n == null ? "" : typeof n != "number" || Vv.test(t) ? n : n + "px"
}

function bo(e, t, n, r, o) {
    var s;
    e: if (t === "style")
        if (typeof n == "string") e.style.cssText = n;
        else {
            if (typeof r == "string" && (e.style.cssText = r = ""), r)
                for (t in r) n && t in n || Sl(e.style, t, "");
            if (n)
                for (t in n) r && n[t] === r[t] || Sl(e.style, t, n[t])
        }
    else if (t[0] === "o" && t[1] === "n") s = t !== (t = t.replace(/(PointerCapture)$|Capture$/i, "$1")), t = t.toLowerCase() in e ? t.toLowerCase().slice(2) : t.slice(2), e.l || (e.l = {}), e.l[t + s] = n, n ? r ? n.u = r.u : (n.u = Date.now(), e.addEventListener(t, s ? El : bl, s)) : e.removeEventListener(t, s ? El : bl, s);
    else {
        if (o) t = t.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
        else if (t !== "width" && t !== "height" && t !== "href" && t !== "list" && t !== "form" && t !== "tabIndex" && t !== "download" && t !== "rowSpan" && t !== "colSpan" && t !== "role" && t in e) try {
            e[t] = n ?? "";
            break e
        } catch {}
        typeof n == "function" || (n == null || n === !1 && t[4] !== "-" ? e.removeAttribute(t) : e.setAttribute(t, n))
    }
}

function bl(e) {
    if (this.l) {
        var t = this.l[e.type + !1];
        if (e.t) {
            if (e.t <= t.u) return
        } else e.t = Date.now();
        return t(le.event ? le.event(e) : e)
    }
}

function El(e) {
    if (this.l) return this.l[e.type + !0](le.event ? le.event(e) : e)
}

function bc(e, t, n, r, o, s, i, a, c, u) {
    var d, l, f, p, h, m, _, y, b, N, T, L, A, S, x, B = t.type;
    if (t.constructor !== void 0) return null;
    128 & n.__u && (c = !!(32 & n.__u), s = [a = t.__e = n.__e]), (d = le.__b) && d(t);
    e: if (typeof B == "function") try {
        if (y = t.props, b = (d = B.contextType) && r[d.__c], N = d ? b ? b.props.value : d.__ : r, n.__c ? _ = (l = t.__c = n.__c).__ = l.__E : ("prototype" in B && B.prototype.render ? t.__c = l = new B(y, N) : (t.__c = l = new zo(y, N), l.constructor = B, l.render = Qv), b && b.sub(l), l.props = y, l.state || (l.state = {}), l.context = N, l.__n = r, f = l.__d = !0, l.__h = [], l._sb = []), l.__s == null && (l.__s = l.state), B.getDerivedStateFromProps != null && (l.__s == l.state && (l.__s = zt({}, l.__s)), zt(l.__s, B.getDerivedStateFromProps(y, l.__s))), p = l.props, h = l.state, l.__v = t, f) B.getDerivedStateFromProps == null && l.componentWillMount != null && l.componentWillMount(), l.componentDidMount != null && l.__h.push(l.componentDidMount);
        else {
            if (B.getDerivedStateFromProps == null && y !== p && l.componentWillReceiveProps != null && l.componentWillReceiveProps(y, N), !l.__e && (l.shouldComponentUpdate != null && l.shouldComponentUpdate(y, l.__s, N) === !1 || t.__v === n.__v)) {
                for (t.__v !== n.__v && (l.props = y, l.state = l.__s, l.__d = !1), t.__e = n.__e, t.__k = n.__k, t.__k.forEach(function(E) {
                        E && (E.__ = t)
                    }), T = 0; T < l._sb.length; T++) l.__h.push(l._sb[T]);
                l._sb = [], l.__h.length && i.push(l);
                break e
            }
            l.componentWillUpdate != null && l.componentWillUpdate(y, l.__s, N), l.componentDidUpdate != null && l.__h.push(function() {
                l.componentDidUpdate(p, h, m)
            })
        }
        if (l.context = N, l.props = y, l.__P = e, l.__e = !1, L = le.__r, A = 0, "prototype" in B && B.prototype.render) {
            for (l.state = l.__s, l.__d = !1, L && L(t), d = l.render(l.props, l.state, l.context), S = 0; S < l._sb.length; S++) l.__h.push(l._sb[S]);
            l._sb = []
        } else
            do l.__d = !1, L && L(t), d = l.render(l.props, l.state, l.context), l.state = l.__s; while (l.__d && ++A < 25);
        l.state = l.__s, l.getChildContext != null && (r = zt(zt({}, r), l.getChildContext())), f || l.getSnapshotBeforeUpdate == null || (m = l.getSnapshotBeforeUpdate(p, h)), wp(e, Sc(x = d != null && d.type === Qr && d.key == null ? d.props.children : d) ? x : [x], t, n, r, o, s, i, a, c, u), l.base = t.__e, t.__u &= -161, l.__h.length && i.push(l), _ && (l.__E = l.__ = null)
    } catch (E) {
        t.__v = null, c || s != null ? (t.__e = a, t.__u |= c ? 160 : 32, s[s.indexOf(a)] = null) : (t.__e = n.__e, t.__k = n.__k), le.__e(E, t, n)
    } else s == null && t.__v === n.__v ? (t.__k = n.__k, t.__e = n.__e) : t.__e = Xv(n.__e, t, n, r, o, s, i, c, u);
    (d = le.diffed) && d(t)
}

function ha(e, t, n) {
    for (var r = 0; r < n.length; r++) Ec(n[r], n[++r], n[++r]);
    le.__c && le.__c(t, e), e.some(function(o) {
        try {
            e = o.__h, o.__h = [], e.some(function(s) {
                s.call(o)
            })
        } catch (s) {
            le.__e(s, o.__v)
        }
    })
}

function Xv(e, t, n, r, o, s, i, a, c) {
    var u, d, l, f, p, h, m, _ = n.props,
        y = t.props,
        b = t.type;
    if (b === "svg" && (o = !0), s != null) {
        for (u = 0; u < s.length; u++)
            if ((p = s[u]) && "setAttribute" in p == !!b && (b ? p.localName === b : p.nodeType === 3)) {
                e = p, s[u] = null;
                break
            }
    }
    if (e == null) {
        if (b === null) return document.createTextNode(y);
        e = o ? document.createElementNS("http://www.w3.org/2000/svg", b) : document.createElement(b, y.is && y), s = null, a = !1
    }
    if (b === null) _ === y || a && e.data === y || (e.data = y);
    else {
        if (s = s && Zs.call(e.childNodes), _ = n.props || Br, !a && s != null)
            for (_ = {}, u = 0; u < e.attributes.length; u++) _[(p = e.attributes[u]).name] = p.value;
        for (u in _) p = _[u], u == "children" || (u == "dangerouslySetInnerHTML" ? l = p : u === "key" || u in y || bo(e, u, null, p, o));
        for (u in y) p = y[u], u == "children" ? f = p : u == "dangerouslySetInnerHTML" ? d = p : u == "value" ? h = p : u == "checked" ? m = p : u === "key" || a && typeof p != "function" || _[u] === p || bo(e, u, p, _[u], o);
        if (d) a || l && (d.__html === l.__html || d.__html === e.innerHTML) || (e.innerHTML = d.__html), t.__k = [];
        else if (l && (e.innerHTML = ""), wp(e, Sc(f) ? f : [f], t, n, r, o && b !== "foreignObject", s, i, s ? s[0] : n.__k && sr(n, 0), a, c), s != null)
            for (u = s.length; u--;) s[u] != null && Tp(s[u]);
        a || (u = "value", h !== void 0 && (h !== e[u] || b === "progress" && !h || b === "option" && h !== _[u]) && bo(e, u, h, _[u], !1), u = "checked", m !== void 0 && m !== e[u] && bo(e, u, m, _[u], !1))
    }
    return e
}

function Ec(e, t, n) {
    try {
        typeof e == "function" ? e(t) : e.current = t
    } catch (r) {
        le.__e(r, n)
    }
}

function ma(e, t, n) {
    var r, o;
    if (le.unmount && le.unmount(e), (r = e.ref) && (r.current && r.current !== e.__e || Ec(r, null, t)), (r = e.__c) != null) {
        if (r.componentWillUnmount) try {
            r.componentWillUnmount()
        } catch (s) {
            le.__e(s, t)
        }
        r.base = r.__P = null, e.__c = void 0
    }
    if (r = e.__k)
        for (o = 0; o < r.length; o++) r[o] && ma(r[o], t, n || typeof e.type != "function");
    n || e.__e == null || Tp(e.__e), e.__ = e.__e = e.__d = void 0
}

function Qv(e, t, n) {
    return this.constructor(e, n)
}

function Zv(e, t, n) {
    var r, o, s, i;
    le.__ && le.__(e, t), o = (r = !1) ? null : t.__k, s = [], i = [], bc(t, e = t.__k = K(Qr, null, [e]), o || Br, Br, t.ownerSVGElement !== void 0, o ? null : t.firstChild ? Zs.call(t.childNodes) : null, s, o ? o.__e : t.firstChild, r, i), e.__d = void 0, ha(s, e, i)
}
Zs = yc.slice, le = {
    __e: function(e, t, n, r) {
        for (var o, s, i; t = t.__;)
            if ((o = t.__c) && !o.__) try {
                if ((s = o.constructor) && s.getDerivedStateFromError != null && (o.setState(s.getDerivedStateFromError(e)), i = o.__d), o.componentDidCatch != null && (o.componentDidCatch(e, r || {}), i = o.__d), i) return o.__E = o
            } catch (a) {
                e = a
            }
        throw e
    }
}, Ep = 0, zo.prototype.setState = function(e, t) {
    var n;
    n = this.__s != null && this.__s !== this.state ? this.__s : this.__s = zt({}, this.state), typeof e == "function" && (e = e(zt({}, n), this.props)), e && zt(n, e), e != null && this.__v && (t && this._sb.push(t), yl(this))
}, zo.prototype.forceUpdate = function(e) {
    this.__v && (this.__e = !0, e && this.__h.push(e), yl(this))
}, zo.prototype.render = Qr, mn = [], vp = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, pa = function(e, t) {
    return e.__v.__b - t.__v.__b
}, ys.__r = 0;
var Ot, ue, xi, vl, ir = 0,
    Rp = [],
    qo = [],
    ge = le,
    Tl = ge.__b,
    Il = ge.__r,
    wl = ge.diffed,
    kl = ge.__c,
    Rl = ge.unmount,
    Cl = ge.__;

function Fn(e, t) {
    ge.__h && ge.__h(ue, e, ir || t), ir = 0;
    var n = ue.__H || (ue.__H = {
        __: [],
        __h: []
    });
    return e >= n.__.length && n.__.push({
        __V: qo
    }), n.__[e]
}

function _n(e) {
    return ir = 1, Cp(xp, e)
}

function Cp(e, t, n) {
    var r = Fn(Ot++, 2);
    if (r.t = e, !r.__c && (r.__ = [n ? n(t) : xp(void 0, t), function(a) {
            var c = r.__N ? r.__N[0] : r.__[0],
                u = r.t(c, a);
            c !== u && (r.__N = [u, r.__[1]], r.__c.setState({}))
        }], r.__c = ue, !ue.u)) {
        var o = function(a, c, u) {
            if (!r.__c.__H) return !0;
            var d = r.__c.__H.__.filter(function(f) {
                return !!f.__c
            });
            if (d.every(function(f) {
                    return !f.__N
                })) return !s || s.call(this, a, c, u);
            var l = !1;
            return d.forEach(function(f) {
                if (f.__N) {
                    var p = f.__[0];
                    f.__ = f.__N, f.__N = void 0, p !== f.__[0] && (l = !0)
                }
            }), !(!l && r.__c.props === a) && (!s || s.call(this, a, c, u))
        };
        ue.u = !0;
        var s = ue.shouldComponentUpdate,
            i = ue.componentWillUpdate;
        ue.componentWillUpdate = function(a, c, u) {
            if (this.__e) {
                var d = s;
                s = void 0, o(a, c, u), s = d
            }
            i && i.call(this, a, c, u)
        }, ue.shouldComponentUpdate = o
    }
    return r.__N || r.__
}

function eT(e, t) {
    var n = Fn(Ot++, 3);
    !ge.__s && vc(n.__H, t) && (n.__ = e, n.i = t, ue.__H.__h.push(n))
}

function Ap(e, t) {
    var n = Fn(Ot++, 4);
    !ge.__s && vc(n.__H, t) && (n.__ = e, n.i = t, ue.__h.push(n))
}

function tT(e) {
    return ir = 5, Zr(function() {
        return {
            current: e
        }
    }, [])
}

function nT(e, t, n) {
    ir = 6, Ap(function() {
        return typeof e == "function" ? (e(t()), function() {
            return e(null)
        }) : e ? (e.current = t(), function() {
            return e.current = null
        }) : void 0
    }, n == null ? n : n.concat(e))
}

function Zr(e, t) {
    var n = Fn(Ot++, 7);
    return vc(n.__H, t) ? (n.__V = e(), n.i = t, n.__h = e, n.__V) : n.__
}

function Kn(e, t) {
    return ir = 8, Zr(function() {
        return e
    }, t)
}

function rT(e) {
    var t = ue.context[e.__c],
        n = Fn(Ot++, 9);
    return n.c = e, t ? (n.__ == null && (n.__ = !0, t.sub(ue)), t.props.value) : e.__
}

function oT(e, t) {
    ge.useDebugValue && ge.useDebugValue(t ? t(e) : e)
}

function sT(e) {
    var t = Fn(Ot++, 10),
        n = _n();
    return t.__ = e, ue.componentDidCatch || (ue.componentDidCatch = function(r, o) {
        t.__ && t.__(r, o), n[1](r)
    }), [n[0], function() {
        n[1](void 0)
    }]
}

function iT() {
    var e = Fn(Ot++, 11);
    if (!e.__) {
        for (var t = ue.__v; t !== null && !t.__m && t.__ !== null;) t = t.__;
        var n = t.__m || (t.__m = [0, 0]);
        e.__ = "P" + n[0] + "-" + n[1]++
    }
    return e.__
}

function aT() {
    for (var e; e = Rp.shift();)
        if (e.__P && e.__H) try {
            e.__H.__h.forEach(Go), e.__H.__h.forEach(ga), e.__H.__h = []
        } catch (t) {
            e.__H.__h = [], ge.__e(t, e.__v)
        }
}
ge.__b = function(e) {
    ue = null, Tl && Tl(e)
}, ge.__ = function(e, t) {
    t.__k && t.__k.__m && (e.__m = t.__k.__m), Cl && Cl(e, t)
}, ge.__r = function(e) {
    Il && Il(e), Ot = 0;
    var t = (ue = e.__c).__H;
    t && (xi === ue ? (t.__h = [], ue.__h = [], t.__.forEach(function(n) {
        n.__N && (n.__ = n.__N), n.__V = qo, n.__N = n.i = void 0
    })) : (t.__h.forEach(Go), t.__h.forEach(ga), t.__h = [], Ot = 0)), xi = ue
}, ge.diffed = function(e) {
    wl && wl(e);
    var t = e.__c;
    t && t.__H && (t.__H.__h.length && (Rp.push(t) !== 1 && vl === ge.requestAnimationFrame || ((vl = ge.requestAnimationFrame) || cT)(aT)), t.__H.__.forEach(function(n) {
        n.i && (n.__H = n.i), n.__V !== qo && (n.__ = n.__V), n.i = void 0, n.__V = qo
    })), xi = ue = null
}, ge.__c = function(e, t) {
    t.some(function(n) {
        try {
            n.__h.forEach(Go), n.__h = n.__h.filter(function(r) {
                return !r.__ || ga(r)
            })
        } catch (r) {
            t.some(function(o) {
                o.__h && (o.__h = [])
            }), t = [], ge.__e(r, n.__v)
        }
    }), kl && kl(e, t)
}, ge.unmount = function(e) {
    Rl && Rl(e);
    var t, n = e.__c;
    n && n.__H && (n.__H.__.forEach(function(r) {
        try {
            Go(r)
        } catch (o) {
            t = o
        }
    }), n.__H = void 0, t && ge.__e(t, n.__v))
};
var Al = typeof requestAnimationFrame == "function";

function cT(e) {
    var t, n = function() {
            clearTimeout(r), Al && cancelAnimationFrame(t), setTimeout(e)
        },
        r = setTimeout(n, 100);
    Al && (t = requestAnimationFrame(n))
}

function Go(e) {
    var t = ue,
        n = e.__c;
    typeof n == "function" && (e.__c = void 0, n()), ue = t
}

function ga(e) {
    var t = ue;
    e.__c = e.__(), ue = t
}

function vc(e, t) {
    return !e || e.length !== t.length || t.some(function(n, r) {
        return n !== e[r]
    })
}

function xp(e, t) {
    return typeof t == "function" ? t(e) : t
}
const uT = Object.defineProperty({
        __proto__: null,
        useCallback: Kn,
        useContext: rT,
        useDebugValue: oT,
        useEffect: eT,
        useErrorBoundary: sT,
        useId: iT,
        useImperativeHandle: nT,
        useLayoutEffect: Ap,
        useMemo: Zr,
        useReducer: Cp,
        useRef: tT,
        useState: _n
    }, Symbol.toStringTag, {
        value: "Module"
    }),
    lT = "http://www.w3.org/2000/svg";

function dT() {
    const e = r => ce.createElementNS(lT, r),
        t = Je(e("svg"), {
            width: "32",
            height: "30",
            viewBox: "0 0 72 66",
            fill: "inherit"
        }),
        n = Je(e("path"), {
            transform: "translate(11, 11)",
            d: "M29,2.26a4.67,4.67,0,0,0-8,0L14.42,13.53A32.21,32.21,0,0,1,32.17,40.19H27.55A27.68,27.68,0,0,0,12.09,17.47L6,28a15.92,15.92,0,0,1,9.23,12.17H4.62A.76.76,0,0,1,4,39.06l2.94-5a10.74,10.74,0,0,0-3.36-1.9l-2.91,5a4.54,4.54,0,0,0,1.69,6.24A4.66,4.66,0,0,0,4.62,44H19.15a19.4,19.4,0,0,0-8-17.31l2.31-4A23.87,23.87,0,0,1,23.76,44H36.07a35.88,35.88,0,0,0-16.41-31.8l4.67-8a.77.77,0,0,1,1.05-.27c.53.29,20.29,34.77,20.66,35.17a.76.76,0,0,1-.68,1.13H40.6q.09,1.91,0,3.81h4.78A4.59,4.59,0,0,0,50,39.43a4.49,4.49,0,0,0-.62-2.28Z"
        });
    return t.appendChild(n), t
}

function fT({
    options: e
}) {
    const t = Zr(() => ({
        __html: dT().outerHTML
    }), []);
    return K("h2", {
        class: "dialog__header"
    }, K("span", {
        class: "dialog__title"
    }, e.formTitle), e.showBranding ? K("a", {
        class: "brand-link",
        target: "_blank",
        href: "https://sentry.io/welcome/",
        title: "Powered by Sentry",
        rel: "noopener noreferrer",
        dangerouslySetInnerHTML: t
    }) : null)
}

function pT(e, t) {
    const n = [];
    return t.isNameRequired && !e.name && n.push(t.nameLabel), t.isEmailRequired && !e.email && n.push(t.emailLabel), e.message || n.push(t.messageLabel), n
}

function Mi(e, t) {
    const n = e.get(t);
    return typeof n == "string" ? n.trim() : ""
}

function hT({
    options: e,
    defaultEmail: t,
    defaultName: n,
    onFormClose: r,
    onSubmit: o,
    onSubmitSuccess: s,
    onSubmitError: i,
    showEmail: a,
    showName: c,
    screenshotInput: u
}) {
    const {
        tags: d,
        addScreenshotButtonLabel: l,
        removeScreenshotButtonLabel: f,
        cancelButtonLabel: p,
        emailLabel: h,
        emailPlaceholder: m,
        isEmailRequired: _,
        isNameRequired: y,
        messageLabel: b,
        messagePlaceholder: N,
        nameLabel: T,
        namePlaceholder: L,
        submitButtonLabel: A,
        isRequiredLabel: S
    } = e, [x, B] = _n(!1), [E, O] = _n(null), [k, P] = _n(!1), D = u ?.input, [ee, Y] = _n(null), ne = Kn(w => {
        Y(w), P(!1)
    }, []), v = Kn(w => {
        const V = pT(w, {
            emailLabel: h,
            isEmailRequired: _,
            isNameRequired: y,
            messageLabel: b,
            nameLabel: T
        });
        return V.length > 0 ? O(`Please enter in the following required fields: ${V.join(", ")}`) : O(null), V.length === 0
    }, [h, _, y, b, T]), z = Kn(async w => {
        B(!0);
        try {
            if (w.preventDefault(), !(w.target instanceof HTMLFormElement)) return;
            const V = new FormData(w.target),
                se = await (u && k ? u.value() : void 0),
                re = {
                    name: Mi(V, "name"),
                    email: Mi(V, "email"),
                    message: Mi(V, "message"),
                    attachments: se ? [se] : void 0
                };
            if (!v(re)) return;
            try {
                const ve = await o({
                    name: re.name,
                    email: re.email,
                    message: re.message,
                    source: Dv,
                    tags: d
                }, {
                    attachments: re.attachments
                });
                s(re, ve)
            } catch (ve) {
                Wo && g.error(ve), O(ve), i(ve)
            }
        } finally {
            B(!1)
        }
    }, [u && k, s, i]);
    return K("form", {
        class: "form",
        onSubmit: z
    }, D && k ? K(D, {
        onError: ne
    }) : null, K("fieldset", {
        class: "form__right",
        "data-sentry-feedback": !0,
        disabled: x
    }, K("div", {
        class: "form__top"
    }, E ? K("div", {
        class: "form__error-container"
    }, E) : null, c ? K("label", {
        for: "name",
        class: "form__label"
    }, K(Ni, {
        label: T,
        isRequiredLabel: S,
        isRequired: y
    }), K("input", {
        class: "form__input",
        defaultValue: n,
        id: "name",
        name: "name",
        placeholder: L,
        required: y,
        type: "text"
    })) : K("input", {
        "aria-hidden": !0,
        value: n,
        name: "name",
        type: "hidden"
    }), a ? K("label", {
        for: "email",
        class: "form__label"
    }, K(Ni, {
        label: h,
        isRequiredLabel: S,
        isRequired: _
    }), K("input", {
        class: "form__input",
        defaultValue: t,
        id: "email",
        name: "email",
        placeholder: m,
        required: _,
        type: "email"
    })) : K("input", {
        "aria-hidden": !0,
        value: t,
        name: "email",
        type: "hidden"
    }), K("label", {
        for: "message",
        class: "form__label"
    }, K(Ni, {
        label: b,
        isRequiredLabel: S,
        isRequired: !0
    }), K("textarea", {
        autoFocus: !0,
        class: "form__input form__input--textarea",
        id: "message",
        name: "message",
        placeholder: N,
        required: !0,
        rows: 5
    })), D ? K("label", {
        for: "screenshot",
        class: "form__label"
    }, K("button", {
        class: "btn btn--default",
        disabled: x,
        type: "button",
        onClick: () => {
            Y(null), P(w => !w)
        }
    }, k ? f : l), ee ? K("div", {
        class: "form__error-container"
    }, ee.message) : null) : null), K("div", {
        class: "btn-group"
    }, K("button", {
        class: "btn btn--primary",
        disabled: x,
        type: "submit"
    }, A), K("button", {
        class: "btn btn--default",
        disabled: x,
        type: "button",
        onClick: r
    }, p))))
}

function Ni({
    label: e,
    isRequired: t,
    isRequiredLabel: n
}) {
    return K("span", {
        class: "form__label__text"
    }, e, t && K("span", {
        class: "form__label__text--required"
    }, n))
}
const Eo = 16,
    xl = 17,
    mT = "http://www.w3.org/2000/svg";

function gT() {
    const e = c => ot.document.createElementNS(mT, c),
        t = Je(e("svg"), {
            width: `${Eo}`,
            height: `${xl}`,
            viewBox: `0 0 ${Eo} ${xl}`,
            fill: "inherit"
        }),
        n = Je(e("g"), {
            clipPath: "url(#clip0_57_156)"
        }),
        r = Je(e("path"), {
            "fill-rule": "evenodd",
            "clip-rule": "evenodd",
            d: "M3.55544 15.1518C4.87103 16.0308 6.41775 16.5 8 16.5C10.1217 16.5 12.1566 15.6571 13.6569 14.1569C15.1571 12.6566 16 10.6217 16 8.5C16 6.91775 15.5308 5.37103 14.6518 4.05544C13.7727 2.73985 12.5233 1.71447 11.0615 1.10897C9.59966 0.503466 7.99113 0.34504 6.43928 0.653721C4.88743 0.962403 3.46197 1.72433 2.34315 2.84315C1.22433 3.96197 0.462403 5.38743 0.153721 6.93928C-0.15496 8.49113 0.00346625 10.0997 0.608967 11.5615C1.21447 13.0233 2.23985 14.2727 3.55544 15.1518ZM4.40546 3.1204C5.46945 2.40946 6.72036 2.03 8 2.03C9.71595 2.03 11.3616 2.71166 12.575 3.92502C13.7883 5.13838 14.47 6.78405 14.47 8.5C14.47 9.77965 14.0905 11.0306 13.3796 12.0945C12.6687 13.1585 11.6582 13.9878 10.476 14.4775C9.29373 14.9672 7.99283 15.0953 6.73777 14.8457C5.48271 14.596 4.32987 13.9798 3.42502 13.075C2.52018 12.1701 1.90397 11.0173 1.65432 9.76224C1.40468 8.50718 1.5328 7.20628 2.0225 6.02404C2.5122 4.8418 3.34148 3.83133 4.40546 3.1204Z"
        }),
        o = Je(e("path"), {
            d: "M6.68775 12.4297C6.78586 12.4745 6.89218 12.4984 7 12.5C7.11275 12.4955 7.22315 12.4664 7.32337 12.4145C7.4236 12.3627 7.51121 12.2894 7.58 12.2L12 5.63999C12.0848 5.47724 12.1071 5.28902 12.0625 5.11098C12.0178 4.93294 11.9095 4.77744 11.7579 4.67392C11.6064 4.57041 11.4221 4.52608 11.24 4.54931C11.0579 4.57254 10.8907 4.66173 10.77 4.79999L6.88 10.57L5.13 8.56999C5.06508 8.49566 4.98613 8.43488 4.89768 8.39111C4.80922 8.34735 4.713 8.32148 4.61453 8.31498C4.51605 8.30847 4.41727 8.32147 4.32382 8.35322C4.23038 8.38497 4.14413 8.43484 4.07 8.49999C3.92511 8.63217 3.83692 8.81523 3.82387 9.01092C3.81083 9.2066 3.87393 9.39976 4 9.54999L6.43 12.24C6.50187 12.3204 6.58964 12.385 6.68775 12.4297Z"
        });
    t.appendChild(n).append(o, r);
    const s = e("defs"),
        i = Je(e("clipPath"), {
            id: "clip0_57_156"
        }),
        a = Je(e("rect"), {
            width: `${Eo}`,
            height: `${Eo}`,
            fill: "white",
            transform: "translate(0 0.5)"
        });
    return i.appendChild(a), s.appendChild(i), t.appendChild(s).appendChild(i).appendChild(a), t
}

function _T({
    open: e,
    onFormSubmitted: t,
    ...n
}) {
    const r = n.options,
        o = Zr(() => ({
            __html: gT().outerHTML
        }), []),
        [s, i] = _n(null),
        a = Kn(() => {
            s && (clearTimeout(s), i(null)), t()
        }, [s]),
        c = Kn((u, d) => {
            n.onSubmitSuccess(u, d), i(setTimeout(() => {
                t(), i(null)
            }, $v))
        }, [t]);
    return K(Qr, null, s ? K("div", {
        class: "success__position",
        onClick: a
    }, K("div", {
        class: "success__content"
    }, r.successMessageText, K("span", {
        class: "success__icon",
        dangerouslySetInnerHTML: o
    }))) : K("dialog", {
        class: "dialog",
        onClick: r.onFormClose,
        open: e
    }, K("div", {
        class: "dialog__position"
    }, K("div", {
        class: "dialog__content",
        onClick: u => {
            u.stopPropagation()
        }
    }, K(fT, {
        options: r
    }), K(hT, { ...n,
        onSubmitSuccess: c
    })))))
}
const yT = `
.dialog {
  position: fixed;
  z-index: var(--z-index);
  margin: 0;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  height: 100vh;
  width: 100vw;

  color: var(--dialog-color, var(--foreground));
  fill: var(--dialog-color, var(--foreground));
  line-height: 1.75em;

  background-color: rgba(0, 0, 0, 0.05);
  border: none;
  inset: 0;
  opacity: 1;
  transition: opacity 0.2s ease-in-out;
}

.dialog__position {
  position: fixed;
  z-index: var(--z-index);
  inset: var(--dialog-inset);
  padding: var(--page-margin);
  display: flex;
  max-height: calc(100vh - (2 * var(--page-margin)));
}
@media (max-width: 600px) {
  .dialog__position {
    inset: var(--page-margin);
    padding: 0;
  }
}

.dialog__position:has(.editor) {
  inset: var(--page-margin);
  padding: 0;
}

.dialog:not([open]) {
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
}
.dialog:not([open]) .dialog__content {
  transform: translate(0, -16px) scale(0.98);
}

.dialog__content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: var(--dialog-padding, 24px);
  max-width: 100%;
  width: 100%;
  max-height: 100%;
  overflow: auto;

  background: var(--dialog-background, var(--background));
  border-radius: var(--dialog-border-radius, 20px);
  border: var(--dialog-border, var(--border));
  box-shadow: var(--dialog-box-shadow, var(--box-shadow));
  transform: translate(0, 0) scale(1);
  transition: transform 0.2s ease-in-out;
}

`,
    ST = `
.dialog__header {
  display: flex;
  gap: 4px;
  justify-content: space-between;
  font-weight: var(--dialog-header-weight, 600);
  margin: 0;
}
.dialog__title {
  align-self: center;
  width: var(--form-width, 272px);
}

@media (max-width: 600px) {
  .dialog__title {
    width: auto;
  }
}

.dialog__position:has(.editor) .dialog__title {
  width: auto;
}


.brand-link {
  display: inline-flex;
}
.brand-link:focus-visible {
  outline: var(--outline);
}
`,
    bT = `
.form {
  display: flex;
  overflow: auto;
  flex-direction: row;
  gap: 16px;
  flex: 1 0;
}

.form fieldset {
  border: none;
  margin: 0;
  padding: 0;
}

.form__right {
  flex: 0 0 auto;
  display: flex;
  overflow: auto;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  width: var(--form-width, 100%);
}

.dialog__position:has(.editor) .form__right {
  width: var(--form-width, 272px);
}

.form__top {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form__error-container {
  color: var(--error-color);
  fill: var(--error-color);
}

.form__label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0px;
}

.form__label__text {
  display: flex;
  gap: 4px;
  align-items: center;
}

.form__label__text--required {
  font-size: 0.85em;
}

.form__input {
  font-family: inherit;
  line-height: inherit;
  background: transparent;
  box-sizing: border-box;
  border: var(--input-border, var(--border));
  border-radius: var(--input-border-radius, 6px);
  color: var(--input-color, inherit);
  fill: var(--input-color, inherit);
  font-size: var(--input-font-size, inherit);
  font-weight: var(--input-font-weight, 500);
  padding: 6px 12px;
}

.form__input::placeholder {
  opacity: 0.65;
  color: var(--input-placeholder-color, inherit);
  filter: var(--interactive-filter);
}

.form__input:focus-visible {
  outline: var(--input-focus-outline, var(--outline));
}

.form__input--textarea {
  font-family: inherit;
  resize: vertical;
}

.error {
  color: var(--error-color);
  fill: var(--error-color);
}
`,
    ET = `
.btn-group {
  display: grid;
  gap: 8px;
}

.btn {
  line-height: inherit;
  border: var(--button-border, var(--border));
  border-radius: var(--button-border-radius, 6px);
  cursor: pointer;
  font-family: inherit;
  font-size: var(--button-font-size, inherit);
  font-weight: var(--button-font-weight, 600);
  padding: var(--button-padding, 6px 16px);
}
.btn[disabled] {
  opacity: 0.6;
  pointer-events: none;
}

.btn--primary {
  color: var(--button-primary-color, var(--accent-foreground));
  fill: var(--button-primary-color, var(--accent-foreground));
  background: var(--button-primary-background, var(--accent-background));
  border: var(--button-primary-border, var(--border));
  border-radius: var(--button-primary-border-radius, 6px);
  font-weight: var(--button-primary-font-weight, 500);
}
.btn--primary:hover {
  color: var(--button-primary-hover-color, var(--accent-foreground));
  fill: var(--button-primary-hover-color, var(--accent-foreground));
  background: var(--button-primary-hover-background, var(--accent-background));
  filter: var(--interactive-filter);
}
.btn--primary:focus-visible {
  background: var(--button-primary-hover-background, var(--accent-background));
  filter: var(--interactive-filter);
  outline: var(--button-primary-focus-outline, var(--outline));
}

.btn--default {
  color: var(--button-color, var(--foreground));
  fill: var(--button-color, var(--foreground));
  background: var(--button-background, var(--background));
  border: var(--button-border, var(--border));
  border-radius: var(--button-border-radius, 6px);
  font-weight: var(--button-font-weight, 500);
}
.btn--default:hover {
  color: var(--button-color, var(--foreground));
  fill: var(--button-color, var(--foreground));
  background: var(--button-hover-background, var(--background));
  filter: var(--interactive-filter);
}
.btn--default:focus-visible {
  background: var(--button-hover-background, var(--background));
  filter: var(--interactive-filter);
  outline: var(--button-focus-outline, var(--outline));
}
`,
    vT = `
.success__position {
  position: fixed;
  inset: var(--dialog-inset);
  padding: var(--page-margin);
  z-index: var(--z-index);
}
.success__content {
  background: var(--success-background, var(--background));
  border: var(--success-border, var(--border));
  border-radius: var(--success-border-radius, 1.7em/50%);
  box-shadow: var(--success-box-shadow, var(--box-shadow));
  font-weight: var(--success-font-weight, 600);
  color: var(--success-color);
  fill: var(--success-color);
  padding: 12px 24px;
  line-height: 1.75em;

  display: grid;
  align-items: center;
  grid-auto-flow: column;
  gap: 6px;
  cursor: default;
}

.success__icon {
  display: flex;
}
`;

function TT(e) {
    const t = ce.createElement("style");
    return t.textContent = `
:host {
  --dialog-inset: var(--inset);
}

${yT}
${ST}
${bT}
${ET}
${vT}
`, e && t.setAttribute("nonce", e), t
}

function IT() {
    const e = j().getUser(),
        t = ke().getUser(),
        n = Gt().getUser();
    return e && Object.keys(e).length ? e : t && Object.keys(t).length ? t : n
}
const wT = (() => ({
    name: "FeedbackModal",
    setupOnce() {},
    createDialog: ({
        options: e,
        screenshotIntegration: t,
        sendFeedback: n,
        shadow: r
    }) => {
        const o = r,
            s = e.useSentryUser,
            i = IT(),
            a = ce.createElement("div"),
            c = TT(e.styleNonce);
        let u = "";
        const d = {
                get el() {
                    return a
                },
                appendToDom() {
                    !o.contains(c) && !o.contains(a) && (o.appendChild(c), o.appendChild(a))
                },
                removeFromDom() {
                    a.remove(), c.remove(), ce.body.style.overflow = u
                },
                open() {
                    f(!0), e.onFormOpen ?.(), C() ?.emit("openFeedbackWidget"), u = ce.body.style.overflow, ce.body.style.overflow = "hidden"
                },
                close() {
                    f(!1), ce.body.style.overflow = u
                }
            },
            l = t ?.createInput({
                h: K,
                hooks: uT,
                dialog: d,
                options: e
            }),
            f = p => {
                Zv(K(_T, {
                    options: e,
                    screenshotInput: l,
                    showName: e.showName || e.isNameRequired,
                    showEmail: e.showEmail || e.isEmailRequired,
                    defaultName: String(s && i ?.[s.name] || ""),
                    defaultEmail: String(s && i ?.[s.email] || ""),
                    onFormClose: () => {
                        f(!1), e.onFormClose ?.()
                    },
                    onSubmit: n,
                    onSubmitSuccess: (h, m) => {
                        f(!1), e.onSubmitSuccess ?.(h, m)
                    },
                    onSubmitError: h => {
                        e.onSubmitError ?.(h)
                    },
                    onFormSubmitted: () => {
                        e.onFormSubmitted ?.()
                    },
                    open: p
                }), a)
            };
        return d
    }
}));

function kT({
    h: e
}) {
    return function() {
        return e("svg", {
            "data-test-id": "icon-close",
            viewBox: "0 0 16 16",
            fill: "#2B2233",
            height: "25px",
            width: "25px"
        }, e("circle", {
            r: "7",
            cx: "8",
            cy: "8",
            fill: "white"
        }), e("path", {
            strokeWidth: "1.5",
            d: "M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM8,1.53A6.47,6.47,0,1,0,14.47,8,6.47,6.47,0,0,0,8,1.53Z"
        }), e("path", {
            strokeWidth: "1.5",
            d: "M5.34,11.41a.71.71,0,0,1-.53-.22.74.74,0,0,1,0-1.06l5.32-5.32a.75.75,0,0,1,1.06,1.06L5.87,11.19A.74.74,0,0,1,5.34,11.41Z"
        }), e("path", {
            strokeWidth: "1.5",
            d: "M10.66,11.41a.74.74,0,0,1-.53-.22L4.81,5.87A.75.75,0,0,1,5.87,4.81l5.32,5.32a.74.74,0,0,1,0,1.06A.71.71,0,0,1,10.66,11.41Z"
        }))
    }
}

function RT(e) {
    const t = ce.createElement("style"),
        n = "#1A141F",
        r = "#302735";
    return t.textContent = `
.editor {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
}

.editor__image-container {
  justify-items: center;
  padding: 15px;
  position: relative;
  height: 100%;
  border-radius: var(--menu-border-radius, 6px);

  background-color: ${n};
  background-image: repeating-linear-gradient(
      -145deg,
      transparent,
      transparent 8px,
      ${n} 8px,
      ${n} 11px
    ),
    repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 15px,
      ${r} 15px,
      ${r} 16px
    );
}

.editor__canvas-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.editor__canvas-container > * {
  object-fit: contain;
  position: absolute;
}

.editor__tool-container {
  padding-top: 8px;
  display: flex;
  justify-content: center;
}

.editor__tool-bar {
  display: flex;
  gap: 8px;
}

.editor__tool {
  display: flex;
  padding: 8px 12px;
  justify-content: center;
  align-items: center;
  border: var(--button-border, var(--border));
  border-radius: var(--button-border-radius, 6px);
  background: var(--button-background, var(--background));
  color: var(--button-color, var(--foreground));
}

.editor__tool--active {
  background: var(--button-primary-background, var(--accent-background));
  color: var(--button-primary-color, var(--accent-foreground));
}

.editor__rect {
  position: absolute;
  z-index: 2;
}

.editor__rect button {
  opacity: 0;
  position: absolute;
  top: -12px;
  right: -12px;
  cursor: pointer;
  padding: 0;
  z-index: 3;
  border: none;
  background: none;
}

.editor__rect:hover button {
  opacity: 1;
}
`, e && t.setAttribute("nonce", e), t
}

function CT({
    h: e
}) {
    return function({
        action: n,
        setAction: r,
        options: o
    }) {
        return e("div", {
            class: "editor__tool-container"
        }, e("div", {
            class: "editor__tool-bar"
        }, e("button", {
            type: "button",
            class: `editor__tool ${n==="highlight"?"editor__tool--active":""}`,
            onClick: () => {
                r(n === "highlight" ? "" : "highlight")
            }
        }, o.highlightToolText), e("button", {
            type: "button",
            class: `editor__tool ${n==="hide"?"editor__tool--active":""}`,
            onClick: () => {
                r(n === "hide" ? "" : "hide")
            }
        }, o.hideToolText)))
    }
}

function AT({
    hooks: e
}) {
    function t() {
        const [n, r] = e.useState(ot.devicePixelRatio ?? 1);
        return e.useEffect(() => {
            const o = () => {
                    r(ot.devicePixelRatio)
                },
                s = matchMedia(`(resolution: ${ot.devicePixelRatio}dppx)`);
            return s.addEventListener("change", o), () => {
                s.removeEventListener("change", o)
            }
        }, []), n
    }
    return function({
        onBeforeScreenshot: r,
        onScreenshot: o,
        onAfterScreenshot: s,
        onError: i
    }) {
        const a = t();
        e.useEffect(() => {
            (async () => {
                r();
                const u = await xr.mediaDevices.getDisplayMedia({
                        video: {
                            width: ot.innerWidth * a,
                            height: ot.innerHeight * a
                        },
                        audio: !1,
                        monitorTypeSurfaces: "exclude",
                        preferCurrentTab: !0,
                        selfBrowserSurface: "include",
                        surfaceSwitching: "exclude"
                    }),
                    d = ce.createElement("video");
                await new Promise((l, f) => {
                    d.srcObject = u, d.onloadedmetadata = () => {
                        o(d, a), u.getTracks().forEach(p => p.stop()), l()
                    }, d.play().catch(f)
                }), s()
            })().catch(i)
        }, [])
    }
}

function xT(e, t, n) {
    switch (e.type) {
        case "highlight":
            {
                t.shadowColor = "rgba(0, 0, 0, 0.7)",
                t.shadowBlur = 50,
                t.fillStyle = n,
                t.fillRect(e.x - 1, e.y - 1, e.w + 2, e.h + 2),
                t.clearRect(e.x, e.y, e.w, e.h);
                break
            }
        case "hide":
            t.fillStyle = "rgb(0, 0, 0)", t.fillRect(e.x, e.y, e.w, e.h);
            break
    }
}

function Ut(e, t, n) {
    if (!e) return;
    const r = e.getContext("2d", t);
    r && n(e, r)
}

function Oi(e, t) {
    Ut(e, {
        alpha: !0
    }, (n, r) => {
        r.drawImage(t, 0, 0, t.width, t.height, 0, 0, n.width, n.height)
    })
}

function Pi(e, t, n) {
    Ut(e, {
        alpha: !0
    }, (r, o) => {
        n.length && (o.fillStyle = "rgba(0, 0, 0, 0.25)", o.fillRect(0, 0, r.width, r.height)), n.forEach(s => {
            xT(s, o, t)
        })
    })
}

function MT({
    h: e,
    hooks: t,
    outputBuffer: n,
    dialog: r,
    options: o
}) {
    const s = AT({
            hooks: t
        }),
        i = CT({
            h: e
        }),
        a = kT({
            h: e
        }),
        c = {
            __html: RT(o.styleNonce).innerText
        },
        u = r.el.style,
        d = ({
            screenshot: l
        }) => {
            const [f, p] = t.useState("highlight"), [h, m] = t.useState([]), _ = t.useRef(null), y = t.useRef(null), b = t.useRef(null), N = t.useRef(null), [T, L] = t.useState(1), A = t.useMemo(() => {
                const k = ce.getElementById(o.id);
                if (!k) return "white";
                const P = getComputedStyle(k);
                return P.getPropertyValue("--button-primary-background") || P.getPropertyValue("--accent-background")
            }, [o.id]);
            t.useLayoutEffect(() => {
                const k = () => {
                    const P = _.current;
                    P && (Ut(l.canvas, {
                        alpha: !1
                    }, D => {
                        const ee = Math.min(P.clientWidth / D.width, P.clientHeight / D.height);
                        L(ee)
                    }), (P.clientHeight === 0 || P.clientWidth === 0) && setTimeout(k, 0))
                };
                return k(), ot.addEventListener("resize", k), () => {
                    ot.removeEventListener("resize", k)
                }
            }, [l]);
            const S = t.useCallback((k, P) => {
                Ut(k, {
                    alpha: !0
                }, (D, ee) => {
                    ee.scale(P, P), D.width = l.canvas.width, D.height = l.canvas.height
                })
            }, [l]);
            t.useEffect(() => {
                S(y.current, l.dpi), Oi(y.current, l.canvas)
            }, [l]), t.useEffect(() => {
                S(b.current, l.dpi), Ut(b.current, {
                    alpha: !0
                }, (k, P) => {
                    P.clearRect(0, 0, k.width, k.height)
                }), Pi(b.current, A, h)
            }, [h, A]), t.useEffect(() => {
                S(n, l.dpi), Oi(n, l.canvas), Ut(ce.createElement("canvas"), {
                    alpha: !0
                }, (k, P) => {
                    P.scale(l.dpi, l.dpi), k.width = l.canvas.width, k.height = l.canvas.height, Pi(k, A, h), Oi(n, k)
                })
            }, [h, l, A]);
            const x = k => {
                    if (!f || !N.current) return;
                    const P = N.current.getBoundingClientRect(),
                        D = {
                            type: f,
                            x: k.offsetX / T,
                            y: k.offsetY / T
                        },
                        ee = (v, z) => {
                            const w = (z.clientX - P.x) / T,
                                V = (z.clientY - P.y) / T;
                            return {
                                type: v.type,
                                x: Math.min(v.x, w),
                                y: Math.min(v.y, V),
                                w: Math.abs(w - v.x),
                                h: Math.abs(V - v.y)
                            }
                        },
                        Y = v => {
                            Ut(b.current, {
                                alpha: !0
                            }, (z, w) => {
                                w.clearRect(0, 0, z.width, z.height)
                            }), Pi(b.current, A, [...h, ee(D, v)])
                        },
                        ne = v => {
                            const z = ee(D, v);
                            z.w * T >= 1 && z.h * T >= 1 && m(w => [...w, z]), ce.removeEventListener("mousemove", Y), ce.removeEventListener("mouseup", ne)
                        };
                    ce.addEventListener("mousemove", Y), ce.addEventListener("mouseup", ne)
                },
                B = t.useCallback(k => P => {
                    P.preventDefault(), P.stopPropagation(), m(D => {
                        const ee = [...D];
                        return ee.splice(k, 1), ee
                    })
                }, []),
                E = {
                    width: `${l.canvas.width*T}px`,
                    height: `${l.canvas.height*T}px`
                },
                O = k => {
                    k.stopPropagation()
                };
            return e("div", {
                class: "editor"
            }, e("style", {
                nonce: o.styleNonce,
                dangerouslySetInnerHTML: c
            }), e("div", {
                class: "editor__image-container"
            }, e("div", {
                class: "editor__canvas-container",
                ref: _
            }, e("canvas", {
                ref: y,
                id: "background",
                style: E
            }), e("canvas", {
                ref: b,
                id: "foreground",
                style: E
            }), e("div", {
                ref: N,
                onMouseDown: x,
                style: E
            }, h.map((k, P) => e("div", {
                key: P,
                class: "editor__rect",
                style: {
                    top: `${k.y*T}px`,
                    left: `${k.x*T}px`,
                    width: `${k.w*T}px`,
                    height: `${k.h*T}px`
                }
            }, e("button", {
                "aria-label": o.removeHighlightText,
                onClick: B(P),
                onMouseDown: O,
                onMouseUp: O,
                type: "button"
            }, e(a, null))))))), e(i, {
                options: o,
                action: f,
                setAction: p
            }))
        };
    return function({
        onError: f
    }) {
        const [p, h] = t.useState();
        return s({
            onBeforeScreenshot: t.useCallback(() => {
                u.display = "none"
            }, []),
            onScreenshot: t.useCallback((m, _) => {
                Ut(ce.createElement("canvas"), {
                    alpha: !1
                }, (y, b) => {
                    b.scale(_, _), y.width = m.videoWidth, y.height = m.videoHeight, b.drawImage(m, 0, 0, y.width, y.height), h({
                        canvas: y,
                        dpi: _
                    })
                }), n.width = m.videoWidth, n.height = m.videoHeight
            }, []),
            onAfterScreenshot: t.useCallback(() => {
                u.display = "block"
            }, []),
            onError: t.useCallback(m => {
                u.display = "block", f(m)
            }, [])
        }), p ? e(d, {
            screenshot: p
        }) : e("div", null)
    }
}
const NT = (() => ({
        name: "FeedbackScreenshot",
        setupOnce() {},
        createInput: ({
            h: e,
            hooks: t,
            dialog: n,
            options: r
        }) => {
            const o = ce.createElement("canvas");
            return {
                input: MT({
                    h: e,
                    hooks: t,
                    outputBuffer: o,
                    dialog: n,
                    options: r
                }),
                value: async () => {
                    const s = await new Promise(i => {
                        o.toBlob(i, "image/png")
                    });
                    if (s) return {
                        data: new Uint8Array(await s.arrayBuffer()),
                        filename: "screenshot.png",
                        contentType: "application/png"
                    }
                }
            }
        }
    })),
    M = $;
let _a = 0;

function Mp() {
    return _a > 0
}

function OT() {
    _a++, setTimeout(() => {
        _a--
    })
}

function ar(e, t = {}) {
    function n(o) {
        return typeof o == "function"
    }
    if (!n(e)) return e;
    try {
        const o = e.__sentry_wrapped__;
        if (o) return typeof o == "function" ? o : e;
        if (Wa(e)) return e
    } catch {
        return e
    }
    const r = function(...o) {
        try {
            const s = o.map(i => ar(i, t));
            return e.apply(this, s)
        } catch (s) {
            throw OT(), Ke(i => {
                i.addEventProcessor(a => (t.mechanism && (Zi(a, void 0), Mt(a, t.mechanism)), a.extra = { ...a.extra,
                    arguments: o
                }, a)), _e(s)
            }), s
        }
    };
    try {
        for (const o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o])
    } catch {}
    Kd(r, e), we(e, "__sentry_wrapped__", r);
    try {
        Object.getOwnPropertyDescriptor(r, "name").configurable && Object.defineProperty(r, "name", {
            get() {
                return e.name
            }
        })
    } catch {}
    return r
}

function Tc() {
    const e = Ln(),
        {
            referrer: t
        } = M.document || {},
        {
            userAgent: n
        } = M.navigator || {},
        r = { ...t && {
                Referer: t
            },
            ...n && {
                "User-Agent": n
            }
        };
    return {
        url: e,
        headers: r
    }
}
const PT = {
        replayIntegration: "replay",
        replayCanvasIntegration: "replay-canvas",
        feedbackIntegration: "feedback",
        feedbackModalIntegration: "feedback-modal",
        feedbackScreenshotIntegration: "feedback-screenshot",
        captureConsoleIntegration: "captureconsole",
        contextLinesIntegration: "contextlines",
        linkedErrorsIntegration: "linkederrors",
        dedupeIntegration: "dedupe",
        extraErrorDataIntegration: "extraerrordata",
        graphqlClientIntegration: "graphqlclient",
        httpClientIntegration: "httpclient",
        reportingObserverIntegration: "reportingobserver",
        rewriteFramesIntegration: "rewriteframes",
        browserProfilingIntegration: "browserprofiling",
        moduleMetadataIntegration: "modulemetadata",
        instrumentAnthropicAiClient: "instrumentanthropicaiclient",
        instrumentOpenAiClient: "instrumentopenaiclient",
        instrumentGoogleGenAIClient: "instrumentgooglegenaiclient",
        instrumentLangGraph: "instrumentlanggraph",
        createLangChainCallbackHandler: "createlangchaincallbackhandler"
    },
    Ml = M;
async function LT(e, t) {
    const n = PT[e],
        r = Ml.Sentry = Ml.Sentry || {};
    if (!n) throw new Error(`Cannot lazy load integration: ${e}`);
    const o = r[e];
    if (typeof o == "function" && !("_isShim" in o)) return o;
    const s = DT(n),
        i = M.document.createElement("script");
    i.src = s, i.crossOrigin = "anonymous", i.referrerPolicy = "strict-origin", t && i.setAttribute("nonce", t);
    const a = new Promise((l, f) => {
            i.addEventListener("load", () => l()), i.addEventListener("error", f)
        }),
        c = M.document.currentScript,
        u = M.document.body || M.document.head || c ?.parentElement;
    if (u) u.appendChild(i);
    else throw new Error(`Could not find parent element to insert lazy-loaded ${e} script`);
    try {
        await a
    } catch {
        throw new Error(`Error when loading integration: ${e}`)
    }
    const d = r[e];
    if (typeof d != "function") throw new Error(`Could not load integration: ${e}`);
    return d
}

function DT(e) {
    const n = C() ?.getOptions() ?.cdnBaseUrl || "https://browser.sentry-cdn.com";
    return new URL(`/${qt}/${e}.min.js`, n).toString()
}
const cM = bp({
        lazyLoadIntegration: LT
    }),
    uM = bp({
        getModalIntegration: () => wT,
        getScreenshotIntegration: () => NT
    });

function Ic(e, t) {
    const n = wc(e, t),
        r = {
            type: HT(t),
            value: WT(t)
        };
    return n.length && (r.stacktrace = {
        frames: n
    }), r.type === void 0 && r.value === "" && (r.value = "Unrecoverable error caught"), r
}

function FT(e, t, n, r) {
    const s = C() ?.getOptions().normalizeDepth,
        i = VT(t),
        a = {
            __serialized__: bf(t, s)
        };
    if (i) return {
        exception: {
            values: [Ic(e, i)]
        },
        extra: a
    };
    const c = {
        exception: {
            values: [{
                type: Ds(t) ? t.constructor.name : r ? "UnhandledRejection" : "Error",
                value: qT(t, {
                    isUnhandledRejection: r
                })
            }]
        },
        extra: a
    };
    if (n) {
        const u = wc(e, n);
        u.length && (c.exception.values[0].stacktrace = {
            frames: u
        })
    }
    return c
}

function Li(e, t) {
    return {
        exception: {
            values: [Ic(e, t)]
        }
    }
}

function wc(e, t) {
    const n = t.stacktrace || t.stack || "",
        r = BT(t),
        o = UT(t);
    try {
        return e(n, r, o)
    } catch {}
    return []
}
const $T = /Minified React error #\d+;/i;

function BT(e) {
    return e && $T.test(e.message) ? 1 : 0
}

function UT(e) {
    return typeof e.framesToPop == "number" ? e.framesToPop : 0
}

function Np(e) {
    return typeof WebAssembly < "u" && typeof WebAssembly.Exception < "u" ? e instanceof WebAssembly.Exception : !1
}

function HT(e) {
    const t = e ?.name;
    return !t && Np(e) ? e.message && Array.isArray(e.message) && e.message.length == 2 ? e.message[0] : "WebAssembly.Exception" : t
}

function WT(e) {
    const t = e ?.message;
    return Np(e) ? Array.isArray(e.message) && e.message.length == 2 ? e.message[1] : "wasm exception" : t ? t.error && typeof t.error.message == "string" ? t.error.message : t : "No error message"
}

function jT(e, t, n, r) {
    const o = n ?.syntheticException || void 0,
        s = ei(e, t, o, r);
    return Mt(s), s.level = "error", n ?.event_id && (s.event_id = n.event_id), Ws(s)
}

function zT(e, t, n = "info", r, o) {
    const s = r ?.syntheticException || void 0,
        i = ya(e, t, s, o);
    return i.level = n, r ?.event_id && (i.event_id = r.event_id), Ws(i)
}

function ei(e, t, n, r, o) {
    let s;
    if (Gd(t) && t.error) return Li(e, t.error);
    if (au(t) || Qm(t)) {
        const i = t;
        if ("stack" in t) s = Li(e, t);
        else {
            const a = i.name || (au(i) ? "DOMError" : "DOMException"),
                c = i.message ? `${a}: ${i.message}` : a;
            s = ya(e, c, n, r), Zi(s, c)
        }
        return "code" in i && (s.tags = { ...s.tags,
            "DOMException.code": `${i.code}`
        }), s
    }
    return kt(t) ? Li(e, t) : mt(t) || Ds(t) ? (s = FT(e, t, n, o), Mt(s, {
        synthetic: !0
    }), s) : (s = ya(e, t, n, r), Zi(s, `${t}`), Mt(s, {
        synthetic: !0
    }), s)
}

function ya(e, t, n, r) {
    const o = {};
    if (r && n) {
        const s = wc(e, n);
        s.length && (o.exception = {
            values: [{
                value: t,
                stacktrace: {
                    frames: s
                }
            }]
        }), Mt(o, {
            synthetic: !0
        })
    }
    if (Ls(t)) {
        const {
            __sentry_template_string__: s,
            __sentry_template_values__: i
        } = t;
        return o.logentry = {
            message: s,
            params: i
        }, o
    }
    return o.message = t, o
}

function qT(e, {
    isUnhandledRejection: t
}) {
    const n = og(e),
        r = t ? "promise rejection" : "exception";
    return Gd(e) ? `Event \`ErrorEvent\` captured as ${r} with message \`${e.message}\`` : Ds(e) ? `Event \`${GT(e)}\` (type=${e.type}) captured as ${r}` : `Object captured as ${r} with keys: ${n}`
}

function GT(e) {
    try {
        const t = Object.getPrototypeOf(e);
        return t ? t.constructor.name : void 0
    } catch {}
}

function VT(e) {
    for (const t in e)
        if (Object.prototype.hasOwnProperty.call(e, t)) {
            const n = e[t];
            if (n instanceof Error) return n
        }
}
class JT extends Ry {
    constructor(t) {
        const n = KT(t),
            r = M.SENTRY_SDK_SOURCE || gv();
        Vf(n, "browser", ["browser"], r), n._metadata ?.sdk && (n._metadata.sdk.settings = {
            infer_ip: n.sendDefaultPii ? "auto" : "never",
            ...n._metadata.sdk.settings
        }), super(n);
        const {
            sendDefaultPii: o,
            sendClientReports: s,
            enableLogs: i,
            _experiments: a,
            enableMetrics: c
        } = this._options, u = c ?? a ?.enableMetrics ?? !0;
        M.document && (s || i || u) && M.document.addEventListener("visibilitychange", () => {
            M.document.visibilityState === "hidden" && (s && this._flushOutcomes(), i && Za(this), u && tc(this))
        }), o && this.on("beforeSendSession", zy)
    }
    eventFromException(t, n) {
        return jT(this._options.stackParser, t, n, this._options.attachStacktrace)
    }
    eventFromMessage(t, n = "info", r) {
        return zT(this._options.stackParser, t, n, r, this._options.attachStacktrace)
    }
    _prepareEvent(t, n, r, o) {
        return t.platform = t.platform || "javascript", super._prepareEvent(t, n, r, o)
    }
}

function KT(e) {
    return {
        release: typeof __SENTRY_RELEASE__ == "string" ? __SENTRY_RELEASE__ : M.SENTRY_RELEASE ?.id,
        sendClientReports: !0,
        parentSpanIsAlwaysRootSpan: !0,
        ...e
    }
}
const Nn = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__,
    q = $,
    YT = (e, t) => e > t[1] ? "poor" : e > t[0] ? "needs-improvement" : "good",
    eo = (e, t, n, r) => {
        let o, s;
        return i => {
            t.value >= 0 && (i || r) && (s = t.value - (o ?? 0), (s || o === void 0) && (o = t.value, t.delta = s, t.rating = YT(t.value, n), e(t)))
        }
    },
    to = (e = !0) => {
        const t = q.performance ?.getEntriesByType ?.("navigation")[0];
        if (!e || t && t.responseStart > 0 && t.responseStart < performance.now()) return t
    },
    br = () => to() ?.activationStart ?? 0;

function In(e, t, n) {
    q.document && q.addEventListener(e, t, n)
}

function kc(e, t, n) {
    q.document && q.removeEventListener(e, t, n)
}
let Yn = -1;
const Op = new Set,
    XT = () => q.document ?.visibilityState === "hidden" && !q.document ?.prerendering ? 0 : 1 / 0,
    Vo = e => {
        if (QT(e) && Yn > -1) {
            if (e.type === "visibilitychange" || e.type === "pagehide")
                for (const t of Op) t();
            isFinite(Yn) || (Yn = e.type === "visibilitychange" ? e.timeStamp : 0, kc("prerenderingchange", Vo, !0))
        }
    },
    no = () => {
        if (q.document && Yn < 0) {
            const e = br();
            Yn = (q.document.prerendering ? void 0 : globalThis.performance.getEntriesByType("visibility-state").filter(n => n.name === "hidden" && n.startTime > e)[0] ?.startTime) ?? XT(), In("visibilitychange", Vo, !0), In("pagehide", Vo, !0), In("prerenderingchange", Vo, !0)
        }
        return {
            get firstHiddenTime() {
                return Yn
            },
            onHidden(e) {
                Op.add(e)
            }
        }
    };

function QT(e) {
    return e.type === "pagehide" || q.document ?.visibilityState === "hidden"
}
const ZT = () => `v5-${Date.now()}-${Math.floor(Math.random()*(9e12-1))+1e12}`,
    ro = (e, t = -1) => {
        const n = to();
        let r = "navigate";
        return n && (q.document ?.prerendering || br() > 0 ? r = "prerender" : q.document ?.wasDiscarded ? r = "restore" : n.type && (r = n.type.replace(/_/g, "-"))), {
            name: e,
            value: t,
            rating: "good",
            delta: 0,
            entries: [],
            id: ZT(),
            navigationType: r
        }
    },
    Di = new WeakMap;

function Rc(e, t) {
    return Di.get(e) || Di.set(e, new t), Di.get(e)
}
class Ss {
    constructor() {
        Ss.prototype.__init.call(this), Ss.prototype.__init2.call(this)
    }
    __init() {
        this._sessionValue = 0
    }
    __init2() {
        this._sessionEntries = []
    }
    _processEntry(t) {
        if (t.hadRecentInput) return;
        const n = this._sessionEntries[0],
            r = this._sessionEntries[this._sessionEntries.length - 1];
        this._sessionValue && n && r && t.startTime - r.startTime < 1e3 && t.startTime - n.startTime < 5e3 ? (this._sessionValue += t.value, this._sessionEntries.push(t)) : (this._sessionValue = t.value, this._sessionEntries = [t]), this._onAfterProcessingUnexpectedShift ?.(t)
    }
}
const Er = (e, t, n = {}) => {
        try {
            if (PerformanceObserver.supportedEntryTypes.includes(e)) {
                const r = new PerformanceObserver(o => {
                    Promise.resolve().then(() => {
                        t(o.getEntries())
                    })
                });
                return r.observe({
                    type: e,
                    buffered: !0,
                    ...n
                }), r
            }
        } catch {}
    },
    Cc = e => {
        let t = !1;
        return () => {
            t || (e(), t = !0)
        }
    },
    ti = e => {
        q.document ?.prerendering ? addEventListener("prerenderingchange", () => e(), !0) : e()
    },
    e0 = [1800, 3e3],
    t0 = (e, t = {}) => {
        ti(() => {
            const n = no(),
                r = ro("FCP");
            let o;
            const i = Er("paint", a => {
                for (const c of a) c.name === "first-contentful-paint" && (i.disconnect(), c.startTime < n.firstHiddenTime && (r.value = Math.max(c.startTime - br(), 0), r.entries.push(c), o(!0)))
            });
            i && (o = eo(e, r, e0, t.reportAllChanges))
        })
    },
    n0 = [.1, .25],
    r0 = (e, t = {}) => {
        t0(Cc(() => {
            const n = ro("CLS", 0);
            let r;
            const o = no(),
                s = Rc(t, Ss),
                i = c => {
                    for (const u of c) s._processEntry(u);
                    s._sessionValue > n.value && (n.value = s._sessionValue, n.entries = s._sessionEntries, r())
                },
                a = Er("layout-shift", i);
            a && (r = eo(e, n, n0, t.reportAllChanges), o.onHidden(() => {
                i(a.takeRecords()), r(!0)
            }), q ?.setTimeout ?.(r))
        }))
    };
let Pp = 0,
    Fi = 1 / 0,
    vo = 0;
const o0 = e => {
    e.forEach(t => {
        t.interactionId && (Fi = Math.min(Fi, t.interactionId), vo = Math.max(vo, t.interactionId), Pp = vo ? (vo - Fi) / 7 + 1 : 0)
    })
};
let Sa;
const Lp = () => Sa ? Pp : performance.interactionCount || 0,
    s0 = () => {
        "interactionCount" in performance || Sa || (Sa = Er("event", o0, {
            type: "event",
            buffered: !0,
            durationThreshold: 0
        }))
    },
    $i = 10;
let Dp = 0;
const i0 = () => Lp() - Dp;
class bs {
    constructor() {
        bs.prototype.__init.call(this), bs.prototype.__init2.call(this)
    }
    __init() {
        this._longestInteractionList = []
    }
    __init2() {
        this._longestInteractionMap = new Map
    }
    _resetInteractions() {
        Dp = Lp(), this._longestInteractionList.length = 0, this._longestInteractionMap.clear()
    }
    _estimateP98LongestInteraction() {
        const t = Math.min(this._longestInteractionList.length - 1, Math.floor(i0() / 50));
        return this._longestInteractionList[t]
    }
    _processEntry(t) {
        if (this._onBeforeProcessingEntry ?.(t), !(t.interactionId || t.entryType === "first-input")) return;
        const n = this._longestInteractionList.at(-1);
        let r = this._longestInteractionMap.get(t.interactionId);
        if (r || this._longestInteractionList.length < $i || t.duration > n._latency) {
            if (r ? t.duration > r._latency ? (r.entries = [t], r._latency = t.duration) : t.duration === r._latency && t.startTime === r.entries[0].startTime && r.entries.push(t) : (r = {
                    id: t.interactionId,
                    entries: [t],
                    _latency: t.duration
                }, this._longestInteractionMap.set(r.id, r), this._longestInteractionList.push(r)), this._longestInteractionList.sort((o, s) => s._latency - o._latency), this._longestInteractionList.length > $i) {
                const o = this._longestInteractionList.splice($i);
                for (const s of o) this._longestInteractionMap.delete(s.id)
            }
            this._onAfterProcessingINPCandidate ?.(r)
        }
    }
}
const Fp = e => {
        const t = n => {
            (n.type === "pagehide" || q.document ?.visibilityState === "hidden") && e(n)
        };
        In("visibilitychange", t, !0), In("pagehide", t, !0)
    },
    $p = e => {
        const t = q.requestIdleCallback || q.setTimeout;
        q.document ?.visibilityState === "hidden" ? e() : (e = Cc(e), In("visibilitychange", e, {
            once: !0,
            capture: !0
        }), t(() => {
            e(), kc("visibilitychange", e, {
                capture: !0
            })
        }), Fp(e))
    },
    a0 = [200, 500],
    c0 = 40,
    u0 = (e, t = {}) => {
        if (!(globalThis.PerformanceEventTiming && "interactionId" in PerformanceEventTiming.prototype)) return;
        const n = no();
        ti(() => {
            s0();
            const r = ro("INP");
            let o;
            const s = Rc(t, bs),
                i = c => {
                    $p(() => {
                        for (const d of c) s._processEntry(d);
                        const u = s._estimateP98LongestInteraction();
                        u && u._latency !== r.value && (r.value = u._latency, r.entries = u.entries, o())
                    })
                },
                a = Er("event", i, {
                    durationThreshold: t.durationThreshold ?? c0
                });
            o = eo(e, r, a0, t.reportAllChanges), a && (a.observe({
                type: "first-input",
                buffered: !0
            }), n.onHidden(() => {
                i(a.takeRecords()), o(!0)
            }))
        })
    };
class l0 {
    _processEntry(t) {
        this._onBeforeProcessingEntry ?.(t)
    }
}
const d0 = [2500, 4e3],
    f0 = (e, t = {}) => {
        ti(() => {
            const n = no(),
                r = ro("LCP");
            let o;
            const s = Rc(t, l0),
                i = c => {
                    t.reportAllChanges || (c = c.slice(-1));
                    for (const u of c) s._processEntry(u), u.startTime < n.firstHiddenTime && (r.value = Math.max(u.startTime - br(), 0), r.entries = [u], o())
                },
                a = Er("largest-contentful-paint", i);
            if (a) {
                o = eo(e, r, d0, t.reportAllChanges);
                const c = Cc(() => {
                        i(a.takeRecords()), a.disconnect(), o(!0)
                    }),
                    u = d => {
                        d.isTrusted && ($p(c), kc(d.type, u, {
                            capture: !0
                        }))
                    };
                for (const d of ["keydown", "click", "visibilitychange"]) In(d, u, {
                    capture: !0
                })
            }
        })
    },
    p0 = [800, 1800],
    ba = e => {
        q.document ?.prerendering ? ti(() => ba(e)) : q.document ?.readyState !== "complete" ? addEventListener("load", () => ba(e), !0) : setTimeout(e)
    },
    h0 = (e, t = {}) => {
        const n = ro("TTFB"),
            r = eo(e, n, p0, t.reportAllChanges);
        ba(() => {
            const o = to();
            o && (n.value = Math.max(o.responseStart - br(), 0), n.entries = [o], r(!0))
        })
    },
    Nr = {},
    Es = {};
let Bp, Up, Hp, Wp;

function Ac(e, t = !1) {
    return ni("cls", e, g0, Bp, t)
}

function xc(e, t = !1) {
    return ni("lcp", e, _0, Up, t)
}

function m0(e) {
    return ni("ttfb", e, y0, Hp)
}

function jp(e) {
    return ni("inp", e, S0, Wp)
}

function On(e, t) {
    return zp(e, t), Es[e] || (b0(e), Es[e] = !0), qp(e, t)
}

function oo(e, t) {
    const n = Nr[e];
    if (n ?.length)
        for (const r of n) try {
            r(t)
        } catch (o) {
            Nn && g.error(`Error while triggering instrumentation handler.
Type: ${e}
Name: ${At(r)}
Error:`, o)
        }
}

function g0() {
    return r0(e => {
        oo("cls", {
            metric: e
        }), Bp = e
    }, {
        reportAllChanges: !0
    })
}

function _0() {
    return f0(e => {
        oo("lcp", {
            metric: e
        }), Up = e
    }, {
        reportAllChanges: !0
    })
}

function y0() {
    return h0(e => {
        oo("ttfb", {
            metric: e
        }), Hp = e
    })
}

function S0() {
    return u0(e => {
        oo("inp", {
            metric: e
        }), Wp = e
    })
}

function ni(e, t, n, r, o = !1) {
    zp(e, t);
    let s;
    return Es[e] || (s = n(), Es[e] = !0), r && t({
        metric: r
    }), qp(e, t, o ? s : void 0)
}

function b0(e) {
    const t = {};
    e === "event" && (t.durationThreshold = 0), Er(e, n => {
        oo(e, {
            entries: n
        })
    }, t)
}

function zp(e, t) {
    Nr[e] = Nr[e] || [], Nr[e].push(t)
}

function qp(e, t, n) {
    return () => {
        n && n();
        const r = Nr[e];
        if (!r) return;
        const o = r.indexOf(t);
        o !== -1 && r.splice(o, 1)
    }
}

function E0(e) {
    return "duration" in e
}

function Bi(e) {
    return typeof e == "number" && isFinite(e)
}

function nn(e, t, n, { ...r
}) {
    const o = F(e).start_timestamp;
    return o && o > t && typeof e.updateStartTime == "function" && e.updateStartTime(t), nr(e, () => {
        const s = at({
            startTime: t,
            ...r
        });
        return s && s.end(n), s
    })
}

function Mc(e) {
    const t = C();
    if (!t) return;
    const {
        name: n,
        transaction: r,
        attributes: o,
        startTime: s
    } = e, {
        release: i,
        environment: a,
        sendDefaultPii: c
    } = t.getOptions(), d = t.getIntegrationByName("Replay") ?.getReplayId(), l = j(), f = l.getUser(), p = f !== void 0 ? f.email || f.id || f.ip_address : void 0;
    let h;
    try {
        h = l.getScopeData().contexts.profile.profile_id
    } catch {}
    const m = {
        release: i,
        environment: a,
        user: p || void 0,
        profile_id: h || void 0,
        replay_id: d || void 0,
        transaction: r,
        "user_agent.original": q.navigator ?.userAgent,
        "client.address": c ? "{{auto}}" : void 0,
        ...o
    };
    return at({
        name: n,
        attributes: m,
        startTime: s,
        experimental: {
            standalone: !0
        }
    })
}

function so() {
    return q.addEventListener && q.performance
}

function be(e) {
    return e / 1e3
}

function v0(e) {
    let t = "unknown",
        n = "unknown",
        r = "";
    for (const o of e) {
        if (o === "/") {
            [t, n] = e.split("/");
            break
        }
        if (!isNaN(Number(o))) {
            t = r === "h" ? "http" : r, n = e.split(r)[1];
            break
        }
        r += o
    }
    return r === e && (t = r), {
        name: t,
        version: n
    }
}

function Gp(e) {
    try {
        return PerformanceObserver.supportedEntryTypes.includes(e)
    } catch {
        return !1
    }
}

function Vp(e, t) {
    let n, r = !1;

    function o(a) {
        !r && n && t(a, n), r = !0
    }
    Fp(() => {
        o("pagehide")
    });
    const s = e.on("beforeStartNavigationSpan", (a, c) => {
            c ?.isRedirect || (o("navigation"), s(), i())
        }),
        i = e.on("afterStartPageLoadSpan", a => {
            n = a.spanContext().spanId, i()
        })
}

function T0(e) {
    let t = 0,
        n;
    if (!Gp("layout-shift")) return;
    const r = Ac(({
        metric: o
    }) => {
        const s = o.entries[o.entries.length - 1];
        s && (t = o.value, n = s)
    }, !0);
    Vp(e, (o, s) => {
        I0(t, n, s, o), r()
    })
}

function I0(e, t, n, r) {
    Nn && g.log(`Sending CLS span (${e})`);
    const o = t ? be((Oe() || 0) + t.startTime) : he(),
        s = j().getScopeData().transactionName,
        i = t ? je(t.sources[0] ?.node) : "Layout shift",
        a = {
            [G]: "auto.http.browser.cls",
            [pe]: "ui.webvital.cls",
            [gr]: 0,
            "sentry.pageload.span_id": n,
            "sentry.report_event": r
        };
    t ?.sources && t.sources.forEach((u, d) => {
        a[`cls.source.${d+1}`] = je(u.node)
    });
    const c = Mc({
        name: i,
        transaction: s,
        attributes: a,
        startTime: o
    });
    c && (c.addEvent("cls", {
        [Vr]: "",
        [Jr]: e
    }), c.end(o))
}

function w0(e) {
    let t = 0,
        n;
    if (!Gp("largest-contentful-paint")) return;
    const r = xc(({
        metric: o
    }) => {
        const s = o.entries[o.entries.length - 1];
        s && (t = o.value, n = s)
    }, !0);
    Vp(e, (o, s) => {
        k0(t, n, s, o), r()
    })
}

function k0(e, t, n, r) {
    Nn && g.log(`Sending LCP span (${e})`);
    const o = be((Oe() || 0) + (t ?.startTime || 0)),
        s = j().getScopeData().transactionName,
        i = t ? je(t.element) : "Largest contentful paint",
        a = {
            [G]: "auto.http.browser.lcp",
            [pe]: "ui.webvital.lcp",
            [gr]: 0,
            "sentry.pageload.span_id": n,
            "sentry.report_event": r
        };
    t && (t.element && (a["lcp.element"] = je(t.element)), t.id && (a["lcp.id"] = t.id), t.url && (a["lcp.url"] = t.url), t.loadTime != null && (a["lcp.loadTime"] = t.loadTime), t.renderTime != null && (a["lcp.renderTime"] = t.renderTime), t.size != null && (a["lcp.size"] = t.size));
    const c = Mc({
        name: i,
        transaction: s,
        attributes: a,
        startTime: o
    });
    c && (c.addEvent("lcp", {
        [Vr]: "millisecond",
        [Jr]: e
    }), c.end(o))
}

function Xe(e) {
    return e && ((Oe() || performance.timeOrigin) + e) / 1e3
}

function Jp(e) {
    const t = {};
    if (e.nextHopProtocol != null) {
        const {
            name: n,
            version: r
        } = v0(e.nextHopProtocol);
        t["network.protocol.version"] = r, t["network.protocol.name"] = n
    }
    return Oe() || so() ?.timeOrigin ? R0({ ...t,
        "http.request.redirect_start": Xe(e.redirectStart),
        "http.request.redirect_end": Xe(e.redirectEnd),
        "http.request.worker_start": Xe(e.workerStart),
        "http.request.fetch_start": Xe(e.fetchStart),
        "http.request.domain_lookup_start": Xe(e.domainLookupStart),
        "http.request.domain_lookup_end": Xe(e.domainLookupEnd),
        "http.request.connect_start": Xe(e.connectStart),
        "http.request.secure_connection_start": Xe(e.secureConnectionStart),
        "http.request.connection_end": Xe(e.connectEnd),
        "http.request.request_start": Xe(e.requestStart),
        "http.request.response_start": Xe(e.responseStart),
        "http.request.response_end": Xe(e.responseEnd),
        "http.request.time_to_first_byte": e.responseStart != null ? e.responseStart / 1e3 : void 0
    }) : t
}

function R0(e) {
    return Object.fromEntries(Object.entries(e).filter(([, t]) => t != null))
}
const C0 = 2147483647;
let Nl = 0,
    rt = {},
    Ue, vs;

function A0({
    recordClsStandaloneSpans: e,
    recordLcpStandaloneSpans: t,
    client: n
}) {
    const r = so();
    if (r && Oe()) {
        r.mark && q.performance.mark("sentry-tracing-init");
        const o = t ? w0(n) : P0(),
            s = L0(),
            i = e ? T0(n) : O0();
        return () => {
            o ?.(), s(), i ?.()
        }
    }
    return () => {}
}

function x0() {
    On("longtask", ({
        entries: e
    }) => {
        const t = Ee();
        if (!t) return;
        const {
            op: n,
            start_timestamp: r
        } = F(t);
        for (const o of e) {
            const s = be(Oe() + o.startTime),
                i = be(o.duration);
            n === "navigation" && r && s < r || nn(t, s, s + i, {
                name: "Main UI thread blocked",
                op: "ui.long-task",
                attributes: {
                    [G]: "auto.ui.browser.metrics"
                }
            })
        }
    })
}

function M0() {
    new PerformanceObserver(t => {
        const n = Ee();
        if (n)
            for (const r of t.getEntries()) {
                if (!r.scripts[0]) continue;
                const o = be(Oe() + r.startTime),
                    {
                        start_timestamp: s,
                        op: i
                    } = F(n);
                if (i === "navigation" && s && o < s) continue;
                const a = be(r.duration),
                    c = {
                        [G]: "auto.ui.browser.metrics"
                    },
                    u = r.scripts[0],
                    {
                        invoker: d,
                        invokerType: l,
                        sourceURL: f,
                        sourceFunctionName: p,
                        sourceCharPosition: h
                    } = u;
                c["browser.script.invoker"] = d, c["browser.script.invoker_type"] = l, f && (c["code.filepath"] = f), p && (c["code.function"] = p), h !== -1 && (c["browser.script.source_char_position"] = h), nn(n, o, o + a, {
                    name: "Main UI thread blocked",
                    op: "ui.long-animation-frame",
                    attributes: c
                })
            }
    }).observe({
        type: "long-animation-frame",
        buffered: !0
    })
}

function N0() {
    On("event", ({
        entries: e
    }) => {
        const t = Ee();
        if (t) {
            for (const n of e)
                if (n.name === "click") {
                    const r = be(Oe() + n.startTime),
                        o = be(n.duration),
                        s = {
                            name: je(n.target),
                            op: `ui.interaction.${n.name}`,
                            startTime: r,
                            attributes: {
                                [G]: "auto.ui.browser.metrics"
                            }
                        },
                        i = Jd(n.target);
                    i && (s.attributes["ui.component_name"] = i), nn(t, r, r + o, s)
                }
        }
    })
}

function O0() {
    return Ac(({
        metric: e
    }) => {
        const t = e.entries[e.entries.length - 1];
        t && (rt.cls = {
            value: e.value,
            unit: ""
        }, vs = t)
    }, !0)
}

function P0() {
    return xc(({
        metric: e
    }) => {
        const t = e.entries[e.entries.length - 1];
        t && (rt.lcp = {
            value: e.value,
            unit: "millisecond"
        }, Ue = t)
    }, !0)
}

function L0() {
    return m0(({
        metric: e
    }) => {
        e.entries[e.entries.length - 1] && (rt.ttfb = {
            value: e.value,
            unit: "millisecond"
        })
    })
}

function D0(e, t) {
    const n = so(),
        r = Oe();
    if (!n ?.getEntries || !r) return;
    const o = be(r),
        s = n.getEntries(),
        {
            op: i,
            start_timestamp: a
        } = F(e);
    s.slice(Nl).forEach(c => {
        const u = be(c.startTime),
            d = be(Math.max(0, c.duration));
        if (!(i === "navigation" && a && o + u < a)) switch (c.entryType) {
            case "navigation":
                {
                    U0(e, c, o);
                    break
                }
            case "mark":
            case "paint":
            case "measure":
                {
                    $0(e, c, u, d, o, t.ignorePerformanceApiSpans);
                    const l = no(),
                        f = c.startTime < l.firstHiddenTime;c.name === "first-paint" && f && (rt.fp = {
                        value: c.startTime,
                        unit: "millisecond"
                    }),
                    c.name === "first-contentful-paint" && f && (rt.fcp = {
                        value: c.startTime,
                        unit: "millisecond"
                    });
                    break
                }
            case "resource":
                {
                    j0(e, c, c.name, u, d, o, t.ignoreResourceSpans);
                    break
                }
        }
    }), Nl = Math.max(s.length - 1, 0), z0(e), i === "pageload" && (V0(rt), t.recordClsOnPageloadSpan || delete rt.cls, t.recordLcpOnPageloadSpan || delete rt.lcp, Object.entries(rt).forEach(([c, u]) => {
        h_(c, u.value, u.unit)
    }), e.setAttribute("performance.timeOrigin", o), e.setAttribute("performance.activationStart", br()), q0(e, t)), Ue = void 0, vs = void 0, rt = {}
}

function F0(e) {
    if (e ?.entryType === "measure") try {
        return e.detail.devtools.track === "Components ⚛"
    } catch {
        return
    }
}

function $0(e, t, n, r, o, s) {
    if (F0(t) || ["mark", "measure"].includes(t.entryType) && it(t.name, s)) return;
    const i = to(!1),
        a = be(i ? i.requestStart : 0),
        c = o + Math.max(n, a),
        u = o + n,
        d = u + r,
        l = {
            [G]: "auto.resource.browser.metrics"
        };
    c !== u && (l["sentry.browser.measure_happened_before_request"] = !0, l["sentry.browser.measure_start_time"] = c), B0(l, t), c <= d && nn(e, c, d, {
        name: t.name,
        op: t.entryType,
        attributes: l
    })
}

function B0(e, t) {
    try {
        const n = t.detail;
        if (!n) return;
        if (typeof n == "object") {
            for (const [r, o] of Object.entries(n))
                if (o && Zt(o)) e[`sentry.browser.measure.detail.${r}`] = o;
                else if (o !== void 0) try {
                e[`sentry.browser.measure.detail.${r}`] = JSON.stringify(o)
            } catch {}
            return
        }
        if (Zt(n)) {
            e["sentry.browser.measure.detail"] = n;
            return
        }
        try {
            e["sentry.browser.measure.detail"] = JSON.stringify(n)
        } catch {}
    } catch {}
}

function U0(e, t, n) {
    ["unloadEvent", "redirect", "domContentLoadedEvent", "loadEvent", "connect"].forEach(r => {
        To(e, t, r, n)
    }), To(e, t, "secureConnection", n, "TLS/SSL"), To(e, t, "fetch", n, "cache"), To(e, t, "domainLookup", n, "DNS"), W0(e, t, n)
}

function To(e, t, n, r, o = n) {
    const s = H0(n),
        i = t[s],
        a = t[`${n}Start`];
    !a || !i || nn(e, r + be(a), r + be(i), {
        op: `browser.${o}`,
        name: t.name,
        attributes: {
            [G]: "auto.ui.browser.metrics",
            ...n === "redirect" && t.redirectCount != null ? {
                "http.redirect_count": t.redirectCount
            } : {}
        }
    })
}

function H0(e) {
    return e === "secureConnection" ? "connectEnd" : e === "fetch" ? "domainLookupStart" : `${e}End`
}

function W0(e, t, n) {
    const r = n + be(t.requestStart),
        o = n + be(t.responseEnd),
        s = n + be(t.responseStart);
    t.responseEnd && (nn(e, r, o, {
        op: "browser.request",
        name: t.name,
        attributes: {
            [G]: "auto.ui.browser.metrics"
        }
    }), nn(e, s, o, {
        op: "browser.response",
        name: t.name,
        attributes: {
            [G]: "auto.ui.browser.metrics"
        }
    }))
}

function j0(e, t, n, r, o, s, i) {
    if (t.initiatorType === "xmlhttprequest" || t.initiatorType === "fetch") return;
    const a = t.initiatorType ? `resource.${t.initiatorType}` : "resource.other";
    if (i ?.includes(a)) return;
    const c = {
            [G]: "auto.resource.browser.metrics"
        },
        u = Tn(n);
    u.protocol && (c["url.scheme"] = u.protocol.split(":").pop()), u.host && (c["server.address"] = u.host), c["url.same_origin"] = n.includes(q.location.origin), G0(t, c, [
        ["responseStatus", "http.response.status_code"],
        ["transferSize", "http.response_transfer_size"],
        ["encodedBodySize", "http.response_content_length"],
        ["decodedBodySize", "http.decoded_response_content_length"],
        ["renderBlockingStatus", "resource.render_blocking_status"],
        ["deliveryType", "http.response_delivery_type"]
    ]);
    const d = { ...c,
            ...Jp(t)
        },
        l = s + r,
        f = l + o;
    nn(e, l, f, {
        name: n.replace(q.location.origin, ""),
        op: a,
        attributes: d
    })
}

function z0(e) {
    const t = q.navigator;
    if (!t) return;
    const n = t.connection;
    n && (n.effectiveType && e.setAttribute("effectiveConnectionType", n.effectiveType), n.type && e.setAttribute("connectionType", n.type), Bi(n.rtt) && (rt["connection.rtt"] = {
        value: n.rtt,
        unit: "millisecond"
    })), Bi(t.deviceMemory) && e.setAttribute("deviceMemory", `${t.deviceMemory} GB`), Bi(t.hardwareConcurrency) && e.setAttribute("hardwareConcurrency", String(t.hardwareConcurrency))
}

function q0(e, t) {
    Ue && t.recordLcpOnPageloadSpan && (Ue.element && e.setAttribute("lcp.element", je(Ue.element)), Ue.id && e.setAttribute("lcp.id", Ue.id), Ue.url && e.setAttribute("lcp.url", Ue.url.trim().slice(0, 200)), Ue.loadTime != null && e.setAttribute("lcp.loadTime", Ue.loadTime), Ue.renderTime != null && e.setAttribute("lcp.renderTime", Ue.renderTime), e.setAttribute("lcp.size", Ue.size)), vs ?.sources && t.recordClsOnPageloadSpan && vs.sources.forEach((n, r) => e.setAttribute(`cls.source.${r+1}`, je(n.node)))
}

function G0(e, t, n) {
    n.forEach(([r, o]) => {
        const s = e[r];
        s != null && (typeof s == "number" && s < C0 || typeof s == "string") && (t[o] = s)
    })
}

function V0(e) {
    const t = to(!1);
    if (!t) return;
    const {
        responseStart: n,
        requestStart: r
    } = t;
    r <= n && (e["ttfb.requestTime"] = {
        value: n - r,
        unit: "millisecond"
    })
}

function J0() {
    return so() && Oe() ? On("element", K0) : () => {}
}
const K0 = ({
        entries: e
    }) => {
        const t = Ee(),
            n = t ? Se(t) : void 0,
            r = n ? F(n).description : j().getScopeData().transactionName;
        e.forEach(o => {
            const s = o;
            if (!s.identifier) return;
            const i = s.name,
                a = s.renderTime,
                c = s.loadTime,
                [u, d] = c ? [be(c), "load-time"] : a ? [be(a), "render-time"] : [he(), "entry-emission"],
                l = i === "image-paint" ? be(Math.max(0, (a ?? 0) - (c ?? 0))) : 0,
                f = {
                    [G]: "auto.ui.browser.elementtiming",
                    [pe]: "ui.elementtiming",
                    [ae]: "component",
                    "sentry.span_start_time_source": d,
                    "sentry.transaction_name": r,
                    "element.id": s.id,
                    "element.type": s.element ?.tagName ?.toLowerCase() || "unknown",
                    "element.size": s.naturalWidth && s.naturalHeight ? `${s.naturalWidth}x${s.naturalHeight}` : void 0,
                    "element.render_time": a,
                    "element.load_time": c,
                    "element.url": s.url || void 0,
                    "element.identifier": s.identifier,
                    "element.paint_type": i
                };
            ln({
                name: `element[${s.identifier}]`,
                attributes: f,
                startTime: u,
                onlyIfParent: !0
            }, p => {
                p.end(u + l)
            })
        })
    },
    Y0 = 1e3;
let Ol, Ea, va;

function Kp(e) {
    sn("dom", e), an("dom", X0)
}

function X0() {
    if (!q.document) return;
    const e = Qe.bind(null, "dom"),
        t = Pl(e, !0);
    q.document.addEventListener("click", t, !1), q.document.addEventListener("keypress", t, !1), ["EventTarget", "Node"].forEach(n => {
        const o = q[n] ?.prototype;
        o ?.hasOwnProperty ?.("addEventListener") && (xe(o, "addEventListener", function(s) {
            return function(i, a, c) {
                if (i === "click" || i == "keypress") try {
                    const u = this.__sentry_instrumentation_handlers__ = this.__sentry_instrumentation_handlers__ || {},
                        d = u[i] = u[i] || {
                            refCount: 0
                        };
                    if (!d.handler) {
                        const l = Pl(e);
                        d.handler = l, s.call(this, i, l, c)
                    }
                    d.refCount++
                } catch {}
                return s.call(this, i, a, c)
            }
        }), xe(o, "removeEventListener", function(s) {
            return function(i, a, c) {
                if (i === "click" || i == "keypress") try {
                    const u = this.__sentry_instrumentation_handlers__ || {},
                        d = u[i];
                    d && (d.refCount--, d.refCount <= 0 && (s.call(this, i, d.handler, c), d.handler = void 0, delete u[i]), Object.keys(u).length === 0 && delete this.__sentry_instrumentation_handlers__)
                } catch {}
                return s.call(this, i, a, c)
            }
        }))
    })
}

function Q0(e) {
    if (e.type !== Ea) return !1;
    try {
        if (!e.target || e.target._sentryId !== va) return !1
    } catch {}
    return !0
}

function Z0(e, t) {
    return e !== "keypress" ? !1 : t ?.tagName ? !(t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) : !0
}

function Pl(e, t = !1) {
    return n => {
        if (!n || n._sentryCaptured) return;
        const r = eI(n);
        if (Z0(n.type, r)) return;
        we(n, "_sentryCaptured", !0), r && !r._sentryId && we(r, "_sentryId", Ie());
        const o = n.type === "keypress" ? "input" : n.type;
        Q0(n) || (e({
            event: n,
            name: o,
            global: t
        }), Ea = n.type, va = r ? r._sentryId : void 0), clearTimeout(Ol), Ol = q.setTimeout(() => {
            va = void 0, Ea = void 0
        }, Y0)
    }
}

function eI(e) {
    try {
        return e.target
    } catch {
        return null
    }
}
let Io;

function ri(e) {
    const t = "history";
    sn(t, e), an(t, tI)
}

function tI() {
    if (q.addEventListener("popstate", () => {
            const t = q.location.href,
                n = Io;
            if (Io = t, n === t) return;
            Qe("history", {
                from: n,
                to: t
            })
        }), !av()) return;

    function e(t) {
        return function(...n) {
            const r = n.length > 2 ? n[2] : void 0;
            if (r) {
                const o = Io,
                    s = nI(String(r));
                if (Io = s, o === s) return t.apply(this, n);
                Qe("history", {
                    from: o,
                    to: s
                })
            }
            return t.apply(this, n)
        }
    }
    xe(q.history, "pushState", e), xe(q.history, "replaceState", e)
}

function nI(e) {
    try {
        return new URL(e, q.location.origin).toString()
    } catch {
        return e
    }
}
const Jo = {};

function Nc(e) {
    const t = Jo[e];
    if (t) return t;
    let n = q[e];
    if (fa(n)) return Jo[e] = n.bind(q);
    const r = q.document;
    if (r && typeof r.createElement == "function") try {
        const o = r.createElement("iframe");
        o.hidden = !0, r.head.appendChild(o);
        const s = o.contentWindow;
        s ?.[e] && (n = s[e]), r.head.removeChild(o)
    } catch (o) {
        Nn && g.warn(`Could not create sandbox iframe for ${e} check, bailing to window.${e}: `, o)
    }
    return n && (Jo[e] = n.bind(q))
}

function rI(e) {
    Jo[e] = void 0
}

function io(...e) {
    return Nc("setTimeout")(...e)
}
const wt = "__sentry_xhr_v3__";

function Oc(e) {
    sn("xhr", e), an("xhr", oI)
}

function oI() {
    if (!q.XMLHttpRequest) return;
    const e = XMLHttpRequest.prototype;
    e.open = new Proxy(e.open, {
        apply(t, n, r) {
            const o = new Error,
                s = he() * 1e3,
                i = st(r[0]) ? r[0].toUpperCase() : void 0,
                a = sI(r[1]);
            if (!i || !a) return t.apply(n, r);
            n[wt] = {
                method: i,
                url: a,
                request_headers: {}
            }, i === "POST" && a.match(/sentry_key/) && (n.__sentry_own_request__ = !0);
            const c = () => {
                const u = n[wt];
                if (u && n.readyState === 4) {
                    try {
                        u.status_code = n.status
                    } catch {}
                    const d = {
                        endTimestamp: he() * 1e3,
                        startTimestamp: s,
                        xhr: n,
                        virtualError: o
                    };
                    Qe("xhr", d)
                }
            };
            return "onreadystatechange" in n && typeof n.onreadystatechange == "function" ? n.onreadystatechange = new Proxy(n.onreadystatechange, {
                apply(u, d, l) {
                    return c(), u.apply(d, l)
                }
            }) : n.addEventListener("readystatechange", c), n.setRequestHeader = new Proxy(n.setRequestHeader, {
                apply(u, d, l) {
                    const [f, p] = l, h = d[wt];
                    return h && st(f) && st(p) && (h.request_headers[f.toLowerCase()] = p), u.apply(d, l)
                }
            }), t.apply(n, r)
        }
    }), e.send = new Proxy(e.send, {
        apply(t, n, r) {
            const o = n[wt];
            if (!o) return t.apply(n, r);
            r[0] !== void 0 && (o.body = r[0]);
            const s = {
                startTimestamp: he() * 1e3,
                xhr: n
            };
            return Qe("xhr", s), t.apply(n, r)
        }
    })
}

function sI(e) {
    if (st(e)) return e;
    try {
        return e.toString()
    } catch {}
}
const iI = Symbol.for("sentry__originalRequestBody");

function Yp(e) {
    return new URLSearchParams(e).toString()
}

function Ts(e, t = g) {
    try {
        if (typeof e == "string") return [e];
        if (e instanceof URLSearchParams) return [e.toString()];
        if (e instanceof FormData) return [Yp(e)];
        if (!e) return [void 0]
    } catch (n) {
        return Nn && t.error(n, "Failed to serialize body", e), [void 0, "BODY_PARSE_ERROR"]
    }
    return Nn && t.log("Skipping network body because of body type", e), [void 0, "UNPARSEABLE_BODY_TYPE"]
}

function Pc(e = []) {
    if (e.length >= 2 && e[1] && typeof e[1] == "object" && "body" in e[1]) return e[1].body;
    if (e.length >= 1 && e[0] instanceof Request) {
        const n = e[0][iI];
        return n !== void 0 ? n : void 0
    }
}

function Xp(e) {
    let t;
    try {
        t = e.getAllResponseHeaders()
    } catch (n) {
        return Nn && g.error(n, "Failed to get xhr response headers", e), {}
    }
    return t ? t.split(`\r
`).reduce((n, r) => {
        const [o, s] = r.split(": ");
        return s && (n[o.toLowerCase()] = s), n
    }, {}) : {}
}
const Ui = [],
    Ko = new Map,
    Bn = new Map,
    aI = 60;

function cI() {
    if (so() && Oe()) {
        const t = uI();
        return () => {
            t()
        }
    }
    return () => {}
}
const Ta = {
    click: "click",
    pointerdown: "click",
    pointerup: "click",
    mousedown: "click",
    mouseup: "click",
    touchstart: "click",
    touchend: "click",
    mouseover: "hover",
    mouseout: "hover",
    mouseenter: "hover",
    mouseleave: "hover",
    pointerover: "hover",
    pointerout: "hover",
    pointerenter: "hover",
    pointerleave: "hover",
    dragstart: "drag",
    dragend: "drag",
    drag: "drag",
    dragenter: "drag",
    dragleave: "drag",
    dragover: "drag",
    drop: "drag",
    keydown: "press",
    keyup: "press",
    keypress: "press",
    input: "press"
};

function uI() {
    return jp(lI)
}
const lI = ({
    metric: e
}) => {
    if (e.value == null) return;
    const t = be(e.value);
    if (t > aI) return;
    const n = e.entries.find(h => h.duration === e.value && Ta[h.name]);
    if (!n) return;
    const {
        interactionId: r
    } = n, o = Ta[n.name], s = be(Oe() + n.startTime), i = Ee(), a = i ? Se(i) : void 0, c = r != null ? Ko.get(r) : void 0, u = c ?.span || a, d = u ? F(u).description : j().getScopeData().transactionName, l = c ?.elementName || je(n.target), f = {
        [G]: "auto.http.browser.inp",
        [pe]: `ui.interaction.${o}`,
        [gr]: n.duration
    }, p = Mc({
        name: l,
        transaction: d,
        attributes: f,
        startTime: s
    });
    p && (p.addEvent("inp", {
        [Vr]: "millisecond",
        [Jr]: e.value
    }), p.end(s + t))
};

function dI() {
    const e = Object.keys(Ta);
    _s() && e.forEach(o => {
        q.addEventListener(o, t, {
            capture: !0,
            passive: !0
        })
    });

    function t(o) {
        const s = o.target;
        if (!s) return;
        const i = je(s),
            a = Math.round(o.timeStamp);
        if (Bn.set(a, i), Bn.size > 50) {
            const c = Bn.keys().next().value;
            c !== void 0 && Bn.delete(c)
        }
    }

    function n(o) {
        const s = Math.round(o.startTime);
        let i = Bn.get(s);
        if (!i)
            for (let a = -5; a <= 5; a++) {
                const c = Bn.get(s + a);
                if (c) {
                    i = c;
                    break
                }
            }
        return i || "<unknown>"
    }
    const r = ({
        entries: o
    }) => {
        const s = Ee(),
            i = s && Se(s);
        o.forEach(a => {
            if (!E0(a)) return;
            const c = a.interactionId;
            if (c == null || Ko.has(c)) return;
            const u = a.target ? je(a.target) : n(a);
            if (Ui.length > 10) {
                const d = Ui.shift();
                Ko.delete(d)
            }
            Ui.push(c), Ko.set(c, {
                span: i,
                elementName: u
            })
        })
    };
    On("event", r), On("first-input", r)
}
const fI = 40;

function Qp(e, t = Nc("fetch")) {
    let n = 0,
        r = 0;
    async function o(s) {
        const i = s.body.length;
        n += i, r++;
        const a = {
            body: s.body,
            method: "POST",
            referrerPolicy: "strict-origin",
            headers: e.headers,
            keepalive: n <= 6e4 && r < 15,
            ...e.fetchOptions
        };
        try {
            const c = await t(e.url, a);
            return {
                statusCode: c.status,
                headers: {
                    "x-sentry-rate-limits": c.headers.get("X-Sentry-Rate-Limits"),
                    "retry-after": c.headers.get("Retry-After")
                }
            }
        } catch (c) {
            throw rI("fetch"), c
        } finally {
            n -= i, r--
        }
    }
    return vy(e, o, oc(e.bufferSize || fI))
}
const I = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__;

function pI() {
    const e = C();
    if (!e) {
        I && g.warn("No Sentry client available, profiling is not started");
        return
    }
    if (!e.getIntegrationByName("BrowserProfiling")) {
        I && g.warn("BrowserProfiling integration is not available");
        return
    }
    e.emit("startUIProfiler")
}

function hI() {
    const e = C();
    if (!e) {
        I && g.warn("No Sentry client available, profiling is not started");
        return
    }
    if (!e.getIntegrationByName("BrowserProfiling")) {
        I && g.warn("ProfilingIntegration is not available");
        return
    }
    e.emit("stopUIProfiler")
}
const lM = {
        startProfiler: pI,
        stopProfiler: hI
    },
    mI = 10,
    gI = 20,
    _I = 30,
    yI = 40,
    SI = 50;

function cr(e, t, n, r) {
    const o = {
        filename: e,
        function: t === "<anonymous>" ? gt : t,
        in_app: !0
    };
    return n !== void 0 && (o.lineno = n), r !== void 0 && (o.colno = r), o
}
const bI = /^\s*at (\S+?)(?::(\d+))(?::(\d+))\s*$/i,
    EI = /^\s*at (?:(.+?\)(?: \[.+\])?|.*?) ?\((?:address at )?)?(?:async )?((?:<anonymous>|[-a-z]+:|.*bundle|\/)?.*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i,
    vI = /\((\S*)(?::(\d+))(?::(\d+))\)/,
    TI = /at (.+?) ?\(data:(.+?),/,
    II = e => {
        const t = e.match(TI);
        if (t) return {
            filename: `<data:${t[2]}>`,
            function: t[1]
        };
        const n = bI.exec(e);
        if (n) {
            const [, o, s, i] = n;
            return cr(o, gt, +s, +i)
        }
        const r = EI.exec(e);
        if (r) {
            if (r[2] && r[2].indexOf("eval") === 0) {
                const a = vI.exec(r[2]);
                a && (r[2] = a[1], r[3] = a[2], r[4] = a[3])
            }
            const [s, i] = Zp(r[1] || gt, r[2]);
            return cr(i, s, r[3] ? +r[3] : void 0, r[4] ? +r[4] : void 0)
        }
    },
    wI = [_I, II],
    kI = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)?((?:[-a-z]+)?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js)|\/[\w\-. /=]+)(?::(\d+))?(?::(\d+))?\s*$/i,
    RI = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i,
    CI = e => {
        const t = kI.exec(e);
        if (t) {
            if (t[3] && t[3].indexOf(" > eval") > -1) {
                const s = RI.exec(t[3]);
                s && (t[1] = t[1] || "eval", t[3] = s[1], t[4] = s[2], t[5] = "")
            }
            let r = t[3],
                o = t[1] || gt;
            return [o, r] = Zp(o, r), cr(r, o, t[4] ? +t[4] : void 0, t[5] ? +t[5] : void 0)
        }
    },
    AI = [SI, CI],
    xI = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:[-a-z]+):.*?):(\d+)(?::(\d+))?\)?\s*$/i,
    MI = e => {
        const t = xI.exec(e);
        return t ? cr(t[2], t[1] || gt, +t[3], t[4] ? +t[4] : void 0) : void 0
    },
    dM = [yI, MI],
    NI = / line (\d+).*script (?:in )?(\S+)(?:: in function (\S+))?$/i,
    OI = e => {
        const t = NI.exec(e);
        return t ? cr(t[2], t[3] || gt, +t[1]) : void 0
    },
    fM = [mI, OI],
    PI = / line (\d+), column (\d+)\s*(?:in (?:<anonymous function: ([^>]+)>|([^)]+))\(.*\))? in (.*):\s*$/i,
    LI = e => {
        const t = PI.exec(e);
        return t ? cr(t[5], t[3] || t[4] || gt, +t[1], +t[2]) : void 0
    },
    pM = [gI, LI],
    DI = [wI, AI],
    FI = Hd(...DI),
    Zp = (e, t) => {
        const n = e.indexOf("safari-extension") !== -1,
            r = e.indexOf("safari-web-extension") !== -1;
        return n || r ? [e.indexOf("@") !== -1 ? e.split("@")[0] : gt, n ? `safari-extension:${t}` : `safari-web-extension:${t}`] : [e, t]
    };

function hM(e, {
    metadata: t,
    tunnel: n,
    dsn: r
}) {
    const o = {
            event_id: e.event_id,
            sent_at: new Date().toISOString(),
            ...t ?.sdk && {
                sdk: {
                    name: t.sdk.name,
                    version: t.sdk.version
                }
            },
            ...!!n && !!r && {
                dsn: Lt(r)
            }
        },
        s = $I(e);
    return lt(o, [s])
}

function $I(e) {
    return [{
        type: "user_report"
    }, e]
}
const wo = 1024,
    BI = "Breadcrumbs",
    UI = ((e = {}) => {
        const t = {
            console: !0,
            dom: !0,
            fetch: !0,
            history: !0,
            sentry: !0,
            xhr: !0,
            ...e
        };
        return {
            name: BI,
            setup(n) {
                t.console && ac(zI(n)), t.dom && Kp(jI(n, t.dom)), t.xhr && Oc(qI(n)), t.fetch && _c(GI(n)), t.history && ri(VI(n)), t.sentry && n.on("beforeSendEvent", WI(n))
            }
        }
    }),
    HI = UI;

function WI(e) {
    return function(n) {
        C() === e && bt({
            category: `sentry.${n.type==="transaction"?"transaction":"event"}`,
            event_id: n.event_id,
            level: n.level,
            message: hn(n)
        }, {
            event: n
        })
    }
}

function jI(e, t) {
    return function(r) {
        if (C() !== e) return;
        let o, s, i = typeof t == "object" ? t.serializeAttribute : void 0,
            a = typeof t == "object" && typeof t.maxStringLength == "number" ? t.maxStringLength : void 0;
        a && a > wo && (I && g.warn(`\`dom.maxStringLength\` cannot exceed ${wo}, but a value of ${a} was configured. Sentry will use ${wo} instead.`), a = wo), typeof i == "string" && (i = [i]);
        try {
            const u = r.event,
                d = JI(u) ? u.target : u;
            o = je(d, {
                keyAttrs: i,
                maxStringLength: a
            }), s = Jd(d)
        } catch {
            o = "<unknown>"
        }
        if (o.length === 0) return;
        const c = {
            category: `ui.${r.name}`,
            message: o
        };
        s && (c.data = {
            "ui.component_name": s
        }), bt(c, {
            event: r.event,
            name: r.name,
            global: r.global
        })
    }
}

function zI(e) {
    return function(n) {
        if (C() !== e) return;
        const r = {
            category: "console",
            data: {
                arguments: n.args,
                logger: "console"
            },
            level: fs(n.level),
            message: rs(n.args, " ")
        };
        if (n.level === "assert")
            if (n.args[0] === !1) r.message = `Assertion failed: ${rs(n.args.slice(1)," ")||"console.assert"}`, r.data.arguments = n.args.slice(1);
            else return;
        bt(r, {
            input: n.args,
            level: n.level
        })
    }
}

function qI(e) {
    return function(n) {
        if (C() !== e) return;
        const {
            startTimestamp: r,
            endTimestamp: o
        } = n, s = n.xhr[wt];
        if (!r || !o || !s) return;
        const {
            method: i,
            url: a,
            status_code: c,
            body: u
        } = s, d = {
            method: i,
            url: a,
            status_code: c
        }, l = {
            xhr: n.xhr,
            input: u,
            startTimestamp: r,
            endTimestamp: o
        }, f = {
            category: "xhr",
            data: d,
            type: "http",
            level: mp(c)
        };
        e.emit("beforeOutgoingRequestBreadcrumb", f, l), bt(f, l)
    }
}

function GI(e) {
    return function(n) {
        if (C() !== e) return;
        const {
            startTimestamp: r,
            endTimestamp: o
        } = n;
        if (o && !(n.fetchData.url.match(/sentry_key/) && n.fetchData.method === "POST"))
            if (n.fetchData.method, n.fetchData.url, n.error) {
                const s = n.fetchData,
                    i = {
                        data: n.error,
                        input: n.args,
                        startTimestamp: r,
                        endTimestamp: o
                    },
                    a = {
                        category: "fetch",
                        data: s,
                        level: "error",
                        type: "http"
                    };
                e.emit("beforeOutgoingRequestBreadcrumb", a, i), bt(a, i)
            } else {
                const s = n.response,
                    i = { ...n.fetchData,
                        status_code: s ?.status
                    };
                n.fetchData.request_body_size, n.fetchData.response_body_size, s ?.status;
                const a = {
                        input: n.args,
                        response: s,
                        startTimestamp: r,
                        endTimestamp: o
                    },
                    c = {
                        category: "fetch",
                        data: i,
                        type: "http",
                        level: mp(i.status_code)
                    };
                e.emit("beforeOutgoingRequestBreadcrumb", c, a), bt(c, a)
            }
    }
}

function VI(e) {
    return function(n) {
        if (C() !== e) return;
        let r = n.from,
            o = n.to;
        const s = Tn(M.location.href);
        let i = r ? Tn(r) : void 0;
        const a = Tn(o);
        i ?.path || (i = s), s.protocol === a.protocol && s.host === a.host && (o = a.relative), s.protocol === i.protocol && s.host === i.host && (r = i.relative), bt({
            category: "navigation",
            data: {
                from: r,
                to: o
            }
        })
    }
}

function JI(e) {
    return !!e && !!e.target
}
const KI = ["EventTarget", "Window", "Node", "ApplicationCache", "AudioTrackList", "BroadcastChannel", "ChannelMergerNode", "CryptoOperation", "EventSource", "FileReader", "HTMLUnknownElement", "IDBDatabase", "IDBRequest", "IDBTransaction", "KeyOperation", "MediaController", "MessagePort", "ModalWindow", "Notification", "SVGElementInstance", "Screen", "SharedWorker", "TextTrack", "TextTrackCue", "TextTrackList", "WebSocket", "WebSocketWorker", "Worker", "XMLHttpRequest", "XMLHttpRequestEventTarget", "XMLHttpRequestUpload"],
    YI = "BrowserApiErrors",
    XI = ((e = {}) => {
        const t = {
            XMLHttpRequest: !0,
            eventTarget: !0,
            requestAnimationFrame: !0,
            setInterval: !0,
            setTimeout: !0,
            unregisterOriginalCallbacks: !1,
            ...e
        };
        return {
            name: YI,
            setupOnce() {
                t.setTimeout && xe(M, "setTimeout", Ll), t.setInterval && xe(M, "setInterval", Ll), t.requestAnimationFrame && xe(M, "requestAnimationFrame", ZI), t.XMLHttpRequest && "XMLHttpRequest" in M && xe(XMLHttpRequest.prototype, "send", ew);
                const n = t.eventTarget;
                n && (Array.isArray(n) ? n : KI).forEach(o => tw(o, t))
            }
        }
    }),
    QI = XI;

function Ll(e) {
    return function(...t) {
        const n = t[0];
        return t[0] = ar(n, {
            mechanism: {
                handled: !1,
                type: `auto.browser.browserapierrors.${At(e)}`
            }
        }), e.apply(this, t)
    }
}

function ZI(e) {
    return function(t) {
        return e.apply(this, [ar(t, {
            mechanism: {
                data: {
                    handler: At(e)
                },
                handled: !1,
                type: "auto.browser.browserapierrors.requestAnimationFrame"
            }
        })])
    }
}

function ew(e) {
    return function(...t) {
        const n = this;
        return ["onload", "onerror", "onprogress", "onreadystatechange"].forEach(o => {
            o in n && typeof n[o] == "function" && xe(n, o, function(s) {
                const i = {
                        mechanism: {
                            data: {
                                handler: At(s)
                            },
                            handled: !1,
                            type: `auto.browser.browserapierrors.xhr.${o}`
                        }
                    },
                    a = Wa(s);
                return a && (i.mechanism.data.handler = At(a)), ar(s, i)
            })
        }), e.apply(this, t)
    }
}

function tw(e, t) {
    const r = M[e] ?.prototype;
    r ?.hasOwnProperty ?.("addEventListener") && (xe(r, "addEventListener", function(o) {
        return function(s, i, a) {
            try {
                nw(i) && (i.handleEvent = ar(i.handleEvent, {
                    mechanism: {
                        data: {
                            handler: At(i),
                            target: e
                        },
                        handled: !1,
                        type: "auto.browser.browserapierrors.handleEvent"
                    }
                }))
            } catch {}
            return t.unregisterOriginalCallbacks && rw(this, s, i), o.apply(this, [s, ar(i, {
                mechanism: {
                    data: {
                        handler: At(i),
                        target: e
                    },
                    handled: !1,
                    type: "auto.browser.browserapierrors.addEventListener"
                }
            }), a])
        }
    }), xe(r, "removeEventListener", function(o) {
        return function(s, i, a) {
            try {
                const c = i.__sentry_wrapped__;
                c && o.call(this, s, c, a)
            } catch {}
            return o.call(this, s, i, a)
        }
    }))
}

function nw(e) {
    return typeof e.handleEvent == "function"
}

function rw(e, t, n) {
    e && typeof e == "object" && "removeEventListener" in e && typeof e.removeEventListener == "function" && e.removeEventListener(t, n)
}
const ow = () => ({
        name: "BrowserSession",
        setupOnce() {
            if (typeof M.document > "u") {
                I && g.warn("Using the `browserSessionIntegration` in non-browser environments is not supported.");
                return
            }
            Au({
                ignoreDuration: !0
            }), xu(), ri(({
                from: e,
                to: t
            }) => {
                e !== void 0 && e !== t && (Au({
                    ignoreDuration: !0
                }), xu())
            })
        }
    }),
    sw = "GlobalHandlers",
    iw = ((e = {}) => {
        const t = {
            onerror: !0,
            onunhandledrejection: !0,
            ...e
        };
        return {
            name: sw,
            setupOnce() {
                Error.stackTraceLimit = 50
            },
            setup(n) {
                t.onerror && (cw(n), Dl("onerror")), t.onunhandledrejection && (uw(n), Dl("onunhandledrejection"))
            }
        }
    }),
    aw = iw;

function cw(e) {
    jd(t => {
        const {
            stackParser: n,
            attachStacktrace: r
        } = nh();
        if (C() !== e || Mp()) return;
        const {
            msg: o,
            url: s,
            line: i,
            column: a,
            error: c
        } = t, u = lw(ei(n, c || o, void 0, r, !1), s, i, a);
        u.level = "error", Yr(u, {
            originalException: c,
            mechanism: {
                handled: !1,
                type: "auto.browser.global_handlers.onerror"
            }
        })
    })
}

function uw(e) {
    zd(t => {
        const {
            stackParser: n,
            attachStacktrace: r
        } = nh();
        if (C() !== e || Mp()) return;
        const o = eh(t),
            s = Zt(o) ? th(o) : ei(n, o, void 0, r, !0);
        s.level = "error", Yr(s, {
            originalException: o,
            mechanism: {
                handled: !1,
                type: "auto.browser.global_handlers.onunhandledrejection"
            }
        })
    })
}

function eh(e) {
    if (Zt(e)) return e;
    try {
        if ("reason" in e) return e.reason;
        if ("detail" in e && "reason" in e.detail) return e.detail.reason
    } catch {}
    return e
}

function th(e) {
    return {
        exception: {
            values: [{
                type: "UnhandledRejection",
                value: `Non-Error promise rejection captured with value: ${String(e)}`
            }]
        }
    }
}

function lw(e, t, n, r) {
    const o = e.exception = e.exception || {},
        s = o.values = o.values || [],
        i = s[0] = s[0] || {},
        a = i.stacktrace = i.stacktrace || {},
        c = a.frames = a.frames || [],
        u = r,
        d = n,
        l = dw(t) ?? Ln();
    return c.length === 0 && c.push({
        colno: u,
        filename: l,
        function: gt,
        in_app: !0,
        lineno: d
    }), e
}

function Dl(e) {
    I && g.log(`Global Handler attached: ${e}`)
}

function nh() {
    return C() ?.getOptions() || {
        stackParser: () => [],
        attachStacktrace: !1
    }
}

function dw(e) {
    if (!(!st(e) || e.length === 0)) {
        if (e.startsWith("data:")) {
            const t = e.match(/^data:([^;]+)/),
                n = t ? t[1] : "text/javascript",
                r = e.includes("base64,");
            return `<data:${n}${r?",base64":""}>`
        }
        return e
    }
}
const fw = () => ({
        name: "HttpContext",
        preprocessEvent(e) {
            if (!M.navigator && !M.location && !M.document) return;
            const t = Tc(),
                n = { ...t.headers,
                    ...e.request ?.headers
                };
            e.request = { ...t,
                ...e.request,
                headers: n
            }
        }
    }),
    pw = "cause",
    hw = 5,
    mw = "LinkedErrors",
    gw = ((e = {}) => {
        const t = e.limit || hw,
            n = e.key || pw;
        return {
            name: mw,
            preprocessEvent(r, o, s) {
                const i = s.getOptions();
                uS(Ic, i.stackParser, n, t, r, o)
            }
        }
    }),
    _w = gw,
    yw = "SpotlightBrowser",
    Sw = ((e = {}) => {
        const t = e.sidecarUrl || "http://localhost:8969/stream";
        return {
            name: yw,
            setup: () => {
                I && g.log("Using Sidecar URL", t)
            },
            processEvent: n => Ew(n) ? null : n,
            afterAllSetup: n => {
                bw(n, t)
            }
        }
    });

function bw(e, t) {
    const n = Nc("fetch");
    let r = 0;
    e.on("beforeEnvelope", o => {
        if (r > 3) {
            g.warn("[Spotlight] Disabled Sentry -> Spotlight integration due to too many failed requests:", r);
            return
        }
        n(t, {
            method: "POST",
            body: cs(o),
            headers: {
                "Content-Type": "application/x-sentry-envelope"
            },
            mode: "cors"
        }).then(s => {
            s.status >= 200 && s.status < 400 && (r = 0)
        }, s => {
            r++, g.error("Sentry SDK can't connect to Sidecar is it running? See: https://spotlightjs.com/sidecar/npx/", s)
        })
    })
}
const mM = Sw;

function Ew(e) {
    return !!(e.type === "transaction" && e.spans && e.contexts ?.trace && e.contexts.trace.op === "ui.action.click" && e.spans.some(({
        description: t
    }) => t ?.includes("#sentry-spotlight")))
}

function vw() {
    return Tw() ? (I && on(() => {
        console.error("[Sentry] You cannot use Sentry.init() in a browser extension, see: https://docs.sentry.io/platforms/javascript/best-practices/browser-extensions/")
    }), !0) : !1
}

function Tw() {
    if (typeof M.window > "u") return !1;
    const e = M;
    if (e.nw || !(e.chrome || e.browser) ?.runtime ?.id) return !1;
    const n = Ln(),
        r = ["chrome-extension", "moz-extension", "ms-browser-extension", "safari-web-extension"];
    return !(M === M.top && r.some(s => n.startsWith(`${s}://`)))
}

function Iw(e) {
    return [tS(), Xy(), QI(), HI(), aw(), _w(), yS(), fw(), ow()]
}

function ww(e = {}) {
    const t = !e.skipBrowserExtensionCheck && vw();
    let n = e.defaultIntegrations == null ? Iw() : e.defaultIntegrations;
    const r = { ...e,
        enabled: t ? !1 : e.enabled,
        stackParser: Jm(e.stackParser || FI),
        integrations: ey({
            integrations: e.integrations,
            defaultIntegrations: n
        }),
        transport: e.transport || Qp
    };
    return Ny(JT, r)
}

function gM() {}

function _M(e) {
    e()
}

function Fl(e = {}) {
    const t = M.document,
        n = t ?.head || t ?.body;
    if (!n) {
        I && g.error("[showReportDialog] Global document not defined");
        return
    }
    const r = j(),
        s = C() ?.getDsn();
    if (!s) {
        I && g.error("[showReportDialog] DSN not configured");
        return
    }
    const i = { ...e,
            user: { ...r.getUser(),
                ...e.user
            },
            eventId: e.eventId || G_()
        },
        a = M.document.createElement("script");
    a.async = !0, a.crossOrigin = "anonymous", a.src = Q_(s, i);
    const {
        onLoad: c,
        onClose: u
    } = i;
    if (c && (a.onload = c), u) {
        const d = l => {
            if (l.data === "__sentry_reportdialog_closed__") try {
                u()
            } finally {
                M.removeEventListener("message", d)
            }
        };
        M.addEventListener("message", d)
    }
    n.appendChild(a)
}
const kw = $,
    Rw = "ReportingObserver",
    $l = new WeakMap,
    Cw = ((e = {}) => {
        const t = e.types || ["crash", "deprecation", "intervention"];

        function n(r) {
            if ($l.has(C()))
                for (const o of r) Ke(s => {
                    s.setExtra("url", o.url);
                    const i = `ReportingObserver [${o.type}]`;
                    let a = "No details available";
                    if (o.body) {
                        const c = {};
                        for (const u in o.body) c[u] = o.body[u];
                        if (s.setExtra("body", c), o.type === "crash") {
                            const u = o.body;
                            a = [u.crashId || "", u.reason || ""].join(" ").trim() || a
                        } else a = o.body.message || a
                    }
                    q_(`${i}: ${a}`)
                })
        }
        return {
            name: Rw,
            setupOnce() {
                if (!uv()) return;
                new kw.ReportingObserver(n, {
                    buffered: !0,
                    types: t
                }).observe()
            },
            setup(r) {
                $l.set(r, !0)
            }
        }
    }),
    yM = Cw,
    Aw = "HttpClient",
    xw = ((e = {}) => {
        const t = {
            failedRequestStatusCodes: [
                [500, 599]
            ],
            failedRequestTargets: [/.*/],
            ...e
        };
        return {
            name: Aw,
            setup(n) {
                $w(n, t), Bw(n, t)
            }
        }
    }),
    SM = xw;

function Mw(e, t, n, r, o) {
    if (oh(e, n.status, n.url)) {
        const s = Uw(t, r);
        let i, a, c, u;
        ih() && ([i, c] = Bl("Cookie", s), [a, u] = Bl("Set-Cookie", n));
        const d = sh({
            url: s.url,
            method: s.method,
            status: n.status,
            requestHeaders: i,
            responseHeaders: a,
            requestCookies: c,
            responseCookies: u,
            error: o,
            type: "fetch"
        });
        Yr(d)
    }
}

function Bl(e, t) {
    const n = Pw(t.headers);
    let r;
    try {
        const o = n[e] || n[e.toLowerCase()] || void 0;
        o && (r = rh(o))
    } catch {}
    return [n, r]
}

function Nw(e, t, n, r, o) {
    if (oh(e, t.status, t.responseURL)) {
        let s, i, a;
        if (ih()) {
            try {
                const u = t.getResponseHeader("Set-Cookie") || t.getResponseHeader("set-cookie") || void 0;
                u && (i = rh(u))
            } catch {}
            try {
                a = Lw(t)
            } catch {}
            s = r
        }
        const c = sh({
            url: t.responseURL,
            method: n,
            status: t.status,
            requestHeaders: s,
            responseHeaders: a,
            responseCookies: i,
            error: o,
            type: "xhr"
        });
        Yr(c)
    }
}

function Ow(e) {
    if (e) {
        const t = e["Content-Length"] || e["content-length"];
        if (t) return parseInt(t, 10)
    }
}

function rh(e) {
    return e.split("; ").reduce((t, n) => {
        const [r, o] = n.split("=");
        return r && o && (t[r] = o), t
    }, {})
}

function Pw(e) {
    const t = {};
    return e.forEach((n, r) => {
        t[r] = n
    }), t
}

function Lw(e) {
    const t = e.getAllResponseHeaders();
    return t ? t.split(`\r
`).reduce((n, r) => {
        const [o, s] = r.split(": ");
        return o && s && (n[o] = s), n
    }, {}) : {}
}

function Dw(e, t) {
    return e.some(n => typeof n == "string" ? t.includes(n) : n.test(t))
}

function Fw(e, t) {
    return e.some(n => typeof n == "number" ? n === t : t >= n[0] && t <= n[1])
}

function $w(e, t) {
    gp() && _c(n => {
        if (C() !== e) return;
        const {
            response: r,
            args: o,
            error: s,
            virtualError: i
        } = n, [a, c] = o;
        r && Mw(t, a, r, c, s || i)
    }, !1)
}

function Bw(e, t) {
    "XMLHttpRequest" in $ && Oc(n => {
        if (C() !== e) return;
        const {
            error: r,
            virtualError: o
        } = n, s = n.xhr, i = s[wt];
        if (!i) return;
        const {
            method: a,
            request_headers: c
        } = i;
        try {
            Nw(t, s, a, c, r || o)
        } catch (u) {
            I && g.warn("Error while extracting response event form XHR response", u)
        }
    })
}

function oh(e, t, n) {
    return Fw(e.failedRequestStatusCodes, t) && Dw(e.failedRequestTargets, n) && !Gf(n, C())
}

function sh(e) {
    const t = C(),
        n = t && e.error && e.error instanceof Error ? e.error.stack : void 0,
        r = n && t ? t.getOptions().stackParser(n, 0, 1) : void 0,
        o = `HTTP Client Error with status code: ${e.status}`,
        s = {
            message: o,
            exception: {
                values: [{
                    type: "Error",
                    value: o,
                    stacktrace: r ? {
                        frames: r
                    } : void 0
                }]
            },
            request: {
                url: e.url,
                method: e.method,
                headers: e.requestHeaders,
                cookies: e.requestCookies
            },
            contexts: {
                response: {
                    status_code: e.status,
                    headers: e.responseHeaders,
                    cookies: e.responseCookies,
                    body_size: Ow(e.responseHeaders)
                }
            }
        };
    return Mt(s, {
        type: `auto.http.client.${e.type}`,
        handled: !1
    }), s
}

function Uw(e, t) {
    return !t && e instanceof Request || e instanceof Request && e.bodyUsed ? e : new Request(e, t)
}

function ih() {
    const e = C();
    return e ? !!e.getOptions().sendDefaultPii : !1
}
const Hi = $,
    Hw = 7,
    Ww = "ContextLines",
    jw = ((e = {}) => {
        const t = e.frameContextLines != null ? e.frameContextLines : Hw;
        return {
            name: Ww,
            processEvent(n) {
                return zw(n, t)
            }
        }
    }),
    bM = jw;

function zw(e, t) {
    const n = Hi.document,
        r = Hi.location && qf(Hi.location.href);
    if (!n || !r) return e;
    const o = e.exception ?.values;
    if (!o ?.length) return e;
    const s = n.documentElement.innerHTML;
    if (!s) return e;
    const i = ["<!DOCTYPE html>", "<html>", ...s.split(`
`), "</html>"];
    return o.forEach(a => {
        const c = a.stacktrace;
        c ?.frames && (c.frames = c.frames.map(u => qw(u, i, r, t)))
    }), e
}

function qw(e, t, n, r) {
    return e.filename !== n || !e.lineno || !t.length || ag(t, e, r), e
}
const Gw = "GraphQLClient",
    Vw = (e => ({
        name: Gw,
        setup(t) {
            Jw(t, e), Kw(t, e)
        }
    }));

function Jw(e, t) {
    e.on("beforeOutgoingRequestSpan", (n, r) => {
        const s = F(n).data || {};
        if (!(s[pe] === "http.client")) return;
        const c = s[vg] || s["http.url"],
            u = s[Eg] || s["http.method"];
        if (!st(c) || !st(u)) return;
        const {
            endpoints: d
        } = t, l = it(c, d), f = ch(r);
        if (l && f) {
            const p = uh(f);
            if (p) {
                const h = ah(p);
                n.updateName(`${u} ${c} (${h})`), oi(p) && n.setAttribute("graphql.document", p.query), si(p) && (n.setAttribute("graphql.persisted_query.hash.sha256", p.extensions.persistedQuery.sha256Hash), n.setAttribute("graphql.persisted_query.version", p.extensions.persistedQuery.version))
            }
        }
    })
}

function Kw(e, t) {
    e.on("beforeOutgoingRequestBreadcrumb", (n, r) => {
        const {
            category: o,
            type: s,
            data: i
        } = n;
        if (s === "http" && (o === "fetch" || o === "xhr")) {
            const d = i ?.url,
                {
                    endpoints: l
                } = t,
                f = it(d, l),
                p = ch(r);
            if (f && i && p) {
                const h = uh(p);
                if (!i.graphql && h) {
                    const m = ah(h);
                    i["graphql.operation"] = m, oi(h) && (i["graphql.document"] = h.query), si(h) && (i["graphql.persisted_query.hash.sha256"] = h.extensions.persistedQuery.sha256Hash, i["graphql.persisted_query.version"] = h.extensions.persistedQuery.version)
                }
            }
        }
    })
}

function ah(e) {
    if (si(e)) return `persisted ${e.operationName}`;
    if (oi(e)) {
        const {
            query: t,
            operationName: n
        } = e, {
            operationName: r = n,
            operationType: o
        } = Yw(t);
        return r ? `${o} ${r}` : `${o}`
    }
    return "unknown"
}

function ch(e) {
    const t = "xhr" in e;
    let n;
    if (t) {
        const r = e.xhr[wt];
        n = r && Ts(r.body)[0]
    } else {
        const r = Pc(e.input);
        n = Ts(r)[0]
    }
    return n
}

function Yw(e) {
    const t = /^(?:\s*)(query|mutation|subscription)(?:\s*)(\w+)(?:\s*)[{(]/,
        n = /^(?:\s*)(query|mutation|subscription)(?:\s*)[{(]/,
        r = e.match(t);
    if (r) return {
        operationType: r[1],
        operationName: r[2]
    };
    const o = e.match(n);
    return o ? {
        operationType: o[1],
        operationName: void 0
    } : {
        operationType: void 0,
        operationName: void 0
    }
}

function Yo(e) {
    return typeof e == "object" && e !== null
}

function oi(e) {
    return Yo(e) && typeof e.query == "string"
}

function si(e) {
    return Yo(e) && typeof e.operationName == "string" && Yo(e.extensions) && Yo(e.extensions.persistedQuery) && typeof e.extensions.persistedQuery.sha256Hash == "string" && typeof e.extensions.persistedQuery.version == "number"
}

function uh(e) {
    try {
        const t = JSON.parse(e);
        return oi(t) || si(t) ? t : void 0
    } catch {
        return
    }
}
const EM = Vw,
    fe = $,
    Lc = "sentryReplaySession",
    Xw = "replay_event",
    Dc = "Unable to send Replay",
    Qw = 3e5,
    Zw = 9e5,
    ek = 5e3,
    tk = 5500,
    nk = 6e4,
    rk = 5e3,
    ok = 3,
    Ul = 15e4,
    ko = 5e3,
    sk = 3e3,
    ik = 300,
    Fc = 2e7,
    ak = 4999,
    ck = 5e4,
    Hl = 36e5;
var uk = Object.defineProperty,
    lk = (e, t, n) => t in e ? uk(e, t, {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: n
    }) : e[t] = n,
    Wl = (e, t, n) => lk(e, typeof t != "symbol" ? t + "" : t, n),
    Te = (e => (e[e.Document = 0] = "Document", e[e.DocumentType = 1] = "DocumentType", e[e.Element = 2] = "Element", e[e.Text = 3] = "Text", e[e.CDATA = 4] = "CDATA", e[e.Comment = 5] = "Comment", e))(Te || {});

function dk(e) {
    return e.nodeType === e.ELEMENT_NODE
}

function Or(e) {
    return e ?.host ?.shadowRoot === e
}

function Pr(e) {
    return Object.prototype.toString.call(e) === "[object ShadowRoot]"
}

function fk(e) {
    return e.includes(" background-clip: text;") && !e.includes(" -webkit-background-clip: text;") && (e = e.replace(/\sbackground-clip:\s*text;/g, " -webkit-background-clip: text; background-clip: text;")), e
}

function pk(e) {
    const {
        cssText: t
    } = e;
    if (t.split('"').length < 3) return t;
    const n = ["@import", `url(${JSON.stringify(e.href)})`];
    return e.layerName === "" ? n.push("layer") : e.layerName && n.push(`layer(${e.layerName})`), e.supportsText && n.push(`supports(${e.supportsText})`), e.media.length && n.push(e.media.mediaText), n.join(" ") + ";"
}

function Is(e) {
    try {
        const t = e.rules || e.cssRules;
        return t ? fk(Array.from(t, lh).join("")) : null
    } catch {
        return null
    }
}

function hk(e) {
    let t = "";
    for (let n = 0; n < e.style.length; n++) {
        const r = e.style,
            o = r[n],
            s = r.getPropertyPriority(o);
        t += `${o}:${r.getPropertyValue(o)}${s?" !important":""};`
    }
    return `${e.selectorText} { ${t} }`
}

function lh(e) {
    let t;
    if (gk(e)) try {
        t = Is(e.styleSheet) || pk(e)
    } catch {} else if (_k(e)) {
        let n = e.cssText;
        const r = e.selectorText.includes(":"),
            o = typeof e.style.all == "string" && e.style.all;
        if (o && (n = hk(e)), r && (n = mk(n)), r || o) return n
    }
    return t || e.cssText
}

function mk(e) {
    const t = /(\[(?:[\w-]+)[^\\])(:(?:[\w-]+)\])/gm;
    return e.replace(t, "$1\\$2")
}

function gk(e) {
    return "styleSheet" in e
}

function _k(e) {
    return "selectorText" in e
}
let dh = class {
    constructor() {
        Wl(this, "idNodeMap", new Map), Wl(this, "nodeMetaMap", new WeakMap)
    }
    getId(t) {
        return t ? this.getMeta(t) ?.id ?? -1 : -1
    }
    getNode(t) {
        return this.idNodeMap.get(t) || null
    }
    getIds() {
        return Array.from(this.idNodeMap.keys())
    }
    getMeta(t) {
        return this.nodeMetaMap.get(t) || null
    }
    removeNodeFromMap(t) {
        const n = this.getId(t);
        this.idNodeMap.delete(n), t.childNodes && t.childNodes.forEach(r => this.removeNodeFromMap(r))
    }
    has(t) {
        return this.idNodeMap.has(t)
    }
    hasNode(t) {
        return this.nodeMetaMap.has(t)
    }
    add(t, n) {
        const r = n.id;
        this.idNodeMap.set(r, t), this.nodeMetaMap.set(t, n)
    }
    replace(t, n) {
        const r = this.getNode(t);
        if (r) {
            const o = this.nodeMetaMap.get(r);
            o && this.nodeMetaMap.set(n, o)
        }
        this.idNodeMap.set(t, n)
    }
    reset() {
        this.idNodeMap = new Map, this.nodeMetaMap = new WeakMap
    }
};

function yk() {
    return new dh
}

function ii({
    maskInputOptions: e,
    tagName: t,
    type: n
}) {
    return t === "OPTION" && (t = "SELECT"), !!(e[t.toLowerCase()] || n && e[n] || n === "password" || t === "INPUT" && !n && e.text)
}

function Ur({
    isMasked: e,
    element: t,
    value: n,
    maskInputFn: r
}) {
    let o = n || "";
    return e ? (r && (o = r(o, t)), "*".repeat(o.length)) : o
}

function ur(e) {
    return e.toLowerCase()
}

function Ia(e) {
    return e.toUpperCase()
}
const jl = "__rrweb_original__";

function Sk(e) {
    const t = e.getContext("2d");
    if (!t) return !0;
    const n = 50;
    for (let r = 0; r < e.width; r += n)
        for (let o = 0; o < e.height; o += n) {
            const s = t.getImageData,
                i = jl in s ? s[jl] : s;
            if (new Uint32Array(i.call(t, r, o, Math.min(n, e.width - r), Math.min(n, e.height - o)).data.buffer).some(c => c !== 0)) return !1
        }
    return !0
}

function $c(e) {
    const t = e.type;
    return e.hasAttribute("data-rr-is-password") ? "password" : t ? ur(t) : null
}

function ws(e, t, n) {
    return t === "INPUT" && (n === "radio" || n === "checkbox") ? e.getAttribute("value") || "" : e.value
}

function fh(e, t) {
    let n;
    try {
        n = new URL(e, t ?? window.location.href)
    } catch {
        return null
    }
    const r = /\.([0-9a-z]+)(?:$)/i;
    return n.pathname.match(r) ?.[1] ?? null
}
const zl = {};

function ph(e) {
    const t = zl[e];
    if (t) return t;
    const n = window.document;
    let r = window[e];
    if (n && typeof n.createElement == "function") try {
        const o = n.createElement("iframe");
        o.hidden = !0, n.head.appendChild(o);
        const s = o.contentWindow;
        s && s[e] && (r = s[e]), n.head.removeChild(o)
    } catch {}
    return zl[e] = r.bind(window)
}

function wa(...e) {
    return ph("setTimeout")(...e)
}

function hh(...e) {
    return ph("clearTimeout")(...e)
}

function mh(e) {
    try {
        return e.contentDocument
    } catch {}
}
let bk = 1;
const Ek = new RegExp("[^a-z0-9-_:]"),
    Hr = -2;

function Bc() {
    return bk++
}

function vk(e) {
    if (e instanceof HTMLFormElement) return "form";
    const t = ur(e.tagName);
    return Ek.test(t) ? "div" : t
}

function Tk(e) {
    let t = "";
    return e.indexOf("//") > -1 ? t = e.split("/").slice(0, 3).join("/") : t = e.split("/")[0], t = t.split("?")[0], t
}
let Un, ql;
const Ik = /url\((?:(')([^']*)'|(")(.*?)"|([^)]*))\)/gm,
    wk = /^(?:[a-z+]+:)?\/\//i,
    kk = /^www\..*/i,
    Rk = /^(data:)([^,]*),(.*)/i;

function Ck(e, t) {
    if (!e || t.size === 0) return e;
    try {
        const n = e.split(";"),
            r = [];
        for (let o of n) {
            if (o = o.trim(), !o) continue;
            const s = o.indexOf(":");
            if (s === -1) {
                r.push(o);
                continue
            }
            const i = o.slice(0, s).trim();
            t.has(i) || r.push(o)
        }
        return r.join("; ") + (r.length > 0 && e.endsWith(";") ? ";" : "")
    } catch (n) {
        return console.warn("Error filtering CSS properties:", n), e
    }
}

function ks(e, t) {
    return (e || "").replace(Ik, (n, r, o, s, i, a) => {
        const c = o || i || a,
            u = r || s || "";
        if (!c) return n;
        if (wk.test(c) || kk.test(c)) return `url(${u}${c}${u})`;
        if (Rk.test(c)) return `url(${u}${c}${u})`;
        if (c[0] === "/") return `url(${u}${Tk(t)+c}${u})`;
        const d = t.split("/"),
            l = c.split("/");
        d.pop();
        for (const f of l) f !== "." && (f === ".." ? d.pop() : d.push(f));
        return `url(${u}${d.join("/")}${u})`
    })
}
const Ak = /^[^ \t\n\r\u000c]+/,
    xk = /^[, \t\n\r\u000c]+/;

function Mk(e, t) {
    if (t.trim() === "") return t;
    let n = 0;

    function r(s) {
        let i;
        const a = s.exec(t.substring(n));
        return a ? (i = a[0], n += i.length, i) : ""
    }
    const o = [];
    for (; r(xk), !(n >= t.length);) {
        let s = r(Ak);
        if (s.slice(-1) === ",") s = zn(e, s.substring(0, s.length - 1)), o.push(s);
        else {
            let i = "";
            s = zn(e, s);
            let a = !1;
            for (;;) {
                const c = t.charAt(n);
                if (c === "") {
                    o.push((s + i).trim());
                    break
                } else if (a) c === ")" && (a = !1);
                else if (c === ",") {
                    n += 1, o.push((s + i).trim());
                    break
                } else c === "(" && (a = !0);
                i += c, n += 1
            }
        }
    }
    return o.join(", ")
}
const Gl = new WeakMap;

function zn(e, t) {
    return !t || t.trim() === "" ? t : ai(e, t)
}

function Nk(e) {
    return !!(e.tagName === "svg" || e.ownerSVGElement)
}

function ai(e, t) {
    let n = Gl.get(e);
    if (n || (n = e.createElement("a"), Gl.set(e, n)), !t) t = "";
    else if (t.startsWith("blob:") || t.startsWith("data:")) return t;
    return n.setAttribute("href", t), n.href
}

function gh(e, t, n, r, o, s, i) {
    if (!r) return r;
    if (n === "src" || n === "href" && !(t === "use" && r[0] === "#")) return zn(e, r);
    if (n === "xlink:href" && r[0] !== "#") return zn(e, r);
    if (n === "background" && (t === "table" || t === "td" || t === "th")) return zn(e, r);
    if (n === "srcset") return Mk(e, r);
    if (n === "style") {
        let a = ks(r, ai(e));
        return i && i.size > 0 && (a = Ck(a, i)), a
    } else if (t === "object" && n === "data") return zn(e, r);
    return typeof s == "function" ? s(n, r, o) : r
}

function _h(e, t, n) {
    return (e === "video" || e === "audio") && t === "autoplay"
}

function Ok(e, t, n, r) {
    try {
        if (r && e.matches(r)) return !1;
        if (typeof t == "string") {
            if (e.classList.contains(t)) return !0
        } else
            for (let o = e.classList.length; o--;) {
                const s = e.classList[o];
                if (t.test(s)) return !0
            }
        if (n) return e.matches(n)
    } catch {}
    return !1
}

function Pk(e, t) {
    for (let n = e.classList.length; n--;) {
        const r = e.classList[n];
        if (t.test(r)) return !0
    }
    return !1
}

function yn(e, t, n = 1 / 0, r = 0) {
    return !e || e.nodeType !== e.ELEMENT_NODE || r > n ? -1 : t(e) ? r : yn(e.parentNode, t, n, r + 1)
}

function qn(e, t) {
    return n => {
        const r = n;
        if (r === null) return !1;
        try {
            if (e) {
                if (typeof e == "string") {
                    if (r.matches(`.${e}`)) return !0
                } else if (Pk(r, e)) return !0
            }
            return !!(t && r.matches(t))
        } catch {
            return !1
        }
    }
}

function lr(e, t, n, r, o, s) {
    try {
        const i = e.nodeType === e.ELEMENT_NODE ? e : e.parentElement;
        if (i === null) return !1;
        if (i.tagName === "INPUT") {
            const u = i.getAttribute("autocomplete");
            if (["current-password", "new-password", "cc-number", "cc-exp", "cc-exp-month", "cc-exp-year", "cc-csc"].includes(u)) return !0
        }
        let a = -1,
            c = -1;
        if (s) {
            if (c = yn(i, qn(r, o)), c < 0) return !0;
            a = yn(i, qn(t, n), c >= 0 ? c : 1 / 0)
        } else {
            if (a = yn(i, qn(t, n)), a < 0) return !1;
            c = yn(i, qn(r, o), a >= 0 ? a : 1 / 0)
        }
        return a >= 0 ? c >= 0 ? a <= c : !0 : c >= 0 ? !1 : !!s
    } catch {}
    return !!s
}

function Lk(e, t, n) {
    const r = e.contentWindow;
    if (!r) return;
    let o = !1,
        s;
    try {
        s = r.document.readyState
    } catch {
        return
    }
    if (s !== "complete") {
        const a = wa(() => {
            o || (t(), o = !0)
        }, n);
        e.addEventListener("load", () => {
            hh(a), o = !0, t()
        });
        return
    }
    const i = "about:blank";
    if (r.location.href !== i || e.src === i || e.src === "") return wa(t, 0), e.addEventListener("load", t);
    e.addEventListener("load", t)
}

function Dk(e, t, n) {
    let r = !1,
        o;
    try {
        o = e.sheet
    } catch {
        return
    }
    if (o) return;
    const s = wa(() => {
        r || (t(), r = !0)
    }, n);
    e.addEventListener("load", () => {
        hh(s), r = !0, t()
    })
}

function Fk(e, t) {
    const {
        doc: n,
        mirror: r,
        blockClass: o,
        blockSelector: s,
        unblockSelector: i,
        maskAllText: a,
        maskAttributeFn: c,
        maskTextClass: u,
        unmaskTextClass: d,
        maskTextSelector: l,
        unmaskTextSelector: f,
        inlineStylesheet: p,
        maskInputOptions: h = {},
        maskTextFn: m,
        maskInputFn: _,
        dataURLOptions: y = {},
        inlineImages: b,
        recordCanvas: N,
        keepIframeSrcFn: T,
        newlyAddedElement: L = !1,
        ignoreCSSAttributes: A
    } = t, S = $k(n, r);
    switch (e.nodeType) {
        case e.DOCUMENT_NODE:
            return e.compatMode !== "CSS1Compat" ? {
                type: Te.Document,
                childNodes: [],
                compatMode: e.compatMode
            } : {
                type: Te.Document,
                childNodes: []
            };
        case e.DOCUMENT_TYPE_NODE:
            return {
                type: Te.DocumentType,
                name: e.name,
                publicId: e.publicId,
                systemId: e.systemId,
                rootId: S
            };
        case e.ELEMENT_NODE:
            return Uk(e, {
                doc: n,
                blockClass: o,
                blockSelector: s,
                unblockSelector: i,
                inlineStylesheet: p,
                maskAttributeFn: c,
                maskInputOptions: h,
                maskInputFn: _,
                dataURLOptions: y,
                inlineImages: b,
                recordCanvas: N,
                keepIframeSrcFn: T,
                newlyAddedElement: L,
                rootId: S,
                maskTextClass: u,
                unmaskTextClass: d,
                maskTextSelector: l,
                unmaskTextSelector: f,
                ignoreCSSAttributes: A
            });
        case e.TEXT_NODE:
            return Bk(e, {
                doc: n,
                maskAllText: a,
                maskTextClass: u,
                unmaskTextClass: d,
                maskTextSelector: l,
                unmaskTextSelector: f,
                maskTextFn: m,
                maskInputOptions: h,
                maskInputFn: _,
                rootId: S
            });
        case e.CDATA_SECTION_NODE:
            return {
                type: Te.CDATA,
                textContent: "",
                rootId: S
            };
        case e.COMMENT_NODE:
            return {
                type: Te.Comment,
                textContent: e.textContent || "",
                rootId: S
            };
        default:
            return !1
    }
}

function $k(e, t) {
    if (!t.hasNode(e)) return;
    const n = t.getId(e);
    return n === 1 ? void 0 : n
}

function Bk(e, t) {
    const {
        maskAllText: n,
        maskTextClass: r,
        unmaskTextClass: o,
        maskTextSelector: s,
        unmaskTextSelector: i,
        maskTextFn: a,
        maskInputOptions: c,
        maskInputFn: u,
        rootId: d
    } = t, l = e.parentNode && e.parentNode.tagName;
    let f = e.textContent;
    const p = l === "STYLE" ? !0 : void 0,
        h = l === "SCRIPT" ? !0 : void 0,
        m = l === "TEXTAREA" ? !0 : void 0;
    if (p && f) {
        try {
            e.nextSibling || e.previousSibling || e.parentNode.sheet ?.cssRules && (f = Is(e.parentNode.sheet))
        } catch (y) {
            console.warn(`Cannot get CSS styles from text's parentNode. Error: ${y}`, e)
        }
        f = ks(f, ai(t.doc))
    }
    h && (f = "SCRIPT_PLACEHOLDER");
    const _ = lr(e, r, s, o, i, n);
    if (!p && !h && !m && f && _ && (f = a ? a(f, e.parentElement) : f.replace(/[\S]/g, "*")), m && f && (c.textarea || _) && (f = u ? u(f, e.parentNode) : f.replace(/[\S]/g, "*")), l === "OPTION" && f) {
        const y = ii({
            type: null,
            tagName: l,
            maskInputOptions: c
        });
        f = Ur({
            isMasked: lr(e, r, s, o, i, y),
            element: e,
            value: f,
            maskInputFn: u
        })
    }
    return {
        type: Te.Text,
        textContent: f || "",
        isStyle: p,
        rootId: d
    }
}

function Uk(e, t) {
    const {
        doc: n,
        blockClass: r,
        blockSelector: o,
        unblockSelector: s,
        inlineStylesheet: i,
        maskInputOptions: a = {},
        maskAttributeFn: c,
        maskInputFn: u,
        dataURLOptions: d = {},
        inlineImages: l,
        recordCanvas: f,
        keepIframeSrcFn: p,
        newlyAddedElement: h = !1,
        rootId: m,
        maskTextClass: _,
        unmaskTextClass: y,
        maskTextSelector: b,
        unmaskTextSelector: N,
        ignoreCSSAttributes: T
    } = t, L = Ok(e, r, o, s), A = vk(e);
    let S = {};
    const x = e.attributes.length;
    for (let E = 0; E < x; E++) {
        const O = e.attributes[E];
        O.name && !_h(A, O.name, O.value) && (S[O.name] = gh(n, A, ur(O.name), O.value, e, c, T))
    }
    if (A === "link" && i) {
        const E = Array.from(n.styleSheets).find(k => k.href === e.href);
        let O = null;
        E && (O = Is(E)), O && (S.rel = null, S.href = null, S.crossorigin = null, S._cssText = ks(O, E.href))
    }
    if (A === "style" && e.sheet && !(e.innerText || e.textContent || "").trim().length) {
        const E = Is(e.sheet);
        E && (S._cssText = ks(E, ai(n)))
    }
    if (A === "input" || A === "textarea" || A === "select" || A === "option") {
        const E = e,
            O = $c(E),
            k = ws(E, Ia(A), O),
            P = E.checked;
        if (O !== "submit" && O !== "button" && k) {
            const D = lr(E, _, b, y, N, ii({
                type: O,
                tagName: Ia(A),
                maskInputOptions: a
            }));
            S.value = Ur({
                isMasked: D,
                element: E,
                value: k,
                maskInputFn: u
            })
        }
        P && (S.checked = P)
    }
    if (A === "option" && (e.selected && !a.select ? S.selected = !0 : delete S.selected), A === "canvas" && f) {
        if (e.__context === "2d") Sk(e) || (S.rr_dataURL = e.toDataURL(d.type, d.quality));
        else if (!("__context" in e)) {
            const E = e.toDataURL(d.type, d.quality),
                O = n.createElement("canvas");
            O.width = e.width, O.height = e.height;
            const k = O.toDataURL(d.type, d.quality);
            E !== k && (S.rr_dataURL = E)
        }
    }
    if (A === "img" && l) {
        Un || (Un = n.createElement("canvas"), ql = Un.getContext("2d"));
        const E = e,
            O = E.currentSrc || E.getAttribute("src") || "<unknown-src>",
            k = E.crossOrigin,
            P = () => {
                E.removeEventListener("load", P);
                try {
                    Un.width = E.naturalWidth, Un.height = E.naturalHeight, ql.drawImage(E, 0, 0), S.rr_dataURL = Un.toDataURL(d.type, d.quality)
                } catch (D) {
                    if (E.crossOrigin !== "anonymous") {
                        E.crossOrigin = "anonymous", E.complete && E.naturalWidth !== 0 ? P() : E.addEventListener("load", P);
                        return
                    } else console.warn(`Cannot inline img src=${O}! Error: ${D}`)
                }
                E.crossOrigin === "anonymous" && (k ? S.crossOrigin = k : E.removeAttribute("crossorigin"))
            };
        E.complete && E.naturalWidth !== 0 ? P() : E.addEventListener("load", P)
    }
    if ((A === "audio" || A === "video") && (S.rr_mediaState = e.paused ? "paused" : "played", S.rr_mediaCurrentTime = e.currentTime), h || (e.scrollLeft && (S.rr_scrollLeft = e.scrollLeft), e.scrollTop && (S.rr_scrollTop = e.scrollTop)), L) {
        const {
            width: E,
            height: O
        } = e.getBoundingClientRect();
        S = {
            class: S.class,
            rr_width: `${E}px`,
            rr_height: `${O}px`
        }
    }
    A === "iframe" && !p(S.src) && (!L && !mh(e) && (S.rr_src = S.src), delete S.src);
    let B;
    try {
        customElements.get(A) && (B = !0)
    } catch {}
    return {
        type: Te.Element,
        tagName: A,
        attributes: S,
        childNodes: [],
        isSVG: Nk(e) || void 0,
        needBlock: L,
        rootId: m,
        isCustom: B
    }
}

function de(e) {
    return e == null ? "" : e.toLowerCase()
}

function Hk(e, t) {
    if (t.comment && e.type === Te.Comment) return !0;
    if (e.type === Te.Element) {
        if (t.script && (e.tagName === "script" || e.tagName === "link" && (e.attributes.rel === "preload" || e.attributes.rel === "modulepreload") || e.tagName === "link" && e.attributes.rel === "prefetch" && typeof e.attributes.href == "string" && fh(e.attributes.href) === "js")) return !0;
        if (t.headFavicon && (e.tagName === "link" && e.attributes.rel === "shortcut icon" || e.tagName === "meta" && (de(e.attributes.name).match(/^msapplication-tile(image|color)$/) || de(e.attributes.name) === "application-name" || de(e.attributes.rel) === "icon" || de(e.attributes.rel) === "apple-touch-icon" || de(e.attributes.rel) === "shortcut icon"))) return !0;
        if (e.tagName === "meta") {
            if (t.headMetaDescKeywords && de(e.attributes.name).match(/^description|keywords$/)) return !0;
            if (t.headMetaSocial && (de(e.attributes.property).match(/^(og|twitter|fb):/) || de(e.attributes.name).match(/^(og|twitter):/) || de(e.attributes.name) === "pinterest")) return !0;
            if (t.headMetaRobots && (de(e.attributes.name) === "robots" || de(e.attributes.name) === "googlebot" || de(e.attributes.name) === "bingbot")) return !0;
            if (t.headMetaHttpEquiv && e.attributes["http-equiv"] !== void 0) return !0;
            if (t.headMetaAuthorship && (de(e.attributes.name) === "author" || de(e.attributes.name) === "generator" || de(e.attributes.name) === "framework" || de(e.attributes.name) === "publisher" || de(e.attributes.name) === "progid" || de(e.attributes.property).match(/^article:/) || de(e.attributes.property).match(/^product:/))) return !0;
            if (t.headMetaVerification && (de(e.attributes.name) === "google-site-verification" || de(e.attributes.name) === "yandex-verification" || de(e.attributes.name) === "csrf-token" || de(e.attributes.name) === "p:domain_verify" || de(e.attributes.name) === "verify-v1" || de(e.attributes.name) === "verification" || de(e.attributes.name) === "shopify-checkout-api-token")) return !0
        }
    }
    return !1
}

function Gn(e, t) {
    const {
        doc: n,
        mirror: r,
        blockClass: o,
        blockSelector: s,
        unblockSelector: i,
        maskAllText: a,
        maskTextClass: c,
        unmaskTextClass: u,
        maskTextSelector: d,
        unmaskTextSelector: l,
        skipChild: f = !1,
        inlineStylesheet: p = !0,
        maskInputOptions: h = {},
        maskAttributeFn: m,
        maskTextFn: _,
        maskInputFn: y,
        slimDOMOptions: b,
        dataURLOptions: N = {},
        inlineImages: T = !1,
        recordCanvas: L = !1,
        onSerialize: A,
        onIframeLoad: S,
        iframeLoadTimeout: x = 5e3,
        onBlockedImageLoad: B,
        onStylesheetLoad: E,
        stylesheetLoadTimeout: O = 5e3,
        keepIframeSrcFn: k = () => !1,
        newlyAddedElement: P = !1,
        ignoreCSSAttributes: D
    } = t;
    let {
        preserveWhiteSpace: ee = !0
    } = t;
    const Y = Fk(e, {
        doc: n,
        mirror: r,
        blockClass: o,
        blockSelector: s,
        maskAllText: a,
        unblockSelector: i,
        maskTextClass: c,
        unmaskTextClass: u,
        maskTextSelector: d,
        unmaskTextSelector: l,
        inlineStylesheet: p,
        maskInputOptions: h,
        maskAttributeFn: m,
        maskTextFn: _,
        maskInputFn: y,
        dataURLOptions: N,
        inlineImages: T,
        recordCanvas: L,
        keepIframeSrcFn: k,
        newlyAddedElement: P,
        ignoreCSSAttributes: D
    });
    if (!Y) return console.warn(e, "not serialized"), null;
    let ne;
    r.hasNode(e) ? ne = r.getId(e) : Hk(Y, b) || !ee && Y.type === Te.Text && !Y.isStyle && !Y.textContent.replace(/^\s+|\s+$/gm, "").length ? ne = Hr : ne = Bc();
    const v = Object.assign(Y, {
        id: ne
    });
    if (r.add(e, v), ne === Hr) return null;
    A && A(e);
    let z = !f;
    if (v.type === Te.Element) {
        z = z && !v.needBlock;
        const w = e.shadowRoot;
        w && Pr(w) && (v.isShadowHost = !0)
    }
    if ((v.type === Te.Document || v.type === Te.Element) && z) {
        b.headWhitespace && v.type === Te.Element && v.tagName === "head" && (ee = !1);
        const w = {
                doc: n,
                mirror: r,
                blockClass: o,
                blockSelector: s,
                maskAllText: a,
                unblockSelector: i,
                maskTextClass: c,
                unmaskTextClass: u,
                maskTextSelector: d,
                unmaskTextSelector: l,
                skipChild: f,
                inlineStylesheet: p,
                maskInputOptions: h,
                maskAttributeFn: m,
                maskTextFn: _,
                maskInputFn: y,
                slimDOMOptions: b,
                dataURLOptions: N,
                inlineImages: T,
                recordCanvas: L,
                preserveWhiteSpace: ee,
                onSerialize: A,
                onIframeLoad: S,
                iframeLoadTimeout: x,
                onBlockedImageLoad: B,
                onStylesheetLoad: E,
                stylesheetLoadTimeout: O,
                keepIframeSrcFn: k,
                ignoreCSSAttributes: D
            },
            V = e.childNodes ? Array.from(e.childNodes) : [];
        for (const se of V) {
            const re = Gn(se, w);
            re && v.childNodes.push(re)
        }
        if (dk(e) && e.shadowRoot)
            for (const se of Array.from(e.shadowRoot.childNodes)) {
                const re = Gn(se, w);
                re && (Pr(e.shadowRoot) && (re.isShadow = !0), v.childNodes.push(re))
            }
    }
    if (e.parentNode && Or(e.parentNode) && Pr(e.parentNode) && (v.isShadow = !0), v.type === Te.Element && v.tagName === "iframe" && !v.needBlock && Lk(e, () => {
            const w = mh(e);
            if (w && S) {
                const V = Gn(w, {
                    doc: w,
                    mirror: r,
                    blockClass: o,
                    blockSelector: s,
                    unblockSelector: i,
                    maskAllText: a,
                    maskTextClass: c,
                    unmaskTextClass: u,
                    maskTextSelector: d,
                    unmaskTextSelector: l,
                    skipChild: !1,
                    inlineStylesheet: p,
                    maskInputOptions: h,
                    maskAttributeFn: m,
                    maskTextFn: _,
                    maskInputFn: y,
                    slimDOMOptions: b,
                    dataURLOptions: N,
                    inlineImages: T,
                    recordCanvas: L,
                    preserveWhiteSpace: ee,
                    onSerialize: A,
                    onIframeLoad: S,
                    iframeLoadTimeout: x,
                    onStylesheetLoad: E,
                    stylesheetLoadTimeout: O,
                    keepIframeSrcFn: k,
                    ignoreCSSAttributes: D
                });
                V && S(e, V)
            }
        }, x), v.type === Te.Element && v.tagName === "img" && !e.complete && v.needBlock) {
        const w = e,
            V = () => {
                if (w.isConnected && !w.complete && B) try {
                    const se = w.getBoundingClientRect();
                    se.width > 0 && se.height > 0 && B(w, v, se)
                } catch {}
                w.removeEventListener("load", V)
            };
        w.isConnected && w.addEventListener("load", V)
    }
    return v.type === Te.Element && v.tagName === "link" && typeof v.attributes.rel == "string" && (v.attributes.rel === "stylesheet" || v.attributes.rel === "preload" && typeof v.attributes.href == "string" && fh(v.attributes.href) === "css") && Dk(e, () => {
        if (E) {
            const w = Gn(e, {
                doc: n,
                mirror: r,
                blockClass: o,
                blockSelector: s,
                unblockSelector: i,
                maskAllText: a,
                maskTextClass: c,
                unmaskTextClass: u,
                maskTextSelector: d,
                unmaskTextSelector: l,
                skipChild: !1,
                inlineStylesheet: p,
                maskInputOptions: h,
                maskAttributeFn: m,
                maskTextFn: _,
                maskInputFn: y,
                slimDOMOptions: b,
                dataURLOptions: N,
                inlineImages: T,
                recordCanvas: L,
                preserveWhiteSpace: ee,
                onSerialize: A,
                onIframeLoad: S,
                iframeLoadTimeout: x,
                onStylesheetLoad: E,
                stylesheetLoadTimeout: O,
                keepIframeSrcFn: k,
                ignoreCSSAttributes: D
            });
            w && E(e, w)
        }
    }, O), v.type === Te.Element && delete v.needBlock, v
}

function Wk(e, t) {
    const {
        mirror: n = new dh,
        blockClass: r = "rr-block",
        blockSelector: o = null,
        unblockSelector: s = null,
        maskAllText: i = !1,
        maskTextClass: a = "rr-mask",
        unmaskTextClass: c = null,
        maskTextSelector: u = null,
        unmaskTextSelector: d = null,
        inlineStylesheet: l = !0,
        inlineImages: f = !1,
        recordCanvas: p = !1,
        maskAllInputs: h = !1,
        maskAttributeFn: m,
        maskTextFn: _,
        maskInputFn: y,
        slimDOM: b = !1,
        dataURLOptions: N,
        preserveWhiteSpace: T,
        onSerialize: L,
        onIframeLoad: A,
        iframeLoadTimeout: S,
        onBlockedImageLoad: x,
        onStylesheetLoad: B,
        stylesheetLoadTimeout: E,
        keepIframeSrcFn: O = () => !1,
        ignoreCSSAttributes: k = new Set([])
    } = t || {};
    return Gn(e, {
        doc: e,
        mirror: n,
        blockClass: r,
        blockSelector: o,
        unblockSelector: s,
        maskAllText: i,
        maskTextClass: a,
        unmaskTextClass: c,
        maskTextSelector: u,
        unmaskTextSelector: d,
        skipChild: !1,
        inlineStylesheet: l,
        maskInputOptions: h === !0 ? {
            color: !0,
            date: !0,
            "datetime-local": !0,
            email: !0,
            month: !0,
            number: !0,
            range: !0,
            search: !0,
            tel: !0,
            text: !0,
            time: !0,
            url: !0,
            week: !0,
            textarea: !0,
            select: !0
        } : h === !1 ? {} : h,
        maskAttributeFn: m,
        maskTextFn: _,
        maskInputFn: y,
        slimDOMOptions: b === !0 || b === "all" ? {
            script: !0,
            comment: !0,
            headFavicon: !0,
            headWhitespace: !0,
            headMetaDescKeywords: b === "all",
            headMetaSocial: !0,
            headMetaRobots: !0,
            headMetaHttpEquiv: !0,
            headMetaAuthorship: !0,
            headMetaVerification: !0
        } : b === !1 ? {} : b,
        dataURLOptions: N,
        inlineImages: f,
        recordCanvas: p,
        preserveWhiteSpace: T,
        onSerialize: L,
        onIframeLoad: A,
        iframeLoadTimeout: S,
        onBlockedImageLoad: x,
        onStylesheetLoad: B,
        stylesheetLoadTimeout: E,
        keepIframeSrcFn: O,
        newlyAddedElement: !1,
        ignoreCSSAttributes: k
    })
}

function Fe(e, t, n = document) {
    const r = {
        capture: !0,
        passive: !0
    };
    return n.addEventListener(e, t, r), () => n.removeEventListener(e, t, r)
}
const Hn = `Please stop import mirror directly. Instead of that,\r
now you can use replayer.getMirror() to access the mirror instance of a replayer,\r
or you can use record.mirror to access the mirror instance during recording.`;
let Vl = {
    map: {},
    getId() {
        return console.error(Hn), -1
    },
    getNode() {
        return console.error(Hn), null
    },
    removeNodeFromMap() {
        console.error(Hn)
    },
    has() {
        return console.error(Hn), !1
    },
    reset() {
        console.error(Hn)
    }
};
typeof window < "u" && window.Proxy && window.Reflect && (Vl = new Proxy(Vl, {
    get(e, t, n) {
        return t === "map" && console.error(Hn), Reflect.get(e, t, n)
    }
}));

function Wr(e, t, n = {}) {
    let r = null,
        o = 0;
    return function(...s) {
        const i = Date.now();
        !o && n.leading === !1 && (o = i);
        const a = t - (i - o),
            c = this;
        a <= 0 || a > t ? (r && (Kk(r), r = null), o = i, e.apply(c, s)) : !r && n.trailing !== !1 && (r = ci(() => {
            o = n.leading === !1 ? 0 : Date.now(), r = null, e.apply(c, s)
        }, a))
    }
}

function yh(e, t, n, r, o = window) {
    const s = o.Object.getOwnPropertyDescriptor(e, t);
    return o.Object.defineProperty(e, t, r ? n : {
        set(i) {
            ci(() => {
                n.set.call(this, i)
            }, 0), s && s.set && s.set.call(this, i)
        }
    }), () => yh(e, t, s || {}, !0)
}

function Uc(e, t, n) {
    try {
        if (!(t in e)) return () => {};
        const r = e[t],
            o = n(r);
        return typeof o == "function" && (o.prototype = o.prototype || {}, Object.defineProperties(o, {
            __rrweb_original__: {
                enumerable: !1,
                value: r
            }
        })), e[t] = o, () => {
            e[t] = r
        }
    } catch {
        return () => {}
    }
}
let Rs = Date.now;
/[1-9][0-9]{12}/.test(Date.now().toString()) || (Rs = () => new Date().getTime());

function Sh(e) {
    const t = e.document;
    return {
        left: t.scrollingElement ? t.scrollingElement.scrollLeft : e.pageXOffset !== void 0 ? e.pageXOffset : t ?.documentElement.scrollLeft || t ?.body ?.parentElement ?.scrollLeft || t ?.body ?.scrollLeft || 0,
        top: t.scrollingElement ? t.scrollingElement.scrollTop : e.pageYOffset !== void 0 ? e.pageYOffset : t ?.documentElement.scrollTop || t ?.body ?.parentElement ?.scrollTop || t ?.body ?.scrollTop || 0
    }
}

function bh() {
    return window.innerHeight || document.documentElement && document.documentElement.clientHeight || document.body && document.body.clientHeight
}

function Eh() {
    return window.innerWidth || document.documentElement && document.documentElement.clientWidth || document.body && document.body.clientWidth
}

function vh(e) {
    if (!e) return null;
    try {
        return e.nodeType === e.ELEMENT_NODE ? e : e.parentElement
    } catch {
        return null
    }
}

function Ve(e, t, n, r, o) {
    if (!e) return !1;
    const s = vh(e);
    if (!s) return !1;
    const i = qn(t, n);
    if (!o) {
        const u = r && s.matches(r);
        return i(s) && !u
    }
    const a = yn(s, i);
    let c = -1;
    return a < 0 ? !1 : (r && (c = yn(s, qn(null, r))), a > -1 && c < 0 ? !0 : a < c)
}

function jk(e, t) {
    return t.getId(e) !== -1
}

function Wi(e, t) {
    return t.getId(e) === Hr
}

function Th(e, t) {
    if (Or(e)) return !1;
    const n = t.getId(e);
    return t.has(n) ? e.parentNode && e.parentNode.nodeType === e.DOCUMENT_NODE ? !1 : e.parentNode ? Th(e.parentNode, t) : !0 : !0
}

function ka(e) {
    return !!e.changedTouches
}

function zk(e = window) {
    "NodeList" in e && !e.NodeList.prototype.forEach && (e.NodeList.prototype.forEach = Array.prototype.forEach), "DOMTokenList" in e && !e.DOMTokenList.prototype.forEach && (e.DOMTokenList.prototype.forEach = Array.prototype.forEach), Node.prototype.contains || (Node.prototype.contains = (...t) => {
        let n = t[0];
        if (!(0 in t)) throw new TypeError("1 argument is required");
        do
            if (this === n) return !0; while (n = n && n.parentNode);
        return !1
    })
}

function Ih(e, t) {
    return !!(e.nodeName === "IFRAME" && t.getMeta(e))
}

function wh(e, t) {
    return !!(e.nodeName === "LINK" && e.nodeType === e.ELEMENT_NODE && e.getAttribute && e.getAttribute("rel") === "stylesheet" && t.getMeta(e))
}

function Ra(e) {
    return !!e ?.shadowRoot
}
class qk {
    constructor() {
        this.id = 1, this.styleIDMap = new WeakMap, this.idStyleMap = new Map
    }
    getId(t) {
        return this.styleIDMap.get(t) ?? -1
    }
    has(t) {
        return this.styleIDMap.has(t)
    }
    add(t, n) {
        if (this.has(t)) return this.getId(t);
        let r;
        return n === void 0 ? r = this.id++ : r = n, this.styleIDMap.set(t, r), this.idStyleMap.set(r, t), r
    }
    getStyle(t) {
        return this.idStyleMap.get(t) || null
    }
    reset() {
        this.styleIDMap = new WeakMap, this.idStyleMap = new Map, this.id = 1
    }
    generateId() {
        return this.id++
    }
}

function kh(e) {
    let t = null;
    return e.getRootNode ?.() ?.nodeType === Node.DOCUMENT_FRAGMENT_NODE && e.getRootNode().host && (t = e.getRootNode().host), t
}

function Gk(e) {
    let t = e,
        n;
    for (; n = kh(t);) t = n;
    return t
}

function Vk(e) {
    const t = e.ownerDocument;
    if (!t) return !1;
    const n = Gk(e);
    return t.contains(n)
}

function Rh(e) {
    const t = e.ownerDocument;
    return t ? t.contains(e) || Vk(e) : !1
}
const Jl = {};

function Hc(e) {
    const t = Jl[e];
    if (t) return t;
    const n = window.document;
    let r = window[e];
    if (n && typeof n.createElement == "function") try {
        const o = n.createElement("iframe");
        o.hidden = !0, n.head.appendChild(o);
        const s = o.contentWindow;
        s && s[e] && (r = s[e]), n.head.removeChild(o)
    } catch {}
    return Jl[e] = r.bind(window)
}

function Jk(...e) {
    return Hc("requestAnimationFrame")(...e)
}

function ci(...e) {
    return Hc("setTimeout")(...e)
}

function Kk(...e) {
    return Hc("clearTimeout")(...e)
}
var J = (e => (e[e.DomContentLoaded = 0] = "DomContentLoaded", e[e.Load = 1] = "Load", e[e.FullSnapshot = 2] = "FullSnapshot", e[e.IncrementalSnapshot = 3] = "IncrementalSnapshot", e[e.Meta = 4] = "Meta", e[e.Custom = 5] = "Custom", e[e.Plugin = 6] = "Plugin", e))(J || {}),
    W = (e => (e[e.Mutation = 0] = "Mutation", e[e.MouseMove = 1] = "MouseMove", e[e.MouseInteraction = 2] = "MouseInteraction", e[e.Scroll = 3] = "Scroll", e[e.ViewportResize = 4] = "ViewportResize", e[e.Input = 5] = "Input", e[e.TouchMove = 6] = "TouchMove", e[e.MediaInteraction = 7] = "MediaInteraction", e[e.StyleSheetRule = 8] = "StyleSheetRule", e[e.CanvasMutation = 9] = "CanvasMutation", e[e.Font = 10] = "Font", e[e.Log = 11] = "Log", e[e.Drag = 12] = "Drag", e[e.StyleDeclaration = 13] = "StyleDeclaration", e[e.Selection = 14] = "Selection", e[e.AdoptedStyleSheet = 15] = "AdoptedStyleSheet", e[e.CustomElement = 16] = "CustomElement", e))(W || {}),
    De = (e => (e[e.MouseUp = 0] = "MouseUp", e[e.MouseDown = 1] = "MouseDown", e[e.Click = 2] = "Click", e[e.ContextMenu = 3] = "ContextMenu", e[e.DblClick = 4] = "DblClick", e[e.Focus = 5] = "Focus", e[e.Blur = 6] = "Blur", e[e.TouchStart = 7] = "TouchStart", e[e.TouchMove_Departed = 8] = "TouchMove_Departed", e[e.TouchEnd = 9] = "TouchEnd", e[e.TouchCancel = 10] = "TouchCancel", e))(De || {}),
    Tt = (e => (e[e.Mouse = 0] = "Mouse", e[e.Pen = 1] = "Pen", e[e.Touch = 2] = "Touch", e))(Tt || {}),
    Wn = (e => (e[e.Play = 0] = "Play", e[e.Pause = 1] = "Pause", e[e.Seeked = 2] = "Seeked", e[e.VolumeChange = 3] = "VolumeChange", e[e.RateChange = 4] = "RateChange", e))(Wn || {});

function Wc(e) {
    try {
        return e.contentDocument
    } catch {}
}

function Yk(e) {
    try {
        return e.contentWindow
    } catch {}
}

function Kl(e) {
    return "__ln" in e
}
class Xk {
    constructor() {
        this.length = 0, this.head = null, this.tail = null
    }
    get(t) {
        if (t >= this.length) throw new Error("Position outside of list range");
        let n = this.head;
        for (let r = 0; r < t; r++) n = n ?.next || null;
        return n
    }
    addNode(t) {
        const n = {
            value: t,
            previous: null,
            next: null
        };
        if (t.__ln = n, t.previousSibling && Kl(t.previousSibling)) {
            const r = t.previousSibling.__ln.next;
            n.next = r, n.previous = t.previousSibling.__ln, t.previousSibling.__ln.next = n, r && (r.previous = n)
        } else if (t.nextSibling && Kl(t.nextSibling) && t.nextSibling.__ln.previous) {
            const r = t.nextSibling.__ln.previous;
            n.previous = r, n.next = t.nextSibling.__ln, t.nextSibling.__ln.previous = n, r && (r.next = n)
        } else this.head && (this.head.previous = n), n.next = this.head, this.head = n;
        n.next === null && (this.tail = n), this.length++
    }
    removeNode(t) {
        const n = t.__ln;
        this.head && (n.previous ? (n.previous.next = n.next, n.next ? n.next.previous = n.previous : this.tail = n.previous) : (this.head = n.next, this.head ? this.head.previous = null : this.tail = null), t.__ln && delete t.__ln, this.length--)
    }
}
const Yl = (e, t) => `${e}@${t}`;
class Qk {
    constructor() {
        this.frozen = !1, this.locked = !1, this.texts = [], this.attributes = [], this.attributeMap = new WeakMap, this.removes = [], this.mapRemoves = [], this.movedMap = {}, this.addedSet = new Set, this.movedSet = new Set, this.droppedSet = new Set, this.processMutations = t => {
            t.forEach(this.processMutation), this.emit()
        }, this.emit = () => {
            if (this.frozen || this.locked) return;
            const t = [],
                n = new Set,
                r = new Xk,
                o = c => {
                    let u = c,
                        d = Hr;
                    for (; d === Hr;) u = u && u.nextSibling, d = u && this.mirror.getId(u);
                    return d
                },
                s = c => {
                    if (!c.parentNode || !Rh(c)) return;
                    const u = Or(c.parentNode) ? this.mirror.getId(kh(c)) : this.mirror.getId(c.parentNode),
                        d = o(c);
                    if (u === -1 || d === -1) return r.addNode(c);
                    const l = Gn(c, {
                        doc: this.doc,
                        mirror: this.mirror,
                        blockClass: this.blockClass,
                        blockSelector: this.blockSelector,
                        maskAllText: this.maskAllText,
                        unblockSelector: this.unblockSelector,
                        maskTextClass: this.maskTextClass,
                        unmaskTextClass: this.unmaskTextClass,
                        maskTextSelector: this.maskTextSelector,
                        unmaskTextSelector: this.unmaskTextSelector,
                        skipChild: !0,
                        newlyAddedElement: !0,
                        inlineStylesheet: this.inlineStylesheet,
                        maskInputOptions: this.maskInputOptions,
                        maskAttributeFn: this.maskAttributeFn,
                        maskTextFn: this.maskTextFn,
                        maskInputFn: this.maskInputFn,
                        slimDOMOptions: this.slimDOMOptions,
                        dataURLOptions: this.dataURLOptions,
                        recordCanvas: this.recordCanvas,
                        inlineImages: this.inlineImages,
                        onSerialize: f => {
                            Ih(f, this.mirror) && !Ve(f, this.blockClass, this.blockSelector, this.unblockSelector, !1) && this.iframeManager.addIframe(f), wh(f, this.mirror) && this.stylesheetManager.trackLinkElement(f), Ra(c) && this.shadowDomManager.addShadowRoot(c.shadowRoot, this.doc)
                        },
                        onIframeLoad: (f, p) => {
                            Ve(f, this.blockClass, this.blockSelector, this.unblockSelector, !1) || (this.iframeManager.attachIframe(f, p), f.contentWindow && this.canvasManager.addWindow(f.contentWindow), this.shadowDomManager.observeAttachShadow(f))
                        },
                        onStylesheetLoad: (f, p) => {
                            this.stylesheetManager.attachLinkElement(f, p)
                        },
                        onBlockedImageLoad: (f, p, {
                            width: h,
                            height: m
                        }) => {
                            this.mutationCb({
                                adds: [],
                                removes: [],
                                texts: [],
                                attributes: [{
                                    id: p.id,
                                    attributes: {
                                        style: {
                                            width: `${h}px`,
                                            height: `${m}px`
                                        }
                                    }
                                }]
                            })
                        },
                        ignoreCSSAttributes: this.ignoreCSSAttributes
                    });
                    l && (t.push({
                        parentId: u,
                        nextId: d,
                        node: l
                    }), n.add(l.id))
                };
            for (; this.mapRemoves.length;) this.mirror.removeNodeFromMap(this.mapRemoves.shift());
            for (const c of this.movedSet) Xl(this.removes, c, this.mirror) && !this.movedSet.has(c.parentNode) || s(c);
            for (const c of this.addedSet) !Ql(this.droppedSet, c) && !Xl(this.removes, c, this.mirror) || Ql(this.movedSet, c) ? s(c) : this.droppedSet.add(c);
            let i = null;
            for (; r.length;) {
                let c = null;
                if (i) {
                    const u = this.mirror.getId(i.value.parentNode),
                        d = o(i.value);
                    u !== -1 && d !== -1 && (c = i)
                }
                if (!c) {
                    let u = r.tail;
                    for (; u;) {
                        const d = u;
                        if (u = u.previous, d) {
                            const l = this.mirror.getId(d.value.parentNode);
                            if (o(d.value) === -1) continue;
                            if (l !== -1) {
                                c = d;
                                break
                            } else {
                                const p = d.value;
                                if (p.parentNode && p.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                                    const h = p.parentNode.host;
                                    if (this.mirror.getId(h) !== -1) {
                                        c = d;
                                        break
                                    }
                                }
                            }
                        }
                    }
                }
                if (!c) {
                    for (; r.head;) r.removeNode(r.head.value);
                    break
                }
                i = c.previous, r.removeNode(c.value), s(c.value)
            }
            const a = {
                texts: this.texts.map(c => ({
                    id: this.mirror.getId(c.node),
                    value: c.value
                })).filter(c => !n.has(c.id)).filter(c => this.mirror.has(c.id)),
                attributes: this.attributes.map(c => {
                    const {
                        attributes: u
                    } = c;
                    if (typeof u.style == "string") {
                        const d = JSON.stringify(c.styleDiff),
                            l = JSON.stringify(c._unchangedStyles);
                        d.length < u.style.length && (d + l).split("var(").length === u.style.split("var(").length && (u.style = c.styleDiff)
                    }
                    return {
                        id: this.mirror.getId(c.node),
                        attributes: u
                    }
                }).filter(c => !n.has(c.id)).filter(c => this.mirror.has(c.id)),
                removes: this.removes,
                adds: t
            };
            !a.texts.length && !a.attributes.length && !a.removes.length && !a.adds.length || (this.texts = [], this.attributes = [], this.attributeMap = new WeakMap, this.removes = [], this.addedSet = new Set, this.movedSet = new Set, this.droppedSet = new Set, this.movedMap = {}, this.mutationCb(a))
        }, this.processMutation = t => {
            if (!Wi(t.target, this.mirror)) switch (t.type) {
                case "characterData":
                    {
                        const n = t.target.textContent;!Ve(t.target, this.blockClass, this.blockSelector, this.unblockSelector, !1) && n !== t.oldValue && this.texts.push({
                            value: lr(t.target, this.maskTextClass, this.maskTextSelector, this.unmaskTextClass, this.unmaskTextSelector, this.maskAllText) && n ? this.maskTextFn ? this.maskTextFn(n, vh(t.target)) : n.replace(/[\S]/g, "*") : n,
                            node: t.target
                        });
                        break
                    }
                case "attributes":
                    {
                        const n = t.target;
                        let r = t.attributeName,
                            o = t.target.getAttribute(r);
                        if (r === "value") {
                            const i = $c(n),
                                a = n.tagName;
                            o = ws(n, a, i);
                            const c = ii({
                                    maskInputOptions: this.maskInputOptions,
                                    tagName: a,
                                    type: i
                                }),
                                u = lr(t.target, this.maskTextClass, this.maskTextSelector, this.unmaskTextClass, this.unmaskTextSelector, c);
                            o = Ur({
                                isMasked: u,
                                element: n,
                                value: o,
                                maskInputFn: this.maskInputFn
                            })
                        }
                        if (Ve(t.target, this.blockClass, this.blockSelector, this.unblockSelector, !1) || o === t.oldValue) return;
                        let s = this.attributeMap.get(t.target);
                        if (n.tagName === "IFRAME" && r === "src" && !this.keepIframeSrcFn(o))
                            if (!Wc(n)) r = "rr_src";
                            else return;
                        if (s || (s = {
                                node: t.target,
                                attributes: {},
                                styleDiff: {},
                                _unchangedStyles: {}
                            }, this.attributes.push(s), this.attributeMap.set(t.target, s)), r === "type" && n.tagName === "INPUT" && (t.oldValue || "").toLowerCase() === "password" && n.setAttribute("data-rr-is-password", "true"), !_h(n.tagName, r) && (s.attributes[r] = gh(this.doc, ur(n.tagName), ur(r), o, n, this.maskAttributeFn), r === "style")) {
                            if (!this.unattachedDoc) try {
                                this.unattachedDoc = document.implementation.createHTMLDocument()
                            } catch {
                                this.unattachedDoc = this.doc
                            }
                            const i = this.unattachedDoc.createElement("span");
                            t.oldValue && i.setAttribute("style", t.oldValue);
                            for (const a of Array.from(n.style)) {
                                const c = n.style.getPropertyValue(a),
                                    u = n.style.getPropertyPriority(a);
                                c !== i.style.getPropertyValue(a) || u !== i.style.getPropertyPriority(a) ? u === "" ? s.styleDiff[a] = c : s.styleDiff[a] = [c, u] : s._unchangedStyles[a] = [c, u]
                            }
                            for (const a of Array.from(i.style)) n.style.getPropertyValue(a) === "" && (s.styleDiff[a] = !1)
                        }
                        break
                    }
                case "childList":
                    {
                        if (Ve(t.target, this.blockClass, this.blockSelector, this.unblockSelector, !0)) return;t.addedNodes.forEach(n => this.genAdds(n, t.target)),
                        t.removedNodes.forEach(n => {
                            const r = this.mirror.getId(n),
                                o = Or(t.target) ? this.mirror.getId(t.target.host) : this.mirror.getId(t.target);
                            Ve(t.target, this.blockClass, this.blockSelector, this.unblockSelector, !1) || Wi(n, this.mirror) || !jk(n, this.mirror) || (this.addedSet.has(n) ? (Ca(this.addedSet, n), this.droppedSet.add(n)) : this.addedSet.has(t.target) && r === -1 || Th(t.target, this.mirror) || (this.movedSet.has(n) && this.movedMap[Yl(r, o)] ? Ca(this.movedSet, n) : this.removes.push({
                                parentId: o,
                                id: r,
                                isShadow: Or(t.target) && Pr(t.target) ? !0 : void 0
                            })), this.mapRemoves.push(n))
                        });
                        break
                    }
            }
        }, this.genAdds = (t, n) => {
            if (!this.processedNodeManager.inOtherBuffer(t, this) && !(this.addedSet.has(t) || this.movedSet.has(t))) {
                if (this.mirror.hasNode(t)) {
                    if (Wi(t, this.mirror)) return;
                    this.movedSet.add(t);
                    let r = null;
                    n && this.mirror.hasNode(n) && (r = this.mirror.getId(n)), r && r !== -1 && (this.movedMap[Yl(this.mirror.getId(t), r)] = !0)
                } else this.addedSet.add(t), this.droppedSet.delete(t);
                Ve(t, this.blockClass, this.blockSelector, this.unblockSelector, !1) || (t.childNodes && t.childNodes.forEach(r => this.genAdds(r)), Ra(t) && t.shadowRoot.childNodes.forEach(r => {
                    this.processedNodeManager.add(r, this), this.genAdds(r, t)
                }))
            }
        }
    }
    init(t) {
        ["mutationCb", "blockClass", "blockSelector", "unblockSelector", "maskAllText", "maskTextClass", "unmaskTextClass", "maskTextSelector", "unmaskTextSelector", "inlineStylesheet", "maskInputOptions", "maskAttributeFn", "maskTextFn", "maskInputFn", "keepIframeSrcFn", "recordCanvas", "inlineImages", "slimDOMOptions", "dataURLOptions", "doc", "mirror", "iframeManager", "stylesheetManager", "shadowDomManager", "canvasManager", "processedNodeManager", "ignoreCSSAttributes"].forEach(n => {
            this[n] = t[n]
        })
    }
    freeze() {
        this.frozen = !0, this.canvasManager.freeze()
    }
    unfreeze() {
        this.frozen = !1, this.canvasManager.unfreeze(), this.emit()
    }
    isFrozen() {
        return this.frozen
    }
    lock() {
        this.locked = !0, this.canvasManager.lock()
    }
    unlock() {
        this.locked = !1, this.canvasManager.unlock(), this.emit()
    }
    reset() {
        this.shadowDomManager.reset(), this.canvasManager.reset()
    }
}

function Ca(e, t) {
    e.delete(t), t.childNodes ?.forEach(n => Ca(e, n))
}

function Xl(e, t, n) {
    return e.length === 0 ? !1 : Zk(e, t, n)
}

function Zk(e, t, n) {
    let r = t.parentNode;
    for (; r;) {
        const o = n.getId(r);
        if (e.some(s => s.id === o)) return !0;
        r = r.parentNode
    }
    return !1
}

function Ql(e, t) {
    return e.size === 0 ? !1 : Ch(e, t)
}

function Ch(e, t) {
    const {
        parentNode: n
    } = t;
    return n ? e.has(n) ? !0 : Ch(e, n) : !1
}
let Lr;

function eR(e) {
    Lr = e
}

function tR() {
    Lr = void 0
}
const te = e => Lr ? (...n) => {
        try {
            return e(...n)
        } catch (r) {
            if (Lr && Lr(r) === !0) return () => {};
            throw r
        }
    } : e,
    Vn = [];

function ao(e) {
    try {
        if ("composedPath" in e) {
            const t = e.composedPath();
            if (t.length) return t[0]
        } else if ("path" in e && e.path.length) return e.path[0]
    } catch {}
    return e && e.target
}

function Ah(e, t) {
    const n = new Qk;
    Vn.push(n), n.init(e);
    let r = window.MutationObserver || window.__rrMutationObserver;
    const o = window ?.Zone ?.__symbol__ ?.("MutationObserver");
    o && window[o] && (r = window[o]);
    const s = new r(te(i => {
        e.onMutation && e.onMutation(i) === !1 || n.processMutations.bind(n)(i)
    }));
    return s.observe(t, {
        attributes: !0,
        attributeOldValue: !0,
        characterData: !0,
        characterDataOldValue: !0,
        childList: !0,
        subtree: !0
    }), s
}

function nR({
    mousemoveCb: e,
    sampling: t,
    doc: n,
    mirror: r
}) {
    if (t.mousemove === !1) return () => {};
    const o = typeof t.mousemove == "number" ? t.mousemove : 50,
        s = typeof t.mousemoveCallback == "number" ? t.mousemoveCallback : 500;
    let i = [],
        a;
    const c = Wr(te(l => {
            const f = Date.now() - a;
            e(i.map(p => (p.timeOffset -= f, p)), l), i = [], a = null
        }), s),
        u = te(Wr(te(l => {
            const f = ao(l),
                {
                    clientX: p,
                    clientY: h
                } = ka(l) ? l.changedTouches[0] : l;
            a || (a = Rs()), i.push({
                x: p,
                y: h,
                id: r.getId(f),
                timeOffset: Rs() - a
            }), c(typeof DragEvent < "u" && l instanceof DragEvent ? W.Drag : l instanceof MouseEvent ? W.MouseMove : W.TouchMove)
        }), o, {
            trailing: !1
        })),
        d = [Fe("mousemove", u, n), Fe("touchmove", u, n), Fe("drag", u, n)];
    return te(() => {
        d.forEach(l => l())
    })
}

function rR({
    mouseInteractionCb: e,
    doc: t,
    mirror: n,
    blockClass: r,
    blockSelector: o,
    unblockSelector: s,
    sampling: i
}) {
    if (i.mouseInteraction === !1) return () => {};
    const a = i.mouseInteraction === !0 || i.mouseInteraction === void 0 ? {} : i.mouseInteraction,
        c = [];
    let u = null;
    const d = l => f => {
        const p = ao(f);
        if (Ve(p, r, o, s, !0)) return;
        let h = null,
            m = l;
        if ("pointerType" in f) {
            switch (f.pointerType) {
                case "mouse":
                    h = Tt.Mouse;
                    break;
                case "touch":
                    h = Tt.Touch;
                    break;
                case "pen":
                    h = Tt.Pen;
                    break
            }
            h === Tt.Touch ? De[l] === De.MouseDown ? m = "TouchStart" : De[l] === De.MouseUp && (m = "TouchEnd") : Tt.Pen
        } else ka(f) && (h = Tt.Touch);
        h !== null ? (u = h, (m.startsWith("Touch") && h === Tt.Touch || m.startsWith("Mouse") && h === Tt.Mouse) && (h = null)) : De[l] === De.Click && (h = u, u = null);
        const _ = ka(f) ? f.changedTouches[0] : f;
        if (!_) return;
        const y = n.getId(p),
            {
                clientX: b,
                clientY: N
            } = _;
        te(e)({
            type: De[m],
            id: y,
            x: b,
            y: N,
            ...h !== null && {
                pointerType: h
            }
        })
    };
    return Object.keys(De).filter(l => Number.isNaN(Number(l)) && !l.endsWith("_Departed") && a[l] !== !1).forEach(l => {
        let f = ur(l);
        const p = d(l);
        if (window.PointerEvent) switch (De[l]) {
            case De.MouseDown:
            case De.MouseUp:
                f = f.replace("mouse", "pointer");
                break;
            case De.TouchStart:
            case De.TouchEnd:
                return
        }
        c.push(Fe(f, p, t))
    }), te(() => {
        c.forEach(l => l())
    })
}

function xh({
    scrollCb: e,
    doc: t,
    mirror: n,
    blockClass: r,
    blockSelector: o,
    unblockSelector: s,
    sampling: i
}) {
    const a = te(Wr(te(c => {
        const u = ao(c);
        if (!u || Ve(u, r, o, s, !0)) return;
        const d = n.getId(u);
        if (u === t && t.defaultView) {
            const l = Sh(t.defaultView);
            e({
                id: d,
                x: l.left,
                y: l.top
            })
        } else e({
            id: d,
            x: u.scrollLeft,
            y: u.scrollTop
        })
    }), i.scroll || 100));
    return Fe("scroll", a, t)
}

function oR({
    viewportResizeCb: e
}, {
    win: t
}) {
    let n = -1,
        r = -1;
    const o = te(Wr(te(() => {
        const s = bh(),
            i = Eh();
        (n !== s || r !== i) && (e({
            width: Number(i),
            height: Number(s)
        }), n = s, r = i)
    }), 200));
    return Fe("resize", o, t)
}
const sR = ["INPUT", "TEXTAREA", "SELECT"],
    Zl = new WeakMap;

function iR({
    inputCb: e,
    doc: t,
    mirror: n,
    blockClass: r,
    blockSelector: o,
    unblockSelector: s,
    ignoreClass: i,
    ignoreSelector: a,
    maskInputOptions: c,
    maskInputFn: u,
    sampling: d,
    userTriggeredOnInput: l,
    maskTextClass: f,
    unmaskTextClass: p,
    maskTextSelector: h,
    unmaskTextSelector: m
}) {
    function _(S) {
        let x = ao(S);
        const B = S.isTrusted,
            E = x && Ia(x.tagName);
        if (E === "OPTION" && (x = x.parentElement), !x || !E || sR.indexOf(E) < 0 || Ve(x, r, o, s, !0)) return;
        const O = x;
        if (O.classList.contains(i) || a && O.matches(a)) return;
        const k = $c(x);
        let P = ws(O, E, k),
            D = !1;
        const ee = ii({
                maskInputOptions: c,
                tagName: E,
                type: k
            }),
            Y = lr(x, f, h, p, m, ee);
        (k === "radio" || k === "checkbox") && (D = x.checked), P = Ur({
            isMasked: Y,
            element: x,
            value: P,
            maskInputFn: u
        }), y(x, l ? {
            text: P,
            isChecked: D,
            userTriggered: B
        } : {
            text: P,
            isChecked: D
        });
        const ne = x.name;
        k === "radio" && ne && D && t.querySelectorAll(`input[type="radio"][name="${ne}"]`).forEach(v => {
            if (v !== x) {
                const z = Ur({
                    isMasked: Y,
                    element: v,
                    value: ws(v, E, k),
                    maskInputFn: u
                });
                y(v, l ? {
                    text: z,
                    isChecked: !D,
                    userTriggered: !1
                } : {
                    text: z,
                    isChecked: !D
                })
            }
        })
    }

    function y(S, x) {
        const B = Zl.get(S);
        if (!B || B.text !== x.text || B.isChecked !== x.isChecked) {
            Zl.set(S, x);
            const E = n.getId(S);
            te(e)({ ...x,
                id: E
            })
        }
    }
    const N = (d.input === "last" ? ["change"] : ["input", "change"]).map(S => Fe(S, te(_), t)),
        T = t.defaultView;
    if (!T) return () => {
        N.forEach(S => S())
    };
    const L = T.Object.getOwnPropertyDescriptor(T.HTMLInputElement.prototype, "value"),
        A = [
            [T.HTMLInputElement.prototype, "value"],
            [T.HTMLInputElement.prototype, "checked"],
            [T.HTMLSelectElement.prototype, "value"],
            [T.HTMLTextAreaElement.prototype, "value"],
            [T.HTMLSelectElement.prototype, "selectedIndex"],
            [T.HTMLOptionElement.prototype, "selected"]
        ];
    return L && L.set && N.push(...A.map(S => yh(S[0], S[1], {
        set() {
            te(_)({
                target: this,
                isTrusted: !1
            })
        }
    }, !1, T))), te(() => {
        N.forEach(S => S())
    })
}

function Cs(e) {
    const t = [];

    function n(r, o) {
        if (Ro("CSSGroupingRule") && r.parentRule instanceof CSSGroupingRule || Ro("CSSMediaRule") && r.parentRule instanceof CSSMediaRule || Ro("CSSSupportsRule") && r.parentRule instanceof CSSSupportsRule || Ro("CSSConditionRule") && r.parentRule instanceof CSSConditionRule) {
            const i = Array.from(r.parentRule.cssRules).indexOf(r);
            o.unshift(i)
        } else if (r.parentStyleSheet) {
            const i = Array.from(r.parentStyleSheet.cssRules).indexOf(r);
            o.unshift(i)
        }
        return o
    }
    return n(e, t)
}

function Ht(e, t, n) {
    let r, o;
    return e ? (e.ownerNode ? r = t.getId(e.ownerNode) : o = n.getId(e), {
        styleId: o,
        id: r
    }) : {}
}

function aR({
    styleSheetRuleCb: e,
    mirror: t,
    stylesheetManager: n
}, {
    win: r
}) {
    if (!r.CSSStyleSheet || !r.CSSStyleSheet.prototype) return () => {};
    const o = r.CSSStyleSheet.prototype.insertRule;
    r.CSSStyleSheet.prototype.insertRule = new Proxy(o, {
        apply: te((d, l, f) => {
            const [p, h] = f, {
                id: m,
                styleId: _
            } = Ht(l, t, n.styleMirror);
            return (m && m !== -1 || _ && _ !== -1) && e({
                id: m,
                styleId: _,
                adds: [{
                    rule: p,
                    index: h
                }]
            }), d.apply(l, f)
        })
    });
    const s = r.CSSStyleSheet.prototype.deleteRule;
    r.CSSStyleSheet.prototype.deleteRule = new Proxy(s, {
        apply: te((d, l, f) => {
            const [p] = f, {
                id: h,
                styleId: m
            } = Ht(l, t, n.styleMirror);
            return (h && h !== -1 || m && m !== -1) && e({
                id: h,
                styleId: m,
                removes: [{
                    index: p
                }]
            }), d.apply(l, f)
        })
    });
    let i;
    r.CSSStyleSheet.prototype.replace && (i = r.CSSStyleSheet.prototype.replace, r.CSSStyleSheet.prototype.replace = new Proxy(i, {
        apply: te((d, l, f) => {
            const [p] = f, {
                id: h,
                styleId: m
            } = Ht(l, t, n.styleMirror);
            return (h && h !== -1 || m && m !== -1) && e({
                id: h,
                styleId: m,
                replace: p
            }), d.apply(l, f)
        })
    }));
    let a;
    r.CSSStyleSheet.prototype.replaceSync && (a = r.CSSStyleSheet.prototype.replaceSync, r.CSSStyleSheet.prototype.replaceSync = new Proxy(a, {
        apply: te((d, l, f) => {
            const [p] = f, {
                id: h,
                styleId: m
            } = Ht(l, t, n.styleMirror);
            return (h && h !== -1 || m && m !== -1) && e({
                id: h,
                styleId: m,
                replaceSync: p
            }), d.apply(l, f)
        })
    }));
    const c = {};
    Co("CSSGroupingRule") ? c.CSSGroupingRule = r.CSSGroupingRule : (Co("CSSMediaRule") && (c.CSSMediaRule = r.CSSMediaRule), Co("CSSConditionRule") && (c.CSSConditionRule = r.CSSConditionRule), Co("CSSSupportsRule") && (c.CSSSupportsRule = r.CSSSupportsRule));
    const u = {};
    return Object.entries(c).forEach(([d, l]) => {
        u[d] = {
            insertRule: l.prototype.insertRule,
            deleteRule: l.prototype.deleteRule
        }, l.prototype.insertRule = new Proxy(u[d].insertRule, {
            apply: te((f, p, h) => {
                const [m, _] = h, {
                    id: y,
                    styleId: b
                } = Ht(p.parentStyleSheet, t, n.styleMirror);
                return (y && y !== -1 || b && b !== -1) && e({
                    id: y,
                    styleId: b,
                    adds: [{
                        rule: m,
                        index: [...Cs(p), _ || 0]
                    }]
                }), f.apply(p, h)
            })
        }), l.prototype.deleteRule = new Proxy(u[d].deleteRule, {
            apply: te((f, p, h) => {
                const [m] = h, {
                    id: _,
                    styleId: y
                } = Ht(p.parentStyleSheet, t, n.styleMirror);
                return (_ && _ !== -1 || y && y !== -1) && e({
                    id: _,
                    styleId: y,
                    removes: [{
                        index: [...Cs(p), m]
                    }]
                }), f.apply(p, h)
            })
        })
    }), te(() => {
        r.CSSStyleSheet.prototype.insertRule = o, r.CSSStyleSheet.prototype.deleteRule = s, i && (r.CSSStyleSheet.prototype.replace = i), a && (r.CSSStyleSheet.prototype.replaceSync = a), Object.entries(c).forEach(([d, l]) => {
            l.prototype.insertRule = u[d].insertRule, l.prototype.deleteRule = u[d].deleteRule
        })
    })
}

function Mh({
    mirror: e,
    stylesheetManager: t
}, n) {
    let r = null;
    n.nodeName === "#document" ? r = e.getId(n) : r = e.getId(n.host);
    const o = n.nodeName === "#document" ? n.defaultView ?.Document : n.ownerDocument ?.defaultView ?.ShadowRoot,
        s = o ?.prototype ? Object.getOwnPropertyDescriptor(o ?.prototype, "adoptedStyleSheets") : void 0;
    return r === null || r === -1 || !o || !s ? () => {} : (Object.defineProperty(n, "adoptedStyleSheets", {
        configurable: s.configurable,
        enumerable: s.enumerable,
        get() {
            return s.get ?.call(this)
        },
        set(i) {
            const a = s.set ?.call(this, i);
            if (r !== null && r !== -1) try {
                t.adoptStyleSheets(i, r)
            } catch {}
            return a
        }
    }), te(() => {
        Object.defineProperty(n, "adoptedStyleSheets", {
            configurable: s.configurable,
            enumerable: s.enumerable,
            get: s.get,
            set: s.set
        })
    }))
}

function cR({
    styleDeclarationCb: e,
    mirror: t,
    ignoreCSSAttributes: n,
    stylesheetManager: r
}, {
    win: o
}) {
    const s = o.CSSStyleDeclaration.prototype.setProperty;
    o.CSSStyleDeclaration.prototype.setProperty = new Proxy(s, {
        apply: te((a, c, u) => {
            const [d, l, f] = u;
            if (n.has(d)) return s.apply(c, [d, l, f]);
            const {
                id: p,
                styleId: h
            } = Ht(c.parentRule ?.parentStyleSheet, t, r.styleMirror);
            return (p && p !== -1 || h && h !== -1) && e({
                id: p,
                styleId: h,
                set: {
                    property: d,
                    value: l,
                    priority: f
                },
                index: Cs(c.parentRule)
            }), a.apply(c, u)
        })
    });
    const i = o.CSSStyleDeclaration.prototype.removeProperty;
    return o.CSSStyleDeclaration.prototype.removeProperty = new Proxy(i, {
        apply: te((a, c, u) => {
            const [d] = u;
            if (n.has(d)) return i.apply(c, [d]);
            const {
                id: l,
                styleId: f
            } = Ht(c.parentRule ?.parentStyleSheet, t, r.styleMirror);
            return (l && l !== -1 || f && f !== -1) && e({
                id: l,
                styleId: f,
                remove: {
                    property: d
                },
                index: Cs(c.parentRule)
            }), a.apply(c, u)
        })
    }), te(() => {
        o.CSSStyleDeclaration.prototype.setProperty = s, o.CSSStyleDeclaration.prototype.removeProperty = i
    })
}

function uR({
    mediaInteractionCb: e,
    blockClass: t,
    blockSelector: n,
    unblockSelector: r,
    mirror: o,
    sampling: s,
    doc: i
}) {
    const a = te(u => Wr(te(d => {
            const l = ao(d);
            if (!l || Ve(l, t, n, r, !0)) return;
            const {
                currentTime: f,
                volume: p,
                muted: h,
                playbackRate: m
            } = l;
            e({
                type: u,
                id: o.getId(l),
                currentTime: f,
                volume: p,
                muted: h,
                playbackRate: m
            })
        }), s.media || 500)),
        c = [Fe("play", a(Wn.Play), i), Fe("pause", a(Wn.Pause), i), Fe("seeked", a(Wn.Seeked), i), Fe("volumechange", a(Wn.VolumeChange), i), Fe("ratechange", a(Wn.RateChange), i)];
    return te(() => {
        c.forEach(u => u())
    })
}

function lR({
    fontCb: e,
    doc: t
}) {
    const n = t.defaultView;
    if (!n) return () => {};
    const r = [],
        o = new WeakMap,
        s = n.FontFace;
    n.FontFace = function(c, u, d) {
        const l = new s(c, u, d);
        return o.set(l, {
            family: c,
            buffer: typeof u != "string",
            descriptors: d,
            fontSource: typeof u == "string" ? u : JSON.stringify(Array.from(new Uint8Array(u)))
        }), l
    };
    const i = Uc(t.fonts, "add", function(a) {
        return function(c) {
            return ci(te(() => {
                const u = o.get(c);
                u && (e(u), o.delete(c))
            }), 0), a.apply(this, [c])
        }
    });
    return r.push(() => {
        n.FontFace = s
    }), r.push(i), te(() => {
        r.forEach(a => a())
    })
}

function dR(e) {
    const {
        doc: t,
        mirror: n,
        blockClass: r,
        blockSelector: o,
        unblockSelector: s,
        selectionCb: i
    } = e;
    let a = !0;
    const c = te(() => {
        const u = t.getSelection();
        if (!u || a && u ?.isCollapsed) return;
        a = u.isCollapsed || !1;
        const d = [],
            l = u.rangeCount || 0;
        for (let f = 0; f < l; f++) {
            const p = u.getRangeAt(f),
                {
                    startContainer: h,
                    startOffset: m,
                    endContainer: _,
                    endOffset: y
                } = p;
            Ve(h, r, o, s, !0) || Ve(_, r, o, s, !0) || d.push({
                start: n.getId(h),
                startOffset: m,
                end: n.getId(_),
                endOffset: y
            })
        }
        i({
            ranges: d
        })
    });
    return c(), Fe("selectionchange", c)
}

function fR({
    doc: e,
    customElementCb: t
}) {
    const n = e.defaultView;
    return !n || !n.customElements ? () => {} : Uc(n.customElements, "define", function(o) {
        return function(s, i, a) {
            try {
                t({
                    define: {
                        name: s
                    }
                })
            } catch {}
            return o.apply(this, [s, i, a])
        }
    })
}

function pR(e, t = {}) {
    const n = e.doc.defaultView;
    if (!n) return () => {};
    let r;
    e.recordDOM && (r = Ah(e, e.doc));
    const o = nR(e),
        s = rR(e),
        i = xh(e),
        a = oR(e, {
            win: n
        }),
        c = iR(e),
        u = uR(e);
    let d = () => {},
        l = () => {},
        f = () => {},
        p = () => {};
    e.recordDOM && (d = aR(e, {
        win: n
    }), l = Mh(e, e.doc), f = cR(e, {
        win: n
    }), e.collectFonts && (p = lR(e)));
    const h = dR(e),
        m = fR(e),
        _ = [];
    for (const y of e.plugins) _.push(y.observer(y.callback, n, y.options));
    return te(() => {
        Vn.forEach(y => y.reset()), r ?.disconnect(), o(), s(), i(), a(), c(), u(), d(), l(), f(), p(), h(), m(), _.forEach(y => y())
    })
}

function Ro(e) {
    return typeof window[e] < "u"
}

function Co(e) {
    return !!(typeof window[e] < "u" && window[e].prototype && "insertRule" in window[e].prototype && "deleteRule" in window[e].prototype)
}
class Aa {
    constructor(t) {
        this.generateIdFn = t, this.iframeIdToRemoteIdMap = new WeakMap, this.iframeRemoteIdToIdMap = new WeakMap
    }
    getId(t, n, r, o) {
        const s = r || this.getIdToRemoteIdMap(t),
            i = o || this.getRemoteIdToIdMap(t);
        let a = s.get(n);
        return a || (a = this.generateIdFn(), s.set(n, a), i.set(a, n)), a
    }
    getIds(t, n) {
        const r = this.getIdToRemoteIdMap(t),
            o = this.getRemoteIdToIdMap(t);
        return n.map(s => this.getId(t, s, r, o))
    }
    getRemoteId(t, n, r) {
        const o = r || this.getRemoteIdToIdMap(t);
        if (typeof n != "number") return n;
        const s = o.get(n);
        return s || -1
    }
    getRemoteIds(t, n) {
        const r = this.getRemoteIdToIdMap(t);
        return n.map(o => this.getRemoteId(t, o, r))
    }
    reset(t) {
        if (!t) {
            this.iframeIdToRemoteIdMap = new WeakMap, this.iframeRemoteIdToIdMap = new WeakMap;
            return
        }
        this.iframeIdToRemoteIdMap.delete(t), this.iframeRemoteIdToIdMap.delete(t)
    }
    getIdToRemoteIdMap(t) {
        let n = this.iframeIdToRemoteIdMap.get(t);
        return n || (n = new Map, this.iframeIdToRemoteIdMap.set(t, n)), n
    }
    getRemoteIdToIdMap(t) {
        let n = this.iframeRemoteIdToIdMap.get(t);
        return n || (n = new Map, this.iframeRemoteIdToIdMap.set(t, n)), n
    }
}
class hR {
    constructor() {
        this.crossOriginIframeMirror = new Aa(Bc), this.crossOriginIframeRootIdMap = new WeakMap
    }
    addIframe() {}
    addLoadListener() {}
    attachIframe() {}
}
class mR {
    constructor(t) {
        this.iframes = new WeakMap, this.crossOriginIframeMap = new WeakMap, this.crossOriginIframeMirror = new Aa(Bc), this.crossOriginIframeRootIdMap = new WeakMap, this.mutationCb = t.mutationCb, this.wrappedEmit = t.wrappedEmit, this.stylesheetManager = t.stylesheetManager, this.recordCrossOriginIframes = t.recordCrossOriginIframes, this.crossOriginIframeStyleMirror = new Aa(this.stylesheetManager.styleMirror.generateId.bind(this.stylesheetManager.styleMirror)), this.mirror = t.mirror, this.recordCrossOriginIframes && window.addEventListener("message", this.handleMessage.bind(this))
    }
    addIframe(t) {
        this.iframes.set(t, !0), t.contentWindow && this.crossOriginIframeMap.set(t.contentWindow, t)
    }
    addLoadListener(t) {
        this.loadListener = t
    }
    attachIframe(t, n) {
        this.mutationCb({
            adds: [{
                parentId: this.mirror.getId(t),
                nextId: null,
                node: n
            }],
            removes: [],
            texts: [],
            attributes: [],
            isAttachIframe: !0
        }), this.recordCrossOriginIframes && t.contentWindow ?.addEventListener("message", this.handleMessage.bind(this)), this.loadListener ?.(t);
        const r = Wc(t);
        r && r.adoptedStyleSheets && r.adoptedStyleSheets.length > 0 && this.stylesheetManager.adoptStyleSheets(r.adoptedStyleSheets, this.mirror.getId(r))
    }
    handleMessage(t) {
        const n = t;
        if (n.data.type !== "rrweb" || n.origin !== n.data.origin || !t.source) return;
        const o = this.crossOriginIframeMap.get(t.source);
        if (!o) return;
        const s = this.transformCrossOriginEvent(o, n.data.event);
        s && this.wrappedEmit(s, n.data.isCheckout)
    }
    transformCrossOriginEvent(t, n) {
        switch (n.type) {
            case J.FullSnapshot:
                {
                    this.crossOriginIframeMirror.reset(t),
                    this.crossOriginIframeStyleMirror.reset(t),
                    this.replaceIdOnNode(n.data.node, t);
                    const r = n.data.node.id;
                    return this.crossOriginIframeRootIdMap.set(t, r),
                    this.patchRootIdOnNode(n.data.node, r),
                    {
                        timestamp: n.timestamp,
                        type: J.IncrementalSnapshot,
                        data: {
                            source: W.Mutation,
                            adds: [{
                                parentId: this.mirror.getId(t),
                                nextId: null,
                                node: n.data.node
                            }],
                            removes: [],
                            texts: [],
                            attributes: [],
                            isAttachIframe: !0
                        }
                    }
                }
            case J.Meta:
            case J.Load:
            case J.DomContentLoaded:
                return !1;
            case J.Plugin:
                return n;
            case J.Custom:
                return this.replaceIds(n.data.payload, t, ["id", "parentId", "previousId", "nextId"]), n;
            case J.IncrementalSnapshot:
                switch (n.data.source) {
                    case W.Mutation:
                        return n.data.adds.forEach(r => {
                            this.replaceIds(r, t, ["parentId", "nextId", "previousId"]), this.replaceIdOnNode(r.node, t);
                            const o = this.crossOriginIframeRootIdMap.get(t);
                            o && this.patchRootIdOnNode(r.node, o)
                        }), n.data.removes.forEach(r => {
                            this.replaceIds(r, t, ["parentId", "id"])
                        }), n.data.attributes.forEach(r => {
                            this.replaceIds(r, t, ["id"])
                        }), n.data.texts.forEach(r => {
                            this.replaceIds(r, t, ["id"])
                        }), n;
                    case W.Drag:
                    case W.TouchMove:
                    case W.MouseMove:
                        return n.data.positions.forEach(r => {
                            this.replaceIds(r, t, ["id"])
                        }), n;
                    case W.ViewportResize:
                        return !1;
                    case W.MediaInteraction:
                    case W.MouseInteraction:
                    case W.Scroll:
                    case W.CanvasMutation:
                    case W.Input:
                        return this.replaceIds(n.data, t, ["id"]), n;
                    case W.StyleSheetRule:
                    case W.StyleDeclaration:
                        return this.replaceIds(n.data, t, ["id"]), this.replaceStyleIds(n.data, t, ["styleId"]), n;
                    case W.Font:
                        return n;
                    case W.Selection:
                        return n.data.ranges.forEach(r => {
                            this.replaceIds(r, t, ["start", "end"])
                        }), n;
                    case W.AdoptedStyleSheet:
                        return this.replaceIds(n.data, t, ["id"]), this.replaceStyleIds(n.data, t, ["styleIds"]), n.data.styles ?.forEach(r => {
                            this.replaceStyleIds(r, t, ["styleId"])
                        }), n
                }
        }
        return !1
    }
    replace(t, n, r, o) {
        for (const s of o) !Array.isArray(n[s]) && typeof n[s] != "number" || (Array.isArray(n[s]) ? n[s] = t.getIds(r, n[s]) : n[s] = t.getId(r, n[s]));
        return n
    }
    replaceIds(t, n, r) {
        return this.replace(this.crossOriginIframeMirror, t, n, r)
    }
    replaceStyleIds(t, n, r) {
        return this.replace(this.crossOriginIframeStyleMirror, t, n, r)
    }
    replaceIdOnNode(t, n) {
        this.replaceIds(t, n, ["id", "rootId"]), "childNodes" in t && t.childNodes.forEach(r => {
            this.replaceIdOnNode(r, n)
        })
    }
    patchRootIdOnNode(t, n) {
        t.type !== Te.Document && !t.rootId && (t.rootId = n), "childNodes" in t && t.childNodes.forEach(r => {
            this.patchRootIdOnNode(r, n)
        })
    }
}
class gR {
    init() {}
    addShadowRoot() {}
    observeAttachShadow() {}
    reset() {}
}
class _R {
    constructor(t) {
        this.shadowDoms = new WeakSet, this.restoreHandlers = [], this.mutationCb = t.mutationCb, this.scrollCb = t.scrollCb, this.bypassOptions = t.bypassOptions, this.mirror = t.mirror, this.init()
    }
    init() {
        this.reset(), this.patchAttachShadow(Element, document)
    }
    addShadowRoot(t, n) {
        if (!Pr(t) || this.shadowDoms.has(t)) return;
        this.shadowDoms.add(t), this.bypassOptions.canvasManager.addShadowRoot(t);
        const r = Ah({ ...this.bypassOptions,
            doc: n,
            mutationCb: this.mutationCb,
            mirror: this.mirror,
            shadowDomManager: this
        }, t);
        this.restoreHandlers.push(() => r.disconnect()), this.restoreHandlers.push(xh({ ...this.bypassOptions,
            scrollCb: this.scrollCb,
            doc: t,
            mirror: this.mirror
        })), ci(() => {
            t.adoptedStyleSheets && t.adoptedStyleSheets.length > 0 && this.bypassOptions.stylesheetManager.adoptStyleSheets(t.adoptedStyleSheets, this.mirror.getId(t.host)), this.restoreHandlers.push(Mh({
                mirror: this.mirror,
                stylesheetManager: this.bypassOptions.stylesheetManager
            }, t))
        }, 0)
    }
    observeAttachShadow(t) {
        const n = Wc(t),
            r = Yk(t);
        !n || !r || this.patchAttachShadow(r.Element, n)
    }
    patchAttachShadow(t, n) {
        const r = this;
        this.restoreHandlers.push(Uc(t.prototype, "attachShadow", function(o) {
            return function(s) {
                const i = o.call(this, s);
                return this.shadowRoot && Rh(this) && r.addShadowRoot(this.shadowRoot, n), i
            }
        }))
    }
    reset() {
        this.restoreHandlers.forEach(t => {
            try {
                t()
            } catch {}
        }), this.restoreHandlers = [], this.shadowDoms = new WeakSet, this.bypassOptions.canvasManager.resetShadowRoots()
    }
}
var ed = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    yR = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var Ao = 0; Ao < ed.length; Ao++) yR[ed.charCodeAt(Ao)] = Ao;
class td {
    reset() {}
    freeze() {}
    unfreeze() {}
    lock() {}
    unlock() {}
    snapshot() {}
    addWindow() {}
    addShadowRoot() {}
    resetShadowRoots() {}
}
class SR {
    constructor(t) {
        this.trackedLinkElements = new WeakSet, this.styleMirror = new qk, this.mutationCb = t.mutationCb, this.adoptedStyleSheetCb = t.adoptedStyleSheetCb
    }
    attachLinkElement(t, n) {
        "_cssText" in n.attributes && this.mutationCb({
            adds: [],
            removes: [],
            texts: [],
            attributes: [{
                id: n.id,
                attributes: n.attributes
            }]
        }), this.trackLinkElement(t)
    }
    trackLinkElement(t) {
        this.trackedLinkElements.has(t) || (this.trackedLinkElements.add(t), this.trackStylesheetInLinkElement(t))
    }
    adoptStyleSheets(t, n) {
        if (t.length === 0) return;
        const r = {
                id: n,
                styleIds: []
            },
            o = [];
        for (const s of t) {
            let i;
            this.styleMirror.has(s) ? i = this.styleMirror.getId(s) : (i = this.styleMirror.add(s), o.push({
                styleId: i,
                rules: Array.from(s.rules || CSSRule, (a, c) => ({
                    rule: lh(a),
                    index: c
                }))
            })), r.styleIds.push(i)
        }
        o.length > 0 && (r.styles = o), this.adoptedStyleSheetCb(r)
    }
    reset() {
        this.styleMirror.reset(), this.trackedLinkElements = new WeakSet
    }
    trackStylesheetInLinkElement(t) {}
}
class bR {
    constructor() {
        this.nodeMap = new WeakMap, this.active = !1
    }
    inOtherBuffer(t, n) {
        const r = this.nodeMap.get(t);
        return r && Array.from(r).some(o => o !== n)
    }
    add(t, n) {
        this.active || (this.active = !0, Jk(() => {
            this.nodeMap = new WeakMap, this.active = !1
        })), this.nodeMap.set(t, (this.nodeMap.get(t) || new Set).add(n))
    }
    destroy() {}
}
let ye, As;
try {
    if (Array.from([1], e => e * 2)[0] !== 2) {
        const e = document.createElement("iframe");
        document.body.appendChild(e), Array.from = e.contentWindow ?.Array.from || Array.from, document.body.removeChild(e)
    }
} catch (e) {
    console.debug("Unable to override Array.from", e)
}
const nt = yk();

function Ct(e = {}) {
    const {
        emit: t,
        checkoutEveryNms: n,
        checkoutEveryNth: r,
        blockClass: o = "rr-block",
        blockSelector: s = null,
        unblockSelector: i = null,
        ignoreClass: a = "rr-ignore",
        ignoreSelector: c = null,
        maskAllText: u = !1,
        maskTextClass: d = "rr-mask",
        unmaskTextClass: l = null,
        maskTextSelector: f = null,
        unmaskTextSelector: p = null,
        inlineStylesheet: h = !0,
        maskAllInputs: m,
        maskInputOptions: _,
        slimDOMOptions: y,
        maskAttributeFn: b,
        maskInputFn: N,
        maskTextFn: T,
        maxCanvasSize: L = null,
        packFn: A,
        sampling: S = {},
        dataURLOptions: x = {},
        mousemoveWait: B,
        recordDOM: E = !0,
        recordCanvas: O = !1,
        recordCrossOriginIframes: k = !1,
        recordAfter: P = e.recordAfter === "DOMContentLoaded" ? e.recordAfter : "load",
        userTriggeredOnInput: D = !1,
        collectFonts: ee = !1,
        inlineImages: Y = !1,
        plugins: ne,
        keepIframeSrcFn: v = () => !1,
        ignoreCSSAttributes: z = new Set([]),
        errorHandler: w,
        onMutation: V,
        getCanvasManager: se
    } = e;
    eR(w);
    const re = k ? window.parent === window : !0;
    let ve = !1;
    if (!re) try {
        window.parent.document && (ve = !1)
    } catch {
        ve = !0
    }
    if (re && !t) throw new Error("emit function is required");
    if (!re && !ve) return () => {};
    B !== void 0 && S.mousemove === void 0 && (S.mousemove = B), nt.reset();
    const Pe = m === !0 ? {
            color: !0,
            date: !0,
            "datetime-local": !0,
            email: !0,
            month: !0,
            number: !0,
            range: !0,
            search: !0,
            tel: !0,
            text: !0,
            time: !0,
            url: !0,
            week: !0,
            textarea: !0,
            select: !0,
            radio: !0,
            checkbox: !0
        } : _ !== void 0 ? _ : {},
        Ft = y === !0 || y === "all" ? {
            script: !0,
            comment: !0,
            headFavicon: !0,
            headWhitespace: !0,
            headMetaSocial: !0,
            headMetaRobots: !0,
            headMetaHttpEquiv: !0,
            headMetaVerification: !0,
            headMetaAuthorship: y === "all",
            headMetaDescKeywords: y === "all"
        } : y || {};
    zk();
    let Le, Be = 0;
    const dt = X => {
        for (const ze of ne || []) ze.eventProcessor && (X = ze.eventProcessor(X));
        return A && !ve && (X = A(X)), X
    };
    ye = (X, ze) => {
        const Q = X;
        if (Q.timestamp = Rs(), Vn[0] ?.isFrozen() && Q.type !== J.FullSnapshot && !(Q.type === J.IncrementalSnapshot && Q.data.source === W.Mutation) && Vn.forEach(Ae => Ae.unfreeze()), re) t ?.(dt(Q), ze);
        else if (ve) {
            const Ae = {
                type: "rrweb",
                event: dt(Q),
                origin: window.location.origin,
                isCheckout: ze
            };
            window.parent.postMessage(Ae, "*")
        }
        if (Q.type === J.FullSnapshot) Le = Q, Be = 0;
        else if (Q.type === J.IncrementalSnapshot) {
            if (Q.data.source === W.Mutation && Q.data.isAttachIframe) return;
            Be++;
            const Ae = r && Be >= r,
                oe = n && Le && Q.timestamp - Le.timestamp > n;
            (Ae || oe) && ft(!0)
        }
    };
    const $t = X => {
            ye({
                type: J.IncrementalSnapshot,
                data: {
                    source: W.Mutation,
                    ...X
                }
            })
        },
        vr = X => ye({
            type: J.IncrementalSnapshot,
            data: {
                source: W.Scroll,
                ...X
            }
        }),
        mo = X => ye({
            type: J.IncrementalSnapshot,
            data: {
                source: W.CanvasMutation,
                ...X
            }
        }),
        Tr = X => ye({
            type: J.IncrementalSnapshot,
            data: {
                source: W.AdoptedStyleSheet,
                ...X
            }
        }),
        ie = new SR({
            mutationCb: $t,
            adoptedStyleSheetCb: Tr
        }),
        me = typeof __RRWEB_EXCLUDE_IFRAME__ == "boolean" && __RRWEB_EXCLUDE_IFRAME__ ? new hR : new mR({
            mirror: nt,
            mutationCb: $t,
            stylesheetManager: ie,
            recordCrossOriginIframes: k,
            wrappedEmit: ye
        });
    for (const X of ne || []) X.getMirror && X.getMirror({
        nodeMirror: nt,
        crossOriginIframeMirror: me.crossOriginIframeMirror,
        crossOriginIframeStyleMirror: me.crossOriginIframeStyleMirror
    });
    const Ye = new bR,
        Ce = vR(se, {
            mirror: nt,
            win: window,
            mutationCb: X => ye({
                type: J.IncrementalSnapshot,
                data: {
                    source: W.CanvasMutation,
                    ...X
                }
            }),
            recordCanvas: O,
            blockClass: o,
            blockSelector: s,
            unblockSelector: i,
            maxCanvasSize: L,
            sampling: S.canvas,
            dataURLOptions: x,
            errorHandler: w
        }),
        Me = typeof __RRWEB_EXCLUDE_SHADOW_DOM__ == "boolean" && __RRWEB_EXCLUDE_SHADOW_DOM__ ? new gR : new _R({
            mutationCb: $t,
            scrollCb: vr,
            bypassOptions: {
                onMutation: V,
                blockClass: o,
                blockSelector: s,
                unblockSelector: i,
                maskAllText: u,
                maskTextClass: d,
                unmaskTextClass: l,
                maskTextSelector: f,
                unmaskTextSelector: p,
                inlineStylesheet: h,
                maskInputOptions: Pe,
                dataURLOptions: x,
                maskAttributeFn: b,
                maskTextFn: T,
                maskInputFn: N,
                recordCanvas: O,
                inlineImages: Y,
                sampling: S,
                slimDOMOptions: Ft,
                iframeManager: me,
                stylesheetManager: ie,
                canvasManager: Ce,
                keepIframeSrcFn: v,
                processedNodeManager: Ye,
                ignoreCSSAttributes: z
            },
            mirror: nt
        }),
        ft = (X = !1) => {
            if (!E) return;
            ye({
                type: J.Meta,
                data: {
                    href: window.location.href,
                    width: Eh(),
                    height: bh()
                }
            }, X), ie.reset(), Me.init(), Vn.forEach(Q => Q.lock());
            const ze = Wk(document, {
                mirror: nt,
                blockClass: o,
                blockSelector: s,
                unblockSelector: i,
                maskAllText: u,
                maskTextClass: d,
                unmaskTextClass: l,
                maskTextSelector: f,
                unmaskTextSelector: p,
                inlineStylesheet: h,
                maskAllInputs: Pe,
                maskAttributeFn: b,
                maskInputFn: N,
                maskTextFn: T,
                slimDOM: Ft,
                dataURLOptions: x,
                recordCanvas: O,
                inlineImages: Y,
                onSerialize: Q => {
                    Ih(Q, nt) && me.addIframe(Q), wh(Q, nt) && ie.trackLinkElement(Q), Ra(Q) && Me.addShadowRoot(Q.shadowRoot, document)
                },
                onIframeLoad: (Q, Ae) => {
                    me.attachIframe(Q, Ae), Q.contentWindow && Ce.addWindow(Q.contentWindow), Me.observeAttachShadow(Q)
                },
                onStylesheetLoad: (Q, Ae) => {
                    ie.attachLinkElement(Q, Ae)
                },
                onBlockedImageLoad: (Q, Ae, {
                    width: oe,
                    height: Ir
                }) => {
                    $t({
                        adds: [],
                        removes: [],
                        texts: [],
                        attributes: [{
                            id: Ae.id,
                            attributes: {
                                style: {
                                    width: `${oe}px`,
                                    height: `${Ir}px`
                                }
                            }
                        }]
                    })
                },
                keepIframeSrcFn: v,
                ignoreCSSAttributes: z
            });
            if (!ze) return console.warn("Failed to snapshot the document");
            ye({
                type: J.FullSnapshot,
                data: {
                    node: ze,
                    initialOffset: Sh(window)
                }
            }), Vn.forEach(Q => Q.unlock()), document.adoptedStyleSheets && document.adoptedStyleSheets.length > 0 && ie.adoptStyleSheets(document.adoptedStyleSheets, nt.getId(document))
        };
    As = ft;
    try {
        const X = [],
            ze = Ae => te(pR)({
                onMutation: V,
                mutationCb: $t,
                mousemoveCb: (oe, Ir) => ye({
                    type: J.IncrementalSnapshot,
                    data: {
                        source: Ir,
                        positions: oe
                    }
                }),
                mouseInteractionCb: oe => ye({
                    type: J.IncrementalSnapshot,
                    data: {
                        source: W.MouseInteraction,
                        ...oe
                    }
                }),
                scrollCb: vr,
                viewportResizeCb: oe => ye({
                    type: J.IncrementalSnapshot,
                    data: {
                        source: W.ViewportResize,
                        ...oe
                    }
                }),
                inputCb: oe => ye({
                    type: J.IncrementalSnapshot,
                    data: {
                        source: W.Input,
                        ...oe
                    }
                }),
                mediaInteractionCb: oe => ye({
                    type: J.IncrementalSnapshot,
                    data: {
                        source: W.MediaInteraction,
                        ...oe
                    }
                }),
                styleSheetRuleCb: oe => ye({
                    type: J.IncrementalSnapshot,
                    data: {
                        source: W.StyleSheetRule,
                        ...oe
                    }
                }),
                styleDeclarationCb: oe => ye({
                    type: J.IncrementalSnapshot,
                    data: {
                        source: W.StyleDeclaration,
                        ...oe
                    }
                }),
                canvasMutationCb: mo,
                fontCb: oe => ye({
                    type: J.IncrementalSnapshot,
                    data: {
                        source: W.Font,
                        ...oe
                    }
                }),
                selectionCb: oe => {
                    ye({
                        type: J.IncrementalSnapshot,
                        data: {
                            source: W.Selection,
                            ...oe
                        }
                    })
                },
                customElementCb: oe => {
                    ye({
                        type: J.IncrementalSnapshot,
                        data: {
                            source: W.CustomElement,
                            ...oe
                        }
                    })
                },
                blockClass: o,
                ignoreClass: a,
                ignoreSelector: c,
                maskAllText: u,
                maskTextClass: d,
                unmaskTextClass: l,
                maskTextSelector: f,
                unmaskTextSelector: p,
                maskInputOptions: Pe,
                inlineStylesheet: h,
                sampling: S,
                recordDOM: E,
                recordCanvas: O,
                inlineImages: Y,
                userTriggeredOnInput: D,
                collectFonts: ee,
                doc: Ae,
                maskAttributeFn: b,
                maskInputFn: N,
                maskTextFn: T,
                keepIframeSrcFn: v,
                blockSelector: s,
                unblockSelector: i,
                slimDOMOptions: Ft,
                dataURLOptions: x,
                mirror: nt,
                iframeManager: me,
                stylesheetManager: ie,
                shadowDomManager: Me,
                processedNodeManager: Ye,
                canvasManager: Ce,
                ignoreCSSAttributes: z,
                plugins: ne ?.filter(oe => oe.observer) ?.map(oe => ({
                    observer: oe.observer,
                    options: oe.options,
                    callback: Ir => ye({
                        type: J.Plugin,
                        data: {
                            plugin: oe.name,
                            payload: Ir
                        }
                    })
                })) || []
            }, {});
        me.addLoadListener(Ae => {
            try {
                X.push(ze(Ae.contentDocument))
            } catch (oe) {
                console.warn(oe)
            }
        });
        const Q = () => {
            ft(), X.push(ze(document))
        };
        return document.readyState === "interactive" || document.readyState === "complete" ? Q() : (X.push(Fe("DOMContentLoaded", () => {
            ye({
                type: J.DomContentLoaded,
                data: {}
            }), P === "DOMContentLoaded" && Q()
        })), X.push(Fe("load", () => {
            ye({
                type: J.Load,
                data: {}
            }), P === "load" && Q()
        }, window))), () => {
            X.forEach(Ae => Ae()), Ye.destroy(), As = void 0, tR()
        }
    } catch (X) {
        console.warn(X)
    }
}

function ER(e) {
    if (!As) throw new Error("please take full snapshot after start recording");
    As(e)
}
Ct.mirror = nt;
Ct.takeFullSnapshot = ER;

function vR(e, t) {
    try {
        return e ? e(t) : new td
    } catch {
        return console.warn("Unable to initialize CanvasManager"), new td
    }
}
var nd;
(function(e) {
    e[e.NotStarted = 0] = "NotStarted", e[e.Running = 1] = "Running", e[e.Stopped = 2] = "Stopped"
})(nd || (nd = {}));
const TR = 3,
    IR = 5;

function jc(e) {
    return e > 9999999999 ? e : e * 1e3
}

function ji(e) {
    return e > 9999999999 ? e / 1e3 : e
}

function co(e, t) {
    t.category !== "sentry.transaction" && (["ui.click", "ui.input"].includes(t.category) ? e.triggerUserActivity() : e.checkAndHandleExpiredSession(), e.addUpdate(() => (e.throttledAddEvent({
        type: J.Custom,
        timestamp: (t.timestamp || 0) * 1e3,
        data: {
            tag: "breadcrumb",
            payload: Ge(t, 10, 1e3)
        }
    }), t.category === "console")))
}
const wR = "button,a";

function Nh(e) {
    return e.closest(wR) || e
}

function Oh(e) {
    const t = Ph(e);
    return !t || !(t instanceof Element) ? t : Nh(t)
}

function Ph(e) {
    return kR(e) ? e.target : e
}

function kR(e) {
    return typeof e == "object" && !!e && "target" in e
}
let Wt;

function RR(e) {
    return Wt || (Wt = [], CR()), Wt.push(e), () => {
        const t = Wt ? Wt.indexOf(e) : -1;
        t > -1 && Wt.splice(t, 1)
    }
}

function CR() {
    xe(fe, "open", function(e) {
        return function(...t) {
            if (Wt) try {
                Wt.forEach(n => n())
            } catch {}
            return e.apply(fe, t)
        }
    })
}
const AR = new Set([W.Mutation, W.StyleSheetRule, W.StyleDeclaration, W.AdoptedStyleSheet, W.CanvasMutation, W.Selection, W.MediaInteraction]);

function xR(e, t, n) {
    e.handleClick(t, n)
}
class MR {
    constructor(t, n, r = co) {
        this._lastMutation = 0, this._lastScroll = 0, this._clicks = [], this._timeout = n.timeout / 1e3, this._threshold = n.threshold / 1e3, this._scrollTimeout = n.scrollTimeout / 1e3, this._replay = t, this._ignoreSelector = n.ignoreSelector, this._addBreadcrumbEvent = r
    }
    addListeners() {
        const t = RR(() => {
            this._lastMutation = rd()
        });
        this._teardown = () => {
            t(), this._clicks = [], this._lastMutation = 0, this._lastScroll = 0
        }
    }
    removeListeners() {
        this._teardown && this._teardown(), this._checkClickTimeout && clearTimeout(this._checkClickTimeout)
    }
    handleClick(t, n) {
        if (OR(n, this._ignoreSelector) || !PR(t)) return;
        const r = {
            timestamp: ji(t.timestamp),
            clickBreadcrumb: t,
            clickCount: 0,
            node: n
        };
        this._clicks.some(o => o.node === r.node && Math.abs(o.timestamp - r.timestamp) < 1) || (this._clicks.push(r), this._clicks.length === 1 && this._scheduleCheckClicks())
    }
    registerMutation(t = Date.now()) {
        this._lastMutation = ji(t)
    }
    registerScroll(t = Date.now()) {
        this._lastScroll = ji(t)
    }
    registerClick(t) {
        const n = Nh(t);
        this._handleMultiClick(n)
    }
    _handleMultiClick(t) {
        this._getClicks(t).forEach(n => {
            n.clickCount++
        })
    }
    _getClicks(t) {
        return this._clicks.filter(n => n.node === t)
    }
    _checkClicks() {
        const t = [],
            n = rd();
        this._clicks.forEach(r => {
            !r.mutationAfter && this._lastMutation && (r.mutationAfter = r.timestamp <= this._lastMutation ? this._lastMutation - r.timestamp : void 0), !r.scrollAfter && this._lastScroll && (r.scrollAfter = r.timestamp <= this._lastScroll ? this._lastScroll - r.timestamp : void 0), r.timestamp + this._timeout <= n && t.push(r)
        });
        for (const r of t) {
            const o = this._clicks.indexOf(r);
            o > -1 && (this._generateBreadcrumbs(r), this._clicks.splice(o, 1))
        }
        this._clicks.length && this._scheduleCheckClicks()
    }
    _generateBreadcrumbs(t) {
        const n = this._replay,
            r = t.scrollAfter && t.scrollAfter <= this._scrollTimeout,
            o = t.mutationAfter && t.mutationAfter <= this._threshold,
            s = !r && !o,
            {
                clickCount: i,
                clickBreadcrumb: a
            } = t;
        if (s) {
            const c = Math.min(t.mutationAfter || this._timeout, this._timeout) * 1e3,
                u = c < this._timeout * 1e3 ? "mutation" : "timeout",
                d = {
                    type: "default",
                    message: a.message,
                    timestamp: a.timestamp,
                    category: "ui.slowClickDetected",
                    data: { ...a.data,
                        url: fe.location.href,
                        route: n.getCurrentRoute(),
                        timeAfterClickMs: c,
                        endReason: u,
                        clickCount: i || 1
                    }
                };
            this._addBreadcrumbEvent(n, d);
            return
        }
        if (i > 1) {
            const c = {
                type: "default",
                message: a.message,
                timestamp: a.timestamp,
                category: "ui.multiClick",
                data: { ...a.data,
                    url: fe.location.href,
                    route: n.getCurrentRoute(),
                    clickCount: i,
                    metric: !0
                }
            };
            this._addBreadcrumbEvent(n, c)
        }
    }
    _scheduleCheckClicks() {
        this._checkClickTimeout && clearTimeout(this._checkClickTimeout), this._checkClickTimeout = io(() => this._checkClicks(), 1e3)
    }
}
const NR = ["A", "BUTTON", "INPUT"];

function OR(e, t) {
    return !!(!NR.includes(e.tagName) || e.tagName === "INPUT" && !["submit", "button"].includes(e.getAttribute("type") || "") || e.tagName === "A" && (e.hasAttribute("download") || e.hasAttribute("target") && e.getAttribute("target") !== "_self") || t && e.matches(t))
}

function PR(e) {
    return !!(e.data && typeof e.data.nodeId == "number" && e.timestamp)
}

function rd() {
    return Date.now() / 1e3
}

function LR(e, t) {
    try {
        if (!DR(t)) return;
        const {
            source: n
        } = t.data;
        if (AR.has(n) && e.registerMutation(t.timestamp), n === W.Scroll && e.registerScroll(t.timestamp), FR(t)) {
            const {
                type: r,
                id: o
            } = t.data, s = Ct.mirror.getNode(o);
            s instanceof HTMLElement && r === De.Click && e.registerClick(s)
        }
    } catch {}
}

function DR(e) {
    return e.type === TR
}

function FR(e) {
    return e.data.source === W.MouseInteraction
}

function ht(e) {
    return {
        timestamp: Date.now() / 1e3,
        type: "default",
        ...e
    }
}
var zc = (e => (e[e.Document = 0] = "Document", e[e.DocumentType = 1] = "DocumentType", e[e.Element = 2] = "Element", e[e.Text = 3] = "Text", e[e.CDATA = 4] = "CDATA", e[e.Comment = 5] = "Comment", e))(zc || {});
const $R = new Set(["id", "class", "aria-label", "role", "name", "alt", "title", "data-test-id", "data-testid", "disabled", "aria-disabled", "data-sentry-component"]);

function BR(e) {
    const t = {};
    !e["data-sentry-component"] && e["data-sentry-element"] && (e["data-sentry-component"] = e["data-sentry-element"]);
    for (const n in e)
        if ($R.has(n)) {
            let r = n;
            (n === "data-testid" || n === "data-test-id") && (r = "testId"), t[r] = e[n]
        }
    return t
}
const UR = e => t => {
    if (!e.isEnabled()) return;
    const n = HR(t);
    if (!n) return;
    const r = t.name === "click",
        o = r ? t.event : void 0;
    r && e.clickDetector && o ?.target && !o.altKey && !o.metaKey && !o.ctrlKey && !o.shiftKey && xR(e.clickDetector, n, Oh(t.event)), co(e, n)
};

function Lh(e, t) {
    const n = Ct.mirror.getId(e),
        r = n && Ct.mirror.getNode(n),
        o = r && Ct.mirror.getMeta(r),
        s = o && jR(o) ? o : null;
    return {
        message: t,
        data: s ? {
            nodeId: n,
            node: {
                id: n,
                tagName: s.tagName,
                textContent: Array.from(s.childNodes).map(i => i.type === zc.Text && i.textContent).filter(Boolean).map(i => i.trim()).join(""),
                attributes: BR(s.attributes)
            }
        } : {}
    }
}

function HR(e) {
    const {
        target: t,
        message: n
    } = WR(e);
    return ht({
        category: `ui.${e.name}`,
        ...Lh(t, n)
    })
}

function WR(e) {
    const t = e.name === "click";
    let n, r = null;
    try {
        r = t ? Oh(e.event) : Ph(e.event), n = je(r, {
            maxStringLength: 200
        }) || "<unknown>"
    } catch {
        n = "<unknown>"
    }
    return {
        target: r,
        message: n
    }
}

function jR(e) {
    return e.type === zc.Element
}

function zR(e, t) {
    if (!e.isEnabled()) return;
    e.updateUserActivity();
    const n = qR(t);
    n && co(e, n)
}

function qR(e) {
    const {
        metaKey: t,
        shiftKey: n,
        ctrlKey: r,
        altKey: o,
        key: s,
        target: i
    } = e;
    if (!i || GR(i) || !s) return null;
    const a = t || r || o,
        c = s.length === 1;
    if (!a && c) return null;
    const u = je(i, {
            maxStringLength: 200
        }) || "<unknown>",
        d = Lh(i, u);
    return ht({
        category: "ui.keyDown",
        message: u,
        data: { ...d.data,
            metaKey: t,
            shiftKey: n,
            ctrlKey: r,
            altKey: o,
            key: s
        }
    })
}

function GR(e) {
    return e.tagName === "INPUT" || e.tagName === "TEXTAREA" || e.isContentEditable
}
const VR = {
    resource: QR,
    paint: YR,
    navigation: XR
};

function zi(e, t) {
    return ({
        metric: n
    }) => void t.replayPerformanceEntries.push(e(n))
}

function JR(e) {
    return e.map(KR).filter(Boolean)
}

function KR(e) {
    const t = VR[e.entryType];
    return t ? t(e) : null
}

function dr(e) {
    return ((Oe() || fe.performance.timeOrigin) + e) / 1e3
}

function YR(e) {
    const {
        duration: t,
        entryType: n,
        name: r,
        startTime: o
    } = e, s = dr(o);
    return {
        type: n,
        name: r,
        start: s,
        end: s + t,
        data: void 0
    }
}

function XR(e) {
    const {
        entryType: t,
        name: n,
        decodedBodySize: r,
        duration: o,
        domComplete: s,
        encodedBodySize: i,
        domContentLoadedEventStart: a,
        domContentLoadedEventEnd: c,
        domInteractive: u,
        loadEventStart: d,
        loadEventEnd: l,
        redirectCount: f,
        startTime: p,
        transferSize: h,
        type: m
    } = e;
    return o === 0 ? null : {
        type: `${t}.${m}`,
        start: dr(p),
        end: dr(s),
        name: n,
        data: {
            size: h,
            decodedBodySize: r,
            encodedBodySize: i,
            duration: o,
            domInteractive: u,
            domContentLoadedEventStart: a,
            domContentLoadedEventEnd: c,
            loadEventStart: d,
            loadEventEnd: l,
            domComplete: s,
            redirectCount: f
        }
    }
}

function QR(e) {
    const {
        entryType: t,
        initiatorType: n,
        name: r,
        responseEnd: o,
        startTime: s,
        decodedBodySize: i,
        encodedBodySize: a,
        responseStatus: c,
        transferSize: u
    } = e;
    return ["fetch", "xmlhttprequest"].includes(n) ? null : {
        type: `${t}.${n}`,
        start: dr(s),
        end: dr(o),
        name: r,
        data: {
            size: u,
            statusCode: c,
            decodedBodySize: i,
            encodedBodySize: a
        }
    }
}

function ZR(e) {
    const t = e.entries[e.entries.length - 1],
        n = t ?.element ? [t.element] : void 0;
    return qc(e, "largest-contentful-paint", n)
}

function eC(e) {
    return e.sources !== void 0
}

function tC(e) {
    const t = [],
        n = [];
    for (const r of e.entries)
        if (eC(r)) {
            const o = [];
            for (const s of r.sources)
                if (s.node) {
                    n.push(s.node);
                    const i = Ct.mirror.getId(s.node);
                    i && o.push(i)
                }
            t.push({
                value: r.value,
                nodeIds: o.length ? o : void 0
            })
        }
    return qc(e, "cumulative-layout-shift", n, t)
}

function nC(e) {
    const t = e.entries[e.entries.length - 1],
        n = t ?.target ? [t.target] : void 0;
    return qc(e, "interaction-to-next-paint", n)
}

function qc(e, t, n, r) {
    const o = e.value,
        s = e.rating,
        i = dr(o);
    return {
        type: "web-vital",
        name: t,
        start: i,
        end: i,
        data: {
            value: o,
            size: o,
            rating: s,
            nodeIds: n ? n.map(a => Ct.mirror.getId(a)) : void 0,
            attributions: r
        }
    }
}

function rC(e) {
    function t(o) {
        e.performanceEntries.includes(o) || e.performanceEntries.push(o)
    }

    function n({
        entries: o
    }) {
        o.forEach(t)
    }
    const r = [];
    return ["navigation", "paint", "resource"].forEach(o => {
        r.push(On(o, n))
    }), r.push(xc(zi(ZR, e)), Ac(zi(tC, e)), jp(zi(nC, e))), () => {
        r.forEach(o => o())
    }
}
const U = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__,
    oC = 'var t=Uint8Array,n=Uint16Array,r=Int32Array,e=new t([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),i=new t([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),s=new t([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),a=function(t,e){for(var i=new n(31),s=0;s<31;++s)i[s]=e+=1<<t[s-1];var a=new r(i[30]);for(s=1;s<30;++s)for(var o=i[s];o<i[s+1];++o)a[o]=o-i[s]<<5|s;return{b:i,r:a}},o=a(e,2),h=o.b,f=o.r;h[28]=258,f[258]=28;for(var l=a(i,0).r,u=new n(32768),c=0;c<32768;++c){var v=(43690&c)>>1|(21845&c)<<1;v=(61680&(v=(52428&v)>>2|(13107&v)<<2))>>4|(3855&v)<<4,u[c]=((65280&v)>>8|(255&v)<<8)>>1}var d=function(t,r,e){for(var i=t.length,s=0,a=new n(r);s<i;++s)t[s]&&++a[t[s]-1];var o,h=new n(r);for(s=1;s<r;++s)h[s]=h[s-1]+a[s-1]<<1;if(e){o=new n(1<<r);var f=15-r;for(s=0;s<i;++s)if(t[s])for(var l=s<<4|t[s],c=r-t[s],v=h[t[s]-1]++<<c,d=v|(1<<c)-1;v<=d;++v)o[u[v]>>f]=l}else for(o=new n(i),s=0;s<i;++s)t[s]&&(o[s]=u[h[t[s]-1]++]>>15-t[s]);return o},p=new t(288);for(c=0;c<144;++c)p[c]=8;for(c=144;c<256;++c)p[c]=9;for(c=256;c<280;++c)p[c]=7;for(c=280;c<288;++c)p[c]=8;var g=new t(32);for(c=0;c<32;++c)g[c]=5;var w=d(p,9,0),y=d(g,5,0),m=function(t){return(t+7)/8|0},b=function(n,r,e){return(null==e||e>n.length)&&(e=n.length),new t(n.subarray(r,e))},M=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],E=function(t,n,r){var e=new Error(n||M[t]);if(e.code=t,Error.captureStackTrace&&Error.captureStackTrace(e,E),!r)throw e;return e},z=function(t,n,r){r<<=7&n;var e=n/8|0;t[e]|=r,t[e+1]|=r>>8},_=function(t,n,r){r<<=7&n;var e=n/8|0;t[e]|=r,t[e+1]|=r>>8,t[e+2]|=r>>16},x=function(r,e){for(var i=[],s=0;s<r.length;++s)r[s]&&i.push({s:s,f:r[s]});var a=i.length,o=i.slice();if(!a)return{t:F,l:0};if(1==a){var h=new t(i[0].s+1);return h[i[0].s]=1,{t:h,l:1}}i.sort(function(t,n){return t.f-n.f}),i.push({s:-1,f:25001});var f=i[0],l=i[1],u=0,c=1,v=2;for(i[0]={s:-1,f:f.f+l.f,l:f,r:l};c!=a-1;)f=i[i[u].f<i[v].f?u++:v++],l=i[u!=c&&i[u].f<i[v].f?u++:v++],i[c++]={s:-1,f:f.f+l.f,l:f,r:l};var d=o[0].s;for(s=1;s<a;++s)o[s].s>d&&(d=o[s].s);var p=new n(d+1),g=A(i[c-1],p,0);if(g>e){s=0;var w=0,y=g-e,m=1<<y;for(o.sort(function(t,n){return p[n.s]-p[t.s]||t.f-n.f});s<a;++s){var b=o[s].s;if(!(p[b]>e))break;w+=m-(1<<g-p[b]),p[b]=e}for(w>>=y;w>0;){var M=o[s].s;p[M]<e?w-=1<<e-p[M]++-1:++s}for(;s>=0&&w;--s){var E=o[s].s;p[E]==e&&(--p[E],++w)}g=e}return{t:new t(p),l:g}},A=function(t,n,r){return-1==t.s?Math.max(A(t.l,n,r+1),A(t.r,n,r+1)):n[t.s]=r},D=function(t){for(var r=t.length;r&&!t[--r];);for(var e=new n(++r),i=0,s=t[0],a=1,o=function(t){e[i++]=t},h=1;h<=r;++h)if(t[h]==s&&h!=r)++a;else{if(!s&&a>2){for(;a>138;a-=138)o(32754);a>2&&(o(a>10?a-11<<5|28690:a-3<<5|12305),a=0)}else if(a>3){for(o(s),--a;a>6;a-=6)o(8304);a>2&&(o(a-3<<5|8208),a=0)}for(;a--;)o(s);a=1,s=t[h]}return{c:e.subarray(0,i),n:r}},T=function(t,n){for(var r=0,e=0;e<n.length;++e)r+=t[e]*n[e];return r},k=function(t,n,r){var e=r.length,i=m(n+2);t[i]=255&e,t[i+1]=e>>8,t[i+2]=255^t[i],t[i+3]=255^t[i+1];for(var s=0;s<e;++s)t[i+s+4]=r[s];return 8*(i+4+e)},U=function(t,r,a,o,h,f,l,u,c,v,m){z(r,m++,a),++h[256];for(var b=x(h,15),M=b.t,E=b.l,A=x(f,15),U=A.t,C=A.l,F=D(M),I=F.c,S=F.n,L=D(U),O=L.c,j=L.n,q=new n(19),B=0;B<I.length;++B)++q[31&I[B]];for(B=0;B<O.length;++B)++q[31&O[B]];for(var G=x(q,7),H=G.t,J=G.l,K=19;K>4&&!H[s[K-1]];--K);var N,P,Q,R,V=v+5<<3,W=T(h,p)+T(f,g)+l,X=T(h,M)+T(f,U)+l+14+3*K+T(q,H)+2*q[16]+3*q[17]+7*q[18];if(c>=0&&V<=W&&V<=X)return k(r,m,t.subarray(c,c+v));if(z(r,m,1+(X<W)),m+=2,X<W){N=d(M,E,0),P=M,Q=d(U,C,0),R=U;var Y=d(H,J,0);z(r,m,S-257),z(r,m+5,j-1),z(r,m+10,K-4),m+=14;for(B=0;B<K;++B)z(r,m+3*B,H[s[B]]);m+=3*K;for(var Z=[I,O],$=0;$<2;++$){var tt=Z[$];for(B=0;B<tt.length;++B){var nt=31&tt[B];z(r,m,Y[nt]),m+=H[nt],nt>15&&(z(r,m,tt[B]>>5&127),m+=tt[B]>>12)}}}else N=w,P=p,Q=y,R=g;for(B=0;B<u;++B){var rt=o[B];if(rt>255){_(r,m,N[(nt=rt>>18&31)+257]),m+=P[nt+257],nt>7&&(z(r,m,rt>>23&31),m+=e[nt]);var et=31&rt;_(r,m,Q[et]),m+=R[et],et>3&&(_(r,m,rt>>5&8191),m+=i[et])}else _(r,m,N[rt]),m+=P[rt]}return _(r,m,N[256]),m+P[256]},C=new r([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),F=new t(0),I=function(){for(var t=new Int32Array(256),n=0;n<256;++n){for(var r=n,e=9;--e;)r=(1&r&&-306674912)^r>>>1;t[n]=r}return t}(),S=function(){var t=1,n=0;return{p:function(r){for(var e=t,i=n,s=0|r.length,a=0;a!=s;){for(var o=Math.min(a+2655,s);a<o;++a)i+=e+=r[a];e=(65535&e)+15*(e>>16),i=(65535&i)+15*(i>>16)}t=e,n=i},d:function(){return(255&(t%=65521))<<24|(65280&t)<<8|(255&(n%=65521))<<8|n>>8}}},L=function(s,a,o,h,u){if(!u&&(u={l:1},a.dictionary)){var c=a.dictionary.subarray(-32768),v=new t(c.length+s.length);v.set(c),v.set(s,c.length),s=v,u.w=c.length}return function(s,a,o,h,u,c){var v=c.z||s.length,d=new t(h+v+5*(1+Math.ceil(v/7e3))+u),p=d.subarray(h,d.length-u),g=c.l,w=7&(c.r||0);if(a){w&&(p[0]=c.r>>3);for(var y=C[a-1],M=y>>13,E=8191&y,z=(1<<o)-1,_=c.p||new n(32768),x=c.h||new n(z+1),A=Math.ceil(o/3),D=2*A,T=function(t){return(s[t]^s[t+1]<<A^s[t+2]<<D)&z},F=new r(25e3),I=new n(288),S=new n(32),L=0,O=0,j=c.i||0,q=0,B=c.w||0,G=0;j+2<v;++j){var H=T(j),J=32767&j,K=x[H];if(_[J]=K,x[H]=J,B<=j){var N=v-j;if((L>7e3||q>24576)&&(N>423||!g)){w=U(s,p,0,F,I,S,O,q,G,j-G,w),q=L=O=0,G=j;for(var P=0;P<286;++P)I[P]=0;for(P=0;P<30;++P)S[P]=0}var Q=2,R=0,V=E,W=J-K&32767;if(N>2&&H==T(j-W))for(var X=Math.min(M,N)-1,Y=Math.min(32767,j),Z=Math.min(258,N);W<=Y&&--V&&J!=K;){if(s[j+Q]==s[j+Q-W]){for(var $=0;$<Z&&s[j+$]==s[j+$-W];++$);if($>Q){if(Q=$,R=W,$>X)break;var tt=Math.min(W,$-2),nt=0;for(P=0;P<tt;++P){var rt=j-W+P&32767,et=rt-_[rt]&32767;et>nt&&(nt=et,K=rt)}}}W+=(J=K)-(K=_[J])&32767}if(R){F[q++]=268435456|f[Q]<<18|l[R];var it=31&f[Q],st=31&l[R];O+=e[it]+i[st],++I[257+it],++S[st],B=j+Q,++L}else F[q++]=s[j],++I[s[j]]}}for(j=Math.max(j,B);j<v;++j)F[q++]=s[j],++I[s[j]];w=U(s,p,g,F,I,S,O,q,G,j-G,w),g||(c.r=7&w|p[w/8|0]<<3,w-=7,c.h=x,c.p=_,c.i=j,c.w=B)}else{for(j=c.w||0;j<v+g;j+=65535){var at=j+65535;at>=v&&(p[w/8|0]=g,at=v),w=k(p,w+1,s.subarray(j,at))}c.i=v}return b(d,0,h+m(w)+u)}(s,null==a.level?6:a.level,null==a.mem?u.l?Math.ceil(1.5*Math.max(8,Math.min(13,Math.log(s.length)))):20:12+a.mem,o,h,u)},O=function(t,n,r){for(;r;++n)t[n]=r,r>>>=8},j=function(){function n(n,r){if("function"==typeof n&&(r=n,n={}),this.ondata=r,this.o=n||{},this.s={l:0,i:32768,w:32768,z:32768},this.b=new t(98304),this.o.dictionary){var e=this.o.dictionary.subarray(-32768);this.b.set(e,32768-e.length),this.s.i=32768-e.length}}return n.prototype.p=function(t,n){this.ondata(L(t,this.o,0,0,this.s),n)},n.prototype.push=function(n,r){this.ondata||E(5),this.s.l&&E(4);var e=n.length+this.s.z;if(e>this.b.length){if(e>2*this.b.length-32768){var i=new t(-32768&e);i.set(this.b.subarray(0,this.s.z)),this.b=i}var s=this.b.length-this.s.z;this.b.set(n.subarray(0,s),this.s.z),this.s.z=this.b.length,this.p(this.b,!1),this.b.set(this.b.subarray(-32768)),this.b.set(n.subarray(s),32768),this.s.z=n.length-s+32768,this.s.i=32766,this.s.w=32768}else this.b.set(n,this.s.z),this.s.z+=n.length;this.s.l=1&r,(this.s.z>this.s.w+8191||r)&&(this.p(this.b,r||!1),this.s.w=this.s.i,this.s.i-=2)},n.prototype.flush=function(){this.ondata||E(5),this.s.l&&E(4),this.p(this.b,!1),this.s.w=this.s.i,this.s.i-=2},n}();function q(t,n){n||(n={});var r=function(){var t=-1;return{p:function(n){for(var r=t,e=0;e<n.length;++e)r=I[255&r^n[e]]^r>>>8;t=r},d:function(){return~t}}}(),e=t.length;r.p(t);var i,s=L(t,n,10+((i=n).filename?i.filename.length+1:0),8),a=s.length;return function(t,n){var r=n.filename;if(t[0]=31,t[1]=139,t[2]=8,t[8]=n.level<2?4:9==n.level?2:0,t[9]=3,0!=n.mtime&&O(t,4,Math.floor(new Date(n.mtime||Date.now())/1e3)),r){t[3]=8;for(var e=0;e<=r.length;++e)t[e+10]=r.charCodeAt(e)}}(s,n),O(s,a-8,r.d()),O(s,a-4,e),s}var B=function(){function t(t,n){this.c=S(),this.v=1,j.call(this,t,n)}return t.prototype.push=function(t,n){this.c.p(t),j.prototype.push.call(this,t,n)},t.prototype.p=function(t,n){var r=L(t,this.o,this.v&&(this.o.dictionary?6:2),n&&4,this.s);this.v&&(function(t,n){var r=n.level,e=0==r?0:r<6?1:9==r?3:2;if(t[0]=120,t[1]=e<<6|(n.dictionary&&32),t[1]|=31-(t[0]<<8|t[1])%31,n.dictionary){var i=S();i.p(n.dictionary),O(t,2,i.d())}}(r,this.o),this.v=0),n&&O(r,r.length-4,this.c.d()),this.ondata(r,n)},t.prototype.flush=function(){j.prototype.flush.call(this)},t}(),G="undefined"!=typeof TextEncoder&&new TextEncoder,H="undefined"!=typeof TextDecoder&&new TextDecoder;try{H.decode(F,{stream:!0})}catch(t){}var J=function(){function t(t){this.ondata=t}return t.prototype.push=function(t,n){this.ondata||E(5),this.d&&E(4),this.ondata(K(t),this.d=n||!1)},t}();function K(n,r){if(G)return G.encode(n);for(var e=n.length,i=new t(n.length+(n.length>>1)),s=0,a=function(t){i[s++]=t},o=0;o<e;++o){if(s+5>i.length){var h=new t(s+8+(e-o<<1));h.set(i),i=h}var f=n.charCodeAt(o);f<128||r?a(f):f<2048?(a(192|f>>6),a(128|63&f)):f>55295&&f<57344?(a(240|(f=65536+(1047552&f)|1023&n.charCodeAt(++o))>>18),a(128|f>>12&63),a(128|f>>6&63),a(128|63&f)):(a(224|f>>12),a(128|f>>6&63),a(128|63&f))}return b(i,0,s)}const N=new class{constructor(){this._init()}clear(){this._init()}addEvent(t){if(!t)throw new Error("Adding invalid event");const n=this._hasEvents?",":"";this.stream.push(n+t),this._hasEvents=!0}finish(){this.stream.push("]",!0);const t=function(t){let n=0;for(const r of t)n+=r.length;const r=new Uint8Array(n);for(let n=0,e=0,i=t.length;n<i;n++){const i=t[n];r.set(i,e),e+=i.length}return r}(this._deflatedData);return this._init(),t}_init(){this._hasEvents=!1,this._deflatedData=[],this.deflate=new B,this.deflate.ondata=(t,n)=>{this._deflatedData.push(t)},this.stream=new J((t,n)=>{this.deflate.push(t,n)}),this.stream.push("[")}},P={clear:()=>{N.clear()},addEvent:t=>N.addEvent(t),finish:()=>N.finish(),compress:t=>function(t){return q(K(t))}(t)};addEventListener("message",function(t){const n=t.data.method,r=t.data.id,e=t.data.arg;if(n in P&&"function"==typeof P[n])try{const t=P[n](e);postMessage({id:r,method:n,success:!0,response:t})}catch(t){postMessage({id:r,method:n,success:!1,response:t.message}),console.error(t)}}),postMessage({id:void 0,method:"init",success:!0,response:void 0});';

function sC() {
    const e = new Blob([oC]);
    return URL.createObjectURL(e)
}
const od = ["log", "warn", "error"],
    Xo = "[Replay] ";

function qi(e, t = "info") {
    bt({
        category: "console",
        data: {
            logger: "replay"
        },
        level: t,
        message: `${Xo}${e}`
    }, {
        level: t
    })
}

function iC() {
    let e = !1,
        t = !1;
    const n = {
        exception: () => {},
        infoTick: () => {},
        setConfig: r => {
            e = !!r.captureExceptions, t = !!r.traceInternals
        }
    };
    return U ? (od.forEach(r => {
        n[r] = (...o) => {
            g[r](Xo, ...o), t && qi(o.join(""), fs(r))
        }
    }), n.exception = (r, ...o) => {
        o.length && n.error && n.error(...o), g.error(Xo, r), e ? _e(r, {
            mechanism: {
                handled: !0,
                type: "auto.function.replay.debug"
            }
        }) : t && qi(r, "error")
    }, n.infoTick = (...r) => {
        g.log(Xo, ...r), t && setTimeout(() => qi(r[0]), 0)
    }) : od.forEach(r => {
        n[r] = () => {}
    }), n
}
const H = iC();
class Gc extends Error {
    constructor() {
        super(`Event buffer exceeded maximum size of ${Fc}.`)
    }
}
class Dh {
    constructor() {
        this.events = [], this._totalSize = 0, this.hasCheckout = !1, this.waitForCheckout = !1
    }
    get hasEvents() {
        return this.events.length > 0
    }
    get type() {
        return "sync"
    }
    destroy() {
        this.events = []
    }
    async addEvent(t) {
        const n = JSON.stringify(t).length;
        if (this._totalSize += n, this._totalSize > Fc) throw new Gc;
        this.events.push(t)
    }
    finish() {
        return new Promise(t => {
            const n = this.events;
            this.clear(), t(JSON.stringify(n))
        })
    }
    clear() {
        this.events = [], this._totalSize = 0, this.hasCheckout = !1
    }
    getEarliestTimestamp() {
        const t = this.events.map(n => n.timestamp).sort()[0];
        return t ? jc(t) : null
    }
}
class aC {
    constructor(t) {
        this._worker = t, this._id = 0
    }
    ensureReady() {
        return this._ensureReadyPromise ? this._ensureReadyPromise : (this._ensureReadyPromise = new Promise((t, n) => {
            this._worker.addEventListener("message", ({
                data: r
            }) => {
                r.success ? t() : n()
            }, {
                once: !0
            }), this._worker.addEventListener("error", r => {
                n(r)
            }, {
                once: !0
            })
        }), this._ensureReadyPromise)
    }
    destroy() {
        U && H.log("Destroying compression worker"), this._worker.terminate()
    }
    postMessage(t, n) {
        const r = this._getAndIncrementId();
        return new Promise((o, s) => {
            const i = ({
                data: a
            }) => {
                const c = a;
                if (c.method === t && c.id === r) {
                    if (this._worker.removeEventListener("message", i), !c.success) {
                        U && H.error("Error in compression worker: ", c.response), s(new Error("Error in compression worker"));
                        return
                    }
                    o(c.response)
                }
            };
            this._worker.addEventListener("message", i), this._worker.postMessage({
                id: r,
                method: t,
                arg: n
            })
        })
    }
    _getAndIncrementId() {
        return this._id++
    }
}
class cC {
    constructor(t) {
        this._worker = new aC(t), this._earliestTimestamp = null, this._totalSize = 0, this.hasCheckout = !1, this.waitForCheckout = !1
    }
    get hasEvents() {
        return !!this._earliestTimestamp
    }
    get type() {
        return "worker"
    }
    ensureReady() {
        return this._worker.ensureReady()
    }
    destroy() {
        this._worker.destroy()
    }
    addEvent(t) {
        const n = jc(t.timestamp);
        (!this._earliestTimestamp || n < this._earliestTimestamp) && (this._earliestTimestamp = n);
        const r = JSON.stringify(t);
        return this._totalSize += r.length, this._totalSize > Fc ? Promise.reject(new Gc) : this._sendEventToWorker(r)
    }
    finish() {
        return this._finishRequest()
    }
    clear() {
        this._earliestTimestamp = null, this._totalSize = 0, this.hasCheckout = !1, this._worker.postMessage("clear").then(null, t => {
            U && H.exception(t, 'Sending "clear" message to worker failed', t)
        })
    }
    getEarliestTimestamp() {
        return this._earliestTimestamp
    }
    _sendEventToWorker(t) {
        return this._worker.postMessage("addEvent", t)
    }
    async _finishRequest() {
        const t = await this._worker.postMessage("finish");
        return this._earliestTimestamp = null, this._totalSize = 0, t
    }
}
class uC {
    constructor(t) {
        this._fallback = new Dh, this._compression = new cC(t), this._used = this._fallback, this._ensureWorkerIsLoadedPromise = this._ensureWorkerIsLoaded()
    }
    get waitForCheckout() {
        return this._used.waitForCheckout
    }
    get type() {
        return this._used.type
    }
    get hasEvents() {
        return this._used.hasEvents
    }
    get hasCheckout() {
        return this._used.hasCheckout
    }
    set hasCheckout(t) {
        this._used.hasCheckout = t
    }
    set waitForCheckout(t) {
        this._used.waitForCheckout = t
    }
    destroy() {
        this._fallback.destroy(), this._compression.destroy()
    }
    clear() {
        return this._used.clear()
    }
    getEarliestTimestamp() {
        return this._used.getEarliestTimestamp()
    }
    addEvent(t) {
        return this._used.addEvent(t)
    }
    async finish() {
        return await this.ensureWorkerIsLoaded(), this._used.finish()
    }
    ensureWorkerIsLoaded() {
        return this._ensureWorkerIsLoadedPromise
    }
    async _ensureWorkerIsLoaded() {
        try {
            await this._compression.ensureReady()
        } catch (t) {
            U && H.exception(t, "Failed to load the compression worker, falling back to simple buffer");
            return
        }
        await this._switchToCompressionWorker()
    }
    async _switchToCompressionWorker() {
        const {
            events: t,
            hasCheckout: n,
            waitForCheckout: r
        } = this._fallback, o = [];
        for (const s of t) o.push(this._compression.addEvent(s));
        this._compression.hasCheckout = n, this._compression.waitForCheckout = r, this._used = this._compression;
        try {
            await Promise.all(o), this._fallback.clear()
        } catch (s) {
            U && H.exception(s, "Failed to add events when switching buffers.")
        }
    }
}

function lC({
    useCompression: e,
    workerUrl: t
}) {
    if (e && window.Worker) {
        const n = dC(t);
        if (n) return n
    }
    return U && H.log("Using simple buffer"), new Dh
}

function dC(e) {
    try {
        const t = e || fC();
        if (!t) return;
        U && H.log(`Using compression worker${e?` from ${e}`:""}`);
        const n = new Worker(t);
        return new uC(n)
    } catch (t) {
        U && H.exception(t, "Failed to create compression worker")
    }
}

function fC() {
    return typeof __SENTRY_EXCLUDE_REPLAY_WORKER__ > "u" || !__SENTRY_EXCLUDE_REPLAY_WORKER__ ? sC() : ""
}

function Vc() {
    try {
        return "sessionStorage" in fe && !!fe.sessionStorage
    } catch {
        return !1
    }
}

function pC(e) {
    hC(), e.session = void 0
}

function hC() {
    if (Vc()) try {
        fe.sessionStorage.removeItem(Lc)
    } catch {}
}

function Fh(e) {
    return e === void 0 ? !1 : Math.random() < e
}

function ui(e) {
    if (Vc()) try {
        fe.sessionStorage.setItem(Lc, JSON.stringify(e))
    } catch {}
}

function $h(e) {
    const t = Date.now(),
        n = e.id || Ie(),
        r = e.started || t,
        o = e.lastActivity || t,
        s = e.segmentId || 0,
        i = e.sampled,
        a = e.previousSessionId,
        c = e.dirty || !1;
    return {
        id: n,
        started: r,
        lastActivity: o,
        segmentId: s,
        sampled: i,
        previousSessionId: a,
        dirty: c
    }
}

function mC(e, t) {
    return Fh(e) ? "session" : t ? "buffer" : !1
}

function sd({
    sessionSampleRate: e,
    allowBuffering: t,
    stickySession: n = !1
}, {
    previousSessionId: r
} = {}) {
    const o = mC(e, t),
        s = $h({
            sampled: o,
            previousSessionId: r
        });
    return n && ui(s), s
}

function gC() {
    if (!Vc()) return null;
    try {
        const e = fe.sessionStorage.getItem(Lc);
        if (!e) return null;
        const t = JSON.parse(e);
        return U && H.infoTick("Loading existing session"), $h(t)
    } catch {
        return null
    }
}

function xa(e, t, n = +new Date) {
    return e === null || t === void 0 || t < 0 ? !0 : t === 0 ? !1 : e + t <= n
}

function Bh(e, {
    maxReplayDuration: t,
    sessionIdleExpire: n,
    targetTime: r = Date.now()
}) {
    return xa(e.started, t, r) || xa(e.lastActivity, n, r)
}

function Uh(e, {
    sessionIdleExpire: t,
    maxReplayDuration: n
}) {
    return !(!Bh(e, {
        sessionIdleExpire: t,
        maxReplayDuration: n
    }) || e.sampled === "buffer" && e.segmentId === 0)
}

function Gi({
    sessionIdleExpire: e,
    maxReplayDuration: t,
    previousSessionId: n
}, r) {
    const o = r.stickySession && gC();
    return o ? Uh(o, {
        sessionIdleExpire: e,
        maxReplayDuration: t
    }) ? (U && H.infoTick("Session in sessionStorage is expired, creating new one..."), sd(r, {
        previousSessionId: o.id
    })) : o : (U && H.infoTick("Creating new session"), sd(r, {
        previousSessionId: n
    }))
}

function _C(e) {
    return e.type === J.Custom
}

function Jc(e, t, n) {
    return Wh(e, t) ? (Hh(e, t, n), !0) : !1
}

function yC(e, t, n) {
    return Wh(e, t) ? Hh(e, t, n) : Promise.resolve(null)
}
async function Hh(e, t, n) {
    const {
        eventBuffer: r
    } = e;
    if (!r || r.waitForCheckout && !n) return null;
    const o = e.recordingMode === "buffer";
    try {
        n && o && r.clear(), n && (r.hasCheckout = !0, r.waitForCheckout = !1);
        const s = e.getOptions(),
            i = SC(t, s.beforeAddRecordingEvent);
        return i ? await r.addEvent(i) : void 0
    } catch (s) {
        const i = s && s instanceof Gc,
            a = i ? "addEventSizeExceeded" : "addEvent",
            c = C();
        if (c) {
            const u = i ? "buffer_overflow" : "internal_sdk_error";
            c.recordDroppedEvent(u, "replay")
        }
        if (i && o) return r.clear(), r.waitForCheckout = !0, null;
        e.handleException(s), await e.stop({
            reason: a
        })
    }
}

function Wh(e, t) {
    if (!e.eventBuffer || e.isPaused() || !e.isEnabled()) return !1;
    const n = jc(t.timestamp);
    return n + e.timeouts.sessionIdlePause < Date.now() ? !1 : n > e.getContext().initialTimestamp + e.getOptions().maxReplayDuration ? (U && H.infoTick(`Skipping event with timestamp ${n} because it is after maxReplayDuration`), !1) : !0
}

function SC(e, t) {
    try {
        if (typeof t == "function" && _C(e)) return t(e)
    } catch (n) {
        return U && H.exception(n, "An error occurred in the `beforeAddRecordingEvent` callback, skipping the event..."), null
    }
    return e
}

function Kc(e) {
    return !e.type
}

function Ma(e) {
    return e.type === "transaction"
}

function bC(e) {
    return e.type === "replay_event"
}

function id(e) {
    return e.type === "feedback"
}

function EC(e) {
    return (t, n) => {
        if (!e.isEnabled() || !Kc(t) && !Ma(t)) return;
        const r = n.statusCode;
        if (!(!r || r < 200 || r >= 300)) {
            if (Ma(t)) {
                vC(e, t);
                return
            }
            TC(e, t)
        }
    }
}

function vC(e, t) {
    const n = e.getContext();
    t.contexts ?.trace ?.trace_id && n.traceIds.size < 100 && n.traceIds.add(t.contexts.trace.trace_id)
}

function TC(e, t) {
    const n = e.getContext();
    if (t.event_id && n.errorIds.size < 100 && n.errorIds.add(t.event_id), e.recordingMode !== "buffer" || !t.tags || !t.tags.replayId) return;
    const {
        beforeErrorSampling: r
    } = e.getOptions();
    typeof r == "function" && !r(t) || io(async () => {
        try {
            await e.sendBufferedReplayOrFlush()
        } catch (o) {
            e.handleException(o)
        }
    })
}

function IC(e) {
    return t => {
        !e.isEnabled() || !Kc(t) || wC(e, t)
    }
}

function wC(e, t) {
    const n = t.exception ?.values ?.[0] ?.value;
    if (typeof n == "string" && (n.match(/(reactjs\.org\/docs\/error-decoder\.html\?invariant=|react\.dev\/errors\/)(418|419|422|423|425)/) || n.match(/(does not match server-rendered HTML|Hydration failed because)/i))) {
        const r = ht({
            category: "replay.hydrate-error",
            data: {
                url: Ln()
            }
        });
        co(e, r)
    }
}

function kC(e) {
    const t = C();
    t && t.on("beforeAddBreadcrumb", n => RC(e, n))
}

function RC(e, t) {
    if (!e.isEnabled() || !jh(t)) return;
    const n = CC(t);
    n && co(e, n)
}

function CC(e) {
    return !jh(e) || ["fetch", "xhr", "sentry.event", "sentry.transaction"].includes(e.category) || e.category.startsWith("ui.") ? null : e.category === "console" ? AC(e) : ht(e)
}

function AC(e) {
    const t = e.data ?.arguments;
    if (!Array.isArray(t) || t.length === 0) return ht(e);
    let n = !1;
    const r = t.map(o => {
        if (!o) return o;
        if (typeof o == "string") return o.length > ko ? (n = !0, `${o.slice(0,ko)}…`) : o;
        if (typeof o == "object") try {
            const s = Ge(o, 7);
            return JSON.stringify(s).length > ko ? (n = !0, `${JSON.stringify(s,null,2).slice(0,ko)}…`) : s
        } catch {}
        return o
    });
    return ht({ ...e,
        data: { ...e.data,
            arguments: r,
            ...n ? {
                _meta: {
                    warnings: ["CONSOLE_ARG_TRUNCATED"]
                }
            } : {}
        }
    })
}

function jh(e) {
    return !!e.category
}

function xC(e, t) {
    return e.type || !e.exception ?.values ?.length ? !1 : !!t.originalException ?.__rrweb__
}

function zh() {
    const e = j().getPropagationContext().dsc;
    e && delete e.replay_id;
    const t = Ee();
    if (t) {
        const n = ut(t);
        delete n.replay_id
    }
}

function MC(e, t) {
    e.triggerUserActivity(), e.addUpdate(() => t.timestamp ? (e.throttledAddEvent({
        type: J.Custom,
        timestamp: t.timestamp * 1e3,
        data: {
            tag: "breadcrumb",
            payload: {
                timestamp: t.timestamp,
                type: "default",
                category: "sentry.feedback",
                data: {
                    feedbackId: t.event_id
                }
            }
        }
    }), !1) : !0)
}

function NC(e, t) {
    return e.recordingMode !== "buffer" || t.message === Dc || !t.exception || t.type ? !1 : Fh(e.getOptions().errorSampleRate)
}

function OC(e) {
    return Object.assign((t, n) => {
        if (!e.isEnabled() || e.isPaused()) return t;
        if (bC(t)) return delete t.breadcrumbs, t;
        if (!Kc(t) && !Ma(t) && !id(t)) return t;
        if (!e.checkAndHandleExpiredSession()) return zh(), t;
        if (id(t)) return e.flush(), t.contexts.feedback.replay_id = e.getSessionId(), MC(e, t), t;
        if (xC(t, n) && !e.getOptions()._experiments.captureExceptions) return U && H.log("Ignoring error from rrweb internals", t), null;
        const o = NC(e, t);
        if ((o || e.recordingMode === "session") && (t.tags = { ...t.tags,
                replayId: e.getSessionId()
            }), o && e.recordingMode === "buffer" && e.session ?.sampled === "buffer") {
            const i = e.session;
            i.dirty = !0, e.getOptions().stickySession && ui(i)
        }
        return t
    }, {
        id: "Replay"
    })
}

function li(e, t) {
    return t.map(({
        type: n,
        start: r,
        end: o,
        name: s,
        data: i
    }) => {
        const a = e.throttledAddEvent({
            type: J.Custom,
            timestamp: r,
            data: {
                tag: "performanceSpan",
                payload: {
                    op: n,
                    description: s,
                    startTimestamp: r,
                    endTimestamp: o,
                    data: i
                }
            }
        });
        return typeof a == "string" ? Promise.resolve(null) : a
    })
}

function PC(e) {
    const {
        from: t,
        to: n
    } = e, r = Date.now() / 1e3;
    return {
        type: "navigation.push",
        start: r,
        end: r,
        name: n,
        data: {
            previous: t
        }
    }
}

function LC(e) {
    return t => {
        if (!e.isEnabled()) return;
        const n = PC(t);
        n !== null && (e.getContext().urls.push(n.name), e.triggerUserActivity(), e.addUpdate(() => (li(e, [n]), !1)))
    }
}

function DC(e, t) {
    return U && e.getOptions()._experiments.traceInternals ? !1 : Gf(t, C())
}

function qh(e, t) {
    e.isEnabled() && t !== null && (DC(e, t.name) || e.addUpdate(() => (li(e, [t]), !0)))
}

function di(e) {
    if (!e) return;
    const t = new TextEncoder;
    try {
        if (typeof e == "string") return t.encode(e).length;
        if (e instanceof URLSearchParams) return t.encode(e.toString()).length;
        if (e instanceof FormData) {
            const n = Yp(e);
            return t.encode(n).length
        }
        if (e instanceof Blob) return e.size;
        if (e instanceof ArrayBuffer) return e.byteLength
    } catch {}
}

function Gh(e) {
    if (!e) return;
    const t = parseInt(e, 10);
    return isNaN(t) ? void 0 : t
}

function xs(e, t) {
    if (!e) return {
        headers: {},
        size: void 0,
        _meta: {
            warnings: [t]
        }
    };
    const n = { ...e._meta
        },
        r = n.warnings || [];
    return n.warnings = [...r, t], e._meta = n, e
}

function Vh(e, t) {
    if (!t) return null;
    const {
        startTimestamp: n,
        endTimestamp: r,
        url: o,
        method: s,
        statusCode: i,
        request: a,
        response: c
    } = t;
    return {
        type: e,
        start: n / 1e3,
        end: r / 1e3,
        name: o,
        data: {
            method: s,
            statusCode: i,
            request: a,
            response: c
        }
    }
}

function jr(e) {
    return {
        headers: {},
        size: e,
        _meta: {
            warnings: ["URL_SKIPPED"]
        }
    }
}

function Vt(e, t, n) {
    if (!t && Object.keys(e).length === 0) return;
    if (!t) return {
        headers: e
    };
    if (!n) return {
        headers: e,
        size: t
    };
    const r = {
            headers: e,
            size: t
        },
        {
            body: o,
            warnings: s
        } = FC(n);
    return r.body = o, s ?.length && (r._meta = {
        warnings: s
    }), r
}

function Na(e, t) {
    return Object.entries(e).reduce((n, [r, o]) => {
        const s = r.toLowerCase();
        return t.includes(s) && e[r] && (n[s] = o), n
    }, {})
}

function FC(e) {
    if (!e || typeof e != "string") return {
        body: e
    };
    const t = e.length > Ul,
        n = $C(e);
    if (t) {
        const r = e.slice(0, Ul);
        return n ? {
            body: r,
            warnings: ["MAYBE_JSON_TRUNCATED"]
        } : {
            body: `${r}…`,
            warnings: ["TEXT_TRUNCATED"]
        }
    }
    if (n) try {
        return {
            body: JSON.parse(e)
        }
    } catch {}
    return {
        body: e
    }
}

function $C(e) {
    const t = e[0],
        n = e[e.length - 1];
    return t === "[" && n === "]" || t === "{" && n === "}"
}

function Ms(e, t) {
    const n = BC(e);
    return it(n, t)
}

function BC(e, t = fe.document.baseURI) {
    if (e.startsWith("http://") || e.startsWith("https://") || e.startsWith(fe.location.origin)) return e;
    const n = new URL(e, t);
    if (n.origin !== new URL(t).origin) return e;
    const r = n.href;
    return !e.endsWith("/") && r.endsWith("/") ? r.slice(0, -1) : r
}
async function UC(e, t, n) {
    try {
        const r = await WC(e, t, n),
            o = Vh("resource.fetch", r);
        qh(n.replay, o)
    } catch (r) {
        U && H.exception(r, "Failed to capture fetch breadcrumb")
    }
}

function HC(e, t) {
    const {
        input: n,
        response: r
    } = t, o = n ? Pc(n) : void 0, s = di(o), i = r ? Gh(r.headers.get("content-length")) : void 0;
    s !== void 0 && (e.data.request_body_size = s), i !== void 0 && (e.data.response_body_size = i)
}
async function WC(e, t, n) {
    const r = Date.now(),
        {
            startTimestamp: o = r,
            endTimestamp: s = r
        } = t,
        {
            url: i,
            method: a,
            status_code: c = 0,
            request_body_size: u,
            response_body_size: d
        } = e.data,
        l = Ms(i, n.networkDetailAllowUrls) && !Ms(i, n.networkDetailDenyUrls),
        f = l ? jC(n, t.input, u) : jr(u),
        p = await zC(l, n, t.response, d);
    return {
        startTimestamp: o,
        endTimestamp: s,
        url: i,
        method: a,
        statusCode: c,
        request: f,
        response: p
    }
}

function jC({
    networkCaptureBodies: e,
    networkRequestHeaders: t
}, n, r) {
    const o = n ? VC(n, t) : {};
    if (!e) return Vt(o, r, void 0);
    const s = Pc(n),
        [i, a] = Ts(s, H),
        c = Vt(o, r, i);
    return a ? xs(c, a) : c
}
async function zC(e, {
    networkCaptureBodies: t,
    networkResponseHeaders: n
}, r, o) {
    if (!e && o !== void 0) return jr(o);
    const s = r ? Jh(r.headers, n) : {};
    if (!r || !t && o !== void 0) return Vt(s, o, void 0);
    const [i, a] = await GC(r), c = qC(i, {
        networkCaptureBodies: t,
        responseBodySize: o,
        captureDetails: e,
        headers: s
    });
    return a ? xs(c, a) : c
}

function qC(e, {
    networkCaptureBodies: t,
    responseBodySize: n,
    captureDetails: r,
    headers: o
}) {
    try {
        const s = e ?.length && n === void 0 ? di(e) : n;
        return r ? t ? Vt(o, s, e) : Vt(o, s, void 0) : jr(s)
    } catch (s) {
        return U && H.exception(s, "Failed to serialize response body"), Vt(o, n, void 0)
    }
}
async function GC(e) {
    const t = JC(e);
    if (!t) return [void 0, "BODY_PARSE_ERROR"];
    try {
        return [await KC(t)]
    } catch (n) {
        return n instanceof Error && n.message.indexOf("Timeout") > -1 ? (U && H.warn("Parsing text body from response timed out"), [void 0, "BODY_PARSE_TIMEOUT"]) : (U && H.exception(n, "Failed to get text body from response"), [void 0, "BODY_PARSE_ERROR"])
    }
}

function Jh(e, t) {
    const n = {};
    return t.forEach(r => {
        e.get(r) && (n[r] = e.get(r))
    }), n
}

function VC(e, t) {
    return e.length === 1 && typeof e[0] != "string" ? ad(e[0], t) : e.length === 2 ? ad(e[1], t) : {}
}

function ad(e, t) {
    if (!e) return {};
    const n = e.headers;
    return n ? n instanceof Headers ? Jh(n, t) : Array.isArray(n) ? {} : Na(n, t) : {}
}

function JC(e) {
    try {
        return e.clone()
    } catch (t) {
        U && H.exception(t, "Failed to clone response body")
    }
}

function KC(e) {
    return new Promise((t, n) => {
        const r = io(() => n(new Error("Timeout while trying to read response body")), 500);
        YC(e).then(o => t(o), o => n(o)).finally(() => clearTimeout(r))
    })
}
async function YC(e) {
    return await e.text()
}
async function XC(e, t, n) {
    try {
        const r = ZC(e, t, n),
            o = Vh("resource.xhr", r);
        qh(n.replay, o)
    } catch (r) {
        U && H.exception(r, "Failed to capture xhr breadcrumb")
    }
}

function QC(e, t) {
    const {
        xhr: n,
        input: r
    } = t;
    if (!n) return;
    const o = di(r),
        s = n.getResponseHeader("content-length") ? Gh(n.getResponseHeader("content-length")) : n1(n.response, n.responseType);
    o !== void 0 && (e.data.request_body_size = o), s !== void 0 && (e.data.response_body_size = s)
}

function ZC(e, t, n) {
    const r = Date.now(),
        {
            startTimestamp: o = r,
            endTimestamp: s = r,
            input: i,
            xhr: a
        } = t,
        {
            url: c,
            method: u,
            status_code: d = 0,
            request_body_size: l,
            response_body_size: f
        } = e.data;
    if (!c) return null;
    if (!a || !Ms(c, n.networkDetailAllowUrls) || Ms(c, n.networkDetailDenyUrls)) {
        const A = jr(l),
            S = jr(f);
        return {
            startTimestamp: o,
            endTimestamp: s,
            url: c,
            method: u,
            statusCode: d,
            request: A,
            response: S
        }
    }
    const p = a[wt],
        h = p ? Na(p.request_headers, n.networkRequestHeaders) : {},
        m = Na(Xp(a), n.networkResponseHeaders),
        [_, y] = n.networkCaptureBodies ? Ts(i, H) : [void 0],
        [b, N] = n.networkCaptureBodies ? e1(a) : [void 0],
        T = Vt(h, l, _),
        L = Vt(m, f, b);
    return {
        startTimestamp: o,
        endTimestamp: s,
        url: c,
        method: u,
        statusCode: d,
        request: y ? xs(T, y) : T,
        response: N ? xs(L, N) : L
    }
}

function e1(e) {
    const t = [];
    try {
        return [e.responseText]
    } catch (n) {
        t.push(n)
    }
    try {
        return t1(e.response, e.responseType)
    } catch (n) {
        t.push(n)
    }
    return U && H.warn("Failed to get xhr response body", ...t), [void 0]
}

function t1(e, t) {
    try {
        if (typeof e == "string") return [e];
        if (e instanceof Document) return [e.body.outerHTML];
        if (t === "json" && e && typeof e == "object") return [JSON.stringify(e)];
        if (!e) return [void 0]
    } catch (n) {
        return U && H.exception(n, "Failed to serialize body", e), [void 0, "BODY_PARSE_ERROR"]
    }
    return U && H.log("Skipping network body because of body type", e), [void 0, "UNPARSEABLE_BODY_TYPE"]
}

function n1(e, t) {
    try {
        const n = t === "json" && e && typeof e == "object" ? JSON.stringify(e) : e;
        return di(n)
    } catch {
        return
    }
}

function r1(e) {
    const t = C();
    try {
        const {
            networkDetailAllowUrls: n,
            networkDetailDenyUrls: r,
            networkCaptureBodies: o,
            networkRequestHeaders: s,
            networkResponseHeaders: i
        } = e.getOptions(), a = {
            replay: e,
            networkDetailAllowUrls: n,
            networkDetailDenyUrls: r,
            networkCaptureBodies: o,
            networkRequestHeaders: s,
            networkResponseHeaders: i
        };
        t && t.on("beforeAddBreadcrumb", (c, u) => o1(a, c, u))
    } catch {}
}

function o1(e, t, n) {
    if (t.data) try {
        s1(t) && a1(n) && (QC(t, n), XC(t, n, e)), i1(t) && c1(n) && (HC(t, n), UC(t, n, e))
    } catch (r) {
        U && H.exception(r, "Error when enriching network breadcrumb")
    }
}

function s1(e) {
    return e.category === "xhr"
}

function i1(e) {
    return e.category === "fetch"
}

function a1(e) {
    return e ?.xhr
}

function c1(e) {
    return e ?.response
}

function u1(e) {
    const t = C();
    Kp(UR(e)), ri(LC(e)), kC(e), r1(e);
    const n = OC(e);
    J_(n), t && (t.on("beforeSendEvent", IC(e)), t.on("afterSendEvent", EC(e)), t.on("createDsc", r => {
        const o = e.getSessionId();
        o && e.isEnabled() && e.recordingMode === "session" && e.checkAndHandleExpiredSession() && (r.replay_id = o)
    }), t.on("spanStart", r => {
        e.lastActiveSpan = r
    }), t.on("spanEnd", r => {
        e.lastActiveSpan = r
    }), t.on("beforeSendFeedback", async (r, o) => {
        const s = e.getSessionId();
        o ?.includeReplay && e.isEnabled() && s && r.contexts ?.feedback && (r.contexts.feedback.source === "api" && await e.sendBufferedReplayOrFlush(), r.contexts.feedback.replay_id = s)
    }), t.on("openFeedbackWidget", async () => {
        await e.sendBufferedReplayOrFlush()
    }))
}
async function l1(e) {
    try {
        return Promise.all(li(e, [d1(fe.performance.memory)]))
    } catch {
        return []
    }
}

function d1(e) {
    const {
        jsHeapSizeLimit: t,
        totalJSHeapSize: n,
        usedJSHeapSize: r
    } = e, o = Date.now() / 1e3;
    return {
        type: "memory",
        name: "memory",
        start: o,
        end: o,
        data: {
            memory: {
                jsHeapSizeLimit: t,
                totalJSHeapSize: n,
                usedJSHeapSize: r
            }
        }
    }
}

function f1(e, t, n) {
    return Vy(e, t, { ...n,
        setTimeoutImpl: io
    })
}
const xo = $.navigator;

function p1() {
    return /iPhone|iPad|iPod/i.test(xo ?.userAgent ?? "") || /Macintosh/i.test(xo ?.userAgent ?? "") && xo ?.maxTouchPoints && xo ?.maxTouchPoints > 1 ? {
        sampling: {
            mousemove: !1
        }
    } : {}
}

function h1(e) {
    let t = !1;
    return (n, r) => {
        if (!e.checkAndHandleExpiredSession()) {
            U && H.warn("Received replay event after session expired.");
            return
        }
        const o = r || !t;
        t = !0, e.clickDetector && LR(e.clickDetector, n), e.addUpdate(() => {
            if (e.recordingMode === "buffer" && o && e.setInitialState(), !Jc(e, n, o)) return !0;
            if (!o) return !1;
            const s = e.session;
            if (g1(e, o), e.recordingMode === "buffer" && s && e.eventBuffer && !s.dirty) {
                const i = e.eventBuffer.getEarliestTimestamp();
                i && (U && H.log(`Updating session start time to earliest event in buffer to ${new Date(i)}`), s.started = i, e.getOptions().stickySession && ui(s))
            }
            return s ?.previousSessionId || e.recordingMode === "session" && e.flush(), !0
        })
    }
}

function m1(e) {
    const t = e.getOptions();
    return {
        type: J.Custom,
        timestamp: Date.now(),
        data: {
            tag: "options",
            payload: {
                shouldRecordCanvas: e.isRecordingCanvas(),
                sessionSampleRate: t.sessionSampleRate,
                errorSampleRate: t.errorSampleRate,
                useCompressionOption: t.useCompression,
                blockAllMedia: t.blockAllMedia,
                maskAllText: t.maskAllText,
                maskAllInputs: t.maskAllInputs,
                useCompression: e.eventBuffer ? e.eventBuffer.type === "worker" : !1,
                networkDetailHasUrls: t.networkDetailAllowUrls.length > 0,
                networkCaptureBodies: t.networkCaptureBodies,
                networkRequestHasHeaders: t.networkRequestHeaders.length > 0,
                networkResponseHasHeaders: t.networkResponseHeaders.length > 0
            }
        }
    }
}

function g1(e, t) {
    !t || !e.session || e.session.segmentId !== 0 || Jc(e, m1(e), !1)
}

function _1(e) {
    if (!e) return null;
    try {
        return e.nodeType === e.ELEMENT_NODE ? e : e.parentElement
    } catch {
        return null
    }
}

function y1(e, t, n, r) {
    return lt(Ef(e, Bs(e), r, n), [
        [{
            type: "replay_event"
        }, e],
        [{
            type: "replay_recording",
            length: typeof t == "string" ? new TextEncoder().encode(t).length : t.length
        }, t]
    ])
}

function S1({
    recordingData: e,
    headers: t
}) {
    let n;
    const r = `${JSON.stringify(t)}
`;
    if (typeof e == "string") n = `${r}${e}`;
    else {
        const s = new TextEncoder().encode(r);
        n = new Uint8Array(s.length + e.length), n.set(s), n.set(e, s.length)
    }
    return n
}
async function b1({
    client: e,
    scope: t,
    replayId: n,
    event: r
}) {
    const o = typeof e._integrations == "object" && e._integrations !== null && !Array.isArray(e._integrations) ? Object.keys(e._integrations) : void 0,
        s = {
            event_id: n,
            integrations: o
        };
    e.emit("preprocessEvent", r, s);
    const i = await wf(e.getOptions(), r, s, t, e, ke());
    if (!i) return null;
    e.emit("postprocessEvent", i, s), i.platform = i.platform || "javascript";
    const a = e.getSdkMetadata(),
        {
            name: c,
            version: u,
            settings: d
        } = a ?.sdk || {};
    return i.sdk = { ...i.sdk,
        name: c || "sentry.javascript.unknown",
        version: u || "0.0.0",
        settings: d
    }, i
}
async function E1({
    recordingData: e,
    replayId: t,
    segmentId: n,
    eventContext: r,
    timestamp: o,
    session: s
}) {
    const i = S1({
            recordingData: e,
            headers: {
                segment_id: n
            }
        }),
        {
            urls: a,
            errorIds: c,
            traceIds: u,
            initialTimestamp: d
        } = r,
        l = C(),
        f = j(),
        p = l ?.getTransport(),
        h = l ?.getDsn();
    if (!l || !p || !h || !s.sampled) return Promise.resolve({});
    const m = {
            type: Xw,
            replay_start_timestamp: d / 1e3,
            timestamp: o / 1e3,
            error_ids: c,
            trace_ids: u,
            urls: a,
            replay_id: t,
            segment_id: n,
            replay_type: s.sampled
        },
        _ = await b1({
            scope: f,
            client: l,
            replayId: t,
            event: m
        });
    if (!_) return l.recordDroppedEvent("event_processor", "replay"), U && H.log("An event processor returned `null`, will not send event."), Promise.resolve({});
    delete _.sdkProcessingMetadata;
    const y = y1(_, i, h, l.getOptions().tunnel);
    let b;
    try {
        b = await p.send(y)
    } catch (T) {
        const L = new Error(Dc);
        try {
            L.cause = T
        } catch {}
        throw L
    }
    if (typeof b.statusCode == "number" && (b.statusCode < 200 || b.statusCode >= 300)) throw new Kh(b.statusCode);
    const N = Ff({}, b);
    if (Df(N, "replay")) throw new Yc(N);
    return b
}
class Kh extends Error {
    constructor(t) {
        super(`Transport returned status code ${t}`)
    }
}
class Yc extends Error {
    constructor(t) {
        super("Rate limit hit"), this.rateLimits = t
    }
}
async function Yh(e, t = {
    count: 0,
    interval: rk
}) {
    const {
        recordingData: n,
        onError: r
    } = e;
    if (n.length) try {
        return await E1(e), !0
    } catch (o) {
        if (o instanceof Kh || o instanceof Yc) throw o;
        if (kf("Replays", {
                _retryCount: t.count
            }), r && r(o), t.count >= ok) {
            const s = new Error(`${Dc} - max retries exceeded`);
            try {
                s.cause = o
            } catch {}
            throw s
        }
        return t.interval *= ++t.count, new Promise((s, i) => {
            io(async () => {
                try {
                    await Yh(e, t), s(!0)
                } catch (a) {
                    i(a)
                }
            }, t.interval)
        })
    }
}
const Xh = "__THROTTLED",
    v1 = "__SKIPPED";

function T1(e, t, n) {
    const r = new Map,
        o = a => {
            const c = a - n;
            r.forEach((u, d) => {
                d < c && r.delete(d)
            })
        },
        s = () => [...r.values()].reduce((a, c) => a + c, 0);
    let i = !1;
    return (...a) => {
        const c = Math.floor(Date.now() / 1e3);
        if (o(c), s() >= t) {
            const d = i;
            return i = !0, d ? v1 : Xh
        }
        i = !1;
        const u = r.get(c) || 0;
        return r.set(c, u + 1), e(...a)
    }
}
class I1 {
    constructor({
        options: t,
        recordingOptions: n
    }) {
        this.eventBuffer = null, this.performanceEntries = [], this.replayPerformanceEntries = [], this.recordingMode = "session", this.timeouts = {
            sessionIdlePause: Qw,
            sessionIdleExpire: Zw
        }, this._lastActivity = Date.now(), this._isEnabled = !1, this._isPaused = !1, this._requiresManualStart = !1, this._hasInitializedCoreListeners = !1, this._context = {
            errorIds: new Set,
            traceIds: new Set,
            urls: [],
            initialTimestamp: Date.now(),
            initialUrl: ""
        }, this._recordingOptions = n, this._options = t, this._debouncedFlush = f1(() => this._flush(), this._options.flushMinDelay, {
            maxWait: this._options.flushMaxDelay
        }), this._throttledAddEvent = T1((i, a) => yC(this, i, a), 300, 5);
        const {
            slowClickTimeout: r,
            slowClickIgnoreSelectors: o
        } = this.getOptions(), s = r ? {
            threshold: Math.min(sk, r),
            timeout: r,
            scrollTimeout: ik,
            ignoreSelector: o ? o.join(",") : ""
        } : void 0;
        if (s && (this.clickDetector = new MR(this, s)), U) {
            const i = t._experiments;
            H.setConfig({
                captureExceptions: !!i.captureExceptions,
                traceInternals: !!i.traceInternals
            })
        }
        this._handleVisibilityChange = () => {
            fe.document.visibilityState === "visible" ? this._doChangeToForegroundTasks() : this._doChangeToBackgroundTasks()
        }, this._handleWindowBlur = () => {
            const i = ht({
                category: "ui.blur"
            });
            this._doChangeToBackgroundTasks(i)
        }, this._handleWindowFocus = () => {
            const i = ht({
                category: "ui.focus"
            });
            this._doChangeToForegroundTasks(i)
        }, this._handleKeyboardEvent = i => {
            zR(this, i)
        }
    }
    getContext() {
        return this._context
    }
    isEnabled() {
        return this._isEnabled
    }
    isPaused() {
        return this._isPaused
    }
    isRecordingCanvas() {
        return !!this._canvas
    }
    getOptions() {
        return this._options
    }
    handleException(t) {
        U && H.exception(t), this._options.onError && this._options.onError(t)
    }
    initializeSampling(t) {
        const {
            errorSampleRate: n,
            sessionSampleRate: r
        } = this._options, o = n <= 0 && r <= 0;
        if (this._requiresManualStart = o, !o) {
            if (this._initializeSessionForSampling(t), !this.session) {
                U && H.exception(new Error("Unable to initialize and create session"));
                return
            }
            this.session.sampled !== !1 && (this.recordingMode = this.session.sampled === "buffer" && this.session.segmentId === 0 ? "buffer" : "session", U && H.infoTick(`Starting replay in ${this.recordingMode} mode`), this._initializeRecording())
        }
    }
    start() {
        if (this._isEnabled && this.recordingMode === "session") {
            U && H.log("Recording is already in progress");
            return
        }
        if (this._isEnabled && this.recordingMode === "buffer") {
            U && H.log("Buffering is in progress, call `flush()` to save the replay");
            return
        }
        U && H.infoTick("Starting replay in session mode"), this._updateUserActivity();
        const t = Gi({
            maxReplayDuration: this._options.maxReplayDuration,
            sessionIdleExpire: this.timeouts.sessionIdleExpire
        }, {
            stickySession: this._options.stickySession,
            sessionSampleRate: 1,
            allowBuffering: !1
        });
        this.session = t, this.recordingMode = "session", this._initializeRecording()
    }
    startBuffering() {
        if (this._isEnabled) {
            U && H.log("Buffering is in progress, call `flush()` to save the replay");
            return
        }
        U && H.infoTick("Starting replay in buffer mode");
        const t = Gi({
            sessionIdleExpire: this.timeouts.sessionIdleExpire,
            maxReplayDuration: this._options.maxReplayDuration
        }, {
            stickySession: this._options.stickySession,
            sessionSampleRate: 0,
            allowBuffering: !0
        });
        this.session = t, this.recordingMode = "buffer", this._initializeRecording()
    }
    startRecording() {
        try {
            const t = this._canvas;
            this._stopRecording = Ct({ ...this._recordingOptions,
                ...this.recordingMode === "buffer" ? {
                    checkoutEveryNms: nk
                } : this._options._experiments.continuousCheckout && {
                    checkoutEveryNms: Math.max(36e4, this._options._experiments.continuousCheckout)
                },
                emit: h1(this),
                ...p1(),
                onMutation: this._onMutationHandler.bind(this),
                ...t ? {
                    recordCanvas: t.recordCanvas,
                    getCanvasManager: t.getCanvasManager,
                    sampling: t.sampling,
                    dataURLOptions: t.dataURLOptions
                } : {}
            })
        } catch (t) {
            this.handleException(t)
        }
    }
    stopRecording() {
        try {
            return this._stopRecording && (this._stopRecording(), this._stopRecording = void 0), !0
        } catch (t) {
            return this.handleException(t), !1
        }
    }
    async stop({
        forceFlush: t = !1,
        reason: n
    } = {}) {
        if (this._isEnabled) {
            this._isEnabled = !1, this.recordingMode = "buffer";
            try {
                U && H.log(`Stopping Replay${n?` triggered by ${n}`:""}`), zh(), this._removeListeners(), this.stopRecording(), this._debouncedFlush.cancel(), t && await this._flush({
                    force: !0
                }), this.eventBuffer ?.destroy(), this.eventBuffer = null, pC(this)
            } catch (r) {
                this.handleException(r)
            }
        }
    }
    pause() {
        this._isPaused || (this._isPaused = !0, this.stopRecording(), U && H.log("Pausing replay"))
    }
    resume() {
        !this._isPaused || !this._checkSession() || (this._isPaused = !1, this.startRecording(), U && H.log("Resuming replay"))
    }
    async sendBufferedReplayOrFlush({
        continueRecording: t = !0
    } = {}) {
        if (this.recordingMode === "session") return this.flushImmediate();
        const n = Date.now();
        U && H.log("Converting buffer to session"), await this.flushImmediate();
        const r = this.stopRecording();
        !t || !r || this.recordingMode !== "session" && (this.recordingMode = "session", this.session && (this.session.dirty = !1, this._updateUserActivity(n), this._updateSessionActivity(n), this._maybeSaveSession()), this.startRecording())
    }
    addUpdate(t) {
        const n = t();
        this.recordingMode === "buffer" || !this._isEnabled || n !== !0 && this._debouncedFlush()
    }
    triggerUserActivity() {
        if (this._updateUserActivity(), !this._stopRecording) {
            if (!this._checkSession()) return;
            this.resume();
            return
        }
        this.checkAndHandleExpiredSession(), this._updateSessionActivity()
    }
    updateUserActivity() {
        this._updateUserActivity(), this._updateSessionActivity()
    }
    conditionalFlush() {
        return this.recordingMode === "buffer" ? Promise.resolve() : this.flushImmediate()
    }
    flush() {
        return this._debouncedFlush()
    }
    flushImmediate() {
        return this._debouncedFlush(), this._debouncedFlush.flush()
    }
    cancelFlush() {
        this._debouncedFlush.cancel()
    }
    getSessionId(t) {
        if (!(t && this.session ?.sampled === !1)) return this.session ?.id
    }
    checkAndHandleExpiredSession() {
        if (this._lastActivity && xa(this._lastActivity, this.timeouts.sessionIdlePause) && this.session && this.session.sampled === "session") {
            this.pause();
            return
        }
        return !!this._checkSession()
    }
    setInitialState() {
        const t = `${fe.location.pathname}${fe.location.hash}${fe.location.search}`,
            n = `${fe.location.origin}${t}`;
        this.performanceEntries = [], this.replayPerformanceEntries = [], this._clearContext(), this._context.initialUrl = n, this._context.initialTimestamp = Date.now(), this._context.urls.push(n)
    }
    throttledAddEvent(t, n) {
        const r = this._throttledAddEvent(t, n);
        if (r === Xh) {
            const o = ht({
                category: "replay.throttled"
            });
            this.addUpdate(() => !Jc(this, {
                type: IR,
                timestamp: o.timestamp || 0,
                data: {
                    tag: "breadcrumb",
                    payload: o,
                    metric: !0
                }
            }))
        }
        return r
    }
    getCurrentRoute() {
        const t = this.lastActiveSpan || Ee(),
            n = t && Se(t),
            o = (n && F(n).data || {})[ae];
        if (!(!n || !o || !["route", "custom"].includes(o))) return F(n).description
    }
    _initializeRecording() {
        this.setInitialState(), this._updateSessionActivity(), this.eventBuffer = lC({
            useCompression: this._options.useCompression,
            workerUrl: this._options.workerUrl
        }), this._removeListeners(), this._addListeners(), this._isEnabled = !0, this._isPaused = !1, this.startRecording()
    }
    _initializeSessionForSampling(t) {
        const n = this._options.errorSampleRate > 0,
            r = Gi({
                sessionIdleExpire: this.timeouts.sessionIdleExpire,
                maxReplayDuration: this._options.maxReplayDuration,
                previousSessionId: t
            }, {
                stickySession: this._options.stickySession,
                sessionSampleRate: this._options.sessionSampleRate,
                allowBuffering: n
            });
        this.session = r
    }
    _checkSession() {
        if (!this.session) return !1;
        const t = this.session;
        return Uh(t, {
            sessionIdleExpire: this.timeouts.sessionIdleExpire,
            maxReplayDuration: this._options.maxReplayDuration
        }) ? (this._refreshSession(t), !1) : !0
    }
    async _refreshSession(t) {
        this._isEnabled && (await this.stop({
            reason: "refresh session"
        }), this.initializeSampling(t.id))
    }
    _addListeners() {
        try {
            fe.document.addEventListener("visibilitychange", this._handleVisibilityChange), fe.addEventListener("blur", this._handleWindowBlur), fe.addEventListener("focus", this._handleWindowFocus), fe.addEventListener("keydown", this._handleKeyboardEvent), this.clickDetector && this.clickDetector.addListeners(), this._hasInitializedCoreListeners || (u1(this), this._hasInitializedCoreListeners = !0)
        } catch (t) {
            this.handleException(t)
        }
        this._performanceCleanupCallback = rC(this)
    }
    _removeListeners() {
        try {
            fe.document.removeEventListener("visibilitychange", this._handleVisibilityChange), fe.removeEventListener("blur", this._handleWindowBlur), fe.removeEventListener("focus", this._handleWindowFocus), fe.removeEventListener("keydown", this._handleKeyboardEvent), this.clickDetector && this.clickDetector.removeListeners(), this._performanceCleanupCallback && this._performanceCleanupCallback()
        } catch (t) {
            this.handleException(t)
        }
    }
    _doChangeToBackgroundTasks(t) {
        !this.session || Bh(this.session, {
            maxReplayDuration: this._options.maxReplayDuration,
            sessionIdleExpire: this.timeouts.sessionIdleExpire
        }) || (t && this._createCustomBreadcrumb(t), this.conditionalFlush())
    }
    _doChangeToForegroundTasks(t) {
        if (!this.session) return;
        if (!this.checkAndHandleExpiredSession()) {
            U && H.log("Document has become active, but session has expired");
            return
        }
        t && this._createCustomBreadcrumb(t)
    }
    _updateUserActivity(t = Date.now()) {
        this._lastActivity = t
    }
    _updateSessionActivity(t = Date.now()) {
        this.session && (this.session.lastActivity = t, this._maybeSaveSession())
    }
    _createCustomBreadcrumb(t) {
        this.addUpdate(() => {
            this.throttledAddEvent({
                type: J.Custom,
                timestamp: t.timestamp || 0,
                data: {
                    tag: "breadcrumb",
                    payload: t
                }
            })
        })
    }
    _addPerformanceEntries() {
        let t = JR(this.performanceEntries).concat(this.replayPerformanceEntries);
        if (this.performanceEntries = [], this.replayPerformanceEntries = [], this._requiresManualStart) {
            const n = this._context.initialTimestamp / 1e3;
            t = t.filter(r => r.start >= n)
        }
        return Promise.all(li(this, t))
    }
    _clearContext() {
        this._context.errorIds.clear(), this._context.traceIds.clear(), this._context.urls = []
    }
    _updateInitialTimestampFromEventBuffer() {
        const {
            session: t,
            eventBuffer: n
        } = this;
        if (!t || !n || this._requiresManualStart || t.segmentId) return;
        const r = n.getEarliestTimestamp();
        r && r < this._context.initialTimestamp && (this._context.initialTimestamp = r)
    }
    _popEventContext() {
        const t = {
            initialTimestamp: this._context.initialTimestamp,
            initialUrl: this._context.initialUrl,
            errorIds: Array.from(this._context.errorIds),
            traceIds: Array.from(this._context.traceIds),
            urls: this._context.urls
        };
        return this._clearContext(), t
    }
    async _runFlush() {
        const t = this.getSessionId();
        if (!this.session || !this.eventBuffer || !t) {
            U && H.error("No session or eventBuffer found to flush.");
            return
        }
        if (await this._addPerformanceEntries(), !!this.eventBuffer ?.hasEvents && (await l1(this), !!this.eventBuffer && t === this.getSessionId())) try {
            this._updateInitialTimestampFromEventBuffer();
            const n = Date.now();
            if (n - this._context.initialTimestamp > this._options.maxReplayDuration + 3e4) throw new Error("Session is too long, not sending replay");
            const r = this._popEventContext(),
                o = this.session.segmentId++;
            this._maybeSaveSession();
            const s = await this.eventBuffer.finish();
            await Yh({
                replayId: t,
                recordingData: s,
                segmentId: o,
                eventContext: r,
                session: this.session,
                timestamp: n,
                onError: i => this.handleException(i)
            })
        } catch (n) {
            this.handleException(n), this.stop({
                reason: "sendReplay"
            });
            const r = C();
            if (r) {
                const o = n instanceof Yc ? "ratelimit_backoff" : "send_error";
                r.recordDroppedEvent(o, "replay")
            }
        }
    }
    async _flush({
        force: t = !1
    } = {}) {
        if (!this._isEnabled && !t) return;
        if (!this.checkAndHandleExpiredSession()) {
            U && H.error("Attempting to finish replay event after session expired.");
            return
        }
        if (!this.session) return;
        const n = this.session.started,
            o = Date.now() - n;
        this._debouncedFlush.cancel();
        const s = o < this._options.minReplayDuration,
            i = o > this._options.maxReplayDuration + 5e3;
        if (s || i) {
            U && H.log(`Session duration (${Math.floor(o/1e3)}s) is too ${s?"short":"long"}, not sending replay.`), s && this._debouncedFlush();
            return
        }
        const a = this.eventBuffer;
        a && this.session.segmentId === 0 && !a.hasCheckout && U && H.log("Flushing initial segment without checkout.");
        const c = !!this._flushLock;
        this._flushLock || (this._flushLock = this._runFlush());
        try {
            await this._flushLock
        } catch (u) {
            this.handleException(u)
        } finally {
            this._flushLock = void 0, c && this._debouncedFlush()
        }
    }
    _maybeSaveSession() {
        this.session && this._options.stickySession && ui(this.session)
    }
    _onMutationHandler(t) {
        const {
            ignoreMutations: n
        } = this._options._experiments;
        if (n ?.length && t.some(a => {
                const c = _1(a.target),
                    u = n.join(",");
                return c ?.matches(u)
            })) return !1;
        const r = t.length,
            o = this._options.mutationLimit,
            s = this._options.mutationBreadcrumbLimit,
            i = o && r > o;
        if (r > s || i) {
            const a = ht({
                category: "replay.mutations",
                data: {
                    count: r,
                    limit: i
                }
            });
            this._createCustomBreadcrumb(a)
        }
        return i ? (this.stop({
            reason: "mutationLimit",
            forceFlush: this.recordingMode === "session"
        }), !1) : !0
    }
}

function Rr(e, t) {
    return [...e, ...t].join(",")
}

function w1({
    mask: e,
    unmask: t,
    block: n,
    unblock: r,
    ignore: o
}) {
    const s = ["base", "iframe[srcdoc]:not([src])"],
        i = Rr(e, [".sentry-mask", "[data-sentry-mask]"]),
        a = Rr(t, []);
    return {
        maskTextSelector: i,
        unmaskTextSelector: a,
        blockSelector: Rr(n, [".sentry-block", "[data-sentry-block]", ...s]),
        unblockSelector: Rr(r, []),
        ignoreSelector: Rr(o, [".sentry-ignore", "[data-sentry-ignore]", 'input[type="file"]'])
    }
}

function k1({
    el: e,
    key: t,
    maskAttributes: n,
    maskAllText: r,
    privacyOptions: o,
    value: s
}) {
    return !r || o.unmaskTextSelector && e.matches(o.unmaskTextSelector) ? s : n.includes(t) || t === "value" && e.tagName === "INPUT" && ["submit", "button"].includes(e.getAttribute("type") || "") ? s.replace(/[\S]/g, "*") : s
}
const cd = 'img,image,svg,video,object,picture,embed,map,audio,link[rel="icon"],link[rel="apple-touch-icon"]',
    R1 = ["content-length", "content-type", "accept"],
    C1 = Symbol.for("sentry__originalRequestBody");
let ud = !1,
    ld = !1;

function A1() {
    if (typeof Request > "u" || ld) return;
    const e = Request;
    try {
        const t = function(n, r) {
            const o = new e(n, r);
            return r ?.body != null && (o[C1] = r.body), o
        };
        t.prototype = e.prototype, $.Request = t, ld = !0
    } catch {}
}
const TM = (e => new x1(e));
class x1 {
    constructor({
        flushMinDelay: t = ek,
        flushMaxDelay: n = tk,
        minReplayDuration: r = ak,
        maxReplayDuration: o = Hl,
        stickySession: s = !0,
        useCompression: i = !0,
        workerUrl: a,
        _experiments: c = {},
        maskAllText: u = !0,
        maskAllInputs: d = !0,
        blockAllMedia: l = !0,
        mutationBreadcrumbLimit: f = 750,
        mutationLimit: p = 1e4,
        slowClickTimeout: h = 7e3,
        slowClickIgnoreSelectors: m = [],
        networkDetailAllowUrls: _ = [],
        networkDetailDenyUrls: y = [],
        networkCaptureBodies: b = !0,
        networkRequestHeaders: N = [],
        networkResponseHeaders: T = [],
        mask: L = [],
        maskAttributes: A = ["title", "placeholder", "aria-label"],
        unmask: S = [],
        block: x = [],
        unblock: B = [],
        ignore: E = [],
        maskFn: O,
        beforeAddRecordingEvent: k,
        beforeErrorSampling: P,
        onError: D,
        attachRawBodyFromRequest: ee = !1
    } = {}) {
        this.name = "Replay";
        const Y = w1({
            mask: L,
            unmask: S,
            block: x,
            unblock: B,
            ignore: E
        });
        if (this._recordingOptions = {
                maskAllInputs: d,
                maskAllText: u,
                maskInputOptions: {
                    password: !0
                },
                maskTextFn: O,
                maskInputFn: O,
                maskAttributeFn: (ne, v, z) => k1({
                    maskAttributes: A,
                    maskAllText: u,
                    privacyOptions: Y,
                    key: ne,
                    value: v,
                    el: z
                }),
                ...Y,
                slimDOMOptions: "all",
                inlineStylesheet: !0,
                inlineImages: !1,
                collectFonts: !0,
                errorHandler: ne => {
                    try {
                        ne.__rrweb__ = !0
                    } catch {}
                },
                recordCrossOriginIframes: !!c.recordCrossOriginIframes
            }, this._initialOptions = {
                flushMinDelay: t,
                flushMaxDelay: n,
                minReplayDuration: Math.min(r, ck),
                maxReplayDuration: Math.min(o, Hl),
                stickySession: s,
                useCompression: i,
                workerUrl: a,
                blockAllMedia: l,
                maskAllInputs: d,
                maskAllText: u,
                mutationBreadcrumbLimit: f,
                mutationLimit: p,
                slowClickTimeout: h,
                slowClickIgnoreSelectors: m,
                networkDetailAllowUrls: _,
                networkDetailDenyUrls: y,
                networkCaptureBodies: b,
                networkRequestHeaders: dd(N),
                networkResponseHeaders: dd(T),
                beforeAddRecordingEvent: k,
                beforeErrorSampling: P,
                onError: D,
                attachRawBodyFromRequest: ee,
                _experiments: c
            }, this._initialOptions.blockAllMedia && (this._recordingOptions.blockSelector = this._recordingOptions.blockSelector ? `${this._recordingOptions.blockSelector},${cd}` : cd, this._recordingOptions.ignoreCSSAttributes = new Set(["background-image"])), this._isInitialized && _s()) throw new Error("Multiple Sentry Session Replay instances are not supported");
        this._isInitialized = !0
    }
    get _isInitialized() {
        return ud
    }
    set _isInitialized(t) {
        ud = t
    }
    afterAllSetup(t) {
        !_s() || this._replay || (this._initialOptions.attachRawBodyFromRequest && A1(), this._setup(t), this._initialize(t))
    }
    start() {
        this._replay && this._replay.start()
    }
    startBuffering() {
        this._replay && this._replay.startBuffering()
    }
    stop() {
        return this._replay ? this._replay.stop({
            forceFlush: this._replay.recordingMode === "session"
        }) : Promise.resolve()
    }
    flush(t) {
        return this._replay ? this._replay.isEnabled() ? this._replay.sendBufferedReplayOrFlush(t) : (this._replay.start(), Promise.resolve()) : Promise.resolve()
    }
    getReplayId(t) {
        if (this._replay ?.isEnabled()) return this._replay.getSessionId(t)
    }
    getRecordingMode() {
        if (this._replay ?.isEnabled()) return this._replay.recordingMode
    }
    _initialize(t) {
        this._replay && (this._maybeLoadFromReplayCanvasIntegration(t), this._replay.initializeSampling())
    }
    _setup(t) {
        const n = M1(this._initialOptions, t);
        this._replay = new I1({
            options: n,
            recordingOptions: this._recordingOptions
        })
    }
    _maybeLoadFromReplayCanvasIntegration(t) {
        try {
            const n = t.getIntegrationByName("ReplayCanvas");
            if (!n) return;
            this._replay._canvas = n.getOptions()
        } catch {}
    }
}

function M1(e, t) {
    const n = t.getOptions(),
        r = {
            sessionSampleRate: 0,
            errorSampleRate: 0,
            ...e
        },
        o = wn(n.replaysSessionSampleRate),
        s = wn(n.replaysOnErrorSampleRate);
    return o == null && s == null && on(() => {
        console.warn("Replay is disabled because neither `replaysSessionSampleRate` nor `replaysOnErrorSampleRate` are set.")
    }), o != null && (r.sessionSampleRate = o), s != null && (r.errorSampleRate = s), r
}

function dd(e) {
    return [...R1, ...e.map(t => t.toLowerCase())]
}

function IM() {
    return C() ?.getIntegrationByName("Replay")
}
var N1 = Object.defineProperty,
    O1 = (e, t, n) => t in e ? N1(e, t, {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: n
    }) : e[t] = n,
    fd = (e, t, n) => O1(e, typeof t != "symbol" ? t + "" : t, n);
class P1 {
    constructor() {
        fd(this, "idNodeMap", new Map), fd(this, "nodeMetaMap", new WeakMap)
    }
    getId(t) {
        return t ? this.getMeta(t) ?.id ?? -1 : -1
    }
    getNode(t) {
        return this.idNodeMap.get(t) || null
    }
    getIds() {
        return Array.from(this.idNodeMap.keys())
    }
    getMeta(t) {
        return this.nodeMetaMap.get(t) || null
    }
    removeNodeFromMap(t) {
        const n = this.getId(t);
        this.idNodeMap.delete(n), t.childNodes && t.childNodes.forEach(r => this.removeNodeFromMap(r))
    }
    has(t) {
        return this.idNodeMap.has(t)
    }
    hasNode(t) {
        return this.nodeMetaMap.has(t)
    }
    add(t, n) {
        const r = n.id;
        this.idNodeMap.set(r, t), this.nodeMetaMap.set(t, n)
    }
    replace(t, n) {
        const r = this.getNode(t);
        if (r) {
            const o = this.nodeMetaMap.get(r);
            o && this.nodeMetaMap.set(n, o)
        }
        this.idNodeMap.set(t, n)
    }
    reset() {
        this.idNodeMap = new Map, this.nodeMetaMap = new WeakMap
    }
}

function L1() {
    return new P1
}

function D1(e, t) {
    for (let n = e.classList.length; n--;) {
        const r = e.classList[n];
        if (t.test(r)) return !0
    }
    return !1
}

function Oa(e, t, n = 1 / 0, r = 0) {
    return !e || e.nodeType !== e.ELEMENT_NODE || r > n ? -1 : t(e) ? r : Oa(e.parentNode, t, n, r + 1)
}

function pd(e, t) {
    return n => {
        const r = n;
        if (r === null) return !1;
        try {
            if (e) {
                if (typeof e == "string") {
                    if (r.matches(`.${e}`)) return !0
                } else if (D1(r, e)) return !0
            }
            return !!(t && r.matches(t))
        } catch {
            return !1
        }
    }
}
const jn = `Please stop import mirror directly. Instead of that,\r
now you can use replayer.getMirror() to access the mirror instance of a replayer,\r
or you can use record.mirror to access the mirror instance during recording.`;
let hd = {
    map: {},
    getId() {
        return console.error(jn), -1
    },
    getNode() {
        return console.error(jn), null
    },
    removeNodeFromMap() {
        console.error(jn)
    },
    has() {
        return console.error(jn), !1
    },
    reset() {
        console.error(jn)
    }
};
typeof window < "u" && window.Proxy && window.Reflect && (hd = new Proxy(hd, {
    get(e, t, n) {
        return t === "map" && console.error(jn), Reflect.get(e, t, n)
    }
}));

function Xc(e, t, n, r, o = window) {
    const s = o.Object.getOwnPropertyDescriptor(e, t);
    return o.Object.defineProperty(e, t, r ? n : {
        set(i) {
            Zh(() => {
                n.set.call(this, i)
            }, 0), s && s.set && s.set.call(this, i)
        }
    }), () => Xc(e, t, s || {}, !0)
}

function Qc(e, t, n) {
    try {
        if (!(t in e)) return () => {};
        const r = e[t],
            o = n(r);
        return typeof o == "function" && (o.prototype = o.prototype || {}, Object.defineProperties(o, {
            __rrweb_original__: {
                enumerable: !1,
                value: r
            }
        })), e[t] = o, () => {
            e[t] = r
        }
    } catch {
        return () => {}
    }
}
Date.now().toString();

function F1(e) {
    if (!e) return null;
    try {
        return e.nodeType === e.ELEMENT_NODE ? e : e.parentElement
    } catch {
        return null
    }
}

function fi(e, t, n, r, o) {
    if (!e) return !1;
    const s = F1(e);
    if (!s) return !1;
    const i = pd(t, n),
        a = Oa(s, i);
    let c = -1;
    return a < 0 ? !1 : (r && (c = Oa(s, pd(null, r))), a > -1 && c < 0 ? !0 : a < c)
}
const md = {};

function Qh(e) {
    const t = md[e];
    if (t) return t;
    const n = window.document;
    let r = window[e];
    if (n && typeof n.createElement == "function") try {
        const o = n.createElement("iframe");
        o.hidden = !0, n.head.appendChild(o);
        const s = o.contentWindow;
        s && s[e] && (r = s[e]), n.head.removeChild(o)
    } catch {}
    return md[e] = r.bind(window)
}

function pn(...e) {
    return Qh("requestAnimationFrame")(...e)
}

function Zh(...e) {
    return Qh("setTimeout")(...e)
}
var fr = (e => (e[e["2D"] = 0] = "2D", e[e.WebGL = 1] = "WebGL", e[e.WebGL2 = 2] = "WebGL2", e))(fr || {});
let Qo;

function $1(e) {
    Qo = e
}
const Vi = e => Qo ? (...n) => {
    try {
        return e(...n)
    } catch (r) {
        if (Qo && Qo(r) === !0) return () => {};
        throw r
    }
} : e;
var Jn = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    B1 = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var Mo = 0; Mo < Jn.length; Mo++) B1[Jn.charCodeAt(Mo)] = Mo;
var U1 = function(e) {
    var t = new Uint8Array(e),
        n, r = t.length,
        o = "";
    for (n = 0; n < r; n += 3) o += Jn[t[n] >> 2], o += Jn[(t[n] & 3) << 4 | t[n + 1] >> 4], o += Jn[(t[n + 1] & 15) << 2 | t[n + 2] >> 6], o += Jn[t[n + 2] & 63];
    return r % 3 === 2 ? o = o.substring(0, o.length - 1) + "=" : r % 3 === 1 && (o = o.substring(0, o.length - 2) + "=="), o
};
const gd = new Map;

function H1(e, t) {
    let n = gd.get(e);
    return n || (n = new Map, gd.set(e, n)), n.has(t) || n.set(t, []), n.get(t)
}
const em = (e, t, n) => {
    if (!e || !(nm(e, t) || typeof e == "object")) return;
    const r = e.constructor.name,
        o = H1(n, r);
    let s = o.indexOf(e);
    return s === -1 && (s = o.length, o.push(e)), s
};

function Zo(e, t, n) {
    if (e instanceof Array) return e.map(r => Zo(r, t, n));
    if (e === null) return e;
    if (e instanceof Float32Array || e instanceof Float64Array || e instanceof Int32Array || e instanceof Uint32Array || e instanceof Uint8Array || e instanceof Uint16Array || e instanceof Int16Array || e instanceof Int8Array || e instanceof Uint8ClampedArray) return {
        rr_type: e.constructor.name,
        args: [Object.values(e)]
    };
    if (e instanceof ArrayBuffer) {
        const r = e.constructor.name,
            o = U1(e);
        return {
            rr_type: r,
            base64: o
        }
    } else {
        if (e instanceof DataView) return {
            rr_type: e.constructor.name,
            args: [Zo(e.buffer, t, n), e.byteOffset, e.byteLength]
        };
        if (e instanceof HTMLImageElement) {
            const r = e.constructor.name,
                {
                    src: o
                } = e;
            return {
                rr_type: r,
                src: o
            }
        } else if (e instanceof HTMLCanvasElement) {
            const r = "HTMLImageElement",
                o = e.toDataURL();
            return {
                rr_type: r,
                src: o
            }
        } else {
            if (e instanceof ImageData) return {
                rr_type: e.constructor.name,
                args: [Zo(e.data, t, n), e.width, e.height]
            };
            if (nm(e, t) || typeof e == "object") {
                const r = e.constructor.name,
                    o = em(e, t, n);
                return {
                    rr_type: r,
                    index: o
                }
            }
        }
    }
    return e
}
const tm = (e, t, n) => e.map(r => Zo(r, t, n)),
    nm = (e, t) => !!["WebGLActiveInfo", "WebGLBuffer", "WebGLFramebuffer", "WebGLProgram", "WebGLRenderbuffer", "WebGLShader", "WebGLShaderPrecisionFormat", "WebGLTexture", "WebGLUniformLocation", "WebGLVertexArrayObject", "WebGLVertexArrayObjectOES"].filter(o => typeof t[o] == "function").find(o => e instanceof t[o]);

function W1(e, t, n, r, o) {
    const s = [],
        i = Object.getOwnPropertyNames(t.CanvasRenderingContext2D.prototype);
    for (const a of i) try {
        if (typeof t.CanvasRenderingContext2D.prototype[a] != "function") continue;
        const c = Qc(t.CanvasRenderingContext2D.prototype, a, function(u) {
            return function(...d) {
                return fi(this.canvas, n, r, o, !0) || Zh(() => {
                    const l = tm(d, t, this);
                    e(this.canvas, {
                        type: fr["2D"],
                        property: a,
                        args: l
                    })
                }, 0), u.apply(this, d)
            }
        });
        s.push(c)
    } catch {
        const c = Xc(t.CanvasRenderingContext2D.prototype, a, {
            set(u) {
                e(this.canvas, {
                    type: fr["2D"],
                    property: a,
                    args: [u],
                    setter: !0
                })
            }
        });
        s.push(c)
    }
    return () => {
        s.forEach(a => a())
    }
}

function j1(e) {
    return e === "experimental-webgl" ? "webgl" : e
}

function _d(e, t, n, r, o) {
    const s = [];
    try {
        const i = Qc(e.HTMLCanvasElement.prototype, "getContext", function(a) {
            return function(c, ...u) {
                if (!fi(this, t, n, r, !0)) {
                    const d = j1(c);
                    if ("__context" in this || (this.__context = d), o && ["webgl", "webgl2"].includes(d))
                        if (u[0] && typeof u[0] == "object") {
                            const l = u[0];
                            l.preserveDrawingBuffer || (l.preserveDrawingBuffer = !0)
                        } else u.splice(0, 1, {
                            preserveDrawingBuffer: !0
                        })
                }
                return a.apply(this, [c, ...u])
            }
        });
        s.push(i)
    } catch {
        console.error("failed to patch HTMLCanvasElement.prototype.getContext")
    }
    return () => {
        s.forEach(i => i())
    }
}

function yd(e, t, n, r, o, s, i, a) {
    const c = [],
        u = Object.getOwnPropertyNames(e);
    for (const d of u)
        if (!["isContextLost", "canvas", "drawingBufferWidth", "drawingBufferHeight"].includes(d)) try {
            if (typeof e[d] != "function") continue;
            const l = Qc(e, d, function(f) {
                return function(...p) {
                    const h = f.apply(this, p);
                    if (em(h, a, this), "tagName" in this.canvas && !fi(this.canvas, r, o, s, !0)) {
                        const m = tm(p, a, this),
                            _ = {
                                type: t,
                                property: d,
                                args: m
                            };
                        n(this.canvas, _)
                    }
                    return h
                }
            });
            c.push(l)
        } catch {
            const l = Xc(e, d, {
                set(f) {
                    n(this.canvas, {
                        type: t,
                        property: d,
                        args: [f],
                        setter: !0
                    })
                }
            });
            c.push(l)
        }
    return c
}

function z1(e, t, n, r, o, s) {
    const i = [];
    return i.push(...yd(t.WebGLRenderingContext.prototype, fr.WebGL, e, n, r, o, s, t)), typeof t.WebGL2RenderingContext < "u" && i.push(...yd(t.WebGL2RenderingContext.prototype, fr.WebGL2, e, n, r, o, s, t)), () => {
        i.forEach(a => a())
    }
}
const q1 = 'for(var e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",t="undefined"==typeof Uint8Array?[]:new Uint8Array(256),a=0;a<64;a++)t[e.charCodeAt(a)]=a;var n=function(t){var a,n=new Uint8Array(t),r=n.length,s="";for(a=0;a<r;a+=3)s+=e[n[a]>>2],s+=e[(3&n[a])<<4|n[a+1]>>4],s+=e[(15&n[a+1])<<2|n[a+2]>>6],s+=e[63&n[a+2]];return r%3==2?s=s.substring(0,s.length-1)+"=":r%3==1&&(s=s.substring(0,s.length-2)+"=="),s};const r=new Map,s=new Map;const i=self;i.onmessage=async function(e){if(!("OffscreenCanvas"in globalThis))return i.postMessage({id:e.data.id});{const{id:t,bitmap:a,width:o,height:f,maxCanvasSize:c,dataURLOptions:g}=e.data,u=async function(e,t,a){const r=e+"-"+t;if("OffscreenCanvas"in globalThis){if(s.has(r))return s.get(r);const i=new OffscreenCanvas(e,t);i.getContext("2d");const o=await i.convertToBlob(a),f=await o.arrayBuffer(),c=n(f);return s.set(r,c),c}return""}(o,f,g),[h,d]=function(e,t,a){if(!a)return[e,t];const[n,r]=a;if(e<=n&&t<=r)return[e,t];let s=e,i=t;return s>n&&(i=Math.floor(n*t/e),s=n),i>r&&(s=Math.floor(r*e/t),i=r),[s,i]}(o,f,c),l=new OffscreenCanvas(h,d),w=l.getContext("bitmaprenderer"),p=h===o&&d===f?a:await createImageBitmap(a,{resizeWidth:h,resizeHeight:d,resizeQuality:"low"});w?.transferFromImageBitmap(p),a.close();const y=await l.convertToBlob(g),v=y.type,b=await y.arrayBuffer(),m=n(b);if(p.close(),!r.has(t)&&await u===m)return r.set(t,m),i.postMessage({id:t});if(r.get(t)===m)return i.postMessage({id:t});i.postMessage({id:t,type:v,base64:m,width:o,height:f}),r.set(t,m)}};';

function G1() {
    const e = new Blob([q1]);
    return URL.createObjectURL(e)
}
class V1 {
    constructor(t) {
        this.pendingCanvasMutations = new Map, this.rafStamps = {
            latestId: 0,
            invokeId: null
        }, this.shadowDoms = new Set, this.windowsSet = new WeakSet, this.windows = [], this.restoreHandlers = [], this.frozen = !1, this.locked = !1, this.snapshotInProgressMap = new Map, this.worker = null, this.lastSnapshotTime = 0, this.processMutation = (a, c) => {
            (this.rafStamps.invokeId && this.rafStamps.latestId !== this.rafStamps.invokeId || !this.rafStamps.invokeId) && (this.rafStamps.invokeId = this.rafStamps.latestId), this.pendingCanvasMutations.has(a) || this.pendingCanvasMutations.set(a, []), this.pendingCanvasMutations.get(a).push(c)
        };
        const {
            enableManualSnapshot: n,
            sampling: r = "all",
            win: o,
            recordCanvas: s,
            errorHandler: i
        } = t;
        t.sampling = r, this.mutationCb = t.mutationCb, this.mirror = t.mirror, this.options = t, i && $1(i), (s && typeof r == "number" || n) && (this.worker = this.initFPSWorker()), this.addWindow(o), !n && Vi(() => {
            s && r === "all" && (this.startRAFTimestamping(), this.startPendingCanvasMutationFlusher()), s && typeof r == "number" && this.initCanvasFPSObserver()
        })()
    }
    reset() {
        this.pendingCanvasMutations.clear(), this.restoreHandlers.forEach(t => {
            try {
                t()
            } catch {}
        }), this.restoreHandlers = [], this.windowsSet = new WeakSet, this.windows = [], this.shadowDoms = new Set, this.worker ?.terminate(), this.worker = null, this.snapshotInProgressMap = new Map
    }
    freeze() {
        this.frozen = !0
    }
    unfreeze() {
        this.frozen = !1
    }
    lock() {
        this.locked = !0
    }
    unlock() {
        this.locked = !1
    }
    addWindow(t) {
        const {
            sampling: n = "all",
            blockClass: r,
            blockSelector: o,
            unblockSelector: s,
            recordCanvas: i,
            enableManualSnapshot: a
        } = this.options;
        if (!this.windowsSet.has(t)) {
            if (a) {
                this.windowsSet.add(t), this.windows.push(new WeakRef(t));
                return
            }
            Vi(() => {
                if (i && n === "all" && this.initCanvasMutationObserver(t, r, o, s), i && typeof n == "number") {
                    const c = _d(t, r, o, s, !0);
                    this.restoreHandlers.push(() => {
                        c()
                    })
                }
            })(), this.windowsSet.add(t), this.windows.push(new WeakRef(t))
        }
    }
    addShadowRoot(t) {
        this.shadowDoms.add(new WeakRef(t))
    }
    resetShadowRoots() {
        this.shadowDoms = new Set
    }
    snapshot(t, n) {
        if (n ?.skipRequestAnimationFrame) {
            this.takeSnapshot(performance.now(), !0, t);
            return
        }
        pn(r => this.takeSnapshot(r, !0, t))
    }
    initFPSWorker() {
        const t = new Worker(G1());
        return t.onmessage = n => {
            const r = n.data,
                {
                    id: o
                } = r;
            if (this.snapshotInProgressMap.set(o, !1), !("base64" in r)) return;
            const {
                base64: s,
                type: i,
                width: a,
                height: c
            } = r;
            this.mutationCb({
                id: o,
                type: fr["2D"],
                commands: [{
                    property: "clearRect",
                    args: [0, 0, a, c]
                }, {
                    property: "drawImage",
                    args: [{
                        rr_type: "ImageBitmap",
                        args: [{
                            rr_type: "Blob",
                            data: [{
                                rr_type: "ArrayBuffer",
                                base64: s
                            }],
                            type: i
                        }]
                    }, 0, 0, a, c]
                }]
            })
        }, t
    }
    initCanvasFPSObserver() {
        let t;
        if (!this.windows.length && !this.shadowDoms.size) return;
        const n = r => {
            this.takeSnapshot(r, !1), t = pn(n)
        };
        t = pn(n), this.restoreHandlers.push(() => {
            t && cancelAnimationFrame(t)
        })
    }
    initCanvasMutationObserver(t, n, r, o) {
        const s = _d(t, n, r, o, !1),
            i = W1(this.processMutation.bind(this), t, n, r, o),
            a = z1(this.processMutation.bind(this), t, n, r, o, this.mirror);
        this.restoreHandlers.push(() => {
            s(), i(), a()
        })
    }
    getCanvasElements(t, n, r) {
        const o = [],
            s = i => {
                i.querySelectorAll("canvas").forEach(a => {
                    fi(a, t, n, r) || o.push(a)
                })
            };
        for (const i of this.windows) {
            const a = i.deref();
            let c;
            try {
                c = a && a.document
            } catch {}
            c && s(c)
        }
        for (const i of this.shadowDoms) {
            const a = i.deref();
            a && s(a)
        }
        return o
    }
    takeSnapshot(t, n, r) {
        const {
            sampling: o,
            blockClass: s,
            blockSelector: i,
            unblockSelector: a,
            dataURLOptions: c,
            maxCanvasSize: u
        } = this.options, l = 1e3 / (o === "all" ? 2 : o || 2);
        return this.lastSnapshotTime && t - this.lastSnapshotTime < l ? !1 : (this.lastSnapshotTime = t, (r ? [r] : this.getCanvasElements(s, i, a)).forEach(h => {
            const m = this.mirror.getId(h);
            if (!(!this.mirror.hasNode(h) || !h.width || !h.height || this.snapshotInProgressMap.get(m))) {
                if (this.snapshotInProgressMap.set(m, !0), !n && ["webgl", "webgl2"].includes(h.__context)) {
                    const _ = h.getContext(h.__context);
                    _ ?.getContextAttributes() ?.preserveDrawingBuffer === !1 && _.clear(_.COLOR_BUFFER_BIT)
                }
                createImageBitmap(h).then(_ => {
                    this.worker ?.postMessage({
                        id: m,
                        bitmap: _,
                        width: h.width,
                        height: h.height,
                        dataURLOptions: c,
                        maxCanvasSize: u
                    }, [_])
                }).catch(_ => {
                    Vi(() => {
                        throw this.snapshotInProgressMap.delete(m), _
                    })()
                })
            }
        }), !0)
    }
    startPendingCanvasMutationFlusher() {
        pn(() => this.flushPendingCanvasMutations())
    }
    startRAFTimestamping() {
        const t = n => {
            this.rafStamps.latestId = n, pn(t)
        };
        pn(t)
    }
    flushPendingCanvasMutations() {
        this.pendingCanvasMutations.forEach((t, n) => {
            const r = this.mirror.getId(n);
            this.flushPendingCanvasMutationFor(n, r)
        }), pn(() => this.flushPendingCanvasMutations())
    }
    flushPendingCanvasMutationFor(t, n) {
        if (this.frozen || this.locked) return;
        const r = this.pendingCanvasMutations.get(t);
        if (!r || n === -1) return;
        const o = r.map(i => {
                const {
                    type: a,
                    ...c
                } = i;
                return c
            }),
            {
                type: s
            } = r[0];
        this.mutationCb({
            id: n,
            type: s,
            commands: o
        }), this.pendingCanvasMutations.delete(t)
    }
}
try {
    if (Array.from([1], e => e * 2)[0] !== 2) {
        const e = document.createElement("iframe");
        document.body.appendChild(e), Array.from = e.contentWindow ?.Array.from || Array.from, document.body.removeChild(e)
    }
} catch (e) {
    console.debug("Unable to override Array.from", e)
}
L1();
var Sd;
(function(e) {
    e[e.NotStarted = 0] = "NotStarted", e[e.Running = 1] = "Running", e[e.Stopped = 2] = "Stopped"
})(Sd || (Sd = {}));
const bd = {
        low: {
            sampling: {
                canvas: 1
            },
            dataURLOptions: {
                type: "image/webp",
                quality: .25
            }
        },
        medium: {
            sampling: {
                canvas: 2
            },
            dataURLOptions: {
                type: "image/webp",
                quality: .4
            }
        },
        high: {
            sampling: {
                canvas: 4
            },
            dataURLOptions: {
                type: "image/webp",
                quality: .5
            }
        }
    },
    J1 = "ReplayCanvas",
    No = 1280,
    K1 = ((e = {}) => {
        const [t, n] = e.maxCanvasSize || [], r = {
            quality: e.quality || "medium",
            enableManualSnapshot: e.enableManualSnapshot,
            maxCanvasSize: [t ? Math.min(t, No) : No, n ? Math.min(n, No) : No]
        };
        let o;
        const s = new Promise(i => o = i);
        return {
            name: J1,
            getOptions() {
                const {
                    quality: i,
                    enableManualSnapshot: a,
                    maxCanvasSize: c
                } = r;
                return {
                    enableManualSnapshot: a,
                    recordCanvas: !0,
                    getCanvasManager: u => {
                        const d = new V1({ ...u,
                            enableManualSnapshot: a,
                            maxCanvasSize: c,
                            errorHandler: l => {
                                try {
                                    typeof l == "object" && (l.__rrweb__ = !0)
                                } catch {}
                            }
                        });
                        return o(d), d
                    },
                    ...bd[i] || bd.medium
                }
            },
            async snapshot(i, a) {
                (await s).snapshot(i, a)
            }
        }
    }),
    wM = K1;

function Y1(e) {
    return e.split(",").some(t => t.trim().startsWith("sentry-"))
}

function rm(e) {
    try {
        return new URL(e, M.location.origin).href
    } catch {
        return
    }
}

function X1(e) {
    return e.entryType === "resource" && "initiatorType" in e && typeof e.nextHopProtocol == "string" && (e.initiatorType === "fetch" || e.initiatorType === "xmlhttprequest")
}

function om(e) {
    try {
        return new Headers(e)
    } catch {
        return
    }
}
const Ed = new WeakMap,
    Ji = new Map,
    sm = {
        traceFetch: !0,
        traceXHR: !0,
        enableHTTPTimings: !0,
        trackFetchStreamPerformance: !1
    };

function Q1(e, t) {
    const {
        traceFetch: n,
        traceXHR: r,
        trackFetchStreamPerformance: o,
        shouldCreateSpanForRequest: s,
        enableHTTPTimings: i,
        tracePropagationTargets: a,
        onRequestSpanStart: c,
        onRequestSpanEnd: u
    } = { ...sm,
        ...t
    }, d = typeof s == "function" ? s : h => !0, l = h => Z1(h, a), f = {}, p = e.getOptions().propagateTraceparent;
    n && (e.addEventProcessor(h => (h.type === "transaction" && h.spans && h.spans.forEach(m => {
        if (m.op === "http.client") {
            const _ = Ji.get(m.span_id);
            _ && (m.timestamp = _ / 1e3, Ji.delete(m.span_id))
        }
    }), h)), o && lv(h => {
        if (h.response) {
            const m = Ed.get(h.response);
            m && h.endTimestamp && Ji.set(m, h.endTimestamp)
        }
    }), _c(h => {
        const m = rb(h, d, l, f, {
            propagateTraceparent: p,
            onRequestSpanEnd: u
        });
        if (h.response && h.fetchData.__span && Ed.set(h.response, h.fetchData.__span), m) {
            const _ = rm(h.fetchData.url),
                y = _ ? Tn(_).host : void 0;
            m.setAttributes({
                "http.url": _,
                "server.address": y
            }), i && vd(m), c ?.(m, {
                headers: h.headers
            })
        }
    })), r && Oc(h => {
        const m = eA(h, d, l, f, p, u);
        m && (i && vd(m), c ?.(m, {
            headers: om(h.xhr.__sentry_xhr_v3__ ?.request_headers)
        }))
    })
}

function vd(e) {
    const {
        url: t
    } = F(e).data;
    if (!t || typeof t != "string") return;
    const n = On("resource", ({
        entries: r
    }) => {
        r.forEach(o => {
            X1(o) && o.name.endsWith(t) && (e.setAttributes(Jp(o)), setTimeout(n))
        })
    })
}

function Z1(e, t) {
    const n = Ln();
    if (n) {
        let r, o;
        try {
            r = new URL(e, n), o = new URL(n).origin
        } catch {
            return !1
        }
        const s = r.origin === o;
        return t ? it(r.toString(), t) || s && it(r.pathname, t) : s
    } else {
        const r = !!e.match(/^\/(?!\/)/);
        return t ? it(e, t) : r
    }
}

function eA(e, t, n, r, o, s) {
    const i = e.xhr,
        a = i ?.[wt];
    if (!i || i.__sentry_own_request__ || !a) return;
    const {
        url: c,
        method: u
    } = a, d = Ze() && t(c);
    if (e.endTimestamp && d) {
        const y = i.__sentry_xhr_span_id__;
        if (!y) return;
        const b = r[y];
        b && a.status_code !== void 0 && (os(b, a.status_code), b.end(), s ?.(b, {
            headers: om(Xp(i)),
            error: e.error
        }), delete r[y]);
        return
    }
    const l = rm(c),
        f = Tn(l || c),
        p = qf(c),
        h = !!Ee(),
        m = d && h ? at({
            name: `${u} ${p}`,
            attributes: {
                url: c,
                type: "xhr",
                "http.method": u,
                "http.url": l,
                "server.address": f ?.host,
                [G]: "auto.http.browser",
                [pe]: "http.client",
                ...f ?.search && {
                    "http.query": f ?.search
                },
                ...f ?.hash && {
                    "http.fragment": f ?.hash
                }
            }
        }) : new Nt;
    i.__sentry_xhr_span_id__ = m.spanContext().spanId, r[i.__sentry_xhr_span_id__] = m, n(c) && tA(i, Ze() && h ? m : void 0, o);
    const _ = C();
    return _ && _.emit("beforeOutgoingRequestSpan", m, e), m
}

function tA(e, t, n) {
    const {
        "sentry-trace": r,
        baggage: o,
        traceparent: s
    } = Jf({
        span: t,
        propagateTraceparent: n
    });
    r && nA(e, r, o, s)
}

function nA(e, t, n, r) {
    const o = e.__sentry_xhr_v3__ ?.request_headers;
    if (!(o ?.["sentry-trace"] || !e.setRequestHeader)) try {
        if (e.setRequestHeader("sentry-trace", t), r && !o ?.traceparent && e.setRequestHeader("traceparent", r), n) {
            const s = o ?.baggage;
            (!s || !Y1(s)) && e.setRequestHeader("baggage", n)
        }
    } catch {}
}

function rA() {
    M.document ? M.document.addEventListener("visibilitychange", () => {
        const e = Ee();
        if (!e) return;
        const t = Se(e);
        if (M.document.hidden && t) {
            const n = "cancelled",
                {
                    op: r,
                    status: o
                } = F(t);
            I && g.log(`[Tracing] Transaction: ${n} -> since tab moved to the background, op: ${r}`), o || t.setStatus({
                code: Z,
                message: n
            }), t.setAttribute("sentry.cancellation_reason", "document.hidden"), t.end()
        }
    }) : I && g.warn("[Tracing] Could not set up background tab detection due to lack of global document")
}
const oA = 3600,
    im = "sentry_previous_trace",
    sA = "sentry.previous_trace";

function iA(e, {
    linkPreviousTrace: t,
    consistentTraceSampling: n
}) {
    const r = t === "session-storage";
    let o = r ? uA() : void 0;
    e.on("spanStart", i => {
        if (Se(i) !== i) return;
        const a = j().getPropagationContext();
        o = aA(o, i, a), r && cA(o)
    });
    let s = !0;
    n && e.on("beforeSampling", i => {
        if (!o) return;
        const a = j(),
            c = a.getPropagationContext();
        if (s && c.parentSpanId) {
            s = !1;
            return
        }
        a.setPropagationContext({ ...c,
            dsc: { ...c.dsc,
                sample_rate: String(o.sampleRate),
                sampled: String(Pa(o.spanContext))
            },
            sampleRand: o.sampleRand
        }), i.parentSampled = Pa(o.spanContext), i.parentSampleRate = o.sampleRate, i.spanAttributes = { ...i.spanAttributes,
            [ef]: o.sampleRate
        }
    })
}

function aA(e, t, n) {
    const r = F(t);

    function o() {
        try {
            return Number(n.dsc ?.sample_rate) ?? Number(r.data ?.[ja])
        } catch {
            return 0
        }
    }
    const s = {
        spanContext: t.spanContext(),
        startTimestamp: r.start_timestamp,
        sampleRate: o(),
        sampleRand: n.sampleRand
    };
    if (!e) return s;
    const i = e.spanContext;
    return i.traceId === r.trace_id ? e : (Date.now() / 1e3 - e.startTimestamp <= oA && (I && g.log(`Adding previous_trace \`${JSON.stringify(i)}\` link to span \`${JSON.stringify({op:r.op,...t.spanContext()})}\``), t.addLink({
        context: i,
        attributes: {
            [Tg]: "previous_trace"
        }
    }), t.setAttribute(sA, `${i.traceId}-${i.spanId}-${Pa(i)?1:0}`)), s)
}

function cA(e) {
    try {
        M.sessionStorage.setItem(im, JSON.stringify(e))
    } catch (t) {
        I && g.warn("Could not store previous trace in sessionStorage", t)
    }
}

function uA() {
    try {
        const e = M.sessionStorage ?.getItem(im);
        return JSON.parse(e)
    } catch {
        return
    }
}

function Pa(e) {
    return e.traceFlags === 1
}
const lA = "BrowserTracing",
    dA = { ...$o,
        instrumentNavigation: !0,
        instrumentPageLoad: !0,
        markBackgroundSpan: !0,
        enableLongTask: !0,
        enableLongAnimationFrame: !0,
        enableInp: !0,
        enableElementTiming: !0,
        ignoreResourceSpans: [],
        ignorePerformanceApiSpans: [],
        detectRedirects: !0,
        linkPreviousTrace: "in-memory",
        consistentTraceSampling: !1,
        enableReportPageLoaded: !1,
        _experiments: {},
        ...sm
    },
    uo = ((e = {}) => {
        const t = {
                name: void 0,
                source: void 0
            },
            n = M.document,
            {
                enableInp: r,
                enableElementTiming: o,
                enableLongTask: s,
                enableLongAnimationFrame: i,
                _experiments: {
                    enableInteractions: a,
                    enableStandaloneClsSpans: c,
                    enableStandaloneLcpSpans: u
                },
                beforeStartSpan: d,
                idleTimeout: l,
                finalTimeout: f,
                childSpanTimeout: p,
                markBackgroundSpan: h,
                traceFetch: m,
                traceXHR: _,
                trackFetchStreamPerformance: y,
                shouldCreateSpanForRequest: b,
                enableHTTPTimings: N,
                ignoreResourceSpans: T,
                ignorePerformanceApiSpans: L,
                instrumentPageLoad: A,
                instrumentNavigation: S,
                detectRedirects: x,
                linkPreviousTrace: B,
                consistentTraceSampling: E,
                enableReportPageLoaded: O,
                onRequestSpanStart: k,
                onRequestSpanEnd: P
            } = { ...dA,
                ...e
            };
        let D, ee, Y;

        function ne(v, z, w = !0) {
            const V = z.op === "pageload",
                se = z.name,
                re = d ? d(z) : z,
                ve = re.attributes || {};
            if (se !== re.name && (ve[ae] = "custom", re.attributes = ve), !w) {
                const Le = Dn();
                at({ ...re,
                    startTime: Le
                }).end(Le);
                return
            }
            t.name = re.name, t.source = ve[ae];
            const Pe = Tf(re, {
                idleTimeout: l,
                finalTimeout: f,
                childSpanTimeout: p,
                disableAutoFinish: V,
                beforeSpanEnd: Le => {
                    D ?.(), D0(Le, {
                        recordClsOnPageloadSpan: !c,
                        recordLcpOnPageloadSpan: !u,
                        ignoreResourceSpans: T,
                        ignorePerformanceApiSpans: L
                    }), Id(v, void 0);
                    const Be = j(),
                        dt = Be.getPropagationContext();
                    Be.setPropagationContext({ ...dt,
                        traceId: Pe.spanContext().traceId,
                        sampled: un(Pe),
                        dsc: ut(Le)
                    }), V && (Y = void 0)
                },
                trimIdleSpanEndTimestamp: !O
            });
            V && O && (Y = Pe), Id(v, Pe);

            function Ft() {
                n && ["interactive", "complete"].includes(n.readyState) && v.emit("idleSpanEnableAutoFinish", Pe)
            }
            V && !O && n && (n.addEventListener("readystatechange", () => {
                Ft()
            }), Ft())
        }
        return {
            name: lA,
            setup(v) {
                if (Vg(), D = A0({
                        recordClsStandaloneSpans: c || !1,
                        recordLcpStandaloneSpans: u || !1,
                        client: v
                    }), r && cI(), o && J0(), i && $.PerformanceObserver && PerformanceObserver.supportedEntryTypes && PerformanceObserver.supportedEntryTypes.includes("long-animation-frame") ? M0() : s && x0(), a && N0(), x && n) {
                    const w = () => {
                        ee = he()
                    };
                    addEventListener("click", w, {
                        capture: !0
                    }), addEventListener("keydown", w, {
                        capture: !0,
                        passive: !0
                    })
                }

                function z() {
                    const w = zr(v);
                    w && !F(w).timestamp && (I && g.log(`[Tracing] Finishing current active span with op: ${F(w).op}`), w.setAttribute(Fr, "cancelled"), w.end())
                }
                v.on("startNavigationSpan", (w, V) => {
                    if (C() !== v) return;
                    if (V ?.isRedirect) {
                        I && g.warn("[Tracing] Detected redirect, navigation span will not be the root span, but a child span."), ne(v, {
                            op: "navigation.redirect",
                            ...w
                        }, !1);
                        return
                    }
                    ee = void 0, z(), ke().setPropagationContext({
                        traceId: _t(),
                        sampleRand: Math.random(),
                        propagationSpanId: Ze() ? void 0 : Rt()
                    });
                    const se = j();
                    se.setPropagationContext({
                        traceId: _t(),
                        sampleRand: Math.random(),
                        propagationSpanId: Ze() ? void 0 : Rt()
                    }), se.setSDKProcessingMetadata({
                        normalizedRequest: void 0
                    }), ne(v, {
                        op: "navigation",
                        ...w,
                        parentSpan: null,
                        forceTransaction: !0
                    })
                }), v.on("startPageLoadSpan", (w, V = {}) => {
                    if (C() !== v) return;
                    z();
                    const se = V.sentryTrace || Td("sentry-trace"),
                        re = V.baggage || Td("baggage"),
                        ve = lf(se, re),
                        Pe = j();
                    Pe.setPropagationContext(ve), Ze() || (Pe.getPropagationContext().propagationSpanId = Rt()), Pe.setSDKProcessingMetadata({
                        normalizedRequest: Tc()
                    }), ne(v, {
                        op: "pageload",
                        ...w
                    })
                }), v.on("endPageloadSpan", () => {
                    O && Y && (Y.setAttribute(Fr, "reportPageLoaded"), Y.end())
                })
            },
            afterAllSetup(v) {
                let z = Ln();
                if (B !== "off" && iA(v, {
                        linkPreviousTrace: B,
                        consistentTraceSampling: E
                    }), M.location) {
                    if (A) {
                        const w = Oe();
                        lo(v, {
                            name: M.location.pathname,
                            startTime: w ? w / 1e3 : void 0,
                            attributes: {
                                [ae]: "url",
                                [G]: "auto.pageload.browser"
                            }
                        })
                    }
                    S && ri(({
                        to: w,
                        from: V
                    }) => {
                        if (V === void 0 && z ?.indexOf(w) !== -1) {
                            z = void 0;
                            return
                        }
                        z = void 0;
                        const se = ic(w),
                            re = zr(v),
                            ve = re && x && pA(re, ee);
                        fo(v, {
                            name: se ?.pathname || M.location.pathname,
                            attributes: {
                                [ae]: "url",
                                [G]: "auto.navigation.browser"
                            }
                        }, {
                            url: w,
                            isRedirect: ve
                        })
                    })
                }
                h && rA(), a && fA(v, l, f, p, t), r && dI(), Q1(v, {
                    traceFetch: m,
                    traceXHR: _,
                    trackFetchStreamPerformance: y,
                    tracePropagationTargets: v.getOptions().tracePropagationTargets,
                    shouldCreateSpanForRequest: b,
                    enableHTTPTimings: N,
                    onRequestSpanStart: k,
                    onRequestSpanEnd: P
                })
            }
        }
    });

function lo(e, t, n) {
    e.emit("startPageLoadSpan", t, n), j().setTransactionName(t.name);
    const r = zr(e);
    return r && e.emit("afterStartPageLoadSpan", r), r
}

function fo(e, t, n) {
    const {
        url: r,
        isRedirect: o
    } = n || {};
    e.emit("beforeStartNavigationSpan", t, {
        isRedirect: o
    }), e.emit("startNavigationSpan", t, {
        isRedirect: o
    });
    const s = j();
    return s.setTransactionName(t.name), r && !o && s.setSDKProcessingMetadata({
        normalizedRequest: { ...Tc(),
            url: r
        }
    }), zr(e)
}

function Td(e) {
    return M.document ?.querySelector(`meta[name=${e}]`) ?.getAttribute("content") || void 0
}

function fA(e, t, n, r, o) {
    const s = M.document;
    let i;
    const a = () => {
        const c = "ui.action.click",
            u = zr(e);
        if (u) {
            const d = F(u).op;
            if (["navigation", "pageload"].includes(d)) {
                I && g.warn(`[Tracing] Did not create ${c} span because a pageload or navigation span is in progress.`);
                return
            }
        }
        if (i && (i.setAttribute(Fr, "interactionInterrupted"), i.end(), i = void 0), !o.name) {
            I && g.warn(`[Tracing] Did not create ${c} transaction because _latestRouteName is missing.`);
            return
        }
        i = Tf({
            name: o.name,
            op: c,
            attributes: {
                [ae]: o.source || "url"
            }
        }, {
            idleTimeout: t,
            finalTimeout: n,
            childSpanTimeout: r
        })
    };
    s && addEventListener("click", a, {
        capture: !0
    })
}
const am = "_sentry_idleSpan";

function zr(e) {
    return e[am]
}

function Id(e, t) {
    we(e, am, t)
}
const wd = 1.5;

function pA(e, t) {
    const n = F(e),
        r = Dn(),
        o = n.start_timestamp;
    return !(r - o > wd || t && r - t <= wd)
}

function kM(e = C()) {
    e ?.emit("endPageloadSpan")
}

function RM(e) {
    const t = Ee();
    if (t === e) return;
    const n = j();
    e.end = new Proxy(e.end, {
        apply(r, o, s) {
            return yt(n, t), Reflect.apply(r, o, s)
        }
    }), yt(n, e)
}

function pr(e) {
    return new Promise((t, n) => {
        e.oncomplete = e.onsuccess = () => t(e.result), e.onabort = e.onerror = () => n(e.error)
    })
}

function hA(e, t) {
    const n = indexedDB.open(e);
    n.onupgradeneeded = () => n.result.createObjectStore(t);
    const r = pr(n);
    return o => r.then(s => o(s.transaction(t, "readwrite").objectStore(t)))
}

function Zc(e) {
    return pr(e.getAllKeys())
}

function mA(e, t, n) {
    return e(r => Zc(r).then(o => {
        if (!(o.length >= n)) return r.put(t, Math.max(...o, 0) + 1), pr(r.transaction)
    }))
}

function gA(e, t, n) {
    return e(r => Zc(r).then(o => {
        if (!(o.length >= n)) return r.put(t, Math.min(...o, 0) - 1), pr(r.transaction)
    }))
}

function _A(e) {
    return e(t => Zc(t).then(n => {
        const r = n[0];
        if (r != null) return pr(t.get(r)).then(o => (t.delete(r), pr(t.transaction).then(() => o)))
    }))
}

function yA(e) {
    let t;

    function n() {
        return t == null && (t = hA(e.dbName || "sentry-offline", e.storeName || "queue")), t
    }
    return {
        push: async r => {
            try {
                const o = await cs(r);
                await mA(n(), o, e.maxQueueSize || 30)
            } catch {}
        },
        unshift: async r => {
            try {
                const o = await cs(r);
                await gA(n(), o, e.maxQueueSize || 30)
            } catch {}
        },
        shift: async () => {
            try {
                const r = await _A(n());
                if (r) return o_(r)
            } catch {}
        }
    }
}

function SA(e) {
    return t => {
        const n = e({ ...t,
            createStore: yA
        });
        return M.addEventListener("online", async r => {
            await n.flush()
        }), n
    }
}

function CM(e = Qp) {
    return SA(Ly(e))
}
const kd = 1e6,
    bA = "window" in $ && $.window === $ && typeof importScripts > "u",
    Jt = String(0),
    Ns = bA ? "main" : "worker",
    Os = M.navigator;
let cm = "",
    um = "",
    lm = "",
    La = Os ?.userAgent || "",
    dm = "";
const EA = Os ?.language || Os ?.languages ?.[0] || "";

function vA(e) {
    return typeof e == "object" && e !== null && "getHighEntropyValues" in e
}
const Rd = Os ?.userAgentData;
vA(Rd) && Rd.getHighEntropyValues(["architecture", "model", "platform", "platformVersion", "fullVersionList"]).then(e => {
    if (cm = e.platform || "", lm = e.architecture || "", dm = e.model || "", um = e.platformVersion || "", e.fullVersionList ?.length) {
        const t = e.fullVersionList[e.fullVersionList.length - 1];
        La = `${t.brand} ${t.version}`
    }
}).catch(e => {});

function TA(e) {
    return !("thread_metadata" in e)
}

function IA(e) {
    return TA(e) ? xA(e) : e
}

function wA(e) {
    const t = e.contexts ?.trace ?.trace_id;
    return typeof t == "string" && t.length !== 32 && I && g.log(`[Profiling] Invalid traceId: ${t} on profiled event`), typeof t != "string" ? "" : t
}

function kA(e, t, n, r) {
    if (r.type !== "transaction") throw new TypeError("Profiling events may only be attached to transactions, this should never occur.");
    if (n == null) throw new TypeError(`Cannot construct profiling event envelope without a valid profile. Got ${n} instead.`);
    const o = wA(r),
        s = IA(n),
        i = t || (typeof r.start_timestamp == "number" ? r.start_timestamp * 1e3 : he() * 1e3),
        a = typeof r.timestamp == "number" ? r.timestamp * 1e3 : he() * 1e3;
    return {
        event_id: e,
        timestamp: new Date(i).toISOString(),
        platform: "javascript",
        version: "1",
        release: r.release || "",
        environment: r.environment || $s,
        runtime: {
            name: "javascript",
            version: M.navigator.userAgent
        },
        os: {
            name: cm,
            version: um,
            build_number: La
        },
        device: {
            locale: EA,
            model: dm,
            manufacturer: La,
            architecture: lm,
            is_emulator: !1
        },
        debug_meta: {
            images: pm(n.resources)
        },
        profile: s,
        transactions: [{
            name: r.transaction || "",
            id: r.event_id || Ie(),
            trace_id: o,
            active_thread_id: Jt,
            relative_start_ns: "0",
            relative_end_ns: ((a - i) * 1e6).toFixed(0)
        }]
    }
}

function RA(e, t, n) {
    if (e == null) throw new TypeError(`Cannot construct profiling event envelope without a valid profile. Got ${e} instead.`);
    const r = AA(e),
        o = t.getOptions(),
        s = t.getSdkMetadata ?.() ?.sdk;
    return {
        chunk_id: Ie(),
        client_sdk: {
            name: s ?.name ?? "sentry.javascript.browser",
            version: s ?.version ?? "0.0.0"
        },
        profiler_id: n || Ie(),
        platform: "javascript",
        version: "2",
        release: o.release ?? "",
        environment: o.environment ?? "production",
        debug_meta: {
            images: pm(e.resources)
        },
        profile: r
    }
}

function CA(e) {
    try {
        if (!e || typeof e != "object") return {
            reason: "chunk is not an object"
        };
        const t = r => typeof r == "string" && /^[a-f0-9]{32}$/.test(r);
        if (!t(e.profiler_id)) return {
            reason: "missing or invalid profiler_id"
        };
        if (!t(e.chunk_id)) return {
            reason: "missing or invalid chunk_id"
        };
        if (!e.client_sdk) return {
            reason: "missing client_sdk metadata"
        };
        const n = e.profile;
        return n ? !Array.isArray(n.frames) || !n.frames.length ? {
            reason: "profile has no frames"
        } : !Array.isArray(n.stacks) || !n.stacks.length ? {
            reason: "profile has no stacks"
        } : !Array.isArray(n.samples) || !n.samples.length ? {
            reason: "profile has no samples"
        } : {
            valid: !0
        } : {
            reason: "missing profile data"
        }
    } catch (t) {
        return {
            reason: `unknown validation error: ${t}`
        }
    }
}

function AA(e) {
    const t = [];
    for (let a = 0; a < e.frames.length; a++) {
        const c = e.frames[a];
        c && (t[a] = {
            function: c.name,
            abs_path: typeof c.resourceId == "number" ? e.resources[c.resourceId] : void 0,
            lineno: c.line,
            colno: c.column
        })
    }
    const n = [];
    for (let a = 0; a < e.stacks.length; a++) {
        const c = e.stacks[a];
        if (!c) continue;
        const u = [];
        let d = c;
        for (; d;) u.push(d.frameId), d = d.parentId === void 0 ? void 0 : e.stacks[d.parentId];
        n[a] = u
    }
    const r = Oe(),
        o = typeof performance.timeOrigin == "number" ? performance.timeOrigin : r || 0,
        s = o - (r || o),
        i = [];
    for (let a = 0; a < e.samples.length; a++) {
        const c = e.samples[a];
        if (!c) continue;
        const u = (o + (c.timestamp - s)) / 1e3;
        i[a] = {
            stack_id: c.stackId ?? 0,
            thread_id: Jt,
            timestamp: u
        }
    }
    return {
        frames: t,
        stacks: n,
        samples: i,
        thread_metadata: {
            [Jt]: {
                name: Ns
            }
        }
    }
}

function fm(e) {
    return F(e).op === "pageload"
}

function xA(e) {
    let t, n = 0;
    const r = {
            samples: [],
            stacks: [],
            frames: [],
            thread_metadata: {
                [Jt]: {
                    name: Ns
                }
            }
        },
        o = e.samples[0];
    if (!o) return r;
    const s = o.timestamp,
        i = Oe(),
        a = typeof performance.timeOrigin == "number" ? performance.timeOrigin : i || 0,
        c = a - (i || a);
    return e.samples.forEach((u, d) => {
        if (u.stackId === void 0) {
            t === void 0 && (t = n, r.stacks[t] = [], n++), r.samples[d] = {
                elapsed_since_start_ns: ((u.timestamp + c - s) * kd).toFixed(0),
                stack_id: t,
                thread_id: Jt
            };
            return
        }
        let l = e.stacks[u.stackId];
        const f = [];
        for (; l;) {
            f.push(l.frameId);
            const h = e.frames[l.frameId];
            h && r.frames[l.frameId] === void 0 && (r.frames[l.frameId] = {
                function: h.name,
                abs_path: typeof h.resourceId == "number" ? e.resources[h.resourceId] : void 0,
                lineno: h.line,
                colno: h.column
            }), l = l.parentId === void 0 ? void 0 : e.stacks[l.parentId]
        }
        const p = {
            elapsed_since_start_ns: ((u.timestamp + c - s) * kd).toFixed(0),
            stack_id: n,
            thread_id: Jt
        };
        r.stacks[n] = f, r.samples[d] = p, n++
    }), r
}

function MA(e, t) {
    if (!t.length) return e;
    for (const n of t) e[1].push([{
        type: "profile"
    }, n]);
    return e
}

function NA(e) {
    const t = [];
    return kn(e, (n, r) => {
        if (r === "transaction")
            for (let o = 1; o < n.length; o++) n[o] ?.contexts ?.profile ?.profile_id && t.push(n[o])
    }), t
}

function pm(e) {
    const r = C() ?.getOptions() ?.stackParser;
    return r ? P_(r, e) : []
}

function hm(e) {
    return typeof e != "number" && typeof e != "boolean" || typeof e == "number" && isNaN(e) ? (I && g.warn(`[Profiling] Invalid sample rate. Sample rate must be a boolean or a number between 0 and 1. Got ${JSON.stringify(e)} of type ${JSON.stringify(typeof e)}.`), !1) : e === !0 || e === !1 ? !0 : e < 0 || e > 1 ? (I && g.warn(`[Profiling] Invalid sample rate. Sample rate must be between 0 and 1. Got ${e}.`), !1) : !0
}

function OA(e) {
    return e.samples.length < 2 ? (I && g.log("[Profiling] Discarding profile because it contains less than 2 samples"), !1) : e.frames.length ? !0 : (I && g.log("[Profiling] Discarding profile because it contains no frames"), !1)
}
let eu = !1;
const mm = 3e4;

function PA(e) {
    return typeof e == "function"
}

function gm() {
    const e = M.Profiler;
    if (!PA(e)) {
        I && g.log("[Profiling] Profiling is not supported by this browser, Profiler interface missing on window object.");
        return
    }
    const t = 10,
        n = Math.floor(mm / t);
    try {
        return new e({
            sampleInterval: t,
            maxBufferSize: n
        })
    } catch {
        I && (g.log("[Profiling] Failed to initialize the Profiling constructor, this is likely due to a missing 'Document-Policy': 'js-profiling' header."), g.log("[Profiling] Disabling profiling for current user session.")), eu = !0
    }
}

function Cd(e) {
    if (eu) return I && g.log("[Profiling] Profiling has been disabled for the duration of the current user session."), !1;
    if (!e.isRecording()) return I && g.log("[Profiling] Discarding profile because root span was not sampled."), !1;
    const n = C() ?.getOptions();
    if (!n) return I && g.log("[Profiling] Profiling disabled, no options found."), !1;
    const r = n.profilesSampleRate;
    return hm(r) ? r ? (r === !0 ? !0 : Math.random() < r) ? !0 : (I && g.log(`[Profiling] Discarding profile because it's not included in the random sample (sampling rate = ${Number(r)})`), !1) : (I && g.log("[Profiling] Discarding profile because a negative sampling decision was inherited or profileSampleRate is set to 0"), !1) : (I && g.warn("[Profiling] Discarding profile because of invalid sample rate."), !1)
}

function LA(e) {
    if (eu) return I && g.log("[Profiling] Profiling has been disabled for the duration of the current user session as the JS Profiler could not be started."), !1;
    if (e.profileLifecycle !== "trace" && e.profileLifecycle !== "manual") return I && g.warn("[Profiling] Session not sampled. Invalid `profileLifecycle` option."), !1;
    const t = e.profileSessionSampleRate;
    return hm(t) ? t ? Math.random() <= t : (I && g.log("[Profiling] Discarding profile because profileSessionSampleRate is not defined or set to 0"), !1) : (I && g.warn("[Profiling] Discarding profile because of invalid profileSessionSampleRate."), !1)
}

function Oo(e) {
    return typeof e.profilesSampleRate < "u"
}

function DA(e, t, n, r) {
    return OA(n) ? kA(e, t, n, r) : null
}
const Sn = new Map;

function FA() {
    return Sn.size
}

function $A(e) {
    const t = Sn.get(e);
    return t && Sn.delete(e), t
}

function BA(e, t) {
    if (Sn.set(e, t), Sn.size > 30) {
        const n = Sn.keys().next().value;
        n !== void 0 && Sn.delete(n)
    }
}

function UA(e) {
    return !e ?.contexts ?.profile || !e.contexts || (e.contexts.trace = { ...e.contexts ?.trace ?? {},
        data : { ...e.contexts ?.trace ?.data ?? {},
            "thread.id" : Jt,
            "thread.name" : Ns
        }
    }, e.spans ?.forEach(t => {
        t.data = { ...t.data || {},
            "thread.id": Jt,
            "thread.name": Ns
        }
    })), e
}

function Ad(e) {
    let t;
    fm(e) && (t = he() * 1e3);
    const n = gm();
    if (!n) return;
    I && g.log(`[Profiling] started profiling span: ${F(e).description}`);
    const r = Ie();
    let o = null;
    j().setContext("profile", {
        profile_id: r,
        start_timestamp: t
    });
    async function s() {
        if (e && n) {
            if (o) {
                I && g.log("[Profiling] profile for:", F(e).description, "already exists, returning early");
                return
            }
            return n.stop().then(u => {
                if (i && (M.clearTimeout(i), i = void 0), I && g.log(`[Profiling] stopped profiling of span: ${F(e).description}`), !u) {
                    I && g.log(`[Profiling] profiler returned null profile for: ${F(e).description}`, "this may indicate an overlapping span or a call to stopProfiling with a profile title that was never started");
                    return
                }
                o = u, BA(r, u)
            }).catch(u => {
                I && g.log("[Profiling] error while stopping profiler:", u)
            })
        }
    }
    let i = M.setTimeout(() => {
        I && g.log("[Profiling] max profile duration elapsed, stopping profiling for:", F(e).description), s()
    }, mm);
    const a = e.end.bind(e);

    function c() {
        return e ? (s().then(() => {
            a()
        }, () => {
            a()
        }), e) : a()
    }
    e.end = c
}
const HA = 6e4,
    WA = 3e5;
class jA {
    constructor() {
        this._client = void 0, this._profiler = void 0, this._chunkTimer = void 0, this._profilerId = void 0, this._isRunning = !1, this._sessionSampled = !1, this._lifecycleMode = void 0, this._activeRootSpanIds = new Set, this._rootSpanTimeouts = new Map
    }
    initialize(t) {
        const n = t.getOptions().profileLifecycle,
            r = LA(t.getOptions());
        I && g.log(`[Profiling] Initializing profiler (lifecycle='${n}').`), r || I && g.log("[Profiling] Session not sampled. Skipping lifecycle profiler initialization."), this._profilerId = Ie(), this._client = t, this._sessionSampled = r, this._lifecycleMode = n, n === "trace" && this._setupTraceLifecycleListeners(t)
    }
    start() {
        if (this._lifecycleMode === "trace") {
            I && g.warn('[Profiling] `profileLifecycle` is set to "trace". Calls to `uiProfiler.start()` are ignored in trace mode.');
            return
        }
        if (this._isRunning) {
            I && g.warn("[Profiling] Profile session is already running, `uiProfiler.start()` is a no-op.");
            return
        }
        if (!this._sessionSampled) {
            I && g.warn("[Profiling] Session is not sampled, `uiProfiler.start()` is a no-op.");
            return
        }
        this._beginProfiling()
    }
    stop() {
        if (this._lifecycleMode === "trace") {
            I && g.warn('[Profiling] `profileLifecycle` is set to "trace". Calls to `uiProfiler.stop()` are ignored in trace mode.');
            return
        }
        if (!this._isRunning) {
            I && g.warn("[Profiling] Profiler is not running, `uiProfiler.stop()` is a no-op.");
            return
        }
        this._endProfiling()
    }
    notifyRootSpanActive(t) {
        if (this._lifecycleMode !== "trace" || !this._sessionSampled) return;
        const n = t.spanContext().spanId;
        if (!n || this._activeRootSpanIds.has(n)) return;
        this._registerTraceRootSpan(n);
        const r = this._activeRootSpanIds.size;
        r === 1 && (I && g.log("[Profiling] Detected already active root span during setup. Active root spans now:", r), this._beginProfiling())
    }
    _beginProfiling() {
        if (!this._isRunning) {
            if (this._isRunning = !0, I && g.log("[Profiling] Started profiling with profiler ID:", this._profilerId), Gt().setContext("profile", {
                    profiler_id: this._profilerId
                }), this._startProfilerInstance(), !this._profiler) {
                I && g.log("[Profiling] Failed to start JS Profiler; stopping."), this._resetProfilerInfo();
                return
            }
            this._startPeriodicChunking()
        }
    }
    _endProfiling() {
        this._isRunning && (this._isRunning = !1, this._chunkTimer && (clearTimeout(this._chunkTimer), this._chunkTimer = void 0), this._clearAllRootSpanTimeouts(), this._collectCurrentChunk().catch(t => {
            I && g.error("[Profiling] Failed to collect current profile chunk on `stop()`:", t)
        }), this._lifecycleMode === "manual" && Gt().setContext("profile", {}))
    }
    _setupTraceLifecycleListeners(t) {
        t.on("spanStart", n => {
            if (!this._sessionSampled) {
                I && g.log("[Profiling] Span not profiled because of negative sampling decision for user session.");
                return
            }
            if (n !== Se(n)) return;
            if (!n.isRecording()) {
                I && g.log("[Profiling] Discarding profile because root span was not sampled.");
                return
            }
            const r = n.spanContext().spanId;
            if (!r || this._activeRootSpanIds.has(r)) return;
            this._registerTraceRootSpan(r);
            const o = this._activeRootSpanIds.size;
            o === 1 && (I && g.log(`[Profiling] Root span ${r} started. Profiling active while there are active root spans (count=${o}).`), this._beginProfiling())
        }), t.on("spanEnd", n => {
            if (!this._sessionSampled) return;
            const r = n.spanContext().spanId;
            if (!r || !this._activeRootSpanIds.has(r)) return;
            this._activeRootSpanIds.delete(r);
            const o = this._activeRootSpanIds.size;
            I && g.log(`[Profiling] Root span with ID ${r} ended. Will continue profiling for as long as there are active root spans (currently: ${o}).`), o === 0 && (this._collectCurrentChunk().catch(s => {
                I && g.error("[Profiling] Failed to collect current profile chunk on last `spanEnd`:", s)
            }), this._endProfiling())
        })
    }
    _resetProfilerInfo() {
        this._isRunning = !1, Gt().setContext("profile", {})
    }
    _clearAllRootSpanTimeouts() {
        this._rootSpanTimeouts.forEach(t => clearTimeout(t)), this._rootSpanTimeouts.clear()
    }
    _registerTraceRootSpan(t) {
        this._activeRootSpanIds.add(t);
        const n = setTimeout(() => this._onRootSpanTimeout(t), WA);
        this._rootSpanTimeouts.set(t, n)
    }
    _startProfilerInstance() {
        if (this._profiler ?.stopped === !1) return;
        const t = gm();
        if (!t) {
            I && g.log("[Profiling] Failed to start JS Profiler.");
            return
        }
        this._profiler = t
    }
    _startPeriodicChunking() {
        this._isRunning && (this._chunkTimer = setTimeout(() => {
            if (this._collectCurrentChunk().catch(t => {
                    I && g.error("[Profiling] Failed to collect current profile chunk during periodic chunking:", t)
                }), this._isRunning) {
                if (this._startProfilerInstance(), !this._profiler) {
                    this._resetProfilerInfo();
                    return
                }
                this._startPeriodicChunking()
            }
        }, HA))
    }
    _onRootSpanTimeout(t) {
        this._rootSpanTimeouts.has(t) && (this._rootSpanTimeouts.delete(t), this._activeRootSpanIds.has(t) && (I && g.log(`[Profiling] Reached 5-minute timeout for root span ${t}. You likely started a manual root span that never called \`.end()\`.`), this._activeRootSpanIds.delete(t), this._activeRootSpanIds.size === 0 && this._endProfiling()))
    }
    async _collectCurrentChunk() {
        const t = this._profiler;
        if (this._profiler = void 0, !!t) try {
            const n = await t.stop(),
                r = RA(n, this._client, this._profilerId),
                o = CA(r);
            if ("reason" in o) {
                I && g.log("[Profiling] Discarding invalid profile chunk (this is probably a bug in the SDK):", o.reason);
                return
            }
            this._sendProfileChunk(r), I && g.log("[Profiling] Collected browser profile chunk.")
        } catch (n) {
            I && g.log("[Profiling] Error while stopping JS Profiler for chunk:", n)
        }
    }
    _sendProfileChunk(t) {
        const n = this._client,
            r = Bs(n.getSdkMetadata ?.()),
            o = n.getDsn(),
            s = n.getOptions().tunnel,
            i = lt({
                event_id: Ie(),
                sent_at: new Date().toISOString(),
                ...r && {
                    sdk: r
                },
                ...!!s && o && {
                    dsn: Lt(o)
                }
            }, [
                [{
                    type: "profile_chunk"
                }, t]
            ]);
        n.sendEnvelope(i).then(null, a => {
            I && g.error("Error while sending profile chunk envelope:", a)
        })
    }
}
const zA = "BrowserProfiling",
    qA = (() => ({
        name: zA,
        setup(e) {
            const t = e.getOptions(),
                n = new jA;
            if (!Oo(t) && !t.profileLifecycle && (t.profileLifecycle = "manual"), Oo(t) && !t.profilesSampleRate) {
                I && g.log("[Profiling] Profiling disabled, no profiling options found.");
                return
            }
            const r = Ee(),
                o = r && Se(r);
            if (Oo(t) && t.profileSessionSampleRate !== void 0 && I && g.warn("[Profiling] Both legacy profiling (`profilesSampleRate`) and UI profiling settings are defined. `profileSessionSampleRate` has no effect when legacy profiling is enabled."), Oo(t)) o && fm(o) && Cd(o) && Ad(o), e.on("spanStart", s => {
                s === Se(s) && Cd(s) && Ad(s)
            }), e.on("beforeEnvelope", s => {
                if (!FA()) return;
                const i = NA(s);
                if (!i.length) return;
                const a = [];
                for (const c of i) {
                    const u = c ?.contexts,
                        d = u ?.profile ?.profile_id,
                        l = u ?.profile ?.start_timestamp;
                    if (typeof d != "string") {
                        I && g.log("[Profiling] cannot find profile for a span without a profile context");
                        continue
                    }
                    if (!d) {
                        I && g.log("[Profiling] cannot find profile for a span without a profile context");
                        continue
                    }
                    u ?.profile && delete u.profile;
                    const f = $A(d);
                    if (!f) {
                        I && g.log(`[Profiling] Could not retrieve profile for span: ${d}`);
                        continue
                    }
                    const p = DA(d, l, f, c);
                    p && a.push(p)
                }
                MA(s, a)
            });
            else {
                const s = t.profileLifecycle;
                if (e.on("startUIProfiler", () => n.start()), e.on("stopUIProfiler", () => n.stop()), s === "manual") n.initialize(e);
                else if (s === "trace") {
                    if (!Ze(t)) {
                        I && g.warn("[Profiling] `profileLifecycle` is 'trace' but tracing is disabled. Set a `tracesSampleRate` or `tracesSampler` to enable span tracing.");
                        return
                    }
                    n.initialize(e), o && n.notifyRootSpanActive(o), M.setTimeout(() => {
                        const i = Ee(),
                            a = i && Se(i);
                        a && n.notifyRootSpanActive(a)
                    }, 0)
                }
            }
        },
        processEvent(e) {
            return UA(e)
        }
    })),
    AM = qA,
    xM = () => ({
        name: "LaunchDarkly",
        processEvent(e, t, n) {
            return _r(e)
        }
    });

function MM() {
    return {
        name: "sentry-flag-auditor",
        type: "flag-used",
        synchronous: !0,
        method: (e, t, n) => {
            Rn(e, t.value), Cn(e, t.value)
        }
    }
}
const NM = () => ({
    name: "OpenFeature",
    processEvent(e, t, n) {
        return _r(e)
    }
});
class OM {
    after(t, n) {
        Rn(n.flagKey, n.value), Cn(n.flagKey, n.value)
    }
    error(t, n, r) {
        Rn(t.flagKey, t.defaultValue), Cn(t.flagKey, t.defaultValue)
    }
}
const PM = ({
    featureFlagClientClass: e
}) => ({
    name: "Unleash",
    setupOnce() {
        const t = e.prototype;
        xe(t, "isEnabled", GA)
    },
    processEvent(t, n, r) {
        return _r(t)
    }
});

function GA(e) {
    return function(...t) {
        const n = t[0],
            r = e.apply(this, t);
        return typeof n == "string" && typeof r == "boolean" ? (Rn(n, r), Cn(n, r)) : I && g.error(`[Feature Flags] UnleashClient.isEnabled does not match expected signature. arg0: ${n} (${typeof n}), result: ${r} (${typeof r})`), r
    }
}
const LM = (({
        growthbookClass: e
    }) => nb({
        growthbookClass: e
    })),
    DM = ({
        featureFlagClient: e
    }) => ({
        name: "Statsig",
        setup(t) {
            e.on("gate_evaluation", n => {
                Rn(n.gate.name, n.gate.value), Cn(n.gate.name, n.gate.value)
            })
        },
        processEvent(t, n, r) {
            return _r(t)
        }
    });
async function FM() {
    const e = C();
    if (!e) return "no-client-active";
    if (!e.getDsn()) return "no-dsn-configured";
    try {
        await S_(() => fetch("https://o447951.ingest.sentry.io/api/4509632503087104/envelope/?sentry_version=7&sentry_key=c1dfb07d783ad5325c245c1fd3725390&sentry_client=sentry.javascript.browser%2F1.33.7", {
            body: "{}",
            method: "POST",
            mode: "cors",
            credentials: "omit"
        }))
    } catch {
        return "sentry-unreachable"
    }
}
const VA = "WebWorker",
    $M = ({
        worker: e
    }) => ({
        name: VA,
        setupOnce: () => {
            (Array.isArray(e) ? e : [e]).forEach(t => xd(t))
        },
        addWorker: t => xd(t)
    });

function xd(e) {
    e.addEventListener("message", t => {
        KA(t.data) && (t.stopImmediatePropagation(), t.data._sentryDebugIds && (I && g.log("Sentry debugId web worker message received", t.data), M._sentryDebugIds = { ...t.data._sentryDebugIds,
            ...M._sentryDebugIds
        }), t.data._sentryWorkerError && (I && g.log("Sentry worker rejection message received", t.data._sentryWorkerError), JA(t.data._sentryWorkerError)))
    })
}

function JA(e) {
    const t = C();
    if (!t) return;
    const n = t.getOptions().stackParser,
        r = t.getOptions().attachStacktrace,
        o = e.reason,
        s = Zt(o) ? th(o) : ei(n, o, void 0, r, !0);
    s.level = "error", e.filename && (s.contexts = { ...s.contexts,
        worker: {
            filename: e.filename
        }
    }), Yr(s, {
        originalException: o,
        mechanism: {
            handled: !1,
            type: "auto.browser.web_worker.onunhandledrejection"
        }
    }), I && g.log("Captured worker unhandled rejection", o)
}

function BM({
    self: e
}) {
    e.postMessage({
        _sentryMessage: !0,
        _sentryDebugIds: e._sentryDebugIds ?? void 0
    }), e.addEventListener("unhandledrejection", t => {
        const r = {
            reason: eh(t),
            filename: e.location ?.href
        };
        e.postMessage({
            _sentryMessage: !0,
            _sentryWorkerError: r
        }), I && g.log("[Sentry Worker] Forwarding unhandled rejection to parent", r)
    }), I && g.log("[Sentry Worker] Registered worker with unhandled rejection handling")
}

function KA(e) {
    if (!mt(e) || e._sentryMessage !== !0) return !1;
    const t = "_sentryDebugIds" in e,
        n = "_sentryWorkerError" in e;
    return !(!t && !n || t && !(mt(e._sentryDebugIds) || e._sentryDebugIds === void 0) || n && !mt(e._sentryWorkerError))
}

function UM(e) {
    const t = { ...e
    };
    return Vf(t, "react"), kf("react", {
        version: Re.version
    }), ww(t)
}

function YA(e) {
    const t = e.match(/^([^.]+)/);
    return t !== null && parseInt(t[0]) >= 17
}

function XA(e, t) {
    const n = new WeakSet;

    function r(o, s) {
        if (!n.has(o)) {
            if (o.cause) return n.add(o), r(o.cause, s);
            o.cause = s
        }
    }
    r(e, t)
}

function _m(e, {
    componentStack: t
}, n) {
    if (YA(Re.version) && kt(e) && t) {
        const r = new Error(e.message);
        r.name = `React ErrorBoundary ${e.name}`, r.stack = t, XA(e, r)
    }
    return Ke(r => (r.setContext("react", {
        componentStack: t
    }), _e(e, n)))
}

function HM(e) {
    return (t, n) => {
        const r = !!e,
            o = _m(t, n, {
                mechanism: {
                    handled: r,
                    type: "auto.function.react.error_handler"
                }
            });
        r && e(t, n, o)
    }
}
const ym = "ui.react.render",
    QA = "ui.react.update",
    Sm = "ui.react.mount";
var Ki, Md;

function ZA() {
    if (Md) return Ki;
    Md = 1;
    var e = Bm(),
        t = {
            childContextTypes: !0,
            contextType: !0,
            contextTypes: !0,
            defaultProps: !0,
            displayName: !0,
            getDefaultProps: !0,
            getDerivedStateFromError: !0,
            getDerivedStateFromProps: !0,
            mixins: !0,
            propTypes: !0,
            type: !0
        },
        n = {
            name: !0,
            length: !0,
            prototype: !0,
            caller: !0,
            callee: !0,
            arguments: !0,
            arity: !0
        },
        r = {
            $$typeof: !0,
            render: !0,
            defaultProps: !0,
            displayName: !0,
            propTypes: !0
        },
        o = {
            $$typeof: !0,
            compare: !0,
            defaultProps: !0,
            displayName: !0,
            propTypes: !0,
            type: !0
        },
        s = {};
    s[e.ForwardRef] = r, s[e.Memo] = o;

    function i(h) {
        return e.isMemo(h) ? o : s[h.$$typeof] || t
    }
    var a = Object.defineProperty,
        c = Object.getOwnPropertyNames,
        u = Object.getOwnPropertySymbols,
        d = Object.getOwnPropertyDescriptor,
        l = Object.getPrototypeOf,
        f = Object.prototype;

    function p(h, m, _) {
        if (typeof m != "string") {
            if (f) {
                var y = l(m);
                y && y !== f && p(h, y, _)
            }
            var b = c(m);
            u && (b = b.concat(u(m)));
            for (var N = i(h), T = i(m), L = 0; L < b.length; ++L) {
                var A = b[L];
                if (!n[A] && !(_ && _[A]) && !(T && T[A]) && !(N && N[A])) {
                    var S = d(m, A);
                    try {
                        a(h, A, S)
                    } catch {}
                }
            }
        }
        return h
    }
    return Ki = p, Ki
}
var bm = ZA();
const Em = Um(bm),
    ex = Hm({
        __proto__: null,
        default: Em
    }, [bm]),
    pi = Em || ex,
    tx = "unknown";
class vm extends Re.Component {
    constructor(t) {
        super(t);
        const {
            name: n,
            disabled: r = !1
        } = this.props;
        r || (this._mountSpan = at({
            name: `<${n}>`,
            onlyIfParent: !0,
            op: Sm,
            attributes: {
                [G]: "auto.ui.react.profiler",
                "ui.component_name": n
            }
        }))
    }
    componentDidMount() {
        this._mountSpan && this._mountSpan.end()
    }
    shouldComponentUpdate({
        updateProps: t,
        includeUpdates: n = !0
    }) {
        if (n && this._mountSpan && t !== this.props.updateProps) {
            const r = Object.keys(t).filter(o => t[o] !== this.props.updateProps[o]);
            if (r.length > 0) {
                const o = he();
                this._updateSpan = nr(this._mountSpan, () => at({
                    name: `<${this.props.name}>`,
                    onlyIfParent: !0,
                    op: QA,
                    startTime: o,
                    attributes: {
                        [G]: "auto.ui.react.profiler",
                        "ui.component_name": this.props.name,
                        "ui.react.changed_props": r
                    }
                }))
            }
        }
        return !0
    }
    componentDidUpdate() {
        this._updateSpan && (this._updateSpan.end(), this._updateSpan = void 0)
    }
    componentWillUnmount() {
        const t = he(),
            {
                name: n,
                includeRender: r = !0
            } = this.props;
        if (this._mountSpan && r) {
            const o = F(this._mountSpan).timestamp;
            nr(this._mountSpan, () => {
                const s = at({
                    onlyIfParent: !0,
                    name: `<${n}>`,
                    op: ym,
                    startTime: o,
                    attributes: {
                        [G]: "auto.ui.react.profiler",
                        "ui.component_name": n
                    }
                });
                s && s.end(t)
            })
        }
    }
    render() {
        return this.props.children
    }
}
Object.assign(vm, {
    defaultProps: {
        disabled: !1,
        includeRender: !0,
        includeUpdates: !0
    }
});

function WM(e, t) {
    const n = t ?.name || e.displayName || e.name || tx,
        r = o => Re.createElement(vm, { ...t,
            name: n,
            updateProps: o
        }, Re.createElement(e, { ...o
        }));
    return r.displayName = `profiler(${n})`, pi(r, e), r
}

function jM(e, t = {
    disabled: !1,
    hasRenderSpan: !0
}) {
    const [n] = Re.useState(() => {
        if (!t ?.disabled) return at({
            name: `<${e}>`,
            onlyIfParent: !0,
            op: Sm,
            attributes: {
                [G]: "auto.ui.react.profiler",
                "ui.component_name": e
            }
        })
    });
    Re.useEffect(() => (n && n.end(), () => {
        if (n && t.hasRenderSpan) {
            const r = F(n).timestamp,
                o = he(),
                s = at({
                    name: `<${e}>`,
                    onlyIfParent: !0,
                    op: ym,
                    startTime: r,
                    attributes: {
                        [G]: "auto.ui.react.profiler",
                        "ui.component_name": e
                    }
                });
            s && s.end(o)
        }
    }), [])
}
const Ne = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__,
    nx = "unknown",
    Yi = {
        componentStack: null,
        error: null,
        eventId: null
    };
class rx extends Re.Component {
    constructor(t) {
        super(t), this.state = Yi, this._openFallbackReportDialog = !0;
        const n = C();
        n && t.showDialog && (this._openFallbackReportDialog = !1, this._cleanupHook = n.on("afterSendEvent", r => {
            !r.type && this._lastEventId && r.event_id === this._lastEventId && Fl({ ...t.dialogOptions,
                eventId: this._lastEventId
            })
        }))
    }
    componentDidCatch(t, n) {
        const {
            componentStack: r
        } = n, {
            beforeCapture: o,
            onError: s,
            showDialog: i,
            dialogOptions: a
        } = this.props;
        Ke(c => {
            o && o(c, t, r);
            const u = this.props.handled != null ? this.props.handled : !!this.props.fallback,
                d = _m(t, n, {
                    mechanism: {
                        handled: u,
                        type: "auto.function.react.error_boundary"
                    }
                });
            s && s(t, r, d), i && (this._lastEventId = d, this._openFallbackReportDialog && Fl({ ...a,
                eventId: d
            })), this.setState({
                error: t,
                componentStack: r,
                eventId: d
            })
        })
    }
    componentDidMount() {
        const {
            onMount: t
        } = this.props;
        t && t()
    }
    componentWillUnmount() {
        const {
            error: t,
            componentStack: n,
            eventId: r
        } = this.state, {
            onUnmount: o
        } = this.props;
        o && (this.state === Yi ? o(null, null, null) : o(t, n, r)), this._cleanupHook && (this._cleanupHook(), this._cleanupHook = void 0)
    }
    resetErrorBoundary() {
        const {
            onReset: t
        } = this.props, {
            error: n,
            componentStack: r,
            eventId: o
        } = this.state;
        t && t(n, r, o), this.setState(Yi)
    }
    render() {
        const {
            fallback: t,
            children: n
        } = this.props, r = this.state;
        if (r.componentStack === null) return typeof n == "function" ? n() : n;
        const o = typeof t == "function" ? Re.createElement(t, {
            error: r.error,
            componentStack: r.componentStack,
            resetError: () => this.resetErrorBoundary(),
            eventId: r.eventId
        }) : t;
        return Re.isValidElement(o) ? o : (t && Ne && g.warn("fallback did not produce a valid ReactElement"), null)
    }
}

function zM(e, t) {
    const n = e.displayName || e.name || nx,
        r = Re.memo(o => Re.createElement(rx, { ...t
        }, Re.createElement(e, { ...o
        })));
    return r.displayName = `errorBoundary(${n})`, pi(r, e), r
}
const ox = "redux.action",
    sx = "info",
    ix = {
        attachReduxState: !0,
        actionTransformer: e => e,
        stateTransformer: e => e || null
    };

function qM(e) {
    const t = { ...ix,
        ...e
    };
    return n => (r, o) => {
        t.attachReduxState && Gt().addEventProcessor((a, c) => {
            try {
                a.type === void 0 && a.contexts.state.state.type === "redux" && (c.attachments = [...c.attachments || [], {
                    filename: "redux_state.json",
                    data: JSON.stringify(a.contexts.state.state.value)
                }])
            } catch {}
            return a
        });

        function s(a) {
            return (c, u) => {
                const d = a(c, u),
                    l = j(),
                    f = t.actionTransformer(u);
                typeof f < "u" && f !== null && bt({
                    category: ox,
                    data: f,
                    type: sx
                });
                const p = t.stateTransformer(d);
                if (typeof p < "u" && p !== null) {
                    const y = C() ?.getOptions() ?.normalizeDepth || 3,
                        b = {
                            state: {
                                type: "redux",
                                value: p
                            }
                        };
                    we(b, "__sentry_override_normalization_depth__", 3 + y), l.setContext("state", b)
                } else l.setContext("state", null);
                const {
                    configureScopeWithState: h
                } = t;
                return typeof h == "function" && h(l, d), d
            }
        }
        const i = n(s(r), o);
        return i.replaceReducer = new Proxy(i.replaceReducer, {
            apply: function(a, c, u) {
                a.apply(c, [s(u[0])])
            }
        }), i
    }
}

function GM(e) {
    const t = uo({ ...e,
            instrumentPageLoad: !1,
            instrumentNavigation: !1
        }),
        {
            history: n,
            routes: r,
            match: o,
            instrumentPageLoad: s = !0,
            instrumentNavigation: i = !0
        } = e;
    return { ...t,
        afterAllSetup(a) {
            t.afterAllSetup(a), s && M.location && Nd(r, M.location, o, (c, u = "url") => {
                lo(a, {
                    name: c,
                    attributes: {
                        [pe]: "pageload",
                        [G]: "auto.pageload.react.reactrouter_v3",
                        [ae]: u
                    }
                })
            }), i && n.listen && n.listen(c => {
                (c.action === "PUSH" || c.action === "POP") && Nd(r, c, o, (u, d = "url") => {
                    fo(a, {
                        name: u,
                        attributes: {
                            [pe]: "navigation",
                            [G]: "auto.navigation.react.reactrouter_v3",
                            [ae]: d
                        }
                    })
                })
            })
        }
    }
}

function Nd(e, t, n, r) {
    let o = t.pathname;
    n({
        location: t,
        routes: e
    }, (s, i, a) => {
        if (s || !a) return r(o);
        const c = ax(a.routes || []);
        return c.length === 0 || c === "/*" ? r(o) : (o = c, r(o, "route"))
    })
}

function ax(e) {
    if (!Array.isArray(e) || e.length === 0) return "";
    const t = e.filter(r => !!r.path);
    let n = -1;
    for (let r = t.length - 1; r >= 0; r--)
        if (t[r].path ?.startsWith("/")) {
            n = r;
            break
        }
    return t.slice(n).reduce((r, {
        path: o
    }) => {
        const s = r === "/" || r === "" ? o : `/${o}`;
        return `${r}${s}`
    }, "")
}

function VM(e, t = {}) {
    const n = e,
        r = uo({ ...t,
            instrumentNavigation: !1,
            instrumentPageLoad: !1
        }),
        {
            instrumentPageLoad: o = !0,
            instrumentNavigation: s = !0
        } = t;
    return { ...r,
        afterAllSetup(i) {
            r.afterAllSetup(i);
            const a = M.location;
            if (o && a) {
                const c = n.matchRoutes(a.pathname, n.options.parseSearch(a.search), {
                        preload: !1,
                        throwOnError: !1
                    }),
                    u = c[c.length - 1];
                lo(i, {
                    name: u ? u.routeId : a.pathname,
                    attributes: {
                        [pe]: "pageload",
                        [G]: "auto.pageload.react.tanstack_router",
                        [ae]: u ? "route" : "url",
                        ...Od(u)
                    }
                })
            }
            s && n.subscribe("onBeforeNavigate", c => {
                if (!c.fromLocation || c.toLocation.state === c.fromLocation.state) return;
                const u = n.matchRoutes(c.toLocation.pathname, c.toLocation.search, {
                        preload: !1,
                        throwOnError: !1
                    }),
                    d = u[u.length - 1],
                    l = M.location,
                    f = fo(i, {
                        name: d ? d.routeId : l.pathname,
                        attributes: {
                            [pe]: "navigation",
                            [G]: "auto.navigation.react.tanstack_router",
                            [ae]: d ? "route" : "url"
                        }
                    }),
                    p = n.subscribe("onResolved", h => {
                        if (p(), f) {
                            const m = n.matchRoutes(h.toLocation.pathname, h.toLocation.search, {
                                    preload: !1,
                                    throwOnError: !1
                                }),
                                _ = m[m.length - 1];
                            _ && (f.updateName(_.routeId), f.setAttribute(ae, "route"), f.setAttributes(Od(_)))
                        }
                    })
            })
        }
    }
}

function Od(e) {
    if (!e) return {};
    const t = {};
    return Object.entries(e.params).forEach(([n, r]) => {
        t[`url.path.params.${n}`] = r, t[`url.path.parameter.${n}`] = r, t[`params.${n}`] = r
    }), t
}

function JM(e) {
    const t = uo({ ...e,
            instrumentPageLoad: !1,
            instrumentNavigation: !1
        }),
        {
            history: n,
            routes: r,
            matchPath: o,
            instrumentPageLoad: s = !0,
            instrumentNavigation: i = !0
        } = e;
    return { ...t,
        afterAllSetup(a) {
            t.afterAllSetup(a), Tm(a, s, i, n, "reactrouter_v4", r, o)
        }
    }
}

function KM(e) {
    const t = uo({ ...e,
            instrumentPageLoad: !1,
            instrumentNavigation: !1
        }),
        {
            history: n,
            routes: r,
            matchPath: o,
            instrumentPageLoad: s = !0,
            instrumentNavigation: i = !0
        } = e;
    return { ...t,
        afterAllSetup(a) {
            t.afterAllSetup(a), Tm(a, s, i, n, "reactrouter_v5", r, o)
        }
    }
}

function Tm(e, t, n, r, o, s = [], i) {
    function a() {
        if (r.location) return r.location.pathname;
        if (M.location) return M.location.pathname
    }

    function c(u) {
        if (s.length === 0 || !i) return [u, "url"];
        const d = Im(s, u, i);
        for (const l of d)
            if (l.match.isExact) return [l.match.path, "route"];
        return [u, "url"]
    }
    if (t) {
        const u = a();
        if (u) {
            const [d, l] = c(u);
            lo(e, {
                name: d,
                attributes: {
                    [pe]: "pageload",
                    [G]: `auto.pageload.react.${o}`,
                    [ae]: l
                }
            })
        }
    }
    n && r.listen && r.listen((u, d) => {
        if (d && (d === "PUSH" || d === "POP")) {
            const [l, f] = c(u.pathname);
            fo(e, {
                name: l,
                attributes: {
                    [pe]: "navigation",
                    [G]: `auto.navigation.react.${o}`,
                    [ae]: f
                }
            })
        }
    })
}

function Im(e, t, n, r = []) {
    return e.some(o => {
        const s = o.path ? n(t, o) : r.length ? r[r.length - 1].match : cx(t);
        return s && (r.push({
            route: o,
            match: s
        }), o.routes && Im(o.routes, t, n, r)), !!s
    }), r
}

function cx(e) {
    return {
        path: "/",
        url: "/",
        params: {},
        isExact: e === "/"
    }
}

function YM(e) {
    const t = e.displayName || e.name,
        n = r => {
            if (r ?.computedMatch ?.isExact) {
                const o = r.computedMatch.path,
                    s = ux();
                j().setTransactionName(o), s && (s.updateName(o), s.setAttribute(ae, "route"))
            }
            return Re.createElement(e, { ...r
            })
        };
    return n.displayName = `sentryRoute(${t})`, pi(n, e), n
}

function ux() {
    const e = Ee(),
        t = e && Se(e);
    if (!t) return;
    const n = F(t).op;
    return n === "navigation" || n === "pageload" ? t : void 0
}
let tu, Xn = !1;
const Kt = [],
    lx = 10;

function dx(e, t) {
    const n = {};
    return Kt.length >= lx && (Ne && g.warn("[React Router] Navigation context stack overflow - removing oldest context"), Kt.shift()), Kt.push({
        token: n,
        targetPath: e,
        span: t
    }), n
}

function fx(e) {
    Kt[Kt.length - 1] ?.token === e && Kt.pop()
}

function wm() {
    const e = Kt.length;
    return e > 0 ? Kt[e - 1] ?? null : null
}

function px(e, t = !1) {
    tu = e, Xn = t
}

function hx(e) {
    return gx(e.route.path || "")
}

function mx(e) {
    return e.params["*"] || ""
}

function gx(e) {
    return e[e.length - 1] === "*" ? e.slice(0, -1) : e
}

function Qn(e) {
    return e[e.length - 1] === "/" ? e.slice(0, -1) : e
}

function km(e) {
    return e.endsWith("*")
}

function rn(e) {
    return e.includes("/*") || e.endsWith("*")
}

function Pd(e, t) {
    return km(e) && !!t.route.children ?.length || !1
}

function _x(e) {
    return !!(!e.children && e.element && e.path ?.endsWith("/*"))
}

function yx(e, t, n) {
    const r = e && e.length > 0 ? e : Xn ? hi(t, n) : t;
    let o = r.slice(-2) === "/*" ? r.slice(0, -2) : r;
    return o.length > 1 && o[o.length - 1] === "/" && (o = o.slice(0, -1)), [o, "route"]
}

function Ld(e) {
    return e.split(/\\?\//).filter(t => t.length > 0 && t !== ",").length
}

function hi(e, t) {
    if (!t || t === "/" || !e.toLowerCase().startsWith(t.toLowerCase())) return e;
    const n = t.endsWith("/") ? t.length - 1 : t.length,
        r = e.charAt(n);
    return r && r !== "/" ? e : e.slice(n) || "/"
}

function Ps(e) {
    return e[0] === "/" ? e : `/${e}`
}

function Rm(e, t) {
    const n = tu(e, t);
    if (!n || n.length === 0) return "";
    for (const r of n)
        if (r.route.path && r.route.path !== "*") {
            const o = hx(r),
                s = hi(t.pathname, Ps(r.pathnameBase));
            return t.pathname === s ? Qn(s) : Qn(Qn(o || "") + Ps(Rm(e.filter(i => i !== r.route), {
                pathname: s
            })))
        }
    return ""
}

function Sx(e, t) {
    const n = tu(t, e);
    if (n) {
        for (const r of n)
            if (_x(r.route) && mx(r)) return !0
    }
    return !1
}

function Dd(e, t) {
    return Xn ? hi(e.pathname, t) : e.pathname || ""
}

function bx(e, t, n, r = "") {
    if (!e || e.length === 0) return [Xn ? hi(t.pathname, r) : t.pathname, "url"];
    if (!n) return [Dd(t, r), "url"];
    let o = "";
    for (const s of n) {
        const i = s.route;
        if (!i) continue;
        if (i.index) return yx(o, s.pathname, r);
        const a = i.path;
        if (!a || Pd(a, s)) continue;
        const c = a[0] === "/" || o[o.length - 1] === "/" ? a : `/${a}`;
        if (o = Qn(o) + Ps(c), Qn(t.pathname) === Qn(r + s.pathname)) return Ld(o) !== Ld(s.pathname) && !km(o) ? [(Xn ? "" : r) + c, "route"] : (Pd(o, s) && (o = o.slice(0, -1)), [(Xn ? "" : r) + o, "route"])
    }
    return [Dd(t, r), "url"]
}

function mi(e, t, n, r, o = "") {
    let s, i = "url";
    const a = Sx(e, n);
    return a && (s = Ps(Rm(n, e)), i = "route"), (!a || !s) && ([s, i] = bx(t, e, r, o)), [s || e.pathname, i]
}

function ct() {
    const e = Ee(),
        t = e ? Se(e) : void 0;
    if (!t) return;
    const n = F(t).op;
    return n === "navigation" || n === "pageload" ? t : void 0
}

function Ex() {
    const e = wm();
    if (e ?.targetPath) return {
        pathname: e.targetPath,
        search: "",
        hash: "",
        state: null,
        key: "default"
    };
    if (typeof M < "u") try {
        const t = M.location;
        if (t) return {
            pathname: t.pathname,
            search: t.search || "",
            hash: t.hash || "",
            state: null,
            key: "default"
        }
    } catch {
        Ne && g.warn("[React Router] Could not access window.location")
    }
    return null
}

function vx() {
    const e = wm();
    return e ? e.span : ct()
}

function Tx(e, t, n, r) {
    const o = new Proxy(e, {
        apply(s, i, a) {
            const c = Ex(),
                u = vx(),
                d = s.apply(i, a);
            return Ix(d, t, n, r, c, u), d
        }
    });
    return we(o, "__sentry_proxied__", !0), o
}

function Ix(e, t, n, r, o, s) {
    Pn(e) ? e.then(i => {
        Array.isArray(i) && r(i, t, o ?? void 0, s)
    }).catch(i => {
        Ne && g.warn(`Error resolving async handler '${n}' for route`, t, i)
    }) : Array.isArray(e) && r(e, t, o ?? void 0, s)
}

function gi(e, t) {
    if (e.handle && typeof e.handle == "object")
        for (const n of Object.keys(e.handle)) {
            const r = e.handle[n];
            typeof r == "function" && !r.__sentry_proxied__ && (e.handle[n] = Tx(r, e, n, t))
        }
    if (Array.isArray(e.children))
        for (const n of e.children) gi(n, t)
}
let Yt, Xt, Qt, es, tt, _i = !1,
    bn = 3e3;
const Cm = new WeakSet,
    gn = new WeakMap,
    $e = new Set,
    ts = new WeakMap;

function wx(e) {
    return M ?.requestAnimationFrame ? M.requestAnimationFrame(e) : setTimeout(e, 0)
}

function Fd(e) {
    M ?.cancelAnimationFrame ? M.cancelAnimationFrame(e) : clearTimeout(e)
}

function Am(e) {
    return `${e.pathname}${e.search||""}${e.hash||""}`
}

function $d(e) {
    return e.includes(":") || e.includes("*")
}

function kx(e, t, n, r) {
    if (!e) return {
        skip: !1,
        shouldUpdate: !1
    };
    if (e.locationKey === t && (e.isPlaceholder || !r)) {
        const s = !!e.routeName && rn(e.routeName),
            i = rn(n),
            a = !!e.routeName && $d(e.routeName),
            c = $d(n),
            u = s && !i,
            d = !a && c,
            l = n !== e.routeName && n.length > (e.routeName ?.length || 0) && !i;
        return {
            skip: !0,
            shouldUpdate: !!(e.routeName && (u || d || l))
        }
    }
    return {
        skip: !1,
        shouldUpdate: !1
    }
}

function Rx(e, t) {
    const n = t.children || [],
        r = e.filter(o => !n.some(s => s === o || o.path && s.path === o.path || o.id && s.id === o.id));
    r.length > 0 && (t.children = [...n, ...r])
}

function Cx(e, t) {
    let n = ts.get(e);
    n || (n = new Set, ts.set(e, n)), n.add(t), t.finally(() => {
        const r = ts.get(e);
        r && r.delete(t)
    })
}

function nu(e, t, n = null, r) {
    e.forEach(s => {
        $e.add(s), _i && gi(s, nu)
    }), t && Rx(e, t);
    const o = r ?? ct();
    if (o) {
        const s = F(o);
        if (s.timestamp) {
            Ne && g.warn("[React Router] Lazy handler resolved after span ended - skipping update");
            return
        }
        const i = s.op;
        let a = n;
        if (!a && !r && typeof M < "u") {
            const c = M.location;
            c ?.pathname && (a = {
                pathname: c.pathname
            })
        }
        a && (i === "pageload" ? ho({
            activeRootSpan: o,
            location: {
                pathname: a.pathname
            },
            routes: Array.from($e),
            allRoutes: Array.from($e)
        }) : i === "navigation" && Da(o, a, Array.from($e), !1, tt))
    }
}

function Da(e, t, n, r = !1, o) {
    const s = F(e),
        i = s.description,
        a = e ?.__sentry_navigation_name_set__,
        c = i && rn(i);
    if ((!a || r || c) && !s.timestamp) {
        const d = o(n, t),
            [l, f] = mi(t, n, n, d || [], ""),
            p = s.data ?.[ae];
        l && (!i || !a && (p !== "route" || f === "route") || p !== "route" && f === "route" || p === "route" && f === "route" && c) && (e.updateName(l), e.setAttribute(ae, f), !rn(l) && f === "route" && we(e, "__sentry_navigation_name_set__", !0))
    }
}

function xm(e, t, n, r, o) {
    let s = !1,
        i = !!o && F(o).op === "pageload",
        a = !1,
        c = null,
        u = null;
    e.subscribe(d => {
        if (!s) {
            const f = ct();
            f && F(f).op === "pageload" ? i = !0 : i && (d.historyAction === "POP" && !a ? a = !0 : s = !0)
        }
        if (d.historyAction === "PUSH" || d.historyAction === "POP" && s) {
            const f = Am(d.location),
                p = () => {
                    u !== f && (u = f, c = null, ru({
                        location: d.location,
                        routes: t,
                        navigationType: d.historyAction,
                        version: n,
                        basename: r,
                        allRoutes: Array.from($e)
                    }))
                };
            d.navigation.state !== "idle" ? (u !== f && (u = null), c !== null && Fd(c), c = wx(p)) : (c !== null && (Fd(c), c = null), p())
        }
    })
}

function Mm(e, t) {
    return !Yt || !Xt || !Qt || !tt ? (Ne && g.warn(`reactRouterV${t}Instrumentation was unable to wrap the \`createRouter\` function because of one or more missing parameters.`), e) : function(n, r) {
        if (po(n), _i)
            for (const c of n) gi(c, nu);
        const o = Lm(r),
            s = e(n, o),
            i = r ?.basename,
            a = ct();
        return s.state.historyAction === "POP" && a && ho({
            activeRootSpan: a,
            location: s.state.location,
            routes: n,
            basename: i,
            allRoutes: Array.from($e)
        }), xm(s, n, t, i, a), s
    }
}

function Nm(e, t) {
    return !Yt || !Xt || !Qt || !tt ? (Ne && g.warn(`reactRouterV${t}Instrumentation was unable to wrap the \`createMemoryRouter\` function because of one or more missing parameters.`), e) : function(n, r) {
        if (po(n), _i)
            for (const h of n) gi(h, nu);
        const o = Lm(r, !0),
            s = e(n, o),
            i = r ?.basename;
        let a;
        const c = r ?.initialEntries,
            u = r ?.initialIndex,
            d = c && c.length === 1,
            l = u !== void 0 && c && c[u];
        a = d ? c[0] : l ? c[u] : void 0;
        const f = a ? typeof a == "string" ? {
                pathname: a
            } : a : s.state.location,
            p = ct();
        return s.state.historyAction === "POP" && p && ho({
            activeRootSpan: p,
            location: f,
            routes: n,
            basename: i,
            allRoutes: Array.from($e)
        }), xm(s, n, t, i, p), s
    }
}

function Om(e, t) {
    const n = uo({ ...e,
            instrumentPageLoad: !1,
            instrumentNavigation: !1
        }),
        {
            useEffect: r,
            useLocation: o,
            useNavigationType: s,
            createRoutesFromChildren: i,
            matchRoutes: a,
            stripBasename: c,
            enableAsyncRouteHandlers: u = !1,
            instrumentPageLoad: d = !0,
            instrumentNavigation: l = !0,
            lazyRouteTimeout: f
        } = e;
    return { ...n,
        setup(p) {
            n.setup(p);
            const h = e.finalTimeout ?? 3e4,
                m = (e.idleTimeout ?? 1e3) * 3,
                _ = f ?? m;
            _ === 1 / 0 ? (bn = h, Ne && g.log("[React Router] lazyRouteTimeout set to Infinity, capping at finalTimeout:", h, "ms to prevent indefinite hangs")) : Number.isNaN(_) ? (Ne && g.warn("[React Router] lazyRouteTimeout must be a number, falling back to default:", m), bn = m) : _ < 0 ? (Ne && g.warn("[React Router] lazyRouteTimeout must be non-negative or Infinity, got:", _, "falling back to:", m), bn = m) : bn = _, Yt = r, Xt = o, Qt = s, tt = a, es = i, _i = u, px(a, c || !1)
        },
        afterAllSetup(p) {
            n.afterAllSetup(p);
            const h = M.location ?.pathname;
            d && h && lo(p, {
                name: h,
                attributes: {
                    [ae]: "url",
                    [pe]: "pageload",
                    [G]: `auto.pageload.react.reactrouter_v${t}`
                }
            }), l && Cm.add(p)
        }
    }
}

function Pm(e, t) {
    if (!Yt || !Xt || !Qt || !tt) return Ne && g.warn("reactRouterV6Instrumentation was unable to wrap `useRoutes` because of one or more missing parameters."), e;
    const n = r => {
        const o = Re.useRef(!0),
            {
                routes: s,
                locationArg: i
            } = r,
            a = e(s, i),
            c = Xt(),
            u = Qt(),
            d = typeof i == "string" || i ?.pathname ? i : c;
        return Yt(() => {
            const l = typeof d == "string" ? {
                pathname: d
            } : d;
            o.current ? (po(s), ho({
                activeRootSpan: ct(),
                location: l,
                routes: s,
                allRoutes: Array.from($e)
            }), o.current = !1) : ru({
                location: l,
                routes: s,
                navigationType: u,
                version: t,
                allRoutes: Array.from($e)
            })
        }, [u, d]), a
    };
    return (r, o) => Re.createElement(n, {
        routes: r,
        locationArg: o
    })
}

function Lm(e, t = !1) {
    if (!e || !("patchRoutesOnNavigation" in e) || typeof e.patchRoutesOnNavigation != "function") return e || {};
    const n = e.patchRoutesOnNavigation;
    return { ...e,
        patchRoutesOnNavigation: async r => {
            const o = r ?.path,
                s = ct();
            if (!t) {
                const a = r ?.patch;
                a && (r.patch = (c, u) => {
                    po(u);
                    const d = ct();
                    return o && d && F(d).op === "navigation" && Da(d, {
                        pathname: o,
                        search: "",
                        hash: "",
                        state: null,
                        key: "default"
                    }, Array.from($e), !0, tt), a(c, u)
                })
            }
            const i = (async () => {
                const a = dx(o, s);
                let c;
                try {
                    c = await n(r)
                } finally {
                    fx(a)
                }
                const u = ct();
                if (u && F(u).op === "navigation") {
                    const d = t ? o : o || M.location ?.pathname;
                    d && Da(u, {
                        pathname: d,
                        search: "",
                        hash: "",
                        state: null,
                        key: "default"
                    }, Array.from($e), !1, tt)
                }
                return c
            })();
            return s && Cx(s, i), i
        }
    }
}

function ru(e) {
    const {
        location: t,
        routes: n,
        navigationType: r,
        version: o,
        matches: s,
        basename: i,
        allRoutes: a
    } = e, c = Array.isArray(s) ? s : tt(a || n, t, i), u = C();
    if (!u || !Cm.has(u)) return;
    const d = ct();
    if (!(d && F(d).op === "pageload" && r === "POP") && (r === "PUSH" || r === "POP") && c) {
        const [l, f] = mi(t, a || n, a || n, c, i), p = Am(t), h = gn.get(u), m = h && !h.isPlaceholder ? !!F(h.span).timestamp : !1, {
            skip: _,
            shouldUpdate: y
        } = kx(h, p, l, m);
        if (_) {
            if (y && h) {
                const L = h.routeName;
                h.isPlaceholder ? (h.routeName = l, Ne && g.log(`[Tracing] Updated placeholder navigation name from "${L}" to "${l}" (will apply to real span)`)) : (h.span.updateName(l), h.span.setAttribute(ae, f), we(h.span, "__sentry_navigation_name_set__", !0), h.routeName = l, Ne && g.log(`[Tracing] Updated navigation span name from "${L}" to "${l}"`))
            } else Ne && g.log(`[Tracing] Skipping duplicate navigation for location: ${p}`);
            return
        }
        const N = {
            span: {
                end: () => {}
            },
            routeName: l,
            pathname: t.pathname,
            locationKey: p,
            isPlaceholder: !0
        };
        gn.set(u, N);
        let T;
        try {
            T = fo(u, {
                name: N.routeName,
                attributes: {
                    [ae]: f,
                    [pe]: "navigation",
                    [G]: `auto.navigation.react.reactrouter_v${o}`
                }
            })
        } catch (L) {
            throw gn.delete(u), L
        }
        T ? (gn.set(u, {
            span: T,
            routeName: N.routeName,
            pathname: t.pathname,
            locationKey: p
        }), Fm(T, t, n, i, a, "navigation")) : gn.delete(u)
    }
}

function po(e) {
    e.forEach(t => {
        Dm(t).forEach(r => {
            $e.add(r)
        })
    })
}

function Dm(e, t = new Set) {
    return t.has(e) || (t.add(e), e.children && !e.index && e.children.forEach(n => {
        Dm(n, t).forEach(o => {
            t.add(o)
        })
    })), t
}

function ho({
    activeRootSpan: e,
    location: t,
    routes: n,
    matches: r,
    basename: o,
    allRoutes: s
}) {
    const i = Array.isArray(r) ? r : tt(s || n, t, o);
    if (i) {
        const [a, c] = mi(t, s || n, s || n, i, o);
        j().setTransactionName(a || "/"), e && (e.updateName(a), e.setAttribute(ae, c), Fm(e, t, n, o, s, "pageload"))
    }
}

function Ax(e, t, n, r, o = !1) {
    return n ? !!(!e && o || e && rn(e) && r === "route" && !rn(n) || t !== "route" && r === "route") : !1
}

function Xi(e, t, n, r, o, s, i, a) {
    try {
        const c = t.data ?.[ae];
        if (c === "route" && n && !rn(n)) return;
        const u = Array.from(a),
            d = u.length > 0 ? u : o,
            l = tt(d, r, s);
        if (!l) return;
        const [f, p] = mi(r, d, d, l, s), h = Ax(n, c, f, p, !0), m = i === "pageload" || !t.timestamp;
        h && m && (e.updateName(f), e.setAttribute(ae, p))
    } catch (c) {
        Ne && g.warn(`Error updating span details before ending: ${c}`)
    }
}

function Fm(e, t, n, r, o, s) {
    const i = `__sentry_${s}_end_patched__`;
    if (e ?.[i] || !e.end) return;
    const c = o ? new Set(o) : $e,
        u = e.end.bind(e);
    let d = !1;
    e.end = function(...f) {
        if (d) return;
        d = !0;
        const p = f.length > 0 ? f[0] : Date.now() / 1e3,
            h = F(e),
            m = h.description,
            _ = h.data ?.[ae],
            y = () => {
                const T = C();
                if (T && s === "navigation") {
                    const L = gn.get(T);
                    L && L.span === e && gn.delete(T)
                }
            },
            b = ts.get(e);
        if (b && b.size > 0 && m && (rn(m) || _ !== "route")) {
            if (bn === 0) {
                Xi(e, h, m, t, n, r, s, c), y(), u(p);
                return
            }
            const T = Promise.allSettled(b).then(() => {});
            (bn === 1 / 0 ? T : Promise.race([T, new Promise(A => setTimeout(A, bn))])).then(() => {
                const A = F(e);
                Xi(e, A, A.description, t, n, r, s, c), y(), u(p)
            }).catch(() => {
                y(), u(p)
            });
            return
        }
        Xi(e, h, m, t, n, r, s, c), y(), u(p)
    }, we(e, i, !0)
}

function $m(e, t) {
    if (!Yt || !Xt || !Qt || !es || !tt) return Ne && g.warn(`reactRouterV6Instrumentation was unable to wrap Routes because of one or more missing parameters.
      useEffect: ${Yt}. useLocation: ${Xt}. useNavigationType: ${Qt}.
      createRoutesFromChildren: ${es}. matchRoutes: ${tt}.`), e;
    const n = r => {
        const o = Re.useRef(!0),
            s = Xt(),
            i = Qt();
        return Yt(() => {
            const a = es(r.children);
            o.current ? (po(a), ho({
                activeRootSpan: ct(),
                location: s,
                routes: a,
                allRoutes: Array.from($e)
            }), o.current = !1) : ru({
                location: s,
                routes: a,
                navigationType: i,
                version: t,
                allRoutes: Array.from($e)
            })
        }, [s, i]), Re.createElement(e, { ...r
        })
    };
    return pi(n, e), n
}

function XM(e) {
    return Om(e, "6")
}

function QM(e) {
    return Pm(e, "6")
}

function ZM(e) {
    return Mm(e, "6")
}

function eN(e) {
    return Nm(e, "6")
}

function tN(e) {
    return $m(e, "6")
}

function nN(e) {
    return Om(e, "7")
}

function rN(e) {
    return $m(e, "7")
}

function oN(e) {
    return Mm(e, "7")
}

function sN(e) {
    return Nm(e, "7")
}

function iN(e) {
    return Pm(e, "7")
}
export {
    JT as BrowserClient, rx as ErrorBoundary, Ci as MULTIPLEXED_TRANSPORT_EXTRA_KEY, OM as OpenFeatureIntegrationHook, vm as Profiler, qt as SDK_VERSION, pe as SEMANTIC_ATTRIBUTE_SENTRY_OP, G as SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, ja as SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE, ae as SEMANTIC_ATTRIBUTE_SENTRY_SOURCE, St as Scope, M as WINDOW, bt as addBreadcrumb, J_ as addEventProcessor, Ou as addIntegration, HI as breadcrumbsIntegration, QI as browserApiErrorsIntegration, AM as browserProfilingIntegration, ow as browserSessionIntegration, uo as browserTracingIntegration, MM as buildLaunchDarklyFlagUsedHandler, qx as captureConsoleIntegration, Yr as captureEvent, _e as captureException, lb as captureFeedback, q_ as captureMessage, _m as captureReactException, xu as captureSession, wI as chromeStackLineParser, Hx as close, Zx as consoleLoggingIntegration, bM as contextLinesIntegration, Px as continueTrace, tM as createConsolaReporter, sM as createLangChainCallbackHandler, qM as createReduxEnhancer, vy as createTransport, hM as createUserFeedbackEnvelope, yS as dedupeIntegration, sm as defaultRequestInstrumentationOptions, DI as defaultStackLineParsers, FI as defaultStackParser, FM as diagnoseSdkConnectivity, Rf as endSession, eS as eventFiltersIntegration, jT as eventFromException, zT as eventFromMessage, Ic as exceptionFromError, Gx as extraErrorDataIntegration, Xx as featureFlagsIntegration, cM as feedbackAsyncIntegration, uM as feedbackIntegration, uM as feedbackSyncIntegration, Ux as flush, gM as forceLoad, Xy as functionToStringIntegration, AI as geckoStackLineParser, Ee as getActiveSpan, C as getClient, j as getCurrentScope, Iw as getDefaultIntegrations, aM as getFeedback, Gt as getGlobalScope, ke as getIsolationScope, IM as getReplay, Se as getRootSpan, Do as getSpanDescendants, wg as getSpanStatusFromHttpCode, Jf as getTraceData, aw as globalHandlersIntegration, EM as graphqlClientIntegration, LM as growthbookIntegration, SM as httpClientIntegration, fw as httpContextIntegration, tS as inboundFiltersIntegration, UM as init, rM as instrumentAnthropicAiClient, oM as instrumentGoogleGenAIClient, iM as instrumentLangGraph, nM as instrumentOpenAiClient, Q1 as instrumentOutgoingRequests, HS as instrumentSupabaseClient, V_ as isEnabled, Wx as isInitialized, G_ as lastEventId, xM as launchDarklyIntegration, LT as lazyLoadIntegration, _w as linkedErrorsIntegration, Qx as logger, CM as makeBrowserOfflineTransport, Qp as makeFetchTransport, jx as makeMultiplexedTransport, eM as metrics, zx as moduleMetadataIntegration, _M as onLoad, NM as openFeatureIntegration, fM as opera10StackLineParser, pM as opera11StackLineParser, Wy as parameterize, HM as reactErrorHandler, GM as reactRouterV3BrowserTracingIntegration, JM as reactRouterV4BrowserTracingIntegration, KM as reactRouterV5BrowserTracingIntegration, XM as reactRouterV6BrowserTracingIntegration, nN as reactRouterV7BrowserTracingIntegration, Vg as registerSpanErrorInstrumentation, BM as registerWebWorker, wM as replayCanvasIntegration, TM as replayIntegration, kM as reportPageLoaded, yM as reportingObserverIntegration, Vx as rewriteFramesIntegration, Bv as sendFeedback, RM as setActiveSpanInBrowser, kf as setContext, Oy as setCurrentClient, Dx as setExtra, Lx as setExtras, os as setHttpStatus, h_ as setMeasurement, $x as setTag, Fx as setTags, Bx as setUser, Fl as showReportDialog, Ox as spanToBaggageHeader, F as spanToJSON, Wg as spanToTraceHeader, mM as spotlightBrowserIntegration, fo as startBrowserTracingNavigationSpan, lo as startBrowserTracingPageLoadSpan, at as startInactiveSpan, b_ as startNewTrace, Au as startSession, ln as startSpan, jt as startSpanManual, DM as statsigIntegration, Jx as supabaseIntegration, S_ as suppressTracing, VM as tanstackRouterBrowserTracingIntegration, Yx as thirdPartyErrorFilterIntegration, lM as uiProfiler, PM as unleashIntegration, Nx as updateSpanName, jM as useProfiler, $M as webWorkerIntegration, dM as winjsStackLineParser, nr as withActiveSpan, zM as withErrorBoundary, Mx as withIsolationScope, WM as withProfiler, Ke as withScope, tN as withSentryReactRouterV6Routing, rN as withSentryReactRouterV7Routing, YM as withSentryRouting, ZM as wrapCreateBrowserRouterV6, oN as wrapCreateBrowserRouterV7, eN as wrapCreateMemoryRouterV6, sN as wrapCreateMemoryRouterV7, QM as wrapUseRoutesV6, iN as wrapUseRoutesV7, Kx as zodErrorsIntegration
};