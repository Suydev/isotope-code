import {
    r as a,
    f as z,
    j as e
} from "./vendor-react-BfU3Zn2J.js";
import {
    onForegroundMessage as L,
    ensureMessagingToken as D
} from "./messaging-BP0KfJxy.js";
import {
    u as w,
    N as P
} from "./useNotificationStore-BS4df28T.js";
import {
    _ as O
} from "./index-BPYJFSVW.js";
import {
    k as x
} from "./App-pJGjDiPw.js";
import {
    A as U,
    bL as _,
    X as v,
    aa as F,
    bj as T
} from "./vendor-icons-CqruUz7g.js";
import "./vendor-supabase-DAiUAuun.js";
import "./vendor-motion-Cp_NPzpZ.js";
import "./vendor-router-CmoTwRnm.js";
const y = 15e3,
    g = new Map,
    B = t => {
        const n = t.data ?.category;
        return n && Object.values(P).includes(n) ? n : P.SYSTEM
    },
    k = t => t.notification ?.title ?? t.data ?.title ?? "IsotopeAI",
    S = t => t.notification ?.body ?? t.data ?.body ?? "You have a new update.",
    R = t => t.fcmOptions ?.link ?? t.data ?.url ?? window.location.origin,
    K = t => {
        g.forEach((n, s) => {
            t - n > y && g.delete(s)
        })
    },
    I = t => {
        const n = k(t),
            s = S(t),
            o = R(t);
        return [t.data ?.dedupeKey, t.messageId, t.collapseKey, n, s, o].filter(Boolean).join("::")
    },
    q = t => {
        const n = I(t);
        if (!n) return !1;
        const s = Date.now();
        K(s);
        const o = g.get(n);
        return g.set(n, s), typeof o == "number" && s - o <= y
    },
    G = () => {
        const t = w(s => s.permission),
            n = w(s => s.sendNotification);
        return a.useEffect(() => {
            let s = () => {},
                o = !0;
            return (async () => (s = await L(i => {
                if (q(i)) return;
                const d = I(i);
                n(B(i), k(i), {
                    body: S(i),
                    icon: i.notification ?.icon ?? "/icons/icon-192x192.svg",
                    badge: "/icons/icon-96x96.svg",
                    tag: i.data ?.tag ?? i.messageId ?? d,
                    data: { ...i.data,
                        url: R(i)
                    }
                })
            }), o || s()))(), () => {
                o = !1, s()
            }
        }, [n]), a.useEffect(() => {
            t === "granted" && D().catch(s => {
                console.error("[FirebasePushManager] FCM token registration failed:", s)
            })
        }, [t]), null
    };

function Y(t = {}) {
    const {
        immediate: n = !1,
        onNeedRefresh: s,
        onOfflineReady: o,
        onRegistered: i,
        onRegisteredSW: d,
        onRegisterError: f
    } = t;
    let l, m;
    const u = async (r = !0) => {
        await m
    };
    async function c() {
        if ("serviceWorker" in navigator) {
            if (l = await O(async () => {
                    const {
                        Workbox: r
                    } = await
                    import ("./workbox-window.prod.es5-BIl4cyR9.js");
                    return {
                        Workbox: r
                    }
                }, []).then(({
                    Workbox: r
                }) => new r("/sw.js", {
                    scope: "/",
                    type: "classic"
                })).catch(r => {
                    f ?.(r)
                }), !l) return;
            l.addEventListener("activated", r => {
                (r.isUpdate || r.isExternal) && window.location.reload()
            }), l.addEventListener("installed", r => {
                r.isUpdate || o ?.()
            }), l.register({
                immediate: n
            }).then(r => {
                d ? d("/sw.js", r) : i ?.(r)
            }).catch(r => {
                f ?.(r)
            })
        }
    }
    return m = c(), u
}

function V(t = {}) {
    const {
        immediate: n = !0,
        onNeedRefresh: s,
        onOfflineReady: o,
        onRegistered: i,
        onRegisteredSW: d,
        onRegisterError: f
    } = t, [l, m] = a.useState(!1), [u, c] = a.useState(!1), [r] = a.useState(() => Y({
        immediate: n,
        onOfflineReady() {
            c(!0), o ?.()
        },
        onNeedRefresh() {
            m(!0), s ?.()
        },
        onRegistered: i,
        onRegisteredSW: d,
        onRegisterError: f
    }));
    return {
        needRefresh: [l, m],
        offlineReady: [u, c],
        updateServiceWorker: r
    }
}
const W = a.createContext(null),
    X = async () => {
        if (!("serviceWorker" in navigator)) return;
        const t = new Promise(s => {
                let o = !1;
                const i = () => {
                    o || (o = !0, navigator.serviceWorker.removeEventListener("controllerchange", i), s())
                };
                navigator.serviceWorker.addEventListener("controllerchange", i)
            }),
            n = new Promise(s => {
                window.setTimeout(s, 4e3)
            });
        await Promise.race([t, n])
    },
    H = ({
        children: t
    }) => {
        const [n, s] = a.useState({
            isInstallable: !1,
            isInstalled: !1,
            isUpdateAvailable: !1,
            isOffline: !navigator.onLine,
            deferredPrompt: null
        }), {
            needRefresh: [o, i],
            offlineReady: [d],
            updateServiceWorker: f
        } = V({
            onRegisterError(r) {
                console.error("PWA: Service Worker registration error", r)
            }
        });
        a.useEffect(() => {
            const r = window.matchMedia("(display-mode: standalone)").matches,
                b = window.navigator.standalone === !0;
            (r || b) && s(h => ({ ...h,
                isInstalled: !0
            }));
            const p = h => {
                    h.preventDefault();
                    const C = h;
                    s(M => ({ ...M,
                        isInstallable: !0,
                        deferredPrompt: C
                    }))
                },
                j = () => {
                    s(h => ({ ...h,
                        isInstalled: !0,
                        isInstallable: !1,
                        deferredPrompt: null
                    }))
                },
                N = () => {
                    s(h => ({ ...h,
                        isOffline: !1
                    }))
                },
                E = () => {
                    s(h => ({ ...h,
                        isOffline: !0
                    }))
                };
            return window.addEventListener("beforeinstallprompt", p), window.addEventListener("appinstalled", j), window.addEventListener("online", N), window.addEventListener("offline", E), () => {
                window.removeEventListener("beforeinstallprompt", p), window.removeEventListener("appinstalled", j), window.removeEventListener("online", N), window.removeEventListener("offline", E)
            }
        }, []), a.useEffect(() => {
            s(r => ({ ...r,
                isUpdateAvailable: o
            }))
        }, [o]);
        const l = async () => {
                if (!n.deferredPrompt) return !1;
                try {
                    await n.deferredPrompt.prompt();
                    const {
                        outcome: r
                    } = await n.deferredPrompt.userChoice;
                    return r === "accepted" ? (s(b => ({ ...b,
                        deferredPrompt: null,
                        isInstallable: !1
                    })), !0) : !1
                } catch (r) {
                    return console.error("PWA: Error during install", r), !1
                }
            },
            m = async () => {
                try {
                    await f(!0), i(!1), await X(), window.location.replace(window.location.href)
                } catch (r) {
                    console.error("PWA: Error during update", r)
                }
            },
            u = () => {
                i(!1)
            },
            c = a.useMemo(() => ({ ...n,
                install: l,
                update: m,
                dismissUpdate: u,
                offlineReady: d
            }), [d, n]);
        return z.createElement(W.Provider, {
            value: c
        }, t)
    };

function A() {
    const t = a.useContext(W);
    if (!t) throw new Error("usePWA must be used within a PWAProvider");
    return t
}

function J() {
    const {
        isInstallable: t,
        isInstalled: n,
        install: s
    } = A(), [o, i] = a.useState(!1), [d, f] = a.useState(!1);
    a.useEffect(() => {
        let u = null;
        return (async () => {
            if (await x.getItem("pwa-banner-dismissed")) {
                f(!0);
                return
            }
            u = setTimeout(() => {
                t && !n && !d && i(!0)
            }, 1e4)
        })(), () => {
            u && clearTimeout(u)
        }
    }, [t, n, d]);
    const l = async () => {
            await s(), i(!1)
        },
        m = () => {
            x.setItem("pwa-banner-dismissed", "true"), f(!0), i(!1)
        };
    return !o || !t || n || d ? null : e.jsx("div", {
        className: "fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:max-w-md z-40 animate-slide-up",
        children: e.jsxs("div", {
            className: "bg-gradient-to-br from-zinc-900 to-zinc-800 border border-brand-500/30 rounded-xl shadow-2xl shadow-brand-500/10 overflow-hidden",
            children: [e.jsx("div", {
                className: "h-1 bg-gradient-to-r from-brand-600 to-brand-600"
            }), e.jsx("div", {
                className: "p-4",
                children: e.jsxs("div", {
                    className: "flex items-center gap-3",
                    children: [e.jsx("div", {
                        className: "w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600 to-brand-600 flex items-center justify-center flex-shrink-0",
                        children: e.jsx(U, {
                            className: "w-6 h-6 text-white"
                        })
                    }), e.jsxs("div", {
                        className: "flex-1 min-w-0",
                        children: [e.jsx("h3", {
                            className: "text-white font-semibold text-sm mb-0.5",
                            children: "Install IsotopeAI"
                        }), e.jsx("p", {
                            className: "text-zinc-400 text-xs",
                            children: "Get offline access & native app experience"
                        })]
                    }), e.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [e.jsxs("button", {
                            onClick: l,
                            className: "px-4 py-2 bg-gradient-to-r from-brand-600 to-brand-600 hover:from-brand-500 hover:to-brand-500 text-white rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 shadow-lg shadow-brand-500/25",
                            children: [e.jsx(_, {
                                className: "w-3.5 h-3.5"
                            }), "Install"]
                        }), e.jsx("button", {
                            onClick: m,
                            className: "p-2 rounded-lg hover:bg-white/10 transition-colors",
                            children: e.jsx(v, {
                                className: "w-4 h-4 text-zinc-400"
                            })
                        })]
                    })]
                })
            })]
        })
    })
}

function Q() {
    const {
        isUpdateAvailable: t,
        update: n,
        dismissUpdate: s
    } = A();
    return t ? e.jsx("div", {
        className: "fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 max-w-sm animate-fade-in-up",
        children: e.jsxs("div", {
            className: "bg-gradient-to-br from-zinc-900 to-zinc-800 border border-brand-500/30 rounded-xl shadow-2xl shadow-brand-500/10 overflow-hidden",
            children: [e.jsx("div", {
                className: "h-1 bg-gradient-to-r from-brand-600 to-brand-600"
            }), e.jsx("div", {
                className: "p-4",
                children: e.jsxs("div", {
                    className: "flex items-start gap-3",
                    children: [e.jsx("div", {
                        className: "w-10 h-10 rounded-lg bg-gradient-to-br from-brand-600 to-brand-600 flex items-center justify-center flex-shrink-0",
                        children: e.jsx(F, {
                            className: "w-5 h-5 text-white"
                        })
                    }), e.jsxs("div", {
                        className: "flex-1 min-w-0",
                        children: [e.jsx("h3", {
                            className: "text-white font-semibold text-sm mb-1",
                            children: "Update Available"
                        }), e.jsx("p", {
                            className: "text-zinc-400 text-xs leading-relaxed",
                            children: "A new version of IsotopeAI is ready. Update now for the latest features and improvements."
                        }), e.jsxs("div", {
                            className: "flex gap-2 mt-3",
                            children: [e.jsx("button", {
                                onClick: n,
                                className: "px-4 py-2 bg-gradient-to-r from-brand-600 to-brand-600 hover:from-brand-500 hover:to-brand-500 text-white rounded-lg text-xs font-semibold transition-all duration-200 shadow-lg shadow-brand-500/25",
                                children: "Update Now"
                            }), e.jsx("button", {
                                onClick: s,
                                className: "px-4 py-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors text-xs font-medium",
                                children: "Later"
                            })]
                        })]
                    }), e.jsx("button", {
                        onClick: s,
                        className: "p-1 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0",
                        children: e.jsx(v, {
                            className: "w-4 h-4 text-zinc-400"
                        })
                    })]
                })
            })]
        })
    }) : null
}

function Z() {
    const {
        permission: t,
        preferences: n,
        requestPermission: s
    } = w(), [o, i] = a.useState(!1), [d, f] = a.useState(!1);
    a.useEffect(() => {
        let c = null;
        return (async () => {
            const r = await x.getItem("notification-prompt-dismissed");
            t === "default" && !r && (c = setTimeout(() => {
                i(!0)
            }, 12e4))
        })(), () => {
            c && clearTimeout(c)
        }
    }, [t]);
    const l = async () => {
            f(!0);
            const c = await s();
            f(!1), c && i(!1)
        },
        m = () => {
            i(!1)
        },
        u = () => {
            x.setItem("notification-prompt-dismissed", "true"), i(!1)
        };
    return !o || t !== "default" ? null : e.jsx("div", {
        className: "fixed bottom-4 right-4 md:bottom-8 md:right-8 z-40 max-w-sm animate-slide-up",
        children: e.jsxs("div", {
            className: "bg-gradient-to-br from-zinc-900 to-zinc-800 border border-brand-500/30 rounded-xl shadow-2xl shadow-brand-500/10 overflow-hidden",
            children: [e.jsx("div", {
                className: "h-1 bg-gradient-to-r from-brand-600 to-brand-600"
            }), e.jsx("div", {
                className: "p-4",
                children: e.jsxs("div", {
                    className: "flex items-start gap-3",
                    children: [e.jsx("div", {
                        className: "w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600 to-brand-600 flex items-center justify-center flex-shrink-0",
                        children: e.jsx(T, {
                            className: "w-6 h-6 text-white"
                        })
                    }), e.jsxs("div", {
                        className: "flex-1 min-w-0",
                        children: [e.jsx("h3", {
                            className: "text-white font-semibold text-sm mb-1",
                            children: "Stay on Track"
                        }), e.jsx("p", {
                            className: "text-zinc-400 text-xs leading-relaxed mb-3",
                            children: "Enable notifications to get reminders for your study sessions, habits, and tasks."
                        }), e.jsxs("div", {
                            className: "flex gap-2",
                            children: [e.jsx("button", {
                                onClick: l,
                                disabled: d,
                                className: "px-4 py-2 bg-gradient-to-r from-brand-600 to-brand-600 hover:from-brand-500 hover:to-brand-500 text-white rounded-lg text-xs font-semibold transition-all duration-200 shadow-lg shadow-brand-500/25 disabled:opacity-50",
                                children: d ? "Enabling..." : "Enable"
                            }), e.jsx("button", {
                                onClick: m,
                                className: "px-4 py-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors text-xs font-medium",
                                children: "Later"
                            })]
                        }), e.jsx("button", {
                            onClick: u,
                            className: "text-zinc-500 hover:text-zinc-400 text-xs mt-2 transition-colors",
                            children: "Don't ask again"
                        })]
                    }), e.jsx("button", {
                        onClick: m,
                        className: "p-1 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0",
                        children: e.jsx(v, {
                            className: "w-4 h-4 text-zinc-400"
                        })
                    })]
                })
            })]
        })
    })
}

function de() {
    return e.jsxs(H, {
        children: [e.jsx(G, {}), e.jsx(J, {}), " ", e.jsx(Q, {}), e.jsx(Z, {})]
    })
}
export {
    de as
    default
};