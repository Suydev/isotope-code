import {
    r,
    j as e
} from "./vendor-react-BfU3Zn2J.js";
import {
    u as S
} from "./useOnlineStatus-BJOTUERN.js";
import {
    b3 as w,
    bt as I,
    X as z,
    aY as E,
    S as T
} from "./vendor-icons-CqruUz7g.js";
import {
    u as C,
    X as A,
    Y as D,
    k as x,
    Z as R
} from "./App-pJGjDiPw.js";
import {
    A as $,
    m as O
} from "./vendor-motion-Cp_NPzpZ.js";
const M = "Local study tools still work. Community, invites, and billing are unavailable until your connection returns.",
    V = ({
        buttonClassName: m = "",
        panelClassName: o = ""
    }) => {
        const {
            isOnline: l
        } = S(), [a, c] = r.useState(!1), i = r.useId(), t = r.useRef(null), s = () => {
            t.current !== null && (window.clearTimeout(t.current), t.current = null)
        }, b = () => {
            s(), t.current = window.setTimeout(() => {
                c(!1)
            }, 140)
        };
        return r.useEffect(() => () => {
            s()
        }, []), l ? null : e.jsxs("div", {
            className: "relative flex items-center",
            onMouseEnter: () => {
                s(), c(!0)
            },
            onMouseLeave: b,
            onFocusCapture: () => {
                s(), c(!0)
            },
            onBlurCapture: u => {
                const f = u.relatedTarget;
                (!f || !u.currentTarget.contains(f)) && b()
            },
            children: [e.jsx("button", {
                type: "button",
                "aria-label": "Offline status",
                "aria-controls": i,
                "aria-expanded": a,
                onClick: () => c(u => !u),
                onKeyDown: u => {
                    u.key === "Escape" && c(!1)
                },
                className: `inline-flex h-10 w-10 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-600 transition-colors hover:bg-amber-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 dark:text-amber-400 ${m}`.trim(),
                children: e.jsx(w, {
                    className: "h-4 w-4"
                })
            }), a && e.jsx("div", {
                id: i,
                role: "tooltip",
                className: `absolute right-0 top-full z-[80] mt-2 w-72 rounded-2xl border border-amber-500/20 bg-white/95 p-4 text-left shadow-2xl backdrop-blur-xl dark:bg-zinc-950/95 ${o}`.trim(),
                children: e.jsxs("div", {
                    className: "flex items-start gap-3",
                    children: [e.jsx("div", {
                        className: "rounded-full bg-amber-500/15 p-2 text-amber-500",
                        children: e.jsx(w, {
                            className: "h-4 w-4"
                        })
                    }), e.jsxs("div", {
                        className: "space-y-1",
                        children: [e.jsx("p", {
                            className: "text-sm font-bold text-zinc-900 dark:text-white",
                            children: "You’re offline"
                        }), e.jsx("p", {
                            className: "text-sm text-zinc-600 dark:text-zinc-300",
                            children: M
                        }), e.jsx("p", {
                            className: "text-xs font-medium text-zinc-500 dark:text-zinc-400",
                            children: "Reconnect to restore sync and other online-only actions."
                        })]
                    })]
                })
            })]
        })
    },
    g = "storage-health-dismissed-warning",
    G = ({
        buttonClassName: m = "",
        panelClassName: o = ""
    }) => {
        const l = C(n => n.isAuthenticated),
            [a, c] = r.useState(() => A()),
            [i, t] = r.useState(!1),
            [s, b] = r.useState(null),
            u = r.useId(),
            f = r.useRef(null),
            h = () => {
                f.current !== null && (window.clearTimeout(f.current), f.current = null)
            },
            v = () => {
                h(), f.current = window.setTimeout(() => {
                    t(!1)
                }, 140)
            };
        r.useEffect(() => D(n => {
            c(n)
        }), []);
        const d = r.useMemo(() => a.lastRecoveryAt || a.backupModeActive ? {
            fingerprint: `recovery:${a.lastRecoveryAt??a.lastIssueAt??"active"}`,
            title: "Local backup was used",
            description: "Your browser storage became unstable, so Isotope recovered data from its local backup.",
            detail: "Your data is still available, but exporting a JSON backup from Settings > Data & Privacy is strongly recommended.",
            icon: w
        } : a.persistentStorageGranted === !1 ? {
            fingerprint: "persistence:not-granted",
            title: "Browser storage may be cleared",
            description: "This browser did not promise to keep Isotope’s local database permanently.",
            detail: "That does not mean your data is gone right now. It means the browser could wipe local app data later under storage cleanup or privacy rules.",
            icon: I
        } : null, [a]);
        if (r.useEffect(() => {
                let n = !0;
                return (async () => {
                    const N = await x.getItem(g);
                    n && b(N)
                })(), () => {
                    n = !1
                }
            }, []), r.useEffect(() => () => {
                h()
            }, []), r.useEffect(() => {
                d && s && s !== d.fingerprint && (b(null), x.removeItem(g))
            }, [s, d]), !l || !d || s === d.fingerprint) return null;
        const y = d.icon,
            j = async () => {
                await x.setItem(g, d.fingerprint), b(d.fingerprint), t(!1)
            };
        return e.jsxs("div", {
            className: "relative flex items-center",
            onMouseEnter: () => {
                h(), t(!0)
            },
            onMouseLeave: v,
            onFocusCapture: () => {
                h(), t(!0)
            },
            onBlurCapture: n => {
                const p = n.relatedTarget;
                (!p || !n.currentTarget.contains(p)) && v()
            },
            children: [e.jsx("button", {
                type: "button",
                "aria-label": "Storage safety status",
                "aria-controls": u,
                "aria-expanded": i,
                onClick: () => t(n => !n),
                onKeyDown: n => {
                    n.key === "Escape" && t(!1)
                },
                className: `inline-flex h-10 w-10 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-600 transition-colors hover:bg-amber-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 dark:text-amber-400 ${m}`.trim(),
                children: e.jsx(y, {
                    className: "h-4 w-4"
                })
            }), i && e.jsx("div", {
                id: u,
                role: "tooltip",
                className: `absolute right-0 top-full z-[80] mt-2 w-72 rounded-2xl border border-amber-500/20 bg-white/95 p-4 text-left shadow-2xl backdrop-blur-xl dark:bg-zinc-950/95 ${o}`.trim(),
                children: e.jsxs("div", {
                    className: "flex items-start gap-3",
                    children: [e.jsx("div", {
                        className: "rounded-full bg-amber-500/15 p-2 text-amber-500",
                        children: e.jsx(y, {
                            className: "h-4 w-4"
                        })
                    }), e.jsxs("div", {
                        className: "min-w-0 flex-1 space-y-1",
                        children: [e.jsxs("div", {
                            className: "flex items-start justify-between gap-3",
                            children: [e.jsx("p", {
                                className: "text-sm font-bold text-zinc-900 dark:text-white",
                                children: d.title
                            }), e.jsx("button", {
                                type: "button",
                                "aria-label": "Dismiss storage warning",
                                onMouseDown: n => {
                                    n.preventDefault()
                                },
                                onClick: () => {
                                    j()
                                },
                                className: "inline-flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-white/5 dark:hover:text-zinc-200",
                                children: e.jsx(z, {
                                    className: "h-4 w-4"
                                })
                            })]
                        }), e.jsx("p", {
                            className: "text-sm text-zinc-600 dark:text-zinc-300",
                            children: d.description
                        }), e.jsx("p", {
                            className: "text-xs font-medium text-zinc-500 dark:text-zinc-400",
                            children: d.detail
                        }), a.persistentStorageGranted === !1 && e.jsxs("button", {
                            type: "button",
                            onClick: async () => {
                                await R(), t(!1)
                            },
                            className: "mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors",
                            children: [e.jsx(E, {
                                className: "h-3.5 w-3.5"
                            }), "Enable protection"]
                        })]
                    })]
                })
            })]
        })
    },
    J = ({
        content: m,
        children: o,
        className: l = "",
        side: a = "top"
    }) => {
        const [c, i] = r.useState(!1), t = {
            top: "-top-10 left-1/2 -translate-x-1/2",
            bottom: "-bottom-10 left-1/2 -translate-x-1/2",
            left: "-left-2 top-1/2 -translate-y-1/2 -translate-x-full",
            right: "left-full top-1/2 -translate-y-1/2 ml-2"
        }, s = {
            top: "-bottom-1 left-1/2 -translate-x-1/2",
            bottom: "-top-1 left-1/2 -translate-x-1/2",
            left: "-right-1 top-1/2 -translate-y-1/2",
            right: "-left-1 top-1/2 -translate-y-1/2"
        };
        return e.jsxs("div", {
            className: `relative flex items-center justify-center ${l}`,
            onMouseEnter: () => i(!0),
            onMouseLeave: () => i(!1),
            children: [o, e.jsx($, {
                children: c && e.jsxs(O.div, {
                    initial: {
                        opacity: 0,
                        scale: .9
                    },
                    animate: {
                        opacity: 1,
                        scale: 1
                    },
                    exit: {
                        opacity: 0,
                        scale: .9
                    },
                    transition: {
                        duration: .15
                    },
                    className: `absolute ${t[a]} px-3 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-black text-xs font-bold rounded-lg shadow-xl whitespace-nowrap z-[60] pointer-events-none select-none`,
                    children: [m, e.jsx("div", {
                        className: `absolute ${s[a]} w-2 h-2 bg-zinc-900 dark:bg-white rotate-45`
                    })]
                })
            })]
        })
    },
    F = {
        selector: ".headway-widget-anchor",
        trigger: ".headway-widget-trigger",
        account: "JRVAXJ",
        position: {
            x: "right",
            y: "bottom"
        },
        translations: {
            title: "Product updates"
        }
    },
    k = "headway-widget-script",
    H = "https://cdn.headwayapp.co/widget.js",
    K = ({
        className: m = ""
    }) => {
        const o = r.useMemo(() => {
            const l = Math.random().toString(36).slice(2);
            return {
                anchor: `headway-widget-anchor-${l}`,
                trigger: `headway-widget-trigger-${l}`
            }
        }, []);
        return r.useEffect(() => {
            if (typeof window > "u") return;
            let l, a = !1;
            const c = { ...F,
                    selector: `.${o.anchor}`,
                    trigger: `.${o.trigger}`
                },
                i = () => {
                    if (!a) {
                        if (window.Headway ?.init && document.querySelector(c.selector)) {
                            window.Headway.init(c);
                            return
                        }
                        l = window.setTimeout(i, 150)
                    }
                },
                t = document.getElementById(k);
            if (t) t.addEventListener("load", i, {
                once: !0
            }), i();
            else {
                const s = document.createElement("script");
                s.id = k, s.src = H, s.async = !0, s.addEventListener("load", i, {
                    once: !0
                }), document.body.appendChild(s)
            }
            return () => {
                a = !0, l !== void 0 && window.clearTimeout(l)
            }
        }, [o.anchor, o.trigger]), e.jsxs("button", {
            type: "button",
            className: `headway-widget-trigger ${o.trigger} group relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white/80 text-zinc-700 shadow-sm shadow-zinc-950/[0.03] backdrop-blur transition-all duration-200 hover:border-zinc-300 hover:bg-white hover:text-zinc-950 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.98] dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:shadow-black/20 dark:hover:border-white/15 dark:hover:bg-white/10 dark:hover:text-white dark:focus-visible:ring-offset-[#09090b] ${m}`,
            "aria-label": "View product updates",
            title: "Product updates",
            children: [e.jsx(T, {
                className: "h-4 w-4 text-brand-500 transition-transform duration-200 group-hover:scale-105"
            }), e.jsx("span", {
                className: `headway-widget-anchor ${o.anchor}`,
                "aria-hidden": "true"
            })]
        })
    };
export {
    K as H, V as O, G as S, J as T
};