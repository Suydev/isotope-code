import {
    r as g,
    j as e
} from "./vendor-react-BfU3Zn2J.js";
import {
    u as m,
    c as v,
    s as S,
    i as P,
    G as M
} from "./App-pJGjDiPw.js";
import {
    u as z
} from "./vendor-router-CmoTwRnm.js";
import {
    A as I,
    m as y
} from "./vendor-motion-Cp_NPzpZ.js";
import {
    S as _,
    i as k,
    A as T,
    h as R,
    X as F
} from "./vendor-icons-CqruUz7g.js";
import "./index-BPYJFSVW.js";
import "./vendor-supabase-DAiUAuun.js";
const V = () => {
        const a = m(l => l.isInitialized),
            s = m(l => l.isAuthenticated),
            i = z(),
            t = g.useRef(null),
            {
                isPerformanceMode: n
            } = v();
        return g.useEffect(() => {
            if (!a || s) return;
            const l = "801132168802-j8a7hetf3d6ke6ljb8tftb68sm0roqa5.apps.googleusercontent.com",
                u = window,
                j = () => {
                    const x = u.google ?.accounts ?.id;
                    if (x) try {
                        x.cancel(), x.initialize({
                            client_id: l,
                            callback: async d => {
                                try {
                                    if (!S) throw new Error("Supabase client not initialized");
                                    const {
                                        data: b,
                                        error: f
                                    } = await S.auth.signInWithIdToken({
                                        provider: "google",
                                        token: d.credential
                                    });
                                    f ? (console.error("Error signing in with Google One Tap:", f), m.getState().setError(f.message)) : i("/dashboard")
                                } catch (b) {
                                    console.error("Exception in Google One Tap callback:", b)
                                }
                            },
                            auto_select: !0,
                            cancel_on_tap_outside: !1,
                            use_fedcm_for_prompt: !0,
                            itp_support: !0
                        }), setTimeout(() => {
                            x.prompt(d => {
                                d.isNotDisplayed() ? console.warn("One Tap not displayed. Reason:", d.getNotDisplayedReason()) : d.isSkippedMoment() && console.warn("One Tap skipped. Reason:", d.getSkippedReason())
                            })
                        }, 500)
                    } catch (d) {
                        console.error("Error initializing Google One Tap:", d)
                    }
                };
            let r = document.getElementById("google-one-tap-script");
            r || (r = document.createElement("script"), r.id = "google-one-tap-script", r.src = "https://accounts.google.com/gsi/client", r.async = !0, r.defer = !0, document.body.appendChild(r));
            let o = null;
            const c = () => {
                t.current && clearTimeout(t.current), t.current = setTimeout(() => {
                    if (typeof window.requestIdleCallback == "function") {
                        o = window.requestIdleCallback(() => {
                            j()
                        }, {
                            timeout: 2e3
                        });
                        return
                    }
                    j()
                }, n ? 1800 : 1e3)
            };
            return u.google ?.accounts ?.id ? c() : r.addEventListener("load", c), () => {
                t.current && clearTimeout(t.current), r && r.removeEventListener("load", c), o !== null && window.cancelIdleCallback ?.(o)
            }
        }, [a, s, n, i]), null
    },
    D = ({
        className: a = "w-8 h-8"
    }) => e.jsxs("div", {
        className: "flex items-center gap-2 group",
        children: [e.jsxs("div", {
            className: "relative",
            children: [e.jsx("div", {
                className: "absolute inset-0 bg-brand-500/50 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            }), e.jsx(T, {
                className: `${a} text-white relative z-10 transition-transform duration-700 group-hover:rotate-180`
            })]
        }), e.jsxs("span", {
            className: "text-lg font-display font-bold tracking-wider text-white",
            children: ["ISOTOPE", e.jsx("span", {
                className: "opacity-50",
                children: "AI"
            })]
        })]
    }),
    A = () => e.jsxs("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 48 48",
        className: "w-5 h-5",
        children: [e.jsx("path", {
            fill: "#FFC107",
            d: "M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
        }), e.jsx("path", {
            fill: "#FF3D00",
            d: "M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
        }), e.jsx("path", {
            fill: "#4CAF50",
            d: "M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
        }), e.jsx("path", {
            fill: "#1976D2",
            d: "M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
        })]
    }),
    C = () => P() && !0,
    w = ({
        type: a,
        placeholder: s,
        value: i,
        onChange: t,
        autoFocus: n,
        disabled: l,
        label: u
    }) => e.jsxs("div", {
        className: "space-y-1.5",
        children: [u && e.jsx("label", {
            className: "text-xs font-medium text-zinc-400 ml-1",
            children: u
        }), e.jsxs("div", {
            className: "relative group",
            children: [e.jsx("input", {
                type: a,
                value: i,
                onChange: t,
                autoFocus: n,
                disabled: l,
                className: "w-full bg-zinc-900/50 border border-zinc-800 text-white text-sm rounded-xl px-4 py-3.5 placeholder-zinc-600 outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 focus:bg-zinc-900 transition-all duration-200 disabled:opacity-50 group-hover:border-zinc-700",
                placeholder: s,
                required: !0
            }), e.jsx("div", {
                className: "absolute inset-0 rounded-xl ring-1 ring-white/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"
            })]
        })]
    }),
    G = ({
        children: a,
        onClick: s,
        disabled: i,
        loading: t
    }) => {
        const {
            shouldReduceMotion: n
        } = v();
        return e.jsxs(y.button, {
            whileHover: !i && !n ? {
                scale: 1.02
            } : {},
            whileTap: !i && !n ? {
                scale: .98
            } : {},
            onClick: s,
            disabled: i || t,
            className: "w-full bg-white text-black font-semibold text-sm px-4 py-3.5 rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]",
            children: [t ? e.jsx(k, {
                className: "w-4 h-4 animate-spin"
            }) : null, a]
        })
    },
    E = ({
        message: a,
        onDismiss: s
    }) => {
        const {
            shouldReduceMotion: i
        } = v();
        return e.jsxs(y.div, {
            initial: i ? !1 : {
                opacity: 0,
                y: -10,
                height: 0
            },
            animate: {
                opacity: 1,
                y: 0,
                height: "auto"
            },
            exit: i ? void 0 : {
                opacity: 0,
                y: -10,
                height: 0
            },
            className: "bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-3 text-red-400 text-sm overflow-hidden",
            children: [e.jsx(R, {
                className: "w-4 h-4 flex-shrink-0"
            }), e.jsx("p", {
                className: "flex-1",
                children: a
            }), e.jsx("button", {
                onClick: s,
                className: "hover:bg-red-500/20 p-1 rounded-md transition-colors",
                children: e.jsx(F, {
                    className: "w-3 h-3"
                })
            })]
        })
    },
    L = ({
        children: a,
        isSignIn: s,
        toggle: i
    }) => {
        const {
            isPerformanceMode: t,
            shouldReduceMotion: n
        } = v();
        return e.jsxs("div", {
            className: "min-h-screen bg-black text-white flex font-sans selection:bg-zinc-800 selection:text-white overflow-hidden",
            children: [e.jsxs("div", {
                className: "w-full lg:w-[45%] flex flex-col p-[var(--density-page-x-sm)] lg:p-[calc(var(--density-page-x-lg)+1rem)] relative z-10",
                children: [e.jsxs("div", {
                    className: "flex items-center justify-between mb-12",
                    children: [e.jsx(D, {}), e.jsx("button", {
                        onClick: i,
                        className: "text-sm text-zinc-400 hover:text-white transition-colors",
                        children: s ? "Create an account" : "Sign In"
                    })]
                }), e.jsx("div", {
                    className: "flex-1 flex flex-col justify-center max-w-sm mx-auto w-full",
                    children: e.jsxs(y.div, {
                        initial: n ? !1 : {
                            opacity: 0,
                            y: 20
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        transition: {
                            duration: n ? 0 : .5
                        },
                        className: "space-y-[var(--density-stack-gap-lg)]",
                        children: [e.jsxs("div", {
                            className: "space-y-2",
                            children: [e.jsx("h1", {
                                className: "text-3xl font-bold tracking-tight",
                                children: s ? "Welcome back" : "Create your account"
                            }), e.jsx("p", {
                                className: "text-zinc-500",
                                children: s ? "Enter your details to access your workspace." : "Start your learning journey with Isotope today."
                            })]
                        }), a]
                    })
                }), e.jsxs("div", {
                    className: "mt-12 flex items-center justify-between text-xs text-zinc-600",
                    children: [e.jsx("p", {
                        children: "© 2025 IsotopeAI"
                    }), e.jsxs("div", {
                        className: "flex gap-4",
                        children: [e.jsx("a", {
                            href: "/privacy",
                            className: "hover:text-zinc-400 transition-colors",
                            children: "Privacy"
                        }), e.jsx("a", {
                            href: "/terms",
                            className: "hover:text-zinc-400 transition-colors",
                            children: "Terms"
                        })]
                    })]
                })]
            }), e.jsxs("div", {
                className: "hidden lg:block flex-1 relative bg-zinc-900 p-[var(--density-page-x)]",
                children: [!t && e.jsx("div", {
                    className: "absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZUZpbHRlciI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2VGaWx0ZXIpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-40 mix-blend-overlay pointer-events-none"
                }), e.jsxs("div", {
                    className: "h-full w-full rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden relative",
                    children: [!t && e.jsxs("div", {
                        className: "absolute top-0 left-0 w-full h-full",
                        children: [e.jsx("div", {
                            className: "absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-zinc-800/30 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-10000"
                        }), e.jsx("div", {
                            className: "absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] mix-blend-screen"
                        })]
                    }), e.jsxs("div", {
                        className: "absolute inset-0 flex flex-col justify-between p-[calc(var(--density-page-x-lg)+1rem)] z-10",
                        children: [e.jsx("div", {
                            className: "flex justify-end",
                            children: e.jsx("div", {
                                className: "bg-black/30 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-xs font-medium text-white/80",
                                children: "IsotopeAI v2.0"
                            })
                        }), e.jsxs("div", {
                            className: "space-y-6 max-w-lg",
                            children: [e.jsxs("div", {
                                className: "space-y-2",
                                children: [e.jsx("div", {
                                    className: "w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/10",
                                    children: e.jsx(_, {
                                        className: "w-6 h-6 text-white"
                                    })
                                }), e.jsx("h2", {
                                    className: "text-3xl font-bold leading-tight",
                                    children: '"The best way to predict the future is to create it."'
                                }), e.jsx("p", {
                                    className: "text-zinc-400 text-lg",
                                    children: "Join thousands of students mastering their subjects with AI-powered personalized learning paths."
                                })]
                            }), e.jsxs("div", {
                                className: "flex items-center gap-4 pt-4",
                                children: [e.jsx("div", {
                                    className: "flex -space-x-3",
                                    children: [1, 2, 3, 4].map(l => e.jsx("div", {
                                        className: "w-10 h-10 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center overflow-hidden",
                                        children: e.jsx("img", {
                                            src: `https://api.dicebear.com/7.x/avataaars/svg?seed=${l*123}`,
                                            alt: "User",
                                            width: 40,
                                            height: 40,
                                            className: "w-full h-full",
                                            loading: "lazy",
                                            decoding: "async"
                                        })
                                    }, l))
                                }), e.jsxs("p", {
                                    className: "text-sm text-zinc-500",
                                    children: [e.jsx("span", {
                                        className: "text-white font-medium",
                                        children: "6,000+"
                                    }), " logged in users"]
                                })]
                            })]
                        })]
                    }), e.jsx("div", {
                        className: "absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] mask-image-[radial-gradient(ellipse_at_center,black,transparent)]"
                    })]
                })]
            })]
        })
    },
    Z = () => {
        const {
            shouldReduceMotion: a
        } = v(), [s, i] = g.useState(""), [t, n] = g.useState(""), [l, u] = g.useState(null), {
            signIn: j,
            signInWithGoogle: r,
            resetPassword: o,
            isLoading: c,
            error: x,
            clearError: d
        } = m(), b = z(), f = C(), p = async h => {
            h.preventDefault(), u(null), (await j(s, t)).success && setTimeout(() => {
                b("/dashboard", {
                    replace: !0
                })
            }, 100)
        }, N = async () => {
            if (u(null), !s) {
                m.setState({
                    error: "Enter your email first so we know where to send the reset link."
                });
                return
            }
            const h = await o(s);
            if (h.success) {
                d(), u("Password reset link sent. Check your inbox and spam folder.");
                return
            }
            m.setState({
                error: h.error || "Could not send the reset link. Please try again."
            })
        };
        return e.jsxs(y.div, {
            initial: a ? !1 : {
                opacity: 0
            },
            animate: {
                opacity: 1
            },
            exit: a ? void 0 : {
                opacity: 0
            },
            className: "space-y-6",
            children: [e.jsx(I, {
                children: x && e.jsx(E, {
                    message: x,
                    onDismiss: d
                })
            }), l && e.jsx("div", {
                className: "bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-sm text-emerald-400",
                children: l
            }), e.jsxs(G, {
                onClick: () => r(),
                disabled: c || !f,
                loading: c,
                children: [e.jsx(A, {}), "Continue with Google"]
            }), !f && e.jsx("p", {
                className: "text-xs text-zinc-500",
                children: "Google sign-in is unavailable until cloud auth is configured for this deployment."
            }), e.jsxs("div", {
                className: "relative",
                children: [e.jsx("div", {
                    className: "absolute inset-0 flex items-center",
                    children: e.jsx("span", {
                        className: "w-full border-t border-zinc-800"
                    })
                }), e.jsx("div", {
                    className: "relative flex justify-center text-xs uppercase",
                    children: e.jsx("span", {
                        className: "bg-black px-4 text-zinc-500 font-medium",
                        children: "Alternative login"
                    })
                })]
            }), e.jsxs("form", {
                onSubmit: p,
                className: "space-y-4",
                children: [e.jsx(w, {
                    type: "email",
                    label: "Email",
                    placeholder: "name@example.com",
                    value: s,
                    onChange: h => i(h.target.value),
                    disabled: c
                }), e.jsxs("div", {
                    className: "space-y-1.5",
                    children: [e.jsxs("div", {
                        className: "flex justify-between",
                        children: [e.jsx("label", {
                            className: "text-xs font-medium text-zinc-400 ml-1",
                            children: "Password"
                        }), e.jsx("button", {
                            type: "button",
                            onClick: () => void N(),
                            className: "text-xs text-zinc-500 hover:text-white transition-colors",
                            children: "Forgot password?"
                        })]
                    }), e.jsx(w, {
                        type: "password",
                        placeholder: "Enter your password",
                        value: t,
                        onChange: h => n(h.target.value),
                        disabled: c
                    })]
                }), e.jsx("div", {
                    className: "pt-2",
                    children: e.jsxs("button", {
                        type: "submit",
                        disabled: !s || !t || c,
                        className: "w-full bg-zinc-900 border border-zinc-800 text-white font-medium text-sm px-4 py-3 rounded-xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
                        children: [c ? e.jsx(k, {
                            className: "w-4 h-4 animate-spin"
                        }) : null, "Sign In with Email"]
                    })
                })]
            })]
        })
    },
    W = () => {
        const {
            shouldReduceMotion: a
        } = v(), [s, i] = g.useState(""), [t, n] = g.useState(""), [l, u] = g.useState(""), {
            signUp: j,
            signInWithGoogle: r,
            isLoading: o,
            error: c,
            clearError: x
        } = m(), d = z(), b = C(), f = async p => {
            if (p.preventDefault(), l.length < 6) {
                m.setState({
                    error: "Password must be at least 6 characters"
                });
                return
            }
            const N = M(t);
            if (N) {
                m.setState({
                    error: N
                });
                return
            }(await j(s, t, l)).success && d("/onboarding")
        };
        return e.jsxs(y.div, {
            initial: a ? !1 : {
                opacity: 0
            },
            animate: {
                opacity: 1
            },
            exit: a ? void 0 : {
                opacity: 0
            },
            className: "space-y-6",
            children: [e.jsx(I, {
                children: c && e.jsx(E, {
                    message: c,
                    onDismiss: x
                })
            }), e.jsxs(G, {
                onClick: () => r(),
                disabled: o || !b,
                loading: o,
                children: [e.jsx(A, {}), "Sign up with Google"]
            }), !b && e.jsx("p", {
                className: "text-xs text-zinc-500",
                children: "Google sign-up is unavailable until cloud auth is configured for this deployment."
            }), e.jsxs("div", {
                className: "relative",
                children: [e.jsx("div", {
                    className: "absolute inset-0 flex items-center",
                    children: e.jsx("span", {
                        className: "w-full border-t border-zinc-800"
                    })
                }), e.jsx("div", {
                    className: "relative flex justify-center text-xs uppercase",
                    children: e.jsx("span", {
                        className: "bg-black px-4 text-zinc-500 font-medium",
                        children: "Alternative signup"
                    })
                })]
            }), e.jsxs("form", {
                onSubmit: f,
                className: "space-y-4",
                children: [e.jsx(w, {
                    type: "text",
                    label: "Full Name",
                    placeholder: "What should we call you?",
                    value: s,
                    onChange: p => i(p.target.value),
                    disabled: o
                }), e.jsx(w, {
                    type: "email",
                    label: "Email",
                    placeholder: "name@example.com",
                    value: t,
                    onChange: p => n(p.target.value),
                    disabled: o
                }), e.jsx("p", {
                    className: "text-xs text-zinc-500",
                    children: "New signups are limited to mainstream inboxes like Gmail, Outlook, Yahoo, iCloud, and Proton Mail."
                }), e.jsx(w, {
                    type: "password",
                    label: "Password",
                    placeholder: "Create a password (min 6 chars)",
                    value: l,
                    onChange: p => u(p.target.value),
                    disabled: o
                }), e.jsx("div", {
                    className: "pt-2",
                    children: e.jsxs("button", {
                        type: "submit",
                        disabled: !s || !t || !l || o,
                        className: "w-full bg-zinc-900 border border-zinc-800 text-white font-medium text-sm px-4 py-3 rounded-xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
                        children: [o ? e.jsx(k, {
                            className: "w-4 h-4 animate-spin"
                        }) : null, "Create Account with Email"]
                    })
                })]
            })]
        })
    },
    $ = () => {
        const [a, s] = g.useState(!1), {
            clearError: i
        } = m(), t = C(), n = () => {
            i(), s(!a)
        };
        return e.jsxs(L, {
            isSignIn: a,
            toggle: n,
            children: [e.jsx(I, {
                mode: "wait",
                children: a ? e.jsx(Z, {}, "signin") : e.jsx(W, {}, "signup")
            }), t ? e.jsx(V, {}) : null]
        })
    };
export {
    $ as
    default
};