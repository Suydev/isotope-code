import {
    r as x,
    j as e
} from "./vendor-react-BfU3Zn2J.js";
import {
    u as m
} from "./Onboarding-qvAqCBbb.js";
import {
    O as h
} from "./OnboardingNavigation-C6kIq5HV.js";
import {
    a5 as p,
    bg as b,
    X as u
} from "./vendor-icons-CqruUz7g.js";
import {
    w as g,
    S as d,
    x as f
} from "./App-pJGjDiPw.js";
import "./index-BPYJFSVW.js";
import "./useFocusStore-CX_Nyp1h.js";
import "./useNotificationStore-BS4df28T.js";
import "./vendor-router-CmoTwRnm.js";
import "./vendor-supabase-DAiUAuun.js";
import "./vendor-motion-Cp_NPzpZ.js";
const v = ({
        value: t,
        onChange: a,
        presetAvatars: c
    }) => {
        const i = x.useRef(null),
            n = s => {
                const r = s.target.files ?.[0];
                if (r) {
                    const o = new FileReader;
                    o.onloadend = () => {
                        const l = typeof o.result == "string" ? o.result : void 0;
                        l && a(l)
                    }, o.readAsDataURL(r)
                }
                s.target.value = ""
            };
        return e.jsxs("div", {
            className: "space-y-4",
            children: [e.jsx("div", {
                className: "flex justify-center",
                children: e.jsxs("div", {
                    className: "relative",
                    children: [e.jsx("div", {
                        className: "w-28 h-28 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800",
                        children: t ? e.jsx("img", {
                            src: t,
                            alt: "Avatar",
                            className: "w-full h-full object-cover"
                        }) : e.jsx("div", {
                            className: "w-full h-full flex items-center justify-center text-zinc-400",
                            children: e.jsx(p, {
                                size: 32,
                                strokeWidth: 1.5
                            })
                        })
                    }), e.jsx("button", {
                        type: "button",
                        "aria-label": "Upload avatar",
                        onClick: () => i.current ?.click(),
                        className: "absolute bottom-0 right-0 p-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full shadow-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors",
                        children: e.jsx(b, {
                            size: 14
                        })
                    }), t ? e.jsx("button", {
                        type: "button",
                        "aria-label": "Remove avatar",
                        onClick: () => a(void 0),
                        className: "absolute -top-1 -right-1 p-1.5 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-300 rounded-full shadow-md border border-zinc-200 dark:border-zinc-700 hover:text-red-500 transition-colors",
                        children: e.jsx(u, {
                            size: 12
                        })
                    }) : null, e.jsx("input", {
                        ref: i,
                        type: "file",
                        accept: "image/*",
                        className: "hidden",
                        onChange: n
                    })]
                })
            }), e.jsx("div", {
                className: "grid grid-cols-5 gap-3 justify-items-center",
                children: c.map((s, r) => e.jsx("button", {
                    type: "button",
                    onClick: () => a(s),
                    className: `w-10 h-10 rounded-full overflow-hidden border-2 transition-all
              ${t===s?"border-brand-500 ring-2 ring-brand-500/20":"border-transparent hover:border-zinc-300 dark:hover:border-zinc-600 opacity-60 hover:opacity-100"}
            `,
                    children: e.jsx("img", {
                        src: s,
                        alt: `Preset ${r+1}`,
                        className: "w-full h-full object-cover"
                    })
                }, r))
            })]
        })
    },
    j = ["https://api.dicebear.com/7.x/notionists/svg?seed=Alex", "https://api.dicebear.com/7.x/notionists/svg?seed=Sarah", "https://api.dicebear.com/7.x/notionists/svg?seed=Mike", "https://api.dicebear.com/7.x/notionists/svg?seed=Lisa", "https://api.dicebear.com/7.x/notionists/svg?seed=John", "https://api.dicebear.com/7.x/notionists/svg?seed=Anna", "https://api.dicebear.com/7.x/notionists/svg?seed=David", "https://api.dicebear.com/7.x/notionists/svg?seed=Sophia", "https://api.dicebear.com/7.x/notionists/svg?seed=Chris", "https://api.dicebear.com/7.x/notionists/svg?seed=Emily"],
    I = () => {
        const {
            formData: t,
            updateFormData: a,
            nextStep: c
        } = m(), i = t.username.length >= 2, n = g(t.bio || "", "bio");
        return e.jsxs("div", {
            className: "space-y-6",
            children: [e.jsxs("div", {
                className: "text-center mb-8",
                children: [e.jsx("h1", {
                    className: "text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2",
                    children: "Welcome to Isotope"
                }), e.jsx("p", {
                    className: "text-zinc-500 dark:text-zinc-400",
                    children: "Let's set up your personal profile."
                })]
            }), e.jsxs("div", {
                className: "space-y-6",
                children: [e.jsxs("div", {
                    className: "flex flex-col items-center",
                    children: [e.jsx("span", {
                        className: "text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-4",
                        children: "Choose an avatar"
                    }), e.jsx(v, {
                        value: t.avatar,
                        onChange: s => a({
                            avatar: s
                        }),
                        presetAvatars: j
                    })]
                }), e.jsxs("div", {
                    className: "space-y-4",
                    children: [e.jsxs("div", {
                        className: "space-y-1.5",
                        children: [e.jsx("label", {
                            className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
                            children: "What should we call you?"
                        }), e.jsx("input", {
                            type: "text",
                            value: t.username,
                            onChange: s => a({
                                username: s.target.value
                            }),
                            placeholder: "e.g., Alex",
                            maxLength: d.username.maxChars,
                            className: "w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all placeholder-zinc-400"
                        }), t.username.length > 0 && t.username.length < 2 && e.jsx("p", {
                            className: "text-xs text-red-500",
                            children: "Username must be at least 2 characters"
                        })]
                    }), e.jsxs("div", {
                        className: "space-y-1.5",
                        children: [e.jsx("label", {
                            className: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
                            children: "Bio (optional)"
                        }), e.jsx("textarea", {
                            value: t.bio || "",
                            onChange: s => a({
                                bio: s.target.value
                            }),
                            placeholder: "I'm preparing for JEE...",
                            rows: 3,
                            className: "w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all resize-none placeholder-zinc-400"
                        }), e.jsxs("p", {
                            className: "text-xs text-zinc-400 text-right",
                            children: [t.bio ?.length || 0, "/", d.bio.maxChars]
                        }), e.jsx("p", {
                            className: `text-xs ${n?.tone==="danger"?"text-amber-500":"text-zinc-400"}`,
                            children: n ?.message || `First ${f("bio","cloud")} characters sync to cloud.`
                        })]
                    })]
                })]
            }), e.jsx(h, {
                onNext: c,
                onBack: () => {},
                isFirstStep: !0,
                isLastStep: !1,
                canContinue: i
            })]
        })
    };
export {
    I as Step1Identity
};