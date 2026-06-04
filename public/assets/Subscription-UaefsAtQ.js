import {
    j as e,
    r as x
} from "./vendor-react-BfU3Zn2J.js";
import {
    S as X,
    D as K
} from "./DashboardHeader-DNuRMna8.js";
import {
    u as G,
    j as A,
    i as R,
    s as p
} from "./App-pJGjDiPw.js";
import {
    m as y,
    A as V
} from "./vendor-motion-Cp_NPzpZ.js";
import {
    i as D,
    bH as ee,
    U as te,
    y as se,
    x as re,
    z as ae,
    Z as W,
    aZ as T,
    R as H,
    w as ie,
    d as M,
    a1 as ne,
    X as le,
    r as ce,
    s as oe,
    bI as L
} from "./vendor-icons-CqruUz7g.js";
import {
    g as B,
    i as U
} from "./useAIStore-B2cv1FZz.js";
import {
    F as de
} from "./vendor-supabase-DAiUAuun.js";
import {
    u as ue
} from "./useOnlineStatus-BJOTUERN.js";
import {
    u as me
} from "./useSupportModalStore-BkYsnKtG.js";
import "./HeadwayUpdatesButton-DUh668tJ.js";
import "./useFocusStore-CX_Nyp1h.js";
import "./index-BPYJFSVW.js";
import "./useNotificationStore-BS4df28T.js";
import "./timeFormat-CMPo-BX2.js";
import "./MarkdownRenderer-CIV1x0Uq.js";
import "./vendor-router-CmoTwRnm.js";
import "./useSyncStore-vWs_TdIc.js";
import "./IsotopeLogoIcon-oPk5Ru-_.js";
const w = l => l ? new Date(l).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    }) : "No expiry",
    O = ({
        planType: l,
        planExpiresAt: r,
        accessSource: t,
        billingStatus: s,
        cancelAtPeriodEnd: a
    }) => s === "grandfathered" ? {
        badge: "Grandfathered",
        summary: "Your Scholar access is grandfathered. It stays active unless you explicitly change plans."
    } : s === "gifted" || t === "gift_code" ? {
        badge: "Gifted Access",
        summary: `Your gifted ${l} access stays active until ${w(r)}.`
    } : s === "on_hold" ? {
        badge: "Action Needed",
        summary: `Autopay needs attention. Your current access stays active until ${w(r)} unless the subscription expires earlier.`
    } : s === "scheduled_cancel" || a ? {
        badge: "Ends This Cycle",
        summary: `Your plan stays active until ${w(r)}, then it will stop renewing.`
    } : s === "expired" ? {
        badge: "Expired",
        summary: `Your last paid access ended on ${w(r)}.`
    } : l === "free" ? {
        badge: "Free Tier",
        summary: "Upgrade for community access, cloud sync, premium roles, and billing self-serve."
    } : {
        badge: "Active",
        summary: `Your ${l} plan renews on ${w(r)}.`
    },
    xe = ({
        onUpgrade: l,
        onManageBilling: r,
        onRedeemCode: t,
        isUpgrading: s,
        isManagingBilling: a,
        isRedeemingCode: n,
        isOnline: c,
        giftCode: f,
        onGiftCodeChange: h
    }) => {
        const {
            planType: i,
            planExpiresAt: b,
            accessSource: u,
            billingStatus: j,
            cancelAtPeriodEnd: S,
            portalEligible: g,
            isPremium: k
        } = G(), v = k(), N = g || v, C = O({
            planType: i,
            planExpiresAt: b,
            accessSource: u,
            billingStatus: j,
            cancelAtPeriodEnd: S
        }), P = m => {
            switch (m) {
                case "scholar":
                    return e.jsx(W, {
                        className: "w-8 h-8 text-amber-500"
                    });
                case "ranker":
                    return e.jsx(H, {
                        className: "w-8 h-8 text-white"
                    });
                default:
                    return e.jsx(ie, {
                        className: "w-8 h-8 text-zinc-500"
                    })
            }
        }, z = m => {
            switch (m) {
                case "scholar":
                    return "Scholar";
                case "ranker":
                    return "Ranker";
                default:
                    return "Aspirant"
            }
        }, _ = () => {
            window.location.href = "mailto:isotopeai@icloud.com?subject=Billing%20Help"
        };
        return e.jsxs("div", {
            className: "space-y-8",
            children: [e.jsxs(y.div, {
                initial: {
                    opacity: 0,
                    y: 20
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                className: "relative overflow-hidden p-8 rounded-3xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-xl",
                children: [e.jsxs("div", {
                    className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-6",
                    children: [e.jsxs("div", {
                        className: "flex items-center gap-6",
                        children: [e.jsx("div", {
                            className: `p-4 rounded-2xl ${i==="scholar"?"bg-gradient-to-br from-amber-500/20 to-orange-500/20 ring-1 ring-amber-500/30":i==="ranker"?"bg-gradient-to-br from-zinc-500/20 to-white/20 ring-1 ring-white/30":"bg-zinc-100 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10"}`,
                            children: P(i)
                        }), e.jsxs("div", {
                            children: [e.jsxs("div", {
                                className: "flex items-center gap-3 mb-1",
                                children: [e.jsxs("h2", {
                                    className: "text-2xl font-display font-bold text-zinc-900 dark:text-white",
                                    children: [z(i), " Plan"]
                                }), e.jsx("div", {
                                    className: `px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${i==="scholar"?"bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20":i==="ranker"?"bg-white/10 text-white border border-white/20":"bg-zinc-200 dark:bg-white/10 text-zinc-600 dark:text-zinc-400"}`,
                                    children: C.badge
                                })]
                            }), e.jsx("p", {
                                className: "max-w-2xl text-zinc-500 dark:text-zinc-400",
                                children: C.summary
                            })]
                        })]
                    }), N && e.jsxs("div", {
                        className: "flex flex-wrap items-center gap-3",
                        children: [e.jsxs("button", {
                            disabled: !c || !g || a,
                            onClick: r,
                            className: "px-4 py-2 rounded-xl text-sm font-bold bg-zinc-900 dark:bg-white text-white dark:text-black transition-opacity disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2",
                            children: [a ? e.jsx(D, {
                                className: "w-4 h-4 animate-spin"
                            }) : null, g ? "Manage Billing" : "Portal Unavailable"]
                        }), e.jsx("button", {
                            onClick: _,
                            disabled: !c,
                            title: c ? "Questions about billing, grandfathering, or gifted access" : "Billing actions are unavailable offline",
                            className: "px-4 py-2 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                            children: c ? "Billing Help" : "Billing Offline"
                        })]
                    })]
                }), v && e.jsxs("div", {
                    className: "mt-8 pt-8 border-t border-zinc-200 dark:border-white/10",
                    children: [e.jsx("h3", {
                        className: "text-sm font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-wider opacity-70",
                        children: "Active Features"
                    }), e.jsxs("div", {
                        className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-white/5",
                            children: [e.jsx(ee, {
                                className: "w-5 h-5 text-emerald-500"
                            }), e.jsx("span", {
                                className: "font-medium text-zinc-700 dark:text-zinc-300",
                                children: "Cloud Sync Active"
                            })]
                        }), e.jsxs("div", {
                            className: "flex items-center gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-white/5",
                            children: [e.jsx(te, {
                                className: "w-5 h-5 text-emerald-500"
                            }), e.jsx("span", {
                                className: "font-medium text-zinc-700 dark:text-zinc-300",
                                children: i === "ranker" ? "Special WhatsApp Group" : "Scholar WhatsApp Group"
                            })]
                        }), e.jsxs("div", {
                            className: "flex items-center gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-white/5",
                            children: [i === "ranker" ? e.jsx(se, {
                                className: "w-5 h-5 text-emerald-500"
                            }) : e.jsx(re, {
                                className: "w-5 h-5 text-emerald-500"
                            }), e.jsx("span", {
                                className: "font-medium text-zinc-700 dark:text-zinc-300",
                                children: i === "ranker" ? "Ranker Discord Role" : "Scholar Discord Role"
                            })]
                        })]
                    })]
                })]
            }), e.jsx(y.div, {
                initial: {
                    opacity: 0,
                    y: 20
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                transition: {
                    delay: .05
                },
                className: "p-6 rounded-3xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm",
                children: e.jsxs("div", {
                    className: "flex flex-col md:flex-row md:items-center md:justify-between gap-5",
                    children: [e.jsxs("div", {
                        className: "max-w-2xl",
                        children: [e.jsxs("div", {
                            className: "flex items-center gap-3 mb-2",
                            children: [e.jsx("div", {
                                className: "p-2 rounded-xl bg-emerald-500/10",
                                children: e.jsx(ae, {
                                    className: "w-5 h-5 text-emerald-500"
                                })
                            }), e.jsx("h3", {
                                className: "text-lg font-bold text-zinc-900 dark:text-white",
                                children: "Redeem gifted Scholar access"
                            })]
                        }), e.jsx("p", {
                            className: "text-sm text-zinc-500 dark:text-zinc-400",
                            children: "Redeem first-party membership codes here. If you already have finite premium access, we will schedule the gift to start after your current access ends."
                        }), (j === "gifted" || u === "gift_code") && b && e.jsxs("p", {
                            className: "mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400",
                            children: ["Current gifted access ends on ", w(b), "."]
                        })]
                    }), e.jsxs("div", {
                        className: "w-full md:max-w-md space-y-3",
                        children: [e.jsx("input", {
                            type: "text",
                            value: f,
                            onChange: m => h(m.target.value.toUpperCase()),
                            placeholder: "Enter gifted membership code",
                            autoComplete: "off",
                            className: "w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm text-zinc-900 dark:text-white"
                        }), e.jsxs("div", {
                            className: "flex flex-wrap gap-3",
                            children: [e.jsxs("button", {
                                type: "button",
                                onClick: t,
                                disabled: !c || n || f.trim().length === 0,
                                className: "px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2",
                                children: [n ? e.jsx(D, {
                                    className: "w-4 h-4 animate-spin"
                                }) : null, "Redeem Code"]
                            }), e.jsx("p", {
                                className: "text-xs text-zinc-500 dark:text-zinc-400 self-center",
                                children: "Dodo checkout discount codes belong in the upgrade dialog instead."
                            })]
                        })]
                    })]
                })
            }), i !== "ranker" && e.jsxs("div", {
                className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                children: [i === "free" && e.jsxs(y.div, {
                    initial: {
                        opacity: 0,
                        y: 20
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    transition: {
                        delay: .1
                    },
                    className: "relative overflow-hidden p-1 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600",
                    children: [e.jsx("div", {
                        className: "absolute top-0 right-0 p-32 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
                    }), e.jsx("div", {
                        className: "relative h-full bg-[#f4f4f5] dark:bg-[#09090b] rounded-[22px] overflow-hidden",
                        children: e.jsxs("div", {
                            className: "p-8",
                            children: [e.jsxs("div", {
                                className: "flex items-center justify-between mb-4",
                                children: [e.jsx("div", {
                                    className: "p-3 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10",
                                    children: e.jsx(W, {
                                        className: "w-6 h-6 text-amber-500"
                                    })
                                }), e.jsx("span", {
                                    className: "px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold uppercase tracking-wider",
                                    children: "Most Popular"
                                })]
                            }), e.jsx("h3", {
                                className: "text-2xl font-bold text-zinc-900 dark:text-white mb-2",
                                children: "Scholar"
                            }), e.jsxs("div", {
                                className: "flex items-baseline gap-1 mb-6",
                                children: [e.jsx("span", {
                                    className: "text-4xl font-bold text-zinc-900 dark:text-white",
                                    children: "₹55"
                                }), e.jsx("span", {
                                    className: "text-zinc-500 font-medium",
                                    children: "/ month"
                                })]
                            }), e.jsxs("div", {
                                className: "space-y-4 mb-8",
                                children: [e.jsx(d, {
                                    text: "Cloud Sync & Backup"
                                }), e.jsx(d, {
                                    text: "Scholar WhatsApp Group"
                                }), e.jsx(d, {
                                    text: "Scholar Discord Role"
                                }), e.jsx(d, {
                                    text: "Cross-device access"
                                }), e.jsx(d, {
                                    text: "Scholar Gold Badge"
                                }), e.jsx(d, {
                                    text: "Priority support"
                                })]
                            }), e.jsx("button", {
                                onClick: () => l("scholar"),
                                disabled: s || !c,
                                className: "w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
                                children: s ? e.jsxs(e.Fragment, {
                                    children: [e.jsx(D, {
                                        className: "w-4 h-4 animate-spin"
                                    }), "Processing..."]
                                }) : c ? e.jsxs(e.Fragment, {
                                    children: ["Upgrade to Scholar", e.jsx(T, {
                                        className: "w-4 h-4"
                                    })]
                                }) : "Unavailable Offline"
                            })]
                        })
                    })]
                }), e.jsx(y.div, {
                    initial: {
                        opacity: 0,
                        y: 20
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    transition: {
                        delay: .2
                    },
                    className: `relative overflow-hidden p-1 rounded-3xl ${i==="scholar"?"md:col-span-2":""} bg-gradient-to-br from-zinc-700 to-zinc-900 bg-opacity-50`,
                    children: e.jsx("div", {
                        className: "relative h-full bg-[#f4f4f5] dark:bg-[#09090b] rounded-[22px] overflow-hidden",
                        children: e.jsxs("div", {
                            className: "p-8",
                            children: [e.jsxs("div", {
                                className: "flex items-center justify-between mb-4",
                                children: [e.jsx("div", {
                                    className: "p-3 rounded-xl bg-zinc-100 dark:bg-white/10",
                                    children: e.jsx(H, {
                                        className: "w-6 h-6 text-zinc-900 dark:text-white"
                                    })
                                }), e.jsx("span", {
                                    className: "px-3 py-1 rounded-full bg-zinc-200 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider",
                                    children: "Premium Circle"
                                })]
                            }), e.jsx("h3", {
                                className: "text-2xl font-bold text-zinc-900 dark:text-white mb-2",
                                children: "Ranker"
                            }), e.jsxs("div", {
                                className: "flex items-baseline gap-1 mb-6",
                                children: [e.jsx("span", {
                                    className: "text-4xl font-bold text-zinc-900 dark:text-white",
                                    children: "₹105"
                                }), e.jsx("span", {
                                    className: "text-zinc-500 font-medium",
                                    children: "/ month"
                                })]
                            }), e.jsxs("div", {
                                className: `space-y-4 mb-8 ${i==="scholar"?"grid md:grid-cols-2 gap-4 space-y-0":""}`,
                                children: [e.jsx(d, {
                                    text: "Everything in Scholar"
                                }), e.jsx(d, {
                                    text: "Special Ranker WhatsApp Group"
                                }), e.jsx(d, {
                                    text: "Ranker Discord Role"
                                }), e.jsx(d, {
                                    text: "Top-priority support"
                                }), e.jsx(d, {
                                    text: "Ranker Diamond Badge"
                                }), e.jsx(d, {
                                    text: "3 free monthly JEE/NEET mentorship sessions coming soon"
                                })]
                            }), e.jsx("button", {
                                onClick: () => l("ranker"),
                                disabled: s || !c,
                                className: "w-full py-4 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
                                children: s ? e.jsxs(e.Fragment, {
                                    children: [e.jsx(D, {
                                        className: "w-4 h-4 animate-spin"
                                    }), "Processing..."]
                                }) : c ? e.jsxs(e.Fragment, {
                                    children: ["Upgrade to Ranker", e.jsx(T, {
                                        className: "w-4 h-4"
                                    })]
                                }) : "Unavailable Offline"
                            })]
                        })
                    })
                })]
            })]
        })
    },
    d = ({
        text: l
    }) => e.jsxs("div", {
        className: "flex items-center gap-3",
        children: [e.jsx("div", {
            className: "flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center",
            children: e.jsx(M, {
                className: "w-3 h-3 text-emerald-500"
            })
        }), e.jsx("span", {
            className: "text-zinc-600 dark:text-zinc-300 font-medium",
            children: l
        })]
    }),
    he = ({
        isOnline: l,
        onOpenPortal: r,
        isOpeningPortal: t
    }) => {
        const {
            isPremium: s,
            planType: a,
            planExpiresAt: n,
            accessSource: c,
            billingStatus: f,
            cancelAtPeriodEnd: h,
            portalEligible: i
        } = G();
        if (!s() && !i) return null;
        const b = O({
            planType: a,
            planExpiresAt: n,
            accessSource: c,
            billingStatus: f,
            cancelAtPeriodEnd: h
        });
        return e.jsxs("div", {
            className: "p-6 rounded-3xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm mt-8",
            children: [e.jsx("div", {
                className: "flex items-center justify-between mb-6",
                children: e.jsxs("div", {
                    className: "flex items-center gap-3",
                    children: [e.jsx("div", {
                        className: "p-2 rounded-lg bg-zinc-100 dark:bg-white/10",
                        children: e.jsx(ne, {
                            className: "w-5 h-5 text-zinc-900 dark:text-white"
                        })
                    }), e.jsx("h3", {
                        className: "text-lg font-bold text-zinc-900 dark:text-white",
                        children: "Invoice History"
                    })]
                })
            }), e.jsxs("div", {
                className: "rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 p-5",
                children: [e.jsx("p", {
                    className: "text-sm text-zinc-600 dark:text-zinc-300",
                    children: b.summary
                }), e.jsx("p", {
                    className: "mt-2 text-xs text-zinc-500 dark:text-zinc-400",
                    children: "Dodo Payments hosts invoice PDFs, payment methods, and renewal controls in the customer portal."
                }), e.jsxs("div", {
                    className: "mt-5 flex flex-wrap items-center gap-3",
                    children: [e.jsxs("button", {
                        type: "button",
                        onClick: () => {
                            if (!l) {
                                alert(B("Invoice access"));
                                return
                            }
                            r()
                        },
                        disabled: !l || !i || t,
                        title: l ? i ? "Open Dodo billing portal" : "Billing portal becomes available after your first Dodo billing profile is created" : "Invoice access is unavailable offline",
                        className: "inline-flex items-center gap-2 rounded-xl bg-zinc-900 dark:bg-white px-4 py-2.5 text-sm font-bold text-white dark:text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50",
                        children: [e.jsx(T, {
                            className: "w-4 h-4"
                        }), i ? "Open Billing Portal" : "Portal Not Ready"]
                    }), !l && e.jsx("span", {
                        className: "text-xs text-zinc-500 dark:text-zinc-400",
                        children: "Reconnect to view invoices."
                    })]
                })]
            }), e.jsx("div", {
                className: "mt-4 text-center",
                children: e.jsx("p", {
                    className: "text-xs text-zinc-500 dark:text-zinc-400",
                    children: "Invoice history is managed by DodoPayments."
                })
            })]
        })
    },
    pe = ({
        isOpen: l,
        onClose: r,
        onConfirm: t,
        targetPlan: s,
        isLoading: a
    }) => e.jsx(V, {
        children: l && e.jsxs(e.Fragment, {
            children: [e.jsx(y.div, {
                initial: {
                    opacity: 0
                },
                animate: {
                    opacity: 1
                },
                exit: {
                    opacity: 0
                },
                onClick: r,
                className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            }), e.jsx(y.div, {
                initial: {
                    opacity: 0,
                    scale: .95,
                    y: 20
                },
                animate: {
                    opacity: 1,
                    scale: 1,
                    y: 0
                },
                exit: {
                    opacity: 0,
                    scale: .95,
                    y: 20
                },
                className: "fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none",
                children: e.jsx("div", {
                    className: "bg-white dark:bg-[#0e0e11] rounded-3xl shadow-2xl w-full max-w-md pointer-events-auto border border-zinc-200 dark:border-white/10 overflow-hidden",
                    onClick: n => n.stopPropagation(),
                    children: e.jsxs("div", {
                        className: "p-6",
                        children: [e.jsxs("div", {
                            className: "flex items-center justify-between mb-6",
                            children: [e.jsx("h3", {
                                className: "text-xl font-bold font-display text-zinc-900 dark:text-white",
                                children: "Confirm Upgrade"
                            }), e.jsx("button", {
                                onClick: r,
                                className: "p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-full transition-colors",
                                children: e.jsx(le, {
                                    className: "w-5 h-5 text-zinc-400"
                                })
                            })]
                        }), e.jsxs("div", {
                            className: "mb-8",
                            children: [e.jsxs("p", {
                                className: "text-zinc-600 dark:text-zinc-300 mb-4",
                                children: ["You are updating to the", " ", e.jsxs("span", {
                                    className: "font-bold text-zinc-900 dark:text-white capitalize",
                                    children: [s, " Plan"]
                                }), "."]
                            }), e.jsxs("div", {
                                className: "p-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 space-y-3",
                                children: [e.jsxs("div", {
                                    className: "flex justify-between items-center text-sm",
                                    children: [e.jsx("span", {
                                        className: "text-zinc-500",
                                        children: "New Plan"
                                    }), e.jsx("span", {
                                        className: "font-bold text-zinc-900 dark:text-white capitalize",
                                        children: s
                                    })]
                                }), e.jsxs("div", {
                                    className: "flex justify-between items-center text-sm",
                                    children: [e.jsx("span", {
                                        className: "text-zinc-500",
                                        children: "Total Due"
                                    }), e.jsx("span", {
                                        className: "font-bold text-zinc-900 dark:text-white",
                                        children: s === "scholar" ? "₹55/mo" : "₹105/mo"
                                    })]
                                })]
                            })]
                        }), e.jsxs("div", {
                            className: "flex gap-3",
                            children: [e.jsx("button", {
                                onClick: r,
                                className: "flex-1 py-3 rounded-xl font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors",
                                children: "Cancel"
                            }), e.jsxs("button", {
                                onClick: t,
                                disabled: a,
                                className: "flex-1 py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2",
                                children: [a ? "Processing..." : "Proceed to Payment", !a && e.jsx(ce, {
                                    className: "w-4 h-4"
                                })]
                            })]
                        })]
                    })
                })
            })]
        })
    });
class fe {
    async extractFunctionError(r, t) {
        if (r instanceof de) try {
            const s = await r.context.json();
            return s ?.error || s ?.details || r.message || t
        } catch {
            return r.message || t
        }
        return r instanceof Error && r.message || t
    }
    async createCheckoutSession(r, t, s) {
        if (A()) return {
            success: !1,
            error: "Checkout is disabled in the public demo. You are previewing the Ranker plan with mock data."
        };
        if (!U()) return {
            success: !1,
            error: B("Billing and checkout")
        };
        if (!R() || !p) return {
            success: !1,
            error: "Supabase not configured"
        };
        try {
            const {
                data: a,
                error: n
            } = await p.functions.invoke("create_checkout", {
                body: {
                    plan_type: s.planType,
                    billing_cycle: s.billingCycle || "monthly",
                    user_id: r,
                    email: t,
                    success_url: s.successUrl || `${window.location.origin}/subscription?payment=success`,
                    cancel_url: s.cancelUrl || `${window.location.origin}/subscription?payment=cancelled`,
                    discount_code: s.discountCode ?.trim() || void 0
                }
            });
            return n ? {
                success: !1,
                error: await this.extractFunctionError(n, "Failed to create checkout")
            } : a ?.checkout_url ? {
                success: !0,
                checkoutUrl: a.checkout_url
            } : {
                success: !1,
                error: "No checkout URL returned"
            }
        } catch (a) {
            return {
                success: !1,
                error: a instanceof Error ? a.message : "Unknown error"
            }
        }
    }
    async redirectToCheckout(r, t, s) {
        const a = await this.createCheckoutSession(r, t, s);
        return a.success && a.checkoutUrl && (window.location.href = a.checkoutUrl), a
    }
    async createCustomerPortalSession(r) {
        if (A()) return {
            success: !1,
            error: "Billing portal is disabled in the public demo."
        };
        if (!U()) return {
            success: !1,
            error: B("Billing portal")
        };
        if (!R() || !p) return {
            success: !1,
            error: "Supabase not configured"
        };
        try {
            const {
                data: t,
                error: s
            } = await p.functions.invoke("create_customer_portal_session", {
                body: {
                    user_id: r,
                    return_url: `${window.location.origin}/subscription?portal=return`
                }
            });
            return s ? {
                success: !1,
                error: await this.extractFunctionError(s, "Failed to open billing portal")
            } : t ?.portal_url ? {
                success: !0,
                checkoutUrl: t.portal_url
            } : {
                success: !1,
                error: "No billing portal URL returned"
            }
        } catch (t) {
            return {
                success: !1,
                error: t instanceof Error ? t.message : "Unknown error"
            }
        }
    }
    async redirectToCustomerPortal(r) {
        const t = await this.createCustomerPortalSession(r);
        return t.success && t.checkoutUrl && (window.location.href = t.checkoutUrl), t
    }
    async getMembershipSnapshot(r) {
        if (A()) return {
            effectivePlan: "ranker",
            accessSource: "manual",
            accessEndsAt: null,
            billingStatus: "gifted",
            cancelAtPeriodEnd: !1,
            portalEligible: !1,
            dodoCustomerId: null,
            dodoSubscriptionId: null
        };
        if (!U() || !R() || !p) return null;
        try {
            const {
                data: t,
                error: s
            } = await p.rpc("get_membership_snapshot", {
                target_user_id: r
            });
            if (s) return null;
            const a = Array.isArray(t) ? t[0] : t;
            return a ? {
                effectivePlan: a.effective_plan || "free",
                accessSource: a.access_source || "free",
                accessEndsAt: a.access_ends_at || null,
                billingStatus: a.billing_status || "free",
                cancelAtPeriodEnd: a.cancel_at_period_end || !1,
                portalEligible: a.portal_eligible || !1,
                dodoCustomerId: a.dodo_customer_id || null,
                dodoSubscriptionId: a.dodo_subscription_id || null
            } : null
        } catch {
            return null
        }
    }
    async getSubscriptionStatus(r) {
        const t = await this.getMembershipSnapshot(r);
        if (!t) return null;
        const s = t.effectivePlan !== "free" && (!t.accessEndsAt || new Date(t.accessEndsAt) > new Date);
        return {
            planType: t.effectivePlan,
            planExpiresAt: t.accessEndsAt,
            isActive: s,
            billingStatus: t.billingStatus,
            accessSource: t.accessSource,
            cancelAtPeriodEnd: t.cancelAtPeriodEnd
        }
    }
    async checkAndRefreshPlanStatus(r) {
        const t = await this.getSubscriptionStatus(r);
        return !t || !t.isActive && t.planType !== "free" ? "free" : t.planType
    }
    async redeemMembershipCode(r, t) {
        if (A()) return {
            success: !1,
            error: "Membership code redemption is disabled in the public demo."
        };
        if (!U()) return {
            success: !1,
            error: B("Membership code redemption")
        };
        if (!R() || !p) return {
            success: !1,
            error: "Supabase not configured"
        };
        try {
            const {
                data: s,
                error: a
            } = await p.functions.invoke("redeem_membership_code", {
                body: {
                    user_id: r,
                    code: t
                }
            });
            if (a) return {
                success: !1,
                error: await this.extractFunctionError(a, "Failed to redeem code")
            };
            const n = s ?.snapshot;
            return n ? {
                success: !0,
                snapshot: {
                    effectivePlan: n.effective_plan || "free",
                    accessSource: n.access_source || "free",
                    accessEndsAt: n.access_ends_at || null,
                    billingStatus: n.billing_status || "free",
                    cancelAtPeriodEnd: n.cancel_at_period_end || !1,
                    portalEligible: n.portal_eligible || !1,
                    dodoCustomerId: n.dodo_customer_id || null,
                    dodoSubscriptionId: n.dodo_subscription_id || null
                }
            } : {
                success: !1,
                error: "Membership code redemption did not return a snapshot"
            }
        } catch (s) {
            return {
                success: !1,
                error: s instanceof Error ? s.message : "Unknown error"
            }
        }
    }
    getPlanDisplayInfo(r) {
        const t = {
            free: {
                name: "Aspirant",
                description: "Everything you need to study, track, and stay accountable.",
                color: "zinc",
                icon: "Star",
                features: ["FREE access to all features", "Discord Server Access", "Daily Goals & Streaks", "Advanced Analytics", "Premium community access locked to paid tiers"]
            },
            scholar: {
                name: "Scholar",
                description: "For students who want a tighter community and better accountability.",
                price: "₹55",
                period: "monthly",
                color: "amber",
                icon: "Zap",
                features: ["Everything in Aspirant", "Scholar Gold Badge", "Scholar Discord Role", "Scholar WhatsApp Group", "Cloud Sync", "Priority Support"]
            },
            ranker: {
                name: "Ranker",
                description: "For the top 1% obsessed with winning.",
                price: "₹105",
                period: "monthly",
                color: "platinum",
                icon: "Rocket",
                features: ["Everything in Scholar", "Special Ranker Diamond Badge", "Ranker Discord Role", "Special Ranker WhatsApp Group", "Top-priority Support", "3 free monthly JEE/NEET mentorship slots coming soon"]
            }
        };
        return t[r] || t.free
    }
}
const I = new fe,
    Be = ({
        isDark: l,
        toggleTheme: r
    }) => {
        const [t, s] = x.useState("Settings"), [a, n] = x.useState(!1), {
            userId: c,
            email: f,
            refreshPlanStatus: h
        } = G(), {
            isOnline: i
        } = ue(), [b, u] = x.useState(!1), [j, S] = x.useState("scholar"), [g, k] = x.useState(!1), [v, N] = x.useState(!1), [C, P] = x.useState(!1), [z, _] = x.useState(""), [m, E] = x.useState("idle");
        x.useEffect(() => {
            const o = new URLSearchParams(window.location.search),
                $ = o.get("payment"),
                F = o.get("upgrade"),
                Q = o.get("portal");
            $ === "success" ? (E("success"), h(), window.history.replaceState({}, "", window.location.pathname)) : $ === "cancelled" ? (E("cancelled"), window.history.replaceState({}, "", window.location.pathname)) : Q === "return" ? (E("portal"), h(), window.history.replaceState({}, "", window.location.pathname)) : (F === "scholar" || F === "ranker") && (S(F), u(!0))
        }, [h]);
        const Z = o => {
                if (!i) {
                    alert("Billing and checkout require an internet connection. You can keep using the rest of the app offline.");
                    return
                }
                S(o), u(!0)
            },
            q = async () => {
                if (!i) {
                    alert("You need an internet connection for billing and checkout. You can keep using the rest of the app offline."), u(!1);
                    return
                }
                if (!c || c.startsWith("local-")) {
                    alert("Please log in with a cloud account to upgrade."), u(!1);
                    return
                }
                if (!f) {
                    alert("Email not found. Please update your profile."), u(!1);
                    return
                }
                k(!0);
                try {
                    const o = await I.redirectToCheckout(c, f, {
                        planType: j,
                        billingCycle: "monthly"
                    });
                    o.success || (alert(o.error || "Failed to start checkout."), k(!1), u(!1))
                } catch (o) {
                    console.error(o), alert("An error occurred."), k(!1), u(!1)
                }
            },
            Y = async () => {
                if (!i) {
                    alert("Billing changes require an internet connection. You can keep using the rest of the app offline.");
                    return
                }
                if (!c || c.startsWith("local-")) {
                    alert("Please log in with a cloud account to manage billing.");
                    return
                }
                N(!0);
                try {
                    const o = await I.redirectToCustomerPortal(c);
                    o.success || (alert(o.error || "Failed to open billing portal."), N(!1))
                } catch (o) {
                    console.error(o), alert("An error occurred while opening the billing portal."), N(!1)
                }
            },
            J = async () => {
                if (!i) {
                    alert("Gift code redemption requires an internet connection. You can keep using the rest of the app offline.");
                    return
                }
                if (!c || c.startsWith("local-")) {
                    alert("Please log in with a cloud account to redeem gifted access.");
                    return
                }
                if (!z.trim()) {
                    alert("Enter a gifted membership code first.");
                    return
                }
                P(!0);
                try {
                    const o = await I.redeemMembershipCode(c, z.trim());
                    if (!o.success) {
                        alert(o.error || "Failed to redeem membership code.");
                        return
                    }
                    _(""), E("redeemed"), await h(), alert("Gifted access applied successfully.")
                } catch (o) {
                    console.error(o), alert("An error occurred while redeeming your code.")
                } finally {
                    P(!1)
                }
            };
        return e.jsxs("div", {
            className: "app-shell h-screen bg-[#f4f4f5] dark:bg-[#09090b] text-zinc-900 dark:text-white flex overflow-hidden selection:bg-brand-500/30",
            children: [e.jsx(X, {
                activeTab: t,
                setActiveTab: s,
                isDark: l,
                toggleTheme: r,
                mobileMenuOpen: a,
                setMobileMenuOpen: n
            }), e.jsxs("main", {
                className: "app-main-shell flex-1 relative flex flex-col h-screen overflow-hidden bg-[#f4f4f5] dark:bg-[#09090b]",
                children: [e.jsx(K, {
                    activeTab: "Settings",
                    mobileMenuOpen: a,
                    setMobileMenuOpen: n
                }), e.jsxs("div", {
                    className: "flex-1 overflow-y-auto custom-scrollbar density-app-shell-x pt-[var(--density-page-y)] lg:pt-[var(--density-page-y-lg)]",
                    children: [e.jsxs("div", {
                        className: "max-w-4xl mx-auto space-y-[var(--density-stack-gap-lg)] pb-20",
                        children: [e.jsxs("div", {
                            className: "mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4",
                            children: [e.jsxs("div", {
                                children: [e.jsx("h1", {
                                    className: "text-3xl font-display font-bold text-zinc-900 dark:text-white mb-2",
                                    children: "Subscription & Billing"
                                }), e.jsx("p", {
                                    className: "text-zinc-500 dark:text-zinc-400",
                                    children: "Manage your plan, billing details, and invoices."
                                })]
                            }), e.jsxs("button", {
                                onClick: () => me.getState().openModal(),
                                className: "group flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/5 dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/10 transition-all w-fit",
                                children: [e.jsx(oe, {
                                    className: "w-4 h-4 text-rose-500"
                                }), e.jsx("span", {
                                    className: "text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white flex items-center gap-1",
                                    children: "Why Premium?"
                                })]
                            })]
                        }), m === "success" && e.jsxs("div", {
                            className: "p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 animate-fade-in-up",
                            children: [e.jsx("div", {
                                className: "p-2 rounded-full bg-emerald-500/20",
                                children: e.jsx(M, {
                                    className: "w-5 h-5 text-emerald-500"
                                })
                            }), e.jsxs("div", {
                                children: [e.jsx("h4", {
                                    className: "font-bold text-emerald-500",
                                    children: "Payment Successful!"
                                }), e.jsx("p", {
                                    className: "text-sm text-emerald-400",
                                    children: "Thank you for upgrading. Your premium features are now active."
                                })]
                            })]
                        }), m === "redeemed" && e.jsxs("div", {
                            className: "p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 animate-fade-in-up",
                            children: [e.jsx("div", {
                                className: "p-2 rounded-full bg-emerald-500/20",
                                children: e.jsx(M, {
                                    className: "w-5 h-5 text-emerald-500"
                                })
                            }), e.jsxs("div", {
                                children: [e.jsx("h4", {
                                    className: "font-bold text-emerald-500",
                                    children: "Gifted Access Applied"
                                }), e.jsx("p", {
                                    className: "text-sm text-emerald-400",
                                    children: "Your membership code has been applied and your access is now up to date."
                                })]
                            })]
                        }), m === "cancelled" && e.jsxs("div", {
                            className: "p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center gap-3 animate-fade-in-up",
                            children: [e.jsx("div", {
                                className: "p-2 rounded-full bg-yellow-500/20",
                                children: e.jsx(L, {
                                    className: "w-5 h-5 text-yellow-500"
                                })
                            }), e.jsxs("div", {
                                children: [e.jsx("h4", {
                                    className: "font-bold text-yellow-500",
                                    children: "Payment Cancelled"
                                }), e.jsx("p", {
                                    className: "text-sm text-yellow-400",
                                    children: "No charges were made. You can upgrade anytime."
                                })]
                            })]
                        }), m === "portal" && e.jsxs("div", {
                            className: "p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center gap-3 animate-fade-in-up",
                            children: [e.jsx("div", {
                                className: "p-2 rounded-full bg-blue-500/20",
                                children: e.jsx(L, {
                                    className: "w-5 h-5 text-blue-500"
                                })
                            }), e.jsxs("div", {
                                children: [e.jsx("h4", {
                                    className: "font-bold text-blue-500",
                                    children: "Billing Updated"
                                }), e.jsx("p", {
                                    className: "text-sm text-blue-400",
                                    children: "We refreshed your membership state after returning from the Dodo portal."
                                })]
                            })]
                        }), !i && e.jsxs("div", {
                            className: "p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 animate-fade-in-up",
                            children: [e.jsx("h4", {
                                className: "font-bold text-blue-600 dark:text-blue-400",
                                children: "Offline mode"
                            }), e.jsx("p", {
                                className: "text-sm text-blue-600/90 dark:text-blue-300 mt-1",
                                children: "Billing, checkout, and invoice access are unavailable offline. Your local study data and the rest of the app still work."
                            })]
                        }), e.jsx(xe, {
                            onUpgrade: Z,
                            onManageBilling: Y,
                            onRedeemCode: J,
                            isUpgrading: g,
                            isManagingBilling: v,
                            isRedeemingCode: C,
                            isOnline: i,
                            giftCode: z,
                            onGiftCodeChange: _
                        }), e.jsx(he, {
                            isOnline: i,
                            onOpenPortal: Y,
                            isOpeningPortal: v
                        })]
                    }), e.jsx("div", {
                        className: "w-full mt-8 pointer-events-none select-none overflow-hidden leading-none",
                        children: e.jsx("div", {
                            className: "text-[10vw] sm:text-[14vw] md:text-[18vw] lg:text-[20vw] xl:text-[22vw] font-display font-bold text-black/[0.03] dark:text-white/[0.03] whitespace-nowrap text-center tracking-tight",
                            children: "ISOTOPEAI"
                        })
                    })]
                })]
            }), e.jsx(pe, {
                isOpen: b,
                onClose: () => u(!1),
                onConfirm: q,
                targetPlan: j,
                isLoading: g
            })]
        })
    };
export {
    Be as
    default
};