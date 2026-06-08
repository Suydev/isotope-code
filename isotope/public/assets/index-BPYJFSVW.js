const __vite__mapDeps = (i, m = __vite__mapDeps, d = (m.f || (m.f = ["assets/vendor-sentry-VzeXdCeF.js", "assets/vendor-react-BfU3Zn2J.js", "assets/App-pJGjDiPw.js", "assets/vendor-supabase-DAiUAuun.js", "assets/vendor-motion-Cp_NPzpZ.js", "assets/vendor-icons-CqruUz7g.js", "assets/vendor-router-CmoTwRnm.js"]))) => i.map(i => d[i]);
import {
    h as I,
    j as c,
    f as E
} from "./vendor-react-BfU3Zn2J.js";
(function() {
    const o = document.createElement("link").relList;
    if (o && o.supports && o.supports("modulepreload")) return;
    for (const r of document.querySelectorAll('link[rel="modulepreload"]')) a(r);
    new MutationObserver(r => {
        for (const n of r)
            if (n.type === "childList")
                for (const s of n.addedNodes) s.tagName === "LINK" && s.rel === "modulepreload" && a(s)
    }).observe(document, {
        childList: !0,
        subtree: !0
    });

    function t(r) {
        const n = {};
        return r.integrity && (n.integrity = r.integrity), r.referrerPolicy && (n.referrerPolicy = r.referrerPolicy), r.crossOrigin === "use-credentials" ? n.credentials = "include" : r.crossOrigin === "anonymous" ? n.credentials = "omit" : n.credentials = "same-origin", n
    }

    function a(r) {
        if (r.ep) return;
        r.ep = !0;
        const n = t(r);
        fetch(r.href, n)
    }
})();
const L = "modulepreload",
    T = function(e) {
        return "/" + e
    },
    g = {},
    S = function(o, t, a) {
        let r = Promise.resolve();
        if (t && t.length > 0) {
            let s = function(i) {
                return Promise.all(i.map(u => Promise.resolve(u).then(f => ({
                    status: "fulfilled",
                    value: f
                }), f => ({
                    status: "rejected",
                    reason: f
                }))))
            };
            document.getElementsByTagName("link");
            const l = document.querySelector("meta[property=csp-nonce]"),
                p = l ?.nonce || l ?.getAttribute("nonce");
            r = s(t.map(i => {
                if (i = T(i), i in g) return;
                g[i] = !0;
                const u = i.endsWith(".css"),
                    f = u ? '[rel="stylesheet"]' : "";
                if (document.querySelector(`link[href="${i}"]${f}`)) return;
                const d = document.createElement("link");
                if (d.rel = u ? "stylesheet" : L, u || (d.as = "script"), d.crossOrigin = "", d.href = i, p && d.setAttribute("nonce", p), document.head.appendChild(d), u) return new Promise((b, P) => {
                    d.addEventListener("load", b), d.addEventListener("error", () => P(new Error(`Unable to preload CSS for ${i}`)))
                })
            }))
        }

        function n(s) {
            const l = new Event("vite:preloadError", {
                cancelable: !0
            });
            if (l.payload = s, window.dispatchEvent(l), !l.defaultPrevented) throw s
        }
        return r.then(s => {
            for (const l of s || []) l.status === "rejected" && n(l.reason);
            return o().catch(n)
        })
    },
    h = "__ISOTOPE_RUNTIME_CONSOLE_FILTER_INSTALLED__",
    O = ["[Init]", "[ProtectedRoute]", "[AuthStore]", "[AIStore]", "[SyncStore]", "[SyncEngine]", "[SessionSync]", "[TaskController]", "[TaskStore]", "[FocusStore]", "[HabitStore]", "[SubjectStore]", "[UserStore]", "[Migration]", "[Supabase]", "PWA:", "Connection lost", "Connection restored"],
    C = ["[AIStore]", "[SyncEngine]", "[SessionSync]", "[TaskController]", "PWA:"],
    N = ["err_blocked_by_client", "failed to fetch dynamically imported module", "importing a module script failed", "networkerror when attempting to fetch resource", "load failed", "sentry.io", "@sentry/", "sentry"],
    A = /^\[[^\]]+\]/,
    x = e => {
        if (e instanceof Error) return [e.name, e.message, e.stack].filter(Boolean).join(" ");
        if (typeof e == "string") return e;
        if (typeof e == "number" || typeof e == "boolean" || e == null) return String(e);
        try {
            return JSON.stringify(e)
        } catch {
            return String(e)
        }
    },
    _ = e => e.map(x).join(" ").toLowerCase(),
    j = e => {
        const o = _([e]);
        return N.some(t => o.includes(t))
    },
    v = (e, o) => {
        const t = _(o),
            a = A.test(t);
        return (e === "log" || e === "warn") && (a || O.some(r => t.startsWith(r.toLowerCase()))) || e === "error" && (a || C.some(r => t.startsWith(r.toLowerCase()))) ? !0 : j(t)
    },
    k = (e = {}) => {
        const {
            isProduction: o = !0,
            target: t = globalThis
        } = e;
        o && (t.__WB_DISABLE_DEV_LOGS = !0)
    },
    B = (e = {}) => {
        const {
            isProduction: o = !0,
            consoleRef: t = console,
            target: a = globalThis
        } = e;
        if (!o || a[h]) return;
        const r = {
            log: t.log.bind(t),
            warn: t.warn.bind(t),
            error: t.error.bind(t)
        };
        ["log", "warn", "error"].forEach(n => {
            t[n] = (...s) => {
                v(n, s) || r[n](...s)
            }
        }), a[h] = !0
    },
    F = async (e = () => S(() =>
        import ("./vendor-sentry-VzeXdCeF.js"), __vite__mapDeps([0, 1]))) => {
        try {
            const o = await e();
            return o.init({
                dsn: "https://b5c41db34258cb3b6d44c47d80d3284f@o4510670882865152.ingest.us.sentry.io/4510670885224448",
                sendDefaultPii: !0,
                integrations: [o.browserTracingIntegration(), o.replayIntegration()],
                tracesSampleRate: 1,
                tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
                replaysSessionSampleRate: .1,
                replaysOnErrorSampleRate: 1,
                enableLogs: !1
            }), !0
        } catch {
            return !1
        }
    },
    M = e => e instanceof Error ? e.name === "ChunkLoadError" || e.message.includes("Failed to fetch dynamically imported module") || e.message.includes("Importing a module script failed") || e.message.includes("Loading chunk") : !1;
k();
B();
const w = document.getElementById("root");
if (!w) throw new Error("Could not find root element to mount to");
const R = I.createRoot(w),
    m = "isotope-pwa-chunk-recovery",
    D = "isotope-asset-recovery-v1",
    y = "__isotope_reload",
    U = () => {
        try {
            sessionStorage.removeItem(D)
        } catch {}
        const e = new URL(window.location.href);
        e.searchParams.has(y) && (e.searchParams.delete(y), window.history.replaceState(window.history.state, document.title, e.toString()))
    },
    W = () => {
        R.render(c.jsx(E.StrictMode, {
            children: c.jsx("div", {
                className: "min-h-screen bg-[#09090b] flex flex-col items-center justify-center gap-6",
                children: c.jsxs("div", {
                    className: "flex flex-col items-center gap-4",
                    children: [c.jsx("div", {
                        className: "animate-pulse text-white font-display text-2xl",
                        children: "IsotopeAI"
                    }), c.jsxs("div", {
                        className: "flex gap-2",
                        children: [c.jsx("div", {
                            className: "h-2 w-2 rounded-full bg-brand-500 animate-bounce"
                        }), c.jsx("div", {
                            className: "h-2 w-2 rounded-full bg-brand-500 animate-bounce delay-75"
                        }), c.jsx("div", {
                            className: "h-2 w-2 rounded-full bg-brand-500 animate-bounce delay-150"
                        })]
                    })]
                })
            })
        }))
    },
    V = (e, o = 3500) => {
        if (typeof window > "u") {
            e();
            return
        }
        const t = window;
        if (typeof t.requestIdleCallback == "function") {
            t.requestIdleCallback(() => {
                e()
            }, {
                timeout: o
            });
            return
        }
        window.setTimeout(e, o)
    },
    Y = async () => {
        W();
        try {
            const {
                default: e
            } = await S(async () => {
                const {
                    default: o
                } = await
                import ("./App-pJGjDiPw.js").then(t => t.ae);
                return {
                    default: o
                }
            }, __vite__mapDeps([2, 1, 3, 4, 5, 6]));
            sessionStorage.removeItem(m), U(), R.render(c.jsx(E.StrictMode, {
                children: c.jsx(e, {})
            }))
        } catch (e) {
            if (M(e) && sessionStorage.getItem(m) !== "1") {
                sessionStorage.setItem(m, "1"), window.location.replace(window.location.href);
                return
            }
            throw e
        }
        V(() => {
            F()
        })
    };
Y();
export {
    S as _, M as i
};